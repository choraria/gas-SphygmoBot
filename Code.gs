var sheetID = 'Your-Sheet-ID-Goes-Here';
var telegramToken = 'Your-Telegram-Bot-Token-Goes-Here';

/* ========== DO NOT EDIT ANYTHING BELOW THIS LINE ========== */

/*

List of Commands:
=================
- start - Display Welcome Message
- register - Subscribe for Heartbeat
- stop - Unsubscribe from Heartbeat
- test - Dummy Ping
- help - List all Commands

- editbackup - Update Backup Email
- viewbackup - View Backup Email

*/

var ss = SpreadsheetApp.openById(sheetID);
var userReg = 'Registration';
var pingLogs = 'Heartbeats';
var allLogs = 'IncomingLogs';

function doPost(e) {
  if(e.postData.type == "application/json") {
    var data = JSON.parse(e.postData.contents);
    logDump(data);
    var text = data.message.text;
    if (text == '/start') {
      start(data);
    } else if (text == '/register' || text == '/register ') {
      register(data);
    } else if (text == '/stop' || text == '/stop ') {
      stop(data);
    } else if (text == 'Alive' || text == 'Alive ' || text == 'Alive [Testing]' || text == 'Alive [Testing] ') {
      alive(data);
    } else if (text == '/test' || text == '/test ') {
      test(data);
    } else if (text == '/help' || text == '/help ') {
      help(data);
    } else if (text == '/editbackup' || text == '/editbackup ') {
      editBackup(data);
    } else if (text == '/viewbackup' || text == '/viewbackup ') {
      viewBackup(data);
    } else if (isEmailValid(text)) {
      addContact(data);
    } else {
      invalid(data);
    }
  }
}

function doGet(e) {
  if (e.queryString !== '') {
    var params = JSON.stringify(e.parameters);
    var jsonMapping = JSON.parse(params);
    var chatID = jsonMapping['chatID'][0];
    var emailHash = jsonMapping['emailHash'][0];
    if (backupVerify(chatID, emailHash)) {
      var html = "<script>alert('Your email has been successfully verified!');window.open('https://t.me/SphygmoBot','_top');</script>";
    } else {
      var html = "<script>alert('Sorry! Verification was unsuccessful.');window.open('https://t.me/SphygmoBot','_top');</script>";
    }
    return HtmlService.createHtmlOutput(html);
  } else {
    var html = '<script>window.open("https://t.me/SphygmoBot","_top");</script>';
    return HtmlService.createHtmlOutput(html);
  }
}

function logDump(data) {
  var sheetName = allLogs;
  var activeSheet = ss.getSheetByName(sheetName);
  var params = JSON.parse(JSON.stringify(data));
  var update_id = params["update_id"];
  var message_id = params['message']['message_id'];
  var from_id = params['message']['from']['id'];
  var is_bot = params['message']['from']['is_bot'];
  var first_name = params['message']['from']['first_name'];
  var last_name = params['message']['from']['last_name'];
  var username = params['message']['from']['username'];
  var language_code = params['message']['from']['language_code'];
  var chat_id = params['message']['chat']['id'];
  var type = params['message']['chat']['type'];
  var date = params['message']['date'];
  date = new Date(date * 1000);
  var text = params['message']['text'];
  var entities_offset = '';
  try {
    entities_offset = params['message']['entities'][0]['offset'];
  } catch (err) {
    entities_offset = ''
  }
  var entities_length = '';
  try {
    var entities_length = params['message']['entities'][0]['length'];
  } catch (err) {
    entities_length = ''
  }
  var entities_type = '';
  try {
    var entities_type = params['message']['entities'][0]['type'];
  } catch (err) {
    entities_type = '';
  }
  activeSheet.appendRow(
    [
      update_id,
      message_id,
      from_id,
      is_bot,
      first_name,
      last_name,
      username,
      language_code,
      chat_id,
      type,
      date,
      text,
      entities_offset,
      entities_length,
      entities_type
    ]
  );
}
