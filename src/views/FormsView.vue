<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiMail, mdiTableBorder } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useMainStore } from '@/stores/main'
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";

const mainStore = useMainStore()
const router = useRouter()
const isEdit = ref(false)

const form = reactive({
  username: 'John Doe',
  to_address: 'john.doe@example.com',
  mail_server: '',
  domain: ''
})

onMounted(() => {
  let { userId } = router.currentRoute.value.params
  if(userId) {
    mainStore.getUser(userId, setUser)
    isEdit.value = true
  }
})

const setUser = ({ data: { data } }) => {
  form.username = data.username
  form.to_address = data.to_address
  form.mail_server = data.mail_server
  form.domain = data.domain
}

const submit = () => {
  if(isEdit.value) {
    let { userId } = router.currentRoute.value.params
    mainStore.updateUser(userId, form)
  } else {
    mainStore.createUser(form)
  }
  router.back()
}

const reset = () => {
  form.username = ""
  form.to_address = ""
  form.mail_server = ""
  form.domain = ""
}

const back = () => {
  router.back()
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" :title="isEdit ? 'Edit User' : 'Create New User'" main>
      </SectionTitleLineWithButton>

      <CardBox form @submit.prevent="submit">
        <FormField label="User Information">
          <FormControl v-model="form.username" :icon="mdiAccount" placeholder="Username"/>
          <FormControl v-model="form.to_address" type="email" :icon="mdiMail" placeholder="Email"/>
        </FormField>

        <FormField label="Our Domain">
          <FormControl v-model="form.domain" type="domain" placeholder="director.omnimailhost.com"/>
        </FormField>

        <FormField label="Mail Server">
          <FormControl v-model="form.mail_server" type="domain" placeholder="gmail.com"/>
        </FormField>

        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" :label="isEdit ? 'Update' : 'Submit'" @click="submit"/>
            <BaseButton v-if="!isEdit" type="reset" color="info" outline label="Reset" @click="reset"/>
            <BaseButton v-else type="reset" color="info" outline label="Back" @click="back"/>
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
