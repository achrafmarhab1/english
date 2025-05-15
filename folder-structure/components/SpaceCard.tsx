"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { AvatarStack } from "./AvatarStack"
import { CheckCircle2, Star, Calendar, Trophy } from "lucide-react"
import Link from "next/link"

/* ---------------------------
   Type Definitions
--------------------------- */
export interface Student {
  id: string
  name: string
  avatar: string
}

export interface Instructor {
  id: string
  name: string
  role: string
  avatar: string
  cvUrl: string
}

export interface Space {
  id: string
  name: string
  subtitle: string
  description: string
  colorPalette: [string, string]
  size: number
  price: number
  isActive: boolean
  keyPoints: string[]
  instructor: Instructor
  students: Student[]
  createdAt: string
  tags: string[]
  schedule: string[]
  completedModules: number
  totalModules: number
  partner?: string
  partnerLogo?: string
  rating: number
  certifications: string[]
}

/* ---------------------------
   Loading Skeleton Component
--------------------------- */
export function SkeletonSpaceCard() {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <Skeleton className="h-8 w-3/4 rounded-lg" />
      <Skeleton className="h-4 w-full rounded" />
      <div className="flex gap-2">
        <Skeleton className="h-4 w-16 rounded" />
        <Skeleton className="h-4 w-16 rounded" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
    </div>
  )
}

/* ---------------------------
   Error Boundary Component
--------------------------- */
interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-destructive">Error loading space card</div>
    }
    return this.props.children
  }
}

/* ---------------------------
   Active Indicator Component
--------------------------- */
const ActiveIndicator = ({ isActive }: { isActive: boolean }) => {
  const bgPing = isActive ? "bg-emerald-400" : "bg-rose-400"
  const bgBase = isActive ? "bg-emerald-500" : "bg-rose-500"
  return (
    <div className="bg-white p-1.5 rounded-full shadow-sm">
      <div className="relative flex h-1.5 w-5">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${bgPing} opacity-100`}></span>
        <span className={`relative inline-flex rounded-full h-1.5 w-5 ${bgBase}`}></span>
      </div>
    </div>
  )
}

/* ---------------------------
   Rating Stars Component
--------------------------- */
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.floor(rating) ? "fill-current" : ""}`}
          style={{
            color: index < Math.floor(rating) ? "#f59e0b" : "#6b7280",
          }}
        />
      ))}
      <span className="text-sm text-muted-foreground ml-1">({rating.toFixed(1)})</span>
    </div>
  )
}

/* ---------------------------
   Instructor Popover Component
--------------------------- */
const InstructorPopover = ({ instructor }: { instructor: Instructor }) => {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2 hover:underline">
        <Avatar className="h-6 w-6">
          <AvatarImage src={instructor.avatar || "/https://github.com/shadcn.png"} />
          <AvatarFallback>{instructor.name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm">{instructor.name}</span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={instructor.avatar || "/placeholder.svg"} />
              <AvatarFallback>{instructor.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{instructor.name}</h4>
              <p className="text-sm text-muted-foreground">{instructor.role}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <a href={instructor.cvUrl} download>
              Download CV
            </a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* ---------------------------
   Students Popover Component
--------------------------- */
const StudentsPopover = ({ students }: { students: Student[] }) => {
  return (
    <Popover>
      <PopoverTrigger className="hover:underline">
        <AvatarStack users={students} />
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="grid grid-cols-4 gap-2">
          {students.map((student) => (
            <Avatar key={student.id}>
              <AvatarImage src={student.avatar || "/placeholder.svg"} />
              <AvatarFallback>{student.name[0]}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* ---------------------------
   Space Details Dialog Component
--------------------------- */
const SpaceDetailsDialog = ({
  space,
  gradientStyle,
  openDialog,
  setOpenDialog,
}: {
  space: Space
  gradientStyle: React.CSSProperties
  openDialog: boolean
  setOpenDialog: (open: boolean) => void
}) => {
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg" style={gradientStyle}>
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle>{space.name}</DialogTitle>
              <DialogDescription>{space.subtitle}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            {space.partner ? (
              <>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={space.partnerLogo || "/placeholder.svg"} />
                  <AvatarFallback>
                    {space.partner
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Owner</h4>
                  <p className="text-sm text-muted-foreground">{space.partner}</p>
                </div>
              </>
            ) : (
              <>
                <Avatar className="h-12 w-12">
                  <AvatarImage src={space.partnerLogo || "/placeholder.svg"} />
                  <AvatarFallback>
                    {"Space Learn"
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">Platform</h4>
                  <p className="text-sm text-muted-foreground">Official Space Learn Program</p>
                </div>
              </>
            )}
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{space.description}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Strong Points</h4>
            <div className="grid grid-cols-2 gap-2">
              {space.keyPoints.map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {space.certifications.map((certification) => (
                <Badge
                  key={certification}
                  className="text-white"
                  style={{
                    background: `linear-gradient(135deg, ${space.colorPalette[0]} 0%, ${space.colorPalette[1]} 100%)`,
                  }}
                >
                  {certification}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Creation Date</h4>
              <p className="text-sm text-muted-foreground">
                {new Date(space.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Schedule</h4>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {space.schedule.join(" • ")}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------------------------
   Main Space Card Component
--------------------------- */
export function SpaceCard({ space }: { space: Space }) {
  const [isLoading, setIsLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)

  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${space.colorPalette[0]} 0%, ${space.colorPalette[1]} 100%)`,
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <SkeletonSpaceCard />

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden hover:shadow-xl">
          <div className="absolute top-4 right-4">
            <ActiveIndicator isActive={space.isActive} />
          </div>
          <CardHeader className="text-background" style={gradientStyle}>
            <CardTitle className="text-2xl">{space.name}</CardTitle>
            <CardDescription className="text-background/80">{space.subtitle}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <RatingStars rating={space.rating} />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {space.keyPoints.map((point) => (
                <Badge variant="outline" key={point}>
                  {point}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-muted-foreground">Size</p>
                <p>{space.size} sq.m</p>
              </div>
              <div>
                <p className="text-muted-foreground">Price</p>
                <p>${space.price}/month</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <InstructorPopover instructor={space.instructor} />
              <StudentsPopover students={space.students} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <SpaceDetailsDialog
              space={space}
              gradientStyle={gradientStyle}
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
            />
            <Button className="bg-primary/90 hover:bg-primary" asChild>
              <Link href={`/space-session/${space.id}`}>Open Space Session</Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </ErrorBoundary>
  )
}

/* ---------------------------
   Space Card List Component
--------------------------- */
interface SpaceCardListProps {
  spaces: Space[]
}

export function SpaceCardList({ spaces }: SpaceCardListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <AnimatePresence>
        {spaces.map((space) => (
          <SpaceCard key={space.id} space={space} />
        ))}
      </AnimatePresence>
    </div>
  )
}
