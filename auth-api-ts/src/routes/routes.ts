import { Router } from "express";
import { getUsers, getUserInfo} from "./handlers/users";
import { authorize } from "../middleware/authorization";
import { login } from "./handlers/login";
import { signup } from "./handlers/signup";
import { getObject } from "./handlers/object";
import { authentication } from "../middleware/authentication";


const router = Router();

router.post("/login",login);
router.post("/signup",signup);

//Object routes

router.get("/:object/read",authentication(),authorize('read'),getObject);

//user routes
router.get("/user/:username",authorize('read'),getUserInfo);
router.get("/user",authorize('delete'),getUserInfo);
    //all permissions
router.get("/user/permissions",getUserInfo);
    //specific object permissions
router.get("/user/permissions/:object",getUserInfo);


router.get('/status', (req, res) => {
    const messages = [
      "I am speed. This API is faster than Lightning McQueen!",
      "It's LEGEN... wait for it... DARY! API is running!",
      "Ka-chow! The API is running like a champ.",
      "The API is always there for you, just like Barney's suit."
    ]
      res.send(messages[Math.floor(Math.random() * messages.length)]);
  });

export default router;