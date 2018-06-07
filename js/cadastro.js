jQuery(function ($) {
    'use strict';

    showTables();

    $('.tabela').change(changeTabela);

    $('#formCadastro').submit(function (e) {
        if (validation())
            $('#cadastroModal').modal('show');
        else {
            var msgErro = localStorage.getItem('msgErro');
            if (msgErro != "")
                $('#errorModal').find('.modal-body').html("Você pode possuir campos não preenchidos, grifados de vermelho. Além disso, existem alguns erros que estão impedindo o cadastro da doença:<br>" + msgErro);
            else
                $('#errorModal').find('.modal-body').html("Você possui campos não preenchidos, grifados de vermelho!");
            $('#errorModal').modal('show');
        }
        e.preventDefault();
    });
});

var validation = function () {
    var valid = true;
    localStorage.setItem("msgErro", "");
    /* Selects de tabelas que não possuem uma opção selecionada*/
    var tabsRep = [];
    var flgDoenca = false;
    $('select.tabela').each(function (e, element) {
        if ($(element).find(':selected').val() == "") {
            valid = false;
            $(element).addClass('error');
        } else {
            /* Tabelas sem atributo nome + atributos repetidos*/
            var atributos;
            var rep = [];
            if ($(element).find(':selected').val() == "doenca") {
                flgDoenca = true;
                atributos = $(element).parents('.bloco').find('.rowAttr .attrDoenca');
                $(this).parents('.bloco').find('select.attrDoenca').each(function (e, element) {
                    rep.push($(element).find(':selected').val());
                });
            } else {
                atributos = $(element).parents('.bloco').find('.rowAttr .attr');
                $(this).parents('.bloco').find('select.attr').each(function (e, element) {
                    rep.push($(element).find(':selected').val());
                });
            }
            var flgNome = false;
            for (var i = 0; i < atributos.length; i++) {
                if ($(atributos[i]).find(':selected').val() == "nome") {
                    flgNome = true;
                    break;
                }
            }
            if (!flgNome) {
                localStorage.setItem('msgErro', localStorage.getItem('msgErro') + "<br>- A tabela " + acentuacao($(element).find(':selected').val()) + " deve conter o campo nome");
                valid = false;
            }
            if (hasDuplicates(rep)) {
                localStorage.setItem("msgErro", localStorage.getItem('msgErro') + "<br>- Há atributos iguais para a tabela " + acentuacao($(element).find(':selected').val()))
                valid = false;
            }

            tabsRep.push($(element).find(':selected').val());
        }
    });

    if (hasDuplicates(tabsRep)) {
        localStorage.setItem("msgErro", localStorage.getItem('msgErro') + "<br>- Há tabelas iguais");
        valid = false;
    }

    if (!flgDoenca) {
        localStorage.setItem("msgErro", localStorage.getItem('msgErro') + "<br>- Não há tabela doença no cadastro");
        valid = false;
    }

    /* Selects de atributos que não possuem uma opção selecionada*/
    $('select.attr').each(function (e, element) {
        if ($(element).find(':selected').val() == "") {
            valid = false;
            $(element).addClass('error');
        }
    });

    /* Selects de atributos que não possuem uma opção selecionada*/
    $('select.attrDoenca').each(function (e, element) {
        if ($(element).find(':selected').val() == "") {
            valid = false;
            $(element).addClass('error');
        }
    });

    /* Selects de valores vazios */
    $('select.valueAttr').each(function (e, element) {
        if ($(element).val() == null) {
            $(element).parents('div.valueAttr').find('button').addClass('error');
            valid = false;
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

var hasDuplicates = function (array) {
    return (new Set(array)).size !== array.length;
}


// var generateQueries = function () {
//     var data = [];
//     var row;
//     var atributos;
//     var tabelas = $('select.tabela').find(':selected');
//     for (var i = 0; i < tabelas.length; i++) {
//         row = {};
//         row['tabela'] = $(tabelas[i]).val();
//         atributos = $(tabelas[i]).parents('.bloco').find('.rowAttr');
//         row['atributos'] = {};
//         for (var j = 0; j < atributos.length; j++)
//             row['atributos'][$(atributos[j]).find('select.attr option:selected').val()] = $(atributos[j]).find('input.valueAttr').val();
//         data.push(row);
//     }
//     console.log(data);
//     return data;
// }

var cadatroDoenca = function () {
    $('.page-loader-wrapper').fadeIn();
    var tabelas = $('.tabela');
    for (var i = 0; i < tabelas.length; i++) {
        if ($(tabelas[i]).find(":selected").val() == "doenca") {
            var atributos = [];
            $(tabelas[i]).parents('.bloco').find('select.attrDoenca').each(function (e, element) {
                atributos.push($(element).find(':selected').val());
            });
            var values = [];
            $(tabelas[i]).parents('.bloco').find('.valueAttr').each(function (e, element) {
                if ($(element).val() != "") {
                    if (typeof $(element).val() == "object")
                        values.push({
                            type: 'boolean',
                            value: $(element).val()[0]
                        });
                    else
                        values.push({
                            type: 'string',
                            value: $(element).val()
                        });
                }
            });

            $.ajax({
                type: "POST",
                url: backend.url + "utility/insertByQuery",
                data: {
                    query: buildQueryDoenca(atributos, values)
                },
                success: function (response) {
                    console.log(response);
                    if (response.insertId)
                        cadastroRelacionamento(response.insertId);
                    else {
                        $('#errorModal').find('.modal-body').html("Essa doença já foi cadastrada!");
                        $('.page-loader-wrapper').fadeOut();
                        $('#errorModal').modal('show');
                    }
                },
                error: function (error) {
                    console.log(error);
                    $('#errorModal').find('.modal-body').html("Error ao inserir doença. Contate o desenvolvedor!");
                    $('.page-loader-wrapper').fadeOut();
                    $('#errorModal').modal('show');
                }
            });

            break;
        }
    }
}

var cleanAll = function () {
    $('.bloco').remove();
    add();
}

var cadastroRelacionamento = function (idDoenca) {
    var insercao = [];
    var tabelas = $('.tabela');
    for (var i = 0; i < tabelas.length; i++) {
        if ($(tabelas[i]).find(":selected").val() != "doenca") {
            $(tabelas[i]).parents('.bloco').find('.valueAttr').each(function (e, element) {
                if ($(element).val() != "") {
                    if (typeof $(element).val() == "object") {
                        insercao.push({
                            tabela: $(tabelas[i]).find(":selected").val(),
                            idDoenca: idDoenca,
                            id: $(element).val()
                        });
                    }
                }
            });
        }
    }
    
    let queryRel = buildQueryRelacionamento(insercao);
    $.each(queryRel, (key, value) => {
        $.ajax({
            type: "POST",
            url: backend.url + "utility/insertByQuery",
            data: {
                query: value
            },
            success: function (response) {
                console.log(response);
                if (key >= queryRel.length-1) {
                    cleanAll();
                    showNotification("Doença cadastrada com sucesso!", "success");
                    $('.page-loader-wrapper').fadeOut();
                }
            },
            error: function (error) {
                console.log(error);
                $('#errorModal').find('.modal-body').html("Error ao inserir doença - relacionamentos. Contate o desenvolvedor!");
                $('.page-loader-wrapper').fadeOut();
                $('#errorModal').modal('show');
            }
        });
    });


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
            $('#errorModal').find('.modal-body').html("Error ao carregar as tabelas. Contate o desenvolvedor!");
            $('.page-loader-wrapper').fadeOut();
            $('#errorModal').modal('show');
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
        case "removida":
            return "Pode ser removida?";
        case "fumo":
            return "Fumo";
        case "alcool":
            return "Àlcool";
        case "conduta":
            return "Conduta";

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
                    return "<option value='" + e.id + "'>" + e.nome + "</option>"
                }));
                $(is).parents('.row').find('select.aux').remove();
                $(is).parents('.row').find('.valueAttr').attr('disabled', false);
                $(is).parents('.row').find('.selectpicker').selectpicker();
                $('.selectpicker').on('change', function () {
                    $(this).parents('div.valueAttr').find('button').removeClass('error');
                });
                $('.page-loader-wrapper').fadeOut();
            },
            error: function (error) {
                console.log(error);
                $('#errorModal').find('.modal-body').html("Error ao carregar os valores dos atributos. Contate o desenvolvedor!");
                $('.page-loader-wrapper').fadeOut();
                $('#errorModal').modal('show');
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
        $(this).removeClass('error');
        if (value != "nome" && value != "tipo") {
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
            $('.selectpicker').on('change', function () {
                $(this).parents('div.valueAttr').find('button').removeClass('error');
            });
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
            $('#errorModal').find('.modal-body').html("Error ao carregar os atributos. Contate o desenvolvedor!");
            $('.page-loader-wrapper').fadeOut();
            $('#errorModal').modal('show');
        }
    });
}

var showNotification = function (text, state) {
    var color = "bg-green";
    if (state == "error")
        color = "bg-red";

    $.notify({
        message: text
    }, {
            type: color,
            allow_dismiss: true,
            newest_on_top: true,
            timer: 1000,
            placement: {
                from: "top",
                align: "center"
            },
            animate: {
                enter: "animated fadeInDown",
                exit: "animated fadeOutUp"
            },
            template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (true ? "p-r-35" : "") + '" role="alert">' +
                '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
                '<span data-notify="icon"></span> ' +
                '<span data-notify="title">{1}</span> ' +
                '<span data-notify="message">{2}</span>' +
                '<div class="progress" data-notify="progressbar">' +
                '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '</div>' +
                '<a href="{3}" target="{4}" data-notify="url"></a>' +
                '</div>'
        });
}

function buildQueryDoenca(atributos, values) {
    var q = "INSERT INTO doenca (";
    for (var element of atributos)
        q += element + ",";
    q = q.substring(0, q.length - 1);
    q += ") VALUES (";
    for (element of values)
        if (element.type == "string")
            q += "\'" + element.value + "\',";
        else
            q += element.value + ",";
    q = q.substring(0, q.length - 1);
    q += ")";

    return q;
}

function buildQueryRelacionamento(data) {
    var queries = [];
    for (var element of data) {
        var tabela = element.tabela[0].toUpperCase() + element.tabela.substring(1, element.tabela.length);
        for (var elemento of element.id) {
            queries.push("INSERT INTO doenca" + tabela + "(idDoenca, id" + tabela + ") VALUES (" + element.idDoenca + "," + elemento + ")");
        }
    }

    return queries;
}