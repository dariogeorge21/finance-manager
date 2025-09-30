"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Users, BookOpen, Sparkles, ArrowRight, Home, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function DonatePage() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  const handleDonateNow = () => {
    setIsNavigating(true)
    // Wait 1.5 seconds before navigating
    setTimeout(() => {
      router.push('/donate/form')
    }, 1500)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Loading State */}
      {isNavigating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="shadow-2xl backdrop-blur-lg bg-white/95 border border-white/30 ring-1 ring-black/5 max-w-md mx-4">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Preparing Donation Form...</h3>
                  <p className="text-gray-600">Ready to make a difference for Veritas 2025</p>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Veritas-25 Donation</h1>
              <p className="text-sm text-gray-500">Support our mission</p>
            </div>
            <Link href="/">
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-pink-500/10" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mb-6">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Support <strong>Veritas 2025</strong>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Jesus Youth, Pala — A spiritual youth gathering deepening faith, fellowship, and mission
            </p>
          </div>

          {/* About Veritas 2025 */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-rose-500" />
                What is Veritas 2025?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                A spiritual youth gathering from <strong>October 17–20</strong> at <strong>St. Thomas College, Pala</strong>, 
                aimed at deepening faith, fellowship, and mission.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  🎥 Experience the Power of Faith: 
                  <a 
                    href="https://www.instagram.com/reel/DPEkhb-klR3/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                  >
                    Watch on Instagram
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Impact Areas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Empower Youth</h3>
                  <p className="text-gray-600">
                    Support youth who cannot afford full costs to participate in this transformative experience
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiply Impact</h3>
                  <p className="text-gray-600">
                    Participants carry the fire back to their communities, multiplying the impact exponentially
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Invest in Formation</h3>
                  <p className="text-gray-600">
                    Form leaders committed to faith and action who will shape the future of their communities
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Funding Needs */}
          <Card className="mb-8 shadow-lg border-2 border-rose-200">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
                Funding Needs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Assistance:</strong> Travel, lodging, and meals for participants who need financial support
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Event Infrastructure:</strong> Venue, logistics, sound & stage setup for impactful presentations
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Program Materials:</strong> Printing, outreach transport, and educational resources
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Team Support:</strong> Staff & volunteer support for smooth event execution
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-gray-700">
                    <strong>Follow-up:</strong> Post-event follow-up initiatives to sustain the impact
                  </p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-gray-800 text-center font-medium">
                  <strong>Pray with us:</strong> Visit{' '}
                  <a 
                    href="https://veritas25.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    veritas25.vercel.app
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
                <p className="text-rose-50 text-lg mb-6">
                  Your generous donation will help us continue our mission of enriching young lives through faith
                </p>
                <Button 
                  onClick={handleDonateNow}
                  disabled={isNavigating}
                  size="lg" 
                  className="bg-white text-rose-600 hover:bg-rose-50 text-lg px-8 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {isNavigating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      Donate Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
                <p className="text-rose-100 text-sm mt-4">
                  Secure payment powered by Razorpay
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Organized by <strong>Jesus Youth Pala</strong> | All donations are used for program activities and student support
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

