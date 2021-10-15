var App = {
  web3Provider: null,
  contracts: {}
}
//var Accounts=require('web3-eth-accounts');
//var accounts=new Accounts('ws://localhost:8546');
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
      eventListener();
      render();
    });

    function eventListener(){
        App.contracts.Charity.deployed()
        .then(function(instance){
            
            instance.donateEvent({},{fromBlock:0,toBlock:'lastest'
        }).watch(function(error,event){
            if(!error){
                var txHash=event.transactionHash;
                //var address=instance.getName(event.args.uid)
                var uid=parseInt(event.args.uid)
                var name;
                instance.organizations(uid)
                .then(function(orgInfo){
                    return orgInfo[1];
                    
                }).then(function(name){
                    web3.eth.getTransaction(txHash,function(error,receipt){
                    
                        var blockNumber=receipt.blockNumber;
                        var from=receipt.from;
                        var to=name;
                        var value=receipt.value;
                        var perWei=10**18;
                        var re=(value/perWei);
                            re=re*100
                            re=Math.floor(re)
                            re=re/100
                            re=re.toFixed(2)
                            re=re.toLocaleString('ko-KR',2);
                        var tableData="<tr><th>"+blockNumber+"</th><td>"+from+"</td><td>"+to+"</td><td>"+re+"ETH"+"</td></tr>"
                        
                        $("#records").append(tableData);
                        if(from==App.account)
                        
                        $("#myRecords").append(tableData);
                    })
                    
                })
                
                
                //console.log(name)
                //console.log(a)
                
                //console.log('이벤트 트리거됨',event)
            }
            //render();
        })
        })
    }
    
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
          
          web3.eth.getBalance(App.account,function(e,r){
            if(!e){
                var perWei=10**18;
                var re=(r/perWei);
                re=re*100
                re=Math.floor(re)
                re=re/100
                re=re.toFixed(2)
                re=re.toLocaleString('ko-KR',2);
                $('#myaccount').append(re);
                $('#myaccount').append('ETH');
                $('#myaccountinfo').append(App.account);
            }
        })
          
               
          return orgs.organizationCount();
      })
      .then(function (organizationCount) {
        
        $('#organizationSelect').empty();
        $("#balances").empty();
          for (var i = 0; i < organizationCount; i++) {
              orgs.organizations(i).then(function (org) {
                  var id = org[0];
                  var name = org[1];
                  var address=org[2];
                  var perWei=10**18;
                  var res;
                  web3.eth.getBalance(address,function(e,r){
                        if(!e){
                            var re=(r/perWei);
                            re=re*100
                            re=Math.floor(re)
                            re=re/100
                            re=re.toFixed(2)
                            re=re.toLocaleString('ko-KR',2);
                            //re.toPrecision(2);
                            var orgTable = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + address + "</td><td>"+re+"ETH"+"</td></tr>"
                            $("#balances").append(orgTable);
                        }else{

                        }
                  })
                  
                  

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
      var value=$('#donationValue').val()
      if(!value){
          return alert('기부 금액을 입력하세요')
      }
      else if(value<=0){
          return alert('기부 금액은 0.00 ETH 이상이어야 합니다')
      }
      var valueWei=value*10**18;
      
      App.contracts.Charity.deployed()
      .then(function(instance){
          
          return instance.donate(uid,valueWei,{from:App.account,value:web3.toWei(value,'ether')})
      })
      .then(function(result){
          if(result.receipt){
              alert('기부 완료')
              opener.parent.location.reload();
              window.close();
          }
      })
      .catch(function(error){
          alert(error.message)
      })
    })
    $('#btnBalance').on('click',function(){
        var perWei=10**18;
        web3.eth.getBalance(App.account,function(e,r){
            if(!e){
                var re=(r/perWei);
                re=re*100
                re=Math.floor(re)
                re=re/100
                re=re.toFixed(2)
                re=re.toLocaleString('ko-KR',2);
                //re.toPrecision(2);
                $("#accountBalance").html("잔액: "+re + "ETH");
            }else{

            }
      })
    })

    $('#btnPopup').on('click',function(){
       
        popup();
    });
    function popup(){
        var popupX=(window.screen.width/2);
        var url = "/popup.html";
        var name = "기부 금액 설정";
        var option = "width = 700, height = 300 , left="+popupX+",screenX="+popupX;
        window.open(url, name, option);
        
    }

   $('#buttonStart').on('click',function(){
        ethereum.request({method:'eth_requestAccounts'});
    })

   

    /*const ethereumButton=document.querySelector('.enableEthereumButton');
    ethereumButton.addEventListener('click',()=>{
        ethereum.request({method:'eth_requestAccounts'});
        //ethereum.request({method:'eth_accounts'});
    })

    const disconnectButton=document.querySelector('.disconnectButton');
    disconnectButton.addEventListener('click',()=>{
        ethereum.request({method:'accountsChanged'});
        //ethereum.request({method:'eth_accounts'});
    })*/
   
});