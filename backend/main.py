from scrape_github import scrape_repo
from generate_readme import generate_readme

def get_additional_context():
    """
    Prompt the user for additional context to assist with README generation.
    """
    print("\nYou can provide additional context to help generate a more accurate README.")
    print("For example, you can describe the purpose of the repository, key features, or specific instructions.")
    print("If you don't provide additional context, the README might be generated vaguely.")
    additional_context = input("Enter additional context (or press Enter to skip): ").strip()
    return additional_context if additional_context else None


def main():
    repo_url = input("Enter the GitHub repository URL (e.g., https://github.com/owner/repo): ")
    parts = repo_url.strip("/").split("/")
    owner = parts[-2]
    repo = parts[-1]

    # Fetch repository details and contents
    repo_details, repo_contents = scrape_repo(repo_url)
    if not repo_details or not repo_contents:
        return

    # Get additional context from the user
    additional_context = get_additional_context()

    # Generate and save a new README.md
    new_readme_content = generate_readme(repo_details, repo_contents, additional_context)
    if not new_readme_content:
        return


if __name__ == "__main__":
    main()