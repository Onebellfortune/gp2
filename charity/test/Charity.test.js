const Charity=artifacts.require('./Charity.sol')

contract('Charity',accounts=>{

    it('addOrganization increments organizationCount by 1',()=>{
        return Charity.deployed()
        .then(instance=>{
            instance.addOrganization('jongun')
            instance.addOrganization('miwon')
            instance.addOrganization('seoyeong')

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
            assert.equal(org[0],0,'uid : 1')
            assert.equal(org[1],'jongun','name:jongun')
            assert.equal(org[2],0,'balance:0')
        })
    })
})