import { uuid } from 'vue-uuid';
import IndexedDB from '../../indexDB-service'

const state = {
    taskList: [],
}

const getters = {
    taskList: state=> state.taskList,
}

const actions = {
    async initTaskList(context) {
        try {
            await IndexedDB.open()
            const taskListDB = await IndexedDB.fetchTaskList()
            context.commit('initTaskList', {taskListArr: taskListDB})
        }
        catch(err) {
            throw err;
        }
    },
    async addNewTask(context, {freeText}) {
        const newTaskId = uuid.v4();
        const newTaskEl = await IndexedDB.addTask({freeText, id:newTaskId})
        context.commit('addNewTask', {newTaskEl})
    },
    async removeTask(context, {taskId}){
        context.commit('removeTask', {taskId})
        await IndexedDB.deleteOpenMeasurement({id: taskId})
    },
    async toggleCheckedTask(context, {taskId}){
        context.commit('toggleCheckedTask', {taskId})
        await IndexedDB.toggltoggleCheckedTask({id: taskId})
    },
}

const mutations = {
    initTaskList(state, {taskListArr}) {
        state.taskList = taskListArr
    },
    addNewTask(state, {newTaskEl}) {
        state.taskList.unshift(newTaskEl)
    },
    removeTask(state, {taskId}) {
        const taskIds = state.taskList.map(task => task.id)
        const taslIndex = taskIds.indexOf(taskId)
        state.taskList.splice(taslIndex, 1)
    },
    toggleCheckedTask(state, {taskId}) {
        const task = state.taskList.find(task => task.id === taskId)

        if(task) {
            task.checked = !task.checked
        }
    },
}


export default {state, mutations, actions, getters }