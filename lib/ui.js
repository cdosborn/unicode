var RESOLUTION_MULTIPLIER = 100000;
var MAX_CP = 0x10ffff; // ((0xDFFF - 0xDC00 + 1) * (0xDBFF - 0xD800 + 1) + 0xffff).toString(16) = 0x10ffff
var cp = 97;
var cp_base = 'dec';
var cp_base_number = {'dec': 10, 'bin': 2, 'hex': 16};
var set_slider_val = function(val) {
    set_cp(Math.floor(Math.pow(2, (val)/RESOLUTION_MULTIPLIER)) - 1);
};
var cp_to_slider_val = function(cp) { 
    return log2(cp) * RESOLUTION_MULTIPLIER; 
}; 
var set_cp = function(val) { 
    if (isNaN(val)) { 
        return; 
    } 
    cp = val; 
    cp = Math.max(0, Math.min(cp, MAX_CP)); 
    var input_val = cp.toString(cp_base_number[cp_base]); 
    $("#amount").val(input_val); 
    updateTable(cp); 
}; 
var base_to_dec = function(val) { 
    var ret = parseInt(val, cp_base_number[cp_base]); 
    return ret; 
}; 
var set_cp_base = function(base) { 
    var cp = base_to_dec($('#amount').val()); 
    cp_base = base; 
    set_cp(cp);
};
var log2 = function(val) { 
    return Math.log(val) / Math.LN2; 
}; 
$(function() { 
    var slider = $("#slider"); 
    slider.slider({ 
        value:cp_to_slider_val(cp), 
        min: 0,
          
        // This max comes about because the maximum code point is MAX_CP. We want to make a
        // logarithmic scale, where each value is 2^<slider-val>. We need to find a <slider-val>
        // that is just over MAX_CP.
        // We multiply to increase the slider resolution, as the slider only does integer values.

        max: Math.ceil(log2(MAX_CP) * RESOLUTION_MULTIPLIER), // maximum code point is MAX_CP 
        slide: function( event, ui ) { 
            set_slider_val(ui.value); 
        } 
    }); 
    $('#amount').change(function () { 
        var cp = base_to_dec($(this).val()); cp 
        = Math.max(0, Math.min(cp, MAX_CP)); var 
        slider_val = cp_to_slider_val(cp); slider
        .slider('value', slider_val); set_cp
        (cp); 
    }); 
    $('#input-base-dropdown').change(function () { 
        set_cp_base($(this).val()); 
    }); 
    set_slider_val($("#slider").slider("value")); 
});

function updateTable(num) {
    var encodings = ["cp", "ascii", "utf8", "utf16", "utf32"];

    var json = encodeAll(num);

    var elem, content;
    encodings.forEach(function(name, index) {
        elem = $("#" + name + "-data");
        content = pretty(json, name);
        elem.html("<span class=\"container\">" + content + "</span>");
    });

    $('#glyph').html(json.glyph);
}

var maybe = function(fun, args, otherwise) {
    try {
        return fun.apply(null, args);
    } catch (err) {
        return otherwise;
    }
}

var encodeAll = function(cp) {
    var encodings = ["ascii", "utf8", "utf16", "utf32"];
    var json = {};
    
    encodings.forEach(function(name) {
        json[name] = maybe(encode, [cp, name], -1);
    });

    json.cp = cp;
    json.glyph = maybe(String.fromCodePoint, [cp, "utf-16"], ":(");
    return json;
};

function pretty(json, encoding) {

    var bitstring = json[encoding].bits();
    var numOfColorBits = json.cp.bits().length;
    var result = "";
    var padding;

    switch (encoding) {
        case "cp":
            result = highlight(bitstring, numOfColorBits);
        break;
        case "ascii":
            if (numOfColorBits > 7) {
                result = "-"
            } else {
                padded = padZeros(bitstring, 8);
                result = highlight(padded, numOfColorBits);
            }

        break;
        case "utf8":
            padded = padZeros(bitstring, 8);
            result = highlightUtf8(padded, numOfColorBits);
        break;
        case "utf16":
            padded = padZeros(bitstring, 16);
            if (bitstring.length > 16) {
                result = highlightEnc(padded, 0);
            } else {
                result = highlightEnc(padded, numOfColorBits);
            }
        break;
        case "utf32":
            padded = padZeros(bitstring, 32);
            result = highlightEnc(padded, numOfColorBits);
        break;
    }

    return result;
}

// pad num with targetLength 0's
var padZeros = function(str, targetLength) {
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
