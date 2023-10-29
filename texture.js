var TextureImage;
var TextureImg;
var TextureCanvas;
const TextureSize = 16;
function prepareTexture(callback) {
    TextureImg = new Image();
    TextureImg.src = "./texture.png";
    console.log("hey")
    TextureImg.onload = ()=>{
        console.log("done")
        TextureCanvas.height = TextureImg.naturalHeight;TextureCanvas.width = TextureImg.naturalWidth;
        TextureImage.drawImage(TextureImg,0,0);
        callback();
    }
    TextureCanvas = document.createElement("canvas");
    TextureImage = TextureCanvas.getContext("2d");
}

function getTexture(block,state) {
    //console.log(TextureSize*state,TextureSize*block,TextureSize)
    return TextureImage.getImageData(TextureSize*block,TextureSize*state,TextureSize,TextureSize).data;
}