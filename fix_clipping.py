import re

with open('src/components/ManualPathModal.tsx', 'r') as f:
    content = f.read()

# Fix clipping
content = re.sub(
    r'className="flex flex-nowrap overflow-x-auto \\[&::-webkit-scrollbar\\]:h-1\.5 \\[&::-webkit-scrollbar-thumb\\]:bg-gray-700 \\[&::-webkit-scrollbar-track\\]:bg-transparent \\[&::-webkit-scrollbar-thumb\\]:rounded-full pb-2 items-center gap-1\.5"',
    r'className="flex flex-nowrap overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full pt-2 pl-2 pb-2 items-center gap-1.5"',
    content
)

with open('src/components/ManualPathModal.tsx', 'w') as f:
    f.write(content)
