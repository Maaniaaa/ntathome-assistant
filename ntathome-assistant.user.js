// ==UserScript==
// @name         NT at Home - Anglický divadelní asistent (The Fifth Step)
// @namespace    https://github.com/Maaniaaa/ntathome-assistant
// @version      1.3.0
// @description  Výukový asistent pro National Theatre at Home (Vimeo OTT): externí české titulky, automatické pauzy pro shrnutí děje a slovní zásobu pro Kiwi Browser a desktop.
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
     1. DATOVÁ VRSTVA A KONFIGURACE HER (JSON STRUKTURA)
     ========================================================================== */

  const PLAYS_CONFIG = {
    // 🎭 PRIMÁRNÍ HRA: THE FIFTH STEP (David Ireland, National Theatre at Home)
    'the-fifth-step': {
      title: 'The Fifth Step',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/The_Fifth_Step.cs.vtt',
      checkpoints: [
        {
          id: 'the-fifth-step-cp-1',
          time: 850, // 14:10
          title: '1. Scéna: První setkání a nabídka patronátu',
          summary: 'Luka, mladý muž bojující se závislostí na alkoholu a samotou, se svěřuje Jamesovi se svými nejistotami – obává se, že je „incel“, protože nedokáže za střízliva komunikovat se ženami. James (střízlivý již 25 let) mu vypráví o svém prvním patronovi z gay skupiny AA a vysvětluje princip Čtvrtého (morální inventura) a Pátého kroku (doznání vin před dalším člověkem a zbavení se studu). Luka následně žádá Jamese, aby se stal jeho patronem, a James nabídku přijímá.',
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
          time: 1500, // 25:00
          title: '2. Scéna: Disciplína, abstinence a nová pravidla',
          summary: 'James nastavuje Lukovi přísná pravidla nového životního stylu. Radí mu úplnou zdrženlivost nejen od alkoholu, ale i od pornografie a unáhlených vztahů, aby neplýtval životní energií a vyhnul se spouštěčům závislosti. Luka je zdrženlivostí šokován a bouřlivě protestuje proti tomu, jak drasticky mu patron zasahuje do soukromí a návyků.',
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
          time: 2120, // 35:20
          title: '3. Scéna: Duchovní probuzení a Ježíš v posilovně',
          summary: 'Luka šokuje Jamese tvrzením, že zažil náhlé duchovní probuzení přímo na běžeckém pásu v posilovně PureGym, kde se mu údajně zjevil Ježíš. Luka nachází novou sílu ve víře, modlitbě a odpuštění. James jako zkušený pragmatik reaguje cynicky a varuje ho před fanatickým nahrazováním jedné závislosti druhou. Mezi oběma muži začíná jiskřit ideologický konflikt.',
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
          time: 3360, // 56:00
          title: '4. Scéna: Příprava na Pátý krok (Pracovní listy)',
          summary: 'Nadešel čas pro stěžejní bod programu – Čtvrtý a Pátý krok. James předal Lukovi formuláře z kalifornské kliniky, kam si měl vypsat všechny své křivdy, strachy a hříchy do sloupců. Luka přichází rozrušený a zdráhá se otevřít své nejhlubší stíny. James trvá na naprosté otevřenosti a vysvětluje, že zatajená tajemství vedou přímo k recidivě.',
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
          time: 3900, // 65:00
          title: '5. Scéna: Doznání vin a odhalení „Třináctého kroku“',
          summary: 'Během doznání dochází k nečekanému zvratu. Luka konfrontuje Jamese se zjištěním z ženské skupiny: James v minulosti sponzoroval nestabilní ženu zvanou „Mental Maggie“ a navázal s ní intimní poměr. V prostředí AA jde o vážný prohřešek zvaný „Thirteenth-stepping“ (sexuální zneužití mentorské role). Důvěra mezi nimi se hroutí a mentor ztrácí morální převahu.',
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
          time: 4470, // 74:30
          title: '6. Scéna: Vyvrcholení a surová pravda',
          summary: 'Konfrontace vrcholí fyzickým střetem. James ztrácí kontrolu i pózu nadřazeného mentora a pokouší se Lukovi vnutit dominanci. Následuje rvačka, po které padají poslední masky a vychází najevo skutečná pravda o nevěrách, osamění a podstatě jejich závislosti.',
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
          time: 30,
          title: 'Ukázkový kontrolní bod',
          summary: 'Toto je ukázkový kontrolní bod. Asistent automaticky pozastavil video, abyste si mohli projít shrnutí děje a osvojit si klíčová slovíčka.',
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
  let lastVideoState = null;

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
     4. STYLY (DARK MODE, TOUCH-FRIENDLY & BEZ ZPOŽDĚNÍ)
     ========================================================================== */

  const STYLE_ID = 'nta-assistant-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = `
      #nta-status-badge {
        position: fixed;
        bottom: 18px;
        right: 18px;
        z-index: 2147483646;
        background: #0f172a;
        color: #f8fafc;
        border: 1px solid #334155;
        border-radius: 50px;
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 13px;
        user-select: none;
      }
      .nta-badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #eab308;
        box-shadow: 0 0 8px #eab308;
      }
      .nta-badge-btn {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 4px 10px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .nta-badge-btn:hover {
        background: #1d4ed8;
      }

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

      .nta-section-label {
        font-size: 13px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
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

      .nta-btn-continue {
        width: 100%;
        min-height: 56px;
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: #ffffff;
        font-size: clamp(17px, 4vw, 19px);
        font-weight: 800;
        border: none;
        border-radius: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.5);
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
     5. PŘEKRYVNÉ ROZHRANÍ (OVERLAY UI)
     ========================================================================== */

  let overlayContainer = null;

  function createOverlayElements() {
    if (overlayContainer) return overlayContainer;

    overlayContainer = document.createElement('div');
    overlayContainer.id = 'nta-assistant-overlay';

    overlayContainer.innerHTML = `
      <div class="nta-card" role="dialog" aria-modal="true" aria-labelledby="nta-card-title">
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
          <div class="nta-section-label">
            <span>📖</span> Co se právě odehrálo:
          </div>
          <div class="nta-summary-box" id="nta-card-summary">
            Shrnutí scény...
          </div>
        </div>

        <div>
          <div class="nta-section-label">
            <span>💡</span> Slovní zásoba pro nadcházející dialogy:
          </div>
          <div class="nta-vocab-grid" id="nta-card-vocab"></div>
        </div>

        <button type="button" class="nta-btn-continue" id="nta-btn-resume">
          Pokračovat ve sledování ▶
        </button>

        <div class="nta-footer-info">
          Asistent angličtiny • Klikněte nebo stiskněte Mezerník pro spuštění
        </div>
      </div>
    `;

    const mountTarget = document.fullscreenElement || document.body;
    mountTarget.appendChild(overlayContainer);

    const resumeBtn = overlayContainer.querySelector('#nta-btn-resume');
    resumeBtn.addEventListener('click', resumePlayback);

    window.addEventListener('keydown', (e) => {
      if (isOverlayOpen && (e.code === 'Space' || e.code === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        resumePlayback();
      }
    });

    return overlayContainer;
  }

  function showOverlay(checkpoint, video) {
    injectStyles();
    const overlay = createOverlayElements();

    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsElement && !fsElement.contains(overlay)) {
      fsElement.appendChild(overlay);
    } else if (!fsElement && overlay.parentElement !== document.body) {
      document.body.appendChild(overlay);
    }

    const titleEl = overlay.querySelector('#nta-card-title');
    const summaryEl = overlay.querySelector('#nta-card-summary');
    const vocabGrid = overlay.querySelector('#nta-card-vocab');

    titleEl.textContent = checkpoint.title || 'Kontrolní bod';
    summaryEl.textContent = checkpoint.summary || 'Shrnutí není k dispozici.';

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
     6. INJEKCE ČESKÝCH TITULKŮ
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
    track.default = true;
    track.src = finalTrackSrc;
    track.setAttribute('data-nta-subs', 'true');

    track.addEventListener('load', () => {
      track.mode = 'showing';
      if (video.textTracks) {
        for (let i = 0; i < video.textTracks.length; i++) {
          const t = video.textTracks[i];
          if (t.language === 'cs' || t.label.includes('Čeština')) {
            t.mode = 'showing';
          }
        }
      }
    });

    video.appendChild(track);
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
     8. PLOVOUCÍ STAVOVÝ ODZNAK
     ========================================================================== */

  function renderStatusPill(config) {
    if (window.self !== window.top) return;
    if (document.getElementById('nta-status-badge')) return;

    injectStyles();

    const pill = document.createElement('div');
    pill.id = 'nta-status-badge';
    pill.innerHTML = `
      <div class="nta-badge-dot" id="nta-dot"></div>
      <span style="font-weight: 700;">🎭 NT Asistent:</span>
      <span id="nta-pill-text" style="color: #94a3b8;">${config.title}</span>
      <button type="button" class="nta-badge-btn" id="nta-btn-test">Vyzkoušet okno ▶</button>
    `;

    document.body.appendChild(pill);

    pill.querySelector('#nta-btn-test').addEventListener('click', () => {
      const firstCp = (config.checkpoints && config.checkpoints[0]) || {
        title: 'Ukázka asistenta',
        summary: 'Výukový asistent je připraven.',
        vocabulary: [{ en: 'sponsor', cz: 'patron v AA' }]
      };
      showOverlay(firstCp, activeVideoElement || document.querySelector('video'));
    });
  }

  function updateStatusPill(hasVideo) {
    if (lastVideoState === hasVideo) return;
    lastVideoState = hasVideo;

    const dot = document.getElementById('nta-dot');
    const text = document.getElementById('nta-pill-text');
    if (!dot || !text) return;

    const config = getCurrentConfig();
    if (hasVideo) {
      dot.style.background = '#22c55e';
      dot.style.boxShadow = '0 0 8px #22c55e';
      text.textContent = `${config.title} (Video připraveno)`;
    } else {
      dot.style.background = '#eab308';
      dot.style.boxShadow = '0 0 8px #eab308';
      text.textContent = `${config.title} (Čekám na video)`;
    }
  }

  /* ==========================================================================
     9. DETEKCE PŘEHRÁVAČE (ULTRA-LEHKÁ BEZ MUTATION OBSERVERU)
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
    renderStatusPill(config);
    checkPlayer();

    // Rychlý a zcela bezpečný interval (běží 1x za sekundu, 0% CPU zátěž)
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
        lastVideoState = null;
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
