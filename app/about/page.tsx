import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  BookOpen, 
  Heart, 
  Sparkles, 
  Home, 
  ChevronRight,
  Calendar,
  MapPin,
  Star,
  Church,
  Target,
  Globe
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
              <p className="text-sm text-gray-500">Jesus Youth Pala & Veritas-25</p>
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
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-white-500 to-white-600 rounded-full mb-6 p-2">
              <img 
                src="https://jesusyouth.org.au/wp-content/uploads/2013/10/jy-logo-only-Fine.png" 
                alt="Jesus Youth Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Jesus Youth <strong>Pala</strong>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A Catholic youth movement dedicated to evangelization, spiritual growth, community life, and service
            </p>
          </div>

          {/* Jesus Youth Pala Overview */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Church className="w-6 h-6 text-blue-500" />
                About Jesus Youth Pala
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Jesus Youth is a <strong>Catholic youth movement</strong> that is part of the global Jesus Youth network 
                founded in Kerala, India. Our movement focuses on empowering young people to live authentic Christian lives 
                and to be witnesses of Christ's love in today's world.
              </p>
              <p className="text-lg leading-relaxed">
                <strong>Pala Zone</strong> represents our local regional division within the Jesus Youth structure, 
                serving colleges and communities in and around the Pala area. Our Zonal Council consists of elected leaders 
                who serve dedicated terms (currently 2025-27) to guide and coordinate the movement's activities locally.
              </p>
            </CardContent>
          </Card>

          {/* Four Focus Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Evangelization</h3>
                  <p className="text-gray-600 text-sm">
                    Sharing the Good News of Jesus Christ with young people through authentic witness
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Spiritual Growth</h3>
                  <p className="text-gray-600 text-sm">
                    Deepening our relationship with God through prayer, formation, and spiritual practices
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Life</h3>
                  <p className="text-gray-600 text-sm">
                    Building strong Christian communities that support and encourage one another
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Service</h3>
                  <p className="text-gray-600 text-sm">
                    Reaching out to those in need and serving the marginalized in our society
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* College Presence */}
          <Card className="mb-8 shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="w-6 h-6 text-blue-500" />
                Our Presence in Colleges
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Colleges</h3>
                  <div className="space-y-2">
                    <Badge variant="outline" className="mr-2 mb-2">Alphonsa College</Badge>
                    <Badge variant="outline" className="mr-2 mb-2">BVM Holy Cross College</Badge>
                    <Badge variant="outline" className="mr-2 mb-2">St Thomas College</Badge>
                    <Badge variant="outline" className="mr-2 mb-2">Other colleges in Pala region</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Activities</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Prayer meetings and worship</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Fellowship gatherings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Outreach to the poor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">Various specialized ministries</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Specialized Ministries Include:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Intercession</Badge>
                  <Badge variant="secondary">Mobilization</Badge>
                  <Badge variant="secondary">Creative Ministry</Badge>
                  <Badge variant="secondary">Audio/Visual</Badge>
                  <Badge variant="secondary">Formation</Badge>
                  <Badge variant="secondary">Evangelization</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intercession Team */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Star className="w-6 h-6 text-indigo-500" />
                Intercession Ministry
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                The <strong>Intercession Team at Pala Zone</strong> for the term 2025-2027 holds a special responsibility 
                for leading our intercessory prayer ministries. This dedicated team coordinates prayer initiatives, 
                organizes prayer meetings, and serves as spiritual anchors for our community.
              </p>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-indigo-800 font-medium">
                  "Prayer is the breath of the Church, and intercession is the heartbeat of our ministry." 
                  - Our intercessors commit to lifting up the needs of our community and the world in prayer.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Veritas-25 Event */}
          <Card className="mb-8 shadow-lg border-2 border-emerald-200">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="text-2xl flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-emerald-500" />
                Veritas-25: A Spiritual Gathering
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <p className="text-lg leading-relaxed text-gray-700">
                <strong>Veritas</strong> is a signature spiritual gathering and retreat organized by Jesus Youth Pala Zone. 
                This annual event serves as a powerful time of spiritual renewal through a structured retreat format 
                featuring prayer, inspiring talks, meditation, and meaningful sharing sessions.
              </p>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 mb-2">Our Goal:</h4>
                <p className="text-emerald-800">
                  To help young members deepen their faith, connect authentically with the message of Jesus, 
                  and build lasting fellowship that extends beyond the event.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      St Thomas College
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600"><strong>Format:</strong> Three-day retreat</p>
                      <p className="text-sm text-gray-600"><strong>Dates:</strong> October 17-20, 2025</p>
                      <p className="text-sm text-gray-600"><strong>Time:</strong> Oct 17 5:30- Oct 20 6:00 PM</p>
                      <p className="text-sm text-gray-600"><strong>Platform:</strong> St Thomas College, Pala</p>
                      <p className="text-sm text-gray-600"><strong>Attendance:</strong> ~150 students</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  Veritas brings together students from colleges across the entire Pala zone, 
                  creating a diverse and vibrant spiritual community.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-600 font-medium">Unity in Faith • Diversity in Community</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
                <p className="text-blue-50 text-lg mb-6">
                  Support Veritas-25 and help us continue building a strong faith community among young people
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contribute" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Support Veritas-25
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              <strong>Jesus Youth Pala Zone</strong> | Serving the Catholic youth community since our establishment<br />
              <em>"Come and See" - John 1:39</em>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}