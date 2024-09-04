import { Router } from "express";
import { getUsers, getUserInfo} from "./handlers/users";


const router = Router();

router.get("/",getUsers);  

router.get("/info/:token",getUserInfo);  

export default router;
