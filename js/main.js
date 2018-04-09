jQuery(function ($) {
    'use strict';

    showTables();

    $('.tabela').change(changeTabela);

    $('#formCadastro').submit(function (e) {
        if (validation()) {

        }
        else{
            console.log(localStorage.getItem('msgErro'))
        }
        e.preventDefault();
    });
});

var validation = function () {
    var valid = true;

    /* Selects de tabelas que não possuem uma opção selecionada*/
    $('select.tabela').each(function (e, element) {
        if ($(element).find(':selected').val() == "") {
            valid = false;
            $(element).addClass('error');
        } else {
            var atributos;
            if ($(element).find(':selected').val() == "doenca")
                atributos = $(element).parents('.bloco').find('.rowAttr .attrDoenca');
            else
                atributos = $(element).parents('.bloco').find('.rowAttr .attr');
            var flgNome = false;
            for (var i = 0; i < atributos.length; i++) {
                if ($(atributos[i]).find(':selected').val() == "nome") {
                    flgNome = true;
                    break;
                }
            }
            if (!flgNome) {
                localStorage.setItem('msgErro', "A tabela " + acentuacao($(element).find(':selected').val()) + " deve conter o campo nome");
                valid = false;
            }
        }
    });

    /* Selects de atributos que não possuem uma opção selecionada*/
    $('select.attr').each(function (e, element) {
        if ($(element).find(':selected').val() == "") {
            valid = false;
            $(element).addClass('error');
        }
    });

    /* Inputs vazios que não permitem valores nulos*/
    $('input.valueAttr').each(function (e, element) {
        if ($(element).val() == "" && ($(element).parents('.rowAttr').find('select.attr').find(':selected').attr('name') == "NO" || $(element).parents('.rowAttr').find('select.attrDoenca').find(':selected').attr('name') == "NO")) {
            valid = false;
            $(element).addClass('error');
        }
    });


    return valid;
}


var generateQueries = function () {
    var data = [];
    var row;
    var atributos;
    var tabelas = $('select.tabela').find(':selected');
    for (var i = 0; i < tabelas.length; i++) {
        row = {};
        row['tabela'] = $(tabelas[i]).val();
        atributos = $(tabelas[i]).parents('.bloco').find('.rowAttr');
        row['atributos'] = {};
        for (var j = 0; j < atributos.length; j++)
            row['atributos'][$(atributos[j]).find('select.attr option:selected').val()] = $(atributos[j]).find('input.valueAttr').val();
        data.push(row);
    }
    console.log(data);
    return data;
}

var add = function (e) {
    $('div.formContent').append('<div class="bloco">' +
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

var addDoenca = function (is) {
    appendDoenca($(is).parents('.bloco'));
}

var remove = function (e) {
    if ($('.bloco').length > 1)
        $(e).parents('.bloco').remove();
}

var removeAttr = function (e) {
    if ($(e).parents('.bloco').find('.rowAttr').length > 1)
        $(e).parents('.rowAttr').remove();
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
        case "flgDor":
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
        '<select class="form-control aux" disabled>' +
        '<option value="" disabled selected>Selecione uma opção</option>' +
        '</select>' +
        '<select class="form-control valueAttr selectpicker" title="Selecione uma opção" disabled multiple>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 buttonsAttr">' +
        '<button type="button" class="btn btn-success" onclick="addAttr(this)">+</button>' +
        '<button type="button" class="btn btn-danger" onclick="removeAttr(this)">-</button>' +
        '</div>' +
        '</div>');
    var aux = $(bloco).find('.attr');
    $(aux[aux.length - 1]).append(optionsAttr);
    $('select.attr').change(function () {
        $('.page-loader-wrapper').fadeIn();
        var is = $(this);
        $(this).removeClass('error');
        $.ajax({
            type: "POST",
            url: backend.url + "utility/selectByAtributoByTable",
            data: {
                atributo: $(this).find(':selected').val(),
                table: $(this).parents('.bloco').find('.tabela option:selected').val()
            },
            success: function (response) {
                console.log(response);
                $(is).parents('.row').find('select.valueAttr').append(response.map((e) => {
                    return "<option val='" + e.id + "'>" + e.nome + "</option>"
                }));
                $(is).parents('.row').find('select.aux').remove();
                $(is).parents('.row').find('.valueAttr').attr('disabled', false);
                $(is).parents('.row').find('.selectpicker').selectpicker();
                $('.page-loader-wrapper').fadeOut();
            },
            error: function (error) {
                console.log(error);
                $('.page-loader-wrapper').fadeOut();
            }
        });
    });
    $('input.valueAttr').on('input', function (e) {
        $(this).removeClass('error');
    });
    $('.page-loader-wrapper').fadeOut();
}

var appendDoenca = function (bloco) {
    $(bloco).append('<div class="row v-center rowAttr">' +
        '<div class="col-md-5">' +
        '<div class="form-group">' +
        '<label>Selecione um atributo:</label>' +
        '<select class="form-control attrDoenca">' +
        '</select>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-5">' +
        '<div class="form-group value">' +
        '<label>Valor do atributo:</label>' +
        '<input type="text" class="form-control valueAttr" disabled>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-2 buttonsAttr">' +
        '<button type="button" class="btn btn-success" onclick="addDoenca(this)">+</button>' +
        '<button type="button" class="btn btn-danger" onclick="removeAttr(this)">-</button>' +
        '</div>' +
        '</div>');
    var aux = $(bloco).find('.attrDoenca');
    $(aux[aux.length - 1]).append(optionsAttr);
    $('select.attrDoenca').change(function () {
        var value = $(this).find(":selected").val();
        if (value != "nome" && value != "tipo") {
            console.log('oi');
            $(this).parents('.row').find('.valueAttr').remove();
            if (value == "flgDor") {
                $(this).parents('.row').find('div.value').append('<select class="form-control valueAttr selectpicker" title="Selecione uma opção" multiple>' +
                    '</select>');
                $(this).parents('.row').find('select.valueAttr').append('<option value="true">Sim</option>' +
                    '<option value="false">Não</option>'
                );
            } else if (value == "flgRemovida") {
                $(this).parents('.row').find('div.value').append('<select class="form-control valueAttr selectpicker" title="Selecione uma opção" multiple>' +
                    '</select>');
                $(this).parents('.row').find('select.valueAttr').append('<option value="true">Sim</option>' +
                    '<option value="false">Não</option>'
                );
            } else if (value == "flgFumo") {
                $(this).parents('.row').find('div.value').append('<select class="form-control valueAttr selectpicker" title="Selecione uma opção" multiple>' +
                    '</select>');
                $(this).parents('.row').find('select.valueAttr').append('<option value="true">Sim</option>' +
                    '<option value="false">Não</option>'
                );
            } else if (value == "flgAlcool") {
                $(this).parents('.row').find('div.value').append('<select class="form-control valueAttr selectpicker" title="Selecione uma opção" multiple>' +
                    '</select>');
                $(this).parents('.row').find('select.valueAttr').append('<option value="true">Sim</option>' +
                    '<option value="false">Não</option>'
                );
            }
            $(this).parents('.row').find('select.valueAttr').selectpicker();
        } else {
            $(this).parents('.row').find('.valueAttr').remove();
            $(this).parents('.row').find('div.value').append('<input type="text" class="form-control valueAttr" disabled>');
            $(this).parents('.row').find('input').attr('disabled', false);
            $('input.valueAttr').on('input', function (e) {
                $(this).removeClass('error');
            });
        }
    });

    $('.page-loader-wrapper').fadeOut();
}

var optionsAttr = [];
var changeTabela = function () {
    $('.page-loader-wrapper').fadeIn();
    var is = $(this);
    $(is).removeClass('error');
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
            if (tabela != "doenca")
                appendAttr($(is).parents('.bloco'));
            else
                appendDoenca($(is).parents('.bloco'));
        },
        error: function (error) {
            console.log(error);
        }
    });
}