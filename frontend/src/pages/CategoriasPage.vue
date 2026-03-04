<template>
  <q-page class="bg-grey-1 p-md">
    <!-- Header Local -->
    <div class="q-px-md q-pt-md q-pb-sm bg-white shadow-1 z-top">
      <div class="text-h6 text-dark text-weight-bold">Gerenciar Categorias</div>
    </div>

    <!-- Lista de Categorias -->
    <div class="q-pa-md">
      <q-card class="shadow-1" style="border-radius: 12px;">
        <q-list separator>
          <q-item v-for="cat in categorias" :key="cat.id" class="q-py-md">
            <q-item-section avatar>
              <q-icon 
                :name="cat.tipo === 'RECEITA' ? 'trending_up' : 'trending_down'" 
                :color="cat.tipo === 'RECEITA' ? 'primary' : 'negative'" 
                size="md"
              />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-weight-bold text-dark text-subtitle1">{{ cat.descricao }}</q-item-label>
              <q-item-label caption>Categoria base</q-item-label>
            </q-item-section>
            
            <q-item-section side>
              <q-badge 
                :color="cat.tipo === 'RECEITA' ? 'green-2' : 'red-2'" 
                :text-color="cat.tipo === 'RECEITA' ? 'primary' : 'negative'"
                class="text-weight-bold q-pa-sm"
              >
                {{ cat.tipo }}
              </q-badge>
            </q-item-section>
          </q-item>
          
          <q-item v-if="categorias.length === 0 && !carregando">
            <q-item-section class="text-center text-grey-6 q-py-lg">
              <q-icon name="inbox" size="xl" class="q-mb-sm auto-margin"/>
              Nenhuma categoria cadastrada.
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
          <div class="text-h6 text-weight-bold">Nova Categoria</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-input 
            v-model="form.descricao" 
            outlined 
            label="Descrição" 
            placeholder="Ex: Combustível, Sementes, Venda Grãos"
            autofocus 
            class="q-mb-md"
          />

          <div class="text-subtitle2 text-grey-8 q-mb-sm">Tipo de Categoria</div>
          <q-btn-toggle
            v-model="form.tipo"
            spread
            class="shadow-1"
            no-caps
            rounded
            toggle-color="white"
            :options="[
              { label: 'Receita', value: 'RECEITA' },
              { label: 'Despesa', value: 'DESPESA' }
            ]"
          >
            <!-- Slot Dinâmico para Customizar Cor baseado no botão ativo -->
            <template #RECEITA>
              <div :class="form.tipo === 'RECEITA' ? 'text-primary text-weight-bold' : ''">Receita</div>
            </template>
            <template #DESPESA>
              <div :class="form.tipo === 'DESPESA' ? 'text-negative text-weight-bold' : ''">Despesa</div>
            </template>
          </q-btn-toggle>
        </q-card-section>

        <q-card-actions align="right" class="text-primary q-pa-md">
          <q-btn flat label="Cancelar" v-close-popup color="grey-7" class="text-weight-bold" />
          <q-btn unelevated label="Salvar Categoria" color="primary" class="text-weight-bold" @click="salvarCategoria" :loading="salvando" />
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

interface Categoria {
  id: number;
  descricao: string;
  tipo: 'RECEITA' | 'DESPESA';
}

const categorias = ref<Categoria[]>([]);
const carregando = ref(true);
const modalAberto = ref(false);
const salvando = ref(false);

const form = ref({
  descricao: '',
  tipo: 'DESPESA' as 'RECEITA' | 'DESPESA'
});

const buscarCategorias = async () => {
  carregando.value = true;
  try {
    const res = await api.get('/operacoes');
    categorias.value = res.data;
  } catch (error: unknown) {
    console.error('Erro ao buscar categorias:', error);
    $q.notify({ type: 'negative', message: 'Falha ao buscar as categorias.', position: 'top' });
  } finally {
    carregando.value = false;
  }
};

const abrirModal = () => {
  form.value.descricao = '';
  form.value.tipo = 'DESPESA';
  modalAberto.value = true;
};

const salvarCategoria = async () => {
  if (!form.value.descricao.trim()) {
    $q.notify({ type: 'warning', message: 'A descrição é obrigatória', position: 'top' });
    return;
  }

  salvando.value = true;
  try {
    // Usando a entity OperacaoFinanceira que já aceita descricao e enum tipoTipo
    await api.post('/operacoes', {
      descricao: form.value.descricao,
      tipo: form.value.tipo
    });

    $q.notify({ type: 'positive', message: 'Categoria salva com sucesso!', position: 'top', icon: 'check_circle' });
    modalAberto.value = false;
    
    // Recarrega a listagem
    void buscarCategorias();

  } catch (error: unknown) {
    console.error('Erro ao salvar:', error);
    const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Erro inesperado na gravação.';
    $q.notify({ type: 'negative', message: `Erro: ${msg}`, position: 'top' });
  } finally {
    salvando.value = false;
  }
};

onMounted(() => {
  void buscarCategorias();
});
</script>

<style scoped>
.auto-margin { margin: 0 auto; display: block; }
</style>
