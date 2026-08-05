import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace all occurrences of rawPlayStyles={playStylesData}
# to also include rawStats={statsData}
content = content.replace(
    "rawPlayStyles={playStylesData}",
    "rawPlayStyles={playStylesData}\n          rawStats={statsData}"
)

# And because my previous script already did it for the second one, I might have duplicate rawStats={statsData} there now.
content = content.replace(
    "rawPlayStyles={playStylesData}\n          rawStats={statsData}\n          rawStats={statsData}",
    "rawPlayStyles={playStylesData}\n          rawStats={statsData}"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
