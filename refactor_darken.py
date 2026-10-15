with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Make the outer container darker to make white cards pop
# Currently, it is probably `<div className="flex flex-col h-full bg-slate-50 rounded-2xl...`
text = text.replace('bg-slate-50 rounded-2xl', 'bg-slate-100 rounded-2xl')

# Make the deck background a bit darker with a subtle border to separate it from the top section
text = text.replace(
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">',
    '<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-slate-200/40 p-4 rounded-3xl border border-slate-200">'
)

# Darken the borders and increase shadows on all cards
text = text.replace('border-slate-200 shadow-sm', 'border-slate-300 shadow-md')

with open('resources/js/Pages/Dashboard/Dashcam/index.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Applied darker layout")
