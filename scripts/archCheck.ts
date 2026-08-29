import { calculateAccelerateFamily, calculateAccelerateType } from '../src/utils/statUtils';
for (const [n, acc, agi, str] of [['A', 99, 95, 99], ['B', 98, 93, 99]] as [string, number, number, number][]) {
  console.log(`${n}: acc ${acc} agi ${agi} str ${str} @192cm → ${calculateAccelerateFamily(acc, agi, str, 192)} / ${calculateAccelerateType(acc, agi, str, 192)} · str−agi = +${str - agi}`);
}
