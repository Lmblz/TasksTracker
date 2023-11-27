<template>
  <el-button
    size="small"
    @click="sendCopyTaskName"
    icon="CopyDocument"
    circle
  ></el-button>
  <el-button
    size="small"
    type="primary"
    @click="sendRestart"
    icon="VideoPlay"
    circle
  ></el-button>
  <el-button
    size="small"
    type="danger"
    @click="sendDelete"
    icon="Delete"
    circle
  ></el-button>
</template>

<script>
export default {
  props: {
    taskId: {
      type: String,
      required: true,
    },
  },
  emits: ["restart", "delete", "copyTaskName"],
  methods: {
    sendRestart() {
      this.$emit("restart", this.taskId);
    },
    sendDelete() {
      this.$emit("delete", this.taskId);
    },
    sendCopyTaskName() {
      this.$emit("copyTaskName");
    },
  },
};
</script>
