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
  <n-form ref="formRef" :model="formData" :rules="rules">
    <n-form-item label="電子郵件" path="email">
      <n-input v-model:value="formData.email" clearable autofocus />
    </n-form-item>

    <n-form-item label="密碼" path="password">
      <n-input v-model:value="formData.password" type="password" show-password-on="mousedown" clearable />
    </n-form-item>

    <n-form-item path="remember" :show-label="false" :show-feedback="false">
      <n-checkbox>記住我</n-checkbox>
    </n-form-item>

    <n-form-item :show-feedback="false" :class="$style.signInButton">
      <n-button type="primary" secondary block @click="handleSignInClick">
        登入
      </n-button>
    </n-form-item>
  </n-form>
</template>

<style module lang="scss">
.signInButton {
  margin-top: 32px;
}
</style>
