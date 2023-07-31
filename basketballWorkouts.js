function formatBasketballDescriptionRich(inputString) {
  console.log(inputString)
  console.log(inputString.split('\n').map((el) => `"${el}`))
  
  const regex = /<li>(.*?)<\/li>/g;
  const matches = inputString?.match(regex);
  if (!matches) return {};
  const resultList = matches.map((match) => match?.replace(/<\li>/g, '"').replace(', ', '": ').replace(/<\/li>/g, ''));
  const result = `{${resultList.join(', ')}}`;
  return JSON.parse(result);
}

function formatBasketballDescription(inputString) {
  const result = `{${inputString.split('\n').map((el) => `"${el}`.replace(', ', '": ')).join(', ')}}`;
  console.log(result);
  return JSON.parse(result);
}

const basketballDescriptionMappers = (inputString) => {
  const mapper = {
    fta: 'Free throws attempted',
    ftm: 'Free throws made',
    tsa: 'Total Shots attempted',
    sak: 'Shots around key made',
  }

  return mapper[inputString] ?? 'Undefined Header';
}


function syncBasketballWorkouts() {
  const ss = SpreadsheetApp.openById('1jC8zd6rWU2ip-x51Ebfkq2dQrR2hdZ6XH0p-YJMpagM');
  const sheet = ss.getSheetByName('basketball_import_raw');
  var calendarId = sheet.getRange('B1').getValue().toString();
  var calendar = CalendarApp.getCalendarById(calendarId);

  // Filters
  var startDate = sheet.getRange('B2').getValue();
  var endDate = sheet.getRange('B3').getValue();
  var searchText = sheet.getRange('B4').getValue();

  // Print header
  var header = [[
    "Title", "Free throws made", "Free throws attempted", 
    "Total Shots attempted", "Shots around key made",
    "Date"]];
  var range = sheet.getRange("A6:F6");
  range.setValues(header);
  range.setFontWeight("bold")

  // Get events based on filters
  var events = (searchText == '') ? calendar.getEvents(startDate, endDate) : calendar.getEvents(startDate, endDate, { search: searchText });

  // Display events 
  for (var i = 0; i < events.length; i++) {
    var row = i + 7;

    const description = formatBasketballDescription(events[i].getDescription());

    var details = [[
      events[i].getTitle(), 
      description?.ftm, 
      description?.fta, 
      description?.tsa, 
      description?.sak, 
      events[i].getStartTime()
      ]];

    range = sheet.getRange(row, 1, 1, 6);
    range.setValues(details);

    // Format the Start and End columns
    var cell = sheet.getRange(row, 6);
    cell.setNumberFormat('dd/mm/yyyy');
  }
}
