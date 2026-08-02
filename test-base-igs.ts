import { playersDatabase } from './src/data/playersData';

const player = playersDatabase['rodri-91'];
let igs = 0;
let baseFaceSum = 0;

Object.keys(player.stats).forEach(faceKey => {
    const faceObj = player.stats[faceKey as keyof typeof player.stats];
    baseFaceSum += faceObj.baseFace;
    Object.keys(faceObj.subs).forEach(subKey => {
        igs += faceObj.subs[subKey].base;
    });
});

console.log(`Base Stats: ${baseFaceSum}`);
console.log(`IGS: ${igs}`);
