import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

const PATH_VARIANTS = {
  normal: { opacity: 1 },
  animate: (i) => ({
    opacity: [0.15, 1, 1, 0.15],
    transition: {
      delay: i * 0.09,
      duration: 1.8,
      repeat: Infinity,
      times: [0, 0.25, 0.75, 1],
      ease: "easeInOut",
    },
  }),
};

export const MessageSquareDashedIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 24, continuous = true, ...props }, ref) => {
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
          animate={{
            scale: [1, 1.04, 1],
            transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
          }}
          fill="none"
          height={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width={size}
          xmlns="http://www.w3.org/2000/svg"
        >
          {[
            "M14 3h1",
            "M14 17h1",
            "M10 17H7l-4 4v-7",
            "M9 3h1",
            "M19 3a2 2 0 0 1 2 2",
            "M3 9v1",
            "M21 9v1",
            "M21 14v1a2 2 0 0 1-2 2",
            "M5 3a2 2 0 0 0-2 2",
          ].map((d, index) => (
            <motion.path
              animate={controls}
              custom={index + 1}
              d={d}
              key={d}
              variants={PATH_VARIANTS}
            />
          ))}
        </motion.svg>
      </div>
    );
  }
);

MessageSquareDashedIcon.displayName = "MessageSquareDashedIcon";
export default MessageSquareDashedIcon;
