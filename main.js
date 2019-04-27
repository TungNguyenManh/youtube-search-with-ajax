$(document).ready(() => {
    let nextPageToken = '';
    let isLoading = false;
    let timeoutId = undefined;

    $('#keyword').on('input', (event) => {
        // $('#search').on('submit', (event) => {
        event.preventDefault(); //dừng hành động mặc định của submit (gửi request)
        window.clearTimeout(timeoutId);
        //cách 1: get value by form
        // const searchForm = document.getElementById('search');
        // console.log(searchForm.keyword.value);

        //cách 2: get value by input
        const searchInput = $('#keyword');
        const keyword = searchInput.val();

        timeoutId = setTimeout( () => {
        $('#spinner').removeClass('d-none');
        $('#spinner').addClass('d-flex');
        //get data from youtube api
        $.ajax({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keyword}&type=video&key=AIzaSyA9gQZ-oYomFypZN7PsupZJtOfQqA6Q3qw`,
            type: 'GET',
            success: (data) => {
                console.log(data);
                $('#spinner').removeClass('d-flex');
                $('#spinner').addClass('d-none');
                nextPageToken = data.nextPageToken;
                $('#result-list').html('');

                if(data.items.length === 0) {
                    $('#result-list').text('Not found!');
                } else {
                data.items.forEach((item) => {
                    const itemLink = `
                    <a class="result col-md-12" href='https://www.youtube.com/watch?v=${item.id.videoId}' targer='_blank'>
                        <div class='row'>
                            <div class='col-4'>
                                <img src='${item.snippet.thumbnails.medium.url}' alt='not found'>
                                </div>
                            <div class='col-8'>
                                <div class='video_info'>
                                    <h2 class='title'>${item.snippet.title}</h2>
                                    <p class='description'>${item.snippet.description}</p>
                                    <span>view</span>
                                </div>
                            </div>
                        </div>
                    </a>
                    `;
                    $('#result-list').append(itemLink);
                    
        //add scroll event
                    $(window).on('scroll', () => {
                        if($(document).height() - $(window).height() - $(window).scrollTop() < 200) {
                            if(!isLoading) {
                                isLoading = true;
                                $('#spinner').removeClass('d-none');
                                $('#spinner').addClass('d-flex');
                                $.ajax({
                                    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=chipu&type=video&key=AIzaSyA9gQZ-oYomFypZN7PsupZJtOfQqA6Q3qw&pageToken=${nextPageToken}`,
                                    type: 'GET',
                                    success: (response) => {
                                        $('#spinner').removeClass('d-flex');
                                        $('#spinner').addClass('d-none');
                                        response.items.forEach((item) => {
                                            const itemLink = `
                                            <a class="result col-md-12" href='https://www.youtube.com/watch?v=${item.id.videoId}' targer='_blank'>
                                                <div class='row'>
                                                    <div class='col-4'>
                                                        <img src='${item.snippet.thumbnails.medium.url}' alt='not found'>
                                                        </div>
                                                    <div class='col-8'>
                                                        <div class='video_info'>
                                                            <h2 class='title'>${item.snippet.title}</h2>
                                                            <p class='description'>${item.snippet.description}</p>
                                                            <span>view</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                            `;
                                            $('#result-list').append(itemLink);
                                            isLoading = false;
                                    });
                                    },
                                    error: (_xhr, _statusCode, error) => {
                                        console.log(error);
                                    },
                                });
                            }
                        }
                    })
                })
            };
            },
            error: (_xhr, _statusCode, error) => {
                console.log(error);
            }
        })
        }, 1000);
    });
});