<template>
    <div>
        <div>
            <button @click="openAssetForm" id="new-asset">{{buttonText}}</button>
            <div id="formAsset" style="display: none;">
                <form @submit.prevent="postData" method="post" id="newAsset">
                    <div class="form-group">
                        <input id="name-asset" type="text" name="name" placeholder="Name asset" v-model="newName" class="form-control"><br>
                        <span v-if="!$v.newName.required && $v.newName.$dirty" class="text-danger">Name asset is required!</span>
                    </div>
                    <div class="form-group">
                        <select id="select-status" v-model="newStatus" class="form-control">
                            <option value="" disabled selected>Select status</option>
                            <option value="operating">Operative</option>
                            <option value="out of service">Out of service</option>
                        </select><br>
                        <span v-if="!$v.newStatus.required && $v.newStatus.$dirty" class="text-danger">Status asset is required!</span>
                    </div>
                    <button id="confirm-asset" type="submit">Confirm</button>
                </form>
            </div>
        </div>

        <div id="assetsList">
            <table id="table-assets">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                </tr>
                <tr v-for="(asset, index) in assets" v-bind:key="asset.asset_id">
                    <td>{{asset.id}}</td>
                    <td>{{asset.name}}</td>
                    <td>{{asset.status}}</td>
                    <td><button id="delete-asset" @click="deleteAsset(index)">Delete asset</button></td>
                </tr>
            </table>
        </div>
        <button id="back-asset" @click="backButton">Back</button>
    </div>
</template>

<script>
import Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'  
import Vuelidate from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

import '../assets/style/components/ListAssets.css'

Vue.use(VueAxios, axios)
Vue.use(Vuelidate)

export default {
    name: 'ListAssets',
    data() {
        return {
            assets: [],
            newName: '',
            newStatus: '',
            buttonText: 'Create new asset'
        }
    },
    validations: {
        newName: {required},
        newStatus: {required}
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            axios.get("http://localhost:8082/asset/")
            .then((response) => {
                this.assets = response.data
            })
        },
        deleteAsset(index) {
            axios.delete("http://localhost:8082/asset/delete/"+this.assets[index].id)
            this.$delete(this.assets, index)
        },
        editAsset(index) {
            if(this.assets[index].status == "operating") {
                this.assets[index].status = "out of service"
            } else {
                this.assets[index].status = "operating"
            }
            axios.put("http://localhost:8082/asset/update/"+this.assets[index].id, {status: this.assets[index].status})
        },
        openAssetForm() {
            var x = document.getElementById("formAsset")
            if(x.style.display == "none") {
                x.style.display = "block"
                this.buttonText = "Close"
            } else {
                x.style.display = "none"
                this.buttonText = "Crea new asset"
            }
        },
        postData() {
            this.$v.$touch();
            if(this.newName && this.newStatus) {
                axios.post("http://localhost:8082/asset/new", {name: this.newName, status: this.newStatus},{headers:{'Content-Type' : 'application/json;charset=utf-8'}})
                var x = document.getElementById("formAsset")
                x.style.display = "none"   
                
                this.getData()
                this.getData() //why??

                this.newName = ''
                this.newStatus = ''
                this.buttonText = 'Create new asset'
                this.$v.$reset();
            } 
        },
        backButton() {
            this.$router.go(-1)
        }
    }
}
</script>

