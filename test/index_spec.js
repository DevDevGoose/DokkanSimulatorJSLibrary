let expect = require('chai').expect;
let DokkanSim = require('../index');



describe('DokkanSim', function () {

    before(function () {
        // runs before all tests in this block
        singleCardEverything = { 'currentKi': 3, 'baseKi': 0, 'maxKi': 12, 'currentAttack': 5000, 'percentageTurnStart': function () { this.currentAttack += 1000; this.currentKi += 2; }, '12KiMultiplier': 150, 'neutralKiMultiplierValue': 4, 'buildUpPassive': 1.10 };
        singleCardMinimum = { 'currentKi': 3, 'currentAttack': 5000 };
    });

    describe('orderLeaderSkills()', function () {
        before(function () {
            leaderSkills = DokkanSim.orderLeaderSkills(['percentage', function () { let aa = ''; }], ['flat', function () { return 'weird'; }]);
        });
        it('should return an array', function () {
            expect(leaderSkills).to.be.an('Array');
        });

        it('should return an array with 2 items', function () {
            expect(leaderSkills.length).to.equal(2);
        });

        it('should return the array [[p],[f]] in the right order', function () {
            expect(leaderSkills[0][0]).to.equal('flat');
            expect(leaderSkills[1][0]).to.equal('percentage');
        });

        it('should return the array [[f],[p]] in the correct order', function () {
            leaderSkills = DokkanSim.orderLeaderSkills(['flat', function () { return 'weird'; }], ['percentage', function () { let aa = ''; }]);
            expect(leaderSkills[0][0]).to.equal('flat');
            expect(leaderSkills[1][0]).to.equal('percentage');
        });
    });





    describe('activatePercentageTurnStartSkill()', function () {
        it('should return an object', function () {
            expect(DokkanSim.activatePercentageTurnStartSkill(singleCardEverything)).to.be.an('Object');
        });

        it('should have the correct currentAttack value', function () {
            expect(singleCardEverything['currentAttack']).to.equal(11000);
        });

        it('should have the correct currentKi value', function () {
            expect(singleCardEverything['currentKi']).to.equal(7);
        });

        it('should return the minimum card object', function () {
            expect(DokkanSim.activatePercentageTurnStartSkill(singleCardMinimum)).to.be.an('Object');
        });

        it('should have the correct currentAttack value', function () {
            expect(singleCardMinimum['currentAttack']).to.equal(5000);
        });

        it('should have the correct currentKi value', function () {
            expect(singleCardMinimum['currentKi']).to.equal(3);
        });
    });

    describe('applyFlatTeamPassive()', function () {
        it('should return the card object', function () {
            expect(DokkanSim.applyFlatTeamPassive(singleCardEverything, [2, 2000, 200])).to.be.an('Object');
        });
        it('should return the card object with correct currentKi value', function () {
            expect(singleCardEverything['currentKi']).to.equal(9);
        });
        it('should return the card object with correct currentAttack value', function () {
            expect(singleCardEverything['currentAttack']).to.equal(13000);
        });
    });

    describe('applyPercentageTeamPassive()', function () {
        it('should return the card object', function () {
            expect(DokkanSim.applyPercentageTeamPassive(singleCardEverything, [2, 2000, 200])).to.be.an('Object');
        });
        it('should return the card object with correct currentAttack value', function () {
            expect(singleCardEverything['currentAttack']).to.equal(26000);
        });
    });

    describe('generateKiArray()', function () {
        let kiArray = DokkanSim.generateKiArray();
        it('should return an array', function () {
            expect(kiArray).to.be.an('Array');
        });

        it('should be the correct length of 3', function () {
            expect(kiArray.length).to.equal(3);
        });
        it('should have a number as the first value', function () {
            expect(kiArray[0]).to.be.an('Number');
        });

        it('should have a number between 1 and 8 as the first value', function () {
            expect(kiArray[0]).to.be.above(0);
            expect(kiArray[0]).to.be.below(9);
        });

        it('should have a string as the second value', function () {
            expect(kiArray[1]).to.be.a('String');
        });

        it('should have a second value that is equal to one of the character types', function () {
            let typesArray = ['PHY', 'INT', 'TEQ', 'AGL', 'STR'];
            expect(typesArray).to.include(kiArray[1]);
        });

        it('should have a number as the third value', function () {
            expect(kiArray[0]).to.be.an('Number');
        });


        it('should have a number between 0 and 5 for the third value', function () {
            expect(kiArray[2]).to.be.above(-1);
            expect(kiArray[2]).to.be.below(6);
        });
    });

    describe('generateTypedKi()', function () {
        let kiArray = DokkanSim.generateTypedKi();
        it('should return a number', function () {
            expect(kiArray).to.be.an('Number');
        });
        it('should return a number between 1 and 8', function () {
            expect(kiArray).to.be.above(0);
            expect(kiArray).to.be.below(9);
        });
    });

    describe('generateKiType()', function () {
        let kiType = DokkanSim.generateKiType();
        it('should return a string', function () {
            expect(kiType).to.be.an('String');
        });

        it('should return a string contained in the types array', function () {
            let typesArray = ['PHY', 'INT', 'TEQ', 'AGL', 'STR'];
            expect(typesArray).to.include(kiType);
        });
    });

    describe('generateRainbowKi()', function () {
        let rainbowKi = DokkanSim.generateRainbowKi();
        it('should return a number', function () {
            expect(rainbowKi).to.be.an('Number');
        });

        it('should return a number between 0 and 5', function () {
            expect(rainbowKi).to.be.above(-1);
            expect(rainbowKi).to.be.below(6);
        });
    });

    describe('setCurrentKi()', function () {
        it('should return a card object', function () {
            expect(DokkanSim.setCurrentKi(singleCardEverything, [1, 'PHY', 1])).to.be.an('Object');
        });

        it('should return a card with the correct currentKi value', function () {
            expect(singleCardEverything['currentKi']).to.equal(11);
        });
    });

    describe('checkMaxKi()', function () {
        it('should return a card object', function () {
            expect(DokkanSim.checkMaxKi(singleCardEverything)).to.be.an('Object');
        });

        it('should return a card where the currentKi is not higher than the maxKi', function () {
            expect(singleCardEverything['currentKi']).to.be.lte(singleCardEverything['maxKi']);
        });
    });

    describe('setCurrentKiMultiplier()', function () {
        it('should return the card object', function () {
            singleCardEverything['currentKi'] = 11;
            expect(DokkanSim.setCurrentKiMultiplier(singleCardEverything)).to.be.an('Object');
        });

        it('should set the currentKiMultiplier to the correct value', function () {
            expect(singleCardEverything['currentKiMultiplier']).to.equal(1.4375);
        });
    });

    describe('applyCurrentKiMultiplier', function () {
        it('should set the currentAttack to the correct value', function () {
            DokkanSim.applyCurrentKiMultiplier(singleCardEverything)
            expect(singleCardEverything['currentAttack']).to.equal(37375);
        });
    });


    describe('applyBuildUpPassive()', function () {
        it('should return a card with the correct updated currentAttack', function () {
            expect(DokkanSim.applyBuildUpPassive(singleCardEverything)['currentAttack']).to.equal(41112.5);
        });

        it('should return a card with the correct unchanged currentAttack', function () {
            expect(DokkanSim.applyBuildUpPassive(singleCardMinimum)['currentAttack']).to.equal(5000);
        });
    });


    // describe('', function() {
    //     it('should', function(){

    //     });
    // });
});