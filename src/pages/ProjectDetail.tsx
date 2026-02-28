import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, DollarSign, Building2, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import TrustScoreGauge from "@/components/TrustScoreGauge";
import { projects, citizenReports, calculateTrustScore, formatBudget, getTrustLevel } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Project not found.</p>
          <Link to="/projects"><Button variant="outline" className="mt-4">Back to Projects</Button></Link>
        </div>
      </div>
    );
  }

  const breakdown = calculateTrustScore(project);
  const reports = citizenReports.filter((r) => r.projectId === project.id);
  const discrepancy = Math.abs(project.officialCompletion - project.aiEstimatedCompletion);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/projects" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-civic rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono">{project.id}</Badge>
                    <Badge className={`border-0 ${project.delayRisk === 'High' ? 'trust-badge-low' : project.delayRisk === 'Medium' ? 'trust-badge-medium' : 'trust-badge-high'}`}>
                      {project.delayRisk} Risk
                    </Badge>
                  </div>
                  <h1 className="font-display text-xl font-bold text-foreground mb-2">{project.name}</h1>
                  <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{project.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{project.timeline}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{formatBudget(project.budget)}</span>
                    <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{project.department}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Progress Comparison */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-civic rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-base font-semibold text-foreground mb-4">Progress Comparison</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">Official Reported</span>
                    <span className="font-semibold text-foreground">{project.officialCompletion}%</span>
                  </div>
                  <Progress value={project.officialCompletion} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">AI Estimated (Citizen-Verified)</span>
                    <span className={`font-semibold ${getTrustLevel(project.trustScore) === 'low' ? 'text-trust-low' : 'text-foreground'}`}>{project.aiEstimatedCompletion}%</span>
                  </div>
                  <Progress value={project.aiEstimatedCompletion} className="h-3" />
                </div>
                {discrepancy > 20 && (
                  <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    ⚠ Discrepancy Alert: {discrepancy}% gap between official and AI-estimated progress
                  </div>
                )}
              </div>
            </motion.div>

            {/* Citizen Reports */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-civic rounded-xl border border-border bg-card p-6">
              <h3 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" /> Citizen Reports ({reports.length})
              </h3>
              {reports.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reports for this project yet.</p>
              ) : (
                <div className="space-y-3">
                  {reports.map((r) => (
                    <div key={r.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{r.citizenName}</span>
                            {r.verified && <CheckCircle className="h-3.5 w-3.5 text-trust-high" />}
                            <Badge variant="outline" className="text-xs">{r.severity}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{r.description}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">Score: {r.credibilityScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card-civic rounded-xl border border-border bg-card p-6 text-center">
              <h3 className="mb-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Public Trust Score</h3>
              <TrustScoreGauge score={project.trustScore} size="lg" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card-civic rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Score Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "Progress Accuracy", value: breakdown.progressAccuracy, weight: "40%" },
                  { label: "Transparency", value: breakdown.transparencyScore, weight: "20%" },
                  { label: "Citizen Evidence", value: breakdown.citizenEvidence, weight: "25%" },
                  { label: "Delay Risk", value: breakdown.delayRiskWeight, weight: "15%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{item.label} ({item.weight})</span>
                      <span className="font-medium text-foreground">{Math.round(item.value)}</span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card-civic rounded-xl border border-border bg-card p-6">
              <h3 className="mb-3 font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Facts</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Total Reports</span><span className="font-medium text-foreground">{project.citizenReports}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span className="font-medium text-foreground">{new Date(project.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">End Date</span><span className="font-medium text-foreground">{new Date(project.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Department</span><span className="font-medium text-foreground text-right">{project.department}</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
