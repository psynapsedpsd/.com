import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SYMBOLS = ["★", "♦", "♠", "♥", "◆", "●", "▲", "■"];

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

function createDeck(): Card[] {
  const pairs = [...SYMBOLS, ...SYMBOLS];
  const shuffled = pairs.sort(() => Math.random() - 0.5);
  return shuffled.map((symbol, id) => ({ id, symbol, flipped: false, matched: false }));
}

export function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(createDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const reset = useCallback(() => {
    setCards(createDeck());
    setSelected([]);
    setMoves(0);
    setElapsed(0);
    setRunning(false);
    setWon(false);
    setLocked(false);
  }, []);

  const flip = (id: number) => {
    if (locked) return;
    const card = cards[id];
    if (card.flipped || card.matched || selected.includes(id)) return;

    if (!running) setRunning(true);

    const newSelected = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));

    if (newSelected.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newSelected;
      if (cards[a].symbol === cards[b].symbol) {
        const updated = cards.map(c =>
          c.id === a || c.id === b ? { ...c, flipped: true, matched: true } : c
        );
        setCards(updated);
        setSelected([]);
        setLocked(false);
        if (updated.every(c => c.matched)) {
          setWon(true);
          setRunning(false);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === a || c.id === b ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false);
        }, 800);
      }
    } else {
      setSelected(newSelected);
    }
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-8" data-testid="memory-match-game">
      <div className="flex gap-8 text-center">
        <div>
          <div className="text-3xl font-serif font-bold text-[#F4E8D4]">{moves}</div>
          <div className="text-xs text-[#666] uppercase tracking-widest mt-1">Moves</div>
        </div>
        <div>
          <div className="text-3xl font-serif font-bold text-[#F4E8D4]">{fmt(elapsed)}</div>
          <div className="text-xs text-[#666] uppercase tracking-widest mt-1">Time</div>
        </div>
      </div>

      <AnimatePresence>
        {won ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4 font-serif text-[#F4E8D4]">Well Done</div>
            <p className="text-[#999] mb-2">Completed in <span className="text-[#A32020]">{moves} moves</span> and <span className="text-[#A32020]">{fmt(elapsed)}</span></p>
            <button
              onClick={reset}
              className="mt-6 px-8 py-3 bg-[#A32020] text-[#F4E8D4] rounded font-medium hover:bg-[#D93A3A] transition-colors"
              data-testid="play-again-btn"
            >
              Play Again
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-4 gap-3 w-full max-w-sm mx-auto">
            {cards.map(card => (
              <motion.button
                key={card.id}
                onClick={() => flip(card.id)}
                whileHover={!card.flipped && !card.matched ? { scale: 1.05 } : {}}
                whileTap={!card.flipped && !card.matched ? { scale: 0.95 } : {}}
                className={`aspect-square rounded-lg text-2xl font-bold border transition-all duration-300 ${
                  card.matched
                    ? "bg-[#A32020]/20 border-[#A32020]/50 text-[#A32020] cursor-default"
                    : card.flipped
                    ? "bg-[#1e1e1e] border-[#333] text-[#F4E8D4]"
                    : "bg-[#151515] border-[#2a2a2a] text-transparent hover:border-[#A32020]/30 cursor-pointer"
                }`}
                data-testid={`card-${card.id}`}
              >
                {(card.flipped || card.matched) ? card.symbol : "?"}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {!won && (
        <button
          onClick={reset}
          className="text-sm text-[#666] hover:text-[#F4E8D4] transition-colors underline underline-offset-4"
          data-testid="reset-btn"
        >
          Reset
        </button>
      )}
    </div>
  );
}
