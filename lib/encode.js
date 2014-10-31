// Transforms a unicode cp(codepoint) into a number
// which represents the correct binary encoding.
function encodeAscii(cp) {
    if (cp > 0x7F) { // cp > 0111 1111
        throw "Cannot encode codepoint: " + cp.hex() + ", which exceeds 0x10FFFF -- ASCII"
    }
    return cp;
}
function decodeAscii(bits) {
    return bits.mask(0, 7);
}
function encodeUTF8(cp) { 
    if (cp > 0x10FFFF) { 
        throw "Cannot encode codepoint: " + cp.hex() + ", which exceeds 0x10FFFF -- UTF8" 
    }

    var bits = cp.bits();
    if (bits.length <= 7) {
        return cp.mask(0,7);
    } else if (bits.length <= 11) { // 2 byte enc
        var header = 0xC000 + cp.crop(6, 12).shift('<', 8);
        var follow = 0x80   + cp.mask(0, 6);
        return header + follow;
    } else if (bits.length <= 16) {// 3 byte enc
        var header =  0xE00000 + cp.crop(12, 18).shift('<', 16);
        var follow1 = 0x8000   + cp.crop(6, 12).shift( '<', 8);
        var follow2 = 0x80     + cp.mask(0, 6);
        return header + follow1 + follow2;
    } else {
        var header  = 0xF0000000 + cp.crop(18, 22).shift('<', 24);
        var follow1 = 0x800000   + cp.crop(12, 18).shift('<', 16);
        var follow2 = 0x8000     + cp.crop(6, 12).shift( '<', 8);
        var follow3 = 0x80       + cp.mask(0, 6);
        return header + follow1 + follow2 + follow3;
    }
}

function decodeUTF8(num) {
    var length = num.bits().length / 8;
    if (length < 2) {
        return num.drop(7,8);
    } else if (length < 3) {
        return num.drop(13,16).drop(6,8);
    } else if (length < 4) {
        return num.drop(20, 24).drop(14, 16).drop(6, 8);
    } else if (length < 5) {
        return num.drop(27, 32).drop(22,24).drop(14, 16).drop(6, 8);
    }
}

function encodeUTF16(cp) {
    var lead, tail;
    if (cp > 0x10FFFF) {
        throw "Cannot encode codepoint: " + cp.hex() + ", which exceeds 0x10FFFF -- UTF16"
    } else if (cp <= 0xFFFF) {
        return cp;
    } else {
        cp -= 0x10000;
        lead = 0xD800 + cp.crop(10, 20);
        tail = 0xDC00 + cp.mask(0, 10);
        return lead.shift('<', 16) + tail;
    }
}

function decodeUTF16(num) {
    var surrogate = num > 0xFFFF;
    var first, second, lead, tail;
    // surrogate pair
    if (surrogate) {
        lead = 0xD800;
        tail = 0xDC00;
        // grab first part - lead surrogate start
        first = num.crop(16,32) - lead; 
        // grab second part - tail surrogate start
        second = num.mask(0, 16) - tail;
        return first.shift('<', 10) + second + 0x10000;
    } else {
        return num;
    }
}

function encodeUTF32(cp) {
    if (cp > 0x10FFFF) {
        throw "Cannot encode codepoint: " + cp.hex() + ", which exceeds 0x10FFFF -- UTF32"
    }
    return cp;
}

function decodeUTF32(bits) {
    return bits;
}

String.fromCodePoint = function(cp, enc) {
    var encoding = enc || "utf-16";
    var result = "";
    var bits;

    if (encoding === "ascii") {
        bits = encodeAscii(cp);
    } else if (encoding === "utf-8") {
        bits = encodeUTF8(cp);
    } else if (encoding === "utf-16") {
        bits = encodeUTF16(cp);
    } else if (encoding === "utf-32") {
        bits = encodeUTF32(cp);
    } else {
        throw "Encoding: " + encoding + " not supported"
    }

    var lead, tail;
    if (encoding === "utf-16") {
        if (bits > 0xFFFF)  {
            // surrogate pair
            lead = bits.crop(16, 32);
            tail = bits.crop(0, 16);
            return String.fromCharCode(lead) + String.fromCharCode(tail);
        } else {
            return String.fromCharCode(bits); 
        }
    } else {
        // Since JS strings are Utf-16 encoded
        // all other encodings are just packed
        // by byte in JS strings
        bits.toBytes().forEach(function(byt) {
            result += String.fromCharCode(byt);
        });
    }

    return result;
}

function encode(cp, enc) {
    switch (enc) {
        case "ascii":
            return encodeAscii(cp);
        break;
        case "utf8":
            return encodeUTF8(cp);
        break;
        case "utf16":
            return encodeUTF16(cp);
        break;
        case "utf32":
            return encodeUTF32(cp);
        break;
    }
}

function decode(bits, enc) {
    switch (enc) {
        case "ascii":
            return decodeAscii(cp);
        break;
        case "utf8":
            return decodeUTF8(cp);
        break;
        case "utf16":
            return decodeUTF16(cp);
        break;
        case "utf32":
            return decodeUTF32(cp);
        break;
    }
}

module.exports = {
     encode: encode
   , decode: decode
}


//function utf16ToCodePoints() {}
//function codePointAt(index, string, enc) {
//    var encoding = enc || "utf-16";
//    var cps = utf16ToCodePoints(string)[index];    
//    for(var i = 0, len = string.length; i < len; i++) {
//        cps.push(string.charCodeAt(i));
//    }
//
//    
//    if (encoding === "utf-16") {
//        return 
//
//
//    } else if (cps.length > 0) {
//        bits = cps.reduce(function(old, next, i) {
//            return old + next.shift('<', 8 * i);
//        });
//    } else {
//        throw "String does not contain a codepoint";
//    }
//        
//        // join bytes into bits
//        // decode bits
//        // return codepoint
//        bits = encodeUTF8(cp);
//    } else if (encoding === "utf-16") {
//        bits = encodeUTF16(cp);
//    } else if (encoding === "utf-32") {
//        bits = encodeUTF32(cp);
//    } else {
//        throw "Encoding: " + encoding + " not supported"
//    }
//}
//
//
//    var place = 0; // a separate counter which treats surrogates as 1 index
//    var cur, cp, lead, part;
//        for(var i = 0, len = cps.length; i < len && i <= index; i++) {
//            if (i = place === 
//            cp = cps[i];
//            if (cp < 0xD800 || cp > 0xFFFF) {
//               place++;
//               continue;
//            }
//            if (cp >= 0xD800 && cp <= 0xDBFF) {
//                // surrogate pair
//                leadPart = temp;
//                if (cps[i + 1];
//
//
//            } e
//        }
//        cps.map(function(cp, i) {
//            return 
//        });

