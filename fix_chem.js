const fs = require('fs');
const file = 'src/data/chemStyles.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace specific numbers based on FC26 system
content = content.replace(/: 8/g, ': 6');
content = content.replace(/: 4/g, ': 3');
content = content.replace(/: 15/g, ': 9');

// Specific adjustment for Anchor Aggression based on user's screenshot
content = content.replace(
  'Anchor: { acceleration: 3, sprintSpeed: 3, interceptions: 3, headingAcc: 3, defAwareness: 3, standTackle: 6, slideTackle: 6, jumping: 6, strength: 6, aggression: 6 }',
  'Anchor: { acceleration: 3, sprintSpeed: 3, interceptions: 3, headingAcc: 3, defAwareness: 3, standTackle: 6, slideTackle: 6, jumping: 6, strength: 6, aggression: 3 }'
);

fs.writeFileSync(file, content);
console.log('Fixed chemStyles.ts');
