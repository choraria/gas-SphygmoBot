// You need to have Helper.gs available in the project before running the setup() function

function setup() {
  var method = 'setWebhook';
  var payload = {
    url: ScriptApp.getService().getUrl()
  }
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(payload)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
  Logger.log(response);
  
  var sheetName1 = userReg;
  var activeSheet1 = ss.getSheetByName(sheetName1);  
  if (activeSheet1 == null) {
    activeSheet1 = ss.insertSheet().setName(sheetName1);
    activeSheet1.appendRow(
      [
        "ChatID",
        "Subscribed",
        "StartDate",
        "EndDate",
        "BackupContact",
        "SetupStatus",
        "ContactHash",
        "BackupVerified"
      ]
    );
    removeEmptyColumns(sheetName1);
    activeSheet1.setFrozenRows(1);    
    activeSheet1.getRange(1, 1, 1, activeSheet1.getLastColumn()).setFontWeight("bold");
  }
  
  var sheetName2 = pingLogs;
  var activeSheet2 = ss.getSheetByName(sheetName2);  
  if (activeSheet2 == null) {
    activeSheet2 = ss.insertSheet().setName(sheetName2);
    activeSheet2.appendRow(
      [
        "ChatID",
        "LastPing",
        "StillAlive",
        "AliveAt",
        "FollowUp",
        "FollowedUpAt",
        "NotifyBackup",
        "NotifyDate"
      ]
    );
    removeEmptyColumns(sheetName2);
    activeSheet2.setFrozenRows(1);    
    activeSheet2.getRange(1, 1, 1, activeSheet2.getLastColumn()).setFontWeight("bold");
  }
  
  var sheetName3 = allLogs;
  var activeSheet3 = ss.getSheetByName(sheetName3);  
  if (activeSheet3 == null) {
    activeSheet3 = ss.insertSheet().setName(sheetName3);
    activeSheet3.appendRow(
      [
        "update_id",
        "message_id",
        "from_id",
        "is_bot",
        "first_name",
        "last_name",
        "username",
        "language_code",
        "chat_id",
        "type",
        "date",
        "text",
        "entities_offset",
        "entities_length",
        "entities_type"
      ]
    );
    removeEmptyColumns(sheetName3);
    activeSheet3.setFrozenRows(1);    
    activeSheet3.getRange(1, 1, 1, activeSheet3.getLastColumn()).setFontWeight("bold");
  }
  
  try {
    ss.deleteSheet(ss.getSheetByName('Sheet1'));
  } catch (err) {
    Logger.log(err);
  }
}

function scheduler() {
  ScriptApp.newTrigger('heartbeat').timeBased().everyDays(1).atHour(9).nearMinute(10).create();
  ScriptApp.newTrigger('followUp').timeBased().everyDays(1).atHour(16).nearMinute(10).create();
  ScriptApp.newTrigger('notifyBackup').timeBased().everyDays(1).atHour(22).nearMinute(10).create();
}
