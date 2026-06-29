(function () {
    const imageBase = "../assets/c13/vocabulary/images/split-variants/full";
    const imageMap = {
        "집들이": `${imageBase}/s04_tl_n01.webp`,
        "돌잔치": `${imageBase}/s04_tr_n02.webp`,
        "송년회": `${imageBase}/s04_bl_n03.webp`,
        "송별회": `${imageBase}/s04_br_n04.webp`,
        "동창회": `${imageBase}/s03_tl_n05.webp`,
        "방을꾸미다": `${imageBase}/s03_tr_n06.webp`,
        "상을차리다": `${imageBase}/s03_bl_n07.webp`,
        "선물을마련하다": `${imageBase}/s03_br_n08.webp`,
        "손님을대접하다": `${imageBase}/s02_tl_n09.webp`,
        "충분하다": `${imageBase}/s02_tr_n10.webp`,
        "모자라다": `${imageBase}/s02_bl_n11.webp`,
        "남다": `${imageBase}/s02_br_n12.webp`,
        "부족하다": `${imageBase}/s01_tl_n13.webp`,
        "옷을차려입다": `${imageBase}/s01_tr_n14.webp`,
        "넥타이를매다": `${imageBase}/s01_bl_n15.webp`,
        "반지를끼다": `${imageBase}/s01_br_n16.webp`,
        "귀고리를하다": `${imageBase}/s05_tl_n17.webp`,
        "시계를차다": `${imageBase}/s05_tr_n18.webp`,
        "가방을들다": `${imageBase}/s05_bl_n19.webp`,
        "배낭을메다": `${imageBase}/s05_br_n20.webp`
    };

    const clueLangs = [
        { code: "en", label: "English" },
        { code: "vi", label: "Tiếng Việt" },
        { code: "mn", label: "Монгол" },
        { code: "ar", label: "العربية" },
        { code: "kk", label: "Қазақша" },
        { code: "th", label: "ไทย" }
    ];

    const hintCopyMap = {
        "집들이": {
            ko: "새 집에 사람들을 초대하는 모임",
            en: "A gathering where people are invited to a new home.",
            vi: "Buổi gặp mặt khi mời mọi người đến nhà mới.",
            mn: "Шинэ гэртээ хүмүүсийг урьж хийдэг уулзалт.",
            ar: "اجتماع يدعى فيه الناس إلى منزل جديد.",
            kk: "Жаңа үйге адамдарды шақырып өткізетін жиын.",
            th: "งานที่เชิญคนมาที่บ้านใหม่."
        },
        "돌잔치": {
            ko: "아이가 한 살 된 것을 기념하는 잔치",
            en: "A celebration for a child's first birthday.",
            vi: "Bữa tiệc kỷ niệm em bé tròn một tuổi.",
            mn: "Хүүхэд нэг нас хүрснийг тэмдэглэдэг баяр.",
            ar: "احتفال ببلوغ الطفل عاما واحدا.",
            kk: "Баланың бір жасқа толуын атап өтетін той.",
            th: "งานฉลองที่เด็กอายุครบหนึ่งขวบ."
        },
        "송년회": {
            ko: "한 해를 마무리하며 함께 모이는 자리",
            en: "A gathering to wrap up the year together.",
            vi: "Buổi gặp mặt để cùng kết thúc một năm.",
            mn: "Жилийг хамтдаа дүгнэж дуусгах уулзалт.",
            ar: "اجتماع يختتم فيه الناس السنة معا.",
            kk: "Жылды бірге қорытындылайтын кездесу.",
            th: "งานพบปะเพื่อปิดท้ายปีด้วยกัน."
        },
        "송별회": {
            ko: "떠나는 사람과 작별 인사를 나누는 모임",
            en: "A gathering to say goodbye to someone who is leaving.",
            vi: "Buổi gặp mặt để chào tạm biệt người sắp rời đi.",
            mn: "Явах гэж буй хүнтэй салах ёс хийх уулзалт.",
            ar: "اجتماع لتوديع شخص سيغادر.",
            kk: "Кететін адаммен қоштасу үшін жиналу.",
            th: "งานพบปะเพื่อบอกลาคนที่จะจากไป."
        },
        "동창회": {
            ko: "같은 학교를 나온 사람들이 다시 만나는 모임",
            en: "A gathering where graduates of the same school meet again.",
            vi: "Buổi gặp lại của những người từng học cùng trường.",
            mn: "Нэг сургуулийг төгссөн хүмүүс дахин уулзах уулзалт.",
            ar: "اجتماع يلتقي فيه خريجو المدرسة نفسها مرة أخرى.",
            kk: "Бір мектепті бітірген адамдар қайта кездесетін жиын.",
            th: "งานที่คนจบจากโรงเรียนเดียวกันกลับมาพบกัน."
        },
        "방을꾸미다": {
            ko: "방을 예쁘게 장식하다",
            en: "To decorate a room so it looks nice.",
            vi: "Trang trí căn phòng cho đẹp.",
            mn: "Өрөөг гоё харагдахаар чимэглэх.",
            ar: "يزين الغرفة لتبدو جميلة.",
            kk: "Бөлмені әдемі етіп безендіру.",
            th: "ตกแต่งห้องให้สวยงาม."
        },
        "상을차리다": {
            ko: "음식을 먹을 수 있게 상을 준비하다",
            en: "To prepare the table so people can eat.",
            vi: "Chuẩn bị bàn ăn để mọi người có thể ăn.",
            mn: "Хүмүүс хооллож болохоор ширээ бэлтгэх.",
            ar: "يجهز المائدة حتى يستطيع الناس الأكل.",
            kk: "Адамдар тамақтана алуы үшін дастарқан дайындау.",
            th: "เตรียมโต๊ะให้พร้อมสำหรับกินอาหาร."
        },
        "선물을마련하다": {
            ko: "필요한 선물을 미리 준비하다",
            en: "To prepare the needed present in advance.",
            vi: "Chuẩn bị trước món quà cần thiết.",
            mn: "Хэрэгтэй бэлгийг урьдчилан бэлтгэх.",
            ar: "يحضر الهدية المطلوبة مسبقا.",
            kk: "Қажет сыйлықты алдын ала дайындау.",
            th: "เตรียมของขวัญที่จำเป็นไว้ล่วงหน้า."
        },
        "손님을대접하다": {
            ko: "손님에게 정성껏 음식을 내고 챙기다",
            en: "To serve guests carefully with food and attention.",
            vi: "Tiếp đãi khách chu đáo bằng đồ ăn và sự quan tâm.",
            mn: "Зочдод хоол өгч, сэтгэлээсээ дайлах.",
            ar: "يقدم الطعام للضيوف ويعتني بهم باهتمام.",
            kk: "Қонақтарға ас ұсынып, ықыласпен күту.",
            th: "ดูแลแขกอย่างตั้งใจและเสิร์ฟอาหารให้."
        },
        "충분하다": {
            ko: "필요한 만큼 넉넉하다",
            en: "To be enough for what is needed.",
            vi: "Có đủ so với mức cần thiết.",
            mn: "Хэрэгтэй хэмжээнд хангалттай байх.",
            ar: "يكون كافيا لما هو مطلوب.",
            kk: "Қажет мөлшерге жеткілікті болу.",
            th: "มีพอสำหรับสิ่งที่ต้องการ."
        },
        "모자라다": {
            ko: "필요한 양보다 적다",
            en: "To be less than the amount needed.",
            vi: "Ít hơn số lượng cần thiết.",
            mn: "Хэрэгтэй хэмжээнээс бага байх.",
            ar: "يكون أقل من الكمية المطلوبة.",
            kk: "Қажет мөлшерден аз болу.",
            th: "มีน้อยกว่าปริมาณที่ต้องการ."
        },
        "남다": {
            ko: "쓰고도 아직 남아 있다",
            en: "To still be left after being used.",
            vi: "Sau khi dùng vẫn còn lại.",
            mn: "Хэрэглэсний дараа ч үлдэх.",
            ar: "يبقى شيء بعد استخدامه.",
            kk: "Пайдаланғаннан кейін де артық қалу.",
            th: "ใช้แล้วก็ยังเหลืออยู่."
        },
        "부족하다": {
            ko: "필요한 만큼 되지 않다",
            en: "To not reach the amount or level needed.",
            vi: "Không đạt đến mức hoặc lượng cần thiết.",
            mn: "Хэрэгтэй хэмжээ эсвэл түвшинд хүрэхгүй байх.",
            ar: "لا يصل إلى القدر أو المستوى المطلوب.",
            kk: "Қажет мөлшерге немесе деңгейге жетпеу.",
            th: "ไม่ถึงปริมาณหรือระดับที่จำเป็น."
        },
        "옷을차려입다": {
            ko: "옷을 단정하고 예쁘게 입다",
            en: "To dress neatly and nicely.",
            vi: "Ăn mặc gọn gàng và đẹp.",
            mn: "Цэвэрхэн, гоё хувцаслах.",
            ar: "يرتدي ملابس مرتبة وجميلة.",
            kk: "Киімді жинақы әрі әдемі кию.",
            th: "แต่งตัวเรียบร้อยและดูดี."
        },
        "넥타이를매다": {
            ko: "목에 넥타이를 묶다",
            en: "To tie a necktie around the neck.",
            vi: "Thắt cà vạt quanh cổ.",
            mn: "Хүзүүндээ зангиа зангидах.",
            ar: "يربط ربطة العنق حول الرقبة.",
            kk: "Мойынға галстук байлау.",
            th: "ผูกเน็กไทรอบคอ."
        },
        "반지를끼다": {
            ko: "손가락에 반지를 끼다",
            en: "To put a ring on a finger.",
            vi: "Đeo nhẫn vào ngón tay.",
            mn: "Хуруундаа бөгж зүүх.",
            ar: "يضع خاتما في الإصبع.",
            kk: "Саусаққа сақина тағу.",
            th: "สวมแหวนที่นิ้ว."
        },
        "귀고리를하다": {
            ko: "귀에 귀고리를 하다",
            en: "To wear earrings on the ears.",
            vi: "Đeo bông tai ở tai.",
            mn: "Чихэндээ ээмэг зүүх.",
            ar: "يرتدي أقراطا في الأذنين.",
            kk: "Құлаққа сырға тағу.",
            th: "ใส่ต่างหูที่หู."
        },
        "시계를차다": {
            ko: "손목에 시계를 차다",
            en: "To wear a watch on the wrist.",
            vi: "Đeo đồng hồ trên cổ tay.",
            mn: "Бугуйндаа цаг зүүх.",
            ar: "يرتدي ساعة على المعصم.",
            kk: "Білекке сағат тағу.",
            th: "ใส่นาฬิกาที่ข้อมือ."
        },
        "가방을들다": {
            ko: "손으로 가방을 들다",
            en: "To carry a bag by hand.",
            vi: "Cầm túi bằng tay.",
            mn: "Цүнхийг гараараа барих.",
            ar: "يحمل حقيبة باليد.",
            kk: "Сөмкені қолмен ұстау.",
            th: "ถือกระเป๋าด้วยมือ."
        },
        "배낭을메다": {
            ko: "어깨에 배낭을 메다",
            en: "To carry a backpack on the shoulders.",
            vi: "Đeo ba lô trên vai.",
            mn: "Үүргэвчийг мөрөндөө үүрэх.",
            ar: "يحمل حقيبة ظهر على الكتفين.",
            kk: "Рюкзакты иыққа асып жүру.",
            th: "สะพายเป้ไว้บนไหล่."
        }
    };

    const sets = [
        {
            id: "set-1",
            title: "모임",
            rows: 7,
            cols: 7,
            words: [
                { id: "reunion", answer: "동창회", row: 0, col: 2, dir: "down" },
                { id: "year-end", answer: "송년회", row: 2, col: 0, dir: "across" },
                { id: "farewell", answer: "송별회", row: 2, col: 0, dir: "down" },
                { id: "bag", answer: "가방을들다", row: 2, col: 4, dir: "down", display: "(가방을) 들다" },
                { id: "housewarming", answer: "집들이", row: 5, col: 3, dir: "across" }
            ]
        },
        {
            id: "set-2",
            title: "상태",
            rows: 6,
            cols: 6,
            words: [
                { id: "lacking", answer: "부족하다", row: 0, col: 2, dir: "down" },
                { id: "remain", answer: "남다", row: 1, col: 3, dir: "down" },
                { id: "enough", answer: "충분하다", row: 2, col: 0, dir: "across" },
                { id: "short", answer: "모자라다", row: 5, col: 0, dir: "across" }
            ]
        },
        {
            id: "set-3",
            title: "준비",
            rows: 9,
            cols: 10,
            words: [
                { id: "set-table", answer: "상을차리다", row: 0, col: 6, dir: "down", display: "(상을) 차리다" },
                { id: "decorate-room", answer: "방을꾸미다", row: 1, col: 5, dir: "across", display: "(방을) 꾸미다" },
                { id: "treat-guest", answer: "손님을대접하다", row: 2, col: 2, dir: "down", display: "(손님을) 대접하다" },
                { id: "prepare-gift", answer: "선물을마련하다", row: 4, col: 0, dir: "across", display: "(선물을) 마련하다" }
            ]
        },
        {
            id: "set-4",
            title: "차림",
            rows: 7,
            cols: 7,
            words: [
                { id: "wear-backpack", answer: "배낭을메다", row: 0, col: 5, dir: "down", display: "(배낭을) 메다" },
                { id: "wear-watch", answer: "시계를차다", row: 2, col: 3, dir: "down", display: "(시계를) 차다" },
                { id: "wear-tie", answer: "넥타이를매다", row: 4, col: 0, dir: "across", display: "(넥타이를) 매다" },
                { id: "dress-up", answer: "옷을차려입다", row: 5, col: 1, dir: "across", display: "(옷을) 차려입다" }
            ]
        },
        {
            id: "set-5",
            title: "잔치",
            rows: 6,
            cols: 6,
            words: [
                { id: "first-birthday", answer: "돌잔치", row: 0, col: 0, dir: "across" },
                { id: "ring", answer: "반지를끼다", row: 1, col: 3, dir: "down", display: "(반지를) 끼다" },
                { id: "earrings", answer: "귀고리를하다", row: 3, col: 0, dir: "across", display: "(귀고리를) 하다" }
            ]
        }
    ];

    const dom = {
        body: document.body,
        setTabs: document.getElementById("set-tabs"),
        modeButtons: Array.from(document.querySelectorAll(".mode-btn")),
        grid: document.getElementById("crossword-grid"),
        activeMeta: document.getElementById("active-clue-meta"),
        activeText: document.getElementById("active-clue-text"),
        clueTranslations: Object.fromEntries(
            clueLangs.map(({ code }) => [code, document.getElementById(`active-clue-${code}`)])
        ),
        activeImage: document.getElementById("active-clue-image"),
        bankSelection: document.getElementById("bank-selection"),
        wordTrack: document.getElementById("word-track"),
        wordTrackLabel: document.getElementById("word-track-label"),
        wordTrackHint: document.getElementById("word-track-hint"),
        letterBank: document.getElementById("letter-bank"),
        mobileOverlay: document.getElementById("mobile-overlay"),
        mobileClueToggle: document.getElementById("mobile-clue-toggle"),
        mobileClueMeta: document.getElementById("mobile-clue-meta"),
        mobileBankToggle: document.getElementById("mobile-bank-toggle"),
        mobileBankMeta: document.getElementById("mobile-bank-meta"),
        mobileClueClose: document.getElementById("mobile-clue-close"),
        mobileBankClose: document.getElementById("mobile-bank-close")
    };

    const mobileQuery = window.matchMedia("(max-width: 640px)");

    const state = {
        currentSetIndex: 0,
        imageMode: "normal",
        selectedTileId: "",
        wordCursorIndex: -1,
        openSheet: "",
        touchDrag: null,
        ignoreNextTileClick: false,
        feedbackOverride: "",
        feedbackTone: ""
    };

    function currentSet() {
        return preparedSets[state.currentSetIndex];
    }

    function activeWord() {
        return currentSet().wordsById.get(currentSet().activeWordId);
    }

    function isMobileLayout() {
        return mobileQuery.matches;
    }

    function cellKey(row, col) {
        return `${row}-${col}`;
    }

    function getTileById(set, tileId) {
        return set.letterBank.find((tile) => tile.id === tileId) || null;
    }

    function selectedTile() {
        return getTileById(currentSet(), state.selectedTileId);
    }

    function modeFolder() {
        return state.imageMode === "easy" ? "/initials/" : "/masked/";
    }

    function clueImageFor(word) {
        return imageMap[word.answer].replace("/full/", modeFolder());
    }

    function wordLabel(word) {
        return `${word.dir === "across" ? "가로" : "세로"} ${word.number}번`;
    }

    function displayAnswer(word) {
        return word.display || word.answer;
    }

    function clearFeedbackOverride() {
        state.feedbackOverride = "";
        state.feedbackTone = "";
    }

    function showPlacementError(row, col, tileId, wordIndex = -1) {
        state.feedbackOverride = "아니에요. 맞는 글자를 넣어 보세요.";
        state.feedbackTone = "error";
        flashTile(tileId, "is-wrong-flash");
        flashCell(row, col, "is-wrong-flash", 620);
        if (wordIndex >= 0) {
            flashWordSlot(wordIndex, "is-wrong-flash", 620);
        }
        updateBankSelection();
        flashElement(dom.bankSelection, "is-error-flash", 700);
    }

    function tryPlaceTileAt(row, col, tileId, options = {}) {
        const set = currentSet();
        const cell = set.cells[row]?.[col];
        const tile = getTileById(set, tileId);
        if (!cell || !tile || tile.used) {
            return false;
        }

        const activeEntry = cell.entries.find((entry) => entry.wordId === set.activeWordId) || null;
        if (tile.letter !== cell.solution) {
            showPlacementError(row, col, tile.id, activeEntry?.index ?? -1);
            return false;
        }

        return placeTileAt(row, col, tile.id, options);
    }

    function tryPlaceTileInWordSlot(index, tileId, options = {}) {
        const set = currentSet();
        const word = activeWord();
        const tile = getTileById(set, tileId);
        if (!word || !tile || tile.used || index < 0 || index >= word.cells.length) {
            return false;
        }

        const target = wordCellState(set, word, index);
        state.wordCursorIndex = index;

        if (tile.letter !== target.solution) {
            showPlacementError(target.row, target.col, tile.id, target.index);
            return false;
        }

        return placeTileAt(target.row, target.col, tile.id, {
            ...options,
            source: options.source || "word-track-drag"
        });
    }

    function setWordValue(set, word) {
        return word.cells.map(({ row, col }) => set.cells[row][col].value || "").join("");
    }

    function wordCellState(set, word, index) {
        const { row, col } = word.cells[index];
        const cell = set.cells[row][col];
        return {
            index,
            row,
            col,
            cell,
            value: cell.value,
            solution: word.answer[index],
            isCorrect: cell.value === word.answer[index]
        };
    }

    function findFirstMismatchIndex(set, word) {
        for (let index = 0; index < word.cells.length; index += 1) {
            if (!wordCellState(set, word, index).isCorrect) {
                return index;
            }
        }
        return -1;
    }

    function syncWordCursor() {
        const set = currentSet();
        const word = activeWord();
        if (!word) {
            state.wordCursorIndex = -1;
            return -1;
        }

        const mismatchIndex = findFirstMismatchIndex(set, word);
        const preferredIndex = state.wordCursorIndex;
        const hasPreferred = preferredIndex >= 0 && preferredIndex < word.cells.length;

        if (hasPreferred) {
            if (mismatchIndex === -1) {
                return preferredIndex;
            }

            const preferredCell = wordCellState(set, word, preferredIndex);
            if (!preferredCell.isCorrect) {
                return preferredIndex;
            }
        }

        state.wordCursorIndex = mismatchIndex;
        return state.wordCursorIndex;
    }

    function remainingSlotCount(set, word) {
        return word.cells.reduce((count, _, index) => {
            return count + (wordCellState(set, word, index).isCorrect ? 0 : 1);
        }, 0);
    }

    function createLetterBank(setId, cells) {
        const counts = new Map();
        cells.forEach((row) => {
            row.forEach((cell) => {
                if (!cell) {
                    return;
                }
                counts.set(cell.solution, (counts.get(cell.solution) || 0) + 1);
            });
        });

        const letters = Array.from(counts.keys()).sort((left, right) => left.localeCompare(right, "ko"));
        const tiles = [];
        let index = 1;

        letters.forEach((letter) => {
            for (let repeat = 0; repeat < counts.get(letter); repeat += 1) {
                tiles.push({
                    id: `${setId}-tile-${index}`,
                    letter,
                    used: false,
                    cellKey: ""
                });
                index += 1;
            }
        });

        return tiles;
    }

    function createSetState(set) {
        const cells = Array.from({ length: set.rows }, () => Array.from({ length: set.cols }, () => null));

        set.words.forEach((word) => {
            word.cells = [];
            for (let index = 0; index < word.answer.length; index += 1) {
                const row = word.row + (word.dir === "down" ? index : 0);
                const col = word.col + (word.dir === "across" ? index : 0);
                const solution = word.answer[index];

                if (!cells[row][col]) {
                    cells[row][col] = {
                        row,
                        col,
                        solution,
                        value: "",
                        tileId: "",
                        entries: []
                    };
                }

                if (cells[row][col].solution !== solution) {
                    throw new Error(`Crossword collision in ${set.id} at ${row},${col}`);
                }

                cells[row][col].entries.push({ wordId: word.id, index });
                word.cells.push({ row, col });
            }
        });

        let nextNumber = 1;
        for (let row = 0; row < set.rows; row += 1) {
            for (let col = 0; col < set.cols; col += 1) {
                const starters = set.words.filter((word) => word.row === row && word.col === col);
                if (!starters.length) {
                    continue;
                }
                starters.forEach((word) => {
                    word.number = nextNumber;
                });
                nextNumber += 1;
            }
        }

        return {
            ...set,
            cells,
            wordsById: new Map(set.words.map((word) => [word.id, word])),
            solvedWords: new Set(),
            letterBank: createLetterBank(set.id, cells),
            activeWordId: set.words[0].id
        };
    }

    const preparedSets = sets.map(createSetState);

    function syncBodySheetState() {
        const clueOpen = state.openSheet === "clue" && isMobileLayout();
        const bankOpen = state.openSheet === "bank" && isMobileLayout();
        const anyOpen = clueOpen || bankOpen;

        dom.body.classList.toggle("is-clue-open", clueOpen);
        dom.body.classList.toggle("is-bank-open", bankOpen);
        dom.body.classList.toggle("is-sheet-open", anyOpen);
        dom.mobileOverlay.setAttribute("aria-hidden", anyOpen ? "false" : "true");
    }

    function closeMobileSheet() {
        state.openSheet = "";
        syncBodySheetState();
    }

    function openMobileSheet(type) {
        if (!isMobileLayout()) {
            return;
        }
        state.openSheet = type;
        syncBodySheetState();
    }

    function toggleMobileSheet(type) {
        if (!isMobileLayout()) {
            return;
        }
        state.openSheet = state.openSheet === type ? "" : type;
        syncBodySheetState();
    }

    function flashElement(element, className, duration = 320) {
        if (!element) {
            return;
        }
        element.classList.remove(className);
        void element.offsetWidth;
        element.classList.add(className);
        window.setTimeout(() => {
            element.classList.remove(className);
        }, duration);
    }

    function flashTile(tileId, className) {
        const tile = dom.letterBank.querySelector(`[data-tile-id="${tileId}"]`);
        flashElement(tile, className);
    }

    function flashCell(row, col, className, duration) {
        const cell = dom.grid.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        flashElement(cell, className, duration);
    }

    function flashWordSlot(index, className, duration = 360) {
        const slot = dom.wordTrack.querySelector(`[data-word-index="${index}"]`);
        flashElement(slot, className, duration);
    }

    function flashWordTrack(className, duration = 560) {
        flashElement(dom.wordTrack, className, duration);
    }

    function syncSelectedTileState() {
        dom.letterBank.querySelectorAll("[data-tile-id]").forEach((tileButton) => {
            tileButton.classList.toggle("is-selected", tileButton.dataset.tileId === state.selectedTileId);
        });
        updateBankSelection();
    }

    function setSelectedTile(tileId, animate = false) {
        state.selectedTileId = tileId || "";
        syncSelectedTileState();
        if (animate && state.selectedTileId) {
            flashTile(state.selectedTileId, "is-pick-flash");
        }
    }

    function renderTabs() {
        dom.setTabs.innerHTML = preparedSets.map((set, index) => `
            <button class="set-tab ${index === state.currentSetIndex ? "is-active" : ""}" type="button" data-set-index="${index}">
                ${index + 1}. ${set.title}
            </button>
        `).join("");
    }

    function renderModeButtons() {
        dom.modeButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.mode === state.imageMode);
        });
    }

    function renderLetterBank() {
        const set = currentSet();
        dom.letterBank.innerHTML = set.letterBank.map((tile) => `
            <button
                class="letter-tile ${tile.used ? "is-used" : ""} ${tile.id === state.selectedTileId ? "is-selected" : ""}"
                type="button"
                data-tile-id="${tile.id}"
                data-letter="${tile.letter}"
                draggable="${tile.used ? "false" : "true"}"
                ${tile.used ? "disabled" : ""}
                aria-label="${tile.letter} 글자"
            >${tile.letter}</button>
        `).join("");
    }

    function renderBoard() {
        const set = currentSet();
        const word = activeWord();
        const activeCoords = new Set(word.cells.map((cell) => cellKey(cell.row, cell.col)));

        dom.grid.style.gridTemplateColumns = `repeat(${set.cols}, minmax(0, 1fr))`;
        dom.grid.innerHTML = "";

        for (let row = 0; row < set.rows; row += 1) {
            for (let col = 0; col < set.cols; col += 1) {
                const cell = set.cells[row][col];

                if (!cell) {
                    const block = document.createElement("div");
                    block.className = "grid-cell is-block";
                    dom.grid.appendChild(block);
                    continue;
                }

                const wrapper = document.createElement("button");
                wrapper.type = "button";
                wrapper.className = [
                    "grid-cell",
                    activeCoords.has(cellKey(row, col)) ? "is-active" : "",
                    cell.entries.length > 1 ? "is-cross" : "",
                    cell.value ? "is-filled" : "",
                    cell.entries.every((entry) => set.solvedWords.has(entry.wordId)) ? "is-solved" : ""
                ].filter(Boolean).join(" ");
                wrapper.dataset.row = String(row);
                wrapper.dataset.col = String(col);
                wrapper.setAttribute("aria-label", `${row + 1}행 ${col + 1}열`);

                const starter = set.words.find((item) => item.row === row && item.col === col);
                if (starter) {
                    const number = document.createElement("span");
                    number.className = "grid-cell__number";
                    number.textContent = String(starter.number);
                    wrapper.appendChild(number);
                }

                const value = document.createElement("span");
                value.className = "grid-cell__value";
                value.textContent = cell.value;
                wrapper.appendChild(value);

                wrapper.addEventListener("click", (event) => {
                    handleCellActivate(row, col, event);
                });

                wrapper.addEventListener("dragover", (event) => {
                    event.preventDefault();
                    wrapper.classList.add("is-drop");
                });

                wrapper.addEventListener("dragleave", () => {
                    wrapper.classList.remove("is-drop");
                });

                wrapper.addEventListener("drop", (event) => {
                    event.preventDefault();
                    wrapper.classList.remove("is-drop");
                    const tileId =
                        event.dataTransfer?.getData("application/x-crossword-tile") ||
                        event.dataTransfer?.getData("text/plain") ||
                        "";
                    if (!tileId) {
                        return;
                    }
                    tryPlaceTileAt(row, col, tileId, { source: "drag" });
                });

                dom.grid.appendChild(wrapper);
            }
        }
    }

    function updateActiveClue() {
        const word = activeWord();
        const hint = hintCopyMap[word.answer];
        dom.activeMeta.textContent = `${wordLabel(word)} · ${word.answer.length}칸 · ${state.imageMode === "easy" ? "초성" : "마스킹"}`;
        dom.activeText.textContent = `한글: ${hint.ko}`;
        clueLangs.forEach(({ code, label }) => {
            const element = dom.clueTranslations[code];
            if (element) {
                element.textContent = `${label}: ${hint[code] || hint.ko}`;
            }
        });
        dom.activeImage.src = clueImageFor(word);
        dom.activeImage.alt = `${displayAnswer(word)} 단서 그림`;
        updateMobileDock();
    }

    function releaseTile(tileId) {
        const set = currentSet();
        const tile = getTileById(set, tileId);
        if (!tile) {
            return;
        }
        tile.used = false;
        tile.cellKey = "";
    }

    function findDropTargetAt(x, y) {
        const element = document.elementFromPoint(x, y);
        if (!element) {
            return null;
        }
        return element.closest(".grid-cell:not(.is-block), .word-track__slot");
    }

    function clearTouchDropTarget() {
        if (!state.touchDrag || !state.touchDrag.dropTarget) {
            return;
        }
        state.touchDrag.dropTarget.classList.remove("is-drop");
        state.touchDrag.dropTarget = null;
    }

    function ensureTouchGhost(letter) {
        const ghost = document.createElement("div");
        ghost.className = "letter-drag-ghost";
        ghost.textContent = letter;
        document.body.appendChild(ghost);
        return ghost;
    }

    function beginTouchTileDrag(tileId, x, y) {
        if (!state.touchDrag) {
            return;
        }

        const tile = getTileById(currentSet(), tileId);
        if (!tile || tile.used) {
            return;
        }

        state.touchDrag.started = true;
        state.touchDrag.ghost = ensureTouchGhost(tile.letter);
        setSelectedTile(tileId, false);
        dom.body.classList.add("is-dragging-letter");
        moveTouchTileDrag(x, y);
    }

    function moveTouchTileDrag(x, y) {
        if (!state.touchDrag || !state.touchDrag.started || !state.touchDrag.ghost) {
            return;
        }

        state.touchDrag.ghost.style.left = `${x}px`;
        state.touchDrag.ghost.style.top = `${y}px`;

        const target = findDropTargetAt(x, y);
        if (target === state.touchDrag.dropTarget) {
            return;
        }

        clearTouchDropTarget();
        if (target) {
            target.classList.add("is-drop");
            state.touchDrag.dropTarget = target;
        }
    }

    function finishTouchTileDrag(x, y) {
        if (!state.touchDrag || !state.touchDrag.started) {
            cleanupTouchDrag();
            return false;
        }

        moveTouchTileDrag(x, y);
        const target = state.touchDrag.dropTarget;
        const tileId = state.touchDrag.tileId;
        cleanupTouchDrag();

        if (!target) {
            return false;
        }

        if (target.matches(".word-track__slot")) {
            tryPlaceTileInWordSlot(Number(target.dataset.wordIndex), tileId, {
                keepSheetOpen: isMobileLayout() && state.openSheet === "bank",
                source: "touch-word-track"
            });
            return true;
        }

        const row = Number(target.dataset.row);
        const col = Number(target.dataset.col);
        tryPlaceTileAt(row, col, tileId, { source: "touch-board" });
        return true;
    }

    function renderWordTrack() {
        const set = currentSet();
        const word = activeWord();
        if (!word) {
            dom.wordTrack.innerHTML = "";
            return;
        }

        const cursorIndex = syncWordCursor();
        const solved = set.solvedWords.has(word.id);
        dom.wordTrack.innerHTML = word.cells.map((_, index) => {
            const info = wordCellState(set, word, index);
            return `
                <button
                    class="word-track__slot ${info.value ? "is-filled" : ""} ${info.isCorrect ? "is-correct" : ""} ${solved ? "is-solved" : ""} ${index === cursorIndex ? "is-active" : ""}"
                    type="button"
                    data-word-index="${index}"
                    aria-label="${index + 1}번째 글자"
                >${info.value || ""}</button>
            `;
        }).join("");
    }

    function syncWordTrackUI() {
        renderWordTrack();
        updateBankSelection();
    }

    function updateMobileDock() {
        const word = activeWord();
        const tile = selectedTile();
        dom.mobileClueMeta.textContent = word ? wordLabel(word) : "현재 낱말 보기";

        if (!word) {
            dom.mobileBankMeta.textContent = "글자 고르기";
            return;
        }

        if (tile) {
            dom.mobileBankMeta.textContent = `끌기: ${tile.letter}`;
            return;
        }

        const remaining = remainingSlotCount(currentSet(), word);
        dom.mobileBankMeta.textContent = remaining ? `남은 칸 ${remaining}` : "완성";
    }

    function updateBankSelection() {
        const set = currentSet();
        const word = activeWord();
        if (!word) {
            dom.wordTrackLabel.textContent = "";
            dom.wordTrackHint.textContent = "";
            updateMobileDock();
            return;
        }

        const remaining = remainingSlotCount(set, word);
        const cursorIndex = syncWordCursor();
        const particleNote = /[을를]/.test(word.answer) ? " · 조사 포함" : "";
        dom.wordTrackLabel.textContent = `${wordLabel(word)} 입력${particleNote}`;

        if (state.feedbackOverride) {
            dom.wordTrackHint.textContent = state.feedbackOverride;
        } else if (!remaining) {
            dom.wordTrackHint.textContent = `${displayAnswer(word)} 완성! 다른 낱말도 골라 보세요.`;
        } else if (cursorIndex >= 0) {
            dom.wordTrackHint.textContent = `${cursorIndex + 1}번째 칸부터 이어서 눌러 보세요.`;
        } else {
            dom.wordTrackHint.textContent = "글자를 이어서 눌러 채워 보세요.";
        }

        dom.bankSelection.classList.toggle("is-error", state.feedbackTone === "error");
        updateMobileDock();
    }

    function refreshSolvedWords(set) {
        set.solvedWords.clear();

        set.words.forEach((word) => {
            if (setWordValue(set, word) === word.answer) {
                set.solvedWords.add(word.id);
            }
        });

        if (!set.activeWordId) {
            set.activeWordId = set.words[0].id;
        }
    }

    function cleanupTouchDrag() {
        clearTouchDropTarget();
        if (state.touchDrag && state.touchDrag.ghost) {
            state.touchDrag.ghost.remove();
        }
        dom.body.classList.remove("is-dragging-letter");
        state.touchDrag = null;
        setSelectedTile("");
    }

    function celebrateSolvedWord(word) {
        if (!word) {
            return;
        }

        flashWordTrack("is-complete");
        word.cells.forEach(({ row, col }) => {
            flashCell(row, col, "is-filled-flash");
        });
    }

    function placeTileAt(row, col, tileId, options = {}) {
        const { keepSheetOpen = false, source = "board" } = options;
        const set = currentSet();
        const cell = set.cells[row][col];
        const tile = getTileById(set, tileId);
        if (!cell || !tile || tile.used) {
            return false;
        }

        const activeWordId = set.activeWordId;
        const wasSolved = activeWordId ? set.solvedWords.has(activeWordId) : false;
        const activeEntry = cell.entries.find((entry) => entry.wordId === activeWordId) || null;

        clearFeedbackOverride();

        if (cell.tileId) {
            releaseTile(cell.tileId);
        }

        cell.tileId = tile.id;
        cell.value = tile.letter;
        tile.used = true;
        tile.cellKey = cellKey(row, col);
        setSelectedTile("");

        if (activeEntry) {
            state.wordCursorIndex = activeEntry.index + 1;
        }

        refreshSolvedWords(set);
        renderBoard();
        renderLetterBank();
        syncSelectedTileState();
        updateActiveClue();
        syncWordTrackUI();
        flashCell(row, col, "is-filled-flash");
        flashTile(tile.id, source === "bank-sequence" ? "is-correct-flash" : "is-place-flash");

        if (activeEntry && source === "bank-sequence") {
            flashWordSlot(activeEntry.index, "is-correct-flash");
        }

        if (activeWordId && set.solvedWords.has(activeWordId) && !wasSolved) {
            celebrateSolvedWord(set.wordsById.get(activeWordId));
        }

        if (!keepSheetOpen) {
            closeMobileSheet();
        }

        return true;
    }

    function selectWord(wordId, cursorIndex = -1) {
        const set = currentSet();
        clearFeedbackOverride();
        set.activeWordId = wordId;
        state.wordCursorIndex = cursorIndex;
        updateActiveClue();
        renderBoard();
        syncWordTrackUI();
    }

    function handleCellActivate(row, col, event) {
        const set = currentSet();
        const cell = set.cells[row][col];
        if (!cell) {
            return;
        }

        const candidate = cell.entries.find((entry) => entry.wordId === set.activeWordId) || cell.entries[0];
        event.preventDefault();

        if (state.selectedTileId) {
            tryPlaceTileAt(row, col, state.selectedTileId, { source: "click-board" });
            return;
        }

        selectWord(candidate.wordId, candidate.index);

        if (isMobileLayout()) {
            openMobileSheet("bank");
        }
    }

    function attemptActiveWordTile(tileId) {
        const set = currentSet();
        const word = activeWord();
        const tile = getTileById(set, tileId);

        if (!word || !tile || tile.used) {
            return false;
        }

        const targetIndex = syncWordCursor();
        if (targetIndex < 0) {
            flashWordTrack("is-complete");
            return false;
        }

        const target = wordCellState(set, word, targetIndex);
        if (tile.letter !== target.solution) {
            showPlacementError(target.row, target.col, tile.id, target.index);
            return false;
        }

        return placeTileAt(target.row, target.col, tile.id, {
            keepSheetOpen: isMobileLayout() && state.openSheet === "bank",
            source: "bank-sequence"
        });
    }

    function renderSet() {
        clearFeedbackOverride();
        state.wordCursorIndex = -1;
        renderTabs();
        renderModeButtons();
        renderLetterBank();
        updateActiveClue();
        renderBoard();
        syncWordTrackUI();
        syncSelectedTileState();
    }

    dom.setTabs.addEventListener("click", (event) => {
        const button = event.target.closest("[data-set-index]");
        if (!button) {
            return;
        }

        state.currentSetIndex = Number(button.dataset.setIndex);
        state.selectedTileId = "";
        closeMobileSheet();
        renderSet();
    });

    dom.modeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (button.dataset.mode === state.imageMode) {
                return;
            }
            state.imageMode = button.dataset.mode;
            renderModeButtons();
            updateActiveClue();
        });
    });

    dom.letterBank.addEventListener("click", (event) => {
        const tileButton = event.target.closest("[data-tile-id]");
        if (!tileButton || tileButton.disabled) {
            return;
        }

        if (state.ignoreNextTileClick) {
            state.ignoreNextTileClick = false;
            return;
        }

        const tileId = tileButton.dataset.tileId;
        const nextTileId = state.selectedTileId === tileId ? "" : tileId;
        setSelectedTile(nextTileId, Boolean(nextTileId));

        if (isMobileLayout() && nextTileId) {
            closeMobileSheet();
        }
    });

    dom.letterBank.addEventListener("dragstart", (event) => {
        const tileButton = event.target.closest("[data-tile-id]");
        if (!tileButton || tileButton.disabled || !event.dataTransfer) {
            return;
        }

        const tileId = tileButton.dataset.tileId;
        setSelectedTile(tileId, true);
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("application/x-crossword-tile", tileId);
        event.dataTransfer.setData("text/plain", tileId);
    });

    dom.letterBank.addEventListener("touchstart", (event) => {
        const tileButton = event.target.closest("[data-tile-id]");
        if (!tileButton || tileButton.disabled || event.touches.length !== 1) {
            return;
        }

        state.ignoreNextTileClick = true;
        const touch = event.touches[0];
        state.touchDrag = {
            tileId: tileButton.dataset.tileId,
            startX: touch.clientX,
            startY: touch.clientY,
            started: false,
            ghost: null,
            dropTarget: null
        };
    }, { passive: true });

    dom.letterBank.addEventListener("touchmove", (event) => {
        if (!state.touchDrag || event.touches.length !== 1) {
            return;
        }

        const touch = event.touches[0];
        const dx = touch.clientX - state.touchDrag.startX;
        const dy = touch.clientY - state.touchDrag.startY;
        if (!state.touchDrag.started && Math.hypot(dx, dy) < 8) {
            return;
        }

        event.preventDefault();
        if (!state.touchDrag.started) {
            beginTouchTileDrag(state.touchDrag.tileId, touch.clientX, touch.clientY);
        } else {
            moveTouchTileDrag(touch.clientX, touch.clientY);
        }
    }, { passive: false });

    dom.letterBank.addEventListener("touchend", (event) => {
        if (!state.touchDrag) {
            return;
        }

        const touch = event.changedTouches[0];
        if (state.touchDrag.started) {
            event.preventDefault();
            finishTouchTileDrag(touch.clientX, touch.clientY);
            return;
        }

        const tileId = state.touchDrag.tileId;
        cleanupTouchDrag();
        const nextTileId = state.selectedTileId === tileId ? "" : tileId;
        setSelectedTile(nextTileId, Boolean(nextTileId));
        if (isMobileLayout() && nextTileId) {
            closeMobileSheet();
        }
    }, { passive: false });

    dom.letterBank.addEventListener("touchcancel", () => {
        cleanupTouchDrag();
    });

    dom.wordTrack.addEventListener("click", (event) => {
        const slot = event.target.closest("[data-word-index]");
        if (!slot) {
            return;
        }

        state.wordCursorIndex = Number(slot.dataset.wordIndex);

        if (state.selectedTileId) {
            tryPlaceTileInWordSlot(state.wordCursorIndex, state.selectedTileId, { source: "click-word-track" });
            return;
        }

        syncWordTrackUI();

        if (isMobileLayout()) {
            openMobileSheet("bank");
        }
    });

    dom.wordTrack.addEventListener("dragover", (event) => {
        const slot = event.target.closest("[data-word-index]");
        if (!slot) {
            return;
        }
        event.preventDefault();
        slot.classList.add("is-drop");
    });

    dom.wordTrack.addEventListener("dragleave", (event) => {
        const slot = event.target.closest("[data-word-index]");
        if (slot) {
            slot.classList.remove("is-drop");
        }
    });

    dom.wordTrack.addEventListener("drop", (event) => {
        const slot = event.target.closest("[data-word-index]");
        if (!slot) {
            return;
        }

        event.preventDefault();
        slot.classList.remove("is-drop");
        const tileId =
            event.dataTransfer?.getData("application/x-crossword-tile") ||
            event.dataTransfer?.getData("text/plain") ||
            "";
        if (!tileId) {
            return;
        }
        tryPlaceTileInWordSlot(Number(slot.dataset.wordIndex), tileId, { source: "word-track-drag" });
    });

    dom.letterBank.addEventListener("click", (event) => {
        const tileButton = event.target.closest("[data-tile-id]");
        if (!tileButton || tileButton.disabled) {
            return;
        }

        if (state.ignoreNextTileClick) {
            state.ignoreNextTileClick = false;
            event.preventDefault();
            event.stopImmediatePropagation();
            return;
        }

        event.preventDefault();
        event.stopImmediatePropagation();
        attemptActiveWordTile(tileButton.dataset.tileId);
    }, true);

    dom.letterBank.addEventListener("touchend", (event) => {
        if (!state.touchDrag || state.touchDrag.started) {
            return;
        }

        const tileButton = event.target.closest("[data-tile-id]");
        if (!tileButton || tileButton.disabled) {
            return;
        }

        const tileId = state.touchDrag.tileId || tileButton.dataset.tileId;
        event.preventDefault();
        event.stopImmediatePropagation();
        cleanupTouchDrag();
        state.ignoreNextTileClick = false;
        attemptActiveWordTile(tileId);
    }, { capture: true, passive: false });

    dom.letterBank.addEventListener("dragend", () => {
        dom.grid.querySelectorAll(".is-drop").forEach((element) => element.classList.remove("is-drop"));
        dom.wordTrack.querySelectorAll(".is-drop").forEach((element) => element.classList.remove("is-drop"));
        setSelectedTile("");
    });

    dom.mobileClueToggle.addEventListener("click", () => {
        toggleMobileSheet("clue");
    });

    dom.mobileBankToggle.addEventListener("click", () => {
        toggleMobileSheet("bank");
    });

    dom.mobileOverlay.addEventListener("click", closeMobileSheet);
    dom.mobileClueClose.addEventListener("click", closeMobileSheet);
    dom.mobileBankClose.addEventListener("click", closeMobileSheet);

    const handleViewportChange = () => {
        if (!isMobileLayout()) {
            closeMobileSheet();
        }
        updateMobileDock();
    };

    if (typeof mobileQuery.addEventListener === "function") {
        mobileQuery.addEventListener("change", handleViewportChange);
    } else if (typeof mobileQuery.addListener === "function") {
        mobileQuery.addListener(handleViewportChange);
    }

    renderSet();
})();
