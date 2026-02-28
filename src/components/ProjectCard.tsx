import { Link } from "react-router-dom";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import TrustScoreGauge from "./TrustScoreGauge";
import { Project, formatBudget, getTrustLevel } from "@/lib/mockData";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const level = getTrustLevel(project.trustScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/projects/${project.id}`} className="block">
        <div className="card-civic group rounded-xl border border-border bg-card p-5 transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs font-mono">{project.id}</Badge>
                <Badge
                  className={`text-xs ${
                    project.delayRisk === "High"
                      ? "trust-badge-low"
                      : project.delayRisk === "Medium"
                      ? "trust-badge-medium"
                      : "trust-badge-high"
                  } border-0`}
                >
                  {project.delayRisk === "High" && <AlertTriangle className="mr-1 h-3 w-3" />}
                  {project.delayRisk} Risk
                </Badge>
              </div>
              <h3 className="font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {project.name}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{project.timeline}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-muted-foreground">Budget: <strong className="text-foreground">{formatBudget(project.budget)}</strong></span>
                <span className="text-muted-foreground">Official: <strong className="text-foreground">{project.officialCompletion}%</strong></span>
                <span className="text-muted-foreground">AI Est: <strong className={level === 'low' ? 'text-trust-low' : 'text-foreground'}>{project.aiEstimatedCompletion}%</strong></span>
              </div>
              {Math.abs(project.officialCompletion - project.aiEstimatedCompletion) > 20 && (
                <div className="flex items-center gap-1.5 rounded-md bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  ⚠ Discrepancy Alert: {Math.abs(project.officialCompletion - project.aiEstimatedCompletion)}% gap detected
                </div>
              )}
            </div>
            <TrustScoreGauge score={project.trustScore} size="sm" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
