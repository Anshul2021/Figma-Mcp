# Project Brief — Crusource

> Project context and layout specification for Crusource platform.

---

## 1. Project Overview & Context

- **Project Name:** Crusource
- **Domain / Industry:** Vendor Management, Recruitment & HRMS Platform
- **Target Audience:** Enterprise HRs, Hiring Managers, Recruiters, Employees, and Vendors/Suppliers
- **Core Value Proposition:** End-to-end recruitment lifecycle management (customer hiring demand aggregation, vendor assignment & fulfillment) paired with comprehensive HRMS & workforce management (employee self-service, attendance, leave tracking, performance).
- **Key User Demands & Workflows:**
  - Client Hiring Demands & Requirement Fulfillment
  - Vendor & Candidate Submissions Tracking
  - Employee HRMS Self-Service Dashboard (Attendance, Leave Requests, Interview Schedules, Assigned Demands, Tasks)

---

## 2. Platform & Desktop Target Specs

- **Primary Platform:** Desktop App / Web Workspace
- **Screen Dimensions:** `1440px × 900px`
- **Orientation:** Landscape Desktop
- **Layout Grid:** 240px Left Navigation Sidebar + 1200px Main Workspace Frame

---

## 3. Desktop Application Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ LEFT SIDEBAR (240px) │ TOP HEADER BAR (1200px × 64px)                       │
│                      ├──────────────────────────────────────────────────────┤
│  Logo / Brand        │ MAIN SCROLL AREA (1200px × 836px)                     │
│  Nav Items           │                                                      │
│  - Dashboard (Active)│ - Welcome Banner & Quick Stats                       │
│  - Hiring Demands    │ - Active Demand Fulfillments                         │
│  - Vendors           │ - Upcoming Interviews & Schedule                     │
│  - HRMS & Attendance │ - Leave & Attendance Summary                         │
│  - Profile           │ - Quick Actions Widget                               │
└──────────────────────┴──────────────────────────────────────────────────────┘
```
