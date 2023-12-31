<template>
  <el-row>
    <el-col :xs="12" :span="15" :lg="18">
      <el-input
        @keyup.enter="toggleTask"
        placeholder="Nom de votre tâche"
        v-model="taskname"
      ></el-input>
    </el-col>

    <el-col :xs="12" :span="9" :lg="6" class="actions">
      <strong>{{ currentDuration }}</strong>
      <el-button
        @click="startTask"
        v-if="!isTaskInProgress"
        type="primary"
        icon="video-play"
        circle
      ></el-button>
      <el-button
        @click="stopTask"
        v-if="isTaskInProgress"
        type="danger"
        icon="video-pause"
        circle
      ></el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      taskname: "",
      isTaskInProgress: false,
      startTime: null,
      nowTime: null,
      intervalEverySecond: null,
      errorMsg: null,
    };
  },
  computed: {
    currentDuration() {
      if (this.startTime && this.nowTime) {
        return this.durationBetweenTimestamps(this.startTime, this.nowTime);
      } else {
        return "00:00:00";
      }
    },
  },
  watch: {
    isTaskInProgress(isInProgress) {
      if (isInProgress) {
        this.intervalEverySecond = setInterval(() => {
          this.nowTime = Date.now();
        }, 1000);
      } else {
        clearInterval(this.intervalEverySecond);
      }
    },
  },
  methods: {
    startTask() {
      // Vérifications
      if (this.taskname.length === 0) {
        this.$emit("alert", {
          titre: "Attention",
          message: "Le nom d'une tâche ne peut pas être vide",
          type: "warning",
        });
        return;
      } else if (this.isTaskInProgress) {
        this.errorMsg = "Une tâche est déjà en cours";
        this.$emit("alert", {
          titre: "Attention",
          message: "Une tâche est déjà en cours",
          type: "warning",
        });
        return;
      } else {
        this.errorMsg = null;
      }

      // Début de la tâche
      this.isTaskInProgress = true;
      this.startTime = Date.now();
      this.nowTime = Date.now();
    },
    stopTask() {
      // Vérifications
      if (!this.isTaskInProgress) {
        this.errorMsg = "Aucune tâche n'est en cours";
        return;
      }

      // Envoi de la nouvelle tache
      this.$emit("newTask", {
        name: this.taskname,
        startTime: this.startTime,
      });

      // Fin de la tâche
      this.isTaskInProgress = false;
      this.errorMsg = null;
      this.nowTime = null;
      this.taskname = "";
    },
    toggleTask() {
      if (this.isTaskInProgress) {
        this.stopTask();
      } else {
        this.startTask();
      }
    },
    restartTask(newTaskName) {
      if (this.isTaskInProgress) {
        this.stopTask;
      }

      this.$nextTick(() => {
        this.taskname = newTaskName;
        this.startTask();
      });
    },
    durationBetweenTimestamps(start, end) {
      let seconds = Math.floor(end / 1000 - start / 1000);
      let minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      seconds = seconds % 60;
      minutes = minutes % 60;
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  padding-left: 20px;
  box-sizing: border-box;
}

.actions {
  text-align: right;
  padding-right: 20px;
  strong {
    padding-right: 20px;
  }
}
</style>
