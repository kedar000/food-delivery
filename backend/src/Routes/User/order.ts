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

    if(auth == ""){
        return c.json({mssg :"please login"})
    }

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

//get all the orders 
orderRoute.get('/yourorders' , async ( c )=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const userId = c.get("userId")

    const yourorders = await prisma.order.findMany({
        where : {
            userId : userId
        }
    })
    if(!yourorders){
        return c.json({mssg : "not ordered anything yet"})
    }
    console.log(yourorders);
    return c.json({mssg : "successfully fetched the ordered"})
    
})

// adding the refund 
orderRoute.post("/refund" , async( c )=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();
    try {

        const order = await prisma.order.findUnique({
            where : {
                orderId : body.orderId
            }
        })

        console.log(order);
        
        if(!order){
            c.status(402);
            return c.json({mssg : "order not found"})
        }
        if(order.refund){
            c.status(403);
            return c.json({mssg : "this order is already refunded "})
        }
        if(order.items == null){
            c.status(404);
            return c.json({mssg : " there is no items in your order"})
        }

        order.refund = true;
        const refund = await prisma.refund.create({
            data : {
                userId: order.userId,
                orderId: order.orderId,
                restId: order.restId,
                
                isAvailable: true,
                item: order.items // check before if item exist or not 

            }
        })

        const orderUpdated = await prisma.order.update({
            where : {
                orderId : order.orderId
            },
            data : {
                refund : true
            }
        })
        console.log(orderUpdated);
        console.log(refund);
        

        return c.json({refund : refund , updatedOrder : orderUpdated})
    } catch (error) {
            c.status(404);
            return c.json({error : error})
    }

    
})

// getting all the refund 

orderRoute.get('/yourrefunds' , async ( c )=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const userId = c.get("userId")

    const yourrefunds = await prisma.refund.findMany({
        where : {
            userId : userId
        }
    })
    if(!yourrefunds){
        return c.json({mssg : "no refunds "})
    }
    console.log(yourrefunds);
    return c.json({mssg : "successfully fetched the refund "})
    
})