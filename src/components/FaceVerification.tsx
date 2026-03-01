import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FaceVerificationProps {
  onVerified: (imageBase64: string) => void;
  onFailed: () => void;
}

type Status = "idle" | "streaming" | "capturing" | "verifying" | "verified" | "failed";

export default function FaceVerification({ onVerified, onFailed }: FaceVerificationProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [reason, setReason] = useState("");
  const [confidence, setConfidence] = useState(0);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("streaming");
    } catch {
      toast({ title: "Camera Error", description: "Unable to access camera. Please allow camera permissions.", variant: "destructive" });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setStatus("capturing");
    const canvas = canvasRef.current;
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);

    setStatus("verifying");
    try {
      const { data, error } = await supabase.functions.invoke("verify-face", {
        body: { faceImageBase64: imageBase64 },
      });

      if (error) throw error;

      setConfidence(data.confidence || 0);
      setReason(data.reason || "");

      if (data.isLive && data.faceDetected && data.qualityGood && data.confidence >= 60) {
        setStatus("verified");
        stopCamera();
        onVerified(imageBase64);
        toast({ title: "Face Verified ✓", description: `Liveness confirmed (${data.confidence}% confidence)` });
      } else {
        setStatus("failed");
        setReason(data.reason || "Verification failed. Please try again.");
        onFailed();
      }
    } catch (err: any) {
      setStatus("failed");
      setReason(err?.message || "Verification error");
      toast({ title: "Verification Error", description: err?.message || "Please try again", variant: "destructive" });
    }
  };

  const retry = () => {
    setStatus("idle");
    setReason("");
    setConfidence(0);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
        <Camera className="h-4 w-4 text-sky" />
        Face Verification (Liveness Check)
      </h3>

      <div className="relative aspect-[4/3] w-full max-w-sm mx-auto overflow-hidden rounded-lg bg-muted">
        {status === "idle" && (
          <div className="flex h-full items-center justify-center">
            <Button onClick={startCamera} className="gap-2">
              <Camera className="h-4 w-4" /> Start Camera
            </Button>
          </div>
        )}

        <video
          ref={videoRef}
          className={`h-full w-full object-cover ${status === "streaming" || status === "capturing" ? "" : "hidden"}`}
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {status === "verifying" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-sky" />
            <p className="mt-2 text-sm text-muted-foreground">AI analyzing face...</p>
          </div>
        )}

        {status === "verified" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-civic-green-light">
            <CheckCircle2 className="h-10 w-10 text-trust-high" />
            <p className="text-sm font-semibold text-trust-high">Verified ({confidence}%)</p>
            <p className="text-xs text-muted-foreground">{reason}</p>
          </div>
        )}

        {status === "failed" && (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-destructive/5 p-4">
            <XCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm font-semibold text-destructive">Verification Failed</p>
            <p className="text-xs text-center text-muted-foreground">{reason}</p>
            <Button size="sm" variant="outline" onClick={retry} className="mt-2 gap-1">
              <RefreshCw className="h-3 w-3" /> Retry
            </Button>
          </div>
        )}
      </div>

      {status === "streaming" && (
        <div className="mt-3 flex justify-center">
          <Button onClick={captureAndVerify} className="gap-2">
            <Camera className="h-4 w-4" /> Capture & Verify
          </Button>
        </div>
      )}

      <p className="mt-2 text-xs text-center text-muted-foreground">
        AI-powered liveness detection ensures a real person is submitting this report
      </p>
    </div>
  );
}
