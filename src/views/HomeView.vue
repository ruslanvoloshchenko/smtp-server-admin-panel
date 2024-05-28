<script setup>
import { onMounted } from 'vue'
import { useMainStore } from '@/stores/main'
import { useRouter } from 'vue-router'
import {
  mdiAccountMultiple,
  mdiChartTimelineVariant,
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'

const mainStore = useMainStore()

const router = useRouter()

onMounted(() => {
  if(mainStore.token == "") router.push('/')
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main>
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiAccountMultiple"
          :number="mainStore.users.length"
          label="Users"
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
