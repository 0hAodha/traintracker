import{s as n}from"./store-6f7621d4.js";import{N as u}from"./Navbar-6b07ba01.js";import{_ as p,r as _,o as e,c as a,a as g,b as s,t,d as o,F as l,e as m,p as T,f as b}from"./index-93b9eb88.js";const y={name:"InsightsPage",data(){return{insights:{},latestTrain:{},earliestTrain:{},rawData:{},orderedTrains:[],store:n}},components:{Navbar:u},created(){this.insights=n.insights,this.latestTrain=n.latestTrain,this.earliestTrain=n.earliestTrain,this.rawData=n.rawData,this.orderedTrains=n.orderedTrains}},h=i=>(T("data-v-b6ad733a"),i=i(),b(),i),f=h(()=>s("h1",null,"Insights",-1)),v={key:0},N={key:0},I={key:1},k=h(()=>s("h1",null,"Leaderboard",-1)),C={key:0},D={key:1};function S(i,w,x,L,d,P){const c=_("Navbar");return e(),a(l,null,[g(c),f,this.insights?(e(),a("div",v,[s("p",null,"Total number of trains: "+t(this.insights.totalNumTrains),1),s("p",null,"Number of actively running trains: "+t(this.insights.numRunningTrains),1),s("p",null,"Percentage late: "+t(this.insights.percentageLate)+"%",1),s("p",null,"Percentage early or ontime: "+t(this.insights.percentageNotLate)+"%",1),this.latestTrain.TrainCode?(e(),a("p",N,"Latest train: "+t(this.latestTrain.TrainCode[0])+", "+t(this.insights.latestTime)+" mins late",1)):o("",!0),this.earliestTrain.TrainCode?(e(),a("p",I,"Earliest train: "+t(this.earliestTrain.TrainCode[0])+", "+t(this.insights.earliestTime*-1)+" mins early",1)):o("",!0),s("p",null,"Mainland: "+t(this.insights.numMainland),1),s("p",null,"Suburban: "+t(this.insights.numSuburban),1),s("p",null,"Darts: "+t(this.insights.numDart),1)])):o("",!0),k,(e(!0),a(l,null,m(d.orderedTrains,r=>(e(),a("div",null,[s("h2",null,t(this.rawData[r.jsonIndex].TrainCode[0]),1),r.time>0?(e(),a("p",C,t(r.time)+" mins late",1)):(e(),a("p",D,t(r.time*-1)+" mins early",1))]))),256))],64)}const E=p(y,[["render",S],["__scopeId","data-v-b6ad733a"]]);export{E as default};