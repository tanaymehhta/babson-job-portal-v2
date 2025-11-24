# 🐛 BUG FIXES CHECKLIST - Feature Branch

## Status: 🟡 IN PROGRESS

This document tracks all bugs that need to be fixed before merging to main (production).

---

## **✅ CRITICAL BUGS (Must Fix Before Merge)**

### **Bug #1: Blank Screen on Job Detail Click** 🔴
**File:** `src/app/(student)/jobs/[id]/page.tsx:57`

**Current Code:**
```tsx
if (!job) return <div>Job not found</div>;
```

**Problem:**
- Unstyled error message
- No navigation back
- Poor UX when job doesn't exist

**Fix:**
```tsx
if (!job) {
    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="text-6xl">😞</div>
                <h1 className="text-2xl font-bold text-slate-900">Job Not Found</h1>
                <p className="text-slate-600">This job posting may have been removed or doesn't exist.</p>
                <Link href="/">
                    <Button className="bg-babson-green-700 hover:bg-babson-green-800 text-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Search
                    </Button>
                </Link>
            </div>
        </div>
    );
}
```

**Status:** ✅ FIXED (2025-11-24)

**Implemented Fix:**
- Added styled error state with animated emoji
- Clear error message explaining the issue
- Back button to return to search
- Full page layout with proper styling

---

### **Bug #2: Backspacing from Search Resets** 🔴
**File:** `src/components/student/student-home.tsx:27,86-107`

**Current Code:**
```tsx
const [hasSearched, setHasSearched] = useState(false);

const handleSearch = async (query: string) => {
    setHasSearched(true);  // Never resets!
    // ...
}

{hasSearched && (
    <section>
        <h2>Job Matches <span>{jobs.length}</span></h2>
    </section>
)}
```

**Problem:**
- `hasSearched` set to true but never resets
- Clearing search query doesn't hide results section
- Shows "Job Matches (0)" even with empty query

**Fix:** Add reset logic to SearchBar component

**Option A: Reset on empty query (in student-home.tsx)**
```tsx
const handleSearch = async (query: string) => {
    if (!query.trim()) {
        setHasSearched(false);
        setJobs([]);
        setEvents([]);
        return;
    }

    setLoading(true);
    setHasSearched(true);
    // ... rest of search logic
}
```

**Option B: Pass reset handler to SearchBar**
```tsx
// In student-home.tsx
const handleQueryChange = (query: string) => {
    if (!query.trim()) {
        setHasSearched(false);
        setJobs([]);
        setEvents([]);
    }
};

<SearchBar
    onSearch={handleSearch}
    onQueryChange={handleQueryChange}
    isLoading={loading}
/>

// In search-bar.tsx - add onQueryChange prop
onChange={(e) => {
    setQuery(e.target.value);
    onQueryChange?.(e.target.value);
}}
```

**Status:** ✅ FIXED (2025-11-24)

**Implemented Fix:**
- Added check for empty query in handleSearch
- Resets hasSearched, jobs, and events when query is empty
- Returns early to prevent API call
- Search results disappear when user clears the input

---

### **Bug #3: Job Match Shows 0 During Search** 🟡
**File:** `src/components/student/student-home.tsx:89-93`

**Current Code:**
```tsx
<h2 className="...">
    Job Matches
    <span className="...">
        {jobs.length}  {/* Shows 0 while loading */}
    </span>
</h2>
```

**Problem:**
- Counter shows 0 → X instead of loading → X
- Jarring UX during API call

**Fix:**
```tsx
<h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
    Job Matches
    {loading ? (
        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full animate-pulse">
            Searching...
        </span>
    ) : (
        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {jobs.length}
        </span>
    )}
</h2>
```

**Status:** ✅ FIXED (2025-11-24)

**Implemented Fix:**
- Added conditional rendering for loading state
- Shows "Searching..." with pulse animation while loading
- Shows job count when not loading
- Smooth UX transition from loading to results

---

### **Bug #4: External Job Links Not Visible** 🟡

**Problem Areas:**
1. Job cards in search results don't show external link
2. Job detail page hides link in sidebar
3. "Visit Website" is not prominent

**Fix #1 - Add external link icon to job cards:**

**File:** `src/components/search/job-card.tsx`

Add `link` to the Job interface:
```tsx
interface Job {
    id: string;
    title: string;
    company_name: string;
    similarity?: number;
    location_type?: string;
    salary_min?: number;
    salary_max?: number;
    link?: string;  // ADD THIS
}
```

Update JobCard component to show link in badges area:
```tsx
import { ExternalLink } from 'lucide-react';  // Add import

// In CardContent, after salary badge:
{job.link && (
    <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
        onClick={(e) => e.stopPropagation()}  // Prevent card click
    >
        <ExternalLink className="w-3 h-3 mr-1" />
        External Link
    </a>
)}
```

**Fix #2 - Make link prominent on detail page:**

**File:** `src/app/(student)/jobs/[id]/page.tsx`

Move external link button next to "Apply Now":
```tsx
<div className="flex flex-col md:flex-row justify-between items-start gap-6">
    <div>
        <h1>...</h1>
        <div>...</div>
        <div>...</div>
    </div>

    <div className="flex gap-3">
        {job.link && (
            <a href={job.link} target="_blank" rel="noopener noreferrer">
                <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-babson-green-700 text-babson-green-700 hover:bg-babson-green-50 px-8"
                >
                    <Globe className="w-4 h-4 mr-2" />
                    Apply on Company Site
                </Button>
            </a>
        )}
        <Button
            size="lg"
            className="bg-babson-green-700 hover:bg-babson-green-800 text-white shadow-xl shadow-green-700/20 px-8"
            onClick={() => setIsApplyOpen(true)}
        >
            Quick Apply
        </Button>
    </div>
</div>
```

**Status:** ✅ FIXED (2025-11-24)

**Implemented Fixes:**
1. **Job Card (search results):**
   - Added `link` field to Job interface
   - Added ExternalLink icon badge with blue styling
   - Shows external link badge when link exists
   - Click opens in new tab without navigating card

2. **Job Detail Page:**
   - Moved external link button next to "Apply Now"
   - Prominent "Apply on Company Site" button with Globe icon
   - Green outline styling to match brand
   - Responsive layout for mobile

---

## **🔵 MISSING FEATURES (Nice to Have)**

### **Feature #1: Save/Star Jobs** 🔴

**Database Migration Needed:**
```sql
-- supabase/migrations/007_add_saved_jobs.sql
create table saved_jobs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade not null,
  job_id uuid references jobs(id) on delete cascade not null,
  notes text,
  created_at timestamptz default now() not null,
  unique(student_id, job_id)
);

alter table saved_jobs enable row level security;

create policy "saved_jobs_select" on saved_jobs
  for select using (student_id = auth.uid());

create policy "saved_jobs_insert" on saved_jobs
  for insert with check (student_id = auth.uid());

create policy "saved_jobs_delete" on saved_jobs
  for delete using (student_id = auth.uid());

create index idx_saved_jobs_student on saved_jobs(student_id);
create index idx_saved_jobs_job on saved_jobs(job_id);
```

**Status:** ⬜ Not Implemented

---

### **Feature #2: Browse All Jobs Page**

**Create:** `src/app/(student)/jobs/page.tsx`

**Status:** ⬜ Not Implemented

---

## **⚠️ CODE QUALITY ISSUES (Fix If Time Permits)**

### **Issue #1: Replace `any` types**

**Files to Fix:**
- `src/components/student/student-home.tsx:24` - jobs should be `Job[]`
- `src/components/student/student-home.tsx:25` - events should be `Event[]`
- `src/app/(student)/jobs/[id]/page.tsx:18` - job should be `Job | null`

**Create Type Definitions:**
```typescript
// src/types/job.ts
export interface Job {
  id: string;
  title: string;
  company_name: string;
  date_posted: string;
  location_type: 'Virtual' | 'Hybrid' | 'Onsite' | 'On Campus';
  location_specifics: string | null;
  is_paid: boolean;
  babson_connection: string | null;
  link: string | null;
  requirements: string[];
  application_requirements: {
    resume: boolean;
    cover_letter: boolean;
    transcript: boolean;
    portfolio: boolean;
    references: boolean;
    writing_sample: boolean;
  };
  salary_min: number | null;
  salary_max: number | null;
  embedding: number[] | null;
  posted_by: string;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
  similarity?: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  link: string | null;
  description: string | null;
  location_type: 'Onsite' | 'Virtual' | 'Both';
  location_specifics: string | null;
  industry: string | null;
  event_type: 'Networking Event' | 'Employer-Sponsored' | 'Workshop';
  similarity?: number;
}
```

**Status:** ⬜ Not Fixed

---

### **Issue #2: Add Error Boundaries**

**Create:**
- `src/app/error.tsx` - Root error boundary
- `src/app/(student)/error.tsx` - Student routes error boundary
- `src/app/(alumni)/error.tsx` - Alumni routes error boundary

**Status:** ⬜ Not Implemented

---

## **📊 TESTING CHECKLIST (Before Merge)**

### **Manual Testing:**
- [ ] Build passes: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] Can search for jobs successfully
- [ ] Can click on job card and view details
- [ ] Job detail page shows all information correctly
- [ ] External links are visible and clickable
- [ ] Can apply to jobs via modal
- [ ] Applications page loads and displays correctly
- [ ] Can create/edit/delete applications
- [ ] Alumni dashboard works
- [ ] Alumni can post jobs
- [ ] Backspacing in search resets properly
- [ ] Loading states show during search
- [ ] No console errors in browser
- [ ] Mobile responsive works

### **Database Testing:**
- [ ] Migrations run successfully
- [ ] RLS policies work correctly
- [ ] Search returns relevant results
- [ ] Applications save correctly

### **Production Readiness:**
- [ ] Environment variables set
- [ ] No console.log statements in production code
- [ ] Error messages are user-friendly
- [ ] Loading states are smooth
- [ ] No broken images/links

---

## **🚀 MERGE CHECKLIST**

Before merging to main:
- [ ] All critical bugs fixed (marked with 🔴)
- [ ] Build passes without errors
- [ ] Manual testing completed
- [ ] Code committed and pushed to feature branch
- [ ] Pull request created (if using PR workflow)
- [ ] Code reviewed (if applicable)

**Merge Commands:**
```bash
# After all fixes are done:
git add .
git commit -m "fix: resolve all critical UX bugs and improve error handling"
git push origin feature/job-application-tracker

# Then merge to main:
git checkout main
git merge feature/job-application-tracker
git push origin main

# Sync v1:
git checkout v1
git merge main
git push origin v1
```

---

## **📝 NOTES**

- Focus on critical bugs first (marked 🔴)
- Test thoroughly before merging to main
- Main is connected to live website - cannot crash!
- After merge, monitor production for any issues

---

**Last Updated:** [Date]
**Status:** Ready for bug fixes
