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
- **Functionality**: Modern services dashboard showcasing Xebia's platform offerings including SCM platforms (GitHub, GitLab, Bitbucket, Azure DevOps, Team Foundation Server (TFS), SVN) and cloud services (AWS, GCP, Azure, Terraform). Features prominent SOW generation options: Manual Entry and Automation modes. When selecting a platform for SOW generation, displays an interactive animated migration path diagram illustrating the complete migration journey from source platform to target.
- **Purpose**: Provide clients with unified visibility into available platforms and streamlined SOW creation workflows. Visual migration diagram builds confidence by showing the clear, structured path for their project.
- **Trigger**: Successful client login
- **Progression**: Login → View platform services → Select platform for SOW generation → View animated migration path diagram showing source to target flow → Choose creation method (Manual/Automation) → Navigate to form
- **Success criteria**: SOW creation options are prominent and clearly differentiated; all platform services display with accurate health status; responsive on all devices; migration path diagram displays when platform selected showing smooth animations of source platform icon, curved animated path, target icon, and migration stages with numbered steps

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
- **Functionality**: Streamlined single-page form for creating SOWs with project details, organization info, and on-demand migration/training configuration. Form intelligently expands to show migration and training options within the same page when user enables those services via checkboxes.
- **Purpose**: Enable comprehensive SOW creation with all necessary details for approval in a unified, progressive interface that only shows relevant sections as needed
- **Trigger**: Client clicks "Create Manually" card on dashboard
- **Progression**: Start SOW → Fill basic project details → Check "Include Migration Services" to reveal migration configuration inline → Check "Include Training Services" to reveal training modules inline → Review complete SOW in single scrollable page → Save draft or Submit
- **Success criteria**: Form validates all required fields; migration and training sections appear/hide smoothly when checkboxes toggled; can save drafts; successful submission triggers approval workflow; data persists correctly; all options accessible without tab navigation

### 4b. SOW Generation (Automation Mode)
- **Functionality**: SCM-integrated SOW creation with real REST API data fetching from GitHub, GitLab, Bitbucket, and Azure DevOps. SVN is available as a platform option but uses manual entry workflow due to lack of REST API. When users select an SCM platform (GitHub/GitLab/Bitbucket/Azure DevOps), they see two SOW generation options (Manual Entry or Automated Import). Upon selection, the form opens with two-tab structure: SCM Integration tab (for fetching data) and Project Configuration tab containing all project details, migration configuration, and training selection in a single unified scrollable interface.
- **Purpose**: Accelerate SOW creation by automatically fetching comprehensive repository metadata and providing all configuration options (basic details, migration services, CI/CD migration, training) in a streamlined single-page interface after data import
- **Trigger**: Client clicks SCM platform card (GitHub/GitLab/Bitbucket/Azure/SVN) on dashboard → Selects "Use Automation" option (or Manual for SVN)
- **Progression**: Select SCM platform → Choose Automation mode (if available) → Tab 1: Enter repository URL and optional access token → Fetch comprehensive data via real API → Switch to Tab 2: Review auto-populated project details → Enable migration services checkbox → Migration configuration appears inline including GitHub Type (Classic/EMU/GHES), repository inventory (total repos, public/private/archived counts, size, languages, LFS/submodules) → View auto-calculated man-hour estimates → Optional: Enable CI/CD migration and select platform (inline) → Optional: Enable training services checkbox → Training modules appear inline → Set participant counts → Review complete SOW in single page → Submit
- **Success criteria**: Successfully fetches real data from GitHub REST API v3, GitLab API v4, Bitbucket API v2.0, and Azure DevOps REST API v7.0; calculates accurate man-hour estimates based on migration type (Classic: 2hrs/repo base, EMU: 3hrs/repo, GHES: 4hrs/repo) with adjustments for LFS, submodules, size, and language count; all services accessible in single scrollable page without tab switching after initial data fetch; handles API failures gracefully; pre-fills all project details; migration sections expand/collapse based on checkbox state; CI/CD section appears when enabled with platform selection; training modules organized by track and level; SVN uses manual entry workflow with same form structure

### 5. Migration & Training Services Configuration (Unified Interface)
- **Functionality**: Comprehensive service configuration integrated directly into the main Project Configuration page rather than separate tabs. When user checks "Include Migration Services", the page dynamically expands to show GitHub migration type selection, repository inventory management, CI/CD migration options, and an interactive animated migration path diagram showing the 7-stage end-to-end journey (Discovery & Analysis, Initial Setup/SAML SSO, Repo Migration, CI/CD Migration, CI/CD Implementation, Team Training, Support & Documentation) from source platform to GitHub. When user checks "Include Training Services", training module selection appears inline on the same page.
- **Purpose**: Provide a unified single-page interface for configuring all project requirements (basic info, migration services, training) without requiring users to navigate between tabs. Migration path diagram with 7 compact deliverable cards helps clients understand the complete migration journey at a glance.
- **Trigger**: Within SOW creation (Manual or Automation mode), check "Include Migration Services" or "Include Training Services" in Project Configuration page
- **Progression**: Fill basic project details → Check "Include Migration Services" → Page expands to show migration configuration inline → View animated migration path diagram showing source platform to GitHub flow with 7 compact deliverable stages in single line (Discovery & Analysis, Initial Setup/SAML SSO, Repo Migration, CI/CD Migration, CI/CD Implementation, Team Training, Support & Documentation) → Select GitHub Migration Type (Classic/EMU/GHES) → Enter repository inventory details → View auto-calculated man-hour estimates → Optional: Enable CI/CD Migration checkbox and specify platform → Check "Include Training Services" → Training modules appear inline below migration section → Select training modules and set participant counts → Review complete configuration in single page → Proceed to submit
- **Success criteria**: Migration configuration appears inline when checkbox enabled; training configuration appears inline when checkbox enabled; migration type selection updates man-hour calculations; repository inventory inputs validated; calculations accurate for all migration types; CI/CD platform options displayed when enabled; training modules organized by track and level; participant counts adjustable; all configurations saved correctly in SOW; smooth animations when sections expand/collapse; migration path diagram displays with 7 compact deliverable cards in responsive grid (2 cols mobile, 4 cols tablet, 7 cols desktop) showing numbered stages with icons, titles, and brief descriptions; cards are smaller and more compact to fit inline; arrow indicators between cards on desktop; diagram adapts to show correct source platform based on user selection

### 6. Project Deliverables Visual (Compact Migration Stages)
- **Functionality**: Interactive visual diagram showing the 7-stage migration journey as compact cards with numbered steps, icons, titles, and descriptions. Cards are designed to be smaller and fit in a single line on desktop (7 columns), adapting responsively to 4 columns on tablet and 2 columns on mobile. Each card features a numbered badge, gradient background on hover, and arrow connectors between stages on desktop view.
- **Purpose**: Provide clients with a clear, compact visual representation of all migration deliverables in an easy-to-scan format that doesn't require excessive scrolling. The 7 stages (Discovery & Analysis, Initial Setup/SAML SSO, Repo Migration, CI/CD Migration, CI/CD Implementation, Team Training, Support & Documentation) give comprehensive coverage of the migration process while maintaining visual clarity.
- **Trigger**: Automatically displays within migration configuration section when "Include Migration Services" is checked
- **Progression**: View compact deliverable cards → Hover over cards to see highlight effect → See numbered badges (1-7) → Read stage titles and descriptions → Observe arrow connectors on desktop → Cards adapt to screen size
- **Success criteria**: 7 deliverable cards display in responsive grid; cards are visually compact with reduced padding and smaller text; all cards fit in single line on desktop (xl breakpoint); numbered badges visible on all cards; hover effects work smoothly; arrow connectors show between cards on desktop; titles and descriptions are concise and readable; cards maintain visual consistency with platform branding

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

A professional yet distinctive palette aligned with Xebia's official brand identity, featuring rich purple tones that convey innovation and technical excellence with a modern, premium enterprise feel.

- **Primary Color**: Deep Xebia Purple `oklch(0.35 0.18 295)` - Bold and refined official Xebia brand color, conveying innovation, creativity, and technical excellence
- **Secondary Colors**: 
  - Medium Violet `oklch(0.50 0.14 295)` - Supporting UI elements and secondary actions
  - Light Lavender `oklch(0.96 0.008 295)` - Card backgrounds and subtle surfaces with reduced saturation for elegance
- **Accent Color**: Vibrant Purple `oklch(0.52 0.20 295)` - High-energy highlight for CTAs, progress indicators, and active states; emphasizes brand dynamism
- **Success/Status Colors**:
  - Success Green `oklch(0.62 0.17 145)` - Approved items
  - Warning Gold `oklch(0.72 0.15 70)` - Pending reviews
  - Alert Red `oklch(0.58 0.22 25)` - Rejections or required actions

**Foreground/Background Pairings**:
- Background (Light `oklch(0.99 0.005 295)`): Deep Purple text `oklch(0.18 0.02 295)` - Ratio 12.1:1 ✓
- Primary (Deep Purple `oklch(0.35 0.18 295)`): White text `oklch(1 0 0)` - Ratio 7.8:1 ✓
- Accent (Vibrant Purple `oklch(0.52 0.20 295)`): White text `oklch(1 0 0)` - Ratio 4.8:1 ✓
- Secondary (Medium Violet `oklch(0.50 0.14 295)`): White text `oklch(1 0 0)` - Ratio 5.1:1 ✓

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
- **Dot Grid Pattern**: Radial gradient circles creating subtle dotted texture, 20px spacing, 10% opacity in primary brand color
- **Grid Pattern**: Linear gradient lines creating subtle grid overlay, 30px spacing, 8% opacity for technical aesthetic
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
- **Migration Path Diagram**: Custom animated visualization component showing end-to-end migration journey from source SCM platform to GitHub. Features platform icons in branded cards, animated SVG curved path with gradient and arrowhead marker, numbered migration stages (Discovery & Analysis, Repository Migration, CI/CD Migration, Team Training) with icons and descriptions. Uses framer-motion for staggered entrance animations, path drawing animation (pathLength), and smooth fade-ins. Displays on Services Dashboard when platform selected and in SOW Form Migration tab. Adapts source platform based on user selection (GitHub/GitLab/Bitbucket/Azure DevOps).

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
