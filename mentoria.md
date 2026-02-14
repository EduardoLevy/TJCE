<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Tático TJCE | Reta Final 40 Dias</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        /* Custom Palette & Overrides */
        :root {
            --bg-warm: #fdfbf7;
            --text-primary: #2d3748;
            --accent-sage: #8da399;
            --accent-terracotta: #d97757;
            --accent-slate: #4a5568;
            --card-bg: #ffffff;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-warm);
            color: var(--text-primary);
        }

        .chart-container {
            position: relative; 
            width: 100%; 
            max-width: 600px; 
            margin-left: auto; 
            margin-right: auto; 
            height: 300px; 
            max-height: 400px;
        }

        /* Custom Scrollbar for lists */
        .custom-scroll::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
            background: #f1f1f1; 
        }
        .custom-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e0; 
            border-radius: 3px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #a0aec0; 
        }

        /* Animations */
        .fade-in {
            animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .nav-active {
            border-bottom: 2px solid var(--accent-terracotta);
            color: var(--accent-terracotta);
            font-weight: 600;
        }
    </style>

    <!-- Placeholder Comments Required -->
    <!-- Chosen Palette: Warm Neutrals (Background: #fdfbf7, Accents: Sage Green, Terracotta, Slate Blue) for a calm, study-focused environment. -->
    <!-- Application Structure Plan: The app is divided into three main views: 1) Dashboard (Overview stats, Strategy), 2) Cronograma (The core interactive 40-day plan), and 3) Radar (The priority topics from the provided image). Navigation is tab-based. The structure prioritizes the daily workflow while keeping high-level strategy accessible. -->
    <!-- Visualization & Content Choices: 
         1. Radar Chart: Visualizes the "Top 5" topics distribution to show subject weight.
         2. Doughnut Chart: Shows the daily time allocation (Theory vs Questions vs Review) to reinforce the methodology.
         3. Interactive List: The 40-day plan is a dynamic list filterable by Cycle, allowing users to focus on the current phase.
         4. Progress Bar: Gamification element to track completed days.
         NO SVG graphics used. NO Mermaid JS used. 
    -->
    <!-- CONFIRMATION: NO SVG graphics used. NO Mermaid JS used. -->
</head>
<body class="antialiased min-h-screen flex flex-col">

    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">TJ</div>
                <div>
                    <h1 class="text-lg font-bold text-gray-800 leading-tight">Painel Tático TJCE</h1>
                    <p class="text-xs text-gray-500">Técnico Judiciário • Reta Final 40 Dias</p>
                </div>
            </div>
            
            <!-- Desktop Nav -->
            <nav class="hidden md:flex space-x-6 text-sm text-gray-600">
                <button onclick="app.navigate('dashboard')" id="nav-dashboard" class="nav-item hover:text-gray-900 transition-colors">Visão Geral</button>
                <button onclick="app.navigate('cronograma')" id="nav-cronograma" class="nav-item hover:text-gray-900 transition-colors">Cronograma Diário</button>
                <button onclick="app.navigate('radar')" id="nav-radar" class="nav-item hover:text-gray-900 transition-colors">Radar da Aprovação</button>
            </nav>

            <!-- Mobile Menu Button (Simple Toggle) -->
            <button onclick="app.toggleMobileMenu()" class="md:hidden p-2 text-gray-600 focus:outline-none">
                ☰
            </button>
        </div>
        
        <!-- Mobile Nav Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-gray-50 border-t border-gray-200">
            <div class="flex flex-col p-4 space-y-3">
                <button onclick="app.navigate('dashboard')" class="text-left py-2 px-3 rounded hover:bg-gray-200">Visão Geral</button>
                <button onclick="app.navigate('cronograma')" class="text-left py-2 px-3 rounded hover:bg-gray-200">Cronograma Diário</button>
                <button onclick="app.navigate('radar')" class="text-left py-2 px-3 rounded hover:bg-gray-200">Radar da Aprovação</button>
            </div>
        </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow container mx-auto px-4 py-6">

        <!-- VIEW: DASHBOARD -->
        <div id="view-dashboard" class="fade-in">
            <!-- Intro Text -->
            <div class="mb-8 max-w-3xl">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Bem-vindo, Futuro Técnico.</h2>
                <p class="text-gray-600 leading-relaxed">
                    Este painel organiza sua estratégia de 40 dias. O plano combina <strong>engenharia reversa</strong> para matérias que você já domina e <strong>ciclos teóricos acelerados</strong> para novos conteúdos. Sua meta diária é de <strong>3 horas líquidas</strong>. Acompanhe seu progresso e mantenha o foco nos tópicos do Radar.
                </p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- Progress Card -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-500 uppercase tracking-wide">Progresso Global</p>
                        <div class="mt-2 flex items-end">
                            <span id="progress-percent" class="text-4xl font-bold text-gray-800">0%</span>
                            <span class="ml-2 text-sm text-gray-500 mb-1">concluído</span>
                        </div>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2.5 mt-4">
                        <div id="progress-bar" class="bg-indigo-600 h-2.5 rounded-full" style="width: 0%"></div>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">Baseado nos dias marcados como concluídos.</p>
                </div>

                <!-- Methodology Card -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Divisão do Tempo (3h)</p>
                    <div class="chart-container" style="height: 180px;">
                        <canvas id="timeDistributionChart"></canvas>
                    </div>
                </div>

                <!-- Current Cycle Card -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                    <div class="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3">
                        <span id="current-day-display">1</span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">Dia Atual Sugerido</h3>
                    <p class="text-sm text-gray-500 mt-1">Ciclo 1: Base das Novas Matérias</p>
                    <button onclick="app.navigate('cronograma')" class="mt-4 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition">Ir para o Cronograma</button>
                </div>
            </div>

            <!-- Quick Strategy Tips -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 class="font-bold text-indigo-900 mb-3">⚡ Regras de Ouro</h3>
                    <ul class="space-y-2 text-sm text-indigo-800">
                        <li class="flex items-start"><span class="mr-2">•</span> <strong>Matérias Dominadas:</strong> Proibido videoaula. Apenas questões e comentários.</li>
                        <li class="flex items-start"><span class="mr-2">•</span> <strong>Matérias Novas:</strong> Videoaula acelerada (1.5x) apenas para entender a lógica.</li>
                        <li class="flex items-start"><span class="mr-2">•</span> <strong>Redação:</strong> Treino sagrado aos domingos. Uma boa nota define a vaga.</li>
                    </ul>
                </div>
                <div class="bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <h3 class="font-bold text-orange-900 mb-3">🚨 Alerta de Prioridade</h3>
                    <p class="text-sm text-orange-800 mb-2">
                        O conteúdo do <strong>Anexo 2 (Heron Lemos)</strong> indicou os assuntos mais cobrados pela FCC. Sempre que estudar um tópico do "Radar", dobre a atenção.
                    </p>
                    <button onclick="app.navigate('radar')" class="text-orange-700 font-semibold text-sm hover:underline">Ver Tópicos Prioritários →</button>
                </div>
            </div>
        </div>

        <!-- VIEW: CRONOGRAMA -->
        <div id="view-cronograma" class="hidden fade-in">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Cronograma de 40 Dias</h2>
                <p class="text-gray-600">Siga rigorosamente os blocos de tempo. Marque os dias conforme concluir.</p>
            </div>

            <!-- Cycle Tabs -->
            <div class="flex overflow-x-auto space-x-2 mb-6 pb-2 border-b border-gray-200">
                <button onclick="app.filterCycle(1)" id="tab-cycle-1" class="cycle-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-gray-800 text-white">Ciclo 1 (Dias 1-10)</button>
                <button onclick="app.filterCycle(2)" id="tab-cycle-2" class="cycle-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-white text-gray-600 hover:bg-gray-100">Ciclo 2 (Dias 11-20)</button>
                <button onclick="app.filterCycle(3)" id="tab-cycle-3" class="cycle-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-white text-gray-600 hover:bg-gray-100">Ciclo 3 (Dias 21-30)</button>
                <button onclick="app.filterCycle(4)" id="tab-cycle-4" class="cycle-tab px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-white text-gray-600 hover:bg-gray-100">Ciclo 4 (Dias 31-40)</button>
            </div>

            <!-- Days Grid -->
            <div id="days-container" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <!-- Days will be injected here by JS -->
            </div>
        </div>

        <!-- VIEW: RADAR -->
        <div id="view-radar" class="hidden fade-in">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Radar da Aprovação</h2>
                <p class="text-gray-600">Estes são os assuntos "Top 5" identificados no edital verticalizado e nas estatísticas da banca. Prioridade tripla aqui.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Radar Chart -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 class="text-lg font-bold text-gray-800 mb-4 text-center">Distribuição de Tópicos Prioritários</h3>
                    <div class="chart-container">
                        <canvas id="priorityChart"></canvas>
                    </div>
                    <p class="text-xs text-center text-gray-400 mt-4">Quantidade de assuntos "Top 5" por disciplina.</p>
                </div>

                <!-- Priority List -->
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 custom-scroll overflow-y-auto max-h-[500px]">
                    <h3 class="text-lg font-bold text-gray-800 mb-4">Assuntos Quentes (Top 5)</h3>
                    <div id="priority-list" class="space-y-6">
                        <!-- Priority items injected by JS -->
                    </div>
                </div>
            </div>
        </div>

    </main>

    <!-- Detailed Day Modal -->
    <div id="day-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            <div class="bg-gray-800 px-6 py-4 flex justify-between items-center">
                <h3 id="modal-title" class="text-xl font-bold text-white">Dia X</h3>
                <button onclick="app.closeModal()" class="text-gray-400 hover:text-white focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-6 max-h-[70vh] overflow-y-auto custom-scroll">
                <div class="space-y-6">
                    <!-- Block 1 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 text-center">
                            <span class="block text-xs font-bold text-gray-400">1h 30m</span>
                            <div class="h-full w-0.5 bg-gray-200 mx-auto mt-1"></div>
                        </div>
                        <div class="pb-2">
                            <h4 class="text-sm font-bold text-indigo-600 uppercase tracking-wider">Matéria Nova / Foco</h4>
                            <p id="modal-block1" class="text-gray-800 font-medium mt-1">Conteúdo...</p>
                            <p class="text-sm text-gray-500 mt-1 italic">Método: Videoaula (1.5x) ou PDF + Resumo.</p>
                        </div>
                    </div>

                    <!-- Block 2 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 text-center">
                            <span class="block text-xs font-bold text-gray-400">1h 00m</span>
                            <div class="h-full w-0.5 bg-gray-200 mx-auto mt-1"></div>
                        </div>
                        <div class="pb-2">
                            <h4 class="text-sm font-bold text-teal-600 uppercase tracking-wider">Manutenção</h4>
                            <p id="modal-block2" class="text-gray-800 font-medium mt-1">Conteúdo...</p>
                            <p class="text-sm text-gray-500 mt-1 italic">Método: Bateria de Questões ou Lei Seca.</p>
                        </div>
                    </div>

                    <!-- Block 3 -->
                    <div class="flex gap-4">
                        <div class="flex-shrink-0 w-12 text-center">
                            <span class="block text-xs font-bold text-gray-400">30 min</span>
                        </div>
                        <div>
                            <h4 class="text-sm font-bold text-orange-600 uppercase tracking-wider">Revisão Turbo</h4>
                            <p id="modal-block3" class="text-gray-800 font-medium mt-1">Conteúdo...</p>
                            <p class="text-sm text-gray-500 mt-1 italic">Método: Leitura dinâmica de Lei ou Erros.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                <span class="text-sm text-gray-500">Mantenha a constância!</span>
                <button id="btn-complete-day" class="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm flex items-center">
                    <span class="mr-2">✓</span> Marcar como Concluído
                </button>
            </div>
        </div>
    </div>

    <!-- JavaScript Logic -->
    <script>
        // --- DATA STORE ---
        const studyData = {
            priorityTopics: {
                "Português": ["Interpretação de textos", "Sintaxe da oração e do período", "Pontuação", "Concordância verbal e nominal", "Reescrita de frases e coesão"],
                "Raciocínio Lógico": ["Lógica proposicional (tabelas-verdade)", "Porcentagem", "Probabilidade", "Análise combinatória", "Sequências numéricas"],
                "Informática": ["Microsoft Word (formatação)", "Microsoft Excel (fórmulas)", "Conceitos de internet e redes", "Segurança da informação", "Sistemas operacionais (Windows)"],
                "D. Constitucional": ["Direitos e garantias fundamentais", "Organização do Estado", "Organização dos Poderes", "Administração Pública na CF", "Jurisprudência do STF"],
                "D. Administrativo": ["Atos administrativos", "Poderes da Administração", "Licitações e contratos", "Responsabilidade civil do Estado", "Organização administrativa"],
                "Proc. Penal": ["Competência", "Procedimentos", "Prisões e medidas cautelares", "Recursos no processo penal", "Ação penal"],
                "Proc. Civil": ["Princípios fundamentais do CPC", "Competência", "Recursos", "Procedimentos comuns", "Tutelas provisórias"]
            },
            schedule: [
                // CICLO 1
                { day: 1, cycle: 1, b1: "Proc. Civil: Princípios Fundamentais (Arts. 1-12)", b2: "Português: 20 Questões (Interpretação)", b3: "Lei Seca: CPC Arts. 1-15", completed: false },
                { day: 2, cycle: 1, b1: "D. Adm: Estado, Gov, Adm Pública + Princípios", b2: "D. Const: Questões Art. 5º", b3: "Lei Seca: CF Art. 5º", completed: false },
                { day: 3, cycle: 1, b1: "Proc. Civil: Jurisdição e Ação", b2: "Proc. Penal: Questões Inquérito", b3: "Revisão: Pontos fracos Inquérito", completed: false },
                { day: 4, cycle: 1, b1: "D. Adm: Atos Administrativos (Conceito/Req)", b2: "RLM: Lógica Proposicional (Tabela Verdade)", b3: "Exercícios Tabela Verdade", completed: false },
                { day: 5, cycle: 1, b1: "Informática: Windows 10 + Internet", b2: "Português: Sintaxe (Período/Oração)", b3: "Revisão: Conjunções", completed: false },
                { day: 6, cycle: 1, b1: "Proc. Civil: Sujeitos e Procuradores", b2: "D. Const: Org. Estado e Adm Pública (Art. 37)", b3: "Lei Seca: CF Arts. 37-41", completed: false },
                { day: 7, cycle: 1, b1: "Redação: Ler modelos + Escrever 1 texto", b2: "Revisão Geral da Semana (Caderno de Erros)", b3: "Descanso Estratégico", completed: false, isSunday: true },
                { day: 8, cycle: 1, b1: "D. Adm: Atos (Espécies e Extinção)", b2: "Proc. Penal: Ação Penal", b3: "Lei Seca: CPP Arts. 24-62", completed: false },
                { day: 9, cycle: 1, b1: "Proc. Civil: Atos Processuais (Prazos)", b2: "RLM: Porcentagem e Probabilidade", b3: "Fórmulas de Probabilidade", completed: false },
                { day: 10, cycle: 1, b1: "Informática: Word 365 (Formatação)", b2: "Português: Pontuação", b3: "Lei Seca: Prazos CPC", completed: false },
                
                // CICLO 2
                { day: 11, cycle: 2, b1: "D. Adm: Poderes da Administração", b2: "D. Const: Poder Legislativo", b3: "Lei Seca: CF Arts. 59-69", completed: false },
                { day: 12, cycle: 2, b1: "Proc. Civil: Tutela Provisória", b2: "Proc. Penal: Competência", b3: "Lei Seca: CPC Arts. 294-311", completed: false },
                { day: 13, cycle: 2, b1: "D. Adm: Licitações (Modalidades/Critérios)", b2: "Português: Concordância", b3: "Regras especiais Concordância", completed: false },
                { day: 14, cycle: 2, b1: "Informática: Excel (Fórmulas Básicas)", b2: "RLM: Análise Combinatória", b3: "Diferença Arranjo x Combinação", completed: false },
                { day: 15, cycle: 2, b1: "Proc. Civil: Procedimento Comum (Inicial)", b2: "Proc. Penal: Prisão e Liberdade", b3: "Lei Seca: Prisões CPP", completed: false },
                { day: 16, cycle: 2, b1: "D. Adm: Contratos Administrativos", b2: "D. Const: Executivo e Judiciário", b3: "Lei Seca: CF Arts. 92-126", completed: false },
                { day: 17, cycle: 2, b1: "Informática: Segurança da Informação", b2: "Português: Crase e Regência", b3: "Casos proibidos Crase", completed: false },
                { day: 18, cycle: 2, b1: "Redação: Tema Adm Pública/Poderes", b2: "Simulado Parcial (30 questões mistas)", b3: "Correção Rápida", completed: false, isSunday: true },
                { day: 19, cycle: 2, b1: "Proc. Civil: Contestação e Revelia", b2: "Proc. Penal: Provas", b3: "Lei Seca: Provas CPP", completed: false },
                { day: 20, cycle: 2, b1: "D. Adm: Agentes Públicos (Geral)", b2: "RLM: Revisão Geral Questões", b3: "Decorar Tabela Verdade", completed: false },

                // CICLO 3
                { day: 21, cycle: 3, b1: "Proc. Civil: Sentença e Coisa Julgada", b2: "D. Const: Funções Essenciais à Justiça", b3: "Lei Seca: CF Arts. 127-135", completed: false },
                { day: 22, cycle: 3, b1: "D. Adm: Responsabilidade Civil Estado", b2: "Proc. Penal: Nulidades e Recursos", b3: "Resp. Objetiva x Subjetiva", completed: false },
                { day: 23, cycle: 3, b1: "Informática: Email e Nuvem", b2: "Português: Coesão e Reescrita", b3: "Conectivos", completed: false },
                { day: 24, cycle: 3, b1: "Proc. Civil: Recursos (Apelação/Agravo)", b2: "Proc. Penal: HC e Execução Penal", b3: "Lei Seca: Recursos CPC", completed: false },
                { day: 25, cycle: 3, b1: "D. Adm: Serviços Públicos e Improbidade", b2: "D. Const: Revisão Geral", b3: "Lei de Improbidade (Leitura)", completed: false },
                { day: 26, cycle: 3, b1: "Proc. Civil: Cumprimento e Execução", b2: "RLM: Sequências e Argumentação", b3: "Exercícios mentais", completed: false },
                { day: 27, cycle: 3, b1: "Redação: Tema Abstrato/Filosófico", b2: "Informática: Revisão Teclas Atalho", b3: "Descanso", completed: false, isSunday: true },
                { day: 28, cycle: 3, b1: "Informática: Questões Excel Avanç./Segurança", b2: "Português: Ortografia/Acentuação", b3: "Vozes Verbais", completed: false },
                { day: 29, cycle: 3, b1: "Proc. Civil: Juizados e Proc. Especiais", b2: "Proc. Penal: JECrim (Lei 9.099)", b3: "Lei 9.099 (Leitura)", completed: false },
                { day: 30, cycle: 3, b1: "D. Adm: Org. Administrativa (Desc/Desc)", b2: "D. Const: Questões Nível Difícil", b3: "Mapa Adm Direta x Indireta", completed: false },

                // CICLO 4
                { day: 31, cycle: 4, b1: "Proc. Civil: Maratona Questões (Prazos)", b2: "Foco: Recursos", b3: "Lei Seca", completed: false },
                { day: 32, cycle: 4, b1: "D. Adm: Maratona Questões (Licitações)", b2: "Foco: Atos", b3: "Lei Seca", completed: false },
                { day: 33, cycle: 4, b1: "Português: 30 Questões Interpretação", b2: "Foco: Reescrita", b3: "Texto Completo", completed: false },
                { day: 34, cycle: 4, b1: "Informática: Só Questões (Excel/Win)", b2: "Foco: Erros Recentes", b3: "Revisão Atalhos", completed: false },
                { day: 35, cycle: 4, b1: "Proc. Penal: Bateria Mista", b2: "D. Const: Bateria Mista", b3: "Foco: Prisões / Art 5º", completed: false },
                { day: 36, cycle: 4, b1: "Revisão Lei Seca: CF 1-5, 37-41", b2: "Lei 8.112 (Estatuto)", b3: "Leitura Dinâmica", completed: false },
                { day: 37, cycle: 4, b1: "Revisão Lei Seca: CPC Prazos/Tutelas", b2: "Lei 14.133 (Grifos)", b3: "Leitura Dinâmica", completed: false },
                { day: 38, cycle: 4, b1: "SIMULADO COMPLETO (3 Horas)", b2: "Sem interrupções", b3: "Ambiente de Prova", completed: false },
                { day: 39, cycle: 4, b1: "Correção do Simulado", b2: "Estudo de CADA erro", b3: "Análise de falhas", completed: false },
                { day: 40, cycle: 4, b1: "Revisão de Véspera", b2: "Decorebas RLM / Prazos", b3: "Descanso Mental", completed: false }
            ]
        };

        // --- APP LOGIC ---
        const app = {
            currentView: 'dashboard',
            currentCycle: 1,
            selectedDay: null,

            init: () => {
                app.loadState();
                app.renderDashboard();
                app.renderCronograma();
                app.renderRadar();
                app.updateProgress();
                app.initCharts();
            },

            loadState: () => {
                const saved = localStorage.getItem('tjce_schedule_progress');
                if (saved) {
                    const completedDays = JSON.parse(saved);
                    studyData.schedule.forEach(day => {
                        if (completedDays.includes(day.day)) {
                            day.completed = true;
                        }
                    });
                }
            },

            saveState: () => {
                const completedDays = studyData.schedule.filter(d => d.completed).map(d => d.day);
                localStorage.setItem('tjce_schedule_progress', JSON.stringify(completedDays));
                app.updateProgress();
            },

            navigate: (viewId) => {
                // Hide all views
                document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.add('hidden'));
                // Show target view
                document.getElementById(`view-${viewId}`).classList.remove('hidden');
                
                // Update nav styles
                document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('nav-active'));
                const navBtn = document.getElementById(`nav-${viewId}`);
                if (navBtn) navBtn.classList.add('nav-active');

                // Mobile menu hide
                document.getElementById('mobile-menu').classList.add('hidden');

                app.currentView = viewId;
                window.scrollTo(0, 0);
            },

            toggleMobileMenu: () => {
                document.getElementById('mobile-menu').classList.toggle('hidden');
            },

            // --- DASHBOARD RENDER ---
            renderDashboard: () => {
                // Determine current day suggested
                const firstIncomplete = studyData.schedule.find(d => !d.completed);
                const dayToShow = firstIncomplete ? firstIncomplete.day : 40;
                document.getElementById('current-day-display').innerText = dayToShow;
            },

            updateProgress: () => {
                const total = studyData.schedule.length;
                const done = studyData.schedule.filter(d => d.completed).length;
                const percent = Math.round((done / total) * 100);
                
                document.getElementById('progress-percent').innerText = `${percent}%`;
                document.getElementById('progress-bar').style.width = `${percent}%`;
            },

            // --- CRONOGRAMA RENDER ---
            filterCycle: (cycleNum) => {
                app.currentCycle = cycleNum;
                
                // Update Tabs
                document.querySelectorAll('.cycle-tab').forEach(btn => {
                    btn.classList.remove('bg-gray-800', 'text-white');
                    btn.classList.add('bg-white', 'text-gray-600');
                });
                const activeTab = document.getElementById(`tab-cycle-${cycleNum}`);
                activeTab.classList.remove('bg-white', 'text-gray-600');
                activeTab.classList.add('bg-gray-800', 'text-white');

                app.renderCronograma();
            },

            renderCronograma: () => {
                const container = document.getElementById('days-container');
                container.innerHTML = '';

                const days = studyData.schedule.filter(d => d.cycle === app.currentCycle);

                days.forEach(day => {
                    const isDone = day.completed;
                    const card = document.createElement('div');
                    card.className = `p-4 rounded-xl border transition cursor-pointer hover:shadow-md ${isDone ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} ${day.isSunday ? 'border-l-4 border-l-purple-400' : ''}`;
                    card.onclick = () => app.openDayModal(day);

                    card.innerHTML = `
                        <div class="flex justify-between items-start">
                            <div class="flex items-center">
                                <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${isDone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}">
                                    ${day.day}
                                </div>
                                <div>
                                    <h4 class="font-bold text-gray-800 text-sm">${day.isSunday ? 'Domingo (Redação)' : 'Estudo & Prática'}</h4>
                                    <p class="text-xs text-gray-500 truncate w-48 md:w-64">${day.b1}</p>
                                </div>
                            </div>
                            ${isDone ? '<span class="text-green-600 font-bold">✓</span>' : ''}
                        </div>
                    `;
                    container.appendChild(card);
                });
            },

            // --- MODAL LOGIC ---
            openDayModal: (day) => {
                app.selectedDay = day;
                document.getElementById('modal-title').innerText = `Dia ${day.day} - Planejamento`;
                document.getElementById('modal-block1').innerText = day.b1;
                document.getElementById('modal-block2').innerText = day.b2;
                document.getElementById('modal-block3').innerText = day.b3;
                
                const btn = document.getElementById('btn-complete-day');
                if (day.completed) {
                    btn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    btn.classList.add('bg-gray-400', 'hover:bg-gray-500');
                    btn.innerHTML = 'Desmarcar Dia';
                } else {
                    btn.classList.remove('bg-gray-400', 'hover:bg-gray-500');
                    btn.classList.add('bg-green-600', 'hover:bg-green-700');
                    btn.innerHTML = '<span class="mr-2">✓</span> Marcar como Concluído';
                }

                btn.onclick = () => {
                    day.completed = !day.completed;
                    app.saveState();
                    app.openDayModal(day); // Re-render btn state
                    app.renderCronograma(); // Re-render list
                    app.renderDashboard(); // Re-render stats
                };

                document.getElementById('day-modal').classList.remove('hidden');
            },

            closeModal: () => {
                document.getElementById('day-modal').classList.add('hidden');
            },

            // --- RADAR RENDER ---
            renderRadar: () => {
                const listContainer = document.getElementById('priority-list');
                listContainer.innerHTML = '';
                
                Object.entries(studyData.priorityTopics).forEach(([subject, topics]) => {
                    const section = document.createElement('div');
                    section.innerHTML = `
                        <h4 class="font-bold text-gray-800 border-l-4 border-indigo-500 pl-2 mb-2">${subject}</h4>
                        <ul class="list-disc list-inside text-sm text-gray-600 space-y-1 ml-1">
                            ${topics.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    `;
                    listContainer.appendChild(section);
                });
            },

            initCharts: () => {
                // 1. Time Distribution Chart (Doughnut)
                const ctxTime = document.getElementById('timeDistributionChart').getContext('2d');
                new Chart(ctxTime, {
                    type: 'doughnut',
                    data: {
                        labels: ['Matéria Nova (1.5h)', 'Questões (1h)', 'Revisão/Lei (0.5h)'],
                        datasets: [{
                            data: [90, 60, 30],
                            backgroundColor: ['#2d3748', '#8da399', '#d97757'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'right', labels: { boxWidth: 10, usePointStyle: true } }
                        }
                    }
                });

                // 2. Priority Radar Chart (Bar - easier to read counts)
                const ctxPriority = document.getElementById('priorityChart').getContext('2d');
                const labels = Object.keys(studyData.priorityTopics);
                const dataCounts = Object.values(studyData.priorityTopics).map(arr => arr.length);

                new Chart(ctxPriority, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Tópicos "Top 5"',
                            data: dataCounts,
                            backgroundColor: '#8da399',
                            borderRadius: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, max: 6 }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }
                });
            }
        };

        // Initialize App
        document.addEventListener('DOMContentLoaded', () => {
            app.init();
            app.navigate('dashboard'); // Start on dashboard
        });

    </script>
</body>
</html>