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

  it('Should withdraw token fail' , async()=>{
    const solidityContract = await SolidityExample.deployed();
    try {
      await solidityContract.withdrawToken(1);
    } catch(e){
      
      return;
    }
    assert(false);

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

  it('Should deposit token fail' , async()=>{
    const solidityContract = await SolidityExample.deployed();
    try {
      await solidityContract.depositToken(0.1);
    } catch(e){

      return;
    }
    assert(false);

  });

  
});