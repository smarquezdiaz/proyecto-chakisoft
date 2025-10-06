import { config } from "dotenv";

config();

const BASE_URL = process.env.BASE_URL || 'https://trello.com/';
const HEADLESS = (process.env.HEADLESS || 'false').toLowerCase() === 'true';
const KEY = process.env.KEY;
const TOKEN = process.env.TOKEN;
const BASE_URL_API = process.env.BASE_URL_API || 'https://api.trello.com/1/';
const BOARD = process.env.BOARD_ENDPOINT;
const MEMBER = process.env.MEMBER_ENDPOINT;
const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;




module.exports = {
  BASE_URL,
  HEADLESS,
  KEY,
  TOKEN,
  BASE_URL_API,
  BOARD,
  MEMBER,
  USERNAME,
  PASSWORD
};