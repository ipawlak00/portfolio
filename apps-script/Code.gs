function doGet() {
  var template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setTitle('Izabela Pawlak | Portfolio');
}

function handleButtonClick() {
  var content = "<b>Kim jestem?<br><br>Jestem sobą – jestem Izabelą.</b><br>Tworzę procesy, wymyślam nowe rozwiązania i porządkuje chaos. Bywam budowniczym struktur, wizjonerem zmian i analitycznym myślicielem, a kiedy trzeba – skutecznym doradcą i motywatorem.";

  return content;
}
