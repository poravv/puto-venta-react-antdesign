export const convertirBase64 = (archivo) => {
    var reader = FileReader();
    reader.readDataURL(archivo);
    reader.onload = function () {
        var base64 = reader.result;
        console.log(base64);
    }
}