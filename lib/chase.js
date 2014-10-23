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

    //$('#amount').keydown(function () {
    //    console.log('val', $(this).val());
    //    slider.slider('value', $(this).val());
    //});

    set_slider_val($("#slider").slider("value"));
});
