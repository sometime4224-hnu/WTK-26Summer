window.C16_COUNTRY_MAP_DATA = Object.freeze({
    schemaVersion: 1,
    countryId: 'kazakhstan',
    storageKey: 'korean3bimprove:c16:grammar4-kazakhstan-map:v1',
    zoomSteps: [1, 1.35, 1.7, 2.15, 2.6],
    initialState: {
        region: 'capital-north',
        targetId: 'astana',
        tagId: 'astana-baiterek',
        zoomIndex: 0
    },
    regions: [
        { id: 'all', label: '전체', icon: 'fa-earth-asia' },
        { id: 'capital-north', label: '수도·북부', icon: 'fa-landmark' },
        { id: 'almaty-southeast', label: '알마티·남동부', icon: 'fa-mountain-sun' },
        { id: 'south-silk-road', label: '남부·실크로드', icon: 'fa-route' },
        { id: 'central-east', label: '중앙·동부', icon: 'fa-mountain' },
        { id: 'west-caspian', label: '서부·카스피', icon: 'fa-water' },
        { id: 'southwest-space', label: '남서부·우주', icon: 'fa-shuttle-space' }
    ],
    targets: [
        {
            id: 'astana',
            region: 'capital-north',
            x: 60.2,
            y: 32.1,
            icon: 'fa-city',
            name: '아스타나',
            nativeName: 'Астана · Astana',
            hint: '수도 · 현대 건축',
            tagIds: [
                'astana-baiterek',
                'astana-khan-shatyr',
                'astana-national-museum',
                'astana-nur-alem',
                'astana-futuristic-architecture'
            ]
        },
        {
            id: 'burabay',
            region: 'capital-north',
            x: 57.6,
            y: 21.3,
            displayX: 56.5,
            displayY: 16.0,
            icon: 'fa-tree',
            name: '부라바이',
            nativeName: 'Бурабай · Burabay (Borovoe)',
            hint: '호수 · 침엽수 숲',
            tagIds: [
                'burabay-lake',
                'burabay-zhumbaktas',
                'burabay-okzhetpes',
                'burabay-bolektau',
                'burabay-coniferous-forest'
            ]
        },
        {
            id: 'korgalzhyn',
            region: 'capital-north',
            x: 54.9,
            y: 35.4,
            icon: 'fa-dove',
            name: '코르갈진',
            nativeName: 'Қорғалжын · Korgalzhyn (Korgaljyn)',
            hint: '습지 · 철새',
            tagIds: [
                'korgalzhyn-reserve',
                'korgalzhyn-lake-tengiz',
                'korgalzhyn-pink-flamingos',
                'korgalzhyn-migratory-birds',
                'korgalzhyn-saryarka'
            ]
        },
        {
            id: 'almaty',
            region: 'almaty-southeast',
            x: 72.6,
            y: 76.9,
            displayX: 68.0,
            displayY: 80.0,
            icon: 'fa-city',
            name: '알마티',
            nativeName: 'Алматы · Almaty',
            hint: '산악 도시 · 문화',
            tagIds: [
                'almaty-medeu',
                'almaty-shymbulak',
                'almaty-kok-tobe',
                'almaty-ascension-cathedral',
                'almaty-green-bazaar'
            ]
        },
        {
            id: 'charyn-canyon',
            region: 'almaty-southeast',
            x: 77.4,
            y: 76.3,
            displayX: 82.0,
            displayY: 76.0,
            icon: 'fa-mountain-sun',
            name: '차른 협곡',
            nativeName: 'Шарын шатқалы · Charyn Canyon',
            hint: '협곡 · 붉은 절벽',
            tagIds: [
                'charyn-valley-of-castles',
                'charyn-red-cliffs',
                'charyn-river',
                'charyn-ash-grove',
                'charyn-trekking'
            ]
        },
        {
            id: 'kolsai-lakes',
            region: 'almaty-southeast',
            x: 75.7,
            y: 78.6,
            displayX: 76.5,
            displayY: 85.5,
            icon: 'fa-water',
            name: '콜사이호 국립공원',
            nativeName: 'Көлсай көлдері · Kolsai Lakes National Park',
            hint: '고산 호수 · 수몰나무',
            tagIds: [
                'kolsai-lakes',
                'kolsai-lake-kaindy',
                'kolsai-submerged-trees',
                'kolsai-spruce-forest',
                'kolsai-mountain-trekking'
            ]
        },
        {
            id: 'altyn-emel',
            region: 'almaty-southeast',
            x: 76.9,
            y: 71,
            displayX: 75.0,
            displayY: 66.5,
            icon: 'fa-mountain',
            name: '알틴에멜 국립공원',
            nativeName: 'Алтын-Емел · Altyn-Emel National Park',
            hint: '사구 · 산악 지형',
            tagIds: [
                'altyn-emel-singing-dune',
                'altyn-emel-aktau-mountains',
                'altyn-emel-katutau-mountains',
                'altyn-emel-besshatyr',
                'altyn-emel-saka-sites'
            ]
        },
        {
            id: 'turkistan',
            region: 'south-silk-road',
            x: 53,
            y: 76.6,
            icon: 'fa-mosque',
            name: '투르키스탄',
            nativeName: 'Түркістан · Turkistan',
            hint: '영묘 · 실크로드',
            tagIds: [
                'turkistan-yasawi-mausoleum',
                'turkistan-timurid-architecture',
                'turkistan-sufi-sacred-site',
                'turkistan-silk-road-history',
                'turkistan-blue-tile-dome'
            ]
        },
        {
            id: 'shymkent',
            region: 'south-silk-road',
            x: 56,
            y: 82.1,
            icon: 'fa-building',
            name: '쉼켄트',
            nativeName: 'Шымкент · Shymkent',
            hint: '성채 · 수목원',
            tagIds: [
                'shymkent-shymqala',
                'shymkent-askarov-dendropark',
                'shymkent-baidibek-bi',
                'shymkent-arbat',
                'shymkent-koshkar-ata'
            ]
        },
        {
            id: 'taraz',
            region: 'south-silk-road',
            x: 60.1,
            y: 78.8,
            icon: 'fa-landmark',
            name: '타라즈',
            nativeName: 'Тараз · Taraz',
            hint: '영묘 · 고대 도시',
            tagIds: [
                'taraz-aisha-bibi',
                'taraz-babaji-khatun',
                'taraz-karakhan',
                'taraz-ancient-site',
                'taraz-silk-road-history'
            ]
        },
        {
            id: 'karaganda',
            region: 'central-east',
            x: 63.9,
            y: 39.8,
            icon: 'fa-industry',
            name: '카라간다',
            nativeName: 'Қарағанды · Karaganda (Qaragandy)',
            hint: '광업 · 산업 유산',
            tagIds: [
                'karaganda-coal-industry',
                'karaganda-mining-heritage',
                'karaganda-palace-of-miners',
                'karaganda-regional-museum',
                'karaganda-karlag-museum'
            ]
        },
        {
            id: 'ulytau',
            region: 'central-east',
            x: 50.2,
            y: 46.4,
            icon: 'fa-monument',
            name: '울르타우',
            nativeName: 'Ұлытау · Ulytau',
            hint: '영묘 · 민족 성지',
            tagIds: [
                'ulytau-mountains',
                'ulytau-jochi-khan',
                'ulytau-alasha-khan',
                'ulytau-dombauyl',
                'ulytau-national-sacred-site'
            ]
        },
        {
            id: 'katon-karagai',
            region: 'central-east',
            x: 92.1,
            y: 43.4,
            icon: 'fa-mountain',
            name: '카톤카라가이',
            nativeName: 'Катонқарағай · Katon-Karagai',
            hint: '알타이 · 자연',
            tagIds: [
                'katon-altai-mountains',
                'katon-berel-mounds',
                'katon-rakhman-springs',
                'katon-kokkol-waterfall',
                'katon-national-park'
            ]
        },
        {
            id: 'aktau-mangystau',
            region: 'west-caspian',
            x: 14.5,
            y: 74.6,
            icon: 'fa-ship',
            name: '악타우·망기스타우',
            nativeName: 'Ақтау·Маңғыстау · Aktau·Mangystau',
            hint: '카스피해 · 반사막',
            tagIds: [
                'mangystau-caspian-coast',
                'mangystau-bozzhyra',
                'mangystau-torysh',
                'mangystau-rock-mosques',
                'mangystau-beket-ata'
            ]
        },
        {
            id: 'atyrau',
            region: 'west-caspian',
            x: 16.2,
            y: 55.1,
            icon: 'fa-oil-well',
            name: '아티라우',
            nativeName: 'Атырау · Atyrau',
            hint: '우랄강 · 석유 산업',
            tagIds: [
                'atyrau-ural-river',
                'atyrau-europe-asia-marker',
                'atyrau-sarayshyk',
                'atyrau-oil-gas-industry'
            ]
        },
        {
            id: 'baikonur',
            region: 'southwest-space',
            x: 41.9,
            y: 63.5,
            icon: 'fa-rocket',
            name: '바이코누르',
            nativeName: 'Байқоңыр · Baikonur',
            hint: '우주기지 · 우주 역사',
            tagIds: [
                'baikonur-cosmodrome',
                'baikonur-rocket-launches',
                'baikonur-gagarin-flight',
                'baikonur-first-satellite',
                'baikonur-space-city'
            ]
        },
        {
            id: 'kyzylorda',
            region: 'southwest-space',
            x: 46.8,
            y: 67.8,
            icon: 'fa-water',
            name: '크즐오르다·시르다리야권',
            nativeName: 'Қызылорда · Kyzylorda',
            hint: '시르다리야 · 실크로드',
            tagIds: [
                'kyzylorda-syr-darya',
                'kyzylorda-aitbay-mosque',
                'kyzylorda-korkyt-ata',
                'kyzylorda-syganak',
                'kyzylorda-silk-road-history'
            ]
        }
    ],
    tags: {
        'astana-baiterek': {
            label: '바이테렉 기념탑',
            mapQuery: 'Baiterek Monument, Astana, Kazakhstan',
            imageQuery: 'Baiterek Monument Astana Kazakhstan'
        },
        'astana-khan-shatyr': {
            label: '칸 샤티르',
            mapQuery: 'Khan Shatyr, Astana, Kazakhstan',
            imageQuery: 'Khan Shatyr Entertainment Center Astana Kazakhstan'
        },
        'astana-national-museum': {
            label: '국립박물관',
            mapQuery: 'National Museum of the Republic of Kazakhstan, Astana',
            imageQuery: 'National Museum of the Republic of Kazakhstan Astana'
        },
        'astana-nur-alem': {
            label: '누르 알렘',
            mapQuery: 'Nur Alem Museum of Future Energy, Astana, Kazakhstan',
            imageQuery: 'Nur Alem Museum of Future Energy Astana Kazakhstan'
        },
        'astana-futuristic-architecture': {
            label: '미래적인 건축',
            imageQuery: 'futuristic architecture Astana Kazakhstan skyline'
        },
        'burabay-lake': {
            label: '부라바이호',
            mapQuery: 'Lake Burabay, Akmola Region, Kazakhstan',
            imageQuery: 'Lake Burabay Kazakhstan landscape'
        },
        'burabay-zhumbaktas': {
            label: '줌박타스 바위',
            mapQuery: 'Zhumbaktas Rock, Burabay, Kazakhstan',
            imageQuery: 'Zhumbaktas Rock Burabay Kazakhstan'
        },
        'burabay-okzhetpes': {
            label: '오크제트페스 바위',
            mapQuery: 'Okzhetpes Rock, Burabay, Kazakhstan',
            imageQuery: 'Okzhetpes Rock Burabay Kazakhstan'
        },
        'burabay-bolektau': {
            label: '볼렉타우산',
            mapQuery: 'Mount Bolektau, Burabay, Kazakhstan',
            imageQuery: 'Mount Bolektau Burabay Kazakhstan viewpoint'
        },
        'burabay-coniferous-forest': {
            label: '침엽수 숲',
            imageQuery: 'Burabay National Park coniferous forest Kazakhstan'
        },
        'korgalzhyn-reserve': {
            label: '코르갈진 자연보호구역',
            mapQuery: 'Korgalzhyn State Nature Reserve, Kazakhstan',
            imageQuery: 'Korgalzhyn State Nature Reserve Kazakhstan'
        },
        'korgalzhyn-lake-tengiz': {
            label: '텡기스호',
            mapQuery: 'Lake Tengiz, Kazakhstan',
            imageQuery: 'Lake Tengiz Korgalzhyn Kazakhstan'
        },
        'korgalzhyn-pink-flamingos': {
            label: '분홍홍학',
            imageQuery: 'pink flamingos Korgalzhyn Nature Reserve Kazakhstan'
        },
        'korgalzhyn-migratory-birds': {
            label: '철새',
            imageQuery: 'migratory birds Korgalzhyn Nature Reserve Kazakhstan'
        },
        'korgalzhyn-saryarka': {
            label: '사리야르카 세계유산',
            imageQuery: 'Saryarka Steppe and Lakes Northern Kazakhstan UNESCO Korgalzhyn'
        },
        'almaty-medeu': {
            label: '메데우 빙상장',
            mapQuery: 'Medeu, Almaty, Kazakhstan',
            imageQuery: 'Medeu skating rink Almaty Kazakhstan'
        },
        'almaty-shymbulak': {
            label: '쉼불락 스키장',
            mapQuery: 'Shymbulak Ski Resort, Almaty, Kazakhstan',
            imageQuery: 'Shymbulak Ski Resort Almaty Kazakhstan'
        },
        'almaty-kok-tobe': {
            label: '콕토베',
            mapQuery: 'Kok Tobe, Almaty, Kazakhstan',
            imageQuery: 'Kok Tobe Almaty Kazakhstan'
        },
        'almaty-ascension-cathedral': {
            label: '승천 대성당',
            mapQuery: 'Ascension Cathedral, Almaty, Kazakhstan',
            imageQuery: 'Ascension Cathedral Zenkov Cathedral Almaty Kazakhstan'
        },
        'almaty-green-bazaar': {
            label: '녹색시장',
            mapQuery: 'Green Bazaar, Almaty, Kazakhstan',
            imageQuery: 'Green Bazaar Almaty Kazakhstan'
        },
        'charyn-valley-of-castles': {
            label: '성의 계곡',
            mapQuery: 'Valley of Castles, Charyn Canyon, Kazakhstan',
            imageQuery: 'Valley of Castles Charyn Canyon Kazakhstan'
        },
        'charyn-red-cliffs': {
            label: '붉은 절벽',
            imageQuery: 'red sedimentary cliffs Charyn Canyon Kazakhstan'
        },
        'charyn-river': {
            label: '차른강',
            mapQuery: 'Charyn River, Kazakhstan',
            imageQuery: 'Charyn River Charyn Canyon Kazakhstan'
        },
        'charyn-ash-grove': {
            label: '물푸레나무 숲',
            mapQuery: 'Sarytogai Ash Tree Grove, Charyn Canyon, Kazakhstan',
            imageQuery: 'Sarytogai relict ash grove Charyn Canyon Kazakhstan'
        },
        'charyn-trekking': {
            label: '협곡 트레킹',
            imageQuery: 'hiking trekking Charyn Canyon Kazakhstan'
        },
        'kolsai-lakes': {
            label: '콜사이 호수',
            mapQuery: 'Kolsai Lakes National Park, Kazakhstan',
            imageQuery: 'Kolsai Lakes National Park Kazakhstan'
        },
        'kolsai-lake-kaindy': {
            label: '카인디호',
            mapQuery: 'Lake Kaindy, Kazakhstan',
            imageQuery: 'Lake Kaindy Kazakhstan sunken forest'
        },
        'kolsai-submerged-trees': {
            label: '수몰나무',
            imageQuery: 'submerged trees Lake Kaindy Kazakhstan'
        },
        'kolsai-spruce-forest': {
            label: '가문비나무 숲',
            imageQuery: 'spruce forest Kolsai Lakes National Park Kazakhstan'
        },
        'kolsai-mountain-trekking': {
            label: '산악 트레킹',
            imageQuery: 'mountain trekking Kolsai Lakes Kazakhstan'
        },
        'altyn-emel-singing-dune': {
            label: '노래하는 사구',
            mapQuery: 'Singing Dune, Altyn-Emel National Park, Kazakhstan',
            imageQuery: 'Singing Dune Altyn-Emel National Park Kazakhstan'
        },
        'altyn-emel-aktau-mountains': {
            label: '악타우 산맥',
            mapQuery: 'Aktau Mountains, Altyn-Emel National Park, Kazakhstan',
            imageQuery: 'Aktau Mountains Altyn-Emel National Park Kazakhstan'
        },
        'altyn-emel-katutau-mountains': {
            label: '카투타우 산맥',
            mapQuery: 'Katutau Mountains, Altyn-Emel National Park, Kazakhstan',
            imageQuery: 'Katutau Mountains Altyn-Emel National Park Kazakhstan'
        },
        'altyn-emel-besshatyr': {
            label: '베스샤티르 고분군',
            mapQuery: 'Besshatyr Burial Grounds, Altyn-Emel, Kazakhstan',
            imageQuery: 'Besshatyr burial mounds Altyn-Emel Kazakhstan'
        },
        'altyn-emel-saka-sites': {
            label: '사카 유적',
            imageQuery: 'Saka archaeological sites Besshatyr Altyn-Emel Kazakhstan'
        },
        'turkistan-yasawi-mausoleum': {
            label: '호자 아흐메드 야사위 영묘',
            mapQuery: 'Mausoleum of Khoja Ahmed Yasawi, Turkistan, Kazakhstan',
            imageQuery: 'Mausoleum of Khoja Ahmed Yasawi Turkistan Kazakhstan'
        },
        'turkistan-timurid-architecture': {
            label: '티무르 건축',
            imageQuery: 'Timurid architecture Khoja Ahmed Yasawi Mausoleum Turkistan Kazakhstan'
        },
        'turkistan-sufi-sacred-site': {
            label: '수피 성지',
            imageQuery: 'Sufi pilgrimage Khoja Ahmed Yasawi Turkistan Kazakhstan'
        },
        'turkistan-silk-road-history': {
            label: '실크로드 역사',
            imageQuery: 'Silk Road heritage Turkistan Kazakhstan'
        },
        'turkistan-blue-tile-dome': {
            label: '푸른 타일 돔',
            imageQuery: 'blue tiled dome Khoja Ahmed Yasawi Mausoleum Turkistan'
        },
        'shymkent-shymqala': {
            label: '쉼칼라 성채',
            mapQuery: 'Shymqala Historical and Cultural Complex, Shymkent, Kazakhstan',
            imageQuery: 'Shymqala Citadel historical complex Shymkent Kazakhstan'
        },
        'shymkent-askarov-dendropark': {
            label: '아스카로프 수목원',
            mapQuery: 'Asanbay Askarov Dendropark, Shymkent, Kazakhstan',
            imageQuery: 'Asanbay Askarov Dendropark Shymkent Kazakhstan'
        },
        'shymkent-baidibek-bi': {
            label: '바이디벡비 기념비',
            mapQuery: 'Baidibek Bi Monument, Shymkent, Kazakhstan',
            imageQuery: 'Baidibek Bi Monument Shymkent Kazakhstan'
        },
        'shymkent-arbat': {
            label: '아르바트 거리',
            mapQuery: 'Arbat, Shymkent, Kazakhstan',
            imageQuery: 'Arbat pedestrian street Shymkent Kazakhstan'
        },
        'shymkent-koshkar-ata': {
            label: '코시카르아타강',
            mapQuery: 'Koshkar Ata River, Shymkent, Kazakhstan',
            imageQuery: 'Koshkar Ata River Shymkent Kazakhstan'
        },
        'taraz-aisha-bibi': {
            label: '아이샤비비 영묘',
            mapQuery: 'Aisha Bibi Mausoleum, Taraz, Kazakhstan',
            imageQuery: 'Aisha Bibi Mausoleum Taraz Kazakhstan'
        },
        'taraz-babaji-khatun': {
            label: '바바지카툰 영묘',
            mapQuery: 'Babaji Khatun Mausoleum, Taraz, Kazakhstan',
            imageQuery: 'Babaji Khatun Mausoleum Taraz Kazakhstan'
        },
        'taraz-karakhan': {
            label: '카라한 영묘',
            mapQuery: 'Karakhan Mausoleum, Taraz, Kazakhstan',
            imageQuery: 'Karakhan Mausoleum Taraz Kazakhstan'
        },
        'taraz-ancient-site': {
            label: '고대 타라즈 유적',
            mapQuery: 'Ancient Taraz Archaeological Park, Taraz, Kazakhstan',
            imageQuery: 'Ancient Taraz Archaeological Park Kazakhstan'
        },
        'taraz-silk-road-history': {
            label: '실크로드 역사',
            imageQuery: 'Silk Road heritage ancient Taraz Kazakhstan'
        },
        'karaganda-coal-industry': {
            label: '석탄 산업',
            imageQuery: 'Karaganda Kazakhstan coal mining industry'
        },
        'karaganda-mining-heritage': {
            label: '광업 유산',
            imageQuery: 'Karaganda Kazakhstan mining heritage historical photographs'
        },
        'karaganda-palace-of-miners': {
            label: '광부문화궁전',
            mapQuery: 'Palace of Miners, Karaganda, Kazakhstan',
            imageQuery: 'Palace of Miners Karaganda Kazakhstan'
        },
        'karaganda-regional-museum': {
            label: '카라간다 향토박물관',
            mapQuery: 'Karaganda Regional Museum of Local History, Kazakhstan',
            imageQuery: 'Karaganda Regional Museum of Local History Kazakhstan'
        },
        'karaganda-karlag-museum': {
            label: '카를라크 박물관',
            mapQuery: 'Karlag Museum, Dolinka, Karaganda Region, Kazakhstan',
            imageQuery: 'Karlag Museum Dolinka Kazakhstan memorial museum'
        },
        'ulytau-mountains': {
            label: '울르타우 산맥',
            mapQuery: 'Ulytau Mountains, Kazakhstan',
            imageQuery: 'Ulytau Mountains Kazakhstan landscape'
        },
        'ulytau-jochi-khan': {
            label: '조치 칸 영묘',
            mapQuery: 'Mausoleum of Jochi Khan, Ulytau Region, Kazakhstan',
            imageQuery: 'Jochi Khan Mausoleum Ulytau Kazakhstan'
        },
        'ulytau-alasha-khan': {
            label: '알라샤 칸 영묘',
            mapQuery: 'Alasha Khan Mausoleum, Ulytau Region, Kazakhstan',
            imageQuery: 'Alasha Khan Mausoleum Ulytau Kazakhstan'
        },
        'ulytau-dombauyl': {
            label: '돔바울 영묘',
            mapQuery: 'Dombauyl Mausoleum, Ulytau Region, Kazakhstan',
            imageQuery: 'Dombauyl Mausoleum Ulytau Kazakhstan'
        },
        'ulytau-national-sacred-site': {
            label: '카자흐 민족의 성지',
            imageQuery: 'Ulytau sacred landscape Kazakhstan cultural heritage'
        },
        'katon-altai-mountains': {
            label: '알타이 산맥',
            mapQuery: 'Kazakh Altai Mountains, East Kazakhstan',
            imageQuery: 'Kazakh Altai Mountains Katon-Karagai Kazakhstan'
        },
        'katon-berel-mounds': {
            label: '베렐 고분군',
            mapQuery: 'Berel Mounds, Katon-Karagai, Kazakhstan',
            imageQuery: 'Berel burial mounds Katon-Karagai Kazakhstan'
        },
        'katon-rakhman-springs': {
            label: '라흐만 온천',
            mapQuery: 'Rakhman Springs, East Kazakhstan',
            imageQuery: 'Rakhman Springs Katon-Karagai Kazakhstan'
        },
        'katon-kokkol-waterfall': {
            label: '코콜 폭포',
            mapQuery: 'Kokkol Waterfall, Katon-Karagai, Kazakhstan',
            imageQuery: 'Kokkol Waterfall Katon-Karagai Kazakhstan'
        },
        'katon-national-park': {
            label: '카톤카라가이 국립공원',
            mapQuery: 'Katon-Karagai National Park, Kazakhstan',
            imageQuery: 'Katon-Karagai National Park Kazakhstan'
        },
        'mangystau-caspian-coast': {
            label: '카스피해 해안',
            mapQuery: 'Aktau Caspian Sea Waterfront, Kazakhstan',
            imageQuery: 'Aktau Caspian Sea coast Kazakhstan'
        },
        'mangystau-bozzhyra': {
            label: '보즈지라 지형',
            mapQuery: 'Bozzhyra Tract, Mangystau Region, Kazakhstan',
            imageQuery: 'Bozzhyra Tract Mangystau Kazakhstan'
        },
        'mangystau-torysh': {
            label: '토리시 공의 계곡',
            mapQuery: 'Torysh Valley of Balls, Mangystau, Kazakhstan',
            imageQuery: 'Torysh Valley of Balls Mangystau Kazakhstan'
        },
        'mangystau-rock-mosques': {
            label: '망기스타우 암굴 모스크',
            imageQuery: 'Rock Mosques and Associated Sacred Sites of Mangystau Kazakhstan UNESCO'
        },
        'mangystau-beket-ata': {
            label: '베케트아타 순례지',
            mapQuery: 'Beket-Ata Underground Mosque, Mangystau, Kazakhstan',
            imageQuery: 'Beket-Ata underground mosque pilgrimage Mangystau Kazakhstan'
        },
        'atyrau-ural-river': {
            label: '우랄강',
            mapQuery: 'Ural River, Atyrau, Kazakhstan',
            imageQuery: 'Ural River Atyrau Kazakhstan'
        },
        'atyrau-europe-asia-marker': {
            label: '유럽·아시아 경계 표지',
            imageQuery: 'Еуропа Азия шекарасы Атырау, Қазақстан'
        },
        'atyrau-sarayshyk': {
            label: '사라이시크 유적',
            mapQuery: 'Saraishyk Museum Reserve, Atyrau Region, Kazakhstan',
            imageQuery: 'Saraishyk ancient settlement Atyrau Kazakhstan'
        },
        'atyrau-oil-gas-industry': {
            label: '석유·가스 산업',
            imageQuery: 'Atyrau Kazakhstan oil and gas industry city'
        },
        'baikonur-cosmodrome': {
            label: '바이코누르 우주기지',
            mapQuery: 'Baikonur Cosmodrome, Kazakhstan',
            imageQuery: 'Baikonur Cosmodrome Kazakhstan'
        },
        'baikonur-rocket-launches': {
            label: '로켓 발사',
            imageQuery: 'Baikonur Cosmodrome rocket launch Kazakhstan'
        },
        'baikonur-gagarin-flight': {
            label: '가가린의 첫 우주비행',
            imageQuery: 'Yuri Gagarin first spaceflight Baikonur Cosmodrome'
        },
        'baikonur-first-satellite': {
            label: '최초의 인공위성',
            imageQuery: 'Sputnik 1 first artificial satellite Baikonur Cosmodrome'
        },
        'baikonur-space-city': {
            label: '우주도시',
            mapQuery: 'Baikonur City, Kazakhstan',
            imageQuery: 'Baikonur city Kazakhstan space town'
        },
        'kyzylorda-syr-darya': {
            label: '시르다리야강',
            mapQuery: 'Syr Darya River, Kyzylorda, Kazakhstan',
            imageQuery: 'Syr Darya River Kyzylorda Kazakhstan'
        },
        'kyzylorda-aitbay-mosque': {
            label: '아이트바이 모스크',
            mapQuery: 'Aitbay Mosque, Kyzylorda, Kazakhstan',
            imageQuery: 'Aitbay Mosque Kyzylorda Kazakhstan'
        },
        'kyzylorda-korkyt-ata': {
            label: '코르키트아타 기념단지',
            mapQuery: 'Korkyt Ata Memorial Complex, Kyzylorda Region, Kazakhstan',
            imageQuery: 'Korkyt Ata Memorial Complex Kyzylorda Kazakhstan'
        },
        'kyzylorda-syganak': {
            label: '시그나크 유적',
            mapQuery: 'Ancient Settlement of Syganak, Kyzylorda Region, Kazakhstan',
            imageQuery: 'Syganak ancient settlement Kyzylorda Kazakhstan'
        },
        'kyzylorda-silk-road-history': {
            label: '실크로드 역사',
            imageQuery: 'Silk Road heritage Kyzylorda Region Kazakhstan Syganak'
        }
    }
});
