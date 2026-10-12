import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { downloadAreaMapPng } from '../utils/exportAreaMapToPng';

export interface MapHubPrintInfo {
  id: string;
  name: string;
  shortName?: string;
  badge: string;
  phone: string;
  contactNumber?: string;
  phoneRaw: string;
  hotlineLabel: string;
  address: string;
  coverage: string;
  response: string;
  armadaCount: string;
  mapQuery: string;
  mapsDirectUrl: string;
  lat: string;
  lng: string;
  pinPos: { left: string; top: string };
  pinIcon?: string;
  pinColor?: string;
  highlightArea?: string;
}

/**
 * Returns a direct Google Maps navigation URL for the specified hub location.
 */
export function getGoogleMapsNavUrl(hub: MapHubPrintInfo): string {
  if (hub.lat && hub.lng) {
    return `https://www.google.com/maps/search/?api=1&query=${hub.lat},${hub.lng}`;
  }
  return hub.mapsDirectUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hub.address)}`;
}

/**
 * Generates a dynamic QR code component using 'qrcode.react' for the hub's mapsDirectUrl.
 *
 * @param hub Operational hub information containing mapsDirectUrl.
 * @param options Styling and dimensional options for the QR Code.
 */
export function generateMapsDirectUrlQrCode(
  hub: MapHubPrintInfo,
  options?: {
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    fgColor?: string;
    bgColor?: string;
    includeMargin?: boolean;
    className?: string;
    id?: string;
  }
): React.ReactElement {
  const directMapsUrl = hub.mapsDirectUrl || getGoogleMapsNavUrl(hub);
  return (
    <QRCodeSVG
      id={options?.id || `qr-direct-maps-${hub.id}`}
      value={directMapsUrl}
      size={options?.size ?? 88}
      level={options?.level ?? 'H'}
      fgColor={options?.fgColor ?? '#0a192f'}
      bgColor={options?.bgColor ?? '#ffffff'}
      marginSize={options?.includeMargin ? 2 : 0}
      title={`Navigasi Google Maps: ${hub.name}`}
      className={options?.className ?? 'w-full h-full object-contain cursor-pointer transition hover:scale-105'}
    />
  );
}

// Aliases for versatile function access across modules and tests
export const generateQrCodeForMapsDirectUrl = generateMapsDirectUrlQrCode;
export const generateHubMapsDirectQr = generateMapsDirectUrlQrCode;

/**
 * Generates a QR code for the selected hub's Google Maps link using
 * the third-party 'qrcode' library (with API fallback) and injects it
 * directly into the #print-hub-document container within the Print Preview modal.
 *
 * @param hub The operational hub to generate the QR code for.
 * @param containerSelector CSS selector for target container (default: '#print-hub-document').
 * @returns Promise resolving to the generated QR code Data URL or API image URL.
 */
export async function generateAndInjectHubQrCode(
  hub: MapHubPrintInfo,
  containerSelector: string = '#print-hub-document'
): Promise<string> {
  const navUrl = hub.mapsDirectUrl || getGoogleMapsNavUrl(hub);
  let qrResult = '';

  // 1. Generate QR Code using third-party library 'qrcode'
  try {
    qrResult = await QRCode.toDataURL(navUrl, {
      width: 320,
      margin: 1,
      color: {
        dark: '#0a192f', // Brand navy color for high-contrast QR dots
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
  } catch (libError) {
    console.warn('QRCode library failed, fallback to external QR API:', libError);
    // 2. Fallback to third-party QR Code API
    qrResult = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(navUrl)}&color=0a192f`;
  }

  // 3. Inject directly into the #print-hub-document container within the Print Preview modal
  if (typeof document !== 'undefined') {
    const container = document.querySelector(containerSelector) as HTMLElement | null;
    if (container) {
      // Direct update of existing QR image element inside #print-hub-document
      let existingImg = container.querySelector('#print-hub-qr-image') as HTMLImageElement | null;
      if (existingImg) {
        existingImg.src = qrResult;
        existingImg.alt = `QR Code Navigasi Google Maps - ${hub.name}`;
        existingImg.setAttribute('data-maps-url', navUrl);
        existingImg.setAttribute('data-hub-id', hub.id);
        existingImg.setAttribute('data-injected-at', new Date().toISOString());
      }

      // Ensure injected marker badge in #print-hub-document exists
      let injectedBadge = container.querySelector('#print-hub-injected-qr') as HTMLElement | null;
      if (!injectedBadge) {
        const slot = container.querySelector('#print-hub-qr-injected-slot') || container.querySelector('#print-hub-qr-code-section');
        if (slot) {
          injectedBadge = document.createElement('div');
          injectedBadge.id = 'print-hub-injected-qr';
          injectedBadge.className = 'print-hub-injected-tag text-[8px] font-mono text-cyan-dark bg-cyan/15 px-1 py-0.5 rounded border border-cyan/30 mt-1';
          injectedBadge.innerText = `✓ QR Injected: ${hub.id.toUpperCase()}`;
          slot.appendChild(injectedBadge);
        }
      } else {
        injectedBadge.innerText = `✓ QR Injected: ${hub.id.toUpperCase()}`;
        injectedBadge.setAttribute('data-maps-url', navUrl);
      }

      // Synchronize visible URL elements inside #print-hub-document
      const urlTextEl = container.querySelector('#print-hub-maps-url') as HTMLElement | null;
      if (urlTextEl) {
        urlTextEl.textContent = navUrl;
      }
      const urlAnchor = container.querySelector('#print-hub-maps-link') as HTMLAnchorElement | null;
      if (urlAnchor) {
        urlAnchor.href = navUrl;
      }
    }
  }

  return qrResult;
}

export interface MapPrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hubs: MapHubPrintInfo[];
  activeHubIndex: number;
  onSelectHubIndex: (index: number) => void;
  onToast?: (msg: string) => void;
}

export const MapPrintPreviewModal: React.FC<MapPrintPreviewModalProps> = ({
  isOpen,
  onClose,
  hubs,
  activeHubIndex,
  onSelectHubIndex,
  onToast,
}) => {
  // Customizable Site Visit fields
  const [clientName, setClientName] = useState('PT Rekanan / Klien Lokasi');
  const [siteLocation, setSiteLocation] = useState('Area Pabrik / Gedung Komersial / Residensial');
  const [surveyorName, setSurveyorName] = useState('Tim Dispatcher Lapangan (Bpk. Hendra Prasetyo)');
  const [visitDate, setVisitDate] = useState(() => {
    const today = new Date();
    return today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });
  const [siteAccessNotes, setSiteAccessNotes] = useState(
    'Akses truk tangki terbuka (lebar jalan > 3 meter). Parkir truk dekat sumber air dan manhole septic tank.'
  );
  const [isEditingCustomFields, setIsEditingCustomFields] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  // Dynamic QR Code generation for Google Maps Navigation
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);
  const [isQrModalZoomed, setIsQrModalZoomed] = useState<boolean>(false);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentHub = hubs[activeHubIndex] || hubs[0];
  const googleMapsNavUrl = currentHub ? getGoogleMapsNavUrl(currentHub) : '';
  const fallbackQrUrl = googleMapsNavUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(googleMapsNavUrl)}&color=0a192f`
    : '';
  const effectiveQrSrc = qrDataUrl || fallbackQrUrl;

  // Auto-generate and inject QR code into #print-hub-document when modal opens or current hub changes
  useEffect(() => {
    if (!isOpen || !currentHub) return;
    let isSubscribed = true;
    setIsQrLoading(true);

    generateAndInjectHubQrCode(currentHub, '#print-hub-document')
      .then((dataUrl) => {
        if (isSubscribed) {
          setQrDataUrl(dataUrl);
          setIsQrLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate Google Maps QR code:', err);
        if (isSubscribed) {
          setIsQrLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, currentHub?.id, currentHub?.lat, currentHub?.lng, currentHub?.mapsDirectUrl, currentHub?.address]);

  // Expose helper on window for direct DOM/programmatic interaction
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).generateAndInjectHubQrCode = (
        customHub?: MapHubPrintInfo,
        selector: string = '#print-hub-document'
      ) => generateAndInjectHubQrCode(customHub || currentHub, selector);
      (window as any).generateMapsDirectUrlQrCode = generateMapsDirectUrlQrCode;
      (window as any).generateQrCodeForMapsDirectUrl = generateMapsDirectUrlQrCode;
    }
  }, [currentHub]);

  // Handler to manually re-generate and inject QR code
  const handleRegenerateAndInjectQr = async () => {
    setIsQrLoading(true);
    try {
      const dataUrl = await generateAndInjectHubQrCode(currentHub, '#print-hub-document');
      setQrDataUrl(dataUrl);
      if (onToast) {
        onToast(`⚡ QR Code Google Maps untuk ${currentHub.name} berhasil dibuat & diinjeksi ke dokumen cetak!`);
      }
    } catch (err) {
      console.error(err);
      if (onToast) onToast('Gagal membuat QR Code.');
    } finally {
      setIsQrLoading(false);
    }
  };

  const handleExportPng = async () => {
    setIsExportingPng(true);
    if (onToast) onToast(`📸 Sedang membuat file PNG Peta ${currentHub.name} (16:9 HD)...`);
    try {
      await downloadAreaMapPng({
        activeHub: currentHub,
        allHubs: hubs,
        companyName: 'PT KUSUMA GEMILANG RAYA',
        clientTarget: clientName || 'Presentasi B2B & Kunjungan Lapangan',
      });
      if (onToast) onToast(`✅ File PNG Peta ${currentHub.name} berhasil diunduh!`);
    } catch (e) {
      console.error('Failed to export map PNG in modal:', e);
      if (onToast) onToast('Gagal mengekspor gambar PNG peta.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handlePrint = () => {
    if (onToast) {
      onToast('🖨️ Membuka dialog cetak browser (Pilih "Save as PDF" atau printer fisik)...');
    }
    // Small timeout to allow UI state to settle
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleCopyGps = () => {
    const coords = `${currentHub.lat}, ${currentHub.lng}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(coords);
    }
    if (onToast) {
      onToast(`📍 Koordinat GPS ${coords} berhasil disalin ke clipboard!`);
    }
  };

  const handleCopyMapsUrl = () => {
    const targetUrl = currentHub.mapsDirectUrl || googleMapsNavUrl;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(targetUrl);
    }
    if (onToast) {
      onToast(`🔗 Tautan navigasi Google Maps (${currentHub.name}) berhasil disalin!`);
    }
  };

  const handleDownloadQr = () => {
    let downloadSrc = effectiveQrSrc;
    if (qrCanvasRef.current) {
      try {
        downloadSrc = qrCanvasRef.current.toDataURL('image/png');
      } catch (canvasErr) {
        console.warn('Canvas export fallback:', canvasErr);
      }
    }
    if (!downloadSrc) return;
    const link = document.createElement('a');
    const safeName = (currentHub.shortName || currentHub.name).replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `QR_GoogleMaps_${currentHub.id}_${safeName}.png`;
    link.href = downloadSrc;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onToast) {
      onToast(`📥 QR Code Google Maps untuk ${currentHub.name} berhasil diunduh!`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-start py-4 px-2 sm:px-4 md:py-8">
      {/* Top Floating Control Bar (hidden in print) */}
      <div className="print-hide sticky top-2 z-60 w-full max-w-4xl bg-navy text-white rounded-2xl shadow-2xl border border-cyan/40 p-3 sm:p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-cyan/20 border border-cyan text-cyan flex items-center justify-center text-xl shrink-0">
            🖨️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                Print Preview: Lembar Kunjungan Lapangan
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan text-navy uppercase tracking-wider">
                1 Lembar A4
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Format siap cetak untuk survei fisik site visit, audit vendor & rute armada
            </p>
          </div>
        </div>

        {/* Hub Selector Pills in Header */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 w-full md:w-auto">
          {hubs.map((hub, idx) => (
            <button
              key={hub.id}
              type="button"
              onClick={() => onSelectHubIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeHubIndex === idx
                  ? 'bg-cyan text-navy shadow-md scale-102'
                  : 'bg-navy-light text-gray-200 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>{hub.pinIcon || '📍'}</span>
              <span className="truncate max-w-[110px] sm:max-w-none">{hub.shortName || hub.name}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setIsEditingCustomFields(!isEditingCustomFields)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cyan-light border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            title="Kustomisasi nama klien, petugas, atau catatan lapangan"
          >
            <span>✏️</span>
            <span className="hidden sm:inline">{isEditingCustomFields ? 'Tutup Edit' : 'Edit Klien'}</span>
          </button>
          <button
            type="button"
            onClick={handleRegenerateAndInjectQr}
            disabled={isQrLoading}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-cyan/20 hover:bg-cyan/30 text-cyan border border-cyan/40 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Generate & Injeksi QR Code Google Maps langsung ke dokumen cetak"
          >
            <span>⚡</span>
            <span className="hidden sm:inline">Inject QR</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadQr}
            disabled={!effectiveQrSrc || isQrLoading}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cyan-light border border-white/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Unduh QR Code Google Maps sebagai file gambar PNG"
          >
            <span>📱</span>
            <span className="hidden sm:inline">Unduh QR</span>
          </button>
          <button
            type="button"
            onClick={handleExportPng}
            disabled={isExportingPng}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-navy-light hover:bg-navy border border-cyan/40 text-cyan hover:text-cyan-light shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Simpan Peta Area terpilih sebagai gambar PNG 16:9 HD untuk materi presentasi B2B"
          >
            {isExportingPng ? (
              <span className="w-3.5 h-3.5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>📸</span>
            )}
            <span className="hidden sm:inline">Save Area Map (PNG)</span>
            <span className="sm:hidden">PNG</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-orange hover:bg-orange-dark text-white shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
            title="Cetak lembar atau simpan sebagai PDF"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak / PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
            title="Tutup Preview (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Optional In-Preview Customization Drawer (hidden in print) */}
      {isEditingCustomFields && (
        <div className="print-hide w-full max-w-4xl bg-slate-900 text-white rounded-2xl border border-cyan/30 p-4 mb-4 shadow-xl grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-fadeIn">
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Nama Perusahaan / Klien:</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan outline-none"
              placeholder="Contoh: PT Mattel Indonesia"
            />
          </div>
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Area / Lokasi Kunjungan:</label>
            <input
              type="text"
              value={siteLocation}
              onChange={(e) => setSiteLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan outline-none"
              placeholder="Contoh: Kawasan Industri Jababeka 1"
            />
          </div>
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Petugas / Surveyor:</label>
            <input
              type="text"
              value={surveyorName}
              onChange={(e) => setSurveyorName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan outline-none"
              placeholder="Nama surveyor lapangan"
            />
          </div>
          <div>
            <label className="block text-gray-400 font-semibold mb-1">Tanggal Kunjungan:</label>
            <input
              type="text"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan outline-none"
              placeholder="Contoh: 12 Oktober 2026"
            />
          </div>
          <div className="sm:col-span-2 md:col-span-4">
            <label className="block text-gray-400 font-semibold mb-1">Catatan Akses Rute & Fasilitas:</label>
            <input
              type="text"
              value={siteAccessNotes}
              onChange={(e) => setSiteAccessNotes(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan outline-none"
              placeholder="Catatan khusus akses jalan, portal tinggi, atau titik pipa"
            />
          </div>
        </div>
      )}

      {/* PRINTABLE DOCUMENT CONTAINER (Single-Page Formatted Sheet) */}
      <div
        id="print-hub-document"
        className="w-full max-w-4xl bg-white text-navy rounded-2xl shadow-2xl border border-gray-300 p-6 sm:p-8 md:p-10 transition-all font-sans relative overflow-hidden"
        style={{ minHeight: '1050px' }}
      >
        {/* Subtle Watermark on Sheet */}
        <div className="absolute right-4 bottom-4 pointer-events-none opacity-5 text-gray-900 font-black text-6xl tracking-widest uppercase select-none">
          PT KGR BEKASI
        </div>

        {/* 1. DOCUMENT HEADER */}
        <div className="border-b-2 border-navy pb-4 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center font-black text-lg border-2 border-cyan shadow-sm shrink-0">
              KGR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-navy">
                  PT KUSUMA GEMILANG RAYA
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy text-cyan border border-cyan/30">
                  LEGAL & TERVERIFIKASI
                </span>
              </div>
              <p className="text-[11px] text-gray-600 leading-tight">
                Jasa Sedot WC, Kuras Limbah STP, Grease Trap & Pelancaran Saluran Terpadu Bekasi
              </p>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                NIB OSS-RBA: 0220108920194 • KBLI 37011 • NPWP: 94.812.394.8-407.000
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs shrink-0 bg-slate-50 p-2.5 rounded-xl border border-gray-200">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
              DOKUMEN KUNJUNGAN LAPANGAN
            </p>
            <p className="font-mono font-bold text-navy text-xs">
              REF: KGR/VISIT-{currentHub.id.toUpperCase()}-2026
            </p>
            <p className="text-[11px] text-gray-700 mt-0.5">
              Tanggal: <strong>{visitDate}</strong>
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 sm:justify-end">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Armada Standby 24 Jam
            </p>
          </div>
        </div>

        {/* 2. DOCUMENT TITLE BANNER */}
        <div className="bg-navy text-white px-4 py-2.5 rounded-xl mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-sm sm:text-base font-extrabold uppercase tracking-wide flex items-center gap-2">
              <span>LEMBAR RUTE OPERASIONAL & SITE VISIT LAPANGAN</span>
              <span className="text-cyan text-xs font-normal">| {currentHub.name}</span>
            </h1>
            <p className="text-[11px] text-cyan-200">
              Panduan navigasi fisik, spesifikasi pos armada siaga, dan radius cakupan wilayah
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-cyan text-navy font-bold rounded-lg shrink-0">
            {currentHub.badge}
          </span>
        </div>

        {/* 3. SITE VISIT CLIENT & OFFICER BRIEF */}
        <div className="bg-slate-50 border border-gray-200 rounded-xl p-3 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Klien / Perusahaan:</span>
            <span className="font-bold text-navy block truncate">{clientName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Lokasi Kunjungan:</span>
            <span className="font-bold text-navy block truncate">{siteLocation}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Surveyor / PIC KGR:</span>
            <span className="font-bold text-navy block truncate">{surveyorName}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Status Operasi:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              Siap Kirim Armada
            </span>
          </div>
        </div>

        {/* 4. MAIN GRID: MAP SCHEMATIC & CONTACT DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
          {/* LEFT: Clean Schematic Hub Map Visual (7 Cols) */}
          <div className="md:col-span-7 bg-slate-900 rounded-xl p-3.5 text-white flex flex-col justify-between border border-gray-800 relative overflow-hidden">
            {/* Header of Map Visual */}
            <div className="flex items-center justify-between mb-2 z-10">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
                <span className="text-[11px] font-bold tracking-wider uppercase text-cyan">
                  PETA RUTE & RADIUS RESPON CEPAT BEKASI
                </span>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-gray-300">
                Skala: 1 : 50.000
              </span>
            </div>

            {/* High-Resolution Vector Schematic Map Representation */}
            <div className="relative w-full h-[220px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
              {/* Grid Lines */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Major Highway / Route Arteries representation */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Tol Jakarta - Cikampek */}
                <path d="M 0 45 Q 35 48, 65 60 T 100 70" fill="none" stroke="#f97316" strokeWidth="2.5" strokeOpacity="0.8" />
                {/* Jalan Pantura Arteri */}
                <path d="M 0 32 Q 40 38, 70 42 T 100 50" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeOpacity="0.6" strokeDasharray="3,1" />
                {/* Jalan Narogong / Bantar Gebang */}
                <path d="M 24 38 L 30 100" fill="none" stroke="#94a3b8" strokeWidth="1.2" strokeOpacity="0.4" />
                {/* Jalan Kalimalang */}
                <path d="M 0 40 Q 30 42, 60 52 L 100 58" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.5" />

                {/* Radar Concentric Circles around Active Hub */}
                {activeHubIndex === 0 && (
                  <>
                    <circle cx="22" cy="38" r="12" fill="none" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="2,2" strokeOpacity="0.7" />
                    <circle cx="22" cy="38" r="24" fill="none" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.4" />
                    <circle cx="22" cy="38" r="3" fill="#06b6d4" fillOpacity="0.3" />
                  </>
                )}
                {activeHubIndex === 1 && (
                  <>
                    <circle cx="78" cy="64" r="14" fill="none" stroke="#f97316" strokeWidth="0.8" strokeDasharray="2,2" strokeOpacity="0.7" />
                    <circle cx="78" cy="64" r="26" fill="none" stroke="#f97316" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.4" />
                    <circle cx="78" cy="64" r="3" fill="#f97316" fillOpacity="0.3" />
                  </>
                )}
                {activeHubIndex === 2 && (
                  <>
                    <circle cx="50" cy="48" r="13" fill="none" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2,2" strokeOpacity="0.7" />
                    <circle cx="50" cy="48" r="25" fill="none" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.4" />
                    <circle cx="50" cy="48" r="3" fill="#10b981" fillOpacity="0.3" />
                  </>
                )}
              </svg>

              {/* Highway Label */}
              <div className="absolute top-2 left-2 text-[9px] font-mono text-orange bg-black/60 px-1.5 py-0.5 rounded border border-orange/40">
                Tol Jkt-Cikampek Corridor
              </div>

              {/* QR Navigation Callout Badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-navy/85 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold text-cyan border border-cyan/40 shadow-xs">
                <span>📱 Scan QR Hub untuk Navigasi Rute HP</span>
              </div>

              {/* Standby Hub Markers on schematic map */}
              {hubs.map((hub, idx) => {
                const isActive = activeHubIndex === idx;
                return (
                  <div
                    key={hub.id}
                    style={{ left: hub.pinPos.left, top: hub.pinPos.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1 ${
                      isActive ? 'z-20 scale-105' : 'opacity-65 z-10'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-md border ${
                        isActive
                          ? 'bg-cyan text-navy border-white ring-2 ring-cyan/50 font-black'
                          : 'bg-slate-800 text-gray-200 border-gray-600 text-[10px]'
                      }`}
                    >
                      {hub.pinIcon || '📍'}
                    </div>
                    <div
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold whitespace-nowrap shadow ${
                        isActive
                          ? 'bg-navy/90 text-cyan border border-cyan/60'
                          : 'bg-black/70 text-gray-300'
                      }`}
                    >
                      {hub.shortName || hub.name}
                    </div>
                  </div>
                );
              })}

              {/* Compass Rose */}
              <div className="absolute bottom-2 right-2 flex flex-col items-center bg-black/60 p-1 rounded border border-gray-700 text-[8px] font-mono text-gray-300">
                <span className="font-bold text-cyan">▲ U</span>
                <span>(North)</span>
              </div>
            </div>

            {/* Bottom Coordinates & Quick Navigation Bar */}
            <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] z-10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan font-bold">GPS: {currentHub.lat}, {currentHub.lng}</span>
                <button
                  type="button"
                  onClick={handleCopyGps}
                  className="print-hide px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold cursor-pointer"
                >
                  Salin Koordinat
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[10px]">
                <span className="print-hide">📱 Scan QR samping untuk navigasi HP</span>
                <span className="hidden print:inline">📱 Scan QR samping untuk buka rute Google Maps</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Hub Specifications, Contact Details & Google Maps QR Code (5 Cols) */}
          <div className="md:col-span-5 bg-slate-50 rounded-xl p-4 border border-gray-200 flex flex-col justify-between text-xs">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2.5">
                <span className="text-[10px] uppercase font-bold text-gray-500">PROFIL POS OPERASIONAL</span>
                <span className="px-2 py-0.5 rounded bg-navy text-white text-[10px] font-bold">
                  {currentHub.badge}
                </span>
              </div>

              <h2 className="text-sm font-extrabold text-navy leading-snug mb-1">
                {currentHub.name}
              </h2>
              <p className="text-[11px] text-gray-600 mb-3 flex items-start gap-1 leading-relaxed">
                <span>📍</span>
                <span>{currentHub.address}</span>
              </p>

              {/* Contact Details Stack */}
              <div className="space-y-2 border-t border-gray-200 pt-2.5">
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-600 text-[11px]">Hotline Dispatcher 24 Jam:</span>
                  <span className="font-mono font-bold text-navy text-[12px]">{currentHub.phone}</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-600 text-[11px]">Kesiapan Armada Truk:</span>
                  <span className="font-bold text-navy text-[11px]">{currentHub.armadaCount}</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-600 text-[11px]">Estimasi Respon Tiba:</span>
                  <span className="font-bold text-emerald-700 text-[11px]">⚡ {currentHub.response}</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                  <span className="text-gray-600 text-[11px]">Kapasitas Tangki:</span>
                  <span className="font-bold text-navy text-[11px]">4.000 L - 6.000 L</span>
                </div>
              </div>

              {/* PROMINENT DYNAMIC QR CODE FOR GOOGLE MAPS NAVIGATION */}
              <div
                id="print-hub-qr-code-section"
                className="mt-3 p-3 sm:p-3.5 bg-gradient-to-br from-white via-cyan/[0.04] to-slate-50 rounded-xl border-2 border-cyan/50 shadow-sm relative overflow-hidden"
              >
                {/* Prominent Header Banner */}
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-cyan/20">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-navy text-cyan border border-cyan/40 flex items-center gap-1">
                      <span>📱</span>
                      <span>SCAN QR NAVIGASI GOOGLE MAPS</span>
                    </span>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300">
                      RUTE GPS HP
                    </span>
                  </div>
                  <span className="text-[9px] font-mono font-semibold text-gray-500 hidden sm:inline">
                    High-Res Vector
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  {/* High-Resolution QR Slot rendered via qrcode.react */}
                  <div
                    id="print-hub-qr-injected-slot"
                    className="relative shrink-0 p-1.5 bg-white border-2 border-cyan/40 rounded-xl shadow-xs group flex flex-col items-center justify-center cursor-pointer transition hover:scale-102 hover:border-cyan"
                    onClick={() => setIsQrModalZoomed(true)}
                    title="Klik untuk memperbesar QR Code Navigasi Google Maps (Tampilan HD)"
                  >
                    {/* Dynamic QR Code rendered via 'qrcode.react' for hub's mapsDirectUrl at high resolution */}
                    <div
                      id="print-hub-qrcode-react"
                      className="w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center p-1 bg-white rounded-lg"
                    >
                      {generateMapsDirectUrlQrCode(currentHub, {
                        size: 96,
                        level: 'H',
                        fgColor: '#0a192f',
                        bgColor: '#ffffff',
                        includeMargin: false,
                        className: 'w-full h-full object-contain cursor-pointer',
                      })}
                    </div>

                    {/* Synchronized companion image element for DOM compatibility */}
                    {effectiveQrSrc && (
                      <img
                        id="print-hub-qr-image"
                        src={effectiveQrSrc}
                        alt={`QR Code Google Maps ${currentHub.name}`}
                        data-maps-url={currentHub.mapsDirectUrl || googleMapsNavUrl}
                        data-hub-id={currentHub.id}
                        className="hidden"
                      />
                    )}

                    <div
                      className="absolute -bottom-1 -right-1 bg-cyan text-navy rounded-full p-1 shadow-md border-2 border-white text-[10px] font-black"
                      title="Navigasi Langsung Google Maps"
                    >
                      🗺️
                    </div>

                    <span className="print-hide text-[8px] font-semibold text-cyan-dark mt-1 group-hover:underline">
                      🔍 Tap untuk Zoom HD
                    </span>
                  </div>

                  {/* Information & Prominently Displayed Google Maps URL */}
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-[12px] font-extrabold text-navy leading-snug">
                      {currentHub.shortName || currentHub.name}
                    </p>
                    <p className="text-[10px] text-gray-600 leading-snug mt-0.5">
                      Arahkan kamera smartphone (iOS Camera / Google Lens / Android) untuk langsung membuka rute turn-by-turn ke titik pos ini ({currentHub.lat}, {currentHub.lng}).
                    </p>

                    {/* Prominently Displayed Hub's Google Maps URL */}
                    <div
                      id="print-hub-maps-url-container"
                      className="mt-2 p-2 bg-white rounded-lg border border-cyan/30 text-[10px] shadow-2xs text-left"
                    >
                      <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                        <span className="text-navy flex items-center gap-1">
                          <span>🔗</span>
                          <span>URL Google Maps Navigasi HP:</span>
                        </span>
                        <span className="text-cyan-dark font-mono text-[8px] uppercase">
                          Turn-by-turn
                        </span>
                      </div>
                      <div
                        id="print-hub-maps-url"
                        className="font-mono text-[9px] text-navy font-semibold break-all select-all leading-tight bg-slate-50 p-1.5 rounded border border-gray-200"
                        title="URL Navigasi Google Maps untuk pos ini"
                      >
                        {currentHub.mapsDirectUrl || googleMapsNavUrl}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center sm:justify-start">
                      <a
                        id="print-hub-maps-link"
                        href={currentHub.mapsDirectUrl || googleMapsNavUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy hover:bg-navy-light text-cyan text-[10px] font-bold transition border border-cyan/40 shadow-xs"
                        title="Buka langsung di aplikasi Google Maps"
                      >
                        <span>Buka Maps</span>
                        <span>↗</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleCopyMapsUrl}
                        className="print-hide inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-semibold transition cursor-pointer"
                        title="Salin tautan Google Maps ke clipboard"
                      >
                        <span>📋 Salin URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRegenerateAndInjectQr}
                        disabled={isQrLoading}
                        className="print-hide inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan/15 hover:bg-cyan/25 text-cyan-dark text-[10px] font-semibold transition cursor-pointer disabled:opacity-50"
                        title="Generate ulang QR Code dan injeksikan ke dokumen cetak"
                      >
                        <span>⚡ Inject QR</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadQr}
                        className="print-hide inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-semibold transition cursor-pointer"
                        title="Unduh QR Code sebagai file gambar PNG beresolusi tinggi"
                      >
                        <span>📥 Unduh PNG</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disposal Site & Legal Note */}
            <div className="mt-3 pt-2 border-t border-gray-200 text-[10px] text-gray-500">
              <span className="font-bold text-navy block">Pembuangan Akhir Legal & Bersertifikat:</span>
              <p className="leading-tight mt-0.5">
                IPLT Sumur Batu / IPLT Resmi Pemkab & Pemkot Bekasi (Bukan buang liar, bersertifikat BAST).
              </p>
            </div>
          </div>
        </div>

        {/* 5. COVERAGE AREA (CAKUPAN WILAYAH & KAWASAN) */}
        <div className="bg-cyan/5 border border-cyan/30 rounded-xl p-3.5 mb-4 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-navy text-xs uppercase tracking-wide flex items-center gap-1.5">
              <span>🌐</span>
              <span>Cakupan Wilayah Penanganan & Kawasan Industri Prioritas</span>
            </h3>
            <span className="text-[10px] font-semibold text-cyan-dark bg-cyan/15 px-2 py-0.5 rounded">
              Prioritas Respon 15-30 Menit
            </span>
          </div>
          <p className="text-[11px] text-gray-700 leading-relaxed bg-white p-2.5 rounded-lg border border-cyan/20">
            {currentHub.coverage}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-gray-600">
            <span className="font-bold text-navy">Kesesuaian Armada:</span>
            <span className="px-2 py-0.5 rounded bg-white border border-gray-200">
              ✓ Truk Engkel (Akses Gang Lebar &gt; 2.5m)
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-gray-200">
              ✓ Truk Tangki Double (Kawasan Pabrik & Mall)
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-gray-200">
              ✓ Sambungan Selang Panjang s/d 150 Meter
            </span>
          </div>
        </div>

        {/* 6. PHYSICAL SITE VISIT INSPECTION CHECKLIST (Formulir Pengawasan Lapangan) */}
        <div className="border border-gray-300 rounded-xl p-3 mb-4 text-xs bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 pb-1.5 mb-2">
            <h3 className="font-bold text-navy uppercase text-[11px] flex items-center gap-1.5">
              <span>📋</span>
              <span>Lembar Ceklist Verifikasi Site Visit & Kesiapan Teknis</span>
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Form: KGR-CHECK-SITE-2026</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-gray-700">
            <label className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center font-bold text-[9px] text-navy">
                ✓
              </span>
              <span>Akses Jalan Masuk & Ketinggian Portal (Min. 3.2m aman untuk truk)</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center font-bold text-[9px] text-navy">
                ✓
              </span>
              <span>Jarak Parkir Truk ke Manhole Septic Tank (&lt; 50m / sambung selang)</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center font-bold text-[9px] text-navy">
                ✓
              </span>
              <span>Kondisi Tutup Bak Kontrol / STP (Mudah diakses / butuh pelancaran)</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center font-bold text-[9px] text-navy">
                ✓
              </span>
              <span>Ketersediaan Sumber Air Bersih Pembilasan / Jetting Saluran</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center font-bold text-[9px] text-navy">
                ✓
              </span>
              <span>Kepatuhan K3 Confined Space & APD Lengkap (Masker, Boots, Sarung Tangan)</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center font-bold text-[9px] text-navy">
                ✓
              </span>
              <span>Penerbitan Berita Acara Serah Terima (BAST) & Dokumentasi Foto</span>
            </label>
            <label className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border border-gray-400 rounded flex items-center justify-center font-bold text-[9px] text-navy">
                ✓
              </span>
              <span>QR Code Navigasi Google Maps Tervalidasi (Akses Panduan Rute Smartphone Tamu/Klien)</span>
            </label>
          </div>

          {/* Access Notes Display */}
          <div className="mt-2.5 pt-2 border-t border-gray-200 flex items-start gap-2 text-[10px] text-gray-600">
            <span className="font-bold text-navy whitespace-nowrap">Catatan Khusus Lapangan:</span>
            <span className="italic">{siteAccessNotes}</span>
          </div>
        </div>

        {/* 7. SIGNATURE & VERIFICATION ROW */}
        <div className="grid grid-cols-2 gap-8 pt-2 pb-2 text-center text-xs">
          <div className="border-t border-gray-400 pt-1.5">
            <p className="text-[10px] text-gray-500 font-semibold mb-8">
              Surveyor / Petugas Lapangan PT KGR
            </p>
            <p className="font-bold text-navy text-[11px] underline">{surveyorName}</p>
            <p className="text-[9px] text-gray-500 font-mono">Kepala Dispatch / Teknisi Resmi</p>
          </div>
          <div className="border-t border-gray-400 pt-1.5">
            <p className="text-[10px] text-gray-500 font-semibold mb-8">
              Perwakilan Klien / Pengawas Lapangan
            </p>
            <p className="font-bold text-navy text-[11px] underline">{clientName}</p>
            <p className="text-[9px] text-gray-500 font-mono">PIC Operasional / Site Manager</p>
          </div>
        </div>

        {/* 8. FOOTER LEGAL & COMPLIANCE BAR */}
        <div className="border-t border-gray-300 pt-2.5 mt-2 flex flex-col sm:flex-row items-center justify-between text-[9px] text-gray-500">
          <div>
            PT KUSUMA GEMILANG RAYA • Hotline 24 Jam: 0896-7506-4916 • Email: legal@sedotwckusuma.com • Navigasi: Scan QR di atas via Google Maps
          </div>
          <div className="font-mono text-gray-400 mt-1 sm:mt-0">
            Dokumen Resmi Kunjungan Lapangan & Rute Logistik Hub • Halaman 1 dari 1 (A4)
          </div>
        </div>
      </div>

      {/* Zoomed QR Modal View */}
      {isQrModalZoomed && (
        <div
          className="print-hide fixed inset-0 z-70 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsQrModalZoomed(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-2 border-cyan text-navy animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-navy text-cyan mx-auto flex items-center justify-center text-2xl font-bold mb-3 shadow-md">
              📱
            </div>
            <h3 className="font-extrabold text-base text-navy">
              Scan Navigasi HP Google Maps
            </h3>
            <p className="text-xs text-gray-600 mt-1 font-medium">
              {currentHub.name} ({currentHub.badge})
            </p>

            <div className="p-3 bg-slate-50 border border-gray-200 rounded-2xl inline-block mt-4 shadow-inner">
              <div className="w-56 h-56 mx-auto flex items-center justify-center p-2 bg-white rounded-xl shadow-xs">
                {generateMapsDirectUrlQrCode(currentHub, {
                  size: 212,
                  level: 'H',
                  fgColor: '#0a192f',
                  bgColor: '#ffffff',
                })}
              </div>
            </div>

            <p className="text-[11px] text-gray-500 mt-3 font-mono break-all px-2">
              GPS: {currentHub.lat}, {currentHub.lng}
            </p>

            <div className="mt-2 text-left bg-slate-50 p-2.5 rounded-xl border border-gray-200 text-xs">
              <span className="text-[10px] font-bold text-gray-600 block mb-0.5">
                🔗 URL Google Maps (Navigasi HP):
              </span>
              <p className="font-mono text-[10px] text-navy font-semibold break-all select-all bg-white p-1.5 rounded border border-gray-200">
                {currentHub.mapsDirectUrl || googleMapsNavUrl}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <a
                href={currentHub.mapsDirectUrl || googleMapsNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-navy text-cyan text-xs font-bold hover:bg-navy-light transition flex items-center gap-1 shadow-sm"
              >
                <span>Buka di Maps</span>
                <span>↗</span>
              </a>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="px-3.5 py-2 rounded-xl bg-orange text-white text-xs font-bold hover:bg-orange-dark transition cursor-pointer shadow-sm"
              >
                Unduh PNG
              </button>
              <button
                type="button"
                onClick={() => setIsQrModalZoomed(false)}
                className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden QRCodeCanvas for direct high-resolution PNG export using 'qrcode.react' */}
      <div className="hidden" aria-hidden="true">
        <QRCodeCanvas
          ref={qrCanvasRef}
          value={currentHub.mapsDirectUrl || googleMapsNavUrl}
          size={360}
          level="H"
          fgColor="#0a192f"
          bgColor="#ffffff"
          marginSize={2}
        />
      </div>
    </div>
  );
};
