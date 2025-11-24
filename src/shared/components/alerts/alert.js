import Vue from 'vue'

function alertGenerico(position, time, icon, title) {
  const Toast = Vue.swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: time,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener('mouseenter', this.$swal.stopTimer)
      toast.addEventListener('mouseleave', this.$swal.resumeTimer)
    }
  })
  Toast.fire({
    icon: icon,
    title: title
  })
}
export default alertGenerico()

// module.exports = AlertTroastSweet;
