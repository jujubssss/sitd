import React, { useState, useRef } from 'react';
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
  X,
  Save
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
  { id: 2, titulo: 'Relato do Fato' },
  { id: 3, titulo: 'Emissão' }
];

export default function App() {
  const [passoAtual, setPassoAtual] = useState(1);
  const [busca, setBusca] = useState('');
  const [selecionados, setSelecionados] = useState([]);

  const [buscaRde, setBuscaRde] = useState('');
  const [rdesVinculadas, setRdesVinculadas] = useState([]);
  const [mostrarRdeManual, setMostrarRdeManual] = useState(false);
  const [rdeManual, setRdeManual] = useState({ id: '', texto: '' });

  const gerarNumeroProcesso = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const atual = Number(window.localStorage.getItem('fatdNumeroProcesso') || '1');
      const proximo = atual + 1;
      window.localStorage.setItem('fatdNumeroProcesso', String(proximo));
      return String(atual).padStart(3, '0');
    }
    return '001';
  };

  const [numeroProcesso, setNumeroProcesso] = useState(() => gerarNumeroProcesso());
  const [dataEmissao, setDataEmissao] = useState('');
  const [graduacaoMilitar, setGraduacaoMilitar] = useState('');
  const [nomeCompletoMilitar, setNomeCompletoMilitar] = useState('');
  const [nomeGuerraMilitar, setNomeGuerraMilitar] = useState('');
  const [numeroMilitar, setNumeroMilitar] = useState('');
  const [graduacaoParticipante, setGraduacaoParticipante] = useState('');
  const [nomeCompletoParticipante, setNomeCompletoParticipante] = useState('');
  const [nomeGuerraParticipante, setNomeGuerraParticipante] = useState('');
  const [descricaoOcorrido, setDescricaoOcorrido] = useState('');
  const [continuacaoOcorrido, setContinuacaoOcorrido] = useState('');
  const [decisaoAutoridade, setDecisaoAutoridade] = useState('');
  const [numeroBINotaPunicao, setNumeroBINotaPunicao] = useState('');
  const [dataPublicacaoBI, setDataPublicacaoBI] = useState('');

  // Campos do FATD
  const [visualizandoImpressao, setVisualizandoImpressao] = useState(false);

  // RDE selecionados para o texto padrão
  const [rdeSelecionados, setRdeSelecionados] = useState([]);

  // Ref para impressão/PDF
  const printRef = useRef();

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

  // Exportação em PDF no padrão da impressão do navegador
  const salvarPDF = () => {
    window.print();
  };

  // --- COMPONENTES DE IMPRESSÃO (ANEXO V) ---
  if (visualizandoImpressao) {
    const militar = selecionados[0] || {};
    const nomeCompletoMilitarExibicao = nomeCompletoMilitar || militar.nome || '___';
    const graduacaoMilitarExibicao = graduacaoMilitar || militar.grad || '___';
    const nomeGuerraMilitarExibicao = nomeGuerraMilitar || '___';
    const numeroMilitarExibicao = numeroMilitar || '___';
    const graduacaoParticipanteExibicao = graduacaoParticipante || '___';
    const nomeCompletoParticipanteExibicao = nomeCompletoParticipante || '___';
    const nomeGuerraParticipanteExibicao = nomeGuerraParticipante || '___';
    const descricaoOcorridoExibicao = descricaoOcorrido || '__________________________________________';
    const continuacaoOcorridoExibicao = continuacaoOcorrido || '__________________________________________';
    const decisaoAutoridadeExibicao = decisaoAutoridade || '';
    const numeroBINotaPunicaoExibicao = numeroBINotaPunicao || '___';
    const dataPublicacaoBIExibicao = dataPublicacaoBI || '____/____/______';

    return (
      <div className="min-h-screen bg-gray-200 flex flex-col font-sans w-full">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-page {
            width: 100% !important;
            max-width: 210mm !important;
            min-height: 0 !important;
            height: auto !important;
            padding: 4mm 5mm !important;
            margin: 0 0 6mm 0 !important;
            box-sizing: border-box !important;
          }
          .print-section {
            padding: 3mm !important;
            margin-bottom: 3mm !important;
          }
          .print-compact {
            font-size: 11px !important;
            line-height: 1.15 !important;
          }
          .print-compact p,
          .print-compact div {
            margin-top: 0.1rem !important;
            margin-bottom: 0.1rem !important;
          }
          .page-break { page-break-before: always; }
          @page { margin: 8mm; size: A4 portrait; }
        }
      `}} />
      <div className="bg-[#556b2f] p-4 text-white flex justify-between items-center no-print shadow-md sticky top-0 z-50">
        <button onClick={() => setVisualizandoImpressao(false)} className="flex items-center gap-2 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
        <X size={20} /> Fechar Visualização
        </button>
        <div className="flex gap-2">
        <button onClick={salvarPDF} className="bg-white text-[#556b2f] px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm hover:bg-gray-100">
          <Save size={18} /> Salvar em PDF
        </button>
        <button onClick={imprimirDocumento} className="bg-white text-[#556b2f] px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm hover:bg-gray-100">
          <Printer size={18} /> Imprimir FATD
        </button>
        </div>
      </div>
      <div className="flex-1 w-full flex flex-col items-center p-2 xs:p-4 sm:p-8">
        <div ref={printRef} className="bg-white w-full max-w-full sm:max-w-[210mm] min-h-[270mm] p-4 sm:p-8 mb-8 font-serif text-[12px] leading-relaxed text-black text-center relative print:shadow-none print:p-0 print:max-w-full print:min-h-0 print-page print-compact">
          <div className="w-full border border-black p-4 mb-6 print-section">
            <div className="text-center leading-tight">
              <p className="font-semibold">MINISTÉRIO DA DEFESA</p>
              <p className="font-semibold">EXÉRCITO BRASILEIRO</p>
              <p className="font-semibold">63º BATALHÃO DE INFANTARIA</p>
              <p>(Regimento do Moura / 1767)</p>
              <p className="font-semibold mt-2">BATALHÃO FERNANDO MACHADO</p>
              <p className="font-semibold">1ª COMPANHIA DE FUZILEIROS</p>
              <p className="font-semibold mt-3">FORMULÁRIO DE APURAÇÃO DE TRANSGRESSÃO DISCIPLINAR</p>
            </div>

            <div className="mt-4 border-t border-black pt-3 flex justify-between items-center text-sm uppercase font-semibold">
              <span>PROCESSO Nr: {numeroProcesso || '___'} - 63º BI (1ª Via)</span>
              <span>DATA: {dataEmissao || '____/____/______'}</span>
            </div>
          </div>

          <div className="border border-black p-4 mb-4 text-left">
            <p className="font-semibold">IDENTIFICAÇÃO DO MILITAR</p>
            <div className="mt-3">
              <p><strong>Grau Hierárquico:</strong></p>
              <p>{graduacaoMilitarExibicao}</p>
            </div>
            <div className="mt-3">
              <p><strong>Nome Completo:</strong></p>
              <p>{nomeCompletoMilitarExibicao}</p>
            </div>
            <div className="mt-3 border-t border-black pt-3">
              <p><strong>SU/OM:</strong></p>
              <p>1ª Cia Fuz</p>
            </div>
          </div>

          <div className="border border-black p-4 mb-4 text-left print-section">
            <p className="font-semibold">IDENTIFICAÇÃO DO PARTICIPANTE</p>
            <div className="mt-3">
              <p><strong>Grau Hierárquico:</strong></p>
              <p>{graduacaoParticipanteExibicao}</p>
            </div>
            <div className="mt-3 border-black pt-3">
              <p><strong>Nome Completo:</strong></p>
              <p>{nomeCompletoParticipanteExibicao}</p>
            </div>
          </div>

          <div className="border border-black p-4 mb-4 print-section">
            <p className="font-semibold">RELATO DO FATO</p>
            <p className="mt-3 text-justify whitespace-pre-line">
              {`Participo o(a) ${graduacaoMilitarExibicao} ${numeroMilitarExibicao} ${nomeGuerraMilitarExibicao}, da 1ª Cia Fuz, por ${descricaoOcorridoExibicao} e ao ser interpelado pelo ${graduacaoParticipanteExibicao} ${nomeGuerraParticipanteExibicao}, ${continuacaoOcorridoExibicao}.`}
            </p>
            <div className="mt-4 border-t border-black pt-3 text-center">
              <p>Assinatura:</p>
              <p>_____________________</p>
              <p className="mt-2 font-semibold">{nomeCompletoParticipanteExibicao}</p>
              <p>{graduacaoParticipanteExibicao}</p>
            </div>
          </div>

          <div className="border border-black p-4 print-section">
            <p className="font-semibold">CIENTE DO MILITAR ARROLADO</p>
            <div className="mt-3">
              <p>Declaro que tenho conhecimento de que me está sendo imputada a autoria dos atos acima e me foi concedido o prazo de três dias úteis para apresentar, por escrito, as minhas justificativas ou razões de defesa.</p>
            </div>
            <div className="mt-3 border-t border-black pt-3">
              <p><strong>Recebi em:</strong></p>
              <p>__/__/2026</p>
            </div>
            <div className="mt-4 border-t border-black pt-3">
              <p>Assinatura:</p>
              <p>_____________________</p>
              <p className="mt-2 font-semibold">{nomeCompletoMilitarExibicao}</p>
              <p>{graduacaoMilitarExibicao}</p>
            </div>
          </div>
        </div>

        <div className="page-break" />

        <div className="bg-white w-full max-w-full sm:max-w-[210mm] min-h-[270mm] p-4 sm:p-8 mb-8 font-serif text-[12px] leading-relaxed text-black text-center border border-black print:shadow-none print:p-0 print:max-w-full print:min-h-0 print-page print-compact">
          <div className="border border-black p-4 mb-4 print-section">
            <p className="font-semibold">JUSTIFICATIVA / RAZÕES DE DEFESA</p>
            <div className=" border border-black p-4 mb-4 print-section mt-4 space-y-4">
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
            </div>
            <div className="mt-4 border-t border-white pt-3">
              <p>Data:</p>
              <p>__/__/______</p>
            </div>
            <div className="mt-4 border-t border-white pt-3">
              <p>_____________________</p>
              <p className="mt-2 font-semibold">{nomeCompletoMilitarExibicao}</p>
              <p>{graduacaoMilitarExibicao}</p>
            </div>
          </div>

          <div className="border border-black p-4 mb-4">
            <p className="font-semibold">DECISÃO DA AUTORIDADE COMPETENTE PARA APLICAR A PUNIÇÃO DISCIPLINAR</p>
            <div className="mt-4 min-h-44 border border-black p-3">
              {decisaoAutoridadeExibicao ? (
                <p className="whitespace-pre-line">{decisaoAutoridadeExibicao}</p>
              ) : (
                <>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                  <p>_________________________________________________________________________________</p>
                </>
              )}
            </div>
            <div className="mt-4 border-t border-white pt-3">
              <p>Data:</p>
              <p>__/__/______</p>
            </div>
            <div className="mt-4 border-t border-white pt-3">
              <p className="font-semibold">MAURICIO NARCISO - CAP</p>
              <p>Comandante da 1ª Cia Fuz</p>
              <p className="font-semibold" style={{ paddingTop: '5%' }}>
                PUNIÇÃO PUBLICADA NO BI Nr____, de ____ de _____ de 2026.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  // --- TELA PRINCIPAL (APLICATIVO MOBILE) ---
  return (
    <div className="w-full min-h-screen flex flex-col font-sans text-gray-800 bg-gray-100 shadow-2xl relative pb-20 overflow-hidden sm:max-w-md sm:mx-auto">
      
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
          {/* <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Capitao&backgroundColor=b6e3f4" alt="Perfil" className="w-10 h-10 rounded-full border-2 border-white/30" /> */}
          <div>
            <p className="font-semibold text-sm">Cap. NARCISO</p>
            <p className="text-xs opacity-80">1° CIA</p>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL COM STEPPER */}
      <main className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        
        {/* STEPPER VERTICAL (Lado Esquerdo) */}
        <div className="w-full sm:w-12 bg-white flex flex-row sm:flex-col items-center py-2 sm:py-6 border-b sm:border-b-0 sm:border-r border-gray-200 overflow-x-auto sm:overflow-y-auto">
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
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
          
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
                    <BookOpen size={16} className="text-[#556b2f]" /> Relato do Fato
                  </label>
                  <span className="bg-[#556b2f] text-white px-2 py-0.5 rounded-full text-xs">{rdeSelecionados.length}</span>
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
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-h-48 overflow-y-auto mt-2">
                  {rdesFiltradas.length > 0 ? rdesFiltradas.map(r => (
                    <label key={r.id} className="flex items-start gap-2 p-2 border-b last:border-0 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!rdeSelecionados.find(sel => sel.id === r.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setRdeSelecionados([...rdeSelecionados, r]);
                          } else {
                            setRdeSelecionados(rdeSelecionados.filter(sel => sel.id !== r.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-800">
                          <span className="text-[rgb(85,107,47)]">Nº {r.id}</span> - {r.titulo}
                        </p>
                        <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{r.texto}</p>
                      </div>
                    </label>
                  )) : (
                    <p className="p-3 text-xs text-center text-gray-500">Nenhum item encontrado.</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Processo Nr</label>
                  <div className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm text-gray-700">
                    {numeroProcesso}
                  </div>
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Data de Emissão</label>
                  <input
                    type="date"
                    value={dataEmissao}
                    onChange={e => setDataEmissao(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Graduação do Militar</label>
                  <input
                    type="text"
                    value={graduacaoMilitar}
                    onChange={e => setGraduacaoMilitar(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: Sd EP"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Nome Completo do Militar</label>
                  <input
                    type="text"
                    value={nomeCompletoMilitar}
                    onChange={e => setNomeCompletoMilitar(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: João Souza Santos"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Número do Militar</label>
                  <input
                    type="text"
                    value={numeroMilitar}
                    onChange={e => setNumeroMilitar(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: 123456"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Nome de Guerra do Militar</label>
                  <input
                    type="text"
                    value={nomeGuerraMilitar}
                    onChange={e => setNomeGuerraMilitar(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: Guerreiro"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Graduação do Participante</label>
                  <input
                    type="text"
                    value={graduacaoParticipante}
                    onChange={e => setGraduacaoParticipante(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: Cap"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Nome Completo do Participante</label>
                  <input
                    type="text"
                    value={nomeCompletoParticipante}
                    onChange={e => setNomeCompletoParticipante(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: Mauricio Narciso"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Nome de Guerra do Participante</label>
                  <input
                    type="text"
                    value={nomeGuerraParticipante}
                    onChange={e => setNomeGuerraParticipante(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: N/A"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Descrição do Ocorrido</label>
                  <textarea
                    rows="4"
                    value={descricaoOcorrido}
                    onChange={e => setDescricaoOcorrido(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Descreva o fato ocorrido..."
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Continuação do Ocorrido</label>
                  <textarea
                    rows="4"
                    value={continuacaoOcorrido}
                    onChange={e => setContinuacaoOcorrido(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Continuação do relato..."
                  />
                </div>
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
                  <p><strong>Itens do RDE:</strong> {rdeSelecionados.length} vinculados</p>
                  <p><strong>Relato:</strong> {descricaoOcorrido ? 'Preenchido' : 'Pendente/Vazio'}</p>
                  <p><strong>Decisão:</strong> {decisaoAutoridade ? 'Preenchida' : 'Pendente/Vazio'}</p>
                </div>
              </div>

              <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-left">
                <label className="text-sm font-semibold text-gray-700">Decisão da Autoridade</label>
                <textarea
                  rows="5"
                  value={decisaoAutoridade}
                  onChange={e => setDecisaoAutoridade(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                  placeholder="Descreva a decisão da autoridade competente..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-left">
                  <label className="text-sm font-semibold text-gray-700">Nº BI / Nota de Punição</label>
                  <input
                    type="text"
                    value={numeroBINotaPunicao}
                    onChange={e => setNumeroBINotaPunicao(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                    placeholder="Ex: 025"
                  />
                </div>
                <div className="space-y-2 bg-white p-3 rounded-xl shadow-sm border border-gray-100 text-left">
                  <label className="text-sm font-semibold text-gray-700">Data de Publicação no BI</label>
                  <input
                    type="date"
                    value={dataPublicacaoBI}
                    onChange={e => setDataPublicacaoBI(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#556b2f]/50"
                  />
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
      <div className="bg-white border-t border-gray-200 p-2 sm:p-4 pb-20 flex gap-2 sm:gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
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
            className="flex-2 bg-[#556b2f] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-1 disabled:opacity-50 disabled:bg-gray-400 transition-colors shadow-sm"
          >
            Próximo Passo <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* BARRA DE NAVEGAÇÃO INFERIOR GLOBAL */}
      <nav className="fixed sm:absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-4 z-20 shrink-0">
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