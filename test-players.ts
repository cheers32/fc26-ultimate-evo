import { playersDatabase } from './src/data/playersData';

for (const k of Object.keys(playersDatabase)) {
  const p = playersDatabase[k];
  console.log(k, p.stats.phy.subs.jumping.base, p.stats.phy.subs.stamina.base, p.stats.phy.subs.strength.base, p.stats.phy.subs.aggression.base);
}
