<template>
    <div>
        <h1>Homepage</h1>
        <form @submit.prevent="checkCredentials">
            <div class="form-group">
                    <input id="login-form" type="text" name="username" placeholder="Username" v-model="username">
                    <span v-if="!$v.username.required && $v.username.$dirty" class="text-danger">Username is required!</span>
            </div>
            <div class="form-group">
                    <input id="login-form" type="password" name="password" placeholder="Password" v-model="password">
                    <span v-if="!$v.password.required && $v.password.$dirty" class="text-danger">Password is required!</span>
            </div>
            <button type="submit" class="login">Login</button>
        </form>
        
        <button @click="$router.push('Registration')" class="signup">Sign Up</button>
    </div>
</template>

<script>
import Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'   
import Vuelidate from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

import '../assets/style/components/Homepage.css';

Vue.use(Vuelidate)
Vue.use(VueAxios, axios)

export default {
    name: 'Homepage',
    data() {
        return {
            username: '',
            password: '',
            credentials: []
        }
    },
    validations: {
        username: {required},
        password: {required}
    },
    methods:{
        checkCredentials(){
            this.$v.$touch();
            
            // axios.post("http://localhost:8081/user/authenticate",{username: this.username, password: this.password})
            // .then((response) => {
            //     if(response.data) {
            //         console.log(response.data)
            //         this.$router.push('/account/'+this.username)
            //     }
            // })
          if(this.username && this.password) {
                axios.get("http://localhost:8081/user/"+this.username)
                .then((response) => {
                    this.credentials=response.data
                    if(this.password == this.credentials.password) {
                        this.$router.push('/account/'+this.username)
                    }
                })                
            }
        }
    }
}
</script>
