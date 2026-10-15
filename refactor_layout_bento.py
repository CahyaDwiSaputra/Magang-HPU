import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Change the deck container to a 12-column grid and increase gap
text = text.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">',
    '<div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">'
)

# Remove the 3 column wrappers
text = text.replace('<div className="flex flex-col gap-6">', '')
# And their closing divs... since we don't know exactly where they are, we might leave them.
# Wait, if we remove `<div className="flex flex-col gap-6">`, we MUST remove the corresponding `</div>`.
# This is risky. Let's just change the classes on the column wrappers instead!

# Wrapper 1: Card 1 (Hauling), Card 2 (Sensors)
# Wrapper 2: Card 3 (Map), Card 4 (Driver AI)
# Wrapper 3: Card 5 (Alarms)

# Let's change the layout to 2 columns:
# Wrapper 1 -> xl:col-span-7 (wider for hauling/map)
# Wrapper 2 -> xl:col-span-5
# Wait, currently there are 3 wrappers. Let's merge wrapper 2 and 3 into one wrapper? No, let's just make it a masonry layout or simple 2 columns.
# It is much easier to just change the deck container to `xl:grid-cols-2` and have the 3 wrappers wrap naturally. Wait, 3 wrappers in a 2 column grid means the 3rd wrapper drops to the next row, taking full width (or 50% width).
# If we do `grid-cols-1 xl:grid-cols-2 gap-8 items-start`, and we have 3 columns right now... wait, let's look at the structure.
