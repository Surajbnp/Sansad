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

import styles from "./about.module.css";
import Link from "next/link";
import { useTitle } from "@/hooks/useTitle";
export default function AboutPage() {
  useTitle("हमारे बारे में");
  return (
    <Box bg="#FFF8F2">

      {/* 🔥 HERO */}
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
            हमारे बारे में
          </Heading>

          <Text
            mt={2}
            opacity={0.9}
            fontSize={{ base: "sm", md: "md" }}
          >
            सुविधाओं का लाभ - बस एक क्लिक दूर
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

        {/* ══ 1. INTRO ══ */}
        <div className={styles.intro}>
          <div className={`${styles.intro__body} ${styles["fade-up"]}`}>
            <div className={styles.pill}>परिचय</div>

            <h2>
              सांसद सुविधा केंद्र -<br />
              <em>क्यों और किसके लिए?</em>
            </h2>

            <p>
              सांसद सुविधा केंद्र, आप सभी <strong className={styles["text-orange"]}>सतना-मैहर लोकसभा क्षेत्र</strong> के
              क्षेत्रीय जनों तक <strong className={styles["text-orange"]}>मूलभूत सुविधाएं पहुंचाने</strong> एवं किसी भी
              प्रकार की व्यक्तिगत अथवा सामूहिक समस्या के <strong className={styles["text-orange"]}>त्वरित निराकरण</strong>
              के उद्देश्य से शुरू किया गया है।
            </p>
          </div>
        </div>

        {/* ══ 2. THREE CARDS ══ */}
        <div className={styles["cards-row"]}>

          <div className={`${styles["intro__card"]} ${styles["fade-up"]}`}>
            <div className={styles["intro__card__icon"]}>🤝</div>

            <h3>
              <strong>आपकी समस्या,<br />हमारी प्राथमिकता</strong>
            </h3>

            <p>
              चाहे समस्या <strong>व्यक्तिगत</strong> हो अथवा <strong>सामूहिक</strong> -
              सांसद सुविधा केंद्र हर क्षेत्रीय जन तक मूलभूत सुविधाएं पहुंचाने और
              समस्याओं का त्वरित निराकरण करने के लिए सदैव तत्पर है।
            </p>
          </div>

          <div className={`${styles.pillar} ${styles["pillar--suvidha"]} ${styles["fade-up"]}`}>
            <div className={styles["pillar__deco"]}>🏠</div>
            <div className={styles["pillar__icon"]}>🏠</div>

            <h3><strong>मूलभूत सुविधाएं पहुंचाना</strong></h3>

            <p>
              सतना-मैहर लोकसभा क्षेत्र के प्रत्येक क्षेत्रीय जन तक मूलभूत सुविधाएं
              सरल, सुलभ और सहज रूप से पहुंचाना इस केंद्र का प्रमुख उद्देश्य है।
              कोई भी नागरिक सुविधाओं से वंचित न रहे - यही हमारा संकल्प है।
            </p>
          </div>

          <div className={`${styles.pillar} ${styles["pillar--samasya"]} ${styles["fade-up"]}`}>
            <div className={styles["pillar__deco"]}>⚡</div>
            <div className={styles["pillar__icon"]}>⚡</div>

            <h3><strong>त्वरित समस्या निराकरण</strong></h3>

            <p>
              किसी भी प्रकार की व्यक्तिगत अथवा सामूहिक समस्या का त्वरित निराकरण -
              बिना देरी, बिना भटकाव। सांसद सुविधा केंद्र आपकी हर समस्या को
              प्राथमिकता से सुनता है और शीघ्र समाधान देता है।
            </p>
          </div>

        </div>

        {/* ══ 3. DOCUMENTS ══ */}
        <div className={styles["docs-section"]}>

          <div className={`${styles.pill} ${styles["center-pill"]}`}>
            📄 आवश्यक दस्तावेज
          </div>

          <h1><strong> फॉर्म भरने के लिए क्या लाएं?</strong></h1>

          <p className={styles.sub}>
            सुविधाओं की प्राप्ति अथवा समस्याओं के निराकरण हेतु फॉर्म भरने के लिए
            पहचान पत्र के रूप में अपना <strong className={styles["text-blue"]}>आधार कार्ड</strong> एवं
            <strong className={styles["text-blue"]}> वोटर आईडी कार्ड</strong> अवश्य रख लें।
          </p>

          <div className={styles["docs-grid"]}>

            <div
              className={`${styles["doc-card"]} ${styles["fade-up"]}`}
              style={{ "--accent": "#FF6B00" }}
            >
              <div className={styles["doc-card__body"]}>
                <h4 className={styles["text-blue"]}>आधार कार्ड</h4>
                <p>
                  सुविधाओं की प्राप्ति अथवा किसी भी समस्या के निराकरण हेतु फॉर्म
                  भरते समय पहचान पत्र के रूप में <strong className={styles["text-blue"]}>आधार कार्ड अवश्य साथ रखें।</strong>
                  यह आपकी पहचान का प्रमुख प्रमाण है।
                </p>
              </div>
            </div>

            <div
              className={`${styles["doc-card"]} ${styles["fade-up"]}`}
              style={{ "--accent": "#138808" }}
            >
              <div className={styles["doc-card__body"]}>
                <h4 className={styles["text-blue"]}>वोटर आईडी कार्ड</h4>
                <p>
                  पहचान पत्र के रूप में <strong className={styles["text-blue"]}>वोटर आईडी कार्ड</strong> भी अनिवार्य
                  रूप से साथ रखें। यह इस बात की पुष्टि करता है कि आप
                  सतना-मैहर लोकसभा क्षेत्र के निवासी हैं।
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ══ 4. CTA ══ */}
        <div className={`${styles.cta} ${styles["fade-up"]}`}>

          <h2>
            सांसद सुविधा केंद्र से अब आपके लिए<br />
            सुविधाओं का लाभ है बस एक क्लिक दूर...
          </h2>

          <p>
            सतना-मैहर लोकसभा क्षेत्र के क्षेत्रीय जन —
            अपना <strong>आधार कार्ड</strong> एवं <strong>वोटर आईडी कार्ड</strong> साथ रखें
            और मूलभूत सुविधाओं का लाभ उठाएं अथवा अपनी किसी भी व्यक्तिगत या
            सामूहिक समस्या का त्वरित निराकरण पाएं।
          </p>

          <div className={styles["cta__btns"]}>

            <Link href="/govt-schemes" className={`${styles.btn} ${styles["btn--dark"]}`}>
              📋 सरकारी योजनाएं देखें
            </Link>

            <Link href="/contact" className={`${styles.btn} ${styles["btn--outline"]}`}>
              📞 संपर्क करें
            </Link>

          </div>
        </div>

      </main>

    </Box>
  );
}