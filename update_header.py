import re

with open('src/components/HeaderCard.tsx', 'r') as f:
    content = f.read()

# Add logic for activeFiltersCount to include new boolean filters
count_logic = r'''
  const activeFiltersCount = Object.keys(evoFilters).filter(k => {
    if (k === 'requiredEvos' || k === 'blockedEvos') return false;
    const v = evoFilters[k as keyof EvoFilters];
    if (typeof v === 'boolean') return v;
    if (v && typeof v === 'object') {
      const sf = v as any;
      if (sf.min !== undefined || sf.max !== undefined) return true;
      if (sf.subs && Object.values(sf.subs).some((s: any) => s.min !== undefined || s.max !== undefined)) return true;
    }
    return false;
  }).length;
'''
content = re.sub(
    r'  const activeFiltersCount = Object\.keys\(evoFilters\)\.filter\(k => \{[\s\S]*?\}\)\.length;\n',
    count_logic.strip() + '\n',
    content
)

# Add checkboxes to the UI
checkboxes_ui = r'''
                    <div className="mt-3 pt-3 border-t border-gray-800">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={!!draftFilters.newRarity}
                            onChange={(e) => setDraftFilters({ ...draftFilters, newRarity: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          New Rarity
                        </label>
                        <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer hover:text-white transition-colors">
                          <input
                            type="checkbox"
                            checked={!!draftFilters.newPosition}
                            onChange={(e) => setDraftFilters({ ...draftFilters, newPosition: e.target.checked })}
                            className="w-3.5 h-3.5 rounded border-gray-700 bg-[#121212] text-fcGreen focus:ring-fcGreen focus:ring-offset-0 focus:ring-1 cursor-pointer"
                          />
                          New Position
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">
'''

content = re.sub(
    r'                  </div>\n\n                  <div className="mt-4 pt-3 border-t border-gray-800 flex justify-between items-center">',
    checkboxes_ui,
    content
)

with open('src/components/HeaderCard.tsx', 'w') as f:
    f.write(content)
