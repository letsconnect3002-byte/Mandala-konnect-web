import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: "Legal Documents | Mandala",
  description: "Mandala's Privacy Policy, Terms of Service, and Consent Notice.",
};

export default async function LegalPage() {
  const filePath = path.join(process.cwd(), 'app', 'Legal Documents', 'mandala legal documents.md');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Parse markdown content to HTML
  const htmlContent = await marked.parse(fileContent);

  return (
    <div className="min-h-screen bg-spotify-black text-white relative overflow-hidden font-sans pb-24">
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
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-extrabold tracking-wider text-white">MANDALA</span>
          </a>
          <div>
            <a href="/" className="px-5 py-2.5 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-medium rounded-full text-xs tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-1.5 backdrop-blur-md">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </a>
          </div>
        </div>
      </nav>

      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-spotify-black">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] bg-[#042f1a] rounded-full blur-[120px] opacity-35" />
        <div className="absolute top-[15%] -left-[20%] w-[65%] h-[70%] bg-spotify-green rounded-full blur-[130px] opacity-15" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[55%] h-[60%] bg-[#3f6212] rounded-full blur-[120px] opacity-20" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36">
        <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 backdrop-blur-md shadow-2xl">
          <div 
            className="legal-content" 
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
      </div>
    </div>
  );
}
