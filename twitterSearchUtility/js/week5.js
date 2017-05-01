var TwitterApi = (function() {

	var $timelineSearchForm = document.querySelector('form[name=timeline]');
	var $timelineInput = document.querySelector('input[name=screen_name]');

	var $quickSearchForm = document.querySelector('form[name=search]');
	var $quickSearchInput = document.querySelector('input[name=q]');

	var $advSearchForm = document.querySelector('form[name=adv_search]');
	var $advSearchInput = document.querySelector('input[name=adv_q]');
	var $searchLimit = document.querySelector('input[name=count]');
	var $resultType = document.querySelector('select[name=result_type]');

	var $quickResultsList = document.querySelector('#quickResults');
	var $timelineResultsList = document.querySelector('#timelineResults');
	var $advancedResultsList = document.querySelector('#advancedResults');

	var $clearQuickBtn = document.querySelector('#clear-quick');
	var $clearTimelineBtn = document.querySelector('#clear-timeline');
	var $clearCustomBtn = document.querySelector('#clear-custom');
	var $clearAllBtn = document.querySelector('#clear-all');


	function setupListeners() {

		$quickSearchForm.addEventListener('submit', function(e) {
			e.preventDefault();
			var q = $quickSearchInput.value;
			$quickSearchInput.value = '';

			getSearchResults(q);
		});
		
		$timelineSearchForm.addEventListener('submit', function(e) {
			e.preventDefault();
			var q = $timelineInput.value;
			$timelineInput.value = '';
			
			getTimelineResults(q);
		});

		$advSearchForm.addEventListener('submit', function(e) {
			e.preventDefault();
			var adv_q = $advSearchInput.value;
			$advSearchInput.value = '';
			var count = $searchLimit.value;
			$searchLimit.value = 15;
			var type = $resultType.value;	

			getAdvancedSearchResults(adv_q, count, type);
		});

		$clearQuickBtn.addEventListener('click', function(e) {
			e.preventDefault();
			$quickResultsList.innerHTML = '';
		});
		$clearTimelineBtn.addEventListener('click', function(e) {
			e.preventDefault();
			$timelineResultsList.innerHTML = '';
		});
		$clearCustomBtn.addEventListener('click', function(e) {
			e.preventDefault();
			$advancedResultsList.innerHTML = '';
		});
		$clearAllBtn.addEventListener('click', function(e) {
			e.preventDefault();
			$advancedResultsList.innerHTML = '';
			$timelineResultsList.innerHTML = '';
			$quickResultsList.innerHTML = '';
		});
	}

	function getSearchResults(query) {

		$.ajax({
			url: 'twitter-proxy.php',
			dataType: 'json',
			data: {
				'op': 'search_tweets',
				'q': query
			},
		}).done(function(results) {

			processSearchResults(results);

		}).fail(function(err) {
		  throw err;
		});
	}

	function getTimelineResults(screen_name) {

		$.ajax({
			url: 'twitter-proxy.php',
			dataType: 'json',
			data: {
				'op': 'user_search',
				'q': screen_name
			},
		}).done(function(results) {

			processTimelineResults(results);

		}).fail(function(err) {
		  throw err;
		});
	}

	function getAdvancedSearchResults(q, count, result_type) {

		$.ajax({
			url: 'twitter-proxy.php',
			dataType: 'json',
			data: {
				'op': 'search_tweets',
				'q': q,
				'count': count,
				'result_type': result_type
			},
		}).done(function(results) {

			processAdvancedSearchResults(results);

		}).fail(function(err) {
		  throw err;
		});
	}

	function processSearchResults(searchData) {
		let tweets = searchData.statuses;
		// console.log(tweets[0]);
		tweets.forEach(tweet => {
			$quickResultsList.insertAdjacentHTML('afterbegin', `
				<li class="collection-item avatar">
					<img src="${tweet.user.profile_image_url}" class="circle">
					<span class="title">${tweet.user.name}</span>
					<p>${tweet.text}</p>
					<br />
					<span class="new badge blue" data-badge-caption="retweets">${tweet.retweet_count}</span>
			    </li>
			`);
		});
	}

	function processTimelineResults(timelineData) {
		let users = timelineData;
		// console.log(users);
		users.forEach(user => {
			$timelineResultsList.insertAdjacentHTML('afterbegin', `
				<li class="collection-item avatar">
					<img src="${user.profile_image_url}" class="circle">
					<span class="title">${user.screen_name}</span>
					<p>${user.name}</p>
					<a href="${user.url}" target="_blank">${user.url}</a>
			    </li>
			`);
		});
	}

	function processAdvancedSearchResults(advSearchData) {
		let tweets = advSearchData.statuses;
		let df = 'https://unsplash.it/200/?random';
		console.log(tweets[0]);
		tweets.forEach(tweet => {
			let bgimg = tweet.user.profile_background_image_url;
			$advancedResultsList.insertAdjacentHTML('afterbegin', `
				
				<div class="col s12 m4 l3">
					<div class="card">
						<div class="card-image">
							<img class="responsive-img custom-card-bg" src="${bgimg?bgimg:df}">
							<span class="card-title">${tweet.user.name}</span>
							<a href="${tweet.user.url}" target="_blank" class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
						</div>
						<div class="card-content">
							<p class="custom-card-bg">${tweet.text}</p>
						</div>
					</div>
				</div>
			`);
		});
	}

	var init = function() {
		setupListeners();
	};

	return {
		init: init
	}
}());

TwitterApi.init();

$(document).ready(function() {
    $('#search, #icon_prefix1, #icon_prefix2').characterCounter();
    $('select').material_select();
});
