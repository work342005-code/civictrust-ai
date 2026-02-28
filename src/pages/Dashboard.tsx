import { BarChart3, AlertTriangle, Users, FolderKanban, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import ProjectCard from "@/components/ProjectCard";
import { projects, trustScoreDistribution, monthlyParticipation, departmentPerformance } from "@/lib/mockData";

export default function Dashboard() {
  const highRisk = projects.filter((p) => p.delayRisk === "High");
  const avgTrust = Math.round(projects.reduce((a, b) => a + b.trustScore, 0) / projects.length);
  const totalReports = projects.reduce((a, b) => a + b.citizenReports, 0);

  const pieColors = ["hsl(0,80%,55%)", "hsl(20,85%,52%)", "hsl(40,95%,52%)", "hsl(80,60%,45%)", "hsl(150,65%,42%)"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Governance Dashboard</h1>
          <p className="text-sm text-muted-foreground">Sangli District — Real-time project monitoring & trust analytics</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Active Projects" value={projects.length} icon={FolderKanban} trend={{ value: 12, positive: true }} delay={0} />
          <StatsCard title="High Risk Projects" value={highRisk.length} subtitle="Require attention" icon={AlertTriangle} delay={0.1} />
          <StatsCard title="Avg Trust Score" value={avgTrust} subtitle="Out of 100" icon={TrendingUp} trend={{ value: 5, positive: avgTrust > 60 }} delay={0.2} />
          <StatsCard title="Citizen Reports" value={totalReports} icon={Users} trend={{ value: 23, positive: true }} delay={0.3} />
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Trust Distribution */}
          <div className="card-civic rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-foreground">Trust Score Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trustScoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,25%,88%)" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="hsl(215,15%,48%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,15%,48%)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214,25%,88%)" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {trustScoreDistribution.map((entry, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Citizen Participation */}
          <div className="card-civic rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-display text-base font-semibold text-foreground">Citizen Participation Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyParticipation}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,25%,88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(215,15%,48%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,15%,48%)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214,25%,88%)" }} />
                <Line type="monotone" dataKey="reports" stroke="hsl(205,90%,55%)" strokeWidth={2} dot={{ r: 4 }} name="Reports" />
                <Line type="monotone" dataKey="users" stroke="hsl(160,60%,38%)" strokeWidth={2} dot={{ r: 4 }} name="Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Department Performance */}
          <div className="card-civic rounded-xl border border-border bg-card p-5 lg:col-span-2">
            <h3 className="mb-4 font-display text-base font-semibold text-foreground">Department-wise Trust Performance</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={departmentPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,25%,88%)" />
                <XAxis dataKey="dept" tick={{ fontSize: 12 }} stroke="hsl(215,15%,48%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(215,15%,48%)" />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid hsl(214,25%,88%)" }} />
                <Bar dataKey="trustScore" name="Trust Score" radius={[4, 4, 0, 0]}>
                  {departmentPerformance.map((entry, i) => (
                    <Cell key={i} fill={entry.trustScore >= 70 ? "hsl(150,65%,42%)" : entry.trustScore >= 45 ? "hsl(40,95%,52%)" : "hsl(0,80%,55%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* High Risk Projects */}
        <div>
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-trust-low" />
            High Risk Projects
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {highRisk.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
