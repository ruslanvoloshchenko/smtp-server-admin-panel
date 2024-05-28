import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router'

const API_URL = "http://director.omnimailhost.net:8000/api/v1"
// const API_URL = "http://localhost:8000/api/v1"

export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe')
  const userEmail = ref('doe.doe.doe@example.com')
  const userId = ref(0)

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
  const token = ref("")

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
    const headers = {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json', // Example of another header
    };
    axios.get(`${API_URL}/users`, { headers })
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
    const headers = {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json', // Example of another header
    };
    axios
      .delete(`${API_URL}/users/${id}`, { headers })
      .then((result) => {
        fetchUsers()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function createUser(data) {
    const headers = {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json', // Example of another header
    };
    axios
      .post(`${API_URL}/users`, data, { headers} )
      .then((result) => {
        fetchUsers()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function getUser(id, cb) {
    const headers = {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json', // Example of another header
    };
    axios
      .get(`${API_URL}/users/${id}`, { headers })
      .then((result) => {
        cb(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function updateUser(id, data) {
    const headers = {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json', // Example of another header
    };
    axios
      .patch(`${API_URL}/users/${id}`, data, { headers })
      .then((result) => {
        fetchUsers()
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function login(data, cb) {
    axios
      .post(`${API_URL}/login`, data)
      .then(({ data }) => {
        token.value = data.token
        userId.value = data.id
        setUser({ name: data.username, email: data.email })
        cb(data)
      })
      .catch((error) => {
        alert("Wrong Information: " + error.message)
      })
  }

  function logout(state) {
    if(state) {
      token.value = ""
      router.push('/')
    }
  }

  function updateAdminProfile(data, cb) {
    const headers = {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json', // Example of another header
    };
    axios
      .patch(`${API_URL}/roles/${userId.value}/profile`, data, { headers })
      .then((result) => {
        cb(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }


  function updateAdminPassword(data, cb) {
    const headers = {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json', // Example of another header
    };
    axios
      .patch(`${API_URL}/roles/${userId.value}/password`, data, { headers })
      .then((result) => {
        cb(result)
      })
      .catch((error) => {
        alert(error.message)
      })
  }


  return {
    token,
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    history,
    users,
    login,
    logout,
    setUser,
    getUser,
    createUser,
    deleteUser,
    updateUser,
    fetchUsers,
    fetchSampleClients,
    fetchSampleHistory,
    updateAdminProfile,
    updateAdminPassword
  }
})
