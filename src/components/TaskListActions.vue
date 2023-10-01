<template>
    <el-button
        size="small"
        @click="sendCopyTaskName"
        icon="el-icon-document-copy"
        circle
    ></el-button>
    <el-button
        size="small"
        type="primary"
        @click="sendRestart"
        icon="el-icon-video-play"
        circle
    ></el-button>
    <el-button
        size="small"
        type="danger"
        @click="sendDelete"
        icon="el-icon-delete"
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
