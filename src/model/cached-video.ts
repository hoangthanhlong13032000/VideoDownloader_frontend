import Data from "./data";

export default class CachedVideo {
  id: string;
  expire: number;
  data: Data;
}
