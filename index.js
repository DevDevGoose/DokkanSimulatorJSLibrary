// --- Order of operations ---
// Percentage-based leader skills CHECK
// Flat leader skills CHECK
// Percentage-based start of turn passives CHECK
// This is where start of turn +ATK support passives go. CHECK
// This is also where nuking style passives are factored in. CHECK
// Flat start of turn passives CHECK
// Percentage-based links CHECK
// Flat links CHECK
// Ki multiplier CHECK
// Build-up passives CHECK
// On Attack/on SA percentage-based passives
// On Attack/on SA flat passives

// SA multiplier
// SA-based ATK increases are factored in here as flat additions to the SA multiplier.


// TODO: Refactor - Create function for 'applyMultiplier(card,multiplierName)' and 'applyFlat(card,flatName)'
// passing the name of the arguments from an array being looped over for the correct order of operations

// TODO: Cards functions need to work in single and team environment
// TODO: Check whether SA Based ally buffs are calculated in the team support passives or SA Multiplier sections.

// TODO: Make additionals not have on SA passives if not an SA

class DokkanSim {

  // Returns an array containing a hash for each attack
  // Requires: [validCardObjectHash, number, [leaderKi, leaderAttackPercentage, leaderAttackFlat, leaderNukeFunction], [leaderKi, leaderAttackPercentage, leaderAttackFlat, leaderNukeFunction], ['linkName1','linkName2','etc'],[numberFlatKi, numberFlatAttack, numberPercentageAttack]]
  static singleSim(card, turnMaxInt, leaderSkillOneArray, leaderSkillTwoArray, activeLinksArray, teamPassivesArray) {
    let damageArray = [];
    let linkSkillData = { 'Fierce Battle': ['percentage', 0.15], 'Hero of Justice': ['percentage', 0.25], 'Legendary Power': ['flat', 5000] };
    let leaderKi = leaderSkillOneArray[0] + leaderSkillTwoArray[0];
    let leaderAttackPercentage = 1 + leaderSkillOneArray[1] + leaderSkillTwoArray[1];
    let leaderAttackFlat = leaderSkillOneArray[2] + leaderSkillTwoArray[2];
    let leaderNuke = [];

    if (leaderSkillOneArray[3]) {
      leaderNuke.push(leaderSkillOneArray[3]);
    }
    if (leaderSkillTwoArray[3]) {
      leaderNuke.push(leaderSkillTwoArray[3]);
    }

    card['baseKi'] = card['baseKi'] + leaderKi;
    card['currentKi'] = card['baseKi']
    card['baseAttack'] = card['baseAttack'] * leaderAttackPercentage;
    card['baseAttack'] = card['baseAttack'] + leaderAttackFlat;

    for (let turnCount = 1; turnCount <= turnMaxInt; turnCount++) {

      // Resetting / initializing
      card['currentKi'] = card['baseKi'];
      card['currentAttack'] = card['baseAttack'];
      // this.evaluateTurnBuffs(turnBuffs, turnCount);
      let turnCrit = false;
      let turnAdditional = false;
      let attackCount = 1;
      let kiArray = this.generateKiArray();
      let turnDamage = { 'turn_count': turnCount, 'damage_info': [] };
      let damageHash = { 'attack_count': attackCount, 'attack_value': 0, 'SA': false, 'crit': 0, 'ki': 0 };
      let percentageNukeIncrease = 0;
      let flatNukeIncrease = 0;
      let SA = false;
      let normalAttack = 0;
      let SAAttack = 0;

      this.setCurrentKi(card, kiArray);
      this.checkMaxKi(card);
      if (leaderNuke.length > 0) {
        percentageNukeIncrease = this.getNukePercentageSkillIncrease(card, kiArray) + this.getNukeLeaderIncrease(leaderNuke, kiArray);
      } else {
        percentageNukeIncrease = this.getNukeSkillIncrease(card, kiArray);
      }
      flatNukeIncrease = this.getNukeFlatIncrease(card, kiArray);
      this.activatePercentageTurnStartSkill(card, percentageNukeIncrease);
      this.applyPercentageTeamPassive(card, teamPassivesArray);
      this.applyFlatTeamPassive(card, teamPassivesArray);
      this.activateFlatTurnStartSkill(card, flatNukeIncrease);
      this.activatePercentageLinkSkills(card, activeLinksArray, linkSkillData);
      this.activateFlatLinkSkills(card, activeLinksArray, linkSkillData);
      this.activateKiLinkSkills(card, activeLinksArray, linkSkillData);
      this.checkMaxKi(card);
      this.setCurrentKiMultiplier(card);
      this.applyCurrentKiMultiplier(card);
      this.applyBuildUpPassive(card);
      this.activateMultipleSA(card);
      this.activateSABasedBuff(card);

      if (card['currentKi'] >= card['minSAKi']) {
        SA = true;
        SAAttack = this.getSAAttack(card);
      } else {
        normalAttack = this.getNormalAttack(card);
      }
      // Checking for crits
      if (card.builtInCritChance) {
        turnCrit = card.builtInCritChance();
      }
      if (!turnCrit) {
        turnCrit = this.potentialSkillactivation(card, 'crit');
      }
      if (turnCrit) {
        if (SA) {
          damageHash.attack_value = this.critAttack(SAAttack);
        } else {
          damageHash.attack_value = this.critAttack(normalAttack);
        }
      } else {
        if (SA) {
          damageHash.attack_value = SAAttack;
        } else {
          damageHash.attack_value = normalAttack;
        }
      }
      // Writing turn stats to damageArray
      damageHash.SA = SA;
      damageHash.crit = turnCrit;
      damageHash.ki = card['currentKi'];
      turnDamage.damage_info.push(damageHash);
      // Handles additional attacks
      turnAdditional = this.potentialSkillactivation(card, 'aa');
      if (turnAdditional) {
        let additionalCrit = false;
        let additionalSA = this.additionalSARandomiser();
        attackCount++;
        let additionalDamageHash = { 'attack_count': attackCount, 'attack_value': 0, 'SA': false, 'crit': 0, 'ki': 0 }
        attackCount++;
        if (additionalSA) {
          card['currentKi'] = card['minSAKi'];
          this.activateMultipleSA(card);
          SAAttack = this.getSAAttack(card);
        } else {
          normalAttack = this.getNormalAttack(card);
        }
        if (card.builtInCritChance) {
          additionalCrit = card.builtInCritChance();
        }
        if (!additionalCrit) {
          additionalCrit = this.potentialSkillactivation(card, 'crit');
        }
        if (additionalSA) {
          if (additionalCrit) {
            additionalDamageHash.attack_value = this.critAttack(SAAttack);
          } else {
            additionalDamageHash.attack_value = SAAttack;
          }
        } else {
          if (additionalCrit) {
            additionalDamageHash.attack_value = this.critAttack(normalAttack);
          } else {
            additionalDamageHash.attack_value = normalAttack;
          }
        }
        additionalDamageHash.SA = additionalSA;
        additionalDamageHash.crit = additionalCrit;
        additionalDamageHash.ki = card['currentKi'];
        turnDamage.damage_info.push(additionalDamageHash);
      }
      damageArray.push(turnDamage);
    }
    return damageArray;
  }


  static teamSim(teamArray, turnMaxInt, leaderSkillOnePosition, leaderSkillTwoPosition) {
    let damageArray = [{ 'total_damage': 0, 'team': teamArray, 'leader_one': teamArray[leaderSkillOnePosition].title + " - " + teamArray[leaderSkillOnePosition].name, 'leader_two': teamArray[leaderSkillTwoPosition].title + " - " + teamArray[leaderSkillTwoPosition].name, 'turn_info': [] }];
    let linkSkillData = { 'Fierce Battle': ['percentage', 0.15], 'Hero of Justice': ['percentage', 0.25], 'Legendary Power': ['super', 5000], 'Shocking Speed': ['ki', 2] };
    this.teamActivateLeaderSkills(teamArray, leaderSkillOnePosition, leaderSkillTwoPosition);
    for (let turnCount = 1; turnCount <= turnMaxInt; turnCount++) {
      let currentRotation = this.currentRotationGetter(teamArray, turnCount);
      let teamKiArray = [this.generateKiArray(), this.generateKiArray(), this.generateKiArray()];
      let teamPassivesArray = this.getTeamPassives(currentRotation);
      let activeLinksArray = this.getActiveLinks(currentRotation);
      let turnDamage = { 'turn_count': turnCount, 'rotation': currentRotation, 'active_links': activeLinksArray, 'total_damage': 0, 'damage_info': [] };
      for (let i = 0; i < currentRotation.length; i++) {
        let attackCount = 1;
        let damageHash = { 'character': currentRotation[i].name, 'attack_count': attackCount, 'attack_value': 0, 'SA': false, 'crit': false, 'ki': 0 };
        let SA = false;
        let turnCrit = false;
        let turnAdditional = false;
        let percentageNukeIncrease = 0;
        let flatNukeIncrease = 0;
        let normalAttack = 0;
        let SAAttack = 0;
        currentRotation[i]['currentKi'] = currentRotation[i]['baseKi'];
        currentRotation[i]['currentAttack'] = currentRotation[i]['baseAttack'];
        this.setCurrentKi(currentRotation[i], teamKiArray[i]);
        this.checkMaxKi(currentRotation[i]);
        if (currentRotation[i]['leaderNukeBoost'] || currentRotation[i]['nukePercentage']) {
          // TODO fix getNukeLeaderIncrease to work with card property ['leaderNukeBoost'] which contains an array ['orbType', boostPercentagePerOrb]
          percentageNukeIncrease = this.getNukePercentageSkillIncrease(currentRotation[i], teamKiArray[i]) + this.getNukeLeaderIncrease(currentRotation[i], teamKiArray[i]);
        } else {
          percentageNukeIncrease = this.getNukeSkillIncrease(currentRotation[i], teamKiArray[i]);
        }
        flatNukeIncrease = this.getNukeFlatIncrease(currentRotation[i], teamKiArray[i]);
        this.activatePercentageTurnStartSkill(currentRotation[i], percentageNukeIncrease);
        this.applyPercentageTeamPassive(currentRotation[i], teamPassivesArray);
        this.applyFlatTeamPassive(currentRotation[i], teamPassivesArray);
        this.activateFlatTurnStartSkill(currentRotation[i], flatNukeIncrease);
        this.activatePercentageLinkSkills(currentRotation[i], activeLinksArray[i], linkSkillData);
        this.activateFlatLinkSkills(currentRotation[i], activeLinksArray[i], linkSkillData);
        this.activateKiLinkSkills(currentRotation[i], activeLinksArray[i], linkSkillData);
        this.checkMaxKi(currentRotation[i]);
        this.setCurrentKiMultiplier(currentRotation[i]);
        this.applyCurrentKiMultiplier(currentRotation[i]);


        this.applyBuildUpPassive(currentRotation[i]);
        this.activateMultipleSA(currentRotation[i]);
        this.activateSABasedBuff(currentRotation[i]);


        if (currentRotation[i]['currentKi'] >= currentRotation[i]['minSAKi']) {
          SA = true;
          SAAttack = this.getSAAttack(currentRotation[i]);
        } else {
          normalAttack = this.getNormalAttack(currentRotation[i]);
        }
        // Checking for crits
        if (currentRotation[i].builtInCritChance) {
          turnCrit = currentRotation[i].builtInCritChance();
        }
        if (!turnCrit) {
          turnCrit = this.potentialSkillactivation(currentRotation[i], 'crit');
        }
        if (turnCrit) {
          if (SA) {
            damageHash.attack_value = this.critAttack(SAAttack);
          } else {
            damageHash.attack_value = this.critAttack(normalAttack);
          }
        } else {
          if (SA) {
            damageHash.attack_value = SAAttack;
          } else {
            damageHash.attack_value = normalAttack;
          }
        }
        // Writing turn stats to damageArray
        damageHash.SA = SA;
        damageHash.crit = turnCrit;
        damageHash.ki = currentRotation[i]['currentKi'];
        turnDamage.damage_info.push(damageHash);
        // Handles additional attacks
        turnAdditional = this.potentialSkillactivation(currentRotation[i], 'aa');
        if (turnAdditional) {
          let additionalCrit = false;
          let additionalSA = this.additionalSARandomiser();
          attackCount++;
          let additionalDamageHash = { 'character': currentRotation[i].name, 'attack_count': attackCount, 'attack_value': 0, 'SA': false, 'crit': false, 'ki': 0 }
          attackCount++;
          if (additionalSA) {
            currentRotation[i]['currentKi'] = currentRotation[i]['minSAKi'];
            this.activateMultipleSA(currentRotation[i]);
            SAAttack = this.getSAAttack(currentRotation[i]);
          } else {
            normalAttack = this.getNormalAttack(currentRotation[i]);
          }
          if (currentRotation[i].builtInCritChance) {
            additionalCrit = currentRotation[i].builtInCritChance();
          }
          if (!additionalCrit) {
            additionalCrit = this.potentialSkillactivation(currentRotation[i], 'crit');
          }
          if (additionalSA) {
            if (additionalCrit) {
              additionalDamageHash.attack_value = this.critAttack(SAAttack);
            } else {
              additionalDamageHash.attack_value = SAAttack;
            }
          } else {
            if (additionalCrit) {
              additionalDamageHash.attack_value = this.critAttack(normalAttack);
            } else {
              additionalDamageHash.attack_value = normalAttack;
            }
          }
          additionalDamageHash.SA = additionalSA;
          additionalDamageHash.crit = additionalCrit;
          additionalDamageHash.ki = currentRotation[i]['currentKi'];
          turnDamage.damage_info.push(additionalDamageHash);
        }
      }
      for (let i = 0; i < turnDamage.damage_info.length; i++) {
        turnDamage['total_damage'] = turnDamage['total_damage'] + turnDamage.damage_info[i].attack_value;
      }
      damageArray[0]['turn_info'].push(turnDamage);
    }
    console.log(damageArray[0].turn_info[1]);

    for (let i = 0; i < damageArray[0].turn_info.length; i++) {
      damageArray[0]['total_damage'] = damageArray[0]['total_damage'] + damageArray[0].turn_info[i].total_damage;
    }
    return damageArray;
  }

  // Expects cards to have the following leaderSkillFunction, leaderPercentageAttack, leaderFlatAttack, baseAttack.
  // Leader functions may expect type, class, categories, leaderPercentageAttack, leaderFlatAttack, baseKi
  // Leader functions should make changes to the leaderPercentageAttack or leaderFlatAttack and baseKi attributes.
  // Runs a card through each leader skill which checks conditions, increases ki, and changes leaderValues on the card, then activates the percentage followed by flat leaderValue increases.
  static teamActivateLeaderSkills(teamArray, leaderSkillOnePosition, leaderSkillTwoPosition) {
    for (let i = 0; i < teamArray.length; i++) {
      teamArray[leaderSkillOnePosition].leaderSkillFunction(teamArray[i])
      teamArray[leaderSkillTwoPosition].leaderSkillFunction(teamArray[i])
      teamArray[i]['baseAttack'] = teamArray[i]['baseAttack'] * teamArray[i]['leaderPercentageAttack'];
      teamArray[i]['baseAttack'] = teamArray[i]['baseAttack'] + teamArray[i]['leaderFlatAttack'];
    }
    return teamArray;
  }


  static getTeamPassives(currentRotation) {
    let passivesArray = [0, 0, 0];
    for (let i = 0; i < currentRotation.length; i++) {
      if (currentRotation[i].teamPassiveKi) {
        passivesArray[0] = passivesArray[0] + currentRotation[i].teamPassiveKi;
      }
      if (currentRotation[i].teamPassivePercentage) {
        passivesArray[0] = passivesArray[0] + currentRotation[i].teamPassivePercentage;
      }
      if (currentRotation[i].teamPassiveFlat) {
        passivesArray[0] = passivesArray[0] + currentRotation[i].teamPassiveFlat;
      }
    }
    return passivesArray;
  }

  // Returns multidimensional array, each top level index being an array filled with strings for the names of the active link skills
  // e.g. [['Fierce Battle', 'Shocking Speed'],['Fierce Battle', 'Shocking Speed', 'Shocking Speed'],['Fierce Battle', 'Shocking Speed']]
  static getActiveLinks(currentRotation) {
    let linksArray = [[], [], []];
    for (let i = 0; i < currentRotation.length; i++) {
      for (let j = 0; j < currentRotation[i].kiLinks.length; j++) {
        //Handles the previous character slot
        // IF - Checks that the current character isn't first in the rotation, checks the previous character doesn't share the same name, checks if the previous character has the same link skill, checks the link skill isn't already in the array if not ki link
        
        
        if ((i - 1) >= 0 && currentRotation[(i - 1)].name != currentRotation[i].name && currentRotation[(i - 1)].kiLinks.includes(currentRotation[i].kiLinks[j]) && (!linksArray[i].includes(currentRotation[i].kiLinks[j]) || currentRotation[i].kiLinks[j] === 'ki')) {
          linksArray[i].push(currentRotation[i].kiLinks[j]);
          // console.log(currentRotation[(i-1)].name);
        }
        // Handles the next character slot
        if ((i + 1) <= 2 && currentRotation[(i + 1)].name != currentRotation[i].name && currentRotation[(i + 1)]['kiLinks'].includes(currentRotation[i].kiLinks[j]) && (!linksArray[i].includes(currentRotation[i].kiLinks[j]) || currentRotation[i].kiLinks[j] === 'ki')) {
          linksArray[i].push(currentRotation[i].kiLinks[j]);
          console.log(currentRotation[(i)].name + "---" +currentRotation[(i+1)].name);
        }
      }
    } 
    console.log(linksArray);
    
    return linksArray;
  }

  // Uses modular maths to find the current rotation and floater depending upon the current turnCount.
  static currentRotationGetter(teamArray, turnCount) {
    let currentRotation = [];
    if (turnCount % 2 === 0) {
      currentRotation = currentRotation.concat(teamArray[2]).concat(teamArray[3]).concat(teamArray[((turnCount - 1) % 3) + 4]);
    }
    else {
      currentRotation = currentRotation.concat(teamArray[0]).concat(teamArray[1]).concat(teamArray[((turnCount - 1) % 3) + 4]);
    }
    return currentRotation;
  }

  static getSAAttack(card) {
    let SAAttack = card['currentAttack'] * (1 + this.activateOnSAPercentage(card) + this.activateOnAttackPercentage(card));
    SAAttack = SAAttack + this.activateOnSAFlat(card) + this.activateOnAttackFlat(card);
    SAAttack = SAAttack * (card['SAMultiplier'] + this.getCurrentSABasedBuff(card));
    return Math.round(SAAttack);
  }

  static getNormalAttack(card) {
    let normalAttack = card['currentAttack'] * (1 + this.activateOnAttackPercentage(card));


    normalAttack = normalAttack + this.activateOnAttackFlat(card);
    normalAttack = Math.round(normalAttack * (1 + this.getCurrentSABasedBuff(card)));
    return normalAttack;
  }


  // Checks if the character has a turnStart skill and runs it if so.
  // Expected card.percentageTurnStart() to return a number representing the increase amount. i.e. 50% should return 0.5
  static activatePercentageTurnStartSkill(card, nukeIncrease) {
    let increase = 1 + nukeIncrease;
    if (card.percentageTurnStartSkill > 0) {
      increase = increase + card['percentageTurnStartSkill'];
    }
    card['currentAttack'] = card['currentAttack'] * increase;
    return card;
  }

  static applyFlatTeamPassive(card, teamPassivesArray) {
    card.currentKi = card.currentKi + teamPassivesArray[0];
    card.currentAttack = card.currentAttack + teamPassivesArray[1];
    return card;
  }
  // check % calc
  static applyPercentageTeamPassive(card, teamPassivesArray) {
    card.currentAttack = card.currentAttack * (1 + teamPassivesArray[2]);
    return card;
  }

  static generateKiArray() {
    let kiArray = [];
    kiArray.push(this.generateTypedKi());
    kiArray.push(this.generateKiType());
    kiArray.push(this.generateRainbowKi());
    return kiArray;
  }

  // Called in generateKiArray()
  // Returns a number
  static generateTypedKi() {
    // First number is the amount of ki, second is the chance of that number appearing. 
    // Adjust as needed.
    let weighting = { 1: 0.1, 2: 0.2, 3: 0.3, 4: 0.2, 5: 0.1, 6: 0.05, 7: 0.025, 8: 0.025 };
    let i;
    let table = [];
    for (i in weighting) {
      // The numbers the weighting is multiplied against should be equal
      // to the degree of accuracy of the values
      for (let j = 0; j < weighting[i] * 100; j++) {
        table.push(i);
      }
    }
    // Creates random number between 0 and the length of the table array
    let k = Math.floor(Math.random() * table.length);
    return parseInt(table[k]);
  }

  static generateKiType() {
    let typesArray = ['PHY', 'INT', 'TEQ', 'AGL', 'STR'];
    let l = Math.floor(Math.random() * typesArray.length);
    return typesArray[l];
  }
  static generateRainbowKi() {
    let weight = { 0: 0.3, 1: 0.2, 2: 0.1, 3: 0.1, 4: 0.1, 5: 0.1 };
    let i;
    let table = [];
    for (i in weight) {
      // The numbers the weighting is multiplied against should be equal
      // to the degree of accuracy of the values
      for (let j = 0; j < weight[i] * 100; j++) {
        table.push(i);
      }
    }
    // Creates random number between 0 and the length of the table array
    let k = Math.floor(Math.random() * table.length);
    return parseInt(table[k]);
  }


  static setCurrentKi(card, kiArray) {
    let bonusKi = 0;
    // Checks if the card has a bonus skill and runs it if so.
    // Expects a number to be returned that represents the number of additional ki.
    // e.g. LR SV gains +2 ki per rainbow orb. Given 2 rainbow orbs will return 4 to bonusKi
    // e.g. cont. the standard ki is calculated later in this function for the total of +6 ki 
    if (card.kiBonusSkill) {
      bonusKi = card.kiBonusSkill(kiArray);
    }
    // Doubles the amount of ki from orbs that are the same type as the char
    if (card['type'] === kiArray[1]) {
      kiArray[0] *= 2;
    }
    // Sets the currentKi
    card['currentKi'] = card['currentKi'] + kiArray[0] + kiArray[2] + bonusKi;
    return card;
  }

  // Makes sure the ki doesn't go higher than the max for that char
  static checkMaxKi(card) {
    if (card['currentKi'] > card['maxKi']) {
      card['currentKi'] = card['maxKi'];
    }
    return card;
  }

  // Requires a card and another array containing ki information
  // Each nukeSkill function should return a number representing the % increase in attack.
  // Returns a number 
  static getNukeSkillIncrease(card, kiArray) {
    let increase = 0;
    if (card.percentageNukeSkill) {
      increase = card.percentageNukeSkill(kiArray);
    }
    return increase;
  }


  // Requires an array containing functions and another array containing ki information
  // Each leader function should return a number representing the % increase in attack.
  // Returns a number 
  static getNukeLeaderIncrease(nukeLeaderArray, kiArray) {
    let increase = 0;
    for (let i = 0; i < nukeLeaderArray.length; i++) {
      increase = increase + nukeLeaderArray[i](kiArray);
    }
    return increase;
  }

  static getNukeFlatIncrease(card, kiArray) {
    let increase = 0;
    if (card.flatNukeSkill) {
      increase = card.flatNukeSkill(kiArray);
    }
    return increase;
  }

  static activateFlatTurnStartSkill(card) {
    if (card.flatTurnStart) {
      card.flatTurnStart();
    }
    return card;
  }

  // Requires an array of the format:
  // ['Link Skill 1 Name', 'Link Skill 2 Name', 'etc']
  // Matches the name to the JSON store of links.
  static activatePercentageLinkSkills(card, activeLinksArray, linkSkillData) {
    let percentage = 1;
    for (let i = 0; i < activeLinksArray.length; i++) {
      if (linkSkillData[activeLinksArray[i]][0] === 'percentage') {
        percentage = percentage + linkSkillData[activeLinksArray[i]][1]
      }
    }
    card['currentAttack'] = Math.round(card['currentAttack'] * percentage);
    return card;
  }

  // Also actives "on Super" links such as Kamehameha. To be changed if any new super links added which aren't flat attack boost.
  static activateFlatLinkSkills(card, activeLinksArray, linkSkillData) {
    let flat = 0;
    for (let i = 0; i < activeLinksArray.length; i++) {
      if (linkSkillData[activeLinksArray[i]][0] === 'flat') {
        flat = flat + linkSkillData[activeLinksArray[i]][1]
      }
      if (linkSkillData[activeLinksArray[i]][0] === 'super' && card.currentKi >= card.minSAKi) {
        flat = flat + linkSkillData[activeLinksArray[i]][1]
      }
    }
    card['currentAttack'] = card['currentAttack'] + flat;
    return card;
  }

  static activateKiLinkSkills(card, activeLinksArray, linkSkillData) {
    let ki = 0;
    for (let i = 0; i < activeLinksArray.length; i++) {
      if (linkSkillData[activeLinksArray[i]][0] === 'ki') {
        ki = ki + linkSkillData[activeLinksArray[i]][1]
      }
    }
    card['currentKi'] = card['currentKi'] + ki;
    return card;
  }

  static setCurrentKiMultiplier(card) {
    // TODO Rework for LR supers above 12 ki
    if (card.currentKi > 12) {
      let percentageIncrease = (200 - card['12KiMultiplier']) / 12;
      let kiIncrease = card.currentKi - 12;
      let multiplierIncrease = percentageIncrease * kiIncrease;
      card['currentKiMultiplier'] = (card['12KiMultiplier'] + multiplierIncrease) / 100;
    } else {
      // e.g. 150% - 100 % / 12 - 4 = 6.25%
      let perKiMultiplier = (card['12KiMultiplier'] - 100) / (12 - card['neutralKiMultiplierValue']);
      // e.g. 11 - 4 = 7
      let kiPastNeutral = card['currentKi'] - card['neutralKiMultiplierValue'];
      // e.g. 6.25% * 7 + 100 / 100 = 1.4375%
      card['currentKiMultiplier'] = ((perKiMultiplier * kiPastNeutral + 100) / 100);
    }
    return card;
  }

  static applyCurrentKiMultiplier(card) {
    card['currentAttack'] = Math.round(card['currentAttack'] * card['currentKiMultiplier']);
    return card;
  }

  static applyBuildUpPassive(card) {
    if (card.buildUpPassive) {
      card['currentAttack'] = Math.round(card['currentAttack'] * card['buildUpPassive']);
    }
    return card;
  }

  static activateOnAttackPercentage(card) {
    let percentage = 0;
    if (card.onAttackPercentage) {
      percentage = card.onAttackPercentage();
    }
    return percentage;
  }

  static activateOnSAPercentage(card) {
    let percentage = 0;
    if (card.onSAPercentage) {
      percentage = card.onSAPercentage();
    }
    return percentage;
  }

  static activateOnAttackFlat(card) {
    let attack = 0;
    if (card.onAttackFlat) {
      attack = card.onAttackFlat();
    }
    return attack;
  }

  static activateOnSAFlat(card) {
    let attack = 0;
    if (card.onSAFlat) {
      attack = card.onSAFlat();
    }
    return attack;
  }

  static activateMultipleSA(card) {
    if (card.multipleSA) {
      card.multipleSA();
    }
    return card;
  }

  // Runs the function required to set any SABasedBuff.
  // Standard SABasedBuff should be in the format [numberFloatRepresentingPercentageIncrease, numberTurnsRemainingOfBuff]
  // Function should always (unless Kaioken) subtract 1 from the turns remaining and remove any with a value of 0. 
  // REWORK if team SA Based Buffs also apply here. e.g. TEQ Vegito +25% to allies on SA
  static activateSABasedBuff(card) {
    if (card.SABasedBuffFunction) {
      card.SABasedBuffFunction();
    }
    return card;
  }

  static getCurrentSABasedBuff(card) {
    let totalBuff = 0;

    if (card.SABasedBuff.length > 0) {

      for (let i = 0; i < card.SABasedBuff.length; i++) {
        totalBuff = totalBuff + card.SABasedBuff[i][0];
      }
    }
    return totalBuff;
  }

  // Returns a boolean based on whether the skill should activate or not
  static potentialSkillactivation(card, skillName) {
    let randomNumber = Math.floor(Math.random() * 100);
    if (randomNumber <= (card[skillName] * 2)) {
      return true;
    } else {
      return false;
    }
  }

  static additionalSARandomiser() {
    let random = Math.random();
    if (random >= 0.5) {
      return true;
    } else
      return false;
  }

  static critAttack(attackValue) {
    return Math.round(attackValue * 1.9);

  }
}
module.exports = DokkanSim;
