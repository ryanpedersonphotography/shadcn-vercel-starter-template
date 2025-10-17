import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, FileText, Users, Images } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const stats = [
    {
      title: "Products",
      value: "12",
      description: "Active products",
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Pages",
      value: "8",
      description: "Published pages",
      icon: FileText,
      href: "/admin/pages",
    },
    {
      title: "Users",
      value: "3",
      description: "Total users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Media",
      value: "45",
      description: "Uploaded files",
      icon: Images,
      href: "/admin/media",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Manage your content and settings here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/products/new"
              className="p-4 border rounded-lg hover:bg-accent text-center block"
            >
              <Package className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Add Product</div>
              <div className="text-sm text-muted-foreground">Create a new product</div>
            </Link>
            
            <Link
              href="/admin/pages/new"
              className="p-4 border rounded-lg hover:bg-accent text-center block"
            >
              <FileText className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Create Page</div>
              <div className="text-sm text-muted-foreground">Add a new page</div>
            </Link>
            
            <Link
              href="/admin/media"
              className="p-4 border rounded-lg hover:bg-accent text-center block"
            >
              <Images className="h-8 w-8 mx-auto mb-2" />
              <div className="font-medium">Upload Media</div>
              <div className="text-sm text-muted-foreground">Manage files</div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}