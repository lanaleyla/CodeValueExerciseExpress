import { Request, Response, NextFunction, Router } from 'express';
import { Product } from '../models';
import uuidv1 from 'uuid/v1';
import products from "../products.json";

export const productArray: Product[]=products.Product; //list of products

//assign uniqe id's to the products list 
for (let i=0;i<productArray.length;i++)
{
  productArray[i].id=uuidv1();
}

const router = Router(); //our router

//Requests:get,post,put,delete
  
//return all products  
router.get('/products',(req, res, next) => {
    res.send(productArray);
});

//return specific product
router.get("/products/:id",(request,response,next)=>{
  const id = request.params.id;
  if(id.length>36) //check id lenght>36
  {
    response.sendStatus(400);
    return;
  }
  const matching = productArray.find(o => o.id === id); //id not found
  if (!matching)
  {
    response.sendStatus(404);
    return;
  }
  response.send(matching);
});

//add product to products list
router.post('/products/:name-:categoryId-:itemsInStock', (req, res) => {
  const product: Product=req.body;
  product.id = uuidv1();      //assign id
  if(req.params.name.length<3) //if products name length is less then 3 charachters 
  {
    res.sendStatus(409);
    return;
  }
  product.categoryId=req.params.categoryId; //assign new product
  product.name=req.params.name;
  product.itemsInStock=req.params.itemsInStock;
  productArray.push(product);
  res.status(201).send(product);
});

//update product
router.put('/products/:id/:name-:categoryId-:itemsInStock',findProjectIndex,(req, res) => {
  const product: Product = req.body;
  const id = req.params.id;
  const { productId, matchingIndex } = res.locals;
  const matching = productArray.find(o => o.id === id); //search id
  if (!matching) {
    res.sendStatus(404); //id not found
    return;
  }
  if(id.length>36) //check id lenght>=36
  {
    res.sendStatus(400);
    return;
  }
  if(req.params.name.length<3) //if products name length is less then 3 charachters 
  {
    res.sendStatus(409);
    return;
  }
  product.id=id; //assign updated product
  product.name = req.params.name
  product.categoryId = req.params.categoryId;
  product.itemsInStock = req.params.itemsInStock;
  productArray[matchingIndex]=product;
  res.send(product);
  },
);

//delete product by id
router.delete('/products/:id',findProjectIndex,(req, res) => {
  const id = req.params.id;
  if(id.length>36) //check id lenght>36
  {
    res.sendStatus(400);
    return;
  }
  productArray.splice(res.locals.matchingIndex, 1);
  res.sendStatus(204);
  },
);

//find the index in products array of the entered product id
function findProjectIndex(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id;
  const matchingIndex = productArray.findIndex(o => o.id === id);

  if (matchingIndex < 0) {
    res.sendStatus(404);
    return;
  }
  res.locals.matchingIndex = matchingIndex; //save index and id and return them
  res.locals.productId = id;
  next();
}

export { router };
