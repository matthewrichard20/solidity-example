pragma solidity >=0.4.20;

contract Election {
    // Model a Candidate
    struct Company {
        uint id;
        address addressCompany;
        string name;
    }

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Item{
        uint id;
        uint itemTypeId;
        address userId;
        // uint[3] recipe;
        uint recipe0;
        uint recipe1;
        uint recipe2;
        uint usedBy;
        uint256 timestamp;
        bool isUsed;

    }

    mapping(uint => Item) public items;
    mapping(uint => Company) public companies;
    uint public itemCount;
    uint public companyCount;
    uint [][] companyStock; //indeks pertama id company, indeks kedua id itemType
    
    mapping(uint => string ) public itemType;
    uint public itemTypeCount;



    // buat item yang awal, tanpa recipe
    function addItem ( uint  itemTypeId, int _stock 
                        ) public {
       
        for (int i= 0;i< _stock; i++){
            itemCount++;
            items[itemCount] = Item(itemCount, itemTypeId, msg.sender, 0, 0, 0 , 0 , block.timestamp, false);
        }

                            
    
       emit votedEvent(0);
    }

    function createItem ( uint itemTypeId ,uint _recipe0, uint _recipe1, uint _recipe2
                        ) public {
        require(msg.sender == items[_recipe0].userId && msg.sender == items[_recipe1].userId && msg.sender == items[_recipe2].userId);   
        require( !(items[_recipe0].isUsed) && !(items[_recipe1].isUsed) && !(items[_recipe2].isUsed));   

        itemCount++;
        items[itemCount] = Item(itemCount, itemTypeId, msg.sender, _recipe0 , _recipe1, _recipe2 , 0 , block.timestamp, false);

        items[_recipe0].isUsed = true;
        items[_recipe1].isUsed = true;
        items[_recipe2].isUsed = true;
        items[_recipe0].usedBy = itemTypeId;
        items[_recipe1].usedBy = itemTypeId;
        items[_recipe2].usedBy = itemTypeId;

        emit votedEvent(0);
    }

    // function addStock(uint _item, int stock) public{

    //     require(msg.sender == items[_item].userId );

    //     items[_item].stock += stock;
    //     emit votedEvent(0);
    // }

    function buyItem(uint _item) public {

        require( !(items[_item].isUsed));

        itemCount++;
        items[itemCount] = Item(itemCount, items[_item].itemTypeId, msg.sender, items[_item].recipe0 , items[_item].recipe1, items[_item].recipe2 , 0 , block.timestamp, false);
        
        items[_item].usedBy = itemCount;
        items[_item].isUsed = true;

        emit votedEvent(0);
    }


    function getItemType(uint _item) public view returns(string memory _name )  {
        _name =  itemType[_item];
    }
    function traceProduct(uint _item) public view returns( uint _recipe0 , uint  _recipe1, uint _recipe2, uint _usedBy ) {

        _recipe0 = items[_item].recipe0;
        _recipe1 = items[_item].recipe1;
        _recipe2 = items[_item].recipe2;
        _usedBy = items[_item].usedBy;

    }

    function addNewType(string memory name) public{
        itemTypeCount++;

        itemType[itemTypeCount] = name;
    }

    // Store accounts that have voted
    mapping(address => bool) public voters;
    // Store Candidates
    // Fetch Candidate
    mapping(uint => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    constructor () public {
        
        addNewType("Sapi");
        addItem(1,1);
        // addItem("kodok", 2);
        // addItem("sapi", 2);
        // addItem("ayam", 2);
        // addItem2("nasi goreng", 2, 1,2,3);
        // addItem2("nasi bakar", 2, 4,2,3);
        // addItem2("paket 1", 2, 4,5,3);
    }

    function addCandidate (string memory _name) private {
        candidatesCount ++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    function vote (uint _candidateId) public {
        // require that they haven't voted before
        require(!voters[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        // record that voter has voted
        //voters[msg.sender] = true;

        // update candidate vote Count
        candidates[_candidateId].voteCount ++;

        // trigger voted event
        emit votedEvent(_candidateId);
    }
}
