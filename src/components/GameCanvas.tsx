import { useRef, useEffect } from 'react';
import { GameRenderer } from '../engine/GameRenderer';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<GameRenderer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new GameRenderer(canvas);
    rendererRef.current = renderer;

    const handleResize = () => {
      renderer.resize();
    };

    handleResize();
    renderer.start();

    window.addEventListener('resize', handleResize);

    return () => {
      renderer.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ imageRendering: 'crisp-edges' }}
    />
  );
}
