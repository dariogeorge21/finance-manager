"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { ChevronUp, ChevronDown, Phone, MessageCircle } from 'lucide-react'
import { CallBooth } from '@/types'
import { toast } from 'sonner'

interface CallBoothPopupProps {
  projectId: string
}

export function CallBoothPopup({ projectId }: CallBoothPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [contacts, setContacts] = useState<CallBooth[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchContacts()
  }, [projectId])

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/call-booth`)
      const data = await response.json()
      
      if (response.ok) {
        // Filter to show only not contacted entries
        const notContacted = data.callBooth.filter((c: CallBooth) => !c.contacted)
        setContacts(notContacted)
        if (notContacted.length > 0) {
          setCurrentIndex(0)
        }
      }
    } catch (error) {
      console.error('Failed to fetch call booth contacts:', error)
    }
  }

  const handleToggleContacted = async (contact: CallBooth) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/call-booth/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacted: !contact.contacted }),
      })

      if (response.ok) {
        toast.success(`Contact marked as ${!contact.contacted ? 'called' : 'not called'}`)
        fetchContacts() // Refresh the list
      } else {
        toast.error('Failed to update contact status')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleWhatsApp = (phoneNumber: string, name: string) => {
    const message = encodeURIComponent(`Hello ${name}, I'm reaching out regarding financial assistance.`)
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  const handlePhoneCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`
  }

  const handleNext = () => {
    if (currentIndex < contacts.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (contacts.length === 0) {
    return null // Don't show popup if no contacts
  }

  const currentContact = contacts[currentIndex]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          <ChevronUp className="w-6 h-6" />
        </Button>
      )}

      {/* Popup Card */}
      {isOpen && (
        <Card className="w-80 shadow-2xl animate-in slide-in-from-bottom-5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Call Booth</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              {currentIndex + 1} of {contacts.length} contacts
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Contact Info */}
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-gray-500">Name</Label>
                <p className="font-medium">{currentContact.name}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Phone Number</Label>
                <p className="font-medium">{currentContact.phone_number}</p>
              </div>
            </div>

            {/* Called Status Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <Label htmlFor="contacted-toggle" className="cursor-pointer">
                Called Status
              </Label>
              <Switch
                id="contacted-toggle"
                checked={currentContact.contacted}
                onCheckedChange={() => handleToggleContacted(currentContact)}
                disabled={isUpdating}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleWhatsApp(currentContact.phone_number, currentContact.name)}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                onClick={() => handlePhoneCall(currentContact.phone_number)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>

            {/* Navigation */}
            {contacts.length > 1 && (
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentIndex === contacts.length - 1}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

