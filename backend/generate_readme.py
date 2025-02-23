import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')


def generate_readme_with_groq(repo_details, repo_contents, additional_context=None):
    """
    Use Groq's API to generate a new README.md based on the repository details, contents, and additional context.
    """
    # Initialize Groq client
    client = Groq(api_key=GROQ_API_KEY)

    # Prepare a summary of the repository contents
    content_summary = "Repository Contents:\n"
    for item in repo_contents:
        if item["type"] == "file":
            content_summary += f"- File: {item['name']}\n"
        elif item["type"] == "dir":
            content_summary += f"- Directory: {item['name']}\n"

    # Define the prompt for the AI
    prompt = f"""
    Create a professional README.md file for a GitHub repository based on the following details:

    Repository Name: {repo_details['name']}
    Repository Description: {repo_details.get('description', 'No description provided.')}
    Repository URL: {repo_details['html_url']}

    {content_summary}
    """

    # Include additional context if provided
    if additional_context:
        prompt += f"""
    Additional Context Provided by the User:
    {additional_context}
    """
    else:
        prompt += """
    Note: No additional context was provided by the user. The README might be generated vaguely.
    """

    prompt += """
    Include the following sections:
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
    print(f"README file saved as {readme_path}")


def generate_readme(repo_details, repo_contents, additional_context=None):
    """
    Generate and save a new README.md file.
    """
    # Generate a new README.md using Groq
    new_readme_content = generate_readme_with_groq(repo_details, repo_contents, additional_context)
    if not new_readme_content:
        print("Failed to generate new README.md.")
        return None

    # Save the new README.md
    save_readme(new_readme_content)
    return new_readme_content