"use client";

import {
  Box,
  Text,
  Heading,
  Container,
  SimpleGrid,
  Flex,
  Button,
} from "@chakra-ui/react";
import { useTitle } from "@/hooks/useTitle";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./blog.module.css";


export default function Blog() {
  const [activeFilter, setActiveFilter] = useState("all");

  const posts = [
    {
      id: 1,
      cat: "kisan",
      color: "#11A400",
      badge: "किसान कल्याण",
      date: "नवम्बर 2025",
      title: "PM-KISAN 21वीं किस्त - 9.34 करोड़ किसानों को ₹18,680 करोड़ जारी",
      excerpt:
        "19 नवम्बर 2025 को कोयम्बटूर, तमिलनाडु से प्रधानमंत्री ने PM-KISAN की 21वीं किस्त जारी की। सतना जिले के पात्र किसानों को ₹2,000 की राशि DBT के माध्यम से प्राप्त हुई। eKYC न कराने वाले किसान pmkisan.gov.in पर जाकर अपना सत्यापन कराएं।",
      source: "pmkisan.gov.in",
      link: "https://pmkisan.gov.in",
      icon: "🌾",
      thumbnail: "/images/blog/pmkisan-21st-installment.jpg"
    },

    {
      id: 2,
      cat: "kisan",
      color: "#11A400",
      badge: "किसान कल्याण",
      date: "अगस्त 2025",
      title: "PM-KISAN 20वीं किस्त — 9.7 करोड़ किसानों को ₹20,843 करोड़",
      excerpt:
        "प्रधानमंत्री ने वाराणसी से PM-KISAN की 20वीं किस्त जारी की। 9.7 करोड़ किसानों को ₹2,000 प्रति किसान DBT के माध्यम से मिले। सतना जिले के किसान pmkisan.gov.in पर Beneficiary Status चेक करें और eKYC सुनिश्चित करें। बिना eKYC किस्त नहीं मिलेगी।",
      source: "pmkisan.gov.in",
      link: "https://pmkisan.gov.in",
      icon: "🌾",
      thumbnail: "/images/blog/pmkisan-20th-installment.jpg"
    },

    {
      id: 3,
      cat: "jal",
      color: "#0074D1",
      badge: "जल एवं स्वच्छता",
      date: "अगस्त 2025",
      title: "जल जीवन मिशन — 15 करोड़ घरों तक नल जल",
      excerpt:
        "15 अगस्त 2025 को जल जीवन मिशन की 6वीं वर्षगांठ पर सरकार ने बताया कि 2019 में मात्र 17% से बढ़कर अब 80% ग्रामीण घरों तक नल जल कनेक्शन पहुंच चुका है। मध्य प्रदेश में JJM के लिए बजट 2025-26 में ₹17,136 करोड़ का प्रावधान है। सतना बंसागर-2 समूह जल योजना से क्षेत्र के लाखों परिवार लाभान्वित हो रहे हैं।",
      source: "jaljeevanmission.gov.in",
      link: "https://jaljeevanmission.gov.in",
      icon: "💧",
      thumbnail: "/images/blog/jjm-6th-anniversary.jpg"
    },

    {
      id: 4,
      cat: "awas",
      color: "#FE6700",
      badge: "आवास योजना",
      date: "2025",
      title: "Awaas+ 2024 ऐप लॉन्च — PMAY-G स्व-सर्वे",
      excerpt:
        "ग्रामीण विकास मंत्रालय ने Awaas+ 2024 मोबाइल ऐप लॉन्च किया है जिससे PMAY-G के लाभार्थी अपने मोबाइल से स्व-सर्वे कर सकते हैं। pmayg.nic.in से ऐप डाउनलोड कर आधार-आधारित फेस ऑथेंटिकेशन द्वारा आवेदन करें। जो लोग स्वयं नहीं कर सकते, उनके लिए ग्राम पंचायत स्तर पर सहायता उपलब्ध है।",
      source: "pmayg.nic.in",
      link: "https://pmayg.nic.in",
      icon: "🏠",
      thumbnail: "/images/blog/awaas-plus-app-pmayg.jpg"
    },

    {
      id: 5,
      cat: "awas",
      color: "#FE6700",
      badge: "आवास योजना",
      date: "मार्च 2025",
      title: "PMAY-G 2029 तक विस्तार — 2 करोड़ घर",
      excerpt:
        "21 मार्च 2025 को केंद्र सरकार ने प्रधानमंत्री आवास योजना-ग्रामीण को मार्च 2029 तक बढ़ाते हुए 2 करोड़ अतिरिक्त आवास निर्माण का लक्ष्य घोषित किया। इस नए चरण में ₹3.06 लाख करोड़ की राशि निर्धारित है। सतना-मैहर के पात्र लाभार्थी Awaas+ 2024 ऐप से स्व-सर्वे कर सकते हैं।",
      source: "pmayg.nic.in",
      link: "https://pmayg.nic.in",
      icon: "🏠",
      thumbnail: "/images/blog/pmayg-extension-2029.jpg"
    },

    {
      id: 6,
      cat: "swasthya",
      color: "#AD1457",
      badge: "स्वास्थ्य",
      date: "मार्च 2025",
      title: "आयुष्मान भारत — ₹1,277 करोड़ बजट",
      excerpt:
        "मध्य प्रदेश सरकार ने वर्ष 2025-26 के बजट में PM Jan Arogya Yojana (आयुष्मान भारत) के लिए ₹1,277 करोड़ की राशि निर्धारित की। सतना-मैहर क्षेत्र के नागरिक जिनके पास आयुष्मान कार्ड नहीं है, वे आधार कार्ड एवं वोटर आईडी लेकर सांसद सुविधा केंद्र से सहायता प्राप्त कर सकते हैं।",
      source: "pmjay.gov.in",
      link: "https://pmjay.gov.in",
      icon: "🏥",
      thumbnail: "/images/blog/ayushman-bharat-mp-budget.jpg"
    },

    {
      id: 7,
      cat: "jal",
      color: "#0074D1",
      badge: "जल एवं स्वच्छता",
      date: "फरवरी 2025",
      title: "जल जीवन मिशन 2028 तक विस्तार",
      excerpt:
        "केंद्रीय बजट 2025-26 में जल जीवन मिशन को 2028 तक बढ़ाया गया। मध्य प्रदेश ने केंद्र सरकार के साथ सुधार-आधारित MoU पर हस्ताक्षर किए हैं, जिसमें ग्राम पंचायत स्तर पर जल सेवा मूल्यांकन और डिजिटल नियोजन मंच शामिल हैं। 2019 में 17% से बढ़कर 2025 में 80% ग्रामीण घरों तक नल जल पहुंचा।",
      source: "jaljeevanmission.gov.in",
      link: "https://jaljeevanmission.gov.in",
      icon: "💧",
      thumbnail: "/images/blog/jjm-extension-2028.jpg"
    },

    {
      id: 8,
      cat: "kshetra",
      color: "#7d3b01",
      badge: "क्षेत्रीय विकास",
      date: "अगस्त 2024",
      title: "सतना में ROB निर्माण की मांग",
      excerpt:
        "सतना सांसद श्री गणेश सिंह ने अगस्त 2024 में संसद में Rule 377 के तहत सतना शहर में रेल ओवर ब्रिज (ROB) निर्माण की मांग उठाई। यह यातायात जाम की दीर्घकालिक समस्या के समाधान के लिए आवश्यक है। सांसद ने 18वीं लोकसभा में अब तक 78 से अधिक प्रश्न उठाए हैं जिनमें क्षेत्रीय बुनियादी ढांचे, किसान कल्याण और हवाई अड्डा विस्तार शामिल हैं।",
      source: "sansad.in",
      link: "https://sansad.in",
      icon: "🏛️",
      thumbnail: "/images/blog/ganesh-singh-rob-demand.jpg"
    },

    {
      id: 9,
      cat: "kshetra",
      color: "#7d3b01",
      badge: "क्षेत्रीय विकास",
      date: "जून 2024",
      title: "गणेश सिंह 5वीं बार सांसद चुने गए",
      excerpt:
        "26 अप्रैल 2024 को हुए लोकसभा चुनाव में श्री गणेश सिंह (BJP) ने 4,59,728 मत प्राप्त करते हुए 84,949 मतों के अंतर से विजय प्राप्त की। वे सतना से लगातार पांचवीं बार सांसद (14वीं से 18वीं लोकसभा) चुने गए हैं। वे संसदीय समिति — OBC कल्याण समिति के अध्यक्ष भी हैं।",
      source: "sansad.in",
      link: "https://sansad.in",
      icon: "🏛️",
      thumbnail: "/images/blog/ganesh-singh-5th-term-2024.jpg"
    }
  ];

  useTitle("ब्लॉग और समाचार | सांसद सुविधा केंद्र – सतना-मैहर");
  return (
    <Box>

      {/* HERO SECTION */}
        <Box
        position="relative"
        bg="#ff7800"
        bgImage="url('/satna-universal-banner.webp')"
        bgSize={{ base: "90%", md: "70%", lg: "45%" }}
        bgRepeat="no-repeat"
        bgPosition="center"
        py={{ base: 20, md: 24 }}
        textAlign="center"
        color="white"
        overflow="hidden"
      >
        {/* pattern */}
        <Box
          position="absolute"
          inset={0}
          bgImage="radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)"
          bgSize="22px 22px"
        />

        <Container position="relative">

          {/* emblem */}
          <Box
            bg="rgba(255,255,255,0.18)"
            w="80px"
            h="80px"
            mx="auto"
            mt={6}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={6} // 🔥 gap बढ़ाया
            sx={{
              backdropFilter: "blur(4px)",
              animation: "pulse 3s infinite",
            }}
          >
            <img src="/SSASatna_Favicon_Color.png" width="80" />
          </Box>

          <Text
            fontSize="xs"
            letterSpacing="2px"
            bg="rgba(255,255,255,0.22)"
            display="inline-block"
            px={4}
            py={1}
            borderRadius="full"
            mb={4}
            fontWeight="bold"
            border="1px solid rgba(255,255,255,0.4)"
          >
            सतना-मैहर लोकसभा क्षेत्र
          </Text>

          <Heading
            fontSize={{ base: "2xl", md: "5xl" }}
            mb={6}
          >
            ब्लॉग और समाचार
          </Heading>

          <Text
            mt={2}
            opacity={0.9}
            fontSize={{ base: "sm", md: "md" }}
          >
            क्षेत्र की खबरें, योजनाओं की जानकारी
          </Text>

        </Container>

        {/* animation */}
        <style>
          {`
           @keyframes pulse {
             0%,100% { box-shadow: 0 0 0 2px rgba(255,255,255,0.35); }
             50% { box-shadow: 0 0 0 12px rgba(255,255,255,0.08); }
           }
         `}
        </style>
      </Box>


      <main className={styles.page}>
        <div className={`${styles.intro} ${styles.fadeUp}`}>

          <div className={styles.pill}>ब्लॉग और समाचार</div>

          <h2>
            <em>सतना-मैहर</em> क्षेत्र की ताज़ा खबरें
          </h2>

          <p>
            सांसद सुविधा केंद्र के माध्यम से जानें — सरकारी योजनाओं की नवीनतम
            अपडेट, क्षेत्रीय विकास कार्य और आपके काम की हर महत्वपूर्ण जानकारी।
          </p>

        </div>

        <div className={`${styles.featuredPost} ${styles.fadeUp}`}>

          {/* LEFT */}
          <div className={styles.featuredPostText}>
            <div className={styles.featuredPostLabel}>🇮🇳 मुख्य समाचार</div>

            <div className={styles.featuredPostCat}>
              PM-KISAN · केंद्र सरकार
            </div>

            <h2 className={styles.featuredPostTitle}>
              PM-KISAN की 22वीं किस्त 13 मार्च 2026 को जारी -
              9.32 करोड़ किसानों को ₹18,640 करोड़ का सीधा लाभ
            </h2>

            <p className={styles.featuredPostExcerpt}>
              प्रधानमंत्री श्री नरेंद्र मोदी ने गुवाहाटी, असम से PM-KISAN की 22वीं किस्त जारी की।
              इस किस्त में देशभर के 9.32 करोड़ से अधिक पात्र किसान परिवारों को ₹2,000 प्रति किसान
              की दर से DBT के माध्यम से सीधे बैंक खाते में राशि भेजी गई।
              सतना-मैहर क्षेत्र के किसान भाई eKYC पूर्ण कर लाभ सुनिश्चित करें।
            </p>

            <div className={styles.featuredPostMeta}>
              <span className={styles.featuredPostDate}>📅 मार्च 2026</span>

              <a
                href="https://pmkisan.gov.in"
                target="_blank"
                className={styles.featuredPostReadmore}
              >
                आधिकारिक पोर्टल →
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.featuredPostVisual}>
            <div className={styles.featuredPostStatCard}>

              <div className={styles.statIcon}>🌾</div>

              <div className={styles.statNum}>₹2,000</div>

              <div className={styles.statLabel}>
                प्रति किसान किस्त<br />
                22वीं किस्त — मार्च 2026
              </div>

              <div className={styles.featBadges}>
                <span className={styles.featBadge}>✅ DBT जारी</span>
                <span className={styles.featBadge}>🏦 बैंक खाते में</span>
                <span className={styles.featBadge}>📱 eKYC अनिवार्य</span>
              </div>

            </div>
          </div>

        </div>


        <div className={styles.filterBar}>
          {[
            { key: "all", label: "सभी" },
            { key: "kisan", label: "किसान कल्याण" },
            { key: "awas", label: "आवास योजना" },
            { key: "jal", label: "जल एवं स्वच्छता" },
            { key: "swasthya", label: "स्वास्थ्य" },
            { key: "kshetra", label: "क्षेत्रीय विकास" },
          ].map(btn => (
            <button
              key={btn.key}
              onClick={() => setActiveFilter(btn.key)}
              className={`${styles.filterBtn} ${activeFilter === btn.key ? styles.active : ""
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* POSTS */}
        <div className={styles.postsGrid}>
          {posts
            .filter(p => activeFilter === "all" || p.cat === activeFilter)
            .map(p => (
              <div
                key={p.id}
                className={styles.postCard}
                style={{ "--cat-color": p.color }}
              >

                <div className={styles.postCardThumb}>

                  <div className={styles.postCardThumbBg}>
                    <span className={styles.postCardThumbIcon}>
                      {p.icon}
                    </span>
                  </div>


                </div>
                {/* TOP */}
                <div className={styles.postCardTop}>
                  <span className={styles.postCardBadge}>{p.badge}</span>
                  <span className={styles.postCardDate}>{p.date}</span>
                </div>

                {/* BODY */}
                <div className={styles.postCardBody}>
                  <h3 className={styles.postCardTitle}>{p.title}</h3>
                  <p className={styles.postCardExcerpt}>{p.excerpt}</p>
                </div>

                {/* FOOTER */}
                <div className={styles.postCardFooter}>
                  <span className={styles.postCardSource}>📌 {p.source}</span>

                  <a
                    href={p.link}
                    target="_blank"
                    className={styles.postCardLink}
                  >
                    पढ़ें →
                  </a>
                </div>

              </div>
            ))}
        </div>


        <div className={`${styles.cta} ${styles.fadeUp}`}>

          <h2>
            अपनी शिकायत दर्ज कराने के लिए<br />
            सुविधा केंद्र से जुड़ें
          </h2>

          <p>
            सांसद सुविधा केंद्र में अपना <strong>आधार कार्ड</strong> एवं{" "}
            <strong>वोटर आईडी कार्ड</strong> साथ लाएं — किसी भी सरकारी योजना की
            जानकारी या समस्या निराकरण के लिए हम सदैव तत्पर हैं।
          </p>

          <div className={styles.ctaBtns}>

            <Link href="/govt-schemes" className={`${styles.btn} ${styles.btnDark}`}>
              📋 सरकारी योजनाएं देखें
            </Link>

            <Link href="/contact" className={`${styles.btn} ${styles.btnOutline}`}>
              📞 संपर्क करें
            </Link>

          </div>

        </div>
      </main>
    </Box>
  );
}