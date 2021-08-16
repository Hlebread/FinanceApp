class Controller{
	constructor(model, container){
		this.myModel = model;
		this.SPA = container;

		/* Слушатель аутентификации Firebase */
		firebase.auth().onAuthStateChanged((user) => { 
			if (user) {
				let uid = user.uid;
				this.autoLogin(user);
				this.createMainPage();
			} else {
				this.createWelcomePage();
			}
		});

		window.addEventListener("hashchange", this.updateState.bind(this));/* Слушатель изменения url# */
	}

	/* В зависимости от url# создает другую страницу */
	updateState(){
		const hashPageName = window.location.hash.slice(1).toLowerCase();

		switch (hashPageName) {
			case 'welcome':
				this.createWelcomePage();
				break;
			case 'login':
				this.createLoginPage();
				break;
			case 'signup':
				this.createSignUpPage();
				break;
			case 'main':
				this.createMainPage();
				break;
			case 'accounts':
				this.createMyAccountsPage();
				break;
		
			default:
				this.createMainPage();
				break;
		}
	}

	/* Функция, при первой загрузке страницы вычитавыющая данные из памяти браузера и вызывающая метод модели*/
	autoLogin(user){
		const userData = localStorage.eveneuumUserData;
		this.myModel.autoLogin(userData, user);
	}

	/* Функция выхода из аккаунта*/
	logOut(){
		this.myModel.logOut();
	}

	/* Создает приветственную страницу*/
	createWelcomePage(){
		this.myModel.createWelcomePage();

		const startBtn = document.getElementById('startBtn');
		startBtn.addEventListener('click', () => this.createLoginPage());

		const createBtn = document.getElementById('createLink');
		createBtn.addEventListener('click', (event) => {
			event.preventDefault();
			this.createSignUpPage();
		});
	}

	/* Создает страницу регистрации */
	createSignUpPage(){
		this.myModel.createSignUpPage();

		const createBtn = document.getElementById('createAccount');
		createBtn.addEventListener('click', (event) => {
			this.validateSignUpForm();
			event.preventDefault();
		});

		const showPassBtn = document.querySelector('.eye');
		showPassBtn.addEventListener('click', () => this.showPassword(showPassBtn));
	}

	/* Проверяет заполненность строк страницы регистрации и если верно, то вызывет функцию модели, 
		иначе ставит курсор в незаполненную строку */
	validateSignUpForm(){
		const username = document.getElementById('userName');
		const userEmail = document.getElementById('userEmail');
		const userPassword = document.getElementById('userPassword');

		if(!username.value){
			this.focusOnInvalidField(username);
			return;
		}
		if(!userEmail.value){
			this.focusOnInvalidField(userEmail);
			return;
		}
		if(!userPassword.value){
			this.focusOnInvalidField(userPassword);
			return;
		}

		this.myModel.validateSignUpForm(username.value, 
												  userEmail.value, 
												  userPassword.value);
		username.value = '';
		userEmail.value = '';
		userPassword.value = '';						  
	}

	/* Создает страницу авторизации*/
	createLoginPage(){
		this.myModel.createLoginPage();

		const loginBtn = document.getElementById('loginBtn');
		loginBtn.addEventListener('click', (event) => {
			event.preventDefault();
			this.validateSignInForm();
		});

		const createLink = document.getElementById('createLink');
		createLink.addEventListener('click', (event) => {
			event.preventDefault();
			this.createSignUpPage();
		});

		const showPassBtn = document.querySelector('.eye');
		showPassBtn.addEventListener('click', () => this.showPassword(showPassBtn));
	}

	/* Проверяет заполненность строк страницы авторизации и если верно, то вызывет функцию модели, 
		иначе ставит курсор в незаполненную строку */
	validateSignInForm(){
		const userLogin = document.getElementById('userEmail');
		const userPassword = document.getElementById('userPassword');
		const rememberUserIsChecked = document.getElementById('rememberUser').checked;

		if(!userLogin.value){
			this.focusOnInvalidField(userLogin);
			return;
		};
		if(!userPassword.value){
			this.focusOnInvalidField(userPassword);
			return;
		};

		this.myModel.validateSignInForm(userLogin.value, userPassword.value, rememberUserIsChecked);
	}

	/*
		*ГЛАВНАЯ СТРАНИЦА
	*/
	/* Создает основную страницу */
	createMainPage(){
		this.createMenu();
		this.myModel.createMainPage();
		window.addEventListener('resize', this.resizeHandler.bind(this)); /* Вешается слушатель изменения размера окна и вызывается на следующей строке для первой проверки*/
		this.resizeHandler();
		this.createOverlay();
		this.createAddNewRecordModal();
		this.makeMainChart();
		this.updateModalAccounts();

		this.asideOpen = document.querySelector('aside .aside');
		this.asideOpen.addEventListener('click', () => this.openMobileAside());

		this.addListenersToMenu();
		this.addListenersToModal()
		this.changeModalToExpenses();
	
		const intervalInp = document.getElementById('interval');
		intervalInp.addEventListener('input', () => {
			this.updateOperInterval(intervalInp.value);
		});
		this.updateOperInterval(intervalInp.value);

		const addNewRecordBtn = document.getElementById('addNewRecordBtn');
		addNewRecordBtn.addEventListener('click', () => {
			this.openAddRecordModal();
		});

		const operList = document.getElementById('operationsList');
		operList.addEventListener('click', (event) => {
			let target = event.target.closest('.operationAside[data-id]');
			if (!target) return;
			this.openAddRecordModal({
				id: target.getAttribute('data-id'),
				category: target.querySelector('.categoryAside').textContent,
				acc: target.querySelector('.accountAside').textContent,
				sum: target.querySelector('.summAside').textContent,
			})
		})
	}
	
	/* Создает модальное окно */
	createAddNewRecordModal(){
		this.myModel.createAddNewRecordModal();
	}

	/* Добавляет аккаунты для выбора в модальное окно */
	updateModalAccounts(){
		this.myModel.updateModalAccounts();
	}

	/* Функция, добавляющая слушатели событий на модальное окно добавления новой записи */
	addListenersToModal(){
		const modalHeader = document.querySelector('.modal nav');
		modalHeader.addEventListener('click', (event) => {
			let target = event.target.closest('button');
			if (!target) return;
			this.modalNavigate(target);
		});

		const addIncomeBtn = document.getElementById('addIncomeBtn');
		addIncomeBtn.addEventListener('click', () => {
			this.changeModalToIncome();
		})

		const addExpensesBtn = document.getElementById('addExpensesBtn');
		addExpensesBtn.addEventListener('click', () => {
			this.changeModalToExpenses();
		})
		const addRemittanceBtn = document.getElementById('addRemittanceBtn');
		addRemittanceBtn.addEventListener('click', () => {
			this.changeModalToRemittance();
		})

		const closeBtn = document.getElementById('closeModal');
		closeBtn.addEventListener('click', () => this.closeAddRecordModal());

		const saveModal = document.getElementById('saveModal');
		saveModal.addEventListener('click', () => this.saveAddRecordModal());

		const deleteBtn = document.getElementById('deleteBtn');
		deleteBtn.addEventListener('click', () => this.deleteRecord());
	}

	/* Открывает модальное окно операций */
	openAddRecordModal(data){
		if(!document.getElementById('addRecordModal')){
			this.createAddNewRecordModal();
		};
		this.toggleOverlay();
		this.myModel.openAddRecordModal(data);
	}

	/* Закрывает модальное окно операций */
	closeAddRecordModal(){
		this.toggleOverlay();
		this.myModel.closeAddRecordModal();
	}

	/*  */
	modalNavigate(target){
		this.highlightModalBtn(target);
	}

	/* Подсвечивает активную кнопку модального окна */
	highlightModalBtn(target){
		this.myModel.highlightModalBtn(target);
	}

	/* Переключает модальное окно на "Доход" */
	changeModalToIncome(){
		this.myModel.changeModalToIncome();
	}

	/* Переключает модальное окно на "Расход" */
	changeModalToExpenses(){
		this.myModel.changeModalToExpenses();
	}

	/* Переключает модальное окно на "Перевод" */
	changeModalToRemittance(){
		this.myModel.changeModalToRemittance();
	}

	/* Вычитывает данные из инпутов, для отправки в модель */
	saveAddRecordModal(){
		const sign = document.getElementById('sign').textContent;
		const sumInp = document.getElementById('modalSummInp');
		const selectAccount = document.getElementById('selectAccount').value;
		const selectCategory = document.getElementById('selectCategory').value;
		const id = document.getElementById('addRecordModal').getAttribute('data-id');
		this.playSound();
		if(id){
			this.updateRecord({
				id: id,
				sign: sign,
				sum: sumInp.value,
				cat: selectCategory,
				acc: selectAccount,
				target: sumInp,
			})
			return;
		}
		this.addNewRecord(sign, sumInp.value, selectCategory, selectAccount, sumInp);
	}

	/* Отправляет данные в модель, для добавления новой записи */
	addNewRecord(sign, sum, category, account, target){
		this.myModel.addNewRecord(sign, sum, category, account, target);
	}

	deleteRecord(){
		if(confirm('Вы уверены, что хотите удалить запись?')){
			const id = document.getElementById('addRecordModal').getAttribute('data-id');
			this.myModel.deleteRecord(id);
			this.closeAddRecordModal();
			this.playSoundDelete();
		};
	}

	/* Обновляет интервал за который необходимо показать данные */
	updateOperInterval(val){
		this.myModel.updateOperInterval(val);
	}

	/* Обновляет данные операции при изменении */
	updateRecord(data){
		this.myModel.updateRecord(data);
	}

	/* Функция, создающая график на главной странице */
	makeMainChart(){
		this.myModel.makeMainChart();
	}

	/*
		*СТРАНИЦА СЧЕТОВ
	*/
	/* Создает страницу со счетами */
	createMyAccountsPage(){
		this.createMenu();
		this.myModel.createMyAccountsPage();
		this.resizeHandler();
		this.createOverlay();

		this.asideOpen = document.querySelector('aside .titleCont');
		this.asideOpen.addEventListener('click', () => this.openMobileAside());

		const cryptoBtn = document.getElementById('cryptoBtn');
		cryptoBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.updateCryptoData();
		});

		const currencyBtn = document.getElementById('currencyBtn');
		currencyBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			this.updateCurrencyData();
		});

		const addCard = document.querySelector('#accountAddCard .basic');
		addCard.addEventListener('click', () => this.openAccountCardAdd());

		const closeCardBtn = document.getElementById('closeModal');
		closeCardBtn.addEventListener('click', () => this.closeAccountCardAdd());

		const saveCardBtn = document.getElementById('saveModal');
		saveCardBtn.addEventListener('click', (e) => this.saveAccountCardAdd(e));

		const cardsContainer = document.querySelector('.content')
		cardsContainer.addEventListener('click', (event) => {
			let target = event.target.closest('.accountCard:not(.add)');
			if (!target) return;
			this.openAccountCardAdd({
				name: target.querySelector('.accName').textContent.trim(),
				sum: target.querySelector('.sum').textContent.trim(),
			});
		});

		const deleteBtn = document.getElementById('deleteBtn');
		deleteBtn.addEventListener('click', () => this.deleteAccount());

		this.addListenersToMenu();
	}

	/* Открывает модальное окно добавления нового аккаунта */
	openAccountCardAdd(data = null){
		this.myModel.openAccountCardAdd(data);
	}

	/* Закрывает модальное окно добавления нового аккаунта */
	closeAccountCardAdd(){
		this.myModel.closeAccountCardAdd();
	}

	/* Вычитывает и передает данные в модель для добавления нового аккаунта */
	saveAccountCardAdd(e){
		e.stopPropagation();
		this.playSound();
		const name = document.querySelector('#accountName');
		const sum = document.querySelector('#accountSum');
		this.myModel.saveAccountCardAdd(name.value, sum.value, name, sum);
	}

	/* Обновляет данные крипты */
	updateCryptoData(){
		this.myModel.updateCryptoData();
	}

	/* Обновляет данные валют */
	updateCurrencyData(){
		this.myModel.updateCurrencyData();
	}

	deleteAccount(){
		if(confirm('Вы уверены, что хотите удалить аккаунт?')){
			const account = document.querySelector('#accountAddCard #accountName').value;
			this.myModel.deleteAccount(account);
			this.closeAccountCardAdd();
			this.playSoundDelete();
		};
	}

	/*
		*СОЗДАНИЕ МЕНЮ
	*/
	/* Функция, создающая боковое меню */
	createMenu(){
		this.myModel.createMenu();
		this.highlightMenuBtn(window.location.hash.slice(1).toLowerCase());
	}

	/* Функция, добавляющая слушатели событий на блок бокового меню */
	addListenersToMenu(){
		const infoBtn = document.getElementById('infoBtn');
		infoBtn.addEventListener('mouseenter', () => this.toggleInfoBlock(true))
		infoBtn.addEventListener('mouseout', () => this.toggleInfoBlock(false))

		const burger = document.getElementById('burger');
		burger.addEventListener('click', () => this.toggleSideMenu());

		const exitBtn = document.getElementById('exitBtn');
		exitBtn.addEventListener('click', () => this.logOut());
	}

	/* Переключатель бокового меню */
	toggleSideMenu(){
		this.myModel.toggleSideMenu();
	}

	/* Подсвечивает активную кнопку бокового меню */
	highlightMenuBtn(target){
		this.myModel.highlightMenuBtn(target);
	}

	/* Переключает видимость блока информации */
	toggleInfoBlock(isOpen){
		this.myModel.toggleInfoBlock(isOpen);
	}

	/*
		*ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
	*/
	/* Функция, которая фокусируется на неверно заполненном окне */
	focusOnInvalidField(target){
		this.myModel.focusOnInvalidField(target);
	}

	/* Функция, переключающая видимость пароля*/
	showPassword(target){
		this.myModel.showPassword(target);
	}

	/* Обработчик изменения размера окна */
	resizeHandler(){
		this.myModel.resizeHandler(document.documentElement.clientWidth);
	}
	
	/* Создает оверлей */
	createOverlay(){
		this.myModel.createOverlay();
	}

	/* Переключает видимость оверлея */
	toggleOverlay(){
		this.myModel.toggleOverlay();
	}

	/* Открывает дополнительное поле при маленьком размере экрана */
	openMobileAside(){
		this.myModel.openMobileAside();
	}

	playSound(){
		this.myModel.playSound();
	}

	playSoundDelete(){
		this.myModel.playSoundDelete();
	}
}