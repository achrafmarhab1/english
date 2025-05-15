"use client"

import React, { useRef, useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  ChevronRight,
  Edit,
  Folder,
  Grid,
  Home,
  LayoutGrid,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-mobile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}

interface Document {
  DOC_ID: number
  DOC_TITLE: string
  DOC_TYPE: string
  DOC_FORMAT: string
  DOC_CREATED_AT: string
  DOC_LINK: string
}

interface Chapter {
  CHAPTR_ID: number
  CHAPTR_NOM: string
  CHAPTR_CREATED_AT: string
  DOC: Document[]
}

interface Module {
  MODUL_ID: number
  MODUL_NOM: string
  MODUL_CREATED_AT: string
  MODUL_DUR: number
  CHAPTR: Chapter[]
}

// Modal types
type ModalType =
  | "createModule"
  | "createChapter"
  | "createDocument"
  | "editModule"
  | "editChapter"
  | "editDocument"
  | null
type DeleteType = "module" | "chapter" | "document" | null

// Modify the NavItem component to prevent navigation
function NavItem({ href, icon, children, active, onClick }: NavItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg cursor-pointer",
        active && "bg-gray-100",
      )}
      onClick={(e) => {
        e.preventDefault()
        if (onClick) {
          onClick()
        }
      }}
    >
      {icon}
      <span>{children}</span>
    </div>
  )
}

// Modify the FolderItem component to prevent navigation
function FolderItem({
  href,
  children,
  onClick,
  onEdit,
  onDelete,
  active = false,
  expandable = false,
  expanded = false,
}: {
  href: string
  children: React.ReactNode
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  active?: boolean
  expandable?: boolean
  expanded?: boolean
}) {
  return (
    <div className="group flex items-center justify-between hover:bg-gray-50 rounded-md">
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 flex-grow cursor-pointer",
          active && "bg-gray-100 rounded-l-md",
        )}
        onClick={(e) => {
          e.preventDefault()
          if (onClick) {
            onClick()
          }
        }}
      >
        {expandable ? (
          <ChevronRight
            className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", expanded && "rotate-90")}
          />
        ) : (
          <Folder className="h-4 w-4 text-gray-400" />
        )}
        <span className="truncate">{children}</span>
      </div>
      {(onEdit || onDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

function FileCard({ title, metadata, thumbnail }: { title: string; metadata: string; thumbnail: string }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white">
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{metadata}</p>
      </div>
    </div>
  )
}

interface BreadcrumbItem {
  id: string
  name: string
  href: string
}

// Modify the Breadcrumb component to prevent navigation
function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const isMobile = useMediaQuery("(max-width: 640px)")

  // On mobile, only show the last two items
  const displayItems = isMobile && items.length > 2 ? [items[0], ...items.slice(-1)] : items

  return (
    <nav className="flex overflow-x-auto pb-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 min-w-0">
        <li>
          <div
            className="text-gray-500 hover:text-gray-700 flex-shrink-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              // Handle home navigation internally
            }}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </div>
        </li>
        {displayItems.map((item, index) => (
          <li key={item.id} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div
              className={cn(
                "ml-1 text-sm font-medium hover:text-gray-700 truncate max-w-[120px] sm:max-w-xs cursor-pointer",
                index === displayItems.length - 1 ? "text-gray-900" : "text-gray-500",
              )}
              onClick={(e) => {
                e.preventDefault()
                // Handle breadcrumb navigation internally
              }}
            >
              {item.name}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

function ResizableSplitView({
  children,
  isMinimized,
  setIsMinimized,
}: {
  children: React.ReactNode
  isMinimized: boolean
  setIsMinimized: (value: boolean) => void
}) {
  const [height, setHeight] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef<number>(0)
  const startHeightRef = useRef<number>(height)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Store user's preferred height in localStorage
  useEffect(() => {
    const savedHeight = localStorage.getItem("documentResultsHeight")
    if (savedHeight) {
      setHeight(Number.parseInt(savedHeight))
    }
  }, [])

  // Save height preference when it changes
  useEffect(() => {
    if (!isDragging && height > 100) {
      localStorage.setItem("documentResultsHeight", height.toString())
    }
  }, [height, isDragging])

  // Add padding to the bottom of the page to account for the fixed panel
  useEffect(() => {
    const mainContent = document.querySelector(".main-content-area")
    if (mainContent) {
      ;(mainContent as HTMLElement).style.paddingBottom = isMinimized ? "48px" : `${height + 48}px`
    }
  }, [height, isMinimized])

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()

    // Get the client Y position for both mouse and touch events
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY

    startYRef.current = clientY
    startHeightRef.current = height
    setIsDragging(true)

    if ("touches" in e) {
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    } else {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const deltaY = e.clientY - startYRef.current
    // When resizing from top, we need to adjust both height and position
    const newHeight = Math.max(100, startHeightRef.current - deltaY)

    // Limit maximum height to 80% of viewport height
    const maxHeight = window.innerHeight * 0.8
    setHeight(Math.min(newHeight, maxHeight))
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return

    const deltaY = e.touches[0].clientY - startYRef.current
    const newHeight = Math.max(100, startHeightRef.current - deltaY)

    // Limit maximum height to 80% of viewport height
    const maxHeight = window.innerHeight * 0.8
    setHeight(Math.min(newHeight, maxHeight))
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    document.removeEventListener("touchmove", handleTouchMove)
    document.removeEventListener("touchend", handleTouchEnd)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const fitToContent = () => {
    if (contentRef.current) {
      // Get the actual content height + some padding
      const contentHeight = contentRef.current.scrollHeight + 20
      // Set a reasonable minimum and maximum
      const newHeight = Math.max(200, Math.min(contentHeight, window.innerHeight * 0.8))
      setHeight(newHeight)
    }
  }

  const resetHeight = () => {
    setHeight(300) // Reset to default height
    localStorage.removeItem("documentResultsHeight")
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg transition-all duration-300 z-10 ${
        isMinimized ? "h-12" : ""
      }`}
    >
      <div className="flex items-center justify-between border-b border-gray-200 pb-2 pt-2 px-3 sm:px-6">
        <h2 className="text-base sm:text-lg font-medium text-gray-900 truncate">
          Result of the Documents (PDF and Video)
        </h2>
        <div className="flex items-center gap-2">
          {!isMinimized && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={fitToContent}
                className="hidden sm:flex h-8 px-2 text-xs"
                title="Fit to content"
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                  <path d="M9 3v18M15 3v18" strokeWidth="2" strokeDasharray="2" />
                </svg>
                <span>Fit</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetHeight}
                className="hidden sm:flex h-8 px-2 text-xs"
                title="Reset size"
              >
                <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M3 12h18M12 3v18" strokeWidth="2" />
                </svg>
                <span>Reset</span>
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={toggleMinimize} className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
            {isMinimized ? (
              <svg className="h-4 w-4 sm:mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="18 15 12 9 6 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="h-4 w-4 sm:mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            <span className="hidden sm:inline">{isMinimized ? "Expand" : "Minimize"}</span>
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                d="M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3m6-18h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Split View
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div
            ref={containerRef}
            className="overflow-hidden px-3 sm:px-6"
            style={{ height: `${height}px`, transition: isDragging ? "none" : "height 0.1s ease-out" }}
          >
            <div ref={contentRef} className="h-full">
              {children}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Modify the DocumentCard component to prevent navigation
function DocumentCard({
  title,
  creationDate,
  fileType,
  fileSize,
  thumbnail,
  isPdf = false,
  isVideo = false,
  onClick,
  onEdit,
  onDelete,
  isListView = false,
}: {
  title: string
  creationDate: string
  fileType: string
  fileSize: string
  thumbnail?: string
  isPdf?: boolean
  isVideo?: boolean
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  isListView?: boolean
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-white hover:shadow-md transition-all ${
        isListView ? "flex items-center" : ""
      }`}
    >
      <div
        className={`${isListView ? "w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" : "aspect-[4/3]"} overflow-hidden bg-gray-50 relative cursor-pointer`}
        onClick={(e) => {
          e.preventDefault()
          if (onClick) onClick()
        }}
      >
        {thumbnail ? (
          <Image
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {isPdf ? (
              <svg
                className={`${isListView ? "h-6 w-6 sm:h-8 sm:w-8" : "h-12 w-12 sm:h-16 sm:w-16"} text-red-500`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : isVideo ? (
              <svg
                className={`${isListView ? "h-6 w-6 sm:h-8 sm:w-8" : "h-12 w-12 sm:h-16 sm:w-16"} text-blue-500`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M23 7l-7 5 7 5V7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect
                  x="1"
                  y="5"
                  width="15"
                  height="14"
                  rx="2"
                  ry="2"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                className={`${isListView ? "h-6 w-6 sm:h-8 sm:w-8" : "h-12 w-12 sm:h-16 sm:w-16"} text-gray-300`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M13 2v7h7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}

        {/* Preview button for videos */}
        {isVideo && !isListView && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-black bg-opacity-50 p-2 sm:p-3 text-white">
              <svg className="h-6 w-6 sm:h-8 sm:w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${isListView ? "flex-1 flex items-center justify-between min-w-0 px-3" : ""} p-2 sm:p-4 cursor-pointer`}
        onClick={(e) => {
          e.preventDefault()
          if (onClick) onClick()
        }}
      >
        <div className={isListView ? "flex-1 min-w-0 mr-4" : ""}>
          <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base truncate">{title}</h3>
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <span className="truncate">{creationDate}</span>
          </div>
        </div>
        <div className={`flex items-center ${isListView ? "gap-2 sm:gap-4" : "justify-between"} text-xs`}>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600 whitespace-nowrap">{fileType}</span>
          <span className={`text-gray-500 ${isListView ? "hidden sm:inline" : "hidden sm:inline"}`}>{fileSize}</span>
        </div>
      </div>

      {/* Actions dropdown */}
      {(onEdit || onDelete) && (
        <div
          className={`${isListView ? "ml-2 mr-2" : "absolute top-2 right-2"} opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit()
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete()
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export default function FileManager() {
  const [modules, setModules] = React.useState<Module[]>([
    {
      MODUL_ID: 1,
      MODUL_NOM: "Product Demos",
      MODUL_CREATED_AT: "2025-02-17 12:30:50",
      MODUL_DUR: 2,
      CHAPTR: [
        {
          CHAPTR_ID: 1,
          CHAPTR_NOM: "Software Demos",
          CHAPTR_CREATED_AT: "2025-02-17 12:30:50",
          DOC: [
            {
              DOC_ID: 1,
              DOC_TITLE: "Introduction",
              DOC_TYPE: "COURSE",
              DOC_FORMAT: "PDF",
              DOC_CREATED_AT: "2025-03-15 11:25:10",
              DOC_LINK: "https://css4.pub/2015/textbook/somatosensory.pdf",
            },
            {
              DOC_ID: 2,
              DOC_TITLE: "Les Basics",
              DOC_TYPE: "COURSE",
              DOC_FORMAT: "PDF",
              DOC_CREATED_AT: "2025-03-20 12:22:44",
              DOC_LINK: "https://css4.pub/2015/textbook/somatosensory.pdf",
            },
          ],
        },
        {
          CHAPTR_ID: 2,
          CHAPTR_NOM: "Hardware Demos",
          CHAPTR_CREATED_AT: "2025-02-17 12:30:50",
          DOC: [
            {
              DOC_ID: 3,
              DOC_TITLE: "Introduction",
              DOC_TYPE: "COURSE",
              DOC_FORMAT: "PDF",
              DOC_CREATED_AT: "2025-03-15 11:25:10",
              DOC_LINK: "https://css4.pub/2015/textbook/somatosensory.pdf",
            },
            {
              DOC_ID: 4,
              DOC_TITLE: "Les Basics",
              DOC_TYPE: "EXERCISE",
              DOC_FORMAT: "PDF",
              DOC_CREATED_AT: "2025-03-20 12:22:44",
              DOC_LINK: "https://css4.pub/2015/textbook/somatosensory.pdf",
            },
          ],
        },
      ],
    },
  ])

  // Track expanded state separately
  const [expandedModules, setExpandedModules] = React.useState<Record<number, boolean>>({
    1: false, // Initially collapsed
  })

  // Current location state
  const [currentPath, setCurrentPath] = React.useState<BreadcrumbItem[]>([
    { id: "all-content", name: "All Content", href: "/" },
  ])

  // Selected document for preview
  const [selectedDocument, setSelectedDocument] = React.useState<Document | null>(null)

  // Add these state variables after the other useState declarations
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isResultMinimized, setIsResultMinimized] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "exercise" | "course">("all")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [height, setHeight] = useState(300)

  // Modal states
  const [modalType, setModalType] = useState<ModalType>(null)
  const [deleteType, setDeleteType] = useState<DeleteType>(null)
  const [editingItem, setEditingItem] = useState<Module | Chapter | Document | null>(null)
  const [parentModuleId, setParentModuleId] = useState<number | null>(null)
  const [parentChapterId, setParentChapterId] = useState<number | null>(null)

  // Form states
  const [formName, setFormName] = useState("")
  const [formType, setFormType] = useState("COURSE")
  const [formFormat, setFormFormat] = useState("PDF")
  const [formLink, setFormLink] = useState("")
  const [formFile, setFormFile] = useState<File | null>(null)

  // Check if we're on mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // Function to navigate to a specific path
  const navigateTo = (path: BreadcrumbItem[]) => {
    setCurrentPath(path)

    // If navigating to a collection, expand it
    if (path.length >= 2) {
      const collectionId = path[1].id
      if (collectionId.startsWith("module-")) {
        const moduleId = Number.parseInt(collectionId.split("-")[1])
        setExpandedModules((prev) => ({
          ...prev,
          [moduleId]: true,
        }))
      }
    }

    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))

    // When clicking a module, update the breadcrumb only if we're expanding it
    const module = modules.find((m) => m.MODUL_ID === moduleId)
    if (module) {
      const isCurrentlyExpanded = expandedModules[moduleId]
      if (!isCurrentlyExpanded) {
        navigateTo([
          { id: "all-content", name: "All Content", href: "/" },
          { id: `module-${moduleId}`, name: module.MODUL_NOM, href: `/module/${moduleId}` },
        ])
      }
    }
  }

  const handleChapterClick = (moduleId: number, chapterId: number) => {
    const module = modules.find((m) => m.MODUL_ID === moduleId)
    const chapter = module?.CHAPTR.find((c) => c.CHAPTR_ID === chapterId)

    if (module && chapter) {
      navigateTo([
        { id: "all-content", name: "All Content", href: "/" },
        { id: `module-${moduleId}`, name: module.MODUL_NOM, href: `/module/${moduleId}` },
        { id: `chapter-${chapterId}`, name: chapter.CHAPTR_NOM, href: `/module/${moduleId}/chapter/${chapterId}` },
      ])
    }
  }

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
    setIsResultMinimized(false) // Expand the panel when a document is clicked

    // Give the panel a reasonable height when opening
    const savedHeight = localStorage.getItem("documentResultsHeight")
    const defaultHeight = savedHeight ? Number.parseInt(savedHeight) : 300

    // For mobile devices, use a larger portion of the screen
    if (isMobile) {
      const mobileHeight = window.innerHeight * 0.6
      setHeight(Math.max(defaultHeight, mobileHeight))
    }
  }

  // CRUD Operations for Modules
  const handleCreateModule = () => {
    setModalType("createModule")
    setFormName("")
  }

  const handleEditModule = (module: Module) => {
    setModalType("editModule")
    setEditingItem(module)
    setFormName(module.MODUL_NOM)
  }

  const handleDeleteModule = (module: Module) => {
    setDeleteType("module")
    setEditingItem(module)
  }

  // CRUD Operations for Chapters
  const handleCreateChapter = (moduleId: number) => {
    setModalType("createChapter")
    setParentModuleId(moduleId)
    setFormName("")
  }

  const handleEditChapter = (moduleId: number, chapter: Chapter) => {
    setModalType("editChapter")
    setParentModuleId(moduleId)
    setEditingItem(chapter)
    setFormName(chapter.CHAPTR_NOM)
  }

  const handleDeleteChapter = (moduleId: number, chapter: Chapter) => {
    setDeleteType("chapter")
    setParentModuleId(moduleId)
    setEditingItem(chapter)
  }

  // CRUD Operations for Documents
  const handleCreateDocument = (moduleId: number, chapterId: number) => {
    setModalType("createDocument")
    setParentModuleId(moduleId)
    setParentChapterId(chapterId)
    setFormName("")
    setFormType("COURSE")
    setFormFormat("PDF")
    setFormLink("")
    setFormFile(null)
  }

  const handleEditDocument = (moduleId: number, chapterId: number, document: Document) => {
    setModalType("editDocument")
    setParentModuleId(moduleId)
    setParentChapterId(chapterId)
    setEditingItem(document)
    setFormName(document.DOC_TITLE)
    setFormType(document.DOC_TYPE)
    setFormFormat(document.DOC_FORMAT)
    setFormLink(document.DOC_LINK)
  }

  const handleDeleteDocument = (moduleId: number, chapterId: number, document: Document) => {
    setDeleteType("document")
    setParentModuleId(moduleId)
    setParentChapterId(chapterId)
    setEditingItem(document)
  }

  // Save handlers
  const handleSaveModule = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Rest of the function remains the same
    if (modalType === "createModule") {
      // Create new module
      const newModule: Module = {
        MODUL_ID: Math.max(0, ...modules.map((m) => m.MODUL_ID)) + 1,
        MODUL_NOM: formName,
        MODUL_CREATED_AT: new Date().toISOString().replace("T", " ").substring(0, 19),
        MODUL_DUR: 0,
        CHAPTR: [],
      }

      setModules([...modules, newModule])
      toast({
        title: "Module created",
        description: `${formName} has been created successfully.`,
      })
    } else if (modalType === "editModule" && editingItem) {
      // Edit existing module
      setModules(
        modules.map((module) =>
          module.MODUL_ID === (editingItem as Module).MODUL_ID ? { ...module, MODUL_NOM: formName } : module,
        ),
      )
      toast({
        title: "Module updated",
        description: `${formName} has been updated successfully.`,
      })
    }

    setModalType(null)
  }

  const handleSaveChapter = () => {
    if (modalType === "createChapter" && parentModuleId !== null) {
      // Create new chapter
      const newChapter: Chapter = {
        CHAPTR_ID: Math.max(0, ...modules.flatMap((m) => m.CHAPTR.map((c) => c.CHAPTR_ID))) + 1,
        CHAPTR_NOM: formName,
        CHAPTR_CREATED_AT: new Date().toISOString().replace("T", " ").substring(0, 19),
        DOC: [],
      }

      setModules(
        modules.map((module) =>
          module.MODUL_ID === parentModuleId ? { ...module, CHAPTR: [...module.CHAPTR, newChapter] } : module,
        ),
      )
      toast({
        title: "Chapter created",
        description: `${formName} has been created successfully.`,
      })
    } else if (modalType === "editChapter" && editingItem && parentModuleId !== null) {
      // Edit existing chapter
      setModules(
        modules.map((module) =>
          module.MODUL_ID === parentModuleId
            ? {
                ...module,
                CHAPTR: module.CHAPTR.map((chapter) =>
                  chapter.CHAPTR_ID === (editingItem as Chapter).CHAPTR_ID
                    ? { ...chapter, CHAPTR_NOM: formName }
                    : chapter,
                ),
              }
            : module,
        ),
      )
      toast({
        title: "Chapter updated",
        description: `${formName} has been updated successfully.`,
      })
    }

    setModalType(null)
  }

  const handleSaveDocument = () => {
    if (modalType === "createDocument" && parentModuleId !== null && parentChapterId !== null) {
      // Create new document
      const newDocument: Document = {
        DOC_ID: Math.max(0, ...modules.flatMap((m) => m.CHAPTR.flatMap((c) => c.DOC.map((d) => d.DOC_ID)))) + 1,
        DOC_TITLE: formName,
        DOC_TYPE: formType,
        DOC_FORMAT: formFormat,
        DOC_CREATED_AT: new Date().toISOString().replace("T", " ").substring(0, 19),
        DOC_LINK: formLink || "https://css4.pub/2015/textbook/somatosensory.pdf", // Default link if none provided
      }

      setModules(
        modules.map((module) =>
          module.MODUL_ID === parentModuleId
            ? {
                ...module,
                CHAPTR: module.CHAPTR.map((chapter) =>
                  chapter.CHAPTR_ID === parentChapterId ? { ...chapter, DOC: [...chapter.DOC, newDocument] } : chapter,
                ),
              }
            : module,
        ),
      )
      toast({
        title: "Document created",
        description: `${formName} has been created successfully.`,
      })
    } else if (modalType === "editDocument" && editingItem && parentModuleId !== null && parentChapterId !== null) {
      // Edit existing document
      setModules(
        modules.map((module) =>
          module.MODUL_ID === parentModuleId
            ? {
                ...module,
                CHAPTR: module.CHAPTR.map((chapter) =>
                  chapter.CHAPTR_ID === parentChapterId
                    ? {
                        ...chapter,
                        DOC: chapter.DOC.map((doc) =>
                          doc.DOC_ID === (editingItem as Document).DOC_ID
                            ? {
                                ...doc,
                                DOC_TITLE: formName,
                                DOC_TYPE: formType,
                                DOC_FORMAT: formFormat,
                                DOC_LINK: formLink,
                              }
                            : doc,
                        ),
                      }
                    : chapter,
                ),
              }
            : module,
        ),
      )
      toast({
        title: "Document updated",
        description: `${formName} has been updated successfully.`,
      })
    }

    setModalType(null)
  }

  // Delete handlers
  const handleConfirmDelete = () => {
    if (deleteType === "module" && editingItem) {
      // Delete module
      setModules(modules.filter((module) => module.MODUL_ID !== (editingItem as Module).MODUL_ID))
      toast({
        title: "Module deleted",
        description: `${(editingItem as Module).MODUL_NOM} has been deleted.`,
      })

      // If we're currently viewing this module, navigate back to root
      if (currentPath.length >= 2 && currentPath[1].id === `module-${(editingItem as Module).MODUL_ID}`) {
        navigateTo([{ id: "all-content", name: "All Content", href: "/" }])
      }
    } else if (deleteType === "chapter" && editingItem && parentModuleId !== null) {
      // Delete chapter
      setModules(
        modules.map((module) =>
          module.MODUL_ID === parentModuleId
            ? {
                ...module,
                CHAPTR: module.CHAPTR.filter((chapter) => chapter.CHAPTR_ID !== (editingItem as Chapter).CHAPTR_ID),
              }
            : module,
        ),
      )
      toast({
        title: "Chapter deleted",
        description: `${(editingItem as Chapter).CHAPTR_NOM} has been deleted.`,
      })

      // If we're currently viewing this chapter, navigate back to module
      if (currentPath.length >= 3 && currentPath[2].id === `chapter-${(editingItem as Chapter).CHAPTR_ID}`) {
        const module = modules.find((m) => m.MODUL_ID === parentModuleId)
        if (module) {
          navigateTo([
            { id: "all-content", name: "All Content", href: "/" },
            { id: `module-${parentModuleId}`, name: module.MODUL_NOM, href: `/module/${parentModuleId}` },
          ])
        }
      }
    } else if (deleteType === "document" && editingItem && parentModuleId !== null && parentChapterId !== null) {
      // Delete document
      setModules(
        modules.map((module) =>
          module.MODUL_ID === parentModuleId
            ? {
                ...module,
                CHAPTR: module.CHAPTR.map((chapter) =>
                  chapter.CHAPTR_ID === parentChapterId
                    ? {
                        ...chapter,
                        DOC: chapter.DOC.filter((doc) => doc.DOC_ID !== (editingItem as Document).DOC_ID),
                      }
                    : chapter,
                ),
              }
            : module,
        ),
      )
      toast({
        title: "Document deleted",
        description: `${(editingItem as Document).DOC_TITLE} has been deleted.`,
      })

      // If this was the selected document, clear selection
      if (selectedDocument && selectedDocument.DOC_ID === (editingItem as Document).DOC_ID) {
        setSelectedDocument(null)
      }
    }

    setDeleteType(null)
    setEditingItem(null)
    setParentModuleId(null)
    setParentChapterId(null)
  }

  function filterDocuments(docs: Document[]) {
    return docs
      .filter((doc) => doc.DOC_TITLE.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((doc) => {
        if (activeTab === "all") return true
        if (activeTab === "exercise") return doc.DOC_TYPE === "EXERCISE"
        if (activeTab === "course") return doc.DOC_TYPE === "COURSE"
        return true
      })
  }

  return (
    <div className="flex flex-col h-screen bg-white md:flex-row">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            : "w-64 border-r bg-white"
        } bg-white`}
      >
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Showpad</h1>
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        <nav className="space-y-1 px-2">
          <NavItem
            href="#"
            icon={<LayoutGrid className="h-4 w-4" />}
            active={currentPath.length === 1}
            onClick={() => navigateTo([{ id: "all-content", name: "All Content", href: "/" }])}
          >
            All content
          </NavItem>
          <NavItem
            href="#"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M15 3v18M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            }
          >
            Presentations
          </NavItem>
          <NavItem
            href="#"
            icon={
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5h6m-3 4v6m-3-3h6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          >
            Analytics
          </NavItem>
          <div className="py-3">
            <div className="flex items-center justify-between px-3">
              <div className="text-xs font-medium uppercase text-gray-500">Collections</div>
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleCreateModule}>
                <Plus className="h-3 w-3" />
                <span className="sr-only">Add Module</span>
              </Button>
            </div>
            <div className="mt-2 space-y-1">
              {modules.map((module) => (
                <div key={module.MODUL_ID} className="folder-container">
                  <FolderItem
                    href={`#module-${module.MODUL_ID}`}
                    onClick={() => toggleModule(module.MODUL_ID)}
                    onEdit={() => handleEditModule(module)}
                    onDelete={() => handleDeleteModule(module)}
                    active={currentPath.length >= 2 && currentPath[1].id === `module-${module.MODUL_ID}`}
                    expandable={true}
                    expanded={expandedModules[module.MODUL_ID]}
                  >
                    {module.MODUL_NOM}
                  </FolderItem>
                  <div
                    className={cn(
                      "ml-4 mt-1 border-l border-gray-200 pl-2 overflow-hidden transition-all duration-300 ease-in-out",
                      expandedModules[module.MODUL_ID] ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {module.CHAPTR && module.CHAPTR.length > 0 ? (
                      <>
                        {module.CHAPTR.map((chapter) => (
                          <FolderItem
                            key={chapter.CHAPTR_ID}
                            href={`#module-${module.MODUL_ID}/chapter-${chapter.CHAPTR_ID}`}
                            onClick={() => handleChapterClick(module.MODUL_ID, chapter.CHAPTR_ID)}
                            onEdit={() => handleEditChapter(module.MODUL_ID, chapter)}
                            onDelete={() => handleDeleteChapter(module.MODUL_ID, chapter)}
                            active={currentPath.length >= 3 && currentPath[2].id === `chapter-${chapter.CHAPTR_ID}`}
                          >
                            {chapter.CHAPTR_NOM}
                            <span className="ml-auto text-xs text-gray-400">
                              {chapter.DOC.length > 0
                                ? `${chapter.DOC.length} ${chapter.DOC.length === 1 ? "item" : "items"}`
                                : ""}
                            </span>
                          </FolderItem>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs text-gray-500 pl-6 py-1 h-7 mt-1"
                          onClick={() => handleCreateChapter(module.MODUL_ID)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Chapter
                        </Button>
                      </>
                    ) : (
                      <div className="py-2 px-3 text-xs text-gray-400 italic">
                        No chapters yet
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-xs text-gray-500 py-1 h-7 mt-1"
                          onClick={() => handleCreateChapter(module.MODUL_ID)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Chapter
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {modules.length === 0 && <div className="py-2 px-3 text-xs text-gray-400 italic">No collections yet</div>}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto main-content-area">
        <header className="flex items-center justify-between border-b px-3 py-3 sm:px-6 sm:py-4">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search files..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 ml-2">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none border-0 h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setViewMode("grid")}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none border-0 h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setViewMode("list")}
                title="List View"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6">
          <div className="mb-4 sm:mb-6">
            <Breadcrumb items={currentPath} />
          </div>

          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as "all" | "exercise" | "course")}>
              <TabsList className="h-8 sm:h-10">
                <TabsTrigger value="all" className="text-xs sm:text-sm px-2 sm:px-4">
                  All
                </TabsTrigger>
                <TabsTrigger value="exercise" className="text-xs sm:text-sm px-2 sm:px-4">
                  Exercise
                </TabsTrigger>
                <TabsTrigger value="course" className="text-xs sm:text-sm px-2 sm:px-4">
                  Course
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {currentPath.length >= 3 && (
              <Button
                className="gap-2 text-xs sm:text-sm h-8 sm:h-9 ml-2"
                onClick={() => {
                  const moduleId = Number.parseInt(currentPath[1].id.split("-")[1])
                  const chapterId = Number.parseInt(currentPath[2].id.split("-")[1])
                  handleCreateDocument(moduleId, chapterId)
                }}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Create Document
              </Button>
            )}
            {currentPath.length === 2 && (
              <Button
                className="gap-2 text-xs sm:text-sm h-8 sm:h-9 ml-2"
                onClick={() => {
                  const moduleId = Number.parseInt(currentPath[1].id.split("-")[1])
                  handleCreateChapter(moduleId)
                }}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Create Chapter
              </Button>
            )}
            {currentPath.length === 1 && (
              <Button className="gap-2 text-xs sm:text-sm h-8 sm:h-9 ml-2" onClick={handleCreateModule}>
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Create Module
              </Button>
            )}
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-2 sm:gap-4"
            }
          >
            {currentPath.length === 3 &&
              (() => {
                // We're in a chapter, show its documents
                const moduleId = Number.parseInt(currentPath[1].id.split("-")[1])
                const chapterId = Number.parseInt(currentPath[2].id.split("-")[1])
                const module = modules.find((m) => m.MODUL_ID === moduleId)
                const chapter = module?.CHAPTR.find((c) => c.CHAPTR_ID === chapterId)

                return filterDocuments(chapter?.DOC || []).map((doc) => (
                  <DocumentCard
                    key={doc.DOC_ID}
                    title={doc.DOC_TITLE}
                    creationDate={`Created ${new Date(doc.DOC_CREATED_AT).toLocaleDateString()}`}
                    fileType={doc.DOC_FORMAT}
                    fileSize={`${doc.DOC_TYPE}`}
                    isPdf={doc.DOC_FORMAT === "PDF"}
                    isVideo={doc.DOC_FORMAT === "MP4"}
                    onClick={() => handleDocumentClick(doc)}
                    onEdit={() => handleEditDocument(moduleId, chapterId, doc)}
                    onDelete={() => handleDeleteDocument(moduleId, chapterId, doc)}
                    isListView={viewMode === "list"}
                  />
                ))
              })()}

            {currentPath.length === 2 &&
              (() => {
                // We're in a module, show all documents from all its chapters
                const moduleId = Number.parseInt(currentPath[1].id.split("-")[1])
                const module = modules.find((m) => m.MODUL_ID === moduleId)

                return module?.CHAPTR.flatMap((chapter) =>
                  filterDocuments(chapter.DOC).map((doc) => (
                    <DocumentCard
                      key={doc.DOC_ID}
                      title={doc.DOC_TITLE}
                      creationDate={`Created ${new Date(doc.DOC_CREATED_AT).toLocaleDateString()}`}
                      fileType={doc.DOC_FORMAT}
                      fileSize={`${doc.DOC_TYPE}`}
                      isPdf={doc.DOC_FORMAT === "PDF"}
                      isVideo={doc.DOC_FORMAT === "MP4"}
                      onClick={() => handleDocumentClick(doc)}
                      onEdit={() => handleEditDocument(moduleId, chapter.CHAPTR_ID, doc)}
                      onDelete={() => handleDeleteDocument(moduleId, chapter.CHAPTR_ID, doc)}
                      isListView={viewMode === "list"}
                    />
                  )),
                )
              })()}

            {currentPath.length === 1 &&
              // We're at the root, show all documents from all modules and chapters
              modules.flatMap((module) =>
                module.CHAPTR.flatMap((chapter) =>
                  filterDocuments(chapter.DOC).map((doc) => (
                    <DocumentCard
                      key={doc.DOC_ID}
                      title={doc.DOC_TITLE}
                      creationDate={`Created ${new Date(doc.DOC_CREATED_AT).toLocaleDateString()}`}
                      fileType={doc.DOC_FORMAT}
                      fileSize={`${doc.DOC_TYPE}`}
                      isPdf={doc.DOC_FORMAT === "PDF"}
                      isVideo={doc.DOC_FORMAT === "MP4"}
                      onClick={() => handleDocumentClick(doc)}
                      onEdit={() => handleEditDocument(module.MODUL_ID, chapter.CHAPTR_ID, doc)}
                      onDelete={() => handleDeleteDocument(module.MODUL_ID, chapter.CHAPTR_ID, doc)}
                      isListView={viewMode === "list"}
                    />
                  )),
                ),
              )}
          </div>
        </div>
      </div>

      {/* Fixed Document Results Panel */}
      <ResizableSplitView isMinimized={isResultMinimized} setIsMinimized={setIsResultMinimized}>
        <div className="flex flex-col md:flex-row h-full">
          <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r p-3 sm:p-4 h-1/2 md:h-full">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-medium text-sm sm:text-base">Document Preview</h3>
              <div className="flex gap-1 sm:gap-2">
                {selectedDocument && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (selectedDocument) {
                          window.open(selectedDocument.DOC_LINK, "_blank", "fullscreen=yes")
                        }
                      }}
                      title="View Full Screen"
                      className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (selectedDocument) {
                          const link = document.createElement("a")
                          link.href = selectedDocument.DOC_LINK
                          link.download = `${selectedDocument.DOC_TITLE}.${selectedDocument.DOC_FORMAT.toLowerCase()}`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }
                      }}
                      title="Download Document"
                      className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="7 10 12 15 17 10"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="12"
                          y1="15"
                          x2="12"
                          y2="3"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg h-[calc(100%-2rem)] flex items-center justify-center overflow-auto">
              {selectedDocument ? (
                selectedDocument.DOC_FORMAT === "PDF" ? (
                  <div className="text-center p-6">
                    <svg
                      className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-gray-700 mb-4">Document content cannot be displayed directly.</p>
                    <a
                      href={selectedDocument.DOC_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Open Document in New Tab
                    </a>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-gray-500 text-sm">
                      <a
                        href={selectedDocument.DOC_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Open {selectedDocument.DOC_TITLE}
                      </a>
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center p-4">
                  <svg
                    className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline points="14 2 14 8 20 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-500 text-xs sm:text-sm">Select a document to preview</p>
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 p-3 sm:p-4 h-1/2 md:h-full">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-medium text-sm sm:text-base">Document Details</h3>
              {selectedDocument && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 sm:h-8 sm:w-8"
                  onClick={() => {
                    // Find the module and chapter for this document
                    let foundModuleId = null
                    let foundChapterId = null

                    modules.forEach((module) => {
                      module.CHAPTR.forEach((chapter) => {
                        if (chapter.DOC.some((doc) => doc.DOC_ID === selectedDocument.DOC_ID)) {
                          foundModuleId = module.MODUL_ID
                          foundChapterId = chapter.CHAPTR_ID
                        }
                      })
                    })

                    if (foundModuleId !== null && foundChapterId !== null) {
                      handleEditDocument(foundModuleId, foundChapterId, selectedDocument)
                    }
                  }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              )}
            </div>
            <div className="space-y-3 sm:space-y-4 overflow-y-auto h-[calc(100%-2.5rem)]">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Title</label>
                <p className="text-xs sm:text-sm">{selectedDocument?.DOC_TITLE || "No document selected"}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                <p className="text-xs sm:text-sm">{selectedDocument?.DOC_TYPE || "-"}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Format</label>
                <p className="text-xs sm:text-sm">{selectedDocument?.DOC_FORMAT || "-"}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Created</label>
                <p className="text-xs sm:text-sm">
                  {selectedDocument ? new Date(selectedDocument.DOC_CREATED_AT).toLocaleString() : "-"}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Link</label>
                <p className="text-xs sm:text-sm">
                  {selectedDocument ? (
                    <a
                      href={selectedDocument.DOC_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate block"
                    >
                      {selectedDocument.DOC_LINK}
                    </a>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ResizableSplitView>

      {/* Create/Edit Module Modal */}
      <Dialog open={modalType === "createModule" || modalType === "editModule"} onOpenChange={() => setModalType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalType === "createModule" ? "Create New Module" : "Edit Module"}</DialogTitle>
            <DialogDescription>
              {modalType === "createModule" ? "Add a new module to your collection." : "Update the module details."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveModule()
            }}
            className="space-y-4"
          >
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="module-name">Module Name</Label>
                <Input
                  id="module-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Enter module name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalType(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!formName.trim()}>
                {modalType === "createModule" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Chapter Modal */}
      <Dialog
        open={modalType === "createChapter" || modalType === "editChapter"}
        onOpenChange={() => setModalType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalType === "createChapter" ? "Create New Chapter" : "Edit Chapter"}</DialogTitle>
            <DialogDescription>
              {modalType === "createChapter" ? "Add a new chapter to this module." : "Update the chapter details."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="chapter-name">Chapter Name</Label>
              <Input
                id="chapter-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter chapter name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveChapter} disabled={!formName.trim()}>
              {modalType === "createChapter" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Document Modal */}
      <Dialog
        open={modalType === "createDocument" || modalType === "editDocument"}
        onOpenChange={() => setModalType(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalType === "createDocument" ? "Create New Document" : "Edit Document"}</DialogTitle>
            <DialogDescription>
              {modalType === "createDocument" ? "Add a new document to this chapter." : "Update the document details."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="document-title">Document Title</Label>
              <Input
                id="document-title"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COURSE">Course</SelectItem>
                  <SelectItem value="EXERCISE">Exercise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-format">Document Format</Label>
              <Select value={formFormat} onValueChange={setFormFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="MP4">Video (MP4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-link">Document Link</Label>
              <Input
                id="document-link"
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                placeholder="Enter document URL"
              />
            </div>
            {modalType === "createDocument" && (
              <div className="space-y-2">
                <Label htmlFor="document-file">Or Upload File</Label>
                <Input
                  id="document-file"
                  type="file"
                  accept=".pdf,.mp4"
                  onChange={(e) => setFormFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500">Upload a PDF or MP4 file (max 50MB)</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalType(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDocument} disabled={!formName.trim()}>
              {modalType === "createDocument" ? "Create" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteType !== null} onOpenChange={() => setDeleteType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteType === "module" &&
                editingItem &&
                `This will permanently delete the module "${(editingItem as Module).MODUL_NOM}" and all its chapters and documents.`}
              {deleteType === "chapter" &&
                editingItem &&
                `This will permanently delete the chapter "${(editingItem as Chapter).CHAPTR_NOM}" and all its documents.`}
              {deleteType === "document" &&
                editingItem &&
                `This will permanently delete the document "${(editingItem as Document).DOC_TITLE}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Add some CSS to ensure smooth animations for folder expansion/collapse
