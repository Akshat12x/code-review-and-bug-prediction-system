type Severity = "critical" | "high" | "medium" | "low";

export default function SeverityBadge({ severity }: { severity: string }) {
  const s = severity?.toLowerCase() as Severity;
  const cls: Record<Severity, string> = {
    critical: "badge-critical",
    high: "badge-high",
    medium: "badge-medium",
    low: "badge-low",
  };
  return <span className={cls[s] ?? "badge-low"}>{s?.toUpperCase()}</span>;
}
