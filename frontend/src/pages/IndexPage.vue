<template>
  <q-page class="q-pa-md bg-transparent relative-position">
    <!-- Topo: Título da Página -->
    <div class="row q-mb-lg items-center justify-between">
      <div>
        <div class="text-h5 text-weight-bold text-dark">Resumo da Safra</div>
        <div class="text-subtitle2 text-grey-6">Visão geral financeira do agronegócio</div>
      </div>
      <q-btn color="primary" icon="add" label="Novo Lançamento" unelevated rounded class="q-px-md" to="/lancamentos" />
    </div>

    <!-- Indicador de Carregamento -->
    <q-inner-loading :showing="loading" label="Carregando dados da safra..." label-class="text-primary text-weight-bold" color="primary" size="50px" />

    <!-- Conteúdo da Dashboard -->
    <div v-show="!loading">
      
      <!-- Seção Superior: Gráfico de Orçamento (Donut Chart) -->
      <div class="row justify-center q-mb-xl">
        <q-card class="col-12 col-md-8 text-center shadow-1" style="border-radius: 16px;">
          <q-card-section class="q-pa-lg">
            <div class="text-h6 text-grey-8 q-mb-md">Orçamento Utilizado</div>
            
            <q-circular-progress
              show-value
              class="text-weight-bold text-dark q-mb-sm"
              :value="resumo.percentualOrcamentoUtilizado"
              size="220px"
              :thickness="0.25"
              color="primary"
              track-color="grey-2"
              center-color="white"
            >
              <div class="column flex-center">
                <span class="text-h3 text-weight-bolder">{{ resumo.percentualOrcamentoUtilizado }}%</span>
                <span class="text-caption text-grey-6 text-uppercase">da safra</span>
              </div>
            </q-circular-progress>
            
            <div class="row justify-center q-mt-md q-gutter-xl">
              <div>
                <div class="text-caption text-grey-6 text-uppercase">Orçamento Total (Simulado)</div>
                <div class="text-subtitle1 text-weight-bold">R$ 150.000,00</div>
              </div>
              <div>
                <div class="text-caption text-grey-6 text-uppercase">Despesas Atuais</div>
                <div class="text-subtitle1 text-weight-bold text-negative">{{ formatarMoeda(resumo.totalDespesas) }}</div>
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
                  <div class="text-h5 text-weight-bold q-mt-xs">{{ formatarMoeda(resumo.totalReceitas) }}</div>
                </div>
                <div class="col-auto">
                  <q-avatar color="green-1" text-color="primary" icon="trending_up" size="lg" />
                </div>
              </div>
              <div class="text-caption text-positive q-mt-sm row items-center">
                <q-icon name="arrow_upward" class="q-mr-xs" /> Mês atual
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
                  <div class="text-h5 text-weight-bold q-mt-xs">{{ formatarMoeda(resumo.totalDespesas) }}</div>
                </div>
                <div class="col-auto">
                  <q-avatar color="red-1" text-color="negative" icon="trending_down" size="lg" />
                </div>
              </div>
              <div class="text-caption text-negative q-mt-sm row items-center">
                <q-icon name="arrow_upward" class="q-mr-xs" /> Mês atual
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
                  <div class="text-h5 text-weight-bold q-mt-xs">{{ formatarMoeda(resumo.saldo) }}</div>
                </div>
                <div class="col-auto">
                  <q-avatar color="white" text-color="primary" icon="account_balance_wallet" size="lg" />
                </div>
              </div>
              <div class="text-caption text-white q-mt-sm row items-center opacity-80">
                Atualizado agora
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
              <q-btn flat color="primary" label="Ver todas" to="/relatorios" />
            </q-card-section>

            <q-card-section>
              <q-list class="q-mt-sm" separator>
                
                <q-item v-if="transacoes.length === 0" class="q-py-md text-center">
                  <q-item-section>
                    <div class="text-grey-6">Nenhuma transação encontrada no período.</div>
                  </q-item-section>
                </q-item>

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
                    <q-item-label caption class="text-grey-7">{{ formatarData(tx.dataEmissao) }} • {{ tx.pessoaNome || 'N/I' }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <div class="text-weight-bold text-body1" :class="tx.tipo === 'RECEITA' ? 'text-primary' : 'text-negative'">
                      {{ tx.tipo === 'RECEITA' ? '+' : '-' }} {{ formatarMoeda(tx.valorTotal) }}
                    </div>
                  </q-item-section>
                </q-item>

              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from '../services/api';

const $q = useQuasar();

// Estado Reativo
const loading = ref(true);

const resumo = ref({
  totalReceitas: 0,
  totalDespesas: 0,
  saldo: 0,
  percentualOrcamentoUtilizado: 0,
  totalTitulosPagar: 0,
  totalTitulosReceber: 0,
});

interface ItemTransacao {
  id: number;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  dataEmissao: string;
  pessoaNome?: string;
  valorTotal: number;
}

const transacoes = ref<ItemTransacao[]>([]);

// Hook onMounted para buscar os dados quando a página carrega
onMounted(async () => {
  try {
    loading.value = true;
    
    // Fazemos as duas requisições simultaneamente com Promise.all
    const [resDashboard, resFluxo] = await Promise.all([
      api.get('/relatorios/dashboard'),
      // Pegamos apenas as 5 últimas transações mais recentes (pagina 1, 5 itens)
      api.get('/relatorios/fluxo-caixa', {
        params: {
          pagina: 1,
          itensPorPagina: 5
        }
      })
    ]);

    // Atualiza o estado com os dados do backend
    resumo.value = resDashboard.data;
    transacoes.value = resFluxo.data.dados;

  } catch (error: unknown) {
    console.error('Erro ao buscar dados da dashboard:', error);
    $q.notify({
      type: 'negative',
      message: 'Não foi possível carregar os dados financeiros.',
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
});

// Funções utilitárias de formatação
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor) || 0);
};

const formatarData = (dataStr: string) => {
  if (!dataStr) return '';
  const data = new Date(dataStr);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(data);
};

</script>

<style lang="scss" scoped>
.opacity-80 {
  opacity: 0.8;
}
</style>
