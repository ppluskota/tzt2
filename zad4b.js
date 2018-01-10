// lista 4 z 10 losowych projektow na iOS oraz Android wraz z opisem oraz nazwa firmy
db.projects.aggregate([
  { "$sample": { 
		size: 10 
	} 
  },
  {
    "$match": { "$and": [
		{ "platformy": "iOS" },
		{ "platformy": "Android" },
	]}
  },
  { "$limit": 4 },
  {
  	"$group": {
  		"_id": null, 
    	"projekty_iOS_Anroid": { "$sum": 1 },
		"firmy": { $push: { $concat: ["$opis", ", zleceniodawca: ", "$zleceniodawca"] } }
  	}
  }
]);

// sortowanie pracownikow po nazwisku
db.workers.aggregate([
{ 
    "$project": {
        "nazwisko": 1,        
        "output": { "$toLower": "$nazwisko" }       
    }},
    { "$sort": { "output": 1 } },
    {"$project": { "nazwisko": 1, "_id":0 } }
]);

// wypisz najwazniejsze dane dotyczace pracownikow (imie, nazwisko, placa oraz projekty)
// dla pracujacych pracownikow starszych niz 20 lat oraz nie bedacych stazystami (Trainee)
// posortuj malejaco
db.workers.aggregate([
	{
	$match: {
		zatrudniony: true,
		wiek: { $gt: 20 },
		stanowisko: { $ne: "Trainee" }
	}},
    {
        $group: {
            "_id": {
                "nazwisko": "$nazwisko",
				"imie": "$imie",
				"placa": "$placa"
                },
                "projekty": {
                    "$addToSet": "$projekty"
            }
        }
    },
	{
		$sort: {
			"_id.placa": -1
		}
	}
]);

// wypisz pracownikow pracujacych przy niezakonczonym projekcie iOS o najwiekszym budzecie
// wraz ze wyszczegolnieniem wszystkich zadan oraz osob za nie odpowiedzialnych
db.workers.aggregate([
	{
	$match: {
	"_id": db.projects.find({ zakonczony: false, platformy: "Android" }).sort({budzet: 1}).limit(1).toArray()[0]["_id"] 
	}},
	{ $unwind: "$projekty" },
	{ "$group": {
        "_id": {
          "imie": "$imie",
          "nazwisko": "$nazwisko",
           "elem": "$projekty",
        },
        "count": { "$sum": 1 }
    }}
]);

// wypisz wszystkie projekty dla firmy Greedy Company na platforme iOS oraz Android
// pogrupowac po budzecie malejaco
// wyswietlic tylko nazwy projektow
db.projects.aggregate([
	{
		$match: {
			zleceniodawca: "Greedy Company",
			platformy: "iOS",
			platformy: "Android"
		}
	},
	{
		$sort: {
			"budzet": -1
		}
	},
	{
		$group: {
			_id: { "nazwa": "$nazwa" }
		}
	}
]);

// Wypisz wszystkie zakonczone projekty wraz z ich nazwa, wersja oraz zleceniodwaca,
// uzywajac concat stworz krotki opis
db.projects.aggregate([
  {
    "$match": { "zakonczony": true } 
  },
  {
  	"$group": {
  		"_id": {
  			"nazwa": "$nazwa",
  			"zleceniodawca": "$zleceniodawca",
  			"wersja": "$wersja"
  		}
  	}
  },
  	 {
	   $project: {
	     "opis": {$concat:["Projekt", "$_id.nazwa"," stworzony dla ", "$_id.zleceniodawca", " przez Pawel Pluskota Company"]}
	   }
	 }
]);

// niezakonczone projekty na przynajmniej dwie platformy,
// grupowanie po budzecie oraz poziomie ukonczenia
db.projects.aggregate([
	{
		"$match": { 
			"zakonczony": false,
			"platformy.1": { $exists: true }
		} 
	},
	{
		$facet: {
			"po_budzecie": [
				{
					$bucket: {
					groupBy: "$budzet",
					boundaries: [0, 10000, 100000],
					default: "powyzej 10000",
					output: {
						"count": { $sum: 1 },
						"nazwa": { $push: "$nazwa" }
						}
					}
				}
			],
			"po_poziomie_ukonczenia": [
				{
					$bucket: {
						groupBy: "$procent_ukonczenia",
						boundaries: [0, 50, 75],
						default: "ponad_75",
						output: {
							"count": { $sum: 1 },
							"nazwa": { $push: "$zleceniodawca" }
						}
					}
				}
			]
		}
	}
]);

// zatrudnieni pracownicy, po 30, znajacych minimum 2 technologie, 
// srednia wyplata, podzial pod wzgledem plac wypisac liczbe projektow dla osob w danym przedziale placowym
// wraz z nazwiskiem osoby odpowiedzialnej za dany projekt
db.workers.aggregate([
	{
		$match: {
			"wiek": { $gt: 30 },
			"zatrudniony": true,
			"technologie.1": { $exists: true }
		}
	},
	{ $unwind: "$projekty" },
	{
	    $facet: {
			"srednia_wyplata": [
				{
					$bucket: {
						groupBy: "$placa",
						boundaries: [0, 1],
						default: "",
						output: {
						"srednia_wyplata": { $avg: "$placa" }
						}
					}	
				}
			],
			"widelki": [
				{
					$bucket: {
						groupBy: "$placa",
						boundaries: [0, 5000, 10000],
						default: "Ponad 10000 PLN",
						output: {
							"laczna_liczba_taskow": { $sum: 1 },
							"nazwisko_projekt": { $push:  {$concat:["$nazwisko"," - ","$projekty._id",] }}
						}
					}	
				}
			]
		}
	}
]);

