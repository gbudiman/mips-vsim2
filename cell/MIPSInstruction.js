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
	var binaryCode;
	for (iLine = 0; iLine < this.assembly.length; iLine++) {
		if ((binaryCode = this.MIPSParse(this.assembly[iLine].toLowerCase())) === null) continue;
		this.binary[iLine] = binaryCode;
	}
	for (iLine = 0; iLine < this.assembly.length; iLine++) {
		if (this.assembly[iLine].toLowerCase().match("(j[^r]|jal|bne|beq)")) {
			this.binary[iLine] = this.resolveLabel(this.assembly[iLine], this.binary[iLine]);
		}
		this.binary[iLine] = this.computeChecksum(this.binary[iLine]);
	}
	this.binary.push(":00000001FF");
	$('textarea#textarea_binary').val(this.binary.join("\n"));
}

MIPSInstruction.prototype.computeChecksum = function(_binary) {
	if (_binary !== undefined && (_binary.match("[:][0-9A-Fa-f]{6,6}[0]{2,2}[0-9A-Fa-f]+"))) {
		var ics;
		var checkSum = 0;
		for (ics = 1; ics < _binary.length; ics += 2) {
			checkSum += parseInt(_binary.substr(ics, 2), 16);
		}
		checkSum = (~checkSum + 1) & 0xFF;
		return _binary + checkSum.toHexString().substring(8);
	}
	return _binary;
}

MIPSInstruction.prototype.MIPSParse = function(_code) {
	if (_code.length == 0) { return null; }
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
			binaryCode = MIPS_1address(0x8, argArray[0]);
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
		case "nop": binaryCode = 0x00000000; break;
		case "chw": 
		case "cfw": binaryCode = parseInt(argArray[0]); break;
		
		// space allocator
		case "org": this.programAddress = argArray[0] / 4; break;
		default: 
			if (codeArray[0].match("^[#]")) {
				return null;
			}
			else {
				this.labelName.push(codeArray[0].replace(":", "").returnEssential());
				this.labelAddress.push(this.programAddress);
				binaryCode = null;
			}
			
	}
	
	if (binaryCode != null) {
		return ":04" + (this.programAddress++).toHexString().substring(6) + "00" + binaryCode.toHexString().substring(2);	
	}
	return null;
}

MIPSInstruction.prototype.resolveLabel = function(_code, _binary) {
	var binaryOffset = 3;
	var argArray = _code.split(" ");
	if (_code.indexOf('#') != -1) {
		var ri;
		for (ri = 0; ri < argArray.length; ri++) {
			if (argArray[ri].match('[#]')) { break; }
		}
		var codeArray = argArray[ri - 1].split(",");
	}
	else {
		var codeArray = argArray[argArray.length - 1].split(",");
	}
	var seekLabel = codeArray[codeArray.length - 1].returnEssential();
	var seekIndex = this.labelName.indexOf(seekLabel);
	var currentPc = parseInt(_binary.substr(binaryOffset, 4), 16);
	var relOffset = this.labelAddress[seekIndex] - (currentPc + 1);
	
	if (relOffset < 0) {
		relOffset = (0xFFFFFFF + relOffset + 1) & 0xFFFF;
	}
	if (argArray[0].toLowerCase().match("(beq|bne)")) {
		return _binary.substr(0, 9) 
			+ (parseInt(_binary.substr(9, 8), 16) | relOffset).toHexString().substring(2);
	}
	else {
		return _binary.substr(0, 9) 
			+ (parseInt(_binary.substr(9, 8), 16) | this.labelAddress[seekIndex]).toHexString().substring(2);
	} 
}

function MIPS_3address(_aluOpcode, _rd, _rs, _rt){
	return (_rs << 21) | (_rt << 16) | (_rd << 11) | (_aluOpcode); 
}

function MIPS_3adrShift(_aluOpcode, _rd, _rt, _shamt){
	return (_rt << 21) | (_rd << 11) | (_shamt << 6) | (_aluOpcode);
}

function MIPS_3adrImm(_opcode, _rt, _rs, _imm){
	var imm = parseInt(_imm);
	if (imm < 0) {
		imm = (0xFFFFFFFF + imm + 1) & 0xFFFF;
	}
	return (_opcode << 26) | (_rs << 21) | (_rt << 16) | (imm);
}

function MIPS_2adrImm(_opcode, _rt, _imm) {
	var imm = parseInt(_imm);
	if (imm < 0) {
		imm = (0xFFFFFFFF + imm + 1) & 0xFFFF;
	}
	return (_opcode << 26) | (_rt << 16) | (imm);
}

function MIPS_2adrOffset(_opcode, _rt, _mix) {
	var openParen = _mix.indexOf('(');
	var closeParen = _mix.indexOf(')');
	var offset = parseInt(_mix.substring(0, openParen));
	var base = parseInt(_mix.substring(openParen + 1, closeParen));
	
	if (offset < 0) {
		offset = (0xFFFFFFFF + offset + 1) & 0xFFFF;
	}
	return (_opcode << 26) | (base << 21) | (_rt << 16) | (offset);
}

function MIPS_1adrLabel(_opcode, _label) {
	return (_opcode << 26);
}

function MIPS_1address(_aluOpcode, _rs) {
	return (_rs << 21) | (_aluOpcode);
}

function MIPS_branch(_opcode, _rs, _rt, _label) {
	return (_opcode << 26) | (_rt << 21) | (_rs << 16);
}
