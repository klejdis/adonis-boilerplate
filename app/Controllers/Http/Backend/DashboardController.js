'use strict'

class DashboardController {
    
    async index({ request , response , view }){
        return view.render('backend.dashboard.index')
    }


}

module.exports = DashboardController
