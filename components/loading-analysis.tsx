"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Zap, Search, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface LoadingAnalysisProps {
  message?: string
}

const ANALYSIS_STEPS = [
  { icon: Search, label: "Processing input data", duration: 1000 },
  { icon: Brain, label: "Running ML analysis", duration: 1500 },
  { icon: Zap, label: "Calculating probabilities", duration: 800 },
  { icon: CheckCircle, label: "Generating results", duration: 700 },
]

export function LoadingAnalysis({ message = "Analyzing sample..." }: LoadingAnalysisProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = ANALYSIS_STEPS.reduce((sum, step) => sum + step.duration, 0)
    let elapsed = 0

    const interval = setInterval(() => {
      elapsed += 100
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(newProgress)

      // Update current step based on elapsed time
      let stepElapsed = 0
      for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
        stepElapsed += ANALYSIS_STEPS[i].duration
        if (elapsed <= stepElapsed) {
          setCurrentStep(i)
          break
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardContent className="p-8 space-y-6">
          {/* Main Loading Message */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Brain className="h-12 w-12 text-primary animate-pulse" />
                <div className="absolute -top-1 -right-1">
                  <Zap className="h-6 w-6 text-secondary animate-bounce" />
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-balance">{message}</h2>
            <p className="text-muted-foreground">
              Please wait while we process your data through our machine learning model
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Analysis Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Analysis Steps */}
          <div className="space-y-3">
            {ANALYSIS_STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/10 border border-primary/20"
                      : isCompleted
                        ? "bg-green-50 border border-green-200"
                        : "bg-muted/50"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isActive ? "text-primary animate-pulse" : isCompleted ? "text-green-600" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isActive ? "text-primary font-medium" : isCompleted ? "text-green-700" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCompleted && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
