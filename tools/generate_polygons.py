import json
import math
import os

# Helper to generate realistic irregular polygon vertices around center
# in [lng, lat] format for GeoJSON compatibility, and [lat, lng] for internal representation
def generate_polygon(center_lat, center_lng, avg_radius_meters, num_sides=8, shape_preset='pit'):
    # Earth radius in meters
    R = 6378137.0
    
    # Radians factors for irregular shape
    # Pits tend to be oval/elongated along strike
    # Dumps/Disposals tend to be trapezoidal/fans
    # Facilities (Office/Workshop) tend to be rectangular
    points_lnglat = []
    points_latlng = []
    
    # Custom aspect ratios and offsets based on zone characteristics
    if shape_preset == 'pit':
        # Elongated oval along north-northwest strike
        r_factors = [1.3, 1.15, 0.9, 0.75, 1.25, 1.2, 0.85, 0.7]
    elif shape_preset == 'dumping':
        # Fan/wedge shaped toward one side
        r_factors = [1.1, 1.25, 1.2, 1.0, 0.8, 0.65, 0.75, 0.95]
    elif shape_preset == 'facility':
        # Rectangular/rounded block
        r_factors = [1.1, 0.9, 1.1, 0.9, 1.1, 0.9, 1.1, 0.9]
    elif shape_preset == 'wmp':
        # Compact irregular pond shape
        r_factors = [1.05, 0.95, 1.1, 0.85, 1.0, 0.9, 1.05, 0.9]
    else:
        r_factors = [1.0, 1.05, 0.95, 1.1, 0.9, 1.0, 1.05, 0.95]
        
    for i in range(num_sides):
        angle = (2 * math.pi * i) / num_sides
        # Apply radial distance with irregularity factor
        dist = avg_radius_meters * r_factors[i % len(r_factors)]
        
        d_lat = (dist * math.cos(angle)) / R
        d_lng = (dist * math.sin(angle)) / (R * math.cos(math.pi * center_lat / 180.0))
        
        pt_lat = round(center_lat + (d_lat * 180.0 / math.pi), 7)
        pt_lng = round(center_lng + (d_lng * 180.0 / math.pi), 7)
        
        points_lnglat.append([pt_lng, pt_lat])
        points_latlng.append([pt_lat, pt_lng])
        
    # Close polygon
    points_lnglat.append(points_lnglat[0])
    
    return points_lnglat, points_latlng

# Load current hauling_geofences.json
json_path = 'D:/Semester 5/hpu/database/data/hauling_geofences.json'
with open(json_path, 'r', encoding='utf-8') as f:
    items = json.load(f)

geojson_features = []

for item in items:
    gtype = item.get('type')
    lat = item['latitude']
    lng = item['longitude']
    radius = item.get('radius', 150)
    name = item['name']
    
    if gtype == 'road':
        # STA Checkpoint point
        item['geometry_type'] = 'point'
        item['coordinates_json'] = json.dumps([[lat, lng]])
    else:
        # Determine preset
        if 'PIT' in name or gtype == 'loading':
            preset = 'pit'
        elif 'PORT' in name or 'DUMP' in name or 'IPD' in name or 'OPD' in name or gtype == 'dumping':
            preset = 'dumping'
        elif 'WMP' in name or 'KOLAM' in name:
            preset = 'wmp'
        elif any(k in name for k in ['OFFICE', 'MESS', 'WORKSHOP', 'PARKIR']):
            preset = 'facility'
        else:
            preset = 'custom'
            
        pts_lnglat, pts_latlng = generate_polygon(lat, lng, radius, num_sides=8, shape_preset=preset)
        
        item['geometry_type'] = 'polygon'
        item['coordinates_json'] = json.dumps(pts_latlng)
        
        geojson_features.append({
            'type': 'Feature',
            'properties': {
                'id': item.get('name'),
                'name': name,
                'type': gtype,
                'color': item.get('color', '#3B82F6'),
                'radius': radius,
                'material': item.get('material', 'OB'),
                'address': item.get('address', '')
            },
            'geometry': {
                'type': 'Polygon',
                'coordinates': [pts_lnglat]
            }
        })

# Save updated hauling_geofences.json
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2)

print(f"Updated {len(items)} geofence entries with polygon coordinates_json.")

# Also generate a standalone GeoJSON file for map rendering
geofences_geojson = {
    'type': 'FeatureCollection',
    'features': geojson_features
}

os.makedirs('D:/Semester 5/hpu/public/geojson', exist_ok=True)
geojson_out = 'D:/Semester 5/hpu/public/geojson/operational_geofences.geojson'
with open(geojson_out, 'w', encoding='utf-8') as f:
    json.dump(geofences_geojson, f, indent=2)

print(f"Exported operational_geofences.geojson with {len(geojson_features)} polygon features.")
