import axios from "axios";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createWorker, Worker } from "tesseract.js";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

type LoggerResult = {
  workerId: string;
  jobId: string;
  status: string;
  progress: number;
};

type StageType = {
  "start_time": string,
  "end_time": string,
  "rule": {
    "key": string,
    "name": string
  },
  "stages": [
    {
      "id": number,
      "name": string,
      "image": string
    },
    {
      "id": number,
      "name": string,
      "image": string
    }
  ],
  "is_fest": boolean
}

const Index = () => {
  const [regularData, setRegularData] = useState<Array<StageType>>();
  const [bankaraOpenData, setBankaraOpenData] = useState<Array<StageType>>();
  const [bankaraChallengeData, setBankaraChallengeData] = useState<Array<StageType>>();
  const [image, setImage] = useState<string>("");
  const [createObjectURL, setCreateObjectURL] = useState<string>("");
  const [cropper, setCropper] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);

  const cropperRef = useRef<HTMLImageElement>(null);

  const worker = createWorker();

  // 画像のOCR処理
  const readImageText = async(imagedata:any) => {
    // setOcrState(STATUSES.PENDING)
    try {
      await worker.load()
      // OCRで読み取りたい言語を設定
      await worker.loadLanguage("jpn")
      await worker.initialize("jpn")
      const { data: { text } } = await worker.recognize(imagedata)
      // await worker.terminate()

      // 日本語テキストはスペースが入ってしまう可能性があるので、スペースを削除
      const strippedText = text.replace(/\s+/g, "")
      return strippedText
      // setOcrState(STATUSES.SUCCEEDED)
    } catch (err) {
      // setOcrState(STATUSES.FAILED)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const fetchedStageData = await (await axios.get("https://spla3.yuu26.com/api/schedule")).data.result;
      setRegularData(fetchedStageData["regular"]);
      setBankaraOpenData(fetchedStageData["bankara_open"]);
      setBankaraChallengeData(fetchedStageData["bankara_challenge"]);
    }
    fetchData();
  }, []);

  const uploadToClient = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];

    setImage(file);
    setCreateObjectURL(URL.createObjectURL(file));

    // const result = await recognize(file);
    // console.log(result);
    }
  };

  const getCropData = async (e:any) => {
    e.preventDefault();
    if (typeof cropper !== "undefined") {
      const imagedata = await cropper.getCroppedCanvas().toDataURL("image/jpeg");
      const result = await readImageText(imagedata);
      console.log(result);
    }
    return;
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <h1 className="text-center text-6xl my-8">スプラボ！</h1>
        <div className="grid grid-cols-1 md:grid-cols-6 mx-8">
        {regularData && bankaraOpenData && bankaraChallengeData ?
          <>
            <div className="col-span-1 flex flex-col justify-center items-center">
              <h2 className="text-2xl">レギュラーマッチ</h2>
              {regularData.map((data, idx) => {
                if (idx < 3) {
                  return (
                    <div key={`r${idx}`} className="border-2 p-2 my-2 flex flex-col justify-center items-center">
                      <p className="text-xl">{data.start_time.slice(11, 16)} - {data.end_time.slice(11, 16)}</p>
                      <p className="text-xl">{data.rule.name}</p>
                      <p>{data.stages[0].name}</p>
                      <Image src={data.stages[0].image} alt="レギュラーマッチステージ画像1" width={240} height={135} />
                      <p>{data.stages[1].name}</p>
                      <Image src={data.stages[1].image} alt="レギュラーマッチステージ画像2" width={240} height={135} />
                    </div>
                  )
                } else {
                  return null;
                }
              })}
            </div>
            <div className="col-span-1 flex flex-col justify-center items-center">
              <h2 className="text-2xl">バンカラマッチ（オープン）</h2>
              {bankaraOpenData.map((data, idx) => {
                if (idx < 3) {
                  return (
                    <div key={`bo${idx}`} className="border-2 p-2 my-2 flex flex-col justify-center items-center">
                      <p className="text-xl">{data.start_time.slice(11, 16)} - {data.end_time.slice(11, 16)}</p>
                      <p className="text-xl">{data.rule.name}</p>
                      <p>{data.stages[0].name}</p>
                      <Image src={data.stages[0].image} alt="レギュラーマッチステージ画像1" width={240} height={135} />
                      <p>{data.stages[1].name}</p>
                      <Image src={data.stages[1].image} alt="レギュラーマッチステージ画像2" width={240} height={135} />
                    </div>
                  )
                } else {
                  return null;
                }
              })}
            </div>
            <div className="col-span-1 flex flex-col justify-center items-center">
              <h2 className="text-2xl">バンカラマッチ（チャレンジ）</h2>
              {bankaraChallengeData.map((data, idx) => {
                if (idx < 3) {
                  return (
                    <div key={`bc${idx}`} className="border-2 p-2 my-2 flex flex-col justify-center items-center">
                      <p className="text-xl">{data.start_time.slice(11, 16)} - {data.end_time.slice(11, 16)}</p>
                      <p className="text-xl">{data.rule.name}</p>
                      <p>{data.stages[0].name}</p>
                      <Image src={data.stages[0].image} alt="レギュラーマッチステージ画像1" width={240} height={135} />
                      <p>{data.stages[1].name}</p>
                      <Image src={data.stages[1].image} alt="レギュラーマッチステージ画像2" width={240} height={135} />
                    </div>
                  )
                } else {
                  return null;
                }
              })}
            </div>
          </>
          : null
        }
        <div className="col-span-3 flex flex-col items-center">
          <input id="file-input" className="mb-2" type="file" accept="image/*" name="myImage" onChange={uploadToClient} />
          {createObjectURL ?
            <>
              <Cropper
                src={createObjectURL}
                style={{ height: 720, width: "80%" }}
                // Cropper.js options
                initialAspectRatio={9 / 16}
                guides={true}
                ref={cropperRef}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}

              />
              <button className="" onClick={getCropData}>選択範囲で反映</button>
              <button className="" onClick={handleClose}>キャンセル</button>
            </>
            : null
          }
        </div>
      </div>
    </>
  )
}
export default Index;