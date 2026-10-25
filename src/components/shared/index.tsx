import type { RiskTier } from '../../types';
import type { AnomalySeverity } from '../../types';
import type { AnomalyPillar } from '../../types';

const tierStyles: Record<RiskTier, string> = {
  safe: 'bg-[#5B7553]/10 text-[#5B7553]',
  review: 'bg-[#C17C2A]/10 text-[#C17C2A]',
  investigate: 'bg-[#B84233]/10 text-[#B84233]',
};

export function TierBadge({ tier }: { tier: RiskTier }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${tierStyles[tier]}`}>
      {tier}
    </span>
  );
}

const severityColors: Record<AnomalySeverity, string> = {
  low: '#5B7553',
  medium: '#C17C2A',
  high: '#C17C2A',
  critical: '#B84233',
};

export function SeverityIndicator({ severity }: { severity: AnomalySeverity }) {
  return <span className="text-sm" style={{ color: severityColors[severity] }}>●</span>;
}

const pillarColors: Record<AnomalyPillar, string> = {
  gnn: '#5B7553',
};

export function PillarIcon({ pillar }: { pillar: AnomalyPillar }) {
  return <span className="text-sm" style={{ color: pillarColors[pillar] }}>◆</span>;
}

export function ScoreGauge({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[#E8E2D9] overflow-hidden">
      <div className="h-full rounded-full bg-[#7C2D3E]" style={{ width: `${score * 100}%` }} />
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-sm text-[#6B635B]">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#E8E2D9] border-t-[#7C2D3E]" />
      <span>Loading…</span>
    </div>
  );
}
