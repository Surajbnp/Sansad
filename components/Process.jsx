import { motion } from "framer-motion";
import styles from "./Process.module.css";

const steps = [
  {
    title: "चरण 1 — समस्या रजिस्टर करते हुए अपनी समस्या दर्ज करें",
    image: "./SSK-Satna_Point1.webp",
  },
  {
    title: "चरण 2 — समस्या का आकलन करते हुए संबन्धित विभाग को प्रेषण",
    image: "./SSK-Satna_Point2.webp",
  },
  {
    title: "चरण 3 — समस्या का चरणबद्ध अपडेट तथा निवारण",
    image: "./SSK-Satna_Point3.webp",
  },
];

export default function Process() {
  return (
    <section id="process" className={styles.section}>
      <motion.div
        className={styles.headerWrap}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className={styles.badge}>✨ सरल प्रक्रिया</span>

        <h2 className={styles.heading}>
          तीन आसान चरणों में पूरी शिकायत प्रक्रिया
        </h2>

        <p className={styles.subtext}>
          नागरिकों के लिए सहज शिकायत पंजीकरण, पारदर्शी ट्रैकिंग तथा समयबद्ध
          समाधान की सरल प्रक्रिया।
        </p>
      </motion.div>

      <div className={styles.stepsRow}>
        {steps.map((step) => (
          <motion.div
            key={step.title}
            whileHover={{ y: -8, scale: 1.03 }}
            transition={{ duration: 0.35 }}
            className={styles.stepCard}
          >
            <div className={styles.imageWrap}>
              <img src={step.image} alt={step.title} className={styles.stepImage} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
