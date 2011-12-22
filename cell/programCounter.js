/*
 * class programCounter
 * pcOut <= branchAddress 	when branch = 1
 * 			jumpAddress 	when jump = 1
 * 			pcIncremented 	when stall = 0
 * 			pcOut			when others
 * 			
 * Input:
 * stall			: Stall signal
 * pcIncremented	: PC + 4
 * branch			: Branch control signal
 * branchAddress	: Branch target address
 * jump				: Jump control signal
 * jumpAddress		: Jump target address
 * 
 * Output:
 * pcOut
 */
function programCounter(_preset) {
	this.pcOut = _preset;
}

programCounter.prototype.clock = 
	function(stall, pcIncremented
			, branch, branchAddress
			, jump, jumpAddress) {
	
	if (stall == 1) {}
	else if (branch == 1) { this.pcOut = branchAddress; }
	else if (jump == 1) { this.pcOut = jumpAddress; }
	else { this.pcOut = pcIncremented; }
	this.updateVisual();
}

programCounter.prototype.updateVisual = function() {
	$('#currentPc').text(this.pcOut.toHexString());
}
