import React, { useState } from 'react';
import { getFloorCategory } from '../../data/inventoryData';

export default function Page2LayoutPlan({ selectedUnit, customLayoutImage }) {
  const [imageError, setImageError] = useState(false);
  const unitNo = selectedUnit?.unitNo || 'M-02';
  const areaSqFt = selectedUnit?.areaSqFt || 0;
  const floorName = selectedUnit?.floor || 'TYPICAL FLOOR';
  const floorCategory = getFloorCategory(floorName);

  const dedicatedImagePath = `/unit_plans/${unitNo}.png`;
  const activeImage = customLayoutImage || (!imageError ? dedicatedImagePath : null);

  return (
    <div className="pdf-page-container relative flex flex-col justify-between bg-white text-slate-900 overflow-hidden shadow-2xl p-0">
      {activeImage ? (
        /* Full-page seamless layout plan image matching the PDF design */
        <div className="w-full h-full relative overflow-hidden bg-white">
          <img
            src={activeImage}
            alt={`Unit Plan ${unitNo}`}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ) : (
        /* Fallback component rendering if image is missing */
        <div className="flex-1 flex flex-col justify-between p-12">
          {/* Top Header Banner */}
          <div className="w-full h-[180px] relative overflow-hidden bg-[#162840] rounded-xl">
            <img
              src="/assets/p2_header_banner.jpg"
              alt="Techno One Banner"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex justify-between items-center border-b border-slate-200 pb-3 mt-6">
            <div>
              <h2 className="text-2xl font-black text-[#162840] tracking-tight">FLOOR PLAN</h2>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{floorName}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#162840]">Unit: <span className="text-[#3ba1db]">{unitNo}</span></span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 my-6 items-center flex-1">
            <div className="col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase mb-2">Building Elevation</div>
              <img
                src="/assets/floor_elevation_diagram.png"
                alt="Floor Elevation"
                className="h-[280px] w-auto object-contain"
              />
            </div>

            <div className="col-span-8 flex flex-col justify-between h-full space-y-4">
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FLOOR TYPE</span>
                  <div className="text-xl font-extrabold text-[#162840] tracking-wide mt-0.5">{floorCategory}</div>
                </div>

                <div className="grid grid-cols-2 border border-slate-300 rounded-lg overflow-hidden bg-white text-sm">
                  <div className="p-3 bg-slate-100 font-bold text-slate-700 border-r border-slate-300 flex items-center">
                    Gross Area
                  </div>
                  <div className="p-3 font-extrabold text-[#162840] flex items-center">
                    {areaSqFt} <span className="text-xs font-semibold text-slate-500 ml-1">Sq Ft</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-semibold pt-1 border-t border-slate-200">
                  <p className="text-[#3ba1db] font-bold">COMMERCIAL PROJECT</p>
                  <p className="text-slate-500">MLR, DHA 1, ISLAMABAD</p>
                </div>
              </div>

              <div className="flex-1 border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50/50 min-h-[260px]">
                <p className="text-sm font-bold text-slate-500">Unit Layout Plan</p>
                <p className="text-xs text-slate-400">Unit {unitNo} Architectural Blueprint</p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-[10px] text-slate-400 text-center leading-tight">
            All drawings and dimensions are approximate and are for illustrative purposes only. The furnishings, fixtures, and accessories shown are for representation only.
          </div>
        </div>
      )}
    </div>
  );
}
