import { analyzeEvolutions } from './src/utils/evoEngine';
import { playersDatabase } from './src/data/playersData';

const ronaldo = playersDatabase['ronaldo-19978'];
const results = analyzeEvolutions(
  ['1076', '1159', '1111', '1004'], 
  3, 
  ronaldo.bio, 
  ronaldo.ovr, 
  ronaldo.stats, 
  ronaldo.playStyles
);

console.log("Ronaldo Found paths:", results.length);
results.forEach((r, i) => {
  console.log(`Path ${i + 1}: ${r.chainIds.join(' -> ')} (OVR: ${r.description})`);
});
