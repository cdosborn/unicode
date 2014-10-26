function mutateTable(num) {
    var cpElem    = $("#cp-data")
    var asciiElem = $("#ascii-data")
    var utf8Elem  = $("#utf8-data")
    var utf16Elem = $("#utf16-data")
    var utf32Elem = $("#utf32-data")

    var json = makeJson(num);
    
    cpElem.html(   "<span class=\"container\">" + pprint(json,    "cp") + "</span>");
    asciiElem.html("<span class=\"container\">" + pprint(json, "ascii") + "</span>")
    utf8Elem.html( "<span class=\"container\">" + pprint(json,  "utf8") + "</span>");
    utf16Elem.html("<span class=\"container\">" + pprint(json, "utf16") + "</span>");
    utf32Elem.html("<span class=\"container\">" + pprint(json, "utf32") + "</span>");

}

function pprint(json, encoding) {

    var bitstring = json[encoding].bin;
    var colorBits = json.cp.bin;
    var numOfColorBits = colorBits.length;
    var result = "";

    switch (encoding) {
        case "cp":
            result = highlight(bitstring, numOfColorBits);
        break;
        case "ascii":
            if (numOfColorBits > 7) {
                result = "-"
            } else {
                result = highlight(bitstring, numOfColorBits);
            }
        break;
        case "utf8":
            result = highlightUtf8(bitstring, numOfColorBits);
        break;
        case "utf16":
            if (bitstring.length > 16) {
                result = highlightEnc(bitstring, 0);
            } else {
                result = highlightEnc(bitstring, numOfColorBits);
            }
        break;
        case "utf32":
            result = highlightEnc(bitstring, numOfColorBits);
        break;
    }

    return result;
}

// split str into array of strings of 8 chars
function splitBy8(str) {
    var result = [];
    for(var i = 0, len = str.length; i < len; i+=8) {
        result.push(str.substring(i, i + 8));
    }
    return result
}

// join str[] into string separated by sep
// wrap string with colored span
function color(str) { 
    return "<span class=\"highlight\">" + str + "</span>"; 
}

function noColor(str) { 
    return "<span>" + str + "</span>"; 
}

// return a string with a colored subportion
function highlight(str, many) {
    var start = str.length - many;
    var end = str.length;
    
    return noColor(str.substring(0, start)) + color(str.substring(start, end));
}

function highlightEnc(str, colorLeft) {
    var words = splitBy8(str);

    // highlight all words minus the first
    var word;
    var len = words.length;
    for (var i = len - 1; i >= 0 && colorLeft > 0; i--) {
        colored = Math.min(8, colorLeft);
        word = words[i];
        words[i] = highlight(word, colored);
        colorLeft -= colored;
    }

    var space = "<span>&nbsp;&nbsp;</span>"

    return words.join(space);
}

function highlightUtf8(str, colorLeft) {
    var words = splitBy8(str);

    var word;
    var len = words.length;
    if (len == 1) {
        return highlight(str, colorLeft);
    }
    for (var i = len - 1; i >= 0 && colorLeft > 0; i--) {
        colored = Math.min(6, colorLeft);
        word = words[i];
        words[i] = highlight(word, colored);
        colorLeft -= colored;
    }

    var space = "<span>&nbsp;&nbsp;</span>"

    return words.join(space);
}
