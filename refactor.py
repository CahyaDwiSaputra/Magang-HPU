import re
with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('const DEVICE_ID = "240078916116";', 'const DEVICE_DT = "240078916116";\nconst DEVICE_EXCA = "240078915951";')

content = content.replace('function camUrl(channel: number, jsession: string | null, baseUrl: string = "http://182.253.27.12:8080") {\n    if (jsession) {\n        const mediaHost = (baseUrl && baseUrl.includes(\'://\')) ? `${new URL(baseUrl).hostname}:6604` : \'182.253.27.12:6604\';\n        return `/player.html?dev=${DEVICE_ID}&ch=${channel}&jsession=${jsession}&host=${mediaHost}`;\n    }\n    return null;\n}', 'function camUrl(deviceId: string, channel: number, jsession: string | null, baseUrl: string = "http://182.253.27.12:8080") {\n    if (jsession) {\n        const mediaHost = (baseUrl && baseUrl.includes(\'://\')) ? `${new URL(baseUrl).hostname}:6604` : \'182.253.27.12:6604\';\n        return `/player.html?dev=${deviceId}&ch=${channel}&jsession=${jsession}&host=${mediaHost}`;\n    }\n    return null;\n}')

content = content.replace('deviceId: DEVICE_ID,', 'deviceId: DEVICE_DT,')

content = re.sub(r'const channels = \[\s*\{ id: "cam1", apiChannel: 0, label: ".*?", hasStream: true \},\s*\{ id: "cam2", apiChannel: 1, label: ".*?", hasStream: true \},\s*\];', 'const channels = [\n    { id: "cam1", deviceId: DEVICE_DT, apiChannel: 0, label: "HD-78501 (DT)", hasStream: true },\n    { id: "cam2", deviceId: DEVICE_EXCA, apiChannel: 0, label: "UNS-1 (Excavator)", hasStream: true },\n];', content)

content = content.replace('camUrl(ch.apiChannel, jsession, cmsBaseUrl)', 'camUrl(ch.deviceId, ch.apiChannel, jsession, cmsBaseUrl)')
content = content.replace('camUrl(0, jsession, cmsBaseUrl)', 'camUrl(DEVICE_DT, 0, jsession, cmsBaseUrl)')
content = content.replace('camUrl(1, jsession, cmsBaseUrl)', 'camUrl(DEVICE_EXCA, 0, jsession, cmsBaseUrl)')

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
