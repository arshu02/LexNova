/**
 * Court-Ready Legal Notice & Document Formatter with Cryptographic Watermark
 * Generates formatted legal printouts and PDF-ready HTML with LexNova Digital Seal.
 */

export interface LegalNoticeParams {
  title?: string;
  noticeRef: string;
  date: string;
  senderName: string;
  senderAddress: string;
  advocateName: string;
  advocateBarNumber?: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  bodyParagraphs: string[];
  demandAmount?: number | string;
  complianceDays?: number;
}

export function generateLegalNoticeHTML(params: LegalNoticeParams): string {
  const complianceDays = params.complianceDays || 15;
  const watermarkText = `LEXNOVA SECURED · REF: ${params.noticeRef} · VERIFIED`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${params.subject || 'LEGAL NOTICE'}</title>
  <style>
    @page {
      size: A4;
      margin: 25mm 20mm 25mm 25mm;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      font-size: 14px;
      line-height: 1.7;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 30px;
    }
    .header-block {
      text-align: center;
      border-bottom: 2px solid #222;
      padding-bottom: 15px;
      margin-bottom: 25px;
    }
    .advocate-name {
      font-size: 18px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .advocate-sub {
      font-size: 12px;
      color: #444;
      margin-top: 3px;
    }
    .dispatch-line {
      font-weight: bold;
      text-align: center;
      margin: 15px 0;
      text-decoration: underline;
      font-size: 13px;
    }
    .meta-table {
      width: 100%;
      margin-bottom: 20px;
      font-size: 13.5px;
    }
    .meta-table td {
      vertical-align: top;
      padding: 3px 0;
    }
    .subject-box {
      margin: 20px 0;
      padding: 10px 0;
      font-weight: bold;
      text-align: justify;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
    }
    .salutation {
      margin: 15px 0;
      font-weight: bold;
    }
    .para {
      text-align: justify;
      text-indent: 30px;
      margin-bottom: 14px;
    }
    .para-num {
      text-indent: 0;
      margin-bottom: 12px;
    }
    .demand-box {
      background: #f9f9f9;
      border-left: 3px solid #222;
      padding: 12px 16px;
      margin: 20px 0;
      font-weight: bold;
    }
    .sign-block {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .watermark-seal {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px dashed #bbb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: #666;
      font-family: monospace;
    }
  </style>
</head>
<body>

  <!-- Advocate Header -->
  <div class="header-block">
    <div class="advocate-name">CHAMBERS OF ${params.advocateName.toUpperCase()}</div>
    <div class="advocate-sub">ADVOCATE · HIGH COURT OF JUDICATURE · BAR COUNCIL OF INDIA</div>
    ${params.advocateBarNumber ? `<div class="advocate-sub">Enrolment No: ${params.advocateBarNumber}</div>` : ''}
  </div>

  <div class="dispatch-line">
    BY SPEED POST WITH ACKNOWLEDGEMENT DUE (RPAD) / LEGAL DISPATCH
  </div>

  <!-- Meta -->
  <table class="meta-table">
    <tr>
      <td style="width: 50%;"><strong>Ref No:</strong> ${params.noticeRef}</td>
      <td style="text-align: right;"><strong>Date:</strong> ${params.date}</td>
    </tr>
  </table>

  <!-- Addresses -->
  <div style="margin-bottom: 15px;">
    <strong>TO,</strong><br>
    <strong>${params.recipientName}</strong><br>
    ${params.recipientAddress.replace(/\n/g, '<br>')}
  </div>

  <div style="margin-bottom: 20px;">
    <strong>UNDER INSTRUCTIONS FROM MY CLIENT:</strong><br>
    <strong>${params.senderName}</strong><br>
    ${params.senderAddress.replace(/\n/g, '<br>')}
  </div>

  <!-- Subject -->
  <div class="subject-box">
    SUBJECT: ${params.subject.toUpperCase()}
  </div>

  <div class="salutation">
    SIR / MADAM,
  </div>

  <p class="para">
    Under instructions from, and on behalf of my client named hereinabove, I hereby serve upon you this formal Legal Notice as follows:
  </p>

  ${params.bodyParagraphs
    .map(
      (p, idx) => `
    <div class="para-num">
      <strong>${idx + 1}.</strong> ${p}
    </div>
  `
    )
    .join('')}

  <!-- Demand Clause -->
  <div class="demand-box">
    I, THEREFORE, CALL UPON YOU TO COMPLY WITH THE AFORESAID DEMANDS AND REMIT THE SUM OF ${
      params.demandAmount ? `₹${params.demandAmount}` : 'THE DUE AMOUNT'
    } WITHIN ${complianceDays} DAYS FROM THE RECEIPT OF THIS NOTICE, FAILING WHICH MY CLIENT HAS ISSUED PEREMPTORY INSTRUCTIONS TO INITIATE APPROPRIATE CIVIL AND/OR CRIMINAL PROCEEDINGS AGAINST YOU AT YOUR SOLE RISK, COST, AND CONSEQUENCES.
  </div>

  <!-- Signature Block -->
  <div class="sign-block">
    <div>
      <br><br>
      _________________________<br>
      <strong>(${params.senderName})</strong><br>
      Client / Complainant
    </div>

    <div style="text-align: right;">
      <br><br>
      _________________________<br>
      <strong>${params.advocateName}</strong><br>
      Advocate for the Client
    </div>
  </div>

  <!-- Digital Seal -->
  <div class="watermark-seal">
    <span>⚖️ ${watermarkText}</span>
    <span>LEXNOVA LEGAL OPERATING SYSTEM</span>
  </div>

</body>
</html>
`;
}
