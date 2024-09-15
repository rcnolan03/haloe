import pandas as pd
import numpy as np
import requests
import math
import csv
import json
import sys  # Import sys to read command-line arguments


def normalize(series):
    # Avoid division by zero if the series is constant or empty
    if series.max() == series.min():
        return pd.Series([0] * len(series), index=series.index)  # Return 0 if all values are the same
    return (series - series.min()) / (series.max() - series.min())

def normalize_risk(crime_data):
    crime_data['risk_score'] = 1
    return crime_data

def get_nearby_crimes(segment, crime_data, radius=0.001):
    lat, lon = segment
    nearby_crimes = crime_data[
        (crime_data['Latitude'] >= lat - radius) & (crime_data['Latitude'] <= lat + radius) &
        (crime_data['Longitude'] >= lon - radius) & (crime_data['Longitude'] <= lon + radius)
    ]
    return nearby_crimes

def haversine_distance(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    R = 6371
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    meters = R * c * 1000
    return meters

def calculate_route_distance(route):
    total_distance = 0
    for i in range(len(route) - 1):
        total_distance += haversine_distance(route[i], route[i + 1])
    return total_distance

def route_segments(route):
    return route

def get_possible_routes(startLo, endLo):
    url = "https://atlas.microsoft.com/route/directions/json"

    params = {
        'api-version': '1.0',
        'subscription-key': subscription_key,
        'query': f'{startLo[0]},{startLo[1]}:{endLo[0]},{endLo[1]}',
        'maxAlternatives': 4,
        'routeType': 'fastest',
        'travelMode': 'pedestrian',
        'computeTravelTimeFor': 'all',
        'instructionsType': 'coded',
        'language': 'en-US'
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return []

    data = response.json()

    possible_routes = []

    for route in data['routes']:
        route_coords = []
        for leg in route['legs']:
            for point in leg['points']:
                route_coords.append((point['latitude'], point['longitude']))
        possible_routes.append(route_coords)

    return possible_routes

def calculate_route_risk(route):
    total_risk = 0
    for segment in route_segments(route):
        nearby_crimes = get_nearby_crimes(segment, crime_data)
        segment_risk = nearby_crimes['risk_score'].sum()
        total_risk += segment_risk
    return total_risk

def get_optimal_route(possible_routes):
    route_risks = []
    route_distances = []

    for route in possible_routes:
        risk = calculate_route_risk(route)
        distance = calculate_route_distance(route)
        route_risks.append(risk)
        route_distances.append(distance)

    # Normalize and handle NaN values
    normalized_risks = normalize(pd.Series(route_risks)).fillna(0)
    normalized_distances = normalize(pd.Series(route_distances)).fillna(0)

    route_scores = []
    for i in range(len(possible_routes)):
        composite_score = (inputRisk * normalized_risks[i]) + (inputDist * normalized_distances[i])
        if math.isnan(composite_score):  # Handle NaN values
            composite_score = 0
        route_scores.append({'route': possible_routes[i], 'score': composite_score})

    optimal_route = min(route_scores, key=lambda x: x['score'])
    return optimal_route

# Hardcoded inputs for backend use (can be set dynamically in the future)
inputRisk = 0.999
inputDist = 0.001
startLo = (41.791896, -87.603115) # Hard code start location
endLo = tuple(map(float, sys.argv[2].split(',')))

crime_data = pd.read_csv('Chi Crime Data.csv')
crime_data = normalize_risk(crime_data)
subscription_key = "1fPtWYE6gb3j5AB6h9KVNNDBQTIonKyQ4GbgNMIjz5ewVleUF8t5JQQJ99AIACYeBjF5Rib6AAAgAZMPlJby"

possible_routes = get_possible_routes(startLo, endLo)

if possible_routes:
    optimal_route = get_optimal_route(possible_routes)
    # Output only the route coordinates
    print(json.dumps(optimal_route['route']))  # Output only route as JSON
else:
    print(json.dumps({'error': 'No routes found.'}))
