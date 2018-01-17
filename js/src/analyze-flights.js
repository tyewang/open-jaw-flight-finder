const buildItiString = (from, to, date) => {
  return [from.join(','), to.join(','), date].join('_')
}

const addNDaysToDateString = (dateString, n) => {
  const dateAsMoment = moment(dateString, "YYYY-MM-DD");
  dateAsMoment.add(n, 'days');
  return dateAsMoment.format("YYYY-MM-DD");
}

(function(){
  document.querySelectorAll('input[type="date"]').forEach((e) => {
    flatpickr(e, {
      defaultDate: 'today',
      altInput: true
    });
  });

  document.querySelectorAll('input[type="radio"]').forEach((e) => {
    e.onchange = () => {
      const departureFlexibility = parseInt(document.querySelector(`input[name="departure-flexibility"]:checked`).value)
      const returnFlexibility = parseInt(document.querySelector(`input[name="return-flexibility"]:checked`).value)
      const numTabs = departureFlexibility * returnFlexibility;
      document.getElementById("open-button").textContent = `Open ${numTabs} tabs in Google Flights`;
    }
  });

  const locationInputIds = ['origin', 'first-destination', 'second-destination'];
  let timeout;
  locationInputIds.forEach((elementId) => {
    document.getElementById(elementId).onkeyup = (e) => {
      const locationValues = locationInputIds.map((elementId) => {
        return document.getElementById(elementId).value;
      });

      const allFieldsFilledIn = locationValues.every((e) => e);
      if(allFieldsFilledIn){
        if(timeout){
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
          document.getElementById('dates-div').className = '';
          document.querySelector('label[for="departure-date"]').textContent = `When are you going to ${locationValues[1]}?`;
          document.querySelector('label[for="return-date"]').textContent = `When are you going back to ${locationValues[2]}?`;
          document.getElementById("open-button").disabled = false;
        }, 500);
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
