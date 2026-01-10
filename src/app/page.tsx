/**
 * Landing Page
 * 
 * The public-facing homepage for Safha. Designed to be impactful,
 * modern, and conversion-focused without being generic.
 */

import Link from 'next/link'
import { Button } from '@/components/ui'
import {
  Heart,
  Users,
  Calendar,
  ChevronRight,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--bg-primary)/0.8)] backdrop-blur-md border-b border-[hsl(var(--border-subtle))]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-display text-xl text-[hsl(var(--color-primary-600))]">
            صفحة
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors">
              How It Works
            </Link>
            <Link href="#for-orgs" className="text-sm text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))] transition-colors">
              For Organizations
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(var(--color-primary-50))] text-[hsl(var(--color-primary-700))] text-sm font-medium mb-6 animate-fade-in">
            <Heart className="w-4 h-4" />
            Empowering communities together
          </div>

          {/* Main headline */}
          <h1 className="text-display text-4xl sm:text-5xl lg:text-6xl text-[hsl(var(--text-primary))] mb-6 animate-slide-up">
            Find meaningful ways to{' '}
            <span className="text-[hsl(var(--color-primary-600))]">give back</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[hsl(var(--text-secondary))] max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Safha connects passionate volunteers with organizations making real impact.
            Discover opportunities, track your hours, and see the difference you make.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Volunteering
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/signup?role=organization">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Register Your Organization
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--bg-secondary))]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '2,500+', label: 'Active Volunteers', icon: Users },
              { value: '150+', label: 'Partner Organizations', icon: Heart },
              { value: '45K', label: 'Hours Logged', icon: Clock },
              { value: '320+', label: 'Opportunities', icon: Calendar },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-[hsl(var(--color-primary-500))]" />
                <div className="text-display text-2xl sm:text-3xl text-[hsl(var(--text-primary))] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[hsl(var(--text-secondary))]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-display text-3xl sm:text-4xl text-[hsl(var(--text-primary))] mb-4">
              Everything you need to make an impact
            </h2>
            <p className="text-[hsl(var(--text-secondary))] max-w-2xl mx-auto">
              Whether you&apos;re a volunteer looking to help or an organization seeking support,
              Safha provides the tools to connect and collaborate.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-6 rounded-[var(--radius-xl)] bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--color-primary-200))] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-slow)]">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary-50))] flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--color-primary-100))] transition-colors">
                <MapPin className="w-6 h-6 text-[hsl(var(--color-primary-600))]" />
              </div>
              <h3 className="text-heading text-xl mb-2">Discover Opportunities</h3>
              <p className="text-[hsl(var(--text-secondary))]">
                Browse hundreds of volunteer opportunities filtered by location, cause,
                skills, and availability. Find what matches your passion.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-[var(--radius-xl)] bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--color-primary-200))] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-slow)]">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary-50))] flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--color-primary-100))] transition-colors">
                <Calendar className="w-6 h-6 text-[hsl(var(--color-primary-600))]" />
              </div>
              <h3 className="text-heading text-xl mb-2">Easy Scheduling</h3>
              <p className="text-[hsl(var(--text-secondary))]">
                Sign up for shifts, manage your calendar, and get reminders.
                Organizations can easily coordinate volunteers and track attendance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-[var(--radius-xl)] bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-subtle))] hover:border-[hsl(var(--color-primary-200))] hover:shadow-[var(--shadow-lg)] transition-all duration-[var(--transition-slow)]">
              <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[hsl(var(--color-primary-50))] flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--color-primary-100))] transition-colors">
                <TrendingUp className="w-6 h-6 text-[hsl(var(--color-primary-600))]" />
              </div>
              <h3 className="text-heading text-xl mb-2">Track Your Impact</h3>
              <p className="text-[hsl(var(--text-secondary))]">
                Log your hours, earn badges, and visualize your contribution over time.
                See the collective impact of your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[hsl(var(--color-primary-600))]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-display text-3xl sm:text-4xl text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-[hsl(var(--color-primary-100))] mb-8 text-lg">
            Join thousands of volunteers making a difference in their communities.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-[hsl(var(--color-primary-700))] hover:bg-[hsl(var(--color-primary-50))]"
            >
              Create Your Free Account
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[hsl(var(--border-subtle))]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-display text-xl text-[hsl(var(--color-primary-600))]">
              صفحة
            </div>
            <p className="text-sm text-[hsl(var(--text-muted))]">
              © {new Date().getFullYear()} Safha. Built with care for communities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
