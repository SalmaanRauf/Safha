# Safha V1 — Stakeholder Review Guide

Hey! Thanks for taking the time to review Safha. This document will walk you through everything you need to test the platform.

**Version:** 1.0  
**Last Updated:** January 12, 2026

---

## What is Safha?

Safha (صفحة — meaning "Page" or "New Beginning" in Arabic) is a volunteer management platform that connects three types of users:

- **Volunteers** who want to find meaningful opportunities in their community
- **Organizations** (nonprofits, community groups) looking for reliable volunteers
- **Administrators** who oversee the platform and verify organizations

---

## Where to Access

| Environment | URL |
|-------------|-----|
| **Live Site** | https://safha-kohl.vercel.app |

---

## Test Accounts

### Admin Login
To access the admin portal, use these credentials:

- **Email:** `admin@gmail.com`
- **Password:** `ADMINTESTING`

### Creating Your Own Accounts
Feel free to create test accounts! Just head to the signup page and choose your role:
- Pick **Volunteer** if you want to browse and sign up for opportunities
- Pick **Organization** if you want to post volunteer opportunities

---

## Testing Each User Type

### 🙋 Testing as a Volunteer

**Getting Started:**
1. Go to the site and click "Get Started" or "Sign Up"
2. Choose "Volunteer" as your role
3. Fill out the form (or use "Continue with Google" for faster signup)

**What You Can Do:**
- **Dashboard** — See your upcoming shifts and recommended opportunities at a glance
- **Browse Opportunities** — Search and filter through all available volunteer events
- **View Details** — Click any opportunity to see the full description, date, location, and organization info
- **Sign Up** — Register for opportunities that interest you
- **My Schedule** — Check what you've signed up for
- **Profile** — Edit your personal information

**Try This Flow:**
1. Browse the opportunities page
2. Find something interesting and click on it
3. Sign up for a shift
4. Check "My Schedule" to confirm it's there

---

### 🏢 Testing as an Organization

**Getting Started:**
1. Create a new account and select "Organization"
2. You'll be prompted to set up your organization profile first

**What You Can Do:**
- **Organization Dashboard** — Overview of your events, signups, and quick stats
- **Setup Wizard** — Create your org profile (name, description, contact email, etc.)
- **Create Opportunities** — Post new volunteer events with all the details
- **Manage Opportunities** — Edit existing events, publish/unpublish them, view signups
- **Track Volunteers** — See who's signed up for each event

**Try This Flow:**
1. Complete the organization setup (name, description, contact info)
2. Go to "Opportunities" and create a new one
3. Fill in the event details (title, date, location, how many volunteers needed)
4. Save as draft or publish right away
5. View your opportunity in the list
6. Try editing it and toggling the publish status

**Good to Know:**
- New organizations start as *unverified* (pending admin review)
- Once an admin verifies your org, you'll get a "Verified" badge
- Unverified orgs can still create opportunities, they just might have less visibility

---

### 👩‍💼 Testing as an Admin

**Getting Started:**
Use the admin credentials listed above to log in.

**What You Can Do:**
- **Admin Dashboard** — See platform-wide stats: total users, organizations, pending verifications
- **User Management** — Browse all users, filter by role (volunteer, organization, admin)
- **Organization Management** — View all orgs and verify pending ones
- **Analytics** — Platform health metrics and growth trends

**Try This Flow:**
1. Log in with the admin credentials
2. Check out the dashboard stats
3. Go to "Organizations" and look for any pending verification requests
4. Click "Verify" on an organization to approve them
5. Go to "Users" and try filtering by role
6. Check out the Analytics page

---

## Authentication Options

Users can sign in two ways:

✅ **Email & Password** — Traditional signup/login  
✅ **Google Sign-In** — One-click authentication (configured and working!)

Apple Sign-In is not enabled yet (requires Apple Developer account).

---

## The Landing Page

The public landing page includes:
1. **Hero Section** — Main headline with two CTAs (one for volunteers, one for organizations)
2. **Platform Stats** — Shows volunteer count, organization count, and hours logged
3. **How It Works** — Three-step guide explaining the user journey
4. **Features** — Highlights for discovering opportunities, scheduling, and tracking impact
5. **For Organizations** — Dedicated section explaining benefits for nonprofits
6. **Final CTA** — "Create Your Free Account" button
7. **Footer** — Branding and copyright

---

## What's Working vs. What's Next

### Currently Working ✅
- Full authentication flow (email + Google OAuth)
- Volunteer browsing and signup
- Organization creation and opportunity management
- Admin dashboard with user/org management
- Responsive design (works on mobile and desktop)

### Coming in Future Versions
- Email notifications for signups and reminders
- Hours logging for volunteers
- Waitlist functionality when events are full
- Advanced search filters
- Messaging between orgs and volunteers

---

## Quick Testing Checklist

### Landing Page
- [ ] Page loads with no visual issues
- [ ] Navigation links work correctly
- [ ] CTA buttons lead to signup/login

### Authentication
- [ ] Can sign up with email
- [ ] Can sign in with Google
- [ ] Can log in with existing account
- [ ] "Back to Home" link works

### Volunteer Experience
- [ ] Dashboard shows stats and recommendations
- [ ] Can browse opportunities
- [ ] Can click into opportunity details
- [ ] Can sign up for an opportunity
- [ ] Schedule shows registered events

### Organization Experience
- [ ] Setup wizard works smoothly
- [ ] Can create a new opportunity
- [ ] Can save as draft vs. publish
- [ ] Can edit existing opportunities
- [ ] Can see volunteer signups

### Admin Experience
- [ ] Dashboard shows correct platform stats
- [ ] Can view and filter users by role
- [ ] Can view organizations
- [ ] Can verify pending organizations
- [ ] Analytics page loads

---

## Questions or Issues?

If you run into any bugs or have feedback, just let me know! Happy testing. 🎉
