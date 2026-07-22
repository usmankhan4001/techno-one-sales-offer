export function calculatePaymentPlan({
  areaSqFt = 0,
  ratePerSqFt = 0,
  downPaymentPercent = 30,
  possessionPercent = 10,
  durationMonths = 24, // Capped at max 24
  planType = 'monthly', // 'monthly' | 'quarterly' | 'full_payment'
  fullPaymentDiscountPercent = 5,
  balloonPayments = [], // [{ id, month, amount, label }]
  issueDate = new Date().toISOString().split('T')[0]
}) {
  const cappedDuration = Math.min(24, Math.max(1, durationMonths));
  const totalPrice = areaSqFt * ratePerSqFt;
  const startDate = new Date(issueDate);

  if (planType === 'full_payment') {
    const discountAmount = totalPrice * (fullPaymentDiscountPercent / 100);
    const netPrice = totalPrice - discountAmount;
    
    return {
      totalPrice,
      ratePerSqFt,
      areaSqFt,
      downPaymentPercent: 100,
      downPaymentAmount: netPrice,
      possessionPercent: 0,
      possessionAmount: 0,
      durationMonths: 0,
      planType,
      fullPaymentDiscountPercent,
      fullPaymentDiscountAmount: discountAmount,
      standardInstallmentAmount: 0,
      totalBalloonAmount: 0,
      schedule: [
        {
          id: 'full-1',
          installmentNo: '1',
          date: formatDate(startDate),
          type: 'full_payment',
          description: `Full Cash Payment (${fullPaymentDiscountPercent}% Discount Applied)`,
          amount: netPrice,
          amountDue: 0
        }
      ]
    };
  }

  const downPaymentAmount = totalPrice * (downPaymentPercent / 100);
  const possessionAmount = totalPrice * (possessionPercent / 100);

  // Sum balloons
  const validBalloons = balloonPayments.filter(b => b.month > 0 && b.amount > 0);
  const totalBalloonAmount = validBalloons.reduce((sum, b) => sum + Number(b.amount), 0);

  // Net balance to finance via installments
  const netFinanced = totalPrice - downPaymentAmount - possessionAmount - totalBalloonAmount;

  let installmentCount = cappedDuration;
  let monthStep = 1;

  if (planType === 'quarterly') {
    installmentCount = Math.max(1, Math.floor(cappedDuration / 3));
    monthStep = 3;
  }

  const standardInstallmentAmount = netFinanced > 0 ? netFinanced / installmentCount : 0;

  // Build Schedule
  const schedule = [];
  let currentBalance = totalPrice - downPaymentAmount;

  // Down Payment Entry (At Booking)
  schedule.push({
    id: 'dp-0',
    installmentNo: 'Down Payment',
    date: formatDate(startDate),
    type: 'down_payment',
    description: `Down Payment (${downPaymentPercent}%)`,
    amount: downPaymentAmount,
    amountDue: currentBalance
  });

  for (let i = 1; i <= installmentCount; i++) {
    const currentMonthNum = i * monthStep;
    const instDate = new Date(startDate);
    instDate.setMonth(instDate.getMonth() + currentMonthNum);

    currentBalance -= standardInstallmentAmount;
    
    const monthBalloons = validBalloons.filter(b => {
      if (planType === 'quarterly') {
        return b.month > (i - 1) * 3 && b.month <= i * 3;
      }
      return b.month === i;
    });

    schedule.push({
      id: `inst-${i}`,
      installmentNo: planType === 'quarterly' ? `Q${i}` : `${i}`,
      date: formatDate(instDate),
      type: 'installment',
      description: planType === 'quarterly' ? `Quarterly Installment ${i}` : `Monthly Installment ${i}`,
      amount: standardInstallmentAmount,
      amountDue: Math.max(0, currentBalance)
    });

    monthBalloons.forEach((b, bIdx) => {
      currentBalance -= Number(b.amount);
      schedule.push({
        id: `balloon-${i}-${bIdx}`,
        installmentNo: `Balloon`,
        date: formatDate(instDate),
        type: 'balloon',
        description: b.label || `Balloon Payment (Month ${b.month})`,
        amount: Number(b.amount),
        amountDue: Math.max(0, currentBalance)
      });
    });
  }

  // Possession Row
  if (possessionAmount > 0) {
    const possessionDate = new Date(startDate);
    possessionDate.setMonth(possessionDate.getMonth() + cappedDuration);
    currentBalance -= possessionAmount;

    schedule.push({
      id: 'possession-final',
      installmentNo: 'Possession',
      date: formatDate(possessionDate),
      type: 'possession',
      description: `Possession Payment (${possessionPercent}%)`,
      amount: possessionAmount,
      amountDue: 0
    });
  }

  return {
    totalPrice,
    ratePerSqFt,
    areaSqFt,
    downPaymentPercent,
    downPaymentAmount,
    possessionPercent,
    possessionAmount,
    durationMonths: cappedDuration,
    planType,
    fullPaymentDiscountPercent: 0,
    fullPaymentDiscountAmount: 0,
    standardInstallmentAmount,
    totalBalloonAmount,
    schedule
  };
}

function formatDate(d) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
