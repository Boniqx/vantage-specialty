# Vantage Specialty EHR

A high-fidelity MVP Electronic Health Record (EHR) platform built with modern web technologies. Inspired by WRS Health, designed for specialty medical practices.

![Vantage EHR](./public/logo.png)

## 🏥 Features

### Core Dashboard
- **Left Sidebar Navigation**: Schedule, Patients, Clinical Notes, Billing, Reports
- **Top Bar**: Patient search, Specialty switcher, Theme toggle
- **Today's Schedule**: Quick view of appointments with status tracking

### Clinical Charting (Phase 1)
- **Dynamic Specialty Forms**: Form fields automatically adapt based on selected specialty
  - **Cardiology**: Heart murmurs, cardiac rhythm, JVP, peripheral pulses
  - **General Medicine**: Standard ROS, HEENT examination
  - **Pediatrics**: Growth percentiles, developmental milestones, immunization status
- **SOAP Note Structure**: Organized tabs for Subjective, Objective, Assessment, Plan
- **ICD-10 Integration**: Placeholder for diagnosis coding

### Database Schema
- `profiles`: Doctors/Staff with roles and specialties
- `patients`: Demographics, insurance, medical history
- `appointments`: Scheduling with status tracking
- `clinical_notes`: SOAP format with specialty-specific fields
- `audit_logs`: HIPAA-compliant access logging

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 + Shadcn/UI
- **Theming**: next-themes (Clinical Light/Dark modes)
- **Database/Auth**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the schema in `supabase/schema.sql` via the SQL Editor
   - Copy your project URL and anon key

3. **Configure environment**
   ```bash
   # Create .env.local with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind + Clinical theme CSS variables
│   ├── layout.tsx        # Root layout with ThemeProvider
│   └── page.tsx          # Main dashboard page
├── components/
│   ├── charting/
│   │   ├── charting-panel.tsx      # Main charting component
│   │   ├── soap-tabs.tsx           # SOAP note tabs
│   │   ├── specialty-selector.tsx  # Specialty dropdown
│   │   └── specialty-forms/
│   │       ├── cardiology-form.tsx
│   │       ├── general-form.tsx
│   │       └── pediatrics-form.tsx
│   ├── layout/
│   │   ├── sidebar.tsx   # Navigation sidebar
│   │   └── top-bar.tsx   # Top navigation bar
│   ├── ui/               # Shadcn components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   ├── supabase.ts       # Supabase client
│   ├── utils.ts          # Utility functions
│   └── types/
│       └── database.ts   # TypeScript interfaces
├── services/
│   └── clinical-notes.ts # CRUD operations
└── supabase/
    └── schema.sql        # Database schema
```

## 🎨 Theme

### Clinical Light (Default)
- Primary: `#0F52BA` (Clinical Blue)
- Background: `#FFFFFF`

### Clinical Dark
- Primary: `#3B82F6` (Lighter Blue)
- Background: `#0A0A0F`

## 🔒 HIPAA Considerations

This MVP includes foundational HIPAA-compliance features:
- ✅ Audit logging table for PHI access tracking
- ✅ Row-Level Security (RLS) policies
- ✅ Placeholder fields for encryption

**Note**: Full HIPAA compliance requires additional measures:
- Business Associate Agreement (BAA) with Supabase
- Data encryption at rest and in transit
- Access controls and authentication
- Regular security audits
- Staff training documentation

## 📋 Roadmap

### Phase 2 (Planned)
- [ ] Patient registration flow
- [ ] Full appointment scheduling
- [ ] E-prescribing module
- [ ] Lab results integration

### Phase 3 (Planned)
- [ ] Billing and claims submission
- [ ] Reporting and analytics dashboard
- [ ] Multi-provider support
- [ ] Telehealth integration

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ using Next.js, Tailwind CSS, and Supabase
