'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  description: string
  category: string | null
  featured: boolean
  status: 'active' | 'draft' | 'archived'
}

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<Product | null>(null)
  const [productId, setProductId] = useState<string>('')

  useEffect(() => {
    const initParams = async () => {
      const resolvedParams = await params
      setProductId(resolvedParams.id)
    }
    initParams()
  }, [params])

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  async function fetchProduct() {
    try {
      setInitialLoading(true)
      const response = await fetch('/admin/api/collections/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      const product = data.docs?.find((p: Product) => p.id === productId)
      
      if (!product) {
        throw new Error('Product not found')
      }
      
      setFormData(product)
    } catch (error) {
      console.error('Error fetching product:', error)
      toast.error('Failed to load product')
      router.push('/admin/products')
    } finally {
      setInitialLoading(false)
    }
  }

  function handleNameChange(name: string) {
    if (!formData) return

    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    setFormData({
      ...formData,
      name,
      slug,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!formData) return

    if (!formData.name.trim()) {
      toast.error('Product name is required')
      return
    }

    if (!formData.slug.trim()) {
      toast.error('Product slug is required')
      return
    }

    if (formData.price < 0) {
      toast.error('Price must be 0 or greater')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/admin/api/collections/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update product')
      }

      toast.success('Product updated successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!formData) return

    if (!confirm(`Are you sure you want to delete "${formData.name}"?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/admin/api/collections/products?id=${formData.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast.success('Product deleted successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Product Not Found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            Update {formData.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Basic information about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({
                      ...formData,
                      slug: e.target.value
                    })}
                    placeholder="product-slug"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({
                      ...formData,
                      price: parseFloat(e.target.value) || 0
                    })}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      description: e.target.value
                    })}
                    placeholder="Describe your product..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>
                  Configure product options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'draft' | 'archived') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category || ''}
                    onValueChange={(value) => 
                      setFormData({ ...formData, category: value || null })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="footwear">Footwear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: !!checked })
                    }
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      'Saving...'
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}