var textures = new Array(24).fill(0).map(x => new Array(6).fill(0).map(y => [0,0]));
console.log(textures)
function getimg(img) {
    let canvas = document.createElement("canvas");
    canvas.height = img.naturalHeight;
    canvas.width = img.naturalWidth;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0);
    return ctx.getImageData(0,0,img.naturalWidth,img.naturalHeight);
}
for (let bcnt=0;bcnt<=23;bcnt++) {
    for (let pcnt=0;pcnt<6;pcnt++) {
        nt(bcnt,pcnt,0),
        nt(bcnt,pcnt,1)
    }
}
function nt(b,p,s) {
    let timg = new Image()
    timg.src = `./texture/${b}-${p+1}-${s}.png`
    timg.onload = function () {
        let data = getimg(timg)
        console.log(data)
        texture = new THREE.DataTexture( data.data, data.width, data.height );
        console.log(texture)
        texture.needsUpdate = true;
        textures[b][p][s] = new THREE.MeshBasicMaterial( { map: texture } );
    }
}