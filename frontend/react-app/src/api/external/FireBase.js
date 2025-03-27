import FireBaseConfig from "./FireBaseConfig";
import {initializeApp} from "firebase/app";
import {deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes} from "firebase/storage";

export default class FireBase {
    static async uploadAvatar(file, userId) {
        const app = initializeApp(FireBaseConfig.getConfig);
        const storage = getStorage(app);
        const storageRef = ref(storage, `images/user:${userId}/avatars/${file.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            return await getDownloadURL(snapshot.ref)
        } catch (ex) {
            throw new Error(ex);
        }
    }

    static async deleteAvatar(userId) {
        const app = initializeApp(FireBaseConfig.getConfig);
        const storage = getStorage(app);
        const folderRef = ref(storage, `images/${userId}`);
        const files = await listAll(folderRef);

        try {
            await Promise.all(files.items.map(async (item) => {
                await deleteObject(item);
            }));
        } catch (error) {
            console.error("Ошибка при удалении файлов:", error);
        }
    }
    static base64ToFile = (base64String, fileName) => {
        const arr = base64String.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], fileName, { type: mime });
    };
}