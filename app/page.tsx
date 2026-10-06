import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  QrCode,
  Sparkles,
  Users2,
  Award,
  CheckCircle2,
  Building2,
  Briefcase,
  Share2,
  Lock,
  Flame,
  TrendingUp,
  Globe,
  Compass
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-spotify-black text-white relative overflow-hidden font-sans">
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.035] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="grainy">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainy)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-spotify-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Jana.png" alt="Jana Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-extrabold tracking-wider text-white">JANA</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-sm font-medium text-spotify-light-gray">
            <a href="#about" className="hover:text-white transition duration-200">The Network</a>
            <a href="#how-it-works" className="hover:text-white transition duration-200">How It Works</a>
            <a href="#reputation" className="hover:text-white transition duration-200">Social Reputation</a>
            <a href="#community" className="hover:text-white transition duration-200">Community</a>
            <a href="/support" className="hover:text-white transition duration-200">Support</a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://apps.apple.com/us/app/jana-mandala/id6785388442"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-white text-black hover:bg-white/90 font-bold rounded-full text-xs tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 shadow-lg shadow-white/10"
            >
              <span>Get Jana</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 overflow-hidden min-h-[92vh] flex flex-col justify-between items-center w-full z-10">
        {/* Background Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-spotify-black">
          <div className="absolute -top-[15%] -left-[10%] w-[55%] h-[65%] bg-[#0064E0] rounded-full blur-[140px] opacity-35" />
          <div className="absolute top-[20%] right-[-10%] w-[50%] h-[60%] bg-[#EC4899] rounded-full blur-[150px] opacity-25" />
          <div className="absolute -bottom-[10%] left-[20%] w-[55%] h-[60%] bg-[#6366F1] rounded-full blur-[140px] opacity-30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_transparent_20%,_#191414_90%)]" />
        </div>

        {/* Hero Content */}
        <div className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto z-10 relative">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-md text-[11px] sm:text-xs text-white/90 font-semibold tracking-wider uppercase shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
            <span>Curated &bull; Invite-Only &bull; Tech & VC Ecosystem</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.08] text-white tracking-tight max-w-5xl mx-auto">
            The Invite-Only Network for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#00F2FE] via-[#60A5FA] to-[#EC4899] bg-clip-text text-transparent">
              Startups, VCs & Tech Builders.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-xl text-spotify-light-gray max-w-3xl mx-auto leading-relaxed font-normal tracking-wide px-2 sm:px-0">
            Get vouched by the people who trust you and build your social reputation in your professional world. No vanity followers. No algorithmic feeds. Just real proof of trust and authentic community.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 sm:gap-4 justify-center items-center pt-2 sm:pt-4 w-full px-2 sm:px-0">
            <a
              href="https://apps.apple.com/us/app/jana-mandala/id6785388442"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-white text-black hover:bg-white/90 font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 shadow-xl shadow-white/10 text-sm"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
              </svg>
              <span>Download for iOS</span>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.india.jana"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/5 border border-white/15 hover:border-white/30 text-white font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-black/20 text-sm hover:bg-white/10"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 2.056A1.996 1.996 0 0 0 3 3.563v16.874c0 .59.26 1.127.674 1.503l.06.054L15.02 12 3.67 2l-.061.056zM18.064 9.87l-3.037 3.036 3.038 3.038 4.269-2.436c1.171-.667 1.171-2.507 0-3.175l-4.27-2.463zM4.774 2.89l10.21 10.21 3.08-3.08L4.774 2.89zm0 18.22l13.29-7.574-3.08-3.08-10.21 10.654z" />
              </svg>
              <span>Download for Android</span>
            </a>
          </div>
        </div>

        {/* Live Profile Card Preview Showcase */}
        <div className="w-full max-w-4xl mx-auto mt-14 z-10 relative px-2">
          <div className="p-1 rounded-3xl bg-gradient-to-r from-white/15 via-[#00F2FE]/20 to-[#EC4899]/20 shadow-2xl backdrop-blur-xl">
            <div className="bg-[#0F1013] border border-white/10 rounded-[22px] p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Profile Avatar & Info */}
              <div className="flex items-center gap-4 text-left w-full md:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2.5px] bg-gradient-to-br from-[#EC4899] to-[#00F2FE] flex-shrink-0 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#1A1B23] flex items-center justify-center font-bold text-2xl text-white">
                    AR
                  </div>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white truncate">Alex Rivera</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold tracking-wide">
                      VERIFIED VOUCHED
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-spotify-light-gray">Founder &amp; CEO @ NextScale &bull; Venture Partner</p>
                  <p className="text-[11px] text-[#A1A4B0] flex items-center gap-2">
                    <span className="text-[#00F2FE] font-semibold">18 Peer Vouches</span> &bull; <span>Inner Circle (Top 5)</span>
                  </p>
                </div>
              </div>

              {/* Vouch Trust Pill Badges */}
              <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-center w-full md:w-auto">
                <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xs text-[#00F2FE] font-bold">Global</div>
                  <div className="text-[10px] text-white/70">Public Trust</div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xs text-[#60A5FA] font-bold">Network</div>
                  <div className="text-[10px] text-white/70">Tech Ecosystem</div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#EC4899]/20 to-[#6366F1]/20 border border-[#EC4899]/40 text-center">
                  <div className="text-xs text-white font-bold">Inner Circle</div>
                  <div className="text-[10px] text-white/80">Highest Confidence</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ecosystem Pillars Ticker */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-16 border-t border-white/5 max-w-4xl mx-auto w-full z-10 relative mt-16">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#E2F1FF] tracking-tight">Curated</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1">Founders &bull; VCs &bull; Builders</div>
          </div>
          <div className="text-center border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#00F2FE] tracking-tight">Peer-Vouched</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1">Authentic Social Reputation</div>
          </div>
          <div className="text-center border-t border-white/5 sm:border-t-0 pt-4 sm:pt-0">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#EC4899] tracking-tight">Invite-Only</div>
            <div className="text-xs text-spotify-light-gray font-medium tracking-wider uppercase mt-1">High-Signal Community</div>
          </div>
        </div>
      </section>

      {/* The Core Shift: Why Jana */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto relative z-10 border-t border-white/10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#00F2FE] mb-3 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>The New Standard Of Reputation</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Reputation in tech shouldn&apos;t be a popularity contest.
          </h2>
          <p className="text-spotify-light-gray text-base sm:text-lg mt-4 font-light leading-relaxed">
            Mainstream networks are inundated with algorithmic feeds, connection collectors, and inflated bios. Jana replaces empty vanity metrics with proof of trust from people who have actually worked with you, funded you, and built with you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#00F2FE]/40 hover:bg-white/[0.08] transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#00F2FE]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Curated &amp; Invite-Only</h3>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                Not everyone gets in. Jana is tailored exclusively for founders, venture capital partners, angel investors, and tech leaders. Every new member is sponsored by existing trusted members, preserving elite signal quality.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#60A5FA]/40 hover:bg-white/[0.08] transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#60A5FA]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">True Social Reputation</h3>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                Follower counts can be bought, and resumes can be exaggerated. Real reputation comes from peers who put their own name on the line to vouch for your execution, character, and integrity.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#EC4899]/40 hover:bg-white/[0.08] transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-[#EC4899]">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Build The Community</h3>
              <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
                Elevate high-potential founders, endorse exceptional engineering talent, and connect with venture capital peers. Your endorsements compound, shaping the next wave of tech innovators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Vouches Work: 4 Steps */}
      <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Vouch Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            Four Steps to Verifiable Reputation.
          </h2>
          <p className="text-spotify-light-gray text-base mt-3 font-light">
            How founders and investors establish, exchange, and verify trust on Jana.
          </p>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">1</div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white">Curate Your Profile Card</h3>
              <p className="text-spotify-light-gray text-sm font-light leading-relaxed">
                Claim your unique handle (e.g. <span className="text-white font-mono text-xs">jana.com/x/handle</span>) and establish your verified identity — your current venture, leadership role, and professional focus.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-tr from-[#00F2FE] to-[#60A5FA] text-black rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">2</div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white">Get Vouched by Trusted Peers</h3>
              <p className="text-spotify-light-gray text-sm font-light leading-relaxed">
                Connect with co-founders, investors, and colleagues. When they vouch for you, their endorsement adds credible weight to your profile and expands your reach.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-tr from-[#EC4899] to-[#6366F1] text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">3</div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white">Calibrate Trust Scopes</h3>
              <p className="text-spotify-light-gray text-sm font-light leading-relaxed">
                Organize endorsements into <span className="text-white font-semibold">Global</span>, <span className="text-white font-semibold">Network</span>, and <span className="text-white font-semibold">Inner Circle</span>. You control who sees private contact coordinates and confidential vouch details.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] hover:border-white/20 transition duration-300 text-center sm:text-left">
            <div className="flex-shrink-0 w-12 h-12 bg-emerald-400 text-black rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-md">4</div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold text-white">Build &amp; Strengthen The Community</h3>
              <p className="text-spotify-light-gray text-sm font-light leading-relaxed">
                Endorse rising founders you believe in, connect fellow investors, and discover trusted second-degree introductions at demo days and venture summits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Built for Startups & Venture Capital */}
      <section id="reputation" className="py-24 px-6 max-w-6xl mx-auto border-t border-white/10 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Engineered for the Modern Tech Ecosystem.
          </h2>
          <p className="text-spotify-light-gray text-base mt-3 font-light">
            Every feature in Jana is designed to cultivate signal and eliminate noise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-[#00F2FE]/40 hover:bg-white/[0.08] transition-all duration-300">
            <QrCode className="w-8 h-8 text-[#00F2FE] mb-4" />
            <h3 className="text-xl font-bold mb-2.5 text-white">Dynamic In-Person QR</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
              Exchange contact cards and vouch for peers in seconds at hackathons, demo days, and private investor dinners using encrypted dynamic QR codes.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-[#60A5FA]/40 hover:bg-white/[0.08] transition-all duration-300">
            <Lock className="w-8 h-8 text-[#60A5FA] mb-4" />
            <h3 className="text-xl font-bold mb-2.5 text-white">Three-Tier Vouch Scopes</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
              Calibrate each vouch under Global, Network, or Inner Circle. Keep sensitive cell numbers and deal memos exclusive to your highest-trust partners.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-[#EC4899]/40 hover:bg-white/[0.08] transition-all duration-300">
            <Share2 className="w-8 h-8 text-[#EC4899] mb-4" />
            <h3 className="text-xl font-bold mb-2.5 text-white">Public Proof-of-Trust Links</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
              Share your verified Jana profile card on Pitch Decks, LinkedIn, and X. Investors and founders can review your live vouches with complete authenticity.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-emerald-400/40 hover:bg-white/[0.08] transition-all duration-300">
            <Building2 className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-2.5 text-white">Venture &amp; Angel Discovery</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
              Discover founders backed and vouched by the investors you respect. Eliminate cold outreach spam with second-degree proof of credibility.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-amber-400/40 hover:bg-white/[0.08] transition-all duration-300">
            <TrendingUp className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold mb-2.5 text-white">Zero Algorithmic Pollution</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
              No endless feeds, rage bait, or engagement farming. Jana exists to connect people who respect each other and get out of the way.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-purple-400/40 hover:bg-white/[0.08] transition-all duration-300">
            <Users2 className="w-8 h-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2.5 text-white">Community First</h3>
            <p className="text-spotify-light-gray text-sm leading-relaxed font-light">
              Strengthen the tech ecosystem by standing behind the colleagues, co-founders, and leaders who deserve recognition. Build the community.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Callout */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center relative z-10 border-t border-white/10">
        <div className="text-xl sm:text-2xl md:text-3xl font-light text-white/90 italic max-w-3xl mx-auto leading-relaxed">
          &ldquo;Your professional world is defined not by how many people follow you, but by who is willing to put their name on the line for you.&rdquo;
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="community" className="py-24 px-6 max-w-5xl mx-auto text-center border-t border-white/10 relative z-10">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/15 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0064E0]/25 rounded-full blur-[100px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tight text-white leading-tight">
            Build Your Social Reputation.<br />
            <span className="bg-gradient-to-r from-[#00F2FE] to-[#EC4899] bg-clip-text text-transparent">
              Build The Community.
            </span>
          </h2>
          <p className="text-base sm:text-xl text-spotify-light-gray mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Join founders, venture capitalists, and tech leaders on Jana. Get vouched by the people who trust you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://apps.apple.com/us/app/jana-mandala/id6785388442"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-white/90 font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 shadow-xl shadow-white/10 text-base"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
              </svg>
              <span>Download for iOS</span>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.india.jana"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 hover:border-white/40 text-white font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 shadow-lg shadow-black/20 text-base hover:bg-white/10"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 2.056A1.996 1.996 0 0 0 3 3.563v16.874c0 .59.26 1.127.674 1.503l.06.054L15.02 12 3.67 2l-.061.056zM18.064 9.87l-3.037 3.036 3.038 3.038 4.269-2.436c1.171-.667 1.171-2.507 0-3.175l-4.27-2.463zM4.774 2.89l10.21 10.21 3.08-3.08L4.774 2.89zm0 18.22l13.29-7.574-3.08-3.08-10.21 10.654z" />
              </svg>
              <span>Download for Android</span>
            </a>
            <a
              href="/support"
              className="w-full sm:w-auto px-7 py-4 bg-transparent border border-white/10 hover:border-white/30 text-white/80 hover:text-white font-semibold rounded-full hover:scale-105 active:scale-95 transition-all duration-200 text-base flex items-center justify-center"
            >
              <span>Support</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 relative z-10 bg-[#0E0B0B]/60">
        <div className="max-w-6xl mx-auto text-center text-spotify-light-gray text-xs flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Jana.png" alt="Jana Logo" className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition" />
            <span className="font-bold text-white tracking-wider">JANA</span>
          </div>
          <p className="text-[11px] text-[#A1A4B0] max-w-md">
            A curated, invite-only social network for the startup, venture capital community and tech ecosystem.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[#A1A4B0] pt-2">
            <a href="/legal" className="hover:text-white transition duration-150">Privacy</a>
            <span>&bull;</span>
            <a href="/legal" className="hover:text-white transition duration-150">Terms</a>
            <span>&bull;</span>
            <a href="/eula" className="hover:text-white transition duration-150">EULA</a>
            <span>&bull;</span>
            <a href="/delete-account" className="hover:text-white transition duration-150">Delete Account</a>
            <span>&bull;</span>
            <a href="/support" className="hover:text-white transition duration-150">Support</a>
          </div>
          <p className="text-[10px] text-[#5E626E] mt-2">&copy; {new Date().getFullYear()} Jana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
