window.addEventListener('scroll', function () {
    const containerBar = document.querySelector('.container');
    const inputBar = document.querySelector('.inputSearch');
    const btnBar = document.querySelector('.btnSearch');
    if (this.scrollY > 95) {
        containerBar.classList.add('sticky')
        inputBar.classList.add('inputSticky')
        btnBar.classList.add('btnSticky')
    } else {
        containerBar.classList.remove('sticky')
        inputBar.classList.remove('inputSticky')
        btnBar.classList.remove('btnSticky')
    }
});




// Rest API
// API VANILLA JS FETCH
const btnSearch = document.querySelector('.btnSearch')
btnSearch.addEventListener('click', function () {
    const inputKeyword = document.querySelector('.inputSearch');
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "token 204da954682dd595b0359853268ea49bf06d3db6");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch('https://api.github.com/search/users?q=' + inputKeyword.value, requestOptions)
        .then(response => response.json())
        .then(response => {
            const user = response.items;

            // jika not found
            const alert = `<p>${inputKeyword.value} Not Found !</p>`;
            const btnAlert = document.querySelector('.error');
            if (response.total_count == 0) {
                btnAlert.innerHTML = alert;

            } else {
                btnAlert.textContent = '';
            }

            let cards = '';
            user.forEach(m => cards += showUser(m));

            const listCard = document.querySelector('.listCard');
            listCard.innerHTML = cards;


            // Detail Movie
            const btnDetail = document.querySelectorAll('.btnDetail');
            btnDetail.forEach(btn => {
                btn.addEventListener('click', function () {
                    const login = this.dataset.login;
                    fetch('https://api.github.com/users/' + login, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            const cardDetail = showUserDetail(result);
                            const modalBody = document.querySelector('.modal-body');
                            modalBody.innerHTML = cardDetail;

                        });

                    const modal = document.querySelector(btn.dataset.modalTarget)
                    openModal(modal);

                });
            });

            // Modal
            // const btnDetails = document.querySelectorAll('[data-modal-target]');
            const closeButton = document.querySelectorAll('[data-close-button]');
            const overlay = document.getElementById('overlay');

            overlay.addEventListener('click', () => {
                const modal = document.querySelectorAll('.modal.active');
                modal.forEach(modal => {
                    closeModal(modal);
                });
            });

            closeButton.forEach(button => {
                button.addEventListener('click', () => {
                    const modal = button.closest('.modal')
                    closeModal(modal);
                })
            });

            function openModal(modal) {
                if (modal == null) return
                modal.classList.add('active')
                overlay.classList.add('active')
            }

            function closeModal(modal) {
                if (modal == null) return
                modal.classList.remove('active')
                overlay.classList.remove('active')
            }

            // Followers
            const btnFollow = document.querySelectorAll('[data-modal-follow]')

            btnFollow.forEach(button => {
                button.addEventListener('click', function () {
                    const login = this.dataset.login;
                    const follow = this.innerHTML.toLowerCase();
                    const titleF = document.querySelector('.modal-headerF .title');
                    titleF.innerHTML = `${follow} me`;
                    fetch('https://api.github.com/users/' + login + '/' + follow, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            let cardFollow = '';
                            result.forEach(m => {
                                cardFollow += showListFollow(m)
                            });

                            const modalBodyF = document.querySelector('.modal-bodyF');
                            modalBodyF.innerHTML = cardFollow;

                        })

                    const modal = document.querySelector(button.dataset.modalFollow)
                    openModalFollow(modal);
                })
            });

            overlay.addEventListener('click', () => {
                const modal = document.querySelectorAll('.modalFollow.active');
                modal.forEach(modal => {
                    closeModalFollow(modal);
                });
            });

            closeButton.forEach(button => {
                button.addEventListener('click', () => {
                    const modal = button.closest('.modalFollow')
                    closeModalFollow(modal);
                })
            });

            function openModalFollow(modal) {
                if (modal == null) return
                modal.classList.add('active')
                overlay.classList.add('active')
            }

            function closeModalFollow(modal) {
                if (modal == null) return
                modal.classList.remove('active')
                overlay.classList.remove('active')
            }




        })
        .catch(response => {
            const alert = `<p>${response}</p>`;
            const btnAlert = document.querySelector('.error');
            btnAlert.innerHTML = alert;
        })
})

function showUser(m) {
    return `<div class="card">
                <div class="header">
                    <img src="${m.avatar_url}" class="image">
                </div>
                <div class="content">
                    <p class="name">${m.login}</p>
                    <section class="follow">
                        <button class="followers" data-modal-follow="#modalFollow" data-login="${m.login}">Followers</button>
                        <button class="following" data-modal-follow="#modalFollow" data-login="${m.login}">Following</button>
                    </section>
                    <button class="btnDetail" data-modal-target="#modal" data-login="${m.login}">Details</button>
                </div>
            </div>`;
}

function showListFollow(m) {
    return `<div class="cardFollow">
                    <img src="${m.avatar_url}" class="imageFollow">
                    <p class="name">${m.login}</p>
            </div>`;
}

function showUserDetail(m) {
    return `<img src="${m.avatar_url}" class="imgDetail"/>
            <div class="content">
                <ul>
                    <li>
                        <h3 class="nameDetail">${(m.name == null) ? m.login : m.name}</h3>
                    </li>
                    <li class="followDetail">
                        <p class="followersDetail">Followers : ${m.followers}</p>
                        <p class="followersDetail">Following : ${m.following}</p>
                    </li>
                    <li>
                        <p class="locationDetail">Location : ${(m.location) ? m.location : '-'}</p>
                    </li>
                    <li>
                        <p class="companyDetail">Company : ${(m.company) ? m.company : '-'}</p>
                    </li>
                    <li>
                        <p class="reposDetail">Repositories : ${m.public_repos}</p>
                    </li>
                    <li>
                        <p class="createDetail">Created at : ${m.created_at}</p>
                    </li>
                    <li>
                        <p class="createDetail">Updated at : ${m.updated_at}</p>
                    </li>
                    <li class="linkGithub">
                        <a href="${m.html_url}">LINK GITHUB</a>
                    </li>
                </ul>
            </div>
            `;

}

