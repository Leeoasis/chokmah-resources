import React, { useState } from "react";
import { Link } from "react-router-dom";

// --- Inline SVG icons (no extra deps) ---
const IconCheck = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
    <path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
  </svg>
);
const IconLightning = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M12 2l7 3v6c0 5.25-3.438 9.969-7 11-3.562-1.031-7-5.75-7-11V5l7-3z" />
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M5 20h14v-2H5v2zM12 2l-5 5h3v6h4V7h3l-5-5z" />
  </svg>
);
const IconReport = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm7 1.5V8h4.5L14 3.5zM8 11h8v1.5H8V11zm0 3h8v1.5H8V14zm0 3h6v1.5H8V17z" />
  </svg>
);
const IconParent = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M8 10a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM2 21v-1a5 5 0 0 1 10 0v1H2zm10 0v-1a5 5 0 0 1 10 0v1H12z"/>
  </svg>
);
const IconLearner = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M2 7l10-4 10 4-10 4L2 7zm3 6v4l7 3 7-3v-4l-7 3-7-3z"/>
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </svg>
);
const IconClose = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
    <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* --- Top Nav --- */}
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-blue-900/80 bg-blue-900/90 border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <img src={process.env.PUBLIC_URL + '/chomah-logo-1-removebg-preview.png'} alt="SPPS Chokmah Logo" className="h-8 w-8 object-contain" />
            <span className="font-extrabold tracking-tight text-lg md:text-xl text-blue-200">SPPS Chokmah <span className="text-blue-400">Parent Portal</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#about" className="hover:text-blue-300 transition">About</a>
            <a href="#features" className="hover:text-blue-300 transition">What you get</a>
            <a href="#benefits" className="hover:text-blue-300 transition">Benefits</a>
            <a href="#workflow" className="hover:text-blue-300 transition">How it works</a>
            <a href="#faq" className="hover:text-blue-300 transition">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-blue-200 hover:text-blue-100 font-semibold">Sign in</Link>
            <Link to="/register" className="bg-blue-400 text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-blue-300 transition">Create Parent Account</Link>
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-gray-900/95 backdrop-blur">
            <div className="px-6 py-4 space-y-4">
              <a href="#about" className="block py-2 hover:text-blue-300 transition" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a href="#features" className="block py-2 hover:text-blue-300 transition" onClick={() => setIsMobileMenuOpen(false)}>What you get</a>
              <a href="#benefits" className="block py-2 hover:text-blue-300 transition" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
              <a href="#workflow" className="block py-2 hover:text-blue-300 transition" onClick={() => setIsMobileMenuOpen(false)}>How it works</a>
              <a href="#faq" className="block py-2 hover:text-blue-300 transition" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <Link to="/login" className="block py-2 text-blue-200 hover:text-blue-100 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Sign in</Link>
                <Link to="/register" className="block bg-blue-400 text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-blue-300 transition text-center" onClick={() => setIsMobileMenuOpen(false)}>Create Parent Account</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO --- */}
      <header className="relative overflow-hidden">
        {/* animated background orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-400/20 blur-3xl"/>
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-[24rem] w-[24rem] rounded-full bg-blue-300/10 blur-3xl"/>

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-wider text-blue-200/90 border border-blue-200/30 rounded-full px-3 py-1 mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"/> Official parent portal for SPPS Chokmah
          </p>
          <h1 className="text-3xl md:text-6xl font-black leading-tight">
            Be informed. <span className="text-blue-400">Support your child.</span>
          </h1>
          <p className="mt-5 text-base md:text-xl text-blue-100 max-w-3xl mx-auto">
            View homework and notes, check term reports, and receive important updates — all in one secure place, on any device.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 text-gray-900 font-semibold hover:shadow-lg hover:shadow-amber-400/20 transition text-center">
              Create Parent Account
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-amber-400 text-amber-300 hover:bg-amber-400/10 transition text-center">
              Sign in
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              {k:"Parents onboarded",v:"1.2k+"},
              {k:"Reports shared",v:"7k+"},
              {k:"Resources posted",v:"10k+"},
              {k:"Active classes",v:"60+"},
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center hover:border-amber-400/40 transition">
                <div className="text-2xl font-extrabold text-amber-400">{s.v}</div>
                <div className="text-xs uppercase tracking-wider text-gray-400">{s.k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* angled divider */}
        <svg viewBox="0 0 1440 80" className="text-gray-900 w-full" preserveAspectRatio="none" aria-hidden>
          <path className="fill-current" d="M0,80 1440,0 1440,80 0,80" />
        </svg>
      </header>

      {/* --- ABOUT --- */}
      <section id="about" className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black">For parents at SPPS Chokmah</h2>
            <p className="mt-3 text-gray-300">
              We’ve made it simple to follow your child’s learning. Access class materials from home, see marks and comments in term reports, and get notified when teachers post something new.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Personalised term reports with marks & teacher comments",
                "Class notes, homework, and study guides in one place",
                "Announcements and key dates from the school",
                "Secure, private access for each parent",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-amber-400 mt-1"><IconCheck/></span>
                  <span className="text-gray-200">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="px-5 py-3 rounded-xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition">Create your account</Link>
              <Link to="/login" className="px-5 py-3 rounded-xl border border-amber-400 text-amber-300 hover:bg-amber-400/10 transition">Sign in</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                {title:"Always up to date",desc:"Get notified when teachers upload new resources."},
                {title:"Everything in one place",desc:"No more hunting across apps and chats."},
                {title:"Clear next steps",desc:"Know what to review before tests and exams."},
                {title:"On any device",desc:"Mobile‑friendly and light on data."},
              ].map((c) => (
                <div key={c.title} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-amber-400/40 transition">
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="mt-1 text-sm text-gray-300">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section id="features" className="bg-gray-900/95">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-black">What you’ll find inside</h2>
            <p className="mt-2 text-gray-300">Everything parents need to stay involved and informed.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon:<IconUpload/>, title:"Homework & notes", desc:"Download class notes, worksheets, and study guides."},
              {icon:<IconReport/>, title:"Term reports", desc:"See marks, teacher comments, and goals for each term."},
              {icon:<IconShield/>, title:"Private & secure", desc:"Only you and authorised staff can view your child’s records."},
              {icon:<IconLightning/>, title:"Fast on mobile", desc:"Optimised for low bandwidth and quick access."},
              {icon:<IconParent/>, title:"Parent timeline", desc:"A clear view of recent uploads and upcoming items."},
              {icon:<IconLearner/>, title:"Learner view", desc:"Your child can access the same resources easily."},
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl border border-white/10 bg-white/[0.06] p-6 hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-400/10 transition">
                <div className="text-amber-400 mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="mt-2 text-gray-300">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENEFITS --- */}
      <section id="benefits" className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-4xl font-black">Why families love it</h2>
            <p className="mt-3 text-gray-300">Real benefits you’ll feel at home.</p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {h:"Clarity",d:"Always know what your child is learning and when."},
              {h:"Consistency",d:"One place for notes, homework, and reports."},
              {h:"Confidence",d:"Support your child with timely, accurate information."},
              {h:"Connection",d:"Stay engaged with the school — on your schedule."},
            ].map((b) => (
              <div key={b.h} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-amber-400"><IconCheck/></div>
                <h3 className="mt-2 font-bold">{b.h}</h3>
                <p className="mt-1 text-gray-300 text-sm">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WORKFLOW / HOW IT WORKS --- */}
      <section id="workflow" className="bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black">Get started in 3 steps</h2>
            <p className="mt-2 text-gray-300">Simple and quick for busy families.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {n:1,t:"Create",d:"Open a parent account with your mobile number or email."},
              {n:2,t:"Link your child",d:"Enter the code from the school to connect to your learner."},
              {n:3,t:"Stay updated",d:"Check notes, homework, and reports — anytime."},
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="absolute -top-3 -left-3 bg-amber-400 text-gray-900 font-extrabold rounded-full w-10 h-10 grid place-items-center shadow">{s.n}</div>
                <h3 className="text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-gray-300">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20">
          <h2 className="text-3xl md:text-4xl font-black text-center">From our parents</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {q:"I finally know exactly what my child is covering each week.",a:"Parent of Grade 7 learner"},
              {q:"Reports online made it easier to help before exams.",a:"Parent of Grade 9 learner"},
              {q:"Fast on my phone and easy to follow.",a:"Parent of Grade 5 learner"},
            ].map((t) => (
              <figure key={t.a} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-amber-400/40 transition">
                <blockquote className="text-gray-200">“{t.q}”</blockquote>
                <figcaption className="mt-4 text-sm text-gray-400">— {t.a}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className="bg-gray-900/95">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20">
          <h2 className="text-3xl md:text-4xl font-black text-center">Frequently asked</h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[{q:"Do I need an email?",a:"No. You can register with your mobile number or email — whichever you prefer."},{q:"Can both parents access?",a:"Yes. Each parent/guardian can have their own login."},{q:"How do I link my child?",a:"Use the code provided by the school during registration."},{q:"What if I forget my password?",a:"Reset it using your phone number or email in minutes."},{q:"Is my data private?",a:"Yes. Only you and authorised staff can view your child’s information."},{q:"Is there a fee?",a:"Access is provided by the school. For details, please check with the office."}].map((f) => (
              <details key={f.q} className="rounded-2xl border border-white/10 bg-white/5">
                <summary className="cursor-pointer select-none px-6 py-4 font-semibold flex items-center justify-between">
                  {f.q}
                  <span className="ml-4 text-amber-400 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div className="px-6 pb-4 text-gray-300">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEWSLETTER / CONTACT --- */}
      <section className="relative bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black">Stay informed</h2>
            <p className="mt-3 text-gray-200">Get important announcements and tips for supporting your child’s learning at SPPS Chokmah.</p>
            <form className="mt-6 flex gap-3 max-w-xl" onSubmit={(e)=>e.preventDefault()}>
              <input type="email" required placeholder="Your email address" className="flex-1 px-4 py-3 rounded-xl bg-gray-900/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/60"/>
              <button className="px-5 py-3 rounded-xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition">Subscribe</button>
            </form>
            <p className="mt-2 text-xs text-gray-400">We respect your privacy. Unsubscribe anytime.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold">Need help?</h3>
            <p className="mt-2 text-gray-300">Contact the school if you need assistance creating an account or linking your child.</p>
            <div className="mt-4 flex gap-3">
              <Link to="/contact" className="px-5 py-3 rounded-xl bg-amber-400 text-gray-900 font-semibold hover:bg-amber-300 transition">Contact school</Link>
              <Link to="/login" className="px-5 py-3 rounded-xl border border-amber-400 text-amber-300 hover:bg-amber-400/10 transition">Parent help</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
