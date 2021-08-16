const Menu = {
	render: (user = 'Гость', email = 'Email', className = 'mainMenu') =>{
		return `
			<nav id="${className}" class="active">
				<header class="user">
					<span class="avatar"></span>
					<span id="usernameTitle">${user}</span>
					<div id="usernameEmail">${email}</div>
				</header>
				<section class="links">
					<ul>
						<li>
							<a href="#main" title="Главная" id="homePageBtn" class="menuBtn"><i class="fa-solid fa-house"></i>Главная</a>
						</li>
						<li>
							<a href="#accounts" title="Мои счета" id="myAccountsBtn" class="menuBtn"><i class="fa-solid fa-bank"></i>Мои счета</a>
						</li>
					</ul>
				</section>
				<section class="settings">

				</section>
				<footer>
					<div>
						<i class="fa-solid fa-circle-info" title="Инфо" id="infoBtn"><div class="info">EveNeuum v.0.1.0</div></i>
						<i class="fa-solid fa-right-from-bracket" title="Выход" id="exitBtn"></i>
					</div>
				</footer>
			</nav>
		`;
	}
};

const MainField = {
	render: () =>{
		return `
			<main></main>
		`;
	}
};

const ContentField = {
	render: (className = 'container') =>{
		return `
			<section class="${className}">
				<header class="header">
					<div id="burger" class="burger active" title="Меню"> <span></span></div>
					<div class="interval">
						<i class="fa-solid fa-calendar"></i>
						<select name="" id="interval">
							<option value="all">Все время</option>
							<option value="today">Сегодня</option>
							<option value="week">Последняя неделя</option>
							<option value="month">Последний месяц</option>
						</select>
					</div>
				</header>
				<main class="content">
					<div class="mainChart">
						<canvas id="mainChart"></canvas>
					</div>
					<div id="addNewRecordBtn" class="unselectable" title="Новая запись">+</div>
				</main>
			</section>
		`;
	}
};

const ContentFieldAccs = {
	render: (className = 'container') =>{
		return `
			<section class="${className}">
				<header class="header">
					<div id="burger" class="burger active" title="Меню"> <span></span></div>
				</header>
				<main class="content">
					<div class="mainChart">
						<canvas id="mainChart"></canvas>
					</div>
					<div id="addNewRecordBtn" class="unselectable" title="Новая запись">+</div>
				</main>
			</section>
		`;
	}
};

const ContentFieldAccount = {
	render: (className = 'container') =>{
		return `
			<section class="${className}">
				<header class="header">
					<div id="burger" class="burger active" title="Меню"> <span></span></div>
				</header>
				<main class="content">
					<div class="mainChart">
						<canvas id="mainChart"></canvas>
					</div>
					<div id="addNewRecordBtn" class="unselectable" title="Новая запись">+</div>
				</main>
			</section>
		`;
	}
};

const RightOperBar = {
	render: (id = 'aside') =>{
		return `
			<aside id="${id}">
				<div class="${id}">
					<h1 id="asideTitle">Последние операции</h1>
				</div>
				<div class="asideContent" id="operationsList">
				</div>
			</aside>
		`;
	}
};

const OperationBlock = {
	render: (sum, category, account, time, color, dataID, className = "operationAside") =>{
		return `
			<div class='${className}' data-id="${dataID}">
				<div>
					<div class="categoryAside">${category}</div>
					<div class="accountAside">${account}</div>
				</div>
				<div>
					<div class="summAside" style="color:${color};">${sum}<span id="currencyAside">USD</span></div>
					<div class="dateAside">${time}</div>
				</div>
			</div>
		`;
	}
};

const addRecordModal = {
	render: (id = 'addRecordModal') =>{
		return `
			<div class="addRecordModal modal" id="${id}">
				<nav>
					<button id="addIncomeBtn">Доход</button>
					<button id="addExpensesBtn" class="selected">Расход</button>
					<button id="addRemittanceBtn">Перевод</button>
				</nav>
				<section class="summCont">
					<i class="fa-solid fa-trash" id='deleteBtn'></i>
					<div id="sign">-</div>
					<input type="number" class="summ" id="modalSummInp" placeholder="&sum;">
				</section>
				<section class="fromTo">
					<div class="account">
						<div>Со счёта</div>
						<select name="" id="selectAccount">

						</select>
					</div>
					<div class="category">
						<div>На категорию</div>
						<select name="" id="selectCategory">
						</select>
					</div>
				</section>
				<textarea name="" id="" placeholder="Заметки..." id='notesInp'></textarea>
				<footer>
					<button id="closeModal">Отмена</button>
					<button id="saveModal">&#10004;</button>
				</footer>
			</div>
		`;
	}
};

const overlay = {
	render: () =>{
		return `
			<div class="overlay"></div>
		`;
	}
};

const CryptoAside = {
	render: (id = 'aside') =>{
		return `
			<aside id="${id}">
				<div class="titleCont">
					<button id='cryptoBtn' class='selected'>Крипто</button>
					<button id='currencyBtn'>Курс</button>
				</div>
				<div class="asideContent" id="asideContent">

				</div>
			</aside>
		`;
	}
};

const RateBlock = {
	render: (name, price, currency = 'USD', title ='', className = 'rateBlock') =>{
		return `
			<div class="${className}" title="${title}">
				<div id="cryptoName">${name}</div>
				<div id="cryptoPrice">${price}</div>
				<div>${currency}</div>
			</div>
		`;
	}
};

const AccountCardAdd = {
	render: () => {
		return `
			<div class="accountCard add" id="accountAddCard">
				<div class="container">
					<i class="fa-solid fa-trash" id='deleteBtn'></i>
					<input type="color" name="" id="inputColor">
					<input type="text" id="accountName" placeholder="Имя счета">
					<input type="number" id="accountSum" placeholder="Задать сумму">
					<footer>
						<button id="closeModal">Отмена</button>
						<button id="saveModal">&#10004;</button>
					</footer>
				</div>
				<div class="basic">+</div>
			</div>
		`;
	}
};

const AccountCard = {
	render: (accname, sum, color, className = 'accountCard') => {
		return `
			<div class="${className}">
				<div class="colorCorner" style="background:${color};"></div>
				<div class="accName">
					${accname}
				</div>
				<div class="sum">
					${sum}
				</div>
			</div>
		`;
	}
};
