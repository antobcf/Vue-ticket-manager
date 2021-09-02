<template>
    <div>
        <h3 id="title-user">List users</h3>
        <table id="user-table">
            <tr>
                <th>Username</th>
                <th>First name</th>
                <th>Last name</th>
                <th>Email</th>
                <th>Role</th>
            </tr>
            <tr v-for="(user, index) in users" v-bind:key="user.username">
                <td>{{user.username}}</td>
                <td>{{user.firstname}}</td>
                <td>{{user.lastname}}</td>
                <td>{{user.email}}</td>
                <td>{{user.role}}</td>
                <td><button id="delete-button" @click="deleteAccount(index)">Delete user account</button></td>
            </tr>
        </table>
        <button @click="backButton" id="back-button">Back</button>
    </div>
</template>

<script>
import Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'  

import '../assets/style/components/ListUsers.css'

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
