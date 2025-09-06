"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, AlertTriangle, RotateCcw, Download, Clock, TrendingUp, Shield, AlertCircle } from "lucide-react"
import type { PredictionResult } from "@/lib/prediction-client"
import { cn } from "@/lib/utils"

interface PredictionResultsProps {
  result: PredictionResult
  onAnalyzeAnother: () => void
  onExportResults?: () => void
}

export function PredictionResults({ result, onAnalyzeAnother, onExportResults }: PredictionResultsProps) {
  const isBenign = result.prediction === "benign"
  const isHighConfidence = result.confidence >= 80

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600"
    if (confidence >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getRiskBadgeVariant = (riskLevel: string) => {
    return riskLevel === "low" ? "default" : "destructive"
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Result Card */}
      <Card className={cn("border-2", isBenign ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50")}>
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            {isBenign ? (
              <CheckCircle className="h-16 w-16 text-green-600" />
            ) : (
              <AlertTriangle className="h-16 w-16 text-red-600" />
            )}
          </div>
          <CardTitle className={cn("text-3xl font-bold text-balance", isBenign ? "text-green-700" : "text-red-700")}>
            {result.prediction.toUpperCase()}
          </CardTitle>
          <CardDescription className="text-lg">
            The analysis indicates this sample is classified as{" "}
            <span className={cn("font-semibold", isBenign ? "text-green-600" : "text-red-600")}>
              {result.prediction}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Confidence and Risk Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Confidence Level</span>
                <span className={cn("text-sm font-bold", getConfidenceColor(result.confidence))}>
                  {result.confidence.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={result.confidence}
                className={cn("h-3", result.confidence >= 80 ? "bg-green-100" : "bg-yellow-100")}
              />
              <p className="text-xs text-muted-foreground">
                {isHighConfidence ? "High confidence prediction" : "Moderate confidence - consider additional testing"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Level</span>
                <Badge variant={getRiskBadgeVariant(result.riskLevel)} className="capitalize">
                  {result.riskLevel} Risk
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {result.riskLevel === "low" ? (
                  <Shield className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                {result.riskLevel === "low" ? "Low probability of malignancy" : "Elevated probability of malignancy"}
              </div>
            </div>
          </div>

          <Separator />

          {/* Detailed Probabilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Detailed Analysis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-green-700">Benign Probability</span>
                    <span className="text-2xl font-bold text-green-600">{result.probabilities.benign.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.probabilities.benign} className="bg-green-100" />
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-red-700">Malignant Probability</span>
                    <span className="text-2xl font-bold text-red-600">
                      {result.probabilities.malignant.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={result.probabilities.malignant} className="bg-red-100" />
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Timestamp and Metadata */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Analysis completed on {formatDate(result.timestamp)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={onAnalyzeAnother} className="flex items-center gap-2 flex-1">
              <RotateCcw className="h-4 w-4" />
              Analyze Another Sample
            </Button>

            {onExportResults && (
              <Button variant="outline" onClick={onExportResults} className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export Results
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Clinical Considerations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Important Notice</h4>
            <p className="text-sm text-blue-700">
              This prediction is based on machine learning analysis and should be used as a supplementary tool only.
              Always consult with qualified medical professionals for proper diagnosis and treatment decisions.
            </p>
          </div>

          {!isHighConfidence && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Moderate Confidence</h4>
              <p className="text-sm text-yellow-700">
                The confidence level for this prediction is moderate. Consider additional testing or consultation with
                specialists for a more definitive assessment.
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• This analysis is based on cell nucleus measurements from fine needle aspirate (FNA)</p>
            <p>• Results should be interpreted in conjunction with clinical findings and patient history</p>
            <p>• For research and educational purposes - not for clinical diagnosis</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
