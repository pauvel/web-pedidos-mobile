const orderButton = document.querySelector('#order-button'); // Boton para pedir ordenar.
const optionValue = document.querySelector('#cboxcategory'); // ComboBox para obtener el value seleccionado.
const descriptionTextArea = document.querySelector('#description-zone');
const sendDataButton = document.querySelector('#sendDataButton');
const continueFormButton = document.querySelector('#continueFormButton');
const uploadFileButton = document.querySelector('#uploadFormImage');
const fileInput = document.querySelector('#file-input');
const uploadImageSection = document.querySelector('.upload-image-section');
const formImage = document.querySelector('#formImage');
const backButton = document.createElement('button');
const categoryName = document.querySelector('#categoryName').textContent;
const btnCerrarPopupWithImage = document.querySelector('#btn-cerrar-popup');
let imageUrl = document.querySelector('#imageUrl');
const categoria = document.querySelector('#categoria');
const categoriaName = document.querySelector('#categoriaName');

/**
 *  Cloudinary data
 */
const cloudPreset = 'phwzqylx';
const cloudUrl = 'https://api.cloudinary.com/v1_1/dlds4xwpk/upload';
// Funcion que se auto-ejecuta al carrgar el script.
(
    ()=>{
        descriptionTextArea.style.display = 'none';
        sendDataButton.style.display = 'none';
        const currentCategory = document.querySelector('#categoryName').textContent; // Asignar nombre de categoria actual al titulo.
        optionValue.value = currentCategory.trim(); // En el options poner el valor de currentcategory. el cual es dibujado por hbs.
    }
)();

/**
 *  Tomar archivo adjuntado al formulario y subirlo a cloudinary.
 */
fileInput.addEventListener('change', async(e) => {
    const file = e.target.files[0];
    formImage.src = '/img/general/inprogress-loading.gif';
    continueFormButton.style.display = 'none';
    await uploadImage(file).then(async({secure_url, public_id}) => {
        formImage.id = public_id;
        formImage.src = secure_url;
        uploadFileButton.innerHTML = `
            <i class="fas fa-exchange-alt"></i>
            Cambiar imagen
        `.trim();
        continueFormButton.style.display = 'block';
    }).catch((e) => {
        console.warn(e);
    });
});

/**
 * @fileInput = Boton para elegir un archivo.
 */
uploadFileButton.addEventListener('click', (e) => {
    deleteImageFromDom();
    fileInput.click();
});

/**
 *  Boton para cerrar Popup
 */
btnCerrarPopupWithImage.addEventListener('click', (e) => {
    deleteImageFromDom();
});

// Evento para redireccionar al item del combobox seleccionado.
orderButton.addEventListener('click', (e)=>{
    window.location = `/products/show/products/?category=${optionValue.value}`;
});

backButton.addEventListener('click', (e) => {
    /**
     *  Boton  "Regresar" en el formulario en la zona de agregar descripcion.
     */
    const inputs = document.querySelectorAll('input');
    const divAdvise = document.querySelector('#infoForm');
    inputs.forEach(element => {
        /**
         *  Visibilizar todos los inputs.
         */
        element.style.display = 'block';
    });
    /**
     *  Desactivar textarea, continueButton, y add continueButton.
     */
    // Quit
    fileInput.style.display = 'none';
    descriptionTextArea.style.display = 'none';
    sendDataButton.style.display = 'none';
    imageUrl.style.display = 'none';
    categoria.style.display = 'none';
    categoriaName.style.display = 'none';
    // Modify
    divAdvise.classList.remove('isok-dialog');
    divAdvise.innerHTML = `
    Complete los campos correctamente, para poder agregar un producto al sistema en la categoria <b>${categoryName}</b>
    `.trim();
    // Add
    continueFormButton.style.display = 'block';
    uploadImageSection.style.display = 'block';
});

/**
 *  Subir imagen al servidor. 
 */
const uploadImage = async( localImage ) => {
    const formData = new FormData();
    formData.append('upload_preset', cloudPreset);
    formData.append('file', localImage);
    try {
        const response = await fetch( cloudUrl, {
            method: 'POST',
            body: formData
        });
        if(response.ok){
            const { secure_url, public_id } = await response.json();
            return {
                secure_url, 
                public_id
            };
        }else{
            throw await response.json();
        }
    } catch (err) {
        throw err;
    }
};

/**
 * 
 *  Metodo para eliminar la imagen actual
 *  
 */
const deleteImage = async( publicId ) => {
    const response = await fetch(`/products/delete/product/image/?public_id=${publicId}`, {
        method: 'GET',
    });
    const replier = await response.json();
    return replier;
};

/**
 *  Borrar imagen del documento, acorde condiciones y evaluaciones.
 */
const deleteImageFromDom = () => {
    if(formImage.id.trim() != 'formImage'){ // formImage es el id por defecto al abrir el documento.
        deleteImage(formImage.id.trim()).then(r => {
            console.warn(`Image with id: ${formImage.id.trim()} was deleted sucessfully!`);
            formImage.src = '/img/product-section/package.svg';
            formImage.id = 'formImage';
            fileInput.value = '';
            uploadFileButton.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                Subir imagen
            `.trim();
        });

    }
};

const isOkDialog = () => {
    const divWarning = document.createElement('div');
        divWarning.classList.add('isok-dialog');
        divWarning.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            Campos correctos, listo para registrar el producto.
        `.trim();
        const infoFormDescription = document.querySelector('#infoForm');
        divWarning.id = 'infoForm';
        infoFormDescription.replaceWith(divWarning);
        backButton.classList.add('delete-button');
        backButton.textContent = 'Regresar...';
        divWarning.appendChild(backButton);
};

const warningDialog = ( nodeInputIndex = 0, isCorrect = false) => {
    if(!isCorrect){
        const divWarning = document.createElement('div');
        divWarning.classList.add('warning-dialog');
        divWarning.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            Introduce correctamente todos los campos, recuerda subir una imagen.
        `.trim();
        const infoFormDescription = document.querySelector('#infoForm');
        divWarning.id = 'infoForm';
        infoFormDescription.replaceWith(divWarning);
        const inputs = document.querySelectorAll('input');
        const inputNodes = [];
        inputs.forEach(element => {
            inputNodes.push(element);
        });
        inputNodes[nodeInputIndex].style.background = '#FF8585';
    }
}

/**
 *  Boton para continuar en el formulario de registro de nuevo producto. 
 *  Al hacer click en el obtiene todos lo inputs que tenga el dom
 *  que solamente son: *Los del registo de producto.
 *  Los barrera y les asignara el estilo [display: none].
 * 
 */
continueFormButton.addEventListener('click', (e)=>{
    const inputs = document.querySelectorAll('input');
    const inputValues = [''];
    inputs.forEach(element => {
        // Agregamos cada value de cada input a [inputValues]
        inputValues.push(element.value);
    });
    const isSomeEmpty = inputValues.map( value =>{
        // Hay algun input vacio?
        return (value != '') ? false : true;
    });
    isSomeEmpty.shift(); // Quitamos el primero que es el textarea.
    if(isSomeEmpty.includes(true)){
        // Si algun campo esta vacio
        console.warn('Tiene un campo vacio.');
        for (let i = 1; i < inputValues.length; i++) {
            if(inputValues[i] == ''){
                warningDialog(i-1, false);
                break;
            }
        }
    }else{
        // Si no hay campos vacios continuar.
        isOkDialog();
        console.warn('No tiene campos vacios');
        inputs.forEach(element => {
            /**
             *  Invisibilziar todos los inputs.
             */
            element.style.display = 'none';
        });
        /**
         *  Activar textarea, continueButton, y quitar continueButton.
         */
        // Add
        descriptionTextArea.style.display = 'block';
        sendDataButton.style.display = 'block';
        // Quit
        continueFormButton.style.display = 'none';
        uploadImageSection.style.display = 'none';
        // Add link to input
        imageUrl.value = formImage.src;
    }
});