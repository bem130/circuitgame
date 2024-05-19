    function dl() {
        let projname = document.getElementById("aprojname").value; // project name
        let darr = mkfile();
        let fnm = projname+".ncg";
        let ftype = "application/octet-stream";
        let blob = new Blob([darr], {type: ftype});
        const file = new File([blob], fnm, {type: ftype}); // make the file
        let aelm = document.createElement("a");aelm.download = fnm;
        aelm.href = window.URL.createObjectURL(file);aelm.click(); // download the file
    }
    function mkfile() {
        let projname = document.getElementById("aprojname").value // project name
        let input = document.getElementById("ainput").value.split(",");
        let output = document.getElementById("aoutput").value.split(",");
        let tde = [];
        tde.push(input.length);tde.push(output.length);
        for (let i=0;i<input.length;i++) {
            tde.push(Number(input[i]));
        }
        for (let i=0;i<output.length;i++) {
            tde.push(Number(output[i]));
        }
        let de = []
        for (let i=0;i<tde.length;i++) {
            de.push(Math.floor((tde[i]-tde[i]%0x100)/0x100));
            de.push(tde[i]%0x100);
        }
        let dd = (new TextEncoder("utf-8")).encode(projname); // encode the project name with utf-8
        let sd = dd.length;
        let darr = new Uint8ClampedArray(blarr.length+sd+de.length+12).fill(0); // fill the data with 0
        let wsf = [Math.floor(size[0]),Math.floor(size[1]),Math.floor(size[2])];
        let wsize = [Math.floor((wsf[0]-wsf[0]%0x100)/0x100),wsf[0]%0x100,Math.floor((wsf[1]-wsf[1]%0x100)/0x100),wsf[1]%0x100,Math.floor((wsf[2]-wsf[2]%0x100)/0x100),wsf[2]%0x100];
        darr[0]=0x6E;darr[1]=0x63;darr[2]=0x67; // write the file name; sA
        darr[3]=sd;darr[4]=Math.floor((de.length-de.length%0x100)/0x100);darr[5]=de.length%0x100; // write the section sizes; sB
        for (let is=0;is<wsize.length;is++) { // write the project size; sC
            darr[is+6] = wsize[is];
        }
        for (let inm=0;inm<dd.length;inm++) { // write the project name; sD
            darr[inm+12] = dd[inm];
        }
        for (let i=0;i<de.length;i++) { // write the I/O setting; sE
            darr[i+12+sd] = de[i];
        }
        for (let i=0;i<blarr.length;i++) { // write main data; sF
            darr[i+12+sd+de.length] = blarr[i]+65;
        }
        return darr;
    }
    function read(darr,infohtml=false) {
        if (darr[0x00]!=0x6E||darr[0x01]!=0x63||darr[0x02]!=0x67) { // check
            console.warn("Is it a ncg file?");
        }
        let sd = darr[0x03];
        let se = darr[0x04]*256+darr[0x05];
        size = [darr[0x07]+darr[0x06]*0x100,darr[0x09]+darr[0x08]*0x100,darr[0x0b]+darr[0x0a]*0x100,];
        let projnamearr = darr.slice(0x0c,0x0c+sd);
        let tconfarr = darr.slice(0x0c+sd,0x0c+sd+se);
        let confarr = [];
        for (let i=0;i<tconfarr.length;i+=2) {
            confarr.push(tconfarr[i]*256+tconfarr[i+1]);
        }
        inputs = confarr.slice(0x02,confarr[0x00]+2);
        outputs = confarr.slice(confarr[0x00]+2);
        let projname = (new TextDecoder("utf-8")).decode(new Uint8Array(projnamearr));
        let tmpblarr = darr.slice(0x0c+sd+se);
        blarr = new Uint8ClampedArray(tmpblarr.length);
        for (let ib=0;ib<tmpblarr.length;ib++) {
            blarr[ib] = tmpblarr[ib]-65;
        }
        if (infohtml) {
            document.getElementById("aprojname").value = projname;
            document.getElementById("ainput").value = inputs.toString();
            document.getElementById("aoutput").value = outputs.toString();
        }
        changesize(...size)
    }

    function localfile() {
        ifelm = document.createElement("input");
        ifelm.type = "file";
        ifelm.onchange = function (input) {
            let reader = new FileReader();
            reader.onload = function () {
                let result = new Uint8Array(reader.result);
                console.log(result);
                read(result);
            }
            reader.readAsArrayBuffer(input.target.files[0]);
        };
        ifelm.click();
    }

    async function onlinefile() {
        let url = prompt("Please enter the URL");
        fetch(url).then((res)=>{
            if (res.ok) {
                res.arrayBuffer().then((buf)=>{
                    let buffer = new Uint8Array(buf);
                    read(buffer);
                    console.log(buffer)
                })
            }
        })
    }


    function cutdata(st,se) {
        let projname = document.getElementById("aprojname").value // project name
        let input = [];
        let output = [];
        let tde = [];
        tde.push(input.length);tde.push(output.length);
        for (let i=0;i<input.length;i++) {
            tde.push(Number(input[i]));
        }
        for (let i=0;i<output.length;i++) {
            tde.push(Number(output[i]));
        }
        let cxs = se[0]-st[0];
        let cys = se[1]-st[1];
        let czs = 0+1;
        let csize = [cxs,cys,czs]
        let iz = vl;
        console.log(csize,st,se)
        let carr = new Uint8ClampedArray(cxs*cys*czs);
        for (let iy=st[1];iy<se[1];iy++) {
            for (let ix=st[0];ix<se[0];ix++) {
                console.log(iy,ix)
                ii = (iy-st[1])*cxs+(ix-st[0]);
                idx = iz*size[0]*size[1]+iy*size[0]+ix;
                carr[ii] = blarr[idx];
            }
        }
        let de = [];
        for (let i=0;i<tde.length;i++) {
            de.push(Math.floor((tde[i]-tde[i]%0x100)/0x100));
            de.push(tde[i]%0x100);
        }
        let dd = (new TextEncoder("utf-8")).encode(projname); // encode the project name with utf-8
        let sd = dd.length;
        let cdarr = new Uint8ClampedArray(carr.length+sd+de.length+12).fill(0); // fill the data with 0
        let wsf = [Math.floor(csize[0]),Math.floor(csize[1]),Math.floor(csize[2])];
        let wsize = [Math.floor((wsf[0]-wsf[0]%0x100)/0x100),wsf[0]%0x100,Math.floor((wsf[1]-wsf[1]%0x100)/0x100),wsf[1]%0x100,Math.floor((wsf[2]-wsf[2]%0x100)/0x100),wsf[2]%0x100];
        cdarr[0]=0x6E;cdarr[1]=0x63;cdarr[2]=0x67; // write the file name; sA
        cdarr[3]=sd;cdarr[4]=Math.floor((de.length-de.length%0x100)/0x100);cdarr[5]=de.length%0x100; // write the section sizes; sB
        for (let is=0;is<wsize.length;is++) { // write the project size; sC
            cdarr[is+6] = wsize[is];
        }
        for (let inm=0;inm<dd.length;inm++) { // write the project name; sD
            cdarr[inm+12] = dd[inm];
        }
        for (let i=0;i<de.length;i++) { // write the I/O setting; sE
            cdarr[i+12+sd] = de[i];
        }
        for (let i=0;i<carr.length;i++) { // write main data; sF
            cdarr[i+12+sd+de.length] = carr[i]+65;
        }
        return cdarr;
    }
    function copyd(cdarr) {
        console.log("copy",cdarr)
        let copydata = dataToBase64(cdarr);
        Copy(copydata)
    }
    function Copy(string){
        var temp = document.createElement('div');
        temp.appendChild(document.createElement('pre')).textContent = string;
        var s = temp.style;s.position = 'fixed';s.left = '-100%';
        document.body.appendChild(temp);
        document.getSelection().selectAllChildren(temp);
        var result = document.execCommand('copy');
        document.body.removeChild(temp);
        return result;
    }