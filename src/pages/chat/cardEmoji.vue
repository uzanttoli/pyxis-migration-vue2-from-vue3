<template>
  <v-menu offset-y :close-on-content-click="closeOnContentClick">
    <template v-slot:activator="{ attrs, on }">
      <v-btn fab small elevation="0" v-bind="attrs" v-on="on" :class="btnClass" color="primary">
        <v-icon>fa-solid fa-face-grin-tongue-wink</v-icon>
      </v-btn>
    </template>
    <v-card height="500">
      <div style="display: flex; flex-direction: column; padding: 5px">
        <div class="title pa-2">Emojis</div>
        <!-- <div class="search">
          <input
            disabled
            type="text"
            style="width: 50%; padding: 5px; border: 1px solid grey; border-radius: 5px;"
            placeholder="Pesquisar"
            id="searchEmoji"
          />
        </div> -->
      </div>
      <v-divider></v-divider>
      <v-card height="432" elevation="0" class="overflow-auto">
        <v-card-text>
          <div v-for="(emojisCategory, category) in emojis" :key="category" class="py-1">
            <h3>{{ category }}</h3>
            <div class="emoji-container">
              <span
                class="emoji"
                v-for="(emoji, i) in emojisCategory"
                :key="i"
                @click="$emit('update:emoji', emoji)"
                :title="emoji.significado"
              >
                {{ emoji.emoji }}
              </span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-card>
  </v-menu>
</template>

<script>
  import { emojis } from './emojis.js'

  export default {
    props: {
      openMenu: {
        type: Boolean,
        default: false
      },
      btnClass: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        textFieldValue: '',
        emojis: emojis,
        menuOpen: false,
        closeOnContentClick: false
      }
    },
    computed: {
      returnMenu() {
        return this._openMenu
      },
      listEmojis() {
        return emojis
      },
      listForFilter() {
        let list = this.listEmojis
        let newArray = []
        for (const chave in list) {
          if (Object.prototype.hasOwnProperty.call(list, chave)) {
            newArray.push(...list[chave])
            delete list[chave]
          }
        }
        return newArray
      }
    },
    methods: {
      _openMenu() {
        return this.openMenu
      },
      addEmoji(emoji) {
        this.textFieldValue += emoji
      }
    }
  }
</script>

<style>
  .emoji-container {
    display: flex;
    justify-content: start;
    align-items: center;
    max-width: 350px;
    max-height: 500px;
    flex-wrap: wrap;
    overflow: auto;
  }

  .emoji {
    font-size: 1rem;
    padding: 3px;
    margin: 3px;
    text-shadow: 2px 2px 3px rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  input:disabled {
    background: #fbfbfb;
  }
</style>
