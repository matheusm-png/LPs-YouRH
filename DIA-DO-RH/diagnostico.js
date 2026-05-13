const diagnosticData = {
  dimensions: [
    {
      id: 1,
      title: "Digitalização & Tecnologia",
      questions: [
        {
          id: "1.1",
          text: "Como o RH gerencia os dados e documentos dos colaboradores?",
          hint: "💡 Um HRIS centralizado é a base de qualquer RH moderno.",
          options: [
            { text: "Totalmente em papel, sem organização digital", score: 0 },
            { text: "Parcialmente digital, com uso de planilhas e arquivos soltos", score: 1 },
            { text: "Sistema básico de RH (ex.: módulo simples de folha)", score: 2 },
            { text: "HRIS integrado com múltiplos módulos (admissão, ponto, folha, férias)", score: 4 }
          ]
        },
        {
          id: "1.2",
          text: "Como é feita a gestão do ponto e frequência dos colaboradores?",
          options: [
            { text: "Controle manual em papel ou planilha", score: 0 },
            { text: "Relógio de ponto físico, sem integração com sistemas", score: 1 },
            { text: "Sistema digital de ponto, mas sem integração automática", score: 2 },
            { text: "Sistema digital integrado com folha de pagamento e automações", score: 4 }
          ]
        },
        {
          id: "1.3",
          text: "O RH utiliza assinatura eletrônica para documentos e contratos?",
          options: [
            { text: "Não, todos os documentos são assinados fisicamente", score: 0 },
            { text: "Em alguns documentos, de forma não padronizada", score: 1 },
            { text: "Na maioria dos documentos, com ferramenta específica", score: 3 },
            { text: "Em todos os documentos, com auditoria e rastreabilidade completa", score: 4 }
          ]
        },
        {
          id: "1.4",
          text: "Como o RH utiliza automação e tecnologia em seus processos?",
          options: [
            { text: "Sem nenhuma automação — tudo é executado manualmente", score: 0 },
            { text: "Automação pontual em alguns envios de e-mail ou lembretes", score: 2 },
            { text: "Automação em processos-chave (admissão, férias, avisos)", score: 3 },
            { text: "Automação ampla com workflows, integrações e IA aplicada ao RH", score: 4 }
          ]
        },
        {
          id: "1.5",
          text: "O RH tem acesso a um portal ou app para autoatendimento dos colaboradores?",
          options: [
            { text: "Não existe canal de autoatendimento", score: 0 },
            { text: "Canal informal (WhatsApp ou e-mail)", score: 1 },
            { text: "Portal básico para consulta de holerites e solicitações", score: 2 },
            { text: "App ou portal completo com autoatendimento, solicitações e comunicados", score: 4 }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Processos & Documentação",
      questions: [
        {
          id: "2.1",
          text: "Os processos de RH são documentados e seguidos de forma padronizada?",
          options: [
            { text: "Não há processos documentados — cada pessoa faz de um jeito", score: 0 },
            { text: "Alguns processos documentados, mas sem adesão consistente", score: 1 },
            { text: "Processos documentados e seguidos pela maioria do time de RH", score: 3 },
            { text: "Processos mapeados, documentados, auditados e constantemente melhorados", score: 4 }
          ]
        },
        {
          id: "2.2",
          text: "Como é feita a gestão de férias e afastamentos?",
          options: [
            { text: "Controle manual em planilha ou papel, com frequentes erros", score: 0 },
            { text: "Planilha organizada, mas sem alertas ou automações", score: 1 },
            { text: "Sistema que controla e alerta, mas sem integração com folha", score: 2 },
            { text: "Sistema integrado com notificações automáticas e aprovações digitais", score: 4 }
          ]
        },
        {
          id: "2.3",
          text: "Como o RH garante a conformidade com a legislação trabalhista?",
          options: [
            { text: "Sem processo definido — lida com questões legais de forma reativa", score: 0 },
            { text: "Checklist manual e consultas pontuais ao DP ou escritório contábil", score: 1 },
            { text: "Calendário de obrigações e auditorias internas periódicas", score: 3 },
            { text: "Sistema de compliance integrado com alertas automáticos de prazos legais", score: 4 }
          ]
        },
        {
          id: "2.4",
          text: "O processo de desligamento de colaboradores é estruturado e documentado?",
          options: [
            { text: "Sem processo definido, cada desligamento é tratado de forma diferente", score: 0 },
            { text: "Processo parcialmente formalizado, com algumas inconsistências", score: 1 },
            { text: "Checklist de desligamento padronizado com etapas documentadas", score: 3 },
            { text: "Fluxo digital completo com entrevistas de desligamento, devolução e análise de causa", score: 4 }
          ]
        },
        {
          id: "2.5",
          text: "Como são gerenciadas as políticas internas de RH (benefícios, cargos, salários)?",
          options: [
            { text: "Não há políticas formalizadas — decisões são tomadas caso a caso", score: 0 },
            { text: "Políticas existem em documentos dispersos, pouco acessíveis", score: 1 },
            { text: "Políticas documentadas e disponíveis, mas raramente revisadas", score: 2 },
            { text: "Políticas claras, acessíveis a todos, revisadas periodicamente e alinhadas ao mercado", score: 4 }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Gestão de Pessoas & Clima Organizacional",
      questions: [
        {
          id: "3.1",
          text: "Como a empresa mede o engajamento e o clima organizacional?",
          options: [
            { text: "Não há nenhuma medição formal de clima ou engajamento", score: 0 },
            { text: "Percepção informal pelos gestores, sem dados estruturados", score: 1 },
            { text: "Pesquisa de clima anual, com análise superficial dos resultados", score: 2 },
            { text: "Pesquisa semestral + eNPS mensal com plano de ação documentado", score: 4 }
          ]
        },
        {
          id: "3.2",
          text: "Como é realizada a gestão de desempenho dos colaboradores?",
          options: [
            { text: "Sem processo de avaliação de desempenho definido", score: 0 },
            { text: "Avaliação informal e esporádica, sem critérios claros", score: 1 },
            { text: "Avaliação anual formalizada com feedback documentado", score: 2 },
            { text: "Ciclos contínuos de feedback + OKRs/metas individuais ligadas ao negócio", score: 4 }
          ]
        },
        {
          id: "3.3",
          text: "Existe um programa estruturado de desenvolvimento e capacitação?",
          options: [
            { text: "Sem programa de desenvolvimento — treinamentos ocorrem esporadicamente", score: 0 },
            { text: "Treinamentos pontuais sem planejamento anual definido", score: 1 },
            { text: "Plano de treinamento anual com orçamento destinado", score: 3 },
            { text: "Trilhas de desenvolvimento por cargo/área com LMS e mensuração de impacto", score: 4 }
          ]
        },
        {
          id: "3.4",
          text: "Como é gerenciada a relação com os colaboradores no dia a dia?",
          options: [
            { text: "Gestão reativa — o RH atua somente quando há problemas", score: 0 },
            { text: "Gestão parcialmente proativa em algumas áreas", score: 1 },
            { text: "Comunicação estruturada com ações periódicas de engajamento", score: 2 },
            { text: "Parceria estratégica com líderes (HR Business Partner) em todas as áreas", score: 4 }
          ]
        },
        {
          id: "3.5",
          text: "A empresa tem estrutura de cargos e salários definida e atualizada?",
          options: [
            { text: "Sem estrutura formal — salários definidos sem critério claro", score: 0 },
            { text: "Estrutura parcial, desatualizada ou conhecida apenas pelo RH", score: 1 },
            { text: "Plano de cargos e salários documentado, revisado anualmente", score: 3 },
            { text: "Estrutura transparente, vinculada ao mercado e ao desenvolvimento do colaborador", score: 4 }
          ]
        }
      ]
    },
    {
      id: 4,
      title: "Recrutamento, Seleção & Onboarding",
      questions: [
        {
          id: "4.1",
          text: "Como é o processo de recrutamento e seleção na empresa?",
          options: [
            { text: "Sem processo definido — contratações ocorrem de forma ad hoc", score: 0 },
            { text: "Processo informal com triagem manual de currículos", score: 1 },
            { text: "Processo estruturado com etapas definidas, mas sem suporte tecnológico", score: 2 },
            { text: "ATS (sistema de recrutamento) com pipeline visual e comunicação automatizada", score: 4 }
          ]
        },
        {
          id: "4.2",
          text: "Quanto tempo leva, em média, o processo de contratação (time-to-hire)?",
          hint: "💡 O time-to-hire é um KPI crítico de eficiência do RH.",
          options: [
            { text: "Mais de 60 dias — sem controle ou meta definida", score: 0 },
            { text: "Entre 31 e 60 dias, com variações grandes entre vagas", score: 1 },
            { text: "Entre 15 e 30 dias, com processo razoavelmente padronizado", score: 3 },
            { text: "Menos de 15 dias, com SLAs definidos e monitorados", score: 4 }
          ]
        },
        {
          id: "4.3",
          text: "Como é feita a triagem e avaliação de candidatos?",
          options: [
            { text: "Análise manual de currículos sem critérios padronizados", score: 0 },
            { text: "Triagem com perguntas básicas por e-mail ou telefone", score: 1 },
            { text: "Testes e entrevistas estruturadas com critérios definidos por vaga", score: 3 },
            { text: "Avaliações comportamentais (DISC, MBTI, etc.) e testes técnicos digitais integrados", score: 4 }
          ]
        },
        {
          id: "4.4",
          text: "Como é o processo de onboarding dos novos colaboradores?",
          options: [
            { text: "Sem onboarding estruturado — o novo colaborador aprende por conta própria", score: 0 },
            { text: "Onboarding informal, variando de acordo com o gestor", score: 1 },
            { text: "Processo de integração definido com agenda estruturada nos primeiros dias", score: 2 },
            { text: "Programa de onboarding digital com trilha de aprendizagem, buddy e acompanhamento de 90 dias", score: 4 }
          ]
        },
        {
          id: "4.5",
          text: "O RH acompanha e mede a qualidade das contratações (quality of hire)?",
          options: [
            { text: "Não há acompanhamento pós-contratação", score: 0 },
            { text: "Feedback informal do gestor após período de experiência", score: 1 },
            { text: "Avaliação formal ao final do período de experiência (45/90 dias)", score: 2 },
            { text: "Dashboard de qualidade de contratação com indicadores de desempenho e retenção", score: 4 }
          ]
        }
      ]
    },
    {
      id: 5,
      title: "Estratégia & People Analytics",
      questions: [
        {
          id: "5.1",
          text: "O RH define e acompanha indicadores (KPIs) de forma regular?",
          options: [
            { text: "Sem indicadores definidos — o RH não mede seus resultados", score: 0 },
            { text: "Alguns indicadores básicos como headcount e turnover, medidos esporadicamente", score: 1 },
            { text: "KPIs definidos e acompanhados mensalmente em reuniões de equipe", score: 3 },
            { text: "Dashboard de People Analytics atualizado em tempo real com análises preditivas", score: 4 }
          ]
        },
        {
          id: "5.2",
          text: "O planejamento de RH está alinhado ao planejamento estratégico do negócio?",
          options: [
            { text: "Não existe planejamento de RH — as ações são reativas às demandas", score: 0 },
            { text: "Planejamento de RH existe, mas não está alinhado às metas da empresa", score: 1 },
            { text: "Alinhamento parcial, com revisões anuais e reuniões com a diretoria", score: 3 },
            { text: "RH é parceiro estratégico do negócio, com metas integradas ao planejamento corporativo", score: 4 }
          ]
        },
        {
          id: "5.3",
          text: "Como o RH utiliza dados para tomada de decisão?",
          options: [
            { text: "Decisões tomadas com base em intuição ou pressão — sem dados", score: 0 },
            { text: "Uso pontual de dados para justificar decisões já tomadas", score: 1 },
            { text: "Relatórios mensais utilizados em reuniões de gestão", score: 2 },
            { text: "People Analytics integrado à estratégia, com modelos preditivos de retenção e performance", score: 4 }
          ]
        },
        {
          id: "5.4",
          text: "Como é feita a gestão da marca empregadora (Employer Branding)?",
          options: [
            { text: "A empresa não trabalha a marca empregadora ativamente", score: 0 },
            { text: "Presença básica em LinkedIn sem estratégia definida", score: 1 },
            { text: "Estratégia de employer branding com conteúdo regular e acompanhamento de reputação", score: 3 },
            { text: "Programa estruturado de EB com embaixadores, NPS de candidatos e benchmarking", score: 4 }
          ]
        },
        {
          id: "5.5",
          text: "O RH tem papel ativo nas decisões estratégicas da liderança e do board?",
          options: [
            { text: "O RH é visto como área administrativa, sem participação estratégica", score: 0 },
            { text: "Participação pontual em decisões relacionadas a contratação ou cortes", score: 1 },
            { text: "RH é consultado em decisões de expansão, cultura e estrutura organizacional", score: 3 },
            { text: "CHRO ou Head de RH participa ativamente das reuniões de liderança e comitês estratégicos", score: 4 }
          ]
        }
      ]
    }
  ],
  levels: [
    {
      min: 0,
      max: 20,
      name: "Nível 1 — Operacional Básico",
      desc: "RH reativo, sem processos definidos, altamente manual. Alta dependência de pessoas para execução das tarefas. Baixíssima ou nenhuma digitalização."
    },
    {
      min: 21,
      max: 40,
      name: "Nível 2 — Em Desenvolvimento",
      desc: "Alguns processos formalizados, mas ainda inconsistentes. Poucos sistemas em uso. Foco predominante em tarefas operacionais."
    },
    {
      min: 41,
      max: 60,
      name: "Nível 3 — Estruturado",
      desc: "Processos razoavelmente definidos e documentados. Uso pontual de ferramentas digitais. Iniciativas estratégicas ainda incipientes."
    },
    {
      min: 61,
      max: 80,
      name: "Nível 4 — Avançado",
      desc: "RH digital com automações relevantes. Dados utilizados para tomada de decisão. Atuação estratégica consolidada em grande parte."
    },
    {
      min: 81,
      max: 100,
      name: "Nível 5 — RH Estratégico Digital",
      desc: "RH totalmente integrado, com uso de inteligência de dados, automação ampla e forte atuação como parceiro estratégico do negócio."
    }
  ],
  recommendations: [
    { area: "Digitalização", icon: "🎯", text: "Adotar um HRIS centralizado que integre admissão, ponto, férias e folha. A fragmentação de sistemas é o principal gerador de retrabalho e erros." },
    { area: "People Analytics", icon: "📊", text: "Instituir dashboards com indicadores-chave: turnover, absenteísmo, tempo médio de contratação, NPS do colaborador. Dados transformam RH em área estratégica." },
    { area: "Automação", icon: "🤖", text: "Automatizar processos repetitivos como envio de documentos, lembretes de vencimento, relatórios mensais e fluxos de aprovação. Libera o time para iniciativas de valor." },
    { area: "Desenvolvimento", icon: "🌱", text: "Estruturar uma trilha de aprendizagem por cargo e área, vinculada às metas de negócio. RH que desenvolve pessoas retém talentos e reduz turnover." },
    { area: "Cultura e Clima", icon: "🤝", text: "Implementar pesquisa de clima semestral e medir eNPS mensalmente. Empresas com cultura forte têm até 4x menos rotatividade que a média do mercado." },
    { area: "Compliance & Gestão", icon: "📋", text: "Garantir rastreabilidade de todos os documentos e processos. Conformidade trabalhista reduzida a riscos e auditorias são diferenciais competitivos." }
  ],
  plan: [
    {
      phase: "Fase 1 (Dias 1–30)",
      subtitle: "Diagnóstico e Fundação",
      items: [
        "Mapeamento completo dos processos de RH atuais (AS-IS)",
        "Identificação e priorização dos gaps críticos",
        "Definição de responsáveis e quick wins de impacto imediato",
        "Implementação de sistema de gestão de ponto e frequência digital",
        "Padronização dos contratos e documentos admissionais"
      ]
    },
    {
      phase: "Fase 2 (Dias 31–60)",
      subtitle: "Digitalização e Estruturação",
      items: [
        "Implantação ou otimização do HRIS/sistema de gestão de pessoas",
        "Digitalização dos arquivos e prontuários de colaboradores",
        "Criação de fluxos de onboarding digital e estruturado",
        "Implementação de ferramenta de gestão de desempenho",
        "Automatização dos relatórios e indicadores de RH básicos"
      ]
    },
    {
      phase: "Fase 3 (Dias 61–90)",
      subtitle: "Estratégia e Inteligência",
      items: [
        "Construção do painel de People Analytics com KPIs estratégicos",
        "Implantação de programa de desenvolvimento e trilhas de aprendizagem",
        "Criação de comitê de RH estratégico com lideranças",
        "Definição de metas de RH alinhadas ao planejamento do negócio",
        "Avaliação de resultados do plano e projeção para os próximos 90 dias"
      ]
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0; // 0: lead form, 1...25: questions, 26: processing, 27: results
  const answers = {};
  const userData = {};
  
  const totalQuestions = diagnosticData.dimensions.reduce((acc, dim) => acc + dim.questions.length, 0);
  const allQuestions = diagnosticData.dimensions.flatMap(dim => dim.questions);
  
  const quizContainer = document.getElementById('quiz-content');
  const progressBar = document.getElementById('progress-bar-fill');
  const progressText = document.getElementById('progress-text');
  
  function renderStep() {
    if (currentStep === 0) {
      renderLeadForm();
    } else if (currentStep <= totalQuestions) {
      renderQuestion(currentStep - 1);
      updateProgress();
    } else if (currentStep === totalQuestions + 1) {
      renderProcessing();
    } else {
      renderDashboard();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  function updateProgress() {
    const perc = ((currentStep - 1) / totalQuestions) * 100;
    if (progressBar) progressBar.style.width = `${perc}%`;
    if (progressText) progressText.innerText = `Questão ${currentStep} de ${totalQuestions}`;
    const currentQ = allQuestions[currentStep - 1];
    // Find current dimension title
    const dim = diagnosticData.dimensions.find(d => d.questions.some(q => q.id === currentQ.id));
    const dimEl = document.getElementById('current-dim-title');
    if (dimEl && dim) dimEl.innerText = `Dimensão ${dim.id}: ${dim.title}`;
  }

  /* =========== Persistência de UTM no App ============ */
  (function () {
    var UTM_KEY    = 'yourh_utm_params';
    var UTM_EXPIRY = 30 * 24 * 60 * 60 * 1000;
    var UTM_KEYS   = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_marketing_tactic'];

    function readFromUrl() {
      var p = new URLSearchParams(window.location.search);
      var obj = {}, any = false;
      UTM_KEYS.forEach(function (k) {
        var v = p.get(k);
        if (v && v.trim()) { obj[k] = v.trim().toLowerCase(); any = true; }
      });
      return any ? obj : null;
    }

    var utms = (function () {
      var fromUrl = readFromUrl();
      if (fromUrl) {
        try { localStorage.setItem(UTM_KEY, JSON.stringify({ data: fromUrl, expires: Date.now() + UTM_EXPIRY })); } catch (e) {}
        return fromUrl;
      }
      try {
        var raw = localStorage.getItem(UTM_KEY);
        if (raw) {
          var stored = JSON.parse(raw);
          if (stored && Date.now() <= stored.expires) return stored.data || {};
          localStorage.removeItem(UTM_KEY);
        }
      } catch (e) {}
      return {};
    })();
    window.__yourhUtms = utms;
  })();

  function populateUtmFields(form) {
    var utms = window.__yourhUtms || {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_marketing_tactic'].forEach(function (k) {
      var el = form.querySelector('#' + k);
      if (el && utms[k]) el.value = utms[k];
    });
  }

  /* =========== Validações e Máscaras do Lead ============ */
  const validators = {
    nome:        (v) => v.trim().split(/\s+/).length >= 2 && v.trim().split(/\s+/)[1].length >= 1,
    email:       (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    telefone:    (v) => { const d = v.replace(/\D/g, ''); return d.length >= 10 && d.length <= 11; },
    empresa:     (v) => v.trim().length >= 2,
    site:        (v) => true, // opcional
    cargo:       (v) => v !== '',
    funcionarios:(v) => v !== '',
    pessoas_rh:  (v) => true, // opcional
    desafio:     (v) => v !== '',
    lgpd:        (v, el) => el ? el.checked : false,
  };

  const errorMessages = {
    nome:        'Informe seu nome completo.',
    email:       'Informe um e-mail corporativo válido.',
    telefone:    'Informe um telefone com DDD.',
    empresa:     'Informe o nome da empresa.',
    cargo:       'Selecione seu cargo.',
    funcionarios:'Selecione o número de colaboradores.',
    desafio:     'Selecione seu maior desafio.',
    lgpd:        'Você precisa aceitar os termos.',
  };

  function validateField(input) {
    const fieldName = input.dataset.field;
    if (!fieldName || !validators[fieldName]) return true;
    const isValid = fieldName === 'lgpd'
      ? input.checked
      : validators[fieldName](input.value, input);

    const errEl = document.getElementById('error-' + fieldName);
    if (!isValid) {
      input.classList.add('is-error');
      if (errEl) errEl.textContent = errorMessages[fieldName] || 'Campo obrigatório.';
      return false;
    }
    input.classList.remove('is-error');
    if (errEl) errEl.textContent = '';
    return true;
  }

  function renderLeadForm() {
    const form = document.getElementById('lp_dia-do-rh_conv');
    if (!form) return;

    populateUtmFields(form);

    // WhatsApp Mask
    const telInput = document.getElementById('field-whatsapp');
    if (telInput) {
      telInput.addEventListener('input', (e) => {
        let v = e.target.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 7)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
        else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
        else if (v.length > 0) v = `(${v}`;
        e.target.value = v;
      });
    }

    // Clear error on input change
    form.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener(input.tagName === 'SELECT' ? 'change' : 'input', () => {
        if (input.classList.contains('is-error')) validateField(input);
      });
    });

    form.addEventListener('submit', (e) => {
      let hasError = false;
      let firstInvalid = null;

      form.querySelectorAll('[data-field]').forEach(input => {
        if (!validateField(input)) {
          hasError = true;
          if (!firstInvalid) firstInvalid = input;
        }
      });

      if (hasError) {
        e.preventDefault();
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Form is valid, update UTMS
      populateUtmFields(form);

      // Save core user data for UI/dashboard
      userData.nome = document.getElementById('field-nome').value;
      userData.empresa = document.getElementById('field-empresa').value;
      userData.colab = document.getElementById('field-colab').value;

      // GTM Push
      const utms = window.__yourhUtms || {};
      if (window.dataLayer) {
        window.dataLayer.push({
          event:                 'lead_form_submit',
          conversion_identifier: 'autodiagnostico-maturidade-yourh',
          lead_email:            document.getElementById('field-email').value.trim(),
          lead_empresa:          userData.empresa.trim(),
          lead_cargo:            document.getElementById('field-cargo').value.trim(),
          utm_source:            utms.utm_source   || undefined,
          utm_medium:            utms.utm_medium   || undefined,
          utm_campaign:          utms.utm_campaign || undefined,
        });
      }

      // Prevent visual redirect, submission occurs via native form to silent iframe
      // We delay visual step change slightly to give browser time to fire events
      setTimeout(() => {
        document.getElementById('intro-screen').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'block';
        currentStep = 1;
        renderStep();
      }, 200);
    });
  }

  function renderQuestion(idx) {
    const question = allQuestions[idx];
    const dimension = diagnosticData.dimensions.find(d => d.questions.some(q => q.id === question.id));
    
    let html = `
      <div class="question-card reveal-in">
        <span class="eyebrow eyebrow--light">Dimensão ${dimension.id} · Pergunta ${question.id}</span>
        <h2 class="question-text">${question.text}</h2>
        ${question.hint ? `<p class="question-hint">${question.hint}</p>` : ''}
        <div class="options-grid">
    `;
    
    question.options.forEach((opt, optIdx) => {
      html += `
        <button class="option-btn" data-score="${opt.score}">
          <span class="option-circle"></span>
          <span class="option-text">${opt.text}</span>
        </button>
      `;
    });
    
    html += `
        </div>
        <div class="quiz-nav">
          ${currentStep > 1 ? `<button id="btn-prev" class="btn-secondary">← Voltar</button>` : `<div></div>`}
        </div>
      </div>
    `;
    
    quizContainer.innerHTML = html;
    
    // Add listeners
    const options = quizContainer.querySelectorAll('.option-btn');
    options.forEach(btn => {
      btn.addEventListener('click', () => {
        const score = parseInt(btn.getAttribute('data-score'));
        answers[question.id] = score;
        
        // Small effect
        btn.classList.add('active');
        
        setTimeout(() => {
          currentStep++;
          renderStep();
        }, 350);
      });
    });
    
    const prevBtn = document.getElementById('btn-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentStep--;
        renderStep();
      });
    }
  }
  
  function renderProcessing() {
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('processing-screen').style.display = 'flex';
    
    let progressCount = 0;
    const loaderBar = document.getElementById('processing-bar');
    const procStatus = document.getElementById('processing-status');
    const statuses = ["Somando as dimensões...", "Avaliando maturidade...", "Cruzando melhores práticas...", "Gerando plano estratégico..."];
    
    const intv = setInterval(() => {
      progressCount += 2;
      if (loaderBar) loaderBar.style.width = `${progressCount}%`;
      if (progressCount % 25 === 0 && progressCount < 100) {
        if (procStatus) procStatus.innerText = statuses[Math.floor(progressCount/25)];
      }
      if (progressCount >= 100) {
        clearInterval(intv);
        currentStep++;
        renderStep();
      }
    }, 40);
  }
  
  function renderDashboard() {
    document.getElementById('processing-screen').style.display = 'none';
    document.getElementById('dashboard-screen').style.display = 'block';
    
    // Calc total score
    let totalScore = 0;
    Object.keys(answers).forEach(key => totalScore += answers[key]);
    
    // Calc per dimension
    const dimScores = diagnosticData.dimensions.map(d => {
      let sum = 0;
      d.questions.forEach(q => sum += (answers[q.id] || 0));
      return { id: d.id, title: d.title, score: sum };
    });
    
    // Find Level
    const level = diagnosticData.levels.find(l => totalScore >= l.min && totalScore <= l.max) || diagnosticData.levels[0];
    
    // Update UI
    document.getElementById('res-total-score').innerText = totalScore;
    document.getElementById('res-level-name').innerText = level.name;
    document.getElementById('res-level-desc').innerText = level.desc;
    document.getElementById('res-user-company').innerText = userData.empresa;

    // Dimensional Bars
    const listEl = document.getElementById('res-dim-list');
    listEl.innerHTML = '';
    dimScores.forEach(ds => {
      const perc = (ds.score / 20) * 100;
      listEl.innerHTML += `
        <div class="res-dim-item">
          <div class="dim-info">
            <span class="dim-title">${ds.title}</span>
            <span class="dim-val">${ds.score}/20</span>
          </div>
          <div class="dim-bar-bg">
            <div class="dim-bar-fill" style="width: ${perc}%"></div>
          </div>
        </div>
      `;
    });
    
    // Recommendations (Filter if desired or show top 3, let's show all as strategic suggestions)
    const recList = document.getElementById('res-rec-list');
    recList.innerHTML = '';
    diagnosticData.recommendations.slice(0,4).forEach(r => {
      recList.innerHTML += `
        <div class="rec-card">
          <div class="rec-head">
            <span class="rec-icon">${r.icon}</span>
            <h4>${r.area}</h4>
          </div>
          <p>${r.text}</p>
        </div>
      `;
    });

    // Plan render
    const planEl = document.getElementById('res-plan-content');
    planEl.innerHTML = '';
    diagnosticData.plan.forEach(p => {
      planEl.innerHTML += `
        <div class="plan-phase">
          <div class="phase-badge">${p.phase}</div>
          <h5>${p.subtitle}</h5>
          <ul class="phase-items">
            ${p.items.map(it => `<li><span class="check">✔</span> ${it}</li>`).join('')}
          </ul>
        </div>
      `;
    });

    // Set hidden input values for final call or form if exists
    const finalInputScore = document.getElementById('hidden_total_score');
    if (finalInputScore) finalInputScore.value = totalScore;
    
    // Auto trigger RD or analytics if defined
    if (typeof rdSubmitDiagnostic === 'function') {
      rdSubmitDiagnostic(userData, totalScore, level.name, dimScores);
    }
  }

  // Init
  if (document.getElementById('intro-screen')) {
    renderLeadForm();
  }
});
