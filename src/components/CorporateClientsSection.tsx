import React, { useState, useMemo } from 'react';
import { CORPORATE_CLIENTS, CLIENT_CATEGORIES, CorporateClient } from '../data/corporateClients';

interface CorporateClientsSectionProps {
  onSelectClientForQuote?: (clientName: string, serviceScope: string) => void;
  onOpenQuickQuote?: () => void;
}

export const CorporateClientsSection: React.FC<CorporateClientsSectionProps> = ({
  onSelectClientForQuote,
  onOpenQuickQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedClientId, setCopiedClientId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return CORPORATE_CLIENTS.filter((client) => {
      const matchCategory = selectedCategory === 'all' || client.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        client.name.toLowerCase().includes(q) ||
        client.sector.toLowerCase().includes(q) ||
        client.location.toLowerCase().includes(q) ||
        client.serviceScope.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopyClientName = (client: CorporateClient) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(client.name);
      setCopiedClientId(client.id);
      setTimeout(() => setCopiedClientId(null), 2500);
    }
  };

  return (
    <section id="klien" className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden border-t border-b border-gray-200">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-navy/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy/5 border border-navy/15 text-navy text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PORTOFOLIO REKANAN B2B & KORPORAT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy tracking-tight leading-tight">
            Perusahaan yang Telah <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy via-cyan-dark to-orange">Bekerja Sama</span> dengan Kami
          </h2>

          <p className="mt-4 text-gray-600 text-sm sm:text-base leading-relaxed">
            Kepercayaan tinggi dari perusahaan multinasional, industri manufaktur, logistik maritim, dan kawasan industri terkemuka di Indonesia dalam pengelolaan limbah STP/IPAL, sedot grease trap, dan kepatuhan baku mutu lingkungan.
          </p>
        </div>

        {/* 4 Trust Highlights / Corporate Credentials */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4 hover:border-cyan/50 transition">
            <div className="w-12 h-12 rounded-xl bg-navy/10 text-navy flex items-center justify-center text-xl shrink-0">
              🏢
            </div>
            <div>
              <p className="text-2xl font-black text-navy leading-none">15+</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Perusahaan Multinasional & BUMN</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4 hover:border-cyan/50 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              📋
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600 leading-none">100%</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Manifest IPLT & Berita Acara (BAST)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4 hover:border-cyan/50 transition">
            <div className="w-12 h-12 rounded-xl bg-cyan/10 text-cyan-dark flex items-center justify-center text-xl shrink-0">
              🧾
            </div>
            <div>
              <p className="text-2xl font-black text-cyan-dark leading-none">TOP 30</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Termin PO & Faktur Pajak e-Faktur PPN</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-4 hover:border-cyan/50 transition">
            <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center text-xl shrink-0">
              🛡️
            </div>
            <div>
              <p className="text-2xl font-black text-orange leading-none">CSMS</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Kepatuhan K3 & Teknisi Bersertifikat</p>
            </div>
          </div>
        </div>

        {/* Dynamic Continuous Marquee Ticker */}
        <div className="relative mb-12 bg-navy py-4 rounded-2xl shadow-lg overflow-hidden border border-navy-light/40">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-navy to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-navy to-transparent z-10 pointer-events-none"></div>

          <div className="flex items-center gap-4 whitespace-nowrap animate-marquee">
            {[...CORPORATE_CLIENTS, ...CORPORATE_CLIENTS].map((client, idx) => (
              <div
                key={`${client.id}-${idx}`}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wide border border-white/10 transition shrink-0"
              >
                <span className="w-2 h-2 rounded-full bg-cyan"></span>
                <span>{client.name}</span>
                <span className="text-[10px] text-gray-300 font-normal">({client.sector})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {CLIENT_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-navy text-white shadow-xs'
                        : 'bg-slate-100 text-gray-600 hover:bg-slate-200 hover:text-navy'
                    }`}
                  >
                    {cat.label}
                    {cat.id === 'all' && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">
                        {CORPORATE_CLIENTS.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Cari nama perusahaan atau sektor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-xs text-navy focus:border-cyan focus:ring-2 focus:ring-cyan/20 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-gray-400 hover:text-gray-600"
                  aria-label="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Corporate Client Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => {
            const isCopied = copiedClientId === client.id;
            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-gray-200/90 hover:border-cyan/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 group relative overflow-hidden"
              >
                {/* Top Header Card */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-navy border border-gray-200">
                      {client.categoryLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <span>✓</span>
                      <span>{client.badge}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-navy group-hover:text-cyan-dark transition flex items-center justify-between">
                    <span>{client.name}</span>
                  </h3>

                  <p className="text-xs font-semibold text-gray-500 mt-1 flex items-center gap-1.5">
                    <span>🏷️</span>
                    <span>{client.sector}</span>
                  </p>

                  <p className="text-xs text-gray-600 mt-2 flex items-start gap-1.5">
                    <span className="shrink-0 text-cyan">📍</span>
                    <span>{client.location}</span>
                  </p>

                  {/* Scope of Work */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-gray-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      Lingkup Pengerjaan Rekanan:
                    </span>
                    <p className="text-xs font-medium text-navy">
                      {client.serviceScope}
                    </p>
                  </div>

                  {/* Operational Highlight */}
                  <p className="text-[11px] text-gray-500 mt-3 leading-relaxed italic border-l-2 border-cyan pl-2.5">
                    "{client.highlight}"
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyClientName(client)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-navy transition cursor-pointer"
                    title="Salin nama PT"
                  >
                    <span>{isCopied ? '✓ Tersalin' : '📋 Salin'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectClientForQuote) {
                          onSelectClientForQuote(client.name, client.serviceScope);
                        } else {
                          const quoteElem = document.getElementById('quotation');
                          if (quoteElem) {
                            quoteElem.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-navy hover:bg-navy-light text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <span>Minta Penawaran</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <span className="text-4xl">🔍</span>
            <h4 className="text-lg font-bold text-navy mt-3">Tidak ada perusahaan yang cocok</h4>
            <p className="text-xs text-gray-500 mt-1">Coba kata kunci pencarian lain atau pilih kategori Semua.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Corporate Trust CTA Box */}
        <div className="mt-12 bg-gradient-to-r from-navy via-navy-light to-navy rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-cyan/20">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-cyan/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan/20 text-cyan-light border border-cyan/30 uppercase tracking-wider inline-block">
                KEMITRAAN B2B & KONTRAK BERKALA
              </span>
              <h3 className="text-2xl sm:text-3xl font-black">
                Ingin Perusahaan Anda Masuk dalam Jaringan Rekanan Prioritas Kami?
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Kami siap mengisi formulir vendor registration, kelengkapan berkas tender/CSMS, pengiriman sampel proposal teknis, dan survei lapangan cuma-cuma ke lokasi pabrik atau gedung Anda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="#quotation"
                className="px-6 py-3.5 rounded-xl bg-orange hover:bg-orange-dark text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-orange/30 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Ajukan Penawaran PT (RFP)</span>
                <span>→</span>
              </a>

              <a
                href={`https://wa.me/6289675064916?text=${encodeURIComponent(
                  'Halo Tim B2B PT Kusuma Gemilang Raya, kami dari divisi Procurement/GA berminat menjalin kerja sama vendor pengelolaan limbah & sanitasi untuk perusahaan kami.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition text-center flex items-center justify-center gap-2"
              >
                <span>Konsultasi Vendor B2B</span>
                <span>💬</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
