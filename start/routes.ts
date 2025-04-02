/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import ProfilesController from '#controllers/profiles_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import RanksController from '#controllers/ranks_controller'
import OrdersController from '#controllers/orders_controller'

const ranksRoutes = () => {
    router.get('/', [RanksController, 'index'])
}

const profilesRoutes = () => {
    router.post('/', [ProfilesController, 'store'])
    router.get('/:id', [ProfilesController, 'show']).where('id', router.matchers.number())
    router.put('/', [ProfilesController, 'update']).use(middleware.profilekeyValidation())
}

const orderRoutes = () => {
    router.post('/', [OrdersController, 'store']).use(middleware.profilekeyValidation())
    router.post('/notify', [OrdersController, 'notify'])
}

const apiRoutes = () => {
    router.group(profilesRoutes).prefix('/profiles')
    router.group(ranksRoutes).prefix('/ranks')
    router.group(orderRoutes).prefix('/orders')
}

router.group(apiRoutes).prefix('/api')
