(function() {
    var timeline;

    loadTimeline();

    $('.url-input').change(function(event) {
        var value = $(event.target).val();
        value = 'https://archiveofourown.org/works/' + value.match(/[0-9]+/);

        $.get('https://cors-anywhere.herokuapp.com/' + value, function(response) {
            var updatedDate = new Date($(response).find('div.header.module p.datetime').text());

            var updatedDateString = updatedDate.getFullYear() + '-';
            updatedDateString += updatedDate.getMonth() + 1 < 10 ? '0' : '';
            updatedDateString += (updatedDate.getMonth() + 1) + '-';
            updatedDateString += updatedDate.getDate() + 1 < 10 ? '0' : '';
            updatedDateString += updatedDate.getDate() + 1;
            
            $('.date-input--updated').val(updatedDateString);

            showEra(updatedDate, $('.era--updated'));
        });
    });

    $('.date-input--published').change(function(event) {
        var value = $(event.target).val();
        var eraElement = $('.era--published');
        
        showEra(value, eraElement);
    });

    $('.date-input--updated').change(function(event) {
        var value = $(event.target).val();
        var eraElement = $('.era--updated');
        
        showEra(value, eraElement);
    });

    function showEra(date, eraElement) {
        date = new Date(date);

        var era = getEra(date);
        var eraName = $(era).find('name').text();

        $(eraElement).find('.era__era').text(eraName);
    }

    function getEra(date) {
        date = new Date(date);

        var earliestStartDate = new Date($(timeline).find('startDate').first().text());
        var latestEndDate = new Date($(timeline).find('endDate').last().text());

        if (date < earliestStartDate) {
            return $(timeline).find('pre-timeline-era');
        }
        else if (date > latestEndDate) {
            return $(timeline).find('post-timeline-era');
        }

        var eras = $(timeline).find('era');

        for (let index = 0; index < eras.length; index++) {
            var era = eras[index];
            var startDate = new Date($(era).find('startDate').text());
            var endDate = new Date($(era).find('endDate').text());

            if ((date >= startDate) && (date <= endDate)) {
                return era;
            }
        }

        return null;
    }

    function loadTimeline() {
        $.get('carmilla-timeline.xml', function(response) {
            timeline = response;

            $('body').fadeIn();
        });
    }
})();
