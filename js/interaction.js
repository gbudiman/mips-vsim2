function button_compile_click(_textarea_assembly, _textarea_binary) {
	mips = new MIPSInstruction(_textarea_assembly, _textarea_binary);
	mips.compile();
}

function fullAssocChange(_object, _target) {
	if (_object.checked == true) {
		$('#' + _target).attr("disabled", true);
	}
	else {
		$('#' + _target).attr("disabled", false);
	}
	computeCache();
}

function computeCache(){
	var cacheSet = $('#icacheSet').val();
	var cacheEntries = $('#icacheEntries').val();
	var indexBits = ln(cacheEntries);
	var blockSize = $('#icacheWords').val();
	var wordBits = ln(blockSize);
	var byteBits = 2;
	if ($('#icacheFullAssoc').is(":checked")) {
		var lruBits = indexBits;
		var tagBits = 32 - Math.ceil(wordBits) - byteBits;
		cacheSet = 1;
	}
	else {
		var lruBits = Math.ceil(ln(cacheSet));
		var tagBits = 32 - Math.ceil(indexBits) - Math.ceil(wordBits) - byteBits;
	}
	var entrySize = blockSize * 32 + tagBits + 1 + lruBits;
	var totalSize = entrySize * cacheEntries;
	var actualSize = 4 * blockSize * cacheEntries;
	
	if (Math.ceil(wordBits) != wordBits) {
		$('#icacheWords').val(Math.pow(2, Math.ceil(wordBits)));
		computeCache();
		return;
	}
	
	if (Math.ceil(indexBits) != indexBits) {
		$('#icacheEntries').val(Math.pow(2, Math.ceil(indexBits)));
		computeCache();
		return;
	}
	
	$('#icache_tag').val(tagBits);
	if ($('#icacheFullAssoc').is(":checked")) {
		$('#icache_index').val(0);
	}
	else {
		$('#icache_index').val(Math.ceil(indexBits));
	}
	$('#icache_word').val(Math.ceil(wordBits));
	$('#icacheDiagram_tag').text(tagBits + " bits");
	$('#icacheDiagram_lru').text(lruBits + " bits");
	$('#icacheDiagram_data').text($('#icacheWords').val() + " * 32 bits = " + blockSize * 32 + " bits");
	$('#icacheDiagram_size').text(entrySize + " bits");
	$('#icacheDiagram_total').text("Total cache size for this set: " + cacheEntries + " * " + entrySize + " bits = " + totalSize + " bits");
	if (actualSize > 1000) {
		$('#icacheDiagram_usableSize').text(actualSize / 1024 + " KB usable region");
		$('#icacheDiagram_overview').text(cacheSet + " * " + totalSize + " = " + cacheSet * totalSize + " bits ("
									+ cacheSet * actualSize / 1024 + " KB usable region) for all set");	
	}
	else {
		$('#icacheDiagram_usableSize').text(actualSize + " B usable region");
		$('#icacheDiagram_overview').text(cacheSet + " * " + totalSize + " = " + cacheSet * totalSize + " bits ("
									+ cacheSet * actualSize + " B usable region) for all set");	
	}
	
								
	var cacheSet = $('#dcacheSet').val();
	var cacheEntries = $('#dcacheEntries').val();
	var indexBits = ln(cacheEntries);
	var blockSize = $('#dcacheWords').val();
	var wordBits = ln(blockSize);
	var byteBits = 2;
	var dirtyBits = 1;
	if ($('#dcacheFullAssoc').is(":checked")) {
		var lruBits = indexBits;
		var tagBits = 32 - Math.ceil(wordBits) - byteBits;
		cacheSet = 1;
	}
	else {
		var lruBits = Math.ceil(ln(cacheSet));
		var tagBits = 32 - Math.ceil(indexBits) - Math.ceil(wordBits) - byteBits;
	}
	var entrySize = blockSize * 32 + tagBits + 1 + dirtyBits + lruBits;
	var totalSize = entrySize * cacheEntries;
	var actualSize = 4 * blockSize * cacheEntries;
	
	if (Math.ceil(wordBits) != wordBits) {
		$('#dcacheWords').val(Math.pow(2, Math.ceil(wordBits)));
		computeCache();
		return;
	}
	
	if (Math.ceil(indexBits) != indexBits) {
		$('#dcacheEntries').val(Math.pow(2, Math.ceil(indexBits)));
		computeCache();
		return;
	}
	
	$('#dcache_tag').val(tagBits);
	if ($('#dcacheFullAssoc').is(":checked")) {
		$('#dcache_index').val(0);
	}
	else {
		$('#dcache_index').val(Math.ceil(indexBits));
	}
	$('#dcache_word').val(Math.ceil(wordBits));
	$('#dcacheDiagram_tag').text(tagBits + " bits");
	$('#dcacheDiagram_lru').text(lruBits + " bits");
	$('#dcacheDiagram_data').text($('#dcacheWords').val() + " * 32 bits = " + blockSize * 32 + " bits");
	$('#dcacheDiagram_size').text(entrySize + " bits");
	$('#dcacheDiagram_total').text("Total cache size for this set: " + cacheEntries + " * " + entrySize + " bits = " + totalSize + " bits");
	if (actualSize > 1000) {
		$('#dcacheDiagram_usableSize').text(actualSize / 1024 + " KB usable region");
		$('#dcacheDiagram_overview').text(cacheSet + " * " + totalSize + " = " + cacheSet * totalSize + " bits ("
									+ cacheSet * actualSize / 1024 + " KB usable region) for all set");	
	}
	else {
		$('#dcacheDiagram_usableSize').text(actualSize + " B usable region");
		$('#dcacheDiagram_overview').text(cacheSet + " * " + totalSize + " = " + cacheSet * totalSize + " bits ("
									+ cacheSet * actualSize + " B usable region) for all set");	
	}
}

function button_simulate_click() {
	vis_reset();
	$("li #visWindow").click();
}

function vis_clock() {
	core0.clock();
}

function vis_reset() {
	core0 = new core();
}
