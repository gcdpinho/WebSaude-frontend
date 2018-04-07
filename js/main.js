jQuery(function ($) {
    'use strict';

    showTables();

    $('.tabela').change(function () {
        $('.page-loader-wrapper').fadeIn();
        var is = $(this);
        var tabela = $(this).find(':selected').val();
        $.ajax({
            type: "POST",
            url: backend.url + "utility/descTable",
            data: {
                table: tabela
            },
            success: function (response) {
                console.log(response);
                console.log($(this))
                $(is).parents('.bloco').append('<div class="row v-center">'+
                        '<div class="col-md-5">'+
                            '<div class="form-group">'+
                                '<label>Selecione um atributo:</label>'+
                                '<select class="form-control attr">'+
                                '</select>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-5">'+
                            '<div class="form-group">'+
                                '<label>Valor do atributo:</label>'+
                                '<input type="text" class="form-control valueAttr">'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-2 buttons">'+
                            '<button type="button" class="btn btn-success" onclick="add(this)">+</button>'+
                            '<button type="button" class="btn btn-danger" onclick="remove(this)">-</button>'+
                        '</div>'+
                    '</div>');
                $('.page-loader-wrapper').fadeOut();
            },
            error: function (error) {
                console.log(error);
            }
        });
    });

});

var add = function (e) {
    if ($('.demais').css('display') != 'none' || $('.doenca').css('display') != 'none') {
        $('form#formCadastro').append($($('.tabela').parents('.bloco')[0]).prop('outerHTML'));
        var demais = $('.demais');
        var doenca = $('.doenca');
        $(demais[demais.length - 1]).css('display', 'none');
        $(doenca[doenca.length - 1]).css('display', 'none');
    }
}

var remove = function (e) {
    $(e).parents('.bloco').remove();
}

var showTables = function () {
    $.ajax({
        type: "GET",
        url: backend.url + "utility/showTables",
        success: function (response) {
            var options = [];
            options.push('<option value="" disabled selected>Selecione uma opção</option>');
            for (var element of response)
                if (!(element.Tables_in_u709009684_wsaud.indexOf('doenca') >= 0 && element.Tables_in_u709009684_wsaud != "doenca"))
                    options.push("<option value='" + element.Tables_in_u709009684_wsaud + "'>" + acentuacaoTable(element.Tables_in_u709009684_wsaud) + "</option>");
            $('.tabela').html(options);
            $('.page-loader-wrapper').fadeOut();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

var acentuacaoTable = function (table) {
    switch (table) {
        case "doenca":
            return "Doença";
        case "evolucao":
            return "Evolução";
        case "localizacao":
            return "Localização";
        case "cor":
            return "Cor";
        case "lesaoFundamental":
            return "Lesão Fundamental";
        case "palpacao":
            return "Palpação";
        case "crescimento":
            return "Crescimento";
        case "superficie":
            return "Superfície";
        case "trauma":
            return "Trauma";
    }
}