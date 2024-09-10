jQuery(function ($) {
    'use strict';

    var supportsAudio = !!document.createElement('audio').canPlayType;
    if (supportsAudio) {
        // Initialize plyr
        var player = new Plyr('#audio1', {
            controls: [
                'play',
                'progress',
                'current-time',
                'volume',
                'mute'
            ]
        });

        // Elements
        var audio = $('#audio1').get(0),
            npAction = $('#npAction'),
            npTitle = $('#npTitle'),
            stationList = $('#stationList'),
            stationListWrap = $('#stationListWrap'),
            spinner = $('#spinner');

        // Function to fetch and display radio stations
        var fetchStations = function () {
            stationListWrap.addClass('loading'); // Show spinner
            $.ajax({
                url: 'https://de1.api.radio-browser.info/json/stations/bycountryexact/Nigeria',
                method: 'GET',
                success: function (data) {
                    if (data.length > 0) {
                        var listHtml = '';
                        $.each(data, function (index, station) {
                            listHtml += '<li data-url="' + station.url + '">' + station.name + '</li>';
                        });
                        stationList.html(listHtml);
                        $('#spinner').hide();
                    } else {
                        stationList.html('<li>No stations available</li>');
                    }
                    // Ensure spinner is hidden after content is loaded
                    stationListWrap.removeClass('loading');
                    $('#spinner').hide();
                },
                error: function () {
                    stationList.html('<li>Error loading stations</li>');
                    // Ensure spinner is hidden even if there's an error
                    stationListWrap.removeClass('loading');
                    $('#spinner').hide();
                }
            });
        };

        // Function to play a station
        var playStation = function (url) {
            audio.src = url;
            audio.play();
            npAction.text('Now Playing...');
        };

        // Event listener for station selection
        stationList.on('click', 'li', function () {
            var url = $(this).data('url');
            playStation(url);
            npTitle.text($(this).text());
        });

        // Fetch stations on page load
        fetchStations();
    } else {
        // No audio support
        $('.column').addClass('hidden');
        $('.container').append('<p class="no-support">Audio not supported on this device.</p>');
    }
});



document.addEventListener('DOMContentLoaded', function() {
    const stationList = document.getElementById('station-list');
    const radioPlayer = document.getElementById('radio-player');
    const spinningImage = document.getElementById('spinning-image');
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
});
