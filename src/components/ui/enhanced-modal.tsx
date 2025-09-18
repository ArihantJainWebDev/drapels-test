import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const enhancedModalVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] max-h-[95vh]",
        auto: "max-w-fit"
      },
      variant: {
        default: "border-border",
        destructive: "border-destructive",
        success: "border-green-500",
        warning: "border-yellow-500",
        glassmorphism: "bg-background/80 backdrop-blur-md border-white/20",
        minimal: "border-0 shadow-2xl"
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default"
    }
  }
);

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: -20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    } as const
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.2
    } as const
  }
};

interface EnhancedModalProps extends VariantProps<typeof enhancedModalVariants> {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  animationType?: "fade" | "slide" | "scale" | "flip";
}

const EnhancedModal: React.FC<EnhancedModalProps> = ({
  children,
  open,
  onOpenChange,
  title,
  description,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  size,
  variant,
  className,
  overlayClassName,
  headerClassName,
  contentClassName,
  footerClassName,
  animationType = "scale"
}) => {
  const getAnimationVariants = () => {
    switch (animationType) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case "slide":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 50 }
        };
      case "flip":
        return {
          hidden: { opacity: 0, rotateX: -90 },
          visible: { opacity: 1, rotateX: 0 },
          exit: { opacity: 0, rotateX: 90 }
        };
      default:
        return modalVariants;
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* Overlay */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className={cn(
                  "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
                  overlayClassName
                )}
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={closeOnOverlayClick ? () => onOpenChange?.(false) : undefined}
              />
            </DialogPrimitive.Overlay>

            {/* Content */}
            <DialogPrimitive.Content
              asChild
              onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
            >
              <motion.div
                className={cn(
                  enhancedModalVariants({ size, variant }),
                  className
                )}
                variants={getAnimationVariants()}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                {(title || description || showCloseButton) && (
                  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", headerClassName)}>
                    <div className="flex items-center justify-between">
                      {title && (
                        <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                          {title}
                        </DialogPrimitive.Title>
                      )}
                      {showCloseButton && (
                        <DialogPrimitive.Close asChild>
                          <motion.button
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                          </motion.button>
                        </DialogPrimitive.Close>
                      )}
                    </div>
                    {description && (
                      <DialogPrimitive.Description className="text-sm text-muted-foreground">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className={cn("flex-1", contentClassName)}>
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

// Compound components for better composition
const EnhancedModalHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
    {children}
  </div>
);

const EnhancedModalTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <DialogPrimitive.Title className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
    {children}
  </DialogPrimitive.Title>
);

const EnhancedModalDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <DialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)}>
    {children}
  </DialogPrimitive.Description>
);

const EnhancedModalFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>
    {children}
  </div>
);

const EnhancedModalTrigger = DialogPrimitive.Trigger;
const EnhancedModalClose = DialogPrimitive.Close;

export {
  EnhancedModal,
  EnhancedModalHeader,
  EnhancedModalTitle,
  EnhancedModalDescription,
  EnhancedModalFooter,
  EnhancedModalTrigger,
  EnhancedModalClose,
  enhancedModalVariants
};