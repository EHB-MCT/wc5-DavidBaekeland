"use strict";

const messageSystem = {
  startFetching() {
    setInterval(() => {
      this.fetchMessages();
    }, 10);
  },

  sendMessage(msg) {
    // __TOKEN__ POST
    fetch("https://thecrew.cc/api/message/create.php?token=" +userSystem.token, {
      method: 'post',
      body: JSON.stringify({
        "message": msg
      })
      .then(response => response.json())
      .then(data =>{
        this.fetchMessages();
      })
    });
  },

  fetchMessages() {
    // geen Get
    fetch("https://thecrew.cc/api/message/read.php?token="+userSystem.token)
      .then(response => response.json())
      .then(data  => {
        // data.sort(function(a,b) {
        //   return b.ID-a.ID;
        // });
        data.sort((a,b)  => b.ID-a.ID);
        const container  =  document.getElementById("output");
        container.innerHTML =  "";
        data.forEach((test) => {
          const message  =  `<div class="message">
          <span class="by">${test.handle}</span>
          <span class="on">${test.created_at}</span>
          <p>${test.message}</p>
        </div>`;
        container.insertAdjacentHTML("beforeend", message);
        });
      });
  }
};

const userSystem = {
  token: "",
  loggedIn: false,

  checkToken()  {
    const localToken = this.getToken();
    const login = document.getElementById("loginWindow");
    if(localToken  !==  null)  {
      this.token  =  localToken;
      messageSystem.fetchMessages();
      login.style.display  =  "none";
    }
  },

  saveToken() {
    localStorage.setItem("token", this.token);
  },

  getToken() {
    return localStorage.getItem("token");
    //location.reload();
  },

  logout() { 
    localStorage.removeItem("token");
  },

  login(email, password) {
    // https://thecrew.cc/api/user/login.php POST
    fetch("https://thecrew.cc/api/user/login.php", {
      method: 'post',
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(response => response.json())
    .then(loginData =>  {
      this.token = loginData.token;
      console.log(this.token);
      messageSystem.startMessages();
      this.saveToken();
      if(this.token  !==  undefined)  {
        const login = document.getElementById("loginWindow");
        login.style.display  =  "none";
      }
    });

  },

  updateUser(password, handle) {
    // https://thecrew.cc/api/user/update.php?token=__TOKEN__ POST
  }
};

const display = {
  initFields() {
    let loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (e) =>  {
      e.preventDefault();
      const email = document.getElementById("emailField").value;
      const password = document.getElementById("passwordField").value;
      userSystem.login(email, password);
    });
    
    let messageForm = document.getElementById("messageForm");
    messageForm.addEventListener("submit", (e) =>  {
      e.preventDefault();
      const msg = document.getElementById("messageField").value;
      messageSystem.sendMessage(msg);
      //msg.value = ""
    });

    let logoutBtn = document.getElementById("options");
    logoutBtn.addEventListener("click", (e) =>  {
      userSystem.logout();
      document.getElementById("loginWindow").style.display  =  "block";
    });
  }
};

  display.initFields();
  userSystem.checkToken();