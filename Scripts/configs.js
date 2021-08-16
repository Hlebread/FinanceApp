const CategoriesExpenses = {
	food: {
		name: 'Еда и напитки',
		logo: '',
		color: 'red',
	},
	health: {
		name: 'Здоровье',
		logo: '',
	},
	family: {
		name: 'Семья',
		logo: '',
	},
	gifts: {
		name: 'Подарки',
		logo: '',
	},
	accommodation: {
		name: 'Жилье',
		logo: '',
	},
	purchases: {
		name: 'Покупки',
		logo: '',
	},
	transport: {
		name: 'Транспорт',
		logo: '',
	},
	life: {
		name: 'Жизнь и развлечения',
		logo: '',
	},
	pc: {
		name: 'Связь, ПК',
		logo: '',
	},
	fin: {
		name: 'Финансовые расходы',
		logo: '',
	},
	
}

const ChartConfig = {
	type: 'doughnut',
	data: {
		datasets: [{
			labels: [],
			data: [1],
			backgroundColor: [
				'rgba(128, 128, 128, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'#68ef00',
				'#7e0f12',
				'#4c44cf',
				'#fb4c1f',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)',
			],
		}]
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		responsiveAnimationDuration: 1,
		plugins: {
			legend: {
					display: true,
					labels: {
						usePointStyle: true,
						font: {
							size: 25,
						},
						padding: 20,
					},
			},
		},
	},
};

// const currencies = [
// 	{
// 		cur_ID: 431,
// 		cur_Name: "Доллар США",
// 	},
// 	{
// 		cur_ID: 451,
// 		cur_Name: "Евро",
// 	},
// 	{
// 		cur_ID: 452,
// 		cur_Name: "Злотых",
// 	},
// 	{
// 		cur_ID: 508,
// 		cur_Name: "Иен",
// 	},
// 	{
// 		cur_ID: 462,
// 		cur_Name: "Китайских юаней",
// 	},
// 	{
// 		cur_ID: 456,
// 		cur_Name: "Российских рублей",
// 	},
// 	{
// 		cur_ID: 429,
// 		cur_Name: "Фунт стерлингов",
// 	},
// 	{
// 		cur_ID: 463,
// 		cur_Name: "Чешских крон",
// 	},
// 	{
// 		cur_ID: 449,
// 		cur_Name: "Гривен",
// 	},
// 	{
// 		cur_ID: 441,
// 		cur_Name: "Болгарский лев",
// 	},
// 	{
// 		cur_ID: 510,
// 		cur_Name: "Австралийский доллар",
// 	},
// 	{
// 		cur_ID: 440,
// 		cur_Name: "Австралийский доллар",
// 	},
// ];