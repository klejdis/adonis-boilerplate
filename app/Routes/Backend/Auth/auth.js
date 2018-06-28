
const Route = use("Route");
const {RouteHelpers} = use("App/Helpers/Helpers");


let backendAuth = Route.group(() => {


    Route.get("/login" , "AuthController.login")
        .as("admin.auth.login");

    Route.post("/authenticate" , "AuthController.authenticate")
        .as("admin.auth.authenticate")
        .validator("Backend/Login");

    Route.get("/logout" , "AuthController.logout").as("admin.auth.logout");


});

RouteHelpers.addNamespaceToGroup(backendAuth,"Backend");
RouteHelpers.addPrefixToGroup(backendAuth,"admin");