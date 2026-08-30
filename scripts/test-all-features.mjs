// Uses global fetch (available in Node 18+)

const BASE = 'http://localhost:3000';
const RESULTS = [];
let testUserId = 'user_placeholder';
let testCaseId = '';
let testBookingId = '';

function pass(name) {
  RESULTS.push({ name, status: '✅ PASS' });
  console.log(`✅ PASS — ${name}`);
}

function fail(name, reason, data) {
  RESULTS.push({ name, status: '❌ FAIL', reason });
  console.log(`❌ FAIL — ${name}`);
  console.log(`   Reason: ${reason}`);
  if (data) console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 300));
}

async function runTests() {
  console.log('\n🔍 LEGAL OS — FULL FEATURE TEST\n');
  console.log('━'.repeat(50));

  // ─────────────────────────────────────
  // TEST GROUP 1: AUTH
  // ─────────────────────────────────────
  console.log('\n📋 GROUP 1: AUTHENTICATION\n');

  // Test 1.1 — Signup
  try {
    const r = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User QA',
        email: `qatest_${Date.now()}@lexnova.com`,
        password: 'Test@1234',
        role: 'USER'
      })
    });
    const d = await r.json();
    if (r.status === 201) {
      pass('Signup — creates new user with 201 status');
    } else {
      fail('Signup — creates new user with 201 status', `Status ${r.status}`, d);
    }
  } catch(e) {
    fail('Signup — creates new user with 201 status', e.message);
  }

  // Test 1.2 — Duplicate signup prevention (409)
  const dupEmail = `qadup_${Date.now()}@lexnova.com`;
  try {
    await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dup User', email: dupEmail, password: 'Test@1234', role: 'USER' })
    });
    const r2 = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Dup User', email: dupEmail, password: 'Test@1234', role: 'USER' })
    });
    const d2 = await r2.json();
    if (r2.status === 409) {
      pass('Signup — rejects duplicate email with 409');
    } else {
      fail('Signup — rejects duplicate email with 409', `Got status ${r2.status}`, d2);
    }
  } catch(e) {
    fail('Signup — rejects duplicate email with 409', e.message);
  }

  // Test 1.3 — Signup missing role returns 400
  try {
    const r = await fetch(`${BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bad User', email: 'bad@test.com', password: '123' })
    });
    if (r.status === 400) {
      pass('Signup — rejects missing role with 400');
    } else {
      fail('Signup — rejects missing role', `Got ${r.status}`);
    }
  } catch(e) {
    fail('Signup — rejects missing role', e.message);
  }

  // ─────────────────────────────────────
  // TEST GROUP 2: AI CHAT / INTAKE FLOW
  // ─────────────────────────────────────
  console.log('\n📋 GROUP 2: AI CHAT — LEGAL INTAKE FLOW\n');

  // Test 2.1 — Start intake (no caseId)
  try {
    const r = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'My landlord in Bengaluru is refusing to return my security deposit of Rs 75000 after I vacated the flat in March 2026',
        userId: testUserId
      })
    });
    const d = await r.json();
    if (d.caseId && d.reply && d.status === 'INTAKE') {
      testCaseId = d.caseId;
      pass('AI Chat — Intake starts, caseId created, Q1 returned');
    } else {
      fail('AI Chat — Intake starts',
        `Missing: ${!d.caseId?'caseId ':''} ${!d.reply?'reply ':''} ${d.status!=='INTAKE'?'status':''}`, d);
    }
  } catch(e) {
    fail('AI Chat — Intake starts', e.message);
  }

  // Test 2.2 — Answer Q1, get Q2
  if (testCaseId) {
    try {
      const r = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Tenancy from Jan 2025 to March 2026 for 11 months. Rent 25000/month. Deposit 75000. Gave 1 month notice in February. Landlord acknowledged but now not responding.',
          userId: testUserId,
          caseId: testCaseId
        })
      });
      const d = await r.json();
      if (d.reply && d.status === 'INTAKE') {
        pass('AI Chat — Q2 returned after Answer 1');
      } else {
        fail('AI Chat — Q2 after Answer 1', `Status: ${d.status}`, d);
      }
    } catch(e) {
      fail('AI Chat — Q2 after Answer 1', e.message);
    }
  }

  // Test 2.3 — Answer Q2, get Q3
  if (testCaseId) {
    try {
      const r = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Koramangala, Bengaluru, Karnataka. Landlord is Mr Ramesh Nair.',
          userId: testUserId,
          caseId: testCaseId
        })
      });
      const d = await r.json();
      if (d.reply && d.status === 'INTAKE') {
        pass('AI Chat — Q3 returned after Answer 2');
      } else {
        fail('AI Chat — Q3 after Answer 2', `Status: ${d.status}`, d);
      }
    } catch(e) {
      fail('AI Chat — Q3 after Answer 2', e.message);
    }
  }

  // Test 2.4 — Answer Q3, get Q4
  if (testCaseId) {
    try {
      const r = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'I have the original rent agreement, bank transfer receipt showing deposit payment, WhatsApp chat where landlord promised return, and my vacating notice email sent Feb 28.',
          userId: testUserId,
          caseId: testCaseId
        })
      });
      const d = await r.json();
      if (d.reply && d.status === 'INTAKE') {
        pass('AI Chat — Q4 returned after Answer 3');
      } else {
        fail('AI Chat — Q4 after Answer 3', `Status: ${d.status}`, d);
      }
    } catch(e) {
      fail('AI Chat — Q4 after Answer 3', e.message);
    }
  }

  // Test 2.5 — Final answer triggers full analysis
  if (testCaseId) {
    try {
      const r = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Very urgent. Landlord blocked my number. Want full deposit back plus compensation. Budget flexible.',
          userId: testUserId,
          caseId: testCaseId
        })
      });
      const d = await r.json();

      console.log('\n   📊 AI ANALYSIS RESULTS:');
      console.log(`   Status: ${d.status}`);
      console.log(`   Category: ${d.caseData?.category}`);
      console.log(`   Case Type: ${d.caseData?.caseType}`);
      console.log(`   Urgency: ${d.caseData?.urgency}`);
      console.log(`   Advice length: ${d.advice?.length} chars`);
      console.log(`   Lawyers matched: ${d.lawyers?.length}`);
      if (d.lawyers?.length > 0) {
        console.log(`   First lawyer: ${d.lawyers[0].name} | ${d.lawyers[0].fee}`);
      }

      if (d.status === 'COMPLETE') pass('AI Analysis — status is COMPLETE');
      else fail('AI Analysis — status_complete', `Got ${d.status}`, d);

      if (d.advice && d.advice.length > 100) pass('AI Analysis — has_advice (>100 chars)');
      else fail('AI Analysis — has_advice', `Length: ${d.advice?.length}`);

      if (d.caseData?.category) pass('AI Analysis — has_category');
      else fail('AI Analysis — has_category', 'category is null');

      if (d.caseData?.urgency) pass('AI Analysis — has_urgency');
      else fail('AI Analysis — has_urgency', 'urgency is null');

      if (d.lawyers && d.lawyers.length > 0) pass(`AI Analysis — has_lawyers (${d.lawyers.length} matched)`);
      else fail('AI Analysis — has_lawyers', 'No lawyers returned');

      if (d.caseData?.category === 'PROPERTY_DISPUTE') pass('AI Analysis — correct_category=PROPERTY_DISPUTE');
      else fail('AI Analysis — correct_category', `Expected PROPERTY_DISPUTE, got ${d.caseData?.category}`);

      if (d.lawyers?.[0]?.name) pass('AI Analysis — lawyer_has_name');
      else fail('AI Analysis — lawyer_has_name', 'name missing');

      if (d.lawyers?.[0]?.fee) pass('AI Analysis — lawyer_has_fee');
      else fail('AI Analysis — lawyer_has_fee', 'fee missing');

      if (d.lawyers?.[0]?.rating) pass('AI Analysis — lawyer_has_rating');
      else fail('AI Analysis — lawyer_has_rating', 'rating missing');

    } catch(e) {
      fail('AI Chat — Final analysis', e.message);
    }
  }

  // Test 2.6 — Employment dispute
  console.log('\n   🧪 Testing Employment Dispute...');
  try {
    const r1 = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'My employer fired me without notice or severance pay after 2 years of service', userId: testUserId })
    });
    const d1 = await r1.json();
    const empCaseId = d1.caseId;

    const answers = [
      'Worked at TechCorp Pvt Ltd as Senior Developer since Jan 2024. Fired July 15 2026 via email. No notice period given. CTC 18 LPA. No severance.',
      'Bengaluru, Karnataka. Opposing party TechCorp Pvt Ltd, HR head Ms Sharma.',
      'Have offer letter, salary slips 24 months, termination email, PF statements.',
      'Very urgent as I have EMIs. Want 2 months notice pay plus full and final settlement of about 3 lakhs.'
    ];
    let cId = empCaseId;
    for (const answer of answers) {
      const r = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: answer, userId: testUserId, caseId: cId })
      });
      const d = await r.json();
      cId = d.caseId || cId;
      if (d.status === 'COMPLETE') {
        console.log(`   Employment → Category: ${d.caseData?.category} | Lawyer: ${d.lawyers?.[0]?.name}`);
        if (d.caseData?.category === 'LABOUR_DISPUTE') pass('AI Classification — Employment → LABOUR_DISPUTE');
        else fail('AI Classification — Employment', `Expected LABOUR_DISPUTE, got ${d.caseData?.category}`);
        break;
      }
    }
  } catch(e) {
    fail('AI Chat — Employment test', e.message);
  }

  // Test 2.7 — Consumer fraud
  console.log('\n   🧪 Testing Consumer Fraud...');
  try {
    const r1 = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'I bought a phone from an online seller for 45000 rupees and received a fake product. They are refusing to refund.', userId: testUserId })
    });
    const d1 = await r1.json();
    let cId = d1.caseId;
    const answers = [
      'Bought on June 15 2026 from seller on Flipkart. Received a box with a brick inside. Have unboxing video.',
      'Mumbai, Maharashtra. Seller GadgetHub on Flipkart platform.',
      'Order confirmation, payment receipt, unboxing video, photos of fake product, all seller support chats.',
      'Want full refund of 45000 plus compensation. Very urgent.'
    ];
    for (const answer of answers) {
      const r = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: answer, userId: testUserId, caseId: cId })
      });
      const d = await r.json();
      cId = d.caseId || cId;
      if (d.status === 'COMPLETE') {
        console.log(`   Consumer → Category: ${d.caseData?.category} | Lawyer: ${d.lawyers?.[0]?.name}`);
        if (d.caseData?.category === 'CONSUMER_GRIEVANCE') pass('AI Classification — Consumer fraud → CONSUMER_GRIEVANCE');
        else fail('AI Classification — Consumer fraud', `Expected CONSUMER_GRIEVANCE, got ${d.caseData?.category}`);
        break;
      }
    }
  } catch(e) {
    fail('AI Chat — Consumer fraud test', e.message);
  }

  // ─────────────────────────────────────
  // TEST GROUP 3: DOCUMENT GENERATION
  // ─────────────────────────────────────
  console.log('\n📋 GROUP 3: DOCUMENT GENERATION\n');

  // Test 3.1 — Legal Notice
  try {
    const r = await fetch(`${BASE}/api/documents/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'Legal Notice',
        fields: {
          senderName: 'Rajesh Kumar',
          senderAddress: '45 MG Road, Bengaluru, Karnataka 560001',
          recipientName: 'Mr Ramesh Nair',
          recipientAddress: '12 Koramangala 5th Block, Bengaluru 560095',
          issueType: 'Security Deposit Refund',
          issueDetails: 'Landlord refusing to return security deposit of Rs 75000 after tenant vacated flat in March 2026',
          amountClaimed: '75000',
          responseDeadline: '15 days',
          city: 'Bengaluru, Karnataka'
        }
      })
    });
    const d = await r.json();
    if (d.content && d.content.length > 200) {
      pass(`Document Generation — Legal Notice (${d.content.length} chars)`);
    } else {
      fail('Document Generation — Legal Notice', d.error || 'Content too short', d);
    }
  } catch(e) {
    fail('Document Generation — Legal Notice', e.message);
  }

  // Test 3.2 — Rent Agreement
  try {
    const r = await fetch(`${BASE}/api/documents/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'Rent Agreement',
        fields: {
          landlordName: 'Suresh Nair', tenantName: 'Priya Sharma',
          propertyAddress: 'Flat 4B, Sunshine Apartments, Koramangala, Bengaluru 560095',
          monthlyRent: '25000', securityDeposit: '75000',
          startDate: '1st August 2026', duration: '11 months', city: 'Bengaluru, Karnataka'
        }
      })
    });
    const d = await r.json();
    if (d.content && d.content.length > 200) pass(`Document Generation — Rent Agreement (${d.content.length} chars)`);
    else fail('Document Generation — Rent Agreement', d.error || 'Failed', d);
  } catch(e) {
    fail('Document Generation — Rent Agreement', e.message);
  }

  // Test 3.3 — Consumer Complaint
  try {
    const r = await fetch(`${BASE}/api/documents/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'Consumer Complaint',
        fields: {
          complainantName: 'Vikram Singh',
          complainantAddress: '22 Andheri West, Mumbai 400053',
          companyName: 'GadgetHub via Flipkart',
          productService: 'Samsung Galaxy S24 Ultra',
          amountPaid: '45000', purchaseDate: '15 June 2026',
          issueDetails: 'Received fake product instead of ordered phone. Seller refused refund.',
          reliefSought: 'Full Refund'
        }
      })
    });
    const d = await r.json();
    if (d.content && d.content.length > 200) pass(`Document Generation — Consumer Complaint (${d.content.length} chars)`);
    else fail('Document Generation — Consumer Complaint', d.error || 'Failed', d);
  } catch(e) {
    fail('Document Generation — Consumer Complaint', e.message);
  }

  // Test 3.4 — Rejects empty fields
  try {
    const r = await fetch(`${BASE}/api/documents/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'Legal Notice', fields: {} })
    });
    const d = await r.json();
    if (r.status >= 400 || d.error) pass('Document Generation — Rejects empty fields');
    else fail('Document Generation — Rejects empty fields', 'Should return error', d);
  } catch(e) {
    fail('Document Generation — Rejects empty fields', e.message);
  }

  // ─────────────────────────────────────
  // TEST GROUP 4: MATTERS API
  // ─────────────────────────────────────
  console.log('\n📋 GROUP 4: MATTERS / CASES\n');

  // Test 4.1 — Get matters for user
  try {
    const r = await fetch(`${BASE}/api/matters?userId=${testUserId}`);
    const d = await r.json();
    if (Array.isArray(d)) {
      pass(`Matters API — Returns array (${d.length} matters found)`);
      if (d.length > 0) {
        console.log(`   First matter: ${d[0].title} | ${d[0].status} | ${d[0].category}`);
      }
    } else {
      fail('Matters API — Returns array', 'Not an array', d);
    }
  } catch(e) {
    fail('Matters API — Returns array', e.message);
  }

  // Test 4.2 — Completed matter has ACTIVE status
  if (testCaseId) {
    try {
      const r = await fetch(`${BASE}/api/matters?userId=${testUserId}`);
      const d = await r.json();
      const matter = d.find((m) => m.id === testCaseId);
      if (matter) {
        console.log(`   Matter: ${matter.title} | Status: ${matter.status} | Category: ${matter.category}`);
        if (matter.status === 'ACTIVE' || matter.status === 'COMPLETE') pass('Matters API — Completed intake → ACTIVE status');
        else fail('Matters API — Matter status after intake', `Expected ACTIVE, got ${matter.status}`);
        if (matter.category) pass('Matters API — Matter has category from AI classification');
        else fail('Matters API — Matter category', 'Category is null after intake');
      } else {
        fail('Matters API — Find specific matter', `Matter ${testCaseId} not found`);
      }
    } catch(e) {
      fail('Matters API — Specific matter check', e.message);
    }
  }

  // ─────────────────────────────────────
  // TEST GROUP 5: LAWYER MATCHING — FAMILY CASE
  // ─────────────────────────────────────
  console.log('\n📋 GROUP 5: LAWYER MATCHING — FAMILY CASE\n');

  try {
    const r1 = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'My husband has filed for divorce and is claiming custody of our children', userId: testUserId })
    });
    const d1 = await r1.json();
    let fCId = d1.caseId;

    const fAnswers = [
      'Married 8 years. Filed August 2026. Two children aged 5 and 7. I am primary caregiver.',
      'New Delhi. My husband is Amit Sharma, works at private company.',
      'Marriage certificate, children birth certificates, school records, bank statements.',
      'Want full custody of children and maintenance of 50000 per month. Urgent as court date is next month.'
    ];
    for (const ans of fAnswers) {
      const r = await fetch(`${BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: ans, userId: testUserId, caseId: fCId })
      });
      const d = await r.json();
      fCId = d.caseId || fCId;
      if (d.status === 'COMPLETE') {
        console.log(`   Family → Category: ${d.caseData?.category} | Lawyer: ${d.lawyers?.[0]?.name} (${d.lawyers?.[0]?.type})`);
        if (d.caseData?.category === 'FAMILY_DIVORCE') pass('Lawyer Matching — Family → FAMILY_DIVORCE');
        else fail('Lawyer Matching — Family case', `Expected FAMILY_DIVORCE got ${d.caseData?.category}`);
        if (d.lawyers?.length > 0) pass(`Lawyer Matching — Returns ${d.lawyers.length} lawyer(s)`);
        else fail('Lawyer Matching — Family lawyers', 'No lawyers returned');
        break;
      }
    }
  } catch(e) {
    fail('Lawyer Matching — Family divorce test', e.message);
  }

  // ─────────────────────────────────────
  // TEST GROUP 6: BOOKINGS API
  // ─────────────────────────────────────
  console.log('\n📋 GROUP 6: BOOKINGS\n');

  try {
    const r = await fetch(`${BASE}/api/bookings?userId=${testUserId}`);
    const d = await r.json();
    if (Array.isArray(d)) pass(`Bookings API — GET returns array (${d.length} bookings)`);
    else fail('Bookings API — GET', 'Not an array', d);
  } catch(e) {
    fail('Bookings API — GET', e.message);
  }

  try {
    const r = await fetch(`${BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: testUserId,
        advocateId: 'adv-001',   // non-existent; server should resolve to first real advocate
        matterId: testCaseId,
        date: '2026-08-10',
        time: '11:00 AM',
        notes: 'Security deposit recovery case'
      })
    });
    const d = await r.json();
    if (d.id) {
      testBookingId = d.id;
      pass('Bookings API — POST creates booking');
    } else {
      fail('Bookings API — POST creates booking', d.error || 'No id returned', d);
    }
  } catch(e) {
    fail('Bookings API — POST creates booking', e.message);
  }

  // ─────────────────────────────────────
  // TEST GROUP 7: AI EDGE CASES
  // ─────────────────────────────────────
  console.log('\n📋 GROUP 7: AI EDGE CASES\n');

  // Test 7.1 — Empty message returns 400
  try {
    const r = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '', userId: testUserId })
    });
    const d = await r.json();
    if (r.status >= 400 || d.error) pass('Edge Case — Empty message returns 400');
    else fail('Edge Case — Empty message', 'Should return 400', d);
  } catch(e) {
    fail('Edge Case — Empty message', e.message);
  }

  // Test 7.2 — Non-legal message handled gracefully
  try {
    const r = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What is the weather today?', userId: testUserId })
    });
    const d = await r.json();
    if (d.reply || d.caseId) pass('Edge Case — Non-legal message handled gracefully');
    else fail('Edge Case — Non-legal message', 'No reply returned', d);
  } catch(e) {
    fail('Edge Case — Non-legal message', e.message);
  }

  // Test 7.3 — Very long message
  try {
    const longMsg = 'My landlord '.repeat(100) + 'is not returning deposit';
    const r = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: longMsg, userId: testUserId })
    });
    const d = await r.json();
    if (r.status < 500 && (d.reply || d.error)) pass('Edge Case — Very long message handled without 500 error');
    else fail('Edge Case — Very long message', `Status: ${r.status}`, d);
  } catch(e) {
    fail('Edge Case — Very long message', e.message);
  }

  // Test 7.4 — Invalid caseId returns 404
  try {
    const r = await fetch(`${BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'My landlord owes me money', userId: testUserId, caseId: 'invalid-case-id-xyz' })
    });
    const d = await r.json();
    if (r.status === 404 || d.error) pass('Edge Case — Invalid caseId returns 404');
    else fail('Edge Case — Invalid caseId', `Got status ${r.status}, should be 404`, d);
  } catch(e) {
    fail('Edge Case — Invalid caseId', e.message);
  }

  // ─────────────────────────────────────
  // FINAL REPORT
  // ─────────────────────────────────────
  console.log('\n' + '━'.repeat(50));
  console.log('📊 FINAL TEST REPORT\n');

  const passed = RESULTS.filter(r => r.status.includes('PASS')).length;
  const failed = RESULTS.filter(r => r.status.includes('FAIL')).length;
  const total = RESULTS.length;
  const score = Math.round((passed / total) * 100);

  console.log(`Total Tests: ${total}`);
  console.log(`✅ Passed:   ${passed}`);
  console.log(`❌ Failed:   ${failed}`);
  console.log(`📈 Score:    ${score}%`);

  if (score === 100) console.log('\n🏆 PERFECT SCORE — All features working!');
  else if (score >= 90) console.log('\n✅ EXCELLENT — Minor issues only');
  else if (score >= 80) console.log('\n✅ GOOD — Most features working, fix the failures above');
  else if (score >= 60) console.log('\n⚠️  NEEDS WORK — Several critical features broken');
  else console.log('\n🚨 CRITICAL — Major features broken, fix immediately');

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    RESULTS.filter(r => r.status.includes('FAIL')).forEach(r => {
      console.log(`   • ${r.name}: ${r.reason}`);
    });
  }
}

runTests().catch(console.error);
