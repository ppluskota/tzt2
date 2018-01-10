// zwolnij wszystkich pracownikow majacych wiecej niz 4 uwagi badz nie pracujacych przy zadnych projektach oraz
// nie majacych stanowiska Boss
db.workers.update(
	{
		$and: [
			{ stanowisko: { $ne: "Boss" } },
			{ $or: [
				{ "uwagi.5": { $exists: true } },
				{ projekty: { $size: 0 } }
			]}
		]
	},
	{
		$set: {
			zatrudniony: false
		}
	}
);

// zwieksz pensje o 1000zl wszystkim zatrudnionym pracownikom, ktorzy pracuja przy wiecej niz dwoch projektach nie majacych stanowiska Trainee oraz
// nie maja zadnych nagan lub mieszkajacych w Polsce
db.workers.update(
	{
		$and: [
			{ "projekty.3": { $exists: true } },
			{ stanowisko: { $ne: "Trainee" } },
			{ $or: [
				{ "uwagi.typ": { $ne: "nagana" } },
				{ kraj: "Polska"}
			]}
		]
	},
	{
		$inc: { placa: 1000 }
	}
);

// zmien imiona wszystkich obcokrajowcow, ktorzy maja parzysty wiek na Puppy
// zmniejsz ich pensje o 200zl
// dodaj znajomosc technologii Pascal na poziomie podstawowym
db.workers.update(
	{
		$and: [
			{ wiek: { $mod: [2, 0] } },
			{ kraj: { $ne: "Polska" } }
		]
	},
	{
		$inc: { placa: -200 },
		$set: {
			imie: "Puppy",
		},
		$push: {
			technologie: {
				"nazwa": "Pascal",
				"poziom_zaawansowania": "podstawowy"
			}
		}
	}
);

// dodaj nowego stazyste (Trainee)
// z pensja 2200
// inne dane przykladowe
// dodaj go do projektu nr 12
// dodaj nowego pracownika (Junior iOS Developer)
// przykladowe dane
// z uwagami (nagana oraz pochwala)
db.workers.insertMany([
	{
		"_id": 100,
		 "imie": "Bartosz",
		 "nazwisko": "Koliber",
         "stanowisko": "Trainee",
         "adres": "Warszawa, Kukuczki 12/2",
         "poczta": "62-200 Warszawa",
         "telefon": "23480054",
         "wiek": 19,
         "placa": 2200,
         "zatrudniony": true,
         "data_zatrudnienia": "01/01/2018",
         "pesel": "470219025",
         "email": "mlody2@gmail.com",
         "nr_konta": "11 3333 2222 4444 5555 2223 3332",
         "nr_ubezpieczenia": "HB21247",
         "kraj": "Polska",
		 "technologie": [],
		 "projekty": [
			{
				"_id": "12",
				"data_przystapienia": "01/01/2018",
				"zadania": []
			}
		 ],
		 "uwagi": []
	},
	{
		"_id": 101,
		 "imie": "Tomasz",
		 "nazwisko": "Mucha",
         "stanowisko": "Junior iOS Developer",
         "adres": "Rudniki, Jamcza 5",
         "poczta": "42-220 Rudniki",
         "telefon": "234586910",
         "wiek": 29,
         "placa": 4400,
         "zatrudniony": true,
         "data_zatrudnienia": "01/01/2018",
         "pesel": "20195647391",
         "email": "wladcatomasz@gmail.com",
         "nr_konta": "90 4444 1111 3333 8899 0099 7799",
         "nr_ubezpieczenia": "HB23247",
         "kraj": "Polska",
		 "technologie": [],
		 "projekty": [
			{
				"_id": "12",
				"data_przystapienia": "01/01/2018",
				"zadania": []
			}
		 ],
		 "uwagi": [
			{
				"index": 1,
				"typ": "pochwala",
				"data": "01/01/2018",
				"opis": "Nadgodziny"
			},
			{
				"index": 2,
				"typ": "nagana",
				"data": "01/01/2018",
				"opis": "Za malo nadgodzin"
			}
		 ]
	}
]);

// usun wszystkich stazystow (Trainee), ktorych pensja jest wieksza niz 2000
// lub osoby mlodsze niz 25 lat zarabiajace mniej niz 5000
db.workers.deleteMany(
	{
		$or: [
			{ $and: [
				{ stanowisko: "Trainee" },
				{ placa: { $gt: 2000 } }
			]},
			{
				$and: [
					{ wiek: { $lt: 25 } },
					{ placa: { $lt: 5000 } }
				]
			}
		]
	}
);

// zwieksz budzet nieskonczonego projektu iOS-a z najmniejszym budzetem o 10000
try {
	db.projects.updateOne(
		{
		  	$and: [
		  		{ zakonczony: false },
		  		{ budzet: db.projects.find({ zakonczony: false, platformy: "iOS" }).sort({budzet: 1}).limit(1).toArray()[0]["budzet"] }
		  	]
		},
		{
			$inc: { budzet: 10000 },
		}
	);
} catch (e) {
   print(e);
}

// zmniejsz budzet nieskonczonego projektu Androida z najwiekszym budzetem o 1000
try {
	db.projects.updateOne(
		{
		  	$and: [
		  		{ zakonczony: false },
		  		{ budzet: db.projects.find({ zakonczony: false, platformy: "Android" }).sort({budzet: -1}).limit(1).toArray()[0]["budzet"] }
		  	]
		},
		{
			$inc: { budzet: -1000 },
		}
	);
} catch (e) {
   print(e);
}