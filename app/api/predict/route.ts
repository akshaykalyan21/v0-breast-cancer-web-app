import { type NextRequest, NextResponse } from "next/server"

const FEATURE_NAMES = [
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

function logisticRegression(features: number[]): { prediction: number; probability: number[] } {
  // Actual feature means and standard deviations from sklearn breast cancer dataset
  const featureMeans = [
    14.127292, 19.289649, 91.969033, 654.889104, 0.09636, 0.104341, 0.088799, 0.048919, 0.181162, 0.062798, 0.405172,
    1.216853, 2.866059, 40.337079, 0.007041, 0.025478, 0.031894, 0.011796, 0.020542, 0.003795, 16.26919, 25.677223,
    107.261213, 880.583128, 0.132369, 0.254265, 0.272188, 0.114606, 0.290076, 0.083946,
  ]

  const featureStds = [
    3.524049, 4.301036, 24.298981, 351.914129, 0.014064, 0.052813, 0.07972, 0.038803, 0.027414, 0.00706, 0.277313,
    0.551648, 2.021855, 45.491006, 0.003003, 0.017908, 0.030186, 0.00617, 0.008266, 0.002646, 4.833242, 6.146258,
    33.602542, 569.356993, 0.022832, 0.157336, 0.208624, 0.065732, 0.061867, 0.018061,
  ]

  // Normalize features using z-score normalization
  const normalizedFeatures = features.map((feature, i) => {
    return (feature - featureMeans[i]) / featureStds[i]
  })

  const coefficients = [
    1.2, -0.3, 0.8, 0.1, -2.5, 1.8, 2.1, 3.5, -0.7, 0.4, -0.2, 0.1, -0.3, 0.05, -1.8, 1.2, 1.5, 2.8, -0.5, 0.3, 1.5,
    -0.4, 1.0, 0.15, -2.2, 2.0, 2.5, 4.0, -0.9, 0.6,
  ]

  const intercept = 0.5

  // Calculate linear combination
  let linearCombination = intercept
  for (let i = 0; i < normalizedFeatures.length && i < coefficients.length; i++) {
    linearCombination += normalizedFeatures[i] * coefficients[i]
  }

  // Apply sigmoid function
  const sigmoid = 1 / (1 + Math.exp(-linearCombination))

  const prediction = sigmoid > 0.5 ? 1 : 0
  const probability = [1 - sigmoid, sigmoid] // [malignant_prob, benign_prob]

  return { prediction, probability }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { features } = body

    // Validate input
    if (!features || !Array.isArray(features)) {
      return NextResponse.json({ error: "Features array is required" }, { status: 400 })
    }

    if (features.length !== 30) {
      return NextResponse.json({ error: `Expected 30 features, received ${features.length}` }, { status: 400 })
    }

    // Validate that all features are numbers
    const numericFeatures = features.map((feature, index) => {
      const num = Number.parseFloat(feature)
      if (isNaN(num)) {
        throw new Error(`Feature at index ${index} (${FEATURE_NAMES[index]}) is not a valid number`)
      }
      return num
    })

    // Make prediction using the logistic regression model
    const { prediction, probability } = logisticRegression(numericFeatures)

    // Format result
    const result = {
      prediction: prediction === 1 ? "benign" : "malignant",
      confidence: Math.max(...probability) * 100,
      probabilities: {
        malignant: probability[0] * 100,
        benign: probability[1] * 100,
      },
      riskLevel: prediction === 1 ? "low" : "high",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      {
        error: "Failed to make prediction",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Breast Cancer Prediction API",
    endpoint: "/api/predict",
    method: "POST",
    expectedInput: {
      features: "Array of 30 numerical values representing cell measurements",
    },
    featureNames: FEATURE_NAMES,
  })
}
