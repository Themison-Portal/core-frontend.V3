# Themison Clinical Trials Management Platform

## 🏥 What is Themison?

Themison is a clinical trial management system that enables organizations to:
- **Manage Clinical Trials**: Create, organize, and oversee multiple clinical trials
- **Team Collaboration**: Assign roles and permissions to team members across trials
- **Patient Management**: Track patient enrollment, visits, and documentation
- **Document Intelligence**: AI-powered document analysis and Q&A using Claude AI
- **Multi-tenant Architecture**: Complete data isolation between organizations

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **State Management**: TanStack React Query + React Context
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod validation
- **AI Services**: Anthropic Claude, OpenAI, ChatPDF integration

### Core Features

#### 1. **Multi-Tenant Organization System**
- Organizations (hospitals/clinics) are the top-level entity
- Complete data isolation via Supabase RLS policies
- Members belong to organizations with roles (`admin` | `staff`)

#### 2. **Trial Management**
- Create and manage clinical trials with detailed metadata
- Assign team members with trial-specific roles (`admin` | `edit` | `read`)
- Track trial phases, sponsors, locations, and timelines

#### 3. **Patient Enrollment**
- Track patient enrollment in trials
- Manage patient documents and visit schedules
- Status tracking (screening, enrolled, active, completed, withdrawn)

#### 4. **Document Intelligence**
- Upload trial documents (protocols, consent forms, etc.)
- AI-powered Q&A using Claude AI with PDF citations
- Chat history per document with source tracking
- Q&A repository for reusable answers

#### 5. **Role-Based Access Control (RBAC)**
- **Organization level**: Admin vs Staff roles
- **Trial level**: Admin, Edit, Read permissions
- Custom roles per organization
- Granular permission system

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (52 components)
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard-specific components
│   ├── documents/       # Document management & AI chat
│   ├── onboarding/      # Multi-step onboarding flow
│   ├── organization/    # Organization management
│   ├── trials/          # Trial management components
│   ├── layout/          # AppLayout & AppSidebar
│   └── common/          # Shared components
├── hooks/               # Custom React hooks (16 hooks)
│   ├── useAppData.tsx   # Centralized data layer (organization, members, trials)
│   ├── useAuth.tsx      # Authentication state
│   ├── usePermissions.tsx  # Permission checking
│   ├── usePatients.tsx  # Patient management
│   └── useDocuments.tsx # Document management
├── pages/               # Route pages
│   ├── auth/            # Sign in/Sign up
│   ├── DashboardPage.tsx
│   ├── TrialsPage.tsx
│   ├── TrialDetailPage.tsx
│   ├── OrganizationPage.tsx
│   ├── DocumentAssistantPage.tsx
│   └── Notifications.tsx
├── services/            # Business logic & external services
│   ├── aiServiceSwitcher.ts      # AI service routing
│   ├── claudeCitationsService.ts # Claude AI integration
│   ├── backendFallbackService.ts # Backend API integration
│   ├── chatPDFService.ts         # ChatPDF integration
│   ├── documentService.ts        # Document upload/management
│   └── mockAIService.ts          # Mock AI for demos
├── integrations/
│   └── supabase/        # Supabase client & types
└── lib/                 # Utilities
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (install via [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn
- Supabase account
- (Optional) Anthropic API key for AI features

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd themison-mvp-v1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080` (Vite default port).

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service Selection (backend | chatpdf | anthropic | anthropic-mockup)
VITE_AI_SERVICE=anthropic

# Optional: AI Service Keys
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_CHATPDF_ACCESS_KEY=your_chatpdf_key

# Backend API (if using custom backend)
VITE_API_BASE_URL=http://localhost:8000

# Mock AI for Demo
VITE_USE_MOCK_AI=false
```

## 📊 Database Schema (Supabase)

### Core Tables

- `organizations` - Hospital/clinic entities
- `profiles` - User authentication profiles (linked to Supabase Auth)
- `members` - Users within organizations with roles
- `trials` - Clinical trials
- `trial_members` - Trial team assignments with roles
- `trial_documents` - File storage for trial documentation
- `patients` - Patient records
- `trial_patients` - Patient enrollment in trials
- `patient_documents` - Patient-specific documents
- `roles` - Custom roles per organization
- `invitations` - Member invitation system
- `qa_responses` - Q&A repository for document chat

### Row Level Security (RLS)

All tables use RLS policies to ensure multi-tenant data isolation:
- Users can only access data from their organization
- Trial-specific data requires trial membership
- Document access is controlled by trial membership

## 🎯 Key Workflows

### 1. Onboarding Flow

**First Admin User:**
1. Sign up → Auto-creates organization
2. Mandatory 3-step onboarding:
   - Invite team members
   - Create custom roles
   - Create first trial

**Subsequent Admins:**
- See organization overview (can skip onboarding)

**Staff Users:**
- Skip onboarding, go directly to dashboard

### 2. Trial Creation

```typescript
// Uses RPC function: create_trial_with_members
{
  trial_data: {
    name, description, phase, sponsor, location,
    study_start, estimated_close_out
  },
  team_assignments: [
    { member_id, role_id, is_active, start_date }
  ]
}
```

### 3. Document AI Chat

1. Upload document to trial
2. Select document in Document Assistant
3. Ask questions → Claude analyzes PDF
4. Get answers with citations (page numbers + exact quotes)
5. Save Q&A to repository for reuse

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server (localhost:8080)
npm run build            # Production build
npm run build:dev        # Development build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
```

## 🤖 AI Services Configuration

Themison supports multiple AI backends:

### 1. **Anthropic Claude** (Recommended)
- Best citation quality
- Direct PDF analysis
- Set `VITE_AI_SERVICE=anthropic`

### 2. **Custom Backend**
- Your own AI service
- Set `VITE_AI_SERVICE=backend`
- Configure `VITE_API_BASE_URL`

### 3. **ChatPDF**
- Third-party service
- Set `VITE_AI_SERVICE=chatpdf`

### 4. **Mock (Demo)**
- No API keys needed
- Set `VITE_AI_SERVICE=anthropic-mockup`

The `aiServiceSwitcher.ts` automatically routes requests to the configured service with fallback logic.

## 📝 Development Guidelines

### Permission Checking

Always check permissions before showing actions:

```typescript
const { hasPermission, canCreateTrials } = usePermissions();

if (canCreateTrials) {
  // Show create trial button
}
```

### Data Fetching

Use the centralized `useAppData` hook:

```typescript
const {
  organization,
  members,
  trials,
  roles,
  isLoading
} = useAppData();
```

### Form Patterns

- Use React Hook Form + Zod for validation
- Implement optimistic updates with React Query
- Show loading states during mutations

## 🐛 Known Issues & TODOs

- [ ] Fix role logic (default_role vs custom roles) - `src/hooks/useAppData.tsx:366`
- [ ] Implement file upload in chat - `src/components/chat/ChatInput.tsx:38`
- [ ] Add delete organization functionality - `src/components/organization/OrganizationSettings.tsx:271`
- [ ] Add created_at to organization query - `src/components/organization/OrganizationOverview.tsx:87`

## 🏗️ Planned Refactoring

1. **Split `useAppData` hook** into specific hooks:
   - `useOrganization()`
   - `useMembers()`
   - `useRoles()`
   - `useTrialAssignments()`

2. **Extract large components**:
   - Break down `TrialPatientsManager.tsx` (1300+ lines)
   - Refactor `DocumentAI.tsx` into smaller components

3. **Enable strict TypeScript**:
   - Remove `noImplicitAny: false`
   - Add proper types for `any` usage

4. **Consolidate AI services**:
   - Unify chat history hooks
   - Single abstraction layer

## 📚 Additional Documentation

For detailed architecture and development patterns, see:
- [CLAUDE.md](/CLAUDE.md) - Comprehensive development guide
- [Supabase Schema](https://supabase.com/dashboard/project/_/editor) - Database structure

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Run linter: `npm run lint`
4. Commit with descriptive message
5. Push and create Pull Request

## 🆘 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact the development team
