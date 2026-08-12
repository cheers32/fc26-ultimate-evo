import React, { useState, useMemo, useRef } from 'react';
import { X, Check, Ban, Star, Filter, Eye } from 'lucide-react';
import { availableEvolutions } from '../data/evolutionsData';
import { displayExcludedPositions } from '../utils/statUtils';
import { EvoDetailsModal } from './EvoDetailsModal';
import { useModal } from '../utils/modalStack';

// 'required' | 'included' = ACTIVE, in pool
// undefined (no key)      = ACTIVE, NOT in pool  (default)
// 'disabled'              = DISABLED for team (hidden from builder)
export type EvoStatus = 'required' | 'included' | 'disabled';
export type EvoStatuses = Record<string, EvoStatus>;

interface EvoPoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  evoStatuses: EvoStatuses;
  setEvoStatuses: (statuses: EvoStatuses) => void;
}

type TabMode = 'active' | 'disabled';
type FilterMode = 'all' | 'included' | 'not-included' | 'required';

export const EvoPoolModal: React.FC<EvoPoolModalProps> = ({
  isOpen,
  onClose,
  evoStatuses,
  setEvoStatuses
}) => {
  const [tabMode, setTabMode] = useState<TabMode>('active');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [search, setSearch] = useState('');
  const [viewingEvo, setViewingEvo] = useState<string | null>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  // This modal had no key handling at all: Escape did nothing here, and did nothing but close the
  // evo details opened from inside it. 'p' is what opens it, so inside it the same key returns to
  // the search box.
  useModal(isOpen, { onClose, focusRef: searchRef, focusKey: 'p' });

  // undefined = "active, not included" (default state)
  const getStatus = (id: string): EvoStatus | undefined => evoStatuses[id];

  const setStatus = (id: string, status: EvoStatus | undefined) => {
    const next = { ...evoStatuses };
    if (status === undefined) {
      delete next[id];
    } else {
      next[id] = status;
    }
    setEvoStatuses(next);
  };

  const allEvos = Object.values(availableEvolutions);

  // Derived counts for the tab badges
  const activeEvos   = allEvos.filter(e => getStatus(e.id) !== 'disabled');
  const disabledEvos = allEvos.filter(e => getStatus(e.id) === 'disabled');

  const handleSelectAll = () => {
    const next: EvoStatuses = { ...evoStatuses };
    allEvos.forEach(e => { if (next[e.id] !== 'disabled') next[e.id] = 'included'; });
    setEvoStatuses(next);
  };

  const handleClear = () => {
    // Only clear pool statuses (required/included), leave disabled alone
    const next: EvoStatuses = {};
    Object.entries(evoStatuses).forEach(([id, s]) => {
      if (s === 'disabled') next[id] = 'disabled';
    });
    setEvoStatuses(next);
  };

  // Cards visible in the current tab BEFORE applying filter chips
  const tabEvos = tabMode === 'active' ? activeEvos : disabledEvos;

  // Apply filter chips + search within the current tab
  const filteredEvos = useMemo(() => {
    return tabEvos.filter(evo => {
      const status = getStatus(evo.id);   // undefined | 'included' | 'required' | 'disabled'

      const matchesFilter = (() => {
        if (filterMode === 'all') return true;
        if (filterMode === 'required') return status === 'required';
        if (filterMode === 'included') return status === 'included' || status === 'required';
        if (filterMode === 'not-included') return status === undefined || status === 'disabled';
        return true;
      })();

      const matchesSearch = !search || evo.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [tabEvos, filterMode, search, evoStatuses]);

  // Every hook has to run on every render, so the "closed" exit comes after them rather than at
  // the top — with it above the useMemo, opening the modal changed the hook count and React tore
  // the whole app down.
  if (!isOpen) return null;

  // Section grouping within the filtered list
  const requiredSection = filteredEvos.filter(e => getStatus(e.id) === 'required');
  const includedSection = filteredEvos.filter(e => getStatus(e.id) === 'included');
  // "Not included" in ACTIVE tab = no key; in DISABLED tab = disabled status
  const notIncludedSection = filteredEvos.filter(e => {
    const s = getStatus(e.id);
    return s === undefined || s === 'disabled';
  });

  const totalRequired = allEvos.filter(e => getStatus(e.id) === 'required').length;
  const totalIncluded = allEvos.filter(e => getStatus(e.id) === 'included').length;

  // Filter chip definitions — only show relevant chips per tab
  type FilterDef = { key: FilterMode; label: string; inactiveClass: string; activeClass: string };
  const filterDefs: FilterDef[] = [
    {
      key: 'all',
      label: 'All',
      inactiveClass: 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300',
      activeClass: 'bg-gray-700 text-white border-gray-600',
    },
    {
      key: 'included',
      label: `Included${totalRequired + totalIncluded > 0 ? ` (${totalRequired + totalIncluded})` : ''}`,
      inactiveClass: 'border-gray-700 text-gray-500 hover:border-fcGreen/50 hover:text-fcGreen',
      activeClass: 'bg-fcGreen/20 text-fcGreen border-fcGreen/60',
    },
    {
      key: 'not-included',
      label: 'Not Included',
      inactiveClass: 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300',
      activeClass: 'bg-gray-800 text-gray-300 border-gray-600',
    },
    {
      key: 'required',
      label: `Required${totalRequired > 0 ? ` (${totalRequired})` : ''}`,
      inactiveClass: 'border-gray-700 text-gray-500 hover:border-amber-500/50 hover:text-amber-400',
      activeClass: 'bg-amber-950/40 text-amber-400 border-amber-600/60',
    },
  ];

  // In DISABLED tab, only "All" and "Not Included" make sense (all disabled = not included)
  const visibleFilters = tabMode === 'disabled'
    ? filterDefs.filter(f => f.key === 'all')
    : filterDefs;

  const SectionHeader = ({
    label,
    count,
    accent,
  }: {
    label: string;
    count: number;
    accent: string;
  }) => (
    <div className="flex items-center gap-2 mb-3 mt-1">
      <span className={`text-[11px] font-bold uppercase tracking-wider ${accent}`}>
        {label} ({count})
      </span>
      <div className="flex-1 h-px bg-gray-800/80" />
    </div>
  );

  const EvoCard = ({ evo }: { evo: typeof allEvos[0] }) => {
    const status = getStatus(evo.id);
    const isRequired = status === 'required';
    const isIncluded = status === 'included';
    const isDisabled = status === 'disabled';
    // undefined = active, not included

    const cardBorder = isRequired
      ? 'border-amber-500/50 bg-amber-950/15'
      : isIncluded
      ? 'border-fcGreen/40 bg-green-950/15'
      : isDisabled
      ? 'border-gray-800/60 bg-[#181a18]'
      : 'border-gray-800 bg-[#1f211f]';

    return (
      <div className={`relative p-3.5 rounded-xl border transition-all ${cardBorder}`}>
        <div className="mb-2 flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-bold text-sm truncate ${
                isRequired
                  ? 'text-amber-300'
                  : isIncluded
                  ? 'text-fcGreen'
                  : 'text-gray-400'
              }`}
            >
              {evo.name}
            </h3>
            <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wider">{evo.cost}</p>
          </div>
          <button
            onClick={() => setViewingEvo(evo.id)}
            title="View Details"
            className="p-1 bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white rounded-full transition-colors shrink-0"
          >
            <Eye className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-1.5 mb-3 flex-wrap text-[10px]">
          <span className="px-2 py-0.5 bg-black/40 rounded text-gray-500">
            Max OVR {evo.requirements.maxOvr}
          </span>
          {evo.requirements.maxPace && (
            <span className="px-2 py-0.5 bg-black/40 rounded text-gray-500">
              Max PAC {evo.requirements.maxPace}
            </span>
          )}
          {evo.requirements.positions && evo.requirements.positions.length > 0 && (
            <span className="px-2 py-0.5 bg-red-950/40 rounded text-red-400 border border-red-900/50 font-bold">
              Req Pos: {evo.requirements.positions.join(', ')}
            </span>
          )}
          {displayExcludedPositions(evo).length > 0 && (
            <span className="px-2 py-0.5 bg-red-950/40 rounded text-red-400 border border-red-900/50 font-bold">
              Excl Pos: {displayExcludedPositions(evo).join(', ')}
            </span>
          )}
          {evo.positionsAdded && evo.positionsAdded.length > 0 && (
            <span className="px-2 py-0.5 bg-purple-950/40 rounded text-purple-400 border border-purple-800/40 font-bold">
              + Pos: {evo.positionsAdded.join(', ')}
            </span>
          )}
          {evo.rarityChange && (
            <span className="px-2 py-0.5 bg-pink-950/40 rounded text-pink-400 border border-pink-800/40 font-bold">
              {evo.rarityChange}
            </span>
          )}
          {evo.maxRepeatable && evo.maxRepeatable > 1 && (
            <span className="px-2 py-0.5 bg-fcGold/20 rounded text-fcGold border border-fcGold/30 font-bold">
              ×{evo.maxRepeatable}
            </span>
          )}
        </div>

        {/* 3 action buttons */}
        <div className="flex gap-1.5">
          {/* Require — only relevant in ACTIVE tab */}
          {tabMode === 'active' && (
            <button
              onClick={() => setStatus(evo.id, isRequired ? undefined : 'required')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                isRequired
                  ? 'bg-amber-500/25 border-amber-500/60 text-amber-300'
                  : 'bg-black/20 border-gray-700/80 text-gray-600 hover:border-amber-600/40 hover:text-amber-400'
              }`}
            >
              <Star className="w-2.5 h-2.5" />
              Require
            </button>
          )}

          {/* Included — only relevant in ACTIVE tab */}
          {tabMode === 'active' && (
            <button
              onClick={() => setStatus(evo.id, isIncluded ? undefined : 'included')}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                isIncluded
                  ? 'bg-fcGreen/20 border-fcGreen/50 text-fcGreen'
                  : 'bg-black/20 border-gray-700/80 text-gray-600 hover:border-fcGreen/40 hover:text-fcGreen'
              }`}
            >
              <Check className="w-2.5 h-2.5" />
              Included
            </button>
          )}

          {/* Disable — toggles team-level disabled state */}
          <button
            onClick={() => setStatus(evo.id, isDisabled ? undefined : 'disabled')}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
              isDisabled
                ? 'bg-red-950/30 border-red-700/50 text-red-400'
                : 'bg-black/20 border-gray-700/80 text-gray-600 hover:border-red-700/40 hover:text-red-400'
            }`}
          >
            <Ban className="w-2.5 h-2.5" />
            {isDisabled ? 'Enable' : 'Disable'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#1A1C1A] border border-gray-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-800 bg-[#1f211f]">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white tracking-wide">Team Evo Manager</h2>
              <p className="text-xs text-gray-500 mt-1">
                Manage which evolutions are available for your entire team. Disabled evolutions will be hidden from the builder and analyzer.
              </p>
            </div>

            {/* ACTIVE / DISABLED top tabs */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => { setTabMode('active'); setFilterMode('all'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  tabMode === 'active'
                    ? 'bg-fcGreen text-black border-fcGreen shadow'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:text-white'
                }`}
              >
                <Check className="w-3 h-3" />
                ACTIVE
                <span className={`ml-0.5 text-[10px] ${tabMode === 'active' ? 'opacity-70' : 'opacity-50'}`}>
                  ({activeEvos.length})
                </span>
              </button>
              <button
                onClick={() => { setTabMode('disabled'); setFilterMode('all'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  tabMode === 'disabled'
                    ? 'bg-gray-700 text-white border-gray-600 shadow'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:text-white'
                }`}
              >
                <Ban className="w-3 h-3" />
                DISABLED
                <span className={`ml-0.5 text-[10px] opacity-60`}>
                  ({disabledEvos.length})
                </span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pool filter chips — right under description, always visible */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {([
              { key: 'all' as FilterMode,          label: 'ALL' },
              { key: 'included' as FilterMode,     label: 'INCLUDED' },
              { key: 'not-included' as FilterMode, label: 'NOT INCLUDED' },
              { key: 'required' as FilterMode,     label: 'REQUIRED' },
            ]).map(f => (
              <button
                key={f.key}
                onClick={() => setFilterMode(f.key)}
                className={`px-3 py-1 text-[11px] font-bold tracking-wide border rounded transition-all ${
                  filterMode === f.key
                    ? f.key === 'included'
                      ? 'bg-fcGreen/20 text-fcGreen border-fcGreen/60'
                      : f.key === 'required'
                      ? 'bg-amber-950/40 text-amber-400 border-amber-600/60'
                      : f.key === 'not-included'
                      ? 'bg-gray-700/60 text-gray-200 border-gray-500'
                      : 'bg-gray-700/60 text-gray-200 border-gray-500'
                    : 'bg-transparent text-gray-500 border-gray-700 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                {f.label}
                {f.key === 'included' && totalRequired + totalIncluded > 0 && (
                  <span className="ml-1 opacity-70">({totalRequired + totalIncluded})</span>
                )}
                {f.key === 'required' && totalRequired > 0 && (
                  <span className="ml-1 opacity-70">({totalRequired})</span>
                )}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="mt-3">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search EVOs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#121212] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-fcGreen/40 transition-colors"
            />
          </div>

        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[#121212]">
          {/* Summary + actions */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-500">
              {tabMode === 'active' ? (
                <>
                  <span className="text-amber-400 font-bold">{totalRequired}</span> required ·{' '}
                  <span className="text-fcGreen font-bold">{totalIncluded}</span> included ·{' '}
                  <span className="text-gray-600">
                    {activeEvos.length - totalRequired - totalIncluded}
                  </span>{' '}
                  not included
                </>
              ) : (
                <span className="text-gray-500">{disabledEvos.length} EVOs disabled for this team</span>
              )}
            </span>
            {tabMode === 'active' && (
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-xs px-3 py-1.5 bg-[#2A2D2A] hover:bg-[#374151] border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  Include All
                </button>
                <button
                  onClick={handleClear}
                  className="text-xs px-3 py-1.5 bg-[#2A2D2A] hover:bg-[#374151] border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                  Clear Pool
                </button>
              </div>
            )}
          </div>

          {filteredEvos.length === 0 && (
            <div className="text-center text-gray-600 text-sm py-14">
              {tabMode === 'disabled' && disabledEvos.length === 0
                ? 'No EVOs are currently disabled.'
                : 'No EVOs match your filter.'}
            </div>
          )}

          {/* ACTIVE tab: sectioned by status */}
          {tabMode === 'active' && (
            <>
              {requiredSection.length > 0 && (
                <div className="mb-5">
                  <SectionHeader label="Must Include" count={requiredSection.length} accent="text-amber-400" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {requiredSection.map(evo => <EvoCard key={evo.id} evo={evo} />)}
                  </div>
                </div>
              )}

              {includedSection.length > 0 && (
                <div className="mb-5">
                  <SectionHeader label="Included" count={includedSection.length} accent="text-fcGreen" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {includedSection.map(evo => <EvoCard key={evo.id} evo={evo} />)}
                  </div>
                </div>
              )}

              {/* Not Included: shown in "All" and "Not Included" filter modes */}
              {notIncludedSection.length > 0 && (filterMode === 'all' || filterMode === 'not-included') && (
                <div className="mb-5">
                  <SectionHeader
                    label="Not Included"
                    count={notIncludedSection.length}
                    accent="text-gray-500"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {notIncludedSection.map(evo => <EvoCard key={evo.id} evo={evo} />)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* DISABLED tab: flat list */}
          {tabMode === 'disabled' && filteredEvos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredEvos.map(evo => <EvoCard key={evo.id} evo={evo} />)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 bg-[#1f211f] flex justify-between items-center gap-3">
          <span className="text-xs text-gray-500">
            {totalRequired + totalIncluded} / {allEvos.length} active in pool ·{' '}
            {disabledEvos.length} disabled
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-gray-300 bg-[#2A2D2A] hover:bg-[#374151] transition-colors border border-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-bold text-black bg-[#1ED760] hover:bg-[#1db954] transition-colors shadow-lg"
            >
              Confirm
            </button>
          </div>
        </div>

      </div>

      {/* The eye on every card sets this — without the modal rendered here, clicking it does nothing. */}
      <EvoDetailsModal evoId={viewingEvo} onClose={() => setViewingEvo(null)} />
    </div>
  );
};
