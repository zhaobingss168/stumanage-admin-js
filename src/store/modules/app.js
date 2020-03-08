export default {
    state: {
        appName: "报名管理系统",  // 应用名称
        themeColor: "#506366",  // 主题颜色#14889A
        oldThemeColor: "#506366",   // 上一次主题颜色#14889A
        collapse:false,  // 导航栏收缩状态
        menuRouteLoaded:false    // 菜单和路由是否已经加载
    },
    getters: {
        collapse(state){// 对应着上面state
            return state.collapse
        }
    },
    mutations: {
        onCollapse(state){  // 改变收缩状态
            state.collapse = !state.collapse
        },
        setThemeColor(state, themeColor){  // 改变主题颜色
            state.oldThemeColor = state.themeColor
            state.themeColor = themeColor
        },
        menuRouteLoaded(state, menuRouteLoaded){  // 改变菜单和路由的加载状态
            state.menuRouteLoaded = menuRouteLoaded;
        }
    },
    actions: {
    }
}
