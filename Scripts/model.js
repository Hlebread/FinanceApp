class Model{
	constructor(view, configs){
		this.myView = view; 		
		this.configs = configs;
	}

	/* Создает приветственную страницу и добавляет url#*/
	createWelcomePage(){
		window.location.hash = 'welcome';
		this.myView.createWelcomePage();
	}


	/*
		*СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ
	*/
	/* Создает страницу регистрации и добавляет url#*/
	createSignUpPage(){
		window.location.hash = 'signUp';
		this.myView.createSignUpPage();
	}

	/* Задел на будущее для валидации на клиенте */
	validateSignUpForm(name, email, pass){
		this.createNewUser(name, email, pass)
	}

	/* Создает нового пользователя в проекте Firebase, при успехе - создает в БД документ с именем {User ID}
		и добавляет туда базовые данные счетов, обновляет имя пользователя и меняет url#, */
	createNewUser(name, email, password){
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then((userCredential) => {
				window.location.hash = 'main';
				this.user = userCredential.user;
				DB.collection("users").doc('/' + this.user.uid).set({
					'Наличные': 0,
					'Карта': 0,
				})

				this.user.updateProfile({
					displayName: name,
				}).then(() => {
					this.updateUsernameTitle(name);
				}).catch((error) => {

				});  
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				this.higlightInvalidInput();
			});
	}


	/*
		*АВТОРИЗАЦИЯ
	*/
	/* При первой загрузке страницы проверяет был ли запомнен пользователь и, если да, то запускает функцию авторизации  */
	autoLogin(userData, user){
		if(userData){
			let user = JSON.parse(userData);
			this.login(user.login, user.pass);
		};
		this.user = user;
		this.startListeningForData();
		this.getAccountsList().then(data => {
			this.accounts = data;
			this.updateModalAccounts();
		});
	}

	/* Создает страницу авторизации и добавляет url#*/
	createLoginPage(){
		window.location.hash = 'login';
		this.myView.createLoginPage();
	}

	/* Задел на будущее для валидации на клиенте */
	validateSignInForm(email, password, isChecked){
		this.login(email, password, isChecked);
	}

	/* Авторизация с помощью логина и пароля, при успехе - запоминает данные о пользователе и меняет url# */
	login(email, password, isChecked){
		firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				let user = userCredential.user;
				this.user = user;
				this.rememberUser(isChecked, email, password);
				window.location.hash = 'main';
			})
			.catch((error) => {
				this.higlightInvalidInput();
			});
	}

	/* Сохраняет в LocalStorage данные о пользователе, если было выбрано "Запомнить" */
	rememberUser(isChecked = null, email, password){
		if(isChecked){
			localStorage.eveneuumUserData = JSON.stringify({login: email, pass: password});
		};
	}

	/* Логаут */
	logOut(){
		if(!confirm('Вы уверены, что хотите выйти?')){//????????
			return;
		}
		firebase.auth().signOut().then(() => {
			localStorage.removeItem('eveneuumUserData');
		 }).catch((error) => {
			// An error happened.
		 });
	}

	higlightInvalidInput(){
		this.myView.higlightInvalidInput();
	}


	/*
		*ГЛАВНАЯ СТРАНИЦА
	*/
	/* Создает главную страницу и добавляет url#*/
	createMainPage(){
		window.location.hash = 'main';
		this.myView.createMainPage();
	}

	/* Вызывает метод, создаюший модальное окно */
	createAddNewRecordModal(){
		this.myView.createAddNewRecordModal();
	}

	/* Открывает модальное окно */
	openAddRecordModal(data){
		this.myView.openAddRecordModal(data);
	}

	/* Закрывает модальное окно */
	closeAddRecordModal(){
		this.myView.closeAddRecordModal();
	}

	/* Передает, какую кнопку модального окна необходимо подстветить */
	highlightModalBtn(target){
		this.myView.highlightModalBtn(target);
	}

	/* Переключает модальное окно на доход */
	changeModalToIncome(){
		this.myView.changeModalToIncome();
	}

	/* Переключает модальное окно на расход */
	changeModalToExpenses(){
		this.myView.changeModalToExpenses();
	}

	/* Переключает модальное окно на перевод */
	changeModalToRemittance(){
		this.myView.changeModalToRemittance();
		this.myView.updateModalTargetsAcc(this.accounts)
	}

	/* Передает данные о счетах для изменения их представления в модальном окне */
	updateModalAccounts(){
		this.myView.updateModalAccounts(this.accounts);
	}

	/* Проверяет какой тип записи необходим и вызывает соответствующий метод */
	addNewRecord(sign, sum, category, account, target){
		if(!sum){
			this.focusOnInvalidField(target);
			return;
		}
		switch (sign) {
			case '+':
				this.addIncRecord(sum, category, account);
				break;
		
			case '-':
				this.addExpRecord(sum, category, account);
				break;
		
			case '':
				this.addRemRecord(sum, category, account);
				break;
		}
		this.closeAddRecordModal();
		this.toggleOverlay();
	}

	/* Добавляет данные о доходе в бд */
	addIncRecord(sum, category, account){
		let d = new Date();
		let time = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
		DB.collection("users").add({
			user: this.user.uid,
			type: "inc",
			sum: sum,
			cat: category,
			time: time,
			date: d,
			acc: account,
	  });
	}

	/* Добавляет данные о расходе в бд */
	addExpRecord(sum, category, account){
		let d = new Date();
		let time = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
		this.accounts[account] -= sum;
		this.updateAccountsSums();
		DB.collection("users").add({
			user: this.user.uid,
			type: "exp",
			sum: '-' + sum,
			cat: category,
			time: time,
			date: d,
			acc: account,
	  });
	}

	/* Добавляет данные о переводе в бд */
	addRemRecord(sum, category, account){
		if(category === account){
			return;
		}
		else{
			this.accounts[category] += Number(sum);
			this.accounts[account] -= sum;
		}
		this.updateAccountsSums();

		let d = new Date();
		let time = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
		DB.collection("users").add({
			user: this.user.uid,
			type: "rem",
			sum: sum,
			cat: category,
			time: time,
			date: d,
			acc: account,
		});
	}

	deleteRecord(id){
		DB.collection("users").doc(id).delete();
	}

	/* Обновляет данные записи в БД */
	updateRecord(data){
		if(!data.sum){
			this.focusOnInvalidField(data.target);
			return;
		}
		let dataForUpdate = {
			sum: data.sum,
			cat: data.cat,
			acc: data.acc,
		};
		switch (data.sign) {
			case '+':
				dataForUpdate.type = 'inc';
				break;

			case '-':
				dataForUpdate.type = 'exp';
				dataForUpdate.sum = `-${data.sum}`;
				break;

			case '':
				dataForUpdate.type = 'rem';
				break;
		}
		this.closeAddRecordModal();
		this.toggleOverlay();
		let docForUpdate =  DB.collection("users").doc(data.id);
		docForUpdate.update(dataForUpdate);
	}

	/* Слушатель изменения данных в БД. При срабатывании вычитывает данные и передает на сортировку */
	startListeningForData(){
		let data = [];

		DB.collection("users").where("user", "==", this.user.uid)
		.onSnapshot((querySnapshot) => {
			data = [];
			querySnapshot.forEach((doc) => {
				data.push({
					id: doc.id,
					sum: doc.data().sum,
					account: doc.data().acc,
					cat: doc.data().cat,
					time: doc.data().time,
					d: doc.data().date,
					currency: doc.data().currency,
					type: doc.data().type,
				});
			});
			if(data.length > 0){
				this.sortOperData(data);
			}
		});
	}

	/* Сортирует данные в соответствии с параметрами */
	sortOperData(data){
		let currentDate = new Date();

		let dataSorted = data.sort(function(a,b){
			let date1 = a.d.toDate();
			let date2 = b.d.toDate();
			return date2 - date1;
		}).filter((e) => {
			let fits;
			switch (this.interval) {
				case 'all':
					fits = true;
					break;
				case 'today':
					if(Math.floor(((currentDate - e.d.toDate()) % 2.628e+9) / 8.64e+7) < 1)
					fits = true;
					break;
				case 'week':
					if(Math.floor(((currentDate - e.d.toDate()) % 2.628e+9) / 8.64e+7) < 7)
					fits = true;
					break;
				case 'month':
					if(Math.floor(((currentDate - e.d.toDate()) % 2.628e+9) / 8.64e+7) < 30)
					fits = true;
					break;
			}
			return fits;
		});
		let dataSortedForChart = dataSorted.filter((e) => {
			return e.type === 'exp';
		});
		this.changeDisplayedOperData(dataSorted);
		this.updateMainChartData(dataSortedForChart);
	}

	/* Передает данные  для обновлении их представления */
	changeDisplayedOperData(data){
		if(data.length > 0){
			this.myView.changeDisplayedOperData(data);
		};
	}

	/* Создает функцию, которая при вызове создает новый график */
	makeMainChart(){
		function chart(config){
			return function(ctx){
				return new Chart(ctx, config);
			};
		}
		let myChart = chart(this.configs.mainChart);
		this.myView.makeMainChart(myChart);
	}

	/* Подготавливает данные для обновления графика и создает функцию для обновления представления графика */
	updateMainChartData(data){
		let prepareData = {};
		for(let key in data){
			if(!(data[key].cat in prepareData)){
				prepareData[data[key].cat] = 0;
			}
			prepareData[data[key].cat] += Number(data[key].sum);
		};

		let chartData = {
			labels: [],
			data: [],
		};
		function addData(labels, data) {
			return function(chart){
				chart.data.labels = labels;
				chart.data.datasets[0].data = data;
				chart.update();
			}
	  }

		for(let key in prepareData){
			chartData.labels.push(key);
			chartData.data.push(prepareData[key]);

		}
		let func = addData(chartData.labels, chartData.data);
		this.myView.updateMainChartData(func);
	}

	/* При изменении периода статистики сохраняет период, разово вычитывает данные БД и отправляет на сортировку */
	updateOperInterval(val){
		this.interval = val;
		DB.collection("users").where("user", "==", this.user.uid)
									 .get()
			.then((querySnapshot) => {
				let data = [];
				querySnapshot.forEach((doc) => {
					data.push({
						id: doc.id,
						sum: doc.data().sum,
						account: doc.data().acc,
						cat: doc.data().cat,
						time: doc.data().time,
						d: doc.data().date,
						currency: doc.data().currency,
						type: doc.data().type,
					});
				});
			if(data.length > 0){
				this.sortOperData(data);
			}
		});
	}


	/*
		*СТРАНИЦА СЧЕТОВ И РАБОТА С НИМИ В БД
	*/
	/* Создает страницу счетов и добавляет url#*/
	createMyAccountsPage(){
		this.myView.createMyAccountsPage()
		this.getCryptoData().then(data => this.updateCryptoData(data));
		this.getAccountsList().then(data => this.updateAccountsField(data));
		this.updateModalAccounts();
	}

	/* Получает данные о криптовалютах */
	getCryptoData(){
		let apiQuery = 'https://api.coingecko.com/api/v3/simple/price?ids=Dogecoin%2Cbitcoin%2Cethereum%2Ctether%2Ccardano%2Cmaker%2CDash%2CLitecoin%2CAave%2CMonero&vs_currencies=usd';
		function request(url){
			return fetch(url)
						.then(response => response.json())
						.then(data => {
							let arr = [];
							for(let key in data){
								arr.push({
									name: key,
									price: data[key].usd.toFixed(2),
								});
							};
							let sortedData = arr.sort(function(a,b){
								let price1 = a.price;
								let price2 = b.price;
								return price2 - price1;
							});
							return sortedData;
						})
						.catch(error => console.error("Ошибка получения данных. Причина: " + error));
		};
		return request(apiQuery)
			.then(data => data);
	}

	/* Получает данные о валюте */
	getCurrencyData(){
		let apiQuery = 'https://www.nbrb.by/api/exrates/rates?periodicity=0';
		function request(url){
			return fetch(url)
						.then(response => response.json())
						.then(data => {
							let arr = [];
							for(let key in data){
								arr.push({
									abbr: data[key].Cur_Abbreviation,
									name: data[key].Cur_Name,
									rate: (data[key].Cur_OfficialRate / data[key].Cur_Scale).toFixed(4),
								});
							};
							let sortedData = arr.sort(function(a,b){
								let rate1 = a.rate;
								let rate2 = b.rate;
								return rate2 - rate1;
							});
							return sortedData;
						})
						.catch(error => console.error("Ошибка получения данных. Причина: " + error));
		};
		return request(apiQuery)
			.then(data => data);
	}

	/* Запускает метод запроса данных о крипте и когда получает передает их для изменения представления */
	updateCryptoData(data){
		this.getCryptoData().then(data => this.myView.updateCryptoData(data));
	}

	/* Запускает метод запроса данных о валюте и когда получает передает их для изменения представления */
	updateCurrencyData(){
		this.getCurrencyData().then(data => this.myView.updateCurrencyData(data));
	}

	/* Передает данные о счетах для изменения их представления на странице счетов */
	updateAccountsField(data){
		this.myView.updateAccountsField(data);
	}

	/* Открывает карточку добавления нового счета */
	openAccountCardAdd(data){
		if(data){
			this.accountForChange = data;
		};
		this.myView.openAccountCardAdd(data);
	}

	/* Закрывает карточку добавления нового счета */
	closeAccountCardAdd(){
		this.myView.closeAccountCardAdd();
	}

	/* Проверяет заполненность, при успехе передает данные для добавления и закрывает карточку */
	saveAccountCardAdd(name, sum, nTarget, sTarget){
		if(!name){
			this.focusOnInvalidField(nTarget);
			return;
		}
		else if(!sum){
			this.focusOnInvalidField(sTarget);
			return;
		};
		this.closeAccountCardAdd();
		if(this.accountForChange){
			this.updateAccount(name, sum);
			return;
		};
		this.addNewAccount(name, sum)
	}

	/* Добавляет новый счет */
	addNewAccount(name, sum){
		this.accounts[name] = Number(sum);
		this.updateAccountsSums();
	}

	/* Удаляем аккаунт */
	deleteAccount(account){
		let docForUpdate =  DB.collection("users").doc(this.user.uid);
		docForUpdate.update({
			[account]: firebase.firestore.FieldValue.delete(),
		});
		this.getAccountsList().then(data => this.updateAccountsField(data));
	}

	/* Получает данные о счетах */
	getAccountsList(){
		function request(that){
			return DB.collection("users").doc(that.user.uid)
										 .get()
				.then((doc) => {
					if (doc.exists) {
						return doc.data();
					} else {
						console.log("No such document!");
					}
				}).catch((error) => {
					console.log("Error getting document:", error);
				});
		};
		return request(this);
	}

	/* Обновляет данные о счетах в БД */
	updateAccountsSums(){
		DB.collection("users").doc('/' + this.user.uid).set(this.accounts)		
		.then((docRef) => {
			if(window.location.hash === '#accounts'){
				this.getAccountsList().then(data => this.updateAccountsField(data));
			};
		})
		.catch((error) => {
			console.error("Ошибка обновления документа: ", error);
		});
	}

	updateAccount(name, sum){
		let dataForUpdate = {
			[name]: sum,
		};
		let docForUpdate =  DB.collection("users").doc(this.user.uid);
		docForUpdate.update(dataForUpdate);
		this.getAccountsList().then(data => this.updateAccountsField(data));
	}


	/* 
		*БОКОВОЕ МЕНЮ
	*/
	/* Передает данные для создания бокового меню */
	createMenu(){
		this.myView.createMenu(this.user.displayName, this.user.email);
	}

	/* Переключает боковое меню */
	toggleSideMenu(){
		this.myView.toggleSideMenu();
	}

	/* Передает данные о кнопке, которую надо подсветить */
	highlightMenuBtn(target){
		this.myView.highlightMenuBtn(target);
	}

	/* Обновляет имя пользователя в меню */
	updateUsernameTitle(name){
		this.myView.updateUsernameTitle(name);
	};

	/* Переключает видимость блока информации */
	toggleInfoBlock(isOpen){
		this.myView.toggleInfoBlock(isOpen);
	}


	/* 
		*ВСПОМОГАТЕЛЬНОЕ
	*/
	/* Передает данные о поле на котором надо сфокусироваться */
	focusOnInvalidField(target){
		this.vibrate();
		this.myView.focusOnInvalidField(target);
	}

	/* Функция, переключающая видимость пароля*/
	showPassword(target){
		this.myView.showPassword(target);
	}

	/* Обработчик изменения размера окна */
	resizeHandler(screenSize){
		if(screenSize < 1550){
			this.myView.resizeMenuHandler(true);
		}
		else{
			this.myView.resizeMenuHandler();
		};
		if(screenSize < 1000){
			this.myView.resizeMobileHandler(true);
		}
		else{
			this.myView.resizeMobileHandler();
		};
	}

	/* Создает оверлей */
	createOverlay(){
		this.myView.createOverlay();
	}

	/* Переключает видимость оверлея */
	toggleOverlay(){
		this.myView.toggleOverlay();
	}

	/* В мобильной версии открывает "боковое" окно */
	openMobileAside(){
		this.myView.openMobileAside();
	}

	createSound(){
		let src = './Media/click.mp3';
		this.myView.createSound(src);
	}

	playSound(){
		let src = './Media/click.mp3';
		this.myView.playSound(src);
	}

	playSoundDelete(){
		let src = './Media/trash.mp3';
		this.myView.playSound(src);
	}

	vibrate(){
		let duration = 200;
		window.navigator.vibrate(duration);
	}
}