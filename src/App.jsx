import { useState } from “react”;

const PALETTE = {
bg: “#0e0c0a”, surface: “#161310”, card: “#1c1813”, cardBorder: “#2a221a”,
cream: “#e8d5a3”, creamDark: “#c4b07a”, textMuted: “#7a6a52”, textDim: “#4a3f30”,
};

const INITIAL_PRODUCTS = [
{ id: 1, nome: “Farinha de Trigo”, atual: 15, minimo: 20, perigoso: 10, unidade: “kg” },
{ id: 2, nome: “Açúcar”, atual: 8, minimo: 15, perigoso: 5, unidade: “kg” },
{ id: 3, nome: “Fermento Biológico”, atual: 300, minimo: 500, perigoso: 150, unidade: “g” },
{ id: 4, nome: “Manteiga”, atual: 3, minimo: 5, perigoso: 2, unidade: “kg” },
{ id: 5, nome: “Ovos”, atual: 24, minimo: 30, perigoso: 12, unidade: “un” },
];

function getStatus(item) {
if (item.atual <= item.perigoso) return “perigo”;
if (item.atual <= item.minimo) return “alerta”;
return “ok”;
}

const STATUS_CFG = {
ok:     { label: “Estável”, dot: “#4caf7d”, bar: “#4caf7d”, tag: “#1a3326”, tagText: “#4caf7d” },
alerta: { label: “Baixo”,   dot: “#f0b429”, bar: “#f0b429”, tag: “#3a2a0a”, tagText: “#f0b429” },
perigo: { label: “Crítico”, dot: “#ff6b6b”, bar: “#ff6b6b”, tag: “#3a0f0f”, tagText: “#ff6b6b” },
};

const MusaLogo = ({ size = 44 }) => (

  <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", position: "relative", flexShrink: 0, boxShadow: "0 0 20px rgba(107,31,42,0.4)" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #6b1f2a 50%, #2d5a3d 50%)" }} />
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#e8d5a3", fontSize: size * 0.38, fontWeight: 700 }}>M</span>
    </div>
  </div>
);

export default function EstoqueMusa() {
const [produtos, setProdutos] = useState(INITIAL_PRODUCTS);
const [tab, setTab] = useState(“estoque”);
const [showForm, setShowForm] = useState(false);
const [editando, setEditando] = useState(null);
const [form, setForm] = useState({ nome: “”, atual: “”, minimo: “”, perigoso: “”, unidade: “un” });
const [atualizando, setAtualizando] = useState(null);
const [novoValor, setNovoValor] = useState(””);
const [historico, setHistorico] = useState([]);
const [ia, setIa] = useState({ loading: false, msg: “” });

const perigo = produtos.filter(p => getStatus(p) === “perigo”);
const alertas = produtos.filter(p => getStatus(p) === “alerta”);
const criticos = […perigo, …alertas];

function addLog(msg) {
const hora = new Date().toLocaleTimeString(“pt-BR”, { hour: “2-digit”, minute: “2-digit” });
setHistorico(h => [{ msg, hora }, …h].slice(0, 30));
}

function salvar() {
if (!form.nome || form.atual === “” || form.minimo === “” || form.perigoso === “”) return;
const item = { id: editando?.id || Date.now(), nome: form.nome, atual: +form.atual, minimo: +form.minimo, perigoso: +form.perigoso, unidade: form.unidade };
if (editando) { setProdutos(p => p.map(x => x.id === editando.id ? item : x)); addLog(Editado · ${item.nome}); }
else { setProdutos(p => […p, item]); addLog(Adicionado · ${item.nome}); }
setForm({ nome: “”, atual: “”, minimo: “”, perigoso: “”, unidade: “un” });
setShowForm(false); setEditando(null);
}

function remover(id) {
const p = produtos.find(x => x.id === id);
setProdutos(ps => ps.filter(x => x.id !== id));
addLog(Removido · ${p.nome});
}

function editar(p) {
setEditando(p);
setForm({ nome: p.nome, atual: p.atual, minimo: p.minimo, perigoso: p.perigoso, unidade: p.unidade });
setShowForm(true);
}

function atualizar(id) {
const val = parseFloat(novoValor);
if (isNaN(val)) return;
const p = produtos.find(x => x.id === id);
setProdutos(ps => ps.map(x => x.id === id ? { …x, atual: val } : x));
addLog(Atualizado · ${p.nome} → ${val} ${p.unidade});
setAtualizando(null); setNovoValor(””);
}

async function gerarMensagem() {
if (!criticos.length) return;
setIa({ loading: true, msg: “” });
const lista = criticos.map(p => - ${p.nome}: ${p.atual}${p.unidade} (mín: ${p.minimo}${p.unidade}, crítico: ${p.perigoso}${p.unidade}) — ${getStatus(p) === "perigo" ? "CRÍTICO" : "BAIXO"}).join(”\n”);
try {
const res = await fetch(“https://api.anthropic.com/v1/messages”, {
method: “POST”, headers: { “Content-Type”: “application/json” },
body: JSON.stringify({ model: “claude-sonnet-4-20250514”, max_tokens: 1000, messages: [{ role: “user”, content: Você é assistente da padaria Musa. Gere mensagem de WhatsApp para o fornecedor pedindo reposição urgente. Tom profissional, use emojis. Itens CRÍTICOS primeiro:\n${lista} }] }),
});
const data = await res.json();
setIa({ loading: false, msg: data.content?.map(c => c.text || “”).join(””) || “Erro.” });
addLog(“IA gerou mensagem de reposição”);
} catch { setIa({ loading: false, msg: “Erro de conexão.” }); }
}

const inp = { width: “100%”, padding: “12px 14px”, borderRadius: 10, border: 1px solid ${PALETTE.cardBorder}, background: PALETTE.surface, color: PALETTE.cream, fontSize: 15, boxSizing: “border-box”, outline: “none”, fontFamily: “inherit” };

return (
<div style={{ minHeight: “100vh”, background: PALETTE.bg, color: PALETTE.cream, fontFamily: “‘DM Serif Display’, Georgia, serif” }}>
<style>{@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Playfair+Display:wght@700&display=swap'); * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; } input::placeholder { color: #4a3f30; } input:focus, select:focus { border-color: #8b4a2a !important; } ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-thumb { background: #2a1f15; border-radius: 99px; } .bar { transition: width 0.7s ease; } .modal-bg { animation: bgIn 0.2s ease; } .modal-sheet { animation: sheetUp 0.3s cubic-bezier(0.32,0.72,0,1); } @keyframes bgIn { from { opacity:0; } to { opacity:1; } } @keyframes sheetUp { from { transform:translateY(100%); } to { transform:translateY(0); } } .fade-in { animation: fadeIn 0.25s ease; } @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }}</style>


  <div style={{ position: "fixed", top: -100, left: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(107,31,42,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
  <div style={{ position: "fixed", bottom: 50, right: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,90,61,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

  {/* Header */}
  <div style={{ padding: "20px 20px 0" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <MusaLogo size={44} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, lineHeight: 1 }}>MUSA</div>
          <div style={{ fontSize: 9, color: PALETTE.textMuted, letterSpacing: 3, textTransform: "uppercase", marginTop: 3 }}>Controle de Estoque</div>
        </div>
      </div>
      {criticos.length > 0 && (
        <div style={{ background: "rgba(107,31,42,0.25)", border: "1px solid rgba(107,31,42,0.5)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#ff9090" }}>
          {criticos.length} alerta{criticos.length > 1 ? "s" : ""}
        </div>
      )}
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
      {[{l:"Total",v:produtos.length,c:PALETTE.creamDark,bg:"#1c1813"},{l:"Crítico",v:perigo.length,c:"#ff6b6b",bg:"#1a0808"},{l:"Baixo",v:alertas.length,c:"#f0b429",bg:"#1a1208"}].map(s => (
        <div key={s.l} style={{ background: s.bg, border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: s.c }}>{s.v}</div>
          <div style={{ fontSize: 9, color: PALETTE.textMuted, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
        </div>
      ))}
    </div>

    <div style={{ display: "flex", gap: 4, background: PALETTE.surface, borderRadius: 12, padding: 4, border: `1px solid ${PALETTE.cardBorder}`, marginBottom: 20 }}>
      {[["estoque","Estoque"],["alertas","Alertas"],["historico","Histórico"]].map(([k,l]) => (
        <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:"9px 6px", border:"none", borderRadius:9, background: tab===k ? "linear-gradient(135deg,#6b1f2a,#2d5a3d)" : "transparent", color: tab===k ? PALETTE.cream : PALETTE.textMuted, fontFamily:"inherit", fontSize:13, cursor:"pointer", fontWeight: tab===k ? 700 : 400, letterSpacing:0.5, transition:"all 0.2s" }}>{l}</button>
      ))}
    </div>
  </div>

  <div style={{ padding: "0 20px 120px" }}>

    {/* ESTOQUE */}
    {tab === "estoque" && <>
      {produtos.map(prod => {
        const st = getStatus(prod);
        const cfg = STATUS_CFG[st];
        const pct = Math.min(100, (prod.atual / (prod.minimo * 1.5)) * 100);
        return (
          <div key={prod.id} className="fade-in" style={{ background: PALETTE.card, border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 16, padding: "16px 16px 16px 20px", marginBottom: 10, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: cfg.bar }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{prod.nome}</div>
                <div style={{ fontSize: 10, color: PALETTE.textMuted, marginTop: 3, letterSpacing: 1.5, textTransform: "uppercase" }}>Mín {prod.minimo}{prod.unidade} · Perigoso {prod.perigoso}{prod.unidade}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: cfg.tag, color: cfg.tagText, fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: 1.5, textTransform: "uppercase" }}>{cfg.label}</span>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }} />
              </div>
            </div>
            <div style={{ background: "#0a0806", borderRadius: 99, height: 4, marginBottom: 10, overflow: "hidden" }}>
              <div className="bar" style={{ width: `${pct}%`, height: "100%", background: cfg.bar, borderRadius: 99 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: cfg.bar }}>{prod.atual}<span style={{ fontSize: 12, marginLeft: 4, color: PALETTE.textMuted }}>{prod.unidade}</span></span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setAtualizando(prod.id); setNovoValor(String(prod.atual)); }} style={{ background: "#1c1813", border: `1px solid ${PALETTE.cardBorder}`, color: PALETTE.creamDark, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Atualizar</button>
                <button onClick={() => editar(prod)} style={{ background: "transparent", border: `1px solid ${PALETTE.cardBorder}`, color: PALETTE.textMuted, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>✏️</button>
                <button onClick={() => remover(prod.id)} style={{ background: "transparent", border: "1px solid #3a1515", color: "#6b2020", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            </div>
            {atualizando === prod.id && (
              <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${PALETTE.cardBorder}` }}>
                <input type="number" value={novoValor} onChange={e => setNovoValor(e.target.value)} onKeyDown={e => e.key === "Enter" && atualizar(prod.id)} style={{ ...inp, flex: 1 }} placeholder={`Qtd em ${prod.unidade}`} autoFocus />
                <button onClick={() => atualizar(prod.id)} style={{ background: "linear-gradient(135deg,#6b1f2a,#2d5a3d)", color: PALETTE.cream, border: "none", borderRadius: 10, padding: "0 16px", cursor: "pointer", fontWeight: 700, fontSize: 16, fontFamily: "inherit" }}>✓</button>
                <button onClick={() => { setAtualizando(null); setNovoValor(""); }} style={{ background: PALETTE.surface, border: `1px solid ${PALETTE.cardBorder}`, color: PALETTE.textMuted, borderRadius: 10, padding: "0 12px", cursor: "pointer", fontSize: 16 }}>✕</button>
              </div>
            )}
          </div>
        );
      })}
      <button onClick={() => { setShowForm(true); setEditando(null); setForm({ nome:"",atual:"",minimo:"",perigoso:"",unidade:"un" }); }} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#6b1f2a,#2d5a3d)", color: PALETTE.cream, border: "none", borderRadius: 14, cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "inherit", letterSpacing: 1.5, marginTop: 4 }}>+ Novo Produto</button>
    </>}

    {/* ALERTAS */}
    {tab === "alertas" && (
      criticos.length === 0
        ? <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
            <div style={{ fontSize: 20, color: "#4caf7d", fontWeight: 700 }}>Estoque equilibrado</div>
            <div style={{ fontSize: 13, color: PALETTE.textMuted, marginTop: 8 }}>Todos os itens acima do mínimo.</div>
          </div>
        : <>
            {perigo.length > 0 && <div style={{ background: "#120808", border: "1px solid #4a1515", borderRadius: 14, padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#ff6b6b", fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>⬤ Nível Crítico</div>
              {perigo.map(p => <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #3a1515", color: PALETTE.creamDark, fontSize: 14 }}><span>{p.nome}</span><span style={{ color: "#ff6b6b", fontWeight: 700 }}>{p.atual} {p.unidade}</span></div>)}
            </div>}
            {alertas.length > 0 && <div style={{ background: "#120f06", border: "1px solid #4a3010", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#f0b429", fontWeight: 700, marginBottom: 12, textTransform: "uppercase" }}>⬤ Estoque Baixo</div>
              {alertas.map(p => <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #3a2508", color: PALETTE.creamDark, fontSize: 14 }}><span>{p.nome}</span><span style={{ color: "#f0b429", fontWeight: 700 }}>{p.atual} {p.unidade}</span></div>)}
            </div>}
            <button onClick={gerarMensagem} disabled={ia.loading} style={{ width: "100%", padding: 15, background: ia.loading ? PALETTE.surface : "linear-gradient(135deg,#1a3a8a,#2d5a9a)", color: ia.loading ? PALETTE.textMuted : PALETTE.cream, border: `1px solid ${ia.loading ? PALETTE.cardBorder : "#2d5a9a"}`, borderRadius: 14, cursor: ia.loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: 700, fontFamily: "inherit", marginBottom: 14, letterSpacing: 1 }}>
              {ia.loading ? "⏳  Gerando mensagem..." : "✦  Gerar Mensagem com IA"}
            </button>
            {ia.msg && <div className="fade-in" style={{ background: "#0c1220", border: "1px solid #1a3a5a", borderRadius: 14, padding: 18 }}>
              <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#6ab0f0", marginBottom: 12, textTransform: "uppercase", fontWeight: 700 }}>✦ Mensagem Gerada</div>
              <div style={{ whiteSpace: "pre-wrap", fontSize: 14, color: "#c8dff5", lineHeight: 1.7 }}>{ia.msg}</div>
              <button onClick={() => navigator.clipboard.writeText(ia.msg)} style={{ marginTop: 14, background: "#1a3a5a", color: "#a0c8f0", border: "1px solid #2a5a8a", borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>Copiar mensagem</button>
            </div>}
          </>
    )}

    {/* HISTÓRICO */}
    {tab === "historico" && (
      historico.length === 0
        ? <div style={{ textAlign: "center", padding: "60px 20px", color: PALETTE.textMuted }}><div style={{ fontSize: 36, opacity: 0.4 }}>◌</div><div style={{ marginTop: 10, fontSize: 14 }}>Nenhuma ação registrada.</div></div>
        : historico.map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 16px", background: PALETTE.card, border: `1px solid ${PALETTE.cardBorder}`, borderRadius: 12, marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: PALETTE.creamDark }}>{h.msg}</span>
              <span style={{ fontSize: 11, color: PALETTE.textMuted, whiteSpace: "nowrap", marginLeft: 12 }}>{h.hora}</span>
            </div>
          ))
    )}
  </div>

  {/* MODAL */}
  {showForm && (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowForm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "flex-end", zIndex: 200 }}>
      <div className="modal-sheet" style={{ background: PALETTE.surface, width: "100%", borderRadius: "22px 22px 0 0", padding: "28px 20px 50px", maxHeight: "88vh", overflowY: "auto", border: `1px solid ${PALETTE.cardBorder}`, borderBottom: "none" }}>
        <div style={{ width: 36, height: 3, background: PALETTE.textDim, borderRadius: 99, margin: "0 auto 28px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: 1 }}>{editando ? "Editar Produto" : "Novo Produto"}</div>
          <button onClick={() => setShowForm(false)} style={{ background: PALETTE.card, border: `1px solid ${PALETTE.cardBorder}`, color: PALETTE.textMuted, borderRadius: 8, width: 34, height: 34, cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        {[["nome","Nome do produto","text"],["atual","Quantidade atual","number"],["minimo","Estoque mínimo","number"],["perigoso","Nível perigoso","number"]].map(([field, label, type]) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 9, color: PALETTE.textMuted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8, fontFamily: "inherit" }}>{label}</label>
            <input type={type} value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} style={inp} placeholder={label} />
          </div>
        ))}
        <div style={{ marginBottom: 26 }}>
          <label style={{ display: "block", fontSize: 9, color: PALETTE.textMuted, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 8 }}>Unidade</label>
          <select value={form.unidade} onChange={e => setForm(f => ({ ...f, unidade: e.target.value }))} style={inp}>
            {["un","kg","g","L","ml","cx","pct","sc"].map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <button onClick={salvar} style={{ width: "100%", padding: 16, background: "linear-gradient(135deg,#6b1f2a,#2d5a3d)", color: PALETTE.cream, border: "none", borderRadius: 14, cursor: "pointer", fontSize: 17, fontWeight: 700, fontFamily: "inherit", letterSpacing: 1.5 }}>
          {editando ? "Salvar alterações" : "Adicionar produto"}
        </button>
      </div>
    </div>
  )}
</div>


);
}

cd ~/musa-estoque && wget -O src/App.jsx https://raw.githubusercontent.com/MusaPadaria/musa-estoque/main/src/App.jsx && npm run build




