export default {
  install(app) {
    app.component(
      'title-negative-margin',
      () => import('../shared/components/titles/titleNegativeMargin.component.vue')
    )

    app.component(
      'button-send',
      () => import('../shared/components/buttons/buttonSend.component.vue')
    )

    app.component(
      'button-delete',
      () => import('../shared/components/buttons/buttonDelete.component.vue')
    )

    app.component('alert-box', {
      template: `
        <div class="demo-alert-box">
          <strong>Erro!</strong>
          <slot></slot>
        </div>
      `
    })

    app.component(
      'title-rounded-tl-rb',
      () => import('../shared/components/cards/titleRoundedTopLeftBottomRigth.vue')
    )
  }
}
