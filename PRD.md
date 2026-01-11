# SOWGen - Statement of Work Generation Platform

A comprehensive platform for Xebia to streamline Statement of Work creation, approval workflows, and client engagement for migration and training services.

**Experience Qualities**:
1. **Professional** - The interface should convey enterprise credibility and trustworthiness, suitable for B2B engagements
2. **Efficient** - Streamline complex workflows into intuitive, fast interactions that minimize time-to-completion
3. **Intelligent** - Provide smart automation, contextual guidance, and data-driven insights throughout the SOW lifecycle

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
- This application requires role-based authentication, multi-stage workflows, approval systems, data visualization dashboards, form management, and integration capabilities. It represents a full-featured enterprise application with distinct user journeys for clients and internal staff.

## Essential Features

### 1. Authentication & Role-Based Access
- **Functionality**: Modern dual authentication system with enhanced visual design supporting external clients and internal Xebia staff with role-based permissions (Client, Xebia Admin, Approver)
- **Purpose**: Secure access control ensuring clients only see their data while internal staff access admin features, presented through an engaging, modern interface
- **Trigger**: Landing page with modern hero section featuring platform highlights and role-based login tabs
- **Progression**: View landing page with service highlights → Select role tab (Demo/Client/Xebia) → Enter credentials → Verify → Animate transition to appropriate dashboard
- **Success criteria**: Users land on role-appropriate views; unauthorized access attempts are blocked; role permissions correctly limit feature access; login experience is visually appealing with smooth animations

### 2. Dashboard (Xebia Internal)
- **Functionality**: Analytics dashboard displaying SOW statistics with filterable charts (total SOWs, approved, pending, approval rates, timeline trends)
- **Purpose**: Provide internal staff with real-time insights into SOW pipeline health and organizational performance
- **Trigger**: Successful internal staff login
- **Progression**: Login → Dashboard overview with key metrics → Filter by date/client/project → Drill down into specific SOWs
- **Success criteria**: Charts accurately reflect data; filters work correctly; performance remains smooth with large datasets

### 3. Dashboard (Client)
- **Functionality**: Modern services dashboard showcasing Xebia's platform offerings (GitHub, GitLab, AWS, Azure, GCP, Kubernetes, Docker, Terraform) with real-time activity logs, health monitoring, and quick actions. Features prominent SOW generation options: Manual Entry and Automation modes.
- **Purpose**: Provide clients with unified visibility into their cloud and DevOps services, activity monitoring, service health status, and streamlined SOW creation workflows
- **Trigger**: Successful client login
- **Progression**: Login → View services overview with SOW creation cards (Manual/Automation) → Select creation method → View platform services with activity logs → Filter activities by platform/status → Access quick actions → Navigate to detailed service views
- **Success criteria**: SOW creation options are prominent and clearly differentiated; all platform services display with accurate health status; activity logs update in real-time; filters work correctly; quick actions are contextual to each platform; responsive on all devices

### 3b. SOW Generation Mode Selection
- **Functionality**: Two prominent card options for SOW creation: Manual Entry (guided form input) and Automation (SCM data fetching via REST API)
- **Purpose**: Give clients flexibility to choose between manual data entry for new projects or automated data fetching from existing repositories
- **Trigger**: View client dashboard or services page
- **Progression**: View dashboard → See Manual and Automation cards with descriptions → Click Manual for traditional form → OR click Automation to connect SCM → Proceed to appropriate workflow
- **Success criteria**: Both options are visually distinct and clearly explained; cards are prominent on dashboard; clicking navigates to appropriate form; user understands difference between modes

### 3a. Services Activity Monitoring
- **Functionality**: Comprehensive activity log viewer with search, filtering by platform and status, displaying deployments, commits, builds, security scans, and infrastructure changes
- **Purpose**: Give clients full visibility into all activities across their managed services with ability to identify issues and trends
- **Trigger**: Navigate to Activity Logs tab in services dashboard
- **Progression**: View activity feed → Search by keyword → Filter by platform (GitHub/AWS/etc.) → Filter by status (success/failed/pending/warning) → View activity details → Access related quick actions
- **Success criteria**: Activity logs are sortable and filterable; search works across titles and descriptions; status indicators are clear; platform branding is consistent; timestamps are accurate

### 4. SOW Generation (Manual Entry)
- **Functionality**: Multi-step form for creating SOWs with project details, organization info, migration scenarios, and training requirements
- **Purpose**: Enable comprehensive SOW creation with all necessary details for approval through traditional form input
- **Trigger**: Client clicks "Create Manually" card on dashboard
- **Progression**: Start SOW → Select scenario (Migration/Training/Both) → Fill project details → Add migration stages → Select training modules → Review → Save draft or Submit
- **Success criteria**: Form validates all required fields; can save drafts; successful submission triggers approval workflow; data persists correctly

### 4b. SOW Generation (Automation Mode)
- **Functionality**: SCM-integrated SOW creation with real REST API data fetching from GitHub and GitLab, followed by review and additional details form
- **Purpose**: Accelerate SOW creation by automatically fetching comprehensive repository metadata including branches, commits, contributors, languages, CI/CD detection, topics, issues, PRs, stars, forks, and complexity analysis from existing SCM platforms
- **Trigger**: Client clicks "Use Automation" card on dashboard
- **Progression**: Select SCM platform (GitHub/GitLab) → Enter repository URL and optional access token → Fetch data via real API → Review comprehensive auto-populated project details (repository name, full path, description, visibility, default branch, branches count, commits count, contributors, languages, CI/CD status, topics, open issues/PRs, stars, forks, license, complexity estimate) → Modify/enhance details → Add migration stages → Select training modules → Submit
- **Success criteria**: Successfully fetches real data from GitHub REST API v3 and GitLab API v4; handles public and private repositories with token authentication; pre-fills project name with rich generated description; displays comprehensive repository metrics with proper badges and formatting; allows user to review and modify fetched data; gracefully handles API failures (404, 401, network errors) with clear, actionable error messages; detects GitHub Actions workflows and GitLab CI pipelines; calculates complexity score based on multiple factors; proceeding to other tabs shows pre-filled data; provides token generation guidance for each platform

### 5. Migration Scenario Builder
- **Functionality**: Structured input for migration stages (Initial Setup, Repository Migration, CI/CD Migration, CI/CD Implementation, Training Sessions)
- **Purpose**: Capture detailed migration requirements in a standardized format
- **Trigger**: Within SOW creation, select "Migration Services"
- **Progression**: Select migration type → Configure stages → Specify technical details per stage → Add timeline estimates → Include in SOW
- **Success criteria**: All migration stages can be configured; technical details are captured; estimates are calculated

### 6. Training Module Selector
- **Functionality**: Interactive catalog of training modules across tracks (GitHub, Azure, GCP, AWS, AI/SAP) and levels (Beginner, Intermediate, Advanced)
- **Purpose**: Allow clients to select appropriate training for their team's needs
- **Trigger**: Within SOW creation, select "Training Services" or access from service catalog
- **Progression**: View training catalog → Filter by track/level → View module details → Select modules → Add to SOW with participant count
- **Success criteria**: All training options are visible; descriptions are clear; selections are saved correctly; pricing is calculated

### 7. Approval Workflow System
- **Functionality**: Multi-level approval process with email notifications, commenting, and status tracking
- **Purpose**: Ensure SOWs are reviewed and approved by appropriate stakeholders before client commitment
- **Trigger**: Client submits SOW or Admin submits on behalf of client
- **Progression**: Submit SOW → Assigned to approver(s) → Approver reviews → Provide feedback or approve → Notify next approver or client → Final approval
- **Success criteria**: Approval chain executes correctly; notifications are sent; comments are captured; status updates in real-time; can handle parallel and sequential approvals

### 8. Admin Panel
- **Functionality**: Management interface for users, approvers, SOW templates, approval rules, and service catalog
- **Purpose**: Give administrators control over system configuration and workflow management
- **Trigger**: Admin user navigates to admin section
- **Progression**: Access admin → Manage users/roles → Configure approval workflows → Update service catalog → Modify templates
- **Success criteria**: All admin functions work correctly; changes reflect immediately; permissions are enforced

### 9. PDF Export for Client Distribution
- **Functionality**: Export SOW details as professionally formatted PDF documents suitable for client distribution
- **Purpose**: Enable clients and staff to generate printable/shareable documents for offline review, archival, and formal distribution
- **Trigger**: Click "Export PDF" button on SOW detail page, dashboard SOW list, or Xebia SOW table
- **Progression**: Click export → System generates formatted PDF in new window → Browser print dialog opens → Save as PDF or print
- **Success criteria**: PDF includes all SOW details (project info, migration stages, training modules, approval history); formatting is professional and print-ready; all data renders correctly; export works for all SOW statuses

## Edge Case Handling

- **Incomplete Forms**: Auto-save drafts every 30 seconds; show validation errors inline; prevent submission until required fields complete
- **Network Interruptions**: Persist form data locally; show offline indicator; sync when connection restored
- **Simultaneous Edits**: Warn users when SOW is being edited by another user; implement optimistic locking
- **Invalid Approver Assignment**: Validate approver availability; suggest alternatives if primary unavailable
- **Large File Attachments**: Implement chunked uploads; show progress; validate file types and sizes
- **Session Timeout**: Warn before timeout; preserve unsaved work; graceful re-authentication
- **Missing Training Data**: Show placeholder content; allow admin to quickly add missing modules
- **Approval Deadlines**: Send escalation notifications; highlight overdue approvals in dashboard
- **PDF Export Failures**: Catch popup blocker issues with user-friendly error message; provide fallback instructions for enabling popups
- **Empty SOW Sections**: Handle SOWs with no migration or training modules gracefully in PDF; show appropriate "not included" messaging
- **SCM API Failures**: Display clear error messages for connection failures, invalid URLs, or authentication issues; allow retry with different credentials; gracefully fall back to manual entry; provide specific guidance for 404 (repository not found), 401 (invalid token), and network errors
- **Private Repository Access**: Guide users on generating access tokens with platform-specific instructions (GitHub: Settings → Developer settings → Personal access tokens, GitLab: User Settings → Access Tokens); validate token permissions; handle expired or invalid tokens with helpful re-authentication instructions
- **Incomplete SCM Data**: Handle repositories with missing metadata gracefully; allow users to supplement auto-filled data; warn when critical data is unavailable; provide defaults for optional fields; handle API rate limiting with clear messaging

## Design Direction

The design should evoke **enterprise-grade professionalism with modern sophistication**. Think sleek SaaS platforms that balance data density with breathing room. The interface should feel powerful yet approachable—capable of handling complex workflows while remaining intuitive. Visual elements should communicate clarity, structure, and forward momentum through the approval pipeline.

## Color Selection

A professional yet distinctive palette combining deep navy authority with energetic accent colors for a modern enterprise feel.

- **Primary Color**: Deep Navy `oklch(0.25 0.08 250)` - Conveys trustworthiness, professionalism, and stability essential for B2B enterprise software
- **Secondary Colors**: 
  - Cool Slate `oklch(0.45 0.02 240)` - Supporting backgrounds and secondary UI elements
  - Light Cloud `oklch(0.96 0.005 240)` - Card backgrounds and subtle surfaces
- **Accent Color**: Vibrant Cyan `oklch(0.65 0.15 210)` - Energetic highlight for CTAs, progress indicators, and active states; suggests innovation and forward progress
- **Success/Status Colors**:
  - Success Green `oklch(0.65 0.15 145)` - Approved items
  - Warning Amber `oklch(0.75 0.13 75)` - Pending reviews
  - Alert Red `oklch(0.60 0.20 25)` - Rejections or required actions

**Foreground/Background Pairings**:
- Background (White `oklch(1 0 0)`): Deep Navy text `oklch(0.25 0.08 250)` - Ratio 8.5:1 ✓
- Primary (Deep Navy `oklch(0.25 0.08 250)`): White text `oklch(1 0 0)` - Ratio 8.5:1 ✓
- Accent (Vibrant Cyan `oklch(0.65 0.15 210)`): Deep Navy text `oklch(0.25 0.08 250)` - Ratio 4.8:1 ✓
- Secondary (Cool Slate `oklch(0.45 0.02 240)`): White text `oklch(1 0 0)` - Ratio 5.2:1 ✓

## Font Selection

**Combine technical precision with modern readability** using a contemporary sans-serif system that balances professionalism with approachability.

- **Primary**: Space Grotesk (700) - Headlines and section titles for strong, modern presence with technical undertones
- **Secondary**: Inter (400, 500, 600) - Body text, forms, and UI elements for excellent readability and versatile weights
- **Accent**: JetBrains Mono (500) - Code snippets, technical identifiers, and data display for technical authenticity

**Typographic Hierarchy**:
- H1 (Page Title): Space Grotesk Bold/32px/tight letter-spacing/-0.02em
- H2 (Section Header): Space Grotesk Bold/24px/tight letter-spacing/-0.01em  
- H3 (Card Header): Inter Semibold/18px/normal
- Body (Primary): Inter Regular/16px/line-height 1.6
- Body (Secondary): Inter Regular/14px/line-height 1.5/muted color
- Label: Inter Medium/14px/uppercase tracking-wide
- Caption: Inter Regular/12px/muted color
- Code/Data: JetBrains Mono Medium/14px/monospace

## Animations

**Animations should reinforce workflow progression and provide confident feedback**. Use subtle transitions for state changes (200ms ease), smooth page transitions with gentle slides (300ms), progress indicators with purposeful motion, and micro-interactions on buttons/cards with quick snaps (150ms). Approval state changes should feel decisive with satisfying confirmation animations. Avoid animations that delay critical workflows—speed and clarity take precedence.

## Component Selection

**Components**:
- **Navigation**: Sidebar component for main navigation with collapsible sections
- **Dashboard**: Card components for metric displays; Recharts for visualizations (bar, line, pie charts)
- **Forms**: Multi-step wizard using Tabs component; Input, Textarea, Select, Checkbox components; Form with react-hook-form integration
- **Tables**: Table component with sorting for SOW lists; Badge components for status indicators
- **Dialogs**: Dialog for confirmations; Sheet for slide-out details panels
- **Approvals**: Timeline-style layout using custom components; Textarea for comments; Button variants for approve/reject actions
- **User Management**: Table with inline editing; Dialog for user creation; Select for role assignment
- **Status Indicators**: Badge with color variants (success/warning/destructive); Progress component for workflow stages
- **Notifications**: Sonner toasts for success/error feedback

**Customizations**:
- **SOW Timeline Component**: Custom vertical timeline showing approval stages with connecting lines and status icons
- **Training Module Card**: Custom card with track badges, level indicators, and quick-add functionality
- **Migration Stage Builder**: Custom accordion-style component with stage configuration forms
- **Dashboard Metric Card**: Enhanced Card with animated number counters and trend indicators
- **Role Switcher**: Custom dropdown component in header for demo role switching

**States**:
- Buttons: Clear hover with background shift, active with slight scale-down (0.98), disabled with 50% opacity
- Inputs: Border color change on focus with accent color, error state with destructive color, success with checkmark icon
- Cards: Subtle hover lift (2px translateY) with shadow increase, clickable cards with cursor pointer
- Status badges: Distinct colors per state with subtle pulse animation for pending items

**Icon Selection**:
- Navigation: House (dashboard), FileText (SOWs), GraduationCap (trainings), GitBranch (migrations), Users (admin)
- Actions: Plus (create), Check (approve), X (reject), Eye (view), PencilSimple (edit), Trash (delete), FilePdf (export PDF)
- Status: Clock (pending), CheckCircle (approved), XCircle (rejected), Warning (needs attention)
- Filters: FunnelSimple (filter), MagnifyingGlass (search), CalendarBlank (date), SortAscending (sort)

**Spacing**:
- Page padding: p-6 (24px) on desktop, p-4 (16px) on mobile
- Section gaps: gap-8 (32px) for major sections, gap-4 (16px) for related content
- Card padding: p-6 for standard cards, p-4 for compact cards
- Form spacing: gap-6 between form sections, gap-4 between fields
- Button padding: px-6 py-2.5 for primary actions, px-4 py-2 for secondary

**Mobile**:
- Sidebar: Collapses to bottom navigation bar on mobile (<768px)
- Tables: Convert to stacked card layout on mobile
- Multi-column dashboards: Stack to single column
- Form fields: Full width on mobile with increased touch targets (min 44px)
- Charts: Adjust aspect ratio and simplify for readability on small screens
- Sheet component: Full-screen on mobile instead of slide-out
