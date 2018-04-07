jQuery(function ($) {
    'use strict';

    showTables();

    $('.tabela').change(changeTabela);
});

var add = function (e) {
    $('form#formCadastro').append('<div class="bloco">' +
        '<div class="row v-center">' +
        '<div class="col-md-10">' +
        '<div class="form-group">' +
        '<label>Selecione a tabela que deseja inserir:</label>' +
        '<select class="form-control tabela">' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 buttons ins">' +
        '<button type="button" class="btn btn-success" onclick="add(this);">+</button>' +
        '<button type="button" class="btn btn-danger" onclick="remove(this)">-</button>' +
        '</div>' +
        '</div>' +
        '</div>');
    var aux = $('.row.v-center');
    $(aux[aux.length - 1]).find('.tabela').append(optGlobal);
    $('.tabela').change(changeTabela);
}

var addAttr = function (is) {
    appendAttr($(is).parents('.bloco'));
}

var remove = function (e) {
    if ($('.bloco').length > 1)
        $(e).parents('.bloco').remove();
}

var removeAttr = function (e){
    if ($(e).parents('.bloco').find('.attr').length > 1)
        $(e).parents('.row.v-center').remove();
}

var optGlobal = [];
var showTables = function () {
    $.ajax({
        type: "GET",
        url: backend.url + "utility/showTables",
        success: function (response) {
            optGlobal.push('<option value="" disabled selected>Selecione uma opção</option>');
            for (var element of response)
                if (!(element.Tables_in_u709009684_wsaud.indexOf('doenca') >= 0 && element.Tables_in_u709009684_wsaud != "doenca"))
                    optGlobal.push("<option value='" + element.Tables_in_u709009684_wsaud + "'>" + acentuacao(element.Tables_in_u709009684_wsaud) + "</option>");
            $('.tabela').html(optGlobal);
            $('.page-loader-wrapper').fadeOut();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

var acentuacao = function (table) {
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
        case "nome":
            return "Nome";
        case "tipo":
            return "Tipo";
        case "insercao":
            return "Inserção";
        case "dor":
            return "Dor";
        case "comeco":
            return "Começo";
        case "flgRemovida":
            return "Pode ser removida?";
        case "flgFumo":
            return "Fumo";
        case "flgAlcool":
            return "Àlcool";
        
    }
}

var appendAttr = function (bloco) {
    $(bloco).append('<div class="row v-center rowAttr">' +
        '<div class="col-md-5">' +
        '<div class="form-group">' +
        '<label>Selecione um atributo:</label>' +
        '<select class="form-control attr">' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-5">' +
        '<div class="form-group">' +
        '<label>Valor do atributo:</label>' +
        '<input type="text" class="form-control valueAttr" disabled>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 buttonsAttr">' +
        '<button type="button" class="btn btn-success" onclick="addAttr(this)">+</button>' +
        '<button type="button" class="btn btn-danger" onclick="removeAttr(this)">-</button>' +
        '</div>' +
        '</div>');
    var aux = $(bloco).find('.attr');
    $(aux[aux.length-1]).append(optionsAttr);
    $('.attr').change(function () {
        $(this).parents('.row').find('input').attr('disabled', false);
        if ($(this).find(':selected').attr('name') != "NO")
            $(this).parents('.row').find('.buttonsAttr').css('display', 'block');
    });
    $('.page-loader-wrapper').fadeOut();
}

var optionsAttr = [];
var changeTabela = function () {
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
            optionsAttr = [];
            optionsAttr.push('<option value="" disabled selected>Selecione uma opção</option>');
            for (var i = 1; i < response.length; i++)
                optionsAttr.push("<option value='" + response[i].Field + "' name='" + response[i].Null + "'>" + acentuacao(response[i].Field) + "</option>");
            $(is).parents('.bloco').find('.rowAttr').remove();
            appendAttr($(is).parents('.bloco'));
        },
        error: function (error) {
            console.log(error);
        }
    });
}