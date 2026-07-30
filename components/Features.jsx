import { motion } from "framer-motion";
import { fadeUp } from "../constants/animations";

import { featureData } from "../data/featureData";
import styles from "./Features.module.css";

const Features = () => {
  return (
    <motion.section id="about" className={styles.card} {...fadeUp}>
      {/* Top accent */}
      <div className={styles.topAccent} />

      {/* Background */}
      <div className={styles.bgWrapper}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div
          className={styles.dotPattern}
          style={{
            backgroundImage:
              "radial-gradient(rgba(120,93,33,0.6) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
      </div>

      {/* Intro */}
      <div className={styles.introRow}>
        {/* Left Content */}
        <div className={styles.leftContent}>
          <span className={styles.badge}>
            <span className={styles.pingWrap}>
              <span className={styles.pingOuter} />
              <span className={styles.pingInner} />
            </span>
            {featureData.badge}
          </span>

          <h2 className={styles.title}>{featureData.title}</h2>

          <div className={styles.divider} />

          <p className={styles.description}>{featureData.description}</p>
        </div>

        {/* Leader Card */}
        <div className={styles.leaderCardWrap}>
          <div className={styles.leaderCard}>
            <div className={styles.leaderBlob1} />
            <div className={styles.leaderBlob2} />

            <img
              src={featureData.leader.image}
              alt={featureData.leader.name}
              className={styles.leaderImage}
            />

            <h3 className={styles.leaderName}>{featureData.leader.name}</h3>

            <p className={styles.leaderDesignation}>
              {featureData.leader.designation}
            </p>

            <div className={styles.leaderDividerLine} />

            <p className={styles.leaderText}>
              जनसेवा के प्रति समर्पित नेतृत्व, जो सतना-मैहर लोकसभा क्षेत्र के प्रत्येक
              नागरिक तक विकास एवं मूलभूत सुविधाएँ पहुँचाने के लिए निरंतर कार्यरत है।
            </p>
          </div>
        </div>
      </div>

      {/* Priority */}
      <div className={styles.priorityBox}>
        <div className={styles.priorityBar} />

        <div className={styles.priorityRow}>
          <span className={styles.priorityIcon}>
            {featureData.priority.icon}
          </span>

          <div>
            <h3 className={styles.priorityTitle}>
              {featureData.priority.title}
            </h3>

            <p className={styles.priorityDescription}>
              {featureData.priority.description}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Features;
