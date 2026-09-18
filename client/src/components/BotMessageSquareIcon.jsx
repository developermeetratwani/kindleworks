import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export const BotMessageSquareIcon = forwardRef(
  ({ className, onMouseEnter, onMouseLeave, size = 28, continuous = true, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useEffect(() => {
      if (continuous) {
        controls.start("animate");
      }
    }, [continuous, controls]);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else if (!continuous) {
          controls.start("animate");
        }
      },
      [controls, continuous, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else if (!continuous) {
          controls.start("normal");
        }
      },
      [controls, continuous, onMouseLeave]
    );

    return (
      <div
        className={cn("inline-flex items-center justify-center", className)}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.svg
          animate={controls}
          fill="none"
          height={size}
          initial="animate"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          variants={{
            normal: { rotate: 0, y: 0, scale: 1 },
            animate: {
              rotate: [0, -3, 3, -1, 0],
              y: [0, -1.5, 1.5, -0.5, 0],
              scale: [1, 1.04, 0.98, 1.02, 1],
              transition: {
                duration: 2.8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              },
            },
          }}
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <path d="M12 6V2H8" />
          {/* Left ear */}
          <path d="M2 12h2" />
          {/* Right ear */}
          <path d="M20 12h2" />

          {/* Bot Body */}
          <motion.path
            d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"
            variants={{
              normal: { scale: 1, originX: 0.5, originY: 0.5 },
              animate: {
                scale: [1, 1.03, 0.99, 1.02, 1],
                transition: {
                  duration: 2.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                },
              },
            }}
          />

          {/* Left Eye (Blinking) */}
          <motion.path
            d="M9 11v2"
            variants={{
              normal: { scaleY: 1, originY: 0.5 },
              animate: {
                scaleY: [1, 1, 0.1, 1, 1, 1],
                transition: {
                  duration: 2.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  times: [0, 0.35, 0.4, 0.45, 0.8, 1],
                  delay: 0.1,
                },
              },
            }}
          />

          {/* Right Eye (Blinking) */}
          <motion.path
            d="M15 11v2"
            variants={{
              normal: { scaleY: 1, originY: 0.5 },
              animate: {
                scaleY: [1, 1, 0.1, 1, 1, 1],
                transition: {
                  duration: 2.8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  times: [0, 0.35, 0.4, 0.45, 0.8, 1],
                  delay: 0.1,
                },
              },
            }}
          />

          {/* Dot 1 */}
          <motion.circle
            cx="10"
            cy="18"
            r="0.5"
            variants={{
              normal: { opacity: 0.3 },
              animate: {
                opacity: [0.2, 1, 0.2],
                transition: {
                  repeat: Infinity,
                  duration: 1.4,
                  delay: 0,
                  ease: "easeInOut",
                },
              },
            }}
          />

          {/* Dot 2 */}
          <motion.circle
            cx="12"
            cy="18"
            r="0.5"
            variants={{
              normal: { opacity: 0.3 },
              animate: {
                opacity: [0.2, 1, 0.2],
                transition: {
                  repeat: Infinity,
                  duration: 1.4,
                  delay: 0.35,
                  ease: "easeInOut",
                },
              },
            }}
          />

          {/* Dot 3 */}
          <motion.circle
            cx="14"
            cy="18"
            r="0.5"
            variants={{
              normal: { opacity: 0.3 },
              animate: {
                opacity: [0.2, 1, 0.2],
                transition: {
                  repeat: Infinity,
                  duration: 1.4,
                  delay: 0.7,
                  ease: "easeInOut",
                },
              },
            }}
          />
        </motion.svg>
      </div>
    );
  }
);

BotMessageSquareIcon.displayName = "BotMessageSquareIcon";
export default BotMessageSquareIcon;
