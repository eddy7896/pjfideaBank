# 💡 Pi Jam Idea Bank — Project Documentation

Welcome to the **Pi Jam Idea Bank**, a collaborative, web-based platform designed by the **Pi Jam Foundation** to empower the next generation of problem solvers across India. Built around the principles of Computational Thinking and Design-driven innovation, this platform provides schools, teachers, students, and education departments with a unified workspace to identify community problems, brainstorm solutions, build prototypes, and track measurable outcomes.

---

## 🎯 Project Objectives

The core objectives of the Pi Jam Idea Bank are to democratize and systematize design-driven education in schools by:
1. **Nurturing Empathy & Observation**: Encouraging students to identify real-world, localized issues in their neighborhoods, schools, and communities.
2. **Scaffolding the Design Thinking Framework**: Providing a structured, step-by-step pipeline (Empathize, Define, Ideate, Prototype, Test) that guides students from abstract problems to validated solutions.
3. **Fostering Team Collaboration**: Allowing students to form teams, assign roles, co-develop prototypes, and log iterative improvements.
4. **Enabling Structured Calendar Alignment**: Providing monthly thematic focuses (e.g., Sustainability, EdTech, Climate, Health) to synchronize project efforts with relevant global and local issues.
5. **Streamlining Administrative Oversight**: Supplying teachers and super admins with robust tools to log classroom activities, track materials, assess student engagement, and generate performance reports.
6. **Promoting Data-Driven Governance**: Empowering education departments with high-level analytics to monitor regional progress, assess design-thinking stage distribution, and discover outstanding innovations.

---

## 🚀 Key Outcomes & Impact

The system delivers tangible educational and organizational outcomes:
- **Systematic Problem Documentation**: Over 500+ student-led ideas are logged and classified under diverse community themes, serving as an institutional knowledge repository of young innovation.
- **Improved Learning Outcomes**: Standardized Design Thinking pipelines build critical life skills like empathy, critical thinking, problem-solving, and adaptability.
- **Enhanced School Engagement**: Teachers can report classroom sessions, track student attendance split by gender, log raw materials used, and rate class engagement levels directly in a dedicated activities dashboard.
- **Granular Activity Auditing**: Super Admins and the Education Department can audit resource consumption (materials) and track safety compliance (PPE checklists, lab cleanups, and incident reports) across 50+ schools.
- **Secure and Accessible Access (RBAC)**: Easy-to-use role logins (including passcode PIN logins for student groups in low-resource environments) ensure that all stakeholders can interact with the app securely.

---

## 🛠️ Key Features & Modules

### 🎨 Unified Premium Design Language
The application features a modern, state-of-the-art visual design built with HSL variable palettes, glassmorphism, and dynamic animations:
*   **Dynamic Animated Backdrop**: Floating fluid gradient orbs and a subtle SVG grid pattern overlay (`AnimatedBackground`) that creates an immersive, responsive feel.
*   **Acrylic Glass Containers**: Cards and panel overlays designed with glassy backdrops (`backdrop-blur-md bg-card/85 border-border/40 shadow-2xl`) for a high-end look and feel.
*   **Interactive micro-animations**: Focus rings, hover states, scale animations (`active:scale-[0.98]`), and smooth transitions using Framer Motion.
*   **Glassy sticky navbars**: Sticky headers (`bg-background/95 backdrop-blur-sm`) matching the landing page look.

### 🚪 Unified Access & Logins (`/login`)
A central sign-in interface utilizing interactive tab interfaces for diverse user segments:
*   **School Admins & Teachers**: High-level email/password-based access, including direct selector buttons for active demo credentials.
*   **Student Teams**: Simple, accessible, low-resource logins using a unique Team ID and a 6-digit numeric PIN.

### 🏫 School Onboarding Wizard (`/onboard`)
An elegant 4-step registration wizard allowing new schools to join the platform:
1.  **School Basics**: School name and 11-digit UDAISE code capture.
2.  **School Details**: Full address, principal contact, phone number, and optional website link.
3.  **Teacher Credentials**: Setting up the supervisor administrator account.
4.  **Review & Confirm**: Summary check of all entered metadata prior to final completion.
*   *Features*: Interactive geography modal selector with an autocomplete search covering all Indian states and corresponding educational districts.

### 🛡️ Staff Onboarding Portal (`/pijam`)
An internal onboarding wizard designed for field officers and project heads:
*   **Geography Leads**: Designated to oversee operations across entire states, with automatic visibility over all educational districts.
*   **Teacher Trainers**: Assigned to specific districts, registering by selecting their Supervising Geography Lead.
*   *Features*: Stepper indicator tracking chosen roles, reporting relationships, credentials, and full summary review logs.

### 📅 Thematic Calendar Creator
*   **Monthly Focus Themes**: Each month is dedicated to a specific theme (e.g., *Sustainability* for Feb, *EdTech* for Mar, *Health* for Apr) to direct students' creative energies.
*   **Visual Customization**: Admins can customize the theme name, description, representative icon, and aesthetic background gradient.
*   **Calendar View**: Integration of a Google-style monthly activity calendar to schedule and visualize upcoming sessions.

### 📋 Role-Specific Dashboards & RBAC
*   **Super Admin**: Complete administrative oversight over all projects, schools, calendars, and reports.
*   **Schools (Educators & Facilitators)**: Kanban board for dragging projects across stages, form editors for adding new ideas, and submission forms for school activity reports.
*   **Education Department**: High-level regional analytics and read-only access limited to advanced projects (*Prototype* and *Test* stages) for evaluation and funding opportunities.
*   **Student Teams**: Read-write access to their team's specific project files using a simple numeric PIN login.

### 🔄 The Design Thinking Pipeline
Each project progresses through five validation gates:
1.  **Empathize Stage**: Document *Who* is affected, *What* is happening, *When*, *Where*, *How*, and perform a "5 Whys" root cause analysis.
2.  **Define Stage**: Draft the *Problem Statement*, *User Persona*, *Need Statement*, and summarize key research insights.
3.  **Ideate Stage**: Record brainstormed concepts, specify the *Selected Idea*, justify the selection, and outline design or resource constraints.
4.  **Prototype Stage**: List materials and tools required, outline assembly steps, and log multiple design iterations (description, outcome, date).
5.  **Test Stage**: Outline the *Test Plan*, document *Test Results*, log whether it passed or failed, and note failure feedback for future iterations.

---

## 🗄️ Database Schema & Data Models

The data layer uses **PostgreSQL** configured via **Prisma ORM**. The relationships are structured as follows:

```mermaid
erDiagram
    SCHOOL ||--o{ STUDENT_TEAM : registers
    SCHOOL ||--o{ IDEA : hosts
    STUDENT_TEAM ||--o{ TEAM_MEMBER : contains
    STUDENT_TEAM ||--o{ IDEA : develops
    IDEA ||--o{ TIMELINE_EVENT : records
    THEME_ACTIVITY ||--|| ACTIVITY_REPORT : schedules
```

### Key Models

| Model | Description | Key Fields |
| :--- | :--- | :--- |
| **School** | Represents a registered educational institution | `name`, `udaiseCode`, `location`, `principalName` |
| **User** | User profile with login credentials | `email`, `role`, `schoolName`, `displayName`, `teamId` |
| **StudentTeam** | Student teams logging in using a secure numeric PIN | `name`, `schoolName`, `pin`, `members` |
| **TeamMember** | Specific students inside a team | `name`, `grade`, `gender`, `contactNumber` |
| **Idea** | The core project entity traversing the DT pipeline | `title`, `theme`, `status`, `stageData` (JSON format), `studentTeam` |
| **TimelineEvent** | An audit log of all events related to a project | `type` (creation, stage change, comment), `content`, `timestamp` |
| **ThemeActivity** | Events scheduled under the monthly calendar | `title`, `theme`, `schoolName`, `date`, `month`, `year` |
| **ActivityReport** | Teacher session report log | `teacherName`, `totalStudents`, `materials` (JSON), `safetyBriefing` |

---

## 👥 Role-Based Access Control Matrix

| Feature / Action | Super Admin | School | Education Dept | Student |
| :--- | :---: | :---: | :---: | :---: |
| **Create & Submit Projects** | ❌ | **Yes** | ❌ | ❌ |
| **View All Projects** | **Yes** | *Own School Only* | *Advanced Only* (Prototype/Test) | *Own Project Only* |
| **Update Project Stage / Data** | ❌ | **Yes** (*Own School*) | ❌ | **Yes** (*Own Project*) |
| **Manage Monthly Themes** | **Yes** | ❌ | ❌ | ❌ |
| **Submit Activity Reports** | ❌ | **Yes** | ❌ | ❌ |
| **View System Analytics** | **Yes** | **Yes** | **Yes** | ❌ |

---

## 💻 Tech Stack & Architecture

-   **Frontend**: React (Next.js 14 App Router), Tailwind CSS for standard layout variables, shadcn/ui for components, Framer Motion for premium landing page animations, Lucide React for consistent iconography.
-   **Database & ORM**: PostgreSQL with Prisma ORM.
-   **State Management**: Zustand stores (`useAuthStore`, `useIdeaStore`, `useThemeStore`, `useActivityStore`) with REST endpoints under `/api`.
-   **Serverless Deployment**: Vercel-ready with optimized serverless build configs.

---

## ⚙️ Local Development Setup

To run this application locally, follow these steps:

1.  **Clone the Repository** and install dependencies:
    ```bash
    npm install
    ```
2.  **Environment Variables**: Create a `.env.local` file in the root directory:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/ideabank_db?schema=public"
    ```
3.  **Database Migration & Seeding**: Initialize and seed your database:
    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` to interact with the platform.

5.  **Demo Logins**:
    *   **Super Admin**: `admin@pijam.org` / `admin123`
    *   **School (Springfield High)**: `school@springfield.edu` / `school123`
    *   **School (Riverside Academy)**: `school@riverside.edu` / `school123`
    *   **Education Department**: `edu@education.gov` / `edu123`
