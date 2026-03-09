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
  easing = "elastic",
  containerClassName,
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
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
          `promote+=${i * 0.15}`,
        );
      });

      // Calculate where the back slot is for the dropped card to return to
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

    // --- NEW DRAG/SWIPE LOGIC ---
    let isDragging = false;
    let startY = 0;
    let elFront = null;
    let originalY = 0;

    const handlePointerDown = (e) => {
      // Prevent drag if an animation is actively playing
      if (tlRef.current?.isActive() || order.current.length < 2) return;
      
      isDragging = true;
      startY = e.clientY;
      const frontIdx = order.current[0];
      elFront = refs[frontIdx].current;
      
      // Store the exact Y position so we can snap back to it if swipe fails
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

      // If user dragged more than 80px down, trigger the swap!
      if (deltaY > 80) {
        swap();
      } else {
        // Otherwise, visually snap the card back into place
        gsap.to(elFront, { 
          y: originalY, 
          duration: 0.4, 
          ease: "back.out(1.5)" 
        });
      }
      
      elFront = null;
    };

    const node = container.current;
    
    // Attach event listeners
    node.addEventListener("pointerdown", handlePointerDown);
    // Attaching move/up to window prevents dropping the drag if the user swipes fast off the card
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

  // Added touch-none to prevent browser scroll when trying to swipe, and cursor hints
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