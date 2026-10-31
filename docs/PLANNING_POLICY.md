# IELTS Focus: Shaxsiy O‘quv Rejasini Rejalashtirish Siyosati (Planning Policy)

Ushbu hujjat Lumo platformasidagi 8 savolli kirish so‘rovnomasi va unga asoslangan deterministik o‘quv rejasini shakllantirish algoritmini, qoidalari hamda pedagogik chegaralarini tushuntiradi.

---

## 1. Asosiy Maqsad va Pedagogik Tamoyillar

- **Individual moslashuvchanlik**: O‘quvchi maqsadi (Target Band), kunlik vaqt byudjeti (15, 30, 45, 60, 90 daqiqa), qulay kunlar (Haftaning 1–7 kuni) va qiyin ko‘nikmalariga qarab shaxsiy reja tuziladi.
- **O‘lchangan natija vs O‘zini baholash**: So‘rovnoma ingliz tili darajasini rasman belgilamaydi yoki kafolat bermaydi. Kiritilgan rasmiy IELTS yoki mock natijalari mustaqil tekshirilmaguncha o‘zini baholash (self-reported) sifatida qayd etiladi.
- **Tushunarli tavsiyalar**: Har bir tavsiya etilgan vazifada aniq sabab ko‘rsatiladi (masalan: *"Xatolar daftarida 3 ta xato borligi uchun"* yoki *"Reading zaif modul sifatida belgilangani uchun"*).

---

## 2. Kirish So‘rovnomasi (8 ta Savol)

1. **Maqsadli Band (Target Band)**:
   - Variantlar: 5.5, 6.0, 6.5, 7.0, 7.5, 8.0+, Hozircha aniq emas.
   - *"8.0+"* va *"not_sure"* aniq saqlanadi, soxta sonlarga konvertatsiya qilinmaydi.
2. **Joriy Daraja Ma'lumotlari**:
   - Variantlar: Rasmiy IELTS, Mock-test, O‘z darajasini taxmin qilish, Bilmayman.
   - Ballar 0–9 oralig‘ida 0.5 qadam bilan tekshiriladi.
   - Agar daraja noma'lum bo‘lsa, 1-vazifa sifatida 15 daqiqalik diagnostika tavsiya etiladi.
3. **Zaif Ko‘nikmalar (Perceived Weak Skills)**:
   - Reading, Listening, Writing, Speaking, Hozircha aniq emas.
   - *"Hozircha aniq emas"* eksklyuziv tanlovdir.
4. **Imtihon Muddatlari**:
   - Aniq sana (kelajakdagi sana bo‘lishi shart), 1 oy ichida, 2–3 oy, 3–6 oy, Rejalashtirilmagan.
5. **Kunlik Vaqt Byudjeti**:
   - 15, 30, 45, 60, 90 daqiqa. Har bir modul uchun emas, kunlik jami vaqt.
6. **O‘quv Kunlari**:
   - Dushanbadan Yakshanbagacha (kamida 1 kun talab qilinadi).
   - Belgilanmagan kunlar dam olish kuni deb hisoblanadi.
7. **Dars Taqsimoti (Session Preference)**:
   - Bitta mashg‘ulot, 2 ta qisqa qism, bir nechta kichik qismlar. Umumiy daqiqalar saqlanadi.
8. **Qo‘shimcha Mashg‘ulotlar**:
   - Lug‘at takrorlash (Spaced Repetition), Xatolar tahlili, Speaking recorder, Writing practice.

---

## 3. Rejalashtirish Dvigateli (Planning Engine) Qoidalari

1. **Vaqt Byudjeti chegarasi**:
   - Vazifalar daqiqalari yig‘indisi belgilangan kunlik byudjetdan oshmaydi.
   - 15 daqiqalik byudjetga hech qachon 60 daqiqalik to‘liq mock test berilmaydi (faqat micro-drill yoki qisqa matn).
2. **Haqiqiy Ma'lumotlarga Tayanish (No Phantom Tasks)**:
   - Agar takrorlash navbatida so‘z bo‘lmasa (`dueVocabCount === 0`), bo‘sh lug‘at vazifasi yaratilmaydi.
   - Agar xatolar daftari bo‘sh bo‘lsa, soxta xatolar tahlili vazifasi kiritilmaydi.
3. **Dam Olish Kunlari va Vaqt Mintaqasi**:
   - Agar bugun tanlangan o‘quv kuni bo‘lmasa, `isRestDay: true` qaytariladi va hech qanday majburiy yuklama yuklanmaydi.
   - O‘quvchiga navbatdagi dars sanasi ko‘rsatiladi va ixtiyoriy yengil mashq taklif etiladi.
4. **O‘tkazib yuborilgan kunlar (No Task Accumulation)**:
   - O‘tkazib yuborilgan kun vazifalari ertangi kunga qor uyumi kabi yig‘ilmaydi. Yangi kun o‘z vaqt byudjetida qayta muvozanatlanadi.
5. **Bajarilgan Vazifalarni Saqlash (Idempotency)**:
   - Sahifa har yangilanganda vazifalar IDsi qayta generatsiya qilinmaydi va o‘quvchining belgilagan holati o‘chib ketmaydi.

---

## 4. Foydalanuvchi va Mehmon Rejimi Xavfsizligi

- **Ro‘yxatdan o‘tgan o‘quvchilar**: Firestore `users/{uid}` va `studyDays/{dateKey}` orqali xavfsiz saqlanadi.
- **Mehmonlar (Guest Mode)**: `localStorage`da saqlanadi. Keyinchalik ro‘yxatdan o‘tganda `syncGuestDataToAccount` barcha parametrlarni Firestore hisobiga xavfsiz ko‘chiradi.
- **Chiqish (Sign Out)**: Boshqa o‘quvchi kurganda eski ma'lumotlar aralashib ketmasligi uchun lokal kesh tozalab yuboriladi.
