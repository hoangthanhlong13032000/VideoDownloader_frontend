export default class YoutubeVideo {
  url: string = "";
  height?: number = 0;
  width?: number = 0;
  qualityLabel: string = "";
  hasVideo: boolean = false;
  hasAudio: boolean = false;
  constructor() {
    this.url = "";
    this.height = 0;
    this.width = 0;
    this.qualityLabel = "";
  }
}
