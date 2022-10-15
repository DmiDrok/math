// Блок игры на весь оставшийся экран
function gameOnFullScreen() {
	const header = document.querySelector("header");
	const game = document.querySelector(".game");

	game.style.height = (window.innerHeight - header.clientHeight - parseFloat(getComputedStyle(game).marginTop)) + "px";
}

// Попап с настройками на весь экран
function optionsPopupOnFullScreen() {
	const popup = document.querySelector(".popup");
	popup.style.height = window.innerHeight + "px";
}

// Настройка мобильного меню
function setCorrectMobileNav() {
	// Открытие меню
	function showNav() {
		burger.classList.add("active");
		nav.classList.add("active");
	}

	// Закрытие меню
	function closeNav() {
		nav.style.left = -500 + "px";
		setTimeout(() => {
			nav.classList.remove("active");
			burger.classList.remove("active");
			nav.style.left = "";
		}, 550);
	}

	const burger = document.querySelector(".burger");
	const nav = document.querySelector(".mobile-navigation");
	const close = nav.querySelector(".close");

	document.addEventListener("touchstart", (event) => {
		if (nav.classList.contains("active") && event.target.closest(".nav") != nav) {
			closeNav();
		}
	})

	// Клик на бургер - открываем меню
	burger.onclick = event => {
		event.stopPropagation();
		showNav();
	}

	// Клик на крестик - закрываем меню
	close.onclick = () => {
		closeNav();
	}
}

// Добавление настроек в localStorage
function setOptionsToLocalStorage() {
	// Если в localStorage не хранятся настройки игры - ставим их в значение по умолчанию
	if (!localStorage.getItem("gameOptions")) {
		gameOptions = {
			negative: false,
			float: false,
		};
		localStorage.setItem("gameOptions", JSON.stringify(gameOptions));
	}
}


try {
	gameOnFullScreen();
	optionsPopupOnFullScreen();
	setCorrectMobileNav();
	setOptionsToLocalStorage();
} catch(err) {
	console.error(err);
}