<template>
    <div>
        <div>
            <button @click="backButton">Back</button>
            <button @click="openAssetForm">{{buttonText}}</button>
            <div id="formAsset" style="display: none;">
                <form @submit.prevent="postData" method="post" id="newAsset">
                    <div class="form-group">
                        <br>
                        <input type="text" name="name" placeholder="Name asset" v-model="newName" class="form-control">
                        <span v-if="!$v.newName.required && $v.newName.$dirty" class="text-danger">Name asset is required!</span><br>
                    </div>
                    <div class="form-group">
                        <select v-model="newStatus" class="form-control">
                            <option value="" disabled selected>Select status</option>
                            <option value="operative">Operative</option>
                            <option value="notOperative">Out of order</option>
                        </select>
                        <span v-if="!$v.newStatus.required && $v.newStatus.$dirty" class="text-danger">Status asset is required!</span><br>
                    </div>
                    <button type="submit">Confirm</button><br>
                </form>
            </div>
        </div>

        <div id="assetsList">
            <ul style="list-style-type:none;" >
                <li v-for="(asset, index) in assets" v-bind:key="asset.asset_id">
                {{asset.id}} - {{asset.name}} - Status: {{asset.status}}
                <!-- <button @click="editAsset(index)">Change status</button> -->
                <button @click="deleteAsset(index)">Delete asset</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import Vue from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'  
import Vuelidate from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

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
                this.$v.$reset();
            } 
        },
        backButton() {
            this.$router.go(-1)
        }
    }
}
</script>

<style>


#assetsList {
  overflow: scroll;
  height: 50vh;
}


</style>