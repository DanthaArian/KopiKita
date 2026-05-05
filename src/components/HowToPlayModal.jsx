import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BatteryCharging, Coins, Shield, X, Zap } from "lucide-react";

function InfoRow({ children, icon: Icon, title }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/25 p-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
        <Icon className="h-4 w-4 text-cyan" aria-hidden="true" />
        {title}
      </div>
      <p className="text-sm leading-6 text-white/70">{children}</p>
    </div>
  );
}

export default function HowToPlayModal({ onClose, open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 grid place-items-center bg-black/70 px-4 py-5 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ y: 0, opacity: 1 }}
            aria-modal="true"
            className="glass-panel max-h-[88vh] w-full max-w-3xl overflow-y-auto p-5 sm:p-6"
            exit={{ y: 16, opacity: 0 }}
            initial={{ y: 24, opacity: 0 }}
            role="dialog"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-cyan">How to Play</p>
                <h2 className="mt-1 text-3xl font-black">Neon Drift Runner</h2>
              </div>
              <button
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:border-danger/70 hover:text-danger"
                onClick={onClose}
                type="button"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoRow icon={ArrowLeft} title="Desktop control">
                A/D atau Arrow Left/Right untuk drift horizontal. Space menahan
                boost ketika energy tersedia. P untuk pause atau resume.
              </InfoRow>
              <InfoRow icon={ArrowRight} title="Mobile control">
                Gunakan tombol kiri dan kanan di bawah layar. Tahan tombol boost
                untuk overdrive, lalu tekan pause kapan saja.
              </InfoRow>
              <InfoRow icon={Coins} title="Coin">
                Coin menambah skor dan jumlah koin run. Jalur coin sering
                memberi petunjuk celah aman.
              </InfoRow>
              <InfoRow icon={BatteryCharging} title="Energy">
                Energy mengisi bar boost. Boost membuat mobil lebih cepat dan
                menghasilkan trail neon.
              </InfoRow>
              <InfoRow icon={Shield} title="Shield">
                Shield menyerap satu tabrakan. Setelah pecah, mobil punya jeda
                singkat untuk kembali ke jalur aman.
              </InfoRow>
              <InfoRow icon={Zap} title="Obstacle">
                Hindari barrier, drone, dan rival car. Speed serta spawn rate
                naik bertahap sesuai difficulty.
              </InfoRow>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
