export interface PredictionInput {
  features: number[]
}

export interface PredictionResult {
  prediction: "benign" | "malignant"
  confidence: number
  probabilities: {
    malignant: number
    benign: number
  }
  riskLevel: "low" | "high"
  timestamp: string
}

export interface PredictionError {
  error: string
  details?: string
}

export async function makePrediction(features: number[]): Promise<PredictionResult> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ features }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to make prediction")
  }

  return data
}

export const FEATURE_NAMES = [
  "mean radius",
  "mean texture",
  "mean perimeter",
  "mean area",
  "mean smoothness",
  "mean compactness",
  "mean concavity",
  "mean concave points",
  "mean symmetry",
  "mean fractal dimension",
  "radius error",
  "texture error",
  "perimeter error",
  "area error",
  "smoothness error",
  "compactness error",
  "concavity error",
  "concave points error",
  "symmetry error",
  "fractal dimension error",
  "worst radius",
  "worst texture",
  "worst perimeter",
  "worst area",
  "worst smoothness",
  "worst compactness",
  "worst concavity",
  "worst concave points",
  "worst symmetry",
  "worst fractal dimension",
]

export const FEATURE_DESCRIPTIONS = {
  "mean radius": "Mean of distances from center to points on the perimeter",
  "mean texture": "Standard deviation of gray-scale values",
  "mean perimeter": "Mean size of the core tumor",
  "mean area": "Mean area of the core tumor",
  "mean smoothness": "Mean of local variation in radius lengths",
  "mean compactness": "Mean of perimeter^2 / area - 1.0",
  "mean concavity": "Mean of severity of concave portions of the contour",
  "mean concave points": "Mean for number of concave portions of the contour",
  "mean symmetry": "Mean symmetry of the tumor",
  "mean fractal dimension": 'Mean for "coastline approximation" - 1',
}
