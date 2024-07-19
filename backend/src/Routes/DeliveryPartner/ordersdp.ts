import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { verify } from 'hono/jwt';
import { orderRoute } from '../User/order';

export const OrdersDpRoutes = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables : {
        deliveryPartnerId : string
    }
}>();

OrdersDpRoutes.use('/*' , async ( c , next)=>{

    const auth = c.req.header("authorization") || "";

    if(!auth){
        c.status(404);
        return c.json({mssg : "please login"})
    }

    if(auth == ""){
        c.status(404);
        return c.json({mssg : "invalid token please login"});
    }

    const token = await verify(auth , c.env.JWT_SECRET);
    if(token && typeof token.id === "string"){
        console.log(token);
        c.set("deliveryPartnerId" , token.id);
        await next()
    }else{
        c.status(404);
        return c.json({mssg : "not yet logged in"})
    }
})

OrdersDpRoutes.post('/edit',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const userId = c.get("deliveryPartnerId");
    
    try {
        const user = await prisma.deliveryPartner.update({
            where :{
                deliveryPartnerId : userId
            },
            data : {
                
                name: body.name,
                mail: body.mail,
                password: body.password,
                address: body.address,
                age: body.age,
                mobilenumber: body.mobilenumber
            } 
        })

        return c.json(user);
    } catch (error) {
        return c.json({error})
    }
   
} )


// checkpoint - 
// try implement how to send the cart details to dp if dp accepts senf them to rest 
OrdersDpRoutes.get("/upcomingorders" , async ( c )=>{

})