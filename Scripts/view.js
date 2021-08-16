class View{
	constructor(container, pages, components){
		this.SPA = container;
		this.SPA.classList.add('app')
		this.pages = pages;
		this.components = components;
		this.pagesTitles = {
			welcome: 'Добро пожаловать!',
			signUp: 'Регистрация',
			login: 'Войти',
			main: 'Главная',
		};
	}


	/*
		*ПЕРВЫЕ СТРАНИЦЫ
	*/
	/* Создает приветственную страницу */
	createWelcomePage(){
		document.title = this.pagesTitles.welcome;
		this.SPA.innerHTML = this.pages.welcome.render();
	}

	/* Создает страницу регистрации */
	createSignUpPage(){
		document.title = this.pagesTitles.signUp;
		this.SPA.innerHTML = this.pages.signUp.render();
	}

	/* Создает страницу логина */
	createLoginPage(){
		document.title = this.pagesTitles.login;
		this.SPA.innerHTML = this.pages.login.render();
	}

	/* Переключает видимость пароля */
	showPassword(target){
		target.classList.toggle('fa-eye-slash');
		target.classList.toggle('fa-eye');

		const passField = document.getElementById('userPassword');
		if(passField.getAttribute('type') === 'password'){
			passField.setAttribute('type', 'text');
		} 
		else{
			passField.setAttribute('type', 'password');
		};
	}

	higlightInvalidInput(){
		let inputs = document.querySelectorAll('.input-field');
		inputs.forEach((e) => {
			e.classList.add('active');
		});
		setTimeout(() =>{
			inputs.forEach((e) => {
				e.classList.remove('active');
			});
		}, 5000);
	}

	/*
		*ГЛАВНАЯ СТРАНИЦА
	*/
	/* Создает главную страницу */
	createMainPage(){
		document.title = this.pagesTitles.main;
		this.SPA.innerHTML += this.components.main.render();
		const mainField = document.querySelector('main');
		mainField.innerHTML += this.components.content.render();
		mainField.innerHTML += this.components.operationsBar.render();
	}

	/* Создает модальное окно добавляения новой записи */
	createAddNewRecordModal(){
		this.SPA.innerHTML += this.components.addRecordModal.render();
	}

	/* Открывает модальное окно и если есть данные, то заполняет его в соответствии */
	openAddRecordModal(data){
		const modal = document.getElementById('addRecordModal');
		modal.classList.add('active');
		if(data){
			modal.setAttribute('data-id', data.id);
			modal.querySelector(`#selectAccount`).value = data.acc;
			modal.querySelector('#selectCategory').value = data.category;
			modal.querySelector('#modalSummInp').value = Math.abs(parseFloat(data.sum));
			modal.querySelector('#deleteBtn').classList.add('active');
		};
	}

	/* Закрывает модальное окно и обнуляет его */
	closeAddRecordModal(){
		const modal = document.getElementById('addRecordModal');
		const inp = modal.querySelector('input');
		inp.value = '';
		modal.classList.remove('active');
		modal.removeAttribute('data-id');
		modal.querySelector('#deleteBtn').classList.remove('active');
	}

	/* Переключает активную кнопку модального окна */
	highlightModalBtn(target){
		const btns = document.querySelectorAll('.modal nav button');
		btns.forEach((e) => {
			e.classList.remove('selected');
		});
		target.classList.add('selected');
	}

	/* Переключает модальное окно на "Доход" */
	changeModalToIncome(){
		const modal = document.querySelector('.modal');
		const sign = modal.querySelector('#sign');
		const target = modal.querySelector('.category div');
		sign.textContent = '+';
		target.textContent = 'На категорию';
		this.updateModalTargetsCat(this.components.exp)
	}

	/* Переключает модальное окно на "Расход" */
	changeModalToExpenses(){
		const modal = document.querySelector('.modal');
		const sign = modal.querySelector('#sign');
		const target = modal.querySelector('.category div');
		sign.textContent = '-';
		target.textContent = 'На категорию';
		this.updateModalTargetsCat(this.components.exp)
	}

	/* Переключает модальное окно на "Перевод" */
	changeModalToRemittance(){
		const modal = document.querySelector('.modal');
		const sign = modal.querySelector('#sign');
		const target = modal.querySelector('.category div');
		sign.innerHTML = '<i class="fa-solid fa-money-bill-1-wave"></i>';
		target.textContent = 'На счёт';
	}

	/* Обновляет счета в модальном окне */
	updateModalAccounts(data){
		const selectAccount = document.getElementById('selectAccount');
		if(!selectAccount){
			return;
		};
		for(let key in data){
			let option = `<option value="${key}">${key}</option>`;
			selectAccount.innerHTML += option;
		}
	}

	/* Обновляет категории в модальном окне */
	updateModalTargetsCat(data){
		const selectTargets = document.getElementById('selectCategory');
		selectTargets.innerHTML = '';
		for(let key in data){
				let option = `<option value="${data[key].name}">${data[key].name}</option>`;
				selectTargets.innerHTML += option;
		}
	}

	/* Меняет категорию на счета в случае, если запущено окно перевода */
	updateModalTargetsAcc(data){
		const selectTargets = document.getElementById('selectCategory');
		selectTargets.innerHTML = '';
		for(let key in data){
				let option = `<option value="${key}">${key}</option>`;
				selectTargets.innerHTML += option;
		}
	}

	/* Обновляет отображаемые данные в боковой вкладке */
	changeDisplayedOperData(data){
		const content = document.getElementById('operationsList');
		if(!content){
			return;
		};
		let color;
		switch (data[0].type) {
			case 'exp':
				color = 'red';
				break;

			case 'inc':
				color = 'green';
				break;

			case 'rem':
				color = '#444';
				break;
		}
		content.innerHTML =  this.components.operationBlock.render(data[0].sum, data[0].cat, data[0].account, data[0].time, color, data[0].id);
		for(let i = 1; i < data.length; i++){
			if(data[i].type === 'exp'){
				color = 'red';
			}
			else if(data[i].type === 'inc'){
				color = 'green';
			}
			else{
				color = '#444'
			}
			content.innerHTML +=  this.components.operationBlock.render(data[i].sum, data[i].cat, data[i].account, data[i].time, color, data[i].id);
		}
	}

	/* Создает график */
	makeMainChart(func){
		let ctx = document.getElementById('mainChart');
		if(ctx){
			this.mainChart = func(ctx);
		};
	}

	/* Обновляет данные графика */
	updateMainChartData(func){
		if(this.mainChart){
			func(this.mainChart);
		};
	}

	/*
		*СТРАНИЦА СЧЕТОВ
	*/
	/* Создает страницу счетов */
	createMyAccountsPage(data){
		this.SPA.innerHTML += this.components.main.render();
		const mainField = document.querySelector('main');
		mainField.innerHTML = this.components.contentAccs.render();
		const content = mainField.querySelector('main .content');
		content.innerHTML = this.components.accountCardAdd.render();
		mainField.innerHTML += this.components.cryptoAside.render();
	}

	/* Обновляет счета на странице счетов */
	updateAccountsField(data){
		const mainField = document.querySelector('main .content');
		mainField.classList.add('account');
		const cards = document.querySelectorAll('.accountCard:not(.add)');
		if(cards){
			cards.forEach((e) => {
				e.remove();
			});
		};
		let parsedData = Object.entries(data);
		parsedData.forEach((elem) => {
			mainField.insertAdjacentHTML('afterbegin', this.components.accountCard.render(elem[0], elem[1]));
		})
	}

	/* Обновляет представление данных о криптовалюте */
	updateCryptoData(data){
		let ratesCrypto = '';
		data.forEach((e) => {
			ratesCrypto += this.components.rateBlock.render(e.name, e.price);
		});
		const aside = document.querySelector('#asideContent');
		aside.innerHTML = ratesCrypto;
	}

	/* Обновляет данные о валюте */
	updateCurrencyData(data){
		let ratesCurrency = '';
		data.forEach((e) => {
			ratesCurrency += this.components.rateBlock.render(e.abbr, e.rate, 'BYN', e.name);
		});
		const aside = document.querySelector('#asideContent');
		aside.innerHTML = ratesCurrency;
	}

	/* Открывает карточку добавления нового счета */
	openAccountCardAdd(data){
		this.toggleOverlay();
		const addCard = document.getElementById('accountAddCard');
		addCard.classList.add('active');
		if(data){
			addCard.querySelector('#deleteBtn').classList.add('active');
			addCard.querySelector('#accountName').value = data.name;
			addCard.querySelector('#accountSum').value = data.sum;
		};
	}

	/* Закрывает карточку добавления нового счета */
	closeAccountCardAdd(){
		this.toggleOverlay();
		const addCard = document.getElementById('accountAddCard');
		addCard.classList.remove('active');
		addCard.querySelector('#accountName').value = '';
		addCard.querySelector('#accountSum').value = '';
		addCard.querySelector('#deleteBtn').classList.remove('active');
	}


	/*
		*БОКОВОЕ МЕНЮ
	*/
	/* Создает боковое меню */
	createMenu(username, email){
		this.SPA.innerHTML = this.components.menu.render(username, email);
	}

	/* Фукусирует на целевом поле */
	focusOnInvalidField(target){
		target.focus();
	}

	/* Переключает боковое меню */
	toggleSideMenu(){
		const burger = document.getElementById('burger');
		const menu = document.getElementById('mainMenu');
		menu.classList.toggle('active');
		burger.classList.toggle('active');
	}

	/* Переключает активную кнопку меню */
	highlightMenuBtn(targetHash){
		const menuList = document.querySelectorAll('#mainMenu ul a');
		menuList.forEach((e) => {
			e.classList.remove('selected');
		});
		const target = document.querySelector(`#mainMenu a[href = '#${targetHash.toLowerCase()}']`)
		target.classList.add('selected');
	}

	/* Переключает видимость блока доп информации */
	toggleInfoBlock(isOpen){
		const infoBtn = document.getElementById('infoBtn');
		if(isOpen){
			infoBtn.classList.add('active');
		}
		else{
			infoBtn.classList.remove('active');
		}
	}

	/* Обновляет имя пользователя в боковом меню */
	updateUsernameTitle(name){
		document.getElementById('usernameTitle').textContent = name;
	};


	/* 
		*ВСПОМОГАТЕЛЬНОЕ
	*/
	/* Обработчик изменения размера окна */
	resizeMenuHandler(resize){
		const burger = document.getElementById('burger');
		const menu = document.getElementById('mainMenu');
		if(!burger || !menu){
			return;
		};
		if(resize && menu.classList.contains('active')){
			menu.classList.remove('active');
			burger.classList.remove('active');

		}
		else if(!resize && !menu.classList.contains('active')){
			menu.classList.add('active');
			burger.classList.add('active');
		}
	}

	/* Обработчик изменения размера окна в мобильной версии */
	resizeMobileHandler(resize){
		const burger = document.getElementById('burger');
		const menu = document.getElementById('mainMenu');
		const list = document.getElementById('aside');
		const addNewRecordBtn = document.getElementById('addNewRecordBtn');
		if(!list){
			return;
		}
		if(resize && !list.classList.contains('mobile')){
			list.classList.add('mobile');
			menu.classList.add('mobile');
			burger.classList.add('mobile');
			if(addNewRecordBtn){
				addNewRecordBtn.classList.add('mobile');
			};
		}
		else if(!resize && list.classList.contains('mobile')){
			list.classList.remove('mobile');
			menu.classList.remove('mobile');
			burger.classList.remove('mobile');
			if(addNewRecordBtn){
				addNewRecordBtn.classList.remove('mobile');
			}
		};
	}

	createOverlay(){
		this.SPA.innerHTML += this.components.overlay.render();
	}

	/* Переключает видимость оверлея */
	toggleOverlay(){
		const overlay = document.querySelector('div .overlay');
		overlay.classList.toggle('open');
	}

	/* Открывает доп меню в мобильной версии */
	openMobileAside(){
		const aside = document.querySelector('aside');
		aside.classList.toggle('active');
	}

	createSound(src){
		this.audio = new Audio();
		this.audio.src = src;
	}

	playSound(src){
		let audio = new Audio();
		audio.src = src;
		audio.play();
	}

	vibrate(duration){
		window.navigator.vibrate(duration);
	}
}