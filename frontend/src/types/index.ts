export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface BugItem {
  line: number | null;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  description: string;
  suggestion: string;
}

export interface SecurityIssue {
  line: number | null;
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  recommendation: string;
}

export interface PerformanceIssue {
  description: string;
  recommendation: string;
}

export interface Suggestion {
  category: string;
  description: string;
}

export interface Review {
  id: number;
  title: string;
  language: string;
  original_code: string;
  overall_score: number;
  summary: string;
  bugs: BugItem[];
  security_issues: SecurityIssue[];
  performance_issues: PerformanceIssue[];
  suggestions: Suggestion[];
  fixed_code: string | null;
  created_at: string;
}

export interface AnalyticsSummary {
  total_reviews: number;
  avg_score: number;
  languages_used: Record<string, number>;
  bugs_found: number;
  security_issues_found: number;
}
