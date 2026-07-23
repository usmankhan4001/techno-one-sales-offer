import React, { useEffect } from 'react';
import { INVENTORY, formatPKR } from '../../data/inventoryData';
import { fitBitrixWindow } from '../../utils/bitrix24';
import { Plus, Trash2, Download, Paperclip, ChevronDown, CheckCircle, Smartphone } from 'lucide-react';

export default function ModularCalculator({
  projectName,
  setProjectName,
  selectedUnit,
  setSelectedUnit,
  clientName,
  setClientName,
  customRate,
  setCustomRate,
  downPaymentPercent,
  setDownPaymentPercent,
  possessionPercent,
  setPossessionPercent,
  durationMonths,
  setDurationMonths,
  planType,
  setPlanType,
  fullPaymentDiscountPercent,
  setFullPaymentDiscountPercent,
  balloonPayments,
  setBalloonPayments,
  calculation,
  onDownloadPdf,
  isGeneratingPdf,
  isInBitrix,
  bitrixLeadId,
  onAttachToBitrix,
  isAttachingBitrix,
  canInstallPwa,
  onInstallPwa
}) {

  // Trigger Bitrix Iframe auto-resize on layout/data changes
  useEffect(() => {
    fitBitrixWindow();
  }, [selectedUnit, planType, durationMonths, balloonPayments, calculation]);

  const handleUnitChange = (e) => {
    const unitNo = e.target.value;
    const found = INVENTORY.find(u => u.unitNo === unitNo);
    if (found) {
      setSelectedUnit(found);
      setCustomRate(found.ratePerSqFt);
    }
  };

  const addBalloonRow = () => {
    setBalloonPayments([
      ...balloonPayments,
      { id: Date.now(), month: 6, amount: 500000, label: 'Balloon Payment' }
    ]);
  };

  const removeBalloon = (id) => {
    setBalloonPayments(balloonPayments.filter(b => b.id !== id));
  };

  const updateBalloon = (id, field, value) => {
    setBalloonPayments(
      balloonPayments.map(b => b.id === id ? { ...b, [field]: value } : b)
    );
  };

  const area = selectedUnit?.areaSqFt || 0;
  const rate = customRate || selectedUnit?.ratePerSqFt || 0;
  const totalPrice = calculation?.totalPrice || 0;
  const downPayment = calculation?.downPaymentAmount || 0;
  const possession = calculation?.possessionAmount || 0;
  const installment = calculation?.standardInstallmentAmount || 0;
  const totalBalloons = calculation?.totalBalloonAmount || 0;
  const schedule = calculation?.schedule || [];

  return (
    <div className="w-full max-w-full px-1 sm:px-3 lg:px-4 font-sans pb-24 lg:pb-6">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 text-slate-800">
        
        {/* Top Header Bar */}
        <div className="bg-[#003366] p-3.5 sm:p-5 text-white flex flex-wrap justify-between items-center gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <img
              src="/assets/techno_one_logo.png"
              alt="Techno One Logo"
              className="h-8 sm:h-10 w-auto object-contain filter drop-shadow"
            />
            <div>
              <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight font-heading">
                {projectName || 'TECHNO ONE'}
              </h1>
              <p className="text-[#D4AF37] font-semibold tracking-wider text-[10px] sm:text-xs">
                MODULAR PAYMENT CALCULATOR
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-0">
            {canInstallPwa && (
              <button
                onClick={onInstallPwa}
                className="bg-[#D4AF37] hover:bg-amber-400 text-[#003366] font-extrabold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all animate-pulse"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install Offline App</span>
              </button>
            )}

            {bitrixLeadId && (
              <div className="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-xs font-semibold text-[#D4AF37] flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bitrix Lead #{bitrixLeadId} Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Full Width Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column Controls (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-50 p-3.5 sm:p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-200 space-y-4">
            
            {/* Project & Unit Section */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">PROJECT & UNIT</h2>
              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 ml-0.5">PROJECT NAME</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project Name"
                    className="w-full p-2 text-sm border border-gray-300 rounded-lg font-bold text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 ml-0.5">SELECT UNIT</label>
                  <div className="relative">
                    <select
                      value={selectedUnit?.unitNo || ''}
                      onChange={handleUnitChange}
                      className="w-full p-2 pr-8 border border-gray-300 rounded-lg font-bold text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003366] appearance-none cursor-pointer"
                    >
                      {INVENTORY.map((u) => (
                        <option key={u.unitNo} value={u.unitNo}>
                          Unit {u.unitNo} ({u.floor}) - {u.areaSqFt} SqFt
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 ml-0.5">AREA (SQFT)</label>
                    <input
                      type="number"
                      value={area}
                      readOnly
                      className="w-full p-2 border border-gray-200 bg-gray-100 rounded-lg font-semibold text-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 ml-0.5">RATE/SQFT (PKR)</label>
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Plan Logic Section */}
            <section className="pt-3 border-t border-gray-200">
              <h2 className="text-xs font-black text-gray-400 uppercase mb-2 tracking-wider">PLAN LOGIC</h2>
              
              {/* Plan Mode Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-200 rounded-lg mb-2.5 text-xs font-bold">
                <button
                  onClick={() => setPlanType('monthly')}
                  className={`py-1.5 rounded-md transition-all ${planType === 'monthly' ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPlanType('quarterly')}
                  className={`py-1.5 rounded-md transition-all ${planType === 'quarterly' ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setPlanType('full_payment')}
                  className={`py-1.5 rounded-md transition-all ${planType === 'full_payment' ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Full Cash
                </button>
              </div>

              {planType !== 'full_payment' ? (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 ml-0.5">DOWNPAY %</label>
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 ml-0.5">POSSESSION %</label>
                      <input
                        type="number"
                        value={possessionPercent}
                        onChange={(e) => setPossessionPercent(parseFloat(e.target.value) || 0)}
                        className="w-full p-2 border border-gray-300 rounded-lg font-semibold text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 ml-0.5">PLAN DURATION (MAX 24 MONTHS)</label>
                    <select
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-lg font-semibold bg-white text-sm"
                    >
                      <option value="6">6 Months</option>
                      <option value="12">1 Year (12 Months)</option>
                      <option value="18">1.5 Years (18 Months)</option>
                      <option value="24">2 Years (24 Months)</option>
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-[10px] font-bold text-gray-400 ml-0.5">CASH DISCOUNT %</label>
                  <input
                    type="number"
                    value={fullPaymentDiscountPercent}
                    onChange={(e) => setFullPaymentDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-lg font-bold text-emerald-600 text-sm"
                  />
                </div>
              )}
            </section>

            {/* Balloon Payments Section */}
            {planType !== 'full_payment' && (
              <section className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">Balloon Payments</h2>
                  <button
                    onClick={addBalloonRow}
                    className="text-xs bg-[#003366] text-white px-2.5 py-1 rounded-md hover:bg-blue-900 transition font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Manual
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                  {balloonPayments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No balloons added.</p>
                  ) : (
                    balloonPayments.map((b) => (
                      <div key={b.id} className="flex gap-1.5 items-center bg-amber-50/80 p-1.5 rounded-lg border border-amber-200">
                        <div className="w-14">
                          <label className="text-[9px] font-bold text-gray-400 block">MONTH</label>
                          <input
                            type="number"
                            value={b.month}
                            onChange={(e) => updateBalloon(b.id, 'month', parseInt(e.target.value) || 1)}
                            className="w-full p-1 border border-gray-300 rounded text-xs font-bold text-center bg-white"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-[9px] font-bold text-gray-400 block">AMOUNT (PKR)</label>
                          <input
                            type="number"
                            value={b.amount}
                            onChange={(e) => updateBalloon(b.id, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-full p-1 border border-gray-300 rounded text-xs font-bold text-amber-900 bg-white"
                          />
                        </div>
                        <button
                          onClick={() => removeBalloon(b.id)}
                          className="text-red-400 hover:text-red-600 font-bold p-1 text-base mt-2"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 italic">* Added balloons reduce regular installments automatically.</p>
              </section>
            )}

            {/* Client Info Section */}
            <section className="pt-3 border-t border-gray-200">
              <label className="text-[10px] font-bold text-gray-400 ml-0.5 block mb-0.5">CLIENT NAME</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="w-full p-2 border border-gray-300 rounded-lg font-bold text-slate-800 text-sm"
              />
            </section>

          </div>

          {/* Right Column Table & Summaries (8 Cols) */}
          <div className="lg:col-span-8 p-3.5 sm:p-5 lg:p-6 bg-white flex flex-col justify-between">
            
            <div>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 mb-4">
                <div className="border-l-4 border-[#D4AF37] bg-slate-50 p-3 rounded-r-lg shadow-sm">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Price</div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-black text-[#003366] mt-0.5">{formatPKR(totalPrice)}</div>
                </div>
                
                <div className="border-l-4 border-[#D4AF37] bg-slate-50 p-3 rounded-r-lg shadow-sm">
                  <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Down Payment ({downPaymentPercent}%)</div>
                  <div className="text-base sm:text-lg font-bold text-gray-800 mt-0.5">{formatPKR(downPayment)}</div>
                </div>

                <div className="border-l-4 border-emerald-500 bg-slate-50 p-3 rounded-r-lg ring-2 ring-emerald-100 shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">
                    {planType === 'quarterly' ? 'Quarterly Installment' : (planType === 'full_payment' ? 'Full Cash Payment' : 'Monthly Installment')}
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-black text-emerald-600 mt-0.5">
                    {formatPKR(planType === 'full_payment' ? totalPrice - (totalPrice * (fullPaymentDiscountPercent/100)) : installment)}
                  </div>
                </div>
              </div>

              {/* Badges Bar */}
              <div className="flex flex-wrap gap-2 mb-4 text-xs font-semibold">
                <span className="bg-gray-100 px-2.5 py-1 rounded-full text-gray-600 border border-gray-200">
                  Possession ({possessionPercent}%): <strong>{formatPKR(possession)}</strong>
                </span>
                {totalBalloons > 0 && (
                  <span className="bg-amber-100 px-2.5 py-1 rounded-full text-amber-800 border border-amber-200">
                    Total Balloons: <strong>{formatPKR(totalBalloons)}</strong>
                  </span>
                )}
              </div>

              {/* Live Interactive Schedule Table */}
              <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm mb-4">
                <div className="max-h-[380px] sm:max-h-[450px] overflow-y-auto overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                    <thead className="bg-slate-100 sticky top-0 text-gray-600 z-10">
                      <tr>
                        <th className="px-3 sm:px-4 py-2 text-left font-bold uppercase tracking-wider">Installment</th>
                        <th className="px-3 sm:px-4 py-2 text-left font-bold uppercase tracking-wider">Description & Date</th>
                        <th className="px-3 sm:px-4 py-2 text-right font-bold uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {schedule.map((row) => {
                        const isBalloon = row.type === 'balloon';
                        const isDP = row.type === 'down_payment';
                        const isPossession = row.type === 'possession';

                        let rowBg = 'hover:bg-slate-50';
                        if (isBalloon) rowBg = 'bg-amber-50/80 hover:bg-amber-100/80';
                        if (isDP) rowBg = 'bg-sky-50/80 hover:bg-sky-100/80';
                        if (isPossession) rowBg = 'bg-emerald-50/80 hover:bg-emerald-100/80';

                        return (
                          <tr key={row.id} className={rowBg}>
                            <td className="px-3 sm:px-4 py-2 font-bold text-slate-800 whitespace-nowrap">
                              {row.installmentNo}
                            </td>
                            <td className="px-3 sm:px-4 py-2 text-slate-600 font-medium whitespace-nowrap">
                              {row.description} <span className="text-[10px] text-slate-400 font-normal ml-1">({row.date})</span>
                            </td>
                            <td className="px-3 sm:px-4 py-2 text-right font-extrabold text-[#003366] whitespace-nowrap">
                              {formatPKR(row.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:flex justify-end items-center gap-3 pt-2">
              {isInBitrix && bitrixLeadId && (
                <button
                  onClick={onAttachToBitrix}
                  disabled={isAttachingBitrix}
                  className="bg-[#003366] hover:bg-blue-900 text-white font-extrabold px-5 py-3 rounded-xl shadow-lg transition-all text-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Paperclip className="w-4 h-4 text-[#D4AF37]" />
                  {isAttachingBitrix ? 'Attaching to Lead...' : 'Attach to Bitrix Lead'}
                </button>
              )}

              <button
                onClick={onDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-gradient-to-r from-[#D4AF37] to-[#e6c25e] text-[#003366] font-extrabold px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-all text-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGeneratingPdf ? 'Generating PDF Proposal...' : 'Download PDF Proposal'}
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Floating Sticky Download Bar for Mobile Screens */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-2.5 bg-slate-900/95 backdrop-blur border-t border-slate-800 z-50 shadow-2xl flex items-center justify-between gap-2">
        <div className="text-white text-xs pl-1">
          <div className="text-slate-400 text-[9px] uppercase font-bold">Total Price</div>
          <div className="font-extrabold text-[#D4AF37] text-xs sm:text-sm">{formatPKR(totalPrice)}</div>
        </div>

        <div className="flex items-center gap-2">
          {isInBitrix && bitrixLeadId && (
            <button
              onClick={onAttachToBitrix}
              disabled={isAttachingBitrix}
              className="bg-[#003366] text-white font-bold px-3 py-2.5 rounded-lg text-xs flex items-center gap-1 disabled:opacity-50"
            >
              <Paperclip className="w-3.5 h-3.5 text-[#D4AF37]" />
              {isAttachingBitrix ? 'Attaching...' : 'Attach Lead'}
            </button>
          )}

          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            className="bg-gradient-to-r from-[#D4AF37] to-[#e6c25e] text-[#003366] font-extrabold px-3.5 py-2.5 rounded-lg shadow-lg text-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

    </div>
  );
}
