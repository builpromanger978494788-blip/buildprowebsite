import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, collection, addDoc, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCG6t_pQloFChQge_6qzaExPIH64d0sPnY",
  authDomain: "build-pro-manager.firebaseapp.com",
  projectId: "build-pro-manager",
  storageBucket: "build-pro-manager.firebasestorage.app",
  messagingSenderId: "1016557767211",
  appId: "1:1016557767211:web:c803edc7f1eec993f7f86e",
  measurementId: "G-7C74MHGNV7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Update Brand Name
function updateBrand(name, logoUrl) {
  const parts = name.split(" ");
  const word1 = parts[0] || "VASTUTEJ";
  const word2 = parts.slice(1).join(" ") || "INFRATECH";

  document.querySelectorAll('.logo').forEach(el => {
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.gap = "10px";
    el.style.textDecoration = "none";
    
    const isFooter = el.closest('.footer') !== null;
    if (isFooter) {
      el.style.marginBottom = "12px";
    }

    let imgHtml = logoUrl 
      ? `<img src="${logoUrl}" alt="Logo" style="width:44px; height:44px; border-radius:10px; object-fit:contain; background:#fff; padding:2px; flex-shrink:0;" />`
      : `<img src="Icon.png" alt="Logo" style="width:44px; height:44px; border-radius:10px; object-fit:contain; background:#fff; padding:2px; flex-shrink:0;" />`;

    el.innerHTML = `
      ${imgHtml}
      <div style="display:flex; align-items:center; gap:6px;">
        <div style="font-weight:900; font-size:20px; color:${isFooter ? '#ffffff' : '#111827'}; letter-spacing:0.5px; font-family:'Inter',sans-serif;">${word1.toUpperCase()}</div>
        <div style="font-size:20px; font-weight:900; color:${isFooter ? '#d1d5db' : '#6b7280'}; letter-spacing:1px; text-transform:uppercase; font-family:'Inter',sans-serif;">${word2}</div>
      </div>
    `;
  });
  const footerBrand = document.querySelector('.footer-brand p');
  if(footerBrand) footerBrand.textContent = `Your trusted partner in building spaces that inspire, protect, and prosper under the ${name} standard.`;
  document.title = `${name} | Construction & Vastu Experts`;
}

// Update DOM with Data
function renderContent(data) {
  if(!data) return;
  if(data.brandName || data.brandLogo) updateBrand(data.brandName || "VASTUTEJ Infratech", data.brandLogo);

  // Update Hero
  if(data.hero) {
    const heroH1 = document.querySelector('.hero h1');
    const heroP = document.querySelector('.hero p');
    const heroBadge = document.querySelector('.hero .badge');
    const heroImg = document.querySelector('.hero-image img');
    if(heroH1) heroH1.textContent = data.hero.title;
    if(heroP) heroP.textContent = data.hero.description;
    if(heroBadge) heroBadge.textContent = data.hero.badge;
    if(heroImg) heroImg.src = data.hero.imageUrl;
  }

  // Update About
  if(data.about) {
    const aboutTitle = document.querySelector('#about h2');
    const aboutSub = document.querySelector('#about .subtitle');
    const aboutImg = document.querySelector('.about-image img');
    const aboutP = document.querySelectorAll('.about-content p');
    const vision = document.querySelector('.vision-card p');
    const mission = document.querySelector('.mission-card p');

    if(aboutTitle) aboutTitle.textContent = data.about.title;
    if(aboutSub) aboutSub.textContent = data.about.subtitle;
    if(aboutImg) aboutImg.src = data.about.imageUrl;
    if(aboutP[0]) aboutP[0].textContent = data.about.paragraph1;
    if(aboutP[1]) aboutP[1].textContent = data.about.paragraph2;
    if(vision) vision.textContent = data.about.vision;
    if(mission) mission.textContent = data.about.mission;
  }

  // Update Portfolio
  if(data.portfolio) {
    const pTitle = document.querySelector('#portfolio h2');
    const pSub = document.querySelector('#portfolio .subtitle');
    const pDesc = document.querySelector('#portfolio p');
    const pGrid = document.querySelector('.portfolio-grid');

    if(pTitle) pTitle.textContent = data.portfolio.title;
    if(pSub) pSub.textContent = data.portfolio.subtitle;
    if(pDesc) pDesc.textContent = data.portfolio.description;
    
    if(pGrid && data.portfolio.projects) {
      pGrid.innerHTML = data.portfolio.projects.map(p => {
        // Support array of imageUrls or fallback to single imageUrl
        const imagesStr = encodeURIComponent(JSON.stringify(p.imageUrls || (p.imageUrl ? [p.imageUrl] : [])));
        const thumbUrl = (p.imageUrls && p.imageUrls.length > 0) ? p.imageUrls[0] : (p.imageUrl || '');
        return `
        <div class="portfolio-item" data-category="${p.category}">
          <div class="portfolio-img-container" onclick="openLightbox('${imagesStr}')">
            <img src="${thumbUrl}" alt="${p.title}">
            <div class="portfolio-overlay">
              <span class="project-tag">${p.category === 'vastu' ? 'Vastu Consulting' : p.category.charAt(0).toUpperCase() + p.category.slice(1)}</span>
              <h3>${p.title}</h3>
              <p>${p.location||''}</p>
            </div>
          </div>
        </div>
      `}).join('');

      // --- RE-ATTACH PORTFOLIO FILTER LOGIC ---
      const filterBtns = document.querySelectorAll('.filter-btn');
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      if (filterBtns.length > 0 && portfolioItems.length > 0) {
        filterBtns.forEach(btn => {
          // Remove old listeners to avoid duplicates
          const newBtn = btn.cloneNode(true);
          btn.parentNode.replaceChild(newBtn, btn);
          
          newBtn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            newBtn.classList.add('active');

            const filterValue = newBtn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
              if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
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
    }
  }

  // Update Services
  if(data.services) {
    const sTitle = document.querySelector('#services h2');
    const sSub = document.querySelector('#services .subtitle');
    const sDesc = document.querySelector('#services p');
    const sGrid = document.querySelector('.services-grid');

    if(sTitle) sTitle.textContent = data.services.title;
    if(sSub) sSub.textContent = data.services.subtitle;
    if(sDesc) sDesc.textContent = data.services.description;
    
    if(sGrid && data.services.list) {
      sGrid.innerHTML = data.services.list.map(s => `
        <div class="service-card">
          ${s.imageUrl ? `<img src="${s.imageUrl}" style="width:100%;height:150px;object-fit:cover;border-radius:8px;margin-bottom:15px;"/>` : `<div class="service-icon">${s.icon}</div>`}
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>
      `).join('');
    }
  }

  // Update Directors
  if(data.directors) {
    const dGrid = document.querySelector('.directors-grid');
    if(dGrid) {
      dGrid.innerHTML = data.directors.map(d => `
        <div class="director-card">
          <div class="director-img-container">
            <img src="${d.imageUrl || 'https://via.placeholder.com/600x600?text=Director'}" alt="${d.name}">
          </div>
          <div class="director-info">
            <h3>${d.name}</h3>
            <span class="role">${d.role}</span>
            <p>${d.description}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // Update Staff
  if(data.staff) {
    const stGrid = document.querySelector('.staff-grid');
    if(stGrid) {
      stGrid.innerHTML = data.staff.map(s => `
        <div class="staff-card">
          <div class="staff-img-container">
            <img src="${s.imageUrl || 'https://via.placeholder.com/600x600?text=Staff'}" alt="${s.name}">
          </div>
          <div class="staff-info">
            <h4>${s.name}</h4>
            <span>${s.role}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Update FAQs
  if(data.faq) {
    const fTitle = document.querySelector('#faq h2');
    const fSub = document.querySelector('#faq .subtitle');
    const fDesc = document.querySelector('#faq p');
    const fGrid = document.querySelector('.faq-container');

    if(fTitle) fTitle.textContent = data.faq.title;
    if(fSub) fSub.textContent = data.faq.subtitle;
    if(fDesc) fDesc.textContent = data.faq.description;
    
    if(fGrid && data.faq.list) {
      fGrid.innerHTML = data.faq.list.map(f => `
        <div class="faq-item">
          <button class="faq-question">
            ${f.question}
            <span class="toggle-icon">+</span>
          </button>
          <div class="faq-answer">
            <div class="answer-content">${f.answer}</div>
          </div>
        </div>
      `).join('');

      // Re-attach accordion listener
      document.querySelectorAll('.faq-item').forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        btn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          document.querySelectorAll('.faq-item').forEach(other => {
            other.classList.remove('active');
            if(other.querySelector('.faq-answer')) other.querySelector('.faq-answer').style.maxHeight = null;
          });
          if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + "px";
          }
        });
      });
    }
  }
}

// Lightbox Slider State
let currentLightboxImages = [];
let currentLightboxIndex = 0;

window.openLightbox = function(imagesStr) {
  const images = JSON.parse(decodeURIComponent(imagesStr));
  if (!images || images.length === 0) return;
  
  currentLightboxImages = images;
  currentLightboxIndex = 0;
  
  updateLightboxView();
  document.getElementById('lightbox').classList.add('active');
};

function updateLightboxView() {
  const lightboxContent = document.getElementById('lightboxContent');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  
  if(currentLightboxImages.length <= 1) {
    if(prevBtn) prevBtn.style.display = 'none';
    if(nextBtn) nextBtn.style.display = 'none';
  } else {
    if(prevBtn) prevBtn.style.display = 'block';
    if(nextBtn) nextBtn.style.display = 'block';
  }
  
  lightboxContent.innerHTML = `<img src="${currentLightboxImages[currentLightboxIndex]}" alt="Project Image" />`;
}

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxPrev = document.getElementById('lightboxPrev');
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }
  
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      if(currentLightboxImages.length > 0) {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
        updateLightboxView();
      }
    });
  }
  
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      if(currentLightboxImages.length > 0) {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
        updateLightboxView();
      }
    });
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === document.getElementById('lightboxContent')) {
        lightbox.classList.remove('active');
      }
    });
  }
});

// 1. Instantly load from cache for blazing fast performance
const cached = localStorage.getItem('vastu_cms_cache');
if(cached) {
  try { renderContent(JSON.parse(cached)); } catch(e) {}
}

// 2. Fetch fresh from Firebase and update cache
onSnapshot(doc(db, "website_content", "main"), (snap) => {
  if(!snap.exists()) return;
  const data = snap.data();
  localStorage.setItem('vastu_cms_cache', JSON.stringify(data));
  renderContent(data);
});

// Load Reviews
const q = query(collection(db, "reviews"), where("status", "==", "approved"));
onSnapshot(q, (snap) => {
  const dynamicReviews = document.getElementById('dynamicReviews');
  if(!dynamicReviews) return;
  
  if(snap.empty) {
    dynamicReviews.innerHTML = '<p style="text-align:center;color:#6b7280;width:100%;">No reviews yet. Be the first to share your experience!</p>';
    return;
  }

  const reviewsList = [];
  snap.forEach(docSnap => reviewsList.push(docSnap.data()));
  
  // Sort descending by timestamp and limit to 10
  reviewsList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  const topReviews = reviewsList.slice(0, 10);

  dynamicReviews.innerHTML = '';
  topReviews.forEach(r => {
    const stars = "★".repeat(r.rating) + "☆".repeat(5-r.rating);
    const initial = r.name ? r.name.charAt(0).toUpperCase() : "U";
    dynamicReviews.innerHTML += `
      <div class="review-card">
        <div class="stars" style="color:var(--primary);letter-spacing:2px;font-size:1.2rem;margin-bottom:15px;">${stars}</div>
        <p class="review-text">"${r.text}"</p>
        <div class="reviewer">
          <div class="avatar">${initial}</div>
          <div>
            <strong>${r.name}</strong>
            <span>Client</span>
          </div>
        </div>
      </div>
    `;
  });
});

// Intercept Consultation Form
const consultationForm = document.getElementById('consultationForm');
if(consultationForm) {
  consultationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = consultationForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    try {
      await addDoc(collection(db, "consultations"), {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        status: 'new',
        timestamp: Date.now()
      });
      btn.textContent = 'Request Sent Successfully!';
      btn.style.background = '#10B981';
      consultationForm.reset();
    } catch(err) {
      btn.textContent = 'Failed. Try again.';
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}

// Intercept Review Form
const reviewForm = document.getElementById('reviewForm');
if(reviewForm) {
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('reviewSubmitBtn');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    try {
      await addDoc(collection(db, "reviews"), {
        name: document.getElementById('reviewerName').value,
        rating: parseInt(document.getElementById('ratingValue').value),
        text: document.getElementById('reviewText').value,
        status: 'pending',
        timestamp: Date.now()
      });
      btn.textContent = 'Review Submitted (Pending Approval)';
      btn.style.background = '#4CAF50';
      btn.style.color = 'white';
      reviewForm.reset();
    } catch(err) {
      btn.textContent = 'Failed. Try again.';
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 4000);
  });
}
