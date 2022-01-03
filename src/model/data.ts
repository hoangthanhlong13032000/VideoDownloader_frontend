import Media from "./media";
import Details from "./details";

export default class Data {
    status: number;
    videos: Array<Media>;
    video_only: Array<Media>;
    audio_only: Array<Media>;
    recommends: Array<Details>;
    details: Details
}