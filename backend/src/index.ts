import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { Hono } from 'hono'
// import { sign , verify } from 'hono/jwt'
import { userRoute } from './Routes/User/User'
import { restaurantRoute } from './Routes/Restaurant/restaurant'
import { deliveryPartnerRoute } from './Routes/DeliveryPartner/deliveryPartner'
import { menuRoute } from './Routes/Restaurant/menu'
import { orderRoute } from './Routes/User/order'
import { OrdersDpRoutes } from './Routes/DeliveryPartner/ordersdp'


const app = new Hono<{
  Bindings : {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()

app.route('api/v1/user' , userRoute);
app.route('api/v1/user/cart' , orderRoute);
app.route('api/v1/restaurant' , restaurantRoute);
app.route('api/v1/restaurant/menu' , menuRoute);
app.route('api/v1/deliverypartner' , deliveryPartnerRoute);
app.route('api/v1/deliverypartner/info' , OrdersDpRoutes);
// app.route('api/v1/deliverypartner/info' , OrdersDpRoutes);

  
export default app
