import { analyzeEvolutions } from './src/utils/evoEngine';
import { playersDatabase } from './src/data/playersData';

const rodri = playersDatabase['rodri-91'];
const results = analyzeEvolutions(
  ['1076', '1159', '1111', '1004'], 
  3, 
  rodri.bio, 
  rodri.ovr, 
  rodri.stats, 
  rodri.playStyles
);

console.log("Found paths:", results.length);
results.forEach((r, i) => {
  console.log(`Path ${i + 1}: ${r.chainIds.join(' -> ')} (OVR: ${r.description})`);
});
