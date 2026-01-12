# Safha - Testing Guide

Hey! Here's everything you need to know to test Safha. I'll walk you through what it does, how to use it, and what to look out for.

## What is this app?

Safha is a platform where volunteers can find opportunities and organizations can post them. Think of it like a marketplace connecting people who want to help with nonprofits that need volunteers.

There are three types of users:
- **Volunteers** - People browsing for opportunities to sign up for
- **Organizations** - Nonprofits posting volunteer events
- **Admins** - Us behind the scenes, verifying orgs and managing the platform

## How to access it

Just go to **https://safha-kohl.vercel.app**

## Logging in as Admin

If you want to see the admin side of things:
- Email: admin@gmail.com
- Password: ADMINTESTING

Or create your own volunteer/organization account to test those flows.

---

## Testing as a Volunteer

This is the main user experience. Here's how it works:

1. **Sign up** - Go to the signup page, pick "Volunteer", fill in your info. You can also just click "Continue with Google" if you want to skip the form.

2. **Dashboard** - After logging in, you land on your dashboard. It shows upcoming shifts you've signed up for and some recommended opportunities.

3. **Browse opportunities** - Click "Opportunities" in the sidebar to see what's available. You can search and scroll through events.

4. **Sign up for something** - Click on any opportunity to see the full details (when, where, what you'll do). If there's room, you'll see a button to register.

5. **Check your schedule** - After signing up, go to "My Schedule" to see everything you've committed to.

Things to try:
- Sign up for an opportunity and confirm it shows in your schedule
- Edit your profile
- Browse around and make sure everything loads properly

---

## Testing as an Organization

Organizations post opportunities for volunteers to find. Here's the flow:

1. **Sign up** - Create an account and pick "Organization" as your role.

2. **Set up your org** - You'll immediately get prompted to fill in your organization details (name, description, contact email, etc). This is required before you can do anything else.

3. **Create an opportunity** - Go to Opportunities → Create New. Fill in the event details: title, description, date, location, how many volunteers you need, etc.

4. **Publish or save as draft** - You can save something as a draft if you're not ready to post it publicly yet.

5. **View signups** - When volunteers register, you'll see them listed on the opportunity detail page.

Things to try:
- Create an opportunity and publish it
- Check if it shows up when browsing as a volunteer
- Edit an existing opportunity
- Toggle between draft and published

Note: New organizations start as "unverified". An admin has to verify them before they get full visibility. You'll see this badge in the admin portal.

---

## Testing as an Admin

This is where platform management happens. Log in with the admin credentials above.

**Dashboard** - Quick stats on total users, organizations, and pending verifications.

**Users** - Browse all registered users. You can filter by role (volunteer, organization, admin).

**Organizations** - See all organizations. The main thing here is clicking "Verify" on any pending orgs to approve them.

**Analytics** - Basic metrics and charts showing platform health.

Things to try:
- Create a new organization account, then log in as admin and verify it
- Filter users by role
- Check that the numbers on the dashboard make sense

---

## Authentication

Users can sign up two ways:
- Email and password (standard form)
- Google OAuth (click "Continue with Google")

Both work. Apple sign-in isn't enabled yet since it requires an Apple Developer account.

---

## The Landing Page

The homepage at "/" has a few sections:
- Hero with the main pitch and signup buttons
- Some stats about the platform
- "How it works" explaining the 3-step process
- Features breakdown
- A section specifically for organizations
- Footer

Make sure everything loads and the buttons work.

---

## Known Limitations

These are things we know aren't working yet or are intentionally left for V2:

1. **No email notifications** - When you sign up for an event or an org gets verified, there's no email sent. That's manual for now.

2. **No hours logging** - Volunteers can't track hours they've worked. Coming later.

3. **No waitlist** - If an event is full, you just can't sign up. There's no waitlist queue.

4. **Basic search** - You can search opportunities but there aren't advanced filters (by date, category, etc).

5. **No messaging** - Volunteers and orgs can't message each other through the platform.

---

## Things to Watch For

While testing, keep an eye out for:
- Any buttons that don't work or lead nowhere
- Pages that take too long to load
- Anything that looks broken on mobile
- Error messages that don't make sense
- Places where the design feels off

---

## Quick Checklist

**Landing page**
- Does it load correctly?
- Do all nav links work?
- Do the signup/login buttons work?

**Auth**
- Can you sign up with email?
- Can you sign up with Google?
- Can you log back in?

**Volunteer flow**
- Does the dashboard load?
- Can you browse opportunities?
- Can you sign up for one?
- Does it show in your schedule?

**Org flow**
- Does the setup wizard work?
- Can you create and publish an opportunity?
- Does it appear publicly?

**Admin flow**
- Does the dashboard show stats?
- Can you view/filter users?
- Can you verify an organization?

---

Let me know if you have any questions or run into issues!
