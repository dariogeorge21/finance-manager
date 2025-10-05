import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      contributionData
    } = await request.json()

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Get Veritas-25 project ID
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('project_name', 'veritas25')
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Veritas-25 project not found' },
        { status: 404 }
      )
    }

    // Store contribution in income table
    const { error: insertError } = await supabaseAdmin
      .from('income')
      .insert({
        project_id: project.id,
        name: contributionData.name,
        phone_number: contributionData.phone_number,
        amount: contributionData.amount,
        description: contributionData.message || 'Contribution for Veritas-25',
        date: new Date().toISOString().split('T')[0],
        called_status: true,
        called_by: 'CONTRIBUTION'
      })

    if (insertError) {
      console.error('Error storing contribution:', insertError)
      return NextResponse.json(
        { error: 'Failed to store contribution record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
