import e, { Router } from "express";
//import { getUsers, getUserInfo} from "./handlers/users";
import { authorize } from "../middleware/authorization";
import { getLogin, githubLogin, login } from "./handlers/login";
import { signup,getSignup } from "./handlers/signup";
import { addUserToObject, createObject, deleteObject, getObject, removeUserFromObject, updateObject } from "./handlers/object";
import { authentication } from "../middleware/authentication";
import { dbBeginTransaction, dbCommitTransaction, dbQuery } from "../db/db";
import { githubCallback } from "./handlers/callback";


const router = Router();
router.get("/auth/github", githubLogin);
router.get("/auth/login",getLogin);
router.get("/auth/signup",getSignup);
router.post("/login",login);
router.post("/signup",signup);
router.get('/auth/callback',githubCallback);

//Object routes
router.put("/:object/update",authentication(),authorize('update'),updateObject);
router.get("/:object/read",authentication(),authorize('read'),getObject);
router.delete("/:object/delete",authentication(),authorize('delete'),deleteObject);
router.post("/:object/add",authentication(),authorize('add'),addUserToObject);
router.delete("/:object/remove",authentication(),authorize('remove'),removeUserFromObject);
router.post("/create-object",authentication(),createObject);
//user routes
//router.get("/user/:username",authorize('read'),getUserInfo);
//router.get("/user",authorize('delete'),getUserInfo);
    //all permissions
//router.get("/user/permissions",getUserInfo);
    //specific object permissions
//router.get("/user/permissions/:object",getUserInfo);


router.get('/status', (req, res) => {
    const messages = [
      "I am speed. This API is faster than Lightning McQueen!",
      "It's LEGEN... wait for it... DARY! API is running!",
      "Ka-chow! The API is running like a champ.",
      "The API is always there for you, just like Barney's suit."
    ]
      res.status(200).send({message:messages[Math.floor(Math.random() * messages.length)]});
  });

router.get('/statusdb', async(req, res) => {
  const query = `select * from permissions where name = 'read'`;
  try {
    console.log('statusdb');
    const client = await dbBeginTransaction();
    console.log('statusdbdd');
    const result = await dbQuery(query,client);

    await dbCommitTransaction(client);
    if (result.rowCount === 0) {
      return res.status(404).send({error: 'Semitop'});
    }else{
      return res.status(200).send({error: 'TOP'});
    }

  }catch (error) {
    console.log(error);
    return res.status(500).send({error: 'Internal Server Error'});
  }
 
  
});

export default router;