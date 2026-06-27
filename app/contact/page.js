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
import styles from "./contact.module.css";
import Link from "next/link";

export default function Contact() {
  useTitle("संपर्क करें | सांसद सुविधा केंद्र – सतना-मैहर");
  return (
    <Box>

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
            fontSize="sm"
            letterSpacing="2px"
            bg="rgba(255,255,255,0.22)"
            display="inline-block"
            px={4}
            py={1}
            borderRadius="full"
            mb={4}
            fontWeight="bold"
            border="1px solid rgba(255,255,255,0.4)"
             className="hindiText"
          >
            सतना-मैहर लोकसभा क्षेत्र
          </Text>

          <Heading
            fontSize={{ base: "2xl", md: "5xl" }}
            mb={4}
            className="hindiText"
          >
            संपर्क करें
          </Heading>

          <Text
            mt={2}
            opacity={0.9}
            fontSize={{ base: "lg", md: "lg" }}
            className="hindiText"
          >
            आपकी शिकायत, हमारी जिम्मेदारी
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
        {/* CONTENT SECTION */}
        <div className={styles.intro}>
          <div className={`${styles.introBody} ${styles.fadeUp}`}>

            <div className={styles.pill}>शिकायत दर्ज करें</div>

            <h2>
              अपनी <em>शिकायत दर्ज करें</em>
            </h2>

            <p>
              किसी भी व्यक्तिगत अथवा सामूहिक समस्या का त्वरित निराकरण पाने के लिए
              नीचे दिए गए माध्यमों से अपनी शिकायत दर्ज करें।
              शिकायत दर्ज कराते समय अपना <strong>आधार कार्ड</strong> एवं{" "}
              <strong>वोटर आईडी कार्ड</strong> साथ अवश्य रखें।
            </p>

          </div>
        </div>


        <div className={`${styles.addressBlock} ${styles.fadeUp}`}>

          {/* LEFT */}
          <div className={styles.addressBlockText}>
            <div className={styles.addressBlockLabel}>🏛️ कार्यालय का पता</div>

          <h2 className={styles.addressBlockName}>
  सांसद सुविधा केंद्र
  <br />
  <span
    style={{
      fontSize: "1.0em",
      fontWeight: 500,
      color: "#fffff",
      display: "block",
      margin: "8px 0",
      lineHeight: 1.5,
    }}
  >
    माननीय सांसद श्री गणेश सिंह जी का संसदीय कार्यालय
  </span>
  सतना
</h2>

            <div className={styles.addressBlockLines}>

              <div className={styles.addressLine}>
                <div className={styles.addressLineIcon}>🏠</div>
                <div className={styles.addressLineText}>
                  <strong>पता</strong><br />
                  फ्रेंड्स कॉलोनी, यादव पेट्रोल पंप के सामने<br />
                  पहली गली, बिरला रोड<br />
                  सतना – 485001, मध्य प्रदेश
                </div>
              </div>

              <div className={styles.addressLine}>
                <div className={styles.addressLineIcon}>📞</div>
                <div className={styles.addressLineText}>
                  <strong>Phone</strong><br />
                  <a href="tel:+919425172508">+91 94251 72508</a>
                </div>
              </div>

              <div className={styles.addressLine}>
                <div className={styles.addressLineIcon}>✉️</div>
                <div className={styles.addressLineText}>
                  <strong>Email</strong><br />
                  <a href="mailto:satnassk@gmail.com">
                    satnassk@gmail.com
                  </a>
                </div>
              </div>

              <div className={styles.addressLine}>
                <div className={styles.addressLineIcon}>🕐</div>
                <div className={styles.addressLineText}>
                  <strong>कार्यालय समय</strong><br />
                  सोमवार – शनिवार<br />
                  प्रातः 10:00 – सायं 5:00
                </div>
              </div>

              <div className={styles.addressLine}>
                <div className={styles.addressLineIcon}>🌐</div>
                <div className={styles.addressLineText}>
                  <strong>Website</strong><br />
                  <a href="https://ssksatna.com" target="_blank">
                    ssksatna.com
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT MAP */}
          <div className={styles.addressBlockMap}>
            <div className={styles.mapEmbed}>

              <iframe
                src="https://maps.google.com/maps?q=Friends+Colony+Birla+Road+Satna+Madhya+Pradesh+485001&output=embed&z=15"
                title="सांसद सुविधा केंद्र का कार्यालय"
                loading="lazy"
              />

              <div className={styles.mapEmbedFooter}>
                <div className={styles.mapEmbedAddr}>
                  फ्रेंड्स कॉलोनी, बिरला रोड<br />
                  सतना – 485001, म.प्र.
                </div>

                <a
                  href="https://maps.google.com/?q=Friends+Colony+Birla+Road+Satna+Madhya+Pradesh+485001"
                  target="_blank"
                  className={styles.mapEmbedBtn}
                >
                  📍 Google Maps पर खोलें
                </a>
              </div>

            </div>
          </div>

        </div>

        <div className={`${styles.reachStrip} ${styles.fadeUp}`}>

          {/* TEXT */}
          <div className={styles.reachStripText}>
            <h3>अभी शिकायत दर्ज करें — हम तैयार हैं</h3>

            <p>
              किसी भी व्यक्तिगत या सामूहिक समस्या के त्वरित निराकरण हेतु
              फोन करें या ईमेल पर अपनी शिकायत भेजें।<br />
              <strong>आधार कार्ड</strong> एवं <strong>वोटर आईडी कार्ड</strong> साथ अवश्य रखें।
            </p>
          </div>

          {/* ACTIONS */}
          <div className={styles.reachStripActions}>

            <a
              href="tel:+919425172508"
              className={`${styles.reachBtn} ${styles.reachBtnCall}`}
            >
              📞 +91 94251 72508
            </a>

            <a
              href="mailto:satnassk@gmail.com"
              className={`${styles.reachBtn} ${styles.reachBtnMail}`}
            >
              ✉️ satnassk@gmail.com
            </a>

          </div>

        </div>

        <div className={`${styles.cta} ${styles.fadeUp}`}>

          <h2>
            आपकी समस्या का निराकरण —<br />
            बस एक कदम दूर
          </h2>

          <p>
            सतना-मैहर लोकसभा क्षेत्र के नागरिक अपनी किसी भी व्यक्तिगत
            अथवा सामूहिक समस्या को सांसद सुविधा केंद्र में दर्ज कराएं।
            हम आपकी शिकायत संबंधित विभाग तक पहुंचाकर त्वरित निराकरण सुनिश्चित करेंगे।
          </p>

          <ul className={styles.ctaBtns}>
            <li>
              <Link href="/govt-schemes" className={`${styles.btn} ${styles.btnDark}`}>
                📋 सरकारी योजनाएं देखें
              </Link>
            </li>

            <li>
              <Link href="/about" className={`${styles.btn} ${styles.btnOutline}`}>
                हमारे बारे में
              </Link>
            </li>
          </ul>

        </div>
      </main>
    </Box>
  );
}