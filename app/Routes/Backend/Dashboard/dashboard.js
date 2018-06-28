
const Route = use("Route");
const {RouteHelpers} = use("App/Helpers/Helpers");


let backendDashboard = Route.group(() => {


    Route.get("/dashboard" , "DashboardController.index")
        .as("admin.dashboard");

});

RouteHelpers.addNamespaceToGroup(backendDashboard,"Backend");
RouteHelpers.addPrefixToGroup(backendDashboard,"admin");