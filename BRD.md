# Business Requirements Document (BRD)
# SOWGen.ai - Statement of Work Generation Platform

**Version:** 1.0  
**Date:** January 11, 2026  
**Document Owner:** Xebia Product Team  
**Status:** Approved

---

## Executive Summary

### Project Overview
SOWGen.ai is an enterprise-grade web application designed to revolutionize how Xebia creates, manages, and approves Statement of Work (SOW) documents for migration and training services. The platform streamlines the entire SOW lifecycle from creation to approval, providing intelligent automation, data-driven insights, and seamless client engagement.

### Business Problem
Xebia currently faces several challenges in the SOW creation and management process:
- **Manual Data Entry**: Time-consuming manual collection of repository and project information
- **Inconsistent Documentation**: Lack of standardized SOW templates and formats
- **Approval Bottlenecks**: Inefficient approval workflows causing delays
- **Limited Visibility**: Poor tracking of SOW status and pipeline health
- **Client Experience**: Disconnected client engagement requiring multiple touchpoints

### Solution
SOWGen.ai addresses these challenges through:
- **Intelligent Automation**: AI-powered data fetching from SCM platforms (GitHub, GitLab, Bitbucket, Azure DevOps)
- **Unified Platform**: Single application serving both clients and internal Xebia staff
- **Streamlined Workflows**: Automated approval processes with real-time notifications
- **Analytics Dashboard**: Comprehensive insights into SOW pipeline and performance metrics
- **Professional Branding**: Modern, enterprise-grade interface aligned with Xebia's brand identity

### Expected Benefits
- **80% reduction** in SOW creation time through automation
- **Improved accuracy** by eliminating manual data entry errors
- **Faster approvals** through streamlined workflows and notifications
- **Enhanced client experience** with self-service SOW generation
- **Better decision-making** through data-driven analytics and insights

---

## Business Objectives

### Primary Objectives
1. **Accelerate SOW Creation Process**
   - Reduce average SOW creation time from 4 hours to 45 minutes
   - Enable clients to generate SOWs independently
   - Automate repository data collection via SCM APIs

2. **Improve Operational Efficiency**
   - Streamline approval workflows
   - Reduce approval cycle time by 60%
   - Minimize back-and-forth communication

3. **Enhance Client Experience**
   - Provide self-service SOW generation capabilities
   - Deliver transparent, real-time status updates
   - Enable professional PDF and CSV exports

4. **Enable Data-Driven Decisions**
   - Provide comprehensive analytics dashboard
   - Track SOW pipeline metrics and trends
   - Measure success rates and bottlenecks

---

## Stakeholder Analysis

### Primary Stakeholders

#### 1. Clients (External)
**Role**: Organizations requiring migration and training services  
**Needs**: Simple SOW creation, transparency, quick turnaround, professional documentation  
**Pain Points**: Complex requirements, long wait times, lack of visibility

#### 2. Xebia Administrators
**Role**: Internal staff managing SOW operations  
**Needs**: Comprehensive management, analytics tools, user management, workflow configuration  
**Pain Points**: Manual data entry, tracking multiple SOWs, generating reports

#### 3. Approvers
**Role**: Senior staff responsible for SOW review and approval  
**Needs**: Clear SOW information, efficient review interface, commenting capabilities  
**Pain Points**: Incomplete information, tracking approvals, limited context

---

## Functional Requirements Summary

### Core Features
1. **Authentication & Authorization**: Role-based access for Clients, Xebia Admins, and Approvers
2. **Xebia Dashboard**: Analytics with SOW metrics, trends, and filtering capabilities
3. **Client Dashboard**: Service platforms overview with SOW creation options
4. **Manual SOW Creation**: Guided form with migration and training configuration
5. **Automation Mode**: SCM API integration (GitHub, GitLab, Bitbucket, Azure DevOps)
6. **Approval Workflow**: Multi-level approval with commenting and timeline tracking
7. **Admin Panel**: User management, service catalog, and system configuration
8. **Export Features**: Professional PDF and CSV export capabilities
9. **Activity Monitoring**: Platform activity logs with filtering and search

### Key Capabilities
- **SCM API Integration**: Real-time data fetching from GitHub (REST API v3), GitLab (API v4), Bitbucket (API v2.0), Azure DevOps (REST API v7.0)
- **Man-Hour Calculation**: Automatic estimates based on migration type (Classic: 2hrs/repo, EMU: 3hrs/repo, GHES: 4hrs/repo) with complexity adjustments
- **Migration Path Visualization**: Interactive 7-stage diagram showing end-to-end migration journey
- **Profile Management**: Avatar upload (5MB limit), profile editing, persistent display across platform
- **Form Auto-Save**: Draft preservation every 30 seconds with local storage
- **Responsive Design**: Full functionality on desktop, tablet, and mobile devices

---

## Non-Functional Requirements Summary

### Performance
- Page load < 2 seconds, API calls < 5 seconds
- Support 1,000 concurrent users
- Efficient handling of 1,000+ repositories

### Security
- HTTPS/TLS 1.3 encryption, secure session tokens
- API tokens never stored, role-based access control
- Input validation and CSRF protection

### Usability  
- WCAG 2.1 Level AA compliance
- Intuitive interface requiring minimal training
- Browser support: Chrome, Firefox, Safari, Edge (latest versions)

### Reliability
- 99.5% uptime, automated backups
- Graceful error handling and recovery
- Data integrity with validation

---

## Technical Architecture

### Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Framer Motion
- **UI Components**: Radix UI primitives with custom styling
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite
- **State Management**: React Context API
- **Data Validation**: Zod
- **Storage**: LocalStorage for drafts and session data

### API Integrations
- GitHub REST API v3
- GitLab API v4
- Bitbucket API v2.0
- Azure DevOps REST API v7.0

### Deployment
- Cloud hosting (Vercel, Netlify, or AWS Amplify)
- Global CDN with automatic SSL
- CI/CD pipeline with automated testing

---

## User Personas

### Sarah Chen - Migration Client
**Role**: IT Director  
**Goal**: Migrate 150 repositories from GitLab to GitHub EMU  
**Journey**: Automation mode → Auto-populate data → Configure migration → Submit → Track approval → Export PDF

### Marcus Rodriguez - Xebia Administrator
**Role**: Senior Consultant  
**Goal**: Process 20+ SOWs weekly with high quality  
**Journey**: Review dashboard metrics → Process SOWs → Verify calculations → Route to approvers → Generate reports

### Jennifer Wang - Approver
**Role**: Principal Architect  
**Goal**: Review SOWs accurately within 24-hour SLA  
**Journey**: Email notification → Mobile review → Examine data → Add comments → Approve with confidence

---

## Success Metrics and KPIs

### Efficiency Metrics
- SOW creation time: 4 hours → 45 minutes (81% reduction)
- Approval cycle time: 5 days → 2 days (60% reduction)
- Data entry errors: 90% reduction
- Client self-service rate: 80% target

### Quality Metrics
- SOW completeness: 95% target
- First-time approval rate: 75% target
- Client satisfaction NPS: 50+ target
- Approval SLA compliance: 90% target

### Technical Metrics
- Page load time: < 2 seconds average
- System uptime: 99.5%
- Error rate: < 0.1%
- Session duration: > 10 minutes average

---

## Risk Analysis

### High-Priority Risks
1. **API Reliability**: External APIs may experience downtime → Mitigation: Graceful degradation to manual mode
2. **User Adoption**: Resistance to new platform → Mitigation: Phased rollout, comprehensive training, early feedback
3. **Data Privacy**: Sensitive data protection → Mitigation: Never store tokens, HTTPS encryption, regular audits

### Medium-Priority Risks
4. **Performance Under Load**: System slowdown with high usage → Mitigation: Code splitting, caching, monitoring
5. **Estimate Accuracy**: Man-hour calculations may be inaccurate → Mitigation: Manual override, continuous refinement
6. **Integration Complexity**: SCM APIs more complex than expected → Mitigation: Comprehensive error handling, testing

---

## Timeline and Milestones

### Phase 1: Foundation (Weeks 1-3)
- Project setup and design system
- Authentication and user management
- Dashboard foundations

### Phase 2: Core Features (Weeks 4-7)
- Manual SOW creation form
- SCM API integration (GitHub, GitLab)
- Automation mode and calculations
- SOW display and management

### Phase 3: Workflows (Weeks 8-9)
- Approval workflow system
- Admin panel features

### Phase 4: Analytics & Export (Weeks 10-11)
- Analytics dashboard
- PDF and CSV export

### Phase 5: Polish & Launch (Week 12)
- Testing and optimization
- Documentation and training materials
- Production deployment

**Launch Date**: End of Week 12

---

## Integration Requirements

### SCM Platforms
- **GitHub**: REST API v3, Personal Access Token with `repo` scope
- **GitLab**: API v4, Personal Access Token with `read_api` scope
- **Bitbucket**: REST API v2.0, App Password with repository read
- **Azure DevOps**: REST API v7.0, Personal Access Token with Code (Read)

### Future Integrations
- Email services (SendGrid, AWS SES)
- Calendar integration (Google Calendar, Outlook)
- CRM systems (Salesforce, HubSpot)
- Project management (Jira, Asana)

---

## Assumptions and Constraints

### Key Assumptions
- Users have modern browsers with JavaScript enabled
- Stable internet connectivity for API calls
- SCM platforms maintain backward-compatible APIs
- Clients willing to adopt self-service SOW creation

### Key Constraints
- Browser support: Modern browsers only (last 2 versions)
- Subject to external API rate limits
- Client-side only (no backend server initially)
- 12-week development timeline
- Team size: 2-3 developers

---

## Appendices

### Glossary
- **BRD**: Business Requirements Document
- **CI/CD**: Continuous Integration/Continuous Deployment
- **EMU**: Enterprise Managed User (GitHub feature)
- **GHES**: GitHub Enterprise Server
- **SCM**: Source Code Management
- **SOW**: Statement of Work

### Referenced Documents
- Product Requirements Document (PRD.md)
- SCM API Integration Guide (SCM_API_GUIDE.md)
- Security Policy (SECURITY.md)
- Project README (README.md)

### Compliance Requirements
- GDPR compliance for EU clients
- OWASP Top 10 security compliance
- WCAG 2.1 Level AA accessibility compliance

---

**Document End**

*This Business Requirements Document serves as the authoritative source for SOWGen.ai requirements and should be referenced throughout the project lifecycle.*
