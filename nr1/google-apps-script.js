/**
 * ============================================================
 * GOOGLE APPS SCRIPT — Inscrições Webinar NR-1
 * ============================================================
 *
 * COMO DEPLOYAR:
 *
 * 1. Acesse https://sheets.google.com e crie uma nova planilha.
 *    Nomeie a aba como "Inscrições" (ou qualquer nome que queira).
 *
 * 2. Na planilha, vá em Extensões > Apps Script.
 *
 * 3. Cole TODO este código no editor (substitua o conteúdo padrão).
 *
 * 4. Clique em Implantar > Nova implantação.
 *    - Tipo: App da Web
 *    - Executar como: Sua conta (eu)
 *    - Quem tem acesso: Qualquer pessoa (anônimo)
 *
 * 5. Clique em Implantar > Copie a URL gerada.
 *
 * 6. No arquivo js/webinar.js, substitua o valor de APPS_SCRIPT_URL
 *    pela URL copiada no passo 5.
 *
 * ============================================================
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cria cabeçalho na primeira vez que rodar
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data/Hora', 'Nome', 'E-mail', 'Telefone', 'Empresa', 'Cargo']);
      sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.nome     || '',
      data.email    || '',
      data.telefone || '',
      data.empresa  || '',
      data.cargo    || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste — rode manualmente no editor para verificar se está funcionando
function testar() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        nome:     'Teste Silva',
        email:    'teste@empresa.com.br',
        telefone: '(11) 99999-9999',
        empresa:  'Empresa Teste',
        cargo:    'CEO',
      }),
    },
  };
  var result = doPost(mockEvent);
  Logger.log(result.getContent());
}
