"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays, startOfWeek, isSameDay, parse, addHours } from "date-fns"
import { ChevronLeft, ChevronRight, Check, ExternalLink, Video, ChevronDown, X, Plus, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/* --------------------------
   Types & Constants
-------------------------- */
export interface Instructor {
  name: string
  role: string
  avatar: string
}

export interface Event {
  id: string
  title: string
  description: string
  status: string
  start: Date
  end: Date
  instructor: Instructor
  meetingUrl: string
  color?: string
}

// Modify the Calendar component props to accept events as a prop
interface CalendarProps {
  events?: Event[]
  onEventClick?: (event: Event) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DEFAULT_COLOR = "hsl(var(--primary))"

const STATUSES = [
  { label: "Scheduled", value: "scheduled", color: "#3B82F6" },
  { label: "In Progress", value: "in-progres", color: "#10B981" },
  { label: "Completed", value: "completed", color: "#6B7280" },
  { label: "Canceled", value: "canceled", color: "#EF4444" },
]

// Mapping for dynamic colors based on status
const STATUS_COLOR_MAP: Record<string, string> = {
  scheduled: "#3B82F6", // Blue-500
  "in-progres": "#10B981", // Green-500
  completed: "#6B7280", // Gray-500
  canceled: "#EF4444", // Red-500
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return "bg-blue-500/10 text-blue-500"
    case "in-progres":
      return "bg-green-500/10 text-green-500"
    case "completed":
      return "bg-gray-500/10 text-gray-500"
    case "canceled":
      return "bg-red-500/10 text-red-500"
    default:
      return "bg-gray-500/10 text-gray-500"
  }
}

/* --------------------------
   StatusFilter Component
-------------------------- */
function StatusFilter({
  selectedStatuses,
  setSelectedStatuses,
}: {
  selectedStatuses: string[]
  setSelectedStatuses: (statuses: string[]) => void
}) {
  const toggleStatus = (value: string) => {
    setSelectedStatuses(
      selectedStatuses.includes(value) ? selectedStatuses.filter((v) => v !== value) : [...selectedStatuses, value],
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 px-3 rounded-sm border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {selectedStatuses.length > 0 ? `${selectedStatuses.length} selected` : "All"}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1 rounded-sm shadow-lg border border-gray-200">
        <div className="space-y-1">
          {STATUSES.map((status) => {
            const isSelected = selectedStatuses.includes(status.value)
            return (
              <button
                key={status.value}
                onClick={() => toggleStatus(status.value)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 rounded-sm",
                  isSelected && "bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn("h-3 w-3 rounded-full border", isSelected ? "opacity-100" : "opacity-50")}
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-gray-700">{status.label}</span>
                  </div>
                </div>
                {isSelected && <Check className="h-4 w-4 text-blue-600" />}
              </button>
            )
          })}
          {selectedStatuses.length > 0 && (
            <button
              onClick={() => setSelectedStatuses([])}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-1 text-sm text-red-600 hover:bg-gray-50 rounded-sm border-t border-gray-200"
            >
              <X className="h-4 w-4" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* --------------------------
   CalendarHeader Component
-------------------------- */
function CalendarHeader({
  selectedDate,
  view,
  setView,
  navigateDate,
  selectedStatuses,
  setSelectedStatuses,
  currentIndex,
  filteredCount,
  handlePrevious,
  handleNext,
  currentEvent,
}: {
  selectedDate: Date
  view: "day" | "week"
  setView: (view: "day" | "week") => void
  navigateDate: (direction: "prev" | "next") => void
  selectedStatuses: string[]
  setSelectedStatuses: (statuses: string[]) => void
  currentIndex: number
  filteredCount: number
  handlePrevious: () => void
  handleNext: () => void
  currentEvent: Event | null
}) {
  return (
    <div className="space-y-3 mb-4">
      {/* Top row: Month navigation + Day/Week toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateDate("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-800">{format(selectedDate, "MMMM yyyy")}</h2>
          <Button variant="outline" size="icon" onClick={() => navigateDate("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("day")}
            className={cn(view === "day" && "bg-primary text-primary-foreground")}
          >
            Day
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView("week")}
            className={cn(view === "week" && "bg-primary text-primary-foreground")}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Second row: Status filter + Current Event + Event-by-event navigation */}
      <div className="flex items-center justify-between px-3 py-2 border rounded-md bg-muted/50">
        <StatusFilter selectedStatuses={selectedStatuses} setSelectedStatuses={setSelectedStatuses} />
        <div className="flex flex-col items-center">
          {currentEvent ? (
            <>
              <h3 className="text-base font-medium text-gray-800">{currentEvent.title}</h3>
              <p className="text-xs text-muted-foreground">{format(currentEvent.start, "MMM d, yyyy h:mm a")}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No event selected</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious} disabled={filteredCount === 0}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {filteredCount ? `${currentIndex + 1}/${filteredCount}` : "No events"}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext} disabled={filteredCount === 0}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

/* --------------------------
   CalendarHourLabels Component
-------------------------- */
function CalendarHourLabels() {
  return (
    <div className="w-16 flex-shrink-0 border-r border-gray-200">
      {HOURS.map((hour) => (
        <div key={hour} className="h-20 pr-2 text-sm text-gray-500 flex items-center justify-end">
          {hour % 12 || 12} {hour < 12 ? "AM" : "PM"}
        </div>
      ))}
    </div>
  )
}

/* --------------------------
   CalendarDayColumn Component
-------------------------- */
interface CalendarDayColumnProps {
  day: Date
  events: Event[]
  onEventClick?: (event: Event) => void
  getEventStyle: (event: Event) => React.CSSProperties
}

function CalendarDayColumn({ day, events, onEventClick, getEventStyle }: CalendarDayColumnProps) {
  return (
    <div className={cn("flex-1 min-w-[200px]", isSameDay(day, new Date()) && "bg-muted/50")}>
      <div className="h-12 border-b border-gray-200 bg-white sticky top-0 px-3 py-2">
        <div className="text-sm font-medium text-gray-800">{format(day, "EEE")}</div>
        <div className="text-sm text-gray-500">{format(day, "d")}</div>
      </div>
      <div className="relative h-[1680px]">
        {/* Hour lines */}
        {HOURS.map((hour) => (
          <div key={hour} className="h-20 border-b" />
        ))}

        {/* Events */}
        <AnimatePresence>
          {events.map((event) => (
            <Popover key={event.id}>
              <PopoverTrigger asChild>
                <motion.div
                  data-event-id={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-1 right-1 rounded-md p-2 text-white text-sm cursor-pointer"
                  style={getEventStyle(event)}
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{event.title}</span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 text-gray-700 bg-muted/80">
                      {event.status}
                    </Badge>
                  </div>
                </motion.div>
              </PopoverTrigger>

              {/* Popover content with extra event details */}
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                    <Badge variant="outline" className={cn(getStatusColor(event.status))}>
                      {event.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4" />
                      <a
                        href={event.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        Join Meeting
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(event.start, "MMM d, h:mm a")} - {format(event.end, "h:mm a")}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={event.instructor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{event.instructor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{event.instructor.name}</div>
                      <div className="text-sm text-muted-foreground">{event.instructor.role}</div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* --------------------------
   Main Calendar Component
-------------------------- */
// Update the Calendar function to use the events prop
export function Calendar({ events: initialEvents = [], onEventClick }: CalendarProps) {
  // Add these new state variables at the beginning of the Calendar function component
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isEditEventOpen, setIsEditEventOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week">("week")
  const [isMobile, setIsMobile] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const calendarContainerRef = useRef<HTMLDivElement>(null)

  const sortedEvents = useMemo(() => events.sort((a, b) => a.start.getTime() - b.start.getTime()), [events])

  const filteredEvents = useMemo(() => {
    if (!selectedStatuses.length) return sortedEvents
    return sortedEvents.filter((event) => selectedStatuses.includes(event.status.toLowerCase()))
  }, [selectedStatuses, sortedEvents])

  const currentEvent = filteredEvents[currentIndex] || null

  // Scroll to the current event in the calendar when it changes
  useEffect(() => {
    if (currentEvent) {
      setSelectedDate(currentEvent.start)
      requestAnimationFrame(() => {
        const eventElement = document.querySelector(`[data-event-id="${currentEvent.id}"]`)
        eventElement?.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        })
      })
    }
  }, [currentEvent])

  // Handle mobile responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      setView(window.innerWidth < 768 ? "day" : "week")
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Return the days to show in the selected view
  const getDaysToShow = () => {
    if (view === "day") return [selectedDate]
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  // Position an event by its start/end times
  const getEventStyle = (event: Event) => {
    const startHour = event.start.getHours() + event.start.getMinutes() / 60
    const endHour = event.end.getHours() + event.end.getMinutes() / 60
    const statusColor = STATUS_COLOR_MAP[event.status.toLowerCase()] || DEFAULT_COLOR
    return {
      top: `${(startHour / 24) * 100}%`,
      height: `${((endHour - startHour) / 24) * 100}%`,
      backgroundColor: event.color || statusColor,
    }
  }

  // Move the calendar date forward or backward
  const navigateDate = (direction: "prev" | "next") => {
    setSelectedDate((current) =>
      direction === "prev" ? addDays(current, view === "day" ? -1 : -7) : addDays(current, view === "day" ? 1 : 7),
    )
  }

  // Move to previous or next filtered event
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredEvents.length - 1))
  }
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < filteredEvents.length - 1 ? prev + 1 : 0))
  }

  // Add these handlers for CRUD operations
  const handleAddEvent = (newEvent: Omit<Event, "id">) => {
    const event: Event = {
      ...newEvent,
      id: `event-${Date.now()}`, // Generate a unique ID
    }
    setEvents([...events, event])
    setIsAddEventOpen(false)
    toast({
      title: "Event created",
      description: "Your event has been successfully created.",
    })
  }

  const handleEditEvent = (updatedEvent: Event) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setIsEditEventOpen(false)
    setEventToEdit(null)
    toast({
      title: "Event updated",
      description: "Your event has been successfully updated.",
    })
  }

  const handleDeleteEvent = () => {
    if (!eventToEdit) return

    setEvents(events.filter((event) => event.id !== eventToEdit.id))
    setIsDeleteDialogOpen(false)
    setEventToEdit(null)
    toast({
      title: "Event deleted",
      description: "Your event has been successfully deleted.",
    })
  }

  const openEditModal = (event: Event) => {
    setEventToEdit(event)
    setIsEditEventOpen(true)
  }

  const openDeleteDialog = (event: Event) => {
    setEventToEdit(event)
    setIsDeleteDialogOpen(true)
  }

  return (
    <Card className="p-4">
      <CalendarHeader
        selectedDate={selectedDate}
        view={view}
        setView={setView}
        navigateDate={navigateDate}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        currentIndex={currentIndex}
        filteredCount={filteredEvents.length}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        currentEvent={currentEvent}
      />

      {/* Add Event Button */}
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddEventOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Main calendar area */}
      <div ref={calendarContainerRef} className="relative overflow-y-auto" style={{ maxHeight: "60vh" }}>
        <div className="flex">
          <CalendarHourLabels />
          <div className="flex-1">
            <div className="flex">
              {getDaysToShow().map((day) => (
                <CalendarDayColumn
                  key={day.toString()}
                  day={day}
                  events={events.filter((e) => isSameDay(e.start, day))}
                  onEventClick={(event) => {
                    if (onEventClick) onEventClick(event)
                    setEventToEdit(event)
                  }}
                  getEventStyle={getEventStyle}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>Create a new event in your calendar.</DialogDescription>
          </DialogHeader>
          <EventForm onSubmit={handleAddEvent} onCancel={() => setIsAddEventOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditEventOpen} onOpenChange={setIsEditEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Make changes to your event.</DialogDescription>
          </DialogHeader>
          {eventToEdit && (
            <div className="flex justify-end mb-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setIsEditEventOpen(false)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Event
              </Button>
            </div>
          )}
          {eventToEdit && (
            <EventForm event={eventToEdit} onSubmit={handleEditEvent} onCancel={() => setIsEditEventOpen(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event "{eventToEdit?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEvent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Event Context Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div id="event-context-trigger" className="hidden" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => eventToEdit && openEditModal(eventToEdit)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => eventToEdit && openDeleteDialog(eventToEdit)} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  )
}

// Add this new EventForm component after the Calendar component
interface EventFormProps {
  event?: Event
  onSubmit: (event: Event | Omit<Event, "id">) => void
  onCancel: () => void
}

function EventForm({ event, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(event?.title || "")
  const [description, setDescription] = useState(event?.description || "")
  const [status, setStatus] = useState(event?.status || "scheduled")
  const [startDate, setStartDate] = useState(
    event?.start ? format(event.start, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
  )
  const [startTime, setStartTime] = useState(event?.start ? format(event.start, "HH:mm") : format(new Date(), "HH:mm"))
  const [endDate, setEndDate] = useState(
    event?.end ? format(event.end, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
  )
  const [endTime, setEndTime] = useState(
    event?.end ? format(event.end, "HH:mm") : format(addHours(new Date(), 1), "HH:mm"),
  )
  const [meetingUrl, setMeetingUrl] = useState(event?.meetingUrl || "")
  const [instructorName, setInstructorName] = useState(event?.instructor?.name || "")
  const [instructorRole, setInstructorRole] = useState(event?.instructor?.role || "")
  const [instructorAvatar, setInstructorAvatar] = useState(event?.instructor?.avatar || "https://github.com/shadcn.png")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const startDateTime = parse(`${startDate} ${startTime}`, "yyyy-MM-dd HH:mm", new Date())
    const endDateTime = parse(`${endDate} ${endTime}`, "yyyy-MM-dd HH:mm", new Date())

    const formData = {
      ...(event ? { id: event.id } : {}),
      title,
      description,
      status,
      start: startDateTime,
      end: endDateTime,
      instructor: {
        name: instructorName,
        role: instructorRole,
        avatar: instructorAvatar,
      },
      meetingUrl,
    }

    onSubmit(formData as any)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progres">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meetingUrl">Meeting URL</Label>
        <Input
          id="meetingUrl"
          type="url"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          placeholder="https://meet.example.com/..."
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Instructor Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instructorName">Name</Label>
            <Input
              id="instructorName"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="Instructor name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructorRole">Role</Label>
            <Input
              id="instructorRole"
              value={instructorRole}
              onChange={(e) => setInstructorRole(e.target.value)}
              placeholder="Instructor role"
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
      </DialogFooter>
    </form>
  )
}
