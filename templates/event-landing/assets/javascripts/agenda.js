(function (global) {
  function initAgenda () {
    var timeFormat = 'h:mm';
    var meridianFormat = 'a';

    var days = [].slice.call(document.getElementsByClassName('js-time-table')).map(function (dayElem) {
      return {
        element: dayElem,
        sessions: [].slice.call(dayElem.getElementsByClassName('js-agenda-session')).map(function (sessionElem) {
          return {
            start: sessionElem.getAttribute('data-start'),
            end: sessionElem.getAttribute('data-end'),
            group: sessionElem.getAttribute('data-group'),
            type: sessionElem.getAttribute('data-type'),
            element: sessionElem
          };
        })
      }
    });

    days.forEach(function (day) {
      day.ranges = day.sessions.reduce(function (ranges, session) {
        var start = moment(session.start, 'HH:mm').format('X');
        var end = moment(session.end, 'HH:mm').format('X');
        var existing = ranges.filter(function (range) {
          return range.start == start;
        })[0];
        if (existing) {
          existing.sessions.push(session);

          if (existing.end < end) {
            existing.end = end;
          }
        } else {
          ranges.push({
            start: start,
            end: end,
            sessions: [session]
          })
        }
        return ranges;
      }, []);
    });

    days.forEach(function (day) {
      var container = day.element;
      day.ranges.forEach(function (range) {
        var rangeRowContainer = document.createElement('div');
        var rangeRow = document.createElement('div');
        var rangeRowSessions = document.createElement('div');
        var time = moment(range.start, 'X').format(timeFormat);
        var meridian = moment(range.start, 'X').format(meridianFormat);
        var timeElem = document.createElement('div');
        var timeValueElem = document.createElement('h3');
        var meridianElem = document.createElement('span');

        timeElem.classList.add('agenda-range-row-start-time');
        timeValueElem.innerHTML = time;
        meridianElem.innerHTML = meridian;
        timeElem.appendChild(timeValueElem);
        timeElem.appendChild(meridianElem);

        rangeRowSessions.classList.add('agenda-range-row-sesions-container');

        rangeRow.classList.add('agenda-range-row');
        rangeRowContainer.classList.add('container');
        rangeRowContainer.classList.add('agenda-range-row-sessions-' + range.sessions.length);
        rangeRowContainer.appendChild(timeElem);
        rangeRowContainer.appendChild(rangeRowSessions);
        rangeRow.appendChild(rangeRowContainer);

        range.sessions.forEach(function (session) {
          var sessionElem = document.createElement('div');
          sessionElem.classList.add('agenda-session');
          sessionElem.innerHTML = session.element.innerHTML;
          rangeRowSessions.appendChild(sessionElem);

          if (session.type === 'break') {
            rangeRow.classList.add('break');
          }

          container.removeChild(session.element);
        });

        container.appendChild(rangeRow);
      });
    });
  }

  $(function () {
    initAgenda()
  })
})(window)

