#!/usr/bin/env python3
"""
Generate a PDF document with all UI screenshots of SOWgen.ai application
"""

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfgen import canvas
from datetime import datetime
from PIL import Image as PILImage
import os

def create_pdf():
    """Create a PDF document with all UI screenshots"""
    
    output_path = '/home/runner/work/SOWgen.ai/SOWgen.ai/SOWgen_UI_Screenshots.pdf'
    
    # Create the PDF document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom title style
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=36,
        textColor=HexColor('#6A0D52'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Custom subtitle style
    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=20,
        textColor=HexColor('#6A0D52'),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica'
    )
    
    # Custom heading style
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=HexColor('#6A0D52'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    # Custom body style
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        spaceAfter=12,
        alignment=TA_JUSTIFY,
        leading=14
    )
    
    # Date style
    date_style = ParagraphStyle(
        'DateStyle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=HexColor('#808080'),
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    # Title page
    elements.append(Spacer(1, 1.5*inch))
    elements.append(Paragraph('SOWgen.ai', title_style))
    elements.append(Paragraph('UI Screenshots Documentation', subtitle_style))
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph(f'Generated on: {datetime.now().strftime("%B %d, %Y")}', date_style))
    elements.append(Spacer(1, 0.5*inch))
    
    # Introduction
    intro_text = """
    This document provides a comprehensive visual overview of the SOWgen.ai application. 
    SOWgen.ai is an enterprise-grade web application designed to streamline how Xebia creates, 
    manages, and approves Statement of Work (SOW) documents for migration and training services. 
    The platform combines intelligent automation with professional design to deliver an exceptional 
    experience for both clients and internal staff.
    """
    elements.append(Paragraph(intro_text, body_style))
    
    elements.append(PageBreak())
    
    # Table of Contents
    elements.append(Paragraph('Table of Contents', heading_style))
    toc_items = [
        '1. Login Page - Client View',
        '2. Login Page - Xebia Team View',
        '3. Services Dashboard',
        '4. SOW Generation Method Selection',
        '5. SOW Form - Basic Information',
        '6. SOW Form - Migration Configuration',
        '7. User Profile',
        '8. Xebia Admin Dashboard'
    ]
    for item in toc_items:
        elements.append(Paragraph(item, body_style))
        elements.append(Spacer(1, 6))
    
    elements.append(PageBreak())
    
    # Define screenshots with their descriptions
    screenshots = [
        {
            'path': '/tmp/playwright-logs/01-login-page-client.png',
            'title': '1. Login Page - Client View',
            'description': """The main login page for client users. Clients can enter their email address and 
            organization name to access the platform and create SOWs. The page features a clean, 
            modern design with the Xebia branding and highlights three key value propositions: 
            Accelerate, Automate, and Scale."""
        },
        {
            'path': '/tmp/playwright-logs/02-login-page-xebia.png',
            'title': '2. Login Page - Xebia Team View',
            'description': """The login page for Xebia team members (administrators and approvers). Xebia staff 
            can sign in using their Xebia email address to access the admin dashboard and manage 
            all SOWs across the platform."""
        },
        {
            'path': '/tmp/playwright-logs/03-services-dashboard.png',
            'title': '3. Services Dashboard',
            'description': """The main dashboard clients see after logging in, displaying all available platform 
            services. Users can select from various SCM platforms (GitHub, GitLab, Bitbucket, 
            Azure DevOps, etc.) and cloud platforms (AWS, GCP, Azure, Terraform) to generate SOWs. 
            The page includes a search bar and category filter for easy navigation, along with 
            information about the benefits of automated platform integration."""
        },
        {
            'path': '/tmp/playwright-logs/04-sow-generation-method.png',
            'title': '4. SOW Generation Method Selection',
            'description': """After selecting a platform (e.g., GitHub), users choose between two SOW generation methods: 
            Manual Entry or Automated Import (recommended). The page displays the migration path 
            visualization showing the 7-stage journey from source to target platform, including 
            Discovery & Analysis, Initial Setup, Repo Migration, CI/CD Migration, CI/CD Implementation, 
            Team Training, and Support & Documentation. Integration details are provided at the bottom."""
        },
        {
            'path': '/tmp/playwright-logs/05-sow-form-basic.png',
            'title': '5. SOW Form - Basic Information',
            'description': """The SOW creation form where users enter basic project information including project name, 
            description, and select which services are required (Migration Services and/or Training Services). 
            The form features auto-save functionality and allows users to save drafts or submit for approval. 
            This view shows the initial project configuration tab."""
        },
        {
            'path': '/tmp/playwright-logs/06-sow-form-migration.png',
            'title': '6. SOW Form - Migration Configuration',
            'description': """When Migration Services are selected, this section appears showing detailed migration configuration 
            options. Users can select the GitHub migration type (Classic, EMU, or GHES), specify the number 
            of users to migrate, and view the complete migration path diagram. The form includes repository 
            inventory fields (total repositories, public/private counts, size metrics, programming languages) 
            and an option to include CI/CD migration. The interactive migration path shows all 7 stages of 
            the migration process with visual indicators."""
        },
        {
            'path': '/tmp/playwright-logs/07-user-profile.png',
            'title': '7. User Profile',
            'description': """The user profile modal displays personal information including name, email, organization, 
            user ID, and account type. Users can view their profile information and access the edit 
            profile functionality. The profile shows an avatar with user initials and provides a clean 
            interface for managing account details."""
        },
        {
            'path': '/tmp/playwright-logs/08-xebia-admin-dashboard.png',
            'title': '8. Xebia Admin Dashboard',
            'description': """The comprehensive analytics dashboard for Xebia administrators, displaying key metrics 
            including Total SOWs, Approved SOWs, Pending Reviews, and Average Approval Time. The dashboard 
            features interactive charts showing SOW Status Distribution, Monthly SOW Creation trends, 
            SOWs by Client, and a Recent Changes widget. This provides Xebia staff with data-driven 
            insights to monitor and optimize the SOW pipeline."""
        }
    ]
    
    # Add each screenshot
    for i, screenshot in enumerate(screenshots, 1):
        # Add title
        elements.append(Paragraph(screenshot['title'], heading_style))
        
        # Add description
        elements.append(Paragraph(screenshot['description'], body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Add image if it exists
        if os.path.exists(screenshot['path']):
            # Get image dimensions and scale to fit page width
            img = PILImage.open(screenshot['path'])
            img_width, img_height = img.size
            
            # Calculate scaling to fit page width (6.5 inches max)
            max_width = 6.5 * inch
            max_height = 8 * inch
            
            aspect = img_height / float(img_width)
            
            if img_width > max_width:
                width = max_width
                height = width * aspect
            else:
                width = img_width
                height = img_height
            
            # If height is too large, scale down
            if height > max_height:
                height = max_height
                width = height / aspect
            
            # Add the image
            img_element = Image(screenshot['path'], width=width, height=height)
            elements.append(img_element)
        else:
            elements.append(Paragraph(f'[Image not found: {screenshot["path"]}]', body_style))
        
        # Add page break after each screenshot except the last one
        if i < len(screenshots):
            elements.append(PageBreak())
    
    # Add conclusion
    elements.append(PageBreak())
    elements.append(Paragraph('Conclusion', heading_style))
    conclusion_text = """
    This documentation provides a complete visual overview of the SOWgen.ai application, 
    showcasing its intuitive user interface, comprehensive features, and professional design. 
    The platform successfully combines intelligent automation with enterprise-grade functionality 
    to streamline the SOW creation and management process for both clients and Xebia staff.
    """
    elements.append(Paragraph(conclusion_text, body_style))
    elements.append(Spacer(1, 0.5*inch))
    
    footer_text = 'For more information, visit: <link href="https://github.com/xebia/SOWgen.ai">https://github.com/xebia/SOWgen.ai</link>'
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontSize=10,
        textColor=HexColor('#808080'),
        alignment=TA_CENTER
    )
    elements.append(Paragraph(footer_text, footer_style))
    
    # Build the PDF
    doc.build(elements)
    print(f'✅ PDF document created successfully: {output_path}')
    
    return output_path

if __name__ == '__main__':
    create_pdf()
