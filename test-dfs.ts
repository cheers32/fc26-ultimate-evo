import { analyzeEvolutions } from './src/utils/evoEngine';
import { playersDatabase } from './src/data/playersData';
import { availableEvolutions } from './src/data/evolutionsData';

const rodri = playersDatabase['rodri-91'];
const results = analyzeEvolutions(Object.keys(availableEvolutions), 3, rodri.bio, rodri.ovr, rodri.stats, rodri.playStyles, 99);
console.log(results[0].name);
console.log(results[0].chainIds);
const k = results[0].steps[results[0].steps.length - 1].statsAfter;
console.log("Shooting:", k.sho.subs);
console.log("Physical:", k.phy.subs);
