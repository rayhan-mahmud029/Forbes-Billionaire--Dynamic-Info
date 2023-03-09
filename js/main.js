const demoImage = 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'



// Left Nav Buttons Query Handler
document.getElementById('sort-100').addEventListener('click', function(){
  sortDataLimit('100')
});
document.getElementById('filter-youngest').addEventListener('click', function(){
  filterData('youngest')
});
document.getElementById('filter-female').addEventListener('click', function(){
  filterData('female')
});
document.getElementById('search-technology').addEventListener('click', function(){
  getIndustryData('technology')
});

// Getting Data by Fetching Starts from Here
const getData = async (limit) => {
  progressBarHandler(true)
  try {
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400?limit=${limit}`);
    const data = await resp.json();
    showData(limit, data, false, '', '', false);
  }
  catch (error) {
    console.log(error);
  }
}

const getFilterData = async (filterValue, sortValue='400') => {
  progressBarHandler(true)
  try {
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400/${filterValue}?limit=${sortValue}`);
    let data = await resp.json();
    // data = data.slice(0, 50)
    showData(400, data, true, filterValue, '', false);
  }
  catch (error) {
    console.log(error);
  }
}

// get Industry data from search
const getIndustryData = async (searchText, limit='400') => {
  progressBarHandler(true)
  try {
    const filterElement = document.getElementById('filter-element');
    const filterOption = document.getElementById('filter-option');
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400/industries/${searchText}?limit=${limit}`);
    let data = await resp.json();
    filterElement.innerText = `Forbes ${limit} Billionaires in ${searchText} field`;
    showData(400, data, false, '', searchText, true);
    filterOption.value = 'Filter_'
    
  }
  catch (error) {
    console.log(error);
  }
}
// Getting Data by Fetching Starts Ends here




// Showing Data in Table Starts Here
const showData = (limit, data, filter, filterValue, searchText, search) => {
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
            <div class="font-bold">${personName.length > 15 ? personName.slice(0, 15) + '..' : personName}</div>
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
        <label class="btn btn-accent btn-sm w-full" for="my-modal-3" onclick="fetchIndividualData(${limit}, ${realTimeRank}, ${filter}, '${filterValue}','${searchText}', ${search})">details</label>

      </td>
        `
    tableBody.appendChild(tableRow);
    i++;
    ;
  })
  progressBarHandler(false)
}
// Showing Data in Table Starts Here



// Individual Data fetching
const fetchIndividualData = async (limit, id, filter, filterValue, searchText, search) => {
  progressBarHandler(true)
  if (filter === false && search === false) {
    const modalElement = document.getElementById('modal-body');
    modalElement.innerHTML = '';
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400?limit=${limit}`);
    const data = await resp.json();
    getIndividualData(id, data);
  }
  else if (search === false) {
    const modalElement = document.getElementById('modal-body');
    modalElement.innerHTML = ''
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400/${filterValue}`);
    let data = await resp.json();
    getIndividualData(id, data);
  }
  else {
    const modalElement = document.getElementById('modal-body');
    modalElement.innerHTML = ''
    const resp = await fetch(`https://forbes400.onrender.com/api/forbes400/industries/${searchText}`);
    let data = await resp.json();
    getIndividualData(id, data);
  }
}
// Individual Data fetching Ends here





// Individual Data fetching Showing in Modal starts here
const getIndividualData = (id, data) => {
  const personData = data.find(person => person.rank == id)
  const { personName, person, squareImage, countryOfCitizenship, industries, finalWorth, rank, bios, source, city, state, birthDate, gender, financialAssets, imageExists, abouts, lastName, timestamp } = personData;
  const modalElement = document.getElementById('modal-body');
  modalElement.innerHTML = `
    <div class="modal-box relative w-3/4 max-w-none">
    <label for="my-modal-3" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
    <h3 class="text-xl lg:text-2xl  font-bold text-center">${personName}</h3>
    <h3 class="text-2xl lg:text-3xl font-semibold my-4 text-zinc-600">$${finalWorth}K</h3>
    <p class="text-xs lg:text-base">${bios}</p>
    
<div class="flex flex-col lg:flex-row gap-4 my-4">
  <div class = "flex-1 p-6 bg-cyan-100 rounded-lg border-2 border-zinc-400 text-center">
    <img src="${imageExists ? squareImage : demoImage}" alt="" class="mb-2 w-full rounded-lg">
    <h3 class="text-sm lg:text-lg font-semibold">Sources:<span class="font-normal"> ${source}</span></h3>
  </div>
  <div class="leading-8 flex flex-col justify-between flex-1 p-6 bg-cyan-100 rounded-lg border-2 border-zinc-400">
    <h3 class="text-xl lg:text-2xl font-semibold underline">General Information</h3>
    <h2 class="text-xs lg:text-base font-semibold">Citizenship:<span class="font-normal"> ${countryOfCitizenship} </span></h2>
    <h2 class="text-xs lg:text-base font-semibold">State:<span class="font-normal"> ${state}</span></h2>
    <h2 class="text-xs lg:text-base font-semibold">City:<span class="font-normal"> ${city}</span></h2>
    <h2 class="text-xs lg:text-base font-semibold">Birthday:<span class="font-normal"> ${toDateFormat(birthDate)}</span></h2>
    <h2 class="text-xs lg:text-base font-semibold">Gender:<span class="font-normal"> ${gender === 'M' ? "Male" : "Female"} </span></h2>

    <h3 class="text-xl lg:text-2xl font-semibold underline mt-4">Financial Information</h3>
    <h2 class="text-xs lg:text-base font-semibold">Exchange:<span class="font-normal"> ${Array.isArray(financialAssets) ? financialAssets.map(item => item.exchange).join(', ') : 'N/A'}</span></h2>
    <h2 class="text-xs lg:text-base font-semibold">Ticker:<span class="font-normal"> ${Array.isArray(financialAssets) ? financialAssets.map(item => item.ticker).join(', ') : 'N/A'}</span></h2>


    <!-- ----------------------------------------------------------
    First get an array from array of objects using map and then use reduce to get sum or average of that array ---------------------------------------------------- -->
    <h2 class="text-xs lg:text-sm font-semibold">Total Shares:<span class="font-normal"> ${Array.isArray(financialAssets) ? (financialAssets.map(item => item.numberOfShares).reduce((partialSum, a) => partialSum + a, 0)).toFixed(2) : 'N/A'}</span></h2>
    <h2 class="text-xs lg:text-sm font-semibold">Share Price:<span class="font-normal"> ${Array.isArray(financialAssets) ? (financialAssets.map(item => item.sharePrice).reduce((a, b) => a + b) / financialAssets.map(item => item.sharePrice).length).toFixed(2) : 'N/A'} (Avg)</span></h2>
  </div>
</div>
    <!-- About -->
    <h3 class="text-xl lg:text-2xl font-bold text-center">About ${lastName ? lastName : ''}:</h3>
    <h3 class="text-xs lg:text-sm my-2 text-center">${Array.isArray(abouts)? abouts.join('<br>') : ''}</h3>
    <h3 class="text-xs lg:text-sm mt-4 text-center text-neutral-400">Timestamp: ${toDateFormat(timestamp)}</h3>
  </div>
    `
  progressBarHandler(false);
}
// Individual Data fetching Showing in Modal ends here




// Functions to handle tasks like sorting, filtering and progress bar starts here
const toDateFormat = date => {
  const dateFormated = new Date(date);
  return dateFormated.toUTCString();
}

const sortDataLimit = (sortGiven) => {
  const sortText = document.getElementById('sort-option').value;
  console.log(sortGiven);
  const sortValue = sortGiven === 'undefined' ? sortText.slice(4) != '' ? sortText.slice(4) : '400' : sortGiven;
  const sortElement = document.getElementById('sort-limit');
  const filterElement = document.getElementById('filter-element');
  const searchText = document.getElementById('search-bar').value;
  const filterValue = document.getElementById('filter-option').value;

  if (searchText !== ''){
    getIndustryData(searchText, sortValue);
  }
  else if (filterValue !== 'Filter_'){
    getFilterData(filterValue, sortValue);
    filterElement.innerText = `Forbes Top ${sortValue} ${filterValue} Billionaires`;
  }
  else {
    getData(sortValue);
    sortElement.innerText = sortValue;
  }
}
const filterData = filterGiven => {
  console.log(filterGiven);
  const sortText = document.getElementById('sort-option').value;
  const sortValue = sortText != 'Sort by_' ? sortText.slice(4) : '400';
  const filterValue = filterGiven === 'undefined' ? document.getElementById('filter-option').value : filterGiven;
  const filterElement = document.getElementById('filter-element');

  if (sortValue !== '400'){
    getFilterData(filterValue, sortValue);
    filterElement.innerText = `Forbes Top ${sortValue} ${filterValue} Billionaires`;
  }
  else {
    getFilterData(filterValue, '400')
    filterElement.innerText = `Forbes ${filterValue} Billionaires`;
  }
}

const progressBarHandler = (isTrue) => {
  const element = document.getElementById('progress-bar');
  const mainContents = document.getElementById('main-contents') ;
  if (isTrue === true) {
    element.classList.remove('hidden');
    mainContents.classList.add('hidden');
  }
  else{
    mainContents.classList.remove('hidden');
    element.classList.add('hidden');
  }
}
// Functions to handle tasks like sorting, filtering and progress bar ends here



// Search Handling Event
document.getElementById('search-bar').addEventListener('keyup', function (e) {
  const searchText = e.target.value;
  const sortText = document.getElementById('sort-option').value;
  const sortValue = sortText !== 'Sort by_' ? sortText.slice(4) : '400';
  if (e.key == 'Enter') {
    getIndustryData(searchText, sortValue);
  }
})
// Search Handling Event Ends here






