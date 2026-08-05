import re

with open('src/components/ManualPathModal.tsx', 'r') as f:
    content = f.read()

# Add state
content = re.sub(
    r'  const \[searchQuery, setSearchQuery\] = useState<string>\(\'\'\);\n',
    r"  const [searchQuery, setSearchQuery] = useState<string>('');\n  const [filterNewRarity, setFilterNewRarity] = useState(false);\n  const [filterNewPosition, setFilterNewPosition] = useState(false);\n",
    content
)

# Add buttons before search input
buttons_ui = r'''              <div className="flex gap-2 items-center flex-1 md:flex-none justify-end">
                <button
                  onClick={() => setFilterNewRarity(!filterNewRarity)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNewRarity ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  New Rarity
                </button>
                <button
                  onClick={() => setFilterNewPosition(!filterNewPosition)}
                  className={`px-2 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                    filterNewPosition ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                  }`}
                >
                  New Position
                </button>
                <div className="relative max-w-[250px] w-full">'''

content = re.sub(
    r'              <div className="relative max-w-\[300px\] w-full">',
    buttons_ui,
    content
)
content = re.sub(
    r'              </div>\n            </div>\n            \n            <div className="p-4 grid grid-cols-1',
    r'              </div>\n              </div>\n            </div>\n            \n            <div className="p-4 grid grid-cols-1',
    content
)

# Fix filter logic
filter_logic = r'''
                    if (!evo) return false;
                    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    if (filterNewRarity && !evo.rarityChange) return false;
                    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
                    return true;
'''

# Update the onKeyDown Enter handler filter
content = re.sub(
    r'const filteredPool = poolWithStatus\.filter\(\(\{ evo \}\) => !searchQuery \|\| evo\?\.name\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\);',
    r'const filteredPool = poolWithStatus.filter(({ evo }) => {' + filter_logic + r'});',
    content
)

# Update the main render filter
content = re.sub(
    r'\.filter\(\(\{ evo \}\) => !searchQuery \|\| evo\?\.name\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\)',
    r'.filter(({ evo }) => {' + filter_logic + '})',
    content
)


with open('src/components/ManualPathModal.tsx', 'w') as f:
    f.write(content)
