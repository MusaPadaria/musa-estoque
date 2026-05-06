import{useState,useMemo,useEffect}from"react";
const API="http://187.77.57.211:3001";
const P={bg:"#0e0c0a",surface:"#161310",card:"#1c1813",cream:"#e8d5a3",creamDark:"#c4b07a",textMuted:"#7a6a52",textDim:"#4a3f30"};
const NUMEROS=["5585996237360","5521966721884"];
const ADMINS=["Henrique","Marina","Luana"];
const UNIDADES=["un","porcao","kg","g","L","ml","cx","pct","sc"];
const ST={ok:{label:"OK",bar:"#4caf7d",tag:"#1a3326",tagText:"#4caf7d"},alerta:{label:"Baixo",bar:"#f0b429",tag:"#3a2a0a",tagText:"#f0b429"},perigo:{label:"Critico",bar:"#ff6b6b",tag:"#3a0f0f",tagText:"#ff6b6b"}};
const VAL_ST={ok:{label:"Dentro da validade",icon:"✅",cor:"#4caf7d",bg:"#1a3326"},prestes:{label:"Prestes a vencer",icon:"⚠️",cor:"#f0b429",bg:"#3a2a0a"},critico:{label:"Vence hoje/amanha",icon:"🚨",cor:"#ff6b6b",bg:"#3a0f0f"},vencido:{label:"VENCIDO",icon:"💀",cor:"#ff4444",bg:"#2a0808"},sem:{label:"Sem validade",icon:"📅",cor:"#7a6a52",bg:"#1c1813"}};
const TIPO_COR={atualizacao:"#4caf7d",adicao:"#6ab0f0",remocao:"#ff6b6b",edicao:"#f0b429",critico:"#ff6b6b"};
const TIPO_ICON={atualizacao:"📦",adicao:"➕",remocao:"🗑️",edicao:"✏️",critico:"🚨"};
const CATS_INIT=[
{id:"proteinas",nome:"Proteinas",icon:"🥩",cor:"#ef9a9a",produtos:[
{id:401,nome:"Camarao",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:402,nome:"Carne do sol",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:403,nome:"Carne moida",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:404,nome:"Charque",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:405,nome:"Cupim",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:406,nome:"Frango",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:407,nome:"Ovos",atual:0,minimo:30,perigoso:10,unidade:"un"},
{id:408,nome:"Ovos caipira",atual:0,minimo:60,perigoso:20,unidade:"un"},
{id:409,nome:"Pernil suino",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
]},
{id:"frios",nome:"Frios",icon:"🧀",cor:"#fff176",produtos:[
{id:501,nome:"Bacon fatiado",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:502,nome:"Calabresa",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:503,nome:"Goma para tapioca",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:504,nome:"Manteiga",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:505,nome:"Manteiga da terra",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:506,nome:"Mortadela",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:507,nome:"Nata",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:508,nome:"Peito de peru",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:509,nome:"Presunto",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:510,nome:"Queijo coalho",atual:0,minimo:1,perigoso:0,unidade:"porcao"},
{id:511,nome:"Queijo gorgonzola",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:512,nome:"Queijo mussarela",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:513,nome:"Queijo parmesao",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:514,nome:"Queijo prato",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:515,nome:"Requeijao",atual:0,minimo:1,perigoso:0,unidade:"un"},
]},
{id:"mercearia_liquida",nome:"Mercearia Liquida",icon:"🧴",cor:"#64b5f6",produtos:[
{id:301,nome:"Azeite extra virgem",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:302,nome:"Azeite trufado",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:303,nome:"Coalhada integral",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:304,nome:"Creme culinario",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:305,nome:"Ketchup",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:306,nome:"Leite integral",atual:0,minimo:1,perigoso:0,unidade:"L"},
{id:307,nome:"Mostarda",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:308,nome:"Oleo",atual:0,minimo:1,perigoso:0,unidade:"L"},
{id:309,nome:"Shoyu",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:310,nome:"Vinagre",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:311,nome:"Vinho branco",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:312,nome:"Vinho tinto",atual:0,minimo:1,perigoso:0,unidade:"un"},
]},
{id:"sementes",nome:"Sementes e Temperos",icon:"🌿",cor:"#4caf7d",produtos:[
{id:1,nome:"Alho frito",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:2,nome:"Aveia em flocos",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:3,nome:"Castanha do para",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:4,nome:"Castanha granulada",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:5,nome:"Castanha inteira",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:6,nome:"Cereal de milho",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:7,nome:"Chia",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:8,nome:"Coloral",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:9,nome:"Cravo em po",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:10,nome:"Erva doce",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:11,nome:"Folhas de louro",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:12,nome:"Gengibre em po",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:13,nome:"Gergelim branco",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:14,nome:"Gergelim preto",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:15,nome:"Linhaca dourada",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:16,nome:"Milho desidratado",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:17,nome:"Nos moscada",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:18,nome:"Oregano",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:19,nome:"Paprica defumada",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:20,nome:"Passas",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:21,nome:"Pimenta em graos",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:22,nome:"Semente de abobora",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:23,nome:"Semente de girassol",atual:0,minimo:1,perigoso:0,unidade:"kg"},
]},
{id:"hortifruti",nome:"Hortifruti",icon:"🥦",cor:"#81c784",produtos:[
{id:101,nome:"Abacate",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:102,nome:"Abacaxi",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:103,nome:"Alecrim",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:104,nome:"Alface crespa",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:105,nome:"Alface roxa",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:106,nome:"Azeitona sem caroco",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:107,nome:"Banana da terra",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:108,nome:"Banana prata",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:109,nome:"Batata doce fina",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:110,nome:"Batata inglesa",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:111,nome:"Cenoura",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:112,nome:"Coco seco",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:113,nome:"Laranja",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:114,nome:"Limao",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:115,nome:"Limao siciliano",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:116,nome:"Macaxeira",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:117,nome:"Mamao",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:118,nome:"Manga",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:119,nome:"Maracuja",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:120,nome:"Melao",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:121,nome:"Minho",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:122,nome:"Morango congelado",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:123,nome:"Morango fresco",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:124,nome:"Porto belo",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:125,nome:"Rucula",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:126,nome:"Shimeji",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:127,nome:"Shiitake",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:128,nome:"Tomate cereja",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:129,nome:"Tomate salada",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:130,nome:"Tomilho",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:131,nome:"Uva roxa",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:132,nome:"Uva verde",atual:0,minimo:1,perigoso:0,unidade:"kg"},
]},
{id:"mercearia_seca",nome:"Mercearia Seca",icon:"🛒",cor:"#ffb74d",produtos:[
{id:201,nome:"Acucar cristal",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:202,nome:"Acucar mascavo",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:203,nome:"Acucar refinado",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:204,nome:"Acucar sache salao",atual:0,minimo:1,perigoso:0,unidade:"cx"},
{id:205,nome:"Amido",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:206,nome:"Cafe especial",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:207,nome:"Cafe funcionario",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:208,nome:"Cafe soluvel",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:209,nome:"Cuscuz",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:210,nome:"Flor de sal",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:211,nome:"Leite em po",atual:0,minimo:1,perigoso:0,unidade:"kg"},
{id:212,nome:"Sal",atual:0,minimo:1,perigoso:0,unidade:"kg"},
]},
{id:"descartaveis",nome:"Descartaveis",icon:"📦",cor:"#b0bec5",produtos:[
{id:601,nome:"Bobina 20x30",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:602,nome:"Bobina 30x40",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:603,nome:"Bobina impressora",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:604,nome:"Bobina maquina cartao",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:605,nome:"Bobina termica",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:606,nome:"Canudo",atual:0,minimo:1,perigoso:0,unidade:"pct"},
{id:607,nome:"Durex",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:608,nome:"Embalagem biscoito",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:609,nome:"Embalagem brownie",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:610,nome:"Embalagem H03",atual:0,minimo:15,perigoso:5,unidade:"un"},
{id:611,nome:"Embalagem pao de mel",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:612,nome:"Embalagens bolo",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:613,nome:"Esponja",atual:0,minimo:5,perigoso:2,unidade:"un"},
{id:614,nome:"Fibraca",atual:0,minimo:5,perigoso:2,unidade:"un"},
{id:615,nome:"Filme PVC",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:616,nome:"Filtro de cafe 103",atual:0,minimo:3,perigoso:1,unidade:"pct"},
{id:617,nome:"Guardanapo clientes",atual:0,minimo:5,perigoso:2,unidade:"pct"},
{id:618,nome:"Isqueiro cozinha",atual:0,minimo:2,perigoso:1,unidade:"un"},
{id:619,nome:"Luvas de vinil",atual:0,minimo:1,perigoso:0,unidade:"pct"},
{id:620,nome:"Papel aluminio",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:621,nome:"Papel interfolhado",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:622,nome:"Papel manteiga",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:623,nome:"Papel toalha",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:624,nome:"Perfex",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:625,nome:"Pote 145g",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:626,nome:"Pote 250g",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:627,nome:"Pote 1kg",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:628,nome:"Saco de lixo 60l",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:629,nome:"Saco de lixo 200l",atual:0,minimo:1,perigoso:0,unidade:"un"},
{id:630,nome:"Sacola Musa Delivery",atual:0,minimo:10,perigoso:5,unidade:"un"},
{id:631,nome:"Touca descartavel",atual:0,minimo:1,perigoso:0,unidade:"pct"},
]},
{id:"bebidas",nome:"Bebidas",icon:"🥤",cor:"#80deea",produtos:[
{id:701,nome:"Agua sem gas 330ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:702,nome:"Agua com gas 330ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:703,nome:"Coca-Cola lata 350ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:704,nome:"Coca-Cola Zero lata 350ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:705,nome:"Guarana Antarctica lata 350ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:706,nome:"Guarana Antarctica Zero lata 350ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:707,nome:"Sao Geraldo lata 350ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:708,nome:"Sao Geraldo Zero lata 350ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:709,nome:"Agua de coco 300ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:710,nome:"Heineken long neck 330ml",atual:0,minimo:6,perigoso:2,unidade:"un"},
{id:711,nome:"Jungle melancia e limao 500ml",atual:0,minimo:4,perigoso:2,unidade:"un"},
{id:712,nome:"Jungle abacaxi e hortela 500ml",atual:0,minimo:4,perigoso:2,unidade:"un"},
]},
];
const PORC_INIT={proteinas:[
{id:"frango",nome:"Frango Desfiado",icon:"🍗",gramatura:200,porcoes:0,minimo:10,perigoso:5,perdas:""},
{id:"carne_moida",nome:"Carne Moida",icon:"🥩",gramatura:200,porcoes:0,minimo:10,perigoso:5,perdas:""},
{id:"carne_sol",nome:"Carne do Sol Desfiada",icon:"🥩",gramatura:200,porcoes:0,minimo:10,perigoso:5,perdas:""},
{id:"cupim",nome:"Cupim Desfiado",icon:"🥩",gramatura:200,porcoes:0,minimo:8,perigoso:3,perdas:""},
{id:"mortadela",nome:"Mortadela Fatiada",icon:"🍖",gramatura:100,porcoes:0,minimo:10,perigoso:5,perdas:""},
],frios:[
{id:"coalho_ralado",nome:"Queijo Coalho Ralado",icon:"🧀",gramatura:100,porcoes:0,minimo:10,perigoso:5,perdas:""},
{id:"coalho_fatiado",nome:"Queijo Coalho Fatiado",icon:"🧀",gramatura:100,porcoes:0,minimo:10,perigoso:5,perdas:""},
]};
const VITRINE_INIT=[
{id:"v1",nome:"Focaccia de tomate seco",produzida:0,vendida:0,minimo:5,validade:"",validadeMinDias:2},
{id:"v2",nome:"Focaccia de gorgonzola",produzida:0,vendida:0,minimo:5,validade:"",validadeMinDias:2},
{id:"v3",nome:"Salgado de frango",produzida:0,vendida:0,minimo:10,validade:"",validadeMinDias:2},
{id:"v4",nome:"Salgado de calabresa",produzida:0,vendida:0,minimo:10,validade:"",validadeMinDias:2},
{id:"v5",nome:"Salgado de carne de sol",produzida:0,vendida:0,minimo:10,validade:"",validadeMinDias:2},
{id:"v6",nome:"Empada de frango",produzida:0,vendida:0,minimo:10,validade:"",validadeMinDias:2},
{id:"v7",nome:"Brownie",produzida:0,vendida:0,minimo:8,validade:"",validadeMinDias:3},
{id:"v8",nome:"Cookies",produzida:0,vendida:0,minimo:12,validade:"",validadeMinDias:3},
{id:"v9",nome:"Bolo de cenoura",produzida:0,vendida:0,minimo:2,validade:"",validadeMinDias:3},
{id:"v10",nome:"Bolo da chef de brigadeiro",produzida:0,vendida:0,minimo:2,validade:"",validadeMinDias:3},
{id:"v11",nome:"Bolo da chef de maracuja",produzida:0,vendida:0,minimo:2,validade:"",validadeMinDias:3},
{id:"v12",nome:"Brigadeiros",produzida:0,vendida:0,minimo:20,validade:"",validadeMinDias:2},
{id:"v13",nome:"Pao de mel",produzida:0,vendida:0,minimo:10,validade:"",validadeMinDias:3},
];
function gS(i){if(i.atual<=i.perigoso)return"perigo";if(i.atual<=i.minimo)return"alerta";return"ok";}
function gSP(i){if(i.porcoes<=i.perigoso)return"perigo";if(i.porcoes<=i.minimo)return"alerta";return"ok";}
function getValSt(validade,dias){
if(!validade)return"sem";
const hoje=new Date();hoje.setHours(0,0,0,0);
const val=new Date(validade+"T00:00:00");
const diff=Math.floor((val-hoje)/(1000*60*60*24));
if(diff<0)return"vencido";if(diff<=1)return"critico";if(diff<=(dias||2))return"prestes";return"ok";
}
function sendWA(msg){NUMEROS.forEach(n=>{window.open("https://wa.me/"+n+"?text="+encodeURIComponent(msg),"_blank");});}
function nowStr(){const d=new Date();return d.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})+" as "+d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});}
async function apiGet(path){try{const r=await fetch(API+path);return await r.json();}catch(e){return null;}}
async function apiPost(path,data){try{const r=await fetch(API+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});return await r.json();}catch(e){return null;}}
async function apiPut(path,data){try{const r=await fetch(API+path,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});return await r.json();}catch(e){return null;}}
async function apiDelete(path){try{await fetch(API+path,{method:"DELETE"});}catch(e){}}

// ---- COMPONENTS OUTSIDE APP TO PREVENT RE-RENDER ISSUES ----
function Modal({show,onClose,title,children}){
if(!show)return null;
return(
<div onClick={e=>e.target===e.currentTarget&&onClose()} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",zIndex:300}}>
<div style={{background:"#161310",width:"100%",borderRadius:"18px 18px 0 0",padding:"20px 16px 50px",maxHeight:"92vh",overflowY:"auto",border:"1px solid #2a221a",borderBottom:"none"}}>
<div style={{width:34,height:3,background:"#4a3f30",borderRadius:99,margin:"0 auto 20px"}}/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
<div style={{fontSize:16,fontWeight:700,color:"#e8d5a3"}}>{title}</div>
<button onClick={onClose} style={{background:"#1c1813",border:"1px solid #2a221a",color:"#7a6a52",borderRadius:7,width:28,height:28,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
</div>
{children}
</div>
</div>
);
}

export default function App(){
useEffect(()=>{const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap";l.rel="stylesheet";document.head.appendChild(l);document.body.style.fontFamily="Plus Jakarta Sans,sans-serif";},[]);
const[inputNome,setInputNome]=useState("");
const[usuario,setUsuario]=useState("");
const[logado,setLogado]=useState(false);
const[cats,setCats]=useState(CATS_INIT);
const[porc,setPorc]=useState(PORC_INIT);
const[porcAtiva,setPorcAtiva]=useState({proteinas:"frango",frios:"coalho_ralado"});
const[tab,setTab]=useState("estoque");
const[catAtiva,setCatAtiva]=useState("proteinas");
const[busca,setBusca]=useState("");
const[atualizando,setAtualizando]=useState(null);
const[novoValor,setNovoValor]=useState("");
const[hist,setHist]=useState([]);
const[filtroUser,setFiltroUser]=useState("Todos");
const[avisos,setAvisos]=useState([]);
const[avisosLidos,setAvisosLidos]=useState([]);
const[vitrine,setVitrine]=useState(VITRINE_INIT);
const[editVitrine,setEditVitrine]=useState(null);
const[vitrineForm,setVitrineForm]=useState({produzida:"",vendida:"",minimo:"",validade:"",validadeMinDias:""});
const[showAddVitrine,setShowAddVitrine]=useState(false);
const[addVitrineForm,setAddVitrineForm]=useState({nome:"",minimo:"1",validadeMinDias:"2"});
const[cozinha,setCozinha]=useState([]);
const[showCozForm,setShowCozForm]=useState(false);
const[cozInsumo,setCozInsumo]=useState("");
const[cozUnd,setCozUnd]=useState("");
const[cozPorcoes,setCozPorcoes]=useState("");
const[cozPeso,setCozPeso]=useState("");
const[cozPerdas,setCozPerdas]=useState("");
const[cozAss,setCozAss]=useState("");
const[cozEnviar,setCozEnviar]=useState(false);
const[cozNomeVitrine,setCozNomeVitrine]=useState("");
const[showProdForm,setShowProdForm]=useState(false);
const[editProdId,setEditProdId]=useState(null);
const[editProdCat,setEditProdCat]=useState(null);
const[prodNome,setProdNome]=useState("");
const[prodAtual,setProdAtual]=useState("");
const[prodMin,setProdMin]=useState("");
const[prodPer,setProdPer]=useState("");
const[prodUnd,setProdUnd]=useState("un");
const[showPorcForm,setShowPorcForm]=useState(false);
const[editPorcCat,setEditPorcCat]=useState(null);
const[editPorcId,setEditPorcId]=useState(null);
const[porcPorcoes,setPorcPorcoes]=useState("");
const[porcPerdas,setPorcPerdas]=useState("");
const[porcMin,setPorcMin]=useState("");
const[porcPer,setPorcPer]=useState("");
const[showGram,setShowGram]=useState(false);
const[gramVal,setGramVal]=useState("");
const[gramCat,setGramCat]=useState(null);
const[gramId,setGramId]=useState(null);
const[showAvisoForm,setShowAvisoForm]=useState(false);
const[avisoTitulo,setAvisoTitulo]=useState("");
const[avisoMsg,setAvisoMsg]=useState("");
const[avisoPrior,setAvisoPrior]=useState("normal");

const isAdmin=ADMINS.includes(usuario);

useEffect(()=>{
if(!logado)return;
// Load cats/estoque
apiGet("/estoque").then(data=>{
if(data&&data.length>0){
const saved=JSON.parse(data[0].value||"null");
if(saved)setCats(saved);
}
});
// Load vitrine
apiGet("/vitrine").then(data=>{
if(data&&data.length>0){
const saved=JSON.parse(data[0].value||"null");
if(saved)setVitrine(saved);
}
});
// Load historico
apiGet("/historico").then(data=>{
if(data&&data.length>0)setHist(data.sort((a,b)=>b.id-a.id));
});
// Load avisos
apiGet("/avisos").then(data=>{
if(data&&data.length>0)setAvisos(data.sort((a,b)=>b.id-a.id));
});
// Load porcionamento
apiGet("/porcionamento").then(data=>{
if(data&&data.length>0){
const saved=JSON.parse(data[0].value||"null");
if(saved)setPorc(saved);
}
});
// Load cozinha
apiGet("/cozinha").then(data=>{
if(data&&data.length>0)setCozinha(data.sort((a,b)=>b.id-a.id));
});
},[logado]);

// Save cats when changed
useEffect(()=>{
if(!logado)return;
apiGet("/estoque").then(data=>{
if(data&&data.length>0){apiPut("/estoque/"+data[0].id,{id:data[0].id,value:JSON.stringify(cats)});}
else{apiPost("/estoque",{value:JSON.stringify(cats)});}
});
},[cats]);

// Save vitrine when changed
useEffect(()=>{
if(!logado)return;
apiGet("/vitrine").then(data=>{
if(data&&data.length>0){apiPut("/vitrine/"+data[0].id,{id:data[0].id,value:JSON.stringify(vitrine)});}
else{apiPost("/vitrine",{value:JSON.stringify(vitrine)});}
});
},[vitrine]);

// Save porcionamento when changed
useEffect(()=>{
if(!logado)return;
apiGet("/porcionamento").then(data=>{
if(data&&data.length>0){apiPut("/porcionamento/"+data[0].id,{id:data[0].id,value:JSON.stringify(porc)});}
else{apiPost("/porcionamento",{value:JSON.stringify(porc)});}
});
},[porc]);
const todosProd=useMemo(()=>cats.flatMap(c=>c.produtos.map(p=>({...p,catId:c.id,catNome:c.nome,catCor:c.cor,catIcon:c.icon}))),[cats]);
const perigo=todosProd.filter(p=>gS(p)==="perigo");
const alertas=todosProd.filter(p=>gS(p)==="alerta");
const catObj=cats.find(c=>c.id===catAtiva);
const prodsFiltrados=useMemo(()=>{
if(!catObj)return[];
const l=catObj.produtos.slice().sort((a,b)=>a.nome.localeCompare(b.nome));
if(!busca.trim())return l;
return l.filter(p=>p.nome.toLowerCase().includes(busca.toLowerCase()));
},[catObj,busca]);
const usuarios=["Todos",...new Set(hist.map(h=>h.usuario))];
const histFiltrado=filtroUser==="Todos"?hist:hist.filter(h=>h.usuario===filtroUser);
const avisosNaoLidos=avisos.filter(a=>!avisosLidos.includes(a.id)).length;
const todosPorc=[...(porc.proteinas||[]).map(p=>({...p,cat:"proteinas"})),...(porc.frios||[]).map(p=>({...p,cat:"frios"}))];
const porcCriticos=todosPorc.filter(p=>gSP(p)==="perigo").length;
const validadesCriticas=vitrine.filter(v=>["critico","vencido"].includes(getValSt(v.validade,v.validadeMinDias))).length;

function log(msg,tipo,detalhe){
const entry={msg,tipo,detalhe,usuario,completo:nowStr()};
setHist(h=>[entry,...h].slice(0,100));
apiPost("/historico",entry);
}
function login(){if(inputNome.trim().length<2)return;setUsuario(inputNome.trim());setLogado(true);}

function atualizarProd(catId,prodId){
const val=parseFloat(novoValor);if(isNaN(val))return;
const cat=cats.find(c=>c.id===catId);const prod=cat.produtos.find(p=>p.id===prodId);
const updated={...prod,atual:val};
setCats(cs=>cs.map(c=>c.id!==catId?c:{...c,produtos:c.produtos.map(p=>p.id!==prodId?p:updated)}));
log("Estoque atualizado",gS(updated)==="perigo"?"critico":"atualizacao",cat.nome+" - "+prod.nome+": "+prod.atual+"->"+val+" "+prod.unidade);
if(val===0)sendWA("*ESTOQUE ZERADO MUSA* ❌\n\n"+cat.nome+" - "+prod.nome+"\nResponsavel: "+usuario+"\n"+nowStr());
else if(gS(updated)==="perigo")sendWA("*ALERTA MUSA* 🚨\n\n"+cat.nome+" - "+prod.nome+"\nQtd: "+val+" "+prod.unidade+" (min: "+prod.minimo+")\nResponsavel: "+usuario+"\n"+nowStr());
setAtualizando(null);setNovoValor("");
}

function salvarProd(){
if(!prodNome||prodAtual===""||prodMin===""||prodPer==="")return;
const cat=cats.find(c=>c.id===editProdCat);
if(editProdId){
const item={...cat.produtos.find(p=>p.id===editProdId),nome:prodNome,atual:+prodAtual,minimo:+prodMin,perigoso:+prodPer,unidade:prodUnd};
setCats(cs=>cs.map(c=>c.id===editProdCat?{...c,produtos:c.produtos.map(p=>p.id===editProdId?item:p)}:c));
log("Produto editado","edicao",cat.nome+" - "+item.nome);
}else{
const item={id:Date.now(),nome:prodNome,atual:+prodAtual,minimo:+prodMin,perigoso:+prodPer,unidade:prodUnd};
setCats(cs=>cs.map(c=>c.id===editProdCat?{...c,produtos:[...c.produtos,item]}:c));
log("Produto adicionado","adicao",cat.nome+" - "+item.nome);
}
setShowProdForm(false);
}

function removerProd(catId,prodId){
const cat=cats.find(c=>c.id===catId);const prod=cat.produtos.find(p=>p.id===prodId);
setCats(cs=>cs.map(c=>c.id===catId?{...c,produtos:c.produtos.filter(p=>p.id!==prodId)}:c));
log("Produto removido","remocao",cat.nome+" - "+prod.nome);
}

function salvarPorc(){
const catP=porc[editPorcCat];if(!catP)return;
const item=catP.find(i=>i.id===editPorcId);if(!item)return;
const val=+porcPorcoes||0;
const updated={...item,porcoes:val,perdas:porcPerdas,minimo:+porcMin||item.minimo,perigoso:+porcPer||item.perigoso};
setPorc(ps=>({...ps,[editPorcCat]:ps[editPorcCat].map(i=>i.id===editPorcId?updated:i)}));
log("Porcionamento atualizado","atualizacao",item.nome+" porcoes: "+val);
if(val===0)sendWA("*PORCIONAMENTO ZERADO MUSA* ❌\n\n"+item.nome+" zerou!\nResponsavel: "+usuario+"\n"+nowStr());
else if(gSP(updated)==="perigo")sendWA("*ALERTA PORCIONAMENTO MUSA* ✂️\n\n"+item.nome+"\nPorcoes: "+val+" (min: "+updated.minimo+")\nGramatura: "+item.gramatura+"g\nResponsavel: "+usuario+"\n"+nowStr());
setShowPorcForm(false);
}

function salvarCozinha(){
if(!cozInsumo)return;
const reg={insumo:cozInsumo,und:cozUnd,porcoes:cozPorcoes,pesoFinal:cozPeso,perdas:cozPerdas,assinatura:cozAss,enviarVitrine:cozEnviar,nomeVitrine:cozNomeVitrine,data:nowStr()};
setCozinha(cs=>[reg,...cs]);
apiPost("/cozinha",reg);
log("Fabricacao registrada","adicao",cozInsumo);
if(cozEnviar){
const nomeV=(cozNomeVitrine&&cozNomeVitrine.trim())?cozNomeVitrine.trim():cozInsumo;
const qtd=+cozPorcoes||1;
setVitrine(vs=>{
const idx=vs.findIndex(v=>v.nome.toLowerCase()===nomeV.toLowerCase());
if(idx>=0){const novo=[...vs];novo[idx]={...novo[idx],produzida:novo[idx].produzida+qtd};return novo;}
return[...vs,{id:"coz_"+Date.now(),nome:nomeV,produzida:qtd,vendida:0,minimo:1,validade:"",validadeMinDias:2}];
});
log("Enviado para vitrine","adicao",nomeV+" ("+qtd+"un)");
}
setShowCozForm(false);
setCozInsumo("");setCozUnd("");setCozPorcoes("");setCozPeso("");setCozPerdas("");setCozEnviar(false);setCozNomeVitrine("");
}

const inp={width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid #2a221a",background:"#161310",color:"#e8d5a3",fontSize:15,boxSizing:"border-box",outline:"none",fontFamily:"inherit"};

if(!logado){return(
<div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"Plus Jakarta Sans,sans-serif",color:P.cream}}>
<div style={{width:"100%",maxWidth:360}}>
<div style={{textAlign:"center",marginBottom:32}}>
<div style={{width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#6b1f2a 50%,#2d5a3d 50%)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
<span style={{color:"#e8d5a3",fontSize:28,fontWeight:700}}>M</span>
</div>
<div style={{fontSize:26,fontWeight:700,letterSpacing:3}}>MUSA</div>
<div style={{fontSize:11,color:P.textMuted,letterSpacing:3,textTransform:"uppercase",marginTop:4}}>Padaria Brasileira</div>
</div>
<div style={{background:P.card,border:"1px solid #2a221a",borderRadius:16,padding:24}}>
<div style={{fontSize:13,color:P.textMuted,marginBottom:16,textAlign:"center"}}>Digite seu nome para entrar</div>
<input type="text" value={inputNome} onChange={e=>setInputNome(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Seu nome..." style={{...inp,marginBottom:12,fontSize:16}} autoFocus/>
<button onClick={login} disabled={inputNome.trim().length<2} style={{width:"100%",padding:14,background:inputNome.trim().length>=2?"linear-gradient(135deg,#6b1f2a,#2d5a3d)":"#1c1813",border:"none",borderRadius:12,color:inputNome.trim().length>=2?P.cream:P.textMuted,fontFamily:"inherit",fontSize:16,fontWeight:700,cursor:inputNome.trim().length>=2?"pointer":"not-allowed"}}>Entrar</button>
</div>
</div>
</div>
);}

const TABS=[["estoque","Estoque"],["vitrine","Vitrine"],["cozinha","Cozinha"],["alertas","Alertas"],["avisos","Avisos"],["historico","Hist."]];

return(
<div style={{minHeight:"100vh",background:P.bg,color:P.cream,fontFamily:"Plus Jakarta Sans,sans-serif"}}>
<div style={{padding:"14px 14px 0"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#6b1f2a 50%,#2d5a3d 50%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
<span style={{color:"#e8d5a3",fontSize:15,fontWeight:700}}>M</span>
</div>
<div>
<div style={{fontSize:15,fontWeight:700,letterSpacing:2}}>MUSA</div>
<div style={{fontSize:9,color:P.textMuted,letterSpacing:1,textTransform:"uppercase"}}>{usuario}{isAdmin?" · Admin":""}</div>
</div>
</div>
<button onClick={()=>{setLogado(false);setUsuario("");setInputNome("");}} style={{background:"transparent",border:"1px solid #2a221a",color:P.textMuted,borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Sair</button>
</div>
{(perigo.length>0||porcCriticos>0||validadesCriticas>0)&&(
<div style={{background:"rgba(107,31,42,0.25)",border:"1px solid rgba(107,31,42,0.5)",borderRadius:10,padding:"7px 12px",marginBottom:10,fontSize:11,color:"#ff9090"}}>
🚨 {perigo.length} critico(s) · ⚠️ {alertas.length} baixo(s){porcCriticos>0?" · ✂️ "+porcCriticos+" porc.":""}{validadesCriticas>0?" · 📅 "+validadesCriticas+" val.":""}
</div>
)}
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:10}}>
{[{l:"Total",v:todosProd.length,c:P.creamDark,bg:"#1c1813"},{l:"Critico",v:perigo.length,c:"#ff6b6b",bg:"#1a0808"},{l:"Baixo",v:alertas.length,c:"#f0b429",bg:"#1a1208"}].map(s=>(
<div key={s.l} style={{background:s.bg,border:"1px solid #2a221a",borderRadius:9,padding:"7px 5px",textAlign:"center"}}>
<div style={{fontSize:17,fontWeight:700,color:s.c}}>{s.v}</div>
<div style={{fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginTop:1}}>{s.l}</div>
</div>
))}
</div>
<div style={{display:"flex",gap:2,background:P.surface,borderRadius:11,padding:3,border:"1px solid #2a221a",marginBottom:12}}>
{TABS.map(([k,l])=>(
<button key={k} onClick={()=>{setTab(k);if(k==="avisos")setAvisosLidos(avisos.map(a=>a.id));}} style={{flex:1,padding:"7px 2px",border:"none",borderRadius:8,background:tab===k?"linear-gradient(135deg,#6b1f2a,#2d5a3d)":"transparent",color:tab===k?P.cream:P.textMuted,fontFamily:"inherit",fontSize:9,cursor:"pointer",fontWeight:tab===k?700:400,position:"relative",whiteSpace:"nowrap"}}>
{l}{k==="avisos"&&avisosNaoLidos>0&&<span style={{position:"absolute",top:0,right:0,background:"#ff6b6b",color:"#fff",borderRadius:"50%",width:12,height:12,fontSize:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{avisosNaoLidos}</span>}
</button>
))}
</div>
</div>

<div style={{padding:"0 12px 120px"}}>

{tab==="estoque"&&(
<div>
<div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:7,marginBottom:9}}>
{cats.map(c=>(
<button key={c.id} onClick={()=>{setCatAtiva(c.id);setBusca("");}} style={{flexShrink:0,padding:"5px 10px",borderRadius:18,border:"1px solid "+(catAtiva===c.id?c.cor:"#2a221a"),background:catAtiva===c.id?c.cor+"22":"transparent",color:catAtiva===c.id?c.cor:P.textMuted,fontFamily:"inherit",fontSize:10,cursor:"pointer",fontWeight:catAtiva===c.id?700:400,whiteSpace:"nowrap"}}>
{c.icon} {c.nome}
</button>
))}
</div>
{catObj&&(
<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
<div style={{fontSize:13,fontWeight:700,color:catObj.cor}}>{catObj.icon} {catObj.nome}</div>
{isAdmin&&<button onClick={()=>{setEditProdId(null);setEditProdCat(catAtiva);setProdNome("");setProdAtual("");setProdMin("");setProdPer("");setProdUnd("un");setShowProdForm(true);}} style={{background:catObj.cor+"22",border:"1px solid "+catObj.cor,color:catObj.cor,borderRadius:7,padding:"4px 9px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>+ Add</button>}
</div>
<div style={{position:"relative",marginBottom:9}}>
<input type="text" value={busca} onChange={e=>setBusca(e.target.value)} placeholder={"🔍 Buscar em "+catObj.nome+"..."} style={{...inp,fontSize:12}}/>
{busca&&<button onClick={()=>setBusca("")} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:P.textMuted,cursor:"pointer",fontSize:15}}>✕</button>}
</div>
{prodsFiltrados.map(prod=>{
const st=gS(prod);const cfg=ST[st];const pct=Math.min(100,(prod.atual/((prod.minimo||1)*1.5))*100);
return(
<div key={prod.id} style={{background:P.card,border:"1px solid #2a221a",borderRadius:14,padding:"14px 14px 14px 18px",marginBottom:8,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:cfg.bar}}/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
<div style={{flex:1}}>
<div style={{fontWeight:700,fontSize:14}}>{prod.nome}</div>
<div style={{fontSize:9,color:P.textMuted,marginTop:2,textTransform:"uppercase"}}>Min {prod.minimo} · Perigo {prod.perigoso} {prod.unidade}</div>
</div>
<span style={{background:cfg.tag,color:cfg.tagText,fontSize:8,fontWeight:700,padding:"2px 7px",borderRadius:20,textTransform:"uppercase",marginLeft:6}}>{cfg.label}</span>
</div>
<div style={{background:"#0a0806",borderRadius:99,height:3,marginBottom:8,overflow:"hidden"}}>
<div style={{width:pct+"%",height:"100%",background:cfg.bar,borderRadius:99}}/>
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:20,fontWeight:700,color:cfg.bar}}>{prod.atual}<span style={{fontSize:11,marginLeft:3,color:P.textMuted}}>{prod.unidade}</span></span>
<div style={{display:"flex",gap:5}}>
<button onClick={()=>{setAtualizando(prod.id);setNovoValor(String(prod.atual));}} style={{background:P.card,border:"1px solid #2a221a",color:P.creamDark,borderRadius:7,padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>Atualizar</button>
{isAdmin&&<button onClick={()=>{setEditProdId(prod.id);setEditProdCat(catAtiva);setProdNome(prod.nome);setProdAtual(String(prod.atual));setProdMin(String(prod.minimo));setProdPer(String(prod.perigoso));setProdUnd(prod.unidade);setShowProdForm(true);}} style={{background:"transparent",border:"1px solid #2a221a",color:P.textMuted,borderRadius:7,padding:"5px 8px",cursor:"pointer",fontSize:12}}>✏</button>}
{isAdmin&&<button onClick={()=>removerProd(catAtiva,prod.id)} style={{background:"transparent",border:"1px solid #3a1515",color:"#6b2020",borderRadius:7,padding:"5px 8px",cursor:"pointer",fontSize:12}}>✕</button>}
</div>
</div>
{atualizando===prod.id&&(
<div style={{display:"flex",gap:6,marginTop:10,paddingTop:10,borderTop:"1px solid #2a221a"}}>
<input type="number" value={novoValor} onChange={e=>setNovoValor(e.target.value)} onKeyDown={e=>e.key==="Enter"&&atualizarProd(catAtiva,prod.id)} style={{...inp,flex:1,fontSize:14,padding:"9px 12px"}} placeholder={"Qtd em "+prod.unidade} autoFocus/>
<button onClick={()=>atualizarProd(catAtiva,prod.id)} style={{background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:8,padding:"0 14px",cursor:"pointer",fontWeight:700,fontSize:15}}>OK</button>
<button onClick={()=>{setAtualizando(null);setNovoValor("");}} style={{background:P.surface,border:"1px solid #2a221a",color:P.textMuted,borderRadius:8,padding:"0 10px",cursor:"pointer",fontSize:14}}>✕</button>
</div>
)}
</div>
);})}
{(catAtiva==="proteinas"||catAtiva==="frios")&&(
<div style={{marginTop:16}}>
<div style={{fontSize:11,fontWeight:700,color:catObj.cor,marginBottom:9,letterSpacing:1}}>✂️ PORCIONAMENTO</div>
<div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:7,marginBottom:9}}>
{(porc[catAtiva]||[]).map(item=>{
const st=gSP(item);const cor=st==="perigo"?"#ff6b6b":st==="alerta"?"#f0b429":"#4caf7d";
return(
<button key={item.id} onClick={()=>setPorcAtiva(pa=>({...pa,[catAtiva]:item.id}))} style={{flexShrink:0,padding:"5px 10px",borderRadius:18,border:"2px solid "+(porcAtiva[catAtiva]===item.id?cor:"#2a221a"),background:porcAtiva[catAtiva]===item.id?cor+"22":"transparent",color:porcAtiva[catAtiva]===item.id?cor:P.textMuted,fontFamily:"inherit",fontSize:10,cursor:"pointer",fontWeight:porcAtiva[catAtiva]===item.id?700:400,whiteSpace:"nowrap",position:"relative"}}>
{item.icon} {item.nome}{st!=="ok"&&<span style={{position:"absolute",top:-3,right:-3,background:cor,borderRadius:"50%",width:7,height:7}}/>}
</button>
);
})}
</div>
{(()=>{
const item=(porc[catAtiva]||[]).find(i=>i.id===porcAtiva[catAtiva]);
if(!item)return null;
const st=gSP(item);const cor=st==="perigo"?"#ff6b6b":st==="alerta"?"#f0b429":"#4caf7d";
const bg=st==="perigo"?"#1a0808":st==="alerta"?"#1a1208":"#1a3326";
const pct=Math.min(100,(item.porcoes/((item.minimo||1)*1.5))*100);
return(
<div style={{background:P.card,border:"2px solid "+cor+"55",borderRadius:13,padding:13}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
<div>
<div style={{fontSize:13,fontWeight:700}}>{item.icon} {item.nome}</div>
<div style={{fontSize:9,color:P.textMuted,marginTop:1}}>Gramatura: {item.gramatura}g/porcao</div>
</div>
<div style={{display:"flex",gap:4,alignItems:"center"}}>
<span style={{background:bg,color:cor,fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:18,textTransform:"uppercase"}}>{st==="perigo"?"Critico":st==="alerta"?"Baixo":"OK"}</span>
<button onClick={()=>{setGramCat(catAtiva);setGramId(item.id);setGramVal(String(item.gramatura));setShowGram(true);}} style={{background:"transparent",border:"1px solid #2a221a",color:P.textMuted,borderRadius:6,padding:"2px 6px",cursor:"pointer",fontSize:9,fontFamily:"inherit"}}>✏g</button>
</div>
</div>
<div style={{background:"#0a0806",borderRadius:99,height:3,marginBottom:9,overflow:"hidden"}}>
<div style={{width:pct+"%",height:"100%",background:cor,borderRadius:99}}/>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginBottom:9}}>
{[{l:"Porcoes",v:item.porcoes,c:cor},{l:"Minimo",v:item.minimo,c:P.textMuted},{l:"Perigoso",v:item.perigoso,c:"#ff6b6b"}].map(s=>(
<div key={s.l} style={{background:P.surface,borderRadius:7,padding:"6px 4px",textAlign:"center",border:"1px solid #2a221a"}}>
<div style={{fontSize:15,fontWeight:700,color:s.c}}>{s.v}</div>
<div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase",letterSpacing:1,marginTop:1}}>{s.l}</div>
</div>
))}
</div>
{st==="perigo"&&<div style={{background:"#1a0808",border:"1px solid #ff6b6b44",borderRadius:7,padding:"6px 9px",marginBottom:7,fontSize:11,color:"#ff9090"}}>🚨 Porcionamento critico! Repor urgente.</div>}
{st==="alerta"&&<div style={{background:"#1a1208",border:"1px solid #f0b42944",borderRadius:7,padding:"6px 9px",marginBottom:7,fontSize:11,color:"#f0d090"}}>⚠️ Porcionamento baixo.</div>}
<button onClick={()=>{setEditPorcCat(catAtiva);setEditPorcId(item.id);setPorcPorcoes(String(item.porcoes));setPorcPerdas(item.perdas||"");setPorcMin(String(item.minimo));setPorcPer(String(item.perigoso));setShowPorcForm(true);}} style={{width:"100%",padding:9,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:9,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit"}}>✏ Atualizar porcionamento</button>
</div>
);
})()}
</div>
)}
</div>
)}
</div>
)}

{tab==="vitrine"&&(
<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:12,color:P.textMuted}}>Producao diaria da vitrine</div>
<button onClick={()=>{setAddVitrineForm({nome:"",minimo:"1",validadeMinDias:"2"});setShowAddVitrine(true);}} style={{background:"#4caf7d22",border:"1px solid #4caf7d",color:"#4caf7d",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>+ Add</button>
</div>
{vitrine.map(p=>{
const restante=p.produzida-p.vendida;
const stQtd=restante<=0?"zerado":restante<p.minimo?"baixo":"ok";
const corQtd=stQtd==="zerado"?"#ff6b6b":stQtd==="baixo"?"#f0b429":"#4caf7d";
const stVal=getValSt(p.validade,p.validadeMinDias);
const vInfo=VAL_ST[stVal];
return(
<div key={p.id} style={{background:P.card,border:"1px solid #2a221a",borderRadius:13,padding:"12px",marginBottom:6,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:stVal==="critico"||stVal==="vencido"?"#ff6b6b":corQtd}}/>
<div style={{paddingLeft:6}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontWeight:700,fontSize:12}}>{p.nome}</div>
{stVal!=="sem"&&<span style={{background:vInfo.bg,color:vInfo.cor,fontSize:7,fontWeight:700,padding:"2px 5px",borderRadius:8}}>{vInfo.icon} {vInfo.label}</span>}
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,marginBottom:6}}>
{[{l:"Produzida",v:p.produzida,c:"#6ab0f0"},{l:"Vendida",v:p.vendida,c:"#f0b429"},{l:"Restante",v:restante,c:corQtd}].map(s=>(
<div key={s.l} style={{background:P.surface,borderRadius:6,padding:"5px 3px",textAlign:"center",border:"1px solid #2a221a"}}>
<div style={{fontSize:13,fontWeight:700,color:s.c}}>{s.v}</div>
<div style={{fontSize:7,color:P.textMuted,textTransform:"uppercase",letterSpacing:1,marginTop:1}}>{s.l}</div>
</div>
))}
</div>
{p.validade&&<div style={{fontSize:9,color:vInfo.cor,marginBottom:5}}>{vInfo.icon} Val: {new Date(p.validade+"T00:00:00").toLocaleDateString("pt-BR")} · Alerta {p.validadeMinDias} dias antes do vencimento</div>}
{editVitrine===p.id?(
<div>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:4,marginBottom:5}}>
<div><div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase",marginBottom:2}}>Produzida</div><input type="number" value={vitrineForm.produzida} onChange={e=>setVitrineForm(vf=>({...vf,produzida:e.target.value}))} style={{width:"100%",padding:"6px",borderRadius:6,border:"1px solid #2a221a",background:P.surface,color:P.cream,fontSize:12,boxSizing:"border-box",outline:"none",textAlign:"center"}}/></div>
<div><div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase",marginBottom:2}}>Vendida</div><input type="number" value={vitrineForm.vendida} onChange={e=>setVitrineForm(vf=>({...vf,vendida:e.target.value}))} style={{width:"100%",padding:"6px",borderRadius:6,border:"1px solid #2a221a",background:P.surface,color:P.cream,fontSize:12,boxSizing:"border-box",outline:"none",textAlign:"center"}}/></div>
<div><div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase",marginBottom:2}}>Minimo</div><input type="number" value={vitrineForm.minimo} onChange={e=>setVitrineForm(vf=>({...vf,minimo:e.target.value}))} style={{width:"100%",padding:"6px",borderRadius:6,border:"1px solid #2a221a",background:P.surface,color:P.cream,fontSize:12,boxSizing:"border-box",outline:"none",textAlign:"center"}}/></div>
<div><div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase",marginBottom:2}}>Validade</div><input type="date" value={vitrineForm.validade} onChange={e=>setVitrineForm(vf=>({...vf,validade:e.target.value}))} style={{width:"100%",padding:"6px",borderRadius:6,border:"1px solid #2a221a",background:P.surface,color:P.cream,fontSize:11,boxSizing:"border-box",outline:"none"}}/></div>
<div><div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase",marginBottom:2}}>Dias antes do vencimento</div><input type="number" value={vitrineForm.validadeMinDias} onChange={e=>setVitrineForm(vf=>({...vf,validadeMinDias:e.target.value}))} style={{width:"100%",padding:"6px",borderRadius:6,border:"1px solid #2a221a",background:P.surface,color:P.cream,fontSize:12,boxSizing:"border-box",outline:"none",textAlign:"center"}}/></div>
</div>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>{setVitrine(vs=>vs.map(x=>x.id===p.id?{...x,produzida:+vitrineForm.produzida||0,vendida:+vitrineForm.vendida||0,minimo:+vitrineForm.minimo||p.minimo,validade:vitrineForm.validade,validadeMinDias:+vitrineForm.validadeMinDias||p.validadeMinDias}:x));log("Vitrine atualizada","atualizacao",p.nome);setEditVitrine(null);}} style={{flex:1,padding:"7px",background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:6,cursor:"pointer",fontWeight:700,fontSize:11,fontFamily:"inherit"}}>Salvar</button>
<button onClick={()=>setEditVitrine(null)} style={{padding:"7px 10px",background:P.surface,border:"1px solid #2a221a",color:P.textMuted,borderRadius:6,cursor:"pointer",fontSize:11}}>Cancelar</button>
</div>
</div>
):(
<div style={{display:"flex",gap:4}}>
<button onClick={()=>{setEditVitrine(p.id);setVitrineForm({produzida:String(p.produzida),vendida:String(p.vendida),minimo:String(p.minimo),validade:p.validade||"",validadeMinDias:String(p.validadeMinDias||2)});}} style={{flex:1,padding:"6px",background:"#1c1813",border:"1px solid #2a221a",color:P.creamDark,borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"inherit"}}>✏ Atualizar</button>
<button onClick={()=>{setVitrine(vs=>vs.filter(x=>x.id!==p.id));log("Removido da vitrine","remocao",p.nome);}} style={{padding:"6px 10px",background:"transparent",border:"1px solid #3a1515",color:"#6b2020",borderRadius:6,cursor:"pointer",fontSize:12}}>✕</button>
</div>
)}
</div>
</div>
);})}
<button onClick={()=>{setVitrine(vs=>vs.map(p=>({...p,produzida:0,vendida:0})));log("Vitrine resetada","edicao","Zerados");}} style={{width:"100%",marginTop:5,padding:11,background:"transparent",border:"1px solid #3a1515",color:"#6b2020",borderRadius:11,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🔄 Zerar producao do dia</button>
</div>
)}

{tab==="cozinha"&&(
<div>
<div style={{fontSize:12,color:P.textMuted,marginBottom:10,padding:"8px 11px",background:P.card,border:"1px solid #2a221a",borderRadius:9}}>Registre a fabricacao. Marque se o produto vai para a vitrine.</div>
<button onClick={()=>{setCozInsumo("");setCozUnd("");setCozPorcoes("");setCozPeso("");setCozPerdas("");setCozAss(usuario);setCozEnviar(false);setCozNomeVitrine("");setShowCozForm(true);}} style={{width:"100%",padding:11,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",marginBottom:10}}>+ Novo registro</button>
{cozinha.length===0?(<div style={{textAlign:"center",padding:"40px 20px",color:P.textMuted}}><div style={{fontSize:34,marginBottom:7}}>🍳</div><div style={{fontSize:12}}>Nenhum registro hoje.</div></div>):(
<div>
{cozinha.map((r,i)=>{
const perdaNum=parseFloat(r.perdas)||0;const pesoNum=parseFloat(r.pesoFinal)||0;
const pct=pesoNum>0?Math.round((perdaNum/pesoNum)*100):0;
const cor=pct>=20?"#ff6b6b":pct>=10?"#f0b429":"#4caf7d";
const bg=pct>=20?"#1a0808":pct>=10?"#1a1208":"#1a3326";
return(
<div key={i} style={{background:P.card,border:"1px solid #2a221a",borderRadius:12,padding:"12px",marginBottom:6,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:r.enviarVitrine?"#6ab0f0":"#6b1f2a"}}/>
<div style={{paddingLeft:6}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
<div><div style={{fontWeight:700,fontSize:12}}>{r.insumo}</div>
{r.enviarVitrine&&<div style={{fontSize:9,color:"#6ab0f0",marginTop:1}}>🍞 Vitrine: {r.nomeVitrine||r.insumo}</div>}</div>
<span style={{fontSize:9,color:P.textMuted}}>{r.data}</span>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:4,marginBottom:5}}>
{[{l:"Und/Kg",v:r.und},{l:"Porcoes",v:r.porcoes},{l:"Peso final",v:r.pesoFinal}].map(s=>(
<div key={s.l} style={{background:P.surface,borderRadius:6,padding:"5px 7px",border:"1px solid #2a221a"}}>
<div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase"}}>{s.l}</div>
<div style={{fontSize:11,fontWeight:600,color:P.cream,marginTop:1}}>{s.v||"-"}</div>
</div>
))}
<div style={{background:bg,borderRadius:6,padding:"5px 7px",border:"1px solid "+cor+"44"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:8,color:P.textMuted,textTransform:"uppercase"}}>Perdas</div>
<div style={{fontSize:11,fontWeight:600,color:cor,marginTop:1}}>{r.perdas||"-"}{pesoNum>0&&perdaNum>0?" ("+pct+"%)":""}</div></div>
<span style={{color:cor,fontSize:9,fontWeight:700}}>{pct>=20?"🚨 CRITICO":pct>=10?"⚠️ ATENCAO":"✅ NORMAL"}</span>
</div>
</div>
</div>
<div style={{display:"flex",justifyContent:"space-between"}}>
<span style={{fontSize:9,color:P.textMuted}}>👤 {r.assinatura}</span>
<button onClick={()=>setCozinha(cs=>cs.filter((_,idx)=>idx!==i))} style={{background:"transparent",border:"1px solid #3a1515",color:"#6b2020",borderRadius:5,padding:"2px 6px",cursor:"pointer",fontSize:9}}>Remover</button>
</div>
</div>
</div>
);})}
<button onClick={()=>setCozinha([])} style={{width:"100%",marginTop:5,padding:11,background:"transparent",border:"1px solid #3a1515",color:"#6b2020",borderRadius:10,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>🔄 Zerar registros</button>
</div>
)}
</div>
)}

{tab==="alertas"&&(
<div>
{perigo.length===0&&porcCriticos===0&&validadesCriticas===0?(<div style={{textAlign:"center",padding:"50px 20px"}}><div style={{fontSize:46,marginBottom:10}}>🌿</div><div style={{fontSize:17,color:"#4caf7d",fontWeight:700}}>Tudo OK!</div><div style={{fontSize:12,color:P.textMuted,marginTop:5}}>Estoque e validades dentro do normal.</div></div>):(
<div>
{validadesCriticas>0&&(<div style={{marginBottom:13}}>
<div style={{fontSize:10,color:"#ff6b6b",fontWeight:700,marginBottom:6,letterSpacing:1}}>📅 VALIDADES</div>
{vitrine.filter(v=>["critico","vencido","prestes"].includes(getValSt(v.validade,v.validadeMinDias))).map(v=>{
const st=getValSt(v.validade,v.validadeMinDias);const vI=VAL_ST[st];
return(<div key={v.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 9px",background:vI.bg,border:"1px solid "+vI.cor+"44",borderRadius:8,marginBottom:3,fontSize:11}}><span style={{color:P.cream}}>{vI.icon} {v.nome}</span><span style={{color:vI.cor,fontWeight:700}}>{v.validade?new Date(v.validade+"T00:00:00").toLocaleDateString("pt-BR"):"Sem data"}</span></div>);
})}
</div>)}
{porcCriticos>0&&(<div style={{marginBottom:13}}>
<div style={{fontSize:10,color:"#ef9a9a",fontWeight:700,marginBottom:6,letterSpacing:1}}>✂️ PORCIONAMENTO</div>
{todosPorc.filter(p=>gSP(p)!=="ok").map(p=>(
<div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 9px",background:gSP(p)==="perigo"?"#120808":"#120f06",border:"1px solid "+(gSP(p)==="perigo"?"#4a1515":"#4a3010"),borderRadius:8,marginBottom:3,fontSize:11,color:P.creamDark}}><span>{p.icon} {p.nome}</span><span style={{color:gSP(p)==="perigo"?"#ff6b6b":"#f0b429",fontWeight:700}}>{p.porcoes} porcoes</span></div>
))}
</div>)}
{cats.map(cat=>{
const crit=cat.produtos.filter(p=>gS(p)==="perigo");const alert=cat.produtos.filter(p=>gS(p)==="alerta");
if(!crit.length&&!alert.length)return null;
return(<div key={cat.id} style={{marginBottom:13}}>
<div style={{fontSize:10,color:cat.cor,fontWeight:700,marginBottom:6,letterSpacing:1}}>{cat.icon} {cat.nome}</div>
{crit.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 9px",background:"#120808",border:"1px solid #4a1515",borderRadius:8,marginBottom:3,fontSize:11,color:P.creamDark}}><span>{p.nome}</span><span style={{color:"#ff6b6b",fontWeight:700}}>{p.atual} {p.unidade}</span></div>)}
{alert.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 9px",background:"#120f06",border:"1px solid #4a3010",borderRadius:8,marginBottom:3,fontSize:11,color:P.creamDark}}><span>{p.nome}</span><span style={{color:"#f0b429",fontWeight:700}}>{p.atual} {p.unidade}</span></div>)}
</div>);
})}
</div>
)}
</div>
)}

{tab==="avisos"&&(
<div>
{isAdmin&&<button onClick={()=>{setAvisoTitulo("");setAvisoMsg("");setAvisoPrior("normal");setShowAvisoForm(true);}} style={{width:"100%",padding:11,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",marginBottom:10}}>+ Novo aviso</button>}
{avisos.length===0?(<div style={{textAlign:"center",padding:"40px 20px",color:P.textMuted}}><div style={{fontSize:34,marginBottom:7}}>📋</div><div style={{fontSize:12}}>Nenhum aviso.</div></div>):(
<div>{avisos.map(a=>{
const naoLido=!avisosLidos.includes(a.id);
const cor=a.prioridade==="urgente"?"#ff6b6b":a.prioridade==="importante"?"#f0b429":"#4caf7d";
const bg=a.prioridade==="urgente"?"#1a0808":a.prioridade==="importante"?"#1a1208":"#1a3326";
const icon=a.prioridade==="urgente"?"🚨":a.prioridade==="importante"?"⚠️":"📌";
return(<div key={a.id} style={{background:P.card,border:"1px solid "+(naoLido?cor+"66":"#2a221a"),borderRadius:12,padding:"12px",marginBottom:6,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:cor}}/>
<div style={{paddingLeft:6}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
<div style={{flex:1}}>
<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
<span>{icon}</span><span style={{fontWeight:700,fontSize:12,color:naoLido?P.cream:P.textMuted}}>{a.titulo}</span>
{naoLido&&<span style={{background:"#ff6b6b",color:"#fff",fontSize:7,fontWeight:700,padding:"1px 4px",borderRadius:7}}>NOVO</span>}
</div>
<span style={{background:bg,color:cor,fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:7,textTransform:"uppercase"}}>{a.prioridade}</span>
</div>
{isAdmin&&<button onClick={()=>setAvisos(av=>av.filter(x=>x.id!==a.id))} style={{background:"transparent",border:"none",color:P.textMuted,cursor:"pointer",fontSize:14,padding:"0 2px"}}>✕</button>}
</div>
<div style={{fontSize:12,color:P.creamDark,lineHeight:1.5,marginBottom:6}}>{a.mensagem}</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:P.textMuted}}><span>👤 {a.autor}</span><span>{a.data}</span></div>
</div>
</div>);})}
</div>
)}
</div>
)}

{tab==="historico"&&(
<div>
<select value={filtroUser} onChange={e=>setFiltroUser(e.target.value)} style={{...inp,marginBottom:9,fontSize:12}}>
{usuarios.map(u=><option key={u} value={u}>{u}</option>)}
</select>
{histFiltrado.length===0?(<div style={{textAlign:"center",padding:"40px 20px",color:P.textMuted,fontSize:12}}>Nenhuma acao registrada.</div>):histFiltrado.map((h,i)=>(
<div key={i} style={{background:P.card,border:"1px solid #2a221a",borderRadius:9,padding:"9px 11px",marginBottom:5}}>
<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:1}}><span style={{fontSize:11}}>{TIPO_ICON[h.tipo]||"📋"}</span><span style={{fontSize:11,color:TIPO_COR[h.tipo]||P.creamDark,fontWeight:700}}>{h.msg}</span></div>
<div style={{fontSize:10,color:P.textMuted,marginBottom:1}}>{h.detalhe}</div>
<div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:9,color:P.textMuted}}>👤 {h.usuario}</span><span style={{fontSize:9,color:P.textDim}}>{h.completo}</span></div>
</div>
))}
</div>
)}
</div>

<Modal show={showProdForm} onClose={()=>setShowProdForm(false)} title={editProdId?"Editar Produto":"Novo Produto"}>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Nome</label><input type="text" value={prodNome} onChange={e=>setProdNome(e.target.value)} style={inp} placeholder="Nome do produto"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Quantidade atual</label><input type="number" value={prodAtual} onChange={e=>setProdAtual(e.target.value)} style={inp} placeholder="0"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Estoque minimo</label><input type="number" value={prodMin} onChange={e=>setProdMin(e.target.value)} style={inp} placeholder="0"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Nivel perigoso</label><input type="number" value={prodPer} onChange={e=>setProdPer(e.target.value)} style={inp} placeholder="0"/></div>
<div style={{marginBottom:16}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Unidade</label><select value={prodUnd} onChange={e=>setProdUnd(e.target.value)} style={inp}>{UNIDADES.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
<button onClick={salvarProd} style={{width:"100%",padding:13,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:11,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>{editProdId?"Salvar":"Adicionar"}</button>
</Modal>

<Modal show={showPorcForm} onClose={()=>setShowPorcForm(false)} title="Atualizar Porcionamento">
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Quantidade de porcoes</label><input type="number" value={porcPorcoes} onChange={e=>setPorcPorcoes(e.target.value)} style={inp} placeholder="0"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Perdas (opcional)</label><input type="text" value={porcPerdas} onChange={e=>setPorcPerdas(e.target.value)} style={inp} placeholder="Perdas"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Minimo de porcoes</label><input type="number" value={porcMin} onChange={e=>setPorcMin(e.target.value)} style={inp} placeholder="0"/></div>
<div style={{marginBottom:16}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Nivel perigoso</label><input type="number" value={porcPer} onChange={e=>setPorcPer(e.target.value)} style={inp} placeholder="0"/></div>
<button onClick={salvarPorc} style={{width:"100%",padding:13,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:11,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Salvar</button>
</Modal>

<Modal show={showGram} onClose={()=>setShowGram(false)} title="Editar Gramatura">
<div style={{marginBottom:16}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Gramatura por porcao (g)</label><input type="number" value={gramVal} onChange={e=>setGramVal(e.target.value)} style={inp} autoFocus/></div>
<button onClick={()=>{setPorc(ps=>({...ps,[gramCat]:ps[gramCat].map(i=>i.id===gramId?{...i,gramatura:+gramVal||i.gramatura}:i)}));setShowGram(false);}} style={{width:"100%",padding:13,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:11,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Salvar gramatura</button>
</Modal>

<Modal show={showAddVitrine} onClose={()=>setShowAddVitrine(false)} title="Novo Produto na Vitrine">
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Nome do produto</label><input type="text" value={addVitrineForm.nome} onChange={e=>setAddVitrineForm(af=>({...af,nome:e.target.value}))} style={inp} placeholder="Nome"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Quantidade minima</label><input type="number" value={addVitrineForm.minimo} onChange={e=>setAddVitrineForm(af=>({...af,minimo:e.target.value}))} style={inp} placeholder="1"/></div>
<div style={{marginBottom:16}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Dias antes do vencimento</label><input type="number" value={addVitrineForm.validadeMinDias} onChange={e=>setAddVitrineForm(af=>({...af,validadeMinDias:e.target.value}))} style={inp} placeholder="2"/></div>
<button onClick={()=>{if(!addVitrineForm.nome)return;setVitrine(vs=>[...vs,{id:"v_"+Date.now(),nome:addVitrineForm.nome,produzida:0,vendida:0,minimo:+addVitrineForm.minimo||1,validade:"",validadeMinDias:+addVitrineForm.validadeMinDias||2}]);log("Produto adicionado a vitrine","adicao",addVitrineForm.nome);setShowAddVitrine(false);}} style={{width:"100%",padding:13,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:11,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Adicionar</button>
</Modal>

<Modal show={showCozForm} onClose={()=>setShowCozForm(false)} title="Registro de Fabricacao">
<div style={{marginBottom:12}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:cozEnviar?"#1a2a1a":"#1c1813",border:"1px solid "+(cozEnviar?"#4caf7d":"#2a221a"),borderRadius:10,cursor:"pointer"}} onClick={()=>setCozEnviar(v=>!v)}>
<div><div style={{fontSize:13,fontWeight:700,color:cozEnviar?"#4caf7d":P.textMuted}}>🍞 Enviar para vitrine?</div><div style={{fontSize:10,color:P.textMuted,marginTop:2}}>Integrar com a vitrine do balcao</div></div>
<div style={{width:40,height:22,borderRadius:11,background:cozEnviar?"#4caf7d":"#2a221a",position:"relative",flexShrink:0}}><div style={{position:"absolute",top:3,left:cozEnviar?19:3,width:16,height:16,borderRadius:"50%",background:"#fff"}}/></div>
</div>
{cozEnviar&&(<div style={{marginTop:8}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Nome na vitrine (opcional)</label><input type="text" value={cozNomeVitrine} onChange={e=>setCozNomeVitrine(e.target.value)} style={inp} placeholder="Deixe vazio para usar o nome do insumo"/></div>)}
</div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Insumo/Produto</label><input type="text" value={cozInsumo} onChange={e=>setCozInsumo(e.target.value)} style={inp} placeholder="Nome do insumo"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Und / Kg</label><input type="text" value={cozUnd} onChange={e=>setCozUnd(e.target.value)} style={inp} placeholder="Ex: 2kg"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Qtd de porcoes</label><input type="number" value={cozPorcoes} onChange={e=>setCozPorcoes(e.target.value)} style={inp} placeholder="0"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Peso final</label><input type="text" value={cozPeso} onChange={e=>setCozPeso(e.target.value)} style={inp} placeholder="Ex: 1.8kg"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Perdas</label><input type="text" value={cozPerdas} onChange={e=>setCozPerdas(e.target.value)} style={inp} placeholder="Ex: 200g"/></div>
<div style={{marginBottom:16}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Assinatura</label><input type="text" value={cozAss} onChange={e=>setCozAss(e.target.value)} style={inp} placeholder="Seu nome"/></div>
<button onClick={salvarCozinha} style={{width:"100%",padding:13,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:11,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Salvar registro</button>
</Modal>

<Modal show={showAvisoForm} onClose={()=>setShowAvisoForm(false)} title="Novo Aviso">
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Titulo</label><input type="text" value={avisoTitulo} onChange={e=>setAvisoTitulo(e.target.value)} style={inp} placeholder="Titulo do aviso"/></div>
<div style={{marginBottom:10}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Mensagem</label><textarea value={avisoMsg} onChange={e=>setAvisoMsg(e.target.value)} style={{...inp,minHeight:80,resize:"vertical"}} placeholder="Escreva o aviso para a equipe..."/></div>
<div style={{marginBottom:16}}><label style={{display:"block",fontSize:8,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Prioridade</label>
<div style={{display:"flex",gap:5}}>
{[["normal","📌 Normal","#4caf7d"],["importante","⚠️ Importante","#f0b429"],["urgente","🚨 Urgente","#ff6b6b"]].map(([val,lbl,cor])=>(
<button key={val} onClick={()=>setAvisoPrior(val)} style={{flex:1,padding:"8px 3px",borderRadius:8,border:"2px solid "+(avisoPrior===val?cor:"#2a221a"),background:avisoPrior===val?cor+"22":"transparent",color:avisoPrior===val?cor:P.textMuted,fontFamily:"inherit",fontSize:9,cursor:"pointer",fontWeight:avisoPrior===val?700:400}}>{lbl}</button>
))}
</div></div>
<button onClick={()=>{if(!avisoTitulo||!avisoMsg)return;const novo={titulo:avisoTitulo,mensagem:avisoMsg,prioridade:avisoPrior,autor:usuario,data:nowStr()};apiPost("/avisos",novo).then(saved=>{if(saved)setAvisos(av=>[saved,...av]);});setShowAvisoForm(false);log("Aviso criado","adicao",avisoTitulo);}} style={{width:"100%",padding:13,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:11,cursor:"pointer",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>Publicar aviso</button>
</Modal>

</div>
);
}
