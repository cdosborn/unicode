/*! http://mths.be/utf8js v2.0.0 by @mathias */
;(function(root) {

// Detect free variables `exports`
var freeExports = typeof exports == 'object' && exports;

// Detect free variable `module`
var freeModule = typeof module == 'object' && module &&
module.exports == freeExports && module;

// Detect free variable `global`, from Node.js or Browserified code,
// and use it as `root`
var freeGlobal = typeof global == 'object' && global;
if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
root = freeGlobal;
}

/*--------------------------------------------------------------------------*/

    var stringFromCharCode = String.fromCharCode;

// Taken from http://mths.be/punycode
// Transforms UTF-16 surrogate pairs into astral code points, returned as 
// an array of cps.
function ucs2decode(string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    var value;
    var extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            } else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        } else {
            output.push(value);
        }
    }
    return output;
}

// Taken from http://mths.be/punycode
// Codepoints to Surrogate pairs, transform an array of codepoints, 
// into a UTF-16 string
function ucs2encode(array) { 
    var length = array.length; 
    var index = -1; 
    var value; 
    var output = ''; 
    while (++index < length) { 
        value = array[index]; 
        if (value > 0xFFFF) { 
            value -= 0x10000; 
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800); 
            value = 0xDC00 | value & 0x3FF; 
        } 
        output += stringFromCharCode(value); 
    } 
    return output; 
}

function utf16encode(arr) {
    var result = "";
    arr.forEach(function(cp) {
        var lead, tail;
        if (cp <= 0xFFFF) {
            result +=  String.fromCharCode(cp);
        } else {
            cp -= 0x10000;
            lead = 0xD800 + (cp >> 10)
            tail = 0xDC00 + (cp & 0x03FF)
            result += String.fromCharCode(lead) + String.fromCharCode(tail);
        }
    });

    return result;
}

function utf16decode(string) {
    var len = string.length;
    var result = [];
    var first, second;
    for (var i = 0; i < len; i++) {
        var cp = string.charCodeAt(i);

        // surrogate pair
        if (cp <= 0xDFFF && cp >= 0xD800) {
            // grab first part from lead
            first = (cp - 0xD800) << 10
            // grab second part from tail
            cp = string.charCodeAt(++i);
            second = cp - 0xDC00;

            cp = first + second + 0x10000;
        }

        result.push(cp);
    }
    return result;
}
/*--------------------------------------------------------------------------*/

function createByte(codePoint, shift) {
return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}

function encodeCodePoint(codePoint) {
    if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
        return stringFromCharCode(codePoint);
    }
    var symbol = '';
    if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
        symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    } else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
        symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
        symbol += createByte(codePoint, 6);
    } else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
        symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
        symbol += createByte(codePoint, 12);
        symbol += createByte(codePoint, 6);
    }
    symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    return symbol;
}

function utf8encode(string) { 
//  var codePoints = ucs2decode(string); 
    var codePoints = utf16decode(string); 
    var length = codePoints.length; 
    var index = -1; 
    var codePoint; 
    var byteString = ''; 
    while (++index < length) { 
        codePoint = codePoints[index]; 
        byteString += encodeCodePoint(codePoint); 
    } 
    return byteString;
}

var UTF16toUTF8 = function(string) {
    var cps = utf16decode(string);
    var result = "";
    cps.forEach(function(cp) {
//      result += utf8_encode(cp);
        result += encodeCodePoint(cp);
    });
    return result;
}

////writes a utf8 string disguised as a utf16 string
////each codepoint
//function utf8_encode(codepoint) {
//    var bytes = codepoint.toString(2).length / 8 | 0;
//    if (bytes === 1) {
//
//    }
//    bs.push(bs.fromString("1110",bits)
//    var bs = ByteString(32)
//    cpBS = new ByteStream;
//
//    cpBS.push(BS.fromInt("1110" + cpBS.sub(9,12)));
//    bs.toString(String.fromCharCode);
//    bs.wrap(100);
//    bs.sub(5,10);
//    bs.shift(5,10);
//    cpBS = BitStream.fromBits(  "xxxxxxxxxxxxxxxxxxxx");
//                    .shift(10)//"0000000000xxxxxxxxxx");
//                    .or(        "11111111111111111111");
//                    .xor(       "11111111111111111111");
//}

/*--------------------------------------------------------------------------*/

function readContinuationByte() {
if (byteIndex >= byteCount) {
throw Error('Invalid byte index');
}

var continuationByte = byteArray[byteIndex] & 0xFF;
byteIndex++;

if ((continuationByte & 0xC0) == 0x80) {
return continuationByte & 0x3F;
}

// If we end up here, itâ€™s not a continuation byte
throw Error('Invalid continuation byte');
}

function decodeSymbol() {
    var byte1;
    var byte2;
    var byte3;
    var byte4;
    var codePoint;

    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }

    if (byteIndex == byteCount) {
        return false;
    }

    // Read first byte
    byte1 = byteArray[byteIndex] & 0xFF;
    byteIndex++;

    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }

    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        var byte2 = readContinuationByte();
        codePoint = ((byte1 & 0x1F) << 6) | byte2;
        if (codePoint >= 0x80) {
            return codePoint;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (codePoint >= 0x0800) {
            return codePoint;
        } else {
            throw Error('Invalid continuation byte');
        }
    }

    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
        (byte3 << 0x06) | byte4;
        if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
        return codePoint;
        }
    }

    throw Error('Invalid UTF-8 detected');
}

var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString) {
    byteArray = utf16decode(byteString);
    byteCount = byteArray.length;
    byteIndex = 0;
    var codePoints = [];
    var tmp;
    while ((tmp = decodeSymbol()) !== false) {
        codePoints.push(tmp);
    }
        return codePoints;
}

/*--------------------------------------------------------------------------*/

var utf8 = {
'version': '2.0.0',
'encode': utf8encode,
'decode': utf8decode,
'encodeCodePoint': encodeCodePoint,
'ucs2decode': ucs2decode,
'ucs2encode': ucs2encode,
'utf16encode': utf16encode,
'utf16decode': utf16decode
};

// Some AMD build optimizers, like r.js, check for specific condition patterns
// like the following:
if (
typeof define == 'function' &&
typeof define.amd == 'object' &&
define.amd
) {
define(function() {
return utf8;
});
}	else if (freeExports && !freeExports.nodeType) {
if (freeModule) { // in Node.js or RingoJS v0.8.0+
freeModule.exports = utf8;
} else { // in Narwhal or RingoJS v0.7.0-
var object = {};
var hasOwnProperty = object.hasOwnProperty;
for (var key in utf8) {
hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
}
}
} else { // in Rhino or a web browser
root.utf8 = utf8;
}

}(this));

var utf8ToDig = function(string) {
    var length = string.length;
    var index = -1;
    var result = "";
    var hex;
    while (++index < length) {
        hex = string.charCodeAt(index).toString(16).toUpperCase();
        result += ('00' + hex).slice(-2);
    }
    return parseInt(result, 16);
}

function cpToUtf8(cp) {
    var bytes = utf8.encodeCodePoint(cp).split("");
    var len = bytes.length;
    var msb, val;
    var sum = 0;
    bytes.forEach(function(b, i) {
        msb = len - i - 1;
        val = b.charCodeAt(0);
        if (msb === 3) {
            sum += val * Math.pow(2, 24)
        } else {
            sum += val << (msb * 8);
        }
    });
    return sum;
}

if (typeof module == "object" && module.exports) {
    module.exports.toDigit = utf8ToDig;
}

var utf16ToDig = function(string) {
    var length = string.length;
    var index = -1;
    var result = "";
    var hex;
    while (++index < length) {
        hex = string.charCodeAt(index).toString(16).toUpperCase();
        result += ('0000' + hex).slice(-4);
    }
    return parseInt(result, 16);
}

var cpToAscii = function(cp) {
    if (cp > 0x7f) {
        return -1;
    }
    return cp;
};

var pad = function(str, targetLength) {
    var diff;
    var temp;
    var result = str;
    var len = str.length;
    if (len < targetLength) {
        diff = targetLength - len;
        temp = "";
        for (var i = 0 ; i < diff; i++) {
            temp += "0"
        }
        result = temp.concat(result);
    }

    return result;
}


var that = this;
var makeJson = function(cp) {
    var char = that.utf8.ucs2encode([cp]);
    var ascii = cpToAscii(cp);
//  var utf8 = utf8ToDig(that.utf8.encode(char));
    var utf8 = cpToUtf8(cp);
    var utf16 = utf16ToDig(that.utf8.ucs2encode([cp]));
    var utf32 = cp;
    var final = {
            'cp'   : {'hex': cp.toString(16),     'bin': cp.toString(2)},
            'ascii': {'hex': ascii.toString(16),  'bin': pad(ascii.toString(2), 8)},
            'utf8':  {'hex': utf8.toString(16) ,  'bin': pad(utf8.toString(2),  8)},
            'utf16':  {'hex': utf16.toString(16), 'bin': pad(utf16.toString(2), 16)},
            'utf32':  {'hex': utf32.toString(16), 'bin': pad(utf32.toString(2), 32)},
            'glyph': char};

    return final;
};

