import re

with open('src/components/EvoPoolModal.tsx', 'r') as f:
    content = f.read()

# Add Eye to lucide-react imports
content = re.sub(
    r"import \{ (.*?) \} from 'lucide-react';",
    lambda m: "import { " + m.group(1) + (", Eye" if "Eye" not in m.group(1) else "") + " } from 'lucide-react';",
    content
)

# Import EvoDetailsModal
if "import { EvoDetailsModal }" not in content:
    content = re.sub(
        r"import \{ EvolutionDefinition \} from '\.\./types/player';\n",
        r"import { EvolutionDefinition } from '../types/player';\nimport { EvoDetailsModal } from './EvoDetailsModal';\n",
        content
    )

# Add viewingEvo state
content = re.sub(
    r'  const \[filterNewPosition, setFilterNewPosition\] = useState\(false\);\n',
    r"  const [filterNewPosition, setFilterNewPosition] = useState(false);\n  const [viewingEvo, setViewingEvo] = useState<string | null>(null);\n",
    content
)

# Add Eye button to EvoCard
# We look for the h4 tag containing the name
button_ui = r'''                    <span>{evo.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewingEvo(evo.id); }}
                      className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors ml-auto mr-1 shrink-0"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
'''
content = re.sub(
    r'                    <span>\{evo\.name\}</span>\n',
    button_ui,
    content
)

# Add EvoDetailsModal to render
modal_ui = r'''        </div>
      </div>
      {viewingEvo && (
        <EvoDetailsModal
          evoId={viewingEvo}
          onClose={() => setViewingEvo(null)}
          onAdd={() => {}} // No-op in pool view, or could toggle pool
        />
      )}
    </div>
  );
};
'''
content = re.sub(
    r'        </div>\n      </div>\n    </div>\n  \);\n};\n',
    modal_ui,
    content
)

with open('src/components/EvoPoolModal.tsx', 'w') as f:
    f.write(content)
