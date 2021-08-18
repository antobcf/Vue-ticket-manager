<template>
    <div>
        <h3>Registration</h3>
        <form @submit.prevent="postData" method="post">
            <div class="form-group">
                <input type="text" name="username" placeholder="username" v-model="username"  class="form-control">
                <span v-if="!$v.username.required && $v.username.$dirty" class="text-danger">Username is required!</span><br><br>
            </div>
            <div class="form-group">
                <input type="password" name="password" placeholder="password" v-model="password" class="form-control">
                <span v-if="!$v.password.required && $v.password.$dirty" class="text-danger">Password is required!</span><br><br>
            </div>
            <div class="form-group">
                <input type="text" name="firstname" placeholder="firstname" v-model="firstname" class="form-control">
                <span v-if="!$v.firstname.required && $v.firstname.$dirty" class="text-danger">Firstname is required!</span><br><br>
            </div>
            <div class="form-group">
                <input type="text" name="lastname" placeholder="lastname" v-model="lastname" class="form-control">
                <span v-if="!$v.lastname.required && $v.lastname.$dirty" class="text-danger">Lastname is required!</span><br><br>
            </div>
            <div class="form-group">
                <input type="email" name="email" placeholder="email" v-model="email" class="form-control">
                <span v-if="(!$v.email.required || !$v.email.email) && $v.email.$dirty" class="text-danger">Valid email is required!</span><br><br>
            </div>
            <div class="form-group">
                <select v-model="role" class="form-control">
                    <option value="employee">Employee</option>
                    <option value="admin">Administrator</option>
                    <option value="maintainer">Maintainer</option>
                </select>
                <span v-if="!$v.role.required && $v.role.$dirty" class="text-danger">Role is required!</span><br><br>
            </div>
            
            
            <button type="submit">Sign Up</button><br>
            
            <router-link to="/" tag="button">Back</router-link>
        </form>    


    </div>
</template>

<script>
import Vue from 'vue'   
import axios from 'axios'
import VueAxios from 'vue-axios' 
import Vuelidate from 'vuelidate'
import {email, required} from 'vuelidate/lib/validators'

Vue.use(VueAxios, axios)
Vue.use(Vuelidate)

export default {
    name: "RegistrationForm",
    data() {
        return {   
            
                username:'',
                password:'',
                firstname:'',
                lastname:'',
                email:'',
                role:''
            
        }        
    },
    validations: {
        username: {required},
        password: {required},
        firstname: {required},
        lastname: {required},
        email: {required, email},
        role: {required}
    },
    methods:{
        postData() {
            this.$v.$touch();
            if(this.username && this.password && this.firstname && this.lastname && this.email && this.role) {
                axios.post("http://localhost:8081/user/register", { username: this.username, password: this.password, firstname: this.firstname, lastname: this.lastname, email: this.email, role: this.role} , {headers:{'Content-Type' : 'application/json;charset=utf-8'}})
                .then( response => {
                    console.log(response.data)
                })
                .catch(error => {console.error(error.response.data) })
                console.log("POST effettutato")
                this.$router.push('/redirecting')
            }
        },
        
    }
}
</script>

