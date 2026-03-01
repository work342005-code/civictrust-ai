import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import FaceVerification from "@/components/FaceVerification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { projects } from "@/lib/mockData";
import { MapPin, Upload, ShieldCheck, Loader2, AlertTriangle, Image as ImageIcon } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function SubmitReport() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [faceVerified, setFaceVerified] = useState(false);
  const [faceImage, setFaceImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [projectId, setProjectId] = useState("");
  const [lat, setLat] = useState(16.8524);
  const [lng, setLng] = useState(74.5815);
  const [reportImage, setReportImage] = useState<File | null>(null);
  const [reportImagePreview, setReportImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast({ title: "Login Required", description: "Please sign in to submit a report.", variant: "destructive" });
        navigate("/login");
      } else {
        setUser(data.session.user);
      }
    });
  }, [navigate, toast]);

  // GPS auto-detect
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
        },
        () => {} // ignore error, default to Sangli
      );
    }
  }, []);

  // Map for pin location
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current).setView([lat, lng], 13);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      setLat(pos.lat);
      setLng(pos.lng);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      setLat(e.latlng.lat);
      setLng(e.latlng.lng);
    });

    // Show project zones
    projects.forEach((p) => {
      L.circle([p.lat, p.lng], { radius: 500, color: "hsl(205,90%,55%)", fillOpacity: 0.08, weight: 1 }).addTo(map);
    });

    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  // Update marker when lat/lng change
  useEffect(() => {
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    if (mapInstance.current) mapInstance.current.setView([lat, lng], 13);
  }, [lat, lng]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB allowed", variant: "destructive" });
      return;
    }
    setReportImage(file);
    const reader = new FileReader();
    reader.onload = () => setReportImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faceVerified) {
      toast({ title: "Face verification required", description: "Complete face verification before submitting.", variant: "destructive" });
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      // Upload report image if exists
      let imageUrl = "";
      if (reportImage) {
        const fileName = `${user.id}/${Date.now()}-${reportImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from("report-images")
          .upload(fileName, reportImage);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("report-images").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      // AI Analysis
      const selectedProject = projects.find((p) => p.id === projectId);
      const { data: analysis, error: aiError } = await supabase.functions.invoke("analyze-report", {
        body: {
          description,
          severity,
          projectName: selectedProject?.name || "Unknown",
          imageBase64: reportImagePreview || undefined,
        },
      });

      if (aiError) console.error("AI analysis error:", aiError);
      setAiAnalysis(analysis);

      // Insert report
      const { error: insertError } = await supabase.from("citizen_reports").insert({
        user_id: user.id,
        project_id: projectId,
        title,
        description,
        severity,
        lat,
        lng,
        image_url: imageUrl,
        face_verified: true,
        ai_analysis: analysis?.analysis || null,
        ai_credibility_score: analysis?.credibilityScore || null,
        status: analysis?.shouldFlag ? "flagged" : "pending",
      });

      if (insertError) throw insertError;

      toast({ title: "Report Submitted!", description: `AI Credibility: ${analysis?.credibilityScore || "N/A"}/100` });
      setTimeout(() => navigate("/reports"), 1500);
    } catch (err: any) {
      toast({ title: "Submission Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Submit Citizen Report</h1>
          <p className="text-sm text-muted-foreground">AI-verified, geo-tagged evidence reporting with face recognition</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Face Verification */}
            <FaceVerification
              onVerified={(img) => { setFaceVerified(true); setFaceImage(img); }}
              onFailed={() => setFaceVerified(false)}
            />

            {/* Report Details */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
              <h3 className="font-display text-sm font-semibold text-foreground">Report Details</h3>
              
              <div>
                <Label htmlFor="project">Project</Label>
                <Select value={projectId} onValueChange={setProjectId} required>
                  <SelectTrigger><SelectValue placeholder="Select project..." /></SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief title..." required maxLength={100} />
              </div>

              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you observed..." required maxLength={1000} rows={4} />
              </div>

              <div>
                <Label>Severity</Label>
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div>
                <Label>Evidence Photo</Label>
                <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:border-sky hover:bg-sky-light">
                  {reportImagePreview ? (
                    <img src={reportImagePreview} alt="Evidence" className="h-32 w-auto rounded-lg object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload evidence photo (max 5MB)</span>
                    </>
                  )}
                  <input type="file" accept="image/*" capture="environment" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Map & Submit */}
          <div className="space-y-6">
            {/* Map Pin */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                <MapPin className="h-4 w-4 text-sky" /> Report Location
              </h3>
              <p className="mb-2 text-xs text-muted-foreground">Click map or drag pin to set location. GPS auto-detected.</p>
              <div ref={mapRef} className="h-[300px] rounded-lg border border-border overflow-hidden" />
              <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                <span>Lat: {lat.toFixed(4)}</span>
                <span>Lng: {lng.toFixed(4)}</span>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Verification Status</h3>
              <div className="flex items-center gap-2">
                {faceVerified ? (
                  <Badge className="gap-1 bg-trust-high/10 text-trust-high border-trust-high/20">
                    <ShieldCheck className="h-3 w-3" /> Face Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <AlertTriangle className="h-3 w-3" /> Face Not Verified
                  </Badge>
                )}
              </div>

              {aiAnalysis && (
                <div className="rounded-lg bg-sky-light p-3 space-y-1">
                  <p className="text-xs font-semibold text-foreground">AI Analysis Result</p>
                  <p className="text-xs text-muted-foreground">{aiAnalysis.analysis}</p>
                  <p className="text-xs"><strong>Credibility:</strong> {aiAnalysis.credibilityScore}/100</p>
                  {aiAnalysis.findings?.map((f: string, i: number) => (
                    <p key={i} className="text-xs text-muted-foreground">• {f}</p>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting || !faceVerified || !projectId}>
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing & Submitting...</> : <><Upload className="h-4 w-4" /> Submit Report</>}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
