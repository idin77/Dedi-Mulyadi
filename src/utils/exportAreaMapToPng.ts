/**
 * Utility to generate a high-resolution Area Map PNG image
 * for internal B2B presentations, logistics planning, and client proposals.
 */

export interface MapHubInfo {
  id: string;
  name: string;
  shortName?: string;
  badge: string;
  phone: string;
  contactNumber?: string;
  address: string;
  coverage: string;
  response: string;
  armadaCount: string;
  lat: string;
  lng: string;
  pinPos?: { left: string; top: string };
  pinIcon?: string;
  highlightArea?: string;
  hotlineLabel?: string;
}

export interface ExportMapOptions {
  activeHub: MapHubInfo;
  allHubs: MapHubInfo[];
  companyName?: string;
  clientTarget?: string;
}

/**
 * Draws a professional 16:9 presentation slide PNG representing the area map coverage,
 * complete with regional map visualization, route corridors, pool pins, GPS specs,
 * SLA response times, fleet metrics, and official company credentials.
 */
export async function exportAreaMapToPng(options: ExportMapOptions): Promise<string> {
  const { activeHub, allHubs, companyName = 'PT KUSUMA GEMILANG RAYA', clientTarget } = options;

  const width = 1920;
  const height = 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // --- 1. Background (Dark Tech / Navy Slate B2B Aesthetic) ---
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#0a192f');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid lines for high-tech presentation look
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 48;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // --- 2. Top Header Presentation Bar ---
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(0, 0, width, 110);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.lineTo(width, 110);
  ctx.stroke();

  // Top cyan accent line
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(0, 0, width, 5);

  // Header Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px system-ui, -apple-system, sans-serif';
  ctx.fillText('PETA JANGKAUAN & TITIK OPERASIONAL ARMADA BEKASI', 60, 58);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 18px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `${companyName} • Divisi Transportasi Limbah & Sanitasi Industri/Residensial`,
    60,
    90
  );

  // Top Right Presentation Badge
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, width - 420, 26, 360, 60, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#a5f3fc';
  ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
  ctx.fillText('B2B LOGISTICS & SLA DISPATCH BRIEF', width - 400, 52);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 13px system-ui, -apple-system, sans-serif';
  ctx.fillText(`Dokumen Internal • Diperbarui: ${dateStr}`, width - 400, 74);

  // --- 3. Left Panel: Interactive Visual Map Graphic ---
  const mapX = 60;
  const mapY = 150;
  const mapW = 1140;
  const mapH = 870;

  // Map Outer Card
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 2;
  roundRect(ctx, mapX, mapY, mapW, mapH, 24);
  ctx.fill();
  ctx.stroke();

  // Map Simulated Terrain Background (Dark Blue/Teal Stylized Map)
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, mapX, mapY, mapW, mapH, 24);
  ctx.clip();

  const terrainGrad = ctx.createRadialGradient(
    mapX + mapW * 0.45,
    mapY + mapH * 0.5,
    50,
    mapX + mapW * 0.5,
    mapY + mapH * 0.5,
    600
  );
  terrainGrad.addColorStop(0, '#162b4d');
  terrainGrad.addColorStop(0.6, '#0f1d33');
  terrainGrad.addColorStop(1, '#09101f');
  ctx.fillStyle = terrainGrad;
  ctx.fillRect(mapX, mapY, mapW, mapH);

  // Stylized Topography & River Contours (Kali Bekasi & Citarum)
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.25)';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(mapX + 220, mapY);
  ctx.bezierCurveTo(mapX + 250, mapY + 280, mapX + 310, mapY + 450, mapX + 370, mapY + mapH);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
  ctx.lineWidth = 18;
  ctx.beginPath();
  ctx.moveTo(mapX + 900, mapY);
  ctx.bezierCurveTo(mapX + 860, mapY + 320, mapX + 830, mapY + 600, mapX + 880, mapY + mapH);
  ctx.stroke();

  // Arterial Highways (Tol Jakarta-Cikampek & Jalan Tol Layang MBZ)
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(mapX, mapY + 460);
  ctx.bezierCurveTo(mapX + 350, mapY + 470, mapX + 700, mapY + 540, mapX + mapW, mapY + 620);
  ctx.stroke();

  // Tol Cimanggis-Cibitung / Outer Ring Road
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(mapX + 150, mapY + mapH);
  ctx.lineTo(mapX + 480, mapY + 380);
  ctx.lineTo(mapX + 540, mapY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Regional Industrial Zones / Area Shading
  drawAreaZone(ctx, mapX + 620, mapY + 480, 420, 260, 'Kawasan Industri Cikarang (Jababeka, MM2100, EJIP)', '#06b6d4');
  drawAreaZone(ctx, mapX + 120, mapY + 280, 360, 240, 'Pusat Kota & Residensial Barat/Selatan', '#3b82f6');
  drawAreaZone(ctx, mapX + 380, mapY + 340, 320, 220, 'Koridor Tambun, Cibitung & Pantura', '#10b981');

  // Highway Label
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('JALAN TOL JAKARTA - CIKAMPEK (KM 12 - KM 37)', mapX + 380, mapY + 510);

  // Connecting route corridor lines between hubs
  const hubCoordinatesMap = [
    { x: mapX + mapW * 0.24, y: mapY + mapH * 0.40 }, // Pool Pusat
    { x: mapX + mapW * 0.78, y: mapY + mapH * 0.65 }, // Pos Cikarang
    { x: mapX + mapW * 0.50, y: mapY + mapH * 0.48 }, // Pos Tambun
  ];

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(hubCoordinatesMap[0].x, hubCoordinatesMap[0].y);
  ctx.quadraticCurveTo(
    hubCoordinatesMap[2].x,
    hubCoordinatesMap[2].y,
    hubCoordinatesMap[1].x,
    hubCoordinatesMap[1].y
  );
  ctx.stroke();
  ctx.setLineDash([]);

  // Radius Coverage Ring for the ACTIVE hub
  const activeIdx = allHubs.findIndex((h) => h.id === activeHub.id);
  const activeCoord = hubCoordinatesMap[activeIdx >= 0 ? activeIdx : 0];

  // Radar Pulse Rings
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(activeCoord.x, activeCoord.y, 160, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(activeCoord.x, activeCoord.y, 280, 0, Math.PI * 2);
  ctx.stroke();

  const radiusFill = ctx.createRadialGradient(
    activeCoord.x,
    activeCoord.y,
    10,
    activeCoord.x,
    activeCoord.y,
    160
  );
  radiusFill.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
  radiusFill.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
  ctx.fillStyle = radiusFill;
  ctx.beginPath();
  ctx.arc(activeCoord.x, activeCoord.y, 160, 0, Math.PI * 2);
  ctx.fill();

  // Draw Hub Pins on Map
  allHubs.forEach((hub, idx) => {
    const coord = hubCoordinatesMap[idx] || hubCoordinatesMap[0];
    const isSelected = hub.id === activeHub.id;

    // Outer glow
    if (isSelected) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.35)';
      ctx.beginPath();
      ctx.arc(coord.x, coord.y, 36, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pin circle
    ctx.fillStyle = isSelected ? '#06b6d4' : '#1e293b';
    ctx.strokeStyle = isSelected ? '#ffffff' : '#94a3b8';
    ctx.lineWidth = isSelected ? 4 : 2;
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, isSelected ? 22 : 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center dot
    ctx.fillStyle = isSelected ? '#0f172a' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, isSelected ? 8 : 6, 0, Math.PI * 2);
    ctx.fill();

    // Pin Label Card
    const labelW = 240;
    const labelH = 58;
    const labelX = coord.x - labelW / 2;
    const labelY = coord.y - 82;

    ctx.fillStyle = isSelected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = isSelected ? '#06b6d4' : 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = isSelected ? 2 : 1;
    roundRect(ctx, labelX, labelY, labelW, labelH, 12);
    ctx.fill();
    ctx.stroke();

    // Pin pointer triangle
    ctx.fillStyle = isSelected ? '#06b6d4' : 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    ctx.moveTo(coord.x - 7, labelY + labelH);
    ctx.lineTo(coord.x + 7, labelY + labelH);
    ctx.lineTo(coord.x, coord.y - (isSelected ? 24 : 18));
    ctx.closePath();
    ctx.fill();

    // Label Text
    ctx.fillStyle = isSelected ? '#38bdf8' : '#e2e8f0';
    ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(hub.shortName || hub.name, coord.x, labelY + 24);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 11px system-ui, -apple-system, sans-serif';
    ctx.fillText(`⚡ Respon: ${hub.response} • ${hub.armadaCount.split(' ')[0]} Truk`, coord.x, labelY + 44);
    ctx.textAlign = 'left';
  });

  // Map watermark & legend bottom bar
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(mapX, mapY + mapH - 64, mapW, 64);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mapX, mapY + mapH - 64);
  ctx.lineTo(mapX + mapW, mapY + mapH - 64);
  ctx.stroke();

  // Legend items
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('LEGENDA:', mapX + 30, mapY + mapH - 26);

  drawLegendItem(ctx, mapX + 130, mapY + mapH - 30, '#06b6d4', 'Pos Hub Terpilih (Prioritas)');
  drawLegendItem(ctx, mapX + 360, mapY + mapH - 30, '#1e293b', 'Pos Hub Penunjang');
  drawLegendItem(ctx, mapX + 540, mapY + mapH - 30, '#f59e0b', 'Koridor Tol / Arteri Logistik');

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Cakupan Layanan: Seluruh Kota & Kabupaten Bekasi (Radius 50+ KM)', mapX + mapW - 30, mapY + mapH - 26);
  ctx.textAlign = 'left';

  ctx.restore(); // end map clip

  // --- 4. Right Panel: Selected Hub Detail & Presentation Specifications ---
  const panelX = 1240;
  const panelY = 150;
  const panelW = 620;
  const panelH = 870;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2.5;
  roundRect(ctx, panelX, panelY, panelW, panelH, 24);
  ctx.fill();
  ctx.stroke();

  // Panel Inner Accent Top Header
  const headerGrad = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + 120);
  headerGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
  headerGrad.addColorStop(1, 'rgba(15, 23, 42, 0.2)');
  ctx.fillStyle = headerGrad;
  roundRect(ctx, panelX, panelY, panelW, 110, 24);
  ctx.fill();

  // Selected Hub Tag
  ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.5;
  roundRect(ctx, panelX + 36, panelY + 24, 180, 32, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#fb923c';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(`★ ${activeHub.badge.toUpperCase()}`, panelX + 50, panelY + 45);

  // SLA Live Indicator
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(panelX + panelW - 50, panelY + 40, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('DISPATCHER 24 JAM STANDBY', panelX + panelW - 65, panelY + 44);
  ctx.textAlign = 'left';

  // Active Hub Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
  ctx.fillText(activeHub.name, panelX + 36, panelY + 95);

  // Address
  let curY = panelY + 140;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('ALAMAT & POSISI STRATEGIS:', panelX + 36, curY);

  curY += 22;
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '500 15px system-ui, -apple-system, sans-serif';
  wrapText(ctx, activeHub.address, panelX + 36, curY, panelW - 72, 22);

  // Key KPI Metrics Grid (3 Boxes)
  curY += 60;
  const boxW = (panelW - 72 - 24) / 3;
  const boxH = 92;

  drawKpiBox(ctx, panelX + 36, curY, boxW, boxH, 'RESPON TIBA', activeHub.response, '#06b6d4');
  drawKpiBox(ctx, panelX + 36 + boxW + 12, curY, boxW, boxH, 'KESIAPAN ARMADA', activeHub.armadaCount, '#10b981');
  drawKpiBox(ctx, panelX + 36 + (boxW + 12) * 2, curY, boxW, boxH, 'KOORDINAT GPS', `${activeHub.lat}, ${activeHub.lng}`, '#f59e0b');

  // Contact & Dispatch Hotline Card
  curY += boxH + 26;
  ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 1.5;
  roundRect(ctx, panelX + 36, curY, panelW - 72, 84, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText((activeHub.hotlineLabel || 'HOTLINE OPERASIONAL / DISPATCH POS').toUpperCase(), panelX + 54, curY + 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(activeHub.phone || '+62 896-7506-4916', panelX + 54, curY + 60);

  ctx.fillStyle = '#34d399';
  ctx.font = '600 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('Direct Line & WhatsApp Ready', panelX + panelW - 54, curY + 54);
  ctx.textAlign = 'left';

  // Area Coverage Detail List
  curY += 108;
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText('CAKUPAN WILAYAH PRIORITAS PENANGANAN:', panelX + 36, curY);

  curY += 24;
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 14px system-ui, -apple-system, sans-serif';
  curY = wrapText(ctx, activeHub.coverage, panelX + 36, curY, panelW - 72, 22);

  // Technical & B2B Compliance Credentials Card
  curY += 26;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  roundRect(ctx, panelX + 36, curY, panelW - 72, 170, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
  ctx.fillText('STANDAR KUALIFIKASI AUDIT VENDOR B2B:', panelX + 54, curY + 28);

  const complianceList = [
    '✓ Legalitas NIB KBLI 37011 & Pembuangan Resmi IPLT Sumur Batu Bekasi',
    '✓ Personel Bersertifikat K3 Ruang Terbatas (Confined Space Entry Kemenaker)',
    '✓ Kelengkapan APD Level 3, Multi-Gas Detector 4-Gas & Blower Exhaust',
    '✓ Armada Buku Uji KIR Berkala Aktif Dishub & Kalibrasi Vacuum Blower',
    '✓ Kelengkapan Administrasi: Faktur Pajak PPN, Surat Jalan & BAST Resmi',
  ];

  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 12px system-ui, -apple-system, sans-serif';
  complianceList.forEach((item, cIdx) => {
    ctx.fillText(item, panelX + 54, curY + 54 + cIdx * 22);
  });

  // Footer inside side card
  curY += 190;
  ctx.fillStyle = '#64748b';
  ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
  ctx.fillText(
    `Disiapkan untuk: ${clientTarget || 'Presentasi Internal & Evaluasi Tim Procurement B2B'}`,
    panelX + 36,
    curY + 16
  );

  return canvas.toDataURL('image/png');
}

/**
 * Triggers an instant download of the generated Map PNG image
 */
export async function downloadAreaMapPng(options: ExportMapOptions): Promise<void> {
  const dataUrl = await exportAreaMapToPng(options);
  const link = document.createElement('a');
  const sanitizedHub = options.activeHub.name.replace(/[^a-zA-Z0-9]/g, '_');
  link.download = `Area_Map_PT_KGR_${sanitizedHub}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helpers
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawAreaZone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  color: string
) {
  ctx.fillStyle = `${color}15`;
  ctx.strokeStyle = `${color}40`;
  ctx.lineWidth = 1.5;
  roundRect(ctx, x, y, w, h, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(title, x + 16, y + 26);
}

function drawLegendItem(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  label: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 12px system-ui, -apple-system, sans-serif';
  ctx.fillText(label, x + 14, y + 4);
}

function drawKpiBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  val: string,
  color: string
) {
  ctx.fillStyle = 'rgba(30, 41, 59, 0.6)';
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
  ctx.lineWidth = 1;
  roundRect(ctx, x, y, w, h, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 10px system-ui, -apple-system, sans-serif';
  ctx.fillText(label, x + 14, y + 24);

  ctx.fillStyle = color;
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
  ctx.fillText(val, x + 14, y + 54);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
  return curY + lineHeight;
}
