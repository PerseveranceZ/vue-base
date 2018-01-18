import Vue from 'vue';
import iView from 'iview';
import Router from 'vue-router';
Vue.use(Router);


import home from './home';
import error from './error';

const router = new Router({
    routes: [
        ...home,
        ...error
    ]
});

const setTitle = (title) => {
    title = title || '首页';
    window.document.title = title;
}

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    setTitle(to.meta.title);
    next();
});

router.afterEach((to) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

export default router;