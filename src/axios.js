import axios from "axios";

const instance = axios.create({
  baseURL: "https://whatsapp-backend-imatoria.herokuapp.com/",
});

export default instance;
