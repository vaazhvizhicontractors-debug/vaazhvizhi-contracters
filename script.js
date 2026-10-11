
"use strict";

(() => {
  const CONFIG = {
    whatsappNumber: "919025541161",
    businessName: "Vaazhvizhi Contracters"
  };

  const $ = (id) => document.getElementById(id);

  const getValue = (form, name) => {
    const field = form.elements.namedItem(name);
    return field ? String(field.value || "").trim() : "";
  };

  const digitsOnly = (value) => value.replace(/\D/g, "");

  function showError(id, message) {
    const element = $(id);
    if (element) element.textContent = message || "";
  }

  function showStatus(id, message) {
    const element = $(id);
    if (element) element.textContent = message || "";
  }

  function validPhone(value) {
    const length = digitsOnly(value).length;
    return length >= 10 && length <= 15;
  }

  function validateFields(form, names) {
    for (const name of names) {
      const field = form.elements.namedItem(name);
      if (!field) continue;

      field.setCustomValidity("");

      if (!String(field.value || "").trim()) {
        field.setCustomValidity("Please complete this field.");
        field.reportValidity();
        field.focus();
        return false;
      }
    }

    return true;
  }

  function validatePhone(form, name) {
    const field = form.elements.namedItem(name);
    if (!field) return false;

    field.setCustomValidity("");

    if (!validPhone(field.value)) {
      field.setCustomValidity(
        "Enter a valid mobile number containing 10–15 digits."
      );
      field.reportValidity();
      field.focus();
      return false;
    }

    return true;
  }

  function openWhatsApp(message) {
    const url =
      `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Try opening WhatsApp from the user's button action.
    const opened = window.open(url, "_blank");

    if (opened) {
      opened.opener = null;
      return true;
    }

    // Fallback when the browser blocks pop-ups.
    window.location.assign(url);
    return false;
  }

  // 1. MOBILE NAVIGATION
  const menuButton = $("menuToggle");
  const nav = $("primaryNav");

  if (menuButton && nav) {
    function closeMenu() {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }

    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // 2. AUTOMATIC FOOTER YEAR
  if ($("currentYear")) {
    $("currentYear").textContent = new Date().getFullYear();
  }

  // 3. PROJECT CATEGORY CARDS
  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => {
      const projectSelect = $("projectType");
      const category = card.dataset.project;

      if (!projectSelect || !category) return;

      const matchingOption = Array.from(projectSelect.options).find(
        (option) => option.value === category || option.text === category
      );

      if (matchingOption) {
        projectSelect.value = matchingOption.value;
      }

      showError("step1Error", "");
      showStatus("quoteStatus", "");
    });
  });

  // 4. TWO-STEP DETAILED QUOTE FORM
  const form = $("detailedQuoteForm");

  if (form) {
    const steps = Array.from(form.querySelectorAll(".form-step"));
    const progressBar = $("progressBar");
    const stepLabel = $("stepLabel");
    const stepTitle = $("stepTitle");
    const nextButton = $("nextStep");
    const backButton = $("backStep");
    const submitButton = $("submitQuote");

    let currentStep = 1;

    function goToStep(number) {
      currentStep = number;

      steps.forEach((step) => {
        const active = Number(step.dataset.step) === number;
        step.hidden = !active;
        step.classList.toggle("is-active", active);
      });

      if (progressBar) {
        progressBar.style.width = number === 1 ? "50%" : "100%";
      }

      if (stepLabel) {
        stepLabel.textContent = `STEP ${number} OF 2`;
      }

      if (stepTitle) {
        stepTitle.textContent =
          number === 1 ? "Your details" : "Project details";
      }

      showError("step1Error", "");
      showError("step2Error", "");
      showStatus("quoteStatus", "");

      const firstField = steps[number - 1]?.querySelector(
        "input, select, textarea"
      );

      if (firstField) firstField.focus({ preventScroll: true });
    }

    function validateStepOne() {
      if (!validateFields(form, [
        "name",
        "phone",
        "projectType",
        "service",
        "location"
      ])) {
        showError("step1Error", "Please complete all required fields.");
        return false;
      }

      if (!validatePhone(form, "phone")) {
        showError("step1Error", "Please check your mobile number.");
        return false;
      }

      return true;
    }

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        if (validateStepOne()) {
          goToStep(2);
        }
      });
    }

    if (backButton) {
      backButton.addEventListener("click", () => {
        goToStep(1);
      });
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      showError("step2Error", "");
      showStatus("quoteStatus", "");

      if (currentStep !== 2) {
        goToStep(1);
        showError("step1Error", "Please complete Step 1 first.");
        return;
      }

      // Recheck Step 1 before building the WhatsApp message.
      if (!validateStepOne()) {
        goToStep(1);
        return;
      }

      const name = getValue(form, "name");
      const phone = getValue(form, "phone");
      const category = getValue(form, "projectType");
      const service = getValue(form, "service");
      const location = getValue(form, "location");
      const budget = getValue(form, "budget") || "Not specified";
      const timeline = getValue(form, "timeline") || "Not specified";
      const details = getValue(form, "details") || "Not provided";

      const message = [
        `Hello ${CONFIG.businessName},`,
        "",
        "I would like to request a project quotation.",
        "",
        "CUSTOMER DETAILS",
        `Name: ${name}`,
        `Mobile: ${phone}`,
        "",
        "PROJECT DETAILS",
        `Project Category: ${category}`,
        `Service Required: ${service}`,
        `Location: ${location}`,
        `Estimated Budget: ${budget}`,
        `Expected Start: ${timeline}`,
        `Additional Requirements: ${details}`
      ].join("\n");

      if (submitButton) submitButton.disabled = true;

      try {
        openWhatsApp(message);

        showStatus(
          "quoteStatus",
          "WhatsApp is opening. Review your enquiry and press Send there. The website has not saved the enquiry."
        );
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  // 5. QUICK WHATSAPP ENQUIRY
  const quickForm = $("quickEnquiryForm");

  if (quickForm) {
    quickForm.addEventListener("submit", (event) => {
      event.preventDefault();

      showError("quickError", "");

      if (!validateFields(quickForm, [
        "name",
        "service",
        "message"
      ])) {
        showError(
          "quickError",
          "Please complete your name, service and message."
        );
        return;
      }

      const name = getValue(quickForm, "name");
      const service = getValue(quickForm, "service");
      const details = getValue(quickForm, "message");

      const message = [
        `Hello ${CONFIG.businessName},`,
        "",
        "I have a quick enquiry.",
        `Name: ${name}`,
        `Service Required: ${service}`,
        "",
        "Message:",
        details
      ].join("\n");

      openWhatsApp(message);
    });
  }
})();
