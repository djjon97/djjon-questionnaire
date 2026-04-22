import { useState, useEffect } from "react";
import WeddingForm from "./WeddingForm";
import EventsForm from "./EventsForm";

const CRIMSON = "#9B1B1B";

export default function App() {
  const [page, setPage] = useState("home");

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/wedding") setPage("wedding");
    else if (path === "/events") setPage("events");
    else setPage("home");
  }, []);

  const navigate = (p) => {
    window.history.pushState({}, "", "/" + p);
    setPage(p);
  };

  if (page === "wedding") return <WeddingForm />;
  if (page === "events") return <EventsForm />;

  // Home / landing page
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        fontFamily: "'Barlow', sans-serif",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}>
        {/* Logo */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 56, color: CRIMSON, lineHeight: 1 }}>DJ</span>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: 56, color: "#fff", lineHeight: 1 }}>JON</span>
        </div>
        <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: CRIMSON, fontWeight: 700, marginBottom: 40 }}>Productions</div>

        <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 26, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>
          Music Questionnaires
        </h1>
        <p style={{ color: "#aaa", fontSize: 15, marginBottom: 48, textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
          Select the form that matches your event so I can curate the perfect experience for you.
        </p>

        {/* Two cards */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 620 }}>
          {/* Wedding Card */}
          <div
            onClick={() => navigate("wedding")}
            style={{
              flex: "1 1 240px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(155,27,27,0.35)",
              borderRadius: 16,
              padding: "36px 28px",
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(155,27,27,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>💍</div>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 22, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", marginBottom: 10 }}>
              Wedding
            </h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              For couples planning their wedding reception, ceremony, or both.
            </p>
            <div style={{
              display: "inline-block",
              background: CRIMSON,
              color: "#fff",
              borderRadius: 6,
              padding: "10px 24px",
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Start Form →
            </div>
          </div>

          {/* Events Card */}
          <div
            onClick={() => navigate("events")}
            style={{
              flex: "1 1 240px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(155,27,27,0.35)",
              borderRadius: 16,
              padding: "36px 28px",
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(155,27,27,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 22, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color: "#fff", marginBottom: 10 }}>
              Events
            </h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Birthdays, engagement parties, corporate events, and more.
            </p>
            <div style={{
              display: "inline-block",
              background: CRIMSON,
              color: "#fff",
              borderRadius: 6,
              padding: "10px 24px",
              fontFamily: "'Barlow Condensed'",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}>
              Start Form →
            </div>
          </div>
        </div>

        <p style={{ color: "#444", fontSize: 13, marginTop: 48 }}>© DJ Jon Productions</p>
      </div>
    </>
  );
}
