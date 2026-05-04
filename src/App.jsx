import{useState}from"react";
const P={bg:"#0e0c0a",surface:"#161310",card:"#1c1813",cardBorder:"#2a221a",cream:"#e8d5a3",creamDark:"#c4b07a",textMuted:"#7a6a52",textDim:"#4a3f30"};
const IP=[{id:1,nome:"Farinha de Trigo",atual:15,minimo:20,perigoso:10,unidade:"kg"},{id:2,nome:"Acucar",atual:8,minimo:15,perigoso:5,unidade:"kg"},{id:3,nome:"Fermento",atual:300,minimo:500,perigoso:150,unidade:"g"},{id:4,nome:"Manteiga",atual:3,minimo:5,perigoso:2,unidade:"kg"},{id:5,nome:"Ovos",atual:24,minimo:30,perigoso:12,unidade:"un"}];
function gS(i){if(i.atual<=i.perigoso)return"perigo";if(i.atual<=i.minimo)return"alerta";return"ok";}
const SC={ok:{label:"Estavel",dot:"#4caf7d",bar:"#4caf7d",tag:"#1a3326",tagText:"#4caf7d"},alerta:{label:"Baixo",dot:"#f0b429",bar:"#f0b429",tag:"#3a2a0a",tagText:"#f0b429"},perigo:{label:"Critico",dot:"#ff6b6b",bar:"#ff6b6b",tag:"#3a0f0f",tagText:"#ff6b6b"}};
export default function App(){
const[produtos,setP]=useState(IP);
const[tab,setTab]=useState("estoque");
const[showForm,setSF]=useState(false);
const[editando,setE]=useState(null);
const[form,setForm]=useState({nome:"",atual:"",minimo:"",perigoso:"",unidade:"un"});
const[atualizando,setA]=useState(null);
const[novoValor,setNV]=useState("");
const[historico,setH]=useState([]);
const perigo=produtos.filter(p=>gS(p)==="perigo");
const alertas=produtos.filter(p=>gS(p)==="alerta");
const criticos=[...perigo,...alertas];
function addLog(msg){const hora=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});setH(h=>[{msg,hora},...h].slice(0,30));}
function salvar(){if(!form.nome||form.atual===""||form.minimo===""||form.perigoso==="")return;const item={id:editando?.id||Date.now(),nome:form.nome,atual:+form.atual,minimo:+form.minimo,perigoso:+form.perigoso,unidade:form.unidade};if(editando){setP(p=>p.map(x=>x.id===editando.id?item:x));addLog("Editado: "+item.nome);}else{setP(p=>[...p,item]);addLog("Adicionado: "+item.nome);}setForm({nome:"",atual:"",minimo:"",perigoso:"",unidade:"un"});setSF(false);setE(null);}
function remover(id){const p=produtos.find(x=>x.id===id);setP(ps=>ps.filter(x=>x.id!==id));addLog("Removido: "+p.nome);}
function editar(p){setE(p);setForm({nome:p.nome,atual:p.atual,minimo:p.minimo,perigoso:p.perigoso,unidade:p.unidade});setSF(true);}
function atualizar(id){const val=parseFloat(novoValor);if(isNaN(val))return;const p=produtos.find(x=>x.id===id);setP(ps=>ps.map(x=>x.id===id?{...x,atual:val}:x));addLog("Atualizado: "+p.nome);setA(null);setNV("");}
const inp={width:"100%",padding:"12px 14px",borderRadius:10,border:"1px solid #2a221a",background:"#161310",color:"#e8d5a3",fontSize:15,boxSizing:"border-box",outline:"none",fontFamily:"inherit"};
return(
<div style={{minHeight:"100vh",background:P.bg,color:P.cream,fontFamily:"Georgia,serif"}}>
<div style={{padding:"20px 20px 0"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#6b1f2a 50%,#2d5a3d 50%)",display:"flex",alignItems:"center",justifyContent:"center"}}>
<span style={{color:"#e8d5a3",fontSize:17,fontWeight:700}}>M</span>
</div>
<div>
<div style={{fontSize:22,fontWeight:700,letterSpacing:3}}>MUSA</div>
<div style={{fontSize:9,color:P.textMuted,letterSpacing:3,textTransform:"uppercase"}}>Controle de Estoque</div>
</div>
</div>
{criticos.length>0&&<div style={{background:"rgba(107,31,42,0.25)",border:"1px solid rgba(107,31,42,0.5)",borderRadius:20,padding:"5px 14px",fontSize:12,color:"#ff9090"}}>{criticos.length} alertas</div>}
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
{[{l:"Total",v:produtos.length,c:P.creamDark,bg:"#1c1813"},{l:"Critico",v:perigo.length,c:"#ff6b6b",bg:"#1a0808"},{l:"Baixo",v:alertas.length,c:"#f0b429",bg:"#1a1208"}].map(s=>(
<div key={s.l} style={{background:s.bg,border:"1px solid #2a221a",borderRadius:12,padding:"12px 8px",textAlign:"center"}}>
<div style={{fontSize:24,fontWeight:700,color:s.c}}>{s.v}</div>
<div style={{fontSize:9,color:P.textMuted,letterSpacing:2,textTransform:"uppercase",marginTop:2}}>{s.l}</div>
</div>
))}
</div>
<div style={{display:"flex",gap:4,background:P.surface,borderRadius:12,padding:4,border:"1px solid #2a221a",marginBottom:20}}>
{[["estoque","Estoque"],["alertas","Alertas"],["historico","Historico"]].map(([k,l])=>(
<button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px 6px",border:"none",borderRadius:9,background:tab===k?"linear-gradient(135deg,#6b1f2a,#2d5a3d)":"transparent",color:tab===k?P.cream:P.textMuted,fontFamily:"inherit",fontSize:13,cursor:"pointer",fontWeight:tab===k?700:400}}>{l}</button>
))}
</div>
</div>
<div style={{padding:"0 20px 120px"}}>
{tab==="estoque"&&(
<div>
{produtos.map(prod=>{
const st=gS(prod);
const cfg=SC[st];
const pct=Math.min(100,(prod.atual/(prod.minimo*1.5))*100);
return(
<div key={prod.id} style={{background:P.card,border:"1px solid #2a221a",borderRadius:16,padding:"16px 16px 16px 20px",marginBottom:10,position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:cfg.bar}}/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
<div>
<div style={{fontWeight:700,fontSize:16}}>{prod.nome}</div>
<div style={{fontSize:10,color:P.textMuted,marginTop:3,textTransform:"uppercase"}}>Min {prod.minimo}{prod.unidade} - Perigoso {prod.perigoso}{prod.unidade}</div>
</div>
<span style={{background:cfg.tag,color:cfg.tagText,fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:20,textTransform:"uppercase"}}>{cfg.label}</span>
</div>
<div style={{background:"#0a0806",borderRadius:99,height:4,marginBottom:10,overflow:"hidden"}}>
<div style={{width:pct+"%",height:"100%",background:cfg.bar,borderRadius:99}}/>
</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:24,fontWeight:700,color:cfg.bar}}>{prod.atual}<span style={{fontSize:12,marginLeft:4,color:P.textMuted}}>{prod.unidade}</span></span>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{setA(prod.id);setNV(String(prod.atual));}} style={{background:"#1c1813",border:"1px solid #2a221a",color:P.creamDark,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"inherit"}}>Atualizar</button>
<button onClick={()=>editar(prod)} style={{background:"transparent",border:"1px solid #2a221a",color:P.textMuted,borderRadius:8,padding:"6px 10px",cursor:"pointer"}}>✏</button>
<button onClick={()=>remover(prod.id)} style={{background:"transparent",border:"1px solid #3a1515",color:"#6b2020",borderRadius:8,padding:"6px 10px",cursor:"pointer"}}>X</button>
</div>
</div>
{atualizando===prod.id&&(
<div style={{display:"flex",gap:8,marginTop:12,paddingTop:12,borderTop:"1px solid #2a221a"}}>
<input type="number" value={novoValor} onChange={e=>setNV(e.target.value)} onKeyDown={e=>e.key==="Enter"&&atualizar(prod.id)} style={{...inp,flex:1}} placeholder={"Qtd em "+prod.unidade} autoFocus/>
<button onClick={()=>atualizar(prod.id)} style={{background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:10,padding:"0 16px",cursor:"pointer",fontWeight:700,fontSize:16}}>OK</button>
<button onClick={()=>{setA(null);setNV("");}} style={{background:P.surface,border:"1px solid #2a221a",color:P.textMuted,borderRadius:10,padding:"0 12px",cursor:"pointer"}}>X</button>
</div>
)}
</div>
);
})}
<button onClick={()=>{setSF(true);setE(null);setForm({nome:"",atual:"",minimo:"",perigoso:"",unidade:"un"});}} style={{width:"100%",padding:16,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:14,cursor:"pointer",fontSize:16,fontWeight:700,fontFamily:"inherit",marginTop:4}}>+ Novo Produto</button>
</div>
)}
{tab==="alertas"&&(
<div>
{criticos.length===0?(
<div style={{textAlign:"center",padding:"60px 20px"}}>
<div style={{fontSize:48,marginBottom:12}}>🌿</div>
<div style={{fontSize:20,color:"#4caf7d",fontWeight:700}}>Estoque equilibrado</div>
<div style={{fontSize:13,color:P.textMuted,marginTop:8}}>Todos os itens acima do minimo.</div>
</div>
):(
<div>
{perigo.length>0&&(
<div style={{background:"#120808",border:"1px solid #4a1515",borderRadius:14,padding:16,marginBottom:12}}>
<div style={{fontSize:9,letterSpacing:2.5,color:"#ff6b6b",fontWeight:700,marginBottom:12,textTransform:"uppercase"}}>NIVEL CRITICO</div>
{perigo.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #3a1515",color:P.creamDark,fontSize:14}}><span>{p.nome}</span><span style={{color:"#ff6b6b",fontWeight:700}}>{p.atual} {p.unidade}</span></div>)}
</div>
)}
{alertas.length>0&&(
<div style={{background:"#120f06",border:"1px solid #4a3010",borderRadius:14,padding:16,marginBottom:16}}>
<div style={{fontSize:9,letterSpacing:2.5,color:"#f0b429",fontWeight:700,marginBottom:12,textTransform:"uppercase"}}>ESTOQUE BAIXO</div>
{alertas.map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid #3a2508",color:P.creamDark,fontSize:14}}><span>{p.nome}</span><span style={{color:"#f0b429",fontWeight:700}}>{p.atual} {p.unidade}</span></div>)}
</div>
)}
</div>
)}
</div>
)}
{tab==="historico"&&(
<div>
{historico.length===0?(
<div style={{textAlign:"center",padding:"60px 20px",color:P.textMuted}}>
<div style={{marginTop:10,fontSize:14}}>Nenhuma acao registrada.</div>
</div>
):historico.map((h,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 16px",background:P.card,border:"1px solid #2a221a",borderRadius:12,marginBottom:8}}>
<span style={{fontSize:13,color:P.creamDark}}>{h.msg}</span>
<span style={{fontSize:11,color:P.textMuted,whiteSpace:"nowrap",marginLeft:12}}>{h.hora}</span>
</div>
))}
</div>
)}
</div>
{showForm&&(
<div onClick={e=>e.target===e.currentTarget&&setSF(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",display:"flex",alignItems:"flex-end",zIndex:200}}>
<div style={{background:P.surface,width:"100%",borderRadius:"22px 22px 0 0",padding:"28px 20px 50px",maxHeight:"88vh",overflowY:"auto",border:"1px solid #2a221a",borderBottom:"none"}}>
<div style={{width:36,height:3,background:P.textDim,borderRadius:99,margin:"0 auto 28px"}}/>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:26}}>
<div style={{fontSize:20,fontWeight:700}}>{editando?"Editar Produto":"Novo Produto"}</div>
<button onClick={()=>setSF(false)} style={{background:P.card,border:"1px solid #2a221a",color:P.textMuted,borderRadius:8,width:34,height:34,cursor:"pointer"}}>X</button>
</div>
{[["nome","Nome do produto","text"],["atual","Quantidade atual","number"],["minimo","Estoque minimo","number"],["perigoso","Nivel perigoso","number"]].map(([field,label,type])=>(
<div key={field} style={{marginBottom:14}}>
<label style={{display:"block",fontSize:9,color:P.textMuted,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>{label}</label>
<input type={type} value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} style={inp} placeholder={label}/>
</div>
))}
<div style={{marginBottom:26}}>
<label style={{display:"block",fontSize:9,color:P.textMuted,letterSpacing:2.5,textTransform:"uppercase",marginBottom:8}}>Unidade</label>
<select value={form.unidade} onChange={e=>setForm(f=>({...f,unidade:e.target.value}))} style={inp}>
{["un","kg","g","L","ml","cx","pct","sc"].map(u=><option key={u} value={u}>{u}</option>)}
</select>
</div>
<button onClick={salvar} style={{width:"100%",padding:16,background:"linear-gradient(135deg,#6b1f2a,#2d5a3d)",color:P.cream,border:"none",borderRadius:14,cursor:"pointer",fontSize:17,fontWeight:700,fontFamily:"inherit"}}>
{editando?"Salvar alteracoes":"Adicionar produto"}
</button>
</div>
</div>
)}
</div>
);
}
