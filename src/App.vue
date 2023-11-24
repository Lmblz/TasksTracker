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
                <router-view
                    :tasks="tasks"
                    :areTasksLoading="areTasksLoading"
                    v-on="{
                        restart: sendRestartTask,
                        delete: deleteTask,
                        submitForm: submitAppForm,
                    }"
                ></router-view>
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
import Alert from "./components/Alert.vue";

export default {
    components: {
        TheMenu,
        TheTopTask,
        Alert,
    },
    data() {
        return {
            tasks: [],
            areTasksLoading: true,
            apiKey: "",
            binId: "",
        };
    },
    methods: {
        async getTasks() {
            console.log("coucou");
            try {
                this.tasks = await TaskService.getAll();
                localStorage.setItem("correctAppInfos", true);
                this.showAlertModal({
                    titre: "Succès",
                    message: "Les tâches ont bien pu être récupérées",
                    type: "success",
                });
            } catch (e) {
                console.log(e);
                this.tasks = [];
                localStorage.removeItem("correctAppInfos");
                this.showAlertModal({
                    titre: "Hors connexion",
                    message: "Les tâches n'ont pas pu être récupérées",
                    type: "error",
                });
            }
        },
        getAppInfoInLocalStorage() {
            if (this.apiKey == "" && localStorage.getItem("apiKey")) {
                this.apiKey = localStorage.getItem("apiKey");
            } else {
                this.showAlertModal({
                    titre: "Clé d'API manquante",
                    message: "Aucune clé d'API indiquée",
                    type: "error",
                });
            }

            if (this.binId == "" && localStorage.getItem("binId")) {
                console.log("on remplace la clé par la clé du LS");
                this.binId = localStorage.getItem("binId");
            } else {
                this.showAlertModal({
                    titre: "Id du bin manquant",
                    message: "Aucun id de BIN indiquée",
                    type: "error",
                });
            }
        },
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
        async submitAppForm(data) {
            let tempApiKey = data[0];
            let tempBinId = data[1];
            let modalContent = {
                title: "",
                message: "",
                type: "",
            };

            if (tempApiKey == "" || tempApiKey == "") {
                this.showAlertModal({
                    titre: "Valeur(s) vide(s)",
                    message: "Le formulaire contient des champs non remplis",
                    type: "error",
                });
            } else {
                this.apiKey = tempApiKey;
                this.binId = tempBinId;
            }

            localStorage.setItem("apiKey", this.apiKey);
            localStorage.setItem("binId", this.binId);

            await this.getTasks();
        },
    },
    async mounted() {
        this.getAppInfoInLocalStorage();
        this.getTasks();

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

.highlight-line {
    background: #40a0ff2a !important;
}
</style>
