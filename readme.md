# Check-IA Mobile 📱

Application mobile de fact-checking alimentée par l'IA, conçue pour lutter contre la désinformation en Afrique francophone (Sahel).

---

## 📌 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** (Version LTS recommandée)
- **Git**
- **npm** (ou Yarn)
- **Watchman** (Recommandé pour macOS et Ubuntu)
- **Émulateur** (Android Studio / Xcode) ou l'application **Expo Go** sur votre smartphone.

---

## 🚀 Installation & Démarrage

### 1. Cloner le projet
```bash
git clone https://github.com/ibrahko/checkia-mobile.git
cd checkia-mobile
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer l'API
L'URL de l'API est configurée dans `services/api.ts`. Assurez-vous que le serveur backend est accessible ou que le tunnel (ngrok) est actif.
- Fichier : `services/api.ts` -> `API_URL`

### 4. Lancer l'application
```bash
npx expo start
```
- Appuyez sur **`a`** pour Android.
- Appuyez sur **`i`** pour iOS (macOS uniquement).
- Scannez le QR Code avec **Expo Go** pour tester sur un appareil réel.

---

## 🧹 Maintenance & Nettoyage (En cas de crash)

Si vous rencontrez des problèmes de cache ou des erreurs au démarrage :

#### **Sur Windows (PowerShell)** :
```powershell
stop-process -name node -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules, .expo, package-lock.json
npm install
npx expo start -c
```

#### **Sur macOS & Ubuntu** :
```bash
killall -9 node
rm -rf node_modules .expo package-lock.json
npm install
npx expo start -c
```

---

## 📁 Architecture du Projet

```text
checkia-mobile/
├── app/             # Navigation Expo Router & Écrans (Tabs, Auth)
├── assets/          # Polices (Instrument Serif), Images, Icons
├── components/      # Composants UI atomiques et composants métiers
├── constants/       # Couleurs (Colors.ts), Dimensions, Thèmes
├── hooks/           # Hooks React personnalisés
├── services/        # Appels API (Axios), Intercepteurs, Services Auth
├── styles/          # Fichiers de styles globaux et utilitaires
└── utils/           # Fonctions d'aide (Helpers) et formatage
```

---

## ⚠️ Notes Techniques & Stabilité

Pour garantir la stabilité de l'application sur Android, les configurations suivantes sont appliquées :

1.  **Stabilité Android** : La `primaryColor` dans `app.json` doit être opaque (ex: `#10275A`) pour éviter les crashs système `TaskDescription`.
2.  **Gestion du Clavier** : Le mode `softwareKeyboardLayoutMode` est réglé sur `"pan"` pour éviter les sauts d'interface lors de l'ouverture du clavier.
3.  **Interface (TabBar)** : La barre d'onglets est verrouillée à une hauteur de **70px** avec une position absolue pour une navigation fluide et immobile.
4.  **Typographie** : Utilisation des polices **Instrument Serif** (Regular/Italic) pour l'identité visuelle "Presse/Sérieux".

---

## 🧪 Tests Unitaires

L'application utilise **Jest** et **React Native Testing Library**.

```bash
npm test          # Exécuter les tests
npm test:coverage # Rapport de couverture complet
```

---

## 📄 Licence
Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.
