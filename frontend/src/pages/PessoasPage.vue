<template>
  <q-page class="bg-grey-1 p-md">
    <!-- Header Local -->
    <div class="q-px-md q-pt-md q-pb-sm bg-white shadow-1 z-top">
      <div class="text-h6 text-dark text-weight-bold">Gerenciar Pessoas</div>
      <div class="text-caption text-grey-7">Clientes, Fornecedores e Funcionários</div>
    </div>

    <!-- Lista de Pessoas -->
    <div class="q-pa-md">
      <q-card class="shadow-1" style="border-radius: 12px;">
        <q-list separator>
          <q-item v-for="pessoa in pessoas" :key="pessoa.id" class="q-py-md">
            <q-item-section avatar>
              <q-avatar :color="pessoa.tipo === 'FISICA' ? 'blue-2' : 'orange-2'" :text-color="pessoa.tipo === 'FISICA' ? 'primary' : 'orange-9'">
                {{ pessoa.tipo === 'FISICA' ? 'PF' : 'PJ' }}
              </q-avatar>
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-weight-bold text-dark text-subtitle1">
                {{ pessoa.nome || (pessoa.pessoaJuridica && pessoa.pessoaJuridica.razaoSocial) || 'Sem Nome' }}
              </q-item-label>
              <q-item-label caption>
                Documento: {{ (pessoa.pessoaFisica && pessoa.pessoaFisica.cpf) || (pessoa.pessoaJuridica && pessoa.pessoaJuridica.cnpj) || 'N/A' }}
              </q-item-label>
            </q-item-section>
            
            <q-item-section side>
              <q-badge 
                :color="pessoa.tipo === 'FISICA' ? 'blue-1' : 'orange-1'" 
                :text-color="pessoa.tipo === 'FISICA' ? 'primary' : 'orange-9'"
                class="text-weight-bold q-pa-sm"
              >
                {{ pessoa.tipo === 'FISICA' ? 'Física' : 'Jurídica' }}
              </q-badge>
            </q-item-section>
          </q-item>
          
          <q-item v-if="pessoas.length === 0 && !carregando">
            <q-item-section class="text-center text-grey-6 q-py-lg">
              <q-icon name="group_off" size="xl" class="q-mb-sm auto-margin"/>
              Nenhuma pessoa cadastrada.
            </q-item-section>
          </q-item>
        </q-list>
        
        <q-inner-loading :showing="carregando">
          <q-spinner-dots size="50px" color="primary" />
        </q-inner-loading>
      </q-card>
    </div>

    <!-- Espaço pro FAB não cobrir as ultimas linhas -->
    <div style="height: 80px;"></div>

    <!-- Ponto de Ação Flutuante (FAB) -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="abrirModal" />
    </q-page-sticky>

    <!-- Dialog de Criação -->
    <q-dialog v-model="modalAberto" persistent>
      <q-card style="min-width: 350px; border-radius: 16px;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6 text-weight-bold">Nova Pessoa</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="text-subtitle2 text-grey-8 q-mb-sm">Tipo de Pessoa</div>
          <q-btn-toggle
            v-model="form.tipo"
            spread
            class="shadow-1 q-mb-lg"
            no-caps
            rounded
            toggle-color="white"
            :options="[
              { label: 'Física', value: 'FISICA' },
              { label: 'Jurídica', value: 'JURIDICA' }
            ]"
          >
            <!-- Slot Dinâmico para Customizar Cor baseado no botão ativo -->
            <template #FISICA>
              <div :class="form.tipo === 'FISICA' ? 'text-primary text-weight-bold' : ''">Física</div>
            </template>
            <template #JURIDICA>
              <div :class="form.tipo === 'JURIDICA' ? 'text-orange-9 text-weight-bold' : ''">Jurídica</div>
            </template>
          </q-btn-toggle>

          <q-input 
            v-model="form.nome" 
            outlined 
            :label="form.tipo === 'FISICA' ? 'Nome Completo' : 'Nome Fantasia / Razão Social'" 
            placeholder="Ex: João da Silva ou Agro Insumos"
            autofocus 
            class="q-mb-md"
          />

          <q-input 
            v-model="form.documento" 
            outlined 
            :label="form.tipo === 'FISICA' ? 'CPF' : 'CNPJ'" 
            :placeholder="form.tipo === 'FISICA' ? '000.000.000-00' : '00.000.000/0000-00'"
            class="q-mb-md"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
          <q-btn flat label="Cancelar" v-close-popup color="grey-7" class="text-weight-bold" />
          <q-btn unelevated label="Salvar Pessoa" color="primary" class="text-weight-bold" @click="salvarPessoa" :loading="salvando" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from '../services/api';

const $q = useQuasar();

interface PessoaList {
  id: number;
  nome: string;
  tipo: 'FISICA' | 'JURIDICA';
  pessoaFisica?: { cpf: string };
  pessoaJuridica?: { razaoSocial: string, cnpj: string };
}

const pessoas = ref<PessoaList[]>([]);
const carregando = ref(true);
const modalAberto = ref(false);
const salvando = ref(false);

const form = ref({
  nome: '',
  tipo: 'FISICA' as 'FISICA' | 'JURIDICA',
  documento: ''
});

const buscarPessoas = async () => {
  carregando.value = true;
  try {
    const res = await api.get('/pessoas');
    pessoas.value = res.data;
  } catch (error: unknown) {
    console.error('Erro ao buscar pessoas:', error);
    $q.notify({ type: 'negative', message: 'Falha ao buscar a lista de pessoas.', position: 'top' });
  } finally {
    carregando.value = false;
  }
};

const abrirModal = () => {
  form.value.nome = '';
  form.value.tipo = 'FISICA';
  form.value.documento = '';
  modalAberto.value = true;
};

const salvarPessoa = async () => {
  if (!form.value.nome.trim()) {
    $q.notify({ type: 'warning', message: 'O nome é obrigatório.', position: 'top' });
    return;
  }
  
  if (!form.value.documento.trim()) {
    $q.notify({ type: 'warning', message: `O formato de documento (${form.value.tipo === 'FISICA' ? 'CPF' : 'CNPJ'}) é obrigatório.`, position: 'top' });
    return;
  }

  salvando.value = true;
  try {
    // Monta o payload conforme a Entity Pessoa, PessoaFisica e PessoaJuridica do Nest.js
    const payload: Record<string, unknown> = {
      nome: form.value.nome,
      tipo: form.value.tipo,
    };

    if (form.value.tipo === 'FISICA') {
      payload.pessoaFisica = { cpf: form.value.documento };
    } else {
      payload.pessoaJuridica = { 
        cnpj: form.value.documento,
        razaoSocial: form.value.nome 
      };
    }

    await api.post('/pessoas', payload);

    $q.notify({ type: 'positive', message: 'Pessoa salva com sucesso!', position: 'top', icon: 'check_circle' });
    modalAberto.value = false;
    
    // Recarrega a listagem
    void buscarPessoas();

  } catch (error: unknown) {
    console.error('Erro ao salvar pessoa:', error);
    const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro inesperado na gravação.';
    $q.notify({ type: 'negative', message: `Erro ao salvar: ${msg}`, position: 'top' });
  } finally {
    salvando.value = false;
  }
};

onMounted(() => {
  void buscarPessoas();
});
</script>

<style scoped>
.auto-margin { margin: 0 auto; display: block; }
</style>
