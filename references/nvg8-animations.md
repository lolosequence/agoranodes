# Analyse du site nvg8.io — Animations & Design

> Source : https://nvg8.io/
> Date d'analyse : 2026-02-01

---

## 1. Librairies & techniques utilisées

| Outil | Usage |
|---|---|
| **Lenis** | Smooth scrolling (classe `.lenis`) |
| **Rive** | Animations vectorielles interactives (boutons, footer) |
| **ScrollyVideo** | Vidéo scrubbing frame-par-frame au scroll |
| **CSS will-change** | Optimisation GPU pour opacity/transform |
| **Custom easings** | `cubic-bezier(.19,1,.22,1)` et `cubic-bezier(.22,1,.36,1)` en variables CSS |

---

## 2. Animations clés à retenir

### 2.1 Ripple loading (splash screen)
```css
@keyframes ripple {
  0% { opacity: 1; transform: scale(0); }
  to  { opacity: 0; transform: scale(1); }
}
```
4 cercles concentriques avec délais décalés (0.45s, 0.9s, 1.35s, 1.8s).

### 2.2 Hero parallax au scroll
- Section de 300svh de hauteur avec `position: sticky`
- Le background change d'opacité selon le scroll
- Les éléments se scalent progressivement
- Utilise `will-change: opacity, transform`

### 2.3 Reveal de texte mot par mot
```css
.heading2 .word {
  will-change: opacity;
}
.heading2 .word .placeholder {
  background: hsla(0, 0%, 100%, 0.12);
  will-change: opacity;
}
.heading2 .word span {
  will-change: opacity;
}
```
Chaque mot s'affiche progressivement au scroll avec un placeholder grisé qui s'efface.

### 2.4 Chapitres sticky avec vidéo
- Sections sticky 100vh empilées
- Canvas vidéo qui avance frame par frame selon le scroll (ScrollyVideo)
- Transition visibility hidden/visible entre chapitres
- 150lvh de scroll entre chaque chapitre

### 2.5 Accordéon FAQ animé
```css
.faq-item .answers {
  max-height: 0;
  transition: max-height .4s ease 0s;
}
.faq-item.triggered .answers {
  max-height: none !important;
}
```
- Questions en forme de pilule
- Hover : background noir, border-radius réduit
- Bordures segmentées (gauche/centre/droite) qui s'animent à l'ouverture

### 2.6 Boutons interactifs (Rive)
- Boutons avec canvas Rive intégré pour micro-animations
- Overscan variable (`--extra: 42%`, `61%`, etc.) pour laisser l'animation déborder
- Signup, menu, docs ont chacun leur animation Rive dédiée

### 2.7 Hover effects sur boutons
```css
/* État normal */
border-radius: 2.3rem;
transition: all .3s var(--n-out) 0s;

/* Hover */
border-radius: 1rem;
```
Le border-radius diminue au hover (pilule → rectangle arrondi), effet subtil et satisfaisant.

### 2.8 Parallax souris
- Élément `.mouse-parallax` en position absolue
- Se déplace en fonction de la position du curseur
- Appliqué sur la section "building"

### 2.9 Menu mobile
- Items qui passent de `transform: scale(0)` à pleine taille
- `transform-origin: bottom center`
- Easing : `cubic-bezier(.19,1,.22,1)` sur 0.8s

---

## 3. Palette de couleurs

| Nom | Valeur | Usage |
|---|---|---|
| Black | `#141414` | Fond principal, texte |
| White | `#fdf9f0` | Fond clair (crème chaud) |
| Orange | `#ff6d38` | Accent principal |
| Purple | `#7a78ff` | Accent secondaire |
| Lime | `#c7ff69` | CTA, boutons download |
| Yellow | `#ffc412` | Highlights |
| Green | `#00a652` | Indicateurs positifs |
| Blue | `#478bff` | Liens, accents |
| Purple-100 | `#e7ebff` | Fond clair violet |
| Orange-300 | `#ffcdba` | Fond clair orange |
| Blue-300 | `#b9ddfd` | Fond clair bleu |

---

## 4. Typographie

| Font | Poids | Usage |
|---|---|---|
| **OldschoolGrotesk** | 800-900 | Titres display (5rem → 13rem) |
| **Aeonik** | 100-900 | Body, UI, navigation |

- Line-height titres : 0.8
- Letter-spacing : -0.04em (titres), 0.01em (body)
- Taille body : 1.4rem mobile → 1.8rem desktop

---

## 5. Patterns de layout

- **Marges latérales** : 2.4rem (mobile), 8rem (desktop)
- **Breakpoint principal** : 769px
- **Border-radius conteneurs** : 1.9rem → 6.4rem selon le composant
- **Bordures** : 1-1.5px solid, noir — style "playful brutalism"
- **Spacing généreux** : grandes zones de respiration entre sections

---

## 6. Easings CSS personnalisés

```css
--n-out: cubic-bezier(.22, 1, .36, 1);   /* Navigation, boutons */
--smooth: cubic-bezier(.19, 1, .22, 1);  /* Menu, transitions longues */
```

---

## 7. Idées applicables à Agoranodes

### Faciles à implémenter
- [ ] **Hover boutons** : transition border-radius (pilule → arrondi)
- [ ] **Smooth scroll** : intégrer Lenis
- [ ] **Reveal texte au scroll** : fade-in mot par mot ou ligne par ligne avec Intersection Observer
- [ ] **Accordéon FAQ** : transition max-height avec easing custom

### Intermédiaires
- [ ] **Hero sticky parallax** : section 200-300vh avec éléments qui bougent au scroll
- [ ] **Sections sticky empilées** : chapitres qui se révèlent au scroll
- [ ] **Parallax souris** : mouvement subtil d'éléments au curseur

### Avancées (nécessitent librairies)
- [ ] **Rive animations** : micro-animations interactives sur boutons
- [ ] **ScrollyVideo** : vidéo qui avance au scroll
- [ ] **Staggered word reveals** : animation GSAP/Framer Motion mot par mot

---

## 8. Style général

Le site adopte un style **"playful brutalism"** :
- Typographie bold très grande (jusqu'à 13rem)
- Couleurs vives et contrastées
- Bordures épaisses noires
- Coins très arrondis
- Espacement premium
- Animations fluides au scroll qui créent une narration

Ce style communique confiance et modernité tout en restant accessible.
