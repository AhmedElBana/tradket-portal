class AppConfig {

    getServerUrl() {
        //return "https://tradket.com";
        return "http://localhost:3001";
    }
}

export let appConfig = new AppConfig();
