import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


import { Hono } from 'hono'
import { sign } from 'hono/jwt';

export const deliveryPartnerRoute = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_SECRET : string
    }
}>();

deliveryPartnerRoute.post('/signup' , async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const dp = await prisma.deliveryPartner.create({
        data : {
            mail : body.mail,
            password : body.password ,
            name : body.name
        }
    })

    const token = await sign({id : dp.deliveryPartnerId} , c.env.JWT_SECRET);

    return c.json({token : token})
})

deliveryPartnerRoute.post('/signin' , async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const dp = await prisma.deliveryPartner.findUnique({
        where : {
            mail : body.mail,
            password : body.password
        }
    })

    if(!dp){
        c.status(402);
        return c.json({mssg : "user not found "})
    }

    const token = await sign({id : dp.deliveryPartnerId} , c.env.JWT_SECRET)
    return c.json({token : token})
})

