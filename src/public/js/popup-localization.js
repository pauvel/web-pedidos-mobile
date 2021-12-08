let btnAbrirPopup 	= document.querySelector('#localizationButton');
let btnCerrarPopup 	= document.getElementById('btn-cerrar-popup');
let overlay 		= document.getElementById('overlay');
let popup 			= document.getElementById('popup');

btnAbrirPopup.addEventListener('click', (e) => {
	overlay.classList.add('active');
	popup.classList.add('active');
});

btnCerrarPopup.addEventListener('click', (e) => {
	e.preventDefault();
	overlay.classList.remove('active');
	popup.classList.remove('active');
});
