import { jsPDF } from 'jspdf';

export interface BrochurePdfOptions {
  clientCompanyName?: string;
  requesterName?: string;
}

export function generateBrochurePdf(options?: BrochurePdfOptions): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // --- PAGE 1: COVER & COMPANY PROFILE ---
  // Top Header Banner
  doc.setFillColor(15, 30, 54); // Navy #0F1E36
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Cyan Accent Strip
  doc.setFillColor(6, 182, 212); // Cyan #06B6D4
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PT KUSUMA GEMILANG RAYA', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(165, 243, 252); // Light cyan
  doc.text('VENDOR RESMI SANITASI & PENGOLAHAN LIMBAH CAIR INDUSTRI B2B', margin, 26);

  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('Kawasan MM2100 • Jababeka • GIIC • EJIP • Kota & Kab. Bekasi | Siaga 24 Jam', margin, 34);

  // Badge Document
  doc.setFillColor(249, 115, 22); // Orange #F97316
  doc.roundedRect(pageWidth - margin - 50, 12, 50, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('DOKUMEN RESMI B2B', pageWidth - margin - 47, 19);
  doc.setFontSize(9);
  doc.text('PROFIL & NIB 2026', pageWidth - margin - 47, 26);

  let currentY = 54;

  // Document Title & Greeting
  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PROFIL PERUSAHAAN & BROSUR LAYANAN KORPORAT', margin, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const subtitle = options?.clientCompanyName
    ? `Dipersiapkan khusus untuk: ${options.clientCompanyName} (Internal Procurement & HSE Audit)`
    : 'Dokumen Verifikasi Rekanan Vendor untuk Tim Procurement, Purchasing, GA & HSE Pabrik';
  doc.text(subtitle, margin, currentY);
  currentY += 9;

  // Box 1: Legalitas & Perizinan Resmi (Primary Highlight)
  doc.setFillColor(240, 253, 250); // Light teal/emerald tint
  doc.setDrawColor(20, 184, 166);
  doc.roundedRect(margin, currentY, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(13, 148, 136);
  doc.text('1. LEGALITAS & PERIZINAN BERUSAHA (VERIFIED VENDOR)', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const col1X = margin + 4;
  const col2X = margin + (contentWidth / 2) + 2;

  doc.text('• Nama Perusahaan: PT KUSUMA GEMILANG RAYA', col1X, currentY + 14);
  doc.text('• Nomor Induk Berusaha (NIB): 0220108920194', col1X, currentY + 20);
  doc.text('• Klasifikasi KBLI: 37011 (Pengelolaan Air Limbah)', col1X, currentY + 26);
  doc.text('• NPWP PT: 94.812.394.8-407.000', col1X, currentY + 32);

  doc.text('• Status Pajak: SPPKP (Faktur Pajak PPN 11% Resmi)', col2X, currentY + 14);
  doc.text('• Izin Pembuangan: Rekomendasi Resmi IPLT Pemda Bekasi', col2X, currentY + 20);
  doc.text('• Sertifikasi K3: SMK3 / CSMS Ready & Teknisi Ber-Sertifikat', col2X, currentY + 26);
  doc.text('• Dokumen Pengerjaan: Manifest IPLT & BAST Bermaterai', col2X, currentY + 32);

  currentY += 45;

  // Box 2: Ringkasan Layanan Spesialisasi B2B
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 54, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 30, 54);
  doc.text('2. SPESIFIKASI LAYANAN UTAMA KORPORAT & INDUSTRI', margin + 4, currentY + 7);

  const services = [
    {
      title: 'A. Kuras Bak STP & IPAL Pabrik (Sludge / Lumpur Aktif)',
      desc: 'Penyedotan rutin bak aerasi, sedimentasi, dan ekualisasi dengan pompa vakum high-pressure. Dilengkapi Berita Acara & Manifest IPLT resmi.',
    },
    {
      title: 'B. Septic Tank Gedung Bertingkat, Mall, Hotel & Rumah Sakit',
      desc: 'Sistem tangki kedap udara, zero-odour tanpa kebocoran bau di area komersial. Pengerjaan fleksibel di malam hari atau shift hening.',
    },
    {
      title: 'C. Pengurasan Lemak Grease Trap Restoran & Kantin Pabrik Skala Besar',
      desc: 'Pembersihan kerak minyak & lemak jenuh dengan metode hydro-jetting, mencegah pembekuan pipa pembuangan dan bau tak sedap.',
    },
    {
      title: 'D. Pelancaran Pipa Mampet High-Pressure Water Jetting (150-300 Bar)',
      desc: 'Teknologi flushing air bertekanan tinggi merontokkan kerak semen, minyak, dan endapan lumpur keras tanpa bongkar keramik.',
    },
  ];

  let servY = currentY + 14;
  services.forEach((s) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 30, 54);
    doc.text(s.title, margin + 4, servY);
    servY += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(100, 116, 139);
    doc.text(s.desc, margin + 4, servY);
    servY += 6.5;
  });

  currentY += 60;

  // Box 3: Armada, Kapasitas & Standar K3 (Safety)
  doc.setFillColor(254, 243, 199); // light amber
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, currentY, contentWidth, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(180, 83, 9);
  doc.text('3. STANDAR K3 / HSE & SPESIFIKASI ARMADA TANGKI', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(30, 41, 59);

  doc.text('• Kapasitas Tangki: Truk 4.000 Liter s/d 10.000 Liter (Armada Giga & Colt Diesel)', col1X, currentY + 14);
  doc.text('• Jangkauan Selang: 100+ Meter Spiral Industri (Menjangkau basement & area terbatas)', col1X, currentY + 20);
  doc.text('• Pompa Vakum: Rotary Vane Vacuum Blower PTO dengan daya sedot vertikal > 12 meter', col1X, currentY + 26);

  doc.text('• Alat Pelindung Diri (APD): Full Body Harness, Gas Detector H2S, Respirator, Safety Shoes & Helm', col2X, currentY + 14);
  doc.text('• K3 Confined Space: Teknisi terlatih SOP Ruang Terbatas bersertifikat Kemnaker', col2X, currentY + 20);
  doc.text('• Kebijakan Lingkungan: Pembuangan 100% legal ke Instalasi Pengolahan Lumpur Tinja (IPLT)', col2X, currentY + 26);

  currentY += 42;

  // Box 4: Alur Pengadaan B2B & Prosedur Pembayaran (PO / TOP)
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 30, 54);
  doc.text('4. PROSEDUR PENGADAAN (PROCUREMENT) & PEMBAYARAN KORPORAT', margin + 4, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(51, 65, 85);

  doc.text('1. Pengajuan Penawaran (Quotation/RFP) Resmi via Sales Corporate / Dispatcher', col1X, currentY + 14);
  doc.text('2. Survey Lokasi / Site Inspection Gratis untuk Area Industri Bekasi & Cikarang', col1X, currentY + 20);
  doc.text('3. Penerbitan Purchase Order (PO) & Surat Perjanjian Kerja (SPK)', col1X, currentY + 26);

  doc.text('4. Pengerjaan Sesuai Jadwal (Siaga 24 Jam termasuk Weekend & Shift Malam)', col2X, currentY + 14);
  doc.text('5. Penandatanganan BAST (Berita Acara Serah Terima) & Dokumentasi Sebelum/Sesudah', col2X, currentY + 20);
  doc.text('6. Penagihan Resmi: Invoice, Faktur Pajak e-Faktur PPN 11%, Kwitansi, Term of Payment (TOP 14-30 Hari)', col2X, currentY + 26);

  currentY += 40;

  // Box 5: Kontak Resmi Perusahaan & Pool Armada
  doc.setFillColor(15, 30, 54);
  doc.rect(margin, currentY, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('KONTAK RESMI PT KUSUMA GEMILANG RAYA', margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('• Hotline Dispatcher 24 Jam: 0896-7506-4916 / 0812-1234-5678', margin + 4, currentY + 12);
  doc.text('• Email B2B: procurement@kusumagemilangraya.co.id | info@kusumagemilangraya.co.id', margin + 4, currentY + 17);

  doc.text('• Pool Armada Cikarang: Kawasan Industri MM2100 & Jababeka', margin + 95, currentY + 12);
  doc.text('• Pool Armada Bekasi: Jl. Cut Mutia / Rawalumbu, Kota Bekasi', margin + 95, currentY + 17);

  // Footer note for Page 1
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 1 dari 2 • Dokumen Profil & Legalitas Resmi PT Kusuma Gemilang Raya', margin, pageHeight - 6);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - margin - 45, pageHeight - 6);

  // --- PAGE 2: PORTOFOLIO KLIEN & PERUSAHAAN REKANAN RESMI B2B ---
  doc.addPage();

  // Top Header Banner Page 2
  doc.setFillColor(15, 30, 54); // Navy #0F1E36
  doc.rect(0, 0, pageWidth, 30, 'F');

  // Cyan Accent Strip Page 2
  doc.setFillColor(6, 182, 212); // Cyan #06B6D4
  doc.rect(0, 30, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PT KUSUMA GEMILANG RAYA', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(165, 243, 252);
  doc.text('PORTOFOLIO B2B: DAFTAR PERUSAHAAN REKANAN & KLIEN KERJASAMA', margin, 22);

  doc.setFillColor(249, 115, 22); // Orange badge
  doc.roundedRect(pageWidth - margin - 46, 8, 46, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('VERIFIED CLIENTS', pageWidth - margin - 43, 14);
  doc.setFontSize(8);
  doc.text('15+ PERUSAHAAN PT', pageWidth - margin - 43, 19);

  let p2Y = 40;

  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('DAFTAR PERUSAHAAN YANG TELAH BEKERJA SAMA DENGAN KAMI', margin, p2Y);
  p2Y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Berikut adalah referensi perusahaan nasional, multinasional, dan BUMN yang telah mempercayakan pengelolaan limbah serta sanitasi kepada kami:',
    margin,
    p2Y
  );
  p2Y += 8;

  // Corporate Clients 15 items in 2-column tabular card format
  const clientList = [
    { name: '1. PT. Seino Indomobil Logistics', sector: 'Logistik & Transportasi', scope: 'Septic tank pool armada & perawatan drainase' },
    { name: '2. PT. Jaya Refrigeration Equipment', sector: 'Manufaktur Pendingin', scope: 'Kuras bak STP & grease trap limbah industri' },
    { name: '3. PT. Mitsubishi Jaya Elevator & Escalator', sector: 'Rekayasa & Transportasi Gedung', scope: 'Sanitasi gedung komersial & CSMS K3 ready' },
    { name: '4. PT. Maruhide Indonesia', sector: 'Manufaktur Presisi Otomotif', scope: 'Kuras bak STP pabrik Kawasan MM2100' },
    { name: '5. PT. Berjaya Nawaplastics Indonesia', sector: 'Industri Polimer & Plastik', scope: 'Sedot sludge aktif & BAST resmi Jababeka' },
    { name: '6. PT. Triguna Pratama Abadi', sector: 'Distribusi & Alat Industri', scope: 'Sanitasi workshop & kontrak termin PO 30 hari' },
    { name: '7. PT. Murinda Plant Subang', sector: 'Konstruksi Baja & Fabrikasi', scope: 'Pengurasan bak penampungan volume skala besar' },
    { name: '8. PT. IPC Tanjung Priok', sector: 'Pelabuhan & Logistik Maritim', scope: 'Sanitasi fasilitas dermaga & pos objek vital' },
    { name: '9. PT. Oscar Mas', sector: 'Alat Berat & Mesin Industri', scope: 'Workshop septic tank & bak pemisah residu' },
    { name: '10. PT. Charoen Pokphand Indonesia', sector: 'Agri-Food & Pengolahan Pangan', scope: 'Bak STP pabrik pangan standar higienitas HACCP' },
    { name: '11. PT. Ogawa Indonesia', sector: 'Kimia, Flavors & Fragrances', scope: 'Penyedotan limbah domestik & kepatuhan AMDAL' },
    { name: '12. PT. Torrecid Indonesia', sector: 'Keramik & Material Industri', scope: 'Kuras bak sedimentasi pompa vakum PTO' },
    { name: '13. PT. Hyundai', sector: 'Manufaktur Otomotif Modern', scope: 'Sanitasi kompleks pabrik GIIC Cikarang Pusat' },
    { name: '14. PT. Classic Fine Foods (Clasic Fine Food)', sector: 'FMCG, Bahan Pangan & Cold Chain', scope: 'Grease trap cold storage & hydro-jetting ramah lingkungan' },
    { name: '15. PT. Sanny Machinery (Sany Machinery)', sector: 'Alat Berat & Mesin Konstruksi', scope: 'Flushing saluran workshop & manifes limbah IPLT' },
  ];

  const half = Math.ceil(clientList.length / 2);
  const leftClients = clientList.slice(0, half);
  const rightClients = clientList.slice(half);

  const cardW = (contentWidth - 6) / 2;
  const cardH = 17.5;

  // Render Left Column
  let curLeftY = p2Y;
  leftClients.forEach((c) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, curLeftY, cardW, cardH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 30, 54);
    doc.text(c.name, margin + 3, curLeftY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(13, 148, 136); // Teal
    doc.text(`Sektor: ${c.sector}`, margin + 3, curLeftY + 9.5);

    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Lingkup: ${c.scope}`, margin + 3, curLeftY + 14);

    curLeftY += cardH + 2.2;
  });

  // Render Right Column
  let curRightY = p2Y;
  const colRightX = margin + cardW + 6;
  rightClients.forEach((c) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(colRightX, curRightY, cardW, cardH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 30, 54);
    doc.text(c.name, colRightX + 3, curRightY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(13, 148, 136);
    doc.text(`Sektor: ${c.sector}`, colRightX + 3, curRightY + 9.5);

    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Lingkup: ${c.scope}`, colRightX + 3, curRightY + 14);

    curRightY += cardH + 2.2;
  });

  p2Y = Math.max(curLeftY, curRightY) + 3;

  // Box B2B Procurement Commitments
  doc.setFillColor(240, 253, 250); // Mint
  doc.setDrawColor(20, 184, 166);
  doc.roundedRect(margin, p2Y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(13, 148, 136);
  doc.text('KOMITMEN LAYANAN & FASILITAS PENGADAAN (PROCUREMENT PERUSAHAAN)', margin + 4, p2Y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);

  doc.text('• Pembayaran Termin: Mendukung PO / SPK dengan TOP 14 - 30 Hari Kalender', col1X, p2Y + 13);
  doc.text('• Faktur Pajak Resmi: SPPKP Aktif, penerbitan e-Faktur PPN 11% tepat waktu', col1X, p2Y + 19);
  doc.text('• Berita Acara & Manifest: Dilengkapi BAST tanda tangan rangkap & bukti IPLT', col1X, p2Y + 25);

  doc.text('• Kesiapan CSMS & K3: Teknisi bersertifikat ruang terbatas & APD lengkap', col2X, p2Y + 13);
  doc.text('• Survei Lapangan Bebas Biaya: Inspeksi bak limbah & estimasi teknis gratis', col2X, p2Y + 19);
  doc.text('• Respon Darurat 24 Jam: Dispatcher siaga untuk shift malam atau kendala mampet', col2X, p2Y + 25);

  p2Y += 40;

  // Box Pengesahan & Call-to-action
  doc.setFillColor(15, 30, 54);
  doc.rect(margin, p2Y, contentWidth, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('DIVISI KEMITRAAN & SALES B2B KORPORAT PT KUSUMA GEMILANG RAYA', margin + 4, p2Y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(203, 213, 225);
  doc.text('Untuk pendaftaran vendor rekanan baru, pengiriman NDA/RFP, atau permintaan survei lapangan:', margin + 4, p2Y + 12);
  doc.text('Telepon / WhatsApp B2B: 0896-7506-4916 | Email: procurement@kusumagemilangraya.co.id', margin + 4, p2Y + 17);

  // Footer note for Page 2
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 2 dari 2 • Portofolio Klien Rekanan Resmi PT Kusuma Gemilang Raya', margin, pageHeight - 6);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth - margin - 45, pageHeight - 6);

  return doc;
}
