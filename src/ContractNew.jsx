import { useState } from "react";

const CRIMSON = "#9B1B1B";

const inputStyle = {
  width: "100%", background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6,
  color: "#fff", padding: "12px 14px", fontSize: 15,
  fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginTop: 6,
};
const labelStyle = {
  display: "block", fontWeight: 600, fontSize: 13,
  letterSpacing: "0.08em", textTransform: "uppercase", color: "#ccc", marginBottom: 2,
};
const sectionStyle = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 12, padding: "28px 28px 20px", marginBottom: 24,
};
const fieldGroup = { marginBottom: 18 };

function Field({ label, children }) {
  return <div style={fieldGroup}><label style={labelStyle}>{label}</label>{children}</div>;
}

export default function ContractNew() {
  const [c, setC] = useState({
    clientName: "", eventType: "Wedding", eventDate: "",
    startTime: "", endTime: "",
    venue: "",
    floor: "1st Floor", stairs: false, accessNotes: "",
    totalFee: "", deposit: "", depositDue: "",
    mealForDJ: "Yes", crewMeals: "",
    additionalAgreements: "See Invoice",
    setupHours: "2",
  });
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const set = (key) => (e) => setC((f) => ({ ...f, [key]: e.target.value }));

  const generate = () => {
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(c))));
    const url = `${window.location.origin}/contract?d=${data}`;
    setLink(url);
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      // fallback: select text manually
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'Barlow', sans-serif", color: "#fff", padding: "0 0 60px" }}>
        <div style={{ background: "linear-gradient(160deg, #1a0a0a 0%, #0d0d0d 60%)", borderBottom: "1px solid rgba(155,27,27,0.3)", padding: "36px 24px 28px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", gap: 6, marginBottom: 8 }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 44, color: CRIMSON, lineHeight: 1 }}>DJ</span>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 44, color: "#fff", lineHeight: 1 }}>JON</span>
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 24, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", margin: "10px 0 6px" }}>
            Contract Generator
          </h1>
          <p style={{ color: "#aaa", fontSize: 14 }}>Private — fill in the deal terms and generate a signing link for your client.</p>
        </div>

        <div style={{ maxWidth: 680, margin: "36px auto 0", padding: "0 20px" }}>
          <div style={sectionStyle}>
            <Field label="Client Full Name">
              <input style={inputStyle} value={c.clientName} onChange={set("clientName")} placeholder="First & Last" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Event Type">
                <select style={{ ...inputStyle, cursor: "pointer" }} value={c.eventType} onChange={set("eventType")}>
                  {["Wedding", "Engagement Party", "Bar / Bat Mitzvah", "Birthday Party", "Corporate Event", "Other"].map(t =>
                    <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>)}
                </select>
              </Field>
              <Field label="Event Date">
                <input type="date" style={inputStyle} value={c.eventDate} onChange={set("eventDate")} />
              </Field>
              <Field label="Start Time">
                <input style={inputStyle} value={c.startTime} onChange={set("startTime")} placeholder="e.g. 6:30 PM" />
              </Field>
              <Field label="End Time">
                <input style={inputStyle} value={c.endTime} onChange={set("endTime")} placeholder="e.g. 12:30 AM" />
              </Field>
            </div>
            <Field label="Venue Name & Address">
              <input style={inputStyle} value={c.venue} onChange={set("venue")} placeholder="Venue — Street, City, State" />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Setup Floor">
                <select style={{ ...inputStyle, cursor: "pointer" }} value={c.floor} onChange={set("floor")}>
                  {["1st Floor", "2nd Floor", "Other"].map(t => <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>)}
                </select>
              </Field>
              <Field label="Access Difficulties / Notes">
                <input style={inputStyle} value={c.accessNotes} onChange={set("accessNotes")} placeholder="Stairs, loading dock, etc. (optional)" />
              </Field>
              <Field label="Total Fee ($)">
                <input style={inputStyle} value={c.totalFee} onChange={set("totalFee")} placeholder="e.g. 2000" />
              </Field>
              <Field label="Deposit ($)">
                <input style={inputStyle} value={c.deposit} onChange={set("deposit")} placeholder="e.g. 500" />
              </Field>
              <Field label="Deposit Due By">
                <input style={inputStyle} value={c.depositDue} onChange={set("depositDue")} placeholder="e.g. Jan 15th" />
              </Field>
              <Field label="Meal for DJ">
                <select style={{ ...inputStyle, cursor: "pointer" }} value={c.mealForDJ} onChange={set("mealForDJ")}>
                  <option style={{ background: "#1a1a1a" }}>Yes</option>
                  <option style={{ background: "#1a1a1a" }}>No</option>
                </select>
              </Field>
              <Field label="Additional Crew Meals">
                <input style={inputStyle} value={c.crewMeals} onChange={set("crewMeals")} placeholder="e.g. 2 (optional)" />
              </Field>
              <Field label="Setup Access (Hours Before)">
                <input style={inputStyle} value={c.setupHours} onChange={set("setupHours")} placeholder="2" />
              </Field>
            </div>
            <Field label="Additional Agreements">
              <input style={inputStyle} value={c.additionalAgreements} onChange={set("additionalAgreements")} placeholder="See Invoice" />
            </Field>
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={generate} style={{
              background: CRIMSON, color: "#fff", border: "none", borderRadius: 8,
              padding: "16px 48px", fontSize: 16, fontFamily: "'Barlow Condensed'",
              fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
            }}>
              Generate Contract Link
            </button>
          </div>

          {link && (
            <div style={{ ...sectionStyle, marginTop: 28 }}>
              <label style={labelStyle}>Client Signing Link — send this to your client</label>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <input style={{ ...inputStyle, marginTop: 0, fontSize: 13 }} value={link} readOnly onFocus={(e) => e.target.select()} />
                <button onClick={copy} style={{
                  background: copied ? "#1D9E75" : CRIMSON, color: "#fff", border: "none", borderRadius: 6,
                  padding: "0 22px", fontFamily: "'Barlow Condensed'", fontWeight: 800,
                  letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", fontSize: 14, whiteSpace: "nowrap",
                }}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p style={{ fontSize: 13, color: "#888", marginTop: 12, lineHeight: 1.6 }}>
                Open the link yourself first to preview it. When the client signs, you'll get the full signed contract emailed to you automatically, and the client gets a PDF copy to download.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
