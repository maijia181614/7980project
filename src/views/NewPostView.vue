<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { ElMessage } from 'element-plus'
import axios from '@/util/axios';

const router = useRouter();
const postText = ref("")
const userStore = useUserStore();

function goToIndex() {
  router.push({ name: 'index' });
}

async function newPost(message) {
    try {
       if (!postText.value) {
            ElMessage({
            message: 'Sorry, postText can not be empty!',
            type: 'error',
            })
            return;
        }
      if (userStore.isUsernameAvailable) {
        const body = {
            message: message,
        };
        const response = await axios.post('/api/message/post', body);
        ElMessage({
          message: 'Congrats, Post successfully!',
          type: 'success',
        })
        router.push({ name: 'index' });
        }else{
            ElMessage({
            message: 'Sorry, please login first!',
            type: 'error',
            })
        }
    } catch (error) {
        console.error('Failed to post:', error);
        ElMessage({
          message: 'Sorry, Post failed!',
          type: 'error',
        })
    }
}
</script>

<template>
  <div class="new-post-div">
    <el-card>
        <template #header>
        <div class="card-header">
            <span>New Post</span>
        </div>
        </template>
        <el-input
            v-model="postText"
            style="width: 100%; height: 100%;"
            :rows="5"
            type="textarea"
            placeholder="Please input"
        />
        <template #footer>
            <span class="new-post-button-group">
                <span>
                    <el-button type="primary" @click="newPost(postText)">Post</el-button>
                    <el-button @click="goToIndex">Cancel</el-button>
                </span>
            </span>
        </template>
    </el-card>
  </div>
  
</template>

<style scoped>
.new-post-button-group{
    display: flex;
    justify-content: space-between;
}
</style>