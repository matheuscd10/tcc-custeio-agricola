<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Toggler para mostrar/esconder o menu lateral (apenas Desktop) -->
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          v-if="$q.screen.gt.sm"
        />

        <q-toolbar-title class="text-weight-bold">
          <q-icon name="agriculture" size="md" class="q-mr-sm" />
          Custeio Agrícola
        </q-toolbar-title>

        <q-btn flat round icon="account_circle">
          <q-menu>
            <q-list style="min-width: 150px">
              <q-item clickable v-close-popup @click="fazerLogout">
                <q-item-section avatar>
                  <q-icon name="logout" color="negative" />
                </q-item-section>
                <q-item-section class="text-negative text-weight-bold">
                  Sair
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Desktop Sidebar (Left Drawer) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
      class="bg-white"
      v-if="$q.screen.gt.sm"
    >
      <q-list class="q-pa-md">
        <q-item-label header class="text-weight-bold text-uppercase text-grey-6">
          Navegação
        </q-item-label>

        <q-item clickable v-ripple to="/" exact active-class="bg-green-1 text-primary text-weight-bold" class="rounded-borders q-mb-xs">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/lancamentos" active-class="bg-green-1 text-primary text-weight-bold" class="rounded-borders q-mb-xs">
          <q-item-section avatar>
            <q-icon name="list_alt" />
          </q-item-section>
          <q-item-section>Lançamentos</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/relatorios" active-class="bg-green-1 text-primary text-weight-bold" class="rounded-borders q-mb-xs">
          <q-item-section avatar>
            <q-icon name="bar_chart" />
          </q-item-section>
          <q-item-section>Relatórios</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Mobile Bottom Navigation (Tabs) -->
    <q-footer bordered class="bg-white text-primary" v-if="$q.screen.lt.md">
      <q-tabs 
        no-caps 
        active-color="primary" 
        indicator-color="transparent" 
        class="text-grey-7" 
        v-model="tab"
      >
        <q-route-tab to="/" exact name="dashboard" icon="dashboard" label="Dashboard" />
        <q-route-tab to="/lancamentos" name="lancamentos" icon="list_alt" label="Lançamentos" />
        <q-route-tab to="/relatorios" name="relatorios" icon="bar_chart" label="Relatórios" />
      </q-tabs>
    </q-footer>

  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const router = useRouter();

const leftDrawerOpen = ref(false);
const tab = ref('dashboard');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function fazerLogout() {
  // Remove token
  localStorage.removeItem('access_token');
  
  $q.notify({
    type: 'info',
    message: 'Conta desconectada.',
    position: 'top',
  });
  
  // Redireciona pro Login
  void router.push('/login');
}

// Garante que o menu lateral fique oculto em telas mobile (sm e xs)
watch(() => $q.screen.gt.sm, (isDesktop) => {
  if (!isDesktop) {
    leftDrawerOpen.value = false;
  }
}, { immediate: true });
</script>

<style lang="scss">
.q-drawer {
  .q-item.q-router-link--exact-active {
    .q-icon {
      color: $primary;
    }
  }
}
</style>
