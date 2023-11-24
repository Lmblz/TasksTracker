<template>
    <h1>Coucou 2</h1>
    <RouterView @submitForm="sendSubmitForm"></RouterView>
</template>

<script>
export default {
    emits: ["submitForm"],
    methods: {
        sendSubmitForm(data) {
            this.$emit("submitForm", data);
        },
    },
};
</script>
