import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
            <CardTitle className="text-2xl">Contact Us</CardTitle>
            <CardDescription>Veritas-25 — Support and enquiries</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-gray-700">
              For payment-related queries, you may contact our payment processor via the following page, or
              reach out to us through our usual communication channels.
            </p>
            <Link href="https://merchant.razorpay.com/policy/R3IIxPsqv5bKyo/contact_us" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                Contact via Razorpay
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 