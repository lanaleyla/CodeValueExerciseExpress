import { Request, Response, NextFunction, Router } from 'express';
import { Category, Product } from '../models';
import uuidv1 from 'uuid/v1';
import categories from "../categories.json";
import {productArray} from "../routes/products";

const categoriesArray: Category[]=categories.Category; //list of categories

//assign uniqe id's to the products list 
for (let i=0;i<categoriesArray.length;i++)
{
    categoriesArray[i].id=uuidv1();
}

const router = Router(); //our router

//Requests:get,post,put,delete
  
//return all categories  
router.get('/categories', (req, res, next) => {
    res.send(categoriesArray);
});

//return specific category
router.get("/categories/:id",(req,res,next)=>{
    const id = req.params.id;
    if(id.length>36) //check id lenght>36
    {
      res.sendStatus(400);
      return;
    }
    const matching = categoriesArray.find(o => o.id === id); //id not found
    if (!matching)
    {
        res.sendStatus(404);
        return;
    }
    res.send(matching);
});

//return products list of a specific category
router.get("/categories/:id/products",(req,res,next)=>{
    const id = req.params.id;
    let productsAr:Product[]=[];
    if(id.length>36) //check id lenght>36
    {
      res.sendStatus(400);
      return;
    }
    const matching = categoriesArray.find(o => o.id === id); //id not found
    if (!matching) {
        res.sendStatus(404);
        return;
    }
    productsAr=findAllProducts(matching.name); //search for products
    if(productsAr.length<1)
    {
        res.sendStatus(404);
        return;
    }
    res.send(findAllProducts(matching.name));
});

//add category to categories list
router.post('/categories/:name', (req, res) => {
    const category: Category=req.body;
    category.id = uuidv1();         //assign id
    category.name=req.params.name; 
    categoriesArray.push(category); //assign new category
    res.status(201).send(category);
});

//update category by given id
router.put('/categories/:id/:name',findProjectIndex,(req, res) => {
    const category: Category = req.body;
    const id = req.params.id;
    const { categoryId, matchingIndex } = res.locals;
    const matching = categoriesArray.find(o => o.id === id); //search id
    if (!matching) {
        res.sendStatus(404); //id not found
        return;
    }
    if(id.length>36) //check id lenght>36
    {
        res.sendStatus(400);
        return;
    }
    category.id=id;
    category.name = req.params.name;
    categoriesArray[matchingIndex]=category; //assign updated category
    res.send(category);
    },
);

//delete category by id
router.delete('/categories/:id',findProjectIndex,(req, res) => {
    const id = req.params.id;
    if(id.length>36) //check id lenght>36
    {
        res.sendStatus(400);
        return;
    }
    categoriesArray.splice(res.locals.matchingIndex, 1);
    res.sendStatus(204);
    },
);

//find the index of the entered id
function findProjectIndex(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const matchingIndex = categoriesArray.findIndex(o => o.id === id);

    if (matchingIndex < 0) {
    res.sendStatus(404);
    return;
    }
    res.locals.matchingIndex = matchingIndex;
    res.locals.projectId = id;
    next();
}

//find products with the given category name, return products list
function findAllProducts(name:string):Product[]{
    const product:Product[]=[];

    for(let i=0;i<productArray.length;i++)
    {
        if(productArray[i].categoryId===name)
        {
            product.push(productArray[i]);
        }
    }
    return product;
}

export { router };
