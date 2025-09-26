"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Activity, Car, AlertCircle, Clock, TrendingUp } from "lucide-react"

interface VehicleFlowData {
  time: string
  vehicles: number
  avgSpeed: number
}

interface CongestionAlert {
  id: string
  location: string
  severity: "low" | "medium" | "high"
  timestamp: Date
  description: string
}

interface SystemEvent {
  id: string
  type: "traffic_light" | "system" | "alert" | "emergency"
  message: string
  timestamp: Date
  severity: "info" | "warning" | "error"
}

export function MonitoringDashboard() {
  const [vehicleFlowData, setVehicleFlowData] = useState<VehicleFlowData[]>([])
  const [congestionAlerts, setCongestionAlerts] = useState<CongestionAlert[]>([])
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([])
  const [currentStats, setCurrentStats] = useState({
    totalVehicles: 0,
    avgSpeed: 0,
    activeAlerts: 0,
    systemUptime: "99.8%",
  })

  useEffect(() => {
    // Initialize data
    const generateFlowData = () => {
      const data: VehicleFlowData[] = []
      const now = new Date()

      for (let i = 29; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000)
        data.push({
          time: time.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
          vehicles: Math.floor(Math.random() * 200) + 150,
          avgSpeed: Math.floor(Math.random() * 30) + 25,
        })
      }
      return data
    }

    const initialAlerts: CongestionAlert[] = [
      {
        id: "1",
        location: "Centro Histórico",
        severity: "high",
        timestamp: new Date(Date.now() - 5 * 60000),
        description: "Congestión severa detectada",
      },
      {
        id: "2",
        location: "Av. Panamericana Norte",
        severity: "medium",
        timestamp: new Date(Date.now() - 12 * 60000),
        description: "Tráfico lento por construcción",
      },
      {
        id: "3",
        location: "Terminal de Transportes",
        severity: "low",
        timestamp: new Date(Date.now() - 18 * 60000),
        description: "Flujo vehicular por encima del promedio",
      },
    ]

    const initialEvents: SystemEvent[] = [
      {
        id: "1",
        type: "traffic_light",
        message: "Semáforo TL001 cambió a modo emergencia",
        timestamp: new Date(Date.now() - 2 * 60000),
        severity: "warning",
      },
      {
        id: "2",
        type: "system",
        message: "Conexión con API de Waze restablecida",
        timestamp: new Date(Date.now() - 8 * 60000),
        severity: "info",
      },
      {
        id: "3",
        type: "alert",
        message: "Nueva alerta de congestión en Centro Histórico",
        timestamp: new Date(Date.now() - 15 * 60000),
        severity: "error",
      },
      {
        id: "4",
        type: "traffic_light",
        message: "Semáforo TL003 completó ciclo de mantenimiento",
        timestamp: new Date(Date.now() - 25 * 60000),
        severity: "info",
      },
      {
        id: "5",
        type: "emergency",
        message: "Protocolo de emergencia activado en zona centro",
        timestamp: new Date(Date.now() - 35 * 60000),
        severity: "error",
      },
    ]

    setVehicleFlowData(generateFlowData())
    setCongestionAlerts(initialAlerts)
    setSystemEvents(initialEvents)

    // Real-time updates
    const interval = setInterval(() => {
      setVehicleFlowData((prev) => {
        const newData = [...prev.slice(1)]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
          vehicles: Math.floor(Math.random() * 200) + 150,
          avgSpeed: Math.floor(Math.random() * 30) + 25,
        })
        return newData
      })

      // Update current stats
      setCurrentStats((prev) => ({
        ...prev,
        totalVehicles: Math.floor(Math.random() * 500) + 800,
        avgSpeed: Math.floor(Math.random() * 20) + 30,
        activeAlerts: Math.floor(Math.random() * 5) + 2,
      }))

      // Occasionally add new events
      if (Math.random() > 0.8) {
        const eventTypes = ["traffic_light", "system", "alert"]
        const severities = ["info", "warning", "error"]
        const messages = [
          "Actualización de estado de semáforo",
          "Sincronización con microservicios completada",
          "Detección de patrón de tráfico anómalo",
          "Optimización de ciclos de semáforos aplicada",
        ]

        const newEvent: SystemEvent = {
          id: Date.now().toString(),
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)] as any,
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
          severity: severities[Math.floor(Math.random() * severities.length)] as any,
        }

        setSystemEvents((prev) => [newEvent, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
      case "error":
        return "destructive"
      case "medium":
      case "warning":
        return "secondary"
      case "low":
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "traffic_light":
        return <Activity className="h-3 w-3" />
      case "system":
        return <TrendingUp className="h-3 w-3" />
      case "alert":
        return <AlertCircle className="h-3 w-3" />
      case "emergency":
        return <AlertCircle className="h-3 w-3 text-destructive" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000)
    if (minutes < 1) return "Ahora"
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  return (
    <div className="h-full space-y-4">
      {/* Real-time Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold">{currentStats.totalVehicles.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Vehículos/hora</div>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold">{currentStats.avgSpeed} km/h</div>
              <div className="text-xs text-muted-foreground">Velocidad prom.</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Vehicle Flow Chart */}
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Flujo Vehicular</h3>
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={vehicleFlowData}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "rgb(var(--muted-foreground))" }}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgb(var(--card))",
                  border: "1px solid rgb(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px",
                }}
              />
              <Line type="monotone" dataKey="vehicles" stroke="rgb(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Congestion Alerts */}
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h3 className="text-sm font-medium">Alertas de Congestión</h3>
        </div>
        <ScrollArea className="h-24">
          <div className="space-y-2">
            {congestionAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-2 p-2 rounded border bg-card/50">
                <Badge variant={getSeverityColor(alert.severity)} className="text-xs mt-0.5">
                  {alert.severity === "high" ? "Alta" : alert.severity === "medium" ? "Media" : "Baja"}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">{alert.location}</div>
                  <div className="text-xs text-muted-foreground truncate">{alert.description}</div>
                  <div className="text-xs text-muted-foreground">{formatTimeAgo(alert.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* System Events Log */}
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-medium">Log de Eventos</h3>
        </div>
        <ScrollArea className="h-32">
          <div className="space-y-1">
            {systemEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-2 p-2 rounded hover:bg-muted/50 transition-colors">
                <div
                  className={`mt-1 ${
                    event.severity === "error"
                      ? "text-destructive"
                      : event.severity === "warning"
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                  }`}
                >
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-foreground">{event.message}</div>
                  <div className="text-xs text-muted-foreground">{formatTimeAgo(event.timestamp)}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
