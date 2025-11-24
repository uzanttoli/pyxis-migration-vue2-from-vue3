<template>
  <v-col>
    <v-btn class="button" color="success" @click="$emit('sendFormData')" :disabled="validateForm">
      <div class="svg-wrapper-1">
        <div class="svg-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="none" d="M0 0h24v24H0z"></path>
            <path
              fill="currentColor"
              d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
            ></path>
          </svg>
        </div>
      </div>
      <span>{{ name }}</span>
    </v-btn>
  </v-col>
</template>

<script>
  export default {
    props: {
      name: {
        type: String
      },
      validateForm: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>
  .button {
    font-family: inherit;
    font-size: 14px;
    background: royalblue;
    color: #ffffff;
    padding: 0.7em 1em;
    padding-left: 0.9em;
    width: 180px;
    display: flex;
    align-items: center;
    border: none;
    overflow: hidden;
    transition: all 0.2s;
  }

  .button span {
    display: block;
    margin-left: 0.3em;
    transition: all 0.3s ease-in-out;
  }

  .button svg {
    display: block;
    transform-origin: center center;
    transition: transform 0.3s ease-in-out;
  }

  .button:hover .svg-wrapper {
    animation: fly-1 0.6s ease-in-out infinite alternate;
  }

  .button:hover svg {
    transform: translateX(2em) rotate(45deg) scale(1.1);
  }

  .button:hover span {
    transform: translateX(10em);
  }

  .button:active {
    transform: scale(0.95);
  }

  @keyframes fly-1 {
    from {
      transform: translateY(0.1em);
    }

    to {
      transform: translateY(-0.1em);
    }
  }
</style>
