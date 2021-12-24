export default class VideoPreview {
  id: string;
  lengthInText: string;
  title: string;
  publishedTime: string;
  href: string;
  thumbnails: {};
  channel: Channel;
}
class Channel {
  id: string;
  title: string;
  url: string;
  avatar: {
    thumb: string;
  };
}
