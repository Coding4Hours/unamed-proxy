(() => {
  // node_modules/@mercuryworkshop/bare-mux/dist/index.mjs
  var t = globalThis.fetch;
  var r = globalThis.SharedWorker;
  var a = globalThis.localStorage;
  var s = globalThis.navigator.serviceWorker;
  var o = MessagePort.prototype.postMessage;
  var n = { prototype: { send: WebSocket.prototype.send }, CLOSED: WebSocket.CLOSED, CLOSING: WebSocket.CLOSING, CONNECTING: WebSocket.CONNECTING, OPEN: WebSocket.OPEN };
  async function c() {
    const e = (await self.clients.matchAll({ type: "window", includeUncontrolled: true })).map(async (e2) => {
      const t3 = await function(e3) {
        let t4 = new MessageChannel();
        return new Promise((r2) => {
          e3.postMessage({ type: "getPort", port: t4.port2 }, [t4.port2]), t4.port1.onmessage = (e4) => {
            r2(e4.data);
          };
        });
      }(e2);
      return await i(t3), t3;
    }), t2 = Promise.race([Promise.any(e), new Promise((e2, t3) => setTimeout(t3, 1e3, new TypeError("timeout")))]);
    try {
      return await t2;
    } catch (e2) {
      if (e2 instanceof AggregateError) throw console.error("bare-mux: failed to get a bare-mux SharedWorker MessagePort as all clients returned an invalid MessagePort."), new Error("All clients returned an invalid MessagePort.");
      return console.warn("bare-mux: failed to get a bare-mux SharedWorker MessagePort within 1s, retrying"), await c();
    }
  }
  function i(e) {
    const t2 = new MessageChannel(), r2 = new Promise((e2, r3) => {
      t2.port1.onmessage = (t3) => {
        "pong" === t3.data.type && e2();
      }, setTimeout(r3, 1500);
    });
    return o.call(e, { message: { type: "ping" }, port: t2.port2 }, [t2.port2]), r2;
  }
  function l(e, t2) {
    const a2 = new r(e, "bare-mux-worker");
    return t2 && s.addEventListener("message", (t3) => {
      if ("getPort" === t3.data.type && t3.data.port) {
        console.debug("bare-mux: recieved request for port from sw");
        const a3 = new r(e, "bare-mux-worker");
        o.call(t3.data.port, a3.port, [a3.port]);
      }
    }), a2.port;
  }
  var p = class {
    constructor(e) {
      this.channel = new BroadcastChannel("bare-mux"), e instanceof MessagePort || e instanceof Promise ? this.port = e : this.createChannel(e, true);
    }
    createChannel(e, t2) {
      if (self.clients) this.port = c(), this.channel.onmessage = (e2) => {
        "refreshPort" === e2.data.type && (this.port = c());
      };
      else if (e && SharedWorker) {
        if (!e.startsWith("/") && !e.includes("://")) throw new Error("Invalid URL. Must be absolute or start at the root.");
        this.port = l(e, t2), console.debug("bare-mux: setting localStorage bare-mux-path to", e), a["bare-mux-path"] = e;
      } else {
        if (!SharedWorker) throw new Error("Unable to get a channel to the SharedWorker.");
        {
          const e2 = a["bare-mux-path"];
          if (console.debug("bare-mux: got localStorage bare-mux-path:", e2), !e2) throw new Error("Unable to get bare-mux workerPath from localStorage.");
          this.port = l(e2, t2);
        }
      }
    }
    async sendMessage(e, t2) {
      this.port instanceof Promise && (this.port = await this.port);
      try {
        await i(this.port);
      } catch {
        return console.warn("bare-mux: Failed to get a ping response from the worker within 1.5s. Assuming port is dead."), this.createChannel(), await this.sendMessage(e, t2);
      }
      const r2 = new MessageChannel(), a2 = [r2.port2, ...t2 || []], s2 = new Promise((e2, t3) => {
        r2.port1.onmessage = (r3) => {
          const a3 = r3.data;
          "error" === a3.type ? t3(a3.error) : e2(a3);
        };
      });
      return o.call(this.port, { message: e, port: r2.port2 }, a2), await s2;
    }
  };
  var w = class extends EventTarget {
    constructor(e, t2 = [], r2, a2) {
      super(), this.protocols = t2, this.readyState = n.CONNECTING, this.url = e.toString(), this.protocols = t2;
      const s2 = (e2) => {
        this.protocols = e2, this.readyState = n.OPEN;
        const t3 = new Event("open");
        this.dispatchEvent(t3);
      }, o2 = async (e2) => {
        const t3 = new MessageEvent("message", { data: e2 });
        this.dispatchEvent(t3);
      }, c2 = (e2, t3) => {
        this.readyState = n.CLOSED;
        const r3 = new CloseEvent("close", { code: e2, reason: t3 });
        this.dispatchEvent(r3);
      }, i2 = () => {
        this.readyState = n.CLOSED;
        const e2 = new Event("error");
        this.dispatchEvent(e2);
      };
      this.channel = new MessageChannel(), this.channel.port1.onmessage = (e2) => {
        "open" === e2.data.type ? s2(e2.data.args[0]) : "message" === e2.data.type ? o2(e2.data.args[0]) : "close" === e2.data.type ? c2(e2.data.args[0], e2.data.args[1]) : "error" === e2.data.type && i2();
      }, r2.sendMessage({ type: "websocket", websocket: { url: e.toString(), protocols: t2, requestHeaders: a2, channel: this.channel.port2 } }, [this.channel.port2]);
    }
    send(...e) {
      if (this.readyState === n.CONNECTING) throw new DOMException("Failed to execute 'send' on 'WebSocket': Still in CONNECTING state.");
      let t2 = e[0];
      t2.buffer && (t2 = t2.buffer.slice(t2.byteOffset, t2.byteOffset + t2.byteLength)), o.call(this.channel.port1, { type: "data", data: t2 }, t2 instanceof ArrayBuffer ? [t2] : []);
    }
    close(e, t2) {
      o.call(this.channel.port1, { type: "close", closeCode: e, closeReason: t2 });
    }
  };
  function g(e) {
    for (let t2 = 0; t2 < e.length; t2++) {
      const r2 = e[t2];
      if (!"!#$%&'*+-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ^_`abcdefghijklmnopqrstuvwxyz|~".includes(r2)) return false;
    }
    return true;
  }
  var f = ["ws:", "wss:"];
  var y = [101, 204, 205, 304];
  var b = [301, 302, 303, 307, 308];
  var k = class {
    constructor(e) {
      this.worker = new p(e);
    }
    createWebSocket(e, t2 = [], r2, a2) {
      try {
        e = new URL(e);
      } catch (t3) {
        throw new DOMException(`Faiiled to construct 'WebSocket': The URL '${e}' is invalid.`);
      }
      if (!f.includes(e.protocol)) throw new DOMException(`Failed to construct 'WebSocket': The URL's scheme must be either 'ws' or 'wss'. '${e.protocol}' is not allowed.`);
      Array.isArray(t2) || (t2 = [t2]), t2 = t2.map(String);
      for (const e2 of t2) if (!g(e2)) throw new DOMException(`Failed to construct 'WebSocket': The subprotocol '${e2}' is invalid.`);
      a2 = a2 || {};
      return new w(e, t2, this.worker, a2);
    }
    async fetch(e, r2) {
      const a2 = new Request(e, r2), s2 = r2?.headers || a2.headers, o2 = s2 instanceof Headers ? Object.fromEntries(s2) : s2, n2 = a2.body;
      let c2 = new URL(a2.url);
      if (c2.protocol.startsWith("blob:")) {
        const e2 = await t(c2), r3 = new Response(e2.body, e2);
        return r3.rawHeaders = Object.fromEntries(e2.headers), r3;
      }
      for (let e2 = 0; ; e2++) {
        let t2 = (await this.worker.sendMessage({ type: "fetch", fetch: { remote: c2.toString(), method: a2.method, headers: o2, body: n2 || void 0 } }, n2 ? [n2] : [])).fetch, s3 = new Response(y.includes(t2.status) ? void 0 : t2.body, { headers: new Headers(t2.headers), status: t2.status, statusText: t2.statusText });
        s3.rawHeaders = t2.headers, s3.rawResponse = t2, s3.finalURL = c2.toString();
        const i2 = r2?.redirect || a2.redirect;
        if (!b.includes(s3.status)) return s3;
        switch (i2) {
          case "follow": {
            const t3 = s3.headers.get("location");
            if (20 > e2 && null !== t3) {
              c2 = new URL(t3, c2);
              continue;
            }
            throw new TypeError("Failed to fetch");
          }
          case "error":
            throw new TypeError("Failed to fetch");
          case "manual":
            return s3;
        }
      }
    }
  };
  console.debug("bare-mux: running v2.1.7 (build c56d286)");

  // src/index.js
  var client = new k();
  client.fetch("https://example.com").then(function(resp) {
    console.log(resp);
  }).catch(function(err) {
    console.log(err);
  });
})();
//# sourceMappingURL=index.js.map
