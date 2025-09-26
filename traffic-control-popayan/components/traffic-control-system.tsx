"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { MapComponent } from "./map-component"
import { TrafficLightPanel } from "./traffic-light-panel"
import { MonitoringDashboard } from "./monitoring-dashboard"
import { EDFAlerts } from "./edf-alerts"
import { Clock, MapPin, Activity, AlertTriangle } from "lucide-react"

export function TrafficControlSystem() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Sistema de Control de Tráfico</h1>
                <p className="text-muted-foreground">Popayán, Colombia</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-mono">{currentTime.toLocaleTimeString("es-CO")}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">En línea</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        {/* Map Section - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[60%] p-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Mapa en Tiempo Real</h2>
              <div className="ml-auto flex items-center gap-2">
                <div className="h-2 w-2 bg-accent rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">Waze API</span>
              </div>
            </div>
            <MapComponent />
          </Card>

          <Card className="h-[35%] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Panel de Semáforos</h2>
            </div>
            <TrafficLightPanel />
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="h-[45%] p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold">Monitoreo</h2>
            </div>
            <MonitoringDashboard />
          </Card>

          <Card className="h-[50%] p-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h2 className="text-lg font-semibold">Alertas EDF</h2>
            </div>
            <EDFAlerts />
          </Card>
        </div>
      </div>
    </div>
  )
}
