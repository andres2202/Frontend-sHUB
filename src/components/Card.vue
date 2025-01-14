<script>
import { api } from '@/api/config';
import { showError,showSuccess,showConfirm } from '@/utils';
import Calendar from './Calendar.vue';

export default {
    name: 'card',
    data: function(){
        return{
           isAdmin: localStorage.getItem("role") === "admin",
           hotel: {
               name: this.name,
               location: this.location
           },
           isVisibleDialog: false,
           isVisibleDialogReservation: false,
           reservation: {
               checkInDate: "",
               checkOutDate: ""
           }
        }
    },
    props: {
        id: Number,
        name: String,
        location: String,    },
    components: {
        Calendar
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
                    showSuccess(response.data.message);
                    this.$emit('updateHotel');
                }
            } catch (error) {
                console.log(error);
                showError(error.response.data.message);
            }
            this.setIsVisibleDialog();
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
        setIsVisibleDialogReservation: function(){
            this.isVisibleDialogReservation = !this.isVisibleDialogReservation;
        },
        createReservation: async function(){
            this.setIsVisibleDialogReservation();
            if(this.reservation.checkInDate === "" || this.reservation.checkOutDate === ""){
                showError("Por favor selecciona las fechas de llegada y salida");
            }else if(this.reservation.checkInDate > this.reservation.checkOutDate){
                showError("La fecha de llegada no puede ser mayor a la fecha de salida");
            }else if(this.reservation.checkInDate < new Date().toISOString().split('T')[0]){
                showError("La fecha de llegada no puede ser menor a la fecha actual");
            }else{
                try {
                    const response = await api.post('/api/reservations', {
                        check_out_date: this.reservation.checkOutDate,
                        chek_in_date: this.reservation.checkInDate,
                        hotel_id: this.id,
                        user_id: localStorage.getItem("userId")
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    if(response.status === 201){
                        showSuccess(response.data.message);
                    }
                    this.reservation.checkInDate = "";
                    this.reservation.checkOutDate = "";
                } catch (error) {
                    console.log(error);
                    showError(error.response.data.message);
                }
            }
        }
    }
}
</script>

<template>
    <div class="md:w-auto m-8 bg-white border border-white-200 rounded-lg shadow dark:bg-gray-800 dark:border-white-600">
        <a href="#">
            <img class="rounded-t-lg" src="/src/assets/image-1.jpg" alt="image" />
        </a>
        <div class="p-5">
            
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Hotel : {{ name }}</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ location }}</p>
            <div v-if="isAdmin" class="flex justify-end">
                <button type="button" @click="setIsVisibleDialog" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Editar</button>
                <button type="button" @click="deleteHotel" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Eliminar</button>
            </div>
            <div v-if="!isAdmin" class="md:w-auto">
                <button type="button" @click="setIsVisibleDialogReservation" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Reservar</button>
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
    <div v-if="isVisibleDialogReservation" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center" >
        <div class="bg-white p-8 rounded-lg w-1/3">
        <h1 class="text-2xl font-bold">Crear Reserva</h1>
        <form @submit.prevent="createReservation">
                <div id="date-range-picker" date-rangepicker class="flex items-center">
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </div>
                        <input v-model="reservation.checkInDate" id="datepicker-range-start" name="start" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start">
                    </div>
                    <span class="mx-4 text-gray-500">a</span>
                    <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </div>
                        <input v-model="reservation.checkOutDate" id="datepicker-range-end" name="end" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end">
                    </div>
                </div>
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Reservar</button>
                <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" @click="setIsVisibleDialogReservation">Cancelar</button>
            </form>
        </div>
    </div>
</template>

