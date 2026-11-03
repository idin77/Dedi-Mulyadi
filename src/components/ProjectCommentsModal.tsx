import React, { useState } from 'react';

export interface ProjectComment {
  id: string;
  projectId: number;
  author: string;
  location?: string;
  type: 'question' | 'review';
  rating?: number; // 1-5
  comment: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  adminReply?: {
    author: string;
    badge: string;
    text: string;
    date: string;
  };
}

export const initialProjectComments: ProjectComment[] = [
  // Project 1: Grand Galaxy
  {
    id: 'c-1-1',
    projectId: 1,
    author: 'Bpk. Ridwan Fauzi',
    location: 'Grand Galaxy City, Bekasi Selatan',
    type: 'question',
    comment: 'Apakah selang vakum bisa menjangkau posisi rumah di dalam gang sekitar 45 meter dari posisi parkir truk tangki?',
    createdAt: '1 hari lalu',
    likes: 8,
    adminReply: {
      author: 'Tim Operasional PT Kusuma Gemilang Raya',
      badge: 'Verifikasi Resmi',
      text: 'Halo Pak Ridwan! Armada kami dilengkapi sambungan selang spiral heavy-duty hingga 70 meter dengan daya hisap vakum stabil tanpa kendala jarak. Petugas siap meluncur ke lokasi Anda.',
      date: '1 hari lalu',
    },
  },
  {
    id: 'c-1-2',
    projectId: 1,
    author: 'Ibu Sandra Wulandari',
    location: 'Galaxy Cluster Pulo Ribung',
    type: 'review',
    rating: 5,
    comment: 'Pengerjaan sangat rapi dan higienis. Teknisi memakai seragam APD lengkap dan setelah selesai area lubang septic tank disemprot disinfektan wangi. Sangat memuaskan!',
    createdAt: '3 hari lalu',
    likes: 12,
  },

  // Project 2: Komersial Cikarang Barat
  {
    id: 'c-2-1',
    projectId: 2,
    author: 'Pak Dedi Kurniawan',
    location: 'Cikarang Barat',
    type: 'question',
    comment: 'Apakah metode hydro jetting aman untuk pipa PVC ukuran 4 inch yang sudah berusia lebih dari 8 tahun?',
    createdAt: '2 hari lalu',
    likes: 5,
    adminReply: {
      author: 'Teknisi Senior Hydro Jetting',
      badge: 'Spesialis Pipa',
      text: 'Sangat aman Pak Dedi. Mesin kami memiliki pengatur tekanan rotasi mikro (adjustable pressure) khusus untuk pipa PVC agar kerak lemak rontok tuntas tanpa risiko pecah atau retak.',
      date: '2 hari lalu',
    },
  },
  {
    id: 'c-2-2',
    projectId: 2,
    author: 'PT Tirta Makmur Sentosa',
    location: 'Kawasan Komersial Cikarang',
    type: 'review',
    rating: 5,
    comment: 'Saluran pembuangan dapur gedung kami yang mampet total kembali lancar dalam tempo 40 menit tanpa perlu bongkar keramik lantai. Hasil kerja sangat profesional!',
    createdAt: '5 hari lalu',
    likes: 9,
  },

  // Project 3: Medan Satria
  {
    id: 'c-3-1',
    projectId: 3,
    author: 'Bpk. Antonius Wijaya',
    location: 'Ruko Medan Satria, Bekasi',
    type: 'question',
    comment: 'Bisa dijadwalkan pengerjaan saat malam hari setelah jam operasional ruko tutup (sekitar jam 21.00)?',
    createdAt: '4 hari lalu',
    likes: 4,
    adminReply: {
      author: 'Divisi Customer Service',
      badge: 'Layanan 24 Jam',
      text: 'Bisa sekali Pak Antonius! Tim kami siaga 24 jam non-stop setiap hari termasuk pengerjaan shift malam komersial agar tidak mengganggu aktivitas usaha Anda.',
      date: '4 hari lalu',
    },
  },

  // Project 4: GIIC Cikarang
  {
    id: 'c-4-1',
    projectId: 4,
    author: 'Bpk. Wahyu Pratama',
    location: 'Divisi HSE Fabrikasi GIIC Cikarang',
    type: 'question',
    comment: 'Apakah penanganan limbah STP pabrik ini menyertakan bukti manifest resmi dari IPLT Pemda dan faktur pajak PPN untuk kebutuhan audit ISO 14001?',
    createdAt: '5 hari lalu',
    likes: 15,
    adminReply: {
      author: 'Compliance Officer PT KGR',
      badge: 'Legal & B2B',
      text: 'Tentu Pak Wahyu. Kami menyediakan dokumen lengkap: Berita Acara Serah Terima (BAST), Surat Jalan Manifest IPLT resmi bernomor izin, serta e-Faktur Pajak PPN sah.',
      date: '5 hari lalu',
    },
  },

  // Project 5: Summarecon Bekasi
  {
    id: 'c-5-1',
    projectId: 5,
    author: 'Chef Kevin',
    location: 'Bistro & Cafe Summarecon',
    type: 'review',
    rating: 5,
    comment: 'Pembersihan grease trap restoran sangat bersih tuntas. Bau lemak minyak dapur yang menyengat langsung lenyap seketika. Rekomendasi terbaik untuk pengusaha resto di Bekasi!',
    createdAt: '1 minggu lalu',
    likes: 11,
    adminReply: {
      author: 'Admin Support PT KGR',
      badge: 'Layanan Rutin',
      text: 'Terima kasih Chef Kevin! Kami siap mendukung pemeliharaan berkala setiap bulan agar sanitasi dapur restoran selalu lulus inspeksi dinas kesehatan.',
      date: '1 minggu lalu',
    },
  },

  // Project 6: Tambun Selatan
  {
    id: 'c-6-1',
    projectId: 6,
    author: 'Ibu Ratna',
    location: 'Papan Mas Tambun Selatan',
    type: 'question',
    comment: 'Berapa lama estimasi waktu kedatangan armada jika saya memesan mendesak sekarang karena WC sudah meluap?',
    createdAt: '2 hari lalu',
    likes: 7,
    adminReply: {
      author: 'Dispatcher Armada Bekasi',
      badge: 'Respon Cepat',
      text: 'Halo Bu Ratna, untuk wilayah Tambun Selatan armada terdekat di pangkalan kami bisa merapat ke lokasi dalam waktu 30 hingga 45 menit!',
      date: '2 hari lalu',
    },
  },

  // Project 7: Harapan Indah
  {
    id: 'c-7-1',
    projectId: 7,
    author: 'Pak Hendra Gunawan',
    location: 'Kavling Harapan Indah',
    type: 'review',
    rating: 5,
    comment: 'Lumpur septic tank di rumah kami sudah mengeras seperti semen karena 10 tahun tidak disedot. Teknisi dengan sabar melakukan pengenceran bertekanan tinggi sampai dasar bak bersih total. Sangat puas!',
    createdAt: '4 hari lalu',
    likes: 14,
  },

  // Project 8: Cibitung
  {
    id: 'c-8-1',
    projectId: 8,
    author: 'Ibu Lestari',
    location: 'Logistik MM2100 Cibitung',
    type: 'question',
    comment: 'Apakah bisa dibuatkan kontrak berkala tahunan untuk 3 titik fasilitas pergudangan kami di Cibitung?',
    createdAt: '6 hari lalu',
    likes: 6,
    adminReply: {
      author: 'Account Manager Korporat',
      badge: 'Kontrak B2B',
      text: 'Tentu bisa Bu Lestari! Kami sediakan skema MoU pemeliharaan preventif 6 bulan atau 1 tahunan dengan harga korporat khusus dan prioritas armada standby.',
      date: '6 hari lalu',
    },
  },

  // Project 9: Jatiasih
  {
    id: 'c-9-1',
    projectId: 9,
    author: 'Bpk. Ahmad Subarjo',
    location: 'Kompleks Sakura Jatiasih',
    type: 'review',
    rating: 5,
    comment: 'Pelayanan sangat higienis. Setelah sedot selesai tutup septic tank diplester kembali rapi dan tidak ada tumpahan air kotor sama sekali di carport.',
    createdAt: '3 hari lalu',
    likes: 8,
  },
];

interface ProjectItem {
  id: number;
  image: string;
  title: string;
  category: string;
  location: string;
  tag: string;
  description: string;
  estimatedCost?: string;
}

interface ProjectCommentsModalProps {
  project: ProjectItem;
  comments: ProjectComment[];
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (newComment: Omit<ProjectComment, 'id' | 'createdAt' | 'likes'>) => void;
  onToggleLike: (commentId: string) => void;
  onToast?: (message: string) => void;
}

export const ProjectCommentsModal: React.FC<ProjectCommentsModalProps> = ({
  project,
  comments,
  isOpen,
  onClose,
  onAddComment,
  onToggleLike,
  onToast,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'question' | 'review'>('all');
  const [authorName, setAuthorName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [commentType, setCommentType] = useState<'question' | 'review'>('question');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const projectComments = comments.filter((c) => c.projectId === project.id);
  const questionCount = projectComments.filter((c) => c.type === 'question').length;
  const reviewCount = projectComments.filter((c) => c.type === 'review').length;

  const reviewsWithRating = projectComments.filter((c) => c.type === 'review' && c.rating);
  const averageRating =
    reviewsWithRating.length > 0
      ? (
          reviewsWithRating.reduce((acc, curr) => acc + (curr.rating || 5), 0) /
          reviewsWithRating.length
        ).toFixed(1)
      : null;

  const filteredComments = projectComments.filter((c) => {
    if (filterType === 'question') return c.type === 'question';
    if (filterType === 'review') return c.type === 'review';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      if (onToast) onToast('⚠️ Mohon masukkan nama Anda.');
      return;
    }
    if (!commentText.trim() || commentText.trim().length < 5) {
      if (onToast) onToast('⚠️ Mohon tulis pesan Anda minimal 5 karakter.');
      return;
    }

    setIsSubmitting(true);
    try {
      onAddComment({
        projectId: project.id,
        author: authorName.trim(),
        location: locationName.trim() || undefined,
        type: commentType,
        rating: commentType === 'review' ? reviewRating : undefined,
        comment: commentText.trim(),
      });

      setCommentText('');
      setAuthorName('');
      setLocationName('');
      if (onToast) {
        onToast(
          commentType === 'question'
            ? '❓ Pertanyaan Anda berhasil dikirim! Tim kami akan segera menanggapi.'
            : '⭐ Terima kasih! Ulasan kepuasan Anda berhasil dipublikasikan.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWaLinkForProject = (context?: string) => {
    const text = `Halo PT Kusuma Gemilang Raya, saya ingin bertanya terkait proyek galeri "${project.title}" (${project.location}). ${
      context ? `\nPertanyaan: "${context}"` : ''
    }`;
    return `https://wa.me/6289675064916?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-navy via-navy-light to-navy p-5 sm:p-6 text-white border-b border-white/10 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan/20 text-cyan border border-cyan/30">
                    {project.tag}
                  </span>
                  <span className="text-xs text-orange font-semibold flex items-center gap-1">
                    📍 {project.location}
                  </span>
                  {project.estimatedCost && (
                    <span className="text-[11px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      💰 {project.estimatedCost}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-300">
                  Diskusi interaktif, tanya spesifikasi pengerjaan, dan ulasan pelanggan
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Tutup Komentar"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition shrink-0 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Metrics & Filter Tabs */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 font-bold text-white bg-white/10 px-3 py-1 rounded-full">
                💬 {projectComments.length} Total Komentar
              </span>
              {averageRating && (
                <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-300/30">
                  ⭐ {averageRating} / 5.0
                </span>
              )}
            </div>

            <div className="flex items-center bg-white/10 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer text-xs ${
                  filterType === 'all'
                    ? 'bg-cyan text-navy font-bold shadow-xs'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                Semua ({projectComments.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('question')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer text-xs ${
                  filterType === 'question'
                    ? 'bg-cyan text-navy font-bold shadow-xs'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                ❓ Tanya ({questionCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('review')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer text-xs ${
                  filterType === 'review'
                    ? 'bg-cyan text-navy font-bold shadow-xs'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                ⭐ Ulasan ({reviewCount})
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Comments List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-navy uppercase tracking-wider">
                Daftar Pertanyaan & Ulasan ({filteredComments.length})
              </h4>
              <span className="text-xs text-gray-500">Terbuka untuk umum & transparan</span>
            </div>

            {filteredComments.length > 0 ? (
              <div className="space-y-4">
                {filteredComments.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-gray-200 hover:border-gray-300 transition shadow-xs"
                  >
                    {/* Author & Header */}
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs ${
                            item.type === 'review'
                              ? 'bg-gradient-to-tr from-amber-500 to-orange'
                              : 'bg-gradient-to-tr from-cyan-600 to-navy-light'
                          }`}
                        >
                          {item.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-navy">{item.author}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.type === 'review'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-cyan/15 text-cyan-dark border border-cyan/30'
                              }`}
                            >
                              {item.type === 'review' ? '⭐ Ulasan Proyek' : '❓ Pertanyaan Layanan'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                            {item.location && <span>📍 {item.location}</span>}
                            <span>•</span>
                            <span>{item.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      {item.type === 'review' && item.rating && (
                        <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < (item.rating || 5) ? 'text-amber-500' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                          <span className="text-xs font-bold text-amber-800 ml-1">
                            {item.rating}.0
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Comment text */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {item.comment}
                    </p>

                    {/* Admin Reply if exists */}
                    {item.adminReply && (
                      <div className="mt-3 ml-2 sm:ml-4 p-3.5 bg-white rounded-xl border-l-4 border-l-emerald-500 border border-gray-200/80 shadow-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-navy flex items-center gap-1">
                              🛡️ {item.adminReply.author}
                            </span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                              ✓ {item.adminReply.badge}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {item.adminReply.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {item.adminReply.text}
                        </p>
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-3 pt-2.5 border-t border-gray-200/60 flex items-center justify-between text-xs text-gray-500">
                      <button
                        type="button"
                        onClick={() => onToggleLike(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition cursor-pointer font-medium ${
                          item.isLiked
                            ? 'text-orange bg-orange/10 font-bold'
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}
                      >
                        <span>👍</span>
                        <span>{item.likes} Membantu</span>
                      </button>

                      <a
                        href={getWaLinkForProject(item.comment)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>Tanya Layanan Serupa via WA</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-gray-200 rounded-2xl">
                <span className="text-3xl block mb-2">💬</span>
                <p className="text-xs sm:text-sm font-semibold text-navy">
                  Belum ada {filterType === 'question' ? 'pertanyaan' : filterType === 'review' ? 'ulasan' : 'komentar'} pada proyek ini.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Jadilah orang pertama yang bertanya atau membagikan ulasan!
                </p>
              </div>
            )}
          </div>

          {/* Comment Form Section */}
          <div className="bg-slate-100/80 p-5 rounded-2xl border border-gray-200">
            <h4 className="text-sm font-bold text-navy mb-1 flex items-center gap-1.5">
              <span>✍️</span>
              <span>Tulis Pertanyaan atau Ulasan Baru</span>
            </h4>
            <p className="text-xs text-gray-500 mb-4">
              Komentar Anda akan langsung tampil dan dapat dibaca oleh pelanggan lain atau dijawab oleh tim teknisi.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Tipe Komentar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCommentType('question')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                      commentType === 'question'
                        ? 'bg-navy text-cyan border-navy shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>❓</span>
                    <span>Tanya Layanan / Teknis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentType('review')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                      commentType === 'review'
                        ? 'bg-orange text-white border-orange shadow-xs'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span>⭐</span>
                    <span>Beri Ulasan Hasil Proyek</span>
                  </button>
                </div>
              </div>

              {/* Rating Star selector if review */}
              {commentType === 'review' && (
                <div className="bg-white p-3 rounded-xl border border-amber-200">
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Beri Nilai Bintang Kepuasan:
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-2xl text-amber-400 hover:scale-125 transition cursor-pointer"
                        >
                          {star <= reviewRating ? '★' : '☆'}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-navy">
                      {reviewRating === 5 && 'Sangat Puas & Rekomendasi (5/5)'}
                      {reviewRating === 4 && 'Puas & Profesional (4/5)'}
                      {reviewRating === 3 && 'Cukup Baik (3/5)'}
                      {reviewRating === 2 && 'Kurang Memuaskan (2/5)'}
                      {reviewRating === 1 && 'Perlu Evaluasi (1/5)'}
                    </span>
                  </div>
                </div>
              )}

              {/* Author & Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Nama Anda / Inisial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Contoh: Bpk. Budi Santoso"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-navy focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Wilayah / Perumahan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Contoh: Grand Galaxy, Cikarang"
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-navy focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan"
                  />
                </div>
              </div>

              {/* Message text */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {commentType === 'question' ? 'Tulis Pertanyaan Anda' : 'Tulis Ulasan Anda'} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    commentType === 'question'
                      ? 'Tanyakan mengenai ketersediaan selang panjang, waktu pengerjaan, estimasi biaya, atau persiapan teknis...'
                      : 'Ceritakan pengalaman Anda, kecepatan penanganan, kerapian petugas, atau kondisi saluran setelah dikerjakan...'
                  }
                  className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-200 text-xs sm:text-sm text-navy focus:border-cyan focus:outline-none focus:ring-1 focus:ring-cyan resize-none"
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <p className="text-[11px] text-gray-500">
                  🔒 Data privasi Anda terlindungi. Tanpa perlu registrasi akun.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-gradient-to-r from-navy to-navy-light hover:from-orange hover:to-orange-dark text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim...' : commentType === 'question' ? 'Kirim Pertanyaan' : 'Kirim Ulasan'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="bg-slate-50 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-emerald-500 text-base">🟢</span>
            <span>Butuh penanganan darurat hari ini? Teknisi siaga di seluruh wilayah Bekasi.</span>
          </div>
          <a
            href={getWaLinkForProject()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>💬 Chat Tim WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
