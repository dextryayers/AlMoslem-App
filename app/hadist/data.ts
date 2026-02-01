import { Book, Home, Scroll, MapPin, Layers, Heart, Clock, LogIn, Bot, Settings, BookMarked, Palette } from 'lucide-react';

export interface Hadith {
  nomor: number;
  judul: string;
  arab: string;
  terjemah: string;
  riwayat: string;
}

export const HADITH_ARBAIN: Hadith[] = [
  {
    nomor: 1,
    judul: "Amal Tergantung Niat",
    arab: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم يَقُولُ: إنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إلَى مَا هَاجَرَ إلَيْهِ.",
    terjemah: "Dari Amirul Mukminin Abu Hafsh Umar bin Al-Khattab radhiyallahu ‘anhu, ia berkata: Aku mendengar Rasulullah shallallahu ‘alaihi wa sallam bersabda: “Sesungguhnya setiap amalan tergantung pada niatnya. Setiap orang akan mendapatkan apa yang ia niatkan. Siapa yang hijrahnya karena Allah dan Rasul-Nya, maka hijrahnya untuk Allah dan Rasul-Nya. Siapa yang hijrahnya karena mencari dunia atau karena wanita yang dinikahinya, maka hijrahnya kepada yang ia tuju.”",
    riwayat: "HR. Bukhari no. 1 dan Muslim no. 1907"
  },
  {
    nomor: 2,
    judul: "Rukun Islam, Iman, dan Ihsan",
    arab: "عَنْ عُمَرَ رَضِيَ اللهُ عَنْهُ أَيْضاً قَالَ: بَيْنَمَا نَحْنُ جُلُوْسٌ عِنْدَ رَسُوْلِ اللهِ صلى الله عليه وسلم ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيْدُ بَيَاضِ الثِّيَابِ شَدِيْدُ سَوَادِ الشَّعْرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ صلى الله عليه وسلم فَأَسْنَدَ رُكْبَتَيْهِ إِلَى رُكْبَتَيْهِ وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ وَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ، فَقَالَ رَسُوْلُ اللهِ صلى الله عليه وسلم: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَ أَنَّ مُحَمَّدًا رَسُوْلُ اللهِ، وَتُقِيْمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُوْمَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيْلاً. قَالَ: صَدَقْتَ. فَعَجِبْنَا لَهُ يَسْأَلُهُ وَيُصَدِّقُهُ.",
    terjemah: "Dari Umar radhiyallahu ‘anhu juga, ia berkata: Suatu hari kami duduk-duduk bersama Rasulullah shallallahu ‘alaihi wa sallam. Tiba-tiba datang seorang laki-laki berpakaian sangat putih dan rambutnya sangat hitam. Tidak terlihat padanya tanda-tanda bekas perjalanan, dan tidak ada seorang pun di antara kami yang mengenalnya. Ia duduk di hadapan Nabi shallallahu ‘alaihi wa sallam, lalu menyandarkan lututnya pada lutut Nabi dan meletakkan tangannya di atas paha Nabi, kemudian berkata: “Wahai Muhammad, beritahukan kepadaku tentang Islam.” Rasulullah shallallahu ‘alaihi wa sallam menjawab: “Islam adalah engkau bersaksi bahwa tidak ada sesembahan yang berhak disembah selain Allah dan Muhammad adalah utusan Allah, menegakkan shalat, menunaikan zakat, berpuasa Ramadhan, dan haji ke Baitullah jika engkau mampu menempuh jalannya.” Ia berkata: “Engkau benar.” Kami heran kepadanya, ia bertanya namun ia juga membenarkannya.",
    riwayat: "HR. Muslim no. 8"
  },
  {
    nomor: 3,
    judul: "Rukun Islam",
    arab: "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللهِ بْنِ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُوْلَ اللهِ صلى الله عليه وسلم يَقُوْلُ: بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَأَنَّ مُحَمَّدًا رَسُوْلُ اللهِ، وَإِقَامِ الصَّلاَةِ، وَإِيْتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ.",
    terjemah: "Dari Abu Abdirrahman Abdullah bin Umar bin Al-Khattab radhiyallahu ‘anhuma, ia berkata: Aku mendengar Rasulullah shallallahu ‘alaihi wa sallam bersabda: “Islam dibangun di atas lima perkara: Bersaksi bahwa tidak ada sesembahan yang berhak disembah selain Allah dan Muhammad adalah utusan Allah, menegakkan shalat, menunaikan zakat, haji ke Baitullah, dan puasa Ramadhan.”",
    riwayat: "HR. Bukhari no. 8 dan Muslim no. 16"
  },
  {
    nomor: 4,
    judul: "Takdir Manusia",
    arab: "عَنْ أَبِي عَبْدِ الرَّحْمَنِ عَبْدِ اللهِ بْنِ مَسْعُوْدٍ رَضِيَ اللهُ عَنْهُ قَالَ: حَدَّثَنَا رَسُوْلُ اللهِ صلى الله عليه وسلم وَهُوَ الصَّادِقُ الْمَصْدُوْقُ: إِنَّ أَحَدَكُمْ يُجْمَعُ خَلْقُهُ فِي بَطْنِ أُمِّهِ أَرْبَعِيْنَ يَوْمًا نُطْفَةً، ثُمَّ يَكُوْنُ عَلَقَةً مِثْلَ ذَلِكَ، ثُمَّ يَكُوْنُ مُضْغَةً مِثْلَ ذَلِكَ، ثُمَّ يُرْسَلُ إِلَيْهِ الْمَلَكُ فَيَنْفُخُ فِيْهِ الرُّوْحَ، وَيُؤْمَرُ بِأَرْبَعِ كَلِمَاتٍ: بِكَتْبِ رِزْقِهِ وَأَجَلِهِ وَعَمَلِهِ وَشَقِيٌّ أَوْ سَعِيْدٌ.",
    terjemah: "Dari Abu Abdirrahman Abdullah bin Mas’ud radhiyallahu ‘anhu, ia berkata: Rasulullah shallallahu ‘alaihi wa sallam menyampaikan kepada kami, dan beliau adalah orang yang jujur lagi terpercaya: “Sesungguhnya setiap kalian dikumpulkan penciptaannya di perut ibunya selama 40 hari sebagai nutfah (air mani), kemudian menjadi ‘alaqah (segumpal darah) selama itu pula, kemudian menjadi mudhgah (segumpal daging) selama itu pula. Kemudian diutuslah malaikat kepadanya untuk meniupkan ruh dan diperintahkan untuk mencatat empat perkara: rezekinya, ajalnya, amalnya, dan apakah ia celaka atau bahagia.”",
    riwayat: "HR. Bukhari no. 3208 dan Muslim no. 2643"
  },
  {
    nomor: 5,
    judul: "Larangan Bid'ah",
    arab: "عَنْ أُمِّ الْمُؤْمِنِيْنَ أُمِّ عَبْدِ اللهِ عَائِشَةَ رَضِيَ اللهُ عَنْهَا قَالَتْ: قَالَ: رَسُوْلُ اللهِ صلى الله عليه وسلم : مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ.",
    terjemah: "Dari Ummul Mukminin Ummu Abdillah Aisyah radhiyallahu ‘anha, ia berkata: Rasulullah shallallahu ‘alaihi wa sallam bersabda: “Barangsiapa membuat suatu perkara baru dalam urusan kami ini (agama) yang tidak ada asalnya, maka perkara tersebut tertolak.”",
    riwayat: "HR. Bukhari no. 2697 dan Muslim no. 1718"
  },
  {
    nomor: 6,
    judul: "Halal dan Haram itu Jelas",
    arab: "عَنْ أَبِيْ عَبْدِ اللهِ النُّعْمَانِ بْنِ بَشِيْرٍ رَضِيَ اللهُ عَنْهُمَا قَالَ: سَمِعْتُ رَسُوْلَ اللهِ صلى الله عليه وسلم يَقُوْلُ: إِنَّ الْحَلاَلَ بَيِّنٌ وَإِنَّ الْحَرَامَ بَيِّنٌ وَبَيْنَهُمَا أُمُوْرٌ مُشْتَبِهَاتٌ لاَ يَعْلَمُهُنَّ كَثِيْرٌ مِنَ النَّاسِ، فَمَنِ اتَّقَى الشُّبُهَاتِ فَقَدِ اسْتَبْرَأَ لِدِيْنِهِ وَعِرْضِهِ، وَمَنْ وَقَعَ فِي الشُّبُهَاتِ وَقَعَ فِي الْحَرَامِ، كَالرَّاعِي يَرْعَى حَوْلَ الْحِمَى يُوْشِكُ أَنْ يَرْتَعَ فِيْهِ. أَلاَ وَإِنَّ لِكُلِّ مَلِكٍ حِمًى، أَلاَ وَإِنَّ حِمَى اللهِ مَحَارِمُهُ. أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ. أَلاَ وَهِيَ الْقَلْبُ.",
    terjemah: "Dari Abu Abdillah An-Nu’man bin Basyir radhiyallahu ‘anhuma, ia berkata: Aku mendengar Rasulullah shallallahu ‘alaihi wa sallam bersabda: “Sesungguhnya yang halal itu jelas dan yang haram itu jelas. Di antara keduanya terdapat perkara-perkara syubhat (samar) yang tidak diketahui oleh banyak orang. Barangsiapa yang menjauhi syubhat, maka ia telah menjaga agama dan kehormatannya. Barangsiapa yang terjerumus dalam syubhat, maka ia terjerumus dalam yang haram. Seperti penggembala yang menggembala di sekitar daerah terlarang, lambat laun ia akan masuk ke dalamnya. Ketahuilah, setiap raja memiliki daerah terlarang. Ketahuilah, daerah terlarang Allah adalah larangan-larangan-Nya. Ketahuilah, di dalam tubuh terdapat segumpal daging. Jika ia baik, maka baiklah seluruh tubuhnya. Jika ia rusak, maka rusaklah seluruh tubuhnya. Ketahuilah, segumpal daging itu adalah hati.”",
    riwayat: "HR. Bukhari no. 52 dan Muslim no. 1599"
  },
  {
    nomor: 7,
    judul: "Agama Adalah Nasihat",
    arab: "عَنْ أَبِيْ رُقَيَّةَ تَمِيْمِ بْنِ أَوْسٍ الدَّارِيِّ رَضِيَ اللهُ عَنْهُ أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ: الدِّيْنُ النَّصِيْحَةُ. قُلْنَا: لِمَنْ؟ قَالَ: لِلَّهِ وَلِكِتَابِهِ وَلِرَسُوْلِهِ وَلِأَئِمَّةِ الْمُسْلِمِيْنَ وَعَامَّتِهِمْ.",
    terjemah: "Dari Abu Ruqayyah Tamim bin Aus Ad-Dari radhiyallahu ‘anhu, bahwasanya Nabi shallallahu ‘alaihi wa sallam bersabda: “Agama itu nasihat.” Kami bertanya: “Untuk siapa?” Beliau menjawab: “Untuk Allah, Kitab-Nya, Rasul-Nya, para pemimpin kaum muslimin, dan kaum muslimin pada umumnya.”",
    riwayat: "HR. Muslim no. 55"
  },
  {
    nomor: 8,
    judul: "Haram Darah Seorang Muslim",
    arab: "عَنِ ابْنِ عُمَرَ رَضِيَ اللهُ عَنْهُمَا أَنَّ رَسُوْلَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ قَالَ : أُمِرْتُ أَنْ أُقَاتِلَ النَّاسَ حَتَّى يَشْهَدُوا أَنْ لاَ إِلَهَ إِلاَّ اللهُ وَأَنَّ مُحَمَّدًا رَسُوْلُ اللهِ ، وَيُقِيْمُوا الصَّلاَةَ وَيُؤْتُوا الزَّكَاةَ ، فَإِذَا فَعَلُوا ذَلِكَ عَصَمُوا مِنِّي دِمَاءَهُمْ وَأَمْوَالَهُمْ إِلاَّ بِحَقِّ الإِسْلاَمِ وَحِسَابُهُمْ عَلَى اللهِ تَعَالَى",
    terjemah: "Dari Ibnu Umar radhiyallahu ‘anhuma, sesungguhnya Rasulullah shallallahu ‘alaihi wa sallam bersabda: “Aku diperintahkan untuk memerangi manusia hingga mereka bersaksi bahwa tidak ada ilah yang berhak disembah selain Allah dan bahwa Muhammad adalah utusan Allah, menegakkan shalat, menunaikan zakat. Jika mereka melakukan hal tersebut, maka darah dan harta mereka terpelihara dariku, kecuali dengan haq Islam dan hisab mereka pada Allah Ta’ala.”",
    riwayat: "HR. Bukhari no. 25 dan Muslim no. 22"
  },
  {
    nomor: 9,
    judul: "Menjalankan Perintah Semampunya",
    arab: "عَنْ أَبِيْ هُرَيْرَةَ عَبْدِ الرَّحْمَنِ بْنِ صَخْرٍ رَضِيَ اللهُ عَنْهُ قَالَ : سَمِعْتُ رَسُوْلَ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ يَقُوْلُ : مَا نَهَيْتُكُمْ عَنْهُ فَاجْتَنِبُوْهُ ، وَمَا أَمَرْتُكُمْ بِهِ فَأْتُوا مِنْهُ مَا اسْتَطَعْتُمْ ، فَإِنَّمَا أَهْلَكَ الَّذِيْنَ مِنْ قَبْلِكُمْ كَثْرَةُ مَسَائِلِهِمْ وَاخْتِلاَفُهُمْ عَلَى أَنْبِيَائِهِمْ",
    terjemah: "Dari Abu Hurairah Abdurrahman bin Sakhr radhiyallahu ‘anhu, ia berkata: Aku mendengar Rasulullah shallallahu ‘alaihi wa sallam bersabda: “Apa yang aku larang kalian darinya, maka jauhilah. Dan apa yang aku perintahkan kalian dengannya, maka kerjakanlah semampu kalian. Sesungguhnya yang membinasakan orang-orang sebelum kalian adalah banyaknya pertanyaan mereka dan perselisihan mereka terhadap nabi-nabi mereka.”",
    riwayat: "HR. Bukhari no. 7288 dan Muslim no. 1337"
  },
  {
    nomor: 10,
    judul: "Meninggalkan yang Haram",
    arab: "عَنْ أَبِيْ هُرَيْرَةَ رَضِيَ اللهُ عَنْهُ قَالَ : قَالَ رَسُوْلُ اللهِ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ : إِنَّ اللهَ تَعَالَى طَيِّبٌ لاَ يَقْبَلُ إِلاَّ طَيِّبًا، وَإِنَّ اللهَ أَمَرَ الْمُؤْمِنِيْنَ بِمَا أَمَرَ بِهِ الْمُرْسَلِيْنَ فَقَالَ تَعَالَى :  يَا أَيُّهَا الرُّسُلُ كُلُوا مِنَ الطَّيِّبَاتِ وَاعْمَلُوا صَالِحًا – وَقَالَ تَعَالَى : يَا أَيُّهَا الَّذِيْنَ آمَنُوا كُلُوا مِنْ طَيِّبَاتِ مَا رَزَقْنَاكُمْ – ثُمَّ ذَكَرَ الرَّجُلَ يُطِيْلُ السَّفَرَ أَشْعَثَ أَغْبَرَ يَمُدُّ يَدَيْهِ إِلَى السَّمَاءِ : يَا رَبِّ ! يَا رَبِّ ! وَمَطْعَمُهُ حَرَامٌ وَمَشْرَبُهُ حَرَامٌ وَغُذِيَ بِالْحَرَامِ فَأَنَّى يُسْتَجَابُ لِذَلِكَ",
    terjemah: "Dari Abu Hurairah radhiyallahu ‘anhu, ia berkata: Rasulullah shallallahu ‘alaihi wa sallam bersabda: “Sesungguhnya Allah Ta’ala itu Maha Baik dan tidak menerima kecuali yang baik. Dan sesungguhnya Allah memerintahkan kepada orang-orang yang beriman seperti yang diperintahkan kepada para Rasul. Allah Ta’ala berfirman: ‘Wahai para Rasul! Makanlah dari makanan yang baik-baik (halal) dan kerjakanlah kebajikan.’ (QS. Al-Mu’minun: 51). Dan Allah Ta’ala berfirman: ‘Wahai orang-orang yang beriman! Makanlah dari rezeki yang baik yang Kami berikan kepada kalian.’ (QS. Al-Baqarah: 172). Kemudian beliau menceritakan seorang laki-laki yang melakukan perjalanan jauh, rambutnya kusut dan berdebu. Ia menengadahkan kedua tangannya ke langit seraya berdoa: ‘Ya Rabb! Ya Rabb!’ Sedangkan makanannya haram, minumannya haram, pakaiannya haram, dan ia tumbuh dari yang haram, maka bagaimana mungkin doanya dikabulkan?”",
    riwayat: "HR. Muslim no. 1015"
  }
];

export interface SidebarItem {
  label: string;
  href: string;
  icon: any;
  subItems?: { label: string; href: string }[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Bookmark', href: '/bookmark', icon: BookMarked },
  { label: 'Urutan Wahyu', href: '/urutan-wahyu', icon: Scroll },
  { 
    label: 'Hadits', 
    href: '/hadist', 
    icon: Book,
    subItems: [
      { label: 'Hadits Nawawi', href: '/hadist/nawawi' },
      { label: 'Hadits Qudsi', href: '/hadist/qudsi' },
      { label: 'Al-Adab Al-Mufrad', href: '/hadist/aladab' }
    ]
  },
  { label: 'Surah Makkiyah', href: '/makkiyah', icon: MapPin },
  { label: 'Surah Madaniyah', href: '/madaniyah', icon: MapPin },
  { label: 'Daftar Juz', href: '/juz', icon: Layers },
  { label: 'Jadwal Solat', href: '/jadwal-sholat', icon: Clock },
  { label: 'Doa Harian', href: '/doa', icon: Heart },
  { label: 'Ustaz AI', href: '/ust-ai', icon: Bot },
  { label: 'Poster Builder', href: '/build-poster', icon: Palette },
  { label: 'Pengaturan', href: '/setting', icon: Settings },
  { label: 'Login', href: '/login', icon: LogIn }
];

export const SHORT_HADITHS = [
  {
    id: { judul: "Niat", terjemah: "Sesungguhnya setiap amalan tergantung pada niatnya.", riwayat: "HR. Bukhari & Muslim" },
    en: { judul: "Intention", terjemah: "Actions are dependent upon intentions.", riwayat: "Narrated by Bukhari & Muslim" },
    es: { judul: "Intención", terjemah: "Las acciones dependen de las intenciones.", riwayat: "Narrado por Bukhari y Muslim" },
    ru: { judul: "Намерение", terjemah: "Воистину, дела оцениваются только по намерениям.", riwayat: "Передали Бухари и Муслим" },
    ja: { judul: "意図", terjemah: "行いはすべて意図による。", riwayat: "ブハーリーとムスリムによる伝承" },
    de: { judul: "Absicht", terjemah: "Die Taten entsprechen den Absichten.", riwayat: "Überliefert von Bukhari & Muslim" }
  },
  {
    id: { judul: "Agama & Nasihat", terjemah: "Agama itu nasihat.", riwayat: "HR. Muslim" },
    en: { judul: "Religion & Sincerity", terjemah: "Religion is sincerity.", riwayat: "Narrated by Muslim" },
    es: { judul: "Religión y Sinceridad", terjemah: "La religión es sinceridad.", riwayat: "Narrado por Muslim" },
    ru: { judul: "Религия и Искренность", terjemah: "Религия есть искренность.", riwayat: "Передал Муслим" },
    ja: { judul: "宗教と誠実さ", terjemah: "宗教とは誠実さである。", riwayat: "ムスリムによる伝承" },
    de: { judul: "Religion & Aufrichtigkeit", terjemah: "Religion ist Aufrichtigkeit.", riwayat: "Überliefert von Muslim" }
  },
  {
    id: { judul: "Tinggalkan Keraguan", terjemah: "Tinggalkanlah apa yang meragukanmu kepada apa yang tidak meragukanmu.", riwayat: "HR. Tirmidzi" },
    en: { judul: "Leave Doubt", terjemah: "Leave that which makes you doubt for that which does not make you doubt.", riwayat: "Narrated by Tirmidhi" },
    es: { judul: "Deja la Duda", terjemah: "Deja lo que te hace dudar por lo que no te hace dudar.", riwayat: "Narrado por Tirmidhi" },
    ru: { judul: "Оставь Сомнения", terjemah: "Оставь то, что внушает тебе сомнения, и обратись к тому, что сомнений не внушает.", riwayat: "Передал Тирмизи" },
    ja: { judul: "疑いを捨てる", terjemah: "疑わしいものを捨て、疑わしくないものをとりなさい。", riwayat: "ティルミズィーによる伝承" },
    de: { judul: "Zweifel verlassen", terjemah: "Lass das, was dich zweifeln lässt, für das, was dich nicht zweifeln lässt.", riwayat: "Überliefert von Tirmidhi" }
  },
  {
    id: { judul: "Meninggalkan yang Sia-sia", terjemah: "Di antara tanda kebaikan Islam seseorang adalah meninggalkan hal yang tidak bermanfaat baginya.", riwayat: "HR. Tirmidzi" },
    en: { judul: "Leaving the Useless", terjemah: "Part of the perfection of one's Islam is his leaving that which does not concern him.", riwayat: "Narrated by Tirmidhi" },
    es: { judul: "Dejar lo Inútil", terjemah: "Parte de la perfección del Islam de una persona es dejar lo que no le concierne.", riwayat: "Narrado por Tirmidhi" },
    ru: { judul: "Оставление бесполезного", terjemah: "Признаком хорошего исповедания Ислама человеком является его отказ от того, что его не касается.", riwayat: "Передал Тирмизи" },
    ja: { judul: "無益なことを捨てる", terjemah: "自分に関係のないことを放っておくことは、人のイスラームの美しさである。", riwayat: "ティルミズィーによる伝承" },
    de: { judul: "Das Nutzlose lassen", terjemah: "Vom guten Islam eines Menschen ist es, das zu lassen, was ihn nichts angeht.", riwayat: "Überliefert von Tirmidhi" }
  },
  {
    id: { judul: "Mencintai Saudara", terjemah: "Tidak beriman salah seorang di antara kalian hingga ia mencintai untuk saudaranya apa yang ia cintai untuk dirinya sendiri.", riwayat: "HR. Bukhari & Muslim" },
    en: { judul: "Loving for Brother", terjemah: "None of you believes until he loves for his brother that which he loves for himself.", riwayat: "Narrated by Bukhari & Muslim" },
    es: { judul: "Amar al Hermano", terjemah: "Ninguno de vosotros cree hasta que ama para su hermano lo que ama para sí mismo.", riwayat: "Narrado por Bukhari y Muslim" },
    ru: { judul: "Любовь к Брату", terjemah: "Не уверует никто из вас до тех пор, пока не станет желать своему брату того же, чего желает самому себе.", riwayat: "Передали Бухари и Муслим" },
    ja: { judul: "兄弟への愛", terjemah: "自分自身のために愛するものを兄弟のためにも愛さない限り、信仰したことにはならない。", riwayat: "ブハーリーとムスリムによる伝承" },
    de: { judul: "Den Bruder lieben", terjemah: "Keiner von euch glaubt, bis er für seinen Bruder wünscht, was er für sich selbst wünscht.", riwayat: "Überliefert von Bukhari & Muslim" }
  },
  {
    id: { judul: "Jaga Lisan", terjemah: "Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam.", riwayat: "HR. Bukhari & Muslim" },
    en: { judul: "Guard the Tongue", terjemah: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", riwayat: "Narrated by Bukhari & Muslim" },
    es: { judul: "Cuidar la Lengua", terjemah: "Quien crea en Allah y en el Último Día, que hable bien o guarde silencio.", riwayat: "Narrado por Bukhari y Muslim" },
    ru: { judul: "Следи за языком", terjemah: "Пусть тот, кто верует в Аллаха и в Последний день, говорит благое или молчит.", riwayat: "Передали Бухари и Муслим" },
    ja: { judul: "舌を守る", terjemah: "アッラーと最後の日を信じる者は、善いことを言うか、沈黙を守るべきである。", riwayat: "ブハーリーとムスリムによる伝承" },
    de: { judul: "Zunge hüten", terjemah: "Wer an Allah und den Jüngsten Tag glaubt, der soll Gutes sprechen oder schweigen.", riwayat: "Überliefert von Bukhari & Muslim" }
  },
  {
    id: { judul: "Jangan Marah", terjemah: "Jangan marah, maka bagimu surga.", riwayat: "HR. Thabrani" },
    en: { judul: "Don't Get Angry", terjemah: "Do not get angry, and Paradise will be yours.", riwayat: "Narrated by Tabarani" },
    es: { judul: "No te Enojes", terjemah: "No te enojes, y el Paraíso será tuyo.", riwayat: "Narrado por Tabarani" },
    ru: { judul: "Не Гневайся", terjemah: "Не гневайся, и будет тебе Рай.", riwayat: "Передал Табарани" },
    ja: { judul: "怒らない", terjemah: "怒ってはならない。そうすれば、あなたは天国を得るでしょう。", riwayat: "タバラーニーによる伝承" },
    de: { judul: "Werde nicht zornig", terjemah: "Werde nicht zornig, und dir gehört das Paradies.", riwayat: "Überliefert von Tabarani" }
  },
  {
    id: { judul: "Takwa", terjemah: "Bertakwalah kepada Allah di mana saja engkau berada.", riwayat: "HR. Tirmidzi" },
    en: { judul: "Taqwa", terjemah: "Fear Allah wherever you may be.", riwayat: "Narrated by Tirmidhi" },
    es: { judul: "Taqwa", terjemah: "Teme a Allah dondequiera que estés.", riwayat: "Narrado por Tirmidhi" },
    ru: { judul: "Богобоязненность", terjemah: "Бойся Аллаха, где бы ты ни был.", riwayat: "Передал Тирмизи" },
    ja: { judul: "タクワ", terjemah: "どこにいてもアッラーを恐れなさい。", riwayat: "ティルミズィーによる伝承" },
    de: { judul: "Taqwa", terjemah: "Fürchte Allah, wo immer du bist.", riwayat: "Überliefert von Tirmidhi" }
  },
  {
    id: { judul: "Malu & Iman", terjemah: "Malu itu sebagian dari iman.", riwayat: "HR. Bukhari & Muslim" },
    en: { judul: "Modesty & Faith", terjemah: "Modesty is part of faith.", riwayat: "Narrated by Bukhari & Muslim" },
    es: { judul: "Pudor y Fe", terjemah: "El pudor es parte de la fe.", riwayat: "Narrado por Bukhari y Muslim" },
    ru: { judul: "Стыдливость и Вера", terjemah: "Стыдливость — от веры.", riwayat: "Передали Бухари и Муслим" },
    ja: { judul: "羞恥心と信仰", terjemah: "羞恥心は信仰の一部である。", riwayat: "ブハーリーとムスリムによる伝承" },
    de: { judul: "Scham & Glaube", terjemah: "Schamhaftigkeit ist ein Teil des Glaubens.", riwayat: "Überliefert von Bukhari & Muslim" }
  },
  {
    id: { judul: "Kebersihan", terjemah: "Kebersihan adalah sebagian dari iman.", riwayat: "HR. Muslim" },
    en: { judul: "Cleanliness", terjemah: "Cleanliness is half of faith.", riwayat: "Narrated by Muslim" },
    es: { judul: "Limpieza", terjemah: "La limpieza es parte de la fe.", riwayat: "Narrado por Muslim" },
    ru: { judul: "Чистота", terjemah: "Чистота — половина веры.", riwayat: "Передал Муслим" },
    ja: { judul: "清潔さ", terjemah: "清潔さは信仰の半分である。", riwayat: "ムスリムによる伝承" },
    de: { judul: "Reinheit", terjemah: "Reinheit ist die Hälfte des Glaubens.", riwayat: "Überliefert von Muslim" }
  },
  {
    id: { judul: "Senyum Sedekah", terjemah: "Senyummu di hadapan saudaramu adalah sedekah.", riwayat: "HR. Tirmidzi" },
    en: { judul: "Smiling is Charity", terjemah: "Your smile in the face of your brother is charity.", riwayat: "Narrated by Tirmidhi" },
    es: { judul: "Sonreír es Caridad", terjemah: "Tu sonrisa frente a tu hermano es caridad.", riwayat: "Narrado por Tirmidhi" },
    ru: { judul: "Улыбка — Милостыня", terjemah: "Твоя улыбка в лицо твоему брату — это милостыня.", riwayat: "Передал Тирмизи" },
    ja: { judul: "笑顔は施し", terjemah: "兄弟に向けるあなたの笑顔は施しである。", riwayat: "ティルミズィーによる伝承" },
    de: { judul: "Lächeln ist Almosen", terjemah: "Dein Lächeln im Gesicht deines Bruders ist ein Almosen.", riwayat: "Überliefert von Tirmidhi" }
  },
  {
    id: { judul: "Sebaik-baik Manusia", terjemah: "Sebaik-baik kalian adalah orang yang belajar Al-Quran dan mengajarkannya.", riwayat: "HR. Bukhari" },
    en: { judul: "The Best People", terjemah: "The best of you are those who learn the Quran and teach it.", riwayat: "Narrated by Bukhari" },
    es: { judul: "Las Mejores Personas", terjemah: "El mejor de vosotros es el que aprende el Corán y lo enseña.", riwayat: "Narrado por Bukhari" },
    ru: { judul: "Лучшие Люди", terjemah: "Лучшим из вас является тот, кто изучает Коран и обучает ему других.", riwayat: "Передал Бухари" },
    ja: { judul: "最も良い人々", terjemah: "あなたがたの中で最も優れているのは、クルアーンを学び、それを教える者である。", riwayat: "ブハーリーによる伝承" },
    de: { judul: "Die besten Menschen", terjemah: "Der Beste unter euch ist derjenige, der den Koran lernt und ihn lehrt.", riwayat: "Überliefert von Bukhari" }
  },
  {
    id: { judul: "Menahan Amarah", terjemah: "Orang kuat bukanlah yang pandai bergulat, tetapi yang mampu menahan diri saat marah.", riwayat: "HR. Bukhari & Muslim" },
    en: { judul: "Controlling Anger", terjemah: "The strong man is not the one who can wrestle, but the one who controls himself when angry.", riwayat: "Narrated by Bukhari & Muslim" },
    es: { judul: "Controlar la Ira", terjemah: "El hombre fuerte no es el buen luchador; es el que se controla cuando está enojado.", riwayat: "Narrado por Bukhari y Muslim" },
    ru: { judul: "Сдерживание Гнева", terjemah: "Силен не тот, кто может повергнуть других, силен тот, кто владеет собой во время гнева.", riwayat: "Передали Бухари и Муслим" },
    ja: { judul: "怒りを抑える", terjemah: "力強い人とは、レスリングの強い人ではなく、怒ったときに自分を抑えることのできる人である。", riwayat: "ブハーリーとムスリムによる伝承" },
    de: { judul: "Zorn beherrschen", terjemah: "Der Starke ist nicht derjenige, der gut ringen kann, sondern derjenige, der sich im Zorn beherrscht.", riwayat: "Überliefert von Bukhari & Muslim" }
  },
  {
    id: { judul: "Keutamaan Doa", terjemah: "Doa adalah senjata orang mukmin, tiang agama, dan cahaya langit serta bumi.", riwayat: "HR. Hakim" },
    en: { judul: "Power of Dua", terjemah: "Supplication is the weapon of the believer, the pillar of religion, and the light of the heavens and the earth.", riwayat: "Narrated by Hakim" },
    es: { judul: "Poder de la Súplica", terjemah: "La súplica es el arma del creyente, el pilar de la religión y la luz de los cielos y la tierra.", riwayat: "Narrado por Hakim" },
    ru: { judul: "Сила Мольбы", terjemah: "Мольба — это оружие верующего, опора религии и свет небес и земли.", riwayat: "Передал Хаким" },
    ja: { judul: "祈りの力", terjemah: "ドゥア（祈り）は信者の武器であり、宗教の柱であり、天と地の光である。", riwayat: "ハーキムによる伝承" },
    de: { judul: "Macht des Bittgebets", terjemah: "Das Bittgebet ist die Waffe des Gläubigen, die Säule der Religion und das Licht der Himmel und der Erde.", riwayat: "Überliefert von Hakim" }
  },
  {
    id: { judul: "Silaturahmi", terjemah: "Barangsiapa ingin diluaskan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung silaturahmi.", riwayat: "HR. Bukhari" },
    en: { judul: "Ties of Kinship", terjemah: "Whoever would like his provision to be increased and his life to be extended, should uphold the ties of kinship.", riwayat: "Narrated by Bukhari" },
    es: { judul: "Lazos de Parentesco", terjemah: "Quien quiera que se le aumente la provisión y se le prolongue la vida, que mantenga los lazos de parentesco.", riwayat: "Narrado por Bukhari" },
    ru: { judul: "Родственные Связи", terjemah: "Кто хочет, чтобы у него увеличился удел и продлилась жизнь, пусть поддерживает родственные связи.", riwayat: "Передал Бухари" },
    ja: { judul: "親族の絆", terjemah: "糧が増やされ、寿命が延ばされることを望む者は、親族の絆を結ぶべきである。", riwayat: "ブハーリーによる伝承" },
    de: { judul: "Verwandtschaftsbande", terjemah: "Wer möchte, dass sein Lebensunterhalt erweitert und sein Leben verlängert wird, der soll die Verwandtschaftsbande pflegen.", riwayat: "Überliefert von Bukhari" }
  }
];
