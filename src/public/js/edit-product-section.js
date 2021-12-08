const fileInput = document.querySelector('#file-input');
const formImage = document.querySelector('#formImage');
const urlImage = document.querySelector('#url');



/**
 *  Cloudinary data
 */
const cloudPreset = 'phwzqylx';
const cloudUrl = 'https://api.cloudinary.com/v1_1/dlds4xwpk/upload';


/**
 *  Tomar archivo adjuntado al formulario y subirlo a cloudinary.
 */
fileInput.addEventListener('change', async(e) => {
    const file = e.target.files[0];
    formImage.src = '/img/general/inprogress-loading.gif';
    await uploadImage(file).then(async({secure_url, public_id}) => {
        formImage.id = public_id;
        formImage.src = secure_url;
        urlImage.value = secure_url;
    }).catch((e) => {
        console.warn(e);
    });
});

/**
 *  Borrar imagen del documento, acorde condiciones y evaluaciones.
 */
const deleteImageFromDom = () => {
    if(formImage.id.trim() != 'formImage'){ // formImage es el id por defecto al abrir el documento.
        deleteImage(formImage.id.trim()).then(r => {
            console.warn(`Image with id: ${formImage.id.trim()} was deleted sucessfully!`);
            formImage.id = 'formImage';
            fileInput.value = '';
        });
    }
};

/**
 * @fileInput = Boton para elegir un archivo.
 */
uploadFileButton.addEventListener('click', (e) => {
    deleteImageFromDom();
    fileInput.click();
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