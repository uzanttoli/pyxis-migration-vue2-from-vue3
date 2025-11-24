<template>
  <v-card class="rounded-lg mt-6" elevation="8" height="92vh" v-if="userRouter">
    <div class="header">
      <v-badge
        bordered
        bottom
        :color="userSelected.online_receiver == 1 ? 'green' : 'red'"
        dot
        offset-x="15"
        offset-y="10"
      >
        <v-avatar size="60">
          <img
            loading="lazy"
            class="header-img"
            v-if="userSelected.name_avatar != null"
            :src="
              $route.query.type_chat == 'private'
                ? imagemPerfil(userSelected.name_avatar)
                : imagePefilGroup(userSelected.name_avatar)
            "
            alt=""
          />
          <img v-else class="header-img" src="../../assets/img/Avatar/padrao.png" />
        </v-avatar>
      </v-badge>
      <v-card-title style="width: 100%">
        <span class="my-name">
          {{
            $route.query.type_chat == 'private'
              ? formatadedName(userSelected.name_receiver || arrayUserActive.name_send)
              : isNotUndefined(userSelected.group_name)
              ? userSelected.group_name
              : ''
          }}
        </span>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-if="$route.query.type_chat == 'group'">
          <template v-slot:activator="{ attrs, on }">
            <v-btn v-bind="attrs" v-on="on" icon @click="openDialogMember = true">
              <v-icon color="blue">fa-solid fa-address-book</v-icon>
            </v-btn>
          </template>
          <span>Membros</span>
        </v-tooltip>

        <v-tooltip
          bottom
          v-if="
            $route.query.type_chat == 'group' &&
            (isAdminGroup ? isAdminGroup.permission != 'MEMBER' : false)
          "
        >
          <template v-slot:activator="{ attrs, on }">
            <v-btn v-bind="attrs" v-on="on" icon>
              <v-icon @click="openEditGroup = true" color="orange">fa-solid fa-sliders</v-icon>
            </v-btn>
          </template>
          <span>Configuração</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$route.query.type_chat == 'group'">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on" @click="sairDoGrupo" :disabled="isGoToOut">
              <v-icon color="red">fa-solid fa-arrow-right-from-bracket</v-icon>
            </v-btn>
          </template>
          <span>Sair</span>
        </v-tooltip>
        <v-divider vertical class="mx-3"></v-divider>
        <v-btn icon to="/pyxis/chat/" color="primary">
          <v-icon small>fa-solid fa-xmark</v-icon>
        </v-btn>
      </v-card-title>
    </div>
    <div class="chat-box" ref="chatOverflow" @scroll="handleScroll">
      <notifications position="top right" />
      <div
        style="display: flex; align-items: center; justify-content: center"
        v-if="numberRowsMessages <= messages.length"
      >
        <v-btn x-small rounded color="primary" @click="loadRowsMessages">Carregar mais</v-btn>
      </div>
      <template v-if="notLoadingMessageResponse">
        <span>
          <load-messages-chat></load-messages-chat>
        </span>
      </template>
      <template v-else>
        <span v-for="message in messages" :key="message.id">
          <div
            :id="message.msg_id"
            class="chat outgoing"
            v-if="
              $route.query.type_chat == 'private'
                ? message.almope_send == usuarioAlmope &&
                  message.almope_receiver === $route.params.id
                : message.almope_send == usuarioAlmope
            "
          >
            <div class="details">
              <div
                v-if="
                  (!message.attachment == null || !message.attachment == '') &&
                  message.msg_visible == 1
                "
              >
                <attachment-download
                  :attachment="message.attachment"
                  :nameArquive="message.attachment"
                  arquiveTitle="Você enviou um arquivo!"
                  @click-cancel-arquive="actionButton(message.msg_key, 'messageDeleted')"
                ></attachment-download>
              </div>
              <template v-else>
                <v-menu offset-y open-on-hover transition="slide-x-transition" max-width="100">
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      :class="
                        message.msg_reply_id != '' &&
                        message.msg_reply_id != 0 &&
                        message.msg_visible == 1
                          ? 'container-reply-message primary'
                          : 'outgoing-box primary'
                      "
                      v-bind="attrs"
                      v-on="on"
                      @click="
                        message.msg_visible == 1 &&
                        message.msg_reply_id != '' &&
                        message.msg_reply_id != 0
                          ? scrollToLineMessage(message.msg_reply_id)
                          : ''
                      "
                    >
                      <div
                        :class="
                          message.msg_reply_id != '' && message.msg_reply_id != 0
                            ? 'reply-message'
                            : ''
                        "
                        v-if="message.msg_visible == 1"
                      >
                        <div class="name">
                          <h5>{{ message.name_first_msg }}</h5>
                        </div>
                        <span v-html="message.msg_reply"></span>
                      </div>
                      <p class="primary">
                        <img
                          loading="lazy"
                          @click="openImg(message)"
                          class="image-container-incoming"
                          v-if="message.is_base_64 == 1 && message.msg_visible == 1"
                          :src="message.foto_base_64"
                        />
                        <img
                          loading="lazy"
                          @click="openImg(message)"
                          class="image-container-incoming"
                          v-else-if="
                            (!message.foto_base_64 == '' || !message.foto_base_64 == null) &&
                            message.msg_visible == 1
                          "
                          :src="imageWs(message.foto_base_64)"
                        />
                        <span
                          v-html="
                            message.msg_visible == 1 ? message.msg_text : 'Mensagem foi excluída'
                          "
                        ></span>
                      </p>
                    </div>
                  </template>
                  <v-list dense v-if="message.msg_visible == 1">
                    <v-list-item v-for="(item, i) in listActionBtn" :key="i" v-show="item.status">
                      <template>
                        <v-list-item-title
                          @click="actionButton(message, item.action)"
                          style="cursor: pointer"
                        >
                          {{ item.title }}
                        </v-list-item-title>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
              <span
                style="
                  font-size: 11px;
                  margin-top: 3px;
                  display: flex;
                  align-items: center;
                  justify-content: end;
                "
              >
                <strong>{{ formatedDate(message.date_send) }}</strong>
              </span>
            </div>
          </div>
          <div
            :id="message.msg_id"
            class="chat incoming"
            v-else-if="
              $route.query.type_chat == 'private'
                ? message.almope_send === $route.params.id && message.type !== 'group'
                : message.group_id == $route.params.id
            "
          >
            <img
              loading="lazy"
              class="img-incoming"
              v-if="
                $route.query.type_chat == 'private'
                  ? userSelected.name_avatar != null
                  : message.name_avatar != null
              "
              :src="
                $route.query.type_chat == 'private'
                  ? imagemPerfil(userSelected.name_avatar)
                  : imagemPerfil(message.name_avatar)
              "
              alt=""
            />
            <img
              loading="lazy"
              class="img-incoming"
              v-else
              src="../../assets/img/Avatar/padrao.png"
              alt=""
            />

            <div style="display: flex; flex-direction: column; width: calc(100% - 50px)">
              <div>
                <span class="details-name" :title="`${message.name_send} (${message.almope_send})`">
                  {{ formatadedName(message.name_send) }}
                </span>
              </div>
              <div class="details">
                <div
                  class="mb-4"
                  v-if="
                    (!message.attachment == null || !message.attachment == '') &&
                    message.msg_visible == 1
                  "
                >
                  <attachment-download
                    :attachment="message.attachment"
                    :nameArquive="message.attachment"
                    arquiveTitle="Você recebeu um arquivo!"
                    :isDelete="false"
                  ></attachment-download>
                </div>
                <template v-else>
                  <v-menu
                    offset-y
                    open-on-hover
                    transition="slide-x-transition"
                    max-width="100"
                    top
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <div
                        :class="
                          message.msg_reply_id != '' &&
                          message.msg_reply_id != 0 &&
                          message.msg_visible == 1
                            ? 'container-reply-message-incoming'
                            : 'container-reply-message-incoming-empty'
                        "
                        v-bind="attrs"
                        v-on="on"
                        @click="
                          message.msg_visible == 1 &&
                          message.msg_reply_id != '' &&
                          message.msg_reply_id != 0
                            ? scrollToLineMessage(message.msg_reply_id)
                            : ''
                        "
                      >
                        <div
                          :class="
                            message.msg_reply_id != '' && message.msg_reply_id != 0
                              ? 'reply-message-incoming'
                              : ''
                          "
                          v-if="message.msg_visible == 1"
                        >
                          <div class="name">
                            <h5>{{ message.name_first_msg }}</h5>
                          </div>
                          <span v-html="message.msg_reply"></span>
                        </div>
                        <p
                          :class="
                            message.msg_reply_id != '' &&
                            message.msg_reply_id != 0 &&
                            message.msg_visible == 1
                              ? 'container-incoming-paragraf'
                              : ''
                          "
                        >
                          <img
                            loading="lazy"
                            @click="openImg(message)"
                            class="image-container-incoming"
                            v-if="message.is_base_64 == 1 && message.msg_visible == 1"
                            :src="message.foto_base_64"
                          />
                          <img
                            loading="lazy"
                            @click="openImg(message)"
                            class="image-container-incoming"
                            v-else-if="
                              (!message.foto_base_64 == '' || !message.foto_base_64 == null) &&
                              message.msg_visible == 1
                            "
                            :src="imageWs(message.foto_base_64)"
                          />
                          <span
                            v-html="
                              message.msg_visible == 1 ? message.msg_text : 'Mensagem foi excluída.'
                            "
                          ></span>
                        </p>
                      </div>
                    </template>
                    <v-list dense v-if="message.msg_visible == 1">
                      <v-list-item
                        v-for="(item, i) in listActionBtnIncoming"
                        :key="i"
                        v-show="item.status"
                      >
                        <v-list-item-title
                          @click="actionButton(message, item.action)"
                          style="cursor: pointer"
                        >
                          {{ item.title }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
                <span style="font-size: 11px; margin-top: -12px">
                  <strong>{{ formatedDate(message.date_send) }}</strong>
                </span>
              </div>
            </div>
          </div>
        </span>
      </template>
    </div>
    <div class="image-container" v-if="imageData != null">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <v-btn absolute fab x-small right class="mr-14 mb-4 error" @click="clearDataImg">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn
          absolute
          fab
          x-small
          right
          class="mr-5 mb-4 success"
          @click="validateSendImgServe"
          :disabled="isSendImg"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
      <img :src="imageData" />
    </div>
    <!-- Exibindo arquivo -->

    <div class="arquive-preview" v-if="fileArquive != null">
      <file-attachment
        :nameArquive="nameFileArquive"
        @click-event-send="validateFileArquive"
        @click-event-cancel="clearDataArquive"
      ></file-attachment>
    </div>
    <!--  -->
    <div class="reply" v-if="replyMessage">
      <div>
        <h5 class="mr-3">Responder</h5>
        <button @click="replyMessage = null">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <p v-html="replyMessage.msg_reply" class="primary"></p>
    </div>
    <div style="display: flex; justify-content: center">
      <div style="position: absolute; bottom: 110px">
        <v-tooltip bottom v-if="isScrollingUp">
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              absolute
              color="primary"
              elevation="1"
              @click="scrollToLastMessage"
              x-small
              fab
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-arrow-down-thick</v-icon>
            </v-btn>
          </template>
          <span>Ir pra última mensagem</span>
        </v-tooltip>
      </div>
    </div>
    <div class="input">
      <v-text-field
        ref="inputText"
        :disabled="
          imageData != null ||
          fileArquive != null ||
          ((userSelected.all_sending == 0 || userSelected.all_sending == '0') && isAdminGroup
            ? isAdminGroup.permission == 'MEMBER'
            : false)
        "
        class="mx-3 rounded-xl"
        :placeholder="
          imageData != null || fileArquive != null
            ? 'Envie o arquivo ou cancele para digitar novamente'
            : (userSelected.all_sending == 0 || userSelected.all_sending == '0') &&
              (isAdminGroup ? isAdminGroup.permission == 'MEMBER' : false)
            ? 'Somente administradores podem enviar mensagens'
            : 'Digite uma mensagem...'
        "
        v-model="newMessage.msg_text"
        @keyup.enter="validateSend"
        outlined
        dense
        @click:prepend-inner="handleIconClick"
        @paste="handlePaste"
      ></v-text-field>
      <input
        type="file"
        ref="fileInput"
        accept="image/png, image/jpeg"
        style="display: none"
        @change="sendImage"
      />
      <input type="file" ref="fileInputArquive" style="display: none" @change="onFileChange" />
      <card-emoji btnClass="mb-7 mr-2" @update:emoji="handleEmojiSelect"></card-emoji>
      <v-speed-dial v-model="arquive" direction="top" class="mb-7 mr-5" v-if="filtro != 'OPERADOR'">
        <template v-slot:activator>
          <v-btn v-model="arquive" fab small elevation="0" color="primary">
            <v-icon small v-if="arquive">fa-solid fa-xmark</v-icon>
            <v-icon small v-else>fa-solid fa-paperclip</v-icon>
          </v-btn>
        </template>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn fab small v-bind="attrs" v-on="on" disabled color="primary">
              <v-icon color="white">fa-solid fa-music</v-icon>
            </v-btn>
          </template>
          <span>Anexar audio</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn fab small v-bind="attrs" v-on="on" @click="openFileInputArquive" color="primary">
              <v-icon color="white">fa-regular fa-file-excel</v-icon>
            </v-btn>
          </template>
          <span>Anexar um arquivo</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn fab small v-bind="attrs" v-on="on" @click="openFileInput" color="primary">
              <v-icon color="white">fa-regular fa-image</v-icon>
            </v-btn>
          </template>
          <span>Anexar uma imagem</span>
        </v-tooltip>
      </v-speed-dial>
    </div>
    <members-group
      :openDialogMember="openDialogMember"
      @update:close="openDialogMember = !openDialogMember"
    ></members-group>
    <open-dialog-img
      :openImg="openDataImg"
      :dataMessage="dataImg"
      @update-close="openDataImg = !openDataImg"
    ></open-dialog-img>
    <painel-edit-group
      :openEditGroup="openEditGroup"
      @update-close="openEditGroup = !openEditGroup"
      @retornarDadosAtualizados="atualizarDadosPerfil"
      @update:reloadInfo="realodEditGroup"
    ></painel-edit-group>
  </v-card>
  <div class="container-img-not-chat" v-else>
    <div class="content-img-not-chat">
      <img src="../../assets/img/geral/groupDisscussion.png" />
      <p>Fique a vontade para conversar com quem você quiser!</p>
      <!-- <v-alert type="error">
        <p class="ma-0 pa-0">Chat indisponivel. Servidor inoperante...</p>
        <p class="ma-0 pa-0">Estamos trabalhando para restabelecer o chat o quanto antes!</p>
      </v-alert> -->
    </div>
  </div>
</template>

<script>
  import config from '../../core/config'
  import axios from 'axios'
  import notificationSound from '../../assets/notification/notificationSound.mp3'
  import MembersGroup from './membersGroup.vue'
  import alerts from '../../mixins/alerts.mixins'
  import OpenDialogImg from './openDialogImg.vue'
  import FileAttachment from './fileAttachment.vue'
  import AttachmentDownload from './attachmentDownload.vue'
  import painelEditGroup from './painelEditGroup.vue'
  import CardEmoji from './cardEmoji.vue'
  import loadMessagesChat from '../../shared/components/load/loadChat.vue'

  export default {
    props: {
      arrayUserActive: {
        type: [Array, Object],
        require: true
      },
      arrayListUsersRecent: {
        type: [Array, Object],
        require: true
      }
    },
    mixins: [alerts],
    components: {
      MembersGroup,
      OpenDialogImg,
      FileAttachment,
      AttachmentDownload,
      painelEditGroup,
      CardEmoji,
      loadMessagesChat
    },
    data: () => ({
      isLoadingMessages: false,
      isGoToOut: false,
      showEmojiPicker: false,
      openDialogMember: false,
      openEditGroup: false,
      isMessage: false,
      openDataImg: false,
      arquive: false,
      isSendImg: false,
      isSendFile: false,
      isScrollingUp: false,
      nameFileArquive: null,
      typeAlert: null,
      nameFileImg: null,
      fileArquive: null,
      fileImg: null,
      imageData: null,
      textAlert: null,
      typeFilesAttach: null,
      destinatario: null,
      ws: null,
      replyMessage: null,
      isAdminGroup: null,
      notLoadingMessageResponse: null,
      numberRowsMessages: 100,
      userSelected: [],
      typesValid: [],
      dataImg: [],
      messages: [],
      usuarios: [],
      userSearchRouter: [],
      listActionBtn: [
        { title: 'Responder', action: 'messageRespond', status: 1 },
        { title: 'Excluir', action: 'messageDeleted', status: 1 },
        { title: 'Editar', action: 'messageEdit', status: 0 }
      ],
      listActionBtnIncoming: [{ title: 'Responder', action: 'messageRespond', status: 1 }],
      messageDelete: [],
      newMessage: {
        almope_send: '',
        name_send: '',
        msg_text: ''
      }
    }),
    computed: {
      listNotificationMessages() {
        let listNotification = this.$store.getters.listNotificationMessages
        return listNotification ? listNotification : []
      },
      newListNotification() {
        let list = this.listNotificationMessages
        const uniqueArray = []
        const countMap = {}

        list?.forEach(item => {
          const { almope_send } = item
          if (!countMap[almope_send]) {
            countMap[almope_send] = 1
            uniqueArray.push({ ...item, quantidade: 1 })
          } else {
            countMap[almope_send]++
          }
        })

        uniqueArray.forEach(item => {
          item.quantidade = countMap[item.almope_send]
        })

        return uniqueArray
      },
      filtro() {
        return this.$store.getters.usuario.filtro
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      nome() {
        return this.$store.getters.usuario.nome
      },
      sessionId() {
        return this.$store.getters.usuario.sessao_id
      },
      dateNow() {
        let date = new Date()
        let day = date.getDate().toString().length == 1 ? '0' + date.getDate() : date.getDate()
        let month =
          (date.getMonth() + 1).toString().length === 1
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1
        let year = date.getFullYear().toString()

        let hours =
          date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()
        let minutes =
          date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()
        let seconds =
          date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds()
        let milleSeconds =
          date.getMilliseconds().toString() === 1
            ? '0' + date.getMilliseconds()
            : date.getMilliseconds()

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${milleSeconds}`
      },
      userRouter() {
        return this.$route.params.id
      },
      myAvatar() {
        let myAvatar = this.$store.getters.myAvatar
        return myAvatar ? myAvatar : ''
      },
      validUserInListRecent() {
        let listRecent = this.arrayListUsersRecent
        let inChat = this.userRouter

        const existing = listRecent.some(objeto => {
          return objeto.almope_receiver == inChat
        })

        return existing
      }
    },
    mounted() {
      this.initWebSocket()
    },
    beforeUnmount() {
      this.destroyWebSocketConnection()
    },
    methods: {
      sairDoGrupo() {
        this.isGoToOut = true
        let urlData = `${config.baseUrl}api/mysql/chat/group/go_to_out_group/${this.userRouter}/${this.usuarioAlmope}`
        this.$api.get(urlData).then(() => {
          this.toast('Você acabou de sair de um grupo!', 'top-right', false, 3000, 'success')
          setTimeout(() => {
            this.isGoToOut = false
            this.$router.push('/pyxis/chat/')
          }, 1500)
          this.$emit('update:togoout')
        })
      },
      realodEditGroup(e) {
        const atualizarInfoGroup = {
          type: 'updateInfoGroup',
          almope_send: e.almope_send,
          group_id: e.almope_receiver
        }
        this.ws.send(JSON.stringify(atualizarInfoGroup))
      },
      loadIsAdminGroup() {
        let urlData = `${config.baseUrl}api/mysql/chat/group/is_admin_group/${this.userRouter}/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.isAdminGroup = res?.data[0]
        })
      },
      atualizarDadosPerfil() {
        this.loadDataUserRouter()
        this.$emit('loadDataUserRouter')
      },
      scrollToLastMessage() {
        const chatContainer = this.$refs.chatOverflow
        chatContainer.scrollTop = chatContainer.scrollHeight
      },
      handleScroll(event) {
        this.isScrollingUp = event.target.scrollTop < this.lastScrollTop
        this.lastScrollTop = event.target.scrollTop

        const chatOverflow = this.$refs.chatOverflow
        const isAtBottom =
          chatOverflow.scrollTop + chatOverflow.clientHeight === chatOverflow.scrollHeight
        this.isScrollingUp = !isAtBottom
      },
      async scrollToLineMessage(id) {
        let line = document.getElementById(id)
        if (line == null) {
          await this.loadMessages()
          let line = document.getElementById(id)
          const linhas = document.querySelectorAll('.highlighted-line')
          linhas.forEach(linha => {
            linha.classList.remove('highlighted-line')
          })

          line.classList.add('highlighted-line')
          line.scrollIntoView({ behavior: 'smooth' })

          setTimeout(function () {
            line.classList.remove('highlighted-line')
          }, 1500)
        } else {
          const linhas = document.querySelectorAll('.highlighted-line')
          linhas.forEach(linha => {
            linha.classList.remove('highlighted-line')
          })

          line.classList.add('highlighted-line')
          line.scrollIntoView({ behavior: 'smooth' })

          setTimeout(function () {
            line.classList.remove('highlighted-line')
          }, 1500)
        }
      },
      loadRowsMessages() {
        this.numberRowsMessages = this.numberRowsMessages + 20
      },
      typeFileIsValid(type) {
        if (!type) return
        let typeFormated = type.toLowerCase()
        let typesValid = this.typesValid
        let isType = typesValid.filter(item => {
          return item.formart_attachment == typeFormated
        })

        if (isType != '') {
          return true
        } else {
          return false
        }
      },
      dataURLtoFile(dataURL, filename) {
        const arr = dataURL.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      },
      handlePaste(event) {
        const items = event.clipboardData.items
        this.typeFilesAttach = 'IMAGEM'
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item.type.indexOf('image') === 0) {
            const reader = new FileReader()
            reader.onload = e => {
              const dataURL = e.target.result

              const hashName = this.generateHashName()
              const nameKey = this.usuarioAlmope + hashName
              const newName = `${nameKey}.jpg` // Defina o novo nome do arquivo aqui

              const file = this.dataURLtoFile(dataURL, newName)

              const fileExtension = file.type.split('/').pop()
              this.loadTypeFile(this.typeFilesAttach).then(() => {
                let result = this.typeFileIsValid(fileExtension)
                if (result == false) {
                  this.isSendImg = true
                  this.clearDataImg()
                  this.toast('Tipo de arquivo não permitido', 'top-right', false, 3000, 'warning')
                } else {
                  this.imageData = e.target.result
                  this.fileImg = file
                  this.nameFileImg = file.name
                }
              })
            }
            reader.readAsDataURL(item.getAsFile())
          }
        }
      },

      openImg(message) {
        this.openDataImg = true
        this.dataImg = message
      },
      imagePefilGroup(img) {
        if (!img) return
        return `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/get_image_perfil/${img}`
      },
      imageWs(img) {
        if (!img) return
        return `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/get_image/${img}`
      },
      arquivoWs(value) {
        if (!value) return
        return `${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/get_arquivos/${value}`
      },
      openFileInput() {
        this.$refs.fileInput.click()

        this.typeFilesAttach = 'IMAGEM'
        this.loadTypeFile(this.typeFilesAttach)
      },
      openFileInputArquive() {
        this.$refs.fileInputArquive.click()

        this.typeFilesAttach = 'ARQUIVO'
        this.loadTypeFile(this.typeFilesAttach)
      },
      // Arquivo
      onFileChange(event) {
        this.typeFilesAttach = 'ARQUIVO'
        let arquivo = event.target.files[0]
        const fileExtension = arquivo.name.split('.').pop()
        this.loadTypeFile(this.typeFilesAttach).then(() => {
          let result = this.typeFileIsValid(fileExtension)
          if (result == false) {
            this.isSendFile = true
            this.clearDataArquive()
            this.toast('Tipo de arquivo não permitido', 'top-right', false, 3000, 'warning')
          } else {
            this.fileArquive = event.target.files[0]
            this.nameFileArquive = event.target.files[0].name
          }
        })
      },
      validateFileArquive() {
        if (this.$route.query.type_chat == 'private') {
          this.uploadFileArquive()
        } else if (this.$route.query.type_chat == 'group') {
          this.uploadFileArquiveGroup()
        }
      },
      uploadFileArquive() {
        if (this.fileArquive) {
          let key = this.token()
          const formData = new FormData()
          const fileArquiveSplit = this.fileArquive.name.split('.')
          const nameArquiveOriginal = fileArquiveSplit[0]
          const nameUri = nameArquiveOriginal.replaceAll(' ', '_')
          const hashName = this.generateHashName()
          const newFileName = nameUri + '-' + this.usuarioAlmope + hashName

          const fileExtension = this.fileArquive.name.split('.').pop()

          const renamedFile = new File([this.fileArquive], `${newFileName}.${fileExtension}`, {
            type: this.fileArquive.type
          })

          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            almope_receiver: this.$route.params.id,
            name_receiver: this.userSelected.NOME_PARA,
            msg_text: this.newMessage.msg_text,
            foto_base_64: this.imageData,
            foto_base_64_db: this.nameFileImg,
            attachment: renamedFile.name, //nome arquivo
            is_base_64: 0,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }
          this.$emit('update:change-tab')
          this.$api
            .post('api/mysql/chat/messages/send_messages', message)
            .then(() => {
              if (this.validUserInListRecent) {
                return
              } else {
                this.loadListUsersRecent()
              }
            })
            .catch(error => {
              console.error(error)
              // Lide com erros, se necessário
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''

          formData.append('arquivo', renamedFile)
          axios
            .post(`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/upload_arquivos`, formData)
            .then(() => {
              this.clearDataArquive()
            })
            .catch(error => {
              this.clearDataArquive()
              console.error('Erro ao enviar o arquivo', error)
            })
        }
      },
      uploadFileArquiveGroup() {
        if (this.fileArquive) {
          let key = this.token()
          const formData = new FormData()
          const fileArquiveSplit = this.fileArquive.name.split('.')
          const nameArquiveOriginal = fileArquiveSplit[0]
          const nameUri = nameArquiveOriginal.replaceAll(' ', '_')
          const hashName = this.generateHashName()
          const newFileName = nameUri + '-' + this.usuarioAlmope + hashName

          const fileExtension = this.fileArquive.name.split('.').pop() // Obtenha a extensão do arquivo original

          // Crie um novo objeto File com o novo nome e a extensão
          const renamedFile = new File([this.fileArquive], `${newFileName}.${fileExtension}`, {
            type: this.fileArquive.type
          })

          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            group_id: this.$route.params.id,
            name_avatar: this.myAvatar,
            msg_text: this.newMessage.msg_text,
            foto_base_64: this.imageData,
            foto_base_64_db: this.nameFileImg,
            attachment: renamedFile.name, //nome arquivo
            is_base_64: 0,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }
          // this.$emit("update:change-tab");
          this.$api
            .post('api/mysql/chat/messages/send_messages_group', message)
            .then(() => {})
            .catch(error => {
              console.error(error)
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''

          formData.append('arquivo', renamedFile)
          axios
            .post(`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/upload_arquivos`, formData)
            .then(() => {
              this.clearDataArquive()
            })
            .catch(error => {
              this.clearDataArquive()
              console.error('Erro ao enviar o arquivo', error)
            })
        }
      },
      focosLine() {
        if (this.messages.length > 0) {
          this.$nextTick(() => {
            this.$refs.chatOverflow
              ? (this.$refs.chatOverflow.scrollTop = this.$refs.chatOverflow?.scrollHeight)
              : ''
          })
        }
      },
      generateHashName() {
        const date = new Date()
        return date.getTime().toString()
      },
      sendImage(event) {
        this.typeFilesAttach = 'IMAGEM'
        let arquivo = event.target.files[0]
        const fileExtension = arquivo.name.split('.').pop()

        this.loadTypeFile(this.typeFilesAttach).then(() => {
          let result = this.typeFileIsValid(fileExtension)
          if (result == false) {
            this.isSendImg = true
            this.clearDataImg()
            this.toast('Tipo de arquivo não permitido', 'top-right', false, 3000, 'warning')
          } else {
            const file = event.target.files[0]
            const hashName = this.generateHashName()
            const nameKey = this.usuarioAlmope + hashName
            const newName = `${nameKey}.jpg`

            const renamedFile = new File([file], newName, { type: file.type })
            this.fileImg = renamedFile
            this.nameFileImg = renamedFile.name
            if (renamedFile) {
              var reader = new FileReader()
              reader.onload = e => {
                this.imageData = e.target.result
              }
              reader.readAsDataURL(renamedFile)
            }
          }
        })
      },
      validateSendImgServe() {
        if (this.$route.query.type_chat == 'private') {
          this.sendImageServe()
        } else if (this.$route.query.type_chat == 'group') {
          this.sendImageServeGroup()
        }
      },
      sendImageServe() {
        let key = this.token()
        if (this.imageData != '' || this.imageData != null) {
          this.isSendImg = true
          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            almope_receiver: this.$route.params.id,
            name_receiver: this.userSelected.NOME_PARA,
            msg_text: this.newMessage.msg_text,
            foto_base_64: this.imageData,
            foto_base_64_db: this.nameFileImg,
            attachment: '', //nome arquivo
            is_base_64: 1,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }
          this.$emit('update:change-tab')
          this.$api
            .post('api/mysql/chat/messages/send_messages', message)
            .then(() => {
              if (this.validUserInListRecent) {
                return
              } else {
                this.loadListUsersRecent()
              }
            })
            .catch(error => {
              console.error(error)
              // Lide com erros, se necessário
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''

          // Envio da imagem para o servidor
          const formData = new FormData()
          formData.append('image', this.fileImg)
          axios
            .post(`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/upload_imagem`, formData, {
              headers: {
                'Content-Type': false
              }
            })
            .then(() => {
              this.clearDataImg()
              this.isSendImg = false

              const novoInput = document.createElement('input')
              novoInput.type = 'file'
              novoInput.style.display = 'none'
              novoInput.addEventListener('change', this.sendImage)
              this.$refs.fileInput.parentNode.replaceChild(novoInput, this.$refs.fileInput)
              this.$refs.fileInput = novoInput
            })
            .catch(error => {
              console.error(error)
              this.clearDataImg()
              this.isSendImg = false
            })
        }
      },
      sendImageServeGroup() {
        let key = this.token()
        if (this.imageData != '' || this.imageData != null) {
          this.isSendImg = true
          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            group_id: this.$route.params.id,
            name_avatar: this.myAvatar,
            msg_text: this.newMessage.msg_text,
            foto_base_64: this.imageData,
            foto_base_64_db: this.nameFileImg,
            attachment: '', //nome arquivo
            is_base_64: 1,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }
          // this.$emit("update:change-tab");
          this.$api
            .post('api/mysql/chat/messages/send_messages_group', message)
            .then(() => {})
            .catch(error => {
              console.error(error)
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''

          const formData = new FormData()
          formData.append('image', this.fileImg)
          axios
            .post(`${process.env.VUE_APP_PYXIS_API_CHAT}/arquivos/upload_imagem`, formData, {
              headers: {
                'Content-Type': false
              }
            })
            .then(() => {
              this.clearDataImg()
              this.isSendImg = false

              const novoInput = document.createElement('input')
              novoInput.type = 'file'
              novoInput.style.display = 'none'
              novoInput.addEventListener('change', this.sendImage)
              this.$refs.fileInput.parentNode.replaceChild(novoInput, this.$refs.fileInput)
              this.$refs.fileInput = novoInput
            })
            .catch(error => {
              console.error(error)
              this.clearDataImg()
              this.isSendImg = false
            })
        }
      },
      formatedDate(date) {
        if (!date) return
        // Rever
        let date1 = date.split(' ')
        let data = date1[0].split('-').reverse().join('/')
        return data + ',' + date1[1].slice(0, 5)
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      },
      updateVisualized() {
        if (this.userRouter && this.usuarioAlmope) {
          let urlData = `${config.baseUrl}api/mysql/chat/messages/update_messages_read/${this.usuarioAlmope}/${this.userRouter}`
          this.$api
            .get(urlData)
            .then(() => {
              this.$store.dispatch('loadListNotificationMessages', this.usuarioAlmope).then(() => {
                this.insertCountNotification()
              })
            })
            .catch(e => {
              console.error(e)
            })
        }
      },
      insertCountNotification() {
        this.$store.dispatch('insertCountNotification', this.newListNotification.length)
      },
      async actionButton(message, action) {
        const messageAction = {
          type: action,
          msg_key: message.msg_key,
          almope_send: this.newMessage.almope_send,
          name_send: this.newMessage.name_send,
          almope_receiver: this.$route.params.id,
          date_send: this.dateNow
        }
        if (action == 'messageDeleted') {
          this.ws.send(JSON.stringify(messageAction))
          this.deleteMessage(messageAction.msg_key)
          setTimeout(() => {
            this.loadMessages()
          }, 1000)
        } else if (action == 'messageRespond') {
          this.$refs.inputText.focus()
          if (message.foto_base_64 == '' || message.foto_base_64 == null) {
            await this.loadMessages('messageRes')
            let key = message.msg_key

            // Quando o id nao é conhecido ainda pelo front p/ mensagens recentes
            let resultFilter = this.messages.filter(item => {
              return item.msg_key == key
            })
            let id = resultFilter[0].msg_id

            let reply = {
              msg_reply_id: message.msg_id ? message.msg_id : id,
              msg_reply: message.msg_text,
              name_first_msg: message.name_send,
              almope_first_msg: message.almope_receiver
            }

            this.replyMessage = reply
            this.notLoadingMessageResponse = null
          } else {
            this.toast('Não é possivel responder imagens!', 'top', false, 3000, 'warning')
            this.notLoadingMessageResponse = null
          }
        }
      },
      audio() {
        new Notification('Título da Notificação', {
          body: 'Conteúdo da notificação'
        })

        if (Notification.permission !== 'granted') {
          Notification.requestPermission()
        }
        const audio = new Audio(notificationSound)
        audio.play()
      },
      loadDataUserRouter() {
        if (this.$route.query.type_chat == 'private' || this.$route.query.type_chat == 'group') {
          this.$emit('update:load-data-user')
          let urlData = `${config.baseUrl}api/mysql/chat/contact/users/${this.userRouter}/${this.usuarioAlmope}/${this.$route.query.type_chat}`
          this.$api.get(urlData).then(result => {
            this.userSearchRouter = result.data[0]
          })
        }
      },
      handleEmojiSelect(emoji) {
        this.newMessage.msg_text += emoji.emoji
      },
      handleIconClick() {
        this.showEmojiPicker = !this.showEmojiPicker
      },
      scrollToLineBottom() {
        let messages = this.messages
        let ultLine = messages[messages.length - 1]
        let line = ultLine?.msg_id
        let lineScroll = null
        while (!lineScroll) {
          lineScroll = document.getElementById(line)
        }
        lineScroll.scrollIntoView({ behavior: 'smooth' })
      },
      async loadMessages(action = '') {
        if (this.userRouter == this.usuarioAlmope) {
          return this.$router.push('/pyxis/chat/')
        } else {
          try {
            // this.messages = [];
            action == 'messageRes'
              ? (this.notLoadingMessageResponse = false)
              : (this.notLoadingMessageResponse = true)
            let urlData = `${config.baseUrl}api/mysql/chat/messages/list_messages/${this.usuarioAlmope}/${this.userRouter}/${this.$route.query.type_chat}/${this.numberRowsMessages}`
            var result = await this.$api.get(urlData)
            let messages = result.data
            this.messages = messages
            this.notLoadingMessageResponse = false
          } catch (e) {
            this.$notify({
              title: 'Acesso negado!',
              text: 'Você não possui acesso a este grupo...',
              type: 'error',
              duration: 5000 // Tempo padrao em milissegundos (3 segundos)
            })
            this.notLoadingMessageResponse = false
            this.$router.push('/pyxis/chat/')
          }
        }
      },
      async loadMessagesComplete() {
        this.$emit('update:load-message', true)
        await this.loadMessages().then(() => {
          this.$emit('update:load-message', false)
        })
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      formatadedName(name) {
        if (!name) return

        // Divide o nome em palavras separadas por espaços
        const words = name.toLowerCase().split(' ')

        // Capitaliza a primeira letra de cada palavra
        const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1))

        // Junta as palavras formatadas com espaços
        const formattedName = capitalizedWords.join(' ')

        return formattedName
      },
      destroyWebSocketConnection() {
        // Encerrar a conexão WebSocket
        if (this.ws) {
          this.ws.close()
          this.ws = null // Limpar a variável de instância
        }
      },
      initWebSocket() {
        this.ws = new WebSocket(`ws://10.49.21.250:8080?${this.sessionId}/${this.usuarioAlmope}`)
        // this.ws = new WebSocket(
        //   `ws://se0001et0612:8080?${this.sessionId}/${this.usuarioAlmope}`
        // );

        // Abertura de conexao com ws
        this.ws.onopen = () => {
          this.toast('Você está online!', 'top-right', false, 3000, 'success')
        }

        // Canal onde passa todas as mensagens
        this.ws.onmessage = event => {
          let myAlmope = JSON.parse(event.data).almope_receiver
          let almopeSend = JSON.parse(event.data).almope_send
          let name_send = JSON.parse(event.data).name_send
          let messageType = JSON.parse(event.data).type_delete
          let keyMessage = JSON.parse(event.data).msg_key
          let group_id = JSON.parse(event.data).group_id
          let type = JSON.parse(event.data).type
          // let almope_first_msg = JSON.parse(event.data).almope_first_msg;

          let groupInvalid = group_id == undefined || group_id == null || group_id == ''

          if (messageType == 'messageDeleted' && myAlmope == this.usuarioAlmope) {
            this.deleteMessage(keyMessage)
          } else if (type == 'updateInfoGroup' && myAlmope == this.usuarioAlmope) {
            if (this.$route.query.type_chat == 'group' && group_id == this.userRouter) {
              this.loadDataUserRouter()
              this.$emit('update:infoGroup')
            }
          } else {
            const message = JSON.parse(event.data)

            this.userRouter ? this.messages.push(message) : ''
            // Atualiza a visualização quando o usuario estiver na conversa e recebe uma msg
            if (almopeSend == this.userRouter) {
              setTimeout(() => {
                this.updateVisualized()
              }, 1500)
            }

            // Validação se o usuario da pesquisa ou da conversa presente ja esta na lista de recente
            if (myAlmope == this.usuarioAlmope && this.userRouter == null) {
              if (type == 'private') {
                this.audio()
                let title = `${this.formatadedName(name_send)} enviou uma mensagem.`
                document.title = `Nova mensagem de ${this.formatadedName(name_send)}...`
                // Atualiza lista de usuarios assim que ele recebe alguma mensagem
                this.$emit('update:received-message', { title })
              } else {
                this.audio()
                let title = `${this.formatadedName(name_send)} enviou uma mensagem de grupo.`
                document.title = `Nova mensagem de ${this.formatadedName(name_send)}...`
                // Atualiza lista de usuarios assim que ele recebe alguma mensagem
                this.$emit('update:received-message', { title })
              }
            } else if (myAlmope == this.usuarioAlmope) {
              this.audio()

              document.title = `Nova mensagem de ${this.formatadedName(name_send)}...`
              // Atualiza lista de usuarios assim que ele recebe alguma mensagem

              if (almopeSend == this.userRouter) {
                this.focosLine()
                // return "";
                // Nao há necessidade de notificar - privado
              } else if (almopeSend != this.userRouter && type == 'private') {
                // necessario notificar - privado
                let title = `${this.formatadedName(name_send)} enviou uma mensagem no seu privado.`
                // Atualiza lista de usuarios assim que ele recebe alguma mensagem
                this.$emit('update:received-message', { title })
              }

              // group
              if (groupInvalid) {
                return ''
                // conversa nao é grupo
              } else {
                if (group_id == this.userRouter) {
                  this.focosLine()
                  // return "";
                  // Não há necessidade de notificar - grupo
                } else if (group_id != this.userRouter && type == 'group') {
                  // necessario notificar - grupo
                  let title = `${this.formatadedName(name_send)} enviou uma mensagem de grupo.`
                  // Atualiza lista de usuarios assim que ele recebe alguma mensagem
                  this.$emit('update:received-message', { title })
                }
              }

              if (this.validUserInListRecent) {
                return
              } else {
                this.loadListUsersRecent()
              }
            }
          }
        }

        // Conexao fechada
        this.ws.onclose = () => {
          this.toast('Você foi desconectado!', 'top-right', false, 1000, 'error')

          document.title = `Chat Desconectado`
        }

        // Conexao encerrada por algum erro
        this.ws.onerror = () => {
          this.toast('Você foi desconectado!', 'top-right', false, 1000, 'error')
          document.title = `Chat indisponivel`
        }
      },
      loadListUsersRecent() {
        this.$emit('update:list-users-recent')
      },
      deleteMessage(key) {
        let urlData = `${config.baseUrl}api/mysql/chat/messages/delete_message/${key}`
        this.$api.get(urlData).then(() => {
          this.loadMessages()
        })
      },
      validateSend() {
        if (this.$route.query.type_chat == 'private') {
          this.sendMessage()
        } else if (this.$route.query.type_chat == 'group') {
          this.sendMessageGroup()
        }
      },
      clearDataImg() {
        this.imageData = null
        this.nameFileImg = null
        this.$refs.fileInput.value = null
        this.fileImg = null
        this.isSendImg = false
      },
      clearDataArquive() {
        this.fileArquive = null
        this.nameFileArquive = null
        this.$refs.fileInputArquive.value = null
        this.isSendFile = false
      },
      sendMessageGroup() {
        let key = this.token()

        if (this.newMessage.msg_text != '') {
          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            group_id: this.$route.params.id,
            name_avatar: this.myAvatar,
            msg_text: this.newMessage.msg_text,
            msg_reply_id: this.replyMessage ? this.replyMessage.msg_reply_id : '',
            msg_reply: this.replyMessage ? this.replyMessage.msg_reply : '',
            name_first_msg: this.replyMessage ? this.replyMessage.name_first_msg : '',
            almope_first_msg: this.replyMessage ? this.replyMessage.almope_first_msg : '',
            foto_base_64: this.imageData,
            foto_base_64_db: this.nameFileImg,
            attachment: '', //nome arquivo
            is_base_64: 0,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }
          // this.$emit("update:change-tab");
          this.$api
            .post('api/mysql/chat/messages/send_messages_group', message)
            .then(() => {
              this.focosLine()
            })
            .catch(error => {
              console.error(error)
              // Lide com erros, se necessário
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''
          this.replyMessage = null
        } else {
          this.toast('Digite uma mensagem para continuar...', 'top', false, 5000, 'warning')
        }
      },
      sendMessage() {
        // let typeChat = this.userSelected.type_send;

        let key = this.token()
        if (this.newMessage.msg_text != '') {
          const message = {
            type: this.$route.query.type_chat,
            almope_send: this.newMessage.almope_send,
            name_send: this.newMessage.name_send,
            almope_receiver: this.$route.params.id,
            name_receiver: this.userSelected.NOME_PARA,
            msg_text: this.newMessage.msg_text,
            msg_reply_id: this.replyMessage ? this.replyMessage.msg_reply_id : '',
            msg_reply: this.replyMessage ? this.replyMessage.msg_reply : '',
            name_first_msg: this.replyMessage ? this.replyMessage.name_first_msg : '',
            almope_first_msg: this.replyMessage ? this.replyMessage.almope_first_msg : '',
            foto_base_64: this.imageData,
            foto_base_64_db: this.nameFileImg,
            attachment: '', //nome arquivo
            is_base_64: 0,
            msg_visible: '1',
            msg_read: '0',
            msg_important: '0',
            date_send: this.dateNow,
            msg_key: key
          }
          this.$emit('update:change-tab')
          this.$api
            .post('api/mysql/chat/messages/send_messages', message)
            .then(() => {
              this.focosLine()
              if (this.validUserInListRecent) {
                return
              } else {
                this.loadListUsersRecent()
              }
            })
            .catch(error => {
              console.error(error)
              // Lide com erros, se necessário
            })

          this.ws.send(JSON.stringify(message))
          this.messages.push(message)
          this.newMessage.msg_text = ''
          this.replyMessage = null
        } else {
          this.toast('Digite uma mensagem para continuar...', 'top', false, 5000, 'warning')
        }
      },
      showNotification(title, text, duration = 3000) {
        this.$notify({
          title: title,
          text: text,
          duration: duration // Tempo padrao em milissegundos (3 segundos)
        })
      },
      token() {
        let hash = this.generateHashName()
        let almope = this.usuarioAlmope
        return `${almope}${hash}`
      },
      isNotUndefined(value) {
        if (!value) return

        return value == undefined || value == '' || value == null ? false : true
      },
      async loadTypeFile(type) {
        let urlData = `${config.baseUrl}api/mysql/chat/files/type_valid/${type}`
        var result = await this.$api.get(urlData)
        this.typesValid = result.data
      }
    },
    created() {
      this.newMessage.almope_send = this.usuarioAlmope
      this.newMessage.name_send = this.nome
      // this.loadMessages();
      this.loadDataUserRouter()

      if (this.$route.query.type_chat == 'group') {
        this.loadIsAdminGroup()
      }

      if (this.userRouter) {
        this.updateVisualized()
        this.loadMessagesComplete()
        setTimeout(() => {
          this.scrollToLineBottom()
        }, 2500)
      }
      this.token()
      this.loadMyAvatar()
    },
    watch: {
      imageData() {
        if (this.imageData != null) {
          this.newMessage.msg_text = ''
        }
      },
      fileArquive() {
        if (this.fileArquive != null) {
          this.newMessage.msg_text = ''
        }
      },
      messages() {
        this.$nextTick(() => {
          this.$refs.chatOverflow
            ? (this.$refs.chatOverflow.scrollTop = this.$refs.chatOverflow?.scrollHeight)
            : ''
        })
      },

      numberRowsMessages: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadMessages()
        }
      },
      userRouter() {
        this.userSelected = this.arrayUserActive
        // this.loadMessages();
        if (this.$route.query.type_chat == 'group') {
          this.loadIsAdminGroup()
        }
        this.loadMessagesComplete()
        this.updateVisualized()
        this.loadDataUserRouter()
        if (this.userRouter) {
          setTimeout(() => {
            this.$nextTick(async () => {
              await this.$nextTick() // Aguarda a atualização do DOM
              this.$refs.chatOverflow.scrollTop = this.$refs.chatOverflow.scrollHeight
            })
          }, 1000)
        }
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap"); */

  .header {
    display: flex;
    flex-direction: row;
    padding: 10px 10px 10px 20px;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;
  }
  .header .header-img {
    height: 55px;
    border-radius: 50%;
  }
  .my-name {
    font-family: 'Poppins', sans-serif;
  }

  .chat-area {
    height: 83%;
  }

  .chat-box::-webkit-scrollbar {
    width: 10px; /* width of the entire scrollbar */
  }

  .chat-box::-webkit-scrollbar-track {
    background: rgb(255, 255, 254); /* color of the tracking area */
  }

  .chat-box::-webkit-scrollbar-thumb {
    background-color: rgb(143, 14, 143); /* color of the scroll thumb */
    border-radius: 25px; /* roundness of the scroll thumb */
    border: 3px solid rgb(245, 245, 245); /* creates padding around scroll thumb */
  }
  .chat-box {
    position: relative;
    height: 70vh;
    overflow-y: auto;
    margin: 0 0 0 15px;
    padding: 10px 30px 20px 30px;
    /* width: 100%; */
  }
  .chat-box .text {
    position: absolute;
    top: 45%;
    left: 50%;
    width: calc(100% - 50px);
    text-align: center;
    transform: translate(-50%, -50%);
  }
  .chat-box .chat {
    margin: 15px 0;
  }
  .chat-box .chat p {
    word-wrap: break-word;
    padding: 8px 16px;
    box-shadow: 0 0 32px rgb(0 0 0 / 8%), 0rem 16px 16px -16px rgb(0 0 0 / 10%);
  }
  .chat-box .outgoing {
    display: flex;
  }
  .details {
    display: flex;
    flex-direction: column;
  }

  .details-name {
    font-size: 16px;
    /* width: 70px; */
    color: grey;
    font-weight: 700;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .chat-box .outgoing .details {
    margin-left: auto;
    max-width: calc(100% - 130px);
  }
  .outgoing .details p {
    background: #333;
    color: #fff;
    border-radius: 18px 18px 0 18px;
    margin-bottom: 0px;
  }
  .chat-box .incoming {
    display: flex;
    align-items: flex-end;
  }
  .chat-box .incoming .img-incoming {
    height: 35px;
    width: 35px;
    border-radius: 50%;
  }
  .chat-box .incoming .details {
    margin-right: auto;
    margin-left: 10px;
    max-width: calc(100% - 130px);
  }

  .incoming .details p {
    background: #333;
    color: #fff;
    border-radius: 18px 18px 18px 0;
  }
  .picker {
    position: absolute;
    bottom: 35px;
    left: 7px;
  }

  .input {
    position: absolute;
    width: 100%;
    bottom: -5px;
    display: flex;
    align-items: center;
  }

  .container-img-not-chat {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 92vh;
  }

  .content-img-not-chat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
  }

  .container-img-not-chat .content-img-not-chat img {
    height: 90%;
  }

  .image-preview {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 20px;
    position: absolute;
    bottom: 50px;
    right: 10px;
  }

  img.preview {
    width: 100px;
    background-color: white;
    border: 1px solid #ddd;
    padding: 5px;
    cursor: pointer;
  }

  .arquive-preview {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 20px;
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 50px;
    right: 10px;
    /* min-height: 170px; */
  }

  .arquive-preview-selected {
    width: 350px;
    min-height: 50px;
    background-color: white;
    border: 1px solid #ddd;
    padding: 5px;
    justify-content: center;
    align-items: center;
    display: flex;
    cursor: pointer;
  }

  .ancora_download {
    color: white;
    text-decoration: none;
  }

  .image-container {
    display: flex;
    flex-wrap: wrap;
  }

  .image-container img {
    max-width: 500px;
    max-height: 500px;
    width: auto;
    height: auto;
    object-fit: contain;
    margin: 5px;
    position: absolute;
    bottom: 100px;
    right: 25px;
    background: #333;
    border-radius: 10px;
    padding: 2px;
  }

  .image-container-incoming {
    max-width: 500px;
    max-height: 500px;
    width: auto;
    height: auto;
    object-fit: contain;
    margin: 5px;
    /* position: absolute; */
    bottom: 100px;
    right: 25px;
    /* background: #333; */
    border-radius: 10px;
    padding: 2px;
    cursor: pointer;
  }

  .highlighted-line {
    background-color: rgba(25, 118, 158, 0.099);
    animation: blink 0.5s ease-in-out 3;
  }

  @keyframes blink {
    0% {
      visibility: hidden;
    }
    50% {
      visibility: visible;
    }
  }

  .reply {
    margin: 10px 0px 0 10px;
    background-color: rgba(0, 0, 0, 0.641);
    position: absolute;
    min-width: 60px;
    max-width: 50%;
    padding: 10px;
    border-radius: 10px;
    bottom: 70px;
  }
  .reply p {
    color: white;
    background: #333;
    padding: 5px;
    border-radius: 10px 10px 0 10px;
    font-size: 16px;
  }

  .reply div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .reply button i,
  .reply div h5 {
    color: white;
    font-size: 16px;
    margin: 0 3px 3px 0;
  }

  .container-reply-message {
    padding: 8px;
    border-radius: 12px 12px 0 12px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .reply-message {
    border-left: 2px solid white;
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 2px 5px 2px 6px;
    color: white;
  }

  .container-reply-message h5 {
    color: white;
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .container-reply-message .name {
    max-width: 110px;
  }

  .outgoing-box {
    background: #333;
    color: #fff;
    border-radius: 18px 18px 0 18px;
    margin-bottom: 0px;
  }

  .container-reply-message-incoming {
    padding: 8px;
    border-radius: 12px 12px 12px 0;
    margin-bottom: 14px;
    background-color: #333;
  }

  .reply-message-incoming {
    border-left: 2px solid white;
    display: flex;
    flex-direction: column;
    background-color: rgba(218, 214, 214, 0.2);
    padding: 2px 5px 2px 6px;
    color: white;
  }

  .container-reply-message-incoming h5 {
    color: white;
    font-size: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .container-reply-message-incoming .name {
    max-width: 110px;
  }

  .container-incoming-paragraf {
    margin-bottom: -8px;
  }
</style>
