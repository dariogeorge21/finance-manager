"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Heart, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

// Razorpay type declaration
declare global {
  interface Window {
    Razorpay: any
  }
}

const donationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_number: z.string().min(10, 'Please enter a valid phone number').regex(/^[0-9]{10,15}$/, 'Phone number must contain only digits'),
  amount: z.number().min(1, 'Amount must be at least ₹1'),
  message: z.string().optional(),
})

type ContributionFormData = z.infer<typeof donationSchema>

export default function ContributionFormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContributionFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: '',
      phone_number: '',
      amount: 0,
      message: '',
    }
  })

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const onSubmit = async (data: ContributionFormData) => {
    setIsLoading(true)

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.')
        setIsLoading(false)
        return
      }

      // Create order
      const orderResponse = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: data.amount }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        toast.error(errorData.error || 'Failed to create order')
        setIsLoading(false)
        return
      }

      const orderData = await orderResponse.json()

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Veritas-25',
        description: 'Contribution for Veritas-25 Program',
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verify payment
          try {
            const verifyResponse = await fetch('/api/donations/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                contributionData: data,
              }),
            })

            if (verifyResponse.ok) {
              setShowSuccess(true)
              reset()
              toast.success('Thank you for contributing to Veritas 2025. May God bless you.')

              const receiptPayload = {
                name: data.name,
                amount: data.amount,
                phoneNumber: data.phone_number,
                orderId: response.razorpay_order_id,
                receiptNumber: `${response.razorpay_payment_id}`,
                datetime: new Date().toISOString(),
              }
              try {
                sessionStorage.setItem('contribution_receipt', JSON.stringify(receiptPayload))
              } catch {}

              // Show receipt generation loading state
              setIsGeneratingReceipt(true)
              
              // Wait 2.5 seconds before navigating to receipt
              setTimeout(() => {
                router.push('/contribute/receipt')
              }, 2500)
            } else {
              const errorData = await verifyResponse.json()
              toast.error(errorData.error || 'Payment verification failed')
            }
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.')
          } finally {
            setIsLoading(false)
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false)
            toast.error('Payment cancelled')
          }
        },
        prefill: {
          name: data.name,
          contact: data.phone_number,
        },
        theme: {
          color: '#f43f5e',
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      <Toaster />

      {/* Background image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-center bg-cover opacity-100 print:opacity-80 z-0"
        style={{
          backgroundImage:
            "url('https://i.etsystatic.com/39411876/r/il/9e838e/5568653410/il_570xN.5568653410_eq77.jpg')",
        }}
      />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Make a Contribution</h1>
              <p className="text-sm text-gray-500">Support Veritas-25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Generation Loading State */}
      {isGeneratingReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="shadow-2xl backdrop-blur-lg bg-white/95 border border-white/30 ring-1 ring-black/5 max-w-md mx-4">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">Generating Receipt...</h3>
                  <p className="text-gray-600">Please wait while we prepare your receipt</p>
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

      {/* Form Section */}
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
        <Card className="shadow-2xl backdrop-blur-lg bg-white/80 border border-white/30 ring-1 ring-black/5">
          <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <CardTitle className="text-2xl">Contribution Form</CardTitle>
                <CardDescription className="text-base">
                  Fill in your details to proceed with the contribution
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  {...register('name')}
                  disabled={isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number *</Label>
                <Input
                  id="phone_number"
                  placeholder="Enter your phone number"
                  {...register('phone_number')}
                  disabled={isLoading}
                />
                {errors.phone_number && (
                  <p className="text-sm text-destructive">{errors.phone_number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Contribution Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="1"
                  min="1"
                  placeholder="Enter amount"
                  {...register('amount', { valueAsNumber: true })}
                  disabled={isLoading}
                />
                {errors.amount && (
                  <p className="text-sm text-destructive">{errors.amount.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Suggested amounts: ₹100, ₹500, ₹1000, or any amount you wish
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a message or prayer request (optional)"
                  rows={4}
                  {...register('message')}
                  disabled={isLoading}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You will be redirected to Razorpay's secure payment gateway to complete your contribution.
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-lg py-6 h-auto font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" fill="currentColor" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Secure payment powered by Razorpay
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

