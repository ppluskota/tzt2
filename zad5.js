// wypisz pracownikow wraz z nazwami projektow w ktorych pracuja
function workersList() {
	var workers = db.workers.find({});
	var projects = db.projects.find({});
	var incrementValue = 1;
	while(workers.hasNext()) {
		var person = workers.next();
		print(incrementValue++ + ". " + person.imie + " " + person.nazwisko);
		var workersProjects = person.projekty;
		var nestedArrayIncrementValue = 1;
		print("Lista projektow");
    	workersProjects.forEach(function(doc, index) { 
    	 var currentProjectValue = db.projects.findOne({"_id": doc._id});
    	  print("    " + index + ". " + currentProjectValue.nazwa );
    	});
	}
}

workersList();

// lista pracownikow z warunkiem w zapytaniu
function displayWorkersListWithCondition(query) {
	var workers = db.workers.find({ $where: query });
	var incrementValue = 1;
	while (workers.hasNext()) {
		var currentWorker = workers.next();
		print(incrementValue++ + ". " + currentWorker.imie + " " + currentWorker.nazwisko + " " + currentWorker.stanowisko + " " + currentWorker.placa);
	}
}

displayWorkersListWithCondition("this.imie == 'Marek'");
displayWorkersListWithCondition("this.placa >= 10000 && this.wiek > 30");

// informacje dotyczace klienta
function checkClient(clientName) {
	var preparedString = "'" + clientName + "'";
	var projects = db.projects.find({ $where: "this.zleceniodawca ==" + preparedString})
	var numberOfProjects = 0;
	var totalBudget = 0;
	var projectsNames = [];
	// libcza projektow, calkowity koszt zamowien
	while (projects.hasNext()) {
		var currentProject = projects.next();
		totalBudget += currentProject.budzet;
		numberOfProjects += 1;
		projectsNames.push(currentProject.nazwa);
	}
	// projekty i czy zakonczone
	if (numberOfProjects > 0) {
		print("Liczba projektow: " + numberOfProjects + " ,calkowity budzet: " + totalBudget);
		print("Lista projektow: " + projectsNames.toString());
	} else {
		print("Nie ma takiego klienta, sprawdz poprawnosc wpisanego argumentu !!")
	}
}

checkClient("Greedy Company");