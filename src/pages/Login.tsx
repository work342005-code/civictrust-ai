import { useState } from "react";
import { Shield, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      navigate("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword.length < 6) {
      toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: { display_name: regName },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account Created!", description: "Please check your email to verify your account." });
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              CivicLens <span className="text-sky">AI</span>
            </span>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="mb-6 w-full">
              <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="flex-1">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Welcome back</h2>
              <p className="mb-6 text-sm text-muted-foreground">Sign in to monitor governance transparency</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-9" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-9" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"} <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <h2 className="mb-1 font-display text-2xl font-bold text-foreground">Create account</h2>
              <p className="mb-6 text-sm text-muted-foreground">Join as a citizen to report and monitor</p>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="name" placeholder="Your full name" className="pl-9" required value={regName} onChange={(e) => setRegName(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="reg-email" type="email" placeholder="you@example.com" className="pl-9" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="reg-password" type="password" placeholder="••••••••" className="pl-9" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
                  </div>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"} <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="relative hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="absolute inset-0 bg-hero opacity-80" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground">
            Empowering Citizens<br />
            <span className="text-gradient-civic">Through Transparency</span>
          </h2>
          <p className="max-w-md text-primary-foreground/70">
            Monitor government projects, submit evidence reports, and help build accountable governance in your community.
          </p>
        </div>
      </div>
    </div>
  );
}
