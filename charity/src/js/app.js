var App = {
  web3Provider: null,
  contracts: {}
}

$(window).load(function () {


  if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
  } else { 
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
  }

  $.getJSON("Charity.json", function (charity) {
      App.contracts.Charity = TruffleContract(charity);
      App.contracts.Charity.setProvider(App.web3Provider);
      render();
  });

  function render() {
    //web3.currentProvider.selectedAddress
    web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
            App.account = account;
            $("#accountAddress").html("나의 계정: "+ account);
        }
    });

      App.contracts.Charity.deployed()
      .then(function (instance) {
          orgs = instance;
          return orgs.organizationCount();
      })
      .then(function (organizationCount) {
          for (var i = 0; i < organizationCount; i++) {
              orgs.organizations(i).then(function (org) {
                  var id = org[0];
                  var name = org[1];
                  var address=org[2];
                  
                  var res;
                  web3.eth.getBalance(address,function(e,r){
                        if(!e){
                            var orgTable = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + address + "</td><td>"+r+"</td></tr>"
                            $("#balances").append(orgTable);
                        }else{

                        }
                  })
                  
                  console.log(res);
                  

                  var organizations="<option value='"+id+"'>"+name+"</option>"
                  $('#organizationSelect').append(organizations);
              });
          }

          $("#loader").hide();
          $("#content").show();
      }).catch(function (error) {
          console.warn(error);
      });
  }

  $('#btnDonate').on('click',function(){
      var uid=$('#organizationSelect').val()
      if(!uid){
          return alert('단체를 선택하세요')
      }
      App.contracts.Charity.deployed()
      .then(function(instance){
          
          return instance.donate(uid,1000000000000000000,{from:App.account,value:web3.toWei(1,'ether')})
      })
      .then(function(result){
          if(result.receipt){
              alert('기부 완료')
              location.reload();
          }
      })
      .catch(function(error){
          alert(error.message)
      })
    })
    $('#btnBalance').on('click',function(){
        App.contracts.Charity.deployed()
            .then(function(instance){
                return instance.getBalance();
            })
            .then(function(value){
                console.log(value)
                $("#accountBalance").html("잔액: "+web3.fromWei(value))
            })
    })

});