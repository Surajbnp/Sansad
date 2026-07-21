"use client";

import React, { useEffect, useRef, useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');

  .ts-wrap {
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem;
    font-family: 'DM Sans', 'Noto Sans Devanagari', sans-serif;
  }

  .ts-card {
    padding: 2rem 1.75rem;
    width: 100%;
    max-width: 440px;
              border:1px solid rgba(250,118,2,0.12);

  }

  /* header */
  .ts-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  .ts-header-icon {
    width: 32px;
    height: 32px;
    background: #fff4ea;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .ts-title {
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
  }
  .ts-subtitle {
    text-align: center;
    font-size: 13px;
    color: #bbb;
    margin-bottom: 1.5rem;
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-weight: 400;
  }

  /* progress */
  .ts-progress {
    display: flex;
    gap: 6px;
    margin-bottom: 1.75rem;
  }
  .ts-seg {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: #f0ede8;
    transition: background 0.35s ease;
  }
  .ts-seg.active { background: #fa7602; }

  /* error */
  .ts-error {
    font-size: 13px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #fff1f1;
    color: #c0392b;
    border: 1px solid #fcd5d5;
    margin-bottom: 1rem;
    font-family: 'Noto Sans Devanagari', 'DM Sans', sans-serif;
    line-height: 1.5;
  }

  /* form fields */
  .ts-field { margin-bottom: 1rem; }
  .ts-label {
    display: flex;
    align-items: baseline;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 6px;
  }
  .ts-label-hi {
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-size: 12px;
    font-weight: 400;
    text-transform: none;
    letter-spacing: 0;
    color: #ccc;
  }
  .ts-input {
    width: 100%;
    height: 42px;
    padding: 0 12px;
    font-size: 14px;
    font-family: 'DM Sans', 'Noto Sans Devanagari', sans-serif;
    border: 1.5px solid #ede9e3;
    border-radius: 10px;
    background: #fafaf8;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .ts-input::placeholder { color: #ccc; font-family: 'Noto Sans Devanagari', 'DM Sans', sans-serif; }
  .ts-input:focus {
    border-color: #fa7602;
    box-shadow: 0 0 0 3px rgba(250,118,2,0.1);
    background: #fff;
  }

  /* button */
  .ts-btn {
    width: 100%;
    height: 48px;
    background: #fa7602;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
  }
  .ts-btn-en {
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    line-height: 1.2;
  }
  .ts-btn-hi {
    font-size: 11px;
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-weight: 400;
    opacity: 0.8;
    line-height: 1.2;
  }
  .ts-btn:hover { opacity: 0.9; }
  .ts-btn:active { transform: scale(0.98); }
  .ts-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* OTP */
  .ts-otp-hint {
    font-size: 13px;
    color: #666;
    text-align: center;
    margin-bottom: 2px;
    font-family: 'DM Sans', sans-serif;
  }
  .ts-otp-hint b { color: #1a1a1a; }
  .ts-otp-hint-hi {
    font-size: 12px;
    color: #bbb;
    text-align: center;
    margin-bottom: 1.25rem;
    font-family: 'Noto Sans Devanagari', sans-serif;
  }
  .ts-otp-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .ts-otp-cell {
    width: 44px;
    height: 52px;
    text-align: center;
    font-size: 22px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    border: 1.5px solid #ede9e3;
    border-radius: 10px;
    background: #fafaf8;
    color: #1a1a1a;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    caret-color: #fa7602;
  }
  .ts-otp-cell:focus {
    border-color: #fa7602;
    box-shadow: 0 0 0 3px rgba(250,118,2,0.1);
    background: #fff;
  }

  /* resend */
  .ts-resend-row { text-align: center; margin-top: 10px; }
  .ts-resend-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
    transition: background 0.15s;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
  }
  .ts-resend-btn:hover:not(:disabled) { background: #fff4ea; }
  .ts-resend-btn:disabled { cursor: default; }
  .ts-resend-en {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #fa7602;
    font-weight: 500;
  }
  .ts-resend-hi {
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-size: 11px;
    color: #fa7602;
    opacity: 0.7;
  }
  .ts-resend-btn:disabled .ts-resend-en,
  .ts-resend-btn:disabled .ts-resend-hi { color: #bbb; opacity: 1; }

  /* ticket result */
  .ts-verified-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #e8f7ef;
    color: #1e8449;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px 3px 8px;
    border-radius: 20px;
    margin-bottom: 1rem;
  }
  .ts-verified-badge span { font-family: 'Noto Sans Devanagari', sans-serif; font-weight: 400; opacity: 0.8; }
  .ts-meta { margin-bottom: 0.75rem; }
  .ts-meta-id { font-size: 15px; font-weight: 600; color: #1a1a1a; font-family: 'DM Sans', sans-serif; }
  .ts-meta-date {
    font-size: 12px;
    color: #aaa;
    margin-top: 3px;
    font-family: 'Noto Sans Devanagari', sans-serif;
  }
  .ts-divider { border: none; border-top: 1px solid #f0ede8; margin: 1rem 0; }

  /* timeline */
  .ts-timeline { display: flex; flex-direction: column; }
  .ts-tl-item { display: flex; gap: 12px; position: relative; }
  .ts-tl-item:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 11px; top: 26px; bottom: -4px;
    width: 1px;
    background: #f0ede8;
  }
  .ts-tl-dot {
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 10px; font-weight: 700;
    z-index: 1; margin-top: 1px;
  }
  .ts-tl-dot.done    { background: #e8f7ef; color: #27ae60; }
  .ts-tl-dot.current { background: #fa7602; color: #fff; }
  .ts-tl-dot.idle    { background: #f5f4f2; color: #bbb; border: 1px solid #ede9e3; }
  .ts-tl-body { padding-bottom: 20px; flex: 1; min-width: 0; }
  .ts-tl-en {
    font-size: 14px; font-weight: 500; color: #1a1a1a;
    font-family: 'DM Sans', sans-serif;
  }
  .ts-tl-en.current { color: #fa7602; font-weight: 600; }
  .ts-tl-hi {
    font-size: 12px; color: #aaa; margin-top: 1px;
    font-family: 'Noto Sans Devanagari', sans-serif;
  }
  .ts-tl-hi.current { color: #f9a55a; }
  .ts-tl-remark {
    font-size: 12px; color: #999; margin-top: 3px; line-height: 1.5;
    font-family: 'Noto Sans Devanagari', 'DM Sans', sans-serif;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ts-animate { animation: slideUp 0.25s ease both; }
`;

/* ── Hindi status translations ── */
const STATUS_HI = {
  "Ticket Received": "टिकट प्राप्त हुआ",
  "Under Review": "समीक्षाधीन है",
  "In Progress": "प्रक्रिया में है",
  "Awaiting Response": "उत्तर की प्रतीक्षा",
  Resolved: "समाधान हो गया",
  Closed: "बंद किया गया",
  Reopened: "पुनः खोला गया",
  Escalated: "एस्केलेट किया गया",
};
const toHi = (s) => STATUS_HI[s] || "";

/* ── OTP Input ── */
const OtpInput = ({ onChange }) => {
  const refs = useRef([]);

  const bubble = () =>
    onChange(refs.current.map((el) => el?.value || "").join(""));

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    e.target.value = val;
    if (val && i < 5) refs.current[i + 1]?.focus();
    bubble();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !e.target.value && i > 0)
      refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    paste.split("").forEach((c, j) => {
      if (refs.current[j]) refs.current[j].value = c;
    });
    refs.current[Math.min(paste.length, 5)]?.focus();
    bubble();
  };

  return (
    <div className="ts-otp-row">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="ts-otp-cell"
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

/* ── Main Page ── */
const Page = () => {
  const [step, setStep] = useState(1);
  const [ticketId, setTicketId] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (step !== 2 || resendTimer === 0) return;
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer, step]);

  const sendOtp = async (e) => {
    e?.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, ticketId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setError(err.message || "OTP भेजने में विफल। कृपया पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e?.preventDefault();
    if (otp.length < 6) {
      setError("कृपया 6 अंकों का OTP दर्ज करें।");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ticket/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTicket(data.ticket);
      setStep(3);
    } catch (err) {
      setError(err.message || "OTP गलत है। पुनः प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  const steps = ticket?.statusHistory || [];
  const activeStep = steps.length - 1;

  return (
    <>
      <style>{css}</style>
      <div className="ts-wrap">
        <div className="ts-card">
          {/* Header */}
          <div className="ts-header">
            <div className="ts-header-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fa7602"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <span className="ts-title">Ticket Status</span>
          </div>
          <p className="ts-subtitle">टिकट की स्थिति जांचें</p>

          {/* Progress */}
          <div className="ts-progress">
            <div className={`ts-seg ${step >= 1 ? "active" : ""}`} />
            <div className={`ts-seg ${step >= 2 ? "active" : ""}`} />
            <div className={`ts-seg ${step >= 3 ? "active" : ""}`} />
          </div>

          {/* Error */}
          {error && <div className="ts-error">{error}</div>}

          {/* ── Step 1: details ── */}
          {step === 1 && (
            <div className="ts-animate">
              <form onSubmit={sendOtp}>
                <div className="ts-field">
                  <label className="ts-label">
                    Ticket ID <span className="ts-label-hi">· टिकट नंबर</span>
                  </label>
                  <input
                    className="ts-input"
                    type="text"
                    placeholder="जैसे TKT-10042"
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    required
                  />
                </div>
                <div className="ts-field">
                  <label className="ts-label">
                    Phone Number{" "}
                    <span className="ts-label-hi">· मोबाइल नंबर</span>
                  </label>
                  <input
                    className="ts-input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <button className="ts-btn" type="submit" disabled={loading}>
                  <span className="ts-btn-en">
                    {loading ? "भेज रहे हैं…" : "Get OTP →"}
                  </span>
                  {!loading && (
                    <span className="ts-btn-hi">OTP मोबाइल पर भेजें</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === 2 && (
            <div className="ts-animate">
              <p className="ts-otp-hint">
                OTP sent to <b>{phone}</b>
              </p>
              <p className="ts-otp-hint-hi">आपके मोबाइल पर OTP भेजा गया है</p>
              <OtpInput onChange={setOtp} />
              <button
                className="ts-btn"
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
              >
                <span className="ts-btn-en">
                  {loading ? "जाँच रहे हैं…" : "Verify & View Status →"}
                </span>
                {!loading && (
                  <span className="ts-btn-hi">
                    OTP सत्यापित करें और स्थिति देखें
                  </span>
                )}
              </button>
              <div className="ts-resend-row">
                <button
                  className="ts-resend-btn"
                  disabled={resendTimer > 0}
                  onClick={sendOtp}
                >
                  {resendTimer > 0 ? (
                    <>
                      <span className="ts-resend-en">
                        Resend in {resendTimer}s
                      </span>
                      <span className="ts-resend-hi">
                        {resendTimer} सेकंड में पुनः भेजें
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="ts-resend-en">Resend OTP</span>
                      <span className="ts-resend-hi">OTP दोबारा भेजें</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: result ── */}
          {step === 3 && ticket && (
            <div className="ts-animate">
              <div className="ts-verified-badge">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1e8449"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Verified &nbsp;<span>· सत्यापित</span>
              </div>
              <div className="ts-meta">
                <div className="ts-meta-id">Ticket #{ticket._id}</div>
                <div className="ts-meta-date">
                  अंतिम अपडेट:{" "}
                  {new Date(ticket.updatedAt).toLocaleString("hi-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </div>
              </div>
              <hr className="ts-divider" />
              <div className="ts-timeline">
                {steps.map((item, i) => {
                  const isCurrent = i === activeStep;
                  const isDone = i < activeStep;
                  const hi = toHi(item.status);
                  return (
                    <div key={item._id || i} className="ts-tl-item">
                      <div
                        className={`ts-tl-dot ${isDone ? "done" : isCurrent ? "current" : "idle"}`}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                      <div className="ts-tl-body">
                        <div
                          className={`ts-tl-en ${isCurrent ? "current" : ""}`}
                        >
                          {item.status}
                        </div>
                        {hi && (
                          <div
                            className={`ts-tl-hi ${isCurrent ? "current" : ""}`}
                          >
                            {hi}
                          </div>
                        )}
                        {item.remarks && (
                          <div className="ts-tl-remark">{item.remarks}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
