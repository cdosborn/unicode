var numeral = { hex: "\\x00ff", bin: "00000000" }
var json = { ascii : numeral
           , utf8  : numeral
           , utf16 : numeral
           , utf32 : numeral
           , glyph : "a" }

var toggleInputField = function() { console.log("toggled") };
var json = makeJson(5);

var set_slider_val = function(val) {
    var cp = Math.floor(Math.pow(2, val/1000));
    $("#amount").val(cp);
    $('#glyph').html(this.utf8.ucs2encode([cp]));
};

$(function() {


    var slider = $("#slider");
    slider.slider({
      value:6700,
      min: -1,
      max: 21000, // maximum code point is 0x10ffff
      slide: function( event, ui ) {
        set_slider_val(ui.value);
      }
    });

    var log2 = function(val) {
        return Math.log(val) / Math.LN2;
    };
    var cp_to_slider_val = function(cp) {
        return log2(cp) * 1000;
    };

    $('#amount').keyup(function () {
        var slider_val = cp_to_slider_val($(this).val());
        slider.slider('value', slider_val);
        set_slider_val(slider_val);
    });

    set_slider_val($("#slider").slider("value"));
});
