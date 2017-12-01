// window.onload = function() {
// 	prepareEventHandlers();
// }

// function prepareEventHandlers() {
	//On nommera "W" et "B" les cases au fur et à mesure de l'occupation
	let grid = [	
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""],
	["","","","","","","","","","","","","","","","","","",""]
	];

	let button = document.getElementById('launch_2_players');

	let board_game = document.getElementById('board_game');

	class Player {
		constructor(player_name="unknow", color,score=0,statue) {
			this.player_name = player_name;
			this.score = score;
			this.capture = 0;
			this.color = color;
		}
	}

	let player_1 = new Player("player_1", "B");
	let player_2 = new Player("player_2", "W",7.5);
	let active_player = player_1;

	let notification = document.getElementById('notification');

	button.addEventListener('click', create_board_game, false);

	function create_board_game() {
		let board_game_areas = "";
		//Création du plateau (une div avec une classe et un id à chaque intersection)
		let game_area = [];
		for (let i = 0 ; i < 19 ; i++) {
			board_game_areas += `<div id="ligne${i}" class="lignes">`;
			
			for (let j = 0; j < 19 ; j++) {
				board_game_areas += `<div id="area_${j}-${i}" class="intersection"></div>`;
			}
			board_game_areas += `</div>`;
		}
		board_game.innerHTML = board_game_areas;
		
		//On annonce à qui est le tour
		notification.innerText = "Au tour du joueur 1";

		players_round();

	}
	//On rend les cases actives, en attente d'un clic du joueur
	function players_round () {
		for (let u = 0 ; u < 19 ; u++) {
			for (let h = 0; h < 19 ; h++) {
				document.getElementById("area_" + h + "-" + u ).addEventListener('click', round_game, false);
			}
		}
	}
	//Une fois la case cliquée, on récupère sa coordonnée,
	//On rend les cases inactives
	function round_game() {

		let clicked_area;
		if (this.getAttribute("id").length==8){
			clicked_area = [this.getAttribute("id")[5],this.getAttribute("id")[7]];
		} else if (this.getAttribute("id").length==10){
			clicked_area = [this.getAttribute("id")[5]+this.getAttribute("id")[6],this.getAttribute("id")[8]+this.getAttribute("id")[9]];
		} else if (this.getAttribute("id")[7] == 1) {
			clicked_area = [this.getAttribute("id")[5],this.getAttribute("id")[7]+this.getAttribute("id")[8]];
		} else {
			clicked_area = [this.getAttribute("id")[5]+this.getAttribute("id")[6],this.getAttribute("id")[8]];
		}
		console.log(clicked_area);

		for (let u = 0 ; u < 19 ; u++) {
			for (let h = 0; h < 19 ; h++) {
				document.getElementById("area_" + h + "-" + u ).removeEventListener('click', round_game, false);
			}
		}
		// EN ATTENTE FONCTION CONDAMN_CHECK
		// if (empty_check(clicked_area) && (!(condamn_check(clicked_area,clicked_area))) ) {
		// 	;
	}
	//On verifie que la case n'est pas déjà occupée.
	function empty_check(clicked_area) {
		console.log(grid[clicked_area[0]][clicked_area[1]]);
		if (grid[clicked_area[0]][clicked_area[1]] == "") {
			return true;
		} else {return false;}
	}
	//L'area est l'intersection testée, lors de l'initialisation, la direction indique no_direction 
	//car on teste les 4 directions. 
	// 1 - On regarde si les intersections adjacentes sont vides.
	// 2 - Si une direction adjacentes est vide, on revoit que l'intersection n'est pas "condamnée".
	// 3 - Si toutes les intersections sont occupées, on regarde la couleur. Si cette couleur
	// et celle du joueur actif (celui qui vient de poser sur le plateau) alors étape 4.
	// 4 - Pour chaque intersection on refait les vérifications, à l'exception de la case de départ
	function condamn_check_any_direction(startArea,area,direction="no_direction") {
		//On retourne que la case n'est pas condamnée si il y a une case vide autour.
		let check_right = undefined;
		if(direction != "left") {
		//On s'assure que la case de droite n'est pas en dehors.
			if (grid[area[0]+1] > 18) {
				check_right = undefined;
			} else if ([area[0]+1,area[1]] != startArea) {
				check_right = grid[area[0]+1][area[1]];
			}
		}
		let check_left = undefined;
		if(direction != "right") {
			//On s'assure que la case de gauche n'est pas en dehors.
			if (grid[area[0]-1] < 0) { 
				check_left = undefined;
			} else if ([area[0]-1,area[1]] != startArea) {
				check_left = grid[area[0]-1][area[1]];
			}
		}
		//Pas besoin de s'assurer que la case au dessus est undefined, 
		//car ça renverra automatiquement undefined
		let check_up = undefined;
		if ((direction != "down") && ([area[0],area[1]+1] != startArea)) {
			 check_up = grid[area[0]][area[1]+1];
		}
		//Idem que pour up
		let check_down = undefined;
		if ((direction != "up") && ([area[0],area[1]-1] != startArea)) {
			let check_down = grid[area[0]][area[1]-1];
		}

		if (((check_right)||(check_left)||(check_up)||(check_down)) == "" ) {
			return false;
		//Si aucune des cases checkées n'est undefined, on vérifie alors les 
		//valeurs des cases adjacentes.
		}
		if (check_right == player_active.color) {
			 if (condamn_check(startArea,[area[0]+1,area[1]], right) == false) {
			 	return false;
		}
		if (check_left == player_active.color) {
			 if (condamn_check(startArea,[area[0]-1,area[1]], left) == false) {
			 	return false;
		}
		if (check_up == player_active.color) {
			 if (condamn_check(startArea,[area[0],area[1]+1], up) == false) {
			 	return false;
		}
		if (check_down == player_active.color) {
			 if (condamn_check(startArea,[[area[0],area[1]-1]], down) == false) {
			 	return false;
		}
		return true;

	}







//FIN DU PROGRAMME	
// }










	