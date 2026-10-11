/* =========================================================
   VAazhvizhi Contracters - ENQUIRY HANDLER
   ========================================================= */

const QUOTE_CONFIG = {
    whatsappNumber: "919025541161",
    businessName: "Vaazhvizhi Contracters"
};

function setFormStatus(message, type) {
    const statusEl = document.getElementById("formStatus");

    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = "form-status";

    if (type) {
        statusEl.classList.add(type);
    }
}

function sanitizePhone(value) {
    return value.replace(/\D/g, "");
}

function buildWhatsAppMessage(data) {
    return `Hello ${QUOTE_CONFIG.businessName},

I would like to enquire about your services.

Name: ${data.name}
Phone: ${data.phone}
Service: ${data.service}
Location: ${data.location || "Not provided"}
Project Details: ${data.message || "Not provided"}

Please contact me regarding my requirement.`;
}

const quoteForm = document.getElementById("quoteForm");

if (quoteForm) {
    quoteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name")?.value.trim() || "";
        const phone = document.getElementById("phone")?.value.trim() || "";
        const service = document.getElementById("service")?.value.trim() || "";
        const location = document.getElementById("location")?.value.trim() || "";
        const message = document.getElementById("message")?.value.trim() || "";
        const honeypot = document.getElementById("website")?.value.trim() || "";

        if (honeypot) {
            return;
        }

        if (!name) {
            setFormStatus("Please enter your full name.", "error");
            document.getElementById("name")?.focus();
            return;
        }

        const cleanedPhone = sanitizePhone(phone);

        if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
            setFormStatus("Please enter a valid mobile number.", "error");
            document.getElementById("phone")?.focus();
            return;
        }

        if (!service) {
            setFormStatus("Please select the service you need.", "error");
            document.getElementById("service")?.focus();
            return;
        }

        const submitButton = this.querySelector("button[type='submit']");
        const originalButtonText = submitButton ? submitButton.textContent : "Send Enquiry";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        setFormStatus("Preparing your WhatsApp enquiry...", "sending");

        const whatsappMessage = buildWhatsAppMessage({
            name,
            phone: cleanedPhone,
            service,
            location,
            message
        });

        const whatsappUrl =
            `https://wa.me/${QUOTE_CONFIG.whatsappNumber}?text=` +
            encodeURIComponent(whatsappMessage);

        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        this.reset();
        setFormStatus("Your enquiry is ready to send on WhatsApp.", "success");

        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("is-open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape" || !navLinks) return;

    if (navLinks.classList.contains("is-open")) {
        navLinks.classList.remove("is-open");

        if (menuBtn) {
            menuBtn.setAttribute("aria-expanded", "false");
        }
    }
});
