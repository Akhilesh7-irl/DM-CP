// ═══════════════════════════════════════════════════════════════════════════════
// AgriGuard — Dashboard Layout Component
// Warm Editorial Financial-Journal Design
// Palette: Wine/Burgundy, Sage Olive, Warm Amber, Deep Terracotta, Cream
// ═══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { useClaims } from '../context/ClaimsContext';
import {
  formatInr,
  formatRiskPercent,
} from '../utils/formatters';
import {
  ShieldAlert,
  Search,
  Filter,
  RotateCcw,
  Pin,
  ChevronRight,
  X,
  FileText,
  Network,
  Eye,
  Activity,
  Layers,
  Minimize2,
  Download,
  RefreshCw,
} from 'lucide-react';
import { NetworkGraphPanel } from './NetworkGraphPanel';
import { AnalyticsPanel } from './AnalyticsPanel';



export function DashboardLayout() {
  const {
    state,
    filteredClaims,
    selectedClaim,
    stats,
    selectClaim,
    updateFilters,
    resetFilters,
    setSort,
    toggleSortDirection,
    toggleDetailPanel,
    toggleNetworkPanel,
    togglePinClaim,
    setInvestigatorNotes,
    refetchClaims,
  } = useClaims();

  const [activeTab, setActiveTab] = useState<'claims' | 'analytics' | 'network'>('claims');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tablePage, setTablePage] = useState(0);
  const pageSize = 50;
  const visibleClaims = filteredClaims.slice(tablePage * pageSize, (tablePage + 1) * pageSize);
  useEffect(() => setTablePage(0), [state.filters]);

  // Active filter state variables
  const currentSearch = state.filters.searchQuery;
  const activeTiers = state.filters.tiers;
  const isAllTiersActive = activeTiers.length === 0;
  const exportClaims = () => {
    const columns = ['Claim ID','Policy','Producer','Assessor','District','Taluka','Crop','Peril','Claim amount INR','Risk score','Triage','Rule flag'];
    const rows = filteredClaims.map((c) => [c.metadata.claimId,c.metadata.policyNumber,c.metadata.farmerName,c.metadata.assessorName,c.metadata.parcel.district,c.metadata.parcel.taluka,c.metadata.cropType,c.metadata.perilType,c.metadata.claimAmountInr,c.riskScore.composite * 100,c.riskScore.tier,c.riskFlag ?? 0]);
    const csv = [columns, ...rows].map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"','""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'agriguard-claims.csv'; anchor.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FBF8F3] text-[#2D2926] font-sans antialiased select-none">
      {/* ── 1. SIDEBAR — Warm cream navigation shelf ────────────────────────── */}
      <aside
        className={`flex flex-col justify-between border-r border-[#E8E2D9] bg-[#FBF8F3] transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="flex h-16 items-center justify-between border-b border-[#E8E2D9] px-4">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C2D3E] text-white text-xs font-bold tracking-wider">
                  AG
                </div>
                <div>
                  <h1 className="font-serif text-[15px] font-bold tracking-wide text-[#2D2926]">
                    AgriGuard
                  </h1>
                  <p className="text-[10px] uppercase tracking-widest text-[#6B635B]">
                    Risk Analytics v2.4
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C2D3E] text-white text-xs font-bold">
                AG
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-[#6B635B] hover:text-[#2D2926] transition-colors p-1.5 rounded-lg hover:bg-[#E8E2D9]"
              title={sidebarCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <Minimize2 size={14} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 px-3 space-y-1">
            <button
              onClick={() => setActiveTab('claims')}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                activeTab === 'claims'
                  ? 'bg-[#7C2D3E] text-white shadow-sm'
                  : 'text-[#6B635B] hover:bg-[#E8E2D9] hover:text-[#2D2926]'
              }`}
            >
              <ShieldAlert size={16} className={activeTab === 'claims' ? 'text-white/80' : 'text-[#7C2D3E]'} />
              {!sidebarCollapsed && <span>Claims Triage</span>}
            </button>

            <button
              onClick={() => {
                setActiveTab('network');
                toggleNetworkPanel(true);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                activeTab === 'network'
                  ? 'bg-[#7C2D3E] text-white shadow-sm'
                  : 'text-[#6B635B] hover:bg-[#E8E2D9] hover:text-[#2D2926]'
              }`}
            >
              <Network size={16} className={activeTab === 'network' ? 'text-white/80' : 'text-[#C17C2A]'} />
              {!sidebarCollapsed && <span>Claim Network</span>}
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); toggleDetailPanel(false); toggleNetworkPanel(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-[#7C2D3E] text-white shadow-sm'
                  : 'text-[#6B635B] hover:bg-[#E8E2D9] hover:text-[#2D2926]'
              }`}
            >
              <Layers size={16} className={activeTab === 'analytics' ? 'text-white/80' : 'text-[#5B7553]'} />
              {!sidebarCollapsed && <span>Portfolio Analytics</span>}
            </button>
          </nav>

          {/* Quick Metrics Summary Sidebar Widget */}
          {!sidebarCollapsed && (
            <div className="mx-3 mt-8 rounded-xl border border-[#E8E2D9] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#6B635B] mb-3">
                <span className="font-semibold">Risk Distribution</span>
                <Activity size={12} className="text-[#7C2D3E]" />
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#B84233] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B84233]"></span>
                    Investigate
                  </span>
                  <span className="font-mono font-bold text-[#2D2926]">{stats.tierCounts.investigate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#C17C2A] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C17C2A]"></span>
                    Review
                  </span>
                  <span className="font-mono font-bold text-[#2D2926]">{stats.tierCounts.review}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#5B7553] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5B7553]"></span>
                    Safe
                  </span>
                  <span className="font-mono font-bold text-[#2D2926]">{stats.tierCounts.safe}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Sidebar Status Footer */}
        <div className="border-t border-[#E8E2D9] p-3 text-[11px] text-[#6B635B]">
          {!sidebarCollapsed ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>Portfolio:</span>
                <span className="text-[#C17C2A] font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C17C2A]"></span>
                  PORTFOLIO
                </span>
              </div>
              <div className="text-[10px] text-[#6B635B]/60">
                Portfolio records
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="h-2 w-2 rounded-full bg-[#5B7553]" title="Illustrative portfolio data"></span>
            </div>
          )}
        </div>
      </aside>

      {/* ── 2. MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Control Bar */}
        <header className="flex h-14 items-center justify-between border-b border-[#E8E2D9] bg-white px-6">
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase text-[#6B635B] tracking-wider">
              PMFBY Portfolio /
            </span>
            <h2 className="font-serif text-base font-bold text-[#2D2926]">
              Fraud Risk Assessment & Triage Workspace
            </h2>
          </div>

          {/* Metrics & Actions */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B635B]">Total Exposure:</span>
              <span className="font-mono font-bold text-[#2D2926]">{formatInr(stats.totalExposureUsd)}</span>
            </div>
            <div className="h-4 w-px bg-[#E8E2D9]"></div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6B635B]">Avg Risk:</span>
              <span className="font-mono font-bold text-[#B84233]">{formatRiskPercent(stats.avgCompositeScore)}</span>
            </div>
            <div className="h-4 w-px bg-[#E8E2D9]"></div>

            {/* Layout Toggle Actions */}
            <div className="flex items-center gap-1.5">
              <button onClick={exportClaims} className="rounded-full border border-[#E8E2D9] bg-white p-2 text-[#6B635B] hover:text-[#2D2926]" title="Export filtered claims as CSV"><Download size={14} /></button>
              <button onClick={refetchClaims} className="rounded-full border border-[#E8E2D9] bg-white p-2 text-[#6B635B] hover:text-[#2D2926]" title="Reload portfolio claims"><RefreshCw size={14} /></button>
              <button
                onClick={() => toggleDetailPanel()}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  state.isDetailPanelOpen
                    ? 'border-[#7C2D3E] bg-[#7C2D3E]/5 text-[#7C2D3E]'
                    : 'border-[#E8E2D9] bg-white text-[#6B635B] hover:bg-[#FBF8F3] hover:text-[#2D2926]'
                }`}
              >
                <FileText size={14} />
                <span>Inspector</span>
              </button>

              <button
                onClick={() => toggleNetworkPanel()}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  state.isNetworkPanelOpen
                    ? 'border-[#C17C2A] bg-[#C17C2A]/5 text-[#C17C2A]'
                    : 'border-[#E8E2D9] bg-white text-[#6B635B] hover:bg-[#FBF8F3] hover:text-[#2D2926]'
                }`}
              >
                <Network size={14} />
                <span>Claim Network</span>
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'analytics' ? <AnalyticsPanel claims={filteredClaims} /> : <>
        {/* Filter & Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E2D9] bg-[#E8E2D9]/40 px-6 py-2.5">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B635B]" size={14} />
            <input
              type="text"
              value={currentSearch}
              onChange={(e) => { setTablePage(0); updateFilters({ searchQuery: e.target.value }); }}
              placeholder="Search claim, producer, assessor, district, taluka, crop, peril..."
              className="w-full rounded-full border border-[#E8E2D9] bg-white pl-9 pr-3 py-1.5 text-xs text-[#2D2926] placeholder-[#6B635B]/50 focus:border-[#7C2D3E] focus:outline-none focus:ring-1 focus:ring-[#7C2D3E]/30"
            />
            {currentSearch && (
              <button
                onClick={() => { setTablePage(0); updateFilters({ searchQuery: '' }); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B635B] hover:text-[#2D2926]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 p-0.5">
              <button
                onClick={() => updateFilters({ tiers: [] })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isAllTiersActive
                    ? 'bg-[#7C2D3E] text-white font-semibold shadow-sm'
                    : 'text-[#6B635B] hover:bg-[#E8E2D9]'
                }`}
              >
                All ({stats.totalClaims})
              </button>
              <button
                onClick={() => updateFilters({ tiers: ['investigate'] })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTiers.includes('investigate')
                    ? 'bg-[#B84233] text-white font-semibold shadow-sm'
                    : 'text-[#B84233] hover:bg-[#B84233]/10'
                }`}
              >
                Investigate ({stats.tierCounts.investigate})
              </button>
              <button
                onClick={() => updateFilters({ tiers: ['review'] })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTiers.includes('review')
                    ? 'bg-[#C17C2A] text-white font-semibold shadow-sm'
                    : 'text-[#C17C2A] hover:bg-[#C17C2A]/10'
                }`}
              >
                Review ({stats.tierCounts.review})
              </button>
              <button
                onClick={() => updateFilters({ tiers: ['safe'] })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeTiers.includes('safe')
                    ? 'bg-[#5B7553] text-white font-semibold shadow-sm'
                    : 'text-[#5B7553] hover:bg-[#5B7553]/10'
                }`}
              >
                Safe ({stats.tierCounts.safe})
              </button>
            </div>

            {/* Pinned Filter Toggle */}
            <button
              onClick={() => updateFilters({ pinnedOnly: !state.filters.pinnedOnly })}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium transition-colors ${
                state.filters.pinnedOnly
                  ? 'border-[#C17C2A] bg-[#C17C2A]/5 text-[#C17C2A]'
                  : 'border-[#E8E2D9] bg-white text-[#6B635B] hover:bg-[#FBF8F3]'
              }`}
            >
              <Pin size={12} className={state.filters.pinnedOnly ? 'fill-[#C17C2A]' : ''} />
              <span>Pinned Only</span>
            </button>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[#6B635B] hover:text-[#2D2926] px-2 py-1 rounded-full hover:bg-[#E8E2D9]"
              title="Reset Filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ── 3. CLAIMS TABLE & INSPECTOR SPLIT ────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Left Pane: Claims Table */}
          <main
            className={`flex-1 flex flex-col overflow-y-auto bg-[#FBF8F3] transition-all ${
              state.isDetailPanelOpen || state.isNetworkPanelOpen ? 'w-1/2 min-w-[520px]' : 'w-full'
            }`}
          >
            {filteredClaims.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 p-12 text-center text-[#6B635B]">
                <Filter size={32} className="mb-3 text-[#E8E2D9]" />
                <p className="font-serif text-base font-semibold text-[#2D2926]">No claims match the active filter criteria.</p>
                <p className="text-xs mt-1 text-[#6B635B]">
                  Try adjusting your search query or clearing risk tier filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 rounded-full bg-[#7C2D3E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#6A2535] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="w-full">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#E8E2D9] bg-white text-[11px] uppercase text-[#6B635B] sticky top-0 z-10">
                      <th className="py-3 px-4 w-10 text-center font-medium">Pin</th>
                      <th
                        className="py-3 px-4 font-semibold cursor-pointer hover:text-[#2D2926] tracking-wider"
                        onClick={() => {
                          setSort('claimId');
                          toggleSortDirection();
                        }}
                      >
                        Claim ID / Policy
                      </th>
                      <th className="py-3 px-4 font-semibold tracking-wider">Producer & Assessor</th>
                      <th className="py-3 px-4 font-semibold tracking-wider">Crop / Cause</th>
                      <th
                        className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-[#2D2926] tracking-wider"
                        onClick={() => {
                          setSort('claimAmountInr');
                          toggleSortDirection();
                        }}
                      >
                        Claim Indemnity
                      </th>
                      <th
                        className="py-3 px-4 font-semibold text-center cursor-pointer hover:text-[#2D2926] tracking-wider"
                        onClick={() => {
                          setSort('composite');
                          toggleSortDirection();
                        }}
                      >
                        Risk Index & Tier
                      </th>
                      <th className="py-3 px-4 font-semibold text-center tracking-wider">Pillar Anomalies</th>
                      <th className="py-3 px-4 font-semibold text-right pr-5 tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleClaims.map((claim, rowIdx) => {
                      const isSelected = selectedClaim?.metadata.claimId === claim.metadata.claimId;
                      const gnnCount = claim.anomalies.filter((a) => a.pillar === 'gnn').length;

                      return (
                        <tr
                          key={claim.metadata.claimId}
                          onClick={() => { setActiveTab('claims'); selectClaim(claim.metadata.claimId); }}
                          className={`cursor-pointer transition-colors border-b border-[#E8E2D9]/60 ${
                            isSelected
                              ? 'bg-[#7C2D3E]/5 hover:bg-[#7C2D3E]/8'
                              : rowIdx % 2 === 0
                              ? 'bg-white hover:bg-[#FBF8F3]'
                              : 'bg-[#FBF8F3] hover:bg-[#E8E2D9]/30'
                          }`}
                        >
                          {/* Pin Toggle */}
                          <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => togglePinClaim(claim.metadata.claimId)}
                              className="text-[#6B635B]/40 hover:text-[#C17C2A] transition-colors"
                            >
                              <Pin
                                size={13}
                                className={claim.isPinned ? 'fill-[#C17C2A] text-[#C17C2A]' : ''}
                              />
                            </button>
                          </td>

                          {/* Claim ID & Policy */}
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-[#2D2926] text-[13px]">
                              {claim.metadata.claimId}
                            </div>
                            <div className="text-[10px] font-mono text-[#6B635B]">
                              {claim.metadata.policyNumber}
                            </div>
                          </td>

                          {/* Producer & Assessor */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#2D2926]">{claim.metadata.farmerName}</div>
                            <div className="text-[10px] text-[#6B635B]">{claim.metadata.parcel.taluka}, {claim.metadata.parcel.district}</div>
                            <div className="text-[10px] text-[#6B635B]">Assessor: {claim.metadata.assessorName}</div>
                          </td>

                          {/* Crop & Peril */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#2D2926]">{claim.metadata.cropType}</div>
                            <div className="text-[10px] text-[#6B635B]">{claim.metadata.perilType} · {claim.metadata.claimedDamagePct}% reported loss</div>
                          </td>

                          {/* Indemnity Amount */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="font-mono font-bold text-[#2D2926]">
                              {formatInr(claim.metadata.claimAmountInr)}
                            </div>
                            <div className="text-[10px] font-mono text-[#6B635B]">
                              Est. coverage: {formatInr(claim.metadata.policyValueInr)}
                            </div>
                          </td>

                          {/* Risk Index & Tier */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                                  claim.riskScore.tier === 'investigate'
                                    ? 'bg-[#B84233]/10 text-[#B84233]'
                                    : claim.riskScore.tier === 'review'
                                    ? 'bg-[#C17C2A]/10 text-[#C17C2A]'
                                    : 'bg-[#5B7553]/10 text-[#5B7553]'
                                }`}
                              >
                                {formatRiskPercent(claim.riskScore.composite)} ({claim.riskScore.tier})
                              </span>
                            </div>
                          </td>

                          {/* Pillar Anomaly Flags */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5 font-mono text-[10px]">
                              {gnnCount > 0 && (
                                <span
                                  className="rounded-full bg-[#5B7553]/10 text-[#5B7553] px-2 py-0.5 font-semibold"
                                  title="Precomputed risk signal"
                                >
                                  Signal:{gnnCount}
                                </span>
                              )}
                              {claim.rulesFired && claim.rulesFired.length > 0 && (
                                <span
                                  className="rounded-full bg-[#7C2D3E]/10 text-[#7C2D3E] px-2 py-0.5 font-semibold"
                                  title={`Rules: ${claim.rulesFired.join(', ')}`}
                                >
                                  Logic:{claim.rulesFired.length}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Inspect Action */}
                          <td className="py-3.5 px-4 text-right pr-5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => { setActiveTab('claims'); selectClaim(claim.metadata.claimId); }}
                              className="rounded-full border border-[#E8E2D9] bg-white px-3 py-1.5 text-[11px] font-medium text-[#6B635B] hover:border-[#7C2D3E] hover:bg-[#7C2D3E]/5 hover:text-[#7C2D3E] transition-colors"
                            >
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="flex items-center justify-between border-t border-[#E8E2D9] bg-white px-4 py-3 text-xs text-[#6B635B]">
                  <span>{filteredClaims.length ? `${tablePage * pageSize + 1}–${Math.min((tablePage + 1) * pageSize, filteredClaims.length)} of ${filteredClaims.length.toLocaleString('en-IN')}` : '0 claims'}</span>
                  <div className="flex gap-2"><button disabled={tablePage === 0} onClick={() => setTablePage((page) => Math.max(0, page - 1))} className="rounded-full border border-[#E8E2D9] px-3 py-1 disabled:opacity-40">Previous</button><button disabled={(tablePage + 1) * pageSize >= filteredClaims.length} onClick={() => setTablePage((page) => page + 1)} className="rounded-full border border-[#E8E2D9] px-3 py-1 disabled:opacity-40">Next</button></div>
                </div>
              </div>
            )}
          </main>

          {/* ── 4. RIGHT PANE: DETAIL INSPECTOR ─────────────────────────────────── */}
          {state.isDetailPanelOpen && (
            <aside className="w-1/2 min-w-[480px] max-w-2xl border-l border-[#E8E2D9] bg-white flex flex-col overflow-y-auto">
              {selectedClaim ? (
                <div className="flex flex-col flex-1">
                  {/* Claim Inspector Header */}
                  <div className="px-6 py-5 border-b border-[#E8E2D9]">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-mono text-lg font-bold text-[#2D2926]">
                            {selectedClaim.metadata.claimId}
                          </h3>
                          <span
                            className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              selectedClaim.riskScore.tier === 'investigate'
                                ? 'bg-[#B84233] text-white'
                                : selectedClaim.riskScore.tier === 'review'
                                ? 'bg-[#C17C2A] text-white'
                                : 'bg-[#5B7553] text-white'
                            }`}
                          >
                            {selectedClaim.riskScore.tier} Tier
                          </span>
                        </div>
                        <p className="text-xs text-[#6B635B] mt-1.5 font-mono">
                          Policy: {selectedClaim.metadata.policyNumber} ({selectedClaim.metadata.policyType})
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => togglePinClaim(selectedClaim.metadata.claimId)}
                          className="p-1.5 text-[#6B635B] hover:text-[#C17C2A] rounded-lg hover:bg-[#FBF8F3]"
                          title="Pin Claim"
                        >
                          <Pin
                            size={16}
                            className={selectedClaim.isPinned ? 'fill-[#C17C2A] text-[#C17C2A]' : ''}
                          />
                        </button>
                        <button
                          onClick={() => toggleDetailPanel(false)}
                          className="p-1.5 text-[#6B635B] hover:text-[#2D2926] rounded-lg hover:bg-[#FBF8F3]"
                          title="Close Inspector"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Quick Metadata Summary Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-[#E8E2D9] text-xs">
                      <div>
                        <span className="text-[10px] text-[#6B635B] uppercase block mb-0.5 tracking-wider">Producer</span>
                        <span className="font-semibold text-[#2D2926]">{selectedClaim.metadata.farmerName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6B635B] uppercase block mb-0.5 tracking-wider">Assessor</span>
                        <span className="font-semibold text-[#2D2926]">{selectedClaim.metadata.assessorName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6B635B] uppercase block mb-0.5 tracking-wider">Indemnity Claim</span>
                        <span className="font-mono font-bold text-[#B84233]">{formatInr(selectedClaim.metadata.claimAmountInr)}</span>
                      </div>
                      <div><span className="text-[10px] text-[#6B635B] uppercase block mb-0.5 tracking-wider">Reported Loss</span><span className="font-semibold">{selectedClaim.metadata.claimedDamagePct}% · {selectedClaim.metadata.perilType}</span></div>
                      <div><span className="text-[10px] text-[#6B635B] uppercase block mb-0.5 tracking-wider">Farm Location</span><span className="font-semibold">{selectedClaim.metadata.parcel.taluka}, {selectedClaim.metadata.parcel.district}</span></div>
                      <div><span className="text-[10px] text-[#6B635B] uppercase block mb-0.5 tracking-wider">Area / Weather Zone</span><span className="font-semibold">{selectedClaim.metadata.parcel.insuredAcres} ac · {selectedClaim.metadata.parcel.cluTractId}</span></div>
                      <div><span className="text-[10px] text-[#6B635B] uppercase block mb-0.5 tracking-wider">Reported / Inspected</span><span className="font-mono">{selectedClaim.metadata.lossReportDate} / {selectedClaim.metadata.inspectionDate}</span></div>
                    </div>
                  </div>

                  {/* Risk Breakdown: precomputed score + symbolic logic */}
                  <div className="px-6 py-5 space-y-4 border-b border-[#E8E2D9]">
                    <h4 className="font-serif text-sm font-bold text-[#2D2926]">
                      Risk Engine Breakdown
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      {/* GNN Score Card */}
                      <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 text-center shadow-sm">
                        <div className="w-1 h-6 bg-[#5B7553] rounded-full mx-auto mb-2"></div>
                        <span className="text-[10px] font-semibold text-[#5B7553] uppercase block tracking-wider">
                          Graph Risk Score
                        </span>
                        <span className="font-mono text-xl font-bold text-[#2D2926] mt-1 block">
                          {formatRiskPercent(selectedClaim.riskScore.pillars.gnn.raw)}
                        </span>
                        <div className="w-full bg-[#E8E2D9] h-1 rounded-full mt-3 overflow-hidden">
                          <div
                            className="bg-[#5B7553] h-full rounded-full"
                            style={{ width: `${selectedClaim.riskScore.pillars.gnn.raw * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Symbolic Inference Rules Card */}
                      <div className="rounded-xl border border-[#E8E2D9] bg-white p-4 text-center shadow-sm">
                        <div className="w-1 h-6 bg-[#7C2D3E] rounded-full mx-auto mb-2"></div>
                        <span className="text-[10px] font-semibold text-[#7C2D3E] uppercase block tracking-wider">
                          Symbolic Proof
                        </span>
                        <span className="font-mono text-xl font-bold text-[#2D2926] mt-1 block">
                          {selectedClaim.rulesFired?.length || 0} Rules
                        </span>
                        <span className="text-[10px] text-[#6B635B] font-mono block mt-2 truncate">
                          {selectedClaim.rulesFired && selectedClaim.rulesFired.length > 0
                            ? selectedClaim.rulesFired.slice(0, 2).join(', ')
                            : 'Laws of inference'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-5 space-y-3 border-b border-[#E8E2D9]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-[#2D2926]">Discrete Mathematics proof trace</h4>
                      <span className="text-[10px] text-[#6B635B]">Premise-based deductions</span>
                    </div>
                    {selectedClaim.proofTrace.length ? <ol className="space-y-2">{selectedClaim.proofTrace.map((step, index) => <li key={`${index}-${step}`} className="flex gap-3 rounded-lg bg-[#FBF8F3] p-3 text-xs leading-relaxed text-[#6B635B]"><span className="font-mono font-bold text-[#7C2D3E]">{String(index + 1).padStart(2, '0')}</span><span>{step}</span></li>)}</ol> : <p className="rounded-lg bg-[#FBF8F3] p-3 text-xs text-[#6B635B]">No configured inference rule fired. This is not a proof that the claim is risk-free.</p>}
                  </div>

                  {/* Anomaly Explainability Cards */}
                  <div className="px-6 py-5 space-y-4 border-b border-[#E8E2D9]">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-[#2D2926]">
                        Explainable Findings ({selectedClaim.anomalies.length})
                      </h4>
                      <span className="text-[11px] font-mono text-[#5B7553] font-bold">
                        Risk score
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedClaim.anomalies.map((anomaly, idx) => (
                        <div
                          key={idx}
                          className={`rounded-xl p-4 text-xs space-y-2 border-l-[3px] ${
                            anomaly.severity === 'critical'
                              ? 'border-l-[#B84233] bg-[#B84233]/5'
                              : anomaly.severity === 'high'
                              ? 'border-l-[#C17C2A] bg-[#C17C2A]/5'
                              : 'border-l-[#E8E2D9] bg-[#FBF8F3]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#5B7553]/10 text-[#5B7553]">
                              Risk score • {anomaly.severity}
                            </span>
                          </div>

                          <h5 className="font-serif font-bold text-[#2D2926] text-sm">
                            {anomaly.title}
                          </h5>

                          <p className="text-[#6B635B] leading-relaxed">
                            {anomaly.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investigator Notes Form */}
                  <div className="px-6 py-5 space-y-3">
                    <label className="font-serif text-sm font-bold text-[#2D2926] block">
                      SIU Investigator Field Notes
                    </label>
                    <textarea
                      rows={3}
                      value={selectedClaim.investigatorNotes}
                      onChange={(e) =>
                        setInvestigatorNotes(selectedClaim.metadata.claimId, e.target.value)
                      }
                      placeholder="Add case notes for this claim..."
                      className="w-full rounded-xl border border-[#E8E2D9] p-3 text-xs text-[#2D2926] placeholder-[#6B635B]/40 focus:border-[#7C2D3E] focus:outline-none focus:ring-1 focus:ring-[#7C2D3E]/20"
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 p-12 text-center text-[#6B635B]">
                  <Eye size={36} className="mb-3 text-[#E8E2D9]" />
                  <p className="font-serif text-base font-semibold text-[#2D2926]">No claim selected for inspection.</p>
                  <p className="text-xs mt-1 text-[#6B635B]">
                    Select any claim from the table on the left to view detailed risk breakdown and explainability findings.
                  </p>
                </div>
              )}
            </aside>
          )}

          {/* Network Graph Slide panel if toggled */}
          {state.isNetworkPanelOpen && !state.isDetailPanelOpen && (
            <aside className="w-1/2 min-w-[480px] border-l border-[#E8E2D9] bg-[#2D2926] text-white flex flex-col p-2">
              <NetworkGraphPanel />
            </aside>
          )}

        </div>
        </>}
      </div>
    </div>
  );
}
