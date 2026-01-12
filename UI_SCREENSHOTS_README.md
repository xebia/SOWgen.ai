# SOWgen.ai UI Screenshots Documentation

This directory contains scripts and documentation for generating comprehensive UI screenshot documentation of the SOWgen.ai application.

## Generated Documents

Two documents have been generated with all UI screenshots:

1. **SOWgen_UI_Screenshots.docx** - Microsoft Word format (3.0 MB)
2. **SOWgen_UI_Screenshots.pdf** - PDF format (3.1 MB)

## What's Included

The documentation includes screenshots of the following pages:

1. **Login Page - Client View** - Client authentication interface
2. **Login Page - Xebia Team View** - Admin/staff authentication interface
3. **Services Dashboard** - Main platform selection dashboard with all SCM and cloud platforms
4. **SOW Generation Method Selection** - Choice between manual entry and automated import with migration path visualization
5. **SOW Form - Basic Information** - Project configuration and basic details entry
6. **SOW Form - Migration Configuration** - Detailed migration setup with repository inventory and CI/CD options
7. **User Profile** - User profile management modal
8. **Xebia Admin Dashboard** - Analytics dashboard with metrics and charts for administrators

## Scripts

### `generate_ui_screenshots_doc.py`
Python script that generates a Word document (.docx) with all UI screenshots, titles, and detailed descriptions.

**Dependencies:**
```bash
pip install python-docx
```

**Usage:**
```bash
python3 generate_ui_screenshots_doc.py
```

### `generate_ui_screenshots_pdf.py`
Python script that generates a PDF document with all UI screenshots, titles, and detailed descriptions.

**Dependencies:**
```bash
pip install reportlab pillow
```

**Usage:**
```bash
python3 generate_ui_screenshots_pdf.py
```

## How Screenshots Were Captured

The screenshots were captured using Playwright automation:

1. Started the development server: `npm run dev`
2. Navigated to `http://localhost:5000`
3. Logged in as different user types (Client, Xebia Admin)
4. Captured full-page screenshots of each major UI component
5. Screenshots are stored in `/tmp/playwright-logs/`

## Regenerating Documentation

To regenerate the documentation with updated screenshots:

1. Ensure the development server is running:
   ```bash
   npm run dev
   ```

2. Capture new screenshots (or use existing ones in `/tmp/playwright-logs/`)

3. Run the generation scripts:
   ```bash
   # Generate Word document
   python3 generate_ui_screenshots_doc.py
   
   # Generate PDF document
   python3 generate_ui_screenshots_pdf.py
   ```

## Document Features

Both documents include:

- **Title page** with branding and generation date
- **Table of contents** for easy navigation
- **Introduction** explaining the SOWgen.ai platform
- **Detailed screenshots** with titles and comprehensive descriptions
- **Conclusion** summarizing the platform's features
- **Professional formatting** with Xebia brand colors (#6A0D52)
- **High-quality images** scaled appropriately for optimal viewing

## Notes

- Screenshots are automatically scaled to fit the page width while maintaining aspect ratio
- The Word document uses standard Microsoft Word formatting and can be easily edited
- The PDF document is optimized for viewing and printing
- Both documents are suitable for sharing with stakeholders, clients, and team members

## Purpose

These documents serve multiple purposes:

1. **Onboarding** - Help new users understand the platform interface
2. **Documentation** - Visual reference for features and functionality
3. **Presentations** - Use screenshots in client presentations and demos
4. **Training** - Training materials for Xebia staff and clients
5. **Marketing** - Showcase the platform's capabilities

## License

This documentation is part of the SOWgen.ai project and follows the same MIT license.

---

**Generated on:** January 12, 2026  
**Platform:** SOWgen.ai - Statement of Work Generation Platform  
**Organization:** Xebia
