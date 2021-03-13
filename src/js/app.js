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

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.SupplyChain.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      if(!eventListener){
        eventListener = instance.votedEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error, event) {
          // Reload when a new vote is recorded
          console.log(isAdding)
          if(isAdding){
            App.render();
          }
        });
      }
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

    // Promise.all([
    //   SupplyChainInstance.itemCount(),

    // ]).then(response, function(){

    // })
    // Load contract data
    App.contracts.SupplyChain.deployed().then(function(instance) {
      SupplyChainInstance = instance;
      return SupplyChainInstance.itemCount();
    }).then(function(itemCount) {

      var itemResults = $("#candidatesResults");
      itemResults.empty();

      var itemSelect = $('#candidatesSelect');
      itemSelect.empty();

      var itemSelectTransfer = $('#transferItemSelect');
      itemSelectTransfer.empty();

      console.log("itemCount:", itemCount);
      for (var i = 1; i <= itemCount; i++) {
        $("#candidatesResults").empty();
        SupplyChainInstance.items(i).then(function(item) {

        //   uint id;
        // uint itemTypeId;
        // address userId;
        // uint[] recipe;
        // uint [] usedBy;
        // uint256 timestamp;
        // bool isUsed;





          var id = item[0];
          var itemTypeId = item[1];
          var userId = item[2];
          var recipe = item[3];
          var usedBy = item[4];
          var timestamp = item[5];
          var isUsed = item[6];
          var itemName ;
          var tempRecipe;
          console.log("ts : ", timestamp);
          for (var tes=0; tes<= 6 ; tes++){
            console.log("test ", tes , " : ", item[tes] );
          }

          Promise.all([
            SupplyChainInstance.getItemNames(item[1].c[0])
          ]).then(function (_names){
            console.log("ini nama: ",_names);
            itemName = _names[0];
            console.log("testing Nama: " , itemName)
          });

          var tempRecipe; // try Wahyu code
          var recipeId;
          Promise.all([
            SupplyChainInstance.getItemNames(recipe.c[0]) //,
            // SupplyChainInstance.getItemNames(item[5].c[0]),
            // SupplyChainInstance.getItemNames(item[6].c[0])
          ]).then(function (itemNames) {
            for(var l = 0; l < itemNames.length; l++){
              if(itemNames[l]){
                tempRecipe.push(itemNames[l]);
                recipeId.push({
                  id: item[l + 4],
                  names: itemNames[l]
                });
              }
            }


            // var recipeName = tempRecipe.join(",");
            var recipeName = "test";
            var recipeObj = "test";
            var recipeObj = JSON.stringify(recipeId);


            // Render candidate Result
            
             
            // var candidateTemplate = "<tr><th>" + id + "</th><td>" + itemName + "</td><td>" + userId + "</td></tr>"
            var candidateTemplate = "<tr><th>" + id + "</th><td><a class='stock-item' id='stock-"+ id +"' data-recipe='"+ recipeObj +"' data-name='"+ itemName +"' data-id='"+ id +"'>" + name + "</a></td><td>" + stock + "</td><td>" + userId + "</td><td>" + recipeName +"</td></tr>" 
            itemResults.append(candidateTemplate);

            // Render candidate ballot option
            var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
            itemSelect.append(candidateOption);
            itemSelectTransfer.append(candidateOption);

            console.log("ts akhir : ", timestamp);
            App.initStockModal();
            
          });
        });
      }


      return SupplyChainInstance.voters(App.account);
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },
  initStockModal: function() {
    $(".stock-item").off("click");
    $(".stock-item").on("click", function() {
      $("#stock-recipe-modal").modal('show');
      var name = $(this).data("name");
      var recipeObj = $(this).data("recipe");
      $("#stock-detail-name").text(name);
      $("#stock-detail-recipe").empty();
      recipeObj.forEach(function(v, k){
        $("#stock-detail-recipe").append($("#stock-" + v.id).clone());
      });
      App.initStockModal()
      $("#stock-recipe-modal").modal('show');
    });
  },

  addStock: function() {
    var itemId = $('#candidatesSelect').val();
    var stock = $('#stock').val();

    App.contracts.SupplyChain.deployed().then(function(instance) {
      isAdding = true;
      return instance.addStock(itemId,stock, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  addItem: function() {
    var name = $('#itemName').val();
    var stock_addItem = $('#stock_addItem').val();
    
    App.contracts.SupplyChain.deployed().then(function(instance) {
      isAdding = true;
      return instance.addItem(name, stock_addItem , { from: App.account , gas: 1000000} );
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },


  transferItem: function() {
    var itemId = $('#transferItemSelect').val();
    var stock = $('#stockTransfer').val();

    App.contracts.SupplyChain.deployed().then(function(instance) {
      isAdding = true;
      return instance.buyTransaction(itemId,stock, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  traceItem: function() {
    var itemId = $('#transferItemSelect').val();
    var stock = $('#stockTransfer').val();

    App.contracts.SupplyChain.deployed().then(function(instance) {
      isAdding = true;
      return instance.buyTransaction(itemId,stock, { from: App.account });
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
