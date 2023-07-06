Vue.component('qrcode',{
    template:`
    <div class="container d-flex justify-content-center flex-column align-items-center p-4 bg-primary">
        <h1 class="mx-2">Aguarde o QrCode</h1>
        <img src="/uploads/qrcode.png" width="250">
    </div>
    `
})

const qrcode = new Vue({
    el:"#qrcode-component",
    data:{
        showQr:false,
    }
})

socket.on('img', ()=>{
    qrcode.showQr = true;
})

socket.on("conectado", ()=>{
    qrcode.showQr = false;
})
