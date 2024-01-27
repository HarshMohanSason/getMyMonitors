import requests
from bs4 import BeautifulSoup
import time

url = "https://www.flipkart.com/search?q=monitors&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off"

response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all <li> elements with the specified class
    li_elements = soup.find_all('li', class_='rgWa7D')

    # Check if any <li> elements were found
    if li_elements:
        # Iterate through the <li> elements and print their text content
        for li_element in li_elements:
            print("List Item Text:", li_element.text)

        # Add a delay between requests to avoid rate limiting
        time.sleep(1)  # Adjust the sleep duration as needed
    else:
        print("No <li> elements with the specified class found.")
else:
    print(f"Failed to retrieve data. Status code: {response.status_code}")
