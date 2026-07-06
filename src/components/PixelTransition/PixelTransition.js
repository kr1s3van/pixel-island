import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './PixelTransition.css';

const COLORS_LIST = ['#B9E2F5', '#A9E3D8']; 

function PixelTransition({ gridSize = 10, onComplete }) {
  const pixelGridRef = useRef(null);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    pixelGridEl.innerHTML = '';

    for (let i = 0; i < gridSize * gridSize; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel-unit');
      pixel.style.backgroundColor = COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)];
      pixelGridEl.appendChild(pixel);
    }

    const pixels = pixelGridEl.querySelectorAll('.pixel-unit');
    
    const tl = gsap.timeline({
      onComplete: () => { if (onComplete) onComplete(); }
    });

    tl.set(pixels, { opacity: 0 })
      .to(pixels, {
        opacity: 1, duration: 0.1,
        stagger: { amount: 0.6, from: 'random' }
      })
      .to(pixels, {
        opacity: 0, duration: 0.1, delay: 0.4,
        stagger: { amount: 0.6, from: 'random' }
      });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize, onComplete]); 

  return (
    <div className="pixel-transition-overlay">
      <div className="pixel-grid-container" ref={pixelGridRef} />
    </div>
  );
}

export default PixelTransition;