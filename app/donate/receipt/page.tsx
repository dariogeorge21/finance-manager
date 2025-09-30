"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { CheckCircle2, Printer, Repeat, Loader2 } from 'lucide-react'

type ReceiptData = {
  name: string
  amount: number
  phoneNumber: number
  orderId?: string
  receiptNumber: string
  datetime: string
}

export default function DonationReceiptPage() {
  const router = useRouter()
  const [data, setData] = useState<ReceiptData | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('donation_receipt')
      if (!raw) {
        toast.error('Receipt data not found. Please make a donation first.')
        return
      }
      const parsed: ReceiptData = JSON.parse(raw)
      setData(parsed)
    } catch (err) {
      toast.error('Could not load receipt data.')
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleMakeAnotherDonation = () => {
    setIsNavigating(true)
    // Wait 1.5 seconds before navigating
    setTimeout(() => {
      router.push('/donate/form')
    }, 1500)
  }

  const printDate = (iso?: string) => {
    try {
      const d = iso ? new Date(iso) : new Date()
      return d.toLocaleString()
    } catch {
      return new Date().toLocaleString()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      <Toaster />

      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-center bg-cover opacity-90 print:opacity-80"
        style={{
          backgroundImage:
            "url('https://i.etsystatic.com/39411876/r/il/9e838e/5568653410/il_570xN.5568653410_eq77.jpg')",
        }}
      />

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
                  <p className="text-gray-600">Thank you for considering another donation</p>
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

      {/* Content overlay */}
      <div className="relative z-10 max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 flex flex-col items-center justify-center min-h-screen">
        <Card className="shadow-2xl backdrop-blur-lg bg-white/60 border border-white/30 mt-4 sm:mt-8 lg:mt-28 ring-1 ring-black/5 print:bg-white w-full">
          <CardHeader className="border-b bg-gradient-to-r from-rose-50 to-pink-50 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-2xl truncate">Donation Receipt</CardTitle>
                <CardDescription className="text-sm sm:text-base">Payment Successful — Veritas-25</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 lg:p-8">
            {!data ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-gray-700 mb-2 font-medium text-sm sm:text-base">We couldn't find your receipt details.</p>
                <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">If you just completed a donation, please return to the donation form and try again.</p>
                <div className="flex items-center justify-center gap-3">
                  <Button 
                    onClick={handleMakeAnotherDonation}
                    disabled={isNavigating}
                    className="bg-gradient-to-r from-rose-500 to-pink-600 text-white no-print"
                  >
                    {isNavigating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Repeat className="w-4 h-4 mr-2" />
                        Make a Donation
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Thank you for your generosity</h2>
                  <p className="text-gray-600 text-sm sm:text-base">Jesus Youth, Pala appreciates your support. May God bless you.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-white/70 rounded-lg border p-3 sm:p-4">
                  <div>
                    <p className="text-sm text-gray-500">Donor Name</p>
                    <p className="font-medium text-gray-900 break-words">{data.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Donation Amount</p>
                    <p className="font-semibold text-gray-900">₹ {data.amount.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-mono text-gray-900 break-all">{data.phoneNumber}</p>
                  </div>
                  {data.orderId && (
                    <div>
                      <p className="text-sm text-gray-500">Razorpay Order ID</p>
                      <p className="font-mono text-gray-900 break-all">{data.orderId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="text-gray-900">{printDate(data.datetime)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Receipt Number</p>
                    <p className="font-mono text-gray-900 break-all">{data.receiptNumber}</p>
                  </div>
                </div>

                <div className="text-center text-gray-700">
                  <p className="font-semibold">Veritas-25</p>
                  <p className="text-sm">Jesus Youth, Pala</p>
                  <p className="italic mt-2">May God bless you.</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-6 border-t">
            <div className="flex items-center gap-3 no-print">
              <Button 
                variant="outline"
                onClick={handleMakeAnotherDonation}
                disabled={isNavigating}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {isNavigating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Repeat className="w-4 h-4 mr-2" />
                    <span className="hidden xs:inline">Make Another </span>Donation
                  </>
                )}
              </Button>
            </div>
            <Button 
              onClick={handlePrint} 
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white no-print w-full sm:w-auto text-sm sm:text-base"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Receipt
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: auto; margin: 12mm; }
        }
      `}</style>
    </div>
  )
}
