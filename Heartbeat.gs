function heartbeat() {
  var sheetName = pingLogs;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var lastPingIndex = headers.indexOf('LastPing');
  var stillAliveIndex = headers.indexOf('StillAlive');
  var aliveAtIndex = headers.indexOf('AliveAt');
  var followUpIndex = headers.indexOf('FollowUp');
  var followedUpAtIndex = headers.indexOf('FollowedUpAt');
  var notifyBackupIndex = headers.indexOf('NotifyBackup');
  var notifyDateIndex = headers.indexOf('NotifyDate');
  var toPingData = getUsersData();
  if (toPingData.length > 0) {
    for (var i = 0; i < toPingData.length; i++) {
      var chatID = toPingData[i];
      var freshPing = false;
      for (var j = 0; j < values.length; j++) {
        if (values[j][chatIDIndex] == chatID) {
          if (values[j][chatIDIndex] == chatID && values[j][stillAliveIndex] == true && new Date().getTime() - values[j][lastPingIndex].getTime() > 72000000) {
            if(pingHB(chatID)) {
              activeSheet.getRange(j+1,lastPingIndex+1).setValue(new Date());
              activeSheet.getRange(j+1,stillAliveIndex+1).setValue(false);
              activeSheet.getRange(j+1,aliveAtIndex+1).setValue('');
              activeSheet.getRange(j+1,followUpIndex+1).setValue(false);
              activeSheet.getRange(j+1,notifyBackupIndex+1).setValue(false);
            }
            freshPing = false;
            break;
          }
          freshPing = false;
        } else {
          freshPing = true;
        }
      }
      if (freshPing) {
        if(pingHB(chatID)) {
          activeSheet.appendRow(
            [
              chatID,
              new Date(),
              false,
              "",
              false,
              "",
              false,
              ""
            ]
          );
        }
        break;
      }
    }
  }
}

function pingHB(chatID){
  var ping = {
    'chat_id': chatID,
    'text': "Click 'Alive' if you're okay!",
    'reply_markup': {
      keyboard: [['Alive']],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true
    }
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(ping),
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
  if (response.getResponseCode() !== 200) {
    stopNon200(chatID);
    return false;
  } else if (response.getResponseCode() == 200) {
    return true;
  }
}

function followUp() {
  var sheetName = pingLogs;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var lastPingIndex = headers.indexOf('LastPing');
  var stillAliveIndex = headers.indexOf('StillAlive');
  var aliveAtIndex = headers.indexOf('AliveAt');
  var followUpIndex = headers.indexOf('FollowUp');
  var followedUpAtIndex = headers.indexOf('FollowedUpAt');
  var notifyBackupIndex = headers.indexOf('NotifyBackup');
  var notifyDateIndex = headers.indexOf('NotifyDate');
  var toFollowUpData = followUpData();
  for (var i = 0; i < toFollowUpData.length; i++) {
    var chatID = toFollowUpData[i];
    var ping = {
      'chat_id': chatID,
      'text': "*\[Follow-up\]* We've not heard from you in the last 7-8 hours." + "\n\n" +
      "*Kindly click 'Alive' if you're okay!*" + "\n\n" +
      "In case we don't hear back from you in the next 3-4 hours, we will contact the backup email you've provided to check-up on you.",
      'parse_mode': 'Markdown',
      'reply_markup': {
      keyboard: [['Alive']],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true
    }
    };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(ping),
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
  if (response.getResponseCode() !== 200) {
    stopNon200(chatID);
  } else if (response.getResponseCode() == 200) {
    for (var j = 0; j < values.length; j++) {
      if (values[j][chatIDIndex] == chatID) {
        activeSheet.getRange(j+1,followUpIndex+1).setValue(true);
        activeSheet.getRange(j+1,followedUpAtIndex+1).setValue(new Date());
      }
    }
  }
}
}

function followUpData() {
  var sheetName = pingLogs;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var lastPingIndex = headers.indexOf('LastPing');
  var stillAliveIndex = headers.indexOf('StillAlive');
  var aliveAtIndex = headers.indexOf('AliveAt');
  var followUpIndex = headers.indexOf('FollowUp');
  var followedUpAtIndex = headers.indexOf('FollowedUpAt');
  var notifyBackupIndex = headers.indexOf('NotifyBackup');
  var notifyDateIndex = headers.indexOf('NotifyDate');
  var toPingData = getUsersData();
  var toFollowUpRaw = [];
  var toFollowUp = [];
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][stillAliveIndex] !== true && values[i][aliveAtIndex] == '' && values[i][followUpIndex] !== true && values[i][followedUpAtIndex] == ''  && new Date().getTime() - values[i][lastPingIndex].getTime() > 20000000) {
        toFollowUpRaw.push(values[i][chatIDIndex].toString());
      }
    }
    for (var j = 0; j < toFollowUpRaw.length; j++) {
      var chatID = toFollowUpRaw[j];
      for (var k = 0; k < toPingData.length; k++) {
        if (toPingData[k] == chatID) {
          toFollowUp.push(chatID);
        }
      }
    }
  }
  return toFollowUp;
}

function notifyBackup() {
  var sheetName = pingLogs;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var lastPingIndex = headers.indexOf('LastPing');
  var stillAliveIndex = headers.indexOf('StillAlive');
  var aliveAtIndex = headers.indexOf('AliveAt');
  var followUpIndex = headers.indexOf('FollowUp');
  var followedUpAtIndex = headers.indexOf('FollowedUpAt');
  var notifyBackupIndex = headers.indexOf('NotifyBackup');
  var notifyDateIndex = headers.indexOf('NotifyDate');
  var toNotifyBackupData = notifyBackupData();
  for (var i = 0; i < toNotifyBackupData.length; i++) {
    var chatID = toNotifyBackupData[i];
    if (sendEmailToBackup(chatID)) {
      for (var j = 0; j < values.length; j++) {
        if (values[j][chatIDIndex] == chatID) {
          activeSheet.getRange(j+1,notifyBackupIndex+1).setValue(true);
          activeSheet.getRange(j+1,notifyDateIndex+1).setValue(new Date());
          stopNon200(chatID);
        }
      }
    }
  }
}

function sendEmailToBackup(chatID) {
  var sheetName = userReg;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var subscribedIndex = headers.indexOf('Subscribed');
  var setupStatusIndex = headers.indexOf('SetupStatus');
  var backupContactIndex = headers.indexOf('BackupContact');
  var contactHashIndex = headers.indexOf('ContactHash');
  var backupVerifiedIndex = headers.indexOf('BackupVerified');
  for (var i = 0; i < values.length; i++) {
    if (values[i][chatIDIndex] == chatID) {
      var userInfo = getUserInfo(chatID);
      var first_name = userInfo.first_name;
      var last_name = userInfo.last_name;
      var username = userInfo.username;
      var email = values[i][backupContactIndex];
      var subject = first_name + " has not been responding to the Heartbeats.";
      var htmlBody = 'Hey there! - This is <a href="https://t.me/SphygmoBot">@SphygmoBot</a> from Telegram again.' + '\n\n' +
        'The following human, who you are a backup contact of, has not been responding to our pings from the last 10-12 hours.' + '\n\n' +
          '<ul><li>First Name: ' + first_name + '</li>\n' +
            '<li>Last Name: '  + last_name + '</li>\n' +
              '<li>Telegram Username: ' + '<a href="https://t.me/' + username + '">@' + username + '</a></li></ul>' + '\n' +
                '<b>It would be best if you could check up on them once to see if they\'re okay.</b>' + '<br /><br />' +
                  'We might also have unsubscribed them from our services until they confirm back and so it would help if you could let them know to re-register.' + '<br /><br />' +
                    'Beat on!';
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody,
        name: "Heartbeat via SphygmoBot"
      });
      
      
      var ping = {
        'chat_id': chatID,
        'text': "We've still not heard back from you in the past 3-4 hours. Accordingly, we've reached out to your backup email contact " + values[i][backupContactIndex] +
        " so they could check up on you and confirm." + '\n\n' +
        "*You can also click 'Alive' if you're okay!*"  + '\n\n' +
        "We've also temporarily unsubscribed you from the services. Please /register again to re-start.",
        'parse_mode': 'Markdown',
        'reply_markup': {
        keyboard: [['Alive']],
        resize_keyboard: true,
        one_time_keyboard: true,
        force_reply: true
      }
      };
    var method = 'sendMessage';
    var options = {
      'method' : 'post',
      'contentType': 'application/json',
      'payload' : JSON.stringify(ping),
      'muteHttpExceptions': true
    };
    var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
    if (response.getResponseCode() !== 200) {
      stopNon200(chatID);
      return false;
    } else if (response.getResponseCode() == 200) {
      return true;
    }
  }
}
}

function notifyBackupData() {
  var sheetName = pingLogs;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var lastPingIndex = headers.indexOf('LastPing');
  var stillAliveIndex = headers.indexOf('StillAlive');
  var aliveAtIndex = headers.indexOf('AliveAt');
  var followUpIndex = headers.indexOf('FollowUp');
  var followedUpAtIndex = headers.indexOf('FollowedUpAt');
  var notifyBackupIndex = headers.indexOf('NotifyBackup');
  var notifyDateIndex = headers.indexOf('NotifyDate');
  var toPingData = getUsersData();
  var toNotifyBackupRaw = [];
  var toNotifyBackup = [];
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][stillAliveIndex] !== true && values[i][aliveAtIndex] == '' && values[i][followUpIndex] == true && values[i][followedUpAtIndex] !== ''  && new Date().getTime() - values[i][followedUpAtIndex].getTime() > 16000000) {
        toNotifyBackupRaw.push(values[i][chatIDIndex].toString());
      }
    }
    for (var j = 0; j < toNotifyBackupRaw.length; j++) {
      var chatID = toNotifyBackupRaw[j];
      for (var k = 0; k < toPingData.length; k++) {
        if (toPingData[k] == chatID) {
          toNotifyBackup.push(chatID);
        }
      }      
    }
  }
  return toNotifyBackup;
}

// This is an actual function.
// DO NOT DELETE
function test(data) {
  var chatID = data.message.chat.id;
  var ping = {
    'chat_id': chatID,
    'text': "*[Testing]* Click 'Alive' if you're okay!",
    'parse_mode': 'Markdown',
    'reply_markup': {
      keyboard: [['Alive [Testing]']],
      resize_keyboard: true,
      one_time_keyboard: true,
      force_reply: true
    }
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(ping),
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
}

function alive(data) {
  var text = data.message.text;
  var replyText;
  if (text == 'Alive' || text == 'Alive ') {
    var chatID = data.message.chat.id;
    var sheetName = pingLogs;
    var activeSheet = ss.getSheetByName(sheetName);
    var range = activeSheet.getDataRange();
    var values = range.getValues();
    var headers = values[0];
    var chatIDIndex = headers.indexOf('ChatID');
    var lastPingIndex = headers.indexOf('LastPing');
    var stillAliveIndex = headers.indexOf('StillAlive');
    var aliveAtIndex = headers.indexOf('AliveAt');
    var followUpIndex = headers.indexOf('FollowUp');
    var followedUpAtIndex = headers.indexOf('FollowedUpAt');
    var notifyBackupIndex = headers.indexOf('NotifyBackup');
    var notifyDateIndex = headers.indexOf('NotifyDate');
    var rogueAlive = false;
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID && values[i][stillAliveIndex] !== true) {
        activeSheet.getRange(i+1,stillAliveIndex+1).setValue(true);
        activeSheet.getRange(i+1,aliveAtIndex+1).setValue(new Date());
        activeSheet.getRange(i+1,followUpIndex+1).setValue(false);
        activeSheet.getRange(i+1,followedUpAtIndex+1).setValue('');
        activeSheet.getRange(i+1,notifyBackupIndex+1).setValue(false);
        activeSheet.getRange(i+1,notifyDateIndex+1).setValue('');
        replyText = "Thanks for confirming!";
        rogueAlive = false;
        break;
      } else {
        rogueAlive = true;
      }
      if (rogueAlive) {
        replyText = "Thanks for letting know. Looks like this was unprompted.";
      }
    }
  } else if (text == 'Alive [Testing]' || text == 'Alive [Testing] ') {
    replyText = "Test was successful!"
  }
  var reply = {
    'chat_id': data.message.chat.id,
    'text': replyText,
    'reply_markup': {
      remove_keyboard: true
    }
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
}

function getUsersData() {
  var sheetName = userReg;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var subscribedIndex = headers.indexOf('Subscribed');
  var setupStatusIndex = headers.indexOf('SetupStatus');
  var backupContactIndex = headers.indexOf('BackupContact');
  var contactHashIndex = headers.indexOf('ContactHash');
  var backupVerifiedIndex = headers.indexOf('BackupVerified');
  var toPing = [];
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][subscribedIndex] == true && values[i][setupStatusIndex] == true && values[i][backupVerifiedIndex] == true) {
        toPing.push(values[i][chatIDIndex].toString());
      }
    }
  }
  Logger.log('UserData: ' + toPing.filter(function (item, index) { return toPing.indexOf(item) === index}))
  return toPing.filter(function (item, index) { return toPing.indexOf(item) === index});
}
