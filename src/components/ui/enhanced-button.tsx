import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-95",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/70 active:scale-95",
        glassmorphism: "bg-white/10 backdrop-blur-md border border-white/20 text-foreground shadow-lg hover:bg-white/20 active:scale-95"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  ripple?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      ripple = false,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [rippleEffect, setRippleEffect] = React.useState<{
      x: number;
      y: number;
      id: number;
    } | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setRippleEffect({ x, y, id: Date.now() });
        setTimeout(() => setRippleEffect(null), 600);
      }

      if (onClick && !disabled && !loading) {
        onClick(event);
      }
    };

    if (asChild) {
      return (
        <button
          ref={ref}
          className={cn(enhancedButtonVariants({ variant, size, className }))}
          onClick={handleClick}
          disabled={disabled || loading}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <div>
        {rippleEffect && (
          <motion.span
            key={rippleEffect.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: rippleEffect.x - 10,
              top: rippleEffect.y - 10,
              width: 20,
              height: 20
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}

        {loading && <Loader2 className="animate-spin" />}
        {!loading && leftIcon}

        <span className={loading ? "opacity-70" : ""}>
          {loading && loadingText ? loadingText : children}
        </span>

        {!loading && rightIcon}
      </div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, enhancedButtonVariants };
