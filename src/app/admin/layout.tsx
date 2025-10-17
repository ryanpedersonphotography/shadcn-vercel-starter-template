import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Package, FileText, Settings, Users, Images, Home } from 'lucide-react'
import Link from 'next/link'
import { Toaster } from '@/components/ui/sonner'

function AdminSidebar() {
  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/admin",
    },
    {
      title: "Products",
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Pages",
      icon: FileText,
      href: "/admin/pages",
    },
    {
      title: "Users",
      icon: Users,
      href: "/admin/users",
    },
    {
      title: "Media",
      icon: Images,
      href: "/admin/media",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Content Management</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function AdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}