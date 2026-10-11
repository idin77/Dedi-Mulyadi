import { jsPDF } from 'jspdf';
import { DocumentationItem } from '../App';

export interface InvoiceBastPdfOptions {
  clientCompanyName?: string;
  poNumber?: string;
  invoiceNumber?: string;
  bastNumber?: string;
}

export function generateInvoiceBastPdf(
  item: DocumentationItem,
  options?: InvoiceBastPdfOptions
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Determine dynamic pricing & itemization according to category
  let serviceName = item.title;
  let unitPrice = 3500000;
  let retribusiIplt = 450000;
  let qtyText = '1 Paket / Armada';

  if (item.category === 'Industri & B2B') {
    serviceName = `Jasa Penyedotan Bak STP/IPAL & Transportasi Limbah Tangki 6.000L - ${item.title}`;
    unitPrice = 4800000;
    retribusiIplt = 600000;
    qtyText = '1 Unit Truk Tangki Besar';
  } else if (item.category === 'Komersial & Resto') {
    serviceName = `Jasa Pengurasan Lemak Grease Trap & Pembersihan Endapan Kerak Dapur - ${item.title}`;
    unitPrice = 2800000;
    retribusiIplt = 350000;
    qtyText = '1 Unit Armada Komersial';
  } else if (item.category === 'Pelancaran Pipa') {
    serviceName = `Jasa Pelancaran Pipa Mampet Hydro Jetting High-Pressure (250 Bar) - ${item.title}`;
    unitPrice = 2200000;
    retribusiIplt = 200000;
    qtyText = '1 Sesi Pekerjaan Lapangan';
  } else {
    // Residensial
    serviceName = `Penyedotan Septic Tank & Sterilisasi Bak Penampungan - ${item.title}`;
    unitPrice = 1200000;
    retribusiIplt = 150000;
    qtyText = '1 Unit Armada Tangki';
  }

  const subtotal = unitPrice + retribusiIplt;
  const ppn = Math.round(subtotal * 0.11);
  const materai = 10000;
  const grandTotal = subtotal + ppn + materai;

  const invNum =
    options?.invoiceNumber ||
    `INV/KGR/2026/${String(item.id).padStart(4, '0')}`;
  const bastNum =
    options?.bastNumber ||
    `BAST/KGR/2026/DOC-${String(item.id).padStart(4, '0')}`;
  const poNum =
    options?.poNumber?.trim() ||
    `PO-KLIEN/2026/${item.category.slice(0, 3).toUpperCase()}-${String(item.id).padStart(3, '0')}`;
  const clientName =
    options?.clientCompanyName?.trim() ||
    `Tim Procurement & Finance (${item.location})`;

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ==========================================
  // PAGE 1: INVOICE PENAGIHAN RESMI
  // ==========================================

  // Header background
  doc.setFillColor(15, 30, 54); // Navy
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Cyan accent line
  doc.setFillColor(6, 182, 212); // Cyan
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // Company Name & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('PT KUSUMA GEMILANG RAYA', margin, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(165, 243, 252);
  doc.text('PENGELOLAAN LIMBAH CAIR & SANITASI INDUSTRI B2B | KBLI: 37011', margin, 21);

  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text('NIB: 0220108920194 | NPWP: 94.812.394.8-407.000 | SPPKP (PPN 11%)', margin, 27);
  doc.text('Pool Cikarang & Bekasi | Hotline Dispatcher: 0896-7506-4916 | finance@kusumagemilangraya.co.id', margin, 33);

  // Document Badge on Header Right
  doc.setFillColor(249, 115, 22); // Orange
  doc.roundedRect(pageWidth - margin - 48, 10, 48, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('LEMBAR SALINAN KEUANGAN', pageWidth - margin - 46, 16);
  doc.setFontSize(9);
  doc.text('INVOICE RESMI', pageWidth - margin - 46, 22);

  let curY = 48;

  // Title of Page 1
  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('FAKTUR PENAGIHAN (COMMERCIAL INVOICE)', margin, curY);
  curY += 6;

  // Metadata Grid: Two Column Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, curY, contentWidth, 34, 2, 2, 'FD');

  doc.setFontSize(8);
  const col1X = margin + 4;
  const col2X = margin + contentWidth / 2 + 2;

  // Left Column: Invoice Meta
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Nomor Invoice', col1X, curY + 6);
  doc.text('Nomor BAST', col1X, curY + 12);
  doc.text('Nomor PO Klien', col1X, curY + 18);
  doc.text('Tanggal Pengerjaan', col1X, curY + 24);
  doc.text('Jatuh Tempo (TOP)', col1X, curY + 30);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 30, 54);
  doc.text(`: ${invNum}`, col1X + 28, curY + 6);
  doc.text(`: ${bastNum}`, col1X + 28, curY + 12);
  doc.text(`: ${poNum}`, col1X + 28, curY + 18);
  doc.text(`: ${item.date}`, col1X + 28, curY + 24);
  doc.text(': 30 Hari Kalender (Net 30)', col1X + 28, curY + 30);

  // Right Column: Client Meta
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Ditujukan Kepada', col2X, curY + 6);
  doc.text('Lokasi Proyek', col2X, curY + 12);
  doc.text('Kategori', col2X, curY + 18);
  doc.text('Tag Dokumen', col2X, curY + 24);
  doc.text('Status Billing', col2X, curY + 30);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 30, 54);
  const shortClient = clientName.length > 28 ? clientName.substring(0, 26) + '...' : clientName;
  const shortLocation = item.location.length > 28 ? item.location.substring(0, 26) + '...' : item.location;
  doc.text(`: ${shortClient}`, col2X + 26, curY + 6);
  doc.text(`: ${shortLocation}`, col2X + 26, curY + 12);
  doc.text(`: ${item.category}`, col2X + 26, curY + 18);
  doc.text(`: ${item.tag}`, col2X + 26, curY + 24);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Green
  doc.text(': SELESAI PEKERJAAN (TERVERIFIKASI)', col2X + 26, curY + 30);

  curY += 40;

  // Table of Items
  doc.setFillColor(15, 30, 54);
  doc.rect(margin, curY, contentWidth, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('NO', margin + 3, curY + 5.5);
  doc.text('DESKRIPSI PEKERJAAN / JASA', margin + 14, curY + 5.5);
  doc.text('QTY / SATUAN', margin + 105, curY + 5.5);
  doc.text('HARGA SATUAN (RP)', margin + 135, curY + 5.5);
  doc.text('JUMLAH (RP)', margin + 160, curY + 5.5);

  curY += 8;

  // Row 1: Primary Service
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, curY, contentWidth, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, curY + 14, margin + contentWidth, curY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text('1', margin + 3, curY + 6);
  doc.text(serviceName.substring(0, 55), margin + 14, curY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text(`Lokasi: ${item.location} | Berita Acara Ref: ${bastNum}`, margin + 14, curY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text(qtyText, margin + 105, curY + 6);
  doc.text(`Rp ${unitPrice.toLocaleString('id-ID')}`, margin + 135, curY + 6);
  doc.text(`Rp ${unitPrice.toLocaleString('id-ID')}`, margin + 160, curY + 6);

  curY += 14;

  // Row 2: IPLT / Disposal levy
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, curY, contentWidth, 11, 'F');
  doc.line(margin, curY + 11, margin + contentWidth, curY + 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text('2', margin + 3, curY + 6);
  doc.text('Biaya Retribusi & Pengolahan IPLT Resmi Pemda (Manifest Terlampir)', margin + 14, curY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text('Sesuai Perda Lingkungan Hidup Kabupaten / Kota Bekasi', margin + 14, curY + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text('1 Manifest Resmi', margin + 105, curY + 6);
  doc.text(`Rp ${retribusiIplt.toLocaleString('id-ID')}`, margin + 135, curY + 6);
  doc.text(`Rp ${retribusiIplt.toLocaleString('id-ID')}`, margin + 160, curY + 6);

  curY += 11;

  // Row 3: BAST & K3 Compliance Documentation
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, curY, contentWidth, 9, 'F');
  doc.line(margin, curY + 9, margin + contentWidth, curY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text('3', margin + 3, curY + 6);
  doc.text('Dokumentasi Lapangan, Sertifikat BAST & Standar K3 Lengkap', margin + 14, curY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('1 Berkas Lengkap', margin + 105, curY + 6);
  doc.text('Termasuk (Rp 0)', margin + 135, curY + 6);
  doc.text('Rp 0', margin + 160, curY + 6);

  curY += 12;

  // Calculation Breakdown Table (Right aligned box)
  const calcX = margin + contentWidth - 78;
  const calcW = 78;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(calcX, curY, calcW, 36, 1.5, 1.5, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal Pekerjaan', calcX + 3, curY + 6);
  doc.text('PPN 11% (SPPKP Resmi)', calcX + 3, curY + 13);
  doc.text('Bea Materai BAST Resmi', calcX + 3, curY + 20);

  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rp ${subtotal.toLocaleString('id-ID')}`, calcX + calcW - 4, curY + 6, { align: 'right' });
  doc.text(`Rp ${ppn.toLocaleString('id-ID')}`, calcX + calcW - 4, curY + 13, { align: 'right' });
  doc.text(`Rp ${materai.toLocaleString('id-ID')}`, calcX + calcW - 4, curY + 20, { align: 'right' });

  // Divider inside calculation box
  doc.setDrawColor(15, 30, 54);
  doc.line(calcX + 3, curY + 24, calcX + calcW - 3, curY + 24);

  // Grand Total Highlight
  doc.setFillColor(15, 30, 54);
  doc.rect(calcX + 2, curY + 26, calcW - 4, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('TOTAL TAGIHAN:', calcX + 4, curY + 31.5);
  doc.setTextColor(165, 243, 252);
  doc.text(`Rp ${grandTotal.toLocaleString('id-ID')}`, calcX + calcW - 4, curY + 31.5, { align: 'right' });

  // Left Note Box: Bank Transfer Info & Notes
  const noteW = contentWidth - calcW - 4;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, curY, noteW, 36, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text('INSTRUKSI PEMBAYARAN REKENING RESMI PT:', margin + 3, curY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text('• Bank Mandiri: 156-00-1928374-1', margin + 3, curY + 12);
  doc.text('  a.n. PT KUSUMA GEMILANG RAYA (KCP MM2100)', margin + 3, curY + 16);
  doc.text('• Bank BCA: 739-0821901', margin + 3, curY + 21);
  doc.text('  a.n. PT KUSUMA GEMILANG RAYA (KCU Cikarang)', margin + 3, curY + 25);
  doc.text('* Cantumkan No. Invoice pada berita transfer pembayaran bank.', margin + 3, curY + 31);

  curY += 41;

  // Uraian Singkat Pekerjaan / Notes
  doc.setFillColor(254, 243, 199); // Light amber
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, curY, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(180, 83, 9);
  doc.text('CATATAN LAPANGAN UNTUK BAGIAN KEUANGAN (FINANCE AUDIT):', margin + 3, curY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(69, 26, 3);
  const cleanDesc = item.description.replace(/\n/g, ' ');
  const descLines = doc.splitTextToSize(cleanDesc, contentWidth - 6);
  doc.text(descLines.slice(0, 2), margin + 3, curY + 10);

  curY += 23;

  // Signatures on Page 1
  const sigBoxW = contentWidth / 2 - 4;

  // Left Signature: Client Finance
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, curY, sigBoxW, 36, 1.5, 1.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Diterima & Disetujui Oleh Klien:', margin + 4, curY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Bagian Keuangan / Procurement', margin + 4, curY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 30, 54);
  doc.text('( .................................................... )', margin + 4, curY + 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Tgl Verifikasi: ___ / ___ / 2026', margin + 4, curY + 34);

  // Right Signature: PT Kusuma Gemilang Raya
  const rightSigX = margin + sigBoxW + 8;
  doc.roundedRect(rightSigX, curY, sigBoxW, 36, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PT KUSUMA GEMILANG RAYA', rightSigX + 4, curY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Finance & Accounting Division', rightSigX + 4, curY + 9.5);

  // Stamp Badge simulation
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(59, 130, 246);
  doc.roundedRect(rightSigX + sigBoxW - 38, curY + 12, 34, 14, 1, 1, 'FD');
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('PT KUSUMA GEMILANG RAYA', rightSigX + sigBoxW - 36, curY + 16.5);
  doc.text('FINANCE VERIFIED', rightSigX + sigBoxW - 36, curY + 20.5);
  doc.text('BEKASI - JAWA BARAT', rightSigX + sigBoxW - 36, curY + 24.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 30, 54);
  doc.text('Hj. Ratna Kusuma, S.E.', rightSigX + 4, curY + 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Kepala Bagian Keuangan & Pajak', rightSigX + 4, curY + 34);

  // Footer Page 1
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 1 dari 2 — Dokumen Sah Penagihan PT Kusuma Gemilang Raya (NIB: 0220108920194)', margin, pageHeight - 6);
  doc.text(`Dicetak: ${currentDateStr}`, pageWidth - margin - 35, pageHeight - 6);

  // ==========================================
  // PAGE 2: BERITA ACARA SERAH TERIMA (BAST)
  // ==========================================
  doc.addPage();

  // Header background Page 2
  doc.setFillColor(15, 30, 54);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setFillColor(16, 185, 129); // Emerald accent
  doc.rect(0, 32, pageWidth, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PT KUSUMA GEMILANG RAYA', margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(165, 243, 252);
  doc.text('DIVISI OPERASIONAL & K3 PENGOLAHAN LIMBAH CAIR | RESMI IPLT BEKASI', margin, 18);

  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);
  doc.text('NIB: 0220108920194 | KBLI: 37011 | Sertifikasi CSMS & SMK3 Lingkungan Hidup', margin, 24);

  // Badge Document on Header Right
  doc.setFillColor(16, 185, 129); // Emerald
  doc.roundedRect(pageWidth - margin - 52, 7, 52, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('DOKUMEN PENYELESAIAN', pageWidth - margin - 50, 13);
  doc.setFontSize(9);
  doc.text('BERITA ACARA (BAST)', pageWidth - margin - 50, 19);

  let p2Y = 42;

  // Title BAST
  doc.setTextColor(15, 30, 54);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('BERITA ACARA SERAH TERIMA PEKERJAAN (BAST)', margin, p2Y);
  p2Y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Nomor BAST: ${bastNum} | Referensi Invoice: ${invNum}`, margin, p2Y);
  p2Y += 7;

  // Opening Paragraph
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  const openingText = `Pada hari dan tanggal pelaksanaan ${item.date}, bertempat di lokasi ${item.location}, telah diselesaikan seluruh rangkaian pekerjaan sanitasi dan pengolahan limbah oleh PT Kusuma Gemilang Raya selaku Penyedia Jasa untuk Klien Rekanan, dengan klausul serah terima sebagai berikut:`;
  const splitOpening = doc.splitTextToSize(openingText, contentWidth);
  doc.text(splitOpening, margin, p2Y);
  p2Y += splitOpening.length * 4.2 + 3;

  // Box: Identitas Pekerjaan & Lokasi
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, p2Y, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 30, 54);
  doc.text('1. RINCIAN DATA PEKERJAAN LAPANGAN', margin + 4, p2Y + 6);

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Nama Pekerjaan / Proyek', margin + 4, p2Y + 12);
  doc.text('Kategori Layanan', margin + 4, p2Y + 17);
  doc.text('Lokasi Pengerjaan', margin + 4, p2Y + 22);
  doc.text('Tanggal Pelaksanaan', margin + 4, p2Y + 27);
  doc.text('Status Uji Fungsi / Aliran', margin + 4, p2Y + 32);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 30, 54);
  doc.text(`: ${item.title}`, margin + 44, p2Y + 12);
  doc.text(`: ${item.category} (${item.tag})`, margin + 44, p2Y + 17);
  doc.text(`: ${item.location}`, margin + 44, p2Y + 22);
  doc.text(`: ${item.date}`, margin + 44, p2Y + 27);

  doc.setTextColor(16, 185, 129);
  doc.text(': BERSIH, LANCAR & TUNTAS 100% (LOLOS UJI FUNGSIONAL)', margin + 44, p2Y + 32);

  p2Y += 43;

  // Box: Uraian Teknis Pelaksanaan (dari dokumentasi)
  doc.setFillColor(240, 253, 250); // Light teal/emerald tint
  doc.setDrawColor(45, 212, 191);
  doc.roundedRect(margin, p2Y, contentWidth, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 148, 136);
  doc.text('2. CATATAN TEKNIS DAN METODOLOGI PENGERJAAN', margin + 4, p2Y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);

  const descFull = doc.splitTextToSize(`• Uraian Lapangan: ${item.description}`, contentWidth - 8);
  doc.text(descFull, margin + 4, p2Y + 12);

  const techBullet1 = '• Standar APD & Keselamatan: Full Body Harness, Safety Shoes, Helm, Sarung Tangan Karet Nitril & Masker Gas Respirator.';
  const techBullet2 = '• Pompa & Peralatan: Vacuum Blower High-Suction PTO & Selang Spiral Kedap Udara Bebas Bau Ceceran.';
  doc.text(techBullet1, margin + 4, p2Y + 22);
  doc.text(techBullet2, margin + 4, p2Y + 28);

  p2Y += 41;

  // Box: Legalitas Manifest Pembuangan IPLT
  doc.setFillColor(254, 243, 199); // Amber tint
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin, p2Y, contentWidth, 29, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('3. KETAATAN REGULASI LINGKUNGAN & PEMBUANGAN RESMI IPLT', margin + 4, p2Y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(51, 65, 85);
  doc.text(`• Nomor Manifest Pengangkutan Limbah : MNF/IPLT-BKS/2026/${String(item.id).padStart(5, '0')}`, margin + 4, p2Y + 12);
  doc.text('• Destinasi Akhir Limbah Cair       : Instalasi Pengolahan Lumpur Tinja (IPLT) Resmi Pemda Bekasi', margin + 4, p2Y + 17);
  doc.text('• Jaminan Kepatuhan AMDAL / UKL-UPL : Bebas sanksi lingkungan, bersertifikat retribusi resmi dan aman bagi audit ISO 14001.', margin + 4, p2Y + 22);

  p2Y += 34;

  // Pernyataan Pengesahan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 30, 54);
  doc.text('PERNYATAAN SERAH TERIMA PEKERJAAN:', margin, p2Y);
  p2Y += 4.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Kedua belah pihak menyatakan pekerjaan telah diselesaikan dan diterima dengan baik tanpa komplain.', margin, p2Y);
  p2Y += 6;

  // Bilateral Signatures on Page 2
  const p2SigW = contentWidth / 2 - 4;

  // Left Signature: Pihak Kedua (Klien / Pengawas Lapangan)
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, p2Y, p2SigW, 40, 1.5, 1.5, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PIHAK KEDUA (KLIEN)', margin + 4, p2Y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Pemberi Tugas / Pengawas Lapangan Klien', margin + 4, p2Y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 30, 54);
  doc.text('( ........................................................... )', margin + 4, p2Y + 31);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Nama Terang, Jabatan & Cap Perusahaan', margin + 4, p2Y + 35);

  // Right Signature: Pihak Pertama (PT Kusuma Gemilang Raya)
  const p2RightX = margin + p2SigW + 8;
  doc.roundedRect(p2RightX, p2Y, p2SigW, 40, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('PIHAK PERTAMA (PELAKSANA TUGAS)', p2RightX + 4, p2Y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('PT KUSUMA GEMILANG RAYA', p2RightX + 4, p2Y + 9.5);

  // Verified Badge simulation
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(p2RightX + p2SigW - 38, p2Y + 13, 34, 15, 1, 1, 'FD');
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('IPLT & K3 VERIFIED', p2RightX + p2SigW - 36, p2Y + 17.5);
  doc.text('BERITA ACARA RESMI', p2RightX + p2SigW - 36, p2Y + 21.5);
  doc.text('BEKASI - JAWA BARAT', p2RightX + p2SigW - 36, p2Y + 25.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 30, 54);
  doc.text('Kusuma Wijaya, S.T.', p2RightX + 4, p2Y + 31);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Supervisor Operasional & Koordinator Lapangan', p2RightX + 4, p2Y + 35);

  // Footer Page 2
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text('Halaman 2 dari 2 — Berita Acara Serah Terima (BAST) Sah PT Kusuma Gemilang Raya', margin, pageHeight - 6);
  doc.text(`Dicetak: ${currentDateStr}`, pageWidth - margin - 35, pageHeight - 6);

  return doc;
}
