function core() {
	pc = new programCounter(0);
	pcIncrementer = new arithmeticLogicUnit();
}

core.prototype.clock = function() {
	pc.clock(0, pcIncrementer.aluOut
			,0 ,0
			,0 ,0);
	pcIncrementer.clock('add', pc.pcOut, 4);	
}
