<template>
    <div class="page-form-container">
        <div class="form-title">
            <span v-if="$slots.title || title">
                <slot name="title">{{title}}</slot>
            </span>
            <span class="form-description" v-if="$slots.description || description">
                <slot name="description">{{description}}</slot>
            </span>
        </div>

        <div class="form-main">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PageForm',
        props: ['title', 'description']
    };
</script>

<style lang="scss" scoped>
    .page-form-container {
        .form-title {
            padding: 30px 20px;
            font-size: 18px;
            font-weight: bold;
            border-bottom: 1px solid $border-color;

            .form-description {
                display: block;
                margin-top: 20px;
                font-size: 12px;
                font-weight: normal;
                color: $info-color;
            }
        }

        .form-main {
            padding: 20px;

            ::v-deep(.el-form) {
                .el-form-item {
                    .tip {
                        margin-left: 10px;
                        color: $normal-color;
                    }

                    & > .el-input, .el-cascader, .el-select, .el-date-editor, .el-autocomplete {
                        width: 100%;
                    }

                    .el-color-picker, .el-input, .el-cascader, .el-select, .el-button, .el-radio-group, .el-checkbox-group, .el-input-number {
                        vertical-align: top;
                    }
                }
            }
        }
    }
</style>
