<script setup>
import MainFrame from '../components/MainFrame.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import axios from '@/util/axios';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/auth';
import { ElMessage } from 'element-plus'
import { jwtDecode } from "jwt-decode";

const userStore = useUserStore();
const auth = useAuthStore();
const router = useRouter();
const dialogVisible = ref(false)
const logoutdialogVisible = ref(false)
const loginForm = ref({
  username: '',
  password: ''
})

const registerDialogVisible = ref(false)
const registerForm = ref({
  username: '',
  password: ''
})

async function handleLogin() {
    try {
        if (!loginForm.value.username || !loginForm.value.password) {
          ElMessage({
            message: 'Sorry, username or password can not be empty!',
            type: 'error',
          })
          return;
        }
        const body = {
          name: loginForm.value.username,
          password: loginForm.value.password
        };
        const response = await axios.post('/api/user/login', body);
        const access_token = response.access_token;
        auth.setToken(access_token);
        const decoded = jwtDecode(access_token);
        const userStore = useUserStore();
        const username = decoded.name;
        userStore.setUser(username);
        const isAdmin = decoded.isAdmin;
        userStore.setAdmin(isAdmin);
        dialogVisible.value = false
        loginForm.value.username = ""
        loginForm.value.password = ""
        ElMessage({
          message: 'Congrats, Login successfully!',
          type: 'success',
        })
        window.location.reload();
    } catch (error) {
        console.error('Failed to login:', error);
        ElMessage({
          message: 'Sorry, Login failed!',
          type: 'error',
        })
    }
}

async function handleRegister() {
    try {
      if (!registerForm.value.username || !registerForm.value.password) {
          ElMessage({
            message: 'Sorry, username or password can not be empty!',
            type: 'error',
          })
          return;
        }
        const body = {
          name: registerForm.value.username,
          password: registerForm.value.password
        };
        const response = await axios.post('/api/user/register', body);
        registerDialogVisible.value = false
        registerForm.value.username = ""
        registerForm.value.password = ""
        ElMessage({
          message: 'Congrats, Register successfully!',
          type: 'success',
        })
    } catch (error) {
        console.error('Failed to register:', error);
        ElMessage({
          message: 'Sorry, Register failed!',
          type: 'error',
        })
    }
}

function goToNewPost() {
  router.push({ name: 'newPost' });
}

function userLogout() {
  auth.clearToken();
  userStore.clearUser();
  userStore.clearAdmin();
  logoutdialogVisible.value = false
  ElMessage({
    message: 'Logout successfully!',
    type: 'success',
  })
  window.location.reload();
  router.push({ name: 'index' });
}

function goToStatistics() {
  router.push({ name: 'statistics' });
}
</script>

<template>
  <div class="index-button">
    <span class="head-title">
      XTwitter-Studio
    </span>
    <span>
      <span v-if="userStore.isUsernameAvailable" class="welcomeSpan">Welcome, {{ userStore.username }}</span>
      <span v-if="!userStore.isUsernameAvailable" class="welcomeSpan">Hello, please login first</span>
      <el-button v-if="userStore.isUsernameAvailable" type="primary" circle @click="goToNewPost"><el-icon><Edit /></el-icon></el-button>
      <el-button v-if="!userStore.isUsernameAvailable" type="primary" @click="dialogVisible = true">Login</el-button>
      <el-button v-if="!userStore.isUsernameAvailable" type="success" @click="registerDialogVisible = true">Register</el-button>
      <el-button v-if="userStore.isUsernameAvailable" @click="logoutdialogVisible = true" type="danger" >Logout</el-button>
      <el-button v-if="userStore.isAdminAvailable" @click="goToStatistics" type="warning" >Statistics</el-button>
      <el-dialog
        v-model="logoutdialogVisible"
        title="Tips"
        width="500"
        :before-close="handleClose"
      >
        <span>Do you want to logout ?</span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="logoutdialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="userLogout">
              Confirm
            </el-button>
          </div>
        </template>
      </el-dialog>
    </span>
  </div>
  <el-dialog
    title="Login"
    v-model="dialogVisible"
    width="30%"
    style="border-radius: 10px;"
  >
    <el-form :model="loginForm">
      <el-form-item label="username">
        <el-input v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item >
        <div class="login-dialog-button">
          <el-button type="primary" @click="handleLogin" style="margin-right: 5%;">Login</el-button>
          <el-button @click="dialogVisible = false">Cancel</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    title="Register"
    v-model="registerDialogVisible"
    width="30%"
    style="border-radius: 10px;"
  >
    <el-form :model="registerForm">
      <el-form-item label="username">
        <el-input v-model="registerForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="password">
        <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item >
        <div class="login-dialog-button">
          <el-button type="primary" @click="handleRegister" style="margin-right: 5%;">Register</el-button>
          <el-button @click="registerDialogVisible = false">Cancel</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
  <MainFrame />
</template>

<style scoped>
.index-button{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1%;
}
.head-title{
  font-size: 28px;
  font-weight: bolder;
}
.login-dialog-button{
  display: flex;
  justify-content: center;
  width: 100%;
}
.welcomeSpan{
  margin-right: 10px;
  font-weight: bolder;
}
</style>