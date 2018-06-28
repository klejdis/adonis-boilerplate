
const Route = use("Route");
const {RouteHelpers} = use("App/Helpers/Helpers");


let backendUsers = Route.group(() => {


    Route.get("/users" , "UsersController.index")
        .as("admin.users");

    Route.post("/users/create" , "UsersController.create")
        .as("admin.users.create");

});

RouteHelpers.addNamespaceToGroup(backendUsers,"Backend");
RouteHelpers.addPrefixToGroup(backendUsers,"admin");