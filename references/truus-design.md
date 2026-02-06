# Analyse du site truus.co — Design & Animations

> Source : https://truus.co/
> Date d'analyse : 2026-02-05

---

## 1. Librairies & techniques utilisées

| Outil | Version | Usage |
|---|---|---|
| **Webflow** | — | CMS / builder du site |
| **GSAP** | 3.13.0 | Moteur d'animation principal |
| **GSAP ScrollTrigger** | 3.13.0 | Animations déclenchées au scroll |
| **GSAP SplitText** | 3.13.0 | Reveal de texte lettre/mot par mot |
| **GSAP Draggable** | 3.13.0 | Portfolio horizontal draggable |
| **GSAP InertiaPlugin** | 3.13.0 | Effet d'inertie sur le drag |
| **GSAP DrawSVGPlugin** | 3.13.0 | Animation de tracé SVG (flèches, doodles) |
| **GSAP MorphSVGPlugin** | 3.13.0 | Morphing de formes SVG |
| **GSAP CustomEase** | 3.13.0 | Courbes d'easing personnalisées |
| **GSAP Observer** | 3.13.0 | Détection de scroll/swipe avancée |
| **Lenis** | 1.3.1 | Smooth scrolling |
| **Barba.js** | 2.10.3 | Transitions entre pages (SPA-like) |
| **Flickity** | 2.3.0 | Carrousels / sliders |
| **jQuery** | 3.7.1 | Utilitaires DOM |
| **Vimeo Player** | — | Vidéos de fond en background autoplay |

---

## 2. Animations clés à retenir

### 2.1 Hero vidéo plein écran avec overlay texte
- Vidéo Vimeo en `background` mode (autoplay, muted, no controls)
- Titre H1 en overlay avec mots qui se révèlent progressivement (SplitText)
- Icônes SVG animées intercalées entre les mots du titre
- L'ensemble crée un effet de superposition dynamique texte + vidéo

### 2.2 Typographie géante avec éléments décoratifs
```
H1 : Epilogue, 128px, weight 900, line-height 0.95, letter-spacing -3.84px
H2 : Epilogue, ~170px, weight 900
```
- Texte qui déborde du viewport (overflow visible)
- Éléments SVG doodle (main, étoiles, flèches) positionnés entre les mots
- Mots en italique serif (Lora) pour créer un contraste typographique

### 2.3 Portfolio draggable horizontal
- Carrousel horizontal avec `GSAP Draggable + InertiaPlugin`
- Cards avec image/vidéo, titre, badge catégorie et icône SVG
- Indicateurs visuels "drag" et "click" pour guider l'utilisateur
- Hover : vidéo Vimeo qui se lance en background sur la card
- Transition d'entrée avec easing personnalisé

### 2.4 Easing signature
```css
/* Easing principal — utilisé partout */
cubic-bezier(0.625, 0.05, 0, 1)   /* Entrées rapides, sorties douces */

/* Easing secondaire — boutons, micro-interactions */
cubic-bezier(0.425, 1, 0.6, 1)    /* Plus rebondi, organique */
```
Durées : `0.4s` (interactions rapides), `0.8s` (transitions majeures)

### 2.5 Section "agency" avec cards empilées
- Fond noir avec cards photo empilées style Polaroid
- Cards avec `border-radius` arrondi et rotation aléatoire
- Textes manifesto en H4 sur les cards ("girls just wanna have fun!")
- Reveal au scroll avec GSAP ScrollTrigger

### 2.6 Marquee / logo ticker infini
- 144 éléments marquee détectés (logos clients en défilement infini)
- Deux rangées qui scrollent en sens opposé
- Logos en SVG monochromes

### 2.7 Section services avec accordéons
- Cards services (brand, social, activations, video production, partners)
- Chaque card a un header avec icône SVG + titre
- Liste déroulante des sous-services
- Animation d'ouverture/fermeture

### 2.8 Curseur personnalisé
```css
cursor: url("cursor-default.svg") 2 0, auto;
```
- Curseur SVG custom qui remplace le curseur système
- Probable changement d'état au hover sur les éléments interactifs

### 2.9 Transitions entre pages (Barba.js)
- Navigation SPA sans rechargement complet
- Animations de sortie/entrée entre les pages
- Préchargement du contenu de la page suivante

### 2.10 Footer avec border-radius
- Footer sur fond bleu vif (`#4B69F0`)
- `border-radius` en haut uniquement (coins arrondis)
- Grille 3 colonnes : jobs, office, contact
- Badges H4 en style pill/chip
- Icônes sociales (LinkedIn, Instagram, TikTok)

---

## 3. Palette de couleurs

| Nom | Hex | RGB | Usage |
|---|---|---|---|
| Cream | `#F0EBE6` | `240, 235, 230` | Fond principal (chaud, pas blanc pur) |
| Black | `#000000` | `0, 0, 0` | Texte principal, fonds de section |
| Blue | `#4B69F0` | `75, 105, 240` | Accent principal, footer, liens |
| Orange/Coral | `#F5693C` | `245, 105, 60` | Accent secondaire, badges "work" |
| Lime | `#E6FAB9` | `230, 250, 185` | Accents, doodles, highlights |
| Pink | `#F0BEFA` | `240, 190, 250` | Accents décoratifs |
| Deep Rose | `#A0325A` | `160, 50, 90` | Accent foncé |
| Cream transparent | `rgba(240,235,230,0.15)` | — | Overlays sur fond sombre |

**Caractéristique** : Palette chaude et playful. Le fond n'est jamais blanc pur (`#FFF`) mais toujours un beige/crème chaud (`#F0EBE6`). Les accents sont vifs et saturés.

---

## 4. Typographie

| Font | Poids | Usage |
|---|---|---|
| **Epilogue** | 900 | Titres display (H1: 128px, H2: ~170px) |
| **Epilogue** | 400 | H4, sous-titres |
| **DM Sans** | 400 | Body text (21.3px), paragraphes |
| **DM Sans** | 600 | H3 labels (24px) |
| **Lora** | italic | Mots en emphase dans les titres (contraste serif/sans-serif) |

### Détails typographiques
- **H1** : 128px, weight 900, line-height 0.95 (très serré), letter-spacing -3.84px (-0.03em)
- **H2** : ~170px, weight 900, même style que H1
- **H3** : 24px, DM Sans, weight 600 — utilisé pour labels de services
- **H4** : 21.3px, Epilogue, weight 400, `text-transform: lowercase`
- **Body** : DM Sans 21.3px, weight 400, line-height 1.3
- **Emphasis** : Lora italic — appliqué sur certains mots dans les titres Epilogue pour créer un contraste serif/sans-serif

### Pattern typographique signature
Le mélange **Epilogue black + Lora italic** dans les titres est l'identité visuelle du site :
```
"we make [advertising] for the new mainstream"
          ↑ Lora italic     ↑ Epilogue 900
```

---

## 5. Patterns de layout

- **Fond principal** : `#F0EBE6` (crème chaud), pas de blanc pur
- **Sections plein écran** : alternance fond crème / fond noir
- **Padding sections** : 144px (desktop), ~42px (mobile)
- **Gaps** : 42.67px (principal), 21.33px, 13.33px, 32px
- **Border-radius** : `16px` (cards), `10.67px` (petits éléments), pill shapes `1066px+` (badges)
- **Border-radius chat-bubble** : `213px 213px 213px 0px` (asymétrique, style bulle)
- **Sticky header** : transparent, logo "truus" centré (script font), "work" à gauche, WhatsApp à droite
- **Footer** : fond bleu `#4B69F0`, border-radius top, grille 3 colonnes
- **Images** : format AVIF principalement (compression moderne), lazy loading
- **Vidéos** : Vimeo en mode background (API embed)

---

## 6. Micro-interactions & détails

### Curseur custom
SVG personnalisé remplaçant le curseur système — renforce l'identité visuelle.

### Badges catégorie (portfolio)
```
Style pill avec icône + texte
Border-radius: pill (1066px)
Background: cream sur fond noir
Icônes SVG custom (camera, smiley, hands, bam, fist bump, etc.)
```

### Texte lowercase partout
Tous les H4 et labels en `text-transform: lowercase` — style décontracté, Gen-Z.

### Illustrations SVG entre les mots
Doodles SVG (flèches, étoiles, mains) positionnés en `absolute` entre les mots des titres, créant un effet collage/scrapbook.

---

## 7. Idées applicables à Agoranodes

### Faciles à implémenter
- [ ] **Fond crème chaud** au lieu de blanc pur (`#F0EBE6` ou similaire) — plus chaleureux
- [ ] **Smooth scroll** avec Lenis (déjà noté depuis nvg8)
- [ ] **Mélange typographique** : Hero New bold + une serif italic pour les emphases
- [ ] **Lowercase styling** sur certains labels/badges pour un ton plus moderne
- [ ] **Footer coloré** avec border-radius top — plus vivant que le footer actuel
- [ ] **Badges pill** pour les catégories d'articles avec icônes

### Intermédiaires
- [ ] **SplitText reveal** : titres qui apparaissent mot par mot au scroll (GSAP ou Framer Motion)
- [ ] **Marquee logos** : défilement infini de logos partenaires/technologies
- [ ] **Cards portfolio draggables** : carousel horizontal avec drag + inertie pour les publications
- [ ] **Transitions entre pages** : fade/slide avec Barba.js ou les transitions Next.js

### Avancées
- [ ] **Curseur personnalisé** SVG pour renforcer l'identité Agoranodes
- [ ] **Vidéo background** Vimeo/YouTube en hero section
- [ ] **Doodles SVG animés** entre les mots des titres (DrawSVGPlugin)
- [ ] **Cards empilées style Polaroid** : rotation + perspective sur hover

---

## 8. Style général

Le site adopte un style **"playful agency" Gen-Z** :
- Typographie display massive (jusqu'à 170px) en ultra-black
- Contraste serif italic / sans-serif bold dans les titres
- Fond crème chaud (`#F0EBE6`) — jamais de blanc pur
- Couleurs saturées et joyeuses (bleu, orange, lime, pink)
- Éléments décoratifs SVG style doodle/scrapbook
- Texte en lowercase partout — ton décontracté et accessible
- Animations GSAP fluides avec easing signature `cubic-bezier(0.625, 0.05, 0, 1)`
- Portfolio draggable avec vidéos intégrées
- Curseur SVG personnalisé
- Transitions entre pages (SPA feel)

Ce style communique **énergie, jeunesse et créativité** tout en restant professionnel. L'approche "warm cream + bold type + playful illustrations" est une alternative moderne au minimalisme blanc classique.
