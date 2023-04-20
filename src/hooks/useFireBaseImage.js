import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";

import { useState } from "react";

export default function useFireBaseImage(setValue, getValues, imageName = null, cb = null) {
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState("");
    if (!setValue || !getValues) return;
    //upload hình ảnh lên firebase có trả về đường dẫn hình ảnh
    const handleUploadImage = (file) => {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progressPercent); //tiến độ tải ảnh
                // eslint-disable-next-line default-case
                switch (snapshot.state) {
                    case "paused":
                        break;
                    case "running":
                        break;
                }
            },
            (error) => {
                console.log(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //trả về đường dẫn hình ảnh
                    //console.log("File available at", downloadURL);
                    setImage(downloadURL);
                });
            }
        );
    };

    //khi chọn hình ảnh trong input thì sẽ chạy vào đây
    const handleSelectImage = (e) => {
        const file = e.target.files[0]; //lấy ra obj file chứa thông tin hình ảnh
        if (!file) return;
        setValue("image_name", file.name); //values.image_name=file
        handleUploadImage(file);
    };

    //xoá hình ảnh
    const handleDeleteImage = () => {
        const storage = getStorage();

        const imageRef = ref(storage, "images/" + (imageName || getValues("image_name"))); //lấy ra dường dẫn hình ảnh cần xoá

        deleteObject(imageRef)
            .then(() => {
                setImage("");
                setProgress(0);
                cb && cb(); //khi xoá sẽ set image là rỗng
            })
            .catch((error) => {
                console.log("Can not delete image");
                console.log(error);
                setImage("");
            });
    };
    return {
        progress,
        setProgress,
        image,
        setImage,
        handleSelectImage,
        handleDeleteImage,
    };
}
