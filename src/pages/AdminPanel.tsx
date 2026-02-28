import { useState } from "react";
import { Users as UsersIcon, FolderKanban, Shield, AlertTriangle, FileText, Flag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import { projects, users, citizenReports, formatBudget } from "@/lib/mockData";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const flaggedUsers = users.filter((u) => u.status === "flagged");
  const discrepancyAlerts = projects.filter((p) => Math.abs(p.officialCompletion - p.aiEstimatedCompletion) > 20);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage users, projects, and monitor AI alerts</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Users" value={users.length} icon={UsersIcon} delay={0} />
          <StatsCard title="Total Projects" value={projects.length} icon={FolderKanban} delay={0.1} />
          <StatsCard title="AI Alerts" value={discrepancyAlerts.length} subtitle="Discrepancy detected" icon={AlertTriangle} delay={0.2} />
          <StatsCard title="Flagged Accounts" value={flaggedUsers.length} icon={Flag} delay={0.3} />
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="alerts">AI Alerts</TabsTrigger>
            <TabsTrigger value="reports">Report Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-civic rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Credibility</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reports</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3"><Badge variant="outline" className="capitalize">{u.role}</Badge></td>
                        <td className="px-4 py-3 text-foreground">{u.credibilityScore}</td>
                        <td className="px-4 py-3 text-foreground">{u.reportsCount}</td>
                        <td className="px-4 py-3">
                          <Badge className={`border-0 ${u.status === 'active' ? 'trust-badge-high' : u.status === 'flagged' ? 'trust-badge-low' : 'trust-badge-medium'}`}>
                            {u.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="projects">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-civic rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Budget</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Risk</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Trust</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                        <td className="px-4 py-3 text-foreground">{formatBudget(p.budget)}</td>
                        <td className="px-4 py-3">
                          <Badge className={`border-0 ${p.delayRisk === 'High' ? 'trust-badge-low' : p.delayRisk === 'Medium' ? 'trust-badge-medium' : 'trust-badge-high'}`}>
                            {p.delayRisk}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-semibold text-foreground">{p.trustScore}</td>
                        <td className="px-4 py-3">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="alerts">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {discrepancyAlerts.map((p) => (
                <div key={p.id} className="card-civic flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                    <div>
                      <p className="font-medium text-foreground">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Official: {p.officialCompletion}% vs AI Estimated: {p.aiEstimatedCompletion}% — 
                        <span className="font-semibold text-destructive"> {Math.abs(p.officialCompletion - p.aiEstimatedCompletion)}% discrepancy</span>
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Review</Button>
                </div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="reports">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {citizenReports.map((r) => (
                <div key={r.id} className="card-civic flex items-center justify-between rounded-xl border border-border bg-card p-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{r.citizenName}</span>
                      <Badge variant="outline" className="text-xs">{r.severity}</Badge>
                      {!r.verified && <Badge className="trust-badge-medium border-0 text-xs">Unverified</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{r.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Approve</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Reject</Button>
                  </div>
                </div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
