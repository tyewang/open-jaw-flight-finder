'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var buildItiString = function buildItiString(from, to, date) {
  return [from.join(','), to.join(','), date].join('_');
};

var addNDaysToDateString = function addNDaysToDateString(dateString, n) {
  var dateAsMoment = moment(dateString, "YYYY-MM-DD");
  dateAsMoment.add(n, 'days');
  return dateAsMoment.format("YYYY-MM-DD");
};

(function () {
  document.querySelectorAll('input[type="date"]').forEach(function (e) {
    flatpickr(e, {
      defaultDate: 'today',
      altInput: true
    });
  });

  document.querySelectorAll('input[type="radio"]').forEach(function (e) {
    e.onchange = function () {
      var departureFlexibility = parseInt(document.querySelector('input[name="departure-flexibility"]:checked').value);
      var returnFlexibility = parseInt(document.querySelector('input[name="return-flexibility"]:checked').value);
      var numTabs = departureFlexibility * returnFlexibility;
      document.getElementById("open-button").textContent = 'Open ' + numTabs + ' tabs in Google Flights';
    };
  });

  var locationInputIds = ['origin', 'first-destination', 'second-destination'];
  var timeout = void 0;
  locationInputIds.forEach(function (elementId) {
    document.getElementById(elementId).onkeyup = function (e) {
      var locationValues = locationInputIds.map(function (elementId) {
        return document.getElementById(elementId).value;
      });

      var allFieldsFilledIn = locationValues.every(function (e) {
        return e;
      });
      if (allFieldsFilledIn) {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
          document.getElementById('dates-div').className = '';
          document.querySelector('label[for="departure-date"]').textContent = 'When are you going to ' + locationValues[1] + '?';
          document.querySelector('label[for="return-date"]').textContent = 'When are you going back to ' + locationValues[2] + '?';
          document.getElementById("open-button").disabled = false;
        }, 500);
      }
    };
  });

  document.getElementById("open-button").onclick = function (e) {
    var _map = ['origin', 'first-destination', 'second-destination'].map(function (elementId) {
      var value = document.getElementById(elementId).value;
      var tokens = value.split(',');
      return tokens.map(function (token) {
        return token.trim();
      });
    }),
        _map2 = _slicedToArray(_map, 3),
        origins = _map2[0],
        firstDestinations = _map2[1],
        secondDestinations = _map2[2];

    var _map3 = ['departure-date', 'return-date'].map(function (elementName) {
      return document.getElementsByName(elementName)[0].value;
    }),
        _map4 = _slicedToArray(_map3, 2),
        departureDate = _map4[0],
        returnDate = _map4[1];

    var _map5 = ['departure-flexibility', 'return-flexibility'].map(function (elementName) {
      return parseInt(document.querySelector('input[name="' + elementName + '"]:checked').value);
    }),
        _map6 = _slicedToArray(_map5, 2),
        departureDateFlexibility = _map6[0],
        returnDateFlexibility = _map6[1];

    for (var i = 0; i < departureDateFlexibility; i++) {
      var departureDateToCheck = addNDaysToDateString(departureDate, Math.floor(departureDateFlexibility / 2) - i);
      for (var j = 0; j < returnDateFlexibility; j++) {
        var returnDateToCheck = addNDaysToDateString(returnDate, Math.floor(returnDateFlexibility / 2) - j);
        var itiString = buildItiString(origins, firstDestinations, departureDateToCheck) + '*' + buildItiString(firstDestinations, secondDestinations, returnDateToCheck);
        var url = 'https://www.google.com/flights/#search;d=2018-01;r=OW;iti=' + itiString + ';tt=m;eo=e';
        window.open(url, '_blank');
      }
    }

    window.focus();
    e.preventDefault();
  };
})();