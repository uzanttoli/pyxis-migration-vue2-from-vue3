<template>
  <v-stepper v-model="e1" elevation="0">
    <v-stepper-header>
      <v-stepper-step :complete="e1 > 1" step="1">Dados do Operador</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 2" step="2">Dados da Chamada</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="e1 > 3" step="3">Análise</v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step step="4">Sanção</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <v-form ref="form" v-model="valid">
          <v-card class="mb-12" height="300px">
            <v-row class="mt-3">
              <v-col cols="3" offset="3">
                <v-select
                  height="55"
                  label="Produto"
                  :items="campanhasFeedback"
                  item-value="ID"
                  item-text="DESCRICAO"
                  @change="
                    loadSegmentoCliente(),
                      loadPaperQualitativoFeedback(),
                      loadAreaTransferenciaFeedback()
                  "
                  :rules="[rules.requiredProdutoSelecionado]"
                  v-model="produtoSelecionado"
                  outlined
                ></v-select>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  counter="7"
                  v-mask="masks.almope"
                  label="Almope"
                  @change="loadDadosOperador(), validarAlmope()"
                  required
                  :rules="[
                    () => !!formDadosFeedback.almope || 'O almope é necessário',
                    () =>
                      (!!formDadosFeedback.almope && formDadosFeedback.almope.length == 7) ||
                      'O almope deve possuir 7 caracteres'
                  ]"
                  v-model="formDadosFeedback.almope"
                  placeholder="Insira o almope desejado aqui!"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3" offset="3">
                <v-text-field
                  v-if="dadosOperador != ''"
                  label="Nome"
                  v-model="dadosOperador.NOME"
                  readonly
                  outlined
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-if="dadosOperador != ''"
                  label="Supervisor"
                  v-model="dadosOperador.SUPERIOR1"
                  readonly
                  disabled
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6" offset="3">
                <v-text-field
                  v-if="dadosOperador != ''"
                  label="Regional"
                  v-model="dadosOperador.REGIONAL"
                  readonly
                  disabled
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-form>
        <v-btn color="primary" @click="e1 = 2" :disabled="!this.formIsValidDadosOperador()">
          Continuar
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" height="540px">
          <v-row>
            <v-col cols="4">
              <v-text-field
                label="Número do Caso"
                :rules="[rules.requiredNumCaso]"
                placeholder="Insira número do caso"
                type="number"
                outlined
                v-model="formDadosFeedback.numeroCaso"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="Código da Gravação"
                placeholder="Opcional"
                outlined
                type="number"
                v-model="formDadosFeedback.codigoGravacao"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                label="TMT"
                placeholder="Informe o TMT pratico na ligação"
                outlined
                :rules="[rules.requiredTmt]"
                type="number"
                v-model="formDadosFeedback.tmt"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="4">
              <v-select
                label="Segmento Cliente"
                outlined
                :items="segmentoCliente"
                v-model="formDadosFeedback.segmentoCliente"
                item-value="ID"
                item-text="DESCRICAO"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                label="A ligação foi transferida?"
                outlined
                item-value="ID"
                item-text="DESCRICAO"
                :rules="[rules.requiredLigacaoTransferida]"
                :items="ligacaoTransferida"
                v-model="formDadosFeedback.ligacaoTransferida"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                label="Qual área?"
                :rules="[rules.requiredQualArea]"
                outlined
                no-data-text="Preencha os campos anteriores"
                item-value="ID"
                item-text="DESCRICAO"
                :items="areaTransferenciaFeedback"
                v-model="formDadosFeedback.ligacaoTransferidaArea"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-menu
                v-model="formDadosFeedback.data1"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formDadosFeedback.dataLigacao"
                    label="Data da 1ª Ligação"
                    prepend-icon="mdi-calendar"
                    readonly
                    :rules="[rules.requiredPrimeiraData]"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="br"
                  v-model="formDadosFeedback.dataLigacao"
                  @input="formDadosFeedback.data1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2">
              <!---->
              <v-menu
                ref="menu"
                v-model="formDadosFeedback.menuPrimeiraHora"
                :close-on-content-click="false"
                :nudge-right="40"
                v-model:return-value="formDadosFeedback.horaLigacao"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formDadosFeedback.horaLigacao"
                    label="Hora do 1ª contato"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="formDadosFeedback.menuPrimeiraHora"
                  v-model="formDadosFeedback.horaLigacao"
                  full-width
                  format="24hr"
                  @click:minute="$refs.menu.save(formDadosFeedback.horaLigacao)"
                ></v-time-picker>
              </v-menu>
              <!---->
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                label="Motivo do 1ª contato"
                outlined
                :rules="[rules.requiredMotivoPrimeiroContato]"
                :items="motivoContato"
                item-text="DESCRICAO"
                item-value="ID"
                @change="loadSubMotivoContatoFeedback()"
                v-model="formDadosFeedback.motivoContato"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                label="SubMotivo do 1ª contato"
                outlined
                :rules="[rules.requiredSubMotivoPrimeiroContato]"
                no-data-text="Selecione primeiro o 1ª motivo"
                :items="subMotivoContatoFeedback"
                item-value="ID"
                item-text="DESCRICAO_SUBMOTIVO"
                v-model="formDadosFeedback.submotivoContato"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-menu
                v-model="formDadosFeedback.data2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formDadosFeedback.dataLigacao2"
                    label="Data da 2ª Ligação"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="formDadosFeedback.dataLigacao2"
                  @input="formDadosFeedback.data2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="2">
              <!---->
              <v-menu
                ref="menu2"
                v-model="formDadosFeedback.menuSegundaHora"
                :close-on-content-click="false"
                :nudge-right="40"
                v-model:return-value="formDadosFeedback.horaLigacao2"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="formDadosFeedback.horaLigacao2"
                    label="Hora do 2ª contato"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-time-picker
                  v-if="formDadosFeedback.menuSegundaHora"
                  v-model="formDadosFeedback.horaLigacao2"
                  full-width
                  format="24hr"
                  @click:minute="$refs.menu2.save(formDadosFeedback.horaLigacao2)"
                ></v-time-picker>
              </v-menu>
              <!---->
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                label="Motivo do 2ª contato"
                outlined
                :rules="[rules.requiredMotivoSegundoContato]"
                :items="motivoContato"
                @change="loadSegundoSubMotivoContatoFeedback()"
                item-text="DESCRICAO"
                item-value="ID"
                v-model="formDadosFeedback.motivoLigacao2"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="4">
              <v-select
                label="SubMotivo do 2ª contato"
                outlined
                :rules="[rules.requiredSubMotivoSegundoContato]"
                no-data-text="Selecione primeiro o 2ª motivo"
                item-text="DESCRICAO_SUBMOTIVO"
                item-value="ID"
                :items="segundoSubMotivoContatoFeedback"
                v-model="formDadosFeedback.submotivoLigacao2"
              ></v-select>
            </v-col>
          </v-row>
        </v-card>

        <v-btn color="primary" @click="e1 = 3" :disabled="!this.formIsValidDadosChamada()">
          Continuar
        </v-btn>

        <v-btn text @click="e1 = 1">Voltar</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" height="600px">
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Realizou Script Callback no Inicio da Ligação?"
                outlined
                item-text="DESCRICAO"
                item-value="ID"
                :items="mencionouScriptCallBack"
                :rules="[rules.requiredScriptCallbackInicioLigacao]"
                v-model="formDadosFeedback.scriptCallbackInicio"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Infrator Rechamada"
                outlined
                item-value="ID"
                item-text="DESCRICAO"
                @change="loadSubMotivoInfratorRechamadaFeedback()"
                :items="motivoInfratorRechamadaFeedback"
                :rules="[rules.requiredInfratorRechamada]"
                v-model="formDadosFeedback.infratorRechamada"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Motivo Rechamada"
                outlined
                item-value="ID"
                item-text="DESCRICAO"
                :items="subMotivoInfratorRechamadaFeedback"
                no-data-text="Primeiro selecione o Infrator"
                @change="loadMicroMotivoInfratorRechamadaFeedback()"
                :rules="[rules.requiredMotivoRechamada]"
                v-model="formDadosFeedback.motivoRechamada"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="SubMotivo Rechamada"
                item-value="ID"
                item-text="DESCRICAO"
                :rules="[rules.requiredSubMotivoRechamada]"
                outlined
                :items="microMotivoInfratorRechamadaFeedback"
                v-model="formDadosFeedback.submotivoRechamada"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Problema do Cliente foi Resolvido?"
                outlined
                :items="itemsProblemaClienteResolvido"
                item-text="DESCRICAO"
                item-value="ID"
                :rules="[rules.requiredProblemaClienteResolvido]"
                v-model="formDadosFeedback.problemaClienteResolvido"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Houve queda de Ligação?"
                outlined
                item-text="DESCRICAO"
                item-value="ID"
                :items="itemsHouveQuedaLigacao"
                :rules="[rules.requiredQuedaLigacao]"
                v-model="formDadosFeedback.quedaLigacao"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Realizou Callback?"
                outlined
                :items="itemsRealizouCallback"
                item-text="DESCRICAO"
                item-value="ID"
                :rules="[rules.requiredRealizouCallback]"
                v-model="formDadosFeedback.realizouCallback"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Qualidade da Chamada"
                outlined
                item-text="DESCRICAO"
                item-value="ID"
                :items="qualidadeChamadaFeedback"
                @change="loadInformaCanaisAutoatendimentoFeedback()"
                :rules="[rules.requiredQualidadeChamada]"
                v-model="formDadosFeedback.qualidadeChamada"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Informou canais de AutoAtendimento?"
                outlined
                :items="informaCanaisAutoatendimentoFeedback"
                item-text="DESCRICAO"
                item-value="ID"
                @change="loadCanaisAutoatendimentoFeedback()"
                :rules="[rules.requiredCanaisAutoatendimento]"
                v-model="formDadosFeedback.informouCanais"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Quais Canais?"
                outlined
                @change="loadComportamentoNegativoFeedback()"
                item-text="DESCRICAO"
                :items="canaisAutoatendimentoFeedback"
                :rules="[rules.requiredQuaisCanaisAutoAtendimento]"
                v-model="formDadosFeedback.canaisAtendimento"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Comportamento Negativo"
                outlined
                @change="loadInicioLigacaoSatisfacaoClienteFeedback()"
                item-text="DESCRICAO"
                item-value="ID"
                :items="comportamentoNegativoFeedback"
                :rules="[rules.requiredComportamentoNegativo]"
                v-model="formDadosFeedback.comportamentoNegativo"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="3">
              <v-select
                label="Cliente Iniciou Chamada"
                outlined
                item-value="ID"
                item-text="DESCRICAO"
                @change="loadFinalLigacaoSatisfacaoClienteFeedback()"
                :items="inicioLigacaoSatisfacaoClienteFeedback"
                :rules="[rules.requiredClienteIniciouChamada]"
                v-model="formDadosFeedback.clienteInicioChamada"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="6">
              <v-select
                label="Cliente Finalizou Chamada"
                outlined
                item-value="ID"
                item-text="DESCRICAO"
                :items="finalLigacaoSatisfacaoClienteFeedback"
                :rules="[rules.requiredClienteFinalizouChamada]"
                v-model="formDadosFeedback.clienteFimChamada"
              ></v-select>
            </v-col>
            <v-col class="d-flex" cols="6">
              <v-select
                label="Paper Qualitativo"
                outlined
                @change="loadSancoesFeedback()"
                item-text="DESCRICAO"
                item-value="ID"
                :items="paperQualitativoFeedback"
                :rules="[rules.requiredPaperQualitativo]"
                v-model="formDadosFeedback.paperQualitativo"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                label="Observação"
                placeholder="Descreva aqui seu Feedback"
                auto-grow
                :rules="[rules.requiredObservacaoFeedback]"
                v-model="formDadosFeedback.observacao"
                outlined
                rows="3"
                row-height="30"
                shaped
              ></v-textarea>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>
        </v-card>

        <v-btn color="primary" @click="e1 = 4" :disabled="!this.formIsValidAnalise()">
          Continuar
        </v-btn>

        <v-btn @click="e1 = 2">Voltar</v-btn>
      </v-stepper-content>
      <v-stepper-content step="4">
        <v-card class="mb-12" height="200px">
          <v-row>
            <template>
              <v-col cols="8" offset="2">
                <div>
                  <input
                    accept="
                        audio/mp3, 
                        audio/opus,
                        audio/flac,
                        audio/webm,
                        audio/weba,
                        audio/wav,
                        audio/ogg,
                        audio/m4a,
                        audio/mp3,
                        audio/oga,
                        audio/mid,
                        audio/amr,
                        audio/aiff,
                        audio/wma,
                        audio/au,
                        audio/aac,
                        audio/flac"
                    type="file"
                    id="files"
                    ref="files"
                    v-on:change="handleFilesUpload()"
                  />
                </div>
              </v-col>
            </template>
          </v-row>
          <v-col class="d-flex" cols="8" offset="2">
            <v-select
              label="Selecione o tipo de Sanção"
              outlined
              item-value="ID"
              item-text="DESCRICAO"
              :items="sancoesFeedback"
              :rules="[rules.requiredTipoSancaoFeedback]"
              v-model="formDadosFeedback.sancao"
            ></v-select>
          </v-col>
        </v-card>
        <v-btn
          color="primary"
          @click="saveDataFormFeedbackAction()"
          :disabled="!this.formIsValidSancao()"
        >
          Finalizar
        </v-btn>
        <v-btn text @click="e1 = 3">Voltar</v-btn>
      </v-stepper-content>
    </v-stepper-items>
    <load-envio-dados :envioDados="enviandoDadosFeedback"></load-envio-dados>
    <v-alert type="error" v-model="erroAoEnviar" width="30%" class="ml-3">
      {{ textErroAoEnviar }}
    </v-alert>
    <div class="text-center ma-2">
      <v-snackbar v-model="snackbar">
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-icon color="pink" text v-bind="attrs" @click="snackbar = false">mdi-alert-box</v-icon>
        </template>
      </v-snackbar>
    </div>
  </v-stepper>
</template>

<script>
  import loadEnvioDados from '@/shared/components/load/loadHastag.vue'
  import config from '@/core/config'
  import Masks from '@/shared/masks/masks'
  export default {
    name: 'feedback-component',
    components: {
      loadEnvioDados
    },
    data: () => ({
      snackbar: false,
      text: 'Formatado de arquivo invalido!',
      files: [],
      enviandoDadosFeedback: false,
      erroAoEnviar: false,
      textErroAoEnviar: null,
      e1: 1,
      menu: false,
      menu2: false,
      data1: false,
      data2: false,
      valid: true,
      ligacaoTransferida: [
        { DESCRICAO: 'SIM', ID: 'S' },
        { DESCRICAO: 'NÃO', ID: 'N' }
      ],
      mencionouScriptCallBack: [
        { DESCRICAO: 'SIM', ID: 'S' },
        { DESCRICAO: 'NÃO', ID: 'N' }
      ],
      itemsProblemaClienteResolvido: [
        { DESCRICAO: 'SIM', ID: 'S' },
        { DESCRICAO: 'NÃO', ID: 'N' }
      ],
      itemsHouveQuedaLigacao: [
        { DESCRICAO: 'SIM', ID: 'S' },
        { DESCRICAO: 'NÃO', ID: 'N' }
      ],
      itemsRealizouCallback: [
        { DESCRICAO: 'SIM', ID: 'S' },
        { DESCRICAO: 'NÃO', ID: 'N' }
      ],
      nomeCadastro: null,
      produtoSelecionado: null,

      almopeCadastro: null,
      /** */
      formDadosFeedback: {
        almope: null,
        ipCadastro: null,
        statusFeedback: 1,
        numeroCaso: null,
        segmentoCliente: null,
        tmt: null,
        dataLigacao: null,
        horaLigacao: null,
        motivoContato: null,
        submotivoContato: null,
        dataLigacao2: null,
        horaLigacao2: null,
        motivoLigacao2: null,
        submotivoLigacao2: null,
        infratorRechamada: null,
        motivoRechamada: null,
        submotivoRechamada: null,
        qualidadeChamada: null,
        informouCanais: null,
        canaisAtendimento: null,
        comportamentoNegativo: null,
        clienteInicioChamada: null,
        clienteFimChamada: null,
        sancao: null,
        observacao: null,
        nomeArquivoGravacao: null,
        codigoGravacao: null,
        diretorioArquivoGravacao: null,
        ligacaoTransferida: null,
        ligacaoTransferidaArea: null,
        scriptCallbackInicio: null,
        problemaClienteResolvido: null,
        quedaLigacao: null,
        realizouCallback: null,
        paperQualitativo: null
      },
      formDadosFeedbackDefault: {
        almope: null,
        ipCadastro: null,
        statusFeedback: 1,
        numeroCaso: null,
        segmentoCliente: null,
        tmt: null,
        dataLigacao: null,
        horaLigacao: null,
        motivoContato: null,
        submotivoContato: null,
        dataLigacao2: null,
        horaLigacao2: null,
        motivoLigacao2: null,
        submotivoLigacao2: null,
        infratorRechamada: null,
        motivoRechamada: null,
        submotivoRechamada: null,
        qualidadeChamada: null,
        informouCanais: null,
        canaisAtendimento: null,
        comportamentoNegativo: null,
        clienteInicioChamada: null,
        clienteFimChamada: null,
        sancao: null,
        observacao: null,
        nomeArquivoGravacao: null,
        codigoGravacao: null,
        diretorioArquivoGravacao: null,
        ligacaoTransferida: null,
        ligacaoTransferidaArea: null,
        scriptCallbackInicio: null,
        problemaClienteResolvido: null,
        quedaLigacao: null,
        realizouCallback: null,
        paperQualitativo: null
      },
      rules: {
        requiredGravacaoAnexada: gravacaoAnexada =>
          !!gravacaoAnexada || 'Necessario anexar uma gravação!',
        requiredProdutoSelecionado: produtoSelecionado =>
          !!produtoSelecionado || 'Necessario Preenchimento do campo!',
        requiredAlmope: almope => !!almope || 'Necessário Preenchimento do campo!',
        requiredNumCaso: numeroCaso => !!numeroCaso || 'Necessario Preenchimento do campo!',
        requiredTmt: tmt => !!tmt || 'Necessario Preenchimento do campo!',
        requiredSegmentoCliente: segmentoCliente =>
          !!segmentoCliente || 'Necessario Preenchimento do campo!',
        requiredLigacaoTransferida: ligacaoTransferida =>
          !!ligacaoTransferida || 'Necessaro Preenchimento do campo!',
        requiredQualArea: qualArea => !!qualArea || 'Necessario Preenchimento do campo!',
        requiredPrimeiraData: data1 => !!data1 || 'Necessario Preenchimento da Data!',
        requiredSegundaData: data2 => !!data2 || 'Necessario Preenchimento da Data!',
        requiredHoraPrimeiroContato: menuPrimeiroContato =>
          !!menuPrimeiroContato || 'Necessario Preenchimento da Hora!',
        requiredHoraSegundoContato: menuSegundoContato =>
          !!menuSegundoContato || 'Necessario Preenchimento da Hora!',
        requiredMotivoPrimeiroContato: motivoPrimeiroContato =>
          !!motivoPrimeiroContato || 'Necessario Preenchimento do campo!',
        requiredSubMotivoPrimeiroContato: subMotivoPrimeiroContato =>
          !!subMotivoPrimeiroContato || 'Necessario  Preenchimento do campo!',
        requiredMotivoSegundoContato: motivoSegundoContato =>
          !!motivoSegundoContato || 'Necessario Preenchimento do campo!',
        requiredSubMotivoSegundoContato: subMotivoSegundoContato =>
          !!subMotivoSegundoContato || 'Necessario  Preenchimento do campo!',
        requiredScriptCallbackInicioLigacao: scriptCallbackInicioLigacao =>
          !!scriptCallbackInicioLigacao || 'Necessario Preenchimento do campo!',
        requiredInfratorRechamada: infratorRechamada =>
          !!infratorRechamada || 'Necessario  Preenchimento do campo!',
        requiredMotivoRechamada: motivoRechamada =>
          !!motivoRechamada || 'Necessario Preenchimento do campo!',
        requiredSubMotivoRechamada: subMotivoRechamada =>
          !!subMotivoRechamada || 'Necessario Preenchimento do campo!',
        requiredProblemaClienteResolvido: problemaClienteResolvido =>
          !!problemaClienteResolvido || 'Necessario Preenchimento do campo!',
        requiredQuedaLigacao: quedaLigacao =>
          !!quedaLigacao || 'Necessario Preenchimento do campo!',
        requiredRealizouCallback: realizouCallback =>
          !!realizouCallback || 'Necessario Preenchimento do campo!',
        requiredQualidadeChamada: qualidadeChamada =>
          !!qualidadeChamada || 'Necessario Preenchimento do campo!',
        requiredCanaisAutoatendimento: canaisAutoatendimento =>
          !!canaisAutoatendimento || 'Necessario Preenchimento do campo!',
        requiredQuaisCanaisAutoAtendimento: quaisCanaisAutoAtendimento =>
          !!quaisCanaisAutoAtendimento || 'Necessario Preenchimento do Campo!',
        requiredComportamentoNegativo: comportamentoNegativo =>
          !!comportamentoNegativo || 'Necessario Preenchimento do campo!',
        requiredClienteIniciouChamada: clienteIniciouChamada =>
          !!clienteIniciouChamada || 'Necessario Preenchimento do campo!',
        requiredClienteFinalizouChamada: clienteFinalizouChamada =>
          !!clienteFinalizouChamada || 'Necessario Preenchimento do campo!',
        requiredPaperQualitativo: paperQualitativo =>
          !!paperQualitativo || 'Necessario Preenchimento do campo!',
        requiredObservacaoFeedback: observacaoFeedback =>
          !!observacaoFeedback || 'Necessario Preenchimento  do campo!',
        requiredTipoSancaoFeedback: tipoSancaoFeedback =>
          !!tipoSancaoFeedback || 'Necessario Preenchimento do campo!'
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      campanhasFeedback() {
        return this.$store.getters.campanhasFeedback
      },
      areaTransferenciaFeedback() {
        return this.$store.getters.areaTransferenciaFeedback
      },
      dadosOperador() {
        let dadosOperador = this.$store.getters.dadosOperador[0]
        return dadosOperador ? dadosOperador : []
      },
      segmentoCliente() {
        return this.$store.getters.segmentoCliente
      },
      motivoContato() {
        return this.$store.getters.motivoContato
      },
      subMotivoContatoFeedback() {
        return this.$store.getters.subMotivoContatoFeedback
      },
      segundoSubMotivoContatoFeedback() {
        return this.$store.getters.segundoSubMotivoContatoFeedback
      },
      motivoInfratorRechamadaFeedback() {
        return this.$store.getters.motivoInfratorRechamadaFeedback
      },
      subMotivoInfratorRechamadaFeedback() {
        return this.$store.getters.subMotivoInfratorRechamadaFeedback
      },
      microMotivoInfratorRechamadaFeedback() {
        return this.$store.getters.microMotivoInfratorRechamadaFeedback
      },
      paperQualitativoFeedback() {
        return this.$store.getters.paperQualitativoFeedback
      },
      qualidadeChamadaFeedback() {
        return this.$store.getters.qualidadeChamadaFeedback
      },
      canaisAutoatendimentoFeedback() {
        return this.$store.getters.canaisAutoatendimentoFeedback
      },
      informaCanaisAutoatendimentoFeedback() {
        return this.$store.getters.informaCanaisAutoatendimentoFeedback
      },
      comportamentoNegativoFeedback() {
        return this.$store.getters.comportamentoNegativoFeedback
      },
      inicioLigacaoSatisfacaoClienteFeedback() {
        return this.$store.getters.inicioLigacaoSatisfacaoClienteFeedback
      },
      finalLigacaoSatisfacaoClienteFeedback() {
        return this.$store.getters.finalLigacaoSatisfacaoClienteFeedback
      },
      sancoesFeedback() {
        return this.$store.getters.sancoesFeedback
      },
      masks() {
        return Masks
      },
      nomeUser() {
        let nome = this.$store.getters.usuario.nome
        let nomeF = nome.split(' ')
        return nomeF[0]
      }
    },
    methods: {
      submitFiles() {
        let formData = new FormData()

        for (let file of this.$refs.files.files) {
          formData.append('files', file)
        }
        let urlData = `${config.baseUrl}api/upload/recebe_upload/upload`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api
          .post(urlData, formData, {
            headers: {
              'Content-Type': false
              // cache: false,
            }
          })
          .then(function () {})
          .catch(function () {})
      },
      nameFiles() {
        let name = this.$refs.files.files
        return name[0].name
      },
      handleFilesUpload() {
        let uploadedFiles = this.$refs.files.files
        if (
          uploadedFiles[0].type == 'audio/mp3' ||
          uploadedFiles[0].type == 'audio/opus' ||
          uploadedFiles[0].type == 'audio/flac' ||
          uploadedFiles[0].type == 'audio/webm' ||
          uploadedFiles[0].type == 'audio/weba' ||
          uploadedFiles[0].type == 'audio/wav' ||
          uploadedFiles[0].type == 'audio/ogg' ||
          uploadedFiles[0].type == 'audio/m4a' ||
          uploadedFiles[0].type == 'audio/mp3' ||
          uploadedFiles[0].type == 'audio/oga' ||
          uploadedFiles[0].type == 'audio/mid' ||
          uploadedFiles[0].type == 'audio/amr' ||
          uploadedFiles[0].type == 'audio/aiff' ||
          uploadedFiles[0].type == 'audio/wma' ||
          uploadedFiles[0].type == 'audio/au' ||
          uploadedFiles[0].type == 'audio/aac' ||
          uploadedFiles[0].type == 'audio/flac'
        ) {
          for (var i = 0; i < uploadedFiles.length; i++) {
            this.files.push(uploadedFiles)
          }
        } else {
          this.snackbar = true
        }
      },

      resetValidation() {
        this.$refs.form.resetValidation()
      },
      clearDataForm() {
        Object.assign(this.formDadosFeedback, this.formDadosFeedbackDefault)
      },
      quebraDeLinhas(value) {
        if (!value) return
        if (value.match(/(\r\n|\n|\r)/gm)) {
          return true
        } else {
          return false
        }
      },
      saveDataFormFeedbackAction() {
        try {
          let uploadedFiles = this.$refs.files.files
          if (
            uploadedFiles[0].type == 'audio/mp3' ||
            uploadedFiles[0].type == 'audio/opus' ||
            uploadedFiles[0].type == 'audio/flac' ||
            uploadedFiles[0].type == 'audio/webm' ||
            uploadedFiles[0].type == 'audio/weba' ||
            uploadedFiles[0].type == 'audio/wav' ||
            uploadedFiles[0].type == 'audio/ogg' ||
            uploadedFiles[0].type == 'audio/m4a' ||
            uploadedFiles[0].type == 'audio/mp3' ||
            uploadedFiles[0].type == 'audio/oga' ||
            uploadedFiles[0].type == 'audio/mid' ||
            uploadedFiles[0].type == 'audio/amr' ||
            uploadedFiles[0].type == 'audio/aiff' ||
            uploadedFiles[0].type == 'audio/wma' ||
            uploadedFiles[0].type == 'audio/au' ||
            uploadedFiles[0].type == 'audio/aac' ||
            uploadedFiles[0].type == 'audio/flac'
          ) {
            this.formDadosFeedback.nomeArquivoGravacao = this.nameFiles()
            if (this.quebraDeLinhas(this.formDadosFeedback.observacao) === true) {
              this.formDadosFeedback.observacao = this.formDadosFeedback.observacao.replaceAll(
                '\n',
                ' '
              )
              this.formDadosFeedback.almopeCadastro = this.$store.getters.usuario.almope
              this.$store
                .dispatch('saveDataFormFeedbackAction', this.formDadosFeedback)
                .then(() => {
                  this.enviandoDadosFeedback = true
                  this.submitFiles()
                  setTimeout(() => {
                    this.enviandoDadosFeedback = false
                    this.clearDataForm()
                    this.loadDadosOperador()
                    this.resetValidation()
                    this.e1 = 1
                  }, 4500)
                })
                .catch(e => {
                  alert('Não foi possivel enviar' + e)
                })
            } else {
              this.formDadosFeedback.almopeCadastro = this.$store.getters.usuario.almope
              this.$store
                .dispatch('saveDataFormFeedbackAction', this.formDadosFeedback)
                .then(() => {
                  this.submitFiles()
                  this.enviandoDadosFeedback = true
                  setTimeout(() => {
                    this.enviandoDadosFeedback = false
                    this.clearDataForm()
                    this.loadDadosOperador()
                    this.resetValidation()
                    this.e1 = 1
                  }, 4500)
                })
                .catch(e => {
                  alert('Não foi possivel enviar' + e)
                })
            }
          } else {
            this.snackbar = true
            this.text =
              'Não foi possivel enviar o arquivo! Favor verifique o formato e tente novamente'
          }
        } catch (e) {
          this.textErroAoEnviar = 'Não foi possivel enviar: ' + e
          this.erroAoEnviar = true
          setTimeout(() => {
            this.erroAoEnviar = false
            return
          }, 3500)
        }
      },

      validarAlmope() {
        let almope = this.formDadosFeedback.almope
        if (almope.length < 7) this.formDadosFeedback.almope = ''
      },
      loadDadosOperador() {
        this.enviandoDadosFeedback = true
        return this.$store.dispatch('loadDadosOperador', this.formDadosFeedback.almope).then(() => {
          this.enviandoDadosFeedback = false
        })
      },
      loadCampanhasFeedback() {
        return this.$store.dispatch('loadCampanhasFeedback')
      },
      loadMotivoInfratorRechamadaFeedback() {
        return this.$store.dispatch('loadMotivoInfratorRechamadaFeedback')
      },
      loadQualidadeChamadaFeedback() {
        return this.$store.dispatch('loadQualidadeChamadaFeedback')
      },
      loadSubMotivoInfratorRechamadaFeedback() {
        return this.$store.dispatch(
          'loadSubMotivoInfratorRechamadaFeedback',
          this.formDadosFeedback.infratorRechamada
        )
      },
      loadComportamentoNegativoFeedback() {
        return this.$store.dispatch('loadComportamentoNegativoFeedback')
      },
      loadInicioLigacaoSatisfacaoClienteFeedback() {
        return this.$store.dispatch('loadInicioLigacaoSatisfacaoClienteFeedback')
      },
      loadFinalLigacaoSatisfacaoClienteFeedback() {
        return this.$store.dispatch('loadFinalLigacaoSatisfacaoClienteFeedback')
      },
      loadMicroMotivoInfratorRechamadaFeedback() {
        return this.$store.dispatch(
          'loadMicroMotivoInfratorRechamadaFeedback',
          this.formDadosFeedback.motivoRechamada
        )
      },
      loadSancoesFeedback() {
        return this.$store.dispatch('loadSancoesFeedback')
      },
      loadPaperQualitativoFeedback() {
        return this.$store.dispatch('loadPaperQualitativoFeedback', this.produtoSelecionado)
      },
      loadSegmentoCliente() {
        return this.$store.dispatch('loadSegmentoCliente', this.produtoSelecionado)
      },
      loadCanaisAutoatendimentoFeedback() {
        return this.$store.dispatch('loadCanaisAutoatendimentoFeedback')
      },
      loadInformaCanaisAutoatendimentoFeedback() {
        return this.$store.dispatch('loadInformaCanaisAutoatendimentoFeedback')
      },
      loadAreaTransferenciaFeedback() {
        return this.$store.dispatch('loadAreaTransferenciaFeedback', this.produtoSelecionado)
      },
      loadMotivoContato() {
        return this.$store.dispatch('loadMotivoContato')
      },
      loadSubMotivoContatoFeedback() {
        return this.$store.dispatch(
          'loadSubMotivoContatoFeedback',
          this.formDadosFeedback.motivoContato
        )
      },
      loadSegundoSubMotivoContatoFeedback() {
        return this.$store.dispatch(
          'loadSegundoSubMotivoContatoFeedback',
          this.formDadosFeedback.motivoLigacao2
        )
      },
      formIsValidDadosOperador() {
        return this.formDadosFeedback.almope && this.produtoSelecionado && this.dadosOperador != ''
      },
      formIsValidDadosChamada() {
        return (
          this.formDadosFeedback.numeroCaso &&
          this.formDadosFeedback.tmt &&
          this.formDadosFeedback.segmentoCliente &&
          this.formDadosFeedback.ligacaoTransferida &&
          this.formDadosFeedback.ligacaoTransferidaArea &&
          this.formDadosFeedback.motivoContato &&
          this.formDadosFeedback.submotivoContato &&
          this.formDadosFeedback.motivoLigacao2 &&
          this.formDadosFeedback.submotivoLigacao2 &&
          // this.formDadosFeedback.gravacaoAnexada &&
          this.formDadosFeedback.dataLigacao &&
          this.formDadosFeedback.horaLigacao &&
          this.formDadosFeedback.horaLigacao2
        )
      },
      formIsValidAnalise() {
        return (
          this.formDadosFeedback.scriptCallbackInicio &&
          this.formDadosFeedback.infratorRechamada &&
          this.formDadosFeedback.motivoRechamada &&
          this.formDadosFeedback.submotivoRechamada &&
          this.formDadosFeedback.problemaClienteResolvido &&
          this.formDadosFeedback.quedaLigacao &&
          this.formDadosFeedback.realizouCallback &&
          this.formDadosFeedback.qualidadeChamada &&
          this.formDadosFeedback.informouCanais &&
          this.formDadosFeedback.canaisAtendimento &&
          this.formDadosFeedback.comportamentoNegativo &&
          this.formDadosFeedback.clienteInicioChamada &&
          this.formDadosFeedback.clienteFimChamada &&
          this.formDadosFeedback.paperQualitativo &&
          this.formDadosFeedback.observacao
        )
      },
      formIsValidSancao() {
        return this.formDadosFeedback.sancao
      }
    },
    watch: {},
    created() {
      this.loadMotivoContato()
      this.loadCampanhasFeedback()
      this.loadMotivoInfratorRechamadaFeedback()
      this.loadQualidadeChamadaFeedback()
    }
  }
</script>

<style scoped>
  .v-application v-input {
    display: none;
  }
</style>
