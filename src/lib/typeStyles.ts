const TYPE_STYLES: Record<string, string> = {
  Talk: 'bg-view/15 text-view ring-view/30',
  Panel: 'bg-view-yellow/15 text-view-yellow ring-view-yellow/30',
  Workshop: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/30',
  Masterclass: 'bg-amber-500/15 text-amber-300 ring-amber-400/30',
  Keynote: 'bg-rose-500/15 text-rose-300 ring-rose-400/30',
  Lab: 'bg-teal-500/15 text-teal-300 ring-teal-400/30',
  Screening: 'bg-fuchsia-500/15 text-fuchsia-300 ring-fuchsia-400/30',
  Signing: 'bg-orange-500/15 text-orange-300 ring-orange-400/30',
  'Portfolio Reviews': 'bg-lime-500/15 text-lime-300 ring-lime-400/30',
  'Ask Me Anything': 'bg-cyan-500/15 text-cyan-300 ring-cyan-400/30',
};

export function typeBadgeClass(type: string): string {
  return TYPE_STYLES[type] ?? 'bg-zinc-500/15 text-zinc-300 ring-zinc-400/30';
}
