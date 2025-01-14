<script>
import { api } from '@/api/config';
import {showError, showSuccess, showConfirm} from '@/utils';

export default{
    name: 'ReservationCard',
    data: function(){
        return{
            isVisibleDialog: false,
            hotels: localStorage.getItem("hotels"),
            reservation: {
                check_in_date: "",
                check_out_date: ""
            },
            hotelId: this.hotel_id
        }
    },
    props: {
        id: Number,
        hotel_id: Number,
        hotel_name: String, 
        hotel_location: String,
        check_in_date: Date,   
        check_out_date: Date,
    },
    methods: {
        setIsVisibleDialog: function(){
            this.isVisibleDialog = !this.isVisibleDialog;
        },
        editReservation: async function(id){
            try {
                const token = localStorage.getItem("token");
                console.log(this.hotelId);
                const response = await api.put(`/api/reservations/${id}`, {
                    user_id: localStorage.getItem("userId"),
                    hotel_id: this.hotelId,
                    chek_in_date: this.reservation.check_in_date,
                    check_out_date: this.reservation.check_out_date
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(response.status === 200){
                    showSuccess("Reserva actualizada correctamente");
                }
                this.$emit('updateReservations');
            } catch (error) {
                console.log(error);
                showError(error.response.data.message);
            }
            this.setIsVisibleDialog();
        },
        deleteReservation: async function (){
            let result = await showConfirm(["¿Estás seguro de eliminar esta reserva?", "Eliminar", "Cancelar"]);
            if(result.isConfirmed){
                try {
                    const token = localStorage.getItem("token");
                    const response = await api.delete(`/api/reservations/${this.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if(response.status === 200){
                        showSuccess("Reserva eliminada correctamente");
                    }
                    this.$emit('updateReservations');
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
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Hotel : {{ hotel_name }}</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Direccion: {{ hotel_location }}</p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Fecha visita: {{ check_in_date.replace(/T00:00:00.000Z$/, '') }}</p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Fecha salida: {{ check_out_date.replace(/T00:00:00.000Z$/, '') }}</p>
            <div class="flex justify-end">
                <button type="button" @click="setIsVisibleDialog" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Editar</button>
                <button type="button" @click="deleteReservation" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Eliminar</button>
            </div>
        </div>
    </div>
    <div v-if="isVisibleDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center" >
        <div class="bg-white p-8 rounded-lg w-1/3">
            <h1 class="text-2xl font-bold">Editar reserva</h1>
            <form @submit.prevent="editReservation(id)">
                <div id="date-range-picker" date-rangepicker class="flex items-center">
                    <div class="relative">
                        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </div>
                        <input v-model="reservation.check_in_date" id="datepicker-range-start" name="start" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start">
                    </div>
                    <span class="mx-4 text-gray-500">a</span>
                    <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                        </svg>
                    </div>
                        <input v-model="reservation.check_out_date" id="datepicker-range-end" name="end" type="date" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date end">
                    </div>
                </div>
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Actualizar</button>
                <button class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" @click="setIsVisibleDialog">Cancelar</button>
            </form>
        </div>
    </div>
</template>