<template>
    <el-table
        :data="tasks"
        stripe
        row-key="id"
        empty-text="Aucune tâche"
        v-loading="areTasksLoading"
    >
        <el-table-column prop="name" label="Tâche"> </el-table-column>

        <el-table-column align="right" label="Début et fin" width="150">
            <template #header></template>
            <template #default="scope">
                {{ formatTimestamp(scope.row.startTime) }} -
                {{ formatTimestamp(scope.row.endTime) }}
            </template>
        </el-table-column>

        <el-table-column align="right" label="Durée" width="150">
            <template #header></template>
            <template #default="scope">
                {{
                    durationBetweenTimestamps(
                        scope.row.startTime,
                        scope.row.endTime
                    )
                }}
            </template>
        </el-table-column>

        <el-table-column align="right" label="Actions" width="200">
            <template #header></template>
            <template #default="scope">
                <TaskListActions
                    :taskId="scope.row.id"
                    v-on="{
                        restart: sendRestart,
                        delete: sendDelete,
                    }"
                    @copyTaskName="copyToClipboard(scope.row.name)"
                />
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import TaskListActions from "./TaskListActions.vue";
export default {
    data() {
        return {
            tsFormatter: Intl.DateTimeFormat("fr", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    },
    methods: {
        TaskListActions,
    },
    props: {
        tasks: {
            type: Array,
            default: [],
        },
        areTasksLoading: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        formatTimestamp(ts) {
            return this.tsFormatter.format(ts);
        },
        durationBetweenTimestamps(start, end) {
            let seconds = Math.floor(end / 1000 - start / 1000);
            let minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            seconds = seconds % 60;
            minutes = minutes % 60;
            return `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        },
        sendRestart(data) {
            this.$emit("restart", data);
        },
        sendDelete(data) {
            this.$emit("delete", data);
        },
        copyToClipboard(text) {
            console.log(text);
            navigator.clipboard.writeText(text);
        },
    },
    components: { TaskListActions },
};
</script>