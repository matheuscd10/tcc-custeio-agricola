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
            v-model="formValue[tab].valorTotal"
            type="number"
            class="text-h3 text-weight-bolder"
            input-class="text-center text-dark"
            borderless
            placeholder="0,00"
            autofocus
            :disable="carregandoOpcoes"
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
            v-model="formValue[tab].operacaoId" 
            outlined 
            :options="opcoesCategoria" 
            label="Categoria" 
            emit-value 
            map-options 
            bg-color="white"
            :loading="carregandoOpcoes"
            :disable="carregandoOpcoes"
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
                v-model="formValue[tab].dadosBancariosId" 
                outlined 
                :options="opcoesConta" 
                label="Conta Bancária" 
                emit-value 
                map-options 
                bg-color="white"
                :loading="carregandoOpcoes"
                :disable="carregandoOpcoes"
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
        :loading="carregando"
        :disable="carregandoOpcoes"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from '../services/api';

const $q = useQuasar();

const tab = ref<'despesa' | 'receita'>('despesa');
const carregando = ref(false); // loading do botão salvar
const carregandoOpcoes = ref(true); // loading da tela inicial

// Objeto reativo para os formulários simulando os DTOs do backend
const formDespesa = ref({
  valorTotal: null as number | null,
  descricao: '',
  operacaoId: null as number | null, // categoria
  pessoaId: null as number | null,
  dataEmissao: new Date().toISOString().split('T')[0],
  dataVencimento: new Date().toISOString().split('T')[0],
  jaPago: false,
  dadosBancariosId: null as number | null, // conta bancaria para baixa
});

const formReceita = ref({
  valorTotal: null as number | null,
  descricao: '',
  operacaoId: null as number | null, // categoria
  pessoaId: null as number | null,
  dataEmissao: new Date().toISOString().split('T')[0],
  dataVencimento: new Date().toISOString().split('T')[0],
  jaPago: false,
  dadosBancariosId: null as number | null, // conta bancaria para baixa
});

// Acesso dinâmico baseado na aba selecionada
const formValue = computed(() => {
  return {
    despesa: formDespesa.value,
    receita: formReceita.value,
  };
});

// Ref's para armazenar os dados dos selects (dropdowns)
const opcoesCategoria = ref<{ label: string; value: number }[]>([]);
const opcoesPessoa = ref<{ label: string; value: number }[]>([]);
const opcoesConta = ref<{ label: string; value: number }[]>([]);

interface PayloadPessoa {
  id: number;
  nome?: string;
  pessoaJuridica?: { razaoSocial: string };
  pessoaFisica?: { cpf: string };
}
interface PayloadOperacao {
  id: number;
  descricao: string;
}
interface PayloadBanco {
  id: number;
  banco?: { nome: string };
  agencia: string;
  conta: string;
}

// Carregamento de dados base via API
const carregarOpcoes = async () => {
  try {
    carregandoOpcoes.value = true;
    
    // Dispara requests simultâneos
    const [resPessoas, resOperacoes, resBancos] = await Promise.all([
      api.get('/pessoas'),
      api.get('/operacoes'),
      api.get('/bancos/dados-bancarios/todos'),
    ]);

    // Mapeamento para { label, value } do Quasar Select
    opcoesPessoa.value = resPessoas.data.map((p: PayloadPessoa) => ({
      label: p.nome || p.pessoaJuridica?.razaoSocial || p.pessoaFisica?.cpf || 'Desconhecido',
      value: p.id,
    }));

    opcoesCategoria.value = resOperacoes.data.map((o: PayloadOperacao) => ({
      label: o.descricao,
      value: o.id,
    }));

    // Mostra Banco + Conta nas opções
    opcoesConta.value = resBancos.data.map((cc: PayloadBanco) => ({
      label: `${cc.banco?.nome || 'Banco'} - Ag: ${cc.agencia} / CC: ${cc.conta}`,
      value: cc.id,
    }));

  } catch (error) {
    console.error('Erro ao carregar opções do formulário:', error);
    $q.notify({
      type: 'negative',
      message: 'Falha ao carregar opções (Pessoas, Categorias, Contatos).',
      position: 'top',
    });
  } finally {
    carregandoOpcoes.value = false;
  }
};

onMounted(() => {
  void carregarOpcoes();
});

const limparFormulario = () => {
  const isDespesa = tab.value === 'despesa';
  const dataHoje = new Date().toISOString().split('T')[0];

  if (isDespesa) {
    formDespesa.value = {
      valorTotal: null,
      descricao: '',
      operacaoId: null,
      pessoaId: null,
      dataEmissao: dataHoje,
      dataVencimento: dataHoje,
      jaPago: false,
      dadosBancariosId: null,
    };
  } else {
    formReceita.value = {
      valorTotal: null,
      descricao: '',
      operacaoId: null,
      pessoaId: null,
      dataEmissao: dataHoje,
      dataVencimento: dataHoje,
      jaPago: false,
      dadosBancariosId: null,
    };
  }
};

const salvarLancamento = async () => {
  const dados = formValue.value[tab.value];
  const isDespesa = tab.value === 'despesa';
  
  // Validações básicas
  if (!dados.valorTotal || dados.valorTotal <= 0) {
    $q.notify({ type: 'warning', message: 'Informe um valor da transação válido.', position: 'top' });
    return;
  }
  if (!dados.descricao || !dados.operacaoId || !dados.pessoaId) {
    $q.notify({ type: 'warning', message: 'Preencha todos os campos obrigatórios (Descrição, Categoria, Pessoa).', position: 'top' });
    return;
  }
  if (dados.jaPago && !dados.dadosBancariosId) {
    $q.notify({ type: 'warning', message: 'Selecione a conta bancária para confirmar o pagamento.', position: 'top' });
    return;
  }

  carregando.value = true;
  
  try {
    // 1. Payload de Criação (Titulo)
    const payloadTitulo = {
      descricao: dados.descricao,
      pessoaId: dados.pessoaId,
      operacaoId: dados.operacaoId,
      valorTotal: Number(dados.valorTotal),
      dataEmissao: dados.dataEmissao + 'T00:00:00.000Z',
      dataVencimento: dados.dataVencimento + 'T00:00:00.000Z',
      observacao: '',
      valores: [
        {
          valor: Number(dados.valorTotal),
          dataVencimento: dados.dataVencimento + 'T00:00:00.000Z'
        }
      ]
    };

    let tituloCriadoId: number;
    
    if (isDespesa) {
      // POST Despesa
      const res = await api.post('/titulos-pagar', payloadTitulo);
      tituloCriadoId = res.data.id;
    } else {
      // POST Receita
      const res = await api.post('/titulos-receber', payloadTitulo);
      tituloCriadoId = res.data.id;
    }

    // 2. Rotina de Baixa Automática (se já foi pago)
    if (dados.jaPago && dados.dadosBancariosId) {

      if (isDespesa) {
        const payloadBaixaPagar = {
          tituloId: tituloCriadoId,
          valorPago: Number(dados.valorTotal),
          dataPagamento: new Date().toISOString(),
          dadosBancariosId: dados.dadosBancariosId,
          observacao: 'Baixa automática gerada na tela de lançamento'
        };
        await api.post(`/baixas/pagar`, payloadBaixaPagar);
      } else {
        const payloadBaixaReceber = {
          tituloId: tituloCriadoId,
          valorRecebido: Number(dados.valorTotal),
          dataRecebimento: new Date().toISOString(),
          dadosBancariosId: dados.dadosBancariosId,
          observacao: 'Baixa automática gerada na tela de lançamento'
        };
        await api.post(`/baixas/receber`, payloadBaixaReceber);
      }
    }

    $q.notify({
      type: isDespesa ? 'negative' : 'positive',
      message: `${isDespesa ? 'Despesa' : 'Receita'} salva com sucesso!`,
      position: 'top',
      icon: 'check_circle'
    });

    limparFormulario();

  } catch (error: unknown) {
    console.error('Erro ao salvar lançamento:', error);
    const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro inesperado na gravação.';
    $q.notify({ type: 'negative', message: `Erro ao salvar: ${msg}`, position: 'top' });
  } finally {
    carregando.value = false;
  }
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
