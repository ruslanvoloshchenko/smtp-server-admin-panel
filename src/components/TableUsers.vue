<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/stores/main'
import { mdiDatabaseEdit, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'

defineProps({
  checkable: Boolean
})

const mainStore = useMainStore()

const router = useRouter()

const items = computed(() => mainStore.users)

const isModalDangerActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const checkedRows = ref([])

const selectedUser = ref({})

const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === client.id)
  }
}

const handleDelete = () => {
  if(selectedUser.value)
    mainStore.deleteUser(selectedUser.value.id)
}

const handleEdit = (user) => {
  router.push({ name: 'users.edit', params: { userId: user.id }});
}
</script>

<template>
  <div>
    <CardBoxModal
      v-model="isModalDangerActive"
      title="Are you sure?"
      button="danger"
      has-cancel
      @confirm="handleDelete"
    >
    </CardBoxModal>

    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th>Name</th>
          <th>Our Domain</th>
          <th>Real Address</th>
          <th>Mail Server</th>
          <th>Created</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in itemsPaginated" :key="user.id">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, user)" />
          <td data-label="Name">
            {{ user.username }}
          </td>
          <td data-label="Company">
            {{ user.domain }}
          </td>
          <td data-label="City">
            {{ user.to_address }}
          </td>
          <td data-label="City">
            {{ user.mail_server }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton
                color="info"
                :icon="mdiDatabaseEdit"
                small
                @click="handleEdit(user)"
              />
              <BaseButton
                color="danger"
                :icon="mdiTrashCan"
                small
                @click="(isModalDangerActive = true), (selectedUser = user)"
              />
            </BaseButtons>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
      <BaseLevel>
        <BaseButtons>
          <BaseButton
            v-for="page in pagesList"
            :key="page"
            :active="page === currentPage"
            :label="page + 1"
            :color="page === currentPage ? 'lightDark' : 'whiteDark'"
            small
            @click="currentPage = page"
          />
        </BaseButtons>
        <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      </BaseLevel>
    </div>
  </div>
</template>
