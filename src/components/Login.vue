<script>
import { api } from '@/api/config';
import { showError } from '@/utils';

export default {
    name: 'Login',
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
        processLogin: async function() {
            try {
                const response = await api.post('/api/login', {
                    email: this.user.email,
                    password: this.user.password,
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
        <h1>Bienvenido</h1>
        <div class="login">
            <form v-on:submit.prevent="processLogin">
                <input type="email" placeholder="Correo" id="email" v-model="user.email"/>
                <input type="password" placeholder="Contraseña" id="password" v-model="user.password"/>
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
        <router-link to="/signup" class="custom-link">Registrarse</router-link>
    </div>
</template>

<style>
.custom-link {
    text-decoration: underline;
    color: #333;
    margin-top: 10px;
}


.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    box-sizing: border-box; 
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
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #555;
}

button:active {
    background-color: #000;
}

button:focus {
    outline: none;
}

</style>