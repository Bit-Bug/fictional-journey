import { DynamoDB } from "aws-sdk";
export const TABLE_NAME = process.env.TABLE_NAME;
export const PRIMARY_KEY = process.env.PRIMARY_KEY;
export const dbClient = new DynamoDB.DocumentClient();