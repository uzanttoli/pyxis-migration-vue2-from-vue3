// import Vue from 'vue'
// import vuetify from '@/plugins/vuetify'
// import PopupDinamico from './PopupDinamico.vue'

// export function mostrarPopup(props) {
//   const container = document.createElement('div')
//   document.body.appendChild(container)

//   const PopupClass = Vue.extend(PopupDinamico)

//   const instance = new PopupClass({
//     vuetify,
//     propsData: {
//       ...props,
//       onClose: () => {
//         cleanup()
//       }
//     }
//   })

//   const cleanup = () => {
//     instance.$destroy()
//     if (container && container.parentNode) {
//       container.parentNode.removeChild(container)
//     }
//   }

//   instance.$mount(container)
// }
