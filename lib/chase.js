var cp = 97;
var cp_base = 'dec';
var cp_base_number = {'dec': 10, 'bin': 2, 'hex': 16};

var set_slider_val = function(val) {
    set_cp(Math.floor(Math.pow(2, (val)/1000)) - 1);
};

var cp_to_slider_val = function(cp) {
    return log2(cp) * 1000;
};

var set_cp = function(val) {
    if (isNaN(val)) {
        return;
    }
    cp = val;
    var input_val = cp.toString(cp_base_number[cp_base]);
    $("#amount").val(input_val);
    //$("#cp-data").html(cp.toString(2));
    mutateTable(cp);
    $('#glyph').html(this.utf8.ucs2encode([cp]));
};

var base_to_dec = function(val) {
    var ret = parseInt(val, cp_base_number[cp_base]);
    return ret;
};

var set_cp_base = function(base) {
    var dec = base_to_dec($('#amount').val());
    cp_base = base;
    set_cp(dec);
};

var log2 = function(val) {
    return Math.log(val) / Math.LN2;
};

$(function() {
    var slider = $("#slider");
    slider.slider({
        value:cp_to_slider_val(cp),
        min: 0,
        max: 21000, // maximum code point is 0x10ffff
        slide: function( event, ui ) {
            set_slider_val(ui.value);
        }
    });

    $('#amount').change(function () {
        var cp = base_to_dec($(this).val());
        var slider_val = cp_to_slider_val(cp);
        slider.slider('value', slider_val);
        set_cp(cp);
    });

    $('#input-base-dropdown').change(function () {
        set_cp_base($(this).val());
    });

    set_slider_val($("#slider").slider("value"));
});
