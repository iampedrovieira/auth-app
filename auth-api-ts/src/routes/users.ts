import { Router } from "express";
import { getUsers, getUserInfo} from "./handlers/users";
import { authorize } from "../middleware/authorization";


const router = Router();

router.get("/",getUsers);  

router.get("/info/:token",getUserInfo);  

router.get("/info2/:token",getUserInfo);  

export default router;
