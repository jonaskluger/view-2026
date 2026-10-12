interface StarButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function StarButton({ active, onToggle }: StarButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      className={`ml-auto -mr-1 -mt-1 rounded-full p-1.5 transition active:scale-90 ${
        active
          ? 'text-amber-400 hover:text-amber-300'
          : 'text-zinc-600 hover:text-zinc-400'
      }`}
    >
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </button>
  );
}
