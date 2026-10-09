# NT at Home - Divadelní studijní asistent angličtiny

Tampermonkey UserScript pro platformu **National Theatre at Home** ([ntathome.com](https://www.ntathome.com)), který slouží jako výukový asistent při sledování divadelních her v původním znění.

👉 **Rychlá instalace UserScriptu:** [Klikněte zde pro instalaci z GitHubu](https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/ntathome-assistant.user.js) *(při nainstalovaném Tampermonkey se rovnou otevře instalační okno)*

---

## Klíčové funkce

- **Automatická injekce českých WebVTT titulků** s ošetřením CORS restrikcí (lokální Blob URL).
- **Inteligentní pozastavení v klíčových momentech:** V předem definovaných časech pozastaví přehrávání a zobrazí shrnutí dosavadního děje.
- **Kartičky se slovní zásobou a britskou výslovností:** Pro každou scénu připraví relevantní slovní zásobu včetně možnosti poslechu výslovnosti (Web Speech API).
- **Optimalizováno pro dotyková zařízení:** Plná podpora pro mobilní prohlížeč **Kiwi Browser** (Android) s rozšířením Tampermonkey, tmavý režim (#0f172a) šetrný k očím.

---

## Podporovaná představení

### 🎭 The Fifth Step (David Ireland)
- **Hrají:** Jack Lowden, Martin Compston
- **Délka:** 81 minut
- **Titulky v repozitáři:** [`The_Fifth_Step.cs.vtt`](The_Fifth_Step.cs.vtt) (čeština), [`The_Fifth_Step.en.vtt`](The_Fifth_Step.en.vtt) (angličtina)
- **Kontrolní body a shrnutí:**
  1. `14:10` – První setkání a nabídka patronátu (Sponsorship)
  2. `25:00` – Disciplína, abstinence a nová pravidla (Abstinence & Triggers)
  3. `35:20` – Duchovní probuzení a Ježíš v posilovně (Spiritual Awakening)
  4. `56:00` – Příprava na Pátý krok (Pracovní listy)
  5. `65:00` – Doznání vin a odhalení „Třináctého kroku“ (Thirteenth-Stepping)
  6. `74:30` – Vyvrcholení a surová pravda (Climax)

---

## Jak začít

1. V prohlížeči (např. Kiwi Browser na Androidu nebo Chrome / Firefox / Edge na PC) mějte nainstalované rozšíření **Tampermonkey**.
2. Klikněte na odkaz pro přímou instalaci: [ntathome-assistant.user.js](https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/ntathome-assistant.user.js).
3. Přejděte na [ntathome.com](https://www.ntathome.com) a spusťte hru *The Fifth Step*.
