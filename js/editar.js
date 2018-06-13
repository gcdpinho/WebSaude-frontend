$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/doenca/getFullDoenca",
        success: function (data) {
            // console.log(data);
            var tdata = agroupDoenca(data);
            console.log(tdata);
            $('#table-doencas').DataTable({
                data: tdata,
                responsive: true,
                bLengthChange: false,
                bDestroy: true,
                pageLength: 10,
                language: {
                    zeroRecords: "Nenhum registro encontrado",
                    info: "Exibindo _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "Exibindo 0 a 0 de 0 registros",
                    infoFiltered: "",
                    search: "",
                    searchPlaceholder: "Pesquisar",
                    paginate: {
                        "next": "Próximo",
                        "previous": "Anterior"
                    },
                },
                columns: [
                    { "data": "doenca.id" },
                    { "data": "doenca.nome" },
                    { "data": "doenca.tipo" }
                ]
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
});

