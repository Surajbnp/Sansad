"use client";
import styles from "./success-stories.module.css";
import Link from "next/link";
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
import { useState, useEffect } from "react";

const stories = [
  {
    id: 1,
    cat: "yojana",
    color: "#FE6700",
    avatar: "👩‍🦳",
    name: "सुमित्रा देवी",
    location: "📍 ग्राम बिरसिंहपुर, मैहर",
    badge: "सरकारी योजना",
    scheme: "PM आवास योजना",
    quote: `मुझे नहीं पता था कि मैं PM आवास योजना की पात्र हूं।
    सुविधा केंद्र के कार्यकर्ताओं ने पूरा फॉर्म भरवाया
    और आज मेरे पास पक्का घर है।`,
    benefit: "पक्का मकान स्वीकृत"
  },

  {
    id: 2,
    cat: "samasya",
    color: "#11A400",
    avatar: "👨‍🌾",
    name: "हरिशंकर पटेल",
    location: "📍 ग्राम अमरपाटन, सतना",
    badge: "समस्या निराकरण",
    scheme: "किसान क्रेडिट कार्ड",
    quote: `बैंक ने कई महीनों से KCC नहीं बनाया था।
    सांसद सुविधा केंद्र में शिकायत करने के 10 दिन बाद
    मेरा कार्ड बन गया।`,
    benefit: "KCC ₹1.6 लाख"
  },

  {
    id: 3,
    cat: "infra",
    color: "#0074D1",
    avatar: "👨‍👩‍👧",
    name: "ग्राम पंचायत नागोद",
    location: "📍 नागोद, सतना",
    badge: "बुनियादी ढांचा",
    scheme: "ग्राम सड़क योजना",
    quote: `5 साल से हमारे गांव की सड़क नहीं बनी थी।
    सुविधा केंद्र के माध्यम से आवेदन के 3 महीने में
    सड़क निर्माण शुरू हो गया।`,
    benefit: "2.4 km सड़क स्वीकृत"
  },

  {
    id: 4,
    cat: "suvidha",
    color: "#AD1457",
    avatar: "👩",
    name: "मीना कुमारी",
    location: "📍 वार्ड 7, मैहर नगर",
    badge: "सुविधा प्राप्ति",
    scheme: "आयुष्मान भारत",
    quote: `मुझे पता ही नहीं था कि आयुष्मान कार्ड मुफ्त
    बनता है। सुविधा केंद्र ने आधार कार्ड से
    तुरंत कार्ड बनवा दिया।`,
    benefit: "₹5 लाख स्वास्थ्य बीमा"
  },

  {
    id: 5,
    cat: "yojana",
    color: "#F57F17",
    avatar: "👴",
    name: "बाबूलाल विश्वकर्मा",
    location: "📍 ग्राम सोहागी, सतना",
    badge: "सरकारी योजना",
    scheme: "PM उज्ज्वला योजना",
    quote: `घर में लकड़ी से खाना बनता था, धुएं से
    बहुत परेशानी थी। सुविधा केंद्र से उज्ज्वला
    योजना का फायदा मिला और गैस कनेक्शन मिल गया।`,
    benefit: "मुफ्त गैस कनेक्शन"
  },

  {
    id: 6,
    cat: "samasya",
    color: "#6A1B9A",
    avatar: "👩‍🎓",
    name: "प्रिया सिंह",
    location: "📍 सतना शहर",
    badge: "समस्या निराकरण",
    scheme: "छात्रवृत्ति",
    quote: `मेरी छात्रवृत्ति 2 साल से अटकी थी।
    सुविधा केंद्र ने सही विभाग में आवेदन
    दिलाया और 1 महीने में राशि मिल गई।`,
    benefit: "₹18,000 छात्रवृत्ति जारी"
  }
];


export default function Page() {
    useTitle("जनसेवा के परिणाम");
  const [activeFilter, setActiveFilter] = useState("all");
  useEffect(() => {
    const counters = document.querySelectorAll(`.${styles.statNum}`);

    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;

      const update = () => {
        const increment = target / 60;

        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(update);
        } else {
          counter.innerText = target + "+";
        }
      };

      update();
    });
  }, []);


  useTitle("Success Stories");
  return (
    <>
      {/* HERO */}
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
            जनसेवा के परिणाम
          </Heading>

          <Text
            mt={2}
            opacity={0.9}
            fontSize={{ base: "sm", md: "md" }}
          >
            सुहर काम में दिखता है जनसेवा का संकल्प
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

        {/* INTRO */}
        <div className={styles.intro}>
          <div className={styles.pill}>जनसेवा के परिणाम</div>
          <h2>जब <strong className={styles["text-orange"]}>सुविधा केंद्र</strong> बना बदलाव का माध्यम</h2>
          <p>
            सांसद सुविधा केंद्र, सतना-मैहर लोकसभा क्षेत्र के नागरिकों तक मूलभूत सुविधाएं पहुंचाने एवं व्यक्तिगत अथवा सामूहिक समस्याओं के त्वरित निराकरण के लिए प्रतिबद्ध है। ये हैं जनसेवा के वास्तविक परिणाम।
          </p>
        </div>
        {/* STATS */}
        <div className={styles.statsRow}>
          <div className={styles.statCard} style={{ "--accent": "#FE6700" }}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statNum} data-target="1200">0</div>
            <div className={styles.statLabel}>नागरिकों की सहायता</div>
          </div>

          <div className={styles.statCard} style={{ "--accent": "#11A400" }}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statNum} data-target="950">0</div>
            <div className={styles.statLabel}>समस्याएं निराकृत</div>
          </div>

          <div className={styles.statCard} style={{ "--accent": "#0074D1" }}>
            <div className={styles.statIcon}>🏘️</div>
            <div className={styles.statNum} data-target="48">0</div>
            <div className={styles.statLabel}>गांव व वार्ड लाभान्वित</div>
          </div>
        </div>
        <div className={styles.featuredStory}>

          <div className={styles.featuredStoryText}>
            <div className={styles.featuredStoryLabel}>🇮🇳 विशेष परिणाम</div>

            <blockquote className={styles.featuredStoryQuote}>
              सांसद सुविधा केंद्र से जुड़ने के बाद हमारे गांव में
              पीने के पानी की समस्या का समाधान मात्र 15 दिनों में
              हो गया। पहले हम महीनों दफ्तर के चक्कर लगाते थे।
            </blockquote>

            <div className={styles.featuredStoryPerson}>
              <div className={styles.featuredStoryAvatar}>👨‍🌾</div>

              <div className={styles.featuredStoryPersonInfo}>
                <strong>रामप्रसाद यादव</strong>
                <span>ग्राम — रजौला, सतना</span>
              </div>
            </div>
          </div>

          <div className={styles.featuredStoryVisual}>
            <div className={styles.featuredStoryImpactCard}>
              <div className={styles.impactNum}>15</div>

              <div className={styles.impactLabel}>
                दिनों में समाधान<br />जल आपूर्ति समस्या
              </div>

              <div className={styles.impactBadges}>
                <span className={styles.impactBadge}>✅ निराकृत</span>
                <span className={styles.impactBadge}>💧 जल योजना</span>
                <span className={styles.impactBadge}>🏘️ सामूहिक</span>
              </div>
            </div>
          </div>

        </div>


        <div className={styles.filterBar}>
          <button
            className={`${styles.filterBtn} ${activeFilter === "all" ? styles.active : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            सभी
          </button>

          <button
            className={`${styles.filterBtn} ${activeFilter === "suvidha" ? styles.active : ""}`}
            onClick={() => setActiveFilter("suvidha")}
          >
            सुविधा प्राप्ति
          </button>

          <button
            className={`${styles.filterBtn} ${activeFilter === "samasya" ? styles.active : ""}`}
            onClick={() => setActiveFilter("samasya")}
          >
            समस्या निराकरण
          </button>

          <button
            className={`${styles.filterBtn} ${activeFilter === "yojana" ? styles.active : ""}`}
            onClick={() => setActiveFilter("yojana")}
          >
            सरकारी योजना
          </button>

          <button
            className={`${styles.filterBtn} ${activeFilter === "infra" ? styles.active : ""}`}
            onClick={() => setActiveFilter("infra")}
          >
            बुनियादी ढांचा
          </button>
        </div>

        {/* STORIES */}
        <div className={styles.storiesGrid}>
          {stories
            .filter(item => activeFilter === "all" || item.cat === activeFilter)
            .map(item => (
              <div
                key={item.id}
                className={styles.storyCard}
                style={{ "--cat-color": item.color }}
              >
                <div className={styles.storyCardHeader}>
                  <div className={styles.storyCardAvatar}>{item.avatar}</div>

                  <div className={styles.storyCardMeta}>
                    <div className={styles.storyCardName}>{item.name}</div>
                    <div className={styles.storyCardLocation}>{item.location}</div>
                  </div>

                  <span className={styles.storyCardBadge}>{item.badge}</span>
                </div>

                <div className={styles.storyCardBody}>
                  <div className={styles.storyCardScheme}>{item.scheme}</div>

                  <p className={styles.storyCardQuote}>{item.quote}</p>
                </div>

                <div className={styles.storyCardFooter}>
                  <span className={styles.storyCardBenefit}>
                    लाभ: <strong>{item.benefit}</strong>
                  </span>

                  <span className={styles.storyCardStars}>🇮🇳🇮🇳🇮🇳🇮🇳🇮🇳</span>
                </div>
              </div>
            ))}
        </div>

        <div className={styles.cta}>
          <h2>
            आप भी पाएं जनसेवा का लाभ —<br />
            सुविधाएं बस एक कदम दूर
          </h2>

          <p>
            सांसद सुविधा केंद्र से जुड़ें। किसी भी सरकारी सुविधा की प्राप्ति
            अथवा समस्या के निराकरण हेतु अपना <strong>आधार कार्ड</strong> एवं
            <strong> वोटर आईडी कार्ड</strong> साथ लेकर आएं।
          </p>

          <div className={styles.ctaBtns}>
            <a href="/govt-schemes" className={`${styles.btn} ${styles.btnDark}`}>
              📋 सरकारी योजनाएं देखें
            </a>

            <a href="/contact" className={`${styles.btn} ${styles.btnOutline}`}>
              📞 संपर्क करें
            </a>
          </div>
        </div>
      </main>
    </>
  );
}