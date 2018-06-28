'use strict'

const View = use('View')
const User = use('App/Models/User')
const { validate } = use('Validator')

class AuthController {

    async login({ request , response , view , auth }){
        return view.render('backend.auth.login');
    }

    async authenticate({ request , response , auth , session }){

        const {email , password , remember} = request.all();
    
        await auth.remember(remember).attempt(email, password);
        return response.route('admin.dashboard');
    }


    async logout({ request , response , auth , route }){
        await auth.logout()
        return response.route('admin.auth.login')
    }

}

module.exports = AuthController
