require("dotenv").config();

import express, { Application } from "express";

const mount = async (app: Application) => {
  app.listen(process.env.PORT);
  console.log(`[app] : http://localhost:${process.env.PORT}`);
}

mount(express());