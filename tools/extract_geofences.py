import json
import os

def parse_sta_num(name):
    try:
        return float(name.replace('STA', '').replace('+', '').strip())
    except Exception:
        return None

# Load HPA
with open('C:/Users/muham/Downloads/HaulingHPA.geojson', 'r', encoding='utf-8') as f:
    hpa = json.load(f)

# Load Converted
with open('C:/Users/muham/Downloads/converted.geojson', 'r', encoding='utf-8') as f:
    conv = json.load(f)

geofences = []

# Map HPA POIs
hpa_poi_map = {
    'PORT': {'name': 'PORT HPA', 'type': 'dumping', 'material': 'COAL', 'radius': 300, 'color': '#10B981', 'address': 'Pelabuhan Bongkar Batubara HPA'},
    'PIT SELATAN': {'name': 'PIT SELATAN', 'type': 'loading', 'material': 'OB', 'radius': 300, 'color': '#3B82F6', 'address': 'Front Loading Pit Selatan'},
    'ROMPAD': {'name': 'ROMPAD HPA', 'type': 'loading', 'material': 'COAL', 'radius': 250, 'color': '#F59E0B', 'address': 'Stockpile Rompad HPA Pengangkutan Batubara'},
    'OPD LW': {'name': 'OPD LW', 'type': 'dumping', 'material': 'OB', 'radius': 250, 'color': '#10B981', 'address': 'Disposal Area Out Pit Dump LW HPA'},
    'IPD': {'name': 'IPD HPA', 'type': 'dumping', 'material': 'OB', 'radius': 200, 'color': '#10B981', 'address': 'In Pit Dump HPA'},
    'WORKSHOP HPU': {'name': 'WORKSHOP HPU (HPA)', 'type': 'parking', 'material': 'OB', 'radius': 150, 'color': '#8B5CF6', 'address': 'Workshop & Maintenance HPU Sektor HPA'},
    'OFFICE HPU': {'name': 'OFFICE HPU (HPA)', 'type': 'parking', 'material': 'OB', 'radius': 150, 'color': '#8B5CF6', 'address': 'Main Office HPU Sektor HPA'},
    'MESS KARYAWAN HPU': {'name': 'MESS KARYAWAN HPU (HPA)', 'type': 'parking', 'material': 'OB', 'radius': 150, 'color': '#8B5CF6', 'address': 'Mess Karyawan HPU Sektor HPA'},
    'PARKIR HAULING': {'name': 'PARKIR HAULING (HPA)', 'type': 'parking', 'material': 'OB', 'radius': 150, 'color': '#8B5CF6', 'address': 'Area Parkir Dump Truck Hauling HPA'},
    'WMP 4': {'name': 'WMP 4', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#06B6D4', 'address': 'Water Monitoring Pond WMP 4 HPA'},
    'WMP 5': {'name': 'WMP 5', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#06B6D4', 'address': 'Water Monitoring Pond WMP 5 HPA'},
    'IMS': {'name': 'POS IMS', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#64748B', 'address': 'Pos Pantau IMS HPA'},
    'RENCANA TOWER': {'name': 'RENCANA TOWER', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#64748B', 'address': 'Rencana Tower Telekomunikasi HPA'},
}

for feat in hpa['features']:
    if feat['geometry']['type'] == 'Point':
        raw_name = feat.get('properties', {}).get('Name') or feat.get('properties', {}).get('name') or ''
        coords = feat['geometry']['coordinates']
        lng, lat = coords[0], coords[1]
        if raw_name in hpa_poi_map:
            conf = hpa_poi_map[raw_name]
            geofences.append({
                'name': conf['name'],
                'type': conf['type'],
                'latitude': round(lat, 7),
                'longitude': round(lng, 7),
                'radius': conf['radius'],
                'color': conf['color'],
                'address': conf['address'],
                'material': conf['material'],
                'geometry_type': 'circle',
                'coordinates_json': json.dumps([[round(lat, 7), round(lng, 7)]])
            })
        elif raw_name.startswith('STA'):
            num = parse_sta_num(raw_name)
            geofences.append({
                'name': f'{raw_name} (HPA)',
                'type': 'road',
                'latitude': round(lat, 7),
                'longitude': round(lng, 7),
                'radius': 50,
                'color': '#64748B',
                'address': f'Checkpoint Jalur Hauling HPA KM {num:.3f}' if num is not None else 'Jalur Hauling HPA',
                'material': 'OB',
                'geometry_type': 'point',
                'coordinates_json': json.dumps([[round(lat, 7), round(lng, 7)]])
            })

# Map Converted POIs
conv_poi_map = {
    'PORT': {'name': 'PORT TAMBANG UTAMA', 'type': 'dumping', 'material': 'COAL', 'radius': 300, 'color': '#10B981', 'address': 'Pelabuhan Jetty Utama Muat Batubara'},
    'PIT WEST': {'name': 'PIT WEST', 'type': 'loading', 'material': 'OB', 'radius': 300, 'color': '#3B82F6', 'address': 'Front Loading Pit West'},
    'SINDORO': {'name': 'PIT SINDORO', 'type': 'loading', 'material': 'OB', 'radius': 250, 'color': '#3B82F6', 'address': 'Front Loading Pit Sindoro'},
    'MUSTAQIM': {'name': 'PIT MUSTAQIM', 'type': 'loading', 'material': 'OB', 'radius': 250, 'color': '#3B82F6', 'address': 'Front Loading Pit MustAQIM'},
    'OPD HW': {'name': 'OPD HW', 'type': 'dumping', 'material': 'OB', 'radius': 250, 'color': '#10B981', 'address': 'Disposal Area Out Pit Dump HW Tambang'},
    'OPD SWT': {'name': 'OPD SWT', 'type': 'dumping', 'material': 'OB', 'radius': 250, 'color': '#10B981', 'address': 'Disposal Area Out Pit Dump SWT'},
    'OPD SWB': {'name': 'OPD SWB', 'type': 'dumping', 'material': 'OB', 'radius': 250, 'color': '#10B981', 'address': 'Disposal Area Out Pit Dump SWB'},
    'IPD PANEL 1': {'name': 'IPD PANEL 1', 'type': 'dumping', 'material': 'OB', 'radius': 200, 'color': '#10B981', 'address': 'Disposal Area In Pit Dump Panel 1'},
    'OFFICE': {'name': 'OFFICE TAMBANG', 'type': 'parking', 'material': 'OB', 'radius': 150, 'color': '#8B5CF6', 'address': 'Kantor Operasional Tambang'},
    'MESS KARYAWAN HPU': {'name': 'MESS KARYAWAN HPU (TAMBANG)', 'type': 'parking', 'material': 'OB', 'radius': 150, 'color': '#8B5CF6', 'address': 'Mess Karyawan HPU Sektor Tambang'},
    'GD. HANDAK': {'name': 'GD. HANDAK (ZONA BAHAYA)', 'type': 'custom', 'material': 'OB', 'radius': 150, 'color': '#EF4444', 'address': 'Gudang Bahan Peledak - Max Speed 20 km/j'},
    'GRADE JALAN : 5.2%': {'name': 'TURUNAN CURAM (GRADE 5.2%)', 'type': 'custom', 'material': 'OB', 'radius': 120, 'color': '#EF4444', 'address': 'Segmen Turunan Curam 5.2% - Dynamic Speed Limit 25 km/j'},
    'WMP 04': {'name': 'WMP 04', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#06B6D4', 'address': 'Water Monitoring Pond WMP 04'},
    'WMP 11': {'name': 'WMP 11', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#06B6D4', 'address': 'Water Monitoring Pond WMP 11'},
    'WMP 13': {'name': 'WMP 13', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#06B6D4', 'address': 'Water Monitoring Pond WMP 13'},
    'WMP 14': {'name': 'WMP 14', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#06B6D4', 'address': 'Water Monitoring Pond WMP 14'},
    'WMP 15': {'name': 'WMP 15', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#06B6D4', 'address': 'Water Monitoring Pond WMP 15'},
    'TOS': {'name': 'POS TOS', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#38BDF8', 'address': 'Pos Traffic Operation Service (TOS)'},
    'ERT': {'name': 'POS ERT (EMERGENCY)', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#F43F5E', 'address': 'Pos Tanggap Darurat Emergency Response Team'},
    'JEMBATAN EAST': {'name': 'JEMBATAN EAST', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#F59E0B', 'address': 'Jembatan Hauling Sektor East'},
    'PANEL 2': {'name': 'PANEL 2', 'type': 'custom', 'material': 'OB', 'radius': 150, 'color': '#38BDF8', 'address': 'Pos Operasional Panel 2'},
    'VIEW POINT': {'name': 'VIEW POINT TAMBANG', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#64748B', 'address': 'Titik Pantau View Point Tambang'},
    'BUKIT TINGGI': {'name': 'BUKIT TINGGI', 'type': 'custom', 'material': 'OB', 'radius': 100, 'color': '#64748B', 'address': 'Landmark Bukit Tinggi Tambang'},
}

pit_east_count = 0
for feat in conv['features']:
    if feat['geometry']['type'] == 'Point':
        raw_name = feat.get('properties', {}).get('Name') or feat.get('properties', {}).get('name') or ''
        coords = feat['geometry']['coordinates']
        lng, lat = coords[0], coords[1]
        if raw_name == 'PIT EAST':
            pit_east_count += 1
            pname = 'PIT EAST (COAL)' if pit_east_count == 1 else 'PIT EAST (OB)'
            pmat = 'COAL' if pit_east_count == 1 else 'OB'
            geofences.append({
                'name': pname,
                'type': 'loading',
                'latitude': round(lat, 7),
                'longitude': round(lng, 7),
                'radius': 300,
                'color': '#3B82F6',
                'address': f'Front Loading {pname}',
                'material': pmat,
                'geometry_type': 'circle',
                'coordinates_json': json.dumps([[round(lat, 7), round(lng, 7)]])
            })
        elif raw_name in conv_poi_map:
            conf = conv_poi_map[raw_name]
            geofences.append({
                'name': conf['name'],
                'type': conf['type'],
                'latitude': round(lat, 7),
                'longitude': round(lng, 7),
                'radius': conf['radius'],
                'color': conf['color'],
                'address': conf['address'],
                'material': conf['material'],
                'geometry_type': 'circle',
                'coordinates_json': json.dumps([[round(lat, 7), round(lng, 7)]])
            })
        elif raw_name.startswith('STA'):
            num = parse_sta_num(raw_name)
            geofences.append({
                'name': f'{raw_name} (Tambang)',
                'type': 'road',
                'latitude': round(lat, 7),
                'longitude': round(lng, 7),
                'radius': 50,
                'color': '#64748B',
                'address': f'Checkpoint Jalur Hauling Tambang KM {num:.3f}' if num is not None else 'Jalur Hauling Tambang',
                'material': 'OB',
                'geometry_type': 'point',
                'coordinates_json': json.dumps([[round(lat, 7), round(lng, 7)]])
            })

os.makedirs('D:/Semester 5/hpu/database/data', exist_ok=True)
out_file = 'D:/Semester 5/hpu/database/data/hauling_geofences.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(geofences, f, indent=2)

print('Generated geofences count:', len(geofences))
op_count = len([g for g in geofences if g['type'] != 'road'])
road_count = len([g for g in geofences if g['type'] == 'road'])
print(f'Operational POIs: {op_count}, Road Checkpoints: {road_count}')
