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
- **Functionality**: Dual authentication system with enhanced visual design supporting external clients and internal Xebia staff with role-based permissions (Client, Xebia Admin, Approver). Includes user profile management with avatar upload capabilities.
- **Purpose**: Secure access control ensuring clients only see their data while internal staff access admin features, presented through an engaging, modern interface with the official Xebia logo and branding. User profiles allow personalization and easy identification across the platform.
- **Trigger**: Landing page with modern hero section featuring platform highlights and role-based login tabs (Client and Xebia only)
- **Progression**: View landing page with service highlights → Select role tab (Client/Xebia) → Enter credentials → Verify → Animate transition to appropriate dashboard → Access profile via avatar dropdown in header → Edit profile and upload avatar
- **Success criteria**: Users land on role-appropriate views; unauthorized access attempts are blocked; role permissions correctly limit feature access; login experience is visually appealing with smooth animations; Xebia logo is prominently displayed; user avatars display throughout the platform; profile edits save correctly; avatar uploads work with validation (image types, 5MB limit)

### 1b. User Profile Management
- **Functionality**: Comprehensive user profile management accessible via avatar dropdown menu in header. Users can view and edit their profile information including name, email, organization, and upload/change their avatar image. Profile information persists across sessions and displays throughout the platform (header, approval history, SOW lists).
- **Purpose**: Enable users to personalize their account, maintain accurate contact information, and provide visual identification through avatars, improving user experience and making collaboration more personal
- **Trigger**: Click on avatar/user menu in application header → Select "Profile Settings"
- **Progression**: Click avatar in header → View dropdown with user info and options → Select "Profile Settings" → View profile dialog with current information and avatar → Click "Edit Profile" → Update name, email, organization → Upload new avatar (optional) → Preview changes → Save or cancel → Profile updates across all platform views (header, approval history, SOW cards)
- **Success criteria**: Profile dialog opens smoothly; all user information displays correctly; avatar upload supports common image formats (JPG, PNG, GIF, WebP); image validation prevents files over 5MB; avatar preview shows immediately after selection; "Remove Avatar" option available; profile changes save to persistence layer; updated information displays in header, approval history, and SOW list immediately; avatar displays with fallback initials if no image uploaded; edits can be cancelled without saving

### 2. Dashboard (Xebia Internal)
- **Functionality**: Analytics dashboard displaying SOW statistics with filterable charts (total SOWs, approved, pending, approval rates, timeline trends)
- **Purpose**: Provide internal staff with real-time insights into SOW pipeline health and organizational performance
- **Trigger**: Successful internal staff login
- **Progression**: Login → Dashboard overview with key metrics → Filter by date/client/project → Drill down into specific SOWs
- **Success criteria**: Charts accurately reflect data; filters work correctly; performance remains smooth with large datasets

### 3. Dashboard (Client)
- **Functionality**: Modern services dashboard showcasing Xebia's platform offerings (GitHub, GitLab, Bitbucket, AWS, Azure, GCP, Kubernetes, Docker, Terraform) with real-time activity logs, health monitoring, and quick actions. Features prominent SOW generation options: Manual Entry and Automation modes.
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
- **Functionality**: SCM-integrated SOW creation with real REST API data fetching from GitHub, GitLab, Bitbucket, and Azure DevOps. When users select an SCM platform (GitHub/GitLab/Bitbucket/Azure DevOps), they see two SOW generation options (Manual Entry or Automated Import). Upon selection, the form opens with comprehensive migration configuration including GitHub migration type selection (Classic/EMU/GHES), repository inventory details, man-hour calculation, CI/CD migration options, and integrated training module selection all within a unified workflow.
- **Purpose**: Accelerate SOW creation by automatically fetching comprehensive repository metadata and providing all migration services (repository migration, CI/CD migration, and training) in a single streamlined form interface rather than separate modules
- **Trigger**: Client clicks SCM platform card (GitHub/GitLab/Bitbucket/Azure) on dashboard → Selects "Use Automation" option
- **Progression**: Select SCM platform → Choose Automation mode → Enter repository URL and optional access token → Fetch comprehensive data via real API → Review auto-populated project details with full metrics → Configure GitHub Migration Type (Classic/EMU/GHES) → Enter repository inventory (total repos, public/private/archived counts, size, languages, LFS/submodule flags) → System auto-calculates estimated man hours based on migration type and inventory → Optional: Enable CI/CD migration and select platform → Optional: Enable training services and select modules with participant counts → Review complete SOW → Submit
- **Success criteria**: Successfully fetches real data from GitHub REST API v3, GitLab API v4, Bitbucket API v2.0, and Azure DevOps REST API v7.0; calculates accurate man-hour estimates based on migration type (Classic: 2hrs/repo base, EMU: 3hrs/repo, GHES: 4hrs/repo) with adjustments for LFS, submodules, size, and language count; all services (migration types, CI/CD, training) accessible in single form with clear tab navigation; handles API failures gracefully; pre-fills all project details; migration type selection updates man-hour calculations in real-time; CI/CD section appears when enabled with platform selection; training modules organized by track (GitHub/GitLab/Bitbucket/Azure DevOps/Azure/GCP/AWS/AI-SAP) and level (Beginner/Intermediate/Advanced)

### 5. Migration & Training Services Configuration
- **Functionality**: Comprehensive service configuration within the SOW form including GitHub migration type selection, repository inventory management, CI/CD migration options, and training module selection—all integrated into a single "Migration & Training" tab rather than separate modules
- **Purpose**: Provide a unified interface for configuring all migration-related services (repository migration, CI/CD migration) and training requirements, with intelligent man-hour estimation based on migration complexity
- **Trigger**: Within SOW creation (Manual or Automation mode), navigate to "Migration & Training" tab after enabling these services in Project Details
- **Progression**: Enable "Migration Services" checkbox in Project Details → Navigate to Migration & Training tab → Select GitHub Migration Type (Classic/EMU/GHES) → Enter repository inventory details (total repos, public/private/archived, size, languages, LFS, submodules) → View auto-calculated man-hour estimates → Optional: Enable CI/CD Migration and specify platform → Optional: Enable "Training Services" checkbox → Select training modules from available tracks and levels → Set participant counts → Review complete configuration → Proceed to submit
- **Success criteria**: Migration type selection updates man-hour calculations; repository inventory inputs validated; calculations accurate for all migration types; CI/CD platform options displayed when enabled; training modules organized by track and level; participant counts adjustable; all configurations saved correctly in SOW; clear visual separation between migration and training sections while maintaining unified workflow

### 6. Training Module Catalog
- **Functionality**: Within the Migration & Training tab, training modules are displayed organized by technology track (GitHub, GitLab, Bitbucket, Azure DevOps, Azure, GCP, AWS, AI/SAP) and expertise level (Beginner, Intermediate, Advanced). When migration services are enabled with a specific SCM platform selected (GitHub, GitLab, Bitbucket, or Azure DevOps), training modules are intelligently filtered to show only relevant modules for that platform. For example, GitHub migrations display only GitHub training modules, GitLab migrations display only GitLab training modules, Bitbucket migrations display only Bitbucket training modules, and Azure DevOps migrations display only Azure DevOps training modules.
- **Purpose**: Enable clients to select appropriate training for their team's needs as part of the comprehensive SOW, with clear module descriptions, durations, and participant count configuration. Smart filtering ensures training aligns with the migration platform, creating a cohesive migration and training strategy.
- **Trigger**: Enable "Training Services" checkbox in Project Details tab, then navigate to Migration & Training tab
- **Progression**: View training modules organized by track → System automatically filters modules based on migration SCM platform (if applicable) → See informational badge and alert explaining the filtering → Expand track sections to see available levels → Review module details (title, level, duration) → Click "Add" to include in SOW → Set participant count for each module → Remove modules if needed
- **Success criteria**: All training options visible and organized by track/level when no migration selected; modules intelligently filtered to GitHub-only when GitHub migration selected; modules filtered to GitLab-only when GitLab migration selected; modules filtered to Bitbucket-only when Bitbucket migration selected; modules filtered to Azure DevOps-only when Azure DevOps migration selected; clear UI indication (badge and alert) explaining the filtering logic; module details display correctly; "Add" button adds to selected list; participant counts adjustable; selected modules show in summary; pricing calculated based on modules and participants; selections persist correctly in SOW

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

### 10. CSV Export for SOW History Download
- **Functionality**: Export comprehensive SOW data to CSV format for analysis, reporting, and record-keeping. Available for individual SOWs or bulk export of multiple SOWs.
- **Purpose**: Enable clients and Xebia admins to download SOW history data in a structured format for integration with other systems, data analysis, reporting dashboards, and long-term archival
- **Trigger**: Click "Export CSV" or "Export All to CSV" button on SOW detail page, Client Dashboard, Xebia Dashboard, or SOW List view
- **Progression**: Click export → System generates CSV file with comprehensive SOW data → Browser initiates download → File saves to user's downloads folder
- **Success criteria**: CSV includes comprehensive SOW data (ID, project details, client info, status, dates, migration details, repository inventory, man-hours, CI/CD info, training modules, participants, approval comments); data is properly formatted with quoted fields; file naming is descriptive with timestamps; export works for single or multiple SOWs; clients can only export their own SOWs while admins can export all SOWs; filtered data exports respect current filters in SOW list view

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
- **Private Repository Access**: Guide users on generating access tokens with platform-specific instructions (GitHub: Settings → Developer settings → Personal access tokens, GitLab: User Settings → Access Tokens, Bitbucket: Settings → Personal Access Tokens, Azure DevOps: User Settings → Personal Access Tokens); validate token permissions; handle expired or invalid tokens with helpful re-authentication instructions
- **Incomplete SCM Data**: Handle repositories with missing metadata gracefully; allow users to supplement auto-filled data; warn when critical data is unavailable; provide defaults for optional fields; handle API rate limiting with clear messaging

## Design Direction

The design should evoke **enterprise-grade professionalism with modern sophistication aligned with Xebia's brand identity**. Think sleek SaaS platforms that balance data density with breathing room. The interface should feel powerful yet approachable—capable of handling complex workflows while remaining intuitive. Visual elements should communicate clarity, structure, and forward momentum through the approval pipeline, with Xebia's signature purple/violet branding throughout.

## Color Selection

A professional yet distinctive palette aligned with Xebia's official brand identity, featuring vibrant purple tones with enhanced saturation for a modern, premium enterprise feel that feels fresh and energetic.

- **Primary Color**: Xebia Brand Purple `oklch(0.42 0.20 295)` - Bold and vibrant official Xebia brand color, conveying innovation, creativity, and technical excellence
- **Secondary Colors**: 
  - Rich Violet `oklch(0.55 0.15 295)` - Supporting UI elements and secondary actions
  - Light Lavender `oklch(0.96 0.008 280)` - Card backgrounds and subtle surfaces with reduced saturation for elegance
- **Accent Color**: Vibrant Purple `oklch(0.58 0.22 295)` - High-energy highlight for CTAs, progress indicators, and active states; emphasizes brand dynamism
- **Success/Status Colors**:
  - Success Green `oklch(0.62 0.17 145)` - Approved items
  - Warning Gold `oklch(0.72 0.15 70)` - Pending reviews
  - Alert Red `oklch(0.58 0.22 25)` - Rejections or required actions

**Foreground/Background Pairings**:
- Background (Light `oklch(0.99 0.005 280)`): Deep Purple text `oklch(0.18 0.02 280)` - Ratio 12.1:1 ✓
- Primary (Xebia Purple `oklch(0.42 0.20 295)`): White text `oklch(1 0 0)` - Ratio 6.2:1 ✓
- Accent (Vibrant Purple `oklch(0.58 0.22 295)`): White text `oklch(1 0 0)` - Ratio 4.8:1 ✓
- Secondary (Rich Violet `oklch(0.55 0.15 295)`): White text `oklch(1 0 0)` - Ratio 5.1:1 ✓

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

**Xebia Brand Animations**:
- Float animation (3s ease-in-out infinite) for gradient backgrounds on login page
- Gradient shift animation (8s ease infinite) for animated backgrounds with 200% background size
- Hover scale effects on cards (1.02 scale on hover) with smooth transitions (300ms duration)
- Pattern opacity transitions on hover (0 to 0.1 opacity) for subtle background pattern reveals

## Xebia Branding Elements

**Xebia Logo**:
- Official Xebia logo as an SVG component with distinctive X mark design
- Two variations: `XebiaLogo` (full rounded square with gradient) and `XebiaLogoMark` (mark only)
- Used consistently across all pages: login, header, footer
- Gradient colors: from `oklch(0.50 0.22 295)` to `oklch(0.38 0.18 295)`
- White X mark formed by two intersecting chevron paths
- Available in multiple sizes with responsive scaling

**Visual Patterns**:
- **Diagonal Cross-Hatch Pattern**: Repeating 45° and -45° linear gradients with primary/accent colors at low opacity (2-3%) for sophisticated backgrounds
- **Dot Grid Pattern**: Radial gradient circles creating subtle dotted texture, 20px spacing, 8% opacity in primary brand color
- **Grid Pattern**: Linear gradient lines creating subtle grid overlay, 30px spacing, 6% opacity for technical aesthetic
- **Wave Pattern**: Repeating radial gradients creating organic wave texture for login and hero sections

**Brand Taglines & Messaging**:
- Primary tagline: "Empowering Digital Excellence"
- Login hero: "Building Tomorrow, Today"
- Dashboard welcome: "Transforming ideas into actionable solutions"
- Client dashboard: "Accelerate your project delivery with intelligent automation"
- Xebia dashboard: "Driving excellence through data-driven insights"
- SCM platforms: "Powered by Xebia's intelligent automation"
- SOW Form: "Powered by Xebia's intelligent project analysis"
- Footer: "Empowering digital transformation through intelligent automation and cloud excellence"

**Brand Values (displayed in footer)**:
- Innovation at Scale
- Client-Centric Excellence
- Continuous Learning

**Platform Features (displayed in footer)**:
- Multi-Cloud Integration
- DevOps Automation
- Intelligent Insights

**Pattern Usage**:
- Login page background: Grid pattern with floating gradient orbs
- Main app background: Dot pattern at 20% opacity
- Header: Pattern-free for clean navigation
- Dashboard welcome banners: Diagonal cross-hatch pattern at 50% opacity with gradient backgrounds
- Form headers: Cross-hatch pattern with gradient from primary to accent
- SOW detail headers: Cross-hatch pattern with branded gradient
- Card hovers: Dot pattern fade-in effect
- Chart cards: Different patterns per card (cross-hatch, dots, grid) at 5% opacity

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
