jQuery(function ($) {
    'use strict';
    showTables();
    $('.tabela').change(function () {
        var tabela = $(this).find(':selected').val();
        if (tabela != "doenca") {
            $(this).parents('.bloco').find('.demais').css('display', 'block');
            $(this).parents('.bloco').find('.doenca').css('display', 'none');
        } else {
            $(this).parents('.bloco').find('.demais').css('display', 'none');
            $(this).parents('.bloco').find('.doenca').css('display', 'block');
        }
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
                    options.push("<option>" + element.Tables_in_u709009684_wsaud + "</option>");
            $('.tabela').html(options);
            $('.page-loader-wrapper').fadeOut();
        },
        error: function (error) {
            console.log(error);
        }
    });
}