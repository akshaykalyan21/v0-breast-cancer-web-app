"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap } from "lucide-react"

interface SampleDataLoaderProps {
  onLoadSample: (features: number[]) => void
  disabled?: boolean
}

// Sample data from the original ML code
const SAMPLE_DATA = [
  13.54, 14.36, 87.46, 566.3, 0.09779, 0.08129, 0.06664, 0.04781, 0.1885, 0.05766, 0.2699, 0.7886, 2.058, 23.56,
  0.008462, 0.0146, 0.02387, 0.01315, 0.0198, 0.0023, 15.11, 19.26, 99.7, 711.2, 0.144, 0.1773, 0.239, 0.1288, 0.2977,
  0.07259,
]

const ADDITIONAL_SAMPLES = [
  // Benign sample
  [
    11.42, 20.38, 77.58, 386.1, 0.1425, 0.2839, 0.2414, 0.1052, 0.2597, 0.09744, 0.4956, 1.156, 3.445, 27.23, 0.00911,
    0.07458, 0.05661, 0.01867, 0.05963, 0.009208, 14.91, 26.5, 98.87, 567.7, 0.2098, 0.8663, 0.6869, 0.2575, 0.6638,
    0.173,
  ],
  // Malignant sample
  [
    20.57, 17.77, 132.9, 1326.0, 0.08474, 0.07864, 0.0869, 0.07017, 0.1812, 0.05667, 0.5435, 0.7339, 3.398, 74.08,
    0.005225, 0.01308, 0.0186, 0.0134, 0.01389, 0.003532, 24.99, 23.41, 158.8, 1956.0, 0.1238, 0.1866, 0.2416, 0.186,
    0.275, 0.08902,
  ],
]

export function SampleDataLoader({ onLoadSample, disabled = false }: SampleDataLoaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-secondary" />
          <CardTitle>Quick Test</CardTitle>
        </div>
        <CardDescription>Load sample data to test the prediction system quickly</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => onLoadSample(SAMPLE_DATA)}
            disabled={disabled}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <FileText className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium">Original Sample</div>
              <div className="text-xs text-muted-foreground">From training data</div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => onLoadSample(ADDITIONAL_SAMPLES[0])}
            disabled={disabled}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <FileText className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium">Benign Sample</div>
              <div className="text-xs text-muted-foreground">Expected: Low risk</div>
            </div>
          </Button>

          <Button
            variant="outline"
            onClick={() => onLoadSample(ADDITIONAL_SAMPLES[1])}
            disabled={disabled}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <FileText className="h-4 w-4" />
            <div className="text-center">
              <div className="font-medium">Malignant Sample</div>
              <div className="text-xs text-muted-foreground">Expected: High risk</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
