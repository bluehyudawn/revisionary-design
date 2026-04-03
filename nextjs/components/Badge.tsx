const BADGE_STYLE: Record<string, { bg: string; color: string }> = {
  'Study Tips':     { bg: '#ece8fd', color: '#783cf0' },
  'Subject Guides': { bg: '#dfe8ff', color: '#5967f4' },
  'Exam Prep':      { bg: '#ffedd4', color: '#ea5a0c' },
  'VCE News':       { bg: '#d1faea', color: '#07947a' },
};

interface BadgeProps {
  category: string;
  size?: 'sm' | 'lg';
  /** Force white background — use on top of gradient/image areas */
  white?: boolean;
}

export function Badge({ category, size = 'sm', white = false }: BadgeProps) {
  const b = BADGE_STYLE[category] ?? { bg: '#e7e5e4', color: '#57534d' };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: size === 'lg' ? '4px 14px' : '2px 10px',
        borderRadius: 6,
        background: white ? '#fff' : b.bg,
        border: white ? '1px solid rgba(0,0,0,0.12)' : 'none',
        fontWeight: 500,
        fontSize: size === 'lg' ? 13 : 12,
        lineHeight: 1.5,
        color: b.color,
        whiteSpace: 'nowrap',
      }}
    >
      {category}
    </span>
  );
}
