'use strict';

/* globals bootlint */

(function () {
    var scriptElement = document.createElement("script");
    scriptElement.onload = function () {
        bootlint.showLintReportForCurrentDocument([], {
            hasProblems: false,
            problemFree: false
        });
        console.info('bootlint: finished');
    };
    scriptElement.src = "https://maxcdn.bootstrapcdn.com/bootlint/latest/bootlint.min.js";
    document.body.appendChild(scriptElement);
}());