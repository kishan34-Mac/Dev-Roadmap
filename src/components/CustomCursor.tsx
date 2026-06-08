import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', enter);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.removeEventListener('mouseenter', enter);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed pointer-events-none z-[9999] transition-transform duration-75"
        style={{
          left: pos.x - 4,
          top: pos.y - 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#58A6FF',
          boxShadow: '0 0 12px rgba(88,166,255,0.6), 0 0 24px rgba(88,166,255,0.2)',
        }}
      />
      <div
        className="fixed pointer-events-none z-[9998] transition-all duration-150"
        style={{
          left: pos.x - 16,
          top: pos.y - 16,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(88,166,255,0.1) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
