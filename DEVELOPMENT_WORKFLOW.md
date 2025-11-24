# 🚀 DEVELOPMENT WORKFLOW - BABSON JOB PORTAL

## **Current Strategy: Feature Branch → Main → V1**

Since `main` is connected to a live production website, we follow this safe workflow:

```
feature/job-application-tracker (DEV)
    ↓ (after testing)
main (PRODUCTION)
    ↓ (sync)
v1 (BACKUP)
```

---

## **📋 STEP-BY-STEP WORKFLOW**

### **Phase 1: Fix All Bugs in Feature Branch** ✅ CURRENT PHASE

**Branch:** `feature/job-application-tracker`

**Status:** ✅ Build passes, feature complete, but has UX bugs

**Action Items:**
1. Fix Bug #1: Blank screen on job detail
2. Fix Bug #2: Search backspace reset
3. Fix Bug #3: Loading state for job count
4. Fix Bug #4: External links visibility
5. (Optional) Add save/star jobs feature
6. (Optional) Add browse all jobs page

**How to Work:**
```bash
# Make sure you're on feature branch
git checkout feature/job-application-tracker

# Make your fixes
# ... edit files ...

# Test locally
npm run dev
# Visit http://localhost:3000 and test all features

# Build to check for errors
npm run build

# Commit your changes
git add .
git commit -m "fix: [describe what you fixed]"

# Push to remote (optional, for backup)
git push origin feature/job-application-tracker
```

**Testing Checklist:**
- [ ] npm run build passes without errors
- [ ] npm run dev runs successfully
- [ ] Can search for jobs
- [ ] Can click job cards and view details
- [ ] External links visible and working
- [ ] Can apply to jobs
- [ ] Applications page works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Alumni features work

**Reference:** See `BUG_FIXES_CHECKLIST.md` for detailed fixes

---

### **Phase 2: Merge to Main (Production)**

**⚠️ ONLY AFTER ALL TESTS PASS!**

**Prerequisites:**
- ✅ All critical bugs fixed
- ✅ Build passes
- ✅ Manual testing complete
- ✅ No console errors
- ✅ Ready for production

**Merge Commands:**
```bash
# 1. Make sure feature branch is clean and committed
git checkout feature/job-application-tracker
git status  # Should show "nothing to commit, working tree clean"

# 2. Switch to main
git checkout main

# 3. Pull latest changes (in case someone else pushed)
git pull origin main

# 4. Merge feature branch
git merge feature/job-application-tracker

# 5. If merge successful, push to production
git push origin main

# 6. IMMEDIATELY test production site
# Visit your live website and verify everything works
```

**Post-Merge Monitoring:**
- [ ] Website loads correctly
- [ ] Search functionality works
- [ ] Job details page works
- [ ] Applications feature works
- [ ] No errors in production console
- [ ] No user complaints

**Rollback Plan (if something breaks):**
```bash
# Find the last good commit
git log --oneline -5

# Revert to previous commit (replace COMMIT_HASH)
git revert HEAD
# OR
git reset --hard <COMMIT_HASH>
git push origin main --force

# This restores the site to working state
```

---

### **Phase 3: Sync v1 Branch**

**After main is deployed and verified:**

```bash
# 1. Switch to v1
git checkout v1

# 2. Pull latest v1
git pull origin v1

# 3. Merge main into v1
git merge main

# 4. Push v1
git push origin v1
```

**Why sync v1:**
- Keeps v1 as a backup/mirror of main
- Ensures all branches have same code
- Historical reference

---

## **🔄 ONGOING DEVELOPMENT WORKFLOW**

### **For New Features:**

```bash
# 1. Create a new feature branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature-name

# 2. Develop and test
# ... make changes ...
git add .
git commit -m "feat: add new feature"

# 3. Push feature branch
git push origin feature/new-feature-name

# 4. Test thoroughly

# 5. Merge to main (after testing)
git checkout main
git merge feature/new-feature-name
git push origin main

# 6. Sync v1
git checkout v1
git merge main
git push origin v1

# 7. Delete feature branch (cleanup)
git branch -d feature/new-feature-name
git push origin --delete feature/new-feature-name
```

---

### **For Bug Fixes (Hotfix):**

**If production is broken and needs immediate fix:**

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/urgent-bug-fix

# 2. Fix the bug quickly
# ... make minimal changes ...

# 3. Test the fix
npm run build
npm run dev

# 4. Commit and merge immediately
git add .
git commit -m "hotfix: fix urgent production bug"
git checkout main
git merge hotfix/urgent-bug-fix
git push origin main

# 5. Sync v1
git checkout v1
git merge main
git push origin v1

# 6. Delete hotfix branch
git branch -d hotfix/urgent-bug-fix
```

---

## **📊 BRANCH OVERVIEW**

### **main**
- **Purpose:** Production code (live website)
- **Rules:**
  - NEVER commit directly to main
  - ONLY merge tested feature branches
  - ALWAYS test after merge
  - Keep clean and stable
- **Protected:** Yes - linked to live site

### **v1**
- **Purpose:** Backup/mirror of main
- **Rules:**
  - Always synced with main
  - Can be used for testing if needed
  - Historical reference
- **Protected:** No

### **feature/***
- **Purpose:** Development branches for new features
- **Rules:**
  - Create from main
  - Test thoroughly before merging
  - Delete after successful merge
- **Protected:** No

---

## **🛠️ USEFUL GIT COMMANDS**

### **View Status:**
```bash
# See current branch and changes
git status

# See branch list
git branch -a

# See commit history
git log --oneline --graph --all -10

# See differences between branches
git diff main..feature/job-application-tracker
```

### **Undo Changes:**
```bash
# Undo uncommitted changes (dangerous!)
git restore .

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Stash changes temporarily
git stash
git stash pop  # Bring changes back
```

### **Branch Management:**
```bash
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Delete branch
git branch -d feature/old-feature

# Rename branch
git branch -m old-name new-name
```

---

## **⚠️ SAFETY RULES**

### **DO:**
- ✅ Always test in feature branch first
- ✅ Run `npm run build` before merging
- ✅ Commit frequently with clear messages
- ✅ Test production site immediately after merge
- ✅ Keep main stable and working

### **DON'T:**
- ❌ Never commit directly to main
- ❌ Never push untested code to main
- ❌ Never use `--force` on main (except emergency rollback)
- ❌ Never merge with build errors
- ❌ Never skip testing before merge

---

## **📝 COMMIT MESSAGE CONVENTIONS**

Use clear, descriptive commit messages:

```bash
# Feature additions
git commit -m "feat: add job bookmarking feature"

# Bug fixes
git commit -m "fix: resolve search reset issue on backspace"

# Documentation
git commit -m "docs: update API documentation"

# Refactoring
git commit -m "refactor: extract duplicate auth logic to hook"

# Styling
git commit -m "style: improve job card hover animation"

# Performance
git commit -m "perf: optimize job search query"

# Tests
git commit -m "test: add unit tests for job application form"
```

---

## **🆘 TROUBLESHOOTING**

### **Problem: Merge Conflicts**
```bash
# If merge has conflicts:
git status  # Shows conflicted files

# Edit files to resolve conflicts
# Look for <<<<<<< HEAD markers

# After fixing:
git add .
git commit -m "resolve: merge conflicts"
```

### **Problem: Build Fails After Merge**
```bash
# Rollback merge
git reset --hard HEAD~1

# Fix issues in feature branch
git checkout feature/job-application-tracker
# ... fix build errors ...
npm run build  # Verify it works

# Try merge again
git checkout main
git merge feature/job-application-tracker
```

### **Problem: Production Site Broken**
```bash
# IMMEDIATE ROLLBACK
git checkout main
git log --oneline -5  # Find last good commit
git reset --hard <LAST_GOOD_COMMIT>
git push origin main --force

# Site should be restored now
```

---

## **📚 RESOURCES**

- **Codebase Analysis:** See `CODEBASE_ANALYSIS.md`
- **Bug Fixes:** See `BUG_FIXES_CHECKLIST.md`
- **Git Documentation:** https://git-scm.com/doc
- **Next.js Docs:** https://nextjs.org/docs

---

## **✅ CURRENT STATUS**

**Active Branch:** `feature/job-application-tracker`
**Build Status:** ✅ Passing
**Ready for Production:** ⬜ No - bugs need fixing first
**Next Steps:** Fix critical UX bugs (see BUG_FIXES_CHECKLIST.md)

---

**Last Updated:** 2025-11-24
**Maintained By:** Development Team
