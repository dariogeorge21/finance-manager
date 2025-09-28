"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from './ui/skeleton'
import { toast } from 'sonner'
import { Income } from '@/types'

const incomeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone_number: z.string().min(1, 'Phone number is required'),
  called_by: z.string().optional(),
  amount: z.number().min(0),
  description: z.string().optional(),
  date: z.string().min(1),
  called_status: z.boolean(),
})

type IncomeFormData = z.infer<typeof incomeSchema>

interface IncomeFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
  editData?: Income | null
}

export function IncomeForm({ isOpen, onClose, onSuccess, projectId, editData }: IncomeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: editData ? {
      name: editData.name,
      phone_number: editData.phone_number || '',
      called_by: (editData as any).called_by || '',
      amount: editData.amount,
      description: editData.description || '',
      date: editData.date,
      called_status: editData.called_status,
    } : {
      date: new Date().toISOString().split('T')[0],
      called_status: false,
      amount: 0,
      called_by: '',
    }
  })

  const calledStatus = watch('called_status')

  // Date helpers: format ISO (yyyy-mm-dd) to dd/mm/yyyy and parse back
  const formatISOToDDMMYYYY = (isoDate: string | undefined) => {
    if (!isoDate) return ''
    const parts = isoDate.split('-')
    if (parts.length === 3) return `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}`
    const d = new Date(isoDate)
    if (isNaN(d.getTime())) return isoDate
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
  }

  const parseDDMMYYYYToISO = (value: string) => {
    const cleaned = value.replace(/-/g, '/').trim()
    const parts = cleaned.split('/')
    if (parts.length !== 3) return null
    const [dd, mm, yyyy] = parts
    if (!/^[0-9]{1,4}$/.test(dd) || !/^[0-9]{1,2}$/.test(mm) || !/^[0-9]{2,4}$/.test(yyyy)) return null
    const iso = `${yyyy.padStart(4, '0')}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
    // basic date validity check
    const d = new Date(iso)
    if (isNaN(d.getTime())) return null
    return iso
  }

  const [dateInput, setDateInput] = useState<string>(() => formatISOToDDMMYYYY(editData?.date || new Date().toISOString().split('T')[0]))

  // sync form date -> display when form value changes (e.g., reset or editData)
  useEffect(() => {
    const current = watch('date')
    setDateInput(formatISOToDDMMYYYY(current))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch('date')])

  const onSubmit = async (data: IncomeFormData) => {
    setIsLoading(true)
    
    try {
      const url = editData ? `/api/projects/${projectId}/income/${editData.id}` : `/api/projects/${projectId}/incomes`
      const method = editData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        toast.success(`Income ${editData ? 'updated' : 'added'} successfully!`)
        reset()
        onClose()
        onSuccess()
      } else {
        const result = await response.json()
        toast.error(result.error || `Failed to ${editData ? 'update' : 'add'} income`)
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
      <DialogContent className="sm:max-w-md max-h-[80vh] sm:max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Income' : 'Add New Income'}</DialogTitle>
          <DialogDescription>
            {editData ? 'Update the income details below.' : 'Enter the income details below.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter Name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              placeholder="Enter Phone Number"
              {...register('phone_number')}
            />
            {errors.phone_number && (
              <p className="text-sm text-destructive">{errors.phone_number.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="text"
                placeholder="DD/MM/YYYY"
                value={dateInput}
                onChange={(e) => {
                  const val = e.target.value
                  setDateInput(val)
                  const iso = parseDDMMYYYYToISO(val)
                  if (iso) {
                    setValue('date', iso)
                  } else {
                    setValue('date', '')
                  }
                }}
                onBlur={() => {
                  const iso = parseDDMMYYYYToISO(dateInput)
                  if (iso) setDateInput(formatISOToDDMMYYYY(iso))
                }}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Call Notes</Label>
            <Textarea
              id="description"
              placeholder="Enter Call Notes"
              rows={3}
              {...register('description')}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              aria-pressed={calledStatus}
              onClick={() => setValue('called_status', !calledStatus)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${calledStatus ? 'bg-emerald-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${calledStatus ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
            <Label htmlFor="called_status" className="text-sm font-normal select-none">
              {calledStatus ? 'Marked as called/contacted' : 'Mark as called/contacted'}
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="called_by">Called By</Label>
            <Input
              id="called_by"
              placeholder="Enter name of caller"
              {...register('called_by')}
            />
            {errors.called_by && (
              <p className="text-sm text-destructive">{(errors.called_by as any)?.message}</p>
            )}
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? (
                <>
                  <Skeleton className="mr-2" />
                  {editData ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editData ? 'Update Income' : 'Add Income'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}