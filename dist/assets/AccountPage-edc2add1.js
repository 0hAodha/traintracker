import{g as m,c as f,h as g}from"./index.esm2017-54994bc5.js";import{_ as P,g as b,E as y,k as U,u as v,l as E,m as A,n as T,r as C,o as n,c as o,a as _,b as r,h as k,t as S,i as x,q as u,v as l,F as N,e as D,p as M,j as V}from"./index-9a3ecfe5.js";import{t as B}from"./style-1561178c.js";import{N as F}from"./Navbar-fcee2b9c.js";const w=b(),I={name:"AccountPage",components:{Navbar:F},data(){return{user:null,newEmail:"",newPassword:"",currentPassword:"",toastMessage:"",toastBackground:"",reAuthSuccessful:!1,showCurrentPassword:!1,showNewPassword:!1,toast:()=>{B(this.toastMessage,{hideProgressBar:!0,timeout:4e3,toastBackgroundColor:this.toastBackground})}}},created(){this.user=w.currentUser},methods:{showToast(s,e){this.toastMessage=s,this.toastBackground=e,this.toast()},async authenticateUser(s){var e=await y.credential(this.user.email,s);await U(this.user,e).then(()=>{this.reAuthSuccessful=!0}).catch(h=>{this.reAuthSuccessful=!1,h.message.includes("wrong")?this.showToast("Wrong password inputted","red"):this.showToast(h.message,"red")})},resetCredentials(){this.newEmail="",this.newPassword="",this.currentPassword="",this.reAuthSuccessful=!1},updateUserEmail(){if(!this.newEmail||!this.currentPassword){this.showToast("Missing password input","red");return}this.authenticateUser(this.currentPassword).then(()=>{this.reAuthSuccessful&&v(this.user,this.newEmail).then(()=>{this.resetCredentials(),this.showToast("Email successfully updated","green")}).catch(s=>{this.showToast(s.message,"red")})})},updateUserPassword(){if(!this.newPassword||!this.currentPassword){this.showToast("Missing password input","red");return}this.authenticateUser(this.currentPassword).then(()=>{this.reAuthSuccessful&&E(this.user,this.newPassword).then(()=>{this.resetCredentials(),this.showToast("Password successfully updated","green")}).catch(s=>{this.showToast(s.message,"red")})})},deleteUserAccount(){if(!this.currentPassword){this.showToast("Missing password input","red");return}this.authenticateUser(this.currentPassword).then(()=>{this.reAuthSuccessful&&A(this.user).then(()=>{this.resetCredentials(),this.showToast("Account successfully deleted","green"),this.$router.push({path:"/"})}).catch(s=>{this.showToast(s.message,"red")})})},resetPasswordEmail(){T(w,this.user.email).then(()=>{this.showToast("Reset password email sent","green")}).catch(s=>{this.showToast(s.message,"red")})},deleteUserPreferences(){if(!this.currentPassword){this.showToast("Missing password input","red");return}this.authenticateUser(this.currentPassword).then(()=>{if(!this.reAuthSuccessful)return;const s=m(D);let e=window.location.hostname;(e==="127.0.0.1"||e==="localhost")&&f(s,e,5001),g(s,"deletePreferences")().then(()=>{this.resetCredentials(),this.showToast("Successfully map deleted filter preferences","green")}).catch(c=>{this.showToast(c.message,"red")})}).catch(s=>{this.showToast(s.message,"red")})}}},d=s=>(M("data-v-b1085315"),s=s(),V(),s),R={id:"accountDiv"},W={id:"mainDiv"},j=d(()=>r("h1",null,"Account Settings",-1)),q={key:0,style:{"text-align":"center"}},H=d(()=>r("br",null,null,-1)),Y=d(()=>r("h3",null,"Enter your current password to edit the below settings",-1)),z=d(()=>r("h3",null,"Change email",-1)),G=d(()=>r("h3",null,"Change password",-1));function J(s,e,h,c,a,i){const p=C("Navbar");return n(),o(N,null,[_(p),r("div",R,[r("div",W,[j,this.user?(n(),o("p",q,[k("Your email: "),r("b",null,S(this.user.email),1),H,r("span",{id:"passReset",onClick:e[0]||(e[0]=t=>i.resetPasswordEmail())},"Send password reset email")])):x("",!0),Y,a.showCurrentPassword?u((n(),o("input",{key:1,type:"text","onUpdate:modelValue":e[1]||(e[1]=t=>a.currentPassword=t),placeholder:"Enter existing password"},null,512)),[[l,a.currentPassword]]):u((n(),o("input",{key:2,type:"password","onUpdate:modelValue":e[2]||(e[2]=t=>a.currentPassword=t),placeholder:"Enter existing password"},null,512)),[[l,a.currentPassword]]),z,u(r("input",{type:"email","onUpdate:modelValue":e[3]||(e[3]=t=>a.newEmail=t),"aria-describedby":"emailHelp",placeholder:"Enter new email"},null,512),[[l,a.newEmail]]),r("button",{onClick:e[4]||(e[4]=t=>i.updateUserEmail()),id:"emailUpdate",type:"button",class:"btn btn-primary",value:"Update Email"},"Update email"),G,a.showNewPassword?u((n(),o("input",{key:3,type:"text","onUpdate:modelValue":e[5]||(e[5]=t=>a.newPassword=t),placeholder:"Enter new password"},null,512)),[[l,a.newPassword]]):u((n(),o("input",{key:4,type:"password","onUpdate:modelValue":e[6]||(e[6]=t=>a.newPassword=t),placeholder:"Enter new password"},null,512)),[[l,a.newPassword]]),r("button",{onClick:e[7]||(e[7]=t=>i.updateUserPassword()),id:"passUpdate",type:"button",class:"btn btn-primary"},"Update Password"),r("button",{onClick:e[8]||(e[8]=t=>i.deleteUserPreferences()),id:"delPref",type:"button",class:"btn btn-danger"},"Delete Map Preferences"),r("button",{onClick:e[9]||(e[9]=t=>i.deleteUserAccount()),id:"delAcc",type:"button",class:"btn btn-danger",value:"Delete Account"},"Delete Account")])])],64)}const X=P(I,[["render",J],["__scopeId","data-v-b1085315"]]);export{X as default};