<template>
  <v-row>
    <notifications position="top right" />
    <v-col xl="2" md="4" lg="4" sm="4">
      <user-list
        @updated:user-select="userSelected"
        @updated:user-repass-selected="userSelected"
        @update:list-array-recent="arrayFromUsersRecent"
        :validateIsReceivedMessage="isReceiveMessage"
        :changeTabRecent="isTab"
        :realoadDataUserGroup="isReloadDataUserRouter"
      ></user-list>
    </v-col>
    <v-col xl="10" md="8" lg="8" sm="8">
      <!-- @update:load-data-user="isLoadUser" -->
      <chat-box
        :arrayUserActive="activeUser"
        @update:received-message="messageReceived"
        @update:load-message="isLoad"
        @update:change-tab="isTabRecent"
        @loadDataUserRouter="reloadDataUserRouter"
        @update:infoGroup="reloadDataUserRouter"
        @update:togoout="reloadDataUserRouter"
        @update:list-users-recent="isReloadListRecentUsers"
        :arrayListUsersRecent="listFromUsers"
      ></chat-box>
    </v-col>
  </v-row>
</template>

<script>
  // const conn = new WebSocket("ws://se0001et0612:8080");
  import userList from './usersList.vue'
  import chatBox from './chatBox.vue'
  export default {
    components: { userList, chatBox },
    data: () => ({
      activeUser: [],
      isReceiveMessage: false,
      carregandoConversa: false,
      isTab: false,
      isReloadDataUserRouter: false,
      reloadRecentUsers: false,
      listFromUsers: []
    }),
    methods: {
      arrayFromUsersRecent(e) {
        this.listFromUsers = e
      },
      isReloadListRecentUsers() {
        this.reloadRecentUsers = true
        setTimeout(() => {
          this.reloadRecentUsers = false
        }, 1000)
      },
      reloadDataUserRouter() {
        this.isReloadDataUserRouter = true
        setTimeout(() => {
          this.isReloadDataUserRouter = false
        }, 1000)
      },
      isTabRecent() {
        this.isTab = true
        setTimeout(() => {
          this.isTab = false
        }, 1000)
      },
      isLoadUser() {
        this.activeUser = []
      },
      isLoad(e) {
        this.carregandoConversa = e
      },
      userSelected(e) {
        let user = e
        this.activeUser = user
      },
      messageReceived(e) {
        this.isReceiveMessage = true
        this.showNotification(e.title, 'Nova notificação!', 5000)
        setTimeout(() => {
          this.isReceiveMessage = false
        }, 2000)
      },
      showNotification(title, text, duration = 3000) {
        this.$notify({
          title: title,
          text: text,
          duration: duration
        })
      }
    }
  }
</script>

<style scoped></style>
