import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';


import { Hono } from 'hono'
import { sign } from 'hono/jwt';
import { string } from 'zod';


export const orderRoute = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_SECRET : string

    },
    Variables : {
        userId : string
    }

}>();

orderRoute.use('/*' , async( c , next)=>{
    const auth = c.req.header("authorization") || "";

    const order = await verify(auth , c.env.JWT_SECRET);
    console.log(order)
    if(order && typeof order.id === "string"){
        c.set("userId" , order.id);
        await next()
    }else{
        c.status(402);
        return c.json({mssg : "please login"});
    }
})

//store data in the database only after food is delivered if not store them in refund 
orderRoute.post('/add',async (c )=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const body = await c.req.json();
    try {
        
        const userId = c.get("userId")
        const order = await prisma.order.create({
            data : {
                userId : userId,
                restId : body.restId,
                items : body.items,
                partnerId : body.partnerId
            }
        })
        return c.json({mssg : "successfully inserted order", order : order})
        
    } catch (error) {
        console.log(error);
        c.status(404);
        return c.json({error : error});
    }
})