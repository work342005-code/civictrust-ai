import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/mockData";

export default function Projects() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || p.delayRisk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Government Projects</h1>
          <p className="text-sm text-muted-foreground">Sangli District — {projects.length} active projects monitored</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              <SelectItem value="High">High Risk</SelectItem>
              <SelectItem value="Medium">Medium Risk</SelectItem>
              <SelectItem value="Low">Low Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">No projects match your filters.</div>
        )}
      </div>
    </div>
  );
}
