<template>
    <h1>404</h1>
    <h2 v-if="$route.redirectedFrom">
        /{{ $route.redirectedFrom.params.wrongPath }}
    </h2>
    <el-button @click="$router.back()" type="primary" round
        >Revenir en arrière</el-button
    >
</template>

<script>
export default {
    mounted() {
        console.log(this.$route);
    },
};
</script>
