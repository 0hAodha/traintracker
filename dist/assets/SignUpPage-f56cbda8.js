import{_ as g,h,H as v,r as i,o as f,c as w,a as d,b as s,m as c,v as u,w as b,F as x,i as S,k,p as y,f as N}from"./index-93b9eb88.js";import{N as U}from"./Navbar-6b07ba01.js";const E={name:"SignupPage",data(){return{email:"",password:""}},components:{Navbar:U},methods:{signup(){const a=h(S);v(a,this.email,this.password).then(e=>{e.user,this.$router.push({path:"/secure"})}).catch(e=>{const r=e.code,l=e.message;console.log(r),console.log(l)})}}},n=a=>(y("data-v-925f3a88"),a=a(),N(),a),P={id:"background"},V={class:"loginbox"},A=n(()=>s("img",{src:"https://cdn.discordapp.com/attachments/1017419092447207436/1063092138029625394/pixil-frame-0.png",class:"avatar"},null,-1)),C=n(()=>s("h1",null,"Sign Up",-1)),I=n(()=>s("p",null,"Email Address",-1)),B=n(()=>s("p",null,"Password",-1));function F(a,e,r,l,t,p){const _=i("Navbar"),m=i("router-link");return f(),w(x,null,[d(_),s("div",P,[s("div",V,[A,C,I,c(s("input",{type:"email","onUpdate:modelValue":e[0]||(e[0]=o=>t.email=o),"aria-describedby":"emailHelp",placeholder:"Enter email"},null,512),[[u,t.email]]),B,c(s("input",{type:"password","onUpdate:modelValue":e[1]||(e[1]=o=>t.password=o),placeholder:"Enter password"},null,512),[[u,t.password]]),s("input",{onClick:e[2]||(e[2]=(...o)=>p.signup&&p.signup(...o)),type:"submit",name:"",value:"Sign Up"}),s("a",null,[d(m,{to:"/login"},{default:b(()=>[k("Already have an account?")]),_:1})])])])],64)}const T=g(E,[["render",F],["__scopeId","data-v-925f3a88"]]);export{T as default};
