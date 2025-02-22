import os
import requests
from groq import Groq 
from dotenv import load_dotenv

load_dotenv()

# GitHub API base URL
GITHUB_API_URL = "https://api.github.com"

# Groq API key (replace with your own key or set as environment variable)
GROQ_API_KEY = os.getenv('GROQ_API_KEY')

def get_repo_details(owner, repo):
    """
    Fetch repository details to check if it's public or private.
    """
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def get_repo_contents(owner, repo, path=""):
    """
    Fetch the contents of a GitHub repository using the GitHub API.
    Only works for public repositories.
    """
    url = f"{GITHUB_API_URL}/repos/{owner}/{repo}/contents/{path}"
    headers = {
        "Accept": "application/vnd.github.v3+json"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

def read_readme(contents):
    """
    Find and read the README.md file from the repository contents.
    """
    for item in contents:
        if item["type"] == "file" and item["name"].lower() == "readme.md":
            readme_url = item["download_url"]
            response = requests.get(readme_url)
            if response.status_code == 200:
                return response.text
            else:
                print(f"Error: Failed to download README.md - {response.status_code}")
                return None
    print("Error: README.md not found in the repository.")
    return None

def generate_readme_with_groq(readme_content):
    """
    Use Groq's API to generate a new README.md based on the existing one.
    """
    # Initialize Groq client
    client = Groq(api_key=GROQ_API_KEY)

    # Define the prompt for the AI
    prompt = f"""
    The following is the content of a README.md file from a GitHub repository:

    {readme_content}

    Rewrite this README.md to follow best practices and guidelines for a professional GitHub repository.
    Include the following sections if they are not already present:
    - Project Title
    - Description
    - Installation Instructions
    - Usage
    - Contributing Guidelines
    - License

    Make sure the content is clear, concise, and well-structured.
    """

    # Call the Groq API
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",  # Use the appropriate Groq model
        max_tokens=1000,
    )

    # Extract the generated README content
    new_readme_content = chat_completion.choices[0].message.content
    return new_readme_content

def save_readme(content, filename="README.md"):
    """
    Save the generated README content to a file in the same folder as the script.

    """

    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # Create the full path for the README file
    readme_path = os.path.join(script_dir, filename)

    with open(readme_path, "w") as file:
        file.write(content)
    print(f"README file saved as {filename}")

def main():
    # Input GitHub repository details
    repo_url = input("Enter the GitHub repository URL (e.g., https://github.com/owner/repo): ")

    # Extract owner and repo name from the URL
    parts = repo_url.strip("/").split("/")
    owner = parts[-2]
    repo = parts[-1]

    # Check if the repository is public
    repo_details = get_repo_details(owner, repo)
    if not repo_details:
        print("Failed to fetch repository details.")
        return

    if repo_details.get("private", True):
        print("Error: This script only supports public repositories. The provided repository is private.")
        return

    # Fetch repository contents
    contents = get_repo_contents(owner, repo)
    if not contents:
        print("Failed to fetch repository contents.")
        return

    # Read the existing README.md
    readme_content = read_readme(contents)
    if not readme_content:
        return

    # Generate a new README.md using Groq
    new_readme_content = generate_readme_with_groq(readme_content)
    if not new_readme_content:
        print("Failed to generate new README.md.")
        return

    # Save the new README.md
    save_readme(new_readme_content)

if __name__ == "__main__":
    main()