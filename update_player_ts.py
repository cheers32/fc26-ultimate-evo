import re

with open('src/types/player.ts', 'r') as f:
    content = f.read()

content = re.sub(
    r'  blockedEvos\?: string\[\];\n',
    r'  blockedEvos?: string[];\n  newRarity?: boolean;\n  newPosition?: boolean;\n',
    content
)

with open('src/types/player.ts', 'w') as f:
    f.write(content)
