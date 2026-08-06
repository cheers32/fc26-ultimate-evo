export interface ChipInfo {
  text: string;
  className: string;
}

export const getStatColorClass = (val: number) => {
  if (val >= 95) return 'text-purple-400 drop-shadow-[0_0_3px_rgba(192,132,252,0.4)] font-black';
  if (val >= 90) return 'text-fcGreen font-bold';
  if (val >= 80) return 'text-lime-400 font-semibold';
  if (val >= 70) return 'text-yellow-500 font-semibold';
  return 'text-red-500 opacity-90';
};

export function calculateChip(
  base: number,
  allowedBoost: number,
  limit: number,
  actualBoost: number,
  isOvr: boolean = false
): ChipInfo | null {
  if (allowedBoost <= 0) return null;

  const hitLimit = base + allowedBoost >= limit; // Capped out, lost some stats OR hit exactly
  const utilRate = actualBoost / allowedBoost;

  let className = "";

  if (hitLimit) {
    if (utilRate >= 0.8) {
      className = isOvr
        ? "text-green-800 bg-green-200 border border-green-600 shadow-[0_0_4px_rgba(74,222,128,0.5)]"
        : "text-green-400 bg-green-900/40 border border-green-600/50";
    } else if (utilRate >= 0.4) {
      className = isOvr
        ? "text-yellow-800 bg-yellow-200 border border-yellow-600 shadow-[0_0_4px_rgba(234,179,8,0.5)]"
        : "text-yellow-400 bg-yellow-900/40 border border-yellow-600/50";
    } else {
      className = isOvr
        ? "text-red-900 bg-red-200 border border-red-600 shadow-[0_0_4px_rgba(248,113,113,0.5)]"
        : "text-red-400 bg-red-900/40 border border-red-600/50";
    }
  } else {
    className = isOvr
      ? "text-green-800 bg-green-200/80"
      : "text-green-400 bg-green-900/20";
  }

  return {
    text: `+${actualBoost}/${allowedBoost}/${limit}`,
    className
  };
}

export function calculateAccelerateType(
  acc: number,
  agi: number,
  str: number
): "Lengthy" | "Controlled" | "Explosive" {
  if (acc >= 40) {
    const diff = str - agi;
    if (diff >= 4) {
      return "Lengthy";
    }
  }
  return "Controlled";
}

/**
 * The short "what this evo asks for and gives" line shown on evo cards:
 *
 *   92/3 (+3 94)   max OVR to enter / max PS+ to enter, then the OVR boost and the OVR it caps at
 *   96/∞           an evo that grants no OVR — the cap would be noise, so it's left off
 */
export function formatEvoTerms(evo: import('../types/player').EvolutionDefinition): string {
  const entry = `${evo.requirements.maxOvr || 99}/${evo.requirements.maxPlayStylesPlus ?? '∞'}`;
  return evo.ovrBoost.boost > 0 ? `${entry} (+${evo.ovrBoost.boost} ${evo.ovrBoost.limit})` : entry;
}
