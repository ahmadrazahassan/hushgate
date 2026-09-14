# Hushgate image prompts

An illustration library for Hushgate: characters, scenes and store assets in one consistent style. The current home page uses real extension screenshots, live code-driven visuals and the glass globe (`public/globe.png`), so **none of these images are required for the site to look finished**. Generate them for campaigns, the Chrome Web Store, social posts, emails and future pages, and tell me when you want one placed.

---

## 1. The idea behind the pictures

Hushgate's name is a quiet gate. The pictures tell one simple story again and again: **ordinary, likeable people living their day while a small blue door quietly closes behind them.** Nobody looks scared and nothing looks like a hacker film. The tone is calm, witty and grown-up, like a good magazine illustration, not a tech ad.

**The recurring symbol: the Blue Door.** A small arched door in flat cobalt `#5267FF` with a round brass knob. When it is closed, you are protected. It appears in most images, sometimes big and sometimes as a tiny detail (on a laptop sticker, a coffee sleeve, a door in the background). It replaces padlocks and shields, which we never draw.

---

## 2. Style bible (paste into every prompt)

```
Hand-drawn editorial illustration with a textured oil-pastel and crayon feel and a fine risograph paper grain. Confident, slightly wobbly black ink outlines of uneven thickness. Flat colour fills with visible paper texture, no gradients, no 3D, no glossy highlights. Limited palette only: cobalt blue #5267FF, deep cobalt #3446D9, pale sky blue #A9C8F6, ink black #151922, warm off-white paper #F6F3EC, small accents of warm orange #FF6A2B, soft blush pink #F2A99A for cheeks and skin warmth, and a little grass green #3E9B5A only where nature needs it. Calm, witty, grown-up mood, like a modern magazine cover. Simple composition with generous empty space. No text anywhere in the image.
```

**Negative prompt (add to every prompt)**

```
text, letters, numbers, words, logos, brand names, watermark, signature, UI text, padlock, shield icon, hacker, hoodie over face, dark web, matrix code, binary, circuit board, glowing network lines, neon, lens flare, sparkles, stars, lightning bolt, rocket, 3D render, glossy plastic, photorealistic, gradient background, heavy shadows, cluttered background, extra fingers, distorted hands, uncanny faces, anime style, chibi
```

**Export**

- Generate large (at least 2× the listed size) and export at the listed size, or larger with the same aspect ratio.
- WebP at quality 90 or PNG. Keep the flat backgrounds exactly as described so the cards line up.
- Check that the cobalt reads as `#5267FF` after export, because some generators shift blues toward purple.

---

## 3. The cast: three characters, always the same

Consistency is what makes the site feel like a real brand. **Generate the three character sheets first**, then attach the sheet as a character reference in every scene that uses that character:

- **ChatGPT / GPT image:** upload the sheet and say "use exactly this character".
- **Midjourney:** use `--cref <sheet URL> --cw 100` and `--sref <style image URL>`.
- **Ideogram / Recraft / Leonardo:** use their "character reference" or "style reference" upload.

Never change hair, glasses, clothing colours or the cat's sunglasses between images.

### 3.1 Mira: the calm professional

> Late 20s South Asian woman, a product designer. Warm brown skin, thick straight eyebrows, shoulder-length dark wavy hair usually tucked behind her left ear, a tiny gold nose stud, a quiet confident half-smile. She always wears an oversized cobalt `#5267FF` chunky knit cardigan over a plain white T-shirt, wide cream trousers and chunky white sneakers. She carries a slim silver laptop with one small round cobalt sticker of an arched door. Slim build, relaxed posture.

**Character sheet — `docs/characters/mira-sheet.png` (not used on the site, for reference only)**

> Character turnaround sheet of Mira [paste Mira description]. Five views in a row on a plain warm off-white `#F6F3EC` background: front, three-quarter left, side, back, three-quarter right. Below, four facial expressions: calm focus, soft smile, raised eyebrow, relieved laugh. Same outfit in every view. [style bible]

### 3.2 Theo: the easy-going traveller

> Early 30s man, a freelance photographer who works from anywhere. Light olive skin with rosy cheeks, messy curly black hair, a short scruffy beard, round thin black glasses, slightly sleepy relaxed eyes. He always wears a white linen shirt with rolled sleeves, faded pale blue jeans and brown boots, with a tan leather backpack. He often holds a plain takeaway coffee cup with a cobalt sleeve and no logo. Medium build, laid-back slouch.

**Character sheet — `docs/characters/theo-sheet.png` (reference only)**

> Character turnaround sheet of Theo [paste Theo description]. Five views in a row on a plain warm off-white `#F6F3EC` background: front, three-quarter left, side, back, three-quarter right. Below, four expressions: sleepy content, amused smirk, surprised, eyes closed peaceful. Same outfit in every view. [style bible]

### 3.3 Hush: the mascot cat

> A chubby ginger-and-white cat with a white chest and muzzle, fluffy cheeks, long white whiskers and a very cool, unbothered attitude. Signature look: chunky black rectangular sunglasses (his "incognito mode") and a small cobalt `#5267FF` knit scarf. Expressive ears. He behaves like a person: stands on two legs when needed, holds objects with his paws and sips drinks through a straw. He is witty, never cute-baby.

**Character sheet — `docs/characters/hush-sheet.png` (reference only)**

> Mascot character sheet of Hush the cat [paste Hush description]. Five poses on a plain warm off-white `#F6F3EC` background: sitting front, standing on two legs, walking side view, lying down napping, pointing a paw. Below, four expressions with sunglasses on: unbothered, smug, surprised with glasses slipping down his nose, asleep. [style bible]

---

## 4. Home page: Why Hushgate cards

Four numbered cards. The open card shows its picture at the top. **880 × 560, full-bleed, warm off-white `#F6F3EC` background**, with the subject centred and 10% empty margin (the card rounds the corners).

### 4.1 `public/art/why-one-tap.webp`: "One tap, and Chrome goes quiet"

> Theo [Theo description] sits on a simple wooden park bench in the afternoon, laptop on his knees, calmly tapping one key with a single finger while sipping his coffee. On the laptop lid, a small cobalt arched-door sticker. Behind the bench, a big soft cobalt blob-shaped bush and a small arched cobalt door standing alone in the grass, just clicking shut, with two tiny curved "click" lines. Hush the cat [Hush description] sits on the other end of the bench in sunglasses, looking pleased. Plenty of empty off-white space above them. [style bible]

### 4.2 `public/art/why-hidden-address.webp`: "Your real address stays yours"

> Mira [Mira description] works at a small round café table with her laptop, relaxed. Around her, three nosy background characters (a man with a newspaper, a woman peeking over a menu, a waiter leaning in) are drawn in simple ink outlines with no colour fill, all squinting to see her screen. From their view, her laptop screen shows only a closed cobalt arched door. Mira has a knowing half-smile. Soft pale sky blue `#A9C8F6` wall shapes behind. [style bible]

### 4.3 `public/art/why-no-logs.webp`: "Nothing written down, ever"

> Hush the cat [Hush description] stands on two legs next to a simple metal office bin and casually drops a completely blank, empty notebook into it, not even looking, sunglasses on, with a smug expression. On the wall behind him, a few blank sticky notes in cobalt and orange (no writing on them). A tiny cobalt arched door on the bin lid. Loose, witty, lots of empty space. [style bible]

### 4.4 `public/art/why-public-wifi.webp`: "Safe when the Wi-Fi is not"

> Theo [Theo description] sits cross-legged on his backpack at an airport gate, laptop open, peacefully sipping his coffee with eyes half-closed. Around him, travellers rush past as loose ink motion silhouettes with no colour. A large airport window behind shows a flat cobalt sky and a tiny plane. A small closed cobalt arched door floats like a calm bubble around his laptop screen. [style bible]

---

## 5. Home page: What Hushgate does

Six rail cards. **640 × 440, full-bleed, white `#FFFFFF` background** (the card frame is light grey, so a white picture pops). Subject centred with 12% margin.

### 5.1 `public/art/feature-kill-switch.webp`: Kill switch

> Mira [Mira description] calmly pulls a giant oversized plug out of a wall socket with both hands, like pulling a garden hose, while the browser window floating beside her turns into a still, closed cobalt arched door. Two short curved motion lines near the plug. Expression: composed, slightly amused. [style bible, white background]

### 5.2 `public/art/feature-leak-shield.webp`: WebRTC leak shield

> Hush the cat [Hush description] reaches up with one paw and firmly turns off an old brass tap whose spout is shaped like a small video camera. The last cobalt water droplet hangs frozen in mid-air below the spout. Sunglasses on, satisfied smirk. [style bible, white background]

### 5.3 `public/art/feature-location.webp`: Location that matches

> Theo [Theo description] holds a large unfolded paper map with simple flat cobalt continent shapes and no labels. A big orange `#FF6A2B` map pin is hopping from one side of the map to the other, leaving a dotted arc behind it. Theo raises an eyebrow at it over his glasses, amused. [style bible, white background]

### 5.4 `public/art/feature-split-tunnel.webp`: Split tunnelling

> A simple road seen from above splits into two lanes. The left lane goes straight on in the open with tiny sketched houses. The right lane enters a rounded cobalt tunnel shaped like an arched door. Mira [Mira description] rides a cream city bicycle into the cobalt tunnel, tote bag in the basket, hair blowing slightly. [style bible, white background]

### 5.5 `public/art/feature-auto-connect.webp`: Auto-connect

> Early morning. Theo [Theo description], hair extra messy and eyes still half-asleep, opens his laptop at a kitchen table with a steaming mug. Above the laptop, a small cobalt arched door is already closed, with a tiny orange sunrise circle behind it. Hush the cat stretches next to the mug. [style bible, white background]

### 5.6 `public/art/feature-pause.webp`: Pause, not quit

> Hush the cat [Hush description] naps curled up on top of a big round cobalt button printed with a simple white pause symbol made of two vertical bars (a shape, not text). His sunglasses have slipped down his nose. A small orange kitchen timer sits beside him. Peaceful, funny. [style bible, white background]

---

## 6. Globe

The home page uses your glass globe at `public/globe.png`, turning continuously. No prompt needed.

---

## 7. Ready for other pages (not placed yet)

These fit pages that already exist. Tell me when they are generated and I will wire them in.

### 7.1 `public/art/download-hero.webp`: download page, 1000 × 800, off-white background

> Mira [Mira description] and Theo [Theo description] stand side by side holding a giant oversized Chrome-style browser window frame (just a rounded rectangle with three dots, no logo) like a picture frame, and a cobalt arched door is set into the middle of it. Hush the cat sits on top of the frame in sunglasses. Friendly group portrait, lots of space. [style bible]

### 7.2 `public/art/uninstalled.webp`: "Sorry to see you go" page, 800 × 800, off-white background

> Hush the cat [Hush description] stands in an open cobalt arched doorway, sunglasses pushed up on his head for once, giving a small polite wave with one paw, a little wistful but dignified. A tiny suitcase at his feet. [style bible]

### 7.3 `public/art/not-found.webp`: 404 page, 900 × 700, off-white background

> Theo [Theo description] stands in front of three identical closed cobalt arched doors in an empty space, scratching his head and holding his coffee, confused. Hush the cat peeks out from behind the middle door wearing sunglasses. [style bible]

### 7.4 `public/art/auth-side.webp`: sign in and sign up pages, 900 × 1200, flat cobalt `#5267FF` background

> Vertical composition on a flat cobalt background. Mira [Mira description] is shown from the waist up, holding a large brass key casually over her shoulder like a bat and smiling calmly. Hush the cat sits on her shoulder in sunglasses. Outlines in ink; her cardigan uses deep cobalt `#3446D9` so it stands out from the background. Empty space at the top. [style bible]

### 7.5 `public/art/pricing-coffee.webp`: optional pricing accent, 600 × 600, transparent background

> Hush the cat [Hush description], shown from the waist up in sunglasses, sipping through a straw from a plain takeaway cup with a cobalt sleeve and no text, one eyebrow raised. The joke is "less than a coffee". Isolated character with no background. [style bible]

---

## 8. Brand and store assets

### 8.1 Social share image: `src/app/opengraph-image.png`, 1200 × 630

> Wide banner on flat cobalt `#5267FF`. The left 55% is empty, calm cobalt for a headline added later. On the right, Theo [Theo description] and Mira [Mira description] walk casually through a large off-white arched doorway, with Hush the cat trotting ahead in sunglasses. [style bible, no text]

Add "Hushgate — Browse quietly. Be nowhere." afterwards in Figma or Canva (Inter Tight Bold plus Instrument Serif Italic, white) so the spelling is exact.

### 8.2 Chrome Web Store small promo tile: 440 × 280

> Flat cobalt `#5267FF` background. Hush the cat [Hush description] in sunglasses, shown from the chest up, peeks out of a small off-white arched door on the right third. The left two thirds are empty for the Hushgate wordmark added later. [style bible, no text]

### 8.3 Chrome Web Store marquee: 1400 × 560

> Wide scene on warm off-white `#F6F3EC`. Left third empty for text. In the centre and right, Mira at a café table, Theo on a bench and Hush napping on a pause button, three small vignettes connected by a gentle dotted cobalt path that passes through small arched cobalt doors. [style bible, no text]

### 8.4 Email header (welcome and password emails): 1200 × 400

> Flat pale sky blue `#A9C8F6` background. Hush the cat [Hush description] in sunglasses, centred, holds up an envelope sealed with a small cobalt arched-door stamp. Wide empty space on both sides. [style bible, no text]

---

## 9. Checklist

- [ ] Three character sheets generated first and used as references everywhere.
- [ ] Files saved with the exact names and folders above.
- [ ] Why cards are 880 × 560 on off-white; feature cards are 640 × 440 on white.
- [ ] The globe is a polar view, perfectly centred, with a transparent background.
- [ ] No text, logos, padlocks or shields in any image.
- [ ] Mira always wears the cobalt cardigan, Theo always wears round glasses and a white shirt, and Hush always wears black sunglasses and a cobalt scarf.
- [ ] Hands have five fingers and faces look natural.
- [ ] Run `pnpm build` and check each section on desktop and on a phone.
