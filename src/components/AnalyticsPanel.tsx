import { useMemo } from 'react';
import { useClaims } from '../context/ClaimsContext';
import { formatInr, formatRiskPercent } from '../utils/formatters';
import type { AgriGuardClaim } from '../types';

function BarList({ title, values }: { title: string; values: Array<[string, number]> }) {
  const max = Math.max(...values.map(([, value]) => value), 1);
  return <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-sm">
    <h3 className="font-serif text-sm font-bold text-[#2D2926]">{title}</h3>
    <div className="mt-4 space-y-3">{values.map(([label, value]) => <div key={label}>
      <div className="mb-1 flex justify-between text-xs"><span className="text-[#6B635B]">{label}</span><b className="font-mono text-[#2D2926]">{value.toLocaleString('en-IN')}</b></div>
      <div className="h-2 rounded-full bg-[#F0ECE6]"><div className="h-2 rounded-full bg-[#7C2D3E]" style={{ width: `${Math.max(3, value / max * 100)}%` }} /></div>
    </div>)}</div>
  </section>;
}

export function AnalyticsPanel({ claims }: { claims: AgriGuardClaim[] }) {
  const { stats } = useClaims();
  const byCrop = useMemo(() => {
    const counts = new Map<string, number>();
    claims.forEach((claim) => counts.set(claim.metadata.cropType, (counts.get(claim.metadata.cropType) ?? 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 7);
  }, [claims]);
  const byDistrict = useMemo(() => {
    const counts = new Map<string, number>();
    claims.forEach((claim) => counts.set(claim.metadata.parcel.district, (counts.get(claim.metadata.parcel.district) ?? 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [claims]);
  // Triage distribution is a portfolio-level metric, independent of table filters.
  const tiers = [
    { label: 'Investigate', count: stats.tierCounts.investigate, color: '#B84233' },
    { label: 'Review', count: stats.tierCounts.review, color: '#C17C2A' },
    { label: 'Safe / Approve', count: stats.tierCounts.safe, color: '#5B7553' },
  ];
  const triageTotal = stats.totalClaims;
  return <main className="flex-1 overflow-y-auto p-6">
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-[11px] font-semibold uppercase tracking-widest text-[#7C2D3E]">Portfolio overview</p><h2 className="mt-1 font-serif text-2xl font-bold">Claims analytics</h2><p className="mt-1 text-xs text-[#6B635B]">Summaries update with the current claim filters. Portfolio records are illustrative; risk scores are precomputed.</p></div>
        <div className="text-xs text-[#6B635B]">Showing <b className="text-[#2D2926]">{claims.length.toLocaleString('en-IN')}</b> filtered of {stats.totalClaims.toLocaleString('en-IN')} claims</div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[["Claims in view", claims.length.toLocaleString('en-IN')], ["Claimed indemnity", formatInr(claims.reduce((sum, c) => sum + c.metadata.claimAmountInr, 0))], ["Mean risk score", formatRiskPercent(claims.length ? claims.reduce((sum, c) => sum + c.riskScore.composite, 0) / claims.length : 0)], ["Risk rule flags", claims.filter((c) => c.riskFlag === 1).length.toLocaleString('en-IN')]].map(([label, value]) => <div key={label} className="rounded-2xl border border-[#E8E2D9] bg-white p-4 shadow-sm"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#6B635B]">{label}</p><p className="mt-2 font-mono text-xl font-bold text-[#2D2926]">{value}</p></div>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-sm font-bold text-[#2D2926]">Portfolio triage distribution</h3>
            <span className="text-[10px] text-[#6B635B]">All {triageTotal.toLocaleString('en-IN')} claims</span>
          </div>
          <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-[#F0ECE6]" role="img" aria-label={`Portfolio triage distribution across ${triageTotal} claims`}>
            {tiers.map((tier) => <div key={tier.label} title={`${tier.label}: ${tier.count.toLocaleString('en-IN')}`} style={{ width: triageTotal ? `${tier.count / triageTotal * 100}%` : '0%', backgroundColor: tier.color }} />)}
          </div>
          <div className="mt-5 space-y-3">
            {tiers.map((tier) => <div key={tier.label} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: tier.color }} /><span className="text-[#6B635B]">{tier.label}</span></div>
              <div className="flex shrink-0 items-baseline gap-2"><b className="font-mono text-[#2D2926]">{tier.count.toLocaleString('en-IN')}</b><span className="w-12 text-right font-mono text-[10px] text-[#9A928A]">{triageTotal ? `${(tier.count / triageTotal * 100).toFixed(1)}%` : '0.0%'}</span></div>
            </div>)}
          </div>
        </section>
        <BarList title="Claims by crop" values={byCrop} />
        <BarList title="Claims by district" values={byDistrict} />
      </div>
      <p className="rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 text-[11px] leading-relaxed text-[#6B635B]">Portfolio records are illustrative and risk scores are precomputed. “Risk rule flags” counts claims where the supplied propositional premises derive Risk; a zero means no configured rule fired, not a proof of ¬Risk.</p>
    </div>
  </main>;
}
