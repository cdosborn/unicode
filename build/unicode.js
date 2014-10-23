Elm.Unicode = Elm.Unicode || {};
Elm.Unicode.make = function (_elm) {
   "use strict";
   _elm.Unicode = _elm.Unicode || {};
   if (_elm.Unicode.values)
   return _elm.Unicode.values;
   var _N = Elm.Native,
   _U = _N.Utils.make(_elm),
   _L = _N.List.make(_elm),
   _A = _N.Array.make(_elm),
   _E = _N.Error.make(_elm),
   $moduleName = "Unicode";
   var Basics = Elm.Basics.make(_elm);
   var Color = Elm.Color.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Collage = Elm.Graphics.Collage.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Element = Elm.Graphics.Element.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Elm.Graphics.Input.make(_elm);
   var Graphics = Graphics || {};
   Graphics.Input = Graphics.Input || {};
   Graphics.Input.Field = Elm.Graphics.Input.Field.make(_elm);
   var Keyboard = Elm.Keyboard.make(_elm);
   var List = Elm.List.make(_elm);
   var Maybe = Elm.Maybe.make(_elm);
   var Native = Native || {};
   Native.Json = Elm.Native.Json.make(_elm);
   var Native = Native || {};
   Native.Ports = Elm.Native.Ports.make(_elm);
   var Signal = Elm.Signal.make(_elm);
   var String = Elm.String.make(_elm);
   var Text = Elm.Text.make(_elm);
   var Time = Elm.Time.make(_elm);
   var _op = {};
   var render = F2(function (f,
   json) {
      return A2(Graphics.Element.flow,
      Graphics.Element.down,
      _L.fromArray([f
                   ,Text.asText(json)]));
   });
   var messageIn = Native.Ports.portIn("messageIn",
   Native.Ports.incomingSignal(function (v) {
      return typeof v === "object" && "ascii" in v && "utf8" in v && "utf16" in v && "utf32" in v && "glyph" in v ? {_: {}
                                                                                                                    ,ascii: typeof v.ascii === "object" && "hex" in v.ascii && "bin" in v.ascii ? {_: {}
                                                                                                                                                                                                  ,hex: typeof v.ascii.hex === "string" || typeof v.ascii.hex === "object" && v.ascii.hex instanceof String ? v.ascii.hex : _E.raise("invalid input, expecting JSString but got " + v.ascii.hex)
                                                                                                                                                                                                  ,bin: typeof v.ascii.bin === "string" || typeof v.ascii.bin === "object" && v.ascii.bin instanceof String ? v.ascii.bin : _E.raise("invalid input, expecting JSString but got " + v.ascii.bin)} : _E.raise("invalid input, expecting JSObject [\"hex\",\"bin\"] but got " + v.ascii)
                                                                                                                    ,utf8: typeof v.utf8 === "object" && "hex" in v.utf8 && "bin" in v.utf8 ? {_: {}
                                                                                                                                                                                              ,hex: typeof v.utf8.hex === "string" || typeof v.utf8.hex === "object" && v.utf8.hex instanceof String ? v.utf8.hex : _E.raise("invalid input, expecting JSString but got " + v.utf8.hex)
                                                                                                                                                                                              ,bin: typeof v.utf8.bin === "string" || typeof v.utf8.bin === "object" && v.utf8.bin instanceof String ? v.utf8.bin : _E.raise("invalid input, expecting JSString but got " + v.utf8.bin)} : _E.raise("invalid input, expecting JSObject [\"hex\",\"bin\"] but got " + v.utf8)
                                                                                                                    ,utf16: typeof v.utf16 === "object" && "hex" in v.utf16 && "bin" in v.utf16 ? {_: {}
                                                                                                                                                                                                  ,hex: typeof v.utf16.hex === "string" || typeof v.utf16.hex === "object" && v.utf16.hex instanceof String ? v.utf16.hex : _E.raise("invalid input, expecting JSString but got " + v.utf16.hex)
                                                                                                                                                                                                  ,bin: typeof v.utf16.bin === "string" || typeof v.utf16.bin === "object" && v.utf16.bin instanceof String ? v.utf16.bin : _E.raise("invalid input, expecting JSString but got " + v.utf16.bin)} : _E.raise("invalid input, expecting JSObject [\"hex\",\"bin\"] but got " + v.utf16)
                                                                                                                    ,utf32: typeof v.utf32 === "object" && "hex" in v.utf32 && "bin" in v.utf32 ? {_: {}
                                                                                                                                                                                                  ,hex: typeof v.utf32.hex === "string" || typeof v.utf32.hex === "object" && v.utf32.hex instanceof String ? v.utf32.hex : _E.raise("invalid input, expecting JSString but got " + v.utf32.hex)
                                                                                                                                                                                                  ,bin: typeof v.utf32.bin === "string" || typeof v.utf32.bin === "object" && v.utf32.bin instanceof String ? v.utf32.bin : _E.raise("invalid input, expecting JSString but got " + v.utf32.bin)} : _E.raise("invalid input, expecting JSObject [\"hex\",\"bin\"] but got " + v.utf32)
                                                                                                                    ,glyph: typeof v.glyph === "string" || typeof v.glyph === "object" && v.glyph instanceof String ? v.glyph : _E.raise("invalid input, expecting JSString but got " + v.glyph)} : _E.raise("invalid input, expecting JSObject [\"ascii\",\"utf8\",\"utf16\",\"utf32\",\"glyph\"] but got " + v);
   }));
   var Encoding = F5(function (a,
   b,
   c,
   d,
   e) {
      return {_: {}
             ,ascii: a
             ,glyph: e
             ,utf16: c
             ,utf32: d
             ,utf8: b};
   });
   var Numeral = F2(function (a,
   b) {
      return {_: {},bin: b,hex: a};
   });
   var add = F2(function (str,x) {
      return function () {
         var _v0 = String.toInt(str);
         switch (_v0.ctor)
         {case "Just":
            return String.show(_v0._0 + x);
            case "Nothing": return str;}
         _E.Case($moduleName,
         "between lines 20 and 22");
      }();
   });
   var filterContent = F2(function (str,
   record) {
      return _U.replace([["string"
                         ,str]],
      record);
   });
   var leftOrRightArrows = A2(Signal._op["<~"],
   function (_) {
      return _.x;
   },
   Keyboard.arrows);
   var content = A2(Signal._op["<~"],
   function ($int) {
      return _U.replace([["string"
                         ,String.show($int)]],
      Graphics.Input.Field.noContent);
   },
   A3(Signal.foldp,
   F2(function (x,y) {
      return x + y;
   }),
   0,
   leftOrRightArrows));
   var inputCodePoint = Graphics.Input.input(Graphics.Input.Field.noContent);
   var contentString = A2(Signal._op["<~"],
   function (_) {
      return _.string;
   },
   inputCodePoint.signal);
   var codePointField = A2(Signal._op["<~"],
   A4(Graphics.Input.Field.field,
   Graphics.Input.Field.defaultStyle,
   inputCodePoint.handle,
   Basics.id,
   ""),
   inputCodePoint.signal);
   var main = A2(Signal._op["~"],
   A2(Signal._op["<~"],
   render,
   codePointField),
   messageIn);
   var messageOut = Native.Ports.portOut("messageOut",
   Native.Ports.outgoingSignal(function (v) {
      return v;
   }),
   A2(Signal._op["<~"],
   function (_) {
      return _.string;
   },
   inputCodePoint.signal));
   _elm.Unicode.values = {_op: _op
                         ,inputCodePoint: inputCodePoint
                         ,leftOrRightArrows: leftOrRightArrows
                         ,contentString: contentString
                         ,content: content
                         ,codePointField: codePointField
                         ,filterContent: filterContent
                         ,add: add
                         ,render: render
                         ,main: main
                         ,Numeral: Numeral
                         ,Encoding: Encoding};
   return _elm.Unicode.values;
};