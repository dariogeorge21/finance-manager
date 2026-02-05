"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoadingSpinner } from './ui/loading-progress'
import { toast } from 'sonner'
import { Expense } from '@/types'

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  who: z.string().min(1, 'Who is required'),
  phone_number: z.string().optional(),
  payment_method: z.string().min(1, 'Payment method is required'),
  approved_by: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
  editData?: Expense | null
}

const categories = [
  'Food',
  'Transport & Fuel',
  'Resource Utilities',
  'Program Expenses',
  'Medical & Hospitality',
  'Arts & Decoration',
  'Intercession',
  'Coordination',
  'Bills & Utilities',
  'Travel Allowance',
  'Other'
]

const paymentMethods = [
  'Cash',
  'UPI',
  'Card',
  'Cheque',
  'Bank Transfer',
  'Other'
]

export function ExpenseForm({ isOpen, onClose, onSuccess, projectId, editData }: ExpenseFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      category: 'Other',
      payment_method: 'Cash',
      who: '',
      phone_number: '',
      approved_by: '',
    }
  })

  // Handle editData changes - reset form when editData changes
  useEffect(() => {
    if (editData) {
      reset({
        description: editData.description,
        amount: editData.amount,
        date: editData.date,
        category: editData.category,
        who: editData.who,
        phone_number: editData.phone_number || '',
        payment_method: editData.payment_method,
        approved_by: editData.approved_by || '',
      })
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        category: 'Other',
        payment_method: 'Cash',
        who: '',
        phone_number: '',
        approved_by: '',
      })
    }
  }, [editData, reset])

  const onSubmit = async (data: ExpenseFormData) => {
    setIsLoading(true)
    
    try {
      const url = editData ? `/api/projects/${projectId}/expenses/${editData.id}` : `/api/projects/${projectId}/expenses`
      const method = editData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        toast.success(`Expense ${editData ? 'updated' : 'added'} successfully!`)
        reset()
        onClose()
        onSuccess()
      } else {
        const result = await response.json()
        toast.error(result.error || `Failed to ${editData ? 'update' : 'add'} expense`)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {editData ? 'Update the expense details below.' : 'Enter the expense details below.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="who">Who? *</Label>
            <Input
              id="who"
              placeholder="Name of person"
              {...register('who')}
            />
            {errors.who && (
              <p className="text-sm text-destructive">{errors.who.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone</Label>
              <Input
                id="phone_number"
                placeholder="9876543210"
                {...register('phone_number')}
              />
              {errors.phone_number && (
                <p className="text-sm text-destructive">{errors.phone_number.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method *</Label>
              <Select onValueChange={(value) => setValue('payment_method', value)} defaultValue={editData?.payment_method || 'Cash'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.payment_method && (
                <p className="text-sm text-destructive">{errors.payment_method.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="1500.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={(value) => setValue('category', value)} defaultValue={editData?.category || 'Other'}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Grocery shopping, fuel, etc..."
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          

          
          
          <div className="space-y-2">
            <Label htmlFor="approved_by">Approved By</Label>
            <Input
              id="approved_by"
              placeholder="Approver name"
              {...register('approved_by')}
            />
            {errors.approved_by && (
              <p className="text-sm text-destructive">{errors.approved_by.message}</p>
            )}
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" theme="white" className="mr-2" />
                  {editData ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editData ? 'Update Expense' : 'Add Expense'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}