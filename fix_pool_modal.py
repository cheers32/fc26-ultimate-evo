import re

with open('src/components/EvoPoolModal.tsx', 'r') as f:
    content = f.read()

# Add states
content = re.sub(
    r'  const \[filterSecondary, setFilterSecondary\] = useState\(false\);\n',
    r"  const [filterSecondary, setFilterSecondary] = useState(false);\n  const [filterNewRarity, setFilterNewRarity] = useState(false);\n  const [filterNewPosition, setFilterNewPosition] = useState(false);\n",
    content
)

# Add logic for active
content = re.sub(
    r'    if \(searchQuery && !evo\.name\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\) return false;\n    return true;\n  \}\);\n  const filteredDisabledEvos = disabledEvosList\.filter',
    r'''    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterNewRarity && !evo.rarityChange) return false;
    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
    return true;
  });
  const filteredDisabledEvos = disabledEvosList.filter''',
    content
)

# Add logic for disabled
content = re.sub(
    r'    if \(searchQuery && !evo\.name\.toLowerCase\(\)\.includes\(searchQuery\.toLowerCase\(\)\)\) return false;\n    return true;\n  \}\);\n\n  const selectedCount = draftEvosPool\.length;',
    r'''    if (searchQuery && !evo.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterNewRarity && !evo.rarityChange) return false;
    if (filterNewPosition && (!evo.positionsAdded || evo.positionsAdded.length === 0)) return false;
    return true;
  });

  const selectedCount = draftEvosPool.length;''',
    content
)

# Add UI
ui = r'''              <button
                onClick={() => setFilterNewRarity(!filterNewRarity)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                  filterNewRarity ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                }`}
              >
                New Rarity
              </button>
              <button
                onClick={() => setFilterNewPosition(!filterNewPosition)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border transition-colors ${
                  filterNewPosition ? 'bg-fcGreen text-black border-fcGreen/80 shadow-sm' : 'bg-[#2A2D2A] text-gray-400 border-gray-700/50 hover:bg-[#374151]'
                }`}
              >
                New Position
              </button>
              <input'''

content = re.sub(
    r'              </button>\n                <input',
    r'              </button>\n' + ui,
    content
)

with open('src/components/EvoPoolModal.tsx', 'w') as f:
    f.write(content)
