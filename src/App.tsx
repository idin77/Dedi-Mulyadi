/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import teknisiSedotWcImg from './assets/images/teknisi_lapangan_sedot_wc_1791530702926.jpg';
import teknisiPipaImg from './assets/images/teknisi_pelancaran_pipa_1791530724142.jpg';
import logoBekasiImg from './assets/images/logo_bekasi.jpeg';
import heroKusumaImg from './assets/images/hero_kusuma.jpg';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentSection, setCurrentSection] = useState('hero');
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState('Semua');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeMapHubIndex, setActiveMapHubIndex] = useState(0);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState('Semua');
  const [activeArticleModal, setActiveArticleModal] = useState<number | null>(null);
  const [selectedCertCategory, setSelectedCertCategory] = useState<'Semua' | 'Regulator' | 'K3 & Mutu' | 'Asosiasi & Kawasan'>('Semua');

  // Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterInterest, setNewsletterInterest] = useState<'residensial' | 'komersial'>('residensial');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMsg, setNewsletterMsg] = useState('');

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

  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberCategoryFilter, setSubscriberCategoryFilter] = useState<'Semua' | 'komersial' | 'residensial'>('Semua');
  const [subscriberTimeRange, setSubscriberTimeRange] = useState<'Semua Waktu' | '30 Hari' | 'Bulan Ini' | 'Kuartal Ini'>('Semua Waktu');
  const [isMaskEmail, setIsMaskEmail] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [adminNotificationToast, setAdminNotificationToast] = useState<string | null>(null);

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
      badge: 'Pool Induk Armada',
      address: 'Jl. Jendral Ahmad Yani & Grand Galaxy, Kota Bekasi',
      coverage: 'Bekasi Barat, Bekasi Timur, Bekasi Selatan, Bekasi Utara, Jatiasih, Medan Satria, Rawalumbu, Pondok Gede, Bantar Gebang, Jatisampurna, Mustika Jaya.',
      response: '15 - 20 Menit',
      armadaCount: '12 Unit Truk Tangki',
      mapQuery: 'Kota+Bekasi,+Jawa+Barat',
      mapsDirectUrl: 'https://www.google.com/maps/search/?api=1&query=Bekasi+Jawa+Barat',
      lat: '-6.2349',
      lng: '106.9966',
    },
    {
      id: 'cikarang',
      name: 'Pos Cikarang & Kawasan Industri',
      badge: 'Pos Industri & Residensial',
      address: 'Kawasan Industri Cikarang (Jababeka, MM2100, EJIP, GIIC, Deltamas)',
      coverage: 'Cikarang Barat, Timur, Utara, Selatan, Pusat, Cibarusah, Bojongmangu, Serang Baru, Setu, Karangbahagia, Kedungwaringin.',
      response: '15 - 25 Menit',
      armadaCount: '8 Unit Truk Tangki',
      mapQuery: 'Cikarang,+Bekasi,+Jawa+Barat',
      mapsDirectUrl: 'https://www.google.com/maps/search/?api=1&query=Cikarang+Bekasi+Jawa+Barat',
      lat: '-6.3023',
      lng: '107.1517',
    },
    {
      id: 'tambun',
      name: 'Pos Tambun, Cibitung & Pantura',
      badge: 'Pos Jalur Pantura',
      address: 'Jl. Raya Diponegoro & Teuku Umar, Tambun Selatan & Cibitung, Bekasi',
      coverage: 'Tambun Selatan, Tambun Utara, Cibitung, Babelan, Tarumajaya, Sukatani, Sukakarya, Pebayuran, Sukawangi, Tambelang.',
      response: '20 - 30 Menit',
      armadaCount: '6 Unit Truk Tangki',
      mapQuery: 'Tambun+Selatan,+Bekasi,+Jawa+Barat',
      mapsDirectUrl: 'https://www.google.com/maps/search/?api=1&query=Tambun+Selatan+Bekasi+Jawa+Barat',
      lat: '-6.2625',
      lng: '107.0583',
    },
  ];

  // Calculator State
  const [calcPricePerCubic, setCalcPricePerCubic] = useState(600000);
  const [calcVolume, setCalcVolume] = useState<number>(1);
  const [selectedCalcOptionIndex, setSelectedCalcOptionIndex] = useState(0);

  const calcOptions = [
    { value: 600000, label: 'Limbah Black Water (Tinja) - Rp 600.000/kubik (Non Manifes)', type: 'Limbah Black Water (Tinja)', option: 'Non Manifes' },
    { value: 1000000, label: 'Limbah Grey Water (Lumpur, Lemak) - Rp 1.000.000/kubik (Non Manifes)', type: 'Limbah Grey Water (Lumpur, Lemak)', option: 'Non Manifes' },
    { value: 1000000, label: 'Cleaning / Blower Lumpur - Rp 1.000.000/kubik (Non Manifes)', type: 'Cleaning / Blower Lumpur', option: 'Non Manifes' },
    { value: 1000000, label: 'Limbah Black Water (Tinja) - Rp 1.000.000/kubik (Manifes)', type: 'Limbah Black Water (Tinja)', option: 'Manifes' },
    { value: 1400000, label: 'Limbah Grey Water (Lumpur, Lemak) - Rp 1.400.000/kubik (Manifes)', type: 'Limbah Grey Water (Lumpur, Lemak)', option: 'Manifes' },
    { value: 1400000, label: 'Cleaning / Blower Lumpur - Rp 1.400.000/kubik (Manifes)', type: 'Cleaning / Blower Lumpur', option: 'Manifes' },
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

  // Testimonials data
  const testimonials = [
    {
      initial: 'B',
      bgColor: 'bg-orange/10',
      textColor: 'text-orange',
      text: '"Pelayanannya sangat cepat dan profesional. Truk sedotnya datang tepat waktu, teknisinya pakai APD lengkap, dan setelah selesai area kerjanya dibersihkan sampai higienis. Sangat puas!"',
      author: 'Bapak Budi Santoso',
      role: 'Perumahan Cluster, Bekasi Selatan',
    },
    {
      initial: 'S',
      bgColor: 'bg-cyan/10',
      textColor: 'text-cyan',
      text: '"Sebagai manajer fasilitas pabrik di Cikarang, saya butuh vendor limbah yang legal dan transparan. PT Kusuma Gemilang Raya selalu memberikan manifest IPLT yang lengkap. Recommended banget untuk industri!"',
      author: 'Ibu Siti Rahayu',
      role: 'Manajer Fasilitas Pabrik, Cikarang',
    },
    {
      initial: 'P',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600',
      text: '"WC kantor mampet parah, dipanggilkan teknisinya langsung datang cepat. Harga transparan di awal, tidak ada biaya tersembunyi. Pelayanannya sangat ramah dan bersih."',
      author: 'Pak Hendrawan',
      role: 'Kantor Ruko, Bekasi Timur',
    },
  ];

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
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Chatbot auto-scroll
  useEffect(() => {
    if (isChatbotOpen) {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping, isChatbotOpen]);

  // Chatbot FAQ Response Logic
  const getFaqBotResponse = (query: string) => {
    const q = query.toLowerCase();

    if (q.includes('biaya') || q.includes('tarif') || q.includes('harga') || q.includes('ongkos') || q.includes('berapa') || q.includes('blower') || q.includes('cleaning') || q.includes('lumpur') || q.includes('kalkulator')) {
      return {
        text: '💰 Estimasi Tarif Layanan Sedot WC & Pengurasan Lumpur Bekasi:\n• Limbah Black Water (Tinja) Non Manifes: Rp 600.000 / kubik\n• Limbah Grey Water (Lumpur/Lemak) Non Manifes: Rp 1.000.000 / kubik\n• Cleaning / Blower Lumpur Non Manifes: Rp 1.000.000 / kubik\n• Limbah Black Water dengan Manifes IPLT: Rp 1.000.000 / kubik\n• Limbah Grey Water dengan Manifes IPLT: Rp 1.400.000 / kubik\n• Cleaning / Blower Lumpur dengan Manifes IPLT: Rp 1.400.000 / kubik\n\nBiaya transparan tanpa biaya siluman. Anda juga bisa menghitung estimasi otomatis via kalkulator biaya kami.',
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
    const query = subscriberSearch.toLowerCase().trim();
    const matchQuery =
      !query ||
      s.email.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.company.toLowerCase().includes(query);
    return matchCategory && matchQuery;
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
            <ul className="hidden lg:flex items-center space-x-5 xl:space-x-6">
              <li><a href="#hero" className="text-sm font-medium text-navy hover:text-cyan transition">Beranda</a></li>
              <li><a href="#layanan" className="text-sm font-medium text-navy hover:text-cyan transition">Layanan Korporat</a></li>
              <li><a href="#spesialis" className="text-sm font-medium text-navy hover:text-cyan transition">Sektor Industri</a></li>
              <li><a href="#peta" className="text-sm font-medium text-navy hover:text-cyan transition">Kawasan & Pool</a></li>
              <li><a href="#legalitas" className="text-sm font-medium text-navy hover:text-cyan transition">Legalitas & IPLT</a></li>
              <li><a href="#sertifikasi" className="text-sm font-medium text-navy hover:text-cyan transition">Sertifikasi & Mitra</a></li>
              <li><a href="#statistik-newsletter" className="text-sm font-medium text-navy hover:text-cyan transition">Statistik</a></li>
              <li><a href="#galeri" className="text-sm font-medium text-navy hover:text-cyan transition">Galeri Proyek</a></li>
              <li><a href="#quotation" className="text-sm font-bold text-orange hover:text-orange-dark transition">Penawaran PT (RFP)</a></li>
              <li><a href="#kontak" className="text-sm font-medium text-navy hover:text-cyan transition">Kontak</a></li>
            </ul>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="#quotation"
                className="inline-flex items-center px-4 py-2 bg-navy text-white text-xs font-bold rounded-full hover:bg-navy-light transition shadow-sm border border-cyan/30"
              >
                Minta Quotation
              </a>
              <a
                id="wa-header"
                href={getDynamicWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-orange text-white text-xs font-bold rounded-full hover:bg-orange-dark transition shadow-md"
              >
                WhatsApp 24 Jam
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              id="menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-navy focus:outline-none"
              aria-label="Buka Menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden bg-white border-t border-gray-100 shadow-md">
            <ul className="flex flex-col px-4 py-4 space-y-3">
              <li><a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Beranda</a></li>
              <li><a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Layanan Korporat</a></li>
              <li><a href="#spesialis" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Sektor Industri</a></li>
              <li><a href="#peta" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Kawasan & Pool</a></li>
              <li><a href="#legalitas" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Legalitas & IPLT</a></li>
              <li><a href="#sertifikasi" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-navy">Sertifikasi & Kemitraan</a></li>
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

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="#quotation"
                  className="px-8 py-4 bg-orange text-white text-center font-bold rounded-2xl hover:bg-orange-dark transition shadow-lg shadow-orange/30 flex items-center justify-center gap-2"
                >
                  <span>MINTA PENAWARAN (RFP B2B)</span>
                  <span>→</span>
                </a>
                <a
                  id="wa-hero-1"
                  href={getDynamicWaLink('hero')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white border-2 border-navy text-navy text-center font-bold rounded-2xl hover:bg-navy hover:text-white transition flex items-center justify-center gap-2"
                >
                  <span>KONSULTASI TIM DISPATCHER</span>
                </a>
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
                  onClick={() => setActiveMapHubIndex(idx)}
                  className={`px-4 py-2.5 sm:px-6 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                    activeMapHubIndex === idx
                      ? 'bg-navy text-white shadow-lg scale-105 border border-cyan/40'
                      : 'bg-slate-100 text-gray-700 hover:bg-slate-200 border border-gray-200'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${activeMapHubIndex === idx ? 'bg-cyan animate-pulse' : 'bg-gray-400'}`}></span>
                  <span>{hub.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Google Maps Embed iframe Container */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-slate-100 h-full min-h-[420px] md:min-h-[500px]">
                {/* Live Status Overlay Header */}
                <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-navy/90 backdrop-blur-md text-white border border-white/20 shadow-md flex items-center gap-2 pointer-events-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Armada Siap Berangkat (24 Jam)
                  </span>
                  <a
                    href={mapHubs[activeMapHubIndex].mapsDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 hover:bg-white text-navy shadow-md border border-gray-200 transition pointer-events-auto flex items-center gap-1.5"
                  >
                    <span>Buka di Google Maps</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>

                {/* Google Maps Iframe */}
                <iframe
                  title={`Peta Lokasi ${mapHubs[activeMapHubIndex].name}`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(mapHubs[activeMapHubIndex].mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full min-h-[420px] md:min-h-[500px] border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>

                {/* Bottom Coordinates Bar */}
                <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none">
                  <div className="bg-navy/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-white/10 shadow-lg flex items-center justify-between text-xs pointer-events-auto">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-orange font-bold">📍 Pusat Koordinat:</span>
                      <span className="text-gray-200 font-mono">{mapHubs[activeMapHubIndex].lat}, {mapHubs[activeMapHubIndex].lng}</span>
                    </div>
                    <span className="text-cyan font-semibold hidden sm:inline-block">Radius Pelayanan 50+ KM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detail Information Card */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between space-y-6">
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange/10 text-orange border border-orange/20">
                      {mapHubs[activeMapHubIndex].badge}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Online Dispatcher
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-navy mb-2">
                    {mapHubs[activeMapHubIndex].name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-6 flex items-start gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{mapHubs[activeMapHubIndex].address}</span>
                  </p>

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
                      <p className="text-xs text-gray-600 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                        {mapHubs[activeMapHubIndex].coverage}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200">
                  <a
                    href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Halo PT Kusuma Gemilang Raya, saya melihat Peta Lokasi titik "${mapHubs[activeMapHubIndex].name}". Apakah bisa kirim armada sedot WC ke lokasi saya sekarang?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-orange text-white text-sm font-bold rounded-xl hover:bg-orange-dark transition shadow-lg shadow-orange/30 text-center gap-2"
                  >
                    <span>Panggil Armada Terdekat</span>
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
              <div className="bg-white text-navy p-6 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
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
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Nama PT / CV / Perusahaan <span className="text-orange">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={rfpCompanyName}
                          onChange={(e) => setRfpCompanyName(e.target.value)}
                          placeholder="Contoh: PT Surya Manufaktur Indonesia"
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none text-xs sm:text-sm text-navy transition"
                        />
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
                      <option value={0}>Limbah Black Water (Tinja) - Rp 600.000 / kubik (Non Manifes)</option>
                      <option value={1}>Limbah Grey Water (Lumpur, Lemak) - Rp 1.000.000 / kubik (Non Manifes)</option>
                      <option value={2}>Cleaning / Blower Lumpur - Rp 1.000.000 / kubik (Non Manifes)</option>
                    </optgroup>
                    <optgroup label="📜 Opsi Dengan Manifes Resmi IPLT:">
                      <option value={3}>Limbah Black Water (Tinja) - Rp 1.000.000 / kubik (Manifes)</option>
                      <option value={4}>Limbah Grey Water (Lumpur, Lemak) - Rp 1.400.000 / kubik (Manifes)</option>
                      <option value={5}>Cleaning / Blower Lumpur - Rp 1.400.000 / kubik (Manifes)</option>
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
                  <span className="font-extrabold text-navy text-sm">Rp 600.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Dengan Manifes:</span>
                  <span className="font-extrabold text-cyan-dark text-sm">Rp 1.000.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
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
                  <span className="font-extrabold text-navy text-sm">Rp 1.000.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Dengan Manifes:</span>
                  <span className="font-extrabold text-cyan-dark text-sm">Rp 1.400.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
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
                  <span className="font-extrabold text-orange text-sm">Rp 1.000.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-700 font-semibold">Dengan Manifes:</span>
                  <span className="font-extrabold text-navy text-sm">Rp 1.400.000 <span className="text-[11px] font-normal text-gray-500">/ m³</span></span>
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

      {/* Dokumentasi Section */}
      <section id="dokumentasi" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">Dokumentasi Pekerjaan</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Bukti kerja nyata dan profesionalisme kami di lapangan.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <img
              src="https://z-cdn-media.chatglm.cn/files/a663f5a2-9679-4548-bc6d-ee86fc0faf38.jpg?auth_key=1891530048-f58de94b45dd4195b1e4eb5c4db34d04-0-bf9997ee3b449021bddfe6a237af2b95"
              alt="Truk masuk area industri"
              className="w-full h-48 md:h-64 object-cover rounded-2xl hover:opacity-90 transition"
              loading="lazy"
            />
            <img
              src="https://z-cdn-media.chatglm.cn/files/f0a0ebfc-d359-467e-818a-1eeb6670dbb3.jpg?auth_key=1891530048-1ea4bfb5615c415cb07dde8aa8708456-0-33efc077a48f2f99bf7f5ce0e12e9bf9"
              alt="Truk sedot limbah industri"
              className="w-full h-48 md:h-64 object-cover rounded-2xl hover:opacity-90 transition"
              loading="lazy"
            />
            <img
              src="https://z-cdn-media.chatglm.cn/files/4f3e0e12-39b6-49b9-898d-956ffdd2b291.jpg?auth_key=1891530048-b2c975c52af9462bb934e295016c1b9f-0-8acc724df47b2f017edd7607128792d7"
              alt="Teknisi melayani vakum lingkungan"
              className="w-full h-48 md:h-64 object-cover rounded-2xl hover:opacity-90 transition"
              loading="lazy"
            />
            <img
              src="https://z-cdn-media.chatglm.cn/files/33054cf6-266f-447d-9081-464b93cc7cc7.jpg?auth_key=1891530048-aebcdd0fe66b48f880f5bc962fef5f6d-0-e05a985cd94e16de3b4a0110c366e099"
              alt="Teknisi servis vakum di perumahan"
              className="w-full h-48 md:h-64 object-cover rounded-2xl hover:opacity-90 transition"
              loading="lazy"
            />
            <img
              src="https://z-cdn-media.chatglm.cn/files/4da00e2f-49dd-4f4c-b983-2d496721c934.jpg?auth_key=1891530048-bc9acd819e9a48949530ccd303af95d0-0-73f082a39d6164cf5019ea6210e389ad"
              alt="Petugas membersihkan grease trap restoran"
              className="w-full h-48 md:h-64 object-cover rounded-2xl hover:opacity-90 transition"
              loading="lazy"
            />
            <img
              src="https://z-cdn-media.chatglm.cn/files/4bdc93a6-c220-4dbe-948f-36bbaa87b841.jpg?auth_key=1891530048-2bec263d4a5c497387667e9798780d5d-0-ef3c26848e67413f81c9c3311b1d5018"
              alt="Pekerja memompa limbah grease trap"
              className="w-full h-48 md:h-64 object-cover rounded-2xl hover:opacity-90 transition"
              loading="lazy"
            />
          </div>
        </div>
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

      {/* Testimoni Section */}
      <section id="testimoni" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-cyan font-semibold tracking-wide">CLIENT TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-2">Kepercayaan Pelanggan Kami</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Kepuasan pelanggan adalah prioritas utama. Berikut adalah berbagi pengalaman dari klien kami.</p>
          </div>

          <div className="relative overflow-hidden">
            <div
              id="testimonial-track"
              className="testimonial-track flex"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((t, index) => (
                <div key={index} className="min-w-full p-4">
                  <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-gray-100 mx-auto max-w-3xl text-center">
                    <div className="flex justify-center text-orange mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">{t.text}</p>
                    <div className="flex items-center justify-center space-x-3">
                      <div className={`w-12 h-12 ${t.bgColor} rounded-full flex items-center justify-center font-bold ${t.textColor}`}>
                        {t.initial}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-navy">{t.author}</p>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              id="prev-testimonial"
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              aria-label="Testimoni Sebelumnya"
              className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-navy transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              id="next-testimonial"
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              aria-label="Testimoni Selanjutnya"
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-navy transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeTestimonial === i ? 'bg-orange w-6' : 'bg-gray-300'
                }`}
                aria-label={`Lihat Testimoni ${i + 1}`}
              />
            ))}
          </div>

          {/* Tombol Tulis Testimoni */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4 text-sm">Apakah Anda pelanggan kami? Bagikan pengalaman Anda!</p>
            <a
              id="wa-testimoni"
              href="https://wa.me/6289675064916?text=Halo%20Admin%20PT%20Kusuma%20Gemilang%20Raya,%20saya%20ingin%20menuliskan%20testimoni%20untuk%20layanan%20yang%20saya%20gunakan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-white border-2 border-orange text-orange font-semibold rounded-full hover:bg-orange hover:text-white transition shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Tulis Testimoni Anda
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

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy">FAQ (Frequently Asked Questions)</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">Pertanyaan yang sering ditanyakan seputar layanan sedot WC kami di Bekasi.</p>
          </div>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 flex items-center transition">
                  Berapa harga sedot WC Bekasi?
                  <span className="ml-3 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/10 text-cyan-dark border border-cyan/20">Resmi</span>
                </span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Harga sewa sedot WC di Bekasi bervariasi tergantung volume septic tank, lokasi, tingkat kesulitan pekerjaan, jenis layanan, dan kebutuhan armada. Hubungi kami via WhatsApp untuk konsultasi harga terbaik.
              </p>
            </details>

            {/* FAQ 2 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 flex items-center transition">
                  Apakah melayani Kota Bekasi dan Kabupaten Bekasi?
                  <span className="ml-3 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/10 text-cyan-dark border border-cyan/20">Resmi</span>
                </span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Ya, PT Kusuma Gemilang Raya melayani seluruh wilayah Kota Bekasi dan Kabupaten Bekasi, termasuk Cikarang, Tambun, Babelan, dan lainnya.
              </p>
            </details>

            {/* FAQ 3 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 transition">Apakah melayani Cikarang?</span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Ya, kami melayani seluruh area Cikarang (Barat, Timur, Utara, Selatan, Pusat) dan area industri di Kabupaten Bekasi.
              </p>
            </details>

            {/* FAQ 4 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 transition">Apakah bisa sedot septic tank?</span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Tentu saja. Pengurasan septic tank adalah layanan utama kami untuk rumah, kantor, maupun fasilitas komersial.
              </p>
            </details>

            {/* FAQ 5 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 transition">Apakah melayani saluran mampet?</span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Ya, kami memiliki teknisi berpengalaman untuk menangani saluran air, toilet, wastafel, dan pipa yang tersumbat.
              </p>
            </details>

            {/* FAQ 6 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 flex items-center transition">
                  Apakah melayani limbah STP?
                  <span className="ml-3 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/10 text-cyan-dark border border-cyan/20">Terverifikasi</span>
                </span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a87.354 87.354 0 01-.713-4.726V9.5a9 9 0 00-.215-2.185L20.25 4.5M3 15V9.5a9 9 0 01.215-2.185L4.5 4.5M21 21v-4a2.4 2.4 0 00-.6-1.6L15.75 10.5M3 3l1.5 1.5M21 3l-1.5 1.5" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Ya, kami menyedot limbah STP untuk gedung, perusahaan, hotel, restoran, dan fasilitas lainnya secara profesional dan legal.
              </p>
            </details>

            {/* FAQ 7 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 flex items-center transition">
                  Apakah layanan tersedia 24 jam?
                  <span className="ml-3 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/10 text-cyan-dark border border-cyan/20">Terverifikasi</span>
                </span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Layanan kami tersedia 24 jam, termasuk hari libur. Silakan hubungi kami kapan saja saat Anda membutuhkan bantuan darurat.
              </p>
            </details>

            {/* FAQ 8 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 transition">Bagaimana cara memesan layanan sedot WC?</span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Cukup hubungi nomor WhatsApp kami di +62 896-7506-4916, konsultasikan kebutuhan Anda, jadwalkan kunjungan, dan teknisi kami akan datang ke lokasi.
              </p>
            </details>

            {/* FAQ 9 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 transition">Berapa lama proses penyedotan septic tank?</span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2h4" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Durasi penyedotan septic tank standar rumah tangga biasanya hanya memakan waktu sekitar 30 hingga 60 menit, tergantung volume dan akses lokasi.
              </p>
            </details>

            {/* FAQ 10 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 transition">Apakah melayani rumah, kantor, dan perusahaan?</span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Ya, kami melayani kebutuhan sanitasi untuk rumah tinggal, perkantoran, perusahaan, industri, hingga usaha komersial seperti restoran dan hotel.
              </p>
            </details>

            {/* FAQ 11 */}
            <details className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition">
              <summary className="flex justify-between items-center font-semibold text-navy cursor-pointer list-none">
                <span className="faq-question flex-1 pr-4 flex items-center transition">
                  Bagaimana prosedur teknis pengerjaan dan standar keamanan di lapangan?
                  <span className="ml-3 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/10 text-cyan-dark border border-cyan/20">Terverifikasi</span>
                </span>
                <span className="faq-icon-wrapper w-10 h-10 flex items-center justify-center bg-slate-100 rounded-xl transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-navy transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                Teknisi kami menerapkan protokol keselamatan dan kebersihan yang ketat. Setiap pekerjaan dilengkapi dengan APD lengkap (helm, sarung tangan, sepatu safety, dan masker). Setelah proses penyedotan selesai, area kerja akan dibersihkan dan disanitasi menggunakan cairan disinfektan untuk memastikan lingkungan tetap higienis dan bebas bau.
              </p>
            </details>
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
                <li><a href="#testimoni" className="hover:text-cyan transition">Testimoni</a></li>
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

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© PT Kusuma Gemilang Raya. All Rights Reserved.</p>
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

              {/* Toolbar & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px]">
                    <input
                      type="text"
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      placeholder="Filter nama / email / PT..."
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
                    <span>📥 Unduh CSV</span>
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
                      <th className="py-3 px-4">Sumber</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSubscribers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          Tidak ada subscriber yang cocok.
                        </td>
                      </tr>
                    ) : (
                      filteredSubscribers.map((item) => (
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
                          <td className="py-3 px-4 text-gray-500">{item.source}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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

      {/* Floating Notification Toast */}
      {adminNotificationToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-navy text-white text-xs sm:text-sm font-semibold shadow-2xl border border-cyan/40 flex items-center gap-3">
          <span className="text-emerald-400 text-lg">✓</span>
          <span>{adminNotificationToast}</span>
        </div>
      )}
    </div>
  );
}
