import React, { useState, useEffect, useMemo } from 'react';

export interface GalleryProjectForQuote {
  id: number;
  image: string;
  title: string;
  category: string;
  location: string;
  tag: string;
  description: string;
  estimatedCost: string;
  priceRangeId?: string;
  priceValue?: number;
  dateAdded?: string;
  timestamp?: number;
}

interface QuickQuoteCalculatorModalProps {
  project: GalleryProjectForQuote;
  isOpen: boolean;
  onClose: () => void;
  onToast?: (message: string) => void;
}

export const QuickQuoteCalculatorModal: React.FC<QuickQuoteCalculatorModalProps> = ({
  project,
  isOpen,
  onClose,
  onToast,
}) => {
  // Mode Kalkulator: 'volume' (Berdasarkan Kubikasi m³) atau 'service' (Berdasarkan Jenis Layanan Tertentu)
  const [calculationMode, setCalculationMode] = useState<'volume' | 'service'>('service');

  // Service Type options
  const serviceOptions = [
    {
      id: 'sedot-wc-residensial',
      label: 'Sedot Septic Tank Hunian / Rumah',
      unitLabel: 'Rit / Tangki (Kapasitas s/d 4 m³)',
      baseRate: 400000,
      minPrice: 350000,
      maxPrice: 450000,
      categoryMatch: ['Sedot WC', 'Septic Tank', 'Residensial', 'Hunian', 'Rumah'],
      description: 'Penyedotan tinja rumah tangga dengan armada tangki vakum bersih dan kedap udara.',
    },
    {
      id: 'septic-tank-komersial',
      label: 'Pengurasan Septic Tank Ruko / Gedung / Kantor',
      unitLabel: 'Rit Armada Ganda (4-6 m³)',
      baseRate: 1250000,
      minPrice: 1100000,
      maxPrice: 1500000,
      categoryMatch: ['Gedung', 'Komersial', 'Ruko', 'Kantor', 'Bisnis'],
      description: 'Layanan kapasitas besar untuk perkantoran, ruko, restoran, dan fasilitas umum.',
    },
    {
      id: 'pipa-hydro-jetting',
      label: 'Pelancaran Saluran Pipa Mampet Hydro Jetting',
      unitLabel: 'Titik Saluran Pipa',
      baseRate: 600000,
      minPrice: 500000,
      maxPrice: 750000,
      categoryMatch: ['Pelancaran Pipa', 'Pipa', 'Hydro Jetting', 'Mampet', 'Saluran'],
      description: 'Pelancaran pipa got, wastafel, atau kloset tersumbat tanpa bongkar lantai.',
    },
    {
      id: 'grease-trap-resto',
      label: 'Pembersihan Grease Trap Restoran & Dapur F&B',
      unitLabel: 'Unit Bak Perangkap Lemak',
      baseRate: 650000,
      minPrice: 550000,
      maxPrice: 850000,
      categoryMatch: ['Grease Trap', 'Restoran', 'Lemak', 'Kuliner', 'F&B'],
      description: 'Pengurasan kerak minyak dan lemak dapur restoran agar tidak mencemari lingkungan.',
    },
    {
      id: 'blower-lumpur-padat',
      label: 'Pompa & Blower Lumpur Tinja Padat (High Pressure)',
      unitLabel: 'Pekerjaan Pengenceran Tekanan Tinggi',
      baseRate: 1400000,
      minPrice: 1200000,
      maxPrice: 1800000,
      categoryMatch: ['Lumpur', 'Blower', 'Padat', 'Endapan'],
      description: 'Pengenceran lumpur keras membatu menggunakan water jetting tekanan tinggi.',
    },
    {
      id: 'limbah-stp-industri',
      label: 'Penyedotan Limbah STP / IPAL Pabrik & Manifes Resmi IPLT',
      unitLabel: 'Armada Truk Tangki Industri (8 m³)',
      baseRate: 3500000,
      minPrice: 2500000,
      maxPrice: 4500000,
      categoryMatch: ['Industri', 'STP', 'IPAL', 'Manifes', 'Pabrik', 'Logistik', 'Cibitung', 'Cikarang'],
      description: 'Pengurasan limbah pabrik berizin KLHK & DLH dengan bukti surat manifes sah IPLT.',
    },
    {
      id: 'biofilter-septic-tank',
      label: 'Pemasangan / Renovasi Septic Tank Biofilter Ramah Lingkungan',
      unitLabel: 'Paket Unit Biofilter Lengkap',
      baseRate: 3800000,
      minPrice: 3500000,
      maxPrice: 4800000,
      categoryMatch: ['Biofilter', 'Ramah Lingkungan', 'Pembuatan Septic Tank'],
      description: 'Sistem pengolahan limbah biologis modern tanpa kuras rutin dan ramah lingkungan.',
    },
  ];

  // Deteksi layanan default dari data proyek galeri
  const initialServiceId = useMemo(() => {
    const matched = serviceOptions.find((opt) =>
      opt.categoryMatch.some(
        (key) =>
          project.category.toLowerCase().includes(key.toLowerCase()) ||
          project.title.toLowerCase().includes(key.toLowerCase()) ||
          project.tag.toLowerCase().includes(key.toLowerCase())
      )
    );
    return matched ? matched.id : serviceOptions[0].id;
  }, [project]);

  // State untuk Mode Layanan Tertentu
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [quantity, setQuantity] = useState<number>(1);

  // State untuk Mode Kalkulator Volume (Kubikasi m³)
  const [volumeCubicMeters, setVolumeCubicMeters] = useState<number>(4);
  const [isUsingDimensions, setIsUsingDimensions] = useState<boolean>(false);
  const [tankLength, setTankLength] = useState<number>(2);
  const [tankWidth, setTankWidth] = useState<number>(1.5);
  const [tankDepth, setTankDepth] = useState<number>(1.5);

  // Update volume jika pengguna mengubah dimensi bak septic tank
  useEffect(() => {
    if (isUsingDimensions) {
      const calculated = parseFloat((tankLength * tankWidth * tankDepth).toFixed(1));
      if (calculated > 0 && calculated <= 50) {
        setVolumeCubicMeters(calculated);
      }
    }
  }, [isUsingDimensions, tankLength, tankWidth, tankDepth]);

  // Parameter Tambahan & Kondisi Lapangan
  const [hoseLength, setHoseLength] = useState<'standard' | 'medium' | 'long' | 'extra'>('standard');
  const [isWithManifest, setIsWithManifest] = useState<boolean>(() => {
    return (
      project.category.toLowerCase().includes('industri') ||
      project.title.toLowerCase().includes('manifes') ||
      project.tag.toLowerCase().includes('manifes')
    );
  });
  const [isWithBioEnzyme, setIsWithBioEnzyme] = useState<boolean>(false);
  const [workTime, setWorkTime] = useState<'regular' | 'night'>('regular');
  const [clientName, setClientName] = useState<string>('');
  const [clientLocation, setClientLocation] = useState<string>(project.location || '');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Update saat project berubah
  useEffect(() => {
    setSelectedServiceId(initialServiceId);
    setClientLocation(project.location || '');
    if (
      project.category.toLowerCase().includes('industri') ||
      project.title.toLowerCase().includes('manifes') ||
      project.tag.toLowerCase().includes('manifes')
    ) {
      setIsWithManifest(true);
      setVolumeCubicMeters(8);
    } else if (project.category.toLowerCase().includes('pipa')) {
      setVolumeCubicMeters(1);
    } else {
      setIsWithManifest(false);
      setVolumeCubicMeters(4);
    }
  }, [project, initialServiceId]);

  if (!isOpen) return null;

  const currentService =
    serviceOptions.find((s) => s.id === selectedServiceId) || serviceOptions[0];

  // Biaya Jarak Selang
  const hoseSurcharges = {
    standard: { label: 'Standar (< 15 meter)', price: 0, note: 'Gratis (Termasuk dalam paket armada)' },
    medium: { label: '15 – 30 meter', price: 50000, note: 'Sambungan selang spiral 1 rol tambahan' },
    long: { label: '30 – 50 meter (Akses Gang)', price: 100000, note: 'Booster hisap vakum tambahan' },
    extra: { label: '50 – 70 meter (Akses Ekstra Jauh)', price: 150000, note: 'Armada ganda & sambungan panjang' },
  };

  // Kalkulasi Volume Mode
  // Kapasitas 1 Rit Tangki Engkel = ~4 m³, Truk Double = ~8 m³
  const requiredTruckTrips = Math.max(1, Math.ceil(volumeCubicMeters / 4));
  const recommendedTruckType =
    volumeCubicMeters <= 4
      ? '1 Rit Truk Engkel (Kapasitas 4.000 Liter / 4 m³)'
      : volumeCubicMeters <= 8
      ? '1 Rit Truk Double (Kapasitas 8.000 Liter / 8 m³)'
      : `${requiredTruckTrips} Rit Armada Tangki Vakum (${volumeCubicMeters} m³ total)`;

  // Biaya dasar berdasarkan mode yang aktif
  let calculatedBasePrice = 0;
  let serviceDescriptionText = '';

  if (calculationMode === 'volume') {
    // Tarif dasar per kubikasi:
    // 1-4 m3 = Rp 400.000 (minimum 1 rit)
    // Di atas 4 m3: Rp 400.000 + Rp 90.000 per m3 tambahan, atau per rit kelipatan
    if (volumeCubicMeters <= 4) {
      calculatedBasePrice = 400000;
    } else if (volumeCubicMeters <= 8) {
      calculatedBasePrice = 400000 + Math.round((volumeCubicMeters - 4) * 90000);
    } else {
      calculatedBasePrice = requiredTruckTrips * 380000; // Harga grosir per rit
    }
    serviceDescriptionText = `Estimasi Volume ${volumeCubicMeters} m³ (${recommendedTruckType})`;
  } else {
    // Mode Berdasarkan Jenis Layanan
    calculatedBasePrice = currentService.baseRate * quantity;
    serviceDescriptionText = `${currentService.label} (${quantity}x ${currentService.unitLabel})`;
  }

  // Tambahan biaya opsi
  const manifestFee = isWithManifest ? 350000 : 0;
  const bioEnzymeFee = isWithBioEnzyme ? 75000 : 0;
  const nightShiftFee = workTime === 'night' ? 100000 : 0;
  const hoseFee = hoseSurcharges[hoseLength].price;

  // Diskon volume / multi-unit jika quantity >= 2 atau volume >= 8
  const isEligibleDiscount =
    (calculationMode === 'service' && quantity >= 2) ||
    (calculationMode === 'volume' && volumeCubicMeters >= 8);
  const discountAmount = isEligibleDiscount ? (calculationMode === 'service' ? 50000 * (quantity - 1) : 100000) : 0;

  // Total estimasi akhir
  const totalEstimatedCost = Math.max(
    300000,
    calculatedBasePrice + hoseFee + manifestFee + bioEnzymeFee + nightShiftFee - discountAmount
  );

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getWaMessage = () => {
    const text =
      `Halo PT Kusuma Gemilang Raya, saya ingin konfirmasi Quick Quote Estimasi Biaya dari Galeri Proyek:\n\n` +
      `📌 Referensi Proyek: "${project.title}" (${project.location})\n` +
      `⚙️ Mode Kalkulasi: ${calculationMode === 'volume' ? 'Berdasarkan Input Volume Septic Tank' : 'Berdasarkan Jenis Layanan Spesifik'}\n` +
      `🛠️ Layanan / Volume: ${serviceDescriptionText}\n` +
      (calculationMode === 'volume'
        ? `📐 Detail Kapasitas: ${volumeCubicMeters} m³ (${isUsingDimensions ? `Dimensi: ${tankLength}m x ${tankWidth}m x ${tankDepth}m` : 'Input Langsung'})\n` +
          `🚛 Rekomendasi Armada: ${recommendedTruckType}\n`
        : `🔢 Kuantitas: ${quantity} ${currentService.unitLabel}\n`) +
      `📏 Jarak Selang: ${hoseSurcharges[hoseLength].label}\n` +
      `📄 Dokumen Manifes IPLT: ${isWithManifest ? 'Ya (Resmi IPLT Berizin)' : 'Non-Manifes'}\n` +
      (isWithBioEnzyme ? `🧪 Bio-Enzim Pengurai: Ya (+${formatRupiah(bioEnzymeFee)})\n` : '') +
      `⏰ Waktu Pengerjaan: ${workTime === 'night' ? 'Shift Malam / Emergency 24 Jam' : 'Jam Kerja Reguler'}\n` +
      (discountAmount > 0 ? `🏷️ Diskon Volume: -${formatRupiah(discountAmount)}\n` : '') +
      `💰 Estimasi Total Penawaran: ${formatRupiah(totalEstimatedCost)}\n` +
      (clientName ? `👤 Pemesan: ${clientName}\n` : '') +
      (clientLocation ? `📍 Lokasi Pengerjaan: ${clientLocation}\n` : '') +
      (clientNotes ? `💬 Catatan Khusus: ${clientNotes}\n` : '') +
      `\nMohon konfirmasi ketersediaan armada terdekat ke lokasi saya. Terima kasih!`;

    return `https://wa.me/6289675064916?text=${encodeURIComponent(text)}`;
  };

  const handleCopyQuote = async () => {
    const quoteSummary =
      `📋 RINCIAN ESTIMASI BIAYA (QUICK QUOTE)\n` +
      `PT KUSUMA GEMILANG RAYA - SPESIALIS SEDOT WC BEKASI\n` +
      `-------------------------------------------\n` +
      `Referensi Proyek: ${project.title}\n` +
      `Mode Kalkulasi: ${calculationMode === 'volume' ? 'Input Volume / Kubikasi' : 'Jenis Layanan Tertentu'}\n` +
      `Spesifikasi: ${serviceDescriptionText}\n` +
      (calculationMode === 'volume' ? `Kapasitas: ${volumeCubicMeters} m³ | Armada: ${recommendedTruckType}\n` : '') +
      `Jarak Selang: ${hoseSurcharges[hoseLength].label}\n` +
      `Manifes IPLT Resmi: ${isWithManifest ? 'Ya (+Rp 350.000)' : 'Non-Manifes'}\n` +
      (isWithBioEnzyme ? `Bio-Enzim Pengurai: Ya (+Rp 75.000)\n` : '') +
      `Waktu Pengerjaan: ${workTime === 'night' ? 'Shift Malam / 24 Jam' : 'Reguler Siang'}\n` +
      (discountAmount > 0 ? `Diskon Volume: -${formatRupiah(discountAmount)}\n` : '') +
      `Total Estimasi: ${formatRupiah(totalEstimatedCost)}\n` +
      `Lokasi Klien: ${clientLocation || project.location}\n` +
      `Jaminan: Bebas Biaya Siluman, Disinfeksi Steril & Garansi Tuntas 30 Hari.\n` +
      `WhatsApp: 0896-7506-4916 | Website: https://sedot-wc-bekasi.my.id/`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(quoteSummary);
        if (onToast) onToast('📋 Rincian estimasi biaya berhasil disalin ke clipboard!');
      } else {
        throw new Error('Clipboard fallback');
      }
    } catch {
      const ta = document.createElement('textarea');
      ta.value = quoteSummary;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (onToast) onToast('📋 Rincian estimasi biaya berhasil disalin!');
    }
  };

  const handleReset = () => {
    setCalculationMode('service');
    setSelectedServiceId(initialServiceId);
    setQuantity(1);
    setVolumeCubicMeters(4);
    setIsUsingDimensions(false);
    setHoseLength('standard');
    setIsWithBioEnzyme(false);
    setWorkTime('regular');
    setClientNotes('');
    if (onToast) onToast('🔄 Kalkulator estimasi biaya direset ke nilai awal proyek.');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[94vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy p-5 sm:p-6 text-white border-b border-white/10 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-400 text-navy shadow-xs flex items-center gap-1">
                    <span>⚡</span>
                    <span>Quick Quote Kalkulator</span>
                  </span>
                  <span className="text-xs text-orange font-semibold flex items-center gap-1">
                    📍 {project.location}
                  </span>
                  <span className="text-[11px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    Acuan Proyek: {project.estimatedCost}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-300">
                  Hitung estimasi biaya instan berdasarkan input volume (kubikasi m³) atau jenis layanan spesifik
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                title="Reset Kalkulator"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition text-xs font-bold cursor-pointer"
              >
                🔄
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup Kalkulator"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition shrink-0 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-gray-300 font-medium">Pilih Metode Perhitungan:</span>
            <div className="inline-flex p-1 bg-white/10 rounded-2xl border border-white/15">
              <button
                type="button"
                onClick={() => setCalculationMode('service')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  calculationMode === 'service'
                    ? 'bg-cyan text-navy shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>🛠️</span>
                <span>Berdasarkan Jenis Layanan</span>
              </button>
              <button
                type="button"
                onClick={() => setCalculationMode('volume')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                  calculationMode === 'volume'
                    ? 'bg-amber-400 text-navy shadow-md'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span>📦</span>
                <span>Berdasarkan Input Volume (m³)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* TAB 1: Mode Berdasarkan Jenis Layanan Tertentu */}
              {calculationMode === 'service' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div>
                    <label className="block text-xs font-bold text-navy uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="text-cyan-dark">1.</span>
                        <span>Pilih Jenis Layanan Tertentu:</span>
                      </span>
                      <span className="text-orange font-semibold lowercase text-[11px]">
                        disesuaikan dari portofolio galeri
                      </span>
                    </label>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {serviceOptions.map((svc) => (
                        <label
                          key={svc.id}
                          className={`flex items-start gap-3 p-3 rounded-2xl border transition cursor-pointer ${
                            selectedServiceId === svc.id
                              ? 'bg-cyan/10 border-cyan text-navy ring-2 ring-cyan/40 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 border-gray-200 text-gray-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="service-select"
                            value={svc.id}
                            checked={selectedServiceId === svc.id}
                            onChange={() => setSelectedServiceId(svc.id)}
                            className="mt-1 text-cyan focus:ring-cyan h-4 w-4"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-bold text-xs sm:text-sm text-navy">{svc.label}</span>
                              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg shrink-0 border border-emerald-200">
                                {formatRupiah(svc.baseRate)}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {svc.description}
                            </p>
                            <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400">
                              <span>Satuan: {svc.unitLabel}</span>
                              <span className="font-semibold text-gray-600">
                                Kisaran: {formatRupiah(svc.minPrice)} – {formatRupiah(svc.maxPrice)}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Input Kuantitas / Unit / Titik */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <span className="text-cyan-dark">2.</span>
                        <span>Jumlah Unit / Titik / Rit:</span>
                      </label>
                      <span className="text-[11px] text-gray-500">
                        Satuan: <strong className="text-navy">{currentService.unitLabel}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-navy font-black text-lg flex items-center justify-center transition cursor-pointer"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center font-black text-navy text-lg py-1.5 bg-white rounded-xl border border-gray-200 shadow-inner">
                        {quantity} <span className="text-xs font-semibold text-gray-500">{currentService.unitLabel.split(' ')[0]}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(20, quantity + 1))}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-navy font-black text-lg flex items-center justify-center transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex gap-1.5 mt-2.5 justify-center">
                      {[1, 2, 3, 5, 8].map((qtyVal) => (
                        <button
                          key={qtyVal}
                          type="button"
                          onClick={() => setQuantity(qtyVal)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                            quantity === qtyVal
                              ? 'bg-navy text-white border-navy'
                              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {qtyVal}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Mode Berdasarkan Input Volume / Kubikasi (m³) */}
              {calculationMode === 'volume' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                        <span className="text-amber-600">📐</span>
                        <span>Estimasi Volume Septic Tank:</span>
                      </span>
                      <span className="text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-xl border border-amber-300">
                        {volumeCubicMeters} m³ ({volumeCubicMeters * 1000} Liter)
                      </span>
                    </div>

                    {/* Slider Volume */}
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={volumeCubicMeters}
                      onChange={(e) => {
                        setVolumeCubicMeters(parseFloat(e.target.value));
                        setIsUsingDimensions(false);
                      }}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />

                    {/* Quick Preset Buttons for Volume */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                      {[
                        { label: '2 m³ (Rumah Kecil)', val: 2 },
                        { label: '4 m³ (Standar 1 Rit)', val: 4 },
                        { label: '6 m³ (Kos / Ruko)', val: 6 },
                        { label: '8 m³ (Truk Double)', val: 8 },
                      ].map((preset) => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => {
                            setVolumeCubicMeters(preset.val);
                            setIsUsingDimensions(false);
                          }}
                          className={`p-2 rounded-xl text-left border text-xs transition cursor-pointer ${
                            volumeCubicMeters === preset.val && !isUsingDimensions
                              ? 'bg-amber-400 text-navy font-bold border-amber-500 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-amber-100/50'
                          }`}
                        >
                          <div className="font-bold text-[11px] leading-tight">{preset.label}</div>
                        </button>
                      ))}
                    </div>

                    {/* Rekomendasi Armada Info Box */}
                    <div className="mt-3.5 p-3 rounded-xl bg-white border border-amber-200/80 flex items-center gap-2.5 text-xs text-gray-700">
                      <span className="text-xl">🚛</span>
                      <div>
                        <span className="font-bold text-navy block">Rekomendasi Armada:</span>
                        <span className="text-amber-800 font-semibold">{recommendedTruckType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dimensi Calculator Toggle (Panjang x Lebar x Dalam) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-bold text-navy flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isUsingDimensions}
                          onChange={(e) => setIsUsingDimensions(e.target.checked)}
                          className="text-amber-500 rounded h-4 w-4"
                        />
                        <span>Hitung dari Dimensi Bak (Panjang × Lebar × Kedalaman)</span>
                      </label>
                      <span className="text-[10px] text-gray-400 font-medium">Opsional</span>
                    </div>

                    {isUsingDimensions && (
                      <div className="grid grid-cols-3 gap-2.5 animate-in fade-in duration-150">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Panjang (m):</label>
                          <input
                            type="number"
                            min="0.5"
                            max="10"
                            step="0.1"
                            value={tankLength}
                            onChange={(e) => setTankLength(parseFloat(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-gray-300 text-xs text-navy font-bold focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Lebar (m):</label>
                          <input
                            type="number"
                            min="0.5"
                            max="10"
                            step="0.1"
                            value={tankWidth}
                            onChange={(e) => setTankWidth(parseFloat(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-gray-300 text-xs text-navy font-bold focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">Kedalaman (m):</label>
                          <input
                            type="number"
                            min="0.5"
                            max="6"
                            step="0.1"
                            value={tankDepth}
                            onChange={(e) => setTankDepth(parseFloat(e.target.value) || 1)}
                            className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-gray-300 text-xs text-navy font-bold focus:border-amber-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Jarak Selang & Kondisi Akses Lokasi */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200">
                <label className="block text-xs font-bold text-navy mb-1.5 flex items-center justify-between">
                  <span>3. Estimasi Jarak Selang dari Truk ke Lubang Septic Tank:</span>
                  <span className="text-[11px] text-gray-500 font-normal">Standard s/d 15m gratis</span>
                </label>
                <select
                  value={hoseLength}
                  onChange={(e) => setHoseLength(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs font-bold text-navy focus:border-cyan focus:outline-none cursor-pointer"
                >
                  <option value="standard">Standar (&lt; 15 meter) - Gratis / Termasuk Paket</option>
                  <option value="medium">15 – 30 meter (+Rp 50.000)</option>
                  <option value="long">30 – 50 meter / Akses Gang Sempit (+Rp 100.000)</option>
                  <option value="extra">50 – 70 meter / Akses Ekstra Jauh (+Rp 150.000)</option>
                </select>
                <p className="text-[10px] text-gray-500 mt-1.5">
                  💡 {hoseSurcharges[hoseLength].note}
                </p>
              </div>

              {/* Additional Options & Add-ons */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-navy uppercase tracking-wider">
                  4. Layanan Tambahan & Spesifikasi Pengerjaan:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-gray-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={isWithManifest}
                      onChange={(e) => setIsWithManifest(e.target.checked)}
                      className="mt-0.5 text-emerald-600 rounded h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">Dokumen Manifes Resmi IPLT</span>
                      <span className="text-[10px] text-gray-500">Legalitas resmi DLH & KLHK (+Rp 350.000)</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-gray-200 cursor-pointer hover:bg-slate-100 transition">
                    <input
                      type="checkbox"
                      checked={isWithBioEnzyme}
                      onChange={(e) => setIsWithBioEnzyme(e.target.checked)}
                      className="mt-0.5 text-cyan-dark rounded h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">Bio-Enzim Pengurai Kuman</span>
                      <span className="text-[10px] text-gray-500">Bakteri pengurai anti bau & steril (+Rp 75.000)</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-gray-200 cursor-pointer hover:bg-slate-100 transition sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={workTime === 'night'}
                      onChange={(e) => setWorkTime(e.target.checked ? 'night' : 'regular')}
                      className="mt-0.5 text-orange rounded h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-bold text-navy block">Pengerjaan Shift Malam / Emergency 24 Jam</span>
                      <span className="text-[10px] text-gray-500">Penanganan darurat malam hari tanpa mengganggu jam operasional (+Rp 100.000)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Client Info (Optional for WhatsApp prefill) */}
              <div className="p-4 bg-slate-100/80 rounded-2xl border border-gray-200 space-y-2.5">
                <span className="text-xs font-bold text-navy block">
                  Informasi Tambahan Lokasi & Kontak (Opsional):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nama Pemesan (contoh: Bpk. Rudi)"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-navy focus:border-cyan focus:outline-none"
                  />
                  <input
                    type="text"
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    placeholder="Alamat / Perumahan di Bekasi"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-navy focus:border-cyan focus:outline-none"
                  />
                </div>
                <input
                  type="text"
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  placeholder="Catatan khusus (misal: pipa tersumbat lemak / akses gang sempit)"
                  className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-navy focus:border-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* Quick Quote Summary Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-navy via-navy-light to-navy p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col justify-between border border-cyan/30 relative">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-cyan uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡ RINGKASAN ESTIMASI BIAYA</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    Transparan & Sah
                  </span>
                </div>

                {/* Calculation Itemized Rows */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-gray-300">
                      {calculationMode === 'volume' ? 'Biaya Volume Kubikasi:' : 'Tarif Layanan Dasar:'}
                    </span>
                    <span className="font-bold text-white text-right">
                      {formatRupiah(calculatedBasePrice)}
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-light -mt-1 pl-2">
                    {calculationMode === 'volume'
                      ? `${volumeCubicMeters} m³ (${recommendedTruckType.split('(')[0].trim()})`
                      : `${quantity}x @ ${formatRupiah(currentService.baseRate)}`}
                  </div>

                  {hoseFee > 0 && (
                    <div className="flex items-center justify-between gap-2 text-amber-300">
                      <span>Jarak Selang ({hoseSurcharges[hoseLength].label}):</span>
                      <span className="font-bold">+{formatRupiah(hoseFee)}</span>
                    </div>
                  )}

                  {manifestFee > 0 && (
                    <div className="flex items-center justify-between gap-2 text-emerald-300">
                      <span>Surat Manifes & IPLT Resmi:</span>
                      <span className="font-bold">+{formatRupiah(manifestFee)}</span>
                    </div>
                  )}

                  {bioEnzymeFee > 0 && (
                    <div className="flex items-center justify-between gap-2 text-cyan">
                      <span>Bio-Enzim Pengurai Kuman:</span>
                      <span className="font-bold">+{formatRupiah(bioEnzymeFee)}</span>
                    </div>
                  )}

                  {nightShiftFee > 0 && (
                    <div className="flex items-center justify-between gap-2 text-orange">
                      <span>Pengerjaan Shift Malam:</span>
                      <span className="font-bold">+{formatRupiah(nightShiftFee)}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between gap-2 text-emerald-400 font-bold">
                      <span>🏷️ Diskon Volume / Booking Online:</span>
                      <span>-{formatRupiah(discountAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Total Box */}
                <div className="mt-5 pt-4 border-t border-white/15 bg-white/10 p-4 rounded-2xl">
                  <span className="text-[11px] font-bold text-gray-300 block uppercase tracking-wider">
                    Total Estimasi Biaya (Quick Quote):
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-1">
                    {formatRupiah(totalEstimatedCost)}
                  </div>
                  <p className="text-[10px] text-gray-300 mt-1">
                    *Harga pasti disepakati di muka sebelum armada bergerak. Tidak ada biaya siluman.
                  </p>
                </div>

                {/* Guarantees */}
                <div className="mt-4 space-y-1.5 text-[11px] text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Armada resmi berizin tangki kedap udara</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Disinfeksi & finishing higienis pasca pengerjaan</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Garansi pekerjaan lancar 30 hari</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
                <a
                  href={getWaMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-orange hover:bg-orange-dark text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-center"
                >
                  <span>💬 Pesan via WhatsApp dengan Estimasi Ini</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="w-full py-2.5 px-4 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl transition border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📋 Salin Rincian Penawaran (Copy Quote)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-emerald-500 font-bold text-base">🛡️</span>
            <span>PT Kusuma Gemilang Raya menjamin transparansi harga legalitas NIB & faktur sah.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-navy font-bold cursor-pointer transition text-xs"
          >
            Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
