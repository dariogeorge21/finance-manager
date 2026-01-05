"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Plus, Edit, Trash2, Search, X, Phone, MessageCircle } from 'lucide-react'
import { CallBooth, CreateCallBoothData } from '@/types'
import { toast } from 'sonner'

interface CallBoothManagementModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
}

export function CallBoothManagementModal({ isOpen, onClose, projectId }: CallBoothManagementModalProps) {
  const [contacts, setContacts] = useState<CallBooth[]>([])
  const [filteredContacts, setFilteredContacts] = useState<CallBooth[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'contacted' | 'not-contacted'>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<CallBooth | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [contactToDelete, setContactToDelete] = useState<CallBooth | null>(null)

  // Form state
  const [formData, setFormData] = useState<CreateCallBoothData>({
    name: '',
    phone_number: '',
    contacted: false,
  })

  useEffect(() => {
    if (isOpen) {
      fetchContacts()
    }
  }, [isOpen, projectId])

  useEffect(() => {
    filterContacts()
  }, [contacts, searchQuery, statusFilter])

  const fetchContacts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/call-booth`)
      const data = await response.json()
      
      if (response.ok) {
        setContacts(data.callBooth || [])
      } else {
        toast.error('Failed to load contacts')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = contacts

    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase()
      filtered = filtered.filter((contact) => {
        const nameMatch = contact.name.toLowerCase().includes(searchLower)
        const phoneMatch = contact.phone_number.toLowerCase().includes(searchLower)
        return nameMatch || phoneMatch
      })
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((contact) => {
        if (statusFilter === 'contacted') return contact.contacted === true
        if (statusFilter === 'not-contacted') return contact.contacted === false
        return true
      })
    }

    setFilteredContacts(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = editingContact
        ? `/api/projects/${projectId}/call-booth/${editingContact.id}`
        : `/api/projects/${projectId}/call-booth`
      const method = editingContact ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(`Contact ${editingContact ? 'updated' : 'added'} successfully`)
        resetForm()
        fetchContacts()
      } else {
        const result = await response.json()
        toast.error(result.error || 'Failed to save contact')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (contact: CallBooth) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      phone_number: contact.phone_number,
      contacted: contact.contacted,
    })
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!contactToDelete) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/call-booth/${contactToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Contact deleted successfully')
        fetchContacts()
      } else {
        toast.error('Failed to delete contact')
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setIsLoading(false)
      setDeleteConfirmOpen(false)
      setContactToDelete(null)
    }
  }

  const resetForm = () => {
    setFormData({ name: '', phone_number: '', contacted: false })
    setEditingContact(null)
    setShowForm(false)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
  }

  const handleWhatsApp = (phoneNumber: string, name: string) => {
    const message = encodeURIComponent(`Hello ${name}, I'm reaching out regarding financial assistance.`)
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  const handlePhoneCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Booth Management</DialogTitle>
            <DialogDescription>
              Manage contacts for financial assistance requests
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Add/Edit Form */}
            {showForm ? (
              <Card className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    {editingContact ? 'Edit Contact' : 'Add New Contact'}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="Enter name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Phone Number *</Label>
                      <Input
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        required
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="contacted"
                      checked={formData.contacted}
                      onChange={(e) => setFormData({ ...formData, contacted: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="contacted" className="cursor-pointer">
                      Mark as contacted
                    </Label>
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Saving...' : editingContact ? 'Update Contact' : 'Add Contact'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Button onClick={() => setShowForm(true)} className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Contact
              </Button>
            )}

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <Select value={statusFilter} onValueChange={(value: 'all' | 'contacted' | 'not-contacted') => setStatusFilter(value)}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="not-contacted">Not Contacted</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || statusFilter !== 'all') && (
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>

            {/* Contacts Table */}
            <div className="border rounded-lg">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : filteredContacts.length > 0 ? (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone Number</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContacts.map((contact) => (
                          <TableRow key={contact.id}>
                            <TableCell className="font-medium">{contact.name}</TableCell>
                            <TableCell>{contact.phone_number}</TableCell>
                            <TableCell>
                              <Badge variant={contact.contacted ? 'default' : 'secondary'}>
                                {contact.contacted ? 'Contacted' : 'Not Contacted'}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleWhatsApp(contact.phone_number, contact.name)}
                                  title="WhatsApp"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handlePhoneCall(contact.phone_number)}
                                  title="Call"
                                >
                                  <Phone className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(contact)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setContactToDelete(contact)
                                    setDeleteConfirmOpen(true)
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4 p-4">
                    {filteredContacts.map((contact) => (
                      <Card key={contact.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{contact.name}</h3>
                              <p className="text-sm text-gray-500">{contact.phone_number}</p>
                            </div>
                            <Badge variant={contact.contacted ? 'default' : 'secondary'}>
                              {contact.contacted ? 'Contacted' : 'Not Contacted'}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            Added: {new Date(contact.created_at).toLocaleDateString()}
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWhatsApp(contact.phone_number, contact.name)}
                              className="w-full"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              WhatsApp
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePhoneCall(contact.phone_number)}
                              className="w-full"
                            >
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(contact)}
                              className="flex-1"
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setContactToDelete(contact)
                                setDeleteConfirmOpen(true)
                              }}
                              className="flex-1"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No contacts match your filters'
                    : 'No contacts yet. Add your first contact!'}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the contact "{contactToDelete?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteConfirmOpen(false)
              setContactToDelete(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

