import {
  ArrowRight,
  ShieldCheck,
  QrCode,
  Ban,
  CreditCard,
  Sparkles,
  Zap,
  Users2,
  Smartphone
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-spotify-black text-white relative overflow-hidden font-sans">
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="grainy">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainy)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-spotify-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-extrabold tracking-wider text-white">MANDALA</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-spotify-light-gray">
            <a href="#who-it-s-built-for" className="hover:text-white transition duration-200">Our Belief</a>
            <a href="#features" className="hover:text-white transition duration-200">Features</a>
            <a href="#how-it-works" className="hover:text-white transition duration-200">How It Works</a>
            <a href="mailto:hello@mandala.com" className="hover:text-white transition duration-200">Contact</a>
          </div>
          <div>
            <a href="/redirect" className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-medium rounded-full text-xs tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 backdrop-blur-md">
              Download App <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden min-h-[92vh] flex flex-col justify-between items-center max-w-7xl mx-auto w-full z-10">
        {/* Background Gradients (Fluid Gradient matching the design image) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-spotify-black">
          {/* Top-Left: Deep teal/forest green */}
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] bg-[#042f1a] rounded-full blur-[120px] opacity-90" />

          {/* Middle-Left: Vibrant Spotify Green / Emerald sweep */}
          <div className="absolute top-[15%] -left-[20%] w-[65%] h-[70%] bg-spotify-green rounded-full blur-[130px] opacity-85" />

          {/* Bottom-Left: Soft yellow-green / olive tint */}
          <div className="absolute -bottom-[10%] -left-[10%] w-[55%] h-[60%] bg-[#3f6212] rounded-full blur-[120px] opacity-75" />

          {/* Center-Left: Pale mint green / light cyan highlight */}
          <div className="absolute top-[10%] left-[10%] w-[60%] h-[80%] bg-[#a7f3d0]/65 rounded-full blur-[120px] opacity-90 mix-blend-screen" />

          {/* Center-Core: Ethereal light pastel green/white glow */}
          <div className="absolute top-[25%] left-[5%] w-[45%] h-[50%] bg-[#f0fdf4]/50 rounded-full blur-[90px] opacity-95 mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />

          {/* Right: Radial Black Mask creating the crescent sweep */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_95%_50%,_#191414_0%,_#191414_35%,_transparent_90%)] opacity-100" />
        </div>

        {/* Content Box */}
        <div className="text-center space-y-9 max-w-5xl mx-auto z-10 relative">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-white/80 font-medium tracking-wider uppercase">
            A circle, not a crowd.
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl font-normal leading-[1.1] text-[#E7F3E2] tracking-tight max-w-4xl mx-auto">
            Connect the circles <br />
            <span className="italic font-light tracking-wide text-white">not the world</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-spotify-light-gray max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            Mandala is a sealed space for the people you already trust, and the few you&apos;re letting in next. No discovery feed. No strangers. Just the circle you chose, on purpose.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="/mandala.apk"
              download="mandala.apk"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              Download for Android <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-spotify-light-gray font-medium mt-2">iOS Version Coming Soon</p>
        </div>

        {/* Statistics Block */}
        <div className="grid grid-cols-3 gap-8 pt-20 border-t border-white/5 max-w-4xl mx-auto w-full z-10 relative mt-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-[#E7F3E2] tracking-tight">100%</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1.5">Private & Secure</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-[#E7F3E2] tracking-tight">0</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1.5">Algorithms & Feeds</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-[#E7F3E2] tracking-tight pt-1">Circles</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1.5">Not Crowds</div>
          </div>
        </div>
      </section>

      {/* Who It's Built For Section */}
      <section id="who-it-s-built-for" className="py-24 px-6 max-w-6xl mx-auto relative z-10 border-t border-spotify-dark-gray/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-spotify-green mb-3">Designed with Intention</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Who is Mandala built for?</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-4">
              <div className="text-spotify-green text-3xl font-light font-mono">01</div>
              <h4 className="text-xl font-bold text-white">The ones who already found their circle.</h4>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                Family. The few friends who&apos;d actually show up. The handful of colleagues you&apos;d trust with anything. You don&apos;t need more connections, you need one place where the people you already trust don&apos;t get drowned out by ads, feeds, and strangers.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-4">
              <div className="text-spotify-green text-3xl font-light font-mono">02</div>
              <h4 className="text-xl font-bold text-white">The ones meeting theirs one room at a time.</h4>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                New to a city, at a conference, deep in a collaboration that&apos;s actually going somewhere, the kind of person you click with the moment you&apos;re standing in front of them. Mandala exists for exactly the minute after that: scan a code, send an invite, keep the thread going without turning them into someone you just &ldquo;follow.&rdquo;
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-4">
              <div className="text-spotify-green text-3xl font-light font-mono">03</div>
              <h4 className="text-xl font-bold text-white">The ones done mistaking attention for connection.</h4>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                If watching someone&apos;s reels for two years without ever actually talking to them counts as staying in touch, something is broken. There&apos;s no feed on Mandala to hide behind. If you want to know how someone&apos;s doing, you talk to them. That&apos;s it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Name Origin Quote Banner */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative z-10 border-t border-spotify-dark-gray/20">
        <div className="text-xl md:text-2xl font-light text-[#E7F3E2]/80 italic max-w-3xl mx-auto leading-relaxed">
          &ldquo;A mandala is a small circle that contains an entire universe. We built Mandala because we believe your close circle is your entire universe.&rdquo;
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-spotify-dark-gray/40 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">Features, Reframed</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <ShieldCheck className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Sealed Network</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">Most networks confuse reach with relationship. Mandala doesn&apos;t. Nobody finds you by searching, guessing, or syncing your number. Only the people you&apos;ve actually connected with, by a scan, an invite, a real moment between you, can ever reach you.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <QrCode className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">QR Code & Invite Links</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">The strongest threads always start in person: a conference, a dinner, an introduction that actually went somewhere. So that&apos;s the only way into Mandala, too. Scan a code or send a link the moment after you&apos;ve already decided, in the room, that someone&apos;s worth keeping.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <Ban className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">No Search, No Discovery</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">A search bar is an invitation for the wrong kind of connection: the kind where someone finds your name and calls it a relationship without ever standing in front of you. We didn&apos;t add a search bar to Mandala. We removed the one everyone else has.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <CreditCard className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Digital Business Card</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">A first introduction matters. Your Mandala profile works like a card you hand someone once, your name, your work, a few honest lines about who you are. Not a public page anyone can stumble onto by typing your name into a search engine.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <Sparkles className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">100% Genuine</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">Bots can fake a follower count. They can&apos;t fake a friend. Every person on Mandala is there because someone they actually know let them in. No exceptions.</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <Zap className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Attention Focused</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">We&apos;re not trying to keep you on Mandala longer. If anything, we&apos;re hoping you&apos;re here for less time, because the conversation that mattered already happened, and you should go live it.</p>
          </div>

          {/* Highlighted Feature 7 (Human Referrals) */}
          <div className="lg:col-span-3 bg-white/5 backdrop-blur-md border border-spotify-green/20 p-8 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-spotify-green/45 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="flex items-center gap-3">
                <Users2 className="w-8 h-8 text-spotify-green" />
                <h3 className="text-xl font-bold text-white">Human Referrals</h3>
              </div>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                A circle grows by trust, not search indexing. Mandala lets you introduce people you trust to one another, keeping the network high-fidelity and secure through genuine human referrals rather than cold search bars.
              </p>
            </div>
            <div className="px-4 py-2 bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
              Trust-First
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto border-t border-spotify-dark-gray/40 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">How It Works</h2>

        <div className="space-y-8 max-w-3xl mx-auto">
          {/* How It Works Card 1 */}
          <div className="flex gap-8 items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition duration-300">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">1</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Build your card</h3>
              <p className="text-spotify-light-gray text-base font-light">Add your name, what you do, and a few lines that actually sound like you. This is your one true profile, no separate bio, no separate about page.</p>
            </div>
          </div>

          {/* How It Works Card 2 */}
          <div className="flex gap-8 items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition duration-300">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">2</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Share your code</h3>
              <p className="text-spotify-light-gray text-base font-light">One QR code, one invite link. Showing it or sending it is the connection request. There&apos;s no follow button, because there&apos;s nothing to follow.</p>
            </div>
          </div>

          {/* How It Works Card 3 */}
          <div className="flex gap-8 items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition duration-300">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">3</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">They&apos;re in</h3>
              <p className="text-spotify-light-gray text-base font-light">When someone scans your code or accepts your invite, you&apos;re both inside the same sealed circle, visible to each other, invisible to everyone else.</p>
            </div>
          </div>

          {/* How It Works Card 4 */}
          <div className="flex gap-8 items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition duration-300">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">4</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Talk like it matters</h3>
              <p className="text-spotify-light-gray text-base font-light">No feed to scroll past first. No algorithm deciding who you see. Just the conversation you came here for.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center border-t border-spotify-dark-gray/40 relative z-10">
        <h2 className="text-4xl font-extrabold mb-8 tracking-tight">Your circle is waiting.<br />The rest of the world can wait longer.</h2>
        <p className="text-xl text-spotify-light-gray mb-12 font-light">Mandala isn&apos;t built for everyone. If that sentence didn&apos;t put you off, it&apos;s probably built for you.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/mandala.apk"
            download="mandala.apk"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10 text-lg"
          >
            <Smartphone className="w-5 h-5" />
            Download for Android
          </a>
          <a
            href="mailto:santoshpatil@joinmandala.in"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-200 text-lg flex items-center justify-center backdrop-blur-md"
          >
            Contact Us
          </a>
        </div>
        <p className="text-sm text-spotify-light-gray mt-4">iOS App Coming Soon</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-spotify-dark-gray/65 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-spotify-light-gray text-xs flex flex-col items-center gap-4">
          <div className="text-xs uppercase font-extrabold tracking-widest text-[#E7F3E2] opacity-70">
            A circle, not a crowd.
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-6 h-6 object-contain opacity-55 hover:opacity-100 transition" />
          <p>&copy; 2026 Mandala. All rights reserved. | <a href="#" className="hover:text-spotify-green transition duration-150">Privacy</a> | <a href="#" className="hover:text-spotify-green transition duration-150">Terms</a></p>
        </div>
      </footer>
    </div>
  );
}
