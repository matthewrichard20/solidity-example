pragma solidity >=0.4.20;

contract SupplyChain {
    // Model a Candidate
    // 0.1 equal to 1 in data
    

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    uint256 counter;
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MyToken(
        uint256 initialSupply
        ) public {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
    }


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

    struct Company {
        uint id;
        address addressCompany;
        string name;
    }

    struct Item{
        uint id;
        uint itemTypeId;
        address userId;
        uint[] recipe;
        uint [] usedBy;
        uint timestamp;
        bool isUsed;

    }

    struct Transfer{
        uint id;
        uint itemId;
        address senderId;
        address receiverId;
        bool isConfirmed;

    }

    event votedEvent (
        uint indexed _candidateId
    );

    mapping(uint => Item) public items;
    mapping(uint => Company) public companies;
    mapping(uint => Transfer) public transfers;
    uint public itemCount;
    uint public companyCount;
    uint public transferCount;
    uint [][] companyStock; //indeks pertama id company, indeks kedua id itemType
    
    mapping(uint => string ) public itemType;
    uint public itemTypeCount;



    // buat item yang awal, tanpa recipe
    function addItem ( uint  itemTypeId, int _stock 
                        ) public {
        uint[] memory recipe;
        uint[] memory usedBy;
        uint timestamp = block.timestamp;
        for (int i= 0;i< _stock; i++){
            itemCount++;
            items[itemCount] = Item(itemCount, itemTypeId, msg.sender, recipe, usedBy , timestamp, false);
        }

                            
    
       emit votedEvent(0);
    }

    function createItem ( uint [] memory itemTypeId ,uint [] memory recipe
                        ) public {

        bool isValid = true;  
        bool _isUsed = false;                 
        for(uint i=0 ; i< recipe.length ; i++){
            isValid = isValid && (items[recipe[i]].userId == msg.sender);
            _isUsed = _isUsed && (items[recipe[i]].isUsed);

        }

        require(isValid && !(_isUsed));   

        for(uint j=0 ; j< itemTypeId.length ; j++){
            itemCount++;
            uint [] memory usedBy;
            items[itemCount] = Item(itemCount, itemTypeId[j], msg.sender, recipe , usedBy , block.timestamp, false);
            for(uint k=1; k<= recipe.length;k++){
                items[recipe[k]].isUsed = true;
                items[recipe[k]].usedBy.push(itemCount);
            }
        }
        emit votedEvent(0);
    }

    function sendItem(address _receiverId, uint _item) public {

        require(msg.sender == items[_item].userId);
        require( !(items[_item].isUsed));

        transferCount++;
        transfers[transferCount] = Transfer(transferCount,_item, msg.sender, _receiverId, false);
        emit votedEvent(0);
    }


    function receiveItem(uint transferId) public {
        
        Transfer memory temp = transfers[transferId];

        require(msg.sender == temp.receiverId);
        require( !(items[temp.itemId].isUsed));

        uint[] memory recipe;
        uint[] memory usedBy;
        
        itemCount++;
        items[itemCount] = Item(itemCount, items[temp.itemId].itemTypeId, msg.sender, recipe,  usedBy , block.timestamp, false);
        items[itemCount].recipe.push(temp.itemId);

        items[temp.itemId].usedBy.push(itemCount);
        items[temp.itemId].isUsed = true;

        transfers[transferId].isConfirmed = true;

        emit votedEvent(0);
    }


    function getItemNames(uint _item) public view returns(string memory _name )  {

        if (_item == 0) {
            _name = "nothing";

        } else {
            _name =  itemType[_item];
        }
        
    }
    
    function traceProduct(uint _item) public  returns( uint [] memory _recipe , uint [] memory _usedBy ) {

        _recipe = items[_item].recipe;
        _usedBy = items[_item].usedBy;
        
        emit votedEvent(0);
    }

    function addNewType(string memory name) public{
        itemTypeCount++;

        itemType[itemTypeCount] = name;
    }

    function getItemCount() public view returns (uint _itemCount){
        _itemCount = itemCount;
    }
 
    

    
}
