/* ============================================
   LEXDRIVE — Mock API
   Simulates Flask backend responses
   To switch to real backend: set USE_MOCK = false
   ============================================ */

const USE_MOCK = true;
const MOCK_DELAY = 1200; // ms — feels realistic

/* ── Mock delay helper ── */
function mockDelay() {
  return new Promise(res => setTimeout(res, MOCK_DELAY));
}

/* ══════════════════════════════════════
   MOCK DATA — /chat
══════════════════════════════════════ */
const CHAT_RESPONSES = {
  "red light": `Under the Motor Vehicles (Amendment) Act 2019, jumping a red light is punishable with a fine of **₹1,000 to ₹5,000** depending on the state and offence number.\n\n**First offence:** ₹1,000–₹2,000\n**Repeat offence:** Up to ₹5,000 + possible licence suspension\n\nIn Tamil Nadu and Delhi, traffic cameras automatically capture violations and e-challans are sent to the registered vehicle owner's address.`,

  "mobile phone": `Using a mobile phone while driving is a serious offence under **Section 184 of the Motor Vehicles Act**.\n\n**Fine:** ₹1,000 (first offence) | ₹10,000 (repeat offence)\n**Additional consequence:** 3-month licence suspension on repeat offence\n\nThis applies to handheld calls, texting, and using apps. Hands-free devices are permitted but discouraged on busy roads.`,

  "rights": `You have the following rights when stopped by traffic police in India:\n\n1. **Right to see ID** — You can ask the officer to show their police ID card\n2. **Right against illegal seizure** — Your vehicle cannot be seized without a valid written challan\n3. **Right to receipt** — Any fine paid must come with an official receipt\n4. **Right to contest** — You can challenge the challan in court within 60 days\n5. **No cash payments** — You are NOT required to pay cash on the spot; you can pay online\n\nRemember: Stay calm, be polite, and always ask for a proper challan.`,

  "documents": `Documents you must carry while driving in India:\n\n1. **Driving Licence** (original or DigiLocker copy)\n2. **Vehicle Registration Certificate (RC)**\n3. **Insurance Certificate** (valid, not expired)\n4. **Pollution Under Control (PUC) Certificate**\n5. **Permit** (if applicable — for commercial vehicles)\n\nDigital copies via **DigiLocker or mParivahan app** are legally valid under the Motor Vehicles Act.`,

  "drunk driving": `Drunk driving is one of the most severely penalised traffic offences in India under **Section 185 MV Act**:\n\n**First offence:**\n- Fine: ₹10,000\n- Imprisonment: Up to 6 months (or both)\n\n**Second offence (within 3 years):**\n- Fine: ₹15,000\n- Imprisonment: Up to 2 years\n\nBlood Alcohol Concentration (BAC) limit: **30 mg per 100 ml of blood**\n\nYour licence will be suspended and the vehicle may be seized.`,

  "helmet": `Helmet rules for two-wheelers in India under Motor Vehicles Act:\n\n**Who must wear a helmet:** Both rider AND pillion rider\n**Standard:** Helmets must conform to BIS (Bureau of Indian Standards) specification IS 4151\n\n**Fine for not wearing helmet:** ₹1,000 + 3-month licence suspension\n\nNote: Some states like Goa have historically been lenient, but the 2019 amendment made enforcement stricter nationwide.`,

  "seizure": `A traffic police officer can seize your vehicle under the following conditions:\n\n1. **Driving without a valid licence**\n2. **Driving under influence (drunk driving)**\n3. **Vehicle used in a cognisable offence**\n4. **No valid insurance**\n5. **Vehicle fails fitness test**\n\n**Your rights during seizure:**\n- Demand a written seizure receipt (Form 51)\n- Officer must produce reason in writing\n- You can approach the magistrate for release\n- Vehicle cannot be held beyond 7 days without court order`,

  "speeding": `Speeding fines under Motor Vehicles (Amendment) Act 2019:\n\n**Light Motor Vehicle (car):**\n- First offence: ₹1,000–₹2,000\n- Repeat: ₹2,000–₹4,000\n\n**Heavy Vehicle:**\n- First offence: ₹2,000–₹4,000\n- Repeat: ₹4,000–₹10,000\n\nSpeed limits vary by road type:\n- Urban roads: 50 km/h\n- State highways: 80 km/h\n- National highways: 100 km/h (car), 80 km/h (heavy)\n\nExpress cameras and speed guns are deployed on most highways.`,

  "default": `Thank you for your question about Indian traffic law. Based on the Motor Vehicles (Amendment) Act 2019 and relevant state-level regulations, here is what you need to know:\n\nThe Motor Vehicles Act 2019 significantly increased penalties for traffic violations to improve road safety. Key principles:\n\n- **All challans must be issued in writing** — verbal fines are not valid\n- **Digital payments are accepted** — you don't need to carry cash\n- **DigiLocker documents are valid** — no need for physical originals\n- **You have the right to contest** any challan in court within 60 days\n\nFor a more specific answer, please mention the exact violation or state you are asking about.`
};

function getMockChatResponse(message, location) {
  const msg = message.toLowerCase();
  let reply = CHAT_RESPONSES["default"];

  if (msg.includes("red light") || msg.includes("signal")) reply = CHAT_RESPONSES["red light"];
  else if (msg.includes("mobile") || msg.includes("phone")) reply = CHAT_RESPONSES["mobile phone"];
  else if (msg.includes("right") || msg.includes("stop") || msg.includes("police")) reply = CHAT_RESPONSES["rights"];
  else if (msg.includes("document") || msg.includes("licence") || msg.includes("rc") || msg.includes("insurance")) reply = CHAT_RESPONSES["documents"];
  else if (msg.includes("drunk") || msg.includes("alcohol") || msg.includes("dui")) reply = CHAT_RESPONSES["drunk driving"];
  else if (msg.includes("helmet")) reply = CHAT_RESPONSES["helmet"];
  else if (msg.includes("seiz")) reply = CHAT_RESPONSES["seizure"];
  else if (msg.includes("speed")) reply = CHAT_RESPONSES["speeding"];

  if (location && location !== "") {
    reply += `\n\n*📍 Note: This information is specifically applicable to **${location}**. State-level amendments may apply.*`;
  }

  return { reply };
}

/* ══════════════════════════════════════
   MOCK DATA — /simulate
══════════════════════════════════════ */
const SIMULATE_DATA = {
  "red light": {
    base: 1000, repeat_multiplier: 2,
    authority: "Traffic Police",
    section: "Section 119, MV Act",
    imprisonment: "None",
    next_steps: "Pay the challan online via Parivahan portal or at the nearest traffic police office within 60 days. Failure to pay may result in court summons and additional penalties.",
    tip: "You can contest a challan if the signal was malfunctioning. Request CCTV footage within 30 days."
  },
  "drunk driving": {
    base: 10000, repeat_multiplier: 1.5,
    authority: "Traffic Police + Magistrate Court",
    section: "Section 185, MV Act",
    imprisonment: "Up to 6 months (1st) / 2 years (repeat)",
    next_steps: "Your licence will be suspended immediately. Vehicle may be seized. You will need to appear before a magistrate. Hire a lawyer if this is a repeat offence.",
    tip: "BAC limit is 30 mg/100 ml blood. Breathalyzer refusal is treated as guilt under law."
  },
  "speeding": {
    base: 1000, repeat_multiplier: 2,
    authority: "Traffic Police",
    section: "Section 112/183, MV Act",
    imprisonment: "None for first offence",
    next_steps: "Pay the e-challan within 90 days. Repeat offences may lead to licence suspension for 3 months.",
    tip: "Speed cameras are now deployed on most national highways. Speed limit on urban roads is 50 km/h."
  },
  "mobile phone": {
    base: 1000, repeat_multiplier: 10,
    authority: "Traffic Police",
    section: "Section 184, MV Act",
    imprisonment: "None (first) / 3-month licence suspension (repeat)",
    next_steps: "Pay the challan. On repeat offence, licence is suspended for 3 months and fine is ₹10,000.",
    tip: "Hands-free calling is permitted but using the phone in hand — even at a red light — is an offence."
  },
  "no helmet": {
    base: 1000, repeat_multiplier: 1,
    authority: "Traffic Police",
    section: "Section 129, MV Act",
    imprisonment: "3-month licence suspension",
    next_steps: "Pay the challan. Licence suspension notice will be sent separately. Both rider and pillion must wear helmets.",
    tip: "Only BIS-certified helmets (IS 4151) are legally valid. Half-face helmets are acceptable."
  },
  "no seatbelt": {
    base: 1000, repeat_multiplier: 1,
    authority: "Traffic Police",
    section: "Section 194B, MV Act",
    imprisonment: "None",
    next_steps: "Pay the challan online. This is a non-compoundable offence in some states — you must appear in court.",
    tip: "All passengers including rear-seat passengers must wear seatbelts. Fine applies to each person not wearing one."
  },
  "wrong side": {
    base: 5000, repeat_multiplier: 2,
    authority: "Traffic Police",
    section: "Section 184, MV Act (dangerous driving)",
    imprisonment: "Up to 6 months",
    next_steps: "This is classified as dangerous driving. Pay the challan. Repeat offenders face licence cancellation.",
    tip: "Wrong-side driving is one of the top causes of fatalities on Indian roads. Courts treat repeat offences very seriously."
  },
  "no insurance": {
    base: 2000, repeat_multiplier: 2,
    authority: "Traffic Police",
    section: "Section 196, MV Act",
    imprisonment: "Up to 3 months",
    next_steps: "Get insurance immediately. Vehicle may be impounded. You cannot drive until valid insurance is obtained.",
    tip: "Third-party insurance is mandatory by law. Comprehensive insurance is optional but recommended."
  },
  "no licence": {
    base: 5000, repeat_multiplier: 2,
    authority: "Traffic Police + RTO",
    section: "Section 181, MV Act",
    imprisonment: "Up to 3 months",
    next_steps: "Vehicle will be seized. You must appear before the RTO to apply for a licence before reclaiming the vehicle.",
    tip: "Learner's licence holders must be accompanied by a valid licence holder. Driving alone on LL is also an offence."
  },
  "overloading": {
    base: 2000, repeat_multiplier: 1.5,
    authority: "Traffic Police / Transport Dept",
    section: "Section 194, MV Act",
    imprisonment: "None",
    next_steps: "Fine is ₹2,000 plus ₹1,000 per extra tonne for commercial vehicles. Excess load must be unloaded before vehicle can proceed.",
    tip: "For passenger vehicles, each extra passenger is fined ₹1,000 additionally."
  },
  "no pollution certificate": {
    base: 10000, repeat_multiplier: 1,
    authority: "Traffic Police / Transport Dept",
    section: "Section 190(2), MV Act",
    imprisonment: "Up to 6 months",
    next_steps: "Get a PUC certificate from any authorised testing centre immediately. Vehicle may be seized if non-compliant.",
    tip: "PUC validity: 1 year for new vehicles (first 2 years), then every 6 months."
  },
  "triple riding": {
    base: 1000, repeat_multiplier: 1,
    authority: "Traffic Police",
    section: "Section 128, MV Act",
    imprisonment: "3-month licence suspension",
    next_steps: "Pay the challan. Licence suspension notice will be sent by post.",
    tip: "Only 2 persons allowed on a two-wheeler — driver + 1 pillion. Children under 4 years may be an exception in some states."
  }
};

function getMockSimulateResponse(violation, location, offenceNumber, vehicleType) {
  const data = SIMULATE_DATA[violation] || {
    base: 1000, repeat_multiplier: 1.5,
    authority: "Traffic Police",
    section: "Motor Vehicles Act 2019",
    imprisonment: "Refer to court",
    next_steps: "Consult the Parivahan portal or a traffic lawyer for exact details on this violation.",
    tip: "Always ask for a written challan. Never pay cash without a receipt."
  };

  const offence = parseInt(offenceNumber) || 1;
  let fine = data.base;
  if (offence === 2) fine = Math.round(data.base * data.repeat_multiplier);
  if (offence >= 3) fine = Math.round(data.base * data.repeat_multiplier * 1.5);

  if (vehicleType === "heavy") fine = Math.round(fine * 1.5);
  if (vehicleType === "auto") fine = Math.round(fine * 1.2);

  return {
    fine,
    authority: data.authority,
    section: data.section,
    imprisonment: data.imprisonment,
    next_steps: data.next_steps,
    tip: data.tip,
    location: location || "India (General)"
  };
}

/* ══════════════════════════════════════
   MOCK DATA — /compare
══════════════════════════════════════ */
const COMPARE_DATA = {
  "drunk driving": {
    "Delhi": { fine: 10000, imprisonment: "6 months" },
    "Maharashtra": { fine: 10000, imprisonment: "6 months" },
    "Tamil Nadu": { fine: 10000, imprisonment: "6 months" },
    "Karnataka": { fine: 10000, imprisonment: "6 months" },
    "Kerala": { fine: 10000, imprisonment: "6 months" },
    "Uttar Pradesh": { fine: 10000, imprisonment: "6 months" },
    "West Bengal": { fine: 10000, imprisonment: "6 months" },
    "Rajasthan": { fine: 10000, imprisonment: "6 months" },
    "Gujarat": { fine: 10000, imprisonment: "6 months — dry state, stricter" },
    "Punjab": { fine: 10000, imprisonment: "6 months" },
    "Haryana": { fine: 10000, imprisonment: "6 months" },
    "Telangana": { fine: 10000, imprisonment: "6 months" }
  },
  "red light": {
    "Delhi": { fine: 5000, imprisonment: "None" },
    "Maharashtra": { fine: 1000, imprisonment: "None" },
    "Tamil Nadu": { fine: 1000, imprisonment: "None" },
    "Karnataka": { fine: 1000, imprisonment: "None" },
    "Kerala": { fine: 500, imprisonment: "None" },
    "Uttar Pradesh": { fine: 1000, imprisonment: "None" },
    "West Bengal": { fine: 500, imprisonment: "None" },
    "Rajasthan": { fine: 1000, imprisonment: "None" },
    "Gujarat": { fine: 1000, imprisonment: "None" },
    "Punjab": { fine: 1000, imprisonment: "None" },
    "Haryana": { fine: 5000, imprisonment: "None" },
    "Telangana": { fine: 2000, imprisonment: "None" }
  },
  "speeding": {
    "Delhi": { fine: 2000, imprisonment: "None" },
    "Maharashtra": { fine: 1500, imprisonment: "None" },
    "Tamil Nadu": { fine: 1000, imprisonment: "None" },
    "Karnataka": { fine: 1000, imprisonment: "None" },
    "Kerala": { fine: 1000, imprisonment: "None" },
    "Uttar Pradesh": { fine: 1000, imprisonment: "None" },
    "West Bengal": { fine: 500, imprisonment: "None" },
    "Rajasthan": { fine: 1000, imprisonment: "None" },
    "Gujarat": { fine: 1000, imprisonment: "None" },
    "Punjab": { fine: 1000, imprisonment: "None" },
    "Haryana": { fine: 2000, imprisonment: "None" },
    "Telangana": { fine: 2000, imprisonment: "None" }
  },
  "mobile phone": {
    "Delhi": { fine: 5000, imprisonment: "None" },
    "Maharashtra": { fine: 1000, imprisonment: "None" },
    "Tamil Nadu": { fine: 1000, imprisonment: "None" },
    "Karnataka": { fine: 1000, imprisonment: "None" },
    "Kerala": { fine: 1000, imprisonment: "None" },
    "Uttar Pradesh": { fine: 1000, imprisonment: "None" },
    "West Bengal": { fine: 1000, imprisonment: "None" },
    "Rajasthan": { fine: 1000, imprisonment: "None" },
    "Gujarat": { fine: 1000, imprisonment: "None" },
    "Punjab": { fine: 1000, imprisonment: "None" },
    "Haryana": { fine: 5000, imprisonment: "None" },
    "Telangana": { fine: 2000, imprisonment: "None" }
  },
  "no helmet": {
    "Delhi": { fine: 1000, imprisonment: "3-month suspension" },
    "Maharashtra": { fine: 500, imprisonment: "3-month suspension" },
    "Tamil Nadu": { fine: 1000, imprisonment: "3-month suspension" },
    "Karnataka": { fine: 1000, imprisonment: "3-month suspension" },
    "Kerala": { fine: 500, imprisonment: "3-month suspension" },
    "Uttar Pradesh": { fine: 1000, imprisonment: "3-month suspension" },
    "West Bengal": { fine: 500, imprisonment: "3-month suspension" },
    "Rajasthan": { fine: 1000, imprisonment: "3-month suspension" },
    "Gujarat": { fine: 1000, imprisonment: "3-month suspension" },
    "Punjab": { fine: 1000, imprisonment: "3-month suspension" },
    "Haryana": { fine: 1000, imprisonment: "3-month suspension" },
    "Telangana": { fine: 1000, imprisonment: "3-month suspension" }
  },
  "no seatbelt": {
    "Delhi": { fine: 1000, imprisonment: "None" },
    "Maharashtra": { fine: 500, imprisonment: "None" },
    "Tamil Nadu": { fine: 1000, imprisonment: "None" },
    "Karnataka": { fine: 1000, imprisonment: "None" },
    "Kerala": { fine: 500, imprisonment: "None" },
    "Uttar Pradesh": { fine: 1000, imprisonment: "None" },
    "West Bengal": { fine: 500, imprisonment: "None" },
    "Rajasthan": { fine: 1000, imprisonment: "None" },
    "Gujarat": { fine: 1000, imprisonment: "None" },
    "Punjab": { fine: 1000, imprisonment: "None" },
    "Haryana": { fine: 1000, imprisonment: "None" },
    "Telangana": { fine: 1000, imprisonment: "None" }
  },
  "no licence": {
    "Delhi": { fine: 5000, imprisonment: "3 months" },
    "Maharashtra": { fine: 5000, imprisonment: "3 months" },
    "Tamil Nadu": { fine: 5000, imprisonment: "3 months" },
    "Karnataka": { fine: 5000, imprisonment: "3 months" },
    "Kerala": { fine: 5000, imprisonment: "3 months" },
    "Uttar Pradesh": { fine: 5000, imprisonment: "3 months" },
    "West Bengal": { fine: 5000, imprisonment: "3 months" },
    "Rajasthan": { fine: 5000, imprisonment: "3 months" },
    "Gujarat": { fine: 5000, imprisonment: "3 months" },
    "Punjab": { fine: 5000, imprisonment: "3 months" },
    "Haryana": { fine: 5000, imprisonment: "3 months" },
    "Telangana": { fine: 5000, imprisonment: "3 months" }
  },
  "no insurance": {
    "Delhi": { fine: 2000, imprisonment: "3 months" },
    "Maharashtra": { fine: 2000, imprisonment: "3 months" },
    "Tamil Nadu": { fine: 2000, imprisonment: "3 months" },
    "Karnataka": { fine: 2000, imprisonment: "3 months" },
    "Kerala": { fine: 2000, imprisonment: "3 months" },
    "Uttar Pradesh": { fine: 2000, imprisonment: "3 months" },
    "West Bengal": { fine: 2000, imprisonment: "3 months" },
    "Rajasthan": { fine: 2000, imprisonment: "3 months" },
    "Gujarat": { fine: 2000, imprisonment: "3 months" },
    "Punjab": { fine: 2000, imprisonment: "3 months" },
    "Haryana": { fine: 2000, imprisonment: "3 months" },
    "Telangana": { fine: 2000, imprisonment: "3 months" }
  }
};

function getMockCompareResponse(violation, states) {
  const violationData = COMPARE_DATA[violation] || {};
  const comparison = states.map(state => ({
    state,
    fine: violationData[state]?.fine || 1000,
    imprisonment: violationData[state]?.imprisonment || "Refer to state rules"
  }));
  comparison.sort((a, b) => b.fine - a.fine);
  return { comparison };
}

/* ══════════════════════════════════════
   UNIFIED API CALLER
   Use this everywhere in app.js
══════════════════════════════════════ */
const BACKEND_URL = "http://localhost:5000";

async function apiChat(message, location) {
  if (USE_MOCK) {
    await mockDelay();
    return getMockChatResponse(message, location);
  }
  const res = await fetch(`${BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, location })
  });
  return res.json();
}

async function apiSimulate(violation, location, offenceNumber, vehicleType) {
  if (USE_MOCK) {
    await mockDelay();
    return getMockSimulateResponse(violation, location, offenceNumber, vehicleType);
  }
  const res = await fetch(`${BACKEND_URL}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ violation, location, offence_number: parseInt(offenceNumber) })
  });
  return res.json();
}

async function apiCompare(violation, states) {
  if (USE_MOCK) {
    await mockDelay();
    return getMockCompareResponse(violation, states);
  }
  const res = await fetch(`${BACKEND_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ violation, states })
  });
  return res.json();
}