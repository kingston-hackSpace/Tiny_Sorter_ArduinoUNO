// serial.js — Web Serial version for Tiny Sorter
// Drop-in replacement for the WebUSB version: same serial.requestPort(),
// port.connect(), port.send(), port.disconnect(), port.onReceive API,
// so sketch.js should not need changes.
// Works with any board that shows up as a serial port (Uno, Nano, Leonardo, ESP32...).

// ---------- Connect button ----------
(function () {
  let attached = false;

  function attachButton() {
    const connectButton = document.querySelector('#connect');
    if (!connectButton) {
      // p5 hasn't created the button yet; try again shortly
      setTimeout(attachButton, 200);
      return;
    }
    if (attached) return;
    attached = true;

    if (!('serial' in navigator)) {
      console.error('Web Serial is not supported in this browser. Use Chrome or Edge on a computer.');
      connectButton.textContent = 'USE CHROME OR EDGE';
      return;
    }

    connectButton.addEventListener('click', async () => {
      if (port) {
        await port.disconnect();
        port = null;
        connectButton.textContent = 'CONNECT ARDUINO';
        return;
      }
      try {
        const selectedPort = await serial.requestPort();
        connectButton.textContent = 'CONNECTING...';
        await selectedPort.connect();
        port = selectedPort;
        port.onReceive = data => console.log(new TextDecoder().decode(data));
        port.onReceiveError = error => console.error(error);
        connectButton.textContent = 'DISCONNECT';
      } catch (error) {
        console.error('Could not connect:', error);
        connectButton.textContent = 'CONNECT ARDUINO';
      }
    });
  }

  attachButton();
})();

// ---------- Web Serial wrapper ----------
var serial = {};

(function () {
  const BAUD_RATE = 9600;       // must match Serial.begin() in the Arduino sketch
  const RESET_WAIT_MS = 2000;   // the Uno reboots when the port opens

  serial.getPorts = async function () {
    const ports = await navigator.serial.getPorts();
    return ports.map(p => new serial.Port(p));
  };

  serial.requestPort = async function () {
    const p = await navigator.serial.requestPort();
    return new serial.Port(p);
  };

  serial.Port = function (webSerialPort) {
    this.port_ = webSerialPort;
    this.reader_ = null;
    this.writer_ = null;
    this.reading_ = false;
    this.readLoop_ = null;
    this.onReceive = () => {};
    this.onReceiveError = () => {};
  };

  serial.Port.prototype.connect = async function () {
    await this.port_.open({ baudRate: BAUD_RATE });
    this.writer_ = this.port_.writable.getWriter();
    this.reading_ = true;

    this.readLoop_ = (async () => {
      while (this.reading_ && this.port_.readable) {
        this.reader_ = this.port_.readable.getReader();
        try {
          while (true) {
            const { value, done } = await this.reader_.read();
            if (done) break;
            if (value) this.onReceive(value);
          }
        } catch (error) {
          if (this.reading_) this.onReceiveError(error);
        } finally {
          this.reader_.releaseLock();
          this.reader_ = null;
        }
      }
    })();

    // Give the board time to reboot before anything is sent
    await new Promise(resolve => setTimeout(resolve, RESET_WAIT_MS));
  };

  serial.Port.prototype.send = function (data) {
    let bytes;
    if (typeof data === 'string') {
      bytes = new TextEncoder().encode(data);
    } else if (data instanceof ArrayBuffer) {
      bytes = new Uint8Array(data);
    } else if (ArrayBuffer.isView(data)) {
      bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    } else {
      bytes = new Uint8Array([Number(data)]);
    }
    return this.writer_.write(bytes);
  };

  serial.Port.prototype.disconnect = async function () {
    this.reading_ = false;
    try {
      if (this.reader_) await this.reader_.cancel();
      if (this.readLoop_) await this.readLoop_;
      if (this.writer_) {
        this.writer_.releaseLock();
        this.writer_ = null;
      }
      await this.port_.close();
    } catch (error) {
      console.error('Error while disconnecting:', error);
    }
  };
})();