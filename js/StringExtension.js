String.prototype.returnEssential = function() {
	return this.replace(" ", "").replace("$", "");
}

String.prototype.adjustTab = function() {
	var pattern = /[\t]+/g;
	var tabStripped = this.replace(pattern, " ");
	if (tabStripped.charAt(0) == " ") {
		return tabStripped.substring(1);
	}
	return tabStripped;
}
String.prototype.append = function(_separator, _stringToAppend) {
	if (this.length == 0) {
		this.value = _stringToAppend;
	} 
	else {
		this.value += _separator + _stringToAppend;
	}
}
