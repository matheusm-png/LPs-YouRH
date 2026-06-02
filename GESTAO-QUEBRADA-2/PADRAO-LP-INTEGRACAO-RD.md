# Padrão de LP YouRH — Estrutura + Integração RD Station / CAPI

> **Documento de referência (gabarito).**
> Esta LP — `GESTAO-QUEBRADA-2` — está com a estrutura e a integração **funcionando corretamente**: os leads caem no **RD Station** e no **Exact Sales** como esperado.
> Use este documento para auditar e consertar as outras LPs que estão com problema na integração do RD.
>
> Como ler: a [Parte 1](#parte-1--inventário-completo) é o inventário de tudo que existe em cada página/arquivo. A [Parte 2](#parte-2--como-a-integração-funciona-fluxo-do-lead) explica o fluxo do lead de ponta a ponta. A [Parte 3](#parte-3--checklist-de-correção-das-outras-lps) é o **checklist cirúrgico** — é por aqui que você conserta as outras LPs.

---

## Sumário

- [Parte 1 — Inventário completo](#parte-1--inventário-completo)
  - [1.1 Árvore de arquivos](#11-árvore-de-arquivos)
  - [1.2 `index.html` (home)](#12-indexhtml-home)
  - [1.3 `obrigado.html` (thank you)](#13-obrigadohtml-thank-you)
  - [1.4 Arquivos JS](#14-arquivos-js)
  - [1.5 Arquivos CSS](#15-arquivos-css)
  - [1.6 Assets e config](#16-assets-e-config)
- [Parte 2 — Como a integração funciona (fluxo do lead)](#parte-2--como-a-integração-funciona-fluxo-do-lead)
- [Parte 3 — Checklist de correção das outras LPs](#parte-3--checklist-de-correção-das-outras-lps)
- [Parte 4 — Tabela de valores que mudam por LP](#parte-4--tabela-de-valores-que-mudam-por-lp)
- [Parte 5 — Bug encontrado nesta LP (slug `-2`)](#parte-5--bug-encontrado-nesta-lp-slug--2)

---

# Parte 1 — Inventário completo

## 1.1 Árvore de arquivos

```
GESTAO-QUEBRADA-2/
├── index.html              # Home / LP principal (1.988 linhas)
├── obrigado.html           # Página de agradecimento pós-conversão (311 linhas)
├── css/
│   ├── reset.css           # Reset de estilos (carregado 1º)
│   ├── variables.css       # Design tokens (cores, fontes, espaçamentos)
│   ├── animations.css      # Keyframes e classes de animação
│   └── main.css            # Estilos globais de componentes
├── js/
│   ├── consent.js          # Banner LGPD + Consent Mode v2 (granted/denied)
│   ├── gtm-events.js       # Camada de eventos GTM/CAPI (PageView, Lead, etc.) ⭐
│   ├── form.js             # Validação, máscara, UTMs, submit + redirect ⭐
│   ├── obrigado.js         # Dispara evento "Lead" na página de obrigado ⭐
│   ├── checklist.js        # Diagnóstico interativo (específico desta LP)
│   ├── main.js             # IntersectionObserver, FAQ, contadores, glass-crack
│   └── countdown.js        # Contador regressivo (NÃO usado nesta LP — ver nota)
└── assets/
    ├── favicon_yourh.svg
    ├── logo.svg            # Logo claro (rodapé)
    ├── logo-dark.svg       # Logo escuro (header / LCP)
    └── compartilhamento-img.webp   # Imagem Open Graph (1200×630)
```

⭐ = arquivos do núcleo da integração. São esses que precisam estar corretos para o lead cair.

---

## 1.2 `index.html` (home)

### `<head>` — ordem importa

A ordem dos blocos no `<head>` é **crítica** e não deve ser alterada:

1. **Meta tags básicas** — `charset`, `viewport`, `description`, `robots` (`index, follow`).
2. **Favicon** — `assets/favicon_yourh.svg`.
3. **Open Graph** — `og:title`, `og:description`, `og:type`, `og:locale`, `og:url`, `og:image` (+ width/height).
4. **Twitter Card** — `summary_large_image`.
5. **`<title>`**.
6. **Google Fonts** — carregamento não-bloqueante (`preconnect` → `preload as=style` → `stylesheet media=print onload` → `<noscript>` fallback). Fontes: **Bricolage Grotesque** (headlines) + **Inter** (corpo).
7. **Preload do LCP** — `assets/logo-dark.svg`.
8. **CSS** — nesta ordem fixa: `reset.css` → `variables.css` → `animations.css` → `main.css`.
9. **`<style>` inline** — estilos específicos da LP (hero hook, seção rotina, checklist dark, comparativo, jornada, depoimento). ~740 linhas. Não afetam a integração.
10. **🔑 BLOCO DE RASTREAMENTO** (ver detalhamento abaixo).

### 🔑 Bloco de rastreamento do `<head>` (a ordem é obrigatória)

Esta é a sequência exata, e **a ordem entre eles é o que garante o cookie de sessão correto do RD**:

```html
<!-- 1º — Consent Mode v2: defaults NEGADOS antes do GTM (LGPD) -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('consent', 'default', {
    ad_storage:          'denied',
    analytics_storage:   'denied',
    ad_user_data:        'denied',
    ad_personalization:  'denied',
    wait_for_update:     500
  });
</script>

<!-- 2º — RD Station: SCRIPT DE RASTREAMENTO (tracking do domínio).
     DEVE ficar ANTES do GTM. Token "rdstation.js" -->
<script type="text/javascript" async
  src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/2b4d5177951b2aaefe0b7f838559c2d9-rdstation.js"></script>

<!-- 3º — Google Tag Manager -->
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-TRVZBWCH');</script>
```

### `<body>`

1. **GTM `<noscript>`** (logo após abrir o `<body>`).
2. **`<header class="site-header">`** — logo (`logo-dark.svg`), nav (#problema, #checklist, #solucao, #faq) e CTA "Quero uma demonstração" (#form).
3. **`<main id="main-content">`** com as seções, na ordem:
   - `.hero` (`#hero`) — hook em chips (3 ferramentas + 1 planilha = 0 integração), título, subtítulo, 2 CTAs, trust badges, **overlay de vidro quebrando** (SVG + `main.js`).
   - `.section-rotina` (`#problema`) — diagrama das 4 ferramentas desconectadas.
   - `.section-checklist` (`#checklist`) — diagnóstico interativo (3 fieldsets / 10 checkboxes), controlado por `checklist.js`.
   - `.section-comparison` (`#comparativo`) — antes vs. depois.
   - `.section-solution` (`#solucao`) — jornada conectada (3 cards) + bloco de resultado.
   - `.section-testimonial` — depoimento (Carla M.).
   - `.section-proof` (`#credenciais`) — contadores animados (500+, 12+, 50.000+, 3) + banner CTA.
   - `.section-content` (`#conteudo`) — 3 cards de blog (links externos `yourh.com.br/blog/...`).
   - **`.section-form` (`#form`) — FORMULÁRIO DE CONVERSÃO** (ver 1.2.1).
   - `.section-faq` (`#faq`) — accordion com 5 perguntas.
4. **`<footer class="site-footer">`** — branding fixo YouRH (logo, tagline, redes, 2 endereços, botão "trabalhe na yourh", CNPJ, política de privacidade).
5. **🔑 RD Station Loader** (body) — ver 1.2.2.
6. **Banner de cookies** (`#cookie-banner`) + `<style>` inline do banner.
7. **Scripts no fim do body** (ver 1.2.3).

### 1.2.1 🔑 Formulário de conversão (`#form`)

Atributos do `<form>`:

| Atributo | Valor nesta LP |
|---|---|
| `id` | `lp-gestao-quebrada-2` |
| `method` | `post` |
| `action` | `https://lp.yourh.com.br/gestao-quebrada-2/obrigado.html` |
| `novalidate` | presente (validação é feita pelo `form.js`) |

**Campos visíveis** (o atributo `name` é o que o RD Station lê — não mude sem mudar no RD):

| `name` | Tipo | `data-field` | Observação |
|---|---|---|---|
| `name` | text | `nome` | nome completo (valida nome + sobrenome) |
| `email` | email | `email` | e-mail corporativo |
| `phone` | tel | `telefone` | máscara BR `(00) 00000-0000` |
| `company` | text | `empresa` | nome da empresa |
| `site` | text | `site` | site/rede social |
| `form_fields_qtd_funcionarios` | select | `funcionarios` | ⚠️ nome verboso — **tem que bater com o campo do RD** |
| `cargo` | select | `cargo` | cargo |
| `policy` | checkbox | `lgpd` | aceite LGPD, `value="on"` |

**Campos ocultos** (essenciais para rastreio/atribuição):

```html
<input type="text"   name="website" tabindex="-1" style="display:none">   <!-- honeypot anti-spam -->
<input type="hidden" name="conversion_identifier" value="lp-gestao-quebrada-2">  <!-- 🔑 -->
<input type="hidden" name="utm_source"           id="utm_source">
<input type="hidden" name="utm_medium"           id="utm_medium">
<input type="hidden" name="utm_campaign"         id="utm_campaign">
<input type="hidden" name="utm_content"          id="utm_content">
<input type="hidden" name="utm_term"             id="utm_term">
<input type="hidden" name="utm_marketing_tactic" id="utm_marketing_tactic">
<input type="hidden" name="fbclid"               id="fbclid">
<input type="hidden" name="fbc"                  id="fbc">
<input type="hidden" name="fbp"                  id="fbp">
```

> O `conversion_identifier` é o nome da conversão no RD Station. **É ele que faz o lead ser categorizado/roteado** (e chega ao Exact Sales pela integração RD↔Exact). Tem que existir e tem que ser único por LP.

Botão de submit: `<button type="submit" class="form-submit-btn">` + nota de rodapé + `<div class="form-send-error">` (alvo de mensagem de erro de envio).

### 1.2.2 🔑 RD Station Loader (fim do `<body>`)

```html
<!-- Captura a submissão nativa do formulário. NÃO ALTERAR. Token "loader.js" -->
<script type="text/javascript" async
  src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/a81f367c-46ec-4dea-a2c2-4367f6781b13-loader.js"></script>
```

> ⚠️ **Atenção: são DOIS tokens RD diferentes.** O do `<head>` (`...2b4d5177951b2aaefe0b7f838559c2d9-rdstation.js`) é o **script de rastreamento** do domínio. O do `<body>` (`...a81f367c-46ec-4dea-a2c2-4367f6781b13-loader.js`) é o **loader** que escuta o `submit` do formulário e envia o lead via AJAX. Quando o cliente diz "RD no head e no body, repetido, e é necessário", é a isto que se refere — **mas note que os arquivos são diferentes, não idênticos.** Confundir/duplicar o token errado é uma causa comum de lead não cair.

### 1.2.3 Scripts no fim do `<body>` (ordem importa)

```html
<script src="js/checklist.js"  defer></script>
<script src="js/gtm-events.js" defer></script>
<script src="js/form.js"       defer></script>
<script src="js/main.js"       defer></script>
<script src="js/consent.js"    defer></script>
```

> `gtm-events.js` **deve vir antes** de `form.js`, porque o `form.js` chama `window.GTMEvents.prepareLead()` no submit.

---

## 1.3 `obrigado.html` (thank you)

Página de destino do redirect após o submit. Estrutura:

1. **`<head>`**:
   - `robots` = **`noindex, nofollow`** (página de obrigado nunca é indexada).
   - Favicon, fonts (carregamento simples, sem o truque non-blocking), CSS na mesma ordem.
   - **Consent Mode v2** (idêntico ao do index) → **GTM** (`GTM-TRVZBWCH`).
   - `<style>` inline da página de obrigado.
2. **`<body class="obrigado-page">`**:
   - GTM `<noscript>`.
   - `<header>` (mesma estrutura, links apontam para `index.html#...`).
   - `<main class="obrigado-main">` — card de confirmação: ícone de check, badge "Solicitação recebida", título "Recebemos sua solicitação!", descrição, 3 próximos passos, botão "Voltar para a página".
   - `<footer>` (idêntico ao do index).
3. **Scripts no fim do body** (ordem):
   ```html
   <script src="js/gtm-events.js" defer></script>
   <script src="js/obrigado.js"   defer></script>
   <script src="js/consent.js"    defer></script>
   ```
4. **🔑 RD Station — Código de Monitoramento (loader, mesmo token do body do index):**
   ```html
   <script type="text/javascript" async
     src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/a81f367c-46ec-4dea-a2c2-4367f6781b13-loader.js"></script>
   ```

> A obrigado.html **não** tem `form.js`, `checklist.js`, `main.js` nem `countdown.js` — ela só precisa de `gtm-events.js` (base de eventos), `obrigado.js` (dispara o "Lead") e `consent.js`.

---

## 1.4 Arquivos JS

### 🔑 `gtm-events.js` — camada de eventos (CAPI/GTM)

Expõe `window.GTMEvents` e dispara eventos no `dataLayer`. Constantes no topo (mudam por LP):

```js
var FORM_ID       = 'lp-gestao-quebrada-2';   // 🔑 = id do <form>
var PAGE_NAME     = 'Gestão Quebrada | YouRH';
var PAGE_CATEGORY = 'Landing Page - RH';
var SESSION_KEY    = 'lead_event_id';
var SESSION_HASHES = 'lead_user_hashes';
```

O que faz:
- **`generateEventId()`** — UUID v4 (usado para deduplicação Pixel × CAPI).
- **`sha256()`** — hash de e-mail/telefone (PII **nunca** vai em texto puro no dataLayer).
- **`firePageview()`** — evento `PageView` no load.
- **`fireFormStarted()`** — evento `form_started` no primeiro foco de qualquer campo.
- **`initScrollTracking()`** — eventos `ViewContent` em 25/50/75/100% de scroll.
- **`initTimeTracking()`** — evento `time_on_page` a cada 30s.
- **`window.GTMEvents.prepareLead(form)`** — chamado pelo `form.js` no submit:
  1. gera `event_id`, salva em `sessionStorage['lead_event_id']`;
  2. faz SHA-256 de `email` e `phone`, salva em `sessionStorage['lead_user_hashes']`;
  3. dá push do evento `lead_pending` (com `user_data` hasheado) no dataLayer;
  4. retorna o `event_id` (Promise).
- **`window.GTMEvents.getCookie(name)`** — usado pelo `form.js` para ler `_fbp`/`_fbc`.

### 🔑 `form.js` — validação, UTMs, submit e redirect

Responsável por **bloquear o POST nativo** e fazer o redirect manualmente, dando tempo para o AJAX do RD rodar.

- **UTMs**: lê da URL, salva em `localStorage['yourh_utm_params']` por **30 dias**, e injeta nos campos hidden no load e no submit. Default: `utm_source='direto'`, `utm_medium='(none)'` quando vazios.
- **Meta**: preenche `fbclid` (da URL), `fbc`/`fbp` (cookies). Se não houver `_fbc` mas houver `fbclid`, monta `fb.1.<timestamp>.<fbclid>`.
- **Validação** em tempo real (blur/change) de todos os campos + máscara de telefone BR.
- **No submit** (`init()` → `form.addEventListener('submit', ...)`):
  1. valida todos os campos; se inválido → `preventDefault` + foca o 1º inválido.
  2. honeypot: se `website` preenchido → aborta silenciosamente.
  3. **`e.preventDefault()`** — bloqueia o POST nativo (Netlify retorna **404** para POST em `.html` estático).
  4. preenche UTMs/Meta e limpa a máscara do telefone (só dígitos).
  5. mostra spinner no botão.
  6. dispara `GTMEvents.prepareLead(form)` **e** espera um `setTimeout(2000)` em paralelo (`Promise.all`) — **os 2 segundos são para o AJAX do RD Loader concluir** antes do redirect.
  7. anexa `?event_id=<uuid>` à URL de destino e redireciona (`goToThankYou`).
  8. **timeout de segurança de 4s** (`safetyTimer`) garante o redirect mesmo se algo travar.

> **Ponto crítico:** o `id` lido aqui é `document.getElementById('lp-gestao-quebrada-2')`. Se o `id` do form no HTML não bater, **o `form.js` não engancha e o lead não é processado.**

### 🔑 `obrigado.js` — dispara o "Lead" na thank-you

- Lê `event_id` da URL (`?event_id=`) ou do `sessionStorage['lead_event_id']`. Se não houver, **não faz nada** (evita disparo duplicado/falso).
- Lê os hashes de `sessionStorage['lead_user_hashes']`.
- Dá push do evento **`Lead`** no dataLayer com `event_id`, `content_name: 'lp-gestao-quebrada-2'`, `user_data` (email/phone hasheados) e `fbp`/`fbc`.
- Limpa as chaves de sessão (consome o evento uma única vez).

> O `content_name` aqui (`'lp-gestao-quebrada-2'`) também precisa bater com o identificador da LP.

### `consent.js` — Consent Mode v2 + banner LGPD

- Chave `localStorage['yourh_consent_v1']`.
- `granted`: aceitou → atualiza consent para `granted` em todas as categorias.
- `denied`: rejeitou → mantém negado.
- Sem registro: mostra o banner após 800ms; botões Aceitar/Rejeitar.

### `checklist.js` — diagnóstico interativo (conteúdo específico da LP)

- `GROUPS` (3 grupos: R&S=3, AVD=3, T&D=4 → total 10) e `RISK_LEVELS` (faixas 0–3 / 4–6 / 7–9 / 10).
- Sincronização obrigatória com o HTML: `data-group` dos fieldsets = `id` dos GROUPS; `total` = nº de checkboxes; soma dos totais = `aria-valuemax` da barra de progresso.
- **Não tem efeito na integração** — é engajamento na página.

### `main.js` — UI/UX

IntersectionObserver (animações de scroll), smooth scroll com offset de header, sombra no header ao rolar, accordion do FAQ, contadores animados da seção prova, e o **efeito de vidro quebrando** no hero (bloqueia o scroll até a animação terminar). Sem efeito na integração.

### `countdown.js` — contador regressivo (NÃO usado nesta LP)

- Contém um `TARGET_DATE` **placeholder inválido** (`'AAAA-MM-DDTHH:MM:SS-03:00'`) e procura por `#countdown-days`/`#countdown-hours`, que **não existem** nesta LP. O `init()` faz `return` cedo, então o script é inerte.
- **Não está incluído** em `index.html` nem em `obrigado.html`. É um template opcional para LPs com urgência/prazo. Em LPs sem countdown, não carregue este arquivo.

---

## 1.5 Arquivos CSS

Carregados sempre nesta ordem (em ambas as páginas):

| Arquivo | Papel |
|---|---|
| `reset.css` | Normalização/reset de estilos do navegador. |
| `variables.css` | Design tokens: `--color-purple`, `--color-green`, `--color-cream`, fontes (`--font-headline`), espaçamentos (`--space-*`), raios (`--radius-*`), sombras, tipos de texto (`--text-*`). |
| `animations.css` | Keyframes (`fadeInUp`, `errorPulse`, `gradientShift`, `flowDash`, `borderGlow`, `shake`, etc.) e classes `animate-on-scroll`, `is-visible`, `delay-*`, `from-left/right`. |
| `main.css` | Componentes globais: header, hero, botões (`.btn`, `.btn--primary`, `.btn--outline`, `.btn--lg`), seções, cards, formulário (`.form-input`, `.form-error`, `.form-submit-btn`, estados `is-valid`/`is-error`), footer, etc. |

> Nenhum CSS afeta a integração — mas a ordem deve ser preservada para o layout não quebrar.

## 1.6 Assets e config

- `assets/` — favicon, `logo.svg`, `logo-dark.svg`, `compartilhamento-img.webp` (OG 1200×630).
- `.claude/launch.json` — dev server local: `python3 -m http.server 3001`.
- `.claude/settings.local.json` — permissões locais do Claude Code (não afeta produção).
- Hospedagem: **Netlify** (por isso o POST nativo do form em `.html` retorna 404 — daí o redirect manual via JS).

---

# Parte 2 — Como a integração funciona (fluxo do lead)

```
Usuário preenche o form e clica em enviar
        │
        ▼
[form.js] valida campos ─── inválido ──► bloqueia, foca 1º erro
        │ válido
        ▼
[form.js] e.preventDefault()  ← bloqueia POST nativo (Netlify = 404)
        │
        ├─► preenche UTMs (localStorage) + fbc/fbp/fbclid + telefone só dígitos
        │
        ├─► [gtm-events.js] prepareLead():
        │       • gera event_id (UUID)
        │       • SHA-256 de email/phone → sessionStorage
        │       • push 'lead_pending' no dataLayer (→ GTM → Meta CAPI)
        │
        ├─► [RD Loader a81f367c...] escuta o MESMO submit e envia o lead
        │       via AJAX para o RD Station (usa name= dos campos + conversion_identifier)
        │
        ▼
[form.js] Promise.all([prepareLead, espera 2s]) ── garante o AJAX do RD concluir
        │
        ▼
redireciona para  obrigado.html?event_id=<uuid>
        │
        ▼
[obrigado.js] lê event_id + hashes → push 'Lead' no dataLayer (→ GTM → Meta CAPI)
        │                                   (mesmo event_id = deduplicação Pixel×CAPI)
        ▼
RD Station recebe o lead ──► integração RD ↔ Exact Sales ──► lead cai no Exact
```

**Dois caminhos independentes, e ambos precisam funcionar:**

1. **RD Station (o que o cliente vê como "lead caindo"):** depende do **RD Loader** (`a81f367c...-loader.js`) estar no body, dos **`name=` corretos** nos campos e do **`conversion_identifier`**. O RD encaminha para o **Exact Sales** pela integração já configurada na conta RD.
2. **Meta CAPI / GTM (mensuração de anúncios):** depende de `gtm-events.js` + `obrigado.js` + GTM (`GTM-TRVZBWCH`) + Consent Mode. Usa `event_id` para deduplicar Pixel × Conversions API.

> Se o lead **não cai no RD/Exact** mas a página redireciona normal, o problema quase sempre está no **caminho 1** (token do loader, `name=` dos campos, ou `conversion_identifier`), não no GTM.

---

# Parte 3 — Checklist de correção das outras LPs

Use esta seção para auditar cada LP problemática. O **erro nº 1** é o identificador da LP não estar idêntico nos **5 pontos** abaixo.

## 3.1 🔑 Os 5 pontos que precisam ter o MESMO identificador

Para esta LP o identificador é **`lp-gestao-quebrada-2`**. Em cada LP, escolha um slug único e garanta que ele apareça **idêntico** em:

| # | Arquivo | Onde | Valor nesta LP |
|---|---|---|---|
| 1 | `index.html` | `<form id="...">` | `lp-gestao-quebrada-2` |
| 2 | `index.html` | `<input name="conversion_identifier" value="...">` | `lp-gestao-quebrada-2` |
| 3 | `js/form.js` | `document.getElementById('...')` (função `init`) | `lp-gestao-quebrada-2` |
| 4 | `js/gtm-events.js` | `var FORM_ID = '...'` | `lp-gestao-quebrada-2` |
| 5 | `js/obrigado.js` | `content_name: '...'` (objeto `payload`) | `lp-gestao-quebrada-2` |

> Se **qualquer um** desses estiver diferente: ou o `form.js` não engancha no form (ponto 3 ≠ 1), ou o RD não reconhece a conversão (ponto 2), ou os eventos CAPI saem com nome trocado (4, 5). **Confira os 5 primeiro.**

## 3.2 🔑 Tokens do RD Station (head ≠ body)

- [ ] No **`<head>`** existe o **script de rastreamento** RD (`...-rdstation.js`), **antes** do GTM.
- [ ] No **fim do `<body>` do `index.html`** existe o **loader** RD (`...-loader.js`).
- [ ] No **fim do `<body>` do `obrigado.html`** existe o **mesmo loader** RD (`...-loader.js`).
- [ ] Os dois tokens são **os corretos da conta/LP** (o de rastreamento e o de loader são **arquivos diferentes** — não é o mesmo token copiado nos dois lugares).
- [ ] Nenhum dos `<script>` do RD foi alterado/minificado/quebrado.

> Confira no painel do RD Station: **Configurações → Código de rastreamento** (o `-rdstation.js`) e o **loader** do formulário. Se a LP foi duplicada de outra, é provável que os tokens tenham vindo da LP de origem e estejam **apontando para a conversão errada**.

## 3.3 🔑 Campos do formulário

- [ ] Os atributos **`name=`** são exatamente: `name`, `email`, `phone`, `company`, `site`, `form_fields_qtd_funcionarios`, `cargo`, `policy`. (O RD lê pelo `name`, não pelo `id`.)
- [ ] Existe o **honeypot** `<input name="website" style="display:none">`.
- [ ] Existem os **hidden** de UTM (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `utm_marketing_tactic`) e Meta (`fbclid`, `fbc`, `fbp`), cada um com o `id` correspondente.
- [ ] Existe `<input name="conversion_identifier" value="<slug-da-lp>">`.

## 3.4 🔑 `action` e redirect

- [ ] O `action` do form aponta para o **`obrigado.html` da própria LP** (caminho/pasta certos).
- [ ] O `destination` no `form.js` (fallback) bate com o `action`.
- [ ] A pasta da LP **existe** com esse caminho na hospedagem Netlify.

## 3.5 Ordem dos scripts

- [ ] No `index.html`: `gtm-events.js` **antes** de `form.js`.
- [ ] No `obrigado.html`: `gtm-events.js` + `obrigado.js` + `consent.js` (não precisa de `form.js`).
- [ ] `countdown.js` **só** é carregado se a LP tiver barra de urgência com `#countdown-days`/`#countdown-hours` e `TARGET_DATE` válido. Senão, **não inclua**.

## 3.6 GTM e Consent

- [ ] `GTM-TRVZBWCH` presente no `<head>` e no `<noscript>` do `<body>`, nas duas páginas.
- [ ] Bloco de **Consent Mode v2 default `denied`** presente **antes** do GTM, nas duas páginas.

## 3.7 Teste de fumaça (validação ponta a ponta)

1. Abra a LP com `?utm_source=teste&utm_campaign=qa` na URL.
2. Preencha e envie o form. Deve redirecionar para `obrigado.html?event_id=...`.
3. No **DevTools → Network**, confirme uma chamada AJAX para o domínio do RD (`*.rdstation.com.br` / cloudfront) no momento do submit.
4. No **RD Station → Conversões**, confirme o lead com o `conversion_identifier` certo e os UTMs.
5. No **Exact Sales**, confirme que o lead chegou pela integração.
6. No **dataLayer** (console: `dataLayer`), confirme os eventos `lead_pending` (na LP) e `Lead` (no obrigado) com o mesmo `event_id`.

---

# Parte 4 — Tabela de valores que mudam por LP

Ao criar/corrigir uma LP, estes são os únicos valores que mudam (o resto do código é igual):

| Valor | Onde aparece | Exemplo nesta LP |
|---|---|---|
| **Slug/identificador** | 5 pontos da seção 3.1 | `lp-gestao-quebrada-2` |
| **`action` / `destination`** | `index.html` form + `form.js` | `https://lp.yourh.com.br/gestao-quebrada-2/obrigado.html` |
| **Token RD rastreamento** | `<head>` do index | `2b4d5177951b2aaefe0b7f838559c2d9-rdstation.js` |
| **Token RD loader** | `<body>` do index + obrigado | `a81f367c-46ec-4dea-a2c2-4367f6781b13-loader.js` |
| **`PAGE_NAME` / `PAGE_CATEGORY`** | `gtm-events.js` | `Gestão Quebrada \| YouRH` / `Landing Page - RH` |
| **GTM ID** | head + noscript (2 páginas) | `GTM-TRVZBWCH` (provavelmente o mesmo em todas) |
| **Open Graph / título / textos** | `<head>` e corpo do index | conteúdo da campanha |
| **`GROUPS` / `RISK_LEVELS`** | `checklist.js` (+ HTML) | só se a LP tiver checklist |

---

# Parte 5 — Bug encontrado nesta LP (slug `-2`)

Mesmo funcionando, esta LP tem uma **inconsistência de nomenclatura** que deve ser corrigida nas próximas e não copiada:

- A **URL pública / Open Graph** usa o slug **`gestao-quebrada`**:
  `og:url = https://lp.yourh.com.br/gestao-quebrada`
- Mas o **formulário, o `conversion_identifier`, o `action` e o `FORM_ID`** usam **`gestao-quebrada-2`**:
  `action = https://lp.yourh.com.br/gestao-quebrada-2/obrigado.html`

Hoje funciona porque os **5 pontos da seção 3.1 estão todos com `-2`** (são consistentes entre si). O risco é:

1. **Confusão ao auditar** — alguém vê `gestao-quebrada` na URL e procura por esse slug no RD, mas a conversão está cadastrada como `lp-gestao-quebrada-2`.
2. **Redirect quebrado** se a pasta publicada for `gestao-quebrada` (sem `-2`) — o `action` apontaria para uma pasta inexistente e o `obrigado.html` daria 404 (o `safetyTimer` de 4s ainda redireciona, mas para uma URL morta).

**Recomendação para o padrão:** escolher **um único slug por LP** e usá-lo de forma idêntica em **URL pública, pasta, `action`, `conversion_identifier`, `id` do form, `FORM_ID` e `content_name`**. Não deixar a URL pública divergir do identificador interno.

---

_Documento gerado a partir da auditoria completa de `GESTAO-QUEBRADA-2` (index.html, obrigado.html, js/*.js, css/*.css, assets/, .claude/)._
