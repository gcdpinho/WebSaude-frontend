jQuery(function ($) {
    'use strict';

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