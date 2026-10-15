import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the static channels array
text = text.replace(
'''const channels = [
    { id: "cam1", deviceId: DEVICE_DT, apiChannel: 0, label: "HD-78501 (DT)", hasStream: true },
    { id: "cam2", deviceId: DEVICE_EXCA, apiChannel: 0, label: "UNS-1 (Excavator)", hasStream: true },
];''', 
'''// channels akan dirender dinamis berdasarkan selectedVehicle di dalam komponen'''
)

# Insert the state for selectedVehicle right after passengerDetected
text = text.replace(
'''    const [passengerDetected, setPassengerDetected] = useState(true);''',
'''    const [passengerDetected, setPassengerDetected] = useState(true);
    const [selectedVehicle, setSelectedVehicle] = useState<'DT' | 'EXCA'>('DT');
    
    const activeDeviceId = selectedVehicle === 'DT' ? DEVICE_DT : DEVICE_EXCA;
    const activeChannels = selectedVehicle === 'DT' 
        ? [
            { id: "cam1", deviceId: DEVICE_DT, apiChannel: 0, label: "CAM 1 — Depan", hasStream: true },
            { id: "cam2", deviceId: DEVICE_DT, apiChannel: 1, label: "CAM 2 — Kabin", hasStream: true },
        ]
        : [
            { id: "cam1", deviceId: DEVICE_EXCA, apiChannel: 0, label: "CAM 1 — Area Kerja", hasStream: true },
            { id: "cam2", deviceId: DEVICE_EXCA, apiChannel: 1, label: "CAM 2 — Kabin", hasStream: true },
        ];'''
)

# Change DEVICE_DT back to activeDeviceId where appropriate
text = text.replace('deviceId: DEVICE_DT,', 'deviceId: activeDeviceId,')

# Replace channels.map with activeChannels.map
text = text.replace('channels.map(', 'activeChannels.map(')

# The PIP mode uses specific channels.
# {camUrl(DEVICE_DT, 0, jsession, cmsBaseUrl)} -> we should use activeDeviceId and 0/1 for channel
text = text.replace('camUrl(DEVICE_DT, 0, jsession, cmsBaseUrl)', 'camUrl(activeDeviceId, 0, jsession, cmsBaseUrl)')
text = text.replace('camUrl(DEVICE_EXCA, 0, jsession, cmsBaseUrl)', 'camUrl(activeDeviceId, 1, jsession, cmsBaseUrl)') # Wait, earlier I mapped cam2 to EXCA channel 0. Now it's activeDeviceId channel 1.
# Let's fix that using regex.
text = re.sub(r'camUrl\(\s*(?:DEVICE_DT|DEVICE_EXCA)\s*,\s*0\s*,', r'camUrl(activeDeviceId, 0,', text)
text = re.sub(r'camUrl\(\s*(?:DEVICE_DT|DEVICE_EXCA)\s*,\s*1\s*,', r'camUrl(activeDeviceId, 1,', text)

# Since PIP mode was hardcoded to:
# {camUrl(DEVICE_EXCA, 0, jsession, cmsBaseUrl)} in my previous refactor script for cam2, it became `0`. Let's fix that to use channel 1 for PIP cam2.
# Let's just do a manual replace for the PIP section.
# It's better to just regex replace `camUrl(..., ..., jsession, cmsBaseUrl)` inside PIP to `camUrl(activeDeviceId, 0 or 1, ...)`
# I'll just replace `camUrl(DEVICE_EXCA, 0` with `camUrl(activeDeviceId, 1`.
# Let's write a targeted function to clean this up.

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated basic state")
