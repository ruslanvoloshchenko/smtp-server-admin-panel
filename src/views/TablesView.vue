<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router'
import { mdiMonitorCellphone, mdiTableBorder, mdiCreation } from "@mdi/js";
import SectionMain from "@/components/SectionMain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import TableUsers from "@/components/TableUsers.vue";
import CardBox from "@/components/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import BaseButton from "@/components/BaseButton.vue";

const router = useRouter()

const alert = reactive({
  isShow: false,
  content: "Responsive table. Collapses on mobile"
})
const handleAddNewUser = () => {
  router.push('/users/create')
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiTableBorder" title="User list" main>
        <BaseButton
          :icon="mdiCreation"
          label="Add new user"
          color="contrast"
          rounded-full
          small
          @click="handleAddNewUser"
        />
      </SectionTitleLineWithButton>

      <NotificationBar v-if="alert.isShow" color="info" :icon="mdiMonitorCellphone">
        {{ alert.content }}
      </NotificationBar>

      <CardBox class="mb-6" has-table>
        <TableUsers checkable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
