# SOWGen.ai - Statement of Work Generation Platform

**Intelligent automation for enterprise SOW creation and management**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
  - [For Clients](#for-clients)
  - [For Xebia Administrators](#for-xebia-administrators)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Integration](#api-integration)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SOWGen.ai is an enterprise-grade web application designed to streamline how Xebia creates, manages, and approves Statement of Work (SOW) documents for migration and training services. The platform combines intelligent automation with professional design to deliver an exceptional experience for both clients and internal staff.

### What Makes SOWGen.ai Special?

🚀 **Intelligent Automation**
- Automatically fetch repository data from GitHub, GitLab, Bitbucket, and Azure DevOps
- Smart man-hour calculations based on migration complexity
- Pre-populated forms saving 80% of data entry time

📊 **Data-Driven Insights**
- Comprehensive analytics dashboard for Xebia administrators
- Real-time SOW pipeline metrics and trends
- Interactive charts showing approval rates and performance

✨ **Professional Experience**
- Modern, intuitive interface aligned with Xebia branding
- Interactive migration path visualization
- Mobile-responsive design for approvals on-the-go

🔐 **Enterprise-Grade Security**
- Role-based access control
- API tokens never stored on servers
- HTTPS encryption for all communications

---

## Key Features

### 1. **Dual-Mode SOW Creation**

#### Manual Entry Mode
- Guided form interface for traditional SOW creation
- Comprehensive project details collection
- Migration and training services configuration
- Form auto-save every 30 seconds

#### Automation Mode
- Direct integration with SCM platforms (GitHub, GitLab, Bitbucket, Azure DevOps)
- Automatic repository data fetching via REST APIs
- Instant complexity analysis and man-hour estimates
- Pre-populated forms reducing creation time by 80%

### 2. **Migration Services Configuration**

- **GitHub Migration Types**: Classic, EMU, GHES with type-specific calculations
- **Repository Inventory Management**: Track total repos, visibility, size, languages
- **CI/CD Migration**: Optional workflow migration from Jenkins, CircleCI, Travis CI, GitLab CI
- **Automated Man-Hour Estimates**: 
  - GitHub Classic: 2 hours/repo base rate
  - GitHub EMU: 3 hours/repo base rate
  - GitHub GHES: 4 hours/repo base rate
  - Adjustments for LFS, submodules, size, and complexity
- **Interactive Migration Path Diagram**: 7-stage visual journey showing complete migration process

### 3. **Training Services Integration**

- Comprehensive training module library organized by track and level
- Participant count management per module
- Total training hours calculation
- Seamless integration with SOW generation workflow

### 4. **Approval Workflow System**

- Multi-level approval chains with role-based routing
- Real-time status tracking and notifications
- Integrated commenting for feedback and collaboration
- Visual timeline showing approval progress
- Mobile-friendly approval interface

### 5. **Analytics Dashboard (Xebia Internal)**

- Key metrics: Total SOWs, Approved, Pending, Rejection Rates
- SOW approval trends over time (line charts)
- Distribution by status (pie charts)
- Top clients by SOW volume (bar charts)
- Customizable date range filtering

### 6. **Export Capabilities**

- **PDF Export**: Professional, branded documents for client distribution
- **CSV Export**: Comprehensive data export for analysis and reporting
- **Bulk Export**: Export multiple SOWs with applied filters
- **Print-Ready Formatting**: Optimized for offline review and archival

### 7. **User Profile Management**

- Avatar upload support (JPG, PNG, GIF, WebP, max 5MB)
- Profile editing with persistent display
- User initials fallback for missing avatars
- Profile information visible in header, approvals, and SOW lists

---

## User Roles

### 👤 Client Role

**Purpose**: External organizations requiring migration and training services

**Capabilities**:
- Create SOWs using manual or automation mode
- View dashboard with service platform offerings
- Track SOW approval status in real-time
- Export approved SOWs as PDF for internal presentation
- View their own SOW history and activity logs
- Edit profile and upload avatar

**Primary Journey**:
1. Login via Client portal
2. View services dashboard with SCM and cloud platforms
3. Select platform and creation mode (Manual/Automation)
4. Complete SOW form with migration/training configuration
5. Submit for Xebia review
6. Track approval status
7. Download approved SOW as PDF

### 👨‍💼 Xebia Administrator Role

**Purpose**: Internal staff managing SOW operations and platform administration

**Capabilities**:
- Access comprehensive analytics dashboard
- View and manage all client SOWs
- Process SOW submissions and route to approvers
- Export SOW data to CSV for reporting
- Manage user accounts and roles
- Configure service catalog and training modules
- Customize approval workflow rules
- View system-wide activity logs

**Primary Journey**:
1. Login via Xebia portal
2. Review dashboard metrics and KPIs
3. Process pending SOW submissions
4. Verify auto-calculated estimates
5. Route SOWs to appropriate approvers
6. Generate weekly reports via CSV export
7. Manage users and system configuration

### ✅ Approver Role

**Purpose**: Senior staff responsible for reviewing and approving SOWs

**Capabilities**:
- Review complete SOW details
- Access on mobile devices for remote approvals
- Add detailed comments and feedback
- Approve or reject SOWs with justification
- View approval timeline and history
- Track pending approvals
- Export individual SOWs as PDF

**Primary Journey**:
1. Receive email notification of pending SOW
2. Login via mobile or desktop
3. Review repository inventory and technical details
4. Examine man-hour estimates and complexity
5. Add technical recommendations via comments
6. Approve or request changes
7. Monitor SOW progress to completion

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher (v20 LTS recommended) ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository ([Download](https://git-scm.com/))
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/xebia/SOWgen.ai.git
cd SOWgen.ai
```

2. **Install dependencies**

```bash
npm install
```

This will install all required dependencies including:
- React 19 with TypeScript
- Tailwind CSS 4
- Radix UI component library
- Framer Motion for animations
- Recharts for data visualization
- And more (see [Technology Stack](#technology-stack))

3. **Verify installation**

```bash
npm run lint
```

If the installation was successful, the linter will run without errors.

### Running the Application

1. **Start the development server**

```bash
npm run dev
```

2. **Open your browser**

Navigate to `http://localhost:5000` (or the port shown in the terminal)

3. **Login with demo credentials**

The application includes demo users for testing:

**Client User:**
- Email: `client@example.com`
- Password: `demo123`

**Xebia Administrator:**
- Email: `admin@xebia.com`
- Password: `demo123`

**Approver:**
- Email: `approver@xebia.com`
- Password: `demo123`

4. **Explore the application**

- Try creating a SOW using both manual and automation modes
- Test the SCM API integration with public repositories
- View analytics on the Xebia dashboard
- Export SOWs as PDF and CSV

---

## Usage Guide

### For Clients

#### Creating Your First SOW

**Option 1: Automation Mode (Recommended for existing repositories)**

1. **Navigate to Dashboard**
   - After login, you'll see the Services Dashboard
   - View available SCM platforms and cloud services

2. **Select Platform**
   - Click on your source platform (e.g., GitHub, GitLab)
   - Choose "Use Automation" for automatic data fetching

3. **Connect Repository**
   - Enter your repository URL (e.g., `https://github.com/owner/repo`)
   - For private repositories, provide an access token ([How to generate](#generating-access-tokens))
   - Click "Fetch Repository Data"

4. **Review Auto-Populated Data**
   - Repository name, description, and metadata
   - Branch and commit statistics
   - Programming languages detected
   - CI/CD pipeline detection

5. **Configure Migration Services**
   - Check "Include Migration Services" to enable
   - Select GitHub Migration Type (Classic/EMU/GHES)
   - Review auto-calculated man-hour estimates
   - Optionally enable CI/CD migration

6. **Add Training Services**
   - Check "Include Training Services" to enable
   - Select relevant training modules from catalog
   - Set participant counts per module

7. **Submit SOW**
   - Review all information for accuracy
   - Click "Submit for Review"
   - Track approval status from dashboard

**Option 2: Manual Entry Mode**

1. **Start Manual Creation**
   - Click "Create Manually" from dashboard
   - Fill in project details: name, organization, description

2. **Complete Form Sections**
   - Project Information
   - Migration Services Configuration (optional)
   - Repository Inventory
   - Training Services Selection (optional)

3. **Save and Submit**
   - Form auto-saves every 30 seconds
   - Can save as draft for later completion
   - Submit when ready for review

#### Tracking SOW Status

- **Dashboard View**: See all your SOWs with current status
- **Status Indicators**:
  - 🟡 Draft: Not yet submitted
  - 🔵 Pending: Awaiting Xebia review
  - 🟣 Under Review: Being reviewed by approver
  - 🟢 Approved: Ready for project kickoff
  - 🔴 Rejected: Requires revisions

#### Exporting SOWs

- **PDF Export**: Click "Export PDF" on any approved SOW for professional documentation
- **CSV Export**: Download your SOW history for your records
- **Bulk Export**: Export all your SOWs at once from dashboard

#### Generating Access Tokens

For private repositories, you'll need to generate a personal access token:

**GitHub:**
1. Go to Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select `repo` scope
4. Copy the generated token

**GitLab:**
1. Go to User Settings → Access Tokens
2. Create token with `read_api` scope
3. Copy the generated token

**Bitbucket:**
1. Go to Settings → Personal Access Tokens  
2. Create token with repository read permissions
3. Copy the generated token

**Azure DevOps:**
1. Go to User Settings → Personal Access Tokens
2. Create token with Code (Read) scope
3. Copy the generated token

**Security Note**: Tokens are used only for the immediate API request and are never stored on servers.

---

### For Xebia Administrators

#### Dashboard Overview

The Xebia Dashboard provides comprehensive visibility into SOW operations:

**Key Metrics Cards:**
- Total SOWs in system
- Approved SOWs count
- Pending approvals
- Rejection rate

**Analytics Charts:**
- **Approval Trends**: Line chart showing approvals over time
- **Status Distribution**: Pie chart of SOW by status
- **Top Clients**: Bar chart of clients by SOW volume

**Filtering Options:**
- Date range selection (Last 30/60/90 days, YTD, Custom)
- Client organization filter
- Project status filter

#### Managing SOWs

1. **Review Pending SOWs**
   - Navigate to "All SOWs" tab
   - Filter by status: "Pending"
   - Click on SOW to view details

2. **Verify Automated Data**
   - Check repository inventory accuracy
   - Review man-hour calculations
   - Validate migration type selection

3. **Route for Approval**
   - Assign to appropriate approver
   - Add internal notes if needed
   - Set priority flags

4. **Generate Reports**
   - Use CSV export for weekly/monthly reports
   - Filter data by date range and client
   - Export includes all SOW details for analysis

#### User Management

1. **Access Admin Panel**
   - Click on user menu → Admin Settings
   - Navigate to User Management

2. **Create New Users**
   - Click "Add User"
   - Enter email, name, organization
   - Assign role (Client/Xebia Admin/Approver)
   - Send welcome email with credentials

3. **Manage Existing Users**
   - Search and filter user list
   - Edit user information and roles
   - Deactivate accounts when needed
   - Reset passwords

#### Service Catalog Management

1. **Training Modules**
   - Add new training courses and workshops
   - Organize by track (Developer/Admin/Security)
   - Set module levels (Beginner/Intermediate/Advanced)
   - Configure default participant counts

2. **Migration Services**
   - Update base man-hour rates
   - Configure complexity multipliers
   - Manage platform-specific settings

3. **Approval Workflows**
   - Define approval chains by project type
   - Assign default approvers
   - Set approval deadlines
   - Configure escalation rules

---

## Technology Stack

### Frontend Framework
- **React 19**: Latest React with modern features and performance improvements
- **TypeScript 5.7**: Full type safety across the application
- **Vite 7**: Lightning-fast development and optimized builds

### UI and Styling
- **Tailwind CSS 4**: Utility-first CSS framework with custom design system
- **Radix UI**: Accessible, unstyled component primitives
- **Framer Motion 12**: Smooth animations and transitions
- **Phosphor Icons**: Comprehensive icon library

### Data Visualization
- **Recharts 2**: Composable charting library for analytics dashboard

### Form Management
- **React Hook Form 7**: Performant form handling with minimal re-renders
- **Zod 3**: TypeScript-first schema validation

### State Management
- **React Context API**: Built-in state management with hooks
- **TanStack Query 5**: Powerful async state management for API calls

### Development Tools
- **ESLint 9**: Code quality and consistency
- **PostCSS**: CSS processing and optimization
- **TypeScript ESLint**: TypeScript-specific linting rules

### API Integration
- **Native Fetch API**: For SCM platform integrations
- **Octokit**: Official GitHub API client
- **Axios**: Promise-based HTTP client

---

## Project Structure

```
SOWgen.ai/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components (buttons, inputs, etc.)
│   │   ├── LoginPage.tsx    # Authentication page
│   │   ├── ServicesDashboard.tsx  # Client dashboard
│   │   ├── XebiaDashboard.tsx     # Admin dashboard with analytics
│   │   ├── SOWForm.tsx      # SOW creation form
│   │   ├── SOWDetail.tsx    # SOW detail view
│   │   ├── SOWList.tsx      # SOW list management
│   │   ├── UserProfile.tsx  # User profile management
│   │   ├── XebiaLogo.tsx    # Xebia branding component
│   │   └── MigrationPathDiagram.tsx  # Migration visualization
│   ├── lib/                 # Utility functions and helpers
│   │   ├── types.ts         # TypeScript type definitions
│   │   ├── app-context.tsx  # Global state management
│   │   ├── utils.ts         # Utility functions
│   │   └── scm-api.ts       # SCM API integration logic
│   ├── styles/              # Global styles and CSS
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global CSS imports
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── BRD.md              # Business Requirements Document
│   ├── PRD.md              # Product Requirements Document
│   └── SCM_API_GUIDE.md    # API integration guide
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # This file
```

---

## Available Scripts

### Development

```bash
npm run dev
```
Starts the development server at `http://localhost:5000` with hot module replacement (HMR).

### Build

```bash
npm run build
```
Creates an optimized production build in the `dist/` directory. Includes TypeScript compilation and Vite bundling.

### Preview

```bash
npm run preview
```
Preview the production build locally before deployment.

### Lint

```bash
npm run lint
```
Runs ESLint to check code quality and style consistency.

### Optimize

```bash
npm run optimize
```
Pre-optimizes dependencies for faster development server startup.

### Kill Port

```bash
npm run kill
```
Kills any process running on port 5000 (useful if the dev server doesn't shut down cleanly).

---

## Deployment

### GitHub Pages

This application is configured to deploy automatically to GitHub Pages when changes are pushed to the `main` branch.

#### Automatic Deployment

1. **Workflow Configuration**: The GitHub Actions workflow (`.github/workflows/deploy-github-pages.yml`) handles automatic deployment
2. **Trigger**: Pushes to the `main` branch automatically trigger a new deployment
3. **Build Process**: The workflow installs dependencies, builds the application with Vite, and deploys to GitHub Pages
4. **Access**: Once deployed, the application will be available at `https://xebia.github.io/SOWgen.ai/`

#### Manual Deployment

To manually trigger a deployment:

1. Go to the **Actions** tab in the GitHub repository
2. Select the **Deploy to GitHub Pages** workflow
3. Click **Run workflow** and select the `main` branch
4. Click **Run workflow** to start the deployment

#### Repository Settings

For the initial setup, ensure GitHub Pages is enabled in the repository settings:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the settings

The application will now deploy automatically on every push to `main`.

#### Local Testing

To test the production build locally with the GitHub Pages configuration:

```bash
GITHUB_PAGES=true npm run build
npm run preview
```

This will build the app with the correct base path (`/SOWgen.ai/`) and allow you to preview it locally.

---

## API Integration

SOWGen.ai integrates with multiple SCM platforms to automatically fetch repository data:

### Supported Platforms

| Platform | API Version | Authentication | Rate Limit |
|----------|-------------|----------------|------------|
| **GitHub** | REST API v3 | Personal Access Token | 5,000/hour (authenticated) |
| **GitLab** | API v4 | Personal Access Token | 600/minute (typical) |
| **Bitbucket** | REST API v2.0 | App Password | 1,000/hour |
| **Azure DevOps** | REST API v7.0 | Personal Access Token | No published limit |

### Data Retrieved

- Repository metadata (name, description, visibility)
- Branch and commit statistics
- Contributor analysis and member counts
- Programming language detection with usage percentages
- CI/CD pipeline detection (GitHub Actions, GitLab CI, etc.)
- Repository size and complexity metrics
- Open issues and pull/merge requests
- Stars, forks, and license information

### Error Handling

The application includes comprehensive error handling:

- **404 Not Found**: Repository doesn't exist or is private without token
- **401 Unauthorized**: Invalid or expired access token
- **403 Rate Limited**: Too many requests, wait or authenticate
- **Network Errors**: Connection issues or API downtime

All errors include user-friendly messages with actionable guidance for resolution.

### Security

- 🔐 API tokens are **never stored** on servers or in logs
- 🔒 Tokens are used only for immediate API requests
- 🌐 All API calls use HTTPS encryption
- 🎭 Token input fields use password masking

For detailed API integration information, see [SCM_API_GUIDE.md](SCM_API_GUIDE.md).

---

## Documentation

Comprehensive documentation is available in the repository:

- **[BRD.md](BRD.md)**: Business Requirements Document with detailed requirements, personas, and success metrics
- **[PRD.md](PRD.md)**: Product Requirements Document with complete feature specifications and design direction
- **[SCM_API_GUIDE.md](SCM_API_GUIDE.md)**: Detailed guide for SCM API integration, authentication, and troubleshooting
- **[UI_SCREENSHOTS_README.md](UI_SCREENSHOTS_README.md)**: Complete visual documentation with all UI screenshots in Word and PDF format
- **[SECURITY.md](SECURITY.md)**: Security policies and vulnerability reporting

---

## Contributing

We welcome contributions from the Xebia team! Here's how to get involved:

### Development Workflow

1. **Fork the repository** (for external contributors)
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow existing code style and patterns
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**
   - Run the dev server and test functionality
   - Check for console errors
   - Test responsive design
5. **Commit your changes**
   ```bash
   git commit -m "feat: Add new feature description"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Request review from maintainers

### Code Style Guidelines

- **TypeScript**: Use explicit types, avoid `any`
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables
- **CSS**: Tailwind utility classes, minimize custom CSS
- **Formatting**: Let ESLint and Prettier handle formatting

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, no logic change)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support and Contact

### For Issues and Questions

- **GitHub Issues**: [Report bugs or request features](https://github.com/xebia/SOWgen.ai/issues)
- **Internal Xebia Support**: Contact the SOWGen.ai team via Slack
- **Documentation**: Check [docs/](docs/) folder for detailed guides

### Project Maintainers

Maintained by the Xebia Product Team

---

## Acknowledgments

- **Xebia**: For sponsoring this project and providing domain expertise
- **React Team**: For the amazing React framework
- **Tailwind Labs**: For the excellent Tailwind CSS framework
- **Radix UI**: For accessible component primitives
- **All Contributors**: Thank you for your contributions!

---

## Quick Links

- 🏠 [GitHub Pages Demo](https://xebia.github.io/SOWgen.ai/)
- 📚 [Full Documentation](docs/)
- 📸 [UI Screenshots Documentation](UI_SCREENSHOTS_README.md) - Complete visual guide with Word & PDF
- 🐛 [Report Bug](https://github.com/xebia/SOWgen.ai/issues/new?template=bug_report.md)
- 💡 [Request Feature](https://github.com/xebia/SOWgen.ai/issues/new?template=feature_request.md)
- 📖 [API Guide](SCM_API_GUIDE.md)
- 🔐 [Security Policy](SECURITY.md)

---

**Built with ❤️ by Xebia | Empowering Digital Excellence**
