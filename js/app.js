$(document).ready(function () {
    produtos.eventos.init();
})

var produtos = {};

var MEU_CARRINHO = [];

produtos.eventos = {

    init: () => {
        produtos.metodos.obterItensProdutos();
    }

}

produtos.metodos = {

    // obtem a lista de itens dos produtos
    obterItensProdutos: (categoria = 'proteinas', vermais = false) => {

        var filtro = MENU[categoria];
        console.log(filtro)

        if (!vermais) {
            $("#itensProdutos").html('');
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) => {

            let temp = produtos.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            // botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensProdutos").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 8) {
                $("#itensProdutos").append(temp)
            }

        })

        //remove o ativo
        $(".container-menu a").removeClass('active');

        //seta o menu para ativo
        $("#menu-" + categoria).addClass('active');

    },

    //clique no botão ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        produtos.metodos.obterItensProdutos(ativo, true)

        $("#btnVerMais").addClass('hidden');

    },

    // diminuir a quantidade do item nos produtos
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item nos produtos
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
    },

    // adicionar ao carrinho o item do produtos
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            // obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obter a lista de itens
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e,i) => {return e.id == id});

            if (item.length > 0) {

                //validar se ja existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem,index) => {return elem.id == id});

                // caso ja exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // caso ainda não exista o item no carrinho, adiciona ele
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                produtos.metodos.mensagem('Item adicionado ao carrinho','green')
                $("#qntd-" + id).text(0);

                produtos.metodos.atualizarBadgeTotal();
                
            }

        }

    },

    // atualiza o bagde de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    //abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if(abrir) {
            $("#modalCarrinho").removeClass('hidden');
            produtos.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    //altera os textos e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');
        }

        if (etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

    },

    //botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        produtos.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        produtos.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');
            
            $.each(MEU_CARRINHO, (i, e) => {

                let temp = produtos.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

            })

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Seu carrinho está vazio</p>');
        }

    },

    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1)
            produtos.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }
        else {
            produtos.metodos.removerItemCarrinho(id);
        }

    },

    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1)
        produtos.metodos.atualizarCarrinho(id, qntdAtual + 1);


    },
 
    // botão de remover item do carrinha
    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        produtos.metodos.carregarCarrinho();
        
        //atualiza o botão carrinho com a quantidade atualizada
        produtos.metodos.atualizarBadgeTotal();

    },

    //atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (id, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botão carrinho com a quantidade atualizada
        produtos.metodos.atualizarBadgeTotal();
    },





    //Mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800)
        }, tempo)

    }

}

produtos.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id"\${id}">
                <div class="img-produto">
                    <img src="\${img}" />
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">  
                    <span class="btn-menos" onclick="produtos.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="produtos.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="produtos.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}"/>
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b></p>
                <p class="price-produto"><b>R$ \${preco}</b></p>
            </div>
            <div class="add-carrinho">  
                <span class="btn-menos" onclick="produtos.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="produtos.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="produtos.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `

}