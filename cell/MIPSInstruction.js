function MIPSInstruction() {
	this.assembly = new Array();
	this.binary = new Array();
	this.labelName = new Array();
	this.labelAddress = new Array();
	this.programAddress = 0x0;
}

function MIPSInstruction(_assemblyAnchor, _binaryAnchor) {
	this.assembly = $('textarea#textarea_assembly').val().split('\n');
	this.labelName = new Array();
	this.labelAddress = new Array();
	this.binary = new Array();
	this.programAddress = 0x0;
}

MIPSInstruction.prototype.compile = function() {
	var iLine;
	for (iLine = 0; iLine < this.assembly.length; iLine++) {
		this.binary[iLine] = this.MIPSParse(this.assembly[iLine].toLowerCase());
	}
	$('textarea#textarea_binary').val(this.binary.join("\n"));
}

MIPSInstruction.prototype.MIPSParse = function(_code) {
	var codeArray = _code.split(' ');
	var codeArgument = new String();
	var codeSeparator = ",";
	for (i = 1; i < codeArray.length; i++) {
		codeArgument = codeArgument.concat(codeArray[i].returnEssential());
	}
	var argArray = codeArgument.split(codeSeparator);
	var binaryCode;
	switch (codeArray[0].returnEssential()) {
		// 3-address code R-type
		case "addu":
			binaryCode = MIPS_3address(0x21, argArray[0], argArray[1], argArray[2]); 
			break;
		case "and":
			binaryCode = MIPS_3address(0x24, argArray[0], argArray[1], argArray[2]); 
			break;
		case "nor":
			binaryCode = MIPS_3address(0x27, argArray[0], argArray[1], argArray[2]); 
			break;
		case "or":
			binaryCode = MIPS_3address(0x25, argArray[0], argArray[1], argArray[2]); 
			break;
		case "slt":
			binaryCode = MIPS_3address(0x2A, argArray[0], argArray[1], argArray[2]); 
			break;
		case "sltu":
			binaryCode = MIPS_3address(0x2B, argArray[0], argArray[1], argArray[2]); 
			break;
		case "sll":
			binaryCode = MIPS_3adrShift(0x0, argArray[0], argArray[1], argArray[2]);
			break;
		case "srl":
			binaryCode = MIPS_3adrShift(0x2, argArray[0], argArray[1], argArray[2]);
			break;
		case "subu":
			binaryCode = MIPS_3address(0x23, argArray[0], argArray[1], argArray[2]); 
			break;
		case "xor":
			binaryCode = MIPS_3address(0x26, argArray[0], argArray[1], argArray[2]); 
			break;
		
		// 3-address code I-type
		case "addiu": 
			binaryCode = MIPS_3adrImm(0x9, argArray[0], argArray[1], argArray[2]);
			break;
		case "andi":
			binaryCode = MIPS_3adrImm(0xC, argArray[0], argArray[1], argArray[2]);
			break;
		case "lui":
			binaryCode = MIPS_2adrImm(0xF, argArray[0], argArray[1]);
			break;
		case "ori": 
			binaryCode = MIPS_3adrImm(0xD, argArray[0], argArray[1], argArray[2]);
			break;
		case "slti": 
			binaryCode = MIPS_3adrImm(0xA, argArray[0], argArray[1], argArray[2]);
			break;
		case "sltiu": 
			binaryCode = MIPS_3adrImm(0xB, argArray[0], argArray[1], argArray[2]);
			break;
		case "xori": 
			binaryCode = MIPS_3adrImm(0xE, argArray[0], argArray[1], argArray[2]);
			break;
		
		// load-store
		case "lw":
			binaryCode = MIPS_2adrOffset(0x23, argArray[0], argArray[1]); 
			break;
		case "ll": 
			binaryCode = MIPS_2adrOffset(0x30, argArray[0], argArray[1]);
			break;
		case "sw": 
			binaryCode = MIPS_2adrOffset(0x2B, argArray[0], argArray[1]);
			break;
		case "sc": 
			binaryCode = MIPS_2adrOffset(0x38, argArray[0], argArray[1]);
			break;
		
		// non-linear
		case "j": 
			binaryCode = MIPS_1adrLabel(0x2, argArray[0]);
			break;
		case "jr": 
			binaryCode = MIPS_1address(0x0, argArray[0]);
			break;
		case "jal": 
			binaryCode = MIPS_1adrLabel(0x3, argArray[0]);
			break;
		case "beq": 
			binaryCode = MIPS_branch(0x4, argArray[0], argArray[1], argArray[2]);
			break;
		case "bne": 
			binaryCode = MIPS_branch(0x5, argArray[0], argArray[1], argArray[2]);
			break;
		
		// pseudo
		case "halt": binaryCode = 0xFFFFFFFF; break;
		case "push": break;
		case "pop": break;
		case "nop": binaryCode = 0x00000001; break;
		case "chw": break;
		case "cfw": break;
		
		// space allocator
		case "org": this.programAddress = argArray[0]; break;
		default: 
			if (codeArray[0].match("^[#]")) {
				return null;
			}
			else {
				this.labelName = codeArray[0].replace(":", "");
				this.labelAddress = this.programAddress;
			}
			
	}
	return binaryCode;
}

function MIPS_3address(_aluOpcode, _rd, _rs, _rt){
	return (_rs << 21) | (_rt << 16) | (_rd << 11) | (_aluOpcode); 
}

function MIPS_3adrShift(_aluOpcode, _rd, _rt, _shamt){
	return (_rt << 21) | (_rd << 11) | (_shamt << 6) | (_aluOpcode);
}

function MIPS_3adrImm(_opcode, _rt, _rs, _imm){
}

function MIPS_2adrImm(_opcode, _rt, _imm) {
}

function MIPS_2adrOffset(_opcode, _rt, _rs) {
}

function MIPS_1adrLabel(_opcode, _label) {
}

function MIPS_1address(_opcode, _rs) {
}

function MIPS_branch(_opcode, _rs, _rt, _label) {
}
