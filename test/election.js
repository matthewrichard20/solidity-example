var SolidityExample = artifacts.require("SupplyChain");

contract('solidity-example', function(accounts) {

  it('Should deploy smart contract properly',async () => {
    const solidityContract = await SolidityExample.deployed();
    assert(solidityContract.address !=='')
  })

  // it('Should return 0 for getBalance' , async () => {
  //   const solidityContract = await SolidityExample.deployed();
  //   SolidityExample.deployed.then(function (temp) {
  //     return temp.getBalance();
  //   }).then(function(result){
  //     assert(result == 0);

  //   };
  //   // const result = await solidityContract.getBalance();
    
  // }) 

  it('Should return 0 for getBalance' , function (){
    // const solidityContract = await SolidityExample.deployed();
    SolidityExample.deployed().
    then(function (temp) {
      return temp.getBalance({from:accounts[1]});
    }).then(function(result){
      assert(result == 0);

    });

  

  });

  it('Should deposit token correctly' , async()=>{
    const solidityContract = await SolidityExample.deployed();
    await solidityContract.depositToken(1);
    const result = await solidityContract.getBalance();
    assert(result.toNumber()== 1 );

  });

  it('Should add Counter correctly' , async()=>{
    const solidityContract = await SolidityExample.deployed();
    await solidityContract.addCount(1);
    const result = await solidityContract.getCounter();
    assert(result.toNumber()== 1 );

  });

  it('Should withdraw correctly' , async()=>{
    const solidityContract = await SolidityExample.deployed();
    await solidityContract.depositToken(2);
    await solidityContract.addCount(11);
    await solidityContract.withdrawToken(1);
    const result = await solidityContract.getBalance();
    assert(result.toNumber()=== 2 );

  });
});
  







//   // it("it initializes the candidates with the correct values", function() {
//   //   return SupplyChain.deployed().then(function(instance) {
//   //     SupplyChainInstance = instance;
//   //     return SupplyChainInstance.candidates(1);
//   //   }).then(function(candidate) {
//   //     assert.equal(candidate[0], 1, "contains the correct id");
//   //     assert.equal(candidate[1], "Candidate 1", "contains the correct name");
//   //     assert.equal(candidate[2], 0, "contains the correct votes count");
//   //     return SupplyChainInstance.candidates(2);
//   //   }).then(function(candidate) {
//   //     assert.equal(candidate[0], 2, "contains the correct id");
//   //     assert.equal(candidate[1], "Candidate 2", "contains the correct name");
//   //     assert.equal(candidate[2], 0, "contains the correct votes count");
//   //   });
//   // });

//   it("test deposit function", function(){
//     return SupplyChain.deployed().then(function(instance){
//       SupplyChainInstance = instance;
//       depositAmount = 1;
//       return SupplyChainInstance.depositToken(depositAmount, { from: accounts[0] });

//     }).then(function(receipt){
//       assert.equal(receipt.logs.length, 1, "an event was triggered");
//       return SupplyChainInstance.getBalance();
//     }).then(function(balance){
//       assert.equal(balance,depositAmount);
//     })

//   });

//   // it("allows a voter to cast a vote", function() {
//   //   return SupplyChain.deployed().then(function(instance) {
//   //     SupplyChainInstance = instance;
//   //     candidateId = 1;
//   //     return SupplyChainInstance.vote(candidateId, { from: accounts[0] });
//   //   }).then(function(receipt) {
//   //     assert.equal(receipt.logs.length, 1, "an event was triggered");
//   //     assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
//   //     assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
//   //     return SupplyChainInstance.voters(accounts[0]);
//   //   }).then(function(voted) {
//   //     assert(voted, "the voter was marked as voted");
//   //     return SupplyChainInstance.candidates(candidateId);
//   //   }).then(function(candidate) {
//   //     var voteCount = candidate[2];
//   //     assert.equal(voteCount, 1, "increments the candidate's vote count");
//   //   })
//   // });

//   // it("test depositToken", function() {
//   //   return SupplyChain.deployed().then(function(instance) {
//   //     SupplyChainInstance = instance;
//   //     depositAmount = 1;
//   //     return SupplyChainInstance.depositToken(depositAmount, { from: accounts[0] });
//   //   }).then(function(receipt) {
//   //     assert.equal(receipt.logs.length, 1, "an event was triggered");
//   //     assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
//   //     assert.equal(receipt.logs[0].args.balanceOf[msg.sender].toNumber(), candidateId, "the candidate id is correct");
//   //     return SupplyChainInstance.voters(accounts[0]);
//   //   }).then(function(voted) {
//   //     assert(voted, "the voter was marked as voted");
//   //     return SupplyChainInstance.candidates(candidateId);
//   //   }).then(function(candidate) {
//   //     var voteCount = candidate[2];
//   //     assert.equal(voteCount, 1, "increments the candidate's vote count");
//   //   })
//   // });

//   // it("throws an exception for invalid candiates", function() {
//   //   return SupplyChain.deployed().then(function(instance) {
//   //     SupplyChainInstance = instance;
//   //     return SupplyChainInstance.vote(99, { from: accounts[1] })
//   //   }).then(assert.fail).catch(function(error) {
//   //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
//   //     return SupplyChainInstance.candidates(1);
//   //   }).then(function(candidate1) {
//   //     var voteCount = candidate1[2];
//   //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
//   //     return SupplyChainInstance.candidates(2);
//   //   }).then(function(candidate2) {
//   //     var voteCount = candidate2[2];
//   //     assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
//   //   });
//   // });

//   // it("throws an exception for double voting", function() {
//   //   return SupplyChain.deployed().then(function(instance) {
//   //     SupplyChainInstance = instance;
//   //     candidateId = 2;
//   //     SupplyChainInstance.vote(candidateId, { from: accounts[1] });
//   //     return SupplyChainInstance.candidates(candidateId);
//   //   }).then(function(candidate) {
//   //     var voteCount = candidate[2];
//   //     assert.equal(voteCount, 1, "accepts first vote");
//   //     // Try to vote again
//   //     return SupplyChainInstance.vote(candidateId, { from: accounts[1] });
//   //   }).then(assert.fail).catch(function(error) {
//   //     assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
//   //     return SupplyChainInstance.candidates(1);
//   //   }).then(function(candidate1) {
//   //     var voteCount = candidate1[2];
//   //     assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
//   //     return SupplyChainInstance.candidates(2);
//   //   }).then(function(candidate2) {
//   //     var voteCount = candidate2[2];
//   //     assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
//   //   });
//   // });
// });
// 