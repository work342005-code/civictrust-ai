import { motion } from "framer-motion";
import { getTrustLevel } from "@/lib/mockData";

interface TrustScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function TrustScoreGauge({ score, size = "md", showLabel = true }: TrustScoreGaugeProps) {
  const level = getTrustLevel(score);
  const dimensions = { sm: 64, md: 100, lg: 140 };
  const dim = dimensions[size];
  const strokeWidth = size === "sm" ? 5 : size === "md" ? 7 : 9;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const colorClass = level === "high" ? "text-trust-high" : level === "medium" ? "text-trust-medium" : "text-trust-low";
  const strokeColor = level === "high" ? "hsl(150, 65%, 42%)" : level === "medium" ? "hsl(40, 95%, 52%)" : "hsl(0, 80%, 55%)";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle cx={dim / 2} cy={dim / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
          <motion.circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-display font-bold ${colorClass} ${size === "sm" ? "text-sm" : size === "md" ? "text-xl" : "text-3xl"}`}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={`text-xs font-medium capitalize ${colorClass}`}>
          {level} Trust
        </span>
      )}
    </div>
  );
}
