import requests
from bs4 import BeautifulSoup
import pandas as pd

# Base URL for pagination
BASE_URL = "https://devpost.com/software/popular?page={}"
MAX_PAGES = 80  

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def get_project_links():
    """Iterates through pages (up to MAX_PAGES) and collects all unique project links."""
    project_links = set()  # Using a set to prevent duplicates
    
    for page in range(1, MAX_PAGES + 1):  # Iterate through pages
        url = BASE_URL.format(page)
        print(f"Scraping: {url}")
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print("Error fetching page or no more pages available.")
            break

        soup = BeautifulSoup(response.text, 'html.parser')
        projects = soup.select("a.block-wrapper-link.fade.link-to-software")

        if not projects:
            print("No more projects found, stopping.")
            break

        # Extract project links and ensure uniqueness
        for project in projects:
            project_links.add(project["href"])

    return list(project_links)  # Convert set back to list for further processing

# Extract all unique project links (pages up to MAX_PAGES)
all_project_links = get_project_links()

# Save to CSV
df = pd.DataFrame(all_project_links, columns=["Project URL"])
csv_filename = "devpost_project_links.csv"
df.to_csv(csv_filename, index=False)

# Return the saved file path
csv_filename