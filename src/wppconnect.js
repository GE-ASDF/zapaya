const wppconnect = require("@wppconnect-team/wppconnect");
const fs = require("fs");
const {io} = require("./app");

const wppSession = wppconnect.create({
    session: "whatsbot",
    autoClose:false,
    puppeteerOptions: { args: ['--no-sandbox'] },
    catchQR: (base64Qr, asciiQR) => {
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
          response = {};
  
        if (matches.length !== 3) {
          return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], 'base64');
  
        var imageBuffer = response;
        require('fs').writeFile(
          'public/uploads/qrcode.png',
          imageBuffer['data'],
          'binary',
          function (err) {
            if (err != null) {
              console.log(err);
            }
            io.emit("img");
          }
        );
        io.emit("img");
      },
      logQR: false,
})

module.exports = wppSession;