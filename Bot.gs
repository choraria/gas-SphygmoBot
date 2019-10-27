function start(data) {
  var reply = {
    'chat_id': data.message.chat.id,
    'text': "Thank you for choosing *Heartbeat* (@SphygmoBot)." + "\n\n" +
    "_Sphygmo-_ pertains to the [Pulse](https://en.wikipedia.org/wiki/Pulse) in a cardiac cycle."  + "\n\n" +
    "Please /register to start using it's services."  + "\n\n" +
    "Courtesy: [@schoraria911](https://twitter.com/schoraria911)",
    'parse_mode': 'Markdown',
    'disable_web_page_preview': true
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
}

function register(data) {
  var sheetName = userReg;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var subscribedIndex = headers.indexOf('Subscribed');
  var setupStatusIndex = headers.indexOf('SetupStatus');
  var backupContactIndex = headers.indexOf('BackupContact');
  var backupVerifiedIndex = headers.indexOf('BackupVerified');
  var chatID = data.message.chat.id;
  var newUser = false;
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][setupStatusIndex] == true) {
        var reply = {
          'chat_id': chatID,
          'text': 'You have already been registered.' + '\n\n' +
          'Click /test to do a dry run.'
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        newUser = false;
        break;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][setupStatusIndex] !== true && values[i][backupContactIndex] == '') {
        var reply = {
          'chat_id': chatID,
          'text': "Your registration is incomplete! " + "\n\n" + "Please enter a recipient's email address, who the bot could contact in case you're unable to confirm a Heartbeat."
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        newUser = false;
        break;        
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][setupStatusIndex] !== true && values[i][backupVerifiedIndex] !== true) {
        var reply = {
          'chat_id': chatID,
          'text': "Your registration is incomplete! " + '\n\n' +
          "A confirmation email has been sent to " + values[i][backupContactIndex] + ". Please ask them to verify their email."
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        newUser = false;
        break;        
      } else {
        newUser = true;
      }
    }
    if (newUser) {
      addUser(chatID, activeSheet, values);
    }
  } else if (values.length = 1) {
    addUser(chatID, activeSheet, values);
  }
}

function addUser(chatID, activeSheet, values) {
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var subscribedIndex = headers.indexOf('Subscribed');
  var startDateIndex = headers.indexOf('StartDate');
  var endDateIndex = headers.indexOf('EndDate');
  var setupStatusIndex = headers.indexOf('SetupStatus');
  var backupContactIndex = headers.indexOf('BackupContact');
  var contactHashIndex = headers.indexOf('ContactHash');
  var backupVerifiedIndex = headers.indexOf('BackupVerified');  
  var reply = {
    'chat_id': chatID,
    'text': 'Thank you for choosing to register! '+ '\n\n' + "Please enter a recipient's email address, who the bot could contact in case you're unable to confirm a Heartbeat."
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
  if (response.getResponseCode() == 200) {
    var newUser = true;
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID) {
        activeSheet.getRange(i+1, subscribedIndex + 1).setValue(true);
        activeSheet.getRange(i+1, startDateIndex + 1).setValue(new Date());
        activeSheet.getRange(i+1, endDateIndex + 1).setValue('');
        activeSheet.getRange(i+1, backupContactIndex + 1).setValue('');
        activeSheet.getRange(i+1, setupStatusIndex + 1).setValue(false);
        activeSheet.getRange(i+1, contactHashIndex + 1).setValue('');
        activeSheet.getRange(i+1, backupVerifiedIndex + 1).setValue(false);
        newUser = false;
        break;
      } else {
        newUser = true;
      }
    }
    if (newUser) {
      activeSheet.appendRow(
        [
          chatID,
          true,
          new Date(),
          "",
          "",
          false,
          "",
          false
        ]
      );
    }
  }  
}

function invalid(data) {
  var reply = {
    'chat_id': data.message.chat.id,
    'text': "Oops! Looks like you entered an incorrect command."
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
}

function stop(data) {
  var sheetName = userReg;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var subscribedIndex = headers.indexOf('Subscribed');
  var startDateIndex = headers.indexOf('StartDate');
  var endDateIndex = headers.indexOf('EndDate');
  var existingUser = true;
  var chatID = data.message.chat.id;
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true) {
        activeSheet.getRange(i+1, subscribedIndex + 1).setValue(false);
        activeSheet.getRange(i+1, endDateIndex + 1).setValue(new Date());
        var reply = {
          'chat_id': chatID,
          'text': 'You have successfully unsubscribed!' + '\n\n' +
          'To restart the services, please /register again.'
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);        
        existingUser = true;
        break;
      } else {
        existingUser = false;
      }
    }
    if (!existingUser) {
      unregisteredUser(chatID);
    }
  } else if (values.length = 1) {
    unregisteredUser(chatID);
  }
}

function unregisteredUser(chatID) {
  var reply = {
    'chat_id': chatID,
    'text': 'You are not a registered user!' + '\n\n' +
    "Click on /register to subscribe for Heartbeat's services."
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
}

function stopNon200(chatID) {
  var sheetName = userReg;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('ChatID');
  var subscribedIndex = headers.indexOf('Subscribed');
  var startDateIndex = headers.indexOf('StartDate');
  var endDateIndex = headers.indexOf('EndDate');  
  var existingUser = true;
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true) {
        activeSheet.getRange(i+1, subscribedIndex + 1).setValue(false);
        activeSheet.getRange(i+1, endDateIndex + 1).setValue(new Date());
        break;
      }
    }
  }
}

function help(data) {
  var reply = {
    'chat_id': data.message.chat.id,
    'text': "/start - Display Welcome Message" + "\n" +
    "/register - Subscribe for Heartbeat" + "\n" +
    "/stop - Unsubscribe from Heartbeat" + "\n" +
    "/test - Dummy Ping" + "\n" +
    "/help - List all Commands"  + "\n\n" +
    "/editbackup - Update Backup Email" + "\n" +
    "/viewbackup - View Backup Email"
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
}

function addContact(data) {
  var email = data.message.text;
  var emailHash = MD5(email);
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
  var chatID = data.message.chat.id;
  var existingUser = true;
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][setupStatusIndex] == true) {
        invalid(data);
        existingUser = true;
        break;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == false) {
        existingUser = false;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][setupStatusIndex] !== true && values[i][backupContactIndex] == '') {
        activeSheet.getRange(i+1, backupContactIndex + 1).setValue(email);
        activeSheet.getRange(i+1, contactHashIndex + 1).setValue(emailHash);
        var reply = {
          'chat_id': chatID,
          'text': 'Thank you for adding a recipient.' + '\n\n' +
          "A confirmation email will be sent to " + email + ". Please ask them to verify their email."
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        sendEmailToVerify(data, email, emailHash);
        existingUser = true;
        break;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][backupContactIndex] == email && values[i][backupVerifiedIndex] !== true) {
        var reply = {
          'chat_id': chatID,
          'text': "A confirmation email has already been sent to " + email + ".\n\n" +
          "Please ask them to verify their email."
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        existingUser = true;
        break;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][backupContactIndex] !== email) {
        var reply = {
          'chat_id': chatID,
          'text': "You already have " + values[i][backupContactIndex] + " listed as your backup contact." + "\n\n" +
          "Please use /help to update contact."
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        existingUser = true;
        break;
      }
    }
    if (!existingUser) {
      unregisteredUser(chatID);
    }
  } else if (values.length = 1) {
    unregisteredUser(chatID);
  }
}

function backupVerify(chatID, emailHash) {
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
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][contactHashIndex] == emailHash && values[i][setupStatusIndex] !== true && values[i][backupVerifiedIndex] !== true) {
        activeSheet.getRange(i+1, backupVerifiedIndex + 1).setValue(true);
        activeSheet.getRange(i+1, setupStatusIndex + 1).setValue(true);
        var reply = {
          'chat_id': chatID,
          'text': "Your backup contact " + values[i][backupContactIndex] + " has just been verified." + "\n\n" +
          'Click /test to do a dry run.' + '\n\n' +
          'You can unsubscribe anytime by choosing the /stop command.'
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        if (response.getResponseCode() !== 200) {
          stopNon200(chatID);
        } else {
          return true;
        }
      }
    }
  }
}

function sendEmailToVerify(data, email, emailHash){
  var chatID = data.message.chat.id;
  var subject = data.message.from.first_name + " wants to add you as backup contact.";
  var htmlBody = 'The following human wants to add you as a backup contact while having to use the <a href="https://t.me/SphygmoBot">@SphygmoBot</a> on Telegram.' + '\n\n' +
    '<ul><li>First Name: ' + data.message.from.first_name + '</li>\n' +
      '<li>Last Name: '  + data.message.from.last_name + '</li>\n' +
        '<li>Telegram Username: ' + '<a href="https://t.me/' + data.message.from.username + '">@' + data.message.from.username + '</a></li></ul>' + '\n' +
          'To accept their request, you would need to verify your email address.<br /><br />' + '\n\n' + 
            "<a style=\"background-color: #f44336; padding:10px 32px; font-size: 16px; margin: 4px 2px; border: none; color: white; text-align: center; text-decoration: none; display: inline-block;\" href='" +
              ScriptApp.getService().getUrl() + '?chatID=' + chatID + '&emailHash=' + emailHash +
                "'>Verify</a><br /><br />" + '\n\n' +
                  'Beat on!';
  MailApp.sendEmail({
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    name: "Heartbeat via SphygmoBot"
  });
}

function editBackup(data) {
  var reply = {
    'chat_id': data.message.chat.id,
    'text': "Please /stop the service first and /register again."
  };
  var method = 'sendMessage';
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(reply)
  };
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
}

function viewBackup(data) {
  var chatID = data.message.chat.id;
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
  var existingUser = true;
  if (values.length > 1) {
    for (var i = 0; i < values.length; i++) {
      if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][setupStatusIndex] == true && values[i][backupVerifiedIndex] == true) {
        var textResponse = "Your backup contact email is " + values[i][backupContactIndex] + ' which has been verified by them.';
        var reply = {
          'chat_id': data.message.chat.id,
          'text': textResponse
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        existingUser = true;
        break;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][backupVerifiedIndex] !== true && values[i][backupContactIndex] !== '') {
        var textResponse = "You've chosen " + values[i][backupContactIndex] + ' as your backup contact email that is yet to be verified.' + '\n\n' +
          'In case you want to change or update this email address, please /stop the service first and /register again.';
        var reply = {
          'chat_id': data.message.chat.id,
          'text': textResponse
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        existingUser = true;
        break;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] == true && values[i][backupVerifiedIndex] !== true && values[i][backupContactIndex] == '') {
        var textResponse = "Your registration is incomplete! " + "\n\n" + "Please enter a recipient's email address, who the bot could contact in case you're unable to confirm a Heartbeat.";
        var reply = {
          'chat_id': data.message.chat.id,
          'text': textResponse
        };
        var method = 'sendMessage';
        var options = {
          'method' : 'post',
          'contentType': 'application/json',
          'payload' : JSON.stringify(reply)
        };
        var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + telegramToken + '/' + method, options);
        existingUser = true;
        break;
      } else if (values[i][chatIDIndex] == chatID && values[i][subscribedIndex] !== true) {
        existingUser = false;
      }
    }
    if (!existingUser) {
      unregisteredUser(chatID);
    }
  } else if (values.length = 1) {
    unregisteredUser(chatID);
  }
}
