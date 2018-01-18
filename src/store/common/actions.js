import CONSTS from 'Service/consts/'
export default {
    getUserInfo({ commit }) {
        commit('SET_USER_INFO', { userName: 'Zero', avatorPath: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg' })
        commit('SET_MENU', CONSTS['other/MENU'])
    }
}

const getters = {
    menuOriginGetter: state => state.menuOrigin,
    userinfoGetter: state => state.userinfo,
    menuTreeGetter: state => state.menuTree,
    menuMapGetter: state => state.menuMap
}