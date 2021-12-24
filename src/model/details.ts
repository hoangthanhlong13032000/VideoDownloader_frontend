import Stats from "./stats";
import Thumbnail from "./thumbnail";

export default class Details {
  id: string;
  title: string;
  lengthInSeconds: string;
  href: string;
  channel: {
    id: string;
    title: string;
    url: string;
    avatar: {
      large: string;
      medium: string;
      thumb: string;
    };
  };
  description: string;
  thumbnails: Array<Thumbnail>;
  stats: Stats;
}
