import ImageKit from "imagekit-javascript";

export class UploadFilesService {
    static async upload(setLoading, file, onUploadFinished) {
        const imagekit = new ImageKit({
            publicKey: "public_67S01h6rtMzxVM3CiDRS7OU4d0k=",
            urlEndpoint: "https://ik.imagekit.io/kodb5krduls",
            authenticationEndpoint: "http://localhost:8000/upload/auth",
        });

        setLoading(true);
        await imagekit.upload(
            {
                file: file,
                fileName: file.name,
                folder: "gatepass",
                useUniqueFileName: true,
            },
            onUploadFinished
        );
    }
}

export default new UploadFilesService();