import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to match the Passenger Violation Alert block
pattern = r'\{\s*/\*\s*Cabin Occupancy SOP Violation Alert\s*\*/\s*\}\s*\{passengerDetected \? \([\s\S]*?\) : \([\s\S]*?\)\}'

# Remove the block
text = re.sub(pattern, '', text)

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Removed SOP Violation Alert")
