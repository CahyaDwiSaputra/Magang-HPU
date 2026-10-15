import re

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# First, find the cards
cards = []
card_matches = list(re.finditer(r'(\{/\* CARD \d:.*?\*/\}.*?)(?=\{/\* CARD \d:|\Z)', text, re.DOTALL))
# This regex won't work well because the end of the last card is mixed with other closing tags.

# Let's try splitting by '{/* CARD '
parts = text.split('{/* CARD ')
if len(parts) == 6: # 1 header + 5 cards
    header = parts[0]
    c1 = '{/* CARD ' + parts[1]
    c2 = '{/* CARD ' + parts[2]
    c3 = '{/* CARD ' + parts[3]
    c4 = '{/* CARD ' + parts[4]
    c5_full = '{/* CARD ' + parts[5]
    
    # We need to find where c3 ends and the right column begins.
    # Actually, between c3 and c4, there is a `</div>` for the left column, and `<div className="xl:col-span-6 flex flex-col gap-6">` for the right column.
    # Same for c5_full, at the end there are closing tags.
    
    # Let's just do simple replacements.
    # Replace the container
    text = text.replace(
        '<div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">',
        '<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">'
    )
    
    # Replace the left column wrapper
    text = text.replace(
        '<!-- KOLOM KIRI (xl:col-span-6): HAULING OPERATIONS & UNIT SENSORS -->\n                            <div className="xl:col-span-6 flex flex-col gap-6">',
        '<div className="flex flex-col gap-6">'
    )
    # The actual comment is: {/* ── KOLOM KIRI (xl:col-span-6): HAULING OPERATIONS & UNIT SENSORS ── */}
    # Let\'s just replace the class name:
    text = text.replace(
        '<div className="xl:col-span-6 flex flex-col gap-6">',
        '<div className="flex flex-col gap-6">', 2
    )
    
    # Now we have 2 columns. We want 3 columns.
    # Currently it is:
    # <div flex>
    #   CARD 1
    #   CARD 2
    #   CARD 3
    # </div>
    # <div flex>
    #   CARD 4
    #   CARD 5
    # </div>
    
    # Let's move CARD 3 to a new column before CARD 4!
    # Or move CARD 3 to the middle column, and CARD 4 & 5 to the last.
    # Let's just find '{/* CARD 3:' and put it in a new column.
    
    # Split at CARD 3
    c3_idx = text.find('{/* CARD 3:')
    c4_idx = text.find('{/* CARD 4:')
    
    if c3_idx != -1 and c4_idx != -1:
        # Before CARD 3, close the first column and open the second.
        # So we insert: </div><div className="flex flex-col gap-6"> right before CARD 3.
        # But wait, we need to remove the closing div of column 1 and opening of column 2 that are between CARD 3 and CARD 4.
        
        # Let's extract the text between CARD 3 and CARD 4
        between_3_4 = text[c3_idx:c4_idx]
        
        # Inside between_3_4, there should be `</div>\n\n                            {/* ── KOLOM KANAN`
        # Let's remove that `</div>` and `<div class="flex flex-col gap-6">`
        # Actually, let's just do it manually with regex.
        
        # Replace the middle column break:
        # </div>
        #
        # {/* ── KOLOM KANAN ...
        # <div className="flex flex-col gap-6">
        
        new_between = re.sub(
            r'</div>\s*\{/\* ── KOLOM KANAN.*?\*/\}\s*<div className="flex flex-col gap-6">',
            '',
            between_3_4,
            flags=re.DOTALL
        )
        
        # Now all 5 cards are in ONE giant column.
        # Let's verify we can replace it.
        text = text[:c3_idx] + new_between + text[c4_idx:]
        
        # Now insert the column breaks where we want them!
        # Col 1: CARD 1, CARD 2
        # Col 2: CARD 3, CARD 4
        # Col 3: CARD 5
        
        # Before CARD 3, close col 1 and open col 2
        text = text.replace('{/* CARD 3:', '</div>\n                            <div className="flex flex-col gap-6">\n                                {/* CARD 3:')
        
        # Before CARD 5, close col 2 and open col 3
        text = text.replace('{/* CARD 5:', '</div>\n                            <div className="flex flex-col gap-6">\n                                {/* CARD 5:')

    with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
        print("Restructured successfully")
