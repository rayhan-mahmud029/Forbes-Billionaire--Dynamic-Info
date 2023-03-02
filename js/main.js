const getData = async (limit) => {
  try {
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400?limit=${limit}`);
    const data = await resp.json();
    showData(limit, data);
  }
  catch (error) {
    console.log(error);
  }
}

const showData = (limit, data) => {
  const tableBody = document.getElementById('table-body');
  let i = 2;
  data.forEach(data => {
    const { person, countryOfCitizenship, industries, finalWorth, rank } = data;
    const personName = person.name;
    const image = person.squareImage;
    const country = countryOfCitizenship;
    const industry = industries[0];
    const worth = parseInt(finalWorth);
    const realTimeRank = rank;
    // console.log(personName, image, country, industry, worth);

    const tableRow = document.createElement('tr');
    tableRow.innerHTML = `
        <td>
        <div class="flex items-center space-x-3">
          <div class="avatar">
            <div class="mask mask-squircle w-12 h-12">
              <img src="${image}" alt="Avatar Tailwind CSS Component" />
            </div>
          </div>
          <div>
            <div class="font-bold">${personName}</div>
            <div class="text-sm opacity-50">${country}</div>
          </div>
        </div>
      </td>
      <td>
        <span class="badge badge-lg badge-ghost badge-sm p-4">${industry}</span>
      </td>
      <td>${realTimeRank}</td>
      <td>
        <h1 class="text-xl mb-2">$${worth}K</h1>
        <label class="btn btn-accent btn-sm w-full" for="my-modal-3" onclick="fetchIndividualData(${limit}, ${realTimeRank})">details</label>
      </td>
        `
    tableBody.appendChild(tableRow);
    i++;
    ;
  })
}

const fetchIndividualData = async (limit, id) => {
  const modalElement = document.getElementById('modal-body');
  modalElement.innerHTML = ''
  const resp = await fetch(`https://forbes400.onrender.com/api/forbes400?limit=${limit}`);
  const data = await resp.json();
  getIndividualData(id, data);

}

const getIndividualData = (id, data) => {
  const personData = data.find(person => person.rank == id)
  const { person, countryOfCitizenship, industries, finalWorth, rank, bios, source, city, state , birthDate, gender, financialAssets} = personData;
  const modalElement = document.getElementById('modal-body');
  modalElement.innerHTML = `
    <div class="modal-box relative w-3/4 max-w-none">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <h3 class="text-2xl font-bold text-center">${personData.personName}</h3>
    <h3 class="text-3xl font-semibold my-4">$${finalWorth}K</h3>
    <p class="text-xm">${bios}</p>
    
    <div class="flex gap-4 my-4">
  <div>
    <img src="${person.squareImage}" alt="" class="mb-2">
    <h3 class="text-lg font-semibold">Sources:<span class="font-normal"> ${source}</span></h3>
  </div>
  <div class="leading-8 flex flex-col justify-between">
    <h3 class="text-2xl font-semibold underline">General Information</h3>
    <h2 class="text-base font-semibold">Citizenship:<span class="font-normal"> ${countryOfCitizenship} </span></h2>
    <h2 class="text-base font-semibold">State:<span class="font-normal"> ${state}</span></h2>
    <h2 class="text-base font-semibold">City:<span class="font-normal"> ${city}</span></h2>
    <h2 class="text-base font-semibold">Birthday:<span class="font-normal"> ${toDateFormat(birthDate)}</span></h2>
    <h2 class="text-base font-semibold">Gender:<span class="font-normal"> ${gender === 'M'? "Male" : "Female"} </span></h2>

    <h3 class="text-2xl font-semibold underline">Financial Information</h3>
    <h2 class="text-base font-semibold">Exchange:<span class="font-normal"> ${financialAssets.map(item => item.exchange).join(', ')}</span></h2>
    <h2 class="text-base font-semibold">Ticker:<span class="font-normal"> ${financialAssets.map(item => item.ticker).join(', ')}</span></h2>
    <h2 class="text-base font-semibold">Total Shares:<span class="font-normal"> ${financialAssets.map(item => item.numberOfShares).join(', ')}</span></h2>
    <h2 class="text-base font-semibold">Share Price:<span class="font-normal"> ${financialAssets.map(item => item.sharePrice).join(', ')}</span></h2>
    <h2 class="text-base font-semibold">:<span class="font-normal"> </span></h2>
  </div>
</div>
  </div>
    `
}

const toDateFormat = date => {
  const dateFormated = new Date(date);
  return dateFormated.toUTCString();
}