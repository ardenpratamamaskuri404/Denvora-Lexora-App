"use client";

import { motion } from "motion/react";
import { BookOpen, Sparkles } from "lucide-react";
import { AmbientSparkles } from "@/components/landing/AmbientSparkles";

const VORA_PILLARS = [
  { letter: "V", title: "Vision", meaning: "Membangun dengan tujuan yang jelas." },
  { letter: "O", title: "Originality", meaning: "Berpikir kreatif dan berbeda." },
  { letter: "R", title: "Reliability", meaning: "Menjaga ketertiban dan kepercayaan." },
  { letter: "A", title: "Advancement", meaning: "Terus bertumbuh dan berinovasi." },
];

const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function BrandStorySection() {
  return (
    <section
      id="filosofi-nama"
      className="relative py-20 md:py-24 bg-[var(--bg-primary)] transition-colors overflow-hidden"
    >
      <AmbientSparkles />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.08 }}
          transition={{ duration: 0.5, ease: SMOOTH_EASE }}
          className="max-w-2xl mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-primary)]">
            Filosofi Nama & Identitas
          </p>
          <h2 className="font-editorial mt-2 text-3xl md:text-4xl font-bold text-[var(--text-primary)]">
            Mengenal Makna di Balik Nama Denvora Lexora
          </h2>
          <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
            <strong>Denvora Lexora</strong> lahir dari perpaduan identitas pencetusnya dan
            semangat literasi modern —{" "}
            <em>Built with Vision, Driven by Innovation, Where Knowledge Finds Its Way.</em>
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.5, ease: SMOOTH_EASE }}
            className="lg:col-span-7 rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-7 sm:p-9 shadow-xs"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--bg-surface)] px-3 py-1 text-xs font-semibold text-[var(--accent-primary)]">
                  <Sparkles size={13} strokeWidth={1.75} />
                  Identitas Penggagas
                </span>
                <h3 className="font-editorial mt-3 text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  den<span className="text-[var(--accent-primary)]">vora.</span>
                </h3>
                <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
                  Kata <strong>&ldquo;Den&rdquo;</strong> diambil dari nama penggagasnya,{" "}
                  <strong className="text-[var(--text-primary)]">Arden Pratama Maskuri</strong>,
                  sedangkan <strong>&ldquo;VORA&rdquo;</strong> merangkum empat prinsip karya digital
                  yang bermakna:
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {VORA_PILLARS.map((item) => (
                <div
                  key={item.letter}
                  className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 p-4"
                >
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-editorial text-2xl font-bold text-[var(--accent-primary)]">
                      {item.letter}
                    </span>
                    <span className="font-editorial text-lg font-bold text-[var(--text-primary)]">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-[var(--text-muted)]">
                    {item.meaning}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.08 }}
            transition={{ duration: 0.5, delay: 0.08, ease: SMOOTH_EASE }}
            className="lg:col-span-5 rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 sm:p-9 flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-elevated)] text-[var(--accent-primary)] mb-5">
                <BookOpen size={20} strokeWidth={1.75} />
              </div>
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                Lex<span className="text-[var(--accent-primary)]">ora</span>
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[var(--text-primary)]/85 leading-relaxed">
                <strong>Lex</strong> berakar dari kata <em>Lexis</em> dan <em>Lexicon</em>{" "}
                yang berarti himpunan kata, buku, serta kekayaan pengetahuan manusia.
              </p>
              <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                Dipadukan dengan akhiran <strong>Ora</strong> yang menggambarkan{" "}
                <em>aura</em> dan <em>cakrawala terbuka</em>, <strong>Lexora</strong>{" "}
                bermakna ruang bercahaya tempat setiap pembaca menemukan buku yang tepat.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-primary)]">
                Semboyan Perpustakaan
              </p>
              <p className="font-editorial mt-1 text-lg font-bold text-[var(--text-primary)]">
                &ldquo;Where Knowledge Finds Its Way.&rdquo;
              </p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Di mana setiap ilmu pengetahuan menemukan jalannya menuju pembaca.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
