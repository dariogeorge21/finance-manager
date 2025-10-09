"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface LoadingProgressProps {
  /**
   * Progress value from 0 to 100
   */
  value?: number
  /**
   * Loading message to display
   */
  message?: string
  /**
   * Size variant for the progress bar
   */
  size?: "sm" | "md" | "lg"
  /**
   * Position variant for different use cases
   */
  variant?: "inline" | "centered" | "fixed-top" | "overlay"
  /**
   * Color theme to match different sections
   */
  theme?: "default" | "emerald" | "blue" | "rose"
  /**
   * Additional className for customization
   */
  className?: string
  /**
   * Whether to show the progress percentage
   */
  showPercentage?: boolean
  /**
   * Whether to animate the progress automatically
   */
  animated?: boolean
}

const LoadingProgress = React.forwardRef<
  HTMLDivElement,
  LoadingProgressProps
>(({ 
  value = 0, 
  message, 
  size = "md", 
  variant = "inline", 
  theme = "default",
  className,
  showPercentage = false,
  animated = false,
  ...props 
}, ref) => {
  const [animatedValue, setAnimatedValue] = React.useState(0)

  // Auto-animate progress when animated prop is true
  React.useEffect(() => {
    if (animated && value === 0) {
      const interval = setInterval(() => {
        setAnimatedValue(prev => {
          if (prev >= 90) return prev
          return prev + Math.random() * 15
        })
      }, 200)
      return () => clearInterval(interval)
    } else {
      setAnimatedValue(value)
    }
  }, [animated, value])

  const progressValue = animated ? animatedValue : value

  // Size classes
  const sizeClasses = {
    sm: "h-1",
    md: "h-2", 
    lg: "h-3"
  }

  // Theme classes for the progress indicator
  const themeClasses = {
    default: "bg-primary",
    emerald: "bg-emerald-600",
    blue: "bg-blue-600", 
    rose: "bg-gradient-to-r from-rose-500 to-pink-600"
  }

  // Variant-specific wrapper classes
  const variantClasses = {
    inline: "w-full",
    centered: "w-full max-w-md mx-auto",
    "fixed-top": "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm p-4",
    overlay: "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  }

  const progressBar = (
    <div className={cn("space-y-2", variantClasses[variant], className)} ref={ref} {...props}>
      {(message || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {message && (
            <span className="text-muted-foreground font-medium">{message}</span>
          )}
          {showPercentage && (
            <span className="text-muted-foreground font-mono">
              {Math.round(progressValue)}%
            </span>
          )}
        </div>
      )}
      <Progress
        value={progressValue}
        className={cn(
          sizeClasses[size],
          variant === "fixed-top" && "bg-muted/30"
        )}
        indicatorClassName={themeClasses[theme]}
      />
    </div>
  )

  // For overlay variant, wrap in overlay container
  if (variant === "overlay") {
    return (
      <div className={variantClasses[variant]}>
        <div className="bg-background rounded-lg p-6 shadow-lg max-w-md mx-4 w-full">
          {progressBar}
        </div>
      </div>
    )
  }

  return progressBar
})

LoadingProgress.displayName = "LoadingProgress"

/**
 * Simple inline loading indicator for buttons and small spaces
 */
const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  {
    size?: "sm" | "md" | "lg"
    theme?: "default" | "emerald" | "blue" | "rose" | "white"
    className?: string
  }
>(({ size = "sm", theme = "default", className, ...props }, ref) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  }

  const themeClasses = {
    default: "border-primary",
    emerald: "border-emerald-600",
    blue: "border-blue-600",
    rose: "border-rose-500",
    white: "border-white"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "animate-spin rounded-full border-2 border-transparent border-t-current",
        sizeClasses[size],
        themeClasses[theme],
        className
      )}
      {...props}
    />
  )
})

LoadingSpinner.displayName = "LoadingSpinner"

export { LoadingProgress, LoadingSpinner }
export type { LoadingProgressProps }
