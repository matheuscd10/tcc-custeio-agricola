<template>
  <q-page class="bg-grey-1 window-height column no-wrap">
    <!-- Top Bar -->
    <div class="q-px-md q-pt-md q-pb-sm bg-white shadow-1 z-top">
      <div class="text-h6 text-dark text-weight-bold">Fluxo de Caixa</div>
      <div class="text-subtitle2 text-grey-6">Histórico detalhado</div>
    </div>

    <!-- Área de Scroll Principal -->
    <q-scroll-area class="col q-pa-md">

      <!-- Filtros (Compressíveis / Linha Rápida) -->
      <q-expansion-item
        class="bg-white shadow-1 q-mb-md"
        style="border-radius: 12px;"
        icon="filter_list"
        label="Filtros"
        header-class="text-weight-bold text-dark"
      >
        <q-card>
          <q-card-section class="q-pt-none row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-select 
                v-model="filtroTipo" 
                :options="['Todos', 'Receitas', 'Despesas']" 
                label="Tipo" 
                outlined 
                dense
              />
            </div>
            <div class="col-6 col-sm-3">
              <q-input v-model="filtroDataInicio" outlined dense type="date" label="Início" stack-label />
            </div>
            <div class="col-6 col-sm-3">
              <q-input v-model="filtroDataFim" outlined dense type="date" label="Fim" stack-label />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <!-- Resumo do Período -->
      <q-card class="shadow-1 q-mb-lg" style="border-radius: 12px;">
        <q-card-section class="row text-center items-center justify-around">
          <div>
            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Entradas</div>
            <div class="text-subtitle1 text-weight-bold text-primary">R$ 137.500,00</div>
          </div>
          <div>
            <q-separator vertical inset />
          </div>
          <div>
            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Saídas</div>
            <div class="text-subtitle1 text-weight-bold text-negative">R$ 23.450,00</div>
          </div>
          <div>
            <q-separator vertical inset />
          </div>
          <div>
            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Saldo</div>
            <div class="text-subtitle1 text-weight-bold text-dark">R$ 114.050,00</div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Lista de Transações Agrupadas (Simulando agrupamento por facilidade do mock) -->
      <div class="text-subtitle2 text-grey-7 q-mb-sm q-ml-sm">Transações do Período</div>
      
      <q-card class="shadow-1" style="border-radius: 12px;">
        <q-list separator>
          <q-item v-for="tx in transacoesFiltradas" :key="tx.id" class="q-py-md">
            
            <!-- Ícone -->
            <q-item-section avatar>
              <q-avatar 
                :color="tx.tipo === 'RECEITA' ? 'green-1' : 'red-1'" 
                :text-color="tx.tipo === 'RECEITA' ? 'primary' : 'negative'" 
                :icon="tx.tipo === 'RECEITA' ? 'arrow_upward' : 'arrow_downward'" 
              />
            </q-item-section>
            
            <!-- Detalhes Centrais -->
            <q-item-section>
              <q-item-label class="text-weight-bold text-dark text-body1">{{ tx.descricao }}</q-item-label>
              <q-item-label caption class="text-grey-7 q-mt-xs">
                <q-icon name="person" size="xs" class="q-mr-xs" /> {{ tx.pessoa }}
              </q-item-label>
              <q-item-label caption class="text-grey-7">
                <q-icon name="category" size="xs" class="q-mr-xs" /> {{ tx.categoria }}
              </q-item-label>
              <q-item-label caption class="text-grey-5 q-mt-xs">
                {{ tx.data }}
              </q-item-label>
            </q-item-section>

            <!-- Valor e Badge -->
            <q-item-section side top>
              <div class="text-weight-bold text-body1 q-mb-sm" :class="tx.tipo === 'RECEITA' ? 'text-primary' : 'text-negative'">
                {{ tx.tipo === 'RECEITA' ? '+' : '-' }} R$ {{ tx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
              </div>
              <q-badge 
                :color="tx.status === 'PAGO' ? 'positive' : (tx.status === 'ABERTO' ? 'warning' : 'grey')" 
                rounded 
                class="q-px-sm q-py-xs"
              >
                {{ tx.status === 'PAGO' ? (tx.tipo === 'RECEITA' ? 'Recebido' : 'Pago') : 'Pendente' }}
              </q-badge>
            </q-item-section>
            
          </q-item>
          
          <!-- Empty State -->
          <q-item v-if="transacoesFiltradas.length === 0">
            <q-item-section class="text-center q-pa-lg">
              <q-icon name="inbox" size="xl" color="grey-4" class="q-mb-md" />
              <div class="text-grey-6">Nenhuma transação encontrada para este filtro.</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <!-- Espaço para final de scroll -->
      <div style="height: 40px;"></div>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Filtros
const filtroTipo = ref('Todos');
const filtroDataInicio = ref('');
const filtroDataFim = ref('');

// Dados mockados no formato Módulo 5 (RelatorioDetalhado / ItemFluxoCaixa)
const transacoes = ref([
  { id: 1, tipo: 'RECEITA', descricao: 'Venda de Soja (Safra Passada)', pessoa: 'Cooperativa Agrícola', categoria: 'Venda Agrícola', data: '2026-02-28', valor: 85000.00, status: 'PAGO' },
  { id: 2, tipo: 'DESPESA', descricao: 'Compra de Sementes', pessoa: 'Agro Insumos Ltda', categoria: 'Insumos', data: '2026-03-01', valor: 12000.00, status: 'PAGO' },
  { id: 3, tipo: 'RECEITA', descricao: 'Adiantamento de Safra', pessoa: 'Trader Global', categoria: 'Adiantamento', data: '2026-03-02', valor: 52500.00, status: 'ABERTO' },
  { id: 4, tipo: 'DESPESA', descricao: 'Óleo Diesel (1000L)', pessoa: 'Posto Estrela', categoria: 'Combustível', data: '2026-03-02', valor: 6450.00, status: 'PAGO' },
  { id: 5, tipo: 'DESPESA', descricao: 'Manutenção TRator', pessoa: 'Oficina do Zé', categoria: 'Máquinas', data: '2026-03-03', valor: 5000.00, status: 'ABERTO' },
]);

// Computed Property para filtrar as transações
const transacoesFiltradas = computed(() => {
  return transacoes.value.filter(tx => {
    // Filtro por Tipo
    if (filtroTipo.value === 'Receitas' && tx.tipo !== 'RECEITA') return false;
    if (filtroTipo.value === 'Despesas' && tx.tipo !== 'DESPESA') return false;
    
    // Filtro por Data Inicial (comparação simples de string formato YYYY-MM-DD)
    if (filtroDataInicio.value && tx.data < filtroDataInicio.value) return false;
    
    // Filtro por Data Final
    if (filtroDataFim.value && tx.data > filtroDataFim.value) return false;

    return true;
  });
});
</script>

<style scoped>
/* Transições para o expansion item e lista */
.q-item {
  transition: background-color 0.2s;
}
.q-item:active {
  background-color: #f5f5f5;
}
</style>
