/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./assets/js/inscription.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/js/inscription.js":
/*!**********************************!*\
  !*** ./assets/js/inscription.js ***!
  \**********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

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
    console.log(datas);
    var isNull = checkData(datas);
    console.log(isNull);
    if (isNull.length == 0 && !ageRestrict(date)) {
        verifUser(datas);
    } else {
        errors(isNull, date);
    }
});

function getTimestampAge() {
    date = new Date($("#mois_membre").val() + "/" + $("#jour_membre").val() + "/" + $("#an_membre").val());
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
        return false;
    } else {
        return true;
    }
}

function checkData(datas) {
    var champNull = [];
    for (var data in datas) {
        if (datas[data] == "" && data != "geo" && data != "newsletter") {
            champNull.push(data);
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
        url: "http://pizza-ioli.bwb/checky_user",
        dataType: "json",
        data: datas,
        success: function success(data) {
            console.log(data);
        },
        error: function error(e) {
            $("#erreur").text(e.responseText);
            console.log("error");
        }
    });
}

/***/ })

/******/ });