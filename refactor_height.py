with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make camera height bigger
text = text.replace("style={{ height: '420px' }}", "style={{ height: '520px' }}")
text = text.replace("style={{ height: '480px' }}", "style={{ height: '600px' }}")

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
