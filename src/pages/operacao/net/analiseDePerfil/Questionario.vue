<template>
  <v-card elevation="0">
    <!-- <v-btn @click="enviarQuestionario">teste</v-btn> -->
    <!-- <pre>{{ formularioRespondido }}</pre> -->
    <!-- <pre>{{ formularioAnalisePerfil }}</pre> -->
    <div
      style="
        display: flex;
        flex-direction: row;
        justify-content: center;
        border-bottom: 1px solid black;
        margin: 10px;
      "
    >
      <h3>Responder</h3>
    </div>
    <v-row justify="center" align="center" class="mt-3 mb-3">
      <div>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              @click="saveResponderAgora"
              class="mx-2"
              color="success"
              v-bind="attrs"
              v-on="on"
            >
              Agora
            </v-btn>
          </template>
          <span>Uma vez confirmado não será possivel mudar!</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              color="error"
              :disabled="
                validacaoResposta.RESPONDER_AGORA === 1 || validacaoResposta.RESPONDER_AGORA === 0
              "
              @click="saveResponderDepois"
              v-bind="attrs"
              v-on="on"
            >
              Depois
            </v-btn>
          </template>
          <span>Questionário voltará amanhã!</span>
        </v-tooltip>
      </div>
    </v-row>

    <template v-if="responderAgora">
      <v-stepper v-model="e6" vertical elevation="0">
        <!-- PERGUNTA 1 -->
        <v-stepper-step :complete="e6 > 1" step="1">
          <h3>Eu sou...</h3>
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euSou" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuSou"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 2"
            :disabled="formularioAnalisePerfil.selectedEuSou == null"
          >
            Continue
          </v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 2 -->
        <v-stepper-step :complete="e6 > 2" step="2">
          <h3>Eu gosto de....</h3>
        </v-stepper-step>

        <v-stepper-content step="2">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euGostoDe" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuGostoDe"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 3"
            :disabled="formularioAnalisePerfil.selectedEuGostoDe == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 1" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 3 -->
        <v-stepper-step :complete="e6 > 3" step="3">
          <h3>Se você quiser se dar bem comigo...</h3>
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.seDarBemComigo" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedSedarBemComigo"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 4"
            :disabled="formularioAnalisePerfil.selectedSedarBemComigo == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 2" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 4 -->
        <v-stepper-step :complete="e6 > 4" step="4">
          <h3>Para conseguir obter bons resultados é preciso...</h3>
        </v-stepper-step>

        <v-stepper-content step="4">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.bonsResultados" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedBonsResultados"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 5"
            :disabled="formularioAnalisePerfil.selectedBonsResultados == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 3" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 5 -->
        <v-stepper-step :complete="e6 > 5" step="5">
          <h3>Eu me divirto quando...</h3>
        </v-stepper-step>

        <v-stepper-content step="5">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.meDivirtoQuando" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedMeDivirtoQuando"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 6"
            :disabled="formularioAnalisePerfil.selectedMeDivirtoQuando == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 4" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 6 -->
        <v-stepper-step :complete="e6 > 6" step="6">
          <h3>Eu penso que...</h3>
        </v-stepper-step>

        <v-stepper-content step="6">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euPensoQue" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuPensoQue"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 7"
            :disabled="formularioAnalisePerfil.selectedEuPensoQue == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 5" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 7 -->
        <v-stepper-step :complete="e6 > 7" step="7">
          <h3>Minha preocupação é...</h3>
        </v-stepper-step>

        <v-stepper-content step="7">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.minhaPreocupacao" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedMinhaPreocupacao"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 8"
            :disabled="formularioAnalisePerfil.selectedMinhaPreocupacao == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 6" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 8 -->
        <v-stepper-step :complete="e6 > 8" step="8">
          <h3>Eu prefiro...</h3>
        </v-stepper-step>

        <v-stepper-content step="8">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euPrefiro" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuPrefiro"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 9"
            :disabled="formularioAnalisePerfil.selectedEuPrefiro == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 7" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 9 -->
        <v-stepper-step :complete="e6 > 9" step="9">
          <h3>Eu gosto de...</h3>
        </v-stepper-step>

        <v-stepper-content step="9">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euGostoDeN" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuGostoDeN"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 10"
            :disabled="formularioAnalisePerfil.selectedEuGostoDeN == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 8" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 10 -->
        <v-stepper-step :complete="e6 > 10" step="10">
          <h3>Eu gosto de chegar...</h3>
        </v-stepper-step>

        <v-stepper-content step="10">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euGostoDeChegar" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuGostoDeChegar"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 11"
            :disabled="formularioAnalisePerfil.selectedEuGostoDeChegar == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 9" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 11 -->
        <v-stepper-step :complete="e6 > 11" step="11">
          <h3>Um ótimo dia para mim é quando...</h3>
        </v-stepper-step>

        <v-stepper-content step="11">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.otimoDiaPraMim" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedOtimoDiaPraMim"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 12"
            :disabled="formularioAnalisePerfil.selectedOtimoDiaPraMim == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 10" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 12 -->
        <v-stepper-step :complete="e6 > 12" step="12">
          <h3>Eu vejo a morte como...</h3>
        </v-stepper-step>

        <v-stepper-content step="12">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.vejoAMorte" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedVejoAMorte"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 13"
            :disabled="formularioAnalisePerfil.selectedVejoAMorte == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 11" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 13 -->
        <v-stepper-step :complete="e6 > 13" step="13">
          <h3>Minha filosofia de vida é...</h3>
        </v-stepper-step>

        <v-stepper-content step="13">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.filosofiaDeVida" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedFilosofiaDeVida"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 14"
            :disabled="formularioAnalisePerfil.selectedFilosofiaDeVida == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 12" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 14 -->
        <v-stepper-step :complete="e6 > 14" step="14">
          <h3>Eu sempre gostei de...</h3>
        </v-stepper-step>

        <v-stepper-content step="14">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.sempreGostei" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedSempreGostei"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 15"
            :disabled="formularioAnalisePerfil.selectedSempreGostei == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 13" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 15 -->
        <v-stepper-step :complete="e6 > 15" step="15">
          <h3>Eu gosto de mudanças se...</h3>
        </v-stepper-step>

        <v-stepper-content step="15">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.gostoDeMudancas" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedGostoDeMudancas"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 16"
            :disabled="formularioAnalisePerfil.selectedGostoDeMudancas == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 14" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 16 -->
        <v-stepper-step :complete="e6 > 16" step="16">
          <h3>Não existe nada de errado em...</h3>
        </v-stepper-step>

        <v-stepper-content step="16">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.nadaDeErradoEm" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedNadaDeErradoEm"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 17"
            :disabled="formularioAnalisePerfil.selectedNadaDeErradoEm == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 15" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 17 -->
        <v-stepper-step :complete="e6 > 17" step="17">
          <h3>Eu gosto de buscar conselhos de...</h3>
        </v-stepper-step>

        <v-stepper-content step="17">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.gostoDeBuscarConselhos" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedGostoDeBuscarConselhos"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 18"
            :disabled="formularioAnalisePerfil.selectedGostoDeBuscarConselhos == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 16" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 18 -->
        <v-stepper-step :complete="e6 > 18" step="18">
          <h3>Meu lema é...</h3>
        </v-stepper-step>

        <v-stepper-content step="18">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.meuLema" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedMeuLema"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 19"
            :disabled="formularioAnalisePerfil.selectedMeuLema == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 17" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 19 -->
        <v-stepper-step :complete="e6 > 19" step="19">
          <h3>Eu gosto de...</h3>
        </v-stepper-step>

        <v-stepper-content step="19">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euGostoDeM" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuGostoDeM"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 20"
            :disabled="formularioAnalisePerfil.selectedEuGostoDeM == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 18" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 20 -->
        <v-stepper-step :complete="e6 > 20" step="20">
          <h3>Tempo para mim é...</h3>
        </v-stepper-step>

        <v-stepper-content step="20">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.tempoPraMim" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedTempoPraMim"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 21"
            :disabled="formularioAnalisePerfil.selectedTempoPraMim == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 19" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>
        <!-- PERGUNTA 21 -->
        <v-stepper-step :complete="e6 > 21" step="21">
          <h3>Se eu fosse bilionário...</h3>
        </v-stepper-step>

        <v-stepper-content step="21">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.seFosseBilionario" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedSeFosseBilionario"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 22"
            :disabled="formularioAnalisePerfil.selectedSeFosseBilionario == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 20" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 22 -->
        <v-stepper-step :complete="e6 > 22" step="22">
          <h3>Eu acredito que...</h3>
        </v-stepper-step>

        <v-stepper-content step="22">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.acreditoQue" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedAcreditoQue"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 23"
            :disabled="formularioAnalisePerfil.selectedAcreditoQue == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 21" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 23 -->
        <v-stepper-step :complete="e6 > 23" step="23">
          <h3>Eu acredito também que...</h3>
        </v-stepper-step>

        <v-stepper-content step="23">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.acreditoTambem" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedAcreditoTambem"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 24"
            :disabled="formularioAnalisePerfil.selectedAcreditoTambem == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 22" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 24 -->
        <v-stepper-step :complete="e6 > 24" step="24">
          <h3>Eu acredito ainda que...</h3>
        </v-stepper-step>

        <v-stepper-content step="24">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.acreditoAinda" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedAcreditoAinda"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="primary"
            @click="e6 = 25"
            :disabled="formularioAnalisePerfil.selectedAcreditoAinda == null"
          >
            Continue
          </v-btn>
          <v-btn text @click="e6 = 23" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>

        <!-- PERGUNTA 25 -->
        <v-stepper-step step="25">
          <h3>Eu penso que...</h3>
        </v-stepper-step>

        <v-stepper-content step="25">
          <v-card elevation="0" class="mt-n6 mb-6">
            <v-col>
              <v-list v-for="(item, i) in opcoes.euPensoQueN" :key="i" class="mb-n7">
                <v-checkbox
                  dense
                  v-model="formularioAnalisePerfil.selectedEuPensoQueN"
                  :label="item.text"
                  :value="item.grupo"
                ></v-checkbox>
              </v-list>
            </v-col>
          </v-card>
          <v-btn
            color="success"
            :disabled="formularioAnalisePerfil.selectedEuPensoQueN == null"
            @click="enviarQuestionario()"
          >
            Finalizar
          </v-btn>
          <v-btn text @click="e6 = 24" class="ml-3" color="error">Voltar</v-btn>
        </v-stepper-content>
        <Resultado
          :resultadoQuestionario="resultadoQuestionario"
          :imagem="escolhaDeTeam()"
          @updated:close="emitMessage"
        />
      </v-stepper>
    </template>
    <load-envio-dados :envioDados="baixandoInfor"></load-envio-dados>
  </v-card>
</template>

<script>
  import opcoes from './opcoes.js'
  import Resultado from './Resultado.vue'

  import loadEnvioDados from '../../../../shared/components/load/loadHastag.vue'
  import config from '../../../../core/config.js'
  export default {
    components: { Resultado, loadEnvioDados },
    data: () => ({
      e6: 1,
      loteAtual: null,
      responderAgora: false,
      imageTeam: null,
      selected: '',
      baixandoInfor: false,
      resultadoQuestionario: false,
      formularioAnalisePerfil: {
        selectedEuSou: null,
        selectedEuGostoDe: null,
        selectedSedarBemComigo: null,
        selectedBonsResultados: null,
        selectedMeDivirtoQuando: null,
        selectedEuPensoQue: null,
        selectedMinhaPreocupacao: null,
        selectedEuPrefiro: null,
        selectedEuGostoDeN: null,
        selectedEuGostoDeChegar: null,
        selectedOtimoDiaPraMim: null,
        selectedVejoAMorte: null,
        selectedFilosofiaDeVida: null,
        selectedSempreGostei: null,
        selectedGostoDeMudancas: null,
        selectedNadaDeErradoEm: null,
        selectedGostoDeBuscarConselhos: null,
        selectedMeuLema: null,
        selectedEuGostoDeM: null,
        selectedTempoPraMim: null,
        selectedSeFosseBilionario: null,
        selectedAcreditoQue: null,
        selectedAcreditoTambem: null,
        selectedAcreditoAinda: null,
        selectedEuPensoQueN: null
      }
    }),
    computed: {
      opcoes() {
        return opcoes
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      validacaoResposta() {
        let validacaoResposta = this.$store.getters.validacaoResposta
        return validacaoResposta ? validacaoResposta : []
      },
      dadosFormularioTratado() {
        let dadosFormulario = Object.values(this.formularioAnalisePerfil)

        let array = [
          'EU_SOU',
          'EU_GOSTO_DE',
          'SE_DAR_BEM_COMIGO',
          'BONS_RESULTADOS',
          'ME_DIVIRTO_QUANDO',
          'EU_PENSO_QUE',
          'MINHA_PREOCUPACAO',
          'EU_PREFIRO',
          'EU_GOSTO_DEN',
          'EU_GOSTO_DE_CHEGAR',
          'OTIMO_DIA_PRA_MIM',
          'VEJO_A_MORTE',
          'FILOSOFIA_DE_VIDA',
          'SEMPRE_GOSTEI',
          'GOSTO_DE_MUDANCAS',
          'NADA_DE_ERRADO_EM',
          'GOSTO_DE_BUSCAR_CONSELHOS',
          'MEU_LEMA',
          'EU_GOSTO_DEM',
          'TEMPO_PRA_MIM',
          'SE_FOSSE_BILIONARIO',
          'ACREDITO_QUE',
          'ACREDITO_TAMBEM',
          'ACREDITO_AINDA',
          'EU_PENSO_QUEN'
        ]

        var result = dadosFormulario.map((key, value) => {
          return (array[value] = {
            ALMOPE: 4602597,
            PERGUNTA: array[value],
            RESPOSTA: key
          })
        })

        return result
      },

      formularioRespondido() {
        let respostas = Object.values({ ...this.formularioAnalisePerfil })
        let gabarito = this.countItems(respostas)

        let dados = {}

        for (let i = 0; i < gabarito.length; i++) {
          if (gabarito[i].nome == 'GATO') {
            dados.GATO = gabarito[i].quantidade
          } else if (gabarito[i].nome == 'LOBO') {
            dados.LOBO = gabarito[i].quantidade
          } else if (gabarito[i].nome == 'AGUIA') {
            dados.AGUIA = gabarito[i].quantidade
          } else if (gabarito[i].nome == 'TUBARÃO') {
            dados.TUBARAO = gabarito[i].quantidade
          }
        }

        // var result = Object.values(dados).filter((e) => {
        //   return e.GATO != "" && e.LOBO != "" && e.TUBARÃO != "" && e.AGUIA != "";
        // });

        return dados
      }
    },
    methods: {
      loadLoteAtual() {
        let urlData = `${config.baseUrl}api/shared/analise_perfil/lote_atual/${this.$store.getters.usuario.produto}`
        this.$api.get(urlData).then(res => {
          this.loteAtual = res.data[0]?.LOTE_PESQ
        })
      },
      loadValidacaoResposta() {
        this.$store.dispatch('loadValidacaoResposta', this.usuarioAlmope)
      },

      saveResponderAgora() {
        if (this.validacaoResposta.RESPONDER_AGORA === 0) {
          let data = {
            almope: this.usuarioAlmope,
            responderAgora: 1,
            loteAtual: this.loteAtual
          }
          this.$store.dispatch('saveAtualizarResponderAgora', data).then(() => {
            this.loadValidacaoResposta()
            this.responderAgora = true
            this.e6 = 1
          })
        } else {
          if (this.validacaoResposta.RESPONDER_AGORA === 1) {
            this.responderAgora = true
            this.e6 = 1
          } else {
            let data = {
              almope: this.usuarioAlmope,
              responderAgora: true,
              loteAtual: this.loteAtual
            }
            this.$store.dispatch('saveResponderAgora', data).then(() => {
              this.loadValidacaoResposta()
              this.responderAgora = true
              this.e6 = 1
            })
          }
        }
      },
      saveResponderDepois() {
        if (this.validacaoResposta.RESPONDER_AGORA === 0) {
          let data = {
            almope: this.usuarioAlmope,
            dataRetorno: this.moment().add(1, 'days').format('YYYY-MM-DD'),
            loteAtual: this.loteAtual
          }
          this.$store.dispatch('saveAtualizarResponderDepois', data).then(() => {
            this.$emit('updated:closeQuestionario', false)
          })
        } else {
          let data = {
            almope: this.usuarioAlmope,
            responderAgora: false,
            dataRetorno: this.moment().add(1, 'days').format('YYYY-MM-DD'),
            loteAtual: this.loteAtual
          }
          this.$store.dispatch('saveResponderDepois', data).then(() => {
            this.$emit('updated:closeQuestionario', false)
          })
        }
      },
      emitMessage() {
        this.$emit('updated:closeQuestionario', false)
        this.resultadoQuestionario = !this.resultadoQuestionario
      },
      formularioIsValid() {
        return (
          this.formularioAnalisePerfil.selectedEuSou != null &&
          this.formularioAnalisePerfil.selectedEuGostoDe != null &&
          this.formularioAnalisePerfil.selectedSedarBemComigo != null &&
          this.formularioAnalisePerfil.selectedBonsResultados != null &&
          this.formularioAnalisePerfil.selectedMeDivirtoQuando != null &&
          this.formularioAnalisePerfil.selectedEuPensoQue != null &&
          this.formularioAnalisePerfil.selectedMinhaPreocupacao != null &&
          this.formularioAnalisePerfil.selectedEuPrefiro != null &&
          this.formularioAnalisePerfil.selectedEuGostoDeN != null &&
          this.formularioAnalisePerfil.selectedEuGostoDeChegar != null &&
          this.formularioAnalisePerfil.selectedOtimoDiaPraMim != null &&
          this.formularioAnalisePerfil.selectedVejoAMorte != null &&
          this.formularioAnalisePerfil.selectedFilosofiaDeVida != null &&
          this.formularioAnalisePerfil.selectedSempreGostei != null &&
          this.formularioAnalisePerfil.selectedGostoDeMudancas != null &&
          this.formularioAnalisePerfil.selectedNadaDeErradoEm != null &&
          this.formularioAnalisePerfil.selectedGostoDeBuscarConselhos != null &&
          this.formularioAnalisePerfil.selectedMeuLema != null &&
          this.formularioAnalisePerfil.selectedEuGostoDeM != null &&
          this.formularioAnalisePerfil.selectedTempoPraMim != null &&
          this.formularioAnalisePerfil.selectedSeFosseBilionario != null &&
          this.formularioAnalisePerfil.selectedAcreditoQue != null &&
          this.formularioAnalisePerfil.selectedAcreditoTambem != null &&
          this.formularioAnalisePerfil.selectedAcreditoAinda != null &&
          this.formularioAnalisePerfil.selectedEuPensoQueN != null
        )
      },
      countItems(arr) {
        const array = Object.create(null)
        for (const elementSelecionado of arr) {
          array[elementSelecionado] = (array[elementSelecionado] || 0) + 1
        }
        return Object.entries(array).map(([value, count]) => ({
          nome: value,
          quantidade: count
        }))
      },
      maiorNumero(values) {
        const maxValue = values.reduce((prev, current) => {
          return prev.quantidade > current.quantidade ? prev : current
        })
        return maxValue
      },
      contagemPerfil() {
        // let i = ["TUBARÃO", "LOBO", "GATO", "TUBARÃO"];
        let respostas = Object.values({ ...this.formularioAnalisePerfil })
        let gabarito = this.countItems(respostas)
        return this.maiorNumero(gabarito)
      },
      escolhaDeTeam() {
        if (this.formularioIsValid() == true) {
          let escolha = this.contagemPerfil()
          if (escolha['nome'] != '') {
            if (escolha['nome'] == 'TUBARÃO') {
              return 'TUBARÃO'
            } else if (escolha['nome'] == 'GATO') {
              return 'GATO'
            } else if (escolha['nome'] == 'AGUIA') {
              return 'AGUIA'
            } else if (escolha['nome'] == 'LOBO') {
              return 'LOBO'
            }
          }
        }
      },

      async enviarQuestionario() {
        let resposta = this.formularioRespondido
        resposta.ALMOPE = this.usuarioAlmope
        resposta.LOTE = this.loteAtual
        await this.$store.dispatch('gravarAnaliseComportamental', resposta).then(() => {
          // this.loadGrupoPerfil();
          this.emitMessage()
        })
      }
    },
    created() {
      this.loadValidacaoResposta()
      this.loadLoteAtual()
    }
  }
</script>

<style></style>
