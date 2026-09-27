import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// In-Memory Database Store for live operations
let mandis = [
  {
    id: 1,
    code: "UP-LKO-01",
    name: "Lucknow Central Mandi (Dubagga)",
    district: "Lucknow",
    state: "Uttar Pradesh",
    activeBridges: 4,
    avgServiceMins: 14,
    dailyCapacityTonnes: 320,
    currentBookedTonnes: 215,
    status: "NORMAL",
    liveWaitMins: 28
  },
  {
    id: 2,
    code: "PB-LDH-03",
    name: "Khanna Grain Market (Asia's Largest)",
    district: "Ludhiana",
    state: "Punjab",
    activeBridges: 8,
    avgServiceMins: 10,
    dailyCapacityTonnes: 950,
    currentBookedTonnes: 680,
    status: "NORMAL",
    liveWaitMins: 18
  },
  {
    id: 3,
    code: "MP-BPL-02",
    name: "Bhopal Karond Mandi",
    district: "Bhopal",
    state: "Madhya Pradesh",
    activeBridges: 3,
    avgServiceMins: 18,
    dailyCapacityTonnes: 260,
    currentBookedTonnes: 250,
    status: "CONGESTED",
    liveWaitMins: 55
  },
  {
    id: 4,
    code: "HR-KRN-01",
    name: "Karnal Anaj Mandi",
    district: "Karnal",
    state: "Haryana",
    activeBridges: 5,
    avgServiceMins: 12,
    dailyCapacityTonnes: 480,
    currentBookedTonnes: 290,
    status: "NORMAL",
    liveWaitMins: 22
  }
];

let appointments = [
  {
    token: "TK-UP-2026-0042",
    farmerName: "Ram Prakash Verma",
    mobile: "9876543210",
    aadhaarMasked: "XXXX-XXXX-4589",
    khasraNo: "214/1-Ka",
    verifiedLandHa: 3.2,
    crop: "Paddy (Common Grade)",
    tonnage: 8.5,
    mandiId: 1,
    mandiName: "Lucknow Central Mandi (Dubagga)",
    date: "2026-09-26",
    slotTime: "10:00 AM - 11:00 AM",
    vehicleType: "Tractor Trolley",
    vehicleNo: "UP-32-AB-4412",
    status: "TESTING_IN_PROGRESS",
    moisturePercent: 14.8,
    foreignMatter: 1.1,
    qualityGrade: "Grade-A",
    grossWeightKg: 12450,
    tareWeightKg: 3950,
    netWeightKg: 8500,
    mspRatePerQuintal: 2320,
    totalPayable: 197200,
    utrNo: "SBIN826294719283",
    queuePosition: 3,
    estimatedWaitMins: 22
  }
];

let notificationLogs = [];

// Helper: Calculate EWT dynamically
function calculateEwt(mandiId, queuePosition) {
  const m = mandis.find(item => item.id === Number(mandiId));
  if (!m) return 15;
  const bridges = Math.max(1, m.activeBridges);
  return Math.ceil((queuePosition / bridges) * m.avgServiceMins);
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: "HEALTHY",
    service: "SAP-QMP Backend API",
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime()
  });
});

// 2. OTP Generation (Simulating C-DAC MSDG)
app.post('/api/auth/otp/generate', (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
    return res.status(400).json({ error: "Invalid 10-digit mobile number." });
  }

  const txnId = `TXN-${Date.now()}`;
  notificationLogs.push({
    channel: "SMS_MSDG",
    dltTemplateId: "1407168920194",
    recipient: mobileNumber,
    message: `Your OTP for Agricultural Procurement login is 123456. Valid for 10 mins. - Govt of India`,
    timestamp: new Date().toISOString()
  });

  res.json({
    status: "SUCCESS",
    txnId,
    message: "OTP dispatched via C-DAC Mobile Seva MSDG",
    demoOtp: "123456"
  });
});

// 3. OTP Verification & Bhulekh Land Sync
app.post('/api/auth/otp/verify', (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (otp !== "123456") {
    return res.status(401).json({ error: "Invalid OTP code." });
  }

  // Cross-referenced data from Bhulekh Land Registry
  res.json({
    farmerId: 10482,
    name: "Ram Prakash Verma",
    mobile: mobileNumber,
    aadhaarMasked: "XXXX-XXXX-4589",
    state: "Uttar Pradesh",
    district: "Lucknow",
    village: "Dubagga Khurd",
    bankMasked: "SBI A/C XXXX-9124 (Aadhaar Seeded)",
    landRecords: [
      {
        khasra: "214/1-Ka",
        areaHa: 3.2,
        crop: "Paddy (Common Grade)",
        maxPermittedTonnes: 12.8,
        procuredSoFar: 0.0
      },
      {
        khasra: "318/2",
        areaHa: 1.5,
        crop: "Wheat (Upcoming Rabi)",
        maxPermittedTonnes: 6.0,
        procuredSoFar: 0.0
      }
    ]
  });
});

// 4. Mandis & Live Queue Status
app.get('/api/mandis', (req, res) => {
  res.json(mandis);
});

// 5. Update Mandi Weighbridges (Dynamic Capacity Override)
app.patch('/api/mandis/:id/weighbridges', (req, res) => {
  const mandiId = Number(req.params.id);
  const { delta } = req.body;

  const m = mandis.find(item => item.id === mandiId);
  if (!m) return res.status(404).json({ error: "Mandi not found" });

  m.activeBridges = Math.max(1, m.activeBridges + (delta || 0));
  m.liveWaitMins = Math.round(m.avgServiceMins * (6 / m.activeBridges));

  res.json(m);
});

// 6. Slot Booking Endpoint
app.post('/api/appointments/book', (req, res) => {
  const {
    farmerName,
    mobile,
    aadhaarMasked,
    mandiId,
    crop,
    tonnage,
    date,
    slotTime,
    vehicleType,
    vehicleNo
  } = req.body;

  const targetMandi = mandis.find(m => m.id === Number(mandiId));
  if (!targetMandi) return res.status(404).json({ error: "Selected Mandi not found." });

  const numTonnage = parseFloat(tonnage) || 0;

  // Capacity constraint check
  if (targetMandi.currentBookedTonnes + numTonnage > targetMandi.dailyCapacityTonnes) {
    return res.status(409).json({
      error: "Mandi capacity saturated for this date window. Please select alternate center or date."
    });
  }

  // Update capacity
  targetMandi.currentBookedTonnes += numTonnage;

  const token = `TK-${targetMandi.code.slice(0, 2)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const queuePos = Math.floor(Math.random() * 4) + 1;
  const ewt = calculateEwt(mandiId, queuePos);

  const newAppt = {
    token,
    farmerName: farmerName || "Ram Prakash Verma",
    mobile: mobile || "9876543210",
    aadhaarMasked: aadhaarMasked || "XXXX-XXXX-4589",
    khasraNo: "214/1-Ka",
    crop: crop || "Paddy (Common Grade)",
    tonnage: numTonnage,
    mandiId: targetMandi.id,
    mandiName: targetMandi.name,
    date: date || "2026-09-27",
    slotTime: slotTime || "10:00 AM - 11:00 AM",
    vehicleType: vehicleType || "Tractor Trolley",
    vehicleNo: (vehicleNo || "UP-32-AB-4412").toUpperCase(),
    status: "SCHEDULED",
    moisturePercent: null,
    foreignMatter: null,
    qualityGrade: null,
    grossWeightKg: null,
    tareWeightKg: null,
    netWeightKg: null,
    mspRatePerQuintal: (crop || "").includes("Paddy") ? 2320 : 2275,
    totalPayable: null,
    utrNo: null,
    queuePosition: queuePos,
    estimatedWaitMins: ewt
  };

  appointments.unshift(newAppt);

  // Log C-DAC MSDG confirmation
  notificationLogs.push({
    channel: "SMS_MSDG",
    dltTemplateId: "1407168920194",
    recipient: newAppt.mobile,
    message: `Dear Farmer, Token ${token} confirmed for ${crop} at ${targetMandi.name}. - Govt of India`,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newAppt);
});

// 7. Track Token / Mobile
app.get('/api/appointments/track/:query', (req, res) => {
  const q = req.params.query.trim().toUpperCase();
  const found = appointments.find(a => a.token.toUpperCase() === q || a.mobile.includes(q));

  if (!found) {
    return res.status(404).json({ error: "No appointment found matching query." });
  }

  res.json(found);
});

// 8. List All Appointments (For Mandi Operator)
app.get('/api/appointments', (req, res) => {
  const mandiId = req.query.mandiId ? Number(req.query.mandiId) : null;
  if (mandiId) {
    return res.json(appointments.filter(a => a.mandiId === mandiId));
  }
  res.json(appointments);
});

// 9. Transition Appointment Stage (Gate check-in, Assay, Weighment, DBT)
app.patch('/api/appointments/:token/status', (req, res) => {
  const token = req.params.token.toUpperCase();
  const { nextStatus } = req.body;

  const appt = appointments.find(a => a.token === token);
  if (!appt) return res.status(404).json({ error: "Token not found." });

  appt.status = nextStatus;

  if (nextStatus === "CHECKED_IN") {
    appt.queuePosition = Math.max(1, appt.queuePosition - 1);
  } else if (nextStatus === "TESTING_IN_PROGRESS") {
    appt.moisturePercent = 14.4;
    appt.foreignMatter = 0.8;
    appt.qualityGrade = "Grade-A";
  } else if (nextStatus === "WEIGHMENT_COMPLETED") {
    const net = appt.tonnage * 1000;
    appt.grossWeightKg = net + 3600;
    appt.tareWeightKg = 3600;
    appt.netWeightKg = net;
    appt.totalPayable = Math.round((net / 100) * appt.mspRatePerQuintal);
  } else if (nextStatus === "PAYOUT_INITIATED") {
    appt.utrNo = `DBT${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    appt.queuePosition = 0;
    appt.estimatedWaitMins = 0;
  }

  res.json(appt);
});

// 10. IoT Ingestion Endpoint (from Weighbridge Python script)
app.post('/api/operator/weighment', (req, res) => {
  const {
    token_number,
    gross_weight_kg,
    tare_weight_kg,
    net_weight_kg,
    moisture_percent,
    quality_grade
  } = req.body;

  const appt = appointments.find(a => a.token === token_number);
  if (!appt) return res.status(404).json({ error: "Appointment token not found for IoT ingestion." });

  appt.status = "WEIGHMENT_COMPLETED";
  appt.grossWeightKg = gross_weight_kg;
  appt.tareWeightKg = tare_weight_kg;
  appt.netWeightKg = net_weight_kg;
  appt.moisturePercent = moisture_percent;
  appt.qualityGrade = quality_grade;
  appt.totalPayable = Math.round((net_weight_kg / 100) * appt.mspRatePerQuintal);

  res.json({
    status: "RECORDED",
    message: "IoT readings bound to procurement token successfully",
    appointment: appt
  });
});

// 11. View DLT SMS Notification Dispatch Log
app.get('/api/notifications', (req, res) => {
  res.json(notificationLogs);
});

// Serve compiled static assets directly
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[SAP-QMP] Production Portal & API operational on http://localhost:${PORT}`);
});
