// components/home/CallToAction.jsx

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, LogIn, FileText, ArrowRight } from "lucide-react";
import styles from "./CallToAction.module.css";

export default function CallToAction({ fadeUp }) {
  return (
    <motion.section id="#contact" {...fadeUp} className={styles.section}>
      {/* Background */}
      <div className={styles.bgWrap}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.radialOverlay} />
      </div>

      <div className={styles.contentRow}>
        {/* Left */}
        <div>
          <span className={styles.badge}>तैयार हैं?</span>

          <h2 className={styles.heading}>
            सांसद सुविधा केंद्र से अब आपके लिए
            <span className={styles.headingGradientSpan}>
              सुविधाओं का लाभ बस एक क्लिक दूर...
            </span>
          </h2>

          <p className={styles.description}>
            सतना-मैहर लोकसभा क्षेत्र के क्षेत्रीय जन अपना आधार कार्ड एवं
            वोटर आईडी कार्ड साथ रखें और मूलभूत सुविधाओं का लाभ उठाएं अथवा
            अपनी किसी भी व्यक्तिगत या सामूहिक समस्या का त्वरित निराकरण पाएं।
          </p>

          <div className={styles.buttonsRow}>
            <Link href="/signup" className={styles.primaryBtn}>
              <FileText size={18} />
              शिकायत दर्ज करें
              <ArrowRight size={16} className={styles.primaryBtnArrow} />
            </Link>

            <Link href="/login" className={styles.secondaryBtn}>
              <LogIn size={18} />
              लॉगिन करें
            </Link>
          </div>
        </div>

        {/* Right */}
        <div>
          <div className={styles.infoCard}>
            <div className={styles.phoneRow}>
              <div className={styles.phoneIconWrap}>
                <Phone size={24} />
              </div>

              <div>
                <p className={styles.helplineLabel}>हेल्पलाइन</p>

                <a href="tel:+919238859999" className={styles.helplineNumber}>
                  +91 92388 59999
                </a>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.noteBox}>
              <p className={styles.noteText}>
                शिकायत दर्ज करने से पहले अपना{" "}
                <span className={styles.noteHighlight}>आधार कार्ड</span> एवं{" "}
                <span className={styles.noteHighlight}>वोटर आईडी कार्ड</span>{" "}
                तैयार रखें।
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
