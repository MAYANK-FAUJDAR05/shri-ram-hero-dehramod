export type Language = 'en' | 'hi';

export interface Translations {
  header: {
    officialLineup: string;
    dealershipSub: string;
    showroomHours: string;
    tollFree: string;
    brandName: string;
    brandTagline: string;
    ourVehicles: string;
    motorcycles: string;
    scooters: string;
    vidaEv: string;
    accessories: string;
    compare: string;
    emiCalc: string;
    heroAiChat: string;
    askAi: string;
    directHelpline: string;
    bookTestRide: string;
    languageToggle: string;
  };
  heroBanner: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    description: string;
    ridersTitle: string;
    ridersSub: string;
    warrantyTitle: string;
    warrantySub: string;
    xsensTitle: string;
    xsensSub: string;
    vidaTitle: string;
    vidaSub: string;
  };
  filter: {
    allVehicles: string;
    bikes: string;
    scooters: string;
    vidaEv: string;
    searchPlaceholder: string;
    categoryLabel: string;
    allCategories: string;
    commuterBikes: string;
    premiumCommuter: string;
    sportsPerformance: string;
    suggestedModels: string;
    popularSearches: string;
    noVehiclesFound: string;
    tryDifferentSearch: string;
  };
  showroom: {
    sectionBadge: string;
    headingMain: string;
    headingHighlight: string;
    description: string;
    compareSpecs: string;
    askAiAdvisor: string;
    emiCalculator: string;
    accessories: string;
    priceSheet: string;
    bookTestRide: string;
    categories: string;
    allHeroVehicles: string;
    allMotorcycles: string;
    dealershipSpares: string;
    heroAccessories: string;
    evaluationTools: string;
    compareSpecsSidebar: string;
    festiveBenefits: string;
    festiveDesc: string;
    emiCalcShort: string;
    testRideShort: string;
    noVehiclesTitle: string;
    noVehiclesDesc: string;
    resetFilters: string;
    bestDealAssurance: string;
    corporateTitle: string;
    corporateDesc: string;
    getPriceQuote: string;
  };
  card: {
    exShowroom: string;
    onRoadEst: string;
    lowDownPayment: string;
    specifications: string;
    engineMotor: string;
    mileageRange: string;
    maxPower: string;
    fuelTank: string;
    batteryPack: string;
    transmission: string;
    brakes: string;
    availableColours: string;
    viewDetails: string;
    bookTestRide: string;
    getBestPrice: string;
    estimateMonthlyEmi: string;
    compare: string;
    addToWishlist: string;
    removeFromWishlist: string;
    wishlist: string;
    virtualTour: string;
  };
  favorites: {
    myFavorites: string;
    savedVehicles: string;
    viewSaved: string;
    noFavoritesTitle: string;
    noFavoritesDesc: string;
    exploreVehicles: string;
    clearAll: string;
    showingOnlyFavorites: string;
    showAllVehicles: string;
    sidebarHeading: string;
    sidebarHint: string;
    manageWishlist: string;
    filterFavorites: string;
  };
  accessories: {
    badge: string;
    titleMain: string;
    titleHighlight: string;
    subtitle: string;
    searchPlaceholder: string;
    allGenuine: string;
    helmetsCategory: string;
    guardsCategory: string;
    comfortCategory: string;
    touringCategory: string;
    careCategory: string;
    inquireWhatsApp: string;
    warrantyBadge: string;
    partNo: string;
    compatibility: string;
    viewInquiry: string;
    reserveAtDealership: string;
  };
  footer: {
    filterActive: string;
    showing: string;
    of: string;
    models: string;
    backToTop: string;
    brandDesc: string;
    genuinePartsNote: string;
    showroomHoursTitle: string;
    monSat: string;
    monSatHours: string;
    sun: string;
    sunHours: string;
    serviceCenter: string;
    serviceCenterHours: string;
    locationsTitle: string;
    flagship: string;
    flagshipDesc: string;
    workshop: string;
    workshopDesc: string;
    vidaHub: string;
    vidaHubDesc: string;
    helplineTitle: string;
    salesBooking: string;
    rsaTitle: string;
    copyright: string;
  };
  compare: {
    modalTitle: string;
    modalSubtitle: string;
    vehicle1: string;
    vehicle2: string;
    swap: string;
    popularPicks: string;
    engineDisplacement: string;
    maxPower: string;
    mileageEcon: string;
    gearbox: string;
    brakesSystem: string;
    fuelBattery: string;
    availableColors: string;
    exShowroom: string;
    onRoadEst: string;
    startingEmi: string;
    copySummary: string;
    copied: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      officialLineup: 'OFFICIAL LINEUP',
      dealershipSub: 'Shri Ram Hero • Dehra Mod, Nadbai, Bharatpur, Raj. • Agency No: 8890992086 • Free Accessories with Every Vehicle',
      showroomHours: 'Showroom: 8:00 AM - 6:00 PM (All 7 Days)',
      tollFree: 'Agency No: 8890992086',
      brandName: 'SHRI RAM HERO',
      brandTagline: 'Hero MotoCorp Authorized Dealership',
      ourVehicles: 'Our Vehicles',
      motorcycles: 'Motorcycles',
      scooters: 'Scooters',
      vidaEv: 'Vida EV Series',
      accessories: 'Accessories',
      compare: 'Compare',
      emiCalc: 'EMI Calc',
      heroAiChat: 'Hero AI Chat',
      askAi: 'Ask AI',
      directHelpline: 'Direct Helpline',
      bookTestRide: 'Book Test Ride',
      languageToggle: 'English',
    },
    heroBanner: {
      badge: 'Shri Ram Hero • Authorized Dealership Lineup',
      titleMain: 'OUR HERO',
      titleHighlight: 'VEHICLES',
      description: "Welcome to Shri Ram Hero. Discover the complete range of India's favorite two-wheelers. From legendary high-mileage commuters to aggressive quarter-litre streetfighters and cutting-edge VIDA electric scooters.",
      ridersTitle: '100M+ Riders',
      ridersSub: "World's #1 2-Wheeler Maker",
      warrantyTitle: '5-Year Warranty',
      warrantySub: 'Standard Factory Protection',
      xsensTitle: 'xSens & i3S Tech',
      xsensSub: 'Patented Fuel Optimization',
      vidaTitle: 'VIDA EV Hub',
      vidaSub: '2,500+ Fast Charging Points',
    },
    filter: {
      allVehicles: 'All Vehicles',
      bikes: 'Bikes',
      scooters: 'Scooters',
      vidaEv: 'Vida EV',
      searchPlaceholder: 'Search model, 125cc, ABS, Flex...',
      categoryLabel: 'Category:',
      allCategories: 'All Categories',
      commuterBikes: 'Commuter Bikes',
      premiumCommuter: 'Premium Commuter',
      sportsPerformance: 'Sports / Performance',
      suggestedModels: 'Suggested Models',
      popularSearches: 'Popular Models',
      noVehiclesFound: 'No vehicles found matching',
      tryDifferentSearch: 'Try searching by model name, displacement (e.g. 125cc), or feature.',
    },
    showroom: {
      sectionBadge: 'Complete Two-Wheeler Showroom',
      headingMain: 'OUR HERO',
      headingHighlight: 'VEHICLES',
      description: 'Select any Hero motorcycle, scooter, or electric vehicle below to inspect authentic specifications, model-specific features, and on-road pricing.',
      compareSpecs: 'Compare Specs',
      askAiAdvisor: 'Ask AI Advisor',
      emiCalculator: 'EMI Calculator',
      accessories: 'Accessories',
      priceSheet: 'Price Sheet',
      bookTestRide: 'Book Test Ride',
      categories: 'Categories',
      allHeroVehicles: 'All Hero Vehicles',
      allMotorcycles: 'All Motorcycles',
      dealershipSpares: 'Dealership Spares',
      heroAccessories: 'Hero Accessories',
      evaluationTools: 'Evaluation Tools',
      compareSpecsSidebar: 'Compare Specs',
      festiveBenefits: 'Festive Benefits',
      festiveDesc: 'Low 8.5% interest rates & instant exchange approvals.',
      emiCalcShort: 'EMI Calc',
      testRideShort: 'Test Ride',
      noVehiclesTitle: 'No Hero Vehicles Found',
      noVehiclesDesc: 'We couldn\'t find any vehicle matching your search. Try searching for Splendor, Xtreme, Karizma, Xoom, Destini, or Vida.',
      resetFilters: 'Reset Filters & Show All Vehicles',
      bestDealAssurance: 'Best Deal Assurance',
      corporateTitle: 'Looking for corporate fleet or multiple two-wheelers?',
      corporateDesc: 'Our Hero Authorized Sales Consultants offer personalized on-road price estimates, finance packages through Hero FinCorp, and guaranteed exchange bonuses.',
      getPriceQuote: 'Price = Best Price',
    },
    card: {
      exShowroom: 'Price = Best Price',
      onRoadEst: 'Price = Best Price',
      lowDownPayment: 'Low Down Payment',
      specifications: 'SPECIFICATIONS',
      engineMotor: 'Engine / Motor',
      mileageRange: 'Mileage / Range',
      maxPower: 'Max Power',
      fuelTank: 'Fuel Tank',
      batteryPack: 'Battery Pack',
      transmission: 'Transmission',
      brakes: 'Brakes',
      availableColours: 'Available Colours',
      viewDetails: 'VIEW DETAILS',
      bookTestRide: 'BOOK TEST RIDE',
      getBestPrice: 'PRICE = BEST PRICE',
      estimateMonthlyEmi: 'EMI',
      compare: 'Compare',
      addToWishlist: 'Add to Wishlist',
      removeFromWishlist: 'Remove from Wishlist',
      wishlist: 'Wishlist',
      virtualTour: '360° Tour',
    },
    favorites: {
      myFavorites: 'My Favorites',
      savedVehicles: 'Saved Vehicles',
      viewSaved: 'View Saved Models',
      noFavoritesTitle: 'No Saved Vehicles Yet',
      noFavoritesDesc: 'Click the heart icon on any motorcycle or scooter card to add it to your personal wishlist.',
      exploreVehicles: 'Explore All Models',
      clearAll: 'Clear Wishlist',
      showingOnlyFavorites: 'Showing Saved Vehicles',
      showAllVehicles: 'Show All Vehicles',
      sidebarHeading: 'My Favorites',
      sidebarHint: 'Click heart on any card to save',
      manageWishlist: 'Manage Wishlist',
      filterFavorites: 'Filter by Favorites',
    },
    accessories: {
      badge: '100% Factory Certified HGA Accessories',
      titleMain: 'HERO GENUINE',
      titleHighlight: 'ACCESSORIES (HGA)',
      subtitle: '100% Genuine factory-certified parts & accessories precision-engineered for your Hero motorcycle or scooter. Includes 1-year dealership warranty and instant on-spot showroom fitment.',
      searchPlaceholder: 'Search helmet, crash guard, seat cover, part no...',
      allGenuine: 'All Genuine Accessories',
      helmetsCategory: 'Helmets & Rider Safety',
      guardsCategory: 'Crash & Body Protection',
      comfortCategory: 'Seat Covers & Comfort',
      touringCategory: 'Touring & Utility Luggage',
      careCategory: 'Maintenance & Smart Security',
      inquireWhatsApp: 'Inquire via WhatsApp',
      warrantyBadge: '1-Year Warranty',
      partNo: 'Part No',
      compatibility: 'Fits',
      viewInquiry: 'Order Inquiry',
      reserveAtDealership: 'Reserve at Dealership',
    },
    footer: {
      filterActive: 'Filter Active:',
      showing: 'Showing',
      of: 'of',
      models: 'Hero MotoCorp Models',
      backToTop: 'Back to Top',
      brandDesc: 'Authorized Hero MotoCorp Dealership & Service Center. Dehra Mod, Nadbai, Bharatpur, Raj. Showcasing the complete range of Hero motorcycles, scooters, and genuine accessories with free delivery perks.',
      genuinePartsNote: '100% Genuine Hero Spare Parts & Free Accessory Kit with Every Vehicle',
      showroomHoursTitle: 'Showroom Hours',
      monSat: 'Monday - Saturday:',
      monSatHours: '8:00 AM - 6:00 PM',
      sun: 'Sunday:',
      sunHours: '8:00 AM - 6:00 PM',
      serviceCenter: 'Service Center:',
      serviceCenterHours: '8:00 AM - 6:00 PM',
      locationsTitle: 'Showroom Address',
      flagship: 'Shri Ram Hero (Main Agency)',
      flagshipDesc: 'Dehra Mod, Nadbai, Bharatpur, Raj.',
      workshop: 'Shri Ram Hero - Workshop & Spares',
      workshopDesc: 'Dehra Mod, Nadbai, Bharatpur, Raj.',
      vidaHub: 'Shri Ram Hero - Electric Hub',
      vidaHubDesc: 'Dehra Mod, Nadbai, Bharatpur, Raj.',
      helplineTitle: 'Agency Contact',
      salesBooking: 'Agency No:',
      rsaTitle: 'Agency Service Desk:',
      copyright: 'Shri Ram Hero - Authorized Hero MotoCorp Dealership. All vehicle names, trademarks, logos, specifications, and images are the intellectual property of Hero MotoCorp Ltd.',
    },
    compare: {
      modalTitle: 'Vehicle Comparison',
      modalSubtitle: 'Side-by-side technical specification & pricing evaluation',
      vehicle1: 'Vehicle 1',
      vehicle2: 'Vehicle 2',
      swap: 'Swap Vehicles',
      popularPicks: 'Popular Matchups',
      engineDisplacement: 'Engine / Displacement',
      maxPower: 'Maximum Power',
      mileageEcon: 'Mileage / Certified Range',
      gearbox: 'Transmission / Gearbox',
      brakesSystem: 'Braking Setup',
      fuelBattery: 'Fuel Tank / Battery Pack',
      availableColors: 'Available Colors',
      exShowroom: 'Ex-Showroom Price',
      onRoadEst: 'Est. On-Road Price',
      startingEmi: 'Estimated EMI',
      copySummary: 'Copy Summary',
      copied: 'Copied to Clipboard!',
      close: 'Close',
    },
  },
  hi: {
    header: {
      officialLineup: 'आधिकारिक शोरूम',
      dealershipSub: 'श्री राम हीरो • डेहरा मोड़, नदबई, भरतपुर, राज. • एजेंसी नं.: 8890992086 • प्रत्येक वाहन के साथ फ्री एक्सेसरीज़',
      showroomHours: 'शोरूम समय: सुबह 8:00 - शाम 6:00 (सातों दिन)',
      tollFree: 'एजेंसी नं.: 8890992086',
      brandName: 'श्री राम हीरो',
      brandTagline: 'हीरो मोटोकॉर्प अधिकृत डीलरशिप',
      ourVehicles: 'हमारे वाहन',
      motorcycles: 'मोटरसाइकिलें',
      scooters: 'स्कूटर',
      vidaEv: 'विडा ईवी',
      accessories: 'एक्सेसरीज़',
      compare: 'तुलना करें',
      emiCalc: 'ईएमआई कैलकुलेटर',
      heroAiChat: 'हीरो एआई चैट',
      askAi: 'एआई सलाहकार',
      directHelpline: 'हेल्पलाइन',
      bookTestRide: 'टेस्ट राइड बुक करें',
      languageToggle: 'हिंदी',
    },
    heroBanner: {
      badge: 'श्री राम हीरो • अधिकृत डीलरशिप लाइनअप',
      titleMain: 'हमारे हीरो',
      titleHighlight: 'वाहन',
      description: 'श्री राम हीरो में आपका स्वागत है। भारत के सबसे भरोसेमंद दोपहिया वाहनों की संपूर्ण श्रृंखला देखें। सर्वाधिक माइलेज वाली कम्यूटर बाइकों से लेकर दमदार स्पोर्ट्स बाइक और आधुनिक विडा इलेक्ट्रिक स्कूटर तक।',
      ridersTitle: '10 करोड़+ राइडर्स',
      ridersSub: 'विश्व की नंबर 1 दोपहिया निर्माता',
      warrantyTitle: '5 साल की वारंटी',
      warrantySub: 'मानक फैक्ट्री सुरक्षा',
      xsensTitle: 'xSens व i3S तकनीक',
      xsensSub: 'पेटेंटेड ईंधन बचत तकनीक',
      vidaTitle: 'विडा ईवी हब',
      vidaSub: '2,500+ फास्ट चार्जिंग स्टेशन',
    },
    filter: {
      allVehicles: 'सभी वाहन',
      bikes: 'बाइक',
      scooters: 'स्कूटर',
      vidaEv: 'विडा ईवी',
      searchPlaceholder: 'मॉडल, 125cc, ABS, माइलेज आदि खोजें...',
      categoryLabel: 'श्रेणी:',
      allCategories: 'सभी श्रेणियाँ',
      commuterBikes: 'कम्यूटर बाइक',
      premiumCommuter: 'प्रीमियम कम्यूटर',
      sportsPerformance: 'स्पोर्ट्स / परफॉरमेंस',
      suggestedModels: 'सुझाए गए मॉडल',
      popularSearches: 'लोकप्रिय मॉडल',
      noVehiclesFound: 'कोई वाहन नहीं मिला',
      tryDifferentSearch: 'मॉडल का नाम, इंजन क्षमता (उदा. 125cc) या फीचर लिखकर खोजें।',
    },
    showroom: {
      sectionBadge: 'संपूर्ण टू-व्हीलर शोरूम',
      headingMain: 'हमारे हीरो',
      headingHighlight: 'वाहन',
      description: 'विस्तृत स्पेसिफिकेशन्स देखने, मॉडल फीचर्स जांचने या ऑन-रोड कीमत जानने के लिए नीचे किसी भी हीरो मोटरसाइकिल, स्कूटर या इलेक्ट्रिक वाहन का चयन करें।',
      compareSpecs: 'स्पेक्स तुलना',
      askAiAdvisor: 'एआई सलाहकार से पूछें',
      emiCalculator: 'ईएमआई कैलकुलेटर',
      accessories: 'एक्सेसरीज़',
      priceSheet: 'मूल्य सूची',
      bookTestRide: 'टेस्ट राइड बुक करें',
      categories: 'श्रेणियाँ',
      allHeroVehicles: 'सभी हीरो वाहन',
      allMotorcycles: 'सभी मोटरसाइकिलें',
      dealershipSpares: 'डीलरशिप स्पेयर पार्ट्स',
      heroAccessories: 'हीरो एक्सेसरीज़',
      evaluationTools: 'तुलना टूल्स',
      compareSpecsSidebar: 'स्पेक्स तुलना करें',
      festiveBenefits: 'त्योहारी विशेष ऑफर',
      festiveDesc: 'मात्र 8.5% न्यूनतम ब्याज दर व तुरंत एक्सचेंज सुविधा।',
      emiCalcShort: 'ईएमआई',
      testRideShort: 'टेस्ट राइड',
      noVehiclesTitle: 'कोई हीरो वाहन नहीं मिला',
      noVehiclesDesc: 'आपकी खोज से मेल खाता कोई वाहन नहीं मिला। कृपया स्प्लेंडर, एक्सट्रीम, करिश्मा, जूम, डेस्टिनी या विडा खोजें।',
      resetFilters: 'फ़िल्टर रीसेट करें और सभी वाहन देखें',
      bestDealAssurance: 'सर्वश्रेष्ठ कीमत का भरोसा',
      corporateTitle: 'कॉर्पोरेट या एक से अधिक दोपहिया वाहनों की आवश्यकता है?',
      corporateDesc: 'हमारे अधिकृत हीरो सेल्स सलाहकार ऑन-रोड कीमत, हीरो फिनकॉर्प फाइनेंस और गारंटीकृत एक्सचेंज बोनस के साथ व्यक्तिगत सहायता प्रदान करते हैं।',
      getPriceQuote: 'कीमत = सर्वश्रेष्ठ कीमत (Price = Best Price)',
    },
    card: {
      exShowroom: 'कीमत = सर्वश्रेष्ठ कीमत',
      onRoadEst: 'कीमत = सर्वश्रेष्ठ कीमत',
      lowDownPayment: 'न्यूनतम डाउन पेमेंट',
      specifications: 'तकनीकी विवरण (स्पेसिफिकेशन्स)',
      engineMotor: 'इंजन / मोटर',
      mileageRange: 'माइलेज / रेंज',
      maxPower: 'अधिकतम पावर',
      fuelTank: 'फ्यूल टैंक',
      batteryPack: 'बैटरी पैक',
      transmission: 'ट्रांसमिशन',
      brakes: 'ब्रेक सिस्टम',
      availableColours: 'उपलब्ध रंग',
      viewDetails: 'विवरण देखें',
      bookTestRide: 'टेस्ट राइड बुक करें',
      getBestPrice: 'कीमत = सर्वश्रेष्ठ कीमत',
      estimateMonthlyEmi: 'ईएमआई',
      compare: 'तुलना करें',
      addToWishlist: 'विशलिस्ट में जोड़ें',
      removeFromWishlist: 'विशलिस्ट से हटाएं',
      wishlist: 'विशलिस्ट',
      virtualTour: '360° वर्चुअल टूर',
    },
    favorites: {
      myFavorites: 'मेरी पसंद (विशलिस्ट)',
      savedVehicles: 'सहेजे गए वाहन',
      viewSaved: 'पसंदीदा मॉडल देखें',
      noFavoritesTitle: 'कोई पसंदीदा वाहन सहेजा नहीं गया',
      noFavoritesDesc: 'अपनी पसंद की बाइक या स्कूटर को सहेजने के लिए किसी भी कार्ड पर दिए गए हार्ट (दिल) आइकन पर क्लिक करें।',
      exploreVehicles: 'सभी मॉडल देखें',
      clearAll: 'विशलिस्ट खाली करें',
      showingOnlyFavorites: 'सहेजे गए वाहन दिखाए जा रहे हैं',
      showAllVehicles: 'सभी वाहन देखें',
      sidebarHeading: 'मेरी पसंद (विशलिस्ट)',
      sidebarHint: 'सहेजने हेतु कार्ड पर हार्ट आइकन दबाएं',
      manageWishlist: 'विशलिस्ट प्रबंधित करें',
      filterFavorites: 'पसंदीदा फ़िल्टर करें',
    },
    accessories: {
      badge: '100% फैक्ट्री प्रमाणित HGA एक्सेसरीज़',
      titleMain: 'हीरो जेन्युइन',
      titleHighlight: 'एक्सेसरीज़ (HGA)',
      subtitle: 'आपकी हीरो बाइक और स्कूटर के लिए 100% असली, फैक्ट्री-प्रमाणित पार्ट्स एवं एक्सेसरीज़। 1 वर्ष की डीलरशिप वारंटी और तुरंत शोरूम में फिटमेंट शामिल।',
      searchPlaceholder: 'हेलमेट, क्रैश गार्ड, सीट कवर, पार्ट नंबर खोजें...',
      allGenuine: 'सभी असली एक्सेसरीज़',
      helmetsCategory: 'हेलमेट व सुरक्षा',
      guardsCategory: 'क्रैश गार्ड व बॉडी प्रोटेक्शन',
      comfortCategory: 'सीट कवर व कम्फर्ट',
      touringCategory: 'टूरिंग व यूटिलिटी लगेज',
      careCategory: 'मेंटेनेंस व स्मार्ट सिक्योरिटी',
      inquireWhatsApp: 'व्हाट्सएप पर ऑर्डर / पूछताछ',
      warrantyBadge: '1-वर्ष वारंटी',
      partNo: 'पार्ट सं.',
      compatibility: 'उपयुक्त',
      viewInquiry: 'ऑर्डर पूछताछ',
      reserveAtDealership: 'शोरूम पर रिज़र्व करें',
    },
    footer: {
      filterActive: 'सक्रिय फ़िल्टर:',
      showing: 'दिखाए जा रहे हैं',
      of: 'कुल',
      models: 'हीरो मोटोकॉर्प मॉडल',
      backToTop: 'ऊपर जाएं',
      brandDesc: 'अधिकृत हीरो मोटोकॉर्प डीलरशिप एवं सर्विस सेंटर। डेहरा मोड़, नदबई, भरतपुर, राज.। हीरो मोटरसाइकिलों, स्कूटरों व विडा इलेक्ट्रिक वाहनों की संपूर्ण श्रृंखला एवं फ्री डिलीवरी एक्सेसरीज़।',
      genuinePartsNote: '100% असली हीरो स्पेयर पार्ट्स एवं प्रत्येक वाहन के साथ फ्री एक्सेसरी किट',
      showroomHoursTitle: 'शोरूम समय',
      monSat: 'सोमवार - शनिवार:',
      monSatHours: 'सुबह 8:00 - शाम 6:00',
      sun: 'रविवार:',
      sunHours: 'सुबह 8:00 - शाम 6:00',
      serviceCenter: 'सर्विस सेंटर:',
      serviceCenterHours: 'सुबह 8:00 - शाम 6:00',
      locationsTitle: 'शोरूम का पता',
      flagship: 'श्री राम हीरो (मुख्य एजेंसी)',
      flagshipDesc: 'डेहरा मोड़, नदबई, भरतपुर, राज.',
      workshop: 'श्री राम हीरो - वर्कशॉप व स्पेयर पार्ट्स',
      workshopDesc: 'डेहरा मोड़, नदबई, भरतपुर, राज.',
      vidaHub: 'श्री राम हीरो - विडा ईवी हब',
      vidaHubDesc: 'डेहरा मोड़, नदबई, भरतपुर, राज.',
      helplineTitle: 'एजेंसी संपर्क',
      salesBooking: 'एजेंसी नं.:',
      rsaTitle: 'एजेंसी सहायता:',
      copyright: 'श्री राम हीरो - अधिकृत हीरो मोटोकॉर्प डीलरशिप। सभी वाहन के नाम, ट्रेडमार्क, लोगो, विनिर्देश और चित्र हीरो मोटोकॉर्प लिमिटेड की बौद्धिक संपदा हैं।',
    },
    compare: {
      modalTitle: 'वाहन तुलना',
      modalSubtitle: 'तकनीकी विवरण और ऑन-रोड मूल्य का आमने-सामने विश्लेषण',
      vehicle1: 'वाहन 1',
      vehicle2: 'वाहन 2',
      swap: 'वाहन बदलें',
      popularPicks: 'लोकप्रिय तुलना',
      engineDisplacement: 'इंजन / डिस्प्लेसमेंट',
      maxPower: 'अधिकतम पावर',
      mileageEcon: 'माइलेज / प्रमाणित रेंज',
      gearbox: 'ट्रांसमिशन / गियरबॉक्स',
      brakesSystem: 'ब्रेकिंग सिस्टम',
      fuelBattery: 'फ्यूल टैंक / बैटरी पैक',
      availableColors: 'उपलब्ध रंग',
      exShowroom: 'एक्स-शोरूम कीमत',
      onRoadEst: 'अनुमानित ऑन-रोड कीमत',
      startingEmi: 'अनुमानित ईएमआई',
      copySummary: 'विवरण कॉपी करें',
      copied: 'कॉपी हो गया!',
      close: 'बंद करें',
    },
  },
};
