import Swal from 'sweetalert2/dist/sweetalert2'

function alertCustom(
  title,
  text,
  icon,
  showCancelButton = true,
  confirmButtonColor,
  cancelButtonColor,
  confirmButtonText
) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: showCancelButton,
    confirmButtonColor: confirmButtonColor,
    cancelButtonColor: cancelButtonColor,
    confirmButtonText: confirmButtonText
  })
}

module.exports = alertCustom
