Number.prototype.bits = function() {
    return this.toString(2);
}

Number.prototype.hex = function() {
    return this.toString(16);
}

Number.prototype.crop = function(start, end) {
    return this.mask(start, end)
               .shift('>', start);
}

Number.prototype.shift = function(symbol, many) {
    var symbolRight = symbol === '>';
    var right = (many < 0 ? !symbolRight : symbolRight);
    var times = Math.abs(many);
    if (right) {
        return Math.floor(this / Math.pow(2, times));
    } else {
        return this * Math.pow(2, times);
    } 
}

Number.prototype.drop = function(start, end) {
    var range = end - start;
    var last = this.bits().length;
    return this.mask(end, last).shift('>', range) + this.mask(0, start);
}

Number.prototype.even = function() {
    return this % 2 === 0;
}
Number.prototype.odd = function() {
    return this % 2 !== 0;
}

Number.prototype.mask = function(start, end) {
    var length = this.bits().length;
    var changed = this.shift('>', start);
    var result = 0;
    for (var i = start; i < end && changed > 0; i++) {

        if (changed.odd()){
            result += Math.pow(2, i);
        }

        changed = changed.shift('>', 1);
    }
    return result;
}

Number.prototype.toBytes = function() {
    var arr = [];
    var changed = this;
    var byt;
    for(var i = 0; changed > 0; i++) {
        byt = changed.crop(0, 8);
        arr[i] = byt;
        changed = changed.shift('>', 8);
    }
    return arr;
}
