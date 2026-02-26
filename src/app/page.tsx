export const dynamic = "force-dynamic";
import Link from "next/link";
import { Zap, Home, Car, FileText, Instagram, Mail, CheckCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Home,
    title: "Real Estate Listings",
    desc: "Turn property specs into compelling MLS descriptions, social posts, and email campaigns instantly.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Car,
    title: "Vehicle Inventory",
    desc: "Input VIN, year, make, and model — get dealer-quality ad copy, social content, and video scripts.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    icon: FileText,
    title: "8 Content Formats",
    desc: "Listing descriptions, Instagram captions, Facebook posts, email campaigns, SMS blasts, video scripts, and more.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Instagram,
    title: "Social Media Ready",
    desc: "Platform-optimized content for Instagram, Facebook, Twitter/X — with hashtags and CTAs built in.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Mail,
    title: "Email & SMS",
    desc: "Ready-to-send email campaigns and SMS blasts with subject lines, hooks, and clean formatting.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Zap,
    title: "5 Tones",
    desc: "Professional, Casual, Luxury, Energetic, Friendly — match your brand voice with a single click.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Try it out",
    features: ["10 generations/mo", "Properties & vehicles", "3 content formats", "Copy & export"],
    cta: "Get started free",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$49",
    period: "/mo",
    desc: "For solo agents & dealers",
    features: ["100 generations/mo", "All 8 content formats", "All 5 tones", "Content library", "Priority support"],
    cta: "Start free trial",
    href: "/sign-up",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    desc: "Teams & high volume",
    features: ["Unlimited generations", "Team workspace", "API access", "Custom tone training", "White-label option"],
    cta: "Contact sales",
    href: "/sign-up",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white">
            Auto<span className="text-indigo-400">Content</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="btn-ghost text-sm">Sign in</Link>
          <Link href="/sign-up" className="btn-primary text-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
          <Zap className="w-3.5 h-3.5" /> Powered by Grok
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
          AI content for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            real estate & auto
          </span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
          Turn property listings and vehicle inventory into professional social posts, email campaigns,
          ad copy, and video scripts — in seconds, not hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up" className="btn-primary text-base px-6 py-3 gap-2">
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/sign-in" className="btn-ghost text-base px-6 py-3">
            Sign in to your account
          </Link>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-4">No credit card required · 10 free generations</p>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Everything you need to close faster</h2>
          <p className="text-[var(--text-secondary)]">One platform for all your listing and inventory content.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="glass-card p-6 space-y-3">
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">Simple pricing</h2>
          <p className="text-[var(--text-secondary)]">Start free. Scale as you grow.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-6 flex flex-col gap-5 ${
                plan.highlight ? "border-indigo-500/40 ring-1 ring-indigo-500/20" : ""
              }`}
            >
              {plan.highlight && (
                <div className="badge-blue w-fit">Most Popular</div>
              )}
              <div>
                <p className="text-sm text-[var(--text-muted)]">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-[var(--text-muted)]">{plan.period}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{plan.desc}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={plan.highlight ? "btn-primary justify-center" : "btn-ghost justify-center border border-[var(--border)]"}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="glass-card max-w-2xl mx-auto p-12 space-y-5">
          <Zap className="w-10 h-10 text-indigo-400 mx-auto" />
          <h2 className="text-3xl font-bold text-white">Ready to generate your first listing?</h2>
          <p className="text-[var(--text-secondary)]">Join real estate agents and car dealers already saving hours every week.</p>
          <Link href="/sign-up" className="btn-primary text-base px-8 py-3 mx-auto inline-flex gap-2">
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
        © {new Date().getFullYear()} AutoContent. Built by OpenClaw.
      </footer>
    </div>
  );
}
