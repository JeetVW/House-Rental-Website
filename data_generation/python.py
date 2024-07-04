import psycopg2
from faker import Faker
import random
import requests

# Establish the connection to the database
conn = psycopg2.connect(
    dbname='hero',
    user='postgres',
    password='1020',
    host='localhost',
    port='5432'
)
cur = conn.cursor()

# Generate random data using Faker
fake = Faker()

# Number of records to generate
num_records = 50

# Function to get a random house image URL from Lorem Picsum
def get_random_image_url():
    response = requests.get('https://picsum.photos/200/300', allow_redirects=False)
    if response.status_code == 302:
        return response.headers['Location']
    return None

for _ in range(num_records):
    address = fake.address().replace('\n', ', ')
    price = round(random.uniform(50000, 500000), 2)
    description = fake.text()
    image_url = get_random_image_url()
    bedrooms = random.randint(1, 5)
    bathrooms = random.randint(1, 3)
    area = round(random.uniform(800, 5000), 2)
    available = fake.boolean()

    cur.execute("""
        INSERT INTO house_properties (address, price, description, image_url, bedrooms, bathrooms, area, available)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (address, price, description, image_url, bedrooms, bathrooms, area, available))

conn.commit()
cur.close()
conn.close()
