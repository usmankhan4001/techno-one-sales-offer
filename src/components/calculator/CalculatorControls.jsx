import React from 'react';
import { INVENTORY, formatPKR } from '../../data/inventoryData';
import { Plus, Trash2, Upload, RefreshCw, Layers, DollarSign, Calendar, User, FileText } from 'lucide-react';

export default function CalculatorControls({
  selectedUnit,
  setSelectedUnit,
  clientName,
  setClientName,
  issueDate,
  setIssueDate,
  leadId,
  setLeadId,
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
  customLayoutImage,
  setCustomLayoutImage
}) {

  // Handle Unit Selection
  const handleUnitChange = (e) => {
    const unitNo = e.target.value;
    const found = INVENTORY.find(u => u.unitNo === unitNo);
    if (found) {
      setSelectedUnit(found);
      setCustomRate(found.ratePerSqFt);
    }
  };

  // Add Balloon Payment Row
  const addBalloon = () => {
    setBalloonPayments([
      ...balloonPayments,
      { id: Date.now(), month: 6, amount: 500000, label: 'Semi-Annual Balloon' }
    ]);
  };

  // Remove Balloon
  const removeBalloon = (id) => {
    setBalloonPayments(balloonPayments.filter(b => b.id !== id));
  };

  // Update Balloon
  const updateBalloon = (id, field, value) => {
    setBalloonPayments(
      balloonPayments.map(b => b.id === id ? { ...b, [field]: value } : b)
    );
  };

  // Layout Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLayoutImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentArea = selectedUnit?.areaSqFt || 0;
  const activeRate = customRate || selectedUnit?.ratePerSqFt || 0;
  const calculatedTotal = currentArea * activeRate;

  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-xl text-slate-100 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#3ba1db]" />
            Offer Controls
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Techno One Inventory & Pricing</p>
        </div>
      </div>

      {/* 1. Client & Lead Details */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#3ba1db]" /> Client Details
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold mb-1 block">CLIENT NAME</span>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. MUHAMMAD USMAN KHAN"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-bold text-white focus:outline-none focus:border-[#3ba1db]"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold mb-1 block">BITRIX LEAD ID (OPTIONAL)</span>
            <input
              type="text"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              placeholder="e.g. 10452"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-[#3ba1db]"
            />
          </div>
        </div>
      </div>

      {/* 2. Unit Selection & Rate Override */}
      <div className="space-y-3 pt-3 border-t border-slate-700/60">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#3ba1db]" /> Select Inventory Unit
        </label>
        
        <select
          value={selectedUnit?.unitNo || ''}
          onChange={handleUnitChange}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm font-bold text-white focus:outline-none focus:border-[#3ba1db]"
        >
          {INVENTORY.map((u) => (
            <option key={u.unitNo} value={u.unitNo}>
              Unit {u.unitNo} | {u.floor} | {u.areaSqFt} SqFt | PKR {u.ratePerSqFt}/sqft ({u.status})
            </option>
          ))}
        </select>

        {/* Area & Rate Row */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Area (SqFt):</span>
            <span className="text-base font-extrabold text-white">{currentArea} SqFt</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Rate / SqFt (PKR):</span>
            <input
              type="number"
              value={activeRate}
              onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs font-bold text-[#3ba1db] focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center text-xs">
          <span className="text-slate-400 font-semibold">Total Unit Price:</span>
          <span className="text-lg font-black text-[#3ba1db]">{formatPKR(calculatedTotal)}</span>
        </div>
      </div>

      {/* 3. Payment Plan Structure */}
      <div className="space-y-3 pt-3 border-t border-slate-700/60">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-[#3ba1db]" /> Payment Plan Logic
        </label>

        {/* Plan Mode Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 rounded-lg border border-slate-700">
          <button
            onClick={() => setPlanType('monthly')}
            className={`py-2 text-xs font-bold rounded-md transition-all ${planType === 'monthly' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setPlanType('quarterly')}
            className={`py-2 text-xs font-bold rounded-md transition-all ${planType === 'quarterly' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Quarterly
          </button>
          <button
            onClick={() => setPlanType('full_payment')}
            className={`py-2 text-xs font-bold rounded-md transition-all ${planType === 'full_payment' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Full Cash
          </button>
        </div>

        {planType !== 'full_payment' ? (
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">DOWNPAY %</span>
              <input
                type="number"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">POSSESSION %</span>
              <input
                type="number"
                value={possessionPercent}
                onChange={(e) => setPossessionPercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">DURATION</span>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs font-bold text-white"
              >
                <option value={12}>12 Months</option>
                <option value={18}>18 Months</option>
                <option value={24}>24 Months</option>
                <option value={36}>36 Months</option>
                <option value={48}>48 Months</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <span className="text-[10px] text-slate-400 font-semibold block mb-1">CASH DISCOUNT %</span>
            <input
              type="number"
              value={fullPaymentDiscountPercent}
              onChange={(e) => setFullPaymentDiscountPercent(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs font-bold text-emerald-400"
            />
          </div>
        )}
      </div>

      {/* 4. Balloon Payments (if monthly or quarterly) */}
      {planType !== 'full_payment' && (
        <div className="space-y-3 pt-3 border-t border-slate-700/60">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Balloon Payments
            </label>
            <button
              onClick={addBalloon}
              className="text-xs bg-[#162840] hover:bg-slate-700 text-[#3ba1db] font-semibold px-2.5 py-1 rounded-md border border-[#3ba1db]/40 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Balloon
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {balloonPayments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No balloon payments added.</p>
            ) : (
              balloonPayments.map((b) => (
                <div key={b.id} className="flex gap-2 items-center bg-slate-900/80 p-2 rounded-lg border border-slate-700">
                  <div className="w-16">
                    <span className="text-[9px] text-slate-400 block">MONTH</span>
                    <input
                      type="number"
                      value={b.month}
                      onChange={(e) => updateBalloon(b.id, 'month', parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs font-bold text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] text-slate-400 block">AMOUNT (PKR)</span>
                    <input
                      type="number"
                      value={b.amount}
                      onChange={(e) => updateBalloon(b.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1 text-xs font-bold text-amber-300"
                    />
                  </div>
                  <button
                    onClick={() => removeBalloon(b.id)}
                    className="text-red-400 hover:text-red-300 p-1.5 mt-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. Custom Layout Image Upload for Page 2 */}
      <div className="space-y-2 pt-3 border-t border-slate-700/60">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Upload className="w-3.5 h-3.5 text-[#3ba1db]" /> Page 2 Layout Image
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id="layout-upload"
            className="hidden"
          />
          <label
            htmlFor="layout-upload"
            className="flex-1 bg-slate-900 hover:bg-slate-700/80 border border-dashed border-slate-600 rounded-lg p-2.5 text-center text-xs text-slate-300 cursor-pointer font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#3ba1db]" />
            {customLayoutImage ? 'Change Layout Image' : 'Upload Unit Layout Plan'}
          </label>
          {customLayoutImage && (
            <button
              onClick={() => setCustomLayoutImage(null)}
              className="text-xs text-red-400 hover:underline font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
