var Staffing = Staffing || {};

function onOpen() {
  Staffing.subButId = "submitButton";
  Staffing.workingLabel = "workLabel";
  Staffing.CONFGRDNAME = "Conflicts";
  
  ss = SpreadsheetApp.getActiveSpreadsheet();
  var menuEntries = [{name: "Make Binaries From Field", functionName: "promptForBinary"},
                     {name: "Create Conflicts Sheet", functionName: "promptForConflictSheet"},
                     {name: "Run Staffing", functionName: "promptForFullStaffing"}];
  ss.addMenu("Staffing Options", menuEntries);
}

function promptForConflictSheet() {
  var app = getSmallApp("Generate Conflict Grid");
  var panel = app.createGrid(2,2);
  var sheets = sheetListBox(app).setName('sheet');
  
  panel.setWidget(0, 0, app.createLabel("Availability sheet name:")).setWidth(0, 1, sheets);
  panel.setWidget(1, 1, app.createButton("Generate Conflict Grid")
      .addClickHandler(app.createServerHandler('generateConflictGrid').addCallbackElement(panel)));
  SpreadsheetApp.getActiveSpreadsheet().show(app.add(panel));
}

function promptForBinary() {
  var app = getSmallApp("Make Binaries From Field");
  var panel = app.createGrid(3,2);
  var sheets = sheetListBox(app).setName('sheet');
  var column = app.createTextBox().setName('column');
  
  panel.setWidget(0, 0, app.createLabel("Shet Name")).setWidget(0, 1, sheets);
  panel.setWidget(1, 0, app.createLabel("Column Header")).setWidget(1, 1, column);
  panel.setWidgeth(2, 1, app.createButton("Create Binary Fields")
      .addClickHandler(app.createServerHandler('generateFieldBinaries').addCallbackElement(panel)));
  app.add(panel);
  SpreadsheetApp.getActiveSpreadsheet().show(app);
}

function promptForFullStaffing() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var app = UiApp.createApplication().setTitle('Staffing');
  
  var submitHandler = app.createServerHandler('generateStaffing');
  var workingHandler = app.createServerHandler('disableSubmit');
  var button = app.createButton("Start Staffing").setId(Staffing.subButId);
  var grid = app.createGrid(3, 2);
  var workingLabel = app.createLabel().setId(Staffing.workingLabel);
  var panel = app.createVerticalPanel();
  
  button.addClickHandler(submitHandler.addCallbackElement(grid))
      .addClickHandler(workingHandler.addCallbackElement(grid));
      
  grid.setWidget(0, 0, app.createLabel('Availability Spreadsheet Name:'))
      .setWidget(0, 1, sheetListBox(app).setName('availabilityName'));
  grid.setWidget(1, 0, app.createLabel('Need Spreadsheet Name:'))
      .setWidget(1, 1, sheetListBox(app).setName('needName'));
  grid.setWidget(2, 0, workingLabel).setWidget(2, 1, button);
  
  panel.add(app.createLabel('You can use this form to activate the staffing script.'
      + ' Input the information below in order to point the script to the correct data.'));
  panel.add(grid);
  
  app.add(panel);  
  doc.show(app);
}

function disableSubmit(e) {
  var app = UiApp.getActiveApplication();
  app.getElementById(Staffing.subButId).setEnabled(false);
  app.getElementById(Staffing.workingLabel).setText('Working...');
  return app;
}

//Functions below are for manipulating sheets and apps

function closeUI(e) {
  var app = UiApp.getActiveApplication();
  app.close();
  return app;
}

function createSheet(name) {
  var sheet
  try { 
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
  }
  catch (err) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  }
  sheet.clear();
  return sheet;
}

//Functions below are for generating UI Pieces

function getSmallApp(title) {
  return UiApp.createApplication().setTitle(title).setHeight(100).setWidth(300);
}

function sheetListBox(uiapp) {
  var sheets = uiapp.createListBox().setName('sheet');
  var sheetList = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for(var i = 0; i < sheetList.length; i++)
    sheets.addItem(sheetList[i].getSheetName());
  return sheets;
}