import React from 'react';

export default function Page1Cover({ clientName, unitNo }) {
  return (
    <div className="pdf-page-container relative flex flex-col justify-between bg-[#162840] text-white overflow-hidden shadow-2xl">
      {/* Top 76% Hero Image */}
      <div className="relative w-full h-[76%] overflow-hidden">
        <img
          src="/assets/cover_building.jpg"
          alt="Techno One Building Render"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Bottom 24% Dark Navy Branding Block */}
      <div className="relative w-full h-[24%] bg-[#162840] px-12 py-8 flex justify-between items-center border-t border-slate-700/50">
        {/* Subtle geometric background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3ba1db_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Left Side Client & Unit Details */}
        <div className="flex items-stretch gap-5 z-10">
          <div className="w-3.5 bg-[#3ba1db] rounded-sm shadow-lg"></div>
          <div className="flex flex-col justify-center space-y-3">
            <div>
              <div className="text-[11px] font-semibold text-[#7ebce6] uppercase tracking-wider">CLIENT NAME</div>
              <div className="text-[20px] font-extrabold text-white tracking-wide uppercase mt-0.5">
                {clientName || 'VALUED CLIENT'}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#7ebce6] uppercase tracking-wider">UNIT NO.</div>
              <div className="text-[20px] font-extrabold text-white tracking-wide uppercase mt-0.5">
                {unitNo || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Techno One Logo */}
        <div className="z-10 flex items-center justify-end pr-4">
          <img
            src="/assets/techno_one_logo_white.png"
            alt="Techno One Logo"
            className="h-16 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
