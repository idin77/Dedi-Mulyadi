import React, { useState } from 'react';

export interface ComplianceMetadataItem {
  id: string;
  category: 'Izin Berusaha' | 'Perpajakan' | 'Lingkungan & K3' | 'SEO & Identitas';
  icon: string;
  name: string;
  code: string;
  value: string;
  status: string;
  statusColor: string;
  issuer: string;
  description: string;
  auditRelevance: string;
}

export interface ComplianceSeoMetadataProps {
  onDownloadPdf?: () => void;
  isDownloadingPdf?: boolean;
  onToast?: (msg: string) => void;
}

export const rawComplianceMetadata: ComplianceMetadataItem[] = [
  {
    id: 'NIB',
    category: 'Izin Berusaha',
    icon: '🏛️',
    name: 'Nomor Induk Berusaha (NIB)',
    code: 'NIB OSS-RBA',
    value: '0220108920194',
    status: 'Aktif & Terverifikasi',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    issuer: 'Kementerian Investasi / BKPM RI (Sistem OSS Berbasis Risiko)',
    description: 'Identitas legal primer tunggal kegiatan operasional seluruh armada vacuum truck, penanganan limbah domestik & industri, serta jasa sanitasi komersial.',
    auditRelevance: 'Wajib ada untuk registrasi e-procurement vendor, SAP/Ariba, dan audit kepatuhan hukum RI.',
  },
  {
    id: 'KBLI',
    category: 'Izin Berusaha',
    icon: '📑',
    name: 'Klasifikasi Baku Lapangan Usaha (KBLI)',
    code: 'KBLI 37011',
    value: '37011',
    status: 'Standar Kompetensi Sah',
    statusColor: 'bg-cyan/20 text-cyan-light border-cyan/40',
    issuer: 'Badan Pusat Statistik (BPS) & Kementerian Investasi / OSS RBA',
    description: 'Pengelolaan dan Pembuangan Air Limbah Tidak Berbahaya: jasa kuras tangki septik, pengangkutan lumpur tinja, pembersihan grease trap & pelancaran saluran air limbah industri/domestik.',
    auditRelevance: 'Memastikan legalitas jenis pengerjaan sesuai akta pendirian dan perizinan OSS RBA.',
  },
  {
    id: 'NPWP',
    category: 'Perpajakan',
    icon: '💳',
    name: 'Nomor Pokok Wajib Pajak (NPWP Badan)',
    code: 'NPWP PT KGR',
    value: '94.812.394.8-407.000',
    status: 'Wajib Pajak Badan Terdaftar',
    statusColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    issuer: 'Direktorat Jenderal Pajak (DJP) - Kementerian Keuangan RI',
    description: 'Entitas Wajib Pajak Badan Hukum resmi PT Kusuma Gemilang Raya untuk penerbitan bukti potong PPh 23, pelaporan SPT Tahunan, dan tertib administrasi fiskal.',
    auditRelevance: 'Kelengkapan bukti potong PPh 23 & verifikasi identitas NPWP Badan resmi di DJP Online.',
  },
  {
    id: 'SPPKP',
    category: 'Perpajakan',
    icon: '🧾',
    name: 'Surat Pengukuhan Pengusaha Kena Pajak (SPPKP)',
    code: 'SPPKP e-Faktur PPN',
    value: 'S-184PKP/WPJ.22/KP.0303/2021',
    status: 'PKP Aktif (e-Faktur PPN 11%)',
    statusColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    issuer: 'Kantor Pelayanan Pajak (KPP) - DJP Kemenkeu RI',
    description: 'Menerbitkan faktur pajak resmi e-Faktur PPN 11% untuk klaim pajak masukan bagi perusahaan klien manufaktur, pabrik kawasan industri, dan instansi B2B.',
    auditRelevance: 'Penerbitan e-Faktur sah untuk keperluan restitusi atau kredit pajak PPN masukan korporat.',
  },
  {
    id: 'KEMENKUMHAM',
    category: 'Izin Berusaha',
    icon: '⚖️',
    name: 'SK Pengesahan Badan Hukum Kemenkumham RI',
    code: 'SK AHU PT KGR',
    value: 'AHU-0018924.AH.01.01.TAHUN 2021',
    status: 'Perseroan Terbatas Sah',
    statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    issuer: 'Ditjen Administrasi Hukum Umum (AHU) Kemenkumham RI',
    description: 'Akta Notaris pendirian dan pengesahan badan usaha resmi berbadan hukum Perseroan Terbatas (PT) dengan domisili hukum di Bekasi.',
    auditRelevance: 'Bukti badan hukum PT sah, bukan CV fiktif ataupun perorangan tanpa pertanggungjawaban.',
  },
  {
    id: 'IPLT',
    category: 'Lingkungan & K3',
    icon: '🌱',
    name: 'Izin Pembuangan & Manifest Resmi IPLT Pemda',
    code: 'Manifest IPLT DLH',
    value: 'REG-IPLT/DLH-BKS/2026/0411',
    status: '100% Legal & Bebas AMDAL',
    statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    issuer: 'Dinas Lingkungan Hidup (DLH) Pemkab & Pemkot Bekasi',
    description: 'Jaminan seluruh muatan limbah dibuang ke Instalasi Pengolahan Lumpur Tinja (IPLT) Pemda resmi disertai dokumen Manifest & BAST bertanda tangan, bebas sanksi pembuangan liar.',
    auditRelevance: 'Kepatuhan mutlak audit ISO 14001, audit PROPER KLHK, dan jaminan bebas denda pidana lingkungan.',
  },
  {
    id: 'REK_GIRO',
    category: 'Perpajakan',
    icon: '🏦',
    name: 'Rekening Giro Perusahaan (Anti-Fraud)',
    code: 'Bank Mandiri PT',
    value: '156-00-1892401-2 (Bank Mandiri a.n PT KUSUMA GEMILANG RAYA)',
    status: 'Rekening PT Resmi',
    statusColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    issuer: 'PT Bank Mandiri (Persero) Tbk Kantor Cabang Bekasi',
    description: 'Rekening giro resmi atas nama badan usaha PT Kusuma Gemilang Raya (bukan rekening pribadi) guna menjamin integritas transaksi keuangan tim finance klien.',
    auditRelevance: 'Perlindungan tata kelola keuangan korporat & mencegah penipuan rekening rekening bayangan.',
  },
  {
    id: 'SCHEMA_ORG',
    category: 'SEO & Identitas',
    icon: '🌐',
    name: 'Structured Data Schema.org (Google SEO Trust)',
    code: 'Schema LocalBusiness',
    value: 'https://jasasedotwcbekasi.web.id/#localbusiness',
    status: 'Google Schema Valid',
    statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    issuer: 'Schema.org & Google Search Console Structured Data Engine',
    description: 'Entitas terverifikasi web crawler: @type: LocalBusiness, koordinat GPS -6.2349, 106.9966, jam kerja 24 Jam, telp +6289675064916, dan sameAs media sosial resmi.',
    auditRelevance: 'Transparansi digital, validasi knowledge graph pencarian Google, dan konsistensi data NAP (Name, Address, Phone).',
  },
];

export function ComplianceSeoMetadata({
  onDownloadPdf,
  isDownloadingPdf = false,
  onToast,
}: ComplianceSeoMetadataProps) {
  const [filterCategory, setFilterCategory] = useState<
    'Semua' | 'Izin Berusaha' | 'Perpajakan' | 'Lingkungan & K3' | 'SEO & Identitas'
  >('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (id: string, label: string, value: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(value).then(() => {
        setCopiedField(id);
        if (onToast) {
          onToast(`📋 ${label} (${value}) berhasil disalin ke clipboard!`);
        }
        setTimeout(() => setCopiedField(null), 2500);
      });
    } else {
      if (onToast) onToast(`📋 ${label}: ${value}`);
    }
  };

  const handleCopyAll = () => {
    const dossierText = `BERKAS LEGALITAS RESMI & SEO METADATA PT KUSUMA GEMILANG RAYA:
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
      navigator.clipboard.writeText(dossierText).then(() => {
        setCopiedField('ALL_DOSSIER');
        if (onToast) {
          onToast('📋 Seluruh ringkasan legalitas NIB, NPWP & KBLI berhasil disalin ke clipboard!');
        }
        setTimeout(() => setCopiedField(null), 3000);
      });
    }
  };

  const filteredData = rawComplianceMetadata.filter((item) => {
    const matchesCategory = filterCategory === 'Semua' || item.category === filterCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.value.toLowerCase().includes(query) ||
      item.code.toLowerCase().includes(query) ||
      item.issuer.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.auditRelevance.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* 4 Primary Key Indicators (NIB, KBLI, NPWP, IPLT) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* NIB Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-emerald-500/30 shadow-lg relative overflow-hidden group hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-base">
              🏛️
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              OSS-RBA Aktif
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Nomor Induk Berusaha
          </span>
          <p className="font-mono font-black text-lg sm:text-xl text-white mt-0.5 tracking-wider">
            0220108920194
          </p>
          <p className="text-[11px] text-gray-300 mt-1 line-clamp-1">
            Kementerian Investasi / BKPM RI
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span>✓</span> Berbasis Risiko
            </span>
            <button
              type="button"
              onClick={() => handleCopy('NIB', 'Nomor Induk Berusaha (NIB)', '0220108920194')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                copiedField === 'NIB'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
              aria-label="Salin Nomor Induk Berusaha NIB"
            >
              {copiedField === 'NIB' ? '✓ Tersalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* KBLI 37011 Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-cyan/30 shadow-lg relative overflow-hidden group hover:border-cyan transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-cyan/20 text-cyan-light flex items-center justify-center text-base">
              📑
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan/20 text-cyan-light border border-cyan/40 uppercase">
              Standar Usaha
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Klasifikasi KBLI
          </span>
          <p className="font-mono font-black text-lg sm:text-xl text-cyan-300 mt-0.5 tracking-wider">
            37011
          </p>
          <p className="text-[11px] text-gray-300 mt-1 line-clamp-1">
            Air Limbah Tidak Berbahaya
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
              <span>✓</span> BPS & OSS Terdaftar
            </span>
            <button
              type="button"
              onClick={() => handleCopy('KBLI', 'Klasifikasi KBLI 37011', '37011')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                copiedField === 'KBLI'
                  ? 'bg-cyan text-navy'
                  : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
              aria-label="Salin Kode KBLI 37011"
            >
              {copiedField === 'KBLI' ? '✓ Tersalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* NPWP Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-blue-500/30 shadow-lg relative overflow-hidden group hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-base">
              💳
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase">
              SPPKP e-Faktur
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            NPWP Badan Usaha
          </span>
          <p className="font-mono font-black text-sm sm:text-base text-white mt-1 tracking-wider truncate">
            94.812.394.8-407.000
          </p>
          <p className="text-[11px] text-gray-300 mt-1 line-clamp-1">
            Ditjen Pajak Kemenkeu RI
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-[10px] text-blue-300 font-semibold flex items-center gap-1">
              <span>✓</span> PPh 23 & PPN 11%
            </span>
            <button
              type="button"
              onClick={() => handleCopy('NPWP', 'NPWP Badan Usaha', '94.812.394.8-407.000')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                copiedField === 'NPWP'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
              aria-label="Salin NPWP Badan Usaha"
            >
              {copiedField === 'NPWP' ? '✓ Tersalin' : 'Salin'}
            </button>
          </div>
        </div>

        {/* IPLT Manifest Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/90 border border-amber-500/30 shadow-lg relative overflow-hidden group hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-base">
              🌱
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
              Manifest Sah
            </span>
          </div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Destinasi Pembuangan
          </span>
          <p className="font-bold text-base sm:text-lg text-amber-300 mt-0.5 tracking-tight">
            IPLT Pemda Bekasi
          </p>
          <p className="text-[11px] text-gray-300 mt-1 line-clamp-1">
            Sumur Batu & Babelan DLH
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/80 flex items-center justify-between">
            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
              <span>✓</span> Bebas Pidana AMDAL
            </span>
            <button
              type="button"
              onClick={() => handleCopy('IPLT', 'Nomor Registrasi Manifest IPLT', 'REG-IPLT/DLH-BKS/2026/0411')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                copiedField === 'IPLT'
                  ? 'bg-amber-500 text-navy'
                  : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
              aria-label="Salin Registrasi Manifest IPLT"
            >
              {copiedField === 'IPLT' ? '✓ Tersalin' : 'Salin'}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Category Toolbar & Search Bar */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-gray-400 mr-1 hidden sm:inline">Kategori:</span>
          {[
            { key: 'Semua', label: 'Semua Parameter (8)' },
            { key: 'Izin Berusaha', label: 'Izin Berusaha & NIB' },
            { key: 'Perpajakan', label: 'Perpajakan & SPPKP' },
            { key: 'Lingkungan & K3', label: 'Lingkungan & IPLT' },
            { key: 'SEO & Identitas', label: 'SEO & Schema.org' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterCategory(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterCategory === tab.key
                  ? 'bg-cyan text-navy shadow-sm shadow-cyan/20'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Layout Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari NIB, NPWP, 37011, Kemenkumham..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'table' ? 'bg-cyan text-navy' : 'text-gray-400 hover:text-white'
              }`}
              title="Tampilan Data Grid Tabel"
            >
              <span>▦</span>
              <span>Tabel</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-cyan text-navy' : 'text-gray-400 hover:text-white'
              }`}
              title="Tampilan Data Grid Kartu"
            >
              <span>🗂️</span>
              <span>Grid Kartu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Grid (Clean & Readable for B2B Auditors) */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-gray-300 border-b border-slate-700 text-[11px] sm:text-xs uppercase tracking-wider font-bold">
                  <th scope="col" className="py-4 px-4 sm:px-6">Dokumen & Parameter</th>
                  <th scope="col" className="py-4 px-4 sm:px-6">Nomor / Nilai Registrasi</th>
                  <th scope="col" className="py-4 px-4 sm:px-6 hidden md:table-cell">Otoritas Penerbit & Sistem</th>
                  <th scope="col" className="py-4 px-4 sm:px-6 hidden lg:table-cell">Ruang Lingkup & Kepatuhan Audit</th>
                  <th scope="col" className="py-4 px-4 sm:px-6 text-center">Salin ke Clipboard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {filteredData.length > 0 ? (
                  filteredData.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-700/40 transition-colors group"
                    >
                      {/* Parameter Name */}
                      <td className="py-4 px-4 sm:px-6 align-top">
                        <div className="flex items-start gap-3">
                          <span className="text-xl shrink-0 mt-0.5">{record.icon}</span>
                          <div>
                            <div className="font-bold text-white text-xs sm:text-sm group-hover:text-cyan transition-colors">
                              {record.name}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-gray-300">
                                {record.code}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${record.statusColor}`}>
                                {record.status}
                              </span>
                            </div>
                            <div className="mt-2 text-[11px] text-gray-400 md:hidden">
                              <span className="font-semibold text-gray-300">Otoritas:</span> {record.issuer}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Value / Registration Number */}
                      <td className="py-4 px-4 sm:px-6 align-top font-mono">
                        <div className="inline-block bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-xl font-bold text-cyan-light text-xs sm:text-sm tracking-wider select-all">
                          {record.value}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 sm:hidden">
                          {record.auditRelevance}
                        </div>
                      </td>

                      {/* Issuer */}
                      <td className="py-4 px-4 sm:px-6 align-top hidden md:table-cell">
                        <span className="font-semibold text-gray-200 block text-xs">
                          {record.issuer}
                        </span>
                        <span className="text-[11px] text-emerald-400 mt-0.5 block">
                          ✓ Basis Data Terverifikasi
                        </span>
                      </td>

                      {/* Description & Scope */}
                      <td className="py-4 px-4 sm:px-6 align-top hidden lg:table-cell text-xs text-gray-300 leading-relaxed">
                        <p>{record.description}</p>
                        <span className="inline-block mt-1 text-[11px] text-amber-300/90 font-medium">
                          📌 {record.auditRelevance}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-4 sm:px-6 align-top text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleCopy(record.id, record.name, record.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs ${
                            copiedField === record.id
                              ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-300'
                              : 'bg-white/10 hover:bg-cyan hover:text-navy text-gray-200 border border-white/10 hover:border-transparent'
                          }`}
                          title={`Salin ${record.name} (${record.value})`}
                          aria-label={`Salin ${record.name}`}
                        >
                          {copiedField === record.id ? (
                            <>
                              <span className="text-white">✓</span>
                              <span>Disalin!</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                      Tidak ada parameter legalitas yang sesuai dengan pencarian "{searchQuery}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View Mode */
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredData.map((record) => (
              <div
                key={record.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-700 hover:border-cyan/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{record.icon}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">{record.name}</h4>
                        <span className="text-[10px] text-gray-400 uppercase font-semibold">{record.code}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${record.statusColor}`}>
                      {record.status}
                    </span>
                  </div>

                  <div className="my-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
                    <span className="font-mono text-cyan-light font-bold text-xs sm:text-sm tracking-wide select-all break-all">
                      {record.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(record.id, record.name, record.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                        copiedField === record.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200'
                      }`}
                    >
                      {copiedField === record.id ? '✓ Disalin' : 'Salin'}
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-300">
                    <p><strong className="text-gray-400">Otoritas:</strong> {record.issuer}</p>
                    <p className="text-gray-400 leading-relaxed">{record.description}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-amber-300/90">
                  📌 {record.auditRelevance}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auditor Transparency & Compliance Action Banner */}
      <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-slate-850 border border-slate-700/80 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan/20 text-cyan-light flex items-center justify-center text-2xl shrink-0 border border-cyan/30">
              🛡️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Komitmen Kepatuhan Regulasi Lingkungan & Transparansi Audit
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  LEGAL & ANTI-MALADMINISTRASI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
                Sesuai Undang-Undang No. 32 Tahun 2009 tentang Perlindungan dan Pengelolaan Lingkungan Hidup,
                pembuangan air limbah tanpa manifes resmi dapat menimbulkan sanksi pidana dan denda bagi penghasil limbah.
                PT Kusuma Gemilang Raya menjamin 100% pembuangan limbah disalurkan ke IPLT resmi Pemkab/Pemkot Bekasi dengan dokumen BAST sah, Faktur Pajak PPN 11%, dan rekening bank berbadan hukum PT.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              type="button"
              onClick={handleCopyAll}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition cursor-pointer flex items-center gap-2"
            >
              <span>📋</span>
              <span>{copiedField === 'ALL_DOSSIER' ? 'Tersalin!' : 'Salin Semua Dokumen'}</span>
            </button>
            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                disabled={isDownloadingPdf}
                className="px-4 py-2.5 rounded-xl bg-cyan hover:bg-cyan-light text-navy font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <span>📄</span>
                <span>{isDownloadingPdf ? 'Mengunduh...' : 'Unduh Berkas Legalitas'}</span>
              </button>
            )}
            <a
              href={`https://wa.me/6289675064916?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, mohon bantuan untuk mengirimkan salinan berkas legalitas NIB KBLI 37011, NPWP, dan rekening giro perusahaan untuk keperluan verifikasi vendor rekanan.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-dark text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
            >
              <span>💬</span>
              <span>Kirim Berkas Vendor via WA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ComplianceSeoMetadata;
