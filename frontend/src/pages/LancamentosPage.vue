<template>
  <q-page class="bg-grey-1 window-height column no-wrap">
    <!-- Top Bar Interna (para mobile ou header local) -->
    <div class="q-px-md q-pt-md q-pb-sm bg-white shadow-1 z-top">
      <div class="text-h6 text-dark text-weight-bold">Novo Lançamento</div>
    </div>

    <!-- Tabs Receita / Despesa -->
    <q-tabs
      v-model="tab"
      dense
      class="bg-white text-grey-7 shadow-1 z-top"
      active-color="white"
      indicator-color="transparent"
      align="justify"
      narrow-indicator
    >
      <q-tab 
        name="despesa" 
        label="Despesa" 
        :class="tab === 'despesa' ? 'bg-negative text-white text-weight-bold' : ''" 
      />
      <q-tab 
        name="receita" 
        label="Receita" 
        :class="tab === 'receita' ? 'bg-primary text-white text-weight-bold' : ''" 
      />
    </q-tabs>

    <!-- Área de Scroll Principal -->
    <q-scroll-area class="col q-pa-md">
      
      <!-- HERO SECTION: Valor -->
      <div class="row justify-center q-my-xl">
        <div class="col-12 col-md-8 text-center">
          <div class="text-subtitle1 text-grey-7 q-mb-sm">Valor (R$)</div>
          <q-input
            v-model="formValue[tab].valor"
            type="number"
            class="text-h3 text-weight-bolder"
            input-class="text-center text-dark"
            borderless
            placeholder="0,00"
            autofocus
          />
          <q-separator class="q-mt-sm" :color="tab === 'despesa' ? 'negative' : 'primary'" size="2px" />
        </div>
      </div>

      <!-- Formulário -->
      <div class="row q-col-gutter-md">
        <!-- Descrição -->
        <div class="col-12">
          <q-input 
            v-model="formValue[tab].descricao" 
            outlined 
            label="Descrição" 
            placeholder="Ex: Compra de Fertilizantes" 
            bg-color="white"
          />
        </div>

        <!-- Categoria -->
        <div class="col-12">
          <q-select 
            v-model="formValue[tab].categoriaId" 
            outlined 
            :options="opcoesCategoria" 
            label="Categoria" 
            emit-value 
            map-options 
            bg-color="white"
          />
        </div>

        <!-- Fornecedor / Cliente -->
        <div class="col-12">
          <q-select 
            v-model="formValue[tab].pessoaId" 
            outlined 
            :options="opcoesPessoa" 
            :label="tab === 'despesa' ? 'Fornecedor' : 'Cliente'" 
            emit-value 
            map-options 
            bg-color="white"
          />
        </div>

        <!-- Datas em duas colunas -->
        <div class="col-6">
          <q-input 
            v-model="formValue[tab].dataEmissao" 
            outlined 
            type="date" 
            label="Data Emissão" 
            bg-color="white"
            stack-label
          />
        </div>
        <div class="col-6">
          <q-input 
            v-model="formValue[tab].dataVencimento" 
            outlined 
            type="date" 
            label="Vencimento" 
            bg-color="white"
            stack-label
          />
        </div>
      </div>

      <!-- Seção Bancária e Baixa -->
      <q-card class="q-mt-md shadow-0 bordered" style="border-radius: 12px;">
        <q-card-section>
          <div class="row items-center justify-between">
            <div class="text-subtitle2 text-dark text-weight-medium">
              O {{ tab === 'despesa' ? 'pagamento' : 'recebimento' }} já foi realizado?
            </div>
            <q-toggle 
              v-model="formValue[tab].jaPago" 
              :color="tab === 'despesa' ? 'negative' : 'primary'" 
            />
          </div>

          <q-slide-transition>
            <div v-if="formValue[tab].jaPago" class="q-mt-md">
              <q-select 
                v-model="formValue[tab].contaBancariaId" 
                outlined 
                :options="opcoesConta" 
                label="Conta Bancária" 
                emit-value 
                map-options 
                bg-color="white"
              />
            </div>
          </q-slide-transition>
        </q-card-section>
      </q-card>

      <!-- Espaço extra para o FAB / Footer -->
      <div style="height: 80px;"></div>

    </q-scroll-area>

    <!-- FOOTER / Ação Principal -->
    <div class="bg-white q-pa-md shadow-up-2 fixed-bottom z-top">
      <q-btn 
        class="full-width text-weight-bold" 
        size="lg" 
        :color="tab === 'despesa' ? 'negative' : 'primary'" 
        :label="`Salvar ${tab === 'despesa' ? 'Despesa' : 'Receita'}`" 
        unelevated
        rounded
        @click="salvarLancamento"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const tab = ref<'despesa' | 'receita'>('despesa');

// Objeto reativo para os formulários simulando os DTOs do backend
const formDespesa = ref({
  valor: null,
  descricao: '',
  categoriaId: null,
  pessoaId: null,
  dataEmissao: new Date().toISOString().split('T')[0],
  dataVencimento: new Date().toISOString().split('T')[0],
  jaPago: false,
  contaBancariaId: null,
});

const formReceita = ref({
  valor: null,
  descricao: '',
  categoriaId: null,
  pessoaId: null,
  dataEmissao: new Date().toISOString().split('T')[0],
  dataVencimento: new Date().toISOString().split('T')[0],
  jaPago: false,
  contaBancariaId: null,
});

// Acesso dinâmico baseado na aba selecionada
const formValue = computed(() => {
  return {
    despesa: formDespesa.value,
    receita: formReceita.value,
  };
});

// DADOS MOCKADOS para os selects
const opcoesCategoria = [
  { label: 'Insumos / Fertilizantes', value: 1 },
  { label: 'Sementes', value: 2 },
  { label: 'Venda Agrícola', value: 3 },
  { label: 'Manutenção de Máquinas', value: 4 },
];

const opcoesPessoa = [
  { label: 'Agro Insumos Ltda', value: 1 },
  { label: 'Cooperativa Agrícola Regional', value: 2 },
  { label: 'João Silva (Fazendeiro)', value: 3 },
];

const opcoesConta = [
  { label: 'Banco do Brasil - C/C 12345-6', value: 1 },
  { label: 'Sicredi - C/C 9876-0', value: 2 },
];

const salvarLancamento = () => {
  const dados = formValue.value[tab.value];
  console.log(`Salvando ${tab.value}:`, dados);
  
  $q.notify({
    type: tab.value === 'despesa' ? 'negative' : 'positive',
    message: `${tab.value === 'despesa' ? 'Despesa' : 'Receita'} salva com sucesso!`,
    position: 'top',
    icon: 'check_circle'
  });
};
</script>

<style scoped>
/* Remove as setas de spinner no input number */
:deep(input[type=number]::-webkit-outer-spin-button),
:deep(input[type=number]::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
:deep(input[type=number]) {
  -moz-appearance: textfield;
}

/* Fixar o footer não sobrescrever conteúdo e manter o card sempre aparente */
</style>
