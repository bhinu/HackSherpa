import os
import requests

GITHUB_API_URL = "https://api.github.com"


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


def scrape_repo(repo_url):
    """
    Scrape repository details and contents from GitHub.
    """
    parts = repo_url.strip("/").split("/")
    owner = parts[-2]
    repo = parts[-1]

    # Fetch repository details
    repo_details = get_repo_details(owner, repo)
    if not repo_details:
        print("Failed to fetch repository details.")
        return None, None

    if repo_details.get("private", True):
        print("Error: This script only supports public repositories. The provided repository is private.")
        return None, None

    # Fetch repository contents
    repo_contents = get_repo_contents(owner, repo)
    if not repo_contents:
        print("Failed to fetch repository contents.")
        return None, None

    return repo_details, repo_contents