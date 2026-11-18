/**
 * Bangladesh Administrative Divisions, All 64 Districts, and Complete Upazila Dataset.
 */

export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh"
] as const

export type Division = typeof DIVISIONS[number]

export const DISTRICTS: Record<Division, string[]> = {
  "Dhaka": [
    "Dhaka", "Gazipur", "Narayanganj", "Tangail", "Kishoreganj", 
    "Manikganj", "Munshiganj", "Narsingdi", "Faridpur", "Gopalganj", 
    "Madaripur", "Rajbari", "Shariatpur"
  ],
  "Chattogram": [
    "Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Brahmanbaria", 
    "Noakhali", "Chandpur", "Lakshmipur", "Rangamati", "Khagrachhari", 
    "Bandarban"
  ],
  "Rajshahi": [
    "Rajshahi", "Bogura", "Joypurhat", "Naogaon", "Natore", 
    "Chapainawabganj", "Pabna", "Sirajganj"
  ],
  "Khulna": [
    "Khulna", "Bagerhat", "Satkhira", "Jashore", "Jhenaidah", 
    "Magura", "Narail", "Chuadanga", "Kushtia", "Meherpur"
  ],
  "Barishal": [
    "Barishal", "Barguna", "Bhola", "Jhalokathi", "Patuakhali", "Pirojpur"
  ],
  "Sylhet": [
    "Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"
  ],
  "Rangpur": [
    "Rangpur", "Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", 
    "Nilphamari", "Panchagarh", "Thakurgaon"
  ],
  "Mymensingh": [
    "Mymensingh", "Jamalpur", "Netrokona", "Sherpur"
  ]
}

export const ALL_DISTRICTS = Object.values(DISTRICTS).flat().sort()

export const UPAZILAS: Record<string, string[]> = {
  // --- DHAKA DIVISION (13 Districts) ---
  "Dhaka": ["Savar", "Dhamrai", "Keraniganj", "Nawabganj", "Dohar", "Tejgaon", "Mirpur", "Mohammadpur", "Dhanmondi", "Gulshan", "Uttara"],
  "Gazipur": ["Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur"],
  "Narayanganj": ["Narayanganj Sadar", "Bandar", "Rupganj", "Sonargaon", "Araihazar"],
  "Tangail": ["Tangail Sadar", "Basail", "Bhuapur", "Delduar", "Ghatail", "Gopalpur", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Dhanbari", "Kalihati"],
  "Kishoreganj": ["Kishoreganj Sadar", "Bajitpur", "Bhairab", "Hossainpur", "Itna", "Karimganj", "Katiadi", "Kuliarchar", "Mithamain", "Nikli", "Pakundia", "Tarail"],
  "Manikganj": ["Manikganj Sadar", "Singair", "Shibalaya", "Saturia", "Harirampur", "Ghior", "Daulatpur"],
  "Munshiganj": ["Munshiganj Sadar", "Tongibari", "Sreenagar", "Louhajang", "Gajaria", "Sirajdikhan"],
  "Narsingdi": ["Narsingdi Sadar", "Belabo", "Monohardi", "Palash", "Raipura", "Shibpur"],
  "Faridpur": ["Faridpur Sadar", "Boalmari", "Alfadanga", "Madhukhali", "Bhanga", "Nagarkanda", "Charbhadrasan", "Sadarpur", "Saltha"],
  "Gopalganj": ["Gopalganj Sadar", "Kashiani", "Kotalipara", "Muksudpur", "Tungipara"],
  "Madaripur": ["Madaripur Sadar", "Kalkini", "Rajoir", "Shibchar", "Dasar"],
  "Rajbari": ["Rajbari Sadar", "Goalanda", "Pangsha", "Baliakandi", "Kalukhali"],
  "Shariatpur": ["Shariatpur Sadar", "Damudya", "Naria", "Jajira", "Bhedarganj", "Gosairhat"],

  // --- CHATTOGRAM DIVISION (11 Districts) ---
  "Chattogram": ["Anwara", "Banshkhali", "Boalkhali", "Chandanaish", "Fatikchhari", "Hathazari", "Karnaphuli", "Lohagara", "Mirsharai", "Patiya", "Rangunia", "Raozan", "Sandwip", "Satkania", "Sitakunda"],
  "Cox's Bazar": ["Cox's Bazar Sadar", "Chakaria", "Maheshkhali", "Teknaf", "Ukhiya", "Ramu", "Pekua", "Kutubdia", "Eidgaon"],
  "Cumilla": ["Cumilla Adarsha Sadar", "Cumilla Sadar Dakshin", "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram", "Daudkandi", "Debidwar", "Homna", "Laksam", "Lalmai", "Meghna", "Monohargonj", "Muradnagar", "Nangalkot", "Titas"],
  "Feni": ["Feni Sadar", "Chhagalnaiya", "Daganbhuiyan", "Parshuram", "Fhulgazi", "Sonagazi"],
  "Brahmanbaria": ["Brahmanbaria Sadar", "Ashuganj", "Bancharampur", "Kasba", "Nabinagar", "Nasirnagar", "Sarail", "Akhaura", "Bijoynagar"],
  "Noakhali": ["Noakhali Sadar", "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Senbagh", "Sonaimuri", "Subarnachar", "Kabirhat"],
  "Chandpur": ["Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj", "Kachua", "Matlab Dakshin", "Matlab Uttar", "Shahrasti"],
  "Lakshmipur": ["Lakshmipur Sadar", "Raipur", "Ramganj", "Ramgati", "Kamalnagar"],
  "Rangamati": ["Rangamati Sadar", "Baghaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai", "Kawkhali", "Langadu", "Naniarchar", "Rajasthali"],
  "Khagrachhari": ["Khagrachhari Sadar", "Dighinala", "Lakshmichhari", "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh", "Guimara"],
  "Bandarban": ["Bandarban Sadar", "Alikadam", "Naikhyongchhari", "Rowangchhari", "Ruma", "Thanchi", "Lama"],

  // --- RAJSHAHI DIVISION (8 Districts) ---
  "Rajshahi": ["Paba", "Durgapur", "Mohonpur", "Charghat", "Bagha", "Tanore", "Godagari", "Puthia", "Bagmara"],
  "Bogura": ["Bogura Sadar", "Adamdighi", "Dhunat", "Dhupchanchia", "Gabtali", "Kahaloo", "Nandigram", "Sariakandi", "Sahajanpur", "Sherpur", "Shibganj", "Sonatala"],
  "Joypurhat": ["Joypurhat Sadar", "Akkelpur", "Kalai", "Khetlal", "Panchbibi"],
  "Naogaon": ["Naogaon Sadar", "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mohadevpur", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar"],
  "Natore": ["Natore Sadar", "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Singra", "Naldanga"],
  "Chapainawabganj": ["Chapainawabganj Sadar", "Bholahat", "Gomastapur", "Nachole", "Shibganj"],
  "Pabna": ["Pabna Sadar", "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur", "Ishwardi", "Santhia", "Sujanagar"],
  "Sirajganj": ["Sirajganj Sadar", "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj", "Shahjadpur", "Tarash", "Ullahpara"],

  // --- KHULNA DIVISION (10 Districts) ---
  "Khulna": ["Koyra", "Dumuria", "Terokhada", "Dighalia", "Dacope", "Paikgachha", "Phultala", "Batiaghata", "Rupsha"],
  "Bagerhat": ["Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat", "Mongla", "Morrelganj", "Rampal", "Sarankhola"],
  "Satkhira": ["Satkhira Sadar", "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Shyamnagar", "Tala"],
  "Jashore": ["Jashore Sadar", "Abhaynagar", "Bagherpara", "Chaugachha", "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha"],
  "Jhenaidah": ["Jhenaidah Sadar", "Harinakundu", "Kaliganj", "Kotchandpur", "Maheshpur", "Shailkupa"],
  "Magura": ["Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur"],
  "Narail": ["Narail Sadar", "Kalia", "Lohagara"],
  "Chuadanga": ["Chuadanga Sadar", "Alamdanga", "Damurhuda", "Jibannagar"],
  "Kushtia": ["Kushtia Sadar", "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Mirpur"],
  "Meherpur": ["Meherpur Sadar", "Gangni", "Mujibnagar"],

  // --- BARISHAL DIVISION (6 Districts) ---
  "Barishal": ["Barishal Sadar", "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur"],
  "Barguna": ["Barguna Sadar", "Amtali", "Bamna", "Betagi", "Patharghata", "Taltali"],
  "Bhola": ["Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan", "Lalmohan", "Manpura", "Tazumuddin"],
  "Jhalokathi": ["Jhalokathi Sadar", "Kathalia", "Nalchity", "Rajapur"],
  "Patuakhali": ["Patuakhali Sadar", "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara", "Mirzaganj", "Rangabali"],
  "Pirojpur": ["Pirojpur Sadar", "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur", "Nesarabad (Swarupkati)", "Indurkani"],

  // --- SYLHET DIVISION (4 Districts) ---
  "Sylhet": ["Sylhet Sadar", "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat", "Osmani Nagar", "Zakiganj", "South Surma"],
  "Moulvibazar": ["Moulvibazar Sadar", "Barlekha", "Juri", "Kamalganj", "Kulaura", "Rajnagar", "Sreemangal"],
  "Habiganj": ["Habiganj Sadar", "Ajmiriganj", "Bahubal", "Baniyachong", "Chunarughat", "Lakhai", "Madhabpur", "Nabiganj", "Sayestaganj"],
  "Sunamganj": ["Sunamganj Sadar", "Bishwamvarpur", "Chhatak", "Derai", "Dharamapasha", "Dowarabazar", "Jagannathpur", "Jamalganj", "Sullah", "Tahirpur", "Shantiganj", "Madhyanagar"],

  // --- RANGPUR DIVISION (8 Districts) ---
  "Rangpur": ["Rangpur Sadar", "Badarganj", "Gangachhara", "Kaunia", "Mithapukur", "Pirgachha", "Pirganj", "Taraganj"],
  "Dinajpur": ["Dinajpur Sadar", "Birol", "Birganj", "Birampur", "Bochaganj", "Chirirbandar", "Fulbari", "Ghoraghat", "Hakimpur", "Kaharole", "Khansama", "Nawabganj", "Parbatipur"],
  "Gaibandha": ["Gaibandha Sadar", "Fulchhari", "Gobindaganj", "Palashbari", "Sadullapur", "Sughatta", "Sundarganj"],
  "Kurigram": ["Kurigram Sadar", "Bhurungamari", "Char Rajibpur", "Chilmari", "Phulbari", "Nageshwari", "Rajarhat", "Roulmari", "Ulipur"],
  "Lalmonirhat": ["Lalmonirhat Sadar", "Aditmari", "Hatibandha", "Kaliganj", "Patgram"],
  "Nilphamari": ["Nilphamari Sadar", "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Syedpur"],
  "Panchagarh": ["Panchagarh Sadar", "Atwari", "Boda", "Debiganj", "Tetulia"],
  "Thakurgaon": ["Thakurgaon Sadar", "Baliadangi", "Haripur", "Pirganj", "Ranisankhail"],

  // --- MYMENSINGH DIVISION (4 Districts) ---
  "Mymensingh": ["Mymensingh Sadar", "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur", "Haluaghat", "Ishwarganj", "Muktagachha", "Nandail", "Phulpur", "Tara Khanda", "Trishal"],
  "Jamalpur": ["Jamalpur Sadar", "Baksiganj", "Dewanganj", "Islampur", "Madarganj", "Melandaha", "Sarishabari"],
  "Netrokona": ["Netrokona Sadar", "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua", "Madan", "Mohanganj", "Purbadhala", "Khaliajuri"],
  "Sherpur": ["Sherpur Sadar", "Jhenaigati", "Nakla", "Nalitabari", "Sreebardi"]
}

export function getUpazilasForDistrict(district?: string | null): string[] {
  if (!district) return []
  return UPAZILAS[district] || ["Sadar"]
}

export function getDistrictsForDivision(division?: Division | null): string[] {
  if (!division) return ALL_DISTRICTS
  return DISTRICTS[division] || []
}
