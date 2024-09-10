document.addEventListener('DOMContentLoaded', function() {
    const stationList = document.getElementById('station-list');
    const radioPlayer = document.getElementById('radio-player');
    const spinningImage = document.getElementById('spinning-image');
    const accordionButton = document.querySelector('.accordion-button');
    const accordionContent = document.querySelector('.accordion-content');
    const nowPlaying = document.getElementById('now-playing');

    // Fetch stations from Radio Browser API
    fetch('https://de1.api.radio-browser.info/json/stations/bycountryexact/Nigeria')
        .then(response => response.json())
        .then(stations => {
            stations.forEach(station => {
                const stationElement = document.createElement('div');
                stationElement.className = 'station';

                // Generate avatar URL if favicon is missing
                const initials = station.name.match(/\b\w/g) || [];
                const avatarUrl = `https://ui-avatars.com/api/?name=${initials.join('')}&background=random&color=fff&size=64`;

                // Create image element for the favicon or avatar
                const favicon = document.createElement('img');
                favicon.src = station.favicon || avatarUrl;
                favicon.alt = `${station.name} Avatar`;

                // Create text element for the station name
                const stationName = document.createElement('span');
                stationName.textContent = station.name;

                // Append favicon/avatar and station name to the station element
                stationElement.appendChild(favicon);
                stationElement.appendChild(stationName);

                stationElement.onclick = () => {
                    // Set the spinning image to the selected station's image
                    spinningImage.src = favicon.src;
                    nowPlaying.textContent = station.name;

                    // Play the selected radio station
                    radioPlayer.src = station.url;
                    radioPlayer.play();
                };

                stationList.appendChild(stationElement);
            });
        })
        .catch(error => console.error('Error fetching stations:', error));

    // Accordion toggle functionality
    accordionButton.addEventListener('click', function() {
        const isOpen = accordionContent.style.maxHeight;
        if (isOpen) {
            accordionContent.style.maxHeight = null;
        } else {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
        }
    });
});
