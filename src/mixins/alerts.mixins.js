const alerts = {
  methods: {
    toast(title, position, showConfirmButton = false, timer, type) {
      const Toast = this.$swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: showConfirmButton,
        timer: timer,
        timerProgressBar: true,
        didOpen: toast => {
          toast.addEventListener('mouseenter', this.$swal.stopTimer)
          toast.addEventListener('mouseleave', this.$swal.resumeTimer)
        }
      })
      Toast.fire({
        icon: type,
        title: title
      })
    },
    swalConfirmation(
      callback,
      title,
      text,
      confirmButtonColor,
      titleAction,
      textAction,
      showConfirmButton = true,
      showCancelButton = true,
      cancelButtonText = 'Cancelar',
      isMessageConfirmed = true
    ) {
      this.$swal
        .fire({
          title: title ?? 'Deseja continuar?',
          text: text ?? 'Você não conseguirá reverter isso!',
          icon: 'warning',
          showCancelButton: showCancelButton,
          showConfirmButton: showConfirmButton,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: confirmButtonColor ?? 'Sim, deletar isso!',
          cancelButtonText: cancelButtonText
        })
        .then(result => {
          if (result.isConfirmed) {
            if (isMessageConfirmed) {
              this.$swal
                .fire({
                  title: titleAction ?? 'Deletado!',
                  text: textAction ?? 'Você deletou essa informação!',
                  icon: 'success'
                })
                .then(() => {
                  if (typeof callback === 'function') {
                    callback(title, text, confirmButtonColor, titleAction, textAction)
                  }
                })
            } else if (typeof callback === 'function') {
              callback()
            }
          } else if (result.dismiss === this.$swal.DismissReason.cancel) {
            if (isMessageConfirmed) {
              this.$swal.fire({
                title: cancelButtonText == 'Cancelar' ? 'Cancelada!' : '',
                text:
                  cancelButtonText == 'Cancelar'
                    ? 'Ação cancelada :)'
                    : 'Siga conforme orientação do gestor',
                icon: cancelButtonText == 'Cancelar' ? 'error' : 'success'
              })
            }
          }
        })
    }
  }
}

export default alerts
