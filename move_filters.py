import re

with open('src/components/HeaderCard.tsx', 'r') as f:
    content = f.read()

# Remove them from the bottom
checkbox_block = r'''
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
'''
content = content.replace(checkbox_block, '')

# Insert them at the top of the scrollable area
top_checkbox_block = r'''
                    <div className="mb-4 pb-3 border-b border-gray-800">
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
'''

content = re.sub(
    r'(<div className="space-y-3 max-h-\[60vh\] overflow-y-auto pr-2 custom-scrollbar">)',
    r'\1\n' + top_checkbox_block,
    content
)

with open('src/components/HeaderCard.tsx', 'w') as f:
    f.write(content)
