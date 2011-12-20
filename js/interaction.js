function button_compile_click(_textarea_assembly, _textarea_binary) {
	mips = new MIPSInstruction(_textarea_assembly, _textarea_binary);
	mips.compile();
}
