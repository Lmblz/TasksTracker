<template>
    <h2>App</h2>
    <el-form
        :label-position="top"
        ref="appInfoForm"
        :model="formData"
        :rules="formRules"
        @keyup.enter="sendSubmitForm"
    >
        <el-form-item label="Clé d'API">
            <el-input v-model="formData.apiKey" />
        </el-form-item>
        <el-form-item label="ID du BIN">
            <el-input v-model="formData.binId" />
        </el-form-item>
        <el-button
            type="primary"
            @click="sendSubmitForm"
            :disabled="isSubmitDisabled"
            >Submit</el-button
        >
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                apiKey: "",
                binId: "",
            },
            formRules: {
                apiKey: [
                    {
                        required: true,
                        message: "La clé d'API est obligatoire",
                        trigger: "blur",
                    },
                ],
                binId: [
                    {
                        required: true,
                        message: "L'ID du BIN est obligatoire",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    mounted() {
        this.formData.apiKey = localStorage.getItem("apiKey");
        this.formData.binId = localStorage.getItem("binId");
    },
    computed: {
        isSubmitDisabled() {
            if (
                this.formData.apiKey == localStorage.getItem("apiKey") &&
                this.formData.binId == localStorage.getItem("binId")
            ) {
                return true;
            } else {
                return Object.keys(this.formRules).some(
                    (field) =>
                        this.formRules[field][0].required &&
                        !this.formData[field]
                );
            }
        },
    },
    methods: {
        sendSubmitForm() {
            this.$refs.appInfoForm.validate((valid) => {
                if (valid) {
                    this.$emit("submitForm", [
                        this.formData.apiKey,
                        this.formData.binId,
                    ]);
                } else {
                    console.log("pas valide");
                }
            });
        },
    },
};
</script>
