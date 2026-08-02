import { playersDatabase } from './src/data/playersData';
import { simulateEvoChain } from './src/utils/evoEngine';
import { unstoppableForce1111 } from './src/data/evolutions/unstoppableForce1111';

const player = playersDatabase['rodri-91'];
const result = simulateEvoChain(['1111'], player.bio, player.ovr, player.stats, player.playStyles);

console.log("Unstoppable Force Face Passing: ", result.finalStats.pas.baseFace);
