import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { Hono } from 'hono'
import { sign , verify } from 'hono/jwt'


const app = new Hono<{
  Bindings : {
    DATABASE_URL : string,
    JWT_SECRET : string
  }
}>()

app.post('/signup', async (c) => {

  const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  
   const body = await c.req.json();

  // c÷onst { success } = signupZodCheck.safeParse(body)
  
  // if(! success ){
  //   c.status(404)
  //   return c.json({mssg : "Invalid input"})
  // }
  const user = await prisma.user.create({
    data : {
     
    mail: body.mail,
    password: body.password,
    firstname: body.firstname,
    
    address: body.address,
    mobilenumber: body.mobilenumber,
    age: body.age,
    gender: body.gender,
    },
  })
  
  // const jwt = await sign({id : user.id} , c.env.JWT_SECRET)
  
    console.log("reached ");
    
    return c.json({mssg : "success"})
  })
  
export default app
