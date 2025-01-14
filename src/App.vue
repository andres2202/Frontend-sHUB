<script>
import router from './router';

export default{
  name: 'App',
  data: function() {
    return{
      isAuth: false,
    }
  },
  methods: {
    verifyAuth: function(){
        this.isAuth = localStorage.getItem("isAuth") || false;
        console.log(this.isAuth);
        if(this.isAuth === false){
            console.log("No esta autenticado");
            this.$router.push({name: "login"});
        }else{
          console.log("Esta autenticado");
          this.$router.push({name: "home"});
        }
    },
    loginCompleted: function(data){
      console.log('evento loginCompleted');
      localStorage.setItem("isAuth", true);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("password", data.user.password);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("token", data.token);
      this.verifyAuth();
    },
    navigateToListUsers: function(){
      this.$router.push({name: "users"});
    },
    logout: function(){
      localStorage.clear();
      this.$router.push({name: "login"});
    }
  }
}
</script>

<template>
  <div>
    <router-view 
    v-on:loginCompleted="loginCompleted"
    v-on:logout="logout"
    ></router-view>
  </div>
</template>

<style>
.div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
