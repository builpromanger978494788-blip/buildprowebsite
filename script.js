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

  // --- ROUTING / PAGE SWITCHING ---
  const navLinksList = document.getElementById('navLinks');
  
  function showPage(targetId) {
    const pageId = targetId.startsWith('#') ? targetId.substring(1) : targetId;
    if (!pageId) return;
    
    // Determine which main page section to show
    let mainPageId = pageId;
    let subSectionId = null;
    
    // If the target is reviews, faq, or portfolio, the main page is 'home'
    if (pageId === 'reviews' || pageId === 'faq' || pageId === 'portfolio') {
      mainPageId = 'home';
      subSectionId = pageId;
    }
    
    const targetPage = document.getElementById(mainPageId);
    if (!targetPage || !targetPage.classList.contains('page-section')) return;
    
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show target page
    targetPage.classList.add('active');
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${pageId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
    
    // Scroll handling
    if (subSectionId) {
      const subSection = document.getElementById(subSectionId);
      if (subSection) {
        setTimeout(() => {
          const headerOffset = 80;
          const elementPosition = subSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    }
  }

  // Handle all hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const pageId = targetId.substring(1);
      const isSubSection = pageId === 'reviews' || pageId === 'faq' || pageId === 'portfolio';
      const targetPage = document.getElementById(pageId);
      const isPageSection = targetPage && targetPage.classList.contains('page-section');
      
      if (isPageSection || isSubSection) {
        e.preventDefault();
        showPage(targetId);
        
        // Update URL hash
        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          location.hash = targetId;
        }

        // If on mobile, hide the menu
        if (window.innerWidth <= 768 && navLinksList) {
          navLinksList.style.display = 'none';
        }
      }
    });
  });

  // Handle browser back/forward buttons (hashchange)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#home';
    showPage(hash);
  });

  // Initial load
  const initialHash = window.location.hash || '#home';
  const initialPageId = initialHash.substring(1);
  const isInitialSub = initialPageId === 'reviews' || initialPageId === 'faq' || initialPageId === 'portfolio';
  const initialPage = document.getElementById(isInitialSub ? 'home' : initialPageId);
  if (initialPage && initialPage.classList.contains('page-section')) {
    showPage(initialHash);
  } else {
    showPage('#home');
  }

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

  // Form submissions are now handled in firebase-website.js
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

  // Review form submission is handled in firebase-website.js

  // --- PORTFOLIO FILTER ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0 && portfolioItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
            item.style.display = 'block';
            // Force a layout flash delay then transition in
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }
});
