"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useAuthStore } from "@/store/use-auth-store";
import { useIdeaStore } from "@/store/use-idea-store";
import { useTeamStore } from "@/store/use-team-store";
import { computeAnalytics } from "@/lib/analytics";
import { Users, Lightbulb, School, Users2, TrendingUp } from "lucide-react";

const COLORS = [
  "#5BA4C7", // primary teal
  "#94a3b8", // muted
  "#e2e8f0", // light
  "#1e293b", // dark
  "#f1f5f9", // very light
];

const STATUS_COLORS: Record<string, string> = {
  Empathize: "#fbbf24",
  Define: "#60a5fa",
  Ideate: "#8b5cf6",
  Prototype: "#ec4899",
  Test: "#10b981",
};

export default function AnalyticsPage() {
  const { currentUser } = useAuthStore();
  const { ideas } = useIdeaStore();
  const { teams } = useTeamStore();

  if (!currentUser || currentUser.role !== "super-admin") {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Only super admin can view analytics.</p>
      </div>
    );
  }

  const analytics = computeAnalytics(ideas, teams, []);

  const statusChartData = Object.entries(analytics.ideasByStatus).map(
    ([status, count]) => ({
      name: status,
      count,
      fill: STATUS_COLORS[status],
    })
  );

  const genderChartData = [
    { name: "Female", value: analytics.studentsByGender.Female },
    { name: "Male", value: analytics.studentsByGender.Male },
    { name: "Non-binary", value: analytics.studentsByGender["Non-binary"] },
    {
      name: "Prefer not to say",
      value: analytics.studentsByGender["Prefer not to say"],
    },
  ];

  const schoolsChartData = analytics.ideasPerSchool.map((item) => ({
    name: item.schoolName,
    ideas: item.count,
  }));

  const teamsChartData = analytics.ideasPerTeam.slice(0, 10).map((item) => ({
    name: item.teamName,
    ideas: item.count,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of all schools, teams, and ideas
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <School className="h-4 w-4 text-primary" />
                Schools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{analytics.totalSchools}</p>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Ideas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{analytics.totalIdeas}</p>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users2 className="h-4 w-4 text-primary" />
                Teams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{analytics.totalTeams}</p>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {analytics.totalStudents}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Female %
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">
                {analytics.genderRatio}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ideas by Status */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle>Ideas by Status</CardTitle>
              <CardDescription>
                Design thinking stage distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="count" fill="#5BA4C7" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gender Distribution */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle>Student Gender Distribution</CardTitle>
              <CardDescription>
                Breakdown by gender across all teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) =>
                      `${name}: ${value}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ideas per School */}
          <Card className="border-border/20 lg:col-span-2">
            <CardHeader>
              <CardTitle>Ideas per School</CardTitle>
              <CardDescription>Total ideas submitted by each school</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={schoolsChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    width={180}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="ideas" fill="#5BA4C7" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Teams by Ideas */}
          <Card className="border-border/20 lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Teams by Ideas</CardTitle>
              <CardDescription>Most active teams (top 10)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={teamsChartData}
                  margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    width={180}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="ideas" fill="#10b981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stats Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Students per Team */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle className="text-base">Students per Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {analytics.studentsPerTeam.map((item) => (
                  <div
                    key={item.teamId}
                    className="flex justify-between rounded border border-border/20 bg-muted/30 p-2 text-sm"
                  >
                    <span className="font-medium">{item.teamName}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Teams per School */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle className="text-base">Teams per School</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.teamsPerSchool.map((item) => (
                  <div
                    key={item.schoolName}
                    className="flex justify-between rounded border border-border/20 bg-muted/30 p-2 text-sm"
                  >
                    <span className="font-medium">{item.schoolName}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
