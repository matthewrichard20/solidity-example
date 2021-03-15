App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  isAdding: false,
  eventListener: null,

  init: function() {
    eventListener = null;
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("SupplyChain.json", function(SupplyChain) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.SupplyChain = TruffleContract(SupplyChain);
      // Connect provider to interact with contract
      App.contracts.SupplyChain.setProvider(App.web3Provider);

    

      return App.render();
    });
  },

  render: function() {
    var SupplyChainInstance;
    var loader = $("#loader");
    var content = $("#content");
    isAdding = false;

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    App.contracts.SupplyChain.deployed().then(function(instance) {
      SupplyChainInstance = instance;
      return SupplyChainInstance.getBalance(App.account);
    }).then(function(balance) {
      console.log("Balance",balance);
    
      document.getElementById("balanceResult").innerHTML = balance/10 ;
    
    
      
      return 0;
    });

    App.contracts.SupplyChain.deployed().then(function(instance) {
      SupplyChainInstance = instance;
      return SupplyChainInstance.getCounter();
    }).then(function(counter) {
      console.log("Balance",counter);
      
      document.getElementById("counter").innerHTML = counter ;
      
    
      
      return 0;
    });

  },

  depositToken : function() {
    
    var depositValue = $('#depositValue').val();

    App.contracts.SupplyChain.deployed().then(function(instance) {
      isAdding = true;
      return instance.depositToken(depositValue * 10, { from: App.account });
    }).then(function(result) {
  
      $("#content").hide();
      $("#loader").show();
      App.render;
    }).catch(function(err) {
      console.error(err);
    });
    App.render;
  },

  withdrawToken : function() {
  
    var withdrawValue = $('#withdrawValue').val();

    App.contracts.SupplyChain.deployed().then(function(instance) {
      isAdding = true;
      return instance.withdrawToken(withdrawValue * 10, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
      App.render;
    }).catch(function(err) {
      console.error(err);
    });
    App.render;
  },

  addCount : function() {
    // var balanceResult = $('#balanceResult').val();
    var countValue = $('#countValue').val();

    App.contracts.SupplyChain.deployed().then(function(instance) {
      isAdding = true;
      return instance.addCount(countValue, { from: App.account });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
      App.render;
    }).catch(function(err) {
      console.error(err);
    });
    App.render;
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
