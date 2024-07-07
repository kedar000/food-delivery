import { Prisma, PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


import { Hono } from 'hono'
import { sign } from 'hono/jwt';

export const userRoute = new Hono<{
    Bindings : {
        DATABASE_URL : string
        JWT_SECRET : string
    }
}>();

userRoute.post('/signup' , async( c ) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const user = await prisma.user.create({
        data :{
            mail : body.mail,
            password : body.password,
            firstname : body.firstname

        }
    })

    
    let token: any;
    try {
        
        token = await sign({id : user.userId} , c.env.JWT_SECRET);

    } catch (error) {
        console.log(error);
        
    }

    return c.json({token : token});
})


userRoute.post('/signin' , async( c )=>{

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()

    const user = await prisma.user.findUnique({
        where : {
            mail : body.mail,
            password : body.password
        }
    })

    if(!user){
        c.status(401)
        return c.json({mssg : "user not found"})
    }
    
    try {
        
        const token = await sign({id : user.userId} , c.env.JWT_SECRET);
        return c.json({token : token})

    } catch (error) {
        console.log(error)
        return c.json({mmsg : "error in the token "})
    }


    
})
