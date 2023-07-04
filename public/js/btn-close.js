function btnClose(){
    let btnClosseAll = Array.from(document.getElementsByClassName("btn-close"));
    btnClosseAll.forEach((btnClose)=>{
        btnClose.addEventListener("click", (e)=>{
            let toClose = e.target.dataset.close;
            $(`.${toClose}`).remove();
        })
        setTimeout(() => {
            $(`.${btnClose.dataset.close}`).remove();
        }, 7000);
    })
}