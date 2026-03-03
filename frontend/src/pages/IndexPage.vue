<template>
  <q-page class="q-pa-md bg-transparent">
    <!-- Topo: Título da Página -->
    <div class="row q-mb-lg items-center justify-between">
      <div>
        <div class="text-h5 text-weight-bold text-dark">Resumo da Safra</div>
        <div class="text-subtitle2 text-grey-6">Visão geral financeira do agronegócio</div>
      </div>
      <q-btn color="primary" icon="add" label="Novo Lançamento" unelevated rounded class="q-px-md" />
    </div>

    <!-- Seção Superior: Gráfico de Orçamento (Donut Chart) -->
    <div class="row justify-center q-mb-xl">
      <q-card class="col-12 col-md-8 text-center shadow-1" style="border-radius: 16px;">
        <q-card-section class="q-pa-lg">
          <div class="text-h6 text-grey-8 q-mb-md">Orçamento Utilizado</div>
          
          <q-circular-progress
            show-value
            class="text-weight-bold text-dark q-mb-sm"
            :value="porcentagemUso"
            size="220px"
            :thickness="0.25"
            color="primary"
            track-color="grey-2"
            center-color="white"
          >
            <div class="column flex-center">
              <span class="text-h3 text-weight-bolder">{{ porcentagemUso }}%</span>
              <span class="text-caption text-grey-6 text-uppercase">da safra</span>
            </div>
          </q-circular-progress>
          
          <div class="row justify-center q-mt-md q-gutter-xl">
            <div>
              <div class="text-caption text-grey-6 text-uppercase">Orçamento Total</div>
              <div class="text-subtitle1 text-weight-bold">R$ 150.000,00</div>
            </div>
            <div>
              <div class="text-caption text-grey-6 text-uppercase">Disponível</div>
              <div class="text-subtitle1 text-weight-bold text-primary">R$ 54.000,00</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Seção Intermediária: Cards de Resumo -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <!-- Receitas -->
      <div class="col-12 col-sm-4">
        <q-card class="shadow-1" style="border-radius: 16px;">
          <q-card-section class="q-pa-md">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Total Receitas</div>
                <div class="text-h5 text-weight-bold q-mt-xs">R$ 80.000,00</div>
              </div>
              <div class="col-auto">
                <q-avatar color="green-1" text-color="primary" icon="trending_up" size="lg" />
              </div>
            </div>
            <div class="text-caption text-positive q-mt-sm row items-center">
              <q-icon name="arrow_upward" class="q-mr-xs" /> 12% a mais que o mês passado
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <!-- Despesas -->
      <div class="col-12 col-sm-4">
        <q-card class="shadow-1" style="border-radius: 16px;">
          <q-card-section class="q-pa-md">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Total Despesas</div>
                <div class="text-h5 text-weight-bold q-mt-xs">R$ 96.000,00</div>
              </div>
              <div class="col-auto">
                <!-- Usando o soft red (negative) -->
                <q-avatar color="red-1" text-color="negative" icon="trending_down" size="lg" />
              </div>
            </div>
            <div class="text-caption text-negative q-mt-sm row items-center">
              <q-icon name="arrow_upward" class="q-mr-xs" /> 5% a mais que o mês passado
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Saldo -->
      <div class="col-12 col-sm-4">
        <q-card class="bg-primary text-white shadow-1" style="border-radius: 16px;">
          <q-card-section class="q-pa-md">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-caption text-white text-uppercase text-weight-medium">Saldo Atual</div>
                <div class="text-h5 text-weight-bold q-mt-xs">- R$ 16.000,00</div>
              </div>
              <div class="col-auto">
                <q-avatar color="white" text-color="primary" icon="account_balance_wallet" size="lg" />
              </div>
            </div>
            <div class="text-caption text-white q-mt-sm row items-center opacity-80">
              Atualizado hoje
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Seção Inferior: Lista de Transações Recentes -->
    <div class="row">
      <div class="col-12">
        <q-card class="shadow-1" style="border-radius: 16px;">
          <q-card-section class="row items-center justify-between q-pb-none">
            <div class="text-h6 text-dark text-weight-bold">Transações Recentes</div>
            <q-btn flat color="primary" label="Ver todas" />
          </q-card-section>

          <q-card-section>
            <q-list class="q-mt-sm" separator>
              <q-item v-for="tx in transacoes" :key="tx.id" class="q-py-md">
                <q-item-section avatar>
                  <q-avatar 
                    :color="tx.tipo === 'RECEITA' ? 'green-1' : 'red-1'" 
                    :text-color="tx.tipo === 'RECEITA' ? 'primary' : 'negative'" 
                    :icon="tx.tipo === 'RECEITA' ? 'eco' : 'shopping_cart'" 
                  />
                </q-item-section>
                
                <q-item-section>
                  <q-item-label class="text-weight-bold text-dark text-body1">{{ tx.descricao }}</q-item-label>
                  <q-item-label caption class="text-grey-7">{{ tx.data }} • {{ tx.categoria }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="text-weight-bold text-body1" :class="tx.tipo === 'RECEITA' ? 'text-primary' : 'text-negative'">
                    {{ tx.tipo === 'RECEITA' ? '+' : '-' }} R$ {{ tx.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const porcentagemUso = ref(64);

const transacoes = ref([
  { id: 1, tipo: 'DESPESA', descricao: 'Compra de Fertilizantes (NPK)', categoria: 'Insumos', data: '02 Mar 2026', valor: 15400.00 },
  { id: 2, tipo: 'RECEITA', descricao: 'Venda de Soja (Safra Passada)', categoria: 'Venda Agrícola', data: '28 Fev 2026', valor: 45000.00 },
  { id: 3, tipo: 'DESPESA', descricao: 'Manutenção do Trator John Deere', categoria: 'Máquinas', data: '25 Fev 2026', valor: 3250.00 },
  { id: 4, tipo: 'DESPESA', descricao: 'Pagamento de Tarefeiros', categoria: 'Mão de Obra', data: '20 Fev 2026', valor: 4800.00 },
  { id: 5, tipo: 'RECEITA', descricao: 'Venda de Milho', categoria: 'Venda Agrícola', data: '15 Fev 2026', valor: 12500.00 },
]);
</script>

<style lang="scss" scoped>
.opacity-80 {
  opacity: 0.8;
}
</style>
