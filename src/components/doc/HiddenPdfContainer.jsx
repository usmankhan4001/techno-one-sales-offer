import React from 'react';
import { formatPKR } from '../../data/inventoryData';

// Helper to resolve asset paths safely under file:// protocol (Electron) and web
function getAssetPath(path) {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  if (path.startsWith('./')) return path;
  if (path.startsWith('/')) {
    return '.' + path;
  }
  return './' + path;
}

export default function HiddenPdfContainer({
  clientName = 'Valued Client',
  unitNo = 'M-02',
  selectedUnit,
  calculation,
  issueDate
}) {
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

  const formattedIssueDate = issueDate
    ? new Date(issueDate).toLocaleDateString('en-GB')
    : new Date().toLocaleDateString('en-GB');

  let durationText = `${durationMonths} Months`;
  if (planType === 'full_payment') {
    durationText = 'Lump Sum Cash';
  }

  // 25 rows on page 1 of table, 30 rows on continuation page of table
  const ROWS_PAGE_1 = 25;
  const ROWS_PAGE_2 = 30;

  const scheduleChunks = [];
  if (schedule.length <= ROWS_PAGE_1) {
    scheduleChunks.push(schedule);
  } else {
    scheduleChunks.push(schedule.slice(0, ROWS_PAGE_1));
    let remaining = schedule.slice(ROWS_PAGE_1);
    while (remaining.length > 0) {
      scheduleChunks.push(remaining.slice(0, ROWS_PAGE_2));
      remaining = remaining.slice(ROWS_PAGE_2);
    }
  }

  const titlePageImg = getAssetPath('/assets/template_title_page.png');
  const tablePageImg = getAssetPath('/assets/template_table_page.png');
  const tableContinuationImg = getAssetPath('/assets/template_table_page_continuation.png');
  const backCoverImg = getAssetPath('/assets/page_4_back_cover.png');
  const dedicatedUnitPlanImg = getAssetPath(`/unit_plans/${unitNo}.png`);

  return (
    <div id="hidden-pdf-export-root" className="fixed top-[-9999px] left-[-9999px] opacity-0 pointer-events-none">
      
      {/* ================= PAGE 1: COVER TITLE PAGE ================= */}
      <div className="pdf-page-container relative bg-white overflow-hidden shadow-none">
        <img
          src={titlePageImg}
          alt="Techno One Cover Title Page"
          className="w-full h-full object-cover"
        />

        {/* Dynamic Client Name & Unit No Overlays */}
        <div className="absolute top-[962px] left-[62px] z-10">
          <div className="text-[19px] font-bold text-white uppercase tracking-wider font-heading leading-none">
            {clientName || 'VALUED CLIENT'}
          </div>
        </div>

        <div className="absolute top-[1021px] left-[62px] z-10">
          <div className="text-[19px] font-bold text-white uppercase tracking-wider font-heading leading-none">
            {unitNo || 'N/A'}
          </div>
        </div>
      </div>

      {/* ================= PAGE 2: UNIT LAYOUT PLAN PAGE ================= */}
      <div className="pdf-page-container relative bg-white overflow-hidden shadow-none">
        <img
          src={dedicatedUnitPlanImg}
          alt={`Unit Plan ${unitNo}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ================= PAGE 3 (+ CONTINUATION PAGE IF NEEDED): PAYMENT PLAN TABLE ================= */}
      {scheduleChunks.map((chunk, pageIdx) => {
        const isFirstTablePage = pageIdx === 0;
        const bgTemplate = isFirstTablePage ? tablePageImg : tableContinuationImg;
        const tableTopPx = isFirstTablePage ? '272px' : '138.1px';

        return (
          <div key={pageIdx} className="pdf-page-container relative bg-white overflow-hidden shadow-none">
            {/* Background Image Template */}
            <img
              src={bgTemplate}
              alt={`Techno One Table Page ${pageIdx + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Summary Grid Overlay ONLY on Table Page 1 */}
            {isFirstTablePage && (
              <div className="absolute top-[112px] left-[50px] right-[50px] h-[100px] z-10 text-[12px] font-medium text-[#162840]">
                {/* Row 1 */}
                <div className="absolute top-[0px] left-[220px] w-[120px] text-right">
                  {formatPKR(totalPrice)}
                </div>
                <div className="absolute top-[0px] left-[550px] w-[130px] text-right">
                  {formatPKR(downPaymentAmount)}
                </div>

                {/* Row 2 */}
                <div className="absolute top-[26.5px] left-[220px] w-[120px] text-right">
                  {formatPKR(ratePerSqFt)}
                </div>
                <div className="absolute top-[26.5px] left-[550px] w-[130px] text-right">
                  {formatPKR(possessionAmount)}
                </div>

                {/* Row 3 */}
                <div className="absolute top-[53px] left-[220px] w-[120px] text-right">
                  {formattedIssueDate}
                </div>
                <div className="absolute top-[53px] left-[550px] w-[130px] text-right">
                  {planType === 'full_payment'
                    ? `- ${formatPKR(fullPaymentDiscountAmount)}`
                    : formatPKR(standardInstallmentAmount)}
                </div>

                {/* Row 4 */}
                <div className="absolute top-[79.5px] left-[220px] w-[120px] text-right">
                  {durationText}
                </div>
                <div className="absolute top-[79.5px] left-[550px] w-[130px] text-right">
                  {formatPKR(totalBalloonAmount)}
                </div>
              </div>
            )}

            {/* Schedule Table Rows Overlay */}
            <div className="absolute left-[46.4px] w-[704px] z-30" style={{ top: tableTopPx }}>
              <table className="w-full text-left border-collapse table-fixed">
                <colgroup>
                  <col className="w-[176px]" />
                  <col className="w-[176px]" />
                  <col className="w-[176px]" />
                  <col className="w-[176px]" />
                </colgroup>
                <tbody>
                  {chunk.map((row, rIdx) => {
                    return (
                      <tr key={row.id || rIdx} className="h-[28.17px] max-h-[28.17px] border-b border-transparent">
                        <td className="w-[176px] font-normal text-center text-[#162840] align-middle text-[12px] leading-tight px-1 overflow-hidden truncate">
                          {row.installmentNo}
                        </td>
                        <td className="w-[176px] font-normal text-slate-700 align-middle text-[12px] leading-tight px-3 overflow-hidden truncate">
                          {row.date}
                        </td>
                        <td className="w-[176px] font-normal text-right pr-4 text-[#162840] align-middle text-[12px] leading-tight overflow-hidden truncate">
                          {formatPKR(row.amount)}
                        </td>
                        <td className="w-[176px] font-normal text-right pr-4 text-[#162840] align-middle text-[12px] leading-tight overflow-hidden truncate">
                          {formatPKR(row.amountDue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        );
      })}

      {/* ================= FINAL PAGE: BACK COVER PAGE ================= */}
      <div className="pdf-page-container relative bg-[#162840] overflow-hidden shadow-none">
        <img
          src={backCoverImg}
          alt="Techno One Back Cover"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
