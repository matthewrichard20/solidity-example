pragma solidity >=0.4.20;

contract SupplyChain {
    // Model a Candidate
    // 0.1 equal to 1 in data
    

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    uint256 counter;

    function depositToken(uint256 depositAmount) public {
        uint256 minimumDeposit = 1;
        require(depositAmount >=  minimumDeposit ) ;
        balanceOf[msg.sender] += depositAmount;

    }

    function getBalance() public view returns(uint256  _balance ) {
        _balance = balanceOf[msg.sender];
    }

    function getCounter () public view returns(uint256  _balance ) {
        _balance = counter;
    }

    function addCount(uint256 _count) public {
        counter += _count;

    }

    function withdrawToken(uint256 withdrawAmmount) public {
        
        
        require(counter > 10);
        require((balanceOf[msg.sender]- withdrawAmmount) > 0 );
        balanceOf[msg.sender] -= withdrawAmmount ;
    }


    constructor () public {
        balanceOf[msg.sender] = 0;

    }

}
