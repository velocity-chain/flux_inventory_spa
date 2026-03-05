import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/inventorys'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    
    // Control domain: Inventory
    {
      path: '/inventorys',
      name: 'Inventorys',
      component: () => import('@/pages/InventorysListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/inventorys/new',
      name: 'InventoryNew',
      component: () => import('@/pages/InventoryNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/inventorys/:id',
      name: 'InventoryEdit',
      component: () => import('@/pages/InventoryEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Control domain: Product
    {
      path: '/products',
      name: 'Products',
      component: () => import('@/pages/ProductsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/new',
      name: 'ProductNew',
      component: () => import('@/pages/ProductNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'ProductEdit',
      component: () => import('@/pages/ProductEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Create domain: Shipment
    {
      path: '/shipments',
      name: 'Shipments',
      component: () => import('@/pages/ShipmentsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shipments/new',
      name: 'ShipmentNew',
      component: () => import('@/pages/ShipmentNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shipments/:id',
      name: 'ShipmentView',
      component: () => import('@/pages/ShipmentViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    // Consume domain: Demand
    {
      path: '/demands',
      name: 'Demands',
      component: () => import('@/pages/DemandsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/demands/:id',
      name: 'DemandView',
      component: () => import('@/pages/DemandViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Warehouse
    {
      path: '/warehouses',
      name: 'Warehouses',
      component: () => import('@/pages/WarehousesListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/warehouses/:id',
      name: 'WarehouseView',
      component: () => import('@/pages/WarehouseViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Consume domain: Optimization
    {
      path: '/optimizations',
      name: 'Optimizations',
      component: () => import('@/pages/OptimizationsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/optimizations/:id',
      name: 'OptimizationView',
      component: () => import('@/pages/OptimizationViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Admin route
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based authorization
  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    // Redirect to default page if user doesn't have required role
    next({ name: 'Inventorys' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Velocity Chain Login' : 'Inventory'
})

export default router