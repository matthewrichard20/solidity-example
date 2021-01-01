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
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
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
    var electionInstance;
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
    //   electionInstance.itemCount(),

    // ]).then(response, function(){

    // })
    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.itemCount();
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
        electionInstance.items(i).then(function(item) {
          console.log("masuk")
          
          var id = item[0];
          var name;
          electionInstance.getItemType(item[1].c).then(function(_name)
          {

            name = _name;

          }
          
          
          )
          

          var userId = item[2];
          var recipe0 = item[3];
          var recipe1 = item[4];
          var recipe2 = item[5];
          var usedBy = item[6];
          var recipe = [] ;
          var recipeId = [] ;

          Promise.all([
            // electionInstance.getItemType(recipe0.itemTypeId),
            // electionInstance.getItemType(recipe1.itemTypeId),
            // electionInstance.getItemType(recipe2.itemTypeId)
          ]).then(function (itemNames) {
            for(var l = 0; l < itemNames.length; l++){
              if(itemNames[l]){
                recipe.push(itemNames[l]);
                recipeId.push({
                  id: item[l + 4],
                  names: itemNames[l]
                });
              }
            }


            var recipeName = recipe.join(",");
            var recipeObj = JSON.stringify(recipeId);


            // Render candidate Result
            
            var candidateTemplate = "<tr><th>" + id + "</th><td><a class='stock-item' id='stock-"+ id +"' data-recipe='"+ recipeObj +"' data-name='"+ name +"' data-id='"+ id +"'>" + name + "</a></td><td>" + stock + "</td><td>" + userId + "</td><td>" + recipeName +"</td></tr>" 
            itemResults.append(candidateTemplate);

            // Render candidate ballot option
            var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
            itemSelect.append(candidateOption);
            itemSelectTransfer.append(candidateOption);

            App.initStockModal();
            
          });
        });
      }


      return electionInstance.voters(App.account);
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

    App.contracts.Election.deployed().then(function(instance) {
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
    
    App.contracts.Election.deployed().then(function(instance) {
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

    App.contracts.Election.deployed().then(function(instance) {
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

    App.contracts.Election.deployed().then(function(instance) {
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
