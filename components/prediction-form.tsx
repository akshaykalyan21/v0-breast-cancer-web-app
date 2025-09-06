"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Activity, AlertCircle } from "lucide-react"
import { FEATURE_DESCRIPTIONS } from "@/lib/prediction-client"
import { cn } from "@/lib/utils"

interface FormData {
  [key: string]: string
}

interface FormStep {
  title: string
  description: string
  fields: Array<{
    name: string
    label: string
    description?: string
    placeholder: string
  }>
}

const FORM_STEPS: FormStep[] = [
  {
    title: "Mean Measurements",
    description: "Average values of cell nucleus measurements",
    fields: [
      {
        name: "mean_radius",
        label: "Mean Radius",
        description: FEATURE_DESCRIPTIONS["mean radius"],
        placeholder: "e.g., 14.13",
      },
      {
        name: "mean_texture",
        label: "Mean Texture",
        description: FEATURE_DESCRIPTIONS["mean texture"],
        placeholder: "e.g., 19.81",
      },
      {
        name: "mean_perimeter",
        label: "Mean Perimeter",
        description: FEATURE_DESCRIPTIONS["mean perimeter"],
        placeholder: "e.g., 90.2",
      },
      {
        name: "mean_area",
        label: "Mean Area",
        description: FEATURE_DESCRIPTIONS["mean area"],
        placeholder: "e.g., 577.9",
      },
      {
        name: "mean_smoothness",
        label: "Mean Smoothness",
        description: FEATURE_DESCRIPTIONS["mean smoothness"],
        placeholder: "e.g., 0.119",
      },
      {
        name: "mean_compactness",
        label: "Mean Compactness",
        description: FEATURE_DESCRIPTIONS["mean compactness"],
        placeholder: "e.g., 0.164",
      },
      {
        name: "mean_concavity",
        label: "Mean Concavity",
        description: FEATURE_DESCRIPTIONS["mean concavity"],
        placeholder: "e.g., 0.093",
      },
      {
        name: "mean_concave_points",
        label: "Mean Concave Points",
        description: FEATURE_DESCRIPTIONS["mean concave points"],
        placeholder: "e.g., 0.054",
      },
      {
        name: "mean_symmetry",
        label: "Mean Symmetry",
        description: FEATURE_DESCRIPTIONS["mean symmetry"],
        placeholder: "e.g., 0.193",
      },
      {
        name: "mean_fractal_dimension",
        label: "Mean Fractal Dimension",
        description: FEATURE_DESCRIPTIONS["mean fractal dimension"],
        placeholder: "e.g., 0.064",
      },
    ],
  },
  {
    title: "Standard Error Measurements",
    description: "Standard error values of cell nucleus measurements",
    fields: [
      { name: "radius_error", label: "Radius Error", placeholder: "e.g., 0.427" },
      { name: "texture_error", label: "Texture Error", placeholder: "e.g., 1.216" },
      { name: "perimeter_error", label: "Perimeter Error", placeholder: "e.g., 2.868" },
      { name: "area_error", label: "Area Error", placeholder: "e.g., 40.34" },
      { name: "smoothness_error", label: "Smoothness Error", placeholder: "e.g., 0.007" },
      { name: "compactness_error", label: "Compactness Error", placeholder: "e.g., 0.025" },
      { name: "concavity_error", label: "Concavity Error", placeholder: "e.g., 0.038" },
      { name: "concave_points_error", label: "Concave Points Error", placeholder: "e.g., 0.015" },
      { name: "symmetry_error", label: "Symmetry Error", placeholder: "e.g., 0.024" },
      { name: "fractal_dimension_error", label: "Fractal Dimension Error", placeholder: "e.g., 0.005" },
    ],
  },
  {
    title: "Worst Case Measurements",
    description: "Worst (largest) values of cell nucleus measurements",
    fields: [
      { name: "worst_radius", label: "Worst Radius", placeholder: "e.g., 16.27" },
      { name: "worst_texture", label: "Worst Texture", placeholder: "e.g., 26.58" },
      { name: "worst_perimeter", label: "Worst Perimeter", placeholder: "e.g., 108.1" },
      { name: "worst_area", label: "Worst Area", placeholder: "e.g., 858.1" },
      { name: "worst_smoothness", label: "Worst Smoothness", placeholder: "e.g., 0.173" },
      { name: "worst_compactness", label: "Worst Compactness", placeholder: "e.g., 0.305" },
      { name: "worst_concavity", label: "Worst Concavity", placeholder: "e.g., 0.245" },
      { name: "worst_concave_points", label: "Worst Concave Points", placeholder: "e.g., 0.124" },
      { name: "worst_symmetry", label: "Worst Symmetry", placeholder: "e.g., 0.280" },
      { name: "worst_fractal_dimension", label: "Worst Fractal Dimension", placeholder: "e.g., 0.089" },
    ],
  },
]

interface PredictionFormProps {
  onSubmit: (features: number[]) => void
  isLoading?: boolean
}

export function PredictionForm({ onSubmit, isLoading = false }: PredictionFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentStepData = FORM_STEPS[currentStep]
  const progress = ((currentStep + 1) / FORM_STEPS.length) * 100

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    currentStepData.fields.forEach((field) => {
      const value = formData[field.name]
      if (!value || value.trim() === "") {
        newErrors[field.name] = "This field is required"
        isValid = false
      } else {
        const numValue = Number.parseFloat(value)
        if (isNaN(numValue)) {
          newErrors[field.name] = "Please enter a valid number"
          isValid = false
        } else if (numValue < 0) {
          newErrors[field.name] = "Value must be positive"
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < FORM_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Convert form data to features array in the correct order
    const features: number[] = []

    FORM_STEPS.forEach((step) => {
      step.fields.forEach((field) => {
        const value = formData[field.name]
        features.push(Number.parseFloat(value))
      })
    })

    onSubmit(features)
  }

  const isLastStep = currentStep === FORM_STEPS.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Step {currentStep + 1} of {FORM_STEPS.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-balance">{currentStepData.title}</CardTitle>
          </div>
          <CardDescription className="text-pretty">{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentStepData.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </Label>
                {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
                <Input
                  id={field.name}
                  type="number"
                  step="any"
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className={cn(
                    "transition-colors",
                    errors[field.name] && "border-destructive focus-visible:ring-destructive",
                  )}
                  disabled={isLoading}
                />
                {errors[field.name] && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors[field.name]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstStep || isLoading}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button type="button" onClick={handleNext} disabled={isLoading} className="flex items-center gap-2">
              {isLastStep ? "Analyze Sample" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
