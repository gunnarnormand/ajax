const NYTModule = (function() {
	const api_key = '67264abd39404fc28b561345486b3fd0';
	const $form = document.querySelector('form');
	const $input = document.querySelector('input[type=search]');
	const $list = document.querySelector('#list');
	const init = function() {

		$form.addEventListener('submit', (e) => {
			e.preventDefault();
			let q = $input.value;
			//console.log(q);
			let url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
			url += '?' + $.param({
			  'api-key': api_key,
			  'q': `${q}`
			});
			$.ajax({
			  url: url,
			  method: 'GET',
			}).done(function(result) {
				let nytDocs = result.response.docs;
			  //console.log(nytDocs[0]);
			  nytDocs.forEach(doc => {
			  	//console.log(doc);
					$list.insertAdjacentHTML('afterbegin', `

						<div class="col s12 m7 l6">
						  <h5 class="header truncate">${doc.headline.main}</h5>
							<div class="card horizontal">
								<div class="card-stacked">
									<div class="card-content">
										<p>${doc.snippet}</p>
									</div>
									<div class="card-action">
										<p>date: ${doc.pub_date}</p>
									</div>
									<div class="card-action">
										<a href="${doc.web_url}" target="_blank" class="waves-effect waves-light btn green darken-1">
											<i class="material-icons left">link</i>
										link
										</a>
									</div>
								</div>
							</div>
						</div>

					`);

			  });

			}).fail(function(err) {
			  throw err;
			});

			$input.value = '';
		});
	}

	return {
		init: init
	}
})();

window.onload = function() {
	NYTModule.init();

}