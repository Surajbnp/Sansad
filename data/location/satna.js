const satna = {
  district: "Satna",
  tehsils: {
    "Raghuraj Nagar": {
      vidhansabha: "Satna",
      janpad: "Sohawal", // Corrected from Satna
      policeStations: ["Kotwali Satna", "Civil Lines", "Kolgawan"]
    },
    "Rampur Baghelan": {
      vidhansabha: "Rampur Baghelan",
      janpad: "Rampur Baghelan",
      policeStations: ["Rampur Baghelan"] 
    },
    "Nagod": {
      vidhansabha: "Nagod",
      janpad: "Nagod",
      policeStations: ["Nagod", "Singhpur", "Jaso"] // Removed Kothi from here
    },
    "Unchehara": {
      vidhansabha: "Nagod",
      janpad: "Unchehara",
      policeStations: ["Unchehara"]
    },
    "Majhgawan": {
      vidhansabha: "Chitrakoot",
      janpad: "Majhgawan",
      policeStations: ["Majhgawan", "Baroundha", "Nayagaon", "Dharkundi"]
    },
    "Kotar": {
      vidhansabha: "Raigaon", 
      janpad: "Rampur Baghelan", // Corrected from Majhgawan
      policeStations: ["Kotar"]
    },
    "Birsinghpur": {
      vidhansabha: "Raigaon",
      janpad: "Sohawal", // Corrected from Majhgawan
      policeStations: ["Jaitwara", "Sabhapur"] // Jaitwara/Sabhapur protect this zone
    },
    "Kothi": {
      vidhansabha: "Nagod",
      janpad: "Nagod",
      policeStations: ["Kothi"] // Maintained cleanly here
    }
  }
};

export default satna;
