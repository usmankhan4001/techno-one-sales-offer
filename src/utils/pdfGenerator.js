import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Helper: Preload all <img> tags inside container element to guarantee full rendering
async function preloadImages(container) {
  if (!container) return;
  const imgs = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue even if an image fails
      });
    })
  );
}

export async function generatePdfProposal({ clientName = 'Valued Client', unitNo = 'N/A' }) {
  const exportRoot = document.getElementById('hidden-pdf-export-root');
  if (!exportRoot) {
    alert('Document export container not found.');
    return null;
  }

  // Preload all background template & layout images first
  await preloadImages(exportRoot);

  const pageElements = exportRoot.querySelectorAll('.pdf-page-container');
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

    // High resolution canvas capture
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    // Standard A4 dimensions: 210mm x 297mm
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  }

  const sanitizedClient = clientName ? clientName.replace(/[^a-zA-Z0-9]/g, '_') : 'Client';
  const filename = `Techno_One_Sales_Offer_${unitNo}_${sanitizedClient}.pdf`;
  pdf.save(filename);

  const blob = pdf.output('blob');
  return { blob, filename };
}
