export const MENTORIA_DATA = {
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
        { day: 1, cycle: 1, b1: "Proc. Civil: Princípios Fundamentais (Arts. 1-12)", b2: "Português: 20 Questões (Interpretação)", b3: "Lei Seca: CPC Arts. 1-15" },
        { day: 2, cycle: 1, b1: "D. Adm: Estado, Gov, Adm Pública + Princípios", b2: "D. Const: Questões Art. 5º", b3: "Lei Seca: CF Art. 5º" },
        { day: 3, cycle: 1, b1: "Proc. Civil: Jurisdição e Ação", b2: "Proc. Penal: Questões Inquérito", b3: "Revisão: Pontos fracos Inquérito" },
        { day: 4, cycle: 1, b1: "D. Adm: Atos Administrativos (Conceito/Req)", b2: "RLM: Lógica Proposicional (Tabela Verdade)", b3: "Exercícios Tabela Verdade" },
        { day: 5, cycle: 1, b1: "Informática: Windows 10 + Internet", b2: "Português: Sintaxe (Período/Oração)", b3: "Revisão: Conjunções" },
        { day: 6, cycle: 1, b1: "Proc. Civil: Sujeitos e Procuradores", b2: "D. Const: Org. Estado e Adm Pública (Art. 37)", b3: "Lei Seca: CF Arts. 37-41" },
        { day: 7, cycle: 1, b1: "Redação: Ler modelos + Escrever 1 texto", b2: "Revisão Geral da Semana (Caderno de Erros)", b3: "Descanso Estratégico", isSunday: true },
        { day: 8, cycle: 1, b1: "D. Adm: Atos (Espécies e Extinção)", b2: "Proc. Penal: Ação Penal", b3: "Lei Seca: CPP Arts. 24-62" },
        { day: 9, cycle: 1, b1: "Proc. Civil: Atos Processuais (Prazos)", b2: "RLM: Porcentagem e Probabilidade", b3: "Fórmulas de Probabilidade" },
        { day: 10, cycle: 1, b1: "Informática: Word 365 (Formatação)", b2: "Português: Pontuação", b3: "Lei Seca: Prazos CPC" },

        // CICLO 2
        { day: 11, cycle: 2, b1: "D. Adm: Poderes da Administração", b2: "D. Const: Poder Legislativo", b3: "Lei Seca: CF Arts. 59-69" },
        { day: 12, cycle: 2, b1: "Proc. Civil: Tutela Provisória", b2: "Proc. Penal: Competência", b3: "Lei Seca: CPC Arts. 294-311" },
        { day: 13, cycle: 2, b1: "D. Adm: Licitações (Modalidades/Critérios)", b2: "Português: Concordância", b3: "Regras especiais Concordância" },
        { day: 14, cycle: 2, b1: "Informática: Excel (Fórmulas Básicas)", b2: "RLM: Análise Combinatória", b3: "Diferença Arranjo x Combinação" },
        { day: 15, cycle: 2, b1: "Proc. Civil: Procedimento Comum (Inicial)", b2: "Proc. Penal: Prisão e Liberdade", b3: "Lei Seca: Prisões CPP" },
        { day: 16, cycle: 2, b1: "D. Adm: Contratos Administrativos", b2: "D. Const: Executivo e Judiciário", b3: "Lei Seca: CF Arts. 92-126" },
        { day: 17, cycle: 2, b1: "Informática: Segurança da Informação", b2: "Português: Crase e Regência", b3: "Casos proibidos Crase" },
        { day: 18, cycle: 2, b1: "Redação: Tema Adm Pública/Poderes", b2: "Simulado Parcial (30 questões mistas)", b3: "Correção Rápida", isSunday: true },
        { day: 19, cycle: 2, b1: "Proc. Civil: Contestação e Revelia", b2: "Proc. Penal: Provas", b3: "Lei Seca: Provas CPP" },
        { day: 20, cycle: 2, b1: "D. Adm: Agentes Públicos (Geral)", b2: "RLM: Revisão Geral Questões", b3: "Decorar Tabela Verdade" },

        // CICLO 3
        { day: 21, cycle: 3, b1: "Proc. Civil: Sentença e Coisa Julgada", b2: "D. Const: Funções Essenciais à Justiça", b3: "Lei Seca: CF Arts. 127-135" },
        { day: 22, cycle: 3, b1: "D. Adm: Responsabilidade Civil Estado", b2: "Proc. Penal: Nulidades e Recursos", b3: "Resp. Objetiva x Subjetiva" },
        { day: 23, cycle: 3, b1: "Informática: Email e Nuvem", b2: "Português: Coesão e Reescrita", b3: "Conectivos" },
        { day: 24, cycle: 3, b1: "Proc. Civil: Recursos (Apelação/Agravo)", b2: "Proc. Penal: HC e Execução Penal", b3: "Lei Seca: Recursos CPC" },
        { day: 25, cycle: 3, b1: "D. Adm: Serviços Públicos e Improbidade", b2: "D. Const: Revisão Geral", b3: "Lei de Improbidade (Leitura)" },
        { day: 26, cycle: 3, b1: "Proc. Civil: Cumprimento e Execução", b2: "RLM: Sequências e Argumentação", b3: "Exercícios mentais" },
        { day: 27, cycle: 3, b1: "Redação: Tema Abstrato/Filosófico", b2: "Informática: Revisão Teclas Atalho", b3: "Descanso", isSunday: true },
        { day: 28, cycle: 3, b1: "Informática: Questões Excel Avanç./Segurança", b2: "Português: Ortografia/Acentuação", b3: "Vozes Verbais" },
        { day: 29, cycle: 3, b1: "Proc. Civil: Juizados e Proc. Especiais", b2: "Proc. Penal: JECrim (Lei 9.099)", b3: "Lei 9.099 (Leitura)" },
        { day: 30, cycle: 3, b1: "D. Adm: Org. Administrativa (Desc/Desc)", b2: "D. Const: Questões Nível Difícil", b3: "Mapa Adm Direta x Indireta" },

        // CICLO 4
        { day: 31, cycle: 4, b1: "Proc. Civil: Maratona Questões (Prazos)", b2: "Foco: Recursos", b3: "Lei Seca" },
        { day: 32, cycle: 4, b1: "D. Adm: Maratona Questões (Licitações)", b2: "Foco: Atos", b3: "Lei Seca" },
        { day: 33, cycle: 4, b1: "Português: 30 Questões Interpretação", b2: "Foco: Reescrita", b3: "Texto Completo" },
        { day: 34, cycle: 4, b1: "Informática: Só Questões (Excel/Win)", b2: "Foco: Erros Recentes", b3: "Revisão Atalhos" },
        { day: 35, cycle: 4, b1: "Proc. Penal: Bateria Mista", b2: "D. Const: Bateria Mista", b3: "Foco: Prisões / Art 5º" },
        { day: 36, cycle: 4, b1: "Revisão Lei Seca: CF 1-5, 37-41", b2: "Lei 8.112 (Estatuto)", b3: "Leitura Dinâmica" },
        { day: 37, cycle: 4, b1: "Revisão Lei Seca: CPC Prazos/Tutelas", b2: "Lei 14.133 (Grifos)", b3: "Leitura Dinâmica" },
        { day: 38, cycle: 4, b1: "SIMULADO COMPLETO (3 Horas)", b2: "Sem interrupções", b3: "Ambiente de Prova" },
        { day: 39, cycle: 4, b1: "Correção do Simulado", b2: "Estudo de CADA erro", b3: "Análise de falhas" },
        { day: 40, cycle: 4, b1: "Revisão de Véspera", b2: "Decorebas RLM / Prazos", b3: "Descanso Mental" }
    ]
};
