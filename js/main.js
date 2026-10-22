/**
 * PORTFOLIO INTERACTIVE CORE JAVASCRIPT
 * Particles Canvas, Dynamic Typing, Project Filters, Modals, Sound Effects, and Audio
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initTypingEffect();
  initNavbarScroll();
  initMobileNav();
  initThemeSwitcher();
  initAudioSystem();
  initSkillTabs();
  initProjectFilters();
  initStatsCounter();
  initModalSystem();
  initContactForm();
  initClipboard();
  initAOSLikeScroll();
  initLightboxSystem();
  initCertificateControls();
});

/* ===================================================================
   1. PARTICLES CONSTELLATION CANVAS
   =================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.65)' : 'rgba(6, 182, 212, 0.65)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = 1 - dist / 110;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha * 0.22})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. DYNAMIC TYPING EFFECT
   =================================================================== */
function initTypingEffect() {
  const typedEl = document.querySelector('.typed-text');
  if (!typedEl) return;

  const roles = [
    "Web Developer",
    "Data Entry"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 90;
  const deleteSpeed = 45;
  const pauseTime = 1800;

  function type() {
    const currentWord = roles[roleIdx];

    if (!isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentWord.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
        return;
      }
      setTimeout(type, typeSpeed);
    } else {
      typedEl.textContent = currentWord.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, 350);
        return;
      }
      setTimeout(type, deleteSpeed);
    }
  }

  setTimeout(type, 600);
}

/* ===================================================================
   3. NAVBAR SCROLL & ACTIVE LINK SPY
   =================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   4. MOBILE NAVIGATION DRAWER
   =================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('menuToggle') || document.querySelector('.menu-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-drawer');

  if (!toggleBtn || !mobileDrawer) return;

  const drawerLinks = mobileDrawer.querySelectorAll('a');

  function closeMenu() {
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileDrawer.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer.classList.contains('open')) {
      if (!toggleBtn.contains(e.target) && !mobileDrawer.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close when resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && mobileDrawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ===================================================================
   5. THEME PALETTE CUSTOMIZER (1-CLICK QUICK CYCLE)
   =================================================================== */
function initThemeSwitcher() {
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['violet', 'cyan', 'emerald', 'amber'];
  const themeNames = {
    violet: 'Cyber Violet 🟣',
    cyan: 'Neon Cyan 🔵',
    emerald: 'Matrix Emerald 🟢',
    amber: 'Sunset Amber 🟠'
  };

  // Load saved theme or default to violet
  let currentTheme = localStorage.getItem('porto_theme') || 'violet';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentIndex = themes.indexOf(currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      currentTheme = themes[nextIndex];

      document.documentElement.setAttribute('data-theme', currentTheme);
      localStorage.setItem('porto_theme', currentTheme);

      playSynthSound('switch');
      showToast(`Tema Warna: ${themeNames[currentTheme]}`);
    });
  }
}

/* ===================================================================
   6. SYNTHESIZED WEB AUDIO SYSTEM
   =================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSystem() {
  const soundToggleBtn = document.getElementById('soundToggle');
  if (!soundToggleBtn) return;

  soundToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      soundToggleBtn.style.color = 'var(--accent-secondary)';
      playSynthSound('success');
      showToast('Sound Effects Enabled 🔊');
    } else {
      soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      soundToggleBtn.style.color = 'var(--text-muted)';
      showToast('Sound Effects Muted 🔇');
    }
  });

  // Attach click sound to interactive buttons
  document.querySelectorAll('.btn, .nav-link, .filter-btn, .skill-tab-btn').forEach((el) => {
    el.addEventListener('click', () => {
      playSynthSound('click');
    });
  });
}

function playSynthSound(type) {
  if (!soundEnabled || !audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.start(now);
    osc.stop(now + 0.06);
  } else if (type === 'success') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.start(now);
    osc.stop(now + 0.25);
  } else if (type === 'switch') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.1);
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

/* ===================================================================
   7. SKILL TABS & ANIMATED PROFICIENCY BARS
   =================================================================== */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'block';
          // Re-trigger fill animation
          const bar = card.querySelector('.skill-bar-fill');
          if (bar) {
            const width = bar.getAttribute('data-fill');
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = width;
            }, 60);
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Animate skill bars on initial load
  setTimeout(() => {
    document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
      const width = bar.getAttribute('data-fill');
      if (width) bar.style.width = width;
    });
  }, 400);
}

/* ===================================================================
   8. PROJECT FILTERS
   =================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   9. STATS COUNTER ANIMATION
   =================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let started = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          started = true;
          statNumbers.forEach((counter) => {
            const target = +counter.getAttribute('data-target');
            const duration = 1800; // ms
            const stepTime = 25;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.innerText = target;
                clearInterval(timer);
              } else {
                counter.innerText = Math.ceil(current);
              }
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const statsSection = document.querySelector('.stats-grid, .bento-stats-grid');
  if (statsSection) observer.observe(statsSection);
}

/* ===================================================================
   10. MODAL SYSTEM (Projects & Certificates)
   =================================================================== */
/* ===================================================================
   10. MODAL & GALLERY DATA (Real Projects & Certificates)
   =================================================================== */
const projectGalleries = {
  pos_coffee: [
    { src: "assets/images/oncoffee.png", caption: "Point of Sale On Coffee Space - Dashboard Kasir & Manajemen Stok" }
  ],
  dapur_pintar: [
    { src: "assets/images/dapurpintar.png", caption: "Aplikasi Dapur Pintar - Tampilan Menu & Resep Masakan" },
    { src: "assets/images/dapur/home.jpg", caption: "Dapur Pintar - Halaman Beranda & Eksplorasi Resep" },
    { src: "assets/images/dapur/resep.jpg", caption: "Dapur Pintar - Katalog & Pencarian Resep Masakan" },
    { src: "assets/images/dapur/detail.jpg", caption: "Dapur Pintar - Detail Bahan & Langkah Memasak" },
    { src: "assets/images/dapur/regis.jpg", caption: "Dapur Pintar - Form Pendaftaran & Autentikasi Pengguna" }
  ],
  goa_lawah: [
    { src: "assets/images/goalawah.png", caption: "Website Pemesanan Tiket Goa Lawah - Halaman Utama" },
    { src: "assets/images/goa/daftar.png", caption: "Goa Lawah - Halaman Registrasi Pengguna" },
    { src: "assets/images/goa/masuk.png", caption: "Goa Lawah - Halaman Login Pengguna" },
    { src: "assets/images/goa/about.png", caption: "Goa Lawah - Informasi Destinasi & Edukasi Wisata" },
    { src: "assets/images/goa/maps.png", caption: "Goa Lawah - Peta Lokasi & Panduan Rute" },
    { src: "assets/images/goa/pembelian.png", caption: "Goa Lawah - Form Pemesanan & Pemilihan Tiket" },
    { src: "assets/images/goa/konfirm.png", caption: "Goa Lawah - Konfirmasi & Bukti Pembayaran" },
    { src: "assets/images/goa/detail.png", caption: "Goa Lawah - Detail Rincian Pesanan Tiket" },
    { src: "assets/images/goa/history.png", caption: "Goa Lawah - Riwayat Transaksi & Status Tiket" }
  ],
  photobooth: [
    { src: "assets/images/photobooth.png", caption: "Web Photobooth - Antarmuka Kamera & Frame Foto Interaktif" }
  ],

};

const projectData = {
  pos_coffee: {
    title: "Point Of Sale On Coffee Space",
    category: "Full-Stack Web App",
    period: "2024",
    desc: "Sistem Point of Sale (POS) On Coffee Space ini dikembangkan menggunakan PHP dan MySQL untuk mengoptimalkan transaksi kasir serta manajemen stok secara real-time. Platform berbasis web ini sudah terintegrasi dengan payment gateway untuk mendukung pembayaran non-tunai, sekaligus menyajikan laporan penjualan harian secara otomatis dan akurat.",

    features: [
      "Manajemen transaksi kasir cepat dan responsif",
      "Pencatatan dan pemantauan stok bahan baku secara real-time",
      "Integrasi payment gateway untuk pembayaran digital non-tunai",
      "Laporan rekap penjualan harian dan bulanan otomatis"
    ],
    galleryKey: "pos_coffee"
  },
  dapur_pintar: {
    title: "Aplikasi Dapur Pintar (Resep Masakan)",
    category: "Mobile Application",
    period: "Nov 2024 - Des 2024",
    desc: "Aplikasi Dapur Pintar ini dikembangkan sebagai tugas akhir. Platform ini dirancang untuk memudahkan pencarian resep masakan, menggunakan Flutter sebagai framework untuk membangun antarmuka yang responsif dan menarik. Aplikasi terintegrasi dengan API backend RESTful yang mengelola data resep secara dinamis, mencakup fitur penambahan, pengeditan, dan penghapusan resep, dengan fokus utama pada peningkatan pengalaman pengguna.",

    features: [
      "Pencarian resep masakan cepat berdasarkan nama atau kategori",
      "Integrasi RESTful API backend dinamis (CRUD resep)",
      "Antarmuka responsif dan menarik di berbagai layar smartphone"

    ],
    apkLink: "https://www.mediafire.com/file/jjhk6xk58b6rfas/dapur_pintar.apk/file",
    galleryKey: "dapur_pintar"
  },
  goa_lawah: {
    title: "Website Pemesanan Tiket Goa Lawah",
    category: "Full-Stack Web & Research",
    period: "Jun 2024 - Jul 2024",
    desc: "Website Pemesanan Tiket Goa Lawah ini dikembangkan sebagai bagian dari penyelesaian tugas penelitian. Proyek ini dibuat menggunakan PHP native dengan basis data MySQL, serta didukung HTML, CSS, dan JavaScript untuk menghadirkan pengalaman pengguna yang interaktif dan responsif dalam reservasi tiket wisata.",

    features: [
      "Pemesanan tiket online terstruktur dengan pemilihan tanggal & kuota",
      "Alur konfirmasi pembayaran dan verifikasi bukti transaksi",
      "Peta lokasi interaktif dan informasi lengkap seputar destinasi",
      "Riwayat transaksi dan cetak bukti tiket digital untuk pengunjung"
    ],
    galleryKey: "goa_lawah"
  },
  photobooth: {
    title: "Web Photobooth Interactive",
    category: "Frontend Web App",
    period: "Maret 2025",
    desc: "Website Photobooth ini dikembangkan menggunakan HTML, CSS, dan JavaScript. Antarmuka yang simpel membuatnya mudah digunakan oleh siapa saja untuk mengambil foto dan mengabadikan momen langsung melalui peramban web tanpa memerlukan instalasi aplikasi tambahan.",

    features: [
      "Akses kamera web instan melalui peramban (WebRTC MediaStream)",
      "Pilihan frame foto kreatif dan modern",
      "Fitur countdown otomatis untuk kenyamanan berpose",
      "Unduh foto hasil jepretan secara langsung dengan kualitas tinggi"
    ],
    demoLink: "https://hycen-photobooth.netlify.app/",
    galleryKey: "photobooth"
  },

};

const certData = {
  c_idcamp: {
    title: "Certificate AI Front-End Developer",
    issuer: "IDCamp Indosat Ooredoo Hutchison",
    date: "Maret 2026",
    credId: "IDCAMP2025/L2-FE-095",
    desc: "Sertifikasi resmi pengembangan antarmuka web modern dengan integrasi Artificial Intelligence (AI) dari IDCamp Indosat Ooredoo Hutchison.",
    skills: ["AI Integration", "Front-End Development", "JavaScript ES6+", "Responsive Web"],
    verifyUrl: "https://drive.google.com/file/d/12dvehNpL7hju3mywOazVI7MU2ynTKKBj/view?usp=drive_link",
    img: "assets/images/certificates/Sertifikat IDCamp 2025 (Husen Algifari).png"
  },
  c_funda: {
    title: "Certificate Fundamental Front-End Web Development",
    issuer: "Dicoding Indonesia",
    date: "Februari 2026",
    credId: "2VX301W1JXYQ",
    desc: "Kompetensi mendalam seputar Web Components, Custom Elements, Shadow DOM, ES6 Modules, Fetch API, dan Webpack tooling berstandar industri.",
    skills: ["Web Components", "ES6 Modules", "Fetch API", "Webpack", "Clean Code"],
    verifyUrl: "https://www.dicoding.com/certificates/2VX301W1JXYQ",
    img: "assets/images/certificates/funda.jpg"
  },
  c_webdev: {
    title: "Certificate Web Development",
    issuer: "Sololearn",
    date: "September 2024",
    credId: "CC-HKIEQ4KE",
    desc: "Sertifikasi pemahaman komprehensif tentang struktur HTML, styling modern CSS, dan logika interaktif JavaScript.",
    skills: ["HTML5", "CSS3", "JavaScript", "DOM Manipulation"],
    verifyUrl: "https://www.sololearn.com/en/certificates/CC-HKIEQ4KE",
    img: "assets/images/certificates/Web Development Certificate.jpg"
  },
  c_excel: {
    title: "Memahami Penggunaan Microsoft Excel Untuk Mengelola Pendataan",
    issuer: "Future Skills Indonesia",
    date: "Agustus 2025",
    credId: "088168/098/FCC/25ID",
    desc: "Sertifikasi pengelolaan data profesional, fungsi formula statistik, visualisasi grafik, validasi data, dan efisiensi olah data.",
    skills: ["Microsoft Excel", "Data Entry", "Spreadsheet Management", "VLOOKUP/XLOOKUP", "Pivot Table"],
    verifyUrl: "https://futureskills.id/fs/sertifikat/verifikasi/eyJpdiI6IkMvVTRQVDEzQ2NweG12R3hIVmdNeEE9PSIsInZhbHVlIjoiWDVST0wxMUNSU2RabllUcElpREdrZz09IiwibWFjIjoiOTU2MzkzZTI5YjZlZjJjNTI2NWQ0Yjk1YTcyMjEyMjU5ZWM4NmI1NGI5NDY2MTllYzY0N2JjMjQ3ZTVlNWEyZCIsInRhZyI6IiJ9",
    img: "assets/images/certificates/serti_excel.jpg"
  },
  c_dibimbing: {
    title: "Certificate Frontend Developer",
    issuer: "dibimbing.id",
    date: "September 2024",
    credId: "Digital Skill Fair",
    desc: "Pelatihan intensif pengembangan frontend modern, struktur aplikasi web, dan styling responsif.",
    skills: ["Frontend Web", "UI Design", "HTML/CSS", "JavaScript Basics"],
    verifyUrl: "https://dibimbing-lms-dev.s3.ap-southeast-1.amazonaws.com/production/digital-skill-fair/2e377d95-398e-4b90-a07d-80d9b3fec4b7.pdf",
    img: "assets/images/certificates/Certificate Front End Developer.jpg"
  },
  c_js: {
    title: "Belajar Dasar Pemrograman JavaScript",
    issuer: "Dicoding Indonesia",
    date: "September 2024",
    credId: "JMZV42EEJXN9",
    desc: "Penguasaan dasar bahasa pemrograman JavaScript, konsep OOP, functional programming, asynchronous, dan modularisasi kode.",
    skills: ["JavaScript ES6", "OOP", "Asynchronous JS", "Error Handling"],
    verifyUrl: "https://www.dicoding.com/certificates/JMZV42EEJXN9",
    img: "assets/images/certificates/sadar js.png"
  },
  c_cloud: {
    title: "Belajar Dasar-Dasar Komputasi Awan (Cloud)",
    issuer: "Future Skills Indonesia",
    date: "Agustus 2025",
    credId: "088168/098/FCC/25",
    desc: "Pemahaman fundamental infrastruktur cloud, model deployment IaaS/PaaS/SaaS, dan arsitektur komputasi awan modern.",
    skills: ["Cloud Concepts", "IaaS/PaaS/SaaS", "Scalability", "Cloud Storage"],
    verifyUrl: "https://futureskills.id/fs/sertifikat/verifikasi/eyJpdiI6Ijh5VUNnL3dHV1NnekE0K1paT3NCTUE9PSIsInZhbHVlIjoicXVXYThGZEtxQzc5enYyTUpPR2ZIQT09IiwibWFjIjoiMWJmOGIxZjg4ZGFiMTdmMDdjMGQ0NTE4MDk5MGZiM2FiYmE4YzEwODY5YzkxZmRlZGU2NDU2MDI3MzdjNTZhYSIsInRhZyI6IiJ9",
    img: "assets/images/certificates/excel.jpg"
  },
  c_coding_found: {
    title: "Certificate Coding Foundations",
    issuer: "Sololearn",
    date: "September 2024",
    credId: "CC-JIKSIBNQ",
    desc: "Fondasi logika pemrograman, algoritma dasar, struktur data, dan pemecahan masalah komputasional.",
    skills: ["Programming Logic", "Algorithm Basics", "Control Flow"],
    verifyUrl: "https://www.sololearn.com/certificates/CC-JIKSIBNQ",
    img: "assets/images/certificates/Coding Foundations Certificate.jpg"
  },
  c_dasar_web: {
    title: "Belajar Dasar Pemrograman Web",
    issuer: "Dicoding Indonesia",
    date: "September 2024",
    credId: "GRX54KLMRP0M",
    desc: "Pondasi utama pembuatan website menggunakan HTML semantik, styling CSS3, tata letak Flexbox, dan prinsip aksesibilitas web.",
    skills: ["HTML Semantik", "CSS Layouting", "Flexbox", "Responsive Design"],
    verifyUrl: "https://www.dicoding.com/certificates/GRX54KLMRP0M",
    img: "assets/images/certificates/dasar web.png"
  },
  c_fe_pemula: {
    title: "Belajar Membuat Front-End Web untuk Pemula",
    issuer: "Dicoding Indonesia",
    date: "November 2024",
    credId: "1RXY2JRE1XVM",
    desc: "Pembuatan aplikasi web interaktif, manipulasi DOM dinamis, penanganan Event Listener, dan penyimpanan Web Storage (localStorage).",
    skills: ["DOM Manipulation", "Event Handling", "Web Storage API", "Interactive UI"],
    verifyUrl: "https://www.dicoding.com/certificates/1RXY2JRE1XVM",
    img: "assets/images/certificates/front newbe.png"
  },
  c_ai: {
    title: "Belajar Dasar AI (Artificial Intelligence)",
    issuer: "Dicoding Indonesia",
    date: "November 2024",
    credId: "2VX34E71JZYQ",
    desc: "Pengenalan kecerdasan buatan, Machine Learning, Deep Learning, Generative AI, dan implementasinya di dunia teknologi.",
    skills: ["Artificial Intelligence", "Machine Learning Concepts", "Prompt Engineering"],
    verifyUrl: "https://www.dicoding.com/certificates/2VX34E71JZYQ",
    img: "assets/images/certificates/ai.png"
  },
  c_sql: {
    title: "Belajar Dasar Structured Query Language (SQL)",
    issuer: "Dicoding Indonesia",
    date: "Februari 2025",
    credId: "GRX53O1LVZ0M",
    desc: "Pengelolaan database relasional menggunakan query SQL, DDL, DML, agregasi, subquery, dan relasi tabel (JOIN).",
    skills: ["SQL", "Relational Database", "JOIN & Subquery", "Database Design"],
    verifyUrl: "https://www.dicoding.com/certificates/GRX53O1LVZ0M",
    img: "assets/images/certificates/sql.png"
  },
  c_python: {
    title: "Memulai Pemrograman dengan Python",
    issuer: "Dicoding Indonesia",
    date: "Desember 2024",
    credId: "KEXLYKY2RZG2",
    desc: "Dasar bahasa pemrograman Python, tipe data, manipulasi list/string, fungsi, OOP, dan penggunaan pustaka standar.",
    skills: ["Python", "Control Flow", "Object-Oriented Programming", "Data Structures"],
    verifyUrl: "https://www.dicoding.com/certificates/KEXLYKY2RZG2",
    img: "assets/images/certificates/python.png"
  },
  c_visualisasi: {
    title: "Belajar Dasar Visualisasi Data",
    issuer: "Dicoding Indonesia",
    date: "Desember 2024",
    credId: "L4PQ505YVZO1",
    desc: "Prinsip visualisasi data yang efektif, pemilihan jenis chart, data storytelling, dan presentasi data kepada stakeholder.",
    skills: ["Data Visualization", "Chart Design", "Data Storytelling"],
    verifyUrl: "https://www.dicoding.com/certificates/L4PQ505YVZO1",
    img: "assets/images/certificates/visualisasi data.png"
  },
  c_datascience: {
    title: "Belajar Dasar Data Science",
    issuer: "Dicoding Indonesia",
    date: "Februari 2025",
    credId: "JMZVEDK9NPN9",
    desc: "Alur kerja Data Science, eksplorasi data (EDA), data cleaning, pemodelan statistik, dan interpretasi insight.",
    skills: ["Data Science Lifecycle", "Exploratory Data Analysis", "Data Cleaning"],
    verifyUrl: "https://www.dicoding.com/certificates/JMZVEDK9NPN9",
    img: "assets/images/certificates/sciense.png"
  },
  c_marketing: {
    title: "Fundamentals Of Digital Marketing",
    issuer: "Google Digital Garage",
    date: "September 2024",
    credId: "B5aYPR6R9vHRGcxXR1GSJvJW",
    desc: "Strategi pemasaran digital tersertifikasi dari Google: SEO, SEM, content strategy, social media marketing, dan web analytics.",
    skills: ["Digital Marketing", "SEO & SEM", "Web Analytics", "Social Media"],
    verifyUrl: "https://skillshop.exceedlms.com/student/award/B5aYPR6R9vHRGcxXR1GSJvJW",
    img: "assets/images/certificates/certificate fundamental digital marketing.jpg"
  }
};

function initModalSystem() {
  const modalBackdrop = document.getElementById('globalModal');
  const modalContainer = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modalBackdrop || !modalContainer) return;

  function closeModal() {
    modalBackdrop.classList.remove('active');
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (modalBackdrop.classList.contains('active') || modalBackdrop.classList.contains('open'))) {
      closeModal();
    }
  });

  // Attach triggers to project detail buttons
  document.querySelectorAll('[data-project-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project-id');
      const item = projectData[pId];
      if (!item) return;

      const hasGallery = item.galleryKey && projectGalleries[item.galleryKey];

      modalContainer.innerHTML = `
        <div style="margin-bottom: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
            <span class="section-tag" style="font-size: 0.72rem; margin-bottom: 0;">${item.category}</span>
            <span style="font-family: var(--font-code); font-size: 0.78rem; color: var(--accent-secondary);">${item.period}</span>
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.55rem; font-weight: 800; color: #fff; margin-top: 0.6rem; line-height: 1.3;">
            ${item.title}
          </h2>
        </div>

        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; margin-bottom: 1.25rem;">
          ${item.desc}
        </p>

        <div style="margin-bottom: 1.25rem;">
          <h4 style="font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--accent-secondary); margin-bottom: 0.6rem;">
            Fitur & Keunggulan:
          </h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.45rem;">
            ${item.features
          .map(
            (f) => `
              <li style="display: flex; align-items: flex-start; gap: 0.5rem; color: #cbd5e1; font-size: 0.88rem;">
                <span style="color: var(--accent-emerald); font-weight: bold;">✔</span>
                <span>${f}</span>
              </li>`
          )
          .join('')}
          </ul>
        </div>

        

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          ${hasGallery ? `
            <button class="btn btn-primary" onclick="openLightboxFromProject('${item.galleryKey}')" style="flex: 1; min-width: 140px;">
              <i class="fas fa-images"></i> Buka Galeri Layar
            </button>
          ` : ''}
          ${item.demoLink ? `
            <a href="${item.demoLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1; min-width: 140px;">
              <i class="fas fa-external-link-alt"></i> Buka Live Demo
            </a>
          ` : ''}
          
        </div>
      `;

      modalBackdrop.classList.add('active');
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSynthSound('switch');
    });
  });

  // Attach triggers to certificate modal detail
  document.querySelectorAll('[data-cert-id]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cId = btn.getAttribute('data-cert-id');
      const item = certData[cId];
      if (!item) return;

      modalContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: var(--accent-emerald); flex-shrink: 0;">
            <i class="fas fa-award"></i>
          </div>
          <div>
            <div class="cert-verified-pill" style="margin-bottom: 0.25rem;">
              <i class="fas fa-check-circle"></i> Terverifikasi Resmi
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: #fff; line-height: 1.3;">
              ${item.title}
            </h3>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); padding: 1rem 1.2rem; border-radius: 12px; margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.88rem;">
          <div><strong style="color: var(--accent-secondary);">Penerbit:</strong> <span style="color: #fff;">${item.issuer}</span></div>
          <div><strong style="color: var(--accent-secondary);">Tanggal Terbit:</strong> <span style="color: #fff;">${item.date}</span></div>
          <div><strong style="color: var(--accent-secondary);">ID Kredensial:</strong> <code style="color: var(--accent-emerald); font-family: var(--font-code);">${item.credId || 'Tersertifikasi'}</code></div>
        </div>

        <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.25rem;">
          ${item.desc}
        </p>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); margin-bottom: 0.5rem;">
            Kompetensi yang Teruji:
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${item.skills
          .map(
            (s) => `
              <span class="tech-tag" style="background: rgba(6, 182, 212, 0.1); border-color: rgba(6, 182, 212, 0.25); color: #fff;">
                ${s}
              </span>`
          )
          .join('')}
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
          <button class="btn btn-secondary" onclick="openLightbox([{src: '${item.img}', caption: '${item.title}'}], 0)" style="flex: 1; min-width: 140px;">
            <i class="fas fa-search-plus"></i> Lihat Gambar Sertifikat
          </button>
          <a href="${item.verifyUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex: 1; min-width: 140px;">
            <i class="fas fa-external-link-alt"></i> Verifikasi Online
          </a>
        </div>
      `;

      modalBackdrop.classList.add('active');
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      playSynthSound('switch');
    });
  });
}

/* ===================================================================
   LIGHTBOX SYSTEM (High-Res Images & Gallery Slides)
   =================================================================== */
let lightboxItems = [];
let lightboxCurrentIdx = 0;

function openLightbox(items, startIndex = 0) {
  if (!items || !items.length) return;
  lightboxItems = items;
  lightboxCurrentIdx = Math.max(0, Math.min(startIndex, items.length - 1));

  let modal = document.getElementById('imageLightbox');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'imageLightbox';
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
      <div class="lightbox-container" onclick="event.stopPropagation()">
        <button class="lightbox-close-btn" id="lightboxCloseBtn" title="Tutup (Esc)">
          <i class="fas fa-times"></i>
        </button>
        <button class="lightbox-nav-btn prev" id="lightboxPrevBtn" title="Sebelumnya (Panah Kiri)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <div class="lightbox-img-wrap">
          <img id="lightboxImg" class="lightbox-img" src="" alt="Preview">
        </div>
        <button class="lightbox-nav-btn next" id="lightboxNextBtn" title="Berikutnya (Panah Kanan)">
          <i class="fas fa-chevron-right"></i>
        </button>
        <div class="lightbox-bar">
          <div class="lightbox-caption" id="lightboxCaption"></div>
          <div class="lightbox-counter" id="lightboxCounter">1 / 1</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', closeLightbox);
    document.getElementById('lightboxCloseBtn').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrevBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
    document.getElementById('lightboxNextBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  updateLightboxContent();
  modal.classList.add('active');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  playSynthSound('switch');
}

function updateLightboxContent() {
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const counterEl = document.getElementById('lightboxCounter');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');

  const currentItem = lightboxItems[lightboxCurrentIdx];
  const src = typeof currentItem === 'string' ? currentItem : currentItem.src;
  const caption = typeof currentItem === 'string' ? '' : (currentItem.caption || '');

  imgEl.src = src;
  imgEl.alt = caption || 'Galeri Gambar';
  captionEl.textContent = caption;
  counterEl.textContent = `${lightboxCurrentIdx + 1} / ${lightboxItems.length}`;

  if (lightboxItems.length <= 1) {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    counterEl.style.display = 'none';
  } else {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
    counterEl.style.display = 'block';
  }
}

function navigateLightbox(dir) {
  if (lightboxItems.length <= 1) return;
  lightboxCurrentIdx = (lightboxCurrentIdx + dir + lightboxItems.length) % lightboxItems.length;
  updateLightboxContent();
  playSynthSound('click');
}

function closeLightbox() {
  const modal = document.getElementById('imageLightbox');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
}

window.openLightbox = openLightbox;
window.openLightboxFromProject = function (projectKey) {
  const items = projectGalleries[projectKey];
  if (items) {
    openLightbox(items, 0);
  }
};

function initLightboxSystem() {
  // Attach lightbox to all certificate images and previews
  document.querySelectorAll('.cert-img-wrapper, .cert-preview-trigger').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const card = el.closest('.cert-card');
      if (!card) return;
      const img = card.querySelector('.cert-image');
      const title = card.querySelector('.cert-title')?.innerText || 'Sertifikat';
      if (img && img.src) {
        openLightbox([{ src: img.src, caption: title }], 0);
      }
    });
  });

  // Attach lightbox to project gallery buttons
  document.querySelectorAll('[data-gallery-key]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-gallery-key');
      if (projectGalleries[key]) {
        openLightbox(projectGalleries[key], 0);
      }
    });
  });
}

/* ===================================================================
   CERTIFICATE CONTROLS (Category Filter & Show More Toggle)
   =================================================================== */
function initCertificateControls() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.certs-grid .cert-card');
  const toggleBtn = document.getElementById('certToggleBtn');

  let activeCategory = 'all';
  let isExpanded = false;
  const initialVisibleCount = 6;

  function updateCertVisibility() {
    let matchedCount = 0;

    certCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const matches = activeCategory === 'all' || category === activeCategory;

      if (matches) {
        matchedCount++;
        if (isExpanded || matchedCount <= initialVisibleCount) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      } else {
        card.style.display = 'none';
      }
    });

    if (toggleBtn) {
      if (matchedCount <= initialVisibleCount) {
        toggleBtn.style.display = 'none';
      } else {
        toggleBtn.style.display = 'inline-flex';
        toggleBtn.innerHTML = isExpanded
          ? '<i class="fas fa-chevron-up"></i> Tampilkan Lebih Sedikit'
          : `<i class="fas fa-chevron-down"></i> Tampilkan Semua (${matchedCount}) Sertifikat`;
      }
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter') || 'all';
      updateCertVisibility();
      playSynthSound('click');
    });
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      updateCertVisibility();
      playSynthSound('click');
      if (!isExpanded) {
        document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  updateCertVisibility();
}

/* ===================================================================
   11. CONTACT FORM HANDLER
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#senderName').value.trim();
    const email = form.querySelector('#senderEmail').value.trim();
    const subject = form.querySelector('#messageSubject').value.trim();
    const message = form.querySelector('#senderMessage').value.trim();
    const submitBtn = form.querySelector('#submitBtn');

    if (!name || !email || !message) {
      showToast('⚠️ Mohon lengkapi semua kolom yang wajib diisi!');
      return;
    }

    // Button loading state
    const originalContent = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim Pesan...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      form.reset();

      playSynthSound('success');
      showToast('🎉 Pesan Anda berhasil dikirim! Terima kasih telah menghubungi saya.');
    }, 1200);
  });
}

/* ===================================================================
   12. 1-CLICK CLIPBOARD COPY
   =================================================================== */
function initClipboard() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          playSynthSound('success');
          showToast(`📋 Disalin: "${textToCopy}"`);
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Disalin!';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2000);
        })
        .catch(() => {
          showToast('Gagal menyalin teks');
        });
    });
  });
}

/* ===================================================================
   13. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-info-circle" style="color: var(--accent-secondary);"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

/* ===================================================================
   14. SMOOTH SCROLL REVEAL (AOS-LIKE BEHAVIOR)
   =================================================================== */
function initAOSLikeScroll() {
  const elements = document.querySelectorAll('.project-card, .cert-card, .timeline-card, .stat-card, .skill-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}
