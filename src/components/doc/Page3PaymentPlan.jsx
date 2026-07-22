import React from 'react';
import { formatPKR } from '../../data/inventoryData';

export default function Page3PaymentPlan({ calculation, issueDate }) {
  if (!calculation) return null;

  const {
    totalPrice,
    ratePerSqFt,
    downPaymentAmount,
    possessionAmount,
    standardInstallmentAmount,
    totalBalloonAmount,
    durationMonths,
    planType,
    fullPaymentDiscountAmount,
    schedule = []
  } = calculation;

  const formattedIssueDate = issueDate ? new Date(issueDate).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

  let durationText = `${durationMonths} Months`;
  let installmentLabel = 'Standard Monthly Installment';

  if (planType === 'quarterly') {
    installmentLabel = 'Standard Quarterly Installment';
  } else if (planType === 'full_payment') {
    durationText = 'Lump Sum Cash';
    installmentLabel = 'Cash Discount Applied';
  }

  return (
    <div className="pdf-page-container relative flex flex-col justify-between bg-white text-slate-900 overflow-hidden shadow-2xl p-10">
      
      {/* Top Main Dark Navy Header Bar */}
      <div className="w-full bg-[#162840] text-white py-3 px-6 text-center rounded-sm shadow-sm mb-6">
        <h2 className="text-xl font-black uppercase tracking-widest font-heading">DETAILED PAYMENT PLAN</h2>
      </div>

      {/* Summary Financial Breakdown Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 text-xs">
        <div className="grid grid-cols-2 gap-x-10 gap-y-2.5">
          
          {/* Left Column */}
          <div className="space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">Total Unit Price:</span>
              <span className="font-bold text-[#162840]">{formatPKR(totalPrice)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">Rate Per SqFt.:</span>
              <span className="font-bold text-[#162840]">{formatPKR(ratePerSqFt)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">Date Of Issue:</span>
              <span className="font-bold text-[#162840]">{formattedIssueDate}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">Plan Duration:</span>
              <span className="font-bold text-[#162840]">{durationText}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">Down Payment:</span>
              <span className="font-bold text-[#162840]">{formatPKR(downPaymentAmount)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">Possession:</span>
              <span className="font-bold text-[#162840]">{formatPKR(possessionAmount)}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">{installmentLabel}:</span>
              <span className="font-bold text-[#162840]">
                {planType === 'full_payment' ? `- ${formatPKR(fullPaymentDiscountAmount)}` : formatPKR(standardInstallmentAmount)}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="font-semibold text-slate-600">Balloon Payment:</span>
              <span className="font-bold text-[#162840]">{formatPKR(totalBalloonAmount)}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Schedule Table */}
      <div className="flex-1 overflow-hidden border border-slate-300 rounded-sm mb-4">
        <table className="w-full text-left text-[10.5px] border-collapse">
          <thead>
            <tr className="bg-[#4f9ed0] text-[#162840]">
              <th className="py-2 px-3 font-extrabold border-r border-blue-400/50 w-28 text-center">Installment No.</th>
              <th className="py-2 px-3 font-extrabold border-r border-blue-400/50">Installment Date</th>
              <th className="py-2 px-3 font-extrabold border-r border-blue-400/50 text-right">Amount</th>
              <th className="py-2 px-3 font-extrabold text-right">Amount Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {schedule.slice(0, 30).map((row, idx) => {
              const isBalloon = row.type === 'balloon';
              const isDP = row.type === 'down_payment';
              const isPossession = row.type === 'possession';

              let bgClass = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70';
              if (isBalloon) bgClass = 'bg-amber-50/80 font-semibold text-amber-900';
              if (isDP) bgClass = 'bg-sky-50 font-semibold text-sky-900';
              if (isPossession) bgClass = 'bg-emerald-50 font-semibold text-emerald-900';

              return (
                <tr key={row.id || idx} className={`${bgClass} border-b border-slate-200`}>
                  <td className="py-1.5 px-3 border-r border-slate-200 font-bold text-center">
                    {row.installmentNo}
                  </td>
                  <td className="py-1.5 px-3 border-r border-slate-200 font-medium text-slate-700">
                    {row.date} <span className="text-[9px] text-slate-400 font-normal ml-1">({row.description})</span>
                  </td>
                  <td className="py-1.5 px-3 border-r border-slate-200 font-bold text-right text-slate-800">
                    {formatPKR(row.amount)}
                  </td>
                  <td className="py-1.5 px-3 font-bold text-right text-[#162840]">
                    {formatPKR(row.amountDue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Confidentiality Notice */}
      <div className="pt-3 border-t border-slate-300 text-[9.5px] text-slate-500 text-justify leading-snug">
        This document is confidential and intended solely for the recipient. All pricing and payment plans for Techno One are valid for two weeks and may be revised by Premier Choice International Developers without prior notice. This document is for informational purposes only and does not constitute a legally binding agreement until a Sales and Purchase Agreement (SPA) is executed by all parties.
      </div>

    </div>
  );
}
