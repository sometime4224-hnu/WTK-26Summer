window.C16_COUNTRY_MAP_DATA = {
    schemaVersion: 1,
    countryId: 'syria',
    storageKey: 'korean3bimprove:c16:grammar4:syria-map:v1',
    zoomSteps: [1, 1.35, 1.7, 2.15, 2.6],
    initialState: {
        region: 'capital',
        targetId: 'damascus',
        tagId: 'damascusOldCity',
        zoomIndex: 0
    },
    regions: [
        { id: 'all', label: '전체', icon: 'fa-globe' },
        { id: 'capital', label: '수도권·칼라문', icon: 'fa-mosque' },
        { id: 'south', label: '남부·하우란', icon: 'fa-mountain' },
        { id: 'north', label: '북부·이들립', icon: 'fa-fort-awesome' },
        { id: 'central', label: '중부·시리아 사막', icon: 'fa-landmark' },
        { id: 'coast', label: '지중해 해안·산성', icon: 'fa-water' },
        { id: 'east', label: '유프라테스·북동부', icon: 'fa-route' }
    ],
    targets: [
        {
            id: 'damascus',
            region: 'capital',
            x: 15.5,
            y: 72.9,
            icon: 'fa-mosque',
            name: '다마스쿠스',
            nativeName: 'دمشق · Damascus',
            hint: '고대 도시 · 전통 공예',
            badge: '세계유산 · 위험목록',
            tagIds: [
                'damascusOldCity',
                'umayyadMosque',
                'hamidiyahSouq',
                'damasceneRose',
                'damasceneGlass'
            ]
        },
        {
            id: 'maaloula',
            region: 'capital',
            x: 18.9,
            y: 67.1,
            displayX: 22.5,
            displayY: 63.5,
            labelPlacement: 'top',
            icon: 'fa-mountain',
            name: '말룰라',
            nativeName: 'معلولا · Maaloula',
            hint: '산악 마을 · 언어 전통',
            badge: '세계유산 잠정목록',
            tagIds: [
                'maaloulaMountainVillage',
                'maaloulaNeoAramaic',
                'saintThecla',
                'saintsSergiusBacchus',
                'maaloulaRockLandscape'
            ]
        },
        {
            id: 'bosra',
            region: 'south',
            x: 18.1,
            y: 90.3,
            icon: 'fa-masks-theater',
            name: '보스라',
            nativeName: 'بصرى · Bosra',
            hint: '로마 유적 · 현무암 도시',
            badge: '세계유산 · 위험목록',
            tagIds: [
                'bosraRomanTheatre',
                'bosraBasaltCity',
                'bosraEarlyChristian',
                'bosraHistoricMosques',
                'bosraCaravanTrade'
            ]
        },
        {
            id: 'suwaydaShahba',
            region: 'south',
            x: 19.6,
            y: 85.7,
            icon: 'fa-layer-group',
            name: '수웨이다·샤흐바 권역',
            nativeName: 'السويداء · شهبا · As-Suwayda · Shahba',
            hint: '하우란 · 현무암 문화유산',
            badge: '기타 문화유산',
            tagIds: [
                'jabalDruze',
                'suwaydaBasalt',
                'shahbaRomanCity',
                'shahbaMosaics',
                'hauranLandscape'
            ]
        },
        {
            id: 'aleppo',
            region: 'north',
            x: 26.6,
            y: 25.6,
            icon: 'fa-fort-awesome',
            name: '알레포',
            nativeName: 'حلب · Aleppo',
            hint: '구시가지 · 무형유산',
            badge: '세계유산 · 위험목록',
            tagIds: [
                'aleppoOldCity',
                'aleppoCitadel',
                'aleppoSouq',
                'aleppoLaurelSoap',
                'qududHalabiya'
            ]
        },
        {
            id: 'ancientVillages',
            region: 'north',
            x: 17.2,
            y: 33,
            icon: 'fa-house-chimney',
            name: '시리아 북부 고대 마을',
            nativeName: 'القرى القديمة في شمال سوريا · Ancient Villages of Northern Syria',
            hint: '후기 고대 · 농촌 유산',
            badge: '세계유산 · 위험목록',
            tagIds: [
                'limestoneMassif',
                'lateAntiqueVillages',
                'byzantineChurches',
                'ancientCisterns',
                'ruralLandscape'
            ]
        },
        {
            id: 'ebla',
            region: 'north',
            x: 24.5,
            y: 36,
            icon: 'fa-scroll',
            name: '에블라',
            nativeName: 'إيبلا · تل مرديخ · Ebla · Tell Mardikh',
            hint: '청동기 · 기록문화',
            badge: '세계유산 잠정목록',
            tagIds: [
                'eblaBronzeAgeCity',
                'eblaRoyalPalace',
                'eblaCuneiformTablets',
                'eblaRoyalArchives',
                'eblaLexicalTexts'
            ]
        },
        {
            id: 'hama',
            region: 'central',
            x: 21.5,
            y: 44.4,
            icon: 'fa-water',
            name: '하마',
            nativeName: 'حماة · Hama',
            hint: '수차 · 수리 유산',
            badge: '세계유산 잠정목록',
            tagIds: [
                'hamaOrontes',
                'hamaNorias',
                'hamaHydraulicWorks',
                'hamaUrbanLandscape',
                'hamaIrrigationHeritage'
            ]
        },
        {
            id: 'homs',
            region: 'central',
            x: 21,
            y: 51.5,
            labelPlacement: 'top',
            icon: 'fa-place-of-worship',
            name: '홈스',
            nativeName: 'حمص · Homs',
            hint: '구시가지 · 종교유산',
            badge: '기타 문화유산',
            tagIds: [
                'homsOldCity',
                'khalidMosque',
                'umAlZennar',
                'homsSouq',
                'homsOrontes'
            ]
        },
        {
            id: 'palmyra',
            region: 'central',
            x: 40.5,
            y: 54.7,
            icon: 'fa-landmark',
            name: '팔미라',
            nativeName: 'تدمر · Tadmur · Palmyra',
            hint: '오아시스 · 보존 유산',
            badge: '세계유산 · 위험목록',
            tagIds: [
                'palmyraOasis',
                'palmyraCaravanCity',
                'palmyraColonnade',
                'belTempleRemains',
                'palmyraTowerTombs'
            ]
        },
        {
            id: 'latakiaUgarit',
            region: 'coast',
            x: 9.3,
            y: 36.2,
            displayX: 7.5,
            displayY: 34.5,
            labelPlacement: 'right',
            icon: 'fa-anchor',
            name: '라타키아 권역·우가리트',
            nativeName: 'اللاذقية · أوغاريت · رأس شمرا · Lattakia · Ugarit · Ras Shamra',
            hint: '항구 · 청동기 유적',
            badge: '세계유산 잠정목록',
            tagIds: [
                'latakiaPort',
                'ugaritSite',
                'ugariticAlphabet',
                'ugaritRoyalPalace',
                'ugaritMultilingualTablets'
            ]
        },
        {
            id: 'tartousArwad',
            region: 'coast',
            x: 10.2,
            y: 49.3,
            displayX: 8.0,
            displayY: 48.0,
            labelPlacement: 'right',
            icon: 'fa-ship',
            name: '타르투스 권역·아르와드',
            nativeName: 'طرطوس · أرواد · Tartous · Arwad',
            hint: '해안 · 요새 도시',
            badge: '세계유산 잠정목록',
            tagIds: [
                'tartousCoast',
                'tartousFortifiedCity',
                'arwadIsland',
                'phoenicianMaritime',
                'arwadNaturalHarbour'
            ]
        },
        {
            id: 'cracDesChevaliers',
            region: 'coast',
            x: 15.7,
            y: 51,
            displayX: 17.5,
            displayY: 52.5,
            labelPlacement: 'bottom',
            icon: 'fa-shield-halved',
            name: '크라크 데 슈발리에',
            nativeName: 'قلعة الحصن · Qal’at al-Ḥuṣn · Crac des Chevaliers',
            hint: '중세 성곽 · 보존 유산',
            badge: '세계유산 · 위험목록',
            tagIds: [
                'cracMountainFortress',
                'hospitallerCastle',
                'cracMamluk',
                'cracDoubleWalls',
                'cracDefensiveSetting'
            ]
        },
        {
            id: 'saladinCastle',
            region: 'coast',
            x: 12.7,
            y: 36.3,
            displayX: 15.0,
            displayY: 38.5,
            labelPlacement: 'bottom',
            icon: 'fa-tower-observation',
            name: '살라딘 성채',
            nativeName: 'قلعة صلاح الدين · Qal’at Salah El-Din',
            hint: '중세 성곽 · 보존 유산',
            badge: '세계유산 · 위험목록',
            tagIds: [
                'saladinCastleSite',
                'saladinByzantine',
                'saladinFrankish',
                'saladinAyyubid',
                'saladinRockMoat'
            ]
        },
        {
            id: 'raqqaRafiqa',
            region: 'east',
            x: 49.9,
            y: 30.1,
            icon: 'fa-archway',
            name: '라까·라피카',
            nativeName: 'الرقة · الرافقة · Ar-Raqqah · Raqqa-Rafiqa',
            hint: '아바스 왕조 · 도시 유적',
            badge: '세계유산 잠정목록',
            tagIds: [
                'euphratesRaqqa',
                'abbasidRafiqa',
                'raqqaHorseshoeWalls',
                'baghdadGate',
                'qasrAlBanat'
            ]
        },
        {
            id: 'deirMariDura',
            region: 'east',
            x: 64,
            y: 40.9,
            icon: 'fa-scroll',
            name: '데이르에즈조르 권역·마리·두라에우로포스',
            nativeName: 'دير الزور · ماري · دورا أوروبوس · Deir ez-Zor · Mari · Dura-Europos',
            hint: '유프라테스 · 고대 도시',
            badge: '세계유산 잠정목록',
            tagIds: [
                'euphratesCivilization',
                'mariPalaceArchives',
                'duraMulticultural',
                'euphratesTradeCenter',
                'cuneiformAdministration'
            ]
        },
        {
            id: 'hasakahTellBrak',
            region: 'east',
            x: 75.6,
            y: 17.5,
            icon: 'fa-mountain-sun',
            name: '하사카 권역·텔 브라크',
            nativeName: 'الحسكة · تل براك · Al-Hasakah · Tell Brak',
            hint: '북메소포타미아 · 고대 도시',
            badge: '기타 문화유산',
            tagIds: [
                'northMesopotamianPlain',
                'khaburRiver',
                'tellBrakSite',
                'tellBrakUrbanization',
                'tellBrakSealings'
            ]
        }
    ],
    tags: {
        damascusOldCity: {
            label: '고대 구시가지',
            mapQuery: 'Ancient City of Damascus Syria',
            imageQuery: 'UNESCO Ancient City of Damascus old city cultural heritage Syria'
        },
        umayyadMosque: {
            label: '우마이야 모스크',
            mapQuery: 'Umayyad Mosque Damascus Syria',
            imageQuery: 'UNESCO Umayyad Mosque Damascus cultural heritage'
        },
        hamidiyahSouq: {
            label: '수크 알하미디야',
            mapQuery: 'Al-Hamidiyah Souq Damascus Syria',
            imageQuery: 'Al-Hamidiyah Souq Ancient City of Damascus cultural heritage'
        },
        damasceneRose: {
            label: '다마스쿠스 장미',
            imageQuery: 'UNESCO practices associated with the Damascene rose Al-Mrah Syria'
        },
        damasceneGlass: {
            label: '전통 유리 공예',
            imageQuery: 'UNESCO traditional Syrian glassblowing Damascus cultural heritage'
        },
        maaloulaMountainVillage: {
            label: '칼라문 산악 마을',
            mapQuery: 'Maaloula Syria',
            imageQuery: 'UNESCO Tentative List Maaloula Qalamoun mountain village Syria'
        },
        maaloulaNeoAramaic: {
            label: '서부 신아람어 전통',
            imageQuery: 'Maaloula Western Neo-Aramaic language cultural heritage Syria'
        },
        saintThecla: {
            label: '성 테클라 수도원',
            mapQuery: 'Saint Thecla Monastery Maaloula Syria',
            imageQuery: 'Saint Thecla Monastery Maaloula cultural heritage Syria'
        },
        saintsSergiusBacchus: {
            label: '성 세르지오스·바쿠스 수도원',
            mapQuery: 'Saints Sergius and Bacchus Monastery Maaloula Syria',
            imageQuery: 'Saints Sergius and Bacchus Monastery Maaloula cultural heritage'
        },
        maaloulaRockLandscape: {
            label: '바위 동굴 문화경관',
            mapQuery: 'Maaloula Syria',
            imageQuery: 'UNESCO Maaloula rock caves cultural landscape Syria'
        },
        bosraRomanTheatre: {
            label: '로마 극장',
            mapQuery: 'Roman Theatre at Bosra Syria',
            imageQuery: 'UNESCO Ancient City of Bosra Roman Theatre cultural heritage'
        },
        bosraBasaltCity: {
            label: '현무암 고대 도시',
            mapQuery: 'Ancient City of Bosra Syria',
            imageQuery: 'UNESCO Bosra ancient basalt city Syria cultural heritage'
        },
        bosraEarlyChristian: {
            label: '초기 기독교 유적',
            mapQuery: 'Bosra Cathedral ruins Syria',
            imageQuery: 'UNESCO Bosra early Christian ruins cultural heritage Syria'
        },
        bosraHistoricMosques: {
            label: '역사적 모스크',
            mapQuery: 'Al-Omari Mosque Bosra Syria',
            imageQuery: 'UNESCO Bosra historic mosques cultural heritage Syria'
        },
        bosraCaravanTrade: {
            label: '고대 대상 무역',
            imageQuery: 'UNESCO Bosra ancient caravan route trade cultural heritage'
        },
        jabalDruze: {
            label: '자발 알드루즈 산지',
            mapQuery: 'Jabal al-Druze Syria',
            imageQuery: 'Jabal al-Druze As-Suwayda cultural landscape Syria'
        },
        suwaydaBasalt: {
            label: '현무암 지형과 건축',
            mapQuery: 'As-Suwayda Syria',
            imageQuery: 'As-Suwayda basalt landscape architecture cultural heritage Syria'
        },
        shahbaRomanCity: {
            label: '샤흐바 로마 도시 유적',
            mapQuery: 'Shahba Philippopolis Syria',
            imageQuery: 'Shahba Philippopolis Roman city cultural heritage Syria'
        },
        shahbaMosaics: {
            label: '고대 모자이크',
            mapQuery: 'Shahba Museum Syria',
            imageQuery: 'Shahba Museum Roman mosaics cultural heritage Syria'
        },
        hauranLandscape: {
            label: '하우란 문화경관',
            mapQuery: 'Hauran Syria',
            imageQuery: 'Hauran cultural landscape basalt architecture Syria'
        },
        aleppoOldCity: {
            label: '성벽 안 구시가지',
            mapQuery: 'Ancient City of Aleppo Syria',
            imageQuery: 'UNESCO Ancient City of Aleppo walled old city cultural heritage'
        },
        aleppoCitadel: {
            label: '알레포 성채',
            mapQuery: 'Citadel of Aleppo Syria',
            imageQuery: 'UNESCO Citadel of Aleppo cultural heritage conservation'
        },
        aleppoSouq: {
            label: '전통 수크',
            mapQuery: 'Al-Madina Souq Aleppo Syria',
            imageQuery: 'UNESCO Aleppo traditional souq cultural heritage conservation'
        },
        aleppoLaurelSoap: {
            label: '월계수 비누',
            imageQuery: 'UNESCO craft of traditional Aleppo Ghar soap laurel soap'
        },
        qududHalabiya: {
            label: '알쿠두드 알할라비야 음악',
            imageQuery: 'UNESCO Al-Qudoud al-Halabiya traditional music Aleppo'
        },
        limestoneMassif: {
            label: '석회암 산지',
            mapQuery: 'Limestone Massif Northern Syria',
            imageQuery: 'UNESCO Ancient Villages Northern Syria limestone massif'
        },
        lateAntiqueVillages: {
            label: '후기 고대 마을',
            mapQuery: 'Ancient Villages of Northern Syria',
            imageQuery: 'UNESCO Ancient Villages of Northern Syria late antique villages'
        },
        byzantineChurches: {
            label: '비잔틴 교회 유적',
            mapQuery: 'Ancient Villages of Northern Syria',
            imageQuery: 'UNESCO Ancient Villages Northern Syria Byzantine church ruins'
        },
        ancientCisterns: {
            label: '저수조와 수리 기술',
            mapQuery: 'Ancient Villages of Northern Syria',
            imageQuery: 'UNESCO Ancient Villages Northern Syria cisterns hydraulic heritage'
        },
        ruralLandscape: {
            label: '농촌 문화경관',
            mapQuery: 'Ancient Villages of Northern Syria',
            imageQuery: 'UNESCO Ancient Villages Northern Syria rural cultural landscape'
        },
        eblaBronzeAgeCity: {
            label: '청동기 도시 유적',
            mapQuery: 'Ebla Tell Mardikh Syria',
            imageQuery: 'UNESCO Tentative List Ebla Tell Mardikh Bronze Age city'
        },
        eblaRoyalPalace: {
            label: '왕궁 터',
            mapQuery: 'Royal Palace G Ebla Tell Mardikh Syria',
            imageQuery: 'UNESCO Ebla Royal Palace G archaeological site Syria'
        },
        eblaCuneiformTablets: {
            label: '설형문자 점토판',
            imageQuery: 'UNESCO Ebla cuneiform clay tablets cultural heritage Syria'
        },
        eblaRoyalArchives: {
            label: '왕실 기록보관소',
            imageQuery: 'UNESCO Ebla royal archives Tell Mardikh cultural heritage'
        },
        eblaLexicalTexts: {
            label: '초기 사전 자료',
            imageQuery: 'Ebla lexical texts early dictionaries cuneiform cultural heritage'
        },
        hamaOrontes: {
            label: '오론테스강',
            mapQuery: 'Orontes River Hama Syria',
            imageQuery: 'Orontes River Hama norias cultural landscape Syria'
        },
        hamaNorias: {
            label: '대형 목제 수차',
            mapQuery: 'Norias of Hama Syria',
            imageQuery: 'UNESCO Tentative List Norias of Hama wooden water wheels'
        },
        hamaHydraulicWorks: {
            label: '중세 수리 시설',
            mapQuery: 'Norias of Hama Syria',
            imageQuery: 'UNESCO Norias of Hama medieval hydraulic system cultural heritage'
        },
        hamaUrbanLandscape: {
            label: '전통 도시 경관',
            mapQuery: 'Old Hama Syria',
            imageQuery: 'Norias of Hama traditional urban landscape cultural heritage'
        },
        hamaIrrigationHeritage: {
            label: '관개 문화유산',
            mapQuery: 'Norias of Hama Syria',
            imageQuery: 'UNESCO Hama norias irrigation cultural heritage Syria'
        },
        homsOldCity: {
            label: '홈스 구시가지',
            mapQuery: 'Old City of Homs Syria',
            imageQuery: 'Old Homs cultural heritage conservation Syria'
        },
        khalidMosque: {
            label: '칼리드 이븐 알왈리드 모스크',
            mapQuery: 'Khalid ibn al-Walid Mosque Homs Syria',
            imageQuery: 'Khalid ibn al-Walid Mosque Homs cultural heritage conservation'
        },
        umAlZennar: {
            label: '성모 허리띠 교회',
            mapQuery: 'Um al-Zennar Church Homs Syria',
            imageQuery: 'Um al-Zennar Church Old Homs cultural heritage conservation'
        },
        homsSouq: {
            label: '전통 시장',
            mapQuery: 'Old Souq Homs Syria',
            imageQuery: 'Old Souq Homs cultural heritage conservation Syria'
        },
        homsOrontes: {
            label: '오론테스강',
            mapQuery: 'Orontes River Homs Syria',
            imageQuery: 'Orontes River Homs cultural landscape Syria'
        },
        palmyraOasis: {
            label: '사막 오아시스',
            mapQuery: 'Palmyra Oasis Tadmur Syria',
            imageQuery: 'UNESCO Palmyra desert oasis cultural landscape Syria'
        },
        palmyraCaravanCity: {
            label: '고대 대상무역 도시',
            mapQuery: 'Ancient City of Palmyra Syria',
            imageQuery: 'UNESCO Palmyra ancient caravan city cultural heritage'
        },
        palmyraColonnade: {
            label: '고대 열주 거리',
            mapQuery: 'Great Colonnade Palmyra Syria',
            imageQuery: 'UNESCO Palmyra Great Colonnade cultural heritage remains'
        },
        belTempleRemains: {
            label: '벨 신전 유구',
            mapQuery: 'Temple of Bel remains Palmyra Syria',
            imageQuery: 'UNESCO Temple of Bel remains Palmyra conservation'
        },
        palmyraTowerTombs: {
            label: '장례탑',
            mapQuery: 'Tower Tombs Palmyra Syria',
            imageQuery: 'UNESCO Palmyra tower tombs funerary monuments cultural heritage'
        },
        latakiaPort: {
            label: '지중해 항구',
            mapQuery: 'Port of Latakia Syria',
            imageQuery: 'Latakia Mediterranean port cultural landscape Syria'
        },
        ugaritSite: {
            label: '우가리트 유적',
            mapQuery: 'Ugarit Ras Shamra Syria',
            imageQuery: 'UNESCO Tentative List Ugarit Ras Shamra archaeological site'
        },
        ugariticAlphabet: {
            label: '30자 설형문자 알파벳',
            imageQuery: 'UNESCO Ugarit 30 sign cuneiform alphabet tablet'
        },
        ugaritRoyalPalace: {
            label: '왕궁 터',
            mapQuery: 'Royal Palace of Ugarit Ras Shamra Syria',
            imageQuery: 'UNESCO Ugarit Royal Palace archaeological ruins Syria'
        },
        ugaritMultilingualTablets: {
            label: '다언어 점토판',
            imageQuery: 'UNESCO Ugarit multilingual clay tablets cultural heritage'
        },
        tartousCoast: {
            label: '지중해 해안',
            mapQuery: 'Tartous Syria',
            imageQuery: 'Tartous Mediterranean coast cultural landscape Syria'
        },
        tartousFortifiedCity: {
            label: '타르투스 성채 도시',
            mapQuery: 'Fortified City of Tartus Syria',
            imageQuery: 'UNESCO Tentative List Fortified City of Tartus cultural heritage'
        },
        arwadIsland: {
            label: '아르와드섬',
            mapQuery: 'Arwad Island Syria',
            imageQuery: 'UNESCO Tentative List Arwad Island cultural heritage Syria'
        },
        phoenicianMaritime: {
            label: '페니키아 해양유산',
            imageQuery: 'Arwad Phoenician maritime cultural heritage Syria'
        },
        arwadNaturalHarbour: {
            label: '자연항',
            mapQuery: 'Arwad Island harbour Syria',
            imageQuery: 'UNESCO Arwad Island natural harbour maritime heritage'
        },
        cracMountainFortress: {
            label: '중세 산성',
            mapQuery: 'Crac des Chevaliers Syria',
            imageQuery: 'UNESCO Crac des Chevaliers medieval mountain fortress conservation'
        },
        hospitallerCastle: {
            label: '구호기사단 성곽',
            mapQuery: 'Crac des Chevaliers Syria',
            imageQuery: 'UNESCO Crac des Chevaliers Hospitaller castle architecture'
        },
        cracMamluk: {
            label: '맘루크 시대 증축',
            mapQuery: 'Crac des Chevaliers Syria',
            imageQuery: 'UNESCO Crac des Chevaliers Mamluk additions cultural heritage'
        },
        cracDoubleWalls: {
            label: '이중 방어벽',
            mapQuery: 'Crac des Chevaliers Syria',
            imageQuery: 'UNESCO Crac des Chevaliers double defensive walls'
        },
        cracDefensiveSetting: {
            label: '산악 방어 입지',
            mapQuery: 'Crac des Chevaliers Syria',
            imageQuery: 'UNESCO Crac des Chevaliers mountain defensive setting'
        },
        saladinCastleSite: {
            label: '암반 위 중세 요새',
            mapQuery: 'Qal’at Salah El-Din Syria',
            imageQuery: 'UNESCO Qal’at Salah El-Din rock-top medieval fortress cultural heritage'
        },
        saladinByzantine: {
            label: '비잔틴 석조 유구',
            mapQuery: 'Qal’at Salah El-Din Syria',
            imageQuery: 'UNESCO Qal’at Salah El-Din Byzantine remains'
        },
        saladinFrankish: {
            label: '프랑크식 요새화',
            mapQuery: 'Qal’at Salah El-Din Syria',
            imageQuery: 'UNESCO Qal’at Salah El-Din Frankish fortifications'
        },
        saladinAyyubid: {
            label: '아이유브 방어시설',
            mapQuery: 'Qal’at Salah El-Din Syria',
            imageQuery: 'UNESCO Qal’at Salah El-Din Ayyubid defensive architecture'
        },
        saladinRockMoat: {
            label: '암반 해자',
            mapQuery: 'Qal’at Salah El-Din Syria',
            imageQuery: 'UNESCO Qal’at Salah El-Din rock cut moat'
        },
        euphratesRaqqa: {
            label: '유프라테스강',
            mapQuery: 'Euphrates River Raqqa Syria',
            imageQuery: 'Euphrates River Raqqa cultural landscape Syria'
        },
        abbasidRafiqa: {
            label: '아바스 왕조 도시',
            mapQuery: 'Raqqa Rafiqa Abbasid city Syria',
            imageQuery: 'UNESCO Tentative List Raqqa Rafiqa Abbasid city cultural heritage'
        },
        raqqaHorseshoeWalls: {
            label: '말굽형 성벽',
            mapQuery: 'Rafiqa city walls Raqqa Syria',
            imageQuery: 'UNESCO Raqqa Rafiqa horseshoe city walls cultural heritage'
        },
        baghdadGate: {
            label: '바그다드 문',
            mapQuery: 'Baghdad Gate Raqqa Syria',
            imageQuery: 'UNESCO Baghdad Gate Raqqa Rafiqa cultural heritage'
        },
        qasrAlBanat: {
            label: '카스르 알바나트',
            mapQuery: 'Qasr al-Banat Raqqa Syria',
            imageQuery: 'UNESCO Qasr al-Banat Raqqa cultural heritage remains'
        },
        euphratesCivilization: {
            label: '유프라테스 문명',
            imageQuery: 'UNESCO Mari Dura-Europos Euphrates civilization cultural heritage'
        },
        mariPalaceArchives: {
            label: '마리 왕궁과 기록문서',
            mapQuery: 'Royal Palace of Mari Tell Hariri Syria',
            imageQuery: 'UNESCO Mari Royal Palace archives Tell Hariri cultural heritage'
        },
        duraMulticultural: {
            label: '두라에우로포스 다문화 유적',
            mapQuery: 'Dura-Europos Syria',
            imageQuery: 'UNESCO Dura-Europos multicultural archaeological site Syria'
        },
        euphratesTradeCenter: {
            label: '고대 교역 중심지',
            imageQuery: 'UNESCO Mari Dura-Europos ancient trade routes Euphrates'
        },
        cuneiformAdministration: {
            label: '설형문자 행정 기록',
            imageQuery: 'UNESCO Mari cuneiform administrative records cultural heritage'
        },
        northMesopotamianPlain: {
            label: '북메소포타미아 평원',
            mapQuery: 'Al-Jazira region Syria',
            imageQuery: 'Northern Mesopotamian plain Al-Hasakah cultural landscape Syria'
        },
        khaburRiver: {
            label: '하부르강',
            mapQuery: 'Khabur River Al-Hasakah Syria',
            imageQuery: 'Khabur River Al-Hasakah cultural landscape Syria'
        },
        tellBrakSite: {
            label: '텔 브라크 유적',
            mapQuery: 'Tell Brak Syria',
            imageQuery: 'Tell Brak archaeological site Syria cultural heritage'
        },
        tellBrakUrbanization: {
            label: '초기 도시화',
            imageQuery: 'Tell Brak early urbanization Northern Mesopotamia'
        },
        tellBrakSealings: {
            label: '점토 봉인 유물',
            imageQuery: 'Tell Brak clay sealings archaeological heritage'
        }
    }
};
