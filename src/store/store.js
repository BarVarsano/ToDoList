import Vue from 'vue'
import Vuex from 'vuex'
import taskList from './modules/taskList'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        taskList
    }
})