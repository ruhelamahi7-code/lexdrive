/* ============================================
   LEXDRIVE — App Logic
   Handles tabs, chat, simulator, comparator
   ============================================ */

/* ── Tab Navigation ── */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-page").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  });
});

/* ── Mock/Live Toggle ── */
document.getElementById("modeToggle").addEventListener("change", function () {
  const label = document.getElementById("modeLabel");
  if (this.checked) {
    label.textContent = "LIVE";
    label.classList.remove("mock");
    label.classList.add("live");
    showToast("🟢 Switched to Live backend", "success");
  } else {
    label.textContent = "MOCK";
    label.classList.remove("live");
    label.classList.add("mock");
    showToast("🟡 Using mock API responses", "success");
  }
  // This toggle actually controls USE_MOCK in mock.js at runtime
  window.USE_MOCK = !this.checked;
});

/* ── Toast Notifications ── */
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    toast.style.transition = "0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Format bold markdown ── */
function formatMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
}

/* ── Current time ── */
function nowTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

/* ══════════════════════════════════════
   CHAT PAGE
══════════════════════════════════════ */
let chatHistory = [];

function appendMessage(role, text) {
  const window_ = document.getElementById("chatWindow");
  const empty = document.getElementById("chatEmpty");
  if (empty) empty.remove();

  const msg = document.createElement("div");
  msg.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = `msg-avatar ${role === "bot" ? "bot" : "user-av"}`;
  avatar.textContent = role === "bot" ? "⚖" : "M";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.innerHTML = formatMarkdown(text);

  const meta = document.createElement("div");
  meta.className = "msg-meta";
  meta.textContent = nowTime();

  const inner = document.createElement("div");
  inner.appendChild(bubble);
  inner.appendChild(meta);

  msg.appendChild(avatar);
  msg.appendChild(inner);
  window_.appendChild(msg);
  window_.scrollTop = window_.scrollHeight;
}

function showTyping() {
  const window_ = document.getElementById("chatWindow");
  const empty = document.getElementById("chatEmpty");
  if (empty) empty.remove();

  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar bot";
  avatar.textContent = "⚖";

  const dots = document.createElement("div");
  dots.className = "typing-dots";
  dots.innerHTML = "<span></span><span></span><span></span>";

  typing.appendChild(avatar);
  typing.appendChild(dots);
  window_.appendChild(typing);
  window_.scrollTop = window_.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById("typingIndicator");
  if (t) t.remove();
}

async function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const location = document.getElementById("chatLocation").value;
  const message = input.value.trim();
  if (!message) return;

  input.value = "";
  input.style.height = "auto";
  document.getElementById("chatSendBtn").disabled = true;

  appendMessage("user", message);
  showTyping();

  try {
    const data = await apiChat(message, location);
    removeTyping();
    appendMessage("bot", data.reply);
    chatHistory.push({ role: "user", content: message });
    chatHistory.push({ role: "bot", content: data.reply });
  } catch (err) {
    removeTyping();
    appendMessage("bot", "Sorry, I couldn't connect to the server. Please check your connection or switch to Mock mode.");
    showToast("Connection error", "error");
  }

  document.getElementById("chatSendBtn").disabled = false;
  document.getElementById("chatInput").focus();
}

document.getElementById("chatSendBtn").addEventListener("click", sendChatMessage);

document.getElementById("chatInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendChatMessage();
  }
});

// Auto-resize textarea
document.getElementById("chatInput").addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 160) + "px";
});

// Quick topic buttons
document.querySelectorAll(".quick-topic-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("chatInput").value = btn.dataset.prompt;
    sendChatMessage();
  });
});

// Sync sidebar location with footer location
document.getElementById("chatLocationSidebar").addEventListener("change", function () {
  document.getElementById("chatLocation").value = this.value;
});
document.getElementById("chatLocation").addEventListener("change", function () {
  document.getElementById("chatLocationSidebar").value = this.value;
});

// Clear chat
document.getElementById("clearChatBtn").addEventListener("click", () => {
  const window_ = document.getElementById("chatWindow");
  window_.innerHTML = `
    <div class="chat-empty" id="chatEmpty">
      <div class="chat-empty-icon">⚖️</div>
      <p>Ask me about traffic laws, fines,<br>rights, or anything road-related.</p>
    </div>`;
  chatHistory = [];
  showToast("Chat cleared", "success");
});

/* ══════════════════════════════════════
   VIOLATION SIMULATOR
══════════════════════════════════════ */
document.getElementById("simSubmitBtn").addEventListener("click", async () => {
  const violation = document.getElementById("simViolation").value;
  const city = document.getElementById("simCity").value.trim();
  const state = document.getElementById("simState").value;
  const offence = document.getElementById("simOffenceNum").value;
  const vehicle = document.getElementById("simVehicle").value;

  if (!violation) {
    showToast("Please select a violation type", "error");
    return;
  }
  if (!state) {
    showToast("Please select a state", "error");
    return;
  }

  const location = city ? `${city}, ${state}` : state;
  const btn = document.getElementById("simSubmitBtn");
  btn.disabled = true;
  btn.textContent = "Calculating...";

  const resultDiv = document.getElementById("simResult");
  resultDiv.innerHTML = `<div class="loading-overlay"><div class="spinner"></div> Simulating violation...</div>`;

  try {
    const data = await apiSimulate(violation, location, offence, vehicle);
    renderSimResult(data, violation, location, offence);
  } catch (err) {
    resultDiv.innerHTML = `<div class="result-empty"><p style="color:var(--danger)">Error connecting to server.<br>Switch to Mock mode to test.</p></div>`;
    showToast("Simulation failed", "error");
  }

  btn.disabled = false;
  btn.innerHTML = "⚡ Calculate Fine &amp; Next Steps";
});

function renderSimResult(data, violation, location, offence) {
  const resultDiv = document.getElementById("simResult");
  const offenceLabel = offence == 1 ? "1st offence" : offence == 2 ? "2nd offence" : "3rd+ offence";
  const severityClass = data.fine >= 5000 ? "danger" : data.fine >= 2000 ? "warning" : "success";

  resultDiv.innerHTML = `
    <div class="fine-amount">
      <div class="fine-label">Total Fine</div>
      <div class="fine-value"><span class="fine-currency">₹</span>${data.fine.toLocaleString("en-IN")}</div>
      <div style="margin-top:0.6rem;">
        <span class="status-badge ${severityClass}">
          ${data.fine >= 5000 ? "🔴 High severity" : data.fine >= 2000 ? "🟡 Medium severity" : "🟢 Low severity"}
        </span>
      </div>
    </div>

    <div class="result-detail-row">
      <span class="detail-icon">📍</span>
      <div class="detail-content">
        <div class="detail-key">Location</div>
        <div class="detail-value">${location}</div>
      </div>
    </div>

    <div class="result-detail-row">
      <span class="detail-icon">⚖️</span>
      <div class="detail-content">
        <div class="detail-key">Legal Section</div>
        <div class="detail-value">${data.section || "Motor Vehicles Act 2019"}</div>
      </div>
    </div>

    <div class="result-detail-row">
      <span class="detail-icon">🏛️</span>
      <div class="detail-content">
        <div class="detail-key">Authority</div>
        <div class="detail-value">${data.authority}</div>
      </div>
    </div>

    <div class="result-detail-row">
      <span class="detail-icon">🔁</span>
      <div class="detail-content">
        <div class="detail-key">Offence Number</div>
        <div class="detail-value">${offenceLabel}</div>
      </div>
    </div>

    <div class="result-detail-row">
      <span class="detail-icon">⏳</span>
      <div class="detail-content">
        <div class="detail-key">Imprisonment Risk</div>
        <div class="detail-value">${data.imprisonment || "None"}</div>
      </div>
    </div>

    <div class="result-detail-row">
      <span class="detail-icon">➡️</span>
      <div class="detail-content">
        <div class="detail-key">What happens next</div>
        <div class="detail-value">${data.next_steps}</div>
      </div>
    </div>

    ${data.tip ? `
    <div style="background:rgba(201,168,76,0.07); border:1px solid rgba(201,168,76,0.2); border-radius:var(--radius-md); padding:0.9rem 1rem; margin-top:0.5rem;">
      <div style="font-size:0.75rem; font-family:var(--font-mono); color:var(--gold); margin-bottom:0.3rem; letter-spacing:0.06em;">💡 LEGAL TIP</div>
      <div style="font-size:0.87rem; color:var(--off-white); line-height:1.6;">${data.tip}</div>
    </div>` : ""}
  `;
}

/* ══════════════════════════════════════
   STATE COMPARATOR
══════════════════════════════════════ */
let selectedStates = [];

document.getElementById("stateAdder").addEventListener("change", function () {
  const state = this.value;
  if (!state) return;
  if (selectedStates.includes(state)) {
    showToast(`${state} already added`, "error");
    this.value = "";
    return;
  }
  if (selectedStates.length >= 8) {
    showToast("Maximum 8 states for comparison", "error");
    this.value = "";
    return;
  }
  selectedStates.push(state);
  renderStateChips();
  this.value = "";
});

function renderStateChips() {
  const container = document.getElementById("selectedStates");
  if (selectedStates.length === 0) {
    container.innerHTML = `<span style="font-size:0.82rem; color:var(--muted);">None selected — add states above.</span>`;
    return;
  }
  container.innerHTML = selectedStates.map(s => `
    <span class="state-chip selected" data-state="${s}">
      ${s}
      <span class="state-chip-remove" onclick="removeState('${s}')">✕</span>
    </span>
  `).join("");
}

function removeState(state) {
  selectedStates = selectedStates.filter(s => s !== state);
  renderStateChips();
}
window.removeState = removeState;

document.getElementById("compSubmitBtn").addEventListener("click", async () => {
  const violation = document.getElementById("compViolation").value;
  if (!violation) { showToast("Please select a violation", "error"); return; }
  if (selectedStates.length < 2) { showToast("Please add at least 2 states", "error"); return; }

  const btn = document.getElementById("compSubmitBtn");
  btn.disabled = true;
  btn.textContent = "Comparing...";

  document.getElementById("compChartCard").style.display = "none";
  document.getElementById("compTableWrap").style.display = "none";

  try {
    const data = await apiCompare(violation, selectedStates);
    renderComparison(data.comparison, violation);
  } catch (err) {
    showToast("Comparison failed — try mock mode", "error");
  }

  btn.disabled = false;
  btn.textContent = "📊 Compare";
});

function renderComparison(comparison, violation) {
  const maxFine = Math.max(...comparison.map(c => c.fine));
  const minFine = Math.min(...comparison.map(c => c.fine));

  // Bar chart
  const chartCard = document.getElementById("compChartCard");
  const barChart = document.getElementById("compBarChart");
  barChart.innerHTML = comparison.map(item => {
    const pct = Math.round((item.fine / maxFine) * 100);
    const cls = item.fine === maxFine ? "highest" : item.fine === minFine ? "lowest" : "";
    return `
      <div class="bar-row">
        <span class="bar-label">${item.state}</span>
        <div class="bar-track">
          <div class="bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
        <span class="bar-value">₹${item.fine.toLocaleString("en-IN")}</span>
      </div>
    `;
  }).join("");
  chartCard.style.display = "block";

  // Table
  const tbody = document.getElementById("compTableBody");
  tbody.innerHTML = comparison.map((item, i) => {
    const fineClass = item.fine === maxFine ? "highest" : item.fine === minFine ? "lowest" : "";
    const rankClass = i === 0 ? "rank-1" : i === 1 ? "rank-2" : "rank-3";
    const note = item.fine === maxFine ? "Highest fine" : item.fine === minFine ? "Lowest fine" : "—";
    return `
      <tr>
        <td><span class="rank-badge ${rankClass}">${i + 1}</span></td>
        <td style="font-weight:500; color:var(--white);">${item.state}</td>
        <td><span class="fine-cell ${fineClass}">₹${item.fine.toLocaleString("en-IN")}</span></td>
        <td style="color:var(--muted); font-size:0.85rem;">${item.imprisonment || "—"}</td>
        <td style="color:var(--muted); font-size:0.82rem;">${note}</td>
      </tr>
    `;
  }).join("");
  document.getElementById("compTableWrap").style.display = "block";

  showToast(`Compared ${comparison.length} states for "${violation}"`, "success");
}