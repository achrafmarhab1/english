import { SpaceCardList, type Space } from "@/components/SpaceCard"
import { Header } from "@/components/blocks/Header"

// Sample data for demonstration
const sampleSpaces: Space[] = [
  {
    id: "space-1",
    name: "Creative Studio",
    subtitle: "A space for creative professionals",
    description:
      "A fully equipped studio for creative professionals with high-speed internet, comfortable seating, and all the tools you need to bring your ideas to life.",
    colorPalette: ["#4F46E5", "#7C3AED"],
    size: 45,
    price: 299,
    isActive: true,
    keyPoints: ["High-speed WiFi", "24/7 Access", "Creative Environment"],
    instructor: {
      id: "instructor-1",
      name: "Alex Johnson",
      role: "Creative Director",
      avatar: "/placeholder.svg?height=40&width=40",
      cvUrl: "#",
    },
    students: [
      { id: "student-1", name: "Emma Wilson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-2", name: "James Brown", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-3", name: "Sophia Davis", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-4", name: "Oliver Smith", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: "2023-05-15T10:00:00Z",
    tags: ["creative", "studio", "design"],
    schedule: ["Mon-Fri: 9AM-6PM", "Sat: 10AM-4PM"],
    completedModules: 3,
    totalModules: 5,
    rating: 4.8,
    certifications: ["Adobe Creative Suite", "Design Thinking"],
  },
  {
    id: "space-2",
    name: "Tech Hub",
    subtitle: "Collaborative space for tech enthusiasts",
    description:
      "A collaborative environment designed for tech professionals and startups. Features meeting rooms, event spaces, and networking opportunities.",
    colorPalette: ["#0EA5E9", "#06B6D4"],
    size: 75,
    price: 499,
    isActive: true,
    keyPoints: ["Meeting Rooms", "Event Space", "Networking"],
    instructor: {
      id: "instructor-2",
      name: "Sarah Chen",
      role: "Tech Lead",
      avatar: "/placeholder.svg?height=40&width=40",
      cvUrl: "#",
    },
    students: [
      { id: "student-5", name: "Noah Williams", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-6", name: "Ava Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-7", name: "Ethan Brown", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: "2023-06-20T14:30:00Z",
    tags: ["tech", "startup", "collaboration"],
    schedule: ["24/7 Access"],
    completedModules: 2,
    totalModules: 8,
    partner: "TechStart Inc.",
    partnerLogo: "/placeholder.svg?height=40&width=40",
    rating: 4.5,
    certifications: ["AWS Certified", "Full Stack Development"],
  },
  {
    id: "space-3",
    name: "Wellness Center",
    subtitle: "A space for health and wellness",
    description:
      "A peaceful environment focused on health and wellness. Includes yoga studio, meditation rooms, and health-focused amenities.",
    colorPalette: ["#10B981", "#34D399"],
    size: 60,
    price: 349,
    isActive: false,
    keyPoints: ["Yoga Studio", "Meditation Rooms", "Healthy Snacks"],
    instructor: {
      id: "instructor-3",
      name: "Michael Lee",
      role: "Wellness Coach",
      avatar: "/placeholder.svg?height=40&width=40",
      cvUrl: "#",
    },
    students: [
      { id: "student-8", name: "Isabella Martinez", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-9", name: "Liam Thompson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-10", name: "Mia Garcia", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-11", name: "Benjamin Wilson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-12", name: "Charlotte Davis", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: "2023-07-05T09:15:00Z",
    tags: ["wellness", "health", "yoga"],
    schedule: ["Mon-Sun: 7AM-9PM"],
    completedModules: 5,
    totalModules: 5,
    rating: 4.9,
    certifications: ["Yoga Instructor", "Meditation Guide", "Nutrition Basics"],
  },
]

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <header className="mt-20">
            <h1 className="text-4xl font-bold">Spaces</h1>
          </header>

          <SpaceCardList spaces={sampleSpaces} />
        </div>
      </main>
    </>
  )
}
