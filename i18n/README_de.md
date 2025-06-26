# LinuxDo Scripts

LinuxDo Scripts ist eine funktionsreiche Browser-Erweiterung, die das Nutzungserlebnis des LinuxDo-Forums verbessern soll. Sie integriert zahlreiche praktische Funktionen – von grundlegenden Interface-Optimierungen bis hin zu fortschrittlichen KI-gestützten Features – und macht das Browsen und Interagieren im Forum noch reibungsloser und effizienter.

## ✨ Hauptfunktionen

### 🔍 Optimierung des Surferlebnisses
- Anzeige der Erstellungszeit im Themenverzeichnis
- Anzeige der Etagen-/Beitragsnummern
- Öffnen von Themen in neuen Tabs
- Vorschau von Details und Kommentaren direkt in der Themenliste
- Optimierte Anzeige für gemischte chinesisch-englische Inhalte
- Optimierte Anzeige von Signaturbildern, um Bildfehler zu vermeiden
- Automatischer Wechsel in den Dunkelmodus

### 📚 Inhaltsverwaltung
- Umfassende Lesezeichenfunktion
- Benutzer-Tags
- Zwangsweises Blockieren (Blacklist) von Themen bestimmter Nutzer
- Umschalten auf "Nur Originalposter anzeigen"

### 💬 Verbesserte Interaktion
- Schnelle Themenantwort (anpassbar)
- Optimierte Emoji-Anzeige im Kommentarfeld
- Etagen-Lotterie
- Abfrage von Level-Informationen

### 🤖 KI-Intelligenz
- KI-Themenzusammenfassung
- Intelligente Antwortgenerierung
- KI-gestützte Antworten

### 🎨 Personalisierung
- Wechseln des Forum-Themes
- Wechseln des Emoji-Stils
- Unterstützung für benutzerdefinierte CSS-Stile
- Synchronisierung der Einstellungen

## 📥 Installation & Nutzung

### Unterstützte Browser
- **Chrome / Edge / Arc / Brave**: [Chrome Web Store](https://chromewebstore.google.com/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **Nutzer aus Festlandchina**: [Crx Store](https://www.crxsoso.com/webstore/detail/fbgblmjbeebanackldpbmpacppflgmlj)
- **Firefox**: [Firefox Addons](https://addons.mozilla.org/zh-CN/firefox/addon/linux_do-scripts/)

## 🛠️ Entwicklerhandbuch

### Voraussetzungen
```
node: v22.12.0
```

### Lokale Entwicklung
1. Repository klonen und Abhängigkeiten installieren:
```shell
git clone https://github.com/ezyshu/linuxdo-scripts
npm install
```

2. Entwicklungsserver starten:
```shell
npm run dev
```

3. Erweiterung laden:
- Lokalen `.output`-Ordner öffnen
- Den `chrome-mv3`-Ordner in `chrome://extensions/` ziehen

### Hinweise zur Entwicklung
- Komponentenbasierte Entwicklung
- Jede neue Funktion wird als eigenständige Komponente entwickelt, um Konflikte zu vermeiden
- Nach dem PR erfolgt ein Code-Review, bei keinen schwerwiegenden Problemen wird schnell gemerged

## 🚀 Mitwirkende

![Contributor](https://contrib.rocks/image?repo=ezyshu/linuxdo-scripts)

## 🤝 Beitragshinweise

Neue Funktionsvorschläge und Verbesserungen sind willkommen! Sie können wie folgt am Projekt teilnehmen:
- Einreichen von Issues zur Problem- oder Vorschlagsmeldung
- Codebeiträge per Pull Request
- Teilnahme an der Diskussion in der Discord-Community

## ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ezyshu/linuxdo-scripts&type=Timeline)](https://www.star-history.com/#ezyshu/linuxdo-scripts&Timeline)

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz als Open Source verfügbar. Details finden Sie in der [LICENSE](../LICENSE)-Datei.

## 📖 Haftungsausschluss

Dieses Projekt ist kostenlos und Open Source, es wird jedoch keine Garantie für Fehlerfreiheit übernommen. Nutzung auf eigenes Risiko. Bitte halten Sie sich an geltende Gesetze und missbrauchen Sie das Projekt nicht.

Bei Urheberrechtsverletzungen kontaktieren Sie bitte [ezyshu](https://github.com/ezyshu), wir kümmern uns umgehend darum. 