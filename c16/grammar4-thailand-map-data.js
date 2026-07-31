window.C16_COUNTRY_MAP_DATA = {
    schemaVersion: 1,
    countryId: 'thailand',
    storageKey: 'korean3bimprove:c16:grammar4:thailand-map-match:v1',
    zoomSteps: [1, 1.35, 1.7, 2.15, 2.6],
    initialState: {
        region: 'central-west',
        targetId: 'bangkok',
        tagId: 'bangkok-grand-palace',
        zoomIndex: 0
    },
    regions: [
        { id: 'all', label: '전체', icon: 'fa-globe-asia' },
        { id: 'central-west', label: '중부·서부', icon: 'fa-landmark' },
        { id: 'north', label: '북부', icon: 'fa-mountain-sun' },
        { id: 'isan', label: '동북부·이산', icon: 'fa-seedling' },
        { id: 'east', label: '동부', icon: 'fa-water' },
        { id: 'gulf', label: '남부·타이만', icon: 'fa-umbrella-beach' },
        { id: 'andaman', label: '남부·안다만', icon: 'fa-ship' }
    ],
    targets: [
        {
            id: 'bangkok',
            region: 'central-west',
            x: 40.0,
            y: 45.8,
            icon: 'fa-city',
            name: '방콕',
            nativeName: 'กรุงเทพมหานคร (Bangkok)',
            hint: '수도 · 왕궁',
            tagIds: [
                'bangkok-grand-palace',
                'bangkok-wat-arun',
                'bangkok-wat-pho',
                'bangkok-chao-phraya',
                'bangkok-khao-san-road'
            ]
        },
        {
            id: 'ayutthaya',
            region: 'central-west',
            x: 40.6,
            y: 40.7,
            displayX: 35.5,
            displayY: 37.5,
            icon: 'fa-landmark',
            name: '아유타야',
            nativeName: 'พระนครศรีอยุธยา (Ayutthaya)',
            hint: '고도 · 유적',
            tagIds: [
                'ayutthaya-historical-park',
                'ayutthaya-wat-mahathat',
                'ayutthaya-wat-chaiwatthanaram',
                'ayutthaya-bang-pa-in-palace',
                'ayutthaya-roti-sai-mai'
            ]
        },
        {
            id: 'kanchanaburi',
            region: 'central-west',
            x: 30.5,
            y: 44.1,
            icon: 'fa-bridge',
            name: '깐차나부리',
            nativeName: 'กาญจนบุรี (Kanchanaburi)',
            hint: '철도 · 폭포',
            tagIds: [
                'kanchanaburi-river-kwai-bridge',
                'kanchanaburi-thailand-burma-railway',
                'kanchanaburi-erawan-falls',
                'kanchanaburi-hellfire-pass',
                'kanchanaburi-sai-yok'
            ]
        },
        {
            id: 'hua-hin',
            region: 'central-west',
            x: 35.0,
            y: 52.9,
            icon: 'fa-umbrella-beach',
            name: '후아힌',
            nativeName: 'หัวหิน (Hua Hin)',
            hint: '해변 · 휴양',
            tagIds: [
                'hua-hin-beach',
                'hua-hin-railway-station',
                'hua-hin-night-market',
                'hua-hin-khao-takiab',
                'hua-hin-pala-u-waterfall'
            ]
        },
        {
            id: 'chiang-mai',
            region: 'north',
            x: 25.8,
            y: 16.5,
            icon: 'fa-place-of-worship',
            name: '치앙마이',
            nativeName: 'เชียงใหม่ (Chiang Mai)',
            hint: '사원 · 축제',
            tagIds: [
                'chiang-mai-doi-suthep',
                'chiang-mai-tha-phae',
                'chiang-mai-doi-inthanon',
                'chiang-mai-yi-peng',
                'chiang-mai-khao-soi'
            ]
        },
        {
            id: 'chiang-rai',
            region: 'north',
            x: 33.9,
            y: 10.0,
            icon: 'fa-palette',
            name: '치앙라이',
            nativeName: 'เชียงราย (Chiang Rai)',
            hint: '예술 · 산악',
            tagIds: [
                'chiang-rai-white-temple',
                'chiang-rai-blue-temple',
                'chiang-rai-baan-dam',
                'chiang-rai-golden-triangle',
                'chiang-rai-doi-tung'
            ]
        },
        {
            id: 'sukhothai',
            region: 'north',
            x: 32.6,
            y: 26.7,
            icon: 'fa-landmark',
            name: '쑤코타이',
            nativeName: 'สุโขทัย (Sukhothai)',
            hint: '고도 · 도자기',
            tagIds: [
                'sukhothai-historical-park',
                'sukhothai-wat-si-chum',
                'sukhothai-wat-mahathat',
                'sukhothai-loy-krathong',
                'sukhothai-sangkhalok'
            ]
        },
        {
            id: 'nakhon-ratchasima',
            region: 'isan',
            x: 55.2,
            y: 38.6,
            icon: 'fa-mountain-sun',
            name: '나콘라차시마(코랏)',
            nativeName: 'นครราชสีมา (Nakhon Ratchasima / Korat)',
            hint: '국립공원 · 유적',
            tagIds: [
                'korat-khao-yai',
                'korat-phimai',
                'korat-thao-suranari',
                'korat-pak-thong-chai-silk',
                'korat-folk-song'
            ]
        },
        {
            id: 'khon-kaen',
            region: 'isan',
            x: 62.0,
            y: 30.1,
            icon: 'fa-monument',
            name: '컨깬',
            nativeName: 'ขอนแก่น (Khon Kaen)',
            hint: '실크 · 공룡',
            tagIds: [
                'khon-kaen-phra-that-kham-kaen',
                'khon-kaen-phra-mahathat',
                'khon-kaen-phu-wiang-museum',
                'khon-kaen-chonnabot-silk',
                'khon-kaen-bueng-kaen-nakhon'
            ]
        },
        {
            id: 'udon-thani',
            region: 'isan',
            x: 61.7,
            y: 24.4,
            icon: 'fa-landmark',
            name: '우돈타니',
            nativeName: 'อุดรธานี (Udon Thani)',
            hint: '고고유적 · 호수',
            tagIds: [
                'udon-ban-chiang',
                'udon-phu-phrabat',
                'udon-red-lotus-lake',
                'udon-nong-prajak',
                'udon-khit-textile'
            ]
        },
        {
            id: 'pattaya',
            region: 'east',
            x: 44.5,
            y: 51.2,
            icon: 'fa-umbrella-beach',
            name: '파타야',
            nativeName: 'พัทยา (Pattaya)',
            hint: '해변 · 휴양',
            tagIds: [
                'pattaya-beach',
                'pattaya-ko-lan',
                'pattaya-sanctuary-of-truth',
                'pattaya-nong-nooch',
                'pattaya-khao-chi-chan'
            ]
        },
        {
            id: 'ko-chang',
            region: 'east',
            x: 57.6,
            y: 55.2,
            icon: 'fa-water',
            name: '꼬 창',
            nativeName: 'เกาะช้าง (Ko Chang)',
            hint: '섬 · 폭포',
            tagIds: [
                'ko-chang-white-sand-beach',
                'ko-chang-klong-plu',
                'ko-chang-bang-bao',
                'ko-chang-national-park',
                'ko-chang-kai-bae'
            ]
        },
        {
            id: 'ko-samui',
            region: 'gulf',
            x: 35.3,
            y: 70.2,
            icon: 'fa-umbrella-beach',
            name: '사무이섬',
            nativeName: 'เกาะสมุย (Ko Samui)',
            hint: '섬 · 해변',
            tagIds: [
                'samui-chaweng-beach',
                'samui-lamai-beach',
                'samui-ang-thong',
                'samui-hin-ta-hin-yai',
                'samui-bophut'
            ]
        },
        {
            id: 'songkhla',
            region: 'gulf',
            x: 41.0,
            y: 83.6,
            icon: 'fa-water',
            name: '송클라',
            nativeName: 'สงขลา (Songkhla)',
            hint: '올드타운 · 호수',
            tagIds: [
                'songkhla-old-town',
                'songkhla-samila-beach',
                'songkhla-golden-mermaid',
                'songkhla-lake',
                'songkhla-tang-kuan-hill'
            ]
        },
        {
            id: 'phuket',
            region: 'andaman',
            x: 17.5,
            y: 80.4,
            icon: 'fa-city',
            name: '푸껫',
            nativeName: 'ภูเก็ต (Phuket)',
            hint: '올드타운 · 해변',
            tagIds: [
                'phuket-old-town',
                'phuket-patong-beach',
                'phuket-wat-chalong',
                'phuket-promthep-cape',
                'phuket-sino-portuguese'
            ]
        },
        {
            id: 'krabi',
            region: 'andaman',
            x: 26.5,
            y: 79.5,
            icon: 'fa-mountain-sun',
            name: '끄라비',
            nativeName: 'กระบี่ (Krabi)',
            hint: '섬 · 절벽',
            tagIds: [
                'krabi-ao-nang',
                'krabi-railay-beach',
                'krabi-phi-phi',
                'krabi-emerald-pool',
                'krabi-rock-climbing'
            ]
        },
        {
            id: 'phang-nga',
            region: 'andaman',
            x: 20.0,
            y: 74.5,
            icon: 'fa-ship',
            name: '팡아',
            nativeName: 'พังงา (Phang Nga)',
            hint: '만 · 해양',
            tagIds: [
                'phang-nga-bay',
                'phang-nga-james-bond-island',
                'phang-nga-similan',
                'phang-nga-surin',
                'phang-nga-khao-lak'
            ]
        }
    ],
    tags: {
        'bangkok-grand-palace': {
            label: '왕궁',
            mapQuery: 'พระบรมมหาราชวัง Grand Palace Bangkok Thailand',
            imageQuery: 'พระบรมมหาราชวัง Grand Palace Bangkok Thailand'
        },
        'bangkok-wat-arun': {
            label: '왓 아룬',
            mapQuery: 'วัดอรุณ Wat Arun Bangkok Thailand',
            imageQuery: 'วัดอรุณ Wat Arun Bangkok Thailand'
        },
        'bangkok-wat-pho': {
            label: '왓 포',
            mapQuery: 'วัดโพธิ์ Wat Pho Bangkok Thailand',
            imageQuery: 'วัดโพธิ์ Wat Pho Bangkok Thailand'
        },
        'bangkok-chao-phraya': {
            label: '짜오프라야강',
            mapQuery: 'แม่น้ำเจ้าพระยา Chao Phraya River Bangkok Thailand',
            imageQuery: 'แม่น้ำเจ้าพระยา Chao Phraya River Bangkok Thailand'
        },
        'bangkok-khao-san-road': {
            label: '카오산 로드',
            mapQuery: 'ถนนข้าวสาร Khao San Road Bangkok Thailand',
            imageQuery: 'ถนนข้าวสาร Khao San Road Bangkok Thailand'
        },
        'ayutthaya-historical-park': {
            label: '아유타야 역사공원',
            mapQuery: 'อุทยานประวัติศาสตร์พระนครศรีอยุธยา Ayutthaya Historical Park Thailand',
            imageQuery: 'อุทยานประวัติศาสตร์พระนครศรีอยุธยา Ayutthaya Historical Park Thailand'
        },
        'ayutthaya-wat-mahathat': {
            label: '왓 마하탓',
            mapQuery: 'วัดมหาธาตุ Ayutthaya Thailand',
            imageQuery: 'วัดมหาธาตุ Wat Mahathat Ayutthaya Thailand'
        },
        'ayutthaya-wat-chaiwatthanaram': {
            label: '왓 차이왓타나람',
            mapQuery: 'วัดไชยวัฒนาราม Wat Chaiwatthanaram Ayutthaya Thailand',
            imageQuery: 'วัดไชยวัฒนาราม Wat Chaiwatthanaram Ayutthaya Thailand'
        },
        'ayutthaya-bang-pa-in-palace': {
            label: '방파인 궁전',
            mapQuery: 'พระราชวังบางปะอิน Bang Pa-In Palace Ayutthaya Thailand',
            imageQuery: 'พระราชวังบางปะอิน Bang Pa-In Palace Ayutthaya Thailand'
        },
        'ayutthaya-roti-sai-mai': {
            label: '로띠 싸이마이',
            imageQuery: 'โรตีสายไหม Roti Sai Mai Ayutthaya Thailand'
        },
        'kanchanaburi-river-kwai-bridge': {
            label: '콰이강의 다리',
            mapQuery: 'สะพานข้ามแม่น้ำแคว Bridge on the River Kwai Kanchanaburi Thailand',
            imageQuery: 'สะพานข้ามแม่น้ำแคว Bridge on the River Kwai Kanchanaburi Thailand'
        },
        'kanchanaburi-thailand-burma-railway': {
            label: '태국-버마 철도의 역사',
            imageQuery: 'Burma-Thailand Railway forced labour POW romusha memorial Kanchanaburi history'
        },
        'kanchanaburi-erawan-falls': {
            label: '에라완 폭포',
            mapQuery: 'น้ำตกเอราวัณ Erawan Falls Kanchanaburi Thailand',
            imageQuery: 'น้ำตกเอราวัณ Erawan Falls Kanchanaburi Thailand'
        },
        'kanchanaburi-hellfire-pass': {
            label: '헬파이어 패스',
            mapQuery: 'ช่องเขาขาด Hellfire Pass Kanchanaburi Thailand',
            imageQuery: 'ช่องเขาขาด Hellfire Pass Kanchanaburi Thailand'
        },
        'kanchanaburi-sai-yok': {
            label: '사이욕 국립공원',
            mapQuery: 'อุทยานแห่งชาติไทรโยค Sai Yok National Park Kanchanaburi Thailand',
            imageQuery: 'อุทยานแห่งชาติไทรโยค Sai Yok National Park Kanchanaburi Thailand'
        },
        'hua-hin-beach': {
            label: '후아힌 해변',
            mapQuery: 'หาดหัวหิน Hua Hin Beach Thailand',
            imageQuery: 'หาดหัวหิน Hua Hin Beach Thailand'
        },
        'hua-hin-railway-station': {
            label: '후아힌 기차역',
            mapQuery: 'สถานีรถไฟหัวหิน Hua Hin Railway Station Thailand',
            imageQuery: 'สถานีรถไฟหัวหิน Hua Hin Railway Station Thailand'
        },
        'hua-hin-night-market': {
            label: '후아힌 야시장',
            mapQuery: 'ตลาดโต้รุ่งหัวหิน Hua Hin Night Market Thailand',
            imageQuery: 'ตลาดโต้รุ่งหัวหิน Hua Hin Night Market Thailand'
        },
        'hua-hin-khao-takiab': {
            label: '카오 따끼압',
            mapQuery: 'เขาตะเกียบ Khao Takiab Hua Hin Thailand',
            imageQuery: 'เขาตะเกียบ Khao Takiab Hua Hin Thailand'
        },
        'hua-hin-pala-u-waterfall': {
            label: '팔라우 폭포',
            mapQuery: 'น้ำตกป่าละอู Pa La-U Waterfall Hua Hin Thailand',
            imageQuery: 'น้ำตกป่าละอู Pa La-U Waterfall Hua Hin Thailand'
        },
        'chiang-mai-doi-suthep': {
            label: '왓 프라탓 도이수텝',
            mapQuery: 'วัดพระธาตุดอยสุเทพ Wat Phra That Doi Suthep Chiang Mai Thailand',
            imageQuery: 'วัดพระธาตุดอยสุเทพ Wat Phra That Doi Suthep Chiang Mai Thailand'
        },
        'chiang-mai-tha-phae': {
            label: '타패 워킹 스트리트',
            mapQuery: 'ถนนคนเดินท่าแพ Tha Phae Walking Street Chiang Mai Thailand',
            imageQuery: 'ถนนคนเดินท่าแพ Tha Phae Walking Street Chiang Mai Thailand'
        },
        'chiang-mai-doi-inthanon': {
            label: '도이 인타논',
            mapQuery: 'ดอยอินทนนท์ Doi Inthanon Chiang Mai Thailand',
            imageQuery: 'ดอยอินทนนท์ Doi Inthanon Chiang Mai Thailand'
        },
        'chiang-mai-yi-peng': {
            label: '이펭 등불 축제',
            imageQuery: 'ยี่เป็ง Yi Peng Lantern Festival Chiang Mai Thailand'
        },
        'chiang-mai-khao-soi': {
            label: '카오 소이',
            imageQuery: 'ข้าวซอย Khao Soi Chiang Mai Thailand'
        },
        'chiang-rai-white-temple': {
            label: '왓 롱쿤',
            mapQuery: 'วัดร่องขุ่น Wat Rong Khun Chiang Rai Thailand',
            imageQuery: 'วัดร่องขุ่น White Temple Wat Rong Khun Chiang Rai Thailand'
        },
        'chiang-rai-blue-temple': {
            label: '왓 롱수아텐',
            mapQuery: 'วัดร่องเสือเต้น Wat Rong Suea Ten Chiang Rai Thailand',
            imageQuery: 'วัดร่องเสือเต้น Blue Temple Wat Rong Suea Ten Chiang Rai Thailand'
        },
        'chiang-rai-baan-dam': {
            label: '반담 박물관',
            mapQuery: 'พิพิธภัณฑ์บ้านดำ Baan Dam Museum Chiang Rai Thailand',
            imageQuery: 'พิพิธภัณฑ์บ้านดำ Baan Dam Museum Chiang Rai Thailand'
        },
        'chiang-rai-golden-triangle': {
            label: '골든 트라이앵글',
            mapQuery: 'สามเหลี่ยมทองคำ Golden Triangle Chiang Rai Thailand',
            imageQuery: 'สามเหลี่ยมทองคำ Golden Triangle Chiang Rai Thailand'
        },
        'chiang-rai-doi-tung': {
            label: '도이 퉁·매파루앙 정원',
            mapQuery: 'ดอยตุง สวนแม่ฟ้าหลวง Doi Tung Mae Fah Luang Garden Chiang Rai Thailand',
            imageQuery: 'ดอยตุง สวนแม่ฟ้าหลวง Doi Tung Mae Fah Luang Garden Chiang Rai Thailand'
        },
        'sukhothai-historical-park': {
            label: '쑤코타이 역사공원',
            mapQuery: 'อุทยานประวัติศาสตร์สุโขทัย Sukhothai Historical Park Thailand',
            imageQuery: 'อุทยานประวัติศาสตร์สุโขทัย Sukhothai Historical Park Thailand'
        },
        'sukhothai-wat-si-chum': {
            label: '왓 시춤',
            mapQuery: 'วัดศรีชุม Wat Si Chum Sukhothai Thailand',
            imageQuery: 'วัดศรีชุม Wat Si Chum Sukhothai Thailand'
        },
        'sukhothai-wat-mahathat': {
            label: '쑤코타이 왓 마하탓',
            mapQuery: 'วัดมหาธาตุ สุโขทัย Wat Mahathat Sukhothai Thailand',
            imageQuery: 'วัดมหาธาตุ สุโขทัย Wat Mahathat Sukhothai Thailand'
        },
        'sukhothai-loy-krathong': {
            label: '러이 끄라통 축제',
            imageQuery: 'ลอยกระทง สุโขทัย Loy Krathong Festival Sukhothai Thailand'
        },
        'sukhothai-sangkhalok': {
            label: '상칼록 도자기',
            imageQuery: 'เครื่องสังคโลก Sangkhalok ceramics Sukhothai Thailand'
        },
        'korat-khao-yai': {
            label: '카오야이 국립공원',
            mapQuery: 'อุทยานแห่งชาติเขาใหญ่ Khao Yai National Park Thailand',
            imageQuery: 'อุทยานแห่งชาติเขาใหญ่ Khao Yai National Park Thailand'
        },
        'korat-phimai': {
            label: '피마이 역사공원',
            mapQuery: 'อุทยานประวัติศาสตร์พิมาย Phimai Historical Park Nakhon Ratchasima Thailand',
            imageQuery: 'อุทยานประวัติศาสตร์พิมาย Phimai Historical Park Nakhon Ratchasima Thailand'
        },
        'korat-thao-suranari': {
            label: '타오 수라나리 기념비',
            mapQuery: 'อนุสาวรีย์ท้าวสุรนารี Thao Suranari Monument Korat Thailand',
            imageQuery: 'อนุสาวรีย์ท้าวสุรนารี Thao Suranari Monument Korat Thailand'
        },
        'korat-pak-thong-chai-silk': {
            label: '빡통차이 실크',
            imageQuery: 'ผ้าไหมปักธงชัย Pak Thong Chai silk Nakhon Ratchasima Thailand'
        },
        'korat-folk-song': {
            label: '코랏 민요',
            imageQuery: 'เพลงโคราช Korat folk song Thailand'
        },
        'khon-kaen-phra-that-kham-kaen': {
            label: '프라탓 캄깬',
            mapQuery: 'พระธาตุขามแก่น Phra That Kham Kaen Khon Kaen Thailand',
            imageQuery: 'พระธาตุขามแก่น Phra That Kham Kaen Khon Kaen Thailand'
        },
        'khon-kaen-phra-mahathat': {
            label: '프라 마하탓 깬나콘',
            mapQuery: 'พระมหาธาตุแก่นนคร Phra Mahathat Kaen Nakhon Khon Kaen Thailand',
            imageQuery: 'พระมหาธาตุแก่นนคร Phra Mahathat Kaen Nakhon Khon Kaen Thailand'
        },
        'khon-kaen-phu-wiang-museum': {
            label: '푸위앙 공룡 박물관',
            mapQuery: 'พิพิธภัณฑ์ไดโนเสาร์ภูเวียง Phu Wiang Dinosaur Museum Khon Kaen Thailand',
            imageQuery: 'พิพิธภัณฑ์ไดโนเสาร์ภูเวียง Phu Wiang Dinosaur Museum Khon Kaen Thailand'
        },
        'khon-kaen-chonnabot-silk': {
            label: '촌나봇 묻미 실크',
            imageQuery: 'ผ้าไหมมัดหมี่ชนบท Chonnabot Mudmee silk Khon Kaen Thailand'
        },
        'khon-kaen-bueng-kaen-nakhon': {
            label: '부엥깬나콘 호수',
            mapQuery: 'บึงแก่นนคร Bueng Kaen Nakhon Khon Kaen Thailand',
            imageQuery: 'บึงแก่นนคร Bueng Kaen Nakhon Lake Khon Kaen Thailand'
        },
        'udon-ban-chiang': {
            label: '반치앙 고고유적',
            mapQuery: 'แหล่งโบราณคดีบ้านเชียง Ban Chiang Archaeological Site Udon Thani Thailand',
            imageQuery: 'แหล่งโบราณคดีบ้านเชียง Ban Chiang Archaeological Site Udon Thani Thailand'
        },
        'udon-phu-phrabat': {
            label: '푸프라밧 역사공원',
            mapQuery: 'อุทยานประวัติศาสตร์ภูพระบาท Phu Phrabat Historical Park Udon Thani Thailand',
            imageQuery: 'อุทยานประวัติศาสตร์ภูพระบาท Phu Phrabat Historical Park Udon Thani Thailand'
        },
        'udon-red-lotus-lake': {
            label: '붉은 연꽃 호수',
            mapQuery: 'ทะเลบัวแดง Red Lotus Lake Udon Thani Thailand',
            imageQuery: 'ทะเลบัวแดง Red Lotus Lake Udon Thani Thailand'
        },
        'udon-nong-prajak': {
            label: '농프라짝 공원',
            mapQuery: 'สวนสาธารณะหนองประจักษ์ Nong Prajak Park Udon Thani Thailand',
            imageQuery: 'สวนสาธารณะหนองประจักษ์ Nong Prajak Park Udon Thani Thailand'
        },
        'udon-khit-textile': {
            label: '킷 직물',
            imageQuery: 'ผ้าขิดอุดรธานี Khit textile Udon Thani Thailand'
        },
        'pattaya-beach': {
            label: '파타야 해변',
            mapQuery: 'หาดพัทยา Pattaya Beach Thailand',
            imageQuery: 'หาดพัทยา Pattaya Beach Thailand'
        },
        'pattaya-ko-lan': {
            label: '꼬란',
            mapQuery: 'เกาะล้าน Ko Lan Pattaya Thailand',
            imageQuery: 'เกาะล้าน Ko Lan Pattaya Thailand'
        },
        'pattaya-sanctuary-of-truth': {
            label: '진리의 성전',
            mapQuery: 'ปราสาทสัจธรรม Sanctuary of Truth Pattaya Thailand',
            imageQuery: 'ปราสาทสัจธรรม Sanctuary of Truth Pattaya Thailand'
        },
        'pattaya-nong-nooch': {
            label: '농눗 열대정원',
            mapQuery: 'สวนนงนุช Nong Nooch Tropical Garden Pattaya Thailand',
            imageQuery: 'สวนนงนุช Nong Nooch Tropical Garden Pattaya Thailand'
        },
        'pattaya-khao-chi-chan': {
            label: '카오 치찬',
            mapQuery: 'เขาชีจรรย์ Khao Chi Chan Pattaya Thailand',
            imageQuery: 'เขาชีจรรย์ Khao Chi Chan Pattaya Thailand'
        },
        'ko-chang-white-sand-beach': {
            label: '화이트샌드 비치',
            mapQuery: 'หาดทรายขาว White Sand Beach Ko Chang Thailand',
            imageQuery: 'หาดทรายขาว White Sand Beach Ko Chang Thailand'
        },
        'ko-chang-klong-plu': {
            label: '크롱 플루 폭포',
            mapQuery: 'น้ำตกคลองพลู Klong Plu Waterfall Ko Chang Thailand',
            imageQuery: 'น้ำตกคลองพลู Klong Plu Waterfall Ko Chang Thailand'
        },
        'ko-chang-bang-bao': {
            label: '방바오 어촌',
            mapQuery: 'หมู่บ้านบางเบ้า Bang Bao Fishing Village Ko Chang Thailand',
            imageQuery: 'หมู่บ้านบางเบ้า Bang Bao Fishing Village Ko Chang Thailand'
        },
        'ko-chang-national-park': {
            label: '무꼬창 해양국립공원',
            mapQuery: 'อุทยานแห่งชาติหมู่เกาะช้าง Mu Ko Chang National Park Thailand',
            imageQuery: 'อุทยานแห่งชาติหมู่เกาะช้าง Mu Ko Chang National Park Thailand'
        },
        'ko-chang-kai-bae': {
            label: '까이배 해변',
            mapQuery: 'หาดไก่แบ้ Kai Bae Beach Ko Chang Thailand',
            imageQuery: 'หาดไก่แบ้ Kai Bae Beach Ko Chang Thailand'
        },
        'samui-chaweng-beach': {
            label: '차웽 해변',
            mapQuery: 'หาดเฉวง Chaweng Beach Ko Samui Thailand',
            imageQuery: 'หาดเฉวง Chaweng Beach Ko Samui Thailand'
        },
        'samui-lamai-beach': {
            label: '라마이 해변',
            mapQuery: 'หาดละไม Lamai Beach Ko Samui Thailand',
            imageQuery: 'หาดละไม Lamai Beach Ko Samui Thailand'
        },
        'samui-ang-thong': {
            label: '앙통 해양국립공원',
            mapQuery: 'อุทยานแห่งชาติหมู่เกาะอ่างทอง Ang Thong Marine National Park Thailand',
            imageQuery: 'อุทยานแห่งชาติหมู่เกาะอ่างทอง Ang Thong Marine National Park Thailand'
        },
        'samui-hin-ta-hin-yai': {
            label: '힌따힌야이 바위',
            mapQuery: 'หินตาหินยาย Hin Ta Hin Yai Ko Samui Thailand',
            imageQuery: 'หินตาหินยาย Hin Ta Hin Yai Ko Samui Thailand'
        },
        'samui-bophut': {
            label: '보풋 피셔맨스 빌리지',
            mapQuery: 'หมู่บ้านชาวประมงบ่อผุด Bophut Fishermans Village Ko Samui Thailand',
            imageQuery: 'หมู่บ้านชาวประมงบ่อผุด Bophut Fishermans Village Ko Samui Thailand'
        },
        'songkhla-old-town': {
            label: '송클라 올드타운',
            mapQuery: 'เมืองเก่าสงขลา Songkhla Old Town Thailand',
            imageQuery: 'เมืองเก่าสงขลา Songkhla Old Town Thailand'
        },
        'songkhla-samila-beach': {
            label: '사밀라 해변',
            mapQuery: 'หาดสมิหลา Samila Beach Songkhla Thailand',
            imageQuery: 'หาดสมิหลา Samila Beach Songkhla Thailand'
        },
        'songkhla-golden-mermaid': {
            label: '황금 인어상',
            mapQuery: 'รูปปั้นนางเงือกทอง Golden Mermaid Statue Songkhla Thailand',
            imageQuery: 'รูปปั้นนางเงือกทอง Golden Mermaid Statue Songkhla Thailand'
        },
        'songkhla-lake': {
            label: '송클라 호수',
            mapQuery: 'ทะเลสาบสงขลา Songkhla Lake Thailand',
            imageQuery: 'ทะเลสาบสงขลา Songkhla Lake Thailand'
        },
        'songkhla-tang-kuan-hill': {
            label: '탕쿠안 언덕',
            mapQuery: 'เขาตังกวน Tang Kuan Hill Songkhla Thailand',
            imageQuery: 'เขาตังกวน Tang Kuan Hill Songkhla Thailand'
        },
        'phuket-old-town': {
            label: '푸껫 올드타운',
            mapQuery: 'เมืองเก่าภูเก็ต Phuket Old Town Thailand',
            imageQuery: 'เมืองเก่าภูเก็ต Phuket Old Town Thailand'
        },
        'phuket-patong-beach': {
            label: '빠통 해변',
            mapQuery: 'หาดป่าตอง Patong Beach Phuket Thailand',
            imageQuery: 'หาดป่าตอง Patong Beach Phuket Thailand'
        },
        'phuket-wat-chalong': {
            label: '왓 찰롱',
            mapQuery: 'วัดฉลอง Wat Chalong Phuket Thailand',
            imageQuery: 'วัดฉลอง Wat Chalong Phuket Thailand'
        },
        'phuket-promthep-cape': {
            label: '프롬텝 곶',
            mapQuery: 'แหลมพรหมเทพ Promthep Cape Phuket Thailand',
            imageQuery: 'แหลมพรหมเทพ Promthep Cape Phuket Thailand'
        },
        'phuket-sino-portuguese': {
            label: '시노포르투갈 건축',
            imageQuery: 'สถาปัตยกรรมชิโนโปรตุกีส Sino-Portuguese architecture Phuket Thailand'
        },
        'krabi-ao-nang': {
            label: '아오낭',
            mapQuery: 'อ่าวนาง Ao Nang Krabi Thailand',
            imageQuery: 'อ่าวนาง Ao Nang Krabi Thailand'
        },
        'krabi-railay-beach': {
            label: '라일레이 해변',
            mapQuery: 'หาดไร่เลย์ Railay Beach Krabi Thailand',
            imageQuery: 'หาดไร่เลย์ Railay Beach Krabi Thailand'
        },
        'krabi-phi-phi': {
            label: '피피섬',
            mapQuery: 'หมู่เกาะพีพี Phi Phi Islands Krabi Thailand',
            imageQuery: 'หมู่เกาะพีพี Phi Phi Islands Krabi Thailand'
        },
        'krabi-emerald-pool': {
            label: '에메랄드 풀',
            mapQuery: 'สระมรกต Emerald Pool Krabi Thailand',
            imageQuery: 'สระมรกต Emerald Pool Krabi Thailand'
        },
        'krabi-rock-climbing': {
            label: '라일레이 암벽 등반',
            imageQuery: 'ปีนผาไร่เลย์ Railay rock climbing Krabi Thailand'
        },
        'phang-nga-bay': {
            label: '팡아만',
            mapQuery: 'อ่าวพังงา Phang Nga Bay Thailand',
            imageQuery: 'อ่าวพังงา Phang Nga Bay Thailand'
        },
        'phang-nga-james-bond-island': {
            label: '제임스 본드섬',
            mapQuery: 'เกาะตะปู James Bond Island Phang Nga Thailand',
            imageQuery: 'เกาะตะปู James Bond Island Phang Nga Thailand'
        },
        'phang-nga-similan': {
            label: '씨밀란 군도',
            mapQuery: 'หมู่เกาะสิมิลัน Similan Islands Phang Nga Thailand',
            imageQuery: 'หมู่เกาะสิมิลัน Similan Islands Phang Nga Thailand'
        },
        'phang-nga-surin': {
            label: '수린 군도',
            mapQuery: 'หมู่เกาะสุรินทร์ Surin Islands Phang Nga Thailand',
            imageQuery: 'หมู่เกาะสุรินทร์ Surin Islands Phang Nga Thailand'
        },
        'phang-nga-khao-lak': {
            label: '카오락',
            mapQuery: 'เขาหลัก Khao Lak Phang Nga Thailand',
            imageQuery: 'เขาหลัก Khao Lak Phang Nga Thailand'
        }
    }
};
