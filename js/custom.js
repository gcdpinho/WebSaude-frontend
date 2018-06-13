var agroupDoenca = (data) => {
    var trauma = [];
    var superficie = [];
    var removida = [];
    var palpacao = [];
    var localizacao = [];
    var lesaoFundamental = [];
    var insercao = [];
    var evolucao = [];
    var dor = [];
    var fumo = [];
    var crescimento = [];
    var cor = [];
    var conduta = [];
    var comeco = [];
    var alcool = [];
    var result = [];
    var idDoenca = data.map((e) => {
        return e.idDoenca;
    });
    idDoenca = idDoenca.filter((x, i, a) => a.indexOf(x) == i);
    for (var i = 0; i < idDoenca.length; i++) {
        trauma[idDoenca[i]] = [];
        superficie[idDoenca[i]] = [];
        removida[idDoenca[i]] = [];
        palpacao[idDoenca[i]] = [];
        localizacao[idDoenca[i]] = [];
        lesaoFundamental[idDoenca[i]] = [];
        evolucao[idDoenca[i]] = [];
        dor[idDoenca[i]] = [];
        fumo[idDoenca[i]] = [];
        crescimento[idDoenca[i]] = [];
        cor[idDoenca[i]] = [];
        conduta[idDoenca[i]] = [];
        comeco[idDoenca[i]] = [];
        alcool[idDoenca[i]] = [];
        insercao[idDoenca[i]] = [];
    }
    for (doenca of data)
        for (id of idDoenca)
            if (doenca.idDoenca == id) {
                if (!trauma[id].some(tra => (tra.nome == doenca.trauma)) && doenca.trauma != null)
                    trauma[id].push({
                        id: doenca.idTrauma,
                        nome: doenca.trauma
                    });
                if (!superficie[id].some(su => (su.nome == doenca.superficie)) && doenca.superficie != null)
                    superficie[id].push({
                        id: doenca.idSuperficie,
                        nome: doenca.superficie
                    });
                if (!removida[id].some(re => (re.nome == doenca.removida)) && doenca.removida != null)
                    removida[id].push({
                        id: doenca.idRemovida,
                        nome: doenca.removida
                    });
                if (!palpacao[id].some(pal => (pal.nome == doenca.palpacao)) && doenca.palpacao != null)
                    palpacao[id].push({
                        id: doenca.idPalpacao,
                        nome: doenca.palpacao
                    });
                if (!localizacao[id].some(lo => (lo.nome == doenca.localizacao)) && doenca.localizacao != null)
                    localizacao[id].push({
                        id: doenca.idLocalizacao,
                        nome: doenca.localizacao
                    });
                if (!lesaoFundamental[id].some(lf => (lf.nome == doenca.lesaoFundamental)) && doenca.lesaoFundamental != null)
                    lesaoFundamental[id].push({
                        id: doenca.idLesaoFundamental,
                        nome: doenca.lesaoFundamental
                    });
                if (!evolucao[id].some(e => (e.nome == doenca.evolucao)) && doenca.evolucao != null)
                    evolucao[id].push({
                        id: doenca.idEvolucao,
                        nome: doenca.evolucao
                    });
                if (!dor[id].some(d => (d.nome == doenca.dor)) && doenca.dor != null)
                    dor[id].push({
                        id: doenca.idDor,
                        nome: doenca.dor
                    });
                if (!fumo[id].some(f => (f.nome == doenca.fumo)) && doenca.fumo != null)
                    fumo[id].push({
                        id: doenca.idFumo,
                        nome: doenca.fumo
                    });
                if (!crescimento[id].some(cre => (cre.nome == doenca.crescimento)) && doenca.crescimento != null)
                    crescimento[id].push({
                        id: doenca.idCrescimento,
                        nome: doenca.crescimento
                    });
                if (!cor[id].some(co => (co.nome == doenca.cor)) && doenca.cor != null)
                    cor[id].push({
                        id: doenca.idCor,
                        nome: doenca.cor
                    });
                if (!conduta[id].some(con => (con.nome == doenca.conduta)) && doenca.conduta != null)
                    conduta[id].push({
                        id: doenca.idConduta,
                        nome: doenca.conduta
                    });
                if (!comeco[id].some(com => (com.nome == doenca.comeco)) && doenca.comeco != null)
                    comeco[id].push({
                        id: doenca.idComeco,
                        nome: doenca.comeco
                    });
                if (!alcool[id].some(a => (a.nome == doenca.alcool)) && doenca.alcool != null)
                    alcool[id].push({
                        id: doenca.idAlcool,
                        nome: doenca.alcool
                    });
                if (!insercao[id].some(i => (i.nome == doenca.insercao)) && doenca.insercao != null)
                    insercao[id].push({
                        id: doenca.idInsercao,
                        nome: doenca.insercao
                    });

                break;
            }
    for (id of idDoenca) {
        var aux = getDoencaById(data, id);
        aux['traume'] = trauma[id];
        aux['superficie'] = superficie[id];
        aux['removida'] = removida[id];
        aux['palpacao'] = palpacao[id];
        aux['localizacao'] = localizacao[id];
        aux['lesaoFundamental'] = lesaoFundamental[id];
        aux['insercao'] = insercao[id];
        aux['evolucao'] = evolucao[id];
        aux['dor'] = dor[id];
        aux['fumo'] = fumo[id];
        aux['crescimento'] = crescimento[id];
        aux['cor'] = cor[id];
        aux['conduta'] = conduta[id];
        aux['comeco'] = comeco[id];

        result.push(aux);
    }

    return result;
}

var getDoencaById = (data, id) => {
    for (doenca of data)
        if (doenca.idDoenca == id)
            return {
                doenca: {
                    id: doenca.idDoenca,
                    nome: doenca.nomeDoenca,
                    tipo: doenca.tipoDoenca

                }
            };
}