const express = require('express');
const path = require('path');

// http server를 socket.io server로 upgrade한다
const ejs = require('ejs');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '/', 'public')));

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/', 'views'));

class SimulatorApp {
  constructor(appPort, deviceMap) {
    this.appPort = appPort;
    this.deviceMap = deviceMap;
  }

  init() {
    app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/views/index.html`);
    });

    server.listen(this.appPort, () => {
      console.log(`Socket IO server listening on port ${this.appPort}`);
    });
  }
}
module.exports = SimulatorApp;
