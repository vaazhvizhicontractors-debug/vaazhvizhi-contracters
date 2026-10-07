document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', String(navLinks.classList.contains('is-open')));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Quote Form Submission (WhatsApp Integration & Validation)
  const quoteForm = document.getElementById('quoteForm');
  const formStatus = document.getElementById('formStatus');

  if (quoteForm && formStatus) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value.trim();
      const location = document.getElementById('location').value.trim();
      const message = document.getElementById('message').value.trim();
      const honeypot = document.getElementById('website').value.trim();

      // Spam Prevention (Honeypot check)
      if (honeypot) return;

      // Validation
      if (!name || !phone || !service) {
        formStatus.textContent = 'Please fill in your name, phone number and service.';
        formStatus.className = 'form-status error';
        return;
      }

      formStatus.textContent = 'Preparing your enquiry...';
      formStatus.className = 'form-status sending';

      // Construct WhatsApp Direct Message
      const whatsappNumber = '919025541161';
      const text = `Hello Vaazhvizhi Contracters,%0A%0A*New Project Enquiry*%0A- *Name:* ${encodeURIComponent(name)}%0A- *Phone:* ${encodeURIComponent(phone)}%0A- *Service:* ${encodeURIComponent(service)}%0A- *Location:* ${encodeURIComponent(location || 'Not specified')}%0A- *Details:* ${encodeURIComponent(message || 'None')}`;

      setTimeout(() => {
        formStatus.textContent = 'Thank you! Redirecting to WhatsApp...';
        formStatus.className = 'form-status success';
        
        // Open WhatsApp with pre-filled enquiry details
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
        
        quoteForm.reset();
      }, 800);
    });
  }
});
