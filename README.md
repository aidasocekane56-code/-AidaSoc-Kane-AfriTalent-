# AfriTalent 
Projet fil rouge — Plateforme de mise en relation entre freelances africains et 
clients. 
Auteur : Aîda Soce Kane
Promotion : L1 Web — ISI 
# 🌍 AfriTalent — Plateforme de mise en relation de Freelances Tech Africains

**AfriTalent** est une application web moderne conçue pour connecter les entreprises du monde entier avec les meilleurs talents de la tech en Afrique. Ce projet a été développé dans le cadre de la formation L1 Web.

---

## 🚀 Lien du site en ligne
👉 **[Cliquez ici pour accéder au site AfriTalent sur GitHub Pages](https://github.com/aidasocekane56-code/-AidaSoc-Kane-AfriTalent-/)** 

---

## 📷 Aperçu visuel de la plateforme
Voici une capture d'écran de la page d'accueil d'AfriTalent :

![Aperçu de la page d'accueil d'AfriTalent](images.afri/Capture%20d’écran%202026-06-27%20214648.png/)  


---

## 🛠️ Fonctionnalités implémentées

### 🌐 Structure multi-pages (5 pages réactives)
- **Accueil (`index.html`)** : Présentation du concept, sections héro, grille d'avantages (Bento Grid) et statistiques clés.
- **À Propos (`about.html`)** : Vision, mission de la plateforme et historique.
- **Freelances (`freelances.html`)** : Catalogue des profils tech disponibles avec filtres dynamiques.
- **Tarifs (`tarifs.html`)** : Grille de prix transparente pour les entreprises et section FAQ accordéon.
- **Contact (`contact.html`)** : Formulaire sécurisé et informations de contact.

### 🎨 Design & Intégration (CSS & Bootstrap 5)
- Thème graphique moderne et professionnel.
- Alignements dynamiques à l'aide de Flexbox et CSS Grid.
- **Mode Sombre / Mode Clair** adaptatif avec mémorisation du choix utilisateur (`localStorage`).
- Navigation collante (`sticky navbar`) et bouton "Retour en haut" fluide.

### ⚡ Interactivité avancée (JavaScript natif)
- **Animation au défilement (Scroll)** : Chiffres statistiques qui s'incrémentent dynamiquement de 0 à leur cible dès qu'ils apparaissent à l'écran (`IntersectionObserver`).
- **Filtrage en temps réel** : Tri asynchrone des profils de freelances par catégorie (Web, Design, Suivi, etc.) sans recharger la page.
- **Validation sémantique du formulaire** : Vérification des champs obligatoires, validation du format d'email par expression régulière (Regex), et longueur minimale du message (20 caractères) avec affichage d'alertes ciblées en rouge ou en vert.

---

## 📂 Organisation du Dépôt
```text
📁 AfriTalent
├── 📄 index.html
├── 📄 about.html
├── 📄 freelances.html
├── 📄 tarifs.html
├── 📄 contact.html
├── 📄 README.md
├── 📁 css
│   └── 📄 style.css
├── 📁 js
│   └── 📄 main.js
└── 📁 docs
    └── 📄 KANE_Aida_Presentation.pptx  <-- Support de soutenance