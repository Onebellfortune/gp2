pragma solidity ^0.5.0;

//import web3;


contract Charity{
    address payable public owner;

    struct Organization{
        uint uid;
        string name;
        uint balance;
        address payable addr;
    }

    modifier ownerOnly(){
        if(owner==msg.sender)
        {_;}
    }

    uint public organizationCount;

    mapping(uint=>Organization) public organizations;

    function addOrganization(string memory _name, address payable _addr) public{
        organizations[organizationCount]=Organization(organizationCount,_name,0,_addr);
        organizationCount++;
    }

    constructor() public {
        owner=msg.sender;
        addOrganization('jongun',0x79a9fcEc3A9f72251d4Ce139660dbbc691f8Bde6);
        addOrganization('miwon',0xd884590a3AB11A08D783BF90d98c43aC4d7ed87c);
        addOrganization('seoyeong',0x36973fA3D93c48B6B9dcf859641a427e37A9952a);
    }

    event donateEvent(uint indexed uid);

    function getBalance() public view returns (uint){
        address contractAddress=owner;
        return contractAddress.balance;
    }

    function donate(uint _uid,uint amount) public payable ownerOnly {
        organizations[_uid].balance+=amount;
        send(organizations[_uid].addr,amount);
        emit donateEvent(_uid);
    }

    function send(address payable to, uint amount) public payable ownerOnly{
        to.transfer(amount);
    }

    function withdraw() public ownerOnly {
       send(owner,getBalance());
    }
}