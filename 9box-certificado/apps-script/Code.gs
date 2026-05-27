// Google Apps Script – cola isso no editor em script.google.com
// Depois: Implantar > Nova implantação > Web App > Executar como: EU > Acesso: Qualquer pessoa

const SHEET_ID = 'COLE_AQUI_O_ID_DA_PLANILHA'; // ID da URL da planilha
const SHEET_NAME = 'Inscrições';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Nome Completo', 'Empresa', 'E-mail', 'Cargo']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#1a237e').setFontColor('#ffffff');
    }

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.nome || '',
      data.empresa || '',
      data.email || '',
      data.cargo || '',
    ]);

    return buildResponse({ status: 'success', message: 'Inscrito com sucesso!' });
  } catch (err) {
    return buildResponse({ status: 'error', message: err.toString() });
  }
}

function buildResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Teste manual: rode essa função no editor para verificar permissões
function testWrite() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Nome Completo', 'Empresa', 'E-mail', 'Cargo']);
  }
  sheet.appendRow([new Date().toISOString(), 'Teste', 'Empresa Teste', 'teste@email.com', 'Dev']);
  Logger.log('Linha inserida com sucesso!');
}
