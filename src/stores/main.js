import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = "http://localhost:8000/api/v1/users"

export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe')
  const userEmail = ref('doe.doe.doe@example.com')

  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])
  const users = ref([])

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchUsers() {
    axios.get(`${API_URL}`)
    .then((result) => {
      users.value = result?.data?.data
    })
    .catch((err) => {
      alert(err.message)
    })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function deleteUser(id) {
    axios
      .delete(`${API_URL}/${id}`)
      .then((result) => {
        console.log(result)
        fetchUsers()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function createUser(data) {
    axios
      .post(`${API_URL}`, data)
      .then((result) => {
        console.log(result)
        fetchUsers()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function getUser(id, cb) {
    axios
      .get(`${API_URL}/${id}`)
      .then((result) => {
        cb(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function updateUser(id, data) {
    axios
      .patch(`${API_URL}/${id}`, data)
      .then((result) => {
        console.log(result)
        fetchUsers()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    users,
    setUser,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    fetchUsers,
    fetchSampleClients,
    fetchSampleHistory
  }
})
