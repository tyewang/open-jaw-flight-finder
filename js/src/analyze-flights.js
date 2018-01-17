const buildItiString = (from, to, date) => {
  return [from.join(','), to.join(','), date].join('_')
}

const addNDaysToDateString = (dateString, n) => {
  const dateAsMoment = moment(dateString, "YYYY-MM-DD");
  dateAsMoment.add(n, 'days');
  return dateAsMoment.format("YYYY-MM-DD");
}

(function(){
  const locationInputIds = ['origin', 'first-destination', 'second-destination'];
  locationInputIds.forEach((elementId) => {
    document.getElementById(elementId).onkeypress = (e) => {
      const allFieldsFilledIn = locationInputIds.every((elementId) => {
        return !!document.getElementById(elementId).value;
      });

      if(allFieldsFilledIn){
        document.getElementById('dates-div').className = '';
      }
    }
  });

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
      returnDate,
    ] = [
      'departure-date',
      'return-date',
    ].map(elementName => document.getElementsByName(elementName)[0].value)

    const [
      departureDateFlexibility,
      returnDateFlexibility
    ] = [
      'departure-flexibility',
      'return-flexibility'
    ].map(elementName => parseInt(document.querySelector(`input[name="${elementName}"]:checked`).value))

    for(let i=0; i < departureDateFlexibility; i++){
      const departureDateToCheck = addNDaysToDateString(departureDate, Math.floor(departureDateFlexibility/2) - i)
      for(let j=0; j < returnDateFlexibility; j++){
        const returnDateToCheck = addNDaysToDateString(returnDate, Math.floor(returnDateFlexibility/2) - j)
        const itiString = buildItiString(origins, firstDestinations, departureDateToCheck) + '*' + buildItiString(firstDestinations, secondDestinations, returnDateToCheck)
        const url = `https://www.google.com/flights/#search;d=2018-01;r=OW;iti=${itiString};tt=m;eo=e`
        window.open(url, '_blank');
      }
    }

    window.focus();
    e.preventDefault();
  }
}());
