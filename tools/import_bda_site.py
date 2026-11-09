import json
import math
import os

EARTH_RADIUS = 6378137.0

def create_polygon_ring(lat, lng, radius_m, num_points=8, seed_offset=0):
    ring = []
    for i in range(num_points):
        angle = (2.0 * math.pi * i) / num_points
        # sedikit variasi agar menyerupai bukaan tambang realistis
        variation = 0.85 + 0.3 * math.sin(angle * 3 + seed_offset)
        r = radius_m * variation
        dLat = (r * math.cos(angle)) / EARTH_RADIUS
        dLng = (r * math.sin(angle)) / (EARTH_RADIUS * math.cos(math.pi * lat / 180.0))
        pt_lat = round(lat + (dLat * 180.0 / math.pi), 7)
        pt_lng = round(lng + (dLng * 180.0 / math.pi), 7)
        ring.append([pt_lat, pt_lng])
    return ring

def main():
    bda_geojson_path = r'C:\Users\muham\Downloads\hpuu\Jalan Hauling BDA.geojson'
    if not os.path.exists(bda_geojson_path):
        print(f"Error: {bda_geojson_path} not found")
        return

    with open(bda_geojson_path, 'r', encoding='utf-8') as f:
        bda_data = json.load(f)

    # 1. Ekstrak LineString rute hauling BDA
    line_feat = next(f for f in bda_data['features'] if f['geometry']['type'] == 'LineString')
    bda_route_coords = line_feat['geometry']['coordinates']
    print(f"BDA Route LineString: {len(bda_route_coords)} titik koordinat")

    # Update public/geojson/hauling_routes.geojson
    routes_path = r'D:\Semester 5\hpu\public\geojson\hauling_routes.geojson'
    with open(routes_path, 'r', encoding='utf-8') as f:
        routes_data = json.load(f)

    # Cek apakah rute BDA sudah ada
    routes_data['features'] = [f for f in routes_data['features'] if f.get('properties', {}).get('site') != 'BDA']
    
    # Tambahkan rute BDA
    routes_data['features'].append({
        "type": "Feature",
        "properties": {
            "name": "Jalur Hauling BDA Barito (45.2 KM)",
            "site": "BDA",
            "stroke": "#EA580C",
            "stroke-width": 4,
            "stroke-opacity": 0.95,
            "distance_km": 45.2,
            "total_points": len(bda_route_coords)
        },
        "geometry": {
            "type": "LineString",
            "coordinates": bda_route_coords
        }
    })

    with open(routes_path, 'w', encoding='utf-8') as f:
        json.dump(routes_data, f, indent=2)
    print(f"Berhasil memperbarui {routes_path} (Total rute: {len(routes_data['features'])})")

    # 2. Definisikan Zona Operasional Fisik untuk Site BDA
    bda_operational = [
        {
            "name": "PORT JETTY BDA (DUMPING AREA)",
            "site": "BDA",
            "type": "dumping",
            "latitude": -1.142373,
            "longitude": 114.877649,
            "radius": 400,
            "color": "#8B5CF6",
            "address": "Port Dermaga Sungai Barito KM 0, Site BDA",
            "material": "COAL",
            "geometry_type": "polygon",
            "seed": 1.1
        },
        {
            "name": "ROM COAL STOCKPILE BDA",
            "site": "BDA",
            "type": "dumping",
            "latitude": -1.144293,
            "longitude": 114.881147,
            "radius": 320,
            "color": "#0F172A",
            "address": "Stockpile & Timbunan Batubara KM 0.6, Site BDA",
            "material": "COAL",
            "geometry_type": "polygon",
            "seed": 2.2
        },
        {
            "name": "WEIGHBRIDGE BDA (KM 0.5)",
            "site": "BDA",
            "type": "custom",
            "latitude": -1.143551,
            "longitude": 114.881686,
            "radius": 150,
            "color": "#3B82F6",
            "address": "Jembatan Timbang Truk Hauling KM 0.5, Site BDA",
            "material": "COAL",
            "geometry_type": "polygon",
            "seed": 3.3
        },
        {
            "name": "CHECKPOINT KM 15 BDA",
            "site": "BDA",
            "type": "custom",
            "latitude": -1.129237,
            "longitude": 114.975678,
            "radius": 180,
            "color": "#EA580C",
            "address": "Pos Kontrol Keamanan STA 15+000, Site BDA",
            "material": "COAL",
            "geometry_type": "polygon",
            "seed": 4.4
        },
        {
            "name": "WORKSHOP & OFFICE HPU BDA (KM 22)",
            "site": "BDA",
            "type": "parking",
            "latitude": -1.113716,
            "longitude": 115.019432,
            "radius": 350,
            "color": "#2563EB",
            "address": "Fasilitas Workshop & Kantor HPU KM 22, Site BDA",
            "material": "OB",
            "geometry_type": "polygon",
            "seed": 5.5
        },
        {
            "name": "REST AREA & REFUELING BDA (KM 22)",
            "site": "BDA",
            "type": "parking",
            "latitude": -1.112498,
            "longitude": 115.020012,
            "radius": 250,
            "color": "#059669",
            "address": "Tempat Istirahat Driver & Stasiun Pengisian BBM KM 22, Site BDA",
            "material": "OB",
            "geometry_type": "polygon",
            "seed": 6.6
        },
        {
            "name": "CHECKPOINT KM 30 BDA",
            "site": "BDA",
            "type": "custom",
            "latitude": -1.104662,
            "longitude": 115.068044,
            "radius": 180,
            "color": "#EA580C",
            "address": "Pos Pantau Kecepatan & Radio STA 30+000, Site BDA",
            "material": "COAL",
            "geometry_type": "polygon",
            "seed": 7.7
        },
        {
            "name": "PIT FRONT BDA (LOADING POINT)",
            "site": "BDA",
            "type": "loading",
            "latitude": -1.130544,
            "longitude": 115.161056,
            "radius": 450,
            "color": "#10B981",
            "address": "Front Loading Tambang Utama STA 45+192, Site BDA",
            "material": "COAL",
            "geometry_type": "polygon",
            "seed": 8.8
        },
        {
            "name": "DISPOSAL OB BDA (BLOK UTARA)",
            "site": "BDA",
            "type": "dumping",
            "latitude": -1.124559,
            "longitude": 115.163070,
            "radius": 400,
            "color": "#8B5CF6",
            "address": "Area Pembuangan Overburden Blok Utara KM 44, Site BDA",
            "material": "OB",
            "geometry_type": "polygon",
            "seed": 9.9
        },
        {
            "name": "KOLAM PENGENDAPAN WMP BDA",
            "site": "BDA",
            "type": "custom",
            "latitude": -1.128803,
            "longitude": 115.161079,
            "radius": 220,
            "color": "#0284C7",
            "address": "Water Management Pond (WMP Tambang) STA 45, Site BDA",
            "material": "MUD",
            "geometry_type": "polygon",
            "seed": 10.1
        }
    ]

    for op in bda_operational:
        ring = create_polygon_ring(op['latitude'], op['longitude'], op['radius'], 8, op.pop('seed', 0))
        op['coordinates_json'] = json.dumps(ring)

    # 3. Ekstrak 905 Titik STA Checkpoint dari GeoJSON
    points = [f for f in bda_data['features'] if f['geometry']['type'] == 'Point']
    print(f"Total STA Points diekstrak dari BDA GeoJSON: {len(points)}")

    bda_sta_geofences = []
    for pt in points:
        props = pt.get('properties', {})
        name = props.get('name', 'STA Checkpoint') + ' (BDA)'
        coords = pt['geometry']['coordinates']
        lng = float(coords[0])
        lat = float(coords[1])
        
        # Ekstrak Z (elevasi) dari description bila ada
        desc = props.get('description', '')
        z_val = ''
        if isinstance(desc, dict):
            desc_str = desc.get('value', '')
            for part in desc_str.split('<br/>'):
                if part.strip().startswith('Z:'):
                    z_val = ' • Elevasi ' + part.strip()
                    break

        bda_sta_geofences.append({
            "name": name,
            "site": "BDA",
            "type": "road",
            "latitude": round(lat, 7),
            "longitude": round(lng, 7),
            "radius": 35,
            "color": "#F59E0B",
            "address": f"Checkpoint {name} Koridor Hauling BDA Barito (45.2 KM){z_val}",
            "material": "COAL",
            "geometry_type": "circle",
            "coordinates_json": None
        })

    # 4. Gabungkan ke database/data/hauling_geofences.json
    db_json_path = r'D:\Semester 5\hpu\database\data\hauling_geofences.json'
    with open(db_json_path, 'r', encoding='utf-8') as f:
        existing_geofences = json.load(f)

    # Pastikan data yang ada memiliki tag site = 'HPA' jika belum ada
    for eg in existing_geofences:
        if 'site' not in eg:
            eg['site'] = 'HPA'

    # Filter keluar data BDA lama jika ada
    existing_geofences = [g for g in existing_geofences if g.get('site') != 'BDA']
    
    # Gabungkan
    all_geofences = existing_geofences + bda_operational + bda_sta_geofences

    with open(db_json_path, 'w', encoding='utf-8') as f:
        json.dump(all_geofences, f, indent=2)

    print(f"Total Geofences dalam master dataset: {len(all_geofences)} (HPA: {len(existing_geofences)}, BDA: {len(bda_operational) + len(bda_sta_geofences)})")

    # 5. Update public/geojson/operational_geofences.geojson
    op_geojson_path = r'D:\Semester 5\hpu\public\geojson\operational_geofences.geojson'
    with open(op_geojson_path, 'r', encoding='utf-8') as f:
        op_geojson = json.load(f)

    # Filter keluar fitur BDA lama
    op_geojson['features'] = [f for f in op_geojson['features'] if f.get('properties', {}).get('site') != 'BDA']

    # Tambahkan fitur BDA operasional poligon
    for i, op in enumerate(bda_operational):
        ring_latlng = json.loads(op['coordinates_json'])
        # Konversi ke [lng, lat] GeoJSON format
        ring_geojson = [[round(p[1], 7), round(p[0], 7)] for p in ring_latlng]
        ring_geojson.append(ring_geojson[0]) # close ring

        op_geojson['features'].append({
            "type": "Feature",
            "properties": {
                "id": 9000 + i + 1,
                "name": op['name'],
                "site": "BDA",
                "type": op['type'],
                "color": op['color'],
                "radius": op['radius'],
                "material": op['material'],
                "address": op['address'],
                "geometry_type": "polygon"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [ring_geojson]
            }
        })

    with open(op_geojson_path, 'w', encoding='utf-8') as f:
        json.dump(op_geojson, f, indent=2)

    print(f"Berhasil memperbarui {op_geojson_path} (Total zona operasional: {len(op_geojson['features'])})")

if __name__ == '__main__':
    main()
