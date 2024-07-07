import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


import { Hono } from 'hono'
import { sign } from 'hono/jwt';


export const restaurantRoute = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_SECRET : string
    }
}>();

restaurantRoute.post('/signup' , async ( c )=>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
       
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const restaurant = await prisma.restaurant.create({
        data : {
            mail : body.mail,
            password : body.password,
            ownername : body.ownername

        }
    })

    const token = await sign({id : restaurant.restId} , c.env.JWT_SECRET);

    return c.json({token : token});


})


restaurantRoute.post('/signin' , async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const restaurant = await prisma.restaurant.findUnique({
        where : {
            mail : body.mail,
            password : body.password
        }
    })

    if(!restaurant){
        c.status(402)
        return c.json({mssg : "user not found"})
    }

    const token = await sign({id : restaurant.restId} , c.env.JWT_SECRET)

    return c.json({token : token});
})