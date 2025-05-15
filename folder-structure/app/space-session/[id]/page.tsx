"use client"
import { Header } from "@/components/blocks/Header"
import { Calendar, type Event } from "@/components/Calendar"
import FileManager from "@/components/file-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Fix the sample events to ensure start and end are proper Date objects
const sampleEvents: Event[] = [
  {
    id: "event-1",
    title: "Space Introduction",
    description: "Welcome session and overview of the space features",
    status: "scheduled",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    instructor: {
      name: "Sarah Johnson",
      role: "Lead Designer",
      avatar: "https://github.com/shadcn.png",
    },
    meetingUrl: "https://meet.example.com/space-intro",
  },
  {
    id: "event-2",
    title: "Design Workshop",
    description: "Hands-on workshop exploring design principles",
    status: "in-progres",
    start: new Date(new Date().setHours(14, 0, 0, 0)),
    end: new Date(new Date().setHours(16, 0, 0, 0)),
    instructor: {
      name: "Mike Chen",
      role: "Senior Developer",
      avatar: "https://github.com/shadcn.png",
    },
    meetingUrl: "https://meet.example.com/design-workshop",
  },
  {
    id: "event-3",
    title: "Project Review",
    description: "Review of current projects and feedback session",
    status: "completed",
    start: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(13, 0, 0, 0)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(14, 30, 0, 0)),
    instructor: {
      name: "Alex Johnson",
      role: "Project Manager",
      avatar: "https://github.com/shadcn.png",
    },
    meetingUrl: "https://meet.example.com/project-review",
  },
  {
    id: "event-4",
    title: "Team Collaboration",
    description: "Collaborative session for team members",
    status: "scheduled",
    start: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 0, 0, 0)),
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(12, 30, 0, 0)),
    instructor: {
      name: "Jessica Wright",
      role: "Team Lead",
      avatar: "https://github.com/shadcn.png",
    },
    meetingUrl: "https://meet.example.com/team-collab",
  },
]

// Rest of your page component code
export default function SpaceSessionPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Header />
      <div className="container mx-auto py-8 mt-16">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="mb-6 h-10 bg-muted/50 p-1 rounded-md">
            <TabsTrigger
              value="calendar"
              className="rounded-sm px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="rounded-sm px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Files & Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="mt-0">
            <Calendar events={sampleEvents} />
          </TabsContent>

          <TabsContent value="files" className="mt-0">
            <FileManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
