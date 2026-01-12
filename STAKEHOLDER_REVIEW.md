# Safha V1 - Stakeholder Review Document

> **Prepared for**: Client Review  
> **Version**: 1.0  
> **Date**: January 12, 2026

---

## 📋 Overview

**Safha** (صفحة - "Page" or "New Beginning" in Arabic) is a volunteer management platform that connects:
- **Volunteers** looking for meaningful opportunities
- **Organizations** seeking reliable volunteers
- **Administrators** who oversee and verify the platform

---

## 🌐 Access URLs

| Environment | URL |
|-------------|-----|
| **Production** | *To be updated after Vercel deployment* |
| **Local Dev** | http://localhost:3000 |

---

## 🔐 Test Accounts

### Admin Account
| Field | Value |
|-------|-------|
| Email | `admin@gmail.com` |
| Password | `ADMINTESTING` |
| Role | Administrator |

### Creating New Accounts
- **Volunteers**: Sign up → Select "Volunteer" → Fill form
- **Organizations**: Sign up → Select "Organization" → Fill form → Complete org setup

---

## 👤 User Roles & Features

### 1. Volunteers

**How to Test:**
1. Create a new account or use Google Sign-In
2. Select "Volunteer" during signup

**Features Available:**

| Feature | Location | Description |
|---------|----------|-------------|
| Dashboard | `/dashboard` | Overview of upcoming shifts, stats, and recommended opportunities |
| Browse Opportunities | `/opportunities` | Search and filter all published volunteer opportunities |
| View Opportunity | Click any opportunity | See full details, location, date, and sign up |
| My Schedule | `/my-schedule` | View registered shifts and calendar |
| Profile | `/profile` | Edit personal information |

**Test Flow:**
1. Browse opportunities
2. Click on one to view details
3. Sign up for a shift (if available)
4. Check "My Schedule" to confirm registration

---

### 2. Organizations

**How to Test:**
1. Create a new account
2. Select "Organization" during signup
3. Complete organization setup wizard

**Features Available:**

| Feature | Location | Description |
|---------|----------|-------------|
| Org Dashboard | `/org` | Overview of upcoming events, volunteer registrations, stats |
| Organization Setup | First login | Set up org name, description, logo, contact info |
| Manage Opportunities | `/org/opportunities` | View all created opportunities |
| Create Opportunity | `/org/opportunities/new` | Create new volunteer events |
| Edit Opportunity | Click any opportunity | Modify details, publish/unpublish |
| Profile | `/profile` | Edit account settings |

**Test Flow:**
1. Complete organization setup (name, description, etc.)
2. Go to "Opportunities" → "Create New"
3. Fill in event details (title, date, location, description, capacity)
4. Save as draft or publish immediately
5. View the opportunity in your list
6. Edit and toggle publish status

**Important Notes:**
- Organizations start as **unverified** (pending admin approval)
- Unverified orgs can create opportunities but may have limited visibility
- Admins can verify organizations from the Admin Portal

---

### 3. Administrators

**How to Test:**
Use the admin credentials provided above.

**Features Available:**

| Feature | Location | Description |
|---------|----------|-------------|
| Admin Dashboard | `/admin` | Platform overview - total users, organizations, pending verifications |
| User Management | `/admin/users` | View all users, filter by role, see registration dates |
| Organization Management | `/admin/organizations` | View all orgs, verify pending organizations |
| Analytics | `/admin/analytics` | Platform health metrics, user growth, verification rates |
| Profile | `/profile` | Edit admin account settings |

**Test Flow:**
1. Login with admin credentials
2. Review dashboard statistics
3. Go to "Organizations" → See pending orgs → Click "Verify" to approve
4. Go to "Users" → Browse and filter users by role
5. Check "Analytics" for platform insights

---

## 🖥️ Landing Page

**URL:** `/` (homepage)

**Sections:**
1. **Hero** - Main headline, CTA buttons (Start Volunteering / Register Your Organization)
2. **Stats** - Platform statistics (volunteers, organizations, hours logged)
3. **How It Works** - 3-step guide (Create Account → Find Opportunities → Make Impact)
4. **Features** - Discover Opportunities, Easy Scheduling, Track Your Impact
5. **For Organizations** - Benefits for nonprofits, signup CTA
6. **Final CTA** - Create Your Free Account
7. **Footer** - Copyright, branding

---

## 🔑 Authentication

**Login Page:** `/login`
**Signup Page:** `/signup`

**Methods Available:**
- ✅ Email/Password
- ✅ Google OAuth (Sign in with Google)


**Security:**
- Password minimum: 8 characters
- Session management via Supabase
- Role-based access control (RBAC)

---

## 📱 Responsive Design

The app is fully responsive:
- **Desktop**: Full sidebar navigation
- **Mobile**: Bottom tab navigation

---

## ⚙️ Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + Google OAuth |
| Hosting | Vercel (recommended) |

---

## 🐛 Known Limitations (V1)

1. **Email Notifications** - Not yet implemented (manual coordination required)
2. **Hours Logging** - Volunteers cannot log hours yet (future feature)
3. **Volunteer Capacity** - Sign-up system is basic (no waitlist)
4. **Search** - Basic keyword search (no advanced filters yet)

---

## ✅ Testing Checklist

### Landing Page
- [ ] All sections load correctly
- [ ] Navigation links work
- [ ] CTAs direct to signup/login

### Authentication
- [ ] Email signup works
- [ ] Google OAuth works
- [ ] Login works
- [ ] "Back to Home" link works

### Volunteer Flow
- [ ] Dashboard loads with stats
- [ ] Can browse opportunities
- [ ] Can view opportunity details
- [ ] Can sign up for opportunity
- [ ] Schedule shows registered shifts

### Organization Flow
- [ ] Org setup wizard works
- [ ] Can create new opportunity
- [ ] Can save as draft
- [ ] Can publish opportunity
- [ ] Opportunity appears in public listing

### Admin Flow
- [ ] Admin dashboard shows correct stats
- [ ] Can view all users
- [ ] Can filter users by role
- [ ] Can view organizations
- [ ] Can verify pending organizations
- [ ] Analytics page loads

---

## 📞 Support

For technical issues during testing, contact the development team.

---

*Document prepared by the Development Team*
