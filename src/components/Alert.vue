<template></template>

<script>
import { ElNotification } from "element-plus";

export default {
    data() {
        return {};
    },
    methods: {
        showNotification(titre, message, type) {
            console.log(titre, message, type);
            ElNotification({
                title: titre,
                message: message,
                type: type,
                offset: 50,
            });
        },
    },
};
</script>
