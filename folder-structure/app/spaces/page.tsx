import { SpaceCardList, type Space } from "@/components/SpaceCard"
import { Header } from "@/components/blocks/Header"

// Sample data for demonstration
const allSpaces: Space[] = [
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
  {
    id: "space-4",
    name: "Executive Suite",
    subtitle: "Premium workspace for professionals",
    description:
      "A premium workspace designed for executives and professionals who need a quiet, sophisticated environment with all amenities included.",
    colorPalette: ["#8B5CF6", "#6366F1"],
    size: 35,
    price: 599,
    isActive: true,
    keyPoints: ["Private Office", "Meeting Room Access", "Premium Amenities"],
    instructor: {
      id: "instructor-4",
      name: "Robert Miller",
      role: "Business Consultant",
      avatar: "/placeholder.svg?height=40&width=40",
      cvUrl: "#",
    },
    students: [
      { id: "student-13", name: "William Taylor", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-14", name: "Olivia Anderson", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: "2023-08-10T11:45:00Z",
    tags: ["executive", "premium", "private"],
    schedule: ["Mon-Fri: 8AM-8PM"],
    completedModules: 1,
    totalModules: 3,
    partner: "Executive Spaces Co.",
    partnerLogo: "/placeholder.svg?height=40&width=40",
    rating: 5.0,
    certifications: ["Business Excellence", "Executive Leadership"],
  },
  {
    id: "space-5",
    name: "Maker Space",
    subtitle: "Hands-on creative workshop",
    description:
      "A fully equipped workshop for makers, crafters, and DIY enthusiasts. Includes tools, equipment, and materials for various projects.",
    colorPalette: ["#F59E0B", "#FBBF24"],
    size: 90,
    price: 399,
    isActive: true,
    keyPoints: ["Tools & Equipment", "Material Storage", "Project Space"],
    instructor: {
      id: "instructor-5",
      name: "Jessica Wright",
      role: "Master Craftsperson",
      avatar: "/placeholder.svg?height=40&width=40",
      cvUrl: "#",
    },
    students: [
      { id: "student-15", name: "Henry Clark", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-16", name: "Amelia Lewis", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-17", name: "Lucas Walker", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: "2023-09-01T13:20:00Z",
    tags: ["maker", "workshop", "creative"],
    schedule: ["Tue-Sun: 10AM-10PM"],
    completedModules: 4,
    totalModules: 6,
    rating: 4.7,
    certifications: ["Woodworking", "3D Printing", "Electronics"],
  },
  {
    id: "space-6",
    name: "Study Lounge",
    subtitle: "Quiet space for focused work",
    description:
      "A quiet, distraction-free environment perfect for studying, reading, or focused work. Features comfortable seating, good lighting, and private booths.",
    colorPalette: ["#EC4899", "#D946EF"],
    size: 50,
    price: 199,
    isActive: true,
    keyPoints: ["Quiet Environment", "Private Booths", "Reference Library"],
    instructor: {
      id: "instructor-6",
      name: "Daniel Park",
      role: "Academic Coordinator",
      avatar: "/placeholder.svg?height=40&width=40",
      cvUrl: "#",
    },
    students: [
      { id: "student-18", name: "Harper Robinson", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-19", name: "Mason Mitchell", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-20", name: "Evelyn Carter", avatar: "/placeholder.svg?height=40&width=40" },
      { id: "student-21", name: "Logan Phillips", avatar: "/placeholder.svg?height=40&width=40" },
    ],
    createdAt: "2023-10-15T08:30:00Z",
    tags: ["study", "quiet", "focus"],
    schedule: ["Mon-Sun: 8AM-11PM"],
    completedModules: 2,
    totalModules: 2,
    rating: 4.6,
    certifications: ["Academic Excellence", "Research Methods"],
  },
]

export default function SpacesPage() {
  return (
    <div>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">All Available Spaces</h1>
        <SpaceCardList spaces={allSpaces} />
      </div>
    </div>
  )
}
