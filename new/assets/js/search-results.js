document.addEventListener('DOMContentLoaded', function() {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchQuerySpan = document.getElementById('searchQuery');

    const urlParams = new URLSearchParams(window.location.search);
    const cityName = urlParams.get('query');

    if (searchQuerySpan) {
        searchQuerySpan.textContent = cityName;
    }

    if (!cityName) {
        searchResultsContainer.innerHTML = '<p>No search query provided.</p>';
        return;
    }

    const apiKey = '5b01411ee3mshfb5e330b3feb031p138a25jsn2a4421430505';
    const apiHost = 'wft-geo-db.p.rapidapi.com';
    const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${cityName}&limit=10`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                searchResultsContainer.innerHTML = '';
                data.data.forEach(city => {
                    const card = document.createElement('div');
                    card.classList.add('desti-card');
                    const price = Math.floor(Math.random() * 500) + 100;
                    const imageUrl = `https://source.unsplash.com/600x650/?${city.name}`;

                    card.innerHTML = `
                        <div class="card-banner img-holder" style="--width: 600; --height: 650;">
                            <img src="${imageUrl}" width="600" height="650" loading="lazy" alt="${city.name}" class="img-cover">
                            <span class="card-price">$${price}</span>
                        </div>
                        <div class="card-content">
                            <h3 class="h3 title">
                                <a href="#" class="card-title">${city.name}</a>
                            </h3>
                            <address class="card-text">${city.country}</address>
                            <div class="card-rating">
                                <span class="span">
                                    <ion-icon name="star" aria-hidden="true"></ion-icon>
                                    ${(Math.random() * (5 - 3) + 3).toFixed(1)}
                                </span>
                                <p class="ratig-text">(${(Math.random() * 10).toFixed(1)}k Review)</p>
                            </div>
                            <p class="card-text" style="margin-top: 10px;">A beautiful city with a rich history and culture, waiting to be explored.</p>
                            <a href="booking.html?destination=${city.name}&location=${city.country}&price=${price}" class="btn btn-primary book-btn">
                                Book Now
                                <ion-icon name="arrow-forward-outline"></ion-icon>
                            </a>
                        </div>
                    `;
                    searchResultsContainer.appendChild(card);
                });
            } else {
                searchResultsContainer.innerHTML = '';
                const q = cityName || '';
                if (q) {
                    const card = document.createElement('div');
                    card.classList.add('desti-card');
                    const price = Math.floor(Math.random() * 500) + 100;
                    const imageUrl = `https://source.unsplash.com/600x650/?${encodeURIComponent(q)}`;
                    card.innerHTML = `
                        <div class="card-banner img-holder" style="--width: 600; --height: 650;">
                            <img src="${imageUrl}" width="600" height="650" loading="lazy" alt="${q}" class="img-cover">
                            <span class="card-price">$${price}</span>
                        </div>
                        <div class="card-content">
                            <h3 class="h3 title">
                                <a href="#" class="card-title">${q}</a>
                            </h3>
                            <address class="card-text"></address>
                            <div class="card-rating">
                                <span class="span">
                                    <ion-icon name="star" aria-hidden="true"></ion-icon>
                                    ${(Math.random() * (5 - 3) + 3).toFixed(1)}
                                </span>
                                <p class="ratig-text">(${(Math.random() * 10).toFixed(1)}k Review)</p>
                            </div>
                            <p class="card-text" style="margin-top: 10px;">A beautiful city with a rich history and culture, waiting to be explored.</p>
                            <a href="booking.html?destination=${q}&location=&price=${price}" class="btn btn-primary book-btn">
                                Book Now
                                <ion-icon name="arrow-forward-outline"></ion-icon>
                            </a>
                        </div>
                    `;
                    searchResultsContainer.appendChild(card);
                } else {
                    searchResultsContainer.innerHTML = '<p>No results found.</p>';
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            searchResultsContainer.innerHTML = '<p>An error occurred while fetching data.</p>';
        });
});