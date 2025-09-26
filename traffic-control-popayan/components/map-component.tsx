"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertCircle, Clock } from "lucide-react"

interface TrafficData {
  location: string
  congestionLevel: "low" | "medium" | "high"
  speed: number
  incidents: number
  coordinates: { lat: number; lng: number }
}

interface WazeAlert {
  id: string
  type: "accident" | "construction" | "police" | "hazard"
  location: string
  severity: "low" | "medium" | "high"
  timestamp: Date
}

export function MapComponent() {
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])
  const [wazeAlerts, setWazeAlerts] = useState<WazeAlert[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  // Simulate real-time traffic data from Waze API
  useEffect(() => {
    const mockTrafficData: TrafficData[] = [
      {
        location: "Centro Histórico",
        congestionLevel: "high",
        speed: 15,
        incidents: 3,
        coordinates: { lat: 2.4448, lng: -76.6147 },
      },
      {
        location: "Av. Panamericana",
        congestionLevel: "medium",
        speed: 35,
        incidents: 1,
        coordinates: { lat: 2.4389, lng: -76.6125 },
      },
      {
        location: "Sector Universidad",
        congestionLevel: "low",
        speed: 45,
        incidents: 0,
        coordinates: { lat: 2.4532, lng: -76.6089 },
      },
      {
        location: "Terminal de Transportes",
        congestionLevel: "medium",
        speed: 28,
        incidents: 2,
        coordinates: { lat: 2.4298, lng: -76.6234 },
      },
    ]

    const mockAlerts: WazeAlert[] = [
      {
        id: "1",
        type: "accident",
        location: "Puente del Humilladero",
        severity: "high",
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: "2",
        type: "construction",
        location: "Calle 5 con Carrera 9",
        severity: "medium",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        id: "3",
        type: "police",
        location: "Av. Panamericana Norte",
        severity: "low",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      },
    ]

    setTrafficData(mockTrafficData)
    setWazeAlerts(mockAlerts)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setTrafficData((prev) =>
        prev.map((item) => ({
          ...item,
          speed: Math.max(10, item.speed + (Math.random() - 0.5) * 10),
          congestionLevel: Math.random() > 0.7 ? (Math.random() > 0.5 ? "high" : "medium") : item.congestionLevel,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "accident":
        return "🚗"
      case "construction":
        return "🚧"
      case "police":
        return "👮"
      case "hazard":
        return "⚠️"
      default:
        return "📍"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map Container */}
      <div className="flex-1 relative bg-muted/20 rounded-lg border overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30">
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="text-muted-foreground/20">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Traffic Points */}
        {trafficData.map((location, index) => (
          <div
            key={location.location}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-110 ${
              selectedLocation === location.location ? "z-20" : "z-10"
            }`}
            style={{
              left: `${20 + index * 20}%`,
              top: `${30 + (index % 2) * 25}%`,
            }}
            onClick={() => setSelectedLocation(selectedLocation === location.location ? null : location.location)}
          >
            <div className="relative">
              <div className={`w-4 h-4 rounded-full ${getCongestionColor(location.congestionLevel)} animate-pulse`} />
              <div
                className={`absolute -inset-2 rounded-full ${getCongestionColor(location.congestionLevel)} opacity-30 animate-ping`}
              />

              {selectedLocation === location.location && (
                <Card className="absolute top-6 left-1/2 transform -translate-x-1/2 p-3 min-w-48 z-30">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{location.location}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Velocidad:</span>
                        <span className="ml-1 font-mono">{Math.round(location.speed)} km/h</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Incidentes:</span>
                        <span className="ml-1 font-mono">{location.incidents}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        location.congestionLevel === "high"
                          ? "destructive"
                          : location.congestionLevel === "medium"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs"
                    >
                      {location.congestionLevel === "high"
                        ? "Alto tráfico"
                        : location.congestionLevel === "medium"
                          ? "Tráfico moderado"
                          : "Flujo normal"}
                    </Badge>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ))}

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border">
          <div className="text-xs font-medium mb-2 text-foreground">Nivel de Congestión</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs text-muted-foreground">Flujo normal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-xs text-muted-foreground">Tráfico moderado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">Alto tráfico</span>
            </div>
          </div>
        </div>

        {/* Waze Alerts Overlay */}
        <div className="absolute top-4 right-4 space-y-2 max-w-64">
          {wazeAlerts.slice(0, 3).map((alert) => (
            <Card key={alert.id} className="p-2 bg-card/90 backdrop-blur-sm">
              <div className="flex items-start gap-2">
                <span className="text-sm">{getAlertIcon(alert.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                      {alert.type === "accident"
                        ? "Accidente"
                        : alert.type === "construction"
                          ? "Construcción"
                          : alert.type === "police"
                            ? "Policía"
                            : "Peligro"}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground truncate">{alert.location}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      hace {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)} min
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Controls */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Popayán, Cauca</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">{wazeAlerts.length} alertas activas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
          <span className="text-muted-foreground">Actualización en tiempo real</span>
        </div>
      </div>
    </div>
  )
}
