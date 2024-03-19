$(document).ready(function () {
    produtos.eventos.init();
})

var produtos = {};

produtos.eventos = {

    init: () => {
        produtos.metodos.obterItensProdutos();
    }

}

produtos.metodos = {

    // obtem a lista de itens dos produtos
    obterItensProdutos: () => {

        var filtro = MENU['burgers'];
        console.log(filtro)

        $.each(filtro, (i, e) => {

            let temp = produtos.tamplates.item;
            $("#itensProdutos").append(temp)

        })
    },

}

produtos.tamplates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item">
                <div class="img-produto">
                    <img src="img/produtos/proteina/w100_morango.jpg">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>W100 Nutrata 900g Morango</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ 119,99</b>
                </p>
                <div class="add-carrinho">  
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `

}