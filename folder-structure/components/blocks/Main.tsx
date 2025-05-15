import { Button } from "@/components/ui/button"
import { SpaceCardList, type Space } from "@/components/SpaceCard"
import { Link } from "next/link"

// Sample data for demonstration
const featuredSpaces: Space[] = [
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
]

export function Main() {
  return (
    <main className="container mx-auto py-12">
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Featured Spaces</h2>
          <p className="text-muted-foreground mt-2">Discover our most popular and highly-rated spaces</p>
        </div>
        <SpaceCardList spaces={featuredSpaces} />
      </section>

      <section className="py-16 bg-muted/30 rounded-lg">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Find Your Perfect Space</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you need a quiet place to work, a collaborative environment, or a specialized workshop, we have the
            perfect space for you.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/spaces">Browse All Spaces</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
