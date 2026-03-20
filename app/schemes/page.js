"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";

/* ─────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────── */
const categories = [
  {
    id: "agriculture",
    title: "Agriculture & Farmers Welfare",
    titleHi: "कृषि एवं किसान कल्याण",
    emoji: "🧑‍🌾",
    color: "#4CAF50",
    schemes: [
      {
        name: "PM-KISAN",
        desc: "Pradhan Mantri Kisan Samman Nidhi – ₹6,000/yr direct income support to small & marginal farmers.",
        url: "https://pmkisan.gov.in/",
      },
      {
        name: "PMFBY",
        desc: "Pradhan Mantri Fasal Bima Yojana – Crop insurance against natural calamities, pests & diseases.",
        url: "https://pmfby.gov.in/",
      },
      {
        name: "PMKSY",
        desc: "Pradhan Mantri Krishi Sinchai Yojana – Ensuring irrigation access to every field ('Har Khet Ko Pani').",
        url: "https://pmksy.gov.in/",
      },
      {
        name: "Soil Health Card Scheme",
        desc: "Provides farmers with soil nutrient status and crop-specific fertilizer recommendations.",
        url: "https://soilhealth.dac.gov.in/",
      },
      {
        name: "e-NAM",
        desc: "National Agriculture Market – Pan-India electronic trading portal for agricultural commodities.",
        url: "https://www.enam.gov.in/",
      },
      {
        name: "Kisan Credit Card (KCC)",
        desc: "Easy & timely credit access for crop production, post-harvest, allied activities & personal needs.",
        url: "https://www.nabard.org/content.aspx?id=572",
      },
    ],
  },
  {
    id: "health",
    title: "Health & Nutrition",
    titleHi: "स्वास्थ्य एवं पोषण",
    emoji: "🏥",
    color: "#E53935",
    schemes: [
      {
        name: "Ayushman Bharat PM-JAY",
        desc: "Health cover up to ₹5 lakh per family per year for secondary & tertiary hospitalisation.",
        url: "https://pmjay.gov.in/",
      },
      {
        name: "Mission Indradhanush",
        desc: "Immunization programme covering vaccines for 12 preventable diseases for children & pregnant women.",
        url: "https://www.nhp.gov.in/mission-indradhanush_pg",
      },
      {
        name: "POSHAN Abhiyaan",
        desc: "National Nutrition Mission to reduce stunting, under-nutrition, anaemia & low birth weight.",
        url: "https://poshanabhiyaan.gov.in/",
      },
      {
        name: "Janani Suraksha Yojana",
        desc: "Safe motherhood intervention under NHM promoting institutional delivery among poor pregnant women.",
        url: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
      },
      {
        name: "PM Matru Vandana Yojana",
        desc: "₹5,000 direct cash incentive for first live birth to compensate wage loss during pregnancy.",
        url: "https://pmmvy.wcd.gov.in/",
      },
    ],
  },
  {
    id: "education",
    title: "Education & Skill Development",
    titleHi: "शिक्षा एवं कौशल विकास",
    emoji: "🎓",
    color: "#1565C0",
    schemes: [
      {
        name: "Samagra Shiksha Abhiyan",
        desc: "Integrated school education programme from pre-school to Class XII.",
        url: "https://samagra.education.gov.in/",
      },
      {
        name: "Mid-Day Meal (PM POSHAN)",
        desc: "School meals programme to improve enrolment, retention and nutrition among government school children.",
        url: "https://pmposhan.education.gov.in/",
      },
      {
        name: "Skill India Mission",
        desc: "Umbrella mission to train over 40 crore people in different skills by 2022.",
        url: "https://www.skillindia.gov.in/",
      },
      {
        name: "PM Kaushal Vikas Yojana (PMKVY)",
        desc: "Short-duration skill certification training and monetary reward for prior learning recognition.",
        url: "https://www.pmkvyofficial.org/",
      },
      {
        name: "National Means-cum-Merit Scholarship (NMMS)",
        desc: "₹12,000/yr scholarship to meritorious students of economically weaker sections from Class IX.",
        url: "https://scholarships.gov.in/",
      },
    ],
  },
  {
    id: "employment",
    title: "Employment & Entrepreneurship",
    titleHi: "रोजगार एवं उद्यमिता",
    emoji: "💼",
    color: "#6A1B9A",
    schemes: [
      {
        name: "MGNREGA",
        desc: "Mahatma Gandhi NREGA – Guarantees 100 days of unskilled manual work per year to rural households.",
        url: "https://nrega.nic.in/",
      },
      {
        name: "PMEGP",
        desc: "Prime Minister Employment Generation Programme – Credit-linked subsidy for micro enterprises.",
        url: "https://www.kviconline.gov.in/pmegpeportal/",
      },
      {
        name: "Start-Up India",
        desc: "Regulatory, fiscal and funding support to build a strong startup ecosystem in India.",
        url: "https://www.startupindia.gov.in/",
      },
      {
        name: "Stand-Up India",
        desc: "Bank loans between ₹10 lakh–₹1 crore for SC/ST & women entrepreneurs to set up greenfield enterprises.",
        url: "https://www.standupmitra.in/",
      },
      {
        name: "Atmanirbhar Bharat Abhiyan",
        desc: "Comprehensive economic stimulus package making India self-reliant across sectors.",
        url: "https://aatmanirbharbharat.mygov.in/",
      },
    ],
  },
  {
    id: "housing",
    title: "Housing & Urban Development",
    titleHi: "आवास एवं शहरी विकास",
    emoji: "🏠",
    color: "#F57F17",
    schemes: [
      {
        name: "Pradhan Mantri Awas Yojana – Urban",
        desc: "Housing for All mission to provide affordable houses to the urban poor by 2022.",
        url: "https://pmaymis.gov.in/",
      },
      {
        name: "Pradhan Mantri Awas Yojana – Gramin",
        desc: "Targets provision of pucca houses with basic amenities to the rural poor.",
        url: "https://pmayg.nic.in/",
      },
      {
        name: "Smart Cities Mission",
        desc: "₹1 lakh crore programme to develop 100 cities into citizen-friendly & sustainable cities.",
        url: "https://smartcities.gov.in/",
      },
      {
        name: "AMRUT",
        desc: "Atal Mission for Rejuvenation and Urban Transformation – basic infrastructure in 500 cities.",
        url: "https://amrut.gov.in/",
      },
      {
        name: "Swachh Bharat Mission",
        desc: "Urban & rural sanitation drive to make India open-defecation free and improve solid waste management.",
        url: "https://swachhbharat.mygov.in/",
      },
    ],
  },
  {
    id: "energy",
    title: "Energy & Infrastructure",
    titleHi: "ऊर्जा एवं अवसंरचना",
    emoji: "💡",
    color: "#F9A825",
    schemes: [
      {
        name: "Saubhagya Yojana",
        desc: "Pradhan Mantri Sahaj Bijli Har Ghar Yojana – free electricity connections to all rural households.",
        url: "https://saubhagya.gov.in/",
      },
      {
        name: "UJALA Scheme",
        desc: "Unnat Jyoti by Affordable LEDs – distribution of LED bulbs at subsidised price to save energy.",
        url: "https://www.ujala.gov.in/",
      },
      {
        name: "PM Gati Shakti",
        desc: "₹100 lakh crore national master plan for multi-modal connectivity infrastructure.",
        url: "https://gatishakti.gov.in/",
      },
      {
        name: "National Infrastructure Pipeline (NIP)",
        desc: "₹111 lakh crore pipeline of infrastructure projects to be implemented during 2019–25.",
        url: "https://indiainvestmentgrid.gov.in/national-infrastructure-pipeline",
      },
      {
        name: "UDAY Scheme",
        desc: "Ujwal DISCOM Assurance Yojana – financial turnaround & revival of power distribution companies.",
        url: "https://www.uday.gov.in/",
      },
    ],
  },
  {
    id: "women",
    title: "Women & Child Welfare",
    titleHi: "महिला एवं बाल कल्याण",
    emoji: "👩‍👧",
    color: "#AD1457",
    schemes: [
      {
        name: "Beti Bachao Beti Padhao",
        desc: "Addresses declining child sex ratio and promotes welfare and education of the girl child.",
        url: "https://wcd.nic.in/bbbp-schemes",
      },
      {
        name: "Sukanya Samriddhi Yojana",
        desc: "High-interest savings scheme for girl child – deposits up to ₹1.5 lakh/yr with tax benefits.",
        url: "https://www.india.gov.in/sukanya-samriddhi-yojna",
      },
      {
        name: "One Stop Centre Scheme",
        desc: "Integrated support & services to women affected by violence – medical, legal, psychological.",
        url: "https://oscms.wcd.gov.in/",
      },
      {
        name: "Mahila Shakti Kendra",
        desc: "Community engagement through student volunteers to empower rural women with awareness & training.",
        url: "https://wcd.nic.in/schemes/mahila-shakti-kendra",
      },
    ],
  },
  {
    id: "finance",
    title: "Financial Inclusion & Social Security",
    titleHi: "वित्तीय समावेश एवं सामाजिक सुरक्षा",
    emoji: "🏦",
    color: "#00695C",
    schemes: [
      {
        name: "PM Jan Dhan Yojana",
        desc: "National mission for financial inclusion to provide affordable access to bank accounts & remittance.",
        url: "https://pmjdy.gov.in/",
      },
      {
        name: "Atal Pension Yojana (APY)",
        desc: "Guaranteed pension between ₹1,000–₹5,000/month for unorganised sector workers after age 60.",
        url: "https://npscra.nsdl.co.in/scheme-details.php",
      },
      {
        name: "PM Jeevan Jyoti Bima Yojana (PMJJBY)",
        desc: "₹2 lakh life insurance cover at just ₹436/year premium for bank account holders aged 18–50.",
        url: "https://jansuraksha.gov.in/",
      },
      {
        name: "PM Suraksha Bima Yojana (PMSBY)",
        desc: "₹2 lakh accidental death & disability cover at ₹20/year premium.",
        url: "https://jansuraksha.gov.in/",
      },
      {
        name: "National Pension System (NPS)",
        desc: "Voluntary long-term retirement savings scheme regulated by PFRDA for all Indian citizens.",
        url: "https://www.npscra.nsdl.co.in/",
      },
    ],
  },
  {
    id: "rural",
    title: "Rural Development & Basic Amenities",
    titleHi: "ग्रामीण विकास एवं बुनियादी सुविधाएं",
    emoji: "🚰",
    color: "#4E342E",
    schemes: [
      {
        name: "Jal Jeevan Mission",
        desc: "Functional Household Tap Connection (FHTC) to every rural household by 2024.",
        url: "https://jaljeevanmission.gov.in/",
      },
      {
        name: "PM Gram Sadak Yojana (PMGSY)",
        desc: "All-weather road connectivity to unconnected eligible habitations in rural areas.",
        url: "https://pmgsy.nic.in/",
      },
      {
        name: "DDU-GKY",
        desc: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana – placement-linked skill training for rural poor youth.",
        url: "https://ddugky.gov.in/",
      },
      {
        name: "Shyama Prasad Mukherji Rurban Mission",
        desc: "Develops clusters of villages with urban amenities while preserving rural character.",
        url: "https://rurban.gov.in/",
      },
    ],
  },
  {
    id: "digital",
    title: "Digital India & Technology",
    titleHi: "डिजिटल इंडिया एवं तकनीक",
    emoji: "🧑‍💻",
    color: "#0277BD",
    schemes: [
      {
        name: "Digital India Mission",
        desc: "Transform India into a digitally empowered society and knowledge economy.",
        url: "https://digitalindia.gov.in/",
      },
      {
        name: "UMANG App",
        desc: "Unified Mobile Application for New-age Governance – single platform for 1,200+ government services.",
        url: "https://web.umang.gov.in/",
      },
      {
        name: "DigiLocker",
        desc: "Secure cloud-based platform to store, share & verify documents – Aadhaar, PAN, RC, licenses & more.",
        url: "https://www.digilocker.gov.in/",
      },
      {
        name: "BharatNet Project",
        desc: "Optical fibre broadband connectivity to 2.5 lakh+ gram panchayats across rural India.",
        url: "https://bbnl.nic.in/",
      },
    ],
  },
  {
    id: "environment",
    title: "Environment & Sustainability",
    titleHi: "पर्यावरण एवं सतत विकास",
    emoji: "🌱",
    color: "#2E7D32",
    schemes: [
      {
        name: "National Solar Mission",
        desc: "Target of 100 GW solar capacity through large-scale grid & off-grid solar projects.",
        url: "https://mnre.gov.in/solar/national-solar-mission/",
      },
      {
        name: "FAME India Scheme",
        desc: "Faster Adoption & Manufacturing of Electric Vehicles – subsidies for EV purchase & charging infra.",
        url: "https://fame2.heavyindustry.gov.in/",
      },
      {
        name: "Namami Gange Programme",
        desc: "Integrated conservation mission to reduce pollution, rejuvenate and protect the Ganga river.",
        url: "https://nmcg.nic.in/",
      },
      {
        name: "Green India Mission",
        desc: "Increase forest & tree cover by 5 million hectares and improve quality on another 5 million ha.",
        url: "https://moef.gov.in/en/division/environment-divisions/cc-division/national-action-plan-on-climate-change-napcc/national-mission-for-a-green-india/",
      },
    ],
  },
  {
    id: "senior",
    title: "Senior Citizens & Social Welfare",
    titleHi: "वरिष्ठ नागरिक एवं सामाजिक कल्याण",
    emoji: "🧓",
    color: "#37474F",
    schemes: [
      {
        name: "IGNOAPS",
        desc: "Indira Gandhi National Old Age Pension Scheme – ₹200–₹500/month pension for BPL elderly.",
        url: "https://nsap.nic.in/",
      },
      {
        name: "Rashtriya Vayoshri Yojana",
        desc: "Free assistive devices (spectacles, hearing aids, dentures, wheelchairs) for senior BPL citizens.",
        url: "https://www.alimco.in/rashtriya_vayoshri_yojana.aspx",
      },
      {
        name: "Varishtha Pension Bima Yojana (VPBY)",
        desc: "LIC-administered pension plan for citizens 60+ providing assured return on lump sum investment.",
        url: "https://licindia.in/",
      },
    ],
  },
];

const LOGO_MAP = {
  "pm-kisan": "https://pmkisan.gov.in/images/pmkisanlogo.png",
  pmfby: "https://pmfby.gov.in/assets/images/PMFBY-Logo.png",
  "ayushman bharat pm-jay":
    "https://pmjay.gov.in/sites/default/files/2018-09/AB-PMJAY-Logo.png",
  mgnrega: "https://nrega.nic.in/Netnrega/mgnrega_new/images/mgnregs-logo.png",
  "pm jan dhan yojana": "https://pmjdy.gov.in/images/PMJDY-Logo.png",
  "jal jeevan mission":
    "https://jaljeevanmission.gov.in/sites/default/files/logo.png",
  "digital india mission":
    "https://digitalindia.gov.in/assets/images/digital-india-logo.png",
  digilocker: "https://www.digilocker.gov.in/assets/img/digilocker_logo.png",
  "beti bachao beti padhao":
    "https://wcd.nic.in/sites/default/files/BBBP-LOGO.png",
  "swachh bharat mission": "https://sbm.gov.in/sbm/assets/img/logo.png",
};

/* ─────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────── */

function IndianFlag() {
  const spokes = Array.from({ length: 24 }, (_, k) => {
    const a = (k * 15 * Math.PI) / 180;
    return {
      x1: (450 + 20 * Math.cos(a)).toFixed(1),
      y1: (300 + 20 * Math.sin(a)).toFixed(1),
      x2: (450 + 60 * Math.cos(a)).toFixed(1),
      y2: (300 + 60 * Math.sin(a)).toFixed(1),
    };
  });
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      width="36"
      height="24"
      aria-hidden="true"
    >
      <rect width="900" height="200" fill="#FF9933" />
      <rect y="200" width="900" height="200" fill="#FFFFFF" />
      <rect y="400" width="900" height="200" fill="#138808" />
      <circle
        cx="450"
        cy="300"
        r="60"
        fill="none"
        stroke="#000080"
        strokeWidth="4"
      />
      <circle cx="450" cy="300" r="5" fill="#000080" />
      {spokes.map((s, i) => (
        <line
          key={i}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke="#000080"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

function SchemeCard({ scheme, catColor }) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = LOGO_MAP[scheme.name.toLowerCase()] || null;

  return (
    <article className="scheme-card" style={{ "--cat-color": catColor }}>
      <div className="scheme-card__top">
        <div className="scheme-card__logo">
          {!imgError && logoUrl ? (
            <img
              src={logoUrl}
              alt={`${scheme.name} logo`}
              width={36}
              height={36}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="flag-fallback">
              <IndianFlag />
            </span>
          )}
        </div>
        <h3 className="scheme-card__name">{scheme.name}</h3>
      </div>
      <p className="scheme-card__desc">{scheme.desc}</p>
      <a
        className="scheme-card__link"
        href={scheme.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Learn more about ${scheme.name} – opens in new tab`}
      >
        आधिकारिक पेज देखें
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  );
}

function CategorySection({ cat, index }) {
  return (
    <section
      className="category"
      id={`cat-${cat.id}`}
      aria-labelledby={`cat-title-${cat.id}`}
      data-cat-id={cat.id}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="category__header">
        <div
          className="category__icon"
          style={{ background: `${cat.color}22`, color: cat.color }}
          aria-hidden="true"
        >
          {cat.emoji}
        </div>
        <div>
          <h2 className="category__title" id={`cat-title-${cat.id}`}>
            {cat.title}
          </h2>
          <small style={{ color: "var(--gray-text)", fontSize: "0.78rem" }}>
            {cat.titleHi}
          </small>
        </div>
        <span
          className="category__count"
          aria-label={`${cat.schemes.length} schemes`}
        >
          {cat.schemes.length} योजनाएं
        </span>
      </div>
      <div className="schemes-grid">
        {cat.schemes.map((scheme) => (
          <SchemeCard key={scheme.name} scheme={scheme} catColor={cat.color} />
        ))}
      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────────
   MAIN PAGE COMPONENT
───────────────────────────────────────────────── */
export default function GovtSchemesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  // Back-to-top scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setShowBackToTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body overflow lock when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleChipClick = (catId) => {
    setActiveFilter(catId);
    setSearchQuery("");
    if (catId !== "all") {
      const el = document.getElementById(`cat-${catId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBackToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Filtering logic
  const filteredCategories = categories
    .map((cat) => {
      if (activeFilter !== "all" && activeFilter !== cat.id) return null;
      const q = searchQuery.toLowerCase();
      if (!q) return cat;
      const matchedSchemes = cat.schemes.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q),
      );
      return matchedSchemes.length ? { ...cat, schemes: matchedSchemes } : null;
    })
    .filter(Boolean);

  return (
    <>
      <Head>
        <title>सरकारी योजनाएं | सांसद सुविधा केंद्र – सतना-मैहर लोकसभा</title>
        <meta
          name="description"
          content="भारत सरकार की 80+ प्रमुख कल्याणकारी योजनाओं की जानकारी एक ही जगह – PM-KISAN, Ayushman Bharat, MGNREGA और अधिक।"
        />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#FF6B00" />
        <link rel="canonical" href="https://ssksatna.com/govt-schemes" />
        <link rel="icon" href="/SSASatna_Favicon_Color.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
          rel="stylesheet"
        />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ssksatna.com/govt-schemes" />
        <meta
          property="og:title"
          content="सरकारी योजनाएं | सांसद सुविधा केंद्र – सतना-मैहर"
        />
        <meta
          property="og:description"
          content="भारत सरकार की 80+ प्रमुख योजनाओं की संपूर्ण जानकारी – एक क्लिक में।"
        />
        <meta
          property="og:image"
          content="https://ssksatna.com/Satna_SSK_MicroBanner.webp"
        />
        <meta property="og:locale" content="hi_IN" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="सरकारी योजनाएं | सांसद सुविधा केंद्र – सतना-मैहर"
        />
        <meta
          name="twitter:description"
          content="भारत सरकार की 80+ प्रमुख योजनाओं की संपूर्ण जानकारी – एक क्लिक में।"
        />
        <meta
          name="twitter:image"
          content="https://ssksatna.com/Satna_SSK_MicroBanner.webp"
        />
      </Head>

      <style jsx global>{`
        :root {
          --saffron: #ff6b00;
          --saffron-dark: #cc5500;
          --saffron-glow: rgba(255, 107, 0, 0.18);
          --green: #138808;
          --green-dark: #0d6405;
          --white: #ffffff;
          --off-white: #fff8f2;
          --navy: #1a2035;
          --gray-light: #f4f4f6;
          --gray-text: #555;
          --card-shadow: 0 4px 24px rgba(0, 0, 0, 0.09);
          --card-hover: 0 8px 32px rgba(255, 107, 0, 0.18);
          --radius: 12px;
          --transition: 0.25s ease;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: "Poppins", sans-serif;
          background: var(--off-white);
          color: var(--navy);
          line-height: 1.6;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        img {
          display: block;
          max-width: 100%;
        }
        ul {
          list-style: none;
        }

        /* NAVBAR */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #7d3b01;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5%;
          height: 64px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
        }
        .navbar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .navbar__brand img {
          width: 77px;
          height: auto;
          object-fit: contain;
          flex-shrink: 0;
        }
        .navbar__links {
          display: flex;
          gap: 28px;
          align-items: center;
        }
        .navbar__links a {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.88rem;
          font-weight: 500;
          transition: color var(--transition);
        }
        .navbar__links a:hover {
          color: #fff;
        }
        .navbar__login-btn {
          border: 1.5px solid var(--saffron) !important;
          color: var(--saffron) !important;
          padding: 6px 16px;
          border-radius: 5px;
          font-weight: 600 !important;
          transition:
            background var(--transition),
            color var(--transition) !important;
        }
        .navbar__login-btn:hover {
          background: var(--saffron) !important;
          color: #fff !important;
        }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          background: none;
          border: none;
          padding: 4px;
        }
        .hamburger span {
          display: block;
          width: 24px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
          transition: var(--transition);
        }

        /* DRAWER */
        .drawer-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          z-index: 1100;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .drawer-overlay.open {
          display: block;
          opacity: 1;
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 80%;
          max-width: 320px;
          background: #fff;
          z-index: 1200;
          display: flex;
          flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
        }
        .mobile-drawer.open {
          transform: translateX(0);
        }
        .mobile-drawer__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
        }
        .mobile-drawer__header img {
          height: 44px;
          width: auto;
          object-fit: contain;
        }
        .mobile-drawer__close {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.5rem;
          color: #555;
          line-height: 1;
          padding: 4px;
        }
        .mobile-drawer__close:hover {
          color: #111;
        }
        .mobile-drawer__nav {
          flex: 1;
          list-style: none;
          padding: 8px 0;
          overflow-y: auto;
        }
        .mobile-drawer__nav li {
          border-bottom: 1px solid #f0f0f0;
        }
        .mobile-drawer__nav a {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          font-size: 1rem;
          font-weight: 500;
          color: #333;
          text-decoration: none;
          transition: background var(--transition);
        }
        .mobile-drawer__nav a:hover {
          background: #fff8f2;
          color: var(--saffron);
        }
        .mobile-drawer__footer {
          padding: 20px 24px;
          border-top: 1px solid #eee;
        }
        .mobile-drawer__login {
          display: block;
          width: 100%;
          padding: 15px;
          background: var(--saffron);
          color: #fff;
          text-align: center;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 8px;
          text-decoration: none;
          transition: background var(--transition);
        }
        .mobile-drawer__login:hover {
          background: var(--saffron-dark);
          color: #fff;
        }

        /* HERO */
        .hero {
          position: relative;
          min-height: 420px;
          background: linear-gradient(
            135deg,
            var(--saffron) 0%,
            #ff8c00 50%,
            var(--saffron-dark) 100%
          );
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 5% 70px;
        }
        .hero::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.15) 1px,
            transparent 1px
          );
          background-size: 22px 22px;
          pointer-events: none;
        }
        .hero__watermark {
          position: absolute;
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14rem;
          opacity: 0.06;
          pointer-events: none;
          user-select: none;
          line-height: 1;
        }
        .hero__content {
          position: relative;
          z-index: 1;
          max-width: 760px;
        }
        .hero__emblem {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          backdrop-filter: blur(4px);
          overflow: hidden;
        }
        .hero__emblem img {
          width: 60px;
          height: auto;
          object-fit: contain;
        }
        .hero__tag {
          display: inline-block;
          background: rgba(255, 255, 255, 0.22);
          color: #fff;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 4px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          margin-bottom: 14px;
        }
        .hero__title {
          font-family: "Tiro Devanagari Hindi", serif;
          font-size: clamp(2rem, 5vw, 3.4rem);
          color: #fff;
          font-weight: 700;
          line-height: 1.2;
          text-shadow: 0 2px 16px rgba(0, 0, 0, 0.18);
        }
        .hero__subtitle {
          font-size: clamp(1rem, 2.5vw, 1.3rem);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          margin: 10px 0 20px;
          border-bottom: 3px solid rgba(255, 255, 255, 0.5);
          display: inline-block;
          padding-bottom: 4px;
        }
        .hero__desc {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.88);
          max-width: 560px;
          margin: 0 auto 28px;
        }

        /* SANSAD BANNER */
        .sansad-banner img {
          width: 50%;
          display: block;
          margin: 30px auto;
          border-radius: 12px;
          box-shadow: var(--card-shadow);
          height: auto;
        }

        /* STATS BAR */
        .stats-bar {
          background: var(--white);
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
        }
        .stats-bar__item {
          flex: 1 1 150px;
          text-align: center;
          padding: 20px 16px;
          border-right: 1px solid #eee;
        }
        .stats-bar__item:last-child {
          border-right: none;
        }
        .stats-bar__num {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--saffron);
          line-height: 1;
        }
        .stats-bar__label {
          font-size: 0.76rem;
          color: var(--gray-text);
          font-weight: 500;
          margin-top: 4px;
        }

        /* FILTER SECTION */
        .filter-section {
          max-width: 1200px;
          margin: 40px auto 0;
          padding: 0 5%;
        }
        .filter-section__title {
          font-size: 1.7rem;
          font-weight: 800;
          color: var(--navy);
          margin-bottom: 20px;
          text-align: center;
        }
        .filter-section__title span {
          color: var(--saffron);
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: var(--white);
          border: 2px solid #e0e0e0;
          border-radius: 50px;
          padding: 6px 8px 6px 20px;
          box-shadow: var(--card-shadow);
          max-width: 560px;
          margin: 0 auto 28px;
          transition: border-color var(--transition);
        }
        .search-bar:focus-within {
          border-color: var(--saffron);
        }
        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.95rem;
          font-family: "Poppins", sans-serif;
          background: transparent;
          color: var(--navy);
        }
        .search-bar input::placeholder {
          color: #aaa;
        }
        .search-bar button {
          background: var(--saffron);
          color: #fff;
          border: none;
          border-radius: 40px;
          padding: 9px 22px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--transition);
        }
        .search-bar button:hover {
          background: var(--saffron-dark);
        }
        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 36px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 16px;
          border-radius: 30px;
          border: 2px solid #ddd;
          background: var(--white);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition:
            background var(--transition),
            border-color var(--transition),
            color var(--transition),
            transform var(--transition);
        }
        .chip:hover,
        .chip.active {
          background: var(--saffron);
          border-color: var(--saffron);
          color: #fff;
          transform: translateY(-1px);
        }
        .chip__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.7;
        }

        /* SCHEME SECTIONS */
        .schemes-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 5% 60px;
        }
        .category {
          margin-bottom: 52px;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .category__header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 3px solid var(--gray-light);
        }
        .category__icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .category__title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--navy);
        }
        .category__count {
          margin-left: auto;
          background: var(--gray-light);
          color: var(--gray-text);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 20px;
        }
        .schemes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }

        /* SCHEME CARD */
        .scheme-card {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--card-shadow);
          padding: 20px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-left: 4px solid var(--cat-color, var(--saffron));
          transition:
            box-shadow var(--transition),
            transform var(--transition);
          position: relative;
          overflow: hidden;
        }
        .scheme-card::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 4px;
          background: var(--cat-color, var(--saffron));
          opacity: 0;
          transition: opacity var(--transition);
        }
        .scheme-card:hover {
          box-shadow: var(--card-hover);
          transform: translateY(-4px);
        }
        .scheme-card:hover::after {
          opacity: 1;
        }
        .scheme-card__top {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .scheme-card__logo {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: var(--gray-light);
          border: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          overflow: hidden;
        }
        .scheme-card__logo img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 4px;
        }
        .scheme-card__logo .flag-fallback {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .scheme-card__name {
          font-size: 0.96rem;
          font-weight: 700;
          color: var(--navy);
          line-height: 1.35;
        }
        .scheme-card__desc {
          font-size: 0.8rem;
          color: var(--gray-text);
          line-height: 1.5;
          flex: 1;
        }
        .scheme-card__link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--cat-color, var(--saffron));
          margin-top: 4px;
          transition: gap var(--transition);
        }
        .scheme-card__link:hover {
          gap: 10px;
        }

        /* FOOTER */
        footer {
          background: #ffffff;
          border-top: 1px solid #e8e8e8;
          text-align: center;
          padding: 28px 5% 20px;
          font-size: 0.78rem;
          color: #777;
        }
        footer .footer__logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        footer .footer__logo img {
          height: auto;
          width: 160px;
          object-fit: contain;
        }
        footer a {
          color: var(--saffron);
          transition: color var(--transition);
        }
        footer a:hover {
          color: var(--saffron-dark);
        }

        /* BACK TO TOP */
        #backToTop {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--saffron);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          box-shadow: 0 4px 18px rgba(255, 107, 0, 0.4);
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity var(--transition),
            transform var(--transition),
            background var(--transition);
          z-index: 500;
        }
        #backToTop.visible {
          opacity: 1;
          transform: translateY(0);
        }
        #backToTop:hover {
          background: var(--saffron-dark);
          transform: translateY(-3px);
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .navbar__links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .stats-bar__item {
            flex: 1 1 50%;
          }
          .schemes-grid {
            grid-template-columns: 1fr;
          }
          .category__header {
            flex-wrap: wrap;
          }
          .sansad-banner img {
            width: 90%;
          }
        }
        @media (max-width: 480px) {
          .hero {
            padding: 44px 5% 54px;
          }
          .stats-bar__item {
            flex: 1 1 100%;
            border-right: none;
            border-bottom: 1px solid #eee;
          }
        }
      `}</style>



      {/* HERO */}
      <header className="hero">
        <div className="hero__watermark" aria-hidden="true">
          🇮🇳
        </div>
        <div className="hero__content">
          <div
            className="hero__emblem"
            aria-label="Sansad Suvidha Kendra emblem"
          >
            <img
              src="/SSASatna_Favicon_Color.png"
              alt="Sansad Suvidha Kendra Satna"
            />
          </div>
          <span className="hero__tag">सतना-मैहर लोकसभा क्षेत्र</span>
          <h1 className="hero__title">सरकारी योजनाएं</h1>
          <p className="hero__subtitle">एक क्लिक, संपूर्ण जानकारी</p>
          <p className="hero__desc">
            भारत सरकार की सभी प्रमुख कल्याणकारी योजनाओं की जानकारी यहाँ एक ही
            जगह पाएं। योजना का चुनाव करें और सीधे आधिकारिक पेज पर जाएं।
          </p>
        </div>
      </header>

      {/* STATS BAR */}
      <section className="stats-bar" aria-label="Quick statistics">
        {[
          { num: "80+", label: "सरकारी योजनाएं" },
          { num: "12", label: "श्रेणियाँ" },
          { num: "₹5L", label: "स्वास्थ्य बीमा तक" },
          { num: "100%", label: "मुफ़्त जानकारी" },
        ].map(({ num, label }) => (
          <div key={label} className="stats-bar__item">
            <div className="stats-bar__num">{num}</div>
            <div className="stats-bar__label">{label}</div>
          </div>
        ))}
      </section>

      {/* SANSAD BANNER */}
      <section className="sansad-banner">
        <img
          src="https://res.cloudinary.com/dxwwnettz/image/upload/v1773993978/Satna_SSK_MicroBanner_ciqocz.webp"
          alt="Sansad Suvidha Kendra Satna – Government Schemes Banner"
          fetchPriority="high"
          loading="eager"
        />
      </section>

      {/* SEARCH & FILTER */}
      <section
        className="filter-section"
        aria-label="Search and Filter Schemes"
      >
        <h2 className="filter-section__title">
          सभी <span>सरकारी योजनाएं</span> खोजें
        </h2>
        <div className="search-bar" role="search">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="योजना का नाम खोजें… (e.g. PM-KISAN, Ayushman)"
            aria-label="Search government schemes"
          />
          <button type="button" aria-label="Search">
            खोजें
          </button>
        </div>
        <div
          className="filter-chips"
          role="group"
          aria-label="Filter by category"
        >
          <button
            className={`chip${activeFilter === "all" ? " active" : ""}`}
            onClick={() => handleChipClick("all")}
            aria-pressed={activeFilter === "all"}
          >
            <span className="chip__dot" style={{ background: "#FF6B00" }} />
            सभी योजनाएं
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`chip${activeFilter === cat.id ? " active" : ""}`}
              onClick={() => handleChipClick(cat.id)}
              aria-pressed={activeFilter === cat.id}
            >
              <span className="chip__dot" style={{ background: cat.color }} />
              {cat.emoji} {cat.titleHi}
            </button>
          ))}
        </div>
      </section>

      {/* SCHEMES LISTING */}
      <main className="schemes-wrapper" aria-label="Government Schemes Listing">
        {filteredCategories.map((cat, i) => (
          <CategorySection key={cat.id} cat={cat} index={i} />
        ))}
      </main>


      {/* BACK TO TOP */}
      <button
        id="backToTop"
        className={showBackToTop ? "visible" : ""}
        onClick={handleBackToTop}
        aria-label="Back to top"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  );
}
