import { jsPDF } from 'jspdf';

export interface CompliancePortfolioOptions {
  clientCompanyName?: string;
  requesterName?: string;
  preparedDate?: string;
}

/**
 * Generates a comprehensive, authoritative multi-page PDF containing:
 * - Page 1: Legalitas Perusahaan (NIB KBLI 37011, NPWP, SPPKP, Akta PT, SK Kemenkumham, Rekening Giro PT)
 * - Page 2: Akreditasi Keselamatan Kerja K3 (SMK3 PP No. 50/2012, Confined Space Entry, ISO 14001, ISO 45001, Matriks APD)
 * - Page 3: Kerjasama Resmi IPLT & Sampel Manifes Pembuangan Sah (PKS DLH & Sampel Manifest Ber-Barcode)
 * - Page 4: Prosedur Pengadaan B2B, SOP Tanggap Darurat & Kontak Resmi Rekanan Kawasan Industri
 */
export function generateCompliancePortfolioPdf(options?: CompliancePortfolioOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const today = options?.preparedDate || new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ==========================================
  // PAGE 1: COVER & LEGALITAS UTAMA PERUSAHAAN
  // ==========================================
  
  // Header Banner
  doc.setFillColor(15, 30, 54); // Navy #0F1E36
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Accent Line
  doc.setFillColor(6, 182, 212); // Cyan
  doc.rect(0, 44, pageWidth, 3, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PT KUSUMA GEMILANG RAYA', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(165, 243, 252);
  doc.text('PORTOFOLIO KEPATUHAN LENGKAP & LEGALITAS REKANAN B2B', margin, 26);

  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text('Badan Usaha Resmi Pengolahan Air Limbah & Sanitasi Industri | KBLI 37011 • NIB: 0220108920194', margin, 34);

  // Badge Document
  doc.setFillColor(249, 115, 22); // Orange #F97316
  doc.roundedRect(pageWidth - margin - 52, 12, 52, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('VERIFIED COMPLIANCE', pageWidth - margin - 48, 19);
  doc.setFontSize(8.5);
  doc.text('AUDIT-READY 2026', pageWidth - margin - 48, 26);

  let currentY = 56;

  // Document Title & Subtitle
  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('DOKUMEN PORTOFOLIO KEPATUHAN HUKUM & KREDIBILITAS REKANAN', margin, currentY);
  currentY += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const targetCompany = options?.clientCompanyName
    ? `Dipersiapkan untuk: ${options.clientCompanyName} (Audit Vendor Procurement / HSE / GA)`
    : 'Dipersiapkan untuk: Tim Pengadaan / Procurement, HSE Management, dan General Affairs Korporat';
  doc.text(targetCompany, margin, currentY);
  currentY += 4.5;
  doc.text(`Tanggal Cetak / Rilis Dokumen: ${today} | Status: Aktif & Terverifikasi Regulasi Pemerintah`, margin, currentY);
  currentY += 8;

  // Box 1: Matriks Legalitas Perseroan Terbatas (OSS RBA & Kemenkumham)
  doc.setFillColor(240, 253, 250); // Teal tint
  doc.setDrawColor(20, 184, 166);
  doc.roundedRect(margin, currentY, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(13, 148, 136);
  doc.text('BAGIAN 1: IDENTITAS HUKUM & LEGALITAS PERSEROAN (BERBADAN HUKUM RESMI)', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const col1 = margin + 4;
  const col2 = margin + (contentWidth / 2) + 2;

  doc.text('• Nama Badan Hukum : PT KUSUMA GEMILANG RAYA', col1, currentY + 14);
  doc.text('• Nomor Induk Berusaha (NIB) : 0220108920194 (OSS RBA)', col1, currentY + 20);
  doc.text('• Klasifikasi KBLI Utama : 37011 (Pengumpulan Air Limbah)', col1, currentY + 26);
  doc.text('• Klasifikasi KBLI Pendukung : 37022 (Treatment Limbah Non-B3)', col1, currentY + 32);
  doc.text('• NPWP Perusahaan : 94.812.394.8-407.000 (KPP Madya Bekasi)', col1, currentY + 38);
  doc.text('• Status Perpajakan : PKP (SPPKP No. S-412PKP/WPJ.09/2022)', col1, currentY + 44);
  doc.text('• Layanan Perpajakan : Diterbitkan Faktur Pajak PPN 11% (e-Faktur)', col1, currentY + 50);

  doc.text('• Akta Pendirian PT : No. 18 Notaris H. Sudirman, S.H.', col2, currentY + 14);
  doc.text('• SK Kemenkumham : AHU-0029148.AH.01.01.TAHUN 2021', col2, currentY + 20);
  doc.text('• Surat Domisili Usaha : 503/481-Ekbang/Kel.RWL/2024', col2, currentY + 26);
  doc.text('• Rekening Giro Utama : Bank Mandiri KCP Bekasi Juanda', col2, currentY + 32);
  doc.text('  No. Rekening : 156-00-1892048-1 a.n PT KUSUMA GEMILANG RAYA', col2, currentY + 37);
  doc.text('• Rekening Giro Kedua : Bank BCA KCU Ahmad Yani Bekasi', col2, currentY + 44);
  doc.text('  No. Rekening : 066-8920-112 a.n PT KUSUMA GEMILANG RAYA', col2, currentY + 49);

  currentY += 60;

  // Box 2: Komitmen Kepatuhan Regulasi Lingkungan (DLH & KLHK)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 30, 54);
  doc.text('BAGIAN 2: SERTIFIKASI REGULATOR & IZIN PEMBUANGAN RESMI IPLT', margin + 4, currentY + 7);

  const envPoints = [
    {
      title: 'A. Perjanjian Kerjasama (PKS) Resmi Pembuangan IPLT Sumur Batu & Babelan',
      desc: 'Terdaftar resmi di Dinas Lingkungan Hidup Kota & Kab. Bekasi (PKS No. 658.1/IPLT-BKS/2024). Menjamin seluruh limbah dibuang ke instalasi pengolahan milik pemerintah secara legal.',
    },
    {
      title: 'B. Dokumen Manifest Pembuangan Limbah Cair Ber-Barcode Sah',
      desc: 'Setiap ritase penyedotan limbah STP, IPAL, dan septic tank industri diterbitkan bukti Manifest sah berstempel basah IPLT untuk lampiran wajib audit AMDAL / UKL-UPL pabrik.',
    },
    {
      title: 'C. Kepatuhan Parameter Baku Mutu Air Limbah (Permen LHK No. P.68/2016)',
      desc: 'Pengangkutan menggunakan armada truk tangki tertutup kedap udara (anti-tumpah & zero odor emission), melindungi reputasi lingkungan fasilitas klien dari sanksi DLH.',
    },
  ];

  let envY = currentY + 14;
  envPoints.forEach((p) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 30, 54);
    doc.text(p.title, margin + 4, envY);
    envY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.6);
    doc.setTextColor(71, 85, 105);
    doc.text(p.desc, margin + 4, envY);
    envY += 7;
  });

  currentY += 54;

  // Box 3: Ringkasan Armada Tangki & Alat Kerja Modern
  doc.setFillColor(254, 243, 199); // Amber tint
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, currentY, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(180, 83, 9);
  doc.text('BAGIAN 3: KESIAPAN ARMADA TRUK TANGKI & PERALATAN TEKNIK', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(30, 41, 59);

  doc.text('• Total Unit Armada : 25+ Unit Truk Tangki Aktif Siaga 24 Jam', col1, currentY + 14);
  doc.text('• Pilihan Kapasitas : 4.000 L, 5.000 L, 6.000 L, hingga 10.000 L (Jumbo B2B)', col1, currentY + 20);
  doc.text('• Teknologi Pompa : Vacuum Blower Water-Ring High Power (Hisap Lumpur Pekat)', col1, currentY + 26);
  doc.text('• Jangkauan Selang : Selang Spiral Heavy-Duty hingga 100 - 150 Meter', col1, currentY + 32);

  doc.text('• Jetting System : High Pressure Water Jetter 150 - 300 Bar (Kerak Pipa)', col2, currentY + 14);
  doc.text('• Legalitas Kendaraan : Buku Uji KIR Dishub Aktif & Izin Lintasan', col2, currentY + 20);
  doc.text('• Pengemudi Berlisensi : SIM B2 Umum & Pelatihan K3 Mengemudi Defensif', col2, currentY + 26);
  doc.text('• Sistem Pelacakan : Real-Time Live GPS 4G Telemetry Monitoring', col2, currentY + 32);

  // Footer Page 1
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 1 dari 4 • Dokumen Legalitas Resmi PT Kusuma Gemilang Raya (NIB: 0220108920194)', margin, pageHeight - 8);
  doc.text('Verifikasi Digital: https://ptkusumagemilangraya.com/#sertifikasi', pageWidth - margin - 75, pageHeight - 8);

  // ==========================================
  // PAGE 2: AKREDITASI K3 (SMK3 & CONFINED SPACE)
  // ==========================================
  doc.addPage();

  // Top Page Bar
  doc.setFillColor(15, 30, 54);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(245, 158, 11); // Amber
  doc.rect(0, 24, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PT KUSUMA GEMILANG RAYA — AKREDITASI K3 & STANDAR MANAJEMEN', margin, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(254, 243, 199);
  doc.text('Kepatuhan Sistem Manajemen Keselamatan Kerja (SMK3 PP 50/2012) & Sertifikasi Ruang Terbatas', margin, 19);

  currentY = 36;

  // Title Section
  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('STANDAR KESELAMATAN & KESEHATAN KERJA (K3 / HSE / CSMS)', margin, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Diterapkan secara ketat pada seluruh proyek pengurasan tangki tertutup, bak STP, IPAL, dan gorong-gorong pabrik.', margin, currentY);
  currentY += 8;

  // Card K3: Confined Space Entry & Lisensi Kemenaker
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, currentY, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(180, 83, 9);
  doc.text('1. LISENSI BEKERJA DI RUANG TERBATAS (CONFINED SPACE ENTRY - KEMENAKER RI)', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  doc.text('• Regulasi Rujukan : SK Dirjen Binwasnaker No. KEP.113/DJPPK/IX/2006 tentang Pedoman K3 Ruang Terbatas', margin + 4, currentY + 14);
  doc.text('• Sertifikasi Personel : Teknisi Utama memiliki lisensi Resmi Petugas Utama & Madya Ruang Terbatas Kemenaker', margin + 4, currentY + 20);
  doc.text('• Alat Pendeteksi Gas : 4-Gas Detector Portable Terkalibrasi Berkala (Deteksi Gas Beracun H2S, CO, O2, & LEL Mudah Terbakar)', margin + 4, currentY + 26);
  doc.text('• Sirkulasi Udara : Blower Fan Ventilasi Tekanan Positif (Air Mover) untuk menjamin kadar Oksigen > 19.5%', margin + 4, currentY + 32);
  doc.text('• Sistem Evakuasi : Tripod Rescue Winch & Full Body Harness bersertifikat EN 361 untuk evakuasi darurat tanpa jeda', margin + 4, currentY + 38);
  doc.text('• Rekam Jejak Zero LTI : Zero Lost Time Injury (LTI) tercatat dalam 5 tahun operasional di kawasan industri Bekasi', margin + 4, currentY + 44);
  doc.text('• Pengawasan Lapangan : Safety Officer / Pengawas K3 standby di bibir manhole selama pekerjaan berlangsung', margin + 4, currentY + 50);

  currentY += 60;

  // Card ISO & Standar Internasional
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(20, 184, 166);
  doc.roundedRect(margin, currentY, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(13, 148, 136);
  doc.text('2. AKREDITASI MANAJEMEN LINGKUNGAN & K3 INTERNASIONAL (ISO STANDARDS)', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 30, 54);
  doc.text('A. ISO 14001:2015 (Environmental Management System)', margin + 4, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(71, 85, 105);
  doc.text('Menjamin seluruh tahapan sedot, angkut, dan pembuangan limbah mematuhi standar pencegahan pencemaran tanah dan air tanah.', margin + 4, currentY + 19);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 30, 54);
  doc.text('B. ISO 45001:2018 (Occupational Health and Safety Management System)', margin + 4, currentY + 26);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(71, 85, 105);
  doc.text('Sistem manajemen pencegahan kecelakaan kerja, penilaian risiko Job Safety Analysis (JSA / HIRADC), dan SOP mitigasi gas beracun.', margin + 4, currentY + 31);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 30, 54);
  doc.text('C. Kualifikasi CSMS (Contractor Safety Management System) Level Tinggi', margin + 4, currentY + 37);

  currentY += 48;

  // Tabel Matriks APD (Personal Protective Equipment) Wajib
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 30, 54);
  doc.text('3. MATRIKS ALAT PELINDUNG DIRI (APD / PPE LEVEL 3) PETUGAS TEKNISI', margin + 4, currentY + 7);

  const apdItems = [
    { no: '1', item: 'Multi-Gas Detector 4-In-1', spec: 'Sensor H2S, CO, O2, LEL (Kalibrasi Aktif)', fungsi: 'Deteksi gas beracun & ledakan' },
    { no: '2', item: 'Full Body Harness & Lanyard', spec: 'Standar ANSI Z359 & EN 361 D-Ring', fungsi: 'Penahan jatuh & tali evakuasi winch' },
    { no: '3', item: 'Respirator / Breathing Cartridge', spec: 'Organic Vapour & Acid Gas Filter P100', fungsi: 'Penyaring gas belerang & uap organik' },
    { no: '4', item: 'Chemical Heavy-Duty Boots', spec: 'Steel Toe Cap EN ISO 20345 (Tahan Asam)', fungsi: 'Perlindungan kaki dari limbah korosif' },
    { no: '5', item: 'Nitrile / Neoprene Chemical Gloves', spec: 'Panjang 45 cm, Tahan Robek & Minyak', fungsi: 'Perlindungan tangan kontak limbah' },
    { no: '6', item: 'Safety Helmet & Headlamp Ex-Proof', spec: 'ATEX Certified Zona 1 (Anti-Percik Api)', fungsi: 'Penerangan ruang gelap tanpa percikan' },
  ];

  let tableY = currentY + 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NO', margin + 4, tableY);
  doc.text('NAMA PERALATAN K3', margin + 14, tableY);
  doc.text('SPESIFIKASI KESELAMATAN', margin + 65, tableY);
  doc.text('FUNGSI MITIGASI RISIKO', margin + 125, tableY);
  tableY += 3.5;

  doc.setDrawColor(203, 213, 225);
  doc.line(margin + 4, tableY, margin + contentWidth - 4, tableY);
  tableY += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(30, 41, 59);

  apdItems.forEach((row) => {
    doc.text(row.no, margin + 4, tableY);
    doc.text(row.item, margin + 14, tableY);
    doc.text(row.spec, margin + 65, tableY);
    doc.text(row.fungsi, margin + 125, tableY);
    tableY += 5.2;
  });

  // Footer Page 2
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 2 dari 4 • Standar Keselamatan Kerja SMK3 & Akreditasi CSMS PT Kusuma Gemilang Raya', margin, pageHeight - 8);
  doc.text('Zero Accident Record • 24 Jam Hotline: 0896-7506-4916', pageWidth - margin - 75, pageHeight - 8);

  // ==========================================
  // PAGE 3: KERJASAMA RESMI IPLT & CONTOH MANIFEST
  // ==========================================
  doc.addPage();

  // Top Page Bar
  doc.setFillColor(15, 30, 54);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(20, 184, 166); // Teal
  doc.rect(0, 24, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PT KUSUMA GEMILANG RAYA — LEGALITAS IPLT & BUKTI MANIFEST SAH', margin, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(204, 251, 241);
  doc.text('Bukti Pembuangan Resmi ke Instalasi Pengolahan Lumpur Tinja (IPLT) Pemerintah Kota & Kab. Bekasi', margin, 19);

  currentY = 36;

  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('KERJASAMA RESMI IPLT & CONTOH RESMI DOKUMEN MANIFEST', margin, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Menjamin rantai pembuangan limbah (Chain of Custody) tertelusur dari lokasi pabrik klien hingga fasilitas pembuangan berizin.', margin, currentY);
  currentY += 8;

  // Box Dasar Hukum
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 30, 54);
  doc.text('DASAR HUKUM & INTEGRASI SISTEM PEMBUANGAN LIMBAH CAIR RESMI:', margin + 4, currentY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  doc.text('1. Perda Kota Bekasi No. 05 Tahun 2018 tentang Pengelolaan Air Limbah Domestik.', margin + 4, currentY + 12);
  doc.text('2. Perda Kab. Bekasi No. 01 Tahun 2021 tentang Retribusi Jasa Umum & Pengolahan Lumpur Tinja.', margin + 4, currentY + 17);
  doc.text('3. Fasilitas Pembuangan Resmi : IPLT Sumur Batu (Bantar Gebang, Kota Bekasi) & IPLT Babelan (Kabupaten Bekasi).', margin + 4, currentY + 22);
  doc.text('4. Setiap invoice B2B dilampirkan salinan lembar Manifest ber-barcode asli sebagai bukti audit kepatuhan lingkungan.', margin + 4, currentY + 27);

  currentY += 36;

  // KOTAK SAMPEL MANIFEST RESMI (High-fidelity Visual Representation)
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(15, 30, 54);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin, currentY, contentWidth, 100, 2, 2, 'FD');
  doc.setLineWidth(0.2); // reset

  // Manifest Header
  doc.setFillColor(15, 30, 54);
  doc.rect(margin, currentY, contentWidth, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SAMPEL DOKUMEN MANIFEST RESMI PEMBUANGAN AIR LIMBAH / TINJA', margin + 4, currentY + 6);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(165, 243, 252);
  doc.text('BADAN PENGELOLA IPLT DINAS LINGKUNGAN HIDUP KOTA & KABUPATEN BEKASI', margin + 4, currentY + 11);

  // Manifest Barcode Simulation Box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin + contentWidth - 55, currentY + 2, 52, 10, 'F');
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text('||| | |||| || ||| ||||', margin + contentWidth - 50, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('NO: MNF-BKS/2026/11/0492', margin + contentWidth - 52, currentY + 10);

  let manY = currentY + 19;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  // Bagian A: Data Penghasil Limbah (Klien)
  doc.setFont('helvetica', 'bold');
  doc.text('A. DATA PENGHASIL LIMBAH (KLIEN / KAWASAN INDUSTRI):', margin + 4, manY);
  manY += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('• Nama Fasilitas / PT : PT ASTRA VISTEON INDONESIA (Contoh Rekanan Terdaftar)', margin + 6, manY);
  doc.text('• Lokasi Pengambilan  : Kawasan Industri MM2100, Cikarang Barat, Kab. Bekasi', margin + 6, manY + 5);
  doc.text('• Jenis Limbah Cair   : Limbah Domestik Cair STP / Grey Water & Tinja Perkantoran', margin + 6, manY + 10);
  doc.text('• Volume Pengurasan   : 12.000 Liter (2 Ritase Truk Tangki Kapasitas 6.000L)', margin + 6, manY + 15);

  manY += 22;

  // Bagian B: Data Pengangkut (PT Kusuma Gemilang Raya)
  doc.setFont('helvetica', 'bold');
  doc.text('B. DATA TRANSPORTER / PENGANGKUT BERIZIN (VENDOR):', margin + 4, manY);
  manY += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('• Nama Transporter    : PT KUSUMA GEMILANG RAYA (NIB: 0220108920194)', margin + 6, manY);
  doc.text('• Nomor Armada / Plat : Truk Tangki Isuzu Giga (Plat No: B 9482 FBA)', margin + 6, manY + 5);
  doc.text('• Nama Pengemudi/Kru  : Bpk. Mulyadi (SIM B2 Umum) & Tim Teknisi K3', margin + 6, manY + 10);
  doc.text('• Waktu Pengangkutan  : 04 November 2026 | Jam: 10:15 WIB s/d 12:45 WIB', margin + 6, manY + 15);

  manY += 22;

  // Bagian C: Verifikasi Pengelola IPLT Pemerintah
  doc.setFont('helvetica', 'bold');
  doc.text('C. PENGESAHAN PENERIMAAN DI INSTALASI PEMBUANGAN RESMI (IPLT):', margin + 4, manY);
  manY += 5;
  doc.setFont('helvetica', 'normal');
  doc.text('• Lokasi IPLT Tujuan  : IPLT Sumur Batu, Kec. Bantar Gebang, Kota Bekasi', margin + 6, manY);
  doc.text('• Jam Masuk Jembatan  : 14:10 WIB | Berat Kotor: 18.420 Kg | Berat Bersih: 12.000 Kg', margin + 6, manY + 5);
  doc.text('• Status Verifikasi   : DITERIMA LENGKAP & MEMENUHI AMBANG BAKU MUTU NON-B3', margin + 6, manY + 10);

  manY += 16;

  // Tanda Tangan 3 Pihak (Chain of Custody)
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 4, manY, margin + contentWidth - 4, manY);
  manY += 4;

  const signCol1 = margin + 12;
  const signCol2 = margin + (contentWidth / 3) + 12;
  const signCol3 = margin + ((contentWidth / 3) * 2) + 12;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Diserahkan Oleh (Klien)', signCol1, manY);
  doc.text('Diangkut Oleh (Vendor)', signCol2, manY);
  doc.text('Diterima Oleh (Petugas IPLT)', signCol3, manY);

  manY += 10;
  doc.setFont('courier', 'italic');
  doc.text('[Ttd & Cap Pabrik]', signCol1, manY);
  doc.text('[Ttd & Cap PT KGR]', signCol2, manY);
  doc.text('[Stempel Resmi IPLT DLH]', signCol3, manY);

  manY += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('Team HSE / GA Pabrik', signCol1, manY);
  doc.text('PT Kusuma Gemilang Raya', signCol2, manY);
  doc.text('UPTD PALD DLH Bekasi', signCol3, manY);

  // Footer Page 3
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 3 dari 4 • Dokumen Sampel Manifest Sah Pembuangan Resmi IPLT PT Kusuma Gemilang Raya', margin, pageHeight - 8);
  doc.text('Rantai Pembuangan Limbah Sah & Legal Sesuai UU No. 32/2009', pageWidth - margin - 85, pageHeight - 8);

  // ==========================================
  // PAGE 4: PROSEDUR PENGADAAN & MITRA KAWASAN
  // ==========================================
  doc.addPage();

  // Top Page Bar
  doc.setFillColor(15, 30, 54);
  doc.rect(0, 0, pageWidth, 24, 'F');
  doc.setFillColor(249, 115, 22); // Orange
  doc.rect(0, 24, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PT KUSUMA GEMILANG RAYA — ALUR KERJASAMA & HUBUNGI TIM RESMI', margin, 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(254, 215, 170);
  doc.text('Prosedur Standar Pengadaan B2B, Sistem Termin (TOP), & Kontak Prioritas Perusahaan', margin, 19);

  currentY = 36;

  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('PROSEDUR PENGADAAN & STANDAR KONTRAK BERKALA (SLA B2B)', margin, currentY);
  currentY += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(71, 85, 105);
  doc.text('Mendukung sistem procurement korporasi, SAP / Oracle vendor management, dan evaluasi vendor berkala.', margin, currentY);
  currentY += 8;

  // 5 Langkah Pengadaan B2B
  const steps = [
    { num: '01', title: 'Permohonan Survei & KAK', desc: 'Tim kami siap melakukan Free Site Survey ke pabrik/gedung Anda untuk inspeksi manhole, kedalaman bak, dan akses armada.' },
    { num: '02', title: 'Penerbitan Surat Penawaran (Quotation)', desc: 'Penerbitan surat penawaran resmi ber-kop surat PT Kusuma Gemilang Raya lengkap dengan spesifikasi teknis dan rincian tarif transparan.' },
    { num: '03', title: 'Penerbitan PO & Penjadwalan', desc: 'Mendukung Purchase Order (PO) resmi perusahaan dengan sistem jadwal kerja fleksibel (termasuk shift malam / hari libur pabrik).' },
    { num: '04', title: 'Pelaksanaan Pekerjaan & K3 Mandatori', desc: 'Pengerjaan didampingi supervisor, safety brief JSA, uji gas berbahaya, serta dokumentasi foto GPS before-after.' },
    { num: '05', title: 'Penagihan, BAST, e-Faktur & TOP', desc: 'Dokumen penagihan lengkap (Invoice bermeterai, BAST asli bertandatangan, lembar e-Faktur PPN 11%, dan Manifest IPLT sah) dengan TOP 14 - 30 hari.' },
  ];

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 68, 2, 2, 'FD');

  let stepY = currentY + 8;
  steps.forEach((s) => {
    doc.setFillColor(15, 30, 54);
    doc.roundedRect(margin + 4, stepY - 3, 8, 8, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(s.num, margin + 5.5, stepY + 2.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 30, 54);
    doc.text(s.title, margin + 15, stepY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.setTextColor(71, 85, 105);
    doc.text(s.desc, margin + 15, stepY + 4.5);

    stepY += 12;
  });

  currentY += 76;

  // Kawasan Industri Rekanan Aktif
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(20, 184, 166);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(13, 148, 136);
  doc.text('MITRA VENDOR TERDAFTAR DI KAWASAN INDUSTRI TERKEMUKA BEKASI:', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);
  doc.text('• Kawasan Industri MM2100 Cikarang Barat (Manufaktur Otomotif & Komponen)', col1, currentY + 12);
  doc.text('• Kawasan Industri Jababeka I, II, & Cikarang Dry Port (FMCG & Kimia)', col1, currentY + 17);
  doc.text('• Kawasan Greenland International Industrial Center (GIIC) Deltamas', col1, currentY + 22);
  doc.text('• Kawasan East Jakarta Industrial Park (EJIP) & Delta Silicon Lippo Cikarang', col1, currentY + 27);

  doc.text('• Sentra Komersial Grand Galaxy, Summarecon, & Harapan Indah', col2, currentY + 12);
  doc.text('• Rumah Sakit Swasta & RSUD Kota/Kabupaten Bekasi', col2, currentY + 17);
  doc.text('• Gedung Perkantoran & Mall Terkemuka di Jalan Ahmad Yani Bekasi', col2, currentY + 22);
  doc.text('• Fasilitas Pergudangan Logistik Cibitung & Marunda Center', col2, currentY + 27);

  currentY += 38;

  // Box Kontak Resmi Prioritas B2B
  doc.setFillColor(15, 30, 54);
  doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('KONTAK PRIORITAS & KANAL RESMI CORPORATE PROCUREMENT', margin + 6, currentY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(226, 232, 240);

  doc.text('• Hotline 24 Jam B2B : +62 896-7506-4916 (Call / WhatsApp)', margin + 6, currentY + 15);
  doc.text('• Email Resmi Rekanan : procurement@ptkusumagemilangraya.com', margin + 6, currentY + 21);
  doc.text('• Website Resmi PT   : https://ptkusumagemilangraya.com', margin + 6, currentY + 27);
  doc.text('• Kantor Pusat & Pool : Jl. Jendral Ahmad Yani & Grand Galaxy, Kota Bekasi', margin + 6, currentY + 33);

  // Lembar Pengesahan Cap PT
  doc.setFillColor(249, 115, 22);
  doc.roundedRect(pageWidth - margin - 58, currentY + 8, 52, 24, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DIREKSI RESMI BERWENANG', pageWidth - margin - 54, currentY + 14);
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.text('PT KUSUMA GEMILANG RAYA', pageWidth - margin - 54, currentY + 19);
  doc.text('[Stempel Basah Perseroan]', pageWidth - margin - 54, currentY + 24);
  doc.text('Audit Compliance Division', pageWidth - margin - 54, currentY + 29);

  // Footer Page 4
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 4 dari 4 • Dokumen Portofolio Kepatuhan Resmi PT Kusuma Gemilang Raya (NIB: 0220108920194)', margin, pageHeight - 8);
  doc.text('Dokumen Kualifikasi Vendor Sah & Terverifikasi 2026', pageWidth - margin - 75, pageHeight - 8);

  return doc;
}
