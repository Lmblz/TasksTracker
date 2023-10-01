<template>
    <el-container class="mainContainer">
        <el-aside width="200px">
            <TheMenu />
        </el-aside>

        <el-container>
            <el-header height="60px">
                <TheTopTask
                    ref="TheTopTask"
                    @newTask="addTask($event)"
                    @alert="showAlertModal($event)"
                />
            </el-header>

            <el-main>
                <TaskList
                    :tasks="tasks"
                    :areTasksLoading="areTasksLoading"
                    v-on="{
                        restart: sendRestartTask,
                        delete: deleteTask,
                    }"
                />
            </el-main>

            <Alert ref="Alert" />
        </el-container>
    </el-container>
</template>

<script>
import { v4 as uuid } from "@lukeed/uuid";
import * as TaskService from "./services/TaskService.js";

import TheMenu from "./components/TheMenu.vue";
import TheTopTask from "./components/TheTopTask.vue";
import TaskList from "./components/TaskList.vue";
import Alert from "./components/Alert.vue";

export default {
    components: {
        TheMenu,
        TheTopTask,
        TaskList,
        Alert,
    },
    data() {
        return {
            tasks: [],
            areTasksLoading: true,
        };
    },
    methods: {
        async addTask({ name, startTime }) {
            // Ajout de la tâche en local
            this.tasks.unshift({
                id: uuid(),
                name,
                startTime,
                endTime: Date.now(),
            });

            // Ajout de la tâche sur l'API
            try {
                await TaskService.updateAll(this.tasks);
            } catch (e) {
                console.error(e);
                this.showAlertModal({
                    titre: "Hors connexion",
                    message: "Les tâches n'ont pas pu être récupérées",
                    type: "error",
                });
            }
        },
        async deleteTask(taskID) {
            // Récupération de l'index de la tâche
            let taskIndex = null;
            this.tasks.forEach((task, index) => {
                if (task.id === taskID) {
                    taskIndex = index;
                }
            });

            // Suppression de la tâche en local
            this.tasks.splice(taskIndex, 1);

            // Mise à jour de la tâche sur l'API
            try {
                await TaskService.updateAll(this.tasks);
            } catch (e) {
                console.error(e);
                this.showAlertModal({
                    titre: "Hors connexion",
                    message: "Les tâches n'ont pas pu être récupérées",
                    type: "error",
                });
            }
        },
        sendRestartTask(taskId) {
            // Récupération du nom de l'ancienne tâche
            let newTaskName = null;

            this.tasks.forEach((task) => {
                if (task.id === taskId) {
                    newTaskName = task.name;
                }
            });

            this.$refs.TheTopTask.restartTask(newTaskName);
        },
        showAlertModal(e) {
            const titre = e.titre,
                message = e.message,
                type = e.type;

            this.$refs.Alert.showNotification(titre, message, type);
        },
    },
    async created() {
        try {
            this.tasks = await TaskService.getAll();
        } catch (e) {
            console.log(e);
            this.showAlertModal({
                titre: "Hors connexion",
                message: "Les tâches n'ont pas pu être récupérées",
                type: "error",
            });
        }

        this.areTasksLoading = false;
    },
};
</script>

<style lang="scss">
body {
    margin: 0;
}
#app {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}
.mainContainer {
    height: 100%;
}

.el-aside {
    height: 100%;
    color: #333;
    border-right: solid 1px #e6e6e6;
}
.el-header {
    padding: 0 !important;
    border-bottom: solid 1px #e6e6e6;
    color: #333;
    line-height: 60px;
    .el-input .el-input__inner {
        border: none !important;
    }
}
</style>
