import Vue from 'vue'

Vue.component('title-negative-margin', () =>
  import('../shared/components/titles/titleNegativeMargin.component.vue')
)

Vue.component('button-send', () => import('../shared/components/buttons/buttonSend.component.vue'))

Vue.component('button-delete', () =>
  import('../shared/components/buttons/buttonDelete.component.vue')
)

Vue.component('alert-box', {
  template: `
    <div class="demo-alert-box">
      <strong>Erro!</strong>
      <slot></slot>
    </div>
  `
})

Vue.component('title-rounded-tl-rb', () =>
  import('../shared/components/cards/titleRoundedTopLeftBottomRigth.vue')
)
