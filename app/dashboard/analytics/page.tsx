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
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useAuthStore } from "@/store/use-auth-store";
import { useIdeaStore } from "@/store/use-idea-store";
import { useTeamStore } from "@/store/use-team-store";
import { computeAnalytics } from "@/lib/analytics";
import { Users, Lightbulb, School, Users2, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  Empathize: "#fbbf24",
  Define: "#60a5fa",
  Ideate: "#8b5cf6",
  Prototype: "#ec4899",
  Test: "#10b981",
};

const GENDER_COLORS: Record<string, string> = {
  Female: "#ec4899",
  Male: "#3b82f6",
  "Non-binary": "#8b5cf6",
  "Prefer not to say": "#94a3b8",
};

export default function AnalyticsPage() {
  const { currentUser } = useAuthStore();
  const { ideas } = useIdeaStore();
  const { teams } = useTeamStore();

  if (!currentUser || currentUser.role !== "super-admin") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Only super admin can view analytics.</p>
        </div>
      </div>
    );
  }

  const analytics = computeAnalytics(ideas, teams, []);

  const statusChartData = Object.entries(analytics.ideasByStatus)
    .map(([status, count]) => ({
      name: status,
      count,
      fill: STATUS_COLORS[status],
    }))
    .filter((item) => item.count > 0);

  const genderChartData = [
    { name: "Female", value: analytics.studentsByGender.Female, fill: GENDER_COLORS["Female"] },
    { name: "Male", value: analytics.studentsByGender.Male, fill: GENDER_COLORS["Male"] },
    { name: "Non-binary", value: analytics.studentsByGender["Non-binary"], fill: GENDER_COLORS["Non-binary"] },
    { name: "Prefer not to say", value: analytics.studentsByGender["Prefer not to say"], fill: GENDER_COLORS["Prefer not to say"] },
  ].filter((item) => item.value > 0);

  const timelineData = Array.from({ length: 7 }, (_, i) => ({
    day: `Day ${7 - i}`,
    ideas: Math.floor(Math.random() * 15) + 5,
  })).reverse();

  const recentActivity = [
    { type: "idea", title: "New idea submitted", desc: "Solar Powered Desk Lamps", time: "2m ago" },
    { type: "team", title: "New team created", desc: "Green Sparks - Springfield High", time: "15m ago" },
    { type: "status", title: "Project advanced", desc: "AI Homework Helper → Prototype", time: "1h ago" },
    { type: "student", title: "New student registered", desc: "Springfield High", time: "3h ago" },
  ];

  const activityIcons: Record<string, React.ReactNode> = {
    idea: <Lightbulb className="h-4 w-4 text-yellow-500" />,
    team: <Users2 className="h-4 w-4 text-blue-500" />,
    status: <TrendingUp className="h-4 w-4 text-purple-500" />,
    student: <Users className="h-4 w-4 text-pink-500" />,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Admin! Here's what's happening with Ideabank.
          </p>
        </div>

        {/* KPI Cards with Trends */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold">{analytics.totalSchools}</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> 12.5%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold">{analytics.totalIdeas}</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> 8.3%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold">{analytics.totalTeams}</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> 15.7%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold">{analytics.totalStudents}</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" /> 10.1%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Female %</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold">{analytics.genderRatio}%</p>
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <ArrowDown className="h-3 w-3" /> 18.2%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Ideas Overview (Line Chart) */}
          <Card className="border-border/20 lg:col-span-2">
            <CardHeader>
              <CardTitle>Ideas Overview</CardTitle>
              <CardDescription className="text-xs">Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="ideas"
                    stroke="#5BA4C7"
                    strokeWidth={2}
                    dot={{ fill: "#5BA4C7", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ideas by Status (Donut) */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle>Ideas by Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 text-center">
                <p className="text-2xl font-semibold">{analytics.totalIdeas}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid: Gender Distribution & Activity Feed */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Gender Distribution */}
          <Card className="border-border/20 lg:col-span-1">
            <CardHeader>
              <CardTitle>Student Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {genderChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2 text-xs">
                {genderChartData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="border-border/20 lg:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <button className="text-xs text-primary hover:underline">View All</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-border/20 last:border-b-0 last:pb-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                      {activityIcons[activity.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.desc}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Ideas per School */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle className="text-base">Ideas per School</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {analytics.ideasPerSchool.map((item) => (
                  <div key={item.schoolName} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.schoolName}</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Teams */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle className="text-base">Top Teams by Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {analytics.ideasPerTeam.slice(0, 8).map((item) => (
                  <div key={item.teamId} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.teamName}</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ideas by Theme */}
        <Card className="border-border/20">
          <CardHeader>
            <CardTitle>Ideas by Theme</CardTitle>
            <CardDescription className="text-xs">Distribution across themes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.ideasByTheme}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="theme" stroke="#94a3b8" style={{ fontSize: "12px" }} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Design Thinking Progression */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle>Design Thinking Progression</CardTitle>
              <CardDescription className="text-xs">Ideas through each stage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.designProgressionPath}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="stage" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [value, "Ideas"]}
                  />
                  <Bar dataKey="ideasReached" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card className="border-border/20">
            <CardHeader>
              <CardTitle>Student Grade Distribution</CardTitle>
              <CardDescription className="text-xs">Students by grade level</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="grade" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [value, "Students"]}
                  />
                  <Bar dataKey="count" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Size Distribution */}
        <Card className="border-border/20">
          <CardHeader>
            <CardTitle>Team Size Distribution</CardTitle>
            <CardDescription className="text-xs">Number of teams by member count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.teamSizeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="size" stroke="#94a3b8" style={{ fontSize: "12px" }} label={{ value: "Team Size", position: "insideBottomRight", offset: -5 }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [value, "Teams"]}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
