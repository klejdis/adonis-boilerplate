const View = use("View");


RouteHelpers = {};

/**
 * Add Namespace To The Given Route Group
 * @param {*} group 
 * @param {*} namespace 
 */
RouteHelpers.addNamespaceToGroup = (group,namespace) => {
    if(namespace !== undefined){
        group.namespace(namespace);
        return group;
    }
    return group;
};

/**
 * Add Prefix To The Given Route Group
 * @param {*} group 
 * @param {*} prefix 
 */
RouteHelpers.addPrefixToGroup =  (group,prefix) => {
    group.prefix(prefix || "admin");
    return group;
};
  

module.exports.RouteHelpers = RouteHelpers;


/**
 * 
 * View Global Helpers
 */
View.global("modalAnchor", function ({title , url , large}) {
    

    let tpl = `<button class="btn btn-sm btn-outline-secondary" data-toggle="ajax-modal" data-title="${title || ""}" data-action-url="${url || ""}" 
    data-modal-lg="${large || ""}"
    >  
    <i class="fa fa-plus-circle" aria-hidden="true"></i> 
        Create
    </button>`;


    return tpl;

});





