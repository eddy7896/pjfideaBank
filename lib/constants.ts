import type { DesignThinkingStatus, ThemeMonth, User } from "@/types";

export const DESIGN_THINKING_STAGES: DesignThinkingStatus[] = [
  "Empathize",
  "Define",
  "Ideate",
  "Prototype",
  "Test",
];

export const STATUS_COLORS: Record<
  DesignThinkingStatus,
  { bg: string; text: string; border: string; dot: string }
> = {
  Empathize: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  Define: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    dot: "bg-violet-500",
  },
  Ideate: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  Prototype: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Test: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

export const THEME_MONTHS: ThemeMonth[] = [
  {
    month: "January",
    shortMonth: "Jan",
    theme: "Local Problems",
    description: "Identify and solve issues in your neighborhood",
    icon: "MapPin",
    gradient: "from-slate-500 to-blue-600",
  },
  {
    month: "February",
    shortMonth: "Feb",
    theme: "Sustainability",
    description: "Build solutions for a greener future",
    icon: "Leaf",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    month: "March",
    shortMonth: "Mar",
    theme: "EdTech",
    description: "Innovate how we learn and teach",
    icon: "GraduationCap",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    month: "April",
    shortMonth: "Apr",
    theme: "Health",
    description: "Improve health and wellness in communities",
    icon: "HeartPulse",
    gradient: "from-red-400 to-pink-600",
  },
  {
    month: "May",
    shortMonth: "May",
    theme: "Community",
    description: "Strengthen local community bonds",
    icon: "Users",
    gradient: "from-orange-400 to-amber-600",
  },
  {
    month: "June",
    shortMonth: "Jun",
    theme: "Climate",
    description: "Address climate change with innovative thinking",
    icon: "CloudSun",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    month: "July",
    shortMonth: "Jul",
    theme: "Arts",
    description: "Use creativity and art for social impact",
    icon: "Palette",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  {
    month: "August",
    shortMonth: "Aug",
    theme: "Future of Work",
    description: "Reimagine how the world will work tomorrow",
    icon: "Briefcase",
    gradient: "from-indigo-500 to-blue-700",
  },
  {
    month: "September",
    shortMonth: "Sep",
    theme: "Transportation",
    description: "Design smarter ways to move people and goods",
    icon: "Bus",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    month: "October",
    shortMonth: "Oct",
    theme: "Social Justice",
    description: "Build equitable systems for everyone",
    icon: "Scale",
    gradient: "from-rose-500 to-red-700",
  },
  {
    month: "November",
    shortMonth: "Nov",
    theme: "Space",
    description: "Explore solutions inspired by the cosmos",
    icon: "Rocket",
    gradient: "from-gray-700 to-indigo-900",
  },
  {
    month: "December",
    shortMonth: "Dec",
    theme: "Global Goals",
    description: "Contribute to the UN Sustainable Development Goals",
    icon: "Globe",
    gradient: "from-blue-600 to-green-600",
  },
];

export const MOCK_USERS: User[] = [
  { role: "super-admin", displayName: "Super Admin" },
  { role: "school", schoolName: "Springfield High", displayName: "Springfield High" },
  { role: "school", schoolName: "Riverside Academy", displayName: "Riverside Academy" },
  { role: "education-dept", displayName: "Education Department" },
];

export const SCHOOLS = [
  "Springfield High",
  "Riverside Academy",
  "Oakwood School",
  "Maplewood Institute",
];
