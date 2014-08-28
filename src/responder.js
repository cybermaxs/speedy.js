/* respond.js */
(function (w) {
    this.w = w;
    this.log = null;

    var InlineStyles = {
        reset: 'font-size:12px;z-index:99999;text-align:left;font-family:Calibri,\'Lucida Grande\',Arial,sans-serif;text-shadow:none;box-shadow:none;display:inline-block;color:#444;font-weight:normal;border:none;margin:0;padding:0;background:none;',
        element: 'position:fixed;margin:0 auto;top: 0;left:0;right:0;border-bottom:solid 1px #EFCEA1;box-shadow:0 2px 5px rgba(0,0,0,.1);',
        container: 'background:#FFFDF2;background:rgba(255,253,242,.99);padding:2px;display:block;',
        header: 'font-size:12px;font-weight:normal;margin:0 ;width:auto',
        button: 'float:right;background:none;border-radius:5px;padding:2px;font-size:12px;line-height:130%;width:auto;margin:0 ;cursor:pointer'
    };

    var orderedPageEvents = [
      'navigationStart',
      'redirectStart',
      'redirectEnd',
      'fetchStart',
      'domainLookupStart',
      'domainLookupEnd',
      'connectStart',
      'secureConnectionStart',
      'connectEnd',
      'requestStart',
      'responseStart',
      'responseEnd',
      'unloadEventStart',
      'unloadEventEnd',
      'domLoading',
      'domInteractive',
      'msFirstPaint',
      'domContentLoadedEventStart',
      'domContentLoadedEventEnd',
      'domContentLoaded',
      'domComplete',
      'loadEventStart',
      'loadEventEnd'
    ];

    var sections = [{
        name: 'network',
        color: [224, 84, 63],
        firstEventIndex: orderedPageEvents.indexOf('navigationStart'),
        lastEventIndex: orderedPageEvents.indexOf('connectEnd'),
    }, {
        name: 'server',
        color: [255, 188, 0],
        firstEventIndex: orderedPageEvents.indexOf('requestStart'),
        lastEventIndex: orderedPageEvents.indexOf('responseEnd'),
    }, {
        name: 'browser',
        color: [16, 173, 171],
        firstEventIndex: orderedPageEvents.indexOf('unloadEventStart'),
        lastEventIndex: orderedPageEvents.indexOf('loadEventEnd'),
    }];

    var getPerfObjKeys = function (obj) {
        var keys = Object.keys(obj);
        return keys.length ? keys : Object.keys(Object.getPrototypeOf(obj));
    }

    var computePageEventsTimings = function () {

        var data = this.w.performance;
        var timingData = data.timing;
        var eventNames = getPerfObjKeys(timingData);
        var eventsTimings = {};

        var startTime = timingData.navigationStart || 0;
        var eventTime = 0;

        for (var i = 0, l = eventNames.length; i < l; i++) {
            var evt = timingData[eventNames[i]];

            if (evt && evt > 0) {
                eventTime = evt - startTime;
                eventsTimings[eventNames[i]] = { time: eventTime };
            }
        }

        return eventsTimings;
    }

    var createBoxContent = function () {
        var c = document.createElement('div');
        var h = document.createElement('span');

        var content = '';
        if (!this.w.performance || !this.log) {
            content = "Your browser does not support Navigation Timing API.";
        }
        else {

            for (var i = 0, l = this.log.sections.length; i < l; i++) {
                content += '<span style="color:rgb(' + this.log.sections[i].color.join(',') + ')">'
                    + this.log.sections[i].duration + ' ms (' + this.log.sections[i].name + ')'
                    + ' </span> ' + (i < l - 1 ? ' +' : '');
            }

            content = 'Page Load Time <span style="font-weight:bold">' + this.log.totaltime + ' ms </span>  => ' + content;
        }

        h.innerHTML = content;
        h.style.cssText = InlineStyles.reset + InlineStyles.header;
        c.appendChild(h);

        return c;
    }

    var createBoxCloseButton = function () {
        var b = document.createElement('button');
        b.innerHTML = 'close this box &times;';
        b.style.cssText = InlineStyles.reset + InlineStyles.button;
        return b;
    }

    var createBox = function () {
        var container = this.w.document.createElement('div');
        var content = createBoxContent();
        var button = createBoxCloseButton();

        button.onclick = function (e) {
            button.onclick = null;
            container.parentNode.removeChild(container);
        };

        container.style.cssText = InlineStyles.reset + InlineStyles.container + InlineStyles.element;

        content.appendChild(button);
        container.appendChild(content);
        return container;
    }

    var computeData = function () {

        var log = {
            totaltime: 0,
            sections: [],
            ressources: []
        };

        if (this.w.performance) {

            // sections
            var timings = computePageEventsTimings();

            for (var i = 0, len = sections.length; i < len; i++) {
                var firstEventIndex = sections[i].firstEventIndex;
                var lastEventIndex = sections[i].lastEventIndex;

                var sectionOrder = orderedPageEvents.slice(firstEventIndex, lastEventIndex + 1);
                var sectionEvents = sectionOrder.filter(function (el) {
                    return timings.hasOwnProperty(el);
                });

                sectionEvents.sort(function (a, b) {
                    return timings[a].time - timings[b].time;
                })

                firstEventIndex = sectionEvents[0];
                lastEventIndex = sectionEvents[sectionEvents.length - 1];

                log.sections.push({ name: sections[i].name, duration: timings[lastEventIndex].time - timings[firstEventIndex].time, color: sections[i].color });

                for (var j = 0, flen = sectionEvents.length; j < flen; j++) {
                    var item = sectionEvents[j];
                    if (timings[item]) {
                        timings[item].sectionIndex = i;
                    }
                }
            }

            for (var s in log.sections) {
                log.totaltime += log.sections[s].duration;
            }

            //ressources
            if (this.w.performance.getEntries) {
                log.ressources = this.w.performance.getEntries().map(function (entry) { return { name: entry.name, duration: entry.duration } });
            }

        };
        
        this.log = log;
    }

    var run = function () {
        if (!this.log) {
            computeData();
        }
        var container = createBox();
        document.body.appendChild(container);
    }

    function addLoadEvent(func) {
        var oldonload = this.w.onload;
        if (typeof this.w.onload != 'function') {
            this.w.onload = func;
        } else {
            this.w.onload = function () {
                if (oldonload) {
                    oldonload();
                }
                func();
            }
        }
    }

    if (this.w.document.readyState === 'complete') {
        // run now if already loaded
        run();
    } else {
        // add to load event
        addLoadEvent(run);
    }

})(window);



