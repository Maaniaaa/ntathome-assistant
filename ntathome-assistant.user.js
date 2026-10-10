// ==UserScript==
// @name         NT at Home - Anglický divadelní asistent (The Fifth Step)
// @namespace    https://github.com/Maaniaaa/ntathome-assistant
// @version      1.4.0
// @description  Výukový asistent pro National Theatre at Home (Vimeo OTT): bilingvní shrnutí děje (CZ/EN), možnost zopakování sekce, posun a vypínání titulků, katalog her a přizpůsobení rychlosti přehrávání.
// @author       NT Assistant Team
// @match        *://*.ntathome.com/*
// @match        *://ntathome.com/*
// @match        *://*.nationaltheatre.org.uk/*
// @match        *://*.ntlive.com/*
// @match        *://*.vhx.tv/*
// @match        *://*.vimeo.com/*
// @allFrames    true
// @grant        none
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/ntathome-assistant.user.js
// @downloadURL  https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/ntathome-assistant.user.js
// ==/UserScript==

(function () {
  'use strict';

  /* ==========================================================================
     1. KATALOG PŘIPRAVENÝCH HER A DATOVÁ VRSTVA
     ========================================================================== */

  /** Seznam her dostupných s českými titulky pro zobrazení v přehledu */
  const AVAILABLE_PLAYS = [
    {
      key: 'the-fifth-step',
      title: 'The Fifth Step',
      author: 'David Ireland',
      cast: 'Jack Lowden, Martin Compston',
      url: 'https://ntathome.com/the-fifth-step/videos/the-fifth-step-full-play',
      badge: 'Aktivní (6 checkpointů, CZ titulky)',
      isReady: true
    },
    {
      key: 'frankenstein',
      title: 'Frankenstein',
      author: 'Nick Dear (Mary Shelley)',
      cast: 'Benedict Cumberbatch, Jonny Lee Miller',
      url: 'https://www.ntathome.com/media/frankenstein-cumberbatch-as-creature/',
      badge: 'Připravuje se',
      isReady: false
    },
    {
      key: 'hamlet',
      title: 'Hamlet',
      author: 'William Shakespeare',
      cast: 'Benedict Cumberbatch',
      url: 'https://www.ntathome.com/media/hamlet/',
      badge: 'Připravuje se',
      isReady: false
    }
  ];

  /** Konfigurace jednotlivých her a jejich kontrolních bodů */
  const PLAYS_CONFIG = {
    // 🎭 PRIMÁRNÍ HRA: THE FIFTH STEP
    'the-fifth-step': {
      title: 'The Fifth Step',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/The_Fifth_Step.cs.vtt',
      checkpoints: [
        {
          id: 'the-fifth-step-cp-1',
          startTime: 0,
          time: 850, // 14:10
          title: '1. Scéna: První setkání a nabídka patronátu',
          summaryCz: 'Luka, mladý muž bojující se závislostí na alkoholu a samotou, se svěřuje Jamesovi se svými nejistotami – obává se, že je „incel“, protože nedokáže za střízliva komunikovat se ženami. James (střízlivý již 25 let) mu vypráví o svém prvním patronovi z gay skupiny AA a vysvětluje princip Čtvrtého (morální inventura) a Pátého kroku (doznání vin před dalším člověkem a zbavení se studu). Luka následně žádá Jamese, aby se stal jeho patronem, a James nabídku přijímá.',
          summaryEn: 'Luka, a young man struggling with alcohol addiction and loneliness, confides in James about his deep insecurities – fearing he might be an "incel" because he cannot talk to women without a drink. James, sober for 25 years, reflects on his first sponsor from a gay AA meeting and explains the core principles of the Fourth (moral inventory) and Fifth Steps (admitting wrongs to another person to divest oneself of shame). Luka then asks James to be his sponsor, and James agrees.',
          vocabulary: [
            { en: 'sponsor', cz: 'patron / mentor v Anonymních alkoholicích (AA)' },
            { en: 'incel', cz: 'nedobrovolný celibátník (involuntary celibate)' },
            { en: 'moral inventory', cz: 'morální inventura (4. krok AA: soupis vin a křivd)' },
            { en: 'divest yourself of shame', cz: 'zbavit se pocitu studu / očistit se' },
            { en: 'camaraderie', cz: 'kamarádství / pospolitost' },
            { en: 'resentment', cz: 'zášť / neodpuštěná křivda / zahořklost' },
            { en: 'capacity for violence', cz: 'sklon k násilí / schopnost páchat násilí' }
          ]
        },
        {
          id: 'the-fifth-step-cp-2',
          startTime: 850,
          time: 1500, // 25:00
          title: '2. Scéna: Disciplína, abstinence a nová pravidla',
          summaryCz: 'James nastavuje Lukovi přísná pravidla nového životního stylu. Radí mu úplnou zdrženlivost nejen od alkoholu, ale i od pornografie a unáhlených vztahů, aby neplýtval životní energií a vyhnul se spouštěčům závislosti. Luka je zdrženlivostí šokován a bouřlivě protestuje proti tomu, jak drasticky mu patron zasahuje do soukromí a návyků.',
          summaryEn: 'James lays down uncompromising guidelines for Luka\'s new sober lifestyle. He urges strict abstinence not only from alcohol, but also from pornography, masturbation, and new romantic relationships to preserve energy and avoid addictive triggers. Luka is bewildered and fiercely protests against his sponsor meddling so profoundly into his intimate private habits.',
          vocabulary: [
            { en: 'abstain / abstinence', cz: 'zdržet se / zdrženlivost (abstinence)' },
            { en: 'expend energy', cz: 'vydávat / plýtvat energii' },
            { en: 'trigger', cz: 'spouštěč (chuti na alkohol)' },
            { en: 'stay out of relationships', cz: 'vyhýbat se novým vztahům (pravidlo 1. roku v AA)' },
            { en: 'goading', cz: 'popichování / provokování' },
            { en: 'mate', cz: 'parťák / kamarád' }
          ]
        },
        {
          id: 'the-fifth-step-cp-3',
          startTime: 1500,
          time: 2120, // 35:20
          title: '3. Scéna: Duchovní probuzení a Ježíš v posilovně',
          summaryCz: 'Luka šokuje Jamese tvrzením, že zažil náhlé duchovní probuzení přímo na běžeckém pásu v posilovně PureGym, kde se mu údajně zjevil Ježíš. Luka nachází novou sílu ve víře, modlitbě a odpuštění. James jako zkušený pragmatik reaguje cynicky a varuje ho před fanatickým nahrazováním jedné závislosti druhou. Mezi oběma muži začíná jiskřit ideologický konflikt.',
          summaryEn: 'Luka astonishes James by claiming he experienced a sudden spiritual awakening on a treadmill at his local PureGym, where he allegedly encountered Jesus. Luka embraces his newfound faith, quoting biblical scriptures on grace and forgiveness. James, an intensely pragmatic and cynical AA veteran, dismisses the vision as an unhealthy psychological replacement for addiction, sparking ideological tension.',
          vocabulary: [
            { en: 'spiritual awakening', cz: 'duchovní probuzení' },
            { en: 'sobriety', cz: 'střízlivost' },
            { en: 'treadmill', cz: 'běžecký pás' },
            { en: 'knackered', cz: 'vyčerpaný / ztahaný' },
            { en: 'millstone', cz: 'mlýnský kámen' },
            { en: 'vulnerability', cz: 'zranitelnost' },
            { en: 'garbage', cz: 'odpad / nesmysly' }
          ]
        },
        {
          id: 'the-fifth-step-cp-4',
          startTime: 2120,
          time: 3360, // 56:00
          title: '4. Scéna: Příprava na Pátý krok (Pracovní listy)',
          summaryCz: 'Nadešel čas pro stěžejní bod programu – Čtvrtý a Pátý krok. James předal Lukovi formuláře z kalifornské kliniky, kam si měl vypsat všechny své křivdy, strachy a hříchy do sloupců. Luka přichází rozrušený a zdráhá se otevřít své nejhlubší stíny. James trvá na naprosté otevřenosti a vysvětluje, že zatajená tajemství vedou přímo k recidivě.',
          summaryEn: 'The critical moment has arrived: tackling the Fourth and Fifth Steps. James provided Luka with structured worksheets from a Californian rehab facility to systematically document all his resentments, fears, and moral missteps into columns. Luka arrives visibly distressed and reluctant to expose his deepest shames. James insists on radical transparency, warning that unconfessed secrets are guaranteed relapse triggers.',
          vocabulary: [
            { en: 'worksheets', cz: 'pracovní listy / formuláře k sepsání chyb' },
            { en: 'hold a resentment', cz: 'chovat v sobě zášť / křivdu' },
            { en: 'confession', cz: 'doznání / vyznání hříchů' },
            { en: 'relapse', cz: 'recidiva / znovupropadnutí závislosti' },
            { en: 'guilt and shame', cz: 'pocit viny a hanby' },
            { en: 'nuanced', cz: 'jemný / nuancovaný / nejednoznačný' }
          ]
        },
        {
          id: 'the-fifth-step-cp-5',
          startTime: 3360,
          time: 3900, // 65:00
          title: '5. Scéna: Doznání vin a odhalení „Třináctého kroku“',
          summaryCz: 'Během doznání dochází k nečekanému zvratu. Luka konfrontuje Jamese se zjištěním z ženské skupiny: James v minulosti sponzoroval nestabilní ženu zvanou „Mental Maggie“ a navázal s ní intimní poměr. V prostředí AA jde o vážný prohřešek zvaný „Thirteenth-stepping“ (sexuální zneužití mentorské role). Důvěra mezi nimi se hroutí a mentor ztrácí morální převahu.',
          summaryEn: 'During the Fifth Step confession, the mentor-mentee dynamic collapses. Luka confronts James with information gathered from a women\'s group: James previously sponsored an emotionally vulnerable woman known as "Mental Maggie" and had a sexual affair with her. In AA, this taboo is called "Thirteenth-stepping" – a predatory exploitation of power. Luka\'s trust is shattered as James scrambles to justify his hypocrisy.',
          vocabulary: [
            { en: 'thirteenth-stepping', cz: 'třináctý krok (zneužití mentorské role v AA k sexuálnímu sblížení)' },
            { en: 'eating disorder', cz: 'porucha příjmu potravy' },
            { en: 'breach of trust', cz: 'porušení důvěry' },
            { en: 'hypocrisy', cz: 'pokrytectví / přetvářka' },
            { en: 'hold one\'s hand', cz: 'vodit za ručičku' },
            { en: 'sober', cz: 'střízlivý' }
          ]
        },
        {
          id: 'the-fifth-step-cp-6',
          startTime: 3900,
          time: 4470, // 74:30
          title: '6. Scéna: Vyvrcholení a surová pravda',
          summaryCz: 'Konfrontace vrcholí fyzickým střetem. James ztrácí kontrolu i pózu nadřazeného mentora a pokouší se Lukovi vnutit dominanci. Následuje rvačka, po které padají poslední masky a vychází najevo skutečná pravda o nevěrách, osamění a podstatě jejich závislosti.',
          summaryEn: 'The argument boils over into physical violence. Stripped of his saintly authority, James loses control and tries to physically intimidate Luka. A frantic brawl erupts between them, shattering all pretenses. In the aftermath, raw truths emerge about marriage infidelities, profound loneliness, and the common trauma binding both men together.',
          vocabulary: [
            { en: 'defend yourself', cz: 'braň se / chraň se' },
            { en: 'prey upon', cz: 'vykořisťovat / parazitovat na zranitelném' },
            { en: 'reckoning', cz: 'zúčtování / den odplaty' },
            { en: 'prayer', cz: 'modlitba' },
            { en: 'catharsis', cz: 'katarze / vnitřní očištění' },
            { en: 'relapse trigger', cz: 'spouštěč relapsu' }
          ]
        }
      ]
    },

    '__default__': {
      title: 'Asistent NT at Home',
      subtitlesUrl: '',
      checkpoints: [
        {
          id: 'demo-cp-1',
          startTime: 0,
          time: 30,
          title: 'Ukázkový kontrolní bod',
          summaryCz: 'Toto je ukázkový kontrolní bod. Asistent automaticky pozastavil video, abyste si mohli projít shrnutí děje a osvojit si klíčová slovíčka.',
          summaryEn: 'This is a sample study checkpoint. The assistant automatically paused playback so you can review the plot summary and master key vocabulary.',
          vocabulary: [
            { en: 'soliloquy', cz: 'monolog / samomluva' },
            { en: 'playwright', cz: 'dramatik' },
            { en: 'foreshadowing', cz: 'předznamenání budoucího děje' }
          ]
        }
      ]
    }
  };

  /* ==========================================================================
     2. STAV A BĚH
     ========================================================================== */

  const triggeredCheckpoints = new Set();
  let activeVideoElement = null;
  let currentBlobUrl = null;
  let isOverlayOpen = false;
  let isBadgeExpanded = false;
  let czSubtitlesEnabled = localStorage.getItem('nta_subs_enabled') !== '0';
  let activeSummaryLang = localStorage.getItem('nta_summary_lang') || 'cz';

  /* ==========================================================================
     3. VÝBĚR KONFIGURACE (S PODPOROU IFRAMU A REFERRERU)
     ========================================================================== */

  function getPageUrlString() {
    let url = window.location.href.toLowerCase();
    try {
      if (window.top && window.top.location && window.top.location.href) {
        url = window.top.location.href.toLowerCase();
      }
    } catch (e) {}
    if (document.referrer) {
      url += ' ' + document.referrer.toLowerCase();
    }
    return url;
  }

  function getCurrentConfig() {
    const combinedUrl = getPageUrlString();

    if (combinedUrl.includes('the-fifth-step') || combinedUrl.includes('the_fifth_step') || combinedUrl.includes('fifth-step')) {
      return PLAYS_CONFIG['the-fifth-step'];
    }

    for (const key of Object.keys(PLAYS_CONFIG)) {
      if (key === '__default__' || key === 'the-fifth-step') continue;
      if (combinedUrl.includes(key)) {
        return PLAYS_CONFIG[key];
      }
    }

    return PLAYS_CONFIG['the-fifth-step'] || PLAYS_CONFIG['__default__'];
  }

  /* ==========================================================================
     4. STYLY (TITULKY VÝŠE, DARK MODE, TOUCH-FRIENDLY & NOVÝ KATALOG)
     ========================================================================== */

  const STYLE_ID = 'nta-assistant-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = `
      /* =========================================================
         POSUNUTÍ TITULKŮ VÝŠE & DESIGN TITULKŮ
         ========================================================= */
      video::-webkit-media-text-track-display {
        transform: translateY(-30px) !important; /* Posun titulků o 30px výše */
      }
      ::cue {
        font-size: 1.15rem !important;
        background-color: rgba(15, 23, 42, 0.88) !important;
        color: #f8fafc !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.95) !important;
        line-height: 1.45 !important;
        padding: 4px 12px !important;
        border-radius: 6px !important;
      }

      /* =========================================================
         PLOVOUCÍ OVLÁDACÍ PRVEK ASISTENTA V PRAVÉM DOLNÍM ROHU
         ========================================================= */
      #nta-floating-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 2147483646;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        color: #f8fafc;
        user-select: none;
      }

      /* Kompaktní pilulka */
      .nta-pill-btn {
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 50px;
        padding: 9px 18px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .nta-pill-btn:hover {
        border-color: #38bdf8;
        transform: translateY(-2px);
      }
      .nta-badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 8px #22c55e;
      }
      .nta-badge-dot.nta-waiting {
        background: #eab308;
        box-shadow: 0 0 8px #eab308;
      }

      /* Rozbalovací panel se seznamem her a nastavením */
      .nta-drawer {
        position: absolute;
        bottom: 50px;
        right: 0;
        width: 320px;
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
        padding: 16px;
        display: none;
        flex-direction: column;
        gap: 14px;
      }
      .nta-drawer.nta-open {
        display: flex;
        animation: ntaDrawerIn 0.2s ease forwards;
      }
      @keyframes ntaDrawerIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .nta-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #1e293b;
        padding-bottom: 10px;
      }
      .nta-drawer-title {
        font-size: 14px;
        font-weight: 700;
        color: #ffffff;
      }
      .nta-close-btn {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-size: 16px;
      }

      /* Přepínač titulků a rychlosti */
      .nta-control-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1e293b;
        border-radius: 10px;
        padding: 8px 12px;
        font-size: 13px;
      }
      .nta-btn-toggle {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
      }
      .nta-btn-toggle.nta-off {
        background: #475569;
        color: #cbd5e1;
      }

      .nta-speed-btns {
        display: flex;
        gap: 4px;
      }
      .nta-speed-btn {
        background: #334155;
        color: #e2e8f0;
        border: none;
        border-radius: 6px;
        padding: 3px 7px;
        font-size: 11px;
        cursor: pointer;
      }
      .nta-speed-btn.nta-active {
        background: #38bdf8;
        color: #0f172a;
        font-weight: 800;
      }

      /* Seznam připravených her */
      .nta-plays-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 200px;
        overflow-y: auto;
      }
      .nta-play-item {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 8px 10px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        text-decoration: none;
        color: inherit;
        transition: border-color 0.15s ease;
      }
      .nta-play-item:hover {
        border-color: #38bdf8;
      }
      .nta-play-item-title {
        font-weight: 700;
        font-size: 13px;
        color: #38bdf8;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .nta-play-item-badge {
        font-size: 10px;
        font-weight: 700;
        background: rgba(34, 197, 94, 0.2);
        color: #4ade80;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .nta-play-item-badge.nta-badge-wait {
        background: rgba(148, 163, 184, 0.2);
        color: #94a3b8;
      }
      .nta-play-item-cast {
        font-size: 11px;
        color: #94a3b8;
      }

      /* =========================================================
         CELOOBRAZOVKOVÝ PŘEKRYV PŘI PAUZE
         ========================================================= */
      #nta-assistant-overlay {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        z-index: 2147483647;
        background: rgba(15, 23, 42, 0.96);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: none;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        box-sizing: border-box;
        padding: max(20px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(28px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
      }
      #nta-assistant-overlay.nta-visible {
        display: flex;
      }

      .nta-card {
        width: 100%;
        max-width: 680px;
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 20px;
        box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.7);
        padding: 24px;
        box-sizing: border-box;
        margin: auto 0;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .nta-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        border-bottom: 1px solid #334155;
        padding-bottom: 16px;
      }
      .nta-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        font-size: 13px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid rgba(56, 189, 248, 0.3);
        margin-bottom: 6px;
      }
      .nta-title {
        margin: 0;
        font-size: clamp(20px, 4.5vw, 26px);
        font-weight: 800;
        line-height: 1.3;
        color: #ffffff;
      }

      /* Záložky pro přepínání jazyka shrnutí děje (CZ / EN) */
      .nta-summary-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .nta-lang-tabs {
        display: flex;
        gap: 4px;
        background: #0f172a;
        padding: 3px;
        border-radius: 8px;
        border: 1px solid #334155;
      }
      .nta-tab-btn {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 6px;
        cursor: pointer;
      }
      .nta-tab-btn.nta-tab-active {
        background: #2563eb;
        color: #ffffff;
      }

      .nta-summary-box {
        background: #0f172a;
        border-radius: 12px;
        border: 1px solid #1e293b;
        padding: 16px;
        font-size: clamp(15px, 3.5vw, 17px);
        line-height: 1.6;
        color: #e2e8f0;
      }

      /* Slovní zásoba */
      .nta-vocab-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .nta-copy-btn {
        background: none;
        border: 1px solid #475569;
        color: #94a3b8;
        border-radius: 6px;
        font-size: 11px;
        padding: 3px 8px;
        cursor: pointer;
      }
      .nta-copy-btn:hover {
        border-color: #38bdf8;
        color: #38bdf8;
      }

      .nta-vocab-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 10px;
      }
      .nta-vocab-item {
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 12px;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        cursor: pointer;
        transition: border-color 0.15s ease;
      }
      .nta-vocab-item.nta-learned {
        border-color: #22c55e;
        background: rgba(34, 197, 94, 0.08);
      }
      .nta-vocab-en {
        font-size: clamp(16px, 3.8vw, 18px);
        font-weight: 700;
        color: #38bdf8;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .nta-vocab-cz {
        font-size: clamp(14px, 3.2vw, 15px);
        color: #cbd5e1;
        font-weight: 500;
      }
      .nta-speaker-btn {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 4px 6px;
        border-radius: 6px;
        font-size: 16px;
        line-height: 1;
      }
      .nta-speaker-btn:hover {
        color: #38bdf8;
      }

      /* Dvě akční tlačítka: Pustit sekci znovu + Pokračovat */
      .nta-actions-row {
        display: flex;
        gap: 12px;
        width: 100%;
      }
      .nta-btn-replay {
        flex: 1;
        min-height: 54px;
        background: #334155;
        color: #f8fafc;
        font-size: clamp(15px, 3.6vw, 17px);
        font-weight: 700;
        border: 1px solid #475569;
        border-radius: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background 0.15s ease;
      }
      .nta-btn-replay:hover {
        background: #475569;
      }

      .nta-btn-continue {
        flex: 1.4;
        min-height: 54px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #ffffff;
        font-size: clamp(16px, 3.8vw, 18px);
        font-weight: 800;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.5);
      }
      .nta-btn-continue:hover {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
      }

      .nta-footer-info {
        font-size: 12px;
        color: #64748b;
        text-align: center;
        margin-top: -6px;
      }
    `;
    document.head.appendChild(styleEl);
  }

  /* ==========================================================================
     5. PŘEKRYVNÉ ROZHRANÍ (OVERLAY UI) S BILINGVNÍM TEXTEM A OPAKOVÁNÍM
     ========================================================================== */

  let overlayContainer = null;
  let currentActiveCheckpoint = null;

  function createOverlayElements() {
    if (overlayContainer) return overlayContainer;

    overlayContainer = document.createElement('div');
    overlayContainer.id = 'nta-assistant-overlay';

    overlayContainer.innerHTML = `
      <div class="nta-card" role="dialog" aria-modal="true">
        <div class="nta-header">
          <div>
            <div class="nta-badge">
              <span>🎭</span>
              <span>Výukový checkpoint</span>
            </div>
            <h2 class="nta-title" id="nta-card-title">Název scény</h2>
          </div>
        </div>

        <div>
          <div class="nta-summary-header">
            <div style="font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
              📖 Co se právě odehrálo:
            </div>
            <div class="nta-lang-tabs">
              <button type="button" class="nta-tab-btn nta-tab-active" id="nta-tab-cz">🇨🇿 Čeština</button>
              <button type="button" class="nta-tab-btn" id="nta-tab-en">🇬🇧 English</button>
            </div>
          </div>
          <div class="nta-summary-box" id="nta-card-summary"></div>
        </div>

        <div>
          <div class="nta-vocab-header">
            <div style="font-size: 13px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">
              💡 Slovní zásoba:
            </div>
            <button type="button" class="nta-copy-btn" id="nta-btn-copy-anki">📋 Zkopírovat (pro Anki)</button>
          </div>
          <div class="nta-vocab-grid" id="nta-card-vocab"></div>
        </div>

        <div class="nta-actions-row">
          <button type="button" class="nta-btn-replay" id="nta-btn-replay">
            ↺ Pustit sekci znovu
          </button>
          <button type="button" class="nta-btn-continue" id="nta-btn-resume">
            Pokračovat ve sledování ▶
          </button>
        </div>

        <div class="nta-footer-info">
          Asistent angličtiny • Stisknutím tlačítka nebo klávesy Mezerník pokračujte
        </div>
      </div>
    `;

    const mountTarget = document.fullscreenElement || document.body;
    mountTarget.appendChild(overlayContainer);

    // Přepínání jazyka shrnutí
    const tabCz = overlayContainer.querySelector('#nta-tab-cz');
    const tabEn = overlayContainer.querySelector('#nta-tab-en');

    tabCz.addEventListener('click', () => switchSummaryLang('cz'));
    tabEn.addEventListener('click', () => switchSummaryLang('en'));

    // Kopírování slovíček do schránky (pro Anki / Flashcards)
    overlayContainer.querySelector('#nta-btn-copy-anki').addEventListener('click', (e) => {
      if (!currentActiveCheckpoint || !currentActiveCheckpoint.vocabulary) return;
      const tsv = currentActiveCheckpoint.vocabulary.map(v => `${v.en}\t${v.cz}`).join('\n');
      navigator.clipboard.writeText(tsv).then(() => {
        e.target.textContent = '✓ Zkopírováno!';
        setTimeout(() => e.target.textContent = '📋 Zkopírovat (pro Anki)', 2000);
      });
    });

    // Pustit sekci znovu
    overlayContainer.querySelector('#nta-btn-replay').addEventListener('click', () => {
      if (!currentActiveCheckpoint) return;
      const replayTime = currentActiveCheckpoint.startTime || 0;
      // Umožníme po zhlédnutí znovu checkpoint aktivovat
      if (currentActiveCheckpoint.id) {
        triggeredCheckpoints.delete(currentActiveCheckpoint.id);
      }
      if (activeVideoElement) {
        activeVideoElement.currentTime = replayTime;
      }
      resumePlayback();
    });

    // Pokračovat
    overlayContainer.querySelector('#nta-btn-resume').addEventListener('click', resumePlayback);

    window.addEventListener('keydown', (e) => {
      if (isOverlayOpen && (e.code === 'Space' || e.code === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        resumePlayback();
      }
    });

    return overlayContainer;
  }

  function switchSummaryLang(lang) {
    activeSummaryLang = lang;
    localStorage.setItem('nta_summary_lang', lang);

    if (!overlayContainer || !currentActiveCheckpoint) return;

    const tabCz = overlayContainer.querySelector('#nta-tab-cz');
    const tabEn = overlayContainer.querySelector('#nta-tab-en');
    const summaryEl = overlayContainer.querySelector('#nta-card-summary');

    if (lang === 'cz') {
      tabCz.classList.add('nta-tab-active');
      tabEn.classList.remove('nta-tab-active');
      summaryEl.textContent = currentActiveCheckpoint.summaryCz || currentActiveCheckpoint.summary || '';
    } else {
      tabEn.classList.add('nta-tab-active');
      tabCz.classList.remove('nta-tab-active');
      summaryEl.textContent = currentActiveCheckpoint.summaryEn || currentActiveCheckpoint.summaryCz || '';
    }
  }

  function showOverlay(checkpoint, video) {
    injectStyles();
    currentActiveCheckpoint = checkpoint;
    const overlay = createOverlayElements();

    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsElement && !fsElement.contains(overlay)) {
      fsElement.appendChild(overlay);
    } else if (!fsElement && overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }

    const titleEl = overlay.querySelector('#nta-card-title');
    const vocabGrid = overlay.querySelector('#nta-card-vocab');

    titleEl.textContent = checkpoint.title || 'Kontrolní bod';
    switchSummaryLang(activeSummaryLang);

    vocabGrid.innerHTML = '';
    if (Array.isArray(checkpoint.vocabulary) && checkpoint.vocabulary.length > 0) {
      checkpoint.vocabulary.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'nta-vocab-item';

        const enRow = document.createElement('div');
        enRow.className = 'nta-vocab-en';

        const enText = document.createElement('span');
        enText.textContent = item.en;
        enRow.appendChild(enText);

        if ('speechSynthesis' in window) {
          const speakBtn = document.createElement('button');
          speakBtn.className = 'nta-speaker-btn';
          speakBtn.textContent = '🔊';
          speakBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            const utterance = new SpeechSynthesisUtterance(item.en);
            utterance.lang = 'en-GB';
            window.speechSynthesis.speak(utterance);
          });
          enRow.appendChild(speakBtn);
        }

        const czText = document.createElement('div');
        czText.className = 'nta-vocab-cz';
        czText.textContent = item.cz;

        itemEl.appendChild(enRow);
        itemEl.appendChild(czText);

        // Označení slovíčka po kliknutí jako naučené
        itemEl.addEventListener('click', () => {
          itemEl.classList.toggle('nta-learned');
        });

        vocabGrid.appendChild(itemEl);
      });
    }

    overlay.classList.add('nta-visible');
    overlay.scrollTop = 0;
    isOverlayOpen = true;

    const resumeBtn = overlay.querySelector('#nta-btn-resume');
    if (resumeBtn) setTimeout(() => resumeBtn.focus(), 50);
  }

  function resumePlayback() {
    if (!overlayContainer) return;
    overlayContainer.classList.remove('nta-visible');
    isOverlayOpen = false;

    if (activeVideoElement && typeof activeVideoElement.play === 'function') {
      activeVideoElement.play().catch(() => {});
    }
  }

  /* ==========================================================================
     6. INJEKCE ČESKÝCH TITULKŮ A PŘEPÍNÁNÍ ZAP/VYP
     ========================================================================== */

  async function injectSubtitlesTrack(video, subtitlesUrl) {
    if (!video || !subtitlesUrl) return;
    if (video.querySelector('track[data-nta-subs="true"]')) return;

    let finalTrackSrc = subtitlesUrl;

    try {
      const response = await fetch(subtitlesUrl, { mode: 'cors' });
      if (response.ok) {
        const vttContent = await response.text();
        const vttBlob = new Blob([vttContent], { type: 'text/vtt' });
        if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
        currentBlobUrl = URL.createObjectURL(vttBlob);
        finalTrackSrc = currentBlobUrl;
      }
    } catch (e) {
      finalTrackSrc = subtitlesUrl;
    }

    const track = document.createElement('track');
    track.kind = 'subtitles';
    track.srclang = 'cs';
    track.label = 'Čeština (Asistent)';
    track.default = czSubtitlesEnabled;
    track.src = finalTrackSrc;
    track.setAttribute('data-nta-subs', 'true');

    track.addEventListener('load', () => {
      applySubtitlesVisibility();
    });

    video.appendChild(track);
  }

  function applySubtitlesVisibility() {
    if (!activeVideoElement || !activeVideoElement.textTracks) return;

    for (let i = 0; i < activeVideoElement.textTracks.length; i++) {
      const t = activeVideoElement.textTracks[i];
      if (t.language === 'cs' || (t.label && t.label.includes('Čeština'))) {
        t.mode = czSubtitlesEnabled ? 'showing' : 'disabled';
      }
    }
  }

  function toggleSubtitles() {
    czSubtitlesEnabled = !czSubtitlesEnabled;
    localStorage.setItem('nta_subs_enabled', czSubtitlesEnabled ? '1' : '0');
    applySubtitlesVisibility();
    updateDrawerUI();
  }

  function setPlaybackRate(rate) {
    if (activeVideoElement) {
      activeVideoElement.playbackRate = rate;
      updateDrawerUI();
    }
  }

  /* ==========================================================================
     7. SLEDOVÁNÍ ČASU A KONTROLNÍCH BODŮ
     ========================================================================== */

  function handleTimeUpdate(video, config) {
    if (!config || !Array.isArray(config.checkpoints) || isOverlayOpen) return;

    const currentTime = video.currentTime;

    for (const cp of config.checkpoints) {
      const checkpointKey = cp.id || `cp-${cp.time}`;
      if (triggeredCheckpoints.has(checkpointKey)) continue;

      const isWithinTolerance = Math.abs(currentTime - cp.time) <= 1.0;
      const isJustPassed = currentTime >= cp.time && currentTime <= cp.time + 1.5;

      if (isWithinTolerance || isJustPassed) {
        triggeredCheckpoints.add(checkpointKey);
        video.pause();
        showOverlay(cp, video);
        break;
      }
    }
  }

  /* ==========================================================================
     8. PŘEHLEDNÝ OVLÁDACÍ PRVEK & KATALOG PŘIPRAVENÝCH HER
     ========================================================================== */

  let floatingWidgetEl = null;

  function renderFloatingWidget(config) {
    if (window.self !== window.top) return;
    if (document.getElementById('nta-floating-widget')) return;

    injectStyles();

    floatingWidgetEl = document.createElement('div');
    floatingWidgetEl.id = 'nta-floating-widget';

    // Vygenerování položek pro katalog her
    const playsListHtml = AVAILABLE_PLAYS.map(p => `
      <a class="nta-play-item" href="${p.url}">
        <div class="nta-play-item-title">
          <span>${p.title}</span>
          <span class="nta-play-item-badge ${p.isReady ? '' : 'nta-badge-wait'}">${p.badge}</span>
        </div>
        <div class="nta-play-item-cast">${p.cast}</div>
      </a>
    `).join('');

    floatingWidgetEl.innerHTML = `
      <div class="nta-drawer" id="nta-drawer">
        <div class="nta-drawer-header">
          <span class="nta-drawer-title">🎭 Nastavení asistenta</span>
          <button type="button" class="nta-close-btn" id="nta-btn-drawer-close">✕</button>
        </div>

        <!-- České titulky přepínač -->
        <div class="nta-control-row">
          <span>České titulky:</span>
          <button type="button" class="nta-btn-toggle" id="nta-btn-toggle-subs">
            ${czSubtitlesEnabled ? 'Zapnuto ✓' : 'Vypnuto ✕'}
          </button>
        </div>

        <!-- Rychlost přehrávání -->
        <div class="nta-control-row">
          <span>Rychlost videa:</span>
          <div class="nta-speed-btns">
            <button type="button" class="nta-speed-btn" data-rate="0.85">0.85×</button>
            <button type="button" class="nta-speed-btn" data-rate="0.9">0.9×</button>
            <button type="button" class="nta-speed-btn nta-active" data-rate="1">1.0×</button>
          </div>
        </div>

        <!-- Seznam připravených her -->
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">
            🎬 Hry s českými titulky:
          </div>
          <div class="nta-plays-list">
            ${playsListHtml}
          </div>
        </div>
      </div>

      <!-- Kompaktní tlačítko pro otevření menu -->
      <button type="button" class="nta-pill-btn" id="nta-pill-toggle">
        <div class="nta-badge-dot nta-waiting" id="nta-dot"></div>
        <span style="font-weight: 700;">🎭 NT Asistent:</span>
        <span id="nta-pill-text" style="color: #94a3b8;">${config.title}</span>
        <span style="font-size: 11px; opacity: 0.7;">⚙</span>
      </button>
    `;

    document.body.appendChild(floatingWidgetEl);

    // Obsluha otevření / zavření menu
    const pillBtn = floatingWidgetEl.querySelector('#nta-pill-toggle');
    const drawer = floatingWidgetEl.querySelector('#nta-drawer');
    const closeBtn = floatingWidgetEl.querySelector('#nta-btn-drawer-close');

    pillBtn.addEventListener('click', () => {
      isBadgeExpanded = !isBadgeExpanded;
      drawer.classList.toggle('nta-open', isBadgeExpanded);
    });

    closeBtn.addEventListener('click', () => {
      isBadgeExpanded = false;
      drawer.classList.remove('nta-open');
    });

    // Přepínání titulků
    floatingWidgetEl.querySelector('#nta-btn-toggle-subs').addEventListener('click', toggleSubtitles);

    // Tlačítka pro rychlost videa
    floatingWidgetEl.querySelectorAll('.nta-speed-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rate = parseFloat(btn.getAttribute('data-rate'));
        setPlaybackRate(rate);
      });
    });
  }

  function updateDrawerUI() {
    if (!floatingWidgetEl) return;

    // Tlačítko titulků
    const subsBtn = floatingWidgetEl.querySelector('#nta-btn-toggle-subs');
    if (subsBtn) {
      subsBtn.textContent = czSubtitlesEnabled ? 'Zapnuto ✓' : 'Vypnuto ✕';
      subsBtn.classList.toggle('nta-off', !czSubtitlesEnabled);
    }

    // Tlačítka rychlosti
    const currentRate = activeVideoElement ? activeVideoElement.playbackRate : 1.0;
    floatingWidgetEl.querySelectorAll('.nta-speed-btn').forEach(btn => {
      const rate = parseFloat(btn.getAttribute('data-rate'));
      btn.classList.toggle('nta-active', Math.abs(rate - currentRate) < 0.02);
    });
  }

  function updateStatusPill(hasVideo) {
    const dot = document.getElementById('nta-dot');
    const text = document.getElementById('nta-pill-text');
    if (!dot || !text) return;

    const config = getCurrentConfig();
    if (hasVideo) {
      dot.className = 'nta-badge-dot';
      text.textContent = config.title;
    } else {
      dot.className = 'nta-badge-dot nta-waiting';
      text.textContent = `${config.title} (Čekám na video)`;
    }
  }

  /* ==========================================================================
     9. DETEKCE PŘEHRÁVAČE
     ========================================================================== */

  function attachToVideo(video) {
    if (!video || video.dataset.ntaAttached === 'true') return;

    video.dataset.ntaAttached = 'true';
    activeVideoElement = video;

    const config = getCurrentConfig();
    updateStatusPill(true);

    if (window.self !== window.top) {
      try {
        window.top.postMessage({ type: 'NTA_VIDEO_ATTACHED' }, '*');
      } catch (e) {}
    }

    if (config.subtitlesUrl) {
      injectSubtitlesTrack(video, config.subtitlesUrl);
    }

    video.addEventListener('timeupdate', () => {
      handleTimeUpdate(video, config);
    });
  }

  function checkPlayer() {
    const video = document.querySelector('video');
    if (video) {
      attachToVideo(video);
    }
  }

  function startAssistant() {
    const config = getCurrentConfig();
    renderFloatingWidget(config);
    checkPlayer();

    // Kontrola každou sekundu
    setInterval(checkPlayer, 1000);

    // Příjem zprávy od přehrávače v iframe
    window.addEventListener('message', (ev) => {
      if (ev.data && ev.data.type === 'NTA_VIDEO_ATTACHED') {
        updateStatusPill(true);
      }
    });

    // Detekce navigace v SPA
    let lastUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        triggeredCheckpoints.clear();
        const video = document.querySelector('video');
        if (video) {
          delete video.dataset.ntaAttached;
        }
      }
    }, 1500);
  }

  /* ==========================================================================
     10. INICIALIZACE
     ========================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAssistant);
  } else {
    startAssistant();
  }
})();
