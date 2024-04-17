<script setup>
    import { reactive, ref, onMounted, computed  } from 'vue';
    import axios from '@/util/axios';
    import { useUserStore } from '@/stores/userStore';
    import { useAuthStore } from '@/stores/auth';
    import { ElMessage } from 'element-plus'
    const userStore = useUserStore();
    const auth = useAuthStore();
    const username = computed(() => userStore.username);
    const deletedialogVisible = ref(false)
    const editdialogVisible = ref(false)
    const currentMessageId = ref(null);
    const currentEditPostValue = ref("");


    const posts = reactive([
        { messageId: 1, title: "First Post", message: "This is the first example post", user: "User1", createdAt: "2024-04-01" },
        { messageId: 2, title: "Second Post", message: "This is the second example post", user: "User2", createdAt: "2024-04-02" },
        { messageId: 3, title: " Post3", message: "This is the post", user: "User3", createdAt: "2024-04-02" },
        { messageId: 4, title: " Post4", message: "This is the post", user: "User4", createdAt: "2024-04-02" },
        { messageId: 5, title: " Post5", message: "This is the post", user: "User5", createdAt: "2024-04-02" },
    ]);

    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalItems = ref(10);

    async function fetchData(page = 1) {
        currentPage.value = page;
        try {
            const response = await axios.get(`/api/message/all?page=${page}&pageSize=${pageSize.value}`);
            totalItems.value = response.total;
            posts.splice(0, posts.length);
            response.data.forEach(post => {
                posts.push(post);
            });
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    function handlePageChange(newPage) {
        if(userStore.isUsernameAvailable){
            if(search_content.value == ""){
                fetchData(newPage);
            }else{
                searchData(search_content.value, newPage);
            }
            
        }else{
            ElMessage({
            message: 'Sorry, please login first!',
            type: 'error',
          })
        }
    }

    const search_content = ref("");

    async function searchData(keyword, page) {
        currentPage.value = page;
        try {
            const response = await axios.get(`/api/message/search?query=${keyword}&page=${page}&pageSize=${pageSize.value}`);
            totalItems.value = response.total;
            posts.splice(0, posts.length);
            response.data.forEach(post => {
                posts.push(post);
            });
            ElMessage({
                message: 'Congrats, Search successfully!',
                type: 'success',
            })
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    function handleSearch(newPage = 1) {
        if(userStore.isUsernameAvailable){
            if(search_content.value == ""){
                fetchData();
            }else{
                searchData(search_content.value, newPage);
            }
        }else{
            ElMessage({
            message: 'Sorry, please login first!',
            type: 'error',
          })
        }
    }

    const formatDateToSeconds = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    async function deletePost() {
        try {
            const body = {
                messageId: currentMessageId.value,
            };
            const response = await axios.delete('/api/message/delete', { data: body });
            ElMessage({
            message: 'Congrats, Delete post successfully!',
            type: 'success',
            })
            deletedialogVisible.value = false;
            currentMessageId.value = null;
            handleSearch()
        } catch (error) {
            console.error('Failed to delete data:', error);
        }
    }

    function handleDelete(messageId) {
        if(userStore.isUsernameAvailable){
            currentMessageId.value = messageId;
            deletedialogVisible.value = true;
        }else{
            ElMessage({
            message: 'Sorry, please login first!',
            type: 'error',
          })
        }
    }

    function cancelDelete() {
        deletedialogVisible.value = false;
        currentMessageId.value = null;
    }

    function handleEdit(messageId, message) {
        if(userStore.isUsernameAvailable){
            currentMessageId.value = messageId;
            currentEditPostValue.value = message;
            editdialogVisible.value = true;
        }else{
            ElMessage({
            message: 'Sorry, please login first!',
            type: 'error',
          })
        }
    }

    function cancelEdit() {
        editdialogVisible.value = false;
        currentMessageId.value = null;
    }

    async function editPost() {
        try {
            const body = {
                messageId: currentMessageId.value,
                message: currentEditPostValue.value,
            };
            const response = await axios.put('/api/message/update', { data: body });
            ElMessage({
            message: 'Congrats, Edit post successfully!',
            type: 'success',
            })
            editdialogVisible.value = false;
            currentMessageId.value = null;
            currentEditPostValue.value = null;
            handleSearch()
        } catch (error) {
            console.error('Failed to edit data:', error);
        }
    }

    async function handleAnalysis(message) {
        if(userStore.isUsernameAvailable){
            const body = {
                message: message,
            };
            const response = await axios.post('/api/message/analyze', body);
            if(response[0].sentiment == "positive"){
                ElMessage({
                    message: 'Positive emotions!',
                    type: 'success',
                })
            }
            if(response[0].sentiment == "neutral"){
                ElMessage({
                    message: 'Neutral emotions!',
                    type: 'info',
                })
            }
            if(response[0].sentiment == "mixed"){
                ElMessage({
                    message: 'Mixed emotions!',
                    type: 'info',
                })
            }
            if(response[0].sentiment == "negative"){
                ElMessage({
                    message: 'Negative emotions!',
                    type: 'error',
                })
            }
            
        }else{
            ElMessage({
            message: 'Sorry, please login first!',
            type: 'error',
          })
        }
    }

    onMounted(() => {
        if(userStore.isUsernameAvailable){
            fetchData();
        }
    });
</script>

<template>
    <div class="searchPostFrame">
        <el-card class="searchPostFrameCard">
            <div class="search-div">
                <el-input
                    placeholder="Please input"
                    class="input-with-button"
                    size="large"
                    v-model="search_content"
                >
                    <template #prepend>
                        <el-icon><Search /></el-icon>
                    </template>
                </el-input>
                <el-button type="primary" size="large" @click="handleSearch()">Search</el-button>
            </div>
        </el-card>
    </div>

    <div class="mainFrame">
        <el-card class="mainFrameCard">
            <el-scrollbar>
                <el-card v-for="post in posts"  class="userContent">
                    <template #header>
                    <div class="card-header post-header">
                        <el-avatar
                            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                        />
                        <span class="post-user-name">{{ post.user }}</span>
                    </div>
                    </template>
                    <p>{{ post.message }}</p>
                    <div class="post-time-div">
                        <span class="post-time">{{ formatDateToSeconds(post.createdAt) }}</span>
                        <span class="post-time" v-if="post.modifiedAt">ModifiedAt:{{ formatDateToSeconds(post.modifiedAt) }}</span>
                    </div>
                    <template #footer>
                        <el-button type="primary" v-if="username == post.user" @click="handleEdit(post._id, post.message)">Edit</el-button>
                        <el-button type="danger" v-if="username == post.user" @click="handleDelete(post._id)">Delete</el-button>
                        <el-button type="success" @click="handleAnalysis(post.message)">AI Sentiment Analysis</el-button>
                    </template>
                </el-card>
                <el-pagination
                    class = "post-pagination"
                    background
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="totalItems"
                    layout="prev, pager, next, jumper"
                    @current-change="handlePageChange"
                />
            </el-scrollbar>
        </el-card>
        <el-dialog
            v-model="deletedialogVisible"
            title="Tips"
            width="500"
            :before-close="handleClose"
        >
            <span>Do you want to delete this post ?</span>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="cancelDelete">Cancel</el-button>
                <el-button type="primary" @click="deletePost">
                Confirm
                </el-button>
            </div>
            </template>
        </el-dialog>
        <el-dialog
            v-model="editdialogVisible"
            title="Tips"
            width="500"
            :before-close="handleClose"
        >
            <el-form :model="currentEditPostValue">
                <el-form-item label="content">
                    <el-input
                        v-model="currentEditPostValue"
                        style="width: 100%; height: 100%;"
                        :rows="5"
                        type="textarea"
                        placeholder="Please input"
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelEdit">Cancel</el-button>
                    <el-button type="primary" @click="editPost">
                    Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.userContent {
  margin-left: 5%;
  margin-right: 5%;
  border-radius: 15px; 
  transition: box-shadow 0.3s;
  margin-bottom: 1%;
}
.userContent:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
}
.mainFrameCard{
    height: 100%;
    border-radius: 10px; 
    transition: box-shadow 0.3s;
    /* overflow: auto; */
}
::v-deep .mainFrameCard .el-card__body {
    height: 100%;
}
.mainFrameCard:hover{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
}
.mainFrame{
    height: 85% ;
}
.post-header{
    display: flex;
    align-items: center; 
}
.post-user-name{
    margin-left: 1%;
    font-weight: bold;
    font-size: large;
}
.post-time{
    color: #73767a;
    font-weight: 500;
}
.post-pagination{
    margin-left: 10%;
    margin-right: 10%;
    display: flex;
    justify-content: center;
}

.searchPostFrameCard{
    height: 100%;
    border-radius: 10px; 
    transition: box-shadow 0.3s;
    /* overflow: auto; */
}
::v-deep .searchPostFrameCard .el-card__body {
    height: 100%;
    padding: 1%;
}
.searchPostFrameCard:hover{
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2); 
}
.searchPostFrame{
    height: 10% ;
    margin-bottom: 1%;
}
.search-div{
    display: flex;
    align-items: center;
    padding: 3px;
    width: 100%; 
}
.input-with-button {
    flex-grow: 1; 
    margin-right: 10px; 
}
.post-time-div{
    display: flex;
    justify-content: space-between;
}
</style>