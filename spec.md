# Will Wisher

## Overview
Will Wisher is a web application that helps clients in California create legal wills and revocable living trust agreements through a guided, step-by-step process. Users can save drafts and download completed documents as editable files.

## Authentication
- Users authenticate using Internet Identity
- Each user has their own private workspace for creating and managing wills and trusts
- Authentication system must properly handle login, logout, and session management
- Users must be able to successfully authenticate and gain access to the application features
- All users are automatically approved upon registration with no manual approval required

## Branding and Visual Identity
- Custom logo prominently displayed on the entry page as a key visual element
- Logo appears consistently in the header of all web pages throughout the application
- Logo placement ensures strong brand recognition and professional appearance across all pages
- Logo maintains consistent sizing and positioning for unified branding experience

## Entry Page Design
- Professional, polished SaaS startup-inspired landing page design with modern aesthetics
- Clean, contemporary layout with strategic use of whitespace and visual hierarchy
- Modern typography with carefully selected fonts that convey professionalism and trustworthiness
- Visually appealing graphics or illustrations that represent legal document creation and security
- Custom logo prominently featured as a primary visual element with professional placement
- Hero section with compelling headline and value proposition that immediately communicates the app's purpose
- Screenshot of the application interface prominently displayed in the cover section to showcase the actual app experience
- Expanded feature highlights section with visually prominent and engaging presentation of key benefits including:
  - Secure will and trust creation
  - Auto-save functionality
  - Editable document downloads
  - Internet Identity login security
  - California legal compliance
  - Step-by-step guided process
  - Draft management capabilities
  - Sample document references
  - Professional document generation
  - User-friendly interface design
- Enhanced feature showcase section with icons or illustrations for each major benefit, designed to be more visually striking and engaging
- Professional color scheme and visual elements that build trust for legal document creation
- Modern call-to-action buttons with clear visual hierarchy and engaging design
- Responsive design that looks polished across all device sizes
- Visual elements that communicate reliability, security, and professionalism for sensitive legal information
- Contemporary design patterns commonly found in successful SaaS applications
- Strong first impression that establishes credibility and encourages user engagement

## User Management
- Admin users have special privileges to manage the application
- Admin dashboard to view and manage users with controls for managing user roles
- Admin controls include viewing all users and managing their roles and permissions
- User approval is set to automatic by default so admins do not need to manually approve new registrations
- Regular users gain immediate full access to will and trust creation features upon authentication
- No approval workflow needed for new user registrations due to automatic approval setting

## Core Features

### Sample Documents Feature
- "Sample for Reference" section that provides fully completed will and trust examples using fictional persona data
- Sample documents use realistic but fictional information to demonstrate proper completion
- Sample will and trust are clearly labeled as "Sample for Reference" throughout the UI
- Sample documents include visible "DRAFT" watermark in document previews
- Downloaded sample Word files contain visible "DRAFT" watermark if technically possible
- Sample documents serve as reference examples for users to understand proper completion
- Sample functionality is separate from user's personal draft creation workflow

### Will Creation Process
- First page of the Will section displays a "Create Will" button
- New will drafts are only created after the user clicks the "Create Will" button
- Auto-saving functionality begins only after a will draft has been created via the "Create Will" button
- No automatic draft creation occurs from field entries before the user explicitly creates a will
- After clicking "Create Will", guided step-by-step forms collect all necessary information for a California legal will
- Progressive form completion with validation at each step
- Users can navigate between completed steps to review and modify information
- "Review" button in the will creation section that allows users to view their saved data on the "Review Your Will" page at any time, even if the form is not 100% complete
- Immediate and reliable auto-save functionality that updates draft data instantly when users enter information in any field (only after draft creation)
- Real-time draft updates that occur seamlessly without user intervention or delays
- Visual indicators for auto-save status to show users when their data is being saved

### Trust Creation Process
- First page of the Trust section displays a "Create Trust" button
- New trust drafts are only created after the user clicks the "Create Trust" button
- Auto-saving functionality begins only after a trust draft has been created via the "Create Trust" button
- No automatic draft creation occurs from field entries before the user explicitly creates a trust
- After clicking "Create Trust", guided step-by-step forms collect all necessary information for a California revocable living trust agreement
- Progressive form completion with validation at each step
- Users can navigate between completed steps to review and modify information
- "Review" button in the trust creation section that allows users to view their saved data on the "Review Your Trust" page at any time, even if the form is not 100% complete
- Trust creation operates independently from will data and does not require existing will information
- Standalone trust creation workflow that can be accessed directly
- Immediate and reliable auto-save functionality that updates draft data instantly when users enter information in any field (only after draft creation)
- Real-time draft updates that occur seamlessly without user intervention or delays
- Visual indicators for auto-save status to show users when their data is being saved

### Review Sections
- Will review section that displays all auto-saved data from the will creation process
- Trust review section that displays all auto-saved data from the trust creation process
- Review sections show entered information at any stage of completion, regardless of whether forms are 100% complete
- Users can preview their entered information even with partially completed forms
- Auto-saved data is always displayed in review sections, allowing users to see their progress and entered details
- Review functionality works with incomplete drafts to provide continuous visibility of user input

### Draft Management
- Users can save their progress as drafts at any point during the will or trust creation process
- Multiple drafts can be saved and managed per user for both wills and trusts
- Drafts include all form data and current completion status
- Users can resume working on saved drafts
- "My Drafts" section that displays all saved will and trust drafts
- "Continue Editing" functionality that loads a selected draft back into the appropriate creation form
- "View" button for each will and trust draft in the "My Drafts" section that opens the draft in read-only review mode with a light blue color styling that stands out visually while maintaining accessibility and consistency with the app's design
- "Download" button for each draft that allows users to download incomplete and complete drafts as editable Word documents
- View functionality displays all saved data regardless of completion status, allowing users to see their draft content without editing
- When viewing a draft, users can see all entered information in a read-only format that shows the current state of their will or trust
- View mode provides complete visibility of draft content for both incomplete and complete forms
- When continuing editing, users are taken to the appropriate form with all previously entered data restored
- Form state is properly restored including current step position and all field values
- Users can seamlessly continue from where they left off in their draft
- Reliable auto-save system that immediately captures and stores field changes for both will and trust creation forms (only after drafts are explicitly created)
- Draft updates happen instantly and reliably as users type or modify any form field

### Document Generation and Download
- Generate completed will and trust documents based on user input using custom document generation code
- Generate sample will and trust documents using fictional persona data for reference purposes
- Reliable download functionality that creates and delivers valid .docx Word files to the user for both wills and trusts
- Sample document downloads that include visible "DRAFT" watermark if technically feasible
- User's entered information is formatted into simple, readable document structures
- Generated documents follow California legal requirements for wills and revocable living trust agreements
- Downloaded .docx files are fully compatible with Microsoft Word and other document editors
- Document generation ensures proper Word document structure and formatting with correct headers, content types, and file structure
- Files maintain editability after download for future modifications
- Download process handles proper file naming, MIME types, and browser compatibility
- Custom document templates are built programmatically without external dependencies
- Generated Word documents are plain, unlocked, and contain no password protection or encryption
- Documents open immediately in standard Word processors without requiring any passwords or special access
- Files are created as standard, unprotected .docx documents that can be freely edited and shared

### Completion Workflow
- "Complete Will" button that finalizes the will creation process and redirects users back to the "My Drafts" section
- "Complete Trust" button that finalizes the trust creation process and redirects users back to the "My Drafts" section
- Proper navigation flow that ensures users are returned to their drafts overview after completing either document type
- Completion actions that properly save final document state before redirecting
- Visual indicators for completion status to show users when documents are finalized

## Project Configuration
- Project is configured with proper dfx.json file that defines backend canisters and frontend deployment settings
- Configuration includes all necessary canister definitions for the application's backend services
- Frontend deployment configuration is properly set up for the React-based user interface
- Project structure supports proper build and deployment processes for the Internet Computer platform
- Configuration ensures proper canister communication and frontend-backend integration

## Deployment Documentation
- Comprehensive deployment instructions documentation file that explains how to deploy, run, and test the Will Wisher application
- Step-by-step guide for local development setup using dfx commands and tools
- Instructions for frontend build process including npm/yarn commands and build configuration
- Production deployment guide with detailed steps for deploying to the Internet Computer mainnet
- Local testing procedures and commands for verifying application functionality during development
- Environment setup requirements including Node.js, dfx installation, and other dependencies
- Troubleshooting section with common deployment issues and their solutions
- Configuration details for different deployment environments (local, testnet, mainnet)
- Instructions for managing canister cycles and deployment costs
- Guide for updating and redeploying the application with new changes

## Backend Data Storage
- User profiles and authentication state
- User roles and permissions for admin management
- Will drafts containing form data and completion status
- Trust drafts containing form data and completion status
- Sample will and trust data using fictional persona information
- Legal content requirements and formatting specifications for both wills and trusts
- All user data is stored securely with proper encryption and access controls

## Backend Operations
- Create new will drafts only when explicitly requested via "Create Will" button
- Create new trust drafts only when explicitly requested via "Create Trust" button
- Create, read, update, and delete will and trust drafts for authenticated users
- Retrieve sample will and trust data for reference display and document generation
- Retrieve specific draft data for loading into the appropriate creation form
- Retrieve specific draft data for display in read-only view mode regardless of completion status
- Retrieve auto-saved draft data for display in review sections regardless of completion status
- Handle immediate and reliable auto-save operations triggered by any field changes in both will and trust creation forms (only after drafts are created)
- Process real-time draft save requests with high reliability and immediate response
- Generate properly formatted will and trust documents from user data using custom document creation logic
- Generate sample will and trust documents from fictional persona data with "DRAFT" watermark if possible
- Create valid .docx files with correct Word document structure, formatting, and file headers using internal code for both wills and trusts
- Build documents programmatically with user-specific information in simple, readable formats
- Ensure generated documents maintain full compatibility with Microsoft Word and other document editors
- Generate plain, unprotected Word documents without any password protection, encryption, or access restrictions
- Create standard .docx files that open immediately in any compatible word processor without authentication requirements
- Handle reliable document generation with proper MIME types, content disposition headers, and binary file handling
- Manage completion workflow operations that finalize documents and handle proper navigation flow
- Manage user sessions and authentication state
- Handle Internet Identity authentication flow and user verification
- Automatically approve all new user registrations without manual intervention
- Manage user access and permissions with admin controls for viewing and managing user roles
- Provide admin functionality to view all users and manage their roles and permissions
- Secure data storage and retrieval operations with proper access controls and encryption
