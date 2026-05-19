# Guia para Criação de Novas LPs — YouRH

Este documento é a referência completa para qualquer IA (ou pessoa) que for usar este esqueleto para criar uma nova landing page da YouRH. Leia antes de começar a preencher os arquivos.

---

## 1. Estrutura do projeto

```
[nome-da-lp]/
├── index.html          ← página principal da LP (preencher placeholders)
├── obrigado.html       ← página de confirmação pós-formulário (preencher placeholders)
├── assets/
│   ├── favicon_yourh.svg         ← NÃO ALTERAR
│   ├── logo.svg                  ← NÃO ALTERAR (usado no footer, fundo escuro)
│   ├── logo-dark.svg             ← NÃO ALTERAR (usado no header, fundo claro)
│   └── compartilhamento-img.webp ← SUBSTITUIR pela imagem desta LP (1200×630px)
├── css/
│   ├── reset.css       ← NÃO ALTERAR
│   ├── variables.css   ← NÃO ALTERAR (design tokens)
│   ├── animations.css  ← NÃO ALTERAR
│   └── main.css        ← NÃO ALTERAR (estilo completo)
└── js/
    ├── main.js         ← NÃO ALTERAR (scroll, FAQ, animações, contadores)
    ├── countdown.js    ← ⚠️ ALTERAR: data-alvo do contador (se LP tiver urgência)
    ├── checklist.js    ← ⚠️ ALTERAR: grupos e textos do diagnóstico
    └── form.js         ← ⚠️ ALTERAR: conversion_identifier e OBRIGADO_URL
```

---

## 2. Integrações — o que é fixo e o que muda

### Fixo (NÃO ALTERAR em nenhuma LP)

| Integração | ID / Valor | Onde está |
|---|---|---|
| Google Tag Manager | `GTM-NC7RBWD` | `<head>` do index.html e obrigado.html |
| Microsoft Clarity | `w9l8cescd6` | `<head>` do index.html e obrigado.html |
| Meta Pixel | `1271719717083226` | `<head>` do index.html e obrigado.html |
| RD Station API Key | `2b4d5177951b2aaefe0b7f838559c2d9` | `js/form.js` linha `RD_API_URL` |

Esses IDs são da conta YouRH e valem para todas as LPs. Nunca remova nem altere.

### Muda a cada LP (⚠️ OBRIGATÓRIO)

| O que muda | Onde alterar | Exemplo |
|---|---|---|
| **conversion_identifier** do RD Station | `js/form.js` — variável dentro de `sendToRdStation` | `lp-evento-rh-yourh` |
| **OBRIGADO_URL** | `js/form.js` — variável no topo | `https://lp.yourh.com.br/evento-rh/obrigado.html` |
| **Data do countdown** | `js/countdown.js` — constante `TARGET_DATE` | `2026-09-15T00:00:00-03:00` |

**Regra do conversion_identifier:** use sempre o padrão `lp-[slug]-yourh`.
O slug deve ser o mesmo usado na URL da LP. Isso é o que o time de marketing usa no RD Station para identificar de qual LP veio cada lead.

---

## 3. Como preencher os placeholders

Todo texto que deve ser substituído está marcado com `[PREENCHER: descrição]`.
Basta buscar por `[PREENCHER` nos arquivos e substituir cada ocorrência.

### Imagem de compartilhamento (`assets/compartilhamento-img.webp`)

Esta imagem é exibida quando o link da LP é compartilhado no WhatsApp, LinkedIn, Instagram e outros. **Cada LP precisa da sua própria imagem** — usar a imagem de outra LP confunde quem recebe o link.

**Especificações obrigatórias:**
- Dimensões: **1200 × 630 px**
- Formato: `.webp` (preferencial) ou `.jpg`
- Nome do arquivo: mantenha `compartilhamento-img.webp` (o HTML já aponta para esse nome)
- Conteúdo sugerido: logo YouRH + título principal da LP + visual relacionado ao tema

Se o arquivo tiver nome diferente, atualize as tags `og:image` e `twitter:image` no `<head>` do index.html e do obrigado.html.

---

### Placeholders obrigatórios no index.html

| Seção | O que preencher |
|---|---|
| `<head>` | `<title>`, meta description, og:title, og:description, og:url, og:image |
| Urgência bar | Texto de urgência com a data/prazo |
| Header / Nav | Textos e hrefs dos links de navegação |
| Hero | Badge, H1, subtítulo, CTA principal, CTA secundário, 3 itens de confiança |
| Problemas | Título da seção, subtítulo, 5 cards (tag + título + descrição cada) |
| Checklist | Título, subtítulo, nomes dos grupos, itens e data-lacuna de cada checkbox |
| Custo/Impacto | Título, subtítulo, 4 métricas (valor + label + descrição) |
| Solução | Título, subtítulo, 3 cards (produto + título + descrição + 3 features cada) |
| Prova social | Título, 4 métricas com data-count, banner com dado externo |
| Conteúdo | Título, 2 artigos (URL, imagem, título, descrição) + 1 webinar/material |
| Formulário aside | Rótulo, título, subtítulo, 4 benefícios, texto do botão de submit |
| FAQ | 5 perguntas com resposta cada |

### Placeholders no obrigado.html

| O que preencher |
|---|
| Links do nav (mesmos do index.html) |
| Badge de confirmação |
| Título principal |
| Descrição de expectativa |
| 3 próximos passos |
| Texto do botão de retorno |

---

## 4. Seções opcionais

Algumas seções podem ser removidas se não fizerem sentido para a LP:

| Seção | Quando remover |
|---|---|
| **Barra de urgência + countdown** | LP sem prazo ou data de encerramento |
| **Checklist interativo** | LP sem diagnóstico/quiz (também remova o `<script src="js/checklist.js">`) |
| **Seção de custo/impacto** | LP mais focada em proposta de valor do que em risco |
| **Seção de conteúdo** (blog/webinar) | LP sem material de apoio publicado |

Para remover uma seção, delete o bloco inteiro entre os comentários `<!-- ====... ====== -->` correspondentes no index.html.

---

## 5. Sistema de design — cores e tipografia

Não é necessário alterar o CSS. Mas é útil saber os tokens disponíveis caso precise de ajustes pontuais via `style=""` inline.

### Cores principais
```css
--color-purple:       #3D008C   /* cor primária — botões, destaques */
--color-purple-dark:  #2A0062
--color-purple-light: #EDE7FF
--color-green:        #00C853   /* CTA, ícones de check */
--color-green-dark:   #00A844
--color-green-light:  #E6FFF0
--color-cream:        #F5F0E8   /* fundo geral da página */
--color-white:        #FFFFFF
--color-text:         #1A1A1A
--color-text-muted:   #5C5C6B
--color-border:       #E0D9CE
```

### Tipografia
- **Headline (H1, H2, H3):** `Bricolage Grotesque` — pesos 400 a 800
- **Corpo:** `Inter` — pesos 400 a 800

### Botões disponíveis
```html
<a href="#form" class="btn btn--primary">CTA principal (roxo)</a>
<a href="#form" class="btn btn--outline">CTA secundário (borda roxa)</a>
<a href="#form" class="btn btn--primary btn--lg">CTA grande</a>
<a href="#form" class="btn btn--primary btn--full">CTA largura total</a>
```

---

## 6. Checklist de publicação

Antes de publicar a LP, confirme:

- [ ] Todos os `[PREENCHER: ...]` foram substituídos no index.html
- [ ] Todos os `[PREENCHER: ...]` foram substituídos no obrigado.html
- [ ] `conversion_identifier` atualizado em `js/form.js`
- [ ] `OBRIGADO_URL` atualizado em `js/form.js` com a URL real de produção
- [ ] `TARGET_DATE` atualizado em `js/countdown.js` (ou seção removida se não houver prazo)
- [ ] GROUPS e textos do `js/checklist.js` atualizados (ou seção removida)
- [ ] Imagem `assets/compartilhamento-img.webp` substituída por uma específica desta LP (1200×630px, logo YouRH + título da LP + visual do tema)
- [ ] og:url aponta para a URL real da LP publicada
- [ ] Testado o envio do formulário e confirmado que o lead chegou no RD Station com o conversion_identifier correto
- [ ] Confirmado que a página `obrigado.html` abre corretamente após o envio

---

## 7. Comportamento do formulário

O formulário (`js/form.js`) faz o seguinte ao ser enviado:

1. Valida todos os campos em tempo real (nome completo, e-mail, telefone BR, empresa, funcionários, cargo, LGPD)
2. Captura UTM params da URL (`utm_source` ou `utm_medium`) para atribuição de origem
3. Envia um POST para a API do RD Station com todos os dados
4. Se sucesso: dispara evento no GTM (`lead_form_submit`) e redireciona para `OBRIGADO_URL`
5. Se erro: exibe mensagem de erro abaixo do botão sem esconder o formulário

O evento Lead do **Meta Pixel** é disparado na página `obrigado.html` (não no index.html) para evitar duplo disparo.

---

## 8. Referência rápida — LP NR-1 (original)

A LP de referência que gerou este esqueleto é a LP NR-1 YouRH. Ela pode ser consultada em:
`/nr1-yourh/` (pasta raiz do projeto, versão original — NÃO usar como base, usar este esqueleto)

Configurações da LP NR-1 para referência:
- conversion_identifier: `lp-nr1-yourh`
- OBRIGADO_URL: `https://lp.yourh.com.br/nr1/obrigado.html`
- TARGET_DATE: `2026-05-26T00:00:00-03:00`
