<script>
import { api } from '@/api/config';
import Card from './Card.vue';
import UsersList from './UsersList.vue';
import { showError,showSuccess } from '@/utils';
export default{
    data: function(){
        return{
            isMenuVisible: false,
            isVisibleDialog: false,
            isVisibleHotels: true,
            isVisibleUsers: false,
            hotels: [],
            isAdmin: localStorage.getItem("role") === "admin",
            hotel: {
                name: "",
                location: ""
            }
        }
    },
    components: {
        Card,
        UsersList
    },
    methods: {
        toggleMenu: function(){
            this.isMenuVisible = !this.isMenuVisible;
        },
        getHotels: async function(){
            try {
                if(!this.isVisibleHotels){
                    this.setChildsVisibility();
                }
                const token = localStorage.getItem("token");
                const response = await api.get('/api/hotels', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.hotels = response.data;        
            } catch (error) {
                console.log(error);     
                showError(error.response.data.message);           
            }
        }, 
        setIsVisibleDialog: function(){
            this.isVisibleDialog = !this.isVisibleDialog;
        },
        createHotel: async function(){
            try {
                const token = localStorage.getItem("token");
                const response = await api.post('/api/hotels', {
                    name: this.hotel.name,
                    location: this.hotel.location
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.hotels.push(response.data);
                this.isVisibleDialog = false;
                this.hotel.name = "";
                this.hotel.location = "";
                showSuccess(response.data.message);
            } catch (error) {
                console.log(error);
                showError(error.response.data.message);
            }
        },
        logout: function(){
            this.$emit("logout");
        },
        setChildsVisibility: function(childName){
            if(childName === "users"){
                this.isVisibleHotels = false;
                this.isVisibleUsers = true;
            }else{
                this.isVisibleUsers = false;
                this.isVisibleHotels = true;
            }
        },
    },
    mounted: function(){
        this.getHotels();
    }
}
</script>

<template>
    <header class="h-20 bg-black fixed w-full top-0">
        <div class="container">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <button class="bg-black hover:bg-gray text-white" @click="getHotels">Hoteles</button>
                </li>
                <li class="nav-item" v-if="isAdmin">
                    <button class="bg-black hover:bg-gray text-white" @click="setChildsVisibility('users')">Lista de usuarios</button>
                </li>
                <li class="nav-item" v-if="isAdmin">
                    <button class="bg-black hover:bg-gray text-white" @click="setIsVisibleDialog">Crear hotel</button>
                </li>
                <li class="nav-item" v-if="!isAdmin">
                    <button class="bg-black hover:bg-gray text-white" @click="">Lista de reservas</button>
                </li>
                <li class="nav-item">
                    <button class=" absolute right-10 bg-black hover:bg-black text-white py-2 px-4" @click="toggleMenu">
                        <img src="../assets/user.png" alt="user" />
                    </button>
                    <div v-if="isMenuVisible" class="absolute right-10 top-14 mt-2 w-48 bg-white rounded-md shadow-lg">
                        <ul>
                            <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer" @click="navigateToProfile">Perfil</li>
                            <li class="px-4 py-2 hover:bg-gray-200 cursor-pointer" @click="logout">Cerrar sesión</li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </header>
    <div v-if="isVisibleHotels" class="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card v-for="hotel in hotels" :key="hotel.id" :name="hotel.name" :location="hotel.location" :id="hotel.id" @updateHotel="getHotels"/>
    </div>
    <div v-if="isVisibleDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center" >
        <div class="bg-white p-8 rounded-lg w-1/3">
            <h1 class="text-2xl font-bold">Crear hotel</h1>
            <form @submit.prevent="createHotel">
                <input type="text" placeholder="Nombre" v-model="hotel.name" class="w-full p-2 border border-gray-300 rounded-lg mt-4"/>
                <input type="text" placeholder="Ubicación" v-model="hotel.location" class="w-full p-2 border border-gray-300 rounded-lg mt-4"/>
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Crear</button>
                <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" @click="setIsVisibleDialog">Cancelar</button>
            </form>
        </div>
    </div>
    <div v-if="isVisibleUsers">
        <UsersList />
    </div>
</template>


<style>
    
    .navbar {
        color: white;
        padding: 0;
        height: 6vh;
    }

    .container {
        justify-content: space-between;
        align-items: center;
    }

    .navbar-brand {
        color: white;
        text-decoration: none;
    }

    .navbar-nav {
        display: flex;
        list-style: none;
    }

    .nav-item {
        margin: 20px;
    }

    .nav-link {
        color: white;
        text-decoration: none;
    }

    .nav-link:hover {
        text-decoration: underline;
    }

</style>