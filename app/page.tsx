"use client"

import { useState } from "react"
import { AppHeader } from "@/components/app-header"
import { PredictionForm } from "@/components/prediction-form"
import { SampleDataLoader } from "@/components/sample-data-loader"
import { LoadingAnalysis } from "@/components/loading-analysis"
import { PredictionResults } from "@/components/prediction-results"
import { makePrediction, type PredictionResult } from "@/lib/prediction-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type AppState = "form" | "loading" | "results"

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>("form")
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFormSubmit = async (features: number[]) => {
    setIsLoading(true)
    setAppState("loading")

    try {
      const result = await makePrediction(features)
      setPredictionResult(result)
      setAppState("results")

      toast({
        title: "Analysis Complete",
        description: `Sample classified as ${result.prediction} with ${result.confidence.toFixed(1)}% confidence`,
      })
    } catch (error) {
      console.error("Prediction failed:", error)
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
      setAppState("form")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSampleLoad = (features: number[]) => {
    handleFormSubmit(features)
  }

  const handleAnalyzeAnother = () => {
    setAppState("form")
    setPredictionResult(null)
  }

  const handleExportResults = () => {
    if (!predictionResult) return

    const exportData = {
      prediction: predictionResult.prediction,
      confidence: predictionResult.confidence,
      probabilities: predictionResult.probabilities,
      riskLevel: predictionResult.riskLevel,
      timestamp: predictionResult.timestamp,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `breast-cancer-analysis-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Results Exported",
      description: "Analysis results have been downloaded as JSON file",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {appState === "form" && (
          <>
            {/* Introduction Section */}
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-balance">Cell Analysis Input</CardTitle>
                  <CardDescription className="text-pretty">
                    Enter the 30 numerical measurements from fine needle aspirate (FNA) of breast mass cells. Our
                    machine learning model will analyze these features to predict whether the sample is benign or
                    malignant.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">How to Use</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Fill in all 30 feature measurements in the multi-step form</li>
                      <li>• Use the sample data buttons below for quick testing</li>
                      <li>• Review results with confidence scores and risk assessment</li>
                      <li>• Export results for record keeping</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Data Loader */}
              <SampleDataLoader onLoadSample={handleSampleLoad} disabled={isLoading} />

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-sm text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>

              {/* Manual Input Form */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle>Manual Input</CardTitle>
                  </div>
                  <CardDescription>Enter measurements manually using the step-by-step form</CardDescription>
                </CardHeader>
                <CardContent>
                  <PredictionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {appState === "loading" && <LoadingAnalysis message="Analyzing cell measurements..." />}

        {appState === "results" && predictionResult && (
          <PredictionResults
            result={predictionResult}
            onAnalyzeAnother={handleAnalyzeAnother}
            onExportResults={handleExportResults}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Disclaimer:</strong> This tool is for research and educational purposes only. Not intended for
              clinical diagnosis or medical decision-making.
            </p>
            <p>Always consult qualified healthcare professionals for medical advice and diagnosis.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
