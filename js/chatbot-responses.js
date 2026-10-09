// js/chatbot-responses.js
// Pre-scripted emergency responses for StormShield AI

export const RESPONSES = [
  {
    keywords: ['earthquake', 'quake', 'tremor', 'lindol', 'shaking', 'magnitude'],
    answer: `🌍 **DURING AN EARTHQUAKE:**
1. **DROP** to your hands and knees
2. **COVER** your head and neck under a sturdy table
3. **HOLD ON** until shaking stops
4. Stay away from windows, mirrors, and heavy furniture
5. If outdoors, move to an open area away from buildings and power lines
6. If driving, pull over safely and stay in the vehicle

**AFTER:** Expect aftershocks. Check for injuries. Avoid damaged buildings. If you smell gas, leave immediately.

🆘 If you're trapped, press the SOS button in the app.`
  },
  {
    keywords: ['flood', 'flooding', 'baha', 'water rising', 'flash flood'],
    answer: `🌊 **FLOOD SAFETY:**
1. **Move to higher ground immediately** — don't wait
2. Never walk or drive through floodwater. 15cm of moving water can knock you down
3. Avoid contact with floodwater — it may be contaminated
4. If trapped in a building, go to the highest floor. Do NOT go into the attic unless you can escape to the roof
5. Turn off electricity at the main breaker if safe to do so

**AFTER:** Boil water before drinking. Discard food touched by floodwater. Document damage with photos.

🆘 Press SOS if you need immediate rescue.`
  },
  {
    keywords: ['typhoon', 'storm', 'bagyo', 'hurricane', 'cyclone', 'strong wind'],
    answer: `🌀 **TYPHOON SAFETY:**
1. **Stay indoors** — do not go outside until the "eye" has fully passed
2. Board up or tape windows; stay away from glass
3. Charge all devices and power banks NOW
4. Store 3 days of water (4L per person per day) and non-perishable food
5. Keep flashlights, batteries, first aid kit, and important documents in waterproof bags
6. Unplug appliances before the storm hits peak

**EMERGENCY KIT:** Water, food, flashlight, radio, first aid, whistle, cash, ID copies.

🆘 If your area is under Signal No. 3+, evacuate to the nearest center listed on your map.`
  },
  {
    keywords: ['fire', 'burning', 'sunog', 'smoke', 'flames'],
    answer: `🔥 **FIRE SAFETY:**
1. **Get out immediately** — don't stop to grab belongings
2. Stay LOW and crawl under smoke
3. Feel doors with the back of your hand before opening — if hot, find another exit
4. If clothes catch fire: STOP, DROP, and ROLL
5. Close doors behind you to slow the fire
6. Once outside, STAY outside. Call 911 and use the SOS button

**NEVER:** Use elevators. Go back inside. Hide in bathrooms.

🆘 If trapped: seal door cracks with wet cloth, wave something bright from a window.`
  },
  {
    keywords: ['first aid', 'bleeding', 'wound', 'cut', 'injury'],
    answer: `🩹 **FIRST AID FOR BLEEDING:**
1. Wash your hands or use gloves if available
2. Apply firm, direct pressure with a clean cloth
3. Do NOT remove soaked cloth — add another on top
4. If bleeding is severe, elevate the wound above the heart
5. Keep pressure applied for at least 10 minutes
6. Once bleeding slows, wrap with a bandage

**SEEK EMERGENCY CARE IF:** Blood is spurting, bleeding won't stop after 10 min, or the wound is deep/large.

🆘 Report serious injuries as a Medical Emergency.`
  },
  {
    keywords: ['cpr', 'chest compression', 'not breathing', 'unconscious', 'heart stopped'],
    answer: `❤️ **CPR (Adult):**
1. Check responsiveness — tap and shout
2. Call 911 or press SOS immediately
3. Place the heel of your hand on the center of the chest
4. Push HARD and FAST: 5-6 cm deep, 100-120 compressions per minute
5. Allow full chest recoil between compressions
6. Continue until help arrives or the person responds

**Song rhythm:** "Stayin' Alive" by the Bee Gees = perfect compression speed.

⚠️ If trained, add rescue breaths: 30 compressions → 2 breaths.`
  },
  {
    keywords: ['burn', 'scald', 'hot water', 'paso'],
    answer: `🔥 **BURN FIRST AID:**
1. Cool the burn under cool (not cold) running water for 10-20 minutes
2. Remove jewelry or tight items before swelling begins
3. Cover loosely with sterile gauze or clean cloth
4. Do NOT apply butter, toothpaste, or ice
5. Do NOT break blisters
6. Take pain reliever if needed

**SEEK EMERGENCY CARE IF:** Burn is larger than the person's palm, on face/hands/genitals, or looks charred/white.`
  },
  {
    keywords: ['evacuate', 'evacuation', 'evac center', 'go where', 'safe place'],
    answer: `🗺️ **EVACUATION:**
1. Follow official instructions — do not wait
2. Bring your emergency kit, IDs, phone + charger
3. Turn off gas, water, and electricity
4. Lock your home
5. Wear sturdy shoes and long sleeves
6. Follow designated evacuation routes

**ON THIS APP:** Tap "📍 Find Nearest Evacuation Center" on your dashboard. It will route you to the closest safe center with distance and walk time.

🆘 If you cannot evacuate, press SOS.`
  },
  {
    keywords: ['sos', 'emergency', 'help', 'tulong', 'rescue', 'trapped'],
    answer: `🆘 **EMERGENCY RESPONSE:**
1. Press the red **SOS EMERGENCY** button on your dashboard
2. Your GPS location will be sent to responders
3. Stay calm and stay where you are if safe
4. Call **911** if you have phone service
5. Conserve phone battery

**If trapped:**
- Signal for help with a whistle or by tapping on a pipe/wall
- Cover your mouth with cloth to avoid dust
- Do not shout — you'll inhale dust and tire out

Responders monitor the SOS dashboard 24/7.`
  },
  {
    keywords: ['emergency kit', 'go bag', 'prepare', 'supplies'],
    answer: `🎒 **EMERGENCY KIT (72-hour bag):**
- 💧 Water: 4L per person per day (3 days)
- 🍫 Non-perishable food: canned goods, energy bars
- 🔦 Flashlight + extra batteries
- 📻 Battery-powered radio
- 🩹 First aid kit + prescription meds
- 📱 Phone charger + power bank
- 🆔 Copies of IDs, insurance, documents (waterproof)
- 💵 Cash in small bills
- 🧥 Change of clothes + sturdy shoes
- 🪥 Toothbrush, soap, sanitary items
- 🪈 Whistle to signal for help
- 🧸 Comfort items for children

**Store in a waterproof backpack near your exit.**`
  },
  {
    keywords: ['power outage', 'blackout', 'no electricity', 'walang kuryente'],
    answer: `💡 **POWER OUTAGE SAFETY:**
1. Use flashlights — NOT candles (fire risk)
2. Unplug electronics to protect from surges
3. Keep fridge/freezer closed — food stays safe 4 hours (fridge) / 48 hours (full freezer)
4. Check on elderly neighbors
5. If using a generator, place it OUTSIDE away from windows — carbon monoxide kills
6. Conserve phone battery: lower brightness, close apps

🆘 Report downed power lines as an incident. NEVER touch them.`
  },
  {
    keywords: ['storm surge', 'big wave', 'coastal', 'sea level'],
    answer: `🌊 **STORM SURGE:**
1. Evacuate coastal areas IMMEDIATELY when ordered
2. Move at least 3 km inland or to high ground
3. Storm surge can rise faster than you can run — do not wait
4. Avoid beaches, harbors, and river mouths
5. Do not return until officials say it's safe

**Storm surge is the #1 killer in typhoons.** Do not underestimate it.`
  },
  {
    keywords: ['landslide', 'mudslide', 'pagguho'],
    answer: `⛰️ **LANDSLIDE SAFETY:**
**WARNING SIGNS:**
- Cracks in walls, floors, or ground
- Doors/windows sticking for the first time
- Sudden change in water flow
- Tilting trees, poles, or fences
- Rumbling sound

**IF YOU SEE WARNING SIGNS:** Evacuate immediately. Move perpendicular to the slide path (sideways, not downhill).

**IF CAUGHT:** Curl into a tight ball and protect your head.
🆘 Press SOS if trapped.`
  },
  {
    keywords: ['tsunami', 'tidal wave'],
    answer: `🌊 **TSUNAMI:**
1. If you feel a strong earthquake near the coast, **evacuate immediately** — do not wait for warnings
2. Move to high ground: at least 30m above sea level or 3km inland
3. Follow signed tsunami evacuation routes
4. Do NOT go to the shore to watch
5. Stay away until officials declare it safe (could be hours)

**Natural warning:** Strong shaking, sudden ocean withdrawal, loud roar.`
  },
  {
    keywords: ['volcano', 'volcanic', 'eruption', 'ashfall', 'bulkan'],
    answer: `🌋 **VOLCANIC ERUPTION:**
1. Evacuate if within the danger zone (usually 6-10km radius)
2. Wear N95 mask or damp cloth over mouth/nose
3. Wear goggles and long sleeves
4. Close windows and doors; turn off AC/fans
5. Cover water containers and food
6. Clear heavy ash from roofs (can collapse)
7. Avoid driving in heavy ash — clogs engines

**AFTER:** Keep masks on for days. Ash can irritate lungs long-term.`
  },
  {
    keywords: ['choking', 'can\'t breathe', 'something stuck'],
    answer: `😰 **CHOKING (Adult/Child):**
1. Ask "Are you choking?" — if they can't speak/cough, act fast
2. Give 5 BACK BLOWS between shoulder blades
3. Give 5 ABDOMINAL THRUSTS (Heimlich) just above the navel
4. Alternate 5 back blows + 5 thrusts until object comes out or they pass out
5. If they pass out, start CPR

**For infants (<1 year):** 5 back blows + 5 chest thrusts (not abdominal).

🆘 Call 911 immediately.`
  },
  {
    keywords: ['heat stroke', 'heat exhaustion', 'sobrang init', 'heatwave'],
    answer: `🌡️ **HEAT STROKE (Emergency!):**
**Signs:** Hot dry skin, confusion, high fever, no sweating

1. Move to shade/AC immediately
2. Remove excess clothing
3. Cool with wet cloths on neck, armpits, groin
4. Fan aggressively
5. Give cool water if conscious
6. Do NOT give fluids if unconscious

**Heat exhaustion (milder):** Dizzy, heavy sweating, weakness. Rest, hydrate, cool down.

🆘 Heat stroke is life-threatening — call 911.`
  },
  {
    keywords: ['hypothermia', 'too cold', 'freezing'],
    answer: `🥶 **HYPOTHERMIA:**
1. Move to warm, dry place
2. Remove wet clothing
3. Wrap in blankets, warm clothes
4. Warm the core FIRST: chest, neck, head, groin
5. Give warm (not hot) drinks if conscious
6. Skin-to-skin contact helps
7. Do NOT rub the person's limbs
8. Do NOT use direct heat (heating pad, hot water) — can burn

🆘 Severe hypothermia = medical emergency.`
  },
  {
    keywords: ['kitchen safety', 'cooking fire', 'grease fire'],
    answer: `🍳 **KITCHEN FIRE (Grease):**
**NEVER use water** — it will explode.

1. Turn off the heat
2. Cover the pan with a metal lid
3. Turn off the exhaust fan
4. If small, smother with baking soda (NOT flour)
5. If fire spreads: evacuate and call 911

**For oven fire:** Keep door closed, turn off, wait.`
  },
  {
    keywords: ['electric shock', 'electrocuted', 'kuryente'],
    answer: `⚡ **ELECTRIC SHOCK:**
1. **DO NOT TOUCH the person** — you'll be shocked too
2. Turn off power at breaker if possible
3. If not possible, use a dry wooden stick or non-metal object to move the wire
4. Once safe, check breathing and pulse
5. Call 911
6. Start CPR if not breathing
7. Treat burns at entry/exit points

🆘 Even mild shocks need medical evaluation.`
  },
  {
    keywords: ['poison', 'poisoning', 'nakain', 'overdose'],
    answer: `☠️ **POISONING:**
1. Call **Poison Control** or 911 immediately
2. Do NOT make the person vomit unless told to
3. Save the container/substance for responders
4. If inhaled: move to fresh air
5. If on skin: rinse with water 15-20 min
6. If swallowed and conscious: rinse mouth, small sips of water

**Philippines Poison Center:** (02) 8524-1078`
  },
  {
    keywords: ['snake', 'snakebite', 'ahas'],
    answer: `🐍 **SNAKE BITE:**
1. Move away from the snake
2. Keep the person CALM and STILL — slows venom spread
3. Keep the bitten limb BELOW heart level
4. Remove rings/watches/tight clothing before swelling
5. Do NOT cut, suck, or apply ice
6. Do NOT apply a tourniquet
7. Note the snake's appearance for the hospital
8. Get to a hospital with antivenom ASAP

🆘 Call 911 or go to the nearest ER immediately.`
  },
  {
    keywords: ['drowning', 'drowned', 'nalunod'],
    answer: `🌊 **DROWNING:**
1. **Do NOT jump in** unless trained — you may become a victim
2. Throw a floatation device, rope, or long pole
3. If you must enter, take something that floats
4. Once out: check breathing and pulse
5. If not breathing: start CPR immediately (5 rescue breaths, then 30:2)
6. Keep them warm

🆘 Call 911. All near-drownings need medical evaluation.`
  },
  {
    keywords: ['panic attack', 'anxiety', 'hyperventilating'],
    answer: `😰 **PANIC ATTACK:**
1. Move to a quiet, safe place
2. Breathe slowly: 4 seconds in, hold 4, out 4
3. Ground yourself: name 5 things you SEE, 4 you TOUCH, 3 you HEAR, 2 you SMELL, 1 you TASTE
4. Splash cold water on your face
5. Remind them: "This will pass. You are safe."

**Not the same as a heart attack.** But if chest pain, shortness of breath, or fainting — call 911.`
  },
  {
    keywords: ['hello', 'hi', 'hey', 'kumusta', 'kamusta'],
    answer: `👋 Hello! I'm StormShield AI, your emergency assistant.

I can help you with:
- 🌍 Earthquakes, floods, typhoons, fires
- 🩹 First aid & medical emergencies
- 🗺️ Evacuation guidance
- 🎒 Emergency preparedness
- 🆘 What to do in any disaster

**What's your emergency or question?**`
  },
  {
    keywords: ['thank', 'thanks', 'salamat'],
    answer: `🙏 You're welcome! Stay safe.

If you need anything else — emergency procedures, first aid, or evacuation info — just ask.

**In a real emergency, press the SOS button. 💪**`
  },
  {
    keywords: ['who are you', 'what are you', 'your name'],
    answer: `🛡️ I'm **StormShield AI** — an emergency response assistant built for disaster risk reduction in the Philippines.

I provide instant guidance on:
- Natural disasters (earthquake, flood, typhoon, fire)
- First aid & medical emergencies
- Evacuation & preparedness

I'm designed to work **even offline** so you can rely on me when it matters most.

**How can I help you right now?**`
  },
];

// Fallback response if no keyword matches
export const FALLBACK_RESPONSE = `🤔 I'm not sure I understood that specific question.

I can best help with:
- 🌍 Earthquakes, floods, typhoons, fires
- 🩹 First aid (bleeding, burns, CPR, choking)
- 🗺️ Evacuation and emergency preparedness
- 🆘 What to do during a specific disaster

**Try asking:** "What should I do during an earthquake?" or "How do I treat a burn?"

⚠️ For a real emergency, press the **SOS button** on the sidebar.`;