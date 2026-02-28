export interface Project {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  budget: number;
  officialCompletion: number;
  aiEstimatedCompletion: number;
  timeline: string;
  department: string;
  delayRisk: 'Low' | 'Medium' | 'High';
  trustScore: number;
  citizenReports: number;
  description: string;
  startDate: string;
  endDate: string;
}

export interface CitizenReport {
  id: string;
  projectId: string;
  citizenName: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  lat: number;
  lng: number;
  imageUrl: string;
  verified: boolean;
  credibilityScore: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin' | 'moderator';
  credibilityScore: number;
  reportsCount: number;
  joinDate: string;
  status: 'active' | 'flagged' | 'suspended';
}

export const SANGLI_CENTER = { lat: 16.8524, lng: 74.5815 };

export const projects: Project[] = [
  {
    id: "PRJ-001",
    name: "Sangli-Miraj-Kupwad Smart Road Network",
    location: "Sangli City, Maharashtra",
    lat: 16.8524,
    lng: 74.5815,
    budget: 45000000,
    officialCompletion: 78,
    aiEstimatedCompletion: 52,
    timeline: "2024-2026",
    department: "Public Works Department",
    delayRisk: "High",
    trustScore: 42,
    citizenReports: 156,
    description: "Smart road infrastructure connecting Sangli, Miraj, and Kupwad with IoT-enabled traffic management.",
    startDate: "2024-01-15",
    endDate: "2026-06-30",
  },
  {
    id: "PRJ-002",
    name: "Krishna River Waterfront Development",
    location: "Krishna Riverbank, Sangli",
    lat: 16.8450,
    lng: 74.5700,
    budget: 32000000,
    officialCompletion: 65,
    aiEstimatedCompletion: 60,
    timeline: "2024-2025",
    department: "Urban Development Authority",
    delayRisk: "Low",
    trustScore: 82,
    citizenReports: 89,
    description: "Beautification and flood management along Krishna River with public parks and walkways.",
    startDate: "2024-03-01",
    endDate: "2025-12-31",
  },
  {
    id: "PRJ-003",
    name: "Sangli Digital Health Center",
    location: "Vishrambag, Sangli",
    lat: 16.8600,
    lng: 74.5900,
    budget: 18000000,
    officialCompletion: 90,
    aiEstimatedCompletion: 85,
    timeline: "2024-2025",
    department: "Health Department",
    delayRisk: "Low",
    trustScore: 91,
    citizenReports: 45,
    description: "AI-powered health diagnostics center with telemedicine facilities serving rural Sangli district.",
    startDate: "2024-02-01",
    endDate: "2025-08-31",
  },
  {
    id: "PRJ-004",
    name: "Miraj Junction Railway Modernization",
    location: "Miraj, Sangli District",
    lat: 16.8300,
    lng: 74.6400,
    budget: 65000000,
    officialCompletion: 55,
    aiEstimatedCompletion: 35,
    timeline: "2023-2026",
    department: "Indian Railways",
    delayRisk: "High",
    trustScore: 38,
    citizenReports: 203,
    description: "Complete modernization of Miraj Junction with new platforms, digital signage, and passenger amenities.",
    startDate: "2023-06-01",
    endDate: "2026-03-31",
  },
  {
    id: "PRJ-005",
    name: "Sangli Municipal Waste Processing Plant",
    location: "Industrial Area, Sangli",
    lat: 16.8700,
    lng: 74.5500,
    budget: 22000000,
    officialCompletion: 70,
    aiEstimatedCompletion: 62,
    timeline: "2024-2025",
    department: "Municipal Corporation",
    delayRisk: "Medium",
    trustScore: 65,
    citizenReports: 67,
    description: "Modern waste processing facility with recycling capabilities serving Sangli-Miraj region.",
    startDate: "2024-04-01",
    endDate: "2025-10-31",
  },
  {
    id: "PRJ-006",
    name: "Kupwad Industrial Zone Expansion",
    location: "Kupwad, Sangli District",
    lat: 16.8200,
    lng: 74.6100,
    budget: 85000000,
    officialCompletion: 40,
    aiEstimatedCompletion: 38,
    timeline: "2024-2027",
    department: "MIDC",
    delayRisk: "Medium",
    trustScore: 71,
    citizenReports: 34,
    description: "Expansion of Kupwad industrial zone with new plots, road access, and utility infrastructure.",
    startDate: "2024-01-01",
    endDate: "2027-12-31",
  },
  {
    id: "PRJ-007",
    name: "Sangli Solar Power Grid",
    location: "Sangli Outskirts",
    lat: 16.8800,
    lng: 74.5300,
    budget: 55000000,
    officialCompletion: 82,
    aiEstimatedCompletion: 79,
    timeline: "2024-2026",
    department: "Energy Department",
    delayRisk: "Low",
    trustScore: 88,
    citizenReports: 28,
    description: "100MW solar power installation to supply clean energy to Sangli district.",
    startDate: "2024-05-01",
    endDate: "2026-04-30",
  },
  {
    id: "PRJ-008",
    name: "Sangli Smart Water Supply Network",
    location: "Sangli City",
    lat: 16.8550,
    lng: 74.5750,
    budget: 28000000,
    officialCompletion: 60,
    aiEstimatedCompletion: 40,
    timeline: "2024-2026",
    department: "Water Supply Department",
    delayRisk: "High",
    trustScore: 35,
    citizenReports: 178,
    description: "IoT-enabled water distribution with smart meters and leak detection across the city.",
    startDate: "2024-02-15",
    endDate: "2026-02-28",
  },
];

export const citizenReports: CitizenReport[] = [
  { id: "RPT-001", projectId: "PRJ-001", citizenName: "Rajesh Patil", description: "Road construction halted near Ganapati Temple area for 3 weeks", severity: "High", timestamp: "2025-02-20T10:30:00", lat: 16.8530, lng: 74.5820, imageUrl: "", verified: true, credibilityScore: 85 },
  { id: "RPT-002", projectId: "PRJ-001", citizenName: "Priya Deshmukh", description: "Poor quality materials used on bypass road section", severity: "Critical", timestamp: "2025-02-18T14:15:00", lat: 16.8510, lng: 74.5800, imageUrl: "", verified: true, credibilityScore: 92 },
  { id: "RPT-003", projectId: "PRJ-004", citizenName: "Amit Jadhav", description: "Railway platform construction incomplete despite official 55% claim", severity: "High", timestamp: "2025-02-15T09:00:00", lat: 16.8305, lng: 74.6410, imageUrl: "", verified: true, credibilityScore: 78 },
  { id: "RPT-004", projectId: "PRJ-008", citizenName: "Sunita Kulkarni", description: "Water pipelines installed but not connected in Ward 12", severity: "Medium", timestamp: "2025-02-22T16:45:00", lat: 16.8560, lng: 74.5760, imageUrl: "", verified: false, credibilityScore: 70 },
  { id: "RPT-005", projectId: "PRJ-002", citizenName: "Mahesh Bhosale", description: "Riverfront park landscaping progressing well", severity: "Low", timestamp: "2025-02-21T11:20:00", lat: 16.8455, lng: 74.5710, imageUrl: "", verified: true, credibilityScore: 88 },
];

export const users: User[] = [
  { id: "USR-001", name: "Rajesh Patil", email: "rajesh.p@email.com", role: "citizen", credibilityScore: 85, reportsCount: 23, joinDate: "2024-06-15", status: "active" },
  { id: "USR-002", name: "Priya Deshmukh", email: "priya.d@email.com", role: "citizen", credibilityScore: 92, reportsCount: 45, joinDate: "2024-03-20", status: "active" },
  { id: "USR-003", name: "Amit Jadhav", email: "amit.j@email.com", role: "citizen", credibilityScore: 78, reportsCount: 12, joinDate: "2024-09-10", status: "active" },
  { id: "USR-004", name: "Sunita Kulkarni", email: "sunita.k@email.com", role: "citizen", credibilityScore: 70, reportsCount: 8, joinDate: "2024-11-05", status: "flagged" },
  { id: "USR-005", name: "Admin User", email: "admin@civiclens.gov.in", role: "admin", credibilityScore: 100, reportsCount: 0, joinDate: "2024-01-01", status: "active" },
  { id: "USR-006", name: "Mod User", email: "mod@civiclens.gov.in", role: "moderator", credibilityScore: 100, reportsCount: 0, joinDate: "2024-01-01", status: "active" },
];

export const trustScoreDistribution = [
  { range: "0-20", count: 2, fill: "hsl(0, 80%, 55%)" },
  { range: "21-40", count: 5, fill: "hsl(20, 85%, 52%)" },
  { range: "41-60", count: 8, fill: "hsl(40, 95%, 52%)" },
  { range: "61-80", count: 12, fill: "hsl(80, 60%, 45%)" },
  { range: "81-100", count: 6, fill: "hsl(150, 65%, 42%)" },
];

export const monthlyParticipation = [
  { month: "Sep", reports: 45, users: 120 },
  { month: "Oct", reports: 67, users: 180 },
  { month: "Nov", reports: 89, users: 245 },
  { month: "Dec", reports: 112, users: 310 },
  { month: "Jan", reports: 145, users: 420 },
  { month: "Feb", reports: 178, users: 530 },
];

export const departmentPerformance = [
  { dept: "PWD", trustScore: 48, projects: 3 },
  { dept: "UDA", trustScore: 82, projects: 2 },
  { dept: "Health", trustScore: 91, projects: 1 },
  { dept: "Railways", trustScore: 38, projects: 1 },
  { dept: "Municipal", trustScore: 65, projects: 2 },
  { dept: "MIDC", trustScore: 71, projects: 1 },
  { dept: "Energy", trustScore: 88, projects: 1 },
  { dept: "Water", trustScore: 35, projects: 1 },
];

export function calculateTrustScore(project: Project): {
  progressAccuracy: number;
  transparencyScore: number;
  citizenEvidence: number;
  delayRiskWeight: number;
  finalScore: number;
} {
  const diff = Math.abs(project.officialCompletion - project.aiEstimatedCompletion);
  const progressAccuracy = Math.max(0, 100 - diff * 2);
  const transparencyScore = project.citizenReports > 50 ? 75 : project.citizenReports > 20 ? 60 : 40;
  const citizenEvidence = Math.min(100, project.citizenReports * 0.8);
  const delayRiskWeight = project.delayRisk === 'Low' ? 90 : project.delayRisk === 'Medium' ? 60 : 30;
  
  const finalScore = Math.round(
    progressAccuracy * 0.4 +
    transparencyScore * 0.2 +
    citizenEvidence * 0.25 +
    delayRiskWeight * 0.15
  );

  return { progressAccuracy, transparencyScore, citizenEvidence, delayRiskWeight, finalScore };
}

export function getTrustLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 70) return 'high';
  if (score >= 45) return 'medium';
  return 'low';
}

export function formatBudget(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}
