import React, { useState, useMemo } from 'react';
import { INVENTORY } from './data/inventoryData';
import { calculatePaymentPlan } from './utils/calculator';
import ModularCalculator from './components/calculator/ModularCalculator';
import HiddenPdfContainer from './components/doc/HiddenPdfContainer';
import { generatePdfProposal } from './utils/pdfGenerator';

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
  const [customLayoutImage, setCustomLayoutImage] = useState(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-6 sm:py-8">
      
      {/* Screen View: Calculator & Interactive Table */}
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
        customLayoutImage={customLayoutImage}
        setCustomLayoutImage={setCustomLayoutImage}
      />

      {/* Hidden PDF Container for Background PDF Generation */}
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
