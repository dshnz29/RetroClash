import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Zap, Target, ArrowRight, Play } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
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
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <Link href="/game" className="text-white hover:text-cyan-400 transition-colors">
                Game
              </Link>
              <Link href="/leaderboard" className="text-white hover:text-cyan-400 transition-colors">
                Leaderboard
              </Link>
              <Link href="/about" className="text-white hover:text-cyan-400 transition-colors">
                About
              </Link>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Link href="/game">
                <Play className="w-4 h-4 mr-2" />
                Play Now
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Physical Gaming Experience</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Master the
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Classic{" "}
            </span>
            Pong
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Experience the legendary game that started it all. Compete against friends, climb the leaderboard, and
            become the ultimate Pong champion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Link href="/game">
                <Play className="w-5 h-5 mr-2" />
                Start Playing
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/leaderboard">
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Game Preview */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="aspect-video bg-black rounded-lg border-2 border-cyan-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5" />

              {/* Pong Game Simulation */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Left Paddle */}
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-white rounded-full" />

                {/* Right Paddle */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-white rounded-full" />

                {/* Ball */}
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />

                {/* Center Line */}
                <div
                  className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 transform -translate-x-1/2"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(to bottom, white 0px, white 10px, transparent 10px, transparent 20px)",
                  }}
                />

                {/* Score */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-8 text-white text-4xl font-mono">
                  <span>12</span>
                  <span className="text-white/50">:</span>
                  <span>08</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose PongMaster?</h2>
          <p className="text-gray-300 text-lg">Experience the perfect blend of nostalgia and modern gaming</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Trophy className="w-10 h-10 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Competitive Play</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Climb the global leaderboard and prove you're the ultimate Pong champion
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Users className="w-10 h-10 text-blue-400 mb-2" />
              <CardTitle className="text-white">Multiplayer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Challenge friends locally or compete against players worldwide
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Zap className="w-10 h-10 text-purple-400 mb-2" />
              <CardTitle className="text-white">Real-time Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Track your performance with detailed statistics and analytics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <Target className="w-10 h-10 text-green-400 mb-2" />
              <CardTitle className="text-white">Physical Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Connect to our physical Pong table for an authentic gaming experience
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Ready to Play?</h3>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of players and start your journey to becoming a Pong legend
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              <Link href="/game">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Login Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">P</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to PongMaster</h1>
            <p className="text-gray-400">Sign in to start playing</p>
          </div>
          <LoginForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">PongMaster</span>
            </div>
            <p className="text-gray-400 text-sm">© 2024 PongMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
