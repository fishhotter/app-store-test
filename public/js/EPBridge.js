const EPbridge = {
  defalut: this, // 默认的this指向
  call: (method, args, middleware) => {
      let res = "";
      // 判断args是不是方法
      if (Object.prototype.toString.call(args) === "[object Function]") {
          middleware = args;
          args = {};
      }
      let arg = { data: args === undefined ? null : args }

      if (Object.prototype.toString.call(middleware) === "[object Function]") {
          let middlewarebName = "envAsynPre" + window.envbri++;
          window[middlewarebName] = middleware;
          arg["_envAsynPre"] = middlewarebName;

          
      }
      
      arg = JSON.stringify(arg);
      if (window._envbridge) {
          res = _envbridge.call(method, arg)
      } else if (window._envwk || navigator.userAgent.indexOf("_envbridge") != -1) {
          res = prompt("_envbridge=" + method, arg);
      }

      return JSON.parse(res || "{}").data

  },
  register: function (name, fun, asyn) {
      var q = asyn ? window._envascfuc : window._envfuc
      if (!window._envInit) {
          window._envInit = true;
          setTimeout(function () {
            EPbridge.call("_envb.env_init");
          }, 0)
      }
      if (Object.prototype.toString.call(fun) === "object Function") {
          q._obs[name] = fun;
      } else {
          q[name] = fun
      }
  },
  registerAsyn: function (name, fun) {
      this.register(name, fun, true);
  },
  hasNativeMethod: function (name, type) {
      return this.call("_envb.env_hasNativeMethod", {name: name, type:type||"all"});
  },
}


! function() {
  if (window._envfuc) return;
  let ob = {
      _envfuc: {
          _obs: {}
      },
      _envascfuc: {
          _obs: {}
      },
      envbri: 0,
      envBridge: EPbridge,
      close: function() {
        EPbridge.call("_envb.closePage")
      },
      _handleMessageFromNative: function(info) {
          let arg = JSON.parse(info.data);
          let ret = {
              id: info.callbackId,
              complete: true
          }
          let f = this._envfuc[info.method];
          let af = this._envascfuc[info.method]
          let callSyn = function(f, ob) {
              ret.data = f.apply(ob, arg)
              EPbridge.call("_envb.env_returnValueWhenJSFinsh", ret)
          }
          let callAsyn = function(f, ob) {
              arg.push(function(data, complete) {
                  ret.data = data;
                  ret.complete = complete !== false;
                  EPbridge.call("_envb.env_returnValueWhenJSFinsh", ret)
              })
              f.apply(ob, arg)
          }
          if (f) {
              callSyn(f, this._envfuc);
          } else if (af) {
              callAsyn(af, this._envascfuc);
          } else {
              //with namespace
              let name = info.method.split(".");
              if (name.length < 2) return;
              let method = name.pop();
              let namespace = name.join(".")
              let obs = this._envfuc._obs;
              let ob = obs[namespace] || {};
              let m = ob[method];
              if (m && typeof m == "function") {
                  callSyn(m, ob);
                  return;
              }
              obs = this._envascfuc._obs;
              ob = obs[namespace] || {};
              m = ob[method];
              if (m && typeof m == "function") {
                  callAsyn(m, ob);
                  return;
              }
          }
      }
  }
  for (let attr in ob) {
      window[attr] = ob[attr]
  }
  EPbridge.register("env_hasJSMethodExist", function(method, tag) {
      let name = method.split(".")
      if (name.length < 2) {
          return !!(_envfuc[name] || _envascfuc[name])
      } else {
          // with namespace
          let method = name.pop()
          let namespace = name.join(".")
          let ob = _envfuc._obs[namespace] || _envascfuc._obs[namespace]
          return ob && !!ob[method]
      }
  })
}();

// export default EPbridge;
