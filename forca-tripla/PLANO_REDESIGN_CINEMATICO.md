# PLANO: LP FORÇA TRIPLA — REDESIGN CINEMATOGRÁFICO
## Scroll Storytelling + HQ Cinematográfica

---

## CONTEXTO GERAL

O problema da LP atual: textos e imagens jogados sobre um template genérico. Não comunica o universo da campanha.

O objetivo: uma LP que **parece uma HQ de super-heróis que ganha vida no scroll** — cada seção é uma cena, a narrativa do PDF é a espinha dorsal da experiência.

---

## IDENTIDADE VISUAL (do PDF)

### Paleta de Cores
| Token | Cor | Uso |
|---|---|---|
| `--clr-bg` | `#05050A` | Fundo principal (quase preto, tom roxo) |
| `--clr-bg-mid` | `#0D0D1A` | Fundo seções alternadas |
| `--clr-text` | `#F5F2EC` | Texto principal (off-white quente) |
| `--clr-muted` | `rgba(245,242,236,0.55)` | Texto secundário |
| `--clr-green` | `#61DD75` | YouRH brand verde |
| `--clr-purple` | `#6212B3` | YouRH brand roxo |
| `--clr-avd` | `#1BAF96` | Turquesa — herói AVD |
| `--clr-9box` | `#891A55` | Vinho — herói 9BOX |
| `--clr-uc` | `#EAA541` | Dourado — herói UC |
| `--clr-villain` | `#A83800` | Laranja-queimado — Dr. Névoa |
| `--clr-cream` | `#F0E8D5` | Creme-bege — detalhe secundário dos heróis |
| `--clr-caption` | `#F9E05A` | Amarelo — caixas de narração HQ |

### Tipografia
- **Bangers** (Google Fonts) — SFX, impacto ("DIAGNÓSTICO!", "CLIQUE!", "DR. NÉVOA"), títulos de cenas
- **Bricolage Grotesque** (já presente) — títulos narrativos, nome dos heróis
- **Inter** (já presente) — body text, legendas

### Elementos HQ Obrigatórios
- Caixas de narração amarelas (caption boxes estilo quadrinhos americanos)
- SFX tipográfico em Bangers (onomatopeias explodindo na tela)
- Bordas de painel sutis
- Linhas de velocidade no confronto
- Névoa vermelha animada no Dr. Névoa
- Glow de energia nos heróis (box-shadow colorido)
- Efeito before/after diagonal

---

## ARQUITETURA DE CENAS (Scroll Storytelling)

### CENA 0 — ABERTURA (full screen, título cinematográfico)
**Propósito:** Hook imediato, estabelecer o universo
**Visual:** Tela preta com grid sutil verde. "FORÇA TRIPLA" em Bangers GIGANTE. Glow roxo atrás do título.
**Copy:**
```
[Badge] YOURRH · CAMPANHA OFICIAL
[Título enorme] FORÇA
          TRIPLA
[Subtítulo] A história que acontece em toda empresa do Brasil.
[Scroll hint] ↓ Arrasta para descobrir
```
**Efeito:** Título aparece com impacto (scale 0 → 1 com spring). Indicador de scroll com bounce animation.

---

### CENA 1 — O MUNDO EM CRISE (estabelecendo o contexto)
**Propósito:** Criar identificação imediata — "sua empresa é assim"
**Visual:** Grid/skyline escuro de BC à noite. Névoa roxa começando a rastejar. Stats em vermelho aparecem.
**Copy:**
```
[Caption amarela] BALNEÁRIO CAMBORIÚ · SC
[Título grande] Uma indústria de alta performance.
               Por fora, tudo brilha.
[Pausa visual]
Por dentro, alguém já está trabalhando para destruir.
```
**Métricas (aparecem uma por uma no scroll):**
- TURNOVER ↑ (vermelho)
- CURSOS: 12% FINALIZADOS (vermelho)
- GESTÃO: 100% ACHISMO (vermelho)

---

### CENA 2 — MARINA (apresentação da protagonista)
**Propósito:** Criar o personagem de identificação — "isso sou eu"
**Visual:** Split — esquerda foto Marina (filtro desaturado, frio), direita mesa em caos com métricas ruins
**Copy:**
```
[Caption amarela] APRESENTANDO: A PROTAGONISTA
[SFX Bangers] MARINA
[Texto] 34 anos. Gerente de RH.
        Steelport Indústrias, Balneário Camboriú.
        3 anos tentando fazer funcionar.

[Quote em balão HQ oval] "Outro mês. Mesmos problemas. Mesmos resultados."

[Narração] Você conhece a Marina.
           Talvez você seja a Marina.
```
**Cor dominante:** `#2E7D9A` (teal de Marina)

---

### CENA 3 — DR. NÉVOA (reveal do vilão)
**Propósito:** Nomear o inimigo invisível. Tensão máxima.
**Visual:** Névoa vermelha invadindo de baixo. Vilão emergindo. Câmera low-angle. Fundo explode em laranja escuro.
**Copy:**
```
[SFX Bangers gigante] DR. NÉVOA
[Caption vermelha] O INIMIGO QUE VOCÊ NÃO VÊ

[Narração] "Ele não chegou hoje.
            Ele sempre esteve aqui. Esperando."

[Quote vilão em balão pontudo] "Sem dados. Sem sistema. Sem visão. Perfeito."

[Narração] Ele não é uma pessoa. É uma força.
           Age onde há achismo.
           Vive onde há RH sem dados.
           Se alimenta de decisões no feeling.
           Ele já está na sua empresa.
```
**Animação:** Névoa animada com CSS (fog-drift keyframe). Glitch sutil no nome do vilão.

---

### CENA 4 — AS 3 ARMAS DO CAOS (o plano do vilão)
**Propósito:** Diagnosticar os 3 problemas centrais que o produto resolve
**Visual:** 3 painéis escuros com borda vermelha. Ícones quebrados. Dr. Névoa sentado satisfeito ao fundo.
**Painéis:**
```
[ARMA 1]
SFX: NEBLINA!
ícone: 🔍 quebrada
AVD FRÁGIL
Avaliação sem critério técnico → achismo puro.
Quem performa e quem não performa: ninguém sabe.

[ARMA 2]
SFX: CAOS!
ícone: grid embaralhado
9BOX INEXISTENTE
Sem mapeamento de potencial vs performance.
Talentos invisíveis. Mediocridades promovidas.

[ARMA 3]
SFX: DESPERDÍCIO!
ícone: 📚 com X
TREINAMENTO SEM DIREÇÃO
Cursos comprados, nunca concluídos.
Dinheiro no lixo. Equipe estagnada.
```

---

### CENA 5 — O TURNING POINT (Marina decide)
**Propósito:** Clímax emocional — a decisão. Virada narrativa.
**Visual:** Marina de costas olhando pela janela. Luz quente entrando (amanhecer de BC). Celular na mão.
**Copy:**
```
[Narração italic] "Pedir ajuda é admitir que o sistema falhou.
                   Mas não pedir é deixar as pessoas sofrerem."

[SFX Bangers ENORME] CHEGA.

[SFX estouro] CLIQUE!

[Status em tela de HQ] MISSÃO ATIVADA · BC INDÚSTRIAS · NÍVEL CRÍTICO
```
**Efeito:** "CHEGA." aparece de scale(0) com spring animation. "CLIQUE!" aparece depois com glow verde. Linha verde aparece abaixo do CHEGA.

---

### CENA 6 — A TORRE YOURH (base dos heróis ativada)
**Propósito:** Transição narrativa — os heróis sendo convocados
**Visual:** Torre Benvenuti estilizada. Y verde-roxo pulsando no topo. Tela de comando acendendo.
**Copy:**
```
[Caption amarela] TORRE YOURH · BALNEÁRIO CAMBORIÚ

[Alert piscando vermelho] ⚠ ALERTA DE MISSÃO

[Tela de comando] MISSÃO ATIVADA
                  BC INDÚSTRIAS
                  NÍVEL CRÍTICO

[SFX Bangers] OS HERÓIS SE LEVANTAM.
```
**Animação:** Blink animation no alerta. Box-shadow pulsando em verde no painel de missão.

---

### CENA 7 — A CHEGADA (Triple Threat reveal)
**Propósito:** Introdução épica dos 3 heróis juntos
**Visual:** Foto do grupo contra o sol de BC. Silhuetas com energia irradiando em cada cor. Títulos com Bangers ao redor de cada herói.
**Copy:**
```
[Narração] "Quando a dor é real demais para ignorar,
            os heróis aparecem."

[SFX] AVD · 9BOX · UC

[Subtítulo] Identifica → Classifica → Desenvolve → Acelera
```
**Imagem:** `assets/FOTOS_HEROIS/183228.jpeg` (grupo dos 3 heróis)

---

### CENA 8 — AVD (herói individual)
**Propósito:** Apresentar AVD com profundidade e desejo
**Visual:** Foto AVD (imagem 183229). Fundo: glow turquesa radial à direita. Layout: imagem esquerda, texto direita.
**Copy:**
```
[Caption amarela] HERÓI #01

[SFX Bangers enorme, turquesa] AVD
[Subtítulo display] A Detetive da Performance
[Power tag] Diagnostica performance e competências.
            Enxerga o que ninguém quer ver.

[Quote com borda turquesa]
"Achismo não salva empresa. Dados, sim.
 Eu enxergo o que você tem medo de olhar."

[SFX small] DIAGNÓSTICO!
```
**CSS:** `--hero-color: #1BAF96` `--hero-glow: rgba(27,175,150,0.3)`

---

### CENA 9 — 9BOX (herói individual)
**Propósito:** Apresentar 9BOX
**Visual:** Foto 9BOX (imagem 183230). Glow vinho à esquerda. Layout: texto esquerda, imagem direita (invertido).
**Copy:**
```
[Caption amarela] HERÓI #02

[SFX Bangers enorme, vinho] 9BOX
[Subtítulo] O Arquiteto do Potencial
[Power tag] Classifica talentos e potencial.
            Coloca as peças certas nos lugares certos.

[Quote com borda vinho]
"Eu não julgo pessoas. Eu leio posições.
 E o problema de vocês é que colocaram
 as peças erradas nos lugares errados."

[SFX small] POSICIONADO!
```
**CSS:** `--hero-color: #891A55` `--hero-glow: rgba(137,26,85,0.3)`

---

### CENA 10 — UC (heroína individual)
**Propósito:** Apresentar UC
**Visual:** Foto UC (imagem 183231). Glow dourado. Layout: imagem esquerda, texto direita.
**Copy:**
```
[Caption amarela] HERÓI #03

[SFX Bangers enorme, dourado] UC
[Subtítulo] A Catalisadora do Crescimento
[Power tag] Desenvolve as competências certas para cada grupo.
            Ninguém fica para trás.

[Quote com borda dourada]
"Eu já vi gente ser descartada por falta de trilha certa.
 Isso não acontece mais enquanto eu estiver aqui."

[SFX small] EVOLUINDO!
```
**CSS:** `--hero-color: #EAA541` `--hero-glow: rgba(234,165,65,0.25)`

---

### CENA 11 — OS RESULTADOS (transformação)
**Propósito:** Provas concretas. Virada emocional total.
**Visual:** Split diagonal ANTES (cinza/vermelho) vs DEPOIS (verde/quente). Métricas explodindo com counter animation.
**Copy:**
```
[SFX row] DIAGNÓSTICO! · POSICIONADO! · EVOLUINDO!

[Split antes/depois]
ANTES:                          DEPOIS:
✗ Turnover subindo              ✓ Turnover -47% ↓
✗ Cursos em 12%                 ✓ Cursos 89% ↑
✗ Talentos invisíveis           ✓ Engajamento +62% ↑
✗ Decisões no feeling           ✓ Decisões por dados

[Métricas animadas — counter up]
-47%    89%    +62%
turnover  cursos  engajamento

[Narração] "Contra dados reais, o achismo não tem vez."

[Dr. Névoa recuando — painel menor, canto]
[Quote vilão] "Isso não acabou. Eu volto."

[Narração] "O caos foi derrotado. Por enquanto."
```

---

### CENA 12 — O CTA / FORMULÁRIO (chamada para ação)
**Propósito:** Conversão. O clímax da narrativa se transforma na ação do usuário.
**Visual:** Fundo escuro calmo (depois da batalha). Linha verde descendo do topo. Form centralizado.
**Copy:**
```
[Subtítulo italic] "O Dr. Névoa vai voltar."
[Título grande] Mas agora você
               sabe quem chamar.

[Tagline] YouRH. Força Tripla.
          O ecossistema que identifica, classifica,
          desenvolve e acelera talentos.

[Frase-chave] "O maior risco não é o mercado.
               É não enxergar o talento
               que já existe na sua empresa."

[FORM — estilizado escuro]
→ mesmo form atual, campo por campo mantido
→ botão verde: "QUERO PROTEGER MEU RH →"
```

---

### CENA 13 — FAQ (minimal, escuro)
**Propósito:** Objeções finais
**Visual:** Dark, clean. Acordeão simples com borda sutil. 4 perguntas.
**Copy:** manter as 4 FAQs existentes

---

### FOOTER
Manter o footer existente (idêntico ao atual, apenas aplicar paleta escura)

---

## ARQUIVOS A CRIAR

### 1. `css/cinematic.css` (novo — não usar main.css)
Responsabilidades:
- CSS custom properties (tokens de cor, fonte, espaçamento)
- Reset e base
- Progress bar no topo (scroll indicator)
- Header minimal (fixo, com scroll state)
- Todas as cenas (opening → faq)
- Animações e keyframes
- Scroll reveals (classes .reveal, .reveal--up, .reveal--left etc.)
- Elementos HQ (caption boxes, SFX, villain fog)
- Form estilizado (dark theme)
- Responsive (mobile first nos breakpoints críticos)

### 2. `index.html` (reescrita completa)
- Manter TODOS os scripts de tracking (GTM, Clarity, Meta Pixel, RD Station)
- Adicionar Bangers ao Google Fonts import
- Referenciar `css/cinematic.css` em vez de `css/main.css`
- Estrutura de cenas conforme este plano
- Manter IDs do form INTACTOS para compatibilidade com form.js:
  - `#lp_herois-rh_conv` (form)
  - `#field-nome`, `#field-email`, `#field-telefone`, `#field-empresa`
  - `#field-funcionarios`, `#field-cargo`, `#field-desafio`
  - `#field-lgpd` (checkbox LGPD)
  - `.form-error`, `.form-send-error`, `.form-submit-btn`
- Referenciar `js/cinematic-main.js` em vez de `js/main.js`
- Manter `js/form.js` (funciona com os IDs acima)

### 3. `js/cinematic-main.js` (novo)
Responsabilidades:
- **Scroll progress bar:** atualiza largura via JS scroll event
- **Header scroll state:** adiciona `.scrolled` no header após 60px
- **Scroll reveals:** IntersectionObserver com threshold 0.15 → adiciona `.visible` nas classes `.reveal`
- **Counter animation:** detecta `.metric-card__value[data-count]`, anima de 0 até o número quando entra na viewport
- **FAQ accordion:** mesma lógica do main.js atual (aria-expanded, max-height)
- **Stagger delays:** aplica transition-delay automático em filhos de `.stagger-children`

---

## MAPEAMENTO DE IMAGENS

| Cena | Arquivo | Uso |
|---|---|---|
| Abertura (background sutil) | — | Apenas CSS (grid pattern) |
| Marina | `assets/FOTOS_HEROIS/183228.jpeg` ou freepik Marina | Cena 2 |
| AVD | `assets/FOTOS_HEROIS/183229.jpeg` | Cena 8 |
| 9BOX | `assets/FOTOS_HEROIS/183230.png` | Cena 9 |
| UC | `assets/FOTOS_HEROIS/183231.png` | Cena 10 |
| Dr. Névoa | `assets/FOTOS_HEROIS/183232.png` | Cenas 3, 4, 11 |
| Grupo Triple Threat | `assets/FOTOS_HEROIS/183228.jpeg` | Cena 7 |

> **Nota:** Se 183232 não for o Dr. Névoa, a cena do vilão pode funcionar só com CSS (névoa animada + texto dramático, sem foto). O efeito de névoa puramente em CSS pode ser até mais impactante.

---

## TÉCNICAS CSS / JS

### Efeito Névoa do Dr. Névoa
```css
.scene-villain::before {
  content: '';
  position: absolute;
  bottom: -20%; left: -10%; right: -10%; height: 70%;
  background: radial-gradient(ellipse at 50% 100%, rgba(168,56,0,0.35) 0%, transparent 60%);
  filter: blur(40px);
  animation: fog-drift 8s ease-in-out infinite;
}

@keyframes fog-drift {
  0%   { transform: translateX(0) translateY(0) rotate(0deg); }
  33%  { transform: translateX(20px) translateY(-10px) rotate(2deg); }
  66%  { transform: translateX(-15px) translateY(5px) rotate(-1deg); }
  100% { transform: translateX(0) translateY(0) rotate(0deg); }
}
```

### Scroll Reveal
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

### Classes de Reveal (aplicar no HTML)
```
.reveal              → base (opacity: 0)
.reveal--up          → + translateY(50px)
.reveal--left        → + translateX(-60px)
.reveal--right       → + translateX(60px)
.reveal--scale       → + scale(0.85)
.reveal--sfx         → + scale(0.4) rotate(-8deg) [para os SFX Bangers]
.delay-1 a .delay-6  → transition-delay 0.1s a 0.6s
```

### Counter Animation
```javascript
// Para métricas — usar data-count no elemento
// Ex: <span data-count="47">0</span>
// Quando entra na viewport, anima de 0 até 47
```

### Hero CSS Custom Properties (por cena)
```css
.scene-hero--avd { --hero-color: #1BAF96; --hero-glow: rgba(27,175,150,0.3); }
.scene-hero--9box { --hero-color: #891A55; --hero-glow: rgba(137,26,85,0.3); }
.scene-hero--uc   { --hero-color: #EAA541; --hero-glow: rgba(234,165,65,0.25); }
```

---

## NOTAS IMPORTANTES PARA A IMPLEMENTAÇÃO

1. **NÃO usar `main.css`** — o novo `cinematic.css` é totalmente standalone
2. **Manter `form.js`** — só o JS de validação/envio, não o de animações
3. **NÃO usar scroll-snap** — prejudica a experiência em mobile e pode parecer forçado
4. **Parallax sutil** — só na abertura e nas fotos dos heróis, via JS scroll event. Não exagerar.
5. **Performance:** Todas imagens `loading="lazy"` exceto a primeira (opening)
6. **Acessibilidade:** Manter aria-labels no form, role="alert" nos erros, aria-expanded no FAQ
7. **Mobile:** Grid 2 colunas → 1 coluna. Tipografia Bangers escala via clamp(). Imagens acima do texto em mobile.
8. **O formulário não fica na seção de "Kit Gratuito"** — a narrativa leva até o form. A chamada é "proteja seu RH" não "baixe um kit".

---

## COPY FINAL — TAGLINE E FRASE-CHAVE

> **Tagline principal:** "YouRH. Identifica. Classifica. Desenvolve. Acelera."

> **Frase-chave:** "O maior risco não é o mercado. É não enxergar o talento que já existe na sua empresa."

> **CTA do botão:** "QUERO PROTEGER MEU RH →" ou "FALE COM UM ESPECIALISTA YOURH"

---

*Documento gerado por Claude Code — Força Tripla LP Redesign Planning*
*Projeto: /Users/matheusmoitinh0/Documents/PROJETOS 2026/LPS/LP_FORCA_TRIPLA*
