import React, { useState } from 'react';
import Page1Cover from './Page1Cover';
import Page2LayoutPlan from './Page2LayoutPlan';
import Page3PaymentPlan from './Page3PaymentPlan';
import Page4BackCover from './Page4BackCover';
import { generatePdfProposal } from '../../utils/pdfGenerator';
import { attachPdfToBitrixLead } from '../../utils/bitrixService';
import { Download, Share2, CheckCircle2, AlertCircle, Loader2, Eye } from 'lucide-react';

export default function DocumentContainer({
  clientName,
  unitNo,
  selectedUnit,
  calculation,
  issueDate,
  customLayoutImage,
  leadId
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'p1' | 'p2' | 'p3' | 'p4'
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [bitrixWebhookUrl, setBitrixWebhookUrl] = useState('');
  const [isAttachingBitrix, setIsAttachingBitrix] = useState(false);
  const [bitrixSuccessMsg, setBitrixSuccessMsg] = useState('');
  const [bitrixErrMsg, setBitrixErrMsg] = useState('');
  const [showBitrixModal, setShowBitrixModal] = useState(false);

  // Handle Download PDF
  const handleDownload = async () => {
    try {
      setIsGeneratingPdf(true);
      await generatePdfProposal({ clientName, unitNo });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle Attach to Bitrix Lead
  const handleBitrixAttach = async () => {
    setBitrixSuccessMsg('');
    setBitrixErrMsg('');

    if (!bitrixWebhookUrl) {
      setBitrixErrMsg('Please enter your Bitrix24 Webhook URL.');
      return;
    }
    if (!leadId) {
      setBitrixErrMsg('Please specify a Lead ID in the offer controls.');
      return;
    }

    try {
      setIsAttachingBitrix(true);
      // First generate PDF blob
      const result = await generatePdfProposal({ clientName, unitNo });
      if (!result) throw new Error('Could not generate PDF for attachment.');

      await attachPdfToBitrixLead({
        webhookUrl: bitrixWebhookUrl,
        leadId,
        pdfBlob: result.blob,
        filename: result.filename,
        unitNo,
        clientName
      });

      setBitrixSuccessMsg(`Successfully attached PDF to Bitrix24 Lead #${leadId}!`);
    } catch (err) {
      console.error('Bitrix Attachment Error:', err);
      setBitrixErrMsg(err.message || 'Failed to attach proposal to Bitrix Lead.');
    } finally {
      setIsAttachingBitrix(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar & Page Tabs */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Page Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'all' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            All 4 Pages
          </button>
          <button
            onClick={() => setActiveTab('p1')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'p1' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Page 1: Cover
          </button>
          <button
            onClick={() => setActiveTab('p2')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'p2' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Page 2: Layout
          </button>
          <button
            onClick={() => setActiveTab('p3')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'p3' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Page 3: Payment
          </button>
          <button
            onClick={() => setActiveTab('p4')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'p4' ? 'bg-[#3ba1db] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
          >
            Page 4: Ending
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowBitrixModal(!showBitrixModal)}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold px-4 py-2.5 rounded-xl border border-slate-600 text-xs flex items-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4 text-[#3ba1db]" />
            Bitrix CRM Attach
          </button>

          <button
            onClick={handleDownload}
            disabled={isGeneratingPdf}
            className="bg-gradient-to-r from-[#D4AF37] to-amber-500 hover:from-amber-400 hover:to-amber-600 text-[#162840] font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 text-xs flex items-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF Proposal
              </>
            )}
          </button>
        </div>

      </div>

      {/* Bitrix Webhook Modal / Dropdown Panel */}
      {showBitrixModal && (
        <div className="bg-slate-800 border-2 border-[#3ba1db]/40 rounded-2xl p-5 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#3ba1db]" /> Attach Proposal to Bitrix24 CRM Lead
            </h3>
            <button onClick={() => setShowBitrixModal(false)} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">BITRIX24 REST WEBHOOK URL</label>
              <input
                type="url"
                value={bitrixWebhookUrl}
                onChange={(e) => setBitrixWebhookUrl(e.target.value)}
                placeholder="https://yourdomain.bitrix24.com/rest/1/your_key/"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-slate-200 focus:outline-none focus:border-[#3ba1db]"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">TARGET LEAD ID</label>
              <input
                type="text"
                value={leadId}
                disabled
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg p-2.5 font-bold text-white opacity-80"
              />
            </div>
          </div>

          {bitrixSuccessMsg && (
            <div className="p-3 bg-emerald-900/50 border border-emerald-500 rounded-lg text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {bitrixSuccessMsg}
            </div>
          )}
          {bitrixErrMsg && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" /> {bitrixErrMsg}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleBitrixAttach}
              disabled={isAttachingBitrix}
              className="bg-[#3ba1db] hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isAttachingBitrix ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Uploading to Bitrix...
                </>
              ) : (
                'Send Proposal to Lead Timeline'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Pages Preview Viewport */}
      <div className="flex flex-col items-center space-y-12 overflow-x-auto py-4 bg-slate-950/80 p-8 rounded-2xl border border-slate-800 shadow-inner">
        
        {/* Page 1 */}
        {(activeTab === 'all' || activeTab === 'p1') && (
          <div className="transform scale-90 sm:scale-100 transition-all origin-top shadow-2xl rounded-sm overflow-hidden">
            <Page1Cover clientName={clientName} unitNo={unitNo} />
          </div>
        )}

        {/* Page 2 */}
        {(activeTab === 'all' || activeTab === 'p2') && (
          <div className="transform scale-90 sm:scale-100 transition-all origin-top shadow-2xl rounded-sm overflow-hidden">
            <Page2LayoutPlan selectedUnit={selectedUnit} customLayoutImage={customLayoutImage} />
          </div>
        )}

        {/* Page 3 */}
        {(activeTab === 'all' || activeTab === 'p3') && (
          <div className="transform scale-90 sm:scale-100 transition-all origin-top shadow-2xl rounded-sm overflow-hidden">
            <Page3PaymentPlan calculation={calculation} issueDate={issueDate} />
          </div>
        )}

        {/* Page 4 */}
        {(activeTab === 'all' || activeTab === 'p4') && (
          <div className="transform scale-90 sm:scale-100 transition-all origin-top shadow-2xl rounded-sm overflow-hidden">
            <Page4BackCover />
          </div>
        )}

      </div>

    </div>
  );
}
