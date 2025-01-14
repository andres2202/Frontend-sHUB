
<script>
import { api } from '@/api/config';
import { showError } from '@/utils';

export default{
    name: 'signup',
    data: function() {
        return {
            user: {
                id: 0,
                email: "",
                password: "",
                role: ""
            }
        }
    },
    methods: {
        register: async function() {
            try {
                const response = await api.post('/api/register', {
                    email: this.user.email,
                    password: this.user.password,
                    role: this.user.role
                });
                const token = response.headers.authorization;
                this.user.id = response.data.id;
                this.user.role = response.data.role;
                let dataLogin ={
                    user : this.user,
                    token : token.split(' ')[1]
                }
                this.$emit('loginCompleted', dataLogin);
            } catch (error) {
                console.log(error);
                showError(error.response.data.message);
            }
        }
    }
}
</script>

<template>
    <div class="wrapper">
        <div class="login">
            <h1>Crear nueva cuenta</h1>
            <form v-on:submit.prevent="register">
                <input type="email" placeholder="Email" v-model="user.email">
                <input type="password" placeholder="Password" v-model="user.password">
                <select v-model="user.role">
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
        <router-link to="/" class="custom-link">Volver a Iniciar sesión</router-link>
    </div>
        
</template>

<style>

select {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

option {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font: 10px;
}

option:hover {
    background-color: #f1f1f1;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f1f1f1;
}

.login {
    width: 300px;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h1 {
    margin: 0 0 40px 0;
    font-size: 30px;
    font-weight: 400;
    color: #333;
}

form {
    display: flex;
    flex-direction: column;
}

input {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 10px;
    background-color: #333;
    color: #fff;
    border: none;
}

.custom-link {
    text-decoration: underline;
    color: #333;
    margin-top: 10px;
}

button:hover {
    background-color: #555;
}



</style>