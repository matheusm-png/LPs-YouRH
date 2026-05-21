/**
 * ============================================================
 * GOOGLE APPS SCRIPT — Respostas do Autodiagnóstico DIA DO RH
 * ============================================================
 *
 * Cada linha da planilha = um lead que COMPLETOU o autodiagnóstico,
 * com os dados de contato, as 25 respostas (pontuação 0-4 por
 * questão), o score por dimensão e a pontuação total.
 *
 * COMO DEPLOYAR:
 *
 * 1. Acesse https://sheets.google.com e crie uma nova planilha.
 *
 * 2. Na planilha: Extensões > Apps Script.
 *
 * 3. Cole TODO este código no editor (substitua o conteúdo padrão)
 *    e salve.
 *
 * 4. Implantar > Nova implantação.
 *    - Tipo: App da Web
 *    - Executar como: Eu (sua conta)
 *    - Quem tem acesso: Qualquer pessoa
 *
 * 5. Implantar > copie a URL do app da Web (termina em /exec).
 *
 * 6. No arquivo diagnostico.js, cole essa URL na constante
 *    SHEET_WEBHOOK_URL (logo no início do arquivo).
 *
 * Para verificar: rode a função `testar` no editor — uma linha de
 * teste deve aparecer na planilha.
 * ============================================================
 */

// Estrutura fixa do diagnóstico — garante o alinhamento das colunas.
var DIMENSOES = [
  'Digitalização & Tecnologia',
  'Processos & Documentação',
  'Gestão de Pessoas & Clima Organizacional',
  'Recrutamento, Seleção & Onboarding',
  'Estratégia & People Analytics'
];

var QUESTOES = [
  '1.1', '1.2', '1.3', '1.4', '1.5',
  '2.1', '2.2', '2.3', '2.4', '2.5',
  '3.1', '3.2', '3.3', '3.4', '3.5',
  '4.1', '4.2', '4.3', '4.4', '4.5',
  '5.1', '5.2', '5.3', '5.4', '5.5'
];

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    // Cria o cabeçalho na primeira execução
    if (sheet.getLastRow() === 0) {
      var header = [
        'Data/Hora', 'Nome', 'E-mail', 'Telefone', 'Empresa', 'Site',
        'Cargo', 'Nº Colaboradores', 'Pessoas no RH', 'Maior Desafio',
        'Pontuação Total', 'Nível'
      ];
      DIMENSOES.forEach(function (titulo) { header.push(titulo); });
      QUESTOES.forEach(function (qid) { header.push('Q' + qid); });
      header.push('UTM Source', 'UTM Medium', 'UTM Campaign');
      sheet.appendRow(header);
      sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    // Mapas de lookup — alinham os dados recebidos às colunas fixas
    var dimMap = {};
    (data.dimensoes || []).forEach(function (d) { dimMap[d.titulo] = d.score; });

    var respMap = {};
    (data.respostas || []).forEach(function (r) { respMap[r.id] = r.score; });

    var row = [
      new Date(),
      data.nome          || '',
      data.email         || '',
      data.telefone      || '',
      data.empresa       || '',
      data.site          || '',
      data.cargo         || '',
      data.colaboradores || '',
      data.pessoas_rh    || '',
      data.desafio       || '',
      data.pontuacao_total != null ? data.pontuacao_total : '',
      data.nivel         || ''
    ];
    DIMENSOES.forEach(function (titulo) {
      row.push(dimMap[titulo] != null ? dimMap[titulo] : '');
    });
    QUESTOES.forEach(function (qid) {
      row.push(respMap[qid] != null ? respMap[qid] : '');
    });
    row.push(data.utm_source || '', data.utm_medium || '', data.utm_campaign || '');

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste — rode manualmente no editor para verificar a conexão.
function testar() {
  var mock = {
    postData: {
      contents: JSON.stringify({
        nome: 'Teste Silva', email: 'teste@empresa.com.br',
        telefone: '(11) 99999-9999', empresa: 'Empresa Teste',
        site: 'empresateste.com.br', cargo: 'Gerente / Head',
        colaboradores: '101 - 200', pessoas_rh: '4 a 5',
        desafio: 'Retenção de talentos',
        pontuacao_total: 64, nivel: 'Nível 4 — Avançado',
        dimensoes: [
          { titulo: 'Digitalização & Tecnologia', score: 14 },
          { titulo: 'Processos & Documentação', score: 12 },
          { titulo: 'Gestão de Pessoas & Clima Organizacional', score: 13 },
          { titulo: 'Recrutamento, Seleção & Onboarding', score: 12 },
          { titulo: 'Estratégia & People Analytics', score: 13 }
        ],
        respostas: [
          { id: '1.1', score: 4 }, { id: '1.2', score: 2 }, { id: '1.3', score: 3 }
        ],
        utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'dia-do-rh'
      })
    }
  };
  Logger.log(doPost(mock).getContent());
}
