<template>
    <div class="mt-20 overflow-x-auto">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        id
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Correo
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Rol
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" class="bg-white border-b dark:bg-white-800 dark:border-black-700">
                    <th scope="row" class="px-6 py-4 font-medium text-black-900 whitespace-nowrap dark:text-black">
                        {{ user.id }}
                    </th>
                    <td class="px-6 py-4 text-black-900 dark:text-black">
                        {{ user.email }}
                    </td>
                    <td class="px-6 py-4 text-black-900 dark:text-black">
                        {{ user.role }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { api } from '@/api/config';

export default{
    name: 'UsersList',
    data: function(){
        return{
            users: []
        }
    },
    methods: {
        getUsers: async function(){
            try {
                const token = localStorage.getItem("token");
                const response = await api.get('/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.users = response.data;
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted: function(){
        this.getUsers();
    }
}
</script>