import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CRIMSON = "#9B1B1B";

function decodeData() {
  try {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("d");
    if (!d) return null;
    return JSON.parse(decodeURIComponent(escape(atob(d))));
  } catch {
    return null;
  }
}

function formatDate(iso) {
  if (!iso) return "____________";
  const [y, m, day] = iso.split("-");
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[parseInt(m) - 1]} ${parseInt(day)}, ${y}`;
}

function SignaturePad({ onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#1a1a5e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const p = getPos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const move = (e) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const p = getPos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    hasInk.current = true;
  };

  const end = () => {
    if (drawing.current && hasInk.current) {
      onChange(canvasRef.current.toDataURL("image/png"));
    }
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    hasInk.current = false;
    onChange("");
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600} height={180}
        style={{ width: "100%", height: 130, background: "#fff", border: "2px dashed #bbb", borderRadius: 8, touchAction: "none", cursor: "crosshair" }}
        onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
        onTouchStart={start} onTouchMove={move} onTouchEnd={end}
      />
      <button onClick={clear} style={{ marginTop: 8, background: "none", border: "1px solid #ccc", borderRadius: 6, padding: "6px 16px", fontSize: 13, color: "#666", cursor: "pointer" }}>
        Clear & Redo
      </button>
    </div>
  );
}

const h2Style = { fontSize: 15, fontWeight: 700, color: CRIMSON, margin: "22px 0 8px" };
const pStyle = { fontSize: 14, color: "#222", lineHeight: 1.7, margin: "0 0 6px" };
const lineVal = { fontWeight: 700, borderBottom: "1px solid #999", padding: "0 6px" };

export default function Contract() {
  const [c] = useState(decodeData);
  const [signature, setSignature] = useState("");
  const [printedName, setPrintedName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [signed, setSigned] = useState(false);
  const contractRef = useRef(null);

  if (!c) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontFamily: "sans-serif", padding: 20, textAlign: "center" }}>
        <p>This contract link is invalid or incomplete.<br />Please contact DJ Jon at 516-776-1997 for a new link.</p>
      </div>
    );
  }

  const today = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayStr = `${today.getDate()} day of ${months[today.getMonth()]}, ${today.getFullYear()}`;

  const downloadPDF = async () => {
    const el = contractRef.current;
    const canvas = await html2canvas(el, { scale: 2, backgroundColor: "#ffffff" });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "pt", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pageW) / canvas.width;
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(img, "PNG", 0, position, pageW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(img, "PNG", 0, position, pageW, imgH);
      heightLeft -= pageH;
    }
    pdf.save(`DJ_JON_Contract_${(c.clientName || "client").replace(/\s+/g, "_")}.pdf`);
  };

  const handleSign = async () => {
    if (!printedName.trim()) { alert("Please type your full legal name."); return; }
    if (!signature) { alert("Please draw your signature in the box."); return; }
    if (!agreed) { alert("Please check the box confirming you agree to the terms."); return; }

    setSending(true);
    try {
      const payload = {
        _subject: `SIGNED CONTRACT: ${c.clientName} — ${c.eventType} ${formatDate(c.eventDate)}`,
        "Document": "Professional DJ Service Agreement — SIGNED",
        "Signed On": new Date().toLocaleString(),
        "Client Name (Printed)": printedName,
        "Client": c.clientName,
        "Event Type": c.eventType,
        "Event Date": formatDate(c.eventDate),
        "Start Time": c.startTime,
        "End Time": c.endTime,
        "Venue": c.venue,
        "Setup Floor": c.floor,
        "Access Notes": c.accessNotes || "None",
        "Total Fee": `$${c.totalFee}`,
        "Deposit": `$${c.deposit} due by ${c.depositDue}`,
        "Meal for DJ": c.mealForDJ,
        "Additional Crew Meals": c.crewMeals || "None",
        "Additional Agreements": c.additionalAgreements,
        "Setup Access": `${c.setupHours} hour(s) before start`,
        "Client Signature (image)": signature,
      };
      const res = await fetch("https://formspree.io/f/xvzdbnan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setSigned(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert("Something went wrong submitting. Please try again or contact DJ Jon at 516-776-1997.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&family=Great+Vibes&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: "#e8e6e1", fontFamily: "'Barlow', sans-serif", padding: "24px 12px 60px" }}>

        {signed && (
          <div style={{ maxWidth: 760, margin: "0 auto 20px", background: "#1D9E75", color: "#fff", borderRadius: 12, padding: "18px 24px", textAlign: "center" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>✓ Contract signed and submitted!</p>
            <p style={{ margin: "6px 0 12px", fontSize: 14, opacity: 0.9 }}>DJ Jon has received a copy. Download your signed copy below for your records.</p>
            <button onClick={downloadPDF} style={{ background: "#fff", color: "#1D9E75", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 800, fontSize: 14, letterSpacing: "0.05em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Barlow Condensed'" }}>
              Download Signed PDF
            </button>
          </div>
        )}

        {/* Contract Document */}
        <div ref={contractRef} style={{ maxWidth: 760, margin: "0 auto", background: "#fff", borderRadius: 4, boxShadow: "0 2px 20px rgba(0,0,0,0.15)", padding: "48px 44px" }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 42, color: CRIMSON, letterSpacing: "-0.02em" }}>DJ</span>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 42, color: "#111", letterSpacing: "-0.02em" }}>JON</span>
          </div>
          <h1 style={{ textAlign: "center", fontSize: 19, fontWeight: 800, color: "#111", letterSpacing: "0.02em", margin: "0 0 24px" }}>
            PROFESSIONAL DJ SERVICE AGREEMENT
          </h1>

          <p style={pStyle}>
            This Agreement is made on the <span style={lineVal}>{todayStr}</span>, by and between:
          </p>
          <p style={pStyle}>
            Client (Purchaser): <span style={lineVal}>{c.clientName || "____________"}</span>&nbsp;&nbsp;
            DJ (Service Provider): <span style={lineVal}>Jonathan Janashvili</span>
          </p>

          <h2 style={h2Style}>1. Event Details</h2>
          <p style={pStyle}>Type of Event: <span style={lineVal}>{c.eventType}</span></p>
          <p style={pStyle}>Venue Name &amp; Address: <span style={lineVal}>{c.venue || "____________"}</span></p>
          <p style={pStyle}>Setup Location: <span style={lineVal}>{c.floor}</span>{c.accessNotes ? <> &nbsp;|&nbsp; Access Notes: <span style={lineVal}>{c.accessNotes}</span></> : null}</p>

          <h2 style={h2Style}>2. Date &amp; Time</h2>
          <p style={pStyle}>
            Event Date: <span style={lineVal}>{formatDate(c.eventDate)}</span>&nbsp;&nbsp;
            Start Time: <span style={lineVal}>{c.startTime || "____"}</span>&nbsp;&nbsp;
            End Time: <span style={lineVal}>{c.endTime || "____"}</span>
          </p>

          <h2 style={h2Style}>3. Payment Terms</h2>
          <p style={pStyle}>
            Total Fee Agreed: <span style={lineVal}>${c.totalFee || "____"}</span>&nbsp;&nbsp;
            Deposit Amount: <span style={lineVal}>${c.deposit || "____"}</span> (Due by <span style={lineVal}>{c.depositDue || "____"}</span>)
          </p>
          <p style={pStyle}>- Deposit is non-refundable and applies solely to the date, time, and location of this agreement.</p>
          <p style={pStyle}>- Final payment to be made by cash or check to: Shvili Ventures LLC — Or via Zelle/Quickpay to: Djjon97@gmail.com</p>

          <h2 style={h2Style}>4. Meal for DJ</h2>
          <p style={pStyle}>
            Meal Provided: <span style={lineVal}>{c.mealForDJ}</span>
            {c.crewMeals ? <> &nbsp;&nbsp;Additional Crew Meals: <span style={lineVal}>{c.crewMeals}</span></> : null}
          </p>

          <h2 style={h2Style}>5. Additional Agreements</h2>
          <p style={pStyle}><span style={lineVal}>{c.additionalAgreements || "None"}</span></p>

          <h2 style={h2Style}>6. Setup &amp; Equipment Access</h2>
          <p style={pStyle}>
            Client shall provide DJ access to the venue at least <span style={lineVal}>{c.setupHours}</span> hour(s) before scheduled start time for setup and sound check. A suitable electrical outlet must be made available.
          </p>

          <h2 style={h2Style}>7. Cancellation &amp; Force Majeure</h2>
          <p style={pStyle}>
            DJ's obligation to perform is subject to conditions beyond control (e.g., illness, weather, acts of God). If such circumstances occur, deposit will be refunded.
          </p>
          <p style={pStyle}>Client cancellations do not warrant a refund of deposit.</p>

          <h2 style={h2Style}>8. Recording &amp; Reproduction</h2>
          <p style={pStyle}>No part of the performance may be recorded, reproduced, or broadcast without prior written consent from the DJ.</p>

          <h2 style={h2Style}>9. Legal Eligibility</h2>
          <p style={pStyle}>The Client confirms they are of legal age and authorized to enter this agreement.</p>

          {/* Signatures */}
          <div style={{ marginTop: 36, borderTop: "1px solid #ddd", paddingTop: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
              {/* DJ side */}
              <div>
                <p style={{ ...pStyle, marginBottom: 4 }}>DJ Name (Print):</p>
                <p style={{ fontWeight: 700, fontSize: 15, borderBottom: "1px solid #999", paddingBottom: 4, margin: "0 0 16px" }}>Jonathan Janashvili</p>
                <p style={{ ...pStyle, marginBottom: 4 }}>DJ Signature:</p>
                <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 34, color: "#1a1a5e", borderBottom: "1px solid #999", margin: 0, paddingBottom: 2 }}>
                  Jonathan Janashvili
                </p>
              </div>

              {/* Client side */}
              <div>
                <p style={{ ...pStyle, marginBottom: 4 }}>Client Name (Print):</p>
                {signed ? (
                  <p style={{ fontWeight: 700, fontSize: 15, borderBottom: "1px solid #999", paddingBottom: 4, margin: "0 0 16px" }}>{printedName}</p>
                ) : (
                  <input
                    value={printedName}
                    onChange={(e) => setPrintedName(e.target.value)}
                    placeholder="Type your full legal name"
                    style={{ width: "100%", border: "none", borderBottom: "1px solid #999", fontSize: 15, fontWeight: 700, padding: "4px 2px", marginBottom: 16, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                  />
                )}
                <p style={{ ...pStyle, marginBottom: 4 }}>Client Signature:</p>
                {signed ? (
                  <img src={signature} alt="Client signature" style={{ maxHeight: 70, borderBottom: "1px solid #999" }} />
                ) : (
                  <SignaturePad onChange={setSignature} />
                )}
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 13, fontWeight: 700, color: "#111", marginTop: 36 }}>
            DJJON | 516-776-1997 | djjon97@gmail.com
          </p>
        </div>

        {/* Agree + Submit */}
        {!signed && (
          <div style={{ maxWidth: 760, margin: "20px auto 0", textAlign: "center" }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 10, justifyContent: "center", fontSize: 14, color: "#444", cursor: "pointer", maxWidth: 560, margin: "0 auto 20px", textAlign: "left" }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18 }} />
              I have read and agree to the terms of this agreement, and I intend my electronic signature above to be legally binding.
            </label>
            <button
              onClick={handleSign}
              disabled={sending}
              style={{
                background: CRIMSON, color: "#fff", border: "none", borderRadius: 8,
                padding: "16px 48px", fontSize: 16, fontFamily: "'Barlow Condensed'",
                fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              }}
            >
              {sending ? "Submitting…" : "Sign & Submit Contract"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
