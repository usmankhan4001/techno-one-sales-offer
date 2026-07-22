import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generatePdfProposal({ clientName = 'Valued Client', unitNo = 'N/A' }) {
  const pageElements = document.querySelectorAll('.pdf-page-container');
  if (!pageElements || pageElements.length === 0) {
    alert('Document pages not found for PDF export.');
    return null;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const totalPages = pageElements.length;

  for (let i = 0; i < totalPages; i++) {
    const el = pageElements[i];

    // High resolution canvas capture at scale 2 (192 DPI)
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // A4 dimensions: 210mm width, 297mm height
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  const filename = `Techno_One_Sales_Offer_${unitNo}_${clientName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  pdf.save(filename);

  // Return PDF blob for Bitrix webhook attachment
  const blob = pdf.output('blob');
  return { blob, filename };
}
