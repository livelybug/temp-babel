import axios from 'axios'
import {gVals} from '../util/env'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios;
  Vue.prototype.$rowsPerPage = gVals.rowsPerPage;
}
