<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="bg-grey-1 flex flex-center window-height">
        <q-card class="shadow-2 q-pa-xl" style="width: 100%; max-width: 400px; border-radius: 16px;">
          
          <div class="text-center q-mb-xl">
            <q-icon name="agriculture" size="64px" color="primary" class="q-mb-sm" />
            <div class="text-h5 text-weight-bold text-dark">Custeio Agrícola</div>
            <div class="text-subtitle2 text-grey-6">Gestão financeira da sua safra</div>
          </div>

          <q-form @submit.prevent="fazerLogin" class="q-gutter-md">
            
            <q-input 
              v-model="email" 
              outlined 
              type="email" 
              label="E-mail" 
              placeholder="exemplo@fazenda.com"
              bg-color="white"
              clearable 
              lazy-rules
              :rules="[val => !!val || 'E-mail é obrigatório']"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>

            <q-input 
              v-model="senha" 
              outlined 
              :type="mostrarSenha ? 'text' : 'password'" 
              label="Senha" 
              bg-color="white"
              clearable 
              lazy-rules
              :rules="[val => !!val || 'Senha é obrigatória']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon 
                  :name="mostrarSenha ? 'visibility_off' : 'visibility'" 
                  class="cursor-pointer" 
                  @click="mostrarSenha = !mostrarSenha" 
                />
              </template>
            </q-input>

            <div class="q-pt-md">
              <q-btn 
                type="submit" 
                class="full-width text-weight-bold" 
                size="lg" 
                color="primary" 
                label="Entrar" 
                unelevated
                rounded
                :loading="carregando"
              />
            </div>

          </q-form>

        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from '../services/api';

const router = useRouter();
const $q = useQuasar();

const email = ref('');
const senha = ref('');
const mostrarSenha = ref(false);
const carregando = ref(false);

const fazerLogin = async () => {
  carregando.value = true;

  try {
    // Integração com a API - Rota gerada no Módulo 2 do Backend
    const response = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value,
    });

    const { access_token } = response.data;

    // Salva o token no storage do browser
    localStorage.setItem('access_token', access_token);

    $q.notify({
      type: 'positive',
      message: 'Login realizado com sucesso!',
      icon: 'check_circle',
      position: 'top',
    });

    // Redireciona para a raiz (Dashboard protegida)
    void router.push('/');

  } catch (error: unknown) {
    console.error('Erro no login:', error);
    
    // Mostra erro caso o backend retorne 401 ou erro genérico
    const mensagemErro = (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'E-mail ou senha inválidos. Tente novamente.';
    
    $q.notify({
      type: 'negative',
      message: mensagemErro,
      icon: 'error',
      position: 'top',
    });
  } finally {
    carregando.value = false;
  }
};
</script>
