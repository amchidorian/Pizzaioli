$('#register_membre').submit(function () {
        $(".error").empty();
        var date = getTimestampAge()
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
            "sexe": $("#sexe_membre").val()
        };
        console.log(datas);
        var isNull = checkData(datas);
        if (isNull.length == 0 && !ageRestrict(date)) {
            register_user(datas);
        } else {
            errors(isNull, date)
        }
        verifUser(datas)
        event.preventDefault();
    }
);

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
    var restrictTimestamp = Math.floor(Date.now() / 1000) - 1281218400;
    if (date < restrictTimestamp) {
        return false;
    } else {
        return true;
    }
}

function checkData(datas) {
    var champNull = [];
    for (var data in datas) {
        if (datas[data] == "") {
            champNull.push(data)
        }
    }
    return champNull;
}

function errors(isNull, date) {
    for (var i = 0; i < isNull.length; i++) {
        if (isNull[i] == "age") {
            $("#an_membre").addClass("is-danger");
            $("#mois_membre").addClass("is-danger");
            $("#jour_membre").addClass("is-danger");
        } else {
            $("#" + isNull[i] + "_membre").addClass("is-danger");
        }
    }
    $(".error-display").show();
    $(".error").append("<li>Un ou plusieurs champs sont vides.</li>");
    if (ageRestrict(date)) {
        $("#an_membre").addClass("is-danger");
        $("#mois_membre").addClass("is-danger");
        $("#jour_membre").addClass("is-danger");
        $(".error").append("<li>Vous devez avoir plus de 18 ans pour pouvoir vous inscrire.</li>");
    }
}

function verifUser(datas) {
    console.log(datas);
    $.ajax({
        type: "POST",
        url: "http://pizza-ioli.bwb/register_user",
        dataType: "json",
        data: datas,
        success: function (data) {
            console.log(data);
        },
        error: function (e) {
            $("#erreur").text(e.responseText)
            console.log("error");
        }
    });
}
