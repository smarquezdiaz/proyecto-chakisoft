
const BASE_URL = process.env.BASE_URL || 'https://trello.com/';
const HEADLESS = (process.env.HEADLESS || 'false').toLowerCase() === 'true';

module.exports = {
  BASE_URL,
  HEADLESS
};