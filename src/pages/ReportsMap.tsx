import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { projects } from "@/lib/mockData";
import { Plus, Filter, MapPin, Clock } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Report {
  id: string;
  title: string;
  description: string;
  severity: string;
  lat: number;
  lng: number;
  status: string;
  created_at: string;
  project_id: string;
  face_verified: boolean;
  ai_credibility_score: number | null;
  image_url: string | null;
}

export default function ReportsMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase.from("citizen_reports").select("*").order("created_at", { ascending: false });
      if (data) setReports(data);
    };
    fetchReports();

    const channel = supabase
      .channel("reports-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "citizen_reports" }, () => fetchReports())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredReports = reports.filter((r) => {
    if (filterSeverity !== "all" && r.severity !== filterSeverity) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; }

    const map = L.map(mapRef.current).setView([16.8524, 74.5815], 12);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    // Project zones
    projects.forEach((p) => {
      L.circle([p.lat, p.lng], {
        radius: 500, color: "hsl(215,80%,28%)", fillOpacity: 0.04, weight: 1, dashArray: "4",
      }).addTo(map).bindTooltip(p.name, { direction: "top" });
    });

    // Report markers
    const severityColors: Record<string, string> = {
      Low: "#2f9e6e",
      Medium: "#e8a317",
      High: "#d94040",
      Critical: "#9333ea",
    };

    filteredReports.forEach((r) => {
      const color = severityColors[r.severity] || "#888";
      const project = projects.find((p) => p.id === r.project_id);

      L.circleMarker([r.lat, r.lng], {
        radius: 10,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.5,
      })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:220px;max-width:280px;">
            <strong style="font-size:13px;">${r.title}</strong><br/>
            <span style="color:#666;font-size:11px;">Project: ${project?.name || r.project_id}</span><br/>
            <div style="margin:4px 0;display:flex;gap:6px;flex-wrap:wrap;">
              <span style="background:${color}22;color:${color};padding:1px 6px;border-radius:4px;font-size:10px;font-weight:600;">${r.severity}</span>
              <span style="background:#eee;padding:1px 6px;border-radius:4px;font-size:10px;">${r.status}</span>
              ${r.face_verified ? '<span style="background:#d1fae5;color:#065f46;padding:1px 6px;border-radius:4px;font-size:10px;">✓ Face Verified</span>' : ""}
            </div>
            <p style="font-size:11px;color:#555;margin:4px 0;">${r.description.slice(0, 120)}${r.description.length > 120 ? "..." : ""}</p>
            ${r.ai_credibility_score !== null ? `<p style="font-size:10px;color:#888;">AI Credibility: <strong>${r.ai_credibility_score}/100</strong></p>` : ""}
            ${r.image_url ? `<img src="${r.image_url}" style="width:100%;max-height:120px;object-fit:cover;border-radius:6px;margin-top:4px;" />` : ""}
            <p style="font-size:10px;color:#aaa;margin-top:4px;">${new Date(r.created_at).toLocaleString()}</p>
          </div>
        `);
    });

    return () => { map.remove(); mapInstance.current = null; };
  }, [filteredReports]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Reports Map</h1>
            <p className="text-sm text-muted-foreground">Real-time geo-tagged citizen reports with AI analysis</p>
          </div>
          <Link to="/submit-report">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Submit Report</Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs">{filteredReports.length} reports</Badge>
        </div>

        {/* Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full" style={{ background: "#2f9e6e" }} /><span className="text-muted-foreground">Low</span></div>
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full" style={{ background: "#e8a317" }} /><span className="text-muted-foreground">Medium</span></div>
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full" style={{ background: "#d94040" }} /><span className="text-muted-foreground">High</span></div>
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full" style={{ background: "#9333ea" }} /><span className="text-muted-foreground">Critical</span></div>
          <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full border border-dashed border-primary" /><span className="text-muted-foreground">Project Zone</span></div>
        </div>

        <div ref={mapRef} className="h-[600px] rounded-xl border border-border overflow-hidden" />

        {/* Recent Reports List */}
        {filteredReports.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Reports</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {filteredReports.slice(0, 6).map((r) => (
                <div key={r.id} className="rounded-lg border border-border bg-card p-3 card-civic">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                    <Badge variant="outline" className="text-[10px] shrink-0">{r.severity}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{r.lat.toFixed(3)}, {r.lng.toFixed(3)}</span>
                    <Clock className="ml-auto h-3 w-3" />
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  {r.face_verified && (
                    <Badge className="mt-1 text-[10px] bg-trust-high/10 text-trust-high border-trust-high/20">✓ Face Verified</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
