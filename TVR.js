//Признаюсь, не знаю как оценить сколько я сделал, но процентов 50 здесь есть.
//Хотя я не запомнил JS, как и java/phyton/pascal. У меня деменция

let components = {
	container: document.createElement("div"),
	content: document.createElement("div"),
	wrapper: document.createElement("div"),
	cursor: document.createElement("div"),
	score: document.createElement("div"),
	tots: new Array(),//Я не придумал как называть штучки в игре, будут tot-ами, хотя я хотел "tit"- но есть проблема
}

let config = {
//цвет задника и окна игры
	containerColorBG: "#E0FFFF",
	contentColorBG: "#353336",
//размер окна игры
	countRows: 8,
	countCols: 10,
//украдено с интернета, как и всё, я ж самоучка
	offsetBorder: 10,
	borderRadius: 8,
//тип красиво 64 и т.д.
	totSize: 64,

	imagesCoin: ["coin\red.png","coin\green.png","coin\blue.png"],//тут нужно в репозитарии сделать монетки

	totClass:"tot",
	totIdPrefix: "tot",
	gameStates: ["pick", "switch", "revert", "remove", "refill"],
	gameState: "",

	movingItems: 0,

	countScore: 0
}

let player = {
	selectedRow: -1,
	selectedCol: -1,
	posX: "",
	posY: ""
}



//начало игры
initGame();

//активация состовляющих
function initGame () {
	document.body.style.margin = "0px";
	createPage();
	createContentPage();
	createWrapper();
	createCursor();
	createGrid();
	createScore();

	config.gameState = config.gameStates[ 0 ];
}

// тут связано с расположением элементов
function createPage() {
	components.container.style.backgroundColor = config.containerColorBG;
	components.container.style.height = "100vh";
	components.container.style.overflow = "hidden";//скрытие содержимого за пределом видимости
	components.container.style.display = "flex";
	components.container.style.alignItems = "center";// выравнивание
	components.container.style.justifyContent = "center";//выравнивание

	document.body.append(components.container);
}

function createContentPage () {
	components.content.style.padding = config.offsetBorder + "px";
	components.content.style.width = 	(config.totSize * config.countCols) +
										(config.offsetBorder * 2) + "px";
	components.content.style.height = 	(config.totSize * config.countRows) +
										(config.offsetBorder * 2) + "px";
	components.content.style.backgroundColor = config.contentColorBG;
	components.content.style.boxShadow = config.offsetBorder + "px";
	components.content.style.borderRadius = config.borderRadius + "px";
	components.content.style.boxSizing = "border-box";

	components.container.append(components.content);
}

// Создание монет и очков
function createWrapper () {
	components.wrapper.style.position = "relative";
	components.wrapper.style.height = "100%";
	components.wrapper.addEventListener("click", function(event) { handlerTab(event, event.target) });

	components.content.append(components.wrapper);
}

//выделение монет
function createCursor () {
	components.cursor.id = "marker";
	components.cursor.style.width = config.totSize - 10 + "px";
	components.cursor.style.height = config.totSize - 10 + "px";
	components.cursor.style.border = "5px solid white";
	components.cursor.style.borderRadius = "20px";
	components.cursor.style.position = "absolute";
	components.cursor.style.display = "none";

	components.wrapper.append(components.cursor);
}
// Функции на действие с курсором
function cursorShow () {
	components.cursor.style.display = "block";
}
function cursorHide () {
	components.cursor.style.display = "none";
}

// Очки и их оформление
function createScore () {
	components.score.style.width = 300 + "px";
	components.score.style.height = 50 + "px";
	components.score.style.display = "flex";
	components.score.style.justifyContent = "center";//выравнивание вдоль
	components.score.style.alignItems = "center"; //выравнивание поперёк
	components.score.style.borderRadius = config.borderRadius + "px"; //скругление углов
	components.score.style.backgroundColor = config.contentColorBG;//серый
	components.score.style.position = "absolute";
	components.score.style.bottom = "calc(100% + " + 24 + "px)";//роля окна очков
	components.score.style.left = "calc(50% - " + (parseInt(components.score.style.width) / 2) + "px)";
//стили
	components.score.style.fontFamily = "arial";
	components.score.style.fontSize = "18px";
	components.score.style.color = "#ffffff";

	updateScore();
}
function updateScore () {
	components.score.innerHTML = config.countScore;
	components.wrapper.append(components.score);
}

// Добавление очков
function scoreInc (count) {
	if (count >= 4) {
		count *= 2;
	} else if (count >= 5) {
		count = (count + 1) * 2;
	} else if (count >= 6) {
		count *= (count + 2) * 2;
	}

	config.countScore += count;
	updateScore();
}

// Создание монет, но они у меня не показываются
function createTot (t, l, row, col, img) {
	let coin = document.createElement("div");

	coin.classList.add(config.totClass);
	coin.id = config.totIdPrefix+'_'+row+'_'+col;
	coin.style.boxSizing = "border-box";
	coin.style.cursor = "pointer";
	coin.style.position = "absolute";
	coin.style.top = t + "px";
	coin.style.left = l + "px";
	coin.style.width = config.totSize + "px";
	coin.style.height = config.totSize + "px";
	coin.style.border = "1p solid transparent";
	coin.style.backgroundImage = 'url("+ img +")';//вот тут какя-то херня. При варианте GPT не работает, и при этом тоже не работает
	coin.style.backgroundSize = "100%";

	components.wrapper.append(coin);
}

// Создание матрицы
function createGrid() {
	// Создание пустой матрицы
	for(i = 0; i < config.countRows; i++) {
		components.tots[i] = new Array();
		for(j = 0; j < config.countCols; j++) {
			components.tots[i][j] = -1;
		}
	}
	// Заполняем матрицу
	for(i = 0; i < config.countRows; i++) {
		for(j = 0; j < config.countCols; j++) {
			do{
				components.tots[i][j] = Math.floor(Math.random() * 8);
			} while(isStreak(i, j));
			createTot(i * config.totSize, j * config.totSize, i, j, config.imagesCoin[ components.tots[i][j] ]);
		}
	}
}
function isStreak(row, col) {
	return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
}//проверка
// Проверка по колонкам
function isVerticalStreak(row, col) {
	let totValue = components.tots[row][col];
	let streak = 0;
	let tmp = row;
	while(tmp>0 && components.tots[tmp-1][col] == totValue){
		streak++;
		tmp--;
	}
	tmp = row;
	while(tmp < config.countRows - 1 && components.tots[tmp + 1][col] == totValue){
		streak++;
		tmp++;
	}
	return streak > 1;
}
// Проверка по строкам
function isHorizontalStreak(row, col) {
	let totValue = components.tots[row][col];
	let streak = 0;
	let tmp = col;
	while(tmp > 0 && components.tots[row][tmp - 1] == totValue){
		streak++;
		tmp--;
	}
	tmp = col;
	while(tmp < config.countCols - 1 && components.tots[row][tmp + 1] == totValue){
		streak++;
		tmp++;
	}
	return streak > 1;
}
// Обработка клика
function handlerTab (event, target) {
	if(target.classList.contains(config.totClass) && config.gameStates[ 0 ]) {
		// определить строку и столбец
		let row = parseInt(target.getAttribute("id").split("_")[ 1 ]);
		let col =  parseInt(target.getAttribute("id").split("_")[ 2 ]);
		cursorShow();
		components.cursor.style.top = parseInt(target.style.top) + "px";
		components.cursor.style.left = parseInt(target.style.left) + "px";
		if(player.selectedRow == -1) {
			player.selectedRow = row;
			player.selectedCol = col;
		} else {
			if ((Math.abs(player.selectedRow - row) == 1 && player.selectedCol == col) ||
				(Math.abs(player.selectedCol - col) == 1 && player.selectedRow == row)){
					cursorHide();
					config.gameState = config.gameStates[1];
					player.posX = col;
					player.posY = row;
					totSwitch();//смена мест
			} else {
				player.selectedRow = row;
				player.selectedCol = col;
			}
		}
	}
}

// семна места
function totSwitch () {
	let yOffset = player.selectedRow - player.posY;
	let xOffset = player.selectedCol - player.posX;
	document.querySelector("#" + config.totIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).classList.add("switch");
	document.querySelector("#" + config.totIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("dir", "-1");
	//разойдись
	document.querySelector("#" + config.totIdPrefix + "_" + player.posY + "_" + player.posX).classList.add("switch");
	document.querySelector("#" + config.totIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("dir", "1");

	$(".switch").each(function() {
		config.movingItems++;
		$(this).animate({
				left: "+=" + xOffset * config.totSize * $(this).attr("dir"),
				top: "+=" + yOffset * config.totSize * $(this).attr("dir")
			},
			{
				duration: 250,
				complete: function() {
					checkMoving();
				}
			}
		);
		$(this).removeClass("switch");
	});

	document.querySelector("#" + config.totIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol).setAttribute("id", "temp");
	document.querySelector("#" + config.totIdPrefix + "_" + player.posY + "_" + player.posX).setAttribute("id", config.totIdPrefix + "_" + player.selectedRow + "_" + player.selectedCol);
	document.querySelector("#temp").setAttribute("id",  config.totIdPrefix + "_" + player.posY + "_" + player.posX);
	//ну зачем все лепить? пусть будет место
	let temp = components.tots[player.selectedRow][player.selectedCol];
	components.tots[player.selectedRow][player.selectedCol] = components.tots[player.posY][player.posX];
	components.tots[player.posY][player.posX] = temp;
}

function checkMoving () {
	config.movingItems--;
	if(config.movingItems == 0) {
		switch(config.gameState) {
			case config.gameStates[1]:
			case config.gameStates[2]:
				if(!isStreak(player.selectedRow, player.selectedCol) && !isStreak(player.posY, player.posX)) {
					if(config.gameState != config.gameStates[2]){
						config.gameState = config.gameStates[2];
						totSwitch();
					} else {
						config.gameState = config.gameStates[0];
						player.selectedRow = -1;
						player.selectedCol = -1;
					}
				} else {
					config.gameState = config.gameStates[3]
					if(isStreak(player.selectedRow, player.selectedCol)) {
						removeTots(player.selectedRow, player.selectedCol);
					}
					if(isStreak(player.posY, player.posX)) {
						removeTots(player.posY, player.posX);
					}
					totFade();
				}
				break;
			case config.gameStates[3]:
				checkFalling();
				break;
			case config.gameStates[4]:
				placeNewTots();
				break;
		}

	}

}

// Удаляем тоты 1
function removeTots(row, col) {
	let totValue= components.tots[row][col];
	let tmp= row;
	document.querySelector("#" + config.totIdPrefix + "_" + row+ "_" + col).classList.add("remove");
	let countRemoveTot = document.querySelectorAll(".remove").length;
	if (isVerticalStreak(row, col)) {
		while (tmp > 0 && components.tots[tmp - 1][col] == totValue) {
			document.querySelector("#" + config.totIdPrefix + "_" + (tmp - 1) + "_" + col).classList.add("remove");
			components.tots[tmp - 1][col] = -1;
			tmp--;
			countRemoveTot++;
		}
		tmp = row;
		while (tmp < config.countRows - 1 && components.tots[tmp + 1][col] == totValue) {
			document.querySelector("#" + config.totIdPrefix + "_" + (tmp + 1) + "_" + col).classList.add("remove");
			components.tots[tmp + 1][col] = -1;
			tmp++;
			countRemoveTot++;
		}
	}

	if (isHorizontalStreak(row, col)) {
		tmp = col;
		while (tmp > 0 && components.tots[row][tmp - 1] == totValue) {
			document.querySelector("#" + config.totIdPrefix + "_" + row + "_" + (tmp - 1)).classList.add("remove");
			components.tots[row][tmp - 1] = -1;
			tmp--;
			countRemoveTot++;
		}
		tmp = col;
		while(tmp < config.countCols - 1 && components.tots[row][tmp + 1] == totValue) {
			document.querySelector("#" + config.totIdPrefix + "_" + row + "_" + (tmp + 1)).classList.add("remove");
			components.tots[row][tmp + 1] = -1;
			tmp++;
			countRemoveTot++;
		}
	}
	components.tots[row][col] = -1;
	scoreInc(countRemoveTot);
}

// Удаляем тоты 2
function totFade() {
	$(".remove").each(function() {
		config.movingItems++;

		$(this).animate({
				opacity: 0
			},
			{
				duration: 200,
				complete: function() {
					$(this).remove();
					checkMoving();
				}
			}
		);
	});
}

// Заполняем пустоту
function checkFalling() {
	let fellDown = 0;
	for(j = 0; j < config.countCols; j++) {
		for(i = config.countRows - 1; i > 0; i--) {
			if(components.tots[i][j] == -1 && components.tots[i - 1][j] >= 0) {
				document.querySelector("#" + config.totIdPrefix + "_" + (i - 1) + "_" + j).classList.add("fall");
				document.querySelector("#" + config.totIdPrefix + "_" + (i - 1) + "_" + j).setAttribute("id", config.totIdPrefix + "_" + i + "_" + j);
				components.tots[ i ][ j ] = components.tots[ i - 1 ][ j ];
				components.tots[ i - 1 ][ j ] = -1;
				fellDown++;
			}

		}
	}
	$(".fall").each(function() {
		config.movingItems++;
		$(this).animate({
				top: "+=" + config.totSize
			},
			{
				duration: 100,
				complete: function() {
					$(this).removeClass("fall");
					checkMoving();
				}
			}
		);
	});
	if(fellDown == 0){
		config.gameState = config.gameStates[4];
		config.movingItems = 1;
		checkMoving();
	}
}

function placeNewTots() {
	let totsPlaced = 0;
	for(i = 0; i < config.countCols; i++) {
		if(components.tots[ 0 ][ i ] == -1) {
			components.tots[ 0 ][ i ] = Math.floor(Math.random() * 8);
			createTot(0, i * config.totSize, 0, i, config.imagesCoin[ components.tots[ 0 ][ i ] ]);
			totsPlaced++;
		}
	}
	if(totsPlaced) {
		config.gameState = config.gameStates[ 3 ];
		checkFalling();
	} else {
		let combo = 0
		for (i = 0; i < config.countRows; i++) {
			for (j = 0; j < config.countCols; j++) {
				if (j <= config.countCols - 3 && components.tots[ i ][ j ] == components.tots[ i ][ j + 1 ] && components.tots[ i ][ j ] == components.tots[ i ][ j + 2 ]) {
					combo++;
					removeTots(i, j);
				}
				if (i <= config.countRows - 3 && components.tots[ i ][ j ] == components.tots[ i + 1 ][ j ] && components.tots[ i] [ j ] == components.tots[ i + 2 ][ j ]) {
					combo++;
					removeTots(i, j);
				}
			}
		}
		if(combo > 0) {
			config.gameState = config.gameStates[ 3 ];
			totFade();
		} else {
			config.gameState = config.gameStates[ 0 ];
			player.selectedRow= -1;
		}
	}
}
//Франкинштейн готов, но работает ли он?
//ННЕЕЕЕЕЕЕЕТТ, где картинкиииииииии!!!!
