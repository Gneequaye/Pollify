# Pollify — Complete Product Story
> Version 1.0 | Last Updated: 2026-02-16 | Status: Approved for Development

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [User Roles](#2-user-roles)
3. [Epic 1 — Super Admin: School Invitation](#3-epic-1--super-admin-school-invitation)
4. [Epic 2 — School Onboarding](#4-epic-2--school-onboarding)
5. [Epic 3 — Admin Dashboard & Voter Verification Setup](#5-epic-3--admin-dashboard--voter-verification-setup)
6. [Epic 4 — Voter Registration](#6-epic-4--voter-registration)
7. [Epic 5 — Election Management](#7-epic-5--election-management)
8. [Epic 6 — Voting](#8-epic-6--voting)
9. [Epic 7 — Live Results](#9-epic-7--live-results)
10. [School Type Matrix](#10-school-type-matrix)
11. [Database Tables Summary](#11-database-tables-summary)
12. [Open Questions](#12-open-questions)

---

## 1. Project Overview

Pollify is a multi-tenant university voting SaaS platform. Multiple universities and schools share the same platform infrastructure while their data remains completely isolated from each other. Each school gets its own private voting environment with its own elections, candidates, voters, and real-time results.

Pollify is invitation-only. Schools do not self-register — they are invited by the Pollify super admin, giving the platform an exclusive, professional feel and ensuring quality control over who joins.

**Platform supports two types of schools:**
- **Domain Schools** — schools with official student email domains (e.g. `st.ug.edu.gh`)
- **Code Schools** — schools without official student email domains (smaller colleges, polytechnics)

---

## 2. User Roles

| Role | Belongs To | Responsibilities |
|------|-----------|-----------------|
| **Super Admin** | Pollify platform (master) | Sends invitations, approves schools, manages platform |
| **Tenant Admin** | A specific school | Creates elections, manages candidates, monitors results |
| **Voter** | A specific school | Registers, logs in, casts votes in active elections |

---

## 3. Epic 1 — Super Admin: School Invitation

### Story 1.1 — Send Invitation

**As a** super admin
**I want to** send an invitation to a school
**So that** the school can onboard onto Pollify

**Acceptance Criteria:**
- Super admin fills in school name and school contact email
- System auto-generates a unique invitation ID (format: `INV_001`, `INV_002`, etc.)
- System saves the invitation record with status `PENDING`
- System sends an invitation email to the school contact email
- Email contains the school name, a personal welcome message, and an **Accept Invitation** button
- The Accept Invitation button links to: `/onboarding?invitationId=INV_001`
- Invitation expires after **7 days** if not accepted

**Form Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| School Name | Yes | Free text |
| School Contact Email | Yes | Valid email format |

**Invitation Record Saved:**
| Field | Value |
|-------|-------|
| Invitation ID | Auto-generated e.g. `INV_001` |
| School Name | From form |
| School Email | From form |
| Status | `PENDING` |
| Created At | Timestamp |
| Expires At | Created At + 7 days |

---

### Story 1.2 — View All Invitations

**As a** super admin
**I want to** see all invitations I have sent
**So that** I can track which schools have accepted, are pending, or have expired

**Acceptance Criteria:**
- Super admin can see a list of all invitations
- Each invitation shows: School Name, Email, Invitation ID, Status, Created Date, Expiry Date
- Status values: `PENDING`, `ACCEPTED`, `EXPIRED`
- Super admin can resend an expired invitation
- Super admin can cancel a pending invitation

---

## 4. Epic 2 — School Onboarding

### Story 2.1 — Accept Invitation

**As a** school representative
**I want to** accept the invitation I received
**So that** I can begin setting up my school on Pollify

**Acceptance Criteria:**
- Clicking **Accept Invitation** in email opens `/onboarding?invitationId=INV_001`
- Backend validates the invitation ID:
    - If valid and `PENDING` → proceed to onboarding form
    - If already `ACCEPTED` → show message: "This invitation has already been used"
    - If `EXPIRED` → show message: "This invitation has expired. Please contact Pollify."
    - If not found → show message: "Invalid invitation link."
- Invitation status updated to `ACCEPTED` with `accepted_at` timestamp on completion

---

### Story 2.2 — Onboarding Form (Step 1 of 2): School Identity

**As a** school representative
**I want to** set up my school's basic details
**So that** my school account is created on Pollify

**Acceptance Criteria:**
- School name is pre-filled from the invitation and is editable
- Admin email is pre-filled from the invitation and is NOT editable
- Admin must enter their full name, choose a password, and confirm it
- Password must be minimum 8 characters with at least one number
- Logo upload is optional (PNG or JPG, max 2MB)
- Form validates all required fields before proceeding to Step 2

**Form Fields:**
| Field | Required | Pre-filled | Editable |
|-------|----------|-----------|---------|
| University / School Name | Yes | Yes (from invitation) | Yes |
| Admin Email | Yes | Yes (from invitation) | No |
| Admin First Name | Yes | No | Yes |
| Admin Last Name | Yes | No | Yes |
| Password | Yes | No | Yes |
| Confirm Password | Yes | No | Yes |
| School Logo | No | No | Yes |

---

### Story 2.3 — Onboarding Form (Step 2 of 2): Email & Domain Setup

**As a** school representative
**I want to** tell Pollify whether my students have official school emails
**So that** the system knows how to handle student login and verification

**Acceptance Criteria:**
- Screen asks: **"Do your students have official school email addresses?"** with Yes / No options
- If **YES** (Domain School):
    - School enters their student email domain (e.g. `st.ug.edu.gh`)
    - System validates the domain format
    - Tenant type saved as `DOMAIN`
    - Domain saved to `email_domain_index` table
- If **NO** (Code School):
    - Domain field is skipped entirely
    - Tenant type saved as `CODE`
    - System auto-generates a unique school code (e.g. `GCTU`, `RADFORD`)
    - School code is displayed to the admin and saved
- On completion of both steps:
    - System creates the school's tenant schema in the database
    - Runs all Flyway migrations on the new schema
    - Creates the admin account
    - Sends a welcome email to the school admin confirming their portal is live
    - Redirects admin to their dashboard

**Form Fields (Domain School):**
| Field | Required | Notes |
|-------|----------|-------|
| Student Email Domain | Yes | e.g. `st.ug.edu.gh` |

**Form Fields (Code School):**
| Field | Required | Notes |
|-------|----------|-------|
| *(No additional fields)* | — | School code is auto-generated |

---

## 5. Epic 3 — Admin Dashboard & Voter Verification Setup

### Story 3.1 — Admin Dashboard Home

**As a** school admin
**I want to** see my school's dashboard after logging in
**So that** I can manage my elections and monitor activity

**Acceptance Criteria:**
- Dashboard shows school name and logo
- Dashboard shows summary cards: Total Elections, Active Elections, Total Voters, Total Votes Cast
- If voter verification is not yet set up, a prominent banner is shown:
  > ⚠️ **Voter verification is not set up. Students cannot register until this is complete.** [Set Up Now]
- Banner disappears once verification is configured
- This banner only shows for **Code Schools** — Domain Schools are auto-verified

---

### Story 3.2 — Voter Verification Setup (Code Schools Only)

**As a** school admin of a code school
**I want to** choose how my students will be verified
**So that** only real students from my school can register to vote

**Acceptance Criteria:**
- Admin navigates to Settings → Voter Verification
- System presents two options:

---

#### Option A — Student List Upload

**As a** school admin
**I want to** upload my student list
**So that** only students on the list can register

**Acceptance Criteria:**
- Admin downloads a CSV template with columns: `student_id`, `full_name`
- Admin uploads completed CSV or Excel file
- System validates the file format and required columns
- System saves all student records to the `student_list` table in the school's tenant schema
- Admin can re-upload to replace the existing list
- Admin can see how many students were loaded (e.g. "1,240 students loaded")
- Voter registration flow: School Code + Student ID → validated against list → complete registration

---

#### Option B — Registration Tokens

**As a** school admin
**I want to** generate registration tokens for my students
**So that** only students I give tokens to can register

**Acceptance Criteria:**
- Admin enters the number of tokens to generate (e.g. 500)
- System generates that many unique tokens (format: `PLF-XXXXXXXX`)
- Tokens are saved to the `registration_token` table in the school's tenant schema
- Admin can download all tokens as a CSV to distribute to students
- Each token can only be used once — once used it is marked `USED` with the timestamp
- Admin can see token usage stats: Total Generated, Used, Remaining
- Voter registration flow: School Code + Token → validated and burned → complete registration

---

### Story 3.3 — Manage Elections (Overview)

**As a** school admin
**I want to** see all my school's elections
**So that** I can manage them from one place

**Acceptance Criteria:**
- Admin sees a list of all elections with: Title, Status, Start Date, End Date, Total Votes
- Status values: `DRAFT`, `ACTIVE`, `CLOSED`
- Admin can create a new election
- Admin can click into any election to manage it

---

## 6. Epic 4 — Voter Registration

### Story 4.1 — Voter Registration (Domain School)

**As a** student at a domain school
**I want to** register on Pollify using my school email
**So that** I can vote in my school's elections

**Acceptance Criteria:**
- Student visits Pollify registration page
- Student enters their official school email (e.g. `kwame@st.ug.edu.gh`)
- System extracts the domain (`st.ug.edu.gh`) and looks it up in `email_domain_index`
- If domain found → school identified, proceed to registration
- If domain not found → show: "Your school email domain is not registered on Pollify"
- Student completes registration: First Name, Last Name, Password
- Account created in the school's tenant schema
- Student can now log in and vote

**Form Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| School Email | Yes | Must match a registered domain |
| First Name | Yes | |
| Last Name | Yes | |
| Password | Yes | Min 8 chars, at least one number |
| Confirm Password | Yes | |

---

### Story 4.2 — Voter Registration (Code School — Student List)

**As a** student at a code school using student list verification
**I want to** register using my school code and student ID
**So that** I can vote in my school's elections

**Acceptance Criteria:**
- Student visits Pollify registration page
- Student enters their school code (e.g. `GCTU`)
- System looks up the school code in `pollify_tenant` and identifies the school
- Student enters their student ID
- System checks student ID exists in `student_list` for that tenant
- If found → proceed to complete registration
- If not found → show: "Your student ID was not found. Please contact your school admin."
- Student completes registration: Personal Email, First Name, Last Name, Password
- Account created in the school's tenant schema

**Form Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| School Code | Yes | e.g. `GCTU` |
| Student ID | Yes | Validated against uploaded list |
| Personal Email | Yes | Any valid email (Gmail, Yahoo etc.) |
| First Name | Yes | |
| Last Name | Yes | |
| Password | Yes | |
| Confirm Password | Yes | |

---

### Story 4.3 — Voter Registration (Code School — Token)

**As a** student at a code school using token verification
**I want to** register using my school code and registration token
**So that** I can vote in my school's elections

**Acceptance Criteria:**
- Student visits Pollify registration page
- Student enters their school code (e.g. `RADFORD`)
- Student enters their registration token (e.g. `PLF-A1B2C3D4`)
- System validates: token exists, belongs to this school, and has not been used
- If valid → proceed to complete registration, token marked as `USED`
- If invalid or already used → show: "This token is invalid or has already been used."
- Student completes registration: Personal Email, First Name, Last Name, Password
- Account created in the school's tenant schema

**Form Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| School Code | Yes | e.g. `RADFORD` |
| Registration Token | Yes | Format: `PLF-XXXXXXXX` |
| Personal Email | Yes | Any valid email |
| First Name | Yes | |
| Last Name | Yes | |
| Password | Yes | |
| Confirm Password | Yes | |

---

## 7. Epic 5 — Election Management

### Story 5.1 — Create Election

**As a** school admin
**I want to** create a new election
**So that** my students can vote in it

**Acceptance Criteria:**
- Admin fills in election title, description, start date/time, and end date/time
- Election is saved with status `DRAFT`
- Admin must add at least one candidate before the election can be activated
- Admin can edit a `DRAFT` election
- Admin cannot edit an `ACTIVE` or `CLOSED` election

**Form Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| Election Title | Yes | e.g. "SRC Presidential Election 2026" |
| Description | No | Brief description of the election |
| Start Date & Time | Yes | Must be in the future |
| End Date & Time | Yes | Must be after start time |

---

### Story 5.2 — Add Candidates

**As a** school admin
**I want to** add candidates to an election
**So that** voters can choose who to vote for

**Acceptance Criteria:**
- Admin can add multiple candidates to an election
- Each candidate has a photo, full name, position they are running for, and optional bio
- Photo upload is required (JPG or PNG, max 2MB)
- Admin can remove a candidate from a `DRAFT` election
- Admin cannot remove candidates from an `ACTIVE` election

**Form Fields:**
| Field | Required | Notes |
|-------|----------|-------|
| Candidate Photo | Yes | JPG or PNG, max 2MB |
| Full Name | Yes | |
| Position Running For | Yes | e.g. "SRC President" |
| Bio | No | Short candidate bio |

---

### Story 5.3 — Activate Election

**As a** school admin
**I want to** activate an election
**So that** students can start voting

**Acceptance Criteria:**
- Admin can only activate an election that has at least one candidate
- On activation, election status changes to `ACTIVE`
- Voters can now see and vote in the election
- System automatically closes the election at the set end date/time

---

## 8. Epic 6 — Voting

### Story 6.1 — Voter Login

**As a** registered voter
**I want to** log in to Pollify
**So that** I can access my school's active elections

**Acceptance Criteria:**
- Domain school voters log in with their school email and password
- Code school voters log in with their personal email and password
- System resolves tenant from email domain (domain schools) or from voter record (code schools)
- JWT token issued with `tenantId` and `role: VOTER` embedded
- Voter is redirected to their school's election dashboard

---

### Story 6.2 — View Active Elections

**As a** logged-in voter
**I want to** see my school's active elections
**So that** I know what I can vote in

**Acceptance Criteria:**
- Voter sees only their school's active elections (tenant-scoped)
- Each election card shows: Title, Description, End Date, and number of candidates
- Elections the voter has already voted in are marked as "Voted"
- Closed elections are not shown on the voter dashboard

---

### Story 6.3 — Cast Vote

**As a** logged-in voter
**I want to** cast my vote in an active election
**So that** my choice is recorded

**Acceptance Criteria:**
- Voter clicks into an active election
- Voter sees all candidates with their photo, name, position, and bio
- Voter selects one candidate
- System shows a confirmation prompt: "Are you sure you want to vote for [Candidate Name]?"
- On confirmation, vote is recorded
- Database UNIQUE constraint on `(voter_id, election_id)` prevents any duplicate votes
- After voting, election is marked as "Voted" for that voter
- Voter cannot change their vote after submission
- Vote count on the candidate is incremented immediately

---

## 9. Epic 7 — Live Results

### Story 7.1 — Admin Live Results Dashboard

**As a** school admin
**I want to** see real-time voting results for an active election
**So that** I can monitor the progress of the election

**Acceptance Criteria:**
- Admin clicks into an active election to see the live results view
- Results update in real time via WebSockets without page refresh
- Each candidate is shown with their photo, name, current vote count, and percentage
- Candidates are ranked by vote count — leader shown at the top
- A live total votes counter is shown
- Results are scoped strictly to the admin's tenant — no cross-school data

---

### Story 7.2 — Final Results After Election Closes

**As a** school admin
**I want to** see the final results after an election closes
**So that** I can announce the winner

**Acceptance Criteria:**
- After the election end time passes, status changes to `CLOSED` automatically
- Final results are displayed with the winner highlighted
- Admin can export results as a PDF or CSV report
- Voters can also see the final results of elections they participated in

---

## 10. School Type Matrix

| Feature | Domain School | Code School (List) | Code School (Token) |
|---------|-------------|-------------------|-------------------|
| Tenant Resolution | Email domain auto-detect | School code | School code |
| Student Verification | School email = verified | Student ID vs uploaded list | Unique token |
| Voter Login | School email + password | Personal email + password | Personal email + password |
| Admin Setup Required | Domain entry only | Upload student CSV | Generate tokens |
| Vote Flood Protection | Email domain ownership | Student ID uniqueness in list | Token burned on use |

---

## 11. Database Tables Summary

### Master Schema Tables

| Table | Purpose |
|-------|---------|
| `tenant_invitation` | Invitations sent by super admin to schools |
| `pollify_tenant` | Registered school tenants with type and school code |
| `email_domain_index` | Email domain to tenant mapping (domain schools only) |
| `super_admin` | Pollify platform super admin accounts |
| `refresh_token` | Refresh tokens for all user types |
| `password_reset_tokens` | Password reset tokens |

### Tenant Schema Tables (per school)

| Table | Purpose |
|-------|---------|
| `voter` | Registered student voter accounts |
| `election` | Elections created by the school admin |
| `candidate` | Candidates per election with images |
| `vote` | Votes cast — UNIQUE constraint prevents duplicates |
| `student_list` | Uploaded student records (list-based code schools) |
| `registration_token` | Generated tokens for voter registration (token-based code schools) |

---

## 12. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | What should the invitation email look like? (copy and design) | Product | Open |
| 2 | Should voters be able to see live results while voting is still active? | Product | Open |
| 3 | Should there be a voter-facing results page after voting closes? | Product | Open |
| 4 | What happens if a school wants to switch from token to list verification? | Product | Open |
| 5 | Should the admin be notified when a voter registers? | Product | Open |

---

> **Document Version:** 1.0
> **Last Updated:** 2026-02-16
> **Maintained By:** Pollify Development Team
> **Status:** Approved — Ready for Jira import