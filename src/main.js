import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// element-ui 按需引入
import {
    Dropdown,
    Menu,
    MenuItem,
    Submenu,
    Loading,
    Radio,
    RadioGroup,
    Tabs,
    TabPane,
    InfiniteScroll,
    Checkbox,
    CheckboxGroup,
    Tag,
    Pagination,
    Progress,
    Upload,
    DropdownItem,
    Avatar,
    Divider,
    DropdownMenu,
    Card,
    Backtop,
    Header,
    Container,
    Main,
    Message,
    Empty,
    MessageBox,
    Input,
    FormItem,
    Col,
    Row,
    Button,
    Select,
    Table,
    TableColumn,
    Option,
    Form,
    Dialog
} from 'element-ui';

Message.install = function (Vue, options) {
    Vue.prototype.$message = Message
}

Vue.prototype.$confirm = MessageBox.confirm;
Vue.use(Message)
Vue.use(InfiniteScroll)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)

Vue.component(DropdownItem.name, DropdownItem)
Vue.component(Tabs.name, Tabs)
Vue.component(RadioGroup.name, RadioGroup)
Vue.component(Radio.name, Radio)
Vue.component(TabPane.name, TabPane)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(Checkbox.name, Checkbox)
Vue.component(Tag.name, Tag)
Vue.component(Progress.name, Progress)
Vue.component(Upload.name, Upload)
Vue.component(Pagination.name, Pagination)
Vue.component(DropdownMenu.name, DropdownMenu)
Vue.component(Dropdown.name, Dropdown)
Vue.component(Backtop.name, Backtop)
Vue.component(Header.name, Header)
Vue.component(Card.name, Card)
Vue.component(Container.name, Container)
Vue.component(Main.name, Main)
Vue.component(Empty.name, Empty)
Vue.component(Dialog.name, Dialog)
Vue.component(Form.name, Form)
Vue.component(Input.name, Input)
Vue.component(FormItem.name, FormItem)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Table.name, Table)
Vue.component(TableColumn.name, TableColumn)
Vue.component(Option.name, Option)
Vue.component(Avatar.name, Avatar)
Vue.component(Divider.name, Divider)
// Vue.component(Loading.name, Loading)
Vue.use(Loading);

// 语言
import i18n from './lang/index'

// 引入图标字体
import './assets/fonts/iconfont.css'
// import './assets/fonts/iconfont'

// 引入仓库
import store from '@/store'

// 引入路由
import router from '@/router'


new Vue({
    render: h => h(App),
    router,
    store,
    i18n,
    beforeCreate() {
        Vue.prototype.$bus = this
    }
}).$mount('#app')