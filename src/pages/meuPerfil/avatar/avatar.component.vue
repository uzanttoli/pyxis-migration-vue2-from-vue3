<template>
  <v-sheet>
    <v-col>
      <v-card height="296" class="overflow-auto" elevation="0" :disabled="editandoPerfil">
        <v-col>
          <v-btn
            class="ma-1"
            icon
            v-for="(item, i) in nameAvatar"
            :key="i"
            @click="saveAvatarDataAction(item)"
          >
            <v-avatar size="40">
              <img :src="imagemPerfil(item.NOME_AVATAR)" :value="item.NOME_AVATAR" />
            </v-avatar>
          </v-btn>
        </v-col>
      </v-card>
    </v-col>
  </v-sheet>
</template>

<script>
  export default {
    components: {},
    props: {
      editandoPerfil: {
        type: Boolean,
        default: false
      },
      dialogAvatar: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      formAvatar: {
        almope: '',
        avatar: ''
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      myAtavar() {
        let myAvatar = this.$store.getters.myAvatar
        return myAvatar ? myAvatar : []
      },
      nameAvatar() {
        let nameAvatar = this.$store.getters.nameAvatar
        return nameAvatar ? nameAvatar : []
      }
    },
    methods: {
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },
      loadMyAvatar() {
        return this.$store.dispatch('loadMyAvatar', this.usuarioAlmope)
      },
      loadNameAvatar() {
        this.$store.dispatch('loadNameAvatar')
      },
      saveAvatarDataAction(avatar) {
        if (this.myAtavar == '') {
          this.$store
            .dispatch('saveAvatarDataAction', {
              almope: this.$store.getters.usuario.almope,
              avatar: avatar.ID
            })
            .then(() => {
              this.loadMyAvatar()
            })
        } else {
          this.$store
            .dispatch('updateAvatarDataAction', {
              ALMOPE: this.$store.getters.usuario.almope,
              avatar: avatar.ID,
              selectAvatar: 1
            })
            .then(() => {
              this.loadMyAvatar()
            })
        }
      }
    },
    watch: {},
    created() {
      this.loadNameAvatar()
    }
  }
</script>

<style></style>
