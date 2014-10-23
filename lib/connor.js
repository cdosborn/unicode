var mutateTable = function(num) {
    var cpElem    = $("#cp-data")
    var asciiElem = $("#ascii-data")
    var utf8Elem  = $("#utf8-data")
    var utf16Elem = $("#utf16-data")
    var utf32Elem = $("#utf32-data")

    console.log("elem");
    console.log(cpElem);
    var json = makeJson(num);
    console.log('json', json);
    var cpBitStr    = json.cp.bin;
    var asciiBitStr = json.ascii.bin;
    console.log('ascii', asciiBitStr);
    var utf8BitStr  = json.utf8.bin;
    var utf16BitStr = json.utf16.bin;
    var utf32BitStr = json.utf32.bin;

//  cpSpan.innerHTML = cpBitStr;
    cpElem.html("<span>" + cpBitStr + "</span>");
    
    String.prototype.contains = function (val) {
        return this.indexOf(val) != -1;
    };

    console.log('first', asciiBitStr);
    console.log(asciiBitStr.contains);
    if(!asciiBitStr.contains("-")) {
        asciiElem.html("<span>" + asciiBitStr + "</span>")
    } else {
        asciiElem.html("<span>-</span>");
    }

    var len8 = utf8BitStr.length;
    var html8 = "";
    if(len8 < 9) {
        utf8Elem.html("0<span>" + utf8BitStr + "</span>");
    }

    utf8Elem.html("<span>" + utf8BitStr + "</span>")
    utf16Elem.html("<span>" + utf16BitStr + "</span>")
    utf32Elem.html("<span>" + utf32BitStr + "</span>")
}
