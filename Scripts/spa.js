const App = document.createElement('div');
document.body.append(App);
const components = {
	menu: Menu,
	main: MainField,
	content: ContentField,
	contentAccs: ContentFieldAccs,
	operationsBar: RightOperBar,
	addRecordModal: addRecordModal,
	overlay: overlay,
	operationBlock: OperationBlock,
	exp: CategoriesExpenses,
	cryptoAside: CryptoAside,
	rateBlock: RateBlock,
	accountCard: AccountCard, 
	accountCardAdd: AccountCardAdd, 
};
const pages = {
	welcome: StartPage,
	login: SignInPage,
	signUp: SignUpPage,
}
const configs = {
	mainChart: ChartConfig,
	expenses: CategoriesExpenses,
}

let view = new View(App, pages, components);
let model = new Model(view, configs);
let controller = new Controller(model, App);

// model.login('1@mail.ru', '123123', true);
