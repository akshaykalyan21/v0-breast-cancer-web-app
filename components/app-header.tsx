"use client"

import { Activity, Brain, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AppHeader() {
  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance">Breast Cancer Detection</h1>
              <p className="text-sm text-muted-foreground">ML-powered cell analysis tool</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Research & Educational Use</span>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">30 Feature Analysis</div>
                <div className="text-xs text-muted-foreground">Comprehensive cell measurements</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Brain className="h-5 w-5 text-secondary" />
              <div>
                <div className="font-medium text-sm">ML Prediction</div>
                <div className="text-xs text-muted-foreground">Logistic regression model</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="h-5 w-5 text-accent" />
              <div>
                <div className="font-medium text-sm">Confidence Scoring</div>
                <div className="text-xs text-muted-foreground">Risk assessment included</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </header>
  )
}
