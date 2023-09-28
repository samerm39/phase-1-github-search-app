document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#github-form');
    const userList = document.querySelector('#user-list');
    const reposList = document.querySelector('#repos-list');
    const toggleButton = document.createElement('button');
    let searchType = 'users';
  
    toggleButton.textContent = 'Toggle Search Type';
    form.appendChild(toggleButton);
  
    // Event listener for toggling between user and repo search
    toggleButton.addEventListener('click', () => {
      searchType = searchType === 'users' ? 'repos' : 'users';
      toggleButton.textContent = `Search ${searchType === 'users' ? 'Users' : 'Repos'}`;
      form.search.placeholder = `Search GitHub ${searchType}`;
    });
  
    // Event listener for form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchValue = e.target.search.value;
      userList.innerHTML = '';
      reposList.innerHTML = '';
      let apiUrl;
  
      if (searchType === 'users') {
        apiUrl = `https://api.github.com/search/users?q=${searchValue}`;
      } else {
        apiUrl = `https://api.github.com/search/repositories?q=${searchValue}`;
      }
  
      // Fetch data and update the UI
      fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (searchType === 'users') {
            data.items.forEach((user) => {
              const li = document.createElement('li');
              li.innerHTML = `
                <img src='${user.avatar_url}' alt='${user.login}' width='100' height='100'>
                <a href='${user.html_url}' target='_blank'>${user.login}</a>
              `;
              userList.appendChild(li);
            });
          } else {
            data.items.forEach((repo) => {
              const li = document.createElement('li');
              li.innerHTML = `
                <a href='${repo.html_url}' target='_blank'>${repo.name}</a>
              `;
              reposList.appendChild(li);
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  
    // Event listener for clicking on user links
    userList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const username = e.target.textContent;
        reposList.innerHTML = '';
  
        // Fetch user repositories
        fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        })
          .then((response) => response.json())
          .then((repos) => {
            repos.forEach((repo) => {
              const li = document.createElement('li');
              li.innerHTML = `
                <a href='${repo.html_url}' target='_blank'>${repo.name}</a>
              `;
              reposList.appendChild(li);
            });
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    });
  });
  