App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load items.
    $.getJSON('../items.json', function(data) {
      var itemsRow = $('#itemsRow');
      var itemTemplate = $('#itemTemplate');

      for (i = 0; i < data.length; i ++) {
        itemTemplate.find('.panel-title').text(data[i].name);
        itemTemplate.find('img').attr('src', data[i].picture);
        itemTemplate.find('.item-type').text(data[i].type);
        itemTemplate.find('.item-condition').text(data[i].condition);
        itemTemplate.find('.item-description').text(data[i].description);
        itemTemplate.find('.btn-buy').attr('data-id', data[i].id);

        itemsRow.append(itemTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access")
      }
    }
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
      web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Purchase.json', function (data) {
      var PurchaseArtifact = data;
      App.contracts.Purchase = TruffleContract(PurchaseArtifact);
      App.contracts.Purchase.setProvider(App.web3Provider);
      return App.markPurchased();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handlePurchase);
  },

  markPurchased: function(buyers, account) {
    var purchaseInstance;
    App.contracts.Purchase.deployed().then(function (instance) {
      purchaseInstance = instance;
      return purchaseInstance.getBuyers.call();
    }).then(function (buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-item').eq(i).find('button').text('Claimed').attr('disabled',true);
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

  handlePurchase: function(event) {
    event.preventDefault();

    var itemId = parseInt($(event.target).data('id'));

    var purchaseInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.Purchase.deployed().then(function (instance) {
        purchaseInstance = instance;
        return purchaseInstance.buy(itemId, { value:web3.toWei(0.001, 'ether'), from: account });
      }).then(function (result) {
        return App.markPurchased();
      }).catch(function (err) {
        console.log(err.message);
    });
  });
}};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
