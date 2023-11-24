<template>
    <el-select v-model="sortBy" placeholder="Select">
        <el-option
            label="La plus récente d'abord"
            value="descending"
        ></el-option>
        <el-option
            label="La plus ancienne d'abord"
            value="ascending"
        ></el-option>
    </el-select>
    <el-table
        :data="tasks"
        :row-class-name="checkHighlight"
        row-key="id"
        @row-click="setHighlight"
        empty-text="Aucune tâche"
        v-loading="areTasksLoading"
        ref="table"
    >
        <el-table-column prop="name" label="Tâche" sort-by="startTime">
        </el-table-column>

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
            defaultSortBy: "ascending",
            sortBy:
                this.$route.query.sortBy === "ascending"
                    ? "ascending"
                    : "descending",
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
    watch: {
        sortBy(newVal) {
            this.$router.push({
                query: {
                    sortBy: newVal === this.defaultSortBy ? undefined : newVal,
                },
            });
            this.sortTable();
        },
        tasks: {
            deep: true,
            handler() {
                this.sortTable();
            },
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
        sortTable() {
            const sortBy = this.sortBy;
            this.$refs.table.sort("name", sortBy);
        },
        checkHighlight({ row }) {
            if (
                this.$route.params.taskId &&
                row.id === this.$route.params.taskId
            ) {
                return "highlight-line";
            } else {
                return "";
            }
        },
        setHighlight(row) {
            this.$router.push({ path: "/home/" + row.id });
        },
    },

    components: { TaskListActions },
    mounted() {
        this.sortTable();
    },
};
</script>

<style scoped>
.el-select {
    float: right;
}
</style>
