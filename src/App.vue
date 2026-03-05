<template>
  <v-app>
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        v-if="isAuthenticated"
        @click="drawer = !drawer"
        data-automation-id="nav-drawer-toggle"
        aria-label="Open navigation drawer"
      />
      <v-app-bar-title>Inventory</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-if="isAuthenticated"
      v-model="drawer"
      temporary
    >
      <v-list density="compact" nav>
        
        <v-list-subheader>INVENTORY DOMAIN</v-list-subheader>
        <v-list-item
          to="/inventorys"
          prepend-icon="mdi-view-list"
          title="List Inventorys"
          data-automation-id="nav-inventorys-list-link"
        />
        <v-list-item
          to="/inventorys/new"
          prepend-icon="mdi-plus"
          title="New Inventory"
          data-automation-id="nav-inventorys-new-link"
        />

        <v-divider class="my-2" />
        
        <v-list-subheader>PRODUCT DOMAIN</v-list-subheader>
        <v-list-item
          to="/products"
          prepend-icon="mdi-view-list"
          title="List Products"
          data-automation-id="nav-products-list-link"
        />
        <v-list-item
          to="/products/new"
          prepend-icon="mdi-plus"
          title="New Product"
          data-automation-id="nav-products-new-link"
        />

        <v-divider class="my-2" />
        
        
        <v-list-subheader>SHIPMENT DOMAIN</v-list-subheader>
        <v-list-item
          to="/shipments"
          prepend-icon="mdi-view-list"
          title="List Shipments"
          data-automation-id="nav-shipments-list-link"
        />
        <v-list-item
          to="/shipments/new"
          prepend-icon="mdi-plus"
          title="New Shipment"
          data-automation-id="nav-shipments-new-link"
        />

        <v-divider class="my-2" />
        
        
        <v-list-subheader>DEMAND DOMAIN</v-list-subheader>
        <v-list-item
          to="/demands"
          prepend-icon="mdi-view-list"
          title="List Demands"
          data-automation-id="nav-demands-list-link"
        />
        
        <v-list-subheader>WAREHOUSE DOMAIN</v-list-subheader>
        <v-list-item
          to="/warehouses"
          prepend-icon="mdi-view-list"
          title="List Warehouses"
          data-automation-id="nav-warehouses-list-link"
        />
        
        <v-list-subheader>OPTIMIZATION DOMAIN</v-list-subheader>
        <v-list-item
          to="/optimizations"
          prepend-icon="mdi-view-list"
          title="List Optimizations"
          data-automation-id="nav-optimizations-list-link"
        />
        
      </v-list>

      <template v-slot:append>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item
            v-if="hasAdminRole"
            to="/admin"
            prepend-icon="mdi-cog"
            title="Admin"
            data-automation-id="nav-admin-link"
          />
          <v-list-item
            @click="handleLogout"
            prepend-icon="mdi-logout"
            title="Logout"
            data-automation-id="nav-logout-link"
          />
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useConfig } from '@/composables/useConfig'
import { useRoles } from '@/composables/useRoles'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const { loadConfig } = useConfig()
const { hasRole } = useRoles()
const drawer = ref(false)

const hasAdminRole = hasRole('admin')

// Close temporary drawer when route changes (e.g. after clicking nav link)
router.afterEach(() => {
  drawer.value = false
})

onMounted(async () => {
  // Load config if user is already authenticated (e.g., on page reload)
  if (isAuthenticated.value) {
    try {
      await loadConfig()
    } catch (error) {
      // Silently fail - config will be loaded on next login if needed
      console.warn('Failed to load config on mount:', error)
    }
  }
})

function handleLogout() {
  logout()
  drawer.value = false
  router.push('/login')
}
</script>