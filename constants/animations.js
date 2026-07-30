export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: {
    once: true,
    amount: 0.2,
  },
  transition: {
    duration: 0.6,
    ease: "easeOut",
  },
};