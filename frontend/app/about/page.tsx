import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Gamepad2, Users, Zap, Trophy, Heart } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: <Gamepad2 className="w-8 h-8 text-cyan-400" />,
      title: "Physical Gaming",
      description: "Experience Pong on a real, physical table with tactile controls and authentic gameplay.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Multiplayer Competition",
      description: "Challenge friends locally or compete against players from around the world.",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Real-time Tracking",
      description: "Advanced sensors track every move with precision for accurate scoring and statistics.",
    },
    {
      icon: <Trophy className="w-8 h-8 text-green-400" />,
      title: "Global Leaderboards",
      description: "Climb the ranks and prove you're the ultimate Pong champion worldwide.",
    },
  ]

  const teamMembers = [
    {
      name: "Alex Thompson",
      role: "Founder & CEO",
      description: "Passionate gamer and entrepreneur with 10+ years in the gaming industry.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      description: "Full-stack developer specializing in real-time gaming applications.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Mike Rodriguez",
      role: "Hardware Engineer",
      description: "Expert in IoT and sensor technology, bringing the physical game to life.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PongMaster</span>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">About Us</Badge>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              PongMaster
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the classic game of Pong by combining nostalgic gameplay with modern technology,
            creating an immersive physical gaming experience that brings people together.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm mb-16">
          <CardContent className="p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  To bridge the gap between digital and physical gaming by creating authentic, tactile experiences that
                  celebrate the origins of video games while embracing modern competitive gaming culture.
                </p>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold">Made with passion for gaming</span>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl border border-white/10 flex items-center justify-center">
                  <Target className="w-24 h-24 text-white/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">What Makes Us Special</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <Badge className="mb-4 bg-purple-500/20 text-purple-400 border-purple-500/30">{member.role}</Badge>
                  <p className="text-gray-300 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-white text-center mb-12">By the Numbers</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-cyan-400 mb-2">1,247</div>
                <div className="text-gray-300">Active Players</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">15,892</div>
                <div className="text-gray-300">Games Played</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-gray-300">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
                <div className="text-gray-300">Player Satisfaction</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-gray-300 text-lg mb-8">Have questions or want to learn more about PongMaster?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:hello@pongmaster.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              hello@pongmaster.com
            </a>
            <span className="text-gray-500 hidden sm:block">|</span>
            <a href="tel:+1234567890" className="text-purple-400 hover:text-purple-300 transition-colors">
              +1 (234) 567-8900
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
