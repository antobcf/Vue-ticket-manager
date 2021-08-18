<template>
    <div>
        <button @click="backButton">Back</button>
        <h3>List users</h3>
        <ul style="list-style-type:none;">
            <li v-for="(user, index) in users" v-bind:key="user.username">
                {{user.username}} - {{user.firstname}} {{user.lastname}} - {{user.email}} - {{user.role}}
                <button @click="deleteAccount(index)">Delete User Account</button>
            </li>
        </ul>
    </div>
</template>

<script>
import Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'  

Vue.use(VueAxios, axios)

export default {
    name: 'ListUsers',
    data() {
        return {
            users: []
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            axios.get("http://localhost:8081/user/role/notadmin")
            .then((response) => {
                this.users = response.data
            }) 
        },
        deleteAccount(index) {
            axios.delete("http://localhost:8081/user/delete/"+this.users[index].username)
            this.$delete(this.users, index)
        },
        backButton() {
            this.$router.go(-1)
        }
    },
}
</script>
