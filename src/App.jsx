import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameEngine } from './gameEngine';
import { OCCUPATIONS, TEAM_MEMBERS, ROLES, PACE_OPTIONS, RATIONS, RIVER_CHOICES, LANDMARKS } from './gameData';
import './App.css';

const game = new GameEngine();

// Pixel art scenes as ASCII/Unicode art
const SCENES = {
  garage: `
    ┌─────────────────────────────────────────┐
    │  ╔═══════════════════════════════════╗  │
    │  ║   THE GARAGE - 2026              ║  │
    │  ╚═══════════════════════════════════╝  │
    │                                         │
    │    ┌─────┐  ┌─────┐                    │
    │    │ 💻  │  │ ☕  │    ┌──────────┐   │
    │    │     │  │     │    │ STARTUP  │   │
    │    └──┬──┘  └──┬──┘    │  IDEAS   │   │
    │       │        │       │  ░░░░░░  │   │
    │    ───┴────────┴───    └──────────┘   │
    │         🪑    🪑                       │
    │                            📋         │
    │    ════════════════════════════════   │
    └─────────────────────────────────────────┘
  `,
  trail: `
    ═══════════════════════════════════════════
         ☁️          ☁️               ☁️
                          ☁️
    
          🏔️                    🏔️
       ⛰️    ⛰️              ⛰️    ⛰️
    ──────────────────────────────────────────
           🚐💨 ─ ─ ─ ─ ─ ─ ─ ─ ➤ 🏁
    ──────────────────────────────────────────
      🌲  🌲     🌲  🌲    🌲     🌲  🌲
    ═══════════════════════════════════════════
  `,
  river: `
    ═══════════════════════════════════════════
                    FUNDING ROUND
    ═══════════════════════════════════════════
    
         🏔️                         🏔️
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    ░░░░░░░░░░💰░░░░░░💰░░░░░░💰░░░░░░░░░░░░
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
              
        🚐  ───────?─────── 🏦
    
    ═══════════════════════════════════════════
  `,
  hunting: `
    ═══════════════════════════════════════════
                   PITCH MEETING
    ═══════════════════════════════════════════
    
       ┌─────────────────────────────────────┐
       │                                     │
       │     CONFERENCE ROOM B               │
       │                                     │
       │         💼        💼        💼      │
       │                                     │
       │              📊                     │
       │             ┌──┐                    │
       │    YOU ──➤  │🎯│                    │
       │             └──┘                    │
       │                                     │
       └─────────────────────────────────────┘
    
         Use SPACEBAR to pitch! Hit the VCs!
    ═══════════════════════════════════════════
  `,
  death: `
    
    
    
                    ▄████████████▄
                   █              █
                   █   REST IN    █
                   █    PEACE     █
                   █              █
                   █  ──────────  █
                   █              █
                   █              █
                   █              █
                   █              █
                  ▄█▄            ▄█▄
                 █████          █████
            ═══════════════════════════════
                  🕯️            🕯️
    
    
  `,
  victory: `
    
        🎆  🎇  🎆  🎇  🎆  🎇  🎆  🎇  🎆
    
             ╔═══════════════════════╗
             ║                       ║
             ║    🏆 IPO SUCCESS 🏆   ║
             ║                       ║
             ║   YOU MADE IT TO THE  ║
             ║     PROMISED LAND     ║
             ║                       ║
             ║   💰💰💰💰💰💰💰💰💰   ║
             ║                       ║
             ╚═══════════════════════╝
    
        🎆  🎇  🎆  🎇  🎆  🎇  🎆  🎇  🎆
    
  `,
};

// Narrative text for story feel
const NARRATIVES = {
  start: [
    "The year is 2026. The AI gold rush is in full swing.",
    "You've saved enough to quit your job and chase the dream.",
    "Silicon Valley or bust. There's no turning back now.",
    "Your garage awaits. Let's build something legendary.",
  ],
  trail: [
    "The grind continues. Coffee fuels the dream.",
    "Another day of pushing forward. The road is long.",
    "Commits pile up. The product takes shape.",
    "Late nights, early mornings. This is the startup life.",
    "Your team rallies around the vision.",
    "Progress is slow, but progress is progress.",
    "The competition never sleeps. Neither do you.",
    "One more sprint. One more milestone.",
  ],
  lowMorale: [
    "The team is exhausted. Doubt creeps in.",
    "Someone's crying in the bathroom again.",
    "The energy drinks aren't working anymore.",
    "Maybe we should have taken that corporate job...",
  ],
  lowCash: [
    "The runway is getting short. Very short.",
    "You check the bank account. Then check again.",
    "Ramen for dinner. Again.",
    "The bills are piling up.",
  ],
  nearEnd: [
    "You can see the finish line. IPO is within reach.",
    "The investors are circling. This could be it.",
    "One final push. Everything you've worked for.",
    "The promised land awaits.",
  ],
};

function App() {
  const [gameState, setGameState] = useState(game.state);
  const [narrative, setNarrative] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showContinue, setShowContinue] = useState(false);
  const [eventQueue, setEventQueue] = useState([]);
  const typingRef = useRef(null);

  const updateState = useCallback(() => {
    setGameState({ ...game.state });
  }, []);

  // Typewriter effect for narrative text
  const typeText = useCallback((text, onComplete) => {
    setIsTyping(true);
    setTypedText('');
    setShowContinue(false);
    let i = 0;
    
    if (typingRef.current) clearInterval(typingRef.current);
    
    typingRef.current = setInterval(() => {
      if (i < text.length) {
        setTypedText(prev => prev + text[i]);
        i++;
      } else {
        clearInterval(typingRef.current);
        setIsTyping(false);
        setShowContinue(true);
        if (onComplete) onComplete();
      }
    }, 30); // Speed of typing
  }, []);

  // Skip typing animation
  const skipTyping = useCallback(() => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
    }
    setIsTyping(false);
    setShowContinue(true);
  }, []);

  // Get contextual narrative
  const getContextualNarrative = useCallback(() => {
    const status = game.getStatus();
    
    if (status.morale < 30) {
      return NARRATIVES.lowMorale[Math.floor(Math.random() * NARRATIVES.lowMorale.length)];
    }
    if (status.cash < 5000) {
      return NARRATIVES.lowCash[Math.floor(Math.random() * NARRATIVES.lowCash.length)];
    }
    if (status.distance > 1200) {
      return NARRATIVES.nearEnd[Math.floor(Math.random() * NARRATIVES.nearEnd.length)];
    }
    return NARRATIVES.trail[Math.floor(Math.random() * NARRATIVES.trail.length)];
  }, []);

  // Title Screen
  const TitleScreen = () => {
    const [introIndex, setIntroIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
      if (introIndex < NARRATIVES.start.length) {
        typeText(NARRATIVES.start[introIndex], () => {});
      } else {
        setShowMenu(true);
      }
    }, [introIndex]);

    const handleContinue = () => {
      if (isTyping) {
        skipTyping();
        setTypedText(NARRATIVES.start[introIndex]);
      } else if (introIndex < NARRATIVES.start.length - 1) {
        setIntroIndex(prev => prev + 1);
      } else {
        setShowMenu(true);
      }
    };

    const startGame = () => {
      game.setState({ phase: 'setup' });
      updateState();
    };

    return (
      <div className="screen title-screen" onClick={handleContinue}>
        <pre className="ascii-title">{`
   _____ _ _ _                   _____          _ _ 
  / ____(_) (_)                 |_   _|        (_) |
 | (___  _| |_  ___ ___  _ __     | |_ __ __ _ _| |
  \\___ \\| | | |/ __/ _ \\| '_ \\    | | '__/ _\` | | |
  ____) | | | | (_| (_) | | | |   | | | | (_| | | |
 |_____/|_|_|_|\\___\\___/|_| |_|   \\_/_|  \\__,_|_|_|
                                                    
              ═══════ 2 0 2 6 ═══════
        `}</pre>
        
        <div className="narrative-box">
          <p className="narrative-text">{typedText}<span className="cursor">▌</span></p>
        </div>

        {showMenu ? (
          <div className="menu fade-in">
            <button onClick={startGame} className="main-btn">
              ▶ BEGIN YOUR JOURNEY
            </button>
            <button onClick={() => { game.setState({ phase: 'leaderboard' }); updateState(); }} className="secondary-btn">
              📊 LEADERBOARD
            </button>
            <button onClick={() => { game.setState({ phase: 'graveyard' }); updateState(); }} className="secondary-btn">
              🪦 STARTUP GRAVEYARD
            </button>
          </div>
        ) : (
          <p className="continue-prompt">{showContinue ? '[ Click or press SPACE to continue ]' : ''}</p>
        )}
      </div>
    );
  };

  // Setup Screen with narrative flow
  const SetupScreen = () => {
    const [step, setStep] = useState('occupation');
    const [selectedOccupation, setSelectedOccupation] = useState(null);
    const [startupName, setStartupName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
      const prompts = {
        occupation: "Before we begin... who are you? What did you leave behind?",
        name: "Every great journey needs a name. What will you call your startup?",
        team: "You can't do this alone. Who's joining you on this journey?",
      };
      typeText(prompts[step], () => setShowContent(true));
    }, [step]);

    const selectOccupation = (occ) => {
      setSelectedOccupation(occ);
      game.setOccupation(occ);
      setShowContent(false);
      setStep('name');
    };

    const confirmName = () => {
      if (startupName.trim()) {
        game.setStartupName(startupName.trim());
        setShowContent(false);
        setStep('team');
      }
    };

    const addMember = () => {
      const availableNames = TEAM_MEMBERS.filter(n => !teamMembers.find(m => m.name === n));
      const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
      const randomRole = ROLES[Math.floor(Math.random() * ROLES.length)];
      
      if (teamMembers.length < 4 && randomName) {
        const newMember = { name: randomName, role: randomRole };
        setTeamMembers([...teamMembers, newMember]);
        game.addTeamMember(randomName, randomRole);
      }
    };

    const startJourney = () => {
      game.setState({ phase: 'store' });
      updateState();
    };

    return (
      <div className="screen setup-screen">
        <pre className="scene">{SCENES.garage}</pre>
        
        <div className="narrative-box">
          <p className="narrative-text">{typedText}<span className="cursor">▌</span></p>
        </div>

        {showContent && step === 'occupation' && (
          <div className="options fade-in">
            {OCCUPATIONS.map(occ => (
              <button key={occ.id} onClick={() => selectOccupation(occ)} className="choice-btn">
                <span className="choice-title">{occ.name}</span>
                <span className="choice-desc">💵 ${occ.startingCash.toLocaleString()} saved | 🧠 {occ.startingMorale} morale</span>
              </button>
            ))}
          </div>
        )}

        {showContent && step === 'name' && (
          <div className="name-input fade-in">
            <input 
              type="text" 
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && confirmName()}
              placeholder="Enter your startup name..."
              maxLength={25}
              autoFocus
            />
            <button onClick={confirmName} disabled={!startupName.trim()}>
              CONFIRM
            </button>
          </div>
        )}

        {showContent && step === 'team' && (
          <div className="team-setup fade-in">
            <div className="team-list-setup">
              {teamMembers.length === 0 ? (
                <p className="empty-team">No co-founders yet...</p>
              ) : (
                teamMembers.map((m, i) => (
                  <div key={i} className="team-member-card">
                    <span className="member-name">{m.name}</span>
                    <span className="member-role">{m.role}</span>
                  </div>
                ))
              )}
            </div>
            
            {teamMembers.length < 4 && (
              <button onClick={addMember} className="recruit-btn">
                + RECRUIT CO-FOUNDER ({4 - teamMembers.length} slots left)
              </button>
            )}
            
            <button 
              onClick={startJourney} 
              disabled={teamMembers.length === 0}
              className="main-btn"
            >
              {teamMembers.length === 0 ? 'RECRUIT AT LEAST ONE PERSON' : '▶ CONTINUE TO SUPPLY STORE'}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Store Screen
  const StoreScreen = () => {
    const [cart, setCart] = useState({ compute: 2, coffee: 3, snacks: 2 });
    const [showNarrative, setShowNarrative] = useState(true);
    
    const supplies = [
      { id: 'compute', name: 'Cloud Compute Credits', price: 500, desc: 'Essential for running your AI', emoji: '🖥️' },
      { id: 'coffee', name: 'Coffee Supply (months)', price: 100, desc: 'Fuel for the team', emoji: '☕' },
      { id: 'snacks', name: 'Office Snacks', price: 50, desc: 'Keep morale up', emoji: '🍕' },
    ];

    useEffect(() => {
      typeText("Before you leave the garage, stock up. The road ahead is long and unforgiving.", () => {
        setTimeout(() => setShowNarrative(false), 1000);
      });
    }, []);

    const total = Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = supplies.find(s => s.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);

    const remaining = gameState.cash - total;
    const canAfford = remaining >= 0;

    const buy = (id, delta) => {
      setCart(prev => ({
        ...prev,
        [id]: Math.max(0, Math.min(20, (prev[id] || 0) + delta))
      }));
    };

    const checkout = () => {
      Object.entries(cart).forEach(([id, qty]) => {
        const item = supplies.find(s => s.id === id);
        if (item && qty > 0) {
          game.buySupply(id, qty, item.price);
        }
      });
      game.setState({ phase: 'trail' });
      game.addLog(`Left the garage with $${gameState.cash.toLocaleString()}`);
      updateState();
    };

    return (
      <div className="screen store-screen">
        <h2 className="store-title">🏪 STARTUP SUPPLY DEPOT</h2>
        
        {showNarrative && (
          <div className="narrative-box">
            <p className="narrative-text">{typedText}<span className="cursor">▌</span></p>
          </div>
        )}
        
        <div className="cash-display">
          <span>💵 Savings: ${gameState.cash.toLocaleString()}</span>
          <span className={remaining < 0 ? 'negative' : ''}>
            After purchase: ${remaining.toLocaleString()}
          </span>
        </div>
        
        <div className="supplies-grid">
          {supplies.map(item => (
            <div key={item.id} className="supply-card">
              <div className="supply-header">
                <span className="supply-emoji">{item.emoji}</span>
                <span className="supply-name">{item.name}</span>
              </div>
              <p className="supply-desc">{item.desc}</p>
              <p className="supply-price">${item.price} each</p>
              <div className="supply-controls">
                <button onClick={() => buy(item.id, -1)} className="qty-btn">−</button>
                <span className="qty-display">{cart[item.id] || 0}</span>
                <button onClick={() => buy(item.id, 1)} className="qty-btn">+</button>
              </div>
              <p className="supply-subtotal">${(item.price * (cart[item.id] || 0)).toLocaleString()}</p>
            </div>
          ))}
        </div>
        
        <div className="store-footer">
          <p className="cart-total">Total: ${total.toLocaleString()}</p>
          <button onClick={checkout} disabled={!canAfford} className="main-btn">
            {canAfford ? '▶ HIT THE ROAD' : "CAN'T AFFORD THIS"}
          </button>
        </div>
      </div>
    );
  };

  // Main Trail Screen - THE CORE GAME
  const TrailScreen = () => {
    const [dayNarrative, setDayNarrative] = useState('');
    const [currentEvent, setCurrentEvent] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showStatus, setShowStatus] = useState(true);
    const status = game.getStatus();

    useEffect(() => {
      setDayNarrative(getContextualNarrative());
    }, [gameState.day]);

    const travel = () => {
      if (isProcessing) return;
      setIsProcessing(true);
      setCurrentEvent(null);
      
      // Simulate time passing with narrative
      typeText(getContextualNarrative(), () => {
        setTimeout(() => {
          const result = game.advanceDay();
          updateState();
          
          if (result.type === 'landmark') {
            if (result.landmark.type === 'river') {
              setCurrentEvent({
                type: 'river',
                title: `📍 ${result.landmark.name}`,
                text: result.landmark.description,
                landmark: result.landmark
              });
            } else {
              setCurrentEvent({
                type: 'landmark',
                title: `📍 ${result.landmark.name}`,
                text: result.landmark.description
              });
            }
          } else if (result.type === 'disaster') {
            setCurrentEvent({
              type: 'disaster',
              title: '💀 DISASTER',
              text: result.event.text,
              isClassic: result.event.classic
            });
          } else if (result.type === 'negative') {
            setCurrentEvent({
              type: 'negative',
              title: '⚠️ TROUBLE',
              text: result.event.text
            });
          } else if (result.type === 'positive') {
            setCurrentEvent({
              type: 'positive',
              title: '✨ GOOD NEWS',
              text: result.event.text
            });
          } else if (result.type === 'gameover') {
            game.setState({ phase: 'gameover', gameOverReason: result.reason });
            updateState();
          } else if (result.type === 'victory') {
            game.setState({ phase: 'victory' });
            updateState();
          }
          
          setIsProcessing(false);
        }, 500);
      });
    };

    const dismissEvent = () => {
      if (currentEvent?.type === 'river') {
        game.setState({ phase: 'river', currentLandmark: currentEvent.landmark });
        updateState();
      }
      setCurrentEvent(null);
    };

    const goHunting = () => {
      game.setState({ phase: 'hunting' });
      updateState();
    };

    const progressPercent = (status.distance / 1400) * 100;

    return (
      <div className="screen trail-screen">
        {/* Visual Scene */}
        <pre className="scene trail-scene">{SCENES.trail}</pre>
        
        {/* Progress Bar */}
        <div className="journey-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}>
              <span className="progress-wagon">🚐</span>
            </div>
          </div>
          <div className="progress-labels">
            <span>🏠 Garage</span>
            <span>📍 {status.nextLandmark}</span>
            <span>🏁 IPO</span>
          </div>
        </div>

        {/* Status Dashboard */}
        <div className="status-dashboard">
          <div className="stat-box">
            <span className="stat-label">DAY</span>
            <span className="stat-value">{status.day}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">RUNWAY</span>
            <span className={`stat-value ${status.cash < 5000 ? 'danger' : ''}`}>
              ${status.cash.toLocaleString()}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">COMPUTE</span>
            <span className={`stat-value ${status.compute < 100 ? 'danger' : ''}`}>
              {status.compute}
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">MORALE</span>
            <span className={`stat-value ${status.morale < 30 ? 'danger' : ''}`}>
              {status.morale}%
            </span>
          </div>
          <div className="stat-box">
            <span className="stat-label">PROGRESS</span>
            <span className="stat-value">{status.progress}%</span>
          </div>
        </div>

        {/* Team Display */}
        <div className="team-display">
          <span className="team-label">TEAM:</span>
          <span className="team-member founder">You (Founder)</span>
          {gameState.team.map((m, i) => (
            <span key={i} className={`team-member ${m.morale < 30 ? 'struggling' : ''}`}>
              {m.name} {m.morale < 30 ? '😰' : ''}
            </span>
          ))}
        </div>

        {/* Event Modal */}
        {currentEvent && (
          <div className="event-modal">
            <div className={`event-content ${currentEvent.type}`}>
              <h3 className="event-title">{currentEvent.title}</h3>
              <p className="event-text">{currentEvent.text}</p>
              {currentEvent.isClassic && (
                <p className="classic-reference">* Classic Oregon Trail moment</p>
              )}
              <button onClick={dismissEvent} className="event-btn">
                {currentEvent.type === 'river' ? 'APPROACH THE CROSSING' : 'CONTINUE'}
              </button>
            </div>
          </div>
        )}

        {/* Narrative */}
        <div className="trail-narrative">
          <p>{typedText || dayNarrative}<span className="cursor">▌</span></p>
        </div>

        {/* Actions */}
        <div className="trail-actions">
          <button 
            onClick={travel} 
            disabled={isProcessing || currentEvent}
            className="main-btn travel-btn"
          >
            {isProcessing ? 'TRAVELING...' : '▶ CONTINUE ON THE TRAIL'}
          </button>
          <div className="secondary-actions">
            <button onClick={goHunting} className="action-btn">
              🎯 PITCH VCs
            </button>
            <button onClick={() => setShowStatus(!showStatus)} className="action-btn">
              ⚙️ SETTINGS
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showStatus && (
          <div className="settings-panel">
            <div className="setting-group">
              <label>PACE:</label>
              <div className="setting-options">
                {PACE_OPTIONS.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => { game.state.pace = p.id; updateState(); }}
                    className={`setting-btn ${gameState.pace === p.id ? 'active' : ''}`}
                    title={p.description}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="setting-group">
              <label>SPENDING:</label>
              <div className="setting-options">
                {RATIONS.map(r => (
                  <button 
                    key={r.id}
                    onClick={() => { game.state.rations = r.id; updateState(); }}
                    className={`setting-btn ${gameState.rations === r.id ? 'active' : ''}`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // River Crossing Screen
  const RiverScreen = () => {
    const [result, setResult] = useState(null);
    const landmark = gameState.currentLandmark;

    const attemptCrossing = (choiceId) => {
      const crossingResult = game.attemptRiverCrossing(choiceId);
      setResult(crossingResult);
      updateState();
    };

    const continuePlaying = () => {
      game.setState({ phase: 'trail' });
      updateState();
    };

    return (
      <div className="screen river-screen">
        <pre className="scene">{SCENES.river}</pre>
        
        <div className="river-content">
          <h2 className="river-title">🌊 {landmark?.name || 'FUNDING ROUND'}</h2>
          <p className="river-desc">{landmark?.description || 'A major milestone awaits. How will you approach it?'}</p>
          
          <div className="river-stats">
            <span>💵 Current Runway: ${gameState.cash.toLocaleString()}</span>
            <span>👥 Team Size: {gameState.team.length + 1}</span>
          </div>

          {!result ? (
            <div className="river-choices">
              {RIVER_CHOICES.map(choice => (
                <button 
                  key={choice.id}
                  onClick={() => attemptCrossing(choice.id)}
                  disabled={choice.cost > gameState.cash}
                  className="river-choice-btn"
                >
                  <span className="choice-name">{choice.name}</span>
                  <span className="choice-meta">
                    Risk: {Math.floor(choice.risk * 100)}% | 
                    {choice.cost > 0 ? ` Cost: $${choice.cost}` : ' Free'}
                    {choice.days ? ` | +${choice.days} days` : ''}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className={`river-result ${result.success ? 'success' : 'failure'}`}>
              <h3>{result.success ? '🎉 SUCCESS!' : '💥 FAILED!'}</h3>
              <p>{result.message}</p>
              <button onClick={continuePlaying} className="main-btn">
                CONTINUE
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Hunting Mini-game (Actually fun this time)
  const HuntingScreen = () => {
    const [phase, setPhase] = useState('intro');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [targets, setTargets] = useState([]);
    const [result, setResult] = useState(null);
    const gameAreaRef = useRef(null);

    useEffect(() => {
      if (phase === 'playing') {
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              endGame();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        const spawner = setInterval(() => {
          spawnTarget();
        }, 800);

        return () => {
          clearInterval(timer);
          clearInterval(spawner);
        };
      }
    }, [phase]);

    const spawnTarget = () => {
      const types = [
        { emoji: '💼', points: 10, name: 'Small VC' },
        { emoji: '🏦', points: 25, name: 'Big VC' },
        { emoji: '💰', points: 50, name: 'Angel Investor' },
        { emoji: '🦄', points: 100, name: 'Unicorn Fund' },
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const target = {
        id: Date.now() + Math.random(),
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 70,
        ...type,
        lifetime: 2000,
      };
      
      setTargets(prev => [...prev.slice(-8), target]);
      
      // Remove target after lifetime
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== target.id));
      }, target.lifetime);
    };

    const hitTarget = (target) => {
      setScore(prev => prev + target.points);
      setTargets(prev => prev.filter(t => t.id !== target.id));
    };

    const startGame = () => {
      setPhase('playing');
      setScore(0);
      setTimeLeft(15);
      setTargets([]);
    };

    const endGame = () => {
      const gameResult = game.resolveHunting(Math.min(score, 100));
      setResult(gameResult);
      setPhase('result');
      updateState();
    };

    const backToTrail = () => {
      game.setState({ phase: 'trail' });
      updateState();
    };

    if (phase === 'intro') {
      return (
        <div className="screen hunting-screen">
          <pre className="scene">{SCENES.hunting}</pre>
          <div className="hunting-intro">
            <h2>🎯 PITCH MEETING</h2>
            <p>Click on the investors as they appear!</p>
            <p>Different investors = different payouts</p>
            <ul className="target-legend">
              <li>💼 Small VC - 10 pts</li>
              <li>🏦 Big VC - 25 pts</li>
              <li>💰 Angel Investor - 50 pts</li>
              <li>🦄 Unicorn Fund - 100 pts</li>
            </ul>
            <p className="hint">You have 15 seconds. Make them count!</p>
            <button onClick={startGame} className="main-btn">
              ▶ START PITCHING
            </button>
            <button onClick={backToTrail} className="secondary-btn">
              ← BACK TO TRAIL
            </button>
          </div>
        </div>
      );
    }

    if (phase === 'playing') {
      return (
        <div className="screen hunting-screen playing">
          <div className="hunting-hud">
            <span className="hud-time">⏱️ {timeLeft}s</span>
            <span className="hud-score">💵 Score: {score}</span>
          </div>
          <div className="hunting-arena" ref={gameAreaRef}>
            {targets.map(target => (
              <button
                key={target.id}
                className="target-btn"
                style={{ 
                  left: `${target.x}%`, 
                  top: `${target.y}%`,
                }}
                onClick={() => hitTarget(target)}
              >
                <span className="target-emoji">{target.emoji}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="screen hunting-screen result">
        <h2>{result?.success ? '🎉 GREAT PITCH!' : '😔 TOUGH CROWD'}</h2>
        <p className="final-score">Final Score: {score}</p>
        <p className="hunt-result">{result?.message}</p>
        {result?.success && (
          <p className="cash-gained">+${result.amount?.toLocaleString()} raised!</p>
        )}
        <button onClick={backToTrail} className="main-btn">
          ▶ RETURN TO TRAIL
        </button>
      </div>
    );
  };

  // Game Over Screen
  const GameOverScreen = () => {
    const reasons = {
      bankruptcy: { 
        title: 'BANKRUPTCY', 
        message: "The runway has run out. The bank account reads $0. It's over.",
        epitaph: "Ran out of runway"
      },
      burnout: { 
        title: 'TOTAL BURNOUT', 
        message: 'The team has completely collapsed. Everyone quit. The dream is dead.',
        epitaph: "Died of burnout"
      },
      alone: { 
        title: 'ABANDONED', 
        message: "With no team left, you couldn't continue alone. Some journeys need companions.",
        epitaph: "Left alone"
      },
    };
    const reason = reasons[gameState.gameOverReason] || reasons.bankruptcy;
    const tombstone = game.generateTombstone('Player', gameState.startupName, gameState.distance, reason.epitaph);

    return (
      <div className="screen gameover-screen">
        <pre className="scene death-scene">{SCENES.death}</pre>
        
        <div className="tombstone-content">
          <h2 className="death-title">{reason.title}</h2>
          <div className="tombstone-text">
            <p className="startup-name">{gameState.startupName}</p>
            <p className="death-stats">Day {gameState.day} | {Math.floor(gameState.distance)} miles</p>
            <p className="epitaph">"{tombstone.epitaph}"</p>
          </div>
        </div>

        <p className="death-message">{reason.message}</p>

        <div className="death-actions">
          <button onClick={() => { game.reset(); updateState(); }} className="main-btn">
            ▶ TRY AGAIN
          </button>
          <button className="share-btn">
            📤 SHARE YOUR FAILURE
          </button>
        </div>
      </div>
    );
  };

  // Victory Screen
  const VictoryScreen = () => (
    <div className="screen victory-screen">
      <pre className="scene">{SCENES.victory}</pre>
      
      <div className="victory-content">
        <h1 className="victory-title">🎉 CONGRATULATIONS! 🎉</h1>
        <p className="victory-subtitle">{gameState.startupName} has reached the promised land!</p>
        
        <div className="victory-stats">
          <div className="victory-stat">
            <span className="stat-label">Days on the Trail</span>
            <span className="stat-value">{gameState.day}</span>
          </div>
          <div className="victory-stat">
            <span className="stat-label">Final Valuation</span>
            <span className="stat-value">${(gameState.cash * 1000).toLocaleString()}</span>
          </div>
          <div className="victory-stat">
            <span className="stat-label">Team Survivors</span>
            <span className="stat-value">{gameState.team.length + 1}</span>
          </div>
          <div className="victory-stat">
            <span className="stat-label">Product Completion</span>
            <span className="stat-value">{gameState.progress}%</span>
          </div>
        </div>

        <div className="victory-actions">
          <button onClick={() => { game.reset(); updateState(); }} className="main-btn">
            ▶ START NEW COMPANY
          </button>
          <button className="share-btn">
            📤 SHARE YOUR SUCCESS
          </button>
        </div>
      </div>
    </div>
  );

  // Leaderboard Screen
  const LeaderboardScreen = () => {
    const [leaders] = useState(() => {
      return Array(20).fill(null)
        .map(() => GameEngine.generateAIPlayer())
        .sort((a, b) => b.distance - a.distance);
    });

    return (
      <div className="screen leaderboard-screen">
        <h2 className="screen-title">🏆 LEADERBOARD</h2>
        <div className="leaderboard-list">
          {leaders.slice(0, 10).map((player, i) => (
            <div key={i} className={`leader-row ${player.survived ? 'survived' : 'failed'}`}>
              <span className="rank">#{i + 1}</span>
              <span className="player-name">{player.playerName}</span>
              <span className="startup-name">{player.startupName}</span>
              <span className="distance">{player.distance} mi</span>
              <span className="status">{player.survived ? '🏆' : '💀'}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { game.setState({ phase: 'title' }); updateState(); }} className="secondary-btn">
          ← BACK TO MENU
        </button>
      </div>
    );
  };

  // Graveyard Screen
  const GraveyardScreen = () => {
    const [graves] = useState(() => {
      return Array(12).fill(null).map(() => {
        const player = GameEngine.generateAIPlayer();
        return game.generateTombstone(player.playerName, player.startupName, player.distance, 'the grind');
      });
    });

    return (
      <div className="screen graveyard-screen">
        <h2 className="screen-title">🪦 STARTUP GRAVEYARD</h2>
        <p className="graveyard-subtitle">Here lie the fallen. May their pivots rest in peace.</p>
        
        <div className="graves-grid">
          {graves.map((grave, i) => (
            <div key={i} className="grave-card">
              <p className="grave-name">{grave.startupName}</p>
              <p className="grave-epitaph">"{grave.epitaph}"</p>
              <p className="grave-meta">Day {grave.day} • {grave.distance} mi</p>
            </div>
          ))}
        </div>
        
        <button onClick={() => { game.setState({ phase: 'title' }); updateState(); }} className="secondary-btn">
          ← BACK TO MENU
        </button>
      </div>
    );
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        if (isTyping) {
          skipTyping();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, skipTyping]);

  // Render current phase
  const renderPhase = () => {
    switch (gameState.phase) {
      case 'title': return <TitleScreen />;
      case 'setup': return <SetupScreen />;
      case 'store': return <StoreScreen />;
      case 'trail': return <TrailScreen />;
      case 'river': return <RiverScreen />;
      case 'hunting': return <HuntingScreen />;
      case 'gameover': return <GameOverScreen />;
      case 'victory': return <VictoryScreen />;
      case 'leaderboard': return <LeaderboardScreen />;
      case 'graveyard': return <GraveyardScreen />;
      default: return <TitleScreen />;
    }
  };

  return (
    <div className="game-container">
      <div className="crt-overlay"></div>
      <div className="scanlines"></div>
      {renderPhase()}
    </div>
  );
}

export default App;
