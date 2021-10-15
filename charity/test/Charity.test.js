const Charity=artifacts.require('./Charity.sol')

contract('Charity',accounts=>{

    it('addOrganization increments organizationCount by 1',()=>{
        return Charity.deployed()
        .then(instance=>{

            console.log(msg.sender);
            return instance.organizationCount()
        })
        .then(count=>{
            assert.equal(count,3)
        })
    })

    it('validation of organizations',()=>{
        return Charity.deployed()
        .then(instance=>{
            firstOrg=instance
            return firstOrg.organizations(0)
        })
        .then(org=>{
            assert.equal(org[0],0,'uid : 0')
            assert.equal(org[1],'jongun','name:jongun')
            assert.equal(org[2],0,'balance:0')
        })
    })

    it('donation',()=>{
        return Charity.deployed()
        .then(instance=>{
            orgs=instance
            uid=1

            return orgs.donate(1,500,{from:accounts[0]});
        })
        .then(receipt=>{
            assert.equal(receipt.logs.length,1)
            assert.equal(receipt.logs[0].event,'donateEvent');
            assert.equal(receipt.logs[0].args.uid.toNumber(),uid);
        
        })
    })

    it('balance check',()=>{
        return Charity.deployed()
        .then(instance=>{
            orgs=instance
            
            orgs.donate(0,500,{from:accounts[0]});
            return orgs.organizations(0);  
        })
        .then(account=>{
            
            balance=account.balance;
            assert.equal(balance,500);
        })
    })
})