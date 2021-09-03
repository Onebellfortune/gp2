var Charity=artifacts.require("./Charity.sol");

module.exports=function(user1){
    user1.deploy(Charity);
};