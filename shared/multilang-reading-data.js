(function () {
    "use strict";

    window.MULTILANG_PAGE_DATA = window.MULTILANG_PAGE_DATA || {};
    const data = window.MULTILANG_PAGE_DATA;

    const readings = {
        "c10/reading.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the Korean text as an advice column. Focus on the writer's opinion, the problem being discussed, and the advice given.",
                    points: [
                        "Do not translate every sentence before reading.",
                        "First find who has the problem and what the main concern is.",
                        "Use the support note only to understand the task direction."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc bai tieng Han nhu mot bai tu van. Tap trung vao van de, y kien cua nguoi viet va loi khuyen.",
                    points: [
                        "Dung dich tung cau truoc khi doc.",
                        "Truoc het hay tim ai dang gap van de va van de chinh la gi.",
                        "Chi dung ghi chu ho tro de hieu yeu cau hoat dong."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ النص الكوري كأنه عمود نصائح. ركز على المشكلة ورأي الكاتب والنصيحة.",
                    points: [
                        "لا تترجم كل جملة قبل القراءة.",
                        "ابحث أولا عمن لديه المشكلة وما القلق الرئيسي.",
                        "استخدم الملاحظة لفهم اتجاه النشاط فقط."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Солонгос эхийг зөвлөгөөний нийтлэл гэж уншаарай. Асуудал, зохиогчийн санаа, зөвлөгөөг олно.",
                    points: [
                        "Уншихаасаа өмнө өгүүлбэр бүрийг орчуулах хэрэггүй.",
                        "Эхлээд хэнд ямар асуудал байгааг ол.",
                        "Тусламжийн тэмдэглэл нь зөвхөн даалгаврын чиглэлийг ойлгоход зориулагдсан."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Корей мәтінін кеңес бағаны ретінде оқыңыз. Мәселе, автор пікірі және кеңесті табыңыз.",
                    points: [
                        "Оқымай тұрып әр сөйлемді аудармаңыз.",
                        "Алдымен кімде қандай мәселе бар екенін анықтаңыз.",
                        "Көмек жазбасы тек тапсырма бағытын түсінуге арналған."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านบทความเกาหลีเหมือนคอลัมน์ให้คำปรึกษา ให้หาปัญหา ความเห็นของผู้เขียน และคำแนะนำ",
                    points: [
                        "อย่าแปลทุกประโยคก่อนอ่าน",
                        "ก่อนอื่นให้หาใครมีปัญหาและปัญหาหลักคืออะไร",
                        "ใช้คำช่วยนี้เพื่อเข้าใจทิศทางของกิจกรรมเท่านั้น"
                    ]
                }
            }
        },
        "c11/reading.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the text as practical advice about success at work. Track the main advice and the reasons behind it.",
                    points: [
                        "Look for repeated keywords related to workplace life and attitude.",
                        "Separate examples from the writer's main claim.",
                        "Use the questions to check the structure of the text."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc bai nhu loi khuyen ve thanh cong o noi lam viec. Tim loi khuyen chinh va ly do.",
                    points: [
                        "Tim tu khoa lap lai ve cong viec va thai do.",
                        "Tach vi du ra khoi y kien chinh cua nguoi viet.",
                        "Dung cau hoi de kiem tra cau truc bai doc."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ النص كنص نصائح عملية عن النجاح في العمل. اتبع النصيحة الرئيسية وأسبابها.",
                    points: [
                        "ابحث عن الكلمات المتكررة حول العمل والموقف.",
                        "افصل الأمثلة عن الفكرة الرئيسية للكاتب.",
                        "استعمل الأسئلة لفهم بنية النص."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Ажил дээр амжилт гаргах тухай практик зөвлөгөө гэж уншаарай. Гол зөвлөгөө ба шалтгааныг дагана.",
                    points: [
                        "Ажил, хандлагатай холбоотой давтагдах үгийг ол.",
                        "Жишээг зохиогчийн гол санаанаас ялга.",
                        "Асуултуудыг ашиглан эхийн бүтцийг шалга."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Мәтінді жұмыста табысқа жету туралы практикалық кеңес ретінде оқыңыз. Негізгі кеңес пен себебін қадағалаңыз.",
                    points: [
                        "Жұмыс пен көзқарасқа қатысты қайталанатын сөздерді іздеңіз.",
                        "Мысалдарды автордың негізгі ойынан ажыратыңыз.",
                        "Сұрақтарды мәтін құрылымын тексеруге пайдаланыңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านบทความเป็นคำแนะนำเรื่องความสำเร็จในที่ทำงาน ให้ตามหาคำแนะนำหลักและเหตุผล",
                    points: [
                        "หาคำสำคัญที่ซ้ำเกี่ยวกับงานและทัศนคติ",
                        "แยกตัวอย่างออกจากความคิดหลักของผู้เขียน",
                        "ใช้คำถามเพื่อตรวจโครงสร้างของบทอ่าน"
                    ]
                }
            }
        },
        "c12/reading.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the health text by finding symptoms, causes, and recommended habits related to neck health.",
                    points: [
                        "Mark health problem words before answering questions.",
                        "Connect each recommendation with the reason given in the text.",
                        "Avoid translating every medical phrase; focus on what action is recommended."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc bai suc khoe bang cach tim trieu chung, nguyen nhan va thoi quen duoc khuyen.",
                    points: [
                        "Danh dau tu ve van de suc khoe truoc khi tra loi.",
                        "Noi moi loi khuyen voi ly do trong bai.",
                        "Khong can dich moi cum y khoa; hay tap trung vao hanh dong duoc khuyen."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ نص الصحة بالبحث عن الأعراض والأسباب والعادات الموصى بها.",
                    points: [
                        "حدد كلمات المشكلة الصحية قبل الإجابة.",
                        "اربط كل نصيحة بالسبب المذكور في النص.",
                        "لا تترجم كل عبارة طبية، بل ركز على الفعل المطلوب."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Эрүүл мэндийн эхийг шинж тэмдэг, шалтгаан, зөвлөсөн дадлыг хайж унш.",
                    points: [
                        "Хариулахаасаа өмнө эрүүл мэндийн асуудлын үгийг тэмдэглэ.",
                        "Зөвлөгөө бүрийг эх дэх шалтгаантай холбо.",
                        "Эмнэлгийн хэллэг бүрийг орчуулахын оронд хийх ёстой үйлдэлд төвлөр."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Денсаулық мәтінін белгілер, себептер және ұсынылған әдеттерді табу арқылы оқыңыз.",
                    points: [
                        "Жауап бермес бұрын денсаулық мәселесі сөздерін белгілеңіз.",
                        "Әр кеңесті мәтіндегі себеппен байланыстырыңыз.",
                        "Әр медициналық тіркесті аудармай, ұсынылған әрекетке назар аударыңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านบทความสุขภาพโดยหาคำเกี่ยวกับอาการ สาเหตุ และนิสัยที่แนะนำ",
                    points: [
                        "ทำเครื่องหมายคำเกี่ยวกับปัญหาสุขภาพก่อนตอบ",
                        "เชื่อมคำแนะนำแต่ละข้อกับเหตุผลในบทอ่าน",
                        "ไม่ต้องแปลทุกคำทางแพทย์ ให้ดูว่าควรทำอะไร"
                    ]
                }
            }
        },
        "c13/reading.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the event notice or article by finding the purpose, participants, activities, and expected result.",
                    points: [
                        "Identify what kind of event it is.",
                        "Find who organizes it and who can participate.",
                        "Use numbers, dates, and activity names as anchors."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc bai ve su kien bang cach tim muc dich, nguoi tham gia, hoat dong va ket qua mong doi.",
                    points: [
                        "Truoc het xac dinh day la su kien gi.",
                        "Tim ai to chuc va ai co the tham gia.",
                        "Dung con so, ngay thang va ten hoat dong lam diem neo."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ نص الحدث بالبحث عن الهدف والمشاركين والأنشطة والنتيجة المتوقعة.",
                    points: [
                        "حدد أولا نوع الحدث.",
                        "ابحث عمن ينظمه ومن يمكنه المشاركة.",
                        "استعمل الأرقام والتواريخ وأسماء الأنشطة كنقاط تثبيت."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Үйл явдлын эхийг зорилго, оролцогч, үйл ажиллагаа, хүлээгдэж буй үр дүнгээр унш.",
                    points: [
                        "Юуны тухай арга хэмжээ болохыг эхлээд тодорхойл.",
                        "Хэн зохион байгуулж, хэн оролцож болохыг ол.",
                        "Тоон мэдээлэл, огноо, үйл ажиллагааны нэрийг тулгуур болго."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Іс-шара мәтінін мақсат, қатысушылар, әрекеттер және күтілетін нәтиже арқылы оқыңыз.",
                    points: [
                        "Алдымен бұл қандай іс-шара екенін анықтаңыз.",
                        "Кім ұйымдастырады және кім қатыса алады екенін табыңыз.",
                        "Сандарды, күндерді және әрекет атауларын тірек етіңіз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านบทความกิจกรรมโดยหาจุดประสงค์ ผู้เข้าร่วม กิจกรรม และผลที่คาดหวัง",
                    points: [
                        "ก่อนอื่นให้ดูว่าเป็นกิจกรรมประเภทใด",
                        "หาใครจัดและใครเข้าร่วมได้",
                        "ใช้ตัวเลข วันที่ และชื่อกิจกรรมเป็นจุดยึด"
                    ]
                }
            }
        },
        "c14/reading.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the story by following the situation, the character's focus, and the lesson suggested by the proverb.",
                    points: [
                        "Track what the character becomes absorbed in.",
                        "Notice the moment when time or surroundings change.",
                        "Connect the ending with the meaning of the proverb."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc truyen bang cach theo doi tinh huong, dieu nhan vat say me va bai hoc cua tuc ngu.",
                    points: [
                        "Theo doi nhan vat bi cuon vao dieu gi.",
                        "Chu y thoi diem thoi gian hoac xung quanh thay doi.",
                        "Noi phan ket voi y nghia cua cau tuc ngu."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ القصة بتتبع الموقف وما ينشغل به الشخص والدرس المرتبط بالمثل.",
                    points: [
                        "تتبع الشيء الذي ينغمس فيه الشخص.",
                        "لاحظ لحظة تغير الزمن أو المحيط.",
                        "اربط النهاية بمعنى المثل."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Түүхийг нөхцөл байдал, дүрийн төвлөрсөн зүйл, зүйр үгийн сургамжаар дагаж унш.",
                    points: [
                        "Дүр юунд автаж байгааг ажигла.",
                        "Цаг хугацаа эсвэл орчин өөрчлөгдөх мөчийг анзаараарай.",
                        "Төгсгөлийг зүйр үгийн утгатай холбо."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Әңгімені жағдай, кейіпкердің неге берілгені және мақалдың сабағы арқылы оқыңыз.",
                    points: [
                        "Кейіпкер неге қатты берілгенін бақылаңыз.",
                        "Уақыт немесе орта өзгеретін сәтті байқаңыз.",
                        "Соңын мақалдың мағынасымен байланыстырыңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านเรื่องโดยตามสถานการณ์ สิ่งที่ตัวละครหมกมุ่น และบทเรียนของสุภาษิต",
                    points: [
                        "ดูว่าตัวละครจดจ่อกับอะไร",
                        "สังเกตช่วงที่เวลา หรือสภาพแวดล้อมเปลี่ยน",
                        "เชื่อมตอนจบกับความหมายของสุภาษิต"
                    ]
                }
            }
        },
        "c15/reading-cuttoon.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the cuttoon by following each scene and identifying the money-saving idea shown in the pictures.",
                    points: [
                        "Use the images to predict the Korean sentence.",
                        "Focus on what action saves money in each scene.",
                        "Do not translate the whole cuttoon; match picture, keyword, and sentence."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc cuttoon theo tung canh va tim cach tiet kiem tien duoc the hien trong tranh.",
                    points: [
                        "Dung hinh anh de du doan cau tieng Han.",
                        "Tap trung vao hanh dong giup tiet kiem tien trong moi canh.",
                        "Khong dich ca cuttoon; hay ghep tranh, tu khoa va cau."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ الكتّون مشهدا مشهدا وابحث عن فكرة توفير المال في الصور.",
                    points: [
                        "استعمل الصور لتوقع الجملة الكورية.",
                        "ركز على الفعل الذي يوفر المال في كل مشهد.",
                        "لا تترجم الكتّون كله، بل اربط الصورة والكلمة والجملة."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Картуун уншихдаа зураг бүрт гарч буй мөнгө хэмнэх санааг ол.",
                    points: [
                        "Зургийг ашиглан солонгос өгүүлбэрийг таамагла.",
                        "Үзэгдэл бүрт ямар үйлдэл мөнгө хэмнэж байгааг ол.",
                        "Бүхийг орчуулахгүй, зураг, түлхүүр үг, өгүүлбэрийг холбо."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Картунды әр көріністегі ақша үнемдеу идеясын суреттен таба отырып оқыңыз.",
                    points: [
                        "Суретті пайдаланып корей сөйлемін болжаңыз.",
                        "Әр көріністе қандай әрекет ақша үнемдейтінін табыңыз.",
                        "Бәрін аудармай, сурет, кілт сөз және сөйлемді байланыстырыңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านคัตตูนทีละฉาก แล้วหาแนวคิดเรื่องการประหยัดเงินจากภาพ",
                    points: [
                        "ใช้ภาพเพื่อเดาประโยคภาษาเกาหลี",
                        "ดูว่าฉากนั้นมีการกระทำใดที่ช่วยประหยัดเงิน",
                        "ไม่ต้องแปลทั้งหมด ให้จับคู่ภาพ คำสำคัญ และประโยค"
                    ]
                }
            }
        },
        "c16/reading.html": {
            ariaLabel: "다국어 읽기 도움말",
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the travel or park information by finding attractions, activities, and why each place is worth visiting.",
                    points: [
                        "Group information by place or activity.",
                        "Find what makes each attraction special.",
                        "Use headings and images to predict the content before reading details."
                    ]
                },
                vi: {
                    title: "Hỗ trợ đọc tiếng Việt",
                    summary: "Hãy đọc thông tin về công viên bằng cách tìm địa điểm, hoạt động và lý do mỗi nơi đáng đến.",
                    points: [
                        "Nhóm thông tin theo từng địa điểm hoặc hoạt động.",
                        "Tìm điểm đặc biệt của mỗi địa điểm.",
                        "Dùng tiêu đề và hình ảnh để dự đoán nội dung trước khi đọc chi tiết."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ معلومات المكان أو الحديقة بالبحث عن المعالم والأنشطة وسبب زيارتها.",
                    points: [
                        "اجمع المعلومات حسب المكان أو النشاط.",
                        "ابحث عما يجعل كل مكان مميزا.",
                        "استعمل العناوين والصور للتوقع قبل قراءة التفاصيل."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Аялал эсвэл цэцэрлэгийн мэдээллийг газар, үйл ажиллагаа, очих шалтгаанаар унш.",
                    points: [
                        "Мэдээллийг газар эсвэл үйл ажиллагаагаар бүлэглэ.",
                        "Газар бүрийн онцлогийг ол.",
                        "Дэлгэрэнгүй уншихаас өмнө гарчиг, зургийг ашиглан таамагла."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Саяхат немесе саябақ ақпаратын орын, әрекет және баруға тұратын себеп арқылы оқыңыз.",
                    points: [
                        "Ақпаратты орын немесе әрекет бойынша топтаңыз.",
                        "Әр орынның ерекшелігін табыңыз.",
                        "Толық оқымай тұрып тақырып пен сурет арқылы болжаңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านข้อมูลสถานที่หรือสวนโดยหาสถานที่ กิจกรรม และเหตุผลที่น่าไป",
                    points: [
                        "จัดข้อมูลตามสถานที่หรือกิจกรรม",
                        "หาว่าแต่ละที่พิเศษอย่างไร",
                        "ใช้หัวข้อและภาพช่วยเดาก่อนอ่านรายละเอียด"
                    ]
                }
            }
        },
        "c16/reading-cuttoon.html": {
            ariaLabel: "다국어 읽기 도움말",
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the cuttoon by connecting each picture with the activity or attraction introduced in the Korean sentence.",
                    points: [
                        "Use the scene order to understand the route or experience.",
                        "Look for activity names and descriptive adjectives.",
                        "Let the image help comprehension before checking details."
                    ]
                },
                vi: {
                    title: "Hỗ trợ đọc tiếng Việt",
                    summary: "Hãy đọc truyện tranh bằng cách nối từng hình với hoạt động hoặc địa điểm được giới thiệu trong câu tiếng Hàn.",
                    points: [
                        "Dùng thứ tự các cảnh để hiểu tuyến đường hoặc trải nghiệm.",
                        "Tìm tên hoạt động và các tính từ miêu tả.",
                        "Hãy để hình ảnh hỗ trợ việc hiểu bài trước khi đọc chi tiết."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ الكتّون بربط كل صورة بالنشاط أو المكان المذكور في الجملة الكورية.",
                    points: [
                        "استعمل ترتيب المشاهد لفهم الطريق أو التجربة.",
                        "ابحث عن أسماء الأنشطة والصفات الوصفية.",
                        "دع الصورة تساعدك قبل قراءة التفاصيل."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Картуун дахь зураг бүрийг солонгос өгүүлбэрт гарсан үйл ажиллагаа эсвэл газартай холбо.",
                    points: [
                        "Үзэгдлийн дарааллаар маршрут эсвэл туршлагыг ойлго.",
                        "Үйл ажиллагааны нэр, дүрслэх үгийг ол.",
                        "Дэлгэрэнгүй шалгахаас өмнө зургийг ойлголтод ашигла."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Картундағы әр суретті корей сөйлеміндегі әрекет немесе орынмен байланыстырыңыз.",
                    points: [
                        "Көрініс реті арқылы маршрутты немесе тәжірибені түсініңіз.",
                        "Әрекет атаулары мен сипаттайтын сын есімдерді іздеңіз.",
                        "Толық мәліметке дейін суретті түсінуге пайдаланыңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านคัตตูนโดยเชื่อมภาพแต่ละภาพกับกิจกรรมหรือสถานที่ในประโยคเกาหลี",
                    points: [
                        "ใช้ลำดับฉากเพื่อเข้าใจเส้นทางหรือประสบการณ์",
                        "หาชื่อกิจกรรมและคำคุณศัพท์บรรยาย",
                        "ให้ภาพช่วยทำความเข้าใจก่อนอ่านรายละเอียด"
                    ]
                }
            }
        },
        "c17/reading.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the text by tracking how a rumor starts, spreads, causes misunderstanding, and is later corrected.",
                    points: [
                        "Focus on the sequence of rumor, misunderstanding, and resolution.",
                        "Use character names and scene changes as anchors.",
                        "The support note should help with task directions, not replace reading the Korean text."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc bai bang cach theo doi tin don bat dau, lan ra, gay hieu lam va duoc sua lai nhu the nao.",
                    points: [
                        "Tap trung vao thu tu: tin don, hieu lam, giai quyet.",
                        "Dung ten nhan vat va thay doi canh lam diem neo.",
                        "Ghi chu ho tro chi giup hieu yeu cau, khong thay the viec doc tieng Han."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ النص بتتبع كيف تبدأ الشائعة وتنتشر وتسبب سوء فهم ثم تُصحح.",
                    points: [
                        "ركز على ترتيب: الشائعة، سوء الفهم، الحل.",
                        "استعمل أسماء الشخصيات وتغير المشاهد كنقاط تثبيت.",
                        "الملاحظة تساعد في فهم المهمة ولا تستبدل قراءة الكورية."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Цуу яриа хэрхэн эхэлж, тарж, үл ойлголцол үүсгээд дараа нь засагдаж байгааг дагаж унш.",
                    points: [
                        "Дараалалд төвлөр: цуу яриа, үл ойлголцол, шийдэл.",
                        "Дүрийн нэр, үзэгдэл солигдохыг тулгуур болго.",
                        "Тусламж нь даалгаврыг ойлгуулахад зориулагдсан, эхийг орлохгүй."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Мәтінді қауесеттің басталуы, таралуы, түсінбеушілік тудыруы және түзетілуі бойынша оқыңыз.",
                    points: [
                        "Ретке назар аударыңыз: қауесет, түсінбеушілік, шешім.",
                        "Кейіпкер аттары мен көрініс өзгерістерін тірек етіңіз.",
                        "Көмек жазбасы тапсырманы түсіндіреді, корей мәтінін алмастырмайды."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านโดยตามว่าข่าวลือเริ่ม แพร่กระจาย ทำให้เข้าใจผิด และถูกแก้ไขอย่างไร",
                    points: [
                        "เน้นลำดับ: ข่าวลือ ความเข้าใจผิด การแก้ไข",
                        "ใช้ชื่อตัวละครและการเปลี่ยนฉากเป็นจุดยึด",
                        "คำช่วยนี้ช่วยเข้าใจงาน ไม่ใช่แทนการอ่านภาษาเกาหลี"
                    ]
                }
            }
        },
        "c17/reading-cuttoon.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the cuttoon by following the order of scenes in Seodongyo and matching each cut with the Korean sentence.",
                    points: [
                        "Use the picture sequence to predict the story flow.",
                        "Find where the rumor changes a character's situation.",
                        "Check each Korean sentence against the image instead of translating the whole story."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc cuttoon theo thu tu canh trong Seodongyo va ghep moi cut voi cau tieng Han.",
                    points: [
                        "Dung thu tu tranh de du doan dong cau chuyen.",
                        "Tim cho tin don lam thay doi tinh huong cua nhan vat.",
                        "Kiem tra tung cau tieng Han voi hinh anh, khong dich ca cau chuyen."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ كتّون سودونغيو حسب ترتيب المشاهد واربط كل لقطة بالجملة الكورية.",
                    points: [
                        "استعمل ترتيب الصور لتوقع سير القصة.",
                        "ابحث عن موضع تغيّر حال الشخصية بسبب الشائعة.",
                        "راجع كل جملة كورية مع الصورة ولا تترجم القصة كاملة."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Содонгёо картууны үзэгдлийн дарааллаар уншиж, хэсэг бүрийг солонгос өгүүлбэртэй холбо.",
                    points: [
                        "Зургийн дарааллаар түүхийн урсгалыг таамагла.",
                        "Цуу яриа дүрийн байдлыг хаана өөрчилж байгааг ол.",
                        "Өгүүлбэр бүрийг зурагтай тулгаж шалга, бүх түүхийг орчуулах хэрэггүй."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Содонгё картунын көрініс ретімен оқып, әр бөлікті корей сөйлемімен байланыстырыңыз.",
                    points: [
                        "Сурет реті арқылы оқиға ағымын болжаңыз.",
                        "Қауесет кейіпкер жағдайын қай жерде өзгертетінін табыңыз.",
                        "Әр корей сөйлемін суретпен тексеріңіз, бүкіл оқиғаны аудармаңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านคัตตูนซอดงโยตามลำดับฉาก แล้วจับคู่แต่ละภาพกับประโยคเกาหลี",
                    points: [
                        "ใช้ลำดับภาพเพื่อเดาการดำเนินเรื่อง",
                        "หาจุดที่ข่าวลือเปลี่ยนสถานการณ์ของตัวละคร",
                        "ตรวจแต่ละประโยคกับภาพ ไม่ต้องแปลทั้งเรื่อง"
                    ]
                }
            }
        },
        "c18/reading.html": {
            title: "다국어 읽기 도움말",
            subtitle: "본문 전체 번역이 아니라 읽기 목표와 활동 지시만 짧게 확인하세요.",
            translations: {
                en: {
                    title: "English reading scaffold",
                    summary: "Read the script by identifying roles, lines, emotions, and the situation before practicing the role play.",
                    points: [
                        "First find who is speaking in each line.",
                        "Notice emotion words, requests, and repeated information.",
                        "Use the script structure to prepare speaking, not to translate every line."
                    ]
                },
                vi: {
                    title: "Ho tro doc tieng Viet",
                    summary: "Hay doc kich ban bang cach xac dinh vai, loi thoai, cam xuc va tinh huong truoc khi dong vai.",
                    points: [
                        "Truoc het tim ai dang noi o moi dong.",
                        "Chu y tu cam xuc, loi yeu cau va thong tin lap lai.",
                        "Dung cau truc kich ban de chuan bi noi, khong dich tung dong."
                    ]
                },
                ar: {
                    title: "مساعدة قراءة بالعربية",
                    summary: "اقرأ النص المسرحي بتحديد الأدوار والجمل والمشاعر والموقف قبل تمثيل الدور.",
                    points: [
                        "اعرف أولا من يتكلم في كل سطر.",
                        "لاحظ كلمات الشعور والطلبات والمعلومات المكررة.",
                        "استعمل بنية النص للتحضير للكلام، لا لترجمة كل سطر."
                    ]
                },
                mn: {
                    title: "Монгол унших тусламж",
                    summary: "Дүрд тоглохоос өмнө зохиолын дүр, мөр, мэдрэмж, нөхцөлийг тодорхойлж унш.",
                    points: [
                        "Эхлээд мөр бүрт хэн ярьж байгааг ол.",
                        "Сэтгэл хөдлөлийн үг, хүсэлт, давтагдсан мэдээллийг анзаараарай.",
                        "Зохиолын бүтцийг ярианд бэлтгэхэд ашигла, мөр бүрийг орчуулах хэрэггүй."
                    ]
                },
                kk: {
                    title: "Қазақша оқу көмегі",
                    summary: "Рөлдік ойыннан бұрын сценарийдегі рөлдерді, сөздерді, сезімдерді және жағдайды анықтап оқыңыз.",
                    points: [
                        "Әр жолда кім сөйлеп тұрғанын алдымен табыңыз.",
                        "Сезім сөздерін, өтініштерді және қайталанған ақпаратты байқаңыз.",
                        "Сценарий құрылымын сөйлеуге дайындалу үшін қолданыңыз, әр жолды аудармаңыз."
                    ]
                },
                th: {
                    title: "คำช่วยอ่านภาษาไทย",
                    summary: "อ่านบทโดยหาบทบาท คำพูด อารมณ์ และสถานการณ์ก่อนฝึกแสดง",
                    points: [
                        "ก่อนอื่นให้ดูว่าแต่ละบรรทัดใครพูด",
                        "สังเกตคำบอกอารมณ์ คำขอ และข้อมูลที่ซ้ำ",
                        "ใช้โครงสร้างบทเพื่อเตรียมพูด ไม่ใช่แปลทุกบรรทัด"
                    ]
                }
            }
        }
    };

    Object.entries(readings).forEach(([key, value]) => {
        data[key] = value;
    });
})();
