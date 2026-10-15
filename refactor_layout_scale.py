import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Change from 3 columns to 2 columns and increase gap to 8
text = text.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">',
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">'
)

# Merge Card 5 into the second column (remove the column split)
text = re.sub(
    r'</div>\s*<div className="flex flex-col gap-6">\s*(?=\{/\* CARD 5: AI SAFETY)',
    '',
    text
)

# Increase font sizes across the file for better readability
text = text.replace('text-[9px]', 'text-[11px]')
text = text.replace('text-[10px]', 'text-[12px]')
text = text.replace('text-[11px]', 'text-xs')

# Increase gap sizes for breathing room inside some dense cards
# For example, gap-2 to gap-3 in certain dense grids.
# "grid grid-cols-4 gap-2 text-center" -> gap-3
text = text.replace('grid grid-cols-4 gap-2 text-center', 'grid grid-cols-4 gap-3 text-center')
text = text.replace('grid grid-cols-1 md:grid-cols-12 gap-4', 'grid grid-cols-1 md:grid-cols-12 gap-6')

# Let's save the changes
with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated layout to 2 columns and scaled up fonts")
