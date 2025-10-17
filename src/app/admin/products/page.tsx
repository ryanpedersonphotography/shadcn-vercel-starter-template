'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Edit, Trash2, Package } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  description?: string
  category?: string
  featured: boolean
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      setLoading(true)
      const response = await fetch('/admin/api/collections/products')
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      setProducts(data.docs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  async function deleteProduct(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/admin/api/collections/products?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      toast.success('Product deleted successfully')
      fetchProducts() // Refresh the list
    } catch (err) {
      toast.error('Failed to delete product')
    }
  }

  function getStatusVariant(status: string) {
    switch (status) {
      case 'active':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'archived':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading products...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Products</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">Error: {error}</div>
            <Button onClick={fetchProducts} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>
            {products.length} product{products.length !== 1 ? 's' : ''} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first product.
              </p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          /{product.slug}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">
                      {product.category || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(product.status)}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.featured ? (
                        <Badge variant="outline">Featured</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteProduct(product.id, product.name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}