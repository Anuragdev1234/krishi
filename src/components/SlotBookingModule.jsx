import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Truck, 
  AlertTriangle, 
  CheckCircle, 
  QrCode, 
  Download, 
  Printer, 
  Camera, 
  UploadCloud, 
  Smartphone, 
  MessageSquare, 
  UserCheck, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SlotBookingModule({ farmerUser, mandis, onAppointmentBooked, t }) {
  const [selectedMandiId, setSelectedMandiId] = useState(mandis[0].id);
  const [cropType, setCropType] = useState(farmerUser?.landRecords?.[0]?.crop || 'Paddy (Common Grade)');
  const [tonnage, setTonnage] = useState(
    farmerUser?.landRecords?.[0]?.maxPermittedTonnes ? String(farmerUser.landRecords[0].maxPermittedTonnes) : '8.5'
  );
  const [procureDate, setProcureDate] = useState('2026-09-27');
  const [selectedSlotTime, setSelectedSlotTime] = useState('10:00 AM - 11:00 AM');
  const [vehicleType, setVehicleType] = useState('Tractor Trolley');
  const [vehicleNo, setVehicleNo] = useState('UP-32-AB-4412');
  const [hasSmartphone, setHasSmartphone] = useState(true);

  // Sync crop and permissible tonnage when farmerUser changes (e.g. newly enrolled farmer)
  useEffect(() => {
    if (farmerUser?.landRecords?.[0]) {
      if (farmerUser.landRecords[0].crop) {
        setCropType(farmerUser.landRecords[0].crop);
      }
      if (farmerUser.landRecords[0].maxPermittedTonnes) {
        setTonnage(String(farmerUser.landRecords[0].maxPermittedTonnes));
      }
    }
  }, [farmerUser]);
  
  // Crop sample inspection state
  const [sampleImage, setSampleImage] = useState(null);
  const [sampleQualityNotes, setSampleQualityNotes] = useState('Clean grain, sun-dried for 2 days.');
  const [inspectorStatus, setInspectorStatus] = useState('ASSIGNED'); // ASSIGNED, VERIFYING, APPROVED
  const [inspectorName, setInspectorName] = useState('Er. Anil Swarup (Agronomy Assayer #842)');

  const [bookedAppointment, setBookedAppointment] = useState(null);

  const selectedMandi = mandis.find(m => m.id === Number(selectedMandiId)) || mandis[0];

  // Dynamic slot generation with capacity estimation
  const slotOptions = [
    { time: '08:00 AM - 09:00 AM', status: 'AVAILABLE', remainingTonnes: 45, vehiclesLeft: 4 },
    { time: '09:00 AM - 10:00 AM', status: 'AVAILABLE', remainingTonnes: 30, vehiclesLeft: 2 },
    { time: '10:00 AM - 11:00 AM', status: 'AVAILABLE', remainingTonnes: 60, vehiclesLeft: 5 },
    { time: '11:00 AM - 12:00 PM', status: 'ALMOST_FULL', remainingTonnes: 12, vehiclesLeft: 1 },
    { time: '12:00 PM - 01:00 PM', status: 'FULL', remainingTonnes: 0, vehiclesLeft: 0 },
    { time: '02:00 PM - 03:00 PM', status: 'AVAILABLE', remainingTonnes: 75, vehiclesLeft: 6 },
    { time: '03:00 PM - 04:00 PM', status: 'AVAILABLE', remainingTonnes: 50, vehiclesLeft: 4 },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSampleImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookSlot = (e) => {
    e.preventDefault();

    const tokenNum = `TK-${selectedMandi.code.slice(0, 2)}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppt = {
      token: tokenNum,
      farmerName: farmerUser ? farmerUser.name : 'Ram Prakash Verma',
      mobile: farmerUser ? farmerUser.mobile : '9876543210',
      aadhaarMasked: farmerUser ? farmerUser.aadhaarMasked : 'XXXX-XXXX-4589',
      khasraNo: farmerUser ? farmerUser.landRecords[0]?.khasra : '214/1-Ka',
      crop: cropType,
      tonnage: parseFloat(tonnage),
      mandiId: selectedMandi.id,
      mandiName: selectedMandi.name,
      date: procureDate,
      slotTime: selectedSlotTime,
      vehicleType,
      vehicleNo: vehicleNo.toUpperCase(),
      hasSmartphone,
      sampleImageUrl: sampleImage,
      inspectorAssigned: inspectorName,
      preInspectionStatus: sampleImage ? 'SAMPLE_UPLOADED_PENDING_REVIEW' : 'PHYSICAL_INSPECTION_AT_GATE',
      status: 'SCHEDULED',
      moisturePercent: null,
      qualityGrade: null,
      mspRatePerQuintal: cropType.includes('Soybean') ? 4892 : cropType.includes('Grade A') ? 2380 : 2320,
      totalPayable: null,
      queuePosition: Math.floor(Math.random() * 5) + 2,
      estimatedWaitMins: Math.floor(Math.random() * 25) + 15
    };

    setBookedAppointment(newAppt);
    onAppointmentBooked(newAppt);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Module Header */}
        <div className="bg-linear-to-r from-amber-700 to-amber-900 p-6 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-600/80 rounded-xl">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{t.card2Title}</h2>
              <p className="text-xs text-amber-100 mt-0.5">{t.card2Desc}</p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {!bookedAppointment ? (
            <form onSubmit={handleBookSlot} className="space-y-6">
              
              {/* Step 1: Select Mandi */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
                  {t.selectMandi}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mandis.map((m) => {
                    const isSelected = Number(selectedMandiId) === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMandiId(m.id)}
                        className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/50'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-slate-900">{m.name}</h4>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            m.status === 'CONGESTED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {m.district}, {m.state} • {m.activeBridges} Weighbridges
                        </p>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-1.5">
                          <span>Capacity: {m.currentBookedTonnes}/{m.dailyCapacityTonnes} MT</span>
                          <span className="font-semibold text-emerald-700">~{m.liveWaitMins}m avg wait</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Crop Details & Tonnage Validation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.selectCrop}
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Paddy (Common Grade)">धान / Paddy (Common Grade) - MSP ₹2,320/Qtl</option>
                    <option value="Paddy (Grade A)">धान / Paddy (Grade A) - MSP ₹2,380/Qtl</option>
                    <option value="Wheat (Rabi)">गेहूं / Wheat - MSP ₹2,275/Qtl</option>
                    <option value="Soybean">सोयाबीन / Soybean - MSP ₹4,892/Qtl</option>
                    <option value="Maize">मक्का / Maize - MSP ₹2,090/Qtl</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {t.enterTonnage}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="40"
                      value={tonnage}
                      onChange={(e) => setTonnage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                    <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">MT</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Calculated MSP Value: ~₹ {(parseFloat(tonnage || 0) * 10 * (cropType.includes('Soybean') ? 4892 : cropType.includes('Grade A') ? 2380 : 2320)).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* NEW: Crop Sample Photo Upload & Assigned Quality Inspector */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Camera className="w-4 h-4 text-amber-800" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Mandatory Pre-Mandi Crop Sample Inspection & Photo Verification
                  </h4>
                </div>
                <p className="text-xs text-amber-800 mb-3 leading-relaxed">
                  To prevent price deductions or rejection at the mandi gate due to high moisture or foreign particles, upload a photo of your harvested grain sample. <strong>A certified government agricultural inspector will review your sample and confirm price entitlement before you depart for the mandi.</strong>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Upload Crop Sample Image (Optional for basic phones):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="block w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-700 file:text-white hover:file:bg-amber-800 cursor-pointer"
                    />

                    {sampleImage && (
                      <div className="mt-2 flex items-center space-x-2">
                        <img src={sampleImage} alt="Crop Sample Preview" className="w-16 h-16 object-cover rounded-lg border border-amber-300 shadow-2xs" />
                        <span className="text-[11px] font-semibold text-emerald-800">✓ Sample image attached</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Quality Inspector</span>
                    <strong className="text-slate-900 block mt-0.5">{inspectorName}</strong>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Inspector Contact: <strong>+91 94150-INSPECT</strong> • Quality SLA: Review within 4 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: Date & Hourly Slot Picker */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
                    <Clock className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
                    {t.availableSlots}
                  </label>
                  <input
                    type="date"
                    value={procureDate}
                    onChange={(e) => setProcureDate(e.target.value)}
                    className="px-2.5 py-1 text-xs border border-slate-300 rounded-md font-semibold text-slate-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {slotOptions.map((s, idx) => {
                    const isFull = s.status === 'FULL';
                    const isSelected = selectedSlotTime === s.time;
                    return (
                      <button
                        type="button"
                        key={idx}
                        disabled={isFull}
                        onClick={() => setSelectedSlotTime(s.time)}
                        className={`p-3 rounded-lg border text-left transition-all relative ${
                          isFull
                            ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-500'
                            : 'bg-white border-slate-200 hover:border-amber-400'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold text-slate-800">{s.time}</span>
                          {isFull ? (
                            <span className="text-[10px] text-red-600 font-bold">FULL</span>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-bold">{s.vehiclesLeft} slots left</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Remaining capacity: {s.remainingTonnes} MT
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Phone Type (Smartphone QR vs Feature Phone SMS & Pull SMS) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Mobile Device / Delivery Method Selection
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setHasSmartphone(true)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      hasSmartphone ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-emerald-700" />
                      <strong className="text-xs text-slate-900">Smartphone User</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Generates digital scannable QR Code token and Sandes instant notification.
                    </p>
                  </div>

                  <div
                    onClick={() => setHasSmartphone(false)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      !hasSmartphone ? 'border-amber-600 bg-amber-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-amber-700" />
                      <strong className="text-xs text-slate-900">Basic Feature Phone (No Internet)</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Issues 16-character alphanumeric SMS token. Enables Pull-SMS query via <strong>166 / 51969</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 5: Vehicle Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center">
                    <Truck className="w-3.5 h-3.5 text-slate-600 mr-1" />
                    Transport Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                  >
                    <option value="Tractor Trolley">Tractor Trolley / ट्रैक्टर ट्रॉली</option>
                    <option value="Mini Truck (Pick-up)">Mini Truck (Pick-up) / पिकअप गाड़ी</option>
                    <option value="Commercial Truck (6-10 Wheel)">Commercial Heavy Truck (ट्रक)</option>
                    <option value="Bullock Cart">Bullock Cart / बैलगाड़ी</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Vehicle Registration Number
                  </label>
                  <input
                    type="text"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    placeholder="UP-32-AB-4412"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono uppercase"
                    required
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-linear-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-extrabold rounded-xl text-base shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5 text-amber-300" />
                  <span>{t.bookBtn}</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Instant DLT SMS Template: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">1407168920194</code> dispatched via C-DAC Mobile Seva MSDG.
                </p>
              </div>

            </form>
          ) : (
            /* Digital Receipt & Scannable QR Token or Basic Phone Text Voucher */
            <div className="space-y-6">
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 p-6 rounded-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-emerald-200 pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest block">
                      OFFICIAL MANDI PROCUREMENT E-TOKEN & INSPECTION SLIP
                    </span>
                    <h3 className="text-2xl font-black font-mono text-emerald-950 mt-0.5">
                      {bookedAppointment.token}
                    </h3>
                  </div>

                  {bookedAppointment.hasSmartphone ? (
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-300 shadow-xs flex items-center space-x-2">
                      <QrCode className="w-12 h-12 text-slate-800" />
                      <div className="text-[10px] text-slate-500 font-mono">
                        <span>SCAN AT</span><br />
                        <strong>MANDI ENTRY</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-100 border border-amber-300 p-2.5 rounded-xl text-amber-900 text-xs">
                      <strong>FEATURE PHONE SMS PASS</strong><br />
                      <span>SMS Code: <strong>{bookedAppointment.token.replace(/[^0-9]/g, '').slice(-6)}</strong></span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Farmer Name:</span>
                    <strong className="text-slate-900 text-sm">{bookedAppointment.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Commodity:</span>
                    <strong className="text-slate-900 text-sm">{bookedAppointment.crop}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Declared Quantity:</span>
                    <strong className="text-slate-900 text-sm">{bookedAppointment.tonnage} MT</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Scheduled Date & Time:</span>
                    <strong className="text-emerald-800 text-sm font-bold">
                      {bookedAppointment.date} ({bookedAppointment.slotTime})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Procurement Center:</span>
                    <strong className="text-slate-900">{bookedAppointment.mandiName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Vehicle Reg No:</span>
                    <strong className="text-slate-900 font-mono">{bookedAppointment.vehicleNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Virtual Queue Position:</span>
                    <strong className="text-amber-700 font-bold">#{bookedAppointment.queuePosition} in line</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Est. Waiting Time (EWT):</span>
                    <strong className="text-emerald-700 font-bold">~{bookedAppointment.estimatedWaitMins} Minutes</strong>
                  </div>
                </div>

                {/* Pre-Inspection & Quality Assayer Guarantee Notice */}
                <div className="mt-4 pt-3 border-t border-emerald-200 flex flex-wrap justify-between items-center gap-2 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-900">
                    <UserCheck className="w-4 h-4 text-emerald-700" />
                    <span>Assigned Assayer: <strong>{bookedAppointment.inspectorAssigned}</strong></span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded font-bold text-[10px]">
                    Price Guarantee: Full MSP ₹{bookedAppointment.mspRatePerQuintal}/Qtl upon arrival moisture clearance
                  </span>
                </div>
              </div>

              {/* Omnichannel Delivery Box */}
              {!bookedAppointment.hasSmartphone ? (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center">
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Feature Phone SMS Pass & Free Pull-SMS Integration
                  </p>
                  <p>
                    A text message has been dispatched to <strong>+91 {bookedAppointment.mobile}</strong>. To check live queue from your keypad phone anytime without internet, send:
                  </p>
                  <div className="p-2 bg-white rounded border border-amber-300 font-mono text-[11px] text-amber-950 font-bold">
                    SMS: <code>KHARIF STATUS {bookedAppointment.token}</code> to <strong>166</strong> or <strong>51969</strong>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-emerald-800">
                    ✓ Digital Confirmation & Sandes Alert Sent
                  </p>
                  <p className="text-slate-500">
                    "Token {bookedAppointment.token} generated. QR pass saved in app. Arrive 15 mins prior to avoid queue delays. - Govt of India"
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setBookedAppointment(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Book Another Appointment
                </button>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Token & Assay Slip</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
