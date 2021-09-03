pragma solidity ^0.5.0;

//import web3;


contract Charity{
    address payable public owner;

    struct Organization{
        uint uid;
        string name;
        address payable addr;
    }

    modifier ownerOnly(){
        if(owner==msg.sender)
        {_;}
    }

    uint public organizationCount;

    mapping(uint=>Organization) public organizations;

    function addOrganization(string memory _name, address payable _addr) public{
        organizations[organizationCount]=Organization(organizationCount,_name,_addr);
        organizationCount++;
    }

    constructor() public {
        owner=msg.sender;
        addOrganization('jongun',0xf28D02B387BeE6e17ccA1E7E09CF70DF7E51116a);
        addOrganization('miwon',0xbB85336a6c3Fc59FFdc85534174a26D789933fAC);
        addOrganization('seoyeong',0x8fB8BEC81d3B5d207391667Be7b7676888999244);
    }

    event donateEvent(uint indexed uid);

    function getBalance() public view returns (uint){
        address contractAddress=owner;
        return contractAddress.balance;
    }

    function donate(uint _uid,uint amount) public payable  {
        send(organizations[_uid].addr,amount);
        emit donateEvent(_uid);
    }

    function send(address payable to, uint amount) public payable {
        to.transfer(amount);
    }

    function withdraw() public ownerOnly {
       send(owner,getBalance());
    }
}