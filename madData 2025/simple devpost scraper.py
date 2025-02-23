from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
import time
import hashlib
import re

# List of hackathon links (Replace with actual extracted links)
hackathon_links = [
    "https://treehacks-2025.devpost.com",  
    "https://hackthenorth2024.devpost.com"  
]

def categorize_project(technologies):
    """Assigns a project category based on the technologies used."""
    categories = {
        "AI": ["tensorflow", "pytorch", "openai", "machine learning", "deep learning"],
        "Web": ["react", "django", "flask", "html", "css", "javascript", "next.js"],
        "Mobile": ["flutter", "react native", "swift", "kotlin", "android", "ios"],
        "Blockchain": ["solidity", "ethereum", "web3", "polygon", "nft", "smart contract"],
        "IoT": ["raspberry pi", "arduino", "iot", "hardware"],
        "Game": ["unity", "unreal engine", "godot", "game development"]
    }

    technologies = technologies.lower()
    for category, keywords in categories.items():
        if any(keyword in technologies for keyword in keywords):
            return category
    return "Other"  # Default category if no match is found

def extract_year_from_url(hackathon_url):
    """Extracts the year from a hackathon URL."""
    match = re.search(r"(\d{4})", hackathon_url)
    return match.group(1) if match else "Unknown"

def generate_project_id(project_name, project_url):
    """Generates a unique ID based on project name and URL using SHA256 hash."""
    return hashlib.sha256(f"{project_name}{project_url}".encode()).hexdigest()[:10]

def get_project_links(hackathon_url, driver):
    """Finds and clicks the 'View Projects' button to get project links."""
    driver.get(hackathon_url)
    time.sleep(2)

    try:
        # Click the "View Projects" button
        view_projects_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "a.button.radius.expand.grey.mb-3"))
        )
        project_page_url = view_projects_btn.get_attribute("href")
        driver.get(project_page_url)
        time.sleep(2)
    except:
        return []

    # Extract project links from the projects page
    project_links = []
    try:
        project_containers = driver.find_elements(By.CSS_SELECTOR, "div.large-4.small-12.columns.gallery-item")
        for container in project_containers:
            link_element = container.find_element(By.CSS_SELECTOR, "a.block-wrapper-link.fade.link-to-software")
            project_url = link_element.get_attribute("href")
            if project_url:
                project_links.append(project_url)
    except:
        pass

    return project_links

def extract_project_details(project_url, driver, hackathon_url):
    """Extracts key project details from a project page."""
    driver.get(project_url)
    time.sleep(2)

    project_data = {
        "id": "", "Project Name": "", "Category": "", "Built With": "", 
        "Group Members": 0, "Year": extract_year_from_url(hackathon_url), 
        "Description": "", "Project URL": project_url
    }

    try:
        # Extract Project Name
        name_element = driver.find_element(By.ID, "app-title")
        project_data["Project Name"] = name_element.text.strip()
        project_data["id"] = generate_project_id(project_data["Project Name"], project_url)
    except:
        pass

    try:
        # Extract "Built With" technologies
        built_with_section = driver.find_elements(By.CSS_SELECTOR, "span.cp-tag")
        technologies_used = ", ".join([tech.text.strip() for tech in built_with_section])
        project_data["Built With"] = technologies_used
        project_data["Category"] = categorize_project(technologies_used)
    except:
        pass

    try:
        # Find the team section and count the number of 'li' inside 'ul'
        team_section = driver.find_element(By.ID, "app-team")
        team_list = team_section.find_element(By.TAG_NAME, "ul")
        members = team_list.find_elements(By.TAG_NAME, "li")
        project_data["Group Members"] = len(members)
    except:
        pass

    try:
        # Extract Project Description
        description_element = driver.find_element(By.CSS_SELECTOR, "div#app-details-left p")
        project_data["Description"] = description_element.text.strip()
    except:
        pass

    return project_data

def get_hackathon_projects():
    """Main function to extract project details from multiple hackathons."""
    # Set up Selenium WebDriver
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    all_projects = []

    for hackathon_url in hackathon_links:
        project_links = get_project_links(hackathon_url, driver)

        for project_url in project_links:
            project_data = extract_project_details(project_url, driver, hackathon_url)
            all_projects.append(project_data)

    driver.quit()

    # Convert to DataFrame
    global projects_df
    projects_df = pd.DataFrame(all_projects)

    return projects_df

# Run the function to populate the dataframe (for Jupyter Notebook)
projects_df = get_hackathon_projects()
