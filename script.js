/* =========================================================
   VAazhvizhi Contracters - QUOTE SUBMISSION
   ========================================================= */


/* =========================
   CONFIGURATION
   ========================= */

const QUOTE_CONFIG = {

    whatsappNumber: "919025541161",

    googleScriptUrl:
        "https://script.google.com/macros/s/AKfycbyMsEAzXdSathCJm2i44CA6lelm6KDYw9MTSRDPxiPriNXhYg2IC0AB5gIE0CYkU5hO/exec"

};


/* =========================
   QUICK QUOTE
   ========================= */

document
    .getElementById("quickQuoteForm")
    ?.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("quickName").value.trim();

        const phone =
            document.getElementById("quickPhone").value.trim();

        const requirement =
            document.getElementById("quickRequirement").value;

        const message =
            document.getElementById("quickMessage").value.trim();


        /* Validation */

        if (!name) {
            alert("Please enter your name.");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (!requirement) {
            alert("Please select your requirement.");
            return;
        }


        /* WhatsApp Message */

        const whatsappMessage =
`Hello Vaazhvizhi Contracters,

I would like to get a Quick Quote.

Name: ${name}
Mobile: ${phone}
Requirement: ${requirement}
Message: ${message || "Not provided"}

Please contact me regarding my requirement.`;

        const whatsappUrl =
            `https://wa.me/${QUOTE_CONFIG.whatsappNumber}?text=` +
            encodeURIComponent(whatsappMessage);


        /* Open WhatsApp */

        window.open(whatsappUrl, "_blank");


        /* Reset */

        this.reset();

        closeQuickQuote();

    });



/* =========================
   DETAILED QUOTE
   ========================= */

document
    .getElementById("detailedQuoteForm")
    ?.addEventListener("submit", async function (event) {

        event.preventDefault();


        /* Collect Data */

        const name =
            document.getElementById("detailedName").value.trim();

        const phone =
            document.getElementById("detailedPhone").value.trim();

        const location =
            document.getElementById("detailedLocation").value.trim();

        const projectType =
            document.getElementById("detailedProjectType").value;

        const area =
            document.getElementById("detailedArea").value.trim();

        const floors =
            document.getElementById("detailedFloors").value;

        const budget =
            document.getElementById("detailedBudget").value;

        const message =
            document.getElementById("detailedMessage").value.trim();


        /* Validation */

        if (!name) {
            alert("Please enter your full name.");
            return;
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (!location) {
            alert("Please enter the project location.");
            return;
        }

        if (!projectType) {
            alert("Please select the project type.");
            return;
        }


        /* Button */

        const submitButton =
            this.querySelector(".submit-quote-btn");

        const originalButtonText =
            submitButton.textContent;

        submitButton.disabled = true;

        submitButton.textContent =
            "Submitting...";


        /* Data */

        const formData = {

            formType: "Detailed Quote",

            name: name,

            phone: phone,

            location: location,

            projectType: projectType,

            area: area,

            floors: floors,

            budget: budget,

            message: message,

            submittedAt:
                new Date().toISOString()

        };


        try {

            /* =========================
               SEND TO GOOGLE SHEETS
               ========================= */

            await fetch(
                QUOTE_CONFIG.googleScriptUrl,
                {
                    method: "POST",

                    mode: "no-cors",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        new URLSearchParams(formData)
                }
            );


            /* =========================
               SUCCESS MESSAGE
               ========================= */

            alert(
                "Thank you! Your detailed quote request has been submitted successfully."
            );


            /* =========================
               WHATSAPP FOLLOW-UP
               ========================= */

            const whatsappMessage =
`Hello Vaazhvizhi Contracters,

I have submitted a Detailed Quote request.

Name: ${name}
Mobile: ${phone}
Project Location: ${location}
Project Type: ${projectType}
Area: ${area || "Not provided"} sq.ft
Floors: ${floors || "Not provided"}
Budget: ${budget || "Not provided"}

Additional Details:
${message || "Not provided"}

Please contact me regarding my project.`;

            const whatsappUrl =
                `https://wa.me/${QUOTE_CONFIG.whatsappNumber}?text=` +
                encodeURIComponent(whatsappMessage);


            /* Open WhatsApp */

            window.open(
                whatsappUrl,
                "_blank"
            );


            /* Reset */

            this.reset();

            closeDetailedQuote();


        } catch (error) {

            console.error(
                "Detailed quote submission error:",
                error
            );

            alert(
                "Something went wrong while submitting your request. Please try again or contact us directly on WhatsApp."
            );

        } finally {

            submitButton.disabled = false;

            submitButton.textContent =
                originalButtonText;

        }

    });



/* =========================
   QUICK QUOTE MODAL
   ========================= */

function openQuickQuote() {

    const modal =
        document.getElementById("quickQuoteModal");

    if (!modal) return;

    modal.style.display = "flex";

    document.body.classList.add("modal-open");

}


function closeQuickQuote() {

    const modal =
        document.getElementById("quickQuoteModal");

    if (!modal) return;

    modal.style.display = "none";

    document.body.classList.remove("modal-open");

}



/* =========================
   DETAILED QUOTE MODAL
   ========================= */

function openDetailedQuote() {

    const modal =
        document.getElementById("detailedQuoteModal");

    if (!modal) return;

    modal.style.display = "flex";

    document.body.classList.add("modal-open");

}


function closeDetailedQuote() {

    const modal =
        document.getElementById("detailedQuoteModal");

    if (!modal) return;

    modal.style.display = "none";

    document.body.classList.remove("modal-open");

}



/* =========================
   CLOSE MODAL ON OUTSIDE CLICK
   ========================= */

window.addEventListener(
    "click",
    function (event) {

        const quickModal =
            document.getElementById("quickQuoteModal");

        const detailedModal =
            document.getElementById("detailedQuoteModal");


        if (
            quickModal &&
            event.target === quickModal
        ) {
            closeQuickQuote();
        }


        if (
            detailedModal &&
            event.target === detailedModal
        ) {
            closeDetailedQuote();
        }

    }
);



/* =========================
   ESC KEY CLOSE
   ========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") return;

        closeQuickQuote();

        closeDetailedQuote();

    }
);
