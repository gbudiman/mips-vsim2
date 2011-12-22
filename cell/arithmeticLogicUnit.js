/*
 * class arithmeticLogicUnit
 * aluOut <= inputA opCode inputB
 * 
 * Input:
 * opCode		: ALU opcode
 * inputA
 * inputB
 * 
 * Output:
 * aluOut		: result
 * 
 */
function arithmeticLogicUnit(){
	this.aluOut = 0x0;
}

arithmeticLogicUnit.prototype.clock =
	function(opCode, inputA, inputB) {
	
	switch (opCode) {
		case 'add'  : this.aluOut = inputA + inputB; break;
		case 'sub'  : this.aluOut = inputA - inputB; break;
		case 'or'   : this.aluOut = inputA | inputB; break;
		case 'nor'  : this.aluOut = ~(inputA | inputB); break;
		case 'xor'  : this.aluOut = inputA ^ inputB; break;
		case 'slt'  : this.aluOut = (inputA < inputB) ? 1 : 0; break;
		case 'sltu' : this.aluOut =
						(Math.abs(inputA) < Math.abs(inputB)) ? 1 : 0; break;
		case 'and'  : this.aluOut = inputA & inputB; break;
		case 'sll'  : this.aluOut = inputA << inputB; break;
		case 'srl'  : this.aluOut = inputA >> inputB; break;
		case 'null' : this.aluOut = 0; break;
		default: alert('ALU detected undefined opCode ' + opCode);
	}	
}
