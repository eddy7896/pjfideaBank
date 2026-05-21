md_content = """# Pi Jam Foundation: Ideabank System Overview

## 1. Introduction
The **Ideabank** is a comprehensive project repository and tracking system designed for the Pi Jam Foundation. It serves as a centralized platform to view details of student ideas, track student progress, and monitor project execution across various geographic levels.

The system is built on a strict hierarchical structure with robust data isolation to ensure that users at various levels—from global administrators to individual student teams—only access the data relevant to their specific roles and regions.

---

## 2. User Hierarchy & Roles

The system operates on a multi-tiered hierarchy. Below are the key roles and their respective permissions:

### 2.1 Super Admin
* **Access Level:** Global (Full System Oversight)
* **Responsibilities:** Complete access to the entire system. Oversees all leads, geographies, schools, and student projects. Manages overall platform settings and compliance.

### 2.2 Program Lead (PL) & Teacher Trainer Lead (TTL)
* **Access Level:** Global / Lead Dashboard
* **Responsibilities:** * Create and manage **Geographies** and **Sub-Geographies**.
    * Define the territorial structure for the project deployment.
    * View aggregate data across all managed regions.

### 2.3 Geography Lead / Project Lead (GL / PL)
* **Access Level:** Geography-specific
* **Responsibilities:**
    * Onboard onto the system by providing their Name, Email ID, and selecting their designated Geography or Sub-Geography.
    * Manage and oversee operations within their specific region.
    * Serve as the direct point of contact and manager for Teacher Trainers.

### 2.4 Teacher Trainer (TT)
* **Access Level:** Sub-Geography / District-specific
* **Responsibilities:**
    * Register by selecting their assigned Project Lead.
    * Access and view data strictly from the districts within their assigned Sub-Geography.
    * Oversee the performance and participation of schools under their jurisdiction.

### 2.5 Schools (School Admin)
* **Access Level:** School-specific
* **Responsibilities:**
    * Login/Register to access the School Dashboard.
    * View school-specific analytics.
    * **CRUD Operations:** Create, Read, Update, and Delete student ideas/projects.
    * **Automation:** Upon creating a student idea, the system automatically generates a unique Team Login ID.

### 2.6 Student Teams
* **Access Level:** Project-specific
* **Responsibilities:**
    * Log into the system using the auto-generated Team Login ID provided by their school.
    * Update project details, submit progress reports, and change the status of their ideas.

### 2.7 SED (State Education Department) Dashboard
* **Access Level:** Geography-wide (Analytical)
* **Responsibilities:**
    * Login IDs are automatically generated when a new Geography is created by the PL/TTL.
    * Access data division insights and view analytics for ideas submitted by students across their designated geography.

---

## 3. Data Isolation Architecture

A core requirement of the Ideabank system is strict **Data Isolation** (Multi-tenancy). 
* **Horizontal Isolation:** Data is completely isolated between peer entities (e.g., School A cannot see School B's data; Sub-geography X cannot see Sub-geography Y's data).
* **Vertical Roll-up:** Data flows upwards. A Teacher Trainer can see all schools in their district, a Project Lead can see all TTs in their geography, and the Super Admin sees everything.

---

## 4. System Architecture Diagram

flowchart TD
    %% Node Definitions - Roles
    SuperAdmin([Super Admin])
    PL_TTL([Program Lead / Teacher Trainer Lead])
    GL_PL([Geography / Project Lead])
    SED([SED User])
    TT([Teacher Trainer])
    SchoolUser([School Admin])
    Team([Student Team])

    %% Node Definitions - System Components & Data
    GeoSystem[Geography & Sub-Geography Creator]
    SEDDash[SED Dashboard]
    TTData[(District / Sub-Geo Data)]
    SchoolDash[School Analytics]
    IdeaCRUD{Student Idea CRUD}
    ProjectData[(Project / Idea Details)]

    %% --- Global Level ---
    SuperAdmin ==>|Full System Oversight| PL_TTL
    
    subgraph Global_Access [Global Level - Full Access]
        PL_TTL
        GeoSystem
    end
    
    PL_TTL -->|Creates| GeoSystem

    %% --- Geography Level ---
    GeoSystem -->|Onboards & Selects Geo| GL_PL
    GeoSystem -->|Generates Login ID| SED
    
    subgraph Geography_Isolation [Geography Level - Data Isolated by Geo]
        GL_PL
        SED
        SEDDash
    end
    
    SED -->|Views Data Division| SEDDash

    %% --- Sub-Geography / TT Level ---
    GL_PL -->|Registers & Selects Lead| TT
    
    subgraph TT_Isolation [Teacher Trainer Level - Data Isolated by Sub-Geo]
        TT
        TTData
    end
    
    TT -->|Views District Data| TTData

    %% --- School Level ---
    TT -->|Oversees| SchoolUser
    
    subgraph School_Isolation [School Level - Data Isolated by School]
        SchoolUser
        SchoolDash
        IdeaCRUD
    end
    
    SchoolUser -->|Views| SchoolDash
    SchoolUser -->|Manages| IdeaCRUD

    %% --- Student/Team Level ---
    IdeaCRUD -->|Generates Team Login ID| Team
    IdeaCRUD -->|Creates/Stores| ProjectData
    
    subgraph Team_Isolation [Team Level - Data Isolated by Project]
        Team
        ProjectData
    end
    
    Team -->|Logs in & Updates Status/Details| ProjectData

    %% Styling for better visual differentiation
    classDef admin fill:#f9d0c4,stroke:#333,stroke-width:2px,color:#000;
    classDef lead fill:#fff59d,stroke:#333,stroke-width:2px,color:#000;
    classDef school fill:#bbdefb,stroke:#0277bd,stroke-width:2px,color:#000;
    classDef team fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px,color:#000;

    class SuperAdmin admin;
    class PL_TTL,GL_PL,SED,TT lead;
    class SchoolUser,SchoolDash,IdeaCRUD school;
    class Team,ProjectData team;