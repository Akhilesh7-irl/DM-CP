import { useClaims } from '../context/ClaimsContext';
import {
  Network,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  User,
  ShieldAlert,
  Layers,
  Activity,
  FileSpreadsheet,
  Zap,
  Pin,
  X,
  ShieldCheck,
  Info,
  Scale
} from 'lucide-react';

/**
 * Formats a raw number as INR currency.
 */
function formatInr(amount: any) {
  if (typeof amount !== 'number') return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats decimal score (0.0 - 1.0) as percentage string.
 */
function formatPercent(value: any) {
  if (typeof value !== 'number') return '0%';
  return `${Math.round(value * 100)}%`;
}

/**
 * ClaimDetailView — AgriGuard Deep-Dive Detail Inspector
 * Presents GNN graph topology findings alongside the symbolic inference logical proof.
 */
export function ClaimDetailView() {
  const { state, selectClaim, togglePinClaim, setInvestigatorNotes } = useClaims();
  const selectedClaim = state.claims.find((c) => c.metadata.claimId === state.selectedClaimId);

  const handleClose = () => {
    selectClaim(null);
  };

  if (!selectedClaim) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-white text-[#2D2926] p-8 text-center rounded-xl border border-[#E8E2D9] shadow-sm select-none">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5B7553]/10 text-[#5B7553] mb-4">
          <Network className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-lg font-bold tracking-tight text-[#2D2926]">
          No Claim Selected
        </h3>
        <p className="text-xs text-[#6B635B] mt-1.5 max-w-sm">
          Select an agricultural insurance claim from the triage ledger to inspect GNN network topology and symbolic logical proofs.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs text-[#6B635B] border border-[#E8E2D9] shadow-sm">
            <span>Awaiting claim selection from active ledger…</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-md text-left">
          <div className="p-3.5 rounded-lg bg-white border border-[#E8E2D9]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5B7553] uppercase tracking-wider">
              <Network className="h-3.5 w-3.5" /> GNN Network Topology
            </div>
            <p className="text-[11px] text-[#9A928A] mt-1">HeteroGraphSAGE relational links & shared adjuster hubs</p>
          </div>
          <div className="p-3.5 rounded-lg bg-white border border-[#E8E2D9]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7C2D3E] uppercase tracking-wider">
              <Scale className="h-3.5 w-3.5" /> Symbolic Inference
            </div>
            <p className="text-[11px] text-[#9A928A] mt-1">Propositional deduction via the 9 laws of inference</p>
          </div>
        </div>
      </div>
    );
  }

  const { metadata, riskScore, anomalies, investigatorNotes, isPinned, lastAnalyzedAt, proofTrace = [], rulesFired = [] } = selectedClaim;

  // Extract GNN anomaly finding
  const gnnAnomaly = anomalies?.find((a: any) => a.pillar === 'gnn');

  // Severity helper styles
  const getSeverityBadge = (severity: any) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-[#B84233]/10 px-2 py-0.5 text-[10px] font-bold text-[#B84233] border border-[#B84233]/20 uppercase tracking-wider">
            <AlertTriangle className="h-3 w-3" /> Critical Anomaly
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-[#C17C2A]/10 px-2 py-0.5 text-[10px] font-bold text-[#C17C2A] border border-[#C17C2A]/20 uppercase tracking-wider">
            <AlertTriangle className="h-3 w-3" /> High Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-[#E8E2D9] px-2 py-0.5 text-[10px] font-bold text-[#2D2926] border border-[#E8E2D9] uppercase tracking-wider">
            <Info className="h-3 w-3" /> Medium Warning
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-[#5B7553]/10 px-2 py-0.5 text-[10px] font-bold text-[#5B7553] border border-[#5B7553]/20 uppercase tracking-wider">
            <CheckCircle2 className="h-3 w-3" /> Low Risk / Normal
          </span>
        );
    }
  };

  const getTierBadge = (tier: any) => {
    switch (tier) {
      case 'investigate':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B84233] px-3 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" /> INVESTIGATE
          </span>
        );
      case 'review':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C17C2A] px-3 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5" /> REVIEW REQUIRED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5B7553] px-3 py-1 text-xs font-bold text-white shadow-sm uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> SAFE / CLEARED
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white text-[#2D2926] rounded-xl border border-[#E8E2D9] shadow-sm overflow-hidden font-sans">
      
      {/* ── HEADER BAR ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E2D9] bg-[#FBF8F3] p-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C2D3E] text-white text-sm font-bold shadow-md">
            AG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-mono text-lg font-bold tracking-tight text-[#2D2926]">
                {metadata.claimId}
              </h2>
              {getTierBadge(riskScore.tier)}
            </div>
            <p className="text-xs text-[#9A928A] font-mono mt-0.5">
              Policy #{metadata.policyNumber} • {metadata.policyType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {togglePinClaim && (
            <button
              onClick={() => togglePinClaim(metadata.claimId)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                isPinned
                  ? 'bg-[#C17C2A]/15 border-[#C17C2A]/40 text-[#C17C2A]'
                  : 'bg-white border-[#E8E2D9] text-[#6B635B] hover:bg-[#FBF8F3]'
              }`}
            >
              <Pin className={`h-3.5 w-3.5 ${isPinned ? 'fill-[#C17C2A] text-[#C17C2A]' : ''}`} />
              <span>{isPinned ? 'Pinned' : 'Pin Claim'}</span>
            </button>
          )}
          
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E2D9] bg-white text-[#9A928A] hover:text-[#2D2926] hover:bg-[#FBF8F3] transition-colors"
            title="Close inspector"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        
        {/* ── METRICS SUMMARY & RISK SCORE BANNER ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Composite Score Card */}
          <div className="rounded-xl border border-[#B84233]/20 bg-[#B84233]/5 p-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A928A]">
                Calibrated Risk Score
              </span>
              <Activity className="h-4 w-4 text-[#B84233]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-extrabold text-[#B84233]">
                {formatPercent(riskScore.composite)}
              </span>
              <span className="text-xs font-mono text-[#9A928A]">
                ({formatPercent(riskScore.confidence)} confidence)
              </span>
            </div>
            <div className="mt-2 w-full bg-[#E8E2D9] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B84233] rounded-full"
                style={{ width: `${riskScore.composite * 100}%` }}
              />
            </div>
          </div>

          {/* Financial Liability Card */}
          <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A928A] block">
              Claimed Indemnity Value
            </span>
            <div className="mt-2 font-mono text-2xl font-bold text-[#2D2926]">
              {formatInr(metadata.claimAmountUsd)}
            </div>
            <p className="text-[11px] text-[#9A928A] mt-1 font-mono">
              Policy Liability: {formatInr(metadata.policyValueUsd)}
            </p>
          </div>

          {/* Crop & Peril Card */}
          <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A928A] block">
              Insured Commodity & Peril
            </span>
            <div className="mt-2 font-semibold text-sm text-[#2D2926] flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-[#C17C2A]" />
              <span>{metadata.cropType}</span>
            </div>
            <p className="text-xs text-[#9A928A] mt-1">
              Peril: <strong className="text-[#6B635B] font-medium">{metadata.perilType}</strong> ({metadata.cropYear})
            </p>
          </div>

          {/* Location & Assessor Card */}
          <div className="rounded-xl border border-[#E8E2D9] bg-white p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A928A] block">
              Parcel & Assessor Metadata
            </span>
            <div className="mt-1 text-xs text-[#6B635B] space-y-1">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-[#9A928A]" />
                <span className="truncate">{metadata.farmerName} ({metadata.farmerId})</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#9A928A]">
                <MapPin className="h-3.5 w-3.5 text-[#5B7553]" />
                <span>PMFBY Farmland Parcel ({metadata.parcel.insuredAcres} ac) • District: {metadata.parcel.stateAbbrev} • Taluka: {metadata.parcel.countyFips}</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── EXPLAINABILITY & SYMBOLIC LOGICAL PROOF ───────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-2">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#2D2926] flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#7C2D3E]" />
              <span>Deductive & Topological Explainability</span>
            </h3>
            <span className="text-xs text-[#9A928A] font-mono">
              HeteroGraphSAGE GNN • Classical Symbolic Inference (9 Laws)
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">

            {/* ═════════════════════════════════════════════════════════════════
                PILLAR 1: GNN NETWORK ANOMALIES (Graph connections, shared adjusters)
               ═════════════════════════════════════════════════════════════════ */}
            <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#5B7553]" />
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D9] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B7553]/10 text-[#5B7553]">
                    <Network className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2D2926] flex items-center gap-2">
                      1. GNN Network Topology Findings
                    </h4>
                    <p className="text-xs text-[#9A928A] font-mono">
                      Graph Neural Topology • Shared Adjusters • Spatial Clustering
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {gnnAnomaly && getSeverityBadge(gnnAnomaly.severity)}
                  <span className="rounded-full bg-[#5B7553]/10 px-2.5 py-1 text-xs font-mono font-bold text-[#5B7553]">
                    Raw Risk: {formatPercent(riskScore.pillars.gnn.raw)}
                  </span>
                </div>
              </div>

              {/* Anomaly Body & Technical Metric Grid */}
              {gnnAnomaly ? (
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-sm text-[#2D2926] mb-1">
                      {gnnAnomaly.title}
                    </h5>
                    <p className="text-xs text-[#6B635B] leading-relaxed">
                      {gnnAnomaly.description}
                    </p>
                  </div>

                  {/* High-Density Technical Metric Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBF8F3] p-3.5 rounded-lg border border-[#E8E2D9]">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#9A928A] block">
                        Assessor Hub Flag
                      </span>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 font-mono ${gnnAnomaly.sharedAssessorFlag ? 'text-[#B84233]' : 'text-[#5B7553]'}`}>
                        {gnnAnomaly.sharedAssessorFlag ? '⚠️ FLAGGED HUB' : '✓ Normal Load'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#9A928A] block">
                        District Claims (24mo)
                      </span>
                      <span className="text-xs font-mono font-bold text-[#2D2926] mt-1 block">
                        {gnnAnomaly.assessorClaimCountInCounty24Mo} Claims
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#9A928A] block">
                        Spatial Proximity
                      </span>
                      <span className="text-xs font-mono font-bold text-[#2D2926] mt-1 block">
                        {gnnAnomaly.multiClaimProximityKm} km Avg Dist
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#9A928A] block">
                        GNN Cluster ID
                      </span>
                      <span className="inline-block mt-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#5B7553]/10 text-[#5B7553]">
                        {gnnAnomaly.communityClusterId || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#9A928A] italic">
                  No structural network anomalies flagged by GNN graph analysis.
                </p>
              )}
            </div>

            {/* ═════════════════════════════════════════════════════════════════
                PILLAR 2: LOGICAL PROOF PANEL (Symbolic Inference Layer)
               ═════════════════════════════════════════════════════════════════ */}
            <div className="rounded-xl border border-[#E8E2D9] bg-white p-5 shadow-sm space-y-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#7C2D3E]" />

              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E2D9] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C2D3E]/10 text-[#7C2D3E]">
                    <Scale className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#2D2926] flex items-center gap-2">
                      2. Logical Proof (Laws of Inference)
                    </h4>
                    <p className="text-xs text-[#9A928A] font-mono">
                      Propositional Calculus • 9 Deductive Laws • Step-by-Step Proof Trace
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#7C2D3E]/10 px-2.5 py-1 text-xs font-mono font-bold text-[#7C2D3E]">
                    {rulesFired.length} Rules Fired
                  </span>
                </div>
              </div>

              {/* Rules Fired Tags */}
              {rulesFired.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-[#9A928A] mr-1">
                    Inference Rules:
                  </span>
                  {rulesFired.map((ruleName, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md bg-[#FBF8F3] px-2 py-0.5 text-[11px] font-mono font-semibold text-[#2D2926] border border-[#E8E2D9]"
                    >
                      {ruleName}
                    </span>
                  ))}
                </div>
              )}

              {/* Numbered Logical Proof Trace Steps */}
              {proofTrace.length > 0 ? (
                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] font-mono uppercase text-[#9A928A] block">
                    Sequential Deduction Steps:
                  </span>
                  <div className="space-y-2">
                    {proofTrace.map((step, idx) => {
                      const colonIdx = step.indexOf(':');
                      const rulePrefix = colonIdx !== -1 ? step.substring(0, colonIdx) : '';
                      const stepContent = colonIdx !== -1 ? step.substring(colonIdx + 1).trim() : step;

                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-3 rounded-lg border border-[#E8E2D9] bg-[#FBF8F3] p-3 transition-colors hover:bg-white"
                        >
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5B7553]/15 text-[#5B7553] font-mono text-[11px] font-bold mt-0.5">
                            {idx + 1}
                          </div>
                          <div className="flex-1 space-y-1">
                            {rulePrefix && (
                              <div className="text-[11px] font-mono font-bold text-[#7C2D3E] uppercase tracking-wide">
                                {rulePrefix}
                              </div>
                            )}
                            <div className="font-mono text-xs text-[#2D2926] leading-relaxed break-words">
                              {stepContent}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#9A928A] italic">
                  No symbolic inference proof steps recorded for this claim.
                </p>
              )}
            </div>

          </div>
        </div>

        {/* ── INVESTIGATOR FIELD NOTES & AUDIT TRAIL ────────────────────────── */}
        <div className="rounded-xl border border-[#E8E2D9] bg-[#FBF8F3] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#2D2926] flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-[#5B7553]" />
              <span>SIU Investigator Field Notes</span>
            </h4>
            <span className="text-[11px] font-mono text-[#9A928A]">
              Analyzed: {new Date(lastAnalyzedAt).toLocaleString()}
            </span>
          </div>

          <textarea
            rows={3}
            value={investigatorNotes ?? ''}
            onChange={(e) => setInvestigatorNotes && setInvestigatorNotes(metadata.claimId, e.target.value)}
            placeholder="Record SIU field verification findings, network cross-checks, or referral notes..."
            className="w-full rounded-lg border border-[#E8E2D9] bg-white p-3 text-xs text-[#2D2926] placeholder-[#9A928A] focus:border-[#5B7553] focus:ring-1 focus:ring-[#5B7553] focus:outline-none transition-all font-sans"
          />

          <div className="flex items-center justify-between text-[11px] text-[#9A928A] font-mono pt-1">
            <span>Audit Trail Engine: AgriGuard GNN + Symbolic Logic</span>
            <span>CLU: {metadata.parcel.cluTractId}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ClaimDetailView;
