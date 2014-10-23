var numeral = { hex: "\\x00ff", bin: "00000000" }
var json = { ascii : numeral
           , utf8  : numeral
           , utf16 : numeral
           , utf32 : numeral
           , glyph : "a" }

var toggleInputField = function() { console.log("toggled") };
var json = makeJson(5);

var cp = 97;
var set_cp = function(val) {
    var cp = Math.floor(Math.pow(2, val/1000));
    $("#amount").val(cp);
    $('#glyph').html(this.utf8.ucs2encode([cp]));
};

var set_cp_base = function(val) {
    var cp = Math.floor(Math.pow(2, val/1000));
    $("#amount").val(cp);
    $('#glyph').html(this.utf8.ucs2encode([cp]));
};

var log2 = function(val) {
    return Math.log(val) / Math.LN2;
};
var cp_to_slider_val = function(cp) {
    return log2(cp) * 1000;
};

$(function() {
    var slider = $("#slider");
    slider.slider({
        value:cp_to_slider_val(cp),
        min: -1,
        max: 21000, // maximum code point is 0x10ffff
        slide: function( event, ui ) {
            set_cp(ui.value);
        }
    });


    $('#amount').keyup(function () {
        var slider_val = cp_to_slider_val($(this).val());
        slider.slider('value', slider_val);
        set_cp(slider_val);
    });

    $('#input-base-dropdown').change(function () {
        console.log($(this).val());
    });

    set_cp($("#slider").slider("value"));
});
