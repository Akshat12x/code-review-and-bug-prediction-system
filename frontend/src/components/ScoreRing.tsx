interface ScoreRingProps {
  score: number;
  size?: number;
}

export default function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const strokeWidth = size < 50 ? 4 : 5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color = score >= 7 ? "#10b981" : score >= 4 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className="absolute font-bold" style={{ color, fontSize: size < 50 ? 11 : 15 }}>
        {score.toFixed(1)}
      </span>
    </div>
  );
}
