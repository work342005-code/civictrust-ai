import Navbar from "@/components/Navbar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { projects, departmentPerformance, formatBudget, getTrustLevel } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, TrendingDown, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Reports() {
  const highRisk = projects.filter((p) => p.delayRisk === "High");
  const lowTrust = projects.filter((p) => p.trustScore < 50).sort((a, b) => a.trustScore - b.trustScore);
  const budgetMismatch = projects.filter((p) => Math.abs(p.officialCompletion - p.aiEstimatedCompletion) > 15);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Analytics Reports</h1>
            <p className="text-sm text-muted-foreground">Comprehensive governance analytics for Sangli District</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => alert("PDF export simulated!")}>
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* High Risk */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-civic rounded-xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground mb-4">
              <AlertTriangle className="h-5 w-5 text-trust-low" /> High Risk Projects ({highRisk.length})
            </h3>
            <div className="space-y-3">
              {highRisk.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.department}</p>
                  </div>
                  <Badge className="trust-badge-low border-0">Score: {p.trustScore}</Badge>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Low Trust */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-civic rounded-xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground mb-4">
              <TrendingDown className="h-5 w-5 text-trust-medium" /> Low Trust Projects ({lowTrust.length})
            </h3>
            <div className="space-y-3">
              {lowTrust.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Gap: {Math.abs(p.officialCompletion - p.aiEstimatedCompletion)}%</p>
                  </div>
                  <Badge className="trust-badge-low border-0">Score: {p.trustScore}</Badge>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Budget Mismatch */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-civic rounded-xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-display text-base font-semibold text-foreground mb-4">
              <DollarSign className="h-5 w-5 text-sky" /> Budget-Quality Mismatch ({budgetMismatch.length})
            </h3>
            <div className="space-y-3">
              {budgetMismatch.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">Budget: {formatBudget(p.budget)}</p>
                  </div>
                  <span className="text-xs font-medium text-trust-medium">{Math.abs(p.officialCompletion - p.aiEstimatedCompletion)}% gap</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dept Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-civic rounded-xl border border-border bg-card p-6">
            <h3 className="font-display text-base font-semibold text-foreground mb-4">Department Performance</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={departmentPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,25%,88%)" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(215,15%,48%)" />
                <YAxis dataKey="dept" type="category" tick={{ fontSize: 11 }} stroke="hsl(215,15%,48%)" width={60} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214,25%,88%)" }} />
                <Bar dataKey="trustScore" radius={[0, 4, 4, 0]}>
                  {departmentPerformance.map((entry, i) => (
                    <Cell key={i} fill={entry.trustScore >= 70 ? "hsl(150,65%,42%)" : entry.trustScore >= 45 ? "hsl(40,95%,52%)" : "hsl(0,80%,55%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
