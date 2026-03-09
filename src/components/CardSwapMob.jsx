"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export const Card3 = forwardRef(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl  [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
  />
));

Card3.displayName = "Card3";

const makeSlot = (i, distX, distY, total) => ({
  x: 0,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwapMob = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  onCardClick,
  skewAmount = 6,
  easing = "fast", 
  containerClassName,
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "back.out(1.2)",
          durDrop: 0.3,
          durMove: 0.35,
          durReturn: 0.35,
          promoteOverlap: 0.8,
          returnDelay: 0.05,
        }
      : {
          ease: "power3.out", 
          durDrop: 0.1,       
          durMove: 0.1,      
          durReturn: 0.1,    
          promoteOverlap: 0.5,
          returnDelay: 0.0,
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);

  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length],
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;

    refs.forEach((r, i) =>
      placeNow(
        r.current,
        makeSlot(i, cardDistance, verticalDistance, total),
        skewAmount,
      ),
    );

    // Added a direction parameter (1 = down, -1 = up)
    const swap = (direction = 1) => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();

      tlRef.current = tl;

      // Drop or fly the current card based on direction
      tl.to(elFront, {
        y: direction > 0 ? "+=500" : "-=500", // Throws up or down
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

      // Move the remaining cards forward
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);

        tl.set(el, { zIndex: slot.zIndex }, "promote");

        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.05}`, 
        );
      });

      const backSlot = makeSlot(
        refs.length - 1,
        cardDistance,
        verticalDistance,
        refs.length,
      );

      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);

      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        "return",
      );

      // Slide the dropped card back into the rear position
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    // --- BI-DIRECTIONAL VELOCITY DRAG LOGIC ---
    let isDragging = false;
    let startY = 0;
    let startTime = 0; 
    let elFront = null;
    let originalY = 0;

    const handlePointerDown = (e) => {
      if (tlRef.current?.isActive() || order.current.length < 2) return;
      
      isDragging = true;
      startY = e.clientY;
      startTime = Date.now(); 
      const frontIdx = order.current[0];
      elFront = refs[frontIdx].current;
      
      originalY = makeSlot(0, cardDistance, verticalDistance, total).y;
    };

    const handlePointerMove = (e) => {
      if (!isDragging || !elFront) return;
      
      const deltaY = e.clientY - startY;

      // Allow dragging in BOTH directions now
      gsap.set(elFront, { y: originalY + deltaY });
    };

    const handlePointerUp = (e) => {
      if (!isDragging || !elFront) return;
      isDragging = false;
      
      const deltaY = e.clientY - startY;
      const timeElapsed = Date.now() - startTime;
      
      // Calculate absolute speed and distance
      const absDeltaY = Math.abs(deltaY);
      const velocity = absDeltaY / timeElapsed;
      
      // Determine direction (1 for swipe down, -1 for swipe up)
      const direction = deltaY > 0 ? 1 : -1;

      // Trigger swap if dragged 80px, OR dragged 30px very quickly
      if (absDeltaY > 80 || (absDeltaY > 30 && velocity > 0.4)) {
        swap(direction);
      } else {
        // Snap back if threshold not met
        gsap.to(elFront, { 
          y: originalY, 
          duration: 0.25, 
          ease: "back.out(1.5)" 
        });
      }
      
      elFront = null;
    };

    const node = container.current;
    
    node.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      node.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child,
  );

  const defaultContainerClass =
    "absolute bottom-0 right-0 translate-x-[15%] sm:translate-x-[5%] md:-translate-x-[5%] translate-y-[5%] md:translate-y-[20%] scale-[0.8] xl:scale-100 origin-bottom-right perspective-[1000px] overflow-visible touch-none cursor-grab active:cursor-grabbing";

  return (
    <div
      ref={container}
      className={containerClassName ?? defaultContainerClass}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
};

export default CardSwapMob;