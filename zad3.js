// zatrudnieni pracownicy zarabiajacy powyzej 5 tys PLN
db.workers.find({
	$and: [
		{ zatrudniony: true },
		{ placa: { $gt: 5000 } }
	]
});

// pracownicy nie pochodzacy z polski majacych parzysty wiek
db.workers.find({ 
	$and: [
		{ kraj: { $ne: "Polska" } },
		{ wiek: { $mod: [2, 0] } }
	]
});

// ukonczone projekty iOS
db.projects.find({
	$and: [
		{ platformy: "iOS" },
		{ zakonczony: true }
	]
});

// pracownicy po 30 z przynajmniej jedna nagana
db.workers.find({
	$and: [
		{ wiek: { $gt: 30 } },
		{ "uwagi.typ": "nagana" }
	]
});

// pracownicy znajacy Swift-a na poziomie eksperta i majacych mniej niz 30 lat lub zarabiajacy wiecej niz 8000
db.workers.find({
	$and: [
		{ "technologie.nazwa": "Swift", "technologie.poziom_zaawansowania": "ekspert" },
		{ $or: [
			{ "wiek": { $lt: 30 } },
			{ "placa": { $gt: 8000 } }
		]}
	]
});

// stanowiska w firmie dla pracujacych Polakow
db.workers.distinct(
	"stanowisko", { 
	  	$and: [
	  		{ zatrudniony: true },
	  		{  kraj: "Polska" }
	  	]
	}
);

// osoby nie pracujace przy zadnych projektach oraz nie znajace zadnych technologii lub nie majace zadnych uwag
db.workers.find({
	$and: [
		{ projekty: { $size: 0 } },
		{ $or: [
			{ technologie: { $size: 0 } },
			{ uwagi: { $size: 0 } }
		]}
	]
});

// Projekty dla firmy Greedy Company lub Koczkodan puree majace budzet wiekszy niz 10000 oraz bedace ukonczone oraz tworzone na platforme iOS lub Android
db.projects.find({
	$and: [
		{ $or: [
			{ zleceniodawca: "Greedy Company" },
			{ zleceniodawca: "Koczkodan puree" }
		]},
		{ budzet: { $gt: 10000 } },
		{ $or: [
			{ platformy: "iOS" },
			{ platformy: "Android" }
		]}
	]
});

// projekty z budzetem wiekszym od sredniej
var average = db.projects.aggregate([
    { $group: { 
			"_id": "null", 
			avg: { $avg: $budzet} 
		}
	}
]).toArray()[0]["avg"];

db.projects.find({ 
	"budzet": { $gt: average } 
});