import { simulateEvoChain } from './src/utils/evoEngine';
import { playersDatabase } from './src/data/playersData';

const rodri = playersDatabase['rodri-91'];
const result = simulateEvoChain(['1111', '1154', '1159'], rodri.bio, rodri.ovr, rodri.stats, rodri.playStyles);

const output = {};
for (const k of Object.keys(result.finalStats)) {
  output[k] = {};
  for (const sk of Object.keys(result.finalStats[k].subs)) {
    output[k][sk] = result.finalStats[k].subs[sk].base;
  }
}
console.log(output);
