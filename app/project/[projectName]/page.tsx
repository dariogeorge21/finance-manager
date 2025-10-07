"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { IncomeForm } from '@/components/income-form'
import { ExpenseForm } from '@/components/expense-form'
import { FinancialCharts } from '@/components/financial-charts'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/currency'
import { exportIncomeToCSV, exportExpensesToCSV } from '@/lib/export'
import { ProjectStats, Income, Expense } from '@/types'
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Users,
  Plus,
  Download,
  Edit,
  Trash2,
  Phone,
  PhoneOff,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from 'lucide-react'

interface ProjectAuth {
  project_id: string
  project_name: string
  authenticated_at: number
}

export default function ProjectDashboard({ params }: { params: Promise<{ projectName: string }> }) {
  const router = useRouter()
  const [projectAuth, setProjectAuth] = useState<ProjectAuth | null>(null)
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  
  // Pagination states
  const [incomePage, setIncomePage] = useState(1)
  const [expensePage, setExpensePage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Search and filter states
  const [incomeSearchQuery, setIncomeSearchQuery] = useState('')
  const [incomeCalledFilter, setIncomeCalledFilter] = useState<'all' | 'called' | 'not-called'>('all')
  
  // Confirmation dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<{ id: string; type: 'income' | 'expense'; name: string } | null>(null)

  useEffect(() => {
    const initializeProject = async () => {
      // Check authentication
      const authData = sessionStorage.getItem('project_auth')
      if (!authData) {
        router.push('/')
        return
      }

      const auth: ProjectAuth = JSON.parse(authData)
      const { projectName } = await params
      const decodedProjectName = decodeURIComponent(projectName)
      
      if (auth.project_name !== decodedProjectName) {
        router.push('/')
        return
      }

      // Check if session is still valid (24 hours)
      if (Date.now() - auth.authenticated_at > 24 * 60 * 60 * 1000) {
        sessionStorage.removeItem('project_auth')
        router.push('/')
        return
      }

      setProjectAuth(auth)
      fetchData(auth.project_id)
    }

    initializeProject()
  }, [params, router])

  const fetchData = async (projectId: string) => {
    setIsLoading(true)
    try {
      const [statsRes, incomeRes, expensesRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/stats`),
        fetch(`/api/projects/${projectId}/income`),
        fetch(`/api/projects/${projectId}/expenses`)
      ])

      const [statsData, incomeData, expensesData] = await Promise.all([
        statsRes.json(),
        incomeRes.json(),
        expensesRes.json()
      ])

      if (statsRes.ok) setStats(statsData.stats)
      if (incomeRes.ok) setIncome(incomeData.income)
      if (expensesRes.ok) setExpenses(expensesData.expenses)
    } catch (error) {
      toast.error('Failed to load project data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('project_auth')
    router.push('/')
  }

  // Filter and search helpers
  const getFilteredIncome = () => {
    let filtered = income

    // Apply search filter
    if (incomeSearchQuery.trim()) {
      const searchLower = incomeSearchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(searchLower)
        const phoneMatch = item.phone_number?.toLowerCase().includes(searchLower) || false
        const calledByMatch = item.called_by?.toLowerCase().includes(searchLower) || false
        return nameMatch || phoneMatch || calledByMatch
      })
    }

    // Apply called status filter
    if (incomeCalledFilter !== 'all') {
      filtered = filtered.filter((item) => {
        if (incomeCalledFilter === 'called') return item.called_status === true
        if (incomeCalledFilter === 'not-called') return item.called_status === false
        return true
      })
    }

    return filtered
  }

  // Pagination helpers
  const getPaginatedData = (data: any[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }

  const getTotalPages = (dataLength: number) => {
    return Math.ceil(dataLength / itemsPerPage)
  }

  const filteredIncome = getFilteredIncome()
  const paginatedIncome = getPaginatedData(filteredIncome, incomePage)
  const paginatedExpenses = getPaginatedData(expenses, expensePage)
  const totalIncomePages = getTotalPages(filteredIncome.length)
  const totalExpensePages = getTotalPages(expenses.length)

  // Clear search and filters
  const clearIncomeFilters = () => {
    setIncomeSearchQuery('')
    setIncomeCalledFilter('all')
    setIncomePage(1)
  }

  const confirmDelete = (id: string, type: 'income' | 'expense', name: string) => {
    setDeleteItem({ id, type, name })
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirmed = async () => {
    if (!projectAuth || !deleteItem) return

    const { id, type } = deleteItem
    
    try {
      const response = await fetch(`/api/projects/${projectAuth.project_id}/${type}/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success(`${type === 'income' ? 'Income' : 'Expense'} deleted successfully`)
        fetchData(projectAuth.project_id)
      } else {
        toast.error(`Failed to delete ${type}`)
      }
    } catch (error) {
      toast.error('Network error')
    } finally {
      setDeleteConfirmOpen(false)
      setDeleteItem(null)
    }
  }

  const handleDeleteIncome = (id: string, name: string) => {
    confirmDelete(id, 'income', name)
  }

  const handleDeleteExpense = (id: string, description: string) => {
    confirmDelete(id, 'expense', description)
  }

  const handleExportIncome = async () => {
    if (!projectAuth) return

    try {
      const response = await fetch(`/api/projects/${projectAuth.project_id}/export/income`)
      const data = await response.json()
      
      if (response.ok) {
        exportIncomeToCSV(data.income, projectAuth.project_name)
        toast.success('Income data exported successfully')
      } else {
        toast.error('Failed to export income data')
      }
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const handleExportExpenses = async () => {
    if (!projectAuth) return

    try {
      const response = await fetch(`/api/projects/${projectAuth.project_id}/export/expenses`)
      const data = await response.json()
      
      if (response.ok) {
        exportExpensesToCSV(data.expenses, projectAuth.project_name)
        toast.success('Expenses data exported successfully')
      } else {
        toast.error('Failed to export expenses data')
      }
    } catch (error) {
      toast.error('Export failed')
    }
  }

  if (!projectAuth || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Skeleton/>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{projectAuth.project_name}</h1>
              <p className="text-sm text-gray-500">Finance Dashboard</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Exit Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Income</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalIncome)}</p>
                  </div>
                  <ArrowUpCircle className="w-8 h-8 text-emerald-100" />
                </div>
                <p className="text-emerald-100 text-xs mt-2">{stats.incomeCount} entries</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</p>
                  </div>
                  <ArrowDownCircle className="w-8 h-8 text-red-100" />
                </div>
                <p className="text-red-100 text-xs mt-2">{stats.expenseCount} entries</p>
              </CardContent>
            </Card>

            <Card className={`${stats.netBalance >= 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-opacity-90 text-sm font-medium">Net Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.netBalance)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-white text-opacity-75" />
                </div>
                <p className="text-white text-opacity-75 text-xs mt-2">
                  {stats.netBalance >= 0 ? 'Positive' : 'Negative'} balance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Entries</p>
                    <p className="text-2xl font-bold">{stats.incomeCount + stats.expenseCount}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-100" />
                </div>
                <p className="text-purple-100 text-xs mt-2">All transactions</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setShowIncomeForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
          <Button onClick={() => setShowExpenseForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="outline" onClick={handleExportIncome}>
            <Download className="w-4 h-4 mr-2" />
            Export Income
          </Button>
          <Button variant="outline" onClick={handleExportExpenses}>
            <Download className="w-4 h-4 mr-2" />
            Export Expenses
          </Button>
        </div>

        {/* Charts */}
        {stats && (
          <div className="mb-8">
            <FinancialCharts stats={stats} />
          </div>
        )}

        {/* Data Tables */}
        <Tabs defaultValue="income" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Recent Income</TabsTrigger>
            <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle>Income Entries</CardTitle>
                    <CardDescription>
                      {income.length > 0 ? `Showing ${((incomePage - 1) * itemsPerPage) + 1}-${Math.min(incomePage * itemsPerPage, filteredIncome.length)} of ${filteredIncome.length} entries${filteredIncome.length !== income.length ? ` (filtered from ${income.length} total)` : ''}` : 'No entries'}
                    </CardDescription>
                  </div>
                  {income.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Items per page:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(parseInt(value))
                        setIncomePage(1)
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Search and Filter Controls */}
                {income.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by name, phone, or collector..."
                        value={incomeSearchQuery}
                        onChange={(e) => {
                          setIncomeSearchQuery(e.target.value)
                          setIncomePage(1)
                        }}
                        className="pl-10 pr-10"
                      />
                      {incomeSearchQuery && (
                        <button
                          onClick={() => {
                            setIncomeSearchQuery('')
                            setIncomePage(1)
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <Select value={incomeCalledFilter} onValueChange={(value: 'all' | 'called' | 'not-called') => {
                      setIncomeCalledFilter(value)
                      setIncomePage(1)
                    }}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Entries</SelectItem>
                        <SelectItem value="called">Transferred</SelectItem>
                        <SelectItem value="not-called">Not Transferred</SelectItem>
                      </SelectContent>
                    </Select>

                    {(incomeSearchQuery || incomeCalledFilter !== 'all') && (
                      <Button variant="outline" onClick={clearIncomeFilters} size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {income.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Transfer</TableHead>
                            <TableHead>Collected By</TableHead>
                            <TableHead>Collected Notes</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedIncome.map((item) => (
                            <TableRow 
                              key={item.id}
                              className={item.called_status ? "bg-green-50 hover:bg-green-100" : "bg-red-50 hover:bg-red-100"}
                            >
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>
                                {item.phone_number ? (
                                  <span className="text-sm">{item.phone_number}</span>
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell className="font-semibold text-emerald-600">
                                {formatCurrency(item.amount)}
                              </TableCell>
                              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={item.called_status ? "default" : "secondary"}
                                  className={item.called_status ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}
                                >
                                  {item.called_status ? (
                                    <><Phone className="w-3 h-3 mr-1" />Transferred</>
                                  ) : (
                                    <><PhoneOff className="w-3 h-3 mr-1" />Not Transferred</>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {item.called_by ? (
                                  <span className="text-sm">{item.called_by}</span>
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {item.description ? (
                                  <div className="max-w-xs">
                                    <span className="text-sm text-gray-600 line-clamp-2">
                                      {item.description}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingIncome(item)
                                      setShowIncomeForm(true)
                                    }}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteIncome(item.id, item.name)}
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
                    <div className="md:hidden space-y-4">
                      {paginatedIncome.map((item) => (
                        <Card 
                          key={item.id} 
                          className={`p-4 ${item.called_status ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg">{item.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {item.phone_number || 'No phone number'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-emerald-600 text-lg">
                                  {formatCurrency(item.amount)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(item.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              <Badge 
                                variant={item.called_status ? "default" : "secondary"}
                                className={item.called_status ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}
                              >
                                {item.called_status ? (
                                  <><Phone className="w-3 h-3 mr-1" />Transferred</>
                                ) : (
                                  <><PhoneOff className="w-3 h-3 mr-1" />Not Transferred</>
                                )}
                              </Badge>
                              {item.called_by && (
                                <Badge variant="outline">
                                  Collected by: {item.called_by}
                                </Badge>
                              )}
                            </div>

                            {item.description && (
                              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                {item.description}
                              </p>
                            )}

                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingIncome(item)
                                  setShowIncomeForm(true)
                                }}
                                className="flex-1"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteIncome(item.id, item.name)}
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

                    {/* Pagination */}
                    {totalIncomePages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Page {incomePage} of {totalIncomePages}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIncomePage(Math.max(1, incomePage - 1))}
                            disabled={incomePage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIncomePage(Math.min(totalIncomePages, incomePage + 1))}
                            disabled={incomePage === totalIncomePages}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No income entries yet. Add your first income entry!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                  <div>
                    <CardTitle>Expense Entries</CardTitle>
                    <CardDescription>
                      {expenses.length > 0 ? `Showing ${((expensePage - 1) * itemsPerPage) + 1}-${Math.min(expensePage * itemsPerPage, expenses.length)} of ${expenses.length} entries` : 'No entries'}
                    </CardDescription>
                  </div>
                  {expenses.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Items per page:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(parseInt(value))
                        setExpensePage(1)
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedExpenses.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.description}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{item.category}</Badge>
                              </TableCell>
                              <TableCell className="font-semibold text-red-600">
                                {formatCurrency(item.amount)}
                              </TableCell>
                              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingExpense(item)
                                      setShowExpenseForm(true)
                                    }}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteExpense(item.id, item.description)}
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
                    <div className="md:hidden space-y-4">
                      {paginatedExpenses.map((item) => (
                        <Card key={item.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-medium text-lg">{item.description}</h3>
                                <Badge variant="outline" className="mt-1">{item.category}</Badge>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-semibold text-red-600 text-lg">
                                  {formatCurrency(item.amount)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(item.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex space-x-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingExpense(item)
                                  setShowExpenseForm(true)
                                }}
                                className="flex-1"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteExpense(item.id, item.description)}
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

                    {/* Pagination */}
                    {totalExpensePages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Page {expensePage} of {totalExpensePages}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpensePage(Math.max(1, expensePage - 1))}
                            disabled={expensePage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpensePage(Math.min(totalExpensePages, expensePage + 1))}
                            disabled={expensePage === totalExpensePages}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No expense entries yet. Add your first expense entry!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Forms */}
      <IncomeForm
        isOpen={showIncomeForm}
        onClose={() => {
          setShowIncomeForm(false)
          setEditingIncome(null)
        }}
        onSuccess={() => fetchData(projectAuth.project_id)}
        projectId={projectAuth.project_id}
        editData={editingIncome}
      />

      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false)
          setEditingExpense(null)
        }}
        onSuccess={() => fetchData(projectAuth.project_id)}
        projectId={projectAuth.project_id}
        editData={editingExpense}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteItem?.type} entry "{deleteItem?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteConfirmOpen(false)
              setDeleteItem(null)
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirmed}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}