import axios from "axios";
import { Config } from '../config/aws';

export default axios.create({
  baseURL:  Config.api_url,
  headers: {
    "Content-type": "application/json"
  }
});