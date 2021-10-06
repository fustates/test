import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './plugins/axios.js'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'
// 第三方插件 表格
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

// 将富文本编辑器。注册全局可用的组件
Vue.use(VueQuillEditor)

// 年月日，时分秒 过滤器
Vue.filter('dateFormat',function(originVal){
 const dt= new Date(originVal)

//  年月日
 const y = dt.getFullYear()
 const m = (dt.getMonth() + 1 + '').padStart(2,'0')
 const d = (dt.getDate() + '').padStart(2,'0')

//  时分秒
 const hh = (dt.getHours() + '').padStart(2,'0')
 const mm = (dt.getMinutes() + '').padStart(2,'0')
 const ss = (dt.getSeconds() + '').padStart(2,'0')

 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
