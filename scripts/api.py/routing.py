import pandas as pd 
import numpy as np
import requests
import math
import csv 

from azure.core.credentials import AzureKeyCredential

#inputs for weights and locations
inputRisk = float(.999)
inputDist = float(.001)

#inputs for start and end locations
#Union S and Navy P
#startLo_input = (41.879297, -87.640300)
#endLo_input = (41.891149, -87.606453)

#uchi 
startLo_input = (41.791896, -87.603115)

#gheto wendys
endLo_input = (41.794623, -87.632608)

#MSI 
#endLo_input = (41.792154, -87.585237)


# Function to normalize values between 0 and 1
def normalize(series):
    return (series - series.min()) / (series.max() - series.min())

# Function to normalize and assign risk scores
def normalize_risk(crime_data):
    # Define severity scores for each crime type
    crime_severity = {
        'HOMICIDE': 10,
        'SEX OFFENSE': 10,
        'KIDNAPPING': 10,
        'ASSAULT': 7,
        'ROBBERY': 7,
        'BATTERY': 7,
        'BURGLARY': 5,
        'THEFT': 5
    }

    # Assign risk scores based on the crime type
    crime_data['risk_score'] = crime_data['Primary Type'].map(crime_severity).fillna(1)
    
    return crime_data

# Function to get nearby crimes for a route segment
def get_nearby_crimes(segment, crime_data, radius=0.001):
    # segment is a coordinate tuple (latitude, longitude)
    lat, lon = segment
    nearby_crimes = crime_data[
        (crime_data['Latitude'] >= lat - radius) & (crime_data['Latitude'] <= lat + radius) &
        (crime_data['Longitude'] >= lon - radius) & (crime_data['Longitude'] <= lon + radius)
    ]
    return nearby_crimes

# Function to calculate the Haversine distance between two coordinates
def haversine_distance(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371  # Earth radius in kilometers
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    meters = R * c * 1000  # Convert to meters
    return meters

# Function to calculate the total distance of a route
def calculate_route_distance(route):
    total_distance = 0
    for i in range(len(route) - 1):
        total_distance += haversine_distance(route[i], route[i + 1])
    return total_distance

# Function to get route segments (in this case, the route points themselves)
def route_segments(route):
    return route

# Convert input strings to coordinate tuples
startLo = startLo_input
endLo = endLo_input

# Load crime data
crime_data = pd.read_csv('Chi Crime Data.csv')

# Normalize and assign risk scores
crime_data = normalize_risk(crime_data)

# Azure Maps REST API subscription key
subscription_key = "1fPtWYE6gb3j5AB6h9KVNNDBQTIonKyQ4GbgNMIjz5ewVleUF8t5JQQJ99AIACYeBjF5Rib6AAAgAZMPlJby"

# Function to get possible routes from Azure Maps REST API
def get_possible_routes(startLo, endLo):
    import requests

    url = "https://atlas.microsoft.com/route/directions/json"

    params = {
        'api-version': '1.0',
        'subscription-key': subscription_key,
        'query': f'{startLo[0]},{startLo[1]}:{endLo[0]},{endLo[1]}',
        'maxAlternatives': 4,  # Get 3 routes: 1 primary and 2 alternatives
        'routeType': 'fastest',
        'travelMode': 'pedestrian',  # Use 'car' or 'pedestrian' as needed
        'computeTravelTimeFor': 'all',
        'instructionsType': 'coded',
        'language': 'en-US'
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        print(f"Error fetching routes: {response.status_code}")
        print(response.text)
        return []

    data = response.json()

    possible_routes = []

    for route in data['routes']:
        route_coords = []
        # Each route may have multiple legs
        for leg in route['legs']:
            # Each leg has 'points' which are the route coordinates
            for point in leg['points']:
                route_coords.append((point['latitude'], point['longitude']))
        possible_routes.append(route_coords)

    return possible_routes

# Function to calculate the risk of a route
def calculate_route_risk(route):
    total_risk = 0
    for segment in route_segments(route):
        nearby_crimes = get_nearby_crimes(segment, crime_data)
        segment_risk = nearby_crimes['risk_score'].sum()
        total_risk += segment_risk
    return total_risk

# Function to get the optimal route based on weights

def get_optimal_route(possible_routes):
    route_risks = []
    route_distances = []

    # Calculate risks and distances for each route
    for route in possible_routes:
        risk = calculate_route_risk(route)
        distance = calculate_route_distance(route)
        route_risks.append(risk)
        route_distances.append(distance)

    # Normalize risks and distances
    normalized_risks = normalize(pd.Series(route_risks))
    normalized_distances = normalize(pd.Series(route_distances))

    # Calculate composite scores and find the optimal route
    route_scores = []
    for i in range(len(possible_routes)):
        composite_score = (inputRisk * normalized_risks[i]) + (inputDist * normalized_distances[i])
        route_scores.append({'route': possible_routes[i], 'score': composite_score})
    optimal_route = min(route_scores, key=lambda x: x['score'])
    print("Normalized risk:", normalized_risks)
    return optimal_route

# Get possible routes
possible_routes = get_possible_routes(startLo, endLo)

if not possible_routes: 
    print("No routes found.")
else:
    # Find the optimal route
    optimal_route = get_optimal_route(possible_routes)

    # Output the optimal route
    print("\nOptimal Route Coordinates:")
    for coord in optimal_route['route']:
        print(coord)

    print(f"\nComposite Score: {optimal_route['score']}")

# New method to flip coordinates and save to CSV
def save_optimal_route(optimal_route):
    with open('optimal_route.csv', mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['latitude', 'longitude'])  # Write the header
        writer.writerows(optimal_route['route'])    # Write the route coordinates

save_optimal_route(optimal_route)

#if my python script returns a disctionary of latitudes and longitudes, how can I convert this to be usable for the node backend?

#this is good, however after the risk is assigned to each segment lets generate a visual heat map using the same azure services. Lets also do this in a seperate file so their is no confusion between the route generation and visual elemtn of the heat map. 
#The generation of the heatmap is within a wider travel safety app. Rather than handling the presentation of the map, lets write a file in vsCode which packages the map data to pass it to the Javascript front end 