import React from 'react';
import { INVENTORY, formatPKR } from '../../data/inventoryData';
import { Plus, Trash2, Download, Calendar, User, Upload } from 'lucide-react';

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
  customLayoutImage,
  setCustomLayoutImage
}) {

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
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 lg:p-6 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 text-slate-800">
        
        {/* Top Header Bar with Logo */}
        <div className="bg-[#003366] p-6 lg:p-8 text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <img
              src="/assets/techno_one_logo.png"
              alt="Techno One Logo"
              className="h-12 w-auto object-contain filter drop-shadow"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-heading flex items-center gap-2">
                {projectName || 'TECHNO ONE'}
              </h1>
              <p className="text-[#D4AF37] font-semibold mt-0.5 tracking-widest text-xs sm:text-sm">
                MODULAR PAYMENT CALCULATOR & OFFER GENERATOR
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column Controls (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-50 p-6 lg:p-8 border-r border-gray-200 space-y-6">
            
            {/* Project & Unit Section */}
            <section>
              <h2 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-wider">PROJECT & UNIT</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 ml-1">PROJECT NAME</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project Name"
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-[#003366] text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 ml-1">SELECT UNIT</label>
                  <select
                    value={selectedUnit?.unitNo || ''}
                    onChange={handleUnitChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  >
                    {INVENTORY.map((u) => (
                      <option key={u.unitNo} value={u.unitNo}>
                        Unit {u.unitNo} ({u.floor}) - {u.areaSqFt} SqFt
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 ml-1">AREA (SQFT)</label>
                    <input
                      type="number"
                      value={area}
                      readOnly
                      className="w-full p-2.5 border border-gray-200 bg-gray-100 rounded-lg font-semibold text-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 ml-1">RATE/SQFT (PKR)</label>
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold text-sm text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Plan Logic Section */}
            <section className="pt-4 border-t border-gray-200">
              <h2 className="text-xs font-black text-gray-400 uppercase mb-3 tracking-wider">PLAN LOGIC</h2>
              
              {/* Plan Mode Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-200 rounded-lg mb-3 text-xs font-bold">
                <button
                  onClick={() => setPlanType('monthly')}
                  className={`py-2 rounded-md transition-all ${planType === 'monthly' ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPlanType('quarterly')}
                  className={`py-2 rounded-md transition-all ${planType === 'quarterly' ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Quarterly
                </button>
                <button
                  onClick={() => setPlanType('full_payment')}
                  className={`py-2 rounded-md transition-all ${planType === 'full_payment' ? 'bg-[#003366] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Full Cash
                </button>
              </div>

              {planType !== 'full_payment' ? (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 ml-1">DOWNPAY %</label>
                      <input
                        type="number"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 ml-1">POSSESSION %</label>
                      <input
                        type="number"
                        value={possessionPercent}
                        onChange={(e) => setPossessionPercent(parseFloat(e.target.value) || 0)}
                        className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 ml-1">PLAN DURATION (MAX 24 MONTHS)</label>
                    <select
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                      className="w-full p-2.5 border border-gray-300 rounded-lg font-semibold bg-white text-sm"
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
                  <label className="text-[10px] font-bold text-gray-400 ml-1">CASH DISCOUNT %</label>
                  <input
                    type="number"
                    value={fullPaymentDiscountPercent}
                    onChange={(e) => setFullPaymentDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-emerald-600 text-sm"
                  />
                </div>
              )}
            </section>

            {/* Balloon Payments Section */}
            {planType !== 'full_payment' && (
              <section className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider">Balloon Payments</h2>
                  <button
                    onClick={addBalloonRow}
                    className="text-xs bg-[#003366] text-white px-2.5 py-1 rounded-md hover:bg-blue-900 transition font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Manual
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {balloonPayments.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No balloons added.</p>
                  ) : (
                    balloonPayments.map((b) => (
                      <div key={b.id} className="flex gap-2 items-center bg-amber-50/60 p-2 rounded-lg border border-amber-200">
                        <input
                          type="number"
                          placeholder="Mo"
                          value={b.month}
                          onChange={(e) => updateBalloon(b.id, 'month', parseInt(e.target.value) || 1)}
                          className="w-16 p-1.5 border border-gray-300 rounded text-xs font-bold text-center"
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={b.amount}
                          onChange={(e) => updateBalloon(b.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="flex-1 p-1.5 border border-gray-300 rounded text-xs font-bold text-amber-800"
                        />
                        <button
                          onClick={() => removeBalloon(b.id)}
                          className="text-red-400 hover:text-red-600 font-bold px-1 text-base"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">* Added balloons reduce regular installments automatically.</p>
              </section>
            )}

            {/* Client Info Section */}
            <section className="pt-4 border-t border-gray-200">
              <label className="text-[10px] font-bold text-gray-400 ml-1 block mb-1">CLIENT NAME</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-slate-800 text-sm"
              />
            </section>

          </div>

          {/* Right Column Table & Summaries (8 Cols) */}
          <div className="lg:col-span-8 p-6 lg:p-10 bg-white">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="border-l-4 border-[#D4AF37] bg-slate-50 p-4 rounded-r-lg shadow-sm">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Total Price</div>
                <div className="text-2xl font-black text-[#003366] mt-1">{formatPKR(totalPrice)}</div>
              </div>
              
              <div className="border-l-4 border-[#D4AF37] bg-slate-50 p-4 rounded-r-lg shadow-sm">
                <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Down Payment ({downPaymentPercent}%)</div>
                <div className="text-xl font-bold text-gray-800 mt-1">{formatPKR(downPayment)}</div>
              </div>

              <div className="border-l-4 border-emerald-500 bg-slate-50 p-4 rounded-r-lg ring-2 ring-emerald-100 shadow-sm">
                <div className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">
                  {planType === 'quarterly' ? 'Quarterly Installment' : (planType === 'full_payment' ? 'Full Cash Payment' : 'Monthly Installment')}
                </div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {formatPKR(planType === 'full_payment' ? totalPrice - (totalPrice * (fullPaymentDiscountPercent/100)) : installment)}
                </div>
              </div>
            </div>

            {/* Badges Bar */}
            <div className="flex flex-wrap gap-3 mb-6 text-xs font-semibold">
              <span className="bg-gray-100 px-3 py-1.5 rounded-full text-gray-600 border border-gray-200">
                Possession ({possessionPercent}%): <strong>{formatPKR(possession)}</strong>
              </span>
              {totalBalloons > 0 && (
                <span className="bg-amber-100 px-3 py-1.5 rounded-full text-amber-800 border border-amber-200">
                  Total Balloons: <strong>{formatPKR(totalBalloons)}</strong>
                </span>
              )}
            </div>

            {/* Live Interactive Schedule Table */}
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm mb-8">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-slate-100 sticky top-0 text-gray-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Installment</th>
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Description & Date</th>
                      <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-sm">
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
                          <td className="px-6 py-3 font-bold text-slate-800">
                            {row.installmentNo}
                          </td>
                          <td className="px-6 py-3 text-slate-600 font-medium">
                            {row.description} <span className="text-xs text-slate-400 font-normal ml-1">({row.date})</span>
                          </td>
                          <td className="px-6 py-3 text-right font-extrabold text-[#003366]">
                            {formatPKR(row.amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={onDownloadPdf}
                disabled={isGeneratingPdf}
                className="bg-gradient-to-r from-[#D4AF37] to-[#e6c25e] text-[#003366] font-extrabold px-10 py-4 rounded-xl shadow-xl hover:scale-105 transition-all text-sm flex items-center gap-3 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {isGeneratingPdf ? 'Generating PDF Proposal...' : 'Download PDF Proposal'}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
