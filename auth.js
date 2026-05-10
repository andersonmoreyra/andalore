(function(){
  window.Auth={
    login(email,password){if(email==='anderson@marvi.com'&&password==='admin123'){const user={nome:'Anderson Moreira',email,nivel:'Administrador'};localStorage.setItem(Storage.KEYS.SESSION,JSON.stringify(user));return user}return null},
    logout(){localStorage.removeItem(Storage.KEYS.SESSION)},
    current(){try{return JSON.parse(localStorage.getItem(Storage.KEYS.SESSION)||'null')}catch(e){return null}}
  };
})();
