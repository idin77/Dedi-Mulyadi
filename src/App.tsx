/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { generateBrochurePdf } from './utils/generateBrochurePdf';
import { generateInvoiceBastPdf } from './utils/generateInvoiceBastPdf';
import { downloadAreaMapPng } from './utils/exportAreaMapToPng';
import { ComplianceSeoMetadata } from './components/ComplianceSeoMetadata';
import { MapPrintPreviewModal } from './components/MapPrintPreviewModal';
import { CorporateClientsSection } from './components/CorporateClientsSection';
import { CORPORATE_CLIENTS } from './data/corporateClients';
import { highlightKeyword, getFaqMatchStats } from './utils/faqHighlighter';
import teknisiSedotWcImg from './assets/images/teknisi_lapangan_sedot_wc_1791530702926.jpg';
import teknisiPipaImg from './assets/images/teknisi_pelancaran_pipa_1791530724142.jpg';
import logoBekasiImg from './assets/images/logo_bekasi.jpeg';
import heroKusumaImg from './assets/images/hero_kusuma.jpg';

interface AnimatedFaqDetailsProps {
  question: React.ReactNode;
  badge?: string;
  category?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  answerText?: string;
  onCopy?: (copiedText: string) => void;
  isOpenProp?: boolean;
  onToggleProp?: () => void;
  matchInfoBadge?: React.ReactNode;
}

function AnimatedFaqDetails({
  question,
  badge,
  category,
  icon,
  children,
  answerText,
  onCopy,
  isOpenProp,
  onToggleProp,
  matchInfoBadge,
}: AnimatedFaqDetailsProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [copied, setCopied] = useState(false);

  const isControlled = typeof isOpenProp === 'boolean';
  const isOpen = isControlled ? isOpenProp : internalIsOpen;

  // Synchronize closing animation if controlled isOpenProp changes
  useEffect(() => {
    if (isControlled) {
      if (!isOpenProp && isOpen) {
        setIsClosing(true);
      } else if (isOpenProp) {
        setIsClosing(false);
      }
    }
  }, [isOpenProp, isControlled, isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isControlled && onToggleProp) {
      onToggleProp();
      return;
    }
    if (internalIsOpen) {
      setIsClosing(true);
      setInternalIsOpen(false);
    } else {
      setInternalIsOpen(true);
      setIsClosing(false);
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isOpen) {
      setIsClosing(false);
    }
  };

  const extractTextContent = (node: React.ReactNode): string => {
    if (!node) return '';
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractTextContent).join(' ');
    if (React.isValidElement(node)) {
      const elProps = node.props as { children?: React.ReactNode };
      if (elProps && elProps.children) {
        return extractTextContent(elProps.children);
      }
    }
    return '';
  };

  const handleCopyAnswer = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering details accordion toggle

    const textToCopy = (answerText || extractTextContent(children)).trim();
    if (!textToCopy) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        if (onCopy) onCopy(textToCopy);
        setTimeout(() => setCopied(false), 2200);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        if (onCopy) onCopy(textToCopy);
        setTimeout(() => setCopied(false), 2200);
      } catch (err) {
        console.error('Gagal menyalin jawaban:', err);
      }
    }
  };

  const isDetailsOpen = isOpen || isClosing;

  return (
    <details
      open={isDetailsOpen}
      className={`faq-accordion-animated group bg-white p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
        isOpen
          ? 'border-cyan/40 shadow-md ring-1 ring-cyan/20'
          : matchInfoBadge
          ? 'border-amber-300/80 hover:border-amber-400 shadow-sm ring-1 ring-amber-200/60 bg-gradient-to-r from-amber-50/20 via-white to-white'
          : 'border-gray-100 hover:border-gray-200 shadow-sm'
      }`}
    >
      <summary
        onClick={handleToggle}
        className="flex justify-between items-start sm:items-center font-semibold text-navy cursor-pointer list-none select-none gap-3"
      >
        <div className="flex-1 min-w-0 pr-1 sm:pr-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className={`faq-question text-sm sm:text-base leading-snug transition-colors duration-200 ${isOpen ? 'text-cyan font-bold' : ''}`}>
              {question}
            </span>
            {category && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                category === 'Harga'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : category === 'Layanan'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : category === 'Area'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {category}
              </span>
            )}
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/10 text-cyan-dark border border-cyan/20 flex-shrink-0">
                {badge}
              </span>
            )}
            {matchInfoBadge}
            {/* Copy Answer Button next to question header */}
            <button
              type="button"
              onClick={handleCopyAnswer}
              aria-label="Salin jawaban pertanyaan ini ke clipboard"
              title={copied ? 'Jawaban berhasil disalin ke clipboard!' : 'Salin jawaban pertanyaan ini ke clipboard'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 border cursor-pointer active:scale-95 flex-shrink-0 ${
                copied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs ring-1 ring-emerald-300/40'
                  : 'bg-slate-50 hover:bg-cyan/10 text-slate-600 hover:text-cyan-dark border-slate-200 hover:border-cyan/30'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600 animate-pop-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-bold text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-dark transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Salin Jawaban</span>
                </>
              )}
            </button>
          </div>
        </div>
        <span className={`faq-icon-wrapper w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl transition-all duration-300 flex-shrink-0 mt-0.5 sm:mt-0 ${
          isOpen ? 'bg-cyan text-white shadow-sm' : 'bg-slate-100 text-navy hover:bg-slate-200'
        }`}>
          {icon}
        </span>
      </summary>
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`accordion-grid ${isOpen ? 'accordion-expanded' : ''}`}
      >
        <div className="accordion-overflow">
          <div className="pt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100/80 mt-4">
            {children}
          </div>
        </div>
      </div>
    </details>
  );
}

export interface TestimonialItem {
  id: string;
  initial: string;
  bgColor: string;
  textColor: string;
  text: string;
  author: string;
  role: string;
  category: 'Residensial' | 'Industri & B2B' | 'Komersial' | 'Pelancaran Pipa';
  date: string;
  rating: number; // Nilai kuantitatif 1.0 - 5.0
  totalVotes: number;
  userGivenRating?: number | null;
  satisfactionMetrics: {
    aspect: string;
    score: number;
  }[];
}

const initialTestimonialsData: TestimonialItem[] = [
  {
    id: 'testi-1',
    initial: 'B',
    bgColor: 'bg-orange/10',
    textColor: 'text-orange',
    text: '"Pelayanannya sangat cepat dan profesional. Truk sedotnya datang tepat waktu, teknisinya pakai APD lengkap, dan setelah selesai area kerjanya dibersihkan sampai higienis. Sangat puas!"',
    author: 'Bapak Budi Santoso',
    role: 'Perumahan Cluster, Bekasi Selatan',
    category: 'Residensial',
    date: '3 hari yang lalu',
    rating: 5.0,
    totalVotes: 48,
    satisfactionMetrics: [
      { aspect: 'Ketepatan Waktu Tangki', score: 5.0 },
      { aspect: 'Kebersihan Kerja & APD', score: 5.0 },
      { aspect: 'Transparansi Biaya', score: 5.0 },
    ],
  },
  {
    id: 'testi-2',
    initial: 'S',
    bgColor: 'bg-cyan/10',
    textColor: 'text-cyan',
    text: '"Sebagai manajer fasilitas pabrik di Cikarang, saya butuh vendor limbah yang legal dan transparan. PT Kusuma Gemilang Raya selalu memberikan manifest IPLT yang lengkap. Recommended banget untuk industri!"',
    author: 'Ibu Siti Rahayu',
    role: 'Manajer Fasilitas Pabrik, Cikarang',
    category: 'Industri & B2B',
    date: '1 minggu yang lalu',
    rating: 5.0,
    totalVotes: 62,
    satisfactionMetrics: [
      { aspect: 'Manifes Resmi IPLT', score: 5.0 },
      { aspect: 'Standar Keselamatan K3', score: 5.0 },
      { aspect: 'Kepatuhan Kontrak B2B', score: 5.0 },
    ],
  },
  {
    id: 'testi-3',
    initial: 'P',
    bgColor: 'bg-yellow-500/10',
    textColor: 'text-yellow-600',
    text: '"WC kantor mampet parah, dipanggilkan teknisinya langsung datang cepat. Harga transparan di awal, tidak ada biaya tersembunyi. Pelayanannya sangat ramah dan bersih."',
    author: 'Pak Hendrawan',
    role: 'Kantor Ruko, Bekasi Timur',
    category: 'Komersial',
    date: '2 minggu yang lalu',
    rating: 4.9,
    totalVotes: 39,
    satisfactionMetrics: [
      { aspect: 'Respon Cepat Panggilan', score: 5.0 },
      { aspect: 'Ketuntasan Saluran Pipa', score: 4.8 },
      { aspect: 'Kejujuran Tarif', score: 5.0 },
    ],
  },
  {
    id: 'testi-4',
    initial: 'A',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600',
    text: '"Audit kepatuhan lingkungan tahunan pabrik kami di MM2100 lolos sempurna berkat legalitas NIB KBLI 37011 dan bukti buang IPLT Pemda resmi. Pelaporan BAST sangat rapi dan tertib."',
    author: 'Ir. Agus Pratama, MT',
    role: 'HSE & Compliance Lead, MM2100 Cikarang',
    category: 'Industri & B2B',
    date: '3 minggu yang lalu',
    rating: 5.0,
    totalVotes: 55,
    satisfactionMetrics: [
      { aspect: 'Audit Legalitas NIB', score: 5.0 },
      { aspect: 'Dokumen BAST & IPLT', score: 5.0 },
      { aspect: 'Kesiapan Armada Vakum', score: 5.0 },
    ],
  },
  {
    id: 'testi-5',
    initial: 'M',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-600',
    text: '"Pembersihan rutin grease trap dan bak kontrol restoran kami dilakukan terjadwal malam hari tanpa bau menyengat sama sekali. Teknisi sangat teliti dan tempat cuci piring langsung lancar jaya."',
    author: 'Ibu Maya Anggraini',
    role: 'Owner Resto & Cafe, Summarecon Bekasi',
    category: 'Komersial',
    date: '1 bulan yang lalu',
    rating: 5.0,
    totalVotes: 44,
    satisfactionMetrics: [
      { aspect: 'Pengerjaan Tanpa Bau', score: 5.0 },
      { aspect: 'Fleksibilitas Jadwal', score: 5.0 },
      { aspect: 'Higienitas Standar F&B', score: 5.0 },
    ],
  },
];

export interface DocumentationItem {
  id: number;
  image: string;
  title: string;
  category: 'Industri & B2B' | 'Residensial' | 'Komersial & Resto' | 'Pelancaran Pipa';
  location: string;
  date: string;
  tag: string;
  description: string;
  lastUpdated?: string;
}

const initialDocumentationItems: DocumentationItem[] = [
  {
    id: 1,
    image: 'https://z-cdn-media.chatglm.cn/files/a663f5a2-9679-4548-bc6d-ee86fc0faf38.jpg?auth_key=1891530048-f58de94b45dd4195b1e4eb5c4db34d04-0-bf9997ee3b449021bddfe6a237af2b95',
    title: 'Truk Tangki Masuk Area Industri GIIC',
    category: 'Industri & B2B',
    location: 'Kawasan Industri GIIC Cikarang Pusat',
    date: '10 Okt 2026',
    tag: 'Pabrik Manufaktur',
    description: 'Armada truk tangki resmi berkapasitas besar memasuki pabrik manufaktur otomotif untuk pengurasan rutin bak pengolahan limbah STP sesuai SOP K3.',
  },
  {
    id: 2,
    image: 'https://z-cdn-media.chatglm.cn/files/f0a0ebfc-d359-467e-818a-1eeb6670dbb3.jpg?auth_key=1891530048-1ea4bfb5615c415cb07dde8aa8708456-0-33efc077a48f2f99bf7f5ce0e12e9bf9',
    title: 'Penyedotan Limbah Industri Berizin IPLT',
    category: 'Industri & B2B',
    location: 'Kawasan Industri MM2100 Cikarang Barat',
    date: '08 Okt 2026',
    tag: 'Manifest & BAST',
    description: 'Pengoperasian selang spiral kedap udara berdaya hisap tinggi tanpa kebocoran, dengan pengangkutan limbah langsung ke IPLT resmi Pemda Bekasi.',
  },
  {
    id: 3,
    image: 'https://z-cdn-media.chatglm.cn/files/4f3e0e12-39b6-49b9-898d-956ffdd2b291.jpg?auth_key=1891530048-b2c975c52af9462bb934e295016c1b9f-0-8acc724df47b2f017edd7607128792d7',
    title: 'Teknisi APD Lengkap & Sterilisasi Area',
    category: 'Residensial',
    location: 'Cluster Perumahan Jatiasih, Bekasi',
    date: '07 Okt 2026',
    tag: 'Higienis & Steril',
    description: 'Penyemprotan disinfektan anti bakteri dan pembersihan menyeluruh area tutup septic tank pasca proses penyedotan agar steril kembali.',
  },
  {
    id: 4,
    image: 'https://z-cdn-media.chatglm.cn/files/33054cf6-266f-447d-9081-464b93cc7cc7.jpg?auth_key=1891530048-aebcdd0fe66b48f880f5bc962fef5f6d-0-e05a985cd94e16de3b4a0110c366e099',
    title: 'Penyedotan Septic Tank Akses Gang Perumahan',
    category: 'Residensial',
    location: 'Perumahan Grand Galaxy, Bekasi Selatan',
    date: '06 Okt 2026',
    tag: 'Selang Panjang 100m',
    description: 'Armada menyiagakan selang spiral fleksibel hingga puluhan meter menjangkau gang perumahan tanpa merusak tanaman pekarangan klien.',
  },
  {
    id: 5,
    image: 'https://z-cdn-media.chatglm.cn/files/4da00e2f-49dd-4f4c-b983-2d496721c934.jpg?auth_key=1891530048-bc9acd819e9a48949530ccd303af95d0-0-73f082a39d6164cf5019ea6210e389ad',
    title: 'Kuras Grease Trap Dapur Restoran & Kuliner',
    category: 'Komersial & Resto',
    location: 'Sentra Kuliner Summarecon Bekasi',
    date: '04 Okt 2026',
    tag: 'Restoran & F&B',
    description: 'Pembersihan kerak minyak dan lemak jenuh pada bak grease trap dapur komersial untuk mencegah luapan dan bau busuk di area pengunjung.',
  },
  {
    id: 6,
    image: 'https://z-cdn-media.chatglm.cn/files/4bdc93a6-c220-4dbe-948f-36bbaa87b841.jpg?auth_key=1891530048-2bec263d4a5c497387667e9798780d5d-0-ef3c26848e67413f81c9c3311b1d5018',
    title: 'Pemompaan Limbah Minyak & Lemak Padat',
    category: 'Komersial & Resto',
    location: 'Ruko Niaga Harapan Indah, Bekasi',
    date: '03 Okt 2026',
    tag: 'Zero Odor Tech',
    description: 'Pengerjaan malam hari saat toko tutup menggunakan pompa vakum bertekanan kedap udara sehingga lingkungan sekitar tetap bersih dan higienis.',
  },
  {
    id: 7,
    image: teknisiPipaImg,
    title: 'Pelancaran Pipa Mampet Hydro Jetting',
    category: 'Pelancaran Pipa',
    location: 'Gedung Komersial Cikarang Barat',
    date: '02 Okt 2026',
    tag: 'Tanpa Bongkar Keramik',
    description: 'Mesin hydro jetting dan kabel spiral baja melancarkan sumbatan pipa air kotor dan wastafel mampet tanpa perlu merusak keramik lantai.',
  },
  {
    id: 8,
    image: 'https://z-cdn-media.chatglm.cn/files/f376cf34-d467-42fc-a752-92f97c36ed1b.jpg?auth_key=1891530048-5d5ab972979f442aa2ac45be1b8be3e6-0-b727bf4bfb372d573d4996732a6c874e',
    title: 'Pengurasan Septic Tank Gedung Bertingkat',
    category: 'Komersial & Resto',
    location: 'Kawasan Bisnis Medan Satria, Bekasi',
    date: '29 Sep 2026',
    tag: 'Kapasitas Besar',
    description: 'Penanganan volume limbah septic tank gedung perkantoran bertingkat secara simultan dengan armada tangki ganda.',
  },
  {
    id: 9,
    image: teknisiSedotWcImg,
    title: 'Armada Truk Tangki Siaga di Pool Bekasi',
    category: 'Industri & B2B',
    location: 'Pool Armada Tambun & Cikarang',
    date: '28 Sep 2026',
    tag: 'Siaga 24 Jam',
    description: 'Kesiapan unit armada tangki vakum resmi dan teknisi bersertifikat siaga 24 jam untuk panggilan darurat di seluruh Bekasi.',
  },
  {
    id: 10,
    image: heroKusumaImg,
    title: 'Pengangkutan Limbah Legal Sesuai SOP LH',
    category: 'Industri & B2B',
    location: 'EJIP Industrial Park, Cikarang Selatan',
    date: '26 Sep 2026',
    tag: 'BAST & IPLT Sah',
    description: 'Penyerahan Berita Acara Serah Terima (BAST) dan bukti timbang resmi IPLT Pemda Bekasi untuk lampiran audit ISO & HSE perusahaan.',
  },
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeMapHubIndex, setActiveMapHubIndex] = useState(0);
  const [hoveredMapHubIndex, setHoveredMapHubIndex] = useState<number | null>(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapCenteringNotice, setMapCenteringNotice] = useState<string | null>(null);
  const [isCardHighlighted, setIsCardHighlighted] = useState(false);
  const [isPinInteractiveMode, setIsPinInteractiveMode] = useState(true);
  const [copiedMapCoords, setCopiedMapCoords] = useState(false);
  const [copiedHubPhone, setCopiedHubPhone] = useState<string | null>(null);
  const [copiedHubAddress, setCopiedHubAddress] = useState<string | null>(null);
  const [isExportingMapPng, setIsExportingMapPng] = useState(false);
  const [isMapPrintPreviewOpen, setIsMapPrintPreviewOpen] = useState(false);
  const hubCardRef = useRef<HTMLDivElement>(null);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('Semua');
  const [activeArticleModal, setActiveArticleModal] = useState<number | null>(null);
  const [selectedCertCategory, setSelectedCertCategory] = useState<'Semua' | 'Regulator' | 'K3 & Mutu' | 'Asosiasi & Kawasan'>('Semua');

  // Dokumentasi Pekerjaan Responsive Carousel & Quick Edit States
  const [documentationItems, setDocumentationItems] = useState<DocumentationItem[]>(initialDocumentationItems);
  const [docCarouselIndex, setDocCarouselIndex] = useState(0);
  const [docCategoryFilter, setDocCategoryFilter] = useState<'Semua' | 'Industri & B2B' | 'Residensial' | 'Komersial & Resto' | 'Pelancaran Pipa'>('Semua');
  const [docSortBy, setDocSortBy] = useState<'Newest' | 'Oldest' | 'Alphabetical'>('Newest');
  const [isDocAutoPlay, setIsDocAutoPlay] = useState(true);
  const [activeDocPreview, setActiveDocPreview] = useState<DocumentationItem | null>(null);
  const [docTouchStartX, setDocTouchStartX] = useState<number | null>(null);
  const [docTouchEndX, setDocTouchEndX] = useState<number | null>(null);
  const [docItemsPerView, setDocItemsPerView] = useState(3);

  // Quick Edit States for Dokumentasi Pekerjaan (Authorized Users)
  const [isDocAuthorized, setIsDocAuthorized] = useState(false);
  const [isDocAuthModalOpen, setIsDocAuthModalOpen] = useState(false);
  const [docAuthPin, setDocAuthPin] = useState('');
  const [docAuthError, setDocAuthError] = useState('');
  const [isEditingDocPreview, setIsEditingDocPreview] = useState(false);
  const [editDocDate, setEditDocDate] = useState('');
  const [editDocDescription, setEditDocDescription] = useState('');
  const [isDocSaving, setIsDocSaving] = useState(false);

  // Invoice & BAST PDF Download States for Dokumentasi Pekerjaan
  const [isDownloadingDocInvoicePdf, setIsDownloadingDocInvoicePdf] = useState(false);
  const [docInvoicePoNumber, setDocInvoicePoNumber] = useState('');
  const [docInvoiceClientName, setDocInvoiceClientName] = useState('');
  const [showDocInvoiceOptions, setShowDocInvoiceOptions] = useState(false);

  // Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterInterest, setNewsletterInterest] = useState<'residensial' | 'komersial'>('residensial');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

  // Slide-in Newsletter Subscription Popup States (Inactivity 10s)
  const [isNewsletterSlideInOpen, setIsNewsletterSlideInOpen] = useState(false);
  const [isNewsletterPopupDismissed, setIsNewsletterPopupDismissed] = useState(false);
  const [slideInEmail, setSlideInEmail] = useState('');
  const [slideInName, setSlideInName] = useState('');
  const [slideInInterest, setSlideInInterest] = useState<'residensial' | 'komersial'>('residensial');
  const [slideInStatus, setSlideInStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [slideInMsg, setSlideInMsg] = useState('');

  // Newsletter Statistics & Admin Monitor State
  interface SubscriberRecord {
    id: string;
    email: string;
    name: string;
    company: string;
    interest: 'residensial' | 'komersial';
    date: string;
    formattedDate: string;
    status: 'Aktif' | 'Terkonfirmasi';
    source: string;
  }

  const initialSeedSubscribers: SubscriberRecord[] = [
    {
      id: 'sub-01',
      email: 'bambang.ga@astra-visteon.co.id',
      name: 'Bambang Prasetyo',
      company: 'PT Astra Visteon Indonesia (Cikarang)',
      interest: 'komersial',
      date: '2026-10-09T08:15:00Z',
      formattedDate: 'Hari ini, 08:15',
      status: 'Aktif',
      source: 'Formulir Web B2B',
    },
    {
      id: 'sub-02',
      email: 'hse.plant2@mayora-food.com',
      name: 'Hendra Wijaya',
      company: 'PT Mayora Indah Tbk (Kawasan MM2100)',
      interest: 'komersial',
      date: '2026-10-09T07:30:00Z',
      formattedDate: 'Hari ini, 07:30',
      status: 'Aktif',
      source: 'Formulir Web B2B',
    },
    {
      id: 'sub-03',
      email: 'ratna.kartika@summarecon-resident.net',
      name: 'Ibu Ratna Kartika',
      company: 'Cluster Magenta, Summarecon Bekasi',
      interest: 'residensial',
      date: '2026-10-08T19:40:00Z',
      formattedDate: 'Kemarin, 19:40',
      status: 'Aktif',
      source: 'Tips Sanitasi Blog',
    },
    {
      id: 'sub-04',
      email: 'purchasing@mattel-cikarang.co.id',
      name: 'Dian Fitriani, S.T.',
      company: 'PT Mattel Indonesia (Jababeka I)',
      interest: 'komersial',
      date: '2026-10-08T14:12:00Z',
      formattedDate: 'Kemarin, 14:12',
      status: 'Aktif',
      source: 'Portal Quotation RFP',
    },
    {
      id: 'sub-05',
      email: 'maintenance@rs-hermina-gw.co.id',
      name: 'dr. Agus Setiawan / GA',
      company: 'RS Hermina Grand Wisata Tambun',
      interest: 'komersial',
      date: '2026-10-07T11:20:00Z',
      formattedDate: '2 hari lalu',
      status: 'Aktif',
      source: 'Formulir Web B2B',
    },
    {
      id: 'sub-06',
      email: 'faisal.ridwan@gmail.com',
      name: 'Bpk. Faisal Ridwan',
      company: 'Grand Galaxy City Blok EB',
      interest: 'residensial',
      date: '2026-10-07T09:15:00Z',
      formattedDate: '2 hari lalu',
      status: 'Aktif',
      source: 'Kalkulator Biaya',
    },
    {
      id: 'sub-07',
      email: 'facility@denso-indonesia.co.id',
      name: 'Eko Suprayitno',
      company: 'PT Denso Indonesia (EJIP Cikarang)',
      interest: 'komersial',
      date: '2026-10-06T16:45:00Z',
      formattedDate: '3 hari lalu',
      status: 'Aktif',
      source: 'Formulir Web B2B',
    },
    {
      id: 'sub-08',
      email: 'estate.mgmt@mm2100-park.com',
      name: 'Suryadi Wardhana',
      company: 'MM2100 Industrial Estate Management',
      interest: 'komersial',
      date: '2026-10-05T10:05:00Z',
      formattedDate: '4 hari lalu',
      status: 'Aktif',
      source: 'Formulir Web B2B',
    },
    {
      id: 'sub-09',
      email: 'nurul.hidayati@yahoo.com',
      name: 'Ibu Nurul Hidayati',
      company: 'Kota Harapan Indah Cluster Samata',
      interest: 'residensial',
      date: '2026-10-04T13:20:00Z',
      formattedDate: '5 hari lalu',
      status: 'Aktif',
      source: 'Tips Sanitasi Blog',
    },
    {
      id: 'sub-10',
      email: 'operational@marunda-logistics.id',
      name: 'Denny Kusuma',
      company: 'Marunda Center Logistics Hub',
      interest: 'komersial',
      date: '2026-10-03T15:30:00Z',
      formattedDate: '6 hari lalu',
      status: 'Aktif',
      source: 'Formulir Web B2B',
    },
  ];

  const [subscribersList, setSubscribersList] = useState<SubscriberRecord[]>(() => {
    try {
      const stored = localStorage.getItem('kusuma_subscribers_extended');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialSeedSubscribers;
  });

  // Brochure & Legalitas NIB PDF States
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [isDownloadingBrochurePdf, setIsDownloadingBrochurePdf] = useState(false);
  const [brochureClientName, setBrochureClientName] = useState('');
  const [copiedDocField, setCopiedDocField] = useState<string | null>(null);

  // B2B & Corporate FAQ Filter States
  const [b2bFaqCategory, setB2bFaqCategory] = useState<'Semua' | 'Audit Vendor' | 'BAST' | 'e-Faktur & PPN' | 'K3 & IPLT'>('Semua');
  const [b2bFaqSearch, setB2bFaqSearch] = useState('');
  const [openB2bFaqId, setOpenB2bFaqId] = useState<number | null>(1);
  const [isB2bFaqShaking, setIsB2bFaqShaking] = useState(false);
  const [b2bFaqShakeKey, setB2bFaqShakeKey] = useState(0);
  const [isB2bFaqHighlightActive, setIsB2bFaqHighlightActive] = useState(true);

  // General & Residential FAQ Filter States
  const [generalFaqCategory, setGeneralFaqCategory] = useState<'Semua' | 'Harga' | 'Layanan' | 'Area' | 'Teknis'>('Semua');
  const [generalFaqSearch, setGeneralFaqSearch] = useState('');
  const [isGeneralFaqShaking, setIsGeneralFaqShaking] = useState(false);
  const [generalFaqShakeKey, setGeneralFaqShakeKey] = useState(0);
  const [isGeneralFaqHighlightActive, setIsGeneralFaqHighlightActive] = useState(true);
  const [openedGeneralFaqIds, setOpenedGeneralFaqIds] = useState<number[]>([]);
  const [isAllGeneralFaqExpanded, setIsAllGeneralFaqExpanded] = useState(false);

  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberCategoryFilter, setSubscriberCategoryFilter] = useState<'Semua' | 'komersial' | 'residensial'>('Semua');
  const [subscriberSourceFilter, setSubscriberSourceFilter] = useState<string>('Semua');
  const [subscriberTimeRange, setSubscriberTimeRange] = useState<'Semua Waktu' | '30 Hari' | 'Bulan Ini' | 'Kuartal Ini'>('Semua Waktu');
  const [isMaskEmail, setIsMaskEmail] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminNotificationToast, setAdminNotificationToast] = useState<string | null>(null);

  // Legalitas & SEO Metadata Section States
  const [legalTableFilter, setLegalTableFilter] = useState<'Semua' | 'Izin Berusaha' | 'Perpajakan' | 'Lingkungan & K3' | 'SEO & Identitas'>('Semua');
  const [legalTableSearchQuery, setLegalTableSearchQuery] = useState('');
  const [legalTableViewMode, setLegalTableViewMode] = useState<'table' | 'cards'>('table');

  const BASE_PREVIOUS_SUBSCRIBERS = 1422;
  const totalSubscribersCount = BASE_PREVIOUS_SUBSCRIBERS + subscribersList.length;
  const commercialSubscribersCount = Math.round(totalSubscribersCount * 0.64);
  const residentialSubscribersCount = totalSubscribersCount - commercialSubscribersCount;

  const triggerToast = (msg: string) => {
    setAdminNotificationToast(msg);
    setTimeout(() => {
      setAdminNotificationToast(null);
    }, 3500);
  };

  const handleCopyDocField = (fieldName: string, value: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(() => {
        setCopiedDocField(fieldName);
        triggerToast(`📋 ${fieldName} (${value}) disalin ke clipboard!`);
        setTimeout(() => setCopiedDocField(null), 2500);
      }).catch(() => {
        triggerToast(`📋 ${fieldName}: ${value}`);
      });
    } else {
      triggerToast(`📋 ${fieldName}: ${value}`);
    }
  };

  const handleCopyLegalField = (id: string, label: string, value: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(() => {
        setCopiedDocField(id);
        triggerToast(`📋 ${label} (${value}) berhasil disalin ke clipboard!`);
        setTimeout(() => setCopiedDocField(null), 2500);
      }).catch(() => {
        triggerToast(`📋 ${label}: ${value}`);
      });
    } else {
      triggerToast(`📋 ${label}: ${value}`);
    }
  };

  const handleCopyAllLegalInfo = () => {
    const fullText = `BERKAS LEGALITAS RESMI & SEO METADATA PT KUSUMA GEMILANG RAYA:
1. Badan Usaha: PT Kusuma Gemilang Raya (Perseroan Terbatas)
2. Nomor Induk Berusaha (NIB): 0220108920194 (Sistem OSS Berbasis Risiko)
3. NPWP Badan Usaha: 94.812.394.8-407.000 (Direktorat Jenderal Pajak RI)
4. Klasifikasi KBLI: 37011 (Pengelolaan dan Pembuangan Air Limbah Tidak Berbahaya)
5. SPPKP / Faktur Pajak: S-184PKP/WPJ.22/KP.0303/2021 (e-Faktur PPN 11%)
6. SK Pengesahan Kemenkumham: AHU-0018924.AH.01.01.TAHUN 2021
7. Pembuangan Akhir Limbah: REG-IPLT/DLH-BKS/2026/0411 (IPLT Resmi DLH Pemda Bekasi)
8. Rekening Giro Bank PT: Mandiri 156-00-1892401-2 a.n PT Kusuma Gemilang Raya
9. Structured Data SEO: https://jasasedotwcbekasi.web.id/ (Schema.org LocalBusiness 24/7)
10. Kontak WhatsApp Resmi: +62 896-7506-4916 (Layanan 24 Jam Bekasi)`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        setCopiedDocField('ALL_LEGAL_DOSSIER');
        triggerToast('📋 Seluruh ringkasan legalitas NIB, NPWP & KBLI berhasil disalin ke clipboard!');
        setTimeout(() => setCopiedDocField(null), 3000);
      }).catch(() => {
        triggerToast('📋 Ringkasan legalitas siap disalin.');
      });
    } else {
      triggerToast('📋 Ringkasan legalitas siap disalin.');
    }
  };

  const handleDownloadBrochurePdf = async (customClientName?: string) => {
    setIsDownloadingBrochurePdf(true);
    try {
      const targetClient = (customClientName !== undefined ? customClientName : brochureClientName).trim();
      const doc = generateBrochurePdf({ clientCompanyName: targetClient || undefined });
      const sanitizedName = targetClient ? `_${targetClient.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25)}` : '';
      const filename = `Brosur_Company_Profile_PT_Kusuma_Gemilang_Raya_NIB_37011${sanitizedName}.pdf`;
      doc.save(filename);
      triggerToast('📄 Brosur PDF & Legalitas NIB berhasil diunduh!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      triggerToast('Gagal memproses file PDF. Silakan coba lagi.');
    } finally {
      setIsDownloadingBrochurePdf(false);
    }
  };

  // B2B RFP Quotation Form State (Target Market PT / Perusahaan)
  const [rfpCompanyName, setRfpCompanyName] = useState('');
  const [rfpPicName, setRfpPicName] = useState('');
  const [rfpPicRole, setRfpPicRole] = useState('Procurement / Purchasing');
  const [rfpPhone, setRfpPhone] = useState('');
  const [rfpEmail, setRfpEmail] = useState('');
  const [rfpLocation, setRfpLocation] = useState('Kawasan Industri MM2100');
  const [rfpServiceType, setRfpServiceType] = useState('Sedot Limbah STP / IPAL Pabrik');
  const [rfpVolume, setRfpVolume] = useState('10 - 20 m³');
  const [rfpNeedTaxInvoice, setRfpNeedTaxInvoice] = useState(true);
  const [rfpStatus, setRfpStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Quick Quote Navigation Launcher & Highlight State
  const rfpCompanyInputRef = useRef<HTMLInputElement>(null);
  const [isRfpHighlighted, setIsRfpHighlighted] = useState(false);

  const handleLaunchQuickQuote = () => {
    const quotationSection = document.getElementById('quotation');
    if (quotationSection) {
      quotationSection.scrollIntoView({ behavior: 'smooth' });
      setIsRfpHighlighted(true);
      setTimeout(() => {
        rfpCompanyInputRef.current?.focus();
      }, 550);
      setTimeout(() => {
        setIsRfpHighlighted(false);
      }, 3500);
      triggerToast('⚡ Membuka Portal Permintaan Penawaran Resmi PT (Quick Quote RFP B2B)...');
    }
  };

  const handleSelectClientForQuote = (clientName: string, serviceScope?: string) => {
    setRfpCompanyName(clientName);
    if (serviceScope) {
      if (serviceScope.toLowerCase().includes('stp') || serviceScope.toLowerCase().includes('sludge')) {
        setRfpServiceType('Sedot Limbah STP / IPAL Pabrik');
      } else if (serviceScope.toLowerCase().includes('grease') || serviceScope.toLowerCase().includes('lemak')) {
        setRfpServiceType('Pengurasan Lemak Grease Trap Restoran / Kantin Pabrik');
      } else if (serviceScope.toLowerCase().includes('drainase') || serviceScope.toLowerCase().includes('jetting')) {
        setRfpServiceType('Pelancaran Pipa Hydro-Jetting High Pressure');
      } else {
        setRfpServiceType('Penyedotan Septic Tank Komersial / Gedung');
      }
    }
    const quotationSection = document.getElementById('quotation');
    if (quotationSection) {
      quotationSection.scrollIntoView({ behavior: 'smooth' });
      setIsRfpHighlighted(true);
      setTimeout(() => {
        rfpCompanyInputRef.current?.focus();
      }, 550);
      setTimeout(() => {
        setIsRfpHighlighted(false);
      }, 3500);
      triggerToast(`🏢 Contoh profil rekanan ${clientName} dimuat ke formulir RFP B2B!`);
    }
  };

  // Chatbot FAQ State
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  const initialChatMessages: {
    id: string;
    sender: 'bot' | 'user';
    text: string;
    time: string;
    options?: string[];
    actionUrl?: string;
    actionLabel?: string;
  }[] = [
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Selamat datang di Portal Layanan B2B & Korporat PT Kusuma Gemilang Raya 👋\n\nKami melayani pengolahan limbah STP/IPAL, sedot WC komersial, grease trap, dan kontrak berkala untuk PT, Pabrik, Kawasan Industri, Gedung Perkantoran, dan Rumah Sakit di Bekasi.\n\nPilih topik di bawah atau ketik kebutuhan perusahaan Anda:',
      time: 'Baru saja',
      options: [
        'Prosedur penawaran resmi (Quotation) untuk PT?',
        'Apakah tersedia Faktur Pajak PPN & Manifest IPLT?',
        'Layanan sedot limbah STP & IPAL Pabrik?',
        'Kontrak rutin (SLA) kawasan industri Bekasi?',
        'Berapa estimasi tarif sedot limbah / WC?',
        'Minta penawaran harga resmi (RFP B2B)',
      ],
    },
  ];

  const [chatMessages, setChatMessages] = useState(initialChatMessages);

  // Map Hubs Data
  const mapHubs = [
    {
      id: 'pusat',
      name: 'Pool Pusat & Kota Bekasi',
      shortName: 'Pool Pusat (Kota Bekasi)',
      badge: 'Pool Induk Armada',
      phone: '+62 896-7506-4916',
      contactNumber: '0896-7506-4916',
      phoneRaw: '+6289675064916',
      hotlineLabel: 'Hotline Dispatcher 24 Jam',
      address: 'Jl. Jendral Ahmad Yani & Grand Galaxy, Kota Bekasi',
      coverage: 'Bekasi Barat, Bekasi Timur, Bekasi Selatan, Bekasi Utara, Jatiasih, Medan Satria, Rawalumbu, Pondok Gede, Bantar Gebang, Jatisampurna, Mustika Jaya.',
      response: '15 - 20 Menit',
      armadaCount: '12 Unit Truk Tangki',
      mapQuery: 'Kota+Bekasi,+Jawa+Barat',
      mapsDirectUrl: 'https://www.google.com/maps/search/?api=1&query=Bekasi+Jawa+Barat',
      lat: '-6.2349',
      lng: '106.9966',
      pinPos: { left: '22%', top: '38%' },
      pinIcon: '🏢',
      pinColor: 'cyan',
      highlightArea: 'Kota Bekasi & Sekitarnya',
    },
    {
      id: 'cikarang',
      name: 'Pos Cikarang & Kawasan Industri',
      shortName: 'Pos Cikarang (Industri)',
      badge: 'Pos Industri & Residensial',
      phone: '+62 896-7506-4916',
      contactNumber: '0896-7506-4916',
      phoneRaw: '+6289675064916',
      hotlineLabel: 'Dispatch Kawasan Industri Cikarang',
      address: 'Kawasan Industri Cikarang (Jababeka, MM2100, EJIP, GIIC, Deltamas)',
      coverage: 'Cikarang Barat, Timur, Utara, Selatan, Pusat, Cibarusah, Bojongmangu, Serang Baru, Setu, Karangbahagia, Kedungwaringin.',
      response: '15 - 25 Menit',
      armadaCount: '8 Unit Truk Tangki',
      mapQuery: 'Cikarang,+Bekasi,+Jawa+Barat',
      mapsDirectUrl: 'https://www.google.com/maps/search/?api=1&query=Cikarang+Bekasi+Jawa+Barat',
      lat: '-6.3023',
      lng: '107.1517',
      pinPos: { left: '78%', top: '64%' },
      pinIcon: '🏭',
      pinColor: 'orange',
      highlightArea: 'Kawasan Industri Cikarang & Kab. Bekasi',
    },
    {
      id: 'tambun',
      name: 'Pos Tambun, Cibitung & Pantura',
      shortName: 'Pos Tambun (Pantura)',
      badge: 'Pos Jalur Pantura',
      phone: '+62 896-7506-4916',
      contactNumber: '0896-7506-4916',
      phoneRaw: '+6289675064916',
      hotlineLabel: 'Dispatch Koridor Pantura & Cibitung',
      address: 'Jl. Raya Diponegoro & Teuku Umar, Tambun Selatan & Cibitung, Bekasi',
      coverage: 'Tambun Selatan, Tambun Utara, Cibitung, Babelan, Tarumajaya, Sukatani, Sukakarya, Pebayuran, Sukawangi, Tambelang.',
      response: '20 - 30 Menit',
      armadaCount: '6 Unit Truk Tangki',
      mapQuery: 'Tambun+Selatan,+Bekasi,+Jawa+Barat',
      mapsDirectUrl: 'https://www.google.com/maps/search/?api=1&query=Tambun+Selatan+Bekasi+Jawa+Barat',
      lat: '-6.2625',
      lng: '107.0583',
      pinPos: { left: '50%', top: '48%' },
      pinIcon: '🚛',
      pinColor: 'emerald',
      highlightArea: 'Koridor Tambun, Cibitung & Babelan',
    },
  ];

  // Calculator State
  const [calcPricePerCubic, setCalcPricePerCubic] = useState(700000);
  const [calcVolume, setCalcVolume] = useState<number>(1);
  const [selectedCalcOptionIndex, setSelectedCalcOptionIndex] = useState(0);

  const calcOptions = [
    { value: 700000, label: 'Limbah Black Water (Tinja) - Rp 700.000/kubik (Non Manifes)', type: 'Limbah Black Water (Tinja)', option: 'Non Manifes' },
    { value: 1100000, label: 'Limbah Grey Water (Lumpur, Lemak) - Rp 1.100.000/kubik (Non Manifes)', type: 'Limbah Grey Water (Lumpur, Lemak)', option: 'Non Manifes' },
    { value: 1100000, label: 'Cleaning / Blower Lumpur - Rp 1.100.000/kubik (Non Manifes)', type: 'Cleaning / Blower Lumpur', option: 'Non Manifes' },
    { value: 1100000, label: 'Limbah Black Water (Tinja) - Rp 1.100.000/kubik (Manifes)', type: 'Limbah Black Water (Tinja)', option: 'Manifes' },
    { value: 1500000, label: 'Limbah Grey Water (Lumpur, Lemak) - Rp 1.500.000/kubik (Manifes)', type: 'Limbah Grey Water (Lumpur, Lemak)', option: 'Manifes' },
    { value: 1500000, label: 'Cleaning / Blower Lumpur - Rp 1.500.000/kubik (Manifes)', type: 'Cleaning / Blower Lumpur', option: 'Manifes' },
  ];

  const waNumber = '6289675064916';

  // Section message dictionary
  const sectionMessages: Record<string, string> = {
    hero: 'saya sedang melihat halaman utama layanan sedot WC di Bekasi.',
    layanan: 'saya tertarik dengan Layanan Utama yang ditawarkan.',
    tentang: 'saya ingin bertanya seputar keunggulan perusahaan.',
    spesialis: 'saya ingin bertanya seputar layanan sektor spesialis (Industri/Hotel/Perumahan).',
    area: 'saya ingin memastikan area layanan saya terjangkau.',
    peta: 'saya melihat peta titik pusat layanan dan ingin memesan armada terdekat ke lokasi saya.',
    harga: 'saya ingin konsultasi mengenai harga layanan sedot WC.',
    kalkulator: 'saya baru saja menggunakan kalkulator estimasi biaya.',
    dokumentasi: 'saya melihat dokumentasi pekerjaan dan ingin berkonsultasi.',
    galeri: 'saya melihat galeri foto proyek teknisi di lapangan dan ingin berkonsultasi.',
    testimoni: 'saya melihat testimoni dan tertarik untuk menggunakan layanan.',
    tips: 'saya membaca artikel tips sanitasi di website Anda dan ingin berkonsultasi seputar masalah di rumah saya.',
    sertifikasi: 'saya melihat section Sertifikasi & Kemitraan resmi dan ingin berkonsultasi mengenai standar K3 dan dokumen legalitas vendor.',
    'statistik-newsletter': 'saya melihat ringkasan statistik performa subscriber newsletter dan ingin memantau pertumbuhan audiens serta konsultasi layanan.',
    kontak: 'saya melihat profil legalitas dan ingin menghubungi Anda.',
    faq: 'saya membaca FAQ dan ingin bertanya lebih lanjut.',
    'cta-akhir': 'saya ingin segera memesan layanan sedot WC.',
    'legalitas-seo': 'saya melihat tabel Legalitas & SEO Metadata (NIB, NPWP, KBLI 37011) di website dan ingin memverifikasi dokumen resmi vendor.',
  };

  // Device detection
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    setIsMobileDevice(mobileCheck);

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Section detection
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      sections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setCurrentSection(sec.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format currency helper
  const formatRupiah = (angka: number) => {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Generate dynamic WA link for specific section or fallback
  const getDynamicWaLink = (overrideSection?: string) => {
    const sec = overrideSection || currentSection;
    const deviceType = isMobileDevice ? 'HP' : 'Komputer';
    const msg = sectionMessages[sec] || 'saya ingin konsultasi layanan sedot WC di Bekasi.';
    const finalMsg = `Halo PT Kusuma Gemilang Raya, saya mengakses via ${deviceType} dan ${msg}`;
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(finalMsg)}`;
  };

  // Calculate Estimation values
  const totalEstimation = calcPricePerCubic * (calcVolume > 0 ? calcVolume : 1);
  const currentCalcObj = calcOptions[selectedCalcOptionIndex] || calcOptions[0];
  const calcWaMessage = `Halo PT Kusuma Gemilang Raya, saya ingin booking layanan cepat. Jenis Limbah: ${currentCalcObj.type}, Opsi: ${currentCalcObj.option}, Volume: ${calcVolume || 1} Kubik. Estimasi Biaya: ${formatRupiah(totalEstimation)}. Mohon konfirmasinya.`;
  const calcWaLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(calcWaMessage)}`;

  // Testimonials data with quantitative ratings
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonialsData);
  const [testimonialCategoryFilter, setTestimonialCategoryFilter] = useState<'Semua' | 'Residensial' | 'Industri & B2B' | 'Komersial'>('Semua');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [hoveredCardRating, setHoveredCardRating] = useState<{ id: string; star: number } | null>(null);

  // Form states for submitting new quantitative testimonial & review
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewCategory, setNewReviewCategory] = useState<'Residensial' | 'Industri & B2B' | 'Komersial' | 'Pelancaran Pipa'>('Residensial');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewHoverRating, setNewReviewHoverRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewPunctualityScore, setNewReviewPunctualityScore] = useState(5);
  const [newReviewCleanlinessScore, setNewReviewCleanlinessScore] = useState(5);
  const [newReviewCostTransparencyScore, setNewReviewCostTransparencyScore] = useState(5);

  // Quantitative rating calculations
  const totalVotesCount = testimonials.reduce((acc, curr) => acc + curr.totalVotes, 0);
  const overallAverageRating = (
    testimonials.reduce((acc, curr) => acc + curr.rating * curr.totalVotes, 0) /
    (totalVotesCount || 1)
  ).toFixed(2);

  const filteredTestimonials = testimonials.filter((t) => {
    if (testimonialCategoryFilter === 'Semua') return true;
    return t.category === testimonialCategoryFilter;
  });
  const currentTestimonials = filteredTestimonials.length > 0 ? filteredTestimonials : testimonials;
  const currentTestimonialIndex = activeTestimonial >= currentTestimonials.length ? 0 : activeTestimonial;

  const handleRateTestimonial = (testimonialId: string, starRating: number) => {
    setTestimonials((prev) =>
      prev.map((item) => {
        if (item.id === testimonialId) {
          const previousUserRating = item.userGivenRating;
          let newTotalVotes = item.totalVotes;
          let newAvgRating = item.rating;

          if (previousUserRating) {
            // Update existing rating
            const currentSum = item.rating * item.totalVotes;
            const updatedSum = currentSum - previousUserRating + starRating;
            newAvgRating = Math.round((updatedSum / item.totalVotes) * 10) / 10;
          } else {
            // Add new quantitative vote
            const currentSum = item.rating * item.totalVotes;
            newTotalVotes = item.totalVotes + 1;
            newAvgRating = Math.round(((currentSum + starRating) / newTotalVotes) * 10) / 10;
          }

          return {
            ...item,
            rating: newAvgRating,
            totalVotes: newTotalVotes,
            userGivenRating: starRating,
          };
        }
        return item;
      })
    );

    const target = testimonials.find((t) => t.id === testimonialId);
    const authorName = target ? target.author : 'Layanan';
    const satisfactionLabels: Record<number, string> = {
      1: 'Kurang Puas',
      2: 'Cukup',
      3: 'Baik',
      4: 'Sangat Baik',
      5: 'Luar Biasa / Sangat Puas',
    };
    triggerToast(`⭐ Nilai ${starRating}/5 (${satisfactionLabels[starRating] || 'Puas'}) berhasil dicatat untuk testimoni ${authorName}!`);
  };

  const handleSubmitNewReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) {
      triggerToast('⚠️ Mohon lengkapi nama dan isi testimoni kepuasan Anda.');
      return;
    }

    const initials = newReviewAuthor.trim().charAt(0).toUpperCase() || 'P';
    const bgColors = ['bg-orange/10', 'bg-cyan/10', 'bg-emerald-500/10', 'bg-purple-500/10', 'bg-blue-500/10'];
    const textColors = ['text-orange', 'text-cyan', 'text-emerald-600', 'text-purple-600', 'text-blue-600'];
    const randomIndex = Math.floor(Math.random() * bgColors.length);

    const newTestimonial: TestimonialItem = {
      id: `testi-${Date.now()}`,
      initial: initials,
      bgColor: bgColors[randomIndex],
      textColor: textColors[randomIndex],
      text: `"${newReviewText.trim()}"`,
      author: newReviewAuthor.trim(),
      role: newReviewRole.trim() || 'Pelanggan Terverifikasi Bekasi',
      category: newReviewCategory === 'Pelancaran Pipa' ? 'Komersial' : newReviewCategory,
      date: 'Baru saja',
      rating: newReviewRating,
      totalVotes: 1,
      userGivenRating: newReviewRating,
      satisfactionMetrics: [
        { aspect: 'Ketepatan Waktu Armada', score: newReviewPunctualityScore },
        { aspect: 'Kebersihan Kerja & APD', score: newReviewCleanlinessScore },
        { aspect: 'Transparansi Biaya', score: newReviewCostTransparencyScore },
      ],
    };

    setTestimonials((prev) => [newTestimonial, ...prev]);
    setActiveTestimonial(0);
    setIsReviewModalOpen(false);

    // Reset form
    setNewReviewAuthor('');
    setNewReviewRole('');
    setNewReviewText('');
    setNewReviewRating(5);
    setNewReviewPunctualityScore(5);
    setNewReviewCleanlinessScore(5);
    setNewReviewCostTransparencyScore(5);

    triggerToast(`🎉 Terima kasih! Nilai kepuasan ${newReviewRating}/5 bintang dan testimoni Anda berhasil dipublikasikan.`);
  };

  // Galeri Proyek Data
  const galleryProjects = [
    {
      id: 1,
      image: teknisiSedotWcImg,
      title: 'Penyedotan Septic Tank & Pengoperasian Truk Tangki',
      category: 'Sedot WC & Septic Tank',
      location: 'Perumahan Grand Galaxy, Bekasi Selatan',
      tag: 'Residensial',
      description: 'Teknisi profesional mengenakan APD lengkap (helm safety, rompi hi-vis, sepatu bot, dan sarung tangan) mengoperasikan selang vakum berdaya hisap tinggi langsung ke unit armada tangki resmi.',
    },
    {
      id: 2,
      image: teknisiPipaImg,
      title: 'Pelancaran Saluran Pipa Mampet Hydro Jetting',
      category: 'Pelancaran Pipa Mampet',
      location: 'Gedung Komersial Cikarang Barat',
      tag: 'Komersial & Kantor',
      description: 'Dua orang teknisi ahli menggunakan mesin hydro jetting spiral modern bertekanan tinggi untuk mengurai sumbatan lemak dan kerak pipa tanpa perlu membongkar keramik lantai.',
    },
    {
      id: 3,
      image: 'https://z-cdn-media.chatglm.cn/files/f376cf34-d467-42fc-a752-92f97c36ed1b.jpg?auth_key=1891530048-5d5ab972979f442aa2ac45be1b8be3e6-0-b727bf4bfb372d573d4996732a6c874e',
      title: 'Pengurasan Septic Tank Gedung Bertingkat',
      category: 'Sedot WC & Septic Tank',
      location: 'Kawasan Bisnis Medan Satria, Bekasi',
      tag: 'Komersial',
      description: 'Penyedotan septic tank komersial berkapasitas besar dengan sistem kedap udara sehingga bebas dari aroma menyengat di sekitar area publik.',
    },
    {
      id: 4,
      image: 'https://z-cdn-media.chatglm.cn/files/a663f5a2-9679-4548-bc6d-ee86fc0faf38.jpg?auth_key=1891530048-f58de94b45dd4195b1e4eb5c4db34d04-0-bf9997ee3b449021bddfe6a237af2b95',
      title: 'Penyedotan Limbah STP & IPAL Kawasan Industri',
      category: 'Limbah Industri & STP',
      location: 'Kawasan Industri GIIC Cikarang',
      tag: 'Industri / Pabrik',
      description: 'Armada truk tangki berizin resmi memasuki area pabrik manufaktur untuk pengurasan rutin bak pengolahan limbah STP sesuai SOP K3 dan regulasi lingkungan hidup.',
    },
    {
      id: 5,
      image: 'https://z-cdn-media.chatglm.cn/files/4da00e2f-49dd-4f4c-b983-2d496721c934.jpg?auth_key=1891530048-bc9acd819e9a48949530ccd303af95d0-0-73f082a39d6164cf5019ea6210e389ad',
      title: 'Pembersihan & Kuras Grease Trap Dapur Restoran',
      category: 'Grease Trap Restoran',
      location: 'Sentra Kuliner Summarecon Bekasi',
      tag: 'Restoran & F&B',
      description: 'Pembersihan menyeluruh perangkap lemak (grease trap) restoran komersial guna mencegah luapan limbah minyak dan bau tidak sedap ke ruang makan tamu.',
    },
    {
      id: 6,
      image: 'https://z-cdn-media.chatglm.cn/files/33054cf6-266f-447d-9081-464b93cc7cc7.jpg?auth_key=1891530048-aebcdd0fe66b48f880f5bc962fef5f6d-0-e05a985cd94e16de3b4a0110c366e099',
      title: 'Servis Vakum Residensial Akses Gang & Perumahan',
      category: 'Sedot WC & Septic Tank',
      location: 'Kompleks Perumahan Tambun Selatan',
      tag: 'Rumah Tinggal',
      description: 'Layanan cepat teknisi ke area perumahan padat dengan selang spiral panjang hingga puluhan meter yang tetap menjaga kebersihan pekarangan rumah klien.',
    },
    {
      id: 7,
      image: 'https://z-cdn-media.chatglm.cn/files/4bdc93a6-c220-4dbe-948f-36bbaa87b841.jpg?auth_key=1891530048-2bec263d4a5c497387667e9798780d5d-0-ef3c26848e67413f81c9c3311b1d5018',
      title: 'Pompa Lumpur Tinja Padat & Limbah Organik',
      category: 'Limbah Industri & STP',
      location: 'Ruko Niaga Harapan Indah, Bekasi',
      tag: 'Komersial',
      description: 'Proses pengenceran lumpur tinja yang mengendap bertahun-tahun menggunakan tekanan air tinggi sebelum disedot total sampai dasar septic tank bersih kembali.',
    },
    {
      id: 8,
      image: 'https://z-cdn-media.chatglm.cn/files/f0a0ebfc-d359-467e-818a-1eeb6670dbb3.jpg?auth_key=1891530048-1ea4bfb5615c415cb07dde8aa8708456-0-33efc077a48f2f99bf7f5ce0e12e9bf9',
      title: 'Pengangkutan Limbah Legal dengan Dokumen IPLT',
      category: 'Limbah Industri & STP',
      location: 'Zona Pergudangan & Logistik Cibitung',
      tag: 'Manifest Resmi',
      description: 'Seluruh limbah yang telah disedot dibawa langsung ke Instalasi Pengolahan Lumpur Tinja (IPLT) resmi pemerintah dengan bukti manifest sah dan transparan.',
    },
    {
      id: 9,
      image: 'https://z-cdn-media.chatglm.cn/files/4f3e0e12-39b6-49b9-898d-956ffdd2b291.jpg?auth_key=1891530048-b2c975c52af9462bb934e295016c1b9f-0-8acc724df47b2f017edd7607128792d7',
      title: 'Disinfeksi & Finishing Area Pengerjaan',
      category: 'Sedot WC & Septic Tank',
      location: 'Cluster Hunian Jatiasih, Bekasi',
      tag: 'Higienis & Steril',
      description: 'Setelah proses penyedotan tuntas, teknisi menyemprotkan larutan disinfektan anti kuman serta membersihkan area tutup septic tank sehingga bersih dan higienis.',
    },
  ];

  const galleryCategories = [
    'Semua',
    'Sedot WC & Septic Tank',
    'Pelancaran Pipa Mampet',
    'Limbah Industri & STP',
    'Grease Trap Restoran',
  ];

  const filteredProjects =
    selectedGalleryCategory === 'Semua'
      ? galleryProjects
      : galleryProjects.filter((p) => p.category === selectedGalleryCategory);

  // Responsive Items Per View for Dokumentasi Carousel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDocItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setDocItemsPerView(2);
      } else {
        setDocItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to parse Indonesian date strings (e.g. "10 Okt 2026")
  const parseDocDate = (dateStr: string): number => {
    try {
      const parts = dateStr.trim().split(/\s+/);
      if (parts.length >= 3) {
        const day = parseInt(parts[0], 10) || 1;
        const monthStr = parts[1].toLowerCase();
        const year = parseInt(parts[2], 10) || 2026;
        const monthMap: Record<string, number> = {
          jan: 0,
          feb: 1,
          mar: 2,
          apr: 3,
          mei: 4,
          may: 4,
          jun: 5,
          jul: 6,
          agu: 7,
          agt: 7,
          aug: 7,
          sep: 8,
          okt: 9,
          oct: 9,
          nov: 10,
          des: 11,
          dec: 11,
        };
        const month = monthMap[monthStr] ?? 0;
        return new Date(year, month, day).getTime();
      }
    } catch {
      // fallback
    }
    return 0;
  };

  const filteredDocumentation = [...documentationItems]
    .filter((item) => docCategoryFilter === 'Semua' || item.category === docCategoryFilter)
    .sort((a, b) => {
      if (docSortBy === 'Alphabetical') {
        return a.title.localeCompare(b.title, 'id', { sensitivity: 'base' });
      }
      if (docSortBy === 'Oldest') {
        const dateA = parseDocDate(a.date);
        const dateB = parseDocDate(b.date);
        if (dateA !== dateB) return dateA - dateB;
        return a.id - b.id;
      }
      // 'Newest' (default)
      const dateA = parseDocDate(a.date);
      const dateB = parseDocDate(b.date);
      if (dateA !== dateB) return dateB - dateA;
      return b.id - a.id;
    });

  const maxDocIndex = Math.max(0, filteredDocumentation.length - docItemsPerView);

  // Auto-slide for Dokumentasi Pekerjaan Carousel
  useEffect(() => {
    if (!isDocAutoPlay || filteredDocumentation.length <= docItemsPerView) return;
    const timer = setInterval(() => {
      setDocCarouselIndex((prev) => (prev >= maxDocIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [isDocAutoPlay, filteredDocumentation.length, maxDocIndex, docItemsPerView]);

  const handleDocNext = () => {
    setDocCarouselIndex((prev) => (prev >= maxDocIndex ? 0 : prev + 1));
  };

  const handleDocPrev = () => {
    setDocCarouselIndex((prev) => (prev <= 0 ? maxDocIndex : prev - 1));
  };

  const handleDocTouchStart = (e: React.TouchEvent) => {
    setDocTouchStartX(e.targetTouches[0].clientX);
    setDocTouchEndX(null);
  };

  const handleDocTouchMove = (e: React.TouchEvent) => {
    setDocTouchEndX(e.targetTouches[0].clientX);
  };

  const handleDocTouchEnd = () => {
    if (docTouchStartX === null || docTouchEndX === null) return;
    const distance = docTouchStartX - docTouchEndX;
    const minSwipeDistance = 40;

    if (distance > minSwipeDistance) {
      handleDocNext();
    } else if (distance < -minSwipeDistance) {
      handleDocPrev();
    }

    setDocTouchStartX(null);
    setDocTouchEndX(null);
  };

  // Quick Edit Handlers for Dokumentasi Pekerjaan (Authorized Users)
  const handleStartQuickEdit = () => {
    if (!activeDocPreview) return;
    if (!isDocAuthorized) {
      setDocAuthPin('');
      setDocAuthError('');
      setIsDocAuthModalOpen(true);
      return;
    }
    setEditDocDate(activeDocPreview.date);
    setEditDocDescription(activeDocPreview.description);
    setIsEditingDocPreview(true);
  };

  const handleVerifyDocAuth = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = docAuthPin.trim();
    if (cleanPin === '1234' || cleanPin === 'admin' || cleanPin === 'admin2026' || cleanPin === 'kusuma') {
      setIsDocAuthorized(true);
      setIsDocAuthModalOpen(false);
      setDocAuthError('');
      triggerToast('🔑 Akses Petugas Terverifikasi! Mode Quick Edit diaktifkan.');
      if (activeDocPreview) {
        setEditDocDate(activeDocPreview.date);
        setEditDocDescription(activeDocPreview.description);
        setIsEditingDocPreview(true);
      }
    } else {
      setDocAuthError('PIN otorisasi tidak valid. Silakan coba kembali atau gunakan tombol Otorisasi Cepat.');
    }
  };

  const handleQuickAuthorizeDirect = () => {
    setIsDocAuthorized(true);
    setIsDocAuthModalOpen(false);
    setDocAuthError('');
    triggerToast('🔑 Otorisasi Petugas Berhasil Diberikan!');
    if (activeDocPreview) {
      setEditDocDate(activeDocPreview.date);
      setEditDocDescription(activeDocPreview.description);
      setIsEditingDocPreview(true);
    }
  };

  const handleSaveQuickEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDocPreview) return;
    if (!editDocDescription.trim()) {
      triggerToast('⚠️ Deskripsi pekerjaan tidak boleh kosong.');
      return;
    }
    if (!editDocDate.trim()) {
      triggerToast('⚠️ Tanggal pengerjaan tidak boleh kosong.');
      return;
    }

    setIsDocSaving(true);
    setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const updatedItem: DocumentationItem = {
        ...activeDocPreview,
        date: editDocDate.trim(),
        description: editDocDescription.trim(),
        lastUpdated: `Hari ini pk ${nowStr}`,
      };

      setDocumentationItems((prev) =>
        prev.map((item) => (item.id === activeDocPreview.id ? updatedItem : item))
      );
      setActiveDocPreview(updatedItem);
      setIsEditingDocPreview(false);
      setIsDocSaving(false);
      triggerToast(`✓ Deskripsi & tanggal dokumentasi #${updatedItem.id} berhasil diperbarui langsung dari modal!`);
    }, 350);
  };

  const handleCancelQuickEdit = () => {
    setIsEditingDocPreview(false);
  };

  const handleCloseDocPreview = () => {
    setActiveDocPreview(null);
    setIsEditingDocPreview(false);
  };

  // Handler Unduh Invoice PDF & BAST untuk Dokumentasi Pekerjaan
  const handleDownloadDocInvoicePdf = async (itemToDownload?: DocumentationItem) => {
    const targetItem = itemToDownload || activeDocPreview;
    if (!targetItem) return;

    setIsDownloadingDocInvoicePdf(true);
    try {
      const doc = generateInvoiceBastPdf(targetItem, {
        clientCompanyName: docInvoiceClientName.trim() || undefined,
        poNumber: docInvoicePoNumber.trim() || undefined,
      });
      const sanitizedTitle = targetItem.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
      const filename = `Invoice_BAST_PT_KGR_DOC_${targetItem.id}_${sanitizedTitle}.pdf`;
      doc.save(filename);
      triggerToast(`📄 Salinan Invoice & BAST PDF untuk "${targetItem.title}" berhasil diunduh!`);
    } catch (error) {
      console.error('Error generating Invoice BAST PDF:', error);
      triggerToast('Gagal memproses file Invoice PDF. Silakan coba lagi.');
    } finally {
      setIsDownloadingDocInvoicePdf(false);
    }
  };

  // Map Hub Interactive Pin & Auto-Centering Handlers
  const handleSelectMapHub = (idx: number, shouldScroll = false) => {
    setActiveMapHubIndex(idx);
    const selectedHub = mapHubs[idx];
    setMapCenteringNotice(`Peta dipusatkan ke ${selectedHub.name} (Koordinat: ${selectedHub.lat}, ${selectedHub.lng})`);
    setIsCardHighlighted(true);
    triggerToast(`📍 Peta dipusatkan ke ${selectedHub.name}! Kartu info diperbarui otomatis.`);

    setTimeout(() => {
      setMapCenteringNotice(null);
    }, 4000);

    setTimeout(() => {
      setIsCardHighlighted(false);
    }, 1800);

    if (shouldScroll || (typeof window !== 'undefined' && window.innerWidth < 1024)) {
      setTimeout(() => {
        hubCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  const handleCopyMapCoords = (coords: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(coords);
    }
    setCopiedMapCoords(true);
    triggerToast(`📋 Koordinat GPS (${coords}) berhasil disalin!`);
    setTimeout(() => {
      setCopiedMapCoords(false);
    }, 2500);
  };

  const handleCopyHubPhone = (e: React.MouseEvent, phone: string, hubName: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone);
    }
    setCopiedHubPhone(phone);
    triggerToast(`📞 Nomor kontak ${hubName} (${phone}) berhasil disalin!`);
    setTimeout(() => {
      setCopiedHubPhone(null);
    }, 2500);
  };

  const handleCopyHubAddress = (e: React.MouseEvent, address: string, hubName: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address);
    }
    setCopiedHubAddress(address);
    triggerToast(`📍 Alamat ${hubName} berhasil disalin ke clipboard!`);
    setTimeout(() => {
      setCopiedHubAddress(null);
    }, 2500);
  };

  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 16));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 11));
  };

  // Handler Export Area Map View as PNG for B2B Presentations
  const handleExportAreaMapPng = async () => {
    const selectedHub = mapHubs[activeMapHubIndex];
    setIsExportingMapPng(true);
    triggerToast(`📸 Sedang merender Peta Area "${selectedHub.name}" format PNG...`);

    try {
      await downloadAreaMapPng({
        activeHub: selectedHub,
        allHubs: mapHubs,
        companyName: 'PT KUSUMA GEMILANG RAYA',
        clientTarget: 'Presentasi Internal & Penawaran Kerjasama B2B',
      });
      triggerToast(`✅ Peta Area "${selectedHub.name}" berhasil diunduh sebagai gambar PNG!`);
    } catch (error) {
      console.error('Failed to export map PNG:', error);
      triggerToast('Gagal mengekspor gambar peta. Silakan coba kembali.');
    } finally {
      setIsExportingMapPng(false);
    }
  };

  // Blog / Tips Sanitasi Data (SEO-Rich Articles)
  const blogArticles = [
    {
      id: 1,
      title: 'Panduan Perawatan Septic Tank Agar Tidak Cepat Penuh & Bebas Bau di Bekasi',
      slug: 'panduan-perawatan-septic-tank-bekasi',
      category: 'Perawatan Septic Tank',
      readTime: '5 Menit Baca',
      date: '09 Oktober 2026',
      author: 'Tim Teknisi Sanitasi PT Kusuma Gemilang Raya',
      summary: 'Ketahui penyebab septic tank cepat penuh, bahaya membuang cairan pembersih kimia keras ke kloset, dan jadwal ideal pengurasan berkala untuk hunian di Bekasi.',
      tags: ['Septic Tank', 'Bakteri Pengurai', 'Sanitasi Rumah'],
      image: teknisiSedotWcImg,
      content: [
        'Septic tank merupakan komponen vital sistem sanitasi rumah tangga yang berfungsi menampung dan menguraikan kotoran tinja (black water) secara biologis dengan bantuan mikroorganisme anaerobik.',
        'Banyak pemilik rumah di Bekasi baru menyadari septic tank bermasalah setelah kloset meluap atau muncul bau belerang menyengat. Padahal, penumpukan lumpur padat (sludge) yang tidak disedot bertahun-tahun akan mengendap keras seperti batu kapur di dasar tangki, menutup pori-pori resapan tanah, dan mencemari air sumur.',
        'Kebiasaan menuangkan cairan pembersih kimia keras, karbol pekat, atau pemutih pakaian berlebihan ke dalam kloset menjadi penyebab utama bakteri pengurai alami mati massal. Akibatnya, kotoran tidak terfermentasi sempurna dan tangki terisi penuh dalam waktu yang jauh lebih singkat.',
        'Rekomendasi teknisi kami: Jadwalkan penyedotan septic tank setiap 1 hingga 2 tahun sekali untuk rumah tangga 4-6 orang. Pastikan pipa ventilasi hawa (T-pipe vent) tidak tersumbat agar sirkulasi gas metana tetap aman dan terhindar dari risiko ledakan tangki septik.',
      ],
      keyTakeaways: [
        'Hindari membuang deterjen keras, pemutih, dan minyak ke dalam kloset.',
        'Lakukan kuras septic tank berkala 1–2 tahun sekali sebelum lumpur mengeras.',
        'Pastikan jarak resapan septic tank minimal 10 meter dari sumur gali/bor air bersih.',
      ],
    },
    {
      id: 2,
      title: '7 Cara Efektif Mencegah Wastafel & Pipa Saluran Air Mampet Tanpa Rusak Paralon',
      slug: 'cara-mencegah-saluran-air-mampet',
      category: 'Pencegahan Saluran Mampet',
      readTime: '4 Menit Baca',
      date: '07 Oktober 2026',
      author: 'Divisi Plumbing & Saluran Mampet',
      summary: 'Minyak jelantah dan gumpalan rambut adalah biang keladi 80% pipa tersumbat. Simak cara pencegahan praktis tanpa risiko pipa paralon bocor atau bengkok.',
      tags: ['Saluran Mampet', 'Wastafel Dapur', 'Pipa PVC Paralon'],
      image: teknisiPipaImg,
      content: [
        'Saluran pipa pembuangan air kotor (grey water) di dapur dan kamar mandi kerap mengalami penyumbatan mendadak saat buangan air menggenang dan timbul aroma tidak sedap di sekitar sink.',
        'Di area dapur, biang keladi nomor satu adalah minyak goreng bekas (jelantah) dan kuah lemak bersantan yang langsung disiram ke sink. Lemak cair akan membeku seketika saat menyentuh dinding pipa paralon yang dingin di bawah lantai, menumpuk lapis demi lapis hingga diameter pipa menyempit total.',
        'Di kamar mandi, helai rambut rontok yang lolos ke lubang floor drain akan mengikat buih sabun dan daki kulit, membentuk sumbatan serat yang liat di lekukan pipa leher angsa (P-trap).',
        'Peringatan penting bagi warga: Hindari penggunaan soda api (kaustik soda) dalam jumlah berlebih pada pipa paralon tipis. Reaksi panas eksotermis soda api bisa melelehkan sambungan lem pipa PVC dan menyebabkan kebocoran fatal di dalam struktur cor beton rumah.',
      ],
      keyTakeaways: [
        'Kumpulkan minyak jelantah pada wadah khusus, jangan siram ke wastafel cuci piring.',
        'Siram saluran wastafel dengan air panas mendidih seminggu sekali untuk melarutkan sisa lemak tipis.',
        'Pasang saringan kawat halus (hair trap) di lubang kamar mandi dan bersihkan setiap 2 hari.',
      ],
    },
    {
      id: 3,
      title: 'Standar Sanitasi Toilet Sehat & Bebas Kuman Menurut Pedoman Kesehatan Lingkungan',
      slug: 'standar-toilet-sehat-dan-sanitasi-rumah',
      category: 'Kebersihan Rumah Tangga',
      readTime: '4 Menit Baca',
      date: '05 Oktober 2026',
      author: 'Staff K3 & Pengendalian Kualitas Lingkungan',
      summary: 'Toilet sehat bukan hanya terlihat bersih, tetapi juga harus memenuhi standar ventilasi, kemiringan lantai, sistem leher angsa kedap bau, dan sterilisasi berkala.',
      tags: ['Toilet Sehat', 'Higienis', 'Kesehatan Keluarga'],
      image: heroKusumaImg,
      content: [
        'Sanitasi lingkungan rumah tangga yang sehat adalah garis pertahanan pertama keluarga terhadap berbagai penyakit menular seperti diare, tifus, kolera, dan infeksi bakteri E. coli.',
        'Kloset yang memenuhi standar sanitasi wajib memiliki sistem leher angsa (water seal trap) yang terisi air bersih permanen. Genangan air ini berfungsi menyegel udara septic tank agar gas beracun dan kecoak tidak bisa merayap keluar ke kamar mandi.',
        'Pencahayaan alami dan sirkulasi ventilasi udara yang cukup sangat diperlukan agar kelembapan ruangan tetap terjaga di bawah 60%, mencegah pertumbuhan jamur hitam dan lumut berbahaya pada nat keramik.',
        'Tips higienitas ekstra: Biasakan selalu menutup penutup kloset sebelum menekan tombol penyiram (flush). Langkah sederhana ini mencegah partikel droplet mikroba berbahaya menyembur ke udara dan menempel di sikat gigi atau handuk.',
      ],
      keyTakeaways: [
        'Pastikan kloset memiliki leher angsa berfungsi baik sebagai penahan gas beracun.',
        'Lantai kamar mandi harus memiliki kemiringan minimal 1-2% agar air tidak tergenang.',
        'Tutup kloset saat menyiram untuk mencegah penyebaran aerosol bakteri ke seluruh ruangan.',
      ],
    },
    {
      id: 4,
      title: 'Perbedaan Limbah Black Water vs Grey Water dan Pentingnya Jalur IPLT Resmi',
      slug: 'perbedaan-black-water-grey-water-iplt-bekasi',
      category: 'Perawatan Septic Tank',
      readTime: '6 Menit Baca',
      date: '02 Oktober 2026',
      author: 'Manajemen Legalitas & Manifest IPLT PT Kusuma Gemilang Raya',
      summary: 'Pahami klasifikasi air limbah domestik dan mengapa pembuangan limbah tinja wajib ke IPLT berizin resmi pemerintah daerah demi menjaga sumber air tanah Bekasi.',
      tags: ['Black Water', 'Grey Water', 'Manifest IPLT', 'Lingkungan Hidup'],
      image: 'https://z-cdn-media.chatglm.cn/files/f0a0ebfc-d359-467e-818a-1eeb6670dbb3.jpg?auth_key=1891530048-1ea4bfb5615c415cb07dde8aa8708456-0-33efc077a48f2f99bf7f5ce0e12e9bf9',
      content: [
        'Dalam regulasi sanitasi lingkungan, air limbah domestik rumah tangga dibedakan menjadi dua jenis utama dengan karakteristik pengolahan yang berbeda: Black Water dan Grey Water.',
        'Black Water adalah air buangan kloset yang mengandung tinja, urin, dan bakteri patogen berbahaya seperti Salmonella dan E. coli. Limbah ini wajib masuk ke tangki septik tertutup kedap air.',
        'Grey Water merupakan air limbah non-tinja dari cucian baju, wastafel dapur, dan bak mandi. Walaupun tampak lebih bersih, grey water mengandung fosfat deterjen dan minyak yang berpotensi memicu eutrofikasi jika langsung mencemari danau atau selokan pemukiman.',
        'PT Kusuma Gemilang Raya berkomitmen 100% membuang seluruh muatan limbah tangki tinja ke Instalasi Pengolahan Lumpur Tinja (IPLT) resmi pemerintah dengan bukti manifest fisik dan digital, menjamin tidak ada limbah dibuang liar ke sungai Bekasi.',
      ],
      keyTakeaways: [
        'Black water wajib ditampung di septic tank kedap dan terpisah dari saluran got terbuka.',
        'Gunakan grease trap pada grey water dapur restoran dan ruko sebelum masuk drainase.',
        'Gunakan jasa sedot WC berizin resmi yang memberikan bukti manifest pembuangan IPLT sah.',
      ],
    },
  ];

  const blogCategories = [
    'Semua',
    'Perawatan Septic Tank',
    'Pencegahan Saluran Mampet',
    'Kebersihan Rumah Tangga',
  ];

  const filteredBlogArticles =
    selectedBlogCategory === 'Semua'
      ? blogArticles
      : blogArticles.filter((article) => article.category === selectedBlogCategory);

  // B2B & Corporate FAQ Items Data
  const b2bFaqCategories = [
    'Semua',
    'Audit Vendor',
    'BAST',
    'e-Faktur & PPN',
    'K3 & IPLT',
  ] as const;

  const b2bFaqItems = [
    {
      id: 1,
      category: 'Audit Vendor' as const,
      categoryLabel: 'Audit Vendor & Legalitas',
      badge: 'Kelengkapan Lolos Audit',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      question: 'Apa saja persyaratan dan berkas yang disediakan untuk proses audit vendor perusahaan (B2B)?',
      summary: 'PT Kusuma Gemilang Raya menyediakan seluruh dokumen legalitas badan usaha resmi, kepatuhan K3/CSMS, kelayakan armada, serta siap mengikuti site verification meeting dan registrasi portal vendor korporat.',
      details: [
        {
          title: 'Legalitas Badan Usaha Lengkap & Sah',
          desc: 'NIB berbasis risiko KBLI 37011 (Pengelolaan dan Pembuangan Air Limbah Tidak Berbahaya), Sertifikat Standar Terverifikasi OSS RBA, SPPKP (Surat Pengukuhan Pengusaha Kena Pajak), NPWP Badan Usaha, Akta Notaris & SK Kemenkumham, serta Rekening Giro Bank Mandiri/BCA resmi a.n PT Kusuma Gemilang Raya.'
        },
        {
          title: 'Standar K3 & Dokumen CSMS (Contractor Safety Management)',
          desc: 'Job Safety Analysis (JSA / HIRADC), Sertifikat K3 Teknisi Ruang Terbatas (Confined Space Entry Kemenaker), sertifikasi APD Level 3 lengkap (harness, breathing apparatus/respirator, safety boots, gas detector 4-sensor kalibrasi berkala), dan SOP Tanggap Darurat.'
        },
        {
          title: 'Kelaikan Operasional Armada & Kru',
          desc: 'Buku uji KIR berkala aktif dari Dishub, SIM B2 Umum pengemudi truk tangki, izin lintasan angkutan limbah, dan sertifikasi kalibrasi pompa vacuum blower berdaya hisap tinggi.'
        },
        {
          title: 'Dukungan Registrasi Portal & Site Inspection',
          desc: 'Tim Tender & Legal kami siap mengisi Formulir Vendor Registration, menandatangani NDA (Non-Disclosure Agreement), pengisian portal e-Procurement (SAP, Ariba, Coupa), serta menghadiri audit kunjungan lapangan oleh tim HSE/Procurement klien.'
        }
      ],
      tags: ['NIB KBLI 37011', 'SPPKP Resmi', 'CSMS / SMK3', 'Confined Space', 'Audit Rekanan'],
    },
    {
      id: 2,
      category: 'BAST' as const,
      categoryLabel: 'Proses BAST & Laporan',
      badge: 'Joint Inspection Formal',
      badgeColor: 'bg-cyan/10 text-cyan-dark border-cyan/30',
      question: 'Bagaimana proses dan alur penerbitan BAST (Berita Acara Serah Terima) setelah pekerjaan selesai?',
      summary: 'Setelah pekerjaan penyedotan lumpur atau pembersihan selesai, kami melakukan Joint Inspection di lokasi bersama tim klien dan menerbitkan dokumen BAST resmi bertanda tangan sebagai bukti sah penagihan invoice.',
      details: [
        {
          title: 'Pemeriksaan Bersama di Lokasi (Joint Inspection)',
          desc: 'Supervisor lapangan PT Kusuma bersama perwakilan Facilities, HSE, atau GA pabrik melakukan inspeksi visual langsung di titik pengerjaan (bak STP, grease trap sentral, atau septic tank) guna memastikan volume telah terkuras bersih dan saluran kembali lancar.'
        },
        {
          title: 'Pencatatan Volume Riil & Ritase Truk',
          desc: 'Pencatatan volume aktual dalam satuan meter kubik (m³) atau jumlah ritase armada truk vacuum, disaksikan dan diparaf oleh petugas berwenang dari pihak klien di lokasi kerja.'
        },
        {
          title: 'Dokumentasi Foto GPS Before & After',
          desc: 'Lampiran foto dokumentasi komprehensif saat kondisi sebelum dikuras (before), saat proses penyedotan berlangsung, dan hasil akhir setelah dibersihkan (after) dilengkapi cap watermark koordinat GPS dan tanggal-jam pengerjaan real-time.'
        },
        {
          title: 'Penerbitan Fisik BAST & Validasi Manifest',
          desc: 'Dokumen BAST dicetak rangkap resmi ber-kop PT Kusuma Gemilang Raya, bermeterai bila disyaratkan, ditandatangani kedua belah pihak, dan dilampiri tembusan Manifest IPLT sah. Menjadi berkas wajib untuk proses penagihan (billing cycle).'
        }
      ],
      tags: ['Joint Inspection', 'Volume m³ / Rit', 'GPS Before-After', 'Syarat Penagihan', 'Manifest IPLT'],
    },
    {
      id: 3,
      category: 'e-Faktur & PPN' as const,
      categoryLabel: 'e-Faktur PPN & Termin TOP',
      badge: 'PKP Sah & DJP Terverifikasi',
      badgeColor: 'bg-orange/10 text-orange-dark border-orange/30',
      question: 'Bagaimana kebijakan pembayaran, termin tempo (Terms of Payment - TOP), dan penerbitan e-Faktur PPN?',
      summary: 'Sebagai badan usaha berstatus PKP, kami menerbitkan e-Faktur PPN 11% sah yang terdaftar di DJP, mendukung Purchase Order (PO) dengan termin tempo 14–30 hari kalender, dan transaksi hanya via rekening giro resmi PT.',
      details: [
        {
          title: 'Status PKP & e-Faktur PPN 11% Sah DJP',
          desc: 'PT Kusuma Gemilang Raya adalah Pengusaha Kena Pajak (PKP) resmi terdaftar di Kantor Pelayanan Pajak (KPP). Setiap transaksi penagihan B2B diterbitkan Faktur Pajak Elektronik (e-Faktur) resmi DJP lengkap dengan QR Code validasi yang dapat langsung diverifikasi di DJP Online.'
        },
        {
          title: 'Fasilitas Termin Pembayaran (Terms of Payment / TOP)',
          desc: 'Untuk klien korporasi, pabrik kawasan industri, dan instansi yang telah melewati proses verifikasi rekanan, kami memberlakukan sistem pembayaran termin tempo 14 hingga 30 hari kalender (TOP 14/30 Days) setelah berkas tagihan diterima lengkap oleh tim Finance klien.'
        },
        {
          title: 'Paket Berkas Tagihan (Invoicing Set) Lengkap',
          desc: 'Berkas penagihan dikirimkan dalam amplop resmi berisi: Surat Penagihan (Invoice Asli bermeterai), Berita Acara Serah Terima (BAST) bertanda tangan, Surat Jalan pengangkutan limbah, e-Faktur PPN 11%, fotokopi PO/Kontrak Kerja, dan bukti setor Manifest IPLT.'
        },
        {
          title: 'Rekening Transaksi Bank Perusahaan (PT) Resmi',
          desc: 'Pembayaran wajib ditransfer ke Rekening Giro resmi PT Kusuma Gemilang Raya (Bank Mandiri / BCA). Kami menegaskan kebijakan kepatuhan integritas: tidak melayani transaksi keuangan ke rekening perseorangan untuk pesanan korporat.'
        }
      ],
      tags: ['Faktur Pajak 11%', 'TOP 14-30 Hari', 'Invoice Bermeterai', 'Rekening Giro PT', 'DJP Online'],
    },
    {
      id: 4,
      category: 'K3 & IPLT' as const,
      categoryLabel: 'Manifest IPLT & Regulasi K3',
      badge: 'Sertifikasi IPLT & K3 Level 3',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      question: 'Apakah pembuangan limbah dijamin legal dengan Manifest IPLT resmi untuk audit lingkungan ISO 14001 dan DLH?',
      summary: 'Seluruh limbah disalurkan langsung ke IPLT Sumur Batu / IPLT Babelan dengan dokumen Manifest IPLT resmi berbarcode untuk memenuhi audit ISO 14001, audit PROPER KLHK, dan laporan berkala DLH.',
      details: [
        {
          title: 'PKS Resmi dengan Pengelola IPLT Pemerintah',
          desc: 'PT Kusuma Gemilang Raya terikat Perjanjian Kerja Sama resmi dengan UPTD IPLT Dinas Lingkungan Hidup Kota & Kabupaten Bekasi untuk pembuangan lumpur tinja dan limbah domestik secara legal.'
        },
        {
          title: 'Penerbitan Manifest IPLT Berbarcode Sah',
          desc: 'Setiap rit truk yang masuk ke instalasi pencurahan limbah IPLT menerima lembar manifest verifikasi bernomor register dan barcode resmi petugas jaga, mencatat asal pabrik/klien, nomor polisi truk, dan volume kubikasi riil.'
        },
        {
          title: 'Kepatuhan Audit ISO 14001 & PROPER KLHK',
          desc: 'Lembar manifest ini menjadi dokumen kepatuhan hukum lingkungan yang sah untuk diajukan dalam audit Sistem Manajemen Lingkungan ISO 14001, inspeksi berkala DLH, dan penilaian kinerja PROPER KLHK.'
        }
      ],
      tags: ['Manifest IPLT', 'Audit ISO 14001', 'Laporan DLH', 'Bebas Denda Lingkungan', 'UPTD Pemkot/Pemkab'],
    },
    {
      id: 5,
      category: 'Audit Vendor' as const,
      categoryLabel: 'Audit Vendor & Legalitas',
      badge: 'SLA Darurat 1-2 Jam',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      question: 'Apakah melayani kontrak pemeliharaan berkala (PKS Tahunan) dengan jaminan SLA darurat di kawasan industri Bekasi?',
      summary: 'Kami menyediakan Perjanjian Kerja Sama (PKS) pemeliharaan berkala bulanan/triwulanan dengan SLA darurat 1–2 jam respon tanggap dan fleksibilitas jadwal saat masa maintenance shutdown atau akhir pekan.',
      details: [
        {
          title: 'Perjanjian Kerja Sama (PKS Kontrak Tahunan)',
          desc: 'Memberikan kepastian tarif flat tahunan yang lebih efisien tanpa fluktuasi harga, prioritas plotting jadwal armada tangki, serta laporan berkala histori kesehatan sistem IPAL/septic tank fasilitas pabrik.'
        },
        {
          title: 'Fleksibilitas Jadwal Pengerjaan (Weekend / Shift Malam)',
          desc: 'Memahami operasional pabrik yang padat, pengerjaan dapat dijadwalkan pada masa plant shutdown, shift malam, atau hari libur akhir pekan tanpa mengganggu jalannya lini produksi utama.'
        },
        {
          title: 'Service Level Agreement (SLA) Emergency',
          desc: 'Jaminan respon armada darurat dalam tempo 1 hingga 2 jam untuk mengatasi insiden bak ekualisasi meluap, grease trap tersumbat, atau luapan toilet pabrik di kawasan MM2100, Jababeka, GIIC, EJIP, dan sekitarnya.'
        }
      ],
      tags: ['Kontrak PKS Tahunan', 'Emergency SLA 2 Jam', 'Jadwal Plant Shutdown', 'Kawasan MM2100 & Jababeka'],
    }
  ];

  const filteredB2bFaqItems = b2bFaqItems.filter((item) => {
    const matchCategory = b2bFaqCategory === 'Semua' || item.category === b2bFaqCategory;
    const matchSearch =
      b2bFaqSearch.trim() === '' ||
      item.question.toLowerCase().includes(b2bFaqSearch.toLowerCase()) ||
      item.summary.toLowerCase().includes(b2bFaqSearch.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(b2bFaqSearch.toLowerCase())) ||
      item.details.some((d) => d.title.toLowerCase().includes(b2bFaqSearch.toLowerCase()) || d.desc.toLowerCase().includes(b2bFaqSearch.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // B2B FAQ keyword match calculations
  const b2bFaqMatchMap = React.useMemo(() => {
    const map = new Map<number, { total: number; questionMatches: number; answerMatches: number }>();
    if (!b2bFaqSearch.trim()) return map;
    for (const item of filteredB2bFaqItems) {
      const stats = getFaqMatchStats({ question: item.question, summary: item.summary, details: item.details }, b2bFaqSearch);
      map.set(item.id, stats);
    }
    return map;
  }, [filteredB2bFaqItems, b2bFaqSearch]);

  const totalB2bFaqMatches = React.useMemo(() => {
    let sum = 0;
    b2bFaqMatchMap.forEach((stats) => {
      sum += stats.total;
    });
    return sum;
  }, [b2bFaqMatchMap]);

  const b2bItemsWithMatchesCount = React.useMemo(() => {
    let count = 0;
    b2bFaqMatchMap.forEach((stats) => {
      if (stats.total > 0) count++;
    });
    return count;
  }, [b2bFaqMatchMap]);

  // Auto-select first matching B2B item if search changes
  useEffect(() => {
    if (b2bFaqSearch.trim() && filteredB2bFaqItems.length > 0) {
      if (!openB2bFaqId || !filteredB2bFaqItems.some((i) => i.id === openB2bFaqId)) {
        setOpenB2bFaqId(filteredB2bFaqItems[0].id);
      }
    }
  }, [b2bFaqSearch]);

  // Subtle shake animation trigger when B2B FAQ search keyword yields zero results
  useEffect(() => {
    if (b2bFaqSearch.trim() !== '' && filteredB2bFaqItems.length === 0) {
      setIsB2bFaqShaking(true);
      setB2bFaqShakeKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        setIsB2bFaqShaking(false);
      }, 450);
      return () => clearTimeout(timer);
    } else {
      setIsB2bFaqShaking(false);
    }
  }, [b2bFaqSearch, filteredB2bFaqItems.length]);

  // General & Residential FAQ Categories & Data
  const generalFaqCategories = [
    'Semua',
    'Harga',
    'Layanan',
    'Area',
    'Teknis',
  ] as const;

  const generalFaqItems: {
    id: number;
    category: 'Harga' | 'Layanan' | 'Area' | 'Teknis';
    question: string;
    badge?: string;
    answer: string;
    keywords: string[];
    icon: React.ReactNode;
  }[] = [
    {
      id: 1,
      category: 'Harga',
      question: 'Berapa harga sedot WC di Bekasi?',
      badge: 'Harga Transparan',
      answer: 'Biaya jasa sedot WC di Bekasi disesuaikan dengan volume septic tank (per rit armada engkel / double), jarak selang, dan jenis limbah. Estimasi biaya sedot WC hunian mulai dari Rp 350.000 – Rp 450.000/rit dengan konfirmasi harga pasti di awal tanpa pungutan liar.',
      keywords: ['harga', 'biaya', 'tarif', 'ongkos', 'berapa', 'sewa', 'rit', 'murah'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      category: 'Harga',
      question: 'Apakah ada biaya tambahan untuk panjang selang di atas 50 meter?',
      badge: 'Bebas Biaya Siluman',
      answer: 'Kami menerapkan transparansi penuh tanpa biaya siluman. Layanan standar sudah mencakup panjang selang gratis hingga 50 meter. Apabila titik septic tank berada di dalam gang sempit berjarak di atas 50 meter dari titik parkir truk tangki, teknisi kami akan menginformasikan rincian biaya selang ekstra di awal sebelum pekerjaan dimulai.',
      keywords: ['biaya tambahan', 'selang panjang', 'gang sempit', 'transparan', 'biaya siluman', 'tarif jujur', 'ongkos'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      category: 'Harga',
      question: 'Apakah ada jaminan garansi pengerjaan setelah sedot WC atau pelancaran pipa?',
      badge: 'Garansi Resmi',
      answer: 'Ya, seluruh pekerjaan pengurasan septic tank dan pelancaran pipa saluran mampet kami bergaransi resmi. Jika timbul kendala mampet kembali dalam masa garansi tanpa adanya faktor benda asing baru yang masuk, teknisi kami siap melakukan inspeksi dan penanganan ulang secara gratis.',
      keywords: ['garansi', 'jaminan', 'gratis', 'klaim garansi', 'kompensasi', 'service ulang'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 4,
      category: 'Layanan',
      question: 'Apakah bisa sedot septic tank rumah tinggal & gedung komersial?',
      badge: 'Layanan Utama',
      answer: 'Tentu saja. Pengurasan septic tank adalah layanan utama kami untuk rumah hunian, perumahan cluster, ruko, perkantoran, sekolah, masjid, hingga fasilitas komersial dan industri berskala besar.',
      keywords: ['septic tank', 'septictank', 'kuras', 'sedot', 'wc', 'tinja', 'hunian', 'komersial'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: 5,
      category: 'Layanan',
      question: 'Apakah melayani saluran pipa mampet tanpa bongkar keramik?',
      badge: 'Tanpa Bongkar',
      answer: 'Ya, kami menggunakan mesin mechanical spiral drain cleaner (rooter machine) dan vacuum suction bertekanan tinggi untuk mengurai sumbatan rambut, lemak beku, dan kotoran pipa tanpa merusak lantai keramik.',
      keywords: ['mampet', 'tersumbat', 'pipa', 'wastafel', 'toilet', 'kloset', 'saluran', 'bongkar', 'rooter'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437" />
        </svg>
      ),
    },
    {
      id: 6,
      category: 'Layanan',
      question: 'Apakah melayani pengurasan limbah STP, grease trap & lumpur?',
      badge: 'Izin Resmi DLH',
      answer: 'Ya, kami melayani penyedotan limbah STP perkantoran/pabrik, penangkap lemak dapur restoran (grease trap), serta endapan lumpur proyek dengan pembuangan legal ke IPLT resmi Sumur Batu Bekasi.',
      keywords: ['stp', 'limbah', 'hotel', 'ipal', 'restoran', 'b2b', 'gedung', 'grease trap', 'lemak', 'lumpur'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a87.354 87.354 0 01-.713-4.726V9.5a9 9 0 00-.215-2.185L20.25 4.5M3 15V9.5a9 9 0 01.215-2.185L4.5 4.5M21 21v-4a2.4 2.4 0 00-.6-1.6L15.75 10.5M3 3l1.5 1.5M21 3l-1.5 1.5" />
        </svg>
      ),
    },
    {
      id: 7,
      category: 'Layanan',
      question: 'Apakah layanan darurat tersedia 24 jam non-stop?',
      badge: '24 Jam Siaga',
      answer: 'Layanan kami aktif 24 jam penuh setiap hari, termasuk akhir pekan dan hari libur nasional. Dispatcher armada siap merespon panggilan darurat malam hari dengan respon cepat dan tanggap.',
      keywords: ['24 jam', 'darurat', 'malam', 'libur', 'minggu', 'kapan saja', 'siaga', 'emergency'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 8,
      category: 'Layanan',
      question: 'Bagaimana cara memesan layanan sedot WC PT Kusuma Gemilang Raya?',
      badge: 'Respon Cepat',
      answer: 'Cukup hubungi WhatsApp kami di 0896-7506-4916 atau klik tombol pemesanan, sampaikan alamat lengkap dan keluhan Anda, tentukan jadwal kedatangan, dan armada terdekat kami akan segera meluncur.',
      keywords: ['pesan', 'order', 'booking', 'cara', 'hubungi', 'wa', 'whatsapp'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 9,
      category: 'Area',
      question: 'Apakah melayani seluruh Kota Bekasi dan Kabupaten Bekasi?',
      badge: 'Cakupan Lengkap',
      answer: 'Ya, PT Kusuma Gemilang Raya melayani seluruh 12 kecamatan di Kota Bekasi dan 23 kecamatan di Kabupaten Bekasi, termasuk Tambun, Cibitung, Cikarang, Babelan, Mustika Jaya, Pondok Gede, Jatiasih, hingga Tarumajaya.',
      keywords: ['kota', 'kabupaten', 'wilayah', 'area', 'cakupan', 'bekasi', 'tambun', 'babelan'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 10,
      category: 'Area',
      question: 'Apakah melayani area Cikarang dan kawasan industri?',
      badge: 'Pos Cikarang Siaga',
      answer: 'Ya, kami memiliki pos operasional di Cikarang yang melayani Cikarang Barat, Timur, Utara, Selatan, Pusat serta seluruh kawasan industri MM2100, Jababeka I-VI, EJIP, GIIC, BIIE Hyundai, dan Delta Silicon.',
      keywords: ['cikarang', 'industri', 'jababeka', 'ejip', 'mm2100', 'deltamas', 'giic', 'hyundai'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 11,
      category: 'Area',
      question: 'Bagaimana jika lokasi rumah berada di dalam gang sempit pemukiman padat?',
      badge: 'Armada Gang Sempit',
      answer: 'Kami mengoperasikan armada tangki engkel compact khusus jalan lingkungan yang sempit serta sambungan selang vakum bertekanan tinggi hingga lebih dari 100-150 meter. Kami dapat melayani pemukiman padat tanpa memblokir jalan.',
      keywords: ['gang sempit', 'gang kecil', 'padat', 'selang panjang', 'truk engkel', 'akses', 'jalan sempit'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: 12,
      category: 'Teknis',
      question: 'Berapa lama estimasi durasi proses penyedotan septic tank?',
      badge: 'Durasi Cepat',
      answer: 'Penyedotan septic tank standar rumah tangga (volume 2–4 m³) rata-rata memakan waktu 30 hingga 60 menit dengan mesin vakum rotary bertenaga tinggi, tergantung kepadatan lumpur dan jarak selang.',
      keywords: ['lama', 'waktu', 'durasi', 'berapa lama', 'menit', 'kecepatan', 'proses'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2h4" />
        </svg>
      ),
    },
    {
      id: 13,
      category: 'Teknis',
      question: 'Bagaimana prosedur teknis pengerjaan dan standar keselamatan (K3) di lapangan?',
      badge: 'K3 & SOP Higienis',
      answer: 'Teknisi kami menerapkan SOP keselamatan dan kebersihan ketat: menggunakan APD lengkap (helm, masker respirator, sarung tangan heavy-duty, dan safety boots). Setelah penyedotan selesai, lubang ditutup rapat kembali dan disemprot disinfektan pembasmi kuman.',
      keywords: ['k3', 'prosedur', 'keamanan', 'apd', 'disinfektan', 'higienis', 'sop', 'standar'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 14,
      category: 'Teknis',
      question: 'Apa perbedaan septic tank penuh dengan kloset mampet biasa?',
      badge: 'Diagnosa Masalah',
      answer: 'Septic tank penuh ditandai dengan air kloset meluap atau menyusut sangat lambat secara merata di seluruh kamar mandi rumah serta tercium aroma gas dari pipa ventilasi. Sedangkan sumbatan mekanis biasanya terjadi mendadak di leher angsa satu kloset akibat tisu atau benda asing.',
      keywords: ['septic tank penuh', 'ventilasi', 'tanda penuh', 'perbedaan', 'diagnosa', 'tersumbat', 'kloset', 'leher angsa'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
  ];

  const filteredGeneralFaqItems = generalFaqItems.filter((item) => {
    const matchCategory =
      generalFaqCategory === 'Semua' || item.category === generalFaqCategory;
    if (!matchCategory) return false;
    if (generalFaqSearch.trim() === '') return true;
    const q = generalFaqSearch.toLowerCase().trim();
    return (
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  // General FAQ keyword match calculations & highlighting stats
  const generalFaqMatchMap = React.useMemo(() => {
    const map = new Map<number, { total: number; questionMatches: number; answerMatches: number }>();
    if (!generalFaqSearch.trim()) return map;
    for (const item of filteredGeneralFaqItems) {
      const stats = getFaqMatchStats({ question: item.question, answer: item.answer }, generalFaqSearch);
      map.set(item.id, stats);
    }
    return map;
  }, [filteredGeneralFaqItems, generalFaqSearch]);

  const totalGeneralFaqMatches = React.useMemo(() => {
    let sum = 0;
    generalFaqMatchMap.forEach((stats) => {
      sum += stats.total;
    });
    return sum;
  }, [generalFaqMatchMap]);

  const itemsWithMatchesCount = React.useMemo(() => {
    let count = 0;
    generalFaqMatchMap.forEach((stats) => {
      if (stats.total > 0) count++;
    });
    return count;
  }, [generalFaqMatchMap]);

  // Auto-expand general FAQ items when searching so highlighted answers are immediately visible
  useEffect(() => {
    if (generalFaqSearch.trim()) {
      const matchingIds = filteredGeneralFaqItems.map((item) => item.id);
      setOpenedGeneralFaqIds(matchingIds);
      setIsAllGeneralFaqExpanded(true);
    } else {
      setOpenedGeneralFaqIds([]);
      setIsAllGeneralFaqExpanded(false);
    }
  }, [generalFaqSearch]);

  const handleToggleAllGeneralFaq = () => {
    if (isAllGeneralFaqExpanded) {
      setOpenedGeneralFaqIds([]);
      setIsAllGeneralFaqExpanded(false);
    } else {
      const allIds = filteredGeneralFaqItems.map((item) => item.id);
      setOpenedGeneralFaqIds(allIds);
      setIsAllGeneralFaqExpanded(true);
    }
  };

  const handleToggleSingleGeneralFaq = (id: number) => {
    setOpenedGeneralFaqIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Subtle shake animation trigger when General FAQ search keyword yields zero results
  useEffect(() => {
    if (generalFaqSearch.trim() !== '' && filteredGeneralFaqItems.length === 0) {
      setIsGeneralFaqShaking(true);
      setGeneralFaqShakeKey((prev) => prev + 1);
      const timer = setTimeout(() => {
        setIsGeneralFaqShaking(false);
      }, 450);
      return () => clearTimeout(timer);
    } else {
      setIsGeneralFaqShaking(false);
    }
  }, [generalFaqSearch, generalFaqCategory, filteredGeneralFaqItems.length]);

  // Keyboard navigation for lightbox & article modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null);
        if (activeArticleModal !== null) setActiveArticleModal(null);
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredProjects.length : 0));
        }
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredProjects.length) % filteredProjects.length : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeArticleModal, filteredProjects.length]);

  // Auto-slide testimonial
  useEffect(() => {
    if (currentTestimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % currentTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentTestimonials.length]);

  // Chatbot auto-scroll
  useEffect(() => {
    if (isChatbotOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping, isChatbotOpen]);

  // 10-second Inactivity Detector for Newsletter Subscription Slide-in Popup
  useEffect(() => {
    // If dismissed in this session, already open, or already subscribed, skip
    if (isNewsletterPopupDismissed || isNewsletterSlideInOpen || slideInStatus === 'success') {
      return;
    }

    try {
      if (sessionStorage.getItem('kusuma_newsletter_popup_dismissed') === 'true') {
        setIsNewsletterPopupDismissed(true);
        return;
      }
    } catch {
      // ignore
    }

    let inactivityTimer: NodeJS.Timeout | null = null;

    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      inactivityTimer = setTimeout(() => {
        setIsNewsletterSlideInOpen(true);
      }, 10000); // 10 seconds of inactivity
    };

    // Listen to user interactions to detect activity and reset timer
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetInactivityTimer, { passive: true });
    });

    // Start 10-second timer
    resetInactivityTimer();

    return () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, resetInactivityTimer);
      });
    };
  }, [isNewsletterPopupDismissed, isNewsletterSlideInOpen, slideInStatus]);

  // Chatbot FAQ Response Logic
  const getFaqBotResponse = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes('biaya') || q.includes('tarif') || q.includes('harga') || q.includes('ongkos') || q.includes('berapa') || q.includes('blower') || q.includes('cleaning') || q.includes('lumpur') || q.includes('kalkulator')) {
      return {
        text: '💰 Estimasi Tarif Layanan Sedot WC & Pengurasan Lumpur Bekasi:\n• Limbah Black Water (Tinja) Non Manifes: Rp 700.000 / kubik\n• Limbah Grey Water (Lumpur/Lemak) Non Manifes: Rp 1.100.000 / kubik\n• Cleaning / Blower Lumpur Non Manifes: Rp 1.100.000 / kubik\n• Limbah Black Water dengan Manifes IPLT: Rp 1.100.000 / kubik\n• Limbah Grey Water dengan Manifes IPLT: Rp 1.500.000 / kubik\n• Cleaning / Blower Lumpur dengan Manifes IPLT: Rp 1.500.000 / kubik\n\nBiaya transparan tanpa biaya siluman. Anda juga bisa menghitung estimasi otomatis via kalkulator biaya kami.',
        actionLabel: 'Hitung di Kalkulator Biaya',
        actionUrl: '#kalkulator',
        options: [
          'Apakah melayani seluruh Bekasi?',
          'Berapa lama teknisi tiba ke lokasi?',
          'Cara pesan / booking armada sekarang',
        ],
      };
    }

    if (q.includes('seluruh') || q.includes('area') || q.includes('daerah') || q.includes('cikarang') || q.includes('tambun') || q.includes('bekasi') || q.includes('jangkauan') || q.includes('lokasi')) {
      return {
        text: '📍 Cakupan Wilayah Operasional:\nYa, kami melayani 100% wilayah:\n• Kota Bekasi (13 Kecamatan: Bekasi Barat, Timur, Selatan, Utara, Jatiasih, Medan Satria, Pondok Gede, Rawalumbu, dll.)\n• Kabupaten Bekasi (24 Kecamatan: Cikarang Raya, Tambun Selatan/Utara, Cibitung, Babelan, Tarumajaya, Setu, dll.)\n\nKami menyiagakan 3 titik pool armada agar teknisi cepat sampai!',
        actionLabel: 'Lihat Peta Lokasi & Pool',
        actionUrl: '#peta',
        options: [
          'Berapa lama teknisi tiba ke lokasi?',
          'Berapa biaya / tarif sedot WC?',
          'Cara pesan / booking armada sekarang',
        ],
      };
    }

    if (q.includes('lama') || q.includes('waktu') || q.includes('kapan') || q.includes('tiba') || q.includes('sampai') || q.includes('cepat') || q.includes('jam')) {
      return {
        text: '⏱️ Waktu Kedatangan Teknisi:\nArmada terdekat biasanya tiba di lokasi Anda dalam kurun waktu 15 s/d 30 menit setelah konfirmasi pemesanan.\n\nLayanan kami siaga 24 Jam Nonstop setiap hari, termasuk hari Minggu dan hari libur nasional!',
        actionLabel: 'Panggil Armada Sekarang via WA',
        actionUrl: 'https://wa.me/6289675064916?text=Halo%20Admin,%20saya%20butuh%20armada%20sedot%20WC%20cepat%20ke%20lokasi%20saya.',
        options: [
          'Berapa biaya / tarif sedot WC?',
          'Cara pesan / booking armada sekarang',
        ],
      };
    }

    if (q.includes('mampet') || q.includes('tersumbat') || q.includes('pipa') || q.includes('wastafel') || q.includes('kloset') || q.includes('got')) {
      return {
        text: '🛠️ Layanan Saluran Pipa Mampet:\nTeknisi kami menggunakan peralatan modern seperti mesin spiral rotary spring dan mesin hydro-jetting bertekanan tinggi.\n\nSumbatan lemak beku, daki sabun, atau rambut dihancurkan tuntas dari dalam pipa TANPA perlu membongkar keramik lantai rumah Anda!',
        actionLabel: 'Konsultasi Saluran Mampet via WA',
        actionUrl: 'https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20konsultasi%20saluran%20pipa%20mampet.',
        options: [
          'Berapa biaya / tarif sedot WC?',
          'Cara pesan / booking armada sekarang',
        ],
      };
    }

    if (q.includes('sertifikasi') || q.includes('kemitraan') || q.includes('k3') || q.includes('smk3') || q.includes('iso') || q.includes('asosiasi') || q.includes('appli') || q.includes('klhk') || q.includes('dlh') || q.includes('mitra')) {
      return {
        text: '🏅 Sertifikasi & Kemitraan Resmi PT Kusuma Gemilang Raya:\n• Regulator: Kerjasama resmi IPLT DLH Kota & Kab. Bekasi & Rekomendasi KLHK RI\n• K3 Keselamatan: Sertifikasi SMK3 Kemenaker RI PP No. 50/2012 & Lisensi Ruang Terbatas (Confined Space)\n• Standar Internasional: ISO 14001:2015 (Lingkungan) & ISO 45001:2018 (K3)\n• Asosiasi: Anggota resmi APPLI (Asosiasi Pengusaha Pengelolaan Limbah Indonesia)\n• Kawasan Industri: Vendor Rekanan di MM2100, Jababeka, GIIC, EJIP, Delta Silicon\n\nSeluruh salinan dokumen sertifikasi siap dilampirkan untuk audit vendor B2B.',
        actionLabel: 'Lihat Sertifikasi & Kemitraan',
        actionUrl: '#sertifikasi',
        options: [
          'Prosedur penawaran resmi (Quotation) untuk PT?',
          'Apakah tersedia Faktur Pajak PPN & Manifest IPLT?',
          'Layanan sedot limbah STP & IPAL Pabrik?',
        ],
      };
    }

    if (q.includes('iplt') || q.includes('legal') || q.includes('izin') || q.includes('resmi') || q.includes('limbah') || q.includes('manifest') || q.includes('buang')) {
      return {
        text: '📜 Jaminan Legalitas Pembuangan:\nPT Kusuma Gemilang Raya berbadan hukum resmi dengan NIB KBLI 37011, Sertifikat Standar, dan SPPKP.\n\nSeluruh muatan limbah diangkut dengan truk tangki tertutup dan dibuang langsung ke Instalasi Pengolahan Lumpur Tinja (IPLT) resmi pemerintah dengan bukti dokumen Manifest sah.',
        actionLabel: 'Lihat Legalitas Perusahaan',
        actionUrl: '#kontak',
        options: [
          'Cara pesan / booking armada sekarang',
          'Apakah melayani seluruh Bekasi?',
        ],
      };
    }

    if (q.includes('pesan') || q.includes('order') || q.includes('booking') || q.includes('hubungi') || q.includes('kontak') || q.includes('telepon') || q.includes('nomor') || q.includes('wa')) {
      return {
        text: '📞 Cara Pesan / Booking Sangat Praktis:\n1. Kirimkan alamat lengkap Anda via WhatsApp.\n2. Sebutkan kendala (sedot WC / septic tank / saluran mampet / STP).\n3. Tim kami mengonfirmasi harga transparan dan langsung mengirimkan armada terdekat ke lokasi Anda.',
        actionLabel: 'Chat WhatsApp Dispatcher',
        actionUrl: 'https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20booking%20layanan%20sedot%20WC%20sekarang.',
        options: [
          'Berapa biaya / tarif sedot WC?',
          'Berapa lama teknisi tiba ke lokasi?',
        ],
      };
    }

    // B2B FAQ: Audit Vendor
    if (q.includes('audit') || q.includes('vendor') || q.includes('prakualifikasi') || q.includes('pra-kualifikasi') || q.includes('csms') || q.includes('rekanan') || q.includes('syarat pt') || q.includes('dokumen pt')) {
      return {
        text: '🏢 Persyaratan & Dokumen Audit Vendor B2B PT Kusuma Gemilang Raya:\n1. Legalitas Lengkap: NIB KBLI 37011, Sertifikat Standar OSS RBA, SPPKP, NPWP PT, Akta & SK Kemenkumham, Rekening Giro Perusahaan resmi a.n PT Kusuma Gemilang Raya.\n2. Standar K3/CSMS: Teknisi bersertifikat Confined Space Entry Kemenaker, APD Level 3, JSA/HIRADC, SOP Tanggap Darurat & 4-gas detector.\n3. Kelaikan Armada: KIR Dishub aktif, SIM B2 Umum, kalibrasi vacuum blower.\n4. Siap registrasi formulir rekanan e-procurement (SAP, Ariba) & site verification.',
        actionLabel: 'Buka FAQ B2B: Persyaratan Audit',
        actionUrl: '#faq-b2b',
        options: [
          'Bagaimana alur dan proses BAST?',
          'Kebijakan e-Faktur PPN & termin pembayaran (TOP)?',
          'Ajukan RFP / Quotation Resmi',
        ],
      };
    }

    // B2B FAQ: BAST (Berita Acara Serah Terima)
    if (q.includes('bast') || q.includes('berita acara') || q.includes('serah terima') || q.includes('joint inspection') || q.includes('laporan pekerjaan')) {
      return {
        text: '📋 Alur & Proses Penerbitan BAST (Berita Acara Serah Terima):\n1. Joint Inspection Lapangan: Pengecekan bersama antara supervisor PT Kusuma dan tim GA/HSE/Facilities pabrik di lokasi.\n2. Verifikasi Volume Riil: Pengukuran volume lumpur yang disedot (m³ / rit) disaksikan dan diparaf bersama.\n3. Bukti Foto GPS: Dokumentasi foto before-after ber-watermark koordinat GPS akurat & tanggal-jam.\n4. Dokumen BAST Sah: Diterbitkan rangkap asli berstempel basah PT dan ditandatangani kedua pihak sebagai lampiran wajib penagihan invoice.',
        actionLabel: 'Buka FAQ B2B: Alur BAST',
        actionUrl: '#faq-b2b',
        options: [
          'Kebijakan e-Faktur PPN & termin pembayaran (TOP)?',
          'Persyaratan audit vendor B2B?',
          'Apakah tersedia Manifest IPLT resmi?',
        ],
      };
    }

    // B2B FAQ: e-Faktur PPN, TOP & Pembayaran
    if (q.includes('efaktur') || q.includes('e-faktur') || q.includes('faktur pajak') || q.includes('ppn') || q.includes('pajak') || q.includes('top') || q.includes('termin') || q.includes('tempo') || q.includes('rekening giro') || q.includes('tagihan pt') || q.includes('invoicing')) {
      return {
        text: '💰 Kebijakan Pembayaran, Termin (TOP) & e-Faktur PPN:\n1. Status PKP Resmi: Setiap tagihan B2B diterbitkan Faktur Pajak Elektronik (e-Faktur PPN 11%) sah dari DJP lengkap dengan QR Code validasi.\n2. Termin Pembayaran (TOP): Mendukung Terms of Payment (TOP) 14 hingga 30 hari kalender dengan sistem Purchase Order (PO) bagi rekanan korporasi terverifikasi.\n3. Paket Penagihan Lengkap: Invoice Asli bermeterai, BAST bertanda tangan, Surat Jalan, lembar e-Faktur PPN, dan bukti setor Manifest IPLT.\n4. Rekening Giro PT: Seluruh transfer bank hanya ke Rekening Giro resmi a.n PT Kusuma Gemilang Raya (Bank Mandiri / BCA), tidak pernah rekening pribadi.',
        actionLabel: 'Buka FAQ B2B: Pembayaran & e-Faktur',
        actionUrl: '#faq-b2b',
        options: [
          'Bagaimana alur dan proses BAST?',
          'Persyaratan audit vendor B2B?',
          'Ajukan RFP / Quotation Resmi',
        ],
      };
    }

    if (q.includes('pt') || q.includes('perusahaan') || q.includes('quotation') || q.includes('penawaran') || q.includes('rfp') || q.includes('kontrak') || q.includes('sla') || q.includes('tender')) {
      return {
        text: '🏢 Layanan & Penawaran Resmi B2B (PT / Perusahaan):\n1. Tim kami siap melakukan survei lokasi (Free Survey) di kawasan industri Anda.\n2. Menerbitkan Surat Penawaran Resmi (Quotation ber-kop surat PT Kusuma Gemilang Raya).\n3. Mendukung sistem Purchase Order (PO), Invoice Termin, Faktur Pajak PPN e-Faktur, Berita Acara (BAST), dan Manifest IPLT sah.\n4. Tersedia kontrak SLA berkala bulanan/triwulan untuk pabrik & gedung.',
        actionLabel: 'Isi Formulir Penawaran B2B (RFP)',
        actionUrl: '#quotation',
        options: [
          'Apakah tersedia Faktur Pajak PPN & Manifest IPLT?',
          'Layanan sedot limbah STP & IPAL Pabrik?',
          'Kontrak rutin (SLA) kawasan industri Bekasi?',
        ],
      };
    }

    if (q.includes('stp') || q.includes('ipal') || q.includes('sludge') || q.includes('kolam') || q.includes('ekualisasi')) {
      return {
        text: '🏭 Penanganan Limbah STP & IPAL Industri:\nKami melayani pengurasan bak ekualisasi, sedimentasi, lumpur aktif (sludge pond), dan grease trap sentral di MM2100, Jababeka, GIIC, EJIP, Delta Silicon, dsb.\n\nDilengkapi armada vacuum bertekanan tinggi 4.000L - 10.000L dan teknisi bersertifikat dengan standar APD K3 lengkap.',
        actionLabel: 'Konsultasi STP Industri via WA',
        actionUrl: 'https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20kami%20ingin%20konsultasi%20pengurasan%20STP%20/%20IPAL%20Pabrik.',
        options: [
          'Prosedur penawaran resmi (Quotation) untuk PT?',
          'Apakah tersedia Faktur Pajak PPN & Manifest IPLT?',
          'Berapa kapasitas tangki armada industri?',
        ],
      };
    }

    if (q.includes('kapasitas') || q.includes('tangki') || q.includes('armada') || q.includes('rit')) {
      return {
        text: '🚛 Kapasitas Armada Tangki Industri:\nPT Kusuma Gemilang Raya memiliki 25+ armada truk tangki vakum dengan variasi kapasitas 4.000 Liter (4 m³) hingga 10.000 Liter (10 m³).\n\nDilengkapi selang spiral panjang hingga 100+ meter dan sistem pompa blower berdaya hisap tinggi untuk limbah lumpur pekat.',
        actionLabel: 'Minta Penawaran Armada via WA',
        actionUrl: 'https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20tahu%20ketersediaan%20armada%20tangki%20kapasitas%20besar.',
        options: [
          'Prosedur penawaran resmi (Quotation) untuk PT?',
          'Layanan sedot limbah STP & IPAL Pabrik?',
        ],
      };
    }

    if (q.includes('testimoni') || q.includes('review') || q.includes('ulasan') || q.includes('klien') || q.includes('kepuasan')) {
      return {
        text: '⭐ Testimoni & Kepercayaan Klien:\nPT Kusuma Gemilang Raya telah dipercaya oleh berbagai perusahaan dan fasilitas industri di Bekasi dengan jaminan 100% legalitas IPLT resmi, kepatuhan K3, dan manifest resmi.',
        actionLabel: 'Lihat Testimoni Klien',
        actionUrl: '#testimoni',
        options: [
          'Prosedur penawaran resmi (Quotation) untuk PT?',
          'Layanan sedot limbah STP & IPAL Pabrik?',
        ],
      };
    }

    if (q.includes('statistik') || q.includes('subscriber') || q.includes('total email') || q.includes('admin') || q.includes('database email') || q.includes('monitoring')) {
      return {
        text: '📊 Ringkasan Statistik Subscriber Newsletter:\n• Total Email Terdaftar: 1.430+ Subscriber Aktif\n• Segmentasi B2B / Komersial: 64% (Pabrik, Kawasan Industri MM2100/Jababeka, RS, Mall)\n• Segmentasi Residensial: 36% (Hunian & Perumahan di Bekasi)\n• Deliverability: 99.4% Valid & Bebas Spam\n• Pertumbuhan Bulanan: +18.4% MoM\n\nAnda dapat memantau performa pertumbuhan subscriber dan log pendaftar secara live di dashboard monitoring!',
        actionLabel: 'Buka Statistik & Dashboard Admin',
        actionUrl: '#statistik-newsletter',
        options: [
          'Formulir Berlangganan Newsletter',
          'Prosedur penawaran resmi (Quotation) untuk PT?',
        ],
      };
    }

    if (q.includes('newsletter') || q.includes('buletin') || q.includes('langganan') || q.includes('email') || q.includes('berlangganan')) {
      return {
        text: '✉️ Buletin & Tips Sanitasi Berkala:\nAnda dapat berlangganan buletin gratis kami untuk menerima update artikel perawatan septic tank, panduan pipa bebas mampet, serta voucher diskon Rp 50.000 langsung ke email Anda.',
        actionLabel: 'Formulir Berlangganan Newsletter',
        actionUrl: '#newsletter',
        options: [
          'Berapa biaya / tarif sedot WC?',
          'Cara pesan / booking armada sekarang',
        ],
      };
    }

    return {
      text: 'Terima kasih atas pertanyaannya! Untuk konsultasi mendalam atau kasus sanitasi khusus di lokasi Anda, tim dispatcher kami siap melayani Anda secara langsung via WhatsApp 24 jam.',
      actionLabel: 'Chat WhatsApp Langsung',
      actionUrl: `https://wa.me/6289675064916?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya ingin tanya: "${query}"`)}`,
      options: [
        'Berapa biaya / tarif sedot WC?',
        'Apakah melayani seluruh Bekasi?',
        'Berapa lama teknisi tiba ke lokasi?',
      ],
    };
  };

  const handleSendChatMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: 'u_' + Date.now(),
      sender: 'user' as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInputText('');
    setIsBotTyping(true);

    setTimeout(() => {
      const responseData = getFaqBotResponse(textToSend);
      const botMsg = {
        id: 'b_' + Date.now(),
        sender: 'bot' as const,
        text: responseData.text,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        actionLabel: responseData.actionLabel,
        actionUrl: responseData.actionUrl,
        options: responseData.options,
      };
      setChatMessages((prev) => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 450);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newsletterEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setNewsletterStatus('error');
      setNewsletterMsg('Mohon masukkan alamat email yang valid.');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterMsg(`Terima kasih! Email ${cleanEmail} telah terdaftar. Kami telah mengirimkan panduan sanitasi bebas mampet ke kotak masuk Anda.`);
      
      const newSubscriber: SubscriberRecord = {
        id: 'sub-' + Date.now(),
        email: cleanEmail,
        name: newsletterName.trim() || 'Pelanggan Baru',
        company: newsletterInterest === 'komersial' ? (newsletterName.trim() || 'Perusahaan Mitra B2B') : 'Residensial Bekasi',
        interest: newsletterInterest,
        date: new Date().toISOString(),
        formattedDate: 'Baru saja',
        status: 'Terkonfirmasi',
        source: 'Formulir Web Newsletter',
      };

      setSubscribersList((prev) => {
        const nextList = [newSubscriber, ...prev];
        try {
          localStorage.setItem('kusuma_subscribers_extended', JSON.stringify(nextList));
        } catch {
          // ignore
        }
        return nextList;
      });

      try {
        const stored = JSON.parse(localStorage.getItem('kusuma_subscribers') || '[]');
        stored.push({
          email: cleanEmail,
          name: newsletterName.trim(),
          interest: newsletterInterest,
          date: new Date().toISOString(),
        });
        localStorage.setItem('kusuma_subscribers', JSON.stringify(stored));
      } catch {
        // LocalStorage fallback
      }
      triggerToast(`Email ${cleanEmail} berhasil didaftarkan dan data ringkasan statistik terupdate!`);
    }, 500);
  };

  const handleSlideInNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = slideInEmail.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setSlideInStatus('error');
      setSlideInMsg('Mohon masukkan alamat email yang valid.');
      return;
    }

    setSlideInStatus('loading');
    setTimeout(() => {
      setSlideInStatus('success');
      setSlideInMsg(`Terima kasih! Panduan sanitasi & tips perawatan telah kami kirimkan ke ${cleanEmail}.`);

      const newSubscriber: SubscriberRecord = {
        id: 'sub-' + Date.now(),
        email: cleanEmail,
        name: slideInName.trim() || 'Pembaca Tips Sanitasi',
        company: slideInInterest === 'komersial' ? (slideInName.trim() || 'Perusahaan Mitra B2B') : 'Residensial Bekasi',
        interest: slideInInterest,
        date: new Date().toISOString(),
        formattedDate: 'Baru saja',
        status: 'Terkonfirmasi',
        source: 'Popup Tips Sanitasi (Inactivity 10s)',
      };

      setSubscribersList((prev) => {
        const nextList = [newSubscriber, ...prev];
        try {
          localStorage.setItem('kusuma_subscribers_extended', JSON.stringify(nextList));
        } catch {
          // ignore
        }
        return nextList;
      });

      try {
        const stored = JSON.parse(localStorage.getItem('kusuma_subscribers') || '[]');
        stored.push({
          email: cleanEmail,
          name: slideInName.trim(),
          interest: slideInInterest,
          date: new Date().toISOString(),
        });
        localStorage.setItem('kusuma_subscribers', JSON.stringify(stored));
        sessionStorage.setItem('kusuma_newsletter_popup_dismissed', 'true');
      } catch {
        // ignore
      }

      triggerToast(`🎉 Selamat datang! Email ${cleanEmail} telah terdaftar untuk tips sanitasi berkala.`);

      setTimeout(() => {
        setIsNewsletterSlideInOpen(false);
      }, 4500);
    }, 500);
  };

  const handleDismissSlideInPopup = () => {
    setIsNewsletterSlideInOpen(false);
    setIsNewsletterPopupDismissed(true);
    try {
      sessionStorage.setItem('kusuma_newsletter_popup_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleExportSubscribersCsv = () => {
    const headers = ['ID', 'Email', 'Nama PIC / Pemohon', 'Perusahaan / Lokasi', 'Segmentasi', 'Tanggal Registrasi', 'Status', 'Sumber'];
    const rows = subscribersList.map((s) => [
      s.id,
      s.email,
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.company.replace(/"/g, '""')}"`,
      s.interest === 'komersial' ? 'Komersial / B2B' : 'Residensial',
      s.date,
      s.status,
      `"${s.source.replace(/"/g, '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `statistik_subscriber_pt_kusuma_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Data subscriber newsletter berhasil diekspor ke file CSV!');
  };

  interface SourceSummaryItem {
    source: string;
    count: number;
    percentage: number;
    commercialCount: number;
    residentialCount: number;
    icon: string;
    categoryDescription: string;
    performanceTag: string;
    performanceColor: string;
  }

  const getSourceIconAndMeta = (source: string) => {
    switch (source) {
      case 'Formulir Web B2B':
        return {
          icon: '🏢',
          desc: 'Formulir pendaftaran kemitraan korporasi & pabrik kawasan industri',
          tag: 'Kanal Utama B2B (Tier 1)',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'Tips Sanitasi Blog':
        return {
          icon: '✍️',
          desc: 'Artikel edukasi & tips pemeliharaan septic tank & IPAL',
          tag: 'Top Traffic Organik (SEO)',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'Portal Quotation RFP':
        return {
          icon: '📑',
          desc: 'Permintaan penawaran harga resmi (RFP/SPK) & BAST',
          tag: 'High Conversion Leads',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      case 'Kalkulator Biaya':
        return {
          icon: '🧮',
          desc: 'Simulasi estimasi tarif pipa & sedot limbah mandiri',
          tag: 'Interaktif / Direct User',
          color: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'Formulir Web Newsletter':
        return {
          icon: '📩',
          desc: 'Widget subscription buletin berkala & edukasi bulanan',
          tag: 'Retensi & CRM Nurturing',
          color: 'bg-cyan/10 text-cyan-dark border-cyan/30',
        };
      case 'Simulasi Live Monitoring':
        return {
          icon: '⚡',
          desc: 'Pengujian data real-time dashboard sistem & evaluasi',
          tag: 'Internal Sandbox / Audit',
          color: 'bg-gray-100 text-gray-700 border-gray-200',
        };
      default:
        return {
          icon: '🌐',
          desc: 'Kanal rujukan eksternal & formulir landing page',
          tag: 'Kanal Aktif',
          color: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const sourceSummaryList = useMemo<SourceSummaryItem[]>(() => {
    const totalCount = subscribersList.length;
    if (totalCount === 0) return [];

    const map: Record<
      string,
      {
        count: number;
        commercial: number;
        residential: number;
      }
    > = {};

    subscribersList.forEach((sub) => {
      const src = sub.source || 'Lainnya / Langsung';
      if (!map[src]) {
        map[src] = { count: 0, commercial: 0, residential: 0 };
      }
      map[src].count += 1;
      if (sub.interest === 'komersial') {
        map[src].commercial += 1;
      } else {
        map[src].residential += 1;
      }
    });

    return Object.entries(map)
      .map(([source, data]) => {
        const meta = getSourceIconAndMeta(source);
        const percentage = totalCount > 0 ? (data.count / totalCount) * 100 : 0;
        return {
          source,
          count: data.count,
          percentage,
          commercialCount: data.commercial,
          residentialCount: data.residential,
          icon: meta.icon,
          categoryDescription: meta.desc,
          performanceTag: meta.tag,
          performanceColor: meta.color,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [subscribersList]);

  const availableSources = useMemo(() => {
    const sourcesSet = new Set<string>();
    subscribersList.forEach((s) => {
      if (s.source) sourcesSet.add(s.source);
    });
    return Array.from(sourcesSet);
  }, [subscribersList]);

  const handleExportSourceSummaryCsv = () => {
    const headers = [
      'Sumber Akuisisi / Channel',
      'Total Subscriber',
      'Porsi Kontribusi (%)',
      'Porsi Komersial / PT',
      'Porsi Residensial',
      'Deskripsi Kanal',
      'Kategori & Kinerja Performa',
    ];
    const rows = sourceSummaryList.map((item) => [
      `"${item.source.replace(/"/g, '""')}"`,
      item.count,
      `${item.percentage.toFixed(1)}%`,
      item.commercialCount,
      item.residentialCount,
      `"${item.categoryDescription.replace(/"/g, '""')}"`,
      `"${item.performanceTag.replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `kinerja_kanal_pemasaran_subscriber_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('📊 CSV Ringkasan Kinerja Kanal Pemasaran berhasil diekspor!');
  };

  const handleAddSimulationSubscriber = () => {
    const samples = [
      {
        email: `ga.facility@toyota-${Math.floor(100 + Math.random() * 900)}.co.id`,
        name: 'Aris Munandar',
        company: 'PT Toyota Tsusho MM2100',
        interest: 'komersial' as const,
      },
      {
        email: `hse.plant@unilever-${Math.floor(100 + Math.random() * 900)}.com`,
        name: 'Siti Rahmawati',
        company: 'PT Unilever Indonesia Cikarang',
        interest: 'komersial' as const,
      },
      {
        email: `budi.wijaya.${Math.floor(10 + Math.random() * 90)}@gmail.com`,
        name: 'Budi Wijaya',
        company: 'Kemang Pratama 3 Blok AL',
        interest: 'residensial' as const,
      },
      {
        email: `purchasing@omron-${Math.floor(100 + Math.random() * 900)}.co.id`,
        name: 'Teguh Prasetyo',
        company: 'PT Omron Manufacturing EJIP',
        interest: 'komersial' as const,
      },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    const newRecord: SubscriberRecord = {
      id: 'sub-' + Date.now(),
      email: picked.email,
      name: picked.name,
      company: picked.company,
      interest: picked.interest,
      date: new Date().toISOString(),
      formattedDate: 'Baru saja',
      status: 'Terkonfirmasi',
      source: 'Simulasi Live Monitoring',
    };
    const updated = [newRecord, ...subscribersList];
    setSubscribersList(updated);
    try {
      localStorage.setItem('kusuma_subscribers_extended', JSON.stringify(updated));
    } catch {}
    triggerToast(`+1 Subscriber Simulasi Ditambahkan: ${picked.name} (${picked.email})`);
  };

  const handleResetSubscribersDemo = () => {
    setSubscribersList(initialSeedSubscribers);
    try {
      localStorage.removeItem('kusuma_subscribers_extended');
    } catch {}
    triggerToast('Data subscriber dikembalikan ke default data terverifikasi.');
  };

  const formatEmailDisplay = (email: string) => {
    if (!isMaskEmail) return email;
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [user, domain] = parts;
    const masked = user.length > 3 ? user.slice(0, 2) + '***' + user.slice(-1) : user.slice(0, 1) + '***';
    return `${masked}@${domain}`;
  };

  const handleResetNewsletter = () => {
    setNewsletterStatus('idle');
    setNewsletterEmail('');
    setNewsletterName('');
    setNewsletterMsg('');
  };

  // Handler Permintaan Penawaran B2B (RFP Quotation PT)
  const handleRfpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfpCompanyName.trim() || !rfpPhone.trim()) {
      return;
    }
    setRfpStatus('loading');
    setTimeout(() => {
      setRfpStatus('success');
      try {
        const stored = JSON.parse(localStorage.getItem('kusuma_rfp_requests') || '[]');
        stored.push({
          company: rfpCompanyName.trim(),
          pic: rfpPicName.trim(),
          role: rfpPicRole,
          phone: rfpPhone.trim(),
          email: rfpEmail.trim(),
          location: rfpLocation,
          service: rfpServiceType,
          volume: rfpVolume,
          taxInvoice: rfpNeedTaxInvoice,
          date: new Date().toISOString(),
        });
        localStorage.setItem('kusuma_rfp_requests', JSON.stringify(stored));
      } catch {
        // ignore
      }
    }, 600);
  };

  const handleResetRfp = () => {
    setRfpStatus('idle');
    setRfpCompanyName('');
    setRfpPicName('');
    setRfpPhone('');
    setRfpEmail('');
  };

  const getRfpWaLink = () => {
    const text = `*PERMINTAAN PENAWARAN RESMI (RFP / QUOTATION B2B)*\n\n` +
      `🏢 *Perusahaan:* ${rfpCompanyName || 'PT / Perusahaan'}\n` +
      `👤 *PIC / Jabatan:* ${rfpPicName || '-'} (${rfpPicRole})\n` +
      `📞 *Kontak:* ${rfpPhone || '-'}\n` +
      `✉️ *Email:* ${rfpEmail || '-'}\n` +
      `📍 *Lokasi Pabrik / Gedung:* ${rfpLocation}\n` +
      `🛠️ *Jenis Layanan:* ${rfpServiceType}\n` +
      `📊 *Estimasi Volume:* ${rfpVolume}\n` +
      `📑 *Kebutuhan Faktur Pajak:* ${rfpNeedTaxInvoice ? 'Ya, Butuh Faktur Pajak PPN e-Faktur' : 'Non-Faktur'}\n\n` +
      `Mohon tim estimator PT Kusuma Gemilang Raya dapat mengirimkan Surat Penawaran Harga resmi (Quotation) dan informasi jadwal survei lapangan. Terima kasih.`;
    return `https://wa.me/6289675064916?text=${encodeURIComponent(text)}`;
  };

  const filteredSubscribers = subscribersList.filter((s) => {
    const matchCategory =
      subscriberCategoryFilter === 'Semua' || s.interest === subscriberCategoryFilter;
    const matchSource =
      subscriberSourceFilter === 'Semua' || s.source === subscriberSourceFilter;
    const query = subscriberSearch.toLowerCase().trim();
    const matchQuery =
      !query ||
      s.email.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.company.toLowerCase().includes(query) ||
      (s.source && s.source.toLowerCase().includes(query));
    return matchCategory && matchSource && matchQuery;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white text-navy font-sans antialiased selection:bg-cyan selection:text-white">
      {/* Floating Chatbot FAQ Launcher Button */}
      <div className="fixed bottom-24 right-6 z-50 flex items-center">
        {!isChatbotOpen && (
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 mr-2 rounded-full text-xs font-bold bg-white text-navy shadow-xl border border-gray-100 hover:bg-slate-50 transition animate-bounce cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
            Tanya CS Otomatis
          </button>
        )}
        <button
          id="faq-chatbot-btn"
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          aria-label="Tanya Chatbot FAQ Otomatis"
          className="relative bg-navy hover:bg-navy-light text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border-2 border-cyan/40 focus:outline-none cursor-pointer"
        >
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          {isChatbotOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chatbot FAQ Window */}
      {isChatbotOpen && (
        <div
          role="dialog"
          aria-label="Chatbot FAQ Otomatis"
          className="fixed bottom-24 right-3 sm:right-6 z-50 w-[94vw] sm:w-[380px] md:w-[410px] h-[530px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Chatbot Header */}
          <div className="bg-navy p-4 text-white flex items-center justify-between border-b border-navy-light shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={logoBekasiImg}
                  alt="Customer Support"
                  className="w-10 h-10 rounded-full object-cover border-2 border-cyan/40 bg-white"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-navy" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-tight">Customer Support PT Kusuma</span>
                <span className="text-[11px] text-cyan-light flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Online 24 Jam • Respon Otomatis
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setChatMessages(initialChatMessages)}
                title="Reset Percakapan"
                aria-label="Reset Percakapan"
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsChatbotOpen(false)}
                title="Tutup Chat"
                aria-label="Tutup Chat"
                className="p-1.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 text-xs sm:text-sm">
            <div className="text-center my-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-600">
                Layanan Pelanggan Sedot WC Bekasi
              </span>
            </div>

            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-orange text-white rounded-br-xs'
                      : 'bg-white text-navy border border-gray-100 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Optional Action CTA Link inside message */}
                  {msg.actionLabel && msg.actionUrl && (
                    <div className="mt-3 pt-2.5 border-t border-gray-100">
                      <a
                        href={msg.actionUrl}
                        target={msg.actionUrl.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        onClick={() => {
                          if (msg.actionUrl?.startsWith('#')) {
                            setIsChatbotOpen(false);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy hover:bg-navy-light text-cyan-light font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        <span>{msg.actionLabel}</span>
                        <span>→</span>
                      </a>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {msg.time}
                </span>

                {/* Quick Interactive Option Buttons */}
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleSendChatMessage(opt)}
                        className="text-left px-3 py-1.5 bg-white hover:bg-cyan/10 hover:border-cyan hover:text-cyan-dark text-navy font-medium text-xs rounded-xl border border-gray-200 shadow-xs transition cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Bot Typing Indicator */}
            {isBotTyping && (
              <div className="flex items-center space-x-1.5 bg-white p-3 rounded-2xl border border-gray-100 shadow-xs max-w-[90px]">
                <div className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}

            <div ref={chatMessagesEndRef} />
          </div>

          {/* Quick WA Handoff Top Bar */}
          <div className="bg-orange/10 px-3.5 py-2 border-t border-orange/20 flex items-center justify-between text-xs">
            <span className="text-gray-700 text-[11px] truncate">Butuh bicara langsung dengan dispatcher?</span>
            <a
              href="https://wa.me/6289675064916?text=Halo%20Admin%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20konsultasi%20layanan%20sedot%20WC%20di%20Bekasi."
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange font-bold text-[11px] hover:text-orange-dark whitespace-nowrap ml-2 flex items-center gap-0.5"
            >
              <span>Chat WhatsApp</span>
              <span>→</span>
            </a>
          </div>

          {/* Chatbot Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage(chatInputText);
            }}
            className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2"
          >
            <input
              type="text"
              value={chatInputText}
              onChange={(e) => setChatInputText(e.target.value)}
              placeholder="Ketik pertanyaan (cth: tarif, cikarang)..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-1 focus:ring-cyan outline-none text-xs sm:text-sm text-gray-700 bg-slate-50"
            />
            <button
              type="submit"
              disabled={!chatInputText.trim()}
              aria-label="Kirim Pesan"
              className="p-2.5 bg-navy hover:bg-navy-light disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition shadow-sm flex items-center justify-center cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <a
        id="wa-float"
        href={getDynamicWaLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp"
        className="fixed bottom-6 right-6 z-50 bg-orange hover:bg-orange-dark text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.629.78-.12.137-.24.151-.436.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.675-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.479 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>
      </a>

      {/* Back to Top Button */}
      <button
        id="back-to-top"
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        className={`fixed bottom-6 left-6 z-50 bg-navy hover:bg-navy-light text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          showBackToTop ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-5 pointer-events-none'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Top Corporate Announcement Ribbon */}
      <div className="bg-navy-dark text-gray-300 py-2 px-4 text-xs border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-cyan-light font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Vendor Resmi Sanitasi & Limbah Industri B2B Bekasi
            </span>
            <span className="text-gray-600">•</span>
            <span>NIB KBLI 37011 & SPPKP (Faktur Pajak PPN)</span>
            <span className="text-gray-600">•</span>
            <span>Manifest Resmi IPLT Pemda Bekasi</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] sm:text-xs">
            <a href="#quotation" className="text-orange hover:text-white font-bold transition flex items-center gap-1">
              <span>Minta Penawaran B2B (Quotation)</span>
              <span>→</span>
            </a>
            <span className="text-gray-600">•</span>
            <span className="text-gray-400">Siaga 24 Jam MM2100, Jababeka, GIIC, EJIP</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header id="header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm transition-all">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo Asli */}
            <a href="#" className="flex items-center space-x-3">
              <img
                src={logoBekasiImg}
                alt="Logo PT Kusuma Gemilang Raya"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover shadow-sm border border-gray-100"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-sm md:text-base text-navy">PT KUSUMA GEMILANG RAYA</span>
                <span className="text-[11px] text-cyan-dark font-medium hidden sm:block">Sanitasi & Pengolahan Limbah Industri B2B</span>
              </div>
            </a>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center space-x-4 xl:space-x-5">
              <li><a href="#hero" className="text-sm font-medium text-navy hover:text-cyan transition">Beranda</a></li>
              <li>
                <a href="#klien" className="text-sm font-bold text-navy hover:text-cyan transition flex items-center gap-1.5 group">
                  <span>Klien Rekanan PT</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">15+</span>
                </a>
              </li>
              <li><a href="#layanan" className="text-sm font-medium text-navy hover:text-cyan transition">Layanan Korporat</a></li>
              <li><a href="#spesialis" className="text-sm font-medium text-navy hover:text-cyan transition">Sektor Industri</a></li>
              <li><a href="#peta" className="text-sm font-medium text-navy hover:text-cyan transition">Kawasan & Pool</a></li>
              <li><a href="#legalitas" className="text-sm font-medium text-navy hover:text-cyan transition">Legalitas & IPLT</a></li>
              <li><a href="#legalitas-seo" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition">Tabel NIB & SEO</a></li>
              <li><a href="#sertifikasi" className="text-sm font-medium text-navy hover:text-cyan transition">Sertifikasi & Mitra</a></li>
              <li><a href="#faq-b2b" className="text-sm font-medium text-navy hover:text-cyan transition">FAQ B2B</a></li>
              <li><a href="#statistik-newsletter" className="text-sm font-medium text-navy hover:text-cyan transition">Statistik</a></li>
              <li><a href="#galeri" className="text-sm font-medium text-navy hover:text-cyan transition">Galeri Proyek</a></li>
              <li><a href="#quotation" className="text-sm font-bold text-orange hover:text-orange-dark transition">Penawaran PT (RFP)</a></li>
              <li><a href="#kontak" className="text-sm font-medium text-navy hover:text-cyan transition">Kontak</a></li>
            </ul>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2.5 xl:gap-3">
              {/* Floating Quick Quote Button for B2B RFP Lead Generation */}
              <button
                type="button"
                onClick={handleLaunchQuickQuote}
                className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange via-amber-500 to-orange text-white text-xs font-bold rounded-full hover:from-orange-dark hover:to-orange shadow-md hover:shadow-lg shadow-orange/30 border border-amber-300/50 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer overflow-hidden animate-pulse hover:animate-none"
                title="Buka Formulir Permintaan Penawaran Resmi PT (RFP B2B)"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-sm">⚡</span>
                  <span className="tracking-wide">Quick Quote</span>
                </span>
                <span className="hidden xl:inline-block px-1.5 py-0.5 rounded-full text-[9px] font-black bg-white/25 text-white uppercase tracking-wider">
                  RFP B2B
                </span>
              </button>

              <a
                href="#quotation"
                className="inline-flex items-center px-3.5 py-2 bg-navy text-white text-xs font-bold rounded-full hover:bg-navy-light transition shadow-sm border border-cyan/30"
              >
                Minta Quotation
              </a>
              <a
                id="wa-header"
                href={getDynamicWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3.5 py-2 bg-orange text-white text-xs font-bold rounded-full hover:bg-orange-dark transition shadow-md"
              >
                WhatsApp 24 Jam
              </a>
            </div>

            {/* Mobile Actions: Quick Quote Button + Hamburger Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={handleLaunchQuickQuote}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-orange to-amber-500 text-white shadow-sm border border-amber-300/50 cursor-pointer active:scale-95 transition"
                aria-label="Quick Quote RFP B2B"
              >
                <span>⚡</span>
                <span>Quick Quote</span>
              </button>

              <button
                id="menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-navy focus:outline-none"
                aria-label="Buka Menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden bg-white border-t border-gray-100 shadow-md">
            <ul className="flex flex-col px-4 py-4 space-y-3">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLaunchQuickQuote();
                  }}
                  className="w-full text-left py-2.5 px-3.5 rounded-xl bg-orange/10 border border-orange/30 text-orange font-bold flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span>⚡</span>
                    <span>Quick Quote (RFP B2B Perusahaan)</span>
                  </span>
                  <span className="text-[11px] bg-orange text-white px-2 py-0.5 rounded-full font-semibold">
                    Buka
                  </span>
                </button>
              </li>
              <li><a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Beranda</a></li>
              <li>
                <a href="#klien" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-navy flex items-center justify-between">
                  <span>Klien Rekanan PT</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">15 Perusahaan</span>
                </a>
              </li>
              <li><a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Layanan Korporat</a></li>
              <li><a href="#spesialis" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Sektor Industri</a></li>
              <li><a href="#peta" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Kawasan & Pool</a></li>
              <li><a href="#legalitas" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Legalitas & IPLT</a></li>
              <li><a href="#legalitas-seo" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-emerald-600">Legalitas & SEO Metadata</a></li>
              <li><a href="#sertifikasi" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Sertifikasi & Kemitraan</a></li>
              <li><a href="#faq-b2b" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-semibold text-cyan-dark">FAQ B2B & Korporat</a></li>
              <li><a href="#statistik-newsletter" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Statistik Newsletter</a></li>
              <li><a href="#quotation" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-bold text-orange">Minta Penawaran B2B (RFP)</a></li>
              <li><a href="#galeri" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Galeri Proyek</a></li>
              <li><a href="#kontak" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Hubungi Kami</a></li>
              <li>
                <a
                  id="wa-mobile-menu"
                  href={getDynamicWaLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-2 px-5 py-3 bg-orange text-white text-base font-semibold rounded-full"
                >
                  WhatsApp Dispatcher 24 Jam
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="bg-slate-50 py-12 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan-dark text-xs sm:text-sm font-bold mb-6">
                🏢 VENDOR RESMI SANITASI & LIMBAH CAIR INDUSTRI B2B BEKASI
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy leading-tight mb-4">
                JASA SEDOT WC, STP & LIMBAH INDUSTRI BEKASI
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-cyan mb-6">PT KUSUMA GEMILANG RAYA</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                Partner Pengelolaan Sanitasi & Pengurasan Limbah Cair Skala Besar Berizin Resmi untuk Pabrik, Kawasan Industri, Gedung Perkantoran, Rumah Sakit, Hotel, dan Perusahaan di Bekasi & Cikarang.
              </p>

              <ul className="grid sm:grid-cols-2 gap-3.5 mb-8 text-sm">
                <li className="flex items-start text-navy font-medium"><span className="text-cyan mr-2 font-bold">✓</span> Legalitas NIB KBLI 37011, SPPKP & Faktur Pajak PPN</li>
                <li className="flex items-start text-navy font-medium"><span className="text-cyan mr-2 font-bold">✓</span> Pembuangan 100% Legal IPLT dengan Dokumen Manifest & BAST</li>
                <li className="flex items-start text-navy font-medium"><span className="text-cyan mr-2 font-bold">✓</span> Standar HSE / K3 Industri (Teknisi APD Lengkap, CSMS-Ready)</li>
                <li className="flex items-start text-navy font-medium"><span className="text-cyan mr-2 font-bold">✓</span> Tangki 4.000L - 10.000L & Kontrak SLA Perusahaan</li>
              </ul>

              {/* Hero Action Buttons: Penawaran RFP, Download Brosur PDF, & WhatsApp Dispatcher */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5 sm:gap-4">
                <a
                  href="#quotation"
                  className="px-6 sm:px-8 py-4 bg-orange text-white text-center font-bold rounded-2xl hover:bg-orange-dark transition shadow-lg shadow-orange/30 flex items-center justify-center gap-2 text-sm sm:text-base group"
                >
                  <span>MINTA PENAWARAN (RFP B2B)</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>

                {/* Tombol Download Brosur PDF B2B (Profil Perusahaan & Legalitas NIB) */}
                <button
                  id="btn-download-brosur-hero"
                  type="button"
                  onClick={() => {
                    handleDownloadBrochurePdf();
                    setIsBrochureModalOpen(true);
                  }}
                  disabled={isDownloadingBrochurePdf}
                  className="px-6 sm:px-7 py-3.5 sm:py-4 bg-navy hover:bg-navy-light text-white font-bold rounded-2xl transition-all duration-300 shadow-xl shadow-navy/25 flex items-center justify-center gap-3 border border-cyan/40 cursor-pointer group hover:scale-[1.02] active:scale-[0.99] disabled:opacity-75"
                  title="Download Brosur Resmi & Legalitas NIB KBLI 37011 PT Kusuma Gemilang Raya"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white flex items-center justify-center transition shrink-0">
                    {isDownloadingBrochurePdf ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-2v1.5h1.5v1h-1.5v2h-1v-5.5h3v1zm5 4.5h-2.5v-5.5h2.5c.8 0 1.5.7 1.5 1.5v2.5c0 .8-.7 1.5-1.5 1.5zm4.5-4.5h-2v1.5h1.5v1h-1.5v2h-1v-5.5h3v1z" />
                      </svg>
                    )}
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white tracking-tight">Download Brosur PDF</span>
                      <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-cyan text-navy">
                        NIB 37011
                      </span>
                    </div>
                    <span className="text-[11px] text-cyan-light font-medium block mt-0.5">
                      Profil PT & Legalitas Lengkap
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-cyan-light group-hover:translate-y-0.5 transition-transform ml-0.5 hidden sm:block shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>

                <a
                  id="wa-hero-1"
                  href={getDynamicWaLink('hero')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-7 py-4 bg-white border-2 border-navy text-navy text-center font-bold rounded-2xl hover:bg-slate-50 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-xs"
                >
                  <span>KONSULTASI DISPATCHER</span>
                </a>
              </div>

              {/* B2B Legal Assurance Quick Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-gray-600 mt-5 pt-4 border-t border-gray-200/80">
                <span className="inline-flex items-center gap-1.5 font-semibold bg-white border border-gray-200 px-3 py-1 rounded-xl shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  NIB: 0220108920194
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold bg-white border border-gray-200 px-3 py-1 rounded-xl shadow-xs">
                  <span className="text-cyan">🏛️</span>
                  KBLI 37011 Air Limbah
                </span>
                <span className="inline-flex items-center gap-1.5 font-semibold bg-white border border-gray-200 px-3 py-1 rounded-xl shadow-xs">
                  <span className="text-orange">📄</span>
                  Faktur Pajak PPN 11%
                </span>
                <button
                  type="button"
                  onClick={() => setIsBrochureModalOpen(true)}
                  className="text-cyan-dark hover:text-cyan font-bold flex items-center gap-1 cursor-pointer py-1 px-2 hover:bg-cyan/10 rounded-lg transition"
                >
                  <span>Lihat Legalitas & BAST</span>
                  <span>→</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Layanan Siaga 24 Jam • Melayani Seluruh Kawasan Industri Bekasi & Cikarang</span>
              </p>
            </div>

            <div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                {/* Foto Armada & Teknisi Asli */}
                <img
                  src={heroKusumaImg}
                  alt="Armada truk sedot WC dan teknisi profesional PT Kusuma Gemilang Raya di Bekasi"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-navy/85 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-cyan-light font-bold">ARMADA INDUSTRI KAPASITAS BESAR</p>
                    <p className="text-sm font-semibold">Truk Tangki Vakum Standar Pabrik & IPLT</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30">
                    Siap Operasi 24H
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Trust Metrics Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy">500+</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Kontrak PT & Pabrik Selesai</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan">100%</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Manifest Resmi IPLT Pemda</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-orange">10+</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Kawasan Industri Terlayani</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs">
              <p className="text-2xl sm:text-3xl font-extrabold text-navy">PPN & PO</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Faktur Pajak & Termin Pembayaran</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portofolio Rekanan Klien Korporat B2B (15+ Perusahaan Multinasional & Nasional) */}
      <CorporateClientsSection
        onSelectClientForQuote={handleSelectClientForQuote}
        onOpenQuickQuote={handleLaunchQuickQuote}
      />

      {/* Service Cards B2B & Industri */}
      <section id="layanan" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/10 text-cyan-dark text-xs sm:text-sm font-bold mb-4">
              🏢 LAYANAN SPESIALISASI PERUSAHAAN & INDUSTRI
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Layanan Sanitasi & Limbah Korporat</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Solusi komprehensif berstandar industri dengan legalitas resmi, manifes IPLT, dan dukungan invoice PO untuk PT & pabrik di Bekasi.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Sedot Limbah STP & Bak Ekualisasi */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col justify-between group hover:border-cyan/40">
              <div>
                <div className="w-14 h-14 bg-cyan/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan/10 text-cyan-dark uppercase">Kawasan Industri & Pabrik</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">Limbah STP & Bak Ekualisasi</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Pengurasan lumpur aktif (sludge), bak sedimentasi, dan kolam ekualisasi pabrik dengan pompa vakum high-power blower & manifest resmi.</p>
              </div>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, kami dari perusahaan ingin penawaran pengurasan bak limbah STP / IPAL Pabrik.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange font-semibold text-sm inline-flex items-center hover:text-orange-dark"
              >
                Minta Penawaran STP <span className="ml-2">→</span>
              </a>
            </div>

            {/* Card 2: Septic Tank Gedung & Komersial */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col justify-between group hover:border-cyan/40">
              <div>
                <div className="w-14 h-14 bg-cyan/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange/10 text-orange uppercase">Gedung & Perkantoran</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">Septic Tank Gedung & RS</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Penyedotan tangki septik gedung bertingkat, mall, ruko niaga, dan rumah sakit. Sistem kedap udara bebas bau & jadwal pengerjaan fleksibel.</p>
              </div>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, kami ingin konsultasi sedot septic tank untuk gedung komersial / perkantoran.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange font-semibold text-sm inline-flex items-center hover:text-orange-dark"
              >
                Minta Penawaran Gedung <span className="ml-2">→</span>
              </a>
            </div>

            {/* Card 3: Grease Trap Komersial */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col justify-between group hover:border-cyan/40">
              <div>
                <div className="w-14 h-14 bg-cyan/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase">Kantin Pabrik & F&B Chain</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">Kuras Grease Trap Sentral</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Pembersihan perangkap lemak skala besar kantin pabrik, restoran cepat saji, hotel, dan catering industri untuk mencegah luapan minyak.</p>
              </div>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, kami membutuhkan layanan pengurasan grease trap sentral berkala.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange font-semibold text-sm inline-flex items-center hover:text-orange-dark"
              >
                Minta Penawaran Grease Trap <span className="ml-2">→</span>
              </a>
            </div>

            {/* Card 4: Pelancaran Hydro-Jetting */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col justify-between group hover:border-cyan/40">
              <div>
                <div className="w-14 h-14 bg-cyan/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan/20 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 uppercase">Teknologi Tanpa Bongkar</span>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">Hydro-Jetting Tekanan Tinggi</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">Pelancaran pipa mampet industri diameter besar menggunakan semprotan air ribuan PSI untuk merontokkan kerak lemak dan endapan semen.</p>
              </div>
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, kami butuh layanan hydro jetting pembersihan pipa mampet di area pabrik / gedung.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange font-semibold text-sm inline-flex items-center hover:text-orange-dark"
              >
                Konsultasi Hydro-Jetting <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan Section */}
      <section id="tentang" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-8">Kenapa Memilih PT Kusuma Gemilang Raya?</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Perusahaan Profesional</h4>
                    <p className="text-sm text-gray-600">Resmi dan terdaftar dengan legalitas lengkap.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Teknisi Berpengalaman</h4>
                    <p className="text-sm text-gray-600">Terlatih dan ahli dalam penanganan sanitasi.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Armada Siap Operasional</h4>
                    <p className="text-sm text-gray-600">Kendaraan terawat dan siap kapan saja.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Respon Cepat</h4>
                    <p className="text-sm text-gray-600">Datang tepat waktu ke lokasi Anda.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Harga Transparan</h4>
                    <p className="text-sm text-gray-600">Tanpa biaya tersembunyi, jelas di awal.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Melayani Semua Kebutuhan</h4>
                    <p className="text-sm text-gray-600">Dari rumah hingga kebutuhan perusahaan.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                {/* Foto Teknisi Menguras Septic Tank */}
                <img
                  src="https://z-cdn-media.chatglm.cn/files/f376cf34-d467-42fc-a752-92f97c36ed1b.jpg?auth_key=1891530048-5d5ab972979f442aa2ac45be1b8be3e6-0-b727bf4bfb372d573d4996732a6c874e"
                  alt="Teknisi PT Kusuma Gemilang Raya sedang memompa septic tank di area komersial"
                  className="w-full h-[450px] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-navy text-white p-6 rounded-2xl shadow-xl hidden md:block">
                <p className="text-3xl font-extrabold text-cyan">100%</p>
                <p className="text-sm">Legally Compliant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solusi Sanitasi Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Solusi Sanitasi untuk Berbagai Kebutuhan</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Kami siap menangani kebutuhan sanitasi dari skala rumahan hingga industri.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange/10 text-orange rounded-lg flex items-center justify-center mr-3 text-sm font-bold">01</span> Rumah Tinggal
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Sedot WC</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Sedot septic tank</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> WC mampet</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Saluran mampet</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange/10 text-orange rounded-lg flex items-center justify-center mr-3 text-sm font-bold">02</span> Perkantoran
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Sedot septic tank</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Sedot limbah</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Perawatan saluran</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange/10 text-orange rounded-lg flex items-center justify-center mr-3 text-sm font-bold">03</span> Perusahaan & Industri
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Sedot limbah STP</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Penyedotan septic tank</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Layanan sanitasi berkala</li>
              </ul>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center">
                <span className="w-8 h-8 bg-orange/10 text-orange rounded-lg flex items-center justify-center mr-3 text-sm font-bold">04</span> Usaha & Komersial
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Restoran & Hotel</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Ruko & Gudang</li>
                <li className="flex items-center"><span className="text-cyan mr-2 font-bold">•</span> Fasilitas umum</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sektor Layanan Spesialis */}
      <section id="spesialis" className="py-16 md:py-24 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cyan font-semibold tracking-wide">PROFESSIONAL SECTORS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Sektor Layanan Spesialis</h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Menjangkau kebutuhan sanitasi kompleks dengan standar operasional tinggi untuk berbagai sektor profesional.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Industri Manufaktur */}
            <div className="bg-navy-light/40 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-orange/50 transition duration-300">
              <div className="w-14 h-14 bg-orange/20 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Industri Manufaktur</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Penanganan limbah STP dan IPAL pabrik dengan protokol keselamatan ketat dan dokumen manifest B3 yang sesuai regulasi pemerintah.</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center"><span className="text-orange mr-2">▸</span> Sedot limbah STP & IPAL</li>
                <li className="flex items-center"><span className="text-orange mr-2">▸</span> Penanganan Non B3 terjadwal</li>
                <li className="flex items-center"><span className="text-orange mr-2">▸</span> Compliance dokumentasi</li>
              </ul>
            </div>

            {/* Card 2: Hotel & Restoran */}
            <div className="bg-navy-light/40 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-cyan/50 transition duration-300">
              <div className="w-14 h-14 bg-cyan/20 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Hotel & Restoran</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Layanan sanitasi diskrit dan higienis untuk menjaga reputasi bisnis perhotelan dan F&B Anda tanpa mengganggu kenyamanan tamu.</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center"><span className="text-cyan mr-2">▸</span> Grease trap & limbah dapur</li>
                <li className="flex items-center"><span className="text-cyan mr-2">▸</span> Sanitasi tanpa bau</li>
                <li className="flex items-center"><span className="text-cyan mr-2">▸</span> Pengerjaan cepat & diskret</li>
              </ul>
            </div>

            {/* Card 3: Gedung Perkantoran & Mall */}
            <div className="bg-navy-light/40 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-yellow-500/50 transition duration-300">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Gedung, Mall & Rumah Sakit</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">Perawatan sistem plumbing, tangki septik komersial, dan saluran air kotor gedung bertingkat dengan jaminan kedap bau dan operasional tanpa gangguan.</p>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-center"><span className="text-yellow-500 mr-2">▸</span> Kuras septic tank komersial</li>
                <li className="flex items-center"><span className="text-yellow-500 mr-2">▸</span> Pengerjaan malam / off-peak hours</li>
                <li className="flex items-center"><span className="text-yellow-500 mr-2">▸</span> Kontrak SLA perawatan gedung</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Area Layanan Section */}
      <section id="area" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cyan font-semibold tracking-wide">COVERAGE AREA</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2">Area Layanan Sedot WC Bekasi</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">PT Kusuma Gemilang Raya melayani seluruh wilayah Kota dan Kabupaten Bekasi dengan respons cepat.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 border-l-4 border-orange pl-4 text-navy">KOTA BEKASI</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4 text-gray-600">
                <span>Bekasi</span>
                <span>Bekasi Barat</span><span>Bekasi Timur</span><span>Bekasi Utara</span>
                <span>Bekasi Selatan</span><span>Medan Satria</span><span>Rawalumbu</span>
                <span>Jatiasih</span><span>Jatisampurna</span><span>Pondok Gede</span>
                <span>Pondok Melati</span><span>Mustika Jaya</span><span>Bantar Gebang</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6 border-l-4 border-cyan pl-4 text-navy">KABUPATEN BEKASI</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-4 text-gray-600">
                <span>Cikarang</span>
                <span>Cikarang Barat</span><span>Cikarang Timur</span><span>Cikarang Utara</span>
                <span>Cikarang Selatan</span><span>Cikarang Pusat</span><span>Cibitung</span>
                <span>Tambun Selatan</span><span>Tambun Utara</span><span>Babelan</span>
                <span>Tarumajaya</span><span>Setu</span><span>Serang Baru</span>
                <span>Cibarusah</span><span>Bojongmangu</span><span>Kedungwaringin</span>
                <span>Sukatani</span><span>Sukakarya</span><span>Pebayuran</span>
                <span>Cabangbungin</span><span>Muaragembong</span><span>Karangbahagia</span>
                <span>Tambelang</span><span>Sukawangi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Peta Lokasi & Titik Pusat Layanan Section */}
      <section id="peta" className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/10 text-cyan-dark text-sm font-semibold mb-4">
              📍 PETA OPERASIONAL & TITIK PUSAT LAYANAN
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
              Peta Lokasi & Jangkauan Layanan di Bekasi
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Kami menyiagakan armada truk tangki di beberapa titik pusat strategis di Kota & Kabupaten Bekasi untuk memastikan teknisi tiba di lokasi Anda secepat mungkin (estimasi 15-30 menit).
            </p>

            {/* Hub Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              {mapHubs.map((hub, idx) => (
                <button
                  key={hub.id}
                  onClick={() => handleSelectMapHub(idx, false)}
                  onMouseEnter={() => setHoveredMapHubIndex(idx)}
                  onMouseLeave={() => setHoveredMapHubIndex(null)}
                  className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activeMapHubIndex === idx
                      ? 'bg-navy text-white shadow-lg scale-105 border border-cyan/40 ring-2 ring-cyan/50'
                      : 'bg-slate-100 text-gray-700 hover:bg-slate-200 border border-gray-200'
                  }`}
                  aria-label={`Pilih hub ${hub.name}`}
                  title={`${hub.name} • Kontak: ${hub.phone}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${activeMapHubIndex === idx ? 'bg-cyan animate-pulse' : 'bg-gray-400'}`}></span>
                  <span>{hub.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1.5 flex-wrap">
              <span>💡</span>
              <span>Arahkan kursor (<strong>hover</strong>) pada pin peta untuk melihat nama dan nomor kontak pos secara instan, atau klik untuk memusatkan peta.</span>
            </p>

            {/* Quick Map Export & Presentation Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
              <button
                type="button"
                onClick={handleExportAreaMapPng}
                disabled={isExportingMapPng}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-navy text-cyan hover:bg-navy/90 hover:text-cyan-light shadow-md border border-cyan/40 transition flex items-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer"
                title="Unduh visual peta area titik terpilih sebagai gambar PNG resolusi tinggi untuk slide presentasi B2B"
              >
                {isExportingMapPng ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
                    <span>Menyiapkan PNG...</span>
                  </>
                ) : (
                  <>
                    <span>📸</span>
                    <span>Save Area Map (Export PNG B2B)</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan/20 text-[10px] font-mono text-cyan">16:9 HD</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMapPrintPreviewOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-navy hover:bg-slate-100 shadow-sm border border-gray-200 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Buka Print Preview format lembar cetak A4 untuk survei lapangan"
              >
                <span>🖨️</span>
                <span>Print Preview (Lembar Kunjungan Lapangan)</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Google Maps Embed iframe Container with Interactive Pins Overlay */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-slate-900 h-full min-h-[460px] md:min-h-[540px]">
                {/* Live Status & Controls Overlay Header */}
                <div className="absolute top-3.5 left-3.5 right-3.5 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-navy/90 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Armada Siap Berangkat (24 Jam)
                    </span>
                    {mapCenteringNotice && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-lg border border-emerald-400/50 flex items-center gap-1.5 animate-fadeIn">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                        <span className="truncate max-w-[200px] sm:max-w-xs">{mapCenteringNotice}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    {/* Mode Toggle: Interactive Pin Overlay vs Free Google Maps Pan */}
                    <button
                      type="button"
                      onClick={() => setIsPinInteractiveMode(!isPinInteractiveMode)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition flex items-center gap-1.5 border ${
                        isPinInteractiveMode
                          ? 'bg-cyan text-navy border-cyan-light'
                          : 'bg-white/95 text-gray-700 hover:bg-white border-gray-200'
                      }`}
                      title="Klik untuk beralih mode pin atau interaksi bebas peta"
                    >
                      <span>{isPinInteractiveMode ? '📍 Mode Pin Aktif' : '🌐 Mode Peta Bebas'}</span>
                    </button>

                    {/* Zoom In & Out Controls */}
                    <div className="flex items-center bg-white/95 backdrop-blur-md rounded-full shadow-md border border-gray-200 overflow-hidden text-navy">
                      <button
                        type="button"
                        onClick={handleZoomIn}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-gray-100 transition border-r border-gray-200"
                        title="Perbesar Peta (Zoom In)"
                        aria-label="Perbesar Peta"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={handleZoomOut}
                        className="px-2.5 py-1 text-xs font-bold hover:bg-gray-100 transition"
                        title="Perkecil Peta (Zoom Out)"
                        aria-label="Perkecil Peta"
                      >
                        −
                      </button>
                    </div>

                    {/* Save Area Map PNG Button for B2B Presentations */}
                    <button
                      type="button"
                      onClick={handleExportAreaMapPng}
                      disabled={isExportingMapPng}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-navy text-cyan hover:bg-navy/90 hover:text-cyan-light shadow-md border border-cyan/40 transition flex items-center gap-1.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Unduh Peta Area terpilih sebagai gambar PNG untuk materi presentasi B2B"
                    >
                      {isExportingMapPng ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <span>📸</span>
                          <span>Save Area Map</span>
                        </>
                      )}
                    </button>

                    {/* Print Preview Button for Physical Site Visits */}
                    <button
                      type="button"
                      onClick={() => setIsMapPrintPreviewOpen(true)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 hover:bg-white text-navy shadow-md border border-gray-200 transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                      title="Buka Print Preview: Format lembar kunjungan lapangan (1 lembar cetak A4)"
                    >
                      <span>🖨️</span>
                      <span className="hidden sm:inline">Print Preview</span>
                      <span className="sm:hidden">Print</span>
                    </button>

                    <a
                      href={mapHubs[activeMapHubIndex].mapsDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/95 hover:bg-white text-navy shadow-md border border-gray-200 transition flex items-center gap-1"
                      title="Buka langsung di aplikasi Google Maps"
                    >
                      <span className="hidden sm:inline">Google Maps</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Google Maps Iframe */}
                <iframe
                  title={`Peta Lokasi ${mapHubs[activeMapHubIndex].name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapHubs[activeMapHubIndex].mapQuery)}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full min-h-[460px] md:min-h-[540px] border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>

                {/* Interactive Hub Pins Overlay (Active when isPinInteractiveMode is ON) */}
                {isPinInteractiveMode && (
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Route Corridor Network Vector Lines connecting hubs */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path
                        d="M 22 38 Q 36 43, 50 48 T 78 64"
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="0.7"
                        strokeDasharray="2,2"
                        className="animate-pulse"
                      />
                    </svg>

                    {/* Interactive Clickable Pins with Hover Tooltip / Popover */}
                    {mapHubs.map((hub, idx) => {
                      const isActive = activeMapHubIndex === idx;
                      const isHovered = hoveredMapHubIndex === idx;

                      // Popover alignment class so it stays neatly within the map viewport
                      const popoverAlignClass =
                        idx === 1
                          ? 'right-[-20px] sm:right-auto sm:left-1/2 sm:-translate-x-3/4'
                          : idx === 0
                          ? 'left-[-20px] sm:left-1/2 sm:-translate-x-1/4'
                          : 'left-1/2 -translate-x-1/2';

                      const popoverArrowClass =
                        idx === 1
                          ? 'right-8 sm:left-3/4 sm:-translate-x-1/2'
                          : idx === 0
                          ? 'left-8 sm:left-1/4 sm:-translate-x-1/2'
                          : 'left-1/2 -translate-x-1/2';

                      return (
                        <div
                          key={hub.id}
                          style={{
                            left: hub.pinPos?.left || '50%',
                            top: hub.pinPos?.top || '50%',
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform ${
                            isHovered ? 'z-50' : isActive ? 'z-40' : 'z-30'
                          }`}
                          onMouseEnter={() => setHoveredMapHubIndex(idx)}
                          onMouseLeave={() => setHoveredMapHubIndex(null)}
                        >
                          {/* Centering radar waves for active hub */}
                          {isActive && (
                            <>
                              <span className="absolute -inset-3.5 rounded-full bg-cyan/30 animate-ping pointer-events-none" />
                              <span className="absolute -inset-7 rounded-full border-2 border-cyan/50 animate-pulse pointer-events-none" />
                            </>
                          )}

                          {/* Pin Button */}
                          <button
                            type="button"
                            onClick={() => handleSelectMapHub(idx, true)}
                            onFocus={() => setHoveredMapHubIndex(idx)}
                            onBlur={() => setHoveredMapHubIndex(null)}
                            className={`group relative flex items-center gap-1.5 p-1.5 sm:p-2 rounded-2xl shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer ${
                              isActive
                                ? 'bg-navy text-white ring-4 ring-cyan shadow-cyan/60 scale-110 -translate-y-1'
                                : 'bg-white/95 text-navy hover:bg-white hover:scale-105 border-2 border-navy/20 hover:border-cyan shadow-md'
                            }`}
                            aria-label={`Pusatkan peta ke ${hub.name}. Kontak: ${hub.phone}`}
                            title={`${hub.name} • Kontak: ${hub.phone} (Arahkan kursor untuk info cepat)`}
                          >
                            {/* Pin icon container */}
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base shadow-sm ${
                                isActive ? 'bg-cyan text-navy' : 'bg-slate-100 text-navy group-hover:bg-cyan/20'
                              }`}
                            >
                              {hub.pinIcon}
                            </div>

                            <div className="text-left pr-1 hidden xs:block sm:block">
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] sm:text-xs font-black tracking-tight leading-tight">
                                  {hub.shortName || hub.name}
                                </span>
                                {isActive && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                                )}
                              </div>
                              <p className={`text-[9px] sm:text-[10px] leading-tight ${isActive ? 'text-cyan-200 font-semibold' : 'text-gray-500'}`}>
                                ⚡ {hub.response} • {hub.armadaCount.split(' ')[0]} Armada
                              </p>
                            </div>

                            {/* Downward pin triangle point */}
                            <div
                              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] transition-colors ${
                                isActive ? 'border-t-navy' : 'border-t-white/95 group-hover:border-t-cyan'
                              }`}
                            />
                          </button>

                          {/* Rich Discoverability Tooltip / Popover on Hover */}
                          {isHovered && (
                            <div
                              className={`absolute bottom-full mb-3.5 ${popoverAlignClass} w-64 sm:w-72 p-3 bg-navy/95 backdrop-blur-md text-white rounded-2xl border-2 border-cyan/60 shadow-2xl z-50 pointer-events-auto text-left animate-fadeIn`}
                              role="tooltip"
                              onMouseEnter={() => setHoveredMapHubIndex(idx)}
                              onMouseLeave={() => setHoveredMapHubIndex(null)}
                            >
                              {/* Header & Badges */}
                              <div className="flex items-center justify-between text-[10px] font-bold mb-1.5 gap-1">
                                <span className="px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-[9px] font-black tracking-wide truncate">
                                  {hub.badge}
                                </span>
                                <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Online 24 Jam
                                </span>
                              </div>

                              {/* Hub Name */}
                              <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight mb-0.5">
                                {hub.name}
                              </h4>

                              <p className="text-[10px] text-gray-300 leading-tight mb-2 truncate">
                                📍 {hub.address}
                              </p>

                              {/* Contact Number Popover Highlight Box */}
                              <div className="bg-white/10 rounded-xl p-2 mb-2 border border-white/15 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="w-6 h-6 rounded-lg bg-cyan/20 text-cyan flex items-center justify-center text-xs shrink-0">
                                    📞
                                  </span>
                                  <div className="min-w-0">
                                    <span className="block text-[8px] uppercase tracking-wider text-cyan-200 font-bold leading-none mb-0.5">
                                      Kontak Langsung Pos
                                    </span>
                                    <span className="text-xs font-mono font-black text-white truncate block leading-none">
                                      {hub.phone || '+62 896-7506-4916'}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyHubPhone(e, hub.phone || '+62 896-7506-4916', hub.name)}
                                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/20 hover:bg-white/30 text-white transition shrink-0 active:scale-95"
                                  title="Salin nomor kontak pos ini"
                                >
                                  {copiedHubPhone === (hub.phone || '+62 896-7506-4916') ? '✓ Tersalin' : 'Salin'}
                                </button>
                              </div>

                              {/* Quick Action Contact Links */}
                              <div className="grid grid-cols-2 gap-1.5 mb-2">
                                <a
                                  href={`tel:${(hub.phoneRaw || '+6289675064916')}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-cyan text-navy hover:bg-cyan/90 transition text-center flex items-center justify-center gap-1 shadow-sm active:scale-95"
                                  title={`Panggil langsung pos ${hub.name}`}
                                >
                                  <span>📞</span>
                                  <span>Telepon</span>
                                </a>
                                <a
                                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya melihat Peta Lokasi titik "${hub.name}" (Kontak: ${hub.phone}). Mohon info ketersediaan armada.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition text-center flex items-center justify-center gap-1 shadow-sm active:scale-95"
                                  title="Kirim pesan WhatsApp ke dispatcher"
                                >
                                  <span>💬</span>
                                  <span>WhatsApp</span>
                                </a>
                              </div>

                              {/* Response time and Fleet info */}
                              <div className="text-[10px] text-gray-300 flex items-center justify-between pt-1 border-t border-white/10">
                                <span>⚡ Respon: <strong className="text-orange">{hub.response}</strong></span>
                                <span className="font-semibold text-gray-200">🚛 {hub.armadaCount.split(' ')[0]} Armada</span>
                              </div>

                              {/* Click prompt or Active status */}
                              <div className="mt-1.5 pt-1 text-[9px] text-center border-t border-white/10 font-medium">
                                {isActive ? (
                                  <span className="text-cyan font-bold">✓ Pos ini sedang menjadi pusat peta aktif</span>
                                ) : (
                                  <span className="text-gray-300">💡 Klik pin untuk memusatkan peta ke lokasi ini</span>
                                )}
                              </div>

                              {/* Caret pointing to pin */}
                              <div
                                className={`absolute -bottom-2 ${popoverArrowClass} w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-navy/95`}
                              />
                            </div>
                          )}

                          {/* Default Floating Detail Badge anchored to active pin when NOT hovered */}
                          {!isHovered && isActive && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-48 sm:w-56 p-2.5 bg-navy/95 backdrop-blur-md text-white rounded-2xl border border-cyan/40 shadow-2xl pointer-events-none text-center animate-fadeIn">
                              <div className="flex items-center justify-between text-[10px] font-bold text-cyan mb-1">
                                <span className="flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping"></span>
                                  PUSAT PETA AKTIF
                                </span>
                                <span className="px-1.5 py-0.5 rounded bg-cyan/20 text-cyan text-[9px] font-black">TERPILIH</span>
                              </div>
                              <p className="text-xs font-extrabold text-white truncate">{hub.name}</p>
                              <p className="text-[10px] text-cyan-200 font-mono mt-0.5 font-bold">
                                📞 {hub.phone || '+62 896-7506-4916'}
                              </p>
                              <p className="text-[9px] text-gray-300 mt-0.5">
                                Respon: <strong className="text-orange">{hub.response}</strong> • {hub.armadaCount}
                              </p>
                              <p className="text-[8px] text-gray-400 mt-1">
                                (Arahkan kursor / hover untuk info lengkap)
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Floating Quick Pin Dock inside Map Viewport */}
                <div className="absolute bottom-16 left-3.5 right-3.5 z-20 pointer-events-none">
                  <div className="bg-navy/85 backdrop-blur-md border border-white/10 rounded-2xl p-2 sm:p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-bold text-cyan flex items-center gap-1">
                        <span>📍</span>
                        <span className="hidden xs:inline">Pusatkan Peta:</span>
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {mapHubs.map((hub, idx) => (
                          <button
                            key={hub.id}
                            type="button"
                            onClick={() => handleSelectMapHub(idx, true)}
                            onMouseEnter={() => setHoveredMapHubIndex(idx)}
                            onMouseLeave={() => setHoveredMapHubIndex(null)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-bold transition flex items-center gap-1 ${
                              activeMapHubIndex === idx
                                ? 'bg-cyan text-navy shadow-md font-black scale-105'
                                : 'bg-white/10 hover:bg-white/20 text-gray-200'
                            }`}
                            title={`Pusatkan ke ${hub.name} • Kontak: ${hub.phone}`}
                          >
                            <span>{hub.pinIcon}</span>
                            <span>{hub.shortName?.split(' ')[0] || hub.name.split(' ')[0]} {hub.shortName?.split(' ')[1] || ''}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <span className="text-[10px] text-gray-300 hidden md:inline-block">
                      {isPinInteractiveMode ? '🎯 Klik pin di peta untuk pusatkan' : '⚠️ Mode peta bebas aktif'}
                    </span>
                  </div>
                </div>

                {/* Bottom Coordinates Bar */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 pointer-events-none">
                  <div className="bg-navy/95 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between text-xs pointer-events-auto">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-orange font-bold">📍 Pusat Koordinat:</span>
                      <span className="text-gray-200 font-mono font-medium">{mapHubs[activeMapHubIndex].lat}, {mapHubs[activeMapHubIndex].lng}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyMapCoords(`${mapHubs[activeMapHubIndex].lat}, ${mapHubs[activeMapHubIndex].lng}`)}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/10 hover:bg-white/20 text-cyan transition ml-1"
                        title="Salin Koordinat GPS"
                      >
                        {copiedMapCoords ? '✓ Tersalin' : 'Salin GPS'}
                      </button>
                    </div>
                    <span className="text-cyan font-semibold hidden sm:inline-block">Radius Pelayanan 50+ KM (Kota & Kab. Bekasi)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reactive Detail Information Card (Auto-Updated on Hub Pin Click) */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between space-y-6">
              <div
                ref={hubCardRef}
                id="hub-info-card"
                className={`p-6 md:p-8 rounded-3xl border transition-all duration-500 flex-1 flex flex-col justify-between ${
                  isCardHighlighted
                    ? 'bg-cyan/5 border-cyan ring-4 ring-cyan/40 shadow-2xl scale-[1.01]'
                    : 'bg-slate-50 border-gray-100 shadow-sm'
                }`}
              >
                <div>
                  {/* Card Status & Live Dispatcher Banner */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange/10 text-orange border border-orange/20">
                      {mapHubs[activeMapHubIndex].badge}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online Dispatcher
                    </span>
                  </div>

                  {/* Auto-update indication badge */}
                  <div className="mb-3 flex items-center gap-1.5 text-[11px] font-bold text-cyan-dark bg-cyan/10 px-3 py-1 rounded-xl border border-cyan/20">
                    <span className="w-2 h-2 rounded-full bg-cyan animate-ping"></span>
                    <span>✓ Peta Sedang Terpusat di Titik Ini</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-navy mb-2">
                    {mapHubs[activeMapHubIndex].name}
                  </h3>
                  <div className="text-xs text-gray-500 mb-4 flex items-start justify-between gap-2 p-2.5 rounded-2xl bg-white border border-gray-100 shadow-xs">
                    <p className="flex items-start gap-1.5 flex-1 min-w-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="leading-relaxed text-gray-700 font-medium">{mapHubs[activeMapHubIndex].address}</span>
                    </p>
                    <button
                      type="button"
                      onClick={(e) => handleCopyHubAddress(e, mapHubs[activeMapHubIndex].address, mapHubs[activeMapHubIndex].name)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition shrink-0 flex items-center gap-1 cursor-pointer active:scale-95 border ${
                        copiedHubAddress === mapHubs[activeMapHubIndex].address
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-black'
                          : 'bg-slate-50 hover:bg-cyan/10 text-navy hover:text-cyan-dark border-gray-200 hover:border-cyan/40 shadow-xs'
                      }`}
                      title="Salin alamat lengkap pos ini untuk ditempel di Google Maps, Waze, atau aplikasi navigasi"
                    >
                      {copiedHubAddress === mapHubs[activeMapHubIndex].address ? (
                        <>
                          <span className="text-emerald-600">✓</span>
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          <span>Copy Location</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Hub Direct Contact Banner */}
                  <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-navy via-slate-900 to-navy text-white border border-cyan/40 shadow-md flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-cyan/20 border border-cyan/40 text-cyan flex items-center justify-center text-sm shrink-0">
                        📞
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase tracking-wider text-cyan-200 font-bold">
                          {mapHubs[activeMapHubIndex].hotlineLabel || 'Kontak Dispatcher Pos'}:
                        </span>
                        <span className="text-sm font-mono font-black text-white tracking-tight truncate block">
                          {mapHubs[activeMapHubIndex].phone || '+62 896-7506-4916'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => handleCopyHubPhone(e, mapHubs[activeMapHubIndex].phone || '+62 896-7506-4916', mapHubs[activeMapHubIndex].name)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition active:scale-95"
                        title="Salin Nomor Kontak Pos Ini"
                      >
                        {copiedHubPhone === (mapHubs[activeMapHubIndex].phone || '+62 896-7506-4916') ? '✓ Tersalin' : 'Salin'}
                      </button>
                      <a
                        href={`tel:${mapHubs[activeMapHubIndex].phoneRaw || '+6289675064916'}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan text-navy hover:bg-cyan/90 transition shadow-sm font-extrabold flex items-center gap-1"
                        title="Telepon Pos Sekarang"
                      >
                        <span>Hubungi</span>
                      </a>
                    </div>
                  </div>

                  {/* GPS & Area Tag */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white border border-gray-200 text-gray-600 flex items-center gap-1">
                      <span>📍</span>
                      <span>{mapHubs[activeMapHubIndex].lat}, {mapHubs[activeMapHubIndex].lng}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyMapCoords(`${mapHubs[activeMapHubIndex].lat}, ${mapHubs[activeMapHubIndex].lng}`)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-200 hover:bg-slate-300 text-navy transition"
                    >
                      {copiedMapCoords ? '✓ Tersalin!' : 'Salin Koordinat'}
                    </button>
                    {mapHubs[activeMapHubIndex].highlightArea && (
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {mapHubs[activeMapHubIndex].highlightArea}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200 text-sm">
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Estimasi Respon Tiba:</span>
                      <p className="font-bold text-navy flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{mapHubs[activeMapHubIndex].response}</span>
                      </p>
                    </div>

                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Kesiapan Armada:</span>
                      <p className="font-bold text-navy flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                        <span>{mapHubs[activeMapHubIndex].armadaCount} Siap Jalan</span>
                      </p>
                    </div>

                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Cakupan Wilayah Terdekat:</span>
                      <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        {mapHubs[activeMapHubIndex].coverage}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hub Navigation and WhatsApp CTA */}
                <div className="pt-6 mt-6 border-t border-gray-200 space-y-3">
                  {/* Previous / Next Hub Navigator Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectMapHub((activeMapHubIndex - 1 + mapHubs.length) % mapHubs.length, true)}
                      className="px-3 py-2 text-xs font-bold text-gray-600 bg-white hover:bg-slate-100 rounded-xl border border-gray-200 transition flex items-center gap-1"
                      title="Lihat titik hub sebelumnya"
                    >
                      <span>←</span>
                      <span>Pos Sebelumnya</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectMapHub(activeMapHubIndex, true)}
                      className="px-3 py-2 text-xs font-bold text-navy bg-cyan/15 hover:bg-cyan/25 rounded-xl border border-cyan/30 transition flex items-center gap-1"
                      title="Pusatkan ulang peta ke titik ini"
                    >
                      <span>📍</span>
                      <span>Pusatkan Ulang</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectMapHub((activeMapHubIndex + 1) % mapHubs.length, true)}
                      className="px-3 py-2 text-xs font-bold text-gray-600 bg-white hover:bg-slate-100 rounded-xl border border-gray-200 transition flex items-center gap-1"
                      title="Lihat titik hub berikutnya"
                    >
                      <span>Pos Berikutnya</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Save Area Map PNG for B2B Presentation */}
                  <button
                    type="button"
                    onClick={handleExportAreaMapPng}
                    disabled={isExportingMapPng}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-navy hover:bg-navy/90 text-white text-xs font-bold rounded-xl border border-cyan/40 hover:border-cyan transition shadow-md text-center gap-2 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Unduh visual peta area hub ini dalam format PNG resolusi tinggi untuk slide presentasi B2B"
                  >
                    {isExportingMapPng ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan border-t-transparent animate-spin" />
                        <span>Menyiapkan Gambar PNG Peta...</span>
                      </>
                    ) : (
                      <>
                        <span>📸</span>
                        <span>Save Area Map (Export PNG B2B)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan/20 text-cyan font-mono">16:9 HD</span>
                      </>
                    )}
                  </button>

                  {/* Print Preview Button for Physical Site Visits */}
                  <button
                    type="button"
                    onClick={() => setIsMapPrintPreviewOpen(true)}
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-slate-50 text-navy text-xs font-bold rounded-xl border border-gray-300 hover:border-cyan transition shadow-sm text-center gap-2 active:scale-98 cursor-pointer"
                    title="Buka Print Preview format lembar cetak A4 untuk survei lokasi dan kunjungan fisik"
                  >
                    <span>🖨️</span>
                    <span>Print Preview (Lembar Kunjungan Lapangan)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-navy/10 text-navy font-semibold">1 Halaman A4</span>
                  </button>

                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya melihat Peta Lokasi titik "${mapHubs[activeMapHubIndex].name}". Apakah bisa kirim armada sedot WC ke lokasi saya sekarang?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-dark transition shadow-lg shadow-orange/30 text-center gap-2"
                  >
                    <span>Panggil Armada Terdekat ({mapHubs[activeMapHubIndex].shortName || mapHubs[activeMapHubIndex].name})</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              {/* 3 Keunggulan Titik Operasional */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-navy">25+</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Total Armada</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-cyan">24 Jam</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Layanan Darurat</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-gray-100 text-center shadow-sm">
                  <p className="text-xl font-extrabold text-orange">100%</p>
                  <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Izin IPLT Sah</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Harga Section */}
      <section id="harga" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-6">Harga Sedot WC Bekasi</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Harga layanan sedot WC dapat berbeda untuk setiap kasus. Penentuan harga disesuaikan dengan:
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-left mb-10">
            <div className="bg-slate-50 p-4 rounded-xl flex items-center">
              <span className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center text-xs mr-3 font-bold">1</span>
              <span className="text-gray-700">Volume septic tank</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl flex items-center">
              <span className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center text-xs mr-3 font-bold">2</span>
              <span className="text-gray-700">Lokasi pekerjaan</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl flex items-center">
              <span className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center text-xs mr-3 font-bold">3</span>
              <span className="text-gray-700">Tingkat kesulitan pekerjaan</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl flex items-center">
              <span className="w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center text-xs mr-3 font-bold">4</span>
              <span className="text-gray-700">Jenis layanan & kebutuhan armada</span>
            </div>
          </div>

          <p className="text-gray-600 mb-8">Hubungi kami sekarang untuk mendapatkan estimasi harga yang transparan dan akurat sesuai kebutuhan Anda.</p>

          <a
            id="wa-harga"
            href={getDynamicWaLink('harga')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-orange text-white font-bold rounded-2xl hover:bg-orange-dark transition shadow-lg shadow-orange/30"
          >
            Konsultasi Harga via WhatsApp
          </a>
        </div>
      </section>

      {/* Section Permintaan Penawaran Resmi B2B (RFP Quotation untuk PT / Perusahaan) */}
      <section id="quotation" className="py-16 md:py-24 bg-gradient-to-br from-navy via-navy-light to-navy text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-orange/15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: B2B Procurement Guarantees */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/20 border border-cyan/40 text-cyan-light text-xs font-bold uppercase tracking-wider">
                🏢 PORTAL PENGADAAN & PROKUREMEN B2B
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Minta Penawaran Resmi (Quotation) untuk PT
              </h2>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Khusus General Affairs (GA), Procurement, dan HSE Manager di kawasan industri & gedung komersial Bekasi. Dapatkan dokumen penawaran harga formal ber-kop surat resmi PT Kusuma Gemilang Raya, jadwal survei lokasi gratis, serta skema kontrak berkala (SLA).
              </p>

              {/* 4 B2B Assurances */}
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan/20 text-cyan-light flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    📄
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Surat Penawaran Resmi & Rincian Scope</h4>
                    <p className="text-xs text-gray-300 mt-0.5">Penawaran harga detail lengkap dengan spesifikasi armada, estimasi ritase, dan metode kerja K3.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-orange/20 text-orange flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    🧾
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Faktur Pajak Elektronik (e-Faktur PPN) & SPPKP</h4>
                    <p className="text-xs text-gray-300 mt-0.5">PT Kusuma Gemilang Raya berstatus PKP aktif, siap menerbitkan e-Faktur Pajak resmi dan invoice termin PO.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    🛡️
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Berita Acara (BAST) & Manifest IPLT Sah</h4>
                    <p className="text-xs text-gray-300 mt-0.5">Bukti fisik dan digital pembuangan limbah ke IPLT pemerintah untuk lampiran audit lingkungan & ISO.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan/20 text-cyan-light flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    🔍
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Survei Lapangan Gratis (Free Technical Survey)</h4>
                    <p className="text-xs text-gray-300 mt-0.5">Tim teknisi kami siap datang ke pabrik/gedung Anda untuk inspeksi bak limbah tanpa pungutan biaya.</p>
                  </div>
                </div>
              </div>

              {/* Direct Hot-Call */}
              <div className="pt-2 flex items-center gap-4 text-xs text-gray-300">
                <span className="text-cyan-light font-bold">Layanan Prioritas B2B:</span>
                <a href="https://wa.me/6289675064916" className="text-white font-mono hover:text-orange transition font-bold">+62 896-7506-4916</a>
                <span>• Siaga 24 Jam Nonstop</span>
              </div>
            </div>

            {/* Right Column: RFP Quotation Form Card */}
            <div className="lg:col-span-7">
              <div
                id="b2b-rfp-form-card"
                className={`bg-white text-navy p-6 sm:p-10 rounded-3xl shadow-2xl border transition-all duration-500 ${
                  isRfpHighlighted
                    ? 'ring-4 ring-orange border-orange shadow-orange/40 scale-[1.01]'
                    : 'border-white/20'
                }`}
              >
                {rfpStatus === 'success' ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                      ✓
                    </div>
                    <h3 className="text-2xl font-extrabold text-navy">Permintaan Penawaran Diterima!</h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      Terima kasih Bpk/Ibu <span className="font-bold text-navy">{rfpPicName || 'PIC'}</span> dari <span className="font-bold text-navy">{rfpCompanyName}</span>. Permintaan penawaran resmi Anda telah kami terima.
                    </p>

                    <div className="p-5 bg-slate-50 border border-gray-100 rounded-2xl text-left text-xs space-y-2.5 mt-4">
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold text-gray-500">Perusahaan:</span>
                        <span className="font-bold text-navy">{rfpCompanyName}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold text-gray-500">PIC & Jabatan:</span>
                        <span className="font-bold text-navy">{rfpPicName} ({rfpPicRole})</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold text-gray-500">Lokasi / Kawasan:</span>
                        <span className="font-bold text-navy">{rfpLocation}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold text-gray-500">Jenis Layanan:</span>
                        <span className="font-bold text-navy">{rfpServiceType}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold text-gray-500">Estimasi Volume:</span>
                        <span className="font-bold text-cyan-dark">{rfpVolume}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold text-gray-500">Faktur Pajak PPN:</span>
                        <span className="font-bold text-emerald-600">{rfpNeedTaxInvoice ? 'Dibutuhkan (e-Faktur)' : 'Non-Faktur'}</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href={getRfpWaLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-orange/30 flex items-center justify-center gap-2"
                      >
                        <span>Kirim Draf Penawaran ke WhatsApp Dispatcher</span>
                        <span>→</span>
                      </a>
                      <button
                        onClick={handleResetRfp}
                        className="px-5 py-3.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                      >
                        Ajukan Penawaran Baru
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRfpSubmit} className="space-y-4">
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-navy">
                        Formulir Permintaan Penawaran B2B
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Lengkapi detail perusahaan Anda. Tim estimator kami akan menyiapkan draft penawaran resmi dalam 15-30 menit.
                      </p>
                    </div>

                    {/* Baris 1: Nama Perusahaan & Lokasi */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Nama PT / CV / Perusahaan <span className="text-orange">*</span>
                          </label>
                          <span className="text-[10px] text-cyan-dark font-semibold">15 Rekanan Terverifikasi</span>
                        </div>
                        <input
                          ref={rfpCompanyInputRef}
                          type="text"
                          required
                          list="rfp-corporate-clients-datalist"
                          value={rfpCompanyName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRfpCompanyName(val);
                            const matched = CORPORATE_CLIENTS.find(
                              (c) => c.name.toLowerCase() === val.toLowerCase()
                            );
                            if (matched) {
                              if (matched.location.includes('MM2100')) {
                                setRfpLocation('Kawasan Industri MM2100 Cikarang Barat');
                              } else if (matched.location.includes('Jababeka')) {
                                setRfpLocation('Kawasan Industri Jababeka 1-7');
                              } else if (matched.location.includes('GIIC') || matched.location.includes('Deltamas')) {
                                setRfpLocation('GIIC Deltamas Cikarang Pusat');
                              }
                            }
                          }}
                          placeholder="Contoh: PT Surya Manufaktur Indonesia"
                          className={`w-full px-4 py-2.5 rounded-xl border focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy transition ${
                            isRfpHighlighted
                              ? 'border-orange ring-2 ring-orange/40 bg-orange/5'
                              : 'border-gray-200'
                          }`}
                        />
                        <datalist id="rfp-corporate-clients-datalist">
                          {CORPORATE_CLIENTS.map((c) => (
                            <option key={c.id} value={c.name}>{c.sector} • {c.location}</option>
                          ))}
                        </datalist>

                        {/* Quick Selection Chips from Real Corporate Partners */}
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          <span className="text-[10px] text-gray-400 font-semibold mr-1">Pilih Rekanan:</span>
                          {CORPORATE_CLIENTS.slice(0, 6).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setRfpCompanyName(c.name);
                                if (c.location.includes('MM2100')) {
                                  setRfpLocation('Kawasan Industri MM2100 Cikarang Barat');
                                } else if (c.location.includes('Jababeka')) {
                                  setRfpLocation('Kawasan Industri Jababeka 1-7');
                                } else if (c.location.includes('Deltamas')) {
                                  setRfpLocation('GIIC Deltamas Cikarang Pusat');
                                }
                              }}
                              className={`px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer ${
                                rfpCompanyName === c.name
                                  ? 'bg-orange text-white font-bold'
                                  : 'bg-slate-100 hover:bg-slate-200 text-gray-600'
                              }`}
                              title={c.name}
                            >
                              {c.shortName}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Lokasi / Kawasan Industri
                        </label>
                        <select
                          value={rfpLocation}
                          onChange={(e) => setRfpLocation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy bg-white transition"
                        >
                          <option value="Kawasan Industri MM2100 Cikarang Barat">Kawasan Industri MM2100 Cikarang</option>
                          <option value="Kawasan Industri Jababeka 1-7">Kawasan Industri Jababeka</option>
                          <option value="GIIC Deltamas Cikarang Pusat">GIIC Deltamas Cikarang Pusat</option>
                          <option value="EJIP Industrial Park Cikarang Selatan">EJIP Industrial Park</option>
                          <option value="Delta Silicon Lippo Cikarang">Delta Silicon Lippo Cikarang</option>
                          <option value="Zona Pergudangan Cibitung & Tambun">Pergudangan Cibitung & Tambun</option>
                          <option value="Kota Bekasi (Perkantoran / Ruko / Mall)">Kota Bekasi (Gedung / Ruko / Mall)</option>
                          <option value="Wilayah Lainnya di Bekasi / Jawa Barat">Wilayah Lainnya di Bekasi</option>
                        </select>
                      </div>
                    </div>

                    {/* Baris 2: Nama PIC & Jabatan */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nama PIC Kontak <span className="text-orange">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={rfpPicName}
                          onChange={(e) => setRfpPicName(e.target.value)}
                          placeholder="Nama lengkap PIC"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Divisi / Jabatan
                        </label>
                        <select
                          value={rfpPicRole}
                          onChange={(e) => setRfpPicRole(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy bg-white transition"
                        >
                          <option value="Procurement / Purchasing">Procurement / Purchasing</option>
                          <option value="General Affairs (GA)">General Affairs (GA)</option>
                          <option value="HSE / SHE Officer">HSE / Safety & Environment</option>
                          <option value="Facility / Maintenance Manager">Facility / Maintenance Manager</option>
                          <option value="Building Manager / Pengelola">Building Manager / Pengelola</option>
                          <option value="Direktur / Pemilik Usaha">Direktur / Pemilik Usaha</option>
                        </select>
                      </div>
                    </div>

                    {/* Baris 3: No WhatsApp & Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nomor WhatsApp PIC <span className="text-orange">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={rfpPhone}
                          onChange={(e) => setRfpPhone(e.target.value)}
                          placeholder="08xxxxxxxxxx"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Email Kantor (Untuk Dokumen Penawaran)
                        </label>
                        <input
                          type="email"
                          value={rfpEmail}
                          onChange={(e) => setRfpEmail(e.target.value)}
                          placeholder="procurement@perusahaan.co.id"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy transition"
                        />
                      </div>
                    </div>

                    {/* Baris 4: Jenis Layanan & Estimasi Volume */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Kebutuhan Layanan
                        </label>
                        <select
                          value={rfpServiceType}
                          onChange={(e) => setRfpServiceType(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy bg-white transition"
                        >
                          <option value="Sedot Limbah STP / IPAL Pabrik">Sedot Limbah STP / IPAL Pabrik</option>
                          <option value="Cleaning / Blower Lumpur STP & Bak Endapan">Cleaning / Blower Lumpur STP & Bak Endapan</option>
                          <option value="Sedot Septic Tank Gedung / RS / Mall">Sedot Septic Tank Gedung / RS / Mall</option>
                          <option value="Kuras Grease Trap Sentral Kantin Pabrik">Kuras Grease Trap Sentral Kantin</option>
                          <option value="Pelancaran Pipa Mampet Hydro-Jetting">Pelancaran Pipa Mampet Hydro-Jetting</option>
                          <option value="Kontrak Rutin SLA Maintenance Tahunan">Kontrak Rutin SLA Maintenance Tahunan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Estimasi Volume / Kebutuhan
                        </label>
                        <select
                          value={rfpVolume}
                          onChange={(e) => setRfpVolume(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy bg-white transition"
                        >
                          <option value="4 - 8 m³ (1 - 2 Rit Truk)">4 - 8 m³ (1 - 2 Rit Truk)</option>
                          <option value="10 - 20 m³ (Armada Sedang/Besar)">10 - 20 m³ (Armada Sedang/Besar)</option>
                          <option value="25 - 50 m³ (Penyedotan Skala Pabrik)">25 - 50 m³ (Skala Pabrik)</option>
                          <option value="50+ m³ / Kontrak Berkala (SLA Pabrik)">50+ m³ / Kontrak Berkala (SLA Pabrik)</option>
                          <option value="Survei Lapangan Terlebih Dahulu">Survei Lapangan Terlebih Dahulu</option>
                        </select>
                      </div>
                    </div>

                    {/* Checkbox Faktur Pajak */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rfpNeedTaxInvoice}
                          onChange={(e) => setRfpNeedTaxInvoice(e.target.checked)}
                          className="w-4 h-4 text-cyan rounded border-gray-300 focus:ring-cyan"
                        />
                        <span className="font-semibold">
                          Perusahaan kami memerlukan <span className="text-navy font-bold">Faktur Pajak PPN (e-Faktur)</span>, Dokumen Manifest IPLT, dan BAST.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={rfpStatus === 'loading'}
                        className="w-full py-4 bg-orange hover:bg-orange-dark disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-orange/30 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {rfpStatus === 'loading' ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Memproses Draf Penawaran...</span>
                          </>
                        ) : (
                          <>
                            <span>Ajukan Permintaan Penawaran Resmi (RFP)</span>
                            <span>→</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[11px] text-gray-400 text-center leading-normal">
                      Data perusahaan Anda dilindungi kerahasiaannya dan hanya digunakan untuk keperluan kalkulasi teknis penawaran PT Kusuma Gemilang Raya.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kalkulator Estimasi Biaya & Booking Cepat */}
      <section id="kalkulator" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange/10 text-orange text-sm font-semibold mb-6">
              ✓ Estimasi Cepat & Transparan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Kalkulator Estimasi Biaya</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Hitung estimasi biaya layanan sedot tinja, grease trap, hingga cleaning blower lumpur secara otomatis dan transparan.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10 md:p-12 grid lg:grid-cols-12 gap-8 items-stretch mb-10">
            {/* Form Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
              <div>
                {/* Quick Selection Shortcuts */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Pilih Cepat Kategori Layanan:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const isManifest = currentCalcObj.option.toLowerCase().includes('manifes') && !currentCalcObj.option.toLowerCase().includes('non');
                        const targetIdx = isManifest ? 3 : 0;
                        setSelectedCalcOptionIndex(targetIdx);
                        setCalcPricePerCubic(calcOptions[targetIdx].value);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        currentCalcObj.type.includes('Black Water')
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-slate-50 text-gray-700 border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      Black Water (Tinja)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const isManifest = currentCalcObj.option.toLowerCase().includes('manifes') && !currentCalcObj.option.toLowerCase().includes('non');
                        const targetIdx = isManifest ? 4 : 1;
                        setSelectedCalcOptionIndex(targetIdx);
                        setCalcPricePerCubic(calcOptions[targetIdx].value);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        currentCalcObj.type.includes('Grey Water')
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-slate-50 text-gray-700 border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      Grey Water (Lemak)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const isManifest = currentCalcObj.option.toLowerCase().includes('manifes') && !currentCalcObj.option.toLowerCase().includes('non');
                        const targetIdx = isManifest ? 5 : 2;
                        setSelectedCalcOptionIndex(targetIdx);
                        setCalcPricePerCubic(calcOptions[targetIdx].value);
                      }}
                      className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        currentCalcObj.type.includes('Cleaning / Blower')
                          ? 'bg-orange text-white border-orange shadow-sm'
                          : 'bg-orange/10 text-orange-dark border-orange/30 hover:bg-orange/20'
                      }`}
                    >
                      ⚡ Cleaning / Blower
                    </button>
                  </div>
                </div>

                {/* Dropdown Select (All 6 options with id="calc-type") */}
                <div className="mb-5">
                  <label className="block text-sm font-bold text-navy mb-2 flex items-center justify-between">
                    <span>Jenis Limbah & Layanan</span>
                    <span className="text-xs font-semibold text-cyan">Pilihan Lengkap</span>
                  </label>
                  <select
                    id="calc-type"
                    value={selectedCalcOptionIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      setSelectedCalcOptionIndex(idx);
                      setCalcPricePerCubic(calcOptions[idx].value);
                    }}
                    className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-gray-800 bg-white font-medium text-xs sm:text-sm transition shadow-sm"
                  >
                    <optgroup label="📋 Opsi Non Manifes:">
                      <option value={0}>Limbah Black Water (Tinja) - Rp 700.000 / kubik (Non Manifes)</option>
                      <option value={1}>Limbah Grey Water (Lumpur, Lemak) - Rp 1.100.000 / kubik (Non Manifes)</option>
                      <option value={2}>Cleaning / Blower Lumpur - Rp 1.100.000 / kubik (Non Manifes)</option>
                    </optgroup>
                    <optgroup label="📜 Opsi Dengan Manifes Resmi IPLT:">
                      <option value={3}>Limbah Black Water (Tinja) - Rp 1.100.000 / kubik (Manifes)</option>
                      <option value={4}>Limbah Grey Water (Lumpur, Lemak) - Rp 1.500.000 / kubik (Manifes)</option>
                      <option value={5}>Cleaning / Blower Lumpur - Rp 1.500.000 / kubik (Manifes)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Opsi Dokumen Manifest Toggle */}
                <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Kebutuhan Dokumen Manifest IPLT:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        let targetIdx = selectedCalcOptionIndex;
                        if (targetIdx >= 3) targetIdx -= 3;
                        setSelectedCalcOptionIndex(targetIdx);
                        setCalcPricePerCubic(calcOptions[targetIdx].value);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedCalcOptionIndex < 3
                          ? 'bg-navy text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Non Manifes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        let targetIdx = selectedCalcOptionIndex;
                        if (targetIdx < 3) targetIdx += 3;
                        setSelectedCalcOptionIndex(targetIdx);
                        setCalcPricePerCubic(calcOptions[targetIdx].value);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedCalcOptionIndex >= 3
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      Dengan Manifes (Resmi)
                    </button>
                  </div>
                </div>

                {/* Volume Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-bold text-navy">Volume Limbah (Kubik / m³)</label>
                    <span className="text-xs text-gray-500">1 Rit armada = 4 - 8 kubik</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      id="calc-volume"
                      value={calcVolume}
                      min={1}
                      max={100}
                      onChange={(e) => setCalcVolume(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-navy font-bold text-base shadow-sm"
                    />
                    <div className="flex gap-1.5 flex-shrink-0">
                      {[1, 2, 4, 8].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setCalcVolume(v)}
                          className={`px-3 py-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            calcVolume === v
                              ? 'bg-cyan text-navy border-cyan'
                              : 'bg-slate-100 hover:bg-slate-200 text-gray-700 border-gray-200'
                          }`}
                        >
                          {v} m³
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice info */}
              <div className="p-3 bg-cyan/10 rounded-xl border border-cyan/20 text-xs text-gray-700 flex items-start gap-2">
                <span className="text-cyan font-bold text-base leading-none">ℹ</span>
                <span>
                  <strong>Cleaning / Blower Lumpur:</strong> Layanan khusus pemecahan dan penyedotan lumpur padat membandel di dasar bak endapan/STP menggunakan mesin blower vakum bertekanan tinggi.
                </span>
              </div>
            </div>

            {/* Result & CTA Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-navy via-navy-light to-navy p-6 sm:p-8 rounded-3xl text-white flex flex-col justify-between shadow-2xl relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan/15 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange/15 rounded-full blur-2xl pointer-events-none"></div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-cyan-light font-bold uppercase tracking-wider">Ringkasan Estimasi</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-white border border-white/20">
                    {currentCalcObj.option}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>Jenis Layanan:</span>
                    <span className="font-bold text-white text-right max-w-[180px] truncate">{currentCalcObj.type}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tarif per Kubik:</span>
                    <span className="font-bold text-cyan">{formatRupiah(calcPricePerCubic)} / m³</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Volume Dihitung:</span>
                    <span className="font-bold text-white">{calcVolume} m³ (Kubik)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-center">
                  <p className="text-gray-300 text-xs uppercase tracking-wider mb-1">Estimasi Total Biaya</p>
                  <h3 id="calc-total" className="text-3xl sm:text-4xl font-extrabold text-cyan mb-1 tracking-tight">
                    {formatRupiah(totalEstimation)}
                  </h3>
                  <p className="text-[11px] text-gray-400">Termasuk armada, selang hisap & teknisi lapangan</p>
                </div>
              </div>

              <div className="relative z-10 pt-6 space-y-2.5">
                <a
                  id="wa-calculator"
                  href={calcWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-orange text-white text-sm sm:text-base font-bold rounded-2xl hover:bg-orange-dark transition shadow-lg shadow-orange/30 gap-2 cursor-pointer text-center"
                >
                  <span>Booking Cepat via WhatsApp</span>
                  <span>→</span>
                </a>
                <p className="text-[10px] text-gray-400 text-center leading-tight">
                  *Harga transparan dan terukur. Untuk korporat (PT), faktur pajak PPN & manifest IPLT diterbitkan sesuai PO.
                </p>
              </div>
            </div>
          </div>

          {/* Rincian Tarif Transparan 3 Kolom */}
          <div className="grid md:grid-cols-3 gap-5">
            {/* Card 1: Black Water */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-cyan/50 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-navy uppercase tracking-wider">Black Water (Tinja)</span>
                <span className="text-xs text-gray-500">Septic Tank</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Non Manifes:</span>
                  <span className="font-extrabold text-navy text-sm">Rp 700.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Dengan Manifes:</span>
                  <span className="font-extrabold text-cyan-dark text-sm">Rp 1.100.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal border-t border-gray-100 pt-3">
                Penyedotan rutin limbah tinja rumah tinggal, perumahan cluster, ruko, dan kos-kosan di seluruh Bekasi.
              </p>
            </div>

            {/* Card 2: Grey Water */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-cyan/50 transition">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-navy uppercase tracking-wider">Grey Water (Lumpur/Lemak)</span>
                <span className="text-xs text-gray-500">Grease Trap</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Non Manifes:</span>
                  <span className="font-extrabold text-navy text-sm">Rp 1.100.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Dengan Manifes:</span>
                  <span className="font-extrabold text-cyan-dark text-sm">Rp 1.500.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal border-t border-gray-100 pt-3">
                Pengurasan lemak minyak katering, restoran F&B, hotel, dan limbah buangan cair non-B3 komersial.
              </p>
            </div>

            {/* Card 3: Cleaning / Blower Lumpur (User's specific request) */}
            <div className="bg-white p-6 rounded-2xl border-2 border-orange/40 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange text-white text-[10px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider">
                Heavy Duty
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-orange uppercase tracking-wider">Cleaning / Blower Lumpur</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-700 font-semibold">Non Manifes:</span>
                  <span className="font-extrabold text-orange text-sm">Rp 1.100.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-700 font-semibold">Dengan Manifes:</span>
                  <span className="font-extrabold text-navy text-sm">Rp 1.500.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
              </div>
              <p className="text-[11px] text-gray-600 leading-normal border-t border-gray-100 pt-3">
                Pemecahan dan penyedotan lumpur padat mengendap di bak STP/IPAL pabrik & septic tank lama dengan semprotan & blower tekanan tinggi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Proses Layanan Kami */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Proses Layanan Kami</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Mudah, cepat, dan transparan.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200"></div>

            <div className="relative text-center">
              <div className="w-16 h-16 bg-white border-2 border-orange text-orange rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4 relative z-10">1</div>
              <h4 className="text-lg font-bold text-navy mb-2">Hubungi Kami</h4>
              <p className="text-sm text-gray-600">Kontak via WhatsApp atau telepon untuk konsultasi awal.</p>
            </div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-white border-2 border-orange text-orange rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4 relative z-10">2</div>
              <h4 className="text-lg font-bold text-navy mb-2">Konsultasi & Penjadwalan</h4>
              <p className="text-sm text-gray-600">Estimasi harga dan tentukan waktu kunjungan teknisi.</p>
            </div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-white border-2 border-orange text-orange rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4 relative z-10">3</div>
              <h4 className="text-lg font-bold text-navy mb-2">Teknisi Datang ke Lokasi</h4>
              <p className="text-sm text-gray-600">Armada dan teknisi datang sesuai jadwal yang disepakati.</p>
            </div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-white border-2 border-orange text-orange rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-4 relative z-10">4</div>
              <h4 className="text-lg font-bold text-navy mb-2">Pekerjaan Selesai</h4>
              <p className="text-sm text-gray-600">Sanitasi bersih, layanan tuntas, dan lokasi rapi kembali.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dokumentasi Section dengan Responsive Image Carousel & Swipe Gestures */}
      <section id="dokumentasi" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-cyan/10 text-cyan-dark border border-cyan/20 inline-flex items-center gap-1.5 uppercase tracking-wider mb-3">
              📷 BUKTI KERJA NYATA LAPANGAN
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-1">
              Dokumentasi Pekerjaan Lapangan
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Kompilasi foto dokumentasi pengerjaan nyata armada dan teknisi PT Kusuma Gemilang Raya di pabrik industri B2B, perumahan, dan pusat komersial Bekasi.
            </p>
          </div>

          {/* Carousel Controls & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0 hidden sm:inline">
                Kategori:
              </span>
              {(['Semua', 'Industri & B2B', 'Residensial', 'Komersial & Resto', 'Pelancaran Pipa'] as const).map((cat) => {
                const count =
                  cat === 'Semua'
                    ? documentationItems.length
                    : documentationItems.filter((i) => i.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setDocCategoryFilter(cat);
                      setDocCarouselIndex(0);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      docCategoryFilter === cat
                        ? 'bg-navy text-white shadow-sm'
                        : 'bg-slate-100 text-gray-600 hover:bg-slate-200 hover:text-navy'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Carousel Navigation Actions */}
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
              {/* Sort By Dropdown for Job Management */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-gray-200">
                <label htmlFor="doc-sort-by" className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0">
                  <span>↕️</span>
                  <span className="hidden sm:inline">Sort by:</span>
                </label>
                <select
                  id="doc-sort-by"
                  value={docSortBy}
                  onChange={(e) => {
                    setDocSortBy(e.target.value as 'Newest' | 'Oldest' | 'Alphabetical');
                    setDocCarouselIndex(0);
                  }}
                  className="bg-transparent text-xs font-bold text-navy focus:outline-none cursor-pointer pr-1"
                  aria-label="Urutkan dokumentasi pekerjaan"
                >
                  <option value="Newest">Newest (Terbaru)</option>
                  <option value="Oldest">Oldest (Terlama)</option>
                  <option value="Alphabetical">Alphabetical (A - Z)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-navy bg-slate-100 px-3 py-1.5 rounded-xl border border-gray-200">
                  Foto {docCarouselIndex + 1} - {Math.min(docCarouselIndex + docItemsPerView, filteredDocumentation.length)} dari {filteredDocumentation.length}
                </span>

                <button
                  type="button"
                  onClick={() => setIsDocAutoPlay(!isDocAutoPlay)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1 cursor-pointer ${
                    isDocAutoPlay
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-gray-600 border-gray-200'
                  }`}
                  title={isDocAutoPlay ? 'Jeda Putar Otomatis' : 'Mulai Putar Otomatis'}
                >
                  <span>{isDocAutoPlay ? '⏸ Auto' : '▶ Play'}</span>
                </button>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDocPrev}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition border border-gray-200 cursor-pointer shadow-sm active:scale-95"
                  aria-label="Foto Sebelumnya"
                  title="Foto Sebelumnya"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleDocNext}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-navy hover:text-white text-navy flex items-center justify-center transition border border-gray-200 cursor-pointer shadow-sm active:scale-95"
                  aria-label="Foto Selanjutnya"
                  title="Foto Selanjutnya"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Swipe Hint for Touch Devices */}
          <div className="flex items-center justify-between mb-3 px-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 text-cyan-dark font-medium">
              <span>👉</span>
              <span>Geser kartu (swipe) pada layar sentuh untuk menelusuri foto</span>
            </span>
            <span className="hidden sm:inline text-gray-400 text-[11px]">
              Klik pada foto untuk melihat ukuran penuh
            </span>
          </div>

          {/* Responsive Carousel Viewport */}
          <div
            className="overflow-hidden relative rounded-3xl touch-pan-y"
            onTouchStart={handleDocTouchStart}
            onTouchMove={handleDocTouchMove}
            onTouchEnd={handleDocTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out py-2"
              style={{
                transform: `translateX(-${(docCarouselIndex * 100) / docItemsPerView}%)`,
              }}
            >
              {filteredDocumentation.map((item) => (
                <div
                  key={item.id}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-2 sm:px-3"
                >
                  <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group">
                    {/* Image Container with Zoom & Badges */}
                    <div
                      className="relative h-52 sm:h-60 overflow-hidden bg-slate-900 cursor-pointer"
                      onClick={() => setActiveDocPreview(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-black/30 pointer-events-none"></div>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-navy/80 backdrop-blur-md text-white border border-white/20">
                          {item.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange/90 backdrop-blur-md text-white">
                          {item.tag}
                        </span>
                      </div>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                        <span className="px-4 py-2 rounded-xl bg-white text-navy font-bold text-xs shadow-lg transform -translate-y-1 group-hover:translate-y-0 transition-all flex items-center gap-1.5">
                          <span>🔍</span>
                          <span>Lihat Resolusi Penuh</span>
                        </span>
                      </div>

                      {/* Location Chip on Image Bottom */}
                      <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                        <span className="text-[11px] font-bold text-cyan-light flex items-center gap-1 drop-shadow-md">
                          <span>📍</span>
                          <span className="truncate">{item.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-extrabold text-navy text-base leading-snug group-hover:text-cyan transition-colors mb-2">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-xs line-clamp-3 leading-relaxed mb-4">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-medium text-gray-400">
                            📅 {item.date}
                          </span>
                          {item.lastUpdated && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title={`Diperbarui: ${item.lastUpdated}`}></span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveDocPreview(item)}
                          className="text-xs font-bold text-orange hover:text-orange-dark transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>Detail</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Space-Saving Interactive Thumbnail Strip */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-navy flex items-center gap-1.5">
                <span>📑</span>
                <span>Pilih Foto Cepat ({filteredDocumentation.length} Dokumentasi):</span>
              </span>
              <span className="text-[11px] text-gray-500">
                Klik thumbnail untuk berpindah foto
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {filteredDocumentation.map((item, idx) => {
                const isActive =
                  idx >= docCarouselIndex && idx < docCarouselIndex + docItemsPerView;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDocCarouselIndex(Math.min(idx, maxDocIndex));
                    }}
                    className={`relative w-16 sm:w-20 h-12 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all border cursor-pointer ${
                      isActive
                        ? 'ring-2 ring-orange border-orange scale-105 shadow-md opacity-100'
                        : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                    title={item.title}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                      #{item.id}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Detail & Fullscreen Preview Dokumentasi dengan Fitur Quick Edit */}
        {activeDocPreview && (
          <div
            role="dialog"
            aria-label="Pratinjau Foto Dokumentasi"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={handleCloseDocPreview}
          >
            <div
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-navy text-white flex items-center justify-between border-b border-white/10 gap-3">
                <div className="pr-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan/20 text-cyan-light border border-cyan/40">
                      {activeDocPreview.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange/20 text-orange border border-orange/40">
                      {activeDocPreview.tag}
                    </span>
                    {activeDocPreview.lastUpdated && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden sm:inline-flex items-center gap-1">
                        <span>✓</span>
                        <span>Diperbarui</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug">
                    {activeDocPreview.title}
                  </h3>
                </div>

                {/* Header Action Buttons (Download Invoice PDF, Quick Edit & Close) */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownloadDocInvoicePdf()}
                    disabled={isDownloadingDocInvoicePdf}
                    className="px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 disabled:opacity-60"
                    title="Unduh Salinan Resmi Invoice & BAST PDF untuk Finance Klien"
                  >
                    {isDownloadingDocInvoicePdf ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span className="hidden sm:inline">Mengunduh...</span>
                      </>
                    ) : (
                      <>
                        <span>📄</span>
                        <span className="hidden sm:inline">Unduh</span>
                        <span>Invoice PDF</span>
                      </>
                    )}
                  </button>

                  {!isEditingDocPreview ? (
                    <button
                      type="button"
                      onClick={handleStartQuickEdit}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        isDocAuthorized
                          ? 'bg-amber-400 hover:bg-amber-500 text-navy'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                      title={isDocAuthorized ? 'Edit deskripsi atau tanggal' : 'Masuk sebagai petugas berwenang untuk Quick Edit'}
                    >
                      <span>✏️</span>
                      <span>Quick Edit</span>
                      {isDocAuthorized && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelQuickEdit}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseDocPreview}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
                    title="Tutup Pratinjau"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
                {/* Image Container with Badge */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 max-h-[380px] sm:max-h-[420px] flex items-center justify-center shadow-inner group">
                  <img
                    src={activeDocPreview.image}
                    alt={activeDocPreview.title}
                    className="w-full max-h-[380px] sm:max-h-[420px] object-contain"
                  />
                  {isEditingDocPreview && (
                    <div className="absolute top-3 left-3 bg-amber-500/90 backdrop-blur-md text-navy font-black text-[10px] px-3 py-1 rounded-full shadow-lg border border-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-navy animate-ping"></span>
                      <span>MODE EDIT AKTIF</span>
                    </div>
                  )}
                </div>

                {/* Normal View vs Inline Quick Edit Mode */}
                {!isEditingDocPreview ? (
                  <div className="space-y-3 text-xs sm:text-sm">
                    {/* Metadata Row: Location, Date & LastUpdated */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-gray-500 text-xs pb-3 border-b border-gray-100">
                      <span className="font-bold text-navy flex items-center gap-1.5">
                        <span>📍</span> {activeDocPreview.location}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-gray-200">
                          📅 {activeDocPreview.date}
                        </span>
                        {activeDocPreview.lastUpdated && (
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            🔄 {activeDocPreview.lastUpdated}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-gray-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Uraian Pekerjaan Lapangan:
                        </span>
                        <button
                          type="button"
                          onClick={handleStartQuickEdit}
                          className="text-xs text-amber-700 hover:text-amber-900 font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>✏️ Ubah</span>
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                        {activeDocPreview.description}
                      </p>
                    </div>

                    {/* Quick Edit Status Banner */}
                    <div className="flex items-center justify-between p-3 rounded-2xl border transition-all text-xs bg-gradient-to-r from-slate-50 to-amber-50/40 border-amber-200/70">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{isDocAuthorized ? '🟢' : '🔐'}</span>
                        <div>
                          <div className="font-bold text-navy">
                            {isDocAuthorized
                              ? 'Akses Petugas Berwenang Aktif'
                              : 'Fitur Quick Edit untuk Petugas'}
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {isDocAuthorized
                              ? 'Anda dapat memperbarui deskripsi dan tanggal dokumentasi ini secara instan.'
                              : 'Perbarui tanggal pengerjaan atau catatan deskripsi lapangan.'}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleStartQuickEdit}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-navy font-bold text-xs transition shrink-0 cursor-pointer shadow-sm flex items-center gap-1"
                      >
                        <span>✏️</span>
                        <span>{isDocAuthorized ? 'Edit Sekarang' : 'Otorisasi & Edit'}</span>
                      </button>
                    </div>

                    {/* Finance Team & BAST Document Card */}
                    <div className="p-4 bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-slate-50 rounded-2xl border-2 border-emerald-300/80 shadow-sm space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-emerald-200/80">
                        <div className="flex items-center gap-2.5">
                          <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-base font-bold shadow-sm shrink-0">
                            📄
                          </span>
                          <div>
                            <div className="font-extrabold text-navy text-xs sm:text-sm flex items-center gap-2 flex-wrap">
                              <span>Salinan Invoice Resmi & Berita Acara (BAST)</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 border border-emerald-300">
                                NIB: 0220108920194
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-600">
                              Disediakan khusus untuk tim Finance, Purchasing & HSE klien guna verifikasi tagihan, pelaporan pajak (PPN 11%) & audit IPLT mandiri.
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDownloadDocInvoicePdf()}
                          disabled={isDownloadingDocInvoicePdf}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-60"
                          title="Unduh berkas PDF Invoice & BAST resmi"
                        >
                          {isDownloadingDocInvoicePdf ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                              <span>Menyiapkan PDF...</span>
                            </>
                          ) : (
                            <>
                              <span>📥</span>
                              <span>Unduh Invoice PDF</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                          <span className="text-gray-500 block text-[10px] font-semibold">NO. INVOICE</span>
                          <span className="font-bold text-navy">INV/KGR/2026/{String(activeDocPreview.id).padStart(4, '0')}</span>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                          <span className="text-gray-500 block text-[10px] font-semibold">NO. BAST RESMI</span>
                          <span className="font-bold text-navy">BAST/KGR/2026/DOC-{String(activeDocPreview.id).padStart(4, '0')}</span>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                          <span className="text-gray-500 block text-[10px] font-semibold">TANGGAL SELESAI</span>
                          <span className="font-bold text-emerald-700">📅 {activeDocPreview.date}</span>
                        </div>
                        <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                          <span className="text-gray-500 block text-[10px] font-semibold">STATUS AUDIT</span>
                          <span className="font-bold text-emerald-700">✓ Berizin IPLT & K3</span>
                        </div>
                      </div>

                      {/* Customizable PO / Client Name Toggle */}
                      <div className="pt-0.5">
                        {!showDocInvoiceOptions ? (
                          <button
                            type="button"
                            onClick={() => setShowDocInvoiceOptions(true)}
                            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer underline decoration-dotted"
                          >
                            <span>⚙️ Kustomisasi No. PO atau Nama PT Klien sebelum unduh (Opsional)</span>
                          </button>
                        ) : (
                          <div className="bg-white/95 p-3 rounded-xl border border-emerald-200 space-y-2 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between text-[11px] font-bold text-navy">
                              <span>Kustomisasi Header Invoice & BAST</span>
                              <button
                                type="button"
                                onClick={() => setShowDocInvoiceOptions(false)}
                                className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                              >
                                ✕ Tutup
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Nama Perusahaan / Unit Finance Klien</label>
                                <input
                                  type="text"
                                  value={docInvoiceClientName}
                                  onChange={(e) => setDocInvoiceClientName(e.target.value)}
                                  placeholder={`Contoh: Tim Procurement (${activeDocPreview.location})`}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Nomor Purchase Order (PO) Klien</label>
                                <input
                                  type="text"
                                  value={docInvoicePoNumber}
                                  onChange={(e) => setDocInvoicePoNumber(e.target.value)}
                                  placeholder="Contoh: PO-KLIEN/2026/089"
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() => handleDownloadDocInvoicePdf()}
                                disabled={isDownloadingDocInvoicePdf}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                              >
                                <span>📥 Unduh PDF dengan Kustomisasi</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp Inquiry CTA */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className="text-xs text-gray-600">
                        Butuh penanganan serupa untuk pabrik atau properti Anda?
                      </span>
                      <a
                        href={`https://wa.me/6289675064916?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya melihat dokumentasi proyek "${activeDocPreview.title}" (${activeDocPreview.location}) dan ingin konsultasi kebutuhan sanitasi serupa.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shrink-0 flex items-center gap-1.5 shadow-sm"
                      >
                        <span>💬 Tanya via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Inline Quick Edit Form */
                  <form onSubmit={handleSaveQuickEdit} className="space-y-4 bg-amber-50/70 p-4 sm:p-5 rounded-2xl border-2 border-amber-300 shadow-sm animate-in fade-in duration-200">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                        <h4 className="font-extrabold text-navy text-xs sm:text-sm uppercase tracking-wide">
                          Quick Edit: Formulir Pembaruan Dokumentasi
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Petugas Berwenang
                      </span>
                    </div>

                    {/* Input: Tanggal Dokumentasi */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-navy flex items-center gap-1">
                          <span>📅 Tanggal Pengerjaan Dokumentasi</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              const now = new Date();
                              const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
                              setEditDocDate(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
                            }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer"
                          >
                            Hari Ini
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const y = new Date();
                              y.setDate(y.getDate() - 1);
                              const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
                              setEditDocDate(`${y.getDate()} ${months[y.getMonth()]} ${y.getFullYear()}`);
                            }}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 transition cursor-pointer"
                          >
                            Kemarin
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={editDocDate}
                        onChange={(e) => setEditDocDate(e.target.value)}
                        placeholder="Contoh: 11 Okt 2026"
                        required
                        className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white font-medium"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Format tanggal tampilan publik (misal: 11 Okt 2026).
                      </p>
                    </div>

                    {/* Input: Deskripsi Pekerjaan */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-navy flex items-center gap-1">
                          <span>📝 Deskripsi Detail Pekerjaan Lapangan</span>
                          <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-gray-500">{editDocDescription.length} karakter</span>
                      </div>
                      <textarea
                        value={editDocDescription}
                        onChange={(e) => setEditDocDescription(e.target.value)}
                        rows={4}
                        placeholder="Tuliskan laporan kondisi lapangan, jenis armada, volume limbah, dan SOP pengerjaan..."
                        required
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white leading-relaxed font-normal"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Uraian ini akan langsung diperbarui pada kartu carousel dan pratinjau modal.
                      </p>
                    </div>

                    {/* Action buttons inside edit form */}
                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={handleCancelQuickEdit}
                        disabled={isDocSaving}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs border border-gray-300 transition cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isDocSaving}
                        className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-dark text-white font-bold text-xs transition shadow-md cursor-pointer flex items-center gap-2"
                      >
                        {isDocSaving ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Menyimpan...</span>
                          </>
                        ) : (
                          <>
                            <span>💾</span>
                            <span>Simpan Perubahan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Dokumentasi Resmi PT Kusuma Gemilang Raya
                </span>
                <div className="flex items-center gap-2">
                  {!isEditingDocPreview ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDownloadDocInvoicePdf()}
                        disabled={isDownloadingDocInvoicePdf}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-60"
                        title="Unduh Salinan Berkas Invoice & BAST Resmi (.PDF)"
                      >
                        {isDownloadingDocInvoicePdf ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Mengunduh...</span>
                          </>
                        ) : (
                          <>
                            <span>📄</span>
                            <span>Unduh Invoice PDF</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleStartQuickEdit}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-navy font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <span>✏️</span>
                        <span>Quick Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseDocPreview}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs transition cursor-pointer"
                      >
                        Tutup
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelQuickEdit}
                      className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs transition cursor-pointer"
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Otorisasi Petugas Lapangan untuk Quick Edit */}
        {isDocAuthModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Verifikasi Otorisasi Petugas Lapangan"
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setIsDocAuthModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 bg-navy text-white flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-lg border border-amber-400/40">
                    🔐
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">
                      Otorisasi Petugas Lapangan
                    </h3>
                    <p className="text-[11px] text-gray-300">
                      PT Kusuma Gemilang Raya
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDocAuthModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Fitur <strong>Quick Edit</strong> diperuntukkan bagi staf, supervisor lapangan, dan tim dokumentasi resmi untuk memperbarui deskripsi dan tanggal pengerjaan secara langsung dari modal pratinjau.
                </p>

                <form onSubmit={handleVerifyDocAuth} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-navy mb-1">
                      Masukkan PIN Petugas / Kredensial:
                    </label>
                    <input
                      type="password"
                      value={docAuthPin}
                      onChange={(e) => {
                        setDocAuthPin(e.target.value);
                        if (docAuthError) setDocAuthError('');
                      }}
                      placeholder="Masukkan PIN (e.g. 1234)"
                      autoFocus
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-slate-50"
                    />
                    {docAuthError && (
                      <p className="text-xs text-red-600 font-medium mt-1">
                        {docAuthError}
                      </p>
                    )}
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                    💡 <strong>Akses Cepat Pengujian:</strong> Masukkan PIN <code>1234</code> atau klik tombol otorisasi langsung di bawah.
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-navy hover:bg-navy-dark text-white font-bold text-xs transition shadow-sm cursor-pointer"
                    >
                      Verifikasi PIN
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickAuthorizeDirect}
                      className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      ✓ Otorisasi Langsung
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-3 bg-slate-50 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => setIsDocAuthModalOpen(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Galeri Foto Proyek Teknisi di Lapangan */}
      <section id="galeri" className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/10 text-cyan-dark text-sm font-semibold mb-4">
              ✓ Dokumentasi Nyata & Pekerjaan di Lapangan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
              Galeri Foto Proyek Teknisi Lapangan
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Dokumentasi visual nyata para teknisi profesional PT Kusuma Gemilang Raya saat menangani berbagai proyek sanitasi, pengurasan septic tank, pelancaran saluran pipa, dan penyedotan limbah di Bekasi.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              {galleryCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedGalleryCategory(category)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    selectedGalleryCategory === category
                      ? 'bg-navy text-white shadow-md'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Gallery Grid with Hover Zoom Effect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                onClick={() => setLightboxIndex(index)}
                className="group relative overflow-hidden rounded-3xl bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-[4/3] border border-gray-100"
              >
                {/* Image with Hover Zoom */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-115 group-hover:rotate-0.5"
                  loading="lazy"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                {/* Top Floating Badge & Zoom Icon */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy/80 backdrop-blur-md text-cyan border border-cyan/30">
                    {project.tag}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:bg-orange shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>

                {/* Bottom Content info */}
                <div className="absolute bottom-0 inset-x-0 p-6 z-10 transform transition-transform duration-300">
                  <div className="flex items-center text-xs text-orange font-semibold mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{project.location}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-light transition leading-snug mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition">
                    {project.description}
                  </p>
                  <div className="mt-3 flex items-center text-xs font-semibold text-cyan-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Lihat Ukuran Penuh</span>
                    <span className="ml-1">🔍</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick CTA Bottom of Gallery */}
          <div className="mt-12 text-center bg-slate-50 p-6 md:p-8 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="text-left">
              <h4 className="text-base font-bold text-navy">Butuh penanganan serupa di rumah, ruko, atau pabrik Anda?</h4>
              <p className="text-sm text-gray-600">Teknisi kami siap meluncur ke lokasi Anda di seluruh penjuru Bekasi.</p>
            </div>
            <a
              href="https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20tertarik%20dengan%20hasil%20proyek%20di%20galeri%20dan%20ingin%20konsultasi%20layanan."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-dark transition shadow-md whitespace-nowrap flex-shrink-0"
            >
              Konsultasi WhatsApp Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredProjects[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-navy-dark border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-navy/60">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan/20 text-cyan">
                  {filteredProjects[lightboxIndex].category}
                </span>
                <span className="text-xs text-gray-400">
                  {lightboxIndex + 1} dari {filteredProjects.length} Foto
                </span>
              </div>
              <button
                onClick={() => setLightboxIndex(null)}
                aria-label="Tutup Galeri"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Image Area with Zoom & Navigation */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] max-h-[60vh]">
              <img
                src={filteredProjects[lightboxIndex].image}
                alt={filteredProjects[lightboxIndex].title}
                className="w-full h-full max-h-[60vh] object-contain transition-transform duration-300 hover:scale-105"
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredProjects.length) % filteredProjects.length : 0));
                }}
                aria-label="Foto Sebelumnya"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition focus:outline-none border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredProjects.length : 0));
                }}
                aria-label="Foto Selanjutnya"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition focus:outline-none border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Modal Caption and Action */}
            <div className="p-5 sm:p-6 bg-navy text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 pr-4">
                <div className="flex items-center text-xs text-orange font-semibold mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{filteredProjects[lightboxIndex].location}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {filteredProjects[lightboxIndex].title}
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {filteredProjects[lightboxIndex].description}
                </p>
              </div>
              <a
                href={`https://wa.me/6289675064916?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya melihat foto proyek "${filteredProjects[lightboxIndex].title}" di galeri dan ingin konsultasi kebutuhan sanitasi serupa di lokasi saya.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition shadow-lg whitespace-nowrap flex items-center"
              >
                Tanya Layanan Ini via WA
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Testimoni Section dengan Sistem Rating Bintang & Nilai Kepuasan Kuantitatif */}
      <section id="testimoni" className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 border border-amber-300/60 inline-flex items-center gap-1.5 uppercase tracking-wider mb-3">
              ⭐ SISTEM RATING & INDEKS KEPUASAN PELANGGAN
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-1">
              Nilai Kepuasan Klien & Bukti Pelayanan Terverifikasi
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
              Penilaian kuantitatif transparan berbasis skala bintang 1–5 dari pelanggan perumahan, pengelola komersial, dan divisi HSE/GA pabrik industri di Bekasi.
            </p>
          </div>

          {/* Overall Quantitative Scoreboard & Category Filters */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Score Metric Column */}
              <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 via-orange to-amber-600 text-white flex flex-col items-center justify-center shadow-lg shadow-orange/20 shrink-0">
                  <span className="text-3xl font-black leading-none">{overallAverageRating}</span>
                  <span className="text-[11px] font-bold opacity-90 mt-1">dari 5.0</span>
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 mb-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <h3 className="font-extrabold text-navy text-base sm:text-lg">
                    Indeks Kepuasan Klien (CSAT: 99.6%)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Akumulasi {totalVotesCount}+ ulasan & penilaian kepuasan kuantitatif terverifikasi
                  </p>
                </div>
              </div>

              {/* Verified Performance Metrics */}
              <div className="md:col-span-7 flex flex-wrap gap-2.5 sm:gap-3 items-center justify-center md:justify-end">
                <div className="bg-slate-50 border border-gray-200/80 rounded-xl px-3.5 py-2 text-left">
                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                    <span>⏱️</span> Ketepatan Waktu Armada
                  </div>
                  <div className="font-bold text-navy text-xs sm:text-sm mt-0.5">
                    99.8% Tiba Sesuai Jadwal
                  </div>
                </div>
                <div className="bg-slate-50 border border-gray-200/80 rounded-xl px-3.5 py-2 text-left">
                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                    <span>🛡️</span> Higienitas & K3 CSMS
                  </div>
                  <div className="font-bold text-navy text-xs sm:text-sm mt-0.5">
                    100% APD & Bebas Ceceran
                  </div>
                </div>
                <div className="bg-slate-50 border border-gray-200/80 rounded-xl px-3.5 py-2 text-left">
                  <div className="text-[11px] text-gray-500 font-medium flex items-center gap-1.5">
                    <span>📋</span> Legalitas Pembuangan IPLT
                  </div>
                  <div className="font-bold text-navy text-xs sm:text-sm mt-0.5">
                    100% Manifes & Berita Acara
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Pills & Write Review Button */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-xs font-semibold text-gray-500 mr-2 shrink-0 hidden sm:inline">
                  Filter Kategori:
                </span>
                {(['Semua', 'Residensial', 'Industri & B2B', 'Komersial'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setTestimonialCategoryFilter(cat);
                      setActiveTestimonial(0);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      testimonialCategoryFilter === cat
                        ? 'bg-navy text-white shadow-sm'
                        : 'bg-slate-100 text-gray-600 hover:bg-slate-200 hover:text-navy'
                    }`}
                  >
                    {cat} {cat === 'Semua' ? `(${testimonials.length})` : ''}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-orange hover:bg-orange-dark text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⭐</span>
                <span>Beri Rating & Tulis Testimoni Baru</span>
              </button>
            </div>
          </div>

          {/* Testimonial Carousel with Interactive Star Rating on Every Card */}
          <div className="relative overflow-hidden">
            <div
              id="testimonial-track"
              className="testimonial-track flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}
            >
              {currentTestimonials.map((t) => {
                const isHovered = hoveredCardRating?.id === t.id;
                const activeStarDisplay = isHovered ? hoveredCardRating.star : (t.userGivenRating || Math.round(t.rating));
                const satisfactionLabels: Record<number, string> = {
                  1: '1.0 ★ Kurang Puas',
                  2: '2.0 ★ Cukup',
                  3: '3.0 ★ Baik',
                  4: '4.0 ★ Sangat Baik',
                  5: '5.0 ★ Luar Biasa / Sangat Puas!',
                };

                return (
                  <div key={t.id} className="min-w-full p-2 sm:p-4">
                    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-gray-200 mx-auto max-w-3xl">
                      {/* Card Header: Category & Verified Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan/10 text-cyan-dark border border-cyan/20">
                            {t.category}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1">
                            <span>✓</span> Pelanggan Terverifikasi
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          📅 {t.date}
                        </span>
                      </div>

                      {/* Prominent Quantitative Rating Badge */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                        <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-2xl">
                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-base font-black text-navy ml-1">
                            {t.rating.toFixed(1)} / 5.0
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">
                          ({t.totalVotes} Penilaian Kuantitatif Klien)
                        </span>
                      </div>

                      {/* Testimonial Quote Text */}
                      <p className="text-gray-700 text-base sm:text-lg italic mb-6 leading-relaxed text-center font-normal px-2 sm:px-6">
                        {t.text}
                      </p>

                      {/* Customer Author Identity */}
                      <div className="flex items-center justify-center space-x-3 mb-6">
                        <div className={`w-12 h-12 ${t.bgColor} rounded-full flex items-center justify-center font-bold text-lg ${t.textColor} shadow-inner`}>
                          {t.initial}
                        </div>
                        <div className="text-left">
                          <p className="font-extrabold text-navy text-base">{t.author}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{t.role}</p>
                        </div>
                      </div>

                      {/* Specific Satisfaction Metrics Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-gray-100 mb-6">
                        {t.satisfactionMetrics.map((metric, mIdx) => (
                          <div key={mIdx} className="bg-slate-50 rounded-xl p-2.5 text-center border border-gray-100">
                            <div className="text-[11px] text-gray-500 font-medium">
                              {metric.aspect}
                            </div>
                            <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs mt-1">
                              <span>★</span>
                              <span className="text-navy">{metric.score.toFixed(1)} / 5.0</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* INTERACTIVE STAR RATING SYSTEM FOR CLIENTS / VISITORS */}
                      <div className="bg-gradient-to-r from-amber-500/5 via-orange/5 to-amber-500/5 border border-amber-300/70 rounded-2xl p-4 sm:p-5 text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-base">⭐</span>
                          <span className="font-bold text-navy text-xs sm:text-sm">
                            Beri Nilai Kepuasan Anda untuk Layanan Ini:
                          </span>
                        </div>
                        <p className="text-gray-500 text-[11px] mb-3">
                          Klik bintang (1–5) untuk memberikan penilaian kepuasan kuantitatif Anda terhadap performa tim teknisi kami.
                        </p>

                        {/* Interactive Clickable & Hoverable 5-Star Row */}
                        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => {
                            const isFilled = star <= activeStarDisplay;

                            return (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleRateTestimonial(t.id, star)}
                                onMouseEnter={() => setHoveredCardRating({ id: t.id, star })}
                                onMouseLeave={() => setHoveredCardRating(null)}
                                className="p-1 sm:p-1.5 rounded-lg hover:bg-amber-100/60 transition-transform transform hover:scale-125 focus:outline-none cursor-pointer"
                                aria-label={`Beri Nilai ${star} Bintang dari 5`}
                              >
                                <svg
                                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                    isFilled
                                      ? 'text-amber-500 fill-current drop-shadow-sm'
                                      : 'text-gray-300 fill-current'
                                  }`}
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              </button>
                            );
                          })}
                        </div>

                        {/* Quantitative Feedback Text or User Given Rating Status */}
                        <div className="min-h-[22px] flex items-center justify-center">
                          {t.userGivenRating ? (
                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                              <span>✓ Nilai Anda: {t.userGivenRating}/5 Bintang ({satisfactionLabels[t.userGivenRating] || 'Puas'}) Tersimpan</span>
                              <span className="text-gray-400">|</span>
                              <span className="text-[10px] text-emerald-600 underline cursor-pointer">Klik bintang lain untuk memperbarui</span>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-amber-700">
                              {isHovered
                                ? satisfactionLabels[hoveredCardRating.star]
                                : 'Pilih nilai 1 (Kurang Puas) s/d 5 (Luar Biasa)'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <button
              id="prev-testimonial"
              onClick={() =>
                setActiveTestimonial((prev) =>
                  (prev - 1 + currentTestimonials.length) % currentTestimonials.length
                )
              }
              aria-label="Testimoni Sebelumnya"
              className="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg border border-gray-200 text-navy transition cursor-pointer z-10 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              id="next-testimonial"
              onClick={() =>
                setActiveTestimonial((prev) => (prev + 1) % currentTestimonials.length)
              }
              aria-label="Testimoni Selanjutnya"
              className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-white/95 hover:bg-white p-3 rounded-full shadow-lg border border-gray-200 text-navy transition cursor-pointer z-10 hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {currentTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentTestimonialIndex === i ? 'bg-orange w-8' : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                }`}
                aria-label={`Lihat Testimoni ${i + 1}`}
              />
            ))}
          </div>

          {/* Action CTAs: Beri Nilai Baru & Konsultasi WhatsApp */}
          <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-orange hover:bg-orange-dark text-white font-bold rounded-2xl shadow-md transition cursor-pointer gap-2"
            >
              <span>⭐</span>
              <span>Beri Nilai & Tulis Testimoni Kepuasan Baru</span>
            </button>
            <a
              id="wa-testimoni"
              href="https://wa.me/6289675064916?text=Halo%20Admin%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20memberikan%20ulasan%20rating%20kepuasan%205%20bintang%20untuk%20pelayanan%20sedot%20WC%20dan%20pengolahan%20limbah."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white border-2 border-emerald-600 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition shadow-sm gap-2"
            >
              <svg className="w-5 h-5 fill-current text-emerald-600" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086.159.058 1.011.477 1.184.564.173.087.289.129.332.202.043.073.043.419-.101.824z" />
              </svg>
              <span>Kirim Ulasan via WhatsApp Dispatcher</span>
            </a>
          </div>
        </div>
      </section>

      {/* Legalitas & Profil Section B2B */}
      <section id="legalitas" className="py-16 md:py-24 bg-slate-50">
        <div id="kontak" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-navy mb-6">PT Kusuma Gemilang Raya</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                PT. Kusuma Gemilang Raya adalah perusahaan jasa resmi dengan legalitas lengkap: NIB KBLI 37011, Sertifikat Standar, izin pengolahan limbah, dan SPPKP. Kami melayani sedot WC, pengangkutan limbah, serta perawatan dan perbaikan IPAL di Kota Bekasi dan seluruh Kabupaten Bekasi. Limbah Anda ditangani secara profesional, legal, dan sesuai aturan lingkungan.
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex">
                  <span className="font-bold text-navy w-40 flex-shrink-0">Nama Perusahaan:</span>
                  <span className="text-gray-600">PT Kusuma Gemilang Raya</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-navy w-40 flex-shrink-0">Legalitas:</span>
                  <span className="text-gray-600">NIB KBLI 37011, Sertifikat Standar, Izin Pengolahan Limbah, SPPKP</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-navy w-40 flex-shrink-0">Bidang Usaha:</span>
                  <span className="text-gray-600">Jasa Sanitasi & Pengolahan Limbah</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-navy w-40 flex-shrink-0">Wilayah Layanan:</span>
                  <span className="text-gray-600">Kota & Kabupaten Bekasi</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-navy w-40 flex-shrink-0">Kontak Resmi:</span>
                  <span className="text-gray-600">+62 896-7506-4916</span>
                </div>
              </div>
            </div>
            <div className="bg-navy p-8 rounded-2xl text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Butuh Konsultasi?</h3>
              <p className="text-gray-300 mb-8">Tim profesional kami siap membantu Anda 24 jam.</p>
              <a
                id="wa-kontak"
                href={getDynamicWaLink('kontak')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center px-6 py-4 bg-orange text-white font-bold rounded-xl hover:bg-orange-dark transition mb-4"
              >
                Chat WhatsApp
              </a>
              <p className="text-sm text-gray-400">+62 896-7506-4916</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Manifest IPLT & Transparansi Pembuangan */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/10 text-cyan-dark text-sm font-semibold mb-6">
              ✓ Transparansi Pembuangan Limbah
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Manifest IPLT Resmi</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Kami berkomitmen menangani limbah Anda secara bertanggung jawab. Setiap pekerjaan penyedotan didokumentasikan melalui Manifest IPLT (Instalasi Pengolahan Lumpur Tinja) yang valid, memastikan limbah dibuang di tempat resmi tanpa mencemari lingkungan.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Visualisasi Dokumen Manifest */}
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan/10 rounded-3xl blur-2xl opacity-50"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8 transform transition duration-500 hover:scale-[1.02]">
                {/* Kertas Dokumen */}
                <div className="border-b-2 border-gray-100 pb-4 mb-4 flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-navy text-lg">MANIFEST LIMBAH IPLT</h4>
                    <p className="text-xs text-gray-500">PT KUSUMA GEMILANG RAYA</p>
                  </div>
                  <div className="w-12 h-12 bg-cyan/10 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>

                {/* Isi Form Manifest */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between bg-slate-50 p-2 rounded">
                    <span className="text-gray-500">No. Manifest:</span>
                    <span className="font-mono font-semibold text-navy">MNF-2023-1025-A</span>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-2 rounded">
                    <span className="text-gray-500">Tanggal:</span>
                    <span className="font-semibold text-navy">25 Oktober 2023</span>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-2 rounded">
                    <span className="text-gray-500">Asal Limbah:</span>
                    <span className="font-semibold text-navy">Bekasi Selatan</span>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-2 rounded">
                    <span className="text-gray-500">Volume (Kubik):</span>
                    <span className="font-semibold text-navy">3.5 m³</span>
                  </div>
                  <div className="flex justify-between bg-slate-50 p-2 rounded">
                    <span className="text-gray-500">Tujuan IPLT:</span>
                    <span className="font-semibold text-navy">IPLT Kota Bekasi</span>
                  </div>
                  <div className="pt-3 border-t border-dashed border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Status Validasi:</span>
                      <span className="flex items-center font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        Terverifikasi
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-gray-400 text-center italic">*Contoh visualisasi dokumen manifest untuk tujuan transparansi</p>
              </div>
            </div>

            {/* Penjelasan Proses */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-navy">Proses Pembuangan Limbah yang Legal & Terdata</h3>
              <p className="text-gray-600">Kami menjunjung tinggi kepatuhan terhadap regulasi lingkungan. Limbah yang disedot tidak dibuang sembarangan, melainkan dikirim ke Instalasi Pengolahan Lumpur Tinja (IPLT) resmi.</p>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-navy">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Pengangkutan Terjadwal</h4>
                    <p className="text-sm text-gray-600">Limbah diangkut menggunakan truk tertutup untuk mencegah pencemaran bau dan tumpahan di jalanan.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-navy">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Pencatatan Manifest</h4>
                    <p className="text-sm text-gray-600">Setiap pengiriman dicatat secara detail dalam dokumen manifest, mencakup volume dan asal limbah.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-navy">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy">Pembuangan di IPLT</h4>
                    <p className="text-sm text-gray-600">Limbah dibuang di IPLT resmi pemerintah dan divalidasi oleh petugas pengolahan.</p>
                  </div>
                </div>
              </div>

              <a
                id="wa-manifest"
                href="https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20bertanya%20tentang%20proses%20manifest%20IPLT."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-navy text-white text-sm font-semibold rounded-xl hover:bg-navy-light transition mt-4"
              >
                Tanya Detail Proses Limbah
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Sertifikasi & Kemitraan (Kredibilitas B2B & Kepatuhan Legal) */}
      <section id="sertifikasi" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan-dark text-xs sm:text-sm font-bold mb-4 uppercase tracking-wider">
              🏅 STANDAR KUALITAS & KREDIBILITAS B2B
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy">
              Sertifikasi & Kemitraan Strategis
            </h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
              Memenuhi standar kepatuhan tinggi tim General Affairs (GA), HSE, dan Procurement. PT Kusuma Gemilang Raya telah terverifikasi oleh regulator pemerintah, memiliki akreditasi keselamatan kerja K3 (SMK3), serta menjadi mitra rekanan resmi di kawasan industri terkemuka di Bekasi.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              {(['Semua', 'Regulator', 'K3 & Mutu', 'Asosiasi & Kawasan'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCertCategory(cat)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    selectedCertCategory === cat
                      ? 'bg-navy text-white shadow-md scale-105 border border-cyan/30'
                      : 'bg-white text-gray-700 hover:bg-slate-100 border border-gray-200'
                  }`}
                >
                  {cat === 'Semua' ? 'Semua Mitra & Sertifikasi' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Partner & Certification Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'klhk',
                name: 'Kementerian Lingkungan Hidup & Kehutanan',
                shortName: 'KLHK Republik Indonesia',
                category: 'Regulator',
                badge: 'Regulator Nasional',
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                credential: 'Rekomendasi Angkut Limbah Domestik & Non-B3',
                description: 'Pengawasan baku mutu pengelolaan air limbah cair dan integrasi manifest IPLT sesuai Peraturan Menteri LHK No. P.68/2016.',
                scope: 'Kepatuhan AMDAL, UKL/UPL & Audit PROPER',
                iconType: 'klhk',
              },
              {
                id: 'dlh-bekasi',
                name: 'Dinas Lingkungan Hidup Kota & Kab. Bekasi',
                shortName: 'DLH Kota & Kabupaten Bekasi',
                category: 'Regulator',
                badge: 'Mitra Resmi IPLT',
                badgeColor: 'bg-cyan/10 text-cyan-dark border-cyan/30',
                credential: 'PKS Pembuangan IPLT No. 658.1/IPLT-BKS/2024',
                description: 'Mitra operasional pembuangan limbah tinja dan air limbah industri ke IPLT Sumur Batu (Kota) dan IPLT Babelan (Kabupaten).',
                scope: 'Penerbitan Dokumen Manifest Sah & Valid',
                iconType: 'dlh',
              },
              {
                id: 'smk3-kemenaker',
                name: 'Kementerian Ketenagakerjaan RI (Kemenaker)',
                shortName: 'Sertifikasi SMK3 & Confined Space',
                category: 'K3 & Mutu',
                badge: 'Standar K3 Mandatori',
                badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                credential: 'SMK3 PP No. 50/2012 & Lisensi Ruang Terbatas',
                description: 'Teknisi lapangan bersertifikat K3 Confined Space Entry, dibekali 4-Gas Detector (H2S, LEL, CO, O2), Tripod Winch, dan APD Level 3.',
                scope: 'Mitigasi Risiko Gas H2S & Zero LTI Record',
                iconType: 'k3',
              },
              {
                id: 'oss-bkpm',
                name: 'Kementerian Investasi / BKPM - OSS RBA',
                shortName: 'NIB KBLI 37011 & Legalitas PT',
                category: 'Regulator',
                badge: 'Badan Hukum Sah',
                badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
                credential: 'NIB: 3105220048123 | SPPKP & Rekening Giro PT',
                description: 'Badan usaha berbadan hukum PT resmi dengan klasifikasi baku KBLI 37011 (Pengumpulan & Pengolahan Air Limbah Non-B3).',
                scope: 'Faktur Pajak PPN e-Faktur & Kontrak PO B2B',
                iconType: 'oss',
              },
              {
                id: 'appli',
                name: 'Asosiasi Pengusaha Pengelolaan Limbah Indonesia',
                shortName: 'DPP APPLI Jawa Barat',
                category: 'Asosiasi & Kawasan',
                badge: 'Asosiasi Profesi Limbah',
                badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                credential: 'Keanggotaan: APPLI-JB/2023-088',
                description: 'Komitmen etika profesi pengelolaan limbah nasional: armada tangki tertutup kedap bau, anti-pencemaran lingkungan, dan pembuangan legal.',
                scope: 'Standard Operating Procedure (SOP) Nasional',
                iconType: 'appli',
              },
              {
                id: 'iso-14001',
                name: 'ISO 14001:2015 Environmental Management',
                shortName: 'Sistem Manajemen Lingkungan ISO',
                category: 'K3 & Mutu',
                badge: 'Akreditasi Global',
                badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
                credential: 'Environmental Management System Compliance',
                description: 'Kepatuhan tata kelola dampak lingkungan bertaraf internasional, mendukung audit vendor ESG dan pemenuhan sertifikasi pabrik.',
                scope: 'Audit-Ready untuk Perusahaan Multinasional',
                iconType: 'iso14001',
              },
              {
                id: 'iso-45001',
                name: 'ISO 45001:2018 Occupational Health & Safety',
                shortName: 'Sistem Manajemen K3 Internasional',
                category: 'K3 & Mutu',
                badge: 'HSE Management System',
                badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                credential: 'Occupational Health and Safety Standard',
                description: 'Prosedur keselamatan kerja terstruktur untuk pengerjaan berisiko tinggi pada tangki limbah, bak STP anaerobik, dan pipa industri.',
                scope: 'CSMS Score A / Vendor Kualifikasi Tinggi',
                iconType: 'iso45001',
              },
              {
                id: 'kawasan-industri',
                name: 'Konsorsium Mitra Kawasan Industri Bekasi',
                shortName: 'MM2100, Jababeka, GIIC, EJIP, Deltamas',
                category: 'Asosiasi & Kawasan',
                badge: 'Vendor Rekanan Terdaftar',
                badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
                credential: 'Akses Gate Pass & SIMAK Kawasan Industri',
                description: 'Rekanan rutin pengurasan STP/IPAL manufaktur, grease trap sentral kantin pabrik, dan perawatan pipa di kawasan industri Bekasi.',
                scope: 'Armada Siaga 24 Jam & Respon Cepat 15 Menit',
                iconType: 'industry',
              },
            ]
              .filter((item) => selectedCertCategory === 'Semua' || item.category === selectedCertCategory)
              .map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-cyan/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon Crest & Status Badge */}
                    <div className="flex items-start justify-between mb-4">
                      {/* Logo Crest SVG */}
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                        {partner.iconType === 'klhk' && (
                          <svg className="w-9 h-9 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4 6v6c0 5.25 3.5 10 8 10s8-4.75 8-10V6l-8-4z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
                            <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                          </svg>
                        )}
                        {partner.iconType === 'dlh' && (
                          <svg className="w-9 h-9 text-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12h18" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
                            <circle cx="12" cy="12" r="4" />
                          </svg>
                        )}
                        {partner.iconType === 'k3' && (
                          <svg className="w-9 h-9 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="9" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v10M7 12h10" strokeWidth="2.5" />
                          </svg>
                        )}
                        {partner.iconType === 'oss' && (
                          <svg className="w-9 h-9 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l2-2m0 0l2 2m-2-2v6" />
                          </svg>
                        )}
                        {partner.iconType === 'appli' && (
                          <svg className="w-9 h-9 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                        {partner.iconType === 'iso14001' && (
                          <svg className="w-9 h-9 text-teal-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <circle cx="12" cy="12" r="9" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12a4 4 0 018 0" />
                          </svg>
                        )}
                        {partner.iconType === 'iso45001' && (
                          <svg className="w-9 h-9 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                        {partner.iconType === 'industry' && (
                          <svg className="w-9 h-9 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                      </div>

                      {/* Verification Pill */}
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Terverifikasi
                      </span>
                    </div>

                    {/* Organization Title */}
                    <div className="mb-2">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border mb-1.5 ${partner.badgeColor}`}>
                        {partner.badge}
                      </span>
                      <h3 className="font-extrabold text-navy text-base leading-snug group-hover:text-cyan transition-colors">
                        {partner.shortName}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-medium">
                        {partner.name}
                      </p>
                    </div>

                    {/* Credential Number / Reference */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-gray-100 text-xs font-mono text-gray-700 font-semibold mb-3">
                      {partner.credential}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      {partner.description}
                    </p>
                  </div>

                  {/* Scope & Audit Relevance Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-cyan-dark flex items-center gap-1 truncate">
                      <span>✓</span>
                      <span>{partner.scope}</span>
                    </span>
                    <span className="text-gray-400 group-hover:text-orange transition-colors">→</span>
                  </div>
                </div>
              ))}
          </div>

          {/* 4 Pilar Kepastian Kepatuhan untuk Tim Procurement / HSE */}
          <div className="mt-14 bg-gradient-to-br from-navy via-navy-light to-navy p-8 md:p-10 rounded-3xl text-white shadow-xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-light">
                    🛡️ JAMINAN KEPATUHAN VENDOR TERVERIFIKASI
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    4 Pilar Keamanan Hukum & Operasional bagi Klien PT
                  </h3>
                  <p className="text-sm text-gray-300 mt-1 max-w-2xl">
                    Dirancang untuk memenuhi checklist vendor evaluation procurement korporat dan standar HSE multinasional.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 flex-shrink-0">
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, kami dari tim Procurement / GA / HSE perusahaan ingin meminta salinan Company Profile, NIB, dan Sertifikat K3 untuk kelengkapan administrasi vendor.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs sm:text-sm font-bold transition shadow-lg shadow-orange/30 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Minta Dokumen Legalitas (PDF)</span>
                    <span>→</span>
                  </a>
                  <a
                    href="#quotation"
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold transition cursor-pointer"
                  >
                    Ajukan RFP Resmi (Quotation)
                  </a>
                </div>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-cyan/20 text-cyan-light flex items-center justify-center font-bold text-sm mb-3">
                    1
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Bebas Risiko Sanksi Lingkungan</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Setiap meter kubik limbah dibuang ke IPLT resmi dengan nomor Manifest tercatat. Siap menghadapi inspeksi DLH sewaktu-waktu.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-orange/20 text-orange flex items-center justify-center font-bold text-sm mb-3">
                    2
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Protokol K3 Confined Space</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Teknisi bersertifikasi keselamatan kerja ruang terbatas, blower sirkulasi udara, detector 4-gas, dan APD Level 3 untuk zero accident.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mb-3">
                    3
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Administrasi Perpajakan Bersih</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Penerbitan Faktur Pajak PPN (e-Faktur) sah, SPPKP, rekening giro PT resmi, dan sistem termin pembayaran (PO 14-30 hari).
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm mb-3">
                    4
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1.5">Berita Acara & Laporan BAST</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Laporan pekerjaan komprehensif disertai foto before-after, GPS stamp lokasi, serta Berita Acara Serah Terima (BAST) bertanda tangan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ Khusus B2B & Korporat */}
      <section id="faq-b2b" className="py-16 md:py-24 bg-white relative border-t border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-navy/5 text-navy text-xs sm:text-sm font-bold border border-navy/15 mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
              🏢 KEPATUHAN PENGADAAN & AUDIT REKANAN B2B
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
              FAQ Khusus B2B & Korporat
            </h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed text-sm sm:text-base">
              Panduan resmi kepatuhan administratif dan operasional bagi tim Procurement, General Affairs (GA), HSE/K3, dan Finance seputar persyaratan audit vendor rekanan, alur Berita Acara Serah Terima (BAST), serta tata kelola perpajakan e-Faktur PPN.
            </p>

            {/* Quick Keyword Search & Filter Controls */}
            <div className="mt-8 max-w-xl mx-auto">
              <div
                key={`b2b-faq-search-wrapper-${b2bFaqShakeKey}`}
                className={`relative transition-all duration-300 ${
                  isB2bFaqShaking ? 'animate-subtle-shake' : ''
                }`}
              >
                <input
                  type="text"
                  value={b2bFaqSearch}
                  onChange={(e) => setB2bFaqSearch(e.target.value)}
                  placeholder="Cari topik B2B: audit vendor, BAST, e-faktur, TOP, SLA, K3..."
                  className={`w-full pl-11 pr-10 py-3 rounded-2xl border text-sm text-navy outline-none transition duration-200 shadow-inner ${
                    filteredB2bFaqItems.length === 0 && b2bFaqSearch.trim() !== ''
                      ? 'border-rose-400 bg-rose-50/40 text-rose-950 focus:border-rose-500 ring-2 ring-rose-400/25 placeholder:text-rose-400'
                      : 'border-gray-200 bg-slate-50 focus:bg-white focus:border-cyan focus:ring-2 focus:ring-cyan/20'
                  }`}
                  aria-invalid={filteredB2bFaqItems.length === 0 && b2bFaqSearch.trim() !== ''}
                />
                <span className={`absolute left-4 top-3.5 text-base transition-transform duration-200 ${
                  filteredB2bFaqItems.length === 0 && b2bFaqSearch.trim() !== '' ? 'scale-110 text-rose-500' : 'text-gray-400'
                }`}>
                  {filteredB2bFaqItems.length === 0 && b2bFaqSearch.trim() !== '' ? '⚠️' : '🔍'}
                </span>
                {b2bFaqSearch && (
                  <button
                    type="button"
                    onClick={() => setB2bFaqSearch('')}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-navy text-xs p-1 rounded-full hover:bg-gray-200/60 transition"
                    title="Hapus pencarian"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Highlight Results Toolbar for B2B FAQ */}
              {b2bFaqSearch.trim() !== '' && filteredB2bFaqItems.length > 0 && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-950 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                      ✨
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-navy">Highlight Results B2B:</span>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded font-bold text-[11px] bg-amber-200/80 text-amber-950">
                          {isB2bFaqHighlightActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <span className="text-gray-600">
                          ({totalB2bFaqMatches} kecocokan di {b2bItemsWithMatchesCount} topik)
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 truncate mt-0.5">
                        Menyorot kata kunci <mark className="bg-amber-300 text-navy font-bold px-1 rounded">"{b2bFaqSearch}"</mark> pada pertanyaan, ringkasan, dan detail kepatuhan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsB2bFaqHighlightActive((prev) => !prev)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1 text-[11px] cursor-pointer ${
                        isB2bFaqHighlightActive
                          ? 'bg-amber-200 text-amber-950 hover:bg-amber-300 border border-amber-400/80 shadow-2xs'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                      title={isB2bFaqHighlightActive ? 'Matikan sorotan kata kunci' : 'Aktifkan sorotan kata kunci'}
                    >
                      <span>{isB2bFaqHighlightActive ? '🟡 Sorotan ON' : '⚪ Sorotan OFF'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Zero Results Visual Feedback Indicator */}
              {filteredB2bFaqItems.length === 0 && b2bFaqSearch.trim() !== '' && (
                <div className="mt-2.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                    <span>
                      Tidak ada topik B2B yang cocok dengan <strong>"{b2bFaqSearch}"</strong> (0 hasil).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setB2bFaqSearch('')}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline flex-shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
              {b2bFaqCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setB2bFaqCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                    b2bFaqCategory === cat
                      ? 'bg-navy text-white shadow-md scale-105 border border-cyan/40'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  {cat === 'Semua' ? 'Semua Topik B2B' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-5">
            {filteredB2bFaqItems.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-gray-300 p-8">
                <span className="text-3xl mb-3 block">🔎</span>
                <h4 className="text-base font-bold text-navy mb-1">
                  Topik B2B tidak ditemukan
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
                  Tidak ada pertanyaan yang sesuai dengan kata kunci "{b2bFaqSearch}". Silakan reset filter atau konsultasikan langsung dengan tim Legal & Tender kami.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setB2bFaqCategory('Semua');
                      setB2bFaqSearch('');
                    }}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition"
                  >
                    Reset Filter Pencarian
                  </button>
                  <a
                    href="https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20konsultasi%20terkait%20persyaratan%20rekanan%20vendor%20B2B."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-orange text-white text-xs font-bold hover:bg-orange-dark transition"
                  >
                    Tanya Langsung via WA
                  </a>
                </div>
              </div>
            ) : (
              filteredB2bFaqItems.map((item) => {
                const isOpen = openB2bFaqId === item.id;
                const stats = b2bFaqMatchMap.get(item.id);
                const hasMatches = isB2bFaqHighlightActive && stats && stats.total > 0;
                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border transition-all duration-300 overflow-hidden bg-white ${
                      isOpen
                        ? 'border-cyan/50 shadow-lg ring-1 ring-cyan/20'
                        : hasMatches
                        ? 'border-amber-300/80 hover:border-amber-400 shadow-xs ring-1 ring-amber-200/50'
                        : 'border-gray-200 hover:border-gray-300 shadow-xs'
                    }`}
                  >
                    {/* Item Header / Question Button */}
                    <button
                      onClick={() => setOpenB2bFaqId(isOpen ? null : item.id)}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            {item.categoryLabel}
                          </span>
                          {hasMatches && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs animate-fadeIn">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              <span>{stats.total} kata kunci cocok</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-extrabold text-navy leading-snug">
                          {isB2bFaqHighlightActive && b2bFaqSearch.trim()
                            ? highlightKeyword(item.question, b2bFaqSearch)
                            : item.question}
                        </h3>
                        <div
                          className={`accordion-grid ${
                            !isOpen ? 'accordion-expanded' : ''
                          }`}
                        >
                          <div className="accordion-overflow">
                            <p className="mt-2 text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed">
                              {isB2bFaqHighlightActive && b2bFaqSearch.trim()
                                ? highlightKeyword(item.summary, b2bFaqSearch)
                                : item.summary}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                        isOpen
                          ? 'bg-navy text-white rotate-180 shadow-sm'
                          : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Item Content (Expanded Details with Smooth Height Animation) */}
                    <div
                      className={`accordion-grid ${
                        isOpen ? 'accordion-expanded' : ''
                      }`}
                    >
                      <div className="accordion-overflow">
                        <div className="px-5 pb-6 sm:px-6 sm:pb-7 border-t border-gray-100 pt-5 bg-slate-50/40">
                          {/* Summary Box */}
                          <div className="p-4 rounded-2xl bg-cyan/5 border-l-4 border-cyan mb-6">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                              {isB2bFaqHighlightActive && b2bFaqSearch.trim()
                                ? highlightKeyword(item.summary, b2bFaqSearch)
                                : item.summary}
                            </p>
                          </div>

                          {/* Breakdown Grid of 4 Detailed Pillars */}
                          <div className="grid sm:grid-cols-2 gap-4 mb-6">
                            {item.details.map((detail, dIdx) => (
                              <div
                                key={dIdx}
                                className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                      ✓
                                    </span>
                                    <h4 className="text-xs sm:text-sm font-bold text-navy">
                                      {isB2bFaqHighlightActive && b2bFaqSearch.trim()
                                        ? highlightKeyword(detail.title, b2bFaqSearch)
                                        : detail.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs text-gray-600 leading-relaxed pl-7">
                                    {isB2bFaqHighlightActive && b2bFaqSearch.trim()
                                      ? highlightKeyword(detail.desc, b2bFaqSearch)
                                      : detail.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Tags & Action Bar */}
                          <div className="pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-bold text-gray-400 mr-1">Topik Kunci:</span>
                              {item.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-white border border-gray-200 text-navy"
                                >
                                  #{isB2bFaqHighlightActive && b2bFaqSearch.trim()
                                    ? highlightKeyword(tag, b2bFaqSearch)
                                    : tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-2.5">
                              <a
                                href={`https://wa.me/6289675064916?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, kami dari tim perusahaan/pabrik ingin konsultasi tentang FAQ B2B: "${item.question}"`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                              >
                                <span>Hubungi Tim B2B via WA</span>
                                <span>→</span>
                              </a>
                              <a
                                href="#quotation"
                                className="px-3.5 py-2 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition"
                              >
                                Ajukan RFP Resmi
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Compliance Assurance Banner (Audit Vendor, BAST, e-Faktur) */}
          <div className="mt-12 bg-navy rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-cyan/20">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan/20 text-cyan-light text-xs font-bold border border-cyan/30">
                  <span>🛡️ Jaminan Administrasi & Kepatuhan Legalitas 100%</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Siap Melengkapi Formulir Rekanan & Kunjungan Audit Lapangan
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  Perusahaan Anda membutuhkan paket berkas legalitas resmi, surat dukungan penawaran tender, atau draft Perjanjian Kerja Sama (PKS)? Tim Legal & Corporate Affairs kami siap merespon dalam waktu 1x24 jam.
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
                <a
                  href={`https://wa.me/6289675064916?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, mohon dikirimkan berkas company profile, legalitas NIB KBLI 37011, format BAST, dan SPPKP untuk audit vendor perusahaan kami.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center px-5 py-3 rounded-2xl bg-orange hover:bg-orange-dark text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-orange/30 cursor-pointer"
                >
                  Minta Berkas Audit (PDF)
                </a>
                <a
                  href="#quotation"
                  className="w-full sm:w-auto text-center px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition border border-white/20 cursor-pointer"
                >
                  Isi Formulir RFP B2B
                </a>
              </div>
            </div>
          </div>

          {/* Quick link to General FAQ */}
          <div className="mt-8 text-center">
            <a
              href="#faq"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-500 hover:text-navy transition py-2 px-4 rounded-full bg-slate-100 hover:bg-slate-200"
            >
              <span>Mencari pertanyaan seputar layanan sedot WC hunian rumah tangga & umum?</span>
              <span className="text-orange font-bold">Lihat FAQ Umum di bawah ↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 mb-3">
              FAQ UMUM & RESIDENSIAL
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">FAQ (Frequently Asked Questions)</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Pertanyaan umum seputar layanan sedot WC, septic tank, dan saluran pipa di Bekasi.</p>
            
            {/* Cross link to B2B FAQ */}
            <div className="mt-4">
              <a
                href="#faq-b2b"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-navy hover:text-cyan px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-xs transition"
              >
                <span>🏢 Untuk audit vendor PT, alur BAST & e-Faktur PPN, kunjungi</span>
                <span className="text-cyan-dark underline">FAQ Khusus B2B & Korporat ↑</span>
              </a>
            </div>

            {/* Quick General FAQ Search Bar with Subtle Shake on Zero Results */}
            <div className="mt-6 max-w-xl mx-auto">
              <div
                key={`general-faq-search-wrapper-${generalFaqShakeKey}`}
                className={`relative transition-all duration-300 ${
                  isGeneralFaqShaking ? 'animate-subtle-shake' : ''
                }`}
              >
                <input
                  type="text"
                  value={generalFaqSearch}
                  onChange={(e) => setGeneralFaqSearch(e.target.value)}
                  placeholder="Cari pertanyaan umum: harga, septic tank, mampet, 24 jam, area..."
                  className={`w-full pl-11 pr-10 py-3 rounded-2xl border text-sm text-navy outline-none transition duration-200 shadow-inner ${
                    filteredGeneralFaqItems.length === 0 && generalFaqSearch.trim() !== ''
                      ? 'border-rose-400 bg-rose-50/40 text-rose-950 focus:border-rose-500 ring-2 ring-rose-400/25 placeholder:text-rose-400'
                      : 'border-gray-200 bg-white focus:border-cyan focus:ring-2 focus:ring-cyan/20'
                  }`}
                  aria-invalid={filteredGeneralFaqItems.length === 0 && generalFaqSearch.trim() !== ''}
                />
                <span className={`absolute left-4 top-3.5 text-base transition-transform duration-200 ${
                  filteredGeneralFaqItems.length === 0 && generalFaqSearch.trim() !== '' ? 'scale-110 text-rose-500' : 'text-gray-400'
                }`}>
                  {filteredGeneralFaqItems.length === 0 && generalFaqSearch.trim() !== '' ? '⚠️' : '🔍'}
                </span>
                {generalFaqSearch && (
                  <button
                    type="button"
                    onClick={() => setGeneralFaqSearch('')}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-navy text-xs p-1 rounded-full hover:bg-gray-100 transition"
                    title="Hapus pencarian"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Highlight Results Toolbar & Status Indicator */}
              {generalFaqSearch.trim() !== '' && filteredGeneralFaqItems.length > 0 && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-amber-950 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-2xs">
                      ✨
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-navy">Highlight Results:</span>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded font-bold text-[11px] bg-amber-200/80 text-amber-950">
                          {isGeneralFaqHighlightActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                        <span className="text-gray-600">
                          ({totalGeneralFaqMatches} kecocokan di {itemsWithMatchesCount} FAQ)
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 truncate mt-0.5">
                        Menyorot kata kunci <mark className="bg-amber-300 text-navy font-bold px-1 rounded">"{generalFaqSearch}"</mark> pada pertanyaan dan jawaban.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsGeneralFaqHighlightActive((prev) => !prev)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1 text-[11px] cursor-pointer ${
                        isGeneralFaqHighlightActive
                          ? 'bg-amber-200 text-amber-950 hover:bg-amber-300 border border-amber-400/80 shadow-2xs'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                      title={isGeneralFaqHighlightActive ? 'Matikan sorotan kata kunci' : 'Aktifkan sorotan kata kunci'}
                    >
                      <span>{isGeneralFaqHighlightActive ? '🟡 Sorotan ON' : '⚪ Sorotan OFF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleAllGeneralFaq}
                      className="px-2.5 py-1.5 rounded-xl font-bold bg-white text-navy hover:bg-gray-50 border border-gray-200 transition flex items-center gap-1 text-[11px] cursor-pointer shadow-2xs"
                      title={isAllGeneralFaqExpanded ? 'Tutup semua jawaban' : 'Buka semua jawaban untuk melihat sorotan'}
                    >
                      <span>{isAllGeneralFaqExpanded ? '📂 Tutup Jawaban' : '📖 Buka Semua Jawaban'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Zero Results Visual Feedback Indicator */}
              {filteredGeneralFaqItems.length === 0 && (generalFaqSearch.trim() !== '' || generalFaqCategory !== 'Semua') && (
                <div className="mt-2.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between gap-2 shadow-xs animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                    <span>
                      Tidak ada pertanyaan yang cocok
                      {generalFaqSearch.trim() !== '' ? <> dengan <strong>"{generalFaqSearch}"</strong></> : null}
                      {generalFaqCategory !== 'Semua' ? <> pada kategori <strong>"{generalFaqCategory}"</strong></> : null} (0 hasil).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGeneralFaqSearch('');
                      setGeneralFaqCategory('Semua');
                    }}
                    className="text-[11px] font-bold text-rose-700 hover:text-rose-900 underline flex-shrink-0 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
              {generalFaqCategories.map((cat) => {
                const isSelected = generalFaqCategory === cat;
                const count =
                  cat === 'Semua'
                    ? generalFaqItems.length
                    : generalFaqItems.filter((i) => i.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGeneralFaqCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-navy text-white shadow-md scale-105 border border-cyan/40'
                        : 'bg-white text-gray-600 hover:bg-slate-200 border border-gray-200 shadow-2xs'
                    }`}
                  >
                    <span>{cat === 'Semua' ? 'Semua Pertanyaan' : cat}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-gray-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {filteredGeneralFaqItems.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-gray-300 p-6">
                <span className="text-3xl mb-2 block">🔍</span>
                <h4 className="text-base font-bold text-navy mb-1">
                  Pertanyaan tidak ditemukan
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-4">
                  Tidak ada pertanyaan umum yang cocok dengan kata kunci "{generalFaqSearch}"
                  {generalFaqCategory !== 'Semua' ? ` di kategori "${generalFaqCategory}"` : ''}. Silakan reset filter atau tanyakan langsung melalui WhatsApp.
                </p>
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGeneralFaqSearch('');
                      setGeneralFaqCategory('Semua');
                    }}
                    className="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition cursor-pointer"
                  >
                    Reset Filter & Pencarian
                  </button>
                  <a
                    href="https://wa.me/6289675064916?text=Halo%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20bertanya%20seputar%20layanan%20sedot%20WC."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-orange text-white text-xs font-bold hover:bg-orange-dark transition"
                  >
                    Tanya via WA
                  </a>
                </div>
              </div>
            ) : (
              filteredGeneralFaqItems.map((item) => {
                const stats = generalFaqMatchMap.get(item.id);
                const hasMatches = isGeneralFaqHighlightActive && stats && stats.total > 0;
                const isItemOpen = openedGeneralFaqIds.includes(item.id);

                return (
                  <AnimatedFaqDetails
                    key={item.id}
                    question={
                      isGeneralFaqHighlightActive && generalFaqSearch.trim()
                        ? highlightKeyword(item.question, generalFaqSearch)
                        : item.question
                    }
                    badge={item.badge}
                    category={item.category}
                    icon={item.icon}
                    answerText={item.answer}
                    isOpenProp={isItemOpen}
                    onToggleProp={() => handleToggleSingleGeneralFaq(item.id)}
                    matchInfoBadge={
                      hasMatches ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs flex-shrink-0 animate-fadeIn"
                          title={`${stats.total} kata kunci cocok (${stats.questionMatches} di pertanyaan, ${stats.answerMatches} di jawaban)`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>{stats.total} kata kunci cocok</span>
                          {stats.answerMatches > 0 && !isItemOpen && (
                            <span className="text-[9px] text-amber-700 bg-amber-200/60 px-1 rounded">
                              (ada di jawaban)
                            </span>
                          )}
                        </span>
                      ) : undefined
                    }
                    onCopy={() => triggerToast(`📋 Jawaban untuk "${item.question.length > 32 ? item.question.slice(0, 32) + '...' : item.question}" berhasil disalin!`)}
                  >
                    {isGeneralFaqHighlightActive && generalFaqSearch.trim()
                      ? highlightKeyword(item.answer, generalFaqSearch)
                      : item.answer}
                  </AnimatedFaqDetails>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Blog & Tips Sanitasi Section (SEO Content) */}
      <section id="tips" className="py-16 md:py-24 bg-white relative border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/10 text-cyan-dark text-sm font-semibold mb-4">
              📚 EDUKASI & TIPS SANITASI RESMI
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">
              Blog & Tips Sanitasi Rumah Tangga
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Panduan praktis dan edukasi perawatan sanitasi dari para teknisi berpengalaman PT Kusuma Gemilang Raya untuk menjaga lingkungan hunian Anda di Bekasi tetap bersih, sehat, dan bebas bau.
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedBlogCategory(cat)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                    selectedBlogCategory === cat
                      ? 'bg-navy text-white shadow-md'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredBlogArticles.map((article, idx) => (
              <article
                key={article.id}
                onClick={() => setActiveArticleModal(blogArticles.findIndex((a) => a.id === article.id))}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-navy/90 backdrop-blur-md text-cyan border border-cyan/30">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Article Meta & Title */}
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-400 mb-2.5 gap-2">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span className="text-orange font-medium">{article.readTime}</span>
                    </div>

                    <h3 className="text-base font-bold text-navy group-hover:text-cyan transition leading-snug mb-3">
                      {article.title}
                    </h3>

                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-orange group-hover:text-orange-dark transition inline-flex items-center">
                    Baca Selengkapnya <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </span>
                  <span className="text-[11px] text-gray-400">Tim Ahli</span>
                </div>
              </article>
            ))}
          </div>

          {/* Quick Consultation Banner for Articles */}
          <div className="mt-12 bg-slate-50 p-6 md:p-8 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div>
              <h4 className="text-base font-bold text-navy">Punya kendala sanitasi di rumah yang belum teratasi?</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Konsultasikan langsung dengan teknisi kami. Kami siap memberikan solusi penanganan tepat tanpa biaya tersembunyi.
              </p>
            </div>
            <a
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, saya membaca tips sanitasi di website Anda dan ingin konsultasi masalah sanitasi rumah tangga.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-dark transition shadow-md whitespace-nowrap flex-shrink-0"
            >
              Konsultasi via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Section Formulir Berlangganan Newsletter Tips Sanitasi */}
      <section id="newsletter" className="py-16 md:py-24 bg-gradient-to-br from-navy via-navy-light to-navy text-white relative overflow-hidden">
        {/* Decorative ambient elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan/15 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-orange/15 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Heading, Info, and Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan/20 border border-cyan/40 text-cyan-light text-xs font-bold uppercase tracking-wider">
                ✉️ Berlangganan Newsletter & Edukasi Sanitasi
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Dapatkan Update Tips Sanitasi & Panduan Praktis Berkala
              </h2>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Bergabunglah dengan ratusan pemilik hunian, pengelola ruko, dan pelaku usaha di Bekasi yang rutin menerima wawasan sanitasi terpercaya langsung ke email setiap bulannya.
              </p>

              {/* Benefits Checklist */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-cyan/20 text-cyan-light flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">E-Book Mini Gratis: Panduan Pipa Bebas Mampet</h4>
                    <p className="text-xs sm:text-sm text-gray-300">Trik alami mengurai endapan lemak & kotoran tanpa merusak pipa PVC rumah Anda.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-cyan/20 text-cyan-light flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Pengingat Jadwal Kuras Septic Tank Rutin</h4>
                    <p className="text-xs sm:text-sm text-gray-300">Notifikasi berkala setiap 1-2 tahun agar septic tank tidak meluap atau mencemari air tanah.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-cyan/20 text-cyan-light flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-base">Voucher Diskon Eksklusif Pelanggan</h4>
                    <p className="text-xs sm:text-sm text-gray-300">Potongan biaya langsung Rp 50.000 saat Anda memesan armada sedot WC atau servis mampet.</p>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-gray-300">
                <span className="flex items-center gap-1.5 text-cyan-light font-medium">
                  <svg className="w-4 h-4 text-cyan" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Bebas Spam
                </span>
                <span>•</span>
                <span>Berhenti Berlangganan Kapan Saja</span>
                <span>•</span>
                <span>Kerahasiaan Email Terjamin</span>
              </div>
            </div>

            {/* Right Column: Form Card */}
            <div className="lg:col-span-6">
              <div className="bg-white text-navy p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
                {newsletterStatus === 'success' ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                      ✓
                    </div>
                    <h3 className="text-2xl font-extrabold text-navy">Pendaftaran Berhasil!</h3>
                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                      {newsletterMsg}
                    </p>

                    <div className="p-4 bg-slate-50 border border-gray-100 rounded-2xl text-left text-xs space-y-2 mt-4">
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold">Email Terdaftar:</span>
                        <span className="font-bold text-navy truncate max-w-[200px]">{newsletterEmail}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold">Status Buletin:</span>
                        <span className="text-emerald-600 font-bold">Aktif & Terverifikasi</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700">
                        <span className="font-semibold">Bonus E-Book:</span>
                        <span className="text-orange font-bold">Terkirim ke Email</span>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleResetNewsletter}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                      >
                        Daftarkan Email Lain
                      </button>
                      <a
                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya sudah mendaftar newsletter dengan email ${newsletterEmail} dan ingin bertanya seputar layanan sedot WC.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs font-bold transition shadow-sm"
                      >
                        Chat Langsung via WA
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-5">
                    <div className="border-b border-gray-100 pb-4">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-navy">
                        Formulir Berlangganan Gratis
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Isi formulir singkat di bawah ini untuk menerima buletin berkala & penawaran spesial.
                      </p>
                    </div>

                    {newsletterStatus === 'error' && (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{newsletterMsg}</span>
                      </div>
                    )}

                    {/* Nama Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Nama Lengkap / Panggilan
                      </label>
                      <input
                        type="text"
                        value={newsletterName}
                        onChange={(e) => setNewsletterName(e.target.value)}
                        placeholder="Contoh: Bpk. Bambang / Ibu Rina"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-sm transition text-navy"
                      />
                    </div>

                    {/* Email Input (Wajib) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        Alamat Email Aktif <span className="text-orange">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => {
                          setNewsletterEmail(e.target.value);
                          if (newsletterStatus === 'error') setNewsletterStatus('idle');
                        }}
                        placeholder="nama@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-sm transition text-navy"
                      />
                    </div>

                    {/* Kategori Minat */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Kategori Tempat / Kepentingan
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNewsletterInterest('residensial')}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            newsletterInterest === 'residensial'
                              ? 'bg-navy text-white border-navy'
                              : 'bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>🏠</span>
                          <span>Rumah / Hunian</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewsletterInterest('komersial')}
                          className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                            newsletterInterest === 'komersial'
                              ? 'bg-navy text-white border-navy'
                              : 'bg-slate-50 text-gray-600 border-gray-200 hover:bg-slate-100'
                          }`}
                        >
                          <span>🏢</span>
                          <span>Kantor / Usaha / STP</span>
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={newsletterStatus === 'loading'}
                      className="w-full py-4 bg-orange hover:bg-orange-dark disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-orange/30 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {newsletterStatus === 'loading' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Mendaftarkan...</span>
                        </>
                      ) : (
                        <>
                          <span>Langganan Tips & Klaim E-Book</span>
                          <span>→</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-gray-400 text-center leading-normal">
                      Dengan mendaftar, Anda menyetujui penerimaan buletin berkala seputar panduan sanitasi dari PT Kusuma Gemilang Raya.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Ringkasan Statistik Newsletter & Monitoring Pertumbuhan Subscriber */}
      <section id="statistik-newsletter" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan/10 border border-cyan/30 text-cyan-dark text-xs sm:text-sm font-bold mb-3 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>📊 LIVE MONITOR SUBSCRIBER & STATISTIK</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-navy tracking-tight">
                Ringkasan Statistik Pertumbuhan Newsletter
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
                Pemantauan real-time akumulasi email pelanggan dan klien B2B (PT, Pabrik, & Kawasan Industri) di Bekasi yang berlangganan buletin berkala dan panduan sanitasi profesional.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleAddSimulationSubscriber}
                title="Tambahkan 1 data simulasi subscriber perusahaan untuk menguji reaktivitas real-time"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-gray-200 text-xs font-bold text-gray-700 transition shadow-sm cursor-pointer"
              >
                <span>⚡</span>
                <span>Simulasi Tambah +1</span>
              </button>
              <button
                onClick={handleExportSubscribersCsv}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                <svg className="w-4 h-4 text-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Ekspor CSV</span>
              </button>
              <button
                onClick={() => setIsAdminDashboardOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs font-bold transition shadow-md cursor-pointer"
              >
                <span>⚙️</span>
                <span>Buka Dashboard Admin</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Top Statistic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Card 1: Total Email Terdaftar */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Email Terdaftar</span>
                <span className="w-10 h-10 rounded-2xl bg-cyan/10 text-cyan-dark flex items-center justify-center text-lg font-bold">
                  ✉️
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                  {totalSubscribersCount.toLocaleString('id-ID')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  +18.4% MoM
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Akumulasi database aktif pelanggan web & mitra industri Bekasi.
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* Card 2: Segmen B2B / Komersial */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Segmen B2B / Komersial</span>
                <span className="w-10 h-10 rounded-2xl bg-blue-50 text-navy flex items-center justify-center text-lg font-bold">
                  🏢
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                  {commercialSubscribersCount.toLocaleString('id-ID')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan/10 text-cyan-dark">
                  64% Porsi
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                GA, HSE, Purchasing PT & Kawasan MM2100, Jababeka, EJIP.
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-navy h-full rounded-full" style={{ width: '64%' }}></div>
              </div>
            </div>

            {/* Card 3: Segmen Residensial */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Segmen Residensial</span>
                <span className="w-10 h-10 rounded-2xl bg-orange/10 text-orange flex items-center justify-center text-lg font-bold">
                  🏠
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                  {residentialSubscribersCount.toLocaleString('id-ID')}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange/10 text-orange">
                  36% Porsi
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Warga perumahan Grand Galaxy, Summarecon, Harapan Indah.
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-orange h-full rounded-full" style={{ width: '36%' }}></div>
              </div>
            </div>

            {/* Card 4: Kualitas & Deliverability */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Kualitas Pengiriman</span>
                <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold">
                  🛡️
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                  99.4%
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                  Open: 43.8%
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Validasi format email otomatis & anti-spam policy terstandar.
              </p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.4%' }}></div>
              </div>
            </div>
          </div>

          {/* Growth Analytics & Channel Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* 6-Month Growth Chart */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div>
                  <h3 className="text-lg font-extrabold text-navy">
                    Tren Pertumbuhan Subscriber Bulanan (2026)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Kenaikan stabil dari rujukan edukasi blog sanitasi dan penawaran korporat B2B.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-gray-700">
                  <span>Target Q3: 2.000 Email</span>
                </div>
              </div>

              {/* Bar Chart Simulation */}
              <div className="pt-6 pb-2">
                <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 border-b border-gray-200 pb-3">
                  {[
                    { month: 'Jan', count: '860', height: '45%', add: '+110' },
                    { month: 'Feb', count: '980', height: '55%', add: '+120' },
                    { month: 'Mar', count: '1.120', height: '68%', add: '+140' },
                    { month: 'Apr', count: '1.240', height: '78%', add: '+120' },
                    { month: 'Mei', count: '1.340', height: '88%', add: '+100' },
                    { month: 'Jun (Now)', count: totalSubscribersCount.toLocaleString('id-ID'), height: '100%', add: '+142', active: true },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="text-[10px] sm:text-xs font-bold text-gray-500 group-hover:text-navy transition">
                        {bar.count}
                      </div>
                      <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-500 ${
                            bar.active
                              ? 'bg-gradient-to-t from-navy to-cyan group-hover:from-cyan group-hover:to-cyan-light shadow-md'
                              : 'bg-navy/70 hover:bg-navy'
                          }`}
                          style={{ height: bar.height }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <div className="text-[11px] font-bold text-navy">{bar.month}</div>
                        <div className="text-[9px] text-emerald-600 font-semibold">{bar.add}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Toward Milestone */}
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-2/3">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-gray-700">Pencapaian Target Q3 2026:</span>
                    <span className="text-cyan-dark">{Math.min(100, Math.round((totalSubscribersCount / 2000) * 100))}% ({(2000 - totalSubscribersCount > 0 ? (2000 - totalSubscribersCount) : 0)} lagi)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-navy via-cyan to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((totalSubscribersCount / 2000) * 100))}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 text-center sm:text-right">
                  <span className="font-bold text-navy block">Update Otomatis</span>
                  Tiap subscriber baru tersinkron
                </div>
              </div>
            </div>

            {/* Channels & Policy Breakdown */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-navy mb-1">
                  Kanal Akuisisi & Kebijakan Distribusi
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  Sumber masuknya pelanggan ke daftar email buletin resmi.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-gray-700 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan"></span>
                        Formulir Berlangganan Web
                      </span>
                      <span className="text-navy">56% (798 email)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-cyan h-full rounded-full" style={{ width: '56%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-gray-700 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-navy"></span>
                        Pengajuan RFP & Quotation PT
                      </span>
                      <span className="text-navy">24% (342 email)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-navy h-full rounded-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-gray-700 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange"></span>
                        QR Code Brosur Teknisi Lapangan
                      </span>
                      <span className="text-navy">20% (290 email)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-orange h-full rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex items-start gap-3 text-xs text-gray-600">
                    <span className="text-base text-emerald-500 flex-shrink-0">✓</span>
                    <span><strong>Jadwal Buletin:</strong> Dikirim setiap hari Selasa (2 minggu sekali) berisi panduan teknis K3 sanitasi & tips praktis.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-gray-600">
                    <span className="text-base text-cyan flex-shrink-0">✓</span>
                    <span><strong>Fasilitas Khusus PT:</strong> Notifikasi jadwal regulasi lingkungan DLH & panduan manifest IPLT berkala.</span>
                  </div>
                  <div className="flex items-start gap-3 text-xs text-gray-600">
                    <span className="text-base text-orange flex-shrink-0">✓</span>
                    <span><strong>Kerahasiaan:</strong> Alamat email terlindungi SSL 256-bit dan tidak pernah dialihkan ke pihak ketiga.</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">Status Gateway Email:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Online & Siaga 24 Jam
                </span>
              </div>
            </div>
          </div>

          {/* Live Subscriber Monitor Table Card */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Control Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-navy">
                    Log Pendaftar Newsletter Terbaru
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy text-white">
                    {filteredSubscribers.length} Data
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Menampilkan entri pendaftar terkini yang masuk melalui website atau registrasi kemitraan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Bar */}
                <div className="relative min-w-[220px]">
                  <input
                    type="text"
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    placeholder="Cari email / nama / PT..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-cyan focus:ring-1 focus:ring-cyan text-navy"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Segment Filter Tab */}
                <div className="flex items-center bg-gray-200/60 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => setSubscriberCategoryFilter('Semua')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      subscriberCategoryFilter === 'Semua' ? 'bg-white text-navy shadow-sm' : 'text-gray-600 hover:text-navy'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setSubscriberCategoryFilter('komersial')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      subscriberCategoryFilter === 'komersial' ? 'bg-white text-navy shadow-sm' : 'text-gray-600 hover:text-navy'
                    }`}
                  >
                    B2B / PT
                  </button>
                  <button
                    onClick={() => setSubscriberCategoryFilter('residensial')}
                    className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                      subscriberCategoryFilter === 'residensial' ? 'bg-white text-navy shadow-sm' : 'text-gray-600 hover:text-navy'
                    }`}
                  >
                    Residensial
                  </button>
                </div>

                {/* Privacy Mask Toggle */}
                <button
                  onClick={() => setIsMaskEmail(!isMaskEmail)}
                  title="Toggle penyamaran email untuk privasi"
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-slate-50 text-xs font-semibold text-gray-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>{isMaskEmail ? '👁️' : '🔒'}</span>
                  <span>{isMaskEmail ? 'Buka Privasi' : 'Privasi Email'}</span>
                </button>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3.5 px-6">Pelanggan / PIC</th>
                    <th className="py-3.5 px-6">Perusahaan / Wilayah</th>
                    <th className="py-3.5 px-6">Alamat Email</th>
                    <th className="py-3.5 px-6">Segmentasi</th>
                    <th className="py-3.5 px-6">Waktu Terdaftar</th>
                    <th className="py-3.5 px-6">Status Validasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400">
                        Tidak ada subscriber yang cocok dengan kata kunci "{subscriberSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredSubscribers.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-6 font-semibold text-navy">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs flex-shrink-0">
                              {item.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate max-w-[150px]">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-800">{item.company}</span>
                        </td>
                        <td className="py-4 px-6 font-mono text-gray-600">
                          {formatEmailDisplay(item.email)}
                        </td>
                        <td className="py-4 px-6">
                          {item.interest === 'komersial' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              🏢 B2B / Komersial
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange/10 text-orange border border-orange/20">
                              🏠 Residensial
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-gray-500">
                          {item.formattedDate}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Controls */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>
                  Menampilkan <strong>{filteredSubscribers.length}</strong> dari <strong>{subscribersList.length}</strong> entri terbaru (+1.400 database terverifikasi).
                </span>
                <span>•</span>
                <button
                  onClick={handleResetSubscribersDemo}
                  className="text-gray-500 hover:text-navy underline transition cursor-pointer"
                >
                  Reset Log Default
                </button>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#newsletter"
                  className="font-bold text-navy hover:text-cyan transition flex items-center gap-1"
                >
                  <span>Daftar Email Baru di Form Newsletter</span>
                  <span>↑</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Reading Modal */}
      {activeArticleModal !== null && blogArticles[activeArticleModal] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setActiveArticleModal(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan/10 text-cyan-dark">
                  {blogArticles[activeArticleModal].category}
                </span>
                <span className="text-xs text-gray-500">
                  {blogArticles[activeArticleModal].readTime}
                </span>
              </div>
              <button
                onClick={() => setActiveArticleModal(null)}
                aria-label="Tutup Artikel"
                className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center transition focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy leading-tight mb-3">
                  {blogArticles[activeArticleModal].title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pb-4 border-b border-gray-100">
                  <span>✍️ Penulis: {blogArticles[activeArticleModal].author}</span>
                  <span>•</span>
                  <span>📅 Tanggal: {blogArticles[activeArticleModal].date}</span>
                </div>
              </div>

              {/* Featured Image inside Modal */}
              <div className="rounded-2xl overflow-hidden h-56 sm:h-72 w-full">
                <img
                  src={blogArticles[activeArticleModal].image}
                  alt={blogArticles[activeArticleModal].title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Article Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                {blogArticles[activeArticleModal].content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Key Takeaways Box */}
              <div className="bg-cyan/5 border-l-4 border-cyan p-5 rounded-2xl">
                <h4 className="font-bold text-navy text-sm mb-2 flex items-center gap-2">
                  <span>💡 Poin Kunci & Tips Praktis:</span>
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {blogArticles[activeArticleModal].keyTakeaways.map((tip, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2">
                      <span className="text-cyan font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {blogArticles[activeArticleModal].tags.map((tag, tagIdx) => (
                  <span key={tagIdx} className="text-xs bg-slate-100 text-gray-600 px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-5 sm:p-6 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500">
                Punya masalah terkait sanitasi di rumah atau kantor?
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition flex-1 sm:flex-none"
                >
                  Tutup
                </button>
                <a
                  href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya baru saja membaca artikel "${blogArticles[activeArticleModal].title}" dan ingin konsultasi untuk penanganan di tempat saya.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-dark transition shadow-md flex-1 sm:flex-none text-center"
                >
                  Konsultasi via WA
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Strip Banner Mitra & Asosiasi */}
      <section className="bg-white py-12 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">Mitra & Asosiasi Kami</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20">
            {/* Logo 1: IPLT */}
            <div className="mitra-item flex flex-col items-center text-gray-400 group cursor-pointer">
              <svg className="w-10 h-10 mb-2 group-hover:text-cyan transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-xs font-bold text-center group-hover:text-navy transition">IPLT Kota Bekasi</p>
            </div>

            {/* Logo 2: DLH */}
            <div className="mitra-item flex flex-col items-center text-gray-400 group cursor-pointer">
              <svg className="w-10 h-10 mb-2 group-hover:text-cyan transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <p className="text-xs font-bold text-center group-hover:text-navy transition">DLH Jawa Barat</p>
            </div>

            {/* Logo 3: Sertifikasi BNSP */}
            <div className="mitra-item flex flex-col items-center text-gray-400 group cursor-pointer">
              <svg className="w-10 h-10 mb-2 group-hover:text-cyan transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className="text-xs font-bold text-center group-hover:text-navy transition">Sertifikasi BNSP</p>
            </div>

            {/* Logo 4: OSS RBA */}
            <div className="mitra-item flex flex-col items-center text-gray-400 group cursor-pointer">
              <svg className="w-10 h-10 mb-2 group-hover:text-cyan transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs font-bold text-center group-hover:text-navy transition">Terdaftar OSS RBA</p>
            </div>

            {/* Logo 5: Asosiasi */}
            <div className="mitra-item flex flex-col items-center text-gray-400 group cursor-pointer">
              <svg className="w-10 h-10 mb-2 group-hover:text-cyan transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-xs font-bold text-center group-hover:text-navy transition">Asosiasi Limbah B3</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta-akhir" className="py-16 md:py-24 bg-navy relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url('https://z-cdn-media.chatglm.cn/files/f376cf34-d467-42fc-a752-92f97c36ed1b.jpg?auth_key=1891530048-5d5ab972979f442aa2ac45be1b8be3e6-0-b727bf4bfb372d573d4996732a6c874e')` }}
        ></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Septic Tank Penuh atau WC Mampet?</h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">Hubungi PT Kusuma Gemilang Raya untuk mendapatkan informasi dan penjadwalan layanan.</p>

          <a
            id="wa-cta-akhir"
            href={getDynamicWaLink('cta-akhir')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-10 py-5 bg-orange text-white text-lg font-bold rounded-2xl hover:bg-orange-dark transition shadow-2xl"
          >
            WhatsApp Sekarang
          </a>
          <p className="text-gray-400 mt-6">+62 896-7506-4916</p>
        </div>
      </section>

      {/* Legalitas & SEO Metadata Section (End of Page) */}
      <section
        id="legalitas-seo"
        className="py-16 md:py-24 bg-gradient-to-b from-slate-900 via-navy-dark to-slate-900 text-gray-200 border-t border-white/10 relative overflow-hidden"
      >
        {/* Decorative Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto mb-10 md:mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-cyan/20 text-cyan-light border border-cyan/40 tracking-wider uppercase flex items-center gap-1.5">
                <span>🏛️</span>
                <span>TRANSPARANSI BADAN USAHA RESMI</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <span>✓</span>
                <span>TERVERIFIKASI OSS RBA & KEMENKEU RI</span>
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                <span>🔍</span>
                <span>VALIDASI SCHEMA.ORG & GOOGLE SEO</span>
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Legalitas & SEO Metadata
            </h2>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Tabel transparansi sertifikasi perizinan resmi <strong className="text-white font-bold">PT Kusuma Gemilang Raya</strong>.
              Menjamin kepatuhan hukum 100% untuk audit HSE, CSMS, Procurement korporat B2B, serta reputasi E-E-A-T mesin pencari Google.
              Setiap parameter dilengkapi fitur <strong className="text-cyan-light font-bold">Salin ke Clipboard</strong> sekali klik.
            </p>

            {/* Quick Master Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCopyAllLegalInfo}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                  copiedDocField === 'ALL_LEGAL_DOSSIER'
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-300'
                    : 'bg-gradient-to-r from-cyan to-cyan-dark hover:from-cyan-dark hover:to-cyan text-navy shadow-cyan/20 hover:scale-[1.02]'
                }`}
                title="Salin seluruh nomor registrasi legalitas perusahaan untuk audit procurement"
              >
                <span>{copiedDocField === 'ALL_LEGAL_DOSSIER' ? '✓' : '📋'}</span>
                <span>
                  {copiedDocField === 'ALL_LEGAL_DOSSIER'
                    ? 'Seluruh Legalitas Berhasil Disalin!'
                    : 'Salin Seluruh Ringkasan Legalitas'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadBrochurePdf()}
                disabled={isDownloadingBrochurePdf}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>📄</span>
                <span>{isDownloadingBrochurePdf ? 'Mengunduh PDF...' : 'Unduh Brosur & Salinan NIB (.PDF)'}</span>
              </button>

              <a
                href={getDynamicWaLink('legalitas-seo')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <span>💬</span>
                <span>Verifikasi Legalitas via WA</span>
              </a>
            </div>
          </div>

          {/* Render Modular Compliance & SEO Metadata Data Grid Component */}
          <ComplianceSeoMetadata
            onDownloadPdf={() => handleDownloadBrochurePdf()}
            isDownloadingPdf={isDownloadingBrochurePdf}
            onToast={triggerToast}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={logoBekasiImg}
                  alt="Logo PT Kusuma Gemilang Raya"
                  className="w-12 h-12 rounded-full object-cover shadow-sm border border-white/10"
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-bold text-base text-white">PT KUSUMA GEMILANG RAYA</span>
                  <span className="text-xs text-gray-500">Jasa Sedot WC Bekasi & Sekitarnya</span>
                </div>
              </div>
              <p className="text-sm">Melayani sedot WC, septic tank, saluran mampet, limbah STP di wilayah Kota dan Kabupaten Bekasi.</p>
              
              {/* Social Media Quick Links */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="text-[11px] font-semibold text-gray-400 block mb-2">Media Sosial Resmi:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/ptkusumagemilangraya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-gray-300 hover:text-white flex items-center justify-center transition border border-white/10 hover:border-transparent"
                    title="Instagram Resmi @ptkusumagemilangraya"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/ptkusumagemilangraya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center transition border border-white/10 hover:border-transparent"
                    title="Facebook Resmi PT Kusuma Gemilang Raya"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/pt-kusuma-gemilang-raya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#0A66C2] text-gray-300 hover:text-white flex items-center justify-center transition border border-white/10 hover:border-transparent"
                    title="LinkedIn Resmi PT Kusuma Gemilang Raya"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#hero" className="hover:text-cyan transition">Beranda</a></li>
                <li><a href="#tentang" className="hover:text-cyan transition">Tentang Kami</a></li>
                <li><a href="#layanan" className="hover:text-cyan transition">Layanan</a></li>
                <li><a href="#area" className="hover:text-cyan transition">Area Layanan</a></li>
                <li><a href="#peta" className="hover:text-cyan transition">Peta Lokasi</a></li>
                <li><a href="#harga" className="hover:text-cyan transition">Harga</a></li>
                <li><a href="#galeri" className="hover:text-cyan transition">Galeri Proyek</a></li>
                <li><a href="#sertifikasi" className="hover:text-cyan transition">Sertifikasi & Kemitraan</a></li>
                <li><a href="#legalitas-seo" className="hover:text-cyan transition font-semibold text-cyan-light">Legalitas & SEO Metadata</a></li>
                <li><a href="#faq-b2b" className="hover:text-cyan transition font-semibold text-cyan-light">FAQ B2B & Korporat</a></li>
                <li><a href="#testimoni" className="hover:text-cyan transition">Testimoni</a></li>
                <li><a href="#faq" className="hover:text-cyan transition">FAQ Umum</a></li>
                <li><a href="#tips" className="hover:text-cyan transition">Tips Sanitasi</a></li>
                <li><a href="#newsletter" className="hover:text-cyan transition">Newsletter</a></li>
                <li><a href="#statistik-newsletter" className="hover:text-cyan transition">Statistik Newsletter</a></li>
                <li><a href="#kontak" className="hover:text-cyan transition">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  WhatsApp:{' '}
                  <a href="https://wa.me/6289675064916" target="_blank" rel="noopener noreferrer" className="text-orange hover:text-orange-dark">
                    +62 896-7506-4916
                  </a>
                </li>
                <li>Area: Bekasi, Jawa Barat</li>
                <li>Jam Operasional: 24 Jam</li>
              </ul>
            </div>
          </div>

          {/* Live Newsletter Statistic Bar & Admin Summary Widget in Footer */}
          <div className="my-8 p-6 bg-navy/90 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan/20 text-cyan-light flex items-center justify-center text-2xl flex-shrink-0 border border-cyan/30">
                  📊
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-white font-extrabold text-base sm:text-lg">
                      Ringkasan Statistik & Performa Subscriber Newsletter
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE DATABASE
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 max-w-xl">
                    Transparansi pertumbuhan pembaca buletin sanitasi berkala, edukasi septic tank bebas mampet, dan basis data klien korporat B2B PT Kusuma Gemilang Raya.
                  </p>
                </div>
              </div>

              {/* KPI Badges & Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-left">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Total Email Terdaftar</div>
                  <div className="text-lg font-black text-white flex items-center gap-1.5">
                    <span>{totalSubscribersCount.toLocaleString('id-ID')}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+18.4%</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-left">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Segmen Komersial / PT</div>
                  <div className="text-lg font-black text-cyan-light">
                    {commercialSubscribersCount.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">(64%)</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl text-left">
                  <div className="text-[10px] uppercase font-bold text-gray-400">Deliverability</div>
                  <div className="text-lg font-black text-emerald-400">99.4%</div>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <a
                    href="#statistik-newsletter"
                    className="px-4 py-2.5 rounded-xl bg-cyan hover:bg-cyan-dark text-navy font-bold text-xs transition shadow-sm"
                  >
                    Lihat Statistik
                  </a>
                  <button
                    onClick={() => setIsAdminDashboardOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition border border-white/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>⚙️</span>
                    <span>Dashboard Admin</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Social Media Footer Bar (Connected with LocalBusiness Schema sameAs) */}
          <div className="my-8 p-6 bg-gradient-to-r from-navy/95 via-navy-dark to-navy/95 border border-white/10 rounded-3xl shadow-xl backdrop-blur-md">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Left Info & Branding */}
              <div className="text-center lg:text-left">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan/20 text-cyan-light border border-cyan/30 tracking-wider uppercase">
                    🌐 Saluran Resmi Media Sosial
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-gray-300 border border-white/10 hidden sm:inline">
                    ✓ Terverifikasi Schema.org LocalBusiness
                  </span>
                </div>
                <h4 className="text-white font-extrabold text-base sm:text-lg">
                  Konektivitas Media Sosial PT Kusuma Gemilang Raya
                </h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xl">
                  Ikuti saluran resmi kami di Instagram, Facebook, dan LinkedIn untuk galeri foto dokumentasi proyek industri B2B, tips sanitasi, serta komunikasi kemitraan vendor.
                </p>
              </div>

              {/* Social Media Link Cards (Instagram, Facebook, LinkedIn) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com/ptkusumagemilangraya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-gradient-to-tr hover:from-purple-900/40 hover:via-pink-900/30 hover:to-amber-900/30 border border-white/10 hover:border-pink-500/50 text-gray-200 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 duration-200"
                  aria-label="Instagram Resmi PT Kusuma Gemilang Raya"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.13-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="text-left leading-tight overflow-hidden">
                    <div className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors flex items-center gap-1">
                      <span>Instagram</span>
                      <span className="text-[10px] text-gray-400">↗</span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">@ptkusumagemilangraya</div>
                  </div>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/ptkusumagemilangraya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/50 text-gray-200 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 duration-200"
                  aria-label="Facebook Resmi PT Kusuma Gemilang Raya"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div className="text-left leading-tight overflow-hidden">
                    <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1">
                      <span>Facebook</span>
                      <span className="text-[10px] text-gray-400">↗</span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">PT Kusuma Gemilang</div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/pt-kusuma-gemilang-raya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-sky-600/20 border border-white/10 hover:border-sky-500/50 text-gray-200 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 duration-200"
                  aria-label="LinkedIn Resmi PT Kusuma Gemilang Raya"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#0A66C2] flex items-center justify-center text-white shadow-md flex-shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div className="text-left leading-tight overflow-hidden">
                    <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors flex items-center gap-1">
                      <span>LinkedIn</span>
                      <span className="text-[10px] text-gray-400">↗</span>
                    </div>
                    <div className="text-[11px] text-gray-400 truncate">PT Kusuma Gemilang</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© PT Kusuma Gemilang Raya. All Rights Reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-gray-500">Saluran Media Sosial:</span>
              <a
                href="https://www.instagram.com/ptkusumagemilangraya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan text-gray-300 transition flex items-center gap-1"
              >
                <span>Instagram</span>
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="https://www.facebook.com/ptkusumagemilangraya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan text-gray-300 transition flex items-center gap-1"
              >
                <span>Facebook</span>
              </a>
              <span className="text-gray-700">•</span>
              <a
                href="https://www.linkedin.com/company/pt-kusuma-gemilang-raya"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cyan text-gray-300 transition flex items-center gap-1"
              >
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Dashboard Monitoring Modal */}
      {isAdminDashboardOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsAdminDashboardOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 bg-navy text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan/20 border border-cyan/40 text-cyan-light flex items-center justify-center text-xl font-bold">
                  📊
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      Dashboard Monitoring Subscriber Newsletter
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ADMIN PORTAL
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Sistem pemantauan CRM & pertumbuhan subscriber buletin PT Kusuma Gemilang Raya.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAdminDashboardOpen(false)}
                aria-label="Tutup Dashboard Admin"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 flex items-center justify-center transition focus:outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* 4 Mini KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Total Subscriber</div>
                  <div className="text-2xl font-black text-navy mt-1">
                    {totalSubscribersCount.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">+18.4% MoM (Aktif)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Segmen Komersial PT</div>
                  <div className="text-2xl font-black text-navy mt-1">
                    {commercialSubscribersCount.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-cyan-dark font-bold mt-0.5">64% Porsi B2B Industri</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Segmen Residensial</div>
                  <div className="text-2xl font-black text-navy mt-1">
                    {residentialSubscribersCount.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-orange font-bold mt-0.5">36% Porsi Hunian</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200">
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Tingkat Validitas</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1">
                    99.4%
                  </div>
                  <div className="text-[10px] text-gray-500 font-semibold mt-0.5">Open Rate 43.8%</div>
                </div>
              </div>

              {/* Summary Table: Performance Categorization by Subscriber Acquisition Source */}
              <div className="bg-slate-50/90 rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-extrabold text-navy flex items-center gap-2">
                        <span>📈</span>
                        <span>Ringkasan Kinerja Kanal Pemasaran (Subscribers by Source)</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/20 text-cyan-dark border border-cyan/30">
                        MARKETING CHANNELS
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Kategorisasi subscriber berdasarkan saluran akuisisi untuk memvisualisasikan performa konversi & komposisi segmen pendaftar.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {subscriberSourceFilter !== 'Semua' && (
                      <button
                        onClick={() => setSubscriberSourceFilter('Semua')}
                        className="px-3 py-1.5 rounded-xl bg-white border border-cyan text-cyan-dark hover:bg-cyan/10 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        title="Tampilkan semua sumber"
                      >
                        <span>✕</span>
                        <span>Reset Filter Kanal</span>
                      </button>
                    )}
                    <button
                      onClick={handleExportSourceSummaryCsv}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-gray-200 text-navy text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      title="Unduh tabel ringkasan sumber dalam format CSV"
                    >
                      <span>📊</span>
                      <span>Unduh CSV Kanal</span>
                    </button>
                  </div>
                </div>

                {/* 3 Quick Marketing Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Kanal Dominan Teratas</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <div className="font-extrabold text-navy text-sm truncate mr-2">
                        {sourceSummaryList[0]?.icon} {sourceSummaryList[0]?.source || '-'}
                      </div>
                      <span className="text-xs font-black text-cyan-dark">
                        {sourceSummaryList[0]?.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {sourceSummaryList[0]?.count || 0} subscriber terdaftar
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Kanal B2B Industri Terbesar</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <div className="font-extrabold text-blue-900 text-sm truncate mr-2">
                        🏢 Formulir Web B2B
                      </div>
                      <span className="text-xs font-bold text-blue-700">
                        {sourceSummaryList.find((s) => s.source === 'Formulir Web B2B')?.commercialCount || 0} PT
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Porsi utama pabrik & gedung komersial
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Kanal Edukasi & SEO Organik</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <div className="font-extrabold text-emerald-900 text-sm truncate mr-2">
                        ✍️ Tips Sanitasi Blog
                      </div>
                      <span className="text-xs font-bold text-emerald-700">
                        {sourceSummaryList.find((s) => s.source === 'Tips Sanitasi Blog')?.count || 0} Leads
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      Trafik pembaca panduan & artikel
                    </div>
                  </div>
                </div>

                {/* The Summary Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                        <th className="py-3 px-4">Kanal / Sumber Pendaftaran (Source)</th>
                        <th className="py-3 px-4 text-center">Total</th>
                        <th className="py-3 px-4 min-w-[170px]">Pangsa Kontribusi (% Share)</th>
                        <th className="py-3 px-4">Komposisi Segmen</th>
                        <th className="py-3 px-4">Kinerja Saluran</th>
                        <th className="py-3 px-4 text-center">Aksi Filter</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sourceSummaryList.map((item) => {
                        const isFiltered = subscriberSourceFilter === item.source;
                        return (
                          <tr
                            key={item.source}
                            onClick={() =>
                              setSubscriberSourceFilter(isFiltered ? 'Semua' : item.source)
                            }
                            className={`transition cursor-pointer ${
                              isFiltered
                                ? 'bg-cyan/10 ring-1 ring-cyan font-medium'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-start gap-2.5">
                                <span className="text-lg leading-none mt-0.5">{item.icon}</span>
                                <div>
                                  <div className="font-extrabold text-navy flex items-center gap-1.5">
                                    <span>{item.source}</span>
                                    {isFiltered && (
                                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan text-white">
                                        Aktif
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                                    {item.categoryDescription}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full text-xs font-black bg-navy/10 text-navy">
                                {item.count}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="font-extrabold text-navy">
                                    {item.percentage.toFixed(1)}%
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                    {item.count} dari {subscribersList.length}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-cyan to-navy h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, Math.max(4, item.percentage))}%` }}
                                  />
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                                {item.commercialCount > 0 && (
                                  <span className="px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                    🏢 {item.commercialCount} PT
                                  </span>
                                )}
                                {item.residentialCount > 0 && (
                                  <span className="px-2 py-0.5 rounded-md font-bold bg-orange/10 text-orange border border-orange/20">
                                    🏡 {item.residentialCount} Residensial
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item.performanceColor}`}
                              >
                                {item.performanceTag}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSubscriberSourceFilter(isFiltered ? 'Semua' : item.source);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                                  isFiltered
                                    ? 'bg-navy text-white shadow-2xs'
                                    : 'bg-white hover:bg-slate-100 border border-gray-200 text-gray-700'
                                }`}
                              >
                                {isFiltered ? '✓ Memfilter' : 'Filter Log'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-extrabold text-navy border-t-2 border-gray-300">
                        <td className="py-3 px-4 text-xs">
                          TOTAL KESELURUHAN ({sourceSummaryList.length} Kanal Aktif)
                        </td>
                        <td className="py-3 px-4 text-center text-xs">
                          {subscribersList.length}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-between text-xs font-black">
                            <span>100.0%</span>
                            <span className="text-[10px] text-gray-500 font-normal">Pangsa Total</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-[10px]">
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-bold">
                              🏢 {subscribersList.filter((s) => s.interest === 'komersial').length} PT
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-orange/20 text-orange font-bold">
                              🏡 {subscribersList.filter((s) => s.interest === 'residensial').length} Residensial
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-[10px] text-gray-500">
                          Data Terverifikasi CRM
                        </td>
                        <td className="py-3 px-4 text-center">
                          {subscriberSourceFilter !== 'Semua' && (
                            <button
                              type="button"
                              onClick={() => setSubscriberSourceFilter('Semua')}
                              className="text-[10px] font-bold text-cyan-dark hover:underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Detailed Subscribers Log Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-navy">
                      📋 Detail Log Riwayat Pendaftaran Subscriber
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-navy text-white">
                      {filteredSubscribers.length} Entri
                    </span>
                  </div>
                  {subscriberSourceFilter !== 'Semua' && (
                    <div className="flex items-center gap-1.5 text-xs text-navy bg-cyan/15 px-2.5 py-1 rounded-lg border border-cyan/30">
                      <span>Memfilter Sumber:</span>
                      <strong className="text-cyan-dark font-extrabold">"{subscriberSourceFilter}"</strong>
                      <button
                        onClick={() => setSubscriberSourceFilter('Semua')}
                        className="ml-1 text-gray-500 hover:text-navy cursor-pointer font-bold"
                        title="Hapus filter sumber"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Toolbar & Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[200px]">
                      <input
                        type="text"
                        value={subscriberSearch}
                        onChange={(e) => setSubscriberSearch(e.target.value)}
                        placeholder="Filter nama / email / PT / sumber..."
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-cyan text-navy"
                      />
                      <span className="absolute left-2.5 top-2 text-xs text-gray-400">🔍</span>
                    </div>

                    <div className="flex items-center bg-gray-200 p-1 rounded-xl text-xs font-bold">
                      <button
                        onClick={() => setSubscriberCategoryFilter('Semua')}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                          subscriberCategoryFilter === 'Semua' ? 'bg-white text-navy shadow-xs' : 'text-gray-600'
                        }`}
                      >
                        Semua
                      </button>
                      <button
                        onClick={() => setSubscriberCategoryFilter('komersial')}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                          subscriberCategoryFilter === 'komersial' ? 'bg-white text-navy shadow-xs' : 'text-gray-600'
                        }`}
                      >
                        Komersial
                      </button>
                      <button
                        onClick={() => setSubscriberCategoryFilter('residensial')}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                          subscriberCategoryFilter === 'residensial' ? 'bg-white text-navy shadow-xs' : 'text-gray-600'
                        }`}
                      >
                        Residensial
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-gray-500">Sumber:</span>
                      <select
                        value={subscriberSourceFilter}
                        onChange={(e) => setSubscriberSourceFilter(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-navy outline-none focus:border-cyan cursor-pointer"
                      >
                        <option value="Semua">Semua Sumber ({subscribersList.length})</option>
                        {availableSources.map((src) => {
                          const count = subscribersList.filter((s) => s.source === src).length;
                          return (
                            <option key={src} value={src}>
                              {src} ({count})
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <button
                      onClick={() => setIsMaskEmail(!isMaskEmail)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      {isMaskEmail ? '👁️ Tampilkan Email' : '🔒 Samarkan Email'}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddSimulationSubscriber}
                      className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:bg-slate-100 text-xs font-bold text-navy transition cursor-pointer"
                    >
                      ⚡ +1 Simulasi
                    </button>
                    <button
                      onClick={handleExportSubscribersCsv}
                      className="px-3.5 py-1.5 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition cursor-pointer flex items-center gap-1"
                    >
                      <span>📥 Unduh CSV Log</span>
                    </button>
                  </div>
                </div>

                {/* Table inside Modal */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        <th className="py-3 px-4">Nama / PIC</th>
                        <th className="py-3 px-4">Perusahaan / Wilayah</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Segmen</th>
                        <th className="py-3 px-4">Waktu</th>
                        <th className="py-3 px-4">Sumber Kanal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredSubscribers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-400">
                            Tidak ada subscriber yang cocok dengan filter yang dipilih.
                          </td>
                        </tr>
                      ) : (
                        filteredSubscribers.map((item) => {
                          const meta = getSourceIconAndMeta(item.source);
                          return (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                              <td className="py-3 px-4 font-bold text-navy">{item.name}</td>
                              <td className="py-3 px-4 text-gray-700">{item.company}</td>
                              <td className="py-3 px-4 font-mono text-gray-600">{formatEmailDisplay(item.email)}</td>
                              <td className="py-3 px-4">
                                {item.interest === 'komersial' ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800">
                                    Komersial / PT
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange/10 text-orange">
                                    Residensial
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-gray-500">{item.formattedDate}</td>
                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200 inline-flex items-center gap-1.5">
                                  <span>{meta.icon}</span>
                                  <span>{item.source}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                Data disimpan di LocalStorage browser dan siap disinkronkan dengan gateway mailing CRM.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSubscribersDemo}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-100 transition cursor-pointer"
                >
                  Reset Log Default
                </button>
                <button
                  onClick={() => setIsAdminDashboardOpen(false)}
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Unduh Brosur PDF & Verifikasi Legalitas NIB Perusahaan B2B */}
      {isBrochureModalOpen && (
        <div
          role="dialog"
          aria-label="Modal Brosur & Legalitas NIB Perusahaan"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsBrochureModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-navy via-navy to-navy-light text-white flex items-center justify-between border-b border-white/10 relative">
              <div className="pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan/20 text-cyan-light border border-cyan/40 uppercase tracking-wider">
                    📄 DOKUMEN RESMI PENGADAAN B2B
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Terverifikasi OSS & Kemenkumham
                  </span>
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-white leading-tight">
                  Profil Perusahaan & Legalitas NIB KBLI 37011
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  PT KUSUMA GEMILANG RAYA • Berkas resmi untuk kebutuhan audit vendor, GA, HSE, dan Procurement.
                </p>
              </div>

              <button
                onClick={() => setIsBrochureModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
                title="Tutup Modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Quick Action Top Banner */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md shrink-0">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-2v1.5h1.5v1h-1.5v2h-1v-5.5h3v1zm5 4.5h-2.5v-5.5h2.5c.8 0 1.5.7 1.5 1.5v2.5c0 .8-.7 1.5-1.5 1.5zm4.5-4.5h-2v1.5h1.5v1h-1.5v2h-1v-5.5h3v1z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm sm:text-base">
                      Brosur Profil PT & Salinan NIB (.PDF)
                    </h4>
                    <p className="text-gray-500 text-xs">
                      Format siap cetak (A4) lengkap dengan cap perusahaan dan spesifikasi teknis armada.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleDownloadBrochurePdf()}
                    disabled={isDownloadingBrochurePdf}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-orange hover:bg-orange-dark text-white font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isDownloadingBrochurePdf ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Mengunduh...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Unduh PDF Sekarang</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-navy font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Cetak Dokumen"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="hidden sm:inline">Cetak</span>
                  </button>
                </div>
              </div>

              {/* Optional Customization: Nama Perusahaan Klien */}
              <div className="p-4 rounded-2xl bg-cyan/5 border border-cyan/20">
                <label className="block font-bold text-navy text-xs mb-1">
                  Kustomisasi untuk Perusahaan Anda (Opsional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="brochure-corporate-clients-datalist"
                    placeholder="Contoh: PT. Hyundai / PT. Seino Indomobil Logistics (untuk audit internal)"
                    value={brochureClientName}
                    onChange={(e) => setBrochureClientName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300 focus:border-cyan outline-none text-xs bg-white"
                  />
                  <datalist id="brochure-corporate-clients-datalist">
                    {CORPORATE_CLIENTS.map((c) => (
                      <option key={c.id} value={c.name}>{c.sector}</option>
                    ))}
                  </datalist>
                  {brochureClientName && (
                    <button
                      type="button"
                      onClick={() => handleDownloadBrochurePdf(brochureClientName)}
                      className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-navy-light transition cursor-pointer shrink-0"
                    >
                      Unduh Khusus
                    </button>
                  )}
                </div>

                {/* Quick Client Chips */}
                <div className="flex flex-wrap items-center gap-1 mt-2">
                  <span className="text-[10px] text-gray-500 font-semibold mr-1">Rekomendasi Rekanan:</span>
                  {CORPORATE_CLIENTS.slice(0, 6).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setBrochureClientName(c.name)}
                      className={`px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer ${
                        brochureClientName === c.name
                          ? 'bg-cyan text-slate-900 font-bold'
                          : 'bg-white hover:bg-cyan/10 text-gray-600 border border-gray-200'
                      }`}
                    >
                      {c.shortName}
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-gray-500 mt-1.5">
                  Nama perusahaan Anda akan otomatis tercantum pada halaman cover & lembar pengesahan brosur PDF sebagai rekanan tujuan audit.
                </p>
              </div>

              {/* Legal Credentials Summary Grid */}
              <div>
                <h4 className="font-bold text-navy text-sm mb-3 flex items-center gap-2">
                  <span>🏛️</span>
                  <span>Data Legalitas & Identitas Badan Usaha Resmi</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Card NIB */}
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Nomor Induk Berusaha (NIB)</span>
                      <p className="font-mono font-bold text-navy text-sm mt-0.5">0220108920194</p>
                      <span className="text-[11px] text-emerald-600 font-semibold">Aktif • OSS Berbasis Risiko</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyDocField('NIB', '0220108920194')}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-navy font-semibold text-xs transition cursor-pointer"
                    >
                      {copiedDocField === 'NIB' ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>

                  {/* Card KBLI */}
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Klasifikasi Usaha (KBLI)</span>
                      <p className="font-mono font-bold text-navy text-sm mt-0.5">37011</p>
                      <span className="text-[11px] text-gray-600">Pengelolaan Air Limbah Tidak Berbahaya</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyDocField('KBLI', '37011')}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-navy font-semibold text-xs transition cursor-pointer"
                    >
                      {copiedDocField === 'KBLI' ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>

                  {/* Card NPWP / SPPKP */}
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">NPWP Perusahaan & SPPKP</span>
                      <p className="font-mono font-bold text-navy text-sm mt-0.5">94.812.394.8-407.000</p>
                      <span className="text-[11px] text-cyan-dark font-semibold">Faktur Pajak e-Faktur PPN 11%</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyDocField('NPWP', '94.812.394.8-407.000')}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-navy font-semibold text-xs transition cursor-pointer"
                    >
                      {copiedDocField === 'NPWP' ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>

                  {/* Card IPLT & BAST */}
                  <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Pembuangan Akhir Limbah</span>
                      <p className="font-bold text-navy text-sm mt-0.5">IPLT Resmi Pemda Bekasi</p>
                      <span className="text-[11px] text-gray-600">Dilengkapi Manifest & BAST Bermaterai</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      100% Legal
                    </span>
                  </div>
                </div>
              </div>

              {/* Service & Fleet Specifications Overview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                <h4 className="font-bold text-navy text-sm flex items-center gap-2">
                  <span>🚛</span>
                  <span>Kapasitas Armada & Fasilitas Operasional</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <p className="text-base sm:text-lg font-extrabold text-navy">4.000 - 10.000L</p>
                    <p className="text-[11px] text-gray-500">Kapasitas Tangki Vakum</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <p className="text-base sm:text-lg font-extrabold text-cyan">100+ Meter</p>
                    <p className="text-[11px] text-gray-500">Jangkauan Selang Spiral</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <p className="text-base sm:text-lg font-extrabold text-orange">24 Jam</p>
                    <p className="text-[11px] text-gray-500">Siaga Operasional & Shift</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-200">
                    <p className="text-base sm:text-lg font-extrabold text-emerald-600">CSMS / K3</p>
                    <p className="text-[11px] text-gray-500">Standar APD & Confined Space</p>
                  </div>
                </div>
              </div>

              {/* Corporate Terms & B2B Procurement Assurance */}
              <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-2">
                <h4 className="font-bold text-navy text-xs uppercase tracking-wide">
                  Kebijakan Penagihan & Pembayaran B2B Korporat:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                  <li>Mendukung sistem pembayaran berbasis <strong>Purchase Order (PO)</strong> dan kontrak berkala (SLA).</li>
                  <li>Termin pembayaran (Terms of Payment / TOP) 14 hingga 30 hari kalender setelah BAST ditandatangani.</li>
                  <li>Faktur pajak resmi e-Faktur PPN 11% langsung diterbitkan bersamaan dengan Invoice dan Surat Jalan.</li>
                  <li>Pembayaran resmi wajib ditransfer ke Rekening Giro Perusahaan (a.n. PT KUSUMA GEMILANG RAYA).</li>
                </ul>
              </div>

              {/* WhatsApp Share Alternative */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-bold text-emerald-900 text-xs">Butuh Kirim Dokumen ke WhatsApp Tim Manajemen / Atasan?</p>
                    <p className="text-[11px] text-emerald-700">Hubungi langsung Dispatcher Corporate untuk pengiriman file PDF langsung via WhatsApp.</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/6289675064916?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, mohon dikirimkan berkas Company Profile, salinan NIB KBLI 37011, format BAST, dan SPPKP Faktur Pajak untuk kelengkapan administrasi vendor perusahaan kami.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shrink-0"
                >
                  Kirim via WhatsApp
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                Hak Cipta Dokumen © {new Date().getFullYear()} PT Kusuma Gemilang Raya.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBrochureModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition cursor-pointer text-xs"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadBrochurePdf()}
                  disabled={isDownloadingBrochurePdf}
                  className="px-5 py-2 rounded-xl bg-navy hover:bg-navy-light text-white font-bold transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 text-xs"
                >
                  {isDownloadingBrochurePdf ? 'Sedang Memproses...' : 'Unduh Dokumen PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal Beri Nilai Kepuasan & Tulis Testimoni Kuantitatif */}
      {isReviewModalOpen && (
        <div
          role="dialog"
          aria-label="Modal Beri Nilai Kepuasan & Testimoni"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-navy via-navy to-navy-light text-white flex items-center justify-between border-b border-white/10 relative">
              <div className="pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                    ⭐ FORMULIR INDEKS KEPUASAN (CSAT)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Penilaian Terbuka & Transparan
                  </span>
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-white leading-tight">
                  Beri Nilai Kepuasan & Testimoni Layanan
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  PT KUSUMA GEMILANG RAYA • Masukan kuantitatif Anda sangat berharga untuk peningkatan mutu layanan sanitasi kami.
                </p>
              </div>

              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
                title="Tutup Modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSubmitNewReview} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Main Overall Star Selector */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 text-center">
                <label className="block font-bold text-navy text-sm sm:text-base mb-1">
                  Berapa Nilai Kepuasan Keseluruhan Anda? (1 - 5 Bintang)
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  Pilih jumlah bintang yang mencerminkan tingkat kepuasan Anda:
                </p>

                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (newReviewHoverRating || newReviewRating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReviewRating(star)}
                        onMouseEnter={() => setNewReviewHoverRating(star)}
                        onMouseLeave={() => setNewReviewHoverRating(0)}
                        className="p-1 rounded-lg hover:bg-amber-100/80 transition-transform transform hover:scale-125 cursor-pointer"
                        aria-label={`Pilih ${star} Bintang`}
                      >
                        <svg
                          className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${
                            isFilled
                              ? 'text-amber-500 fill-current drop-shadow-sm'
                              : 'text-gray-300 fill-current'
                          }`}
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      </button>
                    );
                  })}
                </div>

                <div className="text-xs font-bold text-amber-800">
                  {newReviewRating === 5 && '★★★★★ 5.0 / 5.0 — Luar Biasa / Sangat Puas (Sangat Merekomendasikan)'}
                  {newReviewRating === 4 && '★★★★☆ 4.0 / 5.0 — Sangat Baik (Puas dengan Pelayanan)'}
                  {newReviewRating === 3 && '★★★☆☆ 3.0 / 5.0 — Cukup Baik (Sesuai Standar)'}
                  {newReviewRating === 2 && '★★☆☆☆ 2.0 / 5.0 — Perlu Ditingkatkan'}
                  {newReviewRating === 1 && '★☆☆☆☆ 1.0 / 5.0 — Kurang Puas'}
                </div>
              </div>

              {/* Sub-Criteria Quantitative Sliders */}
              <div className="bg-slate-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-navy block">
                  Penilaian Kuantitatif Kriteria Spesifik:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 block mb-1">
                      ⏱️ Ketepatan Waktu Armada
                    </label>
                    <select
                      value={newReviewPunctualityScore}
                      onChange={(e) => setNewReviewPunctualityScore(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-navy focus:outline-none focus:border-cyan"
                    >
                      <option value={5}>★ 5.0 - Sangat Tepat Waktu</option>
                      <option value={4}>★ 4.0 - Tepat Waktu</option>
                      <option value={3}>★ 3.0 - Sedikit Terlambat</option>
                      <option value={2}>★ 2.0 - Kurang Tepat Waktu</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 block mb-1">
                      🛡️ Kebersihan & APD K3
                    </label>
                    <select
                      value={newReviewCleanlinessScore}
                      onChange={(e) => setNewReviewCleanlinessScore(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-navy focus:outline-none focus:border-cyan"
                    >
                      <option value={5}>★ 5.0 - Bersih & APD Lengkap</option>
                      <option value={4}>★ 4.0 - Bersih</option>
                      <option value={3}>★ 3.0 - Standar</option>
                      <option value={2}>★ 2.0 - Kurang Bersih</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-gray-600 block mb-1">
                      💰 Transparansi Biaya
                    </label>
                    <select
                      value={newReviewCostTransparencyScore}
                      onChange={(e) => setNewReviewCostTransparencyScore(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-navy focus:outline-none focus:border-cyan"
                    >
                      <option value={5}>★ 5.0 - Sangat Jujur & Jelas</option>
                      <option value={4}>★ 4.0 - Sesuai Kesepakatan</option>
                      <option value={3}>★ 3.0 - Cukup Jelas</option>
                      <option value={2}>★ 2.0 - Kurang Transparan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Nama Anda / Nama Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Santoso / PT Mega Kreasi"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-cyan text-xs sm:text-sm text-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Lokasi / Jabatan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Perumahan Galaxy / GA Manager Cikarang"
                    value={newReviewRole}
                    onChange={(e) => setNewReviewRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-cyan text-xs sm:text-sm text-navy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Kategori Layanan yang Digunakan <span className="text-red-500">*</span>
                </label>
                <select
                  value={newReviewCategory}
                  onChange={(e) =>
                    setNewReviewCategory(
                      e.target.value as 'Residensial' | 'Industri & B2B' | 'Komersial' | 'Pelancaran Pipa'
                    )
                  }
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-cyan text-xs sm:text-sm text-navy font-medium"
                >
                  <option value="Residensial">Sedot WC & Septic Tank Rumah Tangga / Cluster</option>
                  <option value="Industri & B2B">Pengangkutan Limbah Cair Industri / Pabrik (B2B)</option>
                  <option value="Komersial">Sedot Grease Trap Restoran / Ruko / Mall</option>
                  <option value="Pelancaran Pipa">Pelancaran Saluran Pipa Mampet Hydro Jetting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy mb-1">
                  Isi Ulasan & Pengalaman Layanan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ceritakan pengalaman Anda terkait respons armada, kepatuhan teknisi, transparansi invoice, maupun kebersihan pengerjaan..."
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-cyan text-xs sm:text-sm text-navy resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-100 transition cursor-pointer text-xs"
                >
                  Batal
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange hover:bg-orange-dark text-white font-bold rounded-xl shadow-md transition cursor-pointer text-xs flex items-center gap-1.5"
                  >
                    <span>⭐</span>
                    <span>Simpan & Terbitkan Nilai Kepuasan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-in Newsletter Subscription Popup (Appears after 10s inactivity) */}
      <div
        role="dialog"
        aria-label="Popup Berlangganan Tips Sanitasi"
        className={`fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[420px] max-w-[440px] transition-all duration-500 ease-out ${
          isNewsletterSlideInOpen
            ? 'transform translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : 'transform translate-y-16 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-orange/40 overflow-hidden ring-4 ring-orange/10 backdrop-blur-md">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-navy via-navy to-navy-light text-white flex items-center justify-between border-b border-white/10 relative">
            <div className="pr-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  💡 TIPS SANITASI BEKASI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/20 text-cyan-light border border-cyan/30">
                  Gratis
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                Tips Perawatan Septic Tank & IPAL
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">
                Cegah pipa mampet & bau tak sedap dengan panduan resmi teknisi kami.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismissSlideInPopup}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
              title="Tutup Popup"
              aria-label="Tutup popup"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 text-xs sm:text-sm">
            {slideInStatus === 'success' ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h4 className="font-extrabold text-navy text-base">
                  Panduan Sanitasi Terkirim!
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {slideInMsg}
                </p>
                <button
                  type="button"
                  onClick={() => setIsNewsletterSlideInOpen(false)}
                  className="px-5 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleSlideInNewsletterSubmit} className="space-y-3">
                {/* Benefits Pills */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-gray-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <span className="text-cyan font-bold">✓</span>
                    <span>Trik atasi WC mampet</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <span className="text-cyan font-bold">✓</span>
                    <span>Jadwal kuras ideal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <span className="text-cyan font-bold">✓</span>
                    <span>SOP limbah cair B2B</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <span className="text-cyan font-bold">✓</span>
                    <span>Diskon berkala 10%</span>
                  </div>
                </div>

                {slideInStatus === 'error' && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{slideInMsg}</span>
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Alamat Email Anda <span className="text-orange">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={slideInEmail}
                    onChange={(e) => {
                      setSlideInEmail(e.target.value);
                      if (slideInStatus === 'error') setSlideInStatus('idle');
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy bg-white"
                  />
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Nama / Perusahaan <span className="text-gray-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pak Budi / PT Surya"
                    value={slideInName}
                    onChange={(e) => setSlideInName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy bg-white"
                  />
                </div>

                {/* Interest Pills */}
                <div>
                  <label className="block text-xs font-bold text-navy mb-1">
                    Kategori Kebutuhan
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSlideInInterest('residensial')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        slideInInterest === 'residensial'
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      🏠 Rumah Tangga
                    </button>
                    <button
                      type="button"
                      onClick={() => setSlideInInterest('komersial')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                        slideInInterest === 'komersial'
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      🏢 Pabrik / Bisnis
                    </button>
                  </div>
                </div>

                {/* Action Submit Button */}
                <button
                  type="submit"
                  disabled={slideInStatus === 'loading'}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange to-orange-dark hover:from-orange-dark hover:to-orange text-white font-bold text-xs sm:text-sm shadow-md shadow-orange/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {slideInStatus === 'loading' ? (
                    <span>Mendaftarkan...</span>
                  ) : (
                    <>
                      <span>📩 Dapatkan Tips Sanitasi Gratis</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                {/* Bottom Footer Note */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100">
                  <span>🔒 Bebas spam & privasi terjaga</span>
                  <button
                    type="button"
                    onClick={handleDismissSlideInPopup}
                    className="text-gray-500 hover:text-navy underline cursor-pointer"
                  >
                    Nanti saja
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Render Map Print Preview Modal for Physical Site Visits */}
      <MapPrintPreviewModal
        isOpen={isMapPrintPreviewOpen}
        onClose={() => setIsMapPrintPreviewOpen(false)}
        hubs={mapHubs}
        activeHubIndex={activeMapHubIndex}
        onSelectHubIndex={(index) => handleSelectMapHub(index, false)}
        onToast={triggerToast}
      />

      {adminNotificationToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-navy text-white text-xs sm:text-sm font-semibold shadow-2xl border border-cyan/40 flex items-center gap-3">
          <span className="text-emerald-400 text-lg">✓</span>
          <span>{adminNotificationToast}</span>
        </div>
      )}
    </div>
  );
}
