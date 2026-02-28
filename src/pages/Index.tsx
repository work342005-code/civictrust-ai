import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, BarChart3, Eye, Users, ArrowRight, ChevronRight, MapPin, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Eye,
    title: "AI-Powered Transparency",
    description: "Compare official project reports with ground-level citizen evidence using intelligent scoring algorithms.",
  },
  {
    icon: BarChart3,
    title: "Public Trust Score",
    description: "Every government project gets a 0-100 trust score based on progress accuracy, citizen verification, and delay risk.",
  },
  {
    icon: MapPin,
    title: "Geo-Verified Reports",
    description: "Citizens submit GPS-tagged photo evidence ensuring authentic, location-verified project monitoring.",
  },
  {
    icon: Zap,
    title: "Discrepancy Alerts",
    description: "AI detects gaps >30% between official claims and real progress, triggering automatic alerts.",
  },
];

const stats = [
  { value: "8", label: "Active Projects" },
  { value: "530+", label: "Citizens Engaged" },
  { value: "67%", label: "Avg Trust Score" },
  { value: "3", label: "High Risk Alerts" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-hero opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        <div className="relative z-10">
          {/* Inline nav for landing */}
          <div className="container mx-auto flex h-20 items-center justify-between px-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20 backdrop-blur">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-primary-foreground">
                CivicLens <span className="text-sky">AI</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-primary-foreground/20 text-primary-foreground backdrop-blur hover:bg-primary-foreground/30 border border-primary-foreground/20">
                  Open Dashboard
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="container mx-auto px-4 pb-32 pt-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mx-auto max-w-3xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/90 backdrop-blur">
                <Zap className="h-3.5 w-3.5" />
                AI-Driven Governance Transparency Engine
              </div>
              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Building Public Trust
                <br />
                <span className="text-gradient-civic">Through Transparency</span>
              </h1>
              <p className="mb-8 text-lg leading-relaxed text-primary-foreground/75 sm:text-xl">
                CivicLens AI compares official government project progress with real-world citizen evidence
                to generate verifiable Public Trust Scores for every project.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="bg-sky text-primary-foreground border-0 hover:bg-sky/90 gap-2 text-base px-8 h-12 animate-pulse-glow">
                    Explore Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button size="lg" variant="outline" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10 gap-2 text-base px-8 h-12">
                    View Projects
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-4 backdrop-blur">
                  <div className="font-display text-2xl font-bold text-primary-foreground">{s.value}</div>
                  <div className="text-xs text-primary-foreground/60">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">How CivicLens AI Works</h2>
          <p className="mt-3 text-muted-foreground">AI-powered governance monitoring for complete transparency</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-civic rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-2 font-display text-base font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Formula */}
      <section className="border-t border-border bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">AI Trust Score Formula</h2>
            <div className="rounded-xl border border-border bg-card p-8 font-mono text-sm">
              <div className="space-y-2 text-left text-muted-foreground">
                <p><span className="text-foreground font-semibold">Trust Score</span> =</p>
                <p className="pl-4">(Progress Accuracy × <span className="text-sky font-semibold">0.40</span>) +</p>
                <p className="pl-4">(Transparency Score × <span className="text-sky font-semibold">0.20</span>) +</p>
                <p className="pl-4">(Citizen Evidence × <span className="text-civic-green font-semibold">0.25</span>) +</p>
                <p className="pl-4">(Delay Risk Weight × <span className="text-trust-medium font-semibold">0.15</span>)</p>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-trust-high" />
                <span className="text-muted-foreground">High Trust (70-100)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-trust-medium" />
                <span className="text-muted-foreground">Medium (45-69)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 rounded-full bg-trust-low" />
                <span className="text-muted-foreground">Low Trust (0-44)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-3xl font-bold text-foreground mb-4">
          Ready to Monitor Governance?
        </h2>
        <p className="mb-8 text-muted-foreground">Join 530+ citizens ensuring government accountability in Sangli district.</p>
        <Link to="/dashboard">
          <Button size="lg" className="gap-2 text-base px-8 h-12">
            Get Started <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold text-foreground">CivicLens AI</span>
            <span>© 2025</span>
          </div>
          <p>Public Trust & Governance Transparency Engine — Sangli District Pilot</p>
        </div>
      </footer>
    </div>
  );
}
