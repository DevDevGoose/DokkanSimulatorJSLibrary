// --- Order of operations ---
// Percentage-based leader skills
// Flat leader skills
// Percentage-based start of turn passives
// This is where start of turn +ATK support passives go.
// This is also where nuking style passives are factored in.
// Flat start of turn passives
// Percentage-based links
// Flat links
// Ki multiplier
// Build-up passives
// On Attack/on SA percentage-based passives
// On Attack/on SA flat passives
// SA multiplier
// SA-based ATK increases are factored in here as flat additions to the SA multiplier.


class DokkanSim {

  // Returns an array containing a hash for each attack
  // Requires: [validCardObjectHash, number, [leaderKi, leaderAttackPercentage, leaderAttackFlat, leaderNukeFunction], [leaderKi, leaderAttackPercentage, leaderAttackFlat, leaderNukeFunction], ['linkName1','linkName2','etc'],[numberFlatKi, numberFlatAttack, numberPercentageAttack]]
  static singleSim(card, turnMaxInt, leaderSkillOneArray, leaderSkillTwoArray, activeLinksArray, teamPassivesArray) {
    let damageArray = [];
    let linkSkillData = { 'Fierce Battle': ['percentage', 0.15], 'Big Bad Bosses':['percentage', 0.25], 'Brainiacs': ['percentage', 0.10], 'Majin': ['percentage', 0.10], 'Berserker': ['percentage', 0.20], 'Blazing Battle': ['percentage', 0.15], 'Bombardment': ['percentage', 0.15], 'Brutal Beatdown': ['percentage', 0.10], 'Budding Warrior': ['percentage', 0.10], 'Cooras Armored Squad': ['percentage', 0.25], 'Deficit Boost': ['percentage', 0.15], 'Demon Duo': ['percentage', 0.20], 'Destroyer of the Universe': ['percentage', 0.25], 'Experienced Fighters': ['percentage', 0.10], 'Formidable Enemy': ['percentage', 0.10], 'Galactic Warriors': ['percentage', 0.20], 'Godly Power': ['percentage', 0.15], 'Guidance of the Dragon Balls': ['percentage', 0.20], 'Hero of Justice': ['percentage', 0.25], 'Infighter': ['percentage', 10], 'Master of Magic': ['percentage', 0.15], 'Nightmare': ['percentage', 0.10], 'Over 9000': ['percentage', 0.10], 'Penguin Village Adventure': ['percentage', 0.15], 'Prodigies': ['percentage', 0.10], 'Rival Duo': ['percentage', 0.10], 'Saiyan Pride': ['percentage', 0.15], 'Saiyan Roar': ['percentage', 0.25], 'Shadow Dragons': ['percentage', 0.15], 'Super-God Combat': ['percentage', 0.15], 'Super Saiyan': ['percentage', 0.10], 'Super Strike': ['percentage', 0.20], 'The First Awakened': ['percentage', 0.25], 'The Ginyu Force': ['percentage', 0.25], 'The Innocents': ['percentage', 0.1], 'The Wall Standing Tall': ['percentage', 0.15], 'Thirst for Conquest': ['percentage', 0.15], 'Universes Most Malevolent': ['percentage', 0.15], 'Warrior Gods': ['percentage', 0.1], 'Xenoverse': ['percentage', 0.2], 'Z Fighters': ['percentage', 0.15], 'Supreme Power': ['flat', 1000], 'Tutle School': ['flat', 500], 'Crane School': ['flat', 500], 'Friezas Minion': ['flat', 300], 'Messenger from the Future': ['flat', 500], 'More Than Meets the Eye': ['flat', 300], 'New': ['flat', 200], 'Respect': ['flat', 500], 'Resurrection F': ['flat', 700], 'RR Army': ['flat', 300], 'Saiyan Warrior Race': ['flat', 700], 'Speedy Retribution': ['flat', 300], 'Tag Team of Terror': ['flat', 500], 'World Tournament Reborn': ['flat', 300], 'Dondon Ray': ['super', 2000], 'Kamehameha': ['super', 2500], 'Legendary Power': ['super', 5000], 'Limit-Breaking Form': ['super', 2500], 'Power Bestowed by God': ['super', 2500], 'Attack of the Clones': ['ki', 1], 'Battlefield Diva': ['ki', 2], 'Best Buddies': ['ki', 1], 'Cooras Underling': ['ki', 1], 'Courage': ['ki', 1], 'Coward': ['ki', 1], 'Demon': ['ki', 1], 'Dismal Future': ['ki', 1], 'Energy Absorption': ['ki', 2], 'Evil Autocrats': ['ki', 1], 'Family Ties': ['ki', 2], 'Fear and Faith': ['ki', 2], 'Flee': ['ki', 1], 'Golden Warrior': ['ki', 1], 'Fortuneteller Babas Fighter': ['ki', 2], 'Fused Fighter': ['ki', 2], 'Fusion': ['ki', 2], 'GT': ['ki', 2], 'Galactic Visitor': ['ki', 1], 'Gaze of Respect': ['ki', 2], 'Gentleman': ['ki', 2], 'Golden Z-Fighter': ['ki', 2], 'Hardened Grudge': ['ki', 1], 'Hatred of Saiyans': ['ki', 2], 'Infinite Energy': ['ki', 2], 'Loyalty': ['ki', 1], 'Majin Resurrection Plan': ['ki', 2], 'Master and Pupil': ['ki', 1], 'Mechnical Menaces': ['ki', 1], 'Money Money Money': ['ki', 1], 'Organic Upgrade': ['ki', 2], 'Over in a Flash': ['ki', 3], 'Patrol': ['ki', 2], 'Prepared for Battle': ['ki', 2], 'Revival': ['ki', 2], 'Royal Lineage': ['ki', 1], 'Scientist': ['ki', 2], 'Shattering the Limit': ['ki', 2], 'Shocking Speed': ['ki', 2], 'Signature Pose': ['ki', 2], 'Soul vs Soul': ['ki', 1], 'Strength in Unity': ['ki', 1], 'Strongest Clan in Space': ['ki', 2], 'Supreme Warrior': ['ki', 1], 'Team Bardock': ['ki', 1], 'Team Turles': ['ki', 1], 'The Hera Clan': ['ki', 2], 'Champions Strength': ['ki', 1], 'The Incredible Adventure': ['ki', 2], 'The Saiyan Lineage': ['ki', 1], 'Transform': ['ki', 2], 'Twin Terrors': ['ki', 2], 'Ultimate Lifeform': ['ki', 2], 'Unbreakable Bond': ['ki', 2], 'Warriors of Universe 6': ['ki', 2], 'World Tournament Champion': ['ki', 1], 'Tournament of Power': ['ki', 3], };
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

  // Returns an array containing a hash with all of the damage done in that turn
  static teamSim(teamArray, turnMaxInt, leaderSkillOnePosition, leaderSkillTwoPosition) {
    let damageArray = [{ 'total_damage': 0, 'team': teamArray, 'leader_one': teamArray[leaderSkillOnePosition].title + " - " + teamArray[leaderSkillOnePosition].name, 'leader_two': teamArray[leaderSkillTwoPosition].title + " - " + teamArray[leaderSkillTwoPosition].name, 'turn_info': [] }];
    let linkSkillData = { 'Fierce Battle': ['percentage', 0.15], 'Big Bad Bosses':['percentage', 0.25], 'Brainiacs': ['percentage', 0.10], 'Majin': ['percentage', 0.10], 'Berserker': ['percentage', 0.20], 'Blazing Battle': ['percentage', 0.15], 'Bombardment': ['percentage', 0.15], 'Brutal Beatdown': ['percentage', 0.10], 'Budding Warrior': ['percentage', 0.10], 'Cooras Armored Squad': ['percentage', 0.25], 'Deficit Boost': ['percentage', 0.15], 'Demon Duo': ['percentage', 0.20], 'Destroyer of the Universe': ['percentage', 0.25], 'Experienced Fighters': ['percentage', 0.10], 'Formidable Enemy': ['percentage', 0.10], 'Galactic Warriors': ['percentage', 0.20], 'Godly Power': ['percentage', 0.15], 'Guidance of the Dragon Balls': ['percentage', 0.20], 'Hero of Justice': ['percentage', 0.25], 'Infighter': ['percentage', 10], 'Master of Magic': ['percentage', 0.15], 'Nightmare': ['percentage', 0.10], 'Over 9000': ['percentage', 0.10], 'Penguin Village Adventure': ['percentage', 0.15], 'Prodigies': ['percentage', 0.10], 'Rival Duo': ['percentage', 0.10], 'Saiyan Pride': ['percentage', 0.15], 'Saiyan Roar': ['percentage', 0.25], 'Shadow Dragons': ['percentage', 0.15], 'Super-God Combat': ['percentage', 0.15], 'Super Saiyan': ['percentage', 0.10], 'Super Strike': ['percentage', 0.20], 'The First Awakened': ['percentage', 0.25], 'The Ginyu Force': ['percentage', 0.25], 'The Innocents': ['percentage', 0.1], 'The Wall Standing Tall': ['percentage', 0.15], 'Thirst for Conquest': ['percentage', 0.15], 'Universes Most Malevolent': ['percentage', 0.15], 'Warrior Gods': ['percentage', 0.1], 'Xenoverse': ['percentage', 0.2], 'Z Fighters': ['percentage', 0.15], 'Supreme Power': ['flat', 1000], 'Tutle School': ['flat', 500], 'Crane School': ['flat', 500], 'Friezas Minion': ['flat', 300], 'Messenger from the Future': ['flat', 500], 'More Than Meets the Eye': ['flat', 300], 'New': ['flat', 200], 'Respect': ['flat', 500], 'Resurrection F': ['flat', 700], 'RR Army': ['flat', 300], 'Saiyan Warrior Race': ['flat', 700], 'Speedy Retribution': ['flat', 300], 'Tag Team of Terror': ['flat', 500], 'World Tournament Reborn': ['flat', 300], 'Dondon Ray': ['super', 2000], 'Kamehameha': ['super', 2500], 'Legendary Power': ['super', 5000], 'Limit-Breaking Form': ['super', 2500], 'Power Bestowed by God': ['super', 2500], 'Attack of the Clones': ['ki', 1], 'Battlefield Diva': ['ki', 2], 'Best Buddies': ['ki', 1], 'Cooras Underling': ['ki', 1], 'Courage': ['ki', 1], 'Coward': ['ki', 1], 'Demon': ['ki', 1], 'Dismal Future': ['ki', 1], 'Energy Absorption': ['ki', 2], 'Evil Autocrats': ['ki', 1], 'Family Ties': ['ki', 2], 'Fear and Faith': ['ki', 2], 'Flee': ['ki', 1], 'Golden Warrior': ['ki', 1], 'Fortuneteller Babas Fighter': ['ki', 2], 'Fused Fighter': ['ki', 2], 'Fusion': ['ki', 2], 'GT': ['ki', 2], 'Galactic Visitor': ['ki', 1], 'Gaze of Respect': ['ki', 2], 'Gentleman': ['ki', 2], 'Golden Z-Fighter': ['ki', 2], 'Hardened Grudge': ['ki', 1], 'Hatred of Saiyans': ['ki', 2], 'Infinite Energy': ['ki', 2], 'Loyalty': ['ki', 1], 'Majin Resurrection Plan': ['ki', 2], 'Master and Pupil': ['ki', 1], 'Mechnical Menaces': ['ki', 1], 'Money Money Money': ['ki', 1], 'Organic Upgrade': ['ki', 2], 'Over in a Flash': ['ki', 3], 'Patrol': ['ki', 2], 'Prepared for Battle': ['ki', 2], 'Revival': ['ki', 2], 'Royal Lineage': ['ki', 1], 'Scientist': ['ki', 2], 'Shattering the Limit': ['ki', 2], 'Shocking Speed': ['ki', 2], 'Signature Pose': ['ki', 2], 'Soul vs Soul': ['ki', 1], 'Strength in Unity': ['ki', 1], 'Strongest Clan in Space': ['ki', 2], 'Supreme Warrior': ['ki', 1], 'Team Bardock': ['ki', 1], 'Team Turles': ['ki', 1], 'The Hera Clan': ['ki', 2], 'Champions Strength': ['ki', 1], 'The Incredible Adventure': ['ki', 2], 'The Saiyan Lineage': ['ki', 1], 'Transform': ['ki', 2], 'Twin Terrors': ['ki', 2], 'Ultimate Lifeform': ['ki', 2], 'Unbreakable Bond': ['ki', 2], 'Warriors of Universe 6': ['ki', 2], 'World Tournament Champion': ['ki', 1], 'Tournament of Power': ['ki', 3], };
    this.teamActivateLeaderSkills(teamArray, leaderSkillOnePosition, leaderSkillTwoPosition);
    // Simulates each turn
    for (let turnCount = 1; turnCount <= turnMaxInt; turnCount++) {
      let currentRotation = this.currentRotationGetter(teamArray, turnCount);
      let teamKiArray = [this.generateKiArray(), this.generateKiArray(), this.generateKiArray()];
      let teamPassivesArray = this.getTeamPassives(currentRotation);
      let activeLinksArray = this.getActiveLinks(currentRotation);
      let turnDamage = { 'turn_count': turnCount, 'rotation': currentRotation, 'active_links': activeLinksArray, 'total_damage': 0, 'damage_info': [] };
      // Simulates the turn for the current rotation
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
        this.setOptimalKi(currentRotation[i]);
        if (currentRotation[i]['leaderNukeBoost'] || currentRotation[i]['nukePercentage']) {
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
        this.setOptimalKi(currentRotation[i]);
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
      // Sums all of the damage done in the turn
      for (let i = 0; i < turnDamage.damage_info.length; i++) {
        turnDamage['total_damage'] = turnDamage['total_damage'] + turnDamage.damage_info[i].attack_value;
      }
      // Adds the turnDamage to the turn info
      damageArray[0]['turn_info'].push(turnDamage);
    }
    // Sums all of the damage done in each turn for the total damage done
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
      if (currentRotation[i].teamPassiveFlat) {
        passivesArray[1] = passivesArray[1] + currentRotation[i].teamPassiveFlat;
      }
      if (currentRotation[i].teamPassivePercentage) {
        passivesArray[2] = passivesArray[2] + currentRotation[i].teamPassivePercentage;
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
        }
        // Handles the next character slot
        if ((i + 1) <= 2 && currentRotation[(i + 1)].name != currentRotation[i].name && currentRotation[(i + 1)]['kiLinks'].includes(currentRotation[i].kiLinks[j]) && (!linksArray[i].includes(currentRotation[i].kiLinks[j]) || currentRotation[i].kiLinks[j] === 'ki')) {
          linksArray[i].push(currentRotation[i].kiLinks[j]);
        }
      }
    } 
    return linksArray;
  }

  // Finds the current rotation and floater depending upon the current turnCount.
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

  // Returns a number value after calculating any increases to attack from performing an SA 
  static getSAAttack(card) {
    let SAAttack = card['currentAttack'] * (1 + this.activateOnSAPercentage(card) + this.activateOnAttackPercentage(card));
    SAAttack = SAAttack + this.activateOnSAFlat(card) + this.activateOnAttackFlat(card);
    SAAttack = SAAttack * (card['SAMultiplier'] + this.getCurrentSABasedBuff(card));
    return Math.round(SAAttack);
  }
  // Returns a number value after calculating any increases to attack from performing a normal attack
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

  // Returns the card after applying any flat team passives
  static applyFlatTeamPassive(card, teamPassivesArray) {
    card.currentKi = card.currentKi + teamPassivesArray[0];
    card.currentAttack = card.currentAttack + teamPassivesArray[1];
    return card;
  }

  // Returns the card after applying any flat team passives
  static applyPercentageTeamPassive(card, teamPassivesArray) {
    card.currentAttack = card.currentAttack * (1 + teamPassivesArray[2]);
    return card;
  }

  // Returns an array of 3 values, [num,string,num], which represent the amount of typed orbs, the type of the orbs, and the amount of rainbow orbs
  static generateKiArray() {
    let kiArray = [];
    kiArray.push(this.generateTypedKi());
    kiArray.push(this.generateKiType());
    kiArray.push(this.generateRainbowKi());
    return kiArray;
  }

  // Called in generateKiArray()
  // Returns a number representing the amount of typed ki orbs
  static generateTypedKi() {
    // First number is the amount of ki, second is the chance of that number appearing. 
    // Adjust as needed.
    let weighting = { 1: 0.05, 2: 0.15, 3: 0.15, 4: 0.2, 5: 0.1, 6: 0.1, 7: 0.05, 8: 0.05 , 9: 0.025, 10: 0.025, 11: 0.025, 12: 0.025};
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

  // Called in generateKiArray()
  // Returns a string representing the type of Ki orbs
  static generateKiType() {
    let typesArray = ['PHY', 'INT', 'TEQ', 'AGL', 'STR'];
    let l = Math.floor(Math.random() * typesArray.length);
    return typesArray[l];
  }

  // Called in generateKiArray()
  // Returns a number representing the amount of rainbow ki orbs
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

  // Returns a card with the appropriate Ki value.
  // Runs any bonus ki skills
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

  // Makes sure the ki doesn't go higher than the max for that character
  static checkMaxKi(card) {
    if (card['currentKi'] > card['maxKi']) {
      card['currentKi'] = card['maxKi'];
    }
    return card;
  }

  // Sets a unit to have their optimal amount of Ki
  // Helpful for testing and balancing 
  static setOptimalKi(card) {
    if (card.optimalKi) {
      card.currentKi = card.optimalKi;
    } else {
      card.currentKi = card.maxKi;
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

  // Returns a number representing the flat amount of increase in attack generated by nuke skills for the current kiArray.
  static getNukeFlatIncrease(card, kiArray) {
    let increase = 0;
    if (card.flatNukeSkill) {
      increase = card.flatNukeSkill(kiArray);
    }
    return increase;
  }

  // Returns a card after running any flatTurnStart skills.
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

  // Returns a card with updated Ki after checking active link skills.
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

  // Returns a card with the correct ki multiplier for the current amount of ki.
  static setCurrentKiMultiplier(card) {
    // For cards with maxKi > 12 i.e. LRs
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
    if (card.SABasedBuff) {
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
