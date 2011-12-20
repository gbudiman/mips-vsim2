String.prototype.returnEssential = function() {
	return this.replace(" ", "").replace("$", "");
}

String.prototype.append = function(_separator, _stringToAppend) {
	if (this.length == 0) {
		this.value = _stringToAppend;
	} 
	else {
		this.value += _separator + _stringToAppend;
	}
}
