import React from 'react';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { PlayerBio, StatsData } from '../types/player';
import { getStatColorClass } from '../utils/statUtils';
import { verdictAt } from '../utils/traits';

/**
 * Three things the card does well and three it doesn't, at the position it is being judged at.
 *
 * The scores say where a card stands; this says what to do about it. "Weak in the air 67" sends you
 * looking for a heading evo in a way that "Defending 96" never will — and because both sides are
 * drawn from the same plan the position score uses, the sentence and the number can never disagree.
 *
 * Stats only. PlayStyles have their own score and belong in it.
 */
export const CardVerdict: React.FC<{
  stats: StatsData;
  bio: PlayerBio;
  position: string;
  /** Which card this is about — the step on the chain it was read from. */
  context?: string;
}> = ({ stats, bio, position, context }) => {
  const verdict = React.useMemo(() => verdictAt(stats, bio, position), [stats, bio, position]);
  if (!verdict || (verdict.strengths.length === 0 && verdict.weaknesses.length === 0)) return null;

  const column = (
    title: string,
    icon: React.ReactNode,
    tone: string,
    rows: { label: string; text: string; textZh: string; value: number; detail: string }[],
    empty: string
  ) => (
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider mb-2 ${tone}`}>
        {icon}
        {title}
      </div>
      {rows.length === 0 ? (
        <div className="text-[11px] text-gray-600 italic">{empty}</div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {rows.map(row => (
            <div
              key={row.label}
              title={`${row.label} — ${row.detail}`}
              className="flex items-baseline justify-between gap-3 bg-[#1f211f] border border-gray-800/90 rounded px-2 py-1"
            >
              <div className="min-w-0">
                <div className="text-[12px] text-gray-200 truncate">{row.text}</div>
                {/* The same sentence in Chinese, under the English rather than instead of it —
                    the numbers and the stat names stay in the language the game prints them in. */}
                <div className="text-[11.5px] text-gray-300 truncate">{row.textZh}</div>
                <div className="text-[9.5px] text-gray-500 truncate">{row.label} · {row.detail}</div>
              </div>
              <span className={`font-mono text-[13px] shrink-0 ${getStatColorClass(row.value)}`}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-4 bg-[#1A1C1A] border border-gray-800 rounded-xl p-3">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">
        As a {verdict.position} · judged as {verdict.plan.name}
        {context ? ` · after ${context}` : ''} · stats only
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        {column(
          'Strengths',
          <ThumbsUp className="w-3.5 h-3.5" />,
          'text-fcGreen',
          verdict.strengths,
          'Nothing here clears the bar for this position yet.'
        )}
        {column(
          'Needs work',
          <ThumbsDown className="w-3.5 h-3.5" />,
          'text-red-400',
          verdict.weaknesses,
          'Nothing this position needs is short.'
        )}
      </div>
    </div>
  );
};
