import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Search, X, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const enhancedInputVariants = cva(
  "flex w-full rounded-md border border-input bg-background text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "h-9 px-3 py-1",
        filled: "h-9 px-3 py-1 bg-muted border-transparent focus-visible:bg-background focus-visible:border-input",
        floating: "h-12 px-3 pt-4 pb-1 border-2",
        underline: "h-9 px-0 py-1 border-0 border-b-2 border-input rounded-none bg-transparent focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
        search: "h-9 pl-10 pr-4 py-1 rounded-full",
        ghost: "h-9 px-3 py-1 border-transparent bg-transparent hover:bg-muted focus-visible:bg-background focus-visible:border-input"
      },
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-9 px-3",
        lg: "h-10 px-4 text-base",
        xl: "h-12 px-4 text-lg"
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default"
    }
  }
);

export interface EnhancedInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof enhancedInputVariants> {
  label?: string;
  helperText?: string;
  errorText?: string;
  successText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  loading?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
}

const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({
    className,
    containerClassName,
    labelClassName,
    helperClassName,
    variant,
    size,
    state,
    type = "text",
    label,
    helperText,
    errorText,
    successText,
    leftIcon,
    rightIcon,
    clearable = false,
    showPasswordToggle = false,
    loading = false,
    value,
    onChange,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value || "");
    
    const inputType = type === "password" && showPassword ? "text" : type;
    const hasValue = Boolean(internalValue);
    
    // Determine current state
    const currentState = errorText ? "error" : successText ? "success" : state;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };
    
    const handleClear = () => {
      setInternalValue("");
      if (onChange) {
        const event = {
          target: { value: "" }
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
    };
    
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const shouldShowLeftIcon = leftIcon || (variant === "search" && <Search className="w-4 h-4 text-muted-foreground" />);
    const shouldShowRightIcon = rightIcon || 
      (clearable && hasValue && !disabled && <X className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" onClick={handleClear} />) ||
      (showPasswordToggle && type === "password" && (
        showPassword ? 
          <EyeOff className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" onClick={togglePasswordVisibility} /> :
          <Eye className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" onClick={togglePasswordVisibility} />
      ));

    return (
      <div className={cn("relative", containerClassName)}>
        {/* Floating Label */}
        {label && variant === "floating" && (
          <motion.label
            className={cn(
              "absolute left-3 text-muted-foreground pointer-events-none transition-all duration-200",
              (isFocused || hasValue) ? "top-2 text-xs" : "top-1/2 -translate-y-1/2 text-sm",
              currentState === "error" && "text-destructive",
              currentState === "success" && "text-green-500",
              labelClassName
            )}
            animate={{
              y: (isFocused || hasValue) ? -8 : 0,
              scale: (isFocused || hasValue) ? 0.85 : 1,
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        {/* Regular Label */}
        {label && variant !== "floating" && (
          <label className={cn(
            "block text-sm font-medium mb-2",
            currentState === "error" && "text-destructive",
            currentState === "success" && "text-green-500",
            labelClassName
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Left Icon */}
          {shouldShowLeftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              {shouldShowLeftIcon}
            </div>
          )}
          
          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              enhancedInputVariants({ variant, size, state: currentState, className }),
              shouldShowLeftIcon && "pl-10",
              (shouldShowRightIcon || loading) && "pr-10",
              variant === "floating" && hasValue && "pt-6"
            )}
            value={internalValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            {...props}
          />
          
          {/* Right Icon */}
          {shouldShowRightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
              {shouldShowRightIcon}
            </div>
          )}
          
          {/* Loading Spinner */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <motion.div
                className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>
        
        {/* Helper/Error/Success Text */}
        <AnimatePresence mode="wait">
          {(helperText || errorText || successText) && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center gap-1 mt-1 text-xs",
                currentState === "error" && "text-destructive",
                currentState === "success" && "text-green-500",
                currentState === "default" && "text-muted-foreground",
                helperClassName
              )}
            >
              {currentState === "error" && <AlertCircle className="w-3 h-3" />}
              {currentState === "success" && <CheckCircle className="w-3 h-3" />}
              <span>{errorText || successText || helperText}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";

export { EnhancedInput, enhancedInputVariants };