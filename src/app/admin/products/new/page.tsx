'use client'

import { useState } from 'react'
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
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface ProductFormData {
  name: string
  slug: string
  price: number
  description: string
  category: string | undefined
  featured: boolean
  status: 'active' | 'draft' | 'archived'
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    price: 0,
    description: '',
    category: undefined,
    featured: false,
    status: 'draft',
  })

  function handleNameChange(name: string) {
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()

    setFormData({
      ...formData,
      name,
      slug,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create product')
      }

      const result = await response.json()
      toast.success('Product created successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-2xl font-bold">New Product</h1>
          <p className="text-muted-foreground">
            Create a new product for your catalog
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
                  <p className="text-sm text-muted-foreground mt-1">
                    URL-friendly version of the name. Auto-generated from name.
                  </p>
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
                    value={formData.description}
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
                      setFormData({ ...formData, category: value || undefined })
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
                <div className="flex gap-2 w-full">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? (
                      'Creating...'
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Product
                      </>
                    )}
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