import os
import re
import requests
import pandas as pd
from bs4 import BeautifulSoup
from groq import Groq
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

# Set up Groq API client with your API key
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# New function to get project links from the text file (one URL per line)
def get_project_links():
    links = []
    try:
        with open("scrapingscripts/devpost_project_links.txt", "r", encoding="utf-8") as f:
            for line in f:
                url = line.strip()
                if url:
                    links.append(url)
        print(f"Total Unique Projects Found: {len(links)}")
    except Exception as e:
        print(f"Error reading devpost_project_links.txt: {e}")
    return links

# Retrieve all project links from the text file
all_project_links = get_project_links()

# Updated function to retrieve the first .png or .jpg URL (images) and if not found, a youtube video URL
def get_first_image_url_after_app_details(soup):
    article = soup.find('article', id="app-details")
    if article:
        # First, try to find an image URL within anchor tags
        a_tags = article.find_all('a', href=True)
        for a in a_tags:
            href = a['href']
            if href.lower().endswith(('.png', '.jpg')):
                return href
        # If no image found, search for iframe tags with a YouTube URL
        iframe_tags = article.find_all('iframe', src=True)
        for iframe in iframe_tags:
            src = iframe['src']
            if 'youtube' in src.lower():
                return src
    return "no image"

# Function to scrape data from the page
def scrape_page(url):
    # Send HTTP request
    response = requests.get(url)
    
    # If request is successful
    if response.status_code == 200:
        # Parse the page content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract relevant data
        title_elem = soup.find('h1', {'id': 'app-title'})
        title = title_elem.text.strip() if title_elem else "No Title"
        description_elem = soup.find('p', {'class': 'large'})
        description = description_elem.text.strip() if description_elem else "No Description"
        
        # Extract "built with" technologies
        built_with_elements = soup.select("span.cp-tag")
        technologies_used = ", ".join([tech.text.strip() for tech in built_with_elements])
        
        # Extract Winner label
        winner_element = soup.select_one("div.software-list-content ul.no-bullet span")
        winner_label = winner_element.get_text().strip() if winner_element else "No Award"
        
        # Retrieve first image URL after "app-details"
        image_url = get_first_image_url_after_app_details(soup)
        
        # Prepare the data, now including the post URL
        post_data = {
            "title": title,
            "description": description,
            "Technology": technologies_used,
            "Winners": winner_label,
            "image_url": image_url,
            "url": url
        }

        return post_data
    else:
        print("Failed to retrieve the page.")
        return None

# Function to use Groq API for summary and categorization
def generate_summary(post_data):
    prompt = f"""
    Given the following information, generate a concise and informative summary of the project description, avoiding mention of word limits. Categorize the project into a primary and secondary category. Do not reference the instruction text in your response.
    
    Title: {post_data['title']}
    Description: {post_data['description']}
    
    Choose Categories STRICTLY from the list below. Do NOT add additional categories or duplicate categories. Select the primary category that is MOST relevant to the project, and the secondary category that is the NEXT MOST relevant.
    
    Categories:
    Mobile Apps
    Web Apps
    Desktop Apps
    Game Development
    Virtual Reality (VR)
    Augmented Reality (AR)
    AI/Artificial Intelligence
    Machine Learning (ML)
    Natural Language Processing (NLP)
    Robotics
    IoT (Internet of Things)
    Wearables
    Bio-Tech/Health-Tech
    FinTech (Financial Technology)
    EduTech (Educational Technology)
    Blockchain/Web3
    Cybersecurity
    Data Science/Analytics
    Cloud Computing
    Big Data
    Environmental Tech
    Digital Art
    Social Impact
    Hardware Development (Arduino/Raspberry Pi)
    Embedded Systems
    Quantum Computing
    3D Printing
    Chatbots
    Geospatial Data/GIS
    Supply Chain/Logistics
    LegalTech
    GovTech
    Marketing Tech
    Human-Computer Interaction
    Content Creation
    AgriTech
    Energy Tech
    Transportation Tech
    
    ### Example of a correctly formatted response:
    Primary Category: FinTech (Financial Technology) @ Secondary Category: Blockchain/Web3 @ Summary: SuperPay is a digital finance platform enabling trust-less recurring cryptocurrency payments, making online payments mainstream with real-time transactions, utilizing blockchain technology for secure and efficient payments.
    
    Return the output STRICTLY in this format: 
    Primary Category: <primary_category> @ Secondary Category: <secondary_category> @ Summary: <summary>
    """
    
    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "user", "content": prompt}
        ],
        model="llama-3.3-70b-versatile",
    )
    
    output = chat_completion.choices[0].message.content.strip()
    print(output)
    
    output_parts = output.split("@")
    post_data["primary_category"] = output_parts[0].split(":")[1].strip()
    post_data["secondary_category"] = output_parts[1].split(":")[1].strip()
    post_data["summary"] = output_parts[2].split(":")[1].strip()
    
    return post_data

# Function to save data to CSV
def save_to_csv(post_data):
    df = pd.DataFrame([post_data])
    try:
        df.to_csv("projects.csv", mode="a", header=not os.path.exists("projects.csv"), index=False)
        print(f"Saved project: {post_data['title']}")
    except Exception as e:
        print(f"Failed to save project: {e}")

# Main function to loop through all projects
def main():
    i = 0;
    for project_url in all_project_links:
        i = i + 1
        print(f"Processing: {project_url}")
        post_data = scrape_page(project_url)
        if post_data:
            post_data_with_summary = generate_summary(post_data)
            save_to_csv(post_data_with_summary)
        if i == 500:
            break
        
if __name__ == '__main__':
    main()
