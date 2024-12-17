import { useEffect } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import "firebase/messaging";
import { firebaseConfig } from "@/constants";

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);
export const requestPermission = async () => {
    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const currentToken = await getToken(messaging, {
                vapidKey:
                    "BAVbj6mHLpP9E-biKy0gktLVJ6V3cnaE6vWYE6sUdMPErqkBcqqrHn11fraMkjc7nxS6RiYwFKHKi21UEtWXizM",
            });

            if (currentToken) {
                return currentToken; // Trả về mã thông báo
            } else {
                console.log(
                    "No registration token available. Request permission to generate one."
                );
                return null; // Trả về null nếu không có mã thông báo
            }
        } else {
            console.log("Notification permission denied.");
            return null; // Trả về null nếu quyền bị từ chối
        }
    } catch (error) {
        console.error("Unable to get permission to notify.", error);
        return null; // Trả về null trong trường hợp xảy ra lỗi
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
