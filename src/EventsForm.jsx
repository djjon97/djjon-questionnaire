import { useState } from "react";

const CRIMSON = "#9B1B1B";
const GRAY = "#888";

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 6,
  color: "#fff",
  padding: "12px 14px",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  marginTop: 6,
  transition: "border 0.2s",
};

const labelStyle = {
  display: "block",
  fontWeight: 600,
  fontSize: 13,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#ccc",
  marginBottom: 2,
};

const sectionStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 12,
  padding: "28px 28px 20px",
  marginBottom: 24,
};

const sectionTitle = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: CRIMSON,
  marginBottom: 18,
  borderBottom: `1px solid rgba(155,27,27,0.3)`,
  paddingBottom: 10,
};

const fieldGroup = { marginBottom: 18 };

function Field({ label, children }) {
  return (
    <div style={fieldGroup}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, name }) {
  return (
    <input
      style={inputStyle}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      autoComplete="off"
    />
  );
}

function TextArea({ value, onChange, placeholder, name, rows = 3 }) {
  return (
    <textarea
      style={{ ...inputStyle, resize: "vertical", minHeight: rows * 38 }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
    />
  );
}

function RadioGroup({ name, options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
      {options.map((opt) => (
        <label
          key={opt}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: 6,
            border: `1px solid ${value === opt ? CRIMSON : "rgba(255,255,255,0.15)"}`,
            background: value === opt ? "rgba(155,27,27,0.18)" : "rgba(255,255,255,0.04)",
            color: value === opt ? "#fff" : "#aaa",
            fontSize: 14,
            fontWeight: value === opt ? 600 : 400,
            transition: "all 0.15s",
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            style={{ display: "none" }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

const EVENT_TYPES = [
  "Birthday Party",
  "Engagement Party",
  "Corporate Event",
  "Sweet 16 / Quinceañera",
  "Bar / Bat Mitzvah",
  "Holiday Party",
  "Graduation Party",
  "Anniversary Party",
  "Other",
];

// Which moments are relevant per event type
const MOMENTS_BY_TYPE = {
  "Birthday Party": ["grandEntrance", "birthdayCake", "dedicationSong", "toastsMusic"],
  "Engagement Party": ["grandEntrance", "couplesDance", "dedicationSong", "toastsMusic"],
  "Corporate Event": ["grandEntrance", "toastsMusic", "dedicationSong"],
  "Sweet 16 / Quinceañera": ["grandEntrance", "birthdayCake", "couplesDance", "dedicationSong", "toastsMusic"],
  "Bar / Bat Mitzvah": ["grandEntrance", "birthdayCake", "dedicationSong", "toastsMusic"],
  "Holiday Party": ["grandEntrance", "toastsMusic", "dedicationSong"],
  "Graduation Party": ["grandEntrance", "dedicationSong", "toastsMusic"],
  "Anniversary Party": ["grandEntrance", "couplesDance", "dedicationSong", "toastsMusic"],
  "Other": ["grandEntrance", "couplesDance", "birthdayCake", "dedicationSong", "toastsMusic"],
};

const ALL_MOMENT_FIELDS = [
  { key: "grandEntrance", label: "Grand Entrance Song" },
  { key: "couplesDance", label: "First / Couple's Dance Song" },
  { key: "birthdayCake", label: "Birthday Cake / Candles Song" },
  { key: "toastsMusic", label: "Background Music During Toasts / Speeches" },
  { key: "dedicationSong", label: "Special Dedication Song" },
];

export default function EventsForm() {
  const [form, setForm] = useState({
    clientName: "", eventType: "", eventDate: "", venueName: "",
    email: "", phone: "",
    guestCount: "", ageRange: "",
    crowdDescription: "",
    introTracks: "",
    spotifyLink: "",
    doNotPlay: "",
    moments: {
      grandEntrance: "", couplesDance: "", birthdayCake: "",
      toastsMusic: "", dedicationSong: "",
    },
    mcStyle: "",
    additionalNotes: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setMoment = (key) => (e) =>
    setForm((f) => ({ ...f, moments: { ...f.moments, [key]: e.target.value } }));

  const relevantMoments = form.eventType
    ? ALL_MOMENT_FIELDS.filter((m) =>
        (MOMENTS_BY_TYPE[form.eventType] || []).includes(m.key)
      )
    : ALL_MOMENT_FIELDS;

  const handleSubmit = async () => {
    setSending(true);
    try {
      const payload = {
        _subject: `Event Questionnaire: ${form.clientName} — ${form.eventType} on ${form.eventDate}`,
        "Client Name": form.clientName,
        "Event Type": form.eventType,
        "Event Date": form.eventDate,
        "Venue": form.venueName,
        "Client Email": form.email,
        "Phone": form.phone,
        "Guest Count": form.guestCount,
        "Age Range of Guests": form.ageRange,
        "Crowd Description": form.crowdDescription,
        "Intro / Entrance Tracks": form.introTracks,
        "Spotify / Apple Music Playlist": form.spotifyLink,
        "Do Not Play List": form.doNotPlay,
        "Grand Entrance Song": form.moments.grandEntrance,
        "First / Couple's Dance Song": form.moments.couplesDance,
        "Birthday Cake / Candles Song": form.moments.birthdayCake,
        "Background Music During Toasts": form.moments.toastsMusic,
        "Special Dedication Song": form.moments.dedicationSong,
        "MC / Mic Preference": form.mcStyle,
        "Additional Notes": form.additionalNotes,
      };

      const res = await fetch("https://formspree.io/f/xvzdbnan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please try again or contact DJ Jon directly.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Barlow Condensed', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 800, letterSpacing: "0.05em", marginBottom: 12 }}>Questionnaire Submitted!</h2>
          <p style={{ color: "#aaa", fontSize: 16 }}>Your responses have been sent to DJ Jon.<br />He'll be in touch soon to go over the details!</p>
          <p style={{ color: CRIMSON, fontSize: 18, fontWeight: 700, marginTop: 28, letterSpacing: "0.06em" }}>Looking forward to your event! 🎶</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "'Barlow', sans-serif", color: "#fff", padding: "0 0 60px" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(160deg, #1a0a0a 0%, #0d0d0d 60%)", borderBottom: "1px solid rgba(155,27,27,0.3)", padding: "36px 24px 28px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 52, color: CRIMSON, letterSpacing: "-0.02em", lineHeight: 1 }}>DJ</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 52, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>JON</span>
          </div>
          <div style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: CRIMSON, fontWeight: 700, marginBottom: 20 }}>Productions</div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#fff", margin: "0 0 14px" }}>
            Event Music Questionnaire
          </h1>
          <p style={{ color: "#aaa", fontSize: 15, maxWidth: 520, margin: "0 auto", lineHeight: 1.6, fontWeight: 400 }}>
            Help me make your event unforgettable. Fill out the details below so I can craft the perfect musical experience tailored to you and your guests.
          </p>
        </div>

        {/* Form */}
        <div style={{ maxWidth: 680, margin: "36px auto 0", padding: "0 20px" }}>

          {/* Section 1: Event Details */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>01 — Event Details</div>
            <Field label="Your Name">
              <TextInput value={form.clientName} onChange={set("clientName")} placeholder="First & Last Name" />
            </Field>
            <Field label="Type of Event">
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={form.eventType}
                onChange={set("eventType")}
              >
                <option value="" disabled>Select event type…</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>
                ))}
              </select>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Event Date">
                <input type="date" style={inputStyle} value={form.eventDate} onChange={set("eventDate")} />
              </Field>
              <Field label="Venue Name">
                <TextInput value={form.venueName} onChange={set("venueName")} placeholder="Venue or location" />
              </Field>
              <Field label="Your Email">
                <TextInput value={form.email} onChange={set("email")} placeholder="email@example.com" />
              </Field>
              <Field label="Phone Number">
                <TextInput value={form.phone} onChange={set("phone")} placeholder="(555) 000-0000" />
              </Field>
            </div>
          </div>

          {/* Section 2: Crowd Info */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>02 — Your Crowd</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Approximate Guest Count">
                <TextInput value={form.guestCount} onChange={set("guestCount")} placeholder="e.g. 50, 100, 200+" />
              </Field>
              <Field label="Age Range of Guests">
                <TextInput value={form.ageRange} onChange={set("ageRange")} placeholder="e.g. 25–55, mixed ages" />
              </Field>
            </div>
            <Field label="Describe Your Crowd">
              <TextArea value={form.crowdDescription} onChange={set("crowdDescription")} placeholder="Energy level, backgrounds, how much they like to dance, any cultural mix to keep in mind…" rows={3} />
            </Field>
          </div>

          {/* Section 3: Music */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>03 — Music Requests</div>
            <Field label="Entrance / Intro Tracks">
              <TextArea value={form.introTracks} onChange={set("introTracks")} placeholder="List any specific songs you'd like for the entrance or opening. Include artist names." rows={3} />
            </Field>
            <Field label="Spotify or Apple Music Playlist Link">
              <TextInput value={form.spotifyLink} onChange={set("spotifyLink")} placeholder="Paste your playlist link here (please keep it under 30 tracks)" />
            </Field>
            <p style={{ fontSize: 12, color: GRAY, marginTop: -10, marginBottom: 0, fontStyle: "italic" }}>
              Tip: Keep your playlist to 30 tracks or fewer so I can focus on what matters most to you.
            </p>
          </div>

          {/* Section 4: Do Not Play */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>04 — Do Not Play List</div>
            <Field label="Songs, Artists, or Genres to Avoid">
              <TextArea value={form.doNotPlay} onChange={set("doNotPlay")} placeholder="List anything you absolutely do NOT want played — songs, artists, or entire genres." rows={3} />
            </Field>
          </div>

          {/* Section 5: Key Moments — dynamic based on event type */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>05 — Key Moments</div>
            {!form.eventType && (
              <p style={{ color: GRAY, fontSize: 14, marginBottom: 16, fontStyle: "italic" }}>
                Select your event type above to see relevant moment fields.
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {relevantMoments.map(({ key, label }) => (
                <Field key={key} label={label}>
                  <TextInput
                    value={form.moments[key]}
                    onChange={setMoment(key)}
                    placeholder="Song title & artist"
                  />
                </Field>
              ))}
            </div>
          </div>

          {/* Section 6: MC Style */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>06 — MC & Microphone Preference</div>
            <Field label="How much would you like DJ Jon on the mic?">
              <RadioGroup
                name="mcStyle"
                options={["A lot — hype the crowd!", "Moderate — key moments only", "Minimal — mostly music", "No mic please"]}
                value={form.mcStyle}
                onChange={(v) => setForm((f) => ({ ...f, mcStyle: v }))}
              />
            </Field>
          </div>

          {/* Section 7: Additional Notes */}
          <div style={sectionStyle}>
            <div style={sectionTitle}>07 — Anything Else?</div>
            <Field label="Additional Notes or Special Requests">
              <TextArea value={form.additionalNotes} onChange={set("additionalNotes")} placeholder="Any other details, special requests, or things I should know about your event…" rows={4} />
            </Field>
          </div>

          {/* Submit */}
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <button
              onClick={handleSubmit}
              disabled={sending}
              style={{
                background: CRIMSON,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "16px 48px",
                fontSize: 16,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {sending ? "Submitting…" : "Submit Questionnaire"}
            </button>
            <p style={{ color: CRIMSON, fontSize: 18, fontWeight: 700, marginTop: 28, letterSpacing: "0.06em", fontFamily: "'Barlow Condensed', sans-serif", textTransform: "uppercase" }}>
              Looking forward to your event! 🎶
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
