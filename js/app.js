$(document).ready(function () {
    produtos.eventos.init();
})

var produtos = {};

produtos.eventos = {

    init: () => {
        console.log('iniciou')
    }

}

produtos.metodos = {

    // obtem a lista de itens dos produtos
    obterItensProdutos: () => {

        var filtro = MENU('burgues');
        console.log(filtro)
    }

}

produtos.tampletes = {

}