<template>
    <div id = "background">
        <div class = "loginbox">
            <img src="https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png" class="avatar">
            <h1>Sign Up Here</h1>
            <form>
                <p>Username</p>
                <input type="text" name="" placeholder="Enter Username">
                <p>Password</p>
                <input type="password" name="" placeholder="Password">
                <input type="submit" name="" value="Sign Up" @click.stop.prevent="submit()">
                <a href="#">Lost your password?</a><br>
                <a><router-link to="/login">Already have an account?</router-link></a>
            </form>
        </div>
    </div>
    </template>
    
    <script>
    
    export default {
        name: "signuppage",
    
        methods: {
            submit(){
                //if you want to send any data into server before redirection then you can do it here
                this.$router.push("/");
                }
        }
    }
    </script>
    
    <style scoped>
        #background{
        margin: 0;
        padding: 0;
        width:100%;
        height: 100%;
        position: absolute;
        background-color: #e0e0e0;
        font-family: sans-serif;
        }
        .loginbox{
          height: 420px;
          width: 320px;
          background: #000;
          color: #fff;
          top: 50%;
          left:50%;
          position: absolute;
          transform: translate(-50%,-50%);
          box-sizing: border-box;
          padding: 70px 30px;
        }
        h1{
          margin: 0;
          padding: 0 0 20px;
          font-size: 22px;
          text-align:center;
        }
        
        .loginbox p{
          margin: 0;
          padding:0;
          font-weight: bold;
        
        }
        
        .loginbox input{
          width:100%;
          margin-bottom: 20px;
        }
        .loginbox input[type="text"], input[type="password"]{
          border: none;
          border-bottom: 1px solid #fff;
          background: transparent;
          outline: none;
          height: 40px;
          color: #fff;
          font-size: 16px;
        
        }
        
        .loginbox input[type="submit"]:hover{
          cursor: pointer;
          background: #00df00;
          color: #000;
        
        }
        
        .loginbox a{
          text-decoration: none;
          font-size: 12px;
          line-height: 20px;
          color: darkgray;
        }
        
        .loginbox a:hover{
          color: #ffc107;
        }
        
        .loginbox input[type="submit"]
        {
          border: none;
          outline: none;
          height:40px;
          background: #00a800;;
          font-size: 18px;
          border-radius:20px;
        }
        .avatar{
          width: 100px;
          height: 100px;
          border-radius: 50%;
          position: absolute;
          top:-50px;
          left: calc(50% - 50px);
        }
    </style>