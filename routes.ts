import { Router, Request, Response } from "express";
import { Item } from "./items";
// hard coded data
let itemArray: Item[] = [
  { id: 1, quantity: 20, price: 10, product: "Eggs", isActive: true },
  { id: 2, quantity: 5, price: 15, product: "Quinoa", isActive: true },
  { id: 3, quantity: 2, price: 20.75, product: "Steak", isActive: true },
  { id: 4, quantity: 2000, price: 1.2, product: "Gum", isActive: true },
];

export const itemRouter = Router();

itemRouter.get("/", async (req: Request, res: Response): Promise<Response> => {
  if (req.query.maxPrice !== undefined) {
    let underArray = itemArray.filter(
      (x) => x.price <= Number(req.query.maxPrice) && x.isActive
    );
    return res.status(200).json(underArray);
  }
  //prefix is the parameter
  else if (req.query.prefix !== undefined) {
    let startsWithArray = itemArray.filter(
      (x) => x.product.startsWith(String(req.query.prefix)) && x.isActive
    );
    return res.status(200).json(startsWithArray);
  } else if (req.query.pageSize !== undefined) {
    return res
      .status(200)
      .json(
        itemArray.filter((x) => x.isActive).slice(0, Number(req.query.pageSize))
      );
  } else {
    return res.status(200).json(itemArray.filter((x) => x.isActive));
  }
});

//uri parameter
itemRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<Response> => {
    let itemIWantToFind = itemArray.find((x) => x.id === Number(req.params.id));
    if (itemIWantToFind === undefined) {
      return res.status(404).send("ID not found");
    } else {
      return res.status(200).json(itemIWantToFind);
    }
  }
);

itemRouter.post("/", async (req: Request, res: Response): Promise<Response> => {
  let newItem: Item = {
    id: GetNextId(),
    product: String(req.body.product),
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    isActive: true,
  };
  itemArray.push(newItem);

  return res.status(201).json(newItem);

  function GetNextId() {
    //...spread operator
    return Math.max(...itemArray.map((x) => x.id)) + 1;
  }
});

itemRouter.put(
  "/:id",
  async (req: Request, res: Response): Promise<Response> => {
    //find the items by the id
    let itemFound = itemArray.find((x) => x.id === Number(req.params.id));

    //update the properties of the item based on what is sent in teh body of the request

    if (itemFound !== undefined) {
      itemFound.price = Number(req.body.price);
      itemFound.product = String(req.body.product);
      itemFound.quantity = Number(req.body.quantity);
      //return a status of 200, with the updated item in json format
      return res.status(200).json(itemFound);
    } else {
      return res.status(404).send("Hey I didn't find it");
    }
  }
);
// //hard delete
// itemRouter.delete(
//   "/:id",
//   async (req: Request, res: Response): Promise<Response> => {
//     //find the items by the id
//     let itemFound2 = itemArray.find((x) => x.id === Number(req.params.id));
//     if (itemFound2 !== undefined) {
//       itemArray.splice(itemFound2.id - 1, 1);
//       return res.status(204).send("Item was deleted");
//     } else {
//       return res.status(404).send("Hey I didn't find it");
//     }
//   }
// );
//soft delete
itemRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<Response> => {
    let itemFound = itemArray.find((x) => x.id === Number(req.params.id));

    if (itemFound == undefined) {
      return res.status(404).send("who dat?");
    } else {
      //   itemArray = itemArray.filter((x) => x.id !== Number(req.params.id));
      itemFound.isActive = false;
      console.log(itemArray);
      return res.status(204).send("Deleted");
    }
  }
);
