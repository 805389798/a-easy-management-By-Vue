import * as types from './mutations_types';

const mutations = {
  [types.UPDATE_MENU_STATUS](state, payload) {
    state.status = payload;
  },
  [types.UPDATE_MENU_LIST] (state, payload) {
    state.menu = payload;
  },
  [types.UPDATE_TOKEN] (state, payload) {
    state.token = payload
  }
};

export default mutations;
