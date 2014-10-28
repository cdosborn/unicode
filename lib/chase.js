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
    //$("#cp-data").html(cp.toString(2));
    mutateTable(cp);
    $('#glyph').html(this.utf8.ucs2encode([cp]));
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
        var cp = base_to_dec($(this).val());
        cp = Math.max(0, Math.min(cp, MAX_CP));
        var slider_val = cp_to_slider_val(cp);
        slider.slider('value', slider_val);
        set_cp(cp);
    });

    $('#input-base-dropdown').change(function () {
        set_cp_base($(this).val());
    });

    set_slider_val($("#slider").slider("value"));
});
