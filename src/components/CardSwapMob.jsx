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
  easing = "fast", // Changed default to 'fast'
  containerClassName,
  children,
}) => {
  // 1. MASSIVELY REDUCED ANIMATION TIMES FOR SNAPPY FEEL
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
          ease: "power3.out", // Snappier ease than power1.inOut
          durDrop: 0.1,       // Drop down almost instantly
          durMove: 0.1,      // Background cards slide up immediately
          durReturn: 0.1,    // Dropped card snaps to back
          promoteOverlap: 0.5,// Start moving back cards while front is still dropping
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

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();

      tlRef.current = tl;

      // Drop the current card down
      tl.to(elFront, {
        y: "+=500",
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
          `promote+=${i * 0.05}`, // Reduced stagger from 0.15 to 0.05 for speed
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

    // --- NEW VELOCITY-BASED DRAG LOGIC ---
    let isDragging = false;
    let startY = 0;
    let startTime = 0; // Added to track swipe speed
    let elFront = null;
    let originalY = 0;

    const handlePointerDown = (e) => {
      if (tlRef.current?.isActive() || order.current.length < 2) return;
      
      isDragging = true;
      startY = e.clientY;
      startTime = Date.now(); // Record when the touch started
      const frontIdx = order.current[0];
      elFront = refs[frontIdx].current;
      
      originalY = makeSlot(0, cardDistance, verticalDistance, total).y;
    };

    const handlePointerMove = (e) => {
      if (!isDragging || !elFront) return;
      
      const deltaY = e.clientY - startY;

      // Only allow dragging downwards
      if (deltaY > 0) {
        gsap.set(elFront, { y: originalY + deltaY });
      }
    };

    const handlePointerUp = (e) => {
      if (!isDragging || !elFront) return;
      isDragging = false;
      
      const deltaY = e.clientY - startY;
      const timeElapsed = Date.now() - startTime;
      
      // Calculate how fast the user swiped (pixels per millisecond)
      const velocity = deltaY / timeElapsed;

      // 2. TRIGGER SWAP ON DISTANCE *OR* FAST FLICK
      // If dragged 80px down, OR if dragged at least 30px but very quickly (velocity > 0.4)
      if (deltaY > 80 || (deltaY > 30 && velocity > 0.4)) {
        swap();
      } else {
        // Snap back much faster
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