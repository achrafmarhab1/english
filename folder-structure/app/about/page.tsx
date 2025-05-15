import { Header } from "@/components/blocks/Header"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div>
      <Header />
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About SpaceHub</h1>

          <p className="text-lg mb-6">
            SpaceHub is a platform that connects people with the perfect spaces for their needs, whether it's for work,
            creativity, wellness, or learning.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            Our mission is to create a world where everyone has access to the spaces they need to thrive. We believe
            that the right environment can inspire creativity, boost productivity, and enhance wellbeing.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p className="mb-6">
            SpaceHub was founded in 2022 by a group of entrepreneurs who were frustrated with the lack of flexible,
            high-quality spaces available for their various projects. What started as a simple idea has grown into a
            comprehensive platform connecting space owners with those who need them.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
          <p className="mb-6">
            Our diverse team brings together expertise in real estate, technology, design, and customer service. We're
            united by our passion for creating meaningful connections and empowering people through access to the right
            spaces.
          </p>

          <div className="mt-12">
            <Button size="lg">Contact Us</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
