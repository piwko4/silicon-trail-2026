// Silicon Trail 2026 - Game Engine
import { EVENTS, LANDMARKS, PACE_OPTIONS, RATIONS, RIVER_CHOICES, TOMBSTONE_EPITAPHS, AI_PLAYER_NAMES, AI_STARTUP_NAMES } from './gameData.js';

export class GameEngine {
  constructor() {
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      phase: 'title', // title, setup, store, trail, event, river, hunting, gameover, victory
      day: 1,
      distance: 0,
      targetDistance: 1400,
      
      // Resources
      cash: 30000,
      compute: 500,
      morale: 70,
      progress: 0, // Product progress %
      
      // Team
      founder: { name: 'You', role: 'Founder', health: 100, morale: 100 },
      team: [],
      
      // Settings
      pace: 'steady',
      rations: 'normal',
      
      // Current event/state
      currentEvent: null,
      currentLandmark: null,
      message: null,
      
      // History
      log: [],
      deaths: [],
      
      // Meta
      startupName: '',
      occupation: null,
    };
  }

  reset() {
    this.state = this.getInitialState();
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
  }

  // Setup phase
  setOccupation(occupation) {
    this.state.occupation = occupation;
    this.state.cash = occupation.startingCash;
    this.state.morale = occupation.startingMorale;
  }

  setStartupName(name) {
    this.state.startupName = name;
  }

  addTeamMember(name, role) {
    if (this.state.team.length < 4) {
      this.state.team.push({
        name,
        role,
        health: 100,
        morale: 80 + Math.floor(Math.random() * 20),
      });
    }
  }

  // Store phase
  buySupply(item, quantity, price) {
    const cost = price * quantity;
    if (this.state.cash >= cost) {
      this.state.cash -= cost;
      if (item === 'compute') {
        this.state.compute += quantity * 100;
      }
      return true;
    }
    return false;
  }

  // Trail phase - advance one day
  advanceDay() {
    const pace = PACE_OPTIONS.find(p => p.id === this.state.pace);
    const ration = RATIONS.find(r => r.id === this.state.rations);
    
    // Move forward
    const baseDistance = 10 + Math.floor(Math.random() * 10);
    const distanceGain = baseDistance * pace.speed;
    this.state.distance += distanceGain;
    this.state.day++;
    
    // Burn resources
    const dailyCashBurn = Math.floor(500 * ration.cashMod);
    this.state.cash -= dailyCashBurn;
    this.state.compute -= Math.floor(10 * pace.speed);
    
    // Morale changes
    this.state.morale += ration.moraleMod;
    
    // Burnout risk in crunch
    if (pace.burnoutRisk > 0 && Math.random() < pace.burnoutRisk) {
      this.state.morale -= 10;
      this.addLog("The team is showing signs of burnout...");
    }
    
    // Recovery in grass mode
    if (pace.burnoutRisk < 0) {
      this.state.morale = Math.min(100, this.state.morale + 5);
      this.state.team.forEach(m => {
        m.morale = Math.min(100, m.morale + 3);
      });
    }
    
    // Random progress
    this.state.progress += Math.floor(Math.random() * 3 * pace.speed);
    
    // Clamp values
    this.state.morale = Math.max(0, Math.min(100, this.state.morale));
    this.state.compute = Math.max(0, this.state.compute);
    this.state.progress = Math.min(100, this.state.progress);
    
    // Check for landmark
    const landmark = this.checkLandmark();
    if (landmark) {
      return { type: 'landmark', landmark };
    }
    
    // Check for random event
    if (Math.random() < 0.25) {
      return this.triggerRandomEvent();
    }
    
    // Check for game over conditions
    const gameOver = this.checkGameOver();
    if (gameOver) {
      return { type: 'gameover', reason: gameOver };
    }
    
    // Check for victory
    if (this.state.distance >= this.state.targetDistance) {
      return { type: 'victory' };
    }
    
    return { type: 'continue' };
  }

  checkLandmark() {
    for (const landmark of LANDMARKS) {
      if (this.state.distance >= landmark.distance && 
          (!this.state.currentLandmark || this.state.currentLandmark.name !== landmark.name)) {
        this.state.currentLandmark = landmark;
        return landmark;
      }
    }
    return null;
  }

  triggerRandomEvent() {
    const roll = Math.random();
    let event;
    
    if (roll < 0.05) {
      // Disaster! (5%)
      event = EVENTS.disaster[Math.floor(Math.random() * EVENTS.disaster.length)];
      this.applyEventEffect(event.effect);
      return { type: 'disaster', event };
    } else if (roll < 0.35) {
      // Negative event (30%)
      event = EVENTS.negative[Math.floor(Math.random() * EVENTS.negative.length)];
      this.applyEventEffect(event.effect);
      return { type: 'negative', event };
    } else if (roll < 0.55) {
      // Positive event (20%)
      event = EVENTS.positive[Math.floor(Math.random() * EVENTS.positive.length)];
      this.applyEventEffect(event.effect);
      return { type: 'positive', event };
    }
    
    return { type: 'continue' };
  }

  applyEventEffect(effect) {
    if (!effect) return;
    
    if (effect.cash) this.state.cash += effect.cash;
    if (effect.compute) this.state.compute += effect.compute;
    if (effect.morale) this.state.morale += effect.morale;
    if (effect.progress) this.state.progress += effect.progress;
    if (effect.daysLost) this.state.day += effect.daysLost;
    
    if (effect.teamDeath && this.state.team.length > 0) {
      const victim = this.state.team[Math.floor(Math.random() * this.state.team.length)];
      this.state.team = this.state.team.filter(m => m !== victim);
      this.state.deaths.push(victim);
      this.addLog(`${victim.name} has mass laid off themselves from the company.`);
    }
    
    if (effect.teamRisk && this.state.team.length > 0) {
      const atRisk = this.state.team[Math.floor(Math.random() * this.state.team.length)];
      atRisk.morale -= 30;
      if (atRisk.morale <= 0) {
        this.state.team = this.state.team.filter(m => m !== atRisk);
        this.state.deaths.push(atRisk);
        this.addLog(`${atRisk.name} has rage quit.`);
      }
    }
    
    // Clamp values
    this.state.cash = Math.max(0, this.state.cash);
    this.state.morale = Math.max(0, Math.min(100, this.state.morale));
    this.state.compute = Math.max(0, this.state.compute);
    this.state.progress = Math.max(0, Math.min(100, this.state.progress));
  }

  // River crossing
  attemptRiverCrossing(choice) {
    const option = RIVER_CHOICES.find(r => r.id === choice);
    if (!option) return { success: false, message: 'Invalid choice' };
    
    if (option.cost > this.state.cash) {
      return { success: false, message: "You can't afford that!" };
    }
    
    this.state.cash -= option.cost;
    if (option.days) this.state.day += option.days;
    
    if (Math.random() < option.risk) {
      // Failed crossing
      const damage = Math.floor(Math.random() * 30) + 10;
      this.state.morale -= damage;
      this.state.progress -= Math.floor(damage / 2);
      
      // Possible team loss
      if (Math.random() < 0.2 && this.state.team.length > 0) {
        const victim = this.state.team[Math.floor(Math.random() * this.state.team.length)];
        this.state.team = this.state.team.filter(m => m !== victim);
        this.state.deaths.push(victim);
        return { 
          success: false, 
          message: `The launch failed catastrophically. ${victim.name} drowned in the chaos.`,
          death: victim
        };
      }
      
      return { 
        success: false, 
        message: "The launch was a disaster. Morale and progress took a hit." 
      };
    }
    
    return { 
      success: true, 
      message: "You made it across! The launch was a success!" 
    };
  }

  // Hunting (pitching) mini-game result
  resolveHunting(skill) {
    // skill: 0-100 based on mini-game performance
    const roll = Math.random() * 100;
    const success = roll < skill;
    
    if (success) {
      const payout = Math.floor(skill * 200 + Math.random() * 5000);
      this.state.cash += payout;
      return { success: true, amount: payout, message: `You landed $${payout.toLocaleString()}!` };
    } else {
      this.state.morale -= 5;
      return { success: false, amount: 0, message: "They passed. Maybe next time." };
    }
  }

  checkGameOver() {
    if (this.state.cash <= 0) {
      return 'bankruptcy';
    }
    if (this.state.morale <= 0) {
      return 'burnout';
    }
    if (this.state.team.length === 0 && this.state.day > 30) {
      return 'alone';
    }
    return null;
  }

  addLog(message) {
    this.state.log.push({
      day: this.state.day,
      message,
      timestamp: Date.now(),
    });
  }

  // Generate tombstone
  generateTombstone(playerName, startupName, distance, causeOfDeath) {
    const template = TOMBSTONE_EPITAPHS[Math.floor(Math.random() * TOMBSTONE_EPITAPHS.length)];
    return {
      playerName,
      startupName,
      epitaph: template.replace('{name}', startupName),
      distance,
      day: this.state.day,
      causeOfDeath,
      timestamp: Date.now(),
    };
  }

  // Generate AI players for leaderboard seeding
  static generateAIPlayer() {
    const name = AI_PLAYER_NAMES[Math.floor(Math.random() * AI_PLAYER_NAMES.length)];
    const startup = AI_STARTUP_NAMES[Math.floor(Math.random() * AI_STARTUP_NAMES.length)];
    const distance = Math.floor(Math.random() * 1400);
    const survived = Math.random() > 0.7;
    
    return {
      playerName: name,
      startupName: startup,
      distance,
      survived,
      day: Math.floor(distance / 15) + Math.floor(Math.random() * 20),
      finalCash: survived ? Math.floor(Math.random() * 100000) : 0,
      isAI: true,
    };
  }

  // Get current status summary
  getStatus() {
    const landmark = LANDMARKS.find(l => l.distance > this.state.distance) || LANDMARKS[LANDMARKS.length - 1];
    const distanceToNext = landmark.distance - this.state.distance;
    
    return {
      day: this.state.day,
      distance: this.state.distance,
      nextLandmark: landmark.name,
      distanceToNext,
      cash: this.state.cash,
      compute: this.state.compute,
      morale: this.state.morale,
      progress: this.state.progress,
      teamCount: this.state.team.length + 1,
      pace: this.state.pace,
      rations: this.state.rations,
    };
  }
}

export default GameEngine;
