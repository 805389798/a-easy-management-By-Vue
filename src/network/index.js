import * as loginApi from './modules/login'
import * as dictionaryApi from './modules/dictionary'
import * as fieldApi from './modules/field'
import * as departmentApi from './modules/department'
import * as postApi from './modules/post'
import * as userApi from './modules/user'
import * as roleApi from './modules/role'
import * as menuApi from './modules/menu'


let api = Object.assign(
  loginApi,
  dictionaryApi,
  fieldApi,
  departmentApi,
  postApi,
  userApi,
  roleApi,
  menuApi
)

export default api
