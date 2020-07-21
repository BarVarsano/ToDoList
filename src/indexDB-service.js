import Dexie from 'dexie';

const db = new Dexie("taskListBar", {autoOpen: false});

db.version(1).stores({ 
    taskList: '++id, freeText, creationDate, lastUpdatedDate, checked',
});

/* *******************************  Addition  ******************************* */
const addTask = async ({freeText, id}) => {
    try {
        const newTaskEl = { 
            id, 
            freeText,
            creationDate: Object.freeze(new Date()),
            lastUpdatedDate: new Date(),
            checked: false,
        }

        await db.taskList.add(newTaskEl);
        
        return newTaskEl;
    }
    catch (err) {
        console.error(`Failed to add task to DB: ${err.stack || err}`);
        throw err;
    }
}

const IndexedDB = {
    open: async () => {
        try {
            await db.open("taskListBar", 1);
        }
        catch(err) {
            console.error('Failed to open db: ' + (err.stack || err));
            throw err;
        }
    },
    //Fetching data - return array containing the found objects
    fetchTaskList: async () => {
        try {
            const taskListDB =  await db.taskList.orderBy('creationDate').toArray();
            return taskListDB;
        }
        catch(err) {
            console.error('Failed to import task list - db' + (err.stack || err));
            throw err;
        }
    },
    //Single measurement (measurement, preorder)
    addTask: async ({freeText, id}) => {
        try {
            const newTaskEl = await addTask({freeText, id})

            return newTaskEl
        }
        catch (err) {
            console.error(`Failed to add task to DB: ${err.stack || err}`);
            throw err;
        }
    },
    //Delete - Promise that resolves successfully with an undefined result, no matter if a record was deleted or not.
    deleteOpenMeasurement: async ({ id }) => {
        try {
            return await db.taskList.where({ id }).delete();
        }
        catch (err) {
            console.error(`Failed to delete task from DB: ${err.stack || err}`);
            throw err;
        }
    },
    toggltoggleCheckedTask: async({ id }) => {
        try {
            const task = await db.taskList.get({id})
            const currentChecked = task.checked
            return await db.taskList.where({id}).modify({ checked: !currentChecked });
        }
        catch(err) {
            console.error(`Failed to toggle task 'Checked' - DB: ${err.stack || err}`);
            throw err;
        }
    },
}

export default IndexedDB;