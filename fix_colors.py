import re

with open('src/components/HeaderCard.tsx', 'r') as f:
    content = f.read()

# Fix Base Card active style
content = content.replace(
    "'bg-[#EBB626] text-black border-[#d9a320] hover:bg-[#d4a21e]'",
    "'bg-[#1f211f] text-gray-200 border-[#EBB626] ring-1 ring-[#EBB626] shadow-[0_0_8px_rgba(235,182,38,0.3)] hover:text-white'"
)
# Fix Base Card text coloring
content = re.sub(
    r"\$\{selectedNodes\.includes\(-1\) \? '[^']+' : '([^']+)'\}",
    r"\1",
    content
)

# Fix Step active style
content = content.replace(
    '"bg-[#EBB626] text-black border-[#d9a320] hover:bg-[#d4a21e]"',
    '"bg-[#1f211f] text-gray-200 border-[#EBB626] ring-1 ring-[#EBB626] shadow-[0_0_8px_rgba(235,182,38,0.3)] hover:text-white"'
)
# Fix Step text coloring
content = re.sub(
    r"\$\{isStepActive \? '[^']+' : '([^']+)'\}",
    r"\1",
    content
)

with open('src/components/HeaderCard.tsx', 'w') as f:
    f.write(content)
