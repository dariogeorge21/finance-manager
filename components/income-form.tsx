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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { LoadingSpinner } from './ui/loading-progress'
import { toast } from 'sonner'
import { Income, CallBooth } from '@/types'
import { Users, Check } from 'lucide-react'

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
  const [contacts, setContacts] = useState<CallBooth[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [contactSelectorOpen, setContactSelectorOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      called_status: false,
      amount: 0,
      called_by: '',
      name: '',
      phone_number: '',
      description: '',
    }
  })

  const calledStatus = watch('called_status')

  // Fetch Call Booth contacts
  const fetchContacts = async () => {
    setIsLoadingContacts(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/call-booth`)
      const data = await response.json()

      if (response.ok) {
        setContacts(data.callBooth || [])
      } else {
        console.error('Failed to load contacts')
      }
    } catch (error) {
      console.error('Network error loading contacts:', error)
    } finally {
      setIsLoadingContacts(false)
    }
  }

  // Fetch contacts when form opens
  useEffect(() => {
    if (isOpen) {
      fetchContacts()
    }
  }, [isOpen, projectId])

  // Reset search query when popover closes
  useEffect(() => {
    if (!contactSelectorOpen) {
      setSearchQuery('')
    }
  }, [contactSelectorOpen])

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

  // Handle editData changes - reset form when editData changes
  useEffect(() => {
    if (editData) {
      reset({
        name: editData.name,
        phone_number: editData.phone_number || '',
        called_by: editData.called_by || '',
        amount: editData.amount,
        description: editData.description || '',
        date: editData.date,
        called_status: editData.called_status,
      })
      setDateInput(formatISOToDDMMYYYY(editData.date))
    } else {
      reset({
        date: new Date().toISOString().split('T')[0],
        called_status: false,
        amount: 0,
        called_by: '',
        name: '',
        phone_number: '',
        description: '',
      })
      setDateInput(formatISOToDDMMYYYY(new Date().toISOString().split('T')[0]))
    }
  }, [editData, reset])

  const onSubmit = async (data: IncomeFormData) => {
    setIsLoading(true)
    
    try {
      const url = editData ? `/api/projects/${projectId}/income/${editData.id}` : `/api/projects/${projectId}/income`
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

  const handleContactSelect = (contact: CallBooth) => {
    // Use setValue with proper options to ensure the form state is updated correctly
    setValue('name', contact.name, { shouldValidate: true, shouldDirty: true })
    setValue('phone_number', contact.phone_number, { shouldValidate: true, shouldDirty: true })

    // Don't close the popover immediately to maintain scroll functionality
    // User can click outside or select another contact
    toast.success('Contact details populated')
  }

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.phone_number.toLowerCase().includes(searchLower)
    )
  })

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
          {/* Contact Selector */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md border border-dashed">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Select from Call Booth contacts
              </span>
            </div>
            <Popover open={contactSelectorOpen} onOpenChange={setContactSelectorOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoadingContacts}
                >
                  {isLoadingContacts ? 'Loading...' : 'Select Contact'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {contacts.length === 0
                        ? 'No contacts found. Add contacts in Call Booth first.'
                        : 'No matching contacts found.'}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredContacts.map((contact) => {
                        const isSelected = watch('name') === contact.name && watch('phone_number') === contact.phone_number
                        return (
                          <CommandItem
                            key={contact.id}
                            value={`${contact.name}-${contact.phone_number}`}
                            onSelect={() => handleContactSelect(contact)}
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{contact.name}</span>
                                {isSelected && (
                                  <Check className="h-4 w-4 text-emerald-600" />
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">{contact.phone_number}</span>
                            </div>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
                <div className="border-t p-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setContactSelectorOpen(false)}
                    className="w-full"
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone number *</Label>
            <Input
              id="phone_number"
              type="tel"
              placeholder="Enter phone number"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter description"
              rows={3}
              {...register('description')}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              aria-pressed={calledStatus}
              onClick={() => setValue('called_status', !calledStatus)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 ${calledStatus ? 'bg-emerald-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${calledStatus ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
            <Label htmlFor="called_status" className="text-sm font-normal select-none">
              {calledStatus ? 'Transferred' : 'Not Transferred'}
            </Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="called_by">Collector</Label>
            <Input
              id="called_by"
              placeholder="Enter name of collector"
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
                  <LoadingSpinner size="sm" theme="white" className="mr-2" />
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