const demoImage = 'https://images.unsplash.com/photo-1618827840222-fcf8f42509c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1031&q=80'

const getData = async (limit) => {
  try {
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400?limit=${limit}`);
    const data = await resp.json();
    showData(limit, data, false);
  }
  catch (error) {
    console.log(error);
  }
}

const getFilterData = async (filterValue) => {
  try {
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400/${filterValue}`);
    let data = await resp.json();
    // data = data.slice(0, 50)
    showData(50, data, true, filterValue);
  }
  catch (error) {
    console.log(error);
  }
}

const showData = (limit, data, filter, filterValue) => {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';
  let i = 2;
  data.forEach(data => {
    const { person, countryOfCitizenship, industries, finalWorth, rank, imageExists } = data;
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
              <img src="${imageExists ? image : demoImage}" alt="Avatar Tailwind CSS Component" />
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
        <label class="btn btn-accent btn-sm w-full" for="my-modal-3" onclick="fetchIndividualData(${limit}, ${realTimeRank}, ${filter}, '${filterValue}')">details</label>

      </td>
        `
    tableBody.appendChild(tableRow);
    i++;
    ;
  })
}

const fetchIndividualData = async (limit, id, filter, filterValue) => {
  if (filter === false) {
    const modalElement = document.getElementById('modal-body');
    modalElement.innerHTML = '';
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400?limit=${limit}`);
    const data = await resp.json();
    getIndividualData(id, data);
  }
  else {
    console.log(filterValue);
    const modalElement = document.getElementById('modal-body');
    modalElement.innerHTML = ''
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400/${filterValue}`);
  
    let data = await resp.json();
    console.log(data);
    getIndividualData(id, data);

  }
}

const getIndividualData = (id, data) => {
  const personData = data.find(person => person.rank == id)
  console.log(personData);
  const { person, countryOfCitizenship, industries, finalWorth, rank, bios, source, city, state, birthDate, gender, financialAssets, imageExists } = personData;
  const modalElement = document.getElementById('modal-body');
  modalElement.innerHTML = `
    <div class="modal-box relative w-3/4 max-w-none">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <h3 class="text-2xl font-bold text-center">${personData.personName}</h3>
    <h3 class="text-3xl font-semibold my-4">$${finalWorth}K</h3>
    <p class="text-xm">${bios}</p>
    
    <div class="flex gap-4 my-4">
  <div>
    <img src="${imageExists ? person.squareImage : demoImage}" alt="" class="mb-2">
    <h3 class="text-lg font-semibold">Sources:<span class="font-normal"> ${source}</span></h3>
  </div>
  <div class="leading-8 flex flex-col justify-between">
    <h3 class="text-2xl font-semibold underline">General Information</h3>
    <h2 class="text-base font-semibold">Citizenship:<span class="font-normal"> ${countryOfCitizenship} </span></h2>
    <h2 class="text-base font-semibold">State:<span class="font-normal"> ${state}</span></h2>
    <h2 class="text-base font-semibold">City:<span class="font-normal"> ${city}</span></h2>
    <h2 class="text-base font-semibold">Birthday:<span class="font-normal"> ${toDateFormat(birthDate)}</span></h2>
    <h2 class="text-base font-semibold">Gender:<span class="font-normal"> ${gender === 'M' ? "Male" : "Female"} </span></h2>

    <h3 class="text-2xl font-semibold underline">Financial Information</h3>
    <h2 class="text-base font-semibold">Exchange:<span class="font-normal"> ${Array.isArray(financialAssets) ? financialAssets.map(item => item.exchange).join(', '):'N/A'}</span></h2>
    <h2 class="text-base font-semibold">Ticker:<span class="font-normal"> ${Array.isArray(financialAssets)?financialAssets.map(item => item.ticker).join(', '): 'N/A'}</span></h2>
    <h2 class="text-base font-semibold">Total Shares:<span class="font-normal"> ${Array.isArray(financialAssets)?financialAssets.map(item => item.numberOfShares).join(', '): 'N/A'}</span></h2>
    <h2 class="text-base font-semibold">Share Price:<span class="font-normal"> ${Array.isArray(financialAssets)?financialAssets.map(item => item.sharePrice).join(', '): 'N/A'}</span></h2>
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

const sortDataLimit = () => {
  const sortText = document.getElementById('sort-option').value;
  const sortValue = sortText.slice(4) != '' ? sortText.slice(4) : 'getAllBillionaires';
  const sortElement = document.getElementById('sort-limit');
  if (sortValue === 'getAllBillionaires') {
    getData(400)
    sortElement.innerText = '400';
  }
  else {
    getData(sortValue);
    sortElement.innerText = sortValue;
  }
}
const filterData = () => {
  const filterValue = document.getElementById('filter-option').value;
  const filterElement = document.getElementById('filter-element');
  getFilterData(filterValue);
  filterElement.innerText = `The list of Forbes ${filterValue} Billionaires`;
}