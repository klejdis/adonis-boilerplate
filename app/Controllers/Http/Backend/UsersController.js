'use strict'

const User = use('App/Models/User')

class UsersController {
    
    async index({ request , response , view }){
        const page = 1
        const users = await User.query().paginate(page)

        return view.render('backend.users.index', {
            cartTitle : "Users",
            users: users.toJSON(),
        })
    }

    async create({ request , response, view}){

        return view.render('backend.users.create')
    }


}

module.exports = UsersController
