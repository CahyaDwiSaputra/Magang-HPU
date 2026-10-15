import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Locate where the deck starts
deck_start_marker = "OPERATIONAL & TELEMETRY DECK"
deck_start_idx = text.find(deck_start_marker)
if deck_start_idx == -1:
    print("Deck not found")
    exit(1)

# Find where the deck ends. It's right before `</LayoutNavbar>`
deck_end_idx = text.rfind('</LayoutNavbar>')
if deck_end_idx == -1:
    print("End not found")
    exit(1)

# Extract the whole deck section
deck_content = text[deck_start_idx:deck_end_idx]

# Extract each card using regex
cards = {}
for i in range(1, 6):
    card_pattern = r'(\{/\* CARD ' + str(i) + r':.*?\*/\}.*?)(?=\{/\* CARD ' + str(i+1) + r':|\Z)'
    if i == 5:
        # Card 5 is the last one, it goes until the end of the deck content minus the closing divs of the columns.
        card_pattern = r'(\{/\* CARD 5:.*?\*/\}.*)'
    
    match = re.search(card_pattern, deck_content, re.DOTALL)
    if match:
        cards[i] = match.group(1).strip()
    else:
        print(f"Card {i} not found")

if len(cards) == 5:
    # Clean up any trailing `</div>` from Card 5 that belonged to the column or main grid
    # Card 5 ends with some closing tags. We'll strip extra </div> tags at the very end of Card 5.
    c5 = cards[5]
    # Remove the last 3 closing `</div>` tags which correspond to the column, the grid, and the flex container... 
    # Actually it's better to just extract up to the end of Card 5's main div.
    # Let's count divs.
    
    # Alternatively, just use the extracted cards and rebuild the columns:
    
    # Card 5 has trailing `</div>`s. Let's just find the last closing div of the card itself.
    
    # A cleaner approach to fix the broken divs: 
    # Let's just remove the empty column:
    # `<div className="flex flex-col gap-6">\n\n                                </div>`
    
    pass

# Instead of extracting cards, let's just fix the stray `</div>` and empty `<div className="flex flex-col gap-6">`
fixed_text = re.sub(
    r'<div className="flex flex-col gap-6">\s*</div>',
    '',
    text
)

# And ensure we only have 3 column wrappers.
# Let's count them:
col_wrappers = len(re.findall(r'<div className="flex flex-col gap-6">', fixed_text))
print(f"Number of column wrappers: {col_wrappers}")

# If it's more than 3, we can remove the extra ones.
# Actually, the user's issue might be exactly that empty column!
with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(fixed_text)
print("Removed empty columns")
