import React from 'react';
import { formatPKR } from '../../data/inventoryData';

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

  // 25 rows per page max
  const ROWS_PER_PAGE = 25;
  const scheduleChunks = [];
  for (let i = 0; i < schedule.length; i += ROWS_PER_PAGE) {
    scheduleChunks.push(schedule.slice(i, i + ROWS_PER_PAGE));
  }
  if (scheduleChunks.length === 0) {
    scheduleChunks.push([]);
  }

  const dedicatedUnitPlanImg = `/unit_plans/${unitNo}.png`;

  return (
    <div id="hidden-pdf-export-root" className="fixed top-[-9999px] left-[-9999px] opacity-0 pointer-events-none">
      
      {/* ================= PAGE 1: COVER TITLE PAGE ================= */}
      <div className="pdf-page-container relative bg-white overflow-hidden shadow-none">
        <img
          src="/assets/template_title_page.png"
          alt="Techno One Cover Title Page"
          className="w-full h-full object-cover"
        />

        {/* Dynamic Client Name & Unit No Overlays - Work Sans font, regular font weight, aligned left at 62px */}
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

      {/* ================= PAGE 3 (+ CONTINUATION PAGE IF >25 ROWS): PAYMENT PLAN TABLE ================= */}
      {scheduleChunks.map((chunk, pageIdx) => {
        const isFirstTablePage = pageIdx === 0;

        return (
          <div key={pageIdx} className="pdf-page-container relative bg-white overflow-hidden shadow-none">
            {/* Background Image: Template Table Page */}
            <img
              src="/assets/template_table_page.png"
              alt="Techno One Table Page Template"
              className="w-full h-full object-cover"
            />

            {/* Summary Grid Overlay ONLY on Table Page 1 */}
            {isFirstTablePage ? (
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
            ) : (
              /* On Table Page 2+, cover/remove the summary section entirely with background color overlay */
              <div className="absolute top-[48px] left-[45px] right-[45px] h-[178px] bg-[#f8f9fa] z-20"></div>
            )}

            {/* Schedule Table Rows Overlay - Font size 12px, font-weight normal (400) */}
            <div className="absolute top-[272px] left-[46.4px] w-[704px] z-30">
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
          src="/assets/page_4_back_cover.png"
          alt="Techno One Back Cover"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
}
