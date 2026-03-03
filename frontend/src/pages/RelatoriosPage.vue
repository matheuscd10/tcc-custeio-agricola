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
            <div class="text-subtitle1 text-weight-bold text-primary">{{ formatarMoeda(totais.receitas) }}</div>
          </div>
          <div>
            <q-separator vertical inset />
          </div>
          <div>
            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Saídas</div>
            <div class="text-subtitle1 text-weight-bold text-negative">{{ formatarMoeda(totais.despesas) }}</div>
          </div>
          <div>
            <q-separator vertical inset />
          </div>
          <div>
            <div class="text-caption text-grey-6 text-uppercase text-weight-bold">Saldo</div>
            <div class="text-subtitle1 text-weight-bold text-dark">{{ formatarMoeda(totais.saldo) }}</div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Lista de Transações Agrupadas (Simulando agrupamento por facilidade do mock) -->
      <div class="text-subtitle2 text-grey-7 q-mb-sm q-ml-sm">Transações do Período</div>
      
      <q-card class="shadow-1" style="border-radius: 12px;">
        <q-inner-loading :showing="carregando" label="Atualizando transações..." />
        
        <q-list separator v-show="!carregando">
          <q-item v-for="tx in transacoes" :key="tx.id" class="q-py-md">
            
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
                <q-icon name="person" size="xs" class="q-mr-xs" /> {{ tx.pessoaNome || 'N/I' }}
              </q-item-label>
              <q-item-label caption class="text-grey-7">
                <q-icon name="category" size="xs" class="q-mr-xs" /> {{ tx.operacaoDescricao || 'Categoria não inf.' }}
              </q-item-label>
              <q-item-label caption class="text-grey-5 q-mt-xs">
                {{ formatarData(tx.dataEmissao) }}
              </q-item-label>
            </q-item-section>

            <!-- Valor e Badge -->
            <q-item-section side top>
              <div class="text-weight-bold text-body1 q-mb-sm" :class="tx.tipo === 'RECEITA' ? 'text-primary' : 'text-negative'">
                {{ tx.tipo === 'RECEITA' ? '+' : '-' }} {{ formatarMoeda(tx.valorTotal) }}
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
          <q-item v-if="transacoes.length === 0">
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
import { ref, onMounted, watch } from 'vue';
import { api } from '../services/api';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Filtros
const filtroTipo = ref('Todos');
const filtroDataInicio = ref('');
const filtroDataFim = ref('');

// Estado Reativo Real
const carregando = ref(true);
interface ItemTransacaoRelatorio {
  id: number;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  dataEmissao: string;
  pessoaNome?: string;
  operacaoDescricao?: string;
  valorTotal: number;
  status: 'PAGO' | 'ABERTO' | 'PARCIAL';
}

const transacoes = ref<ItemTransacaoRelatorio[]>([]);
const totais = ref({
  receitas: 0,
  despesas: 0,
  saldo: 0
});

// Busca ao Backend Custeio Agricola
const buscarFluxoCaixa = async () => {
  carregando.value = true;
  try {
    // Monta a querystring para os filtros do Backend (Módulo 5)
    const params: Record<string, string> = {};
    
    // Mapeamento do label da Tela para o Enum do Backend
    if (filtroTipo.value === 'Receitas') params.tipo = 'RECEITA';
    if (filtroTipo.value === 'Despesas') params.tipo = 'DESPESA';
    
    // Filtros de Data
    if (filtroDataInicio.value) params.dataInicio = filtroDataInicio.value;
    if (filtroDataFim.value) params.dataFim = filtroDataFim.value;

    // TODO: Paginação seria enviada aqui (params.pagina = 1) no futuro. Para MVP, a api traz as primeiras 20 por padrão.

    const response = await api.get('/relatorios/fluxo-caixa', { params });
    
    // Atualização Reativa Visual
    transacoes.value = response.data.dados;
    totais.value = response.data.totais;

  } catch (error: unknown) {
    console.error('Erro ao buscar fluxo de caixa:', error);
    $q.notify({
      type: 'negative',
      message: 'Não foi possível carregar as transações. Verifique sua conexão.',
      position: 'top',
    });
  } finally {
    carregando.value = false;
  }
};

// Dispara a busca automática cada vez que um filtro é modificado na tela
watch([filtroTipo, filtroDataInicio, filtroDataFim], () => {
  void buscarFluxoCaixa();
});

onMounted(() => {
  void buscarFluxoCaixa();
});

// Helpers Visuais
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(valor) || 0);
};

const formatarData = (dataStr: string) => {
  if (!dataStr) return '';
  const data = new Date(dataStr);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(data);
};
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
