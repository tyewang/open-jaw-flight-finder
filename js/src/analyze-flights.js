const buildItiString = (from, to, date) => {
  return [from.join(','), to.join(','), date].join('_')
}

(function(){
  document.getElementById("open-button").onclick = (e) => {
    const [origins, firstDestinations, secondDestinations] = [
      'origin',
      'first-destination',
      'second-destination'
    ].map(elementId => {
      const value = document.getElementById(elementId).value;
      const tokens = value.split(',')
      return tokens.map(token => token.trim())
    });

    const [
      departureDate,
      departureDateFlexibility,
      returnDate,
      returnDateFlexiblity
    ] = [
      'departure-date',
      'departure-flexibility',
      'return-date',
      'return-flexibility'
    ].map(elementName => document.getElementsByName(elementName)[0].value)

    const itiString = buildItiString(origins, firstDestinations, departureDate) + '*' + buildItiString(firstDestinations, secondDestinations, returnDate)
    const url = `https://www.google.com/flights/#search;d=2018-01;r=OW;iti=${itiString};tt=m;eo=e`
    window.open(url, '_blank');
    e.preventDefault();
  }
}());
