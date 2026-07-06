import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import './PixelTransition.css';

function PixelTransition({ gridSize = 10, onComplete }) {
  const pixelGridRef = useRef(null);
  // On utilise tes deux couleurs Horizon et Mint
  const colors = ['#B9E2F5', '#A9E3D8', '#FFFDF5']; 

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    pixelGridEl.innerHTML = '';

    // Création de la grille
    for (let i = 0; i < gridSize * gridSize; i++) {
      const pixel = document.createElement('div');
      pixel.classList.add('pixel-unit');
      // On alterne ou on met au hasard les deux couleurs
      pixel.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      pixelGridEl.appendChild(pixel);
    }

    const pixels = pixelGridEl.querySelectorAll('.pixel-unit');
    
    // Animation GSAP : Remplissage puis Vidage
    const tl = gsap.timeline({
      onComplete: () => { if (onComplete) onComplete(); }
    });

    tl.set(pixels, { display: 'none' })
      .to(pixels, {
        display: 'block',
        duration: 0,
        stagger: { amount: 0.8, from: 'random' }
      })
      .to(pixels, {
        display: 'none',
        duration: 0,
        delay: 0.5,
        stagger: { amount: 0.8, from: 'random' }
      });
  }, [gridSize, onComplete, colors]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="pixel-transition-wrapper"
    >
      <div className="pixel-grid-container" ref={pixelGridRef} />
    </motion.div>
  );
}

export default PixelTransition;