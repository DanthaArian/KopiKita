import { motion } from "framer-motion";

const variants = {
  primary:
    "border-cyan/80 bg-cyan text-asphalt shadow-neon hover:bg-white hover:text-asphalt",
  secondary:
    "border-white/20 bg-white/10 text-white hover:border-magenta/70 hover:bg-magenta/10 hover:text-magenta",
  danger:
    "border-danger/70 bg-danger/10 text-danger hover:bg-danger hover:text-white",
};

export default function GameButton({
  children,
  className = "",
  icon: Icon,
  variant = "secondary",
  ...props
}) {
  return (
    <motion.button
      className={`neon-button ${variants[variant]} ${className}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {children}
    </motion.button>
  );
}
