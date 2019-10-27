function removeEmptyColumns(sheetName) {
  var activeSheet = ss.getSheetByName(sheetName)
  var maxColumns = activeSheet.getMaxColumns(); 
  var lastColumn = activeSheet.getLastColumn();
  if (maxColumns-lastColumn != 0){
    activeSheet.deleteColumns(lastColumn+1, maxColumns-lastColumn);
  }
}

function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getUserInfo(chatID) {
  var sheetName = allLogs;
  var activeSheet = ss.getSheetByName(sheetName);
  var range = activeSheet.getDataRange();
  var values = range.getValues();
  var headers = values[0];
  var chatIDIndex = headers.indexOf('chat_id');
  var firstNameIndex = headers.indexOf('first_name');
  var lastNameIndex = headers.indexOf('last_name');
  var usernameIndex = headers.indexOf('username');
  for (var i = 0; i < values.length; i++) {
    if (values[i][chatIDIndex] == chatID) {
      var first_name = values[i][firstNameIndex];
      var last_name = values[i][lastNameIndex];
      var username = values[i][usernameIndex];
      return {
        "first_name": first_name,
        "last_name": last_name,
        "username": username
      }
    }
  }
}
