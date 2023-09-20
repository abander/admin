import { onMounted, ref } from 'vue'
// 请求
import { getCaptcha, getUserInfo, login } from '@/api/user/login'
// store
import { userStore } from '@/stores/user'

import { useRouter } from 'vue-router'

import { setToken } from '@/utils/auth.js'

import { getUuid } from '@/utils'

export default function useArchive() {
  const form = ref({
    username: 'admin',
    password: '123456',
    captcha: '',
  })

  const formRef = ref(null)

  const formRules = ref({
    username: [
      {
        required: true,
        message: 'Please input Activity name',
        trigger: 'blur',
      },
    ],
    password: [
      {
        required: true,
        message: 'Please input Activity password',
        trigger: 'blur',
      },
    ],
    captcha: [
      {
        required: true,
        message: 'Please input Activity name',
        trigger: 'blur',
      },
    ],
  })

  const [store, router] = [userStore(), useRouter()]

  const sid = getUuid()

  const src = ref(null)

  // 表单提交
  const submit = () => {
    //判断formEl是否为空，为空
    if (!formRef.value) return
    formRef.value.validate(async (valid) => {
      if (valid) {
        //如果校验成功 请求数据
        const {
          data: { token },
        } = await login({ ...form.value, sid: sid })
        if (token) {
          //如果token有内容
          // 登录成功，储存token
          setToken(token)
          const { data } = await getUserInfo()
          // 用户信息存起来
          store.setUser(data)
          $Message({ message: '用户登录成功！！！', type: 'success' })
          router.push('/')
        }
      } else {
        $Message({ message: '该账号已被注册', type: 'warning' })
        return false
      }
    })
  }

  const captcha = async () => {
    try {
      const data = await getCaptcha(sid)
      let blob = new Blob([data], { type: 'image/svg+xml' }) // 此处为生成doc
      src.value = window.URL.createObjectURL(blob)
    } catch (e) {}
  }
  onMounted(() => {
    captcha()
  })

  return {
    form,
    formRef,
    formRules,
    submit,
    src,
    captcha,
  }
}
