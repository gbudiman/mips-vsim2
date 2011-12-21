Number.prototype.toHexString = function() {
	if (this === null) { return null; }
	if (isNaN(this)) { return this; }
	var num;
	var hex;
	if (this < 0) {
		num = 0xFFFFFFFF + this + 1;
	}
	else {
		num = this;
	}
	hex = num.toString(16).toUpperCase();
	return "0x" + ("00000000".substr(0, 8 - hex.length) + hex);
}
