let USE_MOCK = true;
const MOCK_DELAY = 1200;

function mockDelay() {
  return new Promise(res => setTimeout(res, MOCK_DELAY));
}

var CHAT_RESPONSES = {
  "red light": "Under the Motor Vehicles (Amendment) Act 2019, jumping a red light is punishable with a fine of **\u20b91,000 to \u20b95,000**.\n\n**First offence:** \u20b91,000\u20132,000\n**Repeat offence:** Up to \u20b95,000 + possible licence suspension\n\nIn Tamil Nadu and Delhi, traffic cameras capture violations automatically.",
  "mobile phone": "Using a mobile phone while driving is a serious offence under **Section 184 MV Act**.\n\n**Fine:** \u20b91,000 (first) | \u20b910,000 (repeat)\n**Additional:** 3-month licence suspension on repeat offence.",
  "rights": "Your rights when stopped by traffic police in India:\n\n1. **Right to see ID** of the officer\n2. **Right against illegal seizure** without written challan\n3. **Right to receipt** for any fine paid\n4. **Right to contest** challan in court within 60 days\n5. **No cash required** — you can pay online",
  "documents": "Documents required while driving in India:\n\n1. **Driving Licence** (original or DigiLocker)\n2. **Vehicle Registration Certificate (RC)**\n3. **Insurance Certificate** (valid)\n4. **PUC Certificate**\n\nDigital copies via DigiLocker or mParivahan are legally valid.",
  "drunk driving": "Drunk driving under **Section 185 MV Act**:\n\n**First offence:** \u20b910,000 + up to 6 months imprisonment\n**Second offence:** \u20b915,000 + up to 2 years\n\nBAC limit: **30 mg per 100 ml of blood**\n\nLicence will be suspended and vehicle may be seized.",
  "helmet": "Helmet rules for two-wheelers:\n\n**Who:** Both rider AND pillion rider\n**Standard:** BIS specification IS 4151\n**Fine:** \u20b91,000 + 3-month licence suspension",
  "seizure": "A traffic police officer can seize your vehicle if:\n\n1. Driving without a valid licence\n2. Driving under influence\n3. No valid insurance\n4. Vehicle fails fitness test\n\nDemand a written seizure receipt. Vehicle cannot be held beyond 7 days without court order.",
  "speeding": "Speeding fines under MV Act 2019:\n\n**Car:** \u20b91,000\u20132,000 (first) | \u20b92,000\u20134,000 (repeat)\n**Heavy vehicle:** \u20b92,000\u20134,000 (first) | up to \u20b910,000 (repeat)\n\nSpeed limits: Urban 50 km/h | Highways 80\u2013100 km/h",
  "sl_general": "Sri Lanka traffic laws are governed by the **Motor Traffic Act (Chapter 203)**.\n\nKey facts:\n- Fines are in **Sri Lankan Rupees (LKR)**\n- BAC limit: **80 mg per 100 ml of blood**\n- Speed limit: **50 km/h urban | 70 km/h rural | 100 km/h expressway**\n- Helmet mandatory for both rider and pillion\n\nFines can be paid at any **DMT office** or online.",
  "sl_drunk driving": "Drunk driving in Sri Lanka under **Section 151, Motor Traffic Act**:\n\n**First offence:** LKR 25,000 + up to 2 years imprisonment\n**Repeat offence:** LKR 50,000 + up to 5 years + licence cancellation\n\nBAC limit is 80 mg/100 ml. Refusing a breath test is treated as a positive result.",
  "sl_helmet": "Helmet rules in Sri Lanka:\n\n**Mandatory for:** Both rider AND pillion\n**Standard:** SLS certified helmet\n**Fine:** LKR 1,000\u20132,500\n\nNon-SLS helmets treated same as no helmet.",
  "sl_speeding": "Speed limits in Sri Lanka:\n- Urban: 50 km/h | Rural: 70 km/h | Expressways: 100 km/h\n\n**Fines:**\n- Up to 20 km/h over: LKR 2,500\n- 20\u201340 km/h over: LKR 5,000\n- 40+ km/h over: LKR 10,000 + court",
  "sl_documents": "Documents required while driving in Sri Lanka:\n\n1. **Driving Licence** (DMT issued)\n2. **Vehicle Revenue Licence** (annual)\n3. **Insurance Certificate** (third-party minimum)\n4. **Emission Test Certificate**\n5. **Registration Book**\n\nForeign visitors can use an IDP for up to 3 months.",
  "sl_rights": "Your rights when stopped by traffic police in Sri Lanka:\n\n1. **Right to see officer ID**\n2. **Right to a written notice**\n3. **Right to contest** in Magistrate Court\n4. **No unofficial payments**\n\nSri Lanka Police non-emergency: **118**",
  "default": "Thank you for your question. Based on the **Motor Vehicles Act 2019** (India) and **Motor Traffic Act** (Sri Lanka):\n\n- All fines must be issued in writing\n- You have the right to contest any penalty in court\n- Always ask for a receipt when paying\n- Carry all required documents at all times\n\nPlease mention the exact violation or location for a specific answer."
};

function getMockChatResponse(message, location) {
  var msg = message.toLowerCase();
  var isSL = location === "Sri Lanka" || msg.includes("sri lanka") || msg.includes("colombo") || msg.includes("kandy") || msg.includes("lkr");
  var reply;
  if (isSL) {
    if (msg.includes("drunk") || msg.includes("alcohol")) reply = CHAT_RESPONSES["sl_drunk driving"];
    else if (msg.includes("helmet")) reply = CHAT_RESPONSES["sl_helmet"];
    else if (msg.includes("speed")) reply = CHAT_RESPONSES["sl_speeding"];
    else if (msg.includes("document") || msg.includes("licence")) reply = CHAT_RESPONSES["sl_documents"];
    else if (msg.includes("right") || msg.includes("police")) reply = CHAT_RESPONSES["sl_rights"];
    else reply = CHAT_RESPONSES["sl_general"];
  } else {
    if (msg.includes("red light") || msg.includes("signal")) reply = CHAT_RESPONSES["red light"];
    else if (msg.includes("mobile") || msg.includes("phone")) reply = CHAT_RESPONSES["mobile phone"];
    else if (msg.includes("right") || msg.includes("stop") || msg.includes("police")) reply = CHAT_RESPONSES["rights"];
    else if (msg.includes("document") || msg.includes("licence")) reply = CHAT_RESPONSES["documents"];
    else if (msg.includes("drunk") || msg.includes("alcohol")) reply = CHAT_RESPONSES["drunk driving"];
    else if (msg.includes("helmet")) reply = CHAT_RESPONSES["helmet"];
    else if (msg.includes("seiz")) reply = CHAT_RESPONSES["seizure"];
    else if (msg.includes("speed")) reply = CHAT_RESPONSES["speeding"];
    else reply = CHAT_RESPONSES["default"];
  }
  if (location && location !== "") reply += "\n\n*\ud83d\udccd Note: Applicable to **" + location + "**. Local amendments may apply.*";
  return { reply: reply };
}

var SIMULATE_DATA = {
  "red light":     { base:1000,  repeat:2,   currency:"INR", authority:"Traffic Police",                    section:"Section 119, MV Act 2019",      imprisonment:"None",                                    next_steps:"Pay challan via Parivahan portal within 60 days.",             tip:"Contest if signal was malfunctioning." },
  "drunk driving": { base:10000, repeat:1.5, currency:"INR", authority:"Traffic Police + Magistrate Court", section:"Section 185, MV Act 2019",      imprisonment:"Up to 6 months (1st) / 2 years (repeat)", next_steps:"Licence suspended immediately. Appear before magistrate.",     tip:"BAC limit is 30 mg/100 ml." },
  "speeding":      { base:1000,  repeat:2,   currency:"INR", authority:"Traffic Police",                    section:"Section 112/183, MV Act 2019",  imprisonment:"None for first offence",                  next_steps:"Pay e-challan within 90 days.",                                tip:"Urban speed limit is 50 km/h." },
  "mobile phone":  { base:1000,  repeat:10,  currency:"INR", authority:"Traffic Police",                    section:"Section 184, MV Act 2019",      imprisonment:"None (1st) / 3-month suspension (repeat)",next_steps:"Pay challan. Repeat: Rs.10,000 + suspension.",                 tip:"Using phone at red light is still an offence." },
  "no helmet":     { base:1000,  repeat:1,   currency:"INR", authority:"Traffic Police",                    section:"Section 129, MV Act 2019",      imprisonment:"3-month licence suspension",              next_steps:"Pay challan. Both rider and pillion must wear helmets.",       tip:"Only BIS-certified helmets (IS 4151) are valid." },
  "no seatbelt":   { base:1000,  repeat:1,   currency:"INR", authority:"Traffic Police",                    section:"Section 194B, MV Act 2019",     imprisonment:"None",                                    next_steps:"Pay challan online.",                                          tip:"Fine applies to each person not wearing seatbelt." },
  "wrong side":    { base:5000,  repeat:2,   currency:"INR", authority:"Traffic Police",                    section:"Section 184, MV Act 2019",      imprisonment:"Up to 6 months",                          next_steps:"Pay challan. Repeat offenders face licence cancellation.",     tip:"Wrong-side driving is a top cause of road fatalities." },
  "no insurance":  { base:2000,  repeat:2,   currency:"INR", authority:"Traffic Police",                    section:"Section 196, MV Act 2019",      imprisonment:"Up to 3 months",                          next_steps:"Get insurance immediately. Vehicle may be impounded.",         tip:"Third-party insurance is mandatory by law." },
  "no licence":    { base:5000,  repeat:2,   currency:"INR", authority:"Traffic Police + RTO",              section:"Section 181, MV Act 2019",      imprisonment:"Up to 3 months",                          next_steps:"Vehicle seized. Appear before RTO to get licence.",            tip:"LL holders must be accompanied by a valid licence holder." },
  "overloading":   { base:2000,  repeat:1.5, currency:"INR", authority:"Traffic Police",                    section:"Section 194, MV Act 2019",      imprisonment:"None",                                    next_steps:"Excess load must be removed before proceeding.",               tip:"Each extra passenger fined Rs.1,000 additionally." },
  "no pollution certificate": { base:10000, repeat:1, currency:"INR", authority:"Traffic Police", section:"Section 190(2), MV Act 2019", imprisonment:"Up to 6 months", next_steps:"Get PUC certificate from authorised centre immediately.", tip:"PUC valid for 6 months after first 2 years." },
  "triple riding": { base:1000,  repeat:1,   currency:"INR", authority:"Traffic Police",                    section:"Section 128, MV Act 2019",      imprisonment:"3-month licence suspension",              next_steps:"Pay challan. Suspension notice sent by post.",                 tip:"Only driver + 1 pillion allowed on two-wheeler." },
  "sl_red light":     { base:2500,  repeat:2,   currency:"LKR", authority:"Sri Lanka Police Traffic Division", section:"Section 136, Motor Traffic Act",  imprisonment:"None",                                        next_steps:"Pay fine at DMT office or online within 14 days.",                tip:"Colombo has CCTV enforcement at major junctions." },
  "sl_drunk driving": { base:25000, repeat:2,   currency:"LKR", authority:"Sri Lanka Police Traffic Division", section:"Section 151, Motor Traffic Act",  imprisonment:"Up to 2 years (1st) / 5 years (repeat)",      next_steps:"Licence suspended on spot. Appear before Magistrate Court.",     tip:"BAC limit 80 mg/100 ml. Refusing breath test = positive result." },
  "sl_speeding":      { base:2500,  repeat:2,   currency:"LKR", authority:"Sri Lanka Police Traffic Division", section:"Section 138, Motor Traffic Act",  imprisonment:"None for minor violations",                   next_steps:"Pay fine at DMT office or online within 14 days.",                tip:"Speed cameras active on Southern Expressway." },
  "sl_mobile phone":  { base:5000,  repeat:2,   currency:"LKR", authority:"Sri Lanka Police Traffic Division", section:"Section 140A, Motor Traffic Act", imprisonment:"None",                                        next_steps:"Pay fine within 14 days at any DMT office.",                      tip:"Using phone at traffic light is still an offence." },
  "sl_no helmet":     { base:1500,  repeat:1.5, currency:"LKR", authority:"Sri Lanka Police Traffic Division", section:"Section 149, Motor Traffic Act",  imprisonment:"None",                                        next_steps:"Pay penalty at any DMT office.",                                  tip:"Non-SLS certified helmets treated same as no helmet." },
  "sl_no seatbelt":   { base:1000,  repeat:1.5, currency:"LKR", authority:"Sri Lanka Police Traffic Division", section:"Section 148, Motor Traffic Act",  imprisonment:"None",                                        next_steps:"Pay fine at any DMT office within 14 days.",                      tip:"Seatbelts mandatory for all front-seat passengers." },
  "sl_wrong side":    { base:5000,  repeat:2,   currency:"LKR", authority:"Sri Lanka Police Traffic Division", section:"Section 135, Motor Traffic Act",  imprisonment:"Up to 6 months",                             next_steps:"Dangerous driving requires court appearance.",                    tip:"Sri Lanka drives on the LEFT." },
  "sl_no insurance":  { base:7500,  repeat:2,   currency:"LKR", authority:"Sri Lanka Police + IRCSL",          section:"Section 100, Motor Traffic Act",  imprisonment:"Up to 6 months",                             next_steps:"Get third-party insurance from IRCSL-registered insurer.",        tip:"Third-party insurance is the legal minimum in Sri Lanka." },
  "sl_no licence":    { base:10000, repeat:2,   currency:"LKR", authority:"Sri Lanka Police + DMT",            section:"Section 102, Motor Traffic Act",  imprisonment:"Up to 1 year",                               next_steps:"Vehicle impounded. Appear at DMT to get licence.",                tip:"Foreign visitors can use IDP for up to 3 months." },
  "sl_overloading":   { base:3000,  repeat:1.5, currency:"LKR", authority:"Sri Lanka Police",                  section:"Section 143, Motor Traffic Act",  imprisonment:"None",                                        next_steps:"Excess load must be removed. Pay fine at DMT office.",            tip:"Commercial vehicle overloading has additional RDA penalties." }
};

var SL_MAP = {
  "red light":"sl_red light","drunk driving":"sl_drunk driving","speeding":"sl_speeding",
  "mobile phone":"sl_mobile phone","no helmet":"sl_no helmet","no seatbelt":"sl_no seatbelt",
  "wrong side":"sl_wrong side","no insurance":"sl_no insurance","no licence":"sl_no licence","overloading":"sl_overloading"
};

function getMockSimulateResponse(violation, location, offenceNumber, vehicleType) {
  var isSL = location && (location.toLowerCase().includes("sri lanka") || location.toLowerCase().includes("colombo") || location.toLowerCase().includes("kandy"));
  var key = (isSL && SL_MAP[violation]) ? SL_MAP[violation] : violation;
  var d = SIMULATE_DATA[key] || { base:1000, repeat:1.5, currency:isSL?"LKR":"INR", authority:"Traffic Police", section:"Motor Vehicles Act", imprisonment:"Refer to court", next_steps:"Consult transport authority for details.", tip:"Always ask for a written challan." };
  var offence = parseInt(offenceNumber) || 1;
  var fine = d.base;
  if (offence === 2) fine = Math.round(d.base * d.repeat);
  if (offence >= 3) fine = Math.round(d.base * d.repeat * 1.5);
  if (!isSL && vehicleType === "heavy") fine = Math.round(fine * 1.5);
  if (!isSL && vehicleType === "auto")  fine = Math.round(fine * 1.2);
  return { fine:fine, currency:d.currency, authority:d.authority, section:d.section, imprisonment:d.imprisonment, next_steps:d.next_steps, tip:d.tip, location:location||"India (General)" };
}

var COMPARE_DATA = {
  "drunk driving":{"Delhi":{fine:10000,imprisonment:"6 months"},"Maharashtra":{fine:10000,imprisonment:"6 months"},"Tamil Nadu":{fine:10000,imprisonment:"6 months"},"Karnataka":{fine:10000,imprisonment:"6 months"},"Kerala":{fine:10000,imprisonment:"6 months"},"Uttar Pradesh":{fine:10000,imprisonment:"6 months"},"West Bengal":{fine:10000,imprisonment:"6 months"},"Rajasthan":{fine:10000,imprisonment:"6 months"},"Gujarat":{fine:10000,imprisonment:"6 months"},"Punjab":{fine:10000,imprisonment:"6 months"},"Haryana":{fine:10000,imprisonment:"6 months"},"Telangana":{fine:10000,imprisonment:"6 months"}},
  "red light":{"Delhi":{fine:5000,imprisonment:"None"},"Maharashtra":{fine:1000,imprisonment:"None"},"Tamil Nadu":{fine:1000,imprisonment:"None"},"Karnataka":{fine:1000,imprisonment:"None"},"Kerala":{fine:500,imprisonment:"None"},"Uttar Pradesh":{fine:1000,imprisonment:"None"},"West Bengal":{fine:500,imprisonment:"None"},"Rajasthan":{fine:1000,imprisonment:"None"},"Gujarat":{fine:1000,imprisonment:"None"},"Punjab":{fine:1000,imprisonment:"None"},"Haryana":{fine:5000,imprisonment:"None"},"Telangana":{fine:2000,imprisonment:"None"}},
  "speeding":{"Delhi":{fine:2000,imprisonment:"None"},"Maharashtra":{fine:1500,imprisonment:"None"},"Tamil Nadu":{fine:1000,imprisonment:"None"},"Karnataka":{fine:1000,imprisonment:"None"},"Kerala":{fine:1000,imprisonment:"None"},"Uttar Pradesh":{fine:1000,imprisonment:"None"},"West Bengal":{fine:500,imprisonment:"None"},"Rajasthan":{fine:1000,imprisonment:"None"},"Gujarat":{fine:1000,imprisonment:"None"},"Punjab":{fine:1000,imprisonment:"None"},"Haryana":{fine:2000,imprisonment:"None"},"Telangana":{fine:2000,imprisonment:"None"}},
  "mobile phone":{"Delhi":{fine:5000,imprisonment:"None"},"Maharashtra":{fine:1000,imprisonment:"None"},"Tamil Nadu":{fine:1000,imprisonment:"None"},"Karnataka":{fine:1000,imprisonment:"None"},"Kerala":{fine:1000,imprisonment:"None"},"Uttar Pradesh":{fine:1000,imprisonment:"None"},"West Bengal":{fine:1000,imprisonment:"None"},"Rajasthan":{fine:1000,imprisonment:"None"},"Gujarat":{fine:1000,imprisonment:"None"},"Punjab":{fine:1000,imprisonment:"None"},"Haryana":{fine:5000,imprisonment:"None"},"Telangana":{fine:2000,imprisonment:"None"}},
  "no helmet":{"Delhi":{fine:1000,imprisonment:"3-month suspension"},"Maharashtra":{fine:500,imprisonment:"3-month suspension"},"Tamil Nadu":{fine:1000,imprisonment:"3-month suspension"},"Karnataka":{fine:1000,imprisonment:"3-month suspension"},"Kerala":{fine:500,imprisonment:"3-month suspension"},"Uttar Pradesh":{fine:1000,imprisonment:"3-month suspension"},"West Bengal":{fine:500,imprisonment:"3-month suspension"},"Rajasthan":{fine:1000,imprisonment:"3-month suspension"},"Gujarat":{fine:1000,imprisonment:"3-month suspension"},"Punjab":{fine:1000,imprisonment:"3-month suspension"},"Haryana":{fine:1000,imprisonment:"3-month suspension"},"Telangana":{fine:1000,imprisonment:"3-month suspension"}},
  "no seatbelt":{"Delhi":{fine:1000,imprisonment:"None"},"Maharashtra":{fine:500,imprisonment:"None"},"Tamil Nadu":{fine:1000,imprisonment:"None"},"Karnataka":{fine:1000,imprisonment:"None"},"Kerala":{fine:500,imprisonment:"None"},"Uttar Pradesh":{fine:1000,imprisonment:"None"},"West Bengal":{fine:500,imprisonment:"None"},"Rajasthan":{fine:1000,imprisonment:"None"},"Gujarat":{fine:1000,imprisonment:"None"},"Punjab":{fine:1000,imprisonment:"None"},"Haryana":{fine:1000,imprisonment:"None"},"Telangana":{fine:1000,imprisonment:"None"}},
  "no licence":{"Delhi":{fine:5000,imprisonment:"3 months"},"Maharashtra":{fine:5000,imprisonment:"3 months"},"Tamil Nadu":{fine:5000,imprisonment:"3 months"},"Karnataka":{fine:5000,imprisonment:"3 months"},"Kerala":{fine:5000,imprisonment:"3 months"},"Uttar Pradesh":{fine:5000,imprisonment:"3 months"},"West Bengal":{fine:5000,imprisonment:"3 months"},"Rajasthan":{fine:5000,imprisonment:"3 months"},"Gujarat":{fine:5000,imprisonment:"3 months"},"Punjab":{fine:5000,imprisonment:"3 months"},"Haryana":{fine:5000,imprisonment:"3 months"},"Telangana":{fine:5000,imprisonment:"3 months"}},
  "no insurance":{"Delhi":{fine:2000,imprisonment:"3 months"},"Maharashtra":{fine:2000,imprisonment:"3 months"},"Tamil Nadu":{fine:2000,imprisonment:"3 months"},"Karnataka":{fine:2000,imprisonment:"3 months"},"Kerala":{fine:2000,imprisonment:"3 months"},"Uttar Pradesh":{fine:2000,imprisonment:"3 months"},"West Bengal":{fine:2000,imprisonment:"3 months"},"Rajasthan":{fine:2000,imprisonment:"3 months"},"Gujarat":{fine:2000,imprisonment:"3 months"},"Punjab":{fine:2000,imprisonment:"3 months"},"Haryana":{fine:2000,imprisonment:"3 months"},"Telangana":{fine:2000,imprisonment:"3 months"}}
};

function getMockCompareResponse(violation, states) {
  var vd = COMPARE_DATA[violation] || {};
  var comparison = states.map(function(s) { return { state:s, fine:vd[s]?vd[s].fine:1000, imprisonment:vd[s]?vd[s].imprisonment:"Refer to state rules" }; });
  comparison.sort(function(a,b) { return b.fine - a.fine; });
  return { comparison: comparison };
}

var BACKEND_URL = "http://localhost:5000";

async function apiChat(message, location) {
  if (USE_MOCK) { await mockDelay(); return getMockChatResponse(message, location); }
  var res = await fetch(BACKEND_URL+"/chat", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({message:message,location:location}) });
  return res.json();
}

async function apiSimulate(violation, location, offenceNumber, vehicleType) {
  if (USE_MOCK) { await mockDelay(); return getMockSimulateResponse(violation, location, offenceNumber, vehicleType); }
  var res = await fetch(BACKEND_URL+"/simulate", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({violation:violation,location:location,offence_number:parseInt(offenceNumber)}) });
  return res.json();
}

async function apiCompare(violation, states) {
  if (USE_MOCK) { await mockDelay(); return getMockCompareResponse(violation, states); }
  var res = await fetch(BACKEND_URL+"/compare", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({violation:violation,states:states}) });
  return res.json();
}
