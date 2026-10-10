// ==UserScript==
// @name         NT at Home - Anglický divadelní asistent
// @namespace    https://github.com/Maaniaaa/ntathome-assistant
// @version      2.1.0
// @description  Výukový asistent pro National Theatre at Home (Vimeo OTT): The Fifth Step, The Importance of Being Earnest, Our Town, The Seagull, Antigone, Macbeth, All My Sons a Hamlet s českými titulky, bilingvními shrnutími scén, možností vypnutí výukových oken a trvalou regulací rychlosti videa.
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
     1. PŘEHLED HER A DATOVÁ STRUKTURA
     ========================================================================== */

  const AVAILABLE_PLAYS = [
    {
      key: 'the-fifth-step',
      title: 'The Fifth Step',
      author: 'David Ireland',
      cast: 'Jack Lowden, Martin Compston',
      url: 'https://ntathome.com/the-fifth-step/videos/the-fifth-step-full-play',
      badge: 'Připraveno (6 checkpointů, CZ titulky)',
      isReady: true
    },
    {
      key: 'the-importance-of-being-earnest',
      title: 'The Importance of Being Earnest',
      author: 'Oscar Wilde',
      cast: 'Sharon D Clarke, Ncuti Gatwa, Hugh Skinner',
      url: 'https://ntathome.com/the-importance-of-being-earnest/videos/the-importance-of-being-earnest-full-play',
      badge: 'Připraveno (5 checkpointů, CZ titulky)',
      isReady: true
    },
    {
      key: 'our-town',
      title: 'Our Town',
      author: 'Thornton Wilder',
      cast: 'Michael Sheen, Yasemin Özdemir, Peter Devlin',
      url: 'https://www.ntathome.com/our-town/videos/our-town-full-play',
      badge: 'Připraveno (5 checkpointů, CZ titulky)',
      isReady: true
    },
        {
      key: 'the-seagull',
      title: 'The Seagull',
      author: 'Anton Chekhov (Anya Reiss)',
      cast: 'Emilia Clarke, Tom Rhys Harries, Indira Varma, Daniel Monks',
      url: 'https://www.ntathome.com/videos/the-seagull-full-play',
      badge: 'Připraveno (5 checkpointů, CZ titulky)',
      isReady: true
    },
    {
      key: 'antigone',
      title: 'Antigone',
      author: 'Sophocles (Don Taylor)',
      cast: 'Christopher Eccleston, Jodie Whittaker, Luke Newberry',
      url: 'https://www.ntathome.com/videos/antigone-full-play',
      badge: 'Připraveno (5 checkpointů, CZ titulky)',
      isReady: true
    },
    {
      key: 'macbeth',
      title: 'Macbeth',
      author: 'William Shakespeare',
      cast: "Rory Kinnear, Anne-Marie Duff, Patrick O'Kane",
      url: 'https://www.ntathome.com/macbeth/videos/macbeth-full-play',
      badge: 'Připraveno (5 checkpointů, CZ titulky)',
      isReady: true
    },
    {
      key: 'all-my-sons',
      title: 'All My Sons',
      author: 'Arthur Miller',
      cast: 'Bryan Cranston, Marianne Jean-Baptiste, Paapa Essiedu',
      url: 'https://www.ntathome.com/all-my-sons-2026/videos/all-my-sons-2026-full-play',
      badge: 'Připraveno (5 checkpointů, CZ titulky)',
      isReady: true
    },
    {
      key: 'hamlet',
      title: 'Hamlet',
      author: 'William Shakespeare',
      cast: 'Hiran Abeysekera, Francesca Mills, Nia Gwynne',
      url: 'https://www.ntathome.com/hamlet-1/videos/hamlet-full-play-1',
      badge: 'Připraveno (5 checkpointů, CZ titulky)',
      isReady: true
    }
  ];

  const PLAYS_CONFIG = {
    // 🎭 THE FIFTH STEP
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

    // 🎭 THE IMPORTANCE OF BEING EARNEST (JAK JE DŮLEŽITÉ MÍTI FILIPA)
    'the-importance-of-being-earnest': {
      title: 'The Importance of Being Earnest',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/The_Importance_of_Being_Earnest.cs.vtt',
      checkpoints: [
        {
          id: 'earnest-cp-1',
          startTime: 0,
          time: 1180, // ~19:40
          title: '1. Dějství: Tabatěrka a fenomén Bunburyismu',
          summaryCz: 'Algernon Moncrieff hostí ve svém londýnském bytě přítele Jacka Worthinga (v Londýně vystupujícího pod jménem Ernest). Jack přijíždí požádat o ruku Algernonovu sestřenici Gwendolen. Algernon však odmítá dát souhlas, dokud Jack nevysvětlí nápis na své zapomenuté tabatěrce věnované „strýčku Jackovi od malé Cecily“. Jack je nucen přiznat pravdu: na venkově je vážným poručníkem Jackem a v Londýně předstírá, že má hříšného bratra Ernesta, aby mohl utíkat za zábavou. Algernon s nadšením konstatuje, že Jack je stejně jako on nevyléčitelný „Bunburyista“ – Algernon si totiž vymyslel fiktivního nemocného přítele Bunburyho, který mu slouží jako dokonalá výmluva k únikům z nudných společenských povinností.',
          summaryEn: 'Algernon Moncrieff entertains his friend Jack Worthing (who goes by the name Ernest in town) at his London flat. Jack has come to propose to Algernon\'s cousin, Gwendolen Fairfax. However, Algernon refuses to give his consent until Jack explains an inscription on a cigarette case he left behind: "From little Cecily, with her fondest love to her dear Uncle Jack." Jack is forced to confess his double life: in the country he is the respectable guardian Jack, while in London he pretends to have a reckless younger brother named Ernest so he can escape social responsibilities. Algernon gleefully identifies Jack as a fellow "Bunburyist" – Algernon having invented an invalid friend named Bunbury to escape tedious social obligations.',
          vocabulary: [
            { en: 'Bunburyist / Bunburying', cz: 'Bunburyista / bunburyismus (vymýšlení si falešných záminek k úniku před povinnostmi)' },
            { en: 'cigarette case', cz: 'tabatěrka / pouzdro na cigarety' },
            { en: 'guardian', cz: 'poručník / zákonný zástupce' },
            { en: 'ward', cz: 'svěřenka / schovanka v poručnické péči (Cecily)' },
            { en: 'scrape / scrape into', cz: 'šlamastyka / malér' },
            { en: 'invalid', cz: 'nemocný / lazar / invalida (fiktivní přítel Bunbury)' },
            { en: 'cynical', cz: 'cynický / bezohledně kousavý' }
          ]
        },
        {
          id: 'earnest-cp-2',
          startTime: 1180,
          time: 2680, // ~44:40
          title: '2. Dějství: Žádost o ruku a kabelka na nádraží Victoria',
          summaryCz: 'Přichází Gwendolen se svou autoritativní matkou, lady Bracknellovou. Zatímco Algernon odvádí tetu do vedlejšího pokoje, Jack vyznává Gwendolen lásku a žádá ji o ruku. Gwendolen nabídku nadšeně přijímá, ovšem zdůrazňuje, že jejím celoživotním snem bylo milovat muže se vznešeným a inspirativním jménem Ernest. Lady Bracknellová se vrací a podrobuje Jacka nesmiřitelnému výslechu o jeho financích, majetku a rodinném původu. Když Jack přizná, že nezná své rodiče, protože byl jako novorozeně nalezen v černé kožené cestovní kabelce v úschovně zavazadel na nádraží Victoria, lady Bracknellová je pobouřena a sňatek kategoricky zakáže, dokud si nenajde nějaké příbuzné.',
          summaryEn: 'Gwendolen arrives with her formidable mother, Lady Bracknell. While Algernon distracts his aunt in the music room, Jack confesses his love to Gwendolen and proposes. She enthusiastically accepts, confessing that it has always been her ideal to love someone of the name Ernest, as it inspires absolute confidence. Lady Bracknell returns, dismisses Gwendolen, and subjects Jack to an exhaustive interrogation regarding his income, politics, and family lineage. When Jack reveals he has no known parents and was found as a newborn in a black handbag in the cloakroom at Victoria Station (Brighton line), Lady Bracknell is outraged, declaring that marrying into a cloakroom is out of the question.',
          vocabulary: [
            { en: 'handbag', cz: 'cestovní taška / kabelka' },
            { en: 'cloak-room', cz: 'úschovna zavazadel / šatna na nádraží' },
            { en: 'lineage / pedigree', cz: 'rodokmen / urozený původ' },
            { en: 'indomitable', cz: 'nezdolný / neústupný' },
            { en: 'alliance', cz: 'sňatek / rodinné spojenectví' },
            { en: 'parcel', cz: 'balíček / zavazadlo' },
            { en: 'absurdity', cz: 'absurdita / nesmyslnost' }
          ]
        },
        {
          id: 'earnest-cp-3',
          startTime: 2680,
          time: 4500, // ~75:00
          title: '3. Dějství: Venkovské sídlo a příjezd „hříšného bratra Ernesta“',
          summaryCz: 'Děj se přesouvá do zahrady Jackova venkovského panství v Hertfordshire. Mladá Cecily se zde pod dohledem guvernantky slečny Prismové učí němčinu a politickou ekonomii a sní o Jackově tajemném, zlém bratrovi Ernestovi. Slečna Prismová flirtuje s místním ctihodným rektorem Chasublem a odchází s ním na procházku. Do sídla nečekaně přijíždí Algernon, který se vydává za neexistujícího bratra Ernesta. Cecily je okouzlena a Algernon se do ní okamžitě zamiluje. Oba mladí lidé propadají vzájemné náklonnosti.',
          summaryEn: 'The scene shifts to the garden of Jack\'s country estate in Manor House, Woolton. Young Cecily is reluctant to study German and political economy with her governess, Miss Prism, daydreaming instead about Jack\'s wicked, mysterious brother Ernest. Miss Prism flirts with the local rector, Dr. Chasuble, and walks off into the grounds. Suddenly, Algernon arrives posing as the wicked brother Ernest. Cecily is instantly fascinated by his bad reputation, and Algernon is utterly smitten with her beauty and wit.',
          vocabulary: [
            { en: 'governess', cz: 'guvernantka / vychovatelka' },
            { en: 'rector', cz: 'farář / rektor (dr. Chasuble)' },
            { en: 'wicked / wickedness', cz: 'hříšný / zkažený / nezvedenost' },
            { en: 'repentance', cz: 'pokání / lítost nad hříchy' },
            { en: 'reformation', cz: 'napravení / polepšení se' },
            { en: 'manor house', cz: 'panské sídlo / venkovský zámeček' },
            { en: 'christening', cz: 'křtiny / křest' }
          ]
        },
        {
          id: 'earnest-cp-4',
          startTime: 4500,
          time: 6120, // ~102:00
          title: '4. Dějství: Smutek, souboj u čaje a odhalení',
          summaryCz: 'Jack se vrací na panství v hlubokém smutečním šatu s tvrzením, že jeho bratr Ernest v Paříži náhle zemřel na těžké nachlazení. Je šokován, když zjistí, že v domě vesele obědvá Algernon převlečený za Ernesta! Mezitím Algernon požádá Cecily o ruku a zjistí, že Cecily si jejich zasnoubení již před třemi měsíci zapsala do svého deníku. Na panství vzápětí dorazí i Gwendolen. Při odpoledním čaji dojde mezi Cecily a Gwendolen k břitké a zdvořilé slovní přestřelce, protože obě věří, že jsou zasnoubeny s „Ernestem Worthingem“. Když se oba muži objeví, vyjde pravda najevo: ani jeden z nich se ve skutečnosti nejmenuje Ernest! Dívky se urazí a odcházejí do domu, zatímco Jack a Algernon se dohadují nad muffiny.',
          summaryEn: 'Jack returns home dressed in deep mourning clothes, announcing that his brother Ernest has died in Paris from a severe chill. His plan to kill off Ernest collapses when he finds Algernon staying at the house, masquerading as Ernest. Meanwhile, Algernon proposes to Cecily, who reveals that in her diary, they have already been engaged for months. Soon, Gwendolen arrives from London. During afternoon tea, Cecily and Gwendolen engage in a brilliantly polite verbal duel over who is truly engaged to "Ernest Worthing." When Jack and Algernon enter, the truth is exposed: neither man\'s real name is Ernest! The women retreat into the house in indignation, leaving Jack and Algernon quarrelling over tea muffins.',
          vocabulary: [
            { en: 'mourning', cz: 'smuteční šat / smutek' },
            { en: 'diary', cz: 'deník (Cecilyina fiktivní romance)' },
            { en: 'entanglement', cz: 'milostná zápletka / zapletení se' },
            { en: 'deception', cz: 'klam / přetvářka / lest' },
            { en: 'sugar tongs', cz: 'kleštičky na cukr' },
            { en: 'muffins', cz: 'muffiny / čajové koláčky' },
            { en: 'indignation', cz: 'rozhořčení / pobouření' }
          ]
        },
        {
          id: 'earnest-cp-5',
          startTime: 6120,
          time: 8900, // ~148:20
          title: '5. Dějství: Záhada slečny Prismové a Jak je důležité míti Filipa',
          summaryCz: 'Oba muži se domluví s dr. Chasublem, aby je ještě téhož odpoledne překřtil na Ernesta, čímž si udobří Cecily i Gwendolen. Vtom však na panství vtrhne lady Bracknellová pátrající po dceři. Algernon oznámí své zasnoubení s Cecily, a lady Bracknellová svolí, jakmile zjistí, že Cecily má obrovské jmění. Jack však jako poručník odmítá sňatek povolit, dokud lady Bracknellová nesvolí k jeho sňatku s Gwendolen. Nastává patová situace, kterou rozetne příchod slečny Prismové. Lady Bracknellová v ní pozná bývalou chůvu, která před 28 lety odešla s kočárkem a novorozencem lorda Bracknella a už se nevrátila. Slečna Prismová se s pláčem dozná k osudovému omylu: v roztržitosti vložila třísložkový sentimentální román do kočárku a dítě vložila do černé kabelky, kterou zapomněla na nádraží Victoria. Jack přinese onu kabelku a potvrdí se, že je starším bratrem Algernona! V armádních seznamech po svém otci, generálu Moncrieffovi, navíc zjistí, že jeho pravé křestní jméno po otci skutečně zní Ernest. Hra končí všeobecným usmířením, třemi zasnoubeními a Jackovým zjištěním, jak důležité je míti Filipa (být upřímný a jmenovat se Ernest).',
          summaryEn: 'Jack and Algernon win back Cecily and Gwendolen by arranging with Dr. Chasuble to be rechristened "Ernest." Lady Bracknell arrives pursuing Gwendolen. She consents to Algernon\'s engagement to Cecily upon learning of Cecily\'s substantial fortune, but Jack, as guardian, refuses his consent unless Lady Bracknell allows him to marry Gwendolen. The standoff is shattered when Dr. Chasuble mentions Miss Prism. Lady Bracknell recognizes her as the nursery governess who disappeared 28 years ago with a baby boy. Miss Prism confesses that in a moment of mental distraction, she placed her three-volume manuscript in the pram and put the baby into a black leather handbag, which she left at Victoria Station. Jack fetches the handbag, proving he is that lost baby – and Algernon\'s elder brother! Checking the Army Lists for his father\'s name, Jack discovers his real christened name was indeed Ernest. The play concludes with three happy couples and Jack realizing the vital importance of being Earnest.',
          vocabulary: [
            { en: 'three-volume novel', cz: 'třísvazkový sentimentální román' },
            { en: 'pram / perambulator', cz: 'kočárek pro miminko' },
            { en: 'distraction of mind', cz: 'roztržitost / pomatení mysli' },
            { en: 'army list', cz: 'armádní seznam důstojníků' },
            { en: 'rechristened / baptized', cz: 'překřtěn / pokřtěn' },
            { en: 'vital importance', cz: 'životní / zásadní důležitost' },
            { en: 'earnest / Earnest', cz: 'upřímný, vážně smýšlející / jméno Ernest (slovní hříčka v názvu hry)' }
          ]
        }
      ]
    },

    // 🎭 OUR TOWN (NAŠE MĚSTEČKO)
    'our-town': {
      title: 'Our Town',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/Our_Town.cs.vtt',
      checkpoints: [
        {
          id: 'our-town-cp-1',
          startTime: 0,
          time: 1590, // 26:30
          title: '1. Dějství: Běžný den v Grover\'s Corners',
          summaryCz: 'Režisér (Stage Manager) uvádí diváky do ospalého městečka Grover\'s Corners v New Hampshire na úsvitu 7. května 1901. Bez kulis a rekvizit líčí probouzející se obec: Dr. Gibbs se vrací domů po nočním porodu dvojčat, mlékař Howie Newsome rozváží mléko se svou starou kobylou Bessie a chlapec Joe Crowell doručuje ranní noviny. V sousedících domech Gibbsových a Webbových začíná běžný rodinný shon – matky chystají snídani a posílají děti (George a Rebeku Gibbsovy, Emily a Wallyho Webbovy) do školy. Pan Webb (vydavatel místních novin) a profesor Willard doplňují historický a demografický přehled městečka pro zvídavé diváky.',
          summaryEn: 'The Stage Manager introduces the audience to the quiet town of Grover\'s Corners, New Hampshire, at dawn on May 7, 1901. On a bare stage without props, he evokes the awakening town: Dr. Gibbs returns home after delivering twin babies, milkman Howie Newsome delivers milk with his horse Bessie, and paperboy Joe Crowell delivers the morning Sentinel. Next door to each other, the Gibbs and Webb households start their daily morning routine – mothers preparing breakfast and sending the children (George & Rebecca Gibbs, Emily & Wally Webb) to school. Editor Webb and Professor Willard provide a geological and historical profile of the town in response to questions from the audience.',
          vocabulary: [
            { en: 'Stage Manager', cz: 'Režisér / průvodce dějem (vypravěč bez rekvizit)' },
            { en: 'commencement', cz: 'maturita / promoce / slavnostní zakončení školy' },
            { en: 'daily life', cz: 'každodenní / všední život' },
            { en: 'vestiges', cz: 'pozůstatky / stopy (geologické vrstvy)' },
            { en: 'anthropological', cz: 'antropologický (zkoumání lidské kultury)' },
            { en: 'delivered twins', cz: 'odrodil dvojčata' },
            { en: 'tombstone', cz: 'náhrobní kámen' }
          ]
        },
        {
          id: 'our-town-cp-2',
          startTime: 1590,
          time: 3200, // 53:20
          title: '1. Dějství: Zkouška sboru a rozhovor u měsíce',
          summaryCz: 'Odpoledne po škole se George a Emily potkávají na ulici a povídají si o studiu; Emily se doma svěřuje matce a ptá se, zda je hezká. Večer se místní ženy scházejí v kostele na zkoušce pěveckého sboru pod vedením varhaníka Simona Stimsona, který očividně bojuje s těžkým alkoholismem a vnitřním trápením. Mezitím si George a Emily povídají ze svých podkrovních oken při měsíčním svitu a George žádá Emily o pomoc s algebrou. Dr. Gibbs promlouvá k synovi o zodpovědnosti a pomoci matce se dřívím. Dámy se vracejí ze sboru za zvuku nočního klidu a Režisér uzavírá první dějství – „Všední život“.',
          summaryEn: 'After school, George and Emily converse about homework and the future; Emily confides in her mother, asking if she is pretty enough to turn heads. That evening, the town choir rehearses hymns at the Congregational church under the direction of Simon Stimson, the talented church organist battling severe alcoholism and inner anguish. Meanwhile, George and Emily study by moonlight at their second-floor windows across the yard, talking about mathematics and astronomy. Dr. Gibbs gently scolds George for neglecting his chores to help his mother. The choir women walk home in the moonlight gossiping about Simon Stimson, and the Stage Manager brings the first act, "Daily Life", to a close.',
          vocabulary: [
            { en: 'choir practice', cz: 'zkouška pěveckého sboru' },
            { en: 'organist', cz: 'varhaník' },
            { en: 'moonlight', cz: 'měsíční svit' },
            { en: 'algebra', cz: 'algebra / matematika' },
            { en: 'chore / chop wood', cz: 'domácí práce / sekat dříví' },
            { en: 'Blessed Be the Tie That Binds', cz: 'Budiž požehnán svazek lásky (ústřední křesťanský hymnus)' },
            { en: 'gossip', cz: 'drby / klepy' }
          ]
        },
        {
          id: 'our-town-cp-3',
          startTime: 3200,
          time: 4635, // 1:17:15
          title: '2. Dějství: Láska a manželství (Vzpomínka na lékárnu)',
          summaryCz: 'Uplynuly 3 roky (červenec 1904). Režisér oznamuje začátek druhého dějství s názvem „Láska a manželství“. Je deštivé ráno svatebního dne George Gibbse a Emily Webbové. Režisér však vrací čas o rok zpět, aby divákům ukázal, jak jejich láska začala: Emily a George kráčejí po vyhlášení voleb ze školy a Emily Georgeovi upřímně vytkne, že od té doby, co je baseballovou hvězdou, zpychl a odcizil se kamarádům. Otřesený George ji pozve do Morganovy drogerie na jahodovou sodovku (strawberry phosphate). Při otevřeném rozhovoru si oba uvědomí, jak moc pro sebe znamenají, a George se rozhodne neodejít na zemědělskou univerzitu, aby neztratil svou životní lásku.',
          summaryEn: 'Three years have passed (July 1904). The Stage Manager announces Act II, titled "Love and Marriage". It is the rainy morning of George and Emily\'s wedding day. Before the ceremony, the Stage Manager takes the audience back one year to show how their romance blossomed: walking home from school, Emily candidly confronts George, saying that baseball fame has made him conceited and distant. A humbled George invites her to Mr. Morgan\'s drugstore for strawberry phosphates. Over drinks, they pour their hearts out; George realizes how precious Emily is to him and resolves not to go away to agricultural college, choosing to remain in Grover\'s Corners by her side.',
          vocabulary: [
            { en: 'strawberry phosphate', cz: 'jahodová sodovka / limonáda' },
            { en: 'conceited', cz: 'namyšlený / domýšlivý' },
            { en: 'drugstore', cz: 'lékárna s občerstvením / drogerie' },
            { en: 'agricultural college', cz: 'zemědělská vysoká škola' },
            { en: 'fond of', cz: 'mít rád / chovat náklonnost k někomu' },
            { en: 'high school commencement', cz: 'maturitní slavnost' },
            { en: 'character', cz: 'morální charakter / povaha' }
          ]
        },
        {
          id: 'our-town-cp-4',
          startTime: 4635,
          time: 5525, // 1:32:05
          title: '2. Dějství: Svatební panika a manželský slib',
          summaryCz: 'Děj se vrací do svatebního dne v kostele. Těsně před začátkem obřadu padá na oba novomanžele tíseň z budoucnosti: George panikaří, že nechce zestárnout a převzít dospělé břemeno rodiny, a Emily v slzách prosí svého otce, aby ji odvedl pryč a nenechal vdávat. Rodiče oba mladé lidi s porozuměním uklidní a dodají jim odvahu. Režisér vystupuje v roli oddávajícího kněze a vysvětluje filozofii manželství v koloběhu přírody. George a Emily si vymění prstýnky, paní Soamesová hlasitě a dojatě opěvuje štěstí mladého páru a Režisér posílá diváky na dvacetiminutovou přestávku.',
          summaryEn: 'The scene shifts back to the wedding ceremony at the church. Minutes before walking down the aisle, both young people experience an overwhelming wave of cold feet: George panics at the thought of growing old and taking on adult burdens, while Emily breaks down in tears and begs her father to take her away. Their parents patiently reassure and comfort them. The Stage Manager steps into the pulpit as the minister, musing on the eternal impulse of nature driving souls together. George and Emily exchange vows while Mrs. Soames weeps joyfully in the pews, and the Stage Manager dismisses the audience for a twenty-minute intermission.',
          vocabulary: [
            { en: 'wedding ceremony', cz: 'svatební obřad' },
            { en: 'cold feet', cz: 'strach / panika před svatbou (dosl. studené nohy)' },
            { en: 'aisle', cz: 'ulička v kostele' },
            { en: 'minister / preacher', cz: 'oddávající kněz / kazatel' },
            { en: 'vows', cz: 'manželské sliby' },
            { en: 'intermission', cz: 'divadelní přestávka' },
            { en: 'nature pushes and contrives', cz: 'příroda tlačí a strojí (koloběh života)' }
          ]
        },
        {
          id: 'our-town-cp-5',
          startTime: 5525,
          time: 7650, // 2:07:30
          title: '3. Dějství: Hřbitov na kopci a „Sbohem, světe“',
          summaryCz: 'Uplynulo 9 let (léto 1913). Třetí dějství se odehrává na hřbitově na kopci nad městem. Mezi náhrobky tiše sedí duše zemřelých – paní Gibbsová, Wally Webb, paní Soamesová a Simon Stimson. Přichází smuteční průvod s rakví mladé Emily, která zemřela při porodu druhého dítěte. Emily usedá mezi mrtvé, ale stále cítí silné pouto k pozemskému životu. Přes varování paní Gibbsové se rozhodne vrátit se na zemi a znovu prožít jeden obyčejný den – své 12. narozeniny. V minulosti však s hlubokou bolestí zjišťuje, že živí lidé žijí ve spěchu a slepotě a neuvědomují si zázrak a vzácnost každého přítomného okamžiku. Po slavném dojemném monologu („Sbohem, světe... maminko a tatínku... tikotu hodin...“) se vrací k mrtvým. George se zhroutí na její hrob v pláči. Režisér uzavírá hru pohledem na noční oblohu a přáním klidné noci.',
          summaryEn: 'Nine years have passed (summer 1913). The third act takes place in the windy cemetery high on a hill above Grover\'s Corners. The spirits of the departed – Mrs. Gibbs, Wally Webb, Mrs. Soames, and Simon Stimson – sit quietly on chairs, gradually letting go of earthly passions. A funeral procession arrives: Emily has tragically died giving birth to her second child. Emily takes her seat among the dead, but is drawn back to the living world. Disregarding Mrs. Gibbs\'s warnings, she chooses to relive one ordinary day: her twelfth birthday. Reliving it, Emily is heartbroken by how rushed, blind, and unaware living humans are: "Do any human beings ever realize life while they live it – every, every minute?" She delivers her iconic farewell: "Goodbye, world. Goodbye, Grover\'s Corners... Mama and Papa. Goodbye to clocks ticking... Oh, earth, you\'re too wonderful for anybody to realize you." Returning to the graves, she watches George collapse in grief at her feet. The Stage Manager closes the play under the quiet stars, bidding everyone a peaceful good night.',
          vocabulary: [
            { en: 'cemetery / graveyard', cz: 'hřbitov' },
            { en: 'childbirth', cz: 'porod dítěte' },
            { en: 'funeral procession', cz: 'pohřební průvod' },
            { en: 'relive', cz: 'znovu prožít (den z minulosti)' },
            { en: 'realize life while living it', cz: 'vnímat / uvědomovat si život, dokud ho žijeme' },
            { en: 'farewell', cz: 'rozloučení / sbohem' },
            { en: 'eternity', cz: 'věčnost' }
          ]
        }
      ]
    },

    // 🎭 THE SEAGULL (RACEK)
    'the-seagull': {
      title: 'The Seagull',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/The_Seagull.cs.vtt',
      checkpoints: [
        {
          id: 'the-seagull-cp-1',
          startTime: 0,
          time: 1770, // 29:30
          title: '1. Dějství: Divadlo u jezera a konflikt s matkou',
          summaryCz: 'Na venkovském statku Petra Sorina u jezera chystá mladý Konstantin Treplev (Kostya) představení své experimentální hry pod širým nebem. Konstantin touží po nových uměleckých formách a trpí ve stínu své matky, slavné a marnivé herečky Iriny Arkadinové. Masha, dcera správce statku, odmítá učitele Medvedenka a utápí se v neopětované lásce ke Konstantinovi. Přichází sousedka Nina Zarečná, do které je Konstantin bezhlavě zamilovaný, a ujímá se jediné role ve hře. Když hra začne s mystickým monologem o duchu světa („Lidé, lvi, orli a koroptve...“), Arkadina ji nahlas zesměšní jako dekadentní nesmysl. Hluboce raněný Konstantin představení ve vzteku ukončí a uteče. Doktor Dorn jako jediný oceňuje jeho upřímné hledání nových forem.',
          summaryEn: 'On the country estate of Pyotr Sorin beside a lake, young Konstantin Treplev (Kostya) prepares an outdoor staging of his experimental avant-garde play. Konstantin yearns for innovative artistic forms and despises conventional theatre, living in the shadow of his famous, vain actress mother, Irina Arkadina. Masha, the estate bailiff\'s daughter, dresses in black mourning for her life and rebuffs the schoolmaster Medvedenko out of unrequited love for Konstantin. Nina Zarechnaya, the lovely neighbor girl whom Konstantin adores, arrives to perform the play\'s mystical monologue ("Men, lions, eagles and partridges..."). When Arkadina loudly mocks the production as decadent nonsense, a devastated Konstantin halts the performance in fury and storms off. Only Dr. Dorn perceives genuine talent and passion in Konstantin\'s artistic search.',
          vocabulary: [
            { en: 'new forms', cz: 'nové (umělecké) formy' },
            { en: 'decadent', cz: 'dekadentní / úpadkový' },
            { en: 'mourning for my life', cz: 'držet smutek za svůj život (slavná Mashina hláška)' },
            { en: 'avant-garde', cz: 'avantgardní / průkopnický' },
            { en: 'estate', cz: 'venkovské sídlo / statek' },
            { en: 'unrequited love', cz: 'neopětovaná láska' },
            { en: 'patronizing', cz: 'povýšený / blahosklonný' }
          ]
        },
        {
          id: 'the-seagull-cp-2',
          startTime: 1770,
          time: 3180, // 53:00
          title: '2. Dějství: Zastřelený racek a posedlost psaním',
          summaryCz: 'Na trávníku statku tráví společnost letní odpoledne. Nina je fascinována slavným spisovatelem Borisem Trigorinem (Arkadininým milencem), což v Konstantinovi vyvolává sžíravou žárlivost a zoufalství. Konstantin přináší mrtvého racka, kterého právě u jezera zastřelil, pokládá ho k Nininým nohám a varuje ji, že brzy zabije stejným způsobem sám sebe. Nina jeho gestu nerozumí a odtahuje se. Když Konstantin odejde, Nina zůstává o samotě s Trigorinem. Trigorin jí v upřímné zpovědi odhaluje tíživou posedlost a prokletí spisovatelského řemesla – neschopnost prostě žít, neustálou nutkavou potřebu vše pozorovat a přetvářet v text. Když spatří zastřeleného racka, napadne ho námět na povídku: dívka, která žije svobodně u jezera jako racek, dokud nepřijde muž a jen tak z nudy ji nezničí.',
          summaryEn: 'On the estate lawn, Arkadina, Dorn, Masha, and Nina pass a warm afternoon. Nina is spellbound by the presence of famous author Boris Trigorin (Arkadina\'s lover), inflaming Konstantin\'s agony and jealousy. Konstantin abruptly approaches carrying a dead seagull he just shot by the lake, laying it at Nina\'s feet and declaring that he will soon end his own life the same way. Bewildered and alienated, Nina rejects his dramatic posturing. As Konstantin retreats, Nina converses alone with Trigorin. In a profound monologue, Trigorin describes the obsessive burden of the writer: the relentless compulsion to dissect and record every feeling, never allowing him to simply enjoy life. Noticing the dead bird, Trigorin jots down an idea: a subject for a short story about a free girl living beside a lake like a seagull, until a man happens by and casually destroys her.',
          vocabulary: [
            { en: 'seagull', cz: 'racek (ústřední symbol zmařeného života)' },
            { en: 'subject for a short story', cz: 'námět na povídku' },
            { en: 'compulsion', cz: 'vnitřní nutkání / neodbytná posedlost' },
            { en: 'jealousy', cz: 'žárlivost' },
            { en: 'taxidermy / stuffed bird', cz: 'vycpávání zvířat / vycpaný pták' },
            { en: 'fame / celebrity', cz: 'sláva / celebrita' },
            { en: 'destroy for sport', cz: 'zničit jen tak z rozmaru / pro zábavu' }
          ]
        },
        {
          id: 'the-seagull-cp-3',
          startTime: 3180,
          time: 5130, // 1:25:30
          title: '3. Dějství: Výměna obvazů a tajný slib',
          summaryCz: 'V jídelně statku se připravuje odjezd Arkadinové a Trigorina. Konstantin se pokusil zastřelit, ale kulka mu pouze škrábla lebku; navíc vyzval Trigorina na souboj. Nastává stěžejní scéna, kdy Arkadina vyměňuje obvaz na synově hlavě: chvíle hluboké mateřské a synovské něhy se však během okamžiku zvrhne v divokou hádku plnou výčitek, lakoty a urážek jeho talentu. Oba nakonec v slzách končí v objetí. Mezitím Trigorin Arkadinové přizná, že propadl kouzlu mladé Niny a chce zůstat. Arkadina klesá na kolena a vášnivým lichocením a citovým vydíráním Trigorina zmanipuluje, aby zůstal s ní. Těsně před odjezdem se však Trigorin tajně setkává s Ninou: Nina mu oznamuje, že utíká od rodičů do Moskvy k divadlu. Sdílejí vášnivý polibek a slibují si tajné setkání v hotelu Slovanský bazar.',
          summaryEn: 'In the dining room, Arkadina and Trigorin prepare to leave. Following a failed suicide attempt in which Konstantin grazed his scalp with a bullet, he has challenged Trigorin to a duel. A tempestuous scene unfolds between mother and son as Arkadina dresses Konstantin\'s head wound: tender intimacy instantly devolves into vicious mutual recriminations about his lack of talent and her artistic mediocrity, before dissolving into tears and reconciliation. Trigorin then confesses to Arkadina his passion for Nina and begs to be released. Desperate, Arkadina drops to her knees and showers him with shameless flattery and theatrical seduction until he capitulates. Just before their departure, Trigorin steals a private moment with Nina: she reveals she is running away to Moscow to pursue the stage. They exchange a passionate kiss and agree to meet in secret.',
          vocabulary: [
            { en: 'bandage', cz: 'obvaz na hlavě' },
            { en: 'duel', cz: 'souboj' },
            { en: 'flattery', cz: 'lichocení / podlézání' },
            { en: 'capitulate / surrender', cz: 'kapitulovat / vzdát se' },
            { en: 'mediocrity', cz: 'průměrnost / bezvýznamnost' },
            { en: 'infatuation', cz: 'pobláznění / zaslepená zamilovanost' },
            { en: 'rendezvous', cz: 'tajná schůzka / dostaveníčko' }
          ]
        },
        {
          id: 'the-seagull-cp-4',
          startTime: 5130,
          time: 6930, // 1:55:30
          title: '4. Dějství: Dva roky poté (Zimní loto a vycpaný racek)',
          summaryCz: 'Uplynuly dva roky. Je bouřlivý zimní večer v Sorinově pracovně, upravené na Konstantinovo spisovatelské zázemí. Sorinovo zdraví prudce upadá. Masha se z trucu a rezignace vdala za učitele Medvedenka, mají dítě, ale Masha stále bezvýchodně miluje Konstantina. Konstantin se stal publikovaným spisovatelem v metropolitních časopisech, avšak jeho práce mu nepřináší štěstí. Společnost hraje loto a probírá smutný osud Niny: její vztah s Trigorinem zkrachoval, společné dítě zemřelo, Trigorin ji opustil a vrátil se k Arkadinové. Nina nyní bez úspěchu hraje v provinčních kočovných divadlech. Shamrayev mimochodem ukazuje vycpaného racka, kterého dal na Trigorinův dřívější pokyn zhotovit, ale Trigorin si na svůj slib ani nevzpomíná. Hosté odcházejí na večeři a Konstantin zůstává u psacího stolu sám.',
          summaryEn: 'Two years have elapsed. It is a stormy autumn/winter evening in Sorin\'s study, converted into Konstantin\'s writing den. Sorin\'s health is rapidly deteriorating. In hopeless resignation, Masha has married Medvedenko and had a child, yet remains consumed by love for Konstantin. Konstantin has achieved success as a published author in Petersburg journals, though his writing feels hollow and abstract. The family gathers around the table for a game of lotto, recounting Nina\'s tragic fate: seduced by Trigorin, she bore a child that died; Trigorin abandoned her to return to Arkadina, and Nina\'s acting career disintegrated into miserable provincial tours. Shamrayev brings in the taxidermied seagull that Trigorin requested two years ago, but Trigorin has entirely forgotten ever asking for it. The company drifts into the next room for supper, leaving Konstantin alone at his desk.',
          vocabulary: [
            { en: 'two years elapsed', cz: 'uplynuly dva roky' },
            { en: 'lotto', cz: 'loto (stolní společenská hra)' },
            { en: 'provincial theatre', cz: 'provinční / kočovné divadlo' },
            { en: 'resignation', cz: 'rezignace / odevzdanost osudu' },
            { en: 'taxidermy / stuffed gull', cz: 'vycpaný racek' },
            { en: 'hollow success', cz: 'prázdný / hořký úspěch' },
            { en: 'deteriorating health', cz: 'zhoršující se zdraví' }
          ]
        },
        {
          id: 'the-seagull-cp-5',
          startTime: 6930,
          time: 8195, // 2:16:35
          title: '4. Dějství: Návrat Niny („Jsem racek“) a osudný výstřel',
          summaryCz: 'Zatímco je dům prázdný, oknem z temné zahrady nečekaně vklouzne promrzlá a vyčerpaná Nina. V horečnatém, srdceryvném rozhovoru rekapituluje své utrpení, ztrátu dítěte i Trigorinovu zradu. V blouznění opakuje symbolický motiv: „Jsem racek... Ne, to není ono. Jsem herečka.“ Konstantin ji na kolenou prosí, aby zůstala, a nabízí jí celý svůj život. Nina však jeho nabídku odmítá; ví, že její cesta vede dál do chudého divadla v Jeleci. Dojatě ho obejme a mizí v deštivé noci. Konstantin po jejím odchodu pomalu a systematicky roztrhá všechny své rukopisy a v naprostém tichu opustí pokoj. Ostatní se vracejí k partii lota, když vtom z vedlejší místnosti zazní tlumený výstřel. Doktor Dorn jde situaci prověřit a odvádí Trigorina stranou se slavnou mrazivou větou: „Odvěďte odsud Irinu Nikolajevnu. Jde o to, že Konstantin Gavrilovič se zastřelil.“',
          summaryEn: 'Left alone at his desk, Konstantin is startled as a soaking-wet, shivering Nina slips in through the French doors. In an agonizing, feverish reunion, she recounts her hardships, the loss of her baby, and Trigorin\'s cold rejection. In poetic dissociation, she whispers the famous refrain: "I am a seagull... No, that\'s not it. I am an actress." Konstantin desperately professes his undying love and implores her to stay with him forever. Though weeping, Nina refuses, embracing him in farewell before vanishing into the dark night toward a miserable provincial acting contract in Yelets. Shattered and bereft of hope, Konstantin silently and methodically shreds every one of his manuscripts, then steps into the adjoining room. The family returns to their lotto game until a muted gunshot echoes offstage. Dr. Dorn investigates and discreetly pulls Trigorin aside, whispering the play\'s chilling final line: "Get Irina Nikolayevna away from here. The fact is, Konstantin Gavrilovich has shot himself."',
          vocabulary: [
            { en: 'I am a seagull / I am an actress', cz: 'Jsem racek / Jsem herečka (slavný monolog Niny)' },
            { en: 'dissociation / feverish', cz: 'blouznění / horečnatý stav' },
            { en: 'tear up manuscripts', cz: 'roztrhat rukopisy' },
            { en: 'gunshot offstage', cz: 'výstřel za scénou' },
            { en: 'shot himself', cz: 'zastřelil se' },
            { en: 'chill / freezing', cz: 'mrazivý závěr' },
            { en: 'endurance / carry one\'s cross', cz: 'nést svůj kříž / schopnost vytrvat' }
          ]
        }
      ]
    },

    // 🏛️ ANTIGONE
    'antigone': {
      title: 'Antigone',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/Antigone.cs.vtt',
      checkpoints: [
        {
          id: 'antigone-cp-1',
          startTime: 0,
          time: 920, // 15:20
          title: '1. Scéna: Zapovězený pohřeb a Kreontův dekret',
          summaryCz: `Po bratrovražedném boji o Théby, v němž padli oba synové Oidipovi (Eteoklés i Polyneikés), se Antigona tajně schází se svou sestrou Isménou. Oznamuje jí krutý výnos nového krále Kreonta: zatímco Eteoklés byl pohřben se všemi vojenskými poctami, Polyneikovo tělo má zůstat nepohřbeno na pospas mrchožroutům pod trestem ukamenování. Antigona je odhodlána bratra navzdory zákazu pohřbít z posvátné rodinné povinnosti. Isména ze strachu před mocí státu odmítá pomoci. Kreon v slavnostním projevu před radou starších formuluje svou politickou zásadu: oddanost státu musí stát nade všemi osobními a rodinnými pouty.`,
          summaryEn: `Following the civil war in which Oedipus's sons Eteocles and Polyneices killed one another, Antigone secretly meets her sister Ismene outside the palace. She reveals the ruthless decree of Thebes' new ruler, Creon: while Eteocles received full martial honors, Polyneices' corpse must lie unburied as carrion for dogs and vultures under penalty of public stoning. Antigone resolves to defy the decree out of familial love and sacred divine duty. Ismene, terrified of state power, refuses to assist. In an address to the elders, Creon declares his political creed: loyalty to the state supersedes all personal and kinship ties.`,
          vocabulary: [
            { en: 'edict / decree', cz: 'výnos / nařízení krále' },
            { en: 'scavenger / carrion', cz: 'mrchožrout / mršina' },
            { en: 'sacred rites', cz: 'posvátné pohřební obřady' },
            { en: 'unwritten laws of the gods', cz: 'nepsané věčné zákony bohů' },
            { en: 'treason / traitor', cz: 'vlastizrada / zrádce vlasti' },
            { en: 'stoning to death', cz: 'ukamenování k smrti' }
          ]
        },
        {
          id: 'antigone-cp-2',
          startTime: 920,
          time: 1940, // 32:20
          title: '2. Scéna: Strážcovo svědectví a zatčení Antigony',
          summaryCz: `Zděšený strážce oznamuje Kreontovi, že někdo navzdory hlídce rituálně posypal Polyneikovo tělo prachem. Rozzuřený a paranoidní Kreon podezírá politické úplatkářství a vyhrožuje strážcům mučením na skřipci. O něco později se strážce vrací a vítězoslavně přivádí zajatou Antigonu, kterou přistihl při činu uprostřed prachové bouře, když tělo znovu rituálně omývala a sypala prachem. Antigona v hrdé obhajobě před králem prohlašuje, že Kreontovy pozemské zákony nemají moc přebít věčné a nezvratné zákony nebes. Když Isména nabízí sdílet vinu, Antigona její opožděné mučednictví odmítá.`,
          summaryEn: `A terrified sentry informs Creon that an unknown person has performed a ritual dust burial over Polyneices' rotting corpse. Creon suspects bribery and threatens the sentries with torture. Soon after, the sentry returns escorting Antigone, whom he caught red-handed during a sudden dust storm performing libations over the exposed body. Antigone fearlessly proclaims that a mortal ruler's proclamation cannot nullify the eternal, unwritten laws of Heaven. When a remorseful Ismene offers to share the guilt, Antigone firmly spurns her belated martyrdom.`,
          vocabulary: [
            { en: 'sentry / guard', cz: 'hlídka / strážce' },
            { en: 'caught red-handed', cz: 'přistižen přímo při činu' },
            { en: 'libation', cz: 'úlitba bohům' },
            { en: 'rack and torture', cz: 'mučení na skřipci' },
            { en: 'gag of terror', cz: 'náhubek strachu / teror tyranie' },
            { en: 'mortal proclamation', cz: 'výnos smrtelníka' }
          ]
        },
        {
          id: 'antigone-cp-3',
          startTime: 1940,
          time: 3120, // 52:00
          title: '3. Scéna: Haimónův spor s otcem a rozsudek živého pohřbení',
          summaryCz: `Kreontův syn Haimón, snoubenec Antigony, přichází k otci. Nejprve projevuje synovskou oddanost, ale poté naléhavě varuje krále: lid v Thébách s Antigonou tajně soucítí a oslavuje její čin. Haimón otce vyzývá k pružnosti a připomíná: „Stát, který patří jedinému muži, není žádným státem.“ Kreon v záchvatu autoritářské pýchy syna uráží a obviňuje z podřízenosti ženě. Haimón v hněvu odchází s přísahou, že ho otec už nikdy neuvidí. Kreon mění rozsudek: namísto veřejného ukamenování nařizuje odvést Antigonu do skalní jeskyně a zazdít ji zaživa s minimem jídla, aby se vyhnul přímé poskvrně královské krve.`,
          summaryEn: `Creon's son Haemon, betrothed to Antigone, attempts to reason with his father. Haemon urgently cautions that the entire populace of Thebes secretly weeps for Antigone, praising her sisterly piety. Urging his father to cultivate flexibility rather than brittle stubbornness, Haemon remarks that a city ruled by one man is no city at all. Blinded by pride, Creon mocks him as a woman's slave. Haemon storms out, vowing his father will never see him again. Creon commutes Antigone's sentence to solitary entombment in a subterranean stone cave with minimal rations to avert direct blood guilt.`,
          vocabulary: [
            { en: 'filial obedience', cz: 'synovská poslušnost' },
            { en: 'tyranny / one-man city', cz: 'tyranie / stát jednoho vládce' },
            { en: 'flexibility vs stubbornness', cz: 'pružnost proti zatvrzelosti' },
            { en: 'subterranean vault / cave', cz: 'podzemní skalní hrobka' },
            { en: 'betrothed / fiance', cz: 'zasnoubený / snoubenec' },
            { en: 'blood guilt / pollution', cz: 'vina krve / poskvrna' }
          ]
        },
        {
          id: 'antigone-cp-4',
          startTime: 3120,
          time: 4320, // 1:12:00
          title: '4. Scéna: Antigonin pláč a Teiresiovo mrazivé varování',
          summaryCz: `Vojáci odvádějí Antigonu k hrobce. V dojemném lamento pláče nad svým osudem: umírá mladá, bez svatby a bez dětí, jako nevěsta podsvětí, přesto hrdá na svou morální integritu. Krátce po jejím odchodu přichází starý slepý věštec Teiresiás. Oznamuje Kreontovi zlověstná znamení: ptáci se vraždí na obětištích a posvátný oheň nehoří, protože oltáře v Thébách jsou znesvěceny hnijícím tělem Polyneika. Teiresiás varuje krále před zatvrzelou pýchou a prorokuje, že bohové si za tělo nepohřbeného a tělo zaživa pohřbené vezmou život z Kreontovy vlastní krve.`,
          summaryEn: `Guards lead Antigone toward the rock-cut tomb. In a heart-rending farewell monologue, she laments her tragic fate: dying unwed and childless, descending to marry only the god of Death, yet steadfast in her moral integrity. Soon after, the blind prophet Tiresias arrives. He warns of dreadful omens: screaming birds ripping each other apart and sacrificial fires sputtering out, because the city's altars have been desecrated by carrion from Polyneices' corpse. Tiresias delivers an ultimatum: obstinate pride is madness; Heaven demands a life for a life from Creon's own flesh.`,
          vocabulary: [
            { en: 'bridal bower of death', cz: 'svatební komnata smrti' },
            { en: 'omens / augury', cz: 'zlá znamení / věštění z ptáků' },
            { en: 'desecrated altars', cz: 'znesvěcené oltáře' },
            { en: 'obstinacy / stubborness', cz: 'zatvrzelost / paličatost' },
            { en: 'fury of the gods', cz: 'hněv bohů / fúrie podsvětí' },
            { en: 'integrity', cz: 'morální pevnost / integrita' }
          ]
        },
        {
          id: 'antigone-cp-5',
          startTime: 4320,
          time: 5530, // 1:32:10
          title: '5. Scéna: Zkáza vladařského domu a poznání pravdy',
          summaryCz: `Vyděšený sbor přesvědčí Kreonta, aby ustoupil. Král spěchá Polyneika řádně pohřbít a poté osvobodit Antigonu. Přichází však posel se zprávou o katastrofě: když dorazili ke skalní kobce, Antigona již visela oběšená na svém závoji. Haimón klečel u jejího těla, a když spatřil otce, v zoufalém hněvu po něm sekl mečem a poté obrátil ostří proti své vlastní hrudi. Královna Eurydiké po vyslechnutí zprávy v tichu odejde a probodne se nožem u oltáře, přičemž prokleje Kreonta za smrt obou synů. Zlomený Kreon se vrací s tělem svého syna v náručí a v zoufalství prosí o vlastní smrt. Hra končí moudrostí sboru: pýcha přináší pád a rozum přichází až s utrpením.`,
          summaryEn: `Shaken, Creon heeds the Chorus's advice and rushes to bury Polyneices' remains, then unseal the cavern. However, a messenger brings news of catastrophic ruin: arriving at the vault, they found Antigone hanged by her veil. Haemon was clutching her lifeless corpse; upon seeing Creon, the prince lunged at his father with his sword, then turned the blade into his own ribs, dying beside his beloved. Hearing this, Queen Eurydice stabs herself at the altar, cursing Creon as the murderer of their children. Creon returns carrying Haemon's corpse, utterly shattered, begging for death. The Chorus delivers the closing truth: proud men are broken to teach wisdom in bitter old age.`,
          vocabulary: [
            { en: 'messenger / herald', cz: 'posel přinášející zprávu' },
            { en: 'veil / linen noose', cz: 'závoj / smyčka z plátna' },
            { en: 'turn the blade against oneself', cz: 'obrátit ostří proti sobě' },
            { en: 'shattered / broken', cz: 'zlomený / v troskách' },
            { en: 'hubris / arrogance', cz: 'pýcha / zpupnost před bohy' },
            { en: 'wisdom through suffering', cz: 'moudrost vykoupená utrpením' }
          ]
        }
      ]
    },

    // ⚔️ MACBETH
    'macbeth': {
      title: 'Macbeth',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/Macbeth.cs.vtt',
      checkpoints: [
        {
          id: 'macbeth-cp-1',
          startTime: 0,
          time: 2040, // 34:00
          title: '1. Dějství: Věštba čarodějnic a krvavé plány',
          summaryCz: `Vojevůdci Macbeth a Banquo se po vítězné bitvě setkávají na mlhavém vřesovišti se třemi čarodějnicemi. Ty Macbetha oslovují jako théna z Glamisu, z Cawdoru a budoucího krále, zatímco Banquovi věští, že zplodí linii králů. Krátce nato přichází posel s potvrzením, že král Duncan jmenoval Macbetha thénem z Cawdoru. Lady Macbeth po přečtení manželova dopisu vzývá temné síly („zbavte mě mého ženského pohlaví“) a přesvědčuje váhajícího Macbetha, aby krále Duncana během noční návštěvy na jejich hradě v Inverness zavraždil.`,
          summaryEn: `Scottish generals Macbeth and Banquo encounter three weird sisters on a misty heath. The witches prophesy that Macbeth will become Thane of Cawdor and King hereafter, while Banquo will father a royal lineage. When King Duncan's messengers confirm Macbeth's elevation to Thane of Cawdor, his ambition is ignited. Receiving his letter at Inverness, Lady Macbeth invokes spirits of murder to "unsex" her of compassion, fiercely overriding her husband's moral doubts and orchestrating Duncan's murder during his royal visit.`,
          vocabulary: [
            { en: 'weird sisters / witches', cz: 'tři sudičky / čarodějnice' },
            { en: 'Thane of Glamis / Cawdor', cz: 'thén (skotský šlechtic) z Glamisu / Cawdoru' },
            { en: 'prophecy / foresee', cz: 'proroctví / předpověď' },
            { en: 'unsex me here', cz: 'zbavte mě ženství (slavný monolog Lady Macbeth)' },
            { en: 'innocent flower vs serpent', cz: 'nevinný květ ukrývající hada' },
            { en: 'vaulting ambition', cz: 'přepjatá / bezohledná ctižádost' }
          ]
        },
        {
          id: 'macbeth-cp-2',
          startTime: 2040,
          time: 3090, // 51:30
          title: '2. Dějství: Vize dýky, vražda krále Duncana a útěk princů',
          summaryCz: `V hluboké noci má Macbeth halucinaci krvavé dýky vznášející se ve vzduchu („Je to dýka, co před sebou vidím?“). Vstoupí do královské ložnice a spícího Duncana zavraždí. Vrací se v šoku s krvavýma rukama a dýkami, neschopen říci „Amen“ a přesvědčen, že „zavraždil spánek“. Lady Macbeth dýky chladnokrevně odnáší zpět ke strážím, aby je potřísnila krví. Následuje komická scéna vrátného reagujícího na bušení u brány. Macduff objevuje zavražděného krále; Duncanovi synové Malcolm a Donalbain v obavě o život prchají do Anglie a Irska, a Macbeth je korunován králem ve Scone.`,
          summaryEn: `Under cover of night, Macbeth suffers a terrifying hallucination of a bloodied dagger floating toward Duncan's bedchamber. Compelled onward, he murders the sleeping sovereign. Paralyzed by guilt, he returns clutching the bloodied daggers, unable to pronounce "Amen" and terrorized by voices crying "Macbeth does murder sleep." Lady Macbeth takes the daggers herself to smear the chamberlains with blood. Loud knocking summons the drunken Porter. Macduff discovers the slaughtered king; Duncan's heirs Malcolm and Donalbain flee, leaving the empty throne to Macbeth.`,
          vocabulary: [
            { en: 'dagger of the mind', cz: 'přelud dýky / výplod mysli' },
            { en: 'Macbeth does murder sleep', cz: 'Macbeth zavraždil spánek' },
            { en: 'Neptune\'s ocean', cz: 'Neptunův oceán (nesmyje krev z rukou)' },
            { en: 'porter scene', cz: 'scéna vrátného u brány' },
            { en: 'treason / sacrilegious murder', cz: 'velezrada / svatokrádežná vražda' },
            { en: 'coronation at Scone', cz: 'korunovace ve Scone' }
          ]
        },
        {
          id: 'macbeth-cp-3',
          startTime: 3090,
          time: 4860, // 1:21:00
          title: '3. Dějství: Zavraždění Banqua a hostina s přízrakem',
          summaryCz: `Jako nový král trpí Macbeth paranoiou kvůli věštbě o Banquových potomcích. Najme vrahy, aby přepadli Banqua i jeho syna Fleance. Banquo je zabit, ale Fleance uprchne do tmy. Během slavnostní královské hostiny usedá na Macbethovo místo zkrvavený duch zavražděného Banqua. Macbeth před zraky skotských lordů propadá šílenému záchvatu děsu („Netřes na mě svou krvavou kšticí!“). Lady Macbeth hosty uklidňuje a hostinu předčasně rozpouští. Macbeth si uvědomuje, že se brodí v krvi tak hluboko, že návrat zpět je nemožný („Krev žádá krev“), a rozhodne se vyhledat čarodějnice.`,
          summaryEn: `Tormented by insecurity and the prophecy that Banquo's seed will reign, King Macbeth hires assassins to ambush Banquo and Fleance. Banquo is slain, but Fleance escapes. At the royal banquet, the blood-dripping ghost of Banquo appears in Macbeth's seat. Terrified before the assembled lords, Macbeth screams: "Never shake thy gory locks at me!" Lady Macbeth disperses the baffled guests. Reckoning that he is stepped so far in blood that returning were as tedious as go o'er ("blood will have blood"), Macbeth vows to confront the weird sisters again.`,
          vocabulary: [
            { en: 'fruitless crown / barren sceptre', cz: 'neplodná koruna / jalové žezlo' },
            { en: 'gory locks', cz: 'krvavá kštice / zkrvavené kadeře ducha' },
            { en: 'blood will have blood', cz: 'krev si žádá krev' },
            { en: 'stepped in blood so far', cz: 'zabředl do krve tak hluboko' },
            { en: 'paranoia / sleeplessness', cz: 'stihomam / nespavost tyrana' },
            { en: 'scorpions of the mind', cz: 'štíři v mysli' }
          ]
        },
        {
          id: 'macbeth-cp-4',
          startTime: 4860,
          time: 6600, // 1:50:00
          title: '4. Dějství: Nová proroctví sester a vyvraždění Macduffovy rodiny',
          summaryCz: `Macbeth vstupuje do jeskyně čarodějnic vařících svůj pekelný kotel („Vař se, vař a pěnu chrl...“). Zjevení mu předkládají dvojsmyslná proroctví: má se mít na pozoru před Macduffem, avšak „nikdo z ženy zrozený nemůže Macbethovi ublížit“ a nepadne, dokud „velký birnamský les nepovstane proti hradu Dunsinane“. Ukolébán pocitem nezranitelnosti, nechá ze msty přepadnout Macduffův nechráněný hrad ve Fife a brutálně povraždit Macduffovu manželku i malé děti. V Anglii mezitím Macduff přesvědčuje prince Malcolma ke společnému tažení, když dorazí zpráva o zkáze jeho rodiny. Zlomený Macduff přísahá osobní pomstu.`,
          summaryEn: `Macbeth seeks out the witches around their boiling cauldron ("Double, double toil and trouble"). Apparitions summon riddles: to beware Macduff, yet that "none of woman born shall harm Macbeth," and that he shall never be vanquished until "Great Birnam Wood to high Dunsinane Hill shall come against him." Deluded by invincibility, Macbeth reacts ruthlessly to Macduff's flight by sending killers to sack Macduff's castle at Fife, butchering his wife and children. In England, Macduff pledges fealty to Malcolm; when news arrives of his slaughtered family, grief transforms into fierce resolution for revenge.`,
          vocabulary: [
            { en: 'cauldron / toil and trouble', cz: 'kotel čarodějnic / pekelná směs' },
            { en: 'none of woman born', cz: 'nikdo z ženy zrozený' },
            { en: 'Birnam Wood to Dunsinane', cz: 'Birnamský les k Dunsinanu' },
            { en: 'slaughter of the innocents', cz: 'vyvraždění nevinných dětí a ženy' },
            { en: 'grief transformed to rage', cz: 'žal přetavený ve spravedlivý hněv' },
            { en: 'tyrant / butcher', cz: 'tyran / řezník' }
          ]
        },
        {
          id: 'macbeth-cp-5',
          startTime: 6600,
          time: 8390, // 2:19:50
          title: '5. Dějství: Šílenství Lady Macbeth, pochodující les a pád tyrana',
          summaryCz: `V Dunsinanu lékař a dvorní dáma sledují náměsíčnou Lady Macbeth, která si posedle mne ruce ve snaze smýt pomyslnou krev („Pryč, prokletá skvrno! Ani všechno arabské koření neprovoní tuto drobnou ruku“). Anglické vojsko vedené Malcolmem a Macduffem si u Birnamu uřízne větve jako kamufláž a les se dává do pohybu. Macbeth se dozvídá o královnině sebevraždě a pronáší slavný monolog o marnosti existence („Zítra a zítra a zítra... život je pouhý stín, historka vyprávěná bláznem plná hluku a zuřivosti, neznamenající nic“). V souboji Macduff odhaluje, že byl z lůna své matky předčasně vyříznut císařským řezem. Macduff Macbetha zabije a Malcolm je provolán králem Skotska.`,
          summaryEn: `At Dunsinane castle, a doctor and gentlewoman watch Lady Macbeth sleepwalking in agony, endlessly scrubbing invisible blood from her hands ("Out, damned spot! All the perfumes of Arabia will not sweeten this little hand"). Allied troops cut down boughs at Birnam Wood for camouflage, fulfilling the prophecy as the forest moves toward Dunsinane. Learning of Lady Macbeth's suicide, Macbeth speaks the immortal soliloquy ("Tomorrow, and tomorrow, and tomorrow... life's but a walking shadow, a tale told by an idiot, full of sound and fury, signifying nothing"). Confronting Macduff, Macbeth learns his foe was "from his mother's womb untimely ripped." Macduff slays the tyrant, and Malcolm is hailed King of Scotland.`,
          vocabulary: [
            { en: 'out, damned spot', cz: 'pryč, prokletá skvrno (monolog Lady Macbeth)' },
            { en: 'sleepwalking / somnambulism', cz: 'náměsíčnost z pocitu viny' },
            { en: 'tomorrow, and tomorrow, and tomorrow', cz: 'zítra a zítra a zítra (monolog o nicotě bytí)' },
            { en: 'tale told by an idiot', cz: 'pohádka vyprávěná bláznem plná hluku' },
            { en: 'untimely ripped', cz: 'předčasně vyříznut (císařským řezem)' },
            { en: 'restoration of order', cz: 'obnovení řádu a spravedlnosti' }
          ]
        }
      ]
    },

    // ✈️ ALL MY SONS
    'all-my-sons': {
      title: 'All My Sons',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/All_My_Sons.cs.vtt',
      checkpoints: [
        {
          id: 'all-my-sons-cp-1',
          startTime: 0,
          time: 2100, // 35:00
          title: '1. Dějství (Část 1): Zlomený strom a návrat Annie',
          summaryCz: `Srpen roku 1947 v americkém předměstí. Noční vichřice vyvrátila štíhlou jabloň zasazenou jako památník za Larryho Kellera, stíhacího pilota nezvěstného už tři roky od války. Joe Keller (vlastník továrny) čte na zahradě noviny a soused Frank propočítává Larryho horoskop. Syn Chris se svěřuje otci se svým přáním oženit se s Ann Deeverovou – bývalou Larryho dívkou, která právě přijela na návštěvu. Joe má obavy z reakce své manželky Kate, která sveřepě odmítá přijmout, že je Larry mrtvý, a jakýkoli sňatek Chrise s Ann by pro ni znamenal zradu a přiznání synovy smrti.`,
          summaryEn: `August 1947 in a serene Midwestern suburb. A fierce midnight wind has toppled the young apple tree planted as a memorial for Larry Keller, a fighter pilot missing in action for over three years. Self-made manufacturer Joe Keller chats amiably in the backyard with neighbors while Frank Lubey casts Larry's horoscope. Surviving son Chris confides in his father that he intends to propose marriage to Ann Deever – Larry's former sweetheart, visiting for the weekend. Joe worries about his wife Kate, whose unyielding denial that Larry is dead means that Chris marrying Ann would be an intolerable public admission of mourning.`,
          vocabulary: [
            { en: 'missing in action (MIA)', cz: 'nezvěstný v boji' },
            { en: 'memorial tree', cz: 'pamětní strom' },
            { en: 'denial / refuse to grieve', cz: 'popírání reality / odmítání smutečního procesu' },
            { en: 'sweetheart / fiancee', cz: 'milá / snoubenka' },
            { en: 'self-made man', cz: 'muž, který se vypracoval z ničeho' },
            { en: 'domestic tranquility', cz: 'zdánlivá domácí idyla' }
          ]
        },
        {
          id: 'all-my-sons-cp-2',
          startTime: 2100,
          time: 3720, // 1:02:00
          title: '1. Dějství (Část 2): Stín továrny a telefonát z New Yorku',
          summaryCz: `Ann hovoří s rodinou Kellerových o svém otci Steveovi Deeverovi – bývalém Kellerově společníkovi, který sedí ve vězení za expedici vadných hlav válců pro motory stíhaček P-40, což způsobilo zřícení 21 pilotů. Joe Keller se vehementně obhajuje, že byl v inkriminovaný den nemocný doma v posteli se zápalem plic, a svaluje veškerou vinu na Steveovu zbabělost. Chris vyznává Ann lásku a svěřuje se jí s tíživým pocitem viny přeživšího velitele ze své roty („připadá mi, jako bych neměl právo na štěstí“). Idyla se však hroutí, když z věznice v Columbusu volá Annin bratr George, který oznamuje, že právě mluvil s otcem a okamžitě nasedá na vlak k nim.`,
          summaryEn: `Ann and the Kellers revisit the painful wartime scandal involving her father, Steve Deever – Joe's partner who was convicted of shipping cracked cylinder heads to the Army Air Force, causing 21 aircraft to crash. Keller insists he was innocent, claiming he was bedridden with severe flu and that Steve made the fateful decision out of cowardice. Chris pours out his heart to Ann, confessing survivor guilt over his fallen troops and struggling to accept post-war prosperity. Just as Chris and Ann profess their mutual devotion, a frantic long-distance telephone call from Ann's brother George arrives: having visited Steve in prison, George is boarding a train to unmask the truth.`,
          vocabulary: [
            { en: 'cracked cylinder heads', cz: 'prasklé hlavy motorových válců' },
            { en: 'take the blame / fall guy', cz: 'vzít vinu na sebe / obětní beránek' },
            { en: 'survivor guilt', cz: 'vina těch, kdo přežili' },
            { en: 'profiteering', cz: 'válečné kořistnictví / kšeftování s válkou' },
            { en: 'brotherhood of soldiers', cz: 'bratrství vojáků v boji' },
            { en: 'disturbing news', cz: 'znepokojivá zpráva' }
          ]
        },
        {
          id: 'all-my-sons-cp-3',
          startTime: 3720,
          time: 6420, // 1:47:00
          title: '2. Dějství: Příjezd George a osudné prořeknutí',
          summaryCz: `George Deever přijíždí rozhněvaný a vyčerpaný. Vypráví Ann pravdu ze Steveovy výpovědi: Joe nařídil zavařit a zakrýt trhliny ve válcích po telefonu, aby nepřišel o armádní kontrakt, a když přišla katastrofa, hovor v soudní síni zapřel. Joe se snaží George uklidnit vlídností a nabídkou výhodné práce pro otce po propuštění z vězení. Situace se zdá uklidněná, dokud Kate v euforii a neopatrnosti neřekne, že Joe nebyl za patnáct let ani jediný den nemocný. George okamžitě udeří: v den dodávky prasklých válců Joe přece tvrdil, že měl zápal plic! Chris po odchodu George konfrontuje otce a Joe se v zoufalství přizná, že válce nechal poslat pro zisk své rodiny. Zdrcený Chris křičí: „Pro mě? Co jsi to za člověka? Ty jsi zabil 21 kluků!“`,
          summaryEn: `George Deever arrives tense and adversarial. He retells his father's account: that Keller ordered the defective cylinders welded over via telephone to avoid financial ruin, and later cowardly denied the phone call under oath. Keller disarms George with paternal warmth and the offer of a law partnership upon Steve's release. The tension dissolves until Kate unwittingly lets slip that Joe has never been sick a single day in fifteen years. George seizes on the contradiction: Keller's pneumonia was his entire court alibi. As George leaves, Chris corners his father until Joe confesses to authorizing the cover-up for family business survival. Shattered, Chris erupts: "For me? Where do you live, where have you come from? You killed twenty-one pilots!"`,
          vocabulary: [
            { en: 'slip of the tongue', cz: 'nechtěné prořeknutí se' },
            { en: 'ironclad alibi', cz: 'neprůstřelné alibi' },
            { en: 'perjury', cz: 'křivá přísaha u soudu' },
            { en: 'practical business / profit', cz: 'obchodní pragmatismus / honba za ziskem' },
            { en: 'moral collapse', cz: 'morální zhroucení' },
            { en: 'beast / murderer', cz: 'zvíře / vrah vlastních lidí' }
          ]
        },
        {
          id: 'all-my-sons-cp-4',
          startTime: 6420,
          time: 7920, // 2:12:00
          title: '3. Dějství (Část 1): Noční čekání a Larryho dopis',
          summaryCz: `Dvě hodiny v noci. Kate sedí na zahradní židli a čeká na Chrise, který po odhalení ujel autem do tmy. Soused lékař Jim Bayliss jí sděluje, že o Joeově vině celou dobu věděl, protože v životě člověk musí dělat kompromisy. Joe tvrdí, že rodina je nejvyšší hodnota, Chris se však vrací a prohlašuje, že otce nemůže udat na policii, protože by to bylo snadné gesto, ale nedokáže dál žít s jeho penězi. V tu chvíli vystoupí Ann a předloží Kate to, co celou dobu tajila: poslední dopis, který jí Larry poslal 25. listopadu 1943 ze své základny, těsně předtím, než byl prohlášen za nezvěstného.`,
          summaryEn: `Two in the morning. Kate sits on the porch in the damp darkness, waiting for Chris, who sped away in his car. Neighbor Dr. Jim Bayliss reveals he always knew Joe was guilty, observing that life forces every idealist into painful compromises. Keller remains stubbornly defensive, insisting that nothing is bigger than family. Chris returns, disillusioned, stating he cannot bring himself to send his father to prison because the world is too cynical, but can no longer touch his money. Desperate to resolve the impasse and marry Chris, Ann hands Kate a confidential letter Larry wrote to her on November 25, 1943, right before his final reconnaissance flight.`,
          vocabulary: [
            { en: 'compromise of idealism', cz: 'zrada ideálů / kompromis se svědomím' },
            { en: 'cynicism of the world', cz: 'cynismus světa' },
            { en: 'reconnaissance flight', cz: 'průzkumný bojový let' },
            { en: 'family above all', cz: 'rodina nade vše (Kellerova omluva)' },
            { en: 'disillusionment', cz: 'vystřízlivění / ztráta iluzí' },
            { en: 'suicide note / final letter', cz: 'dopis na rozloučenou' }
          ]
        },
        {
          id: 'all-my-sons-cp-5',
          startTime: 7920,
          time: 8900, // 2:28:20
          title: '3. Dějství (Část 2): „Všichni to byli moji synové“ a tragický výstřel',
          summaryCz: `Chris vezme dopis a přečte ho otci nahlas: Larry se z novin dozvěděl o skandálu s prasklými válci a byl tak zdrcen hanbou a zradou svého otce vůči spolubojovníkům, že se rozhodl naschvál zřítit své letadlo do moře. Keller po vyslechnutí dopisu konečně procitne z celoživotního sebeklamu. Tiše pronese klíčová slova dramatu: „Myslím, že pro něj to byli všechno moji synové. A myslím, že pro mě také.“ Joe řekne, že si vezme sako a půjde se sám přihlásit na policii. Vejde do domu. Zatímco Chris a Kate čekají na verandě, z patra zazní osudný výstřel z pistole. Chris v šoku a pláči spěchá dovnitř, ale Kate ho objímá a šeptá: „Pššt... Žij, Chrisi. Prostě žij.“`,
          summaryEn: `Chris reads Larry's farewell letter aloud to his father: having read reports of the cracked cylinders, Larry was so overwhelmed by humiliation and the knowledge of his father's guilt that he resolved to crash his plane deliberately during his next mission. The revelation shatters Keller's defense mechanism. In agonizing epiphany, he speaks the central thesis: "I think to him they were all my sons. And I guess they were, I guess they were." Joe steps into the house ostensibly to retrieve his jacket and turn himself into the authorities. A gunshot rings out from the master bedroom. Chris sobs inconsolably, but Kate cradles him on the porch, whispering: "Shh... Don't take it on yourself. Forget now. Live, Chris. Live."`,
          vocabulary: [
            { en: 'they were all my sons', cz: 'všichni to byli moji synové (ústřední poselství hry)' },
            { en: 'epiphany / revelation', cz: 'prozření / poznání pravdy' },
            { en: 'shattering guilt', cz: 'drtivá vina' },
            { en: 'gunshot offstage', cz: 'výstřel za scénou' },
            { en: 'deliberate crash', cz: 'úmyslné zřícení letounu (sebevražda)' },
            { en: 'forgiveness and life', cz: 'odpuštění a povinnost žít dál' }
          ]
        }
      ]
    },

    // 👑 HAMLET
    'hamlet': {
      title: 'Hamlet',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/Hamlet.cs.vtt',
      checkpoints: [
        {
          id: 'hamlet-cp-1',
          startTime: 0,
          time: 2130, // 35:30
          title: '1. Dějství: Duch na hradbách Elsinoru a přísaha pomsty',
          summaryCz: `Na nočních hradbách dánského hradu Elsinor se strážím zjevuje přízrak zesnulého krále Hamleta. Horatio o vidění informuje prince Hamleta, který truchlí nad otcovou náhlou smrtí a znechuceně sleduje spěšnou svatbu své matky Gertrudy s královým bratrem Claudiem („Křehkosti, tvé jméno je žena“). Hamlet se v noci setká s duchem svého otce. Duch mu odhaluje děsivou pravdu: Claudius jej zákeřně zavraždil nalitím jedu (blínu) do ucha, když spal v zahradě. Duch žádá pomstu, ale zapovídá ublížit královně. Hamlet nutí Horatia a stráže odpřísáhnout mlčení na meč a oznamuje, že nasadí masku bláznovství („antic disposition“).`,
          summaryEn: `On the freezing battlements of Elsinore, watchmen Bernardo and Marcellus witness the armored ghost of recently deceased King Hamlet. Horatio alerts Prince Hamlet, who is languishing in deep melancholy over his father's sudden death and the incestuous, hasty remarriage of Queen Gertrude to his uncle Claudius ("Frailty, thy name is woman"). Accompanying Horatio to the platform at midnight, Hamlet confronts the Ghost, who reveals the foul nature of his murder: Claudius poured juice of cursed hebona into his ears while he slept in the royal orchard. Pledging to avenge his father while sparing his mother, Hamlet swears Horatio to secrecy upon his sword and resolves to assume an "antic disposition."`,
          vocabulary: [
            { en: 'antic disposition', cz: 'předstírané / nasazené bláznovství' },
            { en: 'frailty, thy name is woman', cz: 'křehkosti, tvé jméno je žena' },
            { en: 'hebona / poison in the ear', cz: 'blín / jed nalitý do ucha' },
            { en: 'foul and unnatural murder', cz: 'ohavná a nepřirozená vražda' },
            { en: 'swear upon the sword', cz: 'přísahat na jílec meče' },
            { en: 'something is rotten in the state of Denmark', cz: 'něco je shnilého v království dánském' }
          ]
        },
        {
          id: 'hamlet-cp-2',
          startTime: 2130,
          time: 4170, // 1:09:30
          title: '2. Dějství: Předstírané šílenství, herci a léčka na krále',
          summaryCz: `Polonius oznamuje králi, že Hamlet zešílel z neopětované lásky k jeho dceři Ofélii, které zakázal s princem mluvit. Claudius a Gertruda povolávají Hamletovy spolužáky Rosencrantze a Guildensterna, aby z prince vyzvěděli příčinu jeho stavu. Hamlet však jejich poslání okamžitě prohlédne. Na hrad přijíždí potulná herecká družina. Hamlet nechá jednoho z herců přednést vášnivý monolog o pádu Tróje a pláči Hekuby. Po odchodu herců se v samotě bičuje za svou váhavost a pasivitu („Co je mu po Hekubě, co on Hekubě, že pro ni pláče?“). Vymyslí plán: nechá herce sehrát hru Vražda Gonzaga s vloženými scénami odpovídajícími otcově vraždě, aby usvědčil Claudiovo svědomí („Hra je to osídlo, v němž polapím svědomí krále“).`,
          summaryEn: `Polonius claims to King Claudius and Gertrude that Hamlet's erratic behavior stems from lovesickness for Ophelia. The monarchs summon university companions Rosencrantz and Guildenstern to spy on Hamlet, though the prince instantly discerns their mission. A traveling troupe of actors arrives at Elsinore. After an actor delivers a moving monologue on the slaughter of Priam and Hecuba's grief, Hamlet chastises himself in solitude for his paralyzing delay ("O, what a rogue and peasant slave am I! What's Hecuba to him, or he to Hecuba, that he should weep for her?"). Hamlet designs a trap: the players will perform The Murder of Gonzago with custom lines echoing King Hamlet's death to test Claudius's guilt ("The play's the thing wherein I'll catch the conscience of the King").`,
          vocabulary: [
            { en: 'what\'s Hecuba to him', cz: 'co je mu po Hekubě (monolog o hercově citu)' },
            { en: 'catch the conscience of the King', cz: 'polapit svědomí krále v osidle hry' },
            { en: 'rogue and peasant slave', cz: 'bídák a otrocký chudák' },
            { en: 'spying courtier', cz: 'špehující dvořan (Polonius)' },
            { en: 'The Murder of Gonzago', cz: 'Vražda Gonzagova (Past na myši)' },
            { en: 'discerning the trap', cz: 'prohlédnutí léčky' }
          ]
        },
        {
          id: 'hamlet-cp-3',
          startTime: 4170,
          time: 6350, // 1:45:50
          title: '3. Dějství: „Být či nebýt“, Past na myši a vražda za závěsem',
          summaryCz: `Claudius a Polonius tajně nastraží Ofélii do cesty Hamletovi. Princ přichází se slavným monologem o životě a smrti („Být či nebýt, to je otázka...“). V následném krutém rozhovoru Ofélii odmítá a vyhání do kláštera („Jdi do kláštera!“). Večer herci před královským dvorem předvádějí vraždu nalitím jedu do ucha. Claudius v panice vstává, křičí po světle a přeruší hru. Hamlet má nezvratný důkaz viny. Claudius se na kolenou marně pokouší modlit, ale Hamlet ho neušetří z milosrdenství, nýbrž proto, že ho chce zabít při hříchu, aby šla jeho duše do pekla. V matčině komnatě Hamlet ostře vyčítá Gertrudě její zradu. Když uslyší šramot za gobelínem, v domnění, že je to král, tne mečem a zabije skrytého Polonia.`,
          summaryEn: `Claudius and Polonius eavesdrop as Hamlet deliberates mortality, suicide, and dread of the unknown afterlife ("To be, or not to be, that is the question"). Confronted by Ophelia, Hamlet violently disavows his affection, hurling cynical denunciations of marriage ("Get thee to a nunnery"). At the court performance, the enacted poisoning strikes Claudius's conscience; the King leaps up in panic crying "Give me some light!" Hamlet finds Claudius attempting to pray, but refuses to strike him while confessing, wishing him damned in sin. In Gertrude's closet, Hamlet confronts his mother over her betrayal. Hearing a rustle behind the tapestry and suspecting Claudius, Hamlet thrusts his rapier through the arras, killing the concealed Polonius.`,
          vocabulary: [
            { en: 'to be or not to be', cz: 'být či nebýt (nejslavnější monolog)' },
            { en: 'get thee to a nunnery', cz: 'jdi do kláštera (vypuzení Ofélie)' },
            { en: 'give me some light', cz: 'dejte mi světlo (Claudiův útěk ze sálu)' },
            { en: 'prayer and repentance', cz: 'modlitba a pokání bez lítosti' },
            { en: 'closet scene', cz: 'scéna v matčině komnatě' },
            { en: 'behind the arras', cz: 'za gobelínem / závěsem (vražda Polonia)' }
          ]
        },
        {
          id: 'hamlet-cp-4',
          startTime: 6350,
          time: 8040, // 2:14:00
          title: '4. Dějství: Vyhnanství, Oféliino šílenství a Laertova pomsta',
          summaryCz: `Claudius posílá Hamleta lodí do Anglie s tajnými zapečetěnými dopisy přikazujícími princovu okamžitou popravu. Hamlet však na lodi dopisy vymění za příkaz k popravě doručitelů Rosencrantze a Guildensterna a díky útoku pirátů uniká zpět do Dánska. Na Elsinoru mezitím ze žalu nad otcovou smrtí a Hamletovým odmítnutím propadá Ofélie naprostému šílenství; bloudí po hradě, zpívá tklivé písně a rozdává květiny. Ze zahraničí se v čele vzbouřeného davu vrací její bratr Laertes a žádá krev. Claudius obratně přesměruje Laertův hněv na Hamleta a navrhne zdánlivě přátelský šermířský souboj s naostřeným kordem potřeným jedem. Na závěr přichází královna Gertruda se zdrcující zprávou: ubohá Ofélie spadla do potoka a utopila se pod tíhou svých šatů.`,
          summaryEn: `Claudius dispatches Hamlet to England with secret sealed letters instructing the English king to execute him immediately upon arrival. At sea, Hamlet discovers the treachery, rewrites the royal warrant to condemn Rosencrantz and Guildenstern instead, and escapes aboard a pirate ship back to Denmark. At Elsinore, grief drives Ophelia into poignant madness; she wanders the halls distributing symbolic herbs and wildflowers while singing haunting ballads. Laertes storms the palace at the head of a rebellion demanding vengeance for Polonius. Claudius manipulates Laertes' grief into a plot: a fencing match where Laertes will wield an unbated foil tipped with lethal poison. Queen Gertrude enters with heartrending news: Ophelia has drowned in a willow brook, pulled under by the weight of her water-soaked garments.`,
          vocabulary: [
            { en: 'sealed mandate', cz: 'zapečetěný rozkaz k popravě' },
            { en: 'Ophelia\'s madness / flowers', cz: 'Oféliino šílenství / byliny a květy (rozmarýn, macešky)' },
            { en: 'rebellion / vengeance', cz: 'vzpoura lidu / krevní msta' },
            { en: 'unbated and envenomed foil', cz: 'naostřený kord potřený jedem' },
            { en: 'poisoned chalice', cz: 'otrávená číše vína' },
            { en: 'drowning in the brook', cz: 'utonutí v potoce u vrby' }
          ]
        },
        {
          id: 'hamlet-cp-5',
          startTime: 8040,
          time: 9380, // 2:36:20
          title: '5. Dějství: Hrobaři, otrávený kord a tragický souboj („Ostatní je ticho“)',
          summaryCz: `Na hřbitově dva hrobaři filozofují nad hrobem pro sebevražedkyni. Hamlet rozmlouvá s lebkou někdejšího dvorního šaška Yoricka („Běda, chudák Yorick! Znal jsem ho, Horatio...“). Pohřební průvod s Oféliiným tělem přeruší rvačka mezi Hamletem a Laertem v hrobě. Na hradě dochází k osudnému souboji. Claudius připraví pro Hamleta pohár otráveného vína, z něhož se však nevědomky napije královna Gertruda a umírá. Laertes zraní Hamleta otráveným hrotem, ale v zápalu boje si kordy vymění a Hamlet zraní Laerta jeho vlastní zbraní. Umírající Laertes odhalí králův komplot. Hamlet probodne Claudia otráveným mečem a donutí ho vypít zbytek jedu. V náručí Horatia Hamlet pronáší svá poslední slova: „Ostatní je ticho.“ Přichází norský princ Fortinbras a nařizuje královský pohřeb s vojenskými poctami pro padlého Hamleta.`,
          summaryEn: `In a churchyard, two gravediggers banter while digging Ophelia's grave. Hamlet reflects on human mortality over the skull of the court jester ("Alas, poor Yorick! I knew him, Horatio: a fellow of infinite jest"). Ophelia's funeral procession arrives, sparking a violent brawl between Hamlet and Laertes in the open grave. At court, the rigged duel commences. Queen Gertrude unwittingly drinks from the poisoned cup prepared for Hamlet by Claudius and collapses dead. Laertes wounds Hamlet with the envenomed blade, but during a scuffle they exchange weapons and Hamlet wounds Laertes with his own poison. In dying agony, Laertes confesses the King's treason. Hamlet stabs Claudius and forces the rest of the poisoned wine down his throat. Dying, Hamlet prevents Horatio's suicide and whispers his final words: "The rest is silence." Fortinbras enters and orders royal military honors for Hamlet's funeral.`,
          vocabulary: [
            { en: 'alas, poor Yorick', cz: 'běda, chudák Yorick (monolog nad lebkou)' },
            { en: 'gravedigger scene', cz: 'scéna hrobařů na hřbitově' },
            { en: 'fencing match / exchanged weapons', cz: 'šermířský duel / vyměněné zbraně' },
            { en: 'the rest is silence', cz: 'ostatní je ticho (Hamletova poslední slova)' },
            { en: 'flight of angels', cz: 'chór andělů („kéž tě doprovodí k odpočinku“)' },
            { en: 'funeral rites / military honors', cz: 'vojenské pocty a královský pohřeb' }
          ]
        }
      ]
    },

    '__default__': {
      title: 'Our Town',
      subtitlesUrl: 'https://raw.githubusercontent.com/Maaniaaa/ntathome-assistant/main/Our_Town.cs.vtt',
      checkpoints: []
    }
  };

  /* ==========================================================================
     2. STAV A PERZISTENCE
     ========================================================================== */

  const triggeredCheckpoints = new Set();
  let activeVideoElement = null;
  let currentBlobUrl = null;
  let isOverlayOpen = false;
  let isDrawerOpen = false;
  let detectedPlayKey = null;

  // Uložené předvolby
  let czSubtitlesEnabled = localStorage.getItem('nta_subs_enabled') !== '0';
  let checkpointsEnabled = localStorage.getItem('nta_checkpoints_enabled') !== '0'; // Výchozí: Zapnuto
  let targetPlaybackRate = parseFloat(localStorage.getItem('nta_playback_rate') || '1.0');
  let currentSubtitleSize = localStorage.getItem('nta_sub_size') || '1.55rem'; // Výchozí: Velké (~25px)
  let activeSummaryLang = localStorage.getItem('nta_summary_lang') || 'cz';

  /* ==========================================================================
     3. VÝBĚR KONFIGURACE
     ========================================================================== */

  function getCurrentConfig() {
    if (detectedPlayKey && PLAYS_CONFIG[detectedPlayKey]) {
      return PLAYS_CONFIG[detectedPlayKey];
    }

    const combinedUrl = [
      window.location.href,
      document.referrer || '',
      document.title || ''
    ].join(' ').toLowerCase();

    if (combinedUrl.includes('antigone')) {
      return PLAYS_CONFIG['antigone'];
    }

    if (combinedUrl.includes('macbeth')) {
      return PLAYS_CONFIG['macbeth'];
    }

    if (combinedUrl.includes('all-my-sons') || combinedUrl.includes('all_my_sons') || combinedUrl.includes('all my sons')) {
      return PLAYS_CONFIG['all-my-sons'];
    }

    if (combinedUrl.includes('hamlet')) {
      return PLAYS_CONFIG['hamlet'];
    }

    if (combinedUrl.includes('seagull')) {
      return PLAYS_CONFIG['the-seagull'];
    }

    if (combinedUrl.includes('our-town') || combinedUrl.includes('our_town') || combinedUrl.includes('our town')) {
      return PLAYS_CONFIG['our-town'];
    }

    if (combinedUrl.includes('earnest') || combinedUrl.includes('importance-of-being-earnest')) {
      return PLAYS_CONFIG['the-importance-of-being-earnest'];
    }

    if (combinedUrl.includes('fifth-step') || combinedUrl.includes('the-fifth-step')) {
      return PLAYS_CONFIG['the-fifth-step'];
    }

    return PLAYS_CONFIG['the-seagull'] || PLAYS_CONFIG['our-town'];
  }

  function getPlayKey(cfg) {
    if (!cfg || !cfg.title) return 'the-seagull';
    if (cfg.title.includes('Antigone')) return 'antigone';
    if (cfg.title.includes('Macbeth')) return 'macbeth';
    if (cfg.title.includes('All My Sons')) return 'all-my-sons';
    if (cfg.title.includes('Hamlet')) return 'hamlet';
    if (cfg.title.includes('Seagull')) return 'the-seagull';
    if (cfg.title.includes('Our Town')) return 'our-town';
    if (cfg.title.includes('Earnest')) return 'the-importance-of-being-earnest';
    return 'the-fifth-step';
  }

  /* ==========================================================================
     4. MEZIRÁMCOVÁ KOMUNIKACE (POSTMESSAGE)
     ========================================================================== */

  function broadcastToFrames(msg) {
    const iframes = document.querySelectorAll('iframe');
    for (const f of iframes) {
      try {
        if (f.contentWindow) {
          f.contentWindow.postMessage(msg, '*');
        }
      } catch (e) {}
    }
  }

  /* ==========================================================================
     5. STYLY (TITULKY VÝŠE, NASTAVITELNÁ VELIKOST, DARK MODE)
     ========================================================================== */

  const STYLE_ID = 'nta-assistant-styles';

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = `
      /* =========================================================
         POSUNUTÍ TITULKŮ VÝŠE & ZÁKLADNÍ DESIGN
         ========================================================= */
      video::-webkit-media-text-track-display {
        transform: translateY(-38px) !important; /* Posun o 38px výše nad lištu */
      }
      ::cue {
        background-color: rgba(15, 23, 42, 0.92) !important;
        color: #f8fafc !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.95) !important;
        line-height: 1.45 !important;
        padding: 6px 16px !important;
        border-radius: 8px !important;
      }

      /* Úplné skrytí titulků při vypnutí */
      .nta-hide-subs ::cue,
      .nta-hide-subs video::cue,
      .nta-hide-subs video::-webkit-media-text-track-display,
      .nta-hide-subs video::-webkit-media-text-track-container {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
        height: 0 !important;
        font-size: 0 !important;
      }

      /* =========================================================
         PLOVOUCÍ OVLÁDACÍ PANEL
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

      .nta-drawer {
        position: absolute;
        bottom: 52px;
        right: 0;
        width: 350px;
        max-height: min(85vh, 680px);
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 16px;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.85);
        padding: 16px;
        display: none;
        flex-direction: column;
        gap: 12px;
        overflow-y: auto;
        z-index: 2147483647;
      }
      .nta-drawer::-webkit-scrollbar {
        width: 6px;
      }
      .nta-drawer::-webkit-scrollbar-track {
        background: rgba(15, 23, 42, 0.6);
      }
      .nta-drawer::-webkit-scrollbar-thumb {
        background: #334155;
        border-radius: 3px;
      }
      .nta-drawer::-webkit-scrollbar-thumb:hover {
        background: #475569;
      }
      .nta-drawer.nta-open {
        display: flex;
        animation: ntaDrawerIn 0.2s ease forwards;
      }
      @keyframes ntaDrawerIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .nta-plays-list {
        display: flex;
        flex-direction: column;
        gap: 7px;
        max-height: 250px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .nta-plays-list::-webkit-scrollbar {
        width: 5px;
      }
      .nta-plays-list::-webkit-scrollbar-thumb {
        background: #475569;
        border-radius: 3px;
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

      .nta-control-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #1e293b;
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 13px;
      }
      .nta-btn-toggle {
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 5px 14px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .nta-btn-toggle.nta-off {
        background: #475569;
        color: #cbd5e1;
      }

      .nta-btn-group {
        display: flex;
        gap: 4px;
      }
      .nta-group-btn {
        background: #334155;
        color: #e2e8f0;
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
        font-weight: 600;
      }
      .nta-group-btn.nta-active {
        background: #38bdf8;
        color: #0f172a;
        font-weight: 800;
      }

      .nta-play-item {
        background: #1e293b;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 9px 12px;
        display: flex;
        flex-direction: column;
        gap: 3px;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
      }
      .nta-play-item:hover {
        border-color: #38bdf8;
        background: #273549;
        transform: translateX(2px);
      }
      .nta-play-item-active {
        border-color: #38bdf8 !important;
        background: rgba(56, 189, 248, 0.12) !important;
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
      .nta-play-item-badge.nta-badge-active {
        background: rgba(56, 189, 248, 0.25);
        color: #7dd3fc;
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
    applySubtitleSizeStyles(currentSubtitleSize);
  }

  function applySubtitleSizeStyles(size) {
    let sizeStyle = document.getElementById('nta-dynamic-cue-size');
    if (!sizeStyle) {
      sizeStyle = document.createElement('style');
      sizeStyle.id = 'nta-dynamic-cue-size';
      (document.head || document.documentElement).appendChild(sizeStyle);
    }
    sizeStyle.textContent = `
      ::cue, video::cue {
        font-size: ${size} !important;
      }
    `;
  }

  /* ==========================================================================
     6. OVLÁDÁNÍ TITULKŮ, VELIKOSTI A RYCHLOSTI VIDEA
     ========================================================================== */

  function applySubtitlesVisibility() {
    injectStyles();

    if (czSubtitlesEnabled) {
      document.documentElement.classList.remove('nta-hide-subs');
      if (document.body) document.body.classList.remove('nta-hide-subs');
    } else {
      document.documentElement.classList.add('nta-hide-subs');
      if (document.body) document.body.classList.add('nta-hide-subs');
    }

    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
      if (v.textTracks) {
        let czTrackActivated = false;
        for (let i = 0; i < v.textTracks.length; i++) {
          const t = v.textTracks[i];
          if (t.language === 'cs' || (t.label && t.label.includes('Čeština'))) {
            // Striktně pouze JEDEN český track smí být aktivní (showing), ostatní duplikáty natvrdo vypneme
            if (czSubtitlesEnabled && !czTrackActivated) {
              t.mode = 'showing';
              czTrackActivated = true;
            } else {
              t.mode = 'disabled';
            }
          }
        }
      }
    });
  }

  function toggleSubtitles() {
    czSubtitlesEnabled = !czSubtitlesEnabled;
    localStorage.setItem('nta_subs_enabled', czSubtitlesEnabled ? '1' : '0');

    applySubtitlesVisibility();
    broadcastToFrames({ type: 'NTA_SET_SUBTITLES', enabled: czSubtitlesEnabled });
    updateDrawerUI();
  }

  function toggleCheckpoints() {
    checkpointsEnabled = !checkpointsEnabled;
    localStorage.setItem('nta_checkpoints_enabled', checkpointsEnabled ? '1' : '0');

    broadcastToFrames({ type: 'NTA_SET_CHECKPOINTS', enabled: checkpointsEnabled });
    updateDrawerUI();
  }

  function setSubtitleSize(size) {
    currentSubtitleSize = size;
    localStorage.setItem('nta_sub_size', size);

    applySubtitleSizeStyles(size);
    broadcastToFrames({ type: 'NTA_SET_SUBTITLE_SIZE', size: size });
    updateDrawerUI();
  }

  function applyRateToAllVideos(rate) {
    const videos = document.querySelectorAll('video');
    videos.forEach(v => {
      v.playbackRate = rate;
      v.defaultPlaybackRate = rate;
    });
  }

  function setPlaybackRate(rate) {
    targetPlaybackRate = rate;
    localStorage.setItem('nta_playback_rate', rate.toString());

    applyRateToAllVideos(rate);
    broadcastToFrames({ type: 'NTA_SET_PLAYBACK_RATE', rate: rate });
    updateDrawerUI();
  }

  /* ==========================================================================
     7. INJEKCE WEBVTT TITULKŮ DO PŘEHRÁVAČE
     ========================================================================== */

  let isInjectingSubtitles = false;

  async function injectSubtitlesTrack(video, subtitlesUrl) {
    if (!video || !subtitlesUrl) return;

    // Pokud už přesně tento track v DOM existuje, jen zkontrolujeme zobrazení
    if (video.dataset.ntaSubsUrl === subtitlesUrl && video.querySelector('track[data-nta-subs="true"]')) {
      applySubtitlesVisibility();
      return;
    }

    if (isInjectingSubtitles) return;
    isInjectingSubtitles = true;
    video.dataset.ntaSubsUrl = subtitlesUrl;

    try {
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

      // Odstranit VŠECHNY stávající track elementy asistenta, aby nevznikaly duplikáty
      const existingTracks = video.querySelectorAll('track[data-nta-subs="true"]');
      existingTracks.forEach(t => t.remove());

      // Vypnout všechny stávající české textTracks
      if (video.textTracks) {
        for (let i = 0; i < video.textTracks.length; i++) {
          const t = video.textTracks[i];
          if (t.language === 'cs' || (t.label && t.label.includes('Čeština'))) {
            t.mode = 'disabled';
          }
        }
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
      applySubtitlesVisibility();
    } finally {
      isInjectingSubtitles = false;
    }
  }

  /* ==========================================================================
     8. PŘEKRYVNÉ ROZHRANÍ (OVERLAY UI)
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

    const tabCz = overlayContainer.querySelector('#nta-tab-cz');
    const tabEn = overlayContainer.querySelector('#nta-tab-en');

    tabCz.addEventListener('click', () => switchSummaryLang('cz'));
    tabEn.addEventListener('click', () => switchSummaryLang('en'));

    overlayContainer.querySelector('#nta-btn-copy-anki').addEventListener('click', (e) => {
      if (!currentActiveCheckpoint || !currentActiveCheckpoint.vocabulary) return;
      const tsv = currentActiveCheckpoint.vocabulary.map(v => `${v.en}\t${v.cz}`).join('\n');
      navigator.clipboard.writeText(tsv).then(() => {
        e.target.textContent = '✓ Zkopírováno!';
        setTimeout(() => e.target.textContent = '📋 Zkopírovat (pro Anki)', 2000);
      });
    });

    overlayContainer.querySelector('#nta-btn-replay').addEventListener('click', () => {
      if (!currentActiveCheckpoint) return;
      const replayTime = currentActiveCheckpoint.startTime || 0;
      if (currentActiveCheckpoint.id) {
        triggeredCheckpoints.delete(currentActiveCheckpoint.id);
      }

      if (activeVideoElement) {
        activeVideoElement.currentTime = replayTime;
        activeVideoElement.play().catch(() => {});
      }

      broadcastToFrames({
        type: 'NTA_REPLAY_SECTION',
        startTime: replayTime,
        checkpointId: currentActiveCheckpoint.id
      });

      resumePlayback();
    });

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
    if (overlayContainer) {
      overlayContainer.classList.remove('nta-visible');
    }
    isOverlayOpen = false;

    if (activeVideoElement && typeof activeVideoElement.play === 'function') {
      activeVideoElement.play().catch(() => {});
    }

    broadcastToFrames({ type: 'NTA_RESUME_PLAYBACK' });
  }

  /* ==========================================================================
     9. SLEDOVÁNÍ ČASU A KONTROLNÍCH BODŮ
     ========================================================================= */

  function handleTimeUpdate(video, config) {
    if (!checkpointsEnabled || !config || !Array.isArray(config.checkpoints) || isOverlayOpen) return;

    const currentTime = video.currentTime;

    for (const cp of config.checkpoints) {
      const checkpointKey = cp.id || `cp-${cp.time}`;
      if (triggeredCheckpoints.has(checkpointKey)) continue;

      const isWithinTolerance = Math.abs(currentTime - cp.time) <= 1.0;
      const isJustPassed = currentTime >= cp.time && currentTime <= cp.time + 1.5;

      if (isWithinTolerance || isJustPassed) {
        triggeredCheckpoints.add(checkpointKey);
        video.pause();

        if (window.self !== window.top) {
          try {
            window.top.postMessage({ type: 'NTA_SHOW_OVERLAY', checkpoint: cp }, '*');
          } catch (e) {}
        }

        showOverlay(cp, video);
        break;
      }
    }
  }

  /* ==========================================================================
     10. OVLÁDACÍ PANEL V HLAVNÍM OKNĚ
     ========================================================================== */

  let floatingWidgetEl = null;

  function renderFloatingWidget(config) {
    if (window.self !== window.top) return;
    if (document.getElementById('nta-floating-widget')) return;

    injectStyles();

    floatingWidgetEl = document.createElement('div');
    floatingWidgetEl.id = 'nta-floating-widget';

    const currentPlayKey = getPlayKey(config);
    const playsListHtml = AVAILABLE_PLAYS.map(p => {
      const isCurrent = p.key === currentPlayKey;
      return `
        <a class="nta-play-item ${isCurrent ? 'nta-play-item-active' : ''}" href="${p.url}" target="_top" title="Kliknutím přejdete na hru: ${p.title}">
          <div class="nta-play-item-title">
            <span>${p.title} ${isCurrent ? '★' : ''}</span>
            <span class="nta-play-item-badge ${isCurrent ? 'nta-badge-active' : ''}">${isCurrent ? 'Právě hraje' : p.badge}</span>
          </div>
          <div class="nta-play-item-cast">${p.cast} • ${p.author}</div>
        </a>
      `;
    }).join('');

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

        <!-- Výuková okna (pauzy) přepínač -->
        <div class="nta-control-row">
          <span>Výuková okna (pauzy):</span>
          <button type="button" class="nta-btn-toggle" id="nta-btn-toggle-checkpoints">
            ${checkpointsEnabled ? 'Zapnuto ✓' : 'Vypnuto ✕'}
          </button>
        </div>

        <!-- Velikost titulků -->
        <div class="nta-control-row">
          <span>Velikost titulků:</span>
          <div class="nta-btn-group" id="nta-size-btns">
            <button type="button" class="nta-group-btn" data-size="1.25rem">Střední</button>
            <button type="button" class="nta-group-btn nta-active" data-size="1.55rem">Velké ★</button>
            <button type="button" class="nta-group-btn" data-size="1.95rem">Extra</button>
          </div>
        </div>

        <!-- Rychlost přehrávání -->
        <div class="nta-control-row">
          <span>Rychlost videa:</span>
          <div class="nta-btn-group" id="nta-speed-btns">
            <button type="button" class="nta-group-btn" data-rate="0.85">0.85×</button>
            <button type="button" class="nta-group-btn" data-rate="0.9">0.9×</button>
            <button type="button" class="nta-group-btn nta-active" data-rate="1">1.0×</button>
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

      <button type="button" class="nta-pill-btn" id="nta-pill-toggle">
        <div class="nta-badge-dot nta-waiting" id="nta-dot"></div>
        <span style="font-weight: 700;">🎭 NT Asistent:</span>
        <span id="nta-pill-text" style="color: #94a3b8;">${config.title}</span>
        <span style="font-size: 11px; opacity: 0.7;">⚙</span>
      </button>
    `;

    document.body.appendChild(floatingWidgetEl);

    const pillBtn = floatingWidgetEl.querySelector('#nta-pill-toggle');
    const drawer = floatingWidgetEl.querySelector('#nta-drawer');
    const closeBtn = floatingWidgetEl.querySelector('#nta-btn-drawer-close');

    pillBtn.addEventListener('click', () => {
      isDrawerOpen = !isDrawerOpen;
      drawer.classList.toggle('nta-open', isDrawerOpen);
    });

    closeBtn.addEventListener('click', () => {
      isDrawerOpen = false;
      drawer.classList.remove('nta-open');
    });

    floatingWidgetEl.querySelector('#nta-btn-toggle-subs').addEventListener('click', toggleSubtitles);
    floatingWidgetEl.querySelector('#nta-btn-toggle-checkpoints').addEventListener('click', toggleCheckpoints);

    // Přímé prokliknutí na hry v katalogu
    floatingWidgetEl.querySelectorAll('.nta-play-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        if (href) {
          e.preventDefault();
          window.top.location.href = href;
        }
      });
    });

    floatingWidgetEl.querySelectorAll('#nta-size-btns .nta-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const size = btn.getAttribute('data-size');
        setSubtitleSize(size);
      });
    });

    floatingWidgetEl.querySelectorAll('#nta-speed-btns .nta-group-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rate = parseFloat(btn.getAttribute('data-rate'));
        setPlaybackRate(rate);
      });
    });

    updateDrawerUI();
  }

  function updateDrawerUI() {
    if (!floatingWidgetEl) return;

    // Titulky
    const subsBtn = floatingWidgetEl.querySelector('#nta-btn-toggle-subs');
    if (subsBtn) {
      subsBtn.textContent = czSubtitlesEnabled ? 'Zapnuto ✓' : 'Vypnuto ✕';
      subsBtn.classList.toggle('nta-off', !czSubtitlesEnabled);
    }

    // Výuková okna
    const cpBtn = floatingWidgetEl.querySelector('#nta-btn-toggle-checkpoints');
    if (cpBtn) {
      cpBtn.textContent = checkpointsEnabled ? 'Zapnuto ✓' : 'Vypnuto ✕';
      cpBtn.classList.toggle('nta-off', !checkpointsEnabled);
    }

    // Velikost
    floatingWidgetEl.querySelectorAll('#nta-size-btns .nta-group-btn').forEach(btn => {
      const size = btn.getAttribute('data-size');
      btn.classList.toggle('nta-active', size === currentSubtitleSize);
    });

    // Rychlost
    const currentRate = targetPlaybackRate;
    floatingWidgetEl.querySelectorAll('#nta-speed-btns .nta-group-btn').forEach(btn => {
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
     11. DETEKCE PŘEHRÁVAČE & CENTRÁLNÍ PŘÍJEM ZPRÁV
     ========================================================================== */

  function attachToVideo(video) {
    if (!video || video.dataset.ntaAttached === 'true') return;

    video.dataset.ntaAttached = 'true';
    activeVideoElement = video;

    const config = getCurrentConfig();
    updateStatusPill(true);

    // Trvalé vynucení rychlosti videa
    const enforceSpeed = () => {
      if (targetPlaybackRate !== 1.0 && Math.abs(video.playbackRate - targetPlaybackRate) > 0.02) {
        video.playbackRate = targetPlaybackRate;
        video.defaultPlaybackRate = targetPlaybackRate;
      }
    };

    enforceSpeed();
    video.addEventListener('play', enforceSpeed);
    video.addEventListener('playing', enforceSpeed);
    video.addEventListener('ratechange', enforceSpeed);
    video.addEventListener('loadeddata', enforceSpeed);

    if (window.self !== window.top) {
      try {
        window.top.postMessage({ type: 'NTA_VIDEO_ATTACHED' }, '*');
      } catch (e) {}
    }

    if (config.subtitlesUrl) {
      injectSubtitlesTrack(video, config.subtitlesUrl);
    } else {
      applySubtitlesVisibility();
    }

    video.addEventListener('timeupdate', () => {
      handleTimeUpdate(video, config);
    });
  }

  function checkPlayer() {
    const video = document.querySelector('video');
    if (video) {
      attachToVideo(video);
      // Pokud je nastavena rychlost, zajistíme ji
      if (targetPlaybackRate !== 1.0 && Math.abs(video.playbackRate - targetPlaybackRate) > 0.02) {
        video.playbackRate = targetPlaybackRate;
        video.defaultPlaybackRate = targetPlaybackRate;
      }
    }
  }

  function setupMessageListener() {
    window.addEventListener('message', (ev) => {
      if (!ev.data) return;

      // Titulky
      if (ev.data.type === 'NTA_SET_SUBTITLES') {
        czSubtitlesEnabled = ev.data.enabled;
        applySubtitlesVisibility();
        broadcastToFrames(ev.data);
      }

      // Velikost titulků
      if (ev.data.type === 'NTA_SET_SUBTITLE_SIZE') {
        currentSubtitleSize = ev.data.size;
        applySubtitleSizeStyles(ev.data.size);
        broadcastToFrames(ev.data);
      }

      // Rychlost videa
      if (ev.data.type === 'NTA_SET_PLAYBACK_RATE') {
        targetPlaybackRate = ev.data.rate;
        applyRateToAllVideos(targetPlaybackRate);
        broadcastToFrames(ev.data);
      }

      // Výuková okna (checkpoints)
      if (ev.data.type === 'NTA_SET_CHECKPOINTS') {
        checkpointsEnabled = !!ev.data.enabled;
        broadcastToFrames(ev.data);
      }

      // Opakování sekce
      if (ev.data.type === 'NTA_REPLAY_SECTION') {
        if (ev.data.checkpointId) {
          triggeredCheckpoints.delete(ev.data.checkpointId);
        }
        const v = activeVideoElement || document.querySelector('video');
        if (v) {
          v.currentTime = ev.data.startTime;
          v.play().catch(() => {});
        }
        broadcastToFrames(ev.data);
      }

      // Pokračování
      if (ev.data.type === 'NTA_RESUME_PLAYBACK') {
        if (overlayContainer) {
          overlayContainer.classList.remove('nta-visible');
        }
        isOverlayOpen = false;
        const v = activeVideoElement || document.querySelector('video');
        if (v && typeof v.play === 'function') {
          v.play().catch(() => {});
        }
        broadcastToFrames(ev.data);
      }

      // Zobrazení overlay v hlavním okně vyvolané z iframe
      if (ev.data.type === 'NTA_SHOW_OVERLAY') {
        showOverlay(ev.data.checkpoint, null);
      }

      // Detekce přehrávače
      if (ev.data.type === 'NTA_VIDEO_ATTACHED') {
        updateStatusPill(true);
        if (window.self === window.top) {
          const curConfig = getCurrentConfig();
          const key = getPlayKey(curConfig);
          broadcastToFrames({ type: 'NTA_SET_ACTIVE_PLAY', playKey: key });
          broadcastToFrames({ type: 'NTA_SET_SUBTITLES', enabled: czSubtitlesEnabled });
          broadcastToFrames({ type: 'NTA_SET_CHECKPOINTS', enabled: checkpointsEnabled });
          broadcastToFrames({ type: 'NTA_SET_PLAYBACK_RATE', rate: targetPlaybackRate });
          broadcastToFrames({ type: 'NTA_SET_SUBTITLE_SIZE', size: currentSubtitleSize });
        }
      }

      // Synchronizace vybrané hry do iframů
      if (ev.data.type === 'NTA_SET_ACTIVE_PLAY') {
        if (ev.data.playKey && PLAYS_CONFIG[ev.data.playKey]) {
          if (detectedPlayKey !== ev.data.playKey) {
            detectedPlayKey = ev.data.playKey;
            const cfg = PLAYS_CONFIG[detectedPlayKey];
            const v = activeVideoElement || document.querySelector('video');
            if (v && cfg.subtitlesUrl) {
              injectSubtitlesTrack(v, cfg.subtitlesUrl);
            }
          }
        }
      }
    });
  }

  function startAssistant() {
    injectStyles();
    setupMessageListener();

    const config = getCurrentConfig();
    renderFloatingWidget(config);
    checkPlayer();

    setInterval(checkPlayer, 1000);

    if (window.self === window.top) {
      let lastBroadcastKey = null;
      const broadcastPlayInfo = () => {
        const curConfig = getCurrentConfig();
        const key = getPlayKey(curConfig);
        if (key !== lastBroadcastKey) {
          lastBroadcastKey = key;
          broadcastToFrames({ type: 'NTA_SET_ACTIVE_PLAY', playKey: key });
        }
      };
      broadcastPlayInfo();
      setInterval(broadcastPlayInfo, 2000);
    }

    let lastUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        detectedPlayKey = null;
        triggeredCheckpoints.clear();
        const video = document.querySelector('video');
        if (video) {
          delete video.dataset.ntaAttached;
          delete video.dataset.ntaSubsUrl;
        }
        updateStatusPill(false);
      }
    }, 1500);
  }

  /* ==========================================================================
     12. INICIALIZACE
     ========================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAssistant);
  } else {
    startAssistant();
  }
})();
