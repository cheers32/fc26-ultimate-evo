import re

with open('src/components/HeaderCard.tsx', 'r') as f:
    content = f.read()

# Update imports
content = content.replace(
    "import { PlayerBio, OvrData, EvolutionPath, EvolutionDefinition, EvoFilters } from '../types/player';",
    "import { PlayerBio, OvrData, EvolutionPath, EvolutionDefinition, EvoFilters, StatsData } from '../types/player';"
)
content = content.replace(
    "import { calculateChip } from '../utils/statUtils';",
    "import { calculateChip, getStatColorClass } from '../utils/statUtils';\nimport { getPlayStyleIconUrl } from '../utils/playstyles';"
)

# Update HeaderCardProps
content = content.replace(
    "  rawPlayStyles: import('../types/player').PlayStylesData;",
    "  rawPlayStyles: import('../types/player').PlayStylesData;\n  rawStats: StatsData;"
)

# Update destructured props
content = content.replace(
    "  rawBaseOvr,\n  rawPlayStyles,\n  evosPool,",
    "  rawBaseOvr,\n  rawPlayStyles,\n  rawStats,\n  evosPool,"
)

with open('src/components/HeaderCard.tsx', 'w') as f:
    f.write(content)

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

app_content = app_content.replace(
    "          rawPlayStyles={playStylesData}\n          evosPool={evosPool}",
    "          rawPlayStyles={playStylesData}\n          rawStats={statsData}\n          evosPool={evosPool}"
)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)
