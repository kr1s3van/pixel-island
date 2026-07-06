import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './PixelTransition.css';

const COLORS_LIST = ['#B9E2F5', '#A9E3D8']; 

function PixelTransition({ gridSize = 10, onComplete }) {
  const pixelGridRef = useRef(null);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    
    // On nettoie la grille
    pixelGridEl.innerHTML = '';

    // On crée les pixels
    const totalPixels = gridSize * gridSize;
    for (let i = 0; i < totalPixels; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel-unit');
      pixel.style.backgroundColor = COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)];
      pixelGridEl.appendChild(pixel);
    }

    const pixels = pixelGridEl.querySelectorAll('.pixel-unit');
    
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // L'ANIMATION
    tl.to(pixels, {
      opacity: 1,
      duration: 0.2,
      stagger: {
        amount: 0.7,
        from: "random"
      }
    })
    .to({}, { duration: 0.3 }) // Pause où l'écran est plein
    .to(pixels, {
      opacity: 0,
      duration: 0.2,
      stagger: {
        amount: 0.7,
        from: "random"
      }
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