document.addEventListener('DOMContentLoaded', () => {

  // --- NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- MOBILE MENU TOGGLE ---
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '80px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'white';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        navLinks.style.borderBottom = '1px solid #E5E7EB';
      }
    });
    
    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if(window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // --- SMOOTH SCROLLING ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Scroll considering the fixed navbar height
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // --- FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        // Set max-height to scrollHeight for smooth animation
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // --- FORM SUBMISSION MOCK ---
  const form = document.querySelector('.contact-form');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      btn.textContent = 'Sending...';
      btn.style.opacity = '0.8';
      
      setTimeout(() => {
        btn.textContent = 'Request Sent Successfully!';
        btn.style.background = '#10B981'; // Success green
        form.reset();
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.opacity = '1';
        }, 3000);
      }, 1500);
    });
  }
  // --- REVIEW FORM INTERACTIVITY ---
  const starSelector = document.getElementById('starSelector');
  const ratingValueInput = document.getElementById('ratingValue');
  const reviewForm = document.getElementById('reviewForm');
  
  if (starSelector) {
    const stars = starSelector.querySelectorAll('.star-select');
    
    stars.forEach(star => {
      star.addEventListener('click', (e) => {
        const val = parseInt(e.target.getAttribute('data-value'));
        ratingValueInput.value = val;
        
        // Reset all
        stars.forEach(s => s.classList.remove('active'));
        // Set active up to clicked
        stars.forEach(s => {
          if (parseInt(s.getAttribute('data-value')) <= val) {
            s.classList.add('active');
          }
        });
      });
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('reviewSubmitBtn');
      const originalText = btn.textContent;
      
      btn.textContent = 'Submitting...';
      btn.style.opacity = '0.8';
      
      setTimeout(() => {
        btn.textContent = 'Review Submitted!';
        btn.style.background = '#4CAF50'; // Success green
        btn.style.color = 'white';
        btn.style.border = 'none';
        reviewForm.reset();
        
        // Reset stars to 5
        ratingValueInput.value = 5;
        starSelector.querySelectorAll('.star-select').forEach(s => s.classList.add('active'));
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.color = '';
          btn.style.border = '';
          btn.style.opacity = '1';
        }, 3000);
      }, 1500);
    });
  }

});
