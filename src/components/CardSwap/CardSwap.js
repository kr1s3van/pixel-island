import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`swap-card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = ({ children, cardDistance = 40, verticalDistance = 50, delay = 4000 }) => {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(() => childArr.map(() => React.createRef()), [childArr]);
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total)));

    const swap = () => {
      if (order.current.length < 2) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();

      tl.to(elFront, { y: '+=100', opacity: 0, duration: 0.6, ease: "power2.in" });
      
      rest.forEach((idx, i) => {
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.to(refs[idx].current, {
          x: slot.x, y: slot.y, z: slot.z, zIndex: slot.zIndex,
          duration: 0.6, ease: "back.out(1.2)"
        }, "-=0.4");
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.set(elFront, { zIndex: backSlot.zIndex });
      tl.to(elFront, {
        x: backSlot.x, y: backSlot.y, z: backSlot.z, opacity: 1,
        duration: 0.6, ease: "power2.out"
      });

      tl.call(() => { order.current = [...rest, front]; });
    };

    const interval = setInterval(swap, delay);
    return () => clearInterval(interval);
  }, [cardDistance, verticalDistance, delay, refs]);

  return (
    <div ref={container} className="card-swap-container">
      {childArr.map((child, i) => isValidElement(child) ? cloneElement(child, { ref: refs[i], key: i }) : child)}
    </div>
  );
};

export default CardSwap;