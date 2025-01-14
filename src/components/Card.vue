<template>
    <div class="w-80 m-8 bg-white border border-white-200 rounded-lg shadow dark:bg-gray-800 dark:border-white-600">
        <a href="#">
            <img class="rounded-t-lg" src="/src/assets/image-1.jpg" alt="image" />
        </a>
        <div class="p-5">
            
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ name }}</h5>
            
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ location }}</p>
            <div v-if="isAdmin" class="flex justify-end">
                <button type="button" @click="setIsVisibleDialog" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Editar</button>
                <button type="button" @click="deleteHotel" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Eliminar</button>
            </div>
        </div>
    </div>
    <div v-if="isVisibleDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center" >
        <div class="bg-white p-8 rounded-lg w-1/3">
            <h1 class="text-2xl font-bold">Actualizar información de hotel</h1>
            <form @submit.prevent="editHotel(id)">
                <input type="text" placeholder="Nombre" v-model="hotel.name" class="w-full p-2 border border-gray-300 rounded-lg mt-4" />
                <input type="text" placeholder="Ubicación" v-model="hotel.location" class="w-full p-2 border border-gray-300 rounded-lg mt-4"/>
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Actualizar</button>
                <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" @click="setIsVisibleDialog">Cancelar</button>
            </form>
        </div>
    </div>
</template>

<script>
import { api } from '@/api/config';
import { showError,showSuccess,showConfirm } from '@/utils';

export default {
    name: 'card',
    data: function(){
        return{
           isAdmin: localStorage.getItem("role") === "admin",
           hotel: {
               name: this.name,
               location: this.location
           },
           isVisibleDialog: false
        }
    },
    props: {
        id: Number,
        name: String,
        location: String
    },
    methods: {
        editHotel: async function(hotelId){
            try {
                const token = localStorage.getItem("token");               
                const response = await api.put(`/api/hotels/${hotelId}`, {
                        name: this.hotel.name,
                        location: this.hotel.location
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (response.status === 200) {
                    console.log("Hotel actualizado");
                    this.setIsVisibleDialog();
                    showSuccess(response.data.message);
                    this.$emit('updateHotel');
                }
            } catch (error) {
                console.log(error);
                showError(error.response.data.message);
            }
        },
        deleteHotel: async function(){
            let result = await showConfirm(["¿Estás seguro de eliminar este hotel?", "Eliminar", "Cancelar"]);
            if(result.isConfirmed){
                try {
                    const token = localStorage.getItem("token");
                    const response = await api.delete(`/api/hotels/${this.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.status === 200) {
                        console.log("Hotel eliminado");
                        showSuccess(response.data.message);
                        this.$emit('updateHotel');
                    }
                } catch (error) {
                    console.log(error);
                    showError(error.response.data.message);
                }
            }
        },
        setIsVisibleDialog: function(){
            this.isVisibleDialog = !this.isVisibleDialog;
        },
    }
}
</script>