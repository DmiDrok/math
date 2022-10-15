// Настройки игры
gameOptions = JSON.parse(localStorage.getItem("gameOptions"));
let used = [];

// При стольких пикселях будет показан бургер вместо стандартного меню
const widthToBurger = 400;

// По клику на одну категорию - делаем её активной, все другие - обнуляем
function changeCategory(allCats, saveCategory) {
	// Получение случайного массива с значениями переменных и ответом от действия с ними
	function getRandomAnswer() {
		let [firstValue, secondValue, result] = [null, null, null];
		if (action != actions.div) {
			firstValue = Math.floor(Math.random() * maxNum);
			secondValue = Math.floor(Math.random() * maxNum);
		} else {
			firstValue = Math.floor(Math.random() * maxNumDiv);
			secondValue = Math.floor(Math.random() * maxNumDiv);

			// Если включены дроби в настройках - нужно правильно оформить её вид
			if (gameOptions.float) {
				result = Infinity;
				while (result == Infinity) result = String(firstValue / secondValue).slice(0, 3);
			}
		}

		// Если в настройках игры включены отрицательные значения - с некоторым шансом выдаём их
		if (gameOptions.negative) {
			firstValue = Math.random() > 0.5 ? -firstValue : firstValue;
			secondValue = Math.random() > 0.5 ? -secondValue : secondValue;

			if (secondValue < 0) {
				secondValue = `(${secondValue})`;
			}
		}

		// Если у нас вычитание и получается отрицательное, а в настройках без отрицательных - меняем переменные местами
		if (!gameOptions.negative && action == actions.dif && firstValue < secondValue) {
			[firstValue, secondValue] = [secondValue, firstValue];
		}

		// Если у нас деление и запрещены дроби
		if (!gameOptions.float && action == actions.div) {
			[firstValue, secondValue] = getCorrectDivisors(firstValue, secondValue);
		}

		if (!result) result = eval(`${firstValue}${action}${secondValue}`);
		return [firstValue, secondValue, result];

	}

	// Корректные делители (которые делятся нацело)
	function getCorrectDivisors(firstValue, secondValue) {
		while (firstValue % secondValue != 0) {
			firstValue = Math.floor(Math.random() * maxNumDiv);
			secondValue = Math.floor(Math.random() * maxNumDiv);
		}

		return [firstValue, secondValue];
	}

	const classActive = "active";

	for (cat of allCats) {
		cat.classList.remove(classActive);
	}
	saveCategory.classList.add(classActive);

	const nameCat = saveCategory.name; // Имя активной категории
	const wrongSound = document.querySelector(".wrong-sound");
	wrongSound.volume = 0.1;

	const maxNum = 10;
	const maxNumDiv = 100;
	const actions = {
		sum: "+",
		dif: "-",
		mul: "*",
		div: "/",
	}
	const firstValueHTML = document.querySelector(".first-value");
	const actionHTML = document.querySelector(".action");
	const secondValueHTML = document.querySelector(".second-value");
	const resultHTML = document.querySelector(".result");

	const answers = Array.from(document.querySelectorAll(".answers__value")); // Варианты ответов
	answers.forEach(item => {
		item.classList.remove("correct");
		item.value = null;
	});

	let [firstValue, action, secondValue, result] = [null, null, null, null];
	action = actions[nameCat];
	[firstValue, secondValue, result] = getRandomAnswer();


	// Если у нас вычитание и получается отрицательное, а в настройках без отрицательных - меняем переменные местами
	if (!gameOptions.negative && action == actions.dif && firstValue < secondValue) {
		[firstValue, secondValue] = [secondValue, firstValue];
	}

	firstValueHTML.innerHTML = firstValue;
	secondValueHTML.innerHTML = secondValue;
	actionHTML.innerHTML = action;

	// Устанавливаем варианты ответов
	let correctIndex = Math.floor(Math.random() * answers.length);
	let correctAnswer = result;
	if (used.length > 2) {
		used = [];
	}
	for (let i = 0; i < answers.length; ++i) {
		// Оформление для правильного ответа
		if (i == correctIndex) {
			answers[i].innerHTML = correctAnswer;
			answers[i].value = correctAnswer;
			answers[i].classList.add("correct");
			used.push(correctAnswer);
			continue;
		}

		// Неправильные ответы
		let randomAnswer = getRandomAnswer()[2];
		while (used.some(item => item == randomAnswer) || randomAnswer == correctAnswer) {
			randomAnswer = getRandomAnswer()[2];
		}

		used.push(randomAnswer);
		answers[i].innerHTML = randomAnswer;
		answers[i].value = randomAnswer;
	}

	answers.forEach(item => item.onclick = () => {
		if (item.classList.contains("correct")) {
			changeCategory(allCats, saveCategory);
		} else {
			wrongSound.play();
		}
	})
}

// Процесс игры
function gameLoopStart() {
	// Установка специальных имён кнопкам
	function setNameToCats(allCats) {
		allCats[0].name = "sum";
		allCats[1].name = "dif";
		allCats[2].name = "mul";
		allCats[3].name = "div";
	}

	let cats = null;
	//Если меню обычное (не бургер)
	if (window.innerWidth > widthToBurger) {
		cats = Array.from(document.querySelectorAll("header .nav__category"));
	} else {
		cats = Array.from(document.querySelectorAll(".mobile-navigation .nav__category"));
	}
	setNameToCats(cats);

	// Установка события смены категории по клику на неё
	cats.forEach(item => {
		cats.indexOf(item) === 0 ? item.active = true : item.active = false;
		item.onclick = () => {
			changeCategory(cats, item);
		}
	});
	changeCategory(cats, cats[0]);
}


// По нажатию на шестерёнки показывать настройки
function onClickShowOptions() {
	// Плавное закрытие попапа
	function closePopup() {
		popup.style.opacity = 0;
		setTimeout(() => {
			popup.classList.remove(activeClass);
			popup.style.opacity = "";
		}, 550);
	}

	// Установка значений по умолчанию в чекбоксы (по значениям из настроек gameOptions)
	function setDefaultValuesInputs() {
		negative.checked = gameOptions.negative;
		float.checked = gameOptions.float;
	}

	const optionsBtn = document.querySelector(".options");
	const popup = document.querySelector(".popup");
	const close = document.querySelector(".popup .close");
	const negative = popup.querySelector(".negative-values");
	const float = popup.querySelector(".float-values");
	const activeClass = "active";
	const apply = popup.querySelector(".apply");
	setDefaultValuesInputs();

	document.addEventListener("click", event => {
		if (popup.classList.contains(activeClass) && event.target == popup) {
			closePopup();
		}
	})

	optionsBtn.onclick = () => {
		popup.classList.add(activeClass);
	}

	close.onclick = () => {
		closePopup();
	}

	// Применение изменений
	apply.onclick = () => {
		gameOptions.negative = negative.checked;
		gameOptions.float = float.checked;
		localStorage.setItem("gameOptions", JSON.stringify(gameOptions));

		changeCategory(document.querySelectorAll(".nav__category"), document.querySelector(".nav__category.active"));
		closePopup();
	}
}

try {
	gameLoopStart();
	onClickShowOptions();
} catch(err) {
	console.error(err);
}