import React, { useState } from 'react';
import logo from './assets/logo.webp';
import { 
  Search, 
  Plus, 
  Minus, 
  History, 
  FileText, 
  Settings, 
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  Printer,
  X
} from 'lucide-react';

// --- DADOS MOCK (Simulação de Banco de Dados) ---
const dbMilitares = [
  { id: '1', nome: 'JOÃO SOUZA SANTOS', grad: 'Sd EP', unidade: 'Cia Cmdo', foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao&backgroundColor=e2e8f0', identidade: '010123456-7' },
  { id: '2', nome: 'ANDERSON LIMA SILVA', grad: 'Cb EP', unidade: '1º Batalhão', foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anderson&backgroundColor=e2e8f0', identidade: '020987654-3' },
  { id: '3', nome: 'CARLOS MENDES', grad: '3º Sgt', unidade: 'Cia Apoio', foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos&backgroundColor=e2e8f0', identidade: '030112233-4' },
  { id: '4', nome: 'LUCAS FERREIRA', grad: 'Sd EP', unidade: 'Cia Cmdo', foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas&backgroundColor=e2e8f0', identidade: '040554433-2' },
];

const dbRDE = [
  { id: '1', titulo: 'Faltar com a verdade', texto: 'faltar à verdade ou omitir propositadamente a verdade, em qualquer documento, ou ao relatar qualquer fato, bem como, ao apresentar declaração de qualquer natureza, não oferecer elementos para o seu perfeito entendimento e apreciação;' },
  { id: '9', titulo: 'Atraso/Falta', texto: 'faltar ou chegar atrasado, sem justo motivo, a qualquer ato, serviço ou instrução de que deva participar ou a que deva assistir;' },
  { id: '11', titulo: 'Afastamento sem permissão', texto: 'afastar-se de qualquer lugar em que deva estar por força de disposição ou ordem, sem a devida permissão;' },
  { id: '26', titulo: 'Desrespeito a superior', texto: 'faltar, por ação ou omissão, com o respeito devido a superior;' },
  { id: '74', titulo: 'Barba/Cabelo', texto: 'apresentar-se, o militar, com costeletas, barba ou bigode, cabelos, unhas ou maquiagem em desacordo com as normas vigentes;' },
  { id: '77', titulo: 'Uniforme alterado', texto: 'apresentar-se desuniformizado, mal uniformizado ou com o uniforme alterado;' },
  { id: '85', titulo: 'Fazer ruído/Conversar', texto: 'conversar ou fazer ruído em ocasiões ou lugares em que isso seja vedado;' }
];

// O processo inicial do FATD possui apenas a autuação. Justificativa e Decisão são passos posteriores do processo em papel.
const passos = [
  { id: 1, titulo: 'Envolvidos' },
  { id: 2, titulo: 'Relato & RDE' },
  { id: 3, titulo: 'Emissão' }
];

export default function App() {
  const [passoAtual, setPassoAtual] = useState(1);
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState([]);
  const [observacao, setObservacao] = useState('');

  const [buscaRde, setBuscaRde] = useState('');
  const [rdesVinculadas, setRdesVinculadas] = useState([]);
  const [mostrarRdeManual, setMostrarRdeManual] = useState(false);
  const [rdeManual, setRdeManual] = useState({ id: '', texto: '' });

  const [visualizandoImpressao, setVisualizandoImpressao] = useState(false);

  // --- LÓGICA DE INTERAÇÃO ---
  const militaresFiltrados = dbMilitares.filter(m => 
    m.nome.toLowerCase().includes(busca.toLowerCase()) || 
    m.grad.toLowerCase().includes(busca.toLowerCase())
  );

  const adicionarMilitar = (militar) => {
    if (!selecionados.find(m => m.id === militar.id)) {
      setSelecionados([...selecionados, militar]);
      setBusca('');
    }
  };

  const removerMilitar = (id) => {
    setSelecionados(selecionados.filter(m => m.id !== id));
  };

  const rdesFiltradas = dbRDE.filter(r => 
    r.id.includes(buscaRde) || 
    r.titulo.toLowerCase().includes(buscaRde.toLowerCase()) || 
    r.texto.toLowerCase().includes(buscaRde.toLowerCase())
  );

  const vincularRde = (rde) => {
    if (!rdesVinculadas.find(r => r.id === rde.id)) {
      setRdesVinculadas([...rdesVinculadas, rde]);
      setBuscaRde('');
    }
  };

  const removerRde = (id) => {
    setRdesVinculadas(rdesVinculadas.filter(r => r.id !== id));
  };

  const adicionarRdeManual = () => {
    if (rdeManual.texto.trim() === '') return;
    const novoId = rdeManual.id || `M-${Date.now().toString().slice(-4)}`;
    vincularRde({ 
      id: novoId, 
      titulo: 'Inserção Manual', 
      texto: rdeManual.texto,
      isManual: true 
    });
    setMostrarRdeManual(false);
    setRdeManual({ id: '', texto: '' });
  };

  const avancarPasso = () => {
    if (passoAtual < passos.length) setPassoAtual(passoAtual + 1);
  };

  const voltarPasso = () => {
    if (passoAtual > 1) setPassoAtual(passoAtual - 1);
  };

  const imprimirDocumento = () => {
    window.print();
  };

  // --- COMPONENTES DE IMPRESSÃO (ANEXO V) ---
  if (visualizandoImpressao) {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const anoAtual = new Date().getFullYear();
    const processoNr = `${Date.now().toString().slice(-5)}/${anoAtual}`;

    return (
      <div className="min-h-screen bg-gray-200 flex flex-col font-sans">
        {/* Estilos específicos para a impressão */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body { background: white !important; }
            .no-print { display: none !important; }
            .page-break { page-break-after: always; }
            @page { margin: 15mm; size: A4 portrait; }
          }
        `}} />

        {/* Barra superior do App (Não aparece na impressão) */}
        <div className="bg-[#556b2f] p-4 text-white flex justify-between items-center no-print shadow-md sticky top-0 z-50">
          <button onClick={() => setVisualizandoImpressao(false)} className="flex items-center gap-2 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
            <X size={20} /> Fechar Visualização
          </button>
          <button onClick={imprimirDocumento} className="bg-white text-[#556b2f] px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm hover:bg-gray-100">
            <Printer size={18} /> Imprimir FATD
          </button>
        </div>

        {/* ÁREA DA FOLHA A4 (Padrão Anexo V) */}
        <div className="flex-1 w-full flex flex-col items-center p-4 sm:p-8">
          {selecionados.map((militar, index) => (
            <div key={militar.id} className="bg-white w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 shadow-xl mb-8 font-serif text-[13px] leading-relaxed text-black page-break relative">
              
              {/* CABEÇALHO DO DOCUMENTO */}
              <div className="text-center mb-6">
                <img src={logo} alt="Brasão" className="w-16 h-16 mx-auto mb-2" />
                <p className="font-bold tracking-wider">MINISTÉRIO DA DEFESA</p>
                <p className="font-bold tracking-wider">EXÉRCITO BRASILEIRO</p>
                <p>COMANDO MILITAR DO SUL</p> {/* Escalão Superior Simulado */}
                <p className="uppercase">1º Batalhão de Infantaria</p> {/* Escalão Considerado Simulado */}
                
                <h1 className="mt-6 mb-2 font-bold underline text-[15px]">FORMULÁRIO DE APURAÇÃO DE TRANSGRESSÃO DISCIPLINAR</h1>
              </div>

              <div className="flex justify-between font-bold mb-6 text-[14px]">
                <span>PROCESSO Nº: {processoNr}</span>
                <span>DATA: {dataAtual}</span>
              </div>

              {/* 1. IDENTIFICAÇÃO DO MILITAR ARROLADO */}
              <div className="border border-black mb-4">
                <div className="bg-gray-100 border-b border-black py-1 text-center font-bold">
                  IDENTIFICAÇÃO DO MILITAR
                </div>
                <div className="p-3 grid grid-cols-2 gap-y-2">
                  <div className="flex"><span className="font-bold w-32">Grau Hierárquico:</span> <span>{militar.grad}</span></div>
                  <div className="flex"><span className="font-bold w-24">NR/IDENT:</span> <span>{militar.identidade}</span></div>
                  <div className="flex col-span-2"><span className="font-bold w-32">Nome Completo:</span> <span>{militar.nome}</span></div>
                  <div className="flex col-span-2"><span className="font-bold w-32">Subunidade/OM:</span> <span>{militar.unidade}</span></div>
                </div>
              </div>

              {/* 2. IDENTIFICAÇÃO DO PARTICIPANTE */}
              <div className="border border-black mb-4">
                <div className="bg-gray-100 border-b border-black py-1 text-center font-bold">
                  IDENTIFICAÇÃO DO PARTICIPANTE
                </div>
                <div className="p-3 grid grid-cols-2 gap-y-2">
                  <div className="flex"><span className="font-bold w-32">Grau Hierárquico:</span> <span>Capitão</span></div>
                  <div className="flex"><span className="font-bold w-24">NR/IDENT:</span> <span>098765432-1</span></div>
                  <div className="flex col-span-2"><span className="font-bold w-32">Nome Completo:</span> <span>Mário da Silva</span></div>
                  <div className="flex col-span-2"><span className="font-bold w-32">Subunidade/OM:</span> <span>Cia. Cmdo Apoio / 1º BI</span></div>
                </div>
              </div>

              {/* 3. RELATO DO FATO */}
              <div className="border border-black mb-4">
                <div className="bg-gray-100 border-b border-black py-1 text-center font-bold">
                  RELATO DO FATO
                </div>
                <div className="p-4 min-h-[160px] flex flex-col">
                  <div className="flex-1 whitespace-pre-wrap text-justify">
                    {observacao || "(Nenhum relato adicional preenchido)."}
                    
                    {rdesVinculadas.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-dashed border-gray-400">
                        <span className="font-bold block mb-1">Enquadramento Preliminar Sugerido:</span>
                        <ul className="list-disc pl-5 space-y-1">
                          {rdesVinculadas.map(r => (
                            <li key={r.id}>Item {r.id} do Anexo I do RDE: {r.texto}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-12 flex justify-between items-end">
                    <span>Data: ____/____/________</span>
                    <div className="text-center">
                      <div className="border-b border-black w-64 mb-1"></div>
                      <p>Capitão MÁRIO DA SILVA</p>
                      <p className="text-xs">Participante / Oficial Relator</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. CIENTE DO MILITAR ARROLADO */}
              <div className="border border-black mb-10">
                <div className="bg-gray-100 border-b border-black py-1 text-center font-bold">
                  CIENTE DO MILITAR ARROLADO
                </div>
                <div className="p-4">
                  <p className="text-justify mb-10 indent-8">
                    Declaro que tenho conhecimento de que me está sendo imputada a autoria dos atos acima e me foi concedido o prazo de três dias úteis, para, querendo, apresentar, por escrito, as minhas justificativas ou razões de defesa.
                  </p>
                  <div className="flex justify-between items-end">
                    <span>Data: ____/____/________</span>
                    <div className="text-center">
                      <div className="border-b border-black w-64 mb-1"></div>
                      <p>{militar.nome}</p>
                      <p className="text-xs">{militar.grad}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* VERSO E OUTRAS PARTES (Apenas indicativo) */}
              <div className="text-center text-gray-400 text-xs mt-auto">
                - O militar arrolado deverá apresentar suas justificativas/razões de defesa no verso deste documento -
              </div>

            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- TELA PRINCIPAL (APLICATIVO MOBILE) ---
  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen flex flex-col font-sans text-gray-800 shadow-2xl relative pb-20 overflow-hidden">
      
      {/* CABEÇALHO (HEADER) */}
      <header className="bg-[#556b2f] text-white p-4 rounded-b-xl shadow-md z-10 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Exército Brasileiro" className="w-9 h-9" />
            <h1 className="font-bold text-lg leading-tight">SITD<br/><span className="text-sm font-normal opacity-90">Gestão de FATD</span></h1>
          </div>
          <div className="text-right text-xs opacity-90">
            <p>27/Out/2026</p>
            <p>15:06</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Capitao&backgroundColor=b6e3f4" alt="Perfil" className="w-10 h-10 rounded-full border-2 border-white/30" />
          <div>
            <p className="font-semibold text-sm">Cap. SILVA</p>
            <p className="text-xs opacity-80">Cia. Cmdo Apoio</p>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL COM STEPPER */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* STEPPER VERTICAL (Lado Esquerdo) */}
        <div className="w-12 bg-white flex flex-col items-center py-6 border-r border-gray-200 overflow-y-auto">
          {passos.map((passo, index) => (
            <div key={passo.id} className="flex flex-col items-center relative">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10
                ${passoAtual === passo.id ? 'bg-[#556b2f] text-white ring-4 ring-[#556b2f]/20' : 
                  passoAtual > passo.id ? 'bg-[#556b2f] text-white' : 'bg-gray-200 text-gray-500'}`}>
                {passoAtual > passo.id ? <CheckCircle2 size={14} /> : passo.id}
              </div>
              {index < passos.length - 1 && (
                <div className={`w-0.5 h-16 my-1 ${passoAtual > passo.id ? 'bg-[#556b2f]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* CONTEÚDO DO PASSO */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-700 uppercase tracking-wide">
              {passos.find(p => p.id === passoAtual)?.titulo}
            </h2>
            <p className="text-xs text-gray-500">Passo {passoAtual} de {passos.length}</p>
          </div>

          {/* EXIBIÇÃO CONSTANTE DOS ENVOLVIDOS (Passos 2 e 3) */}
          {passoAtual > 1 && selecionados.length > 0 && (
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-6 animate-in fade-in">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                Militares em Apuração
              </label>
              <div className="flex flex-wrap gap-2">
                {selecionados.map(m => (
                  <div key={m.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 pr-2 rounded-full">
                    <img src={m.foto} alt={m.nome} className="w-6 h-6 rounded-full bg-white border border-gray-200" />
                    <span className="text-xs font-bold text-gray-700">
                      {m.grad} {m.nome.split(' ')[0]} {m.nome.split(' ').pop()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 1: IDENTIFICAÇÃO */}
          {passoAtual === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Adicionar Transgressores</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Nome, Idt ou Unidade..." 
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 transition-all"
                  />
                </div>

                {busca && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-h-48 overflow-y-auto mt-2">
                    {militaresFiltrados.length > 0 ? militaresFiltrados.map(m => (
                      <div key={m.id} className="flex items-center justify-between p-2 border-b last:border-0 hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <img src={m.foto} alt={m.nome} className="w-8 h-8 rounded-full bg-gray-100" />
                          <div>
                            <p className="text-xs font-bold leading-tight">{m.grad} {m.nome}</p>
                            <p className="text-[10px] text-gray-500">{m.unidade}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => adicionarMilitar(m)}
                          disabled={selecionados.find(s => s.id === m.id)}
                          className="flex items-center gap-1 bg-[#556b2f] text-white px-2 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 disabled:bg-gray-400"
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    )) : (
                      <p className="p-3 text-sm text-center text-gray-500">Nenhum militar encontrado.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <label className="text-sm font-semibold text-gray-700 flex justify-between">
                  Militares Envolvidos 
                  <span className="bg-[#556b2f] text-white px-2 py-0.5 rounded-full text-xs">{selecionados.length}</span>
                </label>
                
                {selecionados.length === 0 ? (
                  <div className="p-4 text-center border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm">
                    Nenhum militar selecionado ainda.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selecionados.map(m => (
                      <div key={m.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <img src={m.foto} alt={m.nome} className="w-9 h-9 rounded-full bg-white border border-gray-200" />
                          <div>
                            <p className="text-sm font-bold text-gray-800">{m.grad} {m.nome}</p>
                          </div>
                        </div>
                        <button onClick={() => removerMilitar(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                          <Minus size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASSO 2: RELATO E RDE */}
          {passoAtual === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <BookOpen size={16} className="text-[#556b2f]" /> Enquadramento (RDE)
                  </label>
                  <span className="bg-[#556b2f] text-white px-2 py-0.5 rounded-full text-xs">{rdesVinculadas.length}</span>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar RDE (Ex: 9, Barba)..." 
                    value={buscaRde}
                    onChange={(e) => setBuscaRde(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 transition-all"
                  />
                </div>

                {buscaRde && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-h-48 overflow-y-auto">
                    {rdesFiltradas.length > 0 ? rdesFiltradas.map(r => (
                      <div key={r.id} className="p-2 border-b last:border-0 hover:bg-gray-50">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold text-gray-800">
                              <span className="text-[#556b2f]">Nº {r.id}</span> - {r.titulo}
                            </p>
                            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{r.texto}</p>
                          </div>
                          <button onClick={() => vincularRde(r)} disabled={rdesVinculadas.find(v => v.id === r.id)} className="shrink-0 bg-[#556b2f] text-white p-1.5 rounded-md text-xs font-medium disabled:opacity-50">
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    )) : (
                      <p className="p-3 text-xs text-center text-gray-500">Nenhum item encontrado.</p>
                    )}
                  </div>
                )}

                {!mostrarRdeManual ? (
                  <button onClick={() => setMostrarRdeManual(true)} className="text-xs text-[#556b2f] font-semibold flex items-center gap-1 hover:underline w-full justify-center py-1">
                    + Adicionar RDE Manualmente
                  </button>
                ) : (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 space-y-2 mt-2 animate-in fade-in zoom-in duration-200">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Nº (Opc.)" value={rdeManual.id} onChange={e => setRdeManual({...rdeManual, id: e.target.value})} className="w-1/3 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#556b2f]/50 outline-none" />
                      <input type="text" placeholder="Descreva a transgressão..." value={rdeManual.texto} onChange={e => setRdeManual({...rdeManual, texto: e.target.value})} className="w-2/3 text-xs p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#556b2f]/50 outline-none" />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setMostrarRdeManual(false)} className="text-xs text-gray-500 font-medium px-2 py-1">Cancelar</button>
                      <button onClick={adicionarRdeManual} className="bg-[#556b2f] text-white text-xs px-3 py-1.5 rounded font-medium">Incluir</button>
                    </div>
                  </div>
                )}

                {rdesVinculadas.length > 0 && (
                  <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Itens Vinculados</p>
                    {rdesVinculadas.map(r => (
                      <div key={r.id} className="flex gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-200 relative pr-8">
                        <div className="bg-[#556b2f] text-white text-xs font-bold px-1.5 py-0.5 rounded h-fit shrink-0">{r.id}</div>
                        <p className="text-[11px] text-gray-700 leading-snug">{r.texto}</p>
                        <button onClick={() => removerRde(r.id)} className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <Minus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Relato do Fato</label>
                <textarea 
                  rows="5" 
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Descreva com detalhes o fato ocorrido, data, hora, local e envolvimento..."
                  className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50 resize-none shadow-sm"
                ></textarea>
              </div>
            </div>
          )}

          {/* PASSO 3: EMISSÃO E REVISÃO */}
          {passoAtual === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-[#556b2f]">
                <FileText size={32} />
              </div>
              <h3 className="font-bold text-gray-700 text-lg">Pronto para Emissão</h3>
              <p className="text-sm text-gray-500 px-4">
                O Formulário de Apuração está pronto para ser impresso e entregue ao militar para assinatura e posterior elaboração de defesa (prazo legal de 3 dias).
              </p>
              
              <div className="bg-white p-4 rounded-lg text-left shadow-sm mt-6 text-sm border border-gray-200">
                <p className="font-semibold text-gray-800 mb-2">Resumo da Autuação:</p>
                <div className="text-gray-600 space-y-1">
                  <p><strong>Itens do RDE:</strong> {rdesVinculadas.length} vinculados</p>
                  <p><strong>Relato:</strong> {observacao ? 'Preenchido' : 'Pendente/Vazio'}</p>
                </div>
              </div>

              <button 
                onClick={() => setVisualizandoImpressao(true)}
                className="w-full mt-6 bg-[#556b2f] text-white font-bold py-4 rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-[#4a5d23] transition-colors"
              >
                <Printer size={20} /> Visualizar & Imprimir Documento Oficial
              </button>
            </div>
          )}

        </div>
      </main>

      {/* BOTÕES DE AÇÃO (FOOTER) */}
      <div className="bg-white border-t border-gray-200 p-4 pb-20 flex gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
        {passoAtual === 1 ? (
          <button className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm hover:bg-gray-300 transition-colors">
            Cancelar
          </button>
        ) : (
          <button onClick={voltarPasso} className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-gray-300">
            <ChevronLeft size={18} /> Voltar
          </button>
        )}
        
        {passoAtual < 3 && (
          <button 
            onClick={avancarPasso}
            disabled={passoAtual === 1 && selecionados.length === 0}
            className="flex-[2] bg-[#556b2f] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:bg-gray-400 transition-colors shadow-sm"
          >
            Próximo Passo <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* BARRA DE NAVEGAÇÃO INFERIOR GLOBAL */}
      <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-4 z-20 shrink-0">
        <button className="flex flex-col items-center p-2 text-gray-400 hover:text-[#556b2f] transition-colors">
          <History size={20} />
          <span className="text-[10px] mt-1 font-medium">Histórico</span>
        </button>
        <button className="flex flex-col items-center p-2 text-[#556b2f] relative -top-3 bg-white rounded-full px-4 shadow-sm border border-gray-100">
          <FileText size={24} />
          <span className="text-[10px] mt-1 font-bold">Novo FATD</span>
        </button>
        <button className="flex flex-col items-center p-2 text-gray-400 hover:text-[#556b2f] transition-colors">
          <Settings size={20} />
          <span className="text-[10px] mt-1 font-medium">Ajustes</span>
        </button>
      </nav>

    </div>
  );
}