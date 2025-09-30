import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
            <CardTitle className="text-2xl">Terms of Use</CardTitle>
            <CardDescription>Veritas-25 — Payment and donation related terms</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <p className="text-gray-700">
              For legal compliance related to donations processed via Razorpay, please refer to our terms of
              use hosted with our payment processor.
            </p>
            <Link href="https://merchant.razorpay.com/policy/R3IIxPsqv5bKyo/terms" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
                View Terms on Razorpay
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 