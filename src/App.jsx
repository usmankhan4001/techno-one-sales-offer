import React, { useState, useEffect, useMemo } from 'react';
import { INVENTORY } from './data/inventoryData';
import { calculatePaymentPlan } from './utils/calculator';
import ModularCalculator from './components/calculator/ModularCalculator';
import HiddenPdfContainer from './components/doc/HiddenPdfContainer';
import { generatePdfProposal } from './utils/pdfGenerator';
import { initBitrixPlacement, attachProposalToLeadCard, isBitrixEnvironment } from './utils/bitrix24';

export default function App() {
  const [projectName, setProjectName] = useState('Techno One');
  const [selectedUnit, setSelectedUnit] = useState(INVENTORY[0] || null);
  const [clientName, setClientName] = useState('Valued Client');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [customRate, setCustomRate] = useState(INVENTORY[0]?.ratePerSqFt || 50000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [possessionPercent, setPossessionPercent] = useState(10);
  const [durationMonths, setDurationMonths] = useState(24);
  const [planType, setPlanType] = useState('monthly');
  const [fullPaymentDiscountPercent, setFullPaymentDiscountPercent] = useState(5);
  const [balloonPayments, setBalloonPayments] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  // Bitrix24 state
  const [isInBitrix, setIsInBitrix] = useState(false);
  const [bitrixLeadId, setBitrixLeadId] = useState(null);
  const [isAttachingBitrix, setIsAttachingBitrix] = useState(false);
  const [bitrixStatusMsg, setBitrixStatusMsg] = useState(null);

  // PWA Install Prompt State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Capture PWA Install Event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const choiceResult = await deferredInstallPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      setDeferredInstallPrompt(null);
    }
  };

  // Initialize Bitrix24 Lead Placement on app load
  useEffect(() => {
    const checkBitrix = async () => {
      if (isBitrixEnvironment()) {
        setIsInBitrix(true);
        const res = await initBitrixPlacement();
        if (res?.leadId) {
          setBitrixLeadId(res.leadId);
        }
        if (res?.clientName) {
          setClientName(res.clientName);
        }
      }
    };
    checkBitrix();
  }, []);

  // Real-time calculation
  const calculation = useMemo(() => {
    if (!selectedUnit) return null;
    return calculatePaymentPlan({
      areaSqFt: selectedUnit.areaSqFt,
      ratePerSqFt: customRate || selectedUnit.ratePerSqFt,
      downPaymentPercent,
      possessionPercent,
      durationMonths,
      planType,
      fullPaymentDiscountPercent,
      balloonPayments,
      issueDate
    });
  }, [
    selectedUnit,
    customRate,
    downPaymentPercent,
    possessionPercent,
    durationMonths,
    planType,
    fullPaymentDiscountPercent,
    balloonPayments,
    issueDate
  ]);

  // Handle Local PDF Download
  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      await generatePdfProposal({
        clientName,
        unitNo: selectedUnit?.unitNo || 'M-02'
      });
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Error exporting PDF proposal. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle Direct Attachment to Bitrix24 Lead Card
  const handleAttachToBitrix = async () => {
    setBitrixStatusMsg(null);
    if (!bitrixLeadId) {
      alert('No Bitrix24 Lead ID detected in this placement context.');
      return;
    }

    try {
      setIsAttachingBitrix(true);
      const result = await generatePdfProposal({
        clientName,
        unitNo: selectedUnit?.unitNo || 'M-02'
      });

      if (!result?.blob) {
        throw new Error('Failed to generate proposal PDF blob.');
      }

      await attachProposalToLeadCard({
        leadId: bitrixLeadId,
        pdfBlob: result.blob,
        filename: result.filename,
        unitNo: selectedUnit?.unitNo || 'M-02',
        clientName
      });

      setBitrixStatusMsg({ type: 'success', text: `Proposal successfully attached to Bitrix24 Lead #${bitrixLeadId}!` });
    } catch (err) {
      console.error('Bitrix Attachment Error:', err);
      setBitrixStatusMsg({ type: 'error', text: err.message || 'Failed to attach proposal to Bitrix24 Lead.' });
    } finally {
      setIsAttachingBitrix(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-3 sm:py-5">
      
      {/* Bitrix Status Message Banner */}
      {bitrixStatusMsg && (
        <div className="max-w-7xl mx-auto px-4 mb-3">
          <div className={`p-3.5 rounded-xl shadow-md text-xs font-bold flex items-center justify-between ${
            bitrixStatusMsg.type === 'success' ? 'bg-emerald-900 text-emerald-100 border border-emerald-500' : 'bg-red-900 text-red-100 border border-red-500'
          }`}>
            <span>{bitrixStatusMsg.text}</span>
            <button onClick={() => setBitrixStatusMsg(null)} className="text-white hover:underline ml-2">✕ Close</button>
          </div>
        </div>
      )}

      {/* Main Calculator Interface */}
      <ModularCalculator
        projectName={projectName}
        setProjectName={setProjectName}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        clientName={clientName}
        setClientName={setClientName}
        customRate={customRate}
        setCustomRate={setCustomRate}
        downPaymentPercent={downPaymentPercent}
        setDownPaymentPercent={setDownPaymentPercent}
        possessionPercent={possessionPercent}
        setPossessionPercent={setPossessionPercent}
        durationMonths={durationMonths}
        setDurationMonths={setDurationMonths}
        planType={planType}
        setPlanType={setPlanType}
        fullPaymentDiscountPercent={fullPaymentDiscountPercent}
        setFullPaymentDiscountPercent={setFullPaymentDiscountPercent}
        balloonPayments={balloonPayments}
        setBalloonPayments={setBalloonPayments}
        calculation={calculation}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
        isInBitrix={isInBitrix}
        bitrixLeadId={bitrixLeadId}
        onAttachToBitrix={handleAttachToBitrix}
        isAttachingBitrix={isAttachingBitrix}
        canInstallPwa={Boolean(deferredInstallPrompt)}
        onInstallPwa={handleInstallApp}
      />

      {/* Hidden PDF Export DOM Container */}
      <HiddenPdfContainer
        clientName={clientName}
        unitNo={selectedUnit?.unitNo || 'M-02'}
        selectedUnit={selectedUnit}
        calculation={calculation}
        issueDate={issueDate}
      />

    </div>
  );
}
