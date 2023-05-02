document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const searchTerm = e.target.search.value;
        searchType === 'user' ? searchUsers(searchTerm) : searchRepos(searchTerm);
        form.reset();
    });

    const toggleButton = document.getElementById("toggle-search");
    toggleButton.addEventListener("click", () => {
        toggleSearchType();
    });
})

let searchType = "user";

function toggleSearchType() {
    searchType = searchType === "user" ? "repo" : "user";
}

function searchUsers(searchTerm) {
    fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        displayUsers(data.items);
      });
}

function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
        method: 'GET',
        headers: {
            Accept: 'application/vnd.github.v3+json',
        },
    })
        .then(res => res.json())
        .then(repos => {
            displayRepos(repos);
        });
}

function searchRepos(searchTerm) {
    fetch(`https://api.github.com/search/repositories?q=${searchTerm}`, {
        method: "GET",
        headers: {
            Accept: "application/vnd.github.v3+json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            displayRepos(data.items, true);
        });
}

function displayUsers(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="100" height="100">
          <h3>${user.login}</h3>
          <a href="${user.html_url}" target="_blank">${user.html_url}</a>
        `;

        li.addEventListener('click', () => {
            fetchUserRepos(user.login);
        });

        userList.appendChild(li);
    });
}

function displayRepos(repos, isRepoSearch = false) {
    const reposList = document.getElementById("repos-list");
    reposList.innerHTML = "";

    repos.forEach((repo) => {
        const li = document.createElement("li");
        li.innerHTML = `
    <h4>${repo.name}</h4>
    <a href="${repo.html_url}" target="_blank">${repo.html_url}</a>
    `;

        // Clear the user-list if the search is for repositories
        if (isRepoSearch) {
            document.getElementById("user-list").innerHTML = "";
        }

        reposList.appendChild(li);
    });
}