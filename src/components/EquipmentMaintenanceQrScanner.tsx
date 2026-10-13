import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { QRCodeSVG } from 'qrcode.react';

export interface EquipmentMaintenanceLog {
  id: string;
  date: string;
  type: string;
  technician: string;
  status: 'Lulus Uji & Siap' | 'Perawatan Rutin' | 'Selesai Kalibrasi';
  notes: string;
  bastNumber: string;
}

export interface EquipmentItem {
  qrTag: string;
  name: string;
  category: string;
  serialNumber: string;
  licensePlate?: string;
  assignedHub: string;
  condition: 'Optimal / 100% Siap' | 'Dalam Perawatan' | 'Tervalidasi';
  nextServiceDate: string;
  totalOperatingHours: number;
  logs: EquipmentMaintenanceLog[];
}

export const SAMPLE_EQUIPMENT_DATABASE: Record<string, EquipmentItem> = {
  'KGR-EQ-TRK-01': {
    qrTag: 'KGR-EQ-TRK-01',
    name: 'Truk Tangki Vakum Isuzu Giga 6.000L',
    category: 'Armada & Tangki Lumpur Tinja/STP',
    serialNumber: 'ISZ-GIGA-2024-0981',
    licensePlate: 'B 9182 KGR',
    assignedHub: 'Pos Utama Bekasi Barat',
    condition: 'Optimal / 100% Siap',
    nextServiceDate: '15 November 2026',
    totalOperatingHours: 1420,
    logs: [
      {
        id: 'LOG-TRK-01-01',
        date: '08 Oktober 2026',
        type: 'Ganti Oli Mesin & Filter Solar 50.000 KM',
        technician: 'Bengkel Resmi Isuzu Cikarang',
        status: 'Lulus Uji & Siap',
        notes: 'Oli mesin 15W-40 diganti, filter bahan bakar ganti baru. Tekanan oli stabil 4.2 bar.',
        bastNumber: 'BAST-ISZ-1026-081',
      },
      {
        id: 'LOG-TRK-01-02',
        date: '25 September 2026',
        type: 'Uji Tekanan & Kalibrasi Manometer Vakum 0.9 Bar',
        technician: 'Ahmad Riyadi (Teknisi K3 KGR)',
        status: 'Selesai Kalibrasi',
        notes: 'Uji kevakuman tangki mencapai -0.88 bar tanpa kebocoran seal manhole.',
        bastNumber: 'CAL-KGR-0926-44',
      },
      {
        id: 'LOG-TRK-01-03',
        date: '12 September 2026',
        type: 'Penggantian Paking Karet Manhole & Valve 4 Inci',
        technician: 'Tim Bengkel Internal KGR Bekasi',
        status: 'Perawatan Rutin',
        notes: 'Gasket NBR diganti untuk mencegah rembesan bau asam lumpur septic tank.',
        bastNumber: 'MAINT-KGR-0926-12',
      },
      {
        id: 'LOG-TRK-01-04',
        date: '01 Agustus 2026',
        type: 'Pembersihan Tangki & Desinfeksi Bak Lumpur',
        technician: 'Dedi Mulya & Regu Kebersihan',
        status: 'Lulus Uji & Siap',
        notes: 'Pencucian interior tangki di IPLT Sumur Batu, bebas kerak amonia.',
        bastNumber: 'BAST-IPLT-0826-004',
      },
    ],
  },
  'KGR-EQ-PMP-02': {
    qrTag: 'KGR-EQ-PMP-02',
    name: 'Pompa Vakum Heavy-Duty Jurop / Roots Blower',
    category: 'Sistem Penghisap Lumpur Berat & STP Pabrik',
    serialNumber: 'JRP-PUMP-HD-8821',
    assignedHub: 'Pos Cikarang Industrial Hub',
    condition: 'Optimal / 100% Siap',
    nextServiceDate: '20 November 2026',
    totalOperatingHours: 980,
    logs: [
      {
        id: 'LOG-PMP-02-01',
        date: '02 Oktober 2026',
        type: 'Flushing Oil Pump & Penggantian Vane Blade',
        technician: 'Hendra Prasetyo (Lead Mechanic)',
        status: 'Lulus Uji & Siap',
        notes: 'Bilah bilah baling-baling karbon diperiksa ketebalan, oli hidrolik diganti oli khusus vakum.',
        bastNumber: 'BAST-PMP-1026-02',
      },
      {
        id: 'LOG-PMP-02-02',
        date: '18 September 2026',
        type: 'Pengecekan Suhu Operasional & Vibrasi Bantalan',
        technician: 'Inspektor Alat Berat KGR',
        status: 'Perawatan Rutin',
        notes: 'Suhu operasional 62°C pada putaran 3.200 RPM, getaran di bawah ambang batas toleransi.',
        bastNumber: 'CHK-VIB-0926-18',
      },
      {
        id: 'LOG-PMP-02-03',
        date: '28 Agustus 2026',
        type: 'Penggantian Safety Relief Valve Tekanan Berlebih',
        technician: 'Bengkel Presisi Cikarang',
        status: 'Selesai Kalibrasi',
        notes: 'Katup pengaman disetel meletup pada tekanan > 1.2 bar untuk proteksi tangki.',
        bastNumber: 'CAL-VALVE-0826-28',
      },
    ],
  },
  'KGR-EQ-JET-03': {
    qrTag: 'KGR-EQ-JET-03',
    name: 'Mesin Water Jetting Tekanan Tinggi 250 Bar (Roto-Jet)',
    category: 'Unit Pembersih Saluran Mampet & Pengeruk Lemak',
    serialNumber: 'RNR-JET-250B-441',
    assignedHub: 'Pos Tambun - Cibitung',
    condition: 'Optimal / 100% Siap',
    nextServiceDate: '28 November 2026',
    totalOperatingHours: 640,
    logs: [
      {
        id: 'LOG-JET-03-01',
        date: '05 Oktober 2026',
        type: 'Penggantian Nozzle Roto-Jet 3/8" & Selang 100 Meter',
        technician: 'Teknisi Saluran Tambun',
        status: 'Lulus Uji & Siap',
        notes: 'Uji tembak air bersih 220 bar lancar melubangi endapan lemak beku.',
        bastNumber: 'BAST-JET-1026-05',
      },
      {
        id: 'LOG-JET-03-02',
        date: '20 September 2026',
        type: 'Servis Berkala Pompa Plunger Triplex (Oli ISO VG 68)',
        technician: 'Bengkel Mesin Jetting Bekasi',
        status: 'Perawatan Rutin',
        notes: 'Plunger keramik dibersihkan dari pasir halus, filter inlet air diganti.',
        bastNumber: 'MAINT-PLUNG-0926-20',
      },
    ],
  },
  'KGR-EQ-GAS-04': {
    qrTag: 'KGR-EQ-GAS-04',
    name: 'Multi-Gas Detector Portabel H2S/CH4/CO/O2 Confined Space',
    category: 'Instrumen K3 Keselamatan Ruang Terbatas',
    serialNumber: 'MSA-4X-GAS-9011',
    assignedHub: 'Semua Pos Lapangan PT KGR',
    condition: 'Tervalidasi',
    nextServiceDate: '10 Desember 2026',
    totalOperatingHours: 320,
    logs: [
      {
        id: 'LOG-GAS-04-01',
        date: '10 Oktober 2026',
        type: 'Kalibrasi Sensor Elektrokimia Gas H2S 25 ppm',
        technician: 'Balai Kalibrasi & Lab K3 Jakarta',
        status: 'Selesai Kalibrasi',
        notes: 'Hasil bump test akurat 100%. Alarm audio 95dB dan strobo merah berfungsi prima.',
        bastNumber: 'SERT-K3-1026-881',
      },
      {
        id: 'LOG-GAS-04-02',
        date: '29 September 2026',
        type: 'Pengujian Respon Alarm Ambang Bahaya Gas Metana (LEL)',
        technician: 'Safety Officer PT KGR',
        status: 'Lulus Uji & Siap',
        notes: 'Sensitivitas LEL CH4 pada septic tank industri teruji sesuai standar Permenaker No 5/2018.',
        bastNumber: 'BAST-LEL-0926-29',
      },
    ],
  },
};

interface EquipmentMaintenanceQrScannerProps {
  onToast?: (msg: string) => void;
  defaultTag?: string;
}

export const EquipmentMaintenanceQrScanner: React.FC<EquipmentMaintenanceQrScannerProps> = ({
  onToast,
  defaultTag = 'KGR-EQ-TRK-01',
}) => {
  const [selectedTag, setSelectedTag] = useState<string>(defaultTag);
  const [manualInput, setManualInput] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string>('');
  const [lastScannedRaw, setLastScannedRaw] = useState<string>('');
  const [showQrBadgePreview, setShowQrBadgePreview] = useState<boolean>(false);

  const activeEquipment = SAMPLE_EQUIPMENT_DATABASE[selectedTag] || null;

  const handleScanResult = (resultText: string) => {
    if (!resultText) return;
    const cleanText = resultText.trim();
    setLastScannedRaw(cleanText);

    // Check direct matching or tag parsing
    let matchedKey = Object.keys(SAMPLE_EQUIPMENT_DATABASE).find(
      (key) => key.toLowerCase() === cleanText.toLowerCase()
    );

    // Check if URL or JSON was scanned containing tag
    if (!matchedKey) {
      for (const key of Object.keys(SAMPLE_EQUIPMENT_DATABASE)) {
        if (cleanText.includes(key)) {
          matchedKey = key;
          break;
        }
      }
    }

    if (matchedKey) {
      setSelectedTag(matchedKey);
      setIsCameraActive(false);
      setCameraError('');
      if (onToast) {
        onToast(`✅ Berhasil scan QR Tag: ${SAMPLE_EQUIPMENT_DATABASE[matchedKey].name}`);
      }
    } else {
      // If tag not recognized in database, still allow custom display
      setSelectedTag(cleanText);
      setIsCameraActive(false);
      if (onToast) {
        onToast(`ℹ️ Tag QR terdeteksi: "${cleanText}". Memuat data log terkait...`);
      }
    }
  };

  const handleSelectPreset = (tagKey: string) => {
    setSelectedTag(tagKey);
    setCameraError('');
    if (onToast) {
      onToast(`🔍 Memuat Log Pemeliharaan: ${SAMPLE_EQUIPMENT_DATABASE[tagKey]?.name || tagKey}`);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleScanResult(manualInput.trim());
    setManualInput('');
  };

  return (
    <div
      id="print-hub-equipment-scanner-section"
      className="border-2 border-cyan/40 bg-gradient-to-br from-slate-50 via-white to-cyan/5 rounded-2xl p-4 sm:p-5 text-xs text-navy shadow-sm relative overflow-hidden"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-cyan/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-navy text-cyan flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            🔍
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-navy text-xs sm:text-sm uppercase tracking-wide">
                QR Scanner Modul Alat & Riwayat Pemeliharaan
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-navy text-cyan border border-cyan/40">
                TEKNISI KGR
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-0.5">
              Pindai tag QR pada bodi truk atau mesin pompa untuk membaca riwayat servis, uji tekanan & BAST teknis.
            </p>
          </div>
        </div>

        {/* Action Controls (Hidden in Print) */}
        <div className="print-hide flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <button
            type="button"
            onClick={() => {
              setIsCameraActive(!isCameraActive);
              setCameraError('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isCameraActive
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-navy text-cyan hover:bg-navy-light border border-cyan/40'
            }`}
            title="Aktifkan kamera ponsel atau webcam untuk memindai tag QR fisik peralatan"
          >
            <span>{isCameraActive ? '⏹️ Tutup Kamera' : '📷 Buka Scanner QR'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowQrBadgePreview(!showQrBadgePreview)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition cursor-pointer"
            title="Tampilkan tag QR resolusi tinggi untuk dicetak atau di-scan dengan HP lain"
          >
            <span>🏷️ {showQrBadgePreview ? 'Tutup Tag QR' : 'Lihat Tag QR'}</span>
          </button>
        </div>
      </div>

      {/* Camera Live Scanner Panel (Hidden in Print) */}
      {isCameraActive && (
        <div className="print-hide mb-4 p-4 bg-slate-900 text-white rounded-2xl border-2 border-cyan/60 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="font-bold text-xs text-cyan">
                Kamera QR Scanner Aktif (react-qr-reader)
              </span>
            </div>
            <span className="text-[10px] text-gray-400">
              Arahkan lensa ke stiker QR pada peralatan
            </span>
          </div>

          <div className="max-w-xs mx-auto overflow-hidden rounded-xl border-2 border-cyan bg-black relative shadow-inner">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              scanDelay={300}
              onResult={(result, error) => {
                if (result) {
                  const text = result.getText();
                  if (text) {
                    handleScanResult(text);
                  }
                }
                if (error && error.name !== 'NotFoundException') {
                  // NotFoundException is normal when frame has no QR code
                  console.debug('QR Scan exception:', error);
                }
              }}
              className="w-full h-auto aspect-square"
              videoContainerStyle={{ paddingTop: '100%', position: 'relative' }}
              videoStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-8 border-2 border-cyan/70 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-cyan/60 animate-pulse"></div>
            </div>
          </div>

          {cameraError && (
            <p className="text-[11px] text-rose-400 text-center mt-2 font-mono">
              ⚠️ {cameraError}
            </p>
          )}

          <p className="text-[11px] text-gray-300 text-center mt-3">
            Tips: Pastikan pencahayaan cukup atau gunakan tombol <strong>Preset Tag Cepat</strong> di bawah jika kamera browser dibatasi.
          </p>
        </div>
      )}

      {/* Quick Tag Presets & Manual Input Toolbar (Hidden in Print) */}
      <div className="print-hide mb-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-gray-200">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-gray-500 mr-1">
            Tag Preset Teknisi:
          </span>
          {Object.entries(SAMPLE_EQUIPMENT_DATABASE).map(([key, item]) => {
            const isSelected = selectedTag === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan text-navy shadow-xs ring-1 ring-cyan-dark font-extrabold'
                    : 'bg-slate-100 hover:bg-slate-200 text-navy border border-gray-200'
                }`}
              >
                <span>{item.category.includes('Truk') ? '🚛' : item.category.includes('Pompa') ? '⚙️' : item.category.includes('Jetting') ? '💧' : '🦺'}</span>
                <span>{item.name.split(' ')[0]} {item.licensePlate || item.serialNumber.split('-')[1]}</span>
              </button>
            );
          })}
        </div>

        {/* Manual Tag Search Form */}
        <form onSubmit={handleManualSearch} className="flex items-center gap-1.5">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Ketik Tag (e.g. KGR-EQ-TRK-01)"
            className="px-2.5 py-1 rounded-lg bg-slate-50 border border-gray-300 text-navy text-[11px] outline-none focus:border-cyan w-48 font-mono"
          />
          <button
            type="submit"
            className="px-2.5 py-1 rounded-lg bg-navy hover:bg-navy-light text-cyan text-[11px] font-bold transition cursor-pointer"
          >
            Pilih
          </button>
        </form>
      </div>

      {/* QR Tag Badge Preview Modal / Drawer */}
      {showQrBadgePreview && activeEquipment && (
        <div className="print-hide mb-4 p-3 bg-cyan/10 border border-cyan/40 rounded-xl flex flex-col sm:flex-row items-center gap-4">
          <div className="p-2 bg-white rounded-lg border border-cyan/40 shadow-xs shrink-0">
            <QRCodeSVG
              value={activeEquipment.qrTag}
              size={96}
              level="H"
              fgColor="#0a192f"
              bgColor="#ffffff"
              marginSize={2}
            />
          </div>
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-mono font-bold text-cyan-dark bg-cyan/20 px-2 py-0.5 rounded">
              QR TAG RESMI: {activeEquipment.qrTag}
            </span>
            <p className="font-bold text-navy text-xs mt-1">{activeEquipment.name}</p>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Stiker tag ini ditempelkan pada rangka mesin atau dashboard armada untuk audit berkala tim K3.
            </p>
          </div>
        </div>
      )}

      {/* ACTIVE EQUIPMENT DETAILS & MAINTENANCE LOG TABLE */}
      {activeEquipment ? (
        <div className="space-y-3">
          {/* Equipment Status Card */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-500 block">Unit Peralatan:</span>
              <span className="font-extrabold text-navy text-xs block">{activeEquipment.name}</span>
              {activeEquipment.licensePlate && (
                <span className="font-mono text-[10px] font-bold text-cyan-dark bg-cyan/10 px-1.5 py-0.2 rounded inline-block mt-0.5">
                  {activeEquipment.licensePlate}
                </span>
              )}
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-500 block">Kategori & No. Seri:</span>
              <span className="text-gray-700 block truncate">{activeEquipment.category}</span>
              <span className="font-mono text-[10px] text-gray-500 block">SN: {activeEquipment.serialNumber}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-500 block">Status Kesiapan:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px] mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>{activeEquipment.condition}</span>
              </span>
              <span className="text-[10px] text-gray-500 block mt-0.5">
                Jam Terbang: <strong>{activeEquipment.totalOperatingHours} Jam</strong>
              </span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-gray-500 block">Pos Penempatan:</span>
              <span className="font-bold text-navy block">{activeEquipment.assignedHub}</span>
              <span className="text-[10px] text-orange block mt-0.5">
                Servis Berikutnya: <strong>{activeEquipment.nextServiceDate}</strong>
              </span>
            </div>
          </div>

          {/* Maintenance Logs Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="bg-navy text-white px-3 py-1.5 flex items-center justify-between">
              <span className="font-bold text-[10px] uppercase tracking-wide flex items-center gap-1.5">
                <span>📋</span>
                <span>Log Riwayat Servis, Uji Tekanan & Kalibrasi Berkala ({activeEquipment.logs.length} Catatan)</span>
              </span>
              <span className="text-[9px] font-mono text-cyan">
                Terverifikasi PIC K3 Lapangan
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-gray-600 text-[10px] uppercase border-b border-gray-200">
                    <th className="py-1.5 px-3 font-bold">Tanggal</th>
                    <th className="py-1.5 px-3 font-bold">Jenis Pekerjaan / Servis</th>
                    <th className="py-1.5 px-3 font-bold">Teknisi / Bengkel Pelaksana</th>
                    <th className="py-1.5 px-3 font-bold">Status & No. BAST</th>
                    <th className="py-1.5 px-3 font-bold">Catatan Teknis Lapangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeEquipment.logs.map((log) => (
                    <tr key={log.id} className="hover:bg-cyan/5 transition">
                      <td className="py-2 px-3 font-semibold text-navy whitespace-nowrap">
                        {log.date}
                      </td>
                      <td className="py-2 px-3 font-bold text-navy">
                        {log.type}
                      </td>
                      <td className="py-2 px-3 text-gray-700">
                        {log.technician}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-0.5">
                          ✓ {log.status}
                        </span>
                        <div className="font-mono text-[9px] text-gray-500">
                          {log.bastNumber}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-gray-600 leading-snug">
                        {log.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl border border-gray-200 text-center">
          <p className="text-gray-500 text-xs">
            Tag QR "<strong>{selectedTag}</strong>" belum terdaftar dalam basis data armada PT KGR.
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Gunakan tombol preset di atas untuk melihat log armada terverifikasi (Truk Unit 01, Pompa Jurop, Mesin Jetting, Gas Detector).
          </p>
        </div>
      )}

      {lastScannedRaw && (
        <div className="print-hide mt-2 text-[9px] text-gray-400 font-mono flex items-center justify-between">
          <span>Hasil scan terakhir: "{lastScannedRaw}"</span>
          <button
            type="button"
            onClick={() => setLastScannedRaw('')}
            className="hover:underline text-gray-500 cursor-pointer"
          >
            Hapus
          </button>
        </div>
      )}
    </div>
  );
};
