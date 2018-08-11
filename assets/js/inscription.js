$(".tab_membre").click(function () {
    $(".btn_pizzeria").removeClass('is-active')
    $(".btn_membre").addClass('is-active')
    $(".pizzeria").css("display", "none");
    $(".membre").css("display", "inline-block");
});

$(".tab_pizzeria").click(function () {
    $(".btn_membre").removeClass('is-active')
    $(".btn_pizzeria").addClass('is-active')
    $(".membre").css("display", "none");
    $(".pizzeria").css("display", "inline-block");
});

$('#register_membre').submit(function () {
        event.preventDefault();
        $(".error").empty();
        var date = getTimestampAge();
        var datas = {
            "role": "membre",
            "mail": $("#mail_membre").val(),
            "pass": $("#pass_membre").val(),
            "adresse": $("#adresse_membre").val(),
            "code_postal": $("#code_postal_membre").val(),
            "ville": $("#ville_membre").val(),
            "newsletter": $("#news_membre").is(':checked'),
            "nom": $("#nom_membre").val(),
            "prenom": $("#prenom_membre").val(),
            "age": date,
            "geo": $("#geo_membre").is(':checked'),
            "sexe": $('#sexe_membre option:selected').val()
        };
        var is_empty = isEmpty(datas);
        if (is_empty.length > 0) {
            emptyError("membre", isEmpty)
        } else {
            checkDatas(datas);
        }
    }
);

$('#register_pizzeria').submit(function () {
        event.preventDefault();
        $(".error").empty();
        var datas = {
            "role": "pizzeria",
            "mail": $("#mail_pizzeria").val(),
            "pass": $("#pass_pizzeria").val(),
            "adresse": $("#adresse_pizzeria").val(),
            "code_postal": $("#code_postal_pizzeria").val(),
            "ville": $("#ville_pizzeria").val(),
            "newsletter": $("#news_pizzeria").is(':checked'),
            "nom": $("#nom_pizzeria").val(),
            "description": $("#description_pizzeria").val(),
            "num": $("#num_pizzeria").val(),
            "four": $('#four_pizzeria').val()
        };
        var is_empty = isEmpty(datas);
        if (is_empty.length > 0) {
            emptyError("pizzeria", is_empty)
        } else {
            checkDatas(datas);
        }
    }
);

function isEmpty(datas) {
    var champNull = [];
    for (var data in datas) {
        if (datas[data] == "" && data != "geo" && data != "newsletter") {
            champNull.push(data)
        }
    }
    return champNull;
}

function emptyError(role, is_empty) {
    if (role == "membre") {
        for (var i = 0; i < is_empty.length; i++) {
            if (is_empty[i] == "age") {
                $("#an_membre").addClass("is-danger");
                $("#mois_membre").addClass("is-danger");
                $("#jour_membre").addClass("is-danger");
            } else {
                $("#" + is_empty[i] + "_" + role).addClass("is-danger");
            }
        }
    } else {
        for (var i = 0; i < is_empty.length; i++) {
            $("#" + is_empty[i] + "_" + role).addClass("is-danger");
        }
    }
    $(".error-display").show();
    $(".error").append("<li>Un ou plusieurs champs sont vides.</li>");
}

function getTimestampAge() {
    date = new Date($("#mois_membre").val()
        + "/" + $("#jour_membre").val()
        + "/" + $("#an_membre").val());
    date = date.getTime() / 1000;
    if (isNaN(date)) {
        return "";
    } else {
        return date;
    }
}

function ageRestrict(date) {
    var restrictTimestamp = Math.floor(Date.now() / 1000 - 567993600);
    if (date < restrictTimestamp) {
        return true;
    } else {
        return false;
    }
}

function checkDatas(datas) {
    var isRegistrabled = true;
    if (isNaN(datas['code_postal']) || datas['code_postal'].length != 5) {
        $(".error-display").show();
        $("#code_postal_" + datas['role']).addClass("is-danger");
        $(".error").append("<li>Erreur lors de la saisie du Code Postal.</li>");
        isRegistrabled = false;
    }
    if (isNaN(datas['num']) || datas['num'].length != 10) {
        $(".error-display").show();
        $("#num_" + datas['role']).addClass("is-danger");
        $(".error").append("<li>Erreur lors de la saisie du numéro de Téléphone.</li>");
        isRegistrabled = false;
    }
    if (datas['role'] == "membre") {
        if (ageRestrict(datas['age'])) {
            $("#an_membre").addClass("is-danger");
            $("#mois_membre").addClass("is-danger");
            $("#jour_membre").addClass("is-danger");
            $(".error").append("<li>Vous devez avoir plus de 18 ans pour pouvoir vous inscrire.</li>");
            isRegistrabled = false;
        }
    } else {
        if (isNaN(datas['four'])) {
            $("#four_pizzeria").addClass("is-danger");
            $(".error").append("<li>Vous n'avez pas entré un nombre correct de four.</li>");
            isRegistrabled = false;
        }
    }
    if (isRegistrabled) {
        verifUser(datas);
    }
}

function verifUser(datas) {
    console.log(datas);
    $.ajax({
        type: "POST",
        url: "http://pizza-ioli.bwb/check_user",
        dataType: "json",
        data: datas,
        success: function (data) {
            console.log(data);
        },
        error: function (e) {
            $("#erreur").text(e.responseText)
            $(".error-display").show();
        }
    });
}
