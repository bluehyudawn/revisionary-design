interface AvatarProps {
  initials: string;
  size?: number;
}

export function Avatar({ initials, size = 36 }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#dcd1ff,#783cf0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Nunito, sans-serif',
          fontWeight: 800,
          fontSize: Math.round(size * 0.38),
          color: '#fff',
        }}
      >
        {initials}
      </span>
    </div>
  );
}
