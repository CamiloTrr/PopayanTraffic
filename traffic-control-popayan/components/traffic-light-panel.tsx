"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Power, Settings, Clock } from "lucide-react"

interface TrafficLight {
  id: string
  location: string
  currentState: "green" | "yellow" | "red"
  timeRemaining: number
  totalCycleTime: number
  isEmergencyMode: boolean
  isOnline: boolean
  priority: number
}

export function TrafficLightPanel() {
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([])

  useEffect(() => {
    // Initialize traffic lights
    const initialLights: TrafficLight[] = [
      {
        id: "TL001",
        location: "Centro - Calle 5 con Carrera 6",
        currentState: "green",
        timeRemaining: 45,
        totalCycleTime: 60,
        isEmergencyMode: false,
        isOnline: true,
        priority: 1,
      },
      {
        id: "TL002",
        location: "Panamericana - Entrada Norte",
        currentState: "red",
        timeRemaining: 25,
        totalCycleTime: 90,
        isEmergencyMode: false,
        isOnline: true,
        priority: 2,
      },
      {
        id: "TL003",
        location: "Universidad - Carrera 9",
        currentState: "yellow",
        timeRemaining: 8,
        totalCycleTime: 45,
        isEmergencyMode: false,
        isOnline: true,
        priority: 3,
      },
      {
        id: "TL004",
        location: "Terminal - Av. Panamericana Sur",
        currentState: "green",
        timeRemaining: 35,
        totalCycleTime: 75,
        isEmergencyMode: true,
        isOnline: false,
        priority: 1,
      },
    ]

    setTrafficLights(initialLights)

    // Simulate real-time countdown and state changes
    const interval = setInterval(() => {
      setTrafficLights((prev) =>
        prev.map((light) => {
          if (!light.isOnline || light.isEmergencyMode) return light

          let newTimeRemaining = light.timeRemaining - 1
          let newState = light.currentState
          let newTotalCycleTime = light.totalCycleTime

          if (newTimeRemaining <= 0) {
            switch (light.currentState) {
              case "green":
                newState = "yellow"
                newTimeRemaining = 10
                newTotalCycleTime = 10
                break
              case "yellow":
                newState = "red"
                newTimeRemaining = Math.floor(Math.random() * 30) + 30
                newTotalCycleTime = newTimeRemaining
                break
              case "red":
                newState = "green"
                newTimeRemaining = Math.floor(Math.random() * 40) + 40
                newTotalCycleTime = newTimeRemaining
                break
            }
          }

          return {
            ...light,
            currentState: newState,
            timeRemaining: newTimeRemaining,
            totalCycleTime: newTotalCycleTime,
          }
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleEmergencyToggle = (lightId: string) => {
    setTrafficLights((prev) =>
      prev.map((light) => (light.id === lightId ? { ...light, isEmergencyMode: !light.isEmergencyMode } : light)),
    )
  }

  const getStateColor = (state: string, isActive = true) => {
    const opacity = isActive ? "" : " opacity-30"
    switch (state) {
      case "green":
        return `bg-green-500${opacity}`
      case "yellow":
        return `bg-yellow-500${opacity}`
      case "red":
        return `bg-red-500${opacity}`
      default:
        return `bg-gray-500${opacity}`
    }
  }

  const getStateText = (state: string) => {
    switch (state) {
      case "green":
        return "Verde"
      case "yellow":
        return "Amarillo"
      case "red":
        return "Rojo"
      default:
        return "Desconocido"
    }
  }

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "destructive"
      case 2:
        return "secondary"
      case 3:
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trafficLights.map((light) => (
          <Card key={light.id} className={`p-4 ${!light.isOnline ? "border-destructive/50" : ""}`}>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs font-mono">
                      {light.id}
                    </Badge>
                    <Badge variant={getPriorityColor(light.priority)} className="text-xs">
                      P{light.priority}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-foreground truncate">{light.location}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {light.isEmergencyMode && <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />}
                  <div
                    className={`h-2 w-2 rounded-full ${light.isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                  />
                </div>
              </div>

              {/* Traffic Light Visual */}
              <div className="flex items-center justify-center">
                <div className="bg-muted/50 rounded-lg p-3 border">
                  <div className="space-y-2">
                    <div
                      className={`w-8 h-8 rounded-full border-2 ${getStateColor(
                        "red",
                        light.currentState === "red" && light.isOnline,
                      )} ${light.currentState === "red" && light.isOnline ? "traffic-light-stop" : ""}`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full border-2 ${getStateColor(
                        "yellow",
                        light.currentState === "yellow" && light.isOnline,
                      )} ${light.currentState === "yellow" && light.isOnline ? "traffic-light-warning" : ""}`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full border-2 ${getStateColor(
                        "green",
                        light.currentState === "green" && light.isOnline,
                      )} ${light.currentState === "green" && light.isOnline ? "traffic-light-active" : ""}`}
                    />
                  </div>
                </div>
              </div>

              {/* Status Information */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estado actual:</span>
                  <Badge
                    variant={
                      light.currentState === "green"
                        ? "default"
                        : light.currentState === "yellow"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {getStateText(light.currentState)}
                  </Badge>
                </div>

                {light.isOnline && !light.isEmergencyMode && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tiempo restante:</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">{light.timeRemaining}s</span>
                        </div>
                      </div>
                      <Progress value={(light.timeRemaining / light.totalCycleTime) * 100} className="h-2" />
                    </div>
                  </>
                )}

                {light.isEmergencyMode && (
                  <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded border border-destructive/20">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm text-destructive">Modo de emergencia activo</span>
                  </div>
                )}

                {!light.isOnline && (
                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border">
                    <Power className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Semáforo desconectado</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  variant={light.isEmergencyMode ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => handleEmergencyToggle(light.id)}
                  disabled={!light.isOnline}
                  className="flex-1"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {light.isEmergencyMode ? "Desactivar" : "Emergencia"}
                </Button>

                <Button variant="outline" size="sm" disabled={!light.isOnline}>
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="mt-4 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-500">
              {trafficLights.filter((l) => l.isOnline && !l.isEmergencyMode).length}
            </div>
            <div className="text-xs text-muted-foreground">Operativos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-destructive">
              {trafficLights.filter((l) => l.isEmergencyMode).length}
            </div>
            <div className="text-xs text-muted-foreground">En emergencia</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-muted-foreground">
              {trafficLights.filter((l) => !l.isOnline).length}
            </div>
            <div className="text-xs text-muted-foreground">Desconectados</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">{trafficLights.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
