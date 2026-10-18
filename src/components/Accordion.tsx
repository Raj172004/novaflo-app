import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  items: { question: string; answer: string }[];
}

export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="card-surface overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display font-semibold text-white">{item.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-accent-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-relaxed text-slate-400">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
