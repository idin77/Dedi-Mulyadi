import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { downloadAreaMapPng } from '../utils/exportAreaMapToPng';
import { EquipmentMaintenanceQrScanner } from './EquipmentMaintenanceQrScanner';
import { CORPORATE_CLIENTS } from '../data/corporateClients';

export { EquipmentMaintenanceQrScanner };

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

export interface RecentQrPrintItem {
  id: string;
  url: string;
  label: string;
  note?: string;
  hubId?: string;
  createdAt: string;
}

export const RECENT_PRINTS_STORAGE_KEY = 'kgr_technician_recent_qr_prints_v1';

export const DEFAULT_RECENT_PRINTS: RecentQrPrintItem[] = [
  {
    id: 'rec-1',
    url: 'https://maps.google.com/?q=-6.2383,106.9925',
    label: 'Pos Hub Barat (Tol Bekasi Barat)',
    note: 'Area standby armada tangki sedot limbah Bekasi Barat',
    hubId: 'hub-barat',
    createdAt: '10:00 WIB',
  },
  {
    id: 'rec-2',
    url: 'https://maps.google.com/?q=-6.3015,107.0980',
    label: 'Loading Dock Kawasan MM2100',
    note: 'Gerbang akses truk tangki sedot pabrik Cikarang Barat',
    hubId: 'hub-cikarang',
    createdAt: '09:30 WIB',
  },
  {
    id: 'rec-3',
    url: 'https://maps.google.com/?q=-6.2654,107.1023&label=Manhole+STP',
    label: 'Titik Manhole STP Kawasan Cibitung',
    note: 'Koordinat manhole bak kontrol utama teknisi KGR',
    hubId: 'hub-cibitung',
    createdAt: '08:45 WIB',
  },
  {
    id: 'rec-4',
    url: 'https://maps.google.com/?q=-6.3685,107.1820',
    label: 'Gerbang GIIC Deltamas Cikarang',
    note: 'Akses sekuriti barat pabrik manufaktur GIIC',
    hubId: 'hub-cikarang',
    createdAt: 'Kemarin',
  },
  {
    id: 'rec-5',
    url: 'https://sedotwckusuma.com/portal-bast-digital',
    label: 'Portal Digital BAST & Manifest IPLT',
    note: 'Verifikasi serah terima pekerjaan dan berita acara resmi',
    hubId: 'hub-barat',
    createdAt: 'Kemarin',
  },
];

export interface PrintHistoryAuditEntry {
  id: string;
  timestamp: string;
  isoTimestamp: string;
  url: string;
  label: string;
  hubId: string;
  technician: string;
  actionType: 'GENERATE' | 'PRINT' | 'CUSTOM_URL' | 'PRESET';
  auditHash: string;
}

export const PRINT_HISTORY_STORAGE_KEY = 'kgr_qr_print_history_audit_v1';

export const DEFAULT_PRINT_HISTORY: PrintHistoryAuditEntry[] = [
  {
    id: 'audit-01',
    timestamp: '13 Okt 2026, 09:45:12 WIB',
    isoTimestamp: '2026-10-13T09:45:12.000Z',
    url: 'https://maps.google.com/?q=-6.2383,106.9925',
    label: 'Pos Hub Barat (Tol Bekasi Barat)',
    hubId: 'hub-barat',
    technician: 'Bpk. Hendra Prasetyo',
    actionType: 'PRINT',
    auditHash: 'KGR-AUDIT-9F2B',
  },
  {
    id: 'audit-02',
    timestamp: '13 Okt 2026, 09:12:05 WIB',
    isoTimestamp: '2026-10-13T09:12:05.000Z',
    url: 'https://maps.google.com/?q=-6.3015,107.0980',
    label: 'Loading Dock Kawasan MM2100',
    hubId: 'hub-cikarang',
    technician: 'Bpk. Hendra Prasetyo',
    actionType: 'CUSTOM_URL',
    auditHash: 'KGR-AUDIT-8C1A',
  },
  {
    id: 'audit-03',
    timestamp: '13 Okt 2026, 08:35:48 WIB',
    isoTimestamp: '2026-10-13T08:35:48.000Z',
    url: 'https://maps.google.com/?q=-6.2654,107.1023&label=Manhole+STP',
    label: 'Titik Manhole STP Kawasan Cibitung',
    hubId: 'hub-cibitung',
    technician: 'Tim Dispatcher KGR',
    actionType: 'GENERATE',
    auditHash: 'KGR-AUDIT-7E4F',
  },
  {
    id: 'audit-04',
    timestamp: '13 Okt 2026, 07:50:22 WIB',
    isoTimestamp: '2026-10-13T07:50:22.000Z',
    url: 'https://maps.google.com/?q=-6.3685,107.1820',
    label: 'Gerbang GIIC Deltamas Cikarang',
    hubId: 'hub-cikarang',
    technician: 'Bpk. Hendra Prasetyo',
    actionType: 'PRINT',
    auditHash: 'KGR-AUDIT-6B3D',
  },
  {
    id: 'audit-05',
    timestamp: '12 Okt 2026, 17:15:30 WIB',
    isoTimestamp: '2026-10-12T17:15:30.000Z',
    url: 'https://sedotwckusuma.com/portal-bast-digital',
    label: 'Portal Digital BAST & Manifest IPLT',
    hubId: 'hub-barat',
    technician: 'Supervisor Operasional',
    actionType: 'GENERATE',
    auditHash: 'KGR-AUDIT-5A9C',
  },
  {
    id: 'audit-06',
    timestamp: '12 Okt 2026, 15:40:19 WIB',
    isoTimestamp: '2026-10-12T15:40:19.000Z',
    url: 'https://maps.google.com/?q=-6.2842,107.1425',
    label: 'Kawasan Industri Jababeka 1 & 2',
    hubId: 'hub-cikarang',
    technician: 'Tim Dispatcher KGR',
    actionType: 'CUSTOM_URL',
    auditHash: 'KGR-AUDIT-4F8E',
  },
  {
    id: 'audit-07',
    timestamp: '12 Okt 2026, 14:05:44 WIB',
    isoTimestamp: '2026-10-12T14:05:44.000Z',
    url: 'https://maps.google.com/?q=-6.2383,106.9925',
    label: 'Rute Armada Darurat Tol Timur',
    hubId: 'hub-barat',
    technician: 'Bpk. Hendra Prasetyo',
    actionType: 'PRINT',
    auditHash: 'KGR-AUDIT-3D7A',
  },
  {
    id: 'audit-08',
    timestamp: '12 Okt 2026, 11:22:15 WIB',
    isoTimestamp: '2026-10-12T11:22:15.000Z',
    url: 'https://maps.google.com/?q=-6.2654,107.1023',
    label: 'Pos Armada Siaga Pos Cibitung',
    hubId: 'hub-cibitung',
    technician: 'Bpk. Hendra Prasetyo',
    actionType: 'GENERATE',
    auditHash: 'KGR-AUDIT-2C6B',
  },
  {
    id: 'audit-09',
    timestamp: '12 Okt 2026, 09:10:02 WIB',
    isoTimestamp: '2026-10-12T09:10:02.000Z',
    url: 'https://maps.google.com/?q=-6.3015,107.0980',
    label: 'Bak STP Sentral PT Maruhide',
    hubId: 'hub-cikarang',
    technician: 'Koordinator Lapangan KGR',
    actionType: 'PRINT',
    auditHash: 'KGR-AUDIT-1B5F',
  },
  {
    id: 'audit-10',
    timestamp: '11 Okt 2026, 16:30:55 WIB',
    isoTimestamp: '2026-10-11T16:30:55.000Z',
    url: 'https://maps.google.com/?q=-6.2383,106.9925',
    label: 'Inspeksi Truk Tangki 6000L Pos Barat',
    hubId: 'hub-barat',
    technician: 'Kepala Armada Truk',
    actionType: 'GENERATE',
    auditHash: 'KGR-AUDIT-0A4E',
  },
];

export interface RecentQrGenerationEntry {
  id: string;
  url: string;
  label: string;
  note?: string;
  timestamp: string;
  isoTimestamp?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  color?: string;
}

export const RECENT_QR_GENERATION_STORAGE_KEY = 'kgr_recent_qr_generation_table_v1';

export const DEFAULT_RECENT_QR_GENERATIONS: RecentQrGenerationEntry[] = [
  {
    id: 'gen-01',
    url: 'https://maps.google.com/?q=-6.2383,106.9925',
    label: 'Pos Hub Barat (Tol Bekasi Barat)',
    note: 'Area standby armada tangki sedot limbah Bekasi Barat',
    timestamp: '13 Okt 2026, 10:15 WIB',
    isoTimestamp: '2026-10-13T10:15:00.000Z',
    level: 'H',
    color: '#0a192f',
  },
  {
    id: 'gen-02',
    url: 'https://maps.google.com/?q=-6.3015,107.0980',
    label: 'Loading Dock Kawasan MM2100',
    note: 'Gerbang akses truk tangki sedot pabrik Cikarang Barat',
    timestamp: '13 Okt 2026, 09:40 WIB',
    isoTimestamp: '2026-10-13T09:40:00.000Z',
    level: 'H',
    color: '#0a192f',
  },
  {
    id: 'gen-03',
    url: 'https://maps.google.com/?q=-6.2654,107.1023&label=Manhole+STP',
    label: 'Titik Manhole STP Kawasan Cibitung',
    note: 'Koordinat manhole bak kontrol utama teknisi KGR',
    timestamp: '13 Okt 2026, 09:10 WIB',
    isoTimestamp: '2026-10-13T09:10:00.000Z',
    level: 'H',
    color: '#0a192f',
  },
  {
    id: 'gen-04',
    url: 'https://maps.google.com/?q=-6.3685,107.1820',
    label: 'Gerbang GIIC Deltamas Cikarang',
    note: 'Akses sekuriti barat pabrik manufaktur GIIC',
    timestamp: '13 Okt 2026, 08:30 WIB',
    isoTimestamp: '2026-10-13T08:30:00.000Z',
    level: 'H',
    color: '#0a192f',
  },
  {
    id: 'gen-05',
    url: 'https://maps.google.com/?q=-6.2891,107.0345',
    label: 'Akses Truk Kawasan Industri Gobel Cibitung',
    note: 'Gerbang utama logistik kawasan Gobel',
    timestamp: '12 Okt 2026, 16:45 WIB',
    isoTimestamp: '2026-10-12T16:45:00.000Z',
    level: 'H',
    color: '#0a192f',
  },
  {
    id: 'gen-06',
    url: 'https://maps.google.com/?q=-6.2550,107.0012',
    label: 'Bak Kontrol Ruko Summarecon Bekasi',
    note: 'Akses grease trap blok komersial Summarecon',
    timestamp: '12 Okt 2026, 14:20 WIB',
    isoTimestamp: '2026-10-12T14:20:00.000Z',
    level: 'H',
    color: '#0a192f',
  },
  {
    id: 'gen-07',
    url: 'https://sedotwckusuma.com/portal-bast-digital',
    label: 'Portal Digital BAST & Manifest IPLT',
    note: 'Verifikasi serah terima pekerjaan dan berita acara resmi',
    timestamp: '12 Okt 2026, 11:15 WIB',
    isoTimestamp: '2026-10-12T11:15:00.000Z',
    level: 'H',
    color: '#0a192f',
  },
];

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

  // Dedicated Custom URL & Dynamic QR Generator state for on-site printing
  const [customQrUrl, setCustomQrUrl] = useState<string>('');
  const [customQrLabel, setCustomQrLabel] = useState<string>('Rute Akses On-Site / Gerbang Khusus Truk');
  const [customQrNote, setCustomQrNote] = useState<string>('Pindai QR untuk membuka titik lokasi navigasi langsung di HP');
  const [customQrLevel, setCustomQrLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [customQrColor, setCustomQrColor] = useState<string>('#0a192f');
  const [customQrGeneratedTimestamp, setCustomQrGeneratedTimestamp] = useState<string>(() => {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  });

  // Recent Prints state (last 5 generated custom URLs in localStorage)
  const [recentPrints, setRecentPrints] = useState<RecentQrPrintItem[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_RECENT_PRINTS;
    try {
      const stored = localStorage.getItem(RECENT_PRINTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch (e) {
      console.warn('Failed to load recent prints from localStorage:', e);
    }
    return DEFAULT_RECENT_PRINTS;
  });

  // Print History state (stores last 10 generated QR codes with exact timestamps for audit tracking)
  const [printHistory, setPrintHistory] = useState<PrintHistoryAuditEntry[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_PRINT_HISTORY;
    try {
      const stored = localStorage.getItem(PRINT_HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 10);
        }
      }
    } catch (e) {
      console.warn('Failed to load print history from localStorage:', e);
    }
    return DEFAULT_PRINT_HISTORY;
  });

  // Recent QR Generation Table state (persists last 10 generated custom URLs in localStorage)
  const [recentQrGenerations, setRecentQrGenerations] = useState<RecentQrGenerationEntry[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_RECENT_QR_GENERATIONS;
    try {
      const stored = localStorage.getItem(RECENT_QR_GENERATION_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 10);
        }
      }
    } catch (e) {
      console.warn('Failed to load recent QR generations from localStorage:', e);
    }
    return DEFAULT_RECENT_QR_GENERATIONS;
  });

  // Helper to add or update generated custom URL in Recent QR Generation table (capped at 10 items)
  const addRecentQrGeneration = (
    url: string,
    label?: string,
    note?: string,
    level?: 'L' | 'M' | 'Q' | 'H',
    color?: string
  ) => {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    const cleanLabel = (label && label.trim()) || 'Titik Kunjungan Lapangan';
    const cleanNote = note?.trim() || 'Pindai QR untuk navigasi lapangan';
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const fullTimestamp = `${dateStr}, ${timeStr} WIB`;

    setRecentQrGenerations((prev) => {
      const filtered = prev.filter((item) => item.url.toLowerCase() !== cleanUrl.toLowerCase());
      const newEntry: RecentQrGenerationEntry = {
        id: `qr-gen-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        url: cleanUrl,
        label: cleanLabel,
        note: cleanNote,
        timestamp: fullTimestamp,
        isoTimestamp: now.toISOString(),
        level: level || customQrLevel,
        color: color || customQrColor,
      };
      const updated = [newEntry, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(RECENT_QR_GENERATION_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save recent QR generations to localStorage:', err);
      }
      return updated;
    });
  };

  const handleClearRecentQrGenerations = () => {
    setRecentQrGenerations([]);
    try {
      localStorage.removeItem(RECENT_QR_GENERATION_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear recent QR generations in localStorage:', e);
    }
    if (onToast) onToast('🗑️ Tabel Recent QR Generation berhasil dibersihkan dari penyimpanan lokal.');
  };

  // Re-print button handler: re-renders the specific QR code in the document
  const handleRePrintQr = (entry: RecentQrGenerationEntry, immediatePrint: boolean = false) => {
    setCustomQrUrl(entry.url);
    if (entry.label) setCustomQrLabel(entry.label);
    if (entry.note) setCustomQrNote(entry.note);
    if (entry.level) setCustomQrLevel(entry.level);
    if (entry.color) setCustomQrColor(entry.color);
    const newTimestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    setCustomQrGeneratedTimestamp(newTimestamp);

    // Bump in recent QR generations table & recent prints
    addRecentQrGeneration(entry.url, entry.label, entry.note, entry.level, entry.color);
    addRecentPrint(entry.url, entry.label, entry.note);
    addPrintHistoryEntry(entry.url, entry.label, immediatePrint ? 'PRINT' : 'GENERATE');

    // Scroll smoothly to active QR section
    const qrSection = document.getElementById('print-hub-custom-url-qr-section');
    if (qrSection) {
      qrSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (immediatePrint) {
      if (onToast) onToast(`🖨️ Re-Print: Memuat "${entry.label}" & membuka dialog cetak...`);
      setTimeout(() => {
        window.print();
      }, 250);
    } else {
      if (onToast) onToast(`🔄 Re-Print: QR Code "${entry.label}" berhasil di-render ulang!`);
    }
  };

  const [isPrintHistorySidebarOpen, setIsPrintHistorySidebarOpen] = useState<boolean>(true);

  // Helper to add audit entry to print history (max 10 entries)
  const addPrintHistoryEntry = (
    url: string,
    label: string,
    actionType: 'GENERATE' | 'PRINT' | 'CUSTOM_URL' | 'PRESET' = 'GENERATE'
  ) => {
    if (!url || !url.trim()) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const fullTimestamp = `${dateStr}, ${timeStr} WIB`;
    const auditHash = `KGR-AUDIT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setPrintHistory((prev) => {
      const newEntry: PrintHistoryAuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: fullTimestamp,
        isoTimestamp: now.toISOString(),
        url: url.trim(),
        label: (label && label.trim()) || 'Titik Kunjungan Lapangan',
        hubId: currentHub?.id || 'hub-default',
        technician: surveyorName || 'Tim Dispatcher KGR',
        actionType,
        auditHash,
      };
      const updated = [newEntry, ...prev].slice(0, 10);
      try {
        localStorage.setItem(PRINT_HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save print history to localStorage:', e);
      }
      return updated;
    });
  };

  const handleClearPrintHistory = () => {
    setPrintHistory([]);
    try {
      localStorage.removeItem(PRINT_HISTORY_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear print history in localStorage:', e);
    }
    if (onToast) onToast('🗑️ Seluruh log audit Print History berhasil dibersihkan.');
  };

  const handleSelectAuditEntry = (entry: PrintHistoryAuditEntry, autoPrint: boolean = false) => {
    setCustomQrUrl(entry.url);
    setCustomQrLabel(entry.label);
    const newTimestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    setCustomQrGeneratedTimestamp(newTimestamp);
    addRecentPrint(entry.url, entry.label);
    addPrintHistoryEntry(entry.url, entry.label, autoPrint ? 'PRINT' : 'GENERATE');

    if (autoPrint) {
      if (onToast) onToast(`🖨️ Audit [${entry.auditHash}]: Memuat "${entry.label}" & membuka dialog cetak...`);
      setTimeout(() => {
        window.print();
      }, 250);
    } else {
      if (onToast) onToast(`⚡ Audit [${entry.auditHash}]: Tag "${entry.label}" dimuat ke QR Code!`);
    }
  };

  // Effective Custom QR URL fallback
  const effectiveCustomUrl =
    (customQrUrl && customQrUrl.trim()) ||
    currentHub.mapsDirectUrl ||
    googleMapsNavUrl ||
    'https://sedotwckusuma.com';

  // Synchronize default custom URL when currentHub changes if customQrUrl is not set or matches previous default
  useEffect(() => {
    if (!customQrUrl && currentHub) {
      setCustomQrUrl(currentHub.mapsDirectUrl || googleMapsNavUrl);
      setCustomQrLabel(`Pos Siaga KGR - ${currentHub.name}`);
    }
  }, [currentHub, isOpen]);

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
      (window as any).setCustomQrUrl = (url: string) => setCustomQrUrl(url);
      (window as any).getCustomQrUrl = () => customQrUrl;
      (window as any).getRecentPrints = () => recentPrints;
      (window as any).getPrintHistory = () => printHistory;
      (window as any).addPrintHistoryEntry = addPrintHistoryEntry;
      (window as any).handleClearPrintHistory = handleClearPrintHistory;
      (window as any).getRecentQrGenerations = () => recentQrGenerations;
      (window as any).addRecentQrGeneration = addRecentQrGeneration;
      (window as any).handleRePrintQr = handleRePrintQr;
      (window as any).handleClearRecentQrGenerations = handleClearRecentQrGenerations;
    }
  }, [currentHub, customQrUrl, recentPrints, printHistory, recentQrGenerations]);

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

  // Handlers for Dedicated Custom URL & Dynamic QR Generator Section
  const addRecentPrint = (url: string, label: string, note?: string) => {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    const cleanLabel = (label && label.trim()) || 'Titik Kunjungan Lapangan';
    const cleanNote = note?.trim() || 'Pindai QR untuk navigasi lapangan';
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    setRecentPrints((prev) => {
      const filtered = prev.filter((item) => item.url.toLowerCase() !== cleanUrl.toLowerCase());
      const newItem: RecentQrPrintItem = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        url: cleanUrl,
        label: cleanLabel,
        note: cleanNote,
        hubId: currentHub?.id,
        createdAt: timeStr,
      };
      const updated = [newItem, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(RECENT_PRINTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save recent prints to localStorage:', err);
      }
      return updated;
    });
  };

  const handleClearRecentPrints = () => {
    setRecentPrints([]);
    try {
      localStorage.removeItem(RECENT_PRINTS_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear recent prints in localStorage:', e);
    }
    if (onToast) onToast('🗑️ Daftar Recent Prints berhasil dikosongkan.');
  };

  const handleSelectRecentPrint = (item: RecentQrPrintItem, autoPrint: boolean = false) => {
    setCustomQrUrl(item.url);
    setCustomQrLabel(item.label);
    if (item.note) setCustomQrNote(item.note);
    const newTimestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    setCustomQrGeneratedTimestamp(newTimestamp);

    // Bump to top of recent prints list and recent QR generations table
    addRecentPrint(item.url, item.label, item.note);
    addRecentQrGeneration(item.url, item.label, item.note);

    if (autoPrint) {
      if (onToast) onToast(`🖨️ Memuat "${item.label}" & membuka dialog cetak langsung...`);
      setTimeout(() => {
        window.print();
      }, 250);
    } else {
      if (onToast) onToast(`⚡ Tag "${item.label}" berhasil dimuat & QR Code di-generate ulang!`);
    }
  };

  const handleGenerateCustomQr = () => {
    if (!customQrUrl.trim()) {
      if (onToast) onToast('⚠️ Silakan masukkan URL target terlebih dahulu.');
      return;
    }
    const newTimestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    setCustomQrGeneratedTimestamp(newTimestamp);
    addRecentPrint(customQrUrl, customQrLabel, customQrNote);
    addRecentQrGeneration(customQrUrl, customQrLabel, customQrNote, customQrLevel, customQrColor);
    if (onToast) {
      onToast(`⚡ Dynamic QR Code generated (${customQrLabel || 'On-Site'}) & tersimpan di Recent QR Generation!`);
    }
  };

  const handleGenerateAndPrintImmediately = () => {
    if (!customQrUrl.trim()) {
      if (onToast) onToast('⚠️ Silakan masukkan URL target terlebih dahulu.');
      return;
    }
    const newTimestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    setCustomQrGeneratedTimestamp(newTimestamp);
    addRecentPrint(customQrUrl, customQrLabel, customQrNote);
    addRecentQrGeneration(customQrUrl, customQrLabel, customQrNote, customQrLevel, customQrColor);
    if (onToast) {
      onToast('🖨️ Dynamic QR Code generated & tersimpan di Recent QR Generation! Membuka dialog print...');
    }
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const handleApplyPresetUrl = (url: string, label: string, note?: string) => {
    setCustomQrUrl(url);
    setCustomQrLabel(label);
    if (note) setCustomQrNote(note);
    const newTimestamp =
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setCustomQrGeneratedTimestamp(newTimestamp);
    addRecentPrint(url, label, note);
    addRecentQrGeneration(url, label, note, customQrLevel, customQrColor);
    if (onToast) {
      onToast(`🎯 Preset "${label}" berhasil diterapkan & tersimpan di Recent QR Generation!`);
    }
  };

  const handleDownloadCustomQrPng = async () => {
    const urlToUse = effectiveCustomUrl;
    try {
      const dataUrl = await QRCode.toDataURL(urlToUse, {
        width: 480,
        margin: 2,
        color: {
          dark: customQrColor,
          light: '#ffffff',
        },
        errorCorrectionLevel: customQrLevel,
      });
      const link = document.createElement('a');
      const safeTitle = (customQrLabel || 'custom_qr_kgr').replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `QR_OnSite_${safeTitle}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (onToast) onToast('📥 QR Code Kustom On-Site berhasil diunduh sebagai gambar PNG!');
    } catch (err) {
      console.error('Failed to export custom QR PNG:', err);
      if (onToast) onToast('Gagal mengunduh QR Code Kustom.');
    }
  };

  const handleCopyCustomUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(effectiveCustomUrl);
    }
    if (onToast) onToast('📋 URL Kustom On-Site berhasil disalin ke clipboard!');
  };

  const handleTestOpenCustomUrl = () => {
    if (!effectiveCustomUrl) return;
    window.open(effectiveCustomUrl, '_blank', 'noopener,noreferrer');
  };

  const handleResetToCurrentHub = () => {
    const hubUrl = currentHub.mapsDirectUrl || getGoogleMapsNavUrl(currentHub);
    setCustomQrUrl(hubUrl);
    setCustomQrLabel(`Pos Siaga KGR - ${currentHub.name}`);
    setCustomQrNote('Pindai QR via kamera HP untuk navigasi langsung ke titik pos ini');
    setCustomQrGeneratedTimestamp(
      new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    );
    if (onToast) onToast(`↺ URL QR Kustom di-reset ke pos ${currentHub.shortName || currentHub.name}.`);
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
            onClick={() => {
              const el = document.getElementById('print-hub-custom-url-qr-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-cyan/20 hover:bg-cyan/30 text-cyan border border-cyan/40 transition flex items-center gap-1.5 cursor-pointer"
            title="Kustomisasi URL target & generate QR dinamis untuk cetak on-site"
          >
            <span>🔗</span>
            <span className="hidden sm:inline">QR Kustom On-Site</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('print-hub-recent-qr-generation-table');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cyan-light border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            title="Lihat Tabel Recent QR Generation (10 URL Tersimpan di LocalStorage)"
          >
            <span>📊</span>
            <span className="hidden sm:inline">Tabel QR ({recentQrGenerations.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPrintHistorySidebarOpen(!isPrintHistorySidebarOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              isPrintHistorySidebarOpen
                ? 'bg-cyan text-navy border-cyan shadow-sm font-bold'
                : 'bg-white/10 hover:bg-white/20 text-cyan-light border-white/20'
            }`}
            title="Buka / Tutup Sidebar Print History (Audit Tracking 10 Timestamp Terakhir)"
          >
            <span>📜</span>
            <span className="hidden sm:inline">Print History ({printHistory.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('print-hub-equipment-scanner-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-cyan-light border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
            title="Pindai QR Alat & Buka Log Pemeliharaan Teknisi Lapangan"
          >
            <span>🔍</span>
            <span className="hidden sm:inline">Scan Alat</span>
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
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-gray-400 font-semibold">Nama Perusahaan / Klien:</label>
              <span className="text-[10px] text-cyan font-bold">15 Rekanan Tersedia</span>
            </div>
            <input
              type="text"
              list="corporate-clients-datalist"
              value={clientName}
              onChange={(e) => {
                const val = e.target.value;
                setClientName(val);
                const matched = CORPORATE_CLIENTS.find((c) => c.name.toLowerCase() === val.toLowerCase());
                if (matched && !siteLocation) {
                  setSiteLocation(matched.location);
                }
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-cyan outline-none text-xs"
              placeholder="Ketik atau pilih PT rekanan..."
            />
            <datalist id="corporate-clients-datalist">
              {CORPORATE_CLIENTS.map((c) => (
                <option key={c.id} value={c.name}>{c.sector} • {c.location}</option>
              ))}
            </datalist>

            {/* Quick selector chips */}
            <div className="flex flex-wrap gap-1 mt-1.5 max-h-16 overflow-y-auto">
              {CORPORATE_CLIENTS.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setClientName(c.name);
                    setSiteLocation(c.location);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer ${
                    clientName === c.name
                      ? 'bg-cyan text-slate-900 font-bold'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                  }`}
                  title={`${c.name} - ${c.sector}`}
                >
                  {c.shortName}
                </button>
              ))}
            </div>
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

      {/* 2-COLUMN VIEWPORT LAYOUT: PRINTABLE DOCUMENT + PRINT HISTORY SIDEBAR */}
      <div className="w-full max-w-7xl flex flex-col xl:flex-row items-start justify-center gap-4 relative">
        {/* PRINTABLE DOCUMENT CONTAINER (Single-Page Formatted Sheet) */}
        <div
          id="print-hub-document"
          className="w-full max-w-4xl bg-white text-navy rounded-2xl shadow-2xl border border-gray-300 p-6 sm:p-8 md:p-10 transition-all font-sans relative overflow-hidden flex-1"
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

        {/* 6. DEDICATED TECHNICIAN ON-SITE QR GENERATOR SECTION */}
        <div
          id="print-hub-custom-url-qr-section"
          className="border-2 border-cyan/40 bg-gradient-to-br from-white via-cyan/[0.03] to-slate-50 rounded-xl p-3.5 sm:p-4 mb-4 text-xs shadow-xs relative overflow-hidden"
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 mb-3 border-b border-cyan/20 gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-navy text-cyan border border-cyan/40 flex items-center gap-1">
                  <span>📱</span>
                  <span>QR Code Generator for On-Site Printing</span>
                </span>
                <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300">
                  MODUL TEKNISI LAPANGAN (ON-SITE READY)
                </span>
                <span className="hidden sm:inline text-[9px] font-mono text-gray-500">
                  qrcode.react High-Res Vector SVG
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy mt-1 tracking-tight">
                QR Code Generator for On-Site Printing (Modul Teknisi Lapangan)
              </h3>
              <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                Didesain khusus untuk teknisi lapangan: masukkan Custom URL (titik manhole STP, pintu loading dock pabrik, rute armada, atau formulir BAST) lalu klik <strong>Generate QR Code</strong> untuk me-render kode QR resolusi tinggi via <code>qrcode.react</code> yang siap dicetak langsung di lokasi.
              </p>
            </div>
            <div className="print-hide flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan/10 text-cyan-dark font-semibold">
                Teknisi KGR • Waktu: {customQrGeneratedTimestamp}
              </span>
            </div>
          </div>

          {/* Interactive Input Form (Active on screen, formatted cleanly for on-site printing) */}
          <div className="print-hide space-y-3 mb-3 bg-white/90 p-3 sm:p-3.5 rounded-xl border border-gray-200">
            {/* Input URL and Action Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="custom-url-qr-input"
                  className="block text-[11px] font-bold text-navy uppercase tracking-wider"
                >
                  Custom URL (Titik Lokasi / Dokumen Kerja Teknisi): <span className="text-orange">*</span>
                </label>
                <span className="text-[10px] text-gray-500 font-mono">
                  {customQrUrl ? `${customQrUrl.length} karakter` : 'Belum diisi'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    id="custom-url-qr-input"
                    name="custom-url"
                    data-testid="custom-url-input"
                    type="url"
                    value={customQrUrl}
                    onChange={(e) => {
                      setCustomQrUrl(e.target.value);
                    }}
                    placeholder="Masukkan custom URL, contoh: https://maps.google.com/?q=-6.3015,107.0980"
                    aria-label="Custom URL untuk QR Code"
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono text-navy placeholder:text-gray-400 focus:outline-hidden focus:border-cyan focus:ring-1 focus:ring-cyan shadow-2xs"
                  />
                  {customQrUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomQrUrl('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs p-1 cursor-pointer"
                      title="Hapus teks URL"
                      aria-label="Hapus URL"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    id="custom-url-generate-btn"
                    data-testid="generate-qr-button"
                    type="button"
                    onClick={handleGenerateCustomQr}
                    className="px-4 py-2 bg-navy hover:bg-navy-light text-cyan font-bold rounded-lg transition text-xs flex items-center justify-center gap-1.5 border border-cyan/40 shadow-xs cursor-pointer active:scale-95"
                    title="Generate QR Code using qrcode.react for dynamic on-site rendering"
                    aria-label="Generate QR Code"
                  >
                    <span>⚡</span>
                    <span>Generate QR Code</span>
                  </button>
                  <button
                    id="custom-url-generate-and-print-btn"
                    data-testid="generate-and-print-button"
                    type="button"
                    onClick={handleGenerateAndPrintImmediately}
                    className="px-4 py-2 bg-orange hover:bg-orange-dark text-white font-bold rounded-lg transition text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                    title="Generate QR code and immediately open print dialog for technician on-site use"
                    aria-label="Generate and Print Immediately"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Generate & Print Immediately</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Input Custom Label & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label
                  htmlFor="custom-url-qr-label"
                  className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1"
                >
                  Label / Keterangan Titik Teknisi:
                </label>
                <input
                  id="custom-url-qr-label"
                  type="text"
                  value={customQrLabel}
                  onChange={(e) => setCustomQrLabel(e.target.value)}
                  placeholder="Contoh: Titik Manhole STP Pabrik / Pintu Loading Dock"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-navy focus:outline-hidden focus:border-cyan focus:ring-1 focus:ring-cyan shadow-2xs"
                />
              </div>
              <div>
                <label
                  htmlFor="custom-url-qr-note"
                  className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1"
                >
                  Catatan Lapangan untuk Teknisi / Driver:
                </label>
                <input
                  id="custom-url-qr-note"
                  type="text"
                  value={customQrNote}
                  onChange={(e) => setCustomQrNote(e.target.value)}
                  placeholder="Contoh: Arahkan kamera smartphone untuk navigasi armada langsung ke manhole"
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-navy focus:outline-hidden focus:border-cyan focus:ring-1 focus:ring-cyan shadow-2xs"
                />
              </div>
            </div>

            {/* Quick Preset Buttons for Technicians */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Preset Cepat Lokasi Kerja Teknisi:
                </span>
                <span className="text-[10px] text-gray-400">Klik untuk langsung mengisi URL & label</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleApplyPresetUrl(
                      currentHub.mapsDirectUrl || getGoogleMapsNavUrl(currentHub),
                      `Pos Siaga KGR - ${currentHub.name}`,
                      `Rute armada ke pos standby teknisi ${currentHub.shortName || currentHub.name}`
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-cyan/10 hover:bg-cyan/20 text-navy font-semibold text-[10px] border border-cyan/30 transition cursor-pointer flex items-center gap-1"
                >
                  <span>📍</span>
                  <span>Pos Siaga Truk ({currentHub.shortName})</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyPresetUrl(
                      `https://maps.google.com/?q=${currentHub.lat},${currentHub.lng}&label=Manhole+STP+Pabrik`,
                      'Titik Manhole STP / Septic Tank Pabrik',
                      'Lokasi koordinat lubang septic tank/grease trap untuk teknisi sedot limbah'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[10px] border border-emerald-300 transition cursor-pointer flex items-center gap-1"
                >
                  <span>🚰</span>
                  <span>Titik Manhole STP Pabrik</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyPresetUrl(
                      'https://maps.google.com/?q=-6.3015,107.0980',
                      'Pintu Masuk Truk / Loading Dock MM2100',
                      'Akses portal gerbang truk tangki sedot limbah kawasan MM2100 Cikarang Barat'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold text-[10px] border border-gray-300 transition cursor-pointer flex items-center gap-1"
                >
                  <span>🚚</span>
                  <span>Loading Dock & Gerbang Truk</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyPresetUrl(
                      'https://maps.google.com/?q=-6.3685,107.1820',
                      'Kawasan Industri GIIC Greenland Deltamas',
                      'Akses portal gerbang barat kawasan manufaktur GIIC Cikarang Pusat'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold text-[10px] border border-gray-300 transition cursor-pointer flex items-center gap-1"
                >
                  <span>🏗️</span>
                  <span>GIIC Deltamas</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleApplyPresetUrl(
                      'https://sedotwckusuma.com/portal-bast-digital',
                      'Form BAST & Log Perawatan Peralatan Teknisi',
                      'Verifikasi serah terima pekerjaan dan berita acara teknisi resmi KGR'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-gray-700 font-semibold text-[10px] border border-gray-300 transition cursor-pointer flex items-center gap-1"
                >
                  <span>📋</span>
                  <span>BAST & Log Perawatan</span>
                </button>
              </div>
            </div>

            {/* RECENT PRINTS LIST (Stores the last 5 custom URLs generated in local storage) */}
            <div
              id="print-hub-recent-prints-section"
              className="mt-2.5 pt-2.5 border-t border-gray-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs">🕒</span>
                  <span className="text-[10px] font-bold text-navy uppercase tracking-wider">
                    Recent Prints (Tag Hub Terakhir Disimpan di Local Storage):
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan/15 text-cyan-dark font-semibold">
                    {recentPrints.length} dari 5 Tersimpan
                  </span>
                </div>
                {recentPrints.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearRecentPrints}
                    className="text-[9px] text-gray-400 hover:text-red-500 transition cursor-pointer flex items-center gap-0.5"
                    title="Hapus riwayat Recent Prints dari penyimpanan lokal browser"
                  >
                    <span>🗑️</span>
                    <span>Hapus Riwayat</span>
                  </button>
                )}
              </div>

              {recentPrints.length > 0 ? (
                <div className="space-y-1.5">
                  {recentPrints.map((item, index) => {
                    const isSelected =
                      customQrUrl.trim().toLowerCase() === item.url.trim().toLowerCase();
                    return (
                      <div
                        key={item.id || `recent-${index}`}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-2 rounded-lg border transition text-left gap-1.5 ${
                          isSelected
                            ? 'bg-cyan/10 border-cyan text-navy shadow-xs ring-1 ring-cyan/40'
                            : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[11px] text-navy truncate">
                              {item.label}
                            </span>
                            <span className="text-[8px] font-mono px-1 rounded bg-slate-100 text-gray-500 border border-gray-200">
                              {item.createdAt}
                            </span>
                            {isSelected && (
                              <span className="text-[8px] font-bold text-cyan-dark bg-cyan/20 px-1 rounded">
                                ● Aktif di QR
                              </span>
                            )}
                          </div>
                          <p
                            className="font-mono text-[9px] text-gray-500 truncate mt-0.5"
                            title={item.url}
                          >
                            {item.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleSelectRecentPrint(item, false)}
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-navy text-cyan hover:bg-navy-light transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Pilih URL ini dan render ulang QR Code"
                          >
                            <span>✓</span>
                            <span>Pilih Tag</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSelectRecentPrint(item, true)}
                            className="px-2.5 py-1 rounded-md text-[10px] font-semibold bg-orange text-white hover:bg-orange-dark transition cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Pilih URL ini dan buka dialog pencetakan langsung"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            <span>Cetak</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-dashed border-gray-300 rounded-lg text-center text-gray-400 text-[10px]">
                  <span>Belum ada riwayat custom URL tersimpan. Klik "Generate QR Code" untuk otomatis menyimpan 5 tag terbaru di sini.</span>
                </div>
              )}
            </div>

            {/* Error correction & Color mode customization */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 text-[10px]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-600">Error Correction:</span>
                  {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCustomQrLevel(lvl)}
                      className={`px-1.5 py-0.5 rounded font-mono font-bold transition cursor-pointer ${
                        customQrLevel === lvl
                          ? 'bg-navy text-cyan'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-600">Warna QR:</span>
                  {[
                    { color: '#0a192f', label: 'Navy' },
                    { color: '#000000', label: 'Hitam' },
                    { color: '#0e7490', label: 'Cyan' },
                  ].map((item) => (
                    <button
                      key={item.color}
                      type="button"
                      onClick={() => setCustomQrColor(item.color)}
                      className={`w-4 h-4 rounded-full border transition cursor-pointer ${
                        customQrColor === item.color ? 'ring-2 ring-cyan scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: item.color }}
                      title={`Pilih warna ${item.label}`}
                    />
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleTestOpenCustomUrl}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition cursor-pointer flex items-center gap-1"
                  title="Buka URL kustom di tab baru untuk memverifikasi tautan"
                >
                  <span>↗</span>
                  <span>Test URL</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCustomUrl}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition cursor-pointer flex items-center gap-1"
                  title="Salin URL kustom ke clipboard"
                >
                  <span>📋</span>
                  <span>Salin</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCustomQrPng}
                  className="px-2.5 py-1 rounded-lg bg-cyan/15 hover:bg-cyan/25 text-cyan-dark font-semibold transition cursor-pointer flex items-center gap-1"
                  title="Unduh QR Code kustom sebagai gambar PNG resolusi tinggi"
                >
                  <span>📥</span>
                  <span>Unduh PNG</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetToCurrentHub}
                  className="px-2 py-1 rounded-lg text-gray-500 hover:text-gray-800 transition cursor-pointer"
                  title="Kembalikan URL ke pos default"
                >
                  ↺ Reset Pos
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC ON-SITE PRINTABLE QR DISPLAY CARD */}
          <div className="bg-white border-2 border-cyan/30 rounded-xl p-3 sm:p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* QR Container rendered with qrcode.react */}
              <div
                id="custom-url-qr-code-container"
                className="shrink-0 p-2 bg-white rounded-xl border-2 border-navy/20 shadow-xs flex flex-col items-center justify-center relative group"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center bg-white p-1 rounded-lg">
                  <QRCodeSVG
                    id="custom-url-qr-svg"
                    value={effectiveCustomUrl}
                    size={120}
                    level={customQrLevel}
                    fgColor={customQrColor}
                    bgColor="#ffffff"
                    marginSize={2}
                    title={customQrLabel || 'QR Code Kustom Navigasi Lapangan'}
                    className="w-full h-full object-contain cursor-pointer transition hover:scale-102"
                  />
                </div>
                <div className="mt-1 flex items-center gap-1 text-[8px] font-mono font-bold text-gray-500">
                  <span className="px-1 py-0.2 rounded bg-gray-100 border border-gray-200">
                    Level {customQrLevel}
                  </span>
                  <span className="text-emerald-700 font-semibold">● Live Vector HD</span>
                </div>
              </div>

              {/* Metadata, Label & Prominent Custom URL for Printing */}
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-navy text-white">
                    ON-SITE DISPATCH PASS
                  </span>
                  <span className="text-[9px] font-bold text-cyan-dark bg-cyan/15 px-1.5 py-0.5 rounded border border-cyan/30">
                    HASIL CETAK RESMI
                  </span>
                </div>

                <h4 className="font-extrabold text-navy text-xs sm:text-sm leading-snug">
                  {customQrLabel || 'Navigasi Khusus On-Site & Gerbang Pabrik'}
                </h4>

                <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                  {customQrNote || 'Arahkan kamera smartphone ke QR Code untuk membuka rute perjalanan atau dokumen digital terkait.'}
                </p>

                {/* Prominently Displayed URL for On-Site Reference & Printing */}
                <div
                  id="custom-url-qr-display-url-box"
                  className="mt-2 p-2.5 bg-slate-50 rounded-lg border border-cyan/30 text-[10px] text-left"
                >
                  <div className="flex items-center justify-between text-[9px] font-bold text-gray-500 mb-0.5">
                    <span className="text-navy flex items-center gap-1">
                      <span>🔗</span>
                      <span>Target URL On-Site (Ter-enkripsi dalam QR):</span>
                    </span>
                    <span className="text-emerald-700 font-mono text-[8px] uppercase font-bold">
                      ✓ Valid & Aktif
                    </span>
                  </div>
                  <div
                    id="custom-url-qr-display-url"
                    className="font-mono text-[10px] text-navy font-semibold break-all select-all leading-tight bg-white p-2 rounded border border-gray-200"
                    title="URL yang dikonversi ke QR Code"
                  >
                    {effectiveCustomUrl}
                  </div>
                </div>

                {/* Immediate Print & Utility Actions */}
                <div className="print-hide mt-2.5 flex items-center gap-2 flex-wrap">
                  <button
                    id="print-immediately-btn"
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-1.5 bg-orange hover:bg-orange-dark text-white font-bold rounded-lg transition text-xs flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                    title="Print this document immediately with the generated custom QR code"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span>Print Immediately</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadCustomQrPng}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                    title="Unduh QR Code sebagai file gambar PNG"
                  >
                    <span>📥 Unduh PNG</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCustomUrl}
                    className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-xs transition cursor-pointer flex items-center gap-1"
                    title="Salin URL ke clipboard"
                  >
                    <span>📋 Salin URL</span>
                  </button>
                </div>

                {/* Print Verification Stamp */}
                <div className="mt-2 pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between text-[9px] text-gray-500 gap-1">
                  <div className="flex items-center gap-1.5">
                    <span>🏢 PT Kusuma Gemilang Raya</span>
                    <span>•</span>
                    <span className="font-mono">Pos: {currentHub.shortName || currentHub.name}</span>
                  </div>
                  <div className="font-mono text-gray-400">
                    Waktu Generate: {customQrGeneratedTimestamp}
                  </div>
                </div>

                {/* Print History Audit Link Badge */}
                <div
                  id="print-hub-audit-timestamps-summary"
                  className="mt-2 p-2 bg-slate-50 rounded-lg border border-gray-200 flex items-center justify-between text-[9px] text-gray-500"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px]">📜</span>
                    <span className="font-semibold text-navy truncate">
                      Print History Audit: {printHistory.length} Timestamp Terakhir di localStorage
                    </span>
                    {printHistory[0] && (
                      <span className="font-mono text-[8px] bg-cyan/15 text-cyan-dark px-1.5 py-0.2 rounded border border-cyan/30 truncate hidden sm:inline">
                        Terakhir: #{printHistory[0].auditHash} ({printHistory[0].timestamp})
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPrintHistorySidebarOpen(true);
                      const el = document.getElementById('print-hub-print-history-sidebar');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="print-hide px-2 py-0.5 rounded bg-navy hover:bg-navy-light text-cyan font-bold transition text-[9px] shrink-0 cursor-pointer flex items-center gap-1"
                    title="Buka sidebar Print History audit tracking"
                  >
                    <span>Buka Sidebar</span>
                    <span>↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. RECENT QR GENERATION TABLE (Persists last 10 generated custom URLs in localStorage) */}
        <div
          id="print-hub-recent-qr-generation-table"
          className="border-2 border-cyan/40 bg-gradient-to-br from-white via-cyan/[0.02] to-slate-50 rounded-xl p-3.5 sm:p-4 mb-4 text-xs shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-3 border-b border-gray-200 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-navy text-cyan flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                📊
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-navy text-xs sm:text-sm uppercase tracking-wider">
                    Recent QR Generation
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan/20 text-cyan-dark border border-cyan/30">
                    {recentQrGenerations.length} / 10 Tersimpan (localStorage)
                  </span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Tabel audit persistensi 10 URL kustom terakhir untuk memudahkan teknisi melakukan re-print kode QR di lapangan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 print-hide">
              {recentQrGenerations.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearRecentQrGenerations}
                  className="px-2.5 py-1 text-[10px] font-semibold text-gray-500 hover:text-rose-600 rounded-lg border border-gray-200 hover:border-rose-300 bg-white hover:bg-rose-50 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  title="Bersihkan riwayat Recent QR Generation dari localStorage"
                >
                  <span>🗑️</span>
                  <span>Reset Tabel</span>
                </button>
              )}
            </div>
          </div>

          {recentQrGenerations.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
              <table
                id="recent-qr-generation-table"
                className="w-full text-left border-collapse text-[11px]"
              >
                <thead>
                  <tr className="bg-slate-100 text-navy uppercase text-[9px] tracking-wider border-b border-gray-200 font-bold">
                    <th className="py-2.5 px-3 text-center w-10">No</th>
                    <th className="py-2.5 px-3 w-40">Timestamp</th>
                    <th className="py-2.5 px-3">Custom URL</th>
                    <th className="py-2.5 px-3 w-44">Label / Keterangan</th>
                    <th className="py-2.5 px-3 w-24 text-center">Status</th>
                    <th className="py-2.5 px-3 w-32 text-center print-hide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentQrGenerations.map((entry, idx) => {
                    const isCurrent =
                      customQrUrl.trim().toLowerCase() === entry.url.trim().toLowerCase();
                    return (
                      <tr
                        key={entry.id || `qr-gen-row-${idx}`}
                        className={`transition ${
                          isCurrent ? 'bg-cyan/10 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-3 text-center font-mono text-[10px] text-gray-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 text-gray-700 whitespace-nowrap">
                          <div className="flex items-center gap-1 font-mono text-[10px]">
                            <span className="text-gray-400">🕒</span>
                            <span className="font-semibold">{entry.timestamp}</span>
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div
                            className="font-mono text-[10px] text-navy break-all select-all max-w-xs sm:max-w-sm hover:text-cyan-dark leading-tight"
                            title={entry.url}
                          >
                            {entry.url}
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-bold text-navy text-[11px] leading-tight">
                            {entry.label}
                          </div>
                          {entry.note && (
                            <div className="text-[9px] text-gray-500 truncate max-w-xs">
                              {entry.note}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              isCurrent
                                ? 'bg-cyan/20 text-cyan-dark border border-cyan/40'
                                : 'bg-slate-100 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {isCurrent ? '● Aktif' : 'Tersimpan'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center whitespace-nowrap print-hide">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleRePrintQr(entry, false)}
                              className="px-2.5 py-1 rounded-md bg-navy hover:bg-navy-light text-cyan hover:text-white font-bold text-[10px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                              title="Re-render kode QR ini ke dokumen cetak"
                            >
                              <span>🔄</span>
                              <span>Re-Print</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRePrintQr(entry, true)}
                              className="p-1 rounded-md bg-orange hover:bg-orange-dark text-white text-[10px] transition cursor-pointer shadow-2xs"
                              title="Re-render dan buka dialog cetak langsung"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              <p className="text-[11px]">Belum ada riwayat QR yang digenerate di localStorage.</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Masukkan URL kustom pada form di atas dan klik <strong>⚡ Generate Dynamic</strong> untuk menambahkannya ke tabel ini.
              </p>
            </div>
          )}
        </div>

        {/* 8. PHYSICAL SITE VISIT INSPECTION CHECKLIST (Formulir Pengawasan Lapangan) */}
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

        {/* 9. EQUIPMENT QR SCANNER & MAINTENANCE LOG AUDIT MODULE (react-qr-reader) */}
        <div className="mb-4">
          <EquipmentMaintenanceQrScanner onToast={onToast} />
        </div>

        {/* 10. SIGNATURE & VERIFICATION ROW */}
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

        {/* 11. FOOTER LEGAL & COMPLIANCE BAR */}
        <div className="border-t border-gray-300 pt-2.5 mt-2 flex flex-col sm:flex-row items-center justify-between text-[9px] text-gray-500">
          <div>
            PT KUSUMA GEMILANG RAYA • Hotline 24 Jam: 0896-7506-4916 • Email: legal@sedotwckusuma.com • Navigasi: Scan QR di atas via Google Maps
          </div>
          <div className="font-mono text-gray-400 mt-1 sm:mt-0">
            Dokumen Resmi Kunjungan Lapangan & Rute Logistik Hub • Halaman 1 dari 1 (A4)
          </div>
        </div>
      </div>

      {/* PRINT HISTORY SIDEBAR (Audit Tracking of Last 10 Generated QR Codes) */}
      <aside
        id="print-hub-print-history-sidebar"
        className={`print-hide w-full xl:w-88 shrink-0 bg-slate-900 text-white rounded-2xl border border-cyan/40 shadow-2xl p-4 transition-all duration-300 xl:sticky xl:top-24 ${
          isPrintHistorySidebarOpen ? 'block' : 'hidden'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan/20 border border-cyan text-cyan flex items-center justify-center text-sm font-bold shadow-xs">
              📜
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
                <span>Print History</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan/20 text-cyan border border-cyan/30">
                  {printHistory.length}/10
                </span>
              </h3>
              <p className="text-[10px] text-gray-400">
                Audit Tracking & Timestamps (localStorage)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {printHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearPrintHistory}
                className="px-2 py-1 rounded text-[9px] text-gray-400 hover:text-red-400 hover:bg-white/5 transition cursor-pointer"
                title="Hapus riwayat audit di browser lokal"
              >
                Hapus
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsPrintHistorySidebarOpen(false)}
              className="xl:hidden p-1 rounded text-gray-400 hover:text-white"
              title="Tutup Sidebar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Audit Verification Compliance Tag */}
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-3 text-[10px]">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="font-semibold text-cyan-light flex items-center gap-1">
              <span>🛡️</span>
              <span>Audit Compliance Trail:</span>
            </span>
            <span className="text-emerald-400 font-mono text-[9px] font-bold">● localStorage Synced</span>
          </div>
          <p className="text-gray-400 text-[10px] leading-relaxed">
            Menyimpan presisi detik timestamp dari 10 QR code terakhir yang di-generate untuk pelacakan audit dan verifikasi BAST lapangan.
          </p>
        </div>

        {/* List of the Last 10 Generated QR Code Audit Records */}
        <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
          {printHistory.length > 0 ? (
            printHistory.map((item, idx) => {
              const isSelected =
                effectiveCustomUrl.trim().toLowerCase() === item.url.trim().toLowerCase();
              const actionBadgeColors = {
                PRINT: 'bg-orange/20 text-orange border-orange/40',
                GENERATE: 'bg-cyan/20 text-cyan border-cyan/40',
                CUSTOM_URL: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
                PRESET: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
              };
              const badgeColor = actionBadgeColors[item.actionType] || actionBadgeColors.GENERATE;

              return (
                <div
                  key={item.id || `audit-${idx}`}
                  className={`p-2.5 rounded-xl border transition text-left relative group ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan shadow-sm ring-1 ring-cyan/40'
                      : 'bg-slate-950/60 hover:bg-slate-800/60 border-gray-800'
                  }`}
                >
                  {/* Timestamp Header Row with Exact Seconds & Timezone */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px]">🕒</span>
                      <span className="font-mono text-[10px] font-bold text-cyan truncate" title={item.timestamp}>
                        {item.timestamp}
                      </span>
                    </div>
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border font-mono ${badgeColor}`}
                    >
                      {item.actionType}
                    </span>
                  </div>

                  {/* Destination Label */}
                  <div className="text-[11px] font-bold text-white leading-snug truncate" title={item.label}>
                    {item.label}
                  </div>

                  {/* Technician & Audit Hash Reference */}
                  <div className="mt-1 flex items-center justify-between text-[9px] text-gray-400 font-mono">
                    <span className="truncate text-gray-400">Teknisi: {item.technician}</span>
                    <span className="text-cyan/80 shrink-0">#{item.auditHash}</span>
                  </div>

                  {/* Monospace URL snippet */}
                  <div
                    className="mt-1.5 p-1.5 rounded bg-black/40 border border-gray-800 font-mono text-[9px] text-gray-300 truncate"
                    title={item.url}
                  >
                    {item.url}
                  </div>

                  {/* Quick Action buttons */}
                  <div className="mt-2 flex items-center justify-end gap-1.5 pt-1.5 border-t border-gray-800/80">
                    <button
                      type="button"
                      onClick={() => handleSelectAuditEntry(item, false)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan text-[9px] font-semibold transition cursor-pointer border border-cyan/30"
                      title="Muat tag ini ke input dan generate ulang QR Code"
                    >
                      Pilih Tag
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectAuditEntry(item, true)}
                      className="px-2 py-0.5 rounded bg-orange hover:bg-orange-dark text-white text-[9px] font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                      title="Muat tag ini dan langsung buka dialog pencetakan"
                    >
                      <span>🖨️</span>
                      <span>Cetak</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(item.url);
                        }
                        if (onToast) onToast(`📋 URL [${item.auditHash}] disalin!`);
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-gray-400 hover:text-white text-[9px] transition cursor-pointer"
                      title="Salin URL ke clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 bg-slate-950/80 border border-dashed border-gray-800 rounded-xl text-center text-gray-500 text-xs">
              <span>Belum ada log audit. Generate QR Code untuk menyimpan riwayat 10 timestamp terakhir di sini.</span>
            </div>
          )}
        </div>

        {/* Sidebar Footer Info */}
        <div className="mt-3 pt-2.5 border-t border-gray-800 text-[9px] text-gray-500 flex items-center justify-between">
          <span>Audit Trail: localStorage</span>
          <span className="font-mono text-cyan-dark">Max: 10 Records</span>
        </div>
      </aside>
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
