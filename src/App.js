import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./App.css";

const DEMO_HOSPITALS = [
  {
    id: "h1",
    name: "Government Community Hospital",
    lat: 12.2958,
    lon: 76.6394,
    type: "Government Hospital",
    phone: "108",
    open: "24×7",
    services: [
      "Emergency",
      "General Medicine",
      "Maternity",
      "Laboratory",
      "X-Ray",
    ],
    benefits: [
      "AB-ArK eligible services",
      "BPL/eligible household support",
      "Referral services",
    ],
  },
  {
    id: "h2",
    name: "Rural Health Centre",
    lat: 12.303,
    lon: 76.655,
    type: "PHC / Rural Health Centre",
    phone: "08000000001",
    open: "8 AM – 8 PM",
    services: ["General Medicine", "Maternity", "Laboratory"],
    benefits: [
      "Government primary care",
      "Referral to higher centre",
    ],
  },
  {
    id: "h3",
    name: "District Referral Hospital",
    lat: 12.3105,
    lon: 76.6205,
    type: "District Hospital",
    phone: "08000000002",
    open: "24×7",
    services: [
      "Emergency",
      "General Medicine",
      "Maternity",
      "Laboratory",
      "X-Ray",
      "Blood Bank",
      "Dialysis",
    ],
    benefits: [
      "Government hospital",
      "Eligible scheme services",
    ],
  },
];

const DEMO_PHARMACIES = [
  {
    id: "p1",
    name: "Jan Aushadhi Pharmacy",
    lat: 12.2972,
    lon: 76.641,
    phone: "08000000011",
    hours: "8 AM – 9 PM",
  },
  {
    id: "p2",
    name: "Rural Health Pharmacy",
    lat: 12.3042,
    lon: 76.657,
    phone: "08000000012",
    hours: "9 AM – 8 PM",
  },
  {
    id: "p3",
    name: "Community Medical Store",
    lat: 12.309,
    lon: 76.623,
    phone: "08000000013",
    hours: "8 AM – 10 PM",
  },
];

const DEMO_LABS = [
  {
    id: "l1",
    name: "Government Diagnostic Laboratory",
    lat: 12.2965,
    lon: 76.64,
    phone: "08000000021",
    services: [
      "Blood Test",
      "Urine Test",
      "CBC",
      "Sugar Test",
      "Basic Diagnostics",
    ],
  },
  {
    id: "l2",
    name: "RuralCare Sample Centre",
    lat: 12.3048,
    lon: 76.6535,
    phone: "08000000022",
    services: [
      "Blood Test",
      "Sugar Test",
      "Home Collection",
    ],
  },
];

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Ananya Rao",
    specialty: "General Physician",
    languages: "English, Kannada",
    hours: "9 AM – 12 PM",
  },
  {
    id: 2,
    name: "Dr. Rahul Kumar",
    specialty: "General Physician",
    languages: "English, Hindi",
    hours: "2 PM – 5 PM",
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Women's Healthcare",
    languages: "English, Hindi, Kannada",
    hours: "10 AM – 1 PM",
  },
  {
    id: 4,
    name: "Dr. Meera Nair",
    specialty: "Pediatrics",
    languages: "English, Kannada",
    hours: "4 PM – 7 PM",
  },
];

const T = {
  en: {
    home: "Home",
    hospitals: "Hospitals",
    pharmacies: "Pharmacies",
    labs: "Labs",
    clinics: "Clinics",
    doctors: "Doctors",
    appointments: "Appointments",
    benefits: "BPL / Government Benefits",
    family: "Family",
    documents: "Documents",
    referrals: "Referrals",
    asha: "ASHA / Health Worker",
    dashboard: "Dashboard",
    emergency: "Emergency",
    login: "Doctors Login",
    location: "Use My Location",
    voice: "Voice Assistant",
    navigate: "Care Navigation",
  },

  kn: {
    home: "ಮುಖಪುಟ",
    hospitals: "ಆಸ್ಪತ್ರೆಗಳು",
    pharmacies: "ಫಾರ್ಮಸಿ",
    labs: "ಲ್ಯಾಬ್",
    clinics: "ಕ್ಲಿನಿಕ್",
    doctors: "ವೈದ್ಯರು",
    appointments: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್",
    benefits: "BPL / ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ",
    family: "ಕುಟುಂಬ",
    documents: "ದಾಖಲೆಗಳು",
    referrals: "ರೆಫರಲ್",
    asha: "ಆಶಾ / ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    emergency: "ತುರ್ತು",
    login: "ವೈದ್ಯರ ಲಾಗಿನ್",
    location: "ನನ್ನ ಸ್ಥಳ",
    voice: "ಧ್ವನಿ ಸಹಾಯಕ",
    navigate: "ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ",
  },

  hi: {
    home: "होम",
    hospitals: "अस्पताल",
    pharmacies: "फार्मेसी",
    labs: "लैब",
    clinics: "क्लिनिक",
    doctors: "डॉक्टर",
    appointments: "अपॉइंटमेंट",
    benefits: "BPL / सरकारी सुविधाएं",
    family: "परिवार",
    documents: "दस्तावेज़",
    referrals: "रेफरल",
    asha: "आशा / स्वास्थ्य कार्यकर्ता",
    dashboard: "डैशबोर्ड",
    emergency: "आपातकाल",
    login: "डॉक्टर लॉगिन",
    location: "मेरा स्थान",
    voice: "वॉइस असिस्टेंट",
    navigate: "स्वास्थ्य मार्गदर्शन",
  },
};

function haversine(a, b, c, d) {
  const R = 6371;
  const p = Math.PI / 180;

  const x = (c - a) * p;
  const y = (d - b) * p;

  const h =
    Math.sin(x / 2) ** 2 +
    Math.cos(a * p) *
      Math.cos(c * p) *
      Math.sin(y / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function mapsUrl(lat, lon) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
}

function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return null;
}

function MapBox({
  user,
  hospitals,
  pharmacies,
  labs,
  onSelect,
}) {
  const center = user || [12.3, 76.64];

  return (
    <div className="map-wrap">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter position={user} />

        {user && (
          <CircleMarker
            center={user}
            radius={9}
            pathOptions={{
              color: "#0b7d72",
              fillColor: "#0b7d72",
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <b>Your current location</b>
            </Popup>
          </CircleMarker>
        )}

        {hospitals.map((h) => (
          <CircleMarker
            key={h.id}
            center={[h.lat, h.lon]}
            radius={9}
            pathOptions={{
              color: "#c62828",
              fillColor: "#c62828",
              fillOpacity: 0.85,
            }}
            eventHandlers={{
              click: () => onSelect(h),
            }}
          >
            <Popup>
              <b>{h.name}</b>
              <br />
              {h.type}
              <br />
              <a href={`tel:${h.phone}`}>Call</a> ·{" "}
              <a
                href={mapsUrl(h.lat, h.lon)}
                target="_blank"
                rel="noreferrer"
              >
                Directions
              </a>
            </Popup>
          </CircleMarker>
        ))}

        {pharmacies.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lon]}
            radius={7}
            pathOptions={{
              color: "#16834a",
              fillColor: "#16834a",
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <b>{p.name}</b>
              <br />
              <a href={`tel:${p.phone}`}>Call</a> ·{" "}
              <a
                href={mapsUrl(p.lat, p.lon)}
                target="_blank"
                rel="noreferrer"
              >
                Directions
              </a>
            </Popup>
          </CircleMarker>
        ))}

        {labs.map((l) => (
          <CircleMarker
            key={l.id}
            center={[l.lat, l.lon]}
            radius={7}
            pathOptions={{
              color: "#6a4fb3",
              fillColor: "#6a4fb3",
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <b>{l.name}</b>
              <br />
              <a href={`tel:${l.phone}`}>Call</a> ·{" "}
              <a
                href={mapsUrl(l.lat, l.lon)}
                target="_blank"
                rel="noreferrer"
              >
                Directions
              </a>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

function Card({ icon, title, children, onClick }) {
  return (
    <button className="feature-card" onClick={onClick}>
      <span className="feature-icon">{icon}</span>

      <span>
        <b>{title}</b>
        <small>{children}</small>
      </span>

      <span className="arrow">→</span>
    </button>
  );
}

function App() {
  const [lang, setLang] = useState("en");
  const text = T[lang];

  const [page, setPage] = useState("home");
  const [online, setOnline] = useState(navigator.onLine);
  const [user, setUser] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  const [appointments, setAppointments] = useState(() =>
    JSON.parse(localStorage.getItem("rc_appointments") || "[]")
  );

  const [family, setFamily] = useState(() =>
    JSON.parse(localStorage.getItem("rc_family") || "[]")
  );

  const [referrals, setReferrals] = useState(() =>
    JSON.parse(localStorage.getItem("rc_referrals") || "[]")
  );

  const [visits, setVisits] = useState(() =>
    JSON.parse(localStorage.getItem("rc_visits") || "[]")
  );

  const [toast, setToast] = useState("");
  const [voiceMessage, setVoiceMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState(null);
  const [doctorLogged, setDoctorLogged] = useState(false);
  const [bplStep, setBplStep] = useState(1);

  const recognitionRef = useRef(null);
  

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);

    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "rc_appointments",
      JSON.stringify(appointments)
    );
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(
      "rc_family",
      JSON.stringify(family)
    );
  }, [family]);

  useEffect(() => {
    localStorage.setItem(
      "rc_referrals",
      JSON.stringify(referrals)
    );
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(
      "rc_visits",
      JSON.stringify(visits)
    );
  }, [visits]);

  function go(p) {
    setPage(p);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function notify(msg) {
    setToast(msg);

    setTimeout(() => {
      setToast("");
    }, 2600);
  }

  function useLocation() {
    if (!navigator.geolocation) {
      notify("Location is not supported by this browser.");
      return;
    }

    setLocationStatus("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUser([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);

        setLocationStatus("Location connected");
        notify("Live location connected");
      },

      () => {
        setLocationStatus(
          "Location permission denied or unavailable."
        );

        notify(
          "Please allow location permission."
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }

 function saveAppointment(e) {
  e.preventDefault();

  const f = new FormData(e.currentTarget);

  const item = {
    id: Date.now(),

    hospital: f.get("hospital"),

    name: f.get("name"),
    phone: f.get("phone"),
    doctor: f.get("doctor"),
    date: f.get("date"),
    time: f.get("time"),
    reason: f.get("reason"),
    payment: f.get("payment"),

    status: "Booked",
  };

  setAppointments([
    item,
    ...appointments,
  ]);

  e.currentTarget.reset();

  notify("Appointment saved locally");
}

  function addFamily(e) {
    e.preventDefault();

    const f = new FormData(e.currentTarget);

    setFamily([
      {
        id: Date.now(),
        name: f.get("name"),
        relation: f.get("relation"),
        age: f.get("age"),
      },
      ...family,
    ]);

    e.currentTarget.reset();

    notify("Family member added");
  }

  function addReferral(e) {
    e.preventDefault();

    const f = new FormData(e.currentTarget);

    setReferrals([
      {
        id: Date.now(),
        patient: f.get("patient"),
        from: f.get("from"),
        to: f.get("to"),
        reason: f.get("reason"),
        status: "Referral created",
      },
      ...referrals,
    ]);

    e.currentTarget.reset();

    notify("Referral saved");
  }

  function addVisit(e) {
    e.preventDefault();

    const f = new FormData(e.currentTarget);

    setVisits([
      {
        id: Date.now(),
        person: f.get("person"),
        task: f.get("task"),
        date: f.get("date"),
        status: "Pending follow-up",
      },
      ...visits,
    ]);

    e.currentTarget.reset();

    notify("Health-worker visit saved");
  }

  function speak(msg) {
    if (!("speechSynthesis" in window)) return;

    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(msg);

    u.lang =
      lang === "kn"
        ? "kn-IN"
        : lang === "hi"
        ? "hi-IN"
        : "en-IN";

    u.rate = 0.9;

    speechSynthesis.speak(u);
  }

  function processVoiceCommand(command) {
  const s = command
    .toLowerCase()
    .replace(/[.,!?]/g, " ")
    .trim();

  const rules = [
    [
      [
        "doctor", "doctors",
        "ವೈದ್ಯ", "ವೈದ್ಯರು", "ಡಾಕ್ಟರ್", "ಡಾಕ್ಟರ್‌",
        "डॉक्टर", "डॉक्टर्स"
      ],
      "doctors",
      "Opening Doctors",
      "ವೈದ್ಯರ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "डॉक्टर विभाग खोल रहा हूँ"
    ],

    [
      [
        "hospital", "hospitals",
        "ಆಸ್ಪತ್ರೆ", "ಆಸ್ಪತ್ರೆ ಬೇಕು", "ಆಸ್ಪತ್ರೆಗೆ",
        "ಆಸ್ಪತ್ರ", "ಆಸ್ಪತ್ರೆ",
        "अस्पताल", "अस्पताल चाहिए", "अस्पताल में"
      ],
      "hospitals",
      "Opening Hospitals",
      "ಆಸ್ಪತ್ರೆಗಳ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "अस्पताल विभाग खोल रहा हूँ"
    ],

    [
      [
        "pharmacy", "pharmacies", "medical store",
        "ಫಾರ್ಮಸಿ", "ಮೆಡಿಕಲ್", "ಔಷಧಿ",
        "फार्मेसी", "मेडिकल", "दवा"
      ],
      "pharmacies",
      "Opening Pharmacies",
      "ಫಾರ್ಮಸಿ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "फार्मेसी विभाग खोल रहा हूँ"
    ],

    [
      [
        "lab", "labs", "laboratory", "test",
        "ಲ್ಯಾಬ್", "ಲ್ಯಾಬ್‌", "ಪರೀಕ್ಷೆ",
        "लैब", "प्रयोगशाला", "टेस्ट"
      ],
      "labs",
      "Opening Labs",
      "ಲ್ಯಾಬ್ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "लैब विभाग खोल रहा हूँ"
    ],

    [
      [
        "appointment", "appointments", "book appointment",
        "ಅಪಾಯಿಂಟ್", "ಅಪಾಯಿಂಟ್ಮೆಂಟ್", "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ಸ್",
        "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬೇಕು", "ಅಪಾಯಿಂಟ್ ಮಾಡಬೇಕು",
        "अपॉइंटमेंट", "अपॉइंटमेंट चाहिए", "अपॉइंटमेंट बुक"
      ],
      "appointments",
      "Opening Appointments",
      "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "अपॉइंटमेंट विभाग खोल रहा हूँ"
    ],

    [
      [
        "bpl", "government scheme", "government schemes",
        "government benefit", "scheme",
        "ಸರ್ಕಾರಿ ಯೋಜನೆ", "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
        "ಸರ್ಕಾರಿ ಸೌಲಭ್ಯ", "ಯೋಜನೆ",
        "सरकारी योजना", "सरकारी योजनाएं", "सरकारी सुविधा", "योजना"
      ],
      "benefits",
      "Opening Government Benefits",
      "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "सरकारी योजनाओं का विभाग खोल रहा हूँ"
    ],

    [
      [
        "insurance", "life insurance", "life policy",
        "ವಿಮೆ", "ಜೀವ ವಿಮೆ", "ಜೀವನ ವಿಮೆ",
        "बीमा", "जीवन बीमा", "बीमा पॉलिसी"
      ],
      "insurance",
      "Opening Life Insurance",
      "ಜೀವ ವಿಮೆ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "जीवन बीमा विभाग खोल रहा हूँ"
    ],

    [
      [
        "family", "family health",
        "ಕುಟುಂಬ", "ಕುಟುಂಬ ಆರೋಗ್ಯ",
        "परिवार", "परिवार स्वास्थ्य"
      ],
      "family",
      "Opening Family Health",
      "ಕುಟುಂಬ ಆರೋಗ್ಯ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "परिवार स्वास्थ्य विभाग खोल रहा हूँ"
    ],

    [
      [
        "document", "documents", "report", "reports",
        "ದಾಖಲೆ", "ದಾಖಲೆಗಳು", "ರಿಪೋರ್ಟ್",
        "दस्तावेज़", "दस्तावेज", "रिपोर्ट"
      ],
      "documents",
      "Opening Documents",
      "ದಾಖಲೆಗಳ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "दस्तावेज़ विभाग खोल रहा हूँ"
    ],

    [
      [
        "referral", "referrals",
        "ರೆಫರಲ್", "ರೆಫರಲ್ ಬೇಕು",
        "रेफरल", "रेफरल चाहिए"
      ],
      "referrals",
      "Opening Referrals",
      "ರೆಫರಲ್ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "रेफरल विभाग खोल रहा हूँ"
    ],

    [
      [
        "asha", "anm", "health worker",
        "ಆಶಾ", "ಆಶಾ ಕಾರ್ಯಕರ್ತೆ", "ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತೆ",
        "आशा", "आशा कार्यकर्ता", "स्वास्थ्य कार्यकर्ता"
      ],
      "asha",
      "Opening ASHA Health Worker",
      "ಆಶಾ ಆರೋಗ್ಯ ಕಾರ್ಯಕರ್ತೆ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "आशा स्वास्थ्य कार्यकर्ता विभाग खोल रहा हूँ"
    ],

    [
      [
        "dashboard",
        "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "ಡ್ಯಾಶ್ಬೋರ್ಡ್", "ಡ್ಯಾಶ್",
        "डैशबोर्ड", "डैश"
      ],
      "dashboard",
      "Opening Dashboard",
      "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "डैशबोर्ड खोल रहा हूँ"
    ],

    [
      [
        "emergency", "ambulance", "108",
        "ತುರ್ತು", "ತುರ್ತು ಸೇವೆ", "ಆಂಬುಲೆನ್ಸ್",
        "ನೂರ ಎಂಟು",
        "आपातकाल", "इमरजेंसी", "एम्बुलेंस", "एक सौ आठ"
      ],
      "emergency",
      "Opening Emergency",
      "ತುರ್ತು ಸೇವೆಯನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "आपातकालीन सेवा खोल रहा हूँ"
    ],

    [
      [
        "navigate", "navigation",
        "ಮಾರ್ಗದರ್ಶನ", "ದಾರಿ", "ದಾರಿ ತೋರಿಸು",
        "मार्गदर्शन", "रास्ता", "रास्ता बताओ", "नेविगेशन"
      ],
      "navigate",
      "Opening Care Navigation",
      "ಮಾರ್ಗದರ್ಶನ ವಿಭಾಗವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "मार्गदर्शन विभाग खोल रहा हूँ"
    ],

    [
      [
        "home",
        "ಮುಖಪುಟ", "ಮನೆ",
        "होम", "मुखपृष्ठ"
      ],
      "home",
      "Opening Home",
      "ಮುಖಪುಟವನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ",
      "होम खोल रहा हूँ"
    ]
  ];

  const hit = rules.find((rule) =>
    rule[0].some((keyword) => s.includes(keyword.toLowerCase()))
  );

  if (hit) {
    go(hit[1]);

    setVoiceMessage(`I heard: "${command}"`);

    if (voiceLanguage === "kn") {
      speak(hit[3]);
    } else if (voiceLanguage === "hi") {
      speak(hit[4]);
    } else {
      speak(hit[2]);
    }

    notify(hit[2]);
  } else {
    setVoiceMessage(`I heard: "${command}"`);

    if (voiceLanguage === "kn") {
      speak(
        "ಕ್ಷಮಿಸಿ, ವೈದ್ಯರು, ಆಸ್ಪತ್ರೆ, ಫಾರ್ಮಸಿ, ಲ್ಯಾಬ್ ಅಥವಾ ತುರ್ತು ಸೇವೆ ಎಂದು ಹೇಳಿ."
      );
    } else if (voiceLanguage === "hi") {
      speak(
        "माफ़ कीजिए, डॉक्टर, अस्पताल, फार्मेसी, लैब या इमरजेंसी कहें।"
      );
    } else {
      speak(
        "Sorry, please say doctors, hospitals, pharmacy, labs or emergency."
      );
    }
  }
}

function startVoice() {
  const SR =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SR) {
    notify(
      "Voice recognition works best in Google Chrome."
    );
    return;
  }

  if (!voiceLanguage) {
    setVoiceMessage(
      "Please select Kannada, English or Hindi first."
    );
    return;
  }

  const r = new SR();

  recognitionRef.current = r;

  r.continuous = false;
  r.interimResults = false;
  r.maxAlternatives = 3;

  r.lang =
    voiceLanguage === "kn"
      ? "kn-IN"
      : voiceLanguage === "hi"
      ? "hi-IN"
      : "en-IN";

  r.onstart = () => {
    setIsListening(true);

    if (voiceLanguage === "kn") {
      setVoiceMessage(
        "🎙️ ಕೇಳುತ್ತಿದ್ದೇನೆ... ಈಗ ನಿಮ್ಮ ಆಯ್ಕೆಯನ್ನು ಹೇಳಿ."
      );
    } else if (voiceLanguage === "hi") {
      setVoiceMessage(
        "🎙️ सुन रहा हूँ... अब अपना विकल्प बोलिए।"
      );
    } else {
      setVoiceMessage(
        "🎙️ I'm listening... Please say your choice."
      );
    }
  };

  r.onresult = (e) => {
    const cmd =
      e.results?.[0]?.[0]?.transcript || "";

    if (cmd) {
      processVoiceCommand(cmd);
    }
  };

  r.onerror = (e) => {
    setIsListening(false);

    if (e.error === "not-allowed") {
      setVoiceMessage(
        "Please allow microphone permission."
      );

      notify(
        "Allow microphone permission."
      );
    } else {
      setVoiceMessage(
        "Please try again."
      );

      notify(
        "Please try again."
      );
    }
  };

  r.onend = () => {
    setIsListening(false);
    recognitionRef.current = null;
  };

  try {
    r.start();
  } catch {}
}

  function stopVoice() {
    recognitionRef.current?.stop();

    setIsListening(false);
  }

  const nearbyHospitals = useMemo(
    () =>
      DEMO_HOSPITALS.map((h) => ({
        ...h,
        distance: user
          ? haversine(
              user[0],
              user[1],
              h.lat,
              h.lon
            ).toFixed(1)
          : null,
      })).sort(
        (a, b) =>
          (a.distance ?? 99) -
          (b.distance ?? 99)
      ),
    [user]
  );

  const nearbyPharmacies = useMemo(
    () =>
      DEMO_PHARMACIES.map((p) => ({
        ...p,
        distance: user
          ? haversine(
              user[0],
              user[1],
              p.lat,
              p.lon
            ).toFixed(1)
          : null,
      })).sort(
        (a, b) =>
          (a.distance ?? 99) -
          (b.distance ?? 99)
      ),
    [user]
  );

  const nearbyLabs = useMemo(
    () =>
      DEMO_LABS.map((l) => ({
        ...l,
        distance: user
          ? haversine(
              user[0],
              user[1],
              l.lat,
              l.lon
            ).toFixed(1)
          : null,
      })).sort(
        (a, b) =>
          (a.distance ?? 99) -
          (b.distance ?? 99)
      ),
    [user]
  );

  const nav = [
    ["home", text.home],
    ["hospitals", text.hospitals],
    ["pharmacies", text.pharmacies],
    ["labs", text.labs],
    ["doctors", text.doctors],
    ["appointments", text.appointments],
    ["benefits", text.benefits],
    ["insurance","Life Insurance"],
    ["family", text.family],
    ["documents", text.documents],
    ["referrals", text.referrals],
    ["asha", text.asha],
    ["dashboard", text.dashboard],
    ["emergency", text.emergency],
  ];

  return (
    <div className="app">

      <header className="topbar">

        <div
          className="brand"
          onClick={() => go("home")}
        >
          <span className="brand-mark">
            ✚
          </span>

          <span>
            <b>RuralCare</b>
            <small>
              Healthcare for every village
            </small>
          </span>
        </div>

        <div className="top-actions">

          <select
            value={lang}
            onChange={(e) =>
              setLang(e.target.value)
            }
          >
            <option value="en">
              English
            </option>

            <option value="kn">
              ಕನ್ನಡ
            </option>

            <option value="hi">
              हिन्दी
            </option>
          </select>

          <button
            className="outline-btn"
            onClick={useLocation}
          >
            📍 {text.location}
          </button>

          <button
            className="doctor-btn"
            onClick={() => go("login")}
          >
            🩺 {text.login}
          </button>

        </div>

      </header>

      <nav className="nav-scroll">

        {nav.map(([id, label]) => (
          <button
            key={id}
            className={
              page === id ? "active" : ""
            }
            onClick={() => go(id)}
          >
            {label}
          </button>
        ))}

      </nav>

      <div
        className={
          online
            ? "status online"
            : "status offline"
        }
      >
        {online
          ? "● Online"
          : "● Offline mode"}

        {locationStatus && (
          <span>
            {" "}
            · {locationStatus}
          </span>
        )}
      </div>

      <main className="main">

        {page === "home" && (
          <section className="hero-page">

            <div className="hero">

              <div>

                <span className="eyebrow">
                  RURAL HEALTHCARE PLATFORM
                </span>

                <h1>
                  Healthcare access,{" "}
                  <span>made simple.</span>
                </h1>

                <p>
                  Find the right facility,
                  doctor, pharmacy or lab,
                  manage referrals and family
                  care, and stay connected even
                  with limited internet.
                </p>

                <div className="hero-actions">

                  <button
                    className="primary-btn"
                    onClick={() =>
                      go("navigate")
                    }
                  >
                    🧭 Start Care Navigation
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={useLocation}
                  >
                    📍 Find Nearby Care
                  </button>

                </div>

                <div className="trust-row">
                  <span>
                    ✓ Local language
                  </span>

                  <span>
                    ✓ Offline-ready
                  </span>

                  <span>
                    ✓ Demo-safe data
                  </span>
                </div>

              </div>

              <div className="hero-panel">

                <div className="pulse">
                  ●
                </div>

                <h3>
                  Care near you
                </h3>

                <p>
                  {user
                    ? "Live location connected"
                    : "Connect location to calculate distance"}
                </p>

                <button
                  onClick={useLocation}
                  className="panel-btn"
                >
                  📍 {text.location}
                </button>

                <div className="mini-stats">

                  <div>
                    <b>
                      {nearbyHospitals.length}
                    </b>
                    <small>
                      Hospitals
                    </small>
                  </div>

                  <div>
                    <b>
                      {nearbyPharmacies.length}
                    </b>
                    <small>
                      Pharmacies
                    </small>
                  </div>

                  <div>
                    <b>
                      {nearbyLabs.length}
                    </b>
                    <small>
                      Labs
                    </small>
                  </div>

                </div>

              </div>

            </div>

            <div className="section-head">

              <div>

                <span className="eyebrow">
                  ALL-IN-ONE ACCESS
                </span>

                <h2>
                  Everything in one place
                </h2>

              </div>

            </div>

            <div className="feature-grid">

              <Card
                icon="🏥"
                title="Nearby Hospitals"
                onClick={() =>
                  go("hospitals")
                }
              >
                Live location, distance and
                directions.
              </Card>

              <Card
                icon="💊"
                title="Pharmacies"
                onClick={() =>
                  go("pharmacies")
                }
              >
                Find nearby pharmacy support.
              </Card>

              <Card
                icon="🧪"
                title="Laboratories"
                onClick={() =>
                  go("labs")
                }
              >
                Find diagnostic services.
              </Card>

              <Card
                icon="🩺"
                title="Doctors"
                onClick={() =>
                  go("doctors")
                }
              >
                Browse doctor availability.
              </Card>

              <Card
                icon="📅"
                title="Appointments"
                onClick={() =>
                  go("appointments")
                }
              >
                Online/offline local booking.
              </Card>

              <Card
                icon="🪪"
                title="BPL / Government Benefits"
                onClick={() =>
                  go("benefits")
                }
              >
                Step-by-step eligibility
                guidance.
              </Card>

              <Card
  icon="🛡️"
  title="Life Insurance"
  onClick={() =>
    go("insurance")
  }
>
  Learn about life insurance and
  family financial protection.
</Card>

              <Card
                icon="👨‍👩‍👧‍👦"
                title="Family Health"
                onClick={() =>
                  go("family")
                }
              >
                Keep a simple family care list.
              </Card>

              <Card
                icon="🔁"
                title="Referrals"
                onClick={() =>
                  go("referrals")
                }
              >
                Track the healthcare journey.
              </Card>

              <Card
                icon="🤝"
                title="ASHA / Health Worker"
                onClick={() =>
                  go("asha")
                }
              >
                Household visit and follow-up
                queue.
              </Card>

              <Card
                icon="📄"
                title="Documents"
                onClick={() =>
                  go("documents")
                }
              >
                Organize reports and
                prescriptions.
              </Card>

              <Card
                icon="📊"
                title="Dashboard"
                onClick={() =>
                  go("dashboard")
                }
              >
                See your care activity.
              </Card>

              <Card
                icon="🚨"
                title="Emergency / 108"
                onClick={() =>
                  go("emergency")
                }
              >
                Emergency navigation and
                call support.
              </Card>

            </div>

            <div className="map-section">

              <div className="section-head">

                <div>
                  <span className="eyebrow">
                    LIVE LOCATION
                  </span>

                  <h2>
                    Nearby care map
                  </h2>
                </div>

              </div>

              <MapBox
                user={user}
                hospitals={nearbyHospitals.slice(
                  0,
                  5
                )}
                pharmacies={nearbyPharmacies}
                labs={nearbyLabs}
                onSelect={setSelectedHospital}
              />

            </div>

          </section>
        )}

        {page === "hospitals" && (
          <section>

            <PageTitle
              title="Nearby Hospitals"
              sub="Government and referral facilities with location, services and directions."
            />

            <MapBox
              user={user}
              hospitals={nearbyHospitals}
              pharmacies={nearbyPharmacies}
              labs={nearbyLabs}
              onSelect={setSelectedHospital}
            />

            <div className="list-grid">

              {nearbyHospitals.map((h) => (
                <article
                  className="info-card"
                  key={h.id}
                >

                  <div className="card-top">

                    <span className="tag red">
                      {h.type}
                    </span>

                    <span>
                      {h.distance
                        ? `${h.distance} km`
                        : "Location off"}
                    </span>

                  </div>

                  <h3>{h.name}</h3>

                  <p>
                    🕒 {h.open}
                  </p>

                  <div className="chips">

                    {h.services.map((x) => (
                      <span key={x}>
                        {x}
                      </span>
                    ))}

                  </div>

                  <div className="card-actions">

                    <a
                      href={`tel:${h.phone}`}
                      className="call"
                    >
                      📞 Call
                    </a>

                    <a
                      href={mapsUrl(
                        h.lat,
                        h.lon
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="directions"
                    >
                      📍 Directions
                    </a>

                    <button
                      onClick={() =>
                        setSelectedHospital(h)
                      }
                    >
                      View Details
                    </button>

                  </div>

                </article>
              ))}

            </div>

            {selectedHospital && (
              <div className="detail-panel">

                <h3>
                  {selectedHospital.name}
                </h3>

                <p>
                  <b>
                    Government / referral
                    support:
                  </b>{" "}
                  {selectedHospital.benefits.join(
                    " · "
                  )}
                </p>

                <small>
                  Demo facility information —
                  verify current services before
                  relying on it.
                </small>

              </div>
            )}

          </section>
        )}

        {page === "pharmacies" && (
          <section>

            <PageTitle
              title="Nearby Pharmacies"
              sub="Location-aware pharmacy discovery. RuralCare does not dispense medicines."
            />

            <div className="list-grid">

              {nearbyPharmacies.map((p) => (
                <article
                  className="info-card"
                  key={p.id}
                >

                  <span className="tag green">
                    PHARMACY
                  </span>

                  <h3>{p.name}</h3>

                  <p>
                    🕒 {p.hours}
                  </p>

                  <p>
                    📍{" "}
                    {p.distance
                      ? `${p.distance} km from you`
                      : "Connect location for distance"}
                  </p>

                  <div className="card-actions">

                    <a
                      href={`tel:${p.phone}`}
                      className="call"
                    >
                      📞 Call
                    </a>

                    <a
                      href={mapsUrl(
                        p.lat,
                        p.lon
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="directions"
                    >
                      📍 Directions
                    </a>

                  </div>

                </article>
              ))}

            </div>

          </section>
        )}

        {page === "labs" && (
          <section>

            <PageTitle
              title="Laboratories"
              sub="Find diagnostic and sample-collection options near your location."
            />

            <div className="list-grid">

              {nearbyLabs.map((l) => (
                <article
                  className="info-card"
                  key={l.id}
                >

                  <span className="tag purple">
                    LAB
                  </span>

                  <h3>{l.name}</h3>

                  <p>
                    📍{" "}
                    {l.distance
                      ? `${l.distance} km from you`
                      : "Connect location for distance"}
                  </p>

                  <div className="chips">

                    {l.services.map((x) => (
                      <span key={x}>
                        {x}
                      </span>
                    ))}

                  </div>

                  <div className="card-actions">

                    <a
                      href={`tel:${l.phone}`}
                      className="call"
                    >
                      📞 Call
                    </a>

                    <a
                      href={mapsUrl(
                        l.lat,
                        l.lon
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="directions"
                    >
                      📍 Directions
                    </a>

                  </div>

                </article>
              ))}

            </div>

          </section>
        )}

        {page === "doctors" && (
          <section>

            <PageTitle
              title="Doctors & Clinics"
              sub="Demo doctor directory for the prototype."
            />

            <div className="list-grid">

              {DOCTORS.map((d) => (
                <article
                  className="info-card"
                  key={d.id}
                >

                  <div className="doctor-avatar">
                    👨‍⚕️
                  </div>

                  <h3>{d.name}</h3>

                  <p>
                    <b>{d.specialty}</b>
                  </p>

                  <p>
                    🌐 {d.languages}
                  </p>

                  <p>
                    🕒 {d.hours}
                  </p>

                  <button
                    className="primary-btn small"
                    onClick={() =>
                      go("appointments")
                    }
                  >
                    Book Appointment
                  </button>

                </article>
              ))}

            </div>

          </section>
        )}

        {page === "appointments" && (
          <section>

            <PageTitle
              title="Appointments"
              sub="Local-first appointment demo with demo UPI payment."
            />

            <div className="two-col">

              <form
                className="form-card"
                onSubmit={saveAppointment}
              >

                <label>
  Hospital

  <input
    name="hospital"
    required
    placeholder="Enter hospital name"
  />
</label>

                <label>
                  Patient name

                  <input
                    name="name"
                    required
                    placeholder="Enter name"
                  />
                </label>

                <label>
                  Phone

                  <input
                    name="phone"
                    required
                    placeholder="10-digit phone"
                  />
                </label>

                <label>
                  Doctor

<label>
  Doctor

  <select name="doctor">

    {DOCTORS.map((d) => (
      <option key={d.id}>
        {d.name} —{" "}
        {d.specialty}
      </option>
    ))}

  </select>

</label>

</label>
<div
  id="doctor-availability"
  style={{
    marginTop: "8px",
    padding: "10px",
    borderRadius: "8px",
    background: "#f0fdf4",
    color: "#166534"
  }}
>
  🩺 Doctor availability will be checked for the selected date and time.
</div>
                

                <div className="form-row">

                  <label>
                    Date

<input
  type="date"
  name="date"
  required
  min={new Date().toISOString().split("T")[0]}
/>
                  </label>

                  <label>
                    Time

                    <input
                      type="time"
                      name="time"
                      required
                    />
                  </label>

                </div>

                <label>
                  Reason

                  <textarea
                    name="reason"
                    placeholder="Short reason"
                  />
                </label>

                <label>
                  Payment

                  <select name="payment">
                    <option>
                      Demo UPI
                    </option>

                    <option>
                      Pay at Facility
                    </option>
                  </select>

                </label>

                <button className="primary-btn">
                  Save Appointment
                </button>

                <small>
                  Demo payment only. No real
                  money is transferred.
                </small>

              </form>

              <div className="side-card">

                <h3>
                  Why local-first?
                </h3>

                <p>
                  Appointments are saved in
                  localStorage so the prototype
                  remains usable during temporary
                  network loss.
                </p>

                <div className="big-number">
                  {appointments.length}
                </div>

                <small>
                  Saved appointments
                </small>

              </div>

            </div>

            <div className="list-grid">

              {appointments.map((a) => (
                <article
                  className="info-card"
                  key={a.id}
                >

                  <span className="tag green">
                    {a.status}
                  </span>

                  <h3>{a.name}</h3>

                  <p>{a.doctor}</p>

                  <p>
                    📅 {a.date} · {a.time}
                  </p>

                  <p>
                    💳 {a.payment}
                  </p>

                  <button
  className="primary-btn small"
  onClick={() => {
    if (
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      )
    ) {
      setAppointments(
        appointments.filter(
          (appointment) =>
            appointment.id !== a.id
        )
      );

      notify("Appointment cancelled successfully");
    }
  }}
>
  ❌ Cancel Appointment
</button>

                </article>
              ))}


</div>

            {/* DIGITAL APPOINTMENT TICKET */}

            {appointments.length > 0 && (
              <div className="digital-ticket-section">

                <h2>🎫 Digital Appointment Ticket</h2>

                <p>
                  Your latest appointment confirmation
                </p>

                {(() => {

                  const a = appointments[0];

                  return (

                    <div
                      className="digital-ticket"
                      id="appointment-ticket"
                    >

                      <div className="ticket-header">

                        <div>
                          <h2>✚ RuralCare</h2>

                          <small>
                            Healthcare Within Your Reach
                          </small>
                        </div>

                        <span className="ticket-confirmed">
                          ✓ CONFIRMED
                        </span>

                      </div>


                      <h3 className="ticket-title">
                        DIGITAL OPD APPOINTMENT LETTER
                      </h3>


                      <div className="serial-box">

                        <span>
                          PATIENT SERIAL NUMBER
                        </span>

                        <strong>
                          RC-{String(appointments.length).padStart(3, "0")}
                        </strong>

                      </div>


                      <div className="ticket-grid">

                        <div>
                          <span>Hospital</span>
                          <b>
                            {a.hospital}
                          </b>
                        </div>


                        <div>
                          <span>Patient Name</span>
                          <b>
                            {a.name}
                          </b>
                        </div>


                        <div>
                          <span>Phone Number</span>
                          <b>
                            {a.phone}
                          </b>
                        </div>


                        <div>
                          <span>Doctor</span>
                          <b>
                            {a.doctor}
                          </b>
                        </div>


                        <div>
                          <span>Appointment Date</span>
                          <b>
                            {a.date}
                          </b>
                        </div>


                        <div>
                          <span>Appointment Time</span>
                          <b>
                            {a.time}
                          </b>
                        </div>

                      </div>


                      <div className="ticket-description">

                        <span>
                          DESCRIPTION / REASON FOR VISIT
                        </span>

                        <p>
                          {a.reason || "General consultation"}
                        </p>

                      </div>


                      <div className="ticket-footer">

                        <span>
                          Status: ✓ {a.status}
                        </span>

                        <span>
                          Please carry this confirmation
                          to the hospital.
                        </span>

                      </div>

                    </div>

                  );

                })()}


                <div className="ticket-actions">

                  <button
                    className="primary-btn"
                    onClick={() => window.print()}
                  >
                    🖨️ Print / Save PDF
                  </button>


                  <button
                    className="primary-btn"
                    onClick={() => {

                      const a = appointments[0];

                      const msg =
`RuralCare Appointment Confirmation

Hospital: ${a.hospital}
Patient: ${a.name}
Phone: ${a.phone}
Doctor: ${a.doctor}
Date: ${a.date}
Time: ${a.time}
Serial Number: RC-${String(appointments.length).padStart(3, "0")}

Reason:
${a.reason || "General consultation"}

Status: ${a.status}`;

                      window.open(
                        "https://wa.me/?text=" +
                        encodeURIComponent(msg),
                        "_blank"
                      );

                    }}
                  >
                    📲 Share on WhatsApp
                  </button>

                </div>

              </div>
            )}

          </section>
        )}

        {page === "benefits" && (

          <section>

            <PageTitle
              title="BPL / Government Health Benefits"
              sub="A step-by-step guidance screen — not an eligibility decision."
            />

            <div className="steps">

              <span
                className={
                  bplStep >= 1 ? "done" : ""
                }
              >
                1 Household
              </span>

              <span
                className={
                  bplStep >= 2 ? "done" : ""
                }
              >
                2 Documents
              </span>

              <span
                className={
                  bplStep >= 3 ? "done" : ""
                }
              >
                3 Facility
              </span>

              <span
                className={
                  bplStep >= 4 ? "done" : ""
                }
              >
                4 Verify
              </span>

            </div>

            <div className="form-card wide">

              <h2>
                {bplStep === 1
                  ? "Step 1 — Check your household documents"
                  : bplStep === 2
                  ? "Step 2 — Keep documents ready"
                  : bplStep === 3
                  ? "Step 3 — Visit an applicable government/empanelled facility"
                  : "Step 4 — Verify before treatment"}
              </h2>

              {bplStep === 1 && (
                <ul>
                  <li>
                    Keep your Aadhaar and
                    ration/PDS card details
                    available if applicable.
                  </li>

                  <li>
                    Ask the facility whether
                    you are in the currently
                    applicable eligible
                    household/category.
                  </li>
                </ul>
              )}

              {bplStep === 2 && (
                <ul>
                  <li>
                    Carry required identity
                    and scheme documents.
                  </li>

                  <li>
                    Ask the facility to verify
                    your current scheme status.
                  </li>
                </ul>
              )}

              {bplStep === 3 && (
                <ul>
                  <li>
                    Ask whether the required
                    procedure is covered under
                    the applicable package.
                  </li>

                  <li>
                    For non-emergency care,
                    follow the applicable
                    referral/authorization
                    process.
                  </li>
                </ul>
              )}

              {bplStep === 4 && (
                <div className="warning">
                  RuralCare does not decide
                  eligibility or promise that
                  every treatment is free.
                  Verify current eligibility,
                  package coverage and
                  authorization with the
                  facility.
                </div>
              )}

              <button
                className="primary-btn"
                onClick={() =>
                  setBplStep(
                    Math.min(4, bplStep + 1)
                  )
                }
              >
                {bplStep < 4
                  ? "Next step"
                  : "Start again"}
              </button>

              {bplStep === 4 && (
                <button
                  className="secondary-btn"
                  onClick={() => setBplStep(1)}
                >
                  Restart
                </button>
              )}

            </div>

          </section>
        )}

        {page === "insurance" && (
  <section>

    <PageTitle
      title="Life Insurance Policy"
      sub="Learn the basics of life insurance and family financial protection."
    />

    <div className="insurance-card">

      <div className="insurance-header">

        <div className="insurance-icon">
          🛡️
        </div>

        <div>
          <h2>
            Protect Your Family's Future
          </h2>

          <p>
            Life insurance can provide financial
            support to the nominee according to
            the policy terms.
          </p>
        </div>

      </div>

      <div className="insurance-grid">

        <div className="insurance-info">
          <b>🛡️ Financial Protection</b>

          <span>
            Provides financial support to the
            nominee when a covered policyholder
            dies, subject to policy terms.
          </span>
        </div>

        <div className="insurance-info">
          <b>💰 Coverage Amount</b>

          <span>
            Coverage depends on the selected
            insurance plan and the insurer.
          </span>
        </div>

        <div className="insurance-info">
          <b>📅 Policy Period</b>

          <span>
            Policy duration depends on the
            selected insurance product.
          </span>
        </div>

        <div className="insurance-info">
          <b>💳 Premium</b>

          <span>
            Premium depends on factors such as
            age, coverage, policy term and insurer.
          </span>
        </div>

        <div className="insurance-info">
          <b>📄 Documents</b>

          <span>
            The insurer may request identity,
            address and other required documents.
          </span>
        </div>

        <div className="insurance-info">
          <b>📝 Claim Guidance</b>

          <span>
            The nominee should contact the insurer
            and submit the required claim documents.
          </span>
        </div>

      </div>

      <div className="insurance-points">

        <div className="insurance-point">
          <strong>✓</strong>
          Family financial protection
        </div>

        <div className="insurance-point">
          <strong>✓</strong>
          Policy information in simple language
        </div>

        <div className="insurance-point">
          <strong>✓</strong>
          Basic claim guidance
        </div>

        <div className="insurance-point">
          <strong>✓</strong>
          Useful for rural families
        </div>

      </div>

      <div className="insurance-note">
        <b>Important:</b> RuralCare does not sell
        insurance or decide eligibility, premium,
        coverage or claim approval. Actual terms,
        eligibility and benefits depend on the
        insurance provider and selected policy.
        Users should verify details with the insurer
        before purchasing a policy.
      </div>

      <button
        className="insurance-btn"
        onClick={() =>
          notify(
            "Please verify policy details with the insurance provider."
          )
        }
      >
        🛡️ Explore Policy Information
      </button>

    </div>

  </section>
)}

        {page === "family" && (
          <section>

            <PageTitle
              title="Family Health"
              sub="Simple household care list stored locally on this device."
            />

            <form
              className="form-card"
              onSubmit={addFamily}
            >

              <div className="form-row">

                <label>
                  Name
                  <input
                    name="name"
                    required
                  />
                </label>

                <label>
                  Relation
                  <input
                    name="relation"
                    required
                  />
                </label>

                <label>
                  Age
                  <input
                    name="age"
                    type="number"
                    required
                  />
                </label>

              </div>

              <button className="primary-btn">
                Add Member
              </button>

            </form>

            <div className="list-grid">

              {family.map((x) => (
                <article
                  className="info-card"
                  key={x.id}
                >

                  <span className="tag blue">
                    FAMILY
                  </span>

                  <h3>{x.name}</h3>

                  <p>
                    {x.relation} · {x.age} years
                  </p>

                </article>
              ))}

            </div>

          </section>
        )}

        {page === "documents" && (
          <section>

            <PageTitle
              title="Documents"
              sub="Prototype document organizer. It does not verify authenticity or diagnose."
            />

            <div className="form-card">

              <label>
                Upload a document

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    e.target.files?.[0] &&
                    notify(
                      "Document selected locally for demo"
                    )
                  }
                />
              </label>

              <div className="document-note">
                Use this section to organize
                prescriptions, lab reports and
                discharge summaries. Do not
                upload real sensitive records to
                a demo device.
              </div>

            </div>

          </section>
        )}

        {page === "referrals" && (
          <section>

            <PageTitle
              title="Smart Referrals"
              sub="Track movement from local care to a higher facility."
            />

            <form
              className="form-card"
              onSubmit={addReferral}
            >

              <div className="form-row">

                <label>
                  Patient
                  <input
                    name="patient"
                    required
                  />
                </label>

                <label>
                  From
                  <input
                    name="from"
                    placeholder="PHC / clinic"
                    required
                  />
                </label>

                <label>
                  To
                  <input
                    name="to"
                    placeholder="CHC / District Hospital"
                    required
                  />
                </label>

              </div>

              <label>
                Reason

                <input
                  name="reason"
                  required
                />
              </label>

              <button className="primary-btn">
                Create Referral
              </button>

            </form>

            <div className="timeline">

              {referrals.map((r) => (
                <article key={r.id}>

                  <b>{r.patient}</b>

                  <span>
                    {r.from} → {r.to}
                  </span>

                  <small>
                    {r.status} · {r.reason}
                  </small>

                </article>
              ))}

            </div>

          </section>
        )}

        {page === "asha" && (
          <section>

            <PageTitle
              title="ASHA / Health Worker Mode"
              sub="Household visit, measurements and follow-up queue for the prototype."
            />

            <form
              className="form-card"
              onSubmit={addVisit}
            >

              <div className="form-row">

                <label>
                  Person / household

                  <input
                    name="person"
                    required
                  />
                </label>

                <label>
                  Visit date

                  <input
                    type="date"
                    name="date"
                    required
                  />
                </label>

              </div>

              <label>
                Task / follow-up

                <input
                  name="task"
                  placeholder="BP follow-up, pregnancy visit, diabetes follow-up..."
                  required
                />
              </label>

              <button className="primary-btn">
                Save Visit
              </button>

            </form>

            <div className="list-grid">

              {visits.map((v) => (
                <article
                  className="info-card"
                  key={v.id}
                >

                  <span className="tag orange">
                    {v.status}
                  </span>

                  <h3>{v.person}</h3>

                  <p>{v.task}</p>

                  <p>
                    📅 {v.date}
                  </p>

                </article>
              ))}

            </div>

          </section>
        )}

        {page === "dashboard" && (
          <section>

            <PageTitle
              title="Care Dashboard"
              sub="A simple view of activity stored in the prototype."
            />

            <div className="dashboard-grid">

              <Stat
                n={appointments.length}
                l="Appointments"
              />

              <Stat
                n={family.length}
                l="Family members"
              />

              <Stat
                n={referrals.length}
                l="Referrals"
              />

              <Stat
                n={visits.length}
                l="Health-worker visits"
              />

            </div>

            <div className="insight">

              <h3>
                Care journey
              </h3>

              <p>
                Patient → local facility →
                referral → higher facility →
                follow-up → care completion.
              </p>

            </div>

          </section>
        )}

        {page === "navigate" && (
          <section>

            <PageTitle
              title="Care Navigation"
              sub="Navigation support, not medical diagnosis."
            />

            <div className="journey">

              <div>
                👤
                <b>Patient</b>
                <small>
                  Describe your need
                </small>
              </div>

              <span>→</span>

              <div>
                🏥
                <b>PHC / Clinic</b>
                <small>
                  First contact
                </small>
              </div>

              <span>→</span>

              <div>
                🏨
                <b>CHC / District</b>
                <small>
                  Referral if needed
                </small>
              </div>

              <span>→</span>

              <div>
                🔔
                <b>Follow-up</b>
                <small>
                  Close the journey
                </small>
              </div>

            </div>

            <div className="form-card">

              <h3>
                Choose a pathway
              </h3>

              <button
                className="choice"
                onClick={() =>
                  go("hospitals")
                }
              >
                General health concern →
                Find nearby facility
              </button>

              <button
                className="choice"
                onClick={() =>
                  go("labs")
                }
              >
                Need diagnostics →
                Find laboratory
              </button>

              <button
                className="choice"
                onClick={() =>
                  go("doctors")
                }
              >
                Need consultation →
                Find doctor
              </button>

              <button
                className="choice"
                onClick={() =>
                  go("emergency")
                }
              >
                Emergency signs →
                Emergency support
              </button>

            </div>

          </section>
        )}

        {page === "emergency" && (
          <section>

            <div className="emergency">

              <span className="eyebrow">
                EMERGENCY SUPPORT
              </span>

              <h1>
                Need urgent help?
              </h1>

              <p>
                If someone is unconscious,
                has severe breathing
                difficulty, heavy bleeding,
                serious injury or another
                life-threatening situation,
                seek emergency help
                immediately.
              </p>

              <div className="emergency-actions">

                <a href="tel:108">
                  📞 Call 108
                </a>

                <button
                  onClick={() =>
                    go("hospitals")
                  }
                >
                  🏥 Find Emergency Hospital
                </button>

                <button
                  onClick={useLocation}
                >
                  📍 Connect Location
                </button>

              </div>

            </div>

          </section>
        )}

        {page === "login" && (
          <section>

            <PageTitle
              title="Doctors Login Portal"
              sub="Demo role-based portal for the hackathon prototype."
            />

            <div className="login-card">

            </div>
            <div className="login-card">

              {!doctorLogged ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    setDoctorLogged(true);

                    notify(
                      "Doctor demo login successful"
                    );
                  }}
                >

                  <label>
                    Doctor ID

                    <input
                      required
                      placeholder="doctor@example.com"
                    />
                  </label>

                  <label>
                    Password

                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                    />
                  </label>

                  <button className="primary-btn">
                    Login
                  </button>

                  <small>
                    Demo only — no real
                    authentication or patient
                    data is connected.
                  </small>

                </form>
              ) : (
                <div>

                  <span className="tag green">
                    LOGGED IN
                  </span>

                  <h2>
                    Doctor Dashboard
                  </h2>

                  <p>
                    View demo appointments,
                    referrals and follow-up
                    tasks.
                  </p>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      go("dashboard")
                    }
                  >
                    Open Dashboard
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      setDoctorLogged(false)
                    }
                  >
                    Logout
                  </button>

                </div>
              )}

            </div>

          </section>
        )}

      </main>

      <div className="voice-box">

  {voiceMessage && (
    <div className="voice-message">

      <b>
        {isListening
          ? "🎙️ Listening"
          : "🎙️ Voice Assistant"}
      </b>

      <span>
        {voiceMessage}
      </span>

    </div>
  )}

  {!voiceLanguage ? (
    <>
      <div className="voice-language-question">
        Which is your comfortable language?
      </div>

      <div className="voice-language-buttons">

        <button
          onClick={() => {
            setVoiceLanguage("kn");
            setVoiceMessage(
              "ಸರಿ, ನಿಮಗೆ ಯಾವ ಆಯ್ಕೆ ಬೇಕಾಗಿದೆ?"
            );
            speak(
              "ಸರಿ, ನಿಮಗೆ ಯಾವ ಆಯ್ಕೆ ಬೇಕಾಗಿದೆ?"
            );
          }}
        >
          ಕನ್ನಡ
        </button>

        <button
          onClick={() => {
            setVoiceLanguage("en");
            setVoiceMessage(
              "Okay, which option would you like?"
            );
            speak(
              "Okay, which option would you like?"
            );
          }}
        >
          English
        </button>

        <button
          onClick={() => {
            setVoiceLanguage("hi");
            setVoiceMessage(
              "ठीक है, आपको कौन सा विकल्प चाहिए?"
            );
            speak(
              "ठीक है, आपको कौन सा विकल्प चाहिए?"
            );
          }}
        >
          हिंदी
        </button>

      </div>
    </>
  ) : (
    <>
      <button
        className={
          isListening
            ? "voice-btn listening"
            : "voice-btn"
        }
        onClick={
          isListening
            ? stopVoice
            : startVoice
        }
      >
        {isListening
          ? "⏹ Stop"
          : "🎙️ Speak Your Choice"}
      </button>

      <button
        className="voice-reset-btn"
        onClick={() => {
          setVoiceLanguage(null);
          setVoiceMessage(
            "Which is your comfortable language?"
          );
        }}
      >
        🌐 Change Language
      </button>
    </>
  )}

  <small>
    Try: “Doctors”, “Hospitals”,
    “Labs”, “Pharmacy”, “Emergency”
  </small>

</div>

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}

      <footer>

        <div>
          <b>✚ RuralCare</b>

          <p>
            Accessible healthcare navigation
            for rural communities.
          </p>
        </div>

        <div>
          <b>Prototype</b>

          <p>
            Demo facilities and demo payment
            are not real services.
          </p>
        </div>

        <div>
          <b>Offline-ready</b>

          <p>
            Local records use browser
            localStorage.
          </p>
        </div>

      </footer>

    </div>
  );
}

function PageTitle({ title, sub }) {
  return (
    <div className="page-title">

      <span className="eyebrow">
        RURALCARE
      </span>

      <h1>{title}</h1>

      <p>{sub}</p>

    </div>
  );
}

function Stat({ n, l }) {
  return (
    <div className="stat">
      <b>{n}</b>
      <span>{l}</span>
    </div>
  );
}

export default App;