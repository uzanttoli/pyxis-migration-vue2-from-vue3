<template>
  <div class="card">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="1.5"
            stroke="#ffffff"
            d="M20 14V17.5C20 20.5577 16 20.5 12 20.5C8 20.5 4 20.5577 4 17.5V14M12 15L12 3M12 15L8 11M12 15L16 11"
          ></path>
        </g>
      </svg>
    </div>
    <div class="content">
      <span class="title">Arquivo anexado!</span>
      <div class="desc">{{ nameArquive }}</div>
      <div class="actions">
        <button type="button" class="success-button-main" @click="$emit('click-event-send')">
          Enviar
        </button>
        <button type="button" class="success-button-main" @click="$emit('click-event-cancel')">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      arquiveTitle: {
        type: String,
        require: true
      },
      nameArquive: {
        type: String,
        require: true
      },
      isDelete: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style scoped>
  .card {
    max-width: 600px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-radius: 0.5rem;
    background: #606c88;
    background: -webkit-linear-gradient(to right, #3f4c6b, #606c88);
    background: linear-gradient(to right top, #3f4c6b, #606c88);
    padding: 1rem;
    color: rgb(107, 114, 128);
    box-shadow: 0px 87px 78px -39px rgba(0, 0, 0, 0.4);
  }

  .icon {
    height: 2rem;
    width: 2rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    background-color: #153586;
    color: rgb(59, 130, 246);
  }

  .icon svg {
    height: 1.25rem;
    width: 1.25rem;
  }

  .content {
    margin-left: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 400;
  }

  .title {
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    color: rgb(255, 255, 255);
  }

  .desc {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 400;
    max-width: 95%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgb(202, 200, 200);
  }

  .actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
    /* justify-content: center; */
    /* grid-gap: 0.5rem; */
  }
  .actions-center {
    display: center;
    margin-right: 35px;
    /* justify-content: center; */
    /* grid-gap: 0.5rem; */
  }

  .download,
  .notnow {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    border-radius: 0.5rem;
    padding: 0.375rem 0.5rem;
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgb(255, 255, 255);
    outline: 2px solid transparent;
    border: 1px solid rgba(253, 253, 253, 0.363);
  }

  .download {
    background-color: #284385;
    font-weight: 600;
  }

  .download:hover {
    background-color: #153586;
  }

  .notnow {
    background-color: #606c88;
    font-weight: 500;
  }

  .notnow:hover {
    background-color: #3f4c6b;
  }

  .close {
    margin: -0.375rem -0.375rem -0.375rem auto;
    height: 2rem;
    width: 2rem;
    display: inline-flex;
    border-radius: 0.5rem;
    background-color: #606c88;
    padding: 0.375rem;
    color: rgba(255, 255, 255, 1);
    border: none;
  }

  .close svg {
    height: 1.25rem;
    width: 1.25rem;
  }

  .close:hover {
    background-color: rgb(58, 69, 83);
  }

  .success-button-main {
    color: #606c88;
    padding: 5px;
    border-radius: 10px;
    background-color: white;
  }
</style>
