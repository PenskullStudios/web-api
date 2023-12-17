import express, { Application, Request, Response } from "express";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import {
  ClerkExpressRequireAuth,
  RequireAuthProp,
  StrictAuthProp,
} from "@clerk/clerk-sdk-node";

const app: Application = express();
app.use(cors());
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}

app.get("/", (req: Request, res: Response) => {
  res.send("API is up and running");
});

app.get(
  "/employee-workinghours",
  ClerkExpressRequireAuth(),
  async (req: RequireAuthProp<Request>, res: Response) => {
    try {
      const employee = await prisma.employee.findMany({
        select: {
          name: true,
          workingHours: true,
        },
      });
      res.send(employee).status(200);
    } catch (error) {
      console.error(error);
      res.send("Unable to fetch data from the Database").status(500);
    }
  }
);

//@ts-ignore
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthenticated!");
});

app.listen(port, () => {
  console.log(`[info]: Server is running at port ${port}`);
});
