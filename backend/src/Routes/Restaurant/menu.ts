import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


import { Hono } from 'hono'
import { use } from 'hono/jsx';
import { verify } from 'hono/jwt';
// import { string } from 'zod';


export const menuRoute = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_SECRET : string
    },
    Variables :{
        restId : string
    }
}>();

menuRoute.use('/*' , async(c , next)=>{
    const token = c.req.header("authorization") || ""
    // console.log(token);
    
    const rest = await verify(token , c.env.JWT_SECRET);
    // console.log(rest);
    
    // console.log(rest.restId);
    
    if(rest && typeof rest.id === 'string'){
        c.set("restId" , rest.id);
        await next()
    }else{
        return c.json({mssg : "login please"})
    }
    
})

menuRoute.post('/add' , async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const restId = c.get("restId")
    try {
        const item = await prisma.menu.create({
            data : {
                restId : restId,
                itemname : body.itemname,
                type : body.type
            }
        })
        return c.json({mssg : "item added to the menu successfully"})
    } catch (error) {
        c.status(404)
        // console.log(error);
        
        return c.json({mssg : "your not yet logged in !"})
    }
})

