import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI instance with recommended header
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback intelligent analysis generator if Gemini API key is missing or offline
function generateFallbackAnalysis(params: {
  text: string;
  author: string;
  role?: string;
  rating?: number;
  category?: string;
}) {
  const { text, rating = 5, category = 'Residensial' } = params;
  const ratingNum = Number(rating) || 5;

  let sentiment = 'Sangat Positif';
  let sentimentScore = 98;
  if (ratingNum <= 2) {
    sentiment = 'Perlu Perhatian & Tindak Lanjut';
    sentimentScore = 45;
  } else if (ratingNum === 3) {
    sentiment = 'Cukup & Konstruktif';
    sentimentScore = 72;
  } else if (ratingNum === 4) {
    sentiment = 'Positif & Memuaskan';
    sentimentScore = 88;
  }

  const defaultKeyHighlights = [
    ratingNum >= 4 ? 'Ketepatan waktu armada tangki vakum terbukti responsif' : 'Catatan waktu kedatangan armada',
    'Higienitas pengerjaan berstandar K3 tanpa ceceran limbah',
    category.includes('Industri')
      ? 'Legalitas manifes IPLT Pemda & berita acara BAST lengkap'
      : 'Transparansi penetapan tarif dan kepuasan hasil sedot tuntas',
  ];

  return {
    sentiment,
    sentimentScore,
    keyHighlights: defaultKeyHighlights,
    summary: `Ulasan ${sentiment.toLowerCase()} (${ratingNum}/5) mengapresiasi kebersihan, kesigapan teknisi, dan kejelasan pengerjaan di area ${category}.`,
    videoStoryboard: [
      'Scene 1 (0:00 - 0:08): Pengenalan klien & kondisi septic tank/grease trap sebelum ditangani.',
      'Scene 2 (0:08 - 0:20): Proses kedatangan armada tangki & teknisi APD melakukan hisap tuntas.',
      'Scene 3 (0:20 - 0:30): Hasil kerja bersih, tes kelancaran toilet, serta penyerahan bukti BAST/nota.',
    ],
    recommendedTags: [
      '#SedotWCBekasi',
      '#HigienisBebasBau',
      '#LayananBergaransi',
      ratingNum >= 5 ? '#PelangganSangatPuas' : '#EvaluasiLayanan',
    ],
    analyzedAt: new Date().toISOString(),
  };
}

// API Route: Analyze Testimonial with Gemini AI
app.post('/api/gemini/analyze-testimonial', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, author, role, rating, category } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Teks testimoni wajib diisi.' });
      return;
    }

    if (!genAI || !apiKey) {
      // Graceful fallback when API key is not yet set
      const fallback = generateFallbackAnalysis({ text, author, role, rating, category });
      res.json({
        success: true,
        source: 'fallback',
        analysis: fallback,
      });
      return;
    }

    const prompt = `Anda adalah asisten AI evaluator kepuasan pelanggan dan spesialis video testimoni untuk "PT Kusuma Gemilang Raya" (Jasa Sedot WC & Pengolahan Limbah Industri di Bekasi).
Analisis testimoni pelanggan berikut ini dan berikan output dalam format JSON murni tanpa markdown wrapper:

Data Testimoni:
- Klien: ${author || 'Pelanggan'} (${role || 'Bekasi'})
- Kategori Layanan: ${category || 'Residensial'}
- Rating Bintang: ${rating || 5} dari 5.0
- Isi Testimoni: "${text}"

Berikan respons JSON dengan schema:
{
  "sentiment": "Sangat Positif" | "Positif" | "Konstruktif" | "Perlu Perhatian",
  "sentimentScore": number (antara 0 hingga 100),
  "keyHighlights": string[] (3 poin sorotan utama kepuasan klien dalam kalimat ringkas),
  "summary": string (1 kalimat ringkasan eksekutif mutu layanan),
  "videoStoryboard": string[] (3-4 langkah panduan adegan singkat 30 detik untuk video testimoni klien ini),
  "recommendedTags": string[] (3-4 hashtag relevan seperti #ResponCepat, #HigienisBebasBau, dll)
}`;

    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      let parsedAnalysis;
      try {
        parsedAnalysis = JSON.parse(responseText.trim());
      } catch {
        parsedAnalysis = generateFallbackAnalysis({ text, author, role, rating, category });
      }

      res.json({
        success: true,
        source: 'gemini-3.8-flash',
        analysis: {
          ...parsedAnalysis,
          analyzedAt: new Date().toISOString(),
        },
      });
    } catch (apiError) {
      console.warn('Gemini API call failed, falling back:', apiError);
      const fallback = generateFallbackAnalysis({ text, author, role, rating, category });
      res.json({
        success: true,
        source: 'fallback-on-error',
        analysis: fallback,
      });
    }
  } catch (error) {
    console.error('Error analyzing testimonial:', error);
    res.status(500).json({ error: 'Gagal menganalisis testimoni.' });
  }
});

// API Route: Generate Video Placeholder / Script with Gemini AI
app.post('/api/gemini/generate-placeholder', async (req: Request, res: Response): Promise<void> => {
  try {
    const { author, category, keyPoints } = req.body;

    if (!genAI || !apiKey) {
      res.json({
        success: true,
        source: 'fallback',
        placeholder: {
          title: `Video Testimoni: Kepuasan ${author || 'Klien'} - ${category || 'Layanan Sanitasi'}`,
          duration: '0:35',
          simulatedVideoType: 'short-clip',
          badgeText: '📹 Video Terverifikasi',
          aspectRatio: '16:9',
          script: `Halo, saya ${author || 'klien'} dari Bekasi. Pelayanan PT Kusuma Gemilang Raya sangat cepat dan bersih. Selang vakum panjangnya memudahkan akses dan tidak ada bau tersisa. Sangat direkomendasikan!`,
          caption: 'Testimoni resmi kepuasan pengerjaan tangki vakum higienis PT Kusuma Gemilang Raya.',
        },
      });
      return;
    }

    const prompt = `Buatlah script dan metadata video testimoni pendek (durasi ~30 detik) dalam format JSON untuk klien bernama "${author || 'Pelanggan'}" kategori "${category || 'Residensial'}". Poin utama: ${keyPoints || 'Armada cepat, teknisi ramah, kerja bersih tanpa bau'}.
Format JSON:
{
  "title": string,
  "duration": string (e.g. "0:32"),
  "simulatedVideoType": "short-clip",
  "badgeText": string,
  "aspectRatio": "16:9",
  "script": string (naskah video singkat yang diucapkan klien),
  "caption": string (teks subtitle/ringkasan)
}`;

    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({
        success: true,
        source: 'gemini-3.8-flash',
        placeholder: parsed,
      });
    } catch {
      res.json({
        success: true,
        source: 'fallback-on-error',
        placeholder: {
          title: `Video Testimoni: ${author || 'Klien'} - ${category || 'Layanan Sanitasi'}`,
          duration: '0:30',
          simulatedVideoType: 'short-clip',
          badgeText: '📹 Video Terverifikasi',
          aspectRatio: '16:9',
          script: `Pelayanan sedot WC PT Kusuma Gemilang Raya terbukti cepat, rapi, dan transparan. Tidak ada bau dan area kerja dibersihkan sempurna!`,
          caption: 'Bukti kepuasan pelanggan atas pengerjaan tangki vakum higienis PT Kusuma Gemilang Raya.',
        },
      });
    }
  } catch (error) {
    console.error('Error generating placeholder:', error);
    res.status(500).json({ error: 'Gagal membuat placeholder video.' });
  }
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
