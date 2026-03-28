"use client";

import { useEffect, useRef, useState } from "react";

export default function InstallPrompt() {
  const deferredPromptRef = useRef(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);

    if (ios) {
      setIsIOS(true);
      setShow(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (!prompt) return;
    prompt.prompt();
    await prompt.userChoice;
    deferredPromptRef.current = null;
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <img src="/icons/icon1.png" alt="Install" />
          </div>
          <p style={styles.appName}>Satna Portal</p>
          <p style={styles.appUrl}>www.ssksatna.com/</p>
        </div>

        {/* Body */}
        <div style={styles.body}>
          <p style={styles.desc}>
            Add to your home screen for instant access — works like a native
            app, no browser needed.
          </p>

          {/* Feature list */}
          <div style={styles.featureBox}>
            {["Works offline", "Faster loading", "Full screen experience"].map(
              (f) => (
                <div key={f} style={styles.featureRow}>
                  <div style={styles.checkCircle}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span style={styles.featureText}>{f}</span>
                </div>
              ),
            )}
          </div>

          {/* iOS instructions */}
          {isIOS && (
            <div style={styles.iosBox}>
              <p style={styles.iosStep}>
                <strong>1.</strong> Tap the <strong>Share</strong> button at the
                bottom of Safari
              </p>
              <p style={styles.iosStep}>
                <strong>2.</strong> Scroll and tap{" "}
                <strong>Add to Home Screen</strong>
              </p>
              <p style={styles.iosStep}>
                <strong>3.</strong> Tap <strong>Add</strong> to confirm
              </p>
            </div>
          )}

          {/* Buttons */}
          {!isIOS && (
            <button onClick={handleInstall} style={styles.installBtn}>
              Add to Home Screen
            </button>
          )}
          <button onClick={() => setShow(false)} style={styles.cancelBtn}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

const BROWN = "#7a481d";

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: "16px",
  },
  card: {
    width: "100%",
    maxWidth: "300px",
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    border: "0.5px solid #e5e0d8",
  },
  header: {
    background: BROWN,
    padding: "28px 20px 20px",
    textAlign: "center",
  },
  iconWrap: {
    width: "64px",
    height: "64px",
    margin: "0 auto 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    color: "rgba(255,255,255,0.95)",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 4px",
  },
  appUrl: {
    color: "rgba(255,255,255,0.55)",
    fontSize: "12px",
    margin: 0,
  },
  body: {
    padding: "20px",
  },
  desc: {
    fontSize: "13px",
    color: "#555",
    textAlign: "center",
    margin: "0 0 16px",
    lineHeight: "1.6",
  },
  featureBox: {
    background: "#fdf8f3",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
    border: "0.5px solid #f0e8df",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  featureRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  checkCircle: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: BROWN,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  featureText: {
    fontSize: "12px",
    color: "#444",
  },
  iosBox: {
    background: "#fdf8f3",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
    border: "0.5px solid #f0e8df",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  iosStep: {
    fontSize: "12px",
    color: "#555",
    margin: 0,
    lineHeight: "1.5",
  },
  installBtn: {
    width: "100%",
    padding: "12px",
    background: BROWN,
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "8px",
    letterSpacing: "0.01em",
  },
  cancelBtn: {
    width: "100%",
    padding: "11px",
    background: "transparent",
    color: "#888",
    border: "0.5px solid #ddd",
    borderRadius: "10px",
    fontSize: "13px",
    cursor: "pointer",
  },
};
