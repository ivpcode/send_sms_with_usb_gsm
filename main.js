const { SerialPort,ReadlineParser } = require('serialport');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
    { name: 'port', alias: 'p', type: String },
    { name: 'number', alias: 'n', type: String },
    { name: 'message', alias: 'm', type: String },
  ]

const params = commandLineArgs(optionDefinitions)

console.log(params)

const serialPort = new SerialPort({ path:params.port, baudRate:115200});
const parser = new ReadlineParser()
serialPort.pipe(parser)
parser.on('data', console.log)

serialPort.on('open', () => {
    serialPort.write('AT+CMGF=1\r\n'); 
    serialPort.write('AT+CSCS="GSM"\r\n');
    serialPort.write(`AT+CMGS="${params.number}"\r\n`);
    serialPort.write(`${params.message}\r\n`);
    serialPort.write('\x1A');
    serialPort.write('^z'); 
    serialPort.flush(()=>{ serialPort.close() })
});
