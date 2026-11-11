(() => {
  /**
   * PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW (see GOOGLE-SHEETS-SETUP.md)
   * Example: "https://script.google.com/macros/s/AKfycb.../exec"
   */
  const DEFAULT_GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbztd1Rd24z1eOcgSy54XPOEDmV00DI7LC_-WlB-mpsKlf-GmEPnxe9OsAtA1xRoyMpuug/exec";

  const urlParams = new URLSearchParams(window.location.search);
  const rawScriptParam = urlParams.get("script") || "";
  const isValidGasUrl = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(rawScriptParam);
  const GOOGLE_SCRIPT_URL = DEFAULT_GOOGLE_SCRIPT_URL || (isValidGasUrl ? rawScriptParam : "");

  const form = document.getElementById("waiverForm");
  const submissionScreen = document.getElementById("submissionScreen");
  const feedbackEl = document.getElementById("formFeedback");
  const submitBtn = document.getElementById("btnCustomerSubmit");

  const zoneRadios = Array.from(document.querySelectorAll('input[name="activity"]'));
  const branchEl = document.getElementById("branch");
  const fullNameEl = document.getElementById("fullName");
  const dobEl = document.getElementById("dob");
  const primaryAgeTag = document.getElementById("primaryAgeTag");
  const mobileEl = document.getElementById("mobileNumber");
  const addressEl = document.getElementById("address");
  const emailEl = document.getElementById("emailId");
  const primaryIsRidingEl = document.getElementById("primaryIsRiding");
  const riderCountBadge = document.getElementById("riderCountBadge");
  const additionalRidersContainer = document.getElementById("additionalRidersContainer");

  const minHeightInEl = document.getElementById("minHeightIn");
  const minHeightCmEl = document.getElementById("minHeightCm");
  const agreeTermsEl = document.getElementById("agreeTerms");
  const signDateEl = document.getElementById("signDate");
  const signTimeEl = document.getElementById("signTime");

  const displayRefCode = document.getElementById("displayRefCode");
  const displayTimestamp = document.getElementById("displayTimestamp");
  const sheetSyncStatus = document.getElementById("sheetSyncStatus");
  const summaryContactDl = document.getElementById("summaryContactDl");
  const summaryRiderCount = document.getElementById("summaryRiderCount");
  const summaryRidersList = document.getElementById("summaryRidersList");
  const summaryGuestSigImg = document.getElementById("summaryGuestSigImg");

  const MAX_EXTRA_PARTICIPANTS = 19;
  const hpWebsiteEl = document.getElementById("hpWebsite");
  const btnAddRiderEl = document.getElementById("btnAddRider");

  /**
   * Pointer-based HiDPI signature pad supporting mouse, touch, and stylus.
   */
  function createSignaturePad(canvas, placeholderEl) {
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let hasInk = false;
    let lastPoint = null;

    function configureContext() {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2.4;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      const targetW = Math.round(rect.width * dpr);
      const targetH = Math.round(rect.height * dpr);
      if (canvas.width === targetW && canvas.height === targetH) return;

      const snapshot = hasInk ? canvas.toDataURL("image/png") : null;
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      configureContext();

      if (snapshot) {
        loadFromDataURL(snapshot);
      }
    }

    function getPoint(evt) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }

    function setInkState(inkPresent) {
      hasInk = inkPresent;
      if (placeholderEl) {
        placeholderEl.classList.toggle("is-hidden", inkPresent);
      }
      canvas.parentElement?.classList.remove("is-invalid");
    }

    function onPointerDown(evt) {
      if (evt.button !== 0 && evt.pointerType === "mouse") return;
      evt.preventDefault();
      resize();
      try {
        canvas.setPointerCapture?.(evt.pointerId);
      } catch {
        // Ignore if pointer capture is unavailable
      }
      drawing = true;
      lastPoint = getPoint(evt);

      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = "#0f172a";
      ctx.fill();
      setInkState(true);
    }

    function onPointerMove(evt) {
      if (!drawing || !lastPoint) return;
      evt.preventDefault();
      const pt = getPoint(evt);
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      lastPoint = pt;
      setInkState(true);
    }

    function onPointerUp(evt) {
      if (!drawing) return;
      drawing = false;
      lastPoint = null;
      try {
        if (canvas.hasPointerCapture?.(evt.pointerId)) {
          canvas.releasePointerCapture(evt.pointerId);
        }
      } catch {
        // Ignore capture release errors
      }
    }

    function clear() {
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      configureContext();
      setInkState(false);
    }

    function loadFromDataURL(dataUrl) {
      clear();
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        resize();
        const rect = canvas.getBoundingClientRect();
        ctx.drawImage(img, 0, 0, rect.width || canvas.width, rect.height || canvas.height);
        setInkState(true);
      };
      img.src = dataUrl;
    }

    function toCompactDataURL() {
      if (!hasInk) return "";
      const outW = 520;
      const outH = 105;
      const offscreen = document.createElement("canvas");
      offscreen.width = outW;
      offscreen.height = outH;
      offscreen.getContext("2d").drawImage(canvas, 0, 0, outW, outH);
      return offscreen.toDataURL("image/png");
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    configureContext();
    resize();
    window.addEventListener("resize", resize);

    return {
      clear,
      hasSignature: () => hasInk,
      toDataURL: toCompactDataURL
    };
  }

  const guestSig = createSignaturePad(
    document.getElementById("guestSigCanvas"),
    document.getElementById("guestSigPlaceholder")
  );

  document.querySelectorAll(".btn-clear-sig").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.getAttribute("data-clear") === "guestSigCanvas") guestSig.clear();
    });
  });

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function calculateAge(dobStr) {
    if (!dobStr) return null;
    const dob = new Date(`${dobStr}T00:00:00`);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age >= 0 && age < 130 ? age : null;
  }

  function updateAgeTag(dobStr, tagEl) {
    const age = calculateAge(dobStr);
    if (age === null) {
      tagEl.hidden = true;
      tagEl.textContent = "";
      tagEl.classList.remove("is-minor");
      return;
    }
    tagEl.hidden = false;
    const isMinor = age < 18;
    tagEl.classList.toggle("is-minor", isMinor);
    tagEl.textContent = isMinor ? `${age} yrs (Minor)` : `${age} yrs`;
  }

  function todayISO() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function setNowDateTime() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    signDateEl.value = todayISO();
    signTimeEl.value = `${hh}:${min}`;
  }

  document.getElementById("btnNow").addEventListener("click", setNowDateTime);
  dobEl.addEventListener("change", () => updateAgeTag(dobEl.value, primaryAgeTag));

  // Height auto-conversion
  minHeightInEl.addEventListener("input", () => {
    const val = parseFloat(minHeightInEl.value);
    if (!Number.isNaN(val) && val >= 0) {
      minHeightCmEl.value = (val * 2.54).toFixed(1);
    } else if (minHeightInEl.value === "") {
      minHeightCmEl.value = "";
    }
  });

  minHeightCmEl.addEventListener("input", () => {
    const val = parseFloat(minHeightCmEl.value);
    if (!Number.isNaN(val) && val >= 0) {
      minHeightInEl.value = (val / 2.54).toFixed(1);
    } else if (minHeightCmEl.value === "") {
      minHeightInEl.value = "";
    }
  });

  // Multiple Riders Management
  function getSelectedZoneRadio() {
    return zoneRadios.find((rb) => rb.checked) || zoneRadios[0];
  }

  function syncZoneVisibility() {
    zoneRadios.forEach((rb) => {
      const zone = rb.getAttribute("data-zone");
      const block = document.getElementById(`rules-${zone}`);
      if (block) block.hidden = !rb.checked;
    });
  }

  function applyInitialZoneFromUrl() {
    const zParam = (urlParams.get("zone") || "").toLowerCase().trim();
    if (!zParam) {
      zoneRadios[0].checked = true;
      syncZoneVisibility();
      return;
    }
    const target = zoneRadios.find((rb) => rb.getAttribute("data-zone") === zParam);
    if (target) {
      target.checked = true;
    } else {
      zoneRadios[0].checked = true;
    }
    syncZoneVisibility();
  }

  zoneRadios.forEach((rb) => rb.addEventListener("change", syncZoneVisibility));

  let riderSeq = 0;

  function updateRiderCount() {
    const extraCount = additionalRidersContainer.querySelectorAll(".rider-card").length;
    const total = (primaryIsRidingEl.checked ? 1 : 0) + extraCount;
    riderCountBadge.textContent = `Total Participants: ${total}`;
    btnAddRiderEl.disabled = extraCount >= MAX_EXTRA_PARTICIPANTS;

    additionalRidersContainer.querySelectorAll(".rider-card").forEach((card, idx) => {
      const num = primaryIsRidingEl.checked ? idx + 2 : idx + 1;
      const titleEl = card.querySelector(".rider-card-title");
      if (titleEl) titleEl.textContent = `Additional Participant #${num}`;
    });
  }

  function addRiderCard(initialData = {}) {
    riderSeq += 1;
    const seq = riderSeq;
    const nameId = `riderName_${seq}`;
    const dobId = `riderDob_${seq}`;
    const relId = `riderRel_${seq}`;

    const card = document.createElement("div");
    card.className = "rider-card";
    card.dataset.riderId = String(seq);

    card.innerHTML = `
      <div class="rider-card-head">
        <span class="rider-card-title">Additional Rider</span>
        <button type="button" class="btn-remove-rider no-print">Remove</button>
      </div>
      <div class="rider-fields-grid">
        <div class="field-row">
          <label for="${nameId}">RIDER FULL NAME:<span class="req">*</span></label>
          <input type="text" id="${nameId}" name="${nameId}" class="rider-name-input" placeholder="Enter rider's full name" value="${escapeHtml(initialData.name || "")}" required />
        </div>
        <div class="field-row">
          <label for="${dobId}">DATE OF BIRTH:<span class="req">*</span></label>
          <div class="dob-wrap">
            <input type="date" id="${dobId}" name="${dobId}" max="${todayISO()}" class="rider-dob-input" value="${escapeHtml(initialData.dob || "")}" required />
            <span class="age-tag rider-age-tag" hidden></span>
          </div>
        </div>
        <div class="field-row">
          <label for="${relId}">RELATION / GROUP:</label>
          <select id="${relId}" name="${relId}" class="rider-rel-input">
            <option value="Family / Child">Family / Child</option>
            <option value="Spouse / Partner">Spouse / Partner</option>
            <option value="Friend / Guest">Friend / Guest</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    `;

    const relSelect = card.querySelector(".rider-rel-input");
    if (initialData.relation) {
      relSelect.value = initialData.relation;
    }

    const dobInput = card.querySelector(".rider-dob-input");
    const ageTag = card.querySelector(".rider-age-tag");
    if (initialData.dob) {
      updateAgeTag(initialData.dob, ageTag);
    }

    dobInput.addEventListener("change", () => {
      dobInput.classList.remove("is-invalid");
      updateAgeTag(dobInput.value, ageTag);
    });

    card.querySelector(".rider-name-input").addEventListener("input", (e) => {
      e.target.classList.remove("is-invalid");
    });

    card.querySelector(".btn-remove-rider").addEventListener("click", () => {
      card.remove();
      updateRiderCount();
    });

    additionalRidersContainer.appendChild(card);
    updateRiderCount();
    if (!initialData.name) {
      card.querySelector(".rider-name-input").focus();
    }
  }

  btnAddRiderEl.addEventListener("click", () => {
    if (additionalRidersContainer.querySelectorAll(".rider-card").length < MAX_EXTRA_PARTICIPANTS) {
      addRiderCard();
    }
  });
  primaryIsRidingEl.addEventListener("change", updateRiderCount);

  function showFeedback(message, type) {
    feedbackEl.textContent = message;
    feedbackEl.className = `form-feedback no-print ${type}`;
    feedbackEl.hidden = false;
  }

  function clearFeedback() {
    feedbackEl.hidden = true;
    feedbackEl.textContent = "";
    document.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  }

  [fullNameEl, dobEl, mobileEl, addressEl, emailEl, signDateEl, signTimeEl].forEach((el) => {
    el.addEventListener("input", () => el.classList.remove("is-invalid"));
  });
  agreeTermsEl.addEventListener("change", () => {
    agreeTermsEl.closest(".checkbox-label")?.classList.remove("is-invalid");
  });

  function validateForm() {
    clearFeedback();
    const errors = [];
    let firstInvalid = null;

    if (!zoneRadios.some((rb) => rb.checked)) {
      errors.push("Select an Activity / Zone");
      if (!firstInvalid) firstInvalid = document.getElementById("zonePills");
    }

    const requiredInputs = [
      { el: fullNameEl, label: "Full Name" },
      { el: dobEl, label: "Date of Birth" },
      { el: mobileEl, label: "Mobile Number" },
      { el: addressEl, label: "Address" },
      { el: signDateEl, label: "Date" },
      { el: signTimeEl, label: "Time" }
    ];

    for (const item of requiredInputs) {
      if (!item.el.value.trim()) {
        item.el.classList.add("is-invalid");
        errors.push(item.label);
        if (!firstInvalid) firstInvalid = item.el;
      }
    }

    const mobileDigits = mobileEl.value.replace(/\D/g, "");
    if (mobileEl.value.trim() && mobileDigits.length < 7) {
      mobileEl.classList.add("is-invalid");
      errors.push("Valid Mobile Number (at least 7 digits)");
      if (!firstInvalid) firstInvalid = mobileEl;
    }

    if (emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      emailEl.classList.add("is-invalid");
      errors.push("Valid Email ID");
      if (!firstInvalid) firstInvalid = emailEl;
    }

    const riderCards = Array.from(additionalRidersContainer.querySelectorAll(".rider-card"));
    riderCards.forEach((card, i) => {
      const nameIn = card.querySelector(".rider-name-input");
      const dobIn = card.querySelector(".rider-dob-input");
      if (!nameIn.value.trim()) {
        nameIn.classList.add("is-invalid");
        errors.push(`Additional Rider #${i + 1} Name`);
        if (!firstInvalid) firstInvalid = nameIn;
      }
      if (!dobIn.value) {
        dobIn.classList.add("is-invalid");
        errors.push(`Additional Rider #${i + 1} DOB`);
        if (!firstInvalid) firstInvalid = dobIn;
      }
    });

    if (!primaryIsRidingEl.checked && riderCards.length === 0) {
      errors.push("At least 1 Participant (check primary signer is participating or add a name)");
      if (!firstInvalid) firstInvalid = document.getElementById("btnAddRider");
    }

    if (!agreeTermsEl.checked) {
      agreeTermsEl.closest(".checkbox-label")?.classList.add("is-invalid");
      errors.push("Terms & Conditions Agreement Checkbox");
      if (!firstInvalid) firstInvalid = agreeTermsEl;
    }

    if (!guestSig.hasSignature()) {
      document.getElementById("guestSigCanvas").parentElement?.classList.add("is-invalid");
      errors.push("Customer Signature");
      if (!firstInvalid) firstInvalid = document.getElementById("guestSigCanvas");
    }

    if (errors.length > 0) {
      showFeedback(`Please complete the required fields: ${errors.join(", ")}.`, "error");
      firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }

    return true;
  }

  function generateRefCode() {
    return `FS-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  function collectPayload() {
    const riders = [];
    if (primaryIsRidingEl.checked) {
      riders.push({
        name: fullNameEl.value.trim(),
        dob: dobEl.value,
        age: calculateAge(dobEl.value),
        relation: "Primary Signer"
      });
    }

    additionalRidersContainer.querySelectorAll(".rider-card").forEach((card) => {
      const name = card.querySelector(".rider-name-input").value.trim();
      const dob = card.querySelector(".rider-dob-input").value;
      const relation = card.querySelector(".rider-rel-input").value;
      riders.push({
        name,
        dob,
        age: calculateAge(dob),
        relation
      });
    });

    const selectedRadio = getSelectedZoneRadio();
    const selectedZone = selectedRadio.getAttribute("data-zone") || "gokart";
    const selectedActivity = selectedRadio.value;

    return {
      refCode: generateRefCode(),
      submittedAt: new Date().toISOString(),
      zone: selectedZone,
      activity: selectedActivity,
      activitiesText: selectedActivity,
      branch: branchEl.value,
      fullName: fullNameEl.value.trim(),
      dob: dobEl.value,
      mobileNumber: mobileEl.value.trim(),
      emailId: emailEl.value.trim(),
      address: addressEl.value.trim(),
      primaryIsRiding: primaryIsRidingEl.checked,
      totalRiders: riders.length,
      riders,
      minHeightIn: selectedZone === "gokart" ? minHeightInEl.value.trim() : "",
      minHeightCm: selectedZone === "gokart" ? minHeightCmEl.value.trim() : "",
      agreed: agreeTermsEl.checked,
      signDate: signDateEl.value,
      signTime: signTimeEl.value,
      guestSignature: guestSig.toDataURL(),
      hpWebsite: hpWebsiteEl ? hpWebsiteEl.value : ""
    };
  }

  async function sendToGoogleSheet(payload) {
    if (!GOOGLE_SCRIPT_URL) {
      return {
        synced: false,
        reason: "not_configured"
      };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      // text/plain avoids CORS preflight issues with Google Apps Script Web Apps
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!res.ok) {
        return { synced: false, reason: `HTTP ${res.status}` };
      }

      const data = await res.json().catch(() => ({ ok: true }));
      return { synced: data.ok !== false, data };
    } catch (err) {
      const reason = err?.name === "AbortError" ? "Request timed out" : (err?.message || "Network error");
      return { synced: false, reason };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function showConfirmationScreen(payload, sheetResult) {
    form.hidden = true;
    submissionScreen.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });

    displayRefCode.textContent = payload.refCode;
    displayTimestamp.textContent = `${payload.activitiesText} • ${payload.branch} • ${payload.signDate} at ${payload.signTime}`;

    if (sheetResult.synced) {
      sheetSyncStatus.hidden = false;
      sheetSyncStatus.className = "sync-status-note is-ok";
      sheetSyncStatus.textContent = "Your signed waiver has been received. Have a great time at Fun Strike! Game Zone!";
    } else if (sheetResult.reason === "not_configured") {
      sheetSyncStatus.hidden = false;
      sheetSyncStatus.className = "sync-status-note is-warn";
      sheetSyncStatus.textContent = "Online sync is not connected yet. Please show this screen or print/save PDF at the counter.";
    } else {
      sheetSyncStatus.hidden = false;
      sheetSyncStatus.className = "sync-status-note is-warn";
      sheetSyncStatus.textContent = `Could not reach server (${sheetResult.reason}). Please show this screen or print/save PDF at the counter.`;
    }

    summaryContactDl.innerHTML = `
      <dt>Activities:</dt><dd>${escapeHtml(payload.activitiesText)}</dd>
      <dt>Primary Name:</dt><dd>${escapeHtml(payload.fullName)}</dd>
      <dt>Mobile:</dt><dd>${escapeHtml(payload.mobileNumber)}</dd>
      <dt>Email:</dt><dd>${escapeHtml(payload.emailId || "—")}</dd>
      <dt>Address:</dt><dd>${escapeHtml(payload.address)}</dd>
    `;

    summaryRiderCount.textContent = String(payload.riders.length);
    summaryRidersList.innerHTML = payload.riders
      .map((r) => {
        const ageTxt = r.age !== null && r.age !== undefined
          ? ` (${r.age} yrs${r.age < 18 ? " — Minor" : ""})`
          : "";
        return `<li><strong>${escapeHtml(r.name)}</strong>${escapeHtml(ageTxt)} &mdash; <span>${escapeHtml(r.relation)}</span></li>`;
      })
      .join("");

    summaryGuestSigImg.src = payload.guestSignature || "";
    summaryGuestSigImg.hidden = !payload.guestSignature;
  }

  form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    if (hpWebsiteEl && hpWebsiteEl.value.trim()) return;
    if (!validateForm()) return;

    const payload = collectPayload();
    submitBtn.disabled = true;
    const origText = submitBtn.textContent;
    submitBtn.textContent = "Submitting...";

    const sheetResult = await sendToGoogleSheet(payload);

    submitBtn.disabled = false;
    submitBtn.textContent = origText;

    showConfirmationScreen(payload, sheetResult);
  });

  function resetFormForNextGuest() {
    submissionScreen.hidden = true;
    form.hidden = false;
    const keepMinIn = minHeightInEl.value;
    const keepMinCm = minHeightCmEl.value;
    form.reset();
    applyInitialZoneFromUrl();
    minHeightInEl.value = keepMinIn;
    minHeightCmEl.value = keepMinCm;
    additionalRidersContainer.innerHTML = "";
    primaryIsRidingEl.checked = true;
    primaryAgeTag.hidden = true;
    guestSig.clear();
    clearFeedback();
    setNowDateTime();
    updateRiderCount();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.getElementById("btnStartNextGuest").addEventListener("click", resetFormForNextGuest);

  document.getElementById("btnPrintCurrent").addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btnPrintFromConfirm").addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btnPrintBlank").addEventListener("click", () => {
    const wasHidden = form.hidden;
    const wasChecked = agreeTermsEl.checked;
    form.hidden = false;
    agreeTermsEl.checked = false;
    document.body.classList.add("printing-blank");

    const restore = () => {
      document.body.classList.remove("printing-blank");
      agreeTermsEl.checked = wasChecked;
      form.hidden = wasHidden;
      window.removeEventListener("afterprint", restore);
    };

    window.addEventListener("afterprint", restore);
    window.print();
    setTimeout(restore, 1000);
  });

  dobEl.max = todayISO();
  applyInitialZoneFromUrl();
  setNowDateTime();
  updateRiderCount();
})();
