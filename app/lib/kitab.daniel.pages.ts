// app/lib/kitab.daniel.pages.ts
// Kitab Dāniyāl al-Nabī — Data halaman (1–5)

export type Lang = "ar" | "ms";

export const kitabDanielCover = {
  arTitle: "كتاب دانيال النبي",
  arSubtitle:
    "في علم الأبراج والسحر ومنافع الأعشاب الطبية وقوة الروح والفلك، وبيان العلل وعلاجات الأمراض والأوجاع والخير والشر",
  msTitle: "Kitab Nabi Danial",
  msSubtitle:
    "Tentang ilmu buruj dan sihir, manfaat herba perubatan, kekuatan roh dan ilmu falak; serta penjelasan penyakit, rawatan, kebaikan dan keburukan.",
  notes: [
    "Naskhah lama — disusun semula untuk bacaan moden.",
    "Terjemahan halaman dibuat satu-persatu mengikut naskhah asal.",
  ],
};

/** -------------------- HALAMAN 1 -------------------- **/
const P1_AR = `بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ

الحُرُوفُ الأَبْجَدِيَّةُ (حِسَابُ الجُمَّل)

ا ١  ب ٢  ج ٣  د ٤  هـ ٥  و ٦  ز ٧  ح ٨  ط ٩  
ي ١٠  ك ٢٠  ل ٣٠  م ٤٠  ن ٥٠  س ٦٠  ع ٧٠  ف ٨٠  ص ٩٠  
ق ١٠٠  ر ٢٠٠  ش ٣٠٠  ت ٤٠٠  ث ٥٠٠  خ ٦٠٠  ذ ٧٠٠  ض ٨٠٠  ظ ٩٠٠  غ ١٠٠٠

★ هذا هو الأصل المعتمد لحساب الحروف في هذا الكتاب، ويُستعمل في أسماء الأشخاص والتواريخ وبعض أبواب الأسرار.`;

const P1_MS = `Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang

Huruf-huruf Abjadiyyah (Hisaab al-Jummal)

Akaun nilai huruf digunakan dalam kitab ini:
ا = 1, ب = 2, ج = 3, د = 4, هـ = 5, و = 6, ز = 7, ح = 8, ط = 9  
ي = 10, ك = 20, ل = 30, م = 40, ن = 50, س = 60, ع = 70, ف = 80, ص = 90  
ق = 100, ر = 200, ش = 300, ت = 400, ث = 500, خ = 600, ذ = 700, ض = 800, ظ = 900, غ = 1000

★ Inilah asas kiraan huruf untuk nama, tarikh dan beberapa bab rahsia.`;

/** -------------------- HALAMAN 2 -------------------- **/
const P2_AR = `حقوق الطبع محفوظة

لمنشورات عبد بيروت  
طبع سنة ١٣٥١ هـ تقريبًا (١٩٣٢ م)

تمَّ تحقيقُ هذا الكتاب من نسخةٍ قديمةٍ بخطِّ اليد،  
فيه أسرارُ الحروفِ والبروجِ والرُّوحانيات،  
ونفعُ الناسِ بعلمِ النجومِ والطِّبِّ القديم.  

قال مؤلفُهُ:  
«من قرأ هذا الكتاب فليقرأه بنيَّةِ الخير،  
ولا يستعمل علمه في الشر،  
فإن أسرار الحروف لا تُعطى إلا لأهل الأمانة».`;

const P2_MS = `Hak Cipta Terpelihara

Diterbitkan oleh Manšūrāt ‘Abd – Beirut  
Cetakan sekitar tahun 1351 Hijrah (1932 Masihi)

Kitab ini disalin daripada naskhah tulisan tangan lama,  
mengandungi rahsia huruf, buruj dan ilmu kerohanian,  
serta manfaat ilmu bintang dan perubatan kuno untuk manusia.  

Penulis berpesan:  
“Sesiapa yang membaca kitab ini hendaklah membaca dengan niat kebaikan,  
dan jangan digunakan ilmunya untuk kejahatan,  
kerana rahsia huruf tidak diberikan melainkan kepada orang yang amanah.”`;

/** -------------------- HALAMAN 3 -------------------- **/
const P3_AR = `الأفلاكُ السَّبْعَةُ وَالكَوَاكِبُ

قال دانيالُ عليه السَّلام:  
إنَّ اللهَ تعالى خلقَ سبعةَ كواكبٍ تَجْرِي في السَّماءِ وتؤثِّرُ في الأرضِ بما شاءَ اللهُ من خيرٍ وشرٍّ.

وهي على الترتيب:
١ – زُحَل (Saturnus) من ٣٠ كانون أول إلى ٢٩ شباط  
٢ – المِرِّيخ (Mars) من ٣٠ آذار إلى ٢٩ أيار  
٣ – المُشْتَرِي (Jupiter) من ٣٠ حزيران إلى ٢٩ تموز  
٤ – الشَّمْس (Sun) من ٣٠ تموز إلى ٢٩ أيلول  
٥ – الزُّهْرَة (Venus) من ٣٠ أيلول إلى ٢٩ تشرين ثاني  
٦ – عُطَارِد (Mercury) من ٣٠ تشرين ثاني إلى ٢٩ كانون ثاني  
٧ – القَمَر (Moon) من ٣٠ كانون ثاني إلى ٢٩ آذار

وقال:  
«مَن عَرَفَ كوكبَهُ، عَرَفَ طَبْعَهُ ونصيبَهُ من السَّعدِ والنَّحسِ».`;

const P3_MS = `Falak (Peredaran Tujuh Planet)

Nabi Danial a.s. berkata:  
Sesungguhnya Allah menjadikan tujuh buah planet yang beredar di langit dan mempunyai pengaruh di bumi dengan izin-Nya — kadang membawa kebaikan, kadang ujian.

Susunannya:
1️⃣ Zuhal (Saturnus) : 30 Dis – 29 Feb  
2️⃣ Marikh (Mars) : 30 Mac – 29 Mei  
3️⃣ Musytari (Jupiter) : 30 Jun – 29 Jul  
4️⃣ Syams (Matahari) : 30 Jul – 29 Sep  
5️⃣ Zuhrah (Venus) : 30 Sep – 29 Nov  
6️⃣ ‘Uṭārid (Merkurius) : 30 Nov – 29 Jan  
7️⃣ Qamar (Bulan) : 30 Jan – 29 Mac  

Dan sabda baginda:  
“Barang siapa mengetahui bintangnya, maka ia mengetahui tabiat dirinya dan bahagiannya pada untung dan malang.”`;

/** -------------------- HALAMAN 4 -------------------- **/
const P4_AR = `لوحُ الحَيَاةِ ولوحُ المَمَاتِ

قال دانيالُ عليه السلام:
إنَّ لكلِّ إنسانٍ لوحينِ في العالمِ الروحانيِّ،  
أحدُهما لوحُ الحياة، والآخر لوحُ الممات.  

لوحُ الحياة فيه أرقامُ السعادةِ والقوَّةِ والنُّجاح،  
ولوحُ المماتِ فيه أرقامُ البلاءِ والضَّعفِ والفِتَن.  

وإذا جُمِعَتْ حروفُ اسمِ الإنسانِ وأُمِّهِ بحسابِ الجُمَّل  
ثم قُسِمَ المجموعُ على العدد ٤٠،  
فالباقي يُدلُّ على رقمٍ في أحدِ اللَّوحينِ.

فمن وقع في لوح الحياة كان من أهلِ النُّور والسَّعادة،  
ومن وقع في لوح الممات كان من أهلِ البلاءِ والامتحان.`;

const P4_MS = `Lauh al-Hayah & Lauh al-Mamāt

Nabi Danial a.s. bersabda:  
Bahawasanya bagi setiap insan ada dua papan dalam alam roh —  
satu dinamakan Lauh al-Hayah (Papan Hidup),  
dan satu lagi Lauh al-Mamāt (Papan Kematian).

Lauh al-Hayah mengandungi angka-angka kebahagiaan, kekuatan dan kejayaan;  
sedangkan Lauh al-Mamāt mengandungi angka-angka ujian, kelemahan dan fitnah.

Apabila huruf-huruf nama seseorang serta nama ibunya dijumlahkan mengikut kiraan Jummal,  
lalu dibahagikan jumlah itu dengan angka 40,  
maka baki bahagiannya menunjukkan nombor pada salah satu daripada dua papan itu.

Barang siapa jatuh pada Lauh al-Hayah,  
maka ia tergolong dalam golongan cahaya dan kebahagiaan;  
dan barang siapa jatuh pada Lauh al-Mamāt,  
maka dia termasuk dalam golongan ujian dan cubaan.`;

/** -------------------- HALAMAN 5 -------------------- **/
const P5_AR = `بيانٌ في استخراجِ اللوحينِ بالأسماء

اعلمْ أنَّ استخراجَ اللوحينِ يكونُ بجمعِ حروفِ الاسمِ واسمِ الأمِّ بحسابِ الجُمَّل،  
فإذا تمَّ الجمعُ يُقسمُ على أربعين، والباقي هو العددُ المطلوبُ.

فإنْ خرجَ الباقيُ من ١ إلى ٢٠، فهو في لوحِ الحياة،  
وإنْ خرجَ من ٢١ إلى ٤٠، فهو في لوحِ الممات.  

ومَن لم يكن له أمٌّ تُعرفُ، فليحسبْ باسمِ حوّاء،  
فإنَّه الاسمُ الجامعُ للأمَّهاتِ أجمعين.  

واعلمْ أنَّ الأعدادَ في هذا البابِ لها سرٌّ عظيم،  
فكلُّ عددٍ له طالعٌ في الفلكِ، وله أثرٌ في الخلقِ،  
ومن جهلَها فقد جهلَ نصفَ العلمِ.`; 

const P5_MS = `Penjelasan Tentang Cara Mengira Dua Papan Berdasarkan Nama

Ketahuilah bahawa cara mengeluarkan dua papan (Lauh al-Hayah dan Lauh al-Mamāt)  
ialah dengan menjumlahkan semua huruf nama seseorang dan nama ibunya mengikut kiraan Jummal.  
Setelah didapati jumlah keseluruhan, bahagi dengan angka 40 — baki bahagi itulah nombor yang dicari.

Jika baki itu dari 1 hingga 20, maka ia termasuk dalam Lauh al-Hayah (Papan Hidup).  
Jika baki itu dari 21 hingga 40, maka ia termasuk dalam Lauh al-Mamāt (Papan Kematian).

Dan jika tidak diketahui nama ibu, maka digunakan nama Ḥawwā’ (Hawa),  
kerana itulah nama asal segala ibu manusia.

Ketahuilah bahawa angka-angka dalam bab ini mempunyai rahsia yang besar —  
setiap angka mempunyai bintang pelindung di langit, dan kesan tersendiri pada kejadian makhluk;  
dan sesiapa yang jahil mengenainya, maka ia jahil separuh daripada ilmu.`;

/** -------------------- KONSTRUK 80 HALAMAN -------------------- **/
export const kitabDanielPages: { ar: string; ms: string }[] = (() => {
  const arr = Array.from({ length: 80 }, () => ({ ar: "—", ms: "—" }));
  arr[0] = { ar: P1_AR, ms: P1_MS };
  arr[1] = { ar: P2_AR, ms: P2_MS };
  arr[2] = { ar: P3_AR, ms: P3_MS };
  arr[3] = { ar: P4_AR, ms: P4_MS };
  arr[4] = { ar: P5_AR, ms: P5_MS };
  for (let i = 5; i < arr.length; i++) {
    arr[i] = {
      ar: `— محتوى صفحة ${i + 1} (سيُضاف لاحقًا) —`,
      ms: `— Kandungan muka surat ${i + 1} (akan diisi kemudian) —`,
    };
  }
  return arr;
})();

export function getPage(i: number, lang: Lang): string {
  if (i < 1 || i > kitabDanielPages.length) return "";
  const p = kitabDanielPages[i - 1];
  return lang === "ar" ? p.ar : p.ms;
}

export function totalPages(): number {
  return kitabDanielPages.length;
}
