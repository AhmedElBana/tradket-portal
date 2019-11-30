class Auth {
    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('userData')

        window.location.reload();
    }

    isLoggedIn() {
        return !!localStorage.token || !!localStorage.userData;
    }

    getMerchantName(){
        if (localStorage.name) {
            return localStorage.name;
        }
        return null;
    }
    getMerchantType(){
        if (localStorage.type) {
            return localStorage.type;
        }
        return null;
    }
    getMerchantToken() {
        if (localStorage.token) {
            return localStorage.token;
        }
        return null;
    }
    getMerchantPerms(){
        if (localStorage.perms) {
            return localStorage.perms;
        }
        return null;
    }
}

export let auth = new Auth();
