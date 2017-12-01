window.onload = function() {
	prepareEventHandlers();
}

function prepareEventHandlers() {



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
		constructor(player_name="unknow", color,dot_color,score=0) {
			this.player_name = player_name;
			this.score = score;
			this.capture = 0;
			this.color = color;
			this.dot_color = dot_color;
		}
	}

	let player_1 = new Player("player_1", "B","black_dot");
	let player_2 = new Player("player_2", "W","white_dot",7.5);
	let player_active = player_1;
	let compteurTourPasse = 0;
	let notification = document.getElementById('notification');
	let pass_button = document.getElementById('pass_button');

	button.addEventListener('click', creationPartie, false);

	function creationPartie() {
		let board_game_areas = "";
		//Création du plateau (une div avec une classe et un id à chaque intersection)
		// let game_area = [];
		for (let i = 0 ; i < 19 ; i++) {
			board_game_areas += `<div id="ligne${i}" class="lignes">`;
			
			for (let j = 0; j < 19 ; j++) {
				board_game_areas += `<div id="area_${i}-${j}" class="intersection"></div>`;
			}
			board_game_areas += `</div>`;
		}
		board_game.innerHTML = board_game_areas;
		notification.innerText = "Au tour de " + player_active.player_name;
		pass_button.style.display = "block";
		pass_button.addEventListener('click', tourPasse, false);
		activationCases();

	}
	//On rend les cases actives, en attente d'un clic du joueur
	function activationCases () {
		for (let u = 0 ; u < 19 ; u++) {
			for (let h = 0; h < 19 ; h++) {
				document.getElementById("area_" + u + "-" + h ).addEventListener('click', phaseDeJeu, false);
			}
		}
	}

	function tourPasse() {
		if (player_active == player_1) {
			player_active = player_2;
		} else { player_active = player_1;}
		compteurTourPasse += 1;
		if (compteurTourPasse == 2) {
			notification.innerText = "Fin de la partie ! Comptez vos points";
			console.log("coucou");
			pass_button.style.display = "none";
			for (let u = 0 ; u < 19 ; u++) {
				for (let h = 0; h < 19 ; h++) {
					document.getElementById("area_" + u + "-" + h ).removeEventListener('click', phaseDeJeu, false);
				}
			}
		} else {notification.innerText = "Au tour de " + player_active.player_name;}
		
	}

	function phaseDeJeu() {
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
		clicked_area = [Number(clicked_area[0]),Number(clicked_area[1])];
		compteurTourPasse = 0;

		// for (let u = 0 ; u < 19 ; u++) {
		// 	for (let h = 0; h < 19 ; h++) {
		// 		document.getElementById("area_" + u + "-" + h ).removeEventListener('click', round_game, false);
		// 	}
		let directionCondamn = isCondamnOpposition(clicked_area,grid);
		if(!(isEmpty(clicked_area))) {
			return alert("Coup impossible");
		} else if (directionCondamn != "    " ) {
			directionSuppression(clicked_area,grid,directionCondamn);
		} else if (isCondamn(clicked_area,grid)) {
			return alert("Coup impossible");
		}


		document.getElementById(this.id).classList.add(player_active.dot_color);
		grid[clicked_area[0]][clicked_area[1]] = player_active.color;
		
		

		if (player_active == player_1) {
			player_active = player_2;
		} else { player_active = player_1;}

		
		notification.innerText = "Au tour de " + player_active.player_name;
	}

	//On verifie que la case n'est pas déjà occupée.
	function isEmpty(clicked_area) {
		if (grid[clicked_area[0]][clicked_area[1]] == "") {
			return true;
		} else {return false;}
	}

	function isCondamn(area, gridTest1) {
		let gridTest = clone(gridTest1);



		gridTest[area[0]][area[1]] = player_active.color + "check";

		let check_right = undefined;
		if (!(area[0]+1 > 18)) {
			check_right = gridTest[area[0]+1][area[1]];
		}

		let check_left = undefined;
		if (!(area[0]-1 < 0)) {
			check_left = gridTest[area[0]-1][area[1]];
		}

		let check_down = undefined;
		if (!(area[1]-1< 0)) {
			check_down = gridTest[area[0]][area[1]-1];
		}
		
		let check_up = undefined;
		if (!(area[1]+1 > 18)) {
			check_up = gridTest[area[0]][area[1]+1];
		}

		if ((check_right == "")||(check_left == "")||(check_up == "")||(check_down == "")) {
			return false;
		}

		if (check_right == player_active.color) {
			 if (isCondamn([area[0]+1,area[1]],gridTest) == false) {
			 	return false;
			}
		}
		if (check_left == player_active.color) {
			 if (isCondamn([area[0]-1,area[1]],gridTest) == false) {
			 	return false;
			}
		}
		if (check_up == player_active.color) {
			 if (isCondamn([area[0],area[1]+1],gridTest) == false) {
			 	return false;
			}
		}
		if (check_down == player_active.color) {
			 if (isCondamn([area[0],area[1]-1],gridTest) == false) {
			 	return false;
			}
		}
		return true;
	}

	function isCondamnOpposition(area, grid) {


		let check_right = undefined;
		if (!(area[0]+1 > 18)) {
			check_right = grid[area[0]+1][area[1]];
		}

		let check_left = undefined;
		if (!(area[0]-1 < 0)) {
			check_left = grid[area[0]-1][area[1]];
		}

		let check_down = undefined;
		if (!(area[1]-1< 0)) {
			check_down = grid[area[0]][area[1]-1];
		}
		
		let check_up = undefined;
		if (!(area[1]+1 > 18)) {
			check_up = grid[area[0]][area[1]+1];
		}

		let colorCheck ="W";
		if (player_active.color == "W") {
			colorCheck ="B";
		}
		

		let directionCondamn = "";
		if (check_right == colorCheck) {
			 if (isCondamnOpposite2([area[0]+1,area[1]],area,grid) == true) {
			 	directionCondamn += "R";
			} else {directionCondamn += " ";}
		} else {directionCondamn += " ";}
		if (check_left == colorCheck) {
			 if (isCondamnOpposite2([area[0]-1,area[1]],area,grid) == true) {
			 	directionCondamn += "L";
			} else {directionCondamn += " ";}
		} else {directionCondamn += " ";}
		if (check_up == colorCheck) {
			 if (isCondamnOpposite2([area[0],area[1]+1],area,grid) == true) {
			 	directionCondamn += "U";
			} else {directionCondamn += " ";}
		} else {directionCondamn += " ";}
		if (check_down == colorCheck) {
			 if (isCondamnOpposite2([area[0],area[1]-1],area,grid) == true) {
			 	directionCondamn += "D";
			} else {directionCondamn += " ";}
		} else {directionCondamn += " ";}
		return directionCondamn;
	}

	function isCondamnOpposite2(area, exArea, gridTest1) {

		let gridTest2 = clone(gridTest1);
		let colorCheck1 ="W";
		if (player_active.color == "W") {
			colorCheck1 ="B"; 
		}

		gridTest2[exArea[0]][exArea[1]] = player_active.color + "check";
		gridTest2[area[0]][area[1]] = colorCheck1 + "check";
		

		let check_right = undefined;
		if (!(area[0]+1 > 18)) {
			check_right = gridTest2[area[0]+1][area[1]];
		}

		let check_left = undefined;
		if (!(area[0]-1 < 0)) {
			check_left = gridTest2[area[0]-1][area[1]];
		}

		let check_down = undefined;
		if (!(area[1]-1< 0)) {
			check_down = gridTest2[area[0]][area[1]-1];
		}
		
		let check_up = undefined;
		if (!(area[1]+1 > 18)) {
			check_up = gridTest2[area[0]][area[1]+1];
		}

		if ((check_right == "")||(check_left == "")||(check_up == "")||(check_down == "")) {
			return false;
		}

		if (check_right == colorCheck1) {
			 if (isCondamnOpposite2([area[0]+1,area[1]],[area[0],area[1]],gridTest2) == false) {
			 	return false;
			}
		}
		if (check_left == colorCheck1) {
			 if (isCondamnOpposite2([area[0]-1,area[1]],[area[0],area[1]],gridTest2) == false) {
			 	return false;
			}
		}
		if (check_up == colorCheck1) {
			 if (isCondamnOpposite2([area[0],area[1]+1],[area[0],area[1]],gridTest2) == false) {
			 	return false;
			}
		}
		if (check_down == colorCheck1) {
			 if (isCondamnOpposite2([area[0],area[1]-1],[area[0],area[1]],gridTest2) == false) {
			 	return false;
			}
		}
		return true;
	}

	function directionSuppression (area,grid,directionCondamn) {
		if(directionCondamn[0] == "R") {
			opposentSuppression([area[0]+1,area[1]],grid);
		}

		if(directionCondamn[1] == "L") {
			opposentSuppression([area[0]-1,area[1]],grid);
		}

		if(directionCondamn[2] == "U") {
			opposentSuppression([area[0],area[1]+1],grid);
		}

		if(directionCondamn[3] == "D") {
			opposentSuppression([area[0],area[1]-1],grid);
		}
	}

	function opposentSuppression (area,grid) {
		let colorCheck2 ="W";
		if (player_active.color == "W") {
			colorCheck2 ="B"; 
		}
		
		let dotSuppress = "white_dot";
		if (player_active.dot_color == "white_dot") {
			dotSuppress = "black_dot";
		}

		document.getElementById("area_" + area[0] + "-" + area[1] ).classList.remove(dotSuppress);
		grid[area[0]][area[1]] = "";

		let check_right = undefined;
		if (!(area[0]+1 > 18)) {
			check_right = grid[area[0]+1][area[1]];
		}

		let check_left = undefined;
		if (!(area[0]-1 < 0)) {
			check_left = grid[area[0]-1][area[1]];
		}

		let check_down = undefined;
		if (!(area[1]-1< 0)) {
			check_down = grid[area[0]][area[1]-1];
		}
		
		let check_up = undefined;
		if (!(area[1]+1 > 18)) {
			check_up = grid[area[0]][area[1]+1];
		}

		if (check_right == colorCheck2) {
			opposentSuppression([area[0]+1,area[1]],grid);
			}
		if (check_left == colorCheck2) {
			opposentSuppression([area[0]-1,area[1]],grid);
			}
		if (check_up == colorCheck2) {
			 opposentSuppression([area[0],area[1]+1],grid);
		}
		if (check_down == colorCheck2) {
			 opposentSuppression([area[0],area[1]-1],grid);
		}
	}

	function clone(item) {
    if (!item) { return item; } // null, undefined values check

    var types = [ Number, String, Boolean ], 
        result;

    // normalizing primitives if someone did new String('aaa'), or new Number('444');
    types.forEach(function(type) {
        if (item instanceof type) {
            result = type( item );
        }
    });

    if (typeof result == "undefined") {
        if (Object.prototype.toString.call( item ) === "[object Array]") {
            result = [];
            item.forEach(function(child, index, array) { 
                result[index] = clone( child );
            });
        } else if (typeof item == "object") {
            // testing that this is DOM
            if (item.nodeType && typeof item.cloneNode == "function") {
                var result = item.cloneNode( true );    
            } else if (!item.prototype) { // check that this is a literal
                if (item instanceof Date) {
                    result = new Date(item);
                } else {
                    // it is an object literal
                    result = {};
                    for (var i in item) {
                        result[i] = clone( item[i] );
                    }
                }
            } else {
                // depending what you would like here,
                // just keep the reference, or create new object
                if (false && item.constructor) {
                    // would not advice to do that, reason? Read below
                    result = new item.constructor();
                } else {
                    result = item;
                }
            }
        } else {
            result = item;
        }
    }

    return result;
}





	
}










	