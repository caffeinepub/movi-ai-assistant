import { motion } from "motion/react";

interface MoviOrbProps {
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const sizeMap = {
  sm: 80,
  md: 140,
  lg: 200,
};

export function MoviOrb({ size = "lg", animated = true }: MoviOrbProps) {
  const px = sizeMap[size];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: px, height: px }}
    >
      {/* Outer glow rings */}
      {animated && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.58 0.28 290 / 0.15) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.80 0.18 195 / 0.1) 0%, transparent 70%)",
            }}
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{
              duration: 3.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Main orb */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: px * 0.75,
          height: px * 0.75,
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.72 0.24 270), oklch(0.55 0.28 290), oklch(0.45 0.26 310))",
          boxShadow:
            "0 0 30px oklch(0.58 0.28 290 / 0.6), 0 0 60px oklch(0.80 0.18 195 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.2)",
        }}
        animate={
          animated
            ? {
                boxShadow: [
                  "0 0 30px oklch(0.58 0.28 290 / 0.6), 0 0 60px oklch(0.80 0.18 195 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.2)",
                  "0 0 50px oklch(0.62 0.26 320 / 0.7), 0 0 90px oklch(0.80 0.18 195 / 0.4), inset 0 1px 0 oklch(1 0 0 / 0.2)",
                  "0 0 30px oklch(0.58 0.28 290 / 0.6), 0 0 60px oklch(0.80 0.18 195 / 0.3), inset 0 1px 0 oklch(1 0 0 / 0.2)",
                ],
              }
            : {}
        }
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Inner highlight */}
        <div
          className="absolute rounded-full"
          style={{
            width: "40%",
            height: "40%",
            top: "15%",
            left: "15%",
            background:
              "radial-gradient(circle, oklch(1 0 0 / 0.3) 0%, transparent 100%)",
          }}
        />
        {/* MOVI text */}
        <span
          className="relative z-10 font-display font-bold tracking-widest text-white select-none"
          style={{ fontSize: px * 0.14 }}
        >
          MOVI
        </span>
      </motion.div>
    </div>
  );
}
