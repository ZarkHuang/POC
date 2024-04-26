<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import type {
  FormInst,
  FormItemRule,
  FormRules,
  FormValidationError,
} from 'naive-ui'

type FormData = {
  email: string
  password: string
  remember: boolean
}

const authStore = useAuthStore()
const message = useMessage()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const formData = ref<FormData>({
  email: 'admin@mail.com',
  password: 'admin',
  remember: false,
})
const rules: FormRules = {
  email: [
    {
      required: true,
      validator: (_: FormItemRule, value: string) => {
        const regexp = new RegExp(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)

        if (!value) {
          return new Error('Email is required')
        } else if (!regexp.test(value)) {
          return new Error('Invalid email')
        }

        return true
      },
      trigger: ['blur', 'input'],
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
      trigger: ['blur', 'input'],
    },
  ],
}

function handleSignInClick(e: MouseEvent) {
  e.preventDefault()

  formRef.value?.validate((errors: Array<FormValidationError> | undefined) => {
    if (!errors) {
      authStore.setLoginStatus(true)
      message.success('登入成功')
      router.push('/food-ing')
    } else {
      errors.forEach((error) => {
        message.error(error?.[0]?.message ?? '')
      })
    }
  })
}
</script>

<template>
  <NForm ref="formRef" :model="formData" :rules="rules">
    <NFormItem label="電子郵件" path="email">
      <NInput v-model:value="formData.email" clearable autofocus />
    </NFormItem>

    <NFormItem label="密碼" path="password">
      <NInput
        v-model:value="formData.password"
        type="password"
        show-password-on="mousedown"
        clearable
      />
    </NFormItem>

    <NFormItem path="remember" :show-label="false" :show-feedback="false">
      <NCheckbox>記住我</NCheckbox>
    </NFormItem>

    <NFormItem :show-feedback="false" :class="$style.signInButton">
      <NButton type="primary" secondary block @click="handleSignInClick">
        登入
      </NButton>
    </NFormItem>
  </NForm>
</template>

<style module lang="scss">
.signInButton {
  margin-top: 32px;
}
</style>
