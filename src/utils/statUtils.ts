export interface ChipInfo {
  text: string;
  className: string;
}

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
