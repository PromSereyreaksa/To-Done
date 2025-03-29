"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, Clock, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"

export default function SchedulePage({ tasks = [], onScheduleTask }) {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [scheduledTasks, setScheduledTasks] = useState({})
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [selectedDuration, setSelectedDuration] = useState("30")

  // Generate calendar days
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null })
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({ day, date })
    }

    return days
  }

  const calendarDays = generateCalendarDays()

  // Format date for display
  const formatDate = (date) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Handle day selection
  const selectDay = (date) => {
    if (!date) return
    setSelectedDate(date)
  }

  // Handle task scheduling
  const scheduleTask = () => {
    if (!selectedTask || !selectedDate || !selectedTime) return

    const dateKey = selectedDate.toISOString().split("T")[0]
    const newScheduledTasks = { ...scheduledTasks }

    if (!newScheduledTasks[dateKey]) {
      newScheduledTasks[dateKey] = []
    }

    newScheduledTasks[dateKey].push({
      taskId: selectedTask,
      time: selectedTime,
      duration: selectedDuration,
      task: tasks.find((t) => t.id.toString() === selectedTask),
    })

    setScheduledTasks(newScheduledTasks)

    // Call parent handler if provided
    if (onScheduleTask) {
      onScheduleTask(selectedTask, {
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration,
      })
    }

    // Reset selection
    setSelectedTask(null)
  }

  // Get tasks for selected date
  const getTasksForDate = (date) => {
    if (!date) return []

    const dateKey = date.toISOString().split("T")[0]
    return scheduledTasks[dateKey] || []
  }

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : []

  // Get incomplete tasks for scheduling
  const incompleteTasks = tasks.filter((task) => !task.completed)

  return (
    <div className="min-h-screen bg-[#020F2B] text-white">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/todo")}
            className="mr-2 text-white hover:bg-[#051640]/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to todos
          </Button>
          <h1 className="text-3xl font-bold">Task Scheduler</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="md:col-span-2">
            <Card className="bg-[#051640] border-none text-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevMonth}
                      className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextMonth}
                      className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-medium py-2 text-gray-400">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days */}
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`
                        p-2 h-20 border border-[#031233] rounded-md 
                        ${!day.day ? "bg-transparent" : "bg-[#031233] hover:bg-[#051640] cursor-pointer"}
                        ${
                          selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                            ? "ring-2 ring-[#A7E8D2]"
                            : ""
                        }
                      `}
                      onClick={() => day.day && selectDay(day.date)}
                    >
                      {day.day && (
                        <>
                          <div className="flex justify-between items-start">
                            <span
                              className={`
                              text-sm font-medium
                              ${
                                new Date().toDateString() === day.date.toDateString()
                                  ? "bg-[#A7E8D2] text-[#020F2B] rounded-full w-6 h-6 flex items-center justify-center"
                                  : ""
                              }
                            `}
                            >
                              {day.day}
                            </span>

                            {/* Indicator for scheduled tasks */}
                            {getTasksForDate(day.date).length > 0 && (
                              <span className="w-2 h-2 rounded-full bg-[#A7E8D2]"></span>
                            )}
                          </div>

                          {/* Show first scheduled task if any */}
                          {getTasksForDate(day.date).length > 0 && (
                            <div className="mt-1 text-xs truncate text-[#A7E8D2]">
                              {getTasksForDate(day.date)[0].time} - {getTasksForDate(day.date)[0].task?.text}
                            </div>
                          )}

                          {/* Show count if more than one task */}
                          {getTasksForDate(day.date).length > 1 && (
                            <div className="text-xs text-gray-400">+{getTasksForDate(day.date).length - 1} more</div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule details */}
          <div>
            <Card className="bg-[#051640] border-none text-white mb-6">
              <CardHeader>
                <CardTitle>{selectedDate ? formatDate(selectedDate) : "Select a date"}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Scheduled Tasks</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80">
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                          <DialogHeader>
                            <DialogTitle>Schedule a Task</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Select Task</Label>
                              <Select value={selectedTask} onValueChange={setSelectedTask}>
                                <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                                  <SelectValue placeholder="Choose a task" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                                  {incompleteTasks.map((task) => (
                                    <SelectItem
                                      key={task.id}
                                      value={task.id.toString()}
                                      className="hover:bg-[#031233] cursor-pointer"
                                    >
                                      {task.text}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Time</Label>
                              <Input
                                type="time"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="bg-[#031233] border-gray-700 text-white"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Duration (minutes)</Label>
                              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                                <SelectTrigger className="bg-[#031233] border-gray-700 text-white">
                                  <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#051640] text-white border-[#A7E8D2]/20">
                                  <SelectItem value="15" className="hover:bg-[#031233] cursor-pointer">
                                    15 minutes
                                  </SelectItem>
                                  <SelectItem value="30" className="hover:bg-[#031233] cursor-pointer">
                                    30 minutes
                                  </SelectItem>
                                  <SelectItem value="45" className="hover:bg-[#031233] cursor-pointer">
                                    45 minutes
                                  </SelectItem>
                                  <SelectItem value="60" className="hover:bg-[#031233] cursor-pointer">
                                    1 hour
                                  </SelectItem>
                                  <SelectItem value="90" className="hover:bg-[#031233] cursor-pointer">
                                    1.5 hours
                                  </SelectItem>
                                  <SelectItem value="120" className="hover:bg-[#031233] cursor-pointer">
                                    2 hours
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline" className="border-[#A7E8D2]/50 text-white hover:bg-[#031233]">
                                Cancel
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={scheduleTask}
                                className="bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                                disabled={!selectedTask}
                              >
                                Schedule
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {selectedDateTasks.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDateTasks.map((scheduledTask, index) => (
                          <div key={index} className="p-3 bg-[#031233] rounded-lg flex items-start">
                            <Clock className="h-4 w-4 text-[#A7E8D2] mt-1 mr-2" />
                            <div className="flex-1">
                              <div className="font-medium">{scheduledTask.task?.text}</div>
                              <div className="text-sm text-gray-400">
                                {scheduledTask.time} • {scheduledTask.duration} minutes
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No tasks scheduled for this day</p>
                        <p className="text-sm">Click the Add button to schedule a task</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Select a date from the calendar</p>
                    <p className="text-sm">to view or schedule tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#051640] border-none text-white">
              <CardHeader>
                <CardTitle>Upcoming Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.entries(scheduledTasks).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(scheduledTasks)
                      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                      .slice(0, 5)
                      .map(([date, tasks]) => (
                        <div key={date} className="p-3 bg-[#031233] rounded-lg">
                          <div className="font-medium mb-1">
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          {tasks.map((task, index) => (
                            <div key={index} className="flex items-center text-sm ml-2 mt-1">
                              <Clock className="h-3 w-3 text-[#A7E8D2] mr-1" />
                              <span className="text-gray-400 mr-1">{task.time}</span>
                              <span className="truncate">{task.task?.text}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <p>No upcoming scheduled tasks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

