import re

with open('src/components/EvoPoolModal.tsx', 'r') as f:
    content = f.read()

# We need to insert the button after the </h3> and before the Disable button
ui = r'''          </h3>
          <button
            onClick={(e) => { e.stopPropagation(); setViewingEvo(evo.id); }}
            className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors ml-auto mr-1 shrink-0"
            title="View Details"
          >
            <Eye className="w-3 h-3" />
          </button>'''

content = re.sub(r'          </h3>', ui, content, count=1)

with open('src/components/EvoPoolModal.tsx', 'w') as f:
    f.write(content)
