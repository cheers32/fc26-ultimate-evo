import re

with open('src/components/ManualPathModal.tsx', 'r') as f:
    content = f.read()

# Add button
button_ui = r'''                          <span className="font-bold text-[9.5px] tracking-wide font-mono opacity-90">
                            ({evo.requirements.maxOvr || 99}/{evo.requirements.maxPlayStylesPlus ?? '∞'}/+{evo.ovrBoost.boost})
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setLocalViewingEvo(id); }}
                            className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors ml-auto shrink-0"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>'''

content = re.sub(
    r'                          <span className="font-bold text-\[9\.5px\] tracking-wide font-mono opacity-90">\n                            \(\{evo\.requirements\.maxOvr \|\| 99\}/\{evo\.requirements\.maxPlayStylesPlus \?\? \'∞\'\}/\+\{evo\.ovrBoost\.boost\}\)\n                          </span>\n                        </div>',
    button_ui,
    content
)

with open('src/components/ManualPathModal.tsx', 'w') as f:
    f.write(content)
