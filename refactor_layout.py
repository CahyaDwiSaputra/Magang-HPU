import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Change the deck container to 3 columns
text = text.replace(
    '<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">',
    '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">'
)

# Change col-span-6 to col-span-1
text = text.replace('xl:col-span-6', 'lg:col-span-1')

# Wait, if I change xl:col-span-6 to lg:col-span-1, the two columns will become two columns in a 3 column grid, leaving the 3rd empty!
# That's not what I want. I should just use `grid-cols-1 xl:grid-cols-3` and have 3 `div`s.
# Currently, there are two `div className="lg:col-span-1 flex flex-col gap-6"`.
# I should split the cards into 3 `div`s.

# Let's find all the cards and rebuild the columns.
# It might be complicated to parse JSX with regex.
