"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Clock, Zap, CheckCircle, XCircle, Timer } from "lucide-react"

interface EDFTask {
  id: string
  name: string
  deadline: Date
  priority: number
  estimatedDuration: number
  remainingTime: number
  status: "pending" | "executing" | "completed" | "missed"
  location: string
  taskType: "traffic_optimization" | "emergency_response" | "maintenance" | "data_sync"
}

interface CriticalAlert {
  id: string
  taskId: string
  message: string
  severity: "critical" | "high" | "medium"
  timeToDeadline: number
  timestamp: Date
  acknowledged: boolean
}

export function EDFAlerts() {
  const [edfTasks, setEdfTasks] = useState<EDFTask[]>([])
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>([])
  const [systemLoad, setSystemLoad] = useState(0)

  useEffect(() => {
    // Initialize EDF tasks
    const now = new Date()
    const initialTasks: EDFTask[] = [
      {
        id: "EDF001",
        name: "Optimización Centro Histórico",
        deadline: new Date(now.getTime() + 2 * 60 * 1000), // 2 minutes
        priority: 1,
        estimatedDuration: 90,
        remainingTime: 120,
        status: "executing",
        location: "Centro Histórico",
        taskType: "traffic_optimization",
      },
      {
        id: "EDF002",
        name: "Respuesta Emergencia TL004",
        deadline: new Date(now.getTime() + 30 * 1000), // 30 seconds - CRITICAL
        priority: 1,
        estimatedDuration: 45,
        remainingTime: 30,
        status: "pending",
        location: "Terminal",
        taskType: "emergency_response",
      },
      {
        id: "EDF003",
        name: "Sincronización Waze API",
        deadline: new Date(now.getTime() + 5 * 60 * 1000), // 5 minutes
        priority: 3,
        estimatedDuration: 60,
        remainingTime: 300,
        status: "pending",
        location: "Sistema Central",
        taskType: "data_sync",
      },
      {
        id: "EDF004",
        name: "Mantenimiento TL001",
        deadline: new Date(now.getTime() + 8 * 60 * 1000), // 8 minutes
        priority: 2,
        estimatedDuration: 120,
        remainingTime: 480,
        status: "pending",
        location: "Centro - Calle 5",
        taskType: "maintenance",
      },
      {
        id: "EDF005",
        name: "Optimización Panamericana",
        deadline: new Date(now.getTime() - 1 * 60 * 1000), // Already missed
        priority: 2,
        estimatedDuration: 180,
        remainingTime: 0,
        status: "missed",
        location: "Av. Panamericana",
        taskType: "traffic_optimization",
      },
    ]

    setEdfTasks(initialTasks)

    // Generate initial critical alerts
    const initialAlerts: CriticalAlert[] = [
      {
        id: "ALERT001",
        taskId: "EDF002",
        message: "Deadline crítico: Respuesta de emergencia en 30 segundos",
        severity: "critical",
        timeToDeadline: 30,
        timestamp: new Date(),
        acknowledged: false,
      },
      {
        id: "ALERT002",
        taskId: "EDF001",
        message: "Tarea de optimización próxima a vencer en 2 minutos",
        severity: "high",
        timeToDeadline: 120,
        timestamp: new Date(now.getTime() - 30 * 1000),
        acknowledged: false,
      },
    ]

    setCriticalAlerts(initialAlerts)

    // Real-time countdown and EDF scheduling simulation
    const interval = setInterval(() => {
      setEdfTasks((prev) =>
        prev.map((task) => {
          if (task.status === "completed" || task.status === "missed") return task

          const newRemainingTime = Math.max(0, task.remainingTime - 1)
          let newStatus = task.status

          if (newRemainingTime <= 0 && task.status !== "completed") {
            newStatus = "missed"
          } else if (task.status === "pending" && task.priority === 1 && newRemainingTime <= 60) {
            newStatus = "executing"
          }

          return {
            ...task,
            remainingTime: newRemainingTime,
            status: newStatus,
          }
        }),
      )

      // Update system load based on active tasks
      setSystemLoad((prev) => {
        const targetLoad = Math.min(100, Math.random() * 40 + 30)
        return Math.round(prev * 0.8 + targetLoad * 0.2)
      })

      setCriticalAlerts((prev) => {
        const newAlerts = [...prev]

        // Only keep recent alerts and limit to prevent memory issues
        const recentAlerts = newAlerts
          .filter(
            (alert) => Date.now() - alert.timestamp.getTime() < 10 * 60 * 1000, // 10 minutes
          )
          .slice(0, 5)

        return recentAlerts
      })
    }, 1000)

    return () => clearInterval(interval)
  }, []) // Removed edfTasks dependency to prevent infinite loop

  const acknowledgeAlert = (alertId: string) => {
    setCriticalAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "emergency_response":
        return <AlertTriangle className="h-3 w-3 text-destructive" />
      case "traffic_optimization":
        return <Zap className="h-3 w-3 text-primary" />
      case "maintenance":
        return <Timer className="h-3 w-3 text-secondary" />
      case "data_sync":
        return <Clock className="h-3 w-3 text-accent" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "executing":
        return "default"
      case "pending":
        return "secondary"
      case "completed":
        return "outline"
      case "missed":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "executing":
        return <Zap className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "completed":
        return <CheckCircle className="h-3 w-3" />
      case "missed":
        return <XCircle className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const criticalTasksCount = edfTasks.filter(
    (t) => t.remainingTime <= 60 && t.status !== "completed" && t.status !== "missed",
  ).length
  const unacknowledgedAlerts = criticalAlerts.filter((a) => !a.acknowledged).length

  return (
    <div className="h-full space-y-4">
      {/* System Status */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">EDF Scheduler</span>
          </div>
          <Badge variant={systemLoad > 80 ? "destructive" : systemLoad > 60 ? "secondary" : "outline"}>
            {systemLoad}% carga
          </Badge>
        </div>
        <Progress value={systemLoad} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Tareas críticas: {criticalTasksCount}</span>
          <span>Alertas: {unacknowledgedAlerts}</span>
        </div>
      </Card>

      {/* Critical Alerts */}
      {unacknowledgedAlerts > 0 && (
        <Card className="p-3 border-destructive/50 bg-destructive/5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
            <h3 className="text-sm font-medium text-destructive">Alertas Críticas</h3>
          </div>
          <ScrollArea className="h-20">
            <div className="space-y-2">
              {criticalAlerts
                .filter((alert) => !alert.acknowledged)
                .map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2 p-2 rounded border bg-card">
                    <Badge variant={getSeverityColor(alert.severity)} className="text-xs mt-0.5">
                      {alert.severity === "critical" ? "CRÍTICO" : alert.severity === "high" ? "ALTO" : "MEDIO"}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-foreground">{alert.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(Math.floor((Date.now() - alert.timestamp.getTime()) / 1000))} ago
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="h-6 px-2 text-xs"
                    >
                      OK
                    </Button>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </Card>
      )}

      {/* EDF Task Queue */}
      <Card className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-medium">Cola de Tareas EDF</h3>
        </div>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {edfTasks
              .sort((a, b) => {
                // EDF sorting: earliest deadline first, but prioritize executing tasks
                if (a.status === "executing" && b.status !== "executing") return -1
                if (b.status === "executing" && a.status !== "executing") return 1
                return a.remainingTime - b.remainingTime
              })
              .map((task) => (
                <div
                  key={task.id}
                  className={`p-2 rounded border ${
                    task.remainingTime <= 30 && task.status !== "completed" && task.status !== "missed"
                      ? "border-destructive/50 bg-destructive/5"
                      : "bg-card/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getTaskTypeIcon(task.taskType)}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-foreground truncate">{task.name}</div>
                        <div className="text-xs text-muted-foreground">{task.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(task.status)} className="text-xs">
                        {getStatusIcon(task.status)}
                        {task.status === "executing"
                          ? "Ejecutando"
                          : task.status === "pending"
                            ? "Pendiente"
                            : task.status === "completed"
                              ? "Completado"
                              : "Perdido"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span
                        className={`font-mono ${
                          task.remainingTime <= 30 && task.status !== "completed" && task.status !== "missed"
                            ? "text-destructive font-bold animate-pulse"
                            : "text-foreground"
                        }`}
                      >
                        {formatTime(task.remainingTime)}
                      </span>
                    </div>

                    {task.status === "executing" && (
                      <div className="space-y-1">
                        <Progress
                          value={((task.estimatedDuration - task.remainingTime) / task.estimatedDuration) * 100}
                          className="h-1"
                        />
                        <div className="text-xs text-muted-foreground text-center">Progreso estimado</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </Card>

      {/* EDF Statistics */}
      <Card className="p-3">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-lg font-bold text-primary">
              {edfTasks.filter((t) => t.status === "executing").length}
            </div>
            <div className="text-xs text-muted-foreground">Ejecutando</div>
          </div>
          <div>
            <div className="text-lg font-bold text-destructive">
              {edfTasks.filter((t) => t.status === "missed").length}
            </div>
            <div className="text-xs text-muted-foreground">Perdidas</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
