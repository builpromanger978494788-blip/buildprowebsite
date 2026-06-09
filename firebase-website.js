import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, collection, addDoc, query, where } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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

// ─── HELPER: Set text safely ───
function setText(el, txt) { if (el && txt !== undefined && txt !== null) el.textContent = txt; }
function setHTML(el, html) { if (el && html !== undefined) el.innerHTML = html; }

// ─── BRAND / LOGO ───
function updateBrand(name, logoUrl) {
  const parts = (name || "VASTUTEJ INFRATECH").split(" ");
  const word1 = parts[0] || "VASTUTEJ";
  const word2 = parts.slice(1).join(" ") || "INFRATECH";

  // Navbar logo
  const navText = document.getElementById("navLogoText");
  const navSub = document.getElementById("navLogoSub");
  const navIcon = document.getElementById("navLogoIcon");
  const navImg = document.getElementById("navLogoImg");
  if (navText) navText.childNodes[0].textContent = word1 + " ";
  if (navSub) navSub.textContent = word2;

  // Footer logo
  const footerText = document.getElementById("footerLogoText");
  const footerSub = document.getElementById("footerLogoSub");
  const footerIcon = document.getElementById("footerLogoIcon");
  const footerImg = document.getElementById("footerLogoImg");
  if (footerText) footerText.childNodes[0].textContent = word1 + " ";
  if (footerSub) footerSub.textContent = word2;

  // Show logo image if available
  if (logoUrl) {
    [navImg, footerImg].forEach(img => {
      if (img) { img.src = logoUrl; img.style.display = "block"; }
    });
    [navIcon, footerIcon].forEach(icon => {
      if (icon) icon.style.display = "none";
    });
  }

  // Footer about text
  const footerAbout = document.getElementById("footerAbout");
  if (footerAbout) footerAbout.textContent = `Building modern spaces with precision, trust, and a commitment to excellence — the ${name} standard.`;

  // Title + Copyright
  document.title = `${name} — Premium Construction`;
  const copyright = document.getElementById("footerCopyright");
  if (copyright) copyright.textContent = `© ${new Date().getFullYear()} ${name}. All Rights Reserved.`;
}

// ─── HERO ───
function updateHero(hero) {
  if (!hero) return;
  setText(document.getElementById("heroBadgeText"), hero.badge);
  if (hero.title) setHTML(document.getElementById("heroTitle"), hero.title);
  setText(document.getElementById("heroSub"), hero.description);
  const heroImg = document.getElementById("heroImg");
  if (heroImg && hero.imageUrl) heroImg.src = hero.imageUrl;
  setText(document.getElementById("heroCardNum"), hero.cardNum || "250+");
  setText(document.getElementById("heroCardLabel"), hero.cardLabel || "Projects Delivered");
}

// ─── STATS ───
function updateStats(stats) {
  if (!stats || !stats.length) return;
  const grid = document.getElementById("statsGrid");
  if (!grid) return;
  grid.innerHTML = stats.map(s => `
    <div class="stat-item reveal visible">
      <div class="stat-num" data-target="${s.number}">${s.number}</div>
      <div class="stat-plus">+</div>
      <div class="stat-label">${s.label}</div>
    </div>
  `).join("");
}

// ─── FEATURED PROJECTS (Home Page) ───
function updateFeaturedProjects(projects) {
  if (!projects || !projects.length) return;
  const grid = document.getElementById("featuredProjectsGrid");
  if (!grid) return;
  const featured = projects.slice(0, 3);
  grid.innerHTML = featured.map((p, i) => {
    let images = p.imageUrls || [];
    if (images.length === 0 && (p.imageUrl || p.img)) {
      images = [p.imageUrl || p.img];
    }
    const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
    const mainImg = images[0] || '';
    const safeTitle = (p.title || "").replace(/'/g, "\\'");
    
    return `
    <div class="project-card reveal visible" style="--delay:${i * 0.1}s; cursor:pointer;" onclick="if(window.openLightbox) openLightbox(${imagesJson}, 0, '${safeTitle}')">
      <div class="project-img-wrap">
        <img src="${mainImg}" alt="${p.title}" class="project-img" />
        <div class="project-overlay">
          <span class="project-cat">${p.cat || p.category || ''}</span>
          <h3 class="project-name">${p.title}</h3>
          <p class="project-loc">📍 ${p.loc || p.location || ''}</p>
        </div>
      </div>
    </div>
  `}).join("");
}

// ─── ALL PROJECTS (Projects Page Masonry) ───
function updateAllProjects(projects) {
  if (!projects || !projects.length) return;
  // Store globally for filter
  window._allProjects = projects;
  renderFilteredProjects("all");
}

function renderFilteredProjects(filter) {
  const masonry = document.getElementById("projectsMasonry");
  if (!masonry) return;
  const projects = window._allProjects || [];
  const filterLower = filter.toLowerCase();
  const filtered = filter === "all" ? projects : projects.filter(p => (p.cat || p.category || "").toLowerCase() === filterLower);
  
  masonry.innerHTML = filtered.map((p, i) => {
    let images = p.imageUrls || [];
    if (images.length === 0 && (p.imageUrl || p.img)) {
      images = [p.imageUrl || p.img];
    }
    const imagesJson = JSON.stringify(images).replace(/"/g, '&quot;');
    const mainImg = images[0] || '';
    const safeTitle = (p.title || "").replace(/'/g, "\\'");
    
    return `
    <div class="masonry-card reveal visible" style="--delay:${i * 0.08}s; cursor:pointer;" onclick="if(window.openLightbox) openLightbox(${imagesJson}, 0, '${safeTitle}')">
      <img src="${mainImg}" alt="${p.title}" loading="lazy" />
      <div class="masonry-info">
        <span class="masonry-cat">${p.cat || p.category || ''}</span>
        <h3 class="masonry-title">${p.title}</h3>
        <p class="masonry-meta">📍 ${p.loc || p.location || ''} &nbsp;·&nbsp; ${p.year || ''}</p>
      </div>
    </div>
  `}).join("");
}

// ─── WHY CHOOSE US ───
function updateWhyUs(items) {
  if (!items || !items.length) return;
  const grid = document.getElementById("whyGrid");
  if (!grid) return;
  grid.innerHTML = items.map((item, i) => `
    <div class="why-card glass-card reveal visible" style="--delay:${i * 0.1}s">
      <div class="why-icon">${item.icon || '◈'}</div>
      <h3 class="why-title">${item.title}</h3>
      <p class="why-desc">${item.description}</p>
    </div>
  `).join("");
}

// ─── PROCESS ───
function updateProcess(steps) {
  if (!steps || !steps.length) return;
  const timeline = document.getElementById("processTimeline");
  if (!timeline) return;
  timeline.innerHTML = steps.map((s, i) => `
    <div class="process-step reveal visible" style="--delay:${i * 0.15}s">
      <div class="step-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="step-line"></div>
      <div class="step-content">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </div>
    </div>
  `).join("");
}

// ─── ABOUT ───
function updateAbout(about) {
  if (!about) return;
  // Story texts
  const aboutTexts = document.querySelectorAll("#about .about-text");
  if (aboutTexts[0] && about.paragraph1) aboutTexts[0].textContent = about.paragraph1;
  if (aboutTexts[1] && about.paragraph2) aboutTexts[1].textContent = about.paragraph2;
  // Vision & Mission
  const visionBoxes = document.querySelectorAll("#about .vision-box");
  if (visionBoxes[0] && about.vision) { const p = visionBoxes[0].querySelector("p"); if (p) p.textContent = about.vision; }
  if (visionBoxes[1] && about.mission) { const p = visionBoxes[1].querySelector("p"); if (p) p.textContent = about.mission; }
  // Images
  const mainImg = document.querySelector("#about .about-img-main");
  const smallImg = document.querySelector("#about .about-img-small");
  if (mainImg && about.imageUrl) mainImg.src = about.imageUrl;
  if (smallImg && about.imageUrl2) smallImg.src = about.imageUrl2;
}

// ─── VALUES ───
function updateValues(values) {
  if (!values || !values.length) return;
  const grid = document.getElementById("valuesGrid");
  if (!grid) return;
  grid.innerHTML = values.map((v, i) => `
    <div class="value-card reveal visible" style="--delay:${i * 0.1}s">
      <div class="value-num">${String(i + 1).padStart(2, '0')}</div>
      <h3>${v.title}</h3>
      <p>${v.description}</p>
    </div>
  `).join("");
}

// ─── TEAM ───
function updateTeam(team) {
  if (!team || !team.length) return;
  const grid = document.getElementById("teamGrid");
  if (!grid) return;
  grid.innerHTML = team.map((t, i) => {
    const initials = (t.name || "").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    return `
    <div class="team-card glass-card reveal visible" style="--delay:${i * 0.1}s">
      <div class="team-img-wrap">
        ${t.imageUrl ? `<img src="${t.imageUrl}" style="width:90px;height:90px;border-radius:50%;object-fit:cover;" />` : `<div class="team-img-placeholder">${initials}</div>`}
      </div>
      <h3 class="team-name">${t.name}</h3>
      <p class="team-role">${t.role}</p>
      <p class="team-bio">${t.bio || t.description || ''}</p>
      <div class="team-socials">
        ${t.linkedin ? `<a href="${t.linkedin}" class="team-social" target="_blank">in</a>` : ''}
        ${t.twitter ? `<a href="${t.twitter}" class="team-social" target="_blank">tw</a>` : ''}
      </div>
    </div>`;
  }).join("");
}

// ─── SERVICES ───
function updateServices(services) {
  if (!services || !services.list || !services.list.length) return;
  const grid = document.getElementById("servicesGrid");
  if (grid) {
    grid.innerHTML = services.list.map((s, i) => `
      <div class="service-card glass-card reveal visible" style="--delay:${i * 0.1}s">
        <div class="service-icon">${s.icon || '⬡'}</div>
        <h3 class="service-title">${s.title}</h3>
        <p class="service-desc">${s.description}</p>
        <a href="#contact" class="service-link page-link" data-page="contact">Enquire →</a>
      </div>
    `).join("");
  }

  const footerList = document.getElementById("footerServicesList");
  if (footerList) {
    footerList.innerHTML = services.list.slice(0, 5).map(s => `
      <li><a href="#services" class="page-link" data-page="services">${s.title}</a></li>
    `).join("");
  }
}

// ─── CONTACT INFO ───
function updateContact(contact) {
  if (!contact) return;
  const info = document.getElementById("contactInfo");
  if (!info) return;
  info.innerHTML = `
    <h3 class="contact-info-title">Contact Details</h3>
    <div class="contact-detail">
      <div class="contact-icon">📍</div>
      <div>
        <div class="contact-label">Address</div>
        <div class="contact-val">${contact.address || 'Plot No. 42, Industrial Area, Sangli'}</div>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-icon">📞</div>
      <div>
        <div class="contact-label">Phone</div>
        <div class="contact-val">${contact.phone || '+91 9876 543 210'}</div>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-icon">✉</div>
      <div>
        <div class="contact-label">Email</div>
        <div class="contact-val">${contact.email || 'info@vastutejinfratech.com'}</div>
      </div>
    </div>
    <div class="contact-detail">
      <div class="contact-icon">🕐</div>
      <div>
        <div class="contact-label">Working Hours</div>
        <div class="contact-val">${contact.hours || 'Mon – Sat: 9:00 AM – 6:00 PM'}</div>
      </div>
    </div>
    <div class="contact-socials">
      ${contact.linkedin ? `<a href="${contact.linkedin}" class="c-social" target="_blank">LinkedIn</a>` : '<a href="#" class="c-social">LinkedIn</a>'}
      ${contact.instagram ? `<a href="${contact.instagram}" class="c-social" target="_blank">Instagram</a>` : '<a href="#" class="c-social">Instagram</a>'}
      ${contact.twitter ? `<a href="${contact.twitter}" class="c-social" target="_blank">Twitter</a>` : '<a href="#" class="c-social">Twitter</a>'}
    </div>
  `;

  // Footer contact
  const footerContact = document.getElementById("footerContact");
  if (footerContact) {
    footerContact.innerHTML = `
      <li>${contact.address || 'Sangli – 416416'}</li>
      <li>${contact.phone || '+91 9876 543 210'}</li>
      <li>${contact.email || 'info@vastutejinfratech.com'}</li>
    `;
  }
}

// ─── TESTIMONIALS (from Reviews) ───
function updateTestimonials(reviews) {
  const track = document.getElementById("testimonialsTrack");
  if (!track || !reviews || !reviews.length) return;

  track.innerHTML = reviews.map(r => {
    const initial = r.name ? r.name.charAt(0).toUpperCase() : "U";
    // Show stars based on rating
    const rating = r.rating || 5;
    const stars = "⭐".repeat(rating);
    
    return `
    <div class="glass-card reveal visible" style="display:flex; flex-direction:column; padding:2rem; min-height: 200px; width: 100%; max-width: 350px;">
      <div style="font-size:18px; margin-bottom:15px; color: var(--gold); letter-spacing: 2px;">${stars}</div>
      <p class="testi-text" style="flex:1; font-size:1.1rem; line-height:1.6; margin-bottom: 20px;">"${r.text}"</p>
      <div class="testi-author" style="display: flex; align-items: center; gap: 15px;">
        <div class="testi-avatar" style="width:45px; height:45px; display:flex; align-items:center; justify-content:center; background:var(--gold); color:var(--bg-primary); border-radius:50%; font-weight:700; font-size:1.2rem;">${initial}</div>
        <div>
          <div class="testi-name" style="font-weight:600; font-size:1.1rem;">${r.name}</div>
          <div class="testi-role" style="font-size:0.85rem; color:var(--text-muted);">${r.role || 'Client'}</div>
        </div>
      </div>
    </div>`;
  }).join("");
}

// ─── MAIN RENDER ───
function renderContent(data) {
  if (!data) return;
  if (data.brandName || data.brandLogo) updateBrand(data.brandName || "VASTUTEJ Infratech", data.brandLogo);
  if (data.hero) updateHero(data.hero);
  if (data.stats) updateStats(data.stats);
  if (data.portfolio?.projects) {
    updateFeaturedProjects(data.portfolio.projects);
    updateAllProjects(data.portfolio.projects);
  }
  if (data.whyUs) updateWhyUs(data.whyUs);
  if (data.process) updateProcess(data.process);
  if (data.about) updateAbout(data.about);
  if (data.values) updateValues(data.values);
  if (data.team) updateTeam(data.team);
  if (data.services) updateServices(data.services);
  if (data.contact) updateContact(data.contact);

  // Re-attach filter buttons for projects page
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderFilteredProjects(btn.dataset.filter);
    });
  });
}

// ─── LOAD FROM CACHE FIRST ───
const cached = localStorage.getItem("vastu_cms_cache");
if (cached) {
  try { renderContent(JSON.parse(cached)); } catch (e) { }
}

// ─── LIVE FIREBASE SYNC ───
onSnapshot(doc(db, "website_content", "main"), (snap) => {
  if (!snap.exists()) return;
  const data = snap.data();
  localStorage.setItem("vastu_cms_cache", JSON.stringify(data));
  renderContent(data);
});

// ─── LOAD APPROVED REVIEWS AS TESTIMONIALS ───
const reviewsQuery = query(collection(db, "reviews"), where("status", "==", "approved"));
onSnapshot(reviewsQuery, (snap) => {
  if (snap.empty) return;
  const reviews = [];
  snap.forEach(d => reviews.push(d.data()));
  reviews.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  updateTestimonials(reviews.slice(0, 5));
});

// ─── CONTACT FORM SUBMISSION ───
const consultationForm = document.getElementById("consultationForm");
if (consultationForm) {
  consultationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = consultationForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Submitting...";
    btn.disabled = true;

    try {
      await addDoc(collection(db, "consultations"), {
        name: document.getElementById("contactName")?.value || "",
        email: document.getElementById("contactEmail")?.value || "",
        phone: document.getElementById("contactPhone")?.value || "",
        service: document.getElementById("contactService")?.value || "",
        message: document.getElementById("contactMessage")?.value || "",
        status: "new",
        timestamp: Date.now()
      });
      btn.textContent = "Message Sent Successfully!";
      btn.style.background = "linear-gradient(135deg, #4a7c59, #2d5a40)";
      consultationForm.reset();
    } catch (err) {
      console.error(err);
      btn.textContent = "Failed. Try again.";
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
      btn.disabled = false;
    }, 3500);
  });
}

// ─── REVIEW FORM SUBMISSION ───
const openReviewBtn = document.getElementById("openReviewBtn");
const reviewFormContainer = document.getElementById("reviewFormContainer");
if (openReviewBtn && reviewFormContainer) {
  openReviewBtn.addEventListener("click", () => {
    reviewFormContainer.style.display = reviewFormContainer.style.display === "none" ? "block" : "none";
    if (reviewFormContainer.style.display === "block") {
      reviewFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

const reviewForm = document.getElementById("reviewForm");
if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = reviewForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Submitting Review...";
    btn.disabled = true;

    try {
      await addDoc(collection(db, "reviews"), {
        name: document.getElementById("revName")?.value || "",
        role: document.getElementById("revRole")?.value || "",
        rating: parseInt(document.getElementById("revRating")?.value || "5"),
        text: document.getElementById("revText")?.value || "",
        status: "pending",
        timestamp: Date.now()
      });
      btn.textContent = "Review Submitted for Approval!";
      btn.style.background = "linear-gradient(135deg, #4a7c59, #2d5a40)";
      reviewForm.reset();
      setTimeout(() => {
        reviewFormContainer.style.display = "none";
      }, 3500);
    } catch (err) {
      console.error(err);
      btn.textContent = "Failed. Try again.";
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = "";
      btn.disabled = false;
    }, 3500);
  });
}
