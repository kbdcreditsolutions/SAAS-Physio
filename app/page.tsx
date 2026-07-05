import Link from "next/link";
import { PulseMark } from "@/components/PulseMark";

const FEATURES = [
  {
    title: "Patient records",
    body: "Clinical notes, packages, invoices and visit history in one chart per patient.",
  },
  {
    title: "Smart scheduling",
    body: "Multi-doctor, multi-branch calendar with instant patient linking.",
  },
  {
    title: "GST invoicing",
    body: "One-click INR invoices with GST, part-payments across cash, UPI and card.",
  },
  {
    title: "Live analytics",
    body: "Revenue, lead conversion, doctor performance and branch health, daily.",
  },
  {
    title: "Attendance",
    body: "Staff attendance by department head. Patient attendance from any chair.",
  },
  {
    title: "Doctor ratings",
    body: "Patient feedback and department-head reviews across nine clinical dimensions.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-sand/80 bg-cream/90 px-6 py-4 backdrop-blur sm:px-10">
        <div className="flex items-center gap-2.5">
          <PulseMark className="h-9 w-9" />
          <div className="leading-tight">
            <div className="font-display text-lg font-medium">PhysioCare</div>
            <div className="font-data text-[10px] uppercase tracking-[0.18em] text-sage">
              Clinic OS
            </div>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm text-ink/70 md:flex">
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#modules" className="hover:text-ink">Modules</a>
          <a href="#pricing" className="hover:text-ink">Pricing</a>
        </nav>
        <Link
          href="/login"
          className="rounded-full bg-forest px-5 py-2 text-sm font-medium text-cream transition hover:bg-forest-deep"
        >
          Sign in
        </Link>
      </header>

      <section className="grid gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <p className="font-data text-xs uppercase tracking-[0.2em] text-clay">
            Built for physiotherapy &amp; wellness clinics
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.08] font-medium sm:text-5xl lg:text-6xl">
            Run your entire clinic —
            <br />
            <em className="italic text-forest">front desk to follow-up.</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            PhysioCare is the multi-branch, multi-tenant workspace for modern
            physiotherapy practices: patients, packages, GST billing, doctor
            performance and marketing return, under one roof.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-full bg-forest px-7 py-3 text-sm font-medium text-cream transition hover:bg-forest-deep"
            >
              Sign in to dashboard
            </Link>
            <a
              href="#features"
              className="rounded-full border border-ink/15 px-7 py-3 text-sm font-medium text-ink transition hover:border-ink/30"
            >
              Explore features
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["6+", "Core modules"],
              ["9", "Rating dimensions"],
              ["∞", "Branches & tenants"],
              ["18%", "GST auto-computed"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-3xl text-forest">{value}</dt>
                <dd className="mt-1 text-xs text-ink/60">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-3xl border border-sand bg-white/70 p-6 shadow-[0_1px_0_0_rgba(20,35,27,0.04)]">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-forest/10 px-3 py-1 font-data text-[10px] uppercase tracking-widest text-forest">
              Live clinic
            </span>
            <PulseMark className="h-6 w-6" animate />
          </div>
          <p className="mt-4 font-display text-lg">Sunrise Physiotherapy, Bengaluru</p>
          <p className="mt-1 text-sm text-ink/50">Today&apos;s revenue</p>
          <p className="mt-1 font-data text-4xl font-semibold text-ink">
            ₹42,380
          </p>
          <p className="mt-1 text-sm text-forest">↑ 18% vs yesterday</p>
          <svg viewBox="0 0 300 70" className="mt-6 w-full">
            <path
              d="M0 50 L30 46 L60 52 L90 30 L120 38 L150 20 L180 28 L210 15 L240 22 L270 10 L300 18"
              fill="none"
              stroke="var(--forest)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </section>

      <section id="features" className="border-t border-sand bg-white/40 px-6 py-20 sm:px-10">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-clay">Product</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium sm:text-4xl">
          Everything a modern physiotherapy clinic needs.
        </h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Replace spreadsheets, chat groups and paper receipts with one
          workspace for patients, staff, marketing and revenue.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-sand bg-cream p-6">
              <h3 className="font-display text-lg">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="modules" className="border-t border-sand px-6 py-20 sm:px-10">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-clay">
          Multi-tenant · Multi-branch
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-medium sm:text-4xl">
          Built for franchises &amp; chains.
        </h2>
        <p className="mt-4 max-w-2xl text-ink/70">
          Every clinic is isolated behind its own tenant. Head office rolls up
          branch-level revenue. Onboard a new clinic in under a minute with
          role-based access, an audit trail and soft-delete from day one.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Indiranagar", "₹1.8L", "142 pts"],
            ["Koramangala", "₹0.9L", "84 pts"],
            ["HSR (soon)", "—", "—"],
          ].map(([branch, revenue, pts]) => (
            <div key={branch} className="rounded-2xl border border-sand bg-white/50 p-6">
              <p className="font-display text-lg">{branch}</p>
              <p className="mt-3 font-data text-2xl text-forest">{revenue}</p>
              <p className="mt-1 text-xs text-ink/50">{pts}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-t border-sand bg-forest px-6 py-20 text-cream sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            Your clinic. Simplified.
          </h2>
          <p className="mt-4 text-cream/75">
            Sign in with the demo credentials to explore a fully seeded clinic.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-full bg-cream px-8 py-3 text-sm font-medium text-forest-deep transition hover:bg-cream/90"
          >
            Sign in to demo
          </Link>
          <p className="mt-4 font-data text-xs text-cream/50">
            Use admin@sunrisephysio.in / Admin@123
          </p>
        </div>
      </section>

      <footer className="border-t border-sand px-6 py-8 text-center text-xs text-ink/50 sm:px-10">
        © {new Date().getFullYear()} PhysioCare — Clinic OS for physiotherapy practices.
      </footer>
    </div>
  );
}
