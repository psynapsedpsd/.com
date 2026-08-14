import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          data-testid="modal-overlay">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#101008] border border-[#2a2820] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            data-testid="modal-container">
            <div className="flex items-center justify-between px-7 py-5 border-b border-[#1e1c17]">
              <h2 className="text-lg font-serif font-semibold text-[#EDE0CA]" data-testid="modal-title">{title}</h2>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#EDE0CA]/40 hover:text-[#EDE0CA]/80 hover:bg-[#EDE0CA]/8 transition-all"
                data-testid="modal-close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-7">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
