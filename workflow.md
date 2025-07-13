# 🛠️ Git Workflow Rules & Commit Guide

## 1. Branching Strategy

1.  Branching Strategy
    Every new feature, bug fix, or task must be developed in its own branch.

2.  Branch names must be descriptive and use bab-case (lowercase with -):

```
feature/user-authentication

fix/login-validation-error

chore/update-dependencies
```

## 🚀 2. Steps to Add a New Feature

- ✅ Create a new branch from main:

```
git checkout main

git pull origin main

git checkout -b feature/your-feature-name
```

### Work on your feature:

- **Make your changes and commit regularly using the commit rules below.**

## ✅ Add & Commit:

```
git add .

git commit -m "feat: Add user login form with validation"
```

## 🧾 3. Commit Message Rules

### Use this format for clear and consistent commits:

```
<type>: <short message>

# types:
feat     → New feature
fix      → Bug fix
docs     → Documentation update
style    → Code formatting (no logic change)
refactor → Code change (no feature/bug)
test     → Adding or updating tests
chore    → Maintenance tasks (build, deps)

```

# 🔀 4. Merging Feature Branch to Main

### After testing and completing the feature:

🔁 Switch to main and pull the latest changes:

```
git checkout main

git pull origin main
```

🔀 Merge your branch:

```
git merge feature/your-feature-name
```

🚀 Push updated main to remote:

```
git push origin main
```

# 🧹 5. Clean Up (Optional)

### Delete the merged branch:

```
git branch -d feature/your-feature-name       # local

git push origin --delete feature/your-feature-name   # remote
```

# ✅ Example Full Flow

```
git checkout main
git pull origin main
git checkout -b feature/add-payment-screen

# make changes...
git add .
git commit -m "feat: Add payment screen with invoice details"

git checkout main
git pull origin main
git merge feature/add-payment-screen
git push origin main

git branch -d feature/add-payment-screen
git push origin --delete feature/add-payment-screen

```
