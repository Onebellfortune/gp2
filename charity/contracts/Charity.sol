pragma solidity ^0.5.0;

contract Charity{
    string public giver;

    struct Organization{
        uint uid;
        string name;
        uint balance;
    }

    uint public organizationCount;

    mapping(uint=>Organization) public organizations;

    function addOrganization(string memory _name) public{
        organizations[organizationCount]=Organization(organizationCount,_name,0);
        organizationCount++;
    }

    constructor() public {
        addOrganization('jongun');
        addOrganization('miwon');
        addOrganization('seoyeong');
    }

    function donate(uint _uid,uint amount) public{
        organizations[_uid].balance+=amount;
    }

    
}