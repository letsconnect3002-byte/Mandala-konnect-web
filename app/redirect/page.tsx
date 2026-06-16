'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RedirectPage() {
  const [device, setDevice] = useState<'detecting' | 'android' | 'ios' | 'desktop'>('detecting');
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const opera = 'opera' in window ? String((window as Record<string, unknown>).opera) : "";
    const userAgent = navigator.userAgent || navigator.vendor || opera;
    
    // Defer the detection and state updates to avoid synchronous setState warnings
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        const redirectUrl = `${window.location.origin}/redirect`;
        setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(redirectUrl)}&color=000000`);
      }

      // Android detection
      if (/android/i.test(userAgent)) {
        setDevice('android');
        window.location.href = "https://play.google.com/store/apps/details?id=com.mandala.app";
      } 
      // iOS detection
      else if (/iPad|iPhone|iPod/.test(userAgent) && !('MSStream' in window)) {
        setDevice('ios');
      } 
      // Fallback (Desktop)
      else {
        setDevice('desktop');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black via-spotify-dark-gray to-spotify-black text-white flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Cinematic Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="grainy-redirect">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.07 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainy-redirect)" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden animate-fade-in">
        {/* Decorative ambient light */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-spotify-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-spotify-green/5 rounded-full blur-3xl pointer-events-none" />

        {device === 'detecting' && (
          <div className="space-y-6 py-8 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-16 h-16 object-contain animate-pulse" />
            <div className="w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full animate-spin" />
            <div>
              <h1 className="text-2xl font-bold mb-2">Connecting to Mandala</h1>
              <p className="text-spotify-light-gray text-sm font-light">Detecting your device...</p>
            </div>
          </div>
        )}

        {device === 'android' && (
          <div className="space-y-6 py-8 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="text-2xl font-bold mb-2">Redirecting to Play Store</h1>
              <p className="text-spotify-light-gray text-sm leading-relaxed mb-6">
                Opening the Mandala app in the Google Play Store. If you are not redirected automatically, please click below.
              </p>
            </div>
            <a 
              href="https://play.google.com/store/apps/details?id=com.mandala.app"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 hover:bg-white/10 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-black/10"
            >
              Open Play Store
            </a>
          </div>
        )}

        {device === 'ios' && (
          <div className="space-y-6 py-4 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-16 h-16 object-contain mb-2" />
            <div>
              <h1 className="text-2xl font-bold mb-1">Mandala for iOS</h1>
              <div className="inline-block px-3 py-1 bg-spotify-green/20 text-spotify-green border border-spotify-green/30 text-xs font-bold rounded-full uppercase tracking-wider mb-6">
                Coming Soon
              </div>
              <p className="text-spotify-light-gray leading-relaxed mb-4 text-sm font-light">
                We are currently building and perfecting the Mandala iOS app to ensure it meets our standards for private, high-fidelity communication.
              </p>
              <p className="text-spotify-light-gray text-xs leading-relaxed mb-8 font-light">
                In the meantime, Mandala is fully available on Android. If you have an Android device, you can install the app from the Play Store.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <a 
                href="https://play.google.com/store/apps/details?id=com.mandala.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 hover:bg-white/10 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 2.056A1.996 1.996 0 0 0 3 3.563v16.874c0 .59.26 1.127.674 1.503l.06.054L15.02 12 3.67 2l-.061.056zM18.064 9.87l-3.037 3.036 3.038 3.038 4.269-2.436c1.171-.667 1.171-2.507 0-3.175l-4.27-2.463zM4.774 2.89l10.21 10.21 3.08-3.08L4.774 2.89zm0 18.22l13.29-7.574-3.08-3.08-10.21 10.654z" />
                </svg>
                Android Version
              </a>
              <Link 
                href="/"
                className="w-full px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-spotify-light-gray hover:text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-200 text-sm text-center backdrop-blur-md"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}

        {device === 'desktop' && (
          <div className="space-y-6 py-4 flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Mandala Icon 1.png" alt="Mandala Logo" className="w-16 h-16 object-contain mb-2" />
            <div>
              <h1 className="text-2xl font-bold mb-2">Get Mandala App</h1>
              <p className="text-spotify-light-gray text-sm mb-6 leading-relaxed font-light">
                Mandala is designed to run on your mobile device. Scan the QR code below using your phone or choose a store.
              </p>
            </div>
            
            {/* Elegant QR Code card */}
            {qrUrl && (
              <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-inner border border-spotify-medium-gray/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrUrl} 
                  alt="Scan to Download Mandala"
                  className="w-40 h-40"
                />
              </div>
            )}
            
            <p className="text-xs text-spotify-light-gray font-medium tracking-wide">Scan to open on your phone</p>

            <div className="pt-4 flex flex-col gap-3 w-full">
              <a 
                href="https://play.google.com/store/apps/details?id=com.mandala.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3.5 bg-white/5 border border-white/10 hover:border-spotify-green/40 hover:bg-white/10 text-white hover:text-spotify-green font-bold rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-black/10"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 2.056A1.996 1.996 0 0 0 3 3.563v16.874c0 .59.26 1.127.674 1.503l.06.054L15.02 12 3.67 2l-.061.056zM18.064 9.87l-3.037 3.036 3.038 3.038 4.269-2.436c1.171-.667 1.171-2.507 0-3.175l-4.27-2.463zM4.774 2.89l10.21 10.21 3.08-3.08L4.774 2.89zm0 18.22l13.29-7.574-3.08-3.08-10.21 10.654z" />
                </svg>
                Get it on Google Play
              </a>
              <div className="relative w-full">
                <span className="absolute -top-2 right-4 bg-spotify-green/20 text-spotify-green border border-spotify-green/30 text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full tracking-wider shadow-md">
                  Coming Soon
                </span>
                <button 
                  disabled
                  className="w-full px-6 py-3.5 bg-white/5 border border-white/10 text-spotify-medium-gray rounded-full flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <svg className="w-5 h-5 opacity-30" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
                  </svg>
                  App Store (iOS)
                </button>
              </div>
              <Link 
                href="/"
                className="w-full px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-spotify-light-gray hover:text-white font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-200 text-sm text-center backdrop-blur-md"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
