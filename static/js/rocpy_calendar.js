/* Loads the Google data JavaScript client library */
google.load("gdata", "1");

function init() {
	// load the code.google.com developer calendar
	loadChurchCalendar();
}

/**
 * Loads the Event Calendar
 **/
function loadChurchCalendar(calendarAddress) {
	/**
	 * Determines the full calendarUrl based upon the calendarAddress
	 * argument and calls loadCalendar with the calendarUrl value.
	 *
	 * @param {string} calendarAddress is the email-style address for the calendar
	 **/ 

	var calendarUrl = 'http://www.google.com/calendar/feeds/'+calendarAddress+'/public/full';

	/**
	 * Uses Google data JS client library to retrieve a calendar feed from the specified
	 * URL.  The feed is controlled by several query parameters and a callback 
	 * function is called to process the feed results.
	 *
	 * @param {string} calendarUrl is the URL for a public calendar feed
	 **/  
	// init the Google data JS client library with an error handler
	google.gdata.client.init(handleGDError);

	var service = new google.gdata.calendar.CalendarService('gdata-js-client-samples-simple');
	var query = new google.gdata.calendar.CalendarEventQuery(calendarUrl);
	query.setOrderBy('starttime');
	query.setSortOrder('ascending');
	query.setFutureEvents(true);
	query.setSingleEvents(true);
	query.setMaxResults(10);

	service.getEventsFeed(query, listEvents, handleGDError);
}

/**
 * Adds a leading zero to a single-digit number.  Used for displaying dates.
 **/
function padNumber(num) {
	if (num <= 9) {
		return "0" + num;
	}
	return num;
}


/**
 * Callback function for the Google data JS client library to call when an error
 * occurs during the retrieval of the feed.  Details available depend partly
 * on the web browser, but this shows a few basic examples. In the case of
 * a privileged environment using ClientLogin authentication, there may also
 * be an e.type attribute in some cases.
 *
 * @param {Error} e is an instance of an Error 
 **/

function handleGDError(e) {
	//document.getElementById('jsSourceFinal').setAttribute('style', 'display:none');
	//if (e instanceof Error) {
	//  /* alert with the error line number, file and message */
	//  alert('Error at line ' + e.lineNumber +
	//        ' in ' + e.fileName + '\n' +
	//        'Message: ' + e.message);
	//  /* if available, output HTTP error code and status text */
	//  if (e.cause) {
	//    var status = e.cause.status;
	//    var statusText = e.cause.statusText;
	//    alert('Root cause: HTTP error ' + status + ' with status text of: ' + 
	//          statusText);
	//  }
	//} else {
	//  alert(e.toString());
	//}
}

/**
 * Callback function for the Google data JS client library to call with a feed 
 * of events retrieved.
 *
 * Creates an unordered list of events in a human-readable form.  This list of
 * events is added into a div called 'events'.  The title for the calendar is
 * placed in a div called 'calendarTitle'
 *
 * @param {json} feedRoot is the root of the feed, containing all entries 
 **/ 
function listEvents(feedRoot) {
	var entries = feedRoot.feed.getEntries();
	var eventDL = document.getElementById('events');

	while (eventDL.firstChild) {
		//The list is LIVE so it will re-index each call
		eventDL.removeChild(eventDL.firstChild);
	};

	/* set the calendarTitle div with the name of the calendar */
	var dt = document.createElement('dt');
	dt.id = 'calendarTitle';
	dt.innerHTML = feedRoot.feed.title.$t;
	eventDL.appendChild(dt);

	/* loop through each event in the feed */
	//var len = entries.length;
	var len = 3; 

	for (var i = 0; i < len; i++) {
		var entry = entries[i];
		var title = entry.getTitle().getText();
		var startDateTime = null;
		var startJSDate = null;
		var times = entry.getTimes();
		if (times.length > 0) {
			startDateTime = times[0].getStartTime();
			startJSDate = startDateTime.getDate();
		}

		var entryLinkHref = null;
		if (entry.getHtmlLink() != null) {
			entryLinkHref = entry.getHtmlLink().getHref();
		}

		var startTimeHourStr;

		if (startJSDate.getHours() > 12) {
			startTimeHourStr = startJSDate.getHours() - 12;
			add = " pm";
		} else if (startJSDate.getHours() <= 12) {
			startTimeHourStr = startJSDate.getHours();
			add = " am";
		} else if (hour == 12) {
			add = " pm";
		} else if (hour == 00) {
			hour = "12";
			add = " am";
		}

		var startTimeDayOfWeekStr;
		var startTimeDayInt = startJSDate.getDay();
		switch(startTimeDayInt)
		{
			case 0:
				startTimeDayOfWeekStr = "Sunday";
				break;
			case 1:
				startTimeDayOfWeekStr = "Monday";
				break;
			case 2:
				startTimeDayOfWeekStr = "Tuesday";
				break;
			case 3:
				startTimeDayOfWeekStr = "Wednesday";
				break;
			case 4:
				startTimeDayOfWeekStr = "Thursday";
				break;
			case 5:
				startTimeDayOfWeekStr = "Friday";
				break;
			case 6:
				startTimeDayOfWeekStr = "Saturday";
				break;
			default:
				startTimeDayOfWeekStr = "";
				break;
		}

		var dateString = startTimeDayOfWeekStr + " " + (startJSDate.getMonth() + 1) + "/" + startJSDate.getDate();
		if (!startDateTime.isDateOnly()) {
			dateString += " " + startTimeHourStr + ":" + 
				padNumber(startJSDate.getMinutes()) + " " + add;
		}

		var dd = document.createElement('dd');
		/* if we have a link to the event, create an 'a' element */
		if (entryLinkHref != null) {
			entryLink = document.createElement('a');
			entryLink.setAttribute('href', entryLinkHref);
			entryLink.appendChild(document.createTextNode(title));
			dd.appendChild(entryLink);
			dd.appendChild(document.createTextNode(' - ' + dateString));
		} else {
			dd.appendChild(document.createTextNode(title + ' - ' + dateString));
		}        
		eventDL.appendChild(dd);
	}
}
