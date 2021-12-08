const exitButton = document.getElementById('exit');
const toolButton = document.getElementById('tool');
/////////
const clientItem = document.getElementById('clientSection');
const clientSubItem = document.getElementById('clientSub');
////////
const pedidosItem = document.getElementById('pedidosSection');
const pedidosSubItem = document.getElementById('pedidosSub');
///////
const otrosItem = document.getElementById('otrosSection');
const otrosSubItem = document.getElementById('otrosSub');

exitButton.addEventListener('click', (click) => {
    window.location = '/';
    // TODO: BACKEND REQUEST TO CLOSE SESSION.
});

toolButton.addEventListener('click', (click)=>{
   // TODO: CONFIGURATION TOOL BUTTON.
   window.location = '/tools/home';
});

clientItem.addEventListener('mouseover', (f)=>{
    clientSubItem.style.display = 'block';
});

clientItem.addEventListener('mouseout', (f)=>{
    clientSubItem.style.display = 'none';
});

pedidosItem.addEventListener('mouseover', (f)=>{
    pedidosSubItem.style.display = 'block';
});

pedidosItem.addEventListener('mouseout', (f)=>{
    pedidosSubItem.style.display = 'none';
});

otrosItem.addEventListener('mouseover', (f)=>{
    otrosSubItem.style.display = 'block';
});

otrosItem.addEventListener('mouseout', (f)=>{
    otrosSubItem.style.display = 'none';
});