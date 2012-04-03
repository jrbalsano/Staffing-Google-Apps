function generateFieldBinaries(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var columnHeader = e.parameter.column;
  var sheet = ss.getSheetByName(e.parameter.sheet);
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var column = -1;
  
  UTIL.forEach(headers, function(value, index) {
    if(value == columnHeader)
      column = index + 1;
  });
  
  //Break out if there was no column by that name
  if(column == -1) {
    Browser.msgBox("Error", "The column \"" + columnHeader + "\" was not found on the sheet\"" 
        + sheetName + "\". Please try again!", null);
    return;
  }
  var colVals = sheet.getRange(1, column, sheet.getLastRow(), 1).getValues();
  var oldColumn = [];
  UTIL.forEach(colVals, function(value, index){
    oldColumn.push(colVals[index][0]);
  });
  
  var newColumns = splitBinaryField(oldColumn);
  sheet.insertColumnsAfter(column, newCols[0].length);
  sheet.getRange(1, column+1, newColumns.length, newColumns[0].length).setValues(newColumns);
  closeUI(e);
  return UiApp.getActiveApplication();
}

function generateConflictGrid(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var app = UiApp.getActiveApplication();
  var slotSheetName = e.parameter.sheet;
  var slotSheet = ss.getSheetByName(slotSheetName);
  var vals = slotSheet.getRange(1, 1, 1, slotSheet.getLastColumn()).getValues();
  var width = vals[0].length;
  
  vals[0][0] = "";
  for(var i = 1; i < width; i++) {
    vals[i] = [];
    vals[i][0] = vals [0][i];
    for(var j = 1; j < width; j++) {
      if(i <= j)
        vals[i][j] = "X";
      else
        vals[i][j] = "";
    }
  }
  var conflictGrid = createSheet(Staffing.CONFGRDNAME);
  conflictGrid.getRange(1,1, vals.length, vals[0].length).setValues(vals);
  ss.setActiveSheet(conflictGrid);
  closeUI(e);
  return app;
}

function generateStaffing(e) {
  
}

function splitBinaryField(column) {
  var newCols = [];
  var newHeaders = [];
  
  //Find all possible values
  for(var i = 1; i < column.length; i++) {
    var value = column[i];
    var items = value.split(", ");
    if(items.length > 0 && newHeaders.length == 0)
      newHeaders.push(items[0]);
    UTIL.forEach(items, function(value, index) {
      var found = false;
      UTIL.forEach(newHeaders, function(v, j) {
        if(value == v)
          found = true;
      });
      if(!found)
        newHeaders.push(items[k]);
    });
  }
  
  //Populate new matrix
  UTIL.forEach(column, function(value, index) {
    newCols[index] = [];
  });
  UTIL.forEach(newHeaders, function(header, index) {
    newCols[0][index] = header;
  });
  
  for(var row = 1; row < column.length; row++) {
    var value = column[row];
    UTIL.forEach(newHeaders, function(header, column) {
      if(value.indexOf(header) >= 0)
        newCols[row][column] = "1";
      else
        newCols[row][column] = "";
    });
  }
  return newCols;
}