import re

with open('src/utils/evoEngine.ts', 'r') as f:
    content = f.read()

# Add filter logic inside analyzeEvolutions
filter_logic = r'''
        if (filters.blockedEvos && filters.blockedEvos.length > 0) {
          const hasBlocked = filters.blockedEvos.some(evoId => currentChainIds.includes(evoId));
          if (hasBlocked) passesFilters = false;
        }

        if (filters.newRarity && state.bio.rarity === baseBio.rarity) {
          passesFilters = false;
        }

        if (filters.newPosition && state.bio.primaryPositions === baseBio.primaryPositions) {
          passesFilters = false;
        }
'''

content = re.sub(
    r'        if \(filters\.blockedEvos && filters\.blockedEvos\.length > 0\) \{\n          const hasBlocked = filters\.blockedEvos\.some\(evoId => currentChainIds\.includes\(evoId\)\);\n          if \(hasBlocked\) passesFilters = false;\n        \}',
    filter_logic.strip(),
    content
)

with open('src/utils/evoEngine.ts', 'w') as f:
    f.write(content)
