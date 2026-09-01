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
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Jana.png" alt="Jana Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-extrabold tracking-wider text-white">JANA</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-spotify-light-gray">
            <a href="#philosophy" className="hover:text-white transition duration-200">Philosophy</a>
            <a href="#features" className="hover:text-white transition duration-200">How It Works</a>
            <a href="#why-it-matters" className="hover:text-white transition duration-200">Why It Matters</a>
            <a href="/support" className="hover:text-white transition duration-200">Support</a>
          </div>
          <div>
            <a href="/redirect" className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-medium rounded-full text-xs tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 backdrop-blur-md">
              Get Jana <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden min-h-[92vh] flex flex-col justify-between items-center w-full z-10">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-spotify-black">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] bg-[#051b40] rounded-full blur-[120px] opacity-90" />
          <div className="absolute top-[15%] -left-[20%] w-[65%] h-[70%] bg-spotify-green rounded-full blur-[130px] opacity-85" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[55%] h-[60%] bg-[#1e1b4b] rounded-full blur-[120px] opacity-75" />
          <div className="absolute top-[10%] left-[10%] w-[60%] h-[80%] bg-[#93c5fd]/65 rounded-full blur-[120px] opacity-90 mix-blend-screen" />
          <div className="absolute top-[25%] left-[5%] w-[45%] h-[50%] bg-[#eff6ff]/50 rounded-full blur-[90px] opacity-95 mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_95%_50%,_#191414_0%,_#191414_35%,_transparent_90%)] opacity-100" />
        </div>

        {/* Content Box */}
        <div className="text-center space-y-9 max-w-5xl mx-auto z-10 relative">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs text-white/80 font-medium tracking-wider uppercase">
            Focus on who matters.
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-normal leading-[1.1] text-[#E2F1FF] tracking-tight max-w-4xl mx-auto">
            Life got loud. <br />
            <span className="italic font-light tracking-wide text-white">Make it quiet again.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-spotify-light-gray max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            You already know who deserves your time. Jana is the only space that keeps them close and everything else out. No feeds. No algorithms. No strangers. Just the people you chose, on purpose.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.india.jana"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 2.056A1.996 1.996 0 0 0 3 3.563v16.874c0 .59.26 1.127.674 1.503l.06.054L15.02 12 3.67 2l-.061.056zM18.064 9.87l-3.037 3.036 3.038 3.038 4.269-2.436c1.171-.667 1.171-2.507 0-3.175l-4.27-2.463zM4.774 2.89l10.21 10.21 3.08-3.08L4.774 2.89zm0 18.22l13.29-7.574-3.08-3.08-10.21 10.654z" />
              </svg>
              Download for Android
            </a>
            <a
              href="https://apps.apple.com/us/app/jana-mandala/id6785388442"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
              </svg>
              Download for iOS
            </a>
          </div>
        </div>

        {/* Statistics Block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4 pt-20 border-t border-white/5 max-w-4xl mx-auto w-full z-10 relative mt-16">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-[#E2F1FF] tracking-tight">Zero</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1.5">Distractions</div>
          </div>
          <div className="text-center border-t border-white/5 sm:border-t-0 pt-6 sm:pt-0">
            <div className="text-4xl md:text-5xl font-extrabold text-[#E2F1FF] tracking-tight">Only</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1.5">People You Chose</div>
          </div>
          <div className="text-center border-t border-white/5 sm:border-t-0 pt-6 sm:pt-0">
            <div className="text-3xl md:text-4xl font-extrabold text-[#E2F1FF] tracking-tight pt-1">Direction</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1.5">Not Noise</div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 px-6 max-w-6xl mx-auto relative z-10 border-t border-spotify-dark-gray/40">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-spotify-green mb-3">The Quiet Truth</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">You already know what you want.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-4">
              <div className="text-spotify-green text-3xl font-light font-mono">01</div>
              <h4 className="text-xl font-bold text-white">Life got loud. Not because the world changed.</h4>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                Because you started giving a little of yourself to everything. A little time here. A little energy there. Until you stopped noticing where it was all going. Every notification, every scroll, every stranger in your feed — pulling you a little further from the people who actually matter.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-4">
              <div className="text-spotify-green text-3xl font-light font-mono">02</div>
              <h4 className="text-xl font-bold text-white">The ones who move forward aren&apos;t smarter.</h4>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                They just stopped spreading themselves thin. They chose what to look at. What to spend time on. Who to keep close. That&apos;s it. Not a productivity hack, not a morning routine — a decision about where their attention goes, and who gets to shape their direction.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-4">
              <div className="text-spotify-green text-3xl font-light font-mono">03</div>
              <h4 className="text-xl font-bold text-white">The people around you were never just people.</h4>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                They were direction. Every room you sat in. Every voice you let in. Was quietly shaping who you were becoming. Jana exists because your circle shouldn&apos;t be decided by an algorithm — it should be decided by you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative z-10 border-t border-spotify-dark-gray/20">
        <div className="text-xl md:text-2xl font-light text-[#E2F1FF]/80 italic max-w-3xl mx-auto leading-relaxed">
          &ldquo;Somewhere, there&apos;s a version of you that isn&apos;t pulled in ten directions. That version only shows up when everything else goes quiet.&rdquo;
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto border-t border-spotify-dark-gray/40 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">What Jana Removes — And Why</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <ShieldCheck className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Sealed By Design</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">Nobody stumbles into your space. No one finds you by searching, guessing, or syncing contacts. The only people who can ever reach you are the ones you personally let in — through a scan, an invite, a real moment between you.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <QrCode className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Connections Start In Person</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">The best relationships don&apos;t start with a follow request. They start with eye contact, a handshake, a conversation that actually meant something. Jana only lets people in after that moment — through a QR scan or a direct invite.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <Ban className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">No Search. On Purpose.</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">A search bar invites the wrong kind of connection — the kind where someone finds your name and calls it a relationship without ever standing in front of you. We didn&apos;t forget the search bar. We removed it deliberately.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <CreditCard className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Your Card. Not Your Page.</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">Your Jana profile is a card you hand someone once — your name, what you do, a few honest lines about who you are. Not a public page anyone can stumble onto. Not a performance. Just an introduction you control.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <Sparkles className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Every Person Is Real</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">Bots can fake a follower count. They can&apos;t fake a friend. Every single person on Jana is there because someone they actually know let them in. No scraped contacts. No suggested friends. No exceptions.</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-xl hover:border-spotify-green/40 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
            <Zap className="w-8 h-8 text-spotify-green mb-4" />
            <h3 className="text-xl font-bold mb-3">Built To Let You Leave</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed">We&apos;re not trying to keep you here longer. The conversation that mattered already happened. The plan was already made. Go live it. Jana doesn&apos;t compete for your attention — it gives your attention back.</p>
          </div>

          {/* Highlighted Feature (Human Referrals) */}
          <div className="md:col-span-2 lg:col-span-3 bg-white/5 backdrop-blur-md border border-spotify-green/20 p-8 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-spotify-green/45 hover:bg-white/10 transition-all duration-300">
            <div className="space-y-3 max-w-2xl text-left">
              <div className="flex items-center gap-3">
                <Users2 className="w-8 h-8 text-spotify-green" />
                <h3 className="text-xl font-bold text-white">Trust-Based Referrals</h3>
              </div>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                Your circle grows the only way it should — through trust. Introduce the people you believe in to each other. No algorithms expanding your network behind your back. Every new connection is a deliberate choice, made by someone who has already earned your trust.
              </p>
            </div>
            <div className="px-4 py-2 bg-spotify-green/10 text-spotify-green border border-spotify-green/20 text-xs font-bold rounded-full uppercase tracking-wider whitespace-nowrap">
              Trust-First
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="why-it-matters" className="py-24 px-6 max-w-6xl mx-auto border-t border-spotify-dark-gray/40 relative z-10">
        <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">Four Steps. Then Silence.</h2>

        <div className="space-y-8 max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl hover:bg-white/10 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">1</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Build your card</h3>
              <p className="text-spotify-light-gray text-base font-light font-sans">Your name, your work, a few lines that actually sound like you. Not a bio you wrote for an audience — an introduction you&apos;d give in person.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl hover:bg-white/10 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">2</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Share your code</h3>
              <p className="text-spotify-light-gray text-base font-light font-sans">One QR code. One invite link. That&apos;s the connection request. There&apos;s no follow button — because there&apos;s nothing to follow. Just people, deciding to stay connected.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl hover:bg-white/10 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">3</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">They&apos;re in</h3>
              <p className="text-spotify-light-gray text-base font-light font-sans">Visible to each other. Invisible to everyone else. Your circle is sealed the moment it forms — no one looking in, no one listening in, no algorithm rearranging what you see.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl hover:bg-white/10 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-spotify-green text-black rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-spotify-green/10">4</div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-white">Now, talk.</h3>
              <p className="text-spotify-light-gray text-base font-light font-sans">No feed to scroll past. No algorithm deciding who you hear from. Just the conversation you came here for — with the person who was already on your mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center border-t border-spotify-dark-gray/40 relative z-10">
        <h2 className="text-4xl font-extrabold mb-8 tracking-tight">You&apos;ve felt it before.<br />That version of you that shows up when everything else goes quiet.</h2>
        <p className="text-xl text-spotify-light-gray mb-12 font-light">Jana isn&apos;t for everyone. It&apos;s for the people who already know who matters — and are done letting everything else get in the way.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://play.google.com/store/apps/details?id=com.india.jana"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10 text-base"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M3.609 2.056A1.996 1.996 0 0 0 3 3.563v16.874c0 .59.26 1.127.674 1.503l.06.054L15.02 12 3.67 2l-.061.056zM18.064 9.87l-3.037 3.036 3.038 3.038 4.269-2.436c1.171-.667 1.171-2.507 0-3.175l-4.27-2.463zM4.774 2.89l10.21 10.21 3.08-3.08L4.774 2.89zm0 18.22l13.29-7.574-3.08-3.08-10.21 10.654z" />
            </svg>
            Download for Android
          </a>
          <a
            href="https://apps.apple.com/us/app/jana-mandala/id6785388442"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10 text-base"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
            </svg>
            Download for iOS
          </a>
          <a
            href="/support"
            className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-200 text-base flex items-center justify-center backdrop-blur-md"
          >
            Support
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-spotify-dark-gray/65 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center text-spotify-light-gray text-xs flex flex-col items-center gap-4">
          <div className="text-xs uppercase font-extrabold tracking-widest text-[#E2F1FF] opacity-70">
            Focus on who matters.
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Jana.png" alt="Jana Logo" className="w-6 h-6 object-contain opacity-55 hover:opacity-100 transition" />
          <p>&copy; 2026 Jana. All rights reserved. | <a href="/legal" className="hover:text-spotify-green transition duration-150">Privacy</a> | <a href="/legal" className="hover:text-spotify-green transition duration-150">Terms</a> | <a href="/eula" className="hover:text-spotify-green transition duration-150">EULA</a> | <a href="/delete-account" className="hover:text-spotify-green transition duration-150">Delete Account</a> | <a href="/support" className="hover:text-spotify-green transition duration-150">Support</a></p>
        </div>
      </footer>
    </div>
  );
}
