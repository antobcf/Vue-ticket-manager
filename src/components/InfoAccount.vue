<template>
    <div>
        <div class="user-info">
            <div class="title"><h3>Account info</h3></div>
            <table class="info-table">
                <tr>
                    <td class="line">Username</td>
                    <td class="line2">{{username}}</td>
                </tr>
                <tr>
                    <td class="line">Email</td>
                    <td class="line2">{{email}}</td>
                </tr>
                <tr>
                    <td class="line">First name</td>
                    <td class="line2">{{firstname}}</td>
                </tr>
                <tr>
                    <td class="line">Last name</td>
                    <td class="line2">{{lastname}}</td>
                </tr>
                <tr>
                    <td class="line">Role</td>
                    <td class="line2">{{role}}</td>
                </tr>
            </table>
            
            
        </div>

        <div v-if="role == 'admin'" id="buttons">
            <button @click="showListUsers" class="users">List users</button>
            <button @click="showListAssets" class="assets">Assets</button>
        </div>
        <button @click="showForm" class="new">{{buttonText}}</button>
        <div id="formTicket" style="display: none;">
            <form @submit.prevent="postData" method="post" id="newTicket">
                <div id="left-area">
                    <div class="form-group">
                        <input id="date-input" type="date" name="openDate" v-model="myDate" class="form-control" readonly>
                    </div>
                    <div class="form-group">
                        <input id="username-input" type="text" name="username" v-model="username" class="form-controll" readonly>
                    </div>
                    <div class="form-group">
                        <select id="select" v-model="selected.asset" name="asset" class="form-control">
                            <option value="" disabled selected>Select asset</option>
                            <option v-for="asset in assets" v-bind:key="asset.asset_id">
                                {{asset.id}}
                            </option>
                        </select><br>
                        <span id="span-span" v-if="!$v.selected.asset.required && $v.selected.asset.$dirty" class="text-danger">Asset is required!</span>
                    </div>
                </div>
                <div class="form-group">
                    <textarea id="text-area" name="description" v-model="newDescription" cols="30" rows="5" class="form-control" placeholder="Description of the problem..."></textarea>
                    <span v-if="!$v.newDescription.required && $v.newDescription.$dirty" class="text-danger">Description is required!</span>
                </div>
                <div class="form-group">
                    <input type="text" name="status" v-model="newStatus" class="form-controll" style="display:none">
                </div>
                
                
                <button id="confim-button" type="submit">Confirm</button>
            </form>
        </div>

        <div class="tickets">
            <table id="ticket-table">
                <tr>
                    <th class="th-space">ID</th>
                    <th class="th-space">Date</th>
                    <th class="th-space">Asset ID</th>
                    <th class="th-space">Problem</th>
                    <th class="th-space">Status</th>
                    <th class="th-space">Maintainer</th>
                    <th class="th-space">Email maintainer</th>
                    <th></th>
                </tr>
                <tr v-for="(ticket, index) in tickets" v-bind:key="ticket.ticket_id">
                    <td id="id-td">{{ticket.ticket_id}}</td>
                    <td id="id-date">{{ticket.openDate | formatDate }}</td>
                    <td id="id-asset">{{ticket.asset_id}}</td>
                    <td id="id-desc">{{ticket.description}}</td>
                    <td id="id-status">{{ticket.status}}</td>
                    <td id="id-main">
                        <div v-if="role == 'admin' && ticket.status=='pending confirmation' && ticket.maintainer == null" id="chooseMaintainer">
                            <select v-model="selected[index]" name="maintainer" class="form-control" id="selectMaintainer">
                                <option value="" disabled selected>Select maintainer</option>
                                <option v-for="maintainer in maintainers" v-bind:key="maintainer.username">{{maintainer.username}}</option>
                            </select>
                        </div>
                        <div v-else id="showMaintainer">
                            <div v-if="ticket.maintainer == null" class="main">to be defined</div>
                            <div v-else class="main">{{ticket.maintainer}}</div> 
                        </div>
                    </td>
                    <td id="id-email">
                        <div v-if="ticket.maintainer == null" class="main">to be defined</div>
                        <div v-else class="main">{{ticket.mainEmail}}</div> 
                    </td>
                    <td>
                        <div v-if="role == 'admin' && ticket.status == 'pending confirmation'" id="confirmButton"><button class="button-table" type="submit" @click="editTicket(index)">{{confirmButton}}</button></div>
                        <div v-if="role == 'admin' && ticket.status != 'work done'" id="deleteButton"><button @click="deleteTicket(index)">Reject ticket</button></div>
                        <div v-if="role == 'maintainer' && (ticket.status == 'assigned' || ticket.status == 'work in progress')" id="accepetWork"><button @click="editTicketMain(index)">Next phase status</button></div>
                        <div v-if="role == 'admin' && ticket.status =='work done'" id="closeStatus"><button @click="closeButton(index)">Close ticket</button></div>
                    </td>
                
                </tr>
            </table>

            <button @click="logout" class="logout">Logout</button>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'   
import axios from 'axios'
import VueAxios from 'vue-axios' 
import Vuelidate from 'vuelidate'
import {required} from 'vuelidate/lib/validators'

import '../assets/style/components/InfoAccount.css'

Vue.use(VueAxios, axios)
Vue.use(Vuelidate)

export default {
    name: "InfoAccount",
    data() {
        return {
            username: '',
            password:'',
            firstname:'',
            lastname:'',
            email:'',
            role:'',
            userEmail:'',
            emailMaintainer: '',
            tickets: [],
            myDate : new Date().toISOString().slice(0,10),
            buttonText: 'Create new ticket',
            confirmButton: 'Accept ticket',
            newStatus: 'pending confirmation',
            newDescription: '',
            assets: [],
            maintainers: [],
            selected: {
                asset: '',
                maintainer: ''
            },
            buttonView: '',
            maintainerButton: 'Accept work',
            inputM: []
        }
    },
    validations: {
        selected: {
            asset: {required},
            maintainer: {required},
            selected: {required}
        },
        newDescription: {required}
    },
    mounted() {
        this.getData(),
        this.getAssets(),
        this.getMaintainers()
    },
    methods: {
        getData() {
            axios.get("http://localhost:8081/user/"+this.$route.params.username, {headers: {Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJpbyIsImV4cCI6MTYyOTQ5OTY0OCwiaWF0IjoxNjI5NDYzNjQ4fQ.yEF6uAR5ObFnm4Akbr4jvBzMCTNvehArU7ybRtf5W-0"}})
            .then((response) => {
                this.username = response.data.username
                this.firstname = response.data.firstname
                this.lastname = response.data.lastname
                this.email = response.data.email
                this.role = response.data.role
                this.userEmail = response.data.userEmail
                this.mainEmail = response.data.mainEmail

                this.showTickets(this.role) 
            })
        },
        getAssets() {
            axios.get("http://localhost:8082/asset/")
            .then((response) => {
                this.assets = response.data
            })
        },
        getMaintainers() {
            axios.get("http://localhost:8081/user/role/maintainer")
            .then((response) => {
                this.maintainers = response.data
            })
        },
        showListUsers() {
            this.$router.push({path: '/listusers/'})
        },
        showListAssets() {
            this.$router.push({path: '/listassets'})
        },
        logout() {
            this.$router.push({path: '/'})
        },
        showTickets(role) {
            if(role == "admin") {
                axios.get("http://localhost:8083/ticket/admin")
                .then((response) => {
                    this.tickets = response.data
                })
            } else if(role == "employee") {
                axios.get("http://localhost:8083/ticket/employee/"+this.username)
                .then((response) => {
                    this.tickets = response.data
                })
            } else {
                axios.get("http://localhost:8083/ticket/maintainer/"+this.username)
                .then((response) => {
                    this.tickets = response.data
                })
            }
        },
        deleteTicket(index) {
            axios.post("http://localhost:8083/ticket/email/rejected/"+this.tickets[index].ticket_id)
            axios.delete("http://localhost:8083/ticket/delete/"+this.tickets[index].ticket_id)
            this.$delete(this.tickets, index)
        },
        editTicket(index) {
            // this.$v.$touch();
            if(this.selected[index] == null) {
                console.log("choose maintainer")
            } else {
                if(this.tickets[index].status == "pending confirmation") {
                    this.tickets[index].status = "assigned"
                    axios.get("http://localhost:8081/user/"+this.selected[index])
                    .then((response) => {
                        this.emailMaintainer = response.data.email
                        axios.put("http://localhost:8083/ticket/update/"+this.tickets[index].ticket_id, {status: this.tickets[index].status, maintainer: this.selected[index], mainEmail: this.emailMaintainer})
                        axios.post("http://localhost:8083/ticket/email/approved/"+this.tickets[index].ticket_id)
                        axios.post("http://localhost:8083/ticket/email/assigned/"+this.emailMaintainer)
                        axios.put("http://localhost:8082/asset/update/"+this.tickets[index].asset_id, {status: "out of service"})
                    })
                    this.getData()
                    this.getData()
                } 
            }
        },
        editTicketMain(index) {
            if(this.tickets[index].status == "assigned") {
                this.tickets[index].status = "work in progress"
                axios.put("http://localhost:8083/ticket/update/"+this.tickets[index].ticket_id, {status: this.tickets[index].status})
                this.maintainerButton = "Work finished"
            } else if(this.tickets[index].status == "work in progress") {
                    this.tickets[index].status = "work done"
                    axios.put("http://localhost:8083/ticket/update/"+this.tickets[index].ticket_id, {status: this.tickets[index].status})
                    
                    this.getData();
            }
        },
        closeButton(index) {
            this.tickets[index].status = "closed"
            axios.put("http://localhost:8083/ticket/update/"+this.tickets[index].ticket_id, {status: this.tickets[index].status})
            axios.put("http://localhost:8082/asset/update/"+this.tickets[index].asset_id, {status: "operating"})
            this.getData();
            axios.post("http://localhost:8083/ticket/email/closed/"+this.tickets[index].ticket_id)
        },
        showForm() {
            var x = document.getElementById("formTicket")
            if(x.style.display == "none") {
                x.style.display = "block"
                this.buttonText = "Close"
            } else {
                x.style.display = "none"
                this.buttonText = "Create new ticket"
            }
        },
        postData() {
            this.$v.$touch();
            if(this.selected.asset && this.newDescription) {
                axios.post("http://localhost:8083/ticket/new", {description: this.newDescription, openDate: this.myDate, status: this.newStatus, username: this.username, asset_id: this.selected.asset, userEmail: this.email},{headers:{'Content-Type' : 'application/json;charset=utf-8'}})
                var x = document.getElementById("formTicket")
                x.style.display = "none"  
                this.buttonText = "Create new ticket"

                this.newDescription = ''
                this.selected.asset = ''
                this.$v.$reset();

                this.getData()
                this.getData()
                axios.post("http://localhost:8083/ticket/email/newTicket/"+this.email)
            }
        }
    }
}
</script>

<style>
#maintainerShow {
    display: inline-block;
}

#showMaintainer {
    display: inline-table;
}

.main {
    display: inline-table;
}
</style>