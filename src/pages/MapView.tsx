import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { projects, getTrustLevel } from "@/lib/mockData";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([16.8524, 74.5815], 12);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    projects.forEach((p) => {
      const level = getTrustLevel(p.trustScore);
      const color = level === "high" ? "#2f9e6e" : level === "medium" ? "#e8a317" : "#d94040";
      
      const circle = L.circleMarker([p.lat, p.lng], {
        radius: 12,
        fillColor: color,
        color: color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.4,
      }).addTo(map);

      circle.bindPopup(`
        <div style="font-family: Inter, sans-serif; min-width: 200px;">
          <strong style="font-size: 13px;">${p.name}</strong><br/>
          <span style="color: #666; font-size: 12px;">${p.location}</span><br/>
          <div style="margin-top: 6px; font-size: 12px;">
            <span>Trust: <strong style="color:${color}">${p.trustScore}/100</strong></span> · 
            <span>Risk: <strong>${p.delayRisk}</strong></span>
          </div>
          <div style="font-size: 11px; margin-top: 4px; color: #888;">
            Official: ${p.officialCompletion}% · AI Est: ${p.aiEstimatedCompletion}%
          </div>
        </div>
      `);
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Project Map</h1>
          <p className="text-sm text-muted-foreground">Sangli District — Geo-tagged project locations with trust indicators</p>
        </div>
        <div className="flex gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-trust-high" /><span className="text-muted-foreground">High Trust</span></div>
          <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-trust-medium" /><span className="text-muted-foreground">Medium Trust</span></div>
          <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-trust-low" /><span className="text-muted-foreground">Low Trust</span></div>
        </div>
        <div ref={mapRef} className="h-[600px] rounded-xl border border-border overflow-hidden" />
      </div>
    </div>
  );
}
